/**
 * @file api-lib/schemas/invoices/index.ts
 * Zod schemas for invoice endpoints.
 */
import { z } from 'zod';

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description requise'),
  quantity: z.number().min(0, 'Quantité doit être positive'),
  unitPrice: z.number().min(0, 'Prix unitaire doit être positif'),
  vatRate: z.number().min(0).max(100, 'TVA entre 0 et 100%'),
});

export const createInvoiceRequestSchema = z.object({
  clientName: z.string().min(1, 'Nom client requis').max(255),
  clientEmail: z.string().email('Email invalide').optional(),
  vatRate: z.number().min(0).max(100),
  items: z.array(invoiceItemSchema).min(1, 'Au moins un article requis'),
});

export const invoiceResponseSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  clientName: z.string(),
  clientEmail: z.string().nullable().optional(),
  status: z.enum(['draft', 'sent', 'paid', 'cancelled']),
  totalHT: z.number(),
  totalTTC: z.number(),
  vatRate: z.number(),
  restaurantId: z.number().int(),
  createdAt: z.string(),
});

export const INVOICES_IDEMPOTENCY = {
  create: 'none',
} as const;
