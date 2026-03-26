import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const priceHistoryRouter = Router();

/* ─── In-memory storage ─── */

interface PriceEntry {
  id: number;
  ingredientId: number;
  price: number;
  date: string;
  source: string;
  createdAt: string;
}

let priceEntries: PriceEntry[] = [];
let nextId = 1;

/* ─── GET /api/price-history ─── */
priceHistoryRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { ingredientId, days } = req.query;
    let results = [...priceEntries];

    if (ingredientId) {
      results = results.filter(e => e.ingredientId === Number(ingredientId));
    }

    if (days) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(days));
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      results = results.filter(e => e.date >= cutoffStr);
    }

    results.sort((a, b) => a.date.localeCompare(b.date));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des prix' });
  }
});

/* ─── GET /api/price-history/alerts ─── */
priceHistoryRouter.get('/alerts', async (_req: AuthRequest, res: Response) => {
  try {
    // Group entries by ingredientId and compute alerts for significant price changes
    const byIngredient: Record<number, PriceEntry[]> = {};
    for (const entry of priceEntries) {
      if (!byIngredient[entry.ingredientId]) byIngredient[entry.ingredientId] = [];
      byIngredient[entry.ingredientId].push(entry);
    }

    const alerts: { ingredientId: number; oldPrice: number; newPrice: number; changePercent: number; date: string }[] = [];

    for (const [ingId, entries] of Object.entries(byIngredient)) {
      const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));
      if (sorted.length < 2) continue;

      const latest = sorted[sorted.length - 1];
      const previous = sorted[sorted.length - 2];
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

    const entry: PriceEntry = {
      id: nextId++,
      ingredientId: Number(ingredientId),
      price: Number(price),
      date: date || new Date().toISOString().slice(0, 10),
      source: source || 'manual',
      createdAt: new Date().toISOString(),
    };

    priceEntries.push(entry);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du prix' });
  }
});
