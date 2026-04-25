/**
 * @file api-lib/routes/clients.ts
 * CRM Client CRUD endpoints — Wave 3.
 *
 * All routes expect authMiddleware + authWithRestaurant to have already
 * run (enforced at mount point in api/index.ts), so req.user and
 * req.restaurantId are guaranteed to be set.
 *
 * Endpoints:
 *   GET    /api/clients             — paginated list (search, page, limit)
 *   POST   /api/clients             — create one client
 *   GET    /api/clients/:id         — detail
 *   PATCH  /api/clients/:id         — partial update
 *   DELETE /api/clients/:id         — soft delete
 *   POST   /api/clients/import      — bulk import from localStorage payload
 */

import { Router } from 'express';
import { prisma } from '../prisma';
import { sanitizeInput } from '../middleware';
import { Decimal } from '@prisma/client/runtime/library';

const router = Router();

// ── Helpers ────────────────────────────────────────────────────────────────

/** Ensure req.restaurantId is a valid integer (set by authWithRestaurant). */
function getRestaurantId(req: any): number {
  const id = req.restaurantId as number | undefined;
  if (!id || !Number.isInteger(id)) throw new Error('restaurantId missing on request');
  return id;
}

/** Verify the client belongs to the current restaurant and is not deleted. */
async function assertClientOwnership(
  clientId: number,
  restaurantId: number,
): Promise<void> {
  const existing = await prisma.client.findFirst({
    where: { id: clientId, restaurantId, deletedAt: null },
    select: { id: true },
  });
  if (!existing) {
    const err = new Error('NOT_FOUND');
    (err as any).status = 404;
    throw err;
  }
}

interface ImportRow {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  notes?: unknown;
  tags?: unknown;
}

function parseImportRow(raw: unknown, idx: number): {
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  tags: string[];
} {
  if (!raw || typeof raw !== 'object') {
    throw new Error(`import[${idx}]: entry must be an object`);
  }
  const row = raw as ImportRow;
  if (typeof row.name !== 'string' || !row.name.trim()) {
    throw new Error(`import[${idx}]: name is required (non-empty string)`);
  }
  return {
    name: sanitizeInput(row.name.trim()),
    email: typeof row.email === 'string' ? sanitizeInput(row.email.trim()) || null : null,
    phone: typeof row.phone === 'string' ? sanitizeInput(row.phone.trim()) || null : null,
    notes: typeof row.notes === 'string' ? sanitizeInput(row.notes.trim()) || null : null,
    tags: Array.isArray(row.tags)
      ? (row.tags as unknown[]).filter((t): t is string => typeof t === 'string').map(sanitizeInput)
      : [],
  };
}

// ── GET /api/clients ───────────────────────────────────────────────────────

router.get('/', async (req: any, res) => {
  try {
    const restaurantId = getRestaurantId(req);

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '50'), 10) || 50));
    const skip = (page - 1) * limit;

    const where = {
      restaurantId,
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const [total, clients] = await prisma.$transaction([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          tags: true,
          totalOrders: true,
          totalSpentEur: true,
          lastOrderAt: true,
          createdAt: true,
        },
      }),
    ]);

    res.json({
      data: clients,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status ?? 500).json({ error: e.message ?? 'Erreur serveur' });
  }
});

// ── POST /api/clients ──────────────────────────────────────────────────────

router.post('/', async (req: any, res) => {
  try {
    const restaurantId = getRestaurantId(req);
    const body = req.body ?? {};

    if (typeof body.name !== 'string' || !body.name.trim()) {
      return res.status(400).json({ error: 'name est requis' });
    }

    const client = await prisma.client.create({
      data: {
        restaurantId,
        name: sanitizeInput(body.name.trim()),
        email: typeof body.email === 'string' ? sanitizeInput(body.email.trim()) || null : null,
        phone: typeof body.phone === 'string' ? sanitizeInput(body.phone.trim()) || null : null,
        notes: typeof body.notes === 'string' ? sanitizeInput(body.notes.trim()) || null : null,
        tags: Array.isArray(body.tags)
          ? (body.tags as unknown[]).filter((t): t is string => typeof t === 'string').map(sanitizeInput)
          : [],
      },
    });

    res.status(201).json({ data: client });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status ?? 500).json({ error: e.message ?? 'Erreur serveur' });
  }
});

// ── GET /api/clients/:id ───────────────────────────────────────────────────
// NOTE: import route registered below uses a fixed path — it must be mounted
// BEFORE /:id to avoid being swallowed.

router.get('/:id', async (req: any, res) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

    const client = await prisma.client.findFirst({
      where: { id, restaurantId, deletedAt: null },
    });
    if (!client) return res.status(404).json({ error: 'Client introuvable' });

    res.json({ data: client });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status ?? 500).json({ error: e.message ?? 'Erreur serveur' });
  }
});

// ── PATCH /api/clients/:id ─────────────────────────────────────────────────

router.patch('/:id', async (req: any, res) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

    await assertClientOwnership(id, restaurantId);

    const body = req.body ?? {};
    const data: Record<string, unknown> = {};

    if (typeof body.name === 'string') data.name = sanitizeInput(body.name.trim()) || undefined;
    if ('email' in body) data.email = typeof body.email === 'string' ? sanitizeInput(body.email.trim()) || null : null;
    if ('phone' in body) data.phone = typeof body.phone === 'string' ? sanitizeInput(body.phone.trim()) || null : null;
    if ('notes' in body) data.notes = typeof body.notes === 'string' ? sanitizeInput(body.notes.trim()) || null : null;
    if (Array.isArray(body.tags)) {
      data.tags = (body.tags as unknown[]).filter((t): t is string => typeof t === 'string').map(sanitizeInput);
    }
    if (typeof body.totalOrders === 'number') data.totalOrders = Math.max(0, Math.floor(body.totalOrders));
    if (body.totalSpentEur !== undefined) {
      const spent = parseFloat(String(body.totalSpentEur));
      if (!isNaN(spent) && spent >= 0) data.totalSpentEur = new Decimal(spent.toFixed(2));
    }
    if ('lastOrderAt' in body) {
      data.lastOrderAt = body.lastOrderAt ? new Date(String(body.lastOrderAt)) : null;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Aucun champ a mettre a jour' });
    }

    const updated = await prisma.client.update({
      where: { id },
      data,
    });

    res.json({ data: updated });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status ?? 500).json({ error: e.message ?? 'Erreur serveur' });
  }
});

// ── DELETE /api/clients/:id ────────────────────────────────────────────────

router.delete('/:id', async (req: any, res) => {
  try {
    const restaurantId = getRestaurantId(req);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'id invalide' });

    await assertClientOwnership(id, restaurantId);

    await prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(204).end();
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status ?? 500).json({ error: e.message ?? 'Erreur serveur' });
  }
});

// ── POST /api/clients/import ───────────────────────────────────────────────
// Registered AFTER /:id but Express matches fixed paths first. Since this
// file is used as a sub-router mounted at /api/clients, Express matches
// "import" before any :id param — so order is safe.

router.post('/import', async (req: any, res) => {
  try {
    const restaurantId = getRestaurantId(req);
    const body = req.body ?? {};

    if (!Array.isArray(body.clients)) {
      return res.status(400).json({ error: 'body.clients doit etre un tableau' });
    }
    if (body.clients.length === 0) {
      return res.json({ imported: 0 });
    }
    if (body.clients.length > 500) {
      return res.status(400).json({ error: 'Maximum 500 clients par import' });
    }

    const rows = (body.clients as unknown[]).map((row, idx) => parseImportRow(row, idx));

    // Batch insert — prisma.createMany skips duplicates is not available on
    // Postgres without skipDuplicates; we just insert all rows.
    const result = await prisma.client.createMany({
      data: rows.map((r) => ({ ...r, restaurantId })),
      skipDuplicates: false,
    });

    res.status(201).json({ imported: result.count });
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    const status = e.status ?? (e.message?.startsWith('import[') ? 400 : 500);
    res.status(status).json({ error: e.message ?? 'Erreur serveur' });
  }
});

export default router;
