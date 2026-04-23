# RestauMargin — Vision Document
**Version** : 1.0 — 2026-04-23
**Author** : Youssef Guessous, Founder

---

## Mission

Donner à chaque restaurateur indépendant le même accès aux données de marge que les grands groupes — en 2 minutes, sur mobile, sans comptable.

---

## Vision 5 ans (horizon 2031)

RestauMargin devient l'**Operating System financier de la restauration indépendante francophone** : la plateforme depuis laquelle un chef décide ses prix, gère ses coûts matières, anticipe ses marges et pilote son resto — augmentée par une équipe d'agents IA disponibles 24h/24.

En 2031 :
- **10 000 restaurants actifs** sur la plateforme (France + Belgique + Québec)
- **30% de réduction moyenne des pertes food cost** documentée par nos clients
- **3 verticaux dominés** : pizzerias indépendantes, brasseries tradition, food trucks
- **Hardware kit vendu à 5 000 unités** (station tablette + balance BT + imprimante ticket)
- **Partenariats data** avec 2 grossistes majeurs (mercuriale temps réel intégrée)

---

## Pourquoi RestauMargin — le problème

**60% des restaurants indépendants français n'ont aucun outil de suivi food cost.** Ils gèrent leurs marges avec Excel ou de mémoire.

Résultat :
- Le food cost moyen en restauration est de 30-35%. Avec un suivi rigoureux il descend à 25-28% — soit **+5 points de marge nette** sur un resto qui fait 500k€ de CA.
- 1 restaurant sur 3 ferme dans les 3 premières années. La principale cause ? Les marges non maîtrisées.
- Les outils existants (Koust, Inpulse) coûtent 200-400€/mois et nécessitent une formation de plusieurs heures. Trop cher, trop complexe pour l'indépendant.

**Le marché est sous-digitalisé, pas sous-servi.** Il manque un outil conçu pour un chef qui a les mains dans la pâte, pas pour un contrôleur de gestion.

---

## Pourquoi maintenant

Trois tailwinds convergents en 2026 :

1. **Inflation matières premières** : +12% sur les produits alimentaires en 2025 (INSEE). Les restos cherchent activement à comprendre leurs coûts — urgence commerciale réelle.
2. **Réglementation HACCP renforcée** : traçabilité obligatoire = ouverture pour digitaliser les process en même temps.
3. **LLMs performants accessibles** : Claude Sonnet 4 permet de construire un "analyste financier IA" dans un outil mobile pour moins de 0,05€/action. Ce n'était pas possible avant 2024.

---

## Pourquoi Youssef — le founder

Youssef est un builder qui code son propre levier d'exécution. En solo, il a déployé :
- **60+ pages produit** en stack React/Vite/Supabase/Vercel — en moins de 3 mois
- **16 Cloud Routines IA** autonomes (CEO/CTO/CFO/CMO digests, bug-fixer, seo-writer, feature-builder) — équivalent de 3-5 ETP junior à budget zéro
- **Hardware kit R&D** (tablette + balance BT K2 Pro printer) — différenciateur physique que les concurrents purs-SaaS ne peuvent pas copier rapidement
- **Infrastructure knowledge management** mature (CLAUDE.md, MEMORY.md, lessons.md) — rare chez les early-stage founders

Ce n'est pas un founder qui attend d'avoir les ressources pour exécuter. Il transforme les contraintes (solo, bootstrap) en moat (agents IA, vitesse d'itération, coût fixe < 50€/mois).

**La prochaine étape critique : prouver qu'il sait vendre autant qu'il sait construire.** C'est l'enjeu des 90 jours.

---

## Narrative : "Agency IA pour restos"

Le cadre différenciant de RestauMargin n'est pas "logiciel de marge". C'est une **Agency IA embarquée** dans un outil SaaS :

- L'IA analyse les fiches techniques et suggère les ajustements de prix en temps réel
- L'IA détecte les anomalies food cost (un plat dont le coût a dérivé de 8% sur 30 jours)
- L'IA génère des recettes optimisées selon les contraintes de marge du chef
- L'IA rédige les textes menu, traduit, adapte aux allergènes
- L'IA brieffe le chef le lundi matin : "Ton food cost semaine est à 31,2%. Voici 3 plats à reprioter."

Aucun concurrent n'a aujourd'hui ce niveau d'intégration IA dans la restauration indépendante francophone.

---

## Marché adressable

| Segment | Taille | Commentaire |
|---|---|---|
| TAM — Restauration indépendante francophone | 193 000 restaurants | France (175k) + Belgique + Québec |
| SAM — Indépendants avec >1 salarié, CA >200k€ | 65 000 restaurants | Capacité à payer 29-79€/mois |
| SOM — Pizzerias + brasseries + food trucks FR | 18 000 restaurants | Vertical initial, verticalement dominable |

**Revenus potentiels SOM à 10% de pénétration** : 18 000 × 10% × 50€ ARPU = **900k€ MRR / 10,8M€ ARR**

---

## Positionnement

| | RestauMargin | Koust | Inpulse | Excel |
|---|---|---|---|---|
| Prix/mois | 29-79€ | 200-400€ | 150-300€ | 0€ |
| IA intégrée | Oui (19 actions) | Basique | Basique | Non |
| Mobile-first | Oui (PWA) | Non | Non | Non |
| Hardware kit | Oui (R&D) | Non | Non | Non |
| Hors-ligne | Oui | Non | Non | Oui |
| Onboarding | <2h (cible) | >1 semaine | >3 jours | 0 |

---

## North Star (3 ans)

**100 000 décisions pricing prises par des restaurateurs grâce à RestauMargin d'ici 2028.**

Mesurée par : `price_decision_made` events Supabase — 1 event = 1 chef qui a modifié un prix de vente ou validé une fiche technique après consultation IA.

---

## Valeurs

**Simple avant complet.** Un chef ne lit pas une notice. L'outil doit s'apprendre en 10 minutes.

**Honnête sur les chiffres.** Les données de marge sont brutales. On ne les embellit pas.

**Rapide à valeur.** Le "aha moment" (voir sa vraie marge sur un plat) doit arriver dans les 15 premières minutes.

**Terrain avant bureau.** Toute décision produit est validée par un vrai chef dans une vraie cuisine. Pas par des personas.

---

*Ce document est versionné dans le repo Git. Mise à jour minimum trimestrielle. Dernière update : 2026-04-23.*
