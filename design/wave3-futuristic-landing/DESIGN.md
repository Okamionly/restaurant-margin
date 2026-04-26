# DESIGN.md — RestauMargin Landing Wave 3
# Variant: Obsidian Kitchen (Cinematic Dark × Data-Dense)

---

## 1. Theme

- **Aesthetic family**: Cinematic Dark × Data-Dense Pro
- **Mood**: precision, lucratif, professionnel-de-nuit
- **Density**: compact (B2B food — beaucoup d'info, scan-heavy)
- **Inspiration anchors**: RunwayML (dark + motion), ClickHouse (data density + yellow/green), Ferrari Configurator (dark luxury interactif)
- **Product type**: B2B SaaS food — outil de gestion quotidien
- **Audience**: Chefs proprietaires + directeurs de salle + managers multi-sites, 30-55 ans, France. Utilisent l'outil en cuisine ou en bureau arriere. Veulent des chiffres clairs, pas du marketing vague.

**Principe directeur** : Le fond noir n'est pas decoratif — il est fonctionnel. Un restaurateur qui ouvre son dashboard a 23h apres le service doit voir ses marges sans etre ebloui. Le vert `#00C878` est le seul "cri" autorise — il signifie PROFIT.

---

## 2. Colors

```css
:root {
  /* === Surfaces (dark mode first — mobile-first) === */
  --bg:               #050505;   /* near-black, not pure — garde depth visuel */
  --bg-subtle:        #0A0F0D;   /* vert-noir, evoque cuisine professionnelle */
  --surface:          #0F1612;   /* cards, panels */
  --surface-elevated: #1A2420;   /* modals, dropdowns, tooltips */
  --surface-hover:    #1F2E28;   /* hover state sur cards interactives */

  /* === Foreground === */
  --fg:               #F5F2EC;   /* blanc chaud — pas stark white, moins fatigant */
  --fg-muted:         #7A8C85;   /* gris vert desature pour labels secondaires */
  --fg-subtle:        #3D4D47;   /* placeholders, separateurs texte */

  /* === Accent — LE SEUL VERT VIF AUTORISE === */
  --accent:           #00C878;   /* emeraude electrique — profit, validation */
  --accent-fg:        #000000;   /* texte sur fond accent */
  --accent-subtle:    #001F12;   /* bg hover de badges, tags, liens subtils */
  --accent-hover:     #00E589;   /* hover du CTA primaire */
  --accent-glow:      rgba(0, 200, 120, 0.15); /* glow tres discret pour hero KPIs */

  /* === Semantic === */
  --success:          #00C878;   /* meme que accent — coherence */
  --warning:          #F59E0B;   /* ambre — alerte prix fournisseur */
  --error:            #EF4444;   /* rouge — food cost trop haut */
  --info:             #60A5FA;   /* bleu doux — infos generiques */

  /* === Borders === */
  --border:           #1A2E26;   /* bordures subtiles vert-gris fonce */
  --border-strong:    #2A4A3C;   /* separateurs actifs, focus rings */
  --border-accent:    rgba(0, 200, 120, 0.3); /* hover card border */
}

/* Light mode — pour les futures pages internes (pas la landing) */
.light {
  --bg:               #F9FAFB;
  --bg-subtle:        #F3F4F6;
  --surface:          #FFFFFF;
  --surface-elevated: #FFFFFF;
  --surface-hover:    #F0FDF4;
  --fg:               #111111;
  --fg-muted:         #6B7280;
  --fg-subtle:        #9CA3AF;
  --accent:           #059669;
  --accent-fg:        #FFFFFF;
  --accent-subtle:    #ECFDF5;
  --accent-hover:     #047857;
  --border:           #E5E7EB;
  --border-strong:    #D1D5DB;
}
```

**Regles couleur absolues** :
- Jamais plus d'un element `--accent` vif par viewport
- Le gradient autorise : `linear-gradient(135deg, #00C878, #00A862)` — CTA primaire uniquement
- Pas de glow permanent — seulement au hover (sinon "neon overload")
- Les screenshots du dashboard : filtre `brightness(0.92) contrast(1.05)` pour integration naturelle sur dark

---

## 3. Typography

**Stack en place (CLAUDE.md)** : Satoshi (titres) + General Sans (corps). Ces deux fontes restent. Space Grotesk remplace Satoshi pour les tres grands titres (72px+) uniquement — Satoshi reste pour H2-H3.

- **Display hero** : Space Grotesk, 700-800, tracking -0.04em, sizes 64-96px
- **H1-H2** : Satoshi, 700, tracking -0.025em
- **H3-H4** : Satoshi, 600, tracking -0.015em
- **Body** : General Sans, 400-500, tracking 0, line-height 1.65
- **Mono / KPIs** : JetBrains Mono, 400-600, tracking -0.01em (pour tous les chiffres : marges, pourcentages, prix)
- **Labels / badges** : General Sans, 500, tracking 0.06em, UPPERCASE

**Scale** :

| Token        | Size / Line-height | Weight | Tracking     |
|--------------|--------------------|--------|--------------|
| display-2xl  | 96px / 100px       | 800    | -0.04em      |
| display-xl   | 72px / 78px        | 700    | -0.035em     |
| display-lg   | 56px / 62px        | 700    | -0.03em      |
| h1           | 48px / 54px        | 700    | -0.025em     |
| h2           | 36px / 42px        | 700    | -0.02em      |
| h3           | 28px / 34px        | 600    | -0.015em     |
| h4           | 22px / 28px        | 600    | -0.01em      |
| body-lg      | 18px / 30px        | 400    | 0            |
| body-base    | 16px / 26px        | 400    | 0            |
| body-sm      | 14px / 22px        | 400    | 0            |
| caption      | 12px / 18px        | 500    | 0.04em       |
| kpi-xl       | 64px / 68px        | 600    | -0.02em (mono) |
| kpi-lg       | 48px / 52px        | 600    | -0.02em (mono) |
| label        | 11px / 16px        | 500    | 0.12em UPPER |

**Google Fonts import** :
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```
(Satoshi et General Sans sont deja charges dans le projet via assets locaux ou Fontshare)

---

## 4. Components

### Button

```
primary     : bg --accent → --accent-hover | text --accent-fg | radius 10px | px 24px py 14px | font Satoshi 600 15px | no border | shadow: 0 0 20px rgba(0,200,120,0.25) au hover
secondary   : bg transparent | border 1.5px --border-strong | text --fg | hover: border --accent text --accent | radius 10px
ghost       : bg transparent | text --fg-muted | hover: text --fg bg --surface | radius 10px
destructive : bg #EF4444/10 | border 1.5px #EF4444/40 | text #EF4444 | hover: bg #EF4444 text white
link        : text --accent | underline au hover | pas de radius

Transition : all 200ms ease
```

### Input

```
default   : bg --surface | border 1px --border | text --fg | placeholder --fg-subtle | radius 8px | py 12px px 16px
focused   : border 1.5px --accent | box-shadow 0 0 0 3px rgba(0,200,120,0.12)
error     : border 1.5px --error | box-shadow 0 0 0 3px rgba(239,68,68,0.1)
disabled  : opacity 0.45 | cursor not-allowed
```

### Card

```
static      : bg --surface | border 1px --border | radius 16px | p 24px | shadow: 0 4px 20px rgba(0,0,0,0.4)
interactive : + hover: border --border-accent | shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px --border-accent | translateY -2px | transition 200ms
elevated    : bg --surface-elevated | border 1px --border-strong | radius 16px | shadow: 0 16px 48px rgba(0,0,0,0.7)
feature     : bg --surface | border 1px --border | radius 20px | p 28px | left border 3px --accent visible uniquement au hover (PAS en static — anti-cliche)
```

**IMPORTANT** : Le left-border teal/vert sur TOUTES les cards est un cliche Claude Design. Ici il apparait uniquement au hover:focus de la feature card.

### Nav (sticky top)

```
bg: --bg / 85% opacity + backdrop-blur 20px | border-bottom 1px --border | height 64px
Logo: Space Grotesk 600 18px | couleur --fg
Links: General Sans 500 15px | color --fg-muted | hover: color --fg
CTA: Button primary small (py 10px px 18px)
Mobile: hamburger → drawer full-height --surface-elevated
```

### Modal

```
overlay: bg rgba(0,0,0,0.75) backdrop-blur 8px
panel: bg --surface-elevated | radius 20px | p 32px | border 1px --border-strong
header: h3 + close button (ghost)
```

### Toast

```
success : bg --surface-elevated | border-left 3px --accent | text --fg | icon checkmark --accent
error   : border-left 3px --error
warning : border-left 3px --warning
info    : border-left 3px --info
Position: bottom-right | slide-in-from-right | z-index 9999
```

### Badge / Pill

```
default : bg --surface | border 1px --border | text --fg-muted | radius 100px | px 10px py 4px | caption style
accent  : bg --accent-subtle | text --accent | border 1px rgba(0,200,120,0.2)
pill KPI: bg --accent/10 | text --accent | mono font
```

---

## 5. Layout

- **Grid** : 12 cols desktop / 8 tablet / 4 mobile
- **Container max** : 1280px (lg:max-w-7xl)
- **Gutter** : 32px desktop / 24px tablet / 16px mobile
- **Section padding** : py-32 desktop / py-20 tablet / py-14 mobile
- **Baseline** : 8px
- **Spacing tokens** : 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128 / 160px

**Hero layout** :
```
2-col grid (lg:grid-cols-5)
Left (3/5): headline + subhead + 2 CTAs + social proof badges
Right (2/5): dashboard screenshot with glow frame
Mobile: stack vertical, screenshot under copy
```

**Features layout** :
```
Desktop: grid 3 cols / Tablet: grid 2 cols / Mobile: stack 1 col
Cards uniform height via flex-col + justify-between
```

**Pricing layout** :
```
3 cards horizontal desktop / stack mobile
Middle card (Pro): scale(1.03) + border --accent + badge "Recommande"
```

---

## 6. Depth

```css
/* Shadows — all use rgba(0,0,0,x) pour dark mode natif */
--shadow-xs  : 0 1px 3px rgba(0,0,0,0.4);
--shadow-sm  : 0 2px 8px rgba(0,0,0,0.5);
--shadow-md  : 0 4px 20px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.3);
--shadow-lg  : 0 8px 40px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4);
--shadow-xl  : 0 16px 60px rgba(0,0,0,0.75), 0 4px 16px rgba(0,0,0,0.5);

/* Glow accent (tres parcimonie) */
--glow-accent: 0 0 40px rgba(0,200,120,0.2);
--glow-accent-sm: 0 0 20px rgba(0,200,120,0.15);

/* Border radius */
--radius-xs  : 4px;
--radius-sm  : 8px;
--radius-md  : 12px;
--radius-lg  : 16px;
--radius-xl  : 20px;
--radius-2xl : 28px;
--radius-full: 9999px;
```

**Usage** :
- Inputs: --radius-sm
- Buttons: --radius-md (10px)
- Cards: --radius-lg / --radius-xl
- Screenshots/images: --radius-xl / --radius-2xl
- Pills/badges: --radius-full

---

## 7. Guardrails

### DO
- CSS variables uniquement (zero hex hardcodes dans les composants)
- Contrast minimum 4.5:1 AA — verifier `--fg-muted` sur `--surface` (actuellement ratio ~4.8)
- Mobile-first breakpoints : sm: 640px / md: 768px / lg: 1024px / xl: 1280px
- Semantic HTML : `<nav>`, `<section>`, `<article>`, `<main>`, `<footer>`, `<h1>` unique par page
- ARIA labels sur tous les boutons icon-only
- `focus-visible` anneau visible — jamais supprimer `outline` sans remplacement
- Transitions `will-change: transform` uniquement sur elements qui animent (pas en global)
- KPIs toujours en JetBrains Mono — le cerveau chef reconnait les chiffres plus vite en mono
- Screenshot dashboard : toujours un wrapper avec border + shadow, jamais nu sur fond
- Alt text descriptif sur toutes les images

### ANTI-CLICHES ABSOLUS (basé sur Anthropic cookbook + patterns vus dans food SaaS)

**Interdit** :
- `Glow néon vert partout` — le glow est autorisé UNIQUEMENT au hover des CTAs primaires et dans le hero (1 seule instance). Pas sur les titres, pas sur les cards statiques.
- `Animated status dot "LIVE" "IA active"` — fake urgency. Interdit.
- `Triple padding 24/24/24` — padding triple-nested identique. Utiliser la hierachie.
- `Tiempos/Source Serif + sans-serif generique` — pas de serif edito ici. Nous sommes un SaaS B2B.
- `Left accent bar sur toutes les cards` — le left border vert n'apparait QU'au hover feature card.
- `Three-column feature grid dans le hero` — features section a sa propre section.
- `Lucide icons sans modification` — utiliser les icons avec une couleur intentionnelle (--accent pour la feature icone en hero, --fg-muted pour les icones secondaires). Pas d'icon dans un carre colore generique.
- `"Propulsé par l'IA" / "AI-driven" / "Next-gen"` — copie vague interdite. Exemples concrets uniquement.
- `Gradient holographique violet-rose-bleu` — aucun rapport avec la restauration.
- `Glass-morphism sur TOUT` — le blur est autorise uniquement sur la navbar (sticky) et les modals.
- `Compteur "X clients satisfaits" sans contexte` — toujours associer un KPI a un contexte concret ("150 restaurants ont reduit leur food cost de 7pts en moyenne").
- `Hero image stock de cuisine generique` — utiliser les screenshots reels du dashboard RestauMargin (plus credible).
- `Police Inter/Roboto sans raison` — Space Grotesk + Satoshi + General Sans sont justifies par leur caractere et deja dans le projet.
- `Bouton CTA en `teal-600` par defaut` — remplacer par `--accent` #00C878 pour les CTAs principaux uniquement. Le `teal-600` existant devient la couleur secondaire.
- `Section "Nos partenaires" avec logos en row sans contexte` — les trust badges doivent avoir un titre et une ligne de contexte.

---

## 8. Sections

Guide implementation pour chaque section, dans l'ordre de la landing.

### NAVBAR
```
Position: fixed top-0 z-50
Bg: --bg/85 backdrop-blur-20
Border-bottom: 1px --border
Height: 64px (16px * 4)
Logo: "RestauMargin" Space Grotesk 600 | point vert --accent apres le logo (le ".")
Links: Fonctionnalites / Tarifs / Blog / Se connecter | General Sans 500 | --fg-muted hover --fg
CTA: "Essai 14 jours" btn primary | ml-auto
Mobile: hamburger icon-only ARIA label="Menu" → drawer slide-right
```

### HERO
```
Section: pt-32 pb-20 (resp. pt-24 pb-16 mobile)
Grid: lg:grid-cols-5 gap-16 items-center (3/5 left + 2/5 right)

Eyebrow badge: pill accent "Plateforme #1 des restaurateurs" | Zap icon --accent
H1: 72px Space Grotesk 800 | "Maitriser vos marges." \n "Augmenter vos profits." | "profits" en --accent
Subhead: General Sans 400 20px --fg-muted max-w-lg | phrase concrete avec chiffres
CTAs: [Essai gratuit 14 jours →] primary + [Voir le dashboard] secondary
Social proof: row de 4 KPIs (150+ restaurants / -7pts food cost / 50k pesées/mois / 4.8/5) | JetBrains Mono pour les chiffres

Right: Dashboard screenshot | wrapper: border 1px --border-accent/50 radius-2xl | glow --glow-accent-sm en dessous | label "Nouveau 2026" badge accent top-right
Background: subtle grid radial dots rgba(0,200,120,0.04) | 1 seule sphere glow --accent-glow top-center (width 800px blur 200px) DISCRÈTE
```

### FEATURES
```
Section label: "FONCTIONNALITES" label --accent
H2: "Tout ce dont vous avez besoin. \n Rien de superflu."
Grid: 3 cols desktop / 2 tablet / 1 mobile | 8 feature cards
Card: surface | radius-xl | p-28 | border --border
Icon: Lucide | couleur --fg-muted SAUF feature prioritaire icon --accent | bg --accent-subtle radius-lg p-10 (juste pour les 3 features prioritaires)
Title: Satoshi 600 18px --fg
Desc: General Sans 400 15px --fg-muted line-height 1.65
Hover: border --border-accent | shadow --glow-accent-sm | translateY-2px
```

### LIVE DEMO WIDGET
```
Bg: --bg-subtle
Card centrale: surface-elevated radius-2xl p-32 max-w-2xl mx-auto
Inputs: ingredient / quantite / prix unitaire
Output: food cost % en KPI xl (JetBrains Mono 64px) | couleur verte si <30% / orange 30-35% / rouge >35%
Animation: CSS counter quand valeur change
Label: "Calculez votre food cost en temps reel" — pas "Demo IA"
```

### VOIR EN ACTION
```
2 cols : gauche preview "Commande fournisseur" / droite preview "Facture OCR"
Chaque preview: card surface-elevated avec screenshot + badge label
Transition au hover: scale(1.02) + shadow-xl
```

### HOW IT WORKS (3 etapes)
```
Timeline horizontale desktop / verticale mobile
Step 1: "Scannez" — Camera icon
Step 2: "Analysez" — BarChart3 icon
Step 3: "Decidez" — TrendingUp icon
Connecteur: ligne pointillee --accent/30
Numero etape: JetBrains Mono 600 48px --accent/20
```

### TESTIMONIALS
```
Grid 3 cols / carousel mobile (pas de lib — CSS scroll-snap)
Card: surface | radius-xl | p-24
Quote: General Sans 400 italic 17px --fg-muted
Stars: 5 etoiles --accent (Lucide Star filled)
Name + role: Satoshi 600 / General Sans 400 --fg-muted
Avatar: initiales | bg gradient --accent-subtle to --surface | radius-full 40x40
```

### ROI CALCULATOR
```
Section split : gauche inputs / droite output live
Input CA mensuel: range slider + text input | JetBrains Mono pour la valeur
Output: "Economies annuelles estimees: X €" | kpi-xl --accent | JetBrains Mono
Disclaimer: "--fg-subtle caption" sous le chiffre
Bg: --bg-subtle section
```

### TRUST BADGES
```
Row de 5 badges horizontaux | divises par separateurs verticaux
Badge format: icon + "RGPD" + 1 ligne explication concise
Icons: Shield, Lock, Globe, Headphones, FileCheck | couleur --fg-muted
Pas de logos partenaires flottants sans contexte
```

### PRICING
```
Section: bg --bg-subtle | border-top --border
H2: "Simple. Transparent. Sans surprise."
3 cards: Free / Pro / Business
Pro (middle): scale(1.03) | border 1.5px --accent | badge "Le plus populaire" pill accent | shadow --glow-accent
Prix: kpi-xl JetBrains Mono --fg | "/mois" General Sans --fg-muted
Features list: Check icons --accent | General Sans 400 14px
CTA par plan: primary (Pro + Business) / secondary (Free)
Toggle mensuel/annuel: pill toggle | -20% badge sur annuel
```

### FAQ
```
Accordeon: 1 colonne max-w-3xl mx-auto
Question: Satoshi 600 17px --fg | ChevronDown icon --fg-muted
Reponse: General Sans 400 16px --fg-muted | padding-left 24px
Border: --border entre items | pas de bg card sur chaque item
```

### NEWSLETTER
```
Section compacte: 1 ligne sur desktop | stack mobile
"Recevez nos conseils chaque semaine." + input email + bouton
Pas de faux urgence, pas de "rejoignez 10000 pros"
```

### CONTACT
```
2 cols: formulaire (gauche) + infos contact (droite)
Champs: Nom / Email / Telephone / Message | style input standard
Infos: email + tel + horaires | MapPin pour la ville
```

### FOOTER
```
4 cols: logo + desc / Produit / Ressources / Legal
Copyright + liens RGPD + mention herbergement EU
Bg: --bg | border-top --border
```

### WIDGETS (sticky / popups)
```
Sticky CTA bar: bottom-0 mobile only | bg --surface-elevated | border-top --border
  → "Essai 14 jours — Sans CB" button primary full-width
Newsletter slide-in: delai 45s / exit-intent | position bottom-right | card surface-elevated shadow-xl
Exit-intent popup: overlay dark | card 500px | CTA fort
Scroll progress: bar 3px --accent top-0 fixed (pas de z-50 conflit avec navbar)
Social proof notification: bottom-left | slide-in | "Laurent de Lyon vient de s'inscrire" | delai 8s loop
```

---

## 9. Agent Prompt Guide

### Pour Claude Code (implementation Tailwind/React)

Regles de reference :
1. Utiliser les CSS variables de la section 2 (pas de hex hardcodes)
2. Type scale section 3 pour tous les elements texte
3. Guardrails section 7 — strictement (anti-cliches)
4. Mobile 375px AVANT desktop dans chaque composant
5. Dark mode est le MODE PAR DEFAUT (pas un variant) — pas de `dark:` prefix necessaire sur la landing

Exemples de prompts composant :
```
"Create the PRICING section. 3 cards (Free/Pro/Business).
Pro card: border 1.5px var(--accent), scale(1.03), badge 'Le plus populaire'.
Prices in JetBrains Mono kpi-xl var(--fg). Features list: Check icons var(--accent).
Mobile: stack vertical. Use var(--bg-subtle) section bg.
No teal. No glow on static cards. No left accent bar."

"Create the FEATURES grid. 8 cards. 3-col desktop, 2-col tablet, 1-col mobile.
card: var(--surface) bg, 1px var(--border) border, radius-xl, p-28px.
Icon wrapper: var(--accent-subtle) bg, radius-lg, p-10px — ONLY for the 3 priority features.
Hover: border var(--border-accent), translateY(-2px), transition 200ms.
Text: Satoshi 600 18px var(--fg) title + General Sans 400 15px var(--fg-muted) desc."
```

### Pour claude.ai/design

Format prompt :
```
[GOAL] <deliverable>
[LAYOUT] <arrangement spatial>
[CONTENT] <informations]
[AUDIENCE] Chefs proprietaires + directeurs de salle, France, 30-55 ans, utilisateurs quotidiens
[CONSTRAINTS]
- Apply DESIGN.md attached strictly — Obsidian Kitchen dark theme
- NEVER: teal accent, glow sur elements statiques, left-border card visible en permanence,
  gradient holographique, animated status dots, "AI-powered" copy vague
- KPIs toujours en JetBrains Mono
- Accent --accent #00C878 UNIQUEMENT pour CTAs primaires et KPIs positifs
- bg par defaut : #050505 (dark first)
[VARIANTS] dense (data-heavy) / airy (landing-first) / cinematic (hero focus)
```
