# Guide de Monitoring Production — RestauMargin

> Derniere mise a jour : 2026-04-01

---

## 1. Metriques a surveiller

### 1.1 Uptime & Disponibilite

| Metrique | Source | Seuil critique |
|----------|--------|---------------|
| Uptime site | Vercel Status + UptimeRobot | < 99.5% |
| Endpoint `/api/health` | UptimeRobot (ping toutes les 5 min) | HTTP != 200 |
| Temps de reponse API | `/api/health` responseTime | > 2000ms |

### 1.2 Erreurs

| Metrique | Source | Seuil critique |
|----------|--------|---------------|
| Erreurs 5xx | Vercel Logs / Sentry | > 10/heure |
| Erreurs 4xx (hors 401) | Sentry | > 50/heure |
| Erreurs non capturees (JS client) | Sentry Browser SDK | Toute erreur |

### 1.3 Couts & Usage IA

| Metrique | Source | Seuil critique |
|----------|--------|---------------|
| Credit Anthropic restant | Anthropic Console | < 5$ |
| Tokens consommes / jour | Anthropic Console | > 500k tokens/jour |
| Cout moyen par requete IA | Logs serveur | > 0.10$ / requete |

### 1.4 Utilisateurs

| Metrique | Source | Seuil critique |
|----------|--------|---------------|
| Utilisateurs actifs / jour (DAU) | Supabase SQL ou logs | Chute > 30% |
| Inscriptions / semaine | Supabase `users` table | A suivre |
| Taux erreurs login | Sentry / logs | > 5% |

### 1.5 Base de donnees (Supabase)

| Metrique | Source | Seuil critique |
|----------|--------|---------------|
| Connexions actives | Supabase Dashboard | > 80% du pool |
| Taille DB | Supabase Dashboard | > 400 MB (plan gratuit = 500 MB) |
| Requetes lentes | Supabase Logs (> 1s) | Toute requete > 2s |

---

## 2. Outils gratuits recommandes

### 2.1 UptimeRobot — Monitoring Uptime

- **URL** : https://uptimerobot.com
- **Plan gratuit** : 50 moniteurs, intervalle 5 min
- **Configuration** :
  - Moniteur HTTP(s) sur `https://restaumargin.fr/api/health`
  - Keyword monitor : verifier que la reponse contient `"status":"healthy"`
  - Alerte email sur down

### 2.2 Vercel Analytics — Performance

- **URL** : https://vercel.com/dashboard (projet RestauMargin)
- **Inclus** : Web Vitals (LCP, FID, CLS), visiteurs, fonctions serverless
- **Configuration** : Deja actif par defaut sur le projet Vercel
- **A verifier** : Onglet "Analytics" + "Logs" dans le dashboard Vercel

### 2.3 Sentry — Error Tracking

- **URL** : https://sentry.io
- **Plan gratuit** : 5K erreurs/mois, 1 membre
- **Installation frontend** :
  ```bash
  cd client && npm install @sentry/react
  ```
  ```typescript
  // client/src/main.tsx (en haut du fichier)
  import * as Sentry from '@sentry/react';

  Sentry.init({
    dsn: 'https://VOTRE_DSN@sentry.io/PROJET_ID',
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1, // 10% des transactions
  });
  ```
- **Installation backend** :
  ```bash
  npm install @sentry/node
  ```
  ```typescript
  // api/index.ts (tout en haut)
  import * as Sentry from '@sentry/node';

  Sentry.init({
    dsn: 'https://VOTRE_DSN@sentry.io/PROJET_ID',
    environment: process.env.NODE_ENV || 'production',
  });

  // Avant le dernier app.use(errorHandler)
  Sentry.setupExpressErrorHandler(app);
  ```

### 2.4 Supabase Dashboard — DB Monitoring

- **URL** : https://supabase.com/dashboard
- **Metriques disponibles** : connexions, taille DB, requetes/seconde, logs SQL
- **A verifier** : Onglet "Database" > "Database Health"

### 2.5 Anthropic Console — Usage API

- **URL** : https://console.anthropic.com
- **Metriques** : tokens utilises, cout total, requetes/jour
- **A verifier** : Usage & Billing quotidiennement

---

## 3. Alertes a configurer

### 3.1 UptimeRobot (alertes critiques)

| Alerte | Condition | Action |
|--------|-----------|--------|
| Site down | `/api/health` ne repond pas | Email immediat |
| API degradee | `responseTime > 3000ms` | Email |
| SSL expire | Certificat < 7 jours | Email |

**Configuration** :
1. Creer un compte sur https://uptimerobot.com
2. Ajouter moniteur : `https://restaumargin.fr/api/health`
3. Type : HTTP(s), intervalle : 5 minutes
4. Contact d'alerte : votre email

### 3.2 Sentry (alertes erreurs)

| Alerte | Condition | Action |
|--------|-----------|--------|
| Erreurs 500 en rafale | > 10 erreurs 5xx en 1 heure | Email + notification |
| Nouvelle erreur non vue | Premier evenement d'un type | Email |
| Regression | Erreur resolue reapparait | Email |

**Configuration** :
1. Sentry > Alerts > Create Alert Rule
2. Condition : `event.count() > 10` sur fenetre de 1h
3. Action : envoyer email

### 3.3 Anthropic Console (alertes cout)

| Alerte | Condition | Action |
|--------|-----------|--------|
| Credit bas | Solde < 5$ | Verifier manuellement (pas d'alerte automatique) |
| Consommation anormale | > 2x la moyenne quotidienne | Verifier manuellement |

> Note : Anthropic ne fournit pas d'alertes automatiques. Ajouter une verification quotidienne dans le checklist (section 4).

### 3.4 Supabase (alertes DB)

| Alerte | Condition | Action |
|--------|-----------|--------|
| Connexions saturees | Pool > 80% utilise | Optimiser les queries / augmenter pool |
| Stockage presque plein | DB > 400 MB sur plan gratuit | Nettoyer / upgrader |

> Note : Supabase envoie des emails quand les limites du plan gratuit approchent.

---

## 4. Dashboard de sante — Verification quotidienne

Ouvrir ces URLs chaque matin pour verifier l'etat de la production :

| Service | URL | Quoi verifier |
|---------|-----|---------------|
| RestauMargin Health | `https://restaumargin.fr/api/health` | `status: healthy` |
| UptimeRobot | https://uptimerobot.com/dashboard | Uptime > 99.5%, pas d'incident |
| Vercel | https://vercel.com/dashboard | Deployments OK, pas d'erreur build |
| Vercel Logs | Vercel > projet > Logs | Pas de 5xx recurrents |
| Sentry | https://sentry.io (projet RestauMargin) | 0 erreurs non resolues critiques |
| Supabase | https://supabase.com/dashboard | Connexions < 80%, taille DB OK |
| Anthropic | https://console.anthropic.com | Credit > 5$, usage normal |
| Vercel Status | https://www.vercel-status.com | Tous services operationnels |

### Checklist quotidienne (2 minutes)

- [ ] `/api/health` retourne `healthy`
- [ ] UptimeRobot : pas d'incident dans les 24h
- [ ] Sentry : pas de nouvelle erreur critique
- [ ] Supabase : connexions et stockage normaux
- [ ] Anthropic Console : credit suffisant (> 5$)

---

## 5. Endpoint `/api/health`

Un endpoint de health check a ete ajoute a l'API. Il verifie :

- **Statut API** : le serveur Express repond
- **Statut DB** : une requete `SELECT 1` reussit sur PostgreSQL (Supabase)
- **Temps de reponse** : mesure en millisecondes

**Reponse type** :
```json
{
  "status": "healthy",
  "timestamp": "2026-04-01T10:00:00.000Z",
  "uptime": 86400,
  "responseTime": "45ms",
  "services": {
    "database": "ok",
    "api": "ok"
  }
}
```

**Reponse degradee** (HTTP 503) :
```json
{
  "status": "degraded",
  "services": {
    "database": "error",
    "api": "ok"
  }
}
```

---

## 6. Etapes de mise en place (par priorite)

1. **Immediat** (10 min) : Creer un compte UptimeRobot et monitorer `/api/health`
2. **Jour 1** : Creer un compte Sentry gratuit, installer le SDK frontend
3. **Jour 2** : Installer le SDK Sentry backend + configurer les alertes erreurs
4. **Jour 3** : Configurer la checklist quotidienne (bookmark les 7 URLs)
5. **Semaine 2** : Ajouter un dashboard Vercel Analytics si pas encore actif
6. **Ongoing** : Verifier le credit Anthropic chaque lundi

---

## References

- Guide de monitoring Claude Code ROI : `SKILL FOR CLAUDE/claude-code-monitoring-guide/`
- Vercel Documentation : https://vercel.com/docs
- Sentry pour Express : https://docs.sentry.io/platforms/node/guides/express/
- UptimeRobot : https://uptimerobot.com/help
- Supabase Monitoring : https://supabase.com/docs/guides/platform/metrics
