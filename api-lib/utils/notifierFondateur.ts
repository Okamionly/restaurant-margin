import { Resend } from 'resend';
import { prisma } from '../prisma';

// Prévient le fondateur à chaque inscription, au moment où elle a lieu.
//
// POURQUOI CE FICHIER EXISTE (2026-09-25)
// Deux chemins signalaient les inscriptions, avec retard : le récapitulatif du
// cron inbox-sync (GitHub Actions, toutes les 2 h, qui marchait) et une routine
// cloud (« signup-watcher », toutes les 6 h) dont la clé Resend était révoquée
// depuis juillet (« 401 API key is invalid ») et qui consommait 28 exécutions
// par semaine du quota Claude pour rien. La notification part désormais à
// l'inscription même ; elle marque l'inscription dans notif_log pour que le
// récapitulatif d'inbox-sync ne la signale pas une seconde fois.

const FONDATEUR_EMAIL = 'mr.guessousyoussef@gmail.com';

function echapper(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface Inscription {
  userId: number;
  email: string;
  nom: string | null | undefined;
  restaurant: string | null | undefined;
  methode: 'email' | 'google';
  plan: string;
  finEssai: Date | null | undefined;
  provenance?: Record<string, unknown> | null;
}

// Ne lève jamais : une notification ratée ne doit pas faire échouer l'inscription.
export async function notifierInscription(i: Inscription): Promise<void> {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) return;
  try {
    const p = i.provenance || {};
    const lignes: Array<[string, unknown]> = [
      ['Nom', i.nom || '(non renseigné)'],
      ['Email', i.email],
      ['Restaurant', i.restaurant || '(non renseigné)'],
      ['Méthode', i.methode === 'google' ? 'Google' : 'Email + mot de passe'],
      ['Plan', i.plan],
      ["Fin d'essai", i.finEssai ? new Date(i.finEssai).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' }) : '—'],
      ["Page d'arrivée", p.landing_path],
      ['Source (utm)', [p.utm_source, p.utm_medium, p.utm_campaign].filter(Boolean).join(' / ')],
      ['Référent', p.referrer],
    ];
    const rangs = lignes
      .filter(([, v]) => v !== undefined && v !== null && String(v) !== '')
      .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#737373">${echapper(k)}</td><td style="padding:6px 0;color:#111111">${echapper(v)}</td></tr>`)
      .join('');

    const resend = new Resend(cle);
    const r = await resend.emails.send({
      from: 'RestauMargin <contact@restaumargin.fr>',
      to: FONDATEUR_EMAIL,
      subject: `Nouvelle inscription : ${String(i.nom || i.email).slice(0, 80)}`,
      html: `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px;color:#111111">Nouvelle inscription sur RestauMargin</h2>
<table style="border-collapse:collapse;font-size:14px">${rangs}</table>
<p style="margin-top:16px;font-size:12px;color:#737373">Compte n° ${echapper(i.userId)} — notification envoyée par le serveur à l'inscription.</p>
</div>`,
    });
    // Le SDK Resend ne lève pas : il renvoie { data, error }.
    if ((r as any)?.error || !r?.data?.id) {
      // Pas de marquage : le récapitulatif d'inbox-sync la signalera à la place.
      console.error('[notifierInscription] refus Resend :', (r as any)?.error?.message || 'réponse sans id');
      return;
    }
    // Même ligne que celle qu'écrit inbox-sync après son récapitulatif : il
    // ne renverra donc pas cette inscription.
    await prisma.$executeRaw`INSERT INTO notif_log (kind, ref, category, meta, notified)
      VALUES ('signup', ${String(i.userId)}, 'signup', ${JSON.stringify({ email: i.email, instantane: true })}::jsonb, true)
      ON CONFLICT (kind, ref) DO NOTHING`;
  } catch (e: any) {
    console.error('[notifierInscription] échec :', e?.message);
  }
}
