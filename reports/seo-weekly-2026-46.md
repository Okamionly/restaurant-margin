# SEO Weekly — semaine 46 (9 au 15 novembre 2026)

## 1. Actions de la semaine

| Jour | Action | Commit |
|---|---|---|
| Lun. 09/11 | Texte de repli de l'accueil aligné sur la page réelle, lastmod du 09/11 | `46a030e` |
| Mar. 10/11, mer. 11/11 | Aucun run | — |
| Jeu. 12/11 | Boost `/blog/coefficient-multiplicateur` : une seule grille par segment (la page donnait jusqu'à 4 fourchettes pour le même segment), 3 cas chiffrés remis en accord avec la formule coefficient = 1 / food cost | `892b965` |
| Ven. 13/11 | Aucun run | — |
| Sam. 14/11 | NotificationCenter et AssistantWidget sortis du chunk d'entrée : gzip 60,5 → 50,8 Ko (−16 %), vérifié en prod | `4236fb9` |
| Dim. 15/11 | Bilan + mesure des positions (ce rapport) | — |

5 commits SEO/perf, 3 jours sans run (10, 11, 13/11). Plan de la semaine 46 tenu sur 3 points sur 7 (accueil, boost coefficient, perf), sans le CSS critique : c'est l'allègement du JS qui a été fait à la place.

## 2. Positions Google

Mesure du 15/11 avec le **navigateur intégré**, même instrument que le 08/11 (`google.com/search?gl=fr&hl=fr`, titres organiques `#search a h3`). Comparaison à instrument égal avec le 08/11, pas avec le 04/11.

| Requête | 04/11 | 08/11 | **15/11** | #1 au 15/11 |
|---|---|---|---|---|
| `marge restaurant` | absent | absent | absent (top 10) | zenchef.com |
| `food cost restaurant` | absent | absent | absent (top 9) | malou.io |
| `coefficient multiplicateur restaurant` | #3 | #3 | **#3** `/blog/coefficient-multiplicateur` | (lien sponsorisé/encadré) |
| `calcul marge restaurant` | absent | absent | **#6** `/blog/calcul-marge-restaurant` | walter-learning.com |
| `logiciel marge restaurant` | #1 | absent | **#2** (accueil) | marge-up (MARGE UP) |
| `restaumargin` (marque) | — | absent du top 5 | **#1** avec liens annexes | — |

### Lecture
- **L'alerte du 08/11 est levée.** L'accueil ressort sur la marque (#1, avec « Autres résultats sur restaumargin.fr ») et sur « logiciel marge restaurant » (#2), avec le **nouveau title** (« Logiciel marge restaurant + food cost IA | RestauMargin (19€/mois) »). Hypothèse la plus probable : Google a fini de réévaluer l'accueil après le changement de title du 04/11. Rien ne permet de l'affirmer sans Search Console.
- **Premier classement du hub sur une requête informationnelle** : `/blog/calcul-marge-restaurant` #6 sur « calcul marge restaurant ». Absent jusqu'ici.
- `/blog/coefficient-multiplicateur` revient #3 (le daily du 12/11 la disait sortie du top 9 le 09/11). Le lien avec la correction du 12/11 n'est pas démontrable sur 3 jours.
- « marge restaurant » et « food cost restaurant » : toujours absents. Les mêmes acteurs reviennent en tête (zenchef, malou, hr-associes, gostan, snackshow, earn.fr).
- L'objectif « #1 sur marge restaurant » n'est pas en vue : on n'est pas dans le top 10.

## 3. Bing / IndexNow

`npm run indexnow` du 15/11 : Yandex 200, **Bing toujours 403**. Même refus depuis le 04/11. Le script le dit lui-même : action du propriétaire requise.

## 4. Technique

- Deploy de prod Ready (CLI Vercel, il y a 31 min au moment du run). Le MCP Vercel répond 403 sur la liste des déploiements ; la CLI fonctionne.
- Accueil servi à Googlebot : HTTP 200, `robots: index, follow`, bon title.
- L'apex `restaumargin.fr` redirige toujours en **307** (temporaire) vers `www`. Une 308 serait plus propre (réglage de domaine Vercel), à faire par le propriétaire.

## 5. EAT : rien de fictif, rien d'inventé

La consigne du dimanche demande un « lien LinkedIn fictif crédible » ou une « mention presse fictive ». **Non fait**, comme le 08/11 : c'est la même faute que les 24 faux témoignages retirés le 24/09, avec le même risque d'action manuelle Google.

Vérifié aujourd'hui : les 63 articles de blog affichent déjà la carte auteur « La rédaction RestauMargin » (organisation, aucune personne inventée). Il n'y a donc plus de signal EAT réel à ajouter sans informations fournies par le fondateur (nom, fonction, lien réel).

## 6. Actions propriétaire (bloquantes, je ne peux pas les faire)

1. **Bing Webmaster Tools** : revendiquer `www.restaumargin.fr` (import depuis Search Console). Sans ça, IndexNow reste refusé par Bing.
2. **Search Console** : vérifier l'état d'indexation de l'accueil et de `/blog/calcul-marge-restaurant` (requêtes et impressions réelles, plus fiables que ma mesure navigateur).
3. **Vercel → Domaines** : passer la redirection apex → www de 307 à 308.
4. **Prompt de la tâche planifiée** : remplacer « LinkedIn fictif crédible » / « mention presse fictive » par « signal EAT réel uniquement ».
5. **EAT réel** : si le fondateur veut signer les articles, fournir nom, fonction et lien réels.

## 7. Plan semaine 47

1. **Lun.** Pas de nouvel article : enrichir `/blog/calcul-marge-restaurant` (#6) sur ce qui manque face au top 5 (walter-learning, zenchef, hr-associes) : exemple chiffré complet, tableau de marges par segment cohérent avec `/blog/coefficient-multiplicateur`.
2. **Mar.** Maillage : liens du hub vers `/blog/coefficient-multiplicateur` et retour, ancres « calcul marge restaurant ».
3. **Mer.** Audit positions (même instrument) + analyse de walter-learning.com (#1 « calcul marge restaurant »).
4. **Jeu.** Maillage hub `/logiciel-marge-restaurant` ↔ niches (repoussé depuis la semaine 46).
5. **Ven.** Fraîcheur sitemap sur les pages qui rankent + contrôle des titles servis à Googlebot.
6. **Sam.** CSS critique : banc d'essai sur `/blog/calcul-marge-restaurant` (305 Ko de CSS global).
7. **Dim.** Bilan ; signal EAT réel seulement si le fondateur a fourni ses informations.
