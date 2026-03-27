import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const priceHistoryRouter = Router();

/* ─── GET /api/price-history ─── */
priceHistoryRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { ingredientId, days } = req.query;

    const where: any = {};

    if (ingredientId) {
      where.ingredientId = Number(ingredientId);
    }

    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(days));
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      where.date = { gte: cutoffStr };
    }

    const results = await prisma.priceHistory.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des prix' });
  }
});

/* ─── GET /api/price-history/alerts ─── */
priceHistoryRouter.get('/alerts', async (_req: AuthRequest, res: Response) => {
  try {
    const allEntries = await prisma.priceHistory.findMany({
      orderBy: { date: 'asc' },
    });

    // Group entries by ingredientId
    const byIngredient: Record<number, typeof allEntries> = {};
    for (const entry of allEntries) {
      if (!byIngredient[entry.ingredientId]) byIngredient[entry.ingredientId] = [];
      byIngredient[entry.ingredientId].push(entry);
    }

    const alerts: { ingredientId: number; oldPrice: number; newPrice: number; changePercent: number; date: string }[] = [];

    for (const [ingId, entries] of Object.entries(byIngredient)) {
      if (entries.length < 2) continue;

      const latest = entries[entries.length - 1];
      const previous = entries[entries.length - 2];
      const changePercent = ((latest.price - previous.price) / previous.price) * 100;

      if (Math.abs(changePercent) >= 5) {
        alerts.push({
          ingredientId: Number(ingId),
          oldPrice: previous.price,
          newPrice: latest.price,
          changePercent: Math.round(changePercent * 100) / 100,
          date: latest.date,
        });
      }
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
  }
});

/* ─── POST /api/price-history ─── */
priceHistoryRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { ingredientId, price, date, source } = req.body;

    if (!ingredientId || price == null) {
      res.status(400).json({ error: 'ingredientId et price sont requis' });
      return;
    }

    const entry = await prisma.priceHistory.create({
      data: {
        ingredientId: Number(ingredientId),
        price: Number(price),
        date: date || new Date().toISOString().slice(0, 10),
        source: source || 'manual',
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du prix' });
  }
});
