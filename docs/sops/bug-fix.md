# SOP · Bug fix

**Trigger :** Bug reporté par client, détecté en monitoring, ou découvert en interne  
**Qui :** Fondateur ou Dev Senior  
**Timing :** Critical = 2h · High = 24h · Medium = sprint suivant · Low = backlog  
**Outputs :** Fix déployé, client notifié si impacté, post-mortem si critique

---

## Étapes

### 1. Triage (15 min max)

Classer immédiatement par sévérité :

| Niveau | Critères | SLA réponse |
|--------|----------|-------------|
| **Critical** | Data loss, auth cassée, billing KO, app inaccessible | 2h |
| **High** | Feature majeure KO pour un segment de clients | 24h |
| **Medium** | Feature dégradée, workaround possible | Sprint suivant |
| **Low** | UI glitch, typo, amélioration UX | Backlog |

### 2. Reproduction (ne pas fixer ce qu'on n'a pas reproduit)

```bash
# Checkout sur un environnement isolé si possible
git checkout -b fix/nom-du-bug

# Reproduire avec les données du client (en anonymisant si possible)
# Logger les steps exacts qui déclenchent le bug
```

- [ ] Bug reproduit en local ?
- [ ] Scope identifié (1 client ? tous les clients ? 1 route ?)
- [ ] Root cause hypothèse écrite en 1 phrase

### 3. Fix

- [ ] Écrire un test qui reproduit le bug avant de fixer (si < 30 min d'effort)
- [ ] Fix minimal — ne pas profiter d'un bug fix pour refactorer
- [ ] Review du fix par une seconde paire d'yeux (ou auto-review à froid 1h après)

```bash
npm test  # Tests doivent passer
npm run build  # Build doit passer
```

### 4. Deploy (suivre SOP deploy.md)

- PR avec titre : `fix: description courte du bug [CRITICAL|HIGH|MEDIUM|LOW]`
- Merge immédiat pour CRITICAL (pas besoin de review en binôme)
- Deploy via Vercel (automatique sur merge main)

### 5. Vérification post-deploy

- [ ] Reproduire le bug sur la prod → le bug est corrigé
- [ ] Aucun nouveau bug introduit (sanity check des 5 flows critiques)
- [ ] Client impacté notifié : email proactif si CRITICAL ou HIGH

### 6. Post-mortem (pour les Critical uniquement)

Ajouter dans `docs/health-reports/` un fichier `postmortem-YYYY-MM-DD-nom-bug.md` :

```markdown
## Post-mortem · [Titre du bug] · [Date]

**Durée :** Détection à résolution (ex: 3h)
**Impact :** N clients impactés, fonctionnalité X indisponible
**Root cause :** [1 phrase claire]
**Timeline :** [heure] → [action]
**Fix appliqué :** [description]
**Actions préventives :** [tests ajoutés, monitoring amélioré, SOP mise à jour]
```

### 7. Apprentissage

- [ ] Ajouter le pattern dans `tasks/lessons.md`
- [ ] Ajouter un test de non-régression si pas encore fait
- [ ] Mettre à jour le monitoring si le bug aurait pu être détecté plus tôt

---

## Outils de debug rapide

```bash
# Logs Vercel en temps réel
vercel logs --follow

# Check DB Supabase
# Dashboard → Database → SQL Editor

# Test API localement
curl -X GET http://localhost:3001/api/health \
  -H "Authorization: Bearer <token>"
```

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** Youssef Guessous / Dev Senior
