# Retargeting Pixels — Setup avant le launch PH (6 mai 2026)

## Objectif

Capturer les **5 000 - 20 000 visiteurs PH** dans des audiences custom pour leur retargeter des ads ciblées (Meta, LinkedIn, X) après le launch — typiquement 30 jours après.

ROI typique : **3-5x plus efficace** que cold outreach car ces visiteurs ont déjà manifesté un intérêt explicite.

---

## ⏱️ Setup à faire avant le 6 mai (15 min total)

### 1. Meta Pixel (Facebook + Instagram Ads) — 5 min

1. Aller sur https://business.facebook.com/events_manager
2. Créer un compte Business si pas existant (gratuit)
3. **Data Sources** → **Connect Data** → **Web** → **Meta Pixel**
4. Pixel name : `RestauMargin` → URL : `restaumargin.fr` → **Continue**
5. **Set up the Pixel** → **Install code manually** → copier le **Pixel ID** (16 chiffres)
6. Dans `client/index.html` :
   - Décommenter le bloc `<!-- Meta Pixel ... -->` (lignes ~180-198)
   - Remplacer `YOUR_PIXEL_ID` par le vrai ID (2 fois : dans `fbq('init', ...)` et le noscript img)
7. Commit + push (Vercel deploy auto)
8. Vérifier sur Meta Events Manager que les events "PageView" remontent (~5 min après deploy)

**Audiences à créer post-launch** (Meta Business Suite → Audiences) :
- `Visiteurs /launch` : URL contains `/launch` (= visiteurs PH)
- `Visiteurs pricing` : URL contains `/pricing`
- `Visiteurs blog` : URL contains `/blog/`
- `Trial démarré` : custom event Trial (à instrumenter sur la page register success)

### 2. LinkedIn Insight Tag — 5 min

1. Aller sur https://www.linkedin.com/campaignmanager/accounts
2. Créer un compte ad si pas existant (gratuit, sans payer pour démarrer)
3. **Account Assets** → **Insight Tag** → **Install my Insight Tag**
4. Copier le **Partner ID** (7 chiffres)
5. Dans `client/index.html` :
   - Décommenter le bloc `<!-- LinkedIn Insight Tag ... -->` (lignes ~199-220)
   - Remplacer `YOUR_LINKEDIN_PARTNER_ID` par le vrai ID (2 fois)
6. Commit + push
7. Retour sur Campaign Manager → Insight Tag → vérifier "Active in last 24h" (peut prendre 1-2h)

**Audiences B2B (LinkedIn meilleur que Meta pour décideurs SaaS)** :
- `Visitors /launch` : matched by URL contains `/launch`
- `Job titles : Restaurant Manager / Chef / Owner / F&B Director` : matched company industries

### 3. X (Twitter) Pixel — 5 min

1. Aller sur https://ads.x.com (ex-ads.twitter.com)
2. Settings → **Tracking and conversions**
3. **Generate event** → **Single page event** → URL pattern → **Continue**
4. Copier le **Pixel ID** (commence par `o...`)
5. Dans `client/index.html` :
   - Décommenter le bloc `<!-- X Pixel ... -->` (lignes ~221-230)
   - Remplacer `YOUR_TWITTER_PIXEL_ID` par le vrai ID
6. Commit + push

X Pixel est moins critique mais utile si on retarget les comments PH (la plupart sont sur X).

---

## 🎯 Stratégie campagnes post-launch (J+3 à J+30)

### Budget recommandé
- **Meta** : 200-500€ pour 30 jours (CPM ~5-10€ pour audience SaaS B2B)
- **LinkedIn** : 200-400€ (CPM ~25-40€ mais audience hyper qualifiée)
- **X (optionnel)** : 100-200€

**Total** : 500-1100€ pour récupérer ~80% des visiteurs PH dans le funnel

### Creative ads à préparer (J-3)

**Meta** : 1 video 15s (dictée recette → coût) + 1 carrousel avant/après Excel + 1 single image avec citation testimonial

**LinkedIn** : 1 single image avec headline "Vos marges glissent de 4-7 points sans que vous le sachiez" + CTA "Démo gratuite"

**X** : Promoted tweet avec le tweet recap du launch (post-PH)

### Conversion goals
- **TOFU** : trafic vers `/launch` ou `/blog/calcul-marge-restaurant` (cold education)
- **MOFU** : trial démarré (`/login?mode=register`)
- **BOFU** : checkout pricing (`/pricing` → Stripe)

---

## 📊 Suivi post-launch

| Date | Visiteurs PH | Audience Meta | Audience LinkedIn | Trial créés |
|---|---|---|---|---|
| J0 (6 mai) | | | | |
| J+7 | | | | |
| J+30 | | | | |

---

## 🚨 Sécurité / RGPD

- **Cookie consent obligatoire** : tu dois afficher une bannière qui demande consentement avant de charger les pixels (sauf "necessary cookies" comme GA4 anonymisé). Les pixels Meta + LinkedIn + X = "marketing", consentement requis EU.
- Solution simple : intégrer **Cookiebot** (gratuit < 100 pages) ou **Iubenda** (12€/mois).
- Sans consent banner, risque amende CNIL (jusqu'à 4% CA).

**Pour l'instant, les pixels sont COMMENTÉS** — quand tu actives, ajoute aussi le consent banner en parallèle.

---

## 🛠️ Code conditionnel (alternative cleaner si tu veux activer sans cookie banner)

Wrapper les pixels dans une condition `localStorage.getItem('marketing_consent') === 'true'` :

```html
<script>
  if (typeof window !== 'undefined' && localStorage.getItem('marketing_consent') === 'true') {
    // ... code Meta Pixel ...
  }
</script>
```

Puis afficher un banner sur la 1ère visite qui demande consentement → si oui → reload page → pixels actifs.

---

*Setup à faire idéalement J-3 (3 mai 2026) pour avoir le pixel actif et capturer le trafic dès le launch.*
