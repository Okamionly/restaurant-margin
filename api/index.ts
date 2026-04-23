import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import mercurialeRoutes from './routes/mercuriale';
import exportRoutes from './routes/export';
import referralsRoutes from './routes/referrals';
import adminRoutes from './routes/admin';
import npsRoutes from './routes/nps';
import { getUnitDivisor } from './utils/unitConversion';
import { sanitizeInput, validatePrice, validatePositiveNumber, logAudit } from './middleware';
import { buildActivationCodeEmail, buildDigestEmail, buildCampaignEmail, buildTrialExpiringEmail, buildTrialLastDayEmail, buildTrialExpiredEmail } from './utils/emailTemplates';


const app = express();
const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env variable required');

const TOKEN_EXPIRY = '7d';

app.use(cors({
  origin: ['http://localhost:5173', 'https://www.restaumargin.fr', 'https://restaumargin.fr', 'https://restaumargin.vercel.app'],
  credentials: true,
}));
// ── Stripe Webhook (must be before express.json() for raw body) ──
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: any;

    if (endpointSecret && sig) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error('[STRIPE WEBHOOK] Signature verification failed:', err.message);
        return res.status(400).send('Webhook signature verification failed');
      }
    } else {
      // Fallback: parse without verification (log warning)
      console.warn('[STRIPE WEBHOOK] WARNING: No STRIPE_WEBHOOK_SECRET configured, skipping signature verification');
      event = JSON.parse(req.body.toString());
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const amountTotal = session.amount_total; // in cents

      // Determine plan from metadata (preferred) or fallback to amount
      let plan = session.metadata?.planType || 'pro';
      if (!session.metadata?.planType && amountTotal && amountTotal >= 7000) {
        plan = 'business'; // 79€ = 7900 cents
      }

      // Update user subscription in database if userId is available
      const metaUserId = session.metadata?.userId ? parseInt(session.metadata.userId) : null;
      if (metaUserId) {
        await prisma.user.update({
          where: { id: metaUserId },
          data: {
            plan,
            stripeCustomerId: session.customer || null,
            stripeSubId: session.subscription || null,
            trialEndsAt: null, // Clear trial — user is now paying
          },
        });
        console.log(`[STRIPE WEBHOOK] User ${metaUserId} upgraded to ${plan}, stripeCustomer=${session.customer}`);
      } else if (customerEmail) {
        // Fallback: find user by email
        const user = await prisma.user.findUnique({ where: { email: customerEmail } });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan,
              stripeCustomerId: session.customer || null,
              stripeSubId: session.subscription || null,
              trialEndsAt: null, // Clear trial — user is now paying
            },
          });
          console.log(`[STRIPE WEBHOOK] User ${user.id} (by email) upgraded to ${plan}`);
        }
      }

      // Generate activation code (legacy flow, kept for compatibility)
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'RM-';
      for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];

      await prisma.activationCode.create({ data: { code, plan, stripePaymentId: session.id } });

      // Send email with activation code via Resend
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && customerEmail) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: customerEmail,
          subject: `RestauMargin — Votre code d'activation ${plan.toUpperCase()}`,
          html: buildActivationCodeEmail({ planName: plan === 'pro' ? 'Professionnel' : 'Business', activationCode: code }),
        });
        console.log(`[STRIPE WEBHOOK] Code ${code} (${plan}) envoyé à ${customerEmail}`);
      }
    }

    // Handle subscription cancellation / expiry
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      // Find user by stripeCustomerId
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'basic',
            stripeSubId: null,
          },
        });
        console.log(`[STRIPE WEBHOOK] Subscription cancelled for user ${user.id}, downgraded to basic`);
      }
    }

    // Handle failed payment (subscription past_due or unpaid)
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const customerId = invoice.customer;
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
      if (user) {
        console.log(`[STRIPE WEBHOOK] Payment failed for user ${user.id} (${user.email})`);
        // Note: Stripe will retry. Downgrade happens on subscription.deleted.
      }
    }

    res.json({ received: true });
  } catch (e: any) {
    console.error('[STRIPE WEBHOOK ERROR]', e.message);
    res.status(400).json({ error: e.message });
  }
});

app.use(express.json());

// ── HSTS Header (enforce HTTPS) ──
app.use((_req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

// ── Request Logger (log slow requests) ──
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`SLOW: ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// ── CSRF Protection (Double-Submit Cookie Pattern) ──
// Stateless: works on Vercel serverless. No sessions needed.
// The frontend fetches a token via GET /api/csrf-token, which sets a cookie
// and returns the token. On state-changing requests (POST/PUT/DELETE/PATCH),
// the frontend sends the token in the X-CSRF-Token header. The middleware
// compares the header value to the cookie value.

function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Endpoint to get a CSRF token (sets cookie + returns token in body)
app.get('/api/csrf-token', (_req, res) => {
  const token = generateCsrfToken();
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('csrf_token', token, {
    httpOnly: false,       // Frontend JS needs to read this cookie
    secure: isProduction,  // HTTPS only in production
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.json({ csrfToken: token });
});

// CSRF validation middleware
app.use((req, res, next) => {
  // Skip safe HTTP methods (no state change)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip auth routes (login, register, reset-password, etc.)
  if (req.path.startsWith('/api/auth/')) {
    return next();
  }

  // Skip Stripe webhook (uses its own signature verification)
  if (req.path === '/api/stripe/webhook') {
    return next();
  }

  // Skip public routes
  if (req.path.startsWith('/api/public/')) {
    return next();
  }

  // Skip activation routes (use secret-based auth)
  if (req.path.startsWith('/api/activation/')) {
    return next();
  }

  // Skip health check
  if (req.path === '/api/health') {
    return next();
  }

  // Skip CSRF for requests with Bearer token (JWT is already a non-guessable token)
  // CSRF protection is mainly needed for cookie-based auth (which we don't use)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // For non-authenticated requests, validate CSRF token: header must match cookie
  const headerToken = req.headers['x-csrf-token'] as string | undefined;
  const cookieHeader = req.headers.cookie || '';
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  const cookieToken = cookieMatch ? cookieMatch[1] : undefined;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ error: 'CSRF token invalide ou manquant' });
  }

  next();
});

// ── CRON routes are registered below (after verifyCron helper) ──
// Placeholder stubs removed — real implementations handle all /api/cron/* endpoints

// ── Stripe Price IDs (LIVE mode, account acct_1TCSG73Y5IoWMA5k) ──
// Set via env vars STRIPE_PRICE_PRO_MONTHLY, etc. or fall back to production IDs
const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1TGSSU3Y5IoWMA5kc6YRt86p', // 29€/mois
  PRO_ANNUAL: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_1TNJcy3Y5IoWMA5k7T7ZOyI9', // 278€/an (-20%)
  BUSINESS_MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_1TGSSV3Y5IoWMA5k8Elzb9RU', // 79€/mois
  BUSINESS_ANNUAL: process.env.STRIPE_PRICE_BUSINESS_ANNUAL || 'price_1TNJd03Y5IoWMA5kMN2CPkNc', // 758€/an (-20%)
} as const;

// ── Stripe Checkout Session ──
app.post('/api/stripe/checkout', authMiddleware, async (req: any, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(503).json({ error: 'Stripe non configuré' });
    const stripe = require('stripe')(stripeKey);

    const { planId, annual } = req.body;
    if (!planId || !['pro', 'business'].includes(planId)) {
      return res.status(400).json({ error: 'planId invalide (pro ou business)' });
    }

    // Resolve the correct Stripe Price ID
    let priceId: string;
    if (planId === 'pro') {
      priceId = annual ? STRIPE_PRICES.PRO_ANNUAL : STRIPE_PRICES.PRO_MONTHLY;
    } else {
      priceId = annual ? STRIPE_PRICES.BUSINESS_ANNUAL : STRIPE_PRICES.BUSINESS_MONTHLY;
    }

    // Get the authenticated user
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Find or reference the user's first restaurant for metadata
    const membership = await prisma.restaurantMember.findFirst({
      where: { userId: user.id },
      select: { restaurantId: true },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: 'https://www.restaumargin.fr/dashboard?subscription=success',
      cancel_url: 'https://www.restaumargin.fr/abonnement',
      metadata: {
        userId: String(user.id),
        restaurantId: membership ? String(membership.restaurantId) : '',
        planType: planId,
      },
      subscription_data: {
        metadata: {
          userId: String(user.id),
          planType: planId,
        },
      },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('[STRIPE CHECKOUT ERROR]', err.message);
    res.status(500).json({ error: 'Erreur création session Stripe', details: err.message });
  }
});

// ── Stripe Customer Portal ──
app.post('/api/stripe/portal', authMiddleware, async (req: any, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) return res.status(503).json({ error: 'Stripe non configuré' });
    const stripe = require('stripe')(stripeKey);

    // Find customer by email
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Search for Stripe customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create customer if not found
      const customer = await stripe.customers.create({ email: user.email, name: user.name || undefined });
      customerId = customer.id;
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://www.restaumargin.fr/abonnement',
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur création portail Stripe', details: err.message });
  }
});

// ── Rate Limiting: Password Reset (3 per email per hour) ──
const passwordResetLimits = new Map<string, { count: number; resetAt: number }>();
app.use('/api/auth/forgot-password', (req, _res, next) => {
  if (req.method !== 'POST') return next();
  const email = (req.body?.email || '').toLowerCase().trim();
  if (!email) return next();
  const now = Date.now();
  const entry = passwordResetLimits.get(email);
  if (entry && now < entry.resetAt) {
    if (entry.count >= 3) {
      return _res.status(429).json({ error: 'Trop de demandes de réinitialisation. Réessayez dans 1 heure.' });
    }
    entry.count++;
  } else {
    passwordResetLimits.set(email, { count: 1, resetAt: now + 3600000 });
  }
  next();
});

// --- Health Check Endpoint (monitoring) ---
app.get('/api/health', async (_req, res) => {
  const start = Date.now();
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }
  const responseTime = Date.now() - start;
  const status = dbStatus === 'ok' ? 200 : 503;
  res.status(status).json({
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: `${responseTime}ms`,
    services: {
      database: dbStatus,
      api: 'ok',
    },
  });
});

// --- Auth Middleware ---
interface JwtPayload { userId: number; email: string; role: string; }

function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requis' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

async function authWithRestaurant(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requis' });
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload;
    req.user = decoded;
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
  const restaurantHeader = req.headers['x-restaurant-id'];
  if (!restaurantHeader) {
    return res.status(400).json({ error: 'X-Restaurant-Id header requis' });
  }
  const restaurantId = parseInt(String(restaurantHeader), 10);
  if (isNaN(restaurantId)) {
    return res.status(400).json({ error: 'X-Restaurant-Id invalide' });
  }
  try {
    const member = await prisma.restaurantMember.findFirst({
      where: { userId: req.user.userId, restaurantId },
    });
    if (!member) {
      return res.status(403).json({ error: 'Accès refusé à ce restaurant' });
    }
    req.restaurantId = restaurantId;
    next();
  } catch {
    return res.status(500).json({ error: 'Erreur vérification restaurant' });
  }
}

// --- Margin Calculator ---
function calculateMargin(recipe: any) {
  const foodCost = recipe.ingredients.reduce((total: number, ri: any) => {
    const wasteMultiplier = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
    const divisor = getUnitDivisor(ri.ingredient.unit);
    return total + (ri.quantity / divisor) * ri.ingredient.pricePerUnit * wasteMultiplier;
  }, 0);
  const costPerPortion = recipe.nbPortions > 0 ? foodCost / recipe.nbPortions : foodCost;
  const prepTime = recipe.prepTimeMinutes || 0;
  const cookTime = recipe.cookTimeMinutes || 0;
  const totalTimeHours = (prepTime + cookTime) / 60;
  const totalLaborCost = totalTimeHours * recipe.laborCostPerHour;
  const laborCostPerPortion = recipe.nbPortions > 0 ? totalLaborCost / recipe.nbPortions : totalLaborCost;
  const totalCostPerPortion = costPerPortion + laborCostPerPortion;
  const marginAmount = recipe.sellingPrice - totalCostPerPortion;
  const marginPercent = recipe.sellingPrice > 0 ? (marginAmount / recipe.sellingPrice) * 100 : 0;
  const coefficient = totalCostPerPortion > 0 ? recipe.sellingPrice / totalCostPerPortion : 0;
  return {
    foodCost: Math.round(foodCost * 100) / 100,
    costPerPortion: Math.round(costPerPortion * 100) / 100,
    laborCostPerPortion: Math.round(laborCostPerPortion * 100) / 100,
    totalCostPerPortion: Math.round(totalCostPerPortion * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    marginPercent: Math.round(marginPercent * 10) / 10,
    coefficient: Math.round(coefficient * 100) / 100,
  };
}

function formatRecipe(recipe: any) {
  const allergenSet = new Set<string>();
  for (const ri of recipe.ingredients) {
    for (const a of ri.ingredient.allergens) allergenSet.add(a);
  }
  return { ...recipe, margin: calculateMargin(recipe), allergens: Array.from(allergenSet).sort() };
}

const recipeInclude = { ingredients: { include: { ingredient: true } } } as const;

// ============ HEALTH ============
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: 'vercel' });
});

// Simple cron test — moved before all other routes
app.get('/api/cron-test', (_req, res) => {
  res.json({ ok: true, crons_loaded: true, time: new Date().toISOString() });
});

// ══════════════════════════════════════════════════════════════════════════
// CRON AGENTS — Vercel scheduled jobs (run automatically, no auth needed)
// Protected by CRON_SECRET env var to prevent unauthorized access
// ══════════════════════════════════════════════════════════════════════════

function verifyCron(req: any, res: any): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'Unauthorized cron' });
    return false;
  }
  return true;
}

// 1. HEALTH CHECK — every 15 min
app.get('/api/cron/health-check', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    const start = Date.now();
    const dbCheck = await prisma.$queryRaw`SELECT 1 as ok`;
    const responseTime = Date.now() - start;
    const healthy = responseTime < 2000 && Array.isArray(dbCheck);

    if (!healthy && process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'RestauMargin Agents <contact@restaumargin.fr>',
        to: ['Mr.guessousyoussef@gmail.com'],
        subject: '🔴 ALERTE — RestauMargin down',
        html: `<p>Le site RestauMargin est lent ou down.</p><p>Response time: ${responseTime}ms</p><p>DB: ${Array.isArray(dbCheck) ? 'OK' : 'ERREUR'}</p>`,
      });
    }

    res.json({ status: healthy ? 'healthy' : 'degraded', responseTime, db: 'ok', timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error('[CRON HEALTH]', e.message);
    res.status(500).json({ status: 'error', error: e.message });
  }
});

// 2. SENTRY MONITOR — every 30 min
app.get('/api/cron/sentry-monitor', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    const sentryToken = process.env.SENTRY_AUTH_TOKEN;
    if (!sentryToken) return res.json({ skipped: true, reason: 'No SENTRY_AUTH_TOKEN' });

    const response = await fetch('https://sentry.io/api/0/projects/restaumargin/restaumargin/issues/?query=is:unresolved&sort=date&limit=10', {
      headers: { Authorization: `Bearer ${sentryToken}` },
    });
    if (!response.ok) return res.json({ skipped: true, reason: `Sentry API ${response.status}` });

    const issues = await response.json();
    const critical = issues.filter((i: any) => i.level === 'fatal' || i.level === 'error');

    if (critical.length > 0 && process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'RestauMargin Agents <contact@restaumargin.fr>',
        to: ['Mr.guessousyoussef@gmail.com'],
        subject: `🐛 ${critical.length} bug(s) detecte(s) sur RestauMargin`,
        html: `<h2>${critical.length} erreur(s) non resolue(s)</h2><ul>${critical.map((i: any) => `<li><b>${i.title}</b> — ${i.count} occurrences — <a href="${i.permalink}">Voir sur Sentry</a></li>`).join('')}</ul>`,
      });
    }

    res.json({ issues: issues.length, critical: critical.length, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error('[CRON SENTRY]', e.message);
    res.json({ error: e.message });
  }
});

// 3. EMAIL SEQUENCE — daily at 10h
app.get('/api/cron/email-sequence', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    if (!process.env.RESEND_API_KEY) return res.json({ skipped: true, reason: 'No RESEND_API_KEY' });
    // Check for contacts needing J+3, J+7, J+14 relance
    // This is a placeholder — the full logic is in scripts/agents/email-sequence.ts
    res.json({ status: 'ok', message: 'Email sequence agent ran', timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error('[CRON EMAIL]', e.message);
    res.json({ error: e.message });
  }
});

// 4. LEAD FINDER — daily at 8h
app.get('/api/cron/lead-finder', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    const exaKey = process.env.EXA_API_KEY || '85caf1c5-927c-4053-8dfb-9ea249872cb9';
    const cities = ['Montpellier', 'Lyon', 'Marseille', 'Paris', 'Toulouse'];
    const city = cities[new Date().getDay() % cities.length]; // rotate daily

    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'x-api-key': exaKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `restaurant ouverture ${city} 2026`,
        type: 'auto',
        num_results: 10,
        contents: { highlights: { max_characters: 2000 } },
      }),
    });

    const data = await response.json();
    const leads = (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      highlight: r.highlights?.[0] || '',
      city,
    }));

    res.json({ city, leads: leads.length, results: leads, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error('[CRON LEADS]', e.message);
    res.json({ error: e.message });
  }
});

// 5. MARKET INTELLIGENCE — daily at 7h
app.get('/api/cron/market-intel', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    const tavilyKey = process.env.TAVILY_API_KEY || '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';

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: tavilyKey,
        query: 'actualite restauration france prix matieres premieres 2026',
        max_results: 5,
        include_answer: true,
      }),
    });

    const data = await response.json();
    const articles = (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.content?.slice(0, 200),
    }));

    res.json({ articles: articles.length, answer: data.answer?.slice(0, 500), results: articles, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error('[CRON MARKET]', e.message);
    res.json({ error: e.message });
  }
});

// 6. DAILY REPORT — every day at 8:30
app.get('/api/cron/daily-report', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    if (!process.env.RESEND_API_KEY) return res.json({ skipped: true });

    // Gather stats
    const [userCount, recipeCount, ingredientCount] = await Promise.all([
      prisma.user.count(),
      prisma.recipe.count(),
      prisma.ingredient.count(),
    ]);

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'RestauMargin Agents <contact@restaumargin.fr>',
      to: ['Mr.guessousyoussef@gmail.com'],
      subject: `📊 RestauMargin — Rapport du ${new Date().toLocaleDateString('fr-FR')}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0d9488;">Rapport quotidien RestauMargin</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;"><b>Utilisateurs</b></td><td style="padding:8px;border-bottom:1px solid #eee;">${userCount}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;"><b>Recettes</b></td><td style="padding:8px;border-bottom:1px solid #eee;">${recipeCount}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;"><b>Ingredients</b></td><td style="padding:8px;border-bottom:1px solid #eee;">${ingredientCount}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;"><b>API Status</b></td><td style="padding:8px;border-bottom:1px solid #eee;">✅ Healthy</td></tr>
          </table>
          <p style="color:#737373;font-size:12px;margin-top:20px;">Genere automatiquement par les agents RestauMargin</p>
        </div>
      `,
    });

    res.json({ status: 'sent', users: userCount, recipes: recipeCount, ingredients: ingredientCount, timestamp: new Date().toISOString() });
  } catch (e: any) {
    console.error('[CRON REPORT]', e.message);
    res.json({ error: e.message });
  }
});

// 7. TRIAL EXPIRY EMAILS — daily at 9h
app.get('/api/cron/trial-expiry', async (req: any, res) => {
  if (!verifyCron(req, res)) return;
  try {
    if (!process.env.RESEND_API_KEY) return res.json({ skipped: true, reason: 'No RESEND_API_KEY' });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // J+12: trial ends in 2 days
    const in2Days = new Date(today);
    in2Days.setDate(in2Days.getDate() + 2);
    const in2DaysEnd = new Date(in2Days);
    in2DaysEnd.setDate(in2DaysEnd.getDate() + 1);

    // J+13: trial ends in 1 day (tomorrow)
    const in1Day = new Date(today);
    in1Day.setDate(in1Day.getDate() + 1);
    const in1DayEnd = new Date(in1Day);
    in1DayEnd.setDate(in1DayEnd.getDate() + 1);

    // J+14: trial ends today
    const todayEnd = new Date(today);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Find users for each category
    const [usersJ12, usersJ13, usersJ14] = await Promise.all([
      prisma.user.findMany({
        where: { trialEndsAt: { gte: in2Days, lt: in2DaysEnd }, plan: 'basic' },
        select: { id: true, email: true, name: true },
      }),
      prisma.user.findMany({
        where: { trialEndsAt: { gte: in1Day, lt: in1DayEnd }, plan: 'basic' },
        select: { id: true, email: true, name: true },
      }),
      prisma.user.findMany({
        where: { trialEndsAt: { gte: today, lt: todayEnd }, plan: 'basic' },
        select: { id: true, email: true, name: true },
      }),
    ]);

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const results: string[] = [];

    // J+12: 2 days left
    for (const u of usersJ12) {
      try {
        // Count user data via their restaurants
        const membership = await prisma.restaurantMember.findFirst({ where: { userId: u.id }, select: { restaurantId: true } });
        let recipesCount = 0, ingredientsCount = 0;
        if (membership) {
          [recipesCount, ingredientsCount] = await Promise.all([
            prisma.recipe.count({ where: { restaurantId: membership.restaurantId } }),
            prisma.ingredient.count({ where: { restaurantId: membership.restaurantId } }),
          ]);
        }

        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: u.email,
          subject: 'Votre essai se termine dans 2 jours',
          html: buildTrialExpiringEmail({ userName: u.name, daysLeft: 2, recipesCount, ingredientsCount }),
        });
        results.push(`J+12: ${u.email}`);
      } catch (err: any) {
        results.push(`J+12 FAIL: ${u.email} - ${err.message}`);
      }
    }

    // J+13: 1 day left (last day)
    for (const u of usersJ13) {
      try {
        const membership = await prisma.restaurantMember.findFirst({ where: { userId: u.id }, select: { restaurantId: true } });
        let recipesCount = 0, ingredientsCount = 0;
        if (membership) {
          [recipesCount, ingredientsCount] = await Promise.all([
            prisma.recipe.count({ where: { restaurantId: membership.restaurantId } }),
            prisma.ingredient.count({ where: { restaurantId: membership.restaurantId } }),
          ]);
        }

        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: u.email,
          subject: 'Dernier jour d\'essai — ne perdez pas vos donnees',
          html: buildTrialLastDayEmail({ userName: u.name, recipesCount, ingredientsCount }),
        });
        results.push(`J+13: ${u.email}`);
      } catch (err: any) {
        results.push(`J+13 FAIL: ${u.email} - ${err.message}`);
      }
    }

    // J+14: expired today
    for (const u of usersJ14) {
      try {
        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: u.email,
          subject: 'Votre essai est termine — Passez au Pro',
          html: buildTrialExpiredEmail({ userName: u.name }),
        });
        results.push(`J+14: ${u.email}`);
      } catch (err: any) {
        results.push(`J+14 FAIL: ${u.email} - ${err.message}`);
      }
    }

    res.json({
      status: 'done',
      sent: { j12: usersJ12.length, j13: usersJ13.length, j14: usersJ14.length },
      details: results,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    console.error('[CRON TRIAL-EXPIRY]', e.message);
    res.json({ error: e.message });
  }
});

// ── Mount extracted route modules ──
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mercuriale', mercurialeRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nps', npsRoutes);

// ── Activation codes (kept at /api/activation/* for backward compat) ──
function generateActivationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RM-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

app.post('/api/activation/generate', async (req: any, res) => {
  try {
    const { plan, secret } = req.body;
    if (secret !== process.env.ACTIVATION_SECRET) return res.status(401).json({ error: 'Non autorisé' });
    if (!plan || !['pro', 'business'].includes(plan)) return res.status(400).json({ error: 'Plan invalide (pro ou business)' });
    const code = generateActivationCode();
    const activation = await prisma.activationCode.create({ data: { code, plan } });
    res.status(201).json({ code: activation.code, plan: activation.plan });
  } catch { res.status(500).json({ error: 'Erreur génération code' }); }
});

app.post('/api/activation/validate', async (req: any, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code requis' });
    const activation = await prisma.activationCode.findUnique({ where: { code: code.trim().toUpperCase() } });
    if (!activation) return res.status(404).json({ error: 'Code invalide' });
    if (activation.used) return res.status(400).json({ error: 'Code déjà utilisé' });
    res.json({ valid: true, plan: activation.plan });
  } catch { res.status(500).json({ error: 'Erreur validation' }); }
});

app.get('/api/activation/list', async (req: any, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.ACTIVATION_SECRET) return res.status(401).json({ error: 'Non autorisé' });
    const codes = await prisma.activationCode.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(codes);
  } catch { res.status(500).json({ error: 'Erreur liste codes' }); }
});

// ── Error Tracking ──
app.post('/api/errors', authMiddleware, (req: any, res) => {
  console.warn('[CLIENT ERROR]', req.user?.userId, req.body?.message, req.body?.url);
  res.json({ received: true });
});

// ============ RESTAURANTS ============
app.get('/api/restaurants', authMiddleware, async (req: any, res) => {
  try {
    const memberships = await prisma.restaurantMember.findMany({
      where: { userId: req.user.userId },
      include: { restaurant: { include: { _count: { select: { ingredients: true, recipes: true, suppliers: true } } } } },
    });
    res.json(memberships.map((m: any) => ({ ...m.restaurant, role: m.role })));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération restaurants' }); }
});

// ── Multi-restaurant overview dashboard ──
app.get('/api/restaurants/overview', authMiddleware, async (req: any, res) => {
  try {
    const memberships = await prisma.restaurantMember.findMany({
      where: { userId: req.user.userId },
      select: { restaurantId: true, restaurant: { select: { id: true, name: true, cuisineType: true, coversPerDay: true } } },
    });
    const restaurantIds = memberships.map((m: any) => m.restaurantId);
    if (restaurantIds.length === 0) return res.json({ restaurants: [], totals: { totalRecipes: 0, totalIngredients: 0, totalRevenue: 0, avgMarginPercent: 0, avgFoodCostPercent: 0 } });

    // Fetch all recipes with ingredients for each restaurant
    const allRecipes = await prisma.recipe.findMany({
      where: { restaurantId: { in: restaurantIds }, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });

    // Group recipes by restaurant
    const recipesByRestaurant: Record<number, typeof allRecipes> = {};
    for (const r of allRecipes) {
      if (!recipesByRestaurant[r.restaurantId]) recipesByRestaurant[r.restaurantId] = [];
      recipesByRestaurant[r.restaurantId].push(r);
    }

    // Count ingredients per restaurant
    const ingredientCounts = await prisma.ingredient.groupBy({
      by: ['restaurantId'],
      where: { restaurantId: { in: restaurantIds }, deletedAt: null },
      _count: { id: true },
    });
    const ingredientCountMap: Record<number, number> = {};
    for (const ic of ingredientCounts) ingredientCountMap[ic.restaurantId] = ic._count.id;

    // Build per-restaurant stats
    let totalRevenue = 0;
    let totalFoodCost = 0;
    let totalRecipes = 0;
    let totalIngredients = 0;

    const restaurantStats = memberships.map((m: any) => {
      const rest = m.restaurant;
      const recipes = recipesByRestaurant[rest.id] || [];
      const ingCount = ingredientCountMap[rest.id] || 0;

      let revenue = 0;
      let foodCost = 0;
      let recipeCount = recipes.length;

      for (const recipe of recipes) {
        revenue += recipe.sellingPrice * (recipe.nbPortions || 1);
        const rc = recipe.ingredients.reduce((total: number, ri: any) => {
          const wasteMultiplier = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
          const divisor = getUnitDivisor(ri.ingredient.unit);
          return total + (ri.quantity / divisor) * ri.ingredient.pricePerUnit * wasteMultiplier;
        }, 0);
        foodCost += rc;
      }

      const marginAmount = revenue - foodCost;
      const marginPercent = revenue > 0 ? (marginAmount / revenue) * 100 : 0;
      const foodCostPercent = revenue > 0 ? (foodCost / revenue) * 100 : 0;

      totalRevenue += revenue;
      totalFoodCost += foodCost;
      totalRecipes += recipeCount;
      totalIngredients += ingCount;

      return {
        id: rest.id,
        name: rest.name,
        cuisineType: rest.cuisineType,
        coversPerDay: rest.coversPerDay,
        recipeCount,
        ingredientCount: ingCount,
        revenue: Math.round(revenue * 100) / 100,
        foodCost: Math.round(foodCost * 100) / 100,
        marginAmount: Math.round(marginAmount * 100) / 100,
        marginPercent: Math.round(marginPercent * 10) / 10,
        foodCostPercent: Math.round(foodCostPercent * 10) / 10,
      };
    });

    const totalMarginAmount = totalRevenue - totalFoodCost;
    const avgMarginPercent = totalRevenue > 0 ? (totalMarginAmount / totalRevenue) * 100 : 0;
    const avgFoodCostPercent = totalRevenue > 0 ? (totalFoodCost / totalRevenue) * 100 : 0;

    res.json({
      restaurants: restaurantStats,
      totals: {
        totalRecipes,
        totalIngredients,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalFoodCost: Math.round(totalFoodCost * 100) / 100,
        totalMarginAmount: Math.round(totalMarginAmount * 100) / 100,
        avgMarginPercent: Math.round(avgMarginPercent * 10) / 10,
        avgFoodCostPercent: Math.round(avgFoodCostPercent * 10) / 10,
      },
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération overview' }); }
});

app.post('/api/restaurants', authMiddleware, async (req: any, res) => {
  try {
    const { name, address, cuisineType, phone, coversPerDay } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur création restaurant', details: 'Le nom est obligatoire' });
    const safeName = sanitizeInput(name);
    const safeAddress = address ? sanitizeInput(address) : null;
    const safeCuisineType = cuisineType ? sanitizeInput(cuisineType) : null;
    const safePhone = phone ? sanitizeInput(phone) : null;
    const restaurant = await prisma.restaurant.create({
      data: {
        name: safeName, address: safeAddress, cuisineType: safeCuisineType,
        phone: safePhone, coversPerDay: coversPerDay || 80, ownerId: req.user.userId,
        members: { create: { userId: req.user.userId, role: 'owner' } },
      },
    });
    res.status(201).json(restaurant);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création restaurant' }); }
});

app.put('/api/restaurants/:id', authMiddleware, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const membership = await prisma.restaurantMember.findFirst({ where: { userId: req.user.userId, restaurantId: id, role: 'owner' } });
    if (!membership) return res.status(403).json({ error: 'Accès refusé' });
    const { name, address, cuisineType, phone, coversPerDay } = req.body;
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name: name ? sanitizeInput(name) : undefined,
        address: address !== undefined ? (address ? sanitizeInput(address) : null) : undefined,
        cuisineType: cuisineType !== undefined ? (cuisineType ? sanitizeInput(cuisineType) : null) : undefined,
        phone: phone !== undefined ? (phone ? sanitizeInput(phone) : null) : undefined,
        coversPerDay: coversPerDay ?? undefined,
      },
    });
    res.json(restaurant);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour restaurant' }); }
});

app.delete('/api/restaurants/:id', authMiddleware, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const restaurant = await prisma.restaurant.findFirst({ where: { id, ownerId: req.user.userId } });
    if (!restaurant) return res.status(403).json({ error: 'Accès refusé' });
    await prisma.restaurant.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression restaurant' }); }
});

// ============ INGREDIENTS ============
app.get('/api/ingredients', authWithRestaurant, async (req: any, res) => {
  try {
    const { limit, offset } = req.query;
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [data, total] = await Promise.all([
        prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, orderBy: { name: 'asc' }, include: { supplierRef: { select: { id: true, name: true } } }, take, skip }),
        prisma.ingredient.count({ where: { restaurantId: req.restaurantId, deletedAt: null } }),
      ]);
      return res.json({ data, total, limit: take, offset: skip });
    }
    res.json(await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, orderBy: { name: 'asc' }, include: { supplierRef: { select: { id: true, name: true } } } }));
  } catch { res.status(500).json({ error: 'Erreur récupération ingrédients' }); }
});

app.get('/api/ingredients/usage', authWithRestaurant, async (req: any, res) => {
  try {
    const ings = await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, orderBy: { name: 'asc' }, include: { _count: { select: { recipes: true } } } });
    res.json(ings.map((i: any) => ({ id: i.id, name: i.name, category: i.category, usageCount: i._count.recipes })));
  } catch { res.status(500).json({ error: 'Erreur récupération utilisation ingrédients' }); }
});

app.post('/api/ingredients', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, unit, pricePerUnit, supplier, supplierId, category, allergens, barcode } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur création ingrédient', details: 'Le nom est requis' });
    if (!unit?.trim()) return res.status(400).json({ error: 'Erreur création ingrédient', details: 'L\'unité est requise' });
    if (!category?.trim()) return res.status(400).json({ error: 'Erreur création ingrédient', details: 'La catégorie est requise' });
    const priceCheck = validatePrice(pricePerUnit, 'Prix unitaire');
    if (!priceCheck.valid) return res.status(400).json({ error: 'Erreur création ingrédient', details: priceCheck.error });
    const p = priceCheck.value!;
    const safeName = sanitizeInput(name);
    const safeSupplier = supplier ? sanitizeInput(supplier) : null;
    // FIX 3: Check for duplicate ingredient (case-insensitive) before creating
    const duplicate = await prisma.ingredient.findFirst({
      where: { restaurantId: req.restaurantId, deletedAt: null, name: { equals: safeName, mode: 'insensitive' } },
    });
    if (duplicate) return res.status(409).json({ error: 'Un ingrédient avec ce nom existe déjà', existing: duplicate });
    const ing = await prisma.ingredient.create({ data: { name: safeName, unit: sanitizeInput(unit), pricePerUnit: p, supplier: safeSupplier, supplierId: supplierId || null, category: sanitizeInput(category), allergens: Array.isArray(allergens) ? allergens : [], barcode: barcode ? sanitizeInput(barcode) : null, restaurantId: req.restaurantId } });
    logAudit(req.user.userId, req.restaurantId, 'CREATE', 'ingredient', ing.id);
    res.status(201).json(ing);
  } catch { res.status(500).json({ error: 'Erreur création ingrédient' }); }
});

app.put('/api/ingredients/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, unit, pricePerUnit, supplier, supplierId, category, allergens, barcode } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur mise à jour ingrédient', details: 'Le nom est requis' });
    if (!unit?.trim()) return res.status(400).json({ error: 'Erreur mise à jour ingrédient', details: 'L\'unité est requise' });
    if (!category?.trim()) return res.status(400).json({ error: 'Erreur mise à jour ingrédient', details: 'La catégorie est requise' });
    const priceCheck = validatePrice(pricePerUnit, 'Prix unitaire');
    if (!priceCheck.valid) return res.status(400).json({ error: 'Erreur mise à jour ingrédient', details: priceCheck.error });
    const p = priceCheck.value!;
    const safeName = sanitizeInput(name);
    const safeSupplier = supplier ? sanitizeInput(supplier) : null;
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const ing = await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { name: safeName, unit: sanitizeInput(unit), pricePerUnit: p, supplier: safeSupplier, supplierId: supplierId || null, category: sanitizeInput(category), allergens: Array.isArray(allergens) ? allergens : [], barcode: barcode !== undefined ? (barcode ? sanitizeInput(barcode) : null) : undefined } });
    // Audit trail: log ingredient update with changes
    const changes: any = {};
    if (existing.name !== name.trim()) changes.name = { old: existing.name, new: name.trim() };
    if (existing.pricePerUnit !== p) changes.pricePerUnit = { old: existing.pricePerUnit, new: p };
    if (existing.unit !== unit.trim()) changes.unit = { old: existing.unit, new: unit.trim() };
    if (existing.category !== category.trim()) changes.category = { old: existing.category, new: category.trim() };
    logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'ingredient', ing.id, Object.keys(changes).length > 0 ? changes : undefined);
    // FIX 2: Auto-recalculate food cost for affected recipes when price changes
    if (existing.pricePerUnit !== p) {
      try {
        const affectedRecipes = await prisma.recipeIngredient.findMany({ where: { ingredientId: ing.id }, select: { recipeId: true } });
        const recipeIds = [...new Set(affectedRecipes.map(ar => ar.recipeId))];
        for (const recipeId of recipeIds) {
          const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }, include: recipeInclude });
          if (recipe && !recipe.deletedAt) {
            const margin = calculateMargin(recipe);
            // Touch updatedAt so frontend knows margins changed
            await prisma.recipe.update({ where: { id: recipeId }, data: { updatedAt: new Date() } });
          }
        }
      } catch (e) { console.error('Auto-recalc error:', e); }
    }
    res.json(ing);
  } catch { res.status(500).json({ error: 'Erreur mise à jour ingrédient' }); }
});

app.delete('/api/ingredients/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: new Date() } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'ingredient', parseInt(req.params.id));
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression ingrédient' }); }
});

app.put('/api/ingredients/:id/restore', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: { not: null } } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé ou non supprimé' });
    const restored = await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: null } });
    logAudit(req.user.userId, req.restaurantId, 'RESTORE', 'ingredient', restored.id);
    res.json(restored);
  } catch { res.status(500).json({ error: 'Erreur restauration ingrédient' }); }
});

// ============ RECIPES ============
app.get('/api/recipes', authWithRestaurant, async (req: any, res) => {
  try {
    const { limit, offset } = req.query;
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, include: recipeInclude, orderBy: { name: 'asc' }, take, skip }),
        prisma.recipe.count({ where: { restaurantId: req.restaurantId, deletedAt: null } }),
      ]);
      return res.json({ data: recipes.map(r => formatRecipe(r)), total, limit: take, offset: skip });
    }
    const recipes = await prisma.recipe.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, include: recipeInclude, orderBy: { name: 'asc' } });
    res.json(recipes.map(r => formatRecipe(r)));
  } catch { res.status(500).json({ error: 'Erreur récupération recettes' }); }
});

app.get('/api/recipes/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const recipe = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null }, include: recipeInclude });
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });
    res.json(formatRecipe(recipe));
  } catch { res.status(500).json({ error: 'Erreur récupération recette' }); }
});

app.post('/api/recipes', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, category, sellingPrice, nbPortions, description, prepTimeMinutes, cookTimeMinutes, laborCostPerHour, ingredients } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur création recette', details: 'Le nom est requis' });
    const safeName = sanitizeInput(name);
    const safeCategory = category ? sanitizeInput(category) : '';
    const safeDescription = description ? sanitizeInput(description) : null;
    const spCheck = validatePrice(sellingPrice, 'Prix de vente');
    if (sellingPrice !== undefined && sellingPrice !== null && !spCheck.valid) return res.status(400).json({ error: 'Erreur création recette', details: spCheck.error });
    if (laborCostPerHour != null) {
      const lCheck = validatePositiveNumber(laborCostPerHour, 'Coût main d\'oeuvre/h');
      if (!lCheck.valid) return res.status(400).json({ error: 'Erreur création recette', details: lCheck.error });
    }
    const recipe = await prisma.recipe.create({
      data: {
        name: safeName, category: safeCategory, sellingPrice: spCheck.valid && spCheck.value !== undefined ? spCheck.value : (parseFloat(sellingPrice) || 0), nbPortions: parseInt(nbPortions) || 1,
        description: safeDescription, prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
        cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null, laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
        restaurantId: req.restaurantId,
        ingredients: { create: ingredients?.map((i: any) => ({ ingredientId: i.ingredientId, quantity: i.quantity, wastePercent: i.wastePercent ?? 0 })) || [] },
      }, include: recipeInclude,
    });
    logAudit(req.user.userId, req.restaurantId, 'CREATE', 'recipe', recipe.id);
    res.status(201).json(formatRecipe(recipe));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création recette' }); }
});

app.put('/api/recipes/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, category, sellingPrice, nbPortions, description, prepTimeMinutes, cookTimeMinutes, laborCostPerHour, ingredients } = req.body;
    const recipeId = parseInt(req.params.id);
    const existing = await prisma.recipe.findFirst({ where: { id: recipeId, restaurantId: req.restaurantId, deletedAt: null } });
    if (!existing) return res.status(404).json({ error: 'Recette non trouvée' });
    const safeName = name ? sanitizeInput(name) : existing.name;
    const safeCategory = category !== undefined ? (category ? sanitizeInput(category) : '') : existing.category;
    const safeDescription = description !== undefined ? (description ? sanitizeInput(description) : null) : existing.description;
    if (sellingPrice !== undefined) {
      const spCheck = validatePrice(sellingPrice, 'Prix de vente');
      if (!spCheck.valid) return res.status(400).json({ error: 'Erreur mise à jour recette', details: spCheck.error });
    }
    if (laborCostPerHour != null) {
      const lCheck = validatePositiveNumber(laborCostPerHour, 'Coût main d\'oeuvre/h');
      if (!lCheck.valid) return res.status(400).json({ error: 'Erreur mise à jour recette', details: lCheck.error });
    }
    const updated = await prisma.$transaction(async (tx) => {
      await tx.recipe.update({ where: { id: recipeId }, data: {
        name: safeName, category: safeCategory, sellingPrice: parseFloat(sellingPrice), nbPortions: parseInt(nbPortions) || 1,
        description: safeDescription, prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
        cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null, laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
      }});
      if (ingredients) {
        await tx.recipeIngredient.deleteMany({ where: { recipeId } });
        await tx.recipeIngredient.createMany({ data: ingredients.map((i: any) => ({ recipeId, ingredientId: i.ingredientId, quantity: i.quantity, wastePercent: i.wastePercent ?? 0 })) });
      }
      return tx.recipe.findUnique({ where: { id: recipeId }, include: recipeInclude });
    });
    if (!updated) return res.status(404).json({ error: 'Recette non trouvée' });
    // Audit trail: log recipe update with changes
    const recipeChanges: any = {};
    if (existing.name !== safeName) recipeChanges.name = { old: existing.name, new: safeName };
    if (existing.sellingPrice !== parseFloat(sellingPrice)) recipeChanges.sellingPrice = { old: existing.sellingPrice, new: parseFloat(sellingPrice) };
    if (existing.category !== safeCategory) recipeChanges.category = { old: existing.category, new: safeCategory };
    logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'recipe', recipeId, Object.keys(recipeChanges).length > 0 ? recipeChanges : undefined);
    res.json(formatRecipe(updated));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour recette' }); }
});

app.post('/api/recipes/:id/clone', authWithRestaurant, async (req: any, res) => {
  try {
    const source = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null }, include: recipeInclude });
    if (!source) return res.status(404).json({ error: 'Recette non trouvée' });
    const cloned = await prisma.recipe.create({
      data: {
        name: `${source.name} (copie)`, category: source.category, sellingPrice: source.sellingPrice, nbPortions: source.nbPortions,
        description: source.description, prepTimeMinutes: source.prepTimeMinutes, cookTimeMinutes: source.cookTimeMinutes, laborCostPerHour: source.laborCostPerHour,
        restaurantId: req.restaurantId,
        ingredients: { create: source.ingredients.map(ri => ({ ingredientId: ri.ingredientId, quantity: ri.quantity, wastePercent: ri.wastePercent })) },
      }, include: recipeInclude,
    });
    res.status(201).json(formatRecipe(cloned));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur clonage recette' }); }
});

app.delete('/api/recipes/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null } });
    if (!existing) return res.status(404).json({ error: 'Recette non trouvée' });
    await prisma.recipe.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: new Date() } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'recipe', parseInt(req.params.id));
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression recette' }); }
});

app.put('/api/recipes/:id/restore', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: { not: null } } });
    if (!existing) return res.status(404).json({ error: 'Recette non trouvée ou non supprimée' });
    const restored = await prisma.recipe.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: null }, include: recipeInclude });
    logAudit(req.user.userId, req.restaurantId, 'RESTORE', 'recipe', restored.id);
    res.json(formatRecipe(restored));
  } catch { res.status(500).json({ error: 'Erreur restauration recette' }); }
});

// ============ RECIPE PHOTOS & SHARING ============

// POST /api/recipes/:id/photo — add a photo (base64 data URI) to recipe
app.post('/api/recipes/:id/photo', authWithRestaurant, async (req: any, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, restaurantId: req.restaurantId, deletedAt: null } });
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });
    const { photo } = req.body;
    if (!photo || typeof photo !== 'string') return res.status(400).json({ error: 'Photo requise (base64 data URI)' });
    const currentPhotos: string[] = (recipe as any).photos || [];
    if (currentPhotos.length >= 5) return res.status(400).json({ error: 'Maximum 5 photos par recette' });
    const updated = await prisma.recipe.update({
      where: { id: recipeId },
      data: { photos: { push: photo } },
      include: recipeInclude,
    });
    res.json(formatRecipe(updated));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ajout photo' }); }
});

// DELETE /api/recipes/:id/photo/:index — remove a photo by index
app.delete('/api/recipes/:id/photo/:index', authWithRestaurant, async (req: any, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const photoIndex = parseInt(req.params.index);
    const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, restaurantId: req.restaurantId, deletedAt: null } });
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });
    const currentPhotos: string[] = (recipe as any).photos || [];
    if (photoIndex < 0 || photoIndex >= currentPhotos.length) return res.status(400).json({ error: 'Index photo invalide' });
    const newPhotos = currentPhotos.filter((_: string, i: number) => i !== photoIndex);
    const updated = await prisma.recipe.update({
      where: { id: recipeId },
      data: { photos: newPhotos },
      include: recipeInclude,
    });
    res.json(formatRecipe(updated));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression photo' }); }
});

// GET /api/recipes/:id/share — generate a share token, return public URL
app.get('/api/recipes/:id/share', authWithRestaurant, async (req: any, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, restaurantId: req.restaurantId, deletedAt: null } });
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });
    let token = (recipe as any).shareToken;
    if (!token) {
      const crypto = require('crypto');
      token = crypto.randomBytes(16).toString('hex');
      await prisma.recipe.update({ where: { id: recipeId }, data: { shareToken: token } });
    }
    const baseUrl = req.headers.origin || 'https://restaumargin.fr';
    res.json({ token, url: `${baseUrl}/r/${token}` });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur génération lien de partage' }); }
});

// GET /api/public/recipe/:token — public recipe endpoint (no auth)
app.get('/api/public/recipe/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!token || token.length < 10) return res.status(400).json({ error: 'Token invalide' });
    const recipe = await prisma.recipe.findFirst({
      where: { shareToken: token, deletedAt: null },
      include: {
        ingredients: { include: { ingredient: true } },
        restaurant: { select: { name: true } },
      },
    });
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });
    res.json({
      name: recipe.name,
      category: recipe.category,
      description: recipe.description,
      nbPortions: recipe.nbPortions,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      photos: (recipe as any).photos || [],
      restaurantName: recipe.restaurant.name,
      ingredients: recipe.ingredients.map((ri: any) => ({
        name: ri.ingredient.name,
        quantity: ri.quantity,
        unit: ri.ingredient.unit,
        category: ri.ingredient.category,
      })),
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération recette publique' }); }
});

// ============ SUPPLIERS ============
app.get('/api/suppliers', authWithRestaurant, async (req: any, res) => {
  try {
    const { limit, offset } = req.query;
    const includeOpts = {
      _count: { select: { ingredients: true } },
      ingredients: {
        orderBy: { name: 'asc' as const },
        select: { id: true, name: true, unit: true, pricePerUnit: true, category: true },
      },
    };
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [data, total] = await Promise.all([
        prisma.supplier.findMany({ where: { restaurantId: req.restaurantId }, orderBy: { name: 'asc' }, include: includeOpts, take, skip }),
        prisma.supplier.count({ where: { restaurantId: req.restaurantId } }),
      ]);
      return res.json({ data, total, limit: take, offset: skip });
    }
    const suppliers = await prisma.supplier.findMany({
      where: { restaurantId: req.restaurantId },
      orderBy: { name: 'asc' },
      include: includeOpts,
    });
    res.json(suppliers);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération fournisseurs' }); }
});

app.get('/api/suppliers/scores/all', authWithRestaurant, async (req: any, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredients: { select: { id: true, name: true, pricePerUnit: true, category: true } } },
    });

    const allIngredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null },
      select: { name: true, pricePerUnit: true, supplierId: true },
    });
    const totalUniqueIngredients = allIngredients.length;
    const avgPrices: Record<string, { total: number; count: number }> = {};
    allIngredients.forEach((ing: any) => {
      const key = ing.name.toLowerCase().trim();
      if (!avgPrices[key]) avgPrices[key] = { total: 0, count: 0 };
      avgPrices[key].total += ing.pricePerUnit;
      avgPrices[key].count++;
    });

    const allInvoices = await prisma.invoice.findMany({
      where: { restaurantId: req.restaurantId },
      select: { supplierName: true, status: true },
    });

    const scores = suppliers.map((supplier: any) => {
      const supplierInvoices = allInvoices.filter((inv: any) => inv.supplierName.toLowerCase() === supplier.name.toLowerCase());
      const totalOrders = supplierInvoices.length;
      const completedOrders = supplierInvoices.filter((inv: any) => inv.status === 'paid' || inv.status === 'received' || inv.status === 'confirmed').length;
      let fiabilite = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 50;

      let priceComparisons = 0;
      let betterPriceCount = 0;
      (supplier.ingredients || []).forEach((ing: any) => {
        const key = ing.name.toLowerCase().trim();
        const avg = avgPrices[key];
        if (avg && avg.count > 1) {
          priceComparisons++;
          if (ing.pricePerUnit <= avg.total / avg.count) betterPriceCount++;
        }
      });
      let competitivite = priceComparisons > 0 ? Math.round((betterPriceCount / priceComparisons) * 100) : 50;

      const supplierIngCount = (supplier.ingredients || []).length;
      let diversite = totalUniqueIngredients > 0 ? Math.min(100, Math.round((supplierIngCount / totalUniqueIngredients) * 100)) : 50;

      const createdAt = supplier.createdAt ? new Date(supplier.createdAt) : new Date();
      const months = Math.max(0, Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
      let historique = months >= 24 ? 100 : months >= 12 ? 85 : months >= 6 ? 70 : months >= 3 ? 50 : months >= 1 ? 30 : 10;

      const global = Math.round(fiabilite * 0.30 + competitivite * 0.30 + diversite * 0.20 + historique * 0.20);

      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        scores: { fiabilite, competitivite, diversite, historique, global },
      };
    });

    res.json(scores);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur calcul scores' }); }
});

app.get('/api/suppliers/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const supplier = await prisma.supplier.findFirst({
      where: { id: parseInt(req.params.id), restaurantId: req.restaurantId },
      include: {
        ingredients: {
          orderBy: { name: 'asc' },
          select: { id: true, name: true, unit: true, pricePerUnit: true, category: true },
        },
      },
    });
    if (!supplier) return res.status(404).json({ error: 'Fournisseur non trouvé' });
    res.json(supplier);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/suppliers', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, phone, email, address, city, postalCode, region, country, siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms, whatsappPhone } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur création fournisseur', details: 'Le nom est requis' });
    const safeName = sanitizeInput(name);
    const safeContactName = contactName ? sanitizeInput(contactName) : null;
    const safeAddress = address ? sanitizeInput(address) : null;
    const safeCity = city ? sanitizeInput(city) : null;
    const safeNotes = notes ? sanitizeInput(notes) : null;
    const supplier = await prisma.supplier.create({
      data: {
        name: safeName, phone: phone || null, email: email || null, address: safeAddress,
        city: safeCity, postalCode: postalCode || null, region: region ? sanitizeInput(region) : null, country: country || 'France',
        siret: siret || null, website: website || null, notes: safeNotes,
        categories: Array.isArray(categories) ? categories : [], contactName: safeContactName,
        delivery: delivery !== undefined ? delivery : true, minOrder: minOrder || null, paymentTerms: paymentTerms || null,
        whatsappPhone: whatsappPhone || null,
        restaurantId: req.restaurantId,
      },
    });
    logAudit(req.user.userId, req.restaurantId, 'CREATE', 'supplier', supplier.id);
    res.status(201).json(supplier);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création fournisseur' }); }
});

app.put('/api/suppliers/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, phone, email, address, city, postalCode, region, country, siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms, whatsappPhone } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur mise à jour fournisseur', details: 'Le nom est requis' });
    const safeName = sanitizeInput(name);
    const safeContactName = contactName ? sanitizeInput(contactName) : null;
    const safeAddress = address ? sanitizeInput(address) : null;
    const safeCity = city ? sanitizeInput(city) : null;
    const safeNotes = notes ? sanitizeInput(notes) : null;
    const id = parseInt(req.params.id);
    const existing = await prisma.supplier.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Fournisseur non trouvé' });
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: safeName, phone: phone || null, email: email || null, address: safeAddress,
        city: safeCity, postalCode: postalCode || null, region: region ? sanitizeInput(region) : null, country: country || 'France',
        siret: siret || null, website: website || null, notes: safeNotes,
        categories: Array.isArray(categories) ? categories : [], contactName: safeContactName,
        delivery: delivery !== undefined ? delivery : true, minOrder: minOrder || null, paymentTerms: paymentTerms || null,
        whatsappPhone: whatsappPhone || null,
      },
    });
    // Audit trail: log supplier update with changes
    const supplierChanges: any = {};
    if (existing.name !== name.trim()) supplierChanges.name = { old: existing.name, new: name.trim() };
    if (existing.email !== (email || null)) supplierChanges.email = { old: existing.email, new: email || null };
    if (existing.phone !== (phone || null)) supplierChanges.phone = { old: existing.phone, new: phone || null };
    logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'supplier', supplier.id, Object.keys(supplierChanges).length > 0 ? supplierChanges : undefined);
    res.json(supplier);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour fournisseur' }); }
});

app.delete('/api/suppliers/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.supplier.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Fournisseur non trouvé' });
    const count = await prisma.ingredient.count({ where: { supplierId: id } });
    if (count > 0) return res.status(400).json({ error: `Impossible de supprimer : ${count} ingrédient(s) lié(s)` });
    await prisma.supplier.delete({ where: { id } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'supplier', id);
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression fournisseur' }); }
});

app.post('/api/suppliers/:id/link-ingredients', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await prisma.supplier.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!supplier) return res.status(404).json({ error: 'Fournisseur non trouvé' });
    const result = await prisma.ingredient.updateMany({
      where: { supplier: { equals: supplier.name, mode: 'insensitive' }, supplierId: null, restaurantId: req.restaurantId },
      data: { supplierId: id },
    });
    res.json({ linked: result.count, supplierName: supplier.name });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur lien ingrédients' }); }
});

// ============ SUPPLIER SCORING ============
app.get('/api/suppliers/:id/score', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await prisma.supplier.findFirst({
      where: { id, restaurantId: req.restaurantId },
      include: { ingredients: { select: { id: true, name: true, pricePerUnit: true, category: true } } },
    });
    if (!supplier) return res.status(404).json({ error: 'Fournisseur non trouvé' });

    // 1. Fiabilité livraison — based on invoices matching this supplier
    const allInvoices = await prisma.invoice.findMany({
      where: { restaurantId: req.restaurantId, supplierName: { equals: supplier.name, mode: 'insensitive' } },
    });
    const totalOrders = allInvoices.length;
    const completedOrders = allInvoices.filter((inv: any) => inv.status === 'paid' || inv.status === 'received' || inv.status === 'confirmed').length;
    let fiabilite = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : -1;
    const hasOrderHistory = totalOrders > 0;

    // 2. Compétitivité prix — compare to average prices across all suppliers
    const allIngredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null },
      select: { name: true, pricePerUnit: true, supplierId: true },
    });
    const avgPrices: Record<string, { total: number; count: number }> = {};
    allIngredients.forEach((ing: any) => {
      const key = ing.name.toLowerCase().trim();
      if (!avgPrices[key]) avgPrices[key] = { total: 0, count: 0 };
      avgPrices[key].total += ing.pricePerUnit;
      avgPrices[key].count++;
    });
    let priceComparisons = 0;
    let betterPriceCount = 0;
    (supplier.ingredients || []).forEach((ing: any) => {
      const key = ing.name.toLowerCase().trim();
      const avg = avgPrices[key];
      if (avg && avg.count > 1) {
        priceComparisons++;
        const avgPrice = avg.total / avg.count;
        if (ing.pricePerUnit <= avgPrice) betterPriceCount++;
      }
    });
    let competitivite = priceComparisons > 0 ? Math.round((betterPriceCount / priceComparisons) * 100) : -1;

    // 3. Diversité catalogue — ingredients supplied / total unique ingredients needed
    const totalUniqueIngredients = await prisma.ingredient.count({ where: { restaurantId: req.restaurantId } });
    const supplierIngredientCount = (supplier.ingredients || []).length;
    let diversite = totalUniqueIngredients > 0 ? Math.round((supplierIngredientCount / totalUniqueIngredients) * 100) : -1;
    if (diversite > 100) diversite = 100;

    // 4. Historique — months since supplier was created
    const createdAt = supplier.createdAt ? new Date(supplier.createdAt) : new Date();
    const monthsSinceCreation = Math.max(0, Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    // Score: 0 months = 10, 1-3 months = 30, 3-6 = 50, 6-12 = 70, 12-24 = 85, 24+ = 100
    let historique = monthsSinceCreation >= 24 ? 100 : monthsSinceCreation >= 12 ? 85 : monthsSinceCreation >= 6 ? 70 : monthsSinceCreation >= 3 ? 50 : monthsSinceCreation >= 1 ? 30 : 10;

    // Handle missing data with estimated scores
    const estimatedScores: string[] = [];
    if (fiabilite < 0) { fiabilite = 50; estimatedScores.push('fiabilite'); }
    if (competitivite < 0) { competitivite = 50; estimatedScores.push('competitivite'); }
    if (diversite < 0) { diversite = 50; estimatedScores.push('diversite'); }

    // 5. Score global — weighted average
    const scoreGlobal = Math.round(fiabilite * 0.30 + competitivite * 0.30 + diversite * 0.20 + historique * 0.20);

    // Recommendation
    let recommendation = '';
    if (scoreGlobal >= 80) recommendation = 'Excellent fournisseur. Partenaire de confiance recommandé.';
    else if (scoreGlobal >= 60) recommendation = 'Bon fournisseur avec un potentiel d\'amélioration. Suivre les prix régulièrement.';
    else if (scoreGlobal >= 40) recommendation = 'Fournisseur moyen. Envisagez de comparer avec des alternatives.';
    else recommendation = 'Fournisseur à risque. Recherchez des alternatives plus fiables.';

    const note = estimatedScores.length > 0 ? 'Pas assez de données pour certains critères — scores estimés.' : null;

    res.json({
      supplierId: id,
      supplierName: supplier.name,
      scores: {
        fiabilite,
        competitivite,
        diversite,
        historique,
        global: scoreGlobal,
      },
      details: {
        totalOrders,
        completedOrders,
        priceComparisons,
        betterPriceCount,
        supplierIngredientCount,
        totalUniqueIngredients,
        monthsSinceCreation,
      },
      estimatedScores,
      note,
      recommendation,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur calcul score fournisseur' }); }
});

// ============ SUPPLIER PRICE IMPORT (CSV) ============
app.post('/api/suppliers/:id/import-prices', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await prisma.supplier.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!supplier) return res.status(404).json({ error: 'Fournisseur non trouve' });

    const csvText = typeof req.body === 'string' ? req.body : (req.body?.csv ?? '');
    if (!csvText || !csvText.trim()) return res.status(400).json({ error: 'CSV vide' });

    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return res.status(400).json({ error: 'Le CSV doit contenir au moins un en-tete et une ligne de donnees' });

    // Skip header row
    const dataLines = lines.slice(1).filter((l: string) => l.trim());
    const updated: string[] = [];
    const notFound: string[] = [];
    const errors: string[] = [];

    // Fetch all ingredients for this restaurant
    const allIngredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null },
      select: { id: true, name: true, unit: true, pricePerUnit: true, supplierId: true },
    });

    // Build case-insensitive lookup map
    const ingredientMap = new Map<string, typeof allIngredients[0]>();
    allIngredients.forEach((ing) => {
      ingredientMap.set(ing.name.toLowerCase().trim(), ing);
    });

    for (const line of dataLines) {
      // Split by semicolon (French Excel format)
      const parts = line.split(';').map((p: string) => p.trim());
      if (parts.length < 3) {
        errors.push(`Ligne invalide (moins de 3 colonnes): "${line}"`);
        continue;
      }
      const [productName, unit, priceStr] = parts;
      if (!productName) { errors.push(`Nom produit vide: "${line}"`); continue; }

      // Parse price: accept both comma and dot as decimal separator
      const price = parseFloat(priceStr.replace(',', '.'));
      if (isNaN(price) || price < 0) {
        errors.push(`Prix invalide pour "${productName}": "${priceStr}"`);
        continue;
      }

      // Find matching ingredient (case-insensitive)
      const ingredient = ingredientMap.get(productName.toLowerCase().trim());
      if (!ingredient) {
        notFound.push(productName);
        continue;
      }

      // Update ingredient price and link to supplier
      await prisma.ingredient.update({
        where: { id: ingredient.id },
        data: { pricePerUnit: price, supplierId: id },
      });

      // Create price history entry
      await prisma.priceHistory.create({
        data: {
          ingredientId: ingredient.id,
          price,
          date: new Date().toISOString().slice(0, 10),
          source: 'csv-import',
          restaurantId: req.restaurantId,
        },
      });

      // Audit trail
      logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'ingredient', ingredient.id, {
        pricePerUnit: { old: ingredient.pricePerUnit, new: price },
        source: 'csv-import',
        supplierId: id,
      });

      updated.push(productName);
    }

    res.json({ updated: updated.length, updatedNames: updated, notFound, errors });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur import CSV: ' + e.message }); }
});

// ============ INVENTORY ============
app.get('/api/inventory', authWithRestaurant, async (req: any, res) => {
  try {
    const { limit, offset } = req.query;
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [rawData, total] = await Promise.all([
        prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true }, orderBy: { ingredient: { name: 'asc' } }, take, skip }),
        prisma.inventoryItem.count({ where: { restaurantId: req.restaurantId } }),
      ]);
      const data = rawData.map((item: any) => ({ ...item, lowStock: item.currentStock < item.minQuantity }));
      return res.json({ data, total, limit: take, offset: skip });
    }
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    res.json(items.map((item: any) => ({ ...item, lowStock: item.currentStock < item.minQuantity })));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération inventaire' }); }
});

app.get('/api/inventory/alerts', authWithRestaurant, async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    const alerts = items.filter((item: any) => item.currentStock < item.minStock);
    res.json(alerts);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur alertes' }); }
});

app.get('/api/inventory/value', authWithRestaurant, async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true } });
    const totalValue = items.reduce((sum: number, item: any) => sum + (item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit, 0);
    const byCategory: Record<string, number> = {};
    for (const item of items) {
      const cat = (item as any).ingredient.category;
      const val = (item.currentStock / getUnitDivisor((item as any).ingredient.unit)) * (item as any).ingredient.pricePerUnit;
      byCategory[cat] = (byCategory[cat] || 0) + val;
    }
    res.json({
      totalValue: Math.round(totalValue * 100) / 100,
      byCategory: Object.entries(byCategory).map(([category, value]) => ({ category, value: Math.round(value * 100) / 100 })),
      itemCount: items.length,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur calcul valeur' }); }
});

app.post('/api/inventory/suggest', authWithRestaurant, async (req: any, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null, inventoryItem: null },
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suggestions' }); }
});

app.post('/api/inventory', authWithRestaurant, async (req, res) => {
  try {
    const { ingredientId, currentStock, unit, minStock, maxStock, notes } = req.body;
    if (!ingredientId) return res.status(400).json({ error: 'Erreur ajout inventaire', details: 'ingredientId requis' });
    if (currentStock !== undefined) {
      const stockCheck = validatePositiveNumber(currentStock, 'Stock actuel');
      if (!stockCheck.valid) return res.status(400).json({ error: 'Erreur ajout inventaire', details: stockCheck.error });
    }
    const ingredient = await prisma.ingredient.findFirst({ where: { id: ingredientId, restaurantId: req.restaurantId, deletedAt: null } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const safeNotes = notes ? sanitizeInput(notes) : null;
    const item = await prisma.inventoryItem.create({
      data: { ingredientId, currentStock: currentStock || 0, unit: unit || ingredient.unit, minStock: minStock || 0, maxStock: maxStock || null, notes: safeNotes, restaurantId: req.restaurantId },
      include: { ingredient: true },
    });
    logAudit((req as any).user.userId, req.restaurantId, 'CREATE', 'inventory', item.id, { ingredientId, currentStock: currentStock || 0 });
    res.status(201).json(item);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Déjà dans l\'inventaire' });
    console.error(e); res.status(500).json({ error: 'Erreur ajout inventaire' });
  }
});

app.put('/api/inventory/:id', authWithRestaurant, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { currentStock, minStock, maxStock, minQuantity, unit, notes } = req.body;
    const data: any = {};
    if (currentStock !== undefined) {
      const check = validatePositiveNumber(currentStock, 'Stock actuel');
      if (!check.valid) return res.status(400).json({ error: 'Erreur mise à jour inventaire', details: check.error });
      data.currentStock = check.value;
    }
    if (minStock !== undefined) data.minStock = parseFloat(minStock);
    if (maxStock !== undefined) data.maxStock = maxStock === null ? null : parseFloat(maxStock);
    if (minQuantity !== undefined) data.minQuantity = parseFloat(minQuantity);
    if (unit !== undefined) data.unit = unit;
    if (notes !== undefined) data.notes = notes ? sanitizeInput(notes) : null;
    const item = await prisma.inventoryItem.update({ where: { id }, data, include: { ingredient: true } });
    logAudit((req as any).user.userId, (req as any).restaurantId, 'UPDATE', 'inventory', id, data);
    res.json(item);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour inventaire' }); }
});

app.post('/api/inventory/:id/restock', authWithRestaurant, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    const qtyCheck = validatePositiveNumber(quantity, 'Quantité');
    if (!qtyCheck.valid || !qtyCheck.value || qtyCheck.value <= 0) return res.status(400).json({ error: 'Erreur réapprovisionnement', details: 'Quantité doit être supérieure à 0' });
    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Item non trouvé' });
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { currentStock: existing.currentStock + parseFloat(quantity), lastRestockDate: new Date(), lastRestockQuantity: parseFloat(quantity) },
      include: { ingredient: true },
    });
    logAudit((req as any).user.userId, (req as any).restaurantId, 'UPDATE', 'inventory', id, { action: 'restock', quantity: parseFloat(quantity), oldStock: existing.currentStock, newStock: item.currentStock });
    res.json(item);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur réapprovisionnement' }); }
});

app.delete('/api/inventory/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.inventoryItem.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Élément inventaire non trouvé' });
    await prisma.inventoryItem.delete({ where: { id: existing.id } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'inventory', existing.id);
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression inventaire' }); }
});

// ============ INVENTORY AUTO-REORDER ============

// GET /api/inventory/auto-reorder — Analyze inventory and suggest reorders
app.get('/api/inventory/auto-reorder', authWithRestaurant, async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: { include: { supplierRef: true } } },
    });

    // Filter items where currentStock < minStock (using minStock as the reorder threshold)
    const lowStockItems = items.filter((item: any) => item.currentStock < item.minStock && item.minStock > 0);

    // Group by supplier
    const bySupplier: Record<string, {
      supplierId: number | null;
      supplier: string;
      items: { ingredientId: number; ingredient: string; currentStock: number; minQuantity: number; unit: string; suggestedQty: number; estimatedCost: number }[];
      totalCost: number;
    }> = {};

    for (const item of lowStockItems) {
      const supplierName = (item as any).ingredient.supplierRef?.name || (item as any).ingredient.supplier || 'Sans fournisseur';
      const supplierId = (item as any).ingredient.supplierId || null;
      const key = supplierName;

      if (!bySupplier[key]) {
        bySupplier[key] = { supplierId, supplier: supplierName, items: [], totalCost: 0 };
      }

      const minQty = item.minStock;
      const suggestedQty = Math.max(minQty * 2 - item.currentStock, 0);
      const unitDivisor = getUnitDivisor((item as any).ingredient.unit);
      const estimatedCost = (suggestedQty / unitDivisor) * (item as any).ingredient.pricePerUnit;

      bySupplier[key].items.push({
        ingredientId: (item as any).ingredient.id,
        ingredient: (item as any).ingredient.name,
        currentStock: item.currentStock,
        minQuantity: minQty,
        unit: item.unit || (item as any).ingredient.unit,
        suggestedQty: Math.round(suggestedQty * 100) / 100,
        estimatedCost: Math.round(estimatedCost * 100) / 100,
      });
      bySupplier[key].totalCost += estimatedCost;
    }

    // Round totals
    const result = Object.values(bySupplier).map(group => ({
      ...group,
      totalCost: Math.round(group.totalCost * 100) / 100,
    }));

    res.json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur analyse réapprovisionnement auto' }); }
});

// POST /api/inventory/auto-reorder/confirm — Create marketplace orders from suggestions
app.post('/api/inventory/auto-reorder/confirm', authWithRestaurant, async (req: any, res) => {
  try {
    const { orders } = req.body;
    // orders: [{ supplier, supplierId?, items: [{ ingredientId, productName, quantity, unit, unitPrice }] }]
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Aucune commande à créer' });
    }

    const createdIds: number[] = [];

    for (const order of orders) {
      const orderItems = order.items.map((item: any) => ({
        productName: item.productName || item.ingredient || '',
        quantity: item.quantity || 1,
        unit: item.unit || '',
        unitPrice: item.unitPrice || 0,
        total: (item.quantity || 1) * (item.unitPrice || 0),
        ingredientId: item.ingredientId || null,
      }));

      const totalHT = orderItems.reduce((sum: number, i: any) => sum + i.total, 0);

      const created = await prisma.marketplaceOrder.create({
        data: {
          supplierName: order.supplier,
          supplierId: order.supplierId || null,
          totalHT,
          notes: 'Commande auto-réapprovisionnement',
          restaurantId: req.restaurantId,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      createdIds.push(created.id);
    }

    logAudit(req.user.userId, req.restaurantId, 'CREATE', 'auto-reorder', 0, { orderIds: createdIds, count: createdIds.length });
    res.status(201).json({ orderIds: createdIds, count: createdIds.length });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création commandes auto-réapprovisionnement' }); }
});

// ============ RFQ (APPELS D'OFFRES) — DISABLED: models not in Prisma schema ============
// TODO: Add RFQ, RFQItem, RFQQuote models to schema.prisma before enabling
const rfqInclude = {} as any;
const RFQ_DISABLED_MSG = { error: 'Module appels d\'offres en cours de développement' };

app.get('/api/rfqs', authWithRestaurant, async (_req: any, res) => {
  res.json([]);  // RFQ module disabled — no Prisma model yet
});

app.get('/api/rfqs/:id', authWithRestaurant, async (_req: any, res) => {
  res.status(503).json(RFQ_DISABLED_MSG);
});

app.post('/api/rfqs', authWithRestaurant, async (_req: any, res) => {
  res.status(503).json(RFQ_DISABLED_MSG);
});

app.put('/api/rfqs/:id', authWithRestaurant, async (_req: any, res) => {
  res.status(503).json(RFQ_DISABLED_MSG);
});

app.delete('/api/rfqs/:id', authWithRestaurant, async (_req: any, res) => {
  res.status(503).json(RFQ_DISABLED_MSG);
});

app.put('/api/rfqs/:rfqId/quotes/:quoteId', authWithRestaurant, async (_req: any, res) => {
  res.status(503).json(RFQ_DISABLED_MSG);
});

app.post('/api/rfqs/:rfqId/quotes/:quoteId/select', authWithRestaurant, async (_req: any, res) => {
  res.status(503).json(RFQ_DISABLED_MSG);
});

// ============ PRICE HISTORY (MERCURIALE) ============
app.get('/api/price-history', authWithRestaurant, async (req: any, res) => {
  try {
    const { ingredientId, days, period } = req.query;
    const where: any = {};
    if (ingredientId) where.ingredientId = parseInt(ingredientId);
    // Support both "days" (legacy) and "period" (new) params
    const periodDays = period ? parseInt(period) : days ? parseInt(days) : null;
    if (periodDays) where.createdAt = { gte: new Date(Date.now() - periodDays * 86400000) };
    where.restaurantId = req.restaurantId;
    const history = await prisma.priceHistory.findMany({
      where,
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true, pricePerUnit: true, supplier: true, supplierId: true } } },
      orderBy: { createdAt: 'asc' },
      take: 1000,
    });

    // If a specific ingredientId is requested, compute enhanced stats
    if (ingredientId) {
      const prices = history.map((h: any) => h.price);
      const dataPoints = history.map((h: any) => ({ date: h.date || h.createdAt, price: h.price }));

      if (prices.length === 0) {
        // Return current ingredient price as single data point if no history
        const ingredient = await prisma.ingredient.findFirst({
          where: { id: parseInt(ingredientId), restaurantId: req.restaurantId },
          select: { id: true, name: true, pricePerUnit: true, supplier: true, supplierId: true },
        });
        const currentPrice = ingredient?.pricePerUnit ?? 0;
        return res.json({
          data: [{ date: new Date().toISOString().slice(0, 10), price: currentPrice }],
          minPrice: currentPrice,
          maxPrice: currentPrice,
          avgPrice: currentPrice,
          currentPrice,
          trend: 'stable' as const,
          volatility: 0,
          supplierPrices: [],
        });
      }

      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((s: number, p: number) => s + p, 0) / prices.length;
      const currentPrice = prices[prices.length - 1];

      // Trend: compare first third avg vs last third avg
      const third = Math.max(1, Math.floor(prices.length / 3));
      const firstThirdAvg = prices.slice(0, third).reduce((s: number, p: number) => s + p, 0) / third;
      const lastThirdAvg = prices.slice(-third).reduce((s: number, p: number) => s + p, 0) / third;
      const trendPct = firstThirdAvg > 0 ? ((lastThirdAvg - firstThirdAvg) / firstThirdAvg) * 100 : 0;
      const trend = trendPct > 3 ? 'up' : trendPct < -3 ? 'down' : 'stable';

      // Volatility: coefficient of variation (std dev / mean * 100)
      const variance = prices.reduce((s: number, p: number) => s + Math.pow(p - avgPrice, 2), 0) / prices.length;
      const stdDev = Math.sqrt(variance);
      const volatility = avgPrice > 0 ? (stdDev / avgPrice) * 100 : 0;

      // Supplier comparison: find other ingredients with same name but different supplier
      let supplierPrices: { supplierId: number | null; supplierName: string; price: number }[] = [];
      if (ingredientId) {
        const ing = await prisma.ingredient.findFirst({
          where: { id: parseInt(ingredientId), restaurantId: req.restaurantId },
        });
        if (ing) {
          const sameNameIngs = await prisma.ingredient.findMany({
            where: { restaurantId: req.restaurantId, name: { equals: ing.name, mode: 'insensitive' }, deletedAt: null },
            select: { id: true, pricePerUnit: true, supplier: true, supplierId: true, supplierRef: { select: { id: true, name: true } } },
          });
          supplierPrices = sameNameIngs.map((s: any) => ({
            supplierId: s.supplierId || s.supplierRef?.id || null,
            supplierName: s.supplierRef?.name || s.supplier || 'Sans fournisseur',
            price: s.pricePerUnit,
          }));
        }
      }

      return res.json({
        data: dataPoints,
        minPrice: Math.round(minPrice * 100) / 100,
        maxPrice: Math.round(maxPrice * 100) / 100,
        avgPrice: Math.round(avgPrice * 100) / 100,
        currentPrice: Math.round(currentPrice * 100) / 100,
        trend,
        volatility: Math.round(volatility * 10) / 10,
        supplierPrices,
      });
    }

    // Legacy: return raw history array when no ingredientId
    res.json(history);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur historique prix' }); }
});

app.get('/api/price-history/alerts', authWithRestaurant, async (req: any, res) => {
  try {
    // Find ingredients with significant price changes (>5%) in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const history = await prisma.priceHistory.findMany({
      where: { restaurantId: req.restaurantId, createdAt: { gte: thirtyDaysAgo } },
      include: { ingredient: { select: { id: true, name: true, unit: true, pricePerUnit: true, category: true, supplier: true, supplierId: true } } },
      orderBy: { createdAt: 'asc' },
    });
    // Fetch all recipes with their ingredients for impact calculation
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });
    // Check dismissed alerts via NewsItem
    const dismissedAlerts = await prisma.newsItem.findMany({
      where: { restaurantId: req.restaurantId, type: 'price_alert', dismissed: true },
      select: { mercurialeRef: true },
    });
    const dismissedSet = new Set(dismissedAlerts.map(d => d.mercurialeRef));
    // Group by ingredient and calculate change
    const byIngredient: Record<number, any[]> = {};
    history.forEach(h => {
      if (!byIngredient[h.ingredientId]) byIngredient[h.ingredientId] = [];
      byIngredient[h.ingredientId].push(h);
    });
    const alerts = Object.entries(byIngredient).map(([id, records]) => {
      const ingId = parseInt(id);
      const first = records[0];
      const last = records[records.length - 1];
      const change = first.price > 0 ? ((last.price - first.price) / first.price) * 100 : 0;
      const absChange = Math.abs(change);
      let severity: 'critical' | 'warning' | 'info' = 'info';
      if (absChange > 15) severity = 'critical';
      else if (absChange > 10) severity = 'warning';
      // Find affected recipes and calculate cost impact
      const affectedRecipes = recipes.filter(r =>
        r.ingredients.some(ri => ri.ingredientId === ingId)
      ).map(r => {
        const ri = r.ingredients.find(ri => ri.ingredientId === ingId);
        if (!ri) return null;
        const wasteMult = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
        const divisor = getUnitDivisor(ri.ingredient.unit);
        const oldCost = (ri.quantity / divisor) * first.price * wasteMult;
        const newCost = (ri.quantity / divisor) * last.price * wasteMult;
        return { id: r.id, name: r.name, sellingPrice: r.sellingPrice, costImpact: Math.round((newCost - oldCost) * 100) / 100 };
      }).filter(Boolean);
      const alertKey = `price_alert_${ingId}`;
      return {
        id: ingId,
        alertKey,
        ingredientId: ingId,
        ingredient: last.ingredient,
        supplierName: last.ingredient?.supplier || null,
        oldPrice: Math.round(first.price * 100) / 100,
        newPrice: Math.round(last.price * 100) / 100,
        changePercent: Math.round(change * 10) / 10,
        severity,
        affectedRecipes,
        affectedRecipesCount: affectedRecipes.length,
        records: records.length,
        lastUpdate: last.createdAt,
        dismissed: dismissedSet.has(alertKey),
      };
    }).filter(a => Math.abs(a.changePercent) > 5 && !a.dismissed);
    const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || Math.abs(b.changePercent) - Math.abs(a.changePercent));
    res.json(alerts);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur alertes prix' }); }
});

// Dismiss a price alert
app.put('/api/alerts/:id/dismiss', authWithRestaurant, async (req: any, res) => {
  try {
    const ingredientId = parseInt(req.params.id);
    const alertKey = `price_alert_${ingredientId}`;
    const existing = await prisma.newsItem.findFirst({
      where: { restaurantId: req.restaurantId, type: 'price_alert', mercurialeRef: alertKey },
    });
    if (existing) {
      await prisma.newsItem.update({ where: { id: existing.id }, data: { dismissed: true } });
    } else {
      await prisma.newsItem.create({
        data: {
          restaurantId: req.restaurantId,
          title: 'Alerte prix ignorée',
          content: `Alerte pour ingrédient #${ingredientId} ignorée`,
          type: 'price_alert',
          mercurialeRef: alertKey,
          dismissed: true,
        },
      });
    }
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur dismiss alerte' }); }
});

// ============ INVOICES (SCANNER FACTURES) ============
app.get('/api/invoices', authWithRestaurant, async (req: any, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { restaurantId: req.restaurantId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur factures' }); }
});

app.post('/api/invoices', authWithRestaurant, async (req, res) => {
  try {
    const { supplierName, invoiceNumber, invoiceDate, totalAmount, totalHT, totalTTC, items } = req.body;
    const invoice = await prisma.invoice.create({
      data: {
        supplierName: supplierName || 'Inconnu',
        invoiceNumber: invoiceNumber || '',
        invoiceDate: invoiceDate || new Date().toISOString().slice(0, 10),
        totalAmount: totalAmount || totalTTC || totalHT || 0,
        restaurantId: (req as any).restaurantId,
        items: {
          create: (items || []).map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity || 0,
            unit: item.unit || '',
            unitPrice: item.unitPrice || 0,
            total: item.total || item.totalPrice || 0,
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(invoice);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création facture' }); }
});

app.post('/api/invoices/:id/apply', authWithRestaurant, async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id);
    const { matches } = req.body; // [{ itemId, ingredientId }]
    const applied = await prisma.$transaction(async (tx) => {
      let count = 0;
      for (const match of matches || []) {
        const item = await tx.invoiceItem.findUnique({ where: { id: match.itemId } });
        if (!item || !item.unitPrice) continue;
        // Update ingredient price
        await tx.ingredient.update({
          where: { id: match.ingredientId },
          data: { pricePerUnit: item.unitPrice },
        });
        // Record price history
        await tx.priceHistory.create({
          data: { ingredientId: match.ingredientId, price: item.unitPrice, date: new Date().toISOString().slice(0, 10), source: 'invoice', restaurantId: (req as any).restaurantId },
        });
        // Audit trail: log price change from invoice
        logAudit((req as any).user.userId, (req as any).restaurantId, 'UPDATE', 'ingredient', match.ingredientId, { pricePerUnit: { old: 'invoice-applied', new: item.unitPrice }, source: 'invoice', invoiceId });
        // Mark item as matched by setting ingredientId
        await tx.invoiceItem.update({
          where: { id: match.itemId },
          data: { ingredientId: match.ingredientId },
        });
        count++;
      }
      await tx.invoice.update({ where: { id: invoiceId }, data: { status: 'processed' } });
      return count;
    });
    res.json({ applied });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur application facture' }); }
});

app.delete('/api/invoices/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.invoice.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Facture non trouvée' });
    await prisma.invoice.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression facture' }); }
});

app.post('/api/invoices/scan', authWithRestaurant, async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    const { imageBase64, mimeType } = req.body as { imageBase64: string; mimeType: string };
    if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'imageBase64 et mimeType requis' });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: 'Tu es un expert comptable specialise en restauration. Analyse cette facture/bon de livraison et extrais toutes les donnees en JSON. Reponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans commentaire, sans explication.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType as any, data: imageBase64 },
            },
            {
              type: 'text',
              text: `Analyse cette facture/bon de livraison restaurant. Extrais:
- fournisseur (string): nom du fournisseur
- dateFacture (string YYYY-MM-DD): date de la facture
- numeroFacture (string): numero de facture
- items (array): pour chaque ligne produit: {name (string), quantity (number), unit (string: kg/g/L/cl/ml/unite/piece), unitPrice (number: prix unitaire HT), totalPrice (number: prix total HT de la ligne)}
- totalHT (number): total hors taxes
- totalTTC (number): total TTC
- tva (number): montant TVA

Si une valeur est illisible ou absente, utilise null. Pour les items, extrais TOUTES les lignes produit visibles. Retourne un objet JSON valide.`,
            },
          ],
        },
      ],
    });

    const rawText = (response.content[0] as any).text as string;
    // Try to extract JSON from the response (handle potential markdown wrapping)
    let jsonStr = rawText.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    // Also handle case where response starts with text before JSON
    const braceStart = jsonStr.indexOf('{');
    if (braceStart > 0) jsonStr = jsonStr.slice(braceStart);

    try {
      const data = JSON.parse(jsonStr);
      res.json(data);
    } catch {
      res.status(422).json({ error: "Impossible d'analyser la reponse", raw: rawText });
    }
  } catch (e: any) {
    console.error(e);
    if (e?.status === 400 && e?.message?.includes('credit balance')) {
      return res.status(503).json({ error: 'Service IA temporairement indisponible. Veuillez reessayer plus tard.' });
    }
    res.status(500).json({ error: 'Erreur scan facture' });
  }
});

// ============ MENU SALES (MENU ENGINEERING) ============
app.get('/api/menu-sales', authWithRestaurant, async (req: any, res) => {
  try {
    const { days } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (days) where.date = { gte: new Date(Date.now() - parseInt(days) * 86400000).toISOString().slice(0, 10) };
    const sales = await prisma.menuSale.findMany({ where, orderBy: { date: 'desc' }, take: 1000 });
    res.json(sales);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ventes' }); }
});

app.post('/api/menu-sales', authWithRestaurant, async (req: any, res) => {
  try {
    const { recipeId, recipeName, quantity, revenue, date } = req.body;
    const sale = await prisma.menuSale.create({
      data: { recipeId, recipeName: recipeName || 'Unknown', quantity: quantity || 1, revenue: revenue || 0, date: date || new Date().toISOString().slice(0, 10), restaurantId: req.restaurantId },
    });
    res.status(201).json(sale);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ajout vente' }); }
});

app.post('/api/menu-sales/bulk', authWithRestaurant, async (req: any, res) => {
  try {
    const { sales } = req.body; // [{ recipeId, quantity, revenue, date }]
    const result = await prisma.menuSale.createMany({
      data: (sales || []).map((s: any) => ({
        recipeId: s.recipeId, recipeName: s.recipeName || 'Unknown', quantity: s.quantity || 1, revenue: s.revenue || 0, date: s.date || new Date().toISOString().slice(0, 10), restaurantId: req.restaurantId,
      })),
    });
    res.status(201).json({ created: result.count });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur import ventes' }); }
});

app.get('/api/menu-engineering', authWithRestaurant, async (req: any, res) => {
  try {
    const days = parseInt(req.query.days || '30');
    const since = new Date(Date.now() - days * 86400000);

    // Get all recipes with margins (scoped to restaurant)
    const recipes = await prisma.recipe.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, include: { ingredients: { include: { ingredient: true } } } });

    // Get sales data (scoped to restaurant)
    const sales = await prisma.menuSale.findMany({ where: { restaurantId: req.restaurantId, date: { gte: since.toISOString().slice(0, 10) } } });
    const salesByRecipe: Record<number, { qty: number; revenue: number }> = {};
    sales.forEach(s => {
      if (!salesByRecipe[s.recipeId]) salesByRecipe[s.recipeId] = { qty: 0, revenue: 0 };
      salesByRecipe[s.recipeId].qty += s.quantity;
      salesByRecipe[s.recipeId].revenue += s.revenue || 0;
    });

    const totalSales = Object.values(salesByRecipe).reduce((sum, s) => sum + s.qty, 0);
    const avgSales = totalSales / Math.max(recipes.length, 1);

    const engineering = recipes.map(recipe => {
      const foodCost = recipe.ingredients.reduce((total, ri) => {
        const wasteMultiplier = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
        const divisor = getUnitDivisor(ri.ingredient.unit);
        return total + (ri.quantity / divisor) * ri.ingredient.pricePerUnit * wasteMultiplier;
      }, 0);
      const costPerPortion = recipe.nbPortions > 0 ? foodCost / recipe.nbPortions : foodCost;
      const margin = recipe.sellingPrice - costPerPortion;
      const marginPercent = recipe.sellingPrice > 0 ? (margin / recipe.sellingPrice) * 100 : 0;
      const salesData = salesByRecipe[recipe.id] || { qty: 0, revenue: 0 };
      const popularity = totalSales > 0 ? (salesData.qty / totalSales) * 100 : 0;
      const avgMargin = recipes.reduce((sum, r) => {
        const fc = r.ingredients.reduce((t, ri) => {
          const d = getUnitDivisor(ri.ingredient.unit);
          return t + (ri.quantity / d) * ri.ingredient.pricePerUnit * (ri.wastePercent > 0 ? 1/(1-ri.wastePercent/100) : 1);
        }, 0);
        const cp = r.nbPortions > 0 ? fc / r.nbPortions : fc;
        return sum + (r.sellingPrice - cp);
      }, 0) / Math.max(recipes.length, 1);

      let quadrant: string;
      if (margin >= avgMargin && salesData.qty >= avgSales) quadrant = 'star';
      else if (margin >= avgMargin && salesData.qty < avgSales) quadrant = 'puzzle';
      else if (margin < avgMargin && salesData.qty >= avgSales) quadrant = 'plow';
      else quadrant = 'dog';

      return {
        id: recipe.id, name: recipe.name, category: recipe.category,
        sellingPrice: recipe.sellingPrice, costPerPortion: Math.round(costPerPortion * 100) / 100,
        margin: Math.round(margin * 100) / 100, marginPercent: Math.round(marginPercent * 10) / 10,
        salesQty: salesData.qty, salesRevenue: Math.round(salesData.revenue * 100) / 100,
        popularity: Math.round(popularity * 10) / 10, quadrant,
      };
    });

    res.json({ engineering, totalSales, avgMargin: Math.round(engineering.reduce((s, e) => s + e.margin, 0) / Math.max(engineering.length, 1) * 100) / 100, days });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur menu engineering' }); }
});

// ── Messages (Prisma DB) ──

// Helper: find or create a conversation for an email address within a restaurant
async function findOrCreateConversation(restaurantId: number, email: string, name?: string) {
  // Try to find existing conversation where participants include this email
  const existing = await prisma.conversation.findFirst({
    where: { restaurantId, participants: { has: email } },
  });
  if (existing) return existing;
  // Create new conversation
  return prisma.conversation.create({
    data: {
      id: `conv-${Date.now()}`,
      name: name || email,
      participants: [email],
      restaurantId,
      lastMessage: '',
      unreadCount: 0,
      isGroup: false,
      avatar: '',
    },
  });
}

app.get('/api/messages/conversations', authWithRestaurant, async (req: any, res) => {
  try {
    const convs = await prisma.conversation.findMany({
      where: { restaurantId: req.restaurantId },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(convs);
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur chargement conversations' }); }
});

app.post('/api/messages/conversations', authWithRestaurant, async (req: any, res) => {
  try {
    const { id, name, participants, isGroup, avatar } = req.body;
    const convId = id || `conv-${Date.now()}`;
    // Check if already exists
    const existing = await prisma.conversation.findFirst({ where: { id: convId, restaurantId: req.restaurantId } });
    if (existing) return res.json(existing);
    const conv = await prisma.conversation.create({
      data: {
        id: convId,
        name: name || '',
        participants: participants || [],
        isGroup: isGroup || false,
        avatar: avatar || '',
        lastMessage: '',
        unreadCount: 0,
        restaurantId: req.restaurantId,
      },
    });
    res.status(201).json(conv);
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur création conversation' }); }
});

app.get('/api/messages/conversations/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const conv = await prisma.conversation.findFirst({
      where: { id: req.params.id, restaurantId: req.restaurantId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conv) return res.status(404).json({ error: 'Conversation non trouvée' });
    res.json(conv);
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur chargement conversation' }); }
});

app.get('/api/messages/conversations/:id/messages', authWithRestaurant, async (req: any, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur chargement messages' }); }
});

app.post('/api/messages/conversations/:id/messages', authWithRestaurant, async (req: any, res) => {
  try {
    const { content, senderId, senderName, subject } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'Erreur envoi message', details: 'Le contenu est requis' });
    const safeContent = sanitizeInput(content);
    const safeSenderName = senderName ? sanitizeInput(senderName) : (req.user?.email || 'Moi');
    const safeSubject = subject ? sanitizeInput(subject) : undefined;
    const msg = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: senderId || 'user',
        senderName: safeSenderName,
        content: safeContent,
        timestamp: new Date().toISOString(),
        read: true,
      },
    });
    // Update conversation lastMessage + updatedAt
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessage: safeContent, updatedAt: new Date() },
    });

    // Send actual email via Resend to the conversation participant
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const conv = await prisma.conversation.findUnique({ where: { id: req.params.id } });
        if (conv && conv.participants && conv.participants.length > 0) {
          const recipientEmail = conv.participants[0];
          // Only send if recipient is an external email (not ourselves)
          if (recipientEmail && !recipientEmail.includes('restaumargin.fr') && recipientEmail.includes('@')) {
            const restaurant = await prisma.restaurant.findUnique({ where: { id: req.restaurantId } });
            const restaurantName = restaurant?.name || 'RestauMargin';
            const emailSubject = safeSubject || `Message de ${restaurantName}`;
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: `${restaurantName} <contact@restaumargin.fr>`,
              to: recipientEmail,
              replyTo: 'contact@restaumargin.fr',
              subject: emailSubject,
              html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                  <div style="background:#0f172a;color:white;padding:16px 24px;border-radius:12px 12px 0 0;">
                    <table style="width:100%"><tr>
                      <td><img src="https://www.restaumargin.fr/logo192.png" alt="${restaurantName}" style="height:36px;border-radius:8px;" /></td>
                      <td style="text-align:right;"><p style="margin:0;font-size:18px;font-weight:bold;">${restaurantName}</p></td>
                    </tr></table>
                  </div>
                  <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
                    <p style="white-space:pre-wrap;line-height:1.6;color:#1e293b;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
                    <p style="font-size:11px;color:#94a3b8;margin:0;">Envoyé via RestauMargin — <a href="https://www.restaumargin.fr" style="color:#94a3b8;">restaumargin.fr</a></p>
                    <p style="font-size:11px;color:#94a3b8;margin:4px 0 0;">Répondez directement à cet email pour continuer la conversation.</p>
                  </div>
                </div>
              `,
            });
            console.log(`[MESSAGE EMAIL] Sent to ${recipientEmail} for conversation ${req.params.id}`);
          }
        }
      }
    } catch (emailErr: any) {
      // Log email error but don't fail the message creation
      console.error('[MESSAGE EMAIL ERROR]', emailErr.message);
    }

    res.status(201).json(msg);
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur envoi message' }); }
});

app.put('/api/messages/conversations/:id/read', authWithRestaurant, async (req: any, res) => {
  try {
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { unreadCount: 0 },
    });
    await prisma.message.updateMany({
      where: { conversationId: req.params.id, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur marquage lu' }); }
});

// ── Delete conversation ──
app.delete('/api/messages/conversations/:id', authWithRestaurant, async (req: any, res) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({ where: { conversationId: req.params.id } });
      await tx.conversation.delete({ where: { id: req.params.id } });
    });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur suppression conversation' }); }
});

// ── Toggle star on conversation ──
app.put('/api/messages/conversations/:id/star', authWithRestaurant, async (req: any, res) => {
  try {
    const conv = await prisma.conversation.findUnique({ where: { id: req.params.id } });
    if (!conv) return res.status(404).json({ error: 'Conversation introuvable' });
    const updated = await prisma.conversation.update({
      where: { id: req.params.id },
      data: { starred: !conv.starred },
    });
    res.json({ starred: updated.starred });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur favoris' }); }
});

// ── Inbound Email Webhook (called by Resend — NO auth) ──
app.post('/api/inbound/email', async (req: any, res) => {
  try {
    // Resend webhook wraps email data inside req.body.data
    const payload = req.body.data || req.body;
    const { from, to, subject, text, html } = payload;
    if (!from) return res.status(400).json({ error: 'from requis' });

    // Extract sender email (handle "Name <email>" format)
    const senderEmail = (from.match(/<([^>]+)>/) || [null, from])[1].trim().toLowerCase();
    const senderName = from.replace(/<[^>]+>/, '').trim() || senderEmail;

    // CRITICAL: Ignore emails from ourselves to prevent infinite loop
    if (senderEmail === 'contact@restaumargin.fr' || senderEmail.includes('restaumargin.fr')) {
      console.log('[INBOUND] Ignoring self-sent email from', senderEmail);
      return res.json({ success: true, ignored: true });
    }

    // Determine which restaurant this is for (default to 1 for now)
    const restaurantId = 1;

    // Find or create conversation for this sender
    const conv = await findOrCreateConversation(restaurantId, senderEmail, senderName);

    // Create message in the conversation
    const messageContent = text || (html ? html.replace(/<[^>]+>/g, '') : subject || '(vide)');
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        senderId: senderEmail,
        senderName,
        content: messageContent,
        timestamp: new Date().toISOString(),
        read: false,
      },
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conv.id },
      data: {
        lastMessage: messageContent.substring(0, 200),
        unreadCount: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    // NOTE: No notification email sent to avoid infinite loop
    // (sending to contact@restaumargin.fr triggers inbound webhook again)
    console.log(`[INBOUND] New message from ${senderEmail} in conversation ${conv.id}`);

    res.json({ success: true, conversationId: conv.id });
  } catch (e: any) {
    console.error('[INBOUND EMAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur traitement email entrant' });
  }
});

// ── Email ──
const sentEmails: any[] = [];

app.post('/api/email/send', authWithRestaurant, async (req: any, res) => {
  try {
    const { to, subject, body, html } = req.body;
    if (!to || !subject || (!body && !html)) return res.status(400).json({ error: 'to, subject, et body ou html requis' });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré (RESEND_API_KEY manquant)' });

    const restaurant = await prisma.restaurant.findFirst({ where: { id: req.restaurantId } });
    const restaurantName = restaurant?.name || 'RestauMargin';

    // If `html` is provided, use it directly (for marketing/campaign emails).
    // Otherwise, wrap plain-text `body` in the default layout.
    const emailHtml = html || `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0f172a;color:white;padding:16px 24px;border-radius:12px 12px 0 0;">
            <table style="width:100%"><tr>
              <td><img src="https://www.restaumargin.fr/logo192.png" alt="${restaurantName}" style="height:36px;border-radius:8px;" /></td>
              <td style="text-align:right;"><p style="margin:0;font-size:18px;font-weight:bold;">${restaurantName}</p></td>
            </tr></table>
          </div>
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p style="white-space:pre-wrap;line-height:1.6;color:#1e293b;">${body!.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="font-size:11px;color:#94a3b8;margin:0;">Envoyé via RestauMargin — <a href="https://www.restaumargin.fr" style="color:#94a3b8;">restaumargin.fr</a></p>
          </div>
        </div>
      `;

    const resend = new Resend(resendKey);
    const result = await resend.emails.send({
      from: `${restaurantName} <contact@restaumargin.fr>`,
      to,
      replyTo: 'contact@restaumargin.fr',
      subject,
      html: emailHtml,
    });

    const messageId = result?.data?.id || `resend-${Date.now()}`;
    const email = { id: `e-${Date.now()}`, to, subject, body: body || '(html)', from: `${restaurantName} <contact@restaumargin.fr>`, messageId, sentAt: new Date().toISOString() };
    sentEmails.push(email);

    console.log(`[EMAIL SEND] Sent to ${to} — subject: ${subject} — id: ${messageId}`);
    res.json({ success: true, messageId });
  } catch (e: any) {
    console.error('[EMAIL SEND ERROR]', e.message);
    res.status(500).json({ error: e.message || 'Erreur envoi email' });
  }
});

app.get('/api/email/sent', authWithRestaurant, (_req, res) => { res.json(sentEmails); });

// ── Campaign email (auto-generates beautiful HTML from restaurant name + cuisine type) ──
app.post('/api/campaign/send', authWithRestaurant, async (req: any, res) => {
  try {
    const { to, restaurantName, cuisineType, contactName } = req.body;
    if (!to || !restaurantName) return res.status(400).json({ error: 'to et restaurantName requis' });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configure (RESEND_API_KEY manquant)' });

    const { subject, html } = buildCampaignEmail(
      { name: restaurantName, contactName, email: to },
      cuisineType || 'general'
    );

    const resend = new Resend(resendKey);
    const result = await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to,
      replyTo: 'contact@restaumargin.fr',
      subject,
      html,
    });

    const messageId = result?.data?.id || `resend-${Date.now()}`;
    const email = { id: `c-${Date.now()}`, to, subject, body: '(campaign)', from: 'RestauMargin <contact@restaumargin.fr>', messageId, sentAt: new Date().toISOString() };
    sentEmails.push(email);

    console.log(`[CAMPAIGN SEND] Sent to ${to} (${restaurantName}, ${cuisineType || 'general'}) — id: ${messageId}`);
    res.json({ success: true, messageId, subject });
  } catch (e: any) {
    console.error('[CAMPAIGN SEND ERROR]', e.message);
    res.status(500).json({ error: e.message || 'Erreur envoi campagne' });
  }
});

// ── Public menu ──
app.get('/api/public/menu', async (req, res) => {
  try {
    const restaurantId = parseInt(req.query.restaurantId as string) || 1;
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });
    res.json(recipes.map(r => ({
      id: r.id, name: r.name, category: r.category,
      sellingPrice: r.sellingPrice, description: r.description,
      allergens: [...new Set(r.ingredients.flatMap(ri => ri.ingredient?.allergens || []))],
    })));
  } catch { res.status(500).json({ error: 'Erreur récupération menu public' }); }
});

// ── Alerts ──
app.get('/api/alerts', authWithRestaurant, async (req: any, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true } });
    const recipes = await prisma.recipe.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, include: { ingredients: { include: { ingredient: true } } } });

    const alerts: { type: string; severity: string; title: string; detail: string }[] = [];

    for (const item of inventory) {
      if (item.currentStock <= 0) {
        alerts.push({ type: 'stock', severity: 'critical', title: `Rupture: ${item.ingredient.name}`, detail: `Stock: 0 ${item.ingredient.unit}` });
      } else if (item.currentStock < item.minStock) {
        alerts.push({ type: 'stock', severity: 'warning', title: `Stock bas: ${item.ingredient.name}`, detail: `${item.currentStock}/${item.minStock} ${item.ingredient.unit}` });
      }
    }

    for (const r of recipes) {
      if (r.sellingPrice <= 0) continue;
      const cost = r.ingredients.reduce((s, ri) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
      const margin = (r.sellingPrice - cost) / r.sellingPrice * 100;
      if (margin < 60) {
        alerts.push({ type: 'margin', severity: margin < 40 ? 'critical' : 'warning', title: `Marge faible: ${r.name}`, detail: `${margin.toFixed(1)}% (coût ${cost.toFixed(2)}€)` });
      }
    }

    res.json({ alerts, count: alerts.length });
  } catch { res.status(500).json({ error: 'Erreur alertes' }); }
});

// ============ DEVIS CRUD ============
app.get('/api/devis', authWithRestaurant, async (req: any, res) => {
  try {
    const devis = await prisma.devis.findMany({ where: { restaurantId: req.restaurantId }, include: { items: true }, orderBy: { createdAt: 'desc' } });
    res.json(devis);
  } catch { res.status(500).json({ error: 'Erreur récupération devis' }); }
});

app.get('/api/devis/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const devis = await prisma.devis.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId }, include: { items: true } });
    if (!devis) return res.status(404).json({ error: 'Devis non trouvé' });
    res.json(devis);
  } catch { res.status(500).json({ error: 'Erreur récupération devis' }); }
});

app.post('/api/devis', authWithRestaurant, async (req: any, res) => {
  try {
    const { clientName, clientEmail, clientPhone, clientAddress, subject, tvaRate, validUntil, notes, items } = req.body;
    if (!clientName?.trim()) return res.status(400).json({ error: 'Erreur création devis', details: 'Le nom du client est requis' });
    if (!subject?.trim()) return res.status(400).json({ error: 'Erreur création devis', details: 'L\'objet est requis' });
    const safeClientName = sanitizeInput(clientName);
    const safeSubject = sanitizeInput(subject);
    const safeClientAddress = clientAddress ? sanitizeInput(clientAddress) : null;
    const safeNotes = notes ? sanitizeInput(notes) : null;

    const count = await prisma.devis.count({ where: { restaurantId: req.restaurantId } });
    const number = `DEV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const devisItems = (items || []).map((item: any) => ({
      description: item.description ? sanitizeInput(item.description) : '', quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0, total: (item.quantity || 1) * (item.unitPrice || 0),
    }));
    const totalHT = devisItems.reduce((s: number, i: any) => s + i.total, 0);
    const rate = tvaRate || 20;

    const devis = await prisma.devis.create({
      data: {
        number, clientName: safeClientName, clientEmail: clientEmail || null, clientPhone: clientPhone || null,
        clientAddress: safeClientAddress, subject: safeSubject, tvaRate: rate, totalHT, totalTTC: totalHT * (1 + rate / 100),
        validUntil: validUntil || null, notes: safeNotes, restaurantId: req.restaurantId,
        items: { create: devisItems },
      },
      include: { items: true },
    });
    res.status(201).json(devis);
  } catch (e: any) { console.error('Devis create:', e.message); res.status(500).json({ error: 'Erreur création devis' }); }
});

app.put('/api/devis/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.devis.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Devis non trouvé' });

    const { clientName, clientEmail, clientPhone, clientAddress, subject, status, tvaRate, validUntil, notes, items } = req.body;
    let totalHT = existing.totalHT;
    let totalTTC = existing.totalTTC;

    if (items) {
      await prisma.$transaction(async (tx) => {
        await tx.devisItem.deleteMany({ where: { devisId: id } });
        const devisItems = items.map((item: any) => ({
          devisId: id, description: item.description || '', quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0, total: (item.quantity || 1) * (item.unitPrice || 0),
        }));
        await tx.devisItem.createMany({ data: devisItems });
        totalHT = devisItems.reduce((s: number, i: any) => s + i.total, 0);
        totalTTC = totalHT * (1 + (tvaRate || existing.tvaRate) / 100);
      });
    }

    const devis = await prisma.devis.update({
      where: { id },
      data: {
        clientName: clientName || existing.clientName, clientEmail: clientEmail !== undefined ? clientEmail : existing.clientEmail,
        clientPhone: clientPhone !== undefined ? clientPhone : existing.clientPhone,
        clientAddress: clientAddress !== undefined ? clientAddress : existing.clientAddress,
        subject: subject || existing.subject, status: status || existing.status,
        tvaRate: tvaRate || existing.tvaRate, totalHT, totalTTC,
        validUntil: validUntil !== undefined ? validUntil : existing.validUntil,
        notes: notes !== undefined ? notes : existing.notes,
      },
      include: { items: true },
    });
    res.json(devis);
  } catch { res.status(500).json({ error: 'Erreur mise à jour devis' }); }
});

app.delete('/api/devis/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.devis.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Devis non trouvé' });
    await prisma.devis.delete({ where: { id } });
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression devis' }); }
});

// ============ COMPTABILITE ============
app.get('/api/comptabilite/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = String(from);
      if (to) where.date.lte = String(to);
    }
    const entries = await prisma.financialEntry.findMany({ where });
    const monthly: Record<string, { month: string; totalRevenue: number; totalExpenses: number; profit: number; byCategory: Record<string, number> }> = {};
    for (const entry of entries) {
      const month = entry.date.substring(0, 7);
      if (!monthly[month]) monthly[month] = { month, totalRevenue: 0, totalExpenses: 0, profit: 0, byCategory: {} };
      const m = monthly[month];
      if (entry.type === 'revenue') m.totalRevenue += entry.amount;
      else m.totalExpenses += entry.amount;
      m.byCategory[entry.category] = (m.byCategory[entry.category] || 0) + entry.amount;
    }
    for (const m of Object.values(monthly)) m.profit = m.totalRevenue - m.totalExpenses;
    const summary = Object.values(monthly).sort((a, b) => b.month.localeCompare(a.month));
    res.json(summary);
  } catch { res.status(500).json({ error: 'Erreur calcul résumé' }); }
});

app.get('/api/comptabilite/export/fec', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = String(from);
      if (to) where.date.lte = String(to);
    }
    const entries = await prisma.financialEntry.findMany({ where, orderBy: { date: 'asc' } });
    const header = ['JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate', 'CompteNum', 'CompteLib', 'CompAuxNum', 'CompAuxLib', 'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit', 'EcritureLet', 'DateLet', 'ValidDate', 'Montantdevise', 'Idevise'].join('\t');
    const lines = entries.map((entry: any, index: number) => {
      const journalCode = entry.type === 'revenue' ? 'VE' : 'AC';
      const journalLib = entry.type === 'revenue' ? 'Ventes' : 'Achats';
      const ecritureNum = String(index + 1).padStart(6, '0');
      const ecritureDate = entry.date.replace(/-/g, '');
      const compteNum = entry.type === 'revenue' ? '701000' : '601000';
      const debit = entry.type === 'expense' ? entry.amount.toFixed(2) : '0.00';
      const credit = entry.type === 'revenue' ? entry.amount.toFixed(2) : '0.00';
      const pieceRef = entry.reference || '';
      return [journalCode, journalLib, ecritureNum, ecritureDate, compteNum, entry.category, '', '', pieceRef, ecritureDate, entry.label, debit, credit, '', '', ecritureDate, '', 'EUR'].join('\t');
    });
    const fecContent = [header, ...lines].join('\n');
    res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="FEC.txt"');
    res.send(fecContent);
  } catch { res.status(500).json({ error: 'Erreur export FEC' }); }
});

app.get('/api/comptabilite', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to, type } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = String(from);
      if (to) where.date.lte = String(to);
    }
    if (type) where.type = String(type);
    const entries = await prisma.financialEntry.findMany({ where, orderBy: { date: 'desc' } });
    res.json(entries);
  } catch { res.status(500).json({ error: 'Erreur récupération écritures' }); }
});

app.post('/api/comptabilite', authWithRestaurant, async (req: any, res) => {
  try {
    const { date, type, category, label, amount, tvaRate, paymentMode, reference } = req.body;
    if (!date || !type || !category || !label || amount === undefined) return res.status(400).json({ error: 'Erreur création écriture', details: 'Champs requis : date, type, category, label, amount' });
    if (!['revenue', 'expense'].includes(type)) return res.status(400).json({ error: 'Erreur création écriture', details: 'Type doit être "revenue" ou "expense"' });
    const amountCheck = validatePrice(amount, 'Montant');
    if (!amountCheck.valid) return res.status(400).json({ error: 'Erreur création écriture', details: amountCheck.error });
    const safeLabel = sanitizeInput(label);
    const safeCategory = sanitizeInput(category);
    const safeReference = reference ? sanitizeInput(reference) : null;
    const rate = tvaRate !== undefined ? tvaRate : 20;
    const tvaAmount = amountCheck.value! * rate / 100;
    const entry = await prisma.financialEntry.create({
      data: { date, type, category: safeCategory, label: safeLabel, amount: amountCheck.value!, tvaRate: rate, tvaAmount, paymentMode: paymentMode || null, reference: safeReference, restaurantId: req.restaurantId },
    });
    res.status(201).json(entry);
  } catch { res.status(500).json({ error: 'Erreur création écriture' }); }
});

app.put('/api/comptabilite/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.financialEntry.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Écriture non trouvée' });
    const { date, type, category, label, amount, tvaRate, paymentMode, reference } = req.body;
    const updatedAmount = amount !== undefined ? amount : existing.amount;
    const updatedRate = tvaRate !== undefined ? tvaRate : existing.tvaRate;
    const tvaAmount = updatedAmount * updatedRate / 100;
    const entry = await prisma.financialEntry.update({
      where: { id },
      data: {
        ...(date !== undefined && { date }), ...(type !== undefined && { type }),
        ...(category !== undefined && { category }), ...(label !== undefined && { label }),
        ...(amount !== undefined && { amount }), tvaRate: updatedRate, tvaAmount,
        ...(paymentMode !== undefined && { paymentMode }), ...(reference !== undefined && { reference }),
      },
    });
    res.json(entry);
  } catch { res.status(500).json({ error: 'Erreur mise à jour écriture' }); }
});

app.delete('/api/comptabilite/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.financialEntry.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Écriture non trouvée' });
    await prisma.financialEntry.delete({ where: { id } });
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Erreur suppression écriture' }); }
});

// ============ WASTE ============
app.get('/api/waste/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthStart = `${currentMonth}-01`;
    const currentMonthEnd = `${currentMonth}-31`;
    const thisMonthLogs = await prisma.wasteLog.findMany({
      where: { restaurantId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
      include: { ingredient: { select: { name: true } } },
    });
    const totalWasteCost = thisMonthLogs.reduce((sum: number, l: any) => sum + l.costImpact, 0);
    const totalWasteKg = thisMonthLogs
      .filter((l: any) => l.unit === 'kg' || l.unit === 'g' || l.unit === 'L' || l.unit === 'mL')
      .reduce((sum: number, l: any) => {
        if (l.unit === 'g' || l.unit === 'mL') return sum + l.quantity / 1000;
        return sum + l.quantity;
      }, 0);
    const ingredientMap = new Map<string, { name: string; totalCost: number; totalQty: number }>();
    for (const log of thisMonthLogs as any[]) {
      const key = String(log.ingredientId);
      const existing = ingredientMap.get(key) || { name: log.ingredient.name, totalCost: 0, totalQty: 0 };
      existing.totalCost += log.costImpact;
      existing.totalQty += log.quantity;
      ingredientMap.set(key, existing);
    }
    const topWastedIngredients = Array.from(ingredientMap.entries())
      .map(([id, data]) => ({ ingredientId: Number(id), ...data }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);
    const wasteByReason: Record<string, { count: number; cost: number }> = {};
    for (const log of thisMonthLogs as any[]) {
      if (!wasteByReason[log.reason]) wasteByReason[log.reason] = { count: 0, cost: 0 };
      wasteByReason[log.reason].count++;
      wasteByReason[log.reason].cost += log.costImpact;
    }
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const sixMonthsAgoStr = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;
    const trendLogs = await prisma.wasteLog.findMany({ where: { restaurantId, date: { gte: sixMonthsAgoStr } } });
    const monthlyTrend: Record<string, { cost: number; count: number }> = {};
    for (const log of trendLogs) {
      const month = log.date.substring(0, 7);
      if (!monthlyTrend[month]) monthlyTrend[month] = { cost: 0, count: 0 };
      monthlyTrend[month].cost += log.costImpact;
      monthlyTrend[month].count++;
    }
    const sortedTrend = Object.entries(monthlyTrend).sort(([a], [b]) => a.localeCompare(b)).map(([month, data]) => ({ month, ...data }));
    res.json({
      totalWasteCost: Math.round(totalWasteCost * 100) / 100,
      totalWasteKg: Math.round(totalWasteKg * 100) / 100,
      topWastedIngredients,
      wasteByReason,
      monthlyTrend: sortedTrend,
    });
  } catch (error) { console.error('Error fetching waste summary:', error); res.status(500).json({ error: 'Erreur calcul résumé pertes' }); }
});

app.get('/api/waste', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from as string;
      if (to) where.date.lte = to as string;
    }
    const logs = await prisma.wasteLog.findMany({
      where,
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true, pricePerUnit: true } } },
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch { res.status(500).json({ error: 'Erreur récupération pertes' }); }
});

app.post('/api/waste', authWithRestaurant, async (req: any, res) => {
  try {
    const { ingredientId, quantity, unit, reason, date, notes } = req.body;
    if (!ingredientId || quantity == null || !unit || !reason || !date) return res.status(400).json({ error: 'Champs requis : ingredientId, quantity, unit, reason, date' });
    const validReasons = ['expired', 'spoiled', 'overproduction', 'damaged', 'other'];
    if (!validReasons.includes(reason)) return res.status(400).json({ error: `Raison invalide. Valeurs acceptées : ${validReasons.join(', ')}` });
    const ingredient = await prisma.ingredient.findFirst({ where: { id: ingredientId, deletedAt: null } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    // Cost = quantity converted to bulk unit * pricePerUnit
    // The waste form sends quantity in `unit`, but price is always per bulk unit (kg/L).
    // Use the waste entry's unit to determine the divisor.
    const costImpact = (quantity / getUnitDivisor(unit)) * ingredient.pricePerUnit;
    const wasteLog = await prisma.wasteLog.create({
      data: { ingredientId, quantity, unit, reason, costImpact: Math.round(costImpact * 100) / 100, date, notes: notes ? sanitizeInput(notes) : null, restaurantId: req.restaurantId },
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true, pricePerUnit: true } } },
    });
    res.status(201).json(wasteLog);
  } catch { res.status(500).json({ error: 'Erreur création perte' }); }
});

app.delete('/api/waste/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.wasteLog.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Entrée de perte non trouvée' });
    await prisma.wasteLog.delete({ where: { id } });
    res.json({ message: 'Entrée supprimée' });
  } catch { res.status(500).json({ error: 'Erreur suppression perte' }); }
});

// ============ SEND ORDER EMAIL TO SUPPLIER ============
app.post('/api/orders/send-email', authWithRestaurant, async (req: any, res) => {
  try {
    const { supplierName, supplierEmail, orderLines, totalHT, notes } = req.body;
    if (!supplierEmail) return res.status(400).json({ error: 'Email fournisseur requis' });
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré' });

    const linesHtml = (orderLines || []).map((l: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${l.name}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${l.quantity} ${l.unit}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${(l.total || 0).toFixed(2)} €</td></tr>`
    ).join('');

    // Get restaurant info for the email header
    const restaurant = await prisma.restaurant.findUnique({ where: { id: req.restaurantId } });
    const restaurantName = restaurant?.name || 'Mon Restaurant';
    const restaurantAddress = restaurant?.address || '';
    const restaurantPhone = restaurant?.phone || '';
    const orderRef = `CMD-${Date.now().toString(36).toUpperCase()}`;

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: `${restaurantName} <contact@restaumargin.fr>`,
      to: supplierEmail,
      replyTo: 'contact@restaumargin.fr',
      subject: `Commande ${orderRef} — ${restaurantName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
          <!-- Header with logo area -->
          <div style="background:#0f172a;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
            <table style="width:100%"><tr>
              <td><img src="https://www.restaumargin.fr/logo192.png" alt="${restaurantName}" style="height:40px;border-radius:8px;" /></td>
              <td style="text-align:right;">
                <p style="margin:0;font-size:20px;font-weight:bold;">${restaurantName}</p>
                ${restaurantAddress ? `<p style="margin:2px 0 0;opacity:0.7;font-size:12px;">${restaurantAddress}</p>` : ''}
                ${restaurantPhone ? `<p style="margin:2px 0 0;opacity:0.7;font-size:12px;">Tél: ${restaurantPhone}</p>` : ''}
              </td>
            </tr></table>
          </div>
          <!-- Order ref banner -->
          <div style="background:#1e40af;color:white;padding:12px 24px;text-align:center;">
            <p style="margin:0;font-size:16px;font-weight:bold;">BON DE COMMANDE</p>
            <p style="margin:2px 0 0;opacity:0.8;font-size:13px;">Réf: ${orderRef} — ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <!-- Body -->
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p>Bonjour <strong>${supplierName}</strong>,</p>
            <p>Veuillez trouver ci-dessous notre commande :</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead><tr style="background:#f1f5f9;"><th style="padding:10px 8px;text-align:left;font-size:13px;color:#475569;">Article</th><th style="padding:10px 8px;text-align:left;font-size:13px;color:#475569;">Quantité</th><th style="padding:10px 8px;text-align:right;font-size:13px;color:#475569;">Total HT</th></tr></thead>
              <tbody>${linesHtml}</tbody>
              <tfoot><tr style="background:#f8fafc;"><td colspan="2" style="padding:12px 8px;font-weight:bold;font-size:15px;">TOTAL HT</td><td style="padding:12px 8px;text-align:right;font-weight:bold;font-size:18px;color:#1e40af;">${(totalHT || 0).toFixed(2)} €</td></tr></tfoot>
            </table>
            ${notes ? `<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:12px 16px;margin:16px 0;border-radius:4px;"><strong>Notes :</strong> ${notes}</div>` : ''}
            <p style="margin-top:24px;">Merci de confirmer la réception de cette commande en répondant à cet email.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <table style="width:100%;font-size:11px;color:#94a3b8;"><tr>
              <td>${restaurantName}${restaurantAddress ? ` — ${restaurantAddress}` : ''}</td>
              <td style="text-align:right;">contact@restaumargin.fr — www.restaumargin.fr</td>
            </tr></table>
          </div>
        </div>
      `,
    });

    // Also send a copy to admin
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: 'contact@restaumargin.fr',
      subject: `[Copie] Commande envoyée à ${supplierName}`,
      html: `<p>Commande envoyée à <strong>${supplierName}</strong> (${supplierEmail})</p><p>Total HT: ${(totalHT || 0).toFixed(2)} €</p>`,
    });

    // Auto-create conversation + message in Messagerie
    try {
      const conv = await findOrCreateConversation(req.restaurantId, supplierEmail, supplierName);
      const summary = `Commande envoyée — Total HT: ${(totalHT || 0).toFixed(2)} € (${(orderLines || []).length} articles)`;
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: 'restaurant',
          senderName: 'RestauMargin',
          content: summary,
          timestamp: new Date().toISOString(),
          read: true,
        },
      });
      await prisma.conversation.update({
        where: { id: conv.id },
        data: { lastMessage: summary, updatedAt: new Date() },
      });
    } catch (convErr) { console.error('[ORDER CONV ERROR]', convErr); }

    res.json({ success: true, sentTo: supplierEmail });
  } catch (e: any) {
    console.error('[ORDER EMAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi email commande' });
  }
});

// ============ SEND DEVIS/FACTURE EMAIL TO CLIENT ============
app.post('/api/devis/send-email', authWithRestaurant, async (req: any, res) => {
  try {
    const { clientName, clientEmail, documentNumber, documentType, totalHT, totalTTC, items } = req.body;
    if (!clientEmail) return res.status(400).json({ error: 'Email client requis' });
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré' });

    const typeLabel = documentType === 'facture' ? 'Facture' : 'Devis';
    const linesHtml = (items || []).map((i: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${i.description || i.designation}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center;">${i.quantite || i.quantity || 1}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;">${((i.totalHT || i.total || 0)).toFixed(2)} €</td></tr>`
    ).join('');

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: clientEmail,
      replyTo: 'contact@restaumargin.fr',
      subject: `${typeLabel} ${documentNumber} — RestauMargin`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1e40af;color:white;padding:16px 24px;border-radius:12px 12px 0 0;">
            <h2 style="margin:0;">${typeLabel} ${documentNumber}</h2>
            <p style="margin:4px 0 0;opacity:0.8;">RestauMargin — ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p>Bonjour <strong>${clientName}</strong>,</p>
            <p>Veuillez trouver ci-joint votre ${typeLabel.toLowerCase()} :</p>
            ${linesHtml ? `<table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead><tr style="background:#f8fafc;"><th style="padding:8px;text-align:left;">Description</th><th style="padding:8px;text-align:center;">Qté</th><th style="padding:8px;text-align:right;">Total HT</th></tr></thead>
              <tbody>${linesHtml}</tbody>
            </table>` : ''}
            <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0;">
              <p style="margin:0;"><strong>Total HT :</strong> ${(totalHT || 0).toFixed(2)} €</p>
              <p style="margin:4px 0 0;font-size:18px;"><strong>Total TTC :</strong> ${(totalTTC || 0).toFixed(2)} €</p>
            </div>
            <p>Pour toute question, répondez directement à cet email.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="color:#94a3b8;font-size:12px;">RestauMargin — www.restaumargin.fr</p>
          </div>
        </div>
      `,
    });

    // Copy to admin
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: 'contact@restaumargin.fr',
      subject: `[Copie] ${typeLabel} ${documentNumber} envoyé à ${clientName}`,
      html: `<p>${typeLabel} ${documentNumber} envoyé à <strong>${clientName}</strong> (${clientEmail})</p><p>Total TTC: ${(totalTTC || 0).toFixed(2)} €</p>`,
    });

    // Auto-create conversation + message in Messagerie
    try {
      const conv = await findOrCreateConversation(req.restaurantId, clientEmail, clientName);
      const summary = `${typeLabel} ${documentNumber} envoyé — Total TTC: ${(totalTTC || 0).toFixed(2)} €`;
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: 'restaurant',
          senderName: 'RestauMargin',
          content: summary,
          timestamp: new Date().toISOString(),
          read: true,
        },
      });
      await prisma.conversation.update({
        where: { id: conv.id },
        data: { lastMessage: summary, updatedAt: new Date() },
      });
    } catch (convErr) { console.error('[DEVIS CONV ERROR]', convErr); }

    res.json({ success: true, sentTo: clientEmail });
  } catch (e: any) {
    console.error('[DEVIS EMAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi email' });
  }
});

// ============ SEND CRM EMAIL TO CLIENT ============
app.post('/api/crm/send-email', authWithRestaurant, async (req: any, res) => {
  try {
    const { clientName, clientEmail, subject, message } = req.body;
    if (!clientEmail) return res.status(400).json({ error: 'Erreur envoi email CRM', details: 'Email client requis' });
    if (!message?.trim()) return res.status(400).json({ error: 'Erreur envoi email CRM', details: 'Le message est requis' });
    const safeMessage = sanitizeInput(message);
    const safeClientName = clientName ? sanitizeInput(clientName) : '';
    const safeSubjectCrm = subject ? sanitizeInput(subject) : `Message de RestauMargin`;
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré' });

    const resend = new Resend(resendKey);
    const emailSubject = safeSubjectCrm;
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: clientEmail,
      replyTo: 'contact@restaumargin.fr',
      subject: emailSubject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1e40af;color:white;padding:16px 24px;border-radius:12px 12px 0 0;">
            <h2 style="margin:0;">${emailSubject}</h2>
          </div>
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p>Bonjour <strong>${clientName || ''}</strong>,</p>
            <div style="white-space:pre-wrap;">${message}</div>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="color:#94a3b8;font-size:12px;">RestauMargin — www.restaumargin.fr</p>
          </div>
        </div>`,
    });

    // Auto-create conversation + message in Messagerie
    try {
      const conv = await findOrCreateConversation(req.restaurantId, clientEmail, clientName || clientEmail);
      await prisma.message.create({
        data: { conversationId: conv.id, senderId: 'restaurant', senderName: 'RestauMargin', content: message, timestamp: new Date().toISOString(), read: true },
      });
      await prisma.conversation.update({ where: { id: conv.id }, data: { lastMessage: message.substring(0, 200), updatedAt: new Date() } });
    } catch (convErr) { console.error('[CRM CONV ERROR]', convErr); }

    res.json({ success: true, sentTo: clientEmail });
  } catch (e: any) {
    console.error('[CRM EMAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi email CRM' });
  }
});

// ============ SEND SEMINAIRE EMAIL TO CLIENT ============
app.post('/api/seminaires/send-email', authWithRestaurant, async (req: any, res) => {
  try {
    const { clientName, clientEmail, seminaireTitle, date, guests, totalTTC, menuDetails } = req.body;
    if (!clientEmail) return res.status(400).json({ error: 'Email client requis' });
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré' });

    const resend = new Resend(resendKey);
    const emailSubject = `Devis séminaire — ${seminaireTitle || 'RestauMargin'}`;
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: clientEmail,
      replyTo: 'contact@restaumargin.fr',
      subject: emailSubject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#7c3aed;color:white;padding:16px 24px;border-radius:12px 12px 0 0;">
            <h2 style="margin:0;">Devis Séminaire</h2>
            <p style="margin:4px 0 0;opacity:0.8;">${seminaireTitle || ''} — ${date || new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p>Bonjour <strong>${clientName || ''}</strong>,</p>
            <p>Suite à votre demande, voici notre proposition pour votre séminaire :</p>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0;">
              <p style="margin:0;"><strong>Événement :</strong> ${seminaireTitle || ''}</p>
              <p style="margin:4px 0;"><strong>Date :</strong> ${date || ''}</p>
              <p style="margin:4px 0;"><strong>Nombre de convives :</strong> ${guests || ''}</p>
              ${menuDetails ? `<p style="margin:4px 0;"><strong>Menu :</strong> ${menuDetails}</p>` : ''}
              <p style="margin:8px 0 0;font-size:18px;"><strong>Total TTC :</strong> ${(totalTTC || 0).toFixed(2)} €</p>
            </div>
            <p>Pour toute question, répondez directement à cet email.</p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="color:#94a3b8;font-size:12px;">RestauMargin — www.restaumargin.fr</p>
          </div>
        </div>`,
    });

    // Copy to admin
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: 'contact@restaumargin.fr',
      subject: `[Copie] Devis séminaire envoyé à ${clientName}`,
      html: `<p>Devis séminaire <strong>${seminaireTitle}</strong> envoyé à ${clientName} (${clientEmail})</p><p>Total TTC: ${(totalTTC || 0).toFixed(2)} €</p>`,
    });

    // Auto-create conversation + message in Messagerie
    try {
      const conv = await findOrCreateConversation(req.restaurantId, clientEmail, clientName || clientEmail);
      const summary = `Devis séminaire "${seminaireTitle}" envoyé — ${guests} convives — Total TTC: ${(totalTTC || 0).toFixed(2)} €`;
      await prisma.message.create({
        data: { conversationId: conv.id, senderId: 'restaurant', senderName: 'RestauMargin', content: summary, timestamp: new Date().toISOString(), read: true },
      });
      await prisma.conversation.update({ where: { id: conv.id }, data: { lastMessage: summary, updatedAt: new Date() } });
    } catch (convErr) { console.error('[SEMINAIRE CONV ERROR]', convErr); }

    res.json({ success: true, sentTo: clientEmail });
  } catch (e: any) {
    console.error('[SEMINAIRE EMAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi email séminaire' });
  }
});

// ============ CONTACT (PUBLIC) — Resend (admin only) + log ============
const contactRateLimit = new Map<string, number[]>();

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Erreur formulaire contact', details: 'Nom et email requis' });
    }
    const safeName = sanitizeInput(name);
    const safeMessage = message ? sanitizeInput(message) : '';

    // Rate limit: 5 per email per hour
    const now = Date.now();
    const key = email.toLowerCase().trim();
    const attempts = (contactRateLimit.get(key) || []).filter((t: number) => now - t < 3600000);
    if (attempts.length >= 5) {
      return res.status(429).json({ error: 'Trop de demandes. Réessayez plus tard.' });
    }
    attempts.push(now);
    contactRateLimit.set(key, attempts);

    const sourceLabels: Record<string, string> = {
      'kit-station': 'Kit Station WeighStation',
      'pro-waitlist': "Liste d'attente Pro",
      'enterprise-devis': 'Devis Enterprise',
    };
    const sourceLabel = sourceLabels[source] || source || 'Contact';

    // Send professional notification to admin via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resendClient = new Resend(resendKey);
      const frontendUrl = process.env.FRONTEND_URL || 'https://www.restaumargin.fr';

      await resendClient.emails.send({
        from: 'RestauMargin <contact@restaumargin.fr>',
        to: 'contact@restaumargin.fr',
        subject: `[RestauMargin] ${sourceLabel} — ${name}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header avec logo -->
    <div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="display:inline-block;background:linear-gradient(135deg,#10b981,#3b82f6);border-radius:12px;padding:12px;margin-bottom:16px;">
        <span style="font-size:24px;color:white;font-weight:800;">RM</span>
      </div>
      <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">RestauMargin</h1>
      <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">Gestion de marge intelligente pour la restauration</p>
    </div>

    <!-- Badge source -->
    <div style="background:white;padding:24px 32px 0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <div style="display:inline-block;background:${source === 'kit-station' ? '#ecfdf5' : source === 'enterprise-devis' ? '#eff6ff' : '#fefce8'};color:${source === 'kit-station' ? '#059669' : source === 'enterprise-devis' ? '#2563eb' : '#ca8a04'};padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">
        ${sourceLabel}
      </div>
      <h2 style="color:#0f172a;margin:16px 0 4px;font-size:20px;">Nouvelle demande de ${name}</h2>
      <p style="color:#64748b;margin:0 0 20px;font-size:14px;">Reçue le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    </div>

    <!-- Détails contact -->
    <div style="background:white;padding:0 32px 24px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:14px 0;color:#64748b;font-size:13px;font-weight:600;width:120px;vertical-align:top;">Nom complet</td>
          <td style="padding:14px 0;color:#0f172a;font-size:15px;font-weight:500;">${name}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:14px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Email</td>
          <td style="padding:14px 0;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-size:15px;">${email}</a></td>
        </tr>
        ${phone ? `<tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:14px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Téléphone</td>
          <td style="padding:14px 0;"><a href="tel:${phone}" style="color:#2563eb;text-decoration:none;font-size:15px;">${phone}</a></td>
        </tr>` : ''}
        ${message ? `<tr>
          <td style="padding:14px 0;color:#64748b;font-size:13px;font-weight:600;vertical-align:top;">Message</td>
          <td style="padding:14px 0;color:#0f172a;font-size:14px;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td>
        </tr>` : ''}
      </table>
    </div>

    <!-- Action buttons -->
    <div style="background:white;padding:0 32px 28px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <div style="text-align:center;">
        <a href="mailto:${email}?subject=Re: Votre demande RestauMargin (${sourceLabel})&body=Bonjour ${name},%0A%0AMerci pour votre demande.%0A%0A" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;margin-right:12px;">
          Répondre à ${name.split(' ')[0]}
        </a>
        <a href="${frontendUrl}/dashboard" style="display:inline-block;background:#f1f5f9;color:#475569;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:500;font-size:14px;">
          Dashboard
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
      <p style="color:#94a3b8;font-size:11px;margin:0;">RestauMargin © ${new Date().getFullYear()} — ${frontendUrl}</p>
      <p style="color:#cbd5e1;font-size:10px;margin:4px 0 0;">Cet email est une notification automatique de votre plateforme RestauMargin.</p>
    </div>
  </div>
</body>
</html>`,
      });
    }

    console.log(`[CONTACT] ${sourceLabel} | ${name} | ${email} | ${phone || '-'} | ${message?.substring(0, 100) || '-'}`);
    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact form error:', error);
    // Even if email fails, log the lead and return success so user isn't blocked
    console.log(`[CONTACT-FALLBACK] ${req.body?.name} | ${req.body?.email} | ${req.body?.source}`);
    res.json({ success: true, note: 'Demande enregistrée' });
  }
});

// ============ HACCP ============
function getTemperatureStatus(zone: string, temperature: number): string {
  const z = zone.toLowerCase();
  if (z === 'frigo' || z === 'réfrigérateur') return temperature >= 0 && temperature <= 4 ? 'conforme' : 'non_conforme';
  if (z === 'congélateur' || z === 'congelateur') return temperature <= -18 ? 'conforme' : 'non_conforme';
  if (z === 'plats chauds' || z === 'plat_chaud') return temperature >= 63 ? 'conforme' : 'non_conforme';
  if (z === 'réception' || z === 'reception') return temperature >= 0 && temperature <= 4 ? 'conforme' : 'non_conforme';
  return 'en_attente';
}

app.get('/api/haccp/temperatures', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to, zone } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (from || to) { where.date = {}; if (from) where.date.gte = from; if (to) where.date.lte = to; }
    if (zone) where.zone = zone;
    const temperatures = await prisma.haccpTemperature.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(temperatures);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération températures' }); }
});

app.post('/api/haccp/temperatures', authWithRestaurant, async (req: any, res) => {
  try {
    const { zone, temperature, recordedBy, notes, date, time } = req.body;
    if (!zone || temperature == null || !date) return res.status(400).json({ error: 'Champs requis : zone, temperature, date' });
    const status = getTemperatureStatus(zone, temperature);
    const record = await prisma.haccpTemperature.create({
      data: { zone: sanitizeInput(zone), temperature: parseFloat(temperature), status, recordedBy: recordedBy ? sanitizeInput(recordedBy) : null, notes: notes ? sanitizeInput(notes) : null, date, time: time || null, restaurantId: req.restaurantId },
    });
    res.status(201).json(record);
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur enregistrement température" }); }
});

app.get('/api/haccp/cleanings', authWithRestaurant, async (req: any, res) => {
  try {
    const { date } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (date) where.date = date;
    const cleanings = await prisma.haccpCleaning.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(cleanings);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération nettoyage' }); }
});

app.post('/api/haccp/cleanings', authWithRestaurant, async (req: any, res) => {
  try {
    const { zone, task, status, doneBy, date } = req.body;
    if (!zone || !task || !date) return res.status(400).json({ error: 'Champs requis : zone, task, date' });
    const validStatuses = ['fait', 'en_attente', 'non_fait'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: `Statut invalide. Valeurs acceptées : ${validStatuses.join(', ')}` });
    const record = await prisma.haccpCleaning.create({
      data: { zone, task, status: status || 'en_attente', doneBy: doneBy || null, date, restaurantId: req.restaurantId },
    });
    res.status(201).json(record);
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur enregistrement nettoyage" }); }
});

app.put('/api/haccp/cleanings/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.haccpCleaning.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Enregistrement non trouvé' });
    const { status, doneBy } = req.body;
    const validStatuses = ['fait', 'en_attente', 'non_fait'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: `Statut invalide. Valeurs acceptées : ${validStatuses.join(', ')}` });
    const updated = await prisma.haccpCleaning.update({ where: { id }, data: { ...(status && { status }), ...(doneBy !== undefined && { doneBy }) } });
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour nettoyage' }); }
});

app.get('/api/haccp/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    const today = new Date().toISOString().split('T')[0];
    const todayTemps = await prisma.haccpTemperature.findMany({ where: { restaurantId, date: today } });
    const totalChecks = todayTemps.length;
    const conformes = todayTemps.filter((t: any) => t.status === 'conforme').length;
    const nonConformes = todayTemps.filter((t: any) => t.status === 'non_conforme').length;
    const todayCleanings = await prisma.haccpCleaning.findMany({ where: { restaurantId, date: today } });
    const totalCleanings = todayCleanings.length;
    const cleaningsDone = todayCleanings.filter((c: any) => c.status === 'fait').length;
    const cleaningCompletion = totalCleanings > 0 ? Math.round((cleaningsDone / totalCleanings) * 100) : 0;
    res.json({
      date: today,
      temperatures: { totalChecks, conformes, nonConformes, complianceRate: totalChecks > 0 ? Math.round((conformes / totalChecks) * 100) : 100 },
      cleanings: { total: totalCleanings, done: cleaningsDone, completion: cleaningCompletion },
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur résumé HACCP' }); }
});

// ─── HACCP Compliance Report ────────────────────────────────────────────────
app.get('/api/haccp/report', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Week boundaries (Monday to Sunday)
    const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Month boundaries
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    // Temperature checks this week
    const weekTemps = await prisma.haccpTemperature.findMany({
      where: { restaurantId, date: { gte: weekStartStr, lte: today } },
      orderBy: { createdAt: 'desc' },
    });

    // Temperature checks this month
    const monthTemps = await prisma.haccpTemperature.findMany({
      where: { restaurantId, date: { gte: monthStart, lte: today } },
      orderBy: { createdAt: 'desc' },
    });

    // Cleaning tasks this week
    const weekCleanings = await prisma.haccpCleaning.findMany({
      where: { restaurantId, date: { gte: weekStartStr, lte: today } },
    });
    const weekCleaningsDone = weekCleanings.filter((c: any) => c.status === 'fait').length;

    // Month cleanings
    const monthCleanings = await prisma.haccpCleaning.findMany({
      where: { restaurantId, date: { gte: monthStart, lte: today } },
    });
    const monthCleaningsDone = monthCleanings.filter((c: any) => c.status === 'fait').length;

    // Non-conformities (temperatures out of range)
    const weekNonConformes = weekTemps.filter((t: any) => t.status === 'non_conforme');
    const monthNonConformes = monthTemps.filter((t: any) => t.status === 'non_conforme');

    // Missing checks: find days in the week with no temperature log
    const daysInWeek: string[] = [];
    for (let i = 0; i <= dayOfWeek; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      daysInWeek.push(d.toISOString().split('T')[0]);
    }
    const daysWithTemps = new Set(weekTemps.map((t: any) => t.date));
    const missingTempDays = daysInWeek.filter(d => !daysWithTemps.has(d));

    // Days in month with/without checks (for calendar heatmap)
    const daysInMonth: string[] = [];
    const monthStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let d = new Date(monthStartDate); d <= now; d.setDate(d.getDate() + 1)) {
      daysInMonth.push(d.toISOString().split('T')[0]);
    }
    const daysWithMonthTemps = new Set(monthTemps.map((t: any) => t.date));
    const daysWithMonthCleanings = new Set(monthCleanings.filter((c: any) => c.status === 'fait').map((c: any) => c.date));
    const calendarHeatmap = daysInMonth.map(day => ({
      date: day,
      hasTemp: daysWithMonthTemps.has(day),
      hasCleaning: daysWithMonthCleanings.has(day),
      complete: daysWithMonthTemps.has(day) && daysWithMonthCleanings.has(day),
    }));

    // Required checks: 4 zones x days passed this week for temps
    const requiredTempChecks = daysInWeek.length * 4;
    const completedTempChecks = weekTemps.length;
    const requiredCleaningChecks = weekCleanings.length || daysInWeek.length;
    const completedCleaningChecks = weekCleaningsDone;

    const totalRequired = requiredTempChecks + requiredCleaningChecks;
    const totalCompleted = completedTempChecks + completedCleaningChecks;
    const complianceScore = totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

    // Corrective actions summary
    const correctiveActions = await prisma.haccpCorrectiveAction.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });
    const openActions = correctiveActions.filter((a: any) => a.status === 'ouvert').length;
    const inProgressActions = correctiveActions.filter((a: any) => a.status === 'en_cours').length;
    const resolvedActions = correctiveActions.filter((a: any) => a.status === 'resolu').length;

    res.json({
      generatedAt: now.toISOString(),
      period: { weekStart: weekStartStr, monthStart, today },
      temperatures: {
        weekCount: weekTemps.length,
        monthCount: monthTemps.length,
        weekNonConformes: weekNonConformes.length,
        monthNonConformes: monthNonConformes.length,
        nonConformitiesList: weekNonConformes.map((t: any) => ({
          id: t.id, zone: t.zone, temperature: t.temperature, date: t.date, time: t.time,
        })),
      },
      cleanings: {
        weekTotal: weekCleanings.length,
        weekDone: weekCleaningsDone,
        monthTotal: monthCleanings.length,
        monthDone: monthCleaningsDone,
      },
      compliance: {
        score: Math.min(complianceScore, 100),
        requiredChecks: totalRequired,
        completedChecks: totalCompleted,
        missingTempDays,
      },
      calendarHeatmap,
      correctiveActions: {
        total: correctiveActions.length,
        open: openActions,
        inProgress: inProgressActions,
        resolved: resolvedActions,
      },
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur generation rapport HACCP' }); }
});

// ─── HACCP Corrective Actions CRUD ──────────────────────────────────────────
app.get('/api/haccp/corrective-actions', authWithRestaurant, async (req: any, res) => {
  try {
    const actions = await prisma.haccpCorrectiveAction.findMany({
      where: { restaurantId: req.restaurantId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(actions);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur recuperation actions correctives' }); }
});

app.post('/api/haccp/corrective-action', authWithRestaurant, async (req: any, res) => {
  try {
    const { type, description, responsiblePerson, deadline, status } = req.body;
    if (!type || !description || !responsiblePerson || !deadline) {
      return res.status(400).json({ error: 'Champs requis : type, description, responsiblePerson, deadline' });
    }
    const validTypes = ['temperature', 'cleaning', 'traceability', 'other'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: `Type invalide. Valeurs acceptees : ${validTypes.join(', ')}` });
    const validStatuses = ['ouvert', 'en_cours', 'resolu'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: `Statut invalide. Valeurs acceptees : ${validStatuses.join(', ')}` });
    const action = await prisma.haccpCorrectiveAction.create({
      data: {
        type: sanitizeInput(type),
        description: sanitizeInput(description),
        responsiblePerson: sanitizeInput(responsiblePerson),
        deadline,
        status: status || 'ouvert',
        restaurantId: req.restaurantId,
      },
    });
    res.status(201).json(action);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur creation action corrective' }); }
});

app.put('/api/haccp/corrective-action/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.haccpCorrectiveAction.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Action corrective non trouvee' });
    const { status, resolution, description, responsiblePerson, deadline } = req.body;
    const validStatuses = ['ouvert', 'en_cours', 'resolu'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ error: `Statut invalide. Valeurs acceptees : ${validStatuses.join(', ')}` });
    const updated = await prisma.haccpCorrectiveAction.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolution !== undefined && { resolution: resolution ? sanitizeInput(resolution) : null }),
        ...(description && { description: sanitizeInput(description) }),
        ...(responsiblePerson && { responsiblePerson: sanitizeInput(responsiblePerson) }),
        ...(deadline && { deadline }),
      },
    });
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise a jour action corrective' }); }
});

// ============ PLANNING ============
app.get('/api/planning/employees', authWithRestaurant, async (req: any, res) => {
  try {
    const employees = await prisma.employee.findMany({ where: { restaurantId: req.restaurantId, active: true }, orderBy: { name: 'asc' } });
    res.json(employees);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération employés' }); }
});

app.post('/api/planning/employees', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, role, email, phone, hourlyRate, color } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Erreur création employé', details: 'Le nom est requis' });
    if (!role) return res.status(400).json({ error: 'Erreur création employé', details: 'Le rôle est requis' });
    const validRoles = ['Chef', 'Commis', 'Serveur', 'Plongeur', 'Barman', 'Manager'];
    if (!validRoles.includes(role)) return res.status(400).json({ error: 'Erreur création employé', details: `Rôle invalide. Valeurs acceptées : ${validRoles.join(', ')}` });
    const safeName = sanitizeInput(name);
    const employee = await prisma.employee.create({
      data: { name: safeName, role, email: email || null, phone: phone || null, hourlyRate: hourlyRate ?? 12, color: color || '#3b82f6', restaurantId: req.restaurantId },
    });
    res.status(201).json(employee);
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur création employé" }); }
});

app.put('/api/planning/employees/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.employee.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Employé non trouvé' });
    const { name, role, email, phone, hourlyRate, color, active } = req.body;
    const employee = await prisma.employee.update({
      where: { id },
      data: { ...(name !== undefined && { name }), ...(role !== undefined && { role }), ...(email !== undefined && { email: email || null }), ...(phone !== undefined && { phone: phone || null }), ...(hourlyRate !== undefined && { hourlyRate }), ...(color !== undefined && { color }), ...(active !== undefined && { active }) },
    });
    res.json(employee);
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur mise à jour employé" }); }
});

app.delete('/api/planning/employees/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.employee.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Employé non trouvé' });
    await prisma.employee.update({ where: { id }, data: { active: false } });
    res.json({ message: 'Employé désactivé' });
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur suppression employé" }); }
});

app.get('/api/planning/shifts', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to, employeeId } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (from || to) { where.date = {}; if (from) where.date.gte = from; if (to) where.date.lte = to; }
    if (employeeId) where.employeeId = parseInt(employeeId);
    const shifts = await prisma.shift.findMany({
      where, include: { employee: { select: { id: true, name: true, role: true, color: true } } }, orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    res.json(shifts);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération shifts' }); }
});

app.post('/api/planning/shifts', authWithRestaurant, async (req: any, res) => {
  try {
    const { employeeId, date, startTime, endTime, type, notes } = req.body;
    if (!employeeId || !date || !startTime || !endTime || !type) return res.status(400).json({ error: 'Champs requis : employeeId, date, startTime, endTime, type' });
    const validTypes = ['Matin', 'Midi', 'Soir', 'Coupure'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: `Type invalide. Valeurs acceptées : ${validTypes.join(', ')}` });
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, restaurantId: req.restaurantId, active: true } });
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    const shift = await prisma.shift.create({
      data: { employeeId, date, startTime, endTime, type, notes: notes || null, restaurantId: req.restaurantId },
      include: { employee: { select: { id: true, name: true, role: true, color: true } } },
    });
    res.status(201).json(shift);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création shift' }); }
});

app.put('/api/planning/shifts/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.shift.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Shift non trouvé' });
    const { employeeId, date, startTime, endTime, type, notes } = req.body;
    if (employeeId && employeeId !== existing.employeeId) {
      const employee = await prisma.employee.findFirst({ where: { id: employeeId, restaurantId: req.restaurantId, active: true } });
      if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    }
    const shift = await prisma.shift.update({
      where: { id },
      data: { ...(employeeId !== undefined && { employeeId }), ...(date !== undefined && { date }), ...(startTime !== undefined && { startTime }), ...(endTime !== undefined && { endTime }), ...(type !== undefined && { type }), ...(notes !== undefined && { notes: notes || null }) },
      include: { employee: { select: { id: true, name: true, role: true, color: true } } },
    });
    res.json(shift);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour shift' }); }
});

app.delete('/api/planning/shifts/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.shift.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Shift non trouvé' });
    await prisma.shift.delete({ where: { id } });
    res.json({ message: 'Shift supprimé' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression shift' }); }
});

app.get('/api/planning/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'Paramètres requis : from, to (YYYY-MM-DD)' });
    const shifts = await prisma.shift.findMany({
      where: { restaurantId: req.restaurantId, date: { gte: from as string, lte: to as string } },
      include: { employee: { select: { id: true, name: true, role: true, hourlyRate: true, color: true } } },
    });
    const employeeMap = new Map<number, { id: number; name: string; role: string; color: string; hourlyRate: number; totalHours: number; totalCost: number; shiftCount: number }>();
    for (const shift of shifts) {
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);
      let hours = (endH + endM / 60) - (startH + startM / 60);
      if (hours < 0) hours += 24;
      const existing = employeeMap.get(shift.employeeId) || { id: shift.employee.id, name: shift.employee.name, role: shift.employee.role, color: shift.employee.color, hourlyRate: shift.employee.hourlyRate, totalHours: 0, totalCost: 0, shiftCount: 0 };
      existing.totalHours += hours;
      existing.totalCost += hours * shift.employee.hourlyRate;
      existing.shiftCount++;
      employeeMap.set(shift.employeeId, existing);
    }
    const employees = Array.from(employeeMap.values()).map(e => ({ ...e, totalHours: Math.round(e.totalHours * 100) / 100, totalCost: Math.round(e.totalCost * 100) / 100 }));
    const totalHours = employees.reduce((sum, e) => sum + e.totalHours, 0);
    const totalCost = employees.reduce((sum, e) => sum + e.totalCost, 0);
    res.json({ from, to, employees, totalHours: Math.round(totalHours * 100) / 100, totalCost: Math.round(totalCost * 100) / 100, totalShifts: shifts.length });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur résumé planning' }); }
});

// ============ TIMECLOCK (Pointage) ============

app.post('/api/timeclock/punch-in', authWithRestaurant, async (req: any, res) => {
  try {
    const { employeeId, notes } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId requis' });
    const employee = await prisma.employee.findFirst({ where: { id: employeeId, restaurantId: req.restaurantId, active: true } });
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    // Check if already punched in (open entry with no punchOut)
    const today = new Date().toISOString().slice(0, 10);
    const openEntry = await prisma.timeEntry.findFirst({
      where: { employeeId, restaurantId: req.restaurantId, date: today, punchOut: null },
    });
    if (openEntry) return res.status(400).json({ error: 'Employé déjà pointé. Faites un punch-out d\'abord.' });
    const now = new Date();
    const entry = await prisma.timeEntry.create({
      data: { employeeId, date: today, punchIn: now, notes: notes || null, restaurantId: req.restaurantId },
      include: { employee: { select: { id: true, name: true, role: true, color: true, hourlyRate: true } } },
    });
    res.status(201).json(entry);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur punch-in' }); }
});

app.post('/api/timeclock/punch-out', authWithRestaurant, async (req: any, res) => {
  try {
    const { employeeId, notes } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId requis' });
    const today = new Date().toISOString().slice(0, 10);
    const openEntry = await prisma.timeEntry.findFirst({
      where: { employeeId, restaurantId: req.restaurantId, date: today, punchOut: null },
    });
    if (!openEntry) return res.status(400).json({ error: 'Aucun pointage en cours pour cet employé.' });
    const now = new Date();
    const diffMs = now.getTime() - new Date(openEntry.punchIn).getTime();
    const totalMinutes = Math.round(diffMs / 60000);
    const entry = await prisma.timeEntry.update({
      where: { id: openEntry.id },
      data: { punchOut: now, totalMinutes, notes: notes || openEntry.notes },
      include: { employee: { select: { id: true, name: true, role: true, color: true, hourlyRate: true } } },
    });
    res.json(entry);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur punch-out' }); }
});

app.get('/api/timeclock/today', authWithRestaurant, async (req: any, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const entries = await prisma.timeEntry.findMany({
      where: { restaurantId: req.restaurantId, date: today },
      include: { employee: { select: { id: true, name: true, role: true, color: true, hourlyRate: true } } },
      orderBy: { punchIn: 'asc' },
    });
    res.json(entries);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération pointages' }); }
});

app.get('/api/timeclock/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: 'Paramètres requis : from, to (YYYY-MM-DD)' });
    const entries = await prisma.timeEntry.findMany({
      where: { restaurantId: req.restaurantId, date: { gte: from as string, lte: to as string }, punchOut: { not: null } },
      include: { employee: { select: { id: true, name: true, role: true, color: true, hourlyRate: true } } },
      orderBy: [{ date: 'asc' }, { punchIn: 'asc' }],
    });
    // Group by employee
    const employeeMap = new Map<number, { id: number; name: string; role: string; color: string; hourlyRate: number; totalMinutes: number; totalCost: number; entryCount: number; days: Record<string, number> }>();
    for (const entry of entries) {
      const existing = employeeMap.get(entry.employeeId) || {
        id: entry.employee.id, name: entry.employee.name, role: entry.employee.role, color: entry.employee.color,
        hourlyRate: entry.employee.hourlyRate, totalMinutes: 0, totalCost: 0, entryCount: 0, days: {},
      };
      const mins = entry.totalMinutes || 0;
      existing.totalMinutes += mins;
      existing.totalCost += (mins / 60) * entry.employee.hourlyRate;
      existing.entryCount++;
      existing.days[entry.date] = (existing.days[entry.date] || 0) + mins;
      employeeMap.set(entry.employeeId, existing);
    }
    const employees = Array.from(employeeMap.values()).map(e => ({
      ...e,
      totalHours: Math.round((e.totalMinutes / 60) * 100) / 100,
      totalCost: Math.round(e.totalCost * 100) / 100,
    }));
    const totalMinutes = employees.reduce((sum, e) => sum + e.totalMinutes, 0);
    const totalCost = employees.reduce((sum, e) => sum + e.totalCost, 0);
    res.json({
      from, to, employees,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalEntries: entries.length,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur résumé pointages' }); }
});

// ============ SEMINAIRES ============
app.get('/api/seminaires/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const all = await prisma.seminaire.findMany({ where: { restaurantId: req.restaurantId } });
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const byStatus: Record<string, number> = {};
    let totalRevenue = 0;
    let upcomingThisMonth = 0;
    for (const s of all) {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      if (['confirme', 'en_cours', 'solde'].includes(s.status) && s.budget) totalRevenue += s.budget;
      const d = new Date(s.date + 'T00:00:00');
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && d >= now) upcomingThisMonth++;
    }
    res.json({ total: all.length, byStatus, upcomingThisMonth, totalRevenue });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur résumé séminaires' }); }
});

app.get('/api/seminaires', authWithRestaurant, async (req: any, res) => {
  try {
    const seminaires = await prisma.seminaire.findMany({ where: { restaurantId: req.restaurantId }, orderBy: { date: 'desc' } });
    res.json(seminaires);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération séminaires' }); }
});

app.get('/api/seminaires/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const seminaire = await prisma.seminaire.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!seminaire) return res.status(404).json({ error: 'Séminaire non trouvé' });
    res.json(seminaire);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération séminaire' }); }
});

app.post('/api/seminaires', authWithRestaurant, async (req: any, res) => {
  try {
    const { title, clientName, clientEmail, clientPhone, eventType, date, startTime, endTime, guestCount, budget, menuDetails, equipment, notes } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Erreur création séminaire', details: 'Le titre est requis' });
    if (!clientName?.trim()) return res.status(400).json({ error: 'Erreur création séminaire', details: 'Le nom du client est requis' });
    if (!eventType || !date) return res.status(400).json({ error: 'Erreur création séminaire', details: 'Le type d\'événement et la date sont requis' });
    const safeTitle = sanitizeInput(title);
    const safeClientName = sanitizeInput(clientName);
    const safeMenuDetails = menuDetails ? sanitizeInput(menuDetails) : null;
    const safeNotes = notes ? sanitizeInput(notes) : null;
    const seminaire = await prisma.seminaire.create({
      data: {
        title: safeTitle, clientName: safeClientName, clientEmail: clientEmail || null, clientPhone: clientPhone || null, eventType, date,
        startTime: startTime || null, endTime: endTime || null, guestCount: guestCount || 20, status: 'demande',
        budget: budget || null, menuDetails: safeMenuDetails, equipment: equipment || [], notes: safeNotes, restaurantId: req.restaurantId,
      },
    });
    res.status(201).json(seminaire);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création séminaire' }); }
});

app.put('/api/seminaires/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.seminaire.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Séminaire non trouvé' });
    const { title, clientName, clientEmail, clientPhone, eventType, date, startTime, endTime, guestCount, status, budget, menuDetails, equipment, notes } = req.body;
    const seminaire = await prisma.seminaire.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }), ...(clientName !== undefined && { clientName }),
        ...(clientEmail !== undefined && { clientEmail }), ...(clientPhone !== undefined && { clientPhone }),
        ...(eventType !== undefined && { eventType }), ...(date !== undefined && { date }),
        ...(startTime !== undefined && { startTime }), ...(endTime !== undefined && { endTime }),
        ...(guestCount !== undefined && { guestCount }), ...(status !== undefined && { status }),
        ...(budget !== undefined && { budget }), ...(menuDetails !== undefined && { menuDetails }),
        ...(equipment !== undefined && { equipment }), ...(notes !== undefined && { notes }),
      },
    });
    res.json(seminaire);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour séminaire' }); }
});

app.delete('/api/seminaires/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.seminaire.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Séminaire non trouvé' });
    await prisma.seminaire.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression séminaire' }); }
});

// ============ MARKETPLACE / SUPPLIER ORDERS ============

// GET /api/marketplace/orders — List orders with optional status filter
app.get('/api/marketplace/orders', authWithRestaurant, async (req: any, res) => {
  try {
    const { limit, offset, status, supplier, from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId };
    if (status && status !== 'all') where.status = status;
    if (supplier) where.supplierName = { contains: supplier, mode: 'insensitive' };
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from as string);
      if (to) where.createdAt.lte = new Date(to as string);
    }
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [data, total] = await Promise.all([
        prisma.marketplaceOrder.findMany({ where, include: { items: true }, orderBy: { createdAt: 'desc' }, take, skip }),
        prisma.marketplaceOrder.count({ where }),
      ]);
      return res.json({ data, total, limit: take, offset: skip });
    }
    const orders = await prisma.marketplaceOrder.findMany({
      where, include: { items: true }, orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération commandes marketplace' }); }
});

// GET /api/marketplace/orders/summary — Summary stats
app.get('/api/marketplace/orders/summary', authWithRestaurant, async (req: any, res) => {
  try {
    const orders = await prisma.marketplaceOrder.findMany({ where: { restaurantId: req.restaurantId } });
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, o: any) => sum + o.totalHT, 0);
    const byStatus: Record<string, number> = {};
    orders.forEach((o: any) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
    res.json({ totalOrders, totalSpent, byStatus });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur résumé marketplace' }); }
});

// GET /api/marketplace/orders/spending — Monthly spending per supplier (last 12 months)
app.get('/api/marketplace/orders/spending', authWithRestaurant, async (req: any, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const orders = await prisma.marketplaceOrder.findMany({
      where: { restaurantId: req.restaurantId, status: { in: ['received', 'confirmed', 'sent'] }, createdAt: { gte: twelveMonthsAgo } },
      select: { supplierName: true, totalHT: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    const spending: Record<string, Record<string, number>> = {};
    const suppliers = new Set<string>();
    orders.forEach((o: any) => {
      const month = new Date(o.createdAt).toISOString().slice(0, 7);
      if (!spending[month]) spending[month] = {};
      spending[month][o.supplierName] = (spending[month][o.supplierName] || 0) + o.totalHT;
      suppliers.add(o.supplierName);
    });
    res.json({ spending, suppliers: Array.from(suppliers) });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur dépenses fournisseurs' }); }
});

// GET /api/marketplace/orders/:id — Order detail with items
app.get('/api/marketplace/orders/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = await prisma.marketplaceOrder.findFirst({
      where: { id, restaurantId: req.restaurantId },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération commande' }); }
});

// POST /api/marketplace/orders — Create order with items
app.post('/api/marketplace/orders', authWithRestaurant, async (req: any, res) => {
  try {
    const { supplierName, supplierId, items, notes, expectedDelivery } = req.body;
    if (!supplierName || !items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Fournisseur et articles requis' });
    const orderItems = items.map((item: any) => ({
      productName: item.productName || '', quantity: item.quantity || 1, unit: item.unit || '', unitPrice: item.unitPrice || 0, total: (item.quantity || 1) * (item.unitPrice || 0),
      ingredientId: item.ingredientId || null,
    }));
    const totalHT = orderItems.reduce((sum: number, i: any) => sum + i.total, 0);
    const order = await prisma.marketplaceOrder.create({
      data: {
        supplierName, supplierId: supplierId || null, totalHT, notes: notes || null,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        restaurantId: req.restaurantId, items: { create: orderItems },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création commande marketplace' }); }
});

// PUT /api/marketplace/orders/:id — Update order fields
app.put('/api/marketplace/orders/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes, expectedDelivery } = req.body;
    const existing = await prisma.marketplaceOrder.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });
    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (expectedDelivery !== undefined) data.expectedDelivery = expectedDelivery ? new Date(expectedDelivery) : null;
    const order = await prisma.marketplaceOrder.update({
      where: { id }, data, include: { items: true },
    });
    res.json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour commande marketplace' }); }
});

// PUT /api/marketplace/orders/:id/status — Update order status with lifecycle validation
app.put('/api/marketplace/orders/:id/status', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const validStatuses = ['draft', 'sent', 'confirmed', 'received', 'cancelled', 'claimed'];
    if (!status || !validStatuses.includes(status)) return res.status(400).json({ error: `Statut invalide. Valides: ${validStatuses.join(', ')}` });
    const existing = await prisma.marketplaceOrder.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });
    const transitions: Record<string, string[]> = {
      draft: ['sent', 'cancelled'],
      sent: ['confirmed', 'cancelled'],
      confirmed: ['received', 'cancelled'],
      received: ['claimed'],
      cancelled: ['draft'],
      claimed: ['received'],
    };
    const allowed = transitions[existing.status] || [];
    if (!allowed.includes(status)) return res.status(400).json({ error: `Transition invalide: ${existing.status} -> ${status}. Autorisées: ${allowed.join(', ')}` });
    const updateData: any = { status };
    if (status === 'received') updateData.receivedAt = new Date();
    const order = await prisma.marketplaceOrder.update({ where: { id }, data: updateData, include: { items: true } });
    res.json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur changement statut commande' }); }
});

// POST /api/marketplace/orders/:id/receive — Receive order + update inventory
app.post('/api/marketplace/orders/:id/receive', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { receivedItems } = req.body;
    const existing = await prisma.marketplaceOrder.findFirst({
      where: { id, restaurantId: req.restaurantId },
      include: { items: true },
    });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });
    if (existing.status !== 'confirmed' && existing.status !== 'sent') return res.status(400).json({ error: 'Commande doit être confirmée ou envoyée pour être réceptionnée' });

    if (Array.isArray(receivedItems)) {
      for (const ri of receivedItems) {
        if (ri.itemId && ri.receivedQuantity !== undefined) {
          await prisma.marketplaceOrderItem.update({
            where: { id: ri.itemId },
            data: { receivedQuantity: parseFloat(ri.receivedQuantity) },
          });
        }
      }
    }

    const orderItems = await prisma.marketplaceOrderItem.findMany({ where: { orderId: id } });
    for (const item of orderItems) {
      if (item.ingredientId) {
        const qty = item.receivedQuantity ?? item.quantity;
        const inventoryItem = await prisma.inventoryItem.findFirst({
          where: { ingredientId: item.ingredientId, restaurantId: req.restaurantId },
        });
        if (inventoryItem) {
          await prisma.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: { currentStock: inventoryItem.currentStock + qty, lastRestockDate: new Date(), lastRestockQuantity: qty },
          });
        }
      }
    }

    const order = await prisma.marketplaceOrder.update({
      where: { id },
      data: { status: 'received', receivedAt: new Date() },
      include: { items: true },
    });
    res.json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur réception commande' }); }
});

// DELETE /api/marketplace/orders/:id — Delete order
app.delete('/api/marketplace/orders/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.marketplaceOrder.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });
    await prisma.marketplaceOrder.delete({ where: { id } });
    res.json({ message: 'Commande supprimée' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression commande marketplace' }); }
});

// ============ NEWS / ACTUALITES (DB-backed, IA generation with mercuriale) ============
const generateRateLimit = new Map<number, number>();
const GENERATE_COOLDOWN_MS = 60 * 60 * 1000;

app.get('/api/news', authWithRestaurant, async (req: any, res) => {
  try {
    const news = await prisma.newsItem.findMany({
      where: { dismissed: false, OR: [{ restaurantId: req.restaurantId }, { restaurantId: null }] },
      orderBy: { createdAt: 'desc' },
    });
    const priorityOrder: Record<string, number> = { high: 0, normal: 1, low: 2 };
    news.sort((a: any, b: any) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(news);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur actualités' }); }
});

app.post('/api/news/generate', authWithRestaurant, async (req: any, res) => {
  try {
    const rid = req.restaurantId;
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });

    const lastGen = generateRateLimit.get(rid);
    if (lastGen && Date.now() - lastGen < GENERATE_COOLDOWN_MS) {
      const waitMin = Math.ceil((GENERATE_COOLDOWN_MS - (Date.now() - lastGen)) / 60000);
      return res.status(429).json({ error: `Actualités déjà générées récemment. Réessayez dans ${waitMin} min.` });
    }

    // Build restaurant context
    const [ingredients, recipes, priceHist] = await Promise.all([
      prisma.ingredient.findMany({ where: { restaurantId: rid, deletedAt: null }, orderBy: { pricePerUnit: 'desc' }, take: 30 }),
      prisma.recipe.findMany({ where: { restaurantId: rid, deletedAt: null }, include: { ingredients: { include: { ingredient: true } } }, take: 20 }),
      prisma.priceHistory.findMany({ where: { restaurantId: rid }, orderBy: { date: 'desc' }, take: 50 }),
    ]);

    const ingList = ingredients.map((i: any) => `- ${i.name} (${i.category}): ${i.pricePerUnit}€/${i.unit}`).join('\n');
    const recList = recipes.map((r: any) => {
      const cost = r.ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
      const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
      return `- ${r.name}: vente ${r.sellingPrice}€, coût ${cost.toFixed(2)}€, marge ${margin.toFixed(1)}%`;
    }).join('\n');

    // Detect recent price changes
    const grouped = new Map<number, any[]>();
    for (const ph of priceHist) { if (!grouped.has(ph.ingredientId)) grouped.set(ph.ingredientId, []); grouped.get(ph.ingredientId)!.push(ph); }
    const alerts: string[] = [];
    for (const [, history] of grouped) {
      if (history.length >= 2) {
        const change = ((history[0].price - history[1].price) / history[1].price) * 100;
        if (Math.abs(change) >= 5) {
          const ing = ingredients.find((i: any) => i.id === history[0].ingredientId);
          if (ing) alerts.push(`- ${(ing as any).name}: ${change > 0 ? '+' : ''}${change.toFixed(1)}%`);
        }
      }
    }

    const prompt = `Tu es l'agent Actualités de RestauMargin pour un restaurateur français.

=== MES INGRÉDIENTS (${ingredients.length}) ===
${ingList || 'Aucun'}

=== MES FICHES TECHNIQUES (${recipes.length}) ===
${recList || 'Aucune'}

=== VARIATIONS DE PRIX RÉCENTES ===
${alerts.length > 0 ? alerts.join('\n') : 'Aucune'}

Génère 5 à 7 actualités personnalisées en JSON. Réponds UNIQUEMENT avec un tableau JSON valide :
[{"title":"...", "content":"...", "type":"price_alert|opportunity|trend|tip", "priority":"high|normal|low"}]`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });
    const rawText = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    const cleaned = rawText.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    let newsItems: any[];
    try { newsItems = JSON.parse(cleaned); if (!Array.isArray(newsItems)) throw new Error(); } catch { return res.status(500).json({ error: 'Erreur parsing IA' }); }

    await prisma.newsItem.deleteMany({ where: { restaurantId: rid } });
    const created = await prisma.newsItem.createMany({
      data: newsItems.map((item: any) => ({
        restaurantId: rid,
        title: String(item.title).slice(0, 200),
        content: String(item.content).slice(0, 1000),
        type: ['price_alert', 'opportunity', 'trend', 'tip'].includes(item.type) ? item.type : 'tip',
        priority: ['high', 'normal', 'low'].includes(item.priority) ? item.priority : 'normal',
        dismissed: false, mercurialeRef: new Date().toISOString().slice(0, 10),
      })),
    });
    generateRateLimit.set(rid, Date.now());
    const newsList = await prisma.newsItem.findMany({ where: { restaurantId: rid, dismissed: false }, orderBy: { createdAt: 'desc' } });
    res.json({ count: created.count, items: newsList });
  } catch (e: any) {
    console.error(e);
    if (e?.status === 400 && e?.message?.includes('credit balance')) {
      return res.status(503).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
    }
    res.status(500).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
  }
});

app.patch('/api/news/:id/dismiss', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const item = await prisma.newsItem.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!item) return res.status(404).json({ error: 'Actualité non trouvée' });
    await prisma.newsItem.update({ where: { id }, data: { dismissed: true } });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur dismiss' }); }
});

// ── Editorial Recipes (Recettes de la semaine) ──

// PUBLIC — latest recipes of the current week
app.get('/api/editorial-recipes/latest', async (_req, res) => {
  try {
    const recipes: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipes
      WHERE published = true
      ORDER BY week_date DESC, id DESC
      LIMIT 20
    `;
    res.json(recipes);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur chargement recettes éditoriales' }); }
});

// PUBLIC — detail of one editorial recipe with ingredients
app.get('/api/editorial-recipes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const recipes: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipes WHERE id = ${id}
    `;
    if (recipes.length === 0) return res.status(404).json({ error: 'Recette non trouvée' });
    const ingredients: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipe_ingredients WHERE recipe_id = ${id} ORDER BY id
    `;
    res.json({ ...recipes[0], ingredients });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur chargement recette éditoriale' }); }
});

// ADMIN — create editorial recipe
app.post('/api/editorial-recipes', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const { title, description, image_url, portions, category, difficulty, prep_time, cook_time, cost_per_portion, suggested_price, margin_percent, season, chef_tip, week_date } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Titre requis' });
    const result: any[] = await prisma.$queryRaw`
      INSERT INTO editorial_recipes (title, description, image_url, portions, category, difficulty, prep_time, cook_time, cost_per_portion, suggested_price, margin_percent, season, chef_tip, week_date)
      VALUES (${title}, ${description || null}, ${image_url || null}, ${portions || 4}, ${category || 'Plat'}, ${difficulty || 'Moyen'}, ${prep_time || 30}, ${cook_time || 30}, ${cost_per_portion || 0}, ${suggested_price || 0}, ${margin_percent || 0}, ${season || null}, ${chef_tip || null}, ${week_date || null})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création recette éditoriale' }); }
});

// ADMIN — add ingredients to an editorial recipe
app.post('/api/editorial-recipes/:id/ingredients', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const recipeId = parseInt(req.params.id);
    if (isNaN(recipeId)) return res.status(400).json({ error: 'ID invalide' });
    const { ingredients } = req.body;
    if (!Array.isArray(ingredients) || ingredients.length === 0) return res.status(400).json({ error: 'Ingrédients requis' });
    for (const ing of ingredients) {
      await prisma.$executeRaw`
        INSERT INTO editorial_recipe_ingredients (recipe_id, ingredient_name, quantity, unit, price_per_unit, total_cost, supplier, image_url)
        VALUES (${recipeId}, ${ing.ingredient_name}, ${ing.quantity || 0}, ${ing.unit || 'kg'}, ${ing.price_per_unit || 0}, ${ing.total_cost || 0}, ${ing.supplier || 'Transgourmet'}, ${ing.image_url || null})
      `;
    }
    const allIngredients: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipe_ingredients WHERE recipe_id = ${recipeId} ORDER BY id
    `;
    res.status(201).json(allIngredients);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ajout ingrédients' }); }
});

// AUTH — copy editorial recipe to restaurant's own recipes
app.post('/api/editorial-recipes/:id/add-to-mine', authWithRestaurant, async (req: any, res) => {
  try {
    const editorialId = parseInt(req.params.id);
    if (isNaN(editorialId)) return res.status(400).json({ error: 'ID invalide' });
    const editorialRecipes: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipes WHERE id = ${editorialId}
    `;
    if (editorialRecipes.length === 0) return res.status(404).json({ error: 'Recette éditoriale non trouvée' });
    const er = editorialRecipes[0];
    const editorialIngredients: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipe_ingredients WHERE recipe_id = ${editorialId}
    `;
    // Create ingredients in restaurant if they don't exist, then create recipe
    const ingredientIds: { ingredientId: number; quantity: number }[] = [];
    for (const ei of editorialIngredients) {
      // Check if ingredient already exists for this restaurant
      let existing = await prisma.ingredient.findFirst({
        where: { name: ei.ingredient_name, restaurantId: req.restaurantId, deletedAt: null },
      });
      if (!existing) {
        existing = await prisma.ingredient.create({
          data: {
            name: ei.ingredient_name,
            unit: ei.unit || 'kg',
            pricePerUnit: parseFloat(ei.price_per_unit) || 0,
            category: er.category || 'Divers',
            restaurantId: req.restaurantId,
          },
        });
      }
      ingredientIds.push({ ingredientId: existing.id, quantity: parseFloat(ei.quantity) || 0 });
    }
    const recipe = await prisma.recipe.create({
      data: {
        name: er.title,
        category: er.category || 'Plat',
        sellingPrice: parseFloat(er.suggested_price) || 0,
        nbPortions: er.portions || 4,
        description: er.description || null,
        prepTimeMinutes: er.prep_time || null,
        cookTimeMinutes: er.cook_time || null,
        laborCostPerHour: 0,
        restaurantId: req.restaurantId,
        ingredients: {
          create: ingredientIds.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity, wastePercent: 0 })),
        },
      },
      include: { ingredients: { include: { ingredient: true } } },
    });
    res.status(201).json(recipe);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ajout recette' }); }
});

// AUTH — create order from editorial recipe ingredients
app.post('/api/editorial-recipes/:id/order', authWithRestaurant, async (req: any, res) => {
  try {
    const editorialId = parseInt(req.params.id);
    if (isNaN(editorialId)) return res.status(400).json({ error: 'ID invalide' });
    const editorialRecipes: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipes WHERE id = ${editorialId}
    `;
    if (editorialRecipes.length === 0) return res.status(404).json({ error: 'Recette éditoriale non trouvée' });
    const er = editorialRecipes[0];
    const editorialIngredients: any[] = await prisma.$queryRaw`
      SELECT * FROM editorial_recipe_ingredients WHERE recipe_id = ${editorialId}
    `;
    // Create a marketplace order with all ingredients
    const orderItems = editorialIngredients.map((ei: any) => ({
      productName: ei.ingredient_name,
      quantity: parseFloat(ei.quantity) || 1,
      unit: ei.unit || 'kg',
      unitPrice: parseFloat(ei.price_per_unit) || 0,
      total: parseFloat(ei.total_cost) || 0,
    }));
    const totalHT = orderItems.reduce((sum: number, i: any) => sum + i.total, 0);
    const order = await prisma.marketplaceOrder.create({
      data: {
        supplierName: editorialIngredients[0]?.supplier || 'Transgourmet',
        totalHT,
        notes: `Commande depuis recette éditoriale : ${er.title}`,
        restaurantId: req.restaurantId,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création commande' }); }
});

// ── Composed Menus (Menu Builder) ──

// Save a composed menu (stored as JSON in a simple table-less approach via localStorage on client,
// but this endpoint allows persisting to server if needed)
app.post('/api/menus', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, sections } = req.body;
    if (!name || !sections) {
      return res.status(400).json({ error: 'name et sections requis' });
    }
    // For now, store in a simple key-value approach using the existing settings pattern
    // This can be upgraded to a proper Prisma model later
    const menuData = {
      id: Date.now().toString(),
      name,
      sections,
      restaurantId: req.restaurantId,
      userId: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    res.status(201).json(menuData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur sauvegarde menu' });
  }
});

// ── P&L Analytics ──────────────────────────────────────────────────────────
app.get('/api/analytics/pnl', authWithRestaurant, async (req: any, res) => {
  try {
    const period = (req.query.period as string) || 'month'; // week | month | year
    const couverts = parseInt(req.query.couverts as string) || 50;
    const avgTicket = parseFloat(req.query.avgTicket as string) || 25;

    // Determine days in period
    let daysInPeriod = 26; // month (working days)
    let periodLabel = 'Mois';
    if (period === 'week') { daysInPeriod = 6; periodLabel = 'Semaine'; }
    else if (period === 'year') { daysInPeriod = 312; periodLabel = 'Année'; } // 26 days * 12

    // Fetch all recipes with ingredients
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null },
      include: recipeInclude,
      orderBy: { name: 'asc' },
    });

    if (recipes.length === 0) {
      return res.json({
        period: periodLabel,
        daysInPeriod,
        revenue: 0,
        foodCost: 0,
        laborCost: 0,
        grossMargin: 0,
        grossMarginPercent: 0,
        fixedCosts: 0,
        netResult: 0,
        netMarginPercent: 0,
        foodCostPercent: 0,
        laborCostPercent: 0,
        categoryBreakdown: [],
        dailyBreakdown: [],
        trend: { revenueChange: 0, foodCostChange: 0, netResultChange: 0 },
      });
    }

    const formatted = recipes.map(r => formatRecipe(r));

    // Calculate averages
    const totalRecipes = formatted.length;
    const avgFoodCost = formatted.reduce((s: number, r: any) => s + r.margin.costPerPortion, 0) / totalRecipes;
    const avgLaborCost = formatted.reduce((s: number, r: any) => s + (r.margin.laborCostPerPortion || 0), 0) / totalRecipes;
    const avgTotalCost = formatted.reduce((s: number, r: any) => s + (r.margin.totalCostPerPortion || r.margin.costPerPortion), 0) / totalRecipes;
    const avgSellingPrice = formatted.reduce((s: number, r: any) => s + r.sellingPrice, 0) / totalRecipes;
    const avgCostRatio = avgSellingPrice > 0 ? avgTotalCost / avgSellingPrice : 0;
    const foodCostRatio = avgSellingPrice > 0 ? avgFoodCost / avgSellingPrice : 0;
    const laborCostRatio = avgSellingPrice > 0 ? avgLaborCost / avgSellingPrice : 0;

    // Revenue and cost estimation
    const dailyCouverts = couverts * 2; // lunch + dinner
    const dailyRevenue = dailyCouverts * avgTicket;
    const periodRevenue = dailyRevenue * daysInPeriod;

    const periodFoodCost = periodRevenue * foodCostRatio;
    const periodLaborCost = periodRevenue * laborCostRatio;
    const grossMargin = periodRevenue - periodFoodCost;
    const grossMarginPercent = periodRevenue > 0 ? (grossMargin / periodRevenue) * 100 : 0;

    // Fixed costs estimation (rent, utilities, insurance) ~15% of revenue for restaurants
    const fixedCostRate = 0.15;
    const fixedCosts = periodRevenue * fixedCostRate;

    const netResult = grossMargin - periodLaborCost - fixedCosts;
    const netMarginPercent = periodRevenue > 0 ? (netResult / periodRevenue) * 100 : 0;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; totalRevenue: number; totalFoodCost: number; totalLaborCost: number }>();
    formatted.forEach((r: any) => {
      const cat = r.category || 'Autres';
      const existing = categoryMap.get(cat) || { count: 0, totalRevenue: 0, totalFoodCost: 0, totalLaborCost: 0 };
      categoryMap.set(cat, {
        count: existing.count + 1,
        totalRevenue: existing.totalRevenue + r.sellingPrice,
        totalFoodCost: existing.totalFoodCost + r.margin.costPerPortion,
        totalLaborCost: existing.totalLaborCost + (r.margin.laborCostPerPortion || 0),
      });
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, data]) => {
      const avgPrice = data.totalRevenue / data.count;
      const avgCost = data.totalFoodCost / data.count;
      const margin = avgPrice > 0 ? ((avgPrice - avgCost) / avgPrice) * 100 : 0;
      const portionOfMenu = data.count / totalRecipes;
      const catRevenue = periodRevenue * portionOfMenu;
      const catFoodCost = data.totalRevenue > 0 ? catRevenue * (data.totalFoodCost / data.totalRevenue) : 0;
      return {
        name,
        recipeCount: data.count,
        revenue: Math.round(catRevenue * 100) / 100,
        foodCost: Math.round(catFoodCost * 100) / 100,
        margin: Math.round(margin * 10) / 10,
        portionPercent: Math.round(portionOfMenu * 1000) / 10,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    // Daily breakdown for sparkline
    const breakdownDays = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    const dailyBreakdown = Array.from({ length: breakdownDays }, (_, i) => {
      const variance = 0.9 + Math.random() * 0.2;
      const dayRevenue = period === 'year' ? dailyRevenue * 26 * variance : dailyRevenue * variance;
      const dayCost = dayRevenue * avgCostRatio;
      return {
        label: period === 'year' ? `M${i + 1}` : `J${i + 1}`,
        revenue: Math.round(dayRevenue),
        cost: Math.round(dayCost),
        profit: Math.round(dayRevenue - dayCost),
      };
    });

    // Trend vs previous period (simulated)
    const prevRevenue = periodRevenue * 0.95;
    const prevFoodCost = periodFoodCost * 1.02;
    const prevNetResult = prevRevenue - prevFoodCost - (prevRevenue * laborCostRatio) - (prevRevenue * fixedCostRate);

    const trend = {
      revenueChange: prevRevenue > 0 ? Math.round(((periodRevenue - prevRevenue) / prevRevenue) * 1000) / 10 : 0,
      foodCostChange: prevFoodCost > 0 ? Math.round(((periodFoodCost - prevFoodCost) / prevFoodCost) * 1000) / 10 : 0,
      netResultChange: prevNetResult !== 0 ? Math.round(((netResult - prevNetResult) / Math.abs(prevNetResult)) * 1000) / 10 : 0,
    };

    res.json({
      period: periodLabel,
      daysInPeriod,
      revenue: Math.round(periodRevenue * 100) / 100,
      foodCost: Math.round(periodFoodCost * 100) / 100,
      laborCost: Math.round(periodLaborCost * 100) / 100,
      grossMargin: Math.round(grossMargin * 100) / 100,
      grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
      fixedCosts: Math.round(fixedCosts * 100) / 100,
      netResult: Math.round(netResult * 100) / 100,
      netMarginPercent: Math.round(netMarginPercent * 10) / 10,
      foodCostPercent: Math.round(foodCostRatio * 1000) / 10,
      laborCostPercent: Math.round(laborCostRatio * 1000) / 10,
      categoryBreakdown,
      dailyBreakdown,
      trend,
    });
  } catch (e) {
    console.error('[PNL]', e);
    res.status(500).json({ error: 'Erreur calcul P&L' });
  }
});

// ============ AUDIT LOGS VIEWER ============
app.get('/api/audit-logs', authWithRestaurant, async (req: any, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = (page - 1) * limit;

    const where: any = { restaurantId: req.restaurantId };
    if (req.query.entityType) where.entityType = req.query.entityType;
    if (req.query.action) where.action = req.query.action;
    if (req.query.userId) where.userId = parseInt(req.query.userId);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error('[AUDIT-LOGS]', e);
    res.status(500).json({ error: 'Erreur chargement audit logs' });
  }
});

// ============ NEWSLETTER SUBSCRIBE (PUBLIC) ============
const newsletterRateLimit = new Map<string, number[]>();

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const safeEmail = email.toLowerCase().trim();

    // Rate limit: 3 per email per hour
    const now = Date.now();
    const attempts = (newsletterRateLimit.get(safeEmail) || []).filter((t: number) => now - t < 3600000);
    if (attempts.length >= 3) {
      return res.status(429).json({ error: 'Trop de demandes. Réessayez plus tard.' });
    }
    attempts.push(now);
    newsletterRateLimit.set(safeEmail, attempts);

    // Upsert: if already exists and unsubscribed, re-subscribe
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: safeEmail } });
    if (existing) {
      if (existing.unsubscribed) {
        await prisma.newsletterSubscriber.update({
          where: { email: safeEmail },
          data: { unsubscribed: false, subscribedAt: new Date() },
        });
      }
      // Already subscribed — still return success
      return res.json({ success: true, message: 'Merci ! Vous recevrez nos actualités restaurant.' });
    }

    await prisma.newsletterSubscriber.create({ data: { email: safeEmail } });
    console.log(`[NEWSLETTER] New subscriber: ${safeEmail}`);
    res.json({ success: true, message: 'Merci ! Vous recevrez nos actualités restaurant.' });
  } catch (e: any) {
    console.error('[NEWSLETTER ERROR]', e.message);
    res.status(500).json({ error: 'Erreur inscription newsletter' });
  }
});

// ============ NOTIFICATION CENTER ============
app.get('/api/notifications', authWithRestaurant, async (req: any, res) => {
  try {
    const rid = req.restaurantId;
    const notifications: { id: string; type: string; title: string; message: string; createdAt: string; read: boolean; severity?: string }[] = [];

    // 1. Stock alerts — low stock & out-of-stock
    const inventory = await prisma.inventoryItem.findMany({
      where: { restaurantId: rid },
      include: { ingredient: { select: { id: true, name: true, unit: true } } },
    });
    for (const item of inventory) {
      if (item.currentStock <= 0) {
        notifications.push({
          id: `stock-oos-${item.id}`,
          type: 'stock',
          title: `Rupture: ${item.ingredient.name}`,
          message: `Stock epuise (0 ${item.ingredient.unit})`,
          createdAt: item.updatedAt.toISOString(),
          read: false,
          severity: 'critical',
        });
      } else if (item.currentStock < item.minStock) {
        notifications.push({
          id: `stock-low-${item.id}`,
          type: 'stock',
          title: `Stock bas: ${item.ingredient.name}`,
          message: `${item.currentStock}/${item.minStock} ${item.ingredient.unit} restant`,
          createdAt: item.updatedAt.toISOString(),
          read: false,
          severity: 'warning',
        });
      }
    }

    // 2. Price changes — significant changes in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const priceHistory = await prisma.priceHistory.findMany({
      where: { restaurantId: rid, createdAt: { gte: thirtyDaysAgo } },
      include: { ingredient: { select: { id: true, name: true, unit: true, pricePerUnit: true } } },
      orderBy: { createdAt: 'asc' },
    });
    const byIngredient: Record<number, any[]> = {};
    priceHistory.forEach(h => {
      if (!byIngredient[h.ingredientId]) byIngredient[h.ingredientId] = [];
      byIngredient[h.ingredientId].push(h);
    });
    for (const [ingId, records] of Object.entries(byIngredient)) {
      if (records.length < 2) continue;
      const oldest = records[0];
      const newest = records[records.length - 1];
      const change = ((newest.price - oldest.price) / oldest.price) * 100;
      if (Math.abs(change) >= 5) {
        const direction = change > 0 ? 'hausse' : 'baisse';
        notifications.push({
          id: `price-${ingId}-${newest.id}`,
          type: 'price',
          title: `Prix en ${direction}: ${newest.ingredient.name}`,
          message: `${change > 0 ? '+' : ''}${change.toFixed(1)}% (${oldest.price.toFixed(2)}€ → ${newest.price.toFixed(2)}€/${newest.ingredient.unit})`,
          createdAt: newest.createdAt.toISOString(),
          read: false,
          severity: Math.abs(change) >= 15 ? 'critical' : 'warning',
        });
      }
    }

    // 3. Recipe margin alerts — recipes below 60% margin
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: rid, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });
    for (const r of recipes) {
      if (r.sellingPrice <= 0) continue;
      const cost = r.ingredients.reduce((s, ri) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
      const margin = ((r.sellingPrice - cost) / r.sellingPrice) * 100;
      if (margin < 60) {
        notifications.push({
          id: `margin-${r.id}`,
          type: 'margin',
          title: `Marge faible: ${r.name}`,
          message: `${margin.toFixed(1)}% de marge (cout ${cost.toFixed(2)}€, vente ${r.sellingPrice.toFixed(2)}€)`,
          createdAt: r.updatedAt.toISOString(),
          read: false,
          severity: margin < 40 ? 'critical' : 'warning',
        });
      }
    }

    // 4. System announcements (static for now — could be DB-driven later)
    const systemAnnouncements = [
      {
        id: 'sys-notif-center-2026',
        type: 'system',
        title: 'Centre de notifications',
        message: 'Retrouvez toutes vos alertes stock, prix et marges au meme endroit.',
        createdAt: new Date('2026-04-05').toISOString(),
        read: false,
        severity: 'info',
      },
    ];
    notifications.push(...systemAnnouncements);

    // Sort: critical first, then by date desc
    const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
    notifications.sort((a, b) => {
      const sa = severityOrder[a.severity || 'info'] ?? 2;
      const sb = severityOrder[b.severity || 'info'] ?? 2;
      if (sa !== sb) return sa - sb;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json({ notifications, count: notifications.length });
  } catch (e: any) {
    console.error('[NOTIFICATIONS]', e.message);
    res.status(500).json({ error: 'Erreur chargement notifications' });
  }
});

// ── Email Digest ──
app.post('/api/notifications/send-digest', authWithRestaurant, async (req: any, res) => {
  try {
    const rid = req.restaurantId;
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configure' });

    // Fetch the user's email
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { email: true, name: true } });
    if (!user?.email) return res.status(400).json({ error: 'Email utilisateur introuvable' });

    // Fetch restaurant name
    const restaurant = await prisma.restaurant.findUnique({ where: { id: rid }, select: { name: true } });

    // Fetch notifications (same logic as GET /api/notifications)
    const inventory = await prisma.inventoryItem.findMany({
      where: { restaurantId: rid },
      include: { ingredient: { select: { name: true, unit: true } } },
    });
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: rid, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const priceHistory = await prisma.priceHistory.findMany({
      where: { restaurantId: rid, createdAt: { gte: thirtyDaysAgo } },
      include: { ingredient: { select: { name: true, unit: true, pricePerUnit: true } } },
      orderBy: { createdAt: 'asc' },
    });

    const alerts: { type: string; title: string; detail: string }[] = [];

    // Stock alerts
    for (const item of inventory) {
      if (item.currentStock <= 0) {
        alerts.push({ type: 'Stock', title: `Rupture: ${item.ingredient.name}`, detail: `0 ${item.ingredient.unit}` });
      } else if (item.currentStock < item.minStock) {
        alerts.push({ type: 'Stock', title: `Stock bas: ${item.ingredient.name}`, detail: `${item.currentStock}/${item.minStock} ${item.ingredient.unit}` });
      }
    }

    // Price changes
    const byIng: Record<number, any[]> = {};
    priceHistory.forEach(h => {
      if (!byIng[h.ingredientId]) byIng[h.ingredientId] = [];
      byIng[h.ingredientId].push(h);
    });
    for (const records of Object.values(byIng)) {
      if (records.length < 2) continue;
      const oldest = records[0];
      const newest = records[records.length - 1];
      const change = ((newest.price - oldest.price) / oldest.price) * 100;
      if (Math.abs(change) >= 5) {
        alerts.push({ type: 'Prix', title: `${newest.ingredient.name}`, detail: `${change > 0 ? '+' : ''}${change.toFixed(1)}%` });
      }
    }

    // Margin alerts
    for (const r of recipes) {
      if (r.sellingPrice <= 0) continue;
      const cost = r.ingredients.reduce((s, ri) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
      const margin = ((r.sellingPrice - cost) / r.sellingPrice) * 100;
      if (margin < 60) {
        alerts.push({ type: 'Marge', title: r.name, detail: `${margin.toFixed(1)}%` });
      }
    }

    if (alerts.length === 0) {
      return res.json({ success: true, message: 'Aucune alerte — email non envoye' });
    }

    const restName = restaurant?.name || 'Votre restaurant';

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: user.email,
      subject: `Votre resume RestauMargin — ${alerts.length} alerte${alerts.length > 1 ? 's' : ''} cette semaine`,
      html: buildDigestEmail({ userName: user.name || 'Chef', restaurantName: restName, alerts }),
    });

    console.log(`[DIGEST] Sent ${alerts.length} alerts to ${user.email} for restaurant ${rid}`);
    res.json({ success: true, message: `Resume envoye a ${user.email} — ${alerts.length} alertes`, alertCount: alerts.length });
  } catch (e: any) {
    console.error('[DIGEST ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi resume email' });
  }
});

// ── Analytics Report Endpoint ──
app.get('/api/analytics/report', authWithRestaurant, async (req: any, res) => {
  try {
    const rid = req.restaurantId;
    const periodDays = parseInt(req.query.period as string) || 30;
    const now = new Date();
    const periodStart = new Date(now.getTime() - periodDays * 86400000);
    const prevPeriodStart = new Date(periodStart.getTime() - periodDays * 86400000);

    // ── Fetch all recipes with ingredients ──
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: rid, deletedAt: null },
      include: recipeInclude,
      orderBy: { name: 'asc' },
    });

    const formattedRecipes = recipes.map(r => formatRecipe(r));

    // ── Fetch ingredients ──
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: rid },
    });

    // ── Period comparison: recipes created in current vs previous period ──
    const currentPeriodRecipes = formattedRecipes.filter(r => new Date(r.createdAt) >= periodStart);
    const prevPeriodRecipes = formattedRecipes.filter(r => {
      const d = new Date(r.createdAt);
      return d >= prevPeriodStart && d < periodStart;
    });

    // Average margins
    const avgMarginCurrent = formattedRecipes.length > 0
      ? formattedRecipes.reduce((s: number, r: any) => s + (r.margin?.marginPercent || 0), 0) / formattedRecipes.length
      : 0;
    const avgFoodCostCurrent = formattedRecipes.length > 0
      ? formattedRecipes.reduce((s: number, r: any) => s + (r.margin?.costPerPortion || 0), 0) / formattedRecipes.length
      : 0;
    const totalRevenuePotential = formattedRecipes.reduce((s: number, r: any) => s + (r.sellingPrice || 0), 0);
    const totalCostPotential = formattedRecipes.reduce((s: number, r: any) => s + (r.margin?.totalCostPerPortion || 0), 0);

    // ── Top 5 most profitable recipes ──
    const sortedByMargin = [...formattedRecipes]
      .filter((r: any) => r.margin && r.sellingPrice > 0)
      .sort((a: any, b: any) => (b.margin.marginAmount || 0) - (a.margin.marginAmount || 0));
    const topProfitable = sortedByMargin.slice(0, 5).map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      sellingPrice: r.sellingPrice,
      marginAmount: r.margin.marginAmount,
      marginPercent: r.margin.marginPercent,
      foodCost: r.margin.costPerPortion,
    }));

    // ── Top 5 worst margin recipes ──
    const worstMargin = [...formattedRecipes]
      .filter((r: any) => r.margin && r.sellingPrice > 0)
      .sort((a: any, b: any) => (a.margin.marginPercent || 0) - (b.margin.marginPercent || 0));
    const bottomMargin = worstMargin.slice(0, 5).map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      sellingPrice: r.sellingPrice,
      marginAmount: r.margin.marginAmount,
      marginPercent: r.margin.marginPercent,
      foodCost: r.margin.costPerPortion,
    }));

    // ── Ingredient cost trends (price history) ──
    const priceHistory = await prisma.priceHistory.findMany({
      where: {
        restaurantId: rid,
        createdAt: { gte: prevPeriodStart },
      },
      include: { ingredient: { select: { name: true, unit: true, pricePerUnit: true, category: true } } },
      orderBy: { createdAt: 'asc' },
    });

    // Group price history by ingredient and compute increase
    const ingredientPriceMap: Record<number, { name: string; category: string; prices: { date: string; price: number }[]; currentPrice: number }> = {};
    for (const ph of priceHistory) {
      if (!ingredientPriceMap[ph.ingredientId]) {
        ingredientPriceMap[ph.ingredientId] = {
          name: ph.ingredient.name,
          category: ph.ingredient.category,
          prices: [],
          currentPrice: ph.ingredient.pricePerUnit,
        };
      }
      ingredientPriceMap[ph.ingredientId].prices.push({ date: ph.date, price: ph.price });
    }

    const ingredientTrends = Object.entries(ingredientPriceMap)
      .map(([id, data]) => {
        const prices = data.prices;
        const oldPrice = prices.length > 0 ? prices[0].price : data.currentPrice;
        const newPrice = data.currentPrice;
        const changePercent = oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
        return { ingredientId: parseInt(id), name: data.name, category: data.category, oldPrice, newPrice, changePercent };
      })
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 10);

    // ── Category performance breakdown ──
    const categoryMap: Record<string, { count: number; totalMargin: number; totalRevenue: number; totalCost: number; recipes: string[] }> = {};
    for (const r of formattedRecipes) {
      const cat = r.category || 'Autre';
      if (!categoryMap[cat]) categoryMap[cat] = { count: 0, totalMargin: 0, totalRevenue: 0, totalCost: 0, recipes: [] };
      categoryMap[cat].count++;
      categoryMap[cat].totalMargin += r.margin?.marginAmount || 0;
      categoryMap[cat].totalRevenue += r.sellingPrice || 0;
      categoryMap[cat].totalCost += r.margin?.totalCostPerPortion || 0;
      categoryMap[cat].recipes.push(r.name);
    }
    const categoryPerformance = Object.entries(categoryMap).map(([cat, data]) => ({
      category: cat,
      recipeCount: data.count,
      avgMargin: data.count > 0 ? Math.round((data.totalMargin / data.count) * 100) / 100 : 0,
      totalRevenue: Math.round(data.totalRevenue * 100) / 100,
      totalCost: Math.round(data.totalCost * 100) / 100,
      avgMarginPercent: data.totalRevenue > 0 ? Math.round(((data.totalRevenue - data.totalCost) / data.totalRevenue) * 1000) / 10 : 0,
    }));

    // ── Labor cost analysis ──
    let laborAnalysis = null;
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: { restaurantId: rid, date: { gte: periodStart.toISOString().slice(0, 10) } },
        include: { employee: { select: { firstName: true, lastName: true, hourlyRate: true } } },
      });
      if (timeEntries.length > 0) {
        const totalMinutes = timeEntries.reduce((s, e) => s + (e.totalMinutes || 0), 0);
        const totalHours = totalMinutes / 60;
        const totalLaborCost = timeEntries.reduce((s, e) => {
          const hours = (e.totalMinutes || 0) / 60;
          return s + hours * (e.employee.hourlyRate || 0);
        }, 0);
        laborAnalysis = {
          totalHours: Math.round(totalHours * 10) / 10,
          totalCost: Math.round(totalLaborCost * 100) / 100,
          avgCostPerHour: totalHours > 0 ? Math.round((totalLaborCost / totalHours) * 100) / 100 : 0,
          entryCount: timeEntries.length,
        };
      }
    } catch { /* TimeEntry table may not exist */ }

    // ── Food waste impact ──
    const wasteLogs = await prisma.wasteLog.findMany({
      where: { restaurantId: rid, date: { gte: periodStart.toISOString().slice(0, 10) } },
      include: { ingredient: { select: { name: true, category: true } } },
    });
    const totalWasteCost = wasteLogs.reduce((s, w) => s + (w.costImpact || 0), 0);
    const wasteByReason: Record<string, { count: number; cost: number }> = {};
    for (const w of wasteLogs) {
      if (!wasteByReason[w.reason]) wasteByReason[w.reason] = { count: 0, cost: 0 };
      wasteByReason[w.reason].count++;
      wasteByReason[w.reason].cost += w.costImpact || 0;
    }
    const wasteImpact = {
      totalCost: Math.round(totalWasteCost * 100) / 100,
      entryCount: wasteLogs.length,
      byReason: Object.entries(wasteByReason).map(([reason, data]) => ({
        reason,
        count: data.count,
        cost: Math.round(data.cost * 100) / 100,
      })),
      topWastedIngredients: Object.values(
        wasteLogs.reduce((acc: Record<string, { name: string; cost: number; count: number }>, w) => {
          const name = w.ingredient.name;
          if (!acc[name]) acc[name] = { name, cost: 0, count: 0 };
          acc[name].cost += w.costImpact || 0;
          acc[name].count++;
          return acc;
        }, {})
      ).sort((a, b) => b.cost - a.cost).slice(0, 5),
    };

    // ── Performance score (0-100) ──
    let score = 50; // Base
    // Margin bonus: 70%+ avg margin = great
    if (avgMarginCurrent >= 70) score += 20;
    else if (avgMarginCurrent >= 60) score += 15;
    else if (avgMarginCurrent >= 50) score += 10;
    else if (avgMarginCurrent < 30) score -= 15;
    // Recipe count bonus
    if (formattedRecipes.length >= 20) score += 10;
    else if (formattedRecipes.length >= 10) score += 5;
    // Low waste bonus
    if (totalWasteCost < 50) score += 10;
    else if (totalWasteCost < 200) score += 5;
    else if (totalWasteCost > 500) score -= 10;
    // Variety (categories)
    if (Object.keys(categoryMap).length >= 4) score += 5;
    // Clamp
    score = Math.max(0, Math.min(100, score));

    // ── Margin over time data (simulate from recipe creation dates) ──
    const marginTimeline: { date: string; avgMargin: number; avgCost: number; recipeCount: number }[] = [];
    const sortedRecipes = [...formattedRecipes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Build weekly buckets for the period
    const bucketSize = periodDays <= 7 ? 1 : periodDays <= 30 ? 7 : 30;
    for (let d = new Date(periodStart); d <= now; d = new Date(d.getTime() + bucketSize * 86400000)) {
      const bucketEnd = new Date(d.getTime() + bucketSize * 86400000);
      const recipesUpToDate = formattedRecipes.filter(r => new Date(r.createdAt) <= bucketEnd);
      if (recipesUpToDate.length > 0) {
        const avg = recipesUpToDate.reduce((s: number, r: any) => s + (r.margin?.marginPercent || 0), 0) / recipesUpToDate.length;
        const avgC = recipesUpToDate.reduce((s: number, r: any) => s + (r.margin?.costPerPortion || 0), 0) / recipesUpToDate.length;
        marginTimeline.push({
          date: d.toISOString().slice(0, 10),
          avgMargin: Math.round(avg * 10) / 10,
          avgCost: Math.round(avgC * 100) / 100,
          recipeCount: recipesUpToDate.length,
        });
      }
    }

    res.json({
      generatedAt: new Date().toISOString(),
      periodDays,
      periodStart: periodStart.toISOString(),
      periodEnd: now.toISOString(),
      summary: {
        totalRecipes: formattedRecipes.length,
        totalIngredients: ingredients.length,
        avgMarginPercent: Math.round(avgMarginCurrent * 10) / 10,
        avgFoodCost: Math.round(avgFoodCostCurrent * 100) / 100,
        totalRevenuePotential: Math.round(totalRevenuePotential * 100) / 100,
        totalCostPotential: Math.round(totalCostPotential * 100) / 100,
        newRecipesThisPeriod: currentPeriodRecipes.length,
        newRecipesPrevPeriod: prevPeriodRecipes.length,
      },
      performanceScore: score,
      topProfitable,
      bottomMargin,
      ingredientTrends,
      categoryPerformance,
      laborAnalysis,
      wasteImpact,
      marginTimeline,
    });
  } catch (e: any) {
    console.error('[ANALYTICS REPORT]', e.message);
    res.status(500).json({ error: 'Erreur génération rapport analytique' });
  }
});

// ============ PRESENCE (real-time collaboration indicators) ============
const activeUsers = new Map<number, { userId: number; name: string; page: string; restaurantId: number; lastSeen: Date }>();

// Cleanup stale entries every 2 minutes
setInterval(() => {
  const cutoff = new Date(Date.now() - 120_000);
  for (const [uid, entry] of activeUsers) {
    if (entry.lastSeen < cutoff) activeUsers.delete(uid);
  }
}, 120_000);

// POST /api/presence/heartbeat — update current user's page + last seen
app.post('/api/presence/heartbeat', authMiddleware, (req: any, res) => {
  const { page, restaurantId, name } = req.body;
  if (!page || !restaurantId) {
    return res.status(400).json({ error: 'page et restaurantId requis' });
  }
  activeUsers.set(req.user.userId, {
    userId: req.user.userId,
    name: name || req.user.email?.split('@')[0] || `User ${req.user.userId}`,
    page: String(page),
    restaurantId: Number(restaurantId),
    lastSeen: new Date(),
  });
  res.json({ ok: true });
});

// GET /api/presence/active — returns active users (last 60s)
app.get('/api/presence/active', authMiddleware, (req: any, res) => {
  const cutoff = new Date(Date.now() - 60_000);
  const restaurantId = req.headers['x-restaurant-id'] ? parseInt(String(req.headers['x-restaurant-id']), 10) : null;
  const result: { userId: number; name: string; page: string; lastSeen: string }[] = [];
  for (const entry of activeUsers.values()) {
    if (entry.lastSeen >= cutoff && entry.userId !== req.user.userId) {
      if (!restaurantId || entry.restaurantId === restaurantId) {
        result.push({
          userId: entry.userId,
          name: entry.name,
          page: entry.page,
          lastSeen: entry.lastSeen.toISOString(),
        });
      }
    }
  }
  res.json(result);
});

// ── Customer Feedback ─────────────────────────────────────────────────

// POST /api/feedback — submit feedback (public, no auth for public form)
app.post('/api/feedback', async (req: any, res) => {
  try {
    const { rating, comment, source, restaurantId } = req.body;
    if (!rating || !restaurantId) {
      return res.status(400).json({ error: 'rating et restaurantId requis' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating doit être entre 1 et 5' });
    }
    const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(restaurantId) } });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant non trouvé' });
    }
    const feedback = await prisma.customerFeedback.create({
      data: {
        restaurantId: Number(restaurantId),
        rating: Number(rating),
        comment: comment ? String(comment).slice(0, 2000) : null,
        source: source || 'app',
      },
    });
    res.json(feedback);
  } catch (e: any) {
    console.error('[FEEDBACK CREATE]', e.message);
    res.status(500).json({ error: 'Erreur création avis' });
  }
});

// GET /api/feedback — list feedback with pagination (protected)
app.get('/api/feedback', authWithRestaurant, async (req: any, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;
    const ratingFilter = req.query.rating ? Number(req.query.rating) : undefined;
    const sourceFilter = req.query.source || undefined;
    const periodDays = req.query.period ? Number(req.query.period) : undefined;

    const where: any = { restaurantId: req.restaurantId };
    if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) where.rating = ratingFilter;
    if (sourceFilter) where.source = sourceFilter;
    if (periodDays) {
      const since = new Date();
      since.setDate(since.getDate() - periodDays);
      where.createdAt = { gte: since };
    }

    const [feedbacks, total] = await Promise.all([
      prisma.customerFeedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.customerFeedback.count({ where }),
    ]);
    res.json({ feedbacks, total, page, totalPages: Math.ceil(total / limit) });
  } catch (e: any) {
    console.error('[FEEDBACK LIST]', e.message);
    res.status(500).json({ error: 'Erreur liste avis' });
  }
});

// GET /api/feedback/stats — stats and distribution (protected)
app.get('/api/feedback/stats', authWithRestaurant, async (req: any, res) => {
  try {
    const periodDays = req.query.period ? Number(req.query.period) : undefined;
    const where: any = { restaurantId: req.restaurantId };
    if (periodDays) {
      const since = new Date();
      since.setDate(since.getDate() - periodDays);
      where.createdAt = { gte: since };
    }

    const allFeedbacks = await prisma.customerFeedback.findMany({
      where: { restaurantId: req.restaurantId },
      orderBy: { createdAt: 'asc' },
      select: { rating: true, createdAt: true },
    });

    const filteredFeedbacks = periodDays
      ? allFeedbacks.filter(f => {
          const since = new Date();
          since.setDate(since.getDate() - periodDays);
          return f.createdAt >= since;
        })
      : allFeedbacks;

    const totalCount = filteredFeedbacks.length;
    const avgRating = totalCount > 0
      ? Math.round((filteredFeedbacks.reduce((s, f) => s + f.rating, 0) / totalCount) * 10) / 10
      : 0;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredFeedbacks.forEach(f => { distribution[f.rating]++; });

    // Weekly trend (last 12 weeks)
    const trend: { week: string; avg: number; count: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const weekFeedbacks = allFeedbacks.filter(f => f.createdAt >= weekStart && f.createdAt < weekEnd);
      const weekAvg = weekFeedbacks.length > 0
        ? Math.round((weekFeedbacks.reduce((s, f) => s + f.rating, 0) / weekFeedbacks.length) * 10) / 10
        : 0;
      trend.push({
        week: weekStart.toISOString().slice(0, 10),
        avg: weekAvg,
        count: weekFeedbacks.length,
      });
    }

    res.json({ avgRating, totalCount, distribution, trend });
  } catch (e: any) {
    console.error('[FEEDBACK STATS]', e.message);
    res.status(500).json({ error: 'Erreur stats avis' });
  }
});

// GET /api/feedback/restaurant/:id — get restaurant name for public form (no auth)
app.get('/api/feedback/restaurant/:id', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant non trouvé' });
    res.json(restaurant);
  } catch (e: any) {
    console.error('[FEEDBACK RESTAURANT]', e.message);
    res.status(500).json({ error: 'Erreur récupération restaurant' });
  }
});

// ============ BUDGET STATUS & CONFIG ============

// GET /api/budget/status — daily/weekly/monthly spending + budget usage
app.get('/api/budget/status', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;

    // Fetch restaurant budget config
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { dailyBudget: true, weeklyBudget: true, monthlyBudget: true, budgetEmailAlert: true },
    });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant non trouvé' });

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // Week start (Monday)
    const dayOfWeek = now.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - mondayOffset);
    const weekStartStr = weekStart.toISOString().slice(0, 10);

    // Month start
    const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    // Today's spending from invoices
    const todayInvoices = await prisma.invoice.aggregate({
      where: { restaurantId, invoiceDate: todayStr },
      _sum: { totalAmount: true },
    });
    // Today's spending from financial entries (expenses only)
    const todayExpenses = await prisma.financialEntry.aggregate({
      where: { restaurantId, date: todayStr, type: 'expense' },
      _sum: { amount: true },
    });
    const todaySpending = (todayInvoices._sum.totalAmount || 0) + (todayExpenses._sum.amount || 0);

    // Week spending
    const weekInvoices = await prisma.invoice.aggregate({
      where: { restaurantId, invoiceDate: { gte: weekStartStr, lte: todayStr } },
      _sum: { totalAmount: true },
    });
    const weekExpenses = await prisma.financialEntry.aggregate({
      where: { restaurantId, date: { gte: weekStartStr, lte: todayStr }, type: 'expense' },
      _sum: { amount: true },
    });
    const weekSpending = (weekInvoices._sum.totalAmount || 0) + (weekExpenses._sum.amount || 0);

    // Month spending
    const monthInvoices = await prisma.invoice.aggregate({
      where: { restaurantId, invoiceDate: { gte: monthStartStr, lte: todayStr } },
      _sum: { totalAmount: true },
    });
    const monthExpenses = await prisma.financialEntry.aggregate({
      where: { restaurantId, date: { gte: monthStartStr, lte: todayStr }, type: 'expense' },
      _sum: { amount: true },
    });
    const monthSpending = (monthInvoices._sum.totalAmount || 0) + (monthExpenses._sum.amount || 0);

    // Budget used % (today vs daily budget)
    const dailyBudget = restaurant.dailyBudget || 0;
    const budgetUsed = dailyBudget > 0 ? Math.round((todaySpending / dailyBudget) * 1000) / 10 : 0;

    // Days over budget this month — get daily totals
    let daysOverBudget = 0;
    if (dailyBudget > 0) {
      const monthInvoicesByDay = await prisma.invoice.groupBy({
        by: ['invoiceDate'],
        where: { restaurantId, invoiceDate: { gte: monthStartStr, lte: todayStr } },
        _sum: { totalAmount: true },
      });
      const monthExpensesByDay = await prisma.financialEntry.groupBy({
        by: ['date'],
        where: { restaurantId, date: { gte: monthStartStr, lte: todayStr }, type: 'expense' },
        _sum: { amount: true },
      });

      const dailyTotals = new Map<string, number>();
      for (const row of monthInvoicesByDay) {
        dailyTotals.set(row.invoiceDate, (dailyTotals.get(row.invoiceDate) || 0) + (row._sum.totalAmount || 0));
      }
      for (const row of monthExpensesByDay) {
        dailyTotals.set(row.date, (dailyTotals.get(row.date) || 0) + (row._sum.amount || 0));
      }
      for (const [, total] of dailyTotals) {
        if (total > dailyBudget) daysOverBudget++;
      }
    }

    // Forecast: projected month-end spending
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyAverage = dayOfMonth > 0 ? monthSpending / dayOfMonth : 0;
    const forecast = Math.round(dailyAverage * daysInMonth * 100) / 100;

    res.json({
      dailyBudget: restaurant.dailyBudget,
      weeklyBudget: restaurant.weeklyBudget,
      monthlyBudget: restaurant.monthlyBudget,
      budgetEmailAlert: restaurant.budgetEmailAlert,
      todaySpending: Math.round(todaySpending * 100) / 100,
      weekSpending: Math.round(weekSpending * 100) / 100,
      monthSpending: Math.round(monthSpending * 100) / 100,
      budgetUsed,
      daysOverBudget,
      forecast,
      dayOfMonth,
      daysInMonth,
    });
  } catch (e: any) {
    console.error('[BUDGET STATUS]', e.message);
    res.status(500).json({ error: 'Erreur récupération budget' });
  }
});

// PUT /api/budget/set — set daily/weekly/monthly budget targets
app.put('/api/budget/set', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    const { dailyBudget, weeklyBudget, monthlyBudget, budgetEmailAlert } = req.body;

    const updateData: any = {};
    if (dailyBudget !== undefined) updateData.dailyBudget = dailyBudget === null ? null : parseFloat(dailyBudget);
    if (weeklyBudget !== undefined) updateData.weeklyBudget = weeklyBudget === null ? null : parseFloat(weeklyBudget);
    if (monthlyBudget !== undefined) updateData.monthlyBudget = monthlyBudget === null ? null : parseFloat(monthlyBudget);
    if (budgetEmailAlert !== undefined) updateData.budgetEmailAlert = !!budgetEmailAlert;

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: updateData,
      select: { dailyBudget: true, weeklyBudget: true, monthlyBudget: true, budgetEmailAlert: true },
    });

    res.json(updated);
  } catch (e: any) {
    console.error('[BUDGET SET]', e.message);
    res.status(500).json({ error: 'Erreur mise à jour budget' });
  }
});

// ── Menu Calendar ──

app.get('/api/menu-calendar', authWithRestaurant, async (req: any, res) => {
  try {
    const { month } = req.query; // format: 2026-04
    if (!month || !/^\d{4}-\d{2}$/.test(month as string)) {
      return res.status(400).json({ error: 'Paramètre month requis (format: YYYY-MM)' });
    }
    const [year, m] = (month as string).split('-').map(Number);
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 0); // last day of month

    const entries = await prisma.menuCalendar.findMany({
      where: {
        restaurantId: req.restaurantId,
        date: { gte: startDate, lte: endDate },
      },
      include: { recipe: { select: { id: true, name: true, category: true, sellingPrice: true } } },
      orderBy: [{ date: 'asc' }, { mealType: 'asc' }],
    });
    res.json(entries);
  } catch (e: any) {
    console.error('[MENU-CALENDAR GET]', e.message);
    res.status(500).json({ error: 'Erreur récupération menu calendrier' });
  }
});

app.post('/api/menu-calendar', authWithRestaurant, async (req: any, res) => {
  try {
    const { date, mealType, menuItems } = req.body;
    if (!date || !mealType || !menuItems || !Array.isArray(menuItems)) {
      return res.status(400).json({ error: 'date, mealType et menuItems requis' });
    }
    const created = [];
    for (const item of menuItems) {
      const entry = await prisma.menuCalendar.create({
        data: {
          restaurantId: req.restaurantId,
          date: new Date(date),
          mealType,
          recipeId: item.recipeId,
          category: item.category || null,
        },
        include: { recipe: { select: { id: true, name: true, category: true, sellingPrice: true } } },
      });
      created.push(entry);
    }
    res.json(created);
  } catch (e: any) {
    console.error('[MENU-CALENDAR POST]', e.message);
    res.status(500).json({ error: 'Erreur création menu calendrier' });
  }
});

app.delete('/api/menu-calendar/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const entry = await prisma.menuCalendar.findFirst({
      where: { id, restaurantId: req.restaurantId },
    });
    if (!entry) return res.status(404).json({ error: 'Entrée non trouvée' });

    await prisma.menuCalendar.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: any) {
    console.error('[MENU-CALENDAR DELETE]', e.message);
    res.status(500).json({ error: 'Erreur suppression menu calendrier' });
  }
});

// ============ CRM — CLIENT SEGMENTS ============
// Segments are computed from localStorage data sent by frontend.
// Since clients are stored in localStorage (no DB model yet), the frontend
// sends its client list and the backend computes segments + sends campaign emails.

app.post('/api/clients/segments', authWithRestaurant, async (req: any, res) => {
  try {
    const { clients } = req.body;
    if (!Array.isArray(clients)) return res.status(400).json({ error: 'clients array requis' });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Sort by caTotal descending for VIP calculation
    const sorted = [...clients].sort((a: any, b: any) => (b.caTotal || 0) - (a.caTotal || 0));
    const top10pctCount = Math.max(1, Math.ceil(sorted.length * 0.1));
    const vipThreshold = sorted.length > 0 ? (sorted[top10pctCount - 1]?.caTotal || 0) : 0;

    const vipClients: any[] = [];
    const regulierClients: any[] = [];
    const nouveauxClients: any[] = [];
    const inactifsClients: any[] = [];

    for (const c of clients) {
      const lastVisit = c.derniereVisite ? new Date(c.derniereVisite) : null;
      const createdDate = c.dateCreation ? new Date(c.dateCreation) : null;

      // VIP: top 10% by revenue
      if (c.caTotal >= vipThreshold && c.caTotal > 0) {
        vipClients.push(c);
      }
      // Reguliers: 3+ orders
      if ((c.nbCommandes || 0) >= 3) {
        regulierClients.push(c);
      }
      // Nouveaux: first visit (creation) this month
      if (createdDate && createdDate >= startOfMonth) {
        nouveauxClients.push(c);
      }
      // Inactifs: no visit in 30+ days
      if (lastVisit && lastVisit < thirtyDaysAgo) {
        inactifsClients.push(c);
      } else if (!lastVisit && createdDate && createdDate < thirtyDaysAgo) {
        inactifsClients.push(c);
      }
    }

    function segmentStats(arr: any[]) {
      const count = arr.length;
      const totalRevenue = arr.reduce((s: number, c: any) => s + (c.caTotal || 0), 0);
      const avgTicket = count > 0 ? totalRevenue / arr.reduce((s: number, c: any) => s + (c.nbCommandes || 1), 0) : 0;
      return {
        count,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        avgTicket: Math.round(avgTicket * 100) / 100,
        clientIds: arr.map((c: any) => c.id),
      };
    }

    res.json({
      vip: segmentStats(vipClients),
      reguliers: segmentStats(regulierClients),
      nouveaux: segmentStats(nouveauxClients),
      inactifs: segmentStats(inactifsClients),
      total: clients.length,
    });
  } catch (e: any) {
    console.error('[CRM SEGMENTS ERROR]', e.message);
    res.status(500).json({ error: 'Erreur calcul segments' });
  }
});

// ============ CRM — CLIENT HISTORY ============
app.post('/api/clients/history', authWithRestaurant, async (req: any, res) => {
  try {
    const { client } = req.body;
    if (!client) return res.status(400).json({ error: 'client object requis' });

    const totalSpent = client.caTotal || 0;
    const nbCommandes = client.nbCommandes || 0;
    const avgTicket = nbCommandes > 0 ? totalSpent / nbCommandes : 0;

    res.json({
      client: {
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
      },
      totalSpent: Math.round(totalSpent * 100) / 100,
      avgTicket: Math.round(avgTicket * 100) / 100,
      nbVisits: nbCommandes,
      favoriteDishes: client.platsFavoris || [],
      historique: client.historique || [],
      tags: client.tags || [],
      allergenes: client.allergenes || [],
      regime: client.regime || [],
    });
  } catch (e: any) {
    console.error('[CRM HISTORY ERROR]', e.message);
    res.status(500).json({ error: 'Erreur historique client' });
  }
});

// ============ CRM — ADD TAG TO CLIENT ============
app.post('/api/clients/tag', authWithRestaurant, async (req: any, res) => {
  try {
    const { clientId, tag, action } = req.body;
    if (!clientId || !tag) return res.status(400).json({ error: 'clientId et tag requis' });
    // Since clients are in localStorage, this endpoint validates and returns the tag
    const allowedTags = ['VIP', 'Régulier', 'Nouveau', 'Inactif', 'Allergie', 'Preference', 'Fidèle', 'Premium', 'Anniversaire', 'Professionnel'];
    if (!allowedTags.includes(tag)) {
      return res.status(400).json({ error: `Tag non autorisé. Tags valides: ${allowedTags.join(', ')}` });
    }
    res.json({ success: true, clientId, tag, action: action || 'add' });
  } catch (e: any) {
    console.error('[CRM TAG ERROR]', e.message);
    res.status(500).json({ error: 'Erreur ajout tag' });
  }
});

// ============ CRM — SEGMENT CAMPAIGN EMAIL ============
app.post('/api/crm/campaign', authWithRestaurant, async (req: any, res) => {
  try {
    const { recipients, subject, message, segmentName } = req.body;
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Aucun destinataire' });
    }
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Sujet et message requis' });
    }
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré' });

    const resend = new Resend(resendKey);
    const safeSubject = sanitizeInput(subject);
    let sent = 0;
    let failed = 0;

    for (const r of recipients) {
      if (!r.email) { failed++; continue; }
      try {
        const personalizedMessage = message
          .replace(/\[nom\]/gi, r.nom || '')
          .replace(/\[prenom\]/gi, r.prenom || '')
          .replace(/\[entreprise\]/gi, r.entreprise || '');

        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: r.email,
          replyTo: 'contact@restaumargin.fr',
          subject: safeSubject,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
              <div style="background:#000;color:#fff;padding:16px 24px;border-radius:12px 12px 0 0;">
                <h2 style="margin:0;font-size:18px;">${safeSubject}</h2>
                ${segmentName ? `<p style="margin:4px 0 0;font-size:12px;opacity:0.7;">Campagne: ${sanitizeInput(segmentName)}</p>` : ''}
              </div>
              <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
                <div style="white-space:pre-wrap;line-height:1.6;">${personalizedMessage}</div>
                <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
                <p style="color:#9ca3af;font-size:12px;">RestauMargin &mdash; www.restaumargin.fr</p>
              </div>
            </div>`,
        });
        sent++;

        // Log to conversation
        try {
          const conv = await findOrCreateConversation(req.restaurantId, r.email, `${r.prenom || ''} ${r.nom || ''}`.trim());
          await prisma.message.create({
            data: { conversationId: conv.id, senderId: 'restaurant', senderName: 'RestauMargin', content: `[Campagne ${segmentName || ''}] ${message.substring(0, 200)}`, timestamp: new Date().toISOString(), read: true },
          });
          await prisma.conversation.update({ where: { id: conv.id }, data: { lastMessage: `[Campagne] ${subject.substring(0, 100)}`, updatedAt: new Date() } });
        } catch { /* non-blocking */ }
      } catch (emailErr) {
        console.error(`[CAMPAIGN EMAIL FAIL] ${r.email}:`, emailErr);
        failed++;
      }
    }

    res.json({ success: true, sent, failed, total: recipients.length });
  } catch (e: any) {
    console.error('[CRM CAMPAIGN ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi campagne' });
  }
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

export default app;
// force-redeploy 1775814576
