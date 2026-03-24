import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'restau-margin-secret-key';
const INVITATION_CODE = process.env.INVITATION_CODE || 'RESTAUMARGIN2024';
const TOKEN_EXPIRY = '7d';

app.use(cors());
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

app.post('/api/auth/register', async (req: any, res) => {
  try {
    const { email, password, name, invitationCode, role: requestedRole } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
    if (password.length < 6) return res.status(400).json({ error: 'Min. 6 caractères' });
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      const authHeader = req.headers.authorization;
      const hasAdminToken = authHeader && authHeader.startsWith('Bearer ');
      if (hasAdminToken) {
        try { const d = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload; if (d.role !== 'admin') return res.status(403).json({ error: 'Admin requis' }); } catch { return res.status(403).json({ error: 'Token invalide' }); }
      } else {
        if (!invitationCode) return res.status(400).json({ error: "Le code d'invitation est requis" });
        if (invitationCode !== INVITATION_CODE) return res.status(403).json({ error: "Code d'invitation invalide" });
      }
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });
    const passwordHash = await bcrypt.hash(password, 12);
    const role = userCount === 0 ? 'admin' : (requestedRole === 'admin' || requestedRole === 'chef' ? requestedRole : 'chef');
    const user = await prisma.user.create({ data: { email, passwordHash, name, role } });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur inscription" }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
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

// ============ INGREDIENTS ============
app.get('/api/ingredients', authMiddleware, async (_req, res) => {
  try { res.json(await prisma.ingredient.findMany({ orderBy: { name: 'asc' } })); } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.get('/api/ingredients/usage', authMiddleware, async (_req, res) => {
  try {
    const ings = await prisma.ingredient.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { recipes: true } } } });
    res.json(ings.map(i => ({ id: i.id, name: i.name, category: i.category, usageCount: i._count.recipes })));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.post('/api/ingredients', authMiddleware, async (req, res) => {
  try {
    const { name, unit, pricePerUnit, supplier, category, allergens } = req.body;
    if (!name?.trim() || !unit?.trim() || !category?.trim()) return res.status(400).json({ error: 'Champs requis' });
    const p = parseFloat(pricePerUnit); if (isNaN(p) || p <= 0) return res.status(400).json({ error: 'Prix invalide' });
    const ing = await prisma.ingredient.create({ data: { name: name.trim(), unit: unit.trim(), pricePerUnit: p, supplier: supplier || null, category: category.trim(), allergens: Array.isArray(allergens) ? allergens : [] } });
    res.status(201).json(ing);
  } catch { res.status(500).json({ error: 'Erreur création' }); }
});

app.put('/api/ingredients/:id', authMiddleware, async (req, res) => {
  try {
    const { name, unit, pricePerUnit, supplier, category, allergens } = req.body;
    if (!name?.trim() || !unit?.trim() || !category?.trim()) return res.status(400).json({ error: 'Champs requis' });
    const p = parseFloat(pricePerUnit); if (isNaN(p) || p <= 0) return res.status(400).json({ error: 'Prix invalide' });
    const ing = await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { name: name.trim(), unit: unit.trim(), pricePerUnit: p, supplier: supplier || null, category: category.trim(), allergens: Array.isArray(allergens) ? allergens : [] } });
    res.json(ing);
  } catch { res.status(500).json({ error: 'Erreur mise à jour' }); }
});

app.delete('/api/ingredients/:id', authMiddleware, async (req, res) => {
  try { await prisma.ingredient.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch { res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ RECIPES ============
app.get('/api/recipes', authMiddleware, async (_req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({ include: recipeInclude, orderBy: { name: 'asc' } });
    res.json(recipes.map(r => formatRecipe(r)));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.get('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({ where: { id: parseInt(req.params.id) }, include: recipeInclude });
    if (!recipe) return res.status(404).json({ error: 'Non trouvée' });
    res.json(formatRecipe(recipe));
  } catch { res.status(500).json({ error: 'Erreur' }); }
});

app.post('/api/recipes', authMiddleware, async (req, res) => {
  try {
    const { name, category, sellingPrice, nbPortions, description, prepTimeMinutes, cookTimeMinutes, laborCostPerHour, ingredients } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Nom requis' });
    const recipe = await prisma.recipe.create({
      data: {
        name: name.trim(), category: category || '', sellingPrice: parseFloat(sellingPrice), nbPortions: parseInt(nbPortions) || 1,
        description: description || null, prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
        cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null, laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
        ingredients: { create: ingredients?.map((i: any) => ({ ingredientId: i.ingredientId, quantity: i.quantity, wastePercent: i.wastePercent ?? 0 })) || [] },
      }, include: recipeInclude,
    });
    res.status(201).json(formatRecipe(recipe));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création' }); }
});

app.put('/api/recipes/:id', authMiddleware, async (req, res) => {
  try {
    const { name, category, sellingPrice, nbPortions, description, prepTimeMinutes, cookTimeMinutes, laborCostPerHour, ingredients } = req.body;
    const recipeId = parseInt(req.params.id);
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

app.post('/api/recipes/:id/clone', authMiddleware, async (req, res) => {
  try {
    const source = await prisma.recipe.findUnique({ where: { id: parseInt(req.params.id) }, include: recipeInclude });
    if (!source) return res.status(404).json({ error: 'Non trouvée' });
    const cloned = await prisma.recipe.create({
      data: {
        name: `${source.name} (copie)`, category: source.category, sellingPrice: source.sellingPrice, nbPortions: source.nbPortions,
        description: source.description, prepTimeMinutes: source.prepTimeMinutes, cookTimeMinutes: source.cookTimeMinutes, laborCostPerHour: source.laborCostPerHour,
        ingredients: { create: source.ingredients.map(ri => ({ ingredientId: ri.ingredientId, quantity: ri.quantity, wastePercent: ri.wastePercent })) },
      }, include: recipeInclude,
    });
    res.status(201).json(formatRecipe(cloned));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur clonage' }); }
});

app.delete('/api/recipes/:id', authMiddleware, async (req, res) => {
  try { await prisma.recipe.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch { res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ SUPPLIERS ============
app.get('/api/suppliers', authMiddleware, async (_req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { ingredients: true } } },
    });
    res.json(suppliers);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération fournisseurs' }); }
});

app.get('/api/suppliers/:id', authMiddleware, async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(req.params.id) },
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

app.post('/api/suppliers', authMiddleware, async (req, res) => {
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
      },
    });
    res.status(201).json(supplier);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création fournisseur' }); }
});

app.put('/api/suppliers/:id', authMiddleware, async (req, res) => {
  try {
    const { name, phone, email, address, city, postalCode, region, country, siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Le nom est requis' });
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(req.params.id) },
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

app.delete('/api/suppliers/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const count = await prisma.ingredient.count({ where: { supplierId: id } });
    if (count > 0) return res.status(400).json({ error: `Impossible de supprimer : ${count} ingrédient(s) lié(s)` });
    await prisma.supplier.delete({ where: { id } });
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression fournisseur' }); }
});

app.post('/api/suppliers/:id/link-ingredients', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) return res.status(404).json({ error: 'Fournisseur non trouvé' });
    const result = await prisma.ingredient.updateMany({
      where: { supplier: { equals: supplier.name, mode: 'insensitive' }, supplierId: null },
      data: { supplierId: id },
    });
    res.json({ linked: result.count, supplierName: supplier.name });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur lien ingrédients' }); }
});

export default app;
