# RestauMargin — Processus d'entretien

> 4 étapes · Durée totale : 2–3 semaines · Réponse sous 3 jours ouvrés à chaque étape

---

## Principes fondamentaux

1. **Pas de test gratuit** : tout cas pratique est rémunéré (150 €)
2. **Feedback à tous les candidats** : même ceux qu'on ne retient pas
3. **Pas de piège** : on dit aux candidats exactement ce qu'on évalue
4. **Réciproque** : le candidat juge aussi RestauMargin — on répond à toutes ses questions
5. **Décision rapide** : pas de "on vous tient informé" pendant 3 semaines

---

## Étape 1 · Screen fondateur (30 min · Visio)

**Objectif :** Vérifier l'alignement de base sur la mission, le contexte, et les attentes mutuelles.

**Ce qu'on évalue :**
- Curiosité pour le secteur restauration
- Compréhension de ce qu'est un early-stage SaaS
- Clarté sur les motivations (pas besoin d'amour inconditionnel — une raison concrète suffit)
- Questions pertinentes du candidat (un candidat qui ne pose pas de questions est un signal)

**Ce qu'on ne fait pas :**
- Pas de questions pièges ("Où vous voyez-vous dans 5 ans ?")
- Pas d'évaluation des "soft skills" sur des hypothèses

**Structure :**
- 5 min : contexte RestauMargin (le vrai, pas le pitch)
- 15 min : parcours candidat — 2–3 expériences récentes pertinentes
- 10 min : questions du candidat

**Décision :** Go/No-go communiqué dans les 48h

---

## Étape 2 · Cas pratique async rémunéré (150 € · 3–4h de travail)

**Objectif :** Voir le candidat travailler, pas parler de son travail.

**Rémunération :** 150 € virés dans les 5 jours ouvrés après remise du cas, qu'on retienne le candidat ou non.

### Cas CS / Onboarding

**Contexte fourni :**
- 1 persona restaurateur fictif avec son profil métier
- Accès à un compte RestauMargin de démo
- 1 email de support fictif avec un problème

**Livrable attendu :**
1. Un plan d'onboarding écrit pour ce restaurateur (qui explique ce qu'on ferait en visio)
2. Une réponse rédigée à l'email de support
3. 3 points de friction produit identifiés pendant la prise en main

**Critères d'évaluation :**
- Clarté et empathie de l'écrit
- Compréhension du métier restaurateur
- Identification de vrais problèmes (pas de surface)

### Cas Dev Senior

**Contexte fourni :**
- Extrait de 150–200 lignes du monolithe `api/index.ts` (réel, anonymisé)
- Description de la feature implémentée dans cet extrait

**Livrable attendu :**
1. Refactoring de l'extrait en module(s) séparés avec les interfaces TypeScript
2. 1 test unitaire sur la fonction la plus critique
3. Un court doc (1 page) expliquant les choix architecturaux

**Critères d'évaluation :**
- TypeScript strict (pas de `any` non justifié)
- Lisibilité pour un futur dev qui arrive sans contexte
- Justification des choix, pas juste du code

---

## Étape 3 · Session live (1h)

### Pour les profils CS : Simulation d'onboarding

- Le candidat onboarde Youssef comme si c'était un nouveau client
- Youssef joue le restaurateur avec des questions réalistes
- Évaluation : capacité à guider sans être condescendant, à gérer les blocages, à écouter vraiment

### Pour les profils Dev : Pair-programming

- Session sur la vraie codebase (accès temporaire)
- 1 bug identifié à l'avance, fourni avec les logs
- Candidat et Youssef résolvent ensemble
- Évaluation : processus de debugging, communication pendant le code, questions posées

**Ce qu'on évalue dans les deux cas :**
- Capacité à travailler avec quelqu'un sans stress artificiel
- Réaction face à l'ambiguïté ou à l'information manquante
- Fit de communication (direct, pas condescendant, curieux)

---

## Étape 4 · Culture-fit avec advisor (30–45 min)

**Objectif :** Une perspective externe sur le candidat, et donner au candidat une perspective externe sur RestauMargin.

**Format :**
- Entretien avec un membre de l'advisor board (fondateur SaaS ou restaurateur selon le profil)
- Questions ouvertes sur les valeurs, la façon de travailler, les désaccords passés
- Le candidat peut poser des questions sur la culture RestauMargin vue de l'extérieur

**Ce qu'on évalue :**
- Alignement sur les valeurs (transparence, autonomie, impact)
- Capacité à gérer le désaccord constructif
- Curiosité au-delà du périmètre immédiat du poste

---

## Décision finale

- Décision dans les 72h après l'étape 4
- Offre verbale d'abord, puis écrite
- Négociation possible — on n'est pas figés sur les fourchettes pour le bon candidat
- Si refus : feedback honnête en 3 points (pas "vous n'êtes pas le bon profil")

---

## Scorecard · Template (à copier dans Notion pour chaque candidat)

```markdown
## Candidat : [Nom]
## Poste : [CS / Dev Senior]
## Date : [YYYY-MM-DD]
## Évaluateur : [Prénom]

### Étape 1 · Screen
- Alignement mission (1–5) : ___
- Curiosité métier (1–5) : ___
- Qualité des questions posées (1–5) : ___
- Notes : ___
- Décision : Go / No-go

### Étape 2 · Cas pratique
- Qualité du livrable (1–5) : ___
- Compréhension du contexte (1–5) : ___
- Autonomie démontrée (1–5) : ___
- Notes : ___
- Décision : Go / No-go

### Étape 3 · Session live
- Compétence technique/métier (1–5) : ___
- Collaboration sous pression (1–5) : ___
- Communication (1–5) : ___
- Notes : ___
- Décision : Go / No-go

### Étape 4 · Culture-fit
- Alignement valeurs (1–5) : ___
- Gestion du désaccord (1–5) : ___
- Curiosité hors périmètre (1–5) : ___
- Notes : ___
- Décision : Go / No-go

### Score global : ___/20
### Recommandation finale : Offre / Refus / En attente
### Salaire proposé : ___
### Equity proposé (si applicable) : ___
### Date d'entrée visée : ___
```

---

## Canaux de sourcing

| Canal | Usage | Coût |
|-------|-------|------|
| Welcome to the Jungle | Offre publiée (1 gratuite) | Gratuit |
| LinkedIn | Post fondateur + connexions ciblées HoReCa/SaaS | Gratuit |
| France Digitale | Réseau startups FR | Gratuit |
| Les Pionniers | Communauté entrepreneurs tech | Gratuit |
| Slack HoReCa Tech | Pour le profil CS | Gratuit |
| Referrals advisor board | Meilleur canal pre-seed | Gratuit |

**Note :** Pas d'ATS pour l'instant (<5 recrutements/an). Pipeline géré dans Notion "Hiring Pipeline".

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** Youssef Guessous
