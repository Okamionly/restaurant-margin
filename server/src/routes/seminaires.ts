import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const seminairesRouter = Router();

// GET /summary — stats
seminairesRouter.get('/summary', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const all = await prisma.seminaire.findMany({ where: { restaurantId } });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const byStatus: Record<string, number> = {};
    let totalRevenue = 0;
    let upcomingThisMonth = 0;

    for (const s of all) {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      if (['confirme', 'en_cours', 'solde'].includes(s.status) && s.budget) {
        totalRevenue += s.budget;
      }
      const d = new Date(s.date + 'T00:00:00');
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear && d >= now) {
        upcomingThisMonth++;
      }
    }

    res.json({
      total: all.length,
      byStatus,
      upcomingThisMonth,
      totalRevenue,
    });
  } catch {
    res.status(500).json({ error: 'Erreur récupération résumé séminaires' });
  }
});

// GET / — list all seminaires for restaurant
seminairesRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const seminaires = await prisma.seminaire.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { date: 'desc' },
    });
    res.json(seminaires);
  } catch {
    res.status(500).json({ error: 'Erreur récupération séminaires' });
  }
});

// GET /:id — get single
seminairesRouter.get('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const seminaire = await prisma.seminaire.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!seminaire) return res.status(404).json({ error: 'Séminaire non trouvé' });
    res.json(seminaire);
  } catch {
    res.status(500).json({ error: 'Erreur récupération séminaire' });
  }
});

// POST / — create
seminairesRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { title, clientName, clientEmail, clientPhone, eventType, date, startTime, endTime, guestCount, budget, menuDetails, equipment, notes } = req.body;

    if (!title || !clientName || !eventType || !date) {
      return res.status(400).json({ error: 'Titre, nom client, type et date requis' });
    }

    const seminaire = await prisma.seminaire.create({
      data: {
        title,
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        eventType,
        date,
        startTime: startTime || null,
        endTime: endTime || null,
        guestCount: guestCount || 20,
        status: 'demande',
        budget: budget || null,
        menuDetails: menuDetails || null,
        equipment: equipment || [],
        notes: notes || null,
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(seminaire);
  } catch {
    res.status(500).json({ error: 'Erreur création séminaire' });
  }
});

// PUT /:id — update
seminairesRouter.put('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.seminaire.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Séminaire non trouvé' });

    const { title, clientName, clientEmail, clientPhone, eventType, date, startTime, endTime, guestCount, status, budget, menuDetails, equipment, notes } = req.body;

    const seminaire = await prisma.seminaire.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(clientName !== undefined && { clientName }),
        ...(clientEmail !== undefined && { clientEmail }),
        ...(clientPhone !== undefined && { clientPhone }),
        ...(eventType !== undefined && { eventType }),
        ...(date !== undefined && { date }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(guestCount !== undefined && { guestCount }),
        ...(status !== undefined && { status }),
        ...(budget !== undefined && { budget }),
        ...(menuDetails !== undefined && { menuDetails }),
        ...(equipment !== undefined && { equipment }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json(seminaire);
  } catch {
    res.status(500).json({ error: 'Erreur mise à jour séminaire' });
  }
});

// DELETE /:id — delete
seminairesRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.seminaire.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Séminaire non trouvé' });

    await prisma.seminaire.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Erreur suppression séminaire' });
  }
});
