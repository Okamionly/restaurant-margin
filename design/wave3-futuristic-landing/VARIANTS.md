# Design Variants — RestauMargin Landing Wave 3
# Futuriste B2B Food SaaS — 5 propositions

---

## Variant 1 — Obsidian Kitchen (RECOMMANDE — Cinematic Dark)

**Aesthetic family**: Cinematic Dark × Data-Dense Pro
**Inspiration anchors**: RunwayML, ClickHouse, Ferrari Configurator 2024
**Palette** (7 hex):
- `#050505` Surface bg (near-black, pas #000 pur pour garder depth)
- `#0A0F0D` bg-subtle (vert-noir, evoque la cuisine professionnelle)
- `#111A16` surface elevated (cards, modals)
- `#F5F2EC` fg (blanc chaud, not stark white)
- `#7A8C85` fg-muted (gris vert desature)
- `#00C878` accent (emeraude vif — "profit vert", different du teal generique)
- `#1A3328` accent-subtle (emeraude profond pour backgrounds hover)

**Typography**: Space Grotesk 600-800 (display) / General Sans 400-500 (body — deja en place) / JetBrains Mono 400 (chiffres/KPIs)
**Vibe**: Tableau de bord de cuisine etoilee Michelin — precision chirurgicale, profit vert qui pulse dans le noir.
**Ideal pour**: Chefs proprietaires ambitieux 30-50 ans, cherchent a professionnaliser leur gestion. Registre premium sans etre luxe vain.
**Hook visuel**: Hero avec dashboard screenshot qui s'allume ligne par ligne (reveal scan), chiffres KPI qui comptent vers le haut sur fond quasi-noir. Section FEATURES : cards avec bordure vert-phosphore en hover. PRICING : contraste extreme noir/vert, prix en Space Grotesk 80px.

**Plus** : Le vert emeraude evoque profit + cuisine. Deja dans la palette teal-to-emerald du projet. Lisible sur tablette en cuisine (fond sombre = moins d'eblouissement). Rare dans le secteur food SaaS (differenciateur fort).
**Moins** : Peut sembler froid pour les petits bistrots familiaux. Risque si mal execute (trop "tech startup" vs "outil de cuisine").

---

## Variant 2 — Carbon Bistro (Terminal-Core × Warm)

**Aesthetic family**: Terminal-Core × Warm Editorial
**Inspiration anchors**: Warp Terminal, Resend, Linear — mais avec une chaleur bistrot
**Palette** (7 hex):
- `#0C0B09` bg (quasi-noir chaud — pas froid)
- `#1A1612` surface (brun tres sombre)
- `#2A2318` surface-elevated
- `#F0EBE0` fg (creme — papier bistrot)
- `#9A8F80` fg-muted (sable)
- `#E8A23A` accent (or ambre — evoque le beurre noisette, les sauces)
- `#3A2E1C` accent-subtle

**Typography**: Satoshi 700-900 (display — deja en place) / General Sans 400 (body) / Geist Mono 400 (KPIs uniquement)
**Vibe**: Carnet de recettes d'un chef deux etoiles numérisé — artisanal et hyper-precis simultanement.
**Ideal pour**: Chefs passionnes qui voient la cuisine comme un metier d'art. Bistrots gastronomiques, restaurants de terroir premium.
**Hook visuel**: Texture subtile papier kraft en background, chiffres en mono gold, cards avec coin plié effet papier. Hero avec une photo cuisine en B&W + overlay chaud.

---

## Variant 3 — Neon Commissary (Neon Brutalist — statement)

**Aesthetic family**: Neon Brutalist
**Inspiration anchors**: PostHog, ClickHouse yellow, The Verge redesign 2023
**Palette** (7 hex):
- `#000000` bg
- `#111111` surface
- `#FAFF69` accent (jaune citron electrique — ClickHouse signature)
- `#FF3B3B` error/alert (rouge alarme — food cost trop haut)
- `#FFFFFF` fg
- `#888888` fg-muted
- `#1A1A00` accent-subtle

**Typography**: Anton 400 (display — ultra-bold, impactant) / Inter 400-500 (body) / IBM Plex Mono 500 (KPIs)
**Vibe**: Tableau de bord de trading applique a la restauration — aucune pitie pour les marges negatives.
**Ideal pour**: Multi-franchises, dark kitchens, restaurateurs data-driven qui veulent un outil qui leur ressemble.
**Hook visuel**: Grid dense de KPIs en jaune sur noir. Features en cards "terminal". CTA "Commencer l'audit" pas "Essai gratuit". Ton assertif.

**Moins** : Trop agressif pour les petits restaurants independants. A reserver si la cible evolue vers les chaines/dark kitchens.

---

## Variant 4 — Frosted Brigade (Glass / Soft-Futurism)

**Aesthetic family**: Glass / Soft-Futurism × Data-Dense
**Inspiration anchors**: Apple Vision Pro interface, Linear (light), Airbnb 2024
**Palette** (7 hex):
- `#F7F6F4` bg (blanc tres chaud)
- `#FFFFFF` surface
- `#F0EDE8` bg-subtle
- `#1A1A1A` fg
- `#6B6560` fg-muted
- `#059669` accent (emerald-600 — classique mais justifie ici pour food)
- `rgba(255,255,255,0.7)` glass-surface

**Typography**: Satoshi 600-800 (display) / General Sans 400-500 (body)
**Vibe**: App de gestion que ton comptable et ton chef utiliseraient avec plaisir — moderne sans intimider.
**Ideal pour**: Restaurants etablis, directeurs d'exploitation, publics moins jeunes qui veulent "professionnalisme" avant "innovation".
**Hook visuel**: Hero split avec illustration 3D cuisine frosted. Cards avec backdrop-blur. Ombres tres douces, beaucoup d'air.

---

## Variant 5 — Graphite Station (Editorial Minimalism × futuriste)

**Aesthetic family**: Editorial Minimalism (Vercel/Linear energie) mais avec densité B2B food
**Inspiration anchors**: Vercel.com, Stripe, Mercury Banking
**Palette** (7 hex):
- `#FAFAF9` bg (blanc casse tres leger)
- `#FFFFFF` surface
- `#111111` fg
- `#525252` fg-muted
- `#0E7A5A` accent (vert fonce precis, pas le teal generique)
- `#DCFCE7` accent-subtle (vert pale)
- `#E4E4E4` border

**Typography**: Inter 600-800 (display) / General Sans 400-500 (body — deja en place)
**Vibe**: Le Linear de la restauration — minimalisme sans froideur, tout est au service de la donnee.
**Ideal pour**: Early adopters tech-savvy, restaurateurs qui connaissent Notion/Linear, urban food entrepreneurs.

---

## Recommandation

**Variant 1 — Obsidian Kitchen** est le plus strategique pour RestauMargin :

1. Differentiation radicale dans un secteur food SaaS encore majoritairement "light + teal" (Lightspeed, Skello, Inpulse — tous light mode)
2. Le vert emeraude `#00C878` est semantiquement fort : profit, cuisine, validation — pas decoratif
3. Dashboard sombre = confort visuel en cuisine (ecran en cuisine = forte luminosite ambiante variable)
4. Cible chefs 30-50 ans : ils regardent MasterChef, Netflix food docs — ils sont acculteres au dark premium
5. Space Grotesk pour les titres + General Sans pour le corps = pairing deja partiellement en place, cohérent

**Note sur Variant 2** : Si le user veut chaleur et artisanat en prime, Carbon Bistro est un excellent plan B ou pour une variante "landing FR traditional" complementaire.
