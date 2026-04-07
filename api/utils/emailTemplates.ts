// ============================================================
// RestauMargin — Templates emails professionnels
// ============================================================

// ---------- Types ----------

export interface OrderEmailData {
  restaurantName: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  orderNumber: string;
  date: string;
  supplierName: string;
  supplierAddress?: string;
  items: { name: string; quantity: number; unit: string; unitPrice: number }[];
  notes?: string;
}

export interface QuoteEmailData {
  restaurantName: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  quoteNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  clientAddress?: string;
  clientEmail?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  tvaRate?: number; // default 20
  depositRate?: number; // default 30
  signatureName?: string;
}

export interface WelcomeEmailData {
  userName: string;
  dashboardUrl?: string;
}

export interface ReminderEmailData {
  restaurantName: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  restaurantEmail?: string;
  orderNumber: string;
  originalDate: string;
  deliveryDate: string;
  supplierName: string;
  items: { name: string; quantity: number; unit: string; unitPrice: number }[];
}

export interface WeeklyReportData {
  userName: string;
  weekLabel: string; // ex: "24 mars — 30 mars 2026"
  recipesCreated: number;
  ordersCount: number;
  avgFoodCost: number; // percentage
  avgMargin: number; // percentage
  topDishes: { name: string; margin: number }[];
  priceUp: { name: string; change: number }[];
  priceDown: { name: string; change: number }[];
  dashboardUrl?: string;
}

// ---------- Shared helpers ----------

const FONT = "'Segoe UI', Arial, sans-serif";
const TEAL = '#0d9488';
const TEAL_LIGHT = '#06b6d4';
const DARK = '#0f172a';
const MUTED = '#64748b';
const BG_LIGHT = '#f8fafc';
const BORDER = '#e2e8f0';

function wrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:${FONT};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:20px 10px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
${content}
</table>
</td></tr>
</table>
</body>
</html>`;
}

function header(title: string, subtitle?: string): string {
  return `<tr><td style="background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});padding:30px;text-align:center;">
  <h1 style="color:white;font-family:${FONT};margin:0;font-size:24px;">&#127860; RestauMargin</h1>
  ${subtitle ? `<p style="color:rgba(255,255,255,0.8);margin:5px 0 0;font-size:14px;">${subtitle}</p>` : ''}
</td></tr>`;
}

function footer(text?: string): string {
  return `<tr><td style="background:${BG_LIGHT};padding:20px;text-align:center;border-top:1px solid ${BORDER};">
  <p style="color:#94a3b8;font-size:11px;margin:0;">
    ${text || 'Email envoy&eacute; via RestauMargin &mdash; www.restaumargin.fr'}
  </p>
  <p style="color:#94a3b8;font-size:10px;margin:8px 0 0;">
    RestauMargin SAS &mdash; contact@restaumargin.fr<br>
    <a href="https://www.restaumargin.fr/unsubscribe" style="color:#94a3b8;text-decoration:underline;">Se d&eacute;sabonner</a>
    &nbsp;|&nbsp;
    <a href="https://www.restaumargin.fr/privacy" style="color:#94a3b8;text-decoration:underline;">Politique de confidentialit&eacute;</a>
  </p>
</td></tr>`;
}

function esc(s: string | undefined | null): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatEur(n: number): string {
  return n.toFixed(2).replace('.', ',');
}

// ---------- Template A : Commande fournisseur ----------

export function buildOrderEmail(data: OrderEmailData): string {
  const itemsHtml = data.items.map((item, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    const total = item.quantity * item.unitPrice;
    return `<tr style="background:${bg};">
      <td style="padding:10px 15px;border-bottom:1px solid ${BORDER};color:${DARK};">${esc(item.name)}</td>
      <td style="padding:10px;border-bottom:1px solid ${BORDER};text-align:center;color:${DARK};">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid ${BORDER};text-align:center;color:${MUTED};">${esc(item.unit)}</td>
      <td style="padding:10px;border-bottom:1px solid ${BORDER};text-align:right;color:${DARK};">${formatEur(item.unitPrice)} &euro;</td>
      <td style="padding:10px 15px;border-bottom:1px solid ${BORDER};text-align:right;color:${DARK};font-weight:600;">${formatEur(total)} &euro;</td>
    </tr>`;
  }).join('');

  const totalHT = data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const notesSection = data.notes
    ? `<tr><td style="padding:15px 20px;">
        <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;">
          <p style="margin:0;color:#92400e;font-size:13px;font-weight:600;">&#128221; Notes :</p>
          <p style="margin:6px 0 0;color:#78350f;font-size:13px;">${esc(data.notes)}</p>
        </div>
      </td></tr>`
    : '';

  const content = `
${header('RestauMargin', 'Commande fournisseur')}
<tr><td style="background:${BG_LIGHT};padding:20px;border-bottom:1px solid ${BORDER};">
  <table width="100%" cellspacing="0" cellpadding="0"><tr>
    <td style="vertical-align:top;">
      <strong style="color:${DARK};font-size:16px;">${esc(data.restaurantName)}</strong><br>
      ${data.restaurantAddress ? `<span style="color:${MUTED};font-size:13px;">${esc(data.restaurantAddress)}</span><br>` : ''}
      <span style="color:${MUTED};font-size:13px;">
        ${data.restaurantPhone ? `&#128222; ${esc(data.restaurantPhone)}` : ''}
        ${data.restaurantPhone && data.restaurantEmail ? ' | ' : ''}
        ${data.restaurantEmail ? `&#9993;&#65039; ${esc(data.restaurantEmail)}` : ''}
      </span>
    </td>
    <td style="text-align:right;vertical-align:top;">
      <strong style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;">COMMANDE N&deg;</strong><br>
      <span style="color:${TEAL};font-size:20px;font-weight:bold;">${esc(data.orderNumber)}</span><br>
      <span style="color:${MUTED};font-size:13px;">${esc(data.date)}</span>
    </td>
  </tr></table>
</td></tr>

<tr><td style="padding:20px;">
  <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Destinataire</p>
  <strong style="color:${DARK};font-size:16px;">${esc(data.supplierName)}</strong><br>
  ${data.supplierAddress ? `<span style="color:${MUTED};">${esc(data.supplierAddress)}</span>` : ''}
</td></tr>

<tr><td style="padding:0 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
    <thead>
      <tr style="background:${TEAL};">
        <th style="padding:10px 15px;text-align:left;color:white;font-size:13px;font-weight:600;">Produit</th>
        <th style="padding:10px;text-align:center;color:white;font-size:13px;font-weight:600;">Qt&eacute;</th>
        <th style="padding:10px;text-align:center;color:white;font-size:13px;font-weight:600;">Unit&eacute;</th>
        <th style="padding:10px;text-align:right;color:white;font-size:13px;font-weight:600;">P.U. HT</th>
        <th style="padding:10px 15px;text-align:right;color:white;font-size:13px;font-weight:600;">Total HT</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
    <tfoot>
      <tr style="border-top:2px solid ${TEAL};">
        <td colspan="4" style="padding:12px 15px;font-weight:bold;color:${DARK};">TOTAL HT</td>
        <td style="padding:12px 15px;text-align:right;font-weight:bold;color:${TEAL};font-size:18px;">${formatEur(totalHT)} &euro;</td>
      </tr>
    </tfoot>
  </table>
</td></tr>

${notesSection}

${footer('Commande envoy&eacute;e via RestauMargin &mdash; www.restaumargin.fr<br>Merci de confirmer la r&eacute;ception de cette commande.')}`;

  return wrapper(content);
}

// ---------- Template B : Devis client ----------

export function buildQuoteEmail(data: QuoteEmailData): string {
  const tvaRate = data.tvaRate ?? 20;
  const depositRate = data.depositRate ?? 30;

  const itemsHtml = data.items.map((item, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    const total = item.quantity * item.unitPrice;
    return `<tr style="background:${bg};">
      <td style="padding:10px 15px;border-bottom:1px solid ${BORDER};color:${DARK};">${esc(item.description)}</td>
      <td style="padding:10px;border-bottom:1px solid ${BORDER};text-align:center;color:${DARK};">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid ${BORDER};text-align:right;color:${DARK};">${formatEur(item.unitPrice)} &euro;</td>
      <td style="padding:10px 15px;border-bottom:1px solid ${BORDER};text-align:right;color:${DARK};font-weight:600;">${formatEur(total)} &euro;</td>
    </tr>`;
  }).join('');

  const totalHT = data.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const tva = totalHT * tvaRate / 100;
  const totalTTC = totalHT + tva;
  const deposit = totalTTC * depositRate / 100;

  const content = `
${header('RestauMargin', 'Devis')}
<tr><td style="background:${BG_LIGHT};padding:20px;border-bottom:1px solid ${BORDER};">
  <table width="100%" cellspacing="0" cellpadding="0"><tr>
    <td style="vertical-align:top;">
      <strong style="color:${DARK};font-size:16px;">${esc(data.restaurantName)}</strong><br>
      ${data.restaurantAddress ? `<span style="color:${MUTED};font-size:13px;">${esc(data.restaurantAddress)}</span><br>` : ''}
      <span style="color:${MUTED};font-size:13px;">
        ${data.restaurantPhone ? `&#128222; ${esc(data.restaurantPhone)}` : ''}
        ${data.restaurantPhone && data.restaurantEmail ? ' | ' : ''}
        ${data.restaurantEmail ? `&#9993;&#65039; ${esc(data.restaurantEmail)}` : ''}
      </span>
    </td>
    <td style="text-align:right;vertical-align:top;">
      <strong style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;">DEVIS N&deg;</strong><br>
      <span style="color:${TEAL};font-size:20px;font-weight:bold;">${esc(data.quoteNumber)}</span><br>
      <span style="color:${MUTED};font-size:13px;">${esc(data.date)}</span>
    </td>
  </tr></table>
</td></tr>

<tr><td style="padding:20px;">
  <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Client</p>
  <strong style="color:${DARK};font-size:16px;">${esc(data.clientName)}</strong><br>
  ${data.clientAddress ? `<span style="color:${MUTED};">${esc(data.clientAddress)}</span><br>` : ''}
  ${data.clientEmail ? `<span style="color:${MUTED};font-size:13px;">${esc(data.clientEmail)}</span>` : ''}
</td></tr>

<tr><td style="padding:0 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
    <thead>
      <tr style="background:${TEAL};">
        <th style="padding:10px 15px;text-align:left;color:white;font-size:13px;font-weight:600;">Prestation</th>
        <th style="padding:10px;text-align:center;color:white;font-size:13px;font-weight:600;">Qt&eacute;</th>
        <th style="padding:10px;text-align:right;color:white;font-size:13px;font-weight:600;">Prix unit.</th>
        <th style="padding:10px 15px;text-align:right;color:white;font-size:13px;font-weight:600;">Total</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>
</td></tr>

<tr><td style="padding:15px 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
    <tr>
      <td style="padding:8px 0;color:${MUTED};font-size:14px;">Sous-total HT</td>
      <td style="padding:8px 0;text-align:right;color:${DARK};font-size:14px;">${formatEur(totalHT)} &euro;</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:${MUTED};font-size:14px;">TVA (${tvaRate}%)</td>
      <td style="padding:8px 0;text-align:right;color:${DARK};font-size:14px;">${formatEur(tva)} &euro;</td>
    </tr>
    <tr style="border-top:2px solid ${TEAL};">
      <td style="padding:12px 0;font-weight:bold;color:${DARK};font-size:16px;">Total TTC</td>
      <td style="padding:12px 0;text-align:right;font-weight:bold;color:${TEAL};font-size:20px;">${formatEur(totalTTC)} &euro;</td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:0 20px 20px;">
  <div style="background:${BG_LIGHT};border:1px solid ${BORDER};border-radius:8px;padding:16px;">
    <p style="margin:0 0 8px;color:${DARK};font-size:14px;font-weight:600;">Conditions</p>
    <ul style="margin:0;padding-left:18px;color:${MUTED};font-size:13px;line-height:1.8;">
      <li>Devis valable 30 jours &agrave; compter de la date d'&eacute;mission</li>
      <li>Acompte de ${depositRate}% &agrave; la commande : <strong style="color:${DARK};">${formatEur(deposit)} &euro;</strong></li>
      <li>Solde &agrave; r&eacute;ception de la facture</li>
    </ul>
  </div>
</td></tr>

<tr><td style="padding:0 20px 25px;">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="width:50%;vertical-align:top;">
        <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 30px;">Signature client</p>
        <div style="border-bottom:1px solid ${BORDER};width:80%;"></div>
      </td>
      <td style="width:50%;vertical-align:top;text-align:right;">
        <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Pour ${esc(data.restaurantName)}</p>
        ${data.signatureName ? `<p style="color:${DARK};font-size:14px;font-weight:600;margin:0;">${esc(data.signatureName)}</p>` : ''}
      </td>
    </tr>
  </table>
</td></tr>

${footer('Devis g&eacute;n&eacute;r&eacute; via RestauMargin &mdash; www.restaumargin.fr')}`;

  return wrapper(content);
}

// ---------- Template C : Bienvenue ----------

export function buildWelcomeEmail(data: WelcomeEmailData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';

  const step = (icon: string, num: number, title: string, desc: string) => `
    <td style="width:33%;text-align:center;vertical-align:top;padding:10px;">
      <div style="background:${BG_LIGHT};border-radius:12px;padding:20px 12px;">
        <div style="font-size:32px;margin-bottom:8px;">${icon}</div>
        <div style="background:${TEAL};color:white;width:24px;height:24px;border-radius:50%;display:inline-block;line-height:24px;font-size:13px;font-weight:bold;margin-bottom:8px;">${num}</div>
        <p style="color:${DARK};font-size:14px;font-weight:600;margin:0 0 4px;">${title}</p>
        <p style="color:${MUTED};font-size:12px;margin:0;">${desc}</p>
      </div>
    </td>`;

  const content = `
${header('RestauMargin', 'Bienvenue !')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Bienvenue sur RestauMargin ! Votre essai gratuit de <strong style="color:${DARK};">7 jours</strong> est activ&eacute;.
    Voici comment d&eacute;marrer en 3 &eacute;tapes simples :
  </p>
</td></tr>

<tr><td style="padding:10px 15px;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr>
    ${step('&#127869;', 1, 'Ajoutez vos ingr&eacute;dients', 'Importez votre inventaire ou ajoutez-les un par un')}
    ${step('&#129489;&#8205;&#127859;', 2, 'Cr&eacute;ez vos fiches techniques', 'L\'IA vous aide &agrave; les g&eacute;n&eacute;rer')}
    ${step('&#128200;', 3, 'Analysez vos marges', 'Food cost, rentabilit&eacute;, optimisations')}
  </tr></table>
</td></tr>

<tr><td style="padding:25px;text-align:center;">
  <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    Commencer maintenant &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 15px;">
  <div style="background:${BG_LIGHT};border-radius:8px;padding:16px;text-align:center;">
    <p style="color:${MUTED};font-size:13px;margin:0;">
      Une question ? R&eacute;pondez directement &agrave; cet email ou contactez-nous &agrave;
      <a href="mailto:contact@restaumargin.fr" style="color:${TEAL};text-decoration:none;">contact@restaumargin.fr</a>
    </p>
  </div>
</td></tr>

${footer('www.restaumargin.fr')}`;

  return wrapper(content);
}

// ---------- Template D : Relance fournisseur ----------

export function buildReminderEmail(data: ReminderEmailData): string {
  const itemsHtml = data.items.map((item, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    return `<tr style="background:${bg};">
      <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};color:${DARK};font-size:13px;">${esc(item.name)}</td>
      <td style="padding:8px;border-bottom:1px solid ${BORDER};text-align:center;color:${DARK};font-size:13px;">${item.quantity} ${esc(item.unit)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};text-align:right;color:${DARK};font-size:13px;">${formatEur(item.unitPrice)} &euro;</td>
    </tr>`;
  }).join('');

  const content = `
${header('RestauMargin', 'Relance commande')}

<tr><td style="padding:25px;">
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:20px;">
    <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">&#9888;&#65039; Relance &mdash; Commande N&deg;${esc(data.orderNumber)} du ${esc(data.originalDate)}</p>
  </div>

  <p style="color:${DARK};font-size:15px;line-height:1.6;margin:0 0 15px;">
    Bonjour,
  </p>
  <p style="color:${DARK};font-size:15px;line-height:1.6;margin:0 0 15px;">
    Nous n'avons pas re&ccedil;u de confirmation pour la commande ci-dessous.
    Merci de confirmer la livraison pr&eacute;vue le <strong style="color:${TEAL};">${esc(data.deliveryDate)}</strong>.
  </p>

  <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Exp&eacute;diteur</p>
  <strong style="color:${DARK};font-size:15px;">${esc(data.restaurantName)}</strong><br>
  ${data.restaurantPhone ? `<span style="color:${MUTED};font-size:13px;">&#128222; ${esc(data.restaurantPhone)}</span><br>` : ''}
  ${data.restaurantEmail ? `<span style="color:${MUTED};font-size:13px;">&#9993;&#65039; ${esc(data.restaurantEmail)}</span>` : ''}
</td></tr>

<tr><td style="padding:0 20px 20px;">
  <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Rappel de la commande</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
    <thead>
      <tr style="background:${TEAL};">
        <th style="padding:8px 12px;text-align:left;color:white;font-size:12px;font-weight:600;">Produit</th>
        <th style="padding:8px;text-align:center;color:white;font-size:12px;font-weight:600;">Qt&eacute;</th>
        <th style="padding:8px 12px;text-align:right;color:white;font-size:12px;font-weight:600;">P.U. HT</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>
</td></tr>

<tr><td style="padding:0 20px 25px;text-align:center;">
  <p style="color:${MUTED};font-size:14px;margin:0;">
    Merci de votre r&eacute;activit&eacute;.<br>Cordialement, <strong style="color:${DARK};">${esc(data.restaurantName)}</strong>
  </p>
</td></tr>

${footer('Relance envoy&eacute;e via RestauMargin &mdash; www.restaumargin.fr')}`;

  return wrapper(content);
}

// ---------- Template E : Rapport hebdomadaire ----------

export function buildWeeklyReportEmail(data: WeeklyReportData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';

  const kpi = (icon: string, label: string, value: string, sub?: string) => `
    <td style="width:25%;text-align:center;vertical-align:top;padding:8px;">
      <div style="background:${BG_LIGHT};border-radius:10px;padding:16px 8px;">
        <div style="font-size:24px;margin-bottom:4px;">${icon}</div>
        <p style="color:${TEAL};font-size:22px;font-weight:bold;margin:0;">${value}</p>
        <p style="color:${MUTED};font-size:11px;margin:4px 0 0;">${label}</p>
        ${sub ? `<p style="color:${MUTED};font-size:10px;margin:2px 0 0;">${sub}</p>` : ''}
      </div>
    </td>`;

  const topDishesHtml = data.topDishes.slice(0, 3).map((d, i) => {
    const medals = ['&#129351;', '&#129352;', '&#129353;'];
    return `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};font-size:14px;color:${DARK};">${medals[i] || ''} ${esc(d.name)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid ${BORDER};text-align:right;font-size:14px;font-weight:600;color:${TEAL};">${d.margin.toFixed(1)}%</td>
    </tr>`;
  }).join('');

  const priceChangeRow = (item: { name: string; change: number }, isUp: boolean) => {
    const color = isUp ? '#dc2626' : '#16a34a';
    const arrow = isUp ? '&#9650;' : '&#9660;';
    return `<tr>
      <td style="padding:6px 12px;border-bottom:1px solid ${BORDER};font-size:13px;color:${DARK};">${esc(item.name)}</td>
      <td style="padding:6px 12px;border-bottom:1px solid ${BORDER};text-align:right;font-size:13px;font-weight:600;color:${color};">${arrow} ${Math.abs(item.change).toFixed(1)}%</td>
    </tr>`;
  };

  const priceUpHtml = data.priceUp.slice(0, 3).map(p => priceChangeRow(p, true)).join('');
  const priceDownHtml = data.priceDown.slice(0, 3).map(p => priceChangeRow(p, false)).join('');

  const content = `
${header('RestauMargin', 'Rapport hebdomadaire')}

<tr><td style="padding:25px 20px 10px;">
  <p style="font-size:16px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:14px;color:${MUTED};margin:8px 0 0;">Votre semaine du <strong style="color:${DARK};">${esc(data.weekLabel)}</strong> en un coup d'&#339;il :</p>
</td></tr>

<tr><td style="padding:10px 12px;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr>
    ${kpi('&#128203;', 'Recettes cr&eacute;&eacute;es', String(data.recipesCreated))}
    ${kpi('&#128230;', 'Commandes', String(data.ordersCount))}
    ${kpi('&#127828;', 'Food cost moy.', `${data.avgFoodCost.toFixed(1)}%`)}
    ${kpi('&#128176;', 'Marge moyenne', `${data.avgMargin.toFixed(1)}%`)}
  </tr></table>
</td></tr>

${data.topDishes.length > 0 ? `
<tr><td style="padding:15px 20px 5px;">
  <p style="color:${DARK};font-size:14px;font-weight:600;margin:0;">&#127942; Top 3 plats (par marge)</p>
</td></tr>
<tr><td style="padding:0 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
    ${topDishesHtml}
  </table>
</td></tr>` : ''}

${(data.priceUp.length > 0 || data.priceDown.length > 0) ? `
<tr><td style="padding:20px 20px 5px;">
  <p style="color:${DARK};font-size:14px;font-weight:600;margin:0;">&#128200; Mercuriale : &eacute;volutions de prix</p>
</td></tr>
<tr><td style="padding:0 20px;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr>
    ${data.priceUp.length > 0 ? `<td style="width:50%;vertical-align:top;padding-right:8px;">
      <p style="color:#dc2626;font-size:12px;font-weight:600;margin:0 0 6px;">&#9650; Hausses</p>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${priceUpHtml}</table>
    </td>` : ''}
    ${data.priceDown.length > 0 ? `<td style="width:50%;vertical-align:top;padding-left:8px;">
      <p style="color:#16a34a;font-size:12px;font-weight:600;margin:0 0 6px;">&#9660; Baisses</p>
      <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${priceDownHtml}</table>
    </td>` : ''}
  </tr></table>
</td></tr>` : ''}

<tr><td style="padding:25px;text-align:center;">
  <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    Voir le d&eacute;tail &#8594;
  </a>
</td></tr>

${footer('Rapport g&eacute;n&eacute;r&eacute; automatiquement par RestauMargin &mdash; www.restaumargin.fr')}`;

  return wrapper(content);
}

// ---------- Template F : Vérification d'email ----------

export interface VerifyEmailData {
  userName: string;
  verifyUrl: string;
}

export function buildVerifyEmail(data: VerifyEmailData): string {
  const content = `
${header('RestauMargin', 'V&eacute;rification de votre email')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Merci de v&eacute;rifier votre adresse email pour s&eacute;curiser votre compte RestauMargin.
  </p>
</td></tr>

<tr><td style="padding:25px;text-align:center;">
  <a href="${esc(data.verifyUrl)}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    V&eacute;rifier mon email &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 15px;">
  <div style="background:${BG_LIGHT};border-radius:8px;padding:16px;text-align:center;">
    <p style="color:${MUTED};font-size:13px;margin:0;">
      Si vous n'avez pas cr&eacute;&eacute; de compte sur RestauMargin, ignorez simplement cet email.
    </p>
  </div>
</td></tr>

${footer()}`;

  return wrapper(content);
}

// ---------- Template G : Réinitialisation de mot de passe ----------

export interface ResetPasswordData {
  userName: string;
  resetUrl: string;
}

export function buildResetPasswordEmail(data: ResetPasswordData): string {
  const content = `
${header('RestauMargin', 'R&eacute;initialisation de mot de passe')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Vous avez demand&eacute; la r&eacute;initialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
  </p>
</td></tr>

<tr><td style="padding:25px;text-align:center;">
  <a href="${esc(data.resetUrl)}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    R&eacute;initialiser mon mot de passe &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 15px;">
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;text-align:center;">
    <p style="color:#991b1b;font-size:13px;margin:0;font-weight:600;">
      &#9888;&#65039; Ce lien expire dans 1 heure.
    </p>
    <p style="color:#991b1b;font-size:12px;margin:6px 0 0;">
      Si vous n'avez pas demand&eacute; cette r&eacute;initialisation, ignorez cet email. Votre mot de passe ne sera pas modifi&eacute;.
    </p>
  </div>
</td></tr>

${footer()}`;

  return wrapper(content);
}

// ---------- Template H : Code d'activation (après paiement Stripe) ----------

export interface ActivationCodeData {
  planName: string; // 'Professionnel' or 'Business'
  activationCode: string;
}

export function buildActivationCodeEmail(data: ActivationCodeData): string {
  const content = `
${header('RestauMargin', 'Votre code d\'activation')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Merci pour votre abonnement !</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Votre abonnement <strong style="color:${DARK};">${esc(data.planName)}</strong> est confirm&eacute;.
    Utilisez le code ci-dessous pour activer votre compte.
  </p>
</td></tr>

<tr><td style="padding:10px 25px 20px;">
  <div style="background:${BG_LIGHT};border:2px solid ${TEAL};border-radius:12px;padding:24px;text-align:center;">
    <p style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Votre code d'activation</p>
    <p style="font-size:32px;font-weight:bold;color:${TEAL};letter-spacing:3px;margin:0;">${esc(data.activationCode)}</p>
  </div>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <p style="color:${DARK};font-size:14px;font-weight:600;margin:0 0 12px;">Pour commencer :</p>
  <ol style="color:${MUTED};font-size:14px;line-height:2;padding-left:18px;margin:0;">
    <li>Rendez-vous sur <a href="https://www.restaumargin.fr/login" style="color:${TEAL};text-decoration:none;font-weight:600;">www.restaumargin.fr</a></li>
    <li>Cliquez sur &laquo; Cr&eacute;er un compte &raquo;</li>
    <li>Entrez votre code d'activation : <strong style="color:${DARK};">${esc(data.activationCode)}</strong></li>
  </ol>
</td></tr>

<tr><td style="padding:0 25px 25px;text-align:center;">
  <a href="https://www.restaumargin.fr/login" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    Activer mon compte &#8594;
  </a>
</td></tr>

${footer()}`;

  return wrapper(content);
}

// ---------- Template I : Essai expire dans 2 jours ----------

export interface TrialExpiringData {
  userName: string;
  daysLeft: number; // typically 2
  recipesCount: number;
  ingredientsCount: number;
  pricingUrl?: string;
}

export function buildTrialExpiringEmail(data: TrialExpiringData): string {
  const pricingUrl = data.pricingUrl || 'https://www.restaumargin.fr/pricing';

  const content = `
${header('RestauMargin', 'Votre essai se termine bient&ocirc;t')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Votre essai gratuit se termine dans <strong style="color:#dc2626;">${data.daysLeft} jour${data.daysLeft > 1 ? 's' : ''}</strong>.
    Apr&egrave;s cette date, vous perdrez l'acc&egrave;s &agrave; vos donn&eacute;es et votre dashboard.
  </p>
</td></tr>

${(data.recipesCount > 0 || data.ingredientsCount > 0) ? `
<tr><td style="padding:10px 25px;">
  <div style="background:${BG_LIGHT};border-radius:10px;padding:20px;">
    <p style="color:${DARK};font-size:14px;font-weight:600;margin:0 0 12px;">Ce que vous avez accompli :</p>
    <table width="100%" cellspacing="0" cellpadding="0"><tr>
      <td style="text-align:center;padding:8px;">
        <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:0;">${data.ingredientsCount}</p>
        <p style="color:${MUTED};font-size:12px;margin:4px 0 0;">ingr&eacute;dients</p>
      </td>
      <td style="text-align:center;padding:8px;">
        <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:0;">${data.recipesCount}</p>
        <p style="color:${MUTED};font-size:12px;margin:4px 0 0;">fiches techniques</p>
      </td>
    </tr></table>
    <p style="color:${MUTED};font-size:13px;text-align:center;margin:12px 0 0;">
      Tout cela sera perdu si vous ne passez pas &agrave; un plan payant.
    </p>
  </div>
</td></tr>` : ''}

<tr><td style="padding:20px 25px;">
  <p style="color:${DARK};font-size:14px;font-weight:600;margin:0 0 12px;">Nos offres :</p>
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="width:50%;padding:8px;">
        <div style="background:${BG_LIGHT};border:1px solid ${BORDER};border-radius:10px;padding:20px;text-align:center;">
          <p style="color:${DARK};font-size:16px;font-weight:bold;margin:0;">Pro</p>
          <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:8px 0 4px;">29&euro;<span style="font-size:14px;color:${MUTED};font-weight:normal;">/mois</span></p>
          <p style="color:${MUTED};font-size:12px;margin:0;">1 restaurant</p>
        </div>
      </td>
      <td style="width:50%;padding:8px;">
        <div style="background:${BG_LIGHT};border:2px solid ${TEAL};border-radius:10px;padding:20px;text-align:center;">
          <p style="color:${DARK};font-size:16px;font-weight:bold;margin:0;">Business</p>
          <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:8px 0 4px;">79&euro;<span style="font-size:14px;color:${MUTED};font-weight:normal;">/mois</span></p>
          <p style="color:${MUTED};font-size:12px;margin:0;">Multi-sites</p>
        </div>
      </td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:10px 25px 25px;text-align:center;">
  <a href="${pricingUrl}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    Passer au plan payant &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 15px;">
  <div style="background:${BG_LIGHT};border-radius:8px;padding:16px;text-align:center;">
    <p style="color:${MUTED};font-size:13px;margin:0;">
      Une question ? &Eacute;crivez &agrave;
      <a href="mailto:contact@restaumargin.fr" style="color:${TEAL};text-decoration:none;">contact@restaumargin.fr</a>
    </p>
  </div>
</td></tr>

${footer()}`;

  return wrapper(content);
}

// ---------- Template J : Essai expiré — passez au payant ----------

export interface TrialExpiredData {
  userName: string;
  pricingUrl?: string;
}

export function buildTrialExpiredEmail(data: TrialExpiredData): string {
  const pricingUrl = data.pricingUrl || 'https://www.restaumargin.fr/pricing';

  const content = `
${header('RestauMargin', 'Votre essai a expir&eacute;')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Votre essai gratuit de 7 jours est termin&eacute;. Votre compte est d&eacute;sactiv&eacute;,
    mais <strong style="color:${DARK};">vos donn&eacute;es sont conserv&eacute;es 30 jours</strong>.
  </p>
</td></tr>

<tr><td style="padding:10px 25px 20px;">
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:20px;text-align:center;">
    <p style="color:#991b1b;font-size:15px;font-weight:600;margin:0;">
      &#128274; Acc&egrave;s d&eacute;sactiv&eacute;
    </p>
    <p style="color:#991b1b;font-size:13px;margin:8px 0 0;">
      Vos fiches techniques, ingr&eacute;dients et dashboard ne sont plus accessibles.
    </p>
  </div>
</td></tr>

<tr><td style="padding:0 25px 10px;">
  <p style="color:${DARK};font-size:15px;line-height:1.6;margin:0;">
    Pour r&eacute;activer votre compte et retrouver toutes vos donn&eacute;es, choisissez un plan :
  </p>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td style="width:50%;padding:8px;">
        <div style="background:${BG_LIGHT};border:1px solid ${BORDER};border-radius:10px;padding:20px;text-align:center;">
          <p style="color:${DARK};font-size:16px;font-weight:bold;margin:0;">Pro</p>
          <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:8px 0 4px;">29&euro;<span style="font-size:14px;color:${MUTED};font-weight:normal;">/mois</span></p>
          <p style="color:${MUTED};font-size:12px;margin:0;">Tout pour 1 restaurant</p>
        </div>
      </td>
      <td style="width:50%;padding:8px;">
        <div style="background:${BG_LIGHT};border:2px solid ${TEAL};border-radius:10px;padding:20px;text-align:center;">
          <p style="color:${DARK};font-size:16px;font-weight:bold;margin:0;">Business</p>
          <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:8px 0 4px;">79&euro;<span style="font-size:14px;color:${MUTED};font-weight:normal;">/mois</span></p>
          <p style="color:${MUTED};font-size:12px;margin:0;">Multi-sites + support prioritaire</p>
        </div>
      </td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:0 25px 25px;text-align:center;">
  <a href="${pricingUrl}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    R&eacute;activer mon compte &#8594;
  </a>
  <p style="color:${MUTED};font-size:12px;margin:12px 0 0;">
    29&euro;/mois, c'est moins de 1&euro; par jour. Si l'outil vous a permis de d&eacute;tecter
    un seul plat mal pric&eacute;, il s'est d&eacute;j&agrave; rembours&eacute;.
  </p>
</td></tr>

${footer()}`;

  return wrapper(content);
}

// ---------- Template K : Digest d'alertes (notification hebdomadaire) ----------

export interface DigestEmailData {
  userName: string;
  restaurantName: string;
  alerts: { type: string; title: string; detail: string }[];
  dashboardUrl?: string;
}

export function buildDigestEmail(data: DigestEmailData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';

  const alertRows = data.alerts.map((a, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : BG_LIGHT;
    const typeColor = a.type === 'Stock' ? '#f59e0b' : a.type === 'Marge' ? '#dc2626' : TEAL;
    return `<tr style="background:${bg};">
      <td style="padding:10px 12px;border-bottom:1px solid ${BORDER};font-size:13px;">
        <span style="display:inline-block;background:${typeColor};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">${esc(a.type)}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid ${BORDER};font-size:13px;font-weight:600;color:${DARK};">${esc(a.title)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid ${BORDER};font-size:13px;color:${DARK};">${esc(a.detail)}</td>
    </tr>`;
  }).join('');

  const content = `
${header('RestauMargin', 'R&eacute;sum&eacute; des alertes')}

<tr><td style="padding:25px 20px 10px;">
  <p style="font-size:16px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:14px;color:${MUTED};margin:8px 0 0;">
    <strong style="color:${DARK};">${data.alerts.length} alerte${data.alerts.length > 1 ? 's' : ''}</strong>
    n&eacute;cessitant votre attention pour <strong style="color:${DARK};">${esc(data.restaurantName)}</strong> :
  </p>
</td></tr>

<tr><td style="padding:10px 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
    <thead>
      <tr style="background:${TEAL};">
        <th style="padding:10px 12px;text-align:left;color:white;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Type</th>
        <th style="padding:10px 12px;text-align:left;color:white;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">&Eacute;l&eacute;ment</th>
        <th style="padding:10px 12px;text-align:left;color:white;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">D&eacute;tail</th>
      </tr>
    </thead>
    <tbody>${alertRows}</tbody>
  </table>
</td></tr>

<tr><td style="padding:25px;text-align:center;">
  <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    Voir le tableau de bord &#8594;
  </a>
</td></tr>

${footer('R&eacute;sum&eacute; g&eacute;n&eacute;r&eacute; automatiquement par RestauMargin &mdash; www.restaumargin.fr')}`;

  return wrapper(content);
}

// ---------- Template L : Bienvenue de retour (utilisateur inactif) ----------

export interface WelcomeBackData {
  userName: string;
  daysSinceLastLogin: number;
  dashboardUrl?: string;
}

export function buildWelcomeBackEmail(data: WelcomeBackData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';

  const content = `
${header('RestauMargin', 'On vous attendait !')}

<tr><td style="padding:30px 25px 10px;">
  <p style="font-size:18px;color:${DARK};margin:0;">Bonjour <strong>${esc(data.userName)}</strong>,</p>
  <p style="font-size:15px;color:${MUTED};margin:10px 0 0;line-height:1.6;">
    Cela fait <strong style="color:${DARK};">${data.daysSinceLastLogin} jours</strong> que vous ne vous &ecirc;tes pas connect&eacute;(e) &agrave; RestauMargin.
    Vos donn&eacute;es vous attendent, et on a quelques nouveaut&eacute;s &agrave; vous montrer.
  </p>
</td></tr>

<tr><td style="padding:10px 25px;">
  <div style="background:${BG_LIGHT};border-radius:10px;padding:20px;">
    <p style="color:${DARK};font-size:14px;font-weight:600;margin:0 0 12px;">&#128161; Pourquoi revenir maintenant ?</p>
    <ul style="margin:0;padding-left:18px;color:${MUTED};font-size:14px;line-height:2;">
      <li>Les prix fournisseurs ont peut-&ecirc;tre &eacute;volu&eacute; &mdash; v&eacute;rifiez vos marges</li>
      <li>Votre food cost est-il toujours sous contr&ocirc;le ?</li>
      <li>Nouvelles fonctionnalit&eacute;s IA disponibles pour optimiser votre carte</li>
    </ul>
  </div>
</td></tr>

<tr><td style="padding:25px;text-align:center;">
  <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});color:white;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 4px 12px rgba(13,148,136,0.3);">
    Revenir sur mon dashboard &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 15px;">
  <div style="background:${BG_LIGHT};border-radius:8px;padding:16px;text-align:center;">
    <p style="color:${MUTED};font-size:13px;margin:0;">
      Besoin d'aide ? &Eacute;crivez-nous &agrave;
      <a href="mailto:contact@restaumargin.fr" style="color:${TEAL};text-decoration:none;">contact@restaumargin.fr</a>
    </p>
  </div>
</td></tr>

${footer()}`;

  return wrapper(content);
}

// ============================================================
// MARKETING EMAIL TEMPLATES — Premium W&B Monochrome Design
// ============================================================

export interface MarketingEmailData {
  recipientName?: string;
  subject: string;
  cuisineType?: string;
  bodyHtml: string;
}

/**
 * Premium marketing email template — Stripe/Linear/Notion style.
 * White background, black text, no gradients, no teal, no emoji logo.
 * Table-based layout, responsive, email-safe HTML.
 */
export function buildMarketingEmail(data: MarketingEmailData): string {
  const MKT_FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  const MKT_BLACK = '#111111';
  const MKT_WHITE = '#FFFFFF';
  const MKT_GRAY = '#666666';
  const MKT_LIGHT_GRAY = '#F5F5F5';
  const MKT_BORDER = '#E0E0E0';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${esc(data.subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .fallback-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .outer-table { width: 100% !important; }
      .inner-pad { padding: 24px 20px !important; }
      .header-pad { padding: 28px 20px !important; }
      .footer-pad { padding: 24px 20px !important; }
      .cta-btn { width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${MKT_WHITE};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${MKT_WHITE};">
    <tr>
      <td align="center" style="padding:0;">
        <!-- Outer container -->
        <table role="presentation" class="outer-table" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${MKT_WHITE};">

          <!-- Header: RestauMargin wordmark -->
          <tr>
            <td class="header-pad" style="padding:40px 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-family:${MKT_FONT};font-size:22px;font-weight:700;color:${MKT_BLACK};letter-spacing:-0.3px;line-height:1;">
                    RestauMargin
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Separator line -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid ${MKT_BLACK};font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td class="inner-pad" style="padding:32px 32px 24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-family:${MKT_FONT};font-size:15px;line-height:1.7;color:${MKT_BLACK};">
                    ${data.bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td class="inner-pad" style="padding:8px 32px 40px 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="cta-btn" align="center" style="background-color:${MKT_BLACK};border-radius:8px;">
                    <a href="https://www.restaumargin.fr/demo" target="_blank" style="display:inline-block;padding:16px 32px;font-family:${MKT_FONT};font-size:16px;font-weight:600;color:${MKT_WHITE};text-decoration:none;letter-spacing:0.2px;">
                      Demander une d&eacute;mo gratuite
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer separator -->
          <tr>
            <td style="padding:0 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-top:1px solid ${MKT_BORDER};font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-pad" style="padding:24px 32px 32px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-family:${MKT_FONT};font-size:12px;line-height:1.6;color:${MKT_GRAY};">
                    RestauMargin SAS &mdash; Montpellier<br>
                    <a href="https://www.restaumargin.fr" style="color:${MKT_GRAY};text-decoration:underline;">restaumargin.fr</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;font-family:${MKT_FONT};font-size:11px;line-height:1.5;color:#999999;">
                    Vous recevez cet email car votre &eacute;tablissement correspond &agrave; notre audience professionnelle.<br>
                    <a href="https://www.restaumargin.fr/unsubscribe" style="color:#999999;text-decoration:underline;">Se d&eacute;sabonner</a>
                    &nbsp;&middot;&nbsp;
                    <a href="https://www.restaumargin.fr/privacy" style="color:#999999;text-decoration:underline;">Politique de confidentialit&eacute;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


// ---------- Cuisine-specific campaign hooks ----------

const CUISINE_HOOKS: Record<string, { subject: string; hook: string; pain: string; benefit: string }> = {
  francaise: {
    subject: 'Vos marges en cuisine fran\u00e7aise sont-elles vraiment optimis\u00e9es ?',
    hook: 'En gastronomie fran\u00e7aise, chaque centime compte. Entre les produits frais, les sauces maison et les cuissons longues, le food cost peut vite d\u00e9raper sans que vous le voyiez.',
    pain: 'La plupart des restaurants fran\u00e7ais perdent entre 3% et 8% de marge sur leurs plats signature \u2014 simplement parce qu\u2019ils n\u2019ont pas de visibilit\u00e9 en temps r\u00e9el sur leurs co\u00fbts.',
    benefit: 'Avec RestauMargin, vous suivez le co\u00fbt exact de chaque fiche technique, d\u00e9tectez les d\u00e9rives de prix fournisseurs, et optimisez votre carte pour maximiser vos marges.',
  },
  italienne: {
    subject: 'Pizzeria, trattoria : savez-vous vraiment combien vous co\u00fbte chaque plat ?',
    hook: 'Mozzarella, huile d\u2019olive, farine tipo 00\u2026 Les prix des mati\u00e8res premi\u00e8res italiennes sont volatils. Un simple changement de fournisseur peut impacter toute votre rentabilit\u00e9.',
    pain: 'Combien co\u00fbte r\u00e9ellement votre margherita ? Et votre tiramisu ? Sans fiches techniques pr\u00e9cises, c\u2019est impossible \u00e0 savoir.',
    benefit: 'RestauMargin calcule automatiquement le food cost de chaque recette et vous alerte quand un prix fournisseur augmente. Fini les mauvaises surprises en fin de mois.',
  },
  japonaise: {
    subject: 'Sushi, ramen, izakaya : ma\u00eetrisez vos co\u00fbts mati\u00e8res',
    hook: 'Poisson frais, riz \u00e0 sushi, sauce soja premium\u2026 La cuisine japonaise exige des ingr\u00e9dients de qualit\u00e9, et les co\u00fbts peuvent vite flamber.',
    pain: 'Le poisson repr\u00e9sente souvent 40-50% du co\u00fbt d\u2019un plat en cuisine japonaise. Sans suivi pr\u00e9cis, vous travaillez \u00e0 l\u2019aveugle.',
    benefit: 'RestauMargin vous donne une vision claire de vos co\u00fbts par plat, suit les variations de prix du march\u00e9, et vous aide \u00e0 ajuster vos tarifs en cons\u00e9quence.',
  },
  asiatique: {
    subject: 'Restaurant asiatique : optimisez vos marges sans sacrifier la qualit\u00e9',
    hook: 'Wok, curry, bo bun, banh mi\u2026 La cuisine asiatique s\u00e9duit, mais les marges peuvent \u00eatre serr\u00e9es si les portions et les co\u00fbts ne sont pas ma\u00eetris\u00e9s.',
    pain: 'Avec des cartes souvent larges (30+ plats), suivre le food cost de chaque recette manuellement est un cauchemar. R\u00e9sultat : des plats rentables subventionnent des plats \u00e0 perte.',
    benefit: 'RestauMargin analyse votre carte compl\u00e8te, identifie vos plats les plus (et moins) rentables, et vous guide pour r\u00e9\u00e9quilibrer vos marges.',
  },
  burger: {
    subject: 'Burger, smash, gourmet : vos marges sont-elles au rendez-vous ?',
    hook: 'Le march\u00e9 du burger est ultra-comp\u00e9titif. Entre le co\u00fbt du b\u0153uf, les toppings premium et le pain artisanal, la rentabilit\u00e9 se joue au centime pr\u00e8s.',
    pain: 'Un burger \u00e0 12\u20ac qui co\u00fbte 5,50\u20ac en mati\u00e8res premi\u00e8res, c\u2019est 54% de food cost. Trop \u00e9lev\u00e9. Mais sans outil, comment le savoir ?',
    benefit: 'RestauMargin d\u00e9compose chaque burger en co\u00fbt exact (pain, steak, sauce, garniture) et vous montre o\u00f9 gagner des points de marge.',
  },
  brasserie: {
    subject: 'Brasserie : comment passer de 30% \u00e0 25% de food cost',
    hook: 'Plat du jour, carte des classiques, suggestions du chef\u2026 En brasserie, la carte tourne vite et les co\u00fbts doivent suivre.',
    pain: 'Avec un plat du jour qui change chaque jour, calculer le food cost \u00e0 la main est mission impossible. Pourtant, c\u2019est l\u00e0 que se cachent les d\u00e9rives.',
    benefit: 'RestauMargin g\u00e9n\u00e8re vos fiches techniques en quelques clics gr\u00e2ce \u00e0 l\u2019IA, et vous donne le food cost instantan\u00e9 de chaque plat \u2014 m\u00eame ceux qui changent tous les jours.',
  },
  pizzeria: {
    subject: 'Pizzeria : chaque pizza est-elle vraiment rentable ?',
    hook: 'Farine, mozzarella, tomates San Marzano\u2026 Les ingr\u00e9dients d\u2019une vraie pizza ont un co\u00fbt. Et avec 15-20 pizzas \u00e0 la carte, les \u00e9carts de marge peuvent \u00eatre \u00e9normes.',
    pain: 'Votre 4 fromages est probablement 2x plus ch\u00e8re \u00e0 produire que votre margherita. Vendez-vous la diff\u00e9rence au bon prix ?',
    benefit: 'RestauMargin analyse chaque pizza de votre carte, compare les co\u00fbts, et vous aide \u00e0 fixer des prix qui refl\u00e8tent la r\u00e9alit\u00e9 de vos co\u00fbts.',
  },
  general: {
    subject: 'Restaurateurs : arr\u00eatez de perdre de l\u2019argent sur chaque plat',
    hook: 'En France, 1 restaurant sur 3 ferme dans les 3 premi\u00e8res ann\u00e9es. La raison n\u00b01 ? Une mauvaise ma\u00eetrise des co\u00fbts mati\u00e8res.',
    pain: 'Si vous ne connaissez pas le food cost exact de chaque plat de votre carte, vous pilotez votre restaurant \u00e0 l\u2019aveugle.',
    benefit: 'RestauMargin est l\u2019outil qui vous donne enfin une vision claire : co\u00fbt par plat, marge r\u00e9elle, alertes prix, fiches techniques automatis\u00e9es par IA.',
  },
};

export interface CampaignRestaurant {
  name: string;
  contactName?: string;
  email: string;
}

/**
 * Generates a complete personalized campaign email for a restaurant,
 * using cuisine-specific hooks wrapped in the premium marketing template.
 */
export function buildCampaignEmail(restaurant: CampaignRestaurant, cuisineType?: string): { subject: string; html: string } {
  const cuisine = CUISINE_HOOKS[(cuisineType || 'general').toLowerCase()] || CUISINE_HOOKS.general;
  const greeting = restaurant.contactName
    ? `Bonjour ${esc(restaurant.contactName)},`
    : `Bonjour,`;

  // Uses the SAME design as supplier order emails (wrapper + header + footer)
  const content = `
    ${header('Votre cuisine m&eacute;rite mieux')}
    <tr><td style="padding:30px;">
      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 18px;">${greeting}</p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 18px;">
        ${esc(cuisine.hook)}
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 18px;">
        ${esc(cuisine.pain)}
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 24px;">
        ${esc(cuisine.benefit)}
      </p>

      <div style="border-top:1px solid ${BORDER};margin:24px 0;"></div>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 14px;">
        RestauMargin est n&eacute; d'un constat simple : les restaurateurs passent des heures &agrave; calculer leurs co&ucirc;ts sur Excel ou sur un coin de nappe, alors que la technologie pourrait le faire en quelques secondes.
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 14px;">
        Aujourd'hui, notre intelligence artificielle permet de <strong>cr&eacute;er une fiche technique par la voix</strong>, en plein service. Vous dites &laquo; risotto aux c&egrave;pes, 4 portions, 19 euros &raquo; &mdash; et le food cost s'affiche en 10 secondes.
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 14px;">
        Votre livreur d&eacute;pose une facture ? <strong>Photographiez-la.</strong> L'IA lit les prix et met &agrave; jour vos co&ucirc;ts automatiquement. Plus de saisie manuelle.
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 14px;">
        Vos stocks baissent ? <strong>La commande part en 1 clic</strong> &mdash; par email ou WhatsApp &mdash; directement &agrave; votre fournisseur. Et si vous avez une balance Bluetooth, le stock se met &agrave; jour &agrave; chaque pes&eacute;e.
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 14px;">
        Un fournisseur augmente ses prix ? <strong>Vous &ecirc;tes alert&eacute; imm&eacute;diatement</strong>, avant que &ccedil;a impacte vos marges.
      </p>

      <div style="border-top:1px solid ${BORDER};margin:24px 0;"></div>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0 0 24px;">
        Nous proposons un essai gratuit de 7 jours, sans carte bancaire et sans engagement. En 5 minutes, vous savez exactement ce que chaque plat vous co&ucirc;te et ce qu'il vous rapporte.
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr><td align="center" style="padding:8px 0 24px;">
          <a href="https://www.restaumargin.fr/login?mode=register" style="display:inline-block;padding:14px 36px;background:${TEAL};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;font-family:${FONT};">
            Essayer gratuitement &rarr;
          </a>
        </td></tr>
      </table>

      <p style="color:${MUTED};font-family:${FONT};font-size:13px;text-align:center;margin:0 0 24px;">
        29&euro;/mois apr&egrave;s l'essai &mdash; Sans engagement
      </p>

      <p style="color:${DARK};font-family:${FONT};font-size:15px;line-height:1.8;margin:0;">
        &Agrave; bient&ocirc;t,<br>
        L'&eacute;quipe RestauMargin<br>
        <span style="color:${MUTED};">Montpellier</span>
      </p>
    </td></tr>
    ${footer('Vous recevez cet email car votre restaurant est r&eacute;f&eacute;renc&eacute; publiquement.')}
  `;

  return { subject: cuisine.subject, html: wrapper(content) };
}
