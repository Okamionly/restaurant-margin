import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const invoicesRouter = Router();

/* ─── In-memory storage ─── */

interface InvoiceItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  ingredientId?: number | null;
}

interface Invoice {
  id: number;
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
  status: string;
  items: InvoiceItem[];
  createdAt: string;
}

let invoices: Invoice[] = [];
let nextId = 1;
let nextItemId = 1;

/* ─── GET /api/invoices ─── */
invoicesRouter.get('/', async (_req: AuthRequest, res: Response) => {
  try {
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

    const invoiceItems: InvoiceItem[] = (items || []).map((item: any) => ({
      id: nextItemId++,
      productName: item.productName || '',
      quantity: item.quantity || 0,
      unit: item.unit || '',
      unitPrice: item.unitPrice || 0,
      total: item.total || 0,
      ingredientId: item.ingredientId || null,
    }));

    const invoice: Invoice = {
      id: nextId++,
      supplierName,
      invoiceNumber,
      invoiceDate: invoiceDate || new Date().toISOString().slice(0, 10),
      totalAmount: totalAmount || invoiceItems.reduce((s, i) => s + i.total, 0),
      status: 'pending',
      items: invoiceItems,
      createdAt: new Date().toISOString(),
    };

    invoices.push(invoice);
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

    const idx = invoices.findIndex(inv => inv.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Facture non trouvée' });
      return;
    }
    invoices.splice(idx, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
  }
});

/* ─── POST /api/invoices/:id/apply ─── */
invoicesRouter.post('/:id/apply', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      res.status(404).json({ error: 'Facture non trouvée' });
      return;
    }

    const { matches } = req.body;
    // matches is an array of { invoiceItemId, ingredientId, newPrice }
    // In a real app this would update ingredient prices in the DB
    // For now, just mark the invoice as applied
    invoice.status = 'applied';

    res.json({ success: true, applied: matches?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'application des prix' });
  }
});
