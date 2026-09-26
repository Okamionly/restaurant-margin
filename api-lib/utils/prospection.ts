import { buildProspectionEmail } from './emailTemplates';

// Prospection de restaurants (2026-09-26) — fonctions PURES, testees dans
// tests/prospection.test.ts. Le cron /api/cron/prospection les orchestre.
//
// Regles tenues ici, communes aux 4 pays vises (France, Belgique, Suisse, Canada) :
// - uniquement des adresses GENERIQUES (contact@, info@, reservation@...) ou au nom
//   de l'etablissement, publiees sur le site du restaurant lui-meme : jamais une
//   adresse nominative (en Belgique, l'exception B2B ne vaut que pour les adresses
//   impersonnelles) ;
// - chaque message identifie l'expediteur, dit d'ou vient l'adresse, et porte un
//   lien de desinscription ; au Canada (LCAP), l'adresse postale est obligatoire :
//   sans elle, les villes canadiennes sont ignorees ;
// - aucune preuve sociale (regle absolue du CLAUDE.md) : l'outil est presente
//   comme recent, l'offre est reelle (code d'activation de 90 jours).

export interface Cible { pays: 'France' | 'Belgique' | 'Suisse' | 'Canada'; ville: string }

// Regions francophones seulement : le produit est en francais.
export const CIBLES: Cible[] = [
  { pays: 'France', ville: 'Paris' }, { pays: 'Belgique', ville: 'Bruxelles' },
  { pays: 'Suisse', ville: 'Genève' }, { pays: 'Canada', ville: 'Montréal' },
  { pays: 'France', ville: 'Lyon' }, { pays: 'Belgique', ville: 'Liège' },
  { pays: 'Suisse', ville: 'Lausanne' }, { pays: 'Canada', ville: 'Québec' },
  { pays: 'France', ville: 'Marseille' }, { pays: 'Belgique', ville: 'Namur' },
  { pays: 'Suisse', ville: 'Neuchâtel' }, { pays: 'Canada', ville: 'Gatineau' },
  { pays: 'France', ville: 'Bordeaux' }, { pays: 'France', ville: 'Toulouse' },
  { pays: 'France', ville: 'Lille' }, { pays: 'France', ville: 'Nantes' },
  { pays: 'Suisse', ville: 'Fribourg' }, { pays: 'Canada', ville: 'Sherbrooke' },
  { pays: 'France', ville: 'Montpellier' }, { pays: 'France', ville: 'Strasbourg' },
];

/** Cibles du jour : rotation deterministe ; le Canada seulement avec une adresse postale. */
export function ciblesDuJour(jour: number, adressePostale: string | undefined): Cible[] {
  const actives = CIBLES.filter((c) => c.pays !== 'Canada' || !!adressePostale);
  const n = actives.length;
  return [0, 1, 2, 3].map((k) => actives[(jour + k) % n]);
}

// Annuaires, guides, plateformes de livraison et reseaux : jamais le site du restaurant.
const AGREGATEURS = [
  'tripadvisor', 'thefork', 'lafourchette', 'ubereats', 'deliveroo', 'just-eat', 'justeat',
  'pagesjaunes', 'pages-jaunes', 'yelp', 'google.', 'facebook.', 'instagram.', 'tiktok.',
  'linkedin.', 'twitter.', 'x.com', 'youtube.', 'foursquare', 'zomato', 'opentable', 'resy',
  'michelin', 'gaultmillau', 'petitfute', 'routard', 'timeout', 'lefooding', 'lebonbon',
  'restaurantguru', 'mapstr', 'wikipedia', 'yellowpages', 'local.ch', 'search.ch',
  'resto.be', 'guide-restaurants', 'restaurant.info', 'bonnesadresses', 'viamichelin',
  'booking.', 'airbnb', 'groupon', 'smartbox', 'wonderbox', 'lefigaro', 'leparisien',
];

export function estAgregateur(url: string): boolean {
  const u = url.toLowerCase();
  return AGREGATEURS.some((a) => u.includes(a));
}

/** Domaine enregistre (sans www.), ou '' si l'URL est illisible. */
export function domaineDe(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Emails trouves dans une page HTML (y compris mailto: et &#64;), dedoublonnes, en minuscules. */
export function extraireEmails(html: string): string[] {
  const texte = String(html || '')
    .replace(/&#0*64;|&#x0*40;/gi, '@')
    .replace(/\s*\[\s*at\s*\]\s*|\s*\(\s*at\s*\)\s*/gi, '@');
  const trouves = texte.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
  return [...new Set(trouves.map((e) => e.toLowerCase().replace(/^mailto:/, '')))];
}

const LOCAUX_GENERIQUES = [
  'contact', 'info', 'infos', 'information', 'reservation', 'reservations', 'resa', 'booking',
  'bonjour', 'hello', 'salut', 'restaurant', 'resto', 'accueil', 'commande', 'commandes',
  'evenements', 'events', 'traiteur', 'office', 'direction', 'gerant', 'gerance',
];
const LOCAUX_EXCLUS = /^(no-?reply|do-?not-?reply|ne-?pas-?repondre|privacy|rgpd|gdpr|dpo|jobs?|recrutement|rh|careers?|emploi|candidature|presse?|media|webmaster|admin|postmaster|abuse|hostmaster|test|exemple|example|support)$/;
const DOMAINES_EXCLUS = /(sentry|wixpress|example\.|domain\.com|email\.com|yoursite|votresite|godaddy|squarespace|wix\.com|mysite|sitename|w3\.org|schema\.org)/;
const FOURNISSEURS = /^(gmail\.com|googlemail\.com|hotmail\.[a-z.]+|outlook\.[a-z.]+|live\.[a-z.]+|yahoo\.[a-z.]+|icloud\.com|orange\.fr|wanadoo\.fr|free\.fr|sfr\.fr|laposte\.net|bluewin\.ch|gmx\.[a-z.]+|skynet\.be|proximus\.be|videotron\.ca|sympatico\.ca|bell\.net)$/;

/**
 * Adresse acceptable pour une prise de contact : generique (contact@, info@...) ou
 * au nom de l'etablissement, sur le domaine du site ou chez un fournisseur de
 * messagerie. Jamais nominative, jamais technique.
 */
export function emailAcceptable(email: string, domaineSite: string): boolean {
  const [local, dom] = String(email).toLowerCase().split('@');
  if (!local || !dom) return false;
  if (/\.(png|jpe?g|gif|webp|svg|css|js)$/.test(dom)) return false;
  if (LOCAUX_EXCLUS.test(local) || DOMAINES_EXCLUS.test(dom)) return false;
  const surLeSite = !!domaineSite && (dom === domaineSite || dom.endsWith('.' + domaineSite));
  if (!surLeSite && !FOURNISSEURS.test(dom)) return false;
  const racine = local.replace(/[0-9._-]+$/, '');
  if (LOCAUX_GENERIQUES.includes(racine)) return true;
  // Au nom de l'etablissement : la partie locale reprend le nom de domaine du site
  // (lebistrot@gmail.com pour lebistrot.fr).
  const nomSite = domaineSite.split('.')[0].replace(/[^a-z0-9]/g, '');
  const localCompact = local.replace(/[^a-z0-9]/g, '');
  return nomSite.length >= 4 && (localCompact.includes(nomSite) || nomSite.includes(localCompact));
}

/** Meilleure adresse : generique d'abord (contact > reservation > info > ...). */
export function choisirEmail(emails: string[], domaineSite: string): string | null {
  const ok = emails.filter((e) => emailAcceptable(e, domaineSite));
  if (!ok.length) return null;
  const rang = (e: string) => {
    const local = e.split('@')[0].replace(/[0-9._-]+$/, '');
    const i = LOCAUX_GENERIQUES.indexOf(local);
    return i === -1 ? 99 : i;
  };
  return ok.sort((a, b) => rang(a) - rang(b))[0];
}

export function echapperHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export interface MessageProspection { sujet: string; texte: string; html: string }

/**
 * Le message envoye. Uniquement des faits verifiables (tarif, essai, perimetre reel).
 * Aucun prenom : l'expediteur est l'equipe RestauMargin (demande du fondateur,
 * 2026-09-26). Le HTML reprend la charte de l'email de bienvenue (emailTemplates.ts).
 */
export function composerMessage(p: {
  nom: string; site: string; email: string; code: string; jeton: string; adressePostale?: string;
}): MessageProspection {
  const base = 'https://www.restaumargin.fr';
  const lienOffre = `${base}/login?mode=register&offre=${encodeURIComponent(p.code)}`;
  const lienStop = `${base}/api/prospection/desinscription?t=${encodeURIComponent(p.jeton)}`;
  const sujet = `${p.nom} : 3 mois offerts pour piloter les marges de votre restaurant`;
  const texte = [
    'Bonjour,',
    '',
    "RestauMargin est un logiciel français qui calcule le coût de revient et la marge de chaque plat de votre carte. Nous vous proposons de l'essayer 3 mois, gratuitement et sans carte bancaire.",
    '',
    'Ce que RestauMargin fait pour vous :',
    '- Inventaire et stocks : vos stocks suivis, avec une alerte avant la rupture',
    '- Balance Bluetooth : une station de pesée connectée, directement en cuisine',
    '- Une recette de saison par jour, avec sa fiche technique, son coût par portion et son prix conseillé ; vos menus de la semaine',
    "- Actualité et IA : l'actualité des prix et du secteur, et un assistant IA pour vos questions de marge",
    '',
    `Votre code personnel (3 mois offerts) : ${p.code}`,
    `Pour l'activer (le code est déjà rempli) : ${lienOffre}`,
    'Ensuite : 29 € par mois si vous continuez, sans engagement.',
    '',
    "L'outil est récent : vos retours nous aident à l'améliorer. Une question ? Répondez simplement à cet email.",
    '',
    "L'équipe RestauMargin",
    `contact@restaumargin.fr — ${base}`,
    ...(p.adressePostale ? [p.adressePostale] : []),
    '',
    `Vous recevez ce message car l'adresse ${p.email} est publiée sur ${p.site}.`,
    `Ne plus recevoir de message : ${lienStop}`,
    `Mentions légales : ${base}/mentions-legales`,
  ].join('\n');
  const html = buildProspectionEmail({
    nom: p.nom, site: p.site, email: p.email, code: p.code, lienOffre, lienStop, adressePostale: p.adressePostale,
  });
  return { sujet, texte, html };
}
