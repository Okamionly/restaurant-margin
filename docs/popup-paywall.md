# RestauMargin -- Popups Conversion & Paywall Upgrade

> SaaS restaurant : Pro 29 EUR/mois | Business 79 EUR/mois

---

## 1. Popups Conversion

### 1.1 Exit Intent Landing -- "-50% sur votre 1er mois"

**Objectif** : Capturer les visiteurs sur le point de quitter la landing page sans inscription.

**Design** :
- Modal centre 500px, fond blanc, overlay sombre 60%
- Icone horloge ou tag promo en haut
- Headline grande (24px bold), sous-titre 16px, un seul champ email
- Bouton CTA pleine largeur vert (#22c55e), texte blanc
- Lien "Non merci" discret en dessous
- Mobile : slide-up depuis le bas, pleine largeur

**Copy** :
- Headline : "Attendez ! -50% sur votre 1er mois"
- Sous-titre : "Testez RestauMargin Pro a seulement 14,50 EUR/mois. Offre valable 24h."
- CTA : "Je profite de -50%"
- Decline : "Non merci, je prefere payer plein tarif"

**Trigger** :
- Desktop : exit intent (curseur vers la barre de navigation/fermeture)
- Mobile : scroll rapide vers le haut ou appui sur le bouton retour
- Conditions : visiteur non inscrit, premiere visite ou +7 jours depuis derniere vue
- Exclusions : pages checkout, page de connexion, utilisateurs deja connectes

**Taux de conversion attendu** : 5-8% (benchmark exit intent SaaS B2B avec reduction)

---

### 1.2 Popup Inscription Newsletter -- "Recevez la mercuriale chaque semaine"

**Objectif** : Collecter des emails qualifies via une offre de contenu a forte valeur pour les restaurateurs.

**Design** :
- Modal centre 450px, fond blanc
- Illustration ou apercu du rapport mercuriale (screenshot flou)
- Un seul champ email, bouton CTA
- Checkbox RGPD sous le champ
- Close button (X) visible en haut a droite
- Mobile : bottom sheet, 60% de la hauteur ecran

**Copy** :
- Headline : "Recevez la mercuriale chaque semaine"
- Sous-titre : "Cours des matieres premieres, alertes prix, tendances du marche -- directement dans votre boite mail."
- CTA : "M'inscrire gratuitement"
- Decline : "Plus tard"

**Trigger** :
- Scroll 50% sur les pages blog ou pages produit
- Apres 2 pages vues dans la meme session
- Conditions : visiteur non inscrit a la newsletter, pas de dismissal dans les 14 derniers jours

**Taux de conversion attendu** : 3-5% (benchmark newsletter B2B avec lead magnet sectoriel)

---

### 1.3 Slide-in apres 30s -- "Besoin d'aide ? Essayez notre IA"

**Objectif** : Engager les visiteurs hesitants et mettre en avant le differenciateur IA de RestauMargin.

**Design** :
- Slide-in coin inferieur droit, 320px de large
- Fond blanc, bordure subtile, ombre portee
- Avatar/icone IA en haut, texte compact
- Bouton CTA + lien dismiss
- Animation : entre par la droite, smooth 300ms
- Mobile : bottom bar pleine largeur, 80px de haut, expandable au tap

**Copy** :
- Headline : "Besoin d'aide pour vos marges ?"
- Sous-titre : "Notre IA analyse vos couts et vous recommande des optimisations en temps reel."
- CTA : "Essayer l'IA gratuitement"
- Decline : "X" (icone close)

**Trigger** :
- 30 secondes apres le chargement de la page
- Conditions : visiteur non inscrit, pas de popup deja affichee dans cette session
- Exclusions : pages ou un autre popup est deja visible, utilisateurs connectes

**Taux de conversion attendu** : 1-3% (benchmark slide-in SaaS, moins intrusif = moins de conversion mais meilleur NPS)

---

## 2. Paywall / Upgrade Screens

### 2.1 Modal Upgrade Business -- Limite atteinte

**Objectif** : Convertir les utilisateurs Pro qui atteignent une limite de leur plan vers Business.

**Trigger** :
- L'utilisateur Pro tente une action bloquee par sa limite de plan :
  - Plus de 1 restaurant (multi-restaurant)
  - Acces a la mercuriale avancee (historique >3 mois, previsions)
  - Commande vocale (feature Business exclusive)
- Apparait immediatement au clic sur la fonctionnalite verrouillee
- Cooldown : maximum 1 affichage par fonctionnalite par session, 3 jours minimum apres dismiss

**Design** :
- Modal centre 650px, fond blanc
- En-tete avec icone verrou + nom de la fonctionnalite
- Tableau comparatif Pro vs Business cote a cote (2 colonnes)
- Colonne Business mise en evidence (bordure coloree, badge "Recommande")
- CTA principal en bas, bouton secondaire "Rester sur Pro"
- Mobile : fullscreen modal avec scroll, tableau empile verticalement

**Tableau comparatif** :

| Fonctionnalite | Pro (29 EUR/mois) | Business (79 EUR/mois) |
|---|---|---|
| Restaurants | 1 | Illimite |
| Fiches techniques | Illimite | Illimite |
| Mercuriale basique | Oui | Oui |
| Mercuriale avancee (previsions, historique complet) | -- | Oui |
| Commande vocale | -- | Oui |
| Support prioritaire | -- | Oui |
| Export comptable avance | -- | Oui |
| API & integrations | -- | Oui |

**Copy** :
- Headline : "Debloquez [nom fonctionnalite] avec Business"
- Sous-titre : "Vous utilisez deja RestauMargin comme un pro. Passez a Business pour aller encore plus loin."
- CTA : "Passer a Business -- 79 EUR/mois"
- Secondary : "Rester sur Pro"
- Social proof : "Rejoint par 150+ restaurants multi-sites"

**Taux de conversion attendu** : 8-12% (benchmark paywall in-app apres usage actif, limite reelle atteinte)

---

### 2.2 Feature Gates -- Details par fonctionnalite

#### 2.2.1 Commande vocale

**Trigger** : L'utilisateur Pro clique sur "Commande vocale" dans le menu ou tente de dicter un inventaire.

**Copy specifique** :
- Headline : "Dictez vos inventaires, les mains libres"
- Sous-titre : "La commande vocale vous fait gagner 45 min par inventaire. Disponible sur Business."
- Benefices : "Dictez les quantites, l'IA transcrit et categorise automatiquement"

**Taux de conversion attendu** : 10-15% (forte valeur percue, gain de temps concret)

#### 2.2.2 Mercuriale avancee

**Trigger** : L'utilisateur Pro tente d'acceder a l'historique des prix au-dela de 3 mois ou aux previsions de prix.

**Copy specifique** :
- Headline : "Anticipez les hausses de prix"
- Sous-titre : "Historique complet + previsions IA des cours. Negociez vos fournisseurs avec des donnees."
- Benefices : "Visualisez 12 mois d'historique, recevez des alertes de hausse, exportez pour negocier"

**Taux de conversion attendu** : 6-10% (valeur strategique mais moins immediate)

#### 2.2.3 Multi-restaurant

**Trigger** : L'utilisateur Pro tente d'ajouter un 2e restaurant.

**Copy specifique** :
- Headline : "Gerez tous vos restaurants au meme endroit"
- Sous-titre : "Dashboard consolide, comparaison des marges entre etablissements, gestion centralisee."
- Benefices : "Vue globale de votre groupe, transferts de fiches, reporting multi-site"

**Taux de conversion attendu** : 15-20% (besoin reel et immediat, l'utilisateur a deja un 2e restaurant)

---

### 2.3 Design du modal -- Specifications

**Layout general** :
- Largeur : 650px desktop, fullscreen mobile
- Padding : 32px
- Border-radius : 12px
- Ombre : 0 20px 60px rgba(0,0,0,0.15)
- Overlay : fond noir 50% opacite
- Animation : fade-in 200ms + scale de 0.95 a 1

**Hierarchie visuelle** :
1. Icone verrou + headline (24px, font-weight 700)
2. Sous-titre explicatif (16px, gris #64748b)
3. Tableau comparatif (bordures subtiles, alternance de fond)
4. Social proof (petit texte, avatar clients)
5. CTA principal (bouton 48px hauteur, vert #22c55e, texte blanc bold)
6. Lien secondaire "Rester sur Pro" (texte gris, discret)

**Accessibilite** :
- Focus trap actif quand le modal est ouvert
- Navigation clavier (Tab, Echap pour fermer)
- Contraste WCAG AA minimum
- aria-modal="true", role="dialog"
- Lecteur d'ecran : announce le titre du modal a l'ouverture

**Fermeture** :
- Bouton X en haut a droite
- Clic sur l'overlay
- Touche Echap
- Lien "Rester sur Pro"

---

## 3. Regles de priorite et conflits

- Maximum 1 popup par session (la premiere qui se declenche gagne)
- Les paywalls in-app (section 2) sont prioritaires sur les popups marketing (section 1)
- Un utilisateur connecte ne voit jamais les popups de la section 1
- Cooldown global : 24h minimum entre deux popups/modals
- Stocker les etats dans localStorage + table user_preferences en base

---

## 4. Metriques a suivre

| Metrique | Popup Exit Intent | Newsletter | Slide-in IA | Paywall Business |
|---|---|---|---|---|
| Impressions | Oui | Oui | Oui | Oui |
| Taux de fermeture | Oui | Oui | Oui | Oui |
| Taux de clic CTA | Oui | Oui | Oui | Oui |
| Taux de conversion | Inscriptions | Inscriptions newsletter | Inscriptions | Upgrades Business |
| Revenu genere | MRR 1er mois | Indirect (nurture) | MRR inscriptions | Delta MRR Pro->Business |

---

## 5. Plan de tests A/B

1. **Exit intent** : Tester -50% vs "1 mois gratuit" vs "Essai 14 jours offert"
2. **Newsletter** : Tester "mercuriale" vs "guide des marges" comme lead magnet
3. **Slide-in** : Tester 30s vs 60s de delai, position droite vs gauche
4. **Paywall** : Tester prix mensuel vs prix annualise, avec vs sans social proof
5. **Feature gate** : Tester apercu flou de la fonctionnalite vs texte descriptif seul
