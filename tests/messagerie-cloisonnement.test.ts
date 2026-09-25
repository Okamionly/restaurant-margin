/**
 * Non-regression : chaque route /api/messages/conversations/:id doit verifier
 * que la conversation appartient au restaurant de l'appelant.
 *
 * Contexte (2026-09-25) : cinq de ces routes — lecture des messages, envoi,
 * marquage lu, suppression, favori — cherchaient la conversation par son SEUL
 * id. Un compte d'essai pouvait lire, supprimer ou ecrire dans la conversation
 * d'un autre restaurant, et l'envoi partait par email reel depuis contact@. Les
 * routes voisines, elles, filtraient bien : le defaut n'etait visible qu'en les
 * comparant une a une.
 *
 * Ce test fait cette comparaison a chaque CI. Il est statique (il lit le source)
 * parce que le fichier api/index.ts monte toute l'application Express : un test
 * de bout en bout demanderait deux comptes reels en base, ce qu'on ne fabrique
 * pas. Il couvre donc la regle « aucune route :id sans garde », pas le
 * comportement Prisma — qui, lui, est un simple findFirst sur (id, restaurantId).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const SOURCE = readFileSync(join(__dirname, '..', 'api', 'index.ts'), 'utf8');

/** Formes de garde acceptees : helper dedie, ou filtre explicite par restaurant. */
const GARDE = /conversationDuRestaurant\(req\)|restaurantId:\s*req\.restaurantId|restaurantId\s*!==\s*req\.restaurantId/;

function routesConversationParId(source: string) {
  const re = /app\.(get|post|put|delete)\('(\/api\/messages\/conversations\/:id[^']*)'[\s\S]*?\n\}\);/g;
  const routes: { methode: string; chemin: string; corps: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) routes.push({ methode: m[1].toUpperCase(), chemin: m[2], corps: m[0] });
  return routes;
}

describe('Messagerie — cloisonnement entre restaurants', () => {
  const routes = routesConversationParId(SOURCE);

  it('trouve bien les routes a controler (la sonde lit quelque chose)', () => {
    // Si ce nombre tombe a 0, c'est la regex qui ne lit plus le source — pas la
    // preuve que tout va bien. Une garde qui ne sait pas lire doit rougir.
    expect(routes.length).toBeGreaterThanOrEqual(7);
  });

  it.each(routesConversationParId(SOURCE).map((r) => [`${r.methode} ${r.chemin}`, r.corps]))(
    '%s verifie le restaurant de la conversation',
    (_nom, corps) => {
      expect(corps).toMatch(GARDE);
    },
  );

  it("la garde partagee filtre bien par id ET restaurant", () => {
    const helper = SOURCE.match(/async function conversationDuRestaurant\(req: any\) \{[\s\S]*?\n\}/);
    expect(helper, 'helper conversationDuRestaurant introuvable').not.toBeNull();
    expect(helper![0]).toMatch(/findFirst/);
    expect(helper![0]).toMatch(/restaurantId:\s*req\.restaurantId/);
  });
});
