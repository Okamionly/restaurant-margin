/**
 * @file tests/rejeu-hors-ligne.test.ts
 * Les ecritures faites hors ligne doivent partir au retour du reseau.
 *
 * Constat du 2026-09-25 : la file IndexedDB etait remplie mais jamais relue
 * (aucun appelant de getPendingActions), alors que l'application promettait
 * « Elle sera synchronisee automatiquement ». Et le jeton etait stocke avec
 * chaque action.
 *
 * Environnement node : on simule localStorage, document, navigator et fetch, et
 * on remplace le module IndexedDB par une file en memoire.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

const file = vi.hoisted(() => ({
  actions: [] as any[],
  enLigne: true,
  appels: [] as Array<{ url: string; init: any }>,
  reponses: [] as number[],
}));

vi.mock('../client/src/services/offlineStore', () => ({
  saveToOffline: vi.fn(async () => {}),
  getFromOffline: vi.fn(async () => []),
  clearCachedData: vi.fn(async () => {}),
  addPendingAction: vi.fn(async (a: any) => { file.actions.push({ ...a, id: file.actions.length + 1 }); }),
  getPendingActions: vi.fn(async () => file.actions.map((a) => ({ ...a }))),
  removePendingAction: vi.fn(async (id: number) => { file.actions = file.actions.filter((a) => a.id !== id); }),
  isOffline: () => !file.enLigne,
}));

const stockage = new Map<string, string>();

beforeAll(() => {
  (globalThis as any).localStorage = {
    getItem: (k: string) => (stockage.has(k) ? stockage.get(k)! : null),
    setItem: (k: string, v: string) => { stockage.set(k, String(v)); },
    removeItem: (k: string) => { stockage.delete(k); },
  };
  (globalThis as any).document = { cookie: '' };
  (globalThis as any).window = globalThis;
  (globalThis as any).fetch = vi.fn(async (url: string, init: any) => {
    if (String(url).includes('/csrf-token')) {
      return new Response(JSON.stringify({ csrfToken: 'csrf-du-moment' }), { status: 200 });
    }
    file.appels.push({ url: String(url), init });
    const statut = file.reponses.shift() ?? 200;
    return new Response(JSON.stringify(statut < 300 ? { id: 1 } : { error: 'refus' }), { status: statut });
  });
});

beforeEach(() => {
  file.actions = [];
  file.appels = [];
  file.reponses = [];
  file.enLigne = true;
  stockage.clear();
  stockage.set('token', 'jeton-actuel');
  stockage.set('activeRestaurantId', '7');
});

describe('file des ecritures hors ligne', () => {
  it("met l'ecriture en file SANS le jeton, avec le restaurant d'origine", async () => {
    const api = await import('../client/src/services/api');
    file.enLigne = false;
    await expect(api.updateIngredient(5, { name: 'Beurre' } as any)).rejects.toThrow(/envoy/);
    expect(file.actions).toHaveLength(1);
    expect(file.actions[0].headers?.Authorization).toBeUndefined();
    expect(file.actions[0].headers?.['X-Restaurant-Id']).toBe('7');
  });

  it("rejoue dans l'ordre avec le jeton du moment et le restaurant d'origine", async () => {
    const api = await import('../client/src/services/api');
    file.actions = [
      { id: 1, method: 'PUT', url: '/api/ingredients/5', body: '{}', headers: { 'X-Restaurant-Id': '3' }, timestamp: 1 },
      { id: 2, method: 'POST', url: '/api/recipes', body: '{}', headers: { 'X-Restaurant-Id': '3' }, timestamp: 2 },
    ];
    stockage.set('token', 'jeton-apres-reconnexion');
    const bilan = await api.rejouerFileHorsLigne();
    expect(bilan).toEqual({ appliquees: 2, refusees: 0, restantes: 0 });
    expect(file.appels.map((a) => a.url)).toEqual(['/api/ingredients/5', '/api/recipes']);
    expect(file.appels[0].init.headers.Authorization).toBe('Bearer jeton-apres-reconnexion');
    expect(file.appels[0].init.headers['X-Restaurant-Id']).toBe('3');
  });

  it("s'arrete sur une erreur serveur et garde la suite, dans l'ordre", async () => {
    const api = await import('../client/src/services/api');
    file.actions = [
      { id: 1, method: 'PUT', url: '/api/ingredients/5', body: '{}', headers: {}, timestamp: 1 },
      { id: 2, method: 'PUT', url: '/api/ingredients/6', body: '{}', headers: {}, timestamp: 2 },
    ];
    file.reponses = [503];
    const bilan = await api.rejouerFileHorsLigne();
    expect(bilan).toEqual({ appliquees: 0, refusees: 0, restantes: 2 });
    expect(file.appels).toHaveLength(1);
  });

  it('retire et signale une ecriture refusee par le serveur, puis continue', async () => {
    const api = await import('../client/src/services/api');
    file.actions = [
      { id: 1, method: 'PUT', url: '/api/ingredients/404', body: '{}', headers: {}, timestamp: 1 },
      { id: 2, method: 'PUT', url: '/api/ingredients/6', body: '{}', headers: {}, timestamp: 2 },
    ];
    file.reponses = [404, 200];
    const bilan = await api.rejouerFileHorsLigne();
    expect(bilan).toEqual({ appliquees: 1, refusees: 1, restantes: 0 });
  });
});
