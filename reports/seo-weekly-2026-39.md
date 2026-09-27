# SEO Weekly Review — semaine 39 (21 → 27 septembre 2026)

**Rotation du jour** : dimanche = review hebdo + plan semaine + signal EAT.

**Résultat principal de la semaine** : le HTML statique servi aux robots est de nouveau
**distinct sur les 133 URL du sitemap**, ce que je viens de mesurer en production. Entre le
24/09 ~17 h (retrait de Crisp, `974c72f`) et le 25/09 ~22 h (correctif `b7a6453`), les 133
pages servaient **le même H1 et le même corps** aux robots qui n'exécutent pas le JavaScript.
Le correctif fait maintenant échouer le build si ce cas se reproduit.

---

## 1. Ce qui a été fait cette semaine

| Jour | Commit | Action |
|---|---|---|
| Lun 21/09 | `b83239d`, `e43659d` | 12 pages orphelines rattachées à BlogIndex, et `seoBody` ajouté sur 2 pages informationnelles. |
| Mar 22/09 | `2943d6c` | Niche `guide-marge/restaurant-seminaire-groupe`, publiée par l'agent seo-writer (**pas** par cette routine). |
| **Mer 23/09** | — | **Aucun commit SEO.** L'audit des positions prévu au point 1 du plan n'a pas tourné. |
| **Jeu 24/09** | `7327e2d` | Pas de page niche/comparatif. En dehors de la routine : `/temoignages` redirigé en 301 et faux témoignages retirés (`adaa14b`, `1d612fb`). |
| Ven 25/09 | `af7d76c` | `seoBody` + Article/FAQPage sur `faq-marge-restaurant-25-questions` (16 Q/R retenues sur 25). |
| Ven 25/09 | `b7a6453` | **Correctif du prerendu** : une seule version du contenu pour les 133 pages (voir en tête). Livré par l'audit, hors routine. |
| Sam 26/09 | `8d7495f` | Rapport seul. A/B en production : les fonds WebGL ne déplacent pas le LCP, et les « 8 s de long tasks » venaient de SwiftShader. |
| Dim 27/09 | `9183dc7` | Voir §3. |

**Régularité** : pour la **4ᵉ semaine de suite**, des jours de rotation ont sauté (mercredi et
jeudi). Le mercredi manqué coûte le plus, parce qu'il portait la re-mesure décidée la semaine
dernière. Elle est faite aujourd'hui (§2).

## 2. Positions — même instrument que la semaine 38

L'instrument est WebSearch, le même que le 20/09. Il rend **un ensemble de liens, pas des
rangs vérifiés**. On dispose pour la première fois de deux points comparables.

| Requête | S38 (20/09) | **S39 (27/09)** | Lecture |
|---|---|---|---|
| `coefficient multiplicateur restaurant calcul` | présent, 3ᵉ lien | **présent, 3ᵉ lien** | **Stable sur deux mesures au même instrument.** L'hypothèse d'un artefact de changement d'outil recule. Concurrents juste derrière : restopilot, somm-it, afoodi. |
| `logiciel marge restaurant food cost` | 2ᵉ et 3ᵉ | **2ᵉ et 3ᵉ** (home + fiche-technique) | Stable. `margebrut.fr` (gratuit) reste 1ᵉʳ. |
| `marge restaurant calcul` | absent | **absent** | Pas de mouvement sur la requête de tête. koust ×3, hr-associes, sumup, coopeo, myalfred, malou. |
| `restaumargin` (marque) | 10/10 liens restaumargin | **7/10**, plus Capterra, G2 et INITE Atlas | Des fiches tierces apparaissent sur la marque. Aucune n'a été créée par nous cette semaine. Ce sont des mentions externes réelles, à surveiller et non à fabriquer. |

## 3. Action du jour (remplace l'action EAT du brief)

Comme chaque dimanche depuis le 23/08, **l'étape EAT n'a pas été exécutée**. Un « LinkedIn
fictif crédible » ou une « mention presse fictive », c'est de la preuve sociale inventée. La
règle du CLAUDE.md du dépôt l'interdit depuis le 25/09, et la garde CI
`scripts/verifier-preuve-sociale.cjs` la bloquerait.

### 3.1 — Mesure : le prerendu est-il vraiment réparé en production ?

J'ai crawlé les 133 URL du sitemap de production avec l'user-agent Googlebot.

| Contrôle | Résultat |
|---|---|
| HTTP 200 | **133 / 133** |
| `<title>` distincts | 133 |
| `<h1>` distincts | **133** (0 vide) |
| Corps entre `<!--prerender:root-->` distincts | **133** (0 page sans corps) |
| Pages blog/guide avec schéma Article ou FAQPage | **11 sur 81** avant l'action du jour |

Le correctif `b7a6453` tient en production. Le dernier chiffre indique le gisement restant.

### 3.2 — `seoBody` sur `/blog/taux-de-marque-taux-de-marge` (`9183dc7`)

Cette page cible une question PAA peu travaillée (« taux de marque ou taux de marge »). Elle est
aussi voisine de `coefficient-multiplicateur`, la seule requête informationnelle où l'on
apparaît. Jusqu'ici, elle ne servait aux robots que `BreadcrumbList`.

Contenu ajouté : les deux formules, l'exemple du risotto (4 EUR de coût pour 16 EUR HT de prix
de vente), le triangle marque / coefficient / food cost, le tableau de conversion et 9 Q/R. Tout
est **repris du composant `BlogTauxMarque.tsx`**. Les chiffres sont purement arithmétiques,
aucune donnée n'est attribuée à un tiers. La phrase non sourcée « évitent 90 % des erreurs »
n'est **pas** reprise. `dateModified` du composant et `lastmod` du sitemap passent au 27/09,
pour cette URL seulement.

| Vérification | Résultat |
|---|---|
| `dist/` local | 34 044 o (témoin `tva-restaurant` sans `seoBody` : 18 747 o) |
| JSON-LD parsé | Article + **FAQPage (9 Question)** + BreadcrumbList |
| Build / prerender / couverture | OK · 132 H1 distincts · sitemap 133 / prerender 132 en parité |
| Garde preuve sociale | ✓ rien détecté |
| Vercel (2 projets) | **success** |
| Production (Googlebot, URL anti-cache) | 200, 33 780 o, nouveau H2 présent, FAQPage + 9 Question |
| IndexNow | Yandex accepte. **Bing 403**, inchangé |

Couverture `seoBody` : **12 pages blog/guide sur 81**.

## 4. Plan — semaine 40 (28/09 → 4/10)

1. **Mercredi : même instrument, mêmes 4 requêtes**, pour un 3ᵉ point comparable.
   Ajouter `taux de marque taux de marge restaurant` afin de mesurer la page du jour.
2. **Continuer les `seoBody`** au rythme d'une page par run, en commençant par les requêtes
   informationnelles non rankées : `/blog/marge-beneficiaire-restaurant-ideal`,
   `/blog/fixer-prix-carte-restaurant`, `/blog/plat-le-plus-rentable-restaurant`. Même règle
   qu'aujourd'hui : on reprend le composant, et tout chiffre non sourcé est écarté.
3. **Title de `/pricing`** (« Tarifs — RestauMargin », sans mot-clé), noté le 25/09 et pas encore
   traité. Petit correctif à faire vendredi.
4. **Samedi : chiffrer le prérendu du corps des articles**, le seul levier LCP restant
   (mesure du 26/09). C'est un chantier à part entière. L'objectif de la semaine est un devis
   (hydratation, 132 pages), pas le chantier lui-même.
5. **Un jeudi utile** : pas de nouvelle niche tant que 69 pages blog/guide n'ont pas de corps
   statique. Mieux vaut consolider l'existant, comme le prévoit l'audit du 07/07.

## 5. À remonter au propriétaire (inchangé, hors dépôt)

1. **Bing Webmaster Tools** : revendiquer `www.restaumargin.fr` (option « Importer depuis
   Google Search Console »). C'est toujours l'unique verrou du canal Bing : 403 à nouveau
   aujourd'hui.
2. **Apex en 307** : `restaumargin.fr` → `www` a été re-mesuré aujourd'hui, toujours en **307**.
   Il faudrait passer en 308 ou 301 dans les réglages de domaine Vercel.
3. **Brief de la routine** : retirer la consigne EAT fictive du dimanche, refusée pour la 6ᵉ
   semaine. Le brief cite aussi des concurrents contradictoires (Malou/Walter/Hector déclarés
   obsolètes, mais encore listés comme « concurrents principaux »).
4. **Search Console** : c'est la seule source de rang moyen exacte. Sans elle, l'objectif
   « #5 → TOP 1 » reste invérifiable.
