#!/usr/bin/env node
/**
 * @file client/scripts/check-content-accents.cjs
 *
 * Garde-fou contenu : pas de français sans accents dans le TEXTE VISIBLE des
 * pages de contenu (« rentabilite », « tres », « cout »…).
 *
 * Pourquoi ce script existe
 * -------------------------
 * Les agents de contenu (blog-writer, seo-writer) écrivent par défaut un
 * français sans accents, et rien n'empêchait de le publier : `vite build` passe
 * au vert, Googlebot indexe « rentabilite » tel quel. Le 2026-11-04, il a fallu
 * remettre environ 30 300 accents sur les 81 pages Blog* et Logiciel* (commits
 * 4963a43 à 3f7517a), puis 7 504 sur 21 des 30 autres pages publiques ajoutées
 * ci-dessous (commit 1d55a52). Ce contrôle empêche d'y revenir.
 *
 * Ce qui est lu — et ce qui ne l'est pas
 * --------------------------------------
 * Le texte visible est extrait par l'AST TypeScript, jamais par une regex sur le
 * source : texte JSX, et chaînes littérales placées là où elles finissent à
 * l'écran ou dans le HTML servi (props title/description/alt, objets FAQ,
 * JSON-LD, tableaux de libellés mappés, valeurs retournées).
 * Ne sont PAS lus, parce qu'ils gardent volontairement leur forme sans accent :
 *   - les attributs et propriétés techniques (to, href, id, path, className, key,
 *     slug, url, src, @id, @type…) : slugs d'URL, ancres, classes ;
 *   - les arguments d'appels de fonction (clés i18n, navigate('/x')…), les
 *     comparaisons (niveau === 'Très fort'), les `case`, les clés d'objets ;
 *   - les chaînes d'allure URL, chemin, ancre, slug, domaine ou clé pointée, et,
 *     dans le texte, les adresses citées (economie.gouv.fr, /blog/…) ;
 *   - les commentaires, et le code affiché dans <code>, <pre>, <kbd>, <samp>.
 *
 * Usage :  npm run content:check   (lancé aussi par npm run seo:check)
 *          exit 1 si un mot témoin sans accent est trouvé dans le texte visible.
 */

'use strict';

const fs = require('fs');
const path = require('path');

let ts;
try {
  ts = require('typescript');
} catch {
  console.error('[content:check] ECHEC — paquet typescript introuvable : le texte visible ne peut pas être lu.');
  console.error('Correctif : installer les dépendances du client (cd client && npm install).');
  process.exit(1);
}

const CLIENT = path.resolve(__dirname, '..');
const SK = ts.SyntaxKind;

/* ── Ce qui est contrôlé ──────────────────────────────────────────────────── */

/**
 * Pages de contenu, en chemins relatifs à client/ ; « * » remplace n'importe
 * quelle suite de caractères dans le NOM du fichier. Toute nouvelle famille de
 * pages de contenu s'ajoute ici (ex. 'src/pages/Guide*.tsx').
 */
const PAGES_DE_CONTENU = [
  'src/pages/Blog*.tsx',
  'src/pages/Logiciel*.tsx',
  // 2026-11-04 : les 30 autres pages publiques dont les routes prerender.cjs ont été
  // accentuées (1d55a52). Un motif « Préfixe* » ne doit désigner que des pages publiques.
  'src/pages/Alternative*.tsx',
  'src/pages/Comparatif*.tsx',
  'src/pages/Fonctionnalite*.tsx', // 8 pages Fonctionnalite* + FonctionnalitesIndex
  'src/pages/NicheLanding.tsx', // les 18 routes /guide-marge/*
  'src/pages/Demo.tsx',
  'src/pages/GlossaireRestauration.tsx',
  'src/pages/FoodCostCalculator.tsx',
  'src/pages/QRCodeGenerator.tsx',
  'src/pages/StationLanding.tsx',
  'src/pages/LaunchPH.tsx',
  'src/pages/MentionsLegales.tsx',
  'src/pages/CGV.tsx',
  'src/pages/CGU.tsx',
  'src/pages/PolitiqueConfidentialite.tsx',
];

/**
 * Mots témoins, écrits sous leur forme CORRECTE : le script en dérive toutes les
 * formes fautives, accents absents en tout ou en partie (déjà → deja, déja, dejà).
 *
 * Règle d'entrée, à respecter pour tout ajout :
 *   1. aucune forme fautive n'est un mot juste, en français ni en anglais courant.
 *      Exclus pour cette raison : à/a, où/ou, là/la, dès/des, côté/cote,
 *      marché/marche, chiffré/chiffre, recommandé/recommande et les participes en
 *      -é des verbes en -er, élevé/élève, réel/reel, café/cafe, thé/the,
 *      ingrédients, complète, entrée, référence, réservation, expérience,
 *      création, détail, général, zéro, idéal… (mots anglais) ;
 *   2. le mot est fréquent dans le contenu : un texte réécrit sans accents doit
 *      presque sûrement en contenir un. Le nombre suit chaque ajout : occurrences
 *      dans le texte visible des 81 pages au 2026-11-04.
 */
const TEMOINS = [
  // Liste de départ, demandée le 2026-11-04.
  'établissement', 'établissements', 'rentabilité', 'bénéfice', 'bénéfices', 'découvrez',
  'fréquentes', 'recommandée', 'dépenses', 'stratégie', 'coût', 'coûts', 'matière',
  'matières', 'méthode', 'très', 'après', 'déjà', 'être', 'même',
  // Ajouts mesurés : les plus fréquents (plus de 100 occurrences).
  'coûte', /* 151 */ 'énergie', /* 201 */ 'équipe', /* 195 */ 'réduire', /* 190 */ 'delà', /* 180 */
  'règle', /* 164 */ 'résultat', /* 146 */ 'année', /* 131 */ 'écart', /* 125 */ 'catégorie', /* 123 */
  'réelle', /* 120 */ 'clés', /* 118 */ 'qualité', /* 116 */ 'productivité', /* 114 */ 'éviter', /* 111 */
  'saisonnalité', /* 105 */ 'étapes', /* 104 */ 'français', /* 103 */ 'données', /* 102 */
  // De 50 à 100 occurrences. « salarie » existe (verbe salarier) mais n'est jamais
  // employé dans ce contenu : ce témoin a trouvé, le 2026-11-04, deux fautes
  // (« au salarie qui l'a reçu ») que la correction par lexique avait laissées.
  'représente', 'contrôle', 'salarié', 'trésorerie', 'bière', 'prévisionnel', 'propriétaire',
  'été', 'modèle', 'intégrer', 'sécurité', 'supplémentaire', 'méthodes', 'quantité', 'théorique',
  'étude', 'fidélisation', 'française', 'matériel', 'capacité', 'fréquence', 'réduit',
  'systématiquement', 'durée', 'supérieure', 'réalité', 'plutôt', 'créer', 'problème', 'période',
  'étape', 'activité', 'réponse', 'économie',
  // De 25 à 50 occurrences.
  'stratégies', 'êtes', 'événementiel', 'événements', 'immédiatement', 'généralement', 'gérer',
  'gérant', 'négociation', 'système', 'réaliste', 'équipement', 'économique', 'résultats',
  'indépendant', 'conformité', 'traçabilité', 'déjeuner', 'années', 'popularité', 'négocier',
  'août', 'près', 'état', 'visibilité', 'décembre', 'véhicule', 'impôt', 'délai', 'électricité',
  'déchets', 'écarts', 'catégories', 'équipes', 'règles',
  // Locutions : « à » seul est indécidable (il a / à), mais « a partir » et
  // « jusqu'a » ne sont jamais justes. 77 et 83 occurrences.
  'à partir', "jusqu'à",
];

/**
 * Formes sans accent VOULUES, masquées avant la recherche. Sensibles à la casse :
 * une marque garde sa majuscule. Chaque entrée dit pourquoi.
 * Aucune ne contient aujourd'hui de témoin : elles sont là pour qu'un témoin
 * ajouté plus tard (métro, émail, évents, nô…) ne les signale pas. Pièges connus
 * du 2026-11-04 : docs/tech-debt.md, section « Dette SEO — session du 2026-11-04 ».
 */
const EXCEPTIONS = [
  { motif: /\bMetro\b/g, raison: 'enseigne de grossiste (Metro Cash & Carry), pas le métro' },
  { motif: /\bno-shows?\b/gi, raison: 'anglicisme d’usage dans la restauration (réservation non honorée)' },
  { motif: /\be-?mails?\b/gi, raison: 'anglicisme d’usage, pas l’émail' },
  { motif: /\bevents?\b/gi, raison: 'anglicisme (événementiel), pas les évents' },
];

/* ── Ce qui n'est jamais lu ───────────────────────────────────────────────── */

/** Attributs JSX qui portent une adresse, un identifiant ou des classes (+ tout data-*). */
const ATTRIBUTS_TECHNIQUES = new Set([
  'to', 'href', 'id', 'path', 'className', 'key', 'slug', 'url', 'src', 'srcSet',
  'htmlFor', 'aria-controls', 'aria-describedby', 'aria-labelledby',
]);

/** Propriétés d'objet (ou variables) qui portent une adresse, un identifiant, un type ou des classes. */
const PROPRIETES_TECHNIQUES = new Set([
  'to', 'href', 'id', 'path', 'className', 'key', 'slug', 'url', 'src', 'image',
  '@id', '@type', '@context',
]);

/** Méthodes dont le tableau littéral qui les reçoit finit affiché ([…].map(…)). */
const METHODES_D_AFFICHAGE = new Set(['map', 'flatMap', 'forEach', 'join']);

/** Éléments qui affichent du code (formules Excel, exemples) et non de la prose. */
const BALISES_DE_CODE = new Set(['code', 'pre', 'kbd', 'samp', 'style']);

/** Chaîne ENTIÈRE d'allure technique : URL, chemin, ancre, mailto/tel, domaine, clé pointée, fichier. */
const ALLURE_ADRESSE = /^(?:[a-z][a-z0-9+.-]*:\/\/\S*|\/\S*|#\S*|\.{1,2}\/\S*|(?:mailto|tel):\S*|[\w-]+(?:\.[\w-]+)+)$/i;
/** Chaîne ENTIÈRE d'allure slug : minuscules, chiffres et tirets, sans espace. */
const ALLURE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

/**
 * Dans le texte, masqués (remplacés par des espaces de même longueur, pour que
 * les positions restent celles du source) : échappements, entités HTML,
 * adresses citées.
 */
const MASQUES = [
  /\\(?:u\{[0-9a-f]+\}|u[0-9a-f]{4}|x[0-9a-f]{2}|[\s\S])/gi, // échappement JS
  /&(?:[a-z][a-z0-9]*|#\d+|#x[0-9a-f]+);/gi, // entité HTML
  /[a-z][a-z0-9+.-]*:\/\/[^\s"'`<>)\]]+/gi, // URL complète
  /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+/gu, // adresse e-mail
  // Domaine cité : economie.gouv.fr, www.urssaf.fr/…
  /(?<![\p{L}\p{N}_.@-])[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)*\.(?:fr|com|org|net|eu|io|info|be|ch|co|ai|app|dev)(?![\p{L}\p{N}_-])(?:\/[^\s"'`<>)\]]*)?/giu,
  /(?<![\p{L}\p{N}_)\]])\/[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_.-]*)*/gu, // chemin /blog/…
  /(?<![\p{L}\p{N}_&])#[\p{L}\p{N}_-]+/gu, // ancre #…
];

/* ── Formes fautives ──────────────────────────────────────────────────────── */

const SANS_ACCENT = {
  à: 'a', â: 'a', ä: 'a', ç: 'c', é: 'e', è: 'e', ê: 'e', ë: 'e',
  î: 'i', ï: 'i', ô: 'o', ö: 'o', ù: 'u', û: 'u', ü: 'u', ÿ: 'y',
};

/** Toutes les graphies de `mot` où au moins un accent manque. */
function formesFautives(mot) {
  const lettres = [...mot];
  const positions = lettres.flatMap((c, i) => (SANS_ACCENT[c] ? [i] : []));
  const formes = [];
  for (let masque = 1; masque < 1 << positions.length; masque++) {
    const l = lettres.slice();
    positions.forEach((p, bit) => {
      if (masque & (1 << bit)) l[p] = SANS_ACCENT[l[p]];
    });
    formes.push(l.join(''));
  }
  return formes;
}

/** forme fautive (minuscules) → forme correcte. Refuse une liste de témoins ambiguë. */
const CORRECTION = new Map();
for (const mot of TEMOINS) {
  for (const forme of formesFautives(mot)) {
    if (TEMOINS.includes(forme) || (CORRECTION.has(forme) && CORRECTION.get(forme) !== mot)) {
      throw new Error(`[content:check] témoins ambigus : « ${forme} » est une forme fautive de « ${mot} » et un mot juste.`);
    }
    CORRECTION.set(forme, mot);
  }
}

// Frontières de mot Unicode : `\b` ne voit pas « é » comme une lettre. Les marques
// combinantes (\p{M}) comptent comme lettres, pour qu'un « é » décomposé ne coupe
// pas le mot ; les chiffres et « _ » aussi, pour ne pas lire un identifiant.
const BORD = String.raw`[\p{L}\p{M}\p{N}_]`;
const ECHAPPER = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const FAUTE = new RegExp(
  String.raw`(?<!${BORD})(?:${[...CORRECTION.keys()].sort((a, b) => b.length - a.length).map(ECHAPPER).join('|')})(?!${BORD})`,
  'giu',
);

/** Reprend la casse de `modele` (TRES → TRÈS, Etre → Être). */
function memeCasse(modele, mot) {
  if (modele.length > 1 && modele === modele.toUpperCase()) return mot.toUpperCase();
  if (modele[0] !== modele[0].toLowerCase()) return mot[0].toUpperCase() + mot.slice(1);
  return mot;
}

/* ── Lecture du texte visible ─────────────────────────────────────────────── */

function nomDe(noeud) {
  if (!noeud) return '';
  if (ts.isIdentifier(noeud) || ts.isStringLiteralLike(noeud) || ts.isNumericLiteral(noeud)) return noeud.text;
  return noeud.getText();
}

/** Le nœud est-il dans un élément qui affiche du code ? */
function dansDuCode(noeud) {
  for (let n = noeud.parent; n; n = n.parent) {
    if (ts.isJsxElement(n) && BALISES_DE_CODE.has(n.openingElement.tagName.getText())) return true;
  }
  return false;
}

/**
 * Une chaîne littérale finit-elle affichée ? On remonte l'arbre à travers les
 * enveloppes transparentes jusqu'au premier contexte qui décide.
 */
function chaineVisible(noeud) {
  let enfant = noeud;
  for (let parent = noeud.parent; parent; enfant = parent, parent = parent.parent) {
    switch (parent.kind) {
      case SK.ParenthesizedExpression:
      case SK.AsExpression:
      case SK.SatisfiesExpression:
      case SK.NonNullExpression:
      case SK.TypeAssertionExpression:
      case SK.ArrayLiteralExpression:
      case SK.SpreadElement:
      case SK.TemplateSpan:
      case SK.TemplateExpression:
      case SK.JsxExpression:
        continue;
      case SK.ConditionalExpression:
        if (enfant === parent.condition) return false; // une condition ne s'affiche pas
        continue;
      case SK.BinaryExpression: {
        const op = parent.operatorToken.kind;
        if (op === SK.PlusToken || op === SK.BarBarToken || op === SK.QuestionQuestionToken) continue;
        if (op === SK.AmpersandAmpersandToken && enfant === parent.right) continue;
        return false; // comparaison, affectation, in, instanceof…
      }
      case SK.PropertyAccessExpression: // […].map(…) affiche ; […].includes(…) compare
        return enfant === parent.expression && ts.isArrayLiteralExpression(enfant) && METHODES_D_AFFICHAGE.has(parent.name.text);
      case SK.JsxElement:
      case SK.JsxFragment:
        return !dansDuCode(enfant);
      case SK.JsxAttribute: {
        const nom = nomDe(parent.name);
        return !ATTRIBUTS_TECHNIQUES.has(nom) && !nom.startsWith('data-');
      }
      case SK.PropertyAssignment:
      case SK.VariableDeclaration:
      case SK.Parameter:
      case SK.BindingElement:
        return enfant === parent.initializer && !PROPRIETES_TECHNIQUES.has(nomDe(parent.name));
      case SK.ReturnStatement:
        return true;
      case SK.ArrowFunction:
        return enfant === parent.body;
      default:
        return false; // appel, new, case, accès indexé, import, type, clé d'objet…
    }
  }
  return false;
}

/** Plages [debut, fin[ du source qui portent du texte visible. */
function segmentsVisibles(sf) {
  const segments = [];
  const plage = (n) => ({ debut: n.getStart(sf), fin: n.end });
  (function visiter(n) {
    if (n.kind === SK.JsxText) {
      if (!n.containsOnlyTriviaWhiteSpaces && !dansDuCode(n)) segments.push({ debut: n.pos, fin: n.end });
    } else if (n.kind === SK.StringLiteral || n.kind === SK.NoSubstitutionTemplateLiteral) {
      if (!ALLURE_ADRESSE.test(n.text) && !ALLURE_SLUG.test(n.text) && chaineVisible(n)) segments.push(plage(n));
    } else if (n.kind === SK.TemplateExpression && chaineVisible(n)) {
      segments.push(plage(n.head), ...n.templateSpans.map((s) => plage(s.literal)));
    }
    ts.forEachChild(n, visiter);
  })(sf);
  return segments;
}

const blanc = (m) => ' '.repeat(m.length);

/** Texte visible d'un source TSX, adresses et exceptions masquées : segments [{ debut, fin, texte }]. */
function texteVisible(source, nom = 'page.tsx') {
  const sf = ts.createSourceFile(nom, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const segments = segmentsVisibles(sf).map(({ debut, fin }) => {
    let texte = source.slice(debut, fin);
    for (const masque of MASQUES) texte = texte.replace(masque, blanc);
    for (const { motif } of EXCEPTIONS) texte = texte.replace(motif, blanc);
    return { debut, fin, texte };
  });
  return { sf, segments };
}

/** Fautes d'un source TSX : { fautes: [{ ligne, mot, correction, extrait }], segments }. */
function fautesDuSource(source, nom) {
  const { sf, segments } = texteVisible(source, nom);
  const fautes = [];
  for (const { debut, fin, texte } of segments) {
    for (const m of texte.matchAll(FAUTE)) {
      const position = debut + m.index;
      const extrait = source
        .slice(Math.max(debut, position - 30), Math.min(fin, position + m[0].length + 30))
        .replace(/\s+/g, ' ')
        .trim();
      fautes.push({
        ligne: sf.getLineAndCharacterOfPosition(position).line + 1,
        mot: m[0],
        correction: memeCasse(m[0], CORRECTION.get(m[0].toLowerCase())),
        extrait,
      });
    }
  }
  return { fautes, segments: segments.length };
}

/* ── Témoin de fonctionnement ─────────────────────────────────────────────── */

/**
 * Avant de lire les pages, le contrôle doit rougir sur ce source connu : un
 * extracteur devenu aveugle (AST TypeScript qui change, contexte mal classé)
 * laisserait sinon le contrôle vert pour toujours. Sont attendus, dans l'ordre :
 * la question FAQ, le gabarit, le texte JSX (dont l'accent partiel « déja »), la
 * prop title et le tableau mappé. Rien d'autre : className, to, id, path, clé
 * i18n, comparaison, argument d'appel, <code>, commentaire et adresse citée
 * doivent rester muets. Chacune de ces règles, sabotée seule, fait rougir le témoin.
 */
const SOURCE_TEMOIN = [
  "const faq = [{ question: 'Quelle rentabilite ?', answer: `Le cout ${prix} au kilo` }];",
  'export default function Temoin() {',
  '  return (',
  '    <div className="rentabilite">',
  '      <p>Ce texte est tres clair, déja lu. Source : economie.gouv.fr/seuil-rentabilite</p>',
  '      <Link to="/blog/seuil-rentabilite" id="rentabilite">Déjà lu</Link>',
  '      <SEOHead title="Méthode : etre rentable" path="/methode" />',
  "      {['Apres le service'].map((l) => <li key={l}>{l}</li>)}",
  "      {t('rentabilite.titre')} {niveau === 'tres' && 'Même'}",
  "      <button onClick={() => track('cta apres lecture')}>Découvrir</button>",
  '      <code>=Quantite*PrixUnitaire</code>',
  '      {/* commentaire : rentabilite */}',
  '    </div>',
  '  );',
  '}',
].join('\n');
const ATTENDU_DU_TEMOIN = 'rentabilite cout tres déja etre Apres';

/* ── Exécution ────────────────────────────────────────────────────────────── */

/** Fichiers désignés par PAGES_DE_CONTENU, chemins absolus triés. */
function pagesDeContenu() {
  const fichiers = new Set();
  for (const motif of PAGES_DE_CONTENU) {
    const dossier = path.join(CLIENT, path.dirname(motif));
    const nom = new RegExp(`^${path.basename(motif).split('*').map(ECHAPPER).join('.*')}$`);
    if (!fs.existsSync(dossier)) continue;
    for (const f of fs.readdirSync(dossier)) if (nom.test(f)) fichiers.add(path.join(dossier, f));
  }
  return [...fichiers].sort();
}

function principal() {
  const lu = fautesDuSource(SOURCE_TEMOIN, 'temoin.tsx').fautes.map((f) => f.mot).join(' ');
  if (lu !== ATTENDU_DU_TEMOIN) {
    console.error('[content:check] ECHEC — le témoin de fonctionnement ne rougit plus comme prévu :');
    console.error(`   attendu : ${ATTENDU_DU_TEMOIN}\n   lu      : ${lu || '(rien)'}`);
    console.error("Le contrôle ne sait plus lire le texte visible : corriger chaineVisible() avant de lui faire confiance.");
    process.exit(1);
  }

  const fichiers = pagesDeContenu();
  if (fichiers.length === 0) {
    // Un contrôle qui ne lit rien passerait au vert sans rien vérifier.
    console.error(`[content:check] ECHEC — aucune page ne correspond à PAGES_DE_CONTENU (${PAGES_DE_CONTENU.join(', ')}).`);
    process.exit(1);
  }

  let segments = 0;
  const signalements = [];
  for (const fichier of fichiers) {
    const resultat = fautesDuSource(fs.readFileSync(fichier, 'utf-8'), fichier);
    segments += resultat.segments;
    const relatif = path.relative(path.join(CLIENT, '..'), fichier).split(path.sep).join('/');
    for (const f of resultat.fautes) signalements.push({ fichier: relatif, ...f });
  }

  console.log(
    `[content:check] ${fichiers.length} pages · ${segments} textes visibles lus · ` +
      `${TEMOINS.length} mots témoins (${CORRECTION.size} formes fautives)`,
  );

  if (signalements.length) {
    console.error(`\n[content:check] ECHEC — ${signalements.length} mot(s) sans accent dans le texte visible :`);
    for (const s of signalements) {
      console.error(`   ${s.fichier}:${s.ligne}  ${s.mot} → ${s.correction}   « ${s.extrait} »`);
    }
    console.error(
      '\nCorrectif : remettre les accents dans ces textes (forme correcte après la flèche), et relire le reste du' +
        ' même texte : un mot témoin trouvé signale presque toujours tout un passage écrit sans accents.' +
        "\nNe pas toucher aux slugs, ancres et classes (to, href, id, className, slug…) : ce contrôle ne les lit pas." +
        "\nSi le mot signalé est un identifiant, il doit vivre dans un attribut ou une propriété technique ;" +
        " si la forme sans accent est voulue (marque, anglicisme, citation), l'ajouter à EXCEPTIONS dans" +
        ' client/scripts/check-content-accents.cjs, avec sa raison.',
    );
    process.exit(1);
  }

  console.log('[content:check] OK — aucun mot témoin sans accent dans le texte visible des pages de contenu.');
}

if (require.main === module) principal();

module.exports = { texteVisible, fautesDuSource, formesFautives, pagesDeContenu, TEMOINS, FAUTE };
