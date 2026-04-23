# Crisp Chat — Configuration bot & FAQ automatique

## Contexte

Le widget Crisp est deja installe sur l'app RestauMargin (voir `FloatingActionBubble.tsx` et `HelpButton.tsx`).
Ce guide configure le **bot Crisp** pour deflectionner 30 a 40 % des conversations entrantes.

**Cible : reponse bot < 2 secondes, taux de resolution sans humain > 30 %.**

---

## 1. Prerequis

- Acces admin au dashboard Crisp : https://app.crisp.chat
- Plan Crisp Pro (requis pour le bot et les scenarios)
- Website ID RestauMargin (recuperable dans Settings > Website Settings)

---

## 2. Creer les scenarios bot

Dans Crisp Dashboard, aller dans **Chatbox > Bot > Create a new scenario**.

### Scenario A — Accueil automatique (trigger : nouvelle conversation)

**Trigger :** `conversation:opened` — **Delai :** 5 secondes

```
Message 1 (bot) :
"Bonjour ! Je suis l'assistant RestauMargin.
Comment puis-je vous aider ?"

Boutons proposes :
  [1] Je ne peux pas me connecter
  [2] Question sur les fiches techniques
  [3] Probleme de facturation ou d'abonnement
  [4] Autre question
```

---

### Scenario B — Connexion/mot de passe

**Trigger :** bouton [1] ou message contient : "connexion", "mot de passe", "login"

```
Message (bot) :
"Je peux vous aider avec votre connexion.

Si vous avez oublie votre mot de passe :
1. Allez sur restaumargin.fr/login
2. Cliquez sur 'Mot de passe oublie'
3. Entrez votre email et verifiez vos spams

Le lien de reinitialisation est valable 1 heure.

Cela a resolu votre probleme ?"

Boutons :
  [Oui, merci]  -> Scenario Satisfaction
  [Non, j'ai encore besoin d'aide]  -> Transfert vers humain
```

---

### Scenario C — Fiches techniques

**Trigger :** bouton [2] ou message contient : "fiche", "recette", "food cost", "marge"

```
Message (bot) :
"Pour les fiches techniques, voici les reponses rapides :

-> Pour creer une fiche : Menu > Fiches techniques > + Nouvelle fiche
-> Le food cost s'affiche automatiquement apres ajout des ingredients
-> L'IA peut generer une recette depuis le nom du plat

Consultez notre centre d'aide : restaumargin.fr/aide

Voulez-vous parler a quelqu'un ?"

Boutons :
  [Oui, je veux parler a l'equipe]  -> Transfert
  [Non, merci c'est bon]  -> Scenario Satisfaction
```

---

### Scenario D — Facturation

**Trigger :** bouton [3] ou message contient : "paiement", "abonnement", "facture", "Stripe"

```
Message (bot) :
"Pour tout ce qui concerne votre abonnement :

-> Gerez votre abonnement : restaumargin.fr/abonnement
-> Le portail Stripe vous permet de mettre a jour votre CB et telecharger vos factures
-> En cas de probleme de paiement, un email automatique vous est envoye avec un lien

Si votre acces est bloque apres paiement, repondez ici — regle sous 2h."

Boutons :
  [J'ai encore un probleme]  -> Transfert vers humain
  [C'est bon, merci]  -> Scenario Satisfaction
```

---

### Scenario E — Satisfaction et fermeture

**Trigger :** bouton "Oui, merci" / "Non, merci c'est bon"

```
Message (bot) :
"Parfait ! N'hesitez pas a revenir si vous avez d'autres questions.

Sur 5 etoiles, comment noteriez-vous cette interaction ?"

Rating : 1 a 5 etoiles (CSAT automatique dans Crisp Analytics)
```

---

### Scenario F — Hors horaires (hors lundi-vendredi 9h-18h)

**Trigger :** conversation ouverte hors des heures de bureau

```
Message (bot) :
"Bonjour ! Vous nous contactez en dehors de nos heures d'ouverture (lun-ven, 9h-18h).

Notre equipe vous repondra des demain matin, avant 10h.

En attendant, notre centre d'aide repond peut-etre a votre question :
restaumargin.fr/aide"
```

---

## 3. Tags et routage

| Tag | Usage |
|---|---|
| `mot-de-passe` | Problemes de connexion |
| `facturation` | Questions Stripe/abonnement |
| `onboarding` | Nouveaux users (< 7 jours) |
| `bug` | Probleme technique remonte |
| `churning` | User exprime frustration ou intention de partir |

**Detection `churning` — mots-cles a surveiller :**
"annuler", "pas satisfait", "ca ne marche pas", "trop cher", "je pars"

**Action sur tag `churning` :** notification Slack/email immediate a l'equipe.

---

## 4. Integration code (deja fait)

Le widget est initialise dans `client/src/components/FloatingActionBubble.tsx`.

Pour ouvrir Crisp depuis n'importe quel composant (ex: page d'erreur) :

```typescript
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

## 5. SLA a afficher dans l'app

- **Heures de bureau** : lun-ven 9h-18h (CET)
- **Temps de reponse affiche** : "Repond sous quelques heures"
- **Hors bureau** : "Repond le prochain jour ouvre"

Le centre d'aide `/aide` affiche deja : "Reponse humaine sous 24h en semaine".

---

## 6. Metriques mensuelles a suivre

| Metrique | Cible |
|---|---|
| Conversations resolues par bot | > 30 % |
| CSAT moyen | > 4/5 |
| Temps 1ere reponse humain | < 2h en heures de bureau |
| Top motifs (tags) | identifier les docs manquantes |

---

## 7. Checklist d'activation

- [ ] Creer compte Crisp Pro
- [ ] Verifier que le Website ID correspond a la prod
- [ ] Creer les 6 scenarios decrits ci-dessus
- [ ] Configurer les horaires de bureau
- [ ] Tester chaque scenario avec un compte test
- [ ] Configurer le tag `churning` avec alerting Slack
- [ ] Activer le CSAT automatique post-conversation

---

Derniere mise a jour : 2026-04-23 — CCO RestauMargin
