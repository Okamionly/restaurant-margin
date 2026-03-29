import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const haccpRouter = Router();

// ─── Temperature thresholds ─────────────────────────────────────────────────

function getTemperatureStatus(zone: string, temperature: number): string {
  const z = zone.toLowerCase();
  if (z === 'frigo' || z === 'réfrigérateur') {
    return temperature >= 0 && temperature <= 4 ? 'conforme' : 'non_conforme';
  }
  if (z === 'congélateur' || z === 'congelateur') {
    return temperature <= -18 ? 'conforme' : 'non_conforme';
  }
  if (z === 'plats chauds' || z === 'plat_chaud') {
    return temperature >= 63 ? 'conforme' : 'non_conforme';
  }
  // Réception: 0-4°C for cold items by default
  if (z === 'réception' || z === 'reception') {
    return temperature >= 0 && temperature <= 4 ? 'conforme' : 'non_conforme';
  }
  return 'en_attente';
}

// ─── GET /temperatures ──────────────────────────────────────────────────────

haccpRouter.get('/temperatures', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to, zone } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from as string;
      if (to) where.date.lte = to as string;
    }

    if (zone) {
      where.zone = zone as string;
    }

    const temperatures = await prisma.haccpTemperature.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(temperatures);
  } catch (error) {
    console.error('Error fetching HACCP temperatures:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des températures' });
  }
});

// ─── POST /temperatures ─────────────────────────────────────────────────────

haccpRouter.post('/temperatures', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { zone, temperature, recordedBy, notes, date, time } = req.body;

    if (!zone || temperature == null || !date) {
      return res.status(400).json({ error: 'Champs requis : zone, temperature, date' });
    }

    const status = getTemperatureStatus(zone, temperature);

    const record = await prisma.haccpTemperature.create({
      data: {
        zone,
        temperature: parseFloat(temperature),
        status,
        recordedBy: recordedBy || null,
        notes: notes || null,
        date,
        time: time || null,
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating HACCP temperature:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la température' });
  }
});

// ─── GET /cleanings ─────────────────────────────────────────────────────────

haccpRouter.get('/cleanings', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (date) {
      where.date = date as string;
    }

    const cleanings = await prisma.haccpCleaning.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(cleanings);
  } catch (error) {
    console.error('Error fetching HACCP cleanings:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du nettoyage' });
  }
});

// ─── POST /cleanings ────────────────────────────────────────────────────────

haccpRouter.post('/cleanings', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { zone, task, status, doneBy, date } = req.body;

    if (!zone || !task || !date) {
      return res.status(400).json({ error: 'Champs requis : zone, task, date' });
    }

    const validStatuses = ['fait', 'en_attente', 'non_fait'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Statut invalide. Valeurs acceptées : ${validStatuses.join(', ')}` });
    }

    const record = await prisma.haccpCleaning.create({
      data: {
        zone,
        task,
        status: status || 'en_attente',
        doneBy: doneBy || null,
        date,
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating HACCP cleaning:', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du nettoyage' });
  }
});

// ─── PUT /cleanings/:id ─────────────────────────────────────────────────────

haccpRouter.put('/cleanings/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const existing = await prisma.haccpCleaning.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Enregistrement de nettoyage non trouvé' });
    }

    const { status, doneBy } = req.body;

    const validStatuses = ['fait', 'en_attente', 'non_fait'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Statut invalide. Valeurs acceptées : ${validStatuses.join(', ')}` });
    }

    const updated = await prisma.haccpCleaning.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(doneBy !== undefined && { doneBy }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating HACCP cleaning:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du nettoyage' });
  }
});

// ─── GET /summary ───────────────────────────────────────────────────────────

haccpRouter.get('/summary', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const today = new Date().toISOString().split('T')[0];

    // Today's temperature checks
    const todayTemps = await prisma.haccpTemperature.findMany({
      where: { restaurantId, date: today },
    });

    const totalChecks = todayTemps.length;
    const conformes = todayTemps.filter(t => t.status === 'conforme').length;
    const nonConformes = todayTemps.filter(t => t.status === 'non_conforme').length;

    // Today's cleaning tasks
    const todayCleanings = await prisma.haccpCleaning.findMany({
      where: { restaurantId, date: today },
    });

    const totalCleanings = todayCleanings.length;
    const cleaningsDone = todayCleanings.filter(c => c.status === 'fait').length;
    const cleaningCompletion = totalCleanings > 0
      ? Math.round((cleaningsDone / totalCleanings) * 100)
      : 0;

    res.json({
      date: today,
      temperatures: {
        totalChecks,
        conformes,
        nonConformes,
        complianceRate: totalChecks > 0 ? Math.round((conformes / totalChecks) * 100) : 100,
      },
      cleanings: {
        total: totalCleanings,
        done: cleaningsDone,
        completion: cleaningCompletion,
      },
    });
  } catch (error) {
    console.error('Error fetching HACCP summary:', error);
    res.status(500).json({ error: 'Erreur lors du calcul du résumé HACCP' });
  }
});
