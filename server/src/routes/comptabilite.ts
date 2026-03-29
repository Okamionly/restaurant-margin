import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const comptabiliteRouter = Router();

// GET /  — list entries with optional filters
comptabiliteRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to, type } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = String(from);
      if (to) where.date.lte = String(to);
    }
    if (type) where.type = String(type);

    const entries = await prisma.financialEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    res.json(entries);
  } catch {
    res.status(500).json({ error: 'Erreur récupération écritures' });
  }
});

// GET /summary — monthly aggregated summary
comptabiliteRouter.get('/summary', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = String(from);
      if (to) where.date.lte = String(to);
    }

    const entries = await prisma.financialEntry.findMany({ where });

    // Group by month
    const monthly: Record<string, {
      month: string;
      totalRevenue: number;
      totalExpenses: number;
      profit: number;
      byCategory: Record<string, number>;
    }> = {};

    for (const entry of entries) {
      const month = entry.date.substring(0, 7); // YYYY-MM
      if (!monthly[month]) {
        monthly[month] = { month, totalRevenue: 0, totalExpenses: 0, profit: 0, byCategory: {} };
      }
      const m = monthly[month];
      if (entry.type === 'revenue') {
        m.totalRevenue += entry.amount;
      } else {
        m.totalExpenses += entry.amount;
      }
      m.byCategory[entry.category] = (m.byCategory[entry.category] || 0) + entry.amount;
    }

    // Calculate profit
    for (const m of Object.values(monthly)) {
      m.profit = m.totalRevenue - m.totalExpenses;
    }

    // Sort by month desc
    const summary = Object.values(monthly).sort((a, b) => b.month.localeCompare(a.month));
    res.json(summary);
  } catch {
    res.status(500).json({ error: 'Erreur calcul résumé' });
  }
});

// GET /export/fec — FEC export
comptabiliteRouter.get('/export/fec', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = String(from);
      if (to) where.date.lte = String(to);
    }

    const entries = await prisma.financialEntry.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    const header = [
      'JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate',
      'CompteNum', 'CompteLib', 'CompAuxNum', 'CompAuxLib',
      'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit',
      'EcritureLet', 'DateLet', 'ValidDate', 'Montantdevise', 'Idevise',
    ].join('\t');

    const lines = entries.map((entry, index) => {
      const journalCode = entry.type === 'revenue' ? 'VE' : 'AC';
      const journalLib = entry.type === 'revenue' ? 'Ventes' : 'Achats';
      const ecritureNum = String(index + 1).padStart(6, '0');
      const ecritureDate = entry.date.replace(/-/g, '');
      const compteNum = entry.type === 'revenue' ? '701000' : '601000';
      const compteLib = entry.category;
      const debit = entry.type === 'expense' ? entry.amount.toFixed(2) : '0.00';
      const credit = entry.type === 'revenue' ? entry.amount.toFixed(2) : '0.00';
      const pieceRef = entry.reference || '';
      const pieceDate = ecritureDate;
      const validDate = ecritureDate;

      return [
        journalCode, journalLib, ecritureNum, ecritureDate,
        compteNum, compteLib, '', '',
        pieceRef, pieceDate, entry.label, debit, credit,
        '', '', validDate, '', 'EUR',
      ].join('\t');
    });

    const fecContent = [header, ...lines].join('\n');

    res.setHeader('Content-Type', 'text/tab-separated-values; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="FEC.txt"');
    res.send(fecContent);
  } catch {
    res.status(500).json({ error: 'Erreur export FEC' });
  }
});

// POST / — create entry
comptabiliteRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { date, type, category, label, amount, tvaRate, paymentMode, reference } = req.body;

    if (!date || !type || !category || !label || amount === undefined) {
      return res.status(400).json({ error: 'Champs requis : date, type, category, label, amount' });
    }

    if (!['revenue', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type doit être "revenue" ou "expense"' });
    }

    const rate = tvaRate !== undefined ? tvaRate : 20;
    const tvaAmount = amount * rate / 100;

    const entry = await prisma.financialEntry.create({
      data: {
        date,
        type,
        category,
        label,
        amount,
        tvaRate: rate,
        tvaAmount,
        paymentMode: paymentMode || null,
        reference: reference || null,
        restaurantId: req.restaurantId!,
      },
    });
    res.status(201).json(entry);
  } catch {
    res.status(500).json({ error: 'Erreur création écriture' });
  }
});

// PUT /:id — update entry
comptabiliteRouter.put('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const existing = await prisma.financialEntry.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Écriture non trouvée' });

    const { date, type, category, label, amount, tvaRate, paymentMode, reference } = req.body;

    const updatedAmount = amount !== undefined ? amount : existing.amount;
    const updatedRate = tvaRate !== undefined ? tvaRate : existing.tvaRate;
    const tvaAmount = updatedAmount * updatedRate / 100;

    const entry = await prisma.financialEntry.update({
      where: { id },
      data: {
        ...(date !== undefined && { date }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category }),
        ...(label !== undefined && { label }),
        ...(amount !== undefined && { amount }),
        tvaRate: updatedRate,
        tvaAmount,
        ...(paymentMode !== undefined && { paymentMode }),
        ...(reference !== undefined && { reference }),
      },
    });
    res.json(entry);
  } catch {
    res.status(500).json({ error: 'Erreur mise à jour écriture' });
  }
});

// DELETE /:id — delete entry
comptabiliteRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const existing = await prisma.financialEntry.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Écriture non trouvée' });

    await prisma.financialEntry.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erreur suppression écriture' });
  }
});
