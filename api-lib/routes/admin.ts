import { Router } from 'express';
import { prisma, authMiddleware } from '../middleware';

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

// ============ GET /api/admin/finance ============
// Finance dashboard : MRR/ARR/churn/trials/conversion — read-only, no mutations
router.get('/finance', async (_req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // ── Plan pricing (EUR/mois) ──
    const PRICES: Record<string, number> = { basic: 0, pro: 29, business: 79 };

    // ── All paying users (non-basic, no active trial) ──
    const payingUsers = await prisma.user.findMany({
      where: {
        plan: { not: 'basic' },
        OR: [{ trialEndsAt: null }, { stripeSubId: { not: null } }],
      },
      select: { id: true, plan: true, stripeSubId: true, stripeCustomerId: true, createdAt: true, trialEndsAt: true },
    });

    // ── Trial users (non-basic with active trial and no stripe sub) ──
    const trialUsers = await prisma.user.findMany({
      where: {
        plan: { not: 'basic' },
        trialEndsAt: { gt: now },
        stripeSubId: null,
      },
      select: { id: true, plan: true, trialEndsAt: true, createdAt: true },
    });

    // ── Trials expired this month (churned from trial) ──
    const trialsExpiredThisMonth = await prisma.user.count({
      where: {
        plan: 'basic',
        trialEndsAt: { gte: startOfMonth, lte: now },
      },
    });

    // ── Users who converted (gained stripe sub this month) ──
    const conversionsThisMonth = await prisma.user.count({
      where: {
        plan: { not: 'basic' },
        stripeSubId: { not: null },
        createdAt: { gte: startOfMonth },
      },
    });

    // ── Total user counts by plan ──
    const [totalBasic, totalPro, totalBusiness, totalUsers] = await Promise.all([
      prisma.user.count({ where: { plan: 'basic' } }),
      prisma.user.count({ where: { plan: 'pro' } }),
      prisma.user.count({ where: { plan: 'business' } }),
      prisma.user.count(),
    ]);

    // ── MRR calculation ──
    const mrr = payingUsers.reduce((sum, u) => sum + (PRICES[u.plan] ?? 0), 0);
    const arr = mrr * 12;

    // ── Trials by plan ──
    const trialsByPlan = trialUsers.reduce<Record<string, number>>((acc, u) => {
      acc[u.plan] = (acc[u.plan] ?? 0) + 1;
      return acc;
    }, {});

    // ── Conversion rate: paid / (paid + trial expired this month) ──
    const totalFunnelThisMonth = conversionsThisMonth + trialsExpiredThisMonth;
    const trialConversionRate = totalFunnelThisMonth > 0
      ? Math.round((conversionsThisMonth / totalFunnelThisMonth) * 100 * 10) / 10
      : 0;

    // ── ARPU ──
    const arpu = payingUsers.length > 0 ? Math.round((mrr / payingUsers.length) * 100) / 100 : 0;

    // ── Trials expiring soon (next 7 days) ──
    const in7days = new Date(now);
    in7days.setDate(now.getDate() + 7);
    const trialsExpiringSoon = await prisma.user.count({
      where: {
        trialEndsAt: { gte: now, lte: in7days },
        stripeSubId: null,
      },
    });

    // ── New users this month ──
    const newUsersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });

    // ── AI usage cost (from ai_usage_log if exists, else null) ──
    let aiCostThisMonth: number | null = null;
    let aiCallsThisMonth: number | null = null;
    try {
      const aiUsage = await (prisma as any).aiUsageLog.aggregate({
        _sum: { costEur: true },
        _count: { id: true },
        where: { createdAt: { gte: startOfMonth } },
      });
      aiCostThisMonth = aiUsage._sum?.costEur ?? 0;
      aiCallsThisMonth = aiUsage._count?.id ?? 0;
    } catch {
      // Table not yet created — returns null (stub mode)
    }

    // ── Stack fixed costs estimate (EUR/mois) ──
    const stackCostMonthly = {
      vercel: 0,       // Hobby free
      supabase: 0,     // Free tier
      resend: 0,       // Free tier
      anthropic: aiCostThisMonth ?? 0, // from instrumentation
      stripe_fees: mrr > 0 ? Math.round(mrr * 0.014 + payingUsers.length * 0.25) : 0,
      total: 0,
    };
    stackCostMonthly.total = Math.round(
      stackCostMonthly.vercel +
      stackCostMonthly.supabase +
      stackCostMonthly.resend +
      (aiCostThisMonth ?? 0) +
      stackCostMonthly.stripe_fees
    );

    // ── Gross margin estimate ──
    const grossMarginPct = mrr > 0
      ? Math.round(((mrr - stackCostMonthly.total) / mrr) * 100 * 10) / 10
      : null;

    // ── LTV estimate (avg revenue per paying user × avg retention 36 months) ──
    const ltv = arpu * 36;
    // CAC estimate (time-based, no paid ads currently)
    const cacEstimate = 180; // from audit
    const ltvCacRatio = cacEstimate > 0 ? Math.round((ltv / cacEstimate) * 10) / 10 : null;

    // ── Monthly signups chart (last 12 months) ──
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(now.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const signupsRaw = await prisma.user.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true, plan: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by month
    const monthlyData: Record<string, { signups: number; paid: number }> = {};
    for (let m = 0; m < 12; m++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + m, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = { signups: 0, paid: 0 };
    }
    for (const u of signupsRaw) {
      const key = u.createdAt.toISOString().slice(0, 7);
      if (monthlyData[key]) {
        monthlyData[key].signups++;
        if (u.plan !== 'basic') monthlyData[key].paid++;
      }
    }

    const mrrChart = Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));

    // ── Rule of 40 (placeholder — needs growth rate from prev month MRR) ──
    const ruleOf40 = null; // Cannot compute without historical MRR tracking

    res.json({
      generatedAt: now.toISOString(),
      // Core SaaS metrics
      mrr,
      arr,
      arpu,
      // User breakdown
      payingUsersCount: payingUsers.length,
      trialUsersCount: trialUsers.length,
      totalUsers,
      totalBasic,
      totalPro,
      totalBusiness,
      trialsByPlan,
      // Conversion funnel
      trialsExpiringSoon,
      trialsExpiredThisMonth,
      conversionsThisMonth,
      trialConversionRate,
      newUsersThisMonth,
      // Unit economics
      ltv,
      cacEstimate,
      ltvCacRatio,
      grossMarginPct,
      // Costs
      stackCostMonthly,
      aiCostThisMonth,
      aiCallsThisMonth,
      // Charts
      mrrChart,
      // Meta
      ruleOf40,
      stripeConnected: !!process.env.STRIPE_SECRET_KEY,
      stripeTaxEnabled: false, // Manual flag until Stripe Tax is confirmed active
    });
  } catch (e: any) {
    console.error('[ADMIN FINANCE ERROR]', e.message);
    res.status(500).json({ error: 'Erreur chargement dashboard finance' });
  }
});

export default router;
