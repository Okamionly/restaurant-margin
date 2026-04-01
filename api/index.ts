import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import Anthropic from '@anthropic-ai/sdk';


const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI';

const TOKEN_EXPIRY = '7d';

app.use(cors({
  origin: ['http://localhost:5173', 'https://www.restaumargin.fr', 'https://restaumargin.fr', 'https://restaumargin.vercel.app'],
  credentials: true,
}));
// ── Stripe Webhook (must be before express.json() for raw body) ──
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = JSON.parse(req.body.toString());
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const amountTotal = session.amount_total; // in cents

      // Determine plan based on amount
      let plan = 'pro';
      if (amountTotal && amountTotal >= 7000) plan = 'business'; // 79€ = 7900 cents

      // Generate activation code
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
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <h1 style="color:#1e40af;">Bienvenue sur RestauMargin !</h1>
              <p>Merci pour votre abonnement <strong>${plan === 'pro' ? 'Professionnel' : 'Business'}</strong>.</p>
              <div style="background:#f0f9ff;border:2px solid #2563eb;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <p style="color:#64748b;margin:0 0 8px;">Votre code d'activation :</p>
                <p style="font-size:32px;font-weight:bold;color:#1e40af;letter-spacing:2px;margin:0;">${code}</p>
              </div>
              <p>Pour commencer :</p>
              <ol>
                <li>Rendez-vous sur <a href="https://www.restaumargin.fr/login" style="color:#2563eb;">www.restaumargin.fr</a></li>
                <li>Cliquez sur "Créer un compte"</li>
                <li>Entrez votre code d'activation : <strong>${code}</strong></li>
              </ol>
              <p style="color:#64748b;font-size:14px;margin-top:32px;">L'équipe RestauMargin<br>contact@restaumargin.fr</p>
            </div>
          `,
        });
        console.log(`[STRIPE WEBHOOK] Code ${code} (${plan}) envoyé à ${customerEmail}`);
      }
    }
    res.json({ received: true });
  } catch (e: any) {
    console.error('[STRIPE WEBHOOK ERROR]', e.message);
    res.status(400).json({ error: e.message });
  }
});

app.use(express.json());

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
    return total + ri.quantity * ri.ingredient.pricePerUnit * wasteMultiplier;
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

// ============ AUTH ============
app.get('/api/auth/first-user', async (_req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ isFirstUser: count === 0 });
  } catch (e: any) { console.error('DB Error:', e.message); res.status(500).json({ error: 'Erreur serveur', detail: e.message }); }
});

// ── Activation codes ──
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

// ── Register with activation code ──
app.post('/api/auth/register', async (req: any, res) => {
  try {
    const { email: rawEmail, password, name, activationCode } = req.body;
    if (!rawEmail || !password || !name) return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
    if (password.length < 6) return res.status(400).json({ error: 'Min. 6 caractères' });
    const email = rawEmail.toLowerCase().trim();

    const userCount = await prisma.user.count();
    let plan = 'pro';

    if (userCount > 0) {
      const authHeader = req.headers.authorization;
      const hasAdminToken = authHeader && authHeader.startsWith('Bearer ');
      if (hasAdminToken) {
        try { const d = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload; if (d.role !== 'admin') return res.status(403).json({ error: 'Admin requis' }); } catch { return res.status(403).json({ error: 'Token invalide' }); }
      } else {
        if (!activationCode) return res.status(400).json({ error: "Code d'activation requis. Abonnez-vous sur la page Tarifs." });
        const activation = await prisma.activationCode.findUnique({ where: { code: activationCode.trim().toUpperCase() } });
        if (!activation) return res.status(403).json({ error: "Code d'activation invalide" });
        if (activation.used) return res.status(403).json({ error: "Ce code a déjà été utilisé" });
        plan = activation.plan;
        await prisma.activationCode.update({ where: { code: activation.code }, data: { used: true, usedBy: email, usedAt: new Date() } });
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });
    const passwordHash = await bcrypt.hash(password, 12);
    const role = userCount === 0 ? 'admin' : 'chef';
    const user = await prisma.user.create({ data: { email, passwordHash, name, role, plan } });

    // Auto-create a default restaurant for the new user
    const restaurant = await prisma.restaurant.create({
      data: { name: 'Mon Restaurant', ownerId: user.id, members: { create: { userId: user.id, role: 'owner' } } },
    });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan }, restaurantId: restaurant.id });
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur inscription" }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    // Case-insensitive email lookup
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: (user as any).plan || 'pro' } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur connexion' }); }
});

app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
    if (!user) return res.status(404).json({ error: 'Non trouvé' });
    res.json(user);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.get('/api/auth/users', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true }, orderBy: { createdAt: 'asc' } });
    res.json(users);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

app.delete('/api/auth/users/:id', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const targetId = parseInt(req.params.id);
    if (targetId === req.user.userId) return res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
    await prisma.user.delete({ where: { id: targetId } });
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ ERROR TRACKING ============
app.post('/api/errors', authMiddleware, (req: any, res) => {
  console.warn('[CLIENT ERROR]', req.user?.userId, req.body?.message, req.body?.url);
  res.json({ received: true });
});

// ============ AUTH: VERIFY EMAIL, RESEND, FORGOT/RESET PASSWORD ============
app.get('/api/auth/verify-email', async (req: any, res) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.status(400).json({ error: 'Token manquant' });
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ error: 'Token invalide' });
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, verificationToken: null } });
    res.json({ success: true, message: 'Email vérifié avec succès' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/auth/resend-verification', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    if (user.emailVerified) return res.json({ message: 'Email déjà vérifié' });
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({ where: { id: user.id }, data: { verificationToken } });
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const frontendUrl = process.env.FRONTEND_URL || 'https://www.restaumargin.fr';
      await resend.emails.send({
        from: 'RestauMargin <contact@restaumargin.fr>', to: user.email,
        subject: 'RestauMargin — Vérifiez votre adresse email',
        html: `<h2>Vérification d'email</h2><p>Bonjour ${user.name},</p><p><a href="${frontendUrl}/login?verify=${verificationToken}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Vérifier mon email</a></p><p>L'équipe RestauMargin</p>`,
      });
    }
    res.json({ message: 'Email de vérification envoyé' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/auth/forgot-password', async (req: any, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const genericMsg = 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.';
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.json({ message: genericMsg });
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);
    await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExpiry: expiry } });
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const frontendUrl = process.env.FRONTEND_URL || 'https://www.restaumargin.fr';
      await resend.emails.send({
        from: 'RestauMargin <contact@restaumargin.fr>', to: user.email,
        subject: 'RestauMargin — Réinitialisation de votre mot de passe',
        html: `<h2>Réinitialisation de mot de passe</h2><p>Bonjour ${user.name},</p><p><a href="${frontendUrl}/reset-password?token=${token}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Réinitialiser mon mot de passe</a></p><p>Ce lien expire dans 1 heure.</p><p>L'équipe RestauMargin</p>`,
      });
    }
    res.json({ message: genericMsg });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

app.post('/api/auth/reset-password', async (req: any, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpiry: { gt: new Date() } } });
    if (!user) return res.status(400).json({ error: 'Lien invalide ou expiré' });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashedPassword, resetToken: null, resetTokenExpiry: null } });
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
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

app.post('/api/restaurants', authMiddleware, async (req: any, res) => {
  try {
    const { name, address, cuisineType, phone, coversPerDay } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Nom requis' });
    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(), address: address || null, cuisineType: cuisineType || null,
        phone: phone || null, coversPerDay: coversPerDay || 80, ownerId: req.user.userId,
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
      data: { name: name || undefined, address: address ?? undefined, cuisineType: cuisineType ?? undefined, phone: phone ?? undefined, coversPerDay: coversPerDay ?? undefined },
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
  try { res.json(await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId }, orderBy: { name: 'asc' }, include: { supplierRef: { select: { id: true, name: true } } } })); } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.get('/api/ingredients/usage', authWithRestaurant, async (req: any, res) => {
  try {
    const ings = await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId }, orderBy: { name: 'asc' }, include: { _count: { select: { recipes: true } } } });
    res.json(ings.map((i: any) => ({ id: i.id, name: i.name, category: i.category, usageCount: i._count.recipes })));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.post('/api/ingredients', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, unit, pricePerUnit, supplier, supplierId, category, allergens } = req.body;
    if (!name?.trim() || !unit?.trim() || !category?.trim()) return res.status(400).json({ error: 'Champs requis' });
    const p = parseFloat(pricePerUnit); if (isNaN(p) || p <= 0) return res.status(400).json({ error: 'Prix invalide' });
    const ing = await prisma.ingredient.create({ data: { name: name.trim(), unit: unit.trim(), pricePerUnit: p, supplier: supplier || null, supplierId: supplierId || null, category: category.trim(), allergens: Array.isArray(allergens) ? allergens : [], restaurantId: req.restaurantId } });
    res.status(201).json(ing);
  } catch { res.status(500).json({ error: 'Erreur création' }); }
});

app.put('/api/ingredients/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, unit, pricePerUnit, supplier, supplierId, category, allergens } = req.body;
    if (!name?.trim() || !unit?.trim() || !category?.trim()) return res.status(400).json({ error: 'Champs requis' });
    const p = parseFloat(pricePerUnit); if (isNaN(p) || p <= 0) return res.status(400).json({ error: 'Prix invalide' });
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const ing = await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { name: name.trim(), unit: unit.trim(), pricePerUnit: p, supplier: supplier || null, supplierId: supplierId || null, category: category.trim(), allergens: Array.isArray(allergens) ? allergens : [] } });
    res.json(ing);
  } catch { res.status(500).json({ error: 'Erreur mise à jour' }); }
});

app.delete('/api/ingredients/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    await prisma.ingredient.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ RECIPES ============
app.get('/api/recipes', authWithRestaurant, async (req: any, res) => {
  try {
    const recipes = await prisma.recipe.findMany({ where: { restaurantId: req.restaurantId }, include: recipeInclude, orderBy: { name: 'asc' } });
    res.json(recipes.map(r => formatRecipe(r)));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.get('/api/recipes/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const recipe = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId }, include: recipeInclude });
    if (!recipe) return res.status(404).json({ error: 'Non trouvée' });
    res.json(formatRecipe(recipe));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.post('/api/recipes', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, category, sellingPrice, nbPortions, description, prepTimeMinutes, cookTimeMinutes, laborCostPerHour, ingredients } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Nom requis' });
    const recipe = await prisma.recipe.create({
      data: {
        name: name.trim(), category: category || '', sellingPrice: parseFloat(sellingPrice), nbPortions: parseInt(nbPortions) || 1,
        description: description || null, prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
        cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null, laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
        restaurantId: req.restaurantId,
        ingredients: { create: ingredients?.map((i: any) => ({ ingredientId: i.ingredientId, quantity: i.quantity, wastePercent: i.wastePercent ?? 0 })) || [] },
      }, include: recipeInclude,
    });
    res.status(201).json(formatRecipe(recipe));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création' }); }
});

app.put('/api/recipes/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, category, sellingPrice, nbPortions, description, prepTimeMinutes, cookTimeMinutes, laborCostPerHour, ingredients } = req.body;
    const recipeId = parseInt(req.params.id);
    const existing = await prisma.recipe.findFirst({ where: { id: recipeId, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Non trouvée' });
    await prisma.recipe.update({ where: { id: recipeId }, data: {
      name: name.trim(), category: category || '', sellingPrice: parseFloat(sellingPrice), nbPortions: parseInt(nbPortions) || 1,
      description: description || null, prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
      cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null, laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
    }});
    if (ingredients) {
      await prisma.recipeIngredient.deleteMany({ where: { recipeId } });
      await prisma.recipeIngredient.createMany({ data: ingredients.map((i: any) => ({ recipeId, ingredientId: i.ingredientId, quantity: i.quantity, wastePercent: i.wastePercent ?? 0 })) });
    }
    const updated = await prisma.recipe.findUnique({ where: { id: recipeId }, include: recipeInclude });
    if (!updated) return res.status(404).json({ error: 'Non trouvée' });
    res.json(formatRecipe(updated));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour' }); }
});

app.post('/api/recipes/:id/clone', authWithRestaurant, async (req: any, res) => {
  try {
    const source = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId }, include: recipeInclude });
    if (!source) return res.status(404).json({ error: 'Non trouvée' });
    const cloned = await prisma.recipe.create({
      data: {
        name: `${source.name} (copie)`, category: source.category, sellingPrice: source.sellingPrice, nbPortions: source.nbPortions,
        description: source.description, prepTimeMinutes: source.prepTimeMinutes, cookTimeMinutes: source.cookTimeMinutes, laborCostPerHour: source.laborCostPerHour,
        restaurantId: req.restaurantId,
        ingredients: { create: source.ingredients.map(ri => ({ ingredientId: ri.ingredientId, quantity: ri.quantity, wastePercent: ri.wastePercent })) },
      }, include: recipeInclude,
    });
    res.status(201).json(formatRecipe(cloned));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur clonage' }); }
});

app.delete('/api/recipes/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Non trouvée' });
    await prisma.recipe.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ SUPPLIERS ============
app.get('/api/suppliers', authWithRestaurant, async (req: any, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { restaurantId: req.restaurantId },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { ingredients: true } },
        ingredients: {
          orderBy: { name: 'asc' },
          select: { id: true, name: true, unit: true, pricePerUnit: true, category: true },
        },
      },
    });
    res.json(suppliers);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération fournisseurs' }); }
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
    const { name, phone, email, address, city, postalCode, region, country, siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Le nom est requis' });
    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(), phone: phone || null, email: email || null, address: address || null,
        city: city || null, postalCode: postalCode || null, region: region || null, country: country || 'France',
        siret: siret || null, website: website || null, notes: notes || null,
        categories: Array.isArray(categories) ? categories : [], contactName: contactName || null,
        delivery: delivery !== undefined ? delivery : true, minOrder: minOrder || null, paymentTerms: paymentTerms || null,
        restaurantId: req.restaurantId,
      },
    });
    res.status(201).json(supplier);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création fournisseur' }); }
});

app.put('/api/suppliers/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const { name, phone, email, address, city, postalCode, region, country, siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Le nom est requis' });
    const id = parseInt(req.params.id);
    const existing = await prisma.supplier.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Fournisseur non trouvé' });
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: name.trim(), phone: phone || null, email: email || null, address: address || null,
        city: city || null, postalCode: postalCode || null, region: region || null, country: country || 'France',
        siret: siret || null, website: website || null, notes: notes || null,
        categories: Array.isArray(categories) ? categories : [], contactName: contactName || null,
        delivery: delivery !== undefined ? delivery : true, minOrder: minOrder || null, paymentTerms: paymentTerms || null,
      },
    });
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

// ============ INVENTORY ============
app.get('/api/inventory', authWithRestaurant, async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    res.json(items);
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
    const totalValue = items.reduce((sum: number, item: any) => sum + item.currentStock * item.ingredient.pricePerUnit, 0);
    const byCategory: Record<string, number> = {};
    for (const item of items) {
      const cat = (item as any).ingredient.category;
      const val = item.currentStock * (item as any).ingredient.pricePerUnit;
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
      where: { restaurantId: req.restaurantId, inventoryItem: null },
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suggestions' }); }
});

app.post('/api/inventory', authWithRestaurant, async (req, res) => {
  try {
    const { ingredientId, currentStock, unit, minStock, maxStock, notes } = req.body;
    if (!ingredientId) return res.status(400).json({ error: 'ingredientId requis' });
    const ingredient = await prisma.ingredient.findFirst({ where: { id: ingredientId, restaurantId: req.restaurantId } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const item = await prisma.inventoryItem.create({
      data: { ingredientId, currentStock: currentStock || 0, unit: unit || ingredient.unit, minStock: minStock || 0, maxStock: maxStock || null, notes: notes || null, restaurantId: req.restaurantId },
      include: { ingredient: true },
    });
    res.status(201).json(item);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Déjà dans l\'inventaire' });
    console.error(e); res.status(500).json({ error: 'Erreur ajout inventaire' });
  }
});

app.put('/api/inventory/:id', authWithRestaurant, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { currentStock, minStock, maxStock, unit, notes } = req.body;
    const data: any = {};
    if (currentStock !== undefined) data.currentStock = parseFloat(currentStock);
    if (minStock !== undefined) data.minStock = parseFloat(minStock);
    if (maxStock !== undefined) data.maxStock = maxStock === null ? null : parseFloat(maxStock);
    if (unit !== undefined) data.unit = unit;
    if (notes !== undefined) data.notes = notes || null;
    const item = await prisma.inventoryItem.update({ where: { id }, data, include: { ingredient: true } });
    res.json(item);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour' }); }
});

app.post('/api/inventory/:id/restock', authWithRestaurant, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) return res.status(400).json({ error: 'Quantité > 0 requise' });
    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Item non trouvé' });
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { currentStock: existing.currentStock + parseFloat(quantity), lastRestockDate: new Date(), lastRestockQuantity: parseFloat(quantity) },
      include: { ingredient: true },
    });
    res.json(item);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur réapprovisionnement' }); }
});

app.delete('/api/inventory/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.inventoryItem.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Non trouvé' });
    await prisma.inventoryItem.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression' }); }
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
    const { ingredientId, days } = req.query;
    const where: any = {};
    if (ingredientId) where.ingredientId = parseInt(ingredientId);
    if (days) where.createdAt = { gte: new Date(Date.now() - parseInt(days) * 86400000) };
    where.restaurantId = req.restaurantId;
    const history = await prisma.priceHistory.findMany({
      where,
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    res.json(history);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur historique prix' }); }
});

app.get('/api/price-history/alerts', authWithRestaurant, async (req: any, res) => {
  try {
    // Find ingredients with significant price changes (>10%) in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const history = await prisma.priceHistory.findMany({
      where: { restaurantId: req.restaurantId, createdAt: { gte: thirtyDaysAgo } },
      include: { ingredient: { select: { id: true, name: true, unit: true, pricePerUnit: true, category: true } } },
      orderBy: { createdAt: 'asc' },
    });
    // Group by ingredient and calculate change
    const byIngredient: Record<number, any[]> = {};
    history.forEach(h => {
      if (!byIngredient[h.ingredientId]) byIngredient[h.ingredientId] = [];
      byIngredient[h.ingredientId].push(h);
    });
    const alerts = Object.entries(byIngredient).map(([id, records]) => {
      const first = records[0];
      const last = records[records.length - 1];
      const change = first.price > 0 ? ((last.price - first.price) / first.price) * 100 : 0;
      return { ingredientId: parseInt(id), ingredient: last.ingredient, oldPrice: first.price, newPrice: last.price, changePercent: Math.round(change * 10) / 10, records: records.length };
    }).filter(a => Math.abs(a.changePercent) > 5).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
    res.json(alerts);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur alertes prix' }); }
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
    let applied = 0;
    for (const match of matches || []) {
      const item = await prisma.invoiceItem.findUnique({ where: { id: match.itemId } });
      if (!item || !item.unitPrice) continue;
      // Update ingredient price
      const ingredient = await prisma.ingredient.update({
        where: { id: match.ingredientId },
        data: { pricePerUnit: item.unitPrice },
      });
      // Record price history
      await prisma.priceHistory.create({
        data: { ingredientId: match.ingredientId, price: item.unitPrice, date: new Date().toISOString().slice(0, 10), source: 'invoice', restaurantId: (req as any).restaurantId },
      });
      // Mark item as matched by setting ingredientId
      await prisma.invoiceItem.update({
        where: { id: match.itemId },
        data: { ingredientId: match.ingredientId },
      });
      applied++;
    }
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'processed' } });
    res.json({ applied });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur application facture' }); }
});

app.delete('/api/invoices/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const existing = await prisma.invoice.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Non trouvé' });
    await prisma.invoice.delete({ where: { id: existing.id } });
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression' }); }
});

app.post('/api/invoices/scan', authWithRestaurant, async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    const { imageBase64, mimeType } = req.body as { imageBase64: string; mimeType: string };
    if (!imageBase64 || !mimeType) return res.status(400).json({ error: 'imageBase64 et mimeType requis' });

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: 'Tu es un expert comptable. Analyse cette facture fournisseur et extrais les données en JSON. Réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni explication.',
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
              text: 'Extrais les données de cette facture: fournisseur (string), numeroFacture (string), dateFacture (string YYYY-MM-DD), totalHT (number), totalTTC (number), tva (number), items (array of {designation: string, quantite: number, unite: string, prixUnitaire: number, total: number}). Si une valeur est inconnue, utilise null.',
            },
          ],
        },
      ],
    });

    const text = (response.content[0] as any).text as string;
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(422).json({ error: "Impossible d'analyser la réponse", raw: text });
    }
  } catch (e: any) {
    console.error(e);
    if (e?.status === 400 && e?.message?.includes('credit balance')) {
      return res.status(503).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
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
    const recipes = await prisma.recipe.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredients: { include: { ingredient: true } } } });

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
        return total + ri.quantity * ri.ingredient.pricePerUnit * wasteMultiplier;
      }, 0);
      const costPerPortion = recipe.nbPortions > 0 ? foodCost / recipe.nbPortions : foodCost;
      const margin = recipe.sellingPrice - costPerPortion;
      const marginPercent = recipe.sellingPrice > 0 ? (margin / recipe.sellingPrice) * 100 : 0;
      const salesData = salesByRecipe[recipe.id] || { qty: 0, revenue: 0 };
      const popularity = totalSales > 0 ? (salesData.qty / totalSales) * 100 : 0;
      const avgMargin = recipes.reduce((sum, r) => {
        const fc = r.ingredients.reduce((t, ri) => t + ri.quantity * ri.ingredient.pricePerUnit * (ri.wastePercent > 0 ? 1/(1-ri.wastePercent/100) : 1), 0);
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
    const { content, senderId, senderName } = req.body;
    const msg = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: senderId || 'user',
        senderName: senderName || req.user?.email || 'Moi',
        content,
        timestamp: new Date().toISOString(),
        read: true,
      },
    });
    // Update conversation lastMessage + updatedAt
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { lastMessage: content, updatedAt: new Date() },
    });
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
    await prisma.message.deleteMany({ where: { conversationId: req.params.id } });
    await prisma.conversation.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) { console.error(e); res.status(500).json({ error: 'Erreur suppression' }); }
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
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) return res.status(400).json({ error: 'to, subject, body requis' });
    console.warn('Email SMTP not configured — skipping send. Use Resend instead.');
    const email = { id: `e-${Date.now()}`, to, subject, body, from: 'noreply@restaumargin.com', messageId: `local-${Date.now()}`, sentAt: new Date().toISOString() };
    sentEmails.push(email);
    res.json({ success: true, messageId: email.messageId, warning: 'SMTP not configured, email not actually sent' });
  } catch (e: any) { res.status(500).json({ error: e.message || 'Erreur envoi email' }); }
});

app.get('/api/email/sent', authWithRestaurant, (_req, res) => { res.json(sentEmails); });

// ── Public menu ──
app.get('/api/public/menu', async (req, res) => {
  try {
    const restaurantId = parseInt(req.query.restaurantId as string) || 1;
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
    });
    res.json(recipes.map(r => ({
      id: r.id, name: r.name, category: r.category,
      sellingPrice: r.sellingPrice, description: r.description,
      allergens: [...new Set(r.ingredients.flatMap(ri => ri.ingredient?.allergens || []))],
    })));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

// ── AI Chat ──
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
const aiRateLimit = new Map<number, { count: number; resetAt: number }>();
const aiRateLimitPerRestaurant = new Map<number, { count: number; resetAt: number }>();

function checkAiRateLimit(restaurantId: number): boolean {
  const now = Date.now();
  const entry = aiRateLimitPerRestaurant.get(restaurantId);
  if (entry && now < entry.resetAt && entry.count >= 10) {
    return false; // rate limited
  }
  if (!entry || now >= entry.resetAt) {
    aiRateLimitPerRestaurant.set(restaurantId, { count: 1, resetAt: now + 60000 });
  } else {
    entry.count++;
  }
  return true;
}

app.post('/api/ai/chat', authWithRestaurant, async (req: any, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis' });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });

    // Rate limit per user
    const userId = req.user?.userId || 0;
    const now = Date.now();
    const entry = aiRateLimit.get(userId);
    if (entry && now < entry.resetAt && entry.count >= 20) {
      return res.status(429).json({ error: 'Limite atteinte (20 questions/heure)' });
    }
    if (!entry || now > (entry?.resetAt || 0)) {
      aiRateLimit.set(userId, { count: 1, resetAt: now + 3600000 });
    } else { entry.count++; }

    const restaurantId = req.restaurantId;

    // Build context from restaurant data
    const today = new Date().toISOString().slice(0, 10);
    const [recipes, ingredients, inventory, suppliers, employeeCount, recentOrders, recentSales, recentTemps, recentCleanings, employees] = await Promise.all([
      prisma.recipe.findMany({ where: { restaurantId }, include: { ingredients: { include: { ingredient: true } } }, take: 50 }),
      prisma.ingredient.findMany({ where: { restaurantId }, orderBy: { pricePerUnit: 'desc' }, take: 30 }),
      prisma.inventoryItem.findMany({ where: { restaurantId }, include: { ingredient: true } }),
      prisma.supplier.findMany({ where: { restaurantId }, take: 20 }),
      prisma.employee.count({ where: { restaurantId, active: true } }),
      prisma.marketplaceOrder.count({ where: { restaurantId } }),
      prisma.menuSale.findMany({ where: { restaurantId }, orderBy: { date: 'desc' }, take: 100 }),
      prisma.haccpTemperature.findMany({ where: { restaurantId, date: today }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.haccpCleaning.findMany({ where: { restaurantId, date: today }, take: 20 }),
      prisma.employee.findMany({ where: { restaurantId, active: true }, take: 30 }),
    ]);

    const recipesSummary = recipes.map(r => {
      const cost = r.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
      const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
      return `- ${r.name} (id:${r.id}, ${r.category}): vente ${r.sellingPrice}€, coût ${cost.toFixed(2)}€, marge ${margin.toFixed(1)}%`;
    }).join('\n');

    const lowStock = inventory.filter((i: any) => i.currentStock < i.minStock);
    const stockAlerts = lowStock.length > 0
      ? lowStock.map((i: any) => `- ${i.ingredient.name} (id:${i.ingredientId}): ${i.currentStock}/${i.minStock} ${i.ingredient.unit}`).join('\n')
      : 'Aucune alerte';

    const ingredientsList = ingredients.map((i: any) => `- ${i.name} (id:${i.id}, ${i.unit}, ${i.pricePerUnit}€/${i.unit}, catégorie: ${i.category})`).join('\n');
    const suppliersList = suppliers.map((s: any) => `- ${s.name} (id:${s.id})`).join('\n');
    const employeesList = employees.map((e: any) => `- ${e.name} (id:${e.id}, ${e.role}, ${e.hourlyRate}€/h)`).join('\n');

    const todayTemps = recentTemps.length > 0
      ? recentTemps.map((t: any) => `- ${t.zone}: ${t.temperature}°C (${t.status})`).join('\n')
      : 'Aucun relevé aujourd\'hui';

    const context = `STATISTIQUES: ${recipes.length} recettes, ${ingredients.length} ingrédients, ${suppliers.length} fournisseurs, ${employeeCount} employés actifs, ${recentOrders} commandes, ${recentSales.length} ventes récentes.

RECETTES:\n${recipesSummary || 'Aucune'}

ALERTES STOCK:\n${stockAlerts}

INGRÉDIENTS (${ingredients.length}):\n${ingredientsList || 'Aucun'}

FOURNISSEURS (${suppliers.length}):\n${suppliersList || 'Aucun'}

EMPLOYÉS (${employeeCount}):\n${employeesList || 'Aucun'}

RELEVÉS HACCP AUJOURD'HUI:\n${todayTemps}`;

    const actionSystemPrompt = `Tu es l'assistant IA RestauMargin, expert en gestion restaurant. Tu peux analyser les données ET AGIR sur le restaurant de l'utilisateur.

Quand l'utilisateur te demande de créer, modifier ou supprimer quelque chose, réponds avec un bloc d'action JSON entre des balises \`\`\`action et \`\`\`. Tu peux inclure du texte explicatif avant et après le bloc action.

ACTIONS DISPONIBLES :

═══ 1. FICHES TECHNIQUES (recettes) ═══

Créer une fiche technique :
\`\`\`action
{"type":"create_recipe","data":{"name":"Nom du plat","portions":4,"category":"Plats","sellingPrice":18.50,"description":"Description optionnelle","ingredients":[{"name":"Ingrédient 1","quantity":0.3,"unit":"kg","pricePerUnit":12.00,"category":"Viandes"},{"name":"Ingrédient 2","quantity":0.1,"unit":"kg","pricePerUnit":3.50,"category":"Légumes"}]}}
\`\`\`

Modifier une recette existante (ajouter/retirer ingrédients, changer quantités, prix de vente) :
\`\`\`action
{"type":"update_recipe","data":{"recipeId":1,"name":"Nouveau nom","sellingPrice":22.00,"category":"Plats","addIngredients":[{"name":"Parmesan","quantity":0.05,"unit":"kg","pricePerUnit":18.00,"category":"Produits laitiers"}],"removeIngredients":["Gruyère"],"updateIngredients":[{"name":"Tomates","quantity":0.4}]}}
\`\`\`

Analyser le food cost d'une recette :
\`\`\`action
{"type":"analyze_recipe","data":{"recipeId":1}}
\`\`\`

Dupliquer une recette pour créer une variante :
\`\`\`action
{"type":"duplicate_recipe","data":{"recipeId":1,"newName":"Variante du plat"}}
\`\`\`

═══ 2. INGRÉDIENTS ═══

Ajouter un ingrédient :
\`\`\`action
{"type":"add_ingredient","data":{"name":"Tomates","unit":"kg","pricePerUnit":2.50,"category":"Légumes","supplier":"Metro"}}
\`\`\`

Mettre à jour le prix d'un ingrédient :
\`\`\`action
{"type":"update_price","data":{"ingredientId":1,"newPrice":3.20,"reason":"Hausse fournisseur"}}
\`\`\`

Vérifier le stock d'un ou plusieurs ingrédients :
\`\`\`action
{"type":"check_stock","data":{"ingredientNames":["Tomates","Poulet","Crème"]}}
\`\`\`

═══ 3. COMMANDES ═══

Créer une commande fournisseur :
\`\`\`action
{"type":"create_order","data":{"supplierName":"Metro","items":[{"productName":"Tomates","quantity":10,"unit":"kg","unitPrice":2.50}]}}
\`\`\`

Suggérer une commande basée sur le stock bas :
\`\`\`action
{"type":"suggest_order","data":{"supplierName":"Metro"}}
\`\`\`

═══ 4. FOURNISSEURS ═══

Ajouter un fournisseur :
\`\`\`action
{"type":"add_supplier","data":{"name":"Metro","phone":"01 23 45 67 89","email":"contact@metro.fr","address":"Zone Industrielle","city":"Paris","categories":["Viandes","Légumes"],"contactName":"Jean Dupont","delivery":true,"minOrder":"150€","paymentTerms":"30 jours"}}
\`\`\`

Comparer les prix entre fournisseurs pour un ingrédient :
\`\`\`action
{"type":"compare_suppliers","data":{"ingredientName":"Poulet"}}
\`\`\`

═══ 5. PLANNING ═══

Ajouter un shift employé :
\`\`\`action
{"type":"add_shift","data":{"employeeName":"Jean Dupont","date":"2026-04-01","startTime":"09:00","endTime":"15:00","type":"Midi","notes":"Service traiteur"}}
\`\`\`

Générer un planning semaine :
\`\`\`action
{"type":"weekly_planning","data":{"weekStart":"2026-04-06","shifts":[{"employeeName":"Jean Dupont","date":"2026-04-06","startTime":"09:00","endTime":"15:00","type":"Midi"},{"employeeName":"Marie Martin","date":"2026-04-06","startTime":"17:00","endTime":"23:00","type":"Soir"}]}}
\`\`\`

═══ 6. ANALYSE ═══

Analyser les marges par plat/catégorie :
\`\`\`action
{"type":"margin_analysis","data":{}}
\`\`\`

Top plats par vente et marge :
\`\`\`action
{"type":"best_sellers","data":{"period":"month"}}
\`\`\`

Alertes sur les coûts matière en hausse :
\`\`\`action
{"type":"cost_alert","data":{}}
\`\`\`

Rapport quotidien (CA, couverts, coût matière) :
\`\`\`action
{"type":"daily_report","data":{"date":"2026-04-01"}}
\`\`\`

═══ 7. HACCP ═══

Enregistrer une prise de température :
\`\`\`action
{"type":"log_temperature","data":{"zone":"Frigo","temperature":3.5,"recordedBy":"Chef","notes":"RAS"}}
\`\`\`

Générer le checklist nettoyage du jour :
\`\`\`action
{"type":"cleaning_checklist","data":{"date":"2026-04-01"}}
\`\`\`

RÈGLES IMPORTANTES :
- Utilise des prix réalistes pour la restauration française si l'utilisateur n'en donne pas
- Les catégories valides pour les recettes : Entrées, Plats, Desserts, Boissons, Accompagnements
- Les catégories valides pour les ingrédients : Viandes, Poissons, Légumes, Fruits, Produits laitiers, Épicerie sèche, Surgelés, Boissons, Condiments, Boulangerie
- Les unités valides : kg, g, L, cl, unité, botte, pièce
- Quand tu crées une recette, inclus TOUJOURS les ingrédients avec quantités et prix
- Pour les modifications de recettes, utilise les IDs des recettes/ingrédients visibles dans les données
- Tu peux proposer plusieurs actions dans une même réponse
- En dehors des actions, réponds normalement en français avec des conseils utiles
- Sois concis et actionnable (max 400 mots)
- Pour le planning, les types de shift valides : Matin, Midi, Soir, Coupure
- Pour HACCP, les zones valides : Frigo, Congélateur, Plats chauds, Réception
- Pour les températures, détermine le status automatiquement selon les normes HACCP

DONNÉES DU RESTAURANT :
${context}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: actionSystemPrompt,
      messages: [{ role: 'user', content: message.trim() }],
    });

    const fullText = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');

    // Parse action blocks from response
    const actionRegex = /```action\s*\n?([\s\S]*?)```/g;
    const actions: Array<{ type: string; success: boolean; id?: number; message: string; error?: string; data?: any }> = [];
    let match;

    while ((match = actionRegex.exec(fullText)) !== null) {
      try {
        const actionData = JSON.parse(match[1].trim());

        if (actionData.type === 'create_recipe') {
          const d = actionData.data;
          // Create or find ingredients first, then create recipe with links
          const ingredientIds: Array<{ ingredientId: number; quantity: number; wastePercent: number }> = [];

          for (const ing of (d.ingredients || [])) {
            // Try to find existing ingredient by name
            let ingredient = await prisma.ingredient.findFirst({
              where: { restaurantId, name: { equals: ing.name, mode: 'insensitive' as any } },
            });
            if (!ingredient) {
              ingredient = await prisma.ingredient.create({
                data: {
                  name: ing.name,
                  unit: ing.unit || 'kg',
                  pricePerUnit: ing.pricePerUnit || 0,
                  category: ing.category || 'Épicerie sèche',
                  restaurantId,
                },
              });
            }
            ingredientIds.push({
              ingredientId: ingredient.id,
              quantity: ing.quantity || 0,
              wastePercent: ing.wastePercent || 0,
            });
          }

          const recipe = await prisma.recipe.create({
            data: {
              name: d.name,
              category: d.category || 'Plats',
              sellingPrice: d.sellingPrice || 0,
              nbPortions: d.portions || 1,
              description: d.description || '',
              restaurantId,
              ingredients: {
                create: ingredientIds,
              },
            },
          });

          actions.push({ type: 'create_recipe', success: true, id: recipe.id, message: `Fiche technique "${d.name}" créée avec ${ingredientIds.length} ingrédients` });

        } else if (actionData.type === 'add_ingredient') {
          const d = actionData.data;
          // Check if ingredient already exists
          const existing = await prisma.ingredient.findFirst({
            where: { restaurantId, name: { equals: d.name, mode: 'insensitive' as any } },
          });
          if (existing) {
            actions.push({ type: 'add_ingredient', success: true, id: existing.id, message: `Ingrédient "${d.name}" existe déjà` });
          } else {
            // Find supplier if provided
            let supplierId: number | undefined;
            if (d.supplier) {
              const supplier = await prisma.supplier.findFirst({
                where: { restaurantId, name: { contains: d.supplier, mode: 'insensitive' as any } },
              });
              if (supplier) supplierId = supplier.id;
            }

            const ingredient = await prisma.ingredient.create({
              data: {
                name: d.name,
                unit: d.unit || 'kg',
                pricePerUnit: d.pricePerUnit || 0,
                category: d.category || 'Épicerie sèche',
                supplier: d.supplier || null,
                supplierId: supplierId || null,
                restaurantId,
              },
            });
            actions.push({ type: 'add_ingredient', success: true, id: ingredient.id, message: `Ingrédient "${d.name}" ajouté (${d.pricePerUnit || 0}€/${d.unit || 'kg'})` });
          }

        } else if (actionData.type === 'create_order') {
          const d = actionData.data;
          const items = (d.items || []).map((item: any) => ({
            productName: item.productName || item.name,
            quantity: item.quantity || 0,
            unit: item.unit || 'kg',
            unitPrice: item.unitPrice || 0,
            total: (item.quantity || 0) * (item.unitPrice || 0),
          }));
          const totalHT = items.reduce((s: number, it: any) => s + it.total, 0);

          const order = await prisma.marketplaceOrder.create({
            data: {
              supplierName: d.supplierName || d.supplier || 'Fournisseur',
              status: 'draft',
              totalHT: Math.round(totalHT * 100) / 100,
              restaurantId,
              items: { create: items },
            },
          });
          actions.push({ type: 'create_order', success: true, id: order.id, message: `Commande "${d.supplierName || d.supplier}" créée (${items.length} articles, ${totalHT.toFixed(2)}€ HT)` });

        } else if (actionData.type === 'update_recipe') {
          const d = actionData.data;
          const recipe = await prisma.recipe.findFirst({
            where: { id: d.recipeId, restaurantId },
            include: { ingredients: { include: { ingredient: true } } },
          });
          if (!recipe) {
            actions.push({ type: 'update_recipe', success: false, message: `Recette id ${d.recipeId} non trouvée` });
          } else {
            // Update recipe fields
            const updateData: any = {};
            if (d.name) updateData.name = d.name;
            if (d.sellingPrice !== undefined) updateData.sellingPrice = d.sellingPrice;
            if (d.category) updateData.category = d.category;
            if (d.description !== undefined) updateData.description = d.description;
            if (d.portions) updateData.nbPortions = d.portions;

            if (Object.keys(updateData).length > 0) {
              await prisma.recipe.update({ where: { id: recipe.id }, data: updateData });
            }

            // Remove ingredients by name
            if (d.removeIngredients && Array.isArray(d.removeIngredients)) {
              for (const ingName of d.removeIngredients) {
                const ri = recipe.ingredients.find((ri: any) => ri.ingredient.name.toLowerCase() === ingName.toLowerCase());
                if (ri) {
                  await prisma.recipeIngredient.delete({ where: { id: ri.id } });
                }
              }
            }

            // Update ingredient quantities
            if (d.updateIngredients && Array.isArray(d.updateIngredients)) {
              for (const upd of d.updateIngredients) {
                const ri = recipe.ingredients.find((ri: any) => ri.ingredient.name.toLowerCase() === upd.name.toLowerCase());
                if (ri) {
                  const riUpdate: any = {};
                  if (upd.quantity !== undefined) riUpdate.quantity = upd.quantity;
                  if (upd.wastePercent !== undefined) riUpdate.wastePercent = upd.wastePercent;
                  await prisma.recipeIngredient.update({ where: { id: ri.id }, data: riUpdate });
                }
              }
            }

            // Add new ingredients
            let addedCount = 0;
            if (d.addIngredients && Array.isArray(d.addIngredients)) {
              for (const ing of d.addIngredients) {
                let ingredient = await prisma.ingredient.findFirst({
                  where: { restaurantId, name: { equals: ing.name, mode: 'insensitive' as any } },
                });
                if (!ingredient) {
                  ingredient = await prisma.ingredient.create({
                    data: { name: ing.name, unit: ing.unit || 'kg', pricePerUnit: ing.pricePerUnit || 0, category: ing.category || 'Épicerie sèche', restaurantId },
                  });
                }
                // Check not already linked
                const existing = await prisma.recipeIngredient.findFirst({
                  where: { recipeId: recipe.id, ingredientId: ingredient.id },
                });
                if (!existing) {
                  await prisma.recipeIngredient.create({
                    data: { recipeId: recipe.id, ingredientId: ingredient.id, quantity: ing.quantity || 0, wastePercent: ing.wastePercent || 0 },
                  });
                  addedCount++;
                }
              }
            }

            actions.push({ type: 'update_recipe', success: true, id: recipe.id, message: `Recette "${recipe.name}" mise à jour${addedCount ? ` (+${addedCount} ingrédients)` : ''}` });
          }

        } else if (actionData.type === 'analyze_recipe') {
          const d = actionData.data;
          const recipe = await prisma.recipe.findFirst({
            where: { id: d.recipeId, restaurantId },
            include: { ingredients: { include: { ingredient: true } } },
          });
          if (!recipe) {
            actions.push({ type: 'analyze_recipe', success: false, message: `Recette id ${d.recipeId} non trouvée` });
          } else {
            const ingredientCosts = recipe.ingredients.map((ri: any) => ({
              name: ri.ingredient.name,
              quantity: ri.quantity,
              unit: ri.ingredient.unit,
              unitPrice: ri.ingredient.pricePerUnit,
              cost: Math.round(ri.quantity * ri.ingredient.pricePerUnit * 100) / 100,
              wastePercent: ri.wastePercent || 0,
              costWithWaste: Math.round(ri.quantity * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100) * 100) / 100,
            }));
            const totalCost = ingredientCosts.reduce((s: number, ic: any) => s + ic.costWithWaste, 0);
            const foodCostPercent = recipe.sellingPrice > 0 ? (totalCost / recipe.sellingPrice * 100) : 0;
            const margin = recipe.sellingPrice - totalCost;
            const costPerPortion = recipe.nbPortions > 0 ? totalCost / recipe.nbPortions : totalCost;

            actions.push({
              type: 'analyze_recipe', success: true, id: recipe.id,
              message: `Analyse "${recipe.name}": coût total ${totalCost.toFixed(2)}€, food cost ${foodCostPercent.toFixed(1)}%, marge ${margin.toFixed(2)}€, coût/portion ${costPerPortion.toFixed(2)}€`,
              data: { name: recipe.name, sellingPrice: recipe.sellingPrice, totalCost: Math.round(totalCost * 100) / 100, foodCostPercent: Math.round(foodCostPercent * 10) / 10, margin: Math.round(margin * 100) / 100, costPerPortion: Math.round(costPerPortion * 100) / 100, ingredients: ingredientCosts },
            } as any);
          }

        } else if (actionData.type === 'duplicate_recipe') {
          const d = actionData.data;
          const original = await prisma.recipe.findFirst({
            where: { id: d.recipeId, restaurantId },
            include: { ingredients: true },
          });
          if (!original) {
            actions.push({ type: 'duplicate_recipe', success: false, message: `Recette id ${d.recipeId} non trouvée` });
          } else {
            const newRecipe = await prisma.recipe.create({
              data: {
                name: d.newName || `${original.name} (copie)`,
                category: original.category,
                sellingPrice: original.sellingPrice,
                nbPortions: original.nbPortions,
                description: original.description,
                prepTimeMinutes: original.prepTimeMinutes,
                cookTimeMinutes: original.cookTimeMinutes,
                laborCostPerHour: original.laborCostPerHour,
                restaurantId,
                ingredients: {
                  create: original.ingredients.map((ri: any) => ({
                    ingredientId: ri.ingredientId,
                    quantity: ri.quantity,
                    wastePercent: ri.wastePercent,
                  })),
                },
              },
            });
            actions.push({ type: 'duplicate_recipe', success: true, id: newRecipe.id, message: `Recette "${original.name}" dupliquée en "${newRecipe.name}" avec ${original.ingredients.length} ingrédients` });
          }

        } else if (actionData.type === 'update_price') {
          const d = actionData.data;
          let ingredient: any = null;
          if (d.ingredientId) {
            ingredient = await prisma.ingredient.findFirst({ where: { id: d.ingredientId, restaurantId } });
          } else if (d.ingredientName) {
            ingredient = await prisma.ingredient.findFirst({ where: { restaurantId, name: { equals: d.ingredientName, mode: 'insensitive' as any } } });
          }
          if (!ingredient) {
            actions.push({ type: 'update_price', success: false, message: `Ingrédient non trouvé` });
          } else {
            const oldPrice = ingredient.pricePerUnit;
            await prisma.ingredient.update({ where: { id: ingredient.id }, data: { pricePerUnit: d.newPrice } });
            // Log price history
            await prisma.priceHistory.create({
              data: { ingredientId: ingredient.id, price: d.newPrice, date: today, source: d.reason || 'IA assistant', restaurantId },
            });
            const changePercent = oldPrice > 0 ? ((d.newPrice - oldPrice) / oldPrice * 100).toFixed(1) : 'N/A';
            actions.push({ type: 'update_price', success: true, id: ingredient.id, message: `Prix de "${ingredient.name}" mis à jour: ${oldPrice}€ → ${d.newPrice}€/${ingredient.unit} (${changePercent}%)` });
          }

        } else if (actionData.type === 'check_stock') {
          const d = actionData.data;
          const names: string[] = d.ingredientNames || d.names || [];
          const stockResults: any[] = [];
          for (const name of names) {
            const inv = await prisma.inventoryItem.findFirst({
              where: { restaurantId, ingredient: { name: { contains: name, mode: 'insensitive' as any } } },
              include: { ingredient: true },
            });
            if (inv) {
              stockResults.push({ name: inv.ingredient.name, stock: inv.currentStock, min: inv.minStock, max: inv.maxStock, unit: inv.unit, alert: inv.currentStock < inv.minStock });
            } else {
              const ing = await prisma.ingredient.findFirst({ where: { restaurantId, name: { contains: name, mode: 'insensitive' as any } } });
              stockResults.push({ name: ing?.name || name, stock: null, min: null, max: null, unit: ing?.unit || '?', alert: false, noInventory: true });
            }
          }
          const alertCount = stockResults.filter(s => s.alert).length;
          actions.push({
            type: 'check_stock', success: true,
            message: `Stock vérifié pour ${stockResults.length} ingrédients${alertCount > 0 ? ` (${alertCount} en alerte)` : ''}`,
            data: stockResults,
          } as any);

        } else if (actionData.type === 'suggest_order') {
          const d = actionData.data;
          const lowStockItems = await prisma.inventoryItem.findMany({
            where: { restaurantId, currentStock: { lt: prisma.raw('min_stock') as any } },
            include: { ingredient: true },
          }).catch(() => []);
          // Fallback: manual filter
          const allInventory = await prisma.inventoryItem.findMany({ where: { restaurantId }, include: { ingredient: true } });
          const lowItems = allInventory.filter((i: any) => i.currentStock < i.minStock);
          const supplierFilter = d.supplierName || d.supplier;
          const filtered = supplierFilter
            ? lowItems.filter((i: any) => i.ingredient.supplier?.toLowerCase().includes(supplierFilter.toLowerCase()))
            : lowItems;

          const suggestedItems = filtered.map((i: any) => ({
            productName: i.ingredient.name,
            quantity: Math.max(i.minStock - i.currentStock, i.minStock),
            unit: i.ingredient.unit,
            unitPrice: i.ingredient.pricePerUnit,
            currentStock: i.currentStock,
            minStock: i.minStock,
          }));
          const totalHT = suggestedItems.reduce((s: number, it: any) => s + it.quantity * it.unitPrice, 0);

          if (suggestedItems.length === 0) {
            actions.push({ type: 'suggest_order', success: true, message: 'Aucun produit en stock bas nécessitant une commande' });
          } else {
            actions.push({
              type: 'suggest_order', success: true,
              message: `Suggestion de commande: ${suggestedItems.length} articles, total estimé ${totalHT.toFixed(2)}€ HT`,
              data: suggestedItems,
            } as any);
          }

        } else if (actionData.type === 'add_supplier') {
          const d = actionData.data;
          const existing = await prisma.supplier.findFirst({
            where: { restaurantId, name: { equals: d.name, mode: 'insensitive' as any } },
          });
          if (existing) {
            actions.push({ type: 'add_supplier', success: true, id: existing.id, message: `Fournisseur "${d.name}" existe déjà` });
          } else {
            const supplier = await prisma.supplier.create({
              data: {
                name: d.name,
                phone: d.phone || null,
                email: d.email || null,
                address: d.address || null,
                city: d.city || null,
                postalCode: d.postalCode || null,
                region: d.region || null,
                categories: d.categories || [],
                contactName: d.contactName || null,
                delivery: d.delivery !== undefined ? d.delivery : true,
                minOrder: d.minOrder || null,
                paymentTerms: d.paymentTerms || null,
                notes: d.notes || null,
                restaurantId,
              },
            });
            actions.push({ type: 'add_supplier', success: true, id: supplier.id, message: `Fournisseur "${d.name}" ajouté` });
          }

        } else if (actionData.type === 'compare_suppliers') {
          const d = actionData.data;
          const ingredientName = d.ingredientName || d.name;
          // Find all ingredients matching the name and their suppliers
          const matchingIngs = await prisma.ingredient.findMany({
            where: { restaurantId, name: { contains: ingredientName, mode: 'insensitive' as any } },
            include: { supplierRef: true, priceHistory: { orderBy: { createdAt: 'desc' as any }, take: 5 } },
          });
          if (matchingIngs.length === 0) {
            actions.push({ type: 'compare_suppliers', success: false, message: `Ingrédient "${ingredientName}" non trouvé` });
          } else {
            const comparison = matchingIngs.map((ing: any) => ({
              name: ing.name,
              supplier: ing.supplier || ing.supplierRef?.name || 'Non défini',
              currentPrice: ing.pricePerUnit,
              unit: ing.unit,
              priceHistory: ing.priceHistory.map((ph: any) => ({ date: ph.date, price: ph.price })),
            }));
            actions.push({
              type: 'compare_suppliers', success: true,
              message: `Comparaison pour "${ingredientName}": ${comparison.length} entrée(s) trouvée(s)`,
              data: comparison,
            } as any);
          }

        } else if (actionData.type === 'add_shift') {
          const d = actionData.data;
          // Find employee by name
          const employee = await prisma.employee.findFirst({
            where: { restaurantId, name: { contains: d.employeeName || d.employee, mode: 'insensitive' as any }, active: true },
          });
          if (!employee) {
            actions.push({ type: 'add_shift', success: false, message: `Employé "${d.employeeName || d.employee}" non trouvé` });
          } else {
            const shift = await prisma.shift.create({
              data: {
                employeeId: employee.id,
                date: d.date || today,
                startTime: d.startTime || '09:00',
                endTime: d.endTime || '17:00',
                type: d.type || 'Midi',
                notes: d.notes || null,
                restaurantId,
              },
            });
            const hours = ((parseInt(d.endTime?.split(':')[0] || '17') - parseInt(d.startTime?.split(':')[0] || '9')) + (parseInt(d.endTime?.split(':')[1] || '0') - parseInt(d.startTime?.split(':')[1] || '0')) / 60);
            actions.push({ type: 'add_shift', success: true, id: shift.id, message: `Shift ajouté: ${employee.name} le ${d.date || today} (${d.startTime || '09:00'}-${d.endTime || '17:00'}, ~${hours.toFixed(1)}h)` });
          }

        } else if (actionData.type === 'weekly_planning') {
          const d = actionData.data;
          const shifts = d.shifts || [];
          let created = 0;
          let errors = 0;
          for (const s of shifts) {
            const employee = await prisma.employee.findFirst({
              where: { restaurantId, name: { contains: s.employeeName || s.employee, mode: 'insensitive' as any }, active: true },
            });
            if (employee) {
              await prisma.shift.create({
                data: {
                  employeeId: employee.id,
                  date: s.date,
                  startTime: s.startTime || '09:00',
                  endTime: s.endTime || '17:00',
                  type: s.type || 'Midi',
                  notes: s.notes || null,
                  restaurantId,
                },
              });
              created++;
            } else {
              errors++;
            }
          }
          actions.push({ type: 'weekly_planning', success: true, message: `Planning semaine: ${created} shifts créés${errors > 0 ? `, ${errors} employés non trouvés` : ''}` });

        } else if (actionData.type === 'margin_analysis') {
          const allRecipes = await prisma.recipe.findMany({
            where: { restaurantId },
            include: { ingredients: { include: { ingredient: true } } },
          });
          const analysis = allRecipes.map((r: any) => {
            const cost = r.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100), 0);
            const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
            return { name: r.name, category: r.category, cost: Math.round(cost * 100) / 100, sellingPrice: r.sellingPrice, margin: Math.round(margin * 10) / 10, profit: Math.round((r.sellingPrice - cost) * 100) / 100 };
          }).sort((a: any, b: any) => a.margin - b.margin);

          const avgMargin = analysis.length > 0 ? (analysis.reduce((s: number, a: any) => s + a.margin, 0) / analysis.length) : 0;
          const lowMargin = analysis.filter((a: any) => a.margin < 65);
          const highMargin = analysis.filter((a: any) => a.margin >= 75);

          // Group by category
          const byCategory: any = {};
          analysis.forEach((a: any) => {
            if (!byCategory[a.category]) byCategory[a.category] = { count: 0, totalMargin: 0 };
            byCategory[a.category].count++;
            byCategory[a.category].totalMargin += a.margin;
          });
          const categoryAvg = Object.entries(byCategory).map(([cat, data]: any) => ({ category: cat, avgMargin: Math.round(data.totalMargin / data.count * 10) / 10, count: data.count }));

          actions.push({
            type: 'margin_analysis', success: true,
            message: `Analyse de ${analysis.length} recettes: marge moyenne ${avgMargin.toFixed(1)}%, ${lowMargin.length} plats sous 65%, ${highMargin.length} plats au-dessus de 75%`,
            data: { recipes: analysis, avgMargin: Math.round(avgMargin * 10) / 10, lowMarginCount: lowMargin.length, highMarginCount: highMargin.length, byCategory: categoryAvg },
          } as any);

        } else if (actionData.type === 'best_sellers') {
          const d = actionData.data;
          const period = d.period || 'month';
          const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90;
          const sinceDate = new Date();
          sinceDate.setDate(sinceDate.getDate() - daysBack);
          const sinceStr = sinceDate.toISOString().slice(0, 10);

          const sales = await prisma.menuSale.findMany({
            where: { restaurantId, date: { gte: sinceStr } },
          });

          // Aggregate by recipe
          const byRecipe: any = {};
          sales.forEach((s: any) => {
            if (!byRecipe[s.recipeName]) byRecipe[s.recipeName] = { recipeName: s.recipeName, recipeId: s.recipeId, totalQty: 0, totalRevenue: 0 };
            byRecipe[s.recipeName].totalQty += s.quantity;
            byRecipe[s.recipeName].totalRevenue += s.revenue;
          });
          const topSellers = Object.values(byRecipe).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue).slice(0, 10);

          // Enrich with margin data
          for (const seller of topSellers as any[]) {
            const recipe = recipes.find((r: any) => r.id === seller.recipeId);
            if (recipe) {
              const cost = recipe.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
              seller.cost = Math.round(cost * 100) / 100;
              seller.margin = recipe.sellingPrice > 0 ? Math.round((recipe.sellingPrice - cost) / recipe.sellingPrice * 1000) / 10 : 0;
              seller.totalProfit = Math.round((seller.totalRevenue - cost * seller.totalQty) * 100) / 100;
            }
          }

          actions.push({
            type: 'best_sellers', success: true,
            message: `Top ${(topSellers as any[]).length} ventes (${daysBack} derniers jours): ${sales.length} ventes analysées`,
            data: topSellers,
          } as any);

        } else if (actionData.type === 'cost_alert') {
          // Compare current prices to price 30 days ago
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const sinceStr = thirtyDaysAgo.toISOString().slice(0, 10);

          const allIngredients = await prisma.ingredient.findMany({ where: { restaurantId } });
          const alerts: any[] = [];

          for (const ing of allIngredients) {
            const oldPrices = await prisma.priceHistory.findMany({
              where: { ingredientId: ing.id, date: { lte: sinceStr } },
              orderBy: { createdAt: 'desc' },
              take: 1,
            });
            if (oldPrices.length > 0) {
              const oldPrice = oldPrices[0].price;
              const change = ing.pricePerUnit - oldPrice;
              const changePercent = oldPrice > 0 ? (change / oldPrice * 100) : 0;
              if (changePercent > 5) {
                alerts.push({
                  name: ing.name, category: ing.category,
                  oldPrice, currentPrice: ing.pricePerUnit,
                  change: Math.round(change * 100) / 100,
                  changePercent: Math.round(changePercent * 10) / 10,
                });
              }
            }
          }
          alerts.sort((a, b) => b.changePercent - a.changePercent);

          actions.push({
            type: 'cost_alert', success: true,
            message: alerts.length > 0 ? `${alerts.length} ingrédient(s) avec hausse >5% sur 30 jours` : 'Aucune hausse significative détectée sur 30 jours',
            data: alerts,
          } as any);

        } else if (actionData.type === 'daily_report') {
          const d = actionData.data;
          const reportDate = d.date || today;

          const [daySales, dayExpenses, dayTemps] = await Promise.all([
            prisma.menuSale.findMany({ where: { restaurantId, date: reportDate } }),
            prisma.financialEntry.findMany({ where: { restaurantId, date: reportDate } }),
            prisma.haccpTemperature.findMany({ where: { restaurantId, date: reportDate } }),
          ]);

          const totalRevenue = daySales.reduce((s: number, sale: any) => s + sale.revenue, 0);
          const totalCovers = daySales.reduce((s: number, sale: any) => s + sale.quantity, 0);
          const expenses = dayExpenses.filter((e: any) => e.type === 'expense');
          const totalExpenses = expenses.reduce((s: number, e: any) => s + e.amount, 0);
          const ticketMoyen = totalCovers > 0 ? totalRevenue / totalCovers : 0;
          const nonConformeTemps = dayTemps.filter((t: any) => t.status === 'non_conforme');

          actions.push({
            type: 'daily_report', success: true,
            message: `Rapport ${reportDate}: CA ${totalRevenue.toFixed(2)}€, ${totalCovers} couverts, ticket moyen ${ticketMoyen.toFixed(2)}€`,
            data: {
              date: reportDate,
              revenue: Math.round(totalRevenue * 100) / 100,
              covers: totalCovers,
              ticketMoyen: Math.round(ticketMoyen * 100) / 100,
              expenses: Math.round(totalExpenses * 100) / 100,
              salesCount: daySales.length,
              haccpAlerts: nonConformeTemps.length,
            },
          } as any);

        } else if (actionData.type === 'log_temperature') {
          const d = actionData.data;
          // Auto-determine status based on HACCP norms
          let status = 'conforme';
          const temp = d.temperature;
          const zone = (d.zone || '').toLowerCase();
          if (zone.includes('frigo') && (temp < 0 || temp > 4)) status = 'non_conforme';
          else if (zone.includes('congel') && temp > -18) status = 'non_conforme';
          else if (zone.includes('chaud') && temp < 63) status = 'non_conforme';
          else if (zone.includes('réception') || zone.includes('reception')) {
            // For cold reception, should be < 4, for frozen < -18
            if (temp > 4) status = 'non_conforme';
          }

          const record = await prisma.haccpTemperature.create({
            data: {
              zone: d.zone || 'Frigo',
              temperature: d.temperature,
              status: d.status || status,
              recordedBy: d.recordedBy || 'IA Assistant',
              notes: d.notes || null,
              date: d.date || today,
              time: d.time || new Date().toTimeString().slice(0, 5),
              restaurantId,
            },
          });
          const emoji = status === 'conforme' ? '' : ' ALERTE';
          actions.push({ type: 'log_temperature', success: true, id: record.id, message: `Température ${d.zone}: ${d.temperature}°C (${status})${emoji}` });

        } else if (actionData.type === 'cleaning_checklist') {
          const d = actionData.data;
          const checkDate = d.date || today;

          // Check if checklist already exists for today
          const existingTasks = await prisma.haccpCleaning.findMany({ where: { restaurantId, date: checkDate } });
          if (existingTasks.length > 0) {
            const done = existingTasks.filter((t: any) => t.status === 'fait').length;
            actions.push({
              type: 'cleaning_checklist', success: true,
              message: `Checklist du ${checkDate} existe déjà: ${done}/${existingTasks.length} tâches complétées`,
              data: existingTasks.map((t: any) => ({ zone: t.zone, task: t.task, status: t.status, doneBy: t.doneBy })),
            } as any);
          } else {
            // Create default cleaning checklist
            const defaultTasks = [
              { zone: 'Cuisine', task: 'Nettoyage plans de travail et surfaces' },
              { zone: 'Cuisine', task: 'Nettoyage plaques de cuisson et fours' },
              { zone: 'Cuisine', task: 'Nettoyage hottes et filtres' },
              { zone: 'Cuisine', task: 'Nettoyage sols cuisine' },
              { zone: 'Chambre froide', task: 'Vérification et nettoyage chambre froide' },
              { zone: 'Chambre froide', task: 'Contrôle dates de péremption' },
              { zone: 'Salle', task: 'Nettoyage tables et chaises' },
              { zone: 'Salle', task: 'Nettoyage sols salle' },
              { zone: 'Salle', task: 'Nettoyage vitres et miroirs' },
              { zone: 'Toilettes', task: 'Nettoyage et désinfection toilettes' },
              { zone: 'Toilettes', task: 'Réapprovisionnement savon et papier' },
              { zone: 'Plonge', task: 'Nettoyage machine plonge et éviers' },
              { zone: 'Poubelles', task: 'Vidage et nettoyage poubelles' },
              { zone: 'Réception', task: 'Nettoyage zone réception marchandises' },
            ];
            const created = await prisma.haccpCleaning.createMany({
              data: defaultTasks.map(t => ({ ...t, status: 'en_attente', date: checkDate, restaurantId })),
            });
            actions.push({
              type: 'cleaning_checklist', success: true,
              message: `Checklist nettoyage du ${checkDate} créée: ${defaultTasks.length} tâches`,
              data: defaultTasks.map(t => ({ ...t, status: 'en_attente' })),
            } as any);
          }

        } else {
          actions.push({ type: actionData.type, success: false, message: `Action "${actionData.type}" non reconnue` });
        }
      } catch (actionErr: any) {
        console.error('AI action error:', actionErr.message);
        actions.push({ type: 'unknown', success: false, message: 'Erreur lors de l\'exécution de l\'action', error: actionErr.message });
      }
    }

    // Clean action blocks from visible text for a cleaner response
    const cleanedText = fullText.replace(/```action\s*\n?[\s\S]*?```/g, '').trim();

    res.json({ response: cleanedText, actions, usage: response.usage });
  } catch (e: any) {
    console.error('AI error:', e.message);
    if (e?.status === 400 && e?.message?.includes('credit balance')) {
      return res.status(503).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
    }
    res.status(500).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
  }
});

// ── AI: Forecast ──
app.post('/api/ai/forecast', authWithRestaurant, async (req: any, res) => {
  try {
    const { historicalData, days } = req.body;
    if (!historicalData || !Array.isArray(historicalData) || !days) {
      return res.status(400).json({ error: 'historicalData (array) et days (number) requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en prévision de ventes pour la restauration. Analyse les données historiques et prédis les ventes futures. Réponds UNIQUEMENT en JSON valide, sans texte avant ou après. Format: { "predictions": [{ "date": "YYYY-MM-DD", "covers": number, "revenue": number }] }`,
      messages: [{
        role: 'user',
        content: `Données historiques de ventes:\n${JSON.stringify(historicalData)}\n\nPrédis les ${days} prochains jours. Tiens compte des tendances, saisonnalité et jours de la semaine.`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ predictions: [], raw: text });
    }
  } catch (e: any) {
    console.error('AI forecast error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI: Menu Analysis (Menu Engineering) ──
app.post('/api/ai/menu-analysis', authWithRestaurant, async (req: any, res) => {
  try {
    const { recipes } = req.body;
    if (!recipes || !Array.isArray(recipes)) {
      return res.status(400).json({ error: 'recipes (array) requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en menu engineering pour la restauration. Classe les plats selon la matrice BCG adaptée à la restauration:
- Stars (haute popularité, haute marge) : les plats à promouvoir
- Puzzles (faible popularité, haute marge) : les plats à mieux vendre
- Chevaux de labour / Workhorses (haute popularité, faible marge) : les plats à optimiser
- Poids morts / Dogs (faible popularité, faible marge) : les plats à repenser ou supprimer

Réponds UNIQUEMENT en JSON valide: { "analysis": { "stars": ["nom"], "puzzles": ["nom"], "workhorses": ["nom"], "dogs": ["nom"] }, "recommendations": "string avec conseils détaillés" }`,
      messages: [{
        role: 'user',
        content: `Voici les plats du menu avec leur coût, prix de vente et nombre de ventes:\n${JSON.stringify(recipes)}`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ analysis: { stars: [], puzzles: [], workhorses: [], dogs: [] }, recommendations: text });
    }
  } catch (e: any) {
    console.error('AI menu-analysis error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI: Order Recommendation ──
app.post('/api/ai/order-recommendation', authWithRestaurant, async (req: any, res) => {
  try {
    const { stock, forecast, supplierPrices } = req.body;
    if (!stock || !Array.isArray(stock)) {
      return res.status(400).json({ error: 'stock (array) requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en gestion des commandes fournisseurs pour la restauration. Calcule les quantités optimales à commander en tenant compte du stock actuel, des prévisions de ventes et des prix fournisseurs. Minimise le gaspillage et les ruptures.

Réponds UNIQUEMENT en JSON valide: { "orders": [{ "ingredient": "nom", "quantity": number, "supplier": "nom fournisseur", "estimatedCost": number }] }`,
      messages: [{
        role: 'user',
        content: `Stock actuel:\n${JSON.stringify(stock)}\n\nPrévisions de ventes:\n${JSON.stringify(forecast || [])}\n\nPrix fournisseurs:\n${JSON.stringify(supplierPrices || [])}`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ orders: [], raw: text });
    }
  } catch (e: any) {
    console.error('AI order-recommendation error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI: Invoice Check ──
app.post('/api/ai/invoice-check', authWithRestaurant, async (req: any, res) => {
  try {
    const { invoiceData, historicalPrices } = req.body;
    if (!invoiceData) {
      return res.status(400).json({ error: 'invoiceData requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en contrôle des factures fournisseurs pour la restauration. Compare la facture avec les prix historiques et signale toute anomalie de prix (hausses anormales, erreurs potentielles, surfacturations).

Réponds UNIQUEMENT en JSON valide: { "anomalies": [{ "item": "nom produit", "invoicePrice": number, "avgPrice": number, "deviation": "string (+X%)" }], "summary": "résumé des anomalies et recommandations" }`,
      messages: [{
        role: 'user',
        content: `Données de la facture:\n${JSON.stringify(invoiceData)}\n\nHistorique des prix:\n${JSON.stringify(historicalPrices || [])}`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ anomalies: [], summary: text });
    }
  } catch (e: any) {
    console.error('AI invoice-check error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── Alerts ──
app.get('/api/alerts', authWithRestaurant, async (req: any, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true } });
    const recipes = await prisma.recipe.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredients: { include: { ingredient: true } } } });

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
      const cost = r.ingredients.reduce((s, ri) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
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
    if (!clientName || !subject) return res.status(400).json({ error: 'Nom client et objet requis' });

    const count = await prisma.devis.count({ where: { restaurantId: req.restaurantId } });
    const number = `DEV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const devisItems = (items || []).map((item: any) => ({
      description: item.description || '', quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0, total: (item.quantity || 1) * (item.unitPrice || 0),
    }));
    const totalHT = devisItems.reduce((s: number, i: any) => s + i.total, 0);
    const rate = tvaRate || 20;

    const devis = await prisma.devis.create({
      data: {
        number, clientName, clientEmail: clientEmail || null, clientPhone: clientPhone || null,
        clientAddress: clientAddress || null, subject, tvaRate: rate, totalHT, totalTTC: totalHT * (1 + rate / 100),
        validUntil: validUntil || null, notes: notes || null, restaurantId: req.restaurantId,
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
      await prisma.devisItem.deleteMany({ where: { devisId: id } });
      const devisItems = items.map((item: any) => ({
        devisId: id, description: item.description || '', quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0, total: (item.quantity || 1) * (item.unitPrice || 0),
      }));
      await prisma.devisItem.createMany({ data: devisItems });
      totalHT = devisItems.reduce((s: number, i: any) => s + i.total, 0);
      totalTTC = totalHT * (1 + (tvaRate || existing.tvaRate) / 100);
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
    if (!date || !type || !category || !label || amount === undefined) return res.status(400).json({ error: 'Champs requis : date, type, category, label, amount' });
    if (!['revenue', 'expense'].includes(type)) return res.status(400).json({ error: 'Type doit être "revenue" ou "expense"' });
    const rate = tvaRate !== undefined ? tvaRate : 20;
    const tvaAmount = amount * rate / 100;
    const entry = await prisma.financialEntry.create({
      data: { date, type, category, label, amount, tvaRate: rate, tvaAmount, paymentMode: paymentMode || null, reference: reference || null, restaurantId: req.restaurantId },
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
    const ingredient = await prisma.ingredient.findFirst({ where: { id: ingredientId } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    let costImpact = quantity * ingredient.pricePerUnit;
    if (unit !== ingredient.unit) {
      if (unit === 'g' && ingredient.unit === 'kg') costImpact = (quantity / 1000) * ingredient.pricePerUnit;
      else if (unit === 'kg' && ingredient.unit === 'g') costImpact = (quantity * 1000) * ingredient.pricePerUnit;
      else if (unit === 'mL' && ingredient.unit === 'L') costImpact = (quantity / 1000) * ingredient.pricePerUnit;
      else if (unit === 'L' && ingredient.unit === 'mL') costImpact = (quantity * 1000) * ingredient.pricePerUnit;
    }
    const wasteLog = await prisma.wasteLog.create({
      data: { ingredientId, quantity, unit, reason, costImpact: Math.round(costImpact * 100) / 100, date, notes: notes || null, restaurantId: req.restaurantId },
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
    if (!clientEmail) return res.status(400).json({ error: 'Email client requis' });
    if (!message) return res.status(400).json({ error: 'Message requis' });
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré' });

    const resend = new Resend(resendKey);
    const emailSubject = subject || `Message de RestauMargin`;
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
      return res.status(400).json({ error: 'Nom et email requis' });
    }

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
      data: { zone, temperature: parseFloat(temperature), status, recordedBy: recordedBy || null, notes: notes || null, date, time: time || null, restaurantId: req.restaurantId },
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
    if (!name || !role) return res.status(400).json({ error: 'Champs requis : name, role' });
    const validRoles = ['Chef', 'Commis', 'Serveur', 'Plongeur', 'Barman', 'Manager'];
    if (!validRoles.includes(role)) return res.status(400).json({ error: `Rôle invalide. Valeurs acceptées : ${validRoles.join(', ')}` });
    const employee = await prisma.employee.create({
      data: { name, role, email: email || null, phone: phone || null, hourlyRate: hourlyRate ?? 12, color: color || '#3b82f6', restaurantId: req.restaurantId },
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
    if (!title || !clientName || !eventType || !date) return res.status(400).json({ error: 'Titre, nom client, type et date requis' });
    const seminaire = await prisma.seminaire.create({
      data: {
        title, clientName, clientEmail: clientEmail || null, clientPhone: clientPhone || null, eventType, date,
        startTime: startTime || null, endTime: endTime || null, guestCount: guestCount || 20, status: 'demande',
        budget: budget || null, menuDetails: menuDetails || null, equipment: equipment || [], notes: notes || null, restaurantId: req.restaurantId,
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

// ============ MARKETPLACE ============
app.get('/api/marketplace/orders', authWithRestaurant, async (req: any, res) => {
  try {
    const orders = await prisma.marketplaceOrder.findMany({
      where: { restaurantId: req.restaurantId }, include: { items: true }, orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération commandes marketplace' }); }
});

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

app.post('/api/marketplace/orders', authWithRestaurant, async (req: any, res) => {
  try {
    const { supplierName, items, notes } = req.body;
    if (!supplierName || !items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Fournisseur et articles requis' });
    const orderItems = items.map((item: any) => ({
      productName: item.productName || '', quantity: item.quantity || 1, unit: item.unit || '', unitPrice: item.unitPrice || 0, total: (item.quantity || 1) * (item.unitPrice || 0),
    }));
    const totalHT = orderItems.reduce((sum: number, i: any) => sum + i.total, 0);
    const order = await prisma.marketplaceOrder.create({
      data: { supplierName, totalHT, notes: notes || null, restaurantId: req.restaurantId, items: { create: orderItems } },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création commande marketplace' }); }
});

app.put('/api/marketplace/orders/:id', authWithRestaurant, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;
    const existing = await prisma.marketplaceOrder.findFirst({ where: { id, restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });
    const order = await prisma.marketplaceOrder.update({
      where: { id }, data: { ...(status && { status }), ...(notes !== undefined && { notes }) }, include: { items: true },
    });
    res.json(order);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour commande marketplace' }); }
});

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
      prisma.ingredient.findMany({ where: { restaurantId: rid }, orderBy: { pricePerUnit: 'desc' }, take: 30 }),
      prisma.recipe.findMany({ where: { restaurantId: rid }, include: { ingredients: { include: { ingredient: true } } }, take: 20 }),
      prisma.priceHistory.findMany({ where: { restaurantId: rid }, orderBy: { date: 'desc' }, take: 50 }),
    ]);

    const ingList = ingredients.map((i: any) => `- ${i.name} (${i.category}): ${i.pricePerUnit}€/${i.unit}`).join('\n');
    const recList = recipes.map((r: any) => {
      const cost = r.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
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

// ============ MERCURIALE EDITORIALE ============

// GET /api/mercuriale/latest — Public (no auth needed) — latest publication + all data
app.get('/api/mercuriale/latest', async (_req, res) => {
  try {
    const publications: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_publications
      WHERE published = true
      ORDER BY week_date DESC
      LIMIT 1
    `;
    if (!publications.length) {
      return res.json({ publication: null, prices: [], alerts: [], alternatives: [] });
    }
    const pub = publications[0];
    const prices: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_prices
      WHERE publication_id = ${pub.id}
      ORDER BY category, ingredient_name
    `;
    const alerts: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_alerts
      WHERE publication_id = ${pub.id}
      ORDER BY type, ingredient_name
    `;
    const alternatives: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_alternatives
      WHERE publication_id = ${pub.id}
      ORDER BY product
    `;
    res.json({ publication: pub, prices, alerts, alternatives });
  } catch (e: any) {
    console.error('[MERCURIALE LATEST]', e);
    res.status(500).json({ error: 'Erreur chargement mercuriale' });
  }
});

// GET /api/mercuriale/publications — Admin: list all publications
app.get('/api/mercuriale/publications', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const pubs: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_publications ORDER BY week_date DESC
    `;
    res.json(pubs);
  } catch (e: any) {
    console.error('[MERCURIALE PUBS]', e);
    res.status(500).json({ error: 'Erreur liste publications' });
  }
});

// POST /api/mercuriale/publications — Admin: create publication
app.post('/api/mercuriale/publications', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const { title, week_date, sources, published } = req.body;
    if (!title || !week_date) return res.status(400).json({ error: 'title et week_date requis' });
    const result: any[] = await prisma.$queryRaw`
      INSERT INTO mercuriale_publications (title, week_date, sources, published)
      VALUES (${title}, ${new Date(week_date)}, ${sources || null}, ${published !== false})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (e: any) {
    console.error('[MERCURIALE CREATE PUB]', e);
    res.status(500).json({ error: 'Erreur création publication' });
  }
});

// POST /api/mercuriale/publications/:id/prices — Admin: add prices
app.post('/api/mercuriale/publications/:id/prices', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const publicationId = parseInt(req.params.id);
    const { prices } = req.body;
    if (!Array.isArray(prices) || !prices.length) return res.status(400).json({ error: 'prices array requis' });
    const inserted: any[] = [];
    for (const p of prices) {
      const result: any[] = await prisma.$queryRaw`
        INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail)
        VALUES (${publicationId}, ${p.category}, ${p.ingredient_name}, ${p.supplier || null}, ${p.price_min || null}, ${p.price_max || null}, ${p.unit || 'kg'}, ${p.trend || null}, ${p.trend_detail || null})
        RETURNING *
      `;
      inserted.push(result[0]);
    }
    res.json({ count: inserted.length, prices: inserted });
  } catch (e: any) {
    console.error('[MERCURIALE ADD PRICES]', e);
    res.status(500).json({ error: 'Erreur ajout prix' });
  }
});

// POST /api/mercuriale/publications/:id/alerts — Admin: add alerts
app.post('/api/mercuriale/publications/:id/alerts', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const publicationId = parseInt(req.params.id);
    const { alerts } = req.body;
    if (!Array.isArray(alerts) || !alerts.length) return res.status(400).json({ error: 'alerts array requis' });
    const inserted: any[] = [];
    for (const a of alerts) {
      const result: any[] = await prisma.$queryRaw`
        INSERT INTO mercuriale_alerts (publication_id, type, ingredient_name, variation, action_text, saving)
        VALUES (${publicationId}, ${a.type}, ${a.ingredient_name}, ${a.variation || null}, ${a.action_text || null}, ${a.saving || null})
        RETURNING *
      `;
      inserted.push(result[0]);
    }
    res.json({ count: inserted.length, alerts: inserted });
  } catch (e: any) {
    console.error('[MERCURIALE ADD ALERTS]', e);
    res.status(500).json({ error: 'Erreur ajout alertes' });
  }
});

// POST /api/mercuriale/publications/:id/alternatives — Admin: add alternatives
app.post('/api/mercuriale/publications/:id/alternatives', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const publicationId = parseInt(req.params.id);
    const { alternatives } = req.body;
    if (!Array.isArray(alternatives) || !alternatives.length) return res.status(400).json({ error: 'alternatives array requis' });
    const inserted: any[] = [];
    for (const alt of alternatives) {
      const result: any[] = await prisma.$queryRaw`
        INSERT INTO mercuriale_alternatives (publication_id, product, alternative, saving_per_kg)
        VALUES (${publicationId}, ${alt.product}, ${alt.alternative}, ${alt.saving_per_kg || null})
        RETURNING *
      `;
      inserted.push(result[0]);
    }
    res.json({ count: inserted.length, alternatives: inserted });
  } catch (e: any) {
    console.error('[MERCURIALE ADD ALTS]', e);
    res.status(500).json({ error: 'Erreur ajout alternatives' });
  }
});

// ── Mercuriale: Search ingredient prices ──
app.get('/api/mercuriale/search', authWithRestaurant, async (req: any, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json([]);
    }
    const searchTerm = `%${q}%`;
    const prices: any[] = await prisma.$queryRaw`
      SELECT ingredient_name, price_min, price_max, unit, supplier, trend, trend_detail, category
      FROM mercuriale_prices
      WHERE LOWER(ingredient_name) LIKE LOWER(${searchTerm})
      ORDER BY ingredient_name
      LIMIT 10
    `;
    res.json(prices.map((p: any) => ({
      name: p.ingredient_name,
      priceMin: p.price_min != null ? Number(p.price_min) : null,
      priceMax: p.price_max != null ? Number(p.price_max) : null,
      unit: p.unit,
      supplier: p.supplier,
      trend: p.trend,
      trendDetail: p.trend_detail,
      category: p.category,
    })));
  } catch (e: any) {
    console.error('[MERCURIALE SEARCH]', e.message);
    res.status(500).json({ error: 'Erreur recherche mercuriale' });
  }
});

// ── Mercuriale: AI suggest ingredients for a recipe ──
app.get('/api/mercuriale/suggest', authWithRestaurant, async (req: any, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Nom de recette requis (min 2 caractères)' });
    }

    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    // Step 1: Ask Claude for typical ingredients
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: `Tu es un chef cuisinier professionnel français. Pour une recette donnée, liste les ingrédients typiques avec les quantités pour 4 portions. Réponds UNIQUEMENT en JSON valide, sans texte avant ni après : [{"name": "nom ingrédient", "quantity": nombre, "unit": "kg|g|L|cl|pièce"}]`,
      messages: [{
        role: 'user',
        content: `Liste les ingrédients typiques pour la recette : "${q}"`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    let aiIngredients: { name: string; quantity: number; unit: string }[] = [];
    try {
      aiIngredients = JSON.parse(text);
      if (!Array.isArray(aiIngredients)) aiIngredients = [];
    } catch {
      return res.json({ ingredients: [], raw: text });
    }

    // Step 2: For each ingredient, search mercuriale_prices
    const enriched = await Promise.all(
      aiIngredients.map(async (ing) => {
        const searchTerm = `%${ing.name}%`;
        const prices: any[] = await prisma.$queryRaw`
          SELECT ingredient_name, price_min, price_max, unit, supplier, trend, trend_detail
          FROM mercuriale_prices
          WHERE LOWER(ingredient_name) LIKE LOWER(${searchTerm})
          ORDER BY ingredient_name
          LIMIT 1
        `;
        const match = prices[0] || null;
        return {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          marketPrice: match ? (Number(match.price_min) + Number(match.price_max)) / 2 : null,
          priceMin: match ? Number(match.price_min) : null,
          priceMax: match ? Number(match.price_max) : null,
          supplier: match?.supplier || null,
          trend: match?.trend || null,
          trendDetail: match?.trend_detail || null,
        };
      })
    );

    res.json({ ingredients: enriched });
  } catch (e: any) {
    console.error('[MERCURIALE SUGGEST]', e.message);
    res.status(500).json({ error: 'Erreur suggestion ingrédients' });
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
