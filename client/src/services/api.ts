import type { Ingredient, Recipe, Supplier, User, LoginCredentials, RegisterData, InventoryItem, InventoryValue, RecipeOptimizationResult } from '../types';
import { saveToOffline, getFromOffline, addPendingAction, isOffline, type OfflineStoreName } from './offlineStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

/** Invalidate all cache entries matching a base path (on write operations) */
function invalidateCacheByPath(url: string): void {
  // Extract the base resource path, e.g. /api/ingredients/5 -> /api/ingredients
  const basePath = url.replace(/\/\d+(?:\/.*)?$/, '');
  for (const key of apiCache.keys()) {
    if (key.startsWith(basePath)) {
      apiCache.delete(key);
    }
  }
}

/** Cached GET: check in-memory cache, fetch if miss, store result */
async function cachedGet<T>(url: string, options: RequestInit): Promise<T> {
  if (!shouldSkipCache(url)) {
    const hit = getFromCache<T>(url);
    if (hit !== null) return hit;
  }
  const res = await fetch(url, options);
  const data = await handleResponse<T>(res);
  if (!shouldSkipCache(url)) {
    setCache(url, data);
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
    const cached = getFromCache<T>(url);
    if (cached !== null) return cached;
  }

  const store = urlToStore(url);
  try {
    const res = await fetch(url, options);
    const data = await handleResponse<T>(res);
    // Write to in-memory cache
    if (!shouldSkipCache(url)) {
      setCache(url, data);
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
        return offlineCached as unknown as T;
      }
    }
    throw err;
  }
}

/** Wrap a write fetch (POST/PUT/DELETE): queue if offline, invalidate cache on success */
async function offlineAwareWrite<T>(url: string, options: RequestInit): Promise<T> {
  if (isOffline()) {
    // Queue the action for later sync
    await addPendingAction({
      timestamp: Date.now(),
      method: (options.method || 'POST') as 'POST' | 'PUT' | 'DELETE',
      url,
      body: options.body as string | undefined,
      headers: options.headers as Record<string, string> | undefined,
    });
    // Return a placeholder so the UI can continue
    throw new Error('Action enregistrée hors-ligne. Elle sera synchronisée automatiquement.');
  }
  const res = await fetch(url, options);
  const data = await handleResponse<T>(res);
  // Invalidate in-memory GET cache for the same resource path
  invalidateCacheByPath(url);
  return data;
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
    removeToken();
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erreur serveur');
  }
  return res.json();
}

// --- Auth ---

export async function login(credentials: LoginCredentials): Promise<{ token: string; user: User; restaurant?: { id: number } }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erreur de connexion');
  }
  return res.json();
}

export async function register(data: RegisterData): Promise<{ token: string; user: User; restaurant?: { id: number } }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
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
  const res = await fetch(`${API_BASE}/auth/first-user`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.isFirstUser;
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
