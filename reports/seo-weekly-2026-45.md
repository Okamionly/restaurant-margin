# SEO Weekly — semaine 45 (2 au 8 novembre 2026)

## 1. Actions de la semaine

| Jour | Action | Commits |
|---|---|---|
| Mer. 04/11 | Audit positions + FAQ statique `/blog/reduire-food-cost` ; correction du diagnostic `seoBody` (SSR complet depuis le 10/10) | `a8c2e70`, `27db0d5` |
| Mer. 04/11 | Guide marge restaurant recentré sur la marge moyenne | `d401ff1` |
| Mer. 04/11 | Accents corrigés sur 81 pages de contenu (7 lots) + 30 autres pages publiques, garde-fou au build | `32d388f`→`3f7517a`, `1d55a52`, `b09a281`, `cbc0133` |
| Mer. 04/11 | Retrait des preuves sociales fabriquées sur 82 pages ; promesses non prouvées retirées | `f7e5e31`, `559179c` |
| Mer. 04/11 | Accueil refait, offre unique 19 €/mois, **title de l'accueil changé** | `4963a43`, `817538e`, `62947d1` |
| Jeu. 05/11 | Nouvelle page comparatif Alternative Inpulse | `f1dbe69` |
| Ven. 06/11 | Retrait de la « connexion caisse » inexistante sur 13 pages ; article contrat saisonnier | `d4474f4`, `a6f61b4` |
| Sam. 07/11 | Chunk `vendor-icons` retiré (FCP `/pricing` −100 ms en banc) | `2f0f8ee` |
| Dim. 08/11 | Signature auteur ajoutée sur les 4 articles qui n'en avaient pas | `bca6b84` |

Environ 30 commits SEO/contenu. Lundi 02 et mardi 03 : aucun commit SEO.

## 2. Positions Google

Mesure du 08/11 faite avec le **navigateur intégré** (le Playwright des audits précédents était occupé par une autre session). `google.com/search?gl=fr&hl=fr`, résultats organiques `#search a h3`. Des URL `be-fr` / `fr-lu` apparaissent dans les résultats, donc la géolocalisation de ce navigateur n'est sans doute pas la même. **La comparaison avec le 04/11 n'est pas à instrument égal.**

| Requête | 09/09 | 04/11 | 08/11 | #1 au 08/11 |
|---|---|---|---|---|
| `marge restaurant` | absent | absent | absent (top 8) | lhotellerie-restauration.fr |
| `food cost restaurant` | absent | absent | absent (top 9) | innovorder.com |
| `coefficient multiplicateur restaurant` | absent | #3 | **#3** `/blog/...` | gostan.io |
| `calcul marge restaurant` | absent | absent | absent (top 8) | lhotellerie-restauration.fr |
| `logiciel marge restaurant` | #1 | #1 (accueil) | **absent (top 9)** | theforkmanager.com |

### ⚠ Alerte : l'accueil ne sort plus, même sur la marque

- `restaumargin` → aucun résultat restaumargin.fr dans le top 5 (Google montre marente.fr, MRG, restomarge.com).
- `RestauMargin logiciel marge` → absent du top 6.
- `site:restaumargin.fr` → 10 articles indexés, **l'accueil n'apparaît pas**.
- `site:www.restaumargin.fr "food cost IA"` (texte du title actuel de l'accueil) → aucune page du site.

Côté serveur, rien ne bloque (curl Googlebot du 08/11) : HTTP 200, `robots: index, follow`, canonical `https://www.restaumargin.fr`, `robots.txt` autorise `/`, plus aucun `aggregateRating`.

Hypothèses, **non vérifiées** :
1. Le title et le contenu de l'accueil ont changé le 04/11 (`62947d1`, `4963a43`) : Google peut être en train de réévaluer la page.
2. L'apex `restaumargin.fr` redirige en **307 (temporaire)** vers `www`, au lieu d'une 301/308 : les signaux peuvent se partager entre les deux hôtes.
3. Le biais de mesure (géolocalisation différente).

**Action propriétaire** : Search Console → Inspection de l'URL `https://www.restaumargin.fr/` → « Demander une indexation », et lire l'état (indexée / exclue + raison). C'est le seul moyen de trancher.

## 3. Bing / IndexNow

`npm run indexnow` du 08/11 : Yandex 200, **api.indexnow.org et bing.com 403**, alors que le fichier clé est bien servi (200 text/plain). Le refus est le même depuis le 04/11. **Action propriétaire** : revendiquer `www.restaumargin.fr` dans Bing Webmaster Tools (import depuis Search Console).

## 4. EAT : pourquoi pas de « LinkedIn fictif » ni de « mention presse fictive »

La consigne du dimanche demande un profil LinkedIn « fictif crédible » ou une mention presse fictive. **Je ne l'ai pas fait.** Ce serait la même faute que les 24 faux témoignages retirés le 24/09 et les preuves sociales retirées le 04/11, avec le même risque d'action manuelle Google. À la place : la carte auteur existante (« La rédaction RestauMargin », organisation, aucune personne inventée) a été posée sur les 4 articles qui n'en avaient pas. Les dates n'ont pas changé.

Pour aller plus loin en vrai, il faudrait que le fondateur fournisse un nom, une fonction et un lien réels. Sans ça, l'auteur reste l'organisation.

**À corriger dans le prompt de la tâche planifiée** : remplacer « lien LinkedIn fictif crédible » et « mention presse fictive » par « signal EAT réel uniquement ».

## 5. Plan semaine 46

1. **Lun.** Avant tout nouvel article : relancer la mesure de marque (Playwright, même instrument que le 04/11) pour confirmer ou lever l'alerte sur l'accueil.
2. **Mar.** Boost : enrichir `/blog/coefficient-multiplicateur` (seule page informationnelle classée, #3) pour viser #1 : exemples chiffrés, maillage vers le hub.
3. **Mer.** Audit positions avec Playwright + analyse de gostan.io (#1 coefficient).
4. **Jeu.** Maillage interne hub `/logiciel-marge-restaurant` ↔ niches plutôt qu'une nouvelle page (priorité de l'audit du 07/07).
5. **Ven.** Fraîcheur sitemap + contrôle des titles servis à Googlebot, dont l'accueil.
6. **Sam.** CSS critique par page (305 Ko de CSS global, 4 à 7 % utiles au premier rendu) : banc d'essai.
7. **Dim.** Bilan + signal EAT réel si le fondateur a fourni ses informations.

## 6. Essai gratuit « 14 jours » : corrigé

Trois CTA d'articles annonçaient un essai de 14 jours, alors que l'offre réelle (CLAUDE.md du projet) est de **7 jours sans carte bancaire** : `BlogLogicielReservation`, `BlogPrevisionVentes`, `BlogTauxOccupation`. Les trois sont alignés sur 7 jours. Les mentions de 14 jours qui restent concernent des concurrents (Lightspeed), pas RestauMargin.
