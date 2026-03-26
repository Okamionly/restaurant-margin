import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://restaumargin.vercel.app';

const TOKEN_KEY = 'restaumargin_token';

// ---------- helpers ----------

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  return AsyncStorage.removeItem(TOKEN_KEY);
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ---------- auth ----------

export async function login(
  email: string,
  password: string,
): Promise<{ token: string; user: unknown }> {
  const data = await apiFetch<{ token: string; user: unknown }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
  await setToken(data.token);
  return data;
}

// ---------- recettes ----------

export async function getRecipes(): Promise<unknown[]> {
  return apiFetch<unknown[]>('/api/recipes');
}

// ---------- ingredients ----------

export async function getIngredients(): Promise<unknown[]> {
  return apiFetch<unknown[]>('/api/ingredients');
}

// ---------- inventaire ----------

export async function getInventory(): Promise<unknown[]> {
  return apiFetch<unknown[]>('/api/inventory');
}
