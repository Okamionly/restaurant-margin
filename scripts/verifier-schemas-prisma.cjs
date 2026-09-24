#!/usr/bin/env node
/**
 * Garde : les deux schemas Prisma du depot doivent rester identiques.
 *
 * POURQUOI CE FICHIER EXISTE
 * Le depot porte DEUX schemas :
 *   - prisma/schema.prisma          -> celui dont derive le client utilise par les
 *                                      fonctions serverless de api/ et api-lib/
 *   - server/prisma/schema.prisma   -> celui que `build:vercel` regenere
 *                                      (`cd server && npx prisma generate`)
 *
 * Constate le 2026-09-18 : ils avaient DIVERGE. Le champ `signupSource` existait
 * dans celui de la racine et dans la base, mais pas dans celui de server/.
 * Rien n'a casse — les serverless resolvaient le client de la racine — mais c'est
 * un piege arme : le jour ou la resolution change, ou qu'un `prisma generate`
 * ecrase le bon client, une ecriture part sur un champ que le client ne connait
 * pas. Et personne ne l'aurait vu, parce qu'aucun test ne compare ces fichiers.
 *
 * La comparaison ignore l'indentation et les lignes vides : sur le cas reel,
 * `diff` brut annoncait 60 lignes differentes alors qu'UNE SEULE divergence de
 * fond existait. Une garde qui crie a 60 problemes quand il y en a un est une
 * garde qu'on apprend a ignorer.
 *
 * Usage : node scripts/verifier-schemas-prisma.cjs
 * Sort en code 1 si les schemas different (fait rougir le job CI).
 */

const fs = require('fs');
const path = require('path');

const RACINE = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const SERVEUR = path.join(__dirname, '..', 'server', 'prisma', 'schema.prisma');

/** Normalise : ignore indentation, espaces multiples et lignes vides. */
function normaliser(contenu) {
  return contenu
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter((l) => l.length > 0);
}

function lire(chemin, etiquette) {
  if (!fs.existsSync(chemin)) {
    console.error(`::error::Schema introuvable (${etiquette}) : ${chemin}`);
    process.exit(1);
  }
  return normaliser(fs.readFileSync(chemin, 'utf8'));
}

const a = lire(RACINE, 'racine');
const b = lire(SERVEUR, 'server');

const seulementRacine = a.filter((l) => !b.includes(l));
const seulementServeur = b.filter((l) => !a.includes(l));

if (seulementRacine.length === 0 && seulementServeur.length === 0) {
  console.log(`✓ Les deux schemas Prisma concordent (${a.length} lignes utiles).`);
  process.exit(0);
}

console.error('::error::Les deux schemas Prisma ont DIVERGE.');
console.error('');
if (seulementRacine.length) {
  console.error(`Present dans prisma/schema.prisma mais ABSENT de server/ (${seulementRacine.length}) :`);
  seulementRacine.slice(0, 20).forEach((l) => console.error(`  + ${l}`));
  if (seulementRacine.length > 20) console.error(`  … et ${seulementRacine.length - 20} autres`);
  console.error('');
}
if (seulementServeur.length) {
  console.error(`Present dans server/prisma/schema.prisma mais ABSENT de la racine (${seulementServeur.length}) :`);
  seulementServeur.slice(0, 20).forEach((l) => console.error(`  - ${l}`));
  if (seulementServeur.length > 20) console.error(`  … et ${seulementServeur.length - 20} autres`);
  console.error('');
}
console.error('Reportez la difference dans les DEUX fichiers, puis relancez.');
process.exit(1);
