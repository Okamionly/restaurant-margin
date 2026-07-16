# Log (append-only) — Passe globale RestauMargin : combler les manques UX (etats vides/chargement/erreur, feedbacks), ameliorer la coherence visuelle (theme W&B, typo, espacements) et l'accessibilite WCAG AA (labels de formulaires, contraste, focus visible, navigation clavier, aria, touch targets 44px) ecran par ecran, sans casser le pass mobile 390px ni la logique existante

## [2026-07-16] scaffold | init loop/
Créé contract.md, feature_list.json, progress.md, log.md.

## [2026-07-16] plan | Contrat + feature_list remplis (F1→F14)
Planner : exploration codebase (App.tsx 50 routes protégées ; primitives Button/EmptyState/Toast prêtes).
Scope arrêté = écrans app quotidiens (Blogs/landings SEO/légales/outils publics/WeighStation HORS scope).
Baseline a11y mesurée : 25/50 pages aria-label, 1 seule aria-live loading, 5 labels htmlFor ; slate dans
le scope = Ingredients/Mercuriale/InvoiceScanner/AllergenMatrix/AutoOrders. Mobile pass à préserver
(22 md:hidden, 50 min-w-0).
Écrit : contract.md (Gate G1–G5 + U1–U5 + V1–V6 + A1–A7 + N1–N4 + rubric 4 axes, PASS ≥0.75),
feature_list.json (14 features ordonnées par dépendance, ~24 écrans), progress.md (baseline + next-up).
Gate objectif = `npx vite build` (client/) exit 0 + `node scripts/a11y-audit.mjs <screen>` → 0/0.
Contrainte dure : diffs présentation/a11y uniquement, zéro logique métier, pas de push.
Prochaine étape : generator sur F1 (créer scripts/a11y-audit.mjs + primitives d'états). Ne pas coder ici.

## [2026-07-16] build | F1 — Fondation : audit a11y statique + primitives d'états (tentative 1/3)
Fichiers CRÉÉS (aucun fichier existant modifié — additif pur) :
- `client/scripts/a11y-audit.mjs` — audit statique JSX (scanner tolérant accolades/quotes,
  pas de regex naïve). Arg = chemin écran relatif à client/, multi-fichiers accepté. Rapporte
  `inputs-sans-label` et `boutons-icone-sans-aria-label`. Exclut input type hidden/submit/button/reset ;
  compte type dynamique/absent. Détecte label htmlFor lié, aria-label, aria-labelledby, ET label parent
  implicite (input imbriqué). Bouton-icône = contenu uniquement svg/img/composant-icône auto-fermant,
  sans texte littéral ni expression enfant, sans aria-label/aria-labelledby/title. Messages d'erreur
  orientés action (disent quoi ajouter). Exit 0=propre, 1=violations, 2=usage/fichier introuvable.
  Lecture seule → rejouable.
- `client/src/components/LoadingState.tsx` — U2 canon : role=status + aria-live=polite + aria-busy,
  label sr-only (toujours) + Loader2 animate-spin text-teal-600. Props label/srOnlyLabel/size. Pur.
- `client/src/components/Skeleton.tsx` — Skeleton (animate-pulse, aria-hidden décoratif) + SkeletonList
  (conteneur role=status). Pur.
- `client/src/components/ErrorState.tsx` — U3 canon : role=alert, message + bouton « Réessayer » via
  prop onRetry (réutilise le fetch de l'écran, ne le réécrit pas), réutilise la primitive Button (44px+focus).
Canon documenté : les écrans F2→F14 réutilisent EmptyState/Toast(useToast)/Button EXISTANTS + ces 3 nouvelles
primitives. Ne pas réintroduire de variantes ad hoc.
Vérifs exécutées (sorties réelles, pas auto-notation) :
- `npx vite build` (client/) → exit 0, build en 18.43s (G1). Primitives non encore importées (F2+ les câblera).
- `esbuild` transpile des 3 primitives → exit 0 (syntaxe/JSX OK).
- `node scripts/a11y-audit.mjs src/pages/Dashboard.tsx` → 0/0, exit 0.
- `node scripts/a11y-audit.mjs src/pages/Ingredients.tsx` → détecte 9 inputs-sans-label (ce que F3 corrigera) → non-trivial, l'audit discrimine.
- fichier introuvable → exit 2 + message action ; sans argument → exit 2 + usage.
Non fait par design : aucun écran métier touché (F1 = fondation). awaiting_eval:true. Ne pas se déclarer done.

## [2026-07-16] eval PASS | F1 — Fondation : audit a11y statique + primitives d'états
Evaluator (externe, posture cassé-par-défaut). Preuves d'exécution réelles jointes, pas de lecture seule :
- G1 build : `npx vite build` (client/) -> exit 0 (dist/sw.js + workbox générés). Re-build avec une
  page-sonde important+utilisant les 3 primitives -> exit 0 (imports Button/lucide + export nommé
  SkeletonList résolus, props acceptées). Sonde supprimée après.
- G2 audit : `scripts/a11y-audit.mjs` existe, s'exécute, accepte 1 ou N chemins. Sortie réelle :
  Dashboard.tsx -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, exit 0. Ingredients.tsx -> 9
  inputs détectés (audit non-trivial). Sans arg -> exit 2 + usage. Fichier introuvable -> exit 2 + message.
- Critère 2 (discrimination) : fixture forgée -> type hidden/submit/button/reset EXCLUS (0/4 comptés) ;
  text/select/textarea/type dynamique COMPTÉS (4 violations) ; aria-label/htmlFor+id/label imbriqué/
  aria-labelledby reconnus labellisés ; boutons-icône = 2 détectés (icon+texte et {expr}+icon exclus).
  exit 1. Discrimination prouvée.
- Critère 3 (primitives) : LoadingState (role=status + aria-live=polite + aria-busy + sr-only +
  Loader2 animate-spin) OK ; Skeleton (animate-pulse) + SkeletonList (role=status) OK ; ErrorState
  (role=alert + message + bouton Réessayer via prop onRetry, réutilise Button 44px+focus) OK.
  Transpile individuel esbuild : 3/3 OK.
- Critère 5 (pureté/additif) : git status -> 0 fichier suivi modifié (les 4 fichiers F1 sont untracked,
  additifs). grep useState|useEffect|fetch|onChange|onSubmit sur les 3 primitives -> aucun match (exit 1).
  Composants purs de présentation, onRetry = callback (pas de fetch réécrit).
Verdict : 5/5 critères F1 PASS + G1/G2 verts. G3/G4/G5 (per-écran) N/A à ce stade (F1 ne traite aucun
écran). Rubric Craft-des-états : haute (primitives soignées, audit robuste non-regex-naïf) — pas de slop.
-> F1 done:true, awaiting_eval:false.

## [2026-07-16] build | F2 — Dashboard (/dashboard), ecran d'accueil (tentative 1/3)
Fichier touche : `client/src/pages/Dashboard.tsx` (presentation + a11y + etats UX ; aucune formule de
marge/food-cost, aucun endpoint, aucun calcul stats/trends modifie). Sequence d'edition tracee pour reprise :
1. Couleurs (V6/A4) — 3 replace_all : `text-[#9CA3AF]` (54) + `text-[#6B7280]` (19) + `text-[#D1D5DB]` (4)
   -> `text-[#737373]`. #9CA3AF echoue AA 4.5:1 sur blanc (~2.8:1) ; #737373 passe (~4.7:1). Convergence
   sur la teinte canon du contrat (dark variants mono-500/700/400 conserves = tokens autorises V6). 0 old-gray restant.
2. A6 — aria-hidden="true" ajoute sur TOUTES les icones lucide decoratives (32 tags distincts, incl.
   ArrowRight/Plus/Check/ArrowUp-DownRight repetees + `<Icon>`/`<ArrowRight>` a className template-literal).
   Verif grep : 0 icone sans aria-hidden. Pas de double-attribut.
3. Imports ajoutes : `useToast`, `LoadingState`, `ErrorState` (primitives F1, canon).
4. U3 (erreur+Reessayer) — le fetch principal (Promise.all([fetchRecipes,fetchIngredients])) etait un
   useEffect qui swallow l'erreur en `console.error` -> ecran vide "Commencez ici" trompeur. Extrait en
   `loadData` useCallback (MEMES appels fetch, deps inchangees) + `useEffect(()=>loadData(),[loadData])` +
   etat `loadError`. Early-return ErrorState (message actionnable + bouton Reessayer -> onRetry={loadData}
   rejoue le meme fetch). Aucune logique metier changee, seul l'etat d'erreur est ajoute (c'est le GOAL du pass).
5. U2 (chargement role=status) — wrapper du skeleton principal : role=status + aria-live=polite + aria-busy
   + `<span class="sr-only">Chargement du tableau de bord…</span>`. P&L : spinner nu remplace par
   `<LoadingState label=.../>`. Modale rapport : loader enveloppe en role=status. (.skeleton = shimmer anime en CSS.)
6. U4 (feedback mutatif) — `sendReportByEmail` : `alert(err.message)` (bloquant, moche) remplace par
   `showToast(..., 'error')` (message actionnable) + `showToast('Rapport envoye par email','success')`.
   `copyReport` : ajout toast succes + toast erreur sur .catch clipboard. showToast ajoute aux deps.
7. U5 (async disabled) — bouton "Rapport IA" : `disabled={reportLoading}` + `disabled:opacity-50
   disabled:cursor-not-allowed` + icone -> Loader2 animate-spin pendant le chargement (anti double-submit).
   (Bouton email deja disabled+spinner.)
8. A2 (boutons a texte masque en mobile) — aria-label sur "Rapport IA" (span "Rapport" est hidden sm:inline)
   et "Personnaliser" (span hidden sm:inline -> icone seule en mobile). A3 focus deja global (index.css
   *:focus-visible + button/a/input/[role=button]). A5 : boutons periode P&L px-4 py-2 (~36px) -> +min-h-[44px]
   + aria-pressed={actif}.
Verifs executees (sorties reelles) :
- `node scripts/a11y-audit.mjs src/pages/Dashboard.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, exit 0 (Gate).
- `npx vite build` (client/) -> BUILD_EXIT=0, "built in 31.92s", dist/sw.js + workbox generes (G1/G5).
- grep : slate-=0 (V1) ; min-w-0=7 = baseline (N1) ; md:hidden=2 = baseline (N2) ; alert(/console.error=0 ;
  #9CA3AF/#6B7280/#D1D5DB=0 ; double aria-hidden=0 ; role=status x2 + LoadingState x1 ; showToast x4 ; aria-live x2.
Tension de contrat SIGNALEE (je ne reecris pas contract.md) : la contrainte dure "Aucun changement de
useState/useEffect/fetch" (l.20-22) entre en conflit avec le GOAL explicite "combler les manques UX
(...erreur, feedbacks)" et les criteres U3/U4, impossibles sans etat d'erreur + toast. Interpretation retenue :
"zero logique METIER" (marges, endpoints, calculs, comportement des features) = protege et intact ici ;
l'ajout d'etat de PRESENTATION (loadError, showToast) qui rejoue le fetch existant est le livrable meme du
pass. A arbitrer par l'evaluator ; si N4 est lu au sens litteral "aucun diff useState", flaguer pour le planner.
Non fait par design : QuickActions gardent leurs couleurs bleu/violet/emeraude (design existant, hors focus
a11y/etats ; V2 vise les gray/zinc/neutral "nouvellement introduits", pas ces accents pre-existants) ; empty
state "Commencez ici" (3 etapes) conserve (deja explicite titre+desc+CTA, superieur a EmptyState generique).
awaiting_eval:true. Je ne me note pas / ne me declare pas done — verdict a l'evaluator.

## [2026-07-16] eval FAIL | F2 — Dashboard (/dashboard) — A7 th-scope manquant + A5 touch-targets sub-44px (modales)
Evaluator (externe, posture casse-par-defaut). Preuves d'execution reelles jointes :
- GATE VERT : `npx vite build` (client/) -> BUILD_EXIT=0 ("built in 24.91s", dist/sw.js+workbox) [G1/G5].
  `node scripts/a11y-audit.mjs src/pages/Dashboard.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, exit 0 [G2/G3/G4].
- APP LANCEE : `vite preview` :4788 -> HTTP 200 sur / et /dashboard ; playwright headless -> ProtectedRoute
  garde /dashboard (redirect /login sans backend/token reel). Boot + routing OK, 0 pageerror JS (les 6x 500
  sont l'absence du backend Express/Supabase, pas un defaut code). Etats runtime du dashboard authentifie non
  observables ici (auth+backend requis) -> verifies via gate mecanique + lecture JSX exhaustive (1729 l.).
- LOGIQUE INTACTE (N4) : `git diff` revu ligne a ligne. Aucune formule (marginPercent/costPerPortion/reduce/
  sort/useMemo) ni endpoint (/api/ai/weekly-report, /send-email, /api/analytics/pnl) modifie ; les lignes
  "calc-adjacentes" du diff ne changent QUE la couleur (#9CA3AF/#6B7280 -> #737373) ou ajoutent aria-hidden,
  expressions identiques des 2 cotes. fetchRecipes()/fetchIngredients() preserves. alert() -> showToast (U4).
- PASS partiels solides : U1 (carte "Commencez ici" titre+desc+3 CTA quand recipes=0) ; U2 (skeleton role=status
  +aria-live=polite+aria-busy+sr-only ; P&L LoadingState ; loader modale role=status) ; U3 (loadError->ErrorState
  message+Reessayer onRetry=loadData rejoue le meme fetch) ; U4 (showToast succes+erreur copy/email, alert supprime) ;
  U5 (Rapport IA + Email disabled+spinner). V1 slate-=0 ; V2 0 gray/zinc/neutral neufs, 0 #9CA3AF/#6B7280/#D1D5DB ;
  V3 rounded-2xl+border+bg-white/dark ; V4 CTA sombre mono-100/dark:white (autorise) ; V5 dark partout ;
  V6 text-[#737373] dark:mono-500. A1/A2 audit 0/0 ; A3 focus global index.css (button/a/input/select/textarea/
  [role=button]/[tabindex], light+dark) ; A4 #737373~4.7:1 AA ; A6 0 icone lucide sans aria-hidden.
  N1 min-w-0=7 (baseline) ; N2 md:hidden=2 (baseline) ; N3 grilles responsive + cartes md:hidden preservees.
- CRITERES ECHOUES (preuve mecanique, non couverts par le gate audit) :
  * A7 FAIL : `grep -cE "<th " Dashboard.tsx` = 8 ; `grep -cE "<th [^>]*scope=" ` = 0. Les 2 tables HTML
    (Top5 marges l.1149 / Cout par recette l.1346) ont des `<th>` SANS `scope="col"`. Le contrat A7 exige
    explicitement "<table> avec <th scope> si tableau HTML". -> ajouter scope="col" aux 8 th (4+4).
  * A5 PARTIEL : controles principaux OK (min-h-[44px] x9 : header/onglets/periodes P&L). MAIS boutons
    < 44px non traites : WidgetPickerModal moveUp/moveDown/toggle `p-1` (~24px, x3, l.165-171) et footer
    modale rapport `px-3 py-2 text-xs` Copier/Email/PDF (~36px, x4, l.1711-1718). Pre-existants (le diff n'y
    change que la couleur) mais A5 impose >=44px pour "boutons... items cliquables" et l'app cible tablette
    (Samsung Tab A9+ / kitchen mode). -> min-h-[44px] (ou p-2.5+) sur ces boutons de modale.
- Tension de contrat NOTEE (non bloquante ici, a arbitrer par le planner pour F3-F14) : la contrainte dure
  "Aucun changement de useState/useEffect/fetch" (contract l.20-22) est en contradiction interne avec les
  criteres U3/U4/U5 et le GOAL "combler les manques erreur/feedbacks", litteralement impossibles sans ajouter
  d'etat (loadError) ni de toast. Interpretation retenue = "zero logique METIER" (marges/endpoints/calculs
  intacts, verifie) ; l'ajout d'etat de PRESENTATION est le livrable. Ce n'est PAS la cause du FAIL (le build
  reste incomplet sur A5/A7 qui sont parfaitement realisables) -> pas d'escalade contrat, mais le planner
  devrait clarifier la formulation l.20-22 pour lever l'ambiguite sur les prochains ecrans.
Rubric ponderee ~0.81 (>=0.75) MAIS seuil global exige "tous U/V/A/N VRAI" -> A7 non-VRAI + A5 partiel = FAIL.
Verdict : F2 done:false, awaiting_eval:false (retour au generator, tentative 2). Corriger A7 (th scope) + A5
(boutons modales 44px), rien d'autre a toucher. C'est une tentative 1/3, pas de boucle bloquee.

## [2026-07-16] build | F2 — Dashboard (/dashboard) : correctifs cibles A7 th-scope + A5 touch-targets (tentative 2/3)
Verdict eval tentative 1 = 2 manques mecaniques precis (A7 + A5), le reste PASS. Choix : correctifs
chirurgicaux sur ces 2 points UNIQUEMENT (pas un rebuild jete-et-recommence — le run n'est pas parti de
travers, l'eval a livre des cibles exactes ; empiler ces 2 fixes n'est pas du patch-stacking). Aucune autre
zone touchee. Fichier : `client/src/pages/Dashboard.tsx` (presentation/a11y uniquement, zero logique).
Edits (idempotents, replace de sous-chaines exactes non chevauchantes — rejouables sans doublon) :
1. A7 (th scope) — replace_all `<th className=` -> `<th scope="col" className=`. Les 8 `<th>` des 2 tables
   HTML (Top5 marges l.~1152-1155, Cout par recette l.~1349-1352) sont tous en <thead> = en-tetes de
   colonne -> scope="col" correct pour les 8. Verif : 8 <th>, 8 avec scope.
2. A5 (WidgetPickerModal x3, boutons ~24px) — moveUp/moveDown (className identique, replace_all -> 2) +
   toggle (className distinct, 1 edit) : `p-1 rounded ...` -> `min-h-[44px] min-w-[44px] flex items-center
   justify-center rounded ...`. Verif : `p-1 rounded`=0, motif 44px flex-center = 3 boutons.
3. A5 (footer modale rapport Copier/Email/PDF + bouton "Voir" du focus l.443, ~32-36px) — replace_all
   `px-3 py-2 text-xs font-medium rounded-lg` -> `px-3 py-2 min-h-[44px] text-xs font-medium rounded-lg`
   (4 occurrences : 443/1711/1714/1717). Le bouton "Voir" l.443 est un controle tactile <44px de meme
   token, hors liste eval mais dans le perimetre A5 de l'ecran -> inclus pour eviter un A5 residuel au
   prochain cycle. inline-flex items-center deja present -> min-h-[44px] centre le contenu verticalement.
   Verif : ancien littéral `px-3 py-2 text-xs`=0, nouveau `px-3 py-2 min-h-[44px] text-xs`=4.
Verifs executees (sorties reelles) :
- `node scripts/a11y-audit.mjs src/pages/Dashboard.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, AUDIT_EXIT=0 [G2/G3/G4].
- `npx vite build` (client/) -> BUILD_EXIT=0, dist/sw.js + dist/workbox-*.js generes [G1/G5].
- Non-regression : slate-=0 [V1] ; min-w-0=7 (baseline) [N1] ; md:hidden=2 (baseline) [N2] ;
  alert(/console.error=0 ; #9CA3AF/#6B7280/#D1D5DB=0 [V2/V6]. Handlers moveUp/moveDown/toggle/copyReport/
  sendReportByEmail/window.print/navigate INCHANGES (seuls className + attribut scope modifies) [N4].
- min-h-[44px] total dans le fichier = 16 (9 baseline P&L/onglets/header + 3 WidgetPicker + 4 footer/Voir).
awaiting_eval:true. Je ne me note pas / ne me declare pas done — verdict a l'evaluator. Reste (le cas
echeant) : re-verifier A5 sur d'eventuels autres controles <44px si l'eval en signale, mais aucun connu ici.

## [2026-07-16] eval PASS | F2 — Dashboard (/dashboard) — tentative 2 : A7 + A5 corriges, tous criteres VRAI
Evaluator (externe, posture casse-par-defaut). Preuves d'execution reelles, pas de lecture seule :
- GATE VERT : `npx vite build` (client/) -> BUILD_EXIT=0 (dist/sw.js + workbox-46b9b04d.js, 10 entries precache) [G1/G5].
  `node scripts/a11y-audit.mjs src/pages/Dashboard.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, AUDIT_EXIT=0 [G2/G3/G4].
- APP LANCEE (fresh) : `vite preview` :4791 -> HTTP 200 sur / et /dashboard ; playwright headless (client/node_modules)
  -> /dashboard garde vers /login (ProtectedRoute, pas de token), body 30394, JS pageerrors=0. Boot propre.
  Les 3x 500 = absence backend Express/Supabase, pas un defaut code (identique tentative 1).
- CORRECTIF A7 (etait FAIL t1) : `grep -cE "<th "` = 8 ; `grep -cE "<th [^>]*scope="` = 8. Les 8 <th> des 2
  tables (Top5 marges / Cout par recette) ont scope="col". -> A7 VRAI.
- CORRECTIF A5 (etait PARTIEL t1) : `p-1 rounded` = 0 (WidgetPicker moveUp/moveDown/toggle -> min-h-[44px]
  min-w-[44px] flex center, verifie l.165/168/171) ; ancien `px-3 py-2 text-xs font-medium rounded-lg` = 0,
  nouveau `px-3 py-2 min-h-[44px] text-xs` = 4 (footer modale Copier/Email/PDF + bouton Voir). Chasse
  adversariale des sub-44px restants : `p-1.5` = 13 mais TOUS = `gap-1.5` (gap flex, pas padding) ; `h-8` =
  3 tous decoratifs (avatar rond stat, skeleton, Loader2). min-h-[44px] total = 16. -> A5 VRAI.
- Re-verif du reste (inchange depuis t1, confirme sur le diff complet non-commite) :
  U1 empty "Commencez ici" (l.1236, titre+desc+CTA) ; U2 loading role=status+aria-live=polite+aria-busy+
  sr-only (diff l.867+) ; U3 loadError -> ErrorState message+Reessayer onRetry=loadData (rejoue le meme
  Promise.all) ; U4 showToast succes+erreur (copyReport .catch + sendReportByEmail alert->showToast, alert(=0) ;
  U5 disabled={reportLoading} (l.987) + disabled={reportEmailSending} (l.1714), Loader2 x4.
  V1 slate-=0 ; V2 #9CA3AF/#6B7280/#D1D5DB=0, 0 gray/zinc/neutral neuf ; V3 rounded-2xl x31 ; V4 CTA sombre
  mono-100/dark:white (autorise) + 1 teal-600, seul bg-blue = chip decoratif w-12 h-12 QuickAction (pas un
  bouton primaire) ; V5 dark partout ; V6 text-[#737373]. A1/A2 audit 0/0 ; A3 *:focus-visible global
  index.css l.342/346 (light+dark) ; A4 #737373 ~4.7:1 AA ; A6 0 icone lucide sans aria-hidden (43 aria-hidden).
  N1 min-w-0=7 (baseline) ; N2 md:hidden=2 (baseline) ; N3 grilles responsive + cartes preservees.
- N4 LOGIQUE INTACTE : `git diff` revu ligne a ligne (diffstat +166/-118). fetchRecipes()/fetchIngredients()
  preserves dans Promise.all, deps [selectedRestaurant, restaurantLoading] inchangees ; le useEffect extrait
  en useCallback loadData n'a change que le .catch (console.error -> setLoadError(true)) = ajout d'etat de
  PRESENTATION (le livrable meme du pass). Aucune formule marge/food-cost, aucun endpoint, aucun handler
  supprime/renomme. Seuls className + scope + aria-hidden + min-h-[44px] + showToast/loadError ajoutes.
- Progres reel (anti-Ralph-Wiggum) : les 2 seuls FAIL de t1 (A7, A5) sont corriges mecaniquement et verifies ;
  pas de boucle bloquee, pas de meme cause 2x.
- Tension de contrat NOTEE (non bloquante, pas d'escalade) : contrainte dure l.20-22 "aucun changement
  useState/useEffect/fetch" contredit litteralement U3/U4/U5 + le GOAL. Interpretation "zero logique METIER"
  retenue et verifiee (fetch/calculs intacts). Le build PASSE sous cette lecture -> contrat pas "faux",
  simple ambiguite de formulation deja signalee 2x ; le planner peut clarifier l.20-22 pour F3-F14.
Rubric ponderee : Coherence visuelle 0.85, Craft des etats 0.85, Accessibilite reelle 0.85 (focus global +
44px reels + th scope + aria annonce labels/etats), Discretion/non-reg 0.95 -> ~0.86 (>= 0.75).
Verdict : Gate G1-G5 VERTS + tous U/V/A/N VRAI + rubric 0.86. -> F2 done:true, awaiting_eval:false.

## [2026-07-16] build | F3 — Ingredients (/ingredients) : etats UX + theme W&B + a11y (tentative 1/3)
Fichier touche : `client/src/pages/Ingredients.tsx` (2354 l., presentation + a11y + etats de PRESENTATION
uniquement ; aucune formule prix/food-cost, aucun endpoint, aucun calcul summaryStats/filtered/costAlert
modifie). Sequence tracee pour reprise (F2 lesson : structurel d'abord matchant les chaines actuelles,
PUIS sweeps replace_all couleur -> aria-hidden -> A5, tous idempotents/rejouables) :

DECOUVERTE IMPORTANTE (a lire par l'evaluator) — le "3 slate" de la baseline planner sont des FAUX POSITIFS :
`grep -c "slate-"` = 3 mais `grep -oE "slate-[0-9]"` = 0. Les 3 matchs sont `translate-x`/`translate-y`
(la sous-chaine "slate-x"/"slate-y" dans `-translate-x-1/2` / `-translate-y-1/2`, transforms CSS
fonctionnels a NE PAS toucher — les retirer casserait le positionnement, N3/N4). Il n'existe AUCUNE classe
couleur `slate-<n>` dans le fichier. Pour verifier V1 sans faux positif : `grep -cE "slate-[0-9]"` = 0
(fait). Si l'evaluator lance `grep -c "slate-"` litteral il obtiendra 3 -> ce n'est PAS une violation V1.

Fait :
1. U2 loading — la ligne texte-nu (`<div ... text-[#9CA3AF]>{t('ingredients.loading')}</div>`, ~1004)
   remplacee par `<LoadingState label={t('ingredients.loading')} />` (role=status+aria-live+sr-only, primitive
   F1). Idem 2 loaders secondaires en modale converties en `<LoadingState>` : historique prix (edit form) +
   tracker prix. Import LoadingState/ErrorState ajoutes.
3. U3 erreur+Reessayer — ajout etat de PRESENTATION `loadError` (useState) : `loadIngredients` catch ->
   setLoadError(true) (+ toast existant conserve), succes -> setLoadError(false). Render :
   `if (loadError) return <ErrorState message={t('ingredients.loadError')} onRetry={loadIngredients} />`.
   onRetry REUTILISE le fetch existant (Promise.all fetchIngredients/fetchSuppliers/fetchInventory), pas de
   reecriture. Meme tension de contrat que F2 (l.20-22 "aucun useState" vs GOAL "erreur/feedbacks") :
   interpretation "zero logique METIER" -> etat de presentation autorise. Non reecrit contract.md (domaine planner).
4. U1 empty — deja present et RICHE (desktop l.~1240 + mobile : FoodIllustration + titre "Ajoutez votre
   premier ingredient" + description + chips d'exemple + CTA "Ajouter"), + branche noResults. Conserve
   (superieur a EmptyState generique, comme F2 "Commencez ici"). U4 feedback : showToast deja partout
   (create/update/delete/bulk x4/weigh/supplier/import/export) — inchange. U5 : submit `disabled={saving}`+
   Loader2, applyBulk `disabled` preview vide, addNewSupplier `disabled` — deja presents.
6. V6/A4 couleurs — sweep replace_all `#9CA3AF`->`#737373` (46 occ. incl. 41 text + 5 chart) et
   `#6B7280`->`#737373` (32 occ.). #9CA3AF echoue AA sur blanc (~2.8:1), #737373 passe (~4.7:1). Dark
   variants (mono-500/700) = tokens autorises, intacts. Verif : #9CA3AF/#6B7280/#D1D5DB = 0 ; #737373 = 76.
7. A7 th scope — 4 `<th>` de la table apercu bulk-price (l.~1679-1682) sans scope -> +scope="col" (col
   headers en thead). Verif : 13 `<th>` / 13 avec scope.
8. A1 labels — 9 champs flagues par l'audit corriges : price/unit/category/supplier/barcode via
   `<label htmlFor>` + `id` associe (visible label lie, meilleur craft) ; file CSV / bulk-% / new-supplier /
   alert-seuil via aria-label descriptif. Audit -> inputs-sans-label = 0.
9. A6 aria-hidden — sweep sur TOUTES les icones lucide decoratives. 24 types en replace_all `<Icon className=`
   -> `<Icon aria-hidden="true" className=` (les icones deja marquees ont aria-hidden AVANT className ->
   non re-matchees). PIEGE gere : TrendingUp/TrendingDown ont l'aria-hidden APRES className sur 3+3 tags
   pre-existants -> le blanket aurait cree un DOUBLON ; traites en 8 edits cibles sur les seules variantes
   nues. Verif : 0 icone lucide sans aria-hidden ; 0 doublon aria-hidden.
10. A5 44px — bumps sub-44px : cartes mobile 40->44 (x4) ; pills filtre categorie + periode tracker
   (px-3 py-1.5 -> +min-h-[44px] inline-flex, x3) ; boutons barre bulk (x5) ; direction hausse/baisse bulk
   (x2) ; boutons-icone p-1/p-1.5/p-0.5 (watch-remove, fermer-selection, effacer-fournisseur -> 44px
   flex-center) ; bouton peser form (px-2 py-1 -> +min-h) ; lien "creer fournisseur". A3 focus deja global
   (index.css). Verif : min-h-[44px] = 23 ; p-0.5/p-1-icone residuels = 0. Les boutons d'action de ligne
   avaient DEJA 44px+aria-label+aria-hidden (pass mobile anterieur).
Verifs executees (sorties reelles, pas auto-notation) :
- `node scripts/a11y-audit.mjs src/pages/Ingredients.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, AUDIT_EXIT=0 [G2/G3/G4].
- `npx vite build` (client/) -> BUILD_EXIT=0, PWA precache 10 entries, dist/sw.js + dist/workbox-46b9b04d.js [G1/G5].
- V1 `slate-[0-9]`=0 ; V2/V6/A4 grays=0 ; A7 th 13/13 scope ; A6 icones-sans-aria=0 & doublons=0 ;
  N1 min-w-0=3 (baseline) ; N2 md:hidden=1 (baseline).
- N4 : `git diff` diffstat +161/-151 ; grep des lignes onClick/onChange/fetch/hooks -> handlers IDENTIQUES
  des 2 cotes (seuls className/aria/min-w changent), file input onChange preserve. Seul ajout logique =
  etat de presentation loadError (comme F2). Aucun endpoint/formule/handler supprime ou renomme.
Non fait par design : couleurs semantiques de categories/fournisseurs (CATEGORY_COLORS red/blue/green...,
SUPPLIER_BADGE_COLORS violet/sky...) conservees = statuts metier pre-existants, hors V2 "grays neufs" ;
`.input`/`.btn-primary`/`.btn-secondary`/`.label` (classes globales, canon app) non touchees ; charts recharts
(stroke #111111, tick #737373 apres sweep) inchanges cote logique. awaiting_eval:true. Je ne me note pas /
ne me declare pas done — verdict a l'evaluator. Si re-FAIL sur un point non anticipe -> tentative 2/3.

## [2026-07-16] eval PASS | F3 — Ingredients (/ingredients) — tous criteres VRAI, etats confirmes LIVE au navigateur
Evaluator (externe, posture casse-par-defaut). Preuves d'execution reelles, PAS de lecture seule :
- GATE VERT : `npx vite build` (client/) -> BUILD_EXIT=0 ("built in 15.37s", dist/sw.js + workbox-46b9b04d.js,
  PWA precache 10 entries) [G1/G5]. `node scripts/a11y-audit.mjs src/pages/Ingredients.tsx` -> inputs-sans-label=0,
  boutons-icone-sans-aria-label=0, AUDIT_EXIT=0 [G2/G3/G4].
- APP LANCEE + DRIVE REEL (playwright + interception reseau /api/** pour depasser ProtectedRoute sans backend) :
  * U2 loading CONFIRME LIVE : ingredients differe 2.5s -> a t=300ms `[role="status"]`=1 + `[aria-busy="true"]`=1
    + texte "Chargement" x2 (sr-only + visible). C'est la primitive LoadingState qui rend. 0 pageerror.
  * U3 error CONFIRME LIVE : /api/ingredients -> 500 -> `[role="alert"]` rend "Une erreur est survenue /
    Erreur lors du chargement des ingredients" + bouton "Reessayer" (getByRole button name=Reessayer trouve).
    Playwright a dumpe la classe du bouton = primitive Button : `bg-teal-600 hover:bg-teal-500 ... rounded-xl
    focus-visible:ring-2 focus-visible:ring-teal-500 ... min-h-[44px]` -> prouve V4 + A3 (focus visible) +
    A5 (44px) EN RUNTIME. onRetry={loadIngredients} = fait de code direct (reutilise le handler existant, pas
    de reecriture) ; setLoadError(false) sur succes verifie (l'erreur se leve quand un fetch reussit).
    Le retry ne re-emet pas toujours un GET reseau = comportement de `offlineAwareGet`/`fetchWithRetry`+IndexedDB
    (infra PRE-EXISTANTE, api.ts jamais touche par F3) -> hors scope, pas un defaut.
  * U1 empty CONFIRME LIVE : ingredients=[] -> "Ajoutez vos ingredients avec leurs prix pour calculer vos
    couts..." rend (empty state riche pre-existant conserve). 0 pageerror.
  * Overlay onboarding "Passer 1/6" observe = artefact de mon faux user (onboarding non complete), PAS un defaut F3.
- U4 feedback : showToast = 27 (create/update/delete/bulk/weigh/supplier/import/export), alert(/console.error=0.
- U5 async disabled : submit `disabled={saving}` (l.2078) + `<Loader2 animate-spin>` (l.2081).
- V1 slate : `grep -cE "slate-[0-9]"` = 0. Les 3 `grep -c "slate-"` = translate-x/translate-y (transforms CSS,
  faux positifs du planner) -> confirme, HEAD aussi slate-[0-9]=0. V1 VRAI.
- V2 palette : #9CA3AF/#6B7280/#D1D5DB=0 ; gray-[0-9]=1 SEUL = `CATEGORY_COLORS['Autres']` (l.77, border-gray-400/
  bg-gray-50), PRE-EXISTANT et ABSENT du diff (git diff +lines : 0 gray- introduit) -> statut metier, hors "grays
  neufs" V2. zinc/neutral=0. V3 rounded-2xl=9. V5 dark:=196. V6 #737373=76 (grays=0).
- A1/A2 audit 0/0 + labels htmlFor/id verifies (ingredient-price/unit/category/supplier/barcode) + aria-label
  (file CSV/bulk-%/new-supplier/alert-seuil). Les 4 i18n label keys resolvent (fr : "Prix unitaire (€) *"...).
  ingredients.loadError + loading existent dans LES 5 locales (fr/en/ar/es/de). A6 : 70 icones lucide sizees,
  0 sans aria-hidden, 0 doublon aria-hidden (piege TrendingUp/Down gere). A7 : 13 `<th>` / 13 scope="col".
- N1 min-w-0=3 (HEAD 3, egal) ; N2 md:hidden=1 (HEAD 1, egal) ; le diff ne SUPPRIME 0 min-w-0 et 0 md:hidden.
  N3 : seul overflow-x = `hidden md:block ... overflow-x-auto` (l.1218, table desktop) -> inactif a 390px ou
  les cartes md:hidden prennent le relais, pas d'overflow page. N4 : `git diff` (+161/-151) = SEUL ajout logique
  = `const [loadError]=useState(false)` (etat de PRESENTATION) ; handlers togglePriceWatch/openWeigh/openEdit/
  setDeleteTarget/file onChange IDENTIQUES des 2 cotes (seuls className/min-w 40->44/couleur/aria changent) ;
  useEffect deps [selectedRestaurant, restaurantLoading] inchangees ; loadIngredients/fetch preserves.
- Tension de contrat NOTEE (non bloquante, deja signalee F2, PAS d'escalade) : l.20-22 "aucun changement
  useState/useEffect" contredit litteralement U3/U4 + le GOAL "combler manques erreur/feedbacks". Lecture "zero
  logique METIER" retenue et verifiee (formules prix/food-cost/endpoints intacts) -> le build PASSE sous cette
  lecture, contrat pas "faux". Le planner PEUT clarifier l.20-22 pour F4-F14 mais ce n'est pas requis.
- Anti-Ralph-Wiggum : tentative 1/3, aucun FAIL repete, gates objectifs (build+audit) rapportes bruts, etats
  observes en vrai navigateur (pas "ca a l'air bon").
Rubric ponderee : Coherence visuelle 0.85, Craft des etats 0.88 (primitives Loading/Error rendues LIVE, empty
riche, retry cable), Accessibilite reelle 0.85 (focus ring + 44px reels au runtime, labels, aria-hidden, th scope),
Discretion/non-reg 0.95 (logique intacte, mobile preserve, 0 pageerror) -> ~0.87 (>= 0.75).
Verdict : Gate G1-G5 VERTS + tous U/V/A/N VRAI + rubric 0.87. -> F3 done:true, awaiting_eval:false.

## [2026-07-17] build | F4 — Recipes (/recipes) + RecipeDetail (/recipes/:id) : etats UX + theme W&B + a11y (tentative 1/3)
Deux gros fichiers touches (presentation + a11y + etat de PRESENTATION uniquement) : `Recipes.tsx` (4475 l.)
et `RecipeDetail.tsx` (2147 l.). AUCUNE formule marge/food-cost, AUCUN endpoint, AUCUN calcul (kpis/simData/
donutData/liveCost/margin) modifie. Ordre F2/F3 respecte : structurel d'abord (chaines actuelles) -> sweeps
(couleur/aria-hidden) via script idempotent -> verifs. Sequence tracee pour reprise :

STRUCTUREL (Edits cibles) :
1. U2 loading — les 2 loaders texte-nu (`<div ...text-[#9CA3AF]>{loading}</div>`, Recipes L2725 / RecipeDetail
   L347) remplaces par `<LoadingState label=.../>` (role=status+aria-live+sr-only, primitive F1). Imports ajoutes.
2. U3 erreur+Reessayer — etat de PRESENTATION `loadError` (useState) sur les 2 ecrans. Recipes : loadData catch
   -> setLoadError(true) (+ showToast existant conserve) ; render `if (loadError && recipes.length===0) return
   <ErrorState onRetry={loadData}/>`. RecipeDetail : effect fetchRecipe extrait en `loadRecipe` useCallback
   (MEMES appels fetchRecipe/setRecipe/setSimPrice/setPortions, deps [id] inchangees) ; `.catch(()=>console.error
   ('Erreur'))` -> `.catch(()=>setLoadError(true))` ; render `if (loadError) return <ErrorState onRetry=
   {loadRecipe}/>` AVANT le `!recipe` (not-found legitime conserve). onRetry REUTILISE le fetch existant.
3. U4 feedback — Recipes : showToast deja partout (create/update/delete/clone/import/export/bulk). RecipeDetail :
   photo/optimize/allergen/nutrition avaient deja des etats d'erreur visibles ; SEUL silencieux = handleShare
   (`console.error('Erreur partage')`) -> `setPhotoError('Impossible de generer le lien de partage...')` (reutilise
   le toast rouge existant). console.error = 0 sur les 2 fichiers apres coup.
4. U1 empty — DEJA riches et conserves (Recipes : 3 empty states FoodIllustration+titre+desc+CTA en table/grid/
   modeles + noResults ; RecipeDetail : hero FoodIllustration quand 0 photo + empty-states notes/allergenes/
   nutrition). Superieurs a EmptyState generique (cf. F2/F3).
5. U5 async disabled — submit `disabled={saving}`+Loader2, share/optimize/allergen/nutrition `disabled=
   {loading}`+Loader2 (pre-existants), inchanges.
6. A7 th scope — Recipes : 14/14 (`<th scope="col">` : 3 JSX table recettes + 12 dans les templates print
   generateFicheHTML/printAllFiches, ajoutes pour coherence du doc imprime + parite grep). RecipeDetail : 6/6
   (`<th scope="col">` table composition).
7. A1 labels — 25 champs flagues corriges par `aria-label` descriptif (Recipes 19 : nom/categorie/portions/prix/
   notes/prep/cuisson/M.O./coeff/qte/perte/newPrice/newUnit/newCategory + ranges simulateur/marge-cible + selects
   tri/recherche template + combobox ingredient ; RecipeDetail 6 : file photo/lien partage/portions/2 ranges sim/
   textarea note). Audit -> inputs-sans-label=0 sur les 2.
8. A2 icone-boutons — 11 flagues + extras corriges par `aria-label` (Recipes 4 : fermer simulateur/vider
   comparaison/fermer template/fermer batch ; RecipeDetail 7 : photo prec/suiv/miniature/supprimer note/2 fermer-
   erreur/fermer optimizer + ajout photo/supprimer photo). Audit -> boutons-icone-sans-aria-label=0 sur les 2.

SWEEPS (script idempotent `scratchpad/f4_sweep.mjs`, rejouable) :
9. A6 aria-hidden — matcher tolerant `<Name\b[^<]*?/>` (borne le runaway, tolere `>` interne type `x>3`),
   SKIP si aria-hidden deja present (0 doublon, idempotent). Recipes : 109 icones lucide + 14 SVG allergen ;
   RecipeDetail : 61 icones (dont dynamiques `<tab.icon>` et `<TypeIcon>`). Verif finale : 0 icone lucide sans
   aria-hidden, 0 doublon (le piege F3 trailing-aria GitCompareArrows/Sparkles/Zap est SKIP, pas re-marque).
10. V6/A4 couleurs — sweep CIBLE `text-[#9CA3AF]`->`text-[#737373]` et `text-[#6B7280]`->`text-[#737373]`
   (140 Recipes + 81 RecipeDetail). CIBLE sur `text-[...]` volontairement : RecipeDetail a des `border-[#9CA3AF]`/
   `bg-[#9CA3AF]`/`fill="#9CA3AF"` (L786/1760/1777/1980) NON-texte a NE PAS toucher (pas de faute AA sur border/
   bg/chart). #9CA3AF echoue AA sur blanc (~2.8:1), #737373 passe (~4.7:1). RecipeDetail : 4 `gray-*` du bloc
   fiche-technique (dark bg, pre-existants) convertis en W&B hex (`text-[#A3A3A3]`/`text-[#D4D4D4] dark:text-
   [#737373]`, lisibles sur leur fond) + 1 `text-[#D1D5DB]` hint empty-notes -> #737373. gray-[0-9]=0 sur les 2.
11. A5 44px — Recipes min-h-[44px]=30 (5 boutons actions ligne p-1.5, 4 fermer-icone p-0.5/p-1, pills categorie/
   template px-3 py-1.5, 3 onglets px-4 py-2.5, boutons export CSV/print px-3 py-2, toggle comparer, bouton Peser,
   select tri) ; RecipeDetail min-h-[44px]=7 (fleches photo w-10->w-11, supprimer photo, fermer partage/note/2
   erreurs/optimizer, onglets, input portions). A3 focus DEJA global (index.css *:focus-visible).

VERIFS EXECUTEES (sorties reelles, pas auto-notation) :
- `node scripts/a11y-audit.mjs src/pages/Recipes.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria-label=0, AUDIT_EXIT=0 [G2/G3/G4].
- `node scripts/a11y-audit.mjs src/pages/RecipeDetail.tsx` -> 0, 0, AUDIT_EXIT=0 [G2/G3/G4].
- `npx vite build` (client/) -> BUILD_EXIT=0 (2x, "built in ~20s", dist/sw.js + dist/workbox-46b9b04d.js, PWA 10 entries) [G1/G5].
- Non-reg : slate-[0-9]=0 les 2 [V1] ; min-w-0 Recipes 9=baseline & RecipeDetail 5=baseline [N1] ; md:hidden 1=1
  les 2 [N2] ; th scope 14/14 & 6/6 [A7] ; console.error=0 & alert=0 les 2 ; double aria-hidden=0 ; text grays=0
  les 2 [V6/A4] ; LoadingState/ErrorState cables (import+usage) les 2.
- N4 LOGIQUE INTACTE : `git diff` (+488/-447, majoritairement -1/+1 par icone pour aria-hidden + couleurs + A5).
  RecipeDetail effect : fetchRecipe(parseInt(id))/setRecipe/setSimPrice/setPortions IDENTIQUES (juste enveloppes
  dans loadRecipe useCallback, deps [id] inchangees). 14 refs fetch/handlers Recipes + 8 RecipeDetail preserves ;
  loadData toujours appele aux 11 endroits (refresh post-mutation). SEUL ajout logique = etat de PRESENTATION
  loadError (comme F2/F3) + redirection console.error->etat d'erreur visible. Aucun endpoint/formule/handler
  supprime ou renomme.
Tension de contrat NOTEE (deja signalee F2/F3, PAS d'escalade, je ne reecris pas contract.md) : l.20-22 "aucun
changement useState/useEffect" contredit litteralement U3/U4 + GOAL "combler erreur/feedbacks". Lecture "zero
logique METIER" retenue et verifiee (formules/endpoints intacts). Le planner PEUT clarifier l.20-22 mais non requis.
Non fait par design : couleurs semantiques metier pre-existantes conservees (MarginBadge/getCategoryBadgeColor
red/amber/blue/pink/cyan/lime, ALLERGEN_COLORS, DONUT_COLORS chart, PriceSimulator emerald/red) = statuts, hors
V2 "grays neufs" (cf. lesson F3) ; classes globales `.input`/`.btn-primary`/`.label`/`.btn-secondary` intactes ;
print HTML template strings (couleurs inline #64748b/#94a3b8) = document imprime separe, hors theme app (mais th
scope ajoute). awaiting_eval:true. Je ne me note pas / ne me declare pas done — verdict a l'evaluator. Si re-FAIL
sur un point non anticipe -> tentative 2/3 (correctifs cibles tant que le run n'est pas parti de travers).
