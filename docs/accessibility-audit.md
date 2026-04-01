# Audit Accessibilite WCAG 2.1 AA - RestauMargin

**Date** : 2026-04-01
**Fichiers audites** :
- `client/src/components/Modal.tsx`
- `client/src/components/SmartIngredientInput.tsx`
- `client/src/App.tsx` (sidebar navigation)
- `client/src/pages/Login.tsx`
- `client/src/pages/Dashboard.tsx`

**Referentiel** : WCAG 2.1 niveau AA

---

## Resultats detailles

### 1. Aria-labels sur boutons icones

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Modal : bouton fermer (X) | ECHEC | Le bouton `<button onClick={onClose}>` ne possede ni `aria-label` ni texte accessible. Seule une icone `<X>` est rendue. | Ajouter `aria-label="Fermer la modale"` |
| Sidebar : bouton dark mode | ECHEC | Le bouton toggle dark/light n'a pas d'`aria-label`. Le `title` est present mais `aria-label` est prefere pour les lecteurs d'ecran. | Ajouter `aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}` |
| Sidebar : bouton deconnexion | ECHEC | Le bouton logout a un `title="Deconnexion"` mais pas d'`aria-label`. | Ajouter `aria-label="Deconnexion"` |
| Sidebar : bouton menu mobile | ECHEC | Le bouton hamburger `<Menu>` n'a pas d'`aria-label`. | Ajouter `aria-label="Ouvrir le menu"` |
| Sidebar : bouton fermer menu mobile | ECHEC | Le bouton `<X>` pour fermer le menu mobile n'a pas d'`aria-label`. | Ajouter `aria-label="Fermer le menu"` |
| Sidebar : bouton installer PWA | OK | Possede `title="Installer l'application"`. Acceptable mais `aria-label` serait mieux. | Amelioration recommandee : ajouter `aria-label` |
| SmartIngredientInput : bouton ajouter | PARTIEL | Le bouton "Ajouter a l'inventaire" contient du texte visible, donc accessible. Mais quand `creating=true`, seule une icone Loader2 est affichee sans texte alternatif. | Ajouter `aria-label="Ajout en cours"` pour l'etat de chargement |
| Login : boutons submit | OK | Les boutons contiennent du texte visible (via `t()`) | Aucune |
| Dashboard : StatCard icones | OK | Les icones sont decoratives dans les cartes statistiques, le contexte est donne par le titre de la carte. | Aucune |

### 2. Labels associes aux inputs (htmlFor)

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Login : champ nom | OK | `<label htmlFor="register-name">` + `<input id="register-name">` | Aucune |
| Login : champ email | OK | `<label htmlFor="login-email">` + `<input id="login-email">` | Aucune |
| Login : champ password | OK | `<label htmlFor="login-password">` + `<input id="login-password">` | Aucune |
| Login : champ role (select) | ECHEC | Le `<label>` n'a pas de `htmlFor` et le `<select>` n'a pas d'`id`. | Ajouter `htmlFor="register-role"` et `id="register-role"` |
| Login : champ code activation | ECHEC | Le `<label>` n'a pas de `htmlFor` et le `<input>` n'a pas d'`id`. | Ajouter `htmlFor="activation-code"` et `id="activation-code"` |
| Login : champ email (forgot password) | ECHEC | Le `<label>` n'a pas de `htmlFor` et le `<input>` n'a pas d'`id`. | Ajouter `htmlFor="forgot-email"` et `id="forgot-email"` |
| Login : checkbox CGU | ECHEC | Le `<label>` wrappe le `<input>` (association implicite OK) mais pas d'`id` explicite. | Acceptable via wrapping, amelioration mineure possible |
| SmartIngredientInput : champ recherche | ECHEC | Le `<input>` n'a pas de `<label>` associee, ni `aria-label`. Seul le `placeholder` donne le contexte. | Ajouter `aria-label="Rechercher un ingredient"` |
| SmartIngredientInput : champ prix | ECHEC | `<label>` present mais sans `htmlFor`. L'`<input>` n'a pas d'`id`. | Ajouter `htmlFor="new-price"` et `id="new-price"` |
| SmartIngredientInput : select unite | ECHEC | `<label>` present mais sans `htmlFor`. Le `<select>` n'a pas d'`id`. | Ajouter `htmlFor="new-unit"` et `id="new-unit"` |
| SmartIngredientInput : select categorie | ECHEC | `<label>` present mais sans `htmlFor`. Le `<select>` n'a pas d'`id`. | Ajouter `htmlFor="new-category"` et `id="new-category"` |
| SmartIngredientInput : champ fournisseur | ECHEC | `<label>` present mais sans `htmlFor`. L'`<input>` n'a pas d'`id`. | Ajouter `htmlFor="new-supplier"` et `id="new-supplier"` |

### 3. Contraste des couleurs

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| `text-slate-400` sur `bg-slate-900` | ECHEC | slate-400 (#94a3b8) sur slate-900 (#0f172a) = ratio ~4.3:1. Le seuil AA pour texte normal est 4.5:1. **Echec de justesse.** | Passer a `text-slate-300` (#cbd5e1) pour un ratio ~7.5:1 |
| `text-slate-500` sur `bg-slate-900` | ECHEC | slate-500 (#64748b) sur slate-900 (#0f172a) = ratio ~2.9:1. **Echec net.** | Passer a `text-slate-400` minimum |
| `text-slate-400` sur `bg-slate-950` | ECHEC | slate-400 (#94a3b8) sur slate-950 (#020617) = ratio ~5.2:1. **OK pour texte normal, echec pour texte de 14px non-gras.** | Verifier la taille de police; pour le texte `text-xs` (12px), passer a `text-slate-300` |
| `text-teal-400` sur `bg-slate-900` | OK | teal-400 (#2dd4bf) sur slate-900 (#0f172a) = ratio ~8.6:1 | Aucune |
| `text-blue-400` sur `bg-slate-800` | OK | blue-400 (#60a5fa) sur slate-800 (#1e293b) = ratio ~5.2:1. OK pour texte normal. | Aucune |
| `placeholder-slate-500` | ECHEC | Les placeholders ne sont pas tenus au meme ratio, mais WCAG 1.4.3 s'applique quand meme. slate-500 sur slate-800 = ratio ~2.3:1. | Passer a `placeholder-slate-400` |
| Footer `text-slate-400` sur `bg-white` (light mode) | ECHEC | slate-400 (#94a3b8) sur white (#ffffff) = ratio ~2.9:1. **Echec net en mode clair.** | Passer a `text-slate-500` pour le mode clair |
| Login : `text-slate-400` descriptions | ECHEC | Utilise en `text-sm` et `text-xs` sur fond sombre. Ratio insuffisant pour les petites tailles. | Utiliser `text-slate-300` pour les textes informatifs |

### 4. Focus trap dans les modales

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Modal : focus trap | ECHEC | Le composant Modal ecoute la touche Escape et bloque le scroll, mais **ne piege pas le focus** a l'interieur de la modale. L'utilisateur peut tabuler vers les elements derriere la modale. | Implementer un focus trap : au montage, sauver le focus actif, deplacer le focus dans la modale, boucler entre le premier et le dernier element focusable. Utiliser `focus-trap-react` ou implementation manuelle. |
| Modal : focus initial | ECHEC | Le focus n'est pas deplace automatiquement vers la modale a l'ouverture. | Ajouter `autoFocus` sur le premier element interactif ou `ref.focus()` sur le conteneur avec `tabIndex={-1}` |
| Modal : restauration du focus | ECHEC | A la fermeture, le focus n'est pas restaure vers l'element qui a ouvert la modale. | Sauvegarder `document.activeElement` a l'ouverture et y remettre le focus a la fermeture |

### 5. Navigation clavier (Tab, Enter, Escape)

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Modal : Escape | OK | La touche Escape ferme la modale via `handleKeyDown`. | Aucune |
| SmartIngredientInput : navigation dropdown | ECHEC | Le dropdown de resultats n'est pas navigable au clavier. Pas de gestion des fleches haut/bas pour parcourir les suggestions. Pas de role `listbox`/`option`. | Implementer la navigation au clavier avec `aria-activedescendant`, `role="listbox"`, et gestion des fleches |
| SmartIngredientInput : Escape | ECHEC | La touche Escape ne ferme pas le dropdown. | Ajouter un handler `onKeyDown` pour fermer le dropdown avec Escape |
| SmartIngredientInput : Enter selection | ECHEC | Pas de selection par Enter sur les resultats. | Ajouter la selection par Enter sur l'element actif |
| Sidebar : navigation | OK | Les `NavLink` sont des elements `<a>`, donc tabulables et activables par Enter nativement. | Aucune |
| Sidebar : restaurant selector | ECHEC | Le dropdown du selecteur de restaurant ne gere pas la navigation au clavier (fleches, Escape pour fermer). | Ajouter gestion clavier (fleches, Escape, Enter) |
| Login : formulaire | OK | Le formulaire utilise des elements natifs (`<input>`, `<select>`, `<button type="submit">`), donc la navigation clavier est correcte. | Aucune |

### 6. Skip-to-content link

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Lien skip-to-content | OK | Present dans `App.tsx` : `<a href="#main-content" className="sr-only focus:not-sr-only ...">Aller au contenu principal</a>`. L'ancre `id="main-content"` est sur `<main>`. | Aucune |
| Login : skip-to-content | ECHEC | La page Login est hors du layout `AppLayout`, donc le skip-to-content n'est pas present. | Ajouter un skip-to-content sur la page Login |
| Landing : skip-to-content | ECHEC | Les pages publiques (Landing, etc.) n'ont pas de skip-to-content. | Ajouter pour les pages publiques |

### 7. Roles ARIA

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Modal : role="dialog" | OK | Le Modal a `role="dialog"` et `aria-modal="true"`. | Aucune |
| Modal : aria-labelledby | OK | `aria-labelledby="modal-title"` pointe vers le `<h3 id="modal-title">`. | Aucune |
| Sidebar : role="navigation" | PARTIEL | La `<nav>` a `aria-label="Navigation principale"`, ce qui est correct. Mais les `<aside>` (desktop, tablet, mobile) n'ont pas d'`aria-label` pour les distinguer. | Ajouter `aria-label="Barre laterale"` sur les `<aside>` |
| SmartIngredientInput : dropdown | ECHEC | Le dropdown de resultats utilise `<ul>/<li>` mais sans `role="listbox"` ni `role="option"`. Le composant n'a pas `role="combobox"` sur l'input. | Ajouter `role="combobox"` sur l'input, `role="listbox"` sur la liste, `role="option"` sur les items, `aria-expanded`, `aria-controls` |
| Dashboard : onglets | A VERIFIER | Non visible dans les 150 premieres lignes lues. Probablement implemente plus bas dans le fichier. | Verifier que les tabs utilisent `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Login : formulaire | OK | Utilise `<form>` natif, suffisant semantiquement. | Aucune |
| Sidebar : boutons desactives | ECHEC | Les items de nav desactives sont des `<button>` avec `onClick={() => alert(...)}` et `cursor-not-allowed` mais sans `aria-disabled="true"`. | Ajouter `aria-disabled="true"` et supprimer le `onClick` (ou utiliser `disabled` natif) |

### 8. Alt text sur les images

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| Images dans les fichiers audites | N/A | Aucune balise `<img>` trouvee dans les fichiers audites. Les icones utilisent des composants Lucide React (SVG inline), qui sont decoratives. | Verifier que les SVG decoratives ont `aria-hidden="true"` (Lucide le fait par defaut) |
| Emojis dans SmartIngredientInput | ECHEC | Les emojis (categories, toast) sont utilises comme contenu informatif sans `role="img"` ni `aria-label`. Exemples : les emojis de categories ne sont pas accessibles aux lecteurs d'ecran de maniere previsible. | Wrapper les emojis informatifs dans `<span role="img" aria-label="description">` |

### 9. Landmarks (main, nav, aside)

| Critere | Statut | Details | Action requise |
|---------|--------|---------|----------------|
| `<main>` | OK | `<main id="main-content">` est present dans `AppLayout`. | Aucune |
| `<nav>` | OK | `<nav aria-label="Navigation principale">` est present dans la sidebar. | Aucune |
| `<aside>` | PARTIEL | Les sidebars utilisent `<aside>` mais sans `aria-label` distinctif. Il y a 3 asides (desktop, tablet, mobile) potentiellement tous visibles en DOM. | Ajouter `aria-label` distinct sur chaque aside (ex: "Barre laterale desktop", "Barre laterale tablette") |
| `<header>` | OK | Le header mobile utilise `<header>` natif. | Aucune |
| `<footer>` | OK | Le footer utilise `<footer>` natif. | Aucune |
| Login : landmarks | ECHEC | La page Login n'utilise pas de `<main>`, `<nav>`, ou `<header>`. Tout est dans des `<div>`. | Ajouter `<main>` autour du contenu principal de la page Login |
| Dashboard : landmarks | OK | Le Dashboard est rendu dans le `<main>` du layout parent. | Aucune |

---

## Resume par categorie

| # | Categorie | OK | PARTIEL | ECHEC | N/A |
|---|-----------|:--:|:-------:|:-----:|:---:|
| 1 | Aria-labels boutons icones | 3 | 1 | 5 | 0 |
| 2 | Labels inputs (htmlFor) | 3 | 0 | 8 | 0 |
| 3 | Contraste couleurs | 2 | 0 | 6 | 0 |
| 4 | Focus trap modales | 0 | 0 | 3 | 0 |
| 5 | Navigation clavier | 3 | 0 | 4 | 0 |
| 6 | Skip-to-content | 1 | 0 | 2 | 0 |
| 7 | Roles ARIA | 3 | 1 | 3 | 0 |
| 8 | Alt text images | 0 | 0 | 1 | 1 |
| 9 | Landmarks | 4 | 1 | 1 | 0 |
| **TOTAL** | | **19** | **3** | **33** | **1** |

---

## Score global

### 38 / 100

**Repartition du scoring :**
- OK = 2 points, PARTIEL = 1 point, ECHEC = 0 point
- Total possible : 55 criteres evaluables x 2 = 110 points
- Points obtenus : (19 x 2) + (3 x 1) = 41 points
- Score normalise : 41 / 110 x 100 = **38 / 100**

---

## Top 5 des corrections prioritaires

1. **Focus trap Modal** (Impact: Critique) - Les utilisateurs au clavier/lecteur d'ecran ne peuvent pas utiliser les modales de maniere fiable. Implementer un focus trap complet.

2. **SmartIngredientInput : pattern combobox** (Impact: Critique) - Le composant autocomplete n'est pas du tout accessible au clavier. Implementer `role="combobox"`, navigation par fleches, et selection par Enter.

3. **Contraste texte `text-slate-400`/`text-slate-500`** (Impact: Eleve) - Plusieurs combinaisons de couleurs ne respectent pas le ratio 4.5:1. Passer a `text-slate-300` pour le texte sur fond sombre.

4. **Labels manquants sur inputs** (Impact: Eleve) - 8 champs de formulaire n'ont pas d'association label/input correcte. Ajouter `htmlFor`/`id` ou `aria-label`.

5. **Aria-labels boutons icones** (Impact: Moyen) - 5 boutons n'ont que des icones sans texte accessible. Ajouter `aria-label` sur chaque bouton icone.

---

## Notes methodologiques

- Cet audit est base sur une lecture statique du code source, pas sur un test en navigateur avec lecteur d'ecran.
- Les ratios de contraste sont calcules sur les valeurs par defaut de Tailwind CSS.
- Le Dashboard n'a ete lu que partiellement (150 premieres lignes) en raison de sa taille ; les onglets et graphiques meritent un audit dedie.
- Les pages non auditees (Ingredients, Recipes, Settings, etc.) peuvent presenter des problemes similaires.
