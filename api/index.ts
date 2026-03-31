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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
  try { res.json(await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId }, orderBy: { name: 'asc' } })); } catch { res.status(500).json({ error: 'Erreur' }); }
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

// ============ RFQ (APPELS D'OFFRES) ============
const rfqInclude = {
  items: { include: { ingredient: true, quotes: { include: { supplier: true } } } },
  suppliers: { include: { supplier: true } },
} as const;

app.get('/api/rfqs', authWithRestaurant, async (req: any, res) => {
  try {
    const rfqs = await prisma.rFQ.findMany({ where: { restaurantId: req.restaurantId }, include: rfqInclude, orderBy: { createdAt: 'desc' } });
    res.json(rfqs);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération appels d\'offres' }); }
});

app.get('/api/rfqs/:id', authWithRestaurant, async (req, res) => {
  try {
    const rfq = await prisma.rFQ.findUnique({ where: { id: parseInt(req.params.id) }, include: rfqInclude });
    if (!rfq) return res.status(404).json({ error: 'Appel d\'offres non trouvé' });
    res.json(rfq);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération' }); }
});

app.post('/api/rfqs', authWithRestaurant, async (req, res) => {
  try {
    const { title, dueDate, notes, items, supplierIds } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Le titre est requis' });
    if (!items?.length) return res.status(400).json({ error: 'Au moins un produit requis' });
    if (!supplierIds?.length) return res.status(400).json({ error: 'Au moins un fournisseur requis' });

    const rfq = await prisma.rFQ.create({
      data: {
        title: title.trim(),
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        items: {
          create: items.map((item: { ingredientId: number; quantity: number }) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            quotes: {
              create: supplierIds.map((sid: number) => ({ supplierId: sid })),
            },
          })),
        },
        suppliers: {
          create: supplierIds.map((sid: number) => ({ supplierId: sid })),
        },
      },
      include: rfqInclude,
    });
    res.status(201).json(rfq);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création appel d\'offres' }); }
});

app.put('/api/rfqs/:id', authWithRestaurant, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, status, dueDate, notes } = req.body;
    const rfq = await prisma.rFQ.update({
      where: { id },
      data: {
        title: title?.trim(),
        status: status || undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        notes: notes !== undefined ? (notes || null) : undefined,
      },
      include: rfqInclude,
    });
    res.json(rfq);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour' }); }
});

app.delete('/api/rfqs/:id', authWithRestaurant, async (req: any, res) => {
  try {
    await prisma.rFQ.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (e: any) {
    console.error('RFQ delete error:', e.message);
    res.status(500).json({ error: 'Erreur suppression RFQ — le modèle n\'existe peut-être pas encore' });
  }
});

// Update a quote (enter supplier price)
app.put('/api/rfqs/:rfqId/quotes/:quoteId', authWithRestaurant, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.quoteId);
    const { unitPrice, notes } = req.body;
    const quote = await prisma.rFQQuote.update({
      where: { id: quoteId },
      data: {
        unitPrice: unitPrice !== undefined ? (unitPrice === '' || unitPrice === null ? null : parseFloat(unitPrice)) : undefined,
        notes: notes !== undefined ? (notes || null) : undefined,
      },
      include: { supplier: true },
    });
    res.json(quote);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour devis' }); }
});

// Select best quote and optionally apply price to ingredient
app.post('/api/rfqs/:rfqId/quotes/:quoteId/select', authWithRestaurant, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.quoteId);
    const { applyPrice } = req.body;

    const quote = await prisma.rFQQuote.findUnique({ where: { id: quoteId }, include: { rfqItem: true, supplier: true } });
    if (!quote) return res.status(404).json({ error: 'Devis non trouvé' });

    // Unselect all quotes for same item, then select this one
    await prisma.rFQQuote.updateMany({ where: { rfqItemId: quote.rfqItemId }, data: { selected: false } });
    const updated = await prisma.rFQQuote.update({
      where: { id: quoteId },
      data: { selected: true },
      include: { supplier: true },
    });

    if (applyPrice && quote.unitPrice !== null && quote.unitPrice !== undefined) {
      await prisma.ingredient.update({
        where: { id: quote.rfqItem.ingredientId },
        data: { pricePerUnit: quote.unitPrice, supplierId: quote.supplierId, supplier: quote.supplier.name },
      });
    }
    res.json(updated);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur sélection devis' }); }
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
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré' });
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

// ── Messages (in-memory — empty, no mock data) ──
const conversations: any[] = [];
const messagesStore: Record<string, any[]> = {};

app.get('/api/messages/conversations', authWithRestaurant, (_req, res) => { res.json(conversations); });
app.post('/api/messages/conversations', authWithRestaurant, (req: any, res) => {
  const { id, name, participants, isGroup, avatar } = req.body;
  const convId = id || `conv-${Date.now()}`;
  const existing = conversations.find(c => c.id === convId);
  if (existing) return res.json(existing);
  const conv = { id: convId, name, participants: participants || [], isGroup: isGroup || false, avatar: avatar || '', lastMessage: '', unreadCount: 0 };
  conversations.push(conv);
  messagesStore[convId] = [];
  res.status(201).json(conv);
});
app.get('/api/messages/conversations/:id', authWithRestaurant, (req, res) => {
  const conv = conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation non trouvée' });
  res.json({ ...conv, messages: messagesStore[conv.id] || [] });
});
app.post('/api/messages/conversations/:id/messages', authWithRestaurant, (req: any, res) => {
  const { content } = req.body;
  const msg = { id: `m-${Date.now()}`, senderId: 'user', senderName: req.user?.email || 'Moi', content, timestamp: new Date().toISOString(), read: true };
  if (!messagesStore[req.params.id]) messagesStore[req.params.id] = [];
  messagesStore[req.params.id].push(msg);
  res.status(201).json(msg);
});
app.put('/api/messages/conversations/:id/read', authWithRestaurant, (req, res) => {
  const conv = conversations.find(c => c.id === req.params.id);
  if (conv) conv.unreadCount = 0;
  res.json({ success: true });
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
app.get('/api/public/menu', async (_req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { ingredients: { include: { ingredient: true } } },
    });
    res.json(recipes.map(r => ({
      id: r.id, name: r.name, category: r.category,
      sellingPrice: r.sellingPrice, description: r.description,
      allergens: [...new Set(r.ingredients.flatMap(ri => ri.ingredient.allergens || []))],
    })));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

// ── AI Chat ──
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
const aiRateLimit = new Map<number, { count: number; resetAt: number }>();

app.post('/api/ai/chat', authWithRestaurant, async (req: any, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis' });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré' });

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

    // Build context from restaurant data
    const [recipes, ingredients, inventory] = await Promise.all([
      prisma.recipe.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredients: { include: { ingredient: true } } }, take: 50 }),
      prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId }, orderBy: { pricePerUnit: 'desc' }, take: 30 }),
      prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true } }),
    ]);

    const recipesSummary = recipes.map(r => {
      const cost = r.ingredients.reduce((s, ri) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
      const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
      return `- ${r.name} (${r.category}): vente ${r.sellingPrice}€, coût ${cost.toFixed(2)}€, marge ${margin.toFixed(1)}%`;
    }).join('\n');

    const lowStock = inventory.filter(i => i.currentStock < i.minStock);
    const stockAlerts = lowStock.length > 0
      ? lowStock.map(i => `- ${i.ingredient.name}: ${i.currentStock}/${i.minStock} ${i.ingredient.unit}`).join('\n')
      : 'Aucune alerte';

    const context = `${recipes.length} recettes:\n${recipesSummary || 'Aucune'}\n\nAlertes stock:\n${stockAlerts}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `Tu es l'assistant IA RestauMargin, expert en gestion restaurant. Réponds en français, sois concis et actionnable (max 300 mots). Base tes conseils sur les données réelles:\n\n${context}`,
      messages: [{ role: 'user', content: message.trim() }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    res.json({ response: text, usage: response.usage });
  } catch (e: any) {
    console.error('AI error:', e.message);
    if (e?.status === 400 && e?.message?.includes('credit balance')) {
      return res.status(503).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
    }
    res.status(500).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
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

    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: supplierEmail,
      replyTo: 'contact@restaumargin.fr',
      subject: `Commande — RestauMargin pour ${supplierName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1e40af;color:white;padding:16px 24px;border-radius:12px 12px 0 0;">
            <h2 style="margin:0;">Bon de commande</h2>
            <p style="margin:4px 0 0;opacity:0.8;">RestauMargin — ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <div style="padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <p>Bonjour <strong>${supplierName}</strong>,</p>
            <p>Veuillez trouver ci-dessous notre commande :</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <thead><tr style="background:#f8fafc;"><th style="padding:8px;text-align:left;">Article</th><th style="padding:8px;text-align:left;">Quantité</th><th style="padding:8px;text-align:right;">Total</th></tr></thead>
              <tbody>${linesHtml}</tbody>
              <tfoot><tr><td colspan="2" style="padding:12px 8px;font-weight:bold;">Total HT</td><td style="padding:12px 8px;text-align:right;font-weight:bold;font-size:18px;">${(totalHT || 0).toFixed(2)} €</td></tr></tfoot>
            </table>
            ${notes ? `<p style="color:#64748b;"><em>Notes : ${notes}</em></p>` : ''}
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
            <p style="color:#94a3b8;font-size:12px;">Envoyé depuis RestauMargin — www.restaumargin.fr</p>
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

    res.json({ success: true, sentTo: supplierEmail });
  } catch (e: any) {
    console.error('[ORDER EMAIL ERROR]', e.message);
    res.status(500).json({ error: 'Erreur envoi email commande' });
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
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré' });

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
