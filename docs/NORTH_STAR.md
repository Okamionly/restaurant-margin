# North Star Metric — RestauMargin
**Version** : 1.0 — 2026-04-23
**Owner** : Youssef Guessous

---

## Définition

**"Nombre de restaurateurs WAU (Weekly Active Users) qui utilisent RestauMargin pour décider un prix ou valider une recette."**

Un WAU "décision" est un utilisateur qui, dans la semaine écoulée, a réalisé au moins l'un de ces actes de valeur réelle :
- Validé ou modifié le prix de vente d'un plat après consultation IA
- Sauvegardé ou mis à jour une fiche technique avec son coût calculé
- Consulté l'analyse de marge d'un plat/menu existant

---

## Pourquoi cette métrique

La North Star Metric doit capturer la valeur délivrée au client, pas le revenu (leading indicator > lagging indicator).

| Critère | Vérification |
|---|---|
| Mesurable en SQL Supabase | Oui — 3 events définis |
| Reflète la valeur core (pas l'engagement creux) | Oui — "décider" = action à conséquence réelle |
| Aligne produit, marketing et CS | Oui — chaque équipe peut agir dessus |
| Prédictif du revenu | Oui — un chef qui décide ses prix avec l'outil renouvelle son abonnement |
| Ne peut pas être "gamifié" facilement | Oui — difficile de créer des faux-positifs |

Les métriques rejetées :
- Sessions actives (trop facile à gonfler, sans valeur)
- MRR (lagging, ne guide pas le produit)
- Features utilisées (proxy vide si le chef ne prend pas de décision)

---

## Events Supabase — Tracking SQL

### Schema events table

```sql
-- Table à créer dans Supabase
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name   text NOT NULL,
  event_data   jsonb DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

-- Index pour les requêtes North Star
CREATE INDEX idx_analytics_events_user_week
  ON public.analytics_events (user_id, event_name, created_at);

-- RLS : user voit ses propres events, admin voit tout
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins see all events"
  ON public.analytics_events FOR SELECT
  USING (auth.jwt() ->> 'email' = 'mr.guessousyoussef@gmail.com');
```

### Events à tracker (3 core)

```typescript
// Event 1 : Prix décidé (modification prix de vente après calcul)
await supabase.from('analytics_events').insert({
  user_id: session.user.id,
  event_name: 'price_decision_made',
  event_data: {
    dish_id: dish.id,
    dish_name: dish.name,
    old_price: previousPrice,
    new_price: dish.selling_price,
    food_cost_pct: dish.food_cost_percentage,
    source: 'ai_suggestion' | 'manual'
  }
});

// Event 2 : Fiche technique sauvegardée
await supabase.from('analytics_events').insert({
  user_id: session.user.id,
  event_name: 'recipe_saved',
  event_data: {
    recipe_id: recipe.id,
    recipe_name: recipe.name,
    ingredients_count: recipe.ingredients.length,
    total_cost: recipe.total_cost,
    margin_pct: recipe.margin_percentage
  }
});

// Event 3 : Analyse de marge consultée
await supabase.from('analytics_events').insert({
  user_id: session.user.id,
  event_name: 'margin_analysis_viewed',
  event_data: {
    context: 'dish_detail' | 'menu_overview' | 'dashboard',
    items_analyzed: count
  }
});
```

### Requête North Star WAU hebdomadaire

```sql
-- WAU North Star : users avec >= 1 event de décision cette semaine
SELECT
  DATE_TRUNC('week', created_at) AS week,
  COUNT(DISTINCT user_id) AS north_star_wau
FROM public.analytics_events
WHERE
  event_name IN ('price_decision_made', 'recipe_saved', 'margin_analysis_viewed')
  AND created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY 1
ORDER BY 1 DESC;

-- Détail par event type
SELECT
  DATE_TRUNC('week', created_at) AS week,
  event_name,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(*) AS total_events
FROM public.analytics_events
WHERE
  event_name IN ('price_decision_made', 'recipe_saved', 'margin_analysis_viewed')
  AND created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;
```

### Requête activation J+2

```sql
-- % users qui font >= 1 event de valeur dans les 48h post-signup
WITH signups AS (
  SELECT id AS user_id, created_at AS signup_at
  FROM auth.users
  WHERE created_at >= NOW() - INTERVAL '30 days'
),
activations AS (
  SELECT DISTINCT e.user_id
  FROM public.analytics_events e
  JOIN signups s ON e.user_id = s.user_id
  WHERE
    e.event_name IN ('price_decision_made', 'recipe_saved', 'margin_analysis_viewed')
    AND e.created_at BETWEEN s.signup_at AND s.signup_at + INTERVAL '48 hours'
)
SELECT
  COUNT(s.user_id) AS total_signups,
  COUNT(a.user_id) AS activated_users,
  ROUND(COUNT(a.user_id)::numeric / NULLIF(COUNT(s.user_id), 0) * 100, 1) AS activation_rate_pct
FROM signups s
LEFT JOIN activations a ON s.user_id = a.user_id;
```

---

## Cibles par trimestre

| Période | North Star WAU cible | Contexte |
|---|---|---|
| T2 2026 (juin) | 25 WAU | Design partners + premiers payants Montpellier |
| T3 2026 (sept) | 100 WAU | Scale outbound national, premier hire CS |
| T4 2026 (déc) | 500 WAU | 3 verticaux actifs, campagnes organique en régime |
| T1 2027 (mars) | 1 500 WAU | Partenariats grossistes, mercuriale intégrée |

**Règle de progression** : x4 par trimestre jusqu'à 500 WAU, puis x2 à partir de T1 2027 (croissance organique + bouche-à-oreille).

---

## Lien avec les OKRs Q2 2026

| OKR | Lien North Star |
|---|---|
| O1 KR1.3 Activation J+2 >40% | Mesurée via requête SQL activation ci-dessus |
| O1 KR1.1 5 design partners NPS >30 | NPS = proxy de la valeur perçue, North Star = valeur réelle |
| O2 KR2.1 500€ MRR | Les WAU qui "décident" renouvellent → corrélation directe |
| O3 KR3.1 Tests critiques | Les events de tracking doivent être testés (zéro données corrompues) |

---

## Dashboard admin — visualisation recommandée

Ajouter à `/admin/finance` (priorité top-5 audit) :

```
[North Star WAU — 12 semaines]  ← graphe ligne
[Activation Rate J+2]           ← gauge %
[Event breakdown this week]     ← bar chart par type
[Cohort retention W1/W2/W4]     ← table cohortes
```

---

*Ce document est la source de vérité sur la North Star Metric. Tout changement de définition doit être committé ici avec justification. Sinon les données historiques deviennent incomparables.*

*Dernière mise à jour : 2026-04-23*
