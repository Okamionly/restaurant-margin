# SOP · Support client

**Trigger :** Email de support reçu sur youssef@restaumargin.com ou via formulaire  
**Qui :** CS Freelance (quand en poste) · Fondateur en attendant  
**Timing :** Réponse dans les 24h ouvrées (promesse publique)  
**Outputs :** Client débloqué, ticket fermé, friction remontée au produit si récurrente

---

## Étapes

### 1. Triage (< 30 min après réception)

Classifier le ticket :

| Catégorie | Exemples | Priorité |
|-----------|----------|----------|
| **Bloquant** | Impossible de se connecter, données perdues, billing KO | CRITICAL → SOP bug-fix |
| **Feature** | "Comment faire X ?", "Je ne trouve pas Y" | Normal |
| **Bug** | "Ça ne fonctionne pas comme prévu" | Escalader à SOP bug-fix |
| **Feedback** | "Ce serait bien si…", "J'aimerais…" | Enregistrer dans Notion "Feedback produit" |
| **Billing** | Annulation, upgrade, downgrade, erreur de paiement | Traiter en priorité (impact MRR) |

### 2. Réponse initiale (< 4h pour CRITICAL, < 24h pour le reste)

**Principes de réponse :**
- Toujours commencer par accuser réception du problème
- Ne pas utiliser de formules creuses ("Nous avons bien reçu votre demande...")
- Aller droit au but : "Voici comment faire..." ou "Je reproduis le problème de mon côté..."
- Signer en prénom, pas "L'équipe RestauMargin"

**Template réponse feature :**
```
Bonjour [Prénom],

Pour [faire X], voici la marche à suivre :

1. [étape 1]
2. [étape 2]
3. [étape 3]

Si ça ne fonctionne pas, dites-moi quelle étape bloque et
je regarde ça avec vous.

Youssef
```

**Template bug confirmé :**
```
Bonjour [Prénom],

J'ai bien reproduit le problème — vous avez raison, c'est un bug.
Je vais le corriger aujourd'hui/cette semaine.

Je vous tiens informé(e) quand c'est déployé.

Merci de me l'avoir signalé,
Youssef
```

### 3. Résolution

- **Feature question** → Guider, puis vérifier que le client a réussi
- **Bug** → Ouvrir ticket GitHub + suivre SOP bug-fix.md → notifier le client quand déployé
- **Feedback produit** → Ajouter dans Notion "Backlog produit" avec contexte client

### 4. Clôture

- [ ] Confirmer que le client est débloqué (un message de confirmation)
- [ ] Si bug corrigé : email de suivi "Le problème est résolu, pouvez-vous vérifier ?"
- [ ] Si feedback produit : "Bonne idée, je note ça dans notre roadmap. Je vous previens si on le développe."

### 5. Log hebdomadaire

Chaque lundi, reporter dans Notion "Weekly Support Log" :
- Nombre de tickets reçus
- Top 3 des questions les plus fréquentes
- Bugs nouveaux découverts
- Suggestions produit reçues

Si une même question revient 3 fois → créer/mettre à jour l'article help center correspondant.

---

## Canaux de support

| Canal | Usage | SLA |
|-------|-------|-----|
| youssef@restaumargin.com | Support général | 24h ouvrées |
| Formulaire in-app | Feature questions | 24h ouvrées |
| Téléphone | Urgences critiques uniquement | Immédiat |

---

## Ce qu'on ne fait PAS

- On ne ferme pas un ticket sans confirmation que le client est débloqué
- On ne répond pas avec des réponses copiées-collées sans personnalisation
- On ne promet pas une feature ou une date de correction sans être certain
- On ne redirige pas vers une FAQ sans s'assurer que la réponse s'y trouve vraiment

---

## Politique RGPD données support

- Les emails de support sont conservés 2 ans maximum
- Aucune donnée de candidature ou de support n'est transmise à des tiers sans accord
- Sur demande client : suppression complète de l'historique support sous 30 jours

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** CS Freelance / Fondateur
