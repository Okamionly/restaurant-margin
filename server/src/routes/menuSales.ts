import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const menuSalesRouter = Router();

/* ─── Seed demo data if table is empty ─── */
async function seedDemoSalesIfEmpty() {
  const count = await prisma.menuSale.count();
  if (count > 0) return;

  const demoRecipes = [
    { id: 1, name: 'Boeuf bourguignon', qty: 12, price: 18 },
    { id: 2, name: 'Crème brûlée', qty: 25, price: 8 },
    { id: 3, name: 'Frites maison', qty: 45, price: 6 },
    { id: 4, name: 'Gratin dauphinois', qty: 18, price: 9 },
    { id: 5, name: 'Salade de chèvre chaud', qty: 22, price: 12 },
    { id: 6, name: 'Salade Niçoise', qty: 15, price: 14 },
    { id: 7, name: 'Tarte Tatin', qty: 20, price: 9 },
    { id: 8, name: 'Tiramisu', qty: 30, price: 8 },
    { id: 9, name: 'Mousse au chocolat', qty: 28, price: 7 },
    { id: 10, name: 'Carbonara authentique', qty: 35, price: 14 },
    { id: 11, name: 'Gaspacho andalou', qty: 16, price: 10 },
    { id: 12, name: 'Tarte au citron meringuée', qty: 14, price: 8 },
    { id: 13, name: 'Tarte au citron citron vert', qty: 10, price: 9 },
    { id: 14, name: 'Panna cotta fraise', qty: 19, price: 8 },
    { id: 15, name: 'Fondant au chocolat', qty: 24, price: 9 },
    { id: 16, name: 'Risotto aux champignons', qty: 17, price: 15 },
    { id: 17, name: 'Ratatouille provençale', qty: 13, price: 11 },
    { id: 18, name: 'Bruschetta tomates', qty: 21, price: 8 },
    { id: 19, name: 'Quiche Lorraine', qty: 16, price: 10 },
    { id: 20, name: 'Filet de bar', qty: 8, price: 22 },
    { id: 21, name: 'Pavé de saumon grillé', qty: 11, price: 19 },
    { id: 22, name: 'Velouté de butternut', qty: 14, price: 8 },
    { id: 23, name: 'Crêpes flambées', qty: 18, price: 10 },
    { id: 24, name: 'Salade verte vinaigrette', qty: 30, price: 6 },
    { id: 25, name: 'Salade César', qty: 20, price: 13 },
    { id: 26, name: 'Magret de canard', qty: 9, price: 21 },
    { id: 27, name: 'Confit de canard', qty: 7, price: 18 },
    { id: 28, name: 'Poulet rôti jus', qty: 22, price: 15 },
    { id: 29, name: 'Tartare de saumon', qty: 13, price: 16 },
    { id: 30, name: 'Burger gourmet', qty: 32, price: 16 },
  ];

  const rows: any[] = [];
  const now = new Date();
  for (let d = 0; d < 30; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().slice(0, 10);
    for (const r of demoRecipes) {
      const variation = 0.6 + Math.random() * 0.8;
      const qty = Math.round(r.qty * variation);
      if (qty > 0) {
        rows.push({
          recipeId: r.id,
          recipeName: r.name,
          quantity: qty,
          revenue: qty * r.price,
          date: dateStr,
        });
      }
    }
  }

  await prisma.menuSale.createMany({ data: rows });
}

// Run seed on module load
seedDemoSalesIfEmpty().catch(console.error);

/* ─── GET /api/menu-sales ─── */
menuSalesRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    const where: any = {};
    if (from) where.date = { ...where.date, gte: String(from) };
    if (to) where.date = { ...where.date, lte: String(to) };

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
menuSalesRouter.post('/', async (req: AuthRequest, res: Response) => {
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
      },
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la vente' });
  }
});

/* ─── POST /api/menu-sales/bulk ─── */
menuSalesRouter.post('/bulk', async (req: AuthRequest, res: Response) => {
  try {
    const { sales } = req.body;

    if (!Array.isArray(sales) || sales.length === 0) {
      res.status(400).json({ error: 'Un tableau de ventes est requis' });
      return;
    }

    const data = sales.map((s: any) => ({
      recipeId: Number(s.recipeId),
      recipeName: s.recipeName || '',
      quantity: Number(s.quantity || 0),
      revenue: Number(s.revenue || 0),
      date: s.date || new Date().toISOString().slice(0, 10),
    }));

    const result = await prisma.menuSale.createMany({ data });

    // Return the created sales for the response
    const created = await prisma.menuSale.findMany({
      orderBy: { id: 'desc' },
      take: data.length,
    });

    res.status(201).json({ imported: result.count, sales: created.reverse() });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'import des ventes' });
  }
});
