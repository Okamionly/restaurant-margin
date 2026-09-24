#!/usr/bin/env node
/**
 * Garde : aucune preuve sociale fabriquee dans le contenu du site.
 *
 * POURQUOI CE FICHIER EXISTE
 * Le 2026-09-24, 24 temoignages clients nominatifs ENTIEREMENT INVENTES et trois
 * chiffres d'adoption contradictoires ("150+", "320+", "500+ restaurants")
 * etaient en ligne et indexes. Ils avaient ete ecrits par les agents de contenu
 * du parc (blog-writer, seo-writer, cmo, workforce), qui fabriquent de la preuve
 * sociale par defaut des que rien ne l'interdit.
 *
 * Publier de faux avis de consommateurs est une pratique commerciale trompeuse
 * (Code de la consommation, art. L121-2 et suivants).
 *
 * Une regle ecrite dans CLAUDE.md se lit — ou ne se lit pas. Cette garde, elle,
 * fait ROUGIR le CI : c'est la difference entre une intention et un interdit.
 *
 * Usage : node scripts/verifier-preuve-sociale.cjs
 * Sort en 1 si une allegation non sourcee est detectee.
 */

const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', 'client', 'src');

// Chaque motif dit ce qu'il cherche ET pourquoi, pour que le message d'echec
// soit actionnable sans avoir a lire ce fichier.
const MOTIFS = [
  {
    nom: "nombre d'etablissements clients",
    // Le "+" accole est la SIGNATURE de l'allegation promotionnelle : "150+
    // restaurants", "500+ restaurateurs", "320+ brigades".
    //
    // Sans cette exigence, la garde attrapait "Plus de 4 500 references" dans la
    // fiche du fournisseur Pomona et "Top 10 clients by revenue" (un libelle de
    // fonctionnalite) : 5 faux positifs sur 7 au premier essai. Un detecteur qui
    // signale surtout du legitime n'est pas lu longtemps — on prefere rater un
    // cas tordu que crier a tort.
    regex: /\b\d{2,}\s*\+\s*(restaurants?|brigades?|etablissements?|établissements?|clients?|restaurateurs?)\b/gi,
    pourquoi: "laisse entendre une adoption large. Reel : une vingtaine de comptes, aucun abonne payant.",
  },
  {
    nom: 'adoption revendiquee en toutes lettres',
    // Attrape les formulations sans chiffre : "Rejoint par des centaines de
    // restaurateurs", "nous font confiance", "des milliers d'etablissements".
    regex: /(rejoint par|nous font confiance|font deja confiance|utilise par)\s+(des\s+)?(\d|centaines|milliers|nombreux)/gi,
    pourquoi: 'revendique une adoption qui ne peut pas etre justifiee.',
  },
  {
    nom: 'note client auto-attribuee',
    regex: /\b[0-5][.,]\d\s*\/\s*5\b/g,
    pourquoi: "aucune note client n'a jamais ete collectee.",
  },
  {
    nom: "nombre d'avis sur RestauMargin",
    regex: /sur\s+\d+\s+avis/gi,
    pourquoi: "aucun avis client n'existe.",
  },
  {
    nom: 'label de popularite non mesure',
    regex: /plateforme\s+(n°?\s*1|#1)|logiciel\s+(n°?\s*1|#1)|le\s+plus\s+utilise/gi,
    pourquoi: 'rien ne permet de soutenir un classement.',
  },
];

/**
 * Fichiers ignores.
 * `data/` contient les fiches de FOURNISSEURS reels (Pomona, Metro, Transgourmet)
 * avec leurs chiffres d'affaires et leurs references : ce sont des donnees sur des
 * tiers, pas des allegations sur RestauMargin.
 */
const IGNORES = [
  /\.test\.tsx?$/, /\.spec\.tsx?$/, /\/tests?\//,
  /\/data\//,
  // Journaux d'outillage : pas du contenu publie.
  /\/logs?\//,
  // Page DE-ROUTEE le 2026-09-24 (hors sitemap, Disallow, 301 vers l'accueil).
  // Conservee telle quelle pour memoire ; la signaler a chaque run ferait rougir
  // le CI pour un contenu qui n'atteint plus personne.
  /Temoignages\.tsx$/,
  // Comparatifs : les notes qui y figurent sont celles des CONCURRENTS (Skello,
  // Cashpad, Lightspeed...), relevees sur Capterra et G2. Ce sont des donnees
  // sur des tiers, pas des allegations sur RestauMargin — dont la note propre a
  // ete remplacee par "Trop recent".
  /Comparatif[A-Za-z]*\.tsx$/,
  /BlogLogiciel[A-Za-z]*\.tsx$/,
  // Articles PEDAGOGIQUES sur les avis Google : ils expliquent au restaurateur
  // comment gerer SES avis ("un restaurant avec 4,5 etoiles sur 200 avis ecrase
  // un concurrent a 4,1"). Ce sont des exemples destines au lecteur, pas des
  // allegations sur RestauMargin.
  /BlogGoogleMyBusiness\.tsx$/,
  /BlogTauxOccupation\.tsx$/,
];

function listerFichiers(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listerFichiers(p));
    else if (/\.(tsx?|json)$/.test(e.name) && !IGNORES.some((r) => r.test(p.replace(/\\/g, '/')))) out.push(p);
  }
  return out;
}

/**
 * Une ligne commentee est une EXPLICATION du defaut corrige, pas le defaut.
 * Sans cette exclusion, les notes laissees en place pour expliquer le retrait
 * feraient elles-memes rougir la garde — et on les supprimerait, perdant la
 * memoire du pourquoi.
 */
function estCommentaireSimple(ligne) {
  const t = ligne.trim();
  return t.startsWith('//') || t.startsWith('*');
}

/**
 * Marque les lignes appartenant a un bloc de commentaire.
 * Indispensable : les notes laissees en place pour expliquer un retrait citent
 * forcement le texte retire. Une detection ligne par ligne prenait la ligne du
 * MILIEU d'un bloc {\/* ... *\/} pour du code — c'est ainsi que la garde s'est
 * signalee elle-meme sur son propre commentaire d'explication au 1er essai.
 */
function lignesCommentees(lignes) {
  const dedans = new Set();
  let ouvert = false;
  lignes.forEach((ligne, i) => {
    if (ouvert) dedans.add(i);
    let reste = ligne;
    while (true) {
      if (!ouvert) {
        const d = reste.search(/\/\*/);
        if (d === -1) break;
        ouvert = true;
        dedans.add(i);
        reste = reste.slice(d + 2);
      } else {
        const fin = reste.indexOf('*/');
        if (fin === -1) break;
        ouvert = false;
        reste = reste.slice(fin + 2);
      }
    }
  });
  return dedans;
}

const trouvailles = [];
for (const f of listerFichiers(RACINE)) {
  const lignes = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  const commentees = lignesCommentees(lignes);
  lignes.forEach((ligne, i) => {
    if (estCommentaireSimple(ligne) || commentees.has(i)) return;
    for (const m of MOTIFS) {
      m.regex.lastIndex = 0;
      const trouve = ligne.match(m.regex);
      if (trouve) {
        trouvailles.push({
          fichier: path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/'),
          ligne: i + 1,
          motif: m.nom,
          pourquoi: m.pourquoi,
          extrait: trouve[0].trim(),
        });
      }
    }
  });
}

if (trouvailles.length === 0) {
  console.log('✓ Aucune preuve sociale fabriquee detectee.');
  process.exit(0);
}

console.error('::error::Preuve sociale non sourcee detectee — voir la regle dans CLAUDE.md.');
console.error('');
for (const t of trouvailles) {
  console.error(`  ${t.fichier}:${t.ligne}`);
  console.error(`    trouve  : "${t.extrait}"  (${t.motif})`);
  console.error(`    pourquoi: ${t.pourquoi}`);
  console.error('');
}
console.error(`${trouvailles.length} occurrence(s).`);
console.error('Remplacer par un fait verifiable (essai 7 jours sans carte, 29 EUR/mois,');
console.error('fiches illimitees), ou supprimer. Dans le doute, ecrire moins.');
process.exit(1);
