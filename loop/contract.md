# Contract — Passe globale UX / cohérence visuelle W&B / accessibilité WCAG AA de RestauMargin (écran par écran)

> Le contrat = ce qui sera NOTÉ (règle III LOOPS.md). Rempli par le planner AVANT toute génération.
> L'evaluator part du principe que c'est cassé : il lance le gate objectif puis vérifie chaque critère
> sur les écrans marqués `awaiting_eval` dans feature_list.json.

## Périmètre (scope)
- **DANS le scope** : les écrans de l'**app authentifiée** à usage quotidien (routes protégées dans `App.tsx`).
  Liste traitée par les features F2→F14 : Dashboard, Ingredients, Recipes, RecipeDetail, Inventory,
  DlcTracker, Suppliers, Mercuriale, InvoiceScanner, MenuEngineering, AllergenMatrix, WasteTracker,
  AutoOrders, Analytics, Comptabilite, Planning, ServiceTracker, KitchenMode, HACCP, Clients,
  Settings, UserManagement.
- **HORS scope** (ne PAS toucher) : les ~60 pages `Blog*.tsx`, les landings SEO (`Logiciel*`, `Alternative*`,
  `Comparatif*`, `Fonctionnalite*`, `NicheLanding`, `Landing.tsx`), les pages légales (CGU/CGV/Mentions),
  et les calculateurs publics `/outils/*`. Le backend (`api/`, `server/`), Prisma, l'auth (passwordHash),
  WeighStation (page hardware sensible), et toute logique métier.

## Contraintes dures (non négociables)
- **Zéro modification de logique métier** : les diffs ne touchent QUE le rendu (JSX présentation), les
  classes Tailwind, et les attributs d'accessibilité (`aria-*`, `htmlFor`/`id`, `role`, `alt`, `type`).
  Aucun changement de handler (`onClick`, `onChange`, `onSubmit`), de `fetch`, de `useState`/`useEffect`,
  de signature de fonction, de calcul, ni d'appel API.
- **Réutiliser les primitives existantes** : `EmptyState`, `Toast`/`useToast`, `Button` (déjà 44px +
  focus-visible). Ne PAS réintroduire de variantes ad hoc quand la primitive existe.
- **Ne pas casser le pass mobile 390px** : conserver `min-w-0`, les bascules table→cartes `md:hidden`
  déjà en place, et les grilles responsive. Aucun débordement horizontal nouveau à 390px.
- **Commits atomiques en français**, 1 commit par feature/écran, **PAS de push** (le main loop pousse).

## Gate objectif (bloquant — vérifié par l'evaluator à chaque cycle)
- [ ] **G1** — `npx vite build` exécuté dans `client/` **exit code 0** (build de prod passe ; `tsc` hors gate).
- [ ] **G2** — Le script d'audit statique `client/scripts/a11y-audit.mjs` existe, s'exécute sans crash, et
  accepte un chemin d'écran en argument : `node scripts/a11y-audit.mjs src/pages/<Screen>.tsx`.
- [ ] **G3** — Pour **chaque écran traité** (feature `done:true`), l'audit rapporte
  **`inputs-sans-label = 0`** (input/select/textarea non `hidden`/`submit`/`button` sans `<label htmlFor>`
  correspondant NI `aria-label` NI `aria-labelledby`).
- [ ] **G4** — Pour **chaque écran traité**, l'audit rapporte **`boutons-icone-sans-aria-label = 0`**
  (`<button>` dont le contenu est uniquement une icône lucide/svg, sans texte ni `aria-label`/`title`).
- [ ] **G5** — Aucune régression de build : le nombre de fichiers en erreur de build reste 0 après chaque commit.

## Critères testables — États UX (par écran traité)
- [ ] **U1** — Chaque liste/tableau/grille de données principal a un **état vide** explicite (composant
  `EmptyState` avec titre + description + CTA) rendu quand la donnée est vide (pas un blanc, pas un `null`).
- [ ] **U2** — Chaque écran a un **état de chargement** non-nu : skeleton (`animate-pulse`) OU spinner
  `Loader2 animate-spin`, enveloppé dans un conteneur `role="status"` + `aria-live="polite"` +
  texte visuellement caché (`sr-only`) type « Chargement… ». Fini le simple `<div>Chargement…</div>`.
- [ ] **U3** — Chaque fetch principal a un **état d'erreur** visible : message + bouton **« Réessayer »**
  qui relance le chargement (réutilise le handler de fetch existant, ne le réécrit pas). Pas d'écran blanc.
- [ ] **U4** — Chaque **action mutative** (create/update/delete/save) déclenche un **feedback** via
  `useToast` (succès ET erreur). Aucune action silencieuse.
- [ ] **U5** — Chaque **bouton d'action asynchrone** affiche un état `loading`/disabled pendant l'opération
  (spinner ou `Button loading`), pour éviter le double-submit.

## Critères testables — Cohérence visuelle (thème W&B strict, par écran traité)
- [ ] **V1** — **Zéro classe `slate-*`** dans les écrans traités (`grep -c "slate-"` = 0 par fichier traité).
- [ ] **V2** — **Zéro couleur hors palette** : uniquement hex directs W&B, tokens `mono-*`, `teal-600/500`,
  `emerald-500/600`, `red-*`, ou couleurs sémantiques déjà présentes (green/amber pour statuts). Pas de
  `gray-*`/`zinc-*`/`neutral-*` nouvellement introduits sur les surfaces de contenu.
- [ ] **V3** — Les **cartes** de contenu utilisent `rounded-2xl` + `border` + fond
  `bg-white dark:bg-[#0A0A0A]` (ou `/50`) conformes au CLAUDE.md.
- [ ] **V4** — Les **boutons primaires** = `bg-teal-600 hover:bg-teal-500 rounded-xl` ; CTA sombre =
  `bg-[#111111] dark:bg-white`. Pas de bouton primaire d'une autre couleur d'accent.
- [ ] **V5** — Chaque élément a un **light ET dark mode** (toute couleur de fond/texte de contenu a son
  pendant `dark:`). Pas de texte noir invisible en dark, ni blanc invisible en light.
- [ ] **V6** — Texte secondaire uniformisé sur `text-[#737373] dark:text-[#A3A3A3]` (ou tokens `mono-500/700`).

## Critères testables — Accessibilité WCAG AA (par écran traité)
- [ ] **A1** — **Labels de formulaire associés** : tout `input`/`select`/`textarea` a un `<label htmlFor>`
  lié à son `id`, OU un `aria-label`/`aria-labelledby`. (couvert par audit G3)
- [ ] **A2** — **Boutons-icône** : tout bouton n'affichant qu'une icône a un `aria-label` descriptif.
  (couvert par audit G4)
- [ ] **A3** — **Focus visible** : les éléments interactifs (boutons, liens, inputs) ont un anneau de focus
  (`focus-visible:ring-2 focus-visible:ring-teal-500` ou via `Button`). Navigation clavier possible.
- [ ] **A4** — **Contraste AA 4.5:1** : le texte de contenu respecte le ratio ; pas de gris clair
  (`#9CA3AF`) sur fond blanc pour du texte porteur d'info (réservé au décoratif/placeholder).
- [ ] **A5** — **Touch targets 44px** : les contrôles tactiles (boutons, onglets, items cliquables,
  cases) ont une hauteur/zone d'au moins 44px (`min-h-[44px]`, `h-11`, `p-3+`, ou `Button` size md/lg).
- [ ] **A6** — **Icônes décoratives** marquées `aria-hidden="true"` ; **images** informatives ont `alt`.
- [ ] **A7** — **Structure sémantique** : un `<h1>` (ou titre de page unique) par écran, hiérarchie de
  titres cohérente, listes en `<ul>/<li>` quand pertinent, `<table>` avec `<th scope>` si tableau HTML.

## Critères testables — Non-régression
- [ ] **N1** — `min-w-0` conservé sur tous les écrans qui l'avaient (comptage ≥ baseline par fichier).
- [ ] **N2** — Les bascules `md:hidden` (tables desktop → cartes mobile) conservées (comptage ≥ baseline).
- [ ] **N3** — À 390px de large, aucun débordement horizontal nouveau (pas de `overflow-x` de page ;
  vérifié à l'inspection JSX + dev server sur les écrans à tableaux).
- [ ] **N4** — Aucun handler / fetch / hook supprimé ou renommé : `git diff` d'un écran ne montre que du
  JSX de présentation et des attributs a11y (revue par l'evaluator sur ≥ 3 écrans échantillonnés).

## Rubric subjective (dimension de goût — règle VI)
Sortie [0,1] par axe + paragraphe d'écart. Évalue la QUALITÉ perçue de la passe, pas juste la conformité.

| Axe | Poids | Réf « bonne » | Réf « slop » |
|---|---|---|---|
| Cohérence visuelle | 0.35 | Tous les écrans se ressemblent : même carte `rounded-2xl`, même teal-600, même hiérarchie typo Satoshi/General Sans, mêmes espacements | Chaque écran a son propre style ; teal ici, bleu là ; cards rondes/carrées mélangées ; slate résiduel |
| Craft des états | 0.30 | Empty/loading/error soignés, skeletons qui matchent la forme du contenu, messages d'erreur utiles avec retry qui marche | Loading = « Chargement… » nu ; erreur = écran blanc ; empty = rien ; toasts génériques « Erreur » |
| Accessibilité réelle | 0.25 | Naviguable 100% clavier, focus toujours visible, lecteur d'écran annonce labels/états, contrôles 44px confortables au doigt | aria posé mécaniquement pour passer l'audit mais focus invisible, contrôles 30px, ordre de tab cassé |
| Discrétion / non-régression | 0.10 | La logique et le layout mobile sont intacts ; la passe est invisible sauf en mieux | Un handler cassé, un tableau qui déborde à 390px, une feature qui ne charge plus |

**Seuil de PASS global** : Gate G1–G5 tous VERTS **ET** score rubric pondéré **≥ 0.75** **ET** tous les
critères U/V/A/N vérifiés VRAI sur chaque écran marqué `done:true`. Un seul écran traité qui régresse le
build ou casse le mobile 390px = FAIL de la feature (retour `awaiting_eval:false`, `done:false`).
