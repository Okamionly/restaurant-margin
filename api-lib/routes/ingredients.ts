/**
 * @file api-lib/routes/ingredients.ts
 * Ingredients domain — extracted from api/index.ts (round 1 of monolith split).
 *
 * Mounted at /api/ingredients in api/index.ts:
 *   app.use('/api/ingredients', authWithRestaurant, ingredientsRoutes);
 *
 * Routes:
 *   GET    /                — list ingredients (paginated or full)
 *   GET    /usage           — list ingredients with recipe-usage count
 *   POST   /                — create ingredient
 *   PUT    /:id             — update ingredient (auto-recalcs affected recipe margins)
 *   DELETE /:id             — soft delete
 *   PUT    /:id/restore     — restore soft-deleted ingredient
 */

import { Router } from 'express';
import { prisma } from '../prisma';
import {
  sanitizeInput,
  validatePrice,
  logAudit,
} from '../middleware';
import { calculateRecipeMargin } from '../utils/marginCalculator';

const router = Router();

// Prisma include shape for recipes — mirrors api/index.ts recipeInclude
const recipeInclude = { ingredients: { include: { ingredient: true } } } as const;

// ============ GET /api/ingredients ============
router.get('/', async (req: any, res) => {
  try {
    const { limit, offset, search } = req.query;
    // Hint browsers/CDN to cache for 5 min on idempotent list reads.
    // Skipped when ?search is present (per-user, per-query — too granular).
    if (!search) res.set('Cache-Control', 'private, max-age=300');
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [data, total] = await Promise.all([
        prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, orderBy: { name: 'asc' }, include: { supplierRef: { select: { id: true, name: true } } }, take, skip }),
        prisma.ingredient.count({ where: { restaurantId: req.restaurantId, deletedAt: null } }),
      ]);
      return res.json({ data, total, limit: take, offset: skip });
    }
    // Back-compat default: no implicit cap. Clients should opt-in to
    // pagination via ?limit/?offset for large datasets.
    res.json(await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, orderBy: { name: 'asc' }, include: { supplierRef: { select: { id: true, name: true } } } }));
  } catch { res.status(500).json({ error: 'Erreur récupération ingrédients' }); }
});

// ============ GET /api/ingredients/usage ============
router.get('/usage', async (req: any, res) => {
  try {
    const ings = await prisma.ingredient.findMany({ where: { restaurantId: req.restaurantId, deletedAt: null }, orderBy: { name: 'asc' }, include: { _count: { select: { recipes: true } } } });
    res.json(ings.map((i: any) => ({ id: i.id, name: i.name, category: i.category, usageCount: i._count.recipes })));
  } catch { res.status(500).json({ error: 'Erreur récupération utilisation ingrédients' }); }
});

// ============ GET /api/ingredients/price-alerts ============
// Alertes inflation derivees de l'historique de prix (aucune migration).
// Compare les 2 dernieres entrees PriceHistory par ingredient et remonte
// les hausses > seuil (%), triees de la plus forte a la plus faible.
router.get('/price-alerts', async (req: any, res) => {
  try {
    const threshold = Math.max(0, parseFloat(req.query.threshold) || 10);
    const history = await prisma.priceHistory.findMany({
      where: { restaurantId: req.restaurantId },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
    const byIng: Record<number, typeof history> = {};
    for (const h of history) { (byIng[h.ingredientId] ||= []).push(h); }
    const ids = Object.keys(byIng).map(Number);
    const ings = ids.length
      ? await prisma.ingredient.findMany({ where: { id: { in: ids }, restaurantId: req.restaurantId, deletedAt: null }, select: { id: true, name: true, unit: true, category: true } })
      : [];
    const byId: Record<number, any> = {};
    ings.forEach((i: any) => { byId[i.id] = i; });
    const alerts: any[] = [];
    for (const id of ids) {
      const h = byIng[id];
      if (h.length < 2 || !byId[id]) continue;
      const cur = h[0].price, prev = h[1].price;
      if (prev <= 0) continue;
      const pct = ((cur - prev) / prev) * 100;
      if (pct > threshold) {
        alerts.push({ ingredientId: id, name: byId[id].name, unit: byId[id].unit, category: byId[id].category, oldPrice: prev, newPrice: cur, pct: Math.round(pct * 10) / 10, date: h[0].date });
      }
    }
    alerts.sort((a, b) => b.pct - a.pct);
    res.json(alerts);
  } catch (e) { console.error('price-alerts error:', e); res.status(500).json({ error: 'Erreur alertes prix' }); }
});

// ============ GET /api/ingredients/:id/price-history ============
router.get('/:id/price-history', async (req: any, res) => {
  try {
    const ingredientId = parseInt(req.params.id);
    if (isNaN(ingredientId)) return res.status(400).json({ error: 'ID invalide' });
    const owns = await prisma.ingredient.findFirst({ where: { id: ingredientId, restaurantId: req.restaurantId, deletedAt: null }, select: { id: true } });
    if (!owns) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const history = await prisma.priceHistory.findMany({
      where: { ingredientId, restaurantId: req.restaurantId },
      orderBy: { createdAt: 'asc' },
      take: 60,
      select: { price: true, date: true, source: true, createdAt: true },
    });
    res.json(history);
  } catch (e) { console.error('price-history error:', e); res.status(500).json({ error: 'Erreur historique prix' }); }
});

// ============ POST /api/ingredients ============
router.post('/', async (req: any, res) => {
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

// ============ PUT /api/ingredients/:id ============
router.put('/:id', async (req: any, res) => {
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
    // Record price history when the unit price changes (powers evolution charts,
    // inflation trends and the hausse/baisse indicators). Source defaults to
    // 'manual'; callers (e.g. invoice import) may pass priceSource to tag origin.
    if (existing.pricePerUnit !== p) {
      try {
        await prisma.priceHistory.create({
          data: {
            ingredientId: ing.id,
            price: p,
            date: new Date().toISOString().slice(0, 10),
            source: typeof req.body.priceSource === 'string' ? req.body.priceSource : 'manual',
            restaurantId: req.restaurantId,
          },
        });
      } catch (e) { console.error('PriceHistory create error:', e); }
    }
    // FIX 2: Auto-recalculate food cost for affected recipes when price changes
    if (existing.pricePerUnit !== p) {
      try {
        const affectedRecipes = await prisma.recipeIngredient.findMany({ where: { ingredientId: ing.id }, select: { recipeId: true } });
        const recipeIds = [...new Set(affectedRecipes.map(ar => ar.recipeId))];
        for (const recipeId of recipeIds) {
          const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }, include: recipeInclude });
          if (recipe && !recipe.deletedAt) {
            calculateRecipeMargin(recipe);
            // Touch updatedAt so frontend knows margins changed
            await prisma.recipe.update({ where: { id: recipeId }, data: { updatedAt: new Date() } });
          }
        }
      } catch (e) { console.error('Auto-recalc error:', e); }
    }
    res.json(ing);
  } catch { res.status(500).json({ error: 'Erreur mise à jour ingrédient' }); }
});

// ============ DELETE /api/ingredients/:id ============
router.delete('/:id', async (req: any, res) => {
  try {
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: new Date() } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'ingredient', parseInt(req.params.id));
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression ingrédient' }); }
});

// ============ PUT /api/ingredients/:id/restore ============
router.put('/:id/restore', async (req: any, res) => {
  try {
    const existing = await prisma.ingredient.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: { not: null } } });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé ou non supprimé' });
    const restored = await prisma.ingredient.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: null } });
    logAudit(req.user.userId, req.restaurantId, 'RESTORE', 'ingredient', restored.id);
    res.json(restored);
  } catch { res.status(500).json({ error: 'Erreur restauration ingrédient' }); }
});

export default router;
