# RestauMargin -- Strategie de Generation de Leads

> **Objectif** : Constituer une base de 10 000+ contacts qualifies (restaurateurs francais) en 6 mois
> **Date** : 7 avril 2026
> **Methode** : 100% legale, conforme RGPD
> **Priorite** : Marche francais d'abord, puis Maroc, Belgique, Suisse, Canada

---

## Cadre juridique (RGPD / CNIL)

Avant toute collecte, rappel des regles fondamentales :

- **B2B** : La prospection par email est autorisee sans consentement prealable si le message est en rapport avec la profession du destinataire (article L34-5 du CPCE). Les emails professionnels generiques (contact@, info@) et les emails nominatifs lies a l'activite professionnelle sont prospectables.
- **Obligation** : Chaque email doit contenir un lien de desinscription fonctionnel, l'identite de l'expediteur, et une raison de contact.
- **Pas de scraping automatise de donnees personnelles** sans base legale. On collecte des donnees professionnelles publiques.
- **Conservation** : Maximum 3 ans sans interaction. Purger les contacts inactifs regulierement.
- **Opt-in pour B2C** : Si un contact est un individu sans lien professionnel clair, il faut un consentement explicite.

---

## Sources de collecte

### 1. Google Maps API / Google Business Profile

| Critere | Detail |
|---------|--------|
| **Description** | Rechercher les restaurants par ville/region via l'API Google Places. Collecter : nom, adresse, telephone, site web, note, nombre d'avis. Puis scraper le site web pour extraire l'email de contact. |
| **Legalite** | **Legale avec precautions.** L'API Google Places est un service payant avec conditions d'utilisation. Les donnees du site web du restaurant sont publiques. Ne pas stocker les reviews Google ni les photos. Ne pas depasser les limites API. |
| **Rendement estime** | ~50 000 restaurants en France avec un site web. Taux d'extraction email : 30-40%. Soit **15 000-20 000 emails**. |
| **Methode d'extraction** | 1. Appel API Places : `type=restaurant`, rayon par ville. 2. Pour chaque resultat avec un `website`, scraper la page pour trouver un `mailto:` ou un pattern email. 3. Verifier l'email avec un outil de validation (ZeroBounce, NeverBounce). |
| **Cout estime** | API Google Places : ~0,017 USD par requete. Pour 200 000 requetes : **~3 400 USD** (3 100 EUR). Validation emails : ~0,01 EUR/email. Total : **~3 300 EUR**. |
| **Outils** | Python + Google Places API + BeautifulSoup/Scrapy pour sites web. Ou bien Apify (actor pre-construit). |
| **Priorite** | **P1 -- Source principale** |

---

### 2. PagesJaunes.fr (Solocal)

| Critere | Detail |
|---------|--------|
| **Description** | L'annuaire PagesJaunes contient les coordonnees de la quasi-totalite des restaurants en France : nom, adresse, telephone, parfois email et site web. |
| **Legalite** | **Zone grise.** Les donnees sont publiques mais les CGU de PagesJaunes interdisent le scraping automatise. Solution legale : collecte manuelle ou achat de fichiers aupres de courtiers de donnees agrees (InfoGreffe, Societe.com, Manageo). |
| **Rendement estime** | ~175 000 fiches restaurant. Avec email : ~20% soit **~35 000 emails**. Mais beaucoup de doublons avec Google. Net unique estime : **10 000-15 000**. |
| **Methode d'extraction** | **Option 1 (recommandee)** : Acheter un fichier sectoriel aupres d'un fournisseur de donnees B2B (Kompass, Manageo, Ellisphere). Filtrer par code NAF 56.10A (Restauration traditionnelle) et 56.10C (Restauration rapide). **Option 2** : Collecte semi-manuelle via recherche par ville. |
| **Cout estime** | Fichier Kompass/Manageo : **500-2 000 EUR** pour 10 000-50 000 contacts avec email. |
| **Priorite** | **P1 -- Complement Google** |

---

### 3. La Fourchette / TheFork

| Critere | Detail |
|---------|--------|
| **Description** | Plateforme de reservation en ligne avec ~15 000 restaurants en France. Chaque fiche contient : nom, adresse, cuisine, fourchette de prix, avis. Certains affichent le site web. |
| **Legalite** | **Legale pour collecte manuelle.** Les fiches sont publiques. Le scraping automatise est interdit par les CGU. On peut collecter manuellement ou via des outils respectueux (extraction du sitemap public, pas d'appels API non autorises). |
| **Rendement estime** | ~15 000 restaurants listes. Avec site web exploitable : ~40%. Emails extractibles : **~3 000-4 000**. |
| **Methode d'extraction** | 1. Parcourir les pages par ville sur lafourchette.com. 2. Pour chaque restaurant avec un site web, visiter le site et chercher un email. 3. Utiliser un outil type Hunter.io pour deviner l'email a partir du domaine. |
| **Cout estime** | Hunter.io : 49 EUR/mois (500 recherches). Pour 6 000 sites : ~6 mois soit **~300 EUR**. Temps humain : significatif. |
| **Priorite** | **P2 -- Source complementaire** |

---

### 4. TripAdvisor

| Critere | Detail |
|---------|--------|
| **Description** | Plus grande plateforme d'avis avec ~100 000+ restaurants en France. Fiches publiques avec nom, adresse, telephone, site web, type de cuisine, fourchette de prix. |
| **Legalite** | **Donnees publiques mais scraping interdit par CGU.** TripAdvisor est agressif sur les actions legales contre le scraping. Solution : collecte manuelle uniquement, ou utilisation des liens vers les sites web des restaurants pour en extraire les emails. |
| **Rendement estime** | ~100 000 restaurants en France. ~30% avec site web. Emails extractibles : **~15 000-20 000** (beaucoup de doublons avec Google Maps). Net unique : **~5 000**. |
| **Methode d'extraction** | 1. Navigation manuelle par ville/region. 2. Copie des liens vers les sites web. 3. Extraction email depuis les sites web. **NE PAS scraper TripAdvisor automatiquement.** |
| **Cout estime** | Temps humain principalement. Avec un VA (assistant virtuel) : **200-400 EUR/mois** pour 1 000-2 000 contacts/mois. |
| **Priorite** | **P3 -- Long terme** |

---

### 5. LinkedIn

| Critere | Detail |
|---------|--------|
| **Description** | Reseau professionnel. Cible : proprietaires de restaurants, directeurs de restauration, gerants, chefs d'entreprise dans la restauration. |
| **Legalite** | **Legale si prospection manuelle.** LinkedIn interdit le scraping automatise (ils ont gagne un proces contre HiQ Labs). La prospection via InMail ou messages est autorisee dans les limites de la plateforme. L'utilisation de Sales Navigator est legale. |
| **Rendement estime** | ~20 000-30 000 profils "restaurateur" / "gerant restaurant" / "directeur restauration" en France. Taux de reponse aux messages : 5-15%. Emails obtenus via profil ou echange : **~2 000-3 000**. |
| **Methode d'extraction** | 1. **LinkedIn Sales Navigator** (79,99 EUR/mois) : filtrer par titre, secteur, localisation. 2. Envoyer des invitations personnalisees (max 100/semaine). 3. Engager la conversation, proposer de la valeur (guide gratuit, audit marge). 4. Obtenir l'email via l'echange ou via Hunter.io/Dropcontact. |
| **Cout estime** | Sales Navigator : **80 EUR/mois**. Dropcontact (enrichissement email) : 24 EUR/mois. Total : **~100 EUR/mois**. |
| **Priorite** | **P1 -- Source de leads tres qualifies (Persona 2 et 3)** |

---

### 6. Salons professionnels

| Salon | Lieu | Frequence | Public | Methode de collecte | Leads estimes | Cout |
|-------|------|-----------|--------|--------------------|--------------|----|
| **SIRHA Lyon** | Lyon | Tous les 2 ans (janvier) | 200 000+ visiteurs, restaurateurs, hoteliers, fournisseurs | Stand, badge scanner, cartes de visite, demo live | 200-500 contacts qualifies | 3 000-8 000 EUR (stand) |
| **Sandwich & Snack Show** | Paris | Annuel (mars) | 15 000 visiteurs, snacking, fast casual | Stand petit, demo tablette, flyers | 100-300 contacts | 1 500-4 000 EUR |
| **EquipHotel** | Paris | Tous les 2 ans (novembre) | 110 000+ visiteurs, equipement resto | Stand, conference, partenariats | 200-500 contacts | 3 000-8 000 EUR |
| **Food Hotel Tech** | Paris | Annuel (juin) | 8 000 visiteurs, tech pour restauration | Stand startup, pitch, networking | 150-400 contacts | 2 000-5 000 EUR |
| **Salon de la Franchise** | Paris | Annuel (mars) | Franchises restauration | Visiteur + networking, pas de stand necessaire | 50-100 contacts | 50 EUR (entree) |

**Priorite** : **P2 -- Couteux mais leads tres qualifies (taux de conversion 15-25%)**

---

### 7. CCI (Chambre de Commerce et d'Industrie)

| Critere | Detail |
|---------|--------|
| **Description** | Les CCI tiennent des annuaires d'entreprises par secteur et organisent des evenements pour les entrepreneurs. Chaque CCI locale a un referent "commerces" ou "restauration". |
| **Legalite** | **Parfaitement legale.** Les CCI sont des organismes publics. Leurs annuaires et evenements sont accessibles. |
| **Rendement estime** | 150+ CCI en France. Chaque CCI a 50-500 restaurateurs membres. Potentiel : **10 000-30 000 contacts** via les annuaires. Mais la plupart sont des adresses postales, pas des emails. |
| **Methode d'extraction** | 1. Contacter les CCI locales pour proposer un atelier gratuit "Maitriser ses marges en restauration". 2. Lors de l'atelier, collecter les emails des participants (inscription prealable). 3. Demander acces a l'annuaire des commerces CHR de la CCI. 4. Proposer un partenariat : la CCI recommande RestauMargin a ses membres en echange d'un tarif preferentiel. |
| **Cout estime** | **Gratuit** (si vous proposez un atelier). Deplacements : 50-100 EUR/CCI. |
| **Priorite** | **P1 -- Gratuit, tres qualifie, effet de credibilite** |

---

### 8. Federations et syndicats professionnels

| Organisation | Membres estimes | Site web | Methode |
|-------------|----------------|---------|---------|
| **UMIH** (Union des Metiers et Industries de l'Hotellerie) | ~80 000 adherents (hoteliers + restaurateurs) | umih.fr | Contacter le delegue national restauration. Proposer un partenariat : avantage membre (-20% sur l'abonnement). Presenter en congres annuel. |
| **GNI** (Groupement National des Independants de l'Hotellerie et de la Restauration) | ~25 000 adherents | gni-hcr.fr | Meme approche. Le GNI represente les independants -- notre cible exacte. |
| **SNRTC** (Syndicat National de la Restauration Thematique et Commerciale) | ~5 000 adherents (chaines et restauration commerciale) | snrtc.fr | Cible Persona 3 (multi-sites). Proposer des demos groupees. |
| **SYNHORCAT** (devenu GHR) | ~10 000 adherents | ghr.fr | Syndicat historique. Presence aux evenements, publication dans leur newsletter. |
| **Confederation des Chocolatiers et Confiseurs de France** | ~2 000 | -- | Niche mais food cost eleve, bonne cible. |

| Critere | Detail |
|---------|--------|
| **Legalite** | **Parfaitement legale.** Partenariat institutionnel. |
| **Rendement estime** | Si partenariat UMIH : acces a 30 000-40 000 restaurateurs via leur newsletter. Conversion 1-3% = **300-1 200 leads**. |
| **Cout estime** | **Gratuit a 500 EUR** (frais de partenariat selon l'organisation). |
| **Priorite** | **P1 -- Effet de levier massif** |

---

## Tableau recapitulatif

| Source | Legalite | Rendement estime (emails) | Cout estime | Priorite | Delai |
|--------|----------|--------------------------|------------|----------|-------|
| Google Maps API + sites web | Legale | 15 000-20 000 | 3 300 EUR | **P1** | 1-2 mois |
| PagesJaunes / fichier Kompass | Legale (achat fichier) | 10 000-15 000 | 500-2 000 EUR | **P1** | 1 semaine |
| LinkedIn Sales Navigator | Legale (prospection manuelle) | 2 000-3 000 | 100 EUR/mois | **P1** | Continu |
| CCI (ateliers gratuits) | Legale | 500-2 000 | 0-500 EUR | **P1** | 1-3 mois |
| Federations (UMIH, GNI) | Legale | 300-1 200 (via partenariat) | 0-500 EUR | **P1** | 2-4 mois |
| La Fourchette / TheFork | Legale (manuelle) | 3 000-4 000 | 300 EUR | **P2** | 2-3 mois |
| Salons professionnels | Legale | 200-500 par salon | 1 500-8 000 EUR/salon | **P2** | Ponctuel |
| TripAdvisor | Legale (manuelle uniquement) | 5 000 (net) | 200-400 EUR/mois (VA) | **P3** | Continu |

**Total potentiel** : **30 000-45 000 emails de restaurateurs en France** en 6 mois.

---

## Plan d'execution -- 6 premiers mois

### Mois 1 (Avril 2026)

- [ ] Acheter un fichier Kompass/Manageo : code NAF 56.10A + 56.10C, region Ile-de-France + Rhone-Alpes (5 000 contacts, ~500 EUR)
- [ ] Configurer LinkedIn Sales Navigator + Dropcontact
- [ ] Envoyer 20 invitations LinkedIn/jour aux gerants de restaurant
- [ ] Contacter 3 CCI (Paris, Lyon, Bordeaux) pour proposer un atelier
- [ ] Developper le script Python de collecte Google Maps (top 20 villes)

### Mois 2 (Mai 2026)

- [ ] Lancer la collecte Google Maps : Paris, Lyon, Marseille, Bordeaux, Toulouse, Nantes, Lille, Strasbourg, Nice, Montpellier
- [ ] Premier atelier CCI (Paris)
- [ ] Contacter l'UMIH pour un partenariat
- [ ] Valider les emails collectes (ZeroBounce)
- [ ] Premiere campagne cold email (500 contacts, 3 versions A/B)

### Mois 3 (Juin 2026)

- [ ] Etendre Google Maps aux 50 plus grandes villes
- [ ] 2e et 3e ateliers CCI (Lyon, Bordeaux)
- [ ] Debut collecte La Fourchette (semi-manuelle)
- [ ] Scale cold email : 1 000 contacts/semaine
- [ ] Contacter le GNI pour un partenariat

### Mois 4-6 (Juillet-Septembre 2026)

- [ ] Objectif : 20 000 contacts dans la base
- [ ] Segmentation par region, type de cuisine, taille
- [ ] Campagnes email segmentees (objet different par persona)
- [ ] Preparation salon Sandwich & Snack Show (si dates compatibles) ou Food Hotel Tech
- [ ] Debut collecte TripAdvisor (assistant virtuel)
- [ ] Partenariat UMIH actif : mention dans la newsletter

---

## Outils recommandes

| Outil | Usage | Cout/mois |
|-------|-------|-----------|
| **Google Places API** | Collecte coordonnees restaurants | Variable (~100 EUR/mois) |
| **LinkedIn Sales Navigator** | Prospection dirigeants | 80 EUR |
| **Dropcontact** | Enrichissement email depuis LinkedIn | 24 EUR |
| **Hunter.io** | Trouver les emails depuis un domaine | 49 EUR |
| **ZeroBounce** | Validation emails (eviter bounces) | 20 EUR |
| **Lemlist** ou **Instantly** | Envoi cold email automatise | 59-97 EUR |
| **Notion** ou **Airtable** | CRM temporaire avant integration | 0-10 EUR |
| **Resend** (deja utilise) | Emails transactionnels et sequences | Inclus |

**Cout total outillage** : **~350 EUR/mois**

---

## Conformite RGPD -- Checklist

- [ ] Mention legale dans chaque email (identite expediteur + adresse)
- [ ] Lien de desinscription fonctionnel dans chaque email
- [ ] Base legale documentee pour chaque contact (interet legitime B2B)
- [ ] Registre des traitements a jour (CNIL)
- [ ] Politique de confidentialite sur restaumargin.com
- [ ] Purge automatique des contacts sans interaction apres 12 mois
- [ ] Reponse aux demandes de suppression sous 30 jours
- [ ] Pas de revente de donnees collectees a des tiers

---

*Ce document est un plan operationnel. A adapter en fonction des resultats des premiers tests (taux d'ouverture, taux de conversion, qualite des leads).*
