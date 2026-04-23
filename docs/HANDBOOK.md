# RestauMargin — Employee Handbook

> Version 1.0 · Avril 2026 · Ce document évolue. Les mises à jour sont communiquées par email.

---

## 1. Qui sommes-nous (vraiment)

RestauMargin est un SaaS B2B qui aide les restaurateurs français à maîtriser leur food cost et leurs marges. On est en early-stage : produit en production, premiers clients payants, fondateur solo.

Ce handbook n'est pas un document RH corporatif. C'est un contrat implicite entre toi et RestauMargin sur comment on travaille ensemble.

**Ce qu'on n'est pas :**
- Une "famille" (c'est un job, et un beau job)
- Une startup qui "disrupte" (on résout un vrai problème de terrain)
- Un endroit où tout le monde est toujours d'accord

**Ce qu'on est :**
- Une équipe qui se respecte et se dit les choses directement
- Un projet ambitieux avec les ressources d'un early-stage
- Un environnement où tu peux apprendre vite et avoir de l'impact immédiat

---

## 2. Nos valeurs (3, pas 10)

### Impacte mesurable
Chaque décision, chaque feature, chaque interaction client est évaluée à l'aune d'un impact concret. "C'est cool" n'est pas un critère. "Ça aide le restaurateur à gagner X% sur sa marge" l'est.

### Transparence sans filtre
On partage les chiffres (MRR, churn, runway), les décisions stratégiques, les erreurs. Si quelque chose ne fonctionne pas, on le dit — sans détour, sans drama.

### Autonomie avec responsabilité
Tu n'as pas besoin de permission pour agir dans ton périmètre. En contrepartie, tu es responsable de tes résultats et de la qualité de ton travail. Personne ne micro-manage ici.

---

## 3. Comment on travaille (remote async-first)

### Le principe de base
On est remote 100%. Pas de bureau, pas de jours "obligatoires en présentiel". Tu travailles quand tu es productif, là où tu es productif.

### Asynchrone par défaut
- Les décisions importantes s'écrivent (Notion, GitHub issues, email)
- On ne convoque pas une réunion pour ce qui peut être réglé par un message
- Tout le monde peut lire le contexte d'une décision, même 6 mois plus tard

### Outils et canaux

| Canal | Usage |
|-------|-------|
| **Email** | Tout ce qui est formel, décisions, support client |
| **Notion** | Documentation, roadmap, feedback produit, decisions log |
| **GitHub** | Code, bugs, PRs, ADRs |
| **Loom** | Démos, walkthroughs produit, feedback asynchrone sur des sujets complexes |
| **Téléphone** | Urgences uniquement (Critical bugs, situations client grave) |

### Réunions (rare mais intentionnelles)
- Maximum 2 réunions/semaine par personne
- Durée max 45 minutes avec agenda écrit à l'avance
- Compte-rendu écrit dans Notion dans les 24h

### Disponibilité
- Pas d'obligation de répondre hors horaires (les notifications ne sont pas des urgences)
- Réponse attendue dans la journée ouvrable pour les messages normaux
- Les urgences Critical sont signalées explicitement ("URGENT" dans le sujet)

---

## 4. Compensation et avantages

### Salaires
On pratique la transparence salariale en interne. Les grilles sont dans Notion "Comp & Benefits" (accès sur demande dès le premier jour).

| Rôle | Fourchette |
|------|-----------|
| CS/Onboarding freelance | 400–500 €/j (1 200–1 500 €/mois à 2j/sem) |
| Dev Senior (freelance) | 550–700 €/j |
| Dev Senior (CDI) | 55–70 k€ brut/an |
| BDM HoReCa | 40–50 k€ fixe + 20–30 k€ variable OTE |

### Equity (BSPCE)
- Pool cible : 10% post-seed
- Profils CDI après 6 mois + PMF validé : éligibles
- Vesting : 4 ans, cliff 1 an
- Setup via avocat startup (Aumans ou Bignon Lebray)

### Avantages (à date de rédaction — évolue avec la croissance)

**Actifs maintenant :**
- Remote 100%
- Cas pratique d'embauche rémunéré 150 €
- Budget équipement à l'arrivée : 500 €
- Formations (livres, conférences) : défrayées sur justificatif, ~1 000 €/an

**Dès le premier CDI :**
- Mutuelle Alan (45 €/mois employeur)
- Prévoyance cadre
- Tickets Swile 100 €/mois (60% employeur)
- 25 jours de CP + 10 RTT (forfait jours)

---

## 5. Sécurité et confidentialité

### Règles de base (non-négociables)

1. **Jamais de credentials dans le code** — pas de clés API, tokens, passwords dans les commits
2. **Mots de passe uniques par service** — utiliser un gestionnaire (Bitwarden recommandé)
3. **2FA activé** partout : GitHub, Vercel, Supabase, Stripe, email
4. **RGPD** : les données clients ne quittent jamais la stack RestauMargin (Supabase EU, Vercel EU)

### Données clients
Les données de nos clients (recettes, prix, marges) sont confidentielles. On n'en parle pas en public, on ne les utilise pas pour autre chose que le service.

### Incident sécurité
Si tu découvres une faille ou une fuite de données : email immédiat à youssef@restaumargin.com avec "SÉCURITÉ" en sujet. On traite dans l'heure.

---

## 6. Feedback et communication directe

### La règle d'or
Si quelque chose ne fonctionne pas — dans le produit, dans l'organisation, dans une collaboration — on le dit directement à la personne concernée. Pas de triangulation, pas de non-dits.

### Feedback entre membres de l'équipe
- Feedback positif : public (Notion, email commun) — ça fait du bien à tout le monde
- Feedback constructif : en privé, direct, avec exemple concret
- Désaccord stratégique : en écrit pour avoir le temps de réfléchir avant de répondre

### Feedback au fondateur
Youssef accueille le feedback direct sur le produit, sur les décisions, sur l'organisation. Un désaccord bien argumenté est toujours mieux qu'un silence.

---

## 7. Apprentissage et développement

### Principe
On bloque du temps pour apprendre. Viser 4h/semaine (environ 10% du temps) sur des sujets qui améliorent ton travail chez RestauMargin.

### Budget formation
- Livres : remboursés sur justificatif (pas de limite raisonnable)
- Cours en ligne (Udemy, Frontend Masters, etc.) : remboursés sur justificatif
- Conférences : cas par cas, budget à discuter à l'avance

### Partage des apprentissages
Après une conférence ou une formation significative : un Loom ou un doc Notion de 10 minutes pour partager les 3 points les plus utiles. Optionnel mais apprécié.

---

## 8. Onboarding (tes 30 premiers jours)

### Semaine 1 : Comprendre
- Lire ce handbook complet
- Lire les 5 SOPs (docs/sops/)
- Explorer le produit en profondeur (créer un compte fictif, tester tous les flows)
- 1h de session fondateur pour comprendre la vision et les priorités

### Semaine 2 : Contribuer
- Première tâche réelle (petite, bien délimitée)
- Accès aux outils nécessaires (Notion, GitHub, Vercel si pertinent)
- Poser des questions — beaucoup. Il n'y a pas de question idiote en onboarding.

### Jour 30 : Premier check-in
- Feedback mutuel (ce qui marche, ce qui ne marche pas)
- Ajustement de la mission si nécessaire
- Clarification des attentes pour les 60 jours suivants

---

## 9. Ce qu'on ne fait pas (culture)

- **Pas de réunions sans agenda** : si tu ne sais pas pourquoi tu es convoqué, demande avant d'accepter
- **Pas de "busy work"** : si une tâche ne sert à rien de concret, dis-le
- **Pas de hiérarchie performative** : tout le monde peut contester une décision par arguments
- **Pas de "on a toujours fait comme ça"** : les SOPs sont faites pour être améliorées
- **Pas de bullshit** : ni dans la communication interne, ni dans la communication clients

---

## 10. Quitter RestauMargin

Si tu décides de partir, on s'attend à :
- Un préavis raisonnable pour organiser la transition (2 semaines minimum pour les freelances)
- Une documentation de ce que tu fais (knowledge transfer)
- Un exit interview pour comprendre ce qui n'a pas fonctionné

On ne brulenera pas les ponts. Le SaaS est petit, l'écosystème est encore plus petit.

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** Youssef Guessous, Fondateur  
**Feedback :** Envoyer à youssef@restaumargin.com avec "[Handbook]" en sujet
