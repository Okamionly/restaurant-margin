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
    path: '/temoignages',
    title: 'Témoignages clients RestauMargin : avis de restaurateurs (2026)',
    description: "Avis et retours de restaurateurs qui ont gagné en marge avec RestauMargin : food cost maîtrisé, fiches techniques, mercuriale et menu engineering. Résultats chiffrés par établissement.",
  },
  {
    path: '/launch',
    title: 'RestauMargin : le logiciel de marge restaurant tout-en-un (lancement 2026)',
    description: "Calculez vos marges, votre food cost et vos fiches techniques en quelques minutes. IA cuisine, OCR factures, mercuriale et menu engineering. Essai gratuit 7 jours, 29 EUR/mois ensuite.",
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
    path: '/guide-marge/creperie',
    title: 'Calcul de marge creperie : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre creperie. Food cost sarrasin, beurre breton AOP, gestion garnitures, cidre et optimisation prix par galette et crepe.",
  },
  {
    path: '/demo',
    title: 'Demo — RestauMargin',
    description: 'Testez RestauMargin gratuitement. Decouvrez la plateforme de gestion de marge pour restaurateurs avec fiches techniques, food cost et IA.',
  },
  // === Pages Fonctionnalités (8 modules + index) — 2026-05-28 ===
  {
    path: '/fonctionnalites',
    title: 'Fonctionnalités RestauMargin | 8 modules pour piloter une cuisine rentable',
    description: 'Les 8 modules RestauMargin : commandes fournisseurs, IA cuisine, fiches techniques, mercuriale & alertes prix, pesage Bluetooth, HACCP digital, OCR factures et Menu Engineering.',
  },
  {
    path: '/fonctionnalites/commandes-fournisseurs',
    title: 'Commandes fournisseurs en 1 clic | Logiciel restaurant RestauMargin',
    description: "Automatisez vos commandes fournisseurs : l'IA suggere les quantites, le bon de livraison est pre-rempli, envoi Email ou WhatsApp en 1 clic. Fini les oublis et erreurs de saisie.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/ia-cuisine',
    title: "L'IA qui parle cuisine | Intelligence artificielle restaurant | RestauMargin",
    description: "Dictez votre recette, l'IA structure ingredients, allergenes et cout automatiquement. 19 actions IA pour optimiser vos marges. Propulse par Claude. Sans jargon SaaS.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/fiches-techniques',
    title: 'Fiches techniques restaurant en 10s | Food cost auto | RestauMargin',
    description: "Creez vos fiches techniques en 10 secondes : food cost, marge, coefficient et allergenes calcules en temps reel. Mise a jour auto quand les prix changent. Pret pour l'inspection.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/mercuriale-alertes-prix',
    title: 'Mercuriale & alertes prix fournisseurs | RestauMargin',
    description: "Suivi automatique des prix fournisseurs dans le temps. Alerte des qu'un prix derive. Detectez les hausses avant qu'elles grignotent vos marges. Historique trace pour negocier.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/pesage-bluetooth',
    title: 'Pesage Bluetooth en cuisine | Balance connectee restaurant | RestauMargin',
    description: "Balance Bluetooth connectee a vos fiches techniques. Pesez en plein service, le poids et le cout s'inscrivent tout seuls. Fini les post-it et les food cost approximatifs.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/haccp-digital',
    title: 'HACCP digital restaurant | Plan de maitrise sanitaire numerique | RestauMargin',
    description: "HACCP digital : releves temperature, nettoyage et tracabilite en 1 tap. Generation PDF pret pour l'inspection DDPP. Fini le classeur papier et les releves oublies.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/ocr-factures',
    title: 'OCR factures fournisseurs restaurant | Scan auto en 4s | RestauMargin',
    description: "Photographiez votre facture fournisseur, l'OCR injecte les prix dans la mercuriale en 4 secondes. Zero saisie manuelle, zero erreur, mercuriale toujours a jour.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/menu-engineering',
    title: 'Menu Engineering restaurant | Matrice Stars/Puzzles/Dogs | RestauMargin',
    description: "Menu Engineering automatique : RestauMargin croise food cost et ventes pour classer vos plats (Stars, Puzzles, Plowhorses, Dogs). Savez quel plat retirer avant qu'il vous coute cher.",
    type: 'article',
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
    title: 'Food cost restaurant : calcul, formule et benchmarks (guide 2026)',
    description: 'Le food cost en restauration explique de A a Z : formule exacte, exemple chiffre, benchmarks par type de restaurant, food cost moyen France 2026, 10 leviers pour le reduire. Guide complet.',
    type: 'article',
  },
  {
    path: '/blog/tva-restaurant',
    title: 'TVA restaurant 2026 : taux 10%, 5,5% et 20% expliques (sur place, a emporter, alcool)',
    description: 'Quel taux de TVA appliquer en restauration en 2026 ? 10 % consommation immediate, 5,5 % vente conditionnee, 20 % alcool. Regles sur place vs a emporter, ventilation, exemple chiffre et impact sur la marge.',
    type: 'article',
  },
  {
    path: '/blog/coefficient-multiplicateur',
    title: 'Coefficient multiplicateur restaurant 2026 : calcul + formule + exemples (guide complet)',
    description: 'Coefficient multiplicateur restaurant : formule, calcul pas a pas, valeurs cibles par segment (bistrot 3.5, gastro 4.5, pizzeria 3.0). Exemples chiffres, erreurs courantes et calculateur gratuit.',
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
    path: '/blog/psychologie-des-prix-restaurant',
    title: 'Psychologie des prix en restauration : 7 techniques pour vendre plus (2026)',
    description: 'Decouvrez 7 techniques de psychologie des prix prouvees (ancrage, prix de charme, golden triangle, bundling) pour augmenter votre ticket moyen de 15 a 25% sans toucher a vos recettes.',
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
    path: '/blog/pourquoi-mon-restaurant-ne-rapporte-pas',
    title: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions 2026",
    description: "Votre restaurant tourne mais ne rapporte rien ? Diagnostic complet des 10 causes principales : food cost derive, masse salariale, gaspillage, mauvaise carte, fournisseurs trop chers. Plan d'action concret.",
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
  {
    path: '/blog/plat-le-plus-rentable-restaurant',
    title: 'Quel est le plat le plus rentable dans un restaurant en 2026 ? (top 15)',
    description: "Decouvrez les plats les plus rentables d'un restaurant en 2026 : pates, pizza, salade, soupe, dessert maison. Top 15 avec marge brute, food cost et coefficient. Comment construire une carte ultra-rentable.",
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
    path: '/logiciel-marge-traiteur',
    title: 'Logiciel marge traiteur | Food cost et devis traiteur | RestauMargin',
    description: "Logiciel pour calculer la marge d'un traiteur evenementiel. Cout prestation, main d'oeuvre, devis, food cost cible 28-35%. Essai gratuit 7 jours.",
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
    path: '/comparatif-restaumargin-vs-zenchef',
    title: 'RestauMargin vs Zenchef : comparatif complet 2026 (prix, features, avis)',
    description: 'Comparatif benchmark RestauMargin vs Zenchef en 2026. Prix, fonctionnalites, food cost, reservations, gestion marge. Quelle solution choisir selon votre restaurant ? Verdict honnete.',
    type: 'article',
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

    // ─── CRITICAL SEO FIX: inject UNIQUE static content INSIDE <div id="root"> ───
    // Each page now gets category-specific content (not just title), avoiding duplicate
    // content penalties. React hydrates seamlessly on top on the client side.
    const h1 = route.title.replace(/ \| RestauMargin$/, '').replace(/ — RestauMargin$/, '');

    // Determine category for content templating
    const category =
      route.path.startsWith('/blog/') ? 'article' :
      route.path.startsWith('/guide-marge/') ? 'guide' :
      route.path.startsWith('/alternative-') ? 'comparison' :
      route.path.startsWith('/comparatif-') ? 'mega-comparison' :
      route.path === '/glossaire-restauration' ? 'glossary' :
      route.path.startsWith('/logiciel-marge-') ? 'niche' :
      route.path.startsWith('/outils/') ? 'tool' :
      'landing';

    const breadcrumbs =
      category === 'article' ? 'Accueil &gt; Blog' :
      category === 'guide' ? 'Accueil &gt; Guides' :
      category === 'comparison' || category === 'mega-comparison' ? 'Accueil &gt; Comparatifs' :
      category === 'niche' ? 'Accueil &gt; Logiciels métier' :
      category === 'tool' ? 'Accueil &gt; Outils gratuits' :
      category === 'glossary' ? 'Accueil &gt; Ressources' :
      'Accueil';

    const lastSegment = route.path.split('/').filter(Boolean).pop() || 'page';
    const breadcrumbLabel = lastSegment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Extract main keyword from title (first 4-5 words before separator)
    const mainKw = h1.split(/[:|—|·]/)[0].trim().substring(0, 60);

    // Category-specific featured snippet text (varied to avoid duplicate phrases)
    const snippetTexts = {
      article: `<strong>${mainKw}</strong> — guide complet 2026 avec formules détaillées, exemples chiffrés par type de restaurant, benchmarks sectoriels et erreurs courantes à éviter. Tout ce que vous devez savoir pour piloter vos marges au quotidien.`,
      guide: `<strong>${mainKw}</strong> — guide pratique 2026 spécifique à votre type d'établissement. Découvrez les food cost cibles, coefficients multiplicateurs adaptés, charges spécifiques et benchmarks de rentabilité pour votre segment.`,
      comparison: `<strong>${mainKw}</strong> — comparatif honnête 2026 entre RestauMargin (gestion food cost et marges) et la solution analysée. Prix, fonctionnalités, cas d'usage et profils restaurateurs adaptés à chaque outil.`,
      'mega-comparison': `<strong>${mainKw}</strong> — analyse comparative 2026 de 12 logiciels restaurant. Tableau benchmark des 25+ critères clés, profils restaurateurs, recommandations par segment et ROI sur 12 mois.`,
      niche: `<strong>${mainKw}</strong> — logiciel SaaS spécifiquement conçu pour votre métier en 2026. Food cost cible, coefficients multiplicateurs adaptés, exemples chiffrés et cas concrets de transformation.`,
      tool: `<strong>${mainKw}</strong> — outil interactif gratuit RestauMargin 2026. Saisissez vos données, obtenez un calcul instantané et téléchargez votre rapport personnalisé. Sans inscription.`,
      glossary: `<strong>${mainKw}</strong> — glossaire exhaustif 2026 des termes essentiels de la restauration : food cost, prime cost, fiche technique, HACCP, RevPASH, marge brute. 60+ définitions précises avec exemples.`,
      landing: `<strong>${mainKw}</strong> — la plateforme tout-en-un pour piloter votre restaurant en 2026. Calcul automatique des marges, fiches techniques par IA, mercuriale fournisseurs intelligente, alertes prix et tableau de bord temps réel.`,
    };

    // Category-specific secondary H2 + paragraph (varies content significantly)
    const secondaryContent = {
      article: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Sommaire de l'article</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
          <li>Définitions et formules essentielles à connaître</li>
          <li>Méthode de calcul pas à pas avec exemples chiffrés</li>
          <li>Benchmarks et ratios cibles par type d'établissement</li>
          <li>Erreurs courantes et comment les éviter</li>
          <li>Leviers concrets pour optimiser ce KPI</li>
          <li>FAQ avec les 8 à 12 questions les plus fréquentes</li>
        </ul>`,
      guide: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Au programme de ce guide</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
          <li>Spécificités économiques de votre métier</li>
          <li>Food cost cible et coefficient multiplicateur recommandés</li>
          <li>Décomposition détaillée des coûts de production</li>
          <li>Tableau benchmark par plat type</li>
          <li>Leviers d'optimisation propres au segment</li>
          <li>Cas concret avant/après chiffré</li>
        </ul>`,
      comparison: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Que contient ce comparatif ?</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
          <li>Vue d'ensemble et positionnement de chaque outil</li>
          <li>Tableau comparatif détaillé sur 18 à 25 critères clés</li>
          <li>Comparatif tarifaire sur 12 mois (formules incluses)</li>
          <li>Cas d'usage par profil de restaurateur</li>
          <li>Témoignages anonymisés équilibrés</li>
          <li>FAQ 10 à 12 questions sur le choix entre les deux solutions</li>
        </ul>`,
      'mega-comparison': `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Méthodologie du comparatif</h2>
        <p>Notre comparatif analyse 12 logiciels de gestion restaurant sur 15 critères répartis en 6 catégories : économie (prix, ROI), gestion opérationnelle (food cost, fiches techniques), acquisition client (réservations, marketing), terrain (POS, mobile), expérience (UX, onboarding) et innovation (IA, intégrations). Aucun éditeur ne nous rémunère pour son classement.</p>`,
      niche: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pourquoi un logiciel dédié à votre métier ?</h2>
        <p>Chaque type d'établissement a des spécificités économiques uniques : food cost cible différent, coefficient multiplicateur adapté, charges propres, saisonnalité, type de fournisseurs et structure de menu. Un logiciel généraliste ne capture pas ces nuances. RestauMargin propose des templates et benchmarks calibrés pour votre segment précis.</p>`,
      tool: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Comment utiliser cet outil ?</h2>
        <ol style="padding-left:20px;color:#525252;line-height:1.8">
          <li>Saisissez vos paramètres dans le formulaire interactif</li>
          <li>Visualisez le calcul instantané et les recommandations</li>
          <li>Téléchargez le rapport PDF avec votre situation actuelle</li>
          <li>Comparez à nos benchmarks par segment de restaurant</li>
        </ol>`,
      glossary: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Comment utiliser ce glossaire ?</h2>
        <p>Notre glossaire couvre 60+ termes essentiels de la restauration moderne classés de A à Z : food cost, prime cost, marge brute et nette, coefficient multiplicateur, fiche technique, HACCP, RevPASH, AOP/IGP, FIFO, etc. Pour chaque terme, vous obtenez une définition courte, une description approfondie avec exemple chiffré, et un lien vers l'article correspondant.</p>`,
      landing: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pourquoi RestauMargin ?</h2>
        <p>RestauMargin réunit en une seule application tout ce qui était auparavant éparpillé sur plusieurs outils : calcul automatique du food cost et des marges, fiches techniques précises avec grammages et coûts, mercuriale fournisseurs intelligente, alertes prix matières premières, station de pesée Bluetooth, commandes fournisseurs optimisées par IA et tableau de bord temps réel. Plan Pro à 29 €/mois, essai gratuit 7 jours.</p>`,
    };

    const snippetText = snippetTexts[category] || snippetTexts.landing;
    const secondary = secondaryContent[category] || secondaryContent.landing;

    // Article-related links vary by category to avoid showing identical "Articles connexes"
    const relatedLinks = {
      article: [
        ['/blog/calcul-marge-restaurant', 'Marge restaurant 2026 : calcul, formule, food cost'],
        ['/blog/coefficient-multiplicateur', 'Coefficient multiplicateur restaurant 2026'],
        ['/blog/reduire-food-cost', 'Réduire le food cost : 10 stratégies'],
        ['/blog/prime-cost-restaurant', 'Prime cost : l\'indicateur n°1 de rentabilité'],
        ['/blog/faq-marge-restaurant-25-questions', 'FAQ Marge : 25 questions essentielles'],
      ],
      guide: [
        ['/blog/calcul-marge-restaurant', 'Calcul marge restaurant : guide complet'],
        ['/logiciel-marge-bistrot', 'Logiciel marge bistrot et brasserie'],
        ['/logiciel-marge-pizzeria', 'Logiciel marge pizzeria'],
        ['/logiciel-marge-gastronomique', 'Logiciel marge restaurant gastronomique'],
        ['/blog/seuil-rentabilite-restaurant', 'Seuil de rentabilité restaurant'],
      ],
      comparison: [
        ['/comparatif-logiciels-restaurant', 'Comparatif 12 logiciels restaurant 2026'],
        ['/alternative-zenchef', 'Alternative Zenchef'],
        ['/alternative-lightspeed', 'Alternative Lightspeed Restaurant'],
        ['/blog/logiciel-gestion-restaurant', 'Logiciel gestion restaurant : guide d\'achat'],
        ['/pricing', 'Tarifs RestauMargin'],
      ],
      'mega-comparison': [
        ['/alternative-zenchef', 'RestauMargin vs Zenchef'],
        ['/alternative-innovorder', 'RestauMargin vs Innovorder'],
        ['/alternative-lightspeed', 'RestauMargin vs Lightspeed'],
        ['/blog/logiciel-gestion-restaurant', 'Comparatif logiciels gestion restaurant'],
        ['/pricing', 'Voir nos tarifs'],
      ],
      niche: [
        ['/blog/calcul-marge-restaurant', 'Méthode de calcul de marge complète'],
        ['/blog/food-cost-restaurant', 'Réduire le food cost'],
        ['/blog/coefficient-multiplicateur', 'Coefficient multiplicateur par segment'],
        ['/outils/calculateur-marge-restaurant', 'Calculateur de marge gratuit'],
        ['/comparatif-logiciels-restaurant', 'Comparatif logiciels restaurant'],
      ],
      tool: [
        ['/blog/calcul-marge-restaurant', 'Comprendre le calcul de marge'],
        ['/blog/coefficient-multiplicateur', 'Coefficient multiplicateur expliqué'],
        ['/blog/reduire-food-cost', 'Réduire votre food cost'],
        ['/outils/calculateur-food-cost', 'Calculateur de food cost'],
        ['/pricing', 'Découvrir RestauMargin'],
      ],
      glossary: [
        ['/blog/calcul-marge-restaurant', 'Guide complet calcul marge restaurant'],
        ['/blog/prime-cost-restaurant', 'Définition prime cost'],
        ['/blog/faq-marge-restaurant-25-questions', 'FAQ : 25 questions essentielles'],
        ['/blog/coefficient-multiplicateur', 'Coefficient multiplicateur'],
        ['/blog/fiche-technique-restaurant', 'Fiche technique restaurant'],
      ],
      landing: [
        ['/blog/calcul-marge-restaurant', 'Calculer la marge de votre restaurant'],
        ['/blog/reduire-food-cost', 'Réduire le food cost : 10 stratégies'],
        ['/comparatif-logiciels-restaurant', 'Comparatif 12 logiciels restaurant'],
        ['/glossaire-restauration', 'Glossaire restauration 60+ termes'],
        ['/pricing', 'Tarifs : Pro 29€/mois, Business 79€/mois'],
      ],
    };

    const linksList = (relatedLinks[category] || relatedLinks.landing)
      .map(([href, label]) => `<li><a href="${href}" style="color:#0d9488;text-decoration:none">${label}</a></li>`)
      .join('');

    // ─── BreadcrumbList Schema (rich snippet "navigation visible" dans Google) ───
    const breadcrumbCategoryUrl =
      category === 'article' ? `${BASE_URL}/blog` :
      category === 'guide' ? `${BASE_URL}/blog` :
      category === 'comparison' || category === 'mega-comparison' ? `${BASE_URL}/comparatif-logiciels-restaurant` :
      category === 'niche' ? `${BASE_URL}/logiciel-marge-restaurant` :
      category === 'tool' ? `${BASE_URL}/outils/calculateur-marge-restaurant` :
      category === 'glossary' ? `${BASE_URL}/glossaire-restauration` :
      `${BASE_URL}/`;

    const breadcrumbCategoryName =
      category === 'article' || category === 'guide' ? 'Blog' :
      category === 'comparison' || category === 'mega-comparison' ? 'Comparatifs' :
      category === 'niche' ? 'Logiciels métier' :
      category === 'tool' ? 'Outils gratuits' :
      category === 'glossary' ? 'Ressources' :
      'Accueil';

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
        category !== 'landing'
          ? { '@type': 'ListItem', position: 2, name: breadcrumbCategoryName, item: breadcrumbCategoryUrl }
          : null,
        category !== 'landing'
          ? { '@type': 'ListItem', position: 3, name: breadcrumbLabel, item: fullUrl }
          : null,
      ].filter(Boolean),
    };

    const breadcrumbSchemaScript = `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

    // Inject BreadcrumbList schema in <head> (before </head>)
    html = html.replace('</head>', `  ${breadcrumbSchemaScript}\n  </head>`);

    const seoStaticContent = `
      <article style="max-width:800px;margin:0 auto;padding:48px 20px;font-family:'Inter',system-ui,sans-serif;color:#111111;line-height:1.6">
        <nav style="font-size:13px;color:#737373;margin-bottom:24px" aria-label="Fil d'Ariane"><a href="/" style="color:#0d9488;text-decoration:none">${breadcrumbs}</a> &gt; <span>${breadcrumbLabel}</span></nav>
        <h1 style="font-size:36px;font-weight:800;line-height:1.2;margin:0 0 16px 0;color:#111111">${h1}</h1>
        <p style="font-size:18px;color:#525252;margin:0 0 32px 0">${route.description}</p>
        <div style="background:#f0fdfa;border-left:4px solid #0d9488;padding:16px 20px;border-radius:8px;margin:0 0 32px 0">
          <p style="margin:0;font-size:15px;color:#111111">${snippetText}</p>
        </div>
        ${secondary}
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pour aller plus loin</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
          ${linksList}
        </ul>
        <p style="font-size:13px;color:#737373;margin-top:48px">Chargement de l'application interactive…</p>
      </article>
    `;

    // Replace the generic <noscript> fallback with route-specific visible content
    // Pattern matches the empty <div id="root"> OR existing noscript fallback
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>(\s*<script)/,
      `<div id="root">${seoStaticContent}</div>$1`
    );

    // Write the file
    const dir = path.join(DIST, route.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    count++;
  }

  console.log(`[prerender] Generated ${count} static HTML files for SEO (with route-specific H1 + content baked in).`);
}

run();
