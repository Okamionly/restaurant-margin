import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const devisRouter = Router();

// GET all devis for restaurant
devisRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const devis = await prisma.devis.findMany({
      where: { restaurantId: req.restaurantId! },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(devis);
  } catch {
    res.status(500).json({ error: 'Erreur récupération devis' });
  }
});

// GET single devis
devisRouter.get('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const devis = await prisma.devis.findFirst({
      where: { id, restaurantId: req.restaurantId! },
      include: { items: true },
    });
    if (!devis) return res.status(404).json({ error: 'Devis non trouvé' });
    res.json(devis);
  } catch {
    res.status(500).json({ error: 'Erreur récupération devis' });
  }
});

// POST create devis
devisRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhone, clientAddress, subject, tvaRate, validUntil, notes, items } = req.body;
    if (!clientName || !subject) {
      return res.status(400).json({ error: 'Nom client et objet requis' });
    }

    // Generate devis number
    const count = await prisma.devis.count({ where: { restaurantId: req.restaurantId! } });
    const year = new Date().getFullYear();
    const number = `DEV-${year}-${String(count + 1).padStart(3, '0')}`;

    const devisItems = (items || []).map((item: { description: string; quantity: number; unitPrice: number }) => ({
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.unitPrice || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const totalHT = devisItems.reduce((s: number, i: { total: number }) => s + i.total, 0);
    const rate = tvaRate || 20;
    const totalTTC = totalHT * (1 + rate / 100);

    const devis = await prisma.devis.create({
      data: {
        number,
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        clientAddress: clientAddress || null,
        subject,
        tvaRate: rate,
        totalHT,
        totalTTC,
        validUntil: validUntil || null,
        notes: notes || null,
        restaurantId: req.restaurantId!,
        items: { create: devisItems },
      },
      include: { items: true },
    });

    res.status(201).json(devis);
  } catch (error: unknown) {
    console.error('Devis create error:', error);
    res.status(500).json({ error: 'Erreur création devis' });
  }
});

// PUT update devis
devisRouter.put('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const existing = await prisma.devis.findFirst({ where: { id, restaurantId: req.restaurantId! } });
    if (!existing) return res.status(404).json({ error: 'Devis non trouvé' });

    const { clientName, clientEmail, clientPhone, clientAddress, subject, status, tvaRate, validUntil, notes, items } = req.body;

    // Recalculate totals if items provided
    let totalHT = existing.totalHT;
    let totalTTC = existing.totalTTC;

    if (items) {
      await prisma.devisItem.deleteMany({ where: { devisId: id } });
      const devisItems = items.map((item: { description: string; quantity: number; unitPrice: number }) => ({
        devisId: id,
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        total: (item.quantity || 1) * (item.unitPrice || 0),
      }));
      await prisma.devisItem.createMany({ data: devisItems });
      totalHT = devisItems.reduce((s: number, i: { total: number }) => s + i.total, 0);
      const rate = tvaRate || existing.tvaRate;
      totalTTC = totalHT * (1 + rate / 100);
    }

    const devis = await prisma.devis.update({
      where: { id },
      data: {
        clientName: clientName || existing.clientName,
        clientEmail: clientEmail !== undefined ? clientEmail : existing.clientEmail,
        clientPhone: clientPhone !== undefined ? clientPhone : existing.clientPhone,
        clientAddress: clientAddress !== undefined ? clientAddress : existing.clientAddress,
        subject: subject || existing.subject,
        status: status || existing.status,
        tvaRate: tvaRate || existing.tvaRate,
        totalHT,
        totalTTC,
        validUntil: validUntil !== undefined ? validUntil : existing.validUntil,
        notes: notes !== undefined ? notes : existing.notes,
      },
      include: { items: true },
    });

    res.json(devis);
  } catch {
    res.status(500).json({ error: 'Erreur mise à jour devis' });
  }
});

// DELETE devis
devisRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const existing = await prisma.devis.findFirst({ where: { id, restaurantId: req.restaurantId! } });
    if (!existing) return res.status(404).json({ error: 'Devis non trouvé' });
    await prisma.devis.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erreur suppression devis' });
  }
});
