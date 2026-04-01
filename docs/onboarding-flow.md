# RestauMargin -- Flow Onboarding Post-Inscription

> Objectif : amener chaque nouvel utilisateur a son "aha moment" (voir ses marges calculees automatiquement) en moins de 5 minutes.

---

## 1. Vue d'ensemble du flow

```
Inscription -> Dashboard vide -> Etape 1 -> Etape 2 -> Etape 3 -> Etape 4 -> Etape 5 -> Dashboard actif
                                  Nom du     Premier    Premiere    Commande    Explorer
                                  restaurant ingredient recette IA  vocale      mercuriale
```

**Principe directeur** : chaque etape produit un resultat visible immediatement. L'utilisateur fait, il ne lit pas un tutoriel.

---

## 2. Les 5 etapes d'onboarding

### Etape 1 -- Nommer son restaurant

| Element       | Detail |
|---------------|--------|
| Declencheur   | Premier acces au dashboard apres inscription |
| Action        | Saisir le nom du restaurant (champ unique, auto-focus) |
| Resultat      | Le nom s'affiche dans la barre laterale et le header |
| Duree cible   | < 10 secondes |
| Ecran         | Modal centree, pas de distraction |

**Empty state avant** : "Bienvenue ! Donnez un nom a votre restaurant pour commencer."
**Celebration** : Micro-animation confettis + message "Votre espace est pret."

### Etape 2 -- Ajouter un premier ingredient

| Element       | Detail |
|---------------|--------|
| Declencheur   | Clic sur "Etape suivante" ou redirection auto |
| Action        | Ajouter 1 ingredient (nom, prix fournisseur, unite) |
| Resultat      | L'ingredient apparait dans la liste avec son cout unitaire |
| Duree cible   | < 30 secondes |
| Ecran         | Page Ingredients avec formulaire pre-ouvert |

**Aide contextuelle** : Suggestion d'ingredients populaires (farine, huile d'olive, tomate) pour eviter le syndrome de la page blanche.
**Empty state** : "Aucun ingredient pour l'instant. Ajoutez-en un pour calculer vos couts."

### Etape 3 -- Creer une premiere recette avec l'IA

| Element       | Detail |
|---------------|--------|
| Declencheur   | Ingredient cree avec succes |
| Action        | Utiliser l'assistant IA pour generer une recette a partir de l'ingredient ajoute |
| Resultat      | Fiche recette complete avec cout matiere et marge suggeree |
| Duree cible   | < 60 secondes |
| Ecran         | Page Recettes, bouton "Creer avec l'IA" mis en avant |

**C'est le "aha moment"** : l'utilisateur voit pour la premiere fois un cout matiere et une marge calcules automatiquement. La valeur du produit devient tangible.

### Etape 4 -- Tester la commande vocale

| Element       | Detail |
|---------------|--------|
| Declencheur   | Recette creee |
| Action        | Dire "Ajouter 2 kilos de tomates" au micro |
| Resultat      | L'ingredient s'ajoute a la liste, le cout se met a jour |
| Duree cible   | < 30 secondes |
| Ecran         | Tooltip sur l'icone micro + overlay "Essayez : dites 'Ajouter 2 kilos de tomates'" |

**Fallback** : Si le micro n'est pas disponible, proposer de passer cette etape avec un lien "Je prefere saisir manuellement".

### Etape 5 -- Explorer la mercuriale

| Element       | Detail |
|---------------|--------|
| Declencheur   | Commande vocale reussie ou etape passee |
| Action        | Parcourir la mercuriale (base de prix fournisseurs) |
| Resultat      | L'utilisateur decouvre les prix de reference et peut comparer |
| Duree cible   | < 45 secondes |
| Ecran         | Page Mercuriale avec mise en avant de la categorie liee a l'ingredient cree |

**Celebration finale** : "Bravo ! Vous maitrisez les bases de RestauMargin." + Confettis + Checklist cochee a 100%.

---

## 3. Barre de progression

### Comportement

- Affichee en haut du dashboard tant que l'onboarding n'est pas termine
- 5 segments, colores au fur et a mesure (0%, 20%, 40%, 60%, 80%, 100%)
- Pourcentage affiche : "3/5 etapes terminees (60%)"
- Clic sur un segment = acces direct a l'etape correspondante

### Regles d'affichage

| Etat | Affichage |
|------|-----------|
| Etape non commencee | Cercle vide + libelle grise |
| Etape en cours | Cercle pulse + libelle en gras |
| Etape terminee | Cercle coche vert + libelle barre |
| Toutes terminees | Barre disparait apres 3 sessions, remplacee par un lien discret "Revoir le guide" |

### Composant technique

```
OnboardingProgressBar
  props: currentStep (1-5), completedSteps: boolean[]
  persistance: table user_onboarding en base (Supabase)
  champs: step_1_completed_at, step_2_completed_at, ..., onboarding_completed_at
```

---

## 4. Checklist onboarding dans le dashboard

### Position et design

- Carte dedicee dans le dashboard, colonne droite
- Visible uniquement tant que toutes les etapes ne sont pas cochees
- Ordre fixe, non modifiable par l'utilisateur

### Contenu de la checklist

```
[ ] Nommer votre restaurant
[ ] Ajouter votre premier ingredient
[ ] Creer une recette avec l'IA
[ ] Tester la commande vocale
[ ] Explorer la mercuriale
```

### Interactions

- Clic sur une ligne non cochee = navigation vers l'ecran correspondant
- Ligne cochee = non cliquable, affiche la date de completion
- Bouton "Ignorer pour l'instant" en bas de la carte (masque la carte pour cette session, revient a la prochaine connexion)
- A 100% : la carte se transforme en message de felicitations pendant 1 session, puis disparait

### Schema de donnees

```sql
CREATE TABLE user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_named_at TIMESTAMPTZ,
  first_ingredient_at TIMESTAMPTZ,
  first_recipe_ai_at TIMESTAMPTZ,
  voice_command_tested_at TIMESTAMPTZ,
  mercuriale_explored_at TIMESTAMPTZ,
  onboarding_completed_at TIMESTAMPTZ,
  onboarding_dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Emails de reengagement

### Strategie

Les emails ne dupliquent pas l'in-app : ils ramenent l'utilisateur dans le produit avec un CTA unique et specifique.

### Sequence

#### Email J+1 -- "Votre restaurant vous attend"

| Element | Detail |
|---------|--------|
| Condition d'envoi | Inscription faite mais etape 1 non completee |
| Objet | "{prenom}, votre espace RestauMargin est pret" |
| Corps | Rappel de la valeur (calculer ses marges en 5 min), screenshot du dashboard avec donnees exemple |
| CTA | "Commencer maintenant" -> dashboard |
| Heure d'envoi | 10h le lendemain (heure locale) |

#### Email J+3 -- "Vos marges en 3 clics"

| Element | Detail |
|---------|--------|
| Condition d'envoi | Au moins 1 etape non completee |
| Objet | "Calculez votre premiere marge en 3 minutes" |
| Corps | Focus sur l'etape non completee la plus avancee. Si etape 2 faite mais pas etape 3 : mettre en avant la creation de recette IA |
| CTA | Lien direct vers l'etape manquante |
| Heure d'envoi | 10h, J+3 |

#### Email J+7 -- "Besoin d'aide ?"

| Element | Detail |
|---------|--------|
| Condition d'envoi | Onboarding non complete |
| Objet | "On peut vous aider a demarrer ?" |
| Corps | Ton empathique. Proposition de 3 options : (1) Lien vers video tutoriel (2) Repondre a cet email pour poser une question (3) Lien vers la checklist onboarding |
| CTA principal | "Reprendre ou j'en etais" -> checklist dashboard |
| Heure d'envoi | 10h, J+7 |

### Regles communes

- Ne pas envoyer si l'onboarding est deja complete
- Se desinscrire automatiquement de la sequence des que onboarding_completed_at est renseigne
- Maximum 1 email par jour
- Expediteur : "Youssef de RestauMargin" (adresse noreply@restaumargin.com)
- Outil d'envoi : Resend (deja integre au projet)

---

## 6. Metriques et suivi

### Metriques principales

| Metrique | Definition | Cible |
|----------|-----------|-------|
| Taux d'activation | % des inscrits ayant complete les 5 etapes | > 40% a 30 jours |
| Time-to-value | Temps entre inscription et completion de l'etape 3 (premiere marge vue) | < 5 minutes |
| Taux de completion onboarding | % des inscrits ayant termine les 5 etapes | > 30% a 7 jours |
| Retention J1 | % des inscrits revenant le lendemain | > 25% |
| Retention J7 | % des inscrits revenant a 7 jours | > 15% |

### Abandon par etape (funnel)

```
Inscription          100%
Etape 1 (Nom)         ??%   <- mesurer le drop ici
Etape 2 (Ingredient)  ??%
Etape 3 (Recette IA)  ??%   <- "aha moment", point critique
Etape 4 (Vocale)      ??%
Etape 5 (Mercuriale)  ??%
Onboarding complet    ??%
```

**Objectif** : identifier l'etape ou le drop est le plus important et concentrer les efforts la-dessus.

### Evenements a tracker (analytics)

| Evenement | Proprietes |
|-----------|-----------|
| `onboarding_step_started` | step_number, step_name, time_since_signup |
| `onboarding_step_completed` | step_number, step_name, duration_seconds |
| `onboarding_step_skipped` | step_number, step_name, reason |
| `onboarding_completed` | total_duration_seconds, steps_skipped_count |
| `onboarding_dismissed` | current_step, steps_completed_count |
| `onboarding_email_sent` | email_type (j1/j3/j7), current_step |
| `onboarding_email_clicked` | email_type, cta_target |
| `onboarding_reengaged` | days_since_signup, trigger (email/organic) |

### Dashboard de suivi

Creer une vue dans le dashboard admin (ou Supabase SQL) avec :

- Funnel d'abandon par etape (graphique en entonnoir)
- Time-to-value median par cohorte hebdomadaire
- Taux d'activation par source d'acquisition
- Performance des emails (taux d'ouverture, taux de clic, taux de reengagement)

---

## 7. Implementation technique

### Priorite de developpement

| Phase | Contenu | Effort |
|-------|---------|--------|
| V1 | Checklist dashboard + barre de progression + etapes 1-3 | 3-4 jours |
| V2 | Etapes 4-5 + emails J+1/J+3/J+7 via Resend | 2-3 jours |
| V3 | Tracking analytics + dashboard admin metriques | 2 jours |
| V4 | Optimisation basee sur les donnees du funnel | Continu |

### Fichiers concernes

- `src/components/onboarding/OnboardingProgressBar.tsx`
- `src/components/onboarding/OnboardingChecklist.tsx`
- `src/components/onboarding/OnboardingStepModal.tsx`
- `src/hooks/useOnboarding.ts` (lecture/ecriture etat onboarding)
- `supabase/migrations/xxx_create_user_onboarding.sql`
- `src/lib/emails/onboarding-j1.tsx` (template Resend)
- `src/lib/emails/onboarding-j3.tsx`
- `src/lib/emails/onboarding-j7.tsx`
- `supabase/functions/send-onboarding-emails/index.ts` (Edge Function cron)
