import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// ---- In-memory presence store ----

interface PresenceEntry {
  userId: number;
  name: string;
  page: string;
  restaurantId: number;
  lastSeen: number; // epoch ms
}

// Map key = `${restaurantId}:${userId}`
const presenceMap = new Map<string, PresenceEntry>();

// Evict stale entries older than 90s
function evictStale() {
  const cutoff = Date.now() - 90_000;
  for (const [key, entry] of presenceMap) {
    if (entry.lastSeen < cutoff) presenceMap.delete(key);
  }
}

// ---- In-memory audit log (last N events per restaurant) ----

interface AuditEntry {
  id: number;
  userId: number;
  userName: string;
  action: string;   // e.g. "recipe_created"
  label: string;    // e.g. "Risotto aux champignons"
  timestamp: string; // ISO
  restaurantId: number;
}

let auditSeq = 0;
const auditLog: AuditEntry[] = []; // ring buffer, max 200

function pushAudit(entry: Omit<AuditEntry, 'id' | 'timestamp'>) {
  auditSeq++;
  auditLog.push({
    ...entry,
    id: auditSeq,
    timestamp: new Date().toISOString(),
  });
  // Keep only last 200
  if (auditLog.length > 200) auditLog.splice(0, auditLog.length - 200);
}

// ---- Routes ----

// POST /api/presence/heartbeat
router.post('/heartbeat', authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { page, restaurantId, name } = req.body;

  if (!restaurantId) {
    res.status(400).json({ error: 'restaurantId required' });
    return;
  }

  const key = `${restaurantId}:${userId}`;
  presenceMap.set(key, {
    userId,
    name: name || req.user!.email || 'Utilisateur',
    page: page || '/',
    restaurantId: Number(restaurantId),
    lastSeen: Date.now(),
  });

  res.json({ ok: true });
});

// GET /api/presence/active
router.get('/active', authMiddleware, (req: AuthRequest, res: Response) => {
  const restaurantHeader = req.headers['x-restaurant-id'];
  const restaurantId = restaurantHeader ? Number(restaurantHeader) : null;

  evictStale();

  const active: Array<{
    userId: number;
    name: string;
    page: string;
    lastSeen: string;
  }> = [];

  for (const entry of presenceMap.values()) {
    if (restaurantId && entry.restaurantId !== restaurantId) continue;
    active.push({
      userId: entry.userId,
      name: entry.name,
      page: entry.page,
      lastSeen: new Date(entry.lastSeen).toISOString(),
    });
  }

  res.json(active);
});

// POST /api/presence/audit — record an action
router.post('/audit', authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { action, label, userName, restaurantId } = req.body;

  if (!action || !restaurantId) {
    res.status(400).json({ error: 'action and restaurantId required' });
    return;
  }

  pushAudit({
    userId,
    userName: userName || req.user!.email || 'Utilisateur',
    action,
    label: label || '',
    restaurantId: Number(restaurantId),
  });

  res.json({ ok: true });
});

// GET /api/presence/audit-log?limit=5&since=ISO
router.get('/audit-log', authMiddleware, (req: AuthRequest, res: Response) => {
  const restaurantHeader = req.headers['x-restaurant-id'];
  const restaurantId = restaurantHeader ? Number(restaurantHeader) : null;
  const limit = Math.min(Number(req.query.limit) || 5, 50);
  const since = req.query.since ? new Date(String(req.query.since)).getTime() : 0;

  let entries = auditLog.filter((e) => {
    if (restaurantId && e.restaurantId !== restaurantId) return false;
    if (since && new Date(e.timestamp).getTime() <= since) return false;
    return true;
  });

  // Most recent first
  entries = entries.slice(-limit).reverse();

  res.json(entries);
});

export { router as presenceRouter };
