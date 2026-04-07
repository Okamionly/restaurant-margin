import { Router } from 'express';
import { prisma, JWT_SECRET, authMiddleware } from '../middleware';

const router = Router();

// ── Admin guard middleware ──
function adminGuard(req: any, res: any, next: any) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

// All admin routes require auth + admin role
router.use(authMiddleware, adminGuard);

// ============ GET /api/admin/stats ============
router.get('/stats', async (_req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      newUsersWeek,
      newUsersMonth,
      totalRestaurants,
      totalRecipes,
      totalIngredients,
      recentSignups,
      totalMessages,
      totalOrders,
      newsletterCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.restaurant.count(),
      prisma.recipe.count(),
      prisma.ingredient.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true },
      }),
      prisma.message.count(),
      prisma.marketplaceOrder.count(),
      prisma.newsletterSubscriber.count({ where: { unsubscribed: false } }),
    ]);

    // Count active subscriptions (users with plan != 'basic' and no expired trial)
    const activeSubscriptions = await prisma.user.count({
      where: {
        plan: { not: 'basic' },
        OR: [
          { trialEndsAt: null },
          { trialEndsAt: { gt: now } },
        ],
      },
    });

    // Signups per day (last 30 days) for chart
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const signupsRaw = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const signupsPerDay: Record<string, number> = {};
    for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
      signupsPerDay[d.toISOString().split('T')[0]] = 0;
    }
    for (const s of signupsRaw) {
      const day = s.createdAt.toISOString().split('T')[0];
      if (signupsPerDay[day] !== undefined) signupsPerDay[day]++;
    }

    const signupsChart = Object.entries(signupsPerDay).map(([date, count]) => ({ date, count }));

    res.json({
      totalUsers,
      newUsersWeek,
      newUsersMonth,
      totalRestaurants,
      totalRecipes,
      totalIngredients,
      activeSubscriptions,
      totalMessages,
      totalOrders,
      newsletterCount,
      recentSignups,
      signupsChart,
    });
  } catch (e: any) {
    console.error('[ADMIN STATS ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement statistiques' });
  }
});

// ============ GET /api/admin/users ============
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const search = (req.query.search as string || '').trim();
    const planFilter = req.query.plan as string || '';
    const roleFilter = req.query.role as string || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (planFilter) where.plan = planFilter;
    if (roleFilter) where.role = roleFilter;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          createdAt: true,
          trialEndsAt: true,
          emailVerified: true,
          _count: {
            select: {
              ownedRestaurants: true,
              memberships: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users: users.map(u => ({
        ...u,
        restaurantCount: u._count.ownedRestaurants,
        membershipCount: u._count.memberships,
        _count: undefined,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e: any) {
    console.error('[ADMIN USERS ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement utilisateurs' });
  }
});

// ============ GET /api/admin/users/:id ============
router.get('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        createdAt: true,
        trialEndsAt: true,
        emailVerified: true,
        stripeCustomerId: true,
        stripeSubId: true,
        acceptedCguAt: true,
        ownedRestaurants: {
          select: { id: true, name: true, createdAt: true, _count: { select: { recipes: true, ingredients: true } } },
        },
        _count: {
          select: { ownedRestaurants: true, memberships: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (e: any) {
    console.error('[ADMIN USER DETAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement utilisateur' });
  }
});

// ============ PUT /api/admin/users/:id ============
router.put('/users/:id', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const { plan, role, name } = req.body;
    const data: any = {};
    if (plan && ['basic', 'pro', 'business'].includes(plan)) data.plan = plan;
    if (role && ['chef', 'admin'].includes(role)) data.role = role;
    if (name && typeof name === 'string' && name.trim()) data.name = name.trim();

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    // Prevent removing own admin role
    if (id === req.user.userId && data.role && data.role !== 'admin') {
      return res.status(400).json({ error: 'Vous ne pouvez pas retirer votre propre rôle admin' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, plan: true, createdAt: true },
    });

    res.json(updated);
  } catch (e: any) {
    console.error('[ADMIN USER UPDATE ERROR]', e.message);
    res.status(500).json({ error: 'Erreur mise à jour utilisateur' });
  }
});

// ============ GET /api/admin/messages ============
router.get('/messages', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 30));

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          senderId: true,
          senderName: true,
          content: true,
          timestamp: true,
          read: true,
          createdAt: true,
          conversation: {
            select: { id: true, name: true, restaurantId: true },
          },
        },
      }),
      prisma.message.count(),
    ]);

    res.json({ messages, total, page, totalPages: Math.ceil(total / limit) });
  } catch (e: any) {
    console.error('[ADMIN MESSAGES ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement messages' });
  }
});

// ============ GET /api/admin/activity ============
router.get('/activity', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const entityType = req.query.entityType as string || '';

    const where: any = {};
    if (entityType) where.entityType = entityType;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          restaurantId: true,
          action: true,
          entityType: true,
          entityId: true,
          changes: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({ logs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (e: any) {
    console.error('[ADMIN ACTIVITY ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement activité' });
  }
});

// ============ GET /api/admin/newsletter ============
router.get('/newsletter', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 30));

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.newsletterSubscriber.count(),
    ]);

    res.json({ subscribers, total, page, totalPages: Math.ceil(total / limit) });
  } catch (e: any) {
    console.error('[ADMIN NEWSLETTER ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement newsletter' });
  }
});

// ============ PUT /api/admin/newsletter/:id/unsubscribe ============
router.put('/newsletter/:id/unsubscribe', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    await prisma.newsletterSubscriber.update({
      where: { id },
      data: { unsubscribed: true },
    });

    res.json({ success: true });
  } catch (e: any) {
    console.error('[ADMIN NEWSLETTER UNSUB ERROR]', e.message);
    res.status(500).json({ error: 'Erreur désinscription' });
  }
});

export default router;
