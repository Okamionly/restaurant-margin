/**
 * @file client/src/lib/clientsApi.ts
 * Typed fetch wrappers for /api/clients endpoints.
 * All requests include credentials (httpOnly cookie auth) and the
 * X-Restaurant-Id header required by authWithRestaurant middleware.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface CrmClient {
  id: number;
  restaurantId: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tags: string[];
  totalOrders: number;
  totalSpentEur: string; // Decimal serialised as string by Prisma
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmClientListMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CrmClientListResponse {
  data: CrmClient[];
  meta: CrmClientListMeta;
}

export interface CrmClientResponse {
  data: CrmClient;
}

export interface CreateClientPayload {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateClientPayload {
  name?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  tags?: string[];
  totalOrders?: number;
  totalSpentEur?: number;
  lastOrderAt?: string | null;
}

export interface ImportClientRow {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags?: string[];
}

export interface ImportResult {
  imported: number;
}

// ── Headers helper ─────────────────────────────────────────────────────────

function apiHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId') ?? '1';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'X-Restaurant-Id': restaurantId,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {
      // ignore parse error
    }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ── API functions ──────────────────────────────────────────────────────────

export async function listClients(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CrmClientListResponse> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString() ? `?${qs}` : '';
  const res = await fetch(`/api/clients${query}`, {
    credentials: 'include',
    headers: apiHeaders(),
  });
  return handleResponse<CrmClientListResponse>(res);
}

export async function getClient(id: number): Promise<CrmClientResponse> {
  const res = await fetch(`/api/clients/${id}`, {
    credentials: 'include',
    headers: apiHeaders(),
  });
  return handleResponse<CrmClientResponse>(res);
}

export async function createClient(payload: CreateClientPayload): Promise<CrmClientResponse> {
  const res = await fetch('/api/clients', {
    method: 'POST',
    credentials: 'include',
    headers: apiHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<CrmClientResponse>(res);
}

export async function updateClient(id: number, payload: UpdateClientPayload): Promise<CrmClientResponse> {
  const res = await fetch(`/api/clients/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: apiHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<CrmClientResponse>(res);
}

export async function deleteClient(id: number): Promise<void> {
  const res = await fetch(`/api/clients/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: apiHeaders(),
  });
  return handleResponse<void>(res);
}

export async function importClients(clients: ImportClientRow[]): Promise<ImportResult> {
  const res = await fetch('/api/clients/import', {
    method: 'POST',
    credentials: 'include',
    headers: apiHeaders(),
    body: JSON.stringify({ clients }),
  });
  return handleResponse<ImportResult>(res);
}
