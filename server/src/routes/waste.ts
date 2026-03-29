import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const wasteRouter = Router();

// GET /api/waste — list waste logs with ingredient info
wasteRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from as string;
      if (to) where.date.lte = to as string;
    }

    const logs = await prisma.wasteLog.findMany({
      where,
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true, pricePerUnit: true } } },
      orderBy: { date: 'desc' },
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching waste logs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des pertes' });
  }
});

// GET /api/waste/summary — waste analytics
wasteRouter.get('/summary', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthStart = `${currentMonth}-01`;
    const currentMonthEnd = `${currentMonth}-31`;

    // Total waste cost & kg this month
    const thisMonthLogs = await prisma.wasteLog.findMany({
      where: {
        restaurantId,
        date: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      include: { ingredient: { select: { name: true } } },
    });

    const totalWasteCost = thisMonthLogs.reduce((sum, l) => sum + l.costImpact, 0);
    const totalWasteKg = thisMonthLogs
      .filter((l) => l.unit === 'kg' || l.unit === 'g' || l.unit === 'L' || l.unit === 'mL')
      .reduce((sum, l) => {
        if (l.unit === 'g' || l.unit === 'mL') return sum + l.quantity / 1000;
        return sum + l.quantity;
      }, 0);

    // Top 5 wasted ingredients (this month)
    const ingredientMap = new Map<string, { name: string; totalCost: number; totalQty: number }>();
    for (const log of thisMonthLogs) {
      const key = String(log.ingredientId);
      const existing = ingredientMap.get(key) || { name: log.ingredient.name, totalCost: 0, totalQty: 0 };
      existing.totalCost += log.costImpact;
      existing.totalQty += log.quantity;
      ingredientMap.set(key, existing);
    }
    const topWastedIngredients = Array.from(ingredientMap.entries())
      .map(([id, data]) => ({ ingredientId: Number(id), ...data }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);

    // Waste by reason (this month)
    const wasteByReason: Record<string, { count: number; cost: number }> = {};
    for (const log of thisMonthLogs) {
      if (!wasteByReason[log.reason]) wasteByReason[log.reason] = { count: 0, cost: 0 };
      wasteByReason[log.reason].count++;
      wasteByReason[log.reason].cost += log.costImpact;
    }

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const sixMonthsAgoStr = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, '0')}-01`;

    const trendLogs = await prisma.wasteLog.findMany({
      where: {
        restaurantId,
        date: { gte: sixMonthsAgoStr },
      },
    });

    const monthlyTrend: Record<string, { cost: number; count: number }> = {};
    for (const log of trendLogs) {
      const month = log.date.substring(0, 7); // YYYY-MM
      if (!monthlyTrend[month]) monthlyTrend[month] = { cost: 0, count: 0 };
      monthlyTrend[month].cost += log.costImpact;
      monthlyTrend[month].count++;
    }

    // Sort monthly trend chronologically
    const sortedTrend = Object.entries(monthlyTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    res.json({
      totalWasteCost: Math.round(totalWasteCost * 100) / 100,
      totalWasteKg: Math.round(totalWasteKg * 100) / 100,
      topWastedIngredients,
      wasteByReason,
      monthlyTrend: sortedTrend,
    });
  } catch (error) {
    console.error('Error fetching waste summary:', error);
    res.status(500).json({ error: 'Erreur lors du calcul du résumé des pertes' });
  }
});

// POST /api/waste — create waste entry
wasteRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { ingredientId, quantity, unit, reason, date, notes } = req.body;

    if (!ingredientId || quantity == null || !unit || !reason || !date) {
      return res.status(400).json({ error: 'Champs requis : ingredientId, quantity, unit, reason, date' });
    }

    const validReasons = ['expired', 'spoiled', 'overproduction', 'damaged', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: `Raison invalide. Valeurs acceptées : ${validReasons.join(', ')}` });
    }

    // Fetch ingredient to calculate cost impact
    const ingredient = await prisma.ingredient.findFirst({
      where: { id: ingredientId, restaurantId: req.restaurantId! },
    });

    if (!ingredient) {
      return res.status(404).json({ error: 'Ingrédient non trouvé' });
    }

    // Calculate cost impact: convert to same unit if needed, then multiply by price
    let costImpact = quantity * ingredient.pricePerUnit;

    // If units differ, attempt basic conversion
    if (unit !== ingredient.unit) {
      if (unit === 'g' && ingredient.unit === 'kg') {
        costImpact = (quantity / 1000) * ingredient.pricePerUnit;
      } else if (unit === 'kg' && ingredient.unit === 'g') {
        costImpact = (quantity * 1000) * ingredient.pricePerUnit;
      } else if (unit === 'mL' && ingredient.unit === 'L') {
        costImpact = (quantity / 1000) * ingredient.pricePerUnit;
      } else if (unit === 'L' && ingredient.unit === 'mL') {
        costImpact = (quantity * 1000) * ingredient.pricePerUnit;
      }
    }

    const wasteLog = await prisma.wasteLog.create({
      data: {
        ingredientId,
        quantity,
        unit,
        reason,
        costImpact: Math.round(costImpact * 100) / 100,
        date,
        notes: notes || null,
        restaurantId: req.restaurantId!,
      },
      include: { ingredient: { select: { id: true, name: true, unit: true, category: true, pricePerUnit: true } } },
    });

    res.status(201).json(wasteLog);
  } catch (error) {
    console.error('Error creating waste log:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'entrée de perte' });
  }
});

// DELETE /api/waste/:id — delete waste entry
wasteRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const existing = await prisma.wasteLog.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Entrée de perte non trouvée' });
    }

    await prisma.wasteLog.delete({ where: { id } });
    res.json({ message: 'Entrée supprimée' });
  } catch (error) {
    console.error('Error deleting waste log:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
