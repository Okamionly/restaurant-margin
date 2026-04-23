/**
 * FR-compliant invoice numbering (art. 242 nonies A CGI)
 *
 * Génère des numéros de facture séquentiels, atomiques, sans trou,
 * au format FAC-YYYY-NNNNNN (ex: FAC-2026-000042).
 *
 * Usage :
 *   const invoiceNumber = await generateInvoiceNumber(); // "FAC-2026-000042"
 *   const tva = computeTva({ amountHT: 29_00, country: 'FR' }); // { rate, amount, label }
 *   const footer = buildInvoiceFooterFR();
 */

import { prisma } from '../middleware';

/**
 * Génère le prochain numéro de facture pour l'année en cours.
 * Utilise une transaction atomique pour éviter les conflits concurrents.
 */
export async function generateInvoiceNumber(year?: number): Promise<string> {
  const y = year ?? new Date().getFullYear();

  const [row] = (await prisma.$queryRawUnsafe(
    `INSERT INTO invoice_sequences (year, last_number, updated_at)
     VALUES ($1, 1, NOW())
     ON CONFLICT (year) DO UPDATE
       SET last_number = invoice_sequences.last_number + 1, updated_at = NOW()
     RETURNING last_number`,
    y
  )) as Array<{ last_number: number }>;

  const seq = row.last_number;
  return `FAC-${y}-${String(seq).padStart(6, '0')}`;
}

/**
 * Calcule la TVA selon le pays de facturation.
 * - FR : 20% standard
 * - EU B2B avec VAT ID valide : autoliquidation (0%)
 * - Export hors UE : 0% (export)
 * - EU B2C : 20% FR (origine)
 */
export type TvaContext = {
  amountHT: number; // en centimes
  country: string; // ISO 2 (FR, DE, ES, US...)
  vatId?: string | null;
  isB2b?: boolean;
};

export type TvaResult = {
  rate: number; // 0.20, 0, etc.
  amount: number; // en centimes
  amountTTC: number; // en centimes
  label: string; // "TVA 20%", "Autoliquidation", "Exportation"
};

const EU_COUNTRIES = [
  'FR', 'DE', 'ES', 'IT', 'BE', 'NL', 'LU', 'AT', 'PT', 'IE', 'DK', 'FI', 'SE',
  'EL', 'GR', 'CY', 'MT', 'SI', 'SK', 'CZ', 'PL', 'HU', 'RO', 'BG', 'HR', 'EE', 'LV', 'LT',
];

export function computeTva(ctx: TvaContext): TvaResult {
  const { amountHT, country, vatId, isB2b } = ctx;
  const ccode = country.toUpperCase();

  // Hors UE → export (pas de TVA)
  if (!EU_COUNTRIES.includes(ccode)) {
    return { rate: 0, amount: 0, amountTTC: amountHT, label: 'Exportation hors UE (art. 262-I CGI)' };
  }

  // EU hors FR + B2B avec VAT ID → autoliquidation
  if (ccode !== 'FR' && isB2b && vatId) {
    return { rate: 0, amount: 0, amountTTC: amountHT, label: `Autoliquidation par le preneur (art. 283-2 CGI, VAT ID: ${vatId})` };
  }

  // FR ou EU B2C → TVA 20%
  const rate = 0.20;
  const amount = Math.round(amountHT * rate);
  return { rate, amount, amountTTC: amountHT + amount, label: 'TVA 20%' };
}

/**
 * Footer légal obligatoire pour factures FR.
 * À concaténer en bas de chaque facture PDF / HTML.
 */
export function buildInvoiceFooterFR(options?: {
  siret?: string;
  vatId?: string;
  address?: string;
}): string {
  const siret = options?.siret ?? '[SIRET à compléter]';
  const vatId = options?.vatId ?? '[Numéro TVA à compléter]';
  const address = options?.address ?? '[Adresse siège à compléter]';
  return [
    `RestauMargin — ${address}`,
    `SIRET : ${siret} · TVA intracommunautaire : ${vatId}`,
    `Facture payable à réception, sans escompte. Pénalités de retard : 3 fois le taux d'intérêt légal.`,
    `Indemnité forfaitaire pour frais de recouvrement : 40€ (art. L441-10 Code de commerce).`,
    `Document conservé 10 ans conformément à l'art. L123-22 Code de commerce.`,
    `Numérotation séquentielle conforme à l'art. 242 nonies A CGI.`,
  ].join('\n');
}

/**
 * Structure complète d'une facture SaaS pour PDF ou HTML.
 */
export type SaasInvoice = {
  number: string;
  issuedAt: Date;
  customer: { name: string; email: string; address?: string; country: string; vatId?: string };
  lines: Array<{ label: string; quantity: number; unitPriceHT: number; totalHT: number }>;
  totals: { ht: number; tva: number; ttc: number };
  tvaLabel: string;
  footer: string;
};

export async function buildSaasInvoice(params: {
  customer: SaasInvoice['customer'];
  lines: Array<{ label: string; quantity: number; unitPriceHT: number }>;
  isB2b?: boolean;
  year?: number;
  sellerSiret?: string;
  sellerVatId?: string;
  sellerAddress?: string;
}): Promise<SaasInvoice> {
  const lines = params.lines.map((l) => ({ ...l, totalHT: l.unitPriceHT * l.quantity }));
  const totalHT = lines.reduce((sum, l) => sum + l.totalHT, 0);
  const tva = computeTva({
    amountHT: totalHT,
    country: params.customer.country,
    vatId: params.customer.vatId,
    isB2b: params.isB2b,
  });

  return {
    number: await generateInvoiceNumber(params.year),
    issuedAt: new Date(),
    customer: params.customer,
    lines,
    totals: { ht: totalHT, tva: tva.amount, ttc: tva.amountTTC },
    tvaLabel: tva.label,
    footer: buildInvoiceFooterFR({
      siret: params.sellerSiret,
      vatId: params.sellerVatId,
      address: params.sellerAddress,
    }),
  };
}
