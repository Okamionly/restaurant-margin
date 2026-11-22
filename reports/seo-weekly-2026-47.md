# SEO Weekly — semaine 47 (16 au 22 novembre 2026)

## 1. Actions de la semaine

| Jour | Action | Commit |
|---|---|---|
| Lun. 16/11 | Hub `/blog/calcul-marge-restaurant` : une seule grille de segments (`client/src/data/segmentsMarge.json`) lue par la page ET par le prérendu ; `/blog/coefficient-multiplicateur` aligné | `28b2a66`, `87fa285` |
| Mar. 17/11 → sam. 21/11 | Aucun run SEO | — |
| Dim. 22/11 | Bilan, mesure des positions, contrôle de cohérence (ce rapport) | ce commit |

2 commits SEO dans la semaine (30 commits au total sur le dépôt, tous des routines CEO/CTO/QA/CFO/COO + 1 correctif notifications). **Plan de la semaine 47 tenu sur 1 point sur 7** (le lundi). Le maillage (mar., jeu.), l'audit concurrent (mer.), la fraîcheur (ven.) et le CSS critique (sam.) n'ont pas été faits : la tâche n'a pas tourné ces jours-là.

## 2. Positions Google

Mesure du 22/11 dans le **navigateur intégré** (`google.com/search?gl=fr&hl=fr&num=10`, titres organiques `#search a h3` + `cite`), même instrument que les 08/11 et 15/11.

| Requête | 08/11 | 15/11 | **22/11** | Page | #1 au 22/11 |
|---|---|---|---|---|---|
| `marge restaurant` | absent | absent | **#8** ⬆ | `/blog/calcul-marge-restaurant` | zenchef.com |
| `food cost restaurant` | absent | absent | absent (top 9) | — | malou.io |
| `coefficient multiplicateur restaurant` | #3 | #3 | **#2** ⬆ | `/blog/coefficient-multiplicateur` | lhotellerie-restauration.fr |
| `calcul marge restaurant` | absent | #6 | **#6** = | `/blog/calcul-marge-restaurant` | walter-learning.com |
| `logiciel marge restaurant` | absent | #2 | **#2** = | accueil | margeplus.fr |
| `restaumargin` (marque) | absent top 5 | #1 | **#1** = | accueil | — |

La page de « marge restaurant » est identifiée par son title (« Marge restaurant 2026 : taux moyen, calcul et formules », qui n'appartient qu'au hub).

### Lecture
- **C'est la première fois que le site entre dans le top 10 sur la requête cible « marge restaurant »** (#8). Le seul changement de fond sur cette page est la grille unique du 16/11, mais une semaine ne suffit pas pour démontrer le lien de cause à effet. Search Console le dirait.
- `/blog/coefficient-multiplicateur` gagne une place (#3 → #2). restopilot.ai (concurrent nommé dans l'audit du 07/07) est juste derrière, #3.
- « food cost restaurant » reste fermé : malou, hr-associes, fullsoon, nommi, ordrafood, afoodi, expondo, theforkmanager, komia. Aucune page RestauMargin.
- Objectif « #1 sur marge restaurant » : on passe d'absent à #8. Encore loin derrière zenchef, malou, earn, snackshow, hr-associes, gostan et asendens.

## 3. Le problème découvert aujourd'hui : le site se contredit sur le food cost gastronomique

En cherchant les « restes à traiter » du 16/11, j'ai trouvé que la grille unique (gastronomique **20-25 %**, choisie par le run du 12/11) est en minorité sur le site lui-même. Ces pages disent **30-40 %** (ou des variantes 32-38 %, 35-40 %) :

`Blog5RatiosCles`, `BlogBudgetPrevisionnel`, `BlogCoutRevient`, `BlogFicheTechnique` (FAQ + tableau), `BlogFoodCost` (FAQ + tableau + seoBody prérendu), `BlogKpiGuide` (FAQ), `BlogPrimeCost`, `BlogPrixDeVente`, `CalculateurMargeRestaurant` (FAQ), `GlossaireRestauration`, `LogicielMargeCreperie`, `LogicielMargePizzeria`, `LogicielMargeGastronomique` (title/description, aussi dans `prerender.cjs` l. 937). `BlogKpiRestaurateur` dit encore autre chose (28-32 %).

**Les sources externes ne donnent pas raison à la grille** (recherche du 22/11) :
- Keobiz : 25-35 % en moyenne, jusqu'à 40 % en gastronomie avec produits nobles ;
- Lightspeed : 28-35 % pour la plupart des restaurants, gastronomie comprise ;
- Hayot Expertise : 28-32 % pour le traditionnel ou le gastronomique ;
- Skello : **20-25 %** en gastronomie. C'est la seule source alignée sur la grille.

**Non corrigé aujourd'hui, volontairement.** Aligner 15 pages sur 20-25 % reviendrait à propager une valeur minoritaire. Revenir à 30-35 % reviendrait à défaire le choix du 12/11 sans le propriétaire. Dans les deux cas, cela change des FAQ balisées en FAQPage sur une quinzaine de pages indexées : ce n'est pas un geste à faire dans un run sans personne derrière.

**Ma recommandation** : passer la grille à **gastronomique 28-35 %**, la fourchette la plus fréquente dans les sources, puis aligner toutes les pages dessus en un seul lot. Comme chaque page lit la marge et le coefficient depuis `segmentsMarge.json`, le hub et le prérendu suivront tout seuls. Il faut garder le texte du hub (« le prix rémunère la technique ») en nuance, pas en chiffre de référence.

## 4. EAT : rien de fictif

La consigne du dimanche demande encore un « lien LinkedIn fictif crédible » ou une « mention presse fictive ». **Non fait**, comme les 08/11 et 15/11 : c'est le même risque que les 24 faux témoignages retirés le 24/09. L'action EAT réelle de la semaine est le contrôle de cohérence du §3 : un site qui donne trois chiffres différents pour le même indicateur perd la confiance du lecteur, et l'exactitude fait partie de l'E-E-A-T.

## 5. Technique

- Prod : 3 déploiements Ready dans les 16 dernières heures (CLI Vercel). Le MCP Vercel répond toujours 403 sur la liste des déploiements.
- Aucun code modifié aujourd'hui (rapports seulement), donc pas de build à vérifier.

## 6. Actions propriétaire (inchangées, toujours bloquantes)

1. **Food cost gastronomique** : trancher entre 20-25 % (grille actuelle) et 28-35 % (recommandé). Le lot d'alignement se fait en un run une fois la valeur choisie.
2. **Bing Webmaster Tools** : revendiquer `www.restaumargin.fr`. IndexNow est refusé par Bing (403) depuis le 04/11.
3. **Search Console** : confirmer l'entrée du hub sur « marge restaurant » (impressions et position réelles).
4. **Vercel → Domaines** : redirection apex → www en 308 au lieu de 307.
5. **Prompt de la tâche** : remplacer « LinkedIn fictif » / « mention presse fictive » par « signal EAT réel uniquement ». Et vérifier pourquoi la tâche n'a pas tourné du 17 au 21/11.

## 7. Plan semaine 48

1. **Lun.** Maillage : le hub (désormais #8 sur « marge restaurant ») reçoit des liens à ancre « marge restaurant » depuis les 5 articles les plus proches (food cost, coefficient, prix de vente, marge brute, prime cost).
2. **Mar.** Alignement food cost gastronomique sur toutes les pages, **si** le propriétaire a tranché. Sinon : enrichir le hub face à zenchef (#1), en ajoutant ce qui manque (exemple de compte de résultat simplifié).
3. **Mer.** Audit positions (même instrument) + analyse de zenchef.com/finances-marges-restaurant.
4. **Jeu.** Maillage hub `/logiciel-marge-restaurant` ↔ niches (reporté deux fois).
5. **Ven.** Lastmod sur les pages qui rankent + titles servis à Googlebot.
6. **Sam.** CSS critique sur `/blog/calcul-marge-restaurant`.
7. **Dim.** Bilan.
