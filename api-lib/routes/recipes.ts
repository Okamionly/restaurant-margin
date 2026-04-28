/**
 * @file api-lib/routes/recipes.ts
 * Recipes domain — extracted from api/index.ts (round 2 of monolith split).
 *
 * Mounted at /api/recipes in api/index.ts:
 *   app.use('/api/recipes', authWithRestaurant, recipesRoutes);
 *
 * Routes:
 *   GET    /                — list recipes (paginated or full)
 *   GET    /:id             — recipe detail
 *   POST   /                — create recipe
 *   PUT    /:id             — update recipe (full replace of ingredients)
 *   POST   /:id/clone       — duplicate recipe
 *   DELETE /:id             — soft delete
 *   PUT    /:id/restore     — restore soft-deleted recipe
 *   POST   /:id/photo       — add photo (max 5)
 *   DELETE /:id/photo/:idx  — remove photo by index
 *   GET    /:id/share       — generate/return share token + public URL
 *
 * Note : the public read-only endpoint GET /api/public/recipe/:token stays
 * in api/index.ts because it does NOT use authWithRestaurant middleware.
 */

import { Router } from 'express';
import { prisma } from '../prisma';
import { sanitizeInput, validatePrice, logAudit, validatePositiveNumber } from '../middleware';
import { calculateRecipeMargin } from '../utils/marginCalculator';

const router = Router();

// Local helpers (mirror api/index.ts) — kept private to this module.
function formatRecipe(recipe: any) {
  const allergenSet = new Set<string>();
  for (const ri of recipe.ingredients) {
    for (const a of ri.ingredient.allergens) allergenSet.add(a);
  }
  return { ...recipe, margin: calculateRecipeMargin(recipe), allergens: Array.from(allergenSet).sort() };
}

const recipeInclude = { ingredients: { include: { ingredient: true } } } as const;

// ============ GET /api/recipes ============
router.get('/', async (req: any, res) => {
  try {
    const { limit, offset, search } = req.query;
    if (!search) res.set('Cache-Control', 'private, max-age=300');
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

// ============ GET /api/recipes/:id ============
router.get('/:id', async (req: any, res) => {
  try {
    const recipe = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null }, include: recipeInclude });
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });
    res.json(formatRecipe(recipe));
  } catch { res.status(500).json({ error: 'Erreur récupération recette' }); }
});

// ============ POST /api/recipes ============
router.post('/', async (req: any, res) => {
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

// ============ PUT /api/recipes/:id ============
router.put('/:id', async (req: any, res) => {
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
    const recipeChanges: any = {};
    if (existing.name !== safeName) recipeChanges.name = { old: existing.name, new: safeName };
    if (existing.sellingPrice !== parseFloat(sellingPrice)) recipeChanges.sellingPrice = { old: existing.sellingPrice, new: parseFloat(sellingPrice) };
    if (existing.category !== safeCategory) recipeChanges.category = { old: existing.category, new: safeCategory };
    logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'recipe', recipeId, Object.keys(recipeChanges).length > 0 ? recipeChanges : undefined);
    res.json(formatRecipe(updated));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour recette' }); }
});

// ============ POST /api/recipes/:id/clone ============
router.post('/:id/clone', async (req: any, res) => {
  try {
    const source = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null }, include: recipeInclude });
    if (!source) return res.status(404).json({ error: 'Recette non trouvée' });
    const cloned = await prisma.recipe.create({
      data: {
        name: `${source.name} (copie)`, category: source.category, sellingPrice: source.sellingPrice, nbPortions: source.nbPortions,
        description: source.description, prepTimeMinutes: source.prepTimeMinutes, cookTimeMinutes: source.cookTimeMinutes, laborCostPerHour: source.laborCostPerHour,
        restaurantId: req.restaurantId,
        ingredients: { create: source.ingredients.map((ri: any) => ({ ingredientId: ri.ingredientId, quantity: ri.quantity, wastePercent: ri.wastePercent })) },
      }, include: recipeInclude,
    });
    res.status(201).json(formatRecipe(cloned));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur clonage recette' }); }
});

// ============ DELETE /api/recipes/:id ============
router.delete('/:id', async (req: any, res) => {
  try {
    const existing = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: null } });
    if (!existing) return res.status(404).json({ error: 'Recette non trouvée' });
    await prisma.recipe.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: new Date() } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'recipe', parseInt(req.params.id));
    res.status(204).send();
  } catch { res.status(500).json({ error: 'Erreur suppression recette' }); }
});

// ============ PUT /api/recipes/:id/restore ============
router.put('/:id/restore', async (req: any, res) => {
  try {
    const existing = await prisma.recipe.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId, deletedAt: { not: null } } });
    if (!existing) return res.status(404).json({ error: 'Recette non trouvée ou non supprimée' });
    const restored = await prisma.recipe.update({ where: { id: parseInt(req.params.id) }, data: { deletedAt: null }, include: recipeInclude });
    logAudit(req.user.userId, req.restaurantId, 'RESTORE', 'recipe', restored.id);
    res.json(formatRecipe(restored));
  } catch { res.status(500).json({ error: 'Erreur restauration recette' }); }
});

// ============ POST /api/recipes/:id/photo ============
// Add a photo (base64 data URI) to recipe. Max 5 photos per recipe.
router.post('/:id/photo', async (req: any, res) => {
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

// ============ DELETE /api/recipes/:id/photo/:index ============
router.delete('/:id/photo/:index', async (req: any, res) => {
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

// ============ GET /api/recipes/:id/share ============
// Generate (or return existing) share token, return public URL.
router.get('/:id/share', async (req: any, res) => {
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

export default router;
