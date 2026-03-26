import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const menuSalesRouter = Router();

/* ─── In-memory storage ─── */

interface MenuSale {
  id: number;
  recipeId: number;
  recipeName: string;
  quantity: number;
  revenue: number;
  date: string;
  createdAt: string;
}

let menuSales: MenuSale[] = [];
let nextId = 1;

/* ─── GET /api/menu-sales ─── */
menuSalesRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;
    let results = [...menuSales];

    if (from) {
      results = results.filter(s => s.date >= String(from));
    }
    if (to) {
      results = results.filter(s => s.date <= String(to));
    }

    results.sort((a, b) => a.date.localeCompare(b.date));
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

    const sale: MenuSale = {
      id: nextId++,
      recipeId: Number(recipeId),
      recipeName: recipeName || '',
      quantity: Number(quantity),
      revenue: Number(revenue || 0),
      date: date || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };

    menuSales.push(sale);
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

    const created: MenuSale[] = sales.map((s: any) => ({
      id: nextId++,
      recipeId: Number(s.recipeId),
      recipeName: s.recipeName || '',
      quantity: Number(s.quantity || 0),
      revenue: Number(s.revenue || 0),
      date: s.date || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    }));

    menuSales.push(...created);
    res.status(201).json({ imported: created.length, sales: created });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'import des ventes' });
  }
});
