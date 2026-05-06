# Campagne Montpellier v3 — corrigé sur les 10 erreurs v1

> Date : 2026-05-06
> Apprentissages : 235 emails v1 envoyes, 0 retour. 2 inscrits venus du site organique.
> Hypothese : email trop long, faux social proof, pas de perso, bulk sans warmup.

---

## Subject lines (3 variantes A/B/C)

| Variante | Subject |
|---|---|
| **A** | {{restaurant_name}} — 5 min pour calculer votre vraie marge |
| **B** | Combien vous coute reellement votre {{plat_signature_or_carte}} ? |
| **C** | RestauMargin — outil local lance a Montpellier |

Test A en priorite (perso = +20-30% open).

---

## Corps email (80 mots, ultra court)

**From** : RestauMargin <contact@restaumargin.fr>
**Reply-To** : contact@restaumargin.fr

```
Bonjour,

J'ai vu {{restaurant_name}} a {{neighborhood}} — votre carte {{cuisine_type_lower}} est tres propre.

Je lance RestauMargin a Montpellier ce mois-ci : un outil web pour calculer le cout exact d'un plat (ingredients + perte) en 5 min, sans Excel.

2 restaurants se sont inscrits cette semaine. Avant de pousser plus, je voulais avoir l'avis d'un autre restaurateur du coin.

5 min de test gratuit ici : https://www.restaumargin.fr

Si pas le temps, repondez juste "non merci" et je n'envoie plus rien.

Cordialement,
L'equipe RestauMargin
contact@restaumargin.fr
```

**Mots :** 84.

---

## Pourquoi ca corrige les 10 erreurs v1

| # | Erreur v1 | Fix v3 |
|---|---|---|
| 1 | 250 mots, illisible | 84 mots, scannable en 10s |
| 2 | "Marseille / sud" faux social proof | "2 inscrits cette semaine" — VRAI (organic Montpellier) |
| 3 | "12-18% food cost" invérifiable | "calcul cout exact en 5 min" — factuel, testable |
| 4 | From contact@ générique | From `RestauMargin <contact@>` (user a confirmé contact, pas prénom) |
| 5 | Footer "scraping disclosure" trust killer | Pas de disclosure, juste un opt-out humain ("repondez non merci") |
| 6 | Bulk shoot domain neuf | **Warmup 10/jour pendant 14 jours** (script send-v3) |
| 7 | Aucune perso | Ref. au resto + quartier + cuisine specifique |
| 8 | CTA passif | Question implicite + opt-out humain |
| 9 | Spam triggers (GRATUIT 0% carte bancaire) | Aucun mot trigger, juste "5 min de test gratuit" 1x |
| 10 | 1 shot, pas de relance | Relance J+5 si pas ouvert (subject different) |

---

## Relance J+5 (si email v3 pas ouvert)

**Subject** : `{{restaurant_name}} — petite relance`

```
Bonjour,

Je vous ai ecrit lundi sans retour, c'est probablement tombe en spam.

Pour rappel : RestauMargin est un outil web local Montpellier qui calcule en 5 min le cout reel d'un plat. Test gratuit, sans CB.

Avis honnete : utile ou inutile pour vous ?

https://www.restaumargin.fr

Cordialement,
L'equipe RestauMargin
```

---

## Cadence d'envoi

| Etape | Volume | Pourquoi |
|---|---|---|
| Jour 1-3 | 5 emails/jour | Warmup tres doux, IP/domaine restaumargin.fr neuf |
| Jour 4-7 | 10 emails/jour | Si delivery OK |
| Jour 8-14 | 15 emails/jour | Si taux open > 15% et bounce < 3% |
| J+5 | Relance auto subject different | Seulement si non ouvert |

Total estime : ~150 emails sur 14 jours pour cible 5-10 reponses.

---

## Tracking

- Header `X-Entity-Ref-ID` : ID unique par envoi
- Webhook Resend → log open/click/bounce/complaint dans `data/campaigns/v3-tracking.json`
- Stop campagne si bounce > 5% ou complaints > 0.1%

---

## SPF / DKIM / DMARC

A verifier sur restaumargin.fr avant 1er envoi v3 :

```bash
dig TXT restaumargin.fr  # SPF + DMARC
dig TXT resend._domainkey.restaumargin.fr  # DKIM
```

Si DMARC absent → ajouter `v=DMARC1; p=quarantine; rua=mailto:contact@restaumargin.fr` chez OVH DNS.
