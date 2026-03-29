import { Router, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const menuSalesRouter = Router();

/* ─── GET /api/menu-sales ─── */
menuSalesRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    const where: Prisma.MenuSaleWhereInput = { restaurantId: req.restaurantId! };
    if (from) where.date = { ...((where.date as Prisma.StringFilter) || {}), gte: String(from) };
    if (to) where.date = { ...((where.date as Prisma.StringFilter) || {}), lte: String(to) };

    const results = await prisma.menuSale.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des ventes' });
  }
});

/* ─── POST /api/menu-sales ─── */
menuSalesRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { recipeId, recipeName, quantity, revenue, date } = req.body;

    if (!recipeId || !quantity) {
      res.status(400).json({ error: 'recipeId et quantity sont requis' });
      return;
    }

    const sale = await prisma.menuSale.create({
      data: {
        recipeId: Number(recipeId),
        recipeName: recipeName || '',
        quantity: Number(quantity),
        revenue: Number(revenue || 0),
        date: date || new Date().toISOString().slice(0, 10),
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la vente" });
  }
});

/* ─── POST /api/menu-sales/bulk ─── */
menuSalesRouter.post('/bulk', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { sales } = req.body;

    if (!Array.isArray(sales) || sales.length === 0) {
      res.status(400).json({ error: 'Un tableau de ventes est requis' });
      return;
    }

    interface SaleInput {
      recipeId: number;
      recipeName?: string;
      quantity?: number;
      revenue?: number;
      date?: string;
    }

    const data = sales.map((s: SaleInput) => ({
      recipeId: Number(s.recipeId),
      recipeName: s.recipeName || '',
      quantity: Number(s.quantity || 0),
      revenue: Number(s.revenue || 0),
      date: s.date || new Date().toISOString().slice(0, 10),
      restaurantId: req.restaurantId!,
    }));

    const result = await prisma.menuSale.createMany({ data });

    const created = await prisma.menuSale.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { id: 'desc' },
      take: data.length,
    });

    res.status(201).json({ imported: result.count, sales: created.reverse() });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'import des ventes" });
  }
});
