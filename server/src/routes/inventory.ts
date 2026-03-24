import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const inventoryRouter = Router();

// GET all inventory items with ingredient details
inventoryRouter.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
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
inventoryRouter.get('/alerts', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
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
inventoryRouter.get('/value', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
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
inventoryRouter.post('/suggest', async (_req: AuthRequest, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: {
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
inventoryRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { ingredientId, currentStock, unit, minStock, maxStock, notes } = req.body;
    if (!ingredientId) return res.status(400).json({ error: 'ingredientId requis' });

    const ingredient = await prisma.ingredient.findUnique({ where: { id: ingredientId } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });

    const item = await prisma.inventoryItem.create({
      data: {
        ingredientId,
        currentStock: currentStock || 0,
        unit: unit || ingredient.unit,
        minStock: minStock || 0,
        maxStock: maxStock || null,
        notes: notes || null,
      },
      include: { ingredient: true },
    });
    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Cet ingrédient est déjà dans l\'inventaire' });
    }
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout à l\'inventaire' });
  }
});

// PUT update stock (adjust quantity, set min/max)
inventoryRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { currentStock, minStock, maxStock, unit, notes } = req.body;

    const data: any = {};
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
inventoryRouter.post('/:id/restock', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { quantity } = req.body;
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'La quantité doit être supérieure à 0' });
    }

    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
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
inventoryRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.inventoryItem.delete({
      where: { id: parseInt(req.params.id as string) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
