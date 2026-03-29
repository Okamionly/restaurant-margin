import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const marketplaceRouter = Router();

// GET /orders — list orders for restaurant
marketplaceRouter.get('/orders', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.marketplaceOrder.findMany({
      where: { restaurantId: req.restaurantId! },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Erreur récupération commandes marketplace' });
  }
});

// GET /orders/summary — totals by status, total spent
marketplaceRouter.get('/orders/summary', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.marketplaceOrder.findMany({
      where: { restaurantId: req.restaurantId! },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.totalHT, 0);

    const byStatus: Record<string, number> = {};
    orders.forEach(o => {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    });

    res.json({ totalOrders, totalSpent, byStatus });
  } catch {
    res.status(500).json({ error: 'Erreur récupération résumé marketplace' });
  }
});

// POST /orders — create order from cart items
marketplaceRouter.post('/orders', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { supplierName, items, notes } = req.body;

    if (!supplierName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Fournisseur et articles requis' });
    }

    const orderItems = items.map((item: { productName: string; quantity: number; unit: string; unitPrice: number }) => ({
      productName: item.productName || '',
      quantity: item.quantity || 1,
      unit: item.unit || '',
      unitPrice: item.unitPrice || 0,
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const totalHT = orderItems.reduce((sum: number, i: { total: number }) => sum + i.total, 0);

    const order = await prisma.marketplaceOrder.create({
      data: {
        supplierName,
        totalHT,
        notes: notes || null,
        restaurantId: req.restaurantId!,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch {
    res.status(500).json({ error: 'Erreur création commande marketplace' });
  }
});

// PUT /orders/:id — update status
marketplaceRouter.put('/orders/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status, notes } = req.body;

    const existing = await prisma.marketplaceOrder.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });

    const order = await prisma.marketplaceOrder.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: { items: true },
    });

    res.json(order);
  } catch {
    res.status(500).json({ error: 'Erreur mise à jour commande marketplace' });
  }
});

// DELETE /orders/:id — delete order
marketplaceRouter.delete('/orders/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.marketplaceOrder.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Commande non trouvée' });

    await prisma.marketplaceOrder.delete({ where: { id } });
    res.json({ message: 'Commande supprimée' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression commande marketplace' });
  }
});
