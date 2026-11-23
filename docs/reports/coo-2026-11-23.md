# Rapport COO — 2026-11-23

**Exécuté le** : 2026-11-23 10:14 UTC  
**Statut global** : ⚠️ RÉGRESSION API (login 500 → 401)

---

## 1. Santé des services

| Service | Statut | Détail |
|---------|--------|--------|
| API | ✅ ok | responseTime 1178ms |
| Base de données | ✅ ok | PostgreSQL (Supabase) |
| IA | ✅ ok | claude-sonnet-4-6 |

---

## 2. Données produit (snapshot)

| Métrique | Valeur |
|----------|--------|
| Utilisateurs totaux | 21 |
| Nouveaux 24h | 0 |
| Nouveaux 48h | 0 |
| Recettes créées | 64 |
| Ingrédients | 442 |
| Abonnés pro | 0 |
| Abonnés business | 0 |
| MRR estimé | 0 € |

---

## 3. CI — Derniers commits sur `main`

| SHA | Message | CI |
|-----|---------|-----|
| 26b1af1 | cmo: post + analyse | ✅ success |
| b3a6d45 | mrr: rapport hebdo | ✅ success |
| 942fbf9 | ceo: digest quotidien | ✅ success |
| 0a4ce9e | qa: tests quotidiens 2026-11-22 | ✅ success |
| f8c6804 | cfo: analyse quotidienne | ✅ success |

---

## 4. GitHub Actions — crons.yml (6 derniers)

| Date | Événement | Conclusion |
|------|-----------|-----------|
| 2026-11-23T07:58Z | schedule | ✅ success |
| 2026-11-23T02:46Z | schedule | ✅ success |
| 2026-11-22T20:43Z | schedule | ✅ success |
| 2026-11-22T19:53Z | schedule | ✅ success |
| 2026-11-22T17:42Z | schedule | ✅ success |
| 2026-11-22T14:57Z | schedule | ✅ success |

**Résultat** : ✅ 6/6 passages réussis

---

## 5. Agents — État des rapports

| Agent | Dernier rapport | Statut |
|-------|----------------|--------|
| CTO | il y a ~20h | ✅ OK |
| CMO | il y a ~2h | ✅ OK |
| CFO | il y a ~17h | ✅ OK |
| QA | il y a ~14h | ✅ OK |

Aucun agent en panne.

---

## 6. Régression active (signalée par QA le 2026-11-22)

**POST /api/auth/login** avec identifiants incorrects retourne **500** au lieu de **401**.

- Comportement attendu : `401 Unauthorized`
- Comportement actuel : `500 Internal Server Error`
- Impact : UX dégradée (message d'erreur générique), potentiel masquage d'une erreur serveur dans le handler d'authentification
- Priorité : HAUTE — à corriger aujourd'hui

---

## 7. Actions du jour

1. **[URGENT] Corriger la régression login** — Le endpoint `POST /api/auth/login` lève une erreur serveur au lieu de retourner 401 sur mauvais credentials. Vérifier le handler dans `api/routes/auth.ts`, vraisemblablement un try/catch manquant ou une exception non gérée sur la comparaison bcrypt/token.

2. **[SUIVI] Temps de réponse API** — 1178ms au health check, légèrement élevé. Pas critique mais à surveiller. Si la tendance monte, investiguer les queries Prisma.

3. **[CROISSANCE] Zéro nouvel utilisateur en 24h** — 21 utilisateurs totaux, 0 payant. Coordonner avec CMO pour relancer une action d'acquisition (SEO, contenu, outreach) ; l'essai 7 jours sans CB est l'entrée de funnel à activer.
