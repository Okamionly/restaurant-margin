# CLAUDE_DESIGN_PROMPT — RestauMargin Wave 3
# Coller dans claude.ai/design apres avoir uploade DESIGN.md

---

## Step 1 — Upload

Attache le fichier : `DESIGN.md` (meme dossier que ce fichier)

---

## Step 2 — Coller ce prompt exact dans claude.ai/design

---

```
[GOAL]
Landing page publique complete pour RestauMargin (SaaS B2B food — calcul de marges restaurant).
Deliverable : landing page full scroll, 21 sections, production-ready en Tailwind CSS + React TSX.
Le design suit strictement le DESIGN.md attache (Obsidian Kitchen — Cinematic Dark).

[LAYOUT]
Page single-scroll verticale.
Sections dans cet ordre exact :
1. NAVBAR — fixed sticky, logo "RestauMargin." (le point en vert #00C878) + 4 liens + CTA "Essai 14 jours"
2. HERO — 2-col grid (3/5 copy + 2/5 dashboard screenshot mockup). Fond quasi-noir #050505 avec 1 seule sphere glow vert discrète.
3. FEATURES — grid 3 cols (8 cards). 3 prioritaires avec icon wrapper vert, 5 standards sans wrapper.
4. LIVE DEMO WIDGET — calcul food cost en temps reel. Input ingredient + quantite + prix = output % food cost en grand chiffre vert.
5. VOIR EN ACTION — 2 previews cote a cote : "Commande fournisseur" + "Facture OCR".
6. HOW IT WORKS — 3 etapes horizontales (Scan / Analyse / Decide) avec timeline pointillee verte.
7. TESTIMONIALS — 3 cards (Laurent / Sophie / Karim) avec quote + chiffre concret + initiales avatar.
8. VIDEO TUTORIALS — section avec 3 thumbnails de tutoriels animes.
9. ROI CALCULATOR — slider CA mensuel → output economies annuelles en euros.
10. TRUST BADGES — row 5 badges : RGPD / SSL / Hebergement EU / Support 7j7 / Sans engagement.
11. PRICING — 3 plans (Decouverte €0 / Pro €49 / Business €149). Pro featured (scale 1.03 + border vert).
12. FAQ — accordeon 8 questions (voir contenu ci-dessous).
13. NEWSLETTER — form email simple 1 ligne.
14. CONTACT — form + email + tel.
15. FOOTER — 4 cols + copyright + status vert.
+ Widgets : sticky CTA bar mobile-only, newsletter slide-in (45s delay), exit-intent popup, scroll progress bar (3px top vert), social proof notification (bottom-left).

[CONTENT]

--- HERO ---
Eyebrow badge : "Plateforme #1 des restaurateurs"
H1 : "Maitrisez vos marges.\nAugmentez vos profits." (profits en vert #00C878)
Subhead : "La plateforme tout-en-un pour reprendre le controle de vos couts matiere, calculer vos fiches techniques en secondes et automatiser vos commandes fournisseurs."
CTA 1 : "Essai gratuit 14 jours →" (vert, primaire)
CTA 2 : "Voir le dashboard" (secondaire, transparent)
Micro : "Pas de carte bancaire requise · Annulation a tout moment"
KPIs : 150+ restaurants / -7pts food cost en moy. / 50k pesees/mois / 4.8/5 satisfaction

--- FEATURES (8 items) ---
Prioritaires (3) :
- "Commandes fournisseurs en 1 clic" — Envoyez vos commandes par email ou WhatsApp directement depuis l'appli.
- "Creez des recettes en 10 secondes" — Dictez vos ingredients a voix ou par chat. Food cost, allergenes, marge calculees en temps reel.
- "Fiches techniques instantanees" — Marges, coefficients, allergenes calcules automatiquement.

Standards (5) :
- "Optimisez votre carte" — Identifiez les plats qui plombent vos marges.
- "Mercuriale — Alertes prix fournisseurs" — Suivi automatique, alerte quand une hausse impacte vos marges.
- "Balance Bluetooth en cuisine" — Pesez vos ingredients en direct au gramme pres.
- "HACCP digital — Zero papier" — Temperatures, nettoyage, tracabilite numerique et conforme.
- "OCR — Scannez vos factures" — Photo d'une facture → extraction automatique des prix.

--- TESTIMONIALS ---
1. Laurent Dubois / Chef proprietaire / Le Jardin des Saveurs / Lyon / 5 etoiles
   "+4 points de marge en 3 mois. Les fiches techniques automatiques nous ont tout change."

2. Sophie Martin / Directrice / Brasserie Le Comptoir / Paris / 5 etoiles
   "Food cost de 34% a 27% en 2 mois. L'IA qui cree les fiches en 10 secondes, c'est un game changer."

3. Karim Benali / Gerant / Street Flavors / Bordeaux / 5 etoiles
   "Chaque centime compte en food truck. Les alertes prix m'ont fait economiser 800 euros le premier mois."

--- FAQ (8 questions) ---
1. "Est-ce complique a prendre en main ?" → Non, interface pensee pour les restaurateurs. Premiere fiche en < 5 min.
2. "Combien ca coute ?" → Pro 49€/mois, Business 149€/mois. Essai 14j sans CB, annulation a tout moment.
3. "Mes donnees sont-elles securisees ?" → Hebergement Europe, chiffrement SSL/TLS + au repos, RGPD, donnees non revendues.
4. "Comment fonctionne l'abonnement ?" → Mensuel sans engagement. Paiement CB, code d'activation instantane.
5. "Ca marche pour mon type de restaurant ?" → Oui : gastronomique, brasserie, food truck, pizzeria, traiteur, dark kitchen.
6. "Puis-je utiliser une balance connectee ?" → Oui, compatible toute balance Bluetooth.
7. "Y a-t-il une application mobile ?" → Oui, PWA installable sur iOS et Android depuis le navigateur.
8. "Puis-je importer mes donnees existantes ?" → Oui, import CSV pour les recettes et les fournisseurs.

--- PRICING ---
Decouverte : €0/mois | 5 fiches techniques / Calcul food cost / Dashboard basique / [pas] Commandes fournisseurs / [pas] OCR / [pas] Balance BT
Pro (featured) : €49/mois | Fiches illimitees / IA recettes chat + vocal / Commandes email+WhatsApp / OCR factures / Mercuriale + alertes / Balance BT / HACCP / Support 7j/7
Business : €149/mois | Tout Pro + 10 etablissements / Utilisateurs illimites / Reporting multi-sites / Integrations ERP+caisse / Gestionnaire dedie

[AUDIENCE]
Chefs proprietaires, directeurs de salle, managers de restaurant, France.
Age 30-55 ans. Utilisent l'outil en cuisine (tablette, fond sombre confortable) ou au bureau apres le service.
Veulent des chiffres clairs et des actions directes — pas du marketing vague.
Sensibles au ROI concret (€ economises) plus qu'aux features techniques.

[CONSTRAINTS]
DESIGN SYSTEM — appliquer DESIGN.md attache strictement :
- Background par defaut : #050505 (near-black, pas pure black)
- Accent UNIQUE : #00C878 (vert emeraude). NE PAS utiliser teal-600.
- Foreground principal : #F5F2EC (blanc chaud)
- Foreground muted : #7A8C85
- Surface cards : #0F1612
- Border : #1A2E26
- Font display : Space Grotesk 700-800 (Google Fonts)
- Font body : General Sans 400-500 (deja charge dans le projet, fallback Space Grotesk)
- Font KPIs/chiffres : JetBrains Mono 600 (Google Fonts) — TOUS les pourcentages, prix, KPIs

TAILWIND — conventions strictes :
- Tailwind CSS uniquement (pas d'inline styles sauf valeurs dynamiques JS)
- Utiliser les valeurs exactes avec [] quand Tailwind n'a pas le token exact : bg-[#050505], text-[#00C878], etc.
- Zero shadcn, zero MUI, zero Chakra, zero librairies UI externes
- Icones : lucide-react uniquement
- Pas de libs d'animation (Framer Motion, GSAP) — CSS transitions Tailwind uniquement

ANTI-CLICHES ABSOLUS :
- JAMAIS glow neon permanent sur elements statiques — seulement au hover des CTAs primaires
- JAMAIS animated status dot "LIVE" ou "IA active"
- JAMAIS gradient holographique purple/rose/blue (aucun lien avec restauration)
- JAMAIS triple padding identique 24/24/24 (utiliser hierarchie espacements)
- JAMAIS left-border vert permanent sur toutes les cards (seulement au hover)
- JAMAIS "AI-driven", "Next-generation", "Propulse par l'IA" — toujours copy concrete avec chiffres
- JAMAIS Inter/Roboto/Arial comme font principale — Space Grotesk + General Sans justifies
- JAMAIS glass-morphism sur les cards normales — backdrop-blur uniquement sur navbar
- JAMAIS images stock cuisine generiques en hero — dashboard mockup CSS uniquement
- JAMAIS "10 000+ clients" si non verifie — utiliser "150+" (chiffre reel)
- JAMAIS prix dans pricing sans contexte (toujours un descriptif de la cible sous le prix)

CODE QUALITY :
- TypeScript strict, pas de any
- Imports absolus avec @/ alias
- Export default pour le composant principal
- Composants sous-sectionnes (HeroSection, FeaturesSection, PricingSection, etc.)
- Accessible : semantic HTML, aria-labels sur boutons icon-only, focus-visible visible
- Mobile-first : chaque composant commence par styles mobile, puis lg: breakpoint
- Dark mode est le MODE PAR DEFAUT — pas de classe dark: necessaire

[VARIANTS]
Produire 3 layouts du HERO uniquement pour comparaison :
A. Dense — dashboard mockup grand format, KPIs en dessous, copy concis
B. Airy — plus d'espace blanc (mais toujours dark), copy plus long, moins de KPIs
C. Cinematic — texte hero centré, dashboard en arriere-plan avec parallax (CSS), CTA centré

Pour les autres sections : 1 seule version, la plus adaptee a l'audience B2B food.
```

---

## Step 3 — Iterer en eco (apres la premiere generation)

- **Tweaks panel** : reordonner / swapper les sections (gratuit)
- **Inline comments** : clique sur un element → edite la prop CSS ou le texte (cheap)
- **Chat** : reserver aux pivots majeurs seulement (3x plus couteux en tokens vision)

Exemples de tweaks inline :
- "Rend le hero plus compact, reduis le padding vertical de 30%"
- "La card Pro pricing : augmente le contraste du badge"
- "Section Features : rend les 3 prioritaires visuellement plus distinctes des 5 standards"
- "Section Testimonials : ajoute une 4eme card (meme format que les 3 existants)"

## Step 4 — Export

- HTML statique pour integration dans le projet React
- Ou directement le code TSX composant par composant

## Budget warning

Ce prompt est calibre pour un seul shot complet. Il consomme environ 35-50% du quota hebdomadaire Pro claude.ai/design. Preparer le prompt soigneusement avant de lancer. Une fois lance, privilegier Tweaks + inline comments pour les iterations.

---

## Chemins des fichiers de reference

- DESIGN.md : `C:/Users/mrgue/CLAUDE CODE/restaurant-margin/design/wave3-futuristic-landing/DESIGN.md`
- VARIANTS.md : `C:/Users/mrgue/CLAUDE CODE/restaurant-margin/design/wave3-futuristic-landing/VARIANTS.md`
- ANTI-CLICHES.md : `C:/Users/mrgue/CLAUDE CODE/restaurant-margin/design/wave3-futuristic-landing/ANTI-CLICHES.md`
- Preview HTML : `C:/Users/mrgue/CLAUDE CODE/restaurant-margin/design/wave3-futuristic-landing/preview-hero.html`
