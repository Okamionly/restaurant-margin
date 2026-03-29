import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const inventoryRouter = Router();

// ── Fictive stock seed ────────────────────────────────────────────────────────
// One-time seed: if all inventory items have stock=0, populate with realistic
// random quantities based on ingredient category.
let stockSeeded = false;

interface StockRange { min: number; max: number }
const STOCK_RANGES: Record<string, StockRange> = {
  'Légumes':                  { min: 5,   max: 30 },
  'Legumes':                  { min: 5,   max: 30 },
  'Viandes':                  { min: 2,   max: 15 },
  'Poissons & Fruits de mer': { min: 1,   max: 10 },
  'Produits laitiers':        { min: 5,   max: 20 },
  'Épices & Condiments':      { min: 0.5, max: 3 },
  'Fruits':                   { min: 3,   max: 20 },
  'Féculents & Céréales':     { min: 5,   max: 25 },
  'Huiles & Matières grasses':{ min: 2,   max: 10 },
  'Boissons':                 { min: 5,   max: 30 },
  'Autres':                   { min: 2,   max: 15 },
};

function randomBetween(min: number, max: number): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

async function seedFictiveStock() {
  if (stockSeeded) return;
  stockSeeded = true;

  const items = await prisma.inventoryItem.findMany({
    include: { ingredient: true },
  });

  // Only seed if ALL items have stock=0 (avoid overwriting real data)
  const allZero = items.length > 0 && items.every(i => i.currentStock === 0);
  if (!allZero) return;

  console.log(`[inventory] Seeding fictive stock for ${items.length} items...`);

  for (const item of items) {
    const category = item.ingredient.category;
    const range = STOCK_RANGES[category] || { min: 2, max: 15 };
    const stock = randomBetween(range.min, range.max);
    const minStock = Math.round(stock * 0.2 * 100) / 100;   // ~20% of stock
    const maxStock = Math.round(stock * 2.0 * 100) / 100;    // ~200% of stock

    await prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        currentStock: stock,
        minStock,
        maxStock,
      },
    });
  }

  console.log(`[inventory] Fictive stock seeded successfully.`);
}

// GET all inventory items with ingredient details
inventoryRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    // One-time seed on first load
    await seedFictiveStock();

    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId! },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'inventaire' });
  }
});

// GET items below minStock (alerts)
inventoryRouter.get('/alerts', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId! },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    const alerts = items.filter(item => item.currentStock < item.minStock);
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
  }
});

// GET total inventory value estimation
inventoryRouter.get('/value', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId! },
      include: { ingredient: true },
    });
    const totalValue = items.reduce((sum, item) => {
      return sum + item.currentStock * item.ingredient.pricePerUnit;
    }, 0);
    const byCategory: Record<string, number> = {};
    for (const item of items) {
      const cat = item.ingredient.category;
      const val = item.currentStock * item.ingredient.pricePerUnit;
      byCategory[cat] = (byCategory[cat] || 0) + val;
    }
    res.json({
      totalValue: Math.round(totalValue * 100) / 100,
      byCategory: Object.entries(byCategory).map(([category, value]) => ({
        category,
        value: Math.round(value * 100) / 100,
      })),
      itemCount: items.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du calcul de la valeur' });
  }
});

// POST suggest ingredients not yet in inventory
inventoryRouter.post('/suggest', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        restaurantId: req.restaurantId!,
        inventoryItem: null,
      },
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des suggestions' });
  }
});

// POST add ingredient to inventory
inventoryRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { ingredientId, currentStock, unit, minStock, maxStock, notes } = req.body;
    if (!ingredientId) return res.status(400).json({ error: 'ingredientId requis' });

    const ingredient = await prisma.ingredient.findFirst({
      where: { id: ingredientId, restaurantId: req.restaurantId! },
    });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });

    const item = await prisma.inventoryItem.create({
      data: {
        ingredientId,
        currentStock: currentStock || 0,
        unit: unit || ingredient.unit,
        minStock: minStock || 0,
        maxStock: maxStock || null,
        notes: notes || null,
        restaurantId: req.restaurantId!,
      },
      include: { ingredient: true },
    });
    res.status(201).json(item);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2002') {
      return res.status(409).json({ error: 'Cet ingrédient est déjà dans l\'inventaire' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout à l\'inventaire' });
  }
});

// PUT update stock (adjust quantity, set min/max)
inventoryRouter.put('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    // Verify ownership
    const existing = await prisma.inventoryItem.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Item non trouvé' });

    const { currentStock, minStock, maxStock, unit, notes } = req.body;

    const data: Partial<Pick<import('@prisma/client').InventoryItem, 'currentStock' | 'minStock' | 'maxStock' | 'unit' | 'notes'>> = {};
    if (currentStock !== undefined) data.currentStock = parseFloat(currentStock);
    if (minStock !== undefined) data.minStock = parseFloat(minStock);
    if (maxStock !== undefined) data.maxStock = maxStock === null ? null : parseFloat(maxStock);
    if (unit !== undefined) data.unit = unit;
    if (notes !== undefined) data.notes = notes || null;

    const item = await prisma.inventoryItem.update({
      where: { id },
      data,
      include: { ingredient: true },
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// POST restock event (adds to currentStock)
inventoryRouter.post('/:id/restock', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'La quantité doit être supérieure à 0' });
    }

    const existing = await prisma.inventoryItem.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Item non trouvé' });

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        currentStock: existing.currentStock + parseFloat(quantity),
        lastRestockDate: new Date(),
        lastRestockQuantity: parseFloat(quantity),
      },
      include: { ingredient: true },
    });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du réapprovisionnement' });
  }
});

// DELETE remove from inventory
inventoryRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    // Verify ownership
    const existing = await prisma.inventoryItem.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Item non trouvé' });

    await prisma.inventoryItem.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
