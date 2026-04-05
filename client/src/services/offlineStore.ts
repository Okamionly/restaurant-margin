// offlineStore.ts — IndexedDB wrapper for offline data caching
// Uses raw IndexedDB API (no external dependencies)

const DB_NAME = 'restaumargin-offline';
const DB_VERSION = 1;

// Stores that hold cached API responses
const DATA_STORES = ['recipes', 'ingredients', 'suppliers', 'inventory'] as const;
// Store for queued write operations
const PENDING_STORE = 'pendingActions';

export type OfflineStoreName = typeof DATA_STORES[number];

export interface PendingAction {
  id?: number;
  timestamp: number;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  body?: string;
  headers?: Record<string, string>;
}

// ---- Database initialization ----

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create data stores for cached API responses
      for (const storeName of DATA_STORES) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      }

      // Create store for pending write operations (auto-increment key)
      if (!db.objectStoreNames.contains(PENDING_STORE)) {
        db.createObjectStore(PENDING_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---- Data caching methods ----

/**
 * Bulk save records to an offline store (replaces all existing data).
 * Used to cache API GET responses.
 */
export async function saveToOffline(storeName: OfflineStoreName, data: any[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    // Clear existing data first, then add fresh data
    store.clear();
    for (const item of data) {
      if (item && item.id !== undefined) {
        store.put(item);
      }
    }

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/**
 * Get all records from an offline store.
 * Used as fallback when network requests fail.
 */
export async function getFromOffline(storeName: OfflineStoreName): Promise<any[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(request.result || []);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// ---- Pending actions queue (for offline writes) ----

/**
 * Queue a write operation (POST/PUT/DELETE) for later sync.
 */
export async function addPendingAction(action: Omit<PendingAction, 'id'>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, 'readwrite');
    const store = tx.objectStore(PENDING_STORE);
    store.add(action);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/**
 * Get all pending actions (ordered by insertion).
 */
export async function getPendingActions(): Promise<PendingAction[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, 'readonly');
    const store = tx.objectStore(PENDING_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(request.result || []);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

/**
 * Clear all pending actions after a successful sync.
 */
export async function clearPendingActions(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, 'readwrite');
    const store = tx.objectStore(PENDING_STORE);
    store.clear();

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

/**
 * Remove a single pending action by id (after individual sync).
 */
export async function removePendingAction(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PENDING_STORE, 'readwrite');
    const store = tx.objectStore(PENDING_STORE);
    store.delete(id);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ---- Connectivity helper ----

/**
 * Check if the browser is currently offline.
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}
