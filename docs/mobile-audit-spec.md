<!-- Genere par workflow d audit mobile parallele (20 ecrans, 12 broken), 2026-07-16. Complementaire de la branche claude/peaceful-bartik-dad0ab (chip session : shell+Scanner+Ingredients+Inventory+AutoOrders+MenuEng+WeighStation). Ce spec couvre les ecrans restants dont KitchenMode/Recipes/Comptabilite/Clients/Planning/Suppliers/Mercuriale/WasteTracker. -->

# SPEC DE FIX MOBILE — RestauMargin (cible 390px)

Consolidation des 20 audits. Base viewport = **390px** (iPhone-class). Breakpoint pivot = **`md` (768px)** pour les tables/cartes, **`sm` (640px)** pour les grilles et flex-rows. Un agent peut appliquer écran par écran sans re-auditer.

---

## 1. Patterns globaux réutilisables (snippets EXACTS)

### P1 — Grille de stats/cartes → empilée en mobile
Ne jamais laisser `grid-cols-3/4` (ou `grid-cols-2` avec valeurs monétaires) sans fallback.
```html
<!-- avant -->  grid grid-cols-3 gap-4
<!-- après -->  grid grid-cols-1 sm:grid-cols-3 gap-4
<!-- 4 tuiles -->  grid grid-cols-2 sm:grid-cols-4 gap-3   (ou grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
```

### P2 — Barre d'onglets / filtres scrollable horizontale
```html
<div class="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
  <button class="shrink-0 whitespace-nowrap px-3 py-2.5 min-h-[44px] ...">…</button>
</div>
```

### P3 — Tableau dense (a fortiori éditable) → cartes empilées ⭐ pattern de référence
**Copier le pattern déjà en place dans `client/src/pages/InvoiceScanner.tsx` (commit 5000e81, lignes 1463-1505).** Table cachée sous `md`, bloc cartes visible sous `md`, plus une ligne « tout sélectionner » et un pied de totaux en version mobile.
```html
<!-- Desktop : la table telle quelle -->
<div class="hidden md:block overflow-x-auto">
  <table class="w-full text-sm min-w-[…]"> … </table>
</div>
<!-- Mobile : une carte par ligne -->
<div class="md:hidden space-y-2">
  {rows.map(r => (
    <div class="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900/10 dark:border-mono-200 p-3">
      <div class="flex items-center gap-2">{/* avatar/emoji + nom (truncate) + checkbox/badge */}</div>
      <div class="grid grid-cols-2 gap-2 mt-2 text-sm">{/* paires label:valeur des colonnes clés */}</div>
      <div class="flex gap-1 justify-end mt-2">{/* boutons d'action min-w-[44px] min-h-[44px] */}</div>
    </div>
  ))}
</div>
```
Règle : réutiliser les **mêmes handlers/états** que le map de la table (pas de nouvelle logique). Les cellules éditables inline deviennent des champs pleine largeur dans la carte.

### P4 — Rangée header/actions non-wrappable → wrap ou stack
```html
<!-- barre de boutons -->        flex items-center gap-2   →  flex flex-wrap items-center gap-2
<!-- titre + actions à droite --> flex items-center justify-between → flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
<!-- retirer les shrink-0 sur les clusters d'actions ; ajouter w-full sm:w-auto justify-end au cluster droit -->
```

### P5 — Cible tactile ≥ 44px
```html
py-1.5 / py-2  →  py-2.5 min-h-[44px]     (garder px-*)
icônes p-1/p-2 → p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center
w-8 h-8 → w-11 h-11 sm:w-8 sm:h-8
```

### P6 — Actions « hover-only » inaccessibles au tactile (bug fonctionnel) ⚠️
`opacity-0 group-hover:*` et `hidden group-hover:*` ne se déclenchent jamais au doigt.
```html
opacity-0 group-hover:opacity-100  →  opacity-100 sm:opacity-0 sm:group-hover:opacity-100
hidden group-hover:flex            →  flex sm:hidden sm:group-hover:flex
```

### P7 — `overflow-hidden` qui CLIPPE (pas de scroll de secours)
Un conteneur `overflow-hidden` autour d'un contenu plus large que 390px rend le débordement **définitivement inaccessible**. Remplacer par `overflow-x-auto` OU rendre le contenu wrap (P4). Distinct de P3 (là c'est le layout cible qui change).

### P8 — Enfant flex qui écrase ses voisins
Tout `flex-1` porteur de texte doit avoir `min-w-0` + `truncate` ; les labels en largeur fixe (`w-32`) → `w-20 sm:w-32`.

---

## 2. Fixes par écran (broken d'abord, puis minor)

Légende pattern : **[P3]** table→cartes, **[P1]** grille, **[P4]** wrap/stack, **[P5]** tactile, **[P6]** hover tactile, **[P7]** clip, **[P8]** min-w-0/truncate, **[loc]** fix local spécifique.
Tous les chemins sous `client/src/pages/`.

### 🔴 BROKEN

**KitchenMode.tsx** (KDS — le plus critique : écran inutilisable au tactile)
- L2743 `flex-1 overflow-hidden` → `flex-1 overflow-y-auto lg:overflow-hidden` + L2776 `h-full` → `lg:h-full` **[P7]** (sinon seule la colonne « Nouvelles » visible)
- L2601 `flex items-center gap-3` → `flex flex-wrap items-center gap-2 sm:gap-3` + L2623 horloge `text-4xl` → `text-xl sm:text-2xl lg:text-4xl` **[P4]**
- L910 `hidden group-hover:flex` → `flex sm:hidden sm:group-hover:flex` **[P6]** (actions OrderCard)
- L1106 conteneur RushHour + `flex-wrap text-center` ; L1111 sous-titre `ml-2` → `hidden sm:inline ml-2` **[P4]**
- L1587 entête TablePanel → `flex flex-wrap … gap-2` **[P4]**
- L1269 `w-32`→`w-16 sm:w-32` + L1267 nom `min-w-0 truncate` **[P8]** ; L1759/L1764 idem **[P8]**
- L1572 `p-1`/icône `w-3.5` → `p-2`/`w-5` ; L1600/1604 `py-1.5`→`py-2.5` **[P5]**

**Ingredients.tsx**
- L1211 wrapper table → `hidden md:block` (garder `<table min-w-[740px]>`) + bloc `md:hidden space-y-2` cartes (avatar+nom+checkbox / prix+badge tendance+fournisseur / rangée 4 boutons Bell/Scale/Pencil/Trash2). Handlers `openPriceTracker/togglePriceWatch/openWeigh/openEdit/setDeleteTarget` **[P3]**
- L1453 `px-4 sm:px-6`→`px-3 sm:px-6` ; L1501 `w-48`→`w-48 max-w-[calc(100vw-1.5rem)]` ; L1526 `w-56`→ idem **[loc]** (barre bulk + dropdowns qui débordent)
- L1177/L1189/L2011 `py-1.5`→`py-2 min-h-[40px]` **[P5]**
- L1963 `flex items-center justify-between` → `flex flex-col sm:flex-row sm:items-center justify-between gap-3` **[P4]**

**Inventory.tsx**
- L1694 wrapper → `hidden md:block` (garder `overflow-x-auto`) + bloc `md:hidden space-y-2` cartes (emoji+nom+location / stock inline+ProgressRing+statut / expiration+valeur / rangée 5 boutons). Handlers `toggleSelect/editingStockId/openWaste/setWeighTarget/openRestock/openEdit/setDeleteTarget` **[P3]**
- L1666 `flex items-center gap-3` → `flex flex-wrap items-center gap-2` (+ labels boutons `hidden sm:inline`) **[P4]**
- L2387 modale réappro : envelopper la table dans `<div class="overflow-x-auto -mx-1">` (idéal cartes `md:hidden`) **[P3/P7]**
- L1995, L2019, L2083, L2104, L2127 `grid grid-cols-2`→`grid grid-cols-1 sm:grid-cols-2` **[P1]**
- L1202 `grid grid-cols-2 lg:grid-cols-4`→`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, hero `col-span-2`→`sm:col-span-2` **[P1]**
- L1592/L1610 `py-1.5`→`py-2.5` **[P5]**

**Recipes.tsx**
- L4102 (éditeur d'ingrédients, cœur de l'édition) `flex items-center gap-2` → `flex flex-wrap items-center gap-2` ; retirer `ml-auto` L4153, wrapper prix+total dans `w-full flex items-center justify-between` **[P4]** ⚠️ high
- L2918/L2919 vue Tableau : wrapper `hidden md:block` + table `min-w-[700px]` conservée + bloc `md:hidden` cartes (nom+badge marge/coeff+prix+actions). Alt rapide : `hidden sm:flex` sur le toggle L2868 + forcer `viewMode='grid'` mobile **[P3]**
- L4053 `grid grid-cols-3`→`grid grid-cols-2 sm:grid-cols-3` **[P1]**
- L620 `p-5`→`p-4 sm:p-5` ; L655/L705 `px-5`→`px-3 sm:px-5` **[loc]** ; L1353+ `p-5`→`p-4 sm:p-5`, L1451/L1723/L3382/L3517 ajouter `flex-wrap` **[P4]**
- L3206 `p-2`→`p-2.5 sm:p-2` ; L3016 `p-1.5`→`p-2 sm:p-1.5` **[P5]**

**Comptabilite.tsx** (5 tables denses + rangées non-wrap)
- L1263/L1264 Journal, L1396/L1397 Charges, L1509/L1510 Trésorerie, L1590/L1591 TVA ventilation, L1649/L1650 TVA totaux : wrapper `hidden md:block overflow-x-auto`, table `hidden md:table`, + bloc `md:hidden` cartes par ligne **[P3]** (×5)
- L1873 rapprochement → `flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between` + cluster L1888 `flex flex-wrap … w-full sm:w-auto justify-end` **[P4]**
- L1684, L1822 `grid grid-cols-3`→`grid grid-cols-1 sm:grid-cols-3` **[P1]**
- L1726 budget ligne → stack (`flex-col sm:flex-row`) + L1731 `flex-wrap` **[P4]**
- L918 HealthGauge `flex items-center gap-8`→`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8` **[P4]**
- L1328 header charges `flex-wrap gap-3` **[P4]** ; L2181/L2226 `grid grid-cols-2`→`grid-cols-1 sm:grid-cols-2` **[P1]**

**Clients.tsx**
- L1811/L1810 vue tableau → `hidden md:block` + bloc `md:hidden space-y-3` cartes (avatar+nom+email / badge fidélité+tags / CA+commandes+dernière visite / boutons Send/Note/Edit). Réutiliser `renderAvatar/renderLoyaltyBadge/renderTags` **[P3]**
- L1288 ClientCard actions `opacity-0 group-hover:opacity-100` → `opacity-100 md:opacity-0 md:group-hover:opacity-100` **[P6]**
- L2961 NPS `flex justify-center gap-2`→`flex flex-wrap justify-center gap-1.5` + L2965 `w-10 h-10`→`w-9 h-9` **[loc]** (boutons 9-10 coupés)
- L2187 entête détail → `flex flex-col sm:flex-row sm:items-start gap-4` + L2189 `min-w-0` + L2229 `text-left sm:text-right w-full sm:w-auto` **[P4/P8]**
- L1266 `grid-cols-4`→`grid-cols-2 sm:grid-cols-4` ; L3091 `grid-cols-4`→`grid-cols-2 sm:grid-cols-4` **[P1]**
- L1339 `flex items-center gap-6`→`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6` **[P4]**

**Planning.tsx**
- L1604/L1605 table Équipe (éditable) → `hidden md:block` + `md:hidden space-y-2` cartes (nom+badge conflit / role / taux / heures code-couleur / statut / 3 boutons Dispo/Edit/Suppr `flex-1 min-h-[44px]`) **[P3]**
- L1693/L1694 récap hebdo : cartes `md:hidden` (sinon `min-w-[720px]` + `-mx-4 sm:mx-0`) **[P3]**
- L2969/L2970 récap pointage : `md:hidden` cartes + `hidden md:table` **[P3]**
- L2708/L2710 présence → `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1`, horaires `text-xs`, nom `min-w-0 truncate` **[P4/P8]**
- L1298 nav semaine `flex flex-wrap justify-center gap-2` + h2 L1305 `text-base sm:text-lg text-center` **[P4]**
- L1176-1223 boutons header `py-2`→`py-2.5` (+ labels `hidden sm:inline`) **[P5]** ; L2550 timeline label `w-28`→`w-20 sm:w-28` **[loc]**

**MenuEngineering.tsx**
- L1034 header actions `flex items-center gap-2`→`flex flex-wrap items-center gap-2` + boutons L1038/1043/1049/1055 `flex-1 sm:flex-none justify-center` **[P4]**
- L1725 table 12 col → wrapper `hidden md:block`, + `md:hidden space-y-3` cartes (nom+badge quadrant / `grid-cols-2` Prix/Cout/Marge€/Marge%/Ventes/CA + Score / allergènes / bouton Simuler `w-full`) **[P3]**
- L1675 header BCG → `flex flex-col sm:flex-row sm:items-center justify-between gap-3` + légende L1685 `flex flex-wrap gap-x-3 gap-y-1` **[P4]**
- L1494 `grid grid-cols-2 lg:grid-cols-4`→`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` **[P1]**
- L1118 dates custom `flex flex-wrap … w-full` + inputs L1119/1126 `flex-1 min-w-0` **[P4]**
- L1077/L1096/L1107 `px-4 py-2`→`px-3 py-2.5 min-h-[44px]` **[P5]**

**Suppliers.tsx** (`client/src/pages/Suppliers.tsx`)
- L1980 barre 7 actions `flex items-center gap-1.5 shrink-0`→`flex flex-wrap items-center gap-1.5` + L1968 header → `flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4` **[P4]**
- L2757 `overflow-hidden`→`overflow-x-auto` + L2758 table `hidden md:table … min-w-[640px]` + bloc `md:hidden` cartes **[P7/P3]** ⚠️ clip
- L2908 matrice comparateur : 1re col `sticky left-0 z-10 bg-white dark:bg-mono-50` (th L2911, td L2934, tfoot L2975) — ou cartes `md:hidden` **[loc/P3]**
- L3314 table scores modale `min-w-[560px]` + 1re col sticky (th L3317, td L3341) **[loc]**
- L2166 `grid grid-cols-2`→`grid-cols-1 sm:grid-cols-2` + email `truncate break-all` **[P1/P8]** ; L2726 filtres `flex flex-col sm:flex-row` + select L2737 `w-full sm:w-48` **[P4]** ; L2038 `grid grid-cols-2`→`grid-cols-1 sm:grid-cols-2` **[P1]**
- L1286/1297/1308 onglets `min-h-[44px] inline-flex items-center` **[P5]**

**Mercuriale.tsx**
- L753/L754 table prix/catégorie → `hidden md:table`+`hidden md:block` + `md:hidden divide-y` cartes (produit / prix min-max / unité+TrendBadge) **[P3]**
- L1000/L1001 classement fournisseurs → `hidden md:table` + `md:hidden space-y-2 p-3` cartes (rang+nom / produits+score+prix moyen / barre stabilité `w-full`) **[P3]**
- L808/L809 alternatives : th/td `px-5`→`px-3` (ou cartes `md:hidden`) **[P3/loc]**
- L1081/L1092 accordéon négo → `flex flex-wrap justify-between gap-2` + bloc droit `flex flex-wrap gap-3` (+ prix marché `hidden sm:block`) **[P4]**
- L883 entête ingrédient `flex flex-wrap justify-between gap-2` **[P4]**
- L505 refresh `p-2`→`p-2.5 min-h-[44px] min-w-[44px]` ; L623/L652/L666 `min-h-[44px]` **[P5]**

**AutoOrders.tsx**
- L2151/L2152 historique → `hidden md:block overflow-x-auto` + `md:hidden space-y-2 p-4` cartes (fournisseur+date / Articles/HT/TTC+statut / boutons Recommander & WhatsApp `w-full`) **[P3]**
- L2840 OrderRow déplié : envelopper table dans `<div class="overflow-x-auto -mx-4 px-4">` (idéal cartes `md:hidden`) **[P3/P7]** ⚠️ overflow page
- L2578 modale réappro : table dans `<div class="overflow-x-auto">` **[P7]**
- L2799/L2826 actions OrderRow → `w-full sm:w-auto sm:ml-auto justify-start flex-wrap gap-1.5` + boutons `py-2 sm:py-1` **[P4/P5]**
- L2096 filtres `px-6`→`px-4`, selects L2099/2108/2115/2125 `w-full sm:w-auto`, paires `flex-1 min-w-0` **[P4]**
- L2026 `px-6`→`px-4` + pills L2032 scrollables `flex-nowrap overflow-x-auto` + `whitespace-nowrap shrink-0` **[P2]** ; L2505/2516/2529 réception `flex-wrap` + input `w-full sm:w-auto` **[P4]**

**WasteTracker.tsx**
- L2392/L2393 table déclarations 8 col → `hidden md:table` + `md:hidden space-y-2` cartes (date+ingrédient / badges Cause / Quantité+Coût / photo+suppr) **[P3]**
- L2253/L2261 header rapport → `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3` + boutons `flex-wrap` **[P4]**
- L1714, L2070 entêtes → `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2` **[P4]**
- L1591 nom Top5 : `min-w-0 truncate` **[P8]**
- L1838 Pie labels externes → `<Legend>` ou pourcentage seul (débordent à 350px) **[loc]**
- L1021 `py-1.5`→`py-2.5` ; L1033/1041/1048 `py-2`→`py-2.5 min-h-[44px]` **[P5]**

### 🟡 MINOR

**Dashboard.tsx**
- L1274/L1289 table « Coût par recette » → `hidden md:table` + cartes `md:hidden` (a minima td nom `max-w-[130px]` + Link `truncate block`) **[P3]**
- L1104/L1105 « Top 5 marges » → version cartes `md:hidden` + table `hidden md:table` (sinon max-w L1120 `[200px]`→`[140px]`) **[P3]**
- L1603 footer modale IA `flex flex-wrap justify-between gap-2` + label L1604 `hidden sm:block` **[P4]**
- L928-963 / L1059 boutons+onglets `py-2`→`py-2.5 min-h-[44px]` **[P5]**

**RecipeDetail.tsx**
- L744/L745 table Composition `min-w-[480px]` → `hidden md:table` + cartes `md:hidden` (1/ingrédient) **[P3]**
- L1263 `grid-cols-3`→`grid-cols-1 sm:grid-cols-3` (aligner sur L673) **[P1]**
- L447 galerie : ajouter `overflow-x-auto` **[P7]** ; L421/L425/L434 `w-8 h-8`→`w-11 h-11` (ou `w-10 h-10 sm:w-8 sm:h-8`) **[P5]**

**Analytics.tsx**
- L1226/L1227 category-table → `hidden md:block`+`md:hidden` cartes (`grid-cols-2` des 4 valeurs) **[P3]**
- L772 `grid grid-cols-4`→`grid grid-cols-2 sm:grid-cols-4` **[P1]**
- L1052 label `w-32`→`w-20 sm:w-32 truncate` **[P8]** ; L655/668/679 `py-1.5`→`py-2 min-h-[44px]` **[P5]**

**AllergenMatrix.tsx**
- L289 header `flex items-center gap-2`→`flex flex-wrap items-center gap-2` (+ `w-full sm:w-auto justify-end`) **[P4]**
- L516/L517 matrice 16 col → `hidden md:table` + bloc `md:hidden` cartes (nom+catégorie+SafetyBar + puces allergènes « contient/traces » seulement) **[P3]**
- L498 `py-1`→`py-2 sm:py-1` ; L388 `py-1.5`→`py-2 sm:py-1.5` **[P5]**

**WeighStation.tsx**
- L1037 groupe droit header → `flex flex-wrap items-center justify-end gap-2 sm:gap-3` **[P4]**
- L1882 sélecteur mode → `flex flex-wrap items-center justify-center gap-2 …` (clippé par `overflow-hidden` parent) **[P4/P7]**
- L1098 texte mode `<span class="hidden sm:inline">` + icône permanente **[loc]** ; L2600 `flex flex-wrap … gap-2` **[P4]**

**ServiceTracker.tsx**
- L1286 actions commande `opacity-0 group-hover:opacity-100`→`opacity-100 sm:opacity-0 sm:group-hover:opacity-100` **[P6]** (sinon envoi cuisine/impression impossible)
- L995 cartes KPI `p-6`→`p-3 sm:p-6` ; nombres L1000/L1010/L1042 `text-5xl`→`text-2xl sm:text-5xl`, L1030 `text-4xl`→`text-xl sm:text-4xl` **[loc]**
- L850 `flex flex-wrap` (+ `ml-0 sm:ml-12`) ; L868 `flex flex-wrap items-center gap-2` **[P4]**
- L1502 `h-9`→`h-11 sm:h-9` **[P5]**

**UserManagement.tsx** (`client/src/pages/UserManagement.tsx`)
- L367 checkbox sélection `opacity-0 group-hover:opacity-100`→`opacity-100 sm:opacity-0 sm:group-hover:opacity-100` **[P6]**
- L456/L461 vue liste : carte `md:hidden` (avatar+nom / email/role/date labellisés / checkbox+suppr), a minima L461 `hidden sm:block`→`block` **[P3]**
- L582-611 matrice permissions `px-6`→`px-3 sm:px-6` **[loc]**
- L420 `py-2`→`py-2.5 min-h-[44px]` ; L512 `p-2`→`p-2.5 min-h-[44px] min-w-[44px]` **[P5]**

**DlcTracker.tsx**
- L303 ligne produit → `flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4`, wrapper infos `w-full sm:flex-1 min-w-0`, bloc badge+delete `w-full sm:w-auto justify-end` **[P4/P8]**
- L164 `grid grid-cols-3 gap-4`→`grid grid-cols-3 gap-2 sm:gap-4` + L172 `p-4`→`p-3 sm:p-4` **[P1]**
- L268 `py-1`→`py-1.5` ; L156 `py-2`→`py-2.5` **[P5]**

---

## 3. Ordre d'exécution recommandé

Principe : d'abord un **balayage global de one-liners** (impact/effort maximal, débloque des fonctions inaccessibles), puis les **conversions table→cartes** par fréquence d'usage, puis le polish minor.

| Vague | Contenu | Écrans | Effort |
|---|---|---|---|
| **0 — Sweep global (½ j)** | Tous les **[P6]** (hover tactile, bugs fonctionnels), **[P1]** grilles, **[P4]** flex-wrap/stack, **[P5]** tactile, **[P7]** overflow-hidden. Grep-driven, aucun re-design. | KitchenMode L2743/910, ServiceTracker L1286, Clients L1288, UserManagement L367 (P6) + tous les grid-cols/flex-wrap/py-1.5 des 20 écrans | ~4 h, très haut ROI |
| **1 — Tables éditables cœur métier (2 j)** | **[P3]** sur les tables où l'utilisateur clique/édite au quotidien. | **Ingredients → Inventory → Recipes(L4102 d'abord) → Planning** | ~0,5 j/écran |
| **2 — KDS/POS tactiles (1 j)** | Finir **KitchenMode** (board `overflow-y-auto` + OrderCard) et **ServiceTracker** (KPI + actions). Cible = Samsung Tab A9+, priorité haute malgré verdict minor sur ServiceTracker. | KitchenMode, ServiceTracker | ~1 j |
| **3 — Tables de reporting (2 j)** | **[P3]** ×N. | **Comptabilite (5 tables) → MenuEngineering → Clients → WasteTracker → AutoOrders → Mercuriale → Suppliers** | ~0,3 j/table |
| **4 — Minor restants (½ j)** | Dashboard, RecipeDetail, Analytics, AllergenMatrix, WeighStation, DlcTracker, UserManagement (carte liste). | 7 écrans | ~4 h |

**Démarrer par KitchenMode L2743/L2776 + les 4 `[P6]`** : ce sont des régressions fonctionnelles pures (contrôles totalement inatteignables au doigt), coût une ligne chacune. Ensuite Ingredients+Inventory (écrans les plus consultés en service). Valider chaque écran à 390px (capture + inspection visuelle, cf. discipline anti-vibe-coding) avant de passer au suivant.

**Total estimé : ~6 jours‑dev.** Réutilisation P3 = ~13 conversions table→cartes toutes calquées sur `InvoiceScanner.tsx` (5000e81) → factoriser éventuellement un helper `<DataCards>` si le temps le permet, sinon copier-coller le pattern.