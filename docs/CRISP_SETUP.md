# Crisp Chat — Configuration bot & FAQ automatique

## Contexte

Le widget Crisp est déjà installé sur l'app RestauMargin (voir `FloatingActionBubble.tsx` et `HelpButton.tsx`).
Ce guide configure le **bot Crisp** pour déflectionner 30 à 40 % des conversations entrantes via réponses automatiques.

**Cible : réponse bot < 2 secondes, taux de résolution sans humain > 30 %.**

---

## 1. Prérequis

- Accès admin au dashboard Crisp : https://app.crisp.chat
- Plan Crisp Pro (requis pour le bot et les scénarios)
- Website ID RestauMargin (récupérable dans Settings > Website Settings)

---

## 2. Créer les scénarios bot

Dans Crisp Dashboard, aller dans **Chatbox > Bot > Create a new scenario**.

### Scénario A — Accueil automatique (déclencheur : nouvelle conversation)

**Trigger :** `conversation:opened`
**Délai :** 5 secondes

```
Message 1 (bot) :
"Bonjour ! Je suis l'assistant RestauMargin.
Comment puis-je vous aider ?"

Boutons proposés :
  [1] Je ne peux pas me connecter
  [2] Question sur les fiches techniques
  [3] Problème de facturation ou d'abonnement
  [4] Autre question
```

---

### Scénario B — Connexion/mot de passe

**Trigger :** bouton [1] de scénario A ou message contient : "connexion", "mot de passe", "login"

```
Message (bot) :
"Je peux vous aider avec votre connexion.

Si vous avez oublié votre mot de passe :
1. Allez sur restaumargin.fr/login
2. Cliquez sur 'Mot de passe oublié'
3. Entrez votre email et vérifiez vos spams

Le lien de réinitialisation est valable 1 heure.

Cela a résolu votre problème ?"

Boutons :
  [Oui, merci]  → Scénario Satisfaction
  [Non, j'ai encore besoin d'aide]  → Transfert vers humain
```

---

### Scénario C — Fiches techniques

**Trigger :** bouton [2] ou message contient : "fiche", "recette", "food cost", "marge"

```
Message (bot) :
"Pour les fiches techniques, voici les réponses rapides :

→ Pour créer une fiche : Menu > Fiches techniques > + Nouvelle fiche
→ Le food cost s'affiche automatiquement après ajout des ingrédients
→ L'IA peut générer une recette depuis le nom du plat

Consultez notre centre d'aide : restaumargin.fr/aide

Voulez-vous parler à quelqu'un ?"

Boutons :
  [Oui, je veux parler à l'équipe]  → Transfert
  [Non, merci c'est bon]  → Scénario Satisfaction
```

---

### Scénario D — Facturation

**Trigger :** bouton [3] ou message contient : "paiement", "abonnement", "facture", "Stripe"

```
Message (bot) :
"Pour tout ce qui concerne votre abonnement :

→ Gérez votre abonnement : restaumargin.fr/abonnement
→ Le portail Stripe vous permet de mettre à jour votre CB et télécharger vos factures
→ En cas de problème de paiement, un email automatique vous est envoyé avec un lien de régularisation

Si votre accès est bloqué après paiement, répondez ici — nous réglons ça en moins de 2h."

Boutons :
  [J'ai encore un problème]  → Transfert vers humain
  [C'est bon, merci]  → Scénario Satisfaction
```

---

### Scénario E — Satisfaction et fermeture

**Trigger :** bouton "Oui, merci" / "Non, merci c'est bon"

```
Message (bot) :
"Parfait ! N'hésitez pas à revenir si vous avez d'autres questions.

Petite question : sur 5 étoiles, comment noteriez-vous cette interaction ?"

Rating : ★ ★ ★ ★ ★ (CSAT)

Note : Le score est automatiquement remonté dans Crisp Analytics.
```

---

### Scénario F — Hors horaires (lundi-vendredi 9h-18h)

**Trigger :** conversation ouverte hors des heures de bureau

```
Message (bot) :
"Bonjour ! Vous nous contactez en dehors de nos heures d'ouverture (lun-ven, 9h-18h).

Notre équipe vous répondra dès demain matin, avant 10h.

En attendant, notre centre d'aide répond peut-être à votre question :
restaumargin.fr/aide"
```

---

## 3. Tags et routage

Configurer les tags suivants dans Crisp pour filtrage et métriques :

| Tag | Usage |
|---|---|
| `mot-de-passe` | Problèmes de connexion |
| `facturation` | Questions Stripe/abonnement |
| `onboarding` | Nouveaux users (< 7 jours) |
| `bug` | Problème technique remonté |
| `churning` | User exprime frustration ou intention de partir |

Pour détecter `churning` automatiquement, configurer un trigger sur les mots-clés :
"annuler", "pas satisfait", "ca ne marche pas", "trop cher", "je pars"

**Action sur tag `churning` :** notif Slack/email immédiate à l'équipe.

---

## 4. Intégration Crisp dans le code (déjà fait)

Le widget est initialisé dans `client/src/components/FloatingActionBubble.tsx`.

Pour ouvrir la chat box programmatically depuis n'importe quel composant :

```typescript
// Ouvre Crisp depuis le code (ex: bouton "Besoin d'aide ?" sur page d'erreur)
declare global { interface Window { $crisp?: any[] } }

function openCrispChat(prepopulatedMessage?: string) {
  if (window.$crisp) {
    window.$crisp.push(['do', 'chat:open']);
    if (prepopulatedMessage) {
      window.$crisp.push(['set', 'message:text', [prepopulatedMessage]]);
    }
  }
}

// Exemple : sur une erreur 500
openCrispChat("J'ai une erreur sur la page Fiches techniques");
```

---

## 5. SLA à afficher dans l'app

Configurer dans Crisp Settings > Availability :

- **Heures de bureau** : lun-ven 9h-18h (CET)
- **Temps de réponse affiché** : "Répond sous quelques heures"
- **Hors bureau** : "Répond le prochain jour ouvré"

Afficher aussi dans la page `/aide` (déjà fait : "Réponse humaine sous 24h en semaine").

---

## 6. Métriques à suivre

Rapport mensuel à extraire depuis Crisp Analytics :

| Métrique | Cible |
|---|---|
| Conversations résolues par bot | > 30 % |
| CSAT moyen | > 4/5 |
| Temps de première réponse humain | < 2h en heures de bureau |
| Conversations par semaine | tracker la croissance |
| Top motifs (tags) | identifier les docs manquantes |

---

## 7. Checklist d'activation

- [ ] Créer compte Crisp Pro (si pas encore fait)
- [ ] Vérifier que le Website ID correspond à la prod (pas le staging)
- [ ] Créer les 6 scénarios décrits ci-dessus
- [ ] Configurer les horaires de bureau
- [ ] Tester chaque scénario avec un compte test
- [ ] Configurer le tag `churning` avec alerting Slack
- [ ] Activer le CSAT automatique post-conversation
- [ ] Vérifier que les métriques remontent dans Analytics

---

Dernière mise à jour : 2026-04-23 — CCO RestauMargin
