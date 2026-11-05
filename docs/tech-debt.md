# RestauMargin - Audit Dette Technique

> Date : 2026-04-01

---

## CRITIQUE (a fixer maintenant)

### 1. JWT_SECRET hardcode dans le code source

- **Fichier** : `api/index.ts` ligne 14
- **Probleme** : Le fallback `'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI'` est en clair dans le repo Git. Si `JWT_SECRET` n'est pas defini dans l'env, ce secret statique est utilise en production.
- **Risque** : N'importe qui ayant acces au repo peut forger des tokens JWT valides.
- **Fix** : Supprimer le fallback, crash au demarrage si `JWT_SECRET` est absent.

```typescript
// AVANT (dangereux)
const JWT_SECRET = process.env.JWT_SECRET || 'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI';

// APRES (securise)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET manquant');
```

### 2. Monolithe api/index.ts (3786 lignes)

- **Fichier** : `api/index.ts`
- **Probleme** : Tout le backend (auth, recettes, ingredients, mercuriale, chat IA, admin, HACCP, fournisseurs, etc.) dans un seul fichier.
- **Risque** : Impossible a maintenir, conflits Git frequents, difficulte a tester unitairement.
- **Fix** : Decouper en modules par domaine :
  - `api/routes/auth.ts`
  - `api/routes/recipes.ts`
  - `api/routes/ingredients.ts`
  - `api/routes/mercuriale.ts`
  - `api/routes/chat.ts`
  - `api/routes/admin.ts`
  - `api/middleware/auth.ts`

---

## HAUTE (a fixer ce mois)

### 3. 349 classes "blue" restantes dans le frontend

- **Scope** : `client/src/` (fichiers .tsx et .ts)
- **Probleme** : Le design system a migre vers teal (`bg-teal-600`, `neon-teal`), mais 349 occurrences de `blue-600`, `blue-700`, `blue-500` subsistent.
- **Impact** : Incoherence visuelle, boutons/liens melangeant bleu et teal.
- **Fix** : Rechercher/remplacer `blue-600` -> `teal-600`, `blue-700` -> `teal-700`, `blue-500` -> `teal-500` dans tous les fichiers tsx.

### 4. Zero tests automatises

- **Probleme** : Aucun fichier `.test.ts`, `.test.tsx` ou `.spec.ts` dans le projet (hors node_modules).
- **Impact** : Chaque deploy est un pari. Regressions non detectees.
- **Fix prioritaire** :
  - Tests unitaires pour l'auth (login, register, token)
  - Tests API pour les routes critiques (recettes, ingredients)
  - Tests composants React pour le dashboard

### 5. Composants UI partages manquants

- **Composants existants** : `Modal`, `Toast`, `ConfirmDialog`, `ErrorBoundary`, `ConnectivityBar`
- **Composants manquants** :
  - `Button` : Chaque page re-cree ses boutons avec des classes inline
  - `Table` : Pas de composant table reutilisable (tableaux refaits partout)
  - `SearchBar` : Input de recherche duplique dans chaque page
  - `Card` : Classe CSS `.card` existe mais pas de composant React
- **Impact** : Duplication massive, incoherence entre pages, changement de style = toucher 30+ fichiers.

---

## MOYENNE (a planifier)

### 6. i18n incomplet (~16 pages)

- **Probleme** : Environ 16 pages contiennent encore des strings francaises en dur au lieu d'utiliser `t("key")`.
- **Tracking** : Voir `project_i18n_remaining.md`
- **Impact** : L'app ne peut pas etre utilisee en anglais/arabe/espagnol/allemand correctement.

### 7. CLAUDE.md desynchronise

- **Probleme** : Le fichier `CLAUDE.md` reference `bg-blue-600` comme bouton primaire alors que le design utilise maintenant `teal-600`. Les conventions documentees ne refletent pas l'etat reel du code.
- **Fix** : Mettre a jour les sections "Style" et "Boutons primaires".

### 8. CSS global trop charge

- **Fichier** : `client/src/index.css`
- **Probleme** : Contient des effets visuels lourds (noise texture SVG sur body::before avec z-index 9999, gradient mesh background). Ces effets sont appliques globalement.
- **Impact** : Performance potentiellement affectee sur tablettes (Tab A9+), le overlay SVG couvre tout l'ecran en permanence.

---

## BASSE (amelioration future)

### 9. Pas de validation schema API (Zod/Joi)

- **Probleme** : Les routes Express ne valident pas les body/params avec un schema. Validation manuelle inline.
- **Fix** : Ajouter Zod pour la validation des requetes.

### 10. Pas de rate limiting

- **Probleme** : Aucune protection contre le brute-force sur `/api/login` ou l'abus de l'endpoint chat IA.
- **Fix** : Ajouter `express-rate-limit` sur les routes sensibles.

### 11. Pas de logging structure

- **Probleme** : Utilisation de `console.log` partout. Pas de niveaux de log (info, warn, error), pas de correlation d'erreurs.
- **Fix** : Adopter `pino` ou `winston` avec des niveaux structures.

### 12. Tailwind config - fonts non chargees

- **Fichier** : `client/tailwind.config.js`
- **Probleme** : Les fonts `Satoshi` et `General Sans` sont definies dans la config mais il n'y a pas de preuve de leur chargement (pas de @font-face ou Google Fonts link visible).
- **Impact** : Fallback silencieux sur `DM Sans` / `Inter` / `system-ui`.

---

## Resume

| Priorite | Items | Effort estime |
|----------|-------|---------------|
| CRITIQUE | 2     | 2-3 jours     |
| HAUTE    | 3     | 1-2 semaines  |
| MOYENNE  | 3     | 1 semaine     |
| BASSE    | 4     | Continu       |

---

## Dette ouverte — audit du 2026-09-25 (reportee a une prochaine vague)

> L'audit de 8 dimensions du 2026-09-25 a ete corrige en grande partie le jour meme
> (commits 280ceee → e0d8c5d : isolation multi-restaurant, webhooks, relais d'email,
> revocation des jetons, cout IA, caches, file hors ligne, prerendu, routines cloud...).
> Restent ici les points NON traites, du plus au moins important. Aucun n'est ouvert
> par accident : chacun a ete lu, et reporte.

### Decisions produit (a trancher par le fondateur, pas par un agent)

1. **Parrainage : recompenses promises, jamais appliquees.** L'interface promet -20 % au
   filleul et 1 mois offert au parrain ; aucun coupon ni credit Stripe n'est applique par
   le code. Le suivi et la qualification sont cables depuis 27b0016 (le fondateur est
   prevenu quand un filleul paie). Choisir : implementer (coupon Stripe au checkout +
   credit client a la qualification) ou reformuler `MesParrainages.tsx`.
2. **Contacts de prospection dans un depot PUBLIC.** `docs/campaigns/montpellier-contacts*.csv`
   (~200 restaurants : emails dont ~25 adresses Gmail/Hotmail, telephones, adresses).
   Retirer du depot (et de l'historique si necessaire) ou justifier.
3. **Prospection automatique** (routine `outreach-bot`, desactivee) : ne la relancer
   qu'avec une liste reelle constituee legalement et un envoi cote serveur.

### Technique

4. **Resend : erreurs encore non lues.** Lisent `{ data, error }` : inscription (notification
   fondateur), fin d'essai, onboarding, campagne, email/send, accuse inbox-sync, parrainage.
   Ne le lisent pas encore : email de bienvenue, verification, reinitialisation du mot de
   passe, notifications diverses (~20 appels). Le SDK ne leve jamais.
5. **Limite de debit IA en memoire par instance** (`Map` dans `api-lib/routes/ai.ts`) :
   Upstash n'est pas configure sur Vercel. Brancher `UPSTASH_REDIS_REST_URL/TOKEN` et
   passer `checkAiRateLimit` sur `ratelimit()`.
6. **inbox-sync non atomique** : import du message puis marquage `notif_log` ; un crash
   entre les deux peut re-importer. Envisager une transaction ou marquer d'abord.
7. **Soft 404** : toute URL inconnue repond 200 avec la page d'accueil, et un visiteur
   anonyme est renvoye sur /login (catch-all `/*` -> ProtectedRoute dans `App.tsx`).
   Ajouter une 404 publique `noindex` pour les chemins inconnus.
8. **Donnees structurees** : FAQPage en double sur 7 articles ; `dateModified` = date du
   build (`BUILD_DATE` dans `client/scripts/prerender.cjs`) : change a chaque deploiement.
9. **CSP** : `'unsafe-eval'` et `'unsafe-inline'` dans `script-src` (`vercel.json`). A retirer
   apres test page par page (une lib WASM exigerait `'wasm-unsafe-eval'`).
10. **Observabilite** : journaux Vercel ~1 h (Hobby), aucun log drain, aucune capture
    d'erreurs serveur.
11. **Planification GitHub Actions** : les crons derivent de plusieurs heures et sautent des
    passages (limite connue de GitHub). Si la ponctualite compte, planificateur externe.
12. **Cannibalisation du blog** (TVA, KPI, FIFO, prix de vente) : fusionner ou rediriger.
13. **EmailMarketing.tsx** : compteurs de destinataires ecrits en dur (342 / 67 / 89) a
    verifier et retirer s'ils sont fictifs (signal fabrique).
14. **Monolithe** `api/index.ts` (~7 500 lignes) : toujours d'actualite (voir point 2 ci-dessus).

### Actions humaines en attente (hors code)

- Revoquer puis recreer les cles **Tavily** et **Exa** (presentes dans l'historique git
  public), puis mettre a jour les variables Vercel.
- Ajouter les secrets `E2E_DEMO_EMAIL` / `E2E_DEMO_PASSWORD` au depot (tests E2E).
- Revoquer les jetons Vercel temporaires utilises pendant les sessions d'audit.

## Dette SEO — session du 2026-11-04 (« marge restaurant »)

- **Accents sur les pages de contenu — FAIT le 2026-11-04** (7 lots : `4963a43` pour le lot 1,
  embarqué par une session concurrente via l'index git partagé, puis `32d388f`, `dfed507`,
  `040e612`, `4699bd4`, `c50302d`, `3f7517a`). Texte visible des 81 pages `client/src/pages/Blog*`
  et `Logiciel*` (il n'existe pas de fichier `Guide*`) : texte JSX, FAQ, title/description
  `SEOHead`, JSON-LD, alt. Les title, description et seoBody des mêmes routes ont été corrigés à
  l'identique dans `client/scripts/prerender.cjs`. Environ 30 300 mots accentués : corrections
  certaines par lexique (336 000 formes fléchies), cas ambigus (a/à, ou/où, participes, des/dès,
  marche/marché) tranchés en contexte et contrôlés par motifs. Ajout d'accents uniquement,
  vérifié par script contre HEAD à chaque lot : aucune URL, slug, ancre, `className`, clé ni
  identifiant modifié, fins de ligne conservées. Seule exception : le libellé « Tres fort » de
  `BlogSalaireProprietaireRestaurant` devient « Très fort » partout, y compris dans la comparaison
  qui colore le badge. Mesure après coup : 0 mot témoin sans accent dans le texte visible ; les
  101 occurrences brutes restantes sont des slugs, des ancres et des commentaires de code.
  Vérifié en prod (Googlebot) : titres accentués, pages de 103 à 120 Ko servies en SSR complet.
- **Fautes que l'ajout d'accents ne pouvait pas corriger — CORRIGÉES le 2026-11-04** (29
  remplacements exacts sur 16 pages et dans le seoBody de `prerender.cjs`) : « commission
  prélevée » ×2, « menus complets », « frites surgelées », « 0 et 4 degrés C », « produit noble »,
  « positionnement perçu », « taux revalorisés », « ne coûtent rien », « conçue », « en parallèle »,
  « imbattable », « idéalement » ×3, « sans éroder », « traçabilité » ×5, « inopinés », « food cost
  dédié » ×2, « Dupliquer l'établissement », « variantes compliquées », « événementiel »,
  « Exemples détaillés » ×2. Aucune URL, ancre ni identifiant touché (`#exemples-detail` intact).
- **Reste — laissés sans accent exprès** : marques et noms propres (Metro le grossiste, Pret A
  Manger, Phenix, Deliveroo Editions, Maitre'D, Neo-Restauration, Reels), anglicismes (email,
  no-show, events), sigle CA, adresses citées (economie.gouv.fr, impots.gouv.fr,
  france-renov.gouv.fr), code affiché (formules Excel, exemple Python Prophet).
- **Accents des pages publiques hors `Blog*`/`Logiciel*` — FAIT le 2026-11-04** (`1d55a52`). Les
  routes de `prerender.cjs` hors des 81 pages n'étaient pas 15 mais 39 : `/guide-marge/*` (12 sur
  18, les 6 autres étaient déjà accentuées), `/demo`, `/fonctionnalites/*`, les 8
  `/alternative-*`, les 2 `/comparatif-*`, `/glossaire-restauration`, `/outils/*`,
  `/station-produit` et les 4 pages légales : 54 title/description accentués, accordés aux
  composants. Composants identifiés par `App.tsx` : texte visible de 21 fichiers sur 31
  (`NicheLanding`, `Demo`, 2 `Fonctionnalite*`, les 8 `Alternative*`, les 2 `Comparatif*`,
  `GlossaireRestauration`, `FoodCostCalculator`, `QRCodeGenerator`, `MentionsLegales`, `CGV`,
  `CGU`, `PolitiqueConfidentialite` ; les 10 autres étaient déjà accentués) : 7 504 mots, dont
  environ 5 700 décisions de contexte tranchées par relecteurs. Repris à la main : `document.title`
  de `Demo` et `QRCodeGenerator`, meta description et feuille imprimée des QR codes. Ajout
  d'accents uniquement, vérifié contre HEAD par un vérificateur indépendant (texte identique sans
  diacritiques ; URL, chemins, ancres, domaines et attributs techniques identiques). Relecture
  indépendante de 250 phrases tirées au hasard : 1 faute trouvée et corrigée (« format
  structuré »). `check-content-accents.cjs` lancé sur ces 31 pages : OK (1 515 signalements sur
  leur version d'avant).
- **Reste — laissés tels quels exprès (31 pages)** : marques et noms (Metro le grossiste, Pi
  Electronique, Google Reservations, Yums, Saint-Jacques), anglais (email, Depreciation, « We're
  live »), sigles (BLE, EPI, SIRENE, CA), adresse américaine (Lemon Ave), couleurs hexadécimales du
  générateur de QR, ligature « oe » (oeuvre, oeufs).
- **Reste — fautes qu'aucun accent ne corrige (31 pages)** : `NicheLanding` « les grammages sont
  maîtrisé » ×2, « Food cost viande grillé » (aussi dans la description `prerender.cjs` de
  `/guide-marge/kebab-fast-food`), « main-d'oeuvre renforcé », « la carte mélanges »,
  « Ingrédients péris vite » (périssables ?), « frigos/conges » (laissé sans accent : « congés »
  serait un contresens), « glagons », « ingredientsune » et « preparationsreutilisant » (espaces
  manquantes) ; `ComparatifRestauMarginZenchef` « secteurZenchef » (description SEOHead) ;
  `FonctionnaliteMenuEngineering` « Savez quel plat retirer » (Sachez, aussi dans
  `prerender.cjs`) ; `CGV` « dénude d'ambiguïté » (dénuée), « pannes généralises » ;
  `PolitiqueConfidentialite` « la licite du traitement » ×3 (licéité).
- **Reste — title/description divergents entre `SEOHead` et `prerender.cjs` (antérieur)** : 19
  champs sur 14 routes ne disent pas la même chose côté Google et côté navigateur (ex.
  `/glossaire-restauration` « 60+ définitions » contre « 50+ », `/demo`, `/launch`, 6
  `/alternative-*`, les 2 `/comparatif-*`, `/outils/generateur-qr-menu`). Accents posés des deux
  côtés ; le texte reste à unifier (une seule source).
- **Reste — code** : `NicheLanding` affiche le slug comme texte (« Les enjeux spécifiques de votre
  {slug} » donne « votre cafe coffee-shop », « votre creperie ») : prévoir un libellé accentué par
  niche.
- **Garde-fou étendu à ces pages — FAIT le 2026-11-04** : `PAGES_DE_CONTENU` couvre aussi
  `Alternative*`, `Comparatif*`, `Fonctionnalite*` et 13 pages nommées (`NicheLanding`, `Demo`,
  outils, station, lancement, pages légales) ; `content:check` lit 111 pages et passe. Il rougit
  sur leurs versions d'avant les accents (6 pages testées, une par famille de motif). Les 5 autres
  pages publiques prérendues (`Landing`, `Pricing`, `APropos`, `Login`,
  `CalculateurMargeRestaurant`) le passent aussi (mesuré) mais n'y sont pas encore.
- **Garde-fou accents — FAIT le 2026-11-04** : `npm run content:check`
  (`client/scripts/check-content-accents.cjs`), aussi lancé par `npm run seo:check`. Lit le texte
  visible des pages `Blog*`/`Logiciel*` par l'AST TypeScript (slugs, ancres, classes, arguments
  d'appels, comparaisons, `<code>`, commentaires et domaines cités jamais lus) ; exit 1 avec
  fichier:ligne, mot → correction, sur 110 témoins sans accent, accents partiels compris. Mesuré
  sur les 81 pages : une page entière réécrite sans accents donne au moins 27 signalements, un
  passage de 41 à 100 mots est attrapé à 86 %, de 16 à 40 mots à 65 % (détecteur de passages, pas
  correcteur). Il a trouvé deux « salarie » (`BlogPourboiresRestaurant`) que le lexique avait
  laissés, car *salarier* est un verbe : corrigés. Un témoin intégré le fait rougir si l'une de ses
  7 règles casse. **Branché dans le CI le 2026-11-04** (job `typecheck`, étape « Accents du texte
  visible ») : tout push sur `main` et toute PR le lancent, quelle que soit la routine qui a écrit
  la page, y compris celles qui appellent `check-seo-coverage.cjs` directement. **Branché aussi
  sur le `buildCommand` Vercel le 2026-11-04** (oui du fondateur), en premier maillon : une page
  sans accents fait échouer le déploiement, et la production reste sur le dernier déploiement
  réussi. Revers assumé : tant que la faute n'est pas corrigée, tout autre déploiement est bloqué
  aussi ; le message d'échec donne fichier:ligne et la forme correcte.
- **Position sur « marge restaurant »** : 55 en moyenne sur 3 mois, 26-28 sur 28 jours (GSC). Le guide
  a ete recentre le 04/11 (commit `d401ff1`). A remesurer dans la Search Console vers le 25/11, meme
  filtre (requete exacte, onglet Pages). Le plafond restant est l'autorite du domaine : liens entrants,
  action fondateur (annuaires logiciels, medias restauration).

## Dette SEO — comparatifs (session du 2026-11-05)

Relevé en écrivant `/alternative-inpulse`, non corrigé hors Inpulse :

- **Connexion à la caisse annoncée à tort** : `AlternativeLightspeed.tsx` écrit que RestauMargin « se connecte » à Lightspeed (« intégration ou export CSV », « import API »). `api/index.ts` ne contient aucun connecteur de caisse ; seul existe le collage d'un CSV de ventes dans `MenuEngineering.tsx`. À vérifier sur les autres `Alternative*`.
- **Prix concurrents sans source et contradictoires** : Easilys vaut 80 €/mois (`BlogInventaire`), 99-199 € (`BlogLogicielGestion`) et 149 € (`ComparatifLogicielsRestaurant`), alors qu'aucun tarif public n'a été trouvé. Les autres montants et notes G2 de `BlogLogicielGestion` (Skello 4,5 etc.) n'ont pas été vérifiés.
- **Chiffres de gain sans source** : `BlogLogicielGestion` promet 8 à 15 heures par semaine et 1 à 2 points de food cost pour une « stack » type.
- **Schema statique** : les pages `/alternative-*` n'ont que `BreadcrumbList` dans le HTML servi ; `FAQPage` et `Article` n'apparaissent qu'après exécution du JS (`SEOHead`). `prerender.cjs` ne les émet que pour `article` et `guide`, à partir d'un `seoBody`. Point sensible pour Bing.
