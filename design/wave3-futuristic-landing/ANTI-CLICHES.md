# ANTI-CLICHES — RestauMargin Wave 3
# Ce qu'on evite et pourquoi — reference concrete

---

## 1. Le glow neon vert partout

**Le cliche** : chaque titre, chaque card, chaque icone a un `text-shadow` ou `box-shadow` vert qui pulse.
Resultat : ressemble a un site gaming 2018 ou a un screensaver Matrix.

**Notre regle** :
- Glow autorise : 1 seule instance dans le hero (sphere de fond, tres discrète, 200px blur, opacity 15%)
- Glow au hover : CTAs primaires uniquement (`box-shadow: 0 0 20px rgba(0,200,120,0.25)`)
- Partout ailleurs : zero glow

**References qui le font bien** : RunwayML — une seule traîne de lumière dans le hero, nulle part ailleurs. Ferrari Configurator — aucun glow, toute la force vient du contraste.

---

## 2. "Propulse par l'IA" / "AI-driven" / "Next-generation"

**Le cliche** : chaque feature badge dit "Powered by AI", "Smart AI", "AI-driven insights".
Resultat : le mot "IA" est vide de sens en 2026. Personne ne le lit.

**Notre regle** : zero mention generique de l'IA dans les titres. Toujours concret :
- Interdit : "Intelligence artificielle pour votre restaurant"
- Autorise : "Creez une fiche technique en 10 secondes par commande vocale"
- Interdit : "Analyse IA de vos marges"
- Autorise : "Food cost calcule au centime pres, automatiquement"

**References qui l'evitent** : Linear, Vercel — ils ont de l'IA partout dans leur produit mais ne le crient pas sur leur landing.

---

## 3. Le gradient holographique purple-rose-teal

**Le cliche** : hero background avec `linear-gradient(135deg, #7C3AED, #EC4899, #06B6D4)` — le cocktail "startup IA generique 2024".
Resultat : visuellement beau mais semantiquement nul. Aucun lien avec la restauration.

**Notre regle** : zero gradient chroma non justifie. Seul gradient autorise sur la landing :
- `linear-gradient(135deg, #00C878, #00A862)` — CTA primaire
- `linear-gradient(180deg, #050505, #0A0F0D)` — transition entre sections si besoin

---

## 4. Le left-accent-bar sur toutes les cards

**Le cliche** : chaque card a un `border-left: 4px solid #00C878` permanent.
Resultat : signal d'accessibilite perdu (le border left est un pattern UI pour "actif" ou "selectionne"), repetition visuelle qui tue le contraste.

**Notre regle** : left border vert uniquement au hover des feature cards. Jamais en static.

---

## 5. Le "trio d'icones generiques dans un carré coloré"

**Le cliche** : icone Lucide par defaut dans un carré vert/teal avec radius-lg. Copier-colle x8 pour les features.
Resultat : aucune personnalite, le cerveau les scanne et les ignore.

**Notre regle** :
- 3 features prioritaires : icone dans `--accent-subtle` bg (pas carré — circle ou hexagone ou juste l'icone)
- 5 autres features : icone seule, couleur `--fg-muted`, taille 24px. Pas de wrapper bg.
- La hierarchie visuelle entre features importantes et secondaires est intentionnelle.

---

## 6. Le glass-morphism sur tout

**Le cliche** : chaque card, chaque nav, chaque modal en `backdrop-filter: blur(20px) saturate(200%) rgba(255,255,255,0.1)`.
Resultat : sur dark bg, illisible sur 30% des ecrans. Trop lourd a renderer sur tablette en cuisine.

**Notre regle** :
- Backdrop-blur : navbar sticky uniquement (UX justifiee — contenu scroll dessous)
- Modals / drawers : `bg: --surface-elevated` opaque, pas de glass
- Cards : zero glass — fond opaque `--surface`

---

## 7. Le compteur social proof decontextualise

**Le cliche** : "10 000+ restaurants nous font confiance" en grand dans le hero.
Problème : pour une startup avec 150 clients, c'est non credible. Et meme avec 10 000, le chiffre seul ne dit rien.

**Notre regle** : chaque KPI de social proof est accompagne de contexte :
- Interdit : "150+ restaurants"
- Autorise : "150 restaurants | -7 pts food cost en moyenne"
- Interdit : "4.8/5"
- Autorise : "4.8/5 satisfaction | 96% renouvellent"

---

## 8. L'image stock de cuisine

**Le cliche** : photo Unsplash d'un chef qui sourit dans une cuisine parfaite, lumiere naturelle parfaite.
Resultat : personne ne croit ces photos. Chaque competitor food SaaS les utilise.

**Notre regle** : screenshots reels du dashboard RestauMargin uniquement pour le hero. 
- Les photos de cuisine vont dans les testimonials (photos des chefs reels si possible)
- Jamais de stock photo generique en hero

---

## 9. L'animation "typing" sur le titre hero

**Le cliche** : le H1 s'ecrit lettre par lettre : "Maitrisez vos marges|_"
Resultat : ralentit la lecture. Techniquement fragile (JS). Reduit le SEO si mal implemente.

**Notre regle** : animations d'entree uniquement via `opacity + translateY` CSS. Rapides (600ms). Pas de typing effect, pas de morphing text.

---

## 10. Les "temoignages" sans photo, sans nom de restaurant, sans chiffre

**Le cliche** : "Super outil, je le recommande !" — Jean-Pierre B., Restaurateur
Resultat : zero credibilite.

**Notre regle** : chaque testimonial doit avoir :
- Prenom + Nom complet
- Role precis (Chef proprietaire / Directeur / Gerant)
- Nom du restaurant + ville
- 1 chiffre concret dans la quote
- Avatar : initiales si pas de photo reelle

---

## 11. La section pricing avec "le plus populaire" sur le plan le plus cher

**Le cliche** : badge "Most Popular" sur le plan Business a 149€/mois alors que 90% des users prennent le Pro.
Resultat : manipulateur, detecte comme tel par les utilisateurs avertis.

**Notre regle** : "Le plus populaire" sur le Pro (49€/mois) — c'est vrai et c'est le bon plan pour la majorite des restaurants independants. Business vise les chaines / multi-sites.

---

## 12. Le footer avec 4 colonnes de liens vides

**Le cliche** : Footer avec 40 liens dont 30 menent a des pages "coming soon" ou inexistantes.
Resultat : negatif pour le SEO, negatif pour la confiance.

**Notre regle** : footer uniquement avec liens qui existent. Si une section n'existe pas, elle n'est pas dans le footer.

---

## References que nous etudions (SaaS B2B qui sortent du lot)

| Site | Ce qu'on copie | Ce qu'on adapte |
|------|----------------|-----------------|
| **ClickHouse.com** | Data density, typo bold sans glow, KPIs bruts | Leur jaune devient notre vert |
| **Linear.app** | Precision du copy, hierarchie typo, zero superflu | Leur light devient notre dark |
| **Vercel.com** | Screenshots produit traites avec soin, testimonials chiffres | Leur B&W devient dark green |
| **Resend.com** | Bento grid features, ton direct, social proof credible | Adapte au contexte food |
| **Trigger.dev** | Hero dark, KPIs hero, terminal-core energy | Plus chaud pour food |
| **Raycast.com** | Screenshot hero sombre + glow tres discret | Glow encore plus discret |

Ce qu'on ne copie PAS :
- **Webflow** : trop builder/generic
- **Framer** : trop portfolio/agency
- **HubSpot** : trop corporate/light
- Tout site food SaaS FR concurrent (Skello, Inpulse, Lightspeed FR) — ils sont tous en light mode teal
