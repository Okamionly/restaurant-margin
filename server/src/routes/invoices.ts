import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const invoicesRouter = Router();

/* ─── GET /api/invoices ─── */
invoicesRouter.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
});

/* ─── POST /api/invoices ─── */
invoicesRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { supplierName, invoiceNumber, invoiceDate, totalAmount, items } = req.body;

    if (!supplierName || !invoiceNumber) {
      res.status(400).json({ error: 'supplierName et invoiceNumber sont requis' });
      return;
    }

    const invoiceItems = (items || []).map((item: any) => ({
      productName: item.productName || '',
      quantity: item.quantity || 0,
      unit: item.unit || '',
      unitPrice: item.unitPrice || 0,
      total: item.total || 0,
      ingredientId: item.ingredientId || null,
    }));

    const computedTotal = totalAmount || invoiceItems.reduce((s: number, i: any) => s + i.total, 0);

    const invoice = await prisma.invoice.create({
      data: {
        supplierName,
        invoiceNumber,
        invoiceDate: invoiceDate || new Date().toISOString().slice(0, 10),
        totalAmount: computedTotal,
        status: 'pending',
        items: {
          create: invoiceItems,
        },
      },
      include: { items: true },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture' });
  }
});

/* ─── DELETE /api/invoices/:id ─── */
invoicesRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }

    await prisma.invoice.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Facture non trouvée' });
      return;
    }
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
  }
});

/* ─── POST /api/invoices/:id/apply ─── */
invoicesRouter.post('/:id/apply', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      res.status(404).json({ error: 'Facture non trouvée' });
      return;
    }

    const { matches } = req.body;

    await prisma.invoice.update({
      where: { id },
      data: { status: 'applied' },
    });

    res.json({ success: true, applied: matches?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'application des prix' });
  }
});
