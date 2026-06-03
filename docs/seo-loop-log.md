# Journal — boucle d'amélioration continue SEO RestauMargin

Mode `/loop` dynamique (auto-rythmé). Chaque tour : santé prod + 1 tâche SEO à fort levier + log.

---

## Itération 1 — 2026-06-03

**Santé prod** : OK
- `/` → 200, titre unique « Logiciel marge restaurant + food cost IA | RestauMargin (29€/mois) »
- `/outils/calculateur-marge-restaurant` → 200, titre unique
- `/logiciel-marge-restaurant` → 200, titre unique

**Tâche traitée** : audit couverture schema.org de la home.
- Schema déjà très complet : SoftwareApplication + AggregateRating + AggregateOffer + FAQPage (9 Q/A) + Organization + WebSite. Pas de manque.

**⚠️ FINDING CRITIQUE — À VALIDER PAR LE USER (non corrigé en auto)** :
- La home (`client/index.html` l.92-93) déclare `AggregateRating` **ratingValue 4.8 / reviewCount 150**.
- Les pages `AlternativeLAddition.tsx`, `AlternativeLightspeed.tsx`, `AlternativeTheFork.tsx` (+ autres Alternative\*) déclarent **4.8 / 47 avis**.
- Ces avis sont vraisemblablement fictifs (incohérence 150 vs 47 ; pas de page d'avis réels vérifiables).
- **Risques** : (1) action manuelle Google « faux avis structurés » → suppression de TOUS les rich results du domaine + perte de confiance ; (2) faux avis = pratique trompeuse (DGCCRF, France).
- **Options** (décision user) : (a) retirer l'AggregateRating partout ; (b) la baisser à des chiffres réels (ex. masquer tant qu'il n'y a pas assez d'avis vrais) ; (c) mettre en place une vraie collecte d'avis et n'afficher le schema qu'à partir de N avis réels.
- **Non corrigé en boucle** : impact business visible (perte des étoiles SERP), choix potentiellement délibéré → revient au user.

**Prochaine action (itération 2)** : audit maillage interne vers les pages à pousser (calculateur, /logiciel-marge-restaurant) + détection éventuelle de titres dupliqués dans prerender.cjs.
