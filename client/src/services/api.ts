import type { Ingredient, Recipe, Supplier, User, LoginCredentials, RegisterData, InventoryItem, InventoryValue, RecipeOptimizationResult } from '../types';
import { saveToOffline, getFromOffline, addPendingAction, getPendingActions, removePendingAction, isOffline, clearCachedData, type OfflineStoreName, type PendingAction } from './offlineStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// --- Global error toast (event-based, consumed by useToast) ---

export type ApiToastEvent = { message: string; type: 'error' | 'info' | 'success' };
type ApiToastListener = (event: ApiToastEvent) => void;
const apiToastListeners: Set<ApiToastListener> = new Set();

/** Subscribe to API-level toast events (used by ToastProvider) */
export function onApiToast(listener: ApiToastListener): () => void {
  apiToastListeners.add(listener);
  return () => { apiToastListeners.delete(listener); };
}

function emitToast(message: string, type: ApiToastEvent['type'] = 'error') {
  apiToastListeners.forEach(fn => fn({ message, type }));
}

/** French user-friendly messages by HTTP status */
const STATUS_MESSAGES: Record<number, string> = {
  401: 'Session expiree — reconnectez-vous',
  403: 'Acces refuse',
  404: 'Ressource introuvable',
  429: 'Trop de requetes — reessayez dans 1 minute',
  500: 'Erreur serveur — reessayez plus tard',
  502: 'Erreur serveur — reessayez plus tard',
  503: 'Erreur serveur — reessayez plus tard',
};

const NETWORK_ERROR_MSG = 'Connexion perdue — verifiez votre internet';

// --- Retry logic for GET requests ---

/** Status codes that should trigger a retry for GET requests */
const RETRYABLE_STATUSES = new Set([500, 502, 503]);
const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 1;

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  const isGet = !options.method || options.method === 'GET';
  try {
    const res = await fetch(url, options);
    if (isGet && RETRYABLE_STATUSES.has(res.status) && retries > 0) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      return fetchWithRetry(url, options, retries - 1);
    }
    return res;
  } catch (err) {
    // Network error — retry once for GET requests
    if (isGet && retries > 0) {
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

// --- In-memory GET cache (60s TTL) ---

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 60 seconds

/** Paths that should never be cached */
function shouldSkipCache(url: string): boolean {
  return url.includes('/auth/') || url.includes('/ai/');
}

/** Build a stable cache key from URL + params */
function buildCacheKey(url: string, params?: Record<string, string>): string {
  if (!params) return url;
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return `${url}?${sorted}`;
}

/** Read from GET cache if still fresh */
function getFromCache<T>(key: string): T | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    apiCache.delete(key);
    return null;
  }
  return entry.data as T;
}

/** Write to GET cache */
function setCache(key: string, data: unknown): void {
  apiCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Invalide le cache GET apres une ecriture.
 * FIX 2026-09-25 : seul le prefixe de la ressource ecrite etait invalide ; or une
 * ecriture sur /api/ingredients change aussi les marges servies par
 * /api/recipes, qui restaient perimees jusqu'a 60 s. Les ecritures sont rares
 * devant les lectures : on vide tout, c'est toujours juste.
 */
function invalidateCacheByPath(_url: string): void {
  apiCache.clear();
}

/**
 * Cle du cache memoire : l'URL ET le restaurant actif. Indexe par l'URL seule, le
 * cache servait les donnees d'un restaurant apres un changement de restaurant.
 */
function cleCache(url: string): string {
  return `${getActiveRestaurantId() || '-'}|${url}`;
}

/** Cached GET: check in-memory cache, fetch if miss, store result */
async function cachedGet<T>(url: string, options: RequestInit): Promise<T> {
  if (!shouldSkipCache(url)) {
    const hit = getFromCache<T>(cleCache(url));
    if (hit !== null) return hit;
  }
  let res: Response;
  try {
    res = await fetchWithRetry(url, options);
  } catch {
    emitToast(NETWORK_ERROR_MSG, 'error');
    throw new Error(NETWORK_ERROR_MSG);
  }
  const data = await handleResponse<T>(res);
  if (!shouldSkipCache(url)) {
    setCache(cleCache(url), data);
  }
  return data;
}

// --- Offline-aware helpers ---

/** Map URL paths to IndexedDB store names for caching */
function urlToStore(url: string): OfflineStoreName | null {
  if (url.includes('/ingredients')) return 'ingredients';
  if (url.includes('/recipes')) return 'recipes';
  if (url.includes('/suppliers')) return 'suppliers';
  if (url.includes('/inventory')) return 'inventory';
  return null;
}

/** Wrap a GET fetch: in-memory cache (60s) + IndexedDB fallback on network error */
async function offlineAwareGet<T>(url: string, options: RequestInit): Promise<T> {
  // Check in-memory cache first (skip for auth/ai paths)
  if (!shouldSkipCache(url)) {
    const cached = getFromCache<T>(cleCache(url));
    if (cached !== null) return cached;
  }

  const store = urlToStore(url);
  try {
    const res = await fetchWithRetry(url, options);
    const data = await handleResponse<T>(res);
    // Write to in-memory cache
    if (!shouldSkipCache(url)) {
      setCache(cleCache(url), data);
    }
    // Cache list responses (arrays only) in IndexedDB
    if (store && Array.isArray(data)) {
      saveToOffline(store, data).catch(() => {});
    }
    return data;
  } catch (err) {
    // Network error — try to return cached data
    if (store) {
      const offlineCached = await getFromOffline(store);
      if (offlineCached.length > 0) {
        emitToast(NETWORK_ERROR_MSG, 'error');
        return offlineCached as unknown as T;
      }
    }
    emitToast(NETWORK_ERROR_MSG, 'error');
    throw err;
  }
}

/** Wrap a write fetch (POST/PUT/DELETE): queue if offline, invalidate cache on success */
async function offlineAwareWrite<T>(url: string, options: RequestInit): Promise<T> {
  if (isOffline()) {
    // Mise en file pour rejeu au retour du reseau (rejouerFileHorsLigne). Le jeton
    // et le jeton CSRF ne sont PAS stockes : ils sont reconstruits au rejeu (ils
    // peuvent avoir change, et un jeton n'a rien a faire dans IndexedDB). Le
    // restaurant d'origine, lui, est garde.
    const entetes = { ...(options.headers as Record<string, string> | undefined) };
    delete entetes['Authorization'];
    delete entetes['X-CSRF-Token'];
    await addPendingAction({
      timestamp: Date.now(),
      method: (options.method || 'POST') as 'POST' | 'PUT' | 'DELETE',
      url,
      body: options.body as string | undefined,
      headers: entetes,
    });
    throw new Error('Hors ligne : modification enregistrée sur cet appareil. Elle sera envoyée automatiquement au retour du réseau.');
  }
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch {
    emitToast(NETWORK_ERROR_MSG, 'error');
    throw new Error(NETWORK_ERROR_MSG);
  }
  const data = await handleResponse<T>(res);
  // Invalidate in-memory GET cache for the same resource path
  invalidateCacheByPath(url);
  return data;
}

// --- Rejeu de la file hors ligne ---

export interface BilanRejeu { appliquees: number; refusees: number; restantes: number }
let rejeuEnCours: Promise<BilanRejeu> | null = null;

/** Nombre d'ecritures faites hors ligne qui attendent le reseau. */
export async function compterFileHorsLigne(): Promise<number> {
  try { return (await getPendingActions()).length; } catch { return 0; }
}

/**
 * Rejoue, dans l'ordre, les ecritures faites hors ligne.
 *
 * FIX 2026-09-25 : la file etait remplie mais JAMAIS relue (aucun appelant de
 * getPendingActions), alors que le message promettait une synchronisation
 * automatique ; et la barre « Synchroniser » vidait une autre file, que rien
 * n'ecrivait, sans rien envoyer.
 * - en-tetes reconstruits (jeton et CSRF du moment), restaurant d'ORIGINE garde ;
 * - 2xx : appliquee, retiree de la file ;
 * - autre 4xx : definitivement refusee par le serveur, retiree et signalee ;
 * - 401, 5xx ou reseau : on s'arrete et on garde la suite (l'ordre compte).
 */
export function rejouerFileHorsLigne(): Promise<BilanRejeu> {
  if (rejeuEnCours) return rejeuEnCours;
  rejeuEnCours = (async () => {
    let appliquees = 0;
    let refusees = 0;
    let actions: PendingAction[] = [];
    try { actions = await getPendingActions(); } catch { /* IndexedDB indisponible */ }
    for (const a of actions) {
      if (isOffline() || !getToken()) break;
      const headers = authHeaders();
      const restaurantOrigine = a.headers?.['X-Restaurant-Id'];
      if (restaurantOrigine) headers['X-Restaurant-Id'] = restaurantOrigine;
      let res: Response;
      try {
        res = await fetch(a.url, { method: a.method, headers, body: a.body });
      } catch {
        break; // reseau retombe : on reessaiera
      }
      if (res.ok) {
        appliquees++;
        if (a.id != null) await removePendingAction(a.id).catch(() => {});
        continue;
      }
      if (res.status === 401 || res.status >= 500) break;
      refusees++;
      if (a.id != null) await removePendingAction(a.id).catch(() => {});
    }
    if (appliquees > 0) {
      apiCache.clear();
      emitToast(`${appliquees} modification${appliquees > 1 ? 's' : ''} faite${appliquees > 1 ? 's' : ''} hors ligne envoyée${appliquees > 1 ? 's' : ''}`, 'success');
    }
    if (refusees > 0) {
      emitToast(`${refusees} modification${refusees > 1 ? 's' : ''} faite${refusees > 1 ? 's' : ''} hors ligne refusée${refusees > 1 ? 's' : ''} par le serveur`, 'error');
    }
    return { appliquees, refusees, restantes: await compterFileHorsLigne() };
  })().finally(() => { rejeuEnCours = null; });
  return rejeuEnCours;
}

// --- Token Management ---

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeToken(): void {
  localStorage.removeItem('token');
}

/**
 * Deconnexion cote serveur + purge des caches de reponses API du compte.
 *
 * FIX 2026-09-25 : la deconnexion ne faisait que vider le localStorage. Le jeton
 * restait valide 7 jours, le cookie httpOnly aussi (le JS ne peut pas
 * l'effacer : seul le serveur le peut), et les caches de reponses servaient les
 * donnees de l'ancien compte au suivant sur le meme appareil.
 * A appeler AVANT removeToken() : les en-tetes sont lus a l'appel.
 * keepalive : la requete survit a une navigation qui decharge la page.
 */
export async function logoutServer(): Promise<void> {
  const requete = fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    keepalive: true,
  }).catch(() => { /* hors ligne : le nettoyage local a lieu quand meme */ });
  apiCache.clear();
  try { if ('caches' in window) await caches.delete('api-get-cache'); } catch { /* navigateur sans Cache API */ }
  try { await clearCachedData(); } catch { /* IndexedDB indisponible */ }
  await requete;
}

// --- CSRF Token Management (Double-Submit Cookie Pattern) ---

/** CSRF token stored in memory (more reliable than cookies on Vercel) */
let csrfTokenInMemory: string | null = null;
let csrfTokenPromise: Promise<string> | null = null;

/** Read the csrf_token cookie value set by the server */
function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function ensureCsrfToken(): Promise<string> {
  // Check memory first, then cookie
  if (csrfTokenInMemory) return csrfTokenInMemory;
  const fromCookie = getCsrfTokenFromCookie();
  if (fromCookie) { csrfTokenInMemory = fromCookie; return fromCookie; }

  // Avoid multiple parallel fetches
  if (csrfTokenPromise) return csrfTokenPromise;

  csrfTokenPromise = fetch(`${API_BASE}/csrf-token`, { credentials: 'include' })
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch CSRF token');
      const data = await res.json();
      csrfTokenInMemory = data.csrfToken as string;
      csrfTokenPromise = null;
      return csrfTokenInMemory;
    })
    .catch((err) => {
      csrfTokenPromise = null;
      throw err;
    });

  return csrfTokenPromise;
}

// Pre-fetch CSRF token on module load (non-blocking)
ensureCsrfToken().catch(() => {});

// --- Restaurant ID Management ---

export function getActiveRestaurantId(): string | null {
  return localStorage.getItem('activeRestaurantId');
}

export function setActiveRestaurantId(id: number | string): void {
  localStorage.setItem('activeRestaurantId', String(id));
}

export function removeActiveRestaurantId(): void {
  localStorage.removeItem('activeRestaurantId');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const restaurantId = getActiveRestaurantId();
  if (restaurantId) {
    headers['X-Restaurant-Id'] = restaurantId;
  }
  // Include CSRF token (memory first, then cookie)
  const csrfToken = csrfTokenInMemory || getCsrfTokenFromCookie();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  return headers;
}

// --- Restaurant API ---

export interface RestaurantResponse {
  id: number;
  name: string;
  address: string | null;
  cuisineType: string | null;
  phone: string | null;
  coversPerDay: number;
  ownerId: number;
  role?: string;
  _count?: { ingredients: number; recipes: number; suppliers: number };
}

export async function fetchRestaurants(): Promise<RestaurantResponse[]> {
  return cachedGet<RestaurantResponse[]>(`${API_BASE}/restaurants`, { headers: authHeaders() });
}

export async function createRestaurantAPI(data: { name: string; address?: string; cuisineType?: string; phone?: string; coversPerDay?: number }): Promise<RestaurantResponse> {
  const url = `${API_BASE}/restaurants`;
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse<RestaurantResponse>(res);
  invalidateCacheByPath(url);
  return result;
}

export async function updateRestaurantAPI(id: number, data: Partial<{ name: string; address: string; cuisineType: string; phone: string; coversPerDay: number }>): Promise<RestaurantResponse> {
  const url = `${API_BASE}/restaurants/${id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse<RestaurantResponse>(res);
  invalidateCacheByPath(url);
  return result;
}

export async function deleteRestaurantAPI(id: number): Promise<void> {
  const url = `${API_BASE}/restaurants/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const result = await handleResponse<void>(res);
  invalidateCacheByPath(url);
  return result;
}

export interface RestaurantOverviewStat {
  id: number;
  name: string;
  cuisineType: string | null;
  coversPerDay: number;
  recipeCount: number;
  ingredientCount: number;
  revenue: number;
  foodCost: number;
  marginAmount: number;
  marginPercent: number;
  foodCostPercent: number;
}

export interface RestaurantOverview {
  restaurants: RestaurantOverviewStat[];
  totals: {
    totalRecipes: number;
    totalIngredients: number;
    totalRevenue: number;
    totalFoodCost: number;
    totalMarginAmount: number;
    avgMarginPercent: number;
    avgFoodCostPercent: number;
  };
}

export async function fetchRestaurantsOverview(): Promise<RestaurantOverview> {
  return cachedGet<RestaurantOverview>(`${API_BASE}/restaurants/overview`, { headers: authHeaders() });
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    // FIX 2026-09-18 : cette redirection etait inconditionnelle. Un 401 recu sans
    // session ouverte (visiteur anonyme, ou token deja expire au 1er chargement)
    // ejectait donc le visiteur d'une page publique vers /login, et court-circuitait
    // le catch de checkAuth() qui devait juste nettoyer en silence.
    // On ne redirige plus que pour ce que ce message annonce vraiment : une session
    // qui EXISTAIT et vient d'expirer.
    const hadSession = !!getToken();
    removeToken();
    if (!hadSession) throw new Error('Non authentifie');
    emitToast('Votre session a expire', 'error');
    window.location.href = '/login';
    throw new Error('Session expiree');
  }
  if (!res.ok) {
    const friendlyMsg = STATUS_MESSAGES[res.status];
    const body = await res.json().catch(() => ({}));
    // Un 429 peut etre le quota IA MENSUEL, dont le message serveur dit quoi faire :
    // le remplacer par « reessayez dans 1 minute » envoyait l'utilisateur reessayer en vain.
    const errorMsg = (res.status === 429 && body.error) || friendlyMsg || body.error || 'Erreur serveur';
    emitToast(errorMsg, 'error');
    throw new Error(errorMsg);
  }
  return res.json();
}

// --- Auth ---

export async function login(credentials: LoginCredentials): Promise<{ token: string; user: User; restaurant?: { id: number } }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MSG);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erreur de connexion');
  }
  return res.json();
}

export async function register(data: RegisterData): Promise<{ token: string; user: User; restaurant?: { id: number } }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MSG);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Erreur lors de l'inscription");
  }
  return res.json();
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse<User>(res);
}

export async function checkFirstUser(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/first-user`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.isFirstUser;
  } catch {
    return false;
  }
}

// --- AI Chat ---

export async function sendAIMessage(message: string): Promise<{ response: string; usage?: { input_tokens: number; output_tokens: number } }> {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ message }),
  });
  return handleResponse(res);
}

// --- Alerts ---

export interface AlertItem {
  type: 'stock' | 'margin' | 'price';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
}

export async function fetchAlerts(): Promise<{ alerts: AlertItem[]; count: number }> {
  return cachedGet<{ alerts: AlertItem[]; count: number }>(`${API_BASE}/alerts`, { headers: authHeaders() });
}

// --- Ingredients ---

export async function fetchIngredients(): Promise<Ingredient[]> {
  return offlineAwareGet<Ingredient[]>(`${API_BASE}/ingredients`, { headers: authHeaders() });
}

// Historique des prix. FIX 2026-09-25 : les trois appels de la page Ingredients
// construisaient leurs en-tetes a la main, sans X-Restaurant-Id ; la route
// (authWithRestaurant) repondait 400 a chaque fois, et le client transformait ce
// 400 en tableau vide : courbes et suivi des prix morts pour tous, sans erreur
// visible. Sans ingredientId, la route renvoie les lignes brutes du restaurant ;
// avec, un objet { data, minPrice, ... }. Pas de toast ici : les appelants
// chargent souvent en arriere-plan et decident eux-memes quoi afficher.
export async function fetchPriceHistory<T = unknown>(params: { ingredientId?: number; period?: number }): Promise<T> {
  const qs = new URLSearchParams();
  if (params.ingredientId != null) qs.set('ingredientId', String(params.ingredientId));
  if (params.period != null) qs.set('period', String(params.period));
  const res = await fetch(`${API_BASE}/price-history?${qs.toString()}`, { headers: authHeaders() });
  if (res.status === 401) return handleResponse<T>(res);
  if (!res.ok) throw new Error(`Historique des prix indisponible (HTTP ${res.status})`);
  return res.json();
}

export async function createIngredient(data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient> {
  return offlineAwareWrite<Ingredient>(`${API_BASE}/ingredients`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateIngredient(id: number, data: Partial<Ingredient>): Promise<Ingredient> {
  return offlineAwareWrite<Ingredient>(`${API_BASE}/ingredients/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteIngredient(id: number): Promise<void> {
  return offlineAwareWrite<void>(`${API_BASE}/ingredients/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// --- Recipes ---

export async function fetchRecipes(): Promise<Recipe[]> {
  return offlineAwareGet<Recipe[]>(`${API_BASE}/recipes`, { headers: authHeaders() });
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  return cachedGet<Recipe>(`${API_BASE}/recipes/${id}`, { headers: authHeaders() });
}

export async function createRecipe(data: {
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  description?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  laborCostPerHour?: number;
  ingredients: { ingredientId: number; quantity: number; wastePercent?: number }[];
}): Promise<Recipe> {
  return offlineAwareWrite<Recipe>(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateRecipe(id: number, data: {
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  description?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  laborCostPerHour?: number;
  ingredients: { ingredientId: number; quantity: number; wastePercent?: number }[];
}): Promise<Recipe> {
  return offlineAwareWrite<Recipe>(`${API_BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteRecipe(id: number): Promise<void> {
  return offlineAwareWrite<void>(`${API_BASE}/recipes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function cloneRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}/clone`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<Recipe>(res);
}

export async function optimizeRecipeCost(recipeId: number): Promise<RecipeOptimizationResult> {
  const res = await fetch(`${API_BASE}/ai/optimize-recipe`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ recipeId }),
  });
  return handleResponse<RecipeOptimizationResult>(res);
}

// --- AI Allergen & Nutrition ---

export interface AllergenCheckResult {
  recipeName: string;
  allergens: Array<{
    name: string;
    status: 'present' | 'absent' | 'trace';
    source: string | null;
    riskLevel: 'certain' | 'probable' | 'trace possible' | null;
  }>;
  crossContamination: Array<{
    allergen: string;
    risk: string;
    source: string;
  }>;
  recommendation: string;
}

export interface NutritionEstimateResult {
  recipeName: string;
  nbPortions: number;
  perPortion: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  healthScore: number;
  dietaryLabels: string[];
  analysis: string;
}

export interface AllergenMatrixResult {
  allergens: string[];
  recipes: Array<{
    id: number;
    name: string;
    category: string;
    allergens: Record<string, { present: boolean; sources: string[] }>;
  }>;
}

export async function checkAllergens(recipeId: number): Promise<AllergenCheckResult> {
  const res = await fetch(`${API_BASE}/ai/allergen-check`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ recipeId }),
  });
  return handleResponse<AllergenCheckResult>(res);
}

export async function estimateNutrition(recipeId: number): Promise<NutritionEstimateResult> {
  const res = await fetch(`${API_BASE}/ai/nutrition-estimate`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ recipeId }),
  });
  return handleResponse<NutritionEstimateResult>(res);
}

export async function fetchAllergenMatrix(): Promise<AllergenMatrixResult> {
  const res = await fetch(`${API_BASE}/ai/allergen-matrix`, {
    headers: authHeaders(),
  });
  return handleResponse<AllergenMatrixResult>(res);
}

// --- Recipe Photos & Sharing ---

export async function addRecipePhoto(recipeId: number, photo: string): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${recipeId}/photo`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ photo }),
  });
  return handleResponse<Recipe>(res);
}

export async function deleteRecipePhoto(recipeId: number, photoIndex: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${recipeId}/photo/${photoIndex}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<Recipe>(res);
}

export async function getRecipeShareLink(recipeId: number): Promise<{ token: string; url: string }> {
  const res = await fetch(`${API_BASE}/recipes/${recipeId}/share`, { headers: authHeaders() });
  return handleResponse<{ token: string; url: string }>(res);
}

export async function fetchPublicRecipe(token: string): Promise<any> {
  const res = await fetch(`${API_BASE}/public/recipe/${token}`);
  return handleResponse<any>(res);
}

// --- Suppliers ---

export async function fetchSuppliers(): Promise<Supplier[]> {
  return offlineAwareGet<Supplier[]>(`${API_BASE}/suppliers`, { headers: authHeaders() });
}

export async function fetchSupplier(id: number): Promise<Supplier> {
  return cachedGet<Supplier>(`${API_BASE}/suppliers/${id}`, { headers: authHeaders() });
}

export async function createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'ingredients'>): Promise<Supplier> {
  return offlineAwareWrite<Supplier>(`${API_BASE}/suppliers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
  return offlineAwareWrite<Supplier>(`${API_BASE}/suppliers/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteSupplier(id: number): Promise<void> {
  return offlineAwareWrite<void>(`${API_BASE}/suppliers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

export async function linkSupplierIngredients(id: number): Promise<{ linked: number; supplierName: string }> {
  const res = await fetch(`${API_BASE}/suppliers/${id}/link-ingredients`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<{ linked: number; supplierName: string }>(res);
}

export interface SupplierScoreBreakdown {
  supplierId: number;
  supplierName: string;
  scores: {
    fiabilite: number;
    competitivite: number;
    diversite: number;
    historique: number;
    global: number;
  };
  details?: {
    totalOrders: number;
    completedOrders: number;
    priceComparisons: number;
    betterPriceCount: number;
    supplierIngredientCount: number;
    totalUniqueIngredients: number;
    monthsSinceCreation: number;
  };
  estimatedScores?: string[];
  note?: string | null;
  recommendation?: string;
}

export async function fetchSupplierScore(id: number): Promise<SupplierScoreBreakdown> {
  return cachedGet<SupplierScoreBreakdown>(`${API_BASE}/suppliers/${id}/score`, { headers: authHeaders() });
}

export async function fetchAllSupplierScores(): Promise<SupplierScoreBreakdown[]> {
  return cachedGet<SupplierScoreBreakdown[]>(`${API_BASE}/suppliers/scores/all`, { headers: authHeaders() });
}

export interface ImportPricesResult {
  updated: number;
  updatedNames: string[];
  notFound: string[];
  errors: string[];
}

export async function importSupplierPrices(supplierId: number, csvText: string): Promise<ImportPricesResult> {
  const res = await fetch(`${API_BASE}/suppliers/${supplierId}/import-prices`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ csv: csvText }),
  });
  return handleResponse<ImportPricesResult>(res);
}

// --- Inventory ---

export async function fetchInventory(): Promise<InventoryItem[]> {
  return offlineAwareGet<InventoryItem[]>(`${API_BASE}/inventory`, { headers: authHeaders() });
}

export async function fetchInventoryAlerts(): Promise<InventoryItem[]> {
  return cachedGet<InventoryItem[]>(`${API_BASE}/inventory/alerts`, { headers: authHeaders() });
}

export async function fetchInventoryValue(): Promise<InventoryValue> {
  return cachedGet<InventoryValue>(`${API_BASE}/inventory/value`, { headers: authHeaders() });
}

export async function fetchInventorySuggestions(): Promise<Ingredient[]> {
  const res = await fetch(`${API_BASE}/inventory/suggest`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<Ingredient[]>(res);
}

export async function addToInventory(data: {
  ingredientId: number;
  currentStock?: number;
  unit?: string;
  minStock?: number;
  maxStock?: number | null;
  notes?: string;
}): Promise<InventoryItem> {
  return offlineAwareWrite<InventoryItem>(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateInventoryItem(id: number, data: Partial<{
  currentStock: number;
  minStock: number;
  maxStock: number | null;
  unit: string;
  notes: string;
}>): Promise<InventoryItem> {
  return offlineAwareWrite<InventoryItem>(`${API_BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function restockInventoryItem(id: number, quantity: number): Promise<InventoryItem> {
  return offlineAwareWrite<InventoryItem>(`${API_BASE}/inventory/${id}/restock`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
}

export async function deleteInventoryItem(id: number): Promise<void> {
  return offlineAwareWrite<void>(`${API_BASE}/inventory/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// --- Auto-Reorder ---

export interface AutoReorderItem {
  ingredientId: number;
  ingredient: string;
  currentStock: number;
  minQuantity: number;
  unit: string;
  suggestedQty: number;
  estimatedCost: number;
}

export interface AutoReorderGroup {
  supplierId: number | null;
  supplier: string;
  items: AutoReorderItem[];
  totalCost: number;
}

export async function fetchAutoReorderSuggestions(): Promise<AutoReorderGroup[]> {
  return cachedGet<AutoReorderGroup[]>(`${API_BASE}/inventory/auto-reorder`, { headers: authHeaders() });
}

export async function confirmAutoReorder(orders: {
  supplier: string;
  supplierId?: number | null;
  items: { ingredientId: number; productName: string; quantity: number; unit: string; unitPrice: number }[];
}[]): Promise<{ orderIds: number[]; count: number }> {
  const res = await fetch(`${API_BASE}/inventory/auto-reorder/confirm`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ orders }),
  });
  return handleResponse<{ orderIds: number[]; count: number }>(res);
}

// --- Waste ---

export async function createWasteLog(data: {
  ingredientId: number;
  quantity: number;
  unit: string;
  reason: string;
  date: string;
  notes?: string;
}): Promise<unknown> {
  const res = await fetch(`${API_BASE}/waste`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<unknown>(res);
}

// --- Mercuriale ---

export interface MercurialeSearchResult {
  name: string;
  priceMin: number | null;
  priceMax: number | null;
  unit: string;
  supplier: string | null;
  trend: string | null;
  trendDetail: string | null;
  category: string | null;
}

export interface MercurialeSuggestedIngredient {
  name: string;
  quantity: number;
  unit: string;
  marketPrice: number | null;
  priceMin: number | null;
  priceMax: number | null;
  supplier: string | null;
  trend: string | null;
  trendDetail: string | null;
}

export async function searchMercuriale(q: string): Promise<MercurialeSearchResult[]> {
  const res = await fetch(`${API_BASE}/mercuriale/search?q=${encodeURIComponent(q)}`, { headers: authHeaders() });
  return handleResponse<MercurialeSearchResult[]>(res);
}

export async function suggestMercurialeIngredients(recipeName: string): Promise<{ ingredients: MercurialeSuggestedIngredient[] }> {
  const res = await fetch(`${API_BASE}/mercuriale/suggest?q=${encodeURIComponent(recipeName)}`, { headers: authHeaders() });
  return handleResponse<{ ingredients: MercurialeSuggestedIngredient[] }>(res);
}
