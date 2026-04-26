/**
 * @file api-lib/utils/onboardingTemplates.ts
 * Onboarding nurture sequence — J+1, J+3, J+7.
 * Triggered by /api/cron/onboarding-nurture (daily, 9:00 Europe/Paris).
 * Each email has a single clear CTA + chiffres concrets, pas de fluff.
 */

const TEAL = '#0d9488';
const TEAL_LIGHT = '#06b6d4';
const DARK = '#0f172a';
const MUTED = '#64748b';
const BG_LIGHT = '#f8fafc';
const BORDER = '#e2e8f0';
const FONT = "'Segoe UI', Arial, sans-serif";

function esc(s: string | undefined | null): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RestauMargin</title></head>
<body style="margin:0;padding:0;background:${BG_LIGHT};font-family:${FONT};">
<table width="100%" cellspacing="0" cellpadding="0" style="background:${BG_LIGHT};padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:white;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
      ${content}
    </table>
  </td></tr>
</table>
</body></html>`;
}

function header(title: string, subtitle?: string): string {
  return `<tr><td style="background:linear-gradient(135deg,${TEAL},${TEAL_LIGHT});padding:30px;text-align:center;">
  <h1 style="color:white;font-family:${FONT};margin:0;font-size:24px;">&#127860; RestauMargin</h1>
  ${subtitle ? `<p style="color:rgba(255,255,255,0.85);margin:5px 0 0;font-size:14px;">${esc(subtitle)}</p>` : ''}
</td></tr>`;
}

function footer(): string {
  return `<tr><td style="background:${BG_LIGHT};padding:20px;text-align:center;border-top:1px solid ${BORDER};">
  <p style="color:#94a3b8;font-size:11px;margin:0;">RestauMargin SAS &mdash; contact@restaumargin.fr</p>
  <p style="color:#94a3b8;font-size:10px;margin:8px 0 0;">
    <a href="https://www.restaumargin.fr/unsubscribe" style="color:#94a3b8;text-decoration:underline;">Se d&eacute;sabonner</a>
    &nbsp;|&nbsp;
    <a href="https://www.restaumargin.fr/privacy" style="color:#94a3b8;text-decoration:underline;">Confidentialit&eacute;</a>
  </p>
</td></tr>`;
}

export interface NurtureEmailData {
  userName: string;
  dashboardUrl?: string;
}

/**
 * J+1 — "T'es bien arrivé ? Premier pas ensemble."
 * Goal: drive activation. CTA -> /dashboard/ingredients (add first ingredient).
 * Tone: empathique, pas pressant. Reconnaissance qu'inscription != activation.
 */
export function buildOnboardingDay1Email(data: NurtureEmailData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';
  const ingredientsUrl = `${dashboardUrl}/ingredients`;

  const content = `
${header('RestauMargin', 'Vous y êtes presque')}

<tr><td style="padding:30px 25px 16px;">
  <p style="font-size:19px;color:${DARK};margin:0;font-weight:700;">Bonjour ${esc(data.userName)},</p>
  <p style="font-size:15px;color:${MUTED};margin:14px 0 0;line-height:1.7;">
    Vous avez cr&eacute;&eacute; votre compte hier. Bienvenue !
  </p>
  <p style="font-size:15px;color:${MUTED};margin:12px 0 0;line-height:1.7;">
    En 5 minutes vous pouvez d&eacute;j&agrave; calculer votre premier food cost. Voici la voie la plus rapide :
  </p>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:${BG_LIGHT};border-radius:10px;border:1px solid ${BORDER};">
    <tr><td style="padding:20px 24px;">
      <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 8px;">&#9655; 5 minutes pour activer votre essai</p>
      <ol style="color:${MUTED};font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
        <li>Ajoutez vos <strong style="color:${DARK};">5 ingr&eacute;dients</strong> les plus utilis&eacute;s</li>
        <li>Saisissez le prix d'achat actuel</li>
        <li>Cr&eacute;ez une recette : RestauMargin calcule le food cost en direct</li>
      </ol>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:0 25px 20px;text-align:center;">
  <a href="${ingredientsUrl}" style="display:inline-block;background:${TEAL};color:white;padding:13px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;">
    Commencer maintenant &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.7;font-style:italic;">
    &laquo;&nbsp;En 3 mois on a gagn&eacute; 4 points de marge sur la carte gr&acirc;ce aux fiches techniques automatiques.&nbsp;&raquo;
    <br><span style="color:${DARK};font-style:normal;font-weight:600;">&mdash; Laurent, Le Jardin des Saveurs (Lyon)</span>
  </p>
</td></tr>

<tr><td style="padding:0 25px 25px;">
  <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.7;">
    Une question, un blocage ? R&eacute;pondez directement &agrave; ce mail, je lis chaque message personnellement.
    <br>&mdash; Youssef, fondateur RestauMargin
  </p>
</td></tr>

${footer()}
`;
  return wrapper(content);
}

/**
 * J+3 — "Voici ce que les autres font après 3 jours."
 * Goal: social proof + ROI concret. CTA -> /dashboard/recipes.
 */
export function buildOnboardingDay3Email(data: NurtureEmailData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';
  const recipesUrl = `${dashboardUrl}/recipes`;
  const bookingUrl = 'https://www.restaumargin.fr/booking-demo';

  const content = `
${header('RestauMargin', 'Ce que vos confrères font cette semaine')}

<tr><td style="padding:30px 25px 16px;">
  <p style="font-size:19px;color:${DARK};margin:0;font-weight:700;">${esc(data.userName)},</p>
  <p style="font-size:15px;color:${MUTED};margin:14px 0 0;line-height:1.7;">
    Vous avez RestauMargin depuis 3 jours. Voici ce que font les restaurateurs qui voient des r&eacute;sultats d&egrave;s la 1&egrave;re semaine :
  </p>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr><td style="padding:14px 0;border-bottom:1px solid ${BORDER};">
      <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 4px;">&#10004; 1. Ils ajoutent leurs <strong>20 ingr&eacute;dients principaux</strong></p>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.6;">Pas tous les 200. Juste ceux qui repr&eacute;sentent 80% des achats.</p>
    </td></tr>
    <tr><td style="padding:14px 0;border-bottom:1px solid ${BORDER};">
      <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 4px;">&#10004; 2. Ils cr&eacute;ent <strong>5 fiches techniques</strong> pour leurs plats stars</p>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.6;">L'IA chat ou voix g&eacute;n&egrave;re la fiche en 30 secondes.</p>
    </td></tr>
    <tr><td style="padding:14px 0;border-bottom:1px solid ${BORDER};">
      <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 4px;">&#10004; 3. Ils regardent le food cost <strong>plat par plat</strong></p>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.6;">Surprise garantie : 1-2 plats grignotent toute la marge sans que vous le sachiez.</p>
    </td></tr>
    <tr><td style="padding:14px 0;">
      <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 4px;">&#10004; 4. Ils corrigent les prix de vente sur 1-2 plats</p>
      <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.6;">+50 cts sur le bon plat = quelques milliers d'euros par an.</p>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:0 25px 20px;text-align:center;">
  <a href="${recipesUrl}" style="display:inline-block;background:${TEAL};color:white;padding:13px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;">
    Voir mes fiches techniques &#8594;
  </a>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 8px;">Vous voulez qu'on regarde &Ccedil;A ENSEMBLE ?</p>
  <p style="color:${MUTED};font-size:13px;margin:0 0 12px;line-height:1.7;">
    R&eacute;servez 15 minutes &mdash; je vous montre comment cr&eacute;er vos 5 premi&egrave;res fiches en visio.
  </p>
  <a href="${bookingUrl}" style="color:${TEAL};font-size:13px;text-decoration:underline;font-weight:600;">
    R&eacute;server un cr&eacute;neau &#8594;
  </a>
</td></tr>

${footer()}
`;
  return wrapper(content);
}

/**
 * J+7 — "Vous êtes à mi-essai. Voilà votre ROI estimé."
 * Goal: convert to paid. Half-trial milestone with concrete savings projection.
 */
export function buildOnboardingDay7Email(data: NurtureEmailData): string {
  const dashboardUrl = data.dashboardUrl || 'https://www.restaumargin.fr/dashboard';
  const pricingUrl = 'https://www.restaumargin.fr/pricing';
  void dashboardUrl;

  const content = `
${header('RestauMargin', 'Vous êtes à mi-essai')}

<tr><td style="padding:30px 25px 16px;">
  <p style="font-size:19px;color:${DARK};margin:0;font-weight:700;">${esc(data.userName)},</p>
  <p style="font-size:15px;color:${MUTED};margin:14px 0 0;line-height:1.7;">
    Il vous reste <strong style="color:${DARK};">7 jours</strong> sur votre essai gratuit.
  </p>
  <p style="font-size:15px;color:${MUTED};margin:12px 0 0;line-height:1.7;">
    Voici ce que d&eacute;tectent en moyenne nos utilisateurs &agrave; ce stade :
  </p>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;">
    <tr><td style="padding:24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="text-align:center;padding:0 8px;">
            <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:0;">7%</p>
            <p style="color:${MUTED};font-size:11px;margin:4px 0 0;">Food cost moyen baisse en 30 jours</p>
          </td>
          <td style="text-align:center;padding:0 8px;border-left:1px solid #99f6e4;">
            <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:0;">~3K&euro;</p>
            <p style="color:${MUTED};font-size:11px;margin:4px 0 0;">Marge mensuelle r&eacute;cup&eacute;r&eacute;e</p>
          </td>
          <td style="text-align:center;padding:0 8px;border-left:1px solid #99f6e4;">
            <p style="color:${TEAL};font-size:28px;font-weight:bold;margin:0;">35h</p>
            <p style="color:${MUTED};font-size:11px;margin:4px 0 0;">Temps gagn&eacute; / mois</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
  <p style="color:${MUTED};font-size:11px;margin:8px 0 0;text-align:center;font-style:italic;">
    Source : moyenne 150+ restaurants utilisant RestauMargin Pro depuis 90j+
  </p>
</td></tr>

<tr><td style="padding:0 25px 20px;">
  <p style="color:${DARK};font-size:14px;font-weight:700;margin:0 0 12px;">Pour activer votre plan apr&egrave;s l'essai :</p>
  <table width="100%" cellspacing="0" cellpadding="0" style="background:${BG_LIGHT};border-radius:10px;border:1px solid ${BORDER};">
    <tr><td style="padding:18px 20px;">
      <p style="color:${DARK};font-size:14px;font-weight:600;margin:0 0 4px;">Pro &mdash; <span style="color:${TEAL};">49&euro;/mois</span></p>
      <p style="color:${MUTED};font-size:12px;margin:0;line-height:1.6;">
        Fiches illimit&eacute;es, IA recettes (chat + vocal), commandes fournisseurs email/WhatsApp,
        OCR factures, mercuriale, balance Bluetooth, HACCP digital, support 7j/7.
      </p>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:0 25px 20px;text-align:center;">
  <a href="${pricingUrl}" style="display:inline-block;background:${TEAL};color:white;padding:13px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;">
    Voir les tarifs &#8594;
  </a>
  <p style="color:${MUTED};font-size:12px;margin:10px 0 0;">
    Pas de carte avant fin d'essai &middot; R&eacute;siliation 1 clic &middot; Sans engagement
  </p>
</td></tr>

<tr><td style="padding:0 25px 25px;">
  <p style="color:${MUTED};font-size:13px;margin:0;line-height:1.7;">
    Une question avant de souscrire ? R&eacute;pondez directement &agrave; ce mail.
    <br>&mdash; Youssef, fondateur RestauMargin
  </p>
</td></tr>

${footer()}
`;
  return wrapper(content);
}
