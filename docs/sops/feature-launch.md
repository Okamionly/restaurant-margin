# SOP · Lancement feature

**Trigger :** Feature validée en staging, prête pour production  
**Qui :** Fondateur (product decision) + Dev Senior (implementation) + CS (communication client)  
**Timing :** Lundi ou mardi (éviter vendredi) · hors période de fermeture (août, Noël)  
**Outputs :** Feature live, clients informés, métriques baseline enregistrées

---

## Checklist pré-lancement

### Semaine -1 : Validation

- [ ] Feature testée en staging par le fondateur (scénario utilisateur complet)
- [ ] Feature testée par 1 client beta (si disponible)
- [ ] Edge cases identifiés et gérés (ou documentés comme known limitations)
- [ ] Textes UI relus (pas de fautes, langage clair pour un restaurateur)
- [ ] Mobile responsive vérifié (Samsung Tab A9+ = tablette cible)
- [ ] Dark mode vérifié

### Semaine -1 : Préparation communication

- [ ] Rédiger le changelog (1 paragraphe, langage restaurateur, pas dev)
- [ ] Screenshot ou courte démo vidéo (Loom 90 secondes max)
- [ ] Email annonce rédigé et pre-schedulé dans Resend

### J-0 : Deploy (suivre SOP deploy.md)

- [ ] Merge sur main
- [ ] Vérifier que la feature est visible en prod
- [ ] Sanity check flows critiques

### J+0 : Communication

**Email clients (template) :**

```
Sujet : [RestauMargin] Nouveau : [Nom feature en langage simple]

Bonjour [Prénom],

On vient de lancer [nom de la feature] — une fonctionnalité qui
vous permet de [bénéfice concret en 1 phrase].

[Screenshot ou GIF]

Pour y accéder : [lien direct vers la page]

Si vous avez des questions ou des retours, répondez directement
à cet email — je lis tout.

Bonne journée,
Youssef
```

- [ ] Email envoyé aux clients actifs (pas aux trials inactifs)
- [ ] Post LinkedIn (optionnel, si feature différenciante)

### J+7 : Mesure d'impact

Enregistrer dans Notion "Feature Metrics" :

- Taux d'adoption J+7 (% clients actifs qui ont utilisé la feature)
- Feedback qualitatif reçu (citations clients)
- Bugs ou edge cases remontés
- Décision : itérer, laisser tel quel, ou dépréc­ier

---

## Critères d'une feature "prête à lancer"

Une feature est prête quand :
1. Le fondateur l'a utilisée pendant 30 min sans documentation
2. Un restaurateur non-technique peut la prendre en main seul en < 5 min
3. L'API retourne les bons status codes (200, 400, 401, 404, 500)
4. Elle ne casse aucun test existant

Une feature n'est PAS prête si :
- Elle a des "TODO" dans le code
- Elle n'a pas de message d'erreur compréhensible pour l'utilisateur
- Elle n'est pas accessible sans JavaScript activé (SEO et accessibilité)

---

## Feature flags (pour lancements progressifs)

Pour les features à fort risque (changement billing, nouveau mode auth) :
- Activer d'abord pour 10% des clients (feature flag en DB ou env var)
- Monitorer 48h
- Puis 100% si aucun incident

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** Youssef Guessous
