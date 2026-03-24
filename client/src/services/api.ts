import type { Ingredient, Recipe, Supplier, User, LoginCredentials, RegisterData, InventoryItem, InventoryValue } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
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

export async function login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
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

export async function register(data: RegisterData): Promise<{ token: string; user: User }> {
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

// --- Ingredients ---

export async function fetchIngredients(): Promise<Ingredient[]> {
  const res = await fetch(`${API_BASE}/ingredients`, { headers: authHeaders() });
  return handleResponse<Ingredient[]>(res);
}

export async function createIngredient(data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ingredient> {
  const res = await fetch(`${API_BASE}/ingredients`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Ingredient>(res);
}

export async function updateIngredient(id: number, data: Partial<Ingredient>): Promise<Ingredient> {
  const res = await fetch(`${API_BASE}/ingredients/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Ingredient>(res);
}

export async function deleteIngredient(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/ingredients/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  if (!res.ok) throw new Error('Erreur suppression ingrédient');
}

// --- Recipes ---

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recipes`, { headers: authHeaders() });
  return handleResponse<Recipe[]>(res);
}

export async function fetchRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}`, { headers: authHeaders() });
  return handleResponse<Recipe>(res);
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
  const res = await fetch(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Recipe>(res);
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
  const res = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Recipe>(res);
}

export async function deleteRecipe(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/recipes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  if (!res.ok) throw new Error('Erreur suppression recette');
}

export async function cloneRecipe(id: number): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}/clone`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<Recipe>(res);
}

// --- Suppliers ---

export async function fetchSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${API_BASE}/suppliers`, { headers: authHeaders() });
  return handleResponse<Supplier[]>(res);
}

export async function fetchSupplier(id: number): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, { headers: authHeaders() });
  return handleResponse<Supplier>(res);
}

export async function createSupplier(data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'ingredients'>): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/suppliers`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Supplier>(res);
}

export async function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Supplier>(res);
}

export async function deleteSupplier(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erreur suppression fournisseur');
  }
}

export async function linkSupplierIngredients(id: number): Promise<{ linked: number; supplierName: string }> {
  const res = await fetch(`${API_BASE}/suppliers/${id}/link-ingredients`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse<{ linked: number; supplierName: string }>(res);
}

// --- Inventory ---

export async function fetchInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory`, { headers: authHeaders() });
  return handleResponse<InventoryItem[]>(res);
}

export async function fetchInventoryAlerts(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory/alerts`, { headers: authHeaders() });
  return handleResponse<InventoryItem[]>(res);
}

export async function fetchInventoryValue(): Promise<InventoryValue> {
  const res = await fetch(`${API_BASE}/inventory/value`, { headers: authHeaders() });
  return handleResponse<InventoryValue>(res);
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
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<InventoryItem>(res);
}

export async function updateInventoryItem(id: number, data: Partial<{
  currentStock: number;
  minStock: number;
  maxStock: number | null;
  unit: string;
  notes: string;
}>): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<InventoryItem>(res);
}

export async function restockInventoryItem(id: number, quantity: number): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/${id}/restock`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  return handleResponse<InventoryItem>(res);
}

export async function deleteInventoryItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Non authentifié');
  }
  if (!res.ok) throw new Error('Erreur suppression inventaire');
}
