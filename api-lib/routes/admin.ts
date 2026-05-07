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

// ============ GET /api/admin/resend-status ============
// Diagnostic Resend : verifie la cle API + liste les domaines verifies +
// derniers emails envoyes. Cree 2026-05-06 suite a probleme rapporte par user.
router.get('/resend-status', async (_req, res) => {
  const out: any = { hasKey: !!process.env.RESEND_API_KEY, checks: {} };

  if (!process.env.RESEND_API_KEY) {
    return res.json({ ...out, error: 'RESEND_API_KEY absent dans Vercel env' });
  }

  // Test 1 : key validity via /domains
  try {
    const r = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    const data = await r.json();
    out.checks.domains = {
      httpStatus: r.status,
      ok: r.ok,
      domains: r.ok ? (data.data || []).map((d: any) => ({
        name: d.name,
        status: d.status,
        region: d.region,
      })) : data,
    };
  } catch (e: any) {
    out.checks.domains = { error: e.message };
  }

  // Test 2 : last 10 emails sent
  try {
    const r = await fetch('https://api.resend.com/emails?limit=10', {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    const data = await r.json();
    out.checks.recentEmails = {
      httpStatus: r.status,
      ok: r.ok,
      emails: r.ok ? (data.data || []).slice(0, 10).map((e: any) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        subject: e.subject,
        createdAt: e.created_at,
        lastEvent: e.last_event,
      })) : data,
    };
  } catch (e: any) {
    out.checks.recentEmails = { error: e.message };
  }

  res.json(out);
});

// ============ POST /api/admin/outreach/enrich-menu ============
// Enrichit un restaurant avec un plat phare + son prix extrait de leur carte.
// Permet l'hyper-personnalisation cold email v4 ("J'ai vu votre {dish} a {price}€").
//
// Strategie :
// 1. Fetch website du resto + tente plusieurs URLs (/carte, /menu, /restauration, /a-la-carte, /restaurant, /la-carte)
// 2. Extract texte body (max 4000 chars)
// 3. Si contient "€" ou "EUR" -> appel Claude Haiku pour identifier 1 plat principal + prix
// 4. Retourne { dish, price_eur, source_url } ou { dish: '', price_eur: null }
//
// Body: { name, website, cuisine? }
router.post('/outreach/enrich-menu', async (req: any, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ ok: false, error: 'ANTHROPIC_API_KEY absent en env' });
  }

  const { name, website, cuisine } = req.body || {};
  if (!website || typeof website !== 'string' || !website.startsWith('http')) {
    return res.status(400).json({ ok: false, error: 'website manquant ou invalide' });
  }

  // 1. Tenter plusieurs URLs candidates
  const baseUrl = website.replace(/\/$/, '');
  const candidates = [
    baseUrl,
    `${baseUrl}/carte`,
    `${baseUrl}/menu`,
    `${baseUrl}/la-carte`,
    `${baseUrl}/a-la-carte`,
    `${baseUrl}/restaurant`,
    `${baseUrl}/restauration`,
    `${baseUrl}/notre-carte`,
    `${baseUrl}/menus`,
  ];

  let menuText = '';
  let sourceUrl = '';

  for (const url of candidates) {
    try {
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RestauMarginBot/1.0; +https://www.restaumargin.fr)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) continue;
      const html = await r.text();
      // Extract text content (strip HTML tags)
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&euro;/g, '€')
        .replace(/&#x?\d+;/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Doit contenir au moins 1 prix € pour etre une carte
      if (text.length > 200 && (/\d+[,.]?\d*\s*€/.test(text) || /€\s*\d+/.test(text))) {
        menuText = text.slice(0, 4500);
        sourceUrl = url;
        break;
      }
    } catch {
      // Skip URLs qui timeout / 404 / SSL error
    }
  }

  if (!menuText) {
    return res.json({ ok: true, dish: '', price_eur: null, found: false, reason: 'no_menu_with_prices_found' });
  }

  // 2. Appel Claude Haiku pour identifier 1 plat principal
  const prompt = `Voici le contenu textuel d'une carte de restaurant${name ? ` (${name})` : ''}${cuisine ? ` cuisine ${cuisine}` : ''} :

---
${menuText}
---

Identifie UN PLAT PRINCIPAL emblematique de cette carte (un plat solide, pas une entree, pas un dessert, pas une boisson, pas une formule).

Privilegie un plat avec un prix entre 12€ et 35€ (zone classique pour un plat principal).

Repond UNIQUEMENT en JSON strict, sans aucun autre texte :

{"dish": "Nom exact du plat (max 70 caracteres)", "price_eur": 18.50}

Si tu ne trouves pas de plat principal clair avec un prix, repond exactement :

{"dish": "", "price_eur": null}`;

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251022',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return res.json({ ok: false, error: `claude api ${aiRes.status}`, detail: errText.slice(0, 200) });
    }

    const data: any = await aiRes.json();
    const text: string = data.content?.[0]?.text || '{}';

    // Extract JSON object
    const m = text.match(/\{[^{}]*?"dish"[^{}]*?\}/s);
    if (!m) {
      return res.json({ ok: true, dish: '', price_eur: null, found: false, reason: 'no_json_in_response', raw: text.slice(0, 200) });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(m[0]);
    } catch {
      return res.json({ ok: true, dish: '', price_eur: null, found: false, reason: 'invalid_json' });
    }

    const dish = (parsed.dish || '').trim();
    const priceEur = typeof parsed.price_eur === 'number' ? parsed.price_eur : null;

    if (!dish || !priceEur) {
      return res.json({ ok: true, dish: '', price_eur: null, found: false, reason: 'empty_extraction' });
    }

    return res.json({
      ok: true,
      dish,
      price_eur: priceEur,
      source_url: sourceUrl,
      found: true,
    });
  } catch (e: any) {
    return res.json({ ok: false, error: e.message });
  }
});

// ============ POST /api/admin/outreach/send ============
// Envoie batch outreach v3 (campagne email perso) via Resend, depuis le serveur
// (qui a deja la cle Resend en env). Permet au script local d'envoyer sans
// avoir besoin de stocker la cle Resend en local.
//
// Body: {
//   candidates: [{ name, email, cuisine?, address?, neighborhood? }],
//   dryRun?: boolean,
//   campaign?: string  // default 'montpellier_v3'
// }
//
// Returns: [{ email, ok, refId?, error?, subject? }]
router.post('/outreach/send', async (req: any, res) => {
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ ok: false, error: 'RESEND_API_KEY absent en env' });
  }

  const { candidates = [], dryRun = false, campaign = 'montpellier_v3' } = req.body || {};
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({ ok: false, error: 'candidates manquants' });
  }
  if (candidates.length > 100) {
    return res.status(400).json({ ok: false, error: 'max 100 candidats par appel (anti-abuse)' });
  }

  // ─ Helpers locaux (dupliqu du script local pour cohrence) ─
  function lowerCuisine(c?: string): string {
    if (!c) return 'francaise';
    return c.toLowerCase()
      .replace(/^restaurant\s+/i, '')
      .replace(/^bistrot\s*/i, 'bistrot ')
      .replace(/etoile\s*michelin/i, 'gastronomique')
      .trim()
      .split(/\s+/).slice(0, 3).join(' ');
  }
  function formatNeighborhood(n?: string, address?: string): string {
    const raw = (n || '').trim();
    if (!raw && address) {
      const a = address.toLowerCase();
      if (/antigone/.test(a)) return 'Antigone';
      if (/port\s*marianne|odysseum/.test(a)) return 'Port Marianne';
      if (/comedie/.test(a)) return 'la Comedie';
      if (/ecusson|saint-firmin|saint-roch/.test(a)) return "l'Ecusson";
    }
    if (!raw) return 'Montpellier';
    const lower = raw.toLowerCase();
    if (lower === 'ecusson') return "l'Ecusson";
    if (/^(le |la |les |l')/i.test(raw)) return raw;
    return raw;
  }
  function preposition(neighborhood: string): string {
    if (/^l'/i.test(neighborhood)) return `a ${neighborhood}`;
    if (/^les /i.test(neighborhood)) return `aux ${neighborhood.replace(/^les /i, '')}`;
    if (/^la /i.test(neighborhood)) return `a ${neighborhood}`;
    if (/^le /i.test(neighborhood)) return `au ${neighborhood.replace(/^le /i, '')}`;
    return `a ${neighborhood}`;
  }
  function pickSubject(c: any, cuisine: string): { subject: string; variant: string } {
    const name = c.name || 'votre etablissement';
    // V4 subject si on a un plat extrait
    if (c.featured_dish && c.dish_price_eur) {
      const r = Math.random();
      if (r < 0.5) return { subject: `Votre ${c.featured_dish} a ${c.dish_price_eur}€`, variant: 'V4-A' };
      if (r < 0.8) return { subject: `${name} — quel est votre food cost reel ?`, variant: 'V4-B' };
      return { subject: `${name} — 5 min pour calculer votre marge`, variant: 'V4-C' };
    }
    // V3 fallback
    const r = Math.random();
    if (r < 0.6) return { subject: `${name} — 5 min pour calculer votre vraie marge`, variant: 'V3-A' };
    if (r < 0.9) return { subject: `Combien vous coute reellement votre carte ${cuisine} ?`, variant: 'V3-B' };
    return { subject: 'RestauMargin — outil local lance a Montpellier', variant: 'V3-C' };
  }
  // Benchmarks food cost % par type de cuisine (standards industrie restauration FR 2025)
  function benchmarkForCuisine(cuisine?: string): { range: string; min: number; max: number } {
    if (!cuisine) return { range: '28-32%', min: 28, max: 32 };
    const c = cuisine.toLowerCase();
    if (/pizz|italien|pates|pasta/.test(c)) return { range: '22-28%', min: 22, max: 28 };
    if (/gastronom|etoile|michelin/.test(c)) return { range: '32-38%', min: 32, max: 38 };
    if (/brasserie|bistr|bistronom/.test(c)) return { range: '28-32%', min: 28, max: 32 };
    if (/asiatique|sushi|japonais|chinois|thai|vietnam/.test(c)) return { range: '25-30%', min: 25, max: 30 };
    if (/burger|street|fast/.test(c)) return { range: '28-34%', min: 28, max: 34 };
    if (/creperie/.test(c)) return { range: '20-26%', min: 20, max: 26 };
    return { range: '28-32%', min: 28, max: 32 };
  }
  function buildText(c: any): string {
    const name = c.name || 'votre etablissement';
    const cuisine = lowerCuisine(c.cuisine);

    // V4 : si on a featured_dish + dish_price_eur, format ultra-perso
    if (c.featured_dish && c.dish_price_eur) {
      const bench = benchmarkForCuisine(c.cuisine);
      const targetCostMin = (Number(c.dish_price_eur) * bench.min / 100).toFixed(2);
      const targetCostMax = (Number(c.dish_price_eur) * bench.max / 100).toFixed(2);
      return `Bonjour,

J'ai vu votre ${c.featured_dish} a ${c.dish_price_eur}€ sur votre carte.

Pour ce type de plat (cuisine ${cuisine}), le food cost cible tourne autour de ${bench.range}, soit ${targetCostMin}€ a ${targetCostMax}€ de matiere. Si vous etes au-dessus, il y a probablement un peu de marge a recuperer.

Je lance RestauMargin a Montpellier : un outil web qui calcule ce food cost precis pour TOUS vos plats en 5 min (depuis votre carte ou vos factures fournisseurs).

2 restaurants Montpellier se sont inscrits cette semaine.

Tester ici sans engagement : https://www.restaumargin.fr

Si vous n'avez pas le temps, repondez juste "non merci" et je n'envoie plus rien.

Cordialement,
L'equipe RestauMargin
contact@restaumargin.fr`;
    }

    // V3 fallback : pas de plat extrait
    const neighborhood = formatNeighborhood(c.neighborhood, c.address);
    const prep = preposition(neighborhood);
    return `Bonjour,

J'ai vu ${name} ${prep}.

Je lance RestauMargin a Montpellier ce mois-ci : un outil web pour calculer le cout exact d'un plat (ingredients + perte) en 5 min, sans Excel.

2 restaurants se sont inscrits cette semaine. Avant de pousser plus loin, je voulais avoir l'avis d'un autre restaurateur du coin.

Vous pouvez tester ici sans engagement : https://www.restaumargin.fr

Si vous n'avez pas le temps, repondez juste "non merci" et je n'envoie plus rien.

Cordialement,
L'equipe RestauMargin
contact@restaumargin.fr`;
  }
  function buildHtml(c: any): string {
    const text = buildText(c);
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const withLinks = escaped.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#0d9488;text-decoration:none;">$1</a>');
    const paragraphs = withLinks.split(/\n\n+/).map(p => `<p style="margin:0 0 14px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('');
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#111;max-width:560px;margin:0 auto;padding:20px;">
${paragraphs}
<hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0 12px 0;">
<p style="font-size:12px;color:#737373;margin:0;">RestauMargin · Outil SaaS pour restaurateurs francais · <a href="https://www.restaumargin.fr" style="color:#737373;">restaumargin.fr</a></p>
<p style="font-size:11px;color:#9ca3af;margin:4px 0 0 0;">Si vous ne souhaitez plus recevoir de message, repondez "non merci" et nous vous retirerons immediatement.</p>
</body></html>`;
  }

  const results: any[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    if (!c.email || !c.email.includes('@')) {
      results.push({ email: c.email, ok: false, error: 'email invalide' });
      continue;
    }

    const cuisine = lowerCuisine(c.cuisine);
    const { subject, variant } = pickSubject(c, cuisine);
    const text = buildText(c);
    const html = buildHtml(c);
    const refId = `${campaign}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    if (dryRun) {
      results.push({ email: c.email, ok: true, dryRun: true, subject, refId });
      continue;
    }

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: [c.email],
          reply_to: 'contact@restaumargin.fr',
          subject,
          text,
          html,
          headers: {
            'X-Entity-Ref-ID': refId,
            'X-Campaign': campaign,
          },
          tags: [
            { name: 'campaign', value: campaign },
            { name: 'subject_variant', value: variant },
          ],
        }),
      });
      const data: any = await r.json();
      if (r.ok) {
        results.push({ email: c.email, ok: true, refId, subject, variant, resendId: data?.id });
      } else {
        results.push({ email: c.email, ok: false, error: data, status: r.status });
      }
    } catch (e: any) {
      results.push({ email: c.email, ok: false, error: e.message });
    }

    // Pacing 1.5s entre envois (anti-rate-limit + anti-spam suspect)
    if (i < candidates.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  const okCount = results.filter(r => r.ok).length;
  res.json({ ok: true, total: candidates.length, sent: okCount, failed: candidates.length - okCount, results });
});

// ============ POST /api/admin/email-test ============
// Envoie un email de test au admin pour verifier que Resend fonctionne en pratique.
router.post('/email-test', async (req: any, res) => {
  if (!process.env.RESEND_API_KEY) {
    return res.json({ ok: false, error: 'RESEND_API_KEY absent' });
  }
  try {
    const targetEmail = req.user.email;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RestauMargin <contact@restaumargin.fr>',
        to: targetEmail,
        subject: '[Test diagnostic] Resend fonctionne ✓',
        html: `<p>Cet email confirme que la cle Resend fonctionne.</p>
               <p>Timestamp serveur : ${new Date().toISOString()}</p>
               <p>Si tu recois cet email, le service email RestauMargin est OK.</p>`,
      }),
    });
    const data = await r.json();
    res.json({ ok: r.ok, status: r.status, response: data });
  } catch (e: any) {
    res.json({ ok: false, error: e.message });
  }
});

// ============ GET /api/admin/signup-sources ============
// Stats sur l'origine d'acquisition des users (utm_source, referrer, landing).
// Cree 2026-05-06 — track depuis qu'on n'a pas pu identifier d'ou vient Charlie.
router.get('/signup-sources', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        plan: true,
        signupSource: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const bySource: Record<string, number> = {};
    const byMedium: Record<string, number> = {};
    const byCampaign: Record<string, number> = {};
    const byReferrer: Record<string, number> = {};
    const byLandingPath: Record<string, number> = {};

    for (const u of users) {
      const s = (u.signupSource as any) || {};
      let src = s.utm_source || 'direct';
      if (!s.utm_source && s.referrer) {
        try { src = new URL(s.referrer).hostname.replace(/^www\./, ''); } catch {}
      }
      bySource[src] = (bySource[src] || 0) + 1;
      if (s.utm_medium) byMedium[s.utm_medium] = (byMedium[s.utm_medium] || 0) + 1;
      if (s.utm_campaign) byCampaign[s.utm_campaign] = (byCampaign[s.utm_campaign] || 0) + 1;
      if (s.referrer) {
        try {
          const host = new URL(s.referrer).hostname.replace(/^www\./, '');
          byReferrer[host] = (byReferrer[host] || 0) + 1;
        } catch {}
      }
      if (s.landing_path) byLandingPath[s.landing_path] = (byLandingPath[s.landing_path] || 0) + 1;
    }

    const sortByCount = (obj: Record<string, number>) =>
      Object.entries(obj).sort(([, a], [, b]) => b - a).map(([key, count]) => ({ key, count }));

    res.json({
      total: users.length,
      bySource: sortByCount(bySource),
      byMedium: sortByCount(byMedium),
      byCampaign: sortByCount(byCampaign),
      byReferrer: sortByCount(byReferrer),
      byLandingPath: sortByCount(byLandingPath),
      recentUsers: users.slice(0, 50).map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt,
        plan: u.plan,
        source: u.signupSource,
      })),
    });
  } catch (e: any) {
    console.error('[ADMIN SIGNUP-SOURCES]', e.message);
    res.status(500).json({ error: 'Erreur chargement signup sources' });
  }
});

export default router;
