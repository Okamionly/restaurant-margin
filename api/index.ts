import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const app = express();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI';
const INVITATION_CODE = process.env.INVITATION_CODE || 'RESTAUMARGIN2024';
const TOKEN_EXPIRY = '7d';

app.use(cors({
  origin: ['http://localhost:5173', 'https://restaumargin.vercel.app'],
  credentials: true,
}));
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
    const role = userCount === 0 ? 'admin' : 'chef';
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

// ============ INVENTORY ============
app.get('/api/inventory', authMiddleware, async (_req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    res.json(items);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération inventaire' }); }
});

app.get('/api/inventory/alerts', authMiddleware, async (_req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    const alerts = items.filter((item: any) => item.currentStock < item.minStock);
    res.json(alerts);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur alertes' }); }
});

app.get('/api/inventory/value', authMiddleware, async (_req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({ include: { ingredient: true } });
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

app.post('/api/inventory/suggest', authMiddleware, async (_req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { inventoryItem: null },
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suggestions' }); }
});

app.post('/api/inventory', authMiddleware, async (req, res) => {
  try {
    const { ingredientId, currentStock, unit, minStock, maxStock, notes } = req.body;
    if (!ingredientId) return res.status(400).json({ error: 'ingredientId requis' });
    const ingredient = await prisma.ingredient.findUnique({ where: { id: ingredientId } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const item = await prisma.inventoryItem.create({
      data: { ingredientId, currentStock: currentStock || 0, unit: unit || ingredient.unit, minStock: minStock || 0, maxStock: maxStock || null, notes: notes || null },
      include: { ingredient: true },
    });
    res.status(201).json(item);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Déjà dans l\'inventaire' });
    console.error(e); res.status(500).json({ error: 'Erreur ajout inventaire' });
  }
});

app.put('/api/inventory/:id', authMiddleware, async (req, res) => {
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

app.post('/api/inventory/:id/restock', authMiddleware, async (req, res) => {
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

app.delete('/api/inventory/:id', authMiddleware, async (req, res) => {
  try { await prisma.inventoryItem.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ RFQ (APPELS D'OFFRES) ============
const rfqInclude = {
  items: { include: { ingredient: true, quotes: { include: { supplier: true } } } },
  suppliers: { include: { supplier: true } },
} as const;

app.get('/api/rfqs', authMiddleware, async (_req, res) => {
  try {
    const rfqs = await prisma.rFQ.findMany({ include: rfqInclude, orderBy: { createdAt: 'desc' } });
    res.json(rfqs);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération appels d\'offres' }); }
});

app.get('/api/rfqs/:id', authMiddleware, async (req, res) => {
  try {
    const rfq = await prisma.rFQ.findUnique({ where: { id: parseInt(req.params.id) }, include: rfqInclude });
    if (!rfq) return res.status(404).json({ error: 'Appel d\'offres non trouvé' });
    res.json(rfq);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération' }); }
});

app.post('/api/rfqs', authMiddleware, async (req, res) => {
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

app.put('/api/rfqs/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/rfqs/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.rFQ.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression' }); }
});

// Update a quote (enter supplier price)
app.put('/api/rfqs/:rfqId/quotes/:quoteId', authMiddleware, async (req, res) => {
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
app.post('/api/rfqs/:rfqId/quotes/:quoteId/select', authMiddleware, async (req, res) => {
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
app.get('/api/price-history', authMiddleware, async (req: any, res) => {
  try {
    const { ingredientId, days } = req.query;
    const where: any = {};
    if (ingredientId) where.ingredientId = parseInt(ingredientId);
    if (days) where.createdAt = { gte: new Date(Date.now() - parseInt(days) * 86400000) };
    const history = await prisma.priceHistory.findMany({
      where,
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    res.json(history);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur historique prix' }); }
});

app.get('/api/price-history/alerts', authMiddleware, async (_req, res) => {
  try {
    // Find ingredients with significant price changes (>10%) in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const history = await prisma.priceHistory.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
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
app.get('/api/invoices', authMiddleware, async (_req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur factures' }); }
});

app.post('/api/invoices', authMiddleware, async (req, res) => {
  try {
    const { supplierName, invoiceNumber, invoiceDate, totalHT, totalTTC, items, rawText } = req.body;
    const invoice = await prisma.invoice.create({
      data: {
        supplierName: supplierName || 'Inconnu',
        invoiceNumber: invoiceNumber || null,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
        totalHT: totalHT || null,
        totalTTC: totalTTC || null,
        rawText: rawText || null,
        items: {
          create: (items || []).map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity || null,
            unit: item.unit || null,
            unitPrice: item.unitPrice || null,
            totalPrice: item.totalPrice || null,
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(invoice);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création facture' }); }
});

app.post('/api/invoices/:id/apply', authMiddleware, async (req, res) => {
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
        data: { ingredientId: match.ingredientId, price: item.unitPrice, source: 'invoice', invoiceRef: String(invoiceId) },
      });
      // Mark item as matched
      await prisma.invoiceItem.update({
        where: { id: match.itemId },
        data: { matched: true, ingredientId: match.ingredientId },
      });
      applied++;
    }
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: 'processed' } });
    res.json({ applied });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur application facture' }); }
});

app.delete('/api/invoices/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.invoice.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression' }); }
});

// ============ MENU SALES (MENU ENGINEERING) ============
app.get('/api/menu-sales', authMiddleware, async (req: any, res) => {
  try {
    const { days } = req.query;
    const where: any = {};
    if (days) where.date = { gte: new Date(Date.now() - parseInt(days) * 86400000) };
    const sales = await prisma.menuSales.findMany({ where, orderBy: { date: 'desc' }, take: 1000 });
    res.json(sales);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ventes' }); }
});

app.post('/api/menu-sales', authMiddleware, async (req, res) => {
  try {
    const { recipeId, quantity, revenue, date } = req.body;
    const sale = await prisma.menuSales.create({
      data: { recipeId, quantity: quantity || 1, revenue: revenue || null, date: date ? new Date(date) : new Date() },
    });
    res.status(201).json(sale);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur ajout vente' }); }
});

app.post('/api/menu-sales/bulk', authMiddleware, async (req, res) => {
  try {
    const { sales } = req.body; // [{ recipeId, quantity, revenue, date }]
    const result = await prisma.menuSales.createMany({
      data: (sales || []).map((s: any) => ({
        recipeId: s.recipeId, quantity: s.quantity || 1, revenue: s.revenue || null, date: s.date ? new Date(s.date) : new Date(),
      })),
    });
    res.status(201).json({ created: result.count });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur import ventes' }); }
});

app.get('/api/menu-engineering', authMiddleware, async (req: any, res) => {
  try {
    const days = parseInt(req.query.days || '30');
    const since = new Date(Date.now() - days * 86400000);

    // Get all recipes with margins
    const recipes = await prisma.recipe.findMany({ include: { ingredients: { include: { ingredient: true } } } });

    // Get sales data
    const sales = await prisma.menuSales.findMany({ where: { date: { gte: since } } });
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

// ── Messages (in-memory) ──
const conversations: any[] = [
  { id: 'conv-1', name: 'Transgourmet - Commercial', participants: ['user', 'transgourmet'], lastMessage: 'Votre commande a été expédiée', unreadCount: 2, isGroup: false },
  { id: 'conv-2', name: 'Metro - Service client', participants: ['user', 'metro'], lastMessage: 'Nouvelle promotion disponible', unreadCount: 1, isGroup: false },
  { id: 'conv-3', name: 'Équipe Cuisine', participants: ['user', 'chef', 'commis'], lastMessage: 'Le poisson est arrivé', unreadCount: 0, isGroup: true },
];
const messagesStore: Record<string, any[]> = {
  'conv-1': [{ id: 'm1', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Votre commande #1247 a été expédiée', timestamp: new Date().toISOString(), read: false }],
  'conv-2': [{ id: 'm2', senderId: 'metro', senderName: 'Metro', content: 'Nouvelle promotion disponible sur les produits frais', timestamp: new Date().toISOString(), read: false }],
  'conv-3': [{ id: 'm3', senderId: 'chef', senderName: 'Chef', content: 'Le poisson est arrivé', timestamp: new Date().toISOString(), read: true }],
};

app.get('/api/messages/conversations', authMiddleware, (_req, res) => { res.json(conversations); });
app.get('/api/messages/conversations/:id', authMiddleware, (req, res) => {
  const conv = conversations.find(c => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation non trouvée' });
  res.json({ ...conv, messages: messagesStore[conv.id] || [] });
});
app.post('/api/messages/conversations/:id/messages', authMiddleware, (req: any, res) => {
  const { content } = req.body;
  const msg = { id: `m-${Date.now()}`, senderId: 'user', senderName: req.user?.email || 'Moi', content, timestamp: new Date().toISOString(), read: true };
  if (!messagesStore[req.params.id]) messagesStore[req.params.id] = [];
  messagesStore[req.params.id].push(msg);
  res.status(201).json(msg);
});
app.put('/api/messages/conversations/:id/read', authMiddleware, (req, res) => {
  const conv = conversations.find(c => c.id === req.params.id);
  if (conv) conv.unreadCount = 0;
  res.json({ success: true });
});

// ── Email (nodemailer) ──
const sentEmails: any[] = [];

app.post('/api/email/send', authMiddleware, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) return res.status(400).json({ error: 'to, subject, body requis' });
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'RestauMargin <onboarding@resend.dev>',
      to: to.trim(), subject: subject.trim(),
      html: body.trim().replace(/\n/g, '<br>'),
    });
    if (error) return res.status(500).json({ error: error.message });
    const email = { id: `e-${Date.now()}`, to, subject, body, from: 'onboarding@resend.dev', messageId: data?.id, sentAt: new Date().toISOString() };
    sentEmails.push(email);
    res.json({ success: true, messageId: data?.id });
  } catch (e: any) { res.status(500).json({ error: e.message || 'Erreur envoi email' }); }
});

app.get('/api/email/sent', authMiddleware, (_req, res) => { res.json(sentEmails); });

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
