# Rapport QA — 2026-04-23

**Heure** : 20h00 Paris  
**Statut global** : ❌ RÉGRESSION DÉTECTÉE

---

## 1. Tests HTTP (7/15 pages OK)

| Code | URL |
|------|-----|
| ✅ 200 | /login |
| ✅ 200 | /blog/calcul-marge-restaurant |
| ✅ 200 | /temoignages |
| ✅ 200 | /station-produit |
| ✅ 200 | /reactivation |
| ✅ 200 | /guide-marge/pizzeria |
| ✅ 200 | /guide-marge/brasserie |
| ❌ 503 | / |
| ❌ 503 | /pricing |
| ❌ 503 | /demo |
| ❌ 503 | /a-propos |
| ❌ 503 | /blog |
| ❌ 503 | /outils/calculateur-food-cost |
| ❌ 503 | /mentions-legales |
| ❌ 503 | /cgv |

**Pages OK : 7/15**  
**Pages en erreur 503 : 8/15**

Pages critiques impactées : `/` (homepage), `/pricing`, `/blog`, `/outils/calculateur-food-cost`, `/mentions-legales`, `/cgv`

---

## 2. Tests API

| Endpoint | Attendu | Obtenu | Statut |
|----------|---------|--------|--------|
| GET /api/health | 200 | 503 | ❌ |
| POST /api/auth/login (mauvais credentials) | 401 | 401 | ✅ |

**Note** : L'API health retourne 503 — le serveur backend est probablement down ou en surcharge.

---

## 3. Build TypeScript

**Statut** : ❌ ERREURS

```
src/App.tsx(1,61): error TS2307: Cannot find module 'react' or its corresponding type declarations.
src/App.tsx(2,76): error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.
src/App.tsx(3,487): error TS2307: Cannot find module 'lucide-react' or its corresponding type declarations.
src/App.tsx(129,51): error TS2503: Cannot find namespace 'React'.
src/App.tsx(134,12): error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
```

Cause probable : dépendances node_modules manquantes ou corrompues (`npm install` requis).

---

## 4. Analyse

- **503 massif** : 8 pages retournent 503, dont la homepage et les pages légales. Indique une panne serveur ou infrastructure (Vercel/Supabase/reverse proxy).
- **API health 503** : confirme que le backend Node.js est inaccessible.
- **Build TS** : erreurs de types manquants liées à l'absence des `@types/*` dans node_modules — environnement CI non installé.

---

## 5. Actions recommandées

1. Vérifier le statut Vercel / hébergeur
2. Redémarrer le service backend si crashé
3. Lancer `npm install` dans `/client` pour restaurer les types
4. Re-déployer si nécessaire
