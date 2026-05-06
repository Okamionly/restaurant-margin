/**
 * @file signupSource.ts
 *
 * Capture l'origine d'acquisition d'un user au moment de l'inscription.
 * Sources captées : UTM (utm_source/medium/campaign/content/term), document.referrer,
 * et landing_path (la 1ère URL où le visiteur est arrivé sur le site).
 *
 * Utilisation :
 *   - App.tsx au mount : captureLandingSource() — sauvegarde landing_path + utm
 *     dans sessionStorage SI le user n'a pas encore de landing capturé
 *   - Login.tsx au submit register : getSignupSource() — récupère le payload
 *     à envoyer dans le body de POST /api/auth/register
 *
 * RGPD : aucune PII collectée côté client. L'IP/user-agent est captée
 * server-side au moment du POST register (cf api-lib/routes/auth.ts).
 */

import type { SignupSource } from '../types';

const SS_KEY = 'rm_signup_source';

/**
 * Capture le UTM + landing path au tout 1er load de la session.
 * Idempotent : ne re-capture pas si déjà fait (le tout 1er touch est le plus pertinent
 * pour identifier l'acquisition channel).
 */
export function captureLandingSource(): void {
  try {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SS_KEY)) return; // déjà capturé pour cette session

    const params = new URLSearchParams(window.location.search);
    const data: SignupSource = {};
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
    for (const k of utmKeys) {
      const v = params.get(k);
      if (v) (data as any)[k] = v.slice(0, 200);
    }
    if (document.referrer) data.referrer = document.referrer.slice(0, 500);
    data.landing_path = window.location.pathname.slice(0, 500);
    sessionStorage.setItem(SS_KEY, JSON.stringify(data));
  } catch {}
}

/**
 * Retourne le payload signupSource à envoyer au serveur lors du register.
 */
export function getSignupSource(): SignupSource | undefined {
  try {
    if (typeof window === 'undefined') return undefined;
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as SignupSource;
    return Object.keys(parsed).length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}
