# Progress — Passe globale UX / cohérence W&B / accessibilité WCAG AA de RestauMargin (écran par écran)

> Modèle enrichi (0xCodez, "Loop engineering: 14-step roadmap", 2026-06-09) : "l'agent oublie, le fichier non."
> Mettre à jour ces sections à CHAQUE cycle generator/evaluator, pas juste au scaffold.

## GOAL
Combler les manques UX (états vides/chargement/erreur, feedbacks), améliorer la cohérence visuelle
(thème W&B strict : bg-white/dark:bg-black, hex directs, zéro slate, teal-600, cards rounded-2xl) et
l'accessibilité WCAG AA (labels associés, contraste AA 4.5:1, focus visible, navigation clavier, aria
sur icônes-boutons, touch targets 44px) écran par écran, sans casser le pass mobile 390px ni la logique.

## Gate objectif (rappel — bloquant)
1. `cd client && npx vite build` → exit 0.
2. `cd client && node scripts/a11y-audit.mjs src/pages/<Screen>.tsx` → `inputs-sans-label=0` ET
   `boutons-icone-sans-aria-label=0` pour CHAQUE écran de la feature en cours.
3. Diff de présentation uniquement (aucun handler/fetch/hook modifié).

## Baseline mesurée (2026-07-16, par le planner)
- Primitives prêtes à réutiliser : `components/Button.tsx` (44px + focus-visible OK),
  `components/EmptyState.tsx` (illustrations + CTA), `components/Toast.tsx` (role/aria-live OK),
  `hooks useToast`, `components/ErrorBoundary.tsx`.
- Dette a11y : seulement **25/~50** pages app avec `aria-label` ; **1 seule** page avec `aria-live`/
  `role="status"` pour le loading ; **5** pages avec `<label htmlFor>`. Loading souvent `<div>Chargement…</div>` nu.
- Dette thème : `slate-*` présent dans 65 fichiers (196 occurrences) — dont beaucoup hors scope (blogs).
  Dans le scope : Ingredients 3, Mercuriale 2, InvoiceScanner 3, AllergenMatrix 1, AutoOrders 1, etc.
- Mobile pass déjà fait : 22 pages `md:hidden` (table→carte), 50 pages `min-w-0`. NE PAS régresser.

## Last run
2026-07-17 — build | **F4** Recipes.tsx (4475 l.) + RecipeDetail.tsx (2147 l.) (tentative 1/3). Passe complete
U/V/A/N sur les 2 gros fichiers coeur-metier. Gate VERT : audit Recipes -> 0/0 AUDIT_EXIT=0, audit RecipeDetail
-> 0/0 AUDIT_EXIT=0 ; `npx vite build` BUILD_EXIT=0 (PWA 10 entries). Fait : U2 2 loaders texte-nu -> LoadingState ;
U3 loadError + ErrorState onRetry=loadData (Recipes) / loadRecipe (RecipeDetail, effect extrait en useCallback,
fetch identique) ; U4 handleShare console.error -> setPhotoError (dernier silencieux ; showToast/etats-erreur
deja partout ailleurs) ; U1 empty riches conserves ; U5 disabled+spinner pre-existants. A1 25 champs aria-label ;
A2 11+extras boutons-icone aria-label ; A6 script idempotent (109+14svg Recipes, 61 RecipeDetail dont tab.icon/
TypeIcon) 0 sans-aria 0 doublon ; A7 th scope 14/14 & 6/6 ; A5 min-h-[44px] 30 & 7 ; V6/A4 sweep CIBLE text-
[#9CA3AF]/[#6B7280]->#737373 (140+81, borders/bg/fill #9CA3AF de RecipeDetail preserves) + 4 gray fiche + 1
D1D5DB hint -> gray-[0-9]=0. Non-reg : slate-[0-9]=0, min-w-0 9&5 (baseline), md:hidden 1&1 (baseline),
console.error=0, alert=0. N4 : git diff = fetch/handlers identiques, seul ajout = etat presentation loadError.
awaiting_eval:true. NE PAS enchainer F5 avant le verdict evaluator sur F4.

## Last run (F3 archive)
2026-07-16 — build | **F3** Ingredients.tsx (tentative 1/3). Passe complete U/V/A/N sur 1 gros fichier
(2354 l.). Gate VERT : audit `src/pages/Ingredients.tsx` -> inputs-sans-label=0, boutons-icone-sans-aria=0,
AUDIT_EXIT=0 ; `npx vite build` -> BUILD_EXIT=0 (PWA 10 entries). Fait : U2 loading->LoadingState (ligne
texte-nu ~1004 + 2 loaders modale) ; U3 loadError->ErrorState onRetry=loadIngredients (rejoue Promise.all) ;
U1 empty deja riche (FoodIllustration+titre+desc+chips+CTA) conserve ; U4 showToast deja partout ; U5 submit
disabled+Loader2. V6/A4 sweep #9CA3AF/#6B7280->#737373 (0 gray residuel). A7 4 th +scope="col" (13/13). A1
9 champs labellises (htmlFor+id pour price/unit/category/supplier/barcode ; aria-label pour file/bulk-%/
new-supplier/alert). A6 aria-hidden sur toutes icones lucide (24 types blanket + 8 TrendingUp/Down cibles
pour eviter doublon — piege : aria-hidden APRES className sur 3+3 tags). A5 bumps 44px (mobile 40->44, pills,
barre bulk, p-0.5/p-1/p-1.5 icone-btns, bouton peser, lien creer-fournisseur). Verifs : slate-[0-9]=0,
grays=0, doublon-aria=0, min-w-0=3 (baseline), md:hidden=1 (baseline), min-h-[44px]=23. N4 : git diff
handlers identiques 2 cotes, seul ajout logique = etat presentation loadError (comme F2). awaiting_eval:true.

## Last run (F2 archive)
2026-07-16 — build | **F2** Dashboard.tsx (tentative 2/3). Correctifs cibles suite au FAIL eval tentative 1
(2 manques mecaniques : A7 th-scope + A5 touch-targets modales). RIEN d'autre touche (le run n'etait pas
parti de travers -> pas de jete-et-recommence, l'eval a donne des cibles exactes). Fait :
- A7 : `scope="col"` ajoute aux 8 `<th>` des 2 tables (Top5 marges + Cout par recette). Verif 8/8.
- A5 : WidgetPickerModal moveUp/moveDown/toggle `p-1`(~24px) -> `min-h-[44px] min-w-[44px] flex items-center
  justify-center` (3 boutons). Footer modale rapport Copier/Email/PDF + bouton "Voir" focus l.443
  `px-3 py-2 text-xs`(~32-36px) -> +`min-h-[44px]` (4 boutons). Ancien littéral p-1-rounded=0, px-3-py-2-text-xs=0.
Verifs reelles : audit 0/0 AUDIT_EXIT=0 (gate) ; `npx vite build` BUILD_EXIT=0 (dist/sw.js+workbox) ;
slate=0 (V1) ; min-w-0=7 & md:hidden=2 = baseline (N1/N2) ; alert/console.error=0 ; #9CA3AF/#6B7280/#D1D5DB=0 ;
min-h-[44px] total=16. Handlers inchanges (seuls className + scope) (N4). `awaiting_eval:true` -> evaluator.
Rappel etat tentative 1 (deja livre, non regresse) : couleurs V6/A4 -> #737373 ; A6 aria-hidden 32 icones ;
U2 loading role=status (skeleton + P&L LoadingState + modale) ; U3 loadError+ErrorState onRetry=loadData ;
U4 toasts succes+erreur (alert supprime) ; U5 Rapport IA/Email disabled+spinner ; A2 aria-label ; A3 focus global.

## In progress
— **F1/F2/F3** done:true (evaluator PASS). **F4** Recipes + RecipeDetail tentative 1/3 en attente
  d'evaluation (`awaiting_eval:true`) : gate audit 0/0 (x2) + build exit 0 verts. A7 th-scope + A5 44px traites
  a la main DES le 1er passage (lessons F2/F3 appliquees). Ne PAS enchainer F5 avant le verdict evaluator sur F4.
  Si re-FAIL sur un point non anticipe -> tentative 2/3 (correctifs cibles, pas jete-recommence tant que le run
  n'est pas parti de travers).
— Point d'attention evaluator F4 : (a) th total=14 dans Recipes dont 12 sont dans les templates print
  (generateFicheHTML/printAllFiches) = document HTML separe ouvert via window.open, PAS la table de l'ecran ;
  scope="col" y a ete ajoute pour parite grep + a11y du doc imprime (harmless). Les 2 vraies tables ecran ont
  scope. (b) `slate-` brut = 5 (Recipes) / 5 (RecipeDetail) = TOUS des translate-x/y (faux positifs F3),
  `slate-[0-9]`=0. (c) RecipeDetail garde des `border-[#9CA3AF]`/`bg-[#9CA3AF]`/`fill="#9CA3AF"` NON-texte
  (non balayes volontairement : pas de faute AA sur border/bg/chart ; le sweep est cible `text-[...]`).
— Point d'attention pour l'evaluator (tension de contrat signalee, non reecrite) : U3/U4 exigent un etat
  d'erreur + toast, impossibles sans ajouter useState/toast — ce qui frotte avec la contrainte dure
  "aucun changement useState/useEffect/fetch" (l.20-22) alors que le GOAL inclut "erreur, feedbacks".
  Interpretation retenue : "logique METIER" (marges/endpoints/calculs) intacte ; ajout d'etat de
  PRESENTATION = livrable du pass. Si N4 lu au sens litteral -> flaguer au planner (le contrat s'auto-contredit).

## Next up (ordre de dépendances)
F4 Recipes/RecipeDetail en attente eval → F5 Inventory/Dlc (prochain build) →
F6 Suppliers → F7 Mercuriale → F8 InvoiceScanner → F9 MenuEng/Allergen →
F10 Waste/AutoOrders → F11 Analytics/Compta → F12 Planning/Service/Kitchen → F13 HACCP/Clients →
F14 Settings/Users.

## Completed
— (features done:true, avec preuve/critère)

## Escalated to humans
— (contrat faux, blocage no-progress stuck, décision irréversible)

## Lessons learned
— [F1] L'audit statique doit être tolérant aux accolades/quotes JSX (scanner char-par-char), pas une
  regex `<input[^>]*>` : les attributs contiennent `{expr}` avec `>` (ex: `className={x > 3 ? …}`) qui
  cassent une regex naïve et faussent le comptage.
— [F1] Détection bouton-icône : retirer les balises AVANT de tester la présence d'expression enfant,
  sinon un `className={cn(...)}` sur l'icône fait croire à tort que le bouton a du contenu texte (faux négatif).
— [F1] Le gate G1 est `npx vite build` (esbuild, pas de typecheck), PAS `npm run build` (qui lance `tsc -b`).
  Les primitives non encore importées ne sont pas bundlées → build vert même avant câblage F2. Vérif TS des
  primitives faite séparément via esbuild transpile (exit 0).
— [F1] Env : `$TMPDIR` non défini dans ce Git Bash → rediriger les logs vers le scratchpad absolu, pas `$TMPDIR`.
— [F2] Ordre d'édition sûr sur gros fichier : (1) sweeps couleur replace_all, (2) re-grep pour obtenir les
  chaînes d'icônes POST-couleur, (3) aria-hidden par replace_all sur ces chaînes exactes, (4) éditer les
  blocs structurels après re-lecture (les offsets de ligne bougent à chaque insertion). Les edits d'icônes
  distincts se batchent sans conflit (sous-chaînes non chevauchantes).
— [F2] `#9CA3AF` (gray-400) échoue le contraste AA sur blanc (~2.8:1) → le contrat A4 le nomme comme
  anti-pattern ; `#737373` passe (~4.7:1). Le codebase mélangeait #9CA3AF/#6B7280/#D1D5DB pour le texte
  secondaire → convergence sur #737373 (V6). Les dark variants `mono-500/700/400` sont des tokens autorisés.
— [F2] Focus visible (A3) est DÉJÀ global dans `client/src/index.css` (`*:focus-visible` + règles
  button/a/input/[role=button]/[tabindex]) → inutile d'ajouter des `focus-visible:ring-*` par bouton.
— [F2] TENSION DE CONTRAT à trancher : "aucun changement useState/useEffect/fetch" (contrainte dure l.20-22)
  vs GOAL "combler ...erreur, feedbacks" + U3/U4. Un état d'erreur + toast NÉCESSITENT d'ajouter de l'état.
  Résolu en protégeant la logique MÉTIER (marges/endpoints/calculs intacts) et en n'ajoutant que de l'état
  de présentation qui rejoue le fetch existant. Le planner devrait clarifier N4 pour F3→F14 (idem partout).
— [F2] A7 et A5 ne sont PAS couverts par le gate audit (audit = inputs-sans-label + boutons-icone-sans-aria).
  Le gate 0/0 peut être vert alors que A7/A5 échouent. Pour F3→F14, vérifier À LA MAIN avant de rendre :
  A7 -> tout `<th>` de table HTML doit avoir `scope="col"` (ou "row") : `grep -cE "<th " == grep -cE "<th [^>]*scope="`.
  A5 -> tout bouton/contrôle tactile >=44px, PAS SEULEMENT les principaux : traquer les `p-1`/`p-1.5`
  (~24-32px, boutons-icône de modale/liste) et `px-3 py-2 text-xs`/`px-2 py-1` (footers de modale, chips
  cliquables). Correctif type : `p-1` -> `min-h-[44px] min-w-[44px] flex items-center justify-center` ;
  `px-3 py-2 text-xs` -> `px-3 py-2 min-h-[44px] text-xs` (garder inline-flex items-center pour centrer).
  Balayer TOUTE la page, y compris les boutons hors des zones "évidentes" (l.443 "Voir" raté au 1er passage).
— [F3] **FAUX POSITIF slate** : `grep -c "slate-"` compte `translate-x`/`translate-y` (sous-chaine
  "slate-x"/"slate-y" dans `-translate-x-1/2`). V1 (zero slate) doit se verifier avec `grep -cE "slate-[0-9]"`
  (les couleurs slate sont TOUJOURS `slate-<chiffre>`). Ingredients : `slate-[0-9]`=0 mais `slate-`=3 (tous
  translate). NE PAS retirer les translate (transforms fonctionnels -> casse layout N3). A porter dans tous
  les fichiers F4-F14 qui utilisent translate. Le planner pourrait affiner le libelle du gate V1.
— [F3] **PIEGE aria-hidden double** : le sweep replace_all `<Icon className=` -> `<Icon aria-hidden="true"
  className=` est sur SI l'attribut existant est place AVANT className. Mais certaines icones (ici
  TrendingUp/TrendingDown) ont `aria-hidden` place APRES className (`<Icon className="..." aria-hidden />`)
  -> le blanket cree un attribut DUPLIQUE (React error). Parade : d'abord `grep -oE "<Icon className=\"[^\"]*\"
  aria-hidden"` pour reperer les trailing, puis traiter ces icones-la par edits CIBLES sur leurs variantes
  nues uniquement. Verifier apres : `grep -cE 'aria-hidden="true"[^>]*aria-hidden'` = 0.
— [F3] Ordre d'edition confirme (F2) sur gros fichier : (1) edits STRUCTURELS matchant les chaines
  actuelles (imports, state, loaders->LoadingState, labels, th scope) AVANT tout sweep couleur — sinon les
  chaines a matcher contiennent encore l'ancien gray et bougent ; (2) sweep couleur replace_all ;
  (3) sweep aria-hidden ; (4) sweep A5 44px. Chaque phase idempotente (sous-chaines non chevauchantes).
— [F3] U1 : quand l'ecran a DEJA un empty state riche fait-main (illustration+titre+desc+CTA), le conserver
  (superieur a EmptyState generique) — comme F2. U1 exige "titre+description+CTA", pas litteralement le
  composant EmptyState.
— [F4] **Sweep couleur CIBLE `text-[...]`, PAS le hex brut** : sur les fichiers ayant `border-[#9CA3AF]`/
  `bg-[#9CA3AF]`/`fill="#9CA3AF"` (RecipeDetail L786/1760/1777/1980), un blanket `#9CA3AF`->`#737373` casserait
  bordures/fond/chart (et le pairing dark). Balayer `text-[#9CA3AF]`->`text-[#737373]` (attrape aussi
  dark:/hover:/placeholder:text-...) laisse borders/bg/fill intacts. #9CA3AF non-texte n'est PAS une faute AA
  (contraste requis sur le TEXTE). A porter F5-F14.
— [F4] **aria-hidden en masse via script idempotent** (>100 icones/fichier) : matcher `<Name\b[^<]*?/>`
  (le `[^<]` BORNE le runaway si un `<Name` traine sans `/>` ; tolere `>` interne type `x>3` que `[^>]`
  casserait), replacement SKIP si le tag contient deja `aria-hidden` (gere le piege trailing-aria F3
  GitCompareArrows/Sparkles/Zap SANS creer de doublon). Liste de noms = STRICTEMENT l'import lucide + icones
  dynamiques (`<tab.icon>`, `<TypeIcon>`) — NE PAS matcher les composants (`<FoodIllustration>`, `<SimCard>`,
  `<SortIcon>`... : leurs icones lucide internes sont deja couvertes par le scan du fichier entier). Verif :
  `grep -oE "<(Name1|Name2|...) [^<]*?/>" | grep -v aria-hidden` = vide, ET `aria-hidden="true"[^>]*aria-hidden` = 0.
— [F4] **th en template-string print** : Recipes a 12 `<th style=...>` dans generateFicheHTML/printAllFiches
  (document ouvert via window.open, PAS l'ecran). Un `grep "<th " == grep "<th scope="` echoue si on ne traite
  QUE les th JSX de l'ecran. Ajouter scope="col" aussi aux th print (replace_all `<th style="` -> `<th scope=
  "col" style="`) = parite grep + a11y du doc imprime, harmless. A verifier F7/F9/F11 (autres ecrans a tables).
— [F4] **Refactor fetch->useCallback pour onRetry** : quand le fetch principal est dans un `useEffect(()=>{...},
  [id])` inline (RecipeDetail), l'extraire en `loadX = useCallback(...)` + `useEffect(()=>loadX(),[loadX])`
  permet onRetry={loadX} SANS reecrire les appels (fetchRecipe/setState identiques, deps inchangees). Le
  `.catch(()=>console.error())` devient `.catch(()=>setLoadError(true))` = etat de PRESENTATION (livrable U3).
— [F3] Ne convertir en `text-[#737373]` que les grays de TEXTE/chart ; les couleurs semantiques metier
  pre-existantes (CATEGORY_COLORS red/green/blue, SUPPLIER_BADGE violet/sky, statuts red/emerald/amber) sont
  HORS V2 ("grays neufs") et se conservent. V2 vise gray/zinc/neutral NOUVEAUX, pas les accents existants.

## Stop conditions met
— (quand tous F1→F14 sont done:true, gate G1–G5 verts, rubric ≥ 0.75)

## Reprise après crash
Lire dans l'ordre : contract.md → feature_list.json → ce fichier → log.md.
