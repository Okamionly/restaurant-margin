# Todo — restaurant-margin

## Current sprint — Phase 2 Automatisation

- [ ] **Commandes automatiques** (🔨 in progress) — finir `/commandes-auto`, intégrer fournisseurs, test email
- [ ] **HACCP & Traçabilité** (🔨 in progress) — finir `/haccp`, scan codes-barres, export PDF
- [ ] **Abonnement Stripe** (🔨 in progress) — finir `/abonnement` pricing page, tiers Free/Pro/Enterprise

## Backlog — Phase 2 + 3

- [ ] **Planning du personnel** — TODO
- [ ] **SaaS Multi-restaurant** — architecture tenant, invitations, rôles
- [ ] **Marketplace Fournisseurs** — compléter appels d'offres existants

## Backlog — Phase 4 Scale

- [ ] **App mobile native** (React Native si besoin — check feasibility PWA d'abord)
- [ ] **API ouverte** : caisse, compta, réservation
- [ ] **IA Prédictive** : prévisions ventes, détection gaspillage, chatbot chef

## Tech debt

- [ ] **Tests unitaires** sur les calculs de marge (critique pour la confiance user)
- [ ] **Coverage** auth + Stripe payments (règle CLAUDE.md : 80% features sensibles)
- [ ] **Vérifier `passwordHash` field** est bien utilisé partout (pas `password_hash`)

## Review

_Section remplie après chaque tâche complétée._

---
**Stack:** React 18 + Vite + TypeScript (client) / Node.js + Express + TypeScript (api) / Prisma + PostgreSQL (Supabase)
**UI:** Tailwind W&B (hex direct, zero slate), Satoshi/General Sans fonts, lucide-react
**Hardware kit:** K2 Pro Combo printer + tablette Tab A9+ + WeighStation page (ne pas casser)
**Auth:** emails Mr.guessousyoussef@gmail.com, field `passwordHash` (camelCase)
**19 actions IA** : Haiku pour rapides, Sonnet pour complexes
**i18n:** 5 locales (fr/en/ar/es/de), hook `useTranslation`
