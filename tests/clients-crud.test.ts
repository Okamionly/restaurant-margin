/**
 * @file tests/clients-crud.test.ts
 * Tests for the CRM Clients router — Wave 3.
 *
 * Covers:
 *   - GET  /api/clients  pagination + search
 *   - POST /api/clients  create
 *   - GET  /api/clients/:id  detail
 *   - PATCH /api/clients/:id  update
 *   - DELETE /api/clients/:id  soft delete
 *   - Tenant isolation: user A cannot read/write user B's clients
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { Decimal } from '@prisma/client/runtime/library';

// ── Prisma mock state ──────────────────────────────────────────────────────

interface MockClient {
  id: number;
  restaurantId: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tags: string[];
  totalOrders: number;
  totalSpentEur: Decimal;
  lastOrderAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const db: MockClient[] = [];
let nextId = 1;

const mockPrisma = {
  client: {
    count: vi.fn(async ({ where }: any) => {
      return db.filter((c) => {
        if (c.restaurantId !== where.restaurantId) return false;
        if (c.deletedAt !== null) return false;
        if (where.OR) {
          return where.OR.some((cond: any) => {
            if (cond.name?.contains) {
              return c.name.toLowerCase().includes(cond.name.contains.toLowerCase());
            }
            if (cond.email?.contains && c.email) {
              return c.email.toLowerCase().includes(cond.email.contains.toLowerCase());
            }
            return false;
          });
        }
        return true;
      }).length;
    }),
    findMany: vi.fn(async ({ where, skip = 0, take = 50 }: any) => {
      const filtered = db.filter((c) => {
        if (c.restaurantId !== where.restaurantId) return false;
        if (c.deletedAt !== null) return false;
        if (where.OR) {
          return where.OR.some((cond: any) => {
            if (cond.name?.contains) {
              return c.name.toLowerCase().includes(cond.name.contains.toLowerCase());
            }
            if (cond.email?.contains && c.email) {
              return c.email.toLowerCase().includes(cond.email.contains.toLowerCase());
            }
            return false;
          });
        }
        return true;
      });
      return filtered.sort((a, b) => a.name.localeCompare(b.name)).slice(skip, skip + take);
    }),
    findFirst: vi.fn(async ({ where }: any) => {
      return (
        db.find(
          (c) =>
            c.id === where.id &&
            c.restaurantId === where.restaurantId &&
            c.deletedAt === null,
        ) ?? null
      );
    }),
    create: vi.fn(async ({ data }: any) => {
      const client: MockClient = {
        id: nextId++,
        restaurantId: data.restaurantId,
        name: data.name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        notes: data.notes ?? null,
        tags: data.tags ?? [],
        totalOrders: data.totalOrders ?? 0,
        totalSpentEur: new Decimal(data.totalSpentEur ?? 0),
        lastOrderAt: data.lastOrderAt ?? null,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.push(client);
      return client;
    }),
    createMany: vi.fn(async ({ data }: any) => {
      const rows = data as Array<{
        restaurantId: number;
        name: string;
        email?: string | null;
        phone?: string | null;
        notes?: string | null;
        tags?: string[];
      }>;
      for (const row of rows) {
        db.push({
          id: nextId++,
          restaurantId: row.restaurantId,
          name: row.name,
          email: row.email ?? null,
          phone: row.phone ?? null,
          notes: row.notes ?? null,
          tags: row.tags ?? [],
          totalOrders: 0,
          totalSpentEur: new Decimal(0),
          lastOrderAt: null,
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return { count: rows.length };
    }),
    update: vi.fn(async ({ where, data }: any) => {
      const idx = db.findIndex((c) => c.id === where.id);
      if (idx === -1) throw new Error('NOT_FOUND');
      Object.assign(db[idx], data, { updatedAt: new Date() });
      return db[idx];
    }),
  },
  $transaction: vi.fn(async (ops: any[]) => Promise.all(ops)),
};

// Mock @prisma/client so the route module picks it up
vi.mock('@prisma/client', () => {
  class PrismaClient {}
  return { PrismaClient, Prisma: {} };
});

// Override the singleton prisma instance used by api-lib/routes/clients.ts
vi.mock('../api-lib/prisma', () => ({ prisma: mockPrisma }));

// ── Test app setup ─────────────────────────────────────────────────────────

async function buildApp(restaurantId: number) {
  const clientsRouter = (await import('../api-lib/routes/clients')).default;
  const app = express();
  app.use(express.json());
  // Simulate authWithRestaurant having already run
  app.use((req: any, _res, next) => {
    req.user = { userId: 1, email: 'owner@test.com', role: 'owner' };
    req.restaurantId = restaurantId;
    next();
  });
  app.use('/', clientsRouter);
  return app;
}

// ── Tests ──────────────────────────────────────────────────────────────────

beforeAll(() => {
  process.env['JWT_SECRET'] = 'test-secret-32-chars-minimum-ok!';
});

beforeEach(() => {
  db.length = 0;
  nextId = 1;
  vi.clearAllMocks();
  // Restore mock implementations after clearAllMocks
  mockPrisma.$transaction.mockImplementation(async (ops: any[]) => Promise.all(ops));
});

describe('GET /api/clients — list + pagination', () => {
  it('returns empty list when no clients', async () => {
    const app = await buildApp(1);
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(0);
  });

  it('returns clients scoped to restaurantId', async () => {
    // Seed two restaurants
    const app1 = await buildApp(1);
    const app2 = await buildApp(2);

    await request(app1).post('/').send({ name: 'Alice Dupont' });
    await request(app2).post('/').send({ name: 'Bob Martin' });

    const res1 = await request(app1).get('/');
    expect(res1.body.data).toHaveLength(1);
    expect(res1.body.data[0].name).toBe('Alice Dupont');

    const res2 = await request(app2).get('/');
    expect(res2.body.data).toHaveLength(1);
    expect(res2.body.data[0].name).toBe('Bob Martin');
  });

  it('respects page/limit params', async () => {
    const app = await buildApp(1);
    for (let i = 1; i <= 5; i++) {
      await request(app).post('/').send({ name: `Client ${i}` });
    }
    const res = await request(app).get('/?page=1&limit=3');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta.total).toBe(5);
    expect(res.body.meta.pages).toBe(2);
  });

  it('filters by search term (name)', async () => {
    const app = await buildApp(1);
    await request(app).post('/').send({ name: 'Alice Dupont' });
    await request(app).post('/').send({ name: 'Bob Durand' });

    const res = await request(app).get('/?search=alice');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Alice Dupont');
  });

  it('does not return soft-deleted clients', async () => {
    const app = await buildApp(1);
    const created = await request(app).post('/').send({ name: 'To Delete' });
    const id = created.body.data.id;
    await request(app).delete(`/${id}`);

    const res = await request(app).get('/');
    expect(res.body.data).toHaveLength(0);
  });
});

describe('POST /api/clients — create', () => {
  it('creates a client with minimal fields', async () => {
    const app = await buildApp(1);
    const res = await request(app).post('/').send({ name: 'Jean Valjean' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Jean Valjean');
    expect(res.body.data.restaurantId).toBe(1);
    expect(res.body.data.id).toBeDefined();
  });

  it('creates a client with all optional fields', async () => {
    const app = await buildApp(1);
    const res = await request(app).post('/').send({
      name: 'Cosette Fauchelevent',
      email: 'cosette@test.fr',
      phone: '0612345678',
      notes: 'Allergique aux noix',
      tags: ['VIP', 'Régulier'],
    });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('cosette@test.fr');
    expect(res.body.data.tags).toEqual(['VIP', 'Régulier']);
  });

  it('returns 400 when name is missing', async () => {
    const app = await buildApp(1);
    const res = await request(app).post('/').send({ email: 'nope@test.fr' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when name is empty string', async () => {
    const app = await buildApp(1);
    const res = await request(app).post('/').send({ name: '   ' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/clients/:id — detail', () => {
  it('returns client by id', async () => {
    const app = await buildApp(1);
    const created = await request(app).post('/').send({ name: 'Javert' });
    const id = created.body.data.id;

    const res = await request(app).get(`/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Javert');
  });

  it('returns 404 for unknown id', async () => {
    const app = await buildApp(1);
    const res = await request(app).get('/9999');
    expect(res.status).toBe(404);
  });

  it('returns 400 for non-numeric id', async () => {
    const app = await buildApp(1);
    const res = await request(app).get('/abc');
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/clients/:id — update', () => {
  it('updates allowed fields', async () => {
    const app = await buildApp(1);
    const created = await request(app).post('/').send({ name: 'Before' });
    const id = created.body.data.id;

    const res = await request(app).patch(`/${id}`).send({ name: 'After', tags: ['VIP'] });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('After');
    expect(res.body.data.tags).toEqual(['VIP']);
  });

  it('returns 404 when client does not exist', async () => {
    const app = await buildApp(1);
    const res = await request(app).patch('/9999').send({ name: 'X' });
    expect(res.status).toBe(404);
  });

  it('returns 400 when no update fields provided', async () => {
    const app = await buildApp(1);
    const created = await request(app).post('/').send({ name: 'Someone' });
    const id = created.body.data.id;

    const res = await request(app).patch(`/${id}`).send({});
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/clients/:id — soft delete', () => {
  it('soft-deletes a client (returns 204)', async () => {
    const app = await buildApp(1);
    const created = await request(app).post('/').send({ name: 'Ephemere' });
    const id = created.body.data.id;

    const del = await request(app).delete(`/${id}`);
    expect(del.status).toBe(204);

    // Client should be invisible in list
    const list = await request(app).get('/');
    expect(list.body.data).toHaveLength(0);
  });

  it('sets deletedAt on the record', async () => {
    const app = await buildApp(1);
    const created = await request(app).post('/').send({ name: 'SoftDel' });
    const id = created.body.data.id;
    await request(app).delete(`/${id}`);

    const record = db.find((c) => c.id === id);
    expect(record?.deletedAt).not.toBeNull();
  });
});

describe('Tenant isolation — user A cannot access user B clients', () => {
  it('GET list: restaurant 1 never sees restaurant 2 data', async () => {
    const app1 = await buildApp(1);
    const app2 = await buildApp(2);

    await request(app1).post('/').send({ name: 'A1-Client' });
    await request(app1).post('/').send({ name: 'A2-Client' });
    await request(app2).post('/').send({ name: 'B1-Client' });

    const res1 = await request(app1).get('/');
    expect(res1.body.data).toHaveLength(2);
    expect(res1.body.data.every((c: MockClient) => c.restaurantId === 1)).toBe(true);
  });

  it('GET /:id: cannot fetch another restaurant client by id', async () => {
    const app1 = await buildApp(1);
    const app2 = await buildApp(2);

    const created = await request(app2).post('/').send({ name: 'CrossTenantTarget' });
    const id = created.body.data.id;

    // app1 (restaurantId=1) tries to GET a client belonging to restaurant 2
    const res = await request(app1).get(`/${id}`);
    expect(res.status).toBe(404);
  });

  it('DELETE /:id: cannot delete another restaurant client', async () => {
    const app1 = await buildApp(1);
    const app2 = await buildApp(2);

    const created = await request(app2).post('/').send({ name: 'ProtectedClient' });
    const id = created.body.data.id;

    const res = await request(app1).delete(`/${id}`);
    expect(res.status).toBe(404);
  });

  it('PATCH /:id: cannot update another restaurant client', async () => {
    const app1 = await buildApp(1);
    const app2 = await buildApp(2);

    const created = await request(app2).post('/').send({ name: 'OriginalName' });
    const id = created.body.data.id;

    const res = await request(app1).patch(`/${id}`).send({ name: 'HackedName' });
    expect(res.status).toBe(404);
    // Original name must be intact
    const record = db.find((c) => c.id === id);
    expect(record?.name).toBe('OriginalName');
  });
});
