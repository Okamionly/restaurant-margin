import { Resend } from 'resend';

// Prévient le fondateur à chaque inscription, au moment où elle a lieu.
//
// POURQUOI CE FICHIER EXISTE (2026-09-25)
// Ce signal dépendait d'une routine cloud (« signup-watcher ») qui interrogeait
// /api/agents/data toutes les 6 h puis envoyait l'email avec une clé Resend
// écrite dans son prompt. Cette clé est révoquée depuis juillet (réponse
// « 401 API key is invalid ») : aucune inscription n'était plus signalée, et la
// routine consommait 28 exécutions par semaine du quota Claude pour rien.
// Le serveur a déjà la clé valide : c'est ici que la notification doit vivre.

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
      console.error('[notifierInscription] refus Resend :', (r as any)?.error?.message || 'réponse sans id');
    }
  } catch (e: any) {
    console.error('[notifierInscription] échec :', e?.message);
  }
}
