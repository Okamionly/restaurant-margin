# CTO Audit — 2026-10-31

## Santé globale : 🟢 VERT

### Services (production)
| Service    | État |
|------------|------|
| database   | ✅ ok |
| ai         | ✅ ok (`claude-sonnet-4-6`) |
| api        | ✅ ok |

### CI (dernière exécution sur main)
- **Run #1332** — `CI` → ✅ **success**
- Commit : `763e54b` — _cmo: post + analyse 2026-10-31_
- Date : 2026-10-31 07:12 UTC

---

## Métriques

| Indicateur            | Valeur    |
|-----------------------|-----------|
| Pages (client/src/pages/) | 185    |
| LOC TypeScript totaux | ~233 000  |
| Lignes api/index.ts   | 7 817     |
| Commits 24h           | 3         |
| TODO / FIXME / HACK   | 0         |

---

## 20 derniers commits

```
763e54b cmo: post + analyse 2026-10-31
db97234 ceo: digest quotidien
233d450 cfo: analyse quotidienne 2026-10-30
a2789d3 qa: tests quotidiens 2026-10-24
dedca6e cfo: analyse quotidienne
15a0f31 cto: audit quotidien
11f224f cmo: post + analyse 2026-10-24
f7fd33d ceo: digest quotidien
d16bc12 qa: tests quotidiens
47f3ce9 cfo: analyse quotidienne
f83fdc1 cto: audit quotidien
1576202 coo: operations
3cc29b6 docs: bug-fixer log 2026-10-17
e6e6e76 fix: alert() → toast dans AdminDashboard
03fcd2a docs(seo): rapport quotidien 2026-10-17
3b3c823 perf(seo): retire l'@import Google Fonts bloquant du CSS global
0ff04b0 cmo: post + analyse
242da42 ceo: digest quotidien
0056f72 qa: tests quotidiens 2026-10-16
2aa1dba cfo: analyse quotidienne
```

---

## Dette technique — Top 3

### 1. `api/index.ts` — fichier monolithique (7 817 lignes)
**Risque : ÉLEVÉ.** Un seul fichier concentre toute la logique backend. Tout incident dans ce fichier affecte l'intégralité de l'API. Les routes sont déjà partiellement extraites (`api/routes/`), mais la masse principale reste dans `index.ts`.
- Action : découper en modules par domaine fonctionnel (auth, ingredients, recipes, users, billing…)
- Priorité : sprint suivant

### 2. Volume de pages sans tests automatisés (185 pages)
**Risque : MOYEN.** La CI compile mais ne couvre pas les régressions UI. Les 185 pages représentent un périmètre vaste pour les modifications transversales (thème, routing, composants partagés). Une régression silencieuse est plausible.
- Action : ajouter des smoke tests Playwright sur les pages critiques (Dashboard, Ingredients, MenuEngineering)
- Priorité : moyen terme

### 3. Dette documentaire silencieuse (0 TODO/FIXME)
**Risque : FAIBLE–MOYEN.** L'absence totale de marqueurs peut signifier soit une codebase propre, soit une dette non documentée. Compte tenu de la taille (~233k LOC), les deux hypothèses coexistent probablement.
- Action : revue manuelle des hot spots (api/index.ts, composants à fort usage)
- Priorité : basse

---

## Refactorisation prioritaire

**`api/index.ts` → modules routes**

Extraire les groupes fonctionnels restants dans `api/index.ts` vers des fichiers séparés dans `api/routes/`. Le pattern est déjà établi (mercuriale.ts, auth.ts, ai.ts). Il suffit de l'appliquer systématiquement aux ~7 000 lignes restantes. Gain : lisibilité, testabilité, réduction du risque d'incident sur l'ensemble de l'API.

---

## Statut CI détaillé (10 derniers runs sur main)

Tous les runs listés sont `completed/success`. Aucun run rouge détecté.

---

_Rapport généré automatiquement — 2026-10-31_
