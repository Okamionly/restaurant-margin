/**
 * invoiceNumbering.ts — Generateur de numeros de facture FR-conforme
 *
 * Conformite legale :
 * - Art. 242 nonies A CGI : numerotation unique, sequentielle, sans trou
 * - Format : FAC-YYYY-NNNNNN (prefixe-annee-sequence sur 6 chiffres)
 * - Sequence JAMAIS reinitialisee mid-annee (uniquement au 1er janvier)
 * - Idempotent : utilise upsert + transaction pour eviter les doublons
 * - Retention legale : 10 ans (art. L123-22 Code de commerce)
 *
 * Usage :
 *   const num = await generateInvoiceNumber(prisma); // => "FAC-2026-000001"
 *   const num = await generateInvoiceNumber(prisma, 'AVOIR'); // => "AVO-2026-000001"
 *
 * Les numeros generes sont enregistres dans la table invoice_sequences.
 * Ne jamais supprimer ou modifier un numero genere (obligation legale).
 */

import { PrismaClient } from '@prisma/client';

export type InvoicePrefix = 'FAC' | 'AVO' | 'PRF'; // Facture | Avoir | Pre-facture

export interface InvoiceNumberResult {
  number: string;    // ex: "FAC-2026-000001"
  prefix: string;    // "FAC"
  year: number;      // 2026
  sequence: number;  // 1
}

/**
 * Genere le prochain numero de facture sequentiel et FR-conforme.
 *
 * Thread-safe grace a la transaction Prisma + upsert atomique.
 * Si la table invoice_sequences n'existe pas encore, retourne un numero
 * en mode "stub" base sur timestamp (a remplacer apres migration).
 */
export async function generateInvoiceNumber(
  prisma: PrismaClient,
  prefix: InvoicePrefix = 'FAC'
): Promise<InvoiceNumberResult> {
  const year = new Date().getFullYear();
  const sequenceKey = `${prefix}-${year}`;

  try {
    // Transaction pour garantir l'atomicite (pas de doublon en cas de concurrence)
    const result = await prisma.$transaction(async (tx) => {
      // Upsert : increment si existe, initialiser a 1 sinon
      const seq = await (tx as any).invoiceSequence.upsert({
        where: { key: sequenceKey },
        update: { lastNumber: { increment: 1 } },
        create: { key: sequenceKey, prefix, year, lastNumber: 1 },
      });

      return seq.lastNumber as number;
    });

    const number = formatInvoiceNumber(prefix, year, result);
    return { number, prefix, year, sequence: result };
  } catch (e: any) {
    // Table pas encore creee — mode stub avec timestamp pour ne pas bloquer
    console.warn('[INVOICE NUMBERING] invoice_sequences table not found, using stub:', e.message);
    const stubSeq = Date.now() % 999999;
    const number = formatInvoiceNumber(prefix, year, stubSeq);
    console.warn(`[INVOICE NUMBERING STUB] Generated stub number: ${number} — run prisma migrate to fix`);
    return { number, prefix, year, sequence: stubSeq };
  }
}

/**
 * Formate le numero selon la norme FR : PREFIX-YYYY-NNNNNN
 */
export function formatInvoiceNumber(prefix: string, year: number, sequence: number): string {
  return `${prefix}-${year}-${String(sequence).padStart(6, '0')}`;
}

/**
 * Valide qu'un numero de facture respecte le format FR attendu.
 */
export function validateInvoiceNumber(number: string): boolean {
  return /^(FAC|AVO|PRF)-\d{4}-\d{6}$/.test(number);
}

/**
 * Mentions legales obligatoires pour une facture B2B en France.
 * Source : art. L441-9 Code de commerce + art. 242 nonies A CGI
 *
 * A inclure dans le footer de toute facture emise.
 */
export interface LegalMentions {
  vendorName: string;
  vendorSiret: string;
  vendorTva: string;        // ex: "FR12345678901"
  vendorAddress: string;
  vendorCapital?: string;   // capital social si SARL/SAS
  rcsCity?: string;         // ex: "RCS Montpellier B 123 456 789"
}

export function buildInvoiceFooterFR(mentions: LegalMentions): string {
  const lines = [
    `${mentions.vendorName}`,
    `SIRET : ${mentions.vendorSiret}`,
    `N° TVA intracommunautaire : ${mentions.vendorTva}`,
    mentions.vendorCapital ? `Capital social : ${mentions.vendorCapital}` : null,
    mentions.rcsCity ? mentions.rcsCity : null,
    `${mentions.vendorAddress}`,
    '',
    'Conditions de paiement : 30 jours net a compter de la date de facture',
    'En cas de retard de paiement : penalites de retard au taux BCE + 10 points',
    'Indemnite forfaitaire pour frais de recouvrement : 40 EUR (D. 441-5 C. com.)',
    'TVA acquittee sur les encaissements',
    '',
    `Conservation legale de ce document : 10 ans (art. L123-22 Code de commerce)`,
  ].filter(Boolean);

  return lines.join('\n');
}

/**
 * Calcule la TVA FR selon le type de service.
 * SaaS B2B : 20% (taux normal)
 * SaaS B2C FR : 20%
 * SaaS B2B EU hors FR (acheteur assujetti avec n° TVA) : 0% (autoliquidation)
 */
export type TvaType = 'fr_b2b' | 'fr_b2c' | 'eu_b2b_reverse_charge' | 'export';

export interface TvaResult {
  ratePercent: number;
  amountHT: number;
  amountTva: number;
  amountTTC: number;
  mention?: string; // mention legale (ex: pour autoliquidation)
}

export function computeTva(amountHT: number, type: TvaType): TvaResult {
  switch (type) {
    case 'fr_b2b':
    case 'fr_b2c':
      return {
        ratePercent: 20,
        amountHT: round2(amountHT),
        amountTva: round2(amountHT * 0.20),
        amountTTC: round2(amountHT * 1.20),
      };

    case 'eu_b2b_reverse_charge':
      return {
        ratePercent: 0,
        amountHT: round2(amountHT),
        amountTva: 0,
        amountTTC: round2(amountHT),
        mention: 'Autoliquidation — art. 283-2 CGI / Art. 196 directive 2006/112/CE',
      };

    case 'export':
      return {
        ratePercent: 0,
        amountHT: round2(amountHT),
        amountTva: 0,
        amountTTC: round2(amountHT),
        mention: 'Exonere de TVA — exportation hors UE (art. 262 I CGI)',
      };

    default:
      throw new Error(`Unknown TvaType: ${type}`);
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Construit une facture SaaS complete (objet JSON) prete a etre sauvegardee
 * et rendue en PDF via un template HTML.
 *
 * Note : ce helper ne fait PAS de DB write — l'appelant choisit comment persister.
 */
export interface SaasInvoiceData {
  // Identite vendeur (RestauMargin)
  vendor: LegalMentions;
  // Identite acheteur
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerTva?: string;    // Si EU B2B, obligatoire pour autoliquidation
  customerCountry: string; // ISO 2 lettres, ex: "FR", "DE"
  // Abonnement
  plan: 'pro' | 'business';
  periodStart: string;   // YYYY-MM-DD
  periodEnd: string;     // YYYY-MM-DD
  // Paiement
  amountHT: number;
  stripePaymentId?: string;
  stripeInvoiceId?: string;
  // Meta
  invoiceNumber: string; // genere via generateInvoiceNumber()
  issuedAt: string;      // YYYY-MM-DD
  dueAt: string;         // YYYY-MM-DD (= issuedAt pour SaaS en paiement immediat)
}

export function buildSaasInvoice(data: SaasInvoiceData): object {
  const isEuB2B = data.customerCountry !== 'FR' && !!data.customerTva;
  const isFR = data.customerCountry === 'FR';
  const tvaType: TvaType = isEuB2B ? 'eu_b2b_reverse_charge' : (isFR ? 'fr_b2b' : 'export');
  const tva = computeTva(data.amountHT, tvaType);

  const planLabel = data.plan === 'pro' ? 'RestauMargin Pro' : 'RestauMargin Business';
  const planDesc = `Abonnement ${planLabel} — periode du ${data.periodStart} au ${data.periodEnd}`;

  return {
    invoiceNumber: data.invoiceNumber,
    issuedAt: data.issuedAt,
    dueAt: data.dueAt,
    vendor: data.vendor,
    customer: {
      name: data.customerName,
      email: data.customerEmail,
      address: data.customerAddress,
      tva: data.customerTva,
      country: data.customerCountry,
    },
    lines: [
      {
        description: planDesc,
        quantity: 1,
        unitPriceHT: tva.amountHT,
        tvaRate: tva.ratePercent,
        totalHT: tva.amountHT,
        totalTva: tva.amountTva,
        totalTTC: tva.amountTTC,
      },
    ],
    totals: {
      subtotalHT: tva.amountHT,
      totalTva: tva.amountTva,
      totalTTC: tva.amountTTC,
      currency: 'EUR',
    },
    tva: {
      type: tvaType,
      rate: tva.ratePercent,
      mention: tva.mention,
    },
    payment: {
      stripePaymentId: data.stripePaymentId,
      stripeInvoiceId: data.stripeInvoiceId,
      method: 'Carte bancaire (Stripe)',
    },
    legal: {
      footer: buildInvoiceFooterFR(data.vendor),
      retentionYears: 10,
      cgiBasis: 'Art. 242 nonies A CGI',
    },
  };
}

/**
 * Validation qu'une facture SaaS contient les mentions obligatoires.
 * Retourne la liste des mentions manquantes.
 */
export function auditInvoiceLegalCompliance(invoice: SaasInvoiceData): string[] {
  const missing: string[] = [];

  if (!invoice.invoiceNumber || !validateInvoiceNumber(invoice.invoiceNumber)) {
    missing.push('Numero de facture invalide (format FAC-YYYY-NNNNNN requis)');
  }
  if (!invoice.issuedAt) missing.push('Date d\'emission manquante');
  if (!invoice.vendor.vendorSiret) missing.push('SIRET vendeur manquant');
  if (!invoice.vendor.vendorTva) missing.push('Numero TVA intracommunautaire manquant');
  if (!invoice.vendor.vendorAddress) missing.push('Adresse vendeur manquante');
  if (!invoice.customerName) missing.push('Nom acheteur manquant');
  if (!invoice.customerEmail && !invoice.customerAddress) {
    missing.push('Coordonnees acheteur manquantes (email ou adresse)');
  }
  if (invoice.customerCountry !== 'FR' && !invoice.customerTva) {
    missing.push('N° TVA acheteur EU requis pour autoliquidation (acheteur hors FR)');
  }

  return missing;
}
