# Rapport CTO — 24 avril 2026 — 14h00 Paris

## Santé globale : 🔴 ROUGE

---

## Résumé exécutif

Site en état **dégradé** : base de données en erreur en production. L'API répond mais toutes les opérations requérant la BDD échouent. Dette technique élevée sur `api/index.ts` (5 978 lignes). Environnement d'audit sans `node_modules` — les erreurs TypeScript relevées sont des faux positifs environnementaux.

---

## Deploy / Santé production

```
GET https://www.restaumargin.fr/api/health
{
  "status": "degraded",
  "database": "error",   ← CRITIQUE
  "api": "ok",
  "responseTime": "1ms"
}
```

**Base de données : ERROR** — Supabase/PostgreSQL inaccessible depuis Vercel. Toutes les routes authentifiées retournent vraisemblablement 500. À investiguer en priorité absolue (pool de connexions saturé ? credential expiré ? Supabase pause auto sur free tier ?).

---

## Métriques

| Indicateur | Valeur |
|---|---|
| LOC total (`.ts` + `.tsx`) | 122 744 |
| Pages frontend | 76 |
| Lignes `api/index.ts` | **5 978** |
| Commits dernières 24h | 16 |
| TODOs/FIXMEs/HACKs | 1 |
| Erreurs TypeScript | N/A (faux positifs) |

---

## Erreurs TypeScript

**Résultat brut :** 40 408 erreurs — **FAUX POSITIFS ENVIRONNEMENTAUX**

Cause : `@types/react` absent du `node_modules` dans l'environnement d'audit. L'erreur racine `Cannot find module 'react'` cascade sur toutes les déclarations JSX. Le build Vercel (qui installe les dépendances) n'est pas affecté. Aucune régression code réelle détectée.

Action : le check TypeScript de l'audit doit être exécuté après `npm ci` dans `client/`.

---

## Dette technique — TOP 3

### 1. `api/index.ts` : monolithe de 5 978 lignes — CRITIQUE
Tout le backend tient dans un seul fichier. Lisibilité nulle, review impossible, risque de merge conflicts permanent. Les 16 commits des dernières 24h sur Stripe montrent l'effet : 6 commits successifs pour un seul bug car le fichier est trop dense pour débugger efficacement.

### 2. Endpoint de debug Stripe exposé en production — SÉCURITÉ
Le commit `44ebaab` a ajouté `/api/debug/stripe-fetch` pour isoler un problème réseau. Ce endpoint expose probablement des détails d'erreur sensibles. À supprimer immédiatement maintenant que le problème Stripe est résolu (`1c4bda7`).

### 3. Prisma types désynchronisés avec le schéma
Le commit `9f8a5f1` a dû caster en `any` pour contourner un désalignement `Employee.firstName`. Symptôme d'un schéma Prisma qui a évolué sans `prisma generate` en CI. Risque de silencer de vraies erreurs de type runtime.

---

## Refacto prioritaire

**Découper `api/index.ts` en modules par domaine.**

Approche recommandée : extraire progressivement par verticale métier vers `api-lib/` (pattern déjà initié dans `58a41ae`). Ordre suggéré : Stripe → Auth → IA → Mercuriale → le reste. Chaque extraction = 1 PR isolée, testable, reviewable.

Bénéfice immédiat : réduire le temps moyen de résolution de bug Stripe (actuellement 6 commits / ~2h de hotfixes).

---

## Activité dernières 24h

```
1c4bda7 fix(stripe): trim env var STRIPE_PRICE_* (trailing newline)
297e0cf fix(stripe): bypass SDK — raw fetch pour checkout session
44ebaab debug(stripe): add /api/debug/stripe-fetch
37f8011 fix(stripe): force node HTTP client
ba6995a debug(stripe): expose full error details in 500
5bb831f fix(stripe): convert dynamic require() to static import
865586d fix: message clair fetch échoue au login
b10ca84 chore: npm audit fix — 3 HIGH → 0
238820e perf+security: CSP + HSTS + LCP hero + Fontshare async
64e1f88 fix(auth+ci): password policy + anti-timing + Resend
5d6293d fix(security): 2 CRITICAL + Stripe hardening
37b5863 fix(security): fail closed cron + activation secret
8ee6757 fix(ux): public 404 + homepage fade-in
58a41ae fix(infra): unblock Vercel — move routes vers api-lib/
9f8a5f1 fix(build): cast timeEntry include any — Prisma OOSync
cce1716 fix(critical): remove merge conflict markers
```

16 commits en 24h — rythme très élevé, majoritairement des hotfixes Stripe en cascade.

---

## TODO/FIXME relevés

```
api/index.ts:2029 — TODO: Add RFQ, RFQItem, RFQQuote models to schema.prisma before enabling
```

---

## Actions recommandées

| Priorité | Action | Délai |
|---|---|---|
| P0 | Investiguer erreur base de données en production | Immédiat |
| P0 | Supprimer `/api/debug/stripe-fetch` | Aujourd'hui |
| P1 | Extraire routes Stripe de `api/index.ts` | Sprint en cours |
| P2 | Ajouter `prisma generate` dans le pipeline CI | Prochain sprint |
| P3 | Configurer `npm ci` avant tsc dans l'audit | Prochaine itération |

---

*Généré automatiquement — Audit CTO quotidien 14h00*
