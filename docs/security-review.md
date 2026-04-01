# Audit de Securite -- RestauMargin

**Date** : 2026-04-01
**Scope** : `api/index.ts`, `server/src/routes/activation.ts`, `.env.example`, `.gitignore`
**Score global : 32 / 100**

---

## Vulnerabilites critiques

### 1. JWT_SECRET hardcode (CRITIQUE -- CVSS 9.8)

**Fichier** : `api/index.ts`, ligne 14

```
const JWT_SECRET = process.env.JWT_SECRET || 'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI';
```

**Risque** : Si `JWT_SECRET` n'est pas defini en variable d'environnement, le fallback hardcode est utilise. Ce secret est visible dans le code source public. Un attaquant peut forger n'importe quel JWT (usurpation admin incluse).

**Fix** :
```typescript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET non defini. Arret du serveur.');
  process.exit(1);
}
```

---

### 2. Backdoor dans activation.ts (CRITIQUE -- CVSS 9.1)

**Fichier** : `server/src/routes/activation.ts`, lignes 23 et 98

```
if (secret !== process.env.ACTIVATION_SECRET && secret !== 'admin') {
```

**Risque** : N'importe qui peut generer des codes d'activation ou lister tous les codes en envoyant `secret: "admin"`. Cela permet la creation gratuite de comptes pro/business sans paiement.

**Fix** :
```typescript
if (secret !== process.env.ACTIVATION_SECRET) {
  return res.status(401).json({ error: 'Non autorise' });
}
```

Supprimer entierement la condition `secret !== 'admin'`.

---

### 3. Stripe Webhook sans verification de signature (CRITIQUE -- CVSS 8.6)

**Fichier** : `api/index.ts`, lignes 23-76

Le webhook Stripe parse le body JSON brut sans verifier la signature `Stripe-Signature`. N'importe qui peut envoyer un faux event `checkout.session.completed` et generer des codes d'activation gratuits.

**Fix** :
```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send('Signature invalide');
  }
  // ... traitement event verifie
});
```

---

### 4. Absence de rate limiting global (ELEVE -- CVSS 7.5)

**Fichier** : `api/index.ts`

Seuls les endpoints IA ont un rate limit basique (en memoire, 10 req/min). Aucun rate limiting sur :
- `/api/auth/login` (brute-force possible)
- `/api/auth/register` (spam de comptes)
- `/api/auth/forgot-password` (email bombing)
- `/api/activation/validate` (brute-force de codes)

**Fix** :
```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Trop de tentatives. Reessayez dans 15 minutes.' }
});
app.post('/api/auth/login', loginLimiter, async (req, res) => { /* ... */ });

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
app.use('/api/', globalLimiter);
```

---

### 5. Absence de security headers (ELEVE -- CVSS 6.5)

**Fichier** : `api/index.ts`

Aucun middleware helmet. Pas de headers : X-Frame-Options, X-Content-Type-Options, Content-Security-Policy, Strict-Transport-Security.

**Fix** :
```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

### 6. Endpoint public expose les donnees restaurant (MOYEN -- CVSS 5.3)

**Fichier** : `api/index.ts`, ligne 1250

```
app.get('/api/public/menu', async (req, res) => {
  const restaurantId = parseInt(req.query.restaurantId as string) || 1;
```

**Risque** : N'importe qui peut enumerer les menus de tous les restaurants en incrementant `restaurantId` (IDOR). Expose les noms de recettes, prix de vente, categories et allergenes.

**Fix** : Utiliser un identifiant public non sequentiel (UUID ou slug) au lieu d'un entier auto-incremente. Ou restreindre aux restaurants qui ont explicitement active le menu public.

---

### 7. Fuite d'information dans les erreurs (MOYEN -- CVSS 4.3)

**Fichier** : `api/index.ts`, ligne 177

```
res.status(500).json({ error: 'Erreur serveur', detail: e.message });
```

**Risque** : Le message d'erreur de la base de donnees est renvoye au client. Cela peut exposer des noms de tables, de colonnes, ou la structure SQL.

**Fix** :
```typescript
console.error('DB Error:', e.message);
res.status(500).json({ error: 'Erreur serveur' });
// Ne JAMAIS envoyer e.message au client en production
```

---

### 8. Politique de mot de passe trop faible (MOYEN -- CVSS 4.0)

**Fichier** : `api/index.ts`, ligne 224

```
if (password.length < 6) return res.status(400).json({ error: 'Min. 6 caracteres' });
```

**Risque** : 6 caracteres sans contrainte de complexite. Vulnerable au brute-force (surtout sans rate limiting).

**Fix** :
```typescript
if (password.length < 12) return res.status(400).json({ error: 'Min. 12 caracteres' });
// Idealement, verifier la presence de majuscules, chiffres, et caracteres speciaux
// Ou utiliser zxcvbn pour evaluer la robustesse
```

---

### 9. CORS trop permissif en developpement (FAIBLE -- CVSS 3.1)

**Fichier** : `api/index.ts`, lignes 18-21

```
origin: ['http://localhost:5173', 'https://www.restaumargin.fr', ...]
```

`localhost:5173` ne devrait pas etre autorise en production. Configurer via variable d'environnement.

**Fix** :
```typescript
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
```

---

## Points positifs

| Element | Statut |
|---------|--------|
| `.env` dans `.gitignore` | OK |
| bcrypt avec salt 12 rounds | OK |
| Pas de `eval()`, `dangerouslySetInnerHTML`, `innerHTML` | OK |
| $queryRaw avec tagged templates (parametrise) | OK -- pas de SQL injection |
| Tokens de reset avec expiration (1h) | OK |
| Prisma ORM (pas de SQL brut sauf mercuriale) | OK |
| Auth middleware correctement applique sur routes privees | OK |
| Generic error message sur forgot-password | OK (empeche l'enumeration d'emails) |

---

## Recommandations par priorite

### Priorite 1 -- Corriger immediatement (avant mise en production)

| # | Vulnerabilite | Action |
|---|--------------|--------|
| 1 | JWT_SECRET hardcode | Supprimer le fallback, crash si non defini |
| 2 | Backdoor `secret !== 'admin'` | Supprimer la condition dans activation.ts |
| 3 | Stripe webhook non verifie | Ajouter `constructEvent()` avec webhook secret |

### Priorite 2 -- Corriger cette semaine

| # | Vulnerabilite | Action |
|---|--------------|--------|
| 4 | Pas de rate limiting | Installer `express-rate-limit` sur login, register, forgot-password |
| 5 | Pas de security headers | Installer `helmet` |
| 6 | IDOR sur /api/public/menu | Passer a un identifiant non sequentiel |

### Priorite 3 -- Corriger ce mois

| # | Vulnerabilite | Action |
|---|--------------|--------|
| 7 | Fuite d'erreur DB | Supprimer `detail: e.message` |
| 8 | Mot de passe trop faible | Augmenter a 12 caracteres minimum |
| 9 | CORS localhost en prod | Conditionner via variable d'environnement |

### Priorite 4 -- Ameliorations recommandees

- Ajouter `STRIPE_WEBHOOK_SECRET` et `STRIPE_SECRET_KEY` dans `.env.example`
- Ajouter `ACTIVATION_SECRET` dans `.env.example` (absent actuellement)
- Mettre en place un WAF (Vercel Edge, Cloudflare)
- Ajouter un audit log pour les actions admin (suppression user, generation codes)
- Configurer les tokens JWT avec un `issuer` et `audience`
- Implementer la rotation des JWT (refresh tokens)
- Ajouter `CORS_ORIGINS` dans `.env.example`

---

## Resume

| Categorie | Nombre | Statut |
|-----------|--------|--------|
| Critique (CVSS >= 8.0) | 3 | JWT hardcode, backdoor admin, webhook non verifie |
| Eleve (CVSS 6.0-7.9) | 2 | Pas de rate limit, pas de security headers |
| Moyen (CVSS 4.0-5.9) | 3 | IDOR menu, fuite erreur, mot de passe faible |
| Faible (CVSS < 4.0) | 1 | CORS localhost |
| **Total** | **9** | |
