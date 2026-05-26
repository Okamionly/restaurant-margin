#!/usr/bin/env node
/**
 * Prerender public routes for SEO.
 *
 * Runs AFTER `vite build`. Reads the built index.html, creates copies for each
 * public route with the correct <title>, <meta description>, <canonical>, and
 * Open Graph tags baked into the static HTML.
 *
 * Vercel serves exact static file matches before applying rewrites, so these
 * files will be served directly to crawlers with correct SEO metadata.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const BASE_URL = 'https://www.restaumargin.fr';

// Public routes to prerender with their SEO metadata
const ROUTES = [
  {
    path: '/pricing',
    title: 'Tarifs — RestauMargin',
    description: 'Plans Pro (29 EUR/mois) et Business (79 EUR/mois). Calculez vos marges restaurant, food cost et fiches techniques. Essai gratuit 7 jours sans engagement.',
  },
  {
    path: '/a-propos',
    title: 'À propos — RestauMargin',
    description: "Découvrez RestauMargin, la plateforme SaaS française de gestion de marge pour restaurateurs. Basée à Montpellier, notre mission est d'aider les chefs à maîtriser leur food cost et leurs marges.",
  },
  {
    path: '/guide-marge/pizzeria',
    title: 'Calcul de marge pizzeria : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre pizzeria. Food cost, coefficient multiplicateur, rentabilité par pizza, gestion pâte, garnitures, et optimisation prix de vente.",
  },
  {
    path: '/guide-marge/brasserie',
    title: 'Calcul de marge brasserie : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre brasserie. Gestion carte, plat du jour, menu entrée-plat-dessert, boissons, et optimisation food cost.",
  },
  {
    path: '/guide-marge/bistro',
    title: 'Calcul de marge bistrot : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre bistrot. Gestion simple, ardoise du jour, rotation rapide et optimisation du food cost au quotidien.",
  },
  {
    path: '/guide-marge/food-truck',
    title: 'Calcul de marge food truck : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre food truck. Gestion offline, fiches techniques rapides, rotation ingrédients et optimisation par site.",
  },
  {
    path: '/guide-marge/restaurant-gastronomique',
    title: 'Calcul de marge restaurant gastronomique : guide 2026',
    description: "Guide et outil pour calculer les marges d'un restaurant gastronomique. Fiches techniques précises, produits nobles, traçabilité HACCP et gestion menu dégustation.",
  },
  {
    path: '/guide-marge/cafe-coffee-shop',
    title: 'Calcul de marge cafe et coffee shop : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre cafe ou coffee shop. Food cost cafe, coefficient boissons, marge patisserie, gestion takeaway et optimisation recettes signature.",
  },
  {
    path: '/guide-marge/burger-restaurant',
    title: 'Calcul de marge burger restaurant : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre burger restaurant. Food cost steak hache, optimisation assemblage, gestion frites et boissons, rentabilite par formule.",
  },
  {
    path: '/guide-marge/sushi-restaurant',
    title: 'Calcul de marge restaurant sushi : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre restaurant sushi. Food cost poisson cru, riz a sushi, formules plateau, gestion FIFO fraicheur et optimisation carte japonaise.",
  },
  {
    path: '/guide-marge/kebab-fast-food',
    title: 'Calcul de marge kebab et fast-food : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre kebab ou fast-food. Food cost viande grille, pain, sauces et garnitures. Gestion formules midi, livraison et optimisation marge par commande.",
  },
  {
    path: '/guide-marge/boulangerie-patisserie',
    title: 'Calcul de marge boulangerie-patisserie : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre boulangerie-patisserie. Food cost farine, beurre, oeufs, gestion des fournees, prix de revient par piece et optimisation carte viennoiseries et gateaux.",
  },
  {
    path: '/demo',
    title: 'Demo — RestauMargin',
    description: 'Testez RestauMargin gratuitement. Decouvrez la plateforme de gestion de marge pour restaurateurs avec fiches techniques, food cost et IA.',
  },
  {
    path: '/blog',
    title: 'Blog RestauMargin — Guides et conseils pour restaurateurs',
    description: "Articles et guides pratiques pour restaurateurs : calcul de marge, food cost, HACCP, fiches techniques, IA en restauration. Conseils d'experts pour optimiser votre restaurant.",
  },
  {
    path: '/blog/calcul-marge-restaurant',
    title: 'Marge restaurant 2026 : calcul, formule, food cost (guide complet)',
    description: 'Marge restaurant : tout savoir en 2026. Calcul, formule, food cost, coefficient multiplicateur, marge brute et nette. Methode pas a pas, exemples chiffres, benchmarks par type de restaurant et outils gratuits.',
    type: 'article',
  },
  {
    path: '/blog/faq-marge-restaurant-25-questions',
    title: 'FAQ Marge Restaurant 2026 : 25 questions essentielles (reponses chefs)',
    description: "Toutes les reponses sur la marge restaurant en 2026 : taux moyen, calcul, regle 30/30/30/10, rentabilite, plat le plus rentable, salaire proprietaire. 25 questions essentielles + formules + benchmarks.",
    type: 'article',
  },
  {
    path: '/blog/marge-beneficiaire-restaurant-ideal',
    title: "Marge bénéficiaire restaurant : quel est l'idéal en 2026 ? (avec exemples)",
    description: "La marge bénéficiaire idéale d'un restaurant en France 2026 : 5-15% en net selon segment. Un bénéfice de 4% est-il acceptable ? Une marge de 50% est-elle réaliste ? Réponses claires + exemples chiffrés.",
    type: 'article',
  },
  {
    path: '/blog/reduire-food-cost',
    title: 'Reduire le food cost de votre restaurant : 10 strategies',
    description: 'Strategies concretes pour reduire le food cost : gestion des stocks, fiches techniques, negociation fournisseurs, reduction du gaspillage.',
    type: 'article',
  },
  {
    path: '/blog/coefficient-multiplicateur',
    title: 'Le coefficient multiplicateur en restauration : guide complet',
    description: 'Comprendre et appliquer le coefficient multiplicateur pour fixer vos prix de vente en restaurant. Formules et exemples.',
    type: 'article',
  },
  {
    path: '/blog/ia-restauration',
    title: "L'intelligence artificielle en restauration : guide 2026",
    description: "Comment l'IA transforme la restauration : gestion des marges, previsions de ventes, optimisation des menus.",
    type: 'article',
  },
  {
    path: '/blog/gaspillage-alimentaire',
    title: 'Reduire le gaspillage alimentaire en restaurant',
    description: 'Solutions concretes pour reduire le gaspillage alimentaire : FIFO, portionnement, valorisation des dechets, suivi des pertes.',
    type: 'article',
  },
  {
    path: '/blog/haccp-restaurant',
    title: "HACCP en restaurant : guide complet des normes d'hygiene",
    description: "Tout savoir sur la methode HACCP en restaurant : 7 principes, plan de maitrise sanitaire, temperatures, tracabilite.",
    type: 'article',
  },
  // === Blog articles boostés Wave 1-4 (2026-05-26) ===
  {
    path: '/blog/prix-de-vente-restaurant',
    title: "Calculer le prix de vente d'un plat de restaurant en 2026",
    description: 'Methodes eprouvees pour fixer vos prix : coefficient multiplicateur, marge cible, pricing psychologique. Cas pratiques chiffres et outils gratuits.',
    type: 'article',
  },
  {
    path: '/blog/fiche-technique-restaurant',
    title: 'Fiche technique restaurant : le guide complet 2026',
    description: 'Apprenez a creer des fiches techniques efficaces pour vos plats : grammages, couts matieres, allergenes, process de fabrication.',
    type: 'article',
  },
  {
    path: '/blog/kpi-essentiels-restaurateur',
    title: 'Les 12 KPIs essentiels pour piloter votre restaurant',
    description: 'Food cost, marge brute, ticket moyen, productivite par couvert : les indicateurs incontournables pour un restaurant rentable.',
    type: 'article',
  },
  {
    path: '/blog/reduire-cout-personnel-restaurant',
    title: 'Comment reduire le cout du personnel en restauration',
    description: 'Planning optimise, reduction du turnover, formation, process cuisine : 5 leviers concrets pour reduire votre masse salariale de 10 a 20%.',
    type: 'article',
  },
  {
    path: '/blog/fifo-lifo-stocks-restaurant',
    title: 'FIFO vs LIFO en restauration : quelle methode de stocks choisir',
    description: 'FIFO ou LIFO pour gerer vos stocks en cuisine ? Definitions, comparatif, mise en place pratique et impact sur le food cost.',
    type: 'article',
  },
  {
    path: '/blog/seuil-rentabilite-restaurant',
    title: 'Seuil de rentabilite restaurant : calculer le point mort 2026',
    description: 'Formules, exemples chiffres et benchmarks pour connaitre votre point mort, le nombre de couverts necessaires et les leviers pour reduire votre seuil.',
    type: 'article',
  },
  {
    path: '/blog/menu-engineering-boston-matrix',
    title: 'Menu engineering : methode Boston Matrix pour optimiser votre carte',
    description: 'Classez vos plats en Stars, Vaches a lait, Puzzles et Chiens. Exemple pratique sur une carte de 20 plats avec actions concretes.',
    type: 'article',
  },
  {
    path: '/blog/kpi-restaurateur',
    title: 'Les 10 KPI essentiels pour piloter son restaurant en 2026',
    description: "Food cost, prime cost, RevPASH, ticket moyen, taux d'occupation : les indicateurs cles avec formules et benchmarks sectoriels.",
    type: 'article',
  },
  {
    path: '/blog/logiciel-caisse-enregistreuse-restaurant',
    title: "Logiciel de caisse restaurant : comparatif 2026 (Lightspeed, Zelty, L'Addition)",
    description: '7 solutions comparees : prix, fonctionnalites, points forts et points faibles. Comment choisir votre caisse enregistreuse en 2026.',
    type: 'article',
  },
  {
    path: '/blog/methode-fifo-gestion-stocks-restaurant',
    title: 'Methode FIFO en restauration : reduire les pertes',
    description: 'FIFO vs FEFO, organisation des refrigerateurs, etiquetage, impact sur le food cost : tout pour reduire votre gaspillage a moins de 2%.',
    type: 'article',
  },
  {
    path: '/blog/comment-ouvrir-restaurant-guide-complet',
    title: 'Comment ouvrir un restaurant en 2026 : guide complet etape par etape',
    description: 'Les 10 etapes pour creer votre restaurant : concept, business plan, financement, licences, recrutement. Couts reels et aides disponibles.',
    type: 'article',
  },
  {
    path: '/blog/prime-cost-restaurant',
    title: "Prime cost en restauration : l'indicateur n1 de rentabilite",
    description: "Food cost + masse salariale = prime cost. Benchmarks, formule complete et plan d'action pour passer de 72% a 62% en 3 mois.",
    type: 'article',
  },
  {
    path: '/blog/regle-30-30-30-10-restaurant',
    title: 'Regle 30/30/30/10 restaurant : guide complet 2026 (food cost, personnel, charges, marge)',
    description: "Comprendre la regle 30/30/30/10 en restauration : 30% food cost + 30% masse salariale + 30% charges + 10% marge nette. Adaptations par segment, calculs, erreurs courantes.",
    type: 'article',
  },
  {
    path: '/blog/taux-occupation-restaurant',
    title: "Taux d'occupation restaurant : calcul, benchmarks et 8 leviers",
    description: "RevPASH, taux de remplissage, rotation des tables : comment maximiser le chiffre d'affaires de chaque place disponible.",
    type: 'article',
  },
  {
    path: '/blog/augmenter-ticket-moyen-restaurant',
    title: 'Augmenter le ticket moyen de son restaurant : 10 techniques',
    description: "Upselling boissons, suggestion desserts, formule premium, design de carte : 10 methodes concretes avec l'impact chiffre sur votre CA annuel.",
    type: 'article',
  },
  {
    path: '/blog/5-ratios-cles-restaurant',
    title: "Les 5 ratios cles d'un restaurant rentable en 2026 (avec formules)",
    description: "Decouvrez les 5 ratios essentiels pour piloter votre restaurant : food cost, prime cost, ratio personnel, ticket moyen, taux occupation. Formules, benchmarks et seuils d'alerte par segment.",
    type: 'article',
  },
  {
    path: '/blog/inventaire-restaurant-guide',
    title: "Faire l'inventaire de son restaurant : methode et outils 2026",
    description: 'Quotidien, hebdomadaire, mensuel : quelle frequence selon les produits ? Methode pas a pas, calcul de rotation et modele de tableau.',
    type: 'article',
  },
  {
    path: '/blog/fixer-prix-carte-restaurant',
    title: 'Comment fixer les prix de sa carte de restaurant : methode et strategie',
    description: '3 methodes (cout, valeur percue, concurrence), coefficients multiplicateurs par poste, psychologie des prix et comment augmenter sans perdre de clients.',
    type: 'article',
  },
  {
    path: '/blog/charges-sociales-restauration',
    title: 'Charges sociales en restauration : guide 2026 (taux, exonerations, URSSAF)',
    description: '40-45% du salaire brut en charges patronales. Taux CCN HCR 2026, reduction Fillon, comparatif CDI/CDD/extras/apprentis avec cout employeur reel.',
    type: 'article',
  },
  {
    path: '/blog/cout-revient-plat-restaurant',
    title: "Calculer le cout de revient d'un plat : methode complete restaurateurs",
    description: "5 etapes, ratio de perte par produit, exemple boeuf bourguignon, seuil d'alerte a 35% et mise a jour automatique quand les prix fournisseurs changent.",
    type: 'article',
  },
  {
    path: '/blog/logiciel-gestion-restaurant',
    title: "Logiciel de gestion restaurant : comparatif et guide d'achat 2026",
    description: '8 solutions comparees (Lightspeed, Skello, Inpulse, RestauMargin). Stack ideal selon la taille et calcul du ROI sur 12 mois.',
    type: 'article',
  },
  {
    path: '/blog/rotation-stocks-restaurant',
    title: 'Rotation des stocks en restauration : calcul, benchmarks et optimisation',
    description: 'Formule, benchmarks par categorie (viandes 3-4j, poissons 1-2j, secs 30-60j), 6 leviers et impact sur la tresorerie immobilisee.',
    type: 'article',
  },
  {
    path: '/blog/budget-previsionnel-restaurant',
    title: 'Budget previsionnel restaurant : comment le construire en 2026',
    description: 'Structure, methodes top-down vs bottom-up, tableau 12 mois et les 5 postes qui derivent le plus souvent. Pilotage mensuel budget vs reel.',
    type: 'article',
  },
  {
    path: '/blog/salaire-proprietaire-restaurant',
    title: 'Combien gagne un proprietaire de restaurant en 2026 ? (chiffres reels)',
    description: "Salaire moyen d'un proprietaire de restaurant en France 2026 : 30-80keur/an selon segment, taille, ville. Decomposition revenus, statut juridique (SARL/SAS), dividendes vs salaire, optimisation.",
    type: 'article',
  },
  {
    path: '/blog/prevision-ventes-restaurant',
    title: 'Prevision des ventes en restauration : methodes et outils 2026',
    description: 'Historique N-1, moyennes mobiles, facteurs meteo/evenements. Commander juste et staffer juste pour eviter gaspillage et ruptures.',
    type: 'article',
  },
  {
    path: '/blog/formation-personnel-restauration',
    title: 'Formation du personnel en restauration : obligations, aides et pratiques 2026',
    description: 'OPCO Mobilites, CPF, formations prioritaires (HACCP, upselling, outils digitaux). ROI concret et plan de formation annuel pas a pas.',
    type: 'article',
  },
  {
    path: '/blog/strategie-digitale-restaurant',
    title: 'Strategie digitale pour restaurant : attirer et fideliser des clients en 2026',
    description: 'Google Business Profile, Instagram, TikTok, gestion des avis, reservation en ligne. Budget recommande et actions concretes par niveau.',
    type: 'article',
  },
  {
    path: '/blog/chiffre-affaires-restaurant-comment-calculer',
    title: "Chiffre d'affaires restaurant : calculer, analyser, augmenter en 2026",
    description: 'Formule CA, TVA 10%/20%, analyse par service et par creneau, 5 leviers de croissance et projection sur 12 mois selon les scenarios.',
    type: 'article',
  },
  {
    path: '/blog/calendrier-haccp-restaurant-modele-gratuit',
    title: 'Calendrier HACCP restaurant : modele gratuit 2026 (telechargeable)',
    description: "Toutes les frequences de controle obligatoires, les temperatures reglementaires, et un modele pret a imprimer pour transformer votre HACCP en routine d'equipe.",
    type: 'article',
  },
  {
    path: '/blog/livraison-restaurant-rentabilite',
    title: 'Livraison restaurant : comment la rentabiliser sans se faire avoir',
    description: 'Uber Eats, Deliveroo, JustEat : commissions, marge reelle livraison, plateformes vs propre canal. Cas chiffres et plan d action.',
    type: 'article',
  },
  {
    path: '/blog/ouvrir-food-truck-france-guide',
    title: 'Ouvrir un food truck en France : guide complet 2026',
    description: "Reglementation, couts d'investissement, choix du vehicule, statuts juridiques, emplacements rentables, plan de rentabilite chiffre.",
    type: 'article',
  },
  {
    path: '/blog/contrat-travail-restauration-guide',
    title: 'Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026',
    description: 'CCN HCR, mentions obligatoires, cout employeur reel, contrat d extra et apprentissage : le guide complet 2026.',
    type: 'article',
  },
  {
    path: '/blog/reduire-facture-energie-restaurant',
    title: "Reduire sa facture d'energie en restauration : 10 actions concretes",
    description: "Audit cuisine, equipements A+++, negociation contrats gaz/electricite, CEE : 20 a 40% d'economies accessibles cette semaine.",
    type: 'article',
  },
  {
    path: '/blog/allergenes-restaurant-obligations-legales',
    title: 'Allergenes en restauration : obligations legales et affichage 2026',
    description: "Les 14 allergenes INCO, modeles d'affichage, sanctions DDPP, allergie severe vs intolerance, bonnes pratiques en cuisine.",
    type: 'article',
  },
  {
    path: '/blog/fideliser-clients-restaurant-strategies',
    title: 'Fideliser ses clients restaurant : programmes et strategies 2026',
    description: "Carte tampon, CRM, anniversaires, NPS : les strategies concretes pour transformer vos clients occasionnels en habitues rentables et reduire votre cout d'acquisition.",
    type: 'article',
  },
  {
    path: '/blog/construire-carte-vins-restaurant',
    title: 'Carte des vins restaurant : guide pour maximiser la marge 2026',
    description: 'Comment construire une carte des vins rentable : nombre de references, coefficients multiplicateurs, rotation cave et presentation.',
    type: 'article',
  },
  // === Pages transactionnelles SEO (Wave 3+5+6+7) ===
  {
    path: '/alternative-zenchef',
    title: 'Alternative Zenchef : RestauMargin (29€/mois) | Comparatif 2026',
    description: 'Vous cherchez une alternative a Zenchef plus abordable et plus complete ? RestauMargin offre gestion des marges + food cost + IA des 29€/mois. Comparatif complet.',
  },
  {
    path: '/alternative-innovorder',
    title: 'Alternative Innovorder | RestauMargin (29€/mois) | Comparatif 2026',
    description: 'Innovorder = POS + click and collect. RestauMargin = gestion marge + food cost (29€/mois). Comparatif honnete 2026.',
  },
  {
    path: '/alternative-hubrise',
    title: 'Alternative Hubrise | RestauMargin food cost | Comparatif 2026',
    description: 'Hubrise = hub integrations livraison. RestauMargin = gestion food cost + marges (29€/mois). Comparaison et complementarite 2026.',
  },
  {
    path: '/alternative-lightspeed',
    title: 'Alternative Lightspeed Restaurant | RestauMargin food cost | 2026',
    description: 'Lightspeed = POS premium (89-200€/mois). RestauMargin = gestion marge + food cost (29€/mois). Comparatif honnete 2026.',
  },
  {
    path: '/alternative-laddition',
    title: "Alternative L'Addition | RestauMargin food cost 29€/mois | 2026",
    description: "L'Addition = POS francais leader. RestauMargin = gestion food cost + marges. Comparatif honnete 2026.",
  },
  {
    path: '/alternative-thefork',
    title: 'Alternative TheFork Manager | RestauMargin food cost | 2026',
    description: 'TheFork Manager = reservations + marketing. RestauMargin = gestion food cost + marges + IA. Comparatif 2026.',
  },
  {
    path: '/logiciel-marge-restaurant',
    title: 'Logiciel de marge restaurant : RestauMargin (29€/mois)',
    description: 'Logiciel pour calculer la marge de votre restaurant. Food cost, fiches techniques, mercuriale, IA. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-bistrot',
    title: 'Logiciel de marge bistrot brasserie | Food cost cuisine francaise 2026',
    description: 'Logiciel de gestion marge bistrot et brasserie. Suivi food cost cuisine francaise, fiches techniques, fournisseurs. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-boulangerie',
    title: 'Logiciel marge boulangerie | Food cost patisserie | RestauMargin',
    description: 'Logiciel de calcul de marge pour boulangeries et patisseries. Cout matiere, prix de vente, rendement farine. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-pizzeria',
    title: 'Logiciel marge pizzeria | Food cost pizza | RestauMargin',
    description: 'Logiciel pour calculer la marge d une pizzeria. Cout pate, garniture, livraison. Food cost cible 22-25%. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-gastronomique',
    title: 'Logiciel marge restaurant gastronomique etoile | RestauMargin',
    description: 'Logiciel pour piloter marges restaurant gastronomique etoile. Food cost 32-40%, brigades importantes, produits nobles. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-dark-kitchen',
    title: 'Logiciel marge dark kitchen | Ghost kitchen rentabilite | RestauMargin',
    description: 'Logiciel pour calculer marge dark kitchen. Commissions plateformes, multi-marques, packaging. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-food-truck',
    title: 'Logiciel marge food truck | Food cost + emplacements | RestauMargin',
    description: 'Logiciel pour calculer marge food truck. Specificites mobile, emplacements, meteo. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-sushi',
    title: 'Logiciel marge sushi | Food cost saumon thon | RestauMargin',
    description: 'Logiciel pour calculer marge restaurant sushi japonais. Food cost 30-35%, ingredients chers, gestion FIFO poisson. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-burger',
    title: 'Logiciel marge burger restaurant | Food cost smash | RestauMargin',
    description: 'Logiciel pour calculer la marge burger. Food cost 28-32%, steak, pain artisan, livraison. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-creperie',
    title: 'Logiciel marge creperie | Food cost galettes + crepes | RestauMargin',
    description: 'Logiciel pour calculer marge creperie. Food cost 22-26%, sarrasin, beurre breton AOP, cidre. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-salad-bar',
    title: 'Logiciel marge salad bar healthy | Food cost poke bowl | RestauMargin',
    description: 'Logiciel pour calculer marge salad bar, poke bowl, healthy restaurant. Food cost 30-35%, gestion ingredients frais. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-kebab',
    title: 'Logiciel marge kebab doner | Food cost sandwich | RestauMargin',
    description: 'Logiciel pour calculer marge kebab, doner, sandwicherie. Food cost cible 25-30%, gestion broche. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-cafe-bar',
    title: 'Logiciel marge cafe bar | Coefficient boissons | RestauMargin',
    description: 'Logiciel pour calculer marge cafe, bar, brasserie de quartier. Marge boissons 80-85%, gestion stocks alcool. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-glacier',
    title: 'Logiciel marge glacier salon de the | Food cost glace | RestauMargin',
    description: 'Logiciel pour calculer marge glacier, salon de the. Food cost 20-25%, marge boules 75-80%. Essai gratuit 7 jours.',
  },
  {
    path: '/comparatif-logiciels-restaurant',
    title: 'Comparatif logiciels restaurant 2026 | 12 outils analyses | RestauMargin',
    description: 'Comparatif honnete de 12 logiciels restaurant en 2026 : RestauMargin, Lightspeed, Zenchef, Innovorder, Hubrise, TheFork, L Addition. Prix, fonctionnalites, avis.',
  },
  {
    path: '/glossaire-restauration',
    title: 'Glossaire restauration 2026 | 60+ definitions food cost, marge, KPI | RestauMargin',
    description: 'Glossaire complet de la restauration. 60+ termes definis : food cost, marge, prime cost, fiche technique, HACCP, GMP, RevPASH. Guide de reference 2026.',
  },
  {
    path: '/outils/calculateur-marge-restaurant',
    title: 'Calculateur marge restaurant gratuit | Food cost + coefficient | RestauMargin',
    description: 'Outil gratuit pour calculer la marge brute, le food cost et le coefficient multiplicateur de votre plat. Sans inscription, en 2 minutes.',
  },
  {
    path: '/outils/calculateur-food-cost',
    title: 'Calculateur de Food Cost Restaurant Gratuit | RestauMargin',
    description: 'Calculez gratuitement le food cost de vos plats. Outil en ligne pour restaurateurs : cout matiere, prix de vente, marge brute par recette.',
  },
  {
    path: '/outils/generateur-qr-menu',
    title: 'Generateur de QR Code Menu Restaurant Gratuit | RestauMargin',
    description: 'Generez gratuitement un QR code pour le menu digital de votre restaurant. Simple, rapide et personnalisable.',
  },
  {
    path: '/station-produit',
    title: 'Station de Pesee Connectee — RestauMargin',
    description: 'Pesez vos ingredients en temps reel avec la station de pesee connectee RestauMargin. Compatible balance Bluetooth.',
  },
  {
    path: '/mentions-legales',
    title: 'Mentions Legales — RestauMargin',
    description: 'Mentions legales de RestauMargin, plateforme SaaS de gestion de marge pour restaurateurs.',
  },
  {
    path: '/cgv',
    title: 'Conditions Generales de Vente — RestauMargin',
    description: 'CGV de RestauMargin. Conditions generales de vente et abonnement.',
  },
  {
    path: '/cgu',
    title: "Conditions Generales d'Utilisation — RestauMargin",
    description: "CGU de RestauMargin. Conditions generales d'utilisation de la plateforme.",
  },
  {
    path: '/politique-confidentialite',
    title: 'Politique de Confidentialite — RestauMargin',
    description: 'Politique de confidentialite et protection des donnees personnelles de RestauMargin. Conforme RGPD.',
  },
];

function run() {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('[prerender] dist/index.html not found. Run vite build first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');
  let count = 0;

  for (const route of ROUTES) {
    let html = baseHtml;
    const fullUrl = `${BASE_URL}${route.path}`;
    const fullTitle = route.title.includes('RestauMargin') ? route.title : `${route.title} | RestauMargin`;
    const ogType = route.type || 'website';

    // Replace <title>
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${fullTitle}</title>`
    );

    // Replace meta description
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${route.description}"`
    );

    // Replace canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${fullUrl}"`
    );

    // Replace OG tags
    html = html.replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${fullTitle}"`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${route.description}"`
    );
    html = html.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${fullUrl}"`
    );
    html = html.replace(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="${ogType}"`
    );

    // Replace Twitter tags
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${fullTitle}"`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${route.description}"`
    );

    // Write the file
    const dir = path.join(DIST, route.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    count++;
  }

  console.log(`[prerender] Generated ${count} static HTML files for SEO.`);
}

run();
