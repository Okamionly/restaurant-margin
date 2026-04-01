# RestauMargin -- Audit Formulaires & Copy Landing Page

**Date** : 2026-04-01
**Methodologie** : Form CRO (Seven Field Framework) + Copy Editing (Seven Sweeps Framework)

---

## PARTIE 1 : AUDIT FORMULAIRES

---

### 1.1 Formulaire Contact (Landing Page, section #contact)

**Champs actuels** : Nom (requis), Email (requis), Telephone (optionnel), Message (optionnel)
**Bouton** : "Envoyer" + icone Send

| # | Element | Actuel | Recommande | Justification |
|---|---------|--------|------------|---------------|
| 1 | **Nombre de champs** | 4 champs (2 requis, 2 optionnels) | Garder 4 -- bon equilibre | 3-4 champs = baseline optimal. Pas de friction excessive. |
| 2 | **Labels** | Labels visibles au-dessus des champs | OK -- conserver | Les placeholders seuls disparaissent au focus. Les labels visibles sont la bonne pratique. |
| 3 | **Champ Telephone** | Optionnel, pas d'indication | Ajouter "(optionnel)" dans le label | L'utilisateur ne sait pas s'il est requis ou non. Reduire l'hesitation. |
| 4 | **Champ Message** | Optionnel, pas d'indication | Ajouter "(optionnel)" dans le label + changer placeholder en "Ex: Je gere un restaurant de 40 couverts..." | Donner un exemple concret aide a demarrer la saisie et augmente la qualite des leads. |
| 5 | **Bouton CTA** | "Envoyer" | **"Etre recontacte sous 24h"** | "Envoyer" est generique. Le CTA doit exprimer ce que l'utilisateur obtient (reponse sous 24h), pas l'action technique. |
| 6 | **Trust signals** | "Notre equipe vous recontacte sous 24h" au-dessus du form | Ajouter sous le bouton : "Pas de spam. Vos donnees restent confidentielles." | Le "zero risk" (Sweep 7) n'est pas assez adresse pres du CTA. |
| 7 | **Validation inline** | Aucune validation en temps reel | Ajouter validation email inline + indicateur visuel (check vert) | Reduit les erreurs et les soumissions ratees. |
| 8 | **Etat succes** | Message vert "Demande envoyee !" | Ajouter une prochaine etape : "Nous vous appelons dans les prochaines 24h. Verifiez vos spams." | Le succes doit donner une attente claire pour reduire l'anxiete post-soumission. |
| 9 | **Mobile** | Champs en 2 colonnes (sm:grid-cols-2) | OK pour Nom/Email cote a cote, mais verifier que les tap targets font 44px+ | Les inputs font py-2.5 (~40px). Augmenter a py-3 pour atteindre 44px minimum sur mobile. |
| 10 | **Keyboard types** | type="tel" pour telephone, type="email" pour email | OK -- deja en place | Le clavier mobile adapte est deja configure. |

**Priorite haute** : #5 (CTA), #6 (trust signal), #7 (validation inline)
**Priorite moyenne** : #3, #4, #8
**Priorite basse** : #9

---

### 1.2 Formulaire Login / Register

**Login** : Email + Password (2 champs)
**Register** : Name + Email + Password + Role (select) + Code d'activation + CGU checkbox (6 champs)

| # | Element | Actuel | Recommande | Justification |
|---|---------|--------|------------|---------------|
| 1 | **Friction register** | 6 champs dont Role et Code d'activation obligatoires | Masquer le champ Role (pre-selectionner "chef" par defaut) et ne l'afficher que si l'utilisateur a un code admin | Le champ Role cree de la confusion. 95% des utilisateurs seront "chef". Chaque champ supprime = ~5-10% de completions en plus. |
| 2 | **Code d'activation** | Champ texte brut avec hint en dessous | Ajouter un tooltip/info-bulle expliquant ou trouver le code + lien "Pas de code ? Voir les tarifs" | Le principal point de blocage : l'utilisateur ne comprend pas d'ou vient ce code. |
| 3 | **Bouton Login** | `t('login.signIn')` (probablement "Se connecter") | **"Acceder a mon espace"** | Plus engageant, oriente vers le benefice (acces a l'espace de travail). |
| 4 | **Bouton Register** | `t('login.register')` (probablement "Creer un compte") | **"Commencer gratuitement"** ou **"Activer mon compte"** | "Creer un compte" est generique. Le CTA doit exprimer la valeur. |
| 5 | **Password UX** | Input type="password", minLength=6, placeholder "........" | Ajouter un toggle "afficher/masquer" le mot de passe + indicateur de force | Placeholder "........" est inutile. Le toggle reduit les erreurs de saisie sur mobile. |
| 6 | **Forgot password** | Lien discret en petit "text-xs" | OK pour la taille, mais ajouter un texte d'aide apres soumission : "Verifiez vos spams" | Beaucoup d'emails de reset finissent en spam. |
| 7 | **Erreurs** | Affichees en bloc rouge au-dessus du formulaire | Garder le bloc rouge + ajouter highlight rouge sur le champ concerne | L'utilisateur ne sait pas quel champ a cause l'erreur. |
| 8 | **Social proof** | Panneau gauche avec 3 value props + texte social proof | Ajouter un chiffre precis : "Rejoint par 150+ restaurants" au lieu d'un texte generique | Le panneau gauche est bon mais le social proof (`t('login.socialProof')`) pourrait etre plus specifique. |
| 9 | **CGU checkbox** | Label long avec 2 liens | OK -- conforme RGPD | Obligatoire legalement. |
| 10 | **Loading state** | Bouton disabled + texte loading | OK -- deja en place | Bonne pratique respectee. |

**Priorite haute** : #1 (masquer Role), #2 (code activation UX), #5 (password toggle)
**Priorite moyenne** : #3, #4, #7, #8
**Priorite basse** : #6, #9

---

### 1.3 Formulaires In-App (Creation recette, Ajout ingredient)

**Recettes** : ~12 champs (nom, categorie, portions, prix de vente, description, temps prep, temps cuisson, cout main d'oeuvre, ingredients avec quantite/unite/perte)
**Ingredients** : ~6 champs (nom, fournisseur, prix, unite, categorie)

| # | Element | Actuel | Recommande | Justification |
|---|---------|--------|------------|---------------|
| 1 | **Nombre de champs recette** | ~12 champs visibles d'un coup | Passer en formulaire multi-etapes : Etape 1 (nom, categorie, portions, prix) / Etape 2 (ingredients) / Etape 3 (temps, cout MO) | 12 champs d'un coup = mur de formulaire. Le multi-step avec barre de progression augmente la completion de 20-30%. |
| 2 | **Champs optionnels** | Description, temps prep, temps cuisson, cout MO -- pas marques comme optionnels | Ajouter "(optionnel)" sur chaque champ non requis | L'utilisateur ne sait pas ce qu'il peut ignorer et hesite. |
| 3 | **Ingredient autocomplete** | Input "Tapez un nom ou choisissez..." | Ajouter une recherche fuzzy + creation inline "Ajouter [nom] comme nouvel ingredient" | Si l'ingredient n'existe pas, l'utilisateur doit quitter le formulaire recette pour le creer. Casser le flux = abandon. |
| 4 | **Placeholders** | "0.00" pour les prix, textes generiques | Remplacer par des exemples realistes : "12.50" pour un prix de vente, "250" pour une quantite en grammes | Des exemples concrets aident a comprendre le format attendu. |
| 5 | **Save success** | Flash vert temporaire sur le formulaire | Ajouter une confirmation claire + proposition "Creer une autre recette" ou "Voir la fiche" | L'utilisateur doit savoir que c'est sauve et avoir une action suivante claire. |
| 6 | **Keyboard navigation** | handleFormKeyDown present | Verifier que Tab parcourt les champs dans l'ordre logique | Bon signe que c'est deja gere, mais a verifier sur tablette. |
| 7 | **Mobile (Tab A9+)** | Formulaire en colonnes | S'assurer que le formulaire ingredients passe en single-column sur tablette portrait | Sur Tab A9+ en portrait (800px), 2 colonnes d'ingredients peuvent etre trop serrees. |
| 8 | **Ajout fournisseur inline** | 2 modes : creer nouveau ou selectionner existant | OK -- bon pattern | Permet de ne pas quitter le contexte. |

**Priorite haute** : #1 (multi-step recettes), #3 (ingredient inline)
**Priorite moyenne** : #2, #4, #5
**Priorite basse** : #6, #7

---

## PARTIE 2 : AUDIT COPY LANDING PAGE

---

### 2.1 Hero Section

| # | Element | Actuel | Recommande | Justification |
|---|---------|--------|------------|---------------|
| 1 | **Badge** | "PLATEFORME #1 DES RESTAURATEURS" | **"UTILISE PAR 150+ RESTAURANTS EN FRANCE"** | "#1" est une affirmation non prouvee (Sweep 4 : Prove It). Un chiffre concret est plus credible. |
| 2 | **Titre H1** | "Maitrisez vos marges. Augmentez vos profits." | **"Vos plats perdent de l'argent. Decouvrez lesquels."** | L'actuel est correct mais generique. La version recommandee touche un point de douleur precis (Sweep 6 : Heightened Emotion) et cree de la curiosite. Alternative plus conservatrice : "Chaque plat a un cout cache. Calculez-le en temps reel." |
| 3 | **Sous-titre** | "La plateforme tout-en-un pour les restaurateurs qui veulent reprendre le controle de leurs couts matiere, optimiser leur carte et automatiser leurs commandes." | **"Calculez vos marges en temps reel, identifiez vos plats les plus rentables et reduisez vos couts matiere de 8% en moyenne."** | L'actuel est trop long (28 mots) et liste des features. Le recommande repond au "So What" (Sweep 3) avec un chiffre concret (8% = stat du site). |
| 4 | **CTA primaire** | "Voir les tarifs" | **"Essayer RestauMargin"** ou **"Demarrer maintenant -- 29 euros/mois"** | "Voir les tarifs" est passif. L'utilisateur veut agir, pas "voir". Inclure le prix reduit l'anxiete de prix. |
| 5 | **CTA secondaire** | "Voir la demo" | **"Voir RestauMargin en action (2 min)"** | Preciser la duree reduit la friction ("ca ne va pas me prendre longtemps"). |
| 6 | **Texte sous CTA** | "Paiement securise via Stripe" | Ajouter : **"Sans engagement. Annulez en 1 clic."** a cote du badge Stripe | Le paiement securise est bien, mais le risque principal est l'engagement, pas la securite du paiement. |

**Impact estime** : Le hero est la zone la plus vue. Ameliorer le titre + CTA peut augmenter le taux de clic de 15-25%.

---

### 2.2 CTAs (a travers la page)

| # | Emplacement | Actuel | Recommande | Justification |
|---|-------------|--------|------------|---------------|
| 1 | **Navbar** | "Connexion" + "Voir les tarifs" | "Connexion" + **"Commencer"** | "Voir les tarifs" repete le CTA hero. "Commencer" est plus direct. |
| 2 | **Pricing -- Pro** | "Choisir Pro" | **"Demarrer avec Pro -- 29 euros/mois"** | Repeter le prix dans le CTA elimine l'incertitude. |
| 3 | **Pricing -- Business** | "Choisir Business" | **"Passer a Business"** ou **"Contacter notre equipe"** | Pour un plan a 79 euros, un CTA "Contacter" peut convertir mieux car le prospect Business veut parler a un humain. |
| 4 | **Contact form** | "Envoyer" | **"Etre recontacte sous 24h"** | Deja mentionne dans l'audit formulaire. Le CTA doit exprimer le resultat, pas l'action. |
| 5 | **CTA manquant** | Pas de CTA apres la section "How it Works" | Ajouter un bouton **"Commencer en 3 etapes"** apres la section | Chaque section doit avoir une porte de sortie vers la conversion. |
| 6 | **CTA manquant** | Pas de CTA apres les temoignages | Ajouter : **"Rejoignez 150+ restaurants"** avec bouton vers pricing | Les temoignages creent de la confiance ; il faut capitaliser immediatement avec un CTA. |

---

### 2.3 Badges / Social Proof

| # | Element | Actuel | Recommande | Justification |
|---|---------|--------|------------|---------------|
| 1 | **Trusted By** | Logos textuels : METRO, Transgourmet, Pomona, Sysco, Brake | Preciser la relation : "Compatible avec vos fournisseurs" au lieu de "Ils nous font confiance" | Ces marques sont des fournisseurs, pas des clients. "Ils nous font confiance" est trompeur. Le visiteur pense que ces entreprises utilisent RestauMargin. |
| 2 | **Stats bar** | 150+ restaurants, 8% economise, 50k pesees/mois, 4.8/5 satisfaction | Ajouter "en moyenne" apres "8% cout matiere economise" + source de la note 4.8/5 | Les chiffres sont bons mais manquent de contexte (Sweep 4 : Prove It). "8% economise" est-ce prouve ? 4.8/5 sur quelle plateforme ? |
| 3 | **Temoignages** | 3 temoignages avec nom, role, lieu, note etoiles | Ajouter des photos (meme generees IA) + un resultat chiffre dans chaque temoignage | Les temoignages actuels sont bons mais generiques. "Laurent Dubois" dit "+4 points de marge en 3 mois" -- c'est excellent. Les autres devraient aussi avoir un chiffre. |
| 4 | **Rating 4 etoiles** | Karim Benali a 4/5 | Remplacer par un temoignage 5/5 ou retirer les etoiles | Un temoignage a 4/5 sur la landing page seme le doute. |
| 5 | **Logos absents** | Pas de badges de confiance (RGPD, SSL, Stripe) dans le hero | Ajouter une ligne de badges sous les CTAs : "RGPD | SSL | Stripe | Donnees EU" | Les badges de confiance dans le hero augmentent la conversion de 5-15%. Le footer a "Donnees EU" et "SSL" mais c'est trop loin. |
| 6 | **Manquant : compteur temps reel** | Rien | Ajouter "12 restaurants inscrits ce mois-ci" ou "Derniere inscription : il y a 2h" | Cree de l'urgence sociale (FOMO). Facile a implementer avec les donnees existantes. |

---

### 2.4 FAQ

| # | Question | Analyse de la reponse | Recommandation |
|---|----------|----------------------|----------------|
| 1 | "Comment fonctionne l'abonnement ?" | Bonne reponse, claire et complete. Mentionne "sans engagement" et "annulez a tout moment". | Ajouter : **"Pas de frais caches. Le prix affiche est le prix final."** Adresser l'objection du cout cache. |
| 2 | "Comment recevoir mon code d'activation ?" | Explique le processus. | Ajouter : **"En cas de probleme, notre equipe vous aide sous 24h a contact@restaumargin.fr."** Reduire l'anxiete "et si ca ne marche pas". |
| 3 | "Puis-je changer de plan ?" | Bonne reponse avec prorata automatique. | OK -- rien a changer. |
| 4 | "Puis-je utiliser une balance connectee ?" | Mentionne le Bluetooth. | Ajouter : **"Compatible avec la plupart des balances Bluetooth du marche (Ohaus, CAS, etc.)."** Nommer des marques rend concret. |
| 5 | "Mes donnees sont-elles securisees ?" | Mentionne Supabase, SSL/TLS, RGPD. | Bonne reponse. Ajouter eventuellement : **"Vos donnees ne sont jamais utilisees pour entrainer des modeles IA."** Adresser une inquietude croissante en 2026. |
| 6 | **FAQ manquante** | -- | Ajouter : **"Puis-je essayer avant de payer ?"** Reponse : "Contactez-nous pour une demo personnalisee gratuite de 15 minutes." C'est l'objection #1 non adressee. |
| 7 | **FAQ manquante** | -- | Ajouter : **"Est-ce que ca marche pour un food truck / petit restaurant ?"** Reponse : "Oui, notre plan Pro a 29 euros est concu pour les independants." Elargir la cible percue. |
| 8 | **FAQ manquante** | -- | Ajouter : **"Combien de temps pour configurer RestauMargin ?"** Reponse : "2 minutes pour creer votre compte, 15 minutes pour ajouter vos premieres recettes." Reduire la friction percue du setup. |

---

## RESUME DES ACTIONS PRIORITAIRES

### Haute priorite (impact fort, effort faible)
1. **Hero : retravailler le badge** -- remplacer "#1" par un chiffre verifiable
2. **Hero : CTA primaire** -- remplacer "Voir les tarifs" par un CTA oriente action
3. **Contact form : CTA** -- remplacer "Envoyer" par "Etre recontacte sous 24h"
4. **Login register : masquer le champ Role** -- pre-selectionner "chef"
5. **Ajouter CTAs apres "How it Works" et "Temoignages"** -- sections sans porte de sortie
6. **Corriger "Ils nous font confiance"** -- ce sont des fournisseurs compatibles, pas des clients

### Moyenne priorite (impact moyen, effort moyen)
7. **Hero : sous-titre** -- raccourcir et ajouter un chiffre benefice
8. **Register : UX code activation** -- tooltip + lien "Pas de code ?"
9. **Password toggle** -- afficher/masquer le mot de passe
10. **FAQ : ajouter 3 questions manquantes** (essai, petit restaurant, temps setup)
11. **Contact form : validation inline** sur email
12. **Temoignages : remplacer le 4/5** par un 5/5

### Basse priorite (nice-to-have)
13. **Badges de confiance dans le hero** (RGPD, SSL, Stripe)
14. **Formulaire recette multi-step** (refactoring important)
15. **Compteur social en temps reel** ("12 inscrits ce mois")
16. **Mobile : augmenter tap targets a 44px+**
