// ── WhatsApp Order Templates ────────────────────────────────────────────────
// Pre-formatted messages for supplier communications via WhatsApp

export interface WhatsAppOrderItem {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit?: number;
}

export interface WhatsAppTemplateParams {
  supplierName: string;
  restaurantName: string;
  items: WhatsAppOrderItem[];
  deliveryDate?: string;
  totalHT?: number;
  issueDescription?: string;
  deliveryDateForComplaint?: string;
}

// ── Format helpers ──────────────────────────────────────────────────────────

function fmtEuro(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso?: string): string {
  if (!iso) return new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function buildItemsList(items: WhatsAppOrderItem[]): string {
  return items
    .filter((item) => item.name.trim())
    .map((item) => {
      const price = item.pricePerUnit ? ` (${fmtEuro(item.pricePerUnit)} EUR/${item.unit})` : '';
      return `- ${item.name} : ${item.quantity} ${item.unit}${price}`;
    })
    .join('\n');
}

function buildItemsListSimple(items: WhatsAppOrderItem[]): string {
  return items
    .filter((item) => item.name.trim())
    .map((item) => `- ${item.name} (${item.unit})`)
    .join('\n');
}

// ── Template: Standard Order ────────────────────────────────────────────────

export function standardOrderMessage(params: WhatsAppTemplateParams): string {
  const deliveryLine = params.deliveryDate
    ? `Livraison souhaitee le ${fmtDate(params.deliveryDate)}`
    : `Livraison souhaitee des que possible`;
  const totalLine = params.totalHT
    ? `\nTotal estime: ${fmtEuro(params.totalHT)} EUR HT`
    : '';

  return [
    `Bonjour ${params.supplierName},`,
    '',
    `Voici ma commande pour ${deliveryLine.toLowerCase()}:`,
    '',
    buildItemsList(params.items),
    totalLine,
    '',
    `Merci de confirmer la reception de cette commande.`,
    '',
    `Cordialement,`,
    params.restaurantName,
  ].join('\n');
}

// ── Template: Urgent Order ──────────────────────────────────────────────────

export function urgentOrderMessage(params: WhatsAppTemplateParams): string {
  const deliveryLine = params.deliveryDate
    ? `Livraison URGENTE le ${fmtDate(params.deliveryDate)}`
    : `Livraison URGENTE aujourd'hui si possible`;
  const totalLine = params.totalHT
    ? `\nTotal estime: ${fmtEuro(params.totalHT)} EUR HT`
    : '';

  return [
    `URGENT - Commande prioritaire`,
    '',
    `Bonjour ${params.supplierName},`,
    '',
    `J'ai besoin en urgence des articles suivants (${deliveryLine.toLowerCase()}):`,
    '',
    buildItemsList(params.items),
    totalLine,
    '',
    `Merci de confirmer au plus vite.`,
    '',
    `Cordialement,`,
    params.restaurantName,
  ].join('\n');
}

// ── Template: Price Inquiry ─────────────────────────────────────────────────

export function priceInquiryMessage(params: Pick<WhatsAppTemplateParams, 'supplierName' | 'restaurantName' | 'items'>): string {
  return [
    `Bonjour ${params.supplierName},`,
    '',
    `Pourriez-vous me communiquer vos prix actuels pour:`,
    '',
    buildItemsListSimple(params.items),
    '',
    `Merci de me communiquer vos tarifs HT et les conditions de livraison.`,
    '',
    `Cordialement,`,
    params.restaurantName,
  ].join('\n');
}

// ── Template: Bulk Price Inquiry (Mercuriale) ───────────────────────────────

export function bulkPriceInquiryMessage(params: { supplierName: string; restaurantName: string; ingredientNames: string[] }): string {
  const list = params.ingredientNames.map((name) => `- ${name}`).join('\n');
  return [
    `Bonjour ${params.supplierName},`,
    '',
    `Merci de me communiquer vos prix pour:`,
    '',
    list,
    '',
    `Tarifs HT souhaites, avec conditions de livraison et delai.`,
    '',
    `Cordialement,`,
    params.restaurantName,
  ].join('\n');
}

// ── Template: Complaint ─────────────────────────────────────────────────────

export function complaintMessage(params: Pick<WhatsAppTemplateParams, 'supplierName' | 'restaurantName' | 'deliveryDateForComplaint' | 'issueDescription'>): string {
  const dateLine = params.deliveryDateForComplaint
    ? fmtDate(params.deliveryDateForComplaint)
    : "la derniere livraison";
  return [
    `Bonjour ${params.supplierName},`,
    '',
    `Suite a la livraison du ${dateLine}, j'ai constate:`,
    '',
    params.issueDescription || '[Description du probleme]',
    '',
    `Merci de me recontacter rapidement pour trouver une solution.`,
    '',
    `Cordialement,`,
    params.restaurantName,
  ].join('\n');
}

// ── Template: Reorder (same items as last order) ────────────────────────────

export function reorderMessage(params: WhatsAppTemplateParams & { originalDate: string }): string {
  const totalLine = params.totalHT
    ? `\nTotal estime: ${fmtEuro(params.totalHT)} EUR HT`
    : '';

  return [
    `Bonjour ${params.supplierName},`,
    '',
    `Je souhaite renouveler ma commande du ${fmtDate(params.originalDate)}:`,
    '',
    buildItemsList(params.items),
    totalLine,
    '',
    `Merci de confirmer la disponibilite et le delai de livraison.`,
    '',
    `Cordialement,`,
    params.restaurantName,
  ].join('\n');
}

// ── WhatsApp URL builder ────────────────────────────────────────────────────

export function cleanPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/[\s+\-()]/g, '');
}

export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string {
  const encoded = encodeURIComponent(message);
  const clean = cleanPhoneNumber(phone);
  if (clean) {
    return `https://wa.me/${clean}?text=${encoded}`;
  }
  return `https://web.whatsapp.com/send?text=${encoded}`;
}

export function openWhatsApp(phone: string | null | undefined, message: string): void {
  const url = buildWhatsAppUrl(phone, message);
  window.open(url, '_blank');
}

// ── Bulk WhatsApp: open multiple messages sequentially ──────────────────────

export interface BulkWhatsAppOrder {
  supplierName: string;
  phone: string | null | undefined;
  message: string;
}

export function openBulkWhatsApp(
  orders: BulkWhatsAppOrder[],
  onProgress: (sent: number, total: number) => void,
  onComplete: () => void,
  delayMs: number = 1500,
): () => void {
  let cancelled = false;
  let current = 0;

  function sendNext() {
    if (cancelled || current >= orders.length) {
      if (!cancelled) onComplete();
      return;
    }
    const order = orders[current];
    openWhatsApp(order.phone, order.message);
    current++;
    onProgress(current, orders.length);
    if (current < orders.length) {
      setTimeout(sendNext, delayMs);
    } else {
      onComplete();
    }
  }

  sendNext();

  // Return cancel function
  return () => { cancelled = true; };
}

// ── Order confirmation status types ─────────────────────────────────────────

export type WhatsAppConfirmationStatus = 'envoyee' | 'vue' | 'confirmee' | 'non_confirmee';

export interface WhatsAppOrderTracking {
  orderId: number;
  supplierName: string;
  sentAt: string; // ISO date
  status: WhatsAppConfirmationStatus;
  confirmedAt?: string;
}

export function getConfirmationStatusConfig(status: WhatsAppConfirmationStatus): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'envoyee':
      return {
        label: 'Envoyee',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
      };
    case 'vue':
      return {
        label: 'Vue (estimee)',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
      };
    case 'confirmee':
      return {
        label: 'Confirmee',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
      };
    case 'non_confirmee':
      return {
        label: 'Non confirmee (24h+)',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
      };
  }
}

// Check if an order needs a reminder (sent > 24h ago, not confirmed)
export function needsReminder(tracking: WhatsAppOrderTracking): boolean {
  if (tracking.status === 'confirmee') return false;
  const sentDate = new Date(tracking.sentAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - sentDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff >= 24;
}

// Estimate "vue" status: after 2 hours, assume message was seen
export function estimateViewStatus(tracking: WhatsAppOrderTracking): WhatsAppConfirmationStatus {
  if (tracking.status === 'confirmee') return 'confirmee';
  const sentDate = new Date(tracking.sentAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - sentDate.getTime()) / (1000 * 60 * 60);
  if (hoursDiff >= 24) return 'non_confirmee';
  if (hoursDiff >= 2) return 'vue';
  return 'envoyee';
}
