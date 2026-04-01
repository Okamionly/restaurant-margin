# Guide UX Copy & Microcopy -- RestauMargin

> Cible : restaurateurs independants (chefs, gerants, directeurs).
> Ton : direct, professionnel, vouvoiement. Zero jargon tech.
> Derniere analyse : 2026-04-01

---

## Table des matieres

1. [Problemes critiques](#1-problemes-critiques)
2. [Messages d'erreur](#2-messages-derreur)
3. [Etats vides](#3-etats-vides)
4. [CTAs (Boutons d'action)](#4-ctas-boutons-daction)
5. [Toasts & Confirmations](#5-toasts--confirmations)
6. [Placeholders](#6-placeholders)
7. [Titres de page](#7-titres-de-page)
8. [Labels de formulaire](#8-labels-de-formulaire)
9. [Messages de chargement](#9-messages-de-chargement)
10. [Assistant IA](#10-assistant-ia)
11. [Landing page](#11-landing-page)
12. [Regles generales](#12-regles-generales)

---

## 1. Problemes critiques

### 1.1 Page Login : aucune traduction

**Constat** : La page `Login.tsx` utilise `t('login.title')`, `t('login.email')`, etc. mais la section `login` n'existe pas dans `fr.json`. Le hook `useTranslation` retourne la cle brute (ex: "login.connectionError") a l'ecran.

**Impact** : L'utilisateur voit des cles techniques au lieu de vrais messages.

**Action requise** : Ajouter toute la section `login` dans `fr.json` (et les autres locales).

Propositions de valeurs pour les cles login :

| Cle | Valeur proposee |
|-----|----------------|
| `login.title` | Connexion a votre espace |
| `login.createAccount` | Creer votre compte |
| `login.tagline` | La plateforme qui transforme vos marges en profits |
| `login.email` | Adresse email |
| `login.password` | Mot de passe |
| `login.name` | Votre nom complet |
| `login.yourName` | Ex : Jean Dupont |
| `login.role` | Votre role |
| `login.roleChef` | Chef de cuisine |
| `login.roleAdmin` | Administrateur |
| `login.activationCode` | Code d'activation |
| `login.activationHint` | Vous avez recu ce code par email apres votre paiement |
| `login.signIn` | Se connecter |
| `login.register` | Creer mon compte |
| `login.forgotPassword` | Mot de passe oublie |
| `login.forgotPasswordLink` | Mot de passe oublie ? |
| `login.sendResetLink` | Recevoir le lien de reinitialisation |
| `login.backToLogin` | Retour a la connexion |
| `login.alreadyHaveAccount` | Vous avez deja un compte ? Connectez-vous |
| `login.noAccount` | Pas encore de compte ? Inscrivez-vous |
| `login.firstUserMessage` | Bienvenue ! Vous etes le premier utilisateur. Creez votre compte administrateur. |
| `login.emailVerified` | Votre email est verifie. Vous pouvez vous connecter. |
| `login.invalidToken` | Ce lien de verification est invalide ou a expire. |
| `login.verificationError` | Impossible de verifier votre email. Reessayez plus tard. |
| `login.mustAcceptCgu` | Veuillez accepter les conditions generales pour continuer. |
| `login.connectionError` | Identifiants incorrects. Verifiez votre email et mot de passe. |
| `login.requestError` | Une erreur est survenue. Veuillez reessayer. |
| `login.resetEmailSent` | Un email de reinitialisation vous a ete envoye. Verifiez votre boite de reception. |
| `login.acceptCgu1` | J'accepte les |
| `login.cguLink` | Conditions Generales d'Utilisation |
| `login.acceptCgu2` | et la |
| `login.privacyLink` | Politique de confidentialite |
| `login.cgu` | CGU |
| `login.privacy` | Confidentialite |
| `login.legalNotice` | Mentions legales |
| `login.feature1Title` | Marges en temps reel |
| `login.feature1Desc` | Suivez vos couts et marges sur chaque plat |
| `login.feature2Title` | Donnees securisees |
| `login.feature2Desc` | Hebergement europeen, chiffrement, conformite RGPD |
| `login.feature3Title` | Assistant IA integre |
| `login.feature3Desc` | Analyse et recommandations pour optimiser votre carte |
| `login.socialProof` | Deja plus de 150 restaurants equipes en France |
| `common.loading` | Chargement en cours... |

### 1.2 Page AIAssistant : strings en dur, pas de i18n

**Constat** : `AIAssistant.tsx` n'utilise pas `useTranslation()`. Toutes les chaines sont codees en dur, en francais sans accents.

**Exemples** :
- `"Cree-moi une fiche technique"` (manque l'accent : "Creez-moi")
- `"Fiche technique creee"` (manque les accents : "Fiche technique creee" -> "Fiche technique creee")
- `"Desole, une erreur s'est produite."` (accent manquant)
- `"Analyse en cours..."` (chaine en dur)

**Action requise** : Migrer vers `t()` et ajouter une section `aiAssistant` dans `fr.json`.

---

## 2. Messages d'erreur

### 2.1 Erreurs generiques et techniques

| Fichier | Actuel | Probleme | Proposition |
|---------|--------|----------|-------------|
| `Landing.tsx` | `"Erreur lors de l'envoi"` | Generique, pas de solution | "Votre message n'a pas pu etre envoye. Verifiez votre connexion et reessayez." |
| `AIAssistant.tsx` | `"Erreur ${res.status}"` | Code HTTP affiche a l'utilisateur | "L'assistant n'est pas disponible pour le moment. Reessayez dans quelques instants." |
| `AIAssistant.tsx` | `"Desole, une erreur s'est produite. Veuillez reessayer."` | Correct mais ameliorable | "Je n'ai pas pu traiter votre demande. Reformulez ou reessayez dans un instant." |
| `Login.tsx` | `t('login.connectionError')` (affiche la cle) | Aucune traduction | "Identifiants incorrects. Verifiez votre email et mot de passe." |
| `Login.tsx` | `t('login.requestError')` (affiche la cle) | Aucune traduction | "Une erreur est survenue. Veuillez reessayer." |
| `Recipes.tsx` | `"Aucune suggestion trouvee pour cette recette"` | String en dur | Migrer vers i18n : "L'IA n'a pas trouve de suggestions pour ce plat. Essayez un autre nom." |
| `Recipes.tsx` | `"Erreur lors de la suggestion IA"` | String en dur, pas de solution | "Impossible de generer les suggestions. Verifiez votre connexion." |
| `Dashboard.tsx` | `console.error('Erreur chargement')` | Erreur silencieuse, aucun feedback utilisateur | Afficher un toast : "Impossible de charger vos donnees. Actualisez la page." |

### 2.2 Regles pour les messages d'erreur

1. **Dire ce qui s'est passe** (pas de jargon : pas de "404", "500", "timeout")
2. **Proposer une action** ("Reessayez", "Verifiez votre connexion", "Contactez-nous")
3. **Etre specifique** ("Votre recette n'a pas ete sauvegardee" > "Erreur")
4. **Garder un ton calme** (pas de "ERREUR !", pas de ponctuation excessive)

---

## 3. Etats vides

### 3.1 Analyse par page

| Page | Actuel | Probleme | Proposition |
|------|--------|----------|-------------|
| `Dashboard.tsx` | Titre : "Bienvenue sur RestauMargin" + "Commencez par ajouter des ingredients puis creez vos fiches techniques." | Correct mais peut motiver davantage | Titre : "Votre tableau de bord est pret !" + "Ajoutez vos premiers ingredients pour voir apparaitre vos marges en temps reel." |
| `Recipes.tsx` | `"Aucune recette. Creez-en une !"` | Trop bref, pas motivant | "Vous n'avez pas encore de fiche technique. Creez votre premiere recette pour calculer automatiquement vos marges." |
| `Recipes.tsx` | `"Aucun resultat."` (recherche) | Trop sec | "Aucune recette ne correspond a votre recherche. Essayez un autre mot-cle." |
| `Recipes.tsx` | `"Aucun ingredient ajoute"` (dans formulaire) | Manque d'orientation | "Ajoutez au moins un ingredient pour calculer le cout de votre recette." |
| `AIAssistant.tsx` | Message de bienvenue correct | Bon | - |

### 3.2 Regles pour les etats vides

1. **Expliquer pourquoi c'est vide** ("Vous n'avez pas encore de...")
2. **Indiquer le benefice de l'action** ("...pour calculer vos marges")
3. **Proposer un CTA clair** (bouton d'action visible)
4. **Utiliser une illustration** (icone ou image, deja fait avec ChefHat)

---

## 4. CTAs (Boutons d'action)

### 4.1 Analyse

| Page | Actuel | Probleme | Proposition |
|------|--------|----------|-------------|
| `Landing.tsx` | "Voir les tarifs" | Passif. L'utilisateur ne sait pas ce qui se passe apres. | "Decouvrir nos offres" ou "Choisir mon abonnement" |
| `Landing.tsx` | "Voir la demo" | Bon, mais peut etre plus engageant | "Essayer gratuitement" ou "Voir RestauMargin en action" |
| `Landing.tsx` | "Connexion" (navbar) | Correct | - |
| `Login.tsx` | `t('login.signIn')` (affiche la cle) | Traduction manquante | "Se connecter" |
| `Login.tsx` | `t('login.register')` (affiche la cle) | Traduction manquante | "Creer mon compte" |
| `Recipes.tsx` | "Nouvelle recette" | Correct | - |
| `Recipes.tsx` | "+ Ajouter un ingredient" | Correct | - |
| `Dashboard.tsx` | "Ajouter des ingredients" / "Creer une recette" | Correct, CTAs jumeaux dans l'etat vide | - |
| `Dashboard.tsx` | "Nouvelle recette" / "Ajouter ingredient" | Correct dans la barre d'actions | - |
| `AIAssistant.tsx` | "Voir" (pour voir une action creee) | Trop vague | "Ouvrir la fiche" ou "Voir le detail" |

### 4.2 Regles pour les CTAs

1. **Commencer par un verbe** ("Creer", "Ajouter", "Calculer", pas "Soumettre")
2. **Etre specifique** ("Creer ma recette" > "Valider")
3. **Indiquer le resultat** ("Enregistrer la fiche technique" > "Sauvegarder")
4. **Eviter le jargon** ("Dupliquer" > "Cloner")

---

## 5. Toasts & Confirmations

### 5.1 Analyse

| Page | Type | Actuel | Probleme | Proposition |
|------|------|--------|----------|-------------|
| `Recipes.tsx` | Succes | "Recette modifiee avec succes" | Correct | - |
| `Recipes.tsx` | Succes | "Recette creee avec succes" | Correct | - |
| `Recipes.tsx` | Succes | "Recette dupliquee avec succes" | Correct | - |
| `Recipes.tsx` | Succes | "Recette supprimee" | Manque la confirmation positive | "Recette supprimee avec succes" |
| `Recipes.tsx` | Succes (AI) | `"${selected.length} ingredient(s) ajoute(s)"` | String en dur, accents manquants | i18n + "X ingredient(s) ajoute(s) a votre recette" |
| `Recipes.tsx` | Erreur | "Erreur lors du chargement" | Generique | "Impossible de charger vos recettes. Actualisez la page." |
| `Recipes.tsx` | Erreur | "Erreur lors de la sauvegarde" | Generique | "Votre recette n'a pas pu etre sauvegardee. Reessayez." |
| `Landing.tsx` | Succes contact | `contactSent = true` (affiche un message vert) | Le message de succes n'est pas visible dans le code analyse | "Votre message a bien ete envoye ! Nous vous repondrons sous 24h." |

### 5.2 Dialogues de confirmation

| Page | Actuel | Proposition |
|------|--------|-------------|
| `Recipes.tsx` | "Etes-vous sur de vouloir supprimer cette recette ? Cette action est irreversible." | Bon, mais ajouter le nom : "Supprimer la recette **{nom}** ? Cette action est irreversible et ne peut pas etre annulee." |

### 5.3 Regles pour les toasts

1. **Confirmer l'action realisee** ("Recette creee" pas juste "Succes")
2. **Etre bref** (max 10 mots pour les succes)
3. **Proposer une action pour les erreurs** ("Reessayez" ou "Contactez-nous")
4. **Ne jamais utiliser "Succes" ou "Erreur" seuls**

---

## 6. Placeholders

### 6.1 Analyse

| Page | Champ | Actuel | Probleme | Proposition |
|------|-------|--------|----------|-------------|
| `Login.tsx` | Email | `"votre@email.com"` | Correct | - |
| `Login.tsx` | Mot de passe | `"........"` | Pas informatif | "Votre mot de passe" |
| `Login.tsx` | Nom | `t('login.yourName')` (affiche la cle) | Traduction manquante | "Ex : Jean Dupont" |
| `Recipes.tsx` | Recherche | "Rechercher une recette..." | Correct | - |
| `Recipes.tsx` | Nom du plat | "Tapez un nom (ex: quiche, risotto, burger...)" | Bon, concret | - |
| `Recipes.tsx` | Quantite | "Qte" | Trop court | "Ex : 0.5" |
| `Recipes.tsx` | Perte % | "Perte %" | Pas clair pour un non-initie | "Ex : 10" (avec label "Perte en %") |
| `Recipes.tsx` | Combobox ingredient | "Tapez un nom ou choisissez..." | Correct | - |
| `Recipes.tsx` | Filtre ingredients | "Filtrer les ingredients..." | Correct | - |
| `AIAssistant.tsx` | Textarea | "Demandez-moi de creer une recette, ajouter un ingredient..." | Bon, donne des exemples concrets | Ajouter les accents : "Demandez-moi de creer une recette, ajouter un ingredient..." |
| `AIAssistant.tsx` | Textarea (micro actif) | "Parlez maintenant..." | Correct | - |

### 6.2 Regles pour les placeholders

1. **Donner un exemple concret** ("Ex : Filet de boeuf" > "Nom du plat")
2. **Ne pas repeter le label** (si le label dit "Email", le placeholder ne dit pas "Entrez votre email")
3. **Utiliser "Ex :" pour les valeurs numeriques** ("Ex : 12.50")

---

## 7. Titres de page

### 7.1 Analyse

| Page | Actuel | Probleme | Proposition |
|------|--------|----------|-------------|
| `Dashboard.tsx` | "Tableau de bord" | Generique, pas specifique au domaine | "Tableau de bord -- Vos marges en un coup d'oeil" ou garder "Tableau de bord" (simple et clair) |
| `Recipes.tsx` | "Fiches techniques" | Tres bon -- parle le langage metier | - |
| `AIAssistant.tsx` | "Assistant IA RestauMargin" | Correct | - |
| `AIAssistant.tsx` | Sous-titre : "Analyse vos donnees et agit sur votre restaurant" | Bon, oriente benefice | - |
| `Login.tsx` | `t('login.title')` (affiche la cle) | Traduction manquante | "Connexion a votre espace" |
| `Landing.tsx` | Hero : "Maitrisez vos marges. Augmentez vos profits." | Excellent, clair et percutant | - |

### 7.2 Sous-titres / descriptions (Dashboard tabs)

| Onglet | Label | Description | Verdict |
|--------|-------|-------------|---------|
| Vue d'ensemble | "Vue d'ensemble" | "Resume global et categories" | Correct |
| Analyse des marges | "Analyse des marges" | "Marges par recette et classement" | Correct |
| Couts matiere | "Couts matiere" | "Repartition des couts ingredients" | Correct |
| Rentabilite | "Rentabilite" | "Projections et seuils" | Correct |

---

## 8. Labels de formulaire

### 8.1 Analyse

| Page | Label | Probleme | Proposition |
|------|-------|----------|-------------|
| `Login.tsx` | `t('login.email')` | Traduction manquante | "Adresse email" |
| `Login.tsx` | `t('login.password')` | Traduction manquante | "Mot de passe" |
| `Login.tsx` | `t('login.role')` | Traduction manquante | "Votre role" |
| `Login.tsx` | `t('login.activationCode')` | Traduction manquante, double usage label/placeholder | Label: "Code d'activation", Placeholder: "Ex : ACTIV-XXXX" |
| `Recipes.tsx` | "Nom du plat *" | Correct, asterisque pour champ requis | - |
| `Recipes.tsx` | "Categorie *" | Correct | - |
| `Recipes.tsx` | "Nb portions *" | Abbreviation | "Nombre de portions *" |
| `Recipes.tsx` | "Prix de vente (euro) *" | Correct | - |
| `Recipes.tsx` | "Preparation (min)" | Abbreviation | "Temps de preparation (minutes)" |
| `Recipes.tsx` | "Cuisson (min)" | Abbreviation | "Temps de cuisson (minutes)" |
| `Recipes.tsx` | "Cout MO (euro/h)" | Jargon ("MO") | "Cout main-d'oeuvre (euro/heure)" |
| `Landing.tsx` | Formulaire contact : champs nom, email, telephone, message | Pas de labels visibles dans le code analyse, juste des placeholders | Ajouter des labels accessibles |

### 8.2 Regles pour les labels

1. **Ne pas abbrevier** ("Nombre de portions" > "Nb portions")
2. **Indiquer l'unite dans le label** ("Prix de vente en euros" ou "(euro)" apres)
3. **Marquer les champs obligatoires** avec * (deja fait)
4. **Eviter le jargon** ("Main-d'oeuvre" > "MO")
5. **Utiliser des labels HTML** avec `htmlFor` pour l'accessibilite (partiellement fait)

---

## 9. Messages de chargement

### 9.1 Analyse

| Page | Actuel | Probleme | Proposition |
|------|--------|----------|-------------|
| `Dashboard.tsx` | Spinner sans texte | Pas d'indication de ce qui se passe | "Chargement de vos donnees..." |
| `Recipes.tsx` | "Chargement..." | Generique | "Chargement de vos fiches techniques..." |
| `Login.tsx` | `t('common.loading')` (affiche la cle) | Traduction manquante | "Connexion en cours..." (pour le bouton login) |
| `AIAssistant.tsx` | "Analyse en cours..." | Tres bon, specifique a l'action | - |
| `AIAssistant.tsx` | "Ecoute en cours..." | Tres bon, specifique a l'action | - |
| `Recipes.tsx` | Bouton sauvegarde : "Sauvegarde..." | Correct | - |
| `Landing.tsx` | Formulaire contact : pas de message de chargement visible | Le bouton est desactive mais sans texte | Ajouter "Envoi en cours..." sur le bouton |

### 9.2 Regles pour les messages de chargement

1. **Dire ce qui se charge** ("Chargement de vos recettes..." > "Chargement...")
2. **Utiliser les points de suspension** (...) pour indiquer une action en cours
3. **Pour les actions longues (>3s)**, ajouter un message de reassurance ("Ca ne devrait pas prendre longtemps...")

---

## 10. Assistant IA

### 10.1 Message de bienvenue

**Actuel** :
> "Bonjour ! Je suis votre assistant IA RestauMargin. Je peux analyser vos donnees ET agir : creer des fiches techniques, ajouter des ingredients, preparer des commandes fournisseurs. Que voulez-vous faire ?"

**Verdict** : Bon. Oriente action, explique les capacites. Le **gras** sur les mots cles est bien.

**Amelioration mineure** :
> "Bonjour ! Je suis votre assistant IA. Je peux analyser vos donnees et agir pour vous : creer des fiches techniques, ajouter des ingredients ou preparer une commande fournisseur. Comment puis-je vous aider ?"

(Retrait du nom "RestauMargin" -- l'utilisateur sait deja ou il est. Reformulation plus naturelle.)

### 10.2 Suggestions rapides

| Actuel | Probleme | Proposition |
|--------|----------|-------------|
| "Cree-moi une fiche technique" | Tutoiement implicite, accent manquant | "Creer une fiche technique" |
| "Ajoute un ingredient" | Tutoiement implicite | "Ajouter un ingredient" |
| "Prepare une commande fournisseur" | Tutoiement implicite | "Preparer une commande fournisseur" |
| "Analyse mes marges" | Tutoiement implicite | "Analyser mes marges" |
| "Quel est mon plat star ?" | Correct, naturel | - |

**Note** : Les suggestions utilisent le tutoiement ("Cree-moi") alors que le reste de l'app utilise le vouvoiement. Uniformiser en utilisant l'infinitif ("Creer", "Ajouter") est plus neutre et professionnel.

### 10.3 Labels d'actions executees

| Actuel | Proposition |
|--------|-------------|
| "Fiche technique creee" | "Fiche technique creee avec succes" |
| "Ingredient ajoute" | "Ingredient ajoute a votre base" |
| "Commande creee" | "Commande fournisseur preparee" |
| "Action executee" (defaut) | "Action realisee" |

### 10.4 Footer

**Actuel** : "Propulse par Claude AI -- Analyse et agit sur votre restaurant"

**Proposition** : "Propulse par l'IA -- Analyse et recommandations en temps reel"

(Retirer le nom "Claude AI" qui n'apporte rien a l'utilisateur final.)

---

## 11. Landing page

### 11.1 Points positifs

- Hero percutant : "Maitrisez vos marges. Augmentez vos profits."
- Bloc probleme/solution bien structure
- Temoignages avec noms, roles et lieux -- credible
- FAQ claire et repondant aux vraies questions des restaurateurs
- Chiffres animes (150+, 8%, 50k, 4.8/5) -- bon social proof

### 11.2 Ameliorations suggerees

| Section | Actuel | Proposition |
|---------|--------|-------------|
| Badge hero | "PLATEFORME #1 DES RESTAURATEURS" | "L'OUTIL DE REFERENCE DES RESTAURATEURS" (moins premptoire) |
| Sous-titre hero | "La plateforme tout-en-un pour les restaurateurs qui veulent reprendre le controle de leurs couts matiere, optimiser leur carte et automatiser leurs commandes." | "Reprenez le controle de vos couts matiere. Optimisez votre carte. Automatisez vos commandes." (plus direct, plus rythme) |
| CTA principal | "Voir les tarifs" | "Decouvrir nos offres" (plus engageant) |
| CTA secondaire | "Voir la demo" | "Voir RestauMargin en action" |
| Mention Stripe | "Paiement securise via Stripe" | "Paiement 100% securise" (le nom "Stripe" ne parle pas aux restaurateurs) |
| Section "Comment ca marche" | "Activation instantanee." (dans step 1) | "Sans engagement. Activation immediate." |
| Section "Comment ca marche" | "Pro 29 euros ou Business 79 euros." | Deplacer les prix en lien vers /pricing, pas dans le "comment ca marche" |
| Section integrations | "Vous utilisez un autre logiciel ?" | Correct, bonne ouverture |

### 11.3 FAQ -- Ajustements

Les questions sont bonnes et pertinentes. Suggestions mineures :

| Question | Amelioration |
|----------|-------------|
| "Comment fonctionne l'abonnement ?" | Ajouter "Sans engagement" au debut de la reponse pour rassurer |
| "Mes donnees sont-elles securisees ?" | Bon. Garder tel quel. |
| "Puis-je utiliser une balance connectee ?" | Preciser "Toute balance Bluetooth standard" |

---

## 12. Regles generales

### 12.1 Charte editoriale

| Regle | Exemple correct | Exemple incorrect |
|-------|----------------|-------------------|
| Vouvoiement | "Votre recette a ete creee" | "Ta recette a ete creee" |
| Pas de jargon tech | "Connexion impossible" | "Erreur 401" |
| Accents obligatoires | "Creee", "modifiee" | "Creee", "modifiee" (sans accents) |
| Ton direct | "Ajoutez vos ingredients" | "Il serait preferable d'ajouter des ingredients" |
| Pas d'exclamation excessive | "Recette sauvegardee." | "Recette sauvegardee !!!" |
| Ponctuation dans les toasts | Pas de point final | Point final superflu |

### 12.2 Glossaire metier (termes a utiliser)

| Terme RestauMargin | Explication |
|-------------------|-------------|
| Fiche technique | Document decrivant une recette avec couts |
| Cout matiere | Cout des ingredients d'un plat |
| Marge brute | Prix de vente - cout matiere |
| Coefficient multiplicateur | Prix de vente / cout matiere |
| Perte (%) | Pourcentage de dechet sur un ingredient |
| Couvert | Un client servi |
| Cout main-d'oeuvre | Cout du travail par heure |
| Menu Engineering | Analyse de rentabilite et popularite des plats |

### 12.3 Checklist avant publication

- [ ] Tous les `t('key')` renvoient une traduction, jamais la cle brute
- [ ] Aucune string en dur en francais dans les fichiers TSX
- [ ] Aucun code technique visible par l'utilisateur (codes HTTP, noms de champs)
- [ ] Chaque message d'erreur propose une action
- [ ] Chaque etat vide motive l'utilisateur a agir
- [ ] Les toasts de succes confirment l'action realisee
- [ ] Le vouvoiement est utilise partout, sans exception
- [ ] Les accents sont presents sur tous les caracteres accentues

---

## Resume des actions prioritaires

| Priorite | Action | Fichiers concernes |
|----------|--------|-------------------|
| P0 - Critique | Ajouter section `login` + `common` dans `fr.json` (et toutes les locales) | `client/src/locales/*.json` |
| P0 - Critique | Migrer les strings en dur de `AIAssistant.tsx` vers i18n | `AIAssistant.tsx`, `fr.json` |
| P1 - Important | Corriger les accents manquants dans les strings en dur | `AIAssistant.tsx`, `Landing.tsx` |
| P1 - Important | Ajouter un feedback utilisateur quand le Dashboard echoue a charger | `Dashboard.tsx` |
| P2 - Amelioration | Enrichir les etats vides avec des messages motivants | `Recipes.tsx`, `Dashboard.tsx` |
| P2 - Amelioration | Uniformiser le tutoiement/vouvoiement dans les suggestions IA | `AIAssistant.tsx` |
| P3 - Polish | Deabbreger les labels ("Nb portions" -> "Nombre de portions") | `Recipes.tsx` (via `fr.json`) |
| P3 - Polish | Ameliorer les CTAs de la landing page | `Landing.tsx` |
