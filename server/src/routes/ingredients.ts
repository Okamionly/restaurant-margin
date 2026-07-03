import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';
import { validate, createIngredientSchema } from '../utils/validation';

const prisma = new PrismaClient();
export const ingredientsRouter = Router();

// GET all ingredients
ingredientsRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { name: 'asc' },
      include: { supplierRef: { select: { id: true, name: true } } },
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des ingrédients' });
  }
});

// GET ingredient usage count (how many recipes use each ingredient)
ingredientsRouter.get('/usage', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { recipes: true },
        },
      },
    });

    const result = ingredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      category: ing.category,
      usageCount: ing._count.recipes,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des usages' });
  }
});

// GET /api/ingredients/price-alerts — hausses recentes derivees de l'historique
ingredientsRouter.get('/price-alerts', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const threshold = Math.max(0, parseFloat(String(req.query.threshold)) || 10);
    const history = await prisma.priceHistory.findMany({ where: { restaurantId: req.restaurantId! }, orderBy: { createdAt: 'desc' }, take: 1000 });
    const byIng: Record<number, typeof history> = {};
    for (const h of history) { (byIng[h.ingredientId] ||= []).push(h); }
    const ids = Object.keys(byIng).map(Number);
    const ings = ids.length
      ? await prisma.ingredient.findMany({ where: { id: { in: ids }, restaurantId: req.restaurantId! }, select: { id: true, name: true, unit: true, category: true } })
      : [];
    const byId: Record<number, { id: number; name: string; unit: string; category: string }> = {};
    ings.forEach((i) => { byId[i.id] = i as { id: number; name: string; unit: string; category: string }; });
    const alerts: Array<{ ingredientId: number; name: string; unit: string; category: string; oldPrice: number; newPrice: number; pct: number; date: string }> = [];
    for (const id of ids) {
      const h = byIng[id];
      if (h.length < 2 || !byId[id]) continue;
      const cur = h[0].price, prev = h[1].price;
      if (prev <= 0) continue;
      const pct = ((cur - prev) / prev) * 100;
      if (pct > threshold) alerts.push({ ingredientId: id, name: byId[id].name, unit: byId[id].unit, category: byId[id].category, oldPrice: prev, newPrice: cur, pct: Math.round(pct * 10) / 10, date: h[0].date });
    }
    alerts.sort((a, b) => b.pct - a.pct);
    res.json(alerts);
  } catch (error) { res.status(500).json({ error: 'Erreur alertes prix' }); }
});

// GET /api/ingredients/:id/price-history — evolution du prix d'un ingredient
ingredientsRouter.get('/:id/price-history', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const ingredientId = parseInt(req.params.id as string);
    if (isNaN(ingredientId)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const owns = await prisma.ingredient.findFirst({ where: { id: ingredientId, restaurantId: req.restaurantId! }, select: { id: true } });
    if (!owns) { res.status(404).json({ error: 'Ingrédient non trouvé' }); return; }
    const history = await prisma.priceHistory.findMany({ where: { ingredientId, restaurantId: req.restaurantId! }, orderBy: { createdAt: 'asc' }, take: 60, select: { price: true, date: true, source: true, createdAt: true } });
    res.json(history);
  } catch (error) { res.status(500).json({ error: 'Erreur historique prix' }); }
});

// GET single ingredient
ingredientsRouter.get('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const ingredient = await prisma.ingredient.findFirst({
      where: { id, restaurantId: req.restaurantId! },
      include: {
        _count: {
          select: { recipes: true },
        },
      },
    });
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingrédient non trouvé' });
    }
    res.json({ ...ingredient, usageCount: ingredient._count.recipes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create ingredient
ingredientsRouter.post('/', authWithRestaurant, validate(createIngredientSchema), async (req: AuthRequest, res: Response) => {
  try {
    const { name, unit, pricePerUnit, supplier, supplierId, category, allergens } = req.body;

    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        unit: unit.trim(),
        pricePerUnit,
        supplier: supplier || null,
        supplierId: supplierId || null,
        category: category.trim(),
        allergens: Array.isArray(allergens) ? allergens : [],
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// PUT update ingredient
ingredientsRouter.put('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    // Verify ownership
    const existing = await prisma.ingredient.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });

    const { name, unit, pricePerUnit, supplier, supplierId, category, allergens } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    if (!unit || !unit.trim()) {
      return res.status(400).json({ error: "L'unité est requise" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'La catégorie est requise' });
    }
    const parsedPrice = typeof pricePerUnit === 'number' ? pricePerUnit : parseFloat(pricePerUnit);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Le prix unitaire doit être supérieur à 0' });
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        name: name.trim(),
        unit: unit.trim(),
        pricePerUnit: parsedPrice,
        supplier: supplier || null,
        supplierId: supplierId || null,
        category: category.trim(),
        allergens: Array.isArray(allergens) ? allergens : [],
      },
    });

    // Historise le changement de prix (courbe d'evolution, tendance inflation)
    if (existing.pricePerUnit !== parsedPrice) {
      try {
        await prisma.priceHistory.create({
          data: {
            ingredientId: id,
            price: parsedPrice,
            date: new Date().toISOString().slice(0, 10),
            source: typeof req.body.priceSource === 'string' ? req.body.priceSource : 'manual',
            restaurantId: req.restaurantId!,
          },
        });
      } catch (e) { console.error('PriceHistory create error:', e); }
    }

    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// DELETE ingredient
ingredientsRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    // Verify ownership
    const existing = await prisma.ingredient.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });

    await prisma.ingredient.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
