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
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Public routes to prerender with their SEO metadata
const ROUTES = [
  {
    path: '/login',
    title: 'Connexion — RestauMargin',
    description: "Connectez-vous à votre espace RestauMargin pour piloter vos marges, votre food cost et vos fiches techniques. Pas encore de compte ? Essai gratuit 7 jours.",
  },
  {
    path: '/pricing',
    title: 'Tarifs — RestauMargin',
    description: 'Une seule offre : RestauMargin à 19 € par mois, toutes les fonctionnalités, sans engagement. Essai gratuit 7 jours sans carte bancaire.',
  },
  {
    path: '/a-propos',
    title: 'À propos — RestauMargin',
    description: "Découvrez RestauMargin, la plateforme SaaS française de gestion de marge pour restaurateurs. Basée à Montpellier, notre mission est d'aider les chefs à maîtriser leur food cost et leurs marges.",
  },
  {
    path: '/launch',
    title: 'RestauMargin : le logiciel de marge restaurant tout-en-un (lancement 2026)',
    description: "Calculez vos marges, votre food cost et vos fiches techniques en quelques minutes. IA cuisine, OCR factures, mercuriale et menu engineering. Essai gratuit 7 jours, 19 EUR/mois ensuite.",
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
    title: 'Calcul de marge café et coffee shop : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre café ou coffee shop. Food cost café, coefficient boissons, marge pâtisserie, gestion takeaway et optimisation recettes signature.",
  },
  {
    path: '/guide-marge/burger-restaurant',
    title: 'Calcul de marge burger restaurant : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre burger restaurant. Food cost steak haché, optimisation assemblage, gestion frites et boissons, rentabilité par formule.",
  },
  {
    path: '/guide-marge/sushi-restaurant',
    title: 'Calcul de marge restaurant sushi : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre restaurant sushi. Food cost poisson cru, riz à sushi, formules plateau, gestion FIFO fraîcheur et optimisation carte japonaise.",
  },
  {
    path: '/guide-marge/kebab-fast-food',
    title: 'Calcul de marge kebab et fast-food : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre kebab ou fast-food. Food cost viande grillé, pain, sauces et garnitures. Gestion formules midi, livraison et optimisation marge par commande.",
  },
  {
    path: '/guide-marge/boulangerie-patisserie',
    title: 'Calcul de marge boulangerie-pâtisserie : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre boulangerie-pâtisserie. Food cost farine, beurre, oeufs, gestion des fournées, prix de revient par pièce et optimisation carte viennoiseries et gâteaux.",
  },
  {
    path: '/guide-marge/creperie',
    title: 'Calcul de marge crêperie : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre crêperie. Food cost sarrasin, beurre breton AOP, gestion garnitures, cidre et optimisation prix par galette et crêpe.",
  },
  {
    path: '/guide-marge/bar-pub',
    title: 'Calcul de marge bar et pub : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre bar ou pub. Food cost boissons alcoolisées, marge cocktails, gestion snacking, happy hour et optimisation de la carte des boissons.",
  },
  {
    path: '/guide-marge/restaurant-traiteur',
    title: 'Calcul de marge restaurant traiteur : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre restaurant traiteur. Food cost par convive, gestion devis événements, marge buffets, plateaux repas et optimisation de la rentabilité par prestation.",
  },
  {
    path: '/guide-marge/dark-kitchen',
    title: 'Calcul de marge dark kitchen et ghost kitchen : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre dark kitchen ou ghost kitchen. Food cost multi-marques, commissions plateformes de livraison, optimisation par canal et rentabilité marque par marque.",
  },
  {
    path: '/guide-marge/restaurant-vegan',
    title: 'Calcul de marge restaurant vegan : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre restaurant vegan ou végétarien. Food cost ingrédients végétaux, protéines alternatives, gestion bio et optimisation de la rentabilité par plat.",
  },
  {
    path: '/guide-marge/restaurant-halal',
    title: 'Calcul de marge restaurant halal : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre restaurant halal. Food cost viande halal certifiée, surcoût certification, gestion kebabs, grillades et tajines, et optimisation rentabilité par plat.",
  },
  {
    path: '/guide-marge/bistro-gastronomique',
    title: 'Calcul de marge bistro gastronomique : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre bistro gastronomique. Food cost produits du terroir et de saison, marge par formule courte, gestion de la bistronomie et optimisation prix de vente.",
  },
  {
    path: '/guide-marge/restaurant-seminaire-groupe',
    title: 'Calcul de marge restaurant séminaire et groupe : guide complet 2026',
    description: "Guide et outil pour calculer les marges de votre restaurant séminaire et groupe. Food cost par convive, tarification menus groupe, marge buffets et banquets, gestion des formules séminaires et optimisation de la rentabilité par prestation.",
  },
  {
    path: '/demo',
    title: 'Démo — RestauMargin',
    description: 'Testez RestauMargin gratuitement. Découvrez la plateforme de gestion de marge pour restaurateurs avec fiches techniques, food cost et IA.',
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
    description: "Automatisez vos commandes fournisseurs : l'IA suggère les quantités, le bon de livraison est pré-rempli, envoi Email ou WhatsApp en 1 clic. Fini les oublis et erreurs de saisie.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/ia-cuisine',
    title: "L'IA qui parle cuisine | Intelligence artificielle restaurant | RestauMargin",
    description: "Dictez votre recette, l'IA structure ingrédients, allergènes et coût automatiquement. 19 actions IA pour optimiser vos marges. Propulsé par Claude. Sans jargon SaaS.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/fiches-techniques',
    title: 'Fiches techniques restaurant en 10s | Food cost auto | RestauMargin',
    description: "Créez vos fiches techniques en 10 secondes : food cost, marge, coefficient et allergènes calculés en temps réel. Mise à jour auto quand les prix changent. Prêt pour l'inspection.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/mercuriale-alertes-prix',
    title: 'Mercuriale & alertes prix fournisseurs | RestauMargin',
    description: "Suivi automatique des prix fournisseurs dans le temps. Alerte dès qu'un prix dérive. Détectez les hausses avant qu'elles grignotent vos marges. Historique tracé pour négocier.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/pesage-bluetooth',
    title: 'Pesage Bluetooth en cuisine | Balance connectée restaurant | RestauMargin',
    description: "Balance Bluetooth connectée à vos fiches techniques. Pesez en plein service, le poids et le coût s'inscrivent tout seuls. Fini les post-it et les food cost approximatifs.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/haccp-digital',
    title: 'HACCP digital restaurant | Plan de maîtrise sanitaire numérique | RestauMargin',
    description: "HACCP digital : relevés température, nettoyage et traçabilité en 1 tap. Génération PDF prêt pour l'inspection DDPP. Fini le classeur papier et les relevés oubliés.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/ocr-factures',
    title: 'OCR factures fournisseurs restaurant | Scan auto en 4s | RestauMargin',
    description: "Photographiez votre facture fournisseur, l'OCR injecte les prix dans la mercuriale en 4 secondes. Zéro saisie manuelle, zéro erreur, mercuriale toujours à jour.",
    type: 'article',
  },
  {
    path: '/fonctionnalites/menu-engineering',
    title: 'Menu Engineering restaurant | Matrice Stars/Puzzles/Dogs | RestauMargin',
    description: "Menu Engineering automatique : RestauMargin croise food cost et ventes pour classer vos plats (Stars, Puzzles, Plowhorses, Dogs). Savez quel plat retirer avant qu'il vous coûte cher.",
    type: 'article',
  },
  {
    path: '/blog',
    title: 'Blog RestauMargin — Guides et conseils pour restaurateurs',
    description: "Articles et guides pratiques pour restaurateurs : calcul de marge, food cost, HACCP, fiches techniques, IA en restauration. Conseils d'experts pour optimiser votre restaurant.",
  },
  {
    path: '/blog/prix-vente-menu-restaurant-methode',
    title: "Calcul du prix de vente d'un menu restaurant : la méthode rentable",
    description: "Comment calculer le prix d'une formule entrée-plat-dessert avec le food cost pondéré, la règle des trois contraintes et la psychologie du prix fixe. Méthode pratique avec exemples chiffrés.",
    type: 'article',
  },
  {
    path: '/blog/calcul-marge-restaurant',
    title: 'Marge restaurant 2026 : taux moyen, calcul et formules',
    description: 'Quelle marge pour un restaurant ? Taux de marge brute moyen, marge nette, food cost : formules de calcul, exemples chiffrés et repères par type d\'établissement.',
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Quelle est la marge moyenne d'un restaurant ?</h2>
        <p style="margin:0 0 16px 0;color:#333333">En restauration, le taux de marge brute (prix de vente HT moins le coût des matières premières) se situe le plus souvent entre 65 % et 75 %, soit un food cost de 25 à 35 % et un coefficient multiplicateur de 3 à 4. Une fois le personnel, le loyer et les autres charges payés, la marge nette médiane d'un restaurant en France tombe entre 4 % et 8 % du chiffre d'affaires. Ces repères varient selon le format : une pizzeria se situe plutôt entre 72 % et 85 % de marge brute, un restaurant gastronomique entre 60 % et 70 %.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Les 4 formules essentielles de la marge restaurant</h2>
        <p style="margin:0 0 16px 0;color:#333333"><strong>Food cost (%)</strong> = (Coût matières / Prix de vente HT) x 100. <strong>Marge brute (%)</strong> = 100 - Food cost. <strong>Coefficient multiplicateur</strong> = Prix de vente HT / Coût matières. <strong>Marge nette (%)</strong> = (Résultat net / Chiffre d'affaires) x 100. Objectif standard en restauration française 2026 : food cost entre 25 % et 35 %, marge brute entre 65 % et 75 %, marge nette entre 5 % et 15 %. Le calcul se fait toujours en HT : la TVA collectée (10 % sur place, 5,5 % à emporter, 20 % sur l'alcool) ne vous appartient pas, elle est reversée à l'État.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Marge brute vs marge nette : la différence qui piège les restaurateurs</h2>
        <p style="margin:0 0 16px 0;color:#333333">La marge brute ne déduit que le coût des matières premières. La marge nette déduit en plus toutes les charges : personnel (30-45 % du CA), loyer (6-12 %), énergie (3-7 %), assurances, taxes, amortissements. Un restaurant peut afficher un excellent food cost (28 %) et une marge nette quasi nulle si ses charges de personnel sont mal maîtrisées. Exemple sur 600 000 EUR de CA annuel : marge brute de 70 % (420 000 EUR), mais après personnel, loyer et charges fixes, la marge nette retombe à 8 % (48 000 EUR). La marge nette médiane en restauration française se situe entre 4 et 8 %, contre 10-15 % aux États-Unis, en raison d'un coût du travail plus élevé (35-45 % du CA contre 25-30 %).</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Benchmarks food cost et marge par type de restaurant (France 2026)</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Type d'établissement</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Food cost cible</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Marge brute cible</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Coefficient</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Marge nette</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restauration rapide / Fast-food</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>25-30 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">70-75 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,3-4,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">8-15 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Bistrot / Brasserie</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>28-33 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">67-72 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,0-3,6</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">5-12 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant traditionnel</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>30-35 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">65-70 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">2,9-3,3</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">5-10 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Pizzeria / Crêperie</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>15-28 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">72-85 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,6-6,5</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">10-18 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Coffee shop</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>12-22 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">78-88 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">4,5-8,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">8-16 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant gastronomique</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>30-40 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">60-70 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">2,5-3,3</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3-10 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Dark kitchen / Livraison</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>28-35 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">65-72 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">2,9-3,6</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">5-12 %</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : un burger maison</h2>
        <p style="margin:0 0 16px 0;color:#333333">Coût matière total (pain brioché, steak haché 150 g, cheddar, salade/tomate/oignon, sauce maison) : <strong>2,60 EUR</strong>. Prix de vente : 11,90 EUR TTC, soit 10,82 EUR HT (TVA 10 %). <strong>Food cost = (2,60 / 10,82) x 100 = 24,0 %</strong>, dans la cible bistrot/burger. Marge brute : 8,22 EUR par burger (76,0 %), coefficient multiplicateur de 4,16. C'est ce type de calcul, répété sur chaque fiche technique, qui révèle les plats à promouvoir et ceux à repositionner.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Les 5 erreurs courantes qui détruisent votre marge</h2>
        <p style="margin:0 0 16px 0;color:#333333">Classées par fréquence : <strong>1) ne pas peser les ingrédients</strong> (portions qui varient d'un service à l'autre, jusqu'à +20 % de matière première), <strong>2) ignorer les pertes et le gaspillage</strong> (épluchures, invendus, casse : 5 à 10 % des achats), <strong>3) ne pas mettre à jour les prix fournisseurs</strong> (un écart de prix non répercuté fausse le calcul de marge de plusieurs points), <strong>4) confondre marge brute et marge nette</strong> (un food cost bas ne garantit pas un bénéfice), <strong>5) ne pas analyser la rentabilité plat par plat</strong> (promouvoir par défaut des plats à faible marge). Cumulées, ces cinq erreurs représentent 8 à 15 points de marge brute perdus, soit 48 000 à 90 000 EUR sur un restaurant à 600 000 EUR de CA annuel.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur le calcul de la marge restaurant</h2>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quel est le food cost idéal pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le food cost idéal dépend de votre type de restaurant. En règle générale, il se situe entre 25 % et 35 %. Une pizzeria peut viser 22-25 %, un restaurant gastronomique acceptera 35-40 %. L'essentiel est qu'il soit cohérent avec votre structure de charges globale.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment calculer la marge brute d'un plat ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Soustrayez le coût total des ingrédients du prix de vente HT du plat. Par exemple, si un plat se vend 18 EUR et que les ingrédients coûtent 5,40 EUR, la marge brute est de 12,60 EUR, soit 70 %. Formule : Marge brute (%) = (Prix de vente - Coût matières) / Prix de vente x 100.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quelle est la différence entre marge brute et marge nette ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La marge brute ne déduit que le coût des matières premières (food cost). La marge nette déduit en plus toutes les charges : personnel, loyer, énergie, assurances, taxes, amortissements. La marge brute en restauration tourne autour de 65-75 % tandis que la marge nette se situe entre 5 et 15 %.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">À quelle fréquence faut-il recalculer ses marges ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Idéalement chaque semaine pour le food cost global, et à chaque changement de prix fournisseur pour les fiches techniques individuelles. Les variations de prix sur les produits frais peuvent être rapides. Un outil comme RestauMargin automatise ce suivi en continu.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment calculer le coefficient multiplicateur en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient multiplicateur se calcule en divisant le prix de vente HT par le coût matières. Inversement : Coefficient = 1 / Food cost cible. Pour un food cost cible de 30 %, le coefficient est de 3,33. Multipliez votre coût matière par ce coefficient pour obtenir le prix de vente HT.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quel est le ratio personnel idéal en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le ratio personnel (masse salariale / chiffre d'affaires) se situe idéalement entre 30 % et 40 % en restauration traditionnelle. En ajoutant le food cost (25-35 %), ces deux postes représentent le prime cost qui ne devrait pas dépasser 65-70 % du CA pour garantir une marge nette viable.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Faut-il calculer sa marge en HT ou en TTC ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Toujours en HT (hors taxes). La TVA collectée ne vous appartient pas, elle est reversée à l'État. Calculer votre food cost sur un prix TTC donnerait un ratio artificiellement bas et fausserait votre analyse. En France, la TVA en restauration sur place est de 10 %.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment améliorer sa marge sans augmenter les prix ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Plusieurs leviers : optimiser les portions avec des fiches techniques précises, négocier les fournisseurs, réduire le gaspillage (FIFO, pesée des déchets), utiliser le menu engineering pour promouvoir les plats à forte marge, substituer certains ingrédients sans sacrifier la qualité. RestauMargin identifie ces opportunités automatiquement.</p>
    `,
  },
  {
    path: '/blog/faq-marge-restaurant-25-questions',
    title: 'FAQ Marge Restaurant 2026 : 25 questions essentielles (formules + benchmarks)',
    description: "Toutes les réponses sur la marge restaurant en 2026 : taux moyen, calcul, règle 30/30/30/10, rentabilité, plat le plus rentable, salaire propriétaire. 25 questions essentielles + formules + benchmarks.",
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Les 5 ratios à connaître avant toute question sur la marge</h2>
        <p style="margin:0 0 16px 0;color:#333333">Toutes les réponses de cette FAQ reposent sur cinq ratios, tous calculés <strong>sur le chiffre d'affaires hors taxes</strong>. Ce sont des repères de pilotage couramment utilisés en restauration commerciale française, pas des normes légales : un restaurant peut s'en écarter et rester rentable si un autre poste compense.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Ratio</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Repère</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Calcul</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Food cost</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25 - 35 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Coût matières / CA HT</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Coût personnel</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">28 - 40 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Masse salariale / CA HT</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Prime cost</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&lt; 65 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Matières + personnel / CA HT</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Loyer / CA</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&lt; 10 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Loyer + charges / CA HT</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Marge nette</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 8 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Résultat net / CA HT</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur la marge restaurant</h2>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le taux de marge pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le taux de marge brute moyen d'un restaurant en France oscille entre 70 % et 75 % sur les solides (plats) et environ 85 % sur les liquides (boissons et vins). La marge nette, après déduction de toutes les charges, se situe entre 5 % et 15 % selon le type d'établissement et le format. Un restaurant traditionnel cible 8 à 10 % de marge nette, tandis qu'une restauration rapide peut atteindre 20 à 25 %. Concrètement, sur un menu vendu 25 EUR HT, vous payez environ 7,50 EUR de matières premières (food cost 30 %), conservez 17,50 EUR de marge brute, puis déduisez personnel (~9 EUR), loyer (~2,50 EUR), énergie (~1,25 EUR), assurances et taxes (~2,75 EUR), pour finir avec 2 EUR de marge nette dans la poche. C'est pour cela que le pilotage du food cost et de la masse salariale est si critique.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le bon ratio pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le bon ratio en restauration suit le prime cost : matières premières + masse salariale doivent rester sous 65 % du chiffre d'affaires HT. Concrètement, un food cost à 30 % et un coût personnel à 32 % donnent un prime cost de 62 %, ce qui laisse 38 % pour couvrir loyer, énergie, charges fixes et marge nette. Au-delà de 70 % de prime cost, l'établissement devient structurellement non rentable. Les ratios secondaires à surveiller : loyer &lt; 10 % du CA, énergie &lt; 5 %, marketing &lt; 3 %, et marge nette &gt; 8 %. Tout dépassement de 2-3 points sur un poste se traduit immédiatement par une marge nette qui chute.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quelle est la marge minimum idéale conseillée ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La marge nette minimum conseillée pour assurer la pérennité d'un restaurant est de 5 % du chiffre d'affaires HT. En dessous, vous n'avez plus de coussin pour absorber une hausse de matières premières, une panne d'équipement ou une saison creuse. L'objectif sain se situe entre 8 % et 12 %, et l'excellence au-delà de 15 %. Pour un restaurant qui réalise 500 000 EUR de CA annuel, 5 % de marge nette représente 25 000 EUR. C'est le minimum vital pour rémunérer l'exploitant, financer les renouvellements d'équipement et constituer une réserve de trésorerie. Viser 10 % (50 000 EUR) permet de développer l'enseigne ou de rétribuer correctement le risque.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quelle est la marge bénéficiaire idéale pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La marge bénéficiaire idéale pour un restaurant se situe entre 10 % et 15 % de marge nette sur le chiffre d'affaires HT. C'est le niveau qui permet de rémunérer l'exploitant, d'investir dans l'enseigne et de constituer une trésorerie de sécurité équivalente à 3 mois de charges fixes. Une marge nette de 10 % sur 600 000 EUR de CA = 60 000 EUR. Sur ce montant, comptez environ 20 000 EUR pour l'impôt sociétés, 20 000 EUR pour la rémunération dirigeant complémentaire, et 20 000 EUR pour investissement et réserve. Au-delà de 15 %, vous êtes dans le top 10 % du secteur ; en dessous de 5 %, vous êtes structurellement fragile.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le bon taux de marge ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le bon taux de marge brute pour un restaurant se situe entre 65 % et 75 % du chiffre d'affaires HT, correspondant à un food cost entre 25 % et 35 %. Cette fourchette s'applique à la restauration traditionnelle ; les pizzerias visent 75-85 %, les coffee shops 78-88 %, le gastronomique 60-70 %. Plus important que le taux de marge brute, le taux de marge nette doit être supérieur à 8 %. Un restaurant peut afficher 75 % de marge brute mais ne dégager que 2 % de marge nette si ses charges de personnel et son loyer sont démesurés. Toujours raisonner en couple marge brute + marge nette.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel secteur fait le plus de marge ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Dans la restauration, les secteurs les plus marges sont la pizzeria (12-18 % de marge nette), le coffee shop (10-16 %), et le fast-food (8-15 %). Ces formats bénéficient d'un food cost bas (15-25 %), d'une masse salariale comprimée et d'un volume élevé grâce au ticket court et à la rotation rapide des couverts. À l'opposé, le restaurant gastronomique étoilé affiche typiquement 3 à 8 % de marge nette malgré des prix élevés, en raison du food cost premium (35-40 %), de la masse salariale lourde (40-50 % du CA) et des charges fixes élevées. Le bistrot traditionnel se situe entre les deux, autour de 6-10 % de marge nette.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Qu'est-ce que la règle des 30/30/30/10 pour les restaurants ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La règle 30/30/30/10 est un cadre de répartition budgétaire idéal pour un restaurant : 30 % du chiffre d'affaires pour le coût matières (food cost), 30 % pour la masse salariale, 30 % pour les autres charges (loyer, énergie, marketing, assurances, amortissements), et 10 % de marge nette pour le propriétaire. Cette règle est un point de référence universel. Cette règle varie selon le segment : un restaurant gastronomique tend vers 35/40/22/3, une pizzeria vers 22/22/41/15, un fast-food vers 28/24/35/13. La règle 30/30/30/10 fonctionne comme une cible : si l'un des trois 30 déborde, un autre poste doit être comprimé ou les 10 % de marge disparaissent.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quels sont les 5 ratios clés ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Les 5 ratios clés à piloter en restaurant sont : (1) Food cost (25-35 %), (2) Coût personnel (28-40 %), (3) Prime cost (matières + personnel, &lt; 65 %), (4) Loyer / CA (&lt; 10 %), (5) Marge nette (&gt; 8 %). Ces cinq indicateurs forment le tableau de bord minimum de tout restaurateur professionnel. On ajoute souvent : ticket moyen, taux d'occupation, productivité par couvert (CA / nombre de couverts servis) et RevPASH (revenue per available seat hour). Ces ratios secondaires permettent d'expliquer la formation de la marge et d'identifier les leviers d'amélioration.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Un bénéfice net de 4 % est-il bon ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Un bénéfice net de 4 % est insuffisant pour un restaurant. C'est en dessous de la moyenne nationale (8-10 %) et trop faible pour absorber les aléas. Sur 500 000 EUR de CA, 4 % représente 20 000 EUR, ce qui couvre à peine la rémunération complémentaire du dirigeant et ne laisse rien pour investir. À 4 % de marge nette, une hausse de 5 % du coût matières ou une baisse de 5 % de fréquentation suffit à basculer en déficit. Le plan d'action prioritaire : auditer le food cost (souvent au-dessus de 35 %), réviser le menu engineering pour booster les plats marges, et négocier les fournisseurs. Objectif : remonter à 8-10 % en 6 mois.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le plat le plus rentable dans un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Les plats les plus rentables dans un restaurant sont les pâtes fraîches, les pizzas, les soupes, les salades composées et les desserts maison. Leur food cost se situe entre 12 % et 25 %, soit une marge brute de 75 % à 88 %. Ces plats utilisent des ingrédients peu chers (farine, oeufs, légumes, sucre) transformés en valeur par la création culinaire. À l'inverse, les viandes nobles (entrecôte, magret, agneau) et les poissons (bar, dorade, saint-jacqués) affichent un food cost de 35-45 %. Le menu engineering consiste à équilibrer la carte avec des plats stars (forte marge ET forte popularité, ex: lasagnes maison), des chevaux de labour (popularité haute marge moyenne, ex: entrecôte), et à éliminer les poids morts.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Pourquoi mon restaurant ne rapporte-t-il pas d'argent ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Les 5 causes principales d'un restaurant non rentable sont : (1) un food cost au-dessus de 35 % par manque de fiches techniques, (2) un loyer supérieur à 12 % du CA, (3) un sureffectif personnel (&gt; 40 % du CA), (4) un ticket moyen trop bas par rapport aux charges fixes, (5) un taux d'occupation insuffisant (&lt; 50 % au service du midi). Diagnostic en 7 jours : enregistrez tous vos prix de revient et calculez votre food cost réel, comparez votre masse salariale au CA, mesurez votre ticket moyen et votre taux de remplissage par service. Si trois de ces cinq indicateurs sont dans le rouge, la marge nette est négative. Plan d'action : réduire le food cost en priorité (gain typique 3-5 points en 3 mois).</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le bénéfice brut d'un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le bénéfice brut d'un restaurant est la différence entre le chiffre d'affaires HT et le coût des matières premières. Pour un restaurant standard avec 30 % de food cost, le bénéfice brut représente 70 % du CA HT. Sur 500 000 EUR de CA, cela donne 350 000 EUR de bénéfice brut. Attention : le bénéfice brut n'est PAS le bénéfice net. Il faut encore déduire la masse salariale (~30 %), le loyer (~10 %), l'énergie (~5 %), les assurances, les amortissements, les impôts. Sur les 350 000 EUR de bénéfice brut, il restera typiquement 40 000 à 60 000 EUR de bénéfice net.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Comment savoir si la marge est bonne ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Pour savoir si votre marge est bonne, comparez vos ratios aux benchmarks de votre segment : food cost entre 25 % et 35 %, prime cost (matières + personnel) sous 65 %, loyer sous 10 % du CA, et marge nette supérieure à 8 %. Si ces quatre conditions sont réunies, votre marge est saine. Au-delà des chiffres, trois signaux qualitatifs : (1) votre trésorerie augmente chaque mois, (2) vous pouvez investir sans recourir au crédit, (3) vous dégagez une rémunération dirigeante décente. Si l'un de ces trois signes manque, votre marge est probablement insuffisante même si les ratios semblent corrects.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Une marge bénéficiaire de 50 % est-elle excessive ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Une marge bénéficiaire NETTE de 50 % serait totalement irréaliste en restauration : le maximum observé sur le marché est de 18-20 % pour les formats les plus optimisés (food truck, coffee shop urbain premium). En revanche, une marge BRUTE de 50 % est insuffisante car la cible standard est 70-75 %. Ne confondez pas marge brute (sur le plat avant charges) et marge nette (sur le résultat global après toutes les charges). Une pizza vendue 10 EUR avec 2 EUR de coût matières a une marge brute de 80 % mais contribue à une marge nette globale de seulement 10-15 % du CA total du restaurant. Toujours raisonner en moyenne pondérée sur l'ensemble du menu.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Que signifie 50% de marge ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Une marge de 50 % signifie que sur un produit vendu 100 EUR, vous gardez 50 EUR après avoir payé le coût d'achat ou de production. En restauration, une marge brute de 50 % signifie que 50 % du prix de vente couvre le coût matières (food cost de 50 %), ce qui est très au-dessus de la norme (food cost cible 25-35 %). Attention au sens : marge sur prix de vente (50 % de 100 EUR = 50 EUR) vs marge sur coût d'achat (multipliée par 2). En restauration, on utilise toujours la marge sur prix de vente HT pour comparer aux benchmarks. Un coefficient multiplicateur de 2 correspond à une marge brute de 50 %, ce qui est trop faible pour la plupart des formats.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quels sont les KPI essentiels pour piloter un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Les KPI essentiels pour piloter un restaurant sont : (1) Food cost (%), (2) Coût personnel (%), (3) Prime cost (%), (4) Marge brute (EUR et %), (5) Marge nette (EUR et %), (6) Ticket moyen, (7) Nombre de couverts servis, (8) Taux d'occupation (%), (9) RevPASH (revenue per available seat hour), (10) Coefficient multiplicateur moyen. Ces 10 indicateurs forment le tableau de bord opérationnel à suivre chaque semaine. Ils permettent de détecter rapidement une dérive (food cost qui passe de 30 à 34 %, ticket moyen qui baisse, taux d'occupation qui chute) et d'agir avant que la marge nette ne s'effondre. RestauMargin automatise ce suivi en temps réel.</p>
    `,
  },
  {
    path: '/blog/marge-beneficiaire-restaurant-ideal',
    title: "Marge bénéficiaire restaurant : quel est l'idéal en 2026 ? (avec exemples)",
    description: "La marge bénéficiaire idéale d'un restaurant en France 2026 : 5-15% en net selon segment. Un bénéfice de 4% est-il acceptable ? Une marge de 50% est-elle réaliste ? Réponses claires + exemples chiffrés.",
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Marge bénéficiaire idéale d'un restaurant : les repères 2026</h2>
        <p style="margin:0 0 16px 0;color:#333333">La <strong>marge bénéficiaire idéale d'un restaurant en France en 2026 se situe entre 8 % et 15 % en net</strong> pour un restaurant traditionnel, et entre 15 % et 25 % pour la restauration rapide. La marge brute, calculée avant charges, atteint 65 à 75 % sur les solides et jusqu'à 85 % sur les boissons. Une marge nette inférieure à 5 % est considérée comme fragile ; au-delà de 20 %, le modèle est exceptionnel. <strong>La marge bénéficiaire ne signifie rien sans préciser "brute" ou "nette"</strong> : c'est de la que vient l'essentiel des confusions sur ce sujet. La marge brute est toujours élevée en restauration (65-85 %), la marge nette toujours plus modeste (5-15 %).</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Marge brute et marge nette par type d'établissement</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Type d'établissement</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Marge brute</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Marge nette</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Top 10 %</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restauration rapide / Fast-food</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">70 - 75 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>15 - 25 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Bistrot / Brasserie</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">67 - 72 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>8 - 12 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 15 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant traditionnel</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">65 - 70 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>5 - 10 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 12 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Pizzeria</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">72 - 85 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>10 - 18 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 20 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Coffee shop</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">78 - 88 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>8 - 16 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 18 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant gastronomique</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">60 - 70 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>3 - 8 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 10 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Food truck</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">70 - 78 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>8 - 18 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 20 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Dark kitchen / Livraison</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">65 - 72 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>5 - 12 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 15 %</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Du chiffre d'affaires à la marge nette : exemple sur 600 000 EUR de CA</h2>
        <p style="margin:0 0 16px 0;color:#333333">Restaurant traditionnel, 600 000 EUR de chiffre d'affaires HT annuel. <strong>CA HT 600 000 EUR</strong> moins coût matières 180 000 EUR (food cost 30 %) donne une <strong>marge brute de 420 000 EUR, soit 70 %</strong>. On retire ensuite le personnel et ses charges (210 000 EUR, soit 35 % du CA), puis le loyer, l'énergie et les divers (138 000 EUR, 23 %) : il reste une <strong>marge d'exploitation (EBE) de 72 000 EUR, soit 12 %</strong>. Après amortissements, frais financiers et impôts (24 000 EUR), la <strong>marge nette ressort à 48 000 EUR, soit 8 % du CA</strong>. Ce cheminement montre pourquoi une marge brute de 70 % n'a rien d'exceptionnel : ce sont les 62 points de charges qui la suivent qui décident de la rentabilité réelle.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur la marge bénéficiaire en restauration</h2>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quelle est la marge bénéficiaire idéale pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La marge bénéficiaire idéale d'un restaurant en France 2026 se situe entre 8 % et 15 % en net pour un restaurant traditionnel, et entre 15 % et 25 % pour la restauration rapide. La marge brute (avant charges) atteint 65-75 % sur les solides et 85 % sur les boissons. Une marge nette inférieure à 5 % est considérée comme fragile, tandis qu'au-delà de 20 % le modèle est exceptionnel.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Un bénéfice net de 4 % est-il bon pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Un bénéfice net de 4 % est en dessous de la cible idéale pour un restaurant en 2026 (8-15 %). Ce niveau indique soit un modèle économique fragile, soit des charges non maîtrisées. À 4 %, le restaurateur tire un revenu modeste et n'a aucune marge pour absorber un imprévu. Toutefois, 4 % est meilleur que la moyenne nationale réelle (3-5 %), car beaucoup de restaurants sont à l'équilibre ou en perte.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Une marge bénéficiaire de 50 % est-elle excessive pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Une marge bénéficiaire de 50 % en net est techniquement quasi-impossible dans la restauration traditionnelle française. En revanche, 50 % peut être réaliste sur certains plats individuels (marge brute 70-90 %) ou en restauration rapide spécialisée. La confusion vient souvent du mélange entre marge brute (50 % oui) et marge nette (50 % impossible).</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Que signifie 50 % de marge en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">50 % de marge signifie que sur chaque euro de vente, 50 centimes restent après déduction des coûts. La précision est cruciale : 50 % de marge brute signifie 50 centimes restant après le coût matières (réaliste, c'est même bas pour la restauration), tandis que 50 % de marge nette signifie 50 centimes après tous les coûts (très rare hors restauration rapide ultra-spécialisée).</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quelle est la marge minimum idéale conseillée pour un restaurant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La marge nette minimum conseillée pour un restaurant viable à long terme est de 8 %. En dessous, le restaurateur n'a pas la capacité d'absorber les chocs externes (inflation matières, panne équipement, baisse de fréquentation). En dessous de 5 %, on parle de zone rouge : la moindre perturbation peut faire basculer l'établissement en perte. Au-dessus de 12 %, le modèle est solide.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le bénéfice net moyen d'un restaurant en France ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">D'après les données INSEE 2026 et les fédérations professionnelles, le bénéfice net moyen d'un restaurant français se situe autour de 3 à 5 % du chiffre d'affaires. Ce chiffre cache de fortes disparités : restauration rapide 8-12 %, restauration traditionnelle 4-8 %, gastronomie 2-5 %. Près de 30 % des restaurants sont à l'équilibre ou en perte.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Comment passer de 4 % à 12 % de marge nette ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Passer de 4 % à 12 % de marge nette demande d'attaquer quatre leviers simultanément : réduire le food cost de 2 à 3 points via fiches techniques et pesée systématique, optimiser la masse salariale via planning intelligent et polyvalence, augmenter le ticket moyen via menu engineering et upsell, négocier les charges fixes (loyer, énergie, assurances). Comptez 6 à 12 mois pour un effet durable.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">La marge restaurant est-elle meilleure que dans le commerce ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Non, la marge nette en restauration (5-15 %) est globalement plus faible que dans les services aux entreprises (10-25 %) ou le luxe (25-40 %). La restauration est un secteur dur : charges de personnel élevées (35-45 % du CA), coûts fixes lourds (loyer, énergie), saisonnalité. Mais c'est aussi un secteur avec des barrières à l'entrée faibles et une vraie valeur ajoutée humaine.</p>
    `,
  },
  {
    path: '/blog/reduire-food-cost',
    title: 'Food cost restaurant : calcul, formule et benchmarks (guide 2026)',
    description: 'Le food cost en restauration expliqué de A à Z : formule exacte, exemple chiffré, benchmarks par type de restaurant, food cost moyen France 2026, 10 leviers pour le réduire. Guide complet.',
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Formule du food cost</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le <strong>food cost</strong> (ou coût matière) est le ratio entre le coût des matières premières consommées et le chiffre d'affaires hors taxes du restaurant. <strong>Formule : Food cost (%) = (Coût matière total / Prix de vente HT) x 100.</strong> Pour un plat vendu 18 EUR HT avec 5,40 EUR d'ingrédients, le food cost est de 30 % et la marge brute de 70 %. On distingue le food cost théorique (calculé à partir des fiches techniques) du food cost réel (stock initial + achats - stock final, divisé par le CA HT) : l'écart entre les deux révèle le gaspillage, les sur-portions ou le vol. Selon une étude GIRA Conseil 2024, l'écart moyen en France est de 3,8 points, soit environ 19 000 EUR par an de marge perdue sur un restaurant à 500 000 EUR de CA.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Benchmarks food cost par type de restaurant</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le food cost cible n'est pas universel : il dépend du type d'établissement, du ticket moyen et de la part des boissons. Fourchettes de référence en France pour 2026 (données Fiducial, INSEE, GIRA Conseil) :</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Type d'établissement</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Food cost cible</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Zone rouge</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Pizzeria / Crêperie</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>22-28 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 32 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Fast-food / Snack</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>25-30 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 33 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Food truck</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>25-30 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 33 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Bistrot / Brasserie</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>28-32 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 35 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant traditionnel</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>30-35 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 38 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Gastronomique</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>32-38 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 42 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Dark kitchen / Livraison</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>28-35 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 38 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Café / Coffee shop</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>20-28 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 32 %</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : un pavé de saumon</h2>
        <p style="margin:0 0 16px 0;color:#333333">Prix de vente TTC : 19,90 EUR, soit 18,09 EUR HT (TVA 10 %). Coût matière : 5,39 EUR. <strong>Food cost = (5,39 / 18,09) x 100 = 29,8 %</strong>, dans la cible 28-32 % d'un restaurant traditionnel. Marge brute : 12,70 EUR par plat (70,2 %), coefficient multiplicateur de 3,36. Si le prix du saumon grimpe de 22 à 27 EUR/kg (variation saisonnière), le food cost passe à 34,8 % : au-delà de 30 EUR/kg, il faut augmenter le prix de vente ou retirer le plat de la carte.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pourquoi votre food cost dérive</h2>
        <p style="margin:0 0 16px 0;color:#333333">Les 3 causes les plus fréquentes d'écart entre food cost théorique et réel : <strong>sur-portions des cuisiniers</strong> (+1 à +3 points, dosage "à l'oeil" sans balance), <strong>gaspillage alimentaire</strong> (+2 à +4 points, en moyenne 14 % des achats finissent à la poubelle) et <strong>hausses fournisseurs non répercutées</strong> (+1 à +3 points, prix de vente inchangé pendant que le coût matière grimpe). Un écart supérieur à 2 points doit déclencher une investigation immédiate.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">10 leviers pour réduire le food cost</h2>
        <p style="margin:0 0 16px 0;color:#333333">Classés par impact décroissant : <strong>1) fiches techniques systématiques au gramme près</strong> (-3 à -5 pts), <strong>2) renégociation annuelle des 5 plus gros fournisseurs</strong> (-2 à -4 pts), <strong>3) réduction du gaspillage</strong> via pesée des déchets et méthode FIFO (-2 à -3 pts), <strong>4) menu engineering</strong> pour promouvoir les plats à forte marge (-2 à -3 pts), <strong>5) mercuriale hebdomadaire</strong> des ingrédients clés (-1 à -3 pts). Cumulés sur 6 mois, ces leviers font gagner 8 à 12 points de food cost, soit 40 000 à 60 000 EUR de marge brute supplémentaire par an sur un restaurant à 500 000 EUR de CA.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur le food cost</h2>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Qu'est-ce que le food cost en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le food cost (ou coût matière) est le ratio entre le coût des matières premières consommées et le chiffre d'affaires hors taxes du restaurant. Il s'exprime en pourcentage. Un food cost de 30 % signifie que pour chaque euro de vente HT, 30 centimes sont consacrés aux ingrédients. C'est l'indicateur numéro un pour piloter la rentabilité opérationnelle d'un restaurant en France comme à l'international.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment calculer le food cost d'un plat étape par étape ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Additionnez le coût matière de tous les ingrédients (quantités nettes après pertes multipliées par le prix d'achat HT), puis divisez par le prix de vente HT et multipliez par 100. La formule précise est : Food cost (%) = (Coût matière total / Prix de vente HT) x 100. Pour un plat vendu 18 EUR HT avec 5,40 EUR d'ingrédients, le food cost est de 30 % et la marge brute de 70 %.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quel food cost idéal viser en 2026 ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le food cost cible dépend du type d'établissement. Une pizzeria peut viser 22-28 %, un fast-food 25-30 %, une brasserie 28-32 %, un restaurant traditionnel 30-35 %, un gastronomique 32-38 % et un food truck 25-30 %. La règle absolue : le prime cost (food cost + masse salariale) ne doit jamais dépasser 65 % du chiffre d'affaires pour rester rentable.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quelle différence entre food cost théorique et food cost réel ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le food cost théorique est calculé à partir des fiches techniques (ingrédients idéaux, grammages exacts). Le food cost réel est calculé à partir des achats effectifs constatés en comptabilité : (stock initial + achats - stock final) / CA HT. L'écart entre les deux révèle le gaspillage, les sur-portions, le vol ou les erreurs d'inventaire. Un écart supérieur à 2 points doit déclencher une investigation immédiate.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment réduire son food cost sans baisser la qualité ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Cinq leviers majeurs : 1) fiches techniques précises au gramme près pour éliminer les sur-portions, 2) négociation des 5 plus gros fournisseurs avec demande de devis annuels, 3) réduction du gaspillage via pesée des déchets et méthode FIFO, 4) menu engineering pour promouvoir les plats à forte marge, 5) mercuriale hebdomadaire pour acheter au meilleur prix. Cumulés, ces leviers font gagner 4 à 8 points de food cost en 3 mois.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Le food cost inclut-il les boissons ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">En général, on distingue le food cost (nourriture seule, cible 25-35 %) du beverage cost (boissons, cible 18-25 % pour les softs et 20-30 % pour les vins). Cette distinction permet d'analyser séparément les performances cuisine et bar. Pour une vision globale, on calcule le COGS (Cost of Goods Sold) qui combine les deux. La marge brute sur les boissons étant généralement supérieure, un bar dynamique booste fortement la rentabilité globale.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Faut-il calculer son food cost en HT ou en TTC ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Toujours en HT (hors taxes). La TVA collectée ne vous appartient pas, elle est reversée à l'État (10 % en restauration sur place, 5,5 % à emporter en France). Calculer le food cost sur un prix TTC donnerait un ratio artificiellement bas et fausserait toute l'analyse de marge. De même, le coût matière est toujours pris en HT puisque la TVA sur les achats est récupérable.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Pourquoi mon food cost réel est-il supérieur au food cost théorique ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Sept causes principales : sur-portions des cuisiniers (sans pesée, on dose 10-15 % en plus), gaspillage alimentaire (14 % en moyenne), erreurs d'inventaire, vols (interne ou externe), offerts non comptabilisés (pain, amuse-bouche, geste commercial), pertes à la cuisson non intégrées aux fiches, hausses fournisseurs non répercutées. La méthode pour traquer l'écart : inventaire hebdomadaire, pesée des déchets, mercuriale à jour.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Le food cost est-il différent pour la livraison et la salle ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, et c'est un piège majeur. Le food cost livraison est généralement plus élevé à cause des commissions plateformes (UberEats, Deliveroo : 25-35 % du prix vente) et du packaging (0,30 à 0,80 EUR par commande). Beaucoup de restaurants pensent gagner sur la livraison alors qu'ils y perdent. Calculez un food cost dédié par canal de vente et adaptez vos prix livraison en conséquence (+15 à +20 % par rapport au prix salle).</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quel est le food cost moyen d'un restaurant en France en 2026 ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le food cost moyen d'un restaurant traditionnel français se situe autour de 30 à 32 % en 2026, sous l'effet de l'inflation alimentaire cumulée depuis 2022. La restauration rapide tourne autour de 28 à 30 %, la pizzeria descend à 22 à 26 % grâce au coût matière bas de la pâte, et la gastronomie monte à 33 à 38 % du fait des produits nobles. Un restaurant bien piloté vise un food cost réel inférieur de 2 à 3 points à la moyenne de son segment : c'est la différence entre une marge nette de 5 % et de 10 %.</p>
    `,
  },
  {
    path: '/blog/tva-restaurant',
    title: 'TVA restaurant 2026 : taux 10%, 5,5% et 20% expliqués (sur place, à emporter, alcool)',
    description: 'Quel taux de TVA appliquer en restauration en 2026 ? 10 % consommation immédiate, 5,5 % vente conditionnée, 20 % alcool. Règles sur place vs à emporter, ventilation, exemple chiffré et impact sur la marge.',
    type: 'article',
  },
  {
    path: '/blog/marge-boissons-restaurant',
    title: 'Marge sur les boissons au restaurant 2026 : café, soft, bière, vin, cocktails',
    description: 'Quelle marge sur les boissons au restaurant ? Marge brute de 80 à 90 %, coefficients x4 à x15 selon la boisson. Café, softs, bière, vin au verre, cocktails : food cost cible, exemples chiffrés et 7 leviers pour booster votre marge liquide.',
    type: 'article',
  },
  {
    path: '/blog/coefficient-multiplicateur',
    title: 'Coefficient multiplicateur restaurant 2026 : calcul + formule + exemples (guide complet)',
    description: 'Coefficient multiplicateur restaurant : formule, calcul pas à pas, valeurs cibles par segment (bistrot 3.5, gastro 4.5, pizzeria 3.0). Exemples chiffrés, erreurs courantes et calculateur gratuit.',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Formule du coefficient multiplicateur</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient multiplicateur convertit un coût matière en prix de vente : <strong>Coefficient = Prix de vente HT / Coût matière</strong>. Il est l'inverse exact du food cost. Un coefficient de 4 correspond à un food cost de 25 % (100 / 4), un coefficient de 3,33 à un food cost de 30 %, un coefficient de 5 à un food cost de 20 %. Pour retrouver le prix de vente à partir d'un food cost cible, on applique la formule inverse : Prix de vente HT = Coût matière / (Food cost cible / 100).</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Coefficient multiplicateur par catégorie de plat</h2>
        <p style="margin:0 0 16px 0;color:#333333">Tous les plats ne supportent pas le même coefficient. La règle : plus le coût matière d'un plat est élevé, plus son coefficient doit être bas, car le client accepte mal un prix de vente disproportionné sur un produit dont il perçoit la valeur.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Catégorie</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Coefficient cible</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Food cost</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Amuse-bouche</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 5,0 à 6,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">17-20 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Entrées froides</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 3,0 à 3,5</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">29-33 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Entrées chaudes</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 3,5 à 4,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25-29 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Plats poisson noble</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 3,0 à 3,5</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">29-33 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Plats viande noble</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 3,5 à 4,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25-29 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Plats végétariens</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 4,0 à 5,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">20-25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Pizzas / Burgers</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 4,0 à 6,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">17-25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Desserts</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 4,0 à 5,5</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">18-25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Boissons chaudes</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 8,0 à 12,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">8-13 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Cocktails</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 4,0 à 6,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">17-25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Vins au verre</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 4,0 à 5,0</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">20-25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Vins en bouteille</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>x 2,5 à 3,5</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">29-40 %</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : une pizza margherita</h2>
        <p style="margin:0 0 16px 0;color:#333333">Coût matière total (pâte, tomate, mozzarella, huile) : 1,58 EUR. Prix affiché sur la carte : 10,90 EUR TTC, soit 9,91 EUR HT après retrait de la TVA à 10 %. Le coefficient effectif ressort à <strong>x 6,27</strong>, pour une marge brute de 8,33 EUR par pizza et un food cost effectif de 16,0 %.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : une entrecôte frites</h2>
        <p style="margin:0 0 16px 0;color:#333333">Coût matière (entrecôte 220 g, frites, sauce, garniture) : 8,05 EUR. Prix carte : 27,90 EUR TTC, soit 25,36 EUR HT. Le coefficient effectif n'est plus que de <strong>x 3,15</strong>, mais la marge brute atteint 17,31 EUR, soit plus du double de celle de la pizza. C'est la démonstration qu'un coefficient bas peut rapporter davantage en valeur absolue qu'un coefficient élevé.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Les erreurs qui détruisent la marge</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
        <li>Appliquer un coefficient uniforme à toute la carte, sans distinguer boissons et solides.</li>
        <li>Raisonner en TTC au lieu du HT, ce qui fausse le coefficient de 10 % en restauration.</li>
        <li>Oublier le coût des pertes, des parures et du hors-portion dans le coût matière.</li>
        <li>Confondre coefficient multiplicateur, taux de marge brute et food cost, qui mesurent trois choses différentes.</li>
        <li>Ne jamais recalculer ses coefficients après une hausse des prix fournisseurs.</li>
        </ul>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur le coefficient multiplicateur</h2>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Qu'est-ce que le coefficient multiplicateur en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient multiplicateur est un chiffre que vous multipliez par le coût matière d'un plat pour obtenir son prix de vente HT. Exemple : coût matière 4 EUR x coefficient 3,5 = 14 EUR HT, soit 15,40 EUR TTC en restauration sur place. C'est la méthode la plus directe pour fixer un prix de vente à partir d'un coût matière connu.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment calculer le coefficient multiplicateur ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Deux méthodes au choix : (1) À partir du food cost cible : Coefficient = 1 / Food cost. Pour 30 %, coefficient = 1/0,30 = 3,33. (2) À partir de données réelles : Coefficient = Prix de vente HT / Coût matière. Si une entrecôte à 22 EUR HT a un coût matière de 7,20 EUR, le coefficient effectif est 22 / 7,20 = 3,06.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quel est le coefficient multiplicateur moyen en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient moyen en restauration traditionnelle se situe entre 3,0 et 3,5, soit un food cost de 29 à 33 %. Mais il varie énormément par catégorie : x 4-5 pour les desserts, x 5-8 pour les vins, x 8-12 pour les boissons chaudes, x 2,5-3,3 pour les vins en bouteille premium.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Coefficient multiplicateur : avec ou sans TVA ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient s'applique au coût matière HT pour donner un prix de vente HT. La TVA est ajoutée ensuite (10 % en restauration sur place, 5,5 % en vente à emporter froide, 20 % sur les boissons alcoolisées). Si votre calcul donne 15,00 EUR HT, le prix TTC sera 16,50 EUR pour la restauration sur place.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quel coefficient pour une pizzeria, brasserie ou gastronomique ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Pizzeria : x 4,0 à 6,5 (food cost 15-25 %). Brasserie : x 3,3 à 4,0 (food cost 25-30 %). Bistrot traditionnel : x 3,0 à 3,3 (food cost 30-33 %). Restaurant gastronomique : x 2,5 à 3,3 (food cost 30-40 %). Coffee shop : x 5,0 à 10,0 (food cost 10-20 %).</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quelle est la différence entre coefficient et marge brute ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient est un multiplicateur (3,33), la marge brute est un pourcentage (70 %). Ils sont équivalents mathématiquement : Marge brute (%) = 1 - 1/Coefficient. Coefficient 3,33 = marge brute 70 %. Coefficient 4 = marge brute 75 %. Coefficient 5 = marge brute 80 %. Le coefficient est utilisé pour calculer un prix, la marge brute pour analyser une rentabilité.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Faut-il intégrer les pertes (épluchure, casse) dans le calcul du coefficient ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, impérativement. Vous devez calculer votre coefficient sur le coût matière net (après rendement et pertes). Un kilo de carottes brutes ne donne que 800 g utilisables. Si vous utilisez le coût brut, votre coefficient est sous-estimé de 20-25 %. Les fiches techniques précises intègrent un coefficient de rendement par ingrédient.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Pourquoi mon coefficient ne couvre pas mes charges ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coefficient multiplicateur ne couvre QUE le food cost. Les autres postes (masse salariale 30-35 %, charges fixes 20-25 %, loyer 8-12 %) doivent être couverts par la marge brute restante. Si votre coefficient est de 3,0 (food cost 33 %), il reste 67 % pour TOUT le reste. Pour un restaurant rentable à 10 % de marge nette, visez un coefficient minimum de 3,3 (food cost 30 %), idéalement 3,5-4,0. En dessous de 3,0, vous travaillez à perte dès qu'un poste dérape.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Mon coefficient est de 2,5, est-ce suffisant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Non, sauf cas très spécifique. Un coefficient de 2,5 correspond à un food cost de 40 %, ce qui est viable UNIQUEMENT en restaurant gastronomique étoilé (avec ticket moyen supérieur à 80 EUR) ou sur une catégorie isolée (vins premium). Pour un restaurant traditionnel, bistrot ou brasserie, un coefficient de 2,5 vous met en danger immédiat : avec 60 % de marge brute, vous ne pouvez pas couvrir 30 % de salaires + 20 % de charges fixes + 10 % de marge cible. Visez minimum 3,3 (food cost 30 %), idéalement 3,5-4,0.</p>
    `,
    type: 'article',
  },
  {
    path: '/blog/ia-restauration',
    title: "L'intelligence artificielle en restauration : guide 2026",
    description: "Comment l'IA transforme la restauration : gestion des marges, prévisions de ventes, optimisation des menus.",
    type: 'article',
  },
  {
    path: '/blog/gaspillage-alimentaire',
    title: 'Réduire le gaspillage alimentaire en restaurant',
    description: 'Solutions concrètes pour réduire le gaspillage alimentaire : FIFO, portionnement, valorisation des déchets, suivi des pertes.',
    type: 'article',
  },
  {
    path: '/blog/haccp-restaurant',
    title: "HACCP en restaurant : guide complet des normes d'hygiène",
    description: "Tout savoir sur la méthode HACCP en restaurant : 7 principes, plan de maîtrise sanitaire, températures, traçabilité.",
    type: 'article',
  },
  // === Blog articles boostés Wave 1-4 (2026-05-26) ===
  {
    path: '/blog/prix-de-vente-restaurant',
    title: "Calculer le prix de vente d'un plat de restaurant en 2026",
    description: 'Méthodes éprouvées pour fixer vos prix : coefficient multiplicateur, marge cible, pricing psychologique. Cas pratiques chiffrés et outils gratuits.',
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Formule du prix de vente d'un plat de restaurant</h2>
        <p style="margin:0 0 16px 0;color:#333333">La méthode la plus utilisée en France est le <strong>coefficient multiplicateur</strong> : <strong>Prix de vente HT = Coût matières x Coefficient</strong>, ou <strong>Coefficient = 1 / Food cost cible</strong>. Pour un food cost visé de 30 %, le coefficient est 3,33 : un plat avec 5 EUR de coût matières vaut 5 x 3,33 = 16,65 EUR HT, soit environ 18,32 EUR TTC en restauration sur place (TVA 10 %). Variante plus précise, la <strong>méthode de la marge cible</strong> part directement de la marge brute visée en pourcentage : Prix de vente HT = Coût matières / (1 - Marge cible). Pour une marge cible de 72 % sur un plat à 6,30 EUR de coût matières : Prix HT = 6,30 / 0,28 = 22,50 EUR HT, soit 24,75 EUR TTC et 16,20 EUR de marge brute par plat.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Coefficients multiplicateurs de référence par type d'établissement</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Type d'établissement</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Coefficient</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Food cost</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Quand l'utiliser</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Pizzeria / Coffee shop</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">4,5 - 6,5</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">15 - 22 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Ingrédients très peu coûteux, ticket moyen bas</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Brasserie / Restaurant rapide</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,3 - 4,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25 - 30 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Carte large, volume élevé, prix accessibles</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Bistrot / Restaurant traditionnel</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,0 - 3,3</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30 - 33 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Cuisine soignée, ticket moyen 25-40 EUR</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant gastronomique</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">2,5 - 3,3</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30 - 40 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Produits premium, marge unitaire élevée</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Boissons (vin, alcool)</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,5 - 5,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">20 - 28 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Coefficient plus élevé sur les liquides</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">TVA en restauration : l'erreur qui fausse le calcul</h2>
        <p style="margin:0 0 16px 0;color:#333333">Calculez toujours le prix HT en interne (base de tous vos calculs de marge), puis convertissez en TTC pour l'affichage client. En France en 2026 : <strong>TVA 10 %</strong> pour la restauration sur place et à emporter chaude (coefficient TTC x 1,10), <strong>TVA 5,5 %</strong> pour les produits alimentaires froids à emporter (x 1,055), <strong>TVA 20 %</strong> pour les boissons alcoolisées (x 1,20). Erreur classique : calculer son food cost sur le prix TTC le sous-estime de 10 à 20 % selon le taux appliqué — sur les boissons alcoolisées, l'écart est le plus important.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Cas pratique chiffré : un plat à 5 EUR de coût matières</h2>
        <p style="margin:0 0 16px 0;color:#333333">Une brasserie vise un coefficient de 3,33 à 3,5, soit un prix mathématique de 16,65 à 17,50 EUR HT (18,32 à 19,25 EUR TTC). Après vérification marché (5 à 10 restaurants comparables de la zone) et ajustement psychologique, le prix est arrondi à <strong>18,50 EUR TTC</strong> (prix de charme). Vérification de la marge réelle : prix HT recalculé 18,50 / 1,10 = 16,82 EUR ; marge brute = 16,82 - 5,00 = <strong>11,82 EUR</strong>, soit <strong>70,3 %</strong> de marge brute et un coefficient effectif de 3,36. Sur 50 ventes par jour, l'arrondi psychologique dégage 9 EUR/jour de marge supplémentaire, soit <strong>3 285 EUR par an</strong> sans rien changer d'autre.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pricing psychologique : les techniques qui augmentent le ticket moyen</h2>
        <p style="margin:0 0 16px 0;color:#333333">Une fois le prix mathématique fixé, la présentation compte autant que le calcul. Une étude Cornell University (Yang, Kimes, Sessarego, 2009, 200 menus analysés) montre que <strong>retirer le symbole EUR du menu augmente la dépense moyenne de 8 à 12 %</strong>. L'effet d'ancrage (un plat très cher en tête de carte rend les autres raisonnables par comparaison), l'effet decoy (une option intermédiaire qui pousse vers l'option supérieure — 60 à 70 % des clients choisissent alors le grand format au lieu du petit) et le bundle en formule (+15 à 25 % de ticket moyen malgré une remise apparente de 8 à 15 %) sont les trois leviers les plus mesurables en restauration.</p>
    `,
  },
  {
    path: '/blog/fiche-technique-restaurant',
    title: 'Fiche technique restaurant : le guide complet 2026',
    description: 'Apprenez à créer des fiches techniques efficaces pour vos plats : grammages, coûts matières, allergènes, process de fabrication.',
    type: 'article',
  },
  {
    path: '/blog/kpi-essentiels-restaurateur',
    title: 'Les 12 KPIs essentiels pour piloter votre restaurant',
    description: 'Food cost, marge brute, ticket moyen, productivité par couvert : les indicateurs incontournables pour un restaurant rentable.',
    type: 'article',
  },
  {
    path: '/blog/reduire-cout-personnel-restaurant',
    title: 'Comment réduire le coût du personnel en restauration',
    description: 'Planning optimisé, réduction du turnover, formation, process cuisine : 5 leviers concrets pour réduire votre masse salariale de 10 à 20%.',
    type: 'article',
  },
  {
    path: '/blog/fifo-lifo-stocks-restaurant',
    title: 'FIFO vs LIFO en restauration : quelle méthode de stocks choisir',
    description: 'FIFO ou LIFO pour gérer vos stocks en cuisine ? Définitions, comparatif, mise en place pratique et impact sur le food cost.',
    type: 'article',
  },
  {
    path: '/blog/seuil-rentabilite-restaurant',
    title: 'Seuil de rentabilité restaurant : calculer le point mort 2026',
    description: 'Formules, exemples chiffrés et benchmarks pour connaître votre point mort, le nombre de couverts nécessaires et les leviers pour réduire votre seuil.',
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Les 4 étapes du calcul du seuil de rentabilité</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le calcul s'enchaîne en quatre étapes, chacune s'appuyant sur la précédente. <strong>1) Marge sur coût variable</strong> : MCV (EUR) = CA HT - Charges variables, puis Taux MCV (%) = MCV / CA HT x 100. <strong>2) Seuil de rentabilité</strong> = Charges fixes / Taux MCV : c'est le CA minimum qui absorbe vos charges fixes. <strong>3) Conversion en couverts</strong> : Couverts/mois = Seuil mensuel / Ticket moyen HT, puis Couverts/jour = Couverts mois / Jours d'ouverture — la seule forme que votre équipe peut suivre en service. <strong>4) Point mort calendaire</strong> = Seuil annuel / (CA annuel / 365), soit la date à laquelle le restaurant devient rentable dans l'année.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Charges fixes ou variables : le classement qui fausse tout le calcul</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le seuil dépend entièrement de la ventilation des charges, et deux erreurs de classement reviennent systématiquement. <strong>Les salaires</strong> ne sont pas intégralement fixes : les CDI le sont, mais les extras et les heures supplémentaires varient avec l'activité — un partage 70 % fixe / 30 % variable donne une approche réaliste, à ajuster vers le variable si vous tournez beaucoup avec des extras. <strong>L'énergie</strong> est souvent classée en charge fixe par habitude comptable, à tort : la cuisson et le lavage augmentent avec le nombre de couverts servis, donc seule la part abonnement est fixe. Les commissions de paiement par carte (0,5 à 1 % du CA) sont variables elles aussi. Un mauvais classement déplace le seuil de plusieurs milliers d'euros par mois sans que la formule soit en cause.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Benchmarks point mort et seuil mensuel (France 2026)</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Profil d'établissement</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Point mort calendaire</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Lecture</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Top 25 % des restaurants</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>vers le 150e jour</strong> (fin mai)</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Sept mois de l'année en bénéfice</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant traditionnel, 60 couverts</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>200e à 230e jour</strong> (fin juillet)</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Situation médiane observée</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Établissements fragiles</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>jamais atteint</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Exercice déficitaire</td></tr></tbody></table>
        <p style="margin:0 0 16px 0;color:#333333">Sources : données Fiducial et GIRA 2025. Le seuil de rentabilité mensuel moyen se situe entre <strong>35 000 et 55 000 EUR HT</strong> selon la taille et l'emplacement. Pour un restaurant indépendant de 50 couverts, le total des charges fixes mensuelles à viser se situe entre 12 000 et 25 000 EUR, rémunération du gérant et charges sociales TNS comprises.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : du taux de MCV au nombre de couverts</h2>
        <p style="margin:0 0 16px 0;color:#333333">Charges fixes mensuelles : <strong>18 000 EUR</strong>. Taux de marge sur coût variable : <strong>60 %</strong>. Seuil de rentabilité = 18 000 / 0,60 = <strong>30 000 EUR HT par mois</strong>. Avec un ticket moyen de 25 EUR HT, cela représente 1 200 couverts par mois, soit 46 couverts par jour sur 26 jours d'ouverture. Sur l'année, un seuil de 300 000 EUR pour un CA prévu de 500 000 EUR place le point mort vers le <strong>219e jour</strong>. Plus le taux de MCV est élevé, plus le seuil est bas : c'est le levier qui agit le plus vite, avant même la renégociation des charges fixes.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur le seuil de rentabilité en restauration</h2>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quelle est la différence entre seuil de rentabilité et point mort ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Les deux termes désignent la même réalité financière : le niveau d'activité à partir duquel le restaurant ne perd plus d'argent. Le seuil de rentabilité s'exprime en euros de chiffre d'affaires, le point mort en jours, c'est-à-dire la date à laquelle l'activité devient rentable dans l'année. Un seuil de 300 000 EUR pour un CA annuel prévu de 500 000 EUR donne un point mort vers le 219e jour.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment calculer rapidement mon seuil de rentabilité ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Seuil = Charges fixes / Taux de marge sur coût variable. Avec 18 000 EUR de charges fixes mensuelles et un taux de MCV de 60 %, le seuil ressort à 30 000 EUR par mois. Il n'y a pas besoin de formation comptable pour l'appliquer : la difficulté porte sur le classement correct des charges en fixes et variables, pas sur la formule.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Le seuil de rentabilité prend-il en compte ma rémunération de gérant ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Cela dépend du statut juridique. En EURL ou SARL avec gérant majoritaire TNS, la rémunération est une charge fixe à intégrer au calcul. En SAS ou SASU, elle est une charge si elle est versée en salaire, tandis que les dividendes ne se prélèvent que sur le résultat. Dans tous les cas, intégrez votre rémunération cible dans le seuil : sinon le calcul décrit un restaurant où vous travaillez gratuitement.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Comment la livraison change-t-elle le seuil de rentabilité ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La livraison via plateformes crée un second seuil, à calculer séparément. Les commissions de 25 à 30 % du prix de vente TTC s'ajoutent au coût matières et écrasent le taux de MCV : une commande à 25 EUR avec 28 % de commission ne laisse que 18 EUR brut au restaurant. Mélanger les deux canaux dans un seul calcul masque le fait que le canal livraison peut être déficitaire pendant que la salle est rentable.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Mon seuil est trop haut, par où commencer pour le baisser ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Trois leviers, dans cet ordre. Renégocier les trois plus gros postes fixes (loyer, salaires CDI, assurances), qui pèsent souvent 60 % des charges fixes. Améliorer le taux de MCV en réduisant le food cost de 2 à 4 points via les fiches techniques, le FIFO et la négociation fournisseurs. Augmenter le ticket moyen par l'upsell entrée, dessert ou boisson. Combinés, ces trois leviers réduisent le seuil de 10 à 15 %.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Quelle marge de sécurité viser au-delà du seuil ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Une marge de sécurité de 20 à 30 % est saine. Pour un seuil de 40 000 EUR par mois, visez 48 000 à 52 000 EUR de CA afin d'absorber les imprévus : panne, congés, creux saisonnier. En dessous de 15 % de marge, l'établissement est en zone rouge. Au-delà de 40 %, la capacité d'investissement est réelle — recrutement, second établissement.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">À quelle fréquence faut-il recalculer son seuil de rentabilité ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Au minimum chaque trimestre, et systématiquement après tout changement majeur : embauche, hausse de loyer, modification de la carte, ouverture d'un nouveau canal de vente, revalorisation du SMIC. Un seuil calculé une seule fois à l'ouverture devient obsolète en six mois.</p>
      `,
  },
  {
    path: '/blog/menu-engineering-boston-matrix',
    title: 'Menu engineering : méthode Boston Matrix pour optimiser votre carte',
    description: 'Classez vos plats en Stars, Vaches à lait, Puzzles et Chiens. Exemple pratique sur une carte de 20 plats avec actions concrètes.',
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Qu'est-ce que le menu engineering</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le <strong>menu engineering</strong> est l'analyse systématique de la rentabilité et de la popularité de chaque plat, formalisée par Donald Smith et Michael Kasavana à l'Université du Michigan en 1982. Sur une carte typique de 25 plats, seuls 4 à 6 plats génèrent 80 % de la marge brute totale. La méthode ne raisonne jamais en food cost % seul : un plat à 25 % de food cost vendu 12 EUR dégage 9 EUR de marge, un plat à 35 % de food cost vendu 28 EUR dégage 18,20 EUR de marge -- soit 2 fois plus rentable malgré un food cost % moins bon. Le menu engineering classe donc chaque plat sur deux axes : la marge contribution en euros et le volume vendu.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Les 4 quadrants de la matrice Boston</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Quadrant</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Popularité</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Marge</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Action</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Stars</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Forte</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Forte</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Mettre en avant, surveiller les coûts de près</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Vaches à lait</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Forte</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Faible</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Reformuler discrètement, tester une hausse de prix</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Puzzles</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Faible</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Forte</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Renommer, repositionner, faire recommander en salle</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>Chiens</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Faible</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Faible</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Supprimer dans 90 % des cas</td></tr></tbody></table>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Méthode de calcul en 3 étapes</h2>
        <p style="margin:0 0 16px 0;color:#333333"><strong>Étape 1</strong> : récupérer sur 30 jours la quantité vendue (logiciel de caisse), le prix de vente HT et le coût matières HT (fiche technique) de chaque plat. <strong>Étape 2</strong> : calculer la marge contribution par plat (Prix de vente HT moins Coût matières HT) puis la marge totale (marge x quantité vendue). <strong>Étape 3</strong> : calculer deux seuils -- seuil de popularité = (total des ventes / nombre de plats) x 0,7, et seuil de marge = marge moyenne pondérée. Chaque plat est ensuite positionné par rapport à ces deux seuils pour déterminer son quadrant.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré sur une carte de 20 plats</h2>
        <p style="margin:0 0 16px 0;color:#333333">Exemple illustratif (chiffres fictifs) : un restaurant à 28 600 EUR de CA HT et 1 000 plats vendus sur 30 jours pour 20 références. Seuil de popularité : (1000/20) x 0,7 = 35 ventes. Marge contribution moyenne : 15,80 EUR. Résultat : <strong>4 Stars</strong> générant 4 138 EUR de marge (27 %), <strong>10 Vaches à lait</strong> générant 7 632 EUR (49 %), <strong>1 Puzzle</strong> générant 1 120 EUR (7 %) et <strong>5 Chiens</strong> générant seulement 1 455 EUR (9 %). Dans cet exemple, renommer et repositionner le Puzzle (une côte de boeuf 1 kg mal nommée) ferait passer ses ventes de 20 à 34 par mois, soit <strong>+358 EUR de marge mensuelle</strong> (+4 300 EUR par an) sans toucher à la recette.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Excel, export caisse ou logiciel dédié : quand automatiser</h2>
        <p style="margin:0 0 16px 0;color:#333333">Un calcul manuel sur tableur prend 2 à 4 heures par cycle sur une carte de 25 plats, et le résultat est déjà périmé le jour où il est terminé. Un export caisse fait gagner du temps sur les volumes vendus, mais le coût matières reste calculé à part et se désynchronise dès qu'un prix fournisseur change. Un logiciel qui connecte la caisse aux fiches techniques recalcule la matrice en continu et alerte dès qu'un plat change de quadrant. Trois signaux indiquent qu'il est temps d'automatiser : une carte de plus de 15 à 20 plats, des coûts matières qui varient souvent, ou la gestion de plusieurs points de vente.</p>
    `,
  },
  {
    path: '/blog/kpi-restaurateur',
    title: 'Les 10 KPI essentiels pour piloter son restaurant en 2026',
    description: "Food cost, prime cost, RevPASH, ticket moyen, taux d'occupation : les indicateurs clés avec formules et benchmarks sectoriels.",
    type: 'article',
  },
  {
    path: '/blog/logiciel-caisse-enregistreuse-restaurant',
    title: "Logiciel de caisse restaurant : comparatif 2026 (Lightspeed, Zelty, L'Addition)",
    description: '7 solutions comparées : prix, fonctionnalités, points forts et points faibles. Comment choisir votre caisse enregistreuse en 2026.',
    type: 'article',
  },
  {
    path: '/blog/methode-fifo-gestion-stocks-restaurant',
    title: 'Méthode FIFO en restauration : réduire les pertes',
    description: 'FIFO vs FEFO, organisation des réfrigérateurs, étiquetage, impact sur le food cost : tout pour réduire votre gaspillage à moins de 2%.',
    type: 'article',
  },
  {
    path: '/blog/comment-ouvrir-restaurant-guide-complet',
    title: 'Comment ouvrir un restaurant en 2026 : guide complet étape par étape',
    description: 'Les 10 étapes pour créer votre restaurant : concept, business plan, financement, licences, recrutement. Coûts réels et aides disponibles.',
    type: 'article',
  },
  {
    path: '/blog/ouvrir-terrasse-restaurant-demarches',
    title: 'Terrasse de restaurant : autorisations, démarches et rentabilité 2026',
    description: 'Comment ouvrir une terrasse de restaurant en France ? Droit de terrasse, dossier mairie, équipement et calcul de rentabilité : le guide complet 2026.',
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Terrasse en hiver : chauffage et rentabilité hors saison</h2>
        <p style="margin:0 0 16px 0;color:#333333">Depuis le décret du 30 mars 2022 (loi Climat et Résilience), les chauffages au gaz et électriques classiques sont interdits sur les terrasses ouvertes. Seuls restent autorisés les dispositifs biomasse (bois, granulés) ou géothermiques, plus coûteux à l'achat (800 à 2 000 EUR l'unité) mais sans surcout énergétique variable comparable au gaz. Une terrasse partiellement fermée (parois amovibles en verre ou PVC, à moins de 50 % de surface ouverte) échappe à l'interdiction mais bascule alors dans le régime de la construction (permis d'aménager). Même chauffée, une terrasse voit sa fréquentation chuter fortement sous 5 à 10 degrés ressentis : mieux vaut réduire le nombre de tables ouvertes plutôt que de chauffer une terrasse à moitié vide.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Assurance et responsabilité : ce qui est vraiment couvert</h2>
        <p style="margin:0 0 16px 0;color:#333333">La RC professionnelle classique d'un restaurant ne couvre pas automatiquement une occupation du domaine public. Sans extension explicite "terrasse" ou "occupation de voirie" au contrat, un accident (chute sur un pied de parasol, projection de mobilier par grand vent) peut vous laisser sans couverture. À vérifier avec l'assureur : extension occupation de voirie, couverture du mobilier laissé dehors la nuit, garantie tempête pour parasols et pare-vents, responsabilité en cas de chute sur un dénivelé. Cette extension représente en général 150 à 400 EUR par an.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur la terrasse de restaurant</h2>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Peut-on installer une terrasse fermée (type véranda) sur le domaine public ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, mais c'est soumis à une autorisation plus contraignante, parfois assimilée à une construction permanente nécessitant un permis d'aménager. Certaines villes l'interdisent pour des raisons esthétiques.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">La redevance de terrasse est-elle déductible des impôts ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, c'est une charge d'exploitation déductible du résultat imposable, comme n'importe quel loyer lié à l'activité. Conservez toutes vos quittances.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Peut-on installer une terrasse sur un parking privé ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, si le parking appartient à votre bailleur et que le bail commercial l'autorise. Pas besoin de droit de terrasse municipal, mais vérifiez les règles du PLU et les droits de voisinage.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Le chauffage de terrasse est-il encore autorisé en France ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Les chauffages au gaz et électriques classiques sont interdits en terrasse ouverte depuis le décret du 30 mars 2022. Seuls les dispositifs biomasse ou géothermiques restent autorisés en extérieur non couvert.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Combien coûte l'entretien annuel d'une terrasse professionnelle ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Comptez 3 à 8 % de la valeur du mobilier par an : nettoyage haute pression, hivernage, petites réparations et remplacement des pièces d'usure.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Une terrasse peut-elle rester ouverte toute l'année ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui avec un investissement premium (parois amovibles, chauffage biomasse, tapis chauffants), mais le retour sur investissement dépend du climat local. En dessous de 5 degrés, la fréquentation chute fortement même terrasse chauffée.</p>
        <h3 style="font-size:18px;font-weight:600;margin:24px 0 8px 0;color:#111111">Que se passe-t-il si la mairie refuse le renouvellement de l'autorisation ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Vous devez démonter la terrasse dans le délai imparti. Les motifs de refus (travaux voirie, plaintes riverains, changement de PLU) sont généralement notifiés à l'avance.</p>
    `,
  },
  {
    path: '/blog/gestion-tresorerie-restaurant',
    title: 'Gestion de la trésorerie restaurant : guide complet 2026 (plan 13 semaines)',
    description: "Comment piloter la trésorerie de votre restaurant : plan prévisionnel 13 semaines, 8 leviers pour améliorer le cash, solutions d'urgence. Guide expert 2026.",
    type: 'article',
  },
  {
    path: '/blog/reprise-restaurant-guide-acheteur',
    title: 'Reprise de restaurant : comment éviter les pièges — Guide acheteur 2026',
    description: "Audit comptable, valorisation fonds de commerce, dettes cachées, négociation et financement : tout ce qu'il faut savoir avant de racheter un restaurant en 2026.",
    type: 'article',
  },
  {
    path: '/blog/negocier-fournisseurs-restaurant',
    title: 'Négocier avec ses fournisseurs en restauration : 7 techniques pour réduire ses coûts matières',
    description: "Apprenez à négocier efficacement avec vos fournisseurs de restauration : mise en concurrence, contrats-cadres, RFA, regroupement d'achats. Guide pratique 2026 pour réduire votre food cost de 5 à 10 %.",
    type: 'article',
  },
  {
    path: '/blog/prime-cost-restaurant',
    title: "Prime cost en restauration : l'indicateur n1 de rentabilité",
    description: "Food cost + masse salariale = prime cost. Benchmarks, formule complète et plan d'action pour passer de 72% à 62% en 3 mois.",
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Formule du prime cost en restauration</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le <strong>prime cost</strong> est la somme du coût des matières premières (food cost) et de la masse salariale chargée (labour cost), exprimée en pourcentage du chiffre d'affaires hors taxes. <strong>Formule : Prime cost (%) = (Food cost + Labour cost) / CA HT x 100.</strong> Sous 65 %, le restaurant est rentable ; au-delà, il est en zone rouge. Le coût employeur réel se calcule sur le salaire brut multiplié par 1,42 (charges patronales ~42 % en moyenne en France pour le CHR) : un employé à 2 000 EUR brut coûte environ 2 840 EUR à l'entreprise. Sous-estimer ce ratio en ne comptant que le brut fait baisser artificiellement le prime cost de 8 à 12 points, jusqu'à la mauvaise surprise du bilan annuel. La National Restaurant Association américaine considère le prime cost comme LE ratio à piloter en priorité depuis les années 1980 : il regroupe à lui seul 60 à 70 % des coûts totaux d'un restaurant.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pourquoi le prime cost est plus prédictif que la marge brute</h2>
        <p style="margin:0 0 16px 0;color:#333333">Un restaurant peut afficher une marge brute superbe (72 %) et une marge nette catastrophique (-2 %) si sa masse salariale est démesurée : le prime cost est le seul indicateur qui intègre les deux postes opérationnels majeurs. Sur un restaurant à <strong>500 000 EUR de CA HT annuel</strong>, chaque point de prime cost pèse directement sur le résultat : à 60 %, il reste 200 000 EUR de marge sur prime cost (très bon, objectif viable) ; à 65 %, 175 000 EUR (seuil critique) ; à 70 %, seulement 150 000 EUR (marge nette probablement sous 5 %) ; à 75 %, 125 000 EUR (restaurant en danger). Entre un prime cost à 60 % et 70 %, l'écart est de <strong>50 000 EUR de marge brute annuelle</strong>, soit 250 000 EUR sur 5 ans — cette marge sert à payer loyer, énergie, marketing et à dégager le résultat net.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Benchmarks prime cost par type de restaurant (France 2026)</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Type d'établissement</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Food cost</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Labour cost</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Prime cost cible</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Zone rouge</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Fast-food / Snack</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25-30 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25-30 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>52-58 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 62 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Pizzeria / Pasta</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">22-28 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">28-32 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>53-60 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 65 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Bistrot traditionnel</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">28-32 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30-35 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>60-65 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 68 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Brasserie</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">28-33 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30-37 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>60-67 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 70 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Restaurant traditionnel</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30-35 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30-37 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>62-68 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 71 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Dark kitchen / Livraison</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">28-35 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">20-28 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>50-60 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 65 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">Gastronomique 1 étoile</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30-35 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">35-42 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252"><strong>67-75 %</strong></td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">&gt; 80 %</td></tr></tbody></table>
        <p style="margin:0 0 16px 0;color:#333333">Le gastronomique tolère un prime cost plus haut (jusqu'à 75-80 %) grâce au ticket moyen élevé et aux marges sur boissons ; le fast-food doit rester sous 58 % car ses marges nettes sont faibles (3-7 %) et la moindre dérive le fait basculer en perte. Données compilées à partir de Fiducial, INSEE, GIRA Conseil et National Restaurant Association.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré complet : un bistrot fictif</h2>
        <p style="margin:0 0 16px 0;color:#333333">Exemple fictif, à titre d'illustration : un restaurant traditionnel de 45 couverts, CA annuel HT 780 000 EUR. Sur un mois d'avril (CA HT 65 000 EUR) : consommation matière réelle = stock initial 4 200 + achats 20 800 - stock final 3 900 = 21 100 EUR, soit <strong>food cost = (21 100 / 65 000) x 100 = 32,5 %</strong>. Côté personnel : salaires bruts 15 600 + charges patronales 6 552 + mutuelle/prévoyance 780 + indemnités 420 + salaire gérant charge (4 000 + 1 680) = 29 032 EUR, soit <strong>labour cost = (29 032 / 65 000) x 100 = 44,7 %</strong>. <strong>Prime cost = 32,5 + 44,7 = 77,2 %</strong>, contre une cible bistrot de 60-65 % — dérive de 12 à 17 points, marge sur prime cost de seulement 22,8 %, insuffisante pour couvrir loyer, énergie, assurances et amortissements. Résultat probable : -2 à -5 % de marge nette (perte). C'est exactement ce type de dérive qui mène 30 % des restaurants à la fermeture dans les 3 premières années selon l'INSEE.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Plan d'action 90 jours : passer de 72 % à 62 %</h2>
        <p style="margin:0 0 16px 0;color:#333333">Reprenant ce bistrot fictif en perte (-1 200 EUR/mois) : <strong>mois 1</strong> — renégociation fournisseurs (viande -3 %, fruits/légumes -5 %, vin -2 %), inventaire hebdomadaire, fiches techniques affichées ; food cost 32,5 % vers 30 %, labour cost 44,7 % vers 42 %, prime cost 72 %. <strong>Mois 2</strong> — carte réduite de 30 à 18 plats, suppression d'un poste de plonge, plannings au quart d'heure près, fermeture du service du lundi midi déficitaire (économie 2 200 EUR/mois) ; food cost 30 % vers 29 %, labour cost 42 % vers 35 %, prime cost 64 %. <strong>Mois 3</strong> — menu engineering, mercuriale hebdomadaire, pilotage automatisé ; food cost 29 % vers 28,5 %, labour cost 35 % vers 33,5 %, <strong>prime cost final 62 %</strong>. Résultat : passage de -1 200 EUR/mois à +5 300 EUR/mois, soit un <strong>gain net annuel de +78 000 EUR</strong> sans investissement majeur, uniquement par la rigueur de gestion.</p>
    `,
  },
  {
    path: '/blog/taux-de-marque-taux-de-marge',
    title: 'Taux de marque ou taux de marge : quelle différence ? (restaurant 2026)',
    description: "Taux de marge vs taux de marque en restauration : formules, exemple chiffré, tableau de conversion et lien avec le coefficient multiplicateur et le food cost. Ne confondez plus les deux.",
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Taux de marque et taux de marge : la même marge, deux dénominateurs</h2>
        <p style="margin:0 0 16px 0;color:#333333">Les deux taux partent de la même <strong>marge en euros = prix de vente HT moins coût d'achat HT</strong>. Le <strong>taux de marque</strong> la rapporte au prix de vente : <strong>Taux de marque (%) = Marge / Prix de vente HT x 100</strong>. Il répond à la question « quelle part de mon prix de vente est de la marge ? » et reste toujours compris entre 0 et 100 %. Le <strong>taux de marge</strong> la rapporte au coût d'achat : <strong>Taux de marge (%) = Marge / Coût d'achat HT x 100</strong>. Comme le coût matière est faible en restauration, il dépasse facilement 100 % et atteint couramment 200 à 400 %. Réflexe de contrôle : si un pourcentage de « marge » dépasse 100 %, c'est forcément un taux de marge.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : le risotto à 4 EUR vendu 16 EUR HT</h2>
        <p style="margin:0 0 16px 0;color:#333333">Un risotto aux champignons a un coût matière de <strong>4 EUR HT</strong> et se vend <strong>17,60 EUR TTC, soit 16 EUR HT</strong> (TVA restauration à 10 %). Marge brute : 16 - 4 = <strong>12 EUR</strong>. Taux de marque : 12 / 16 = <strong>75 %</strong>. Taux de marge : 12 / 4 = <strong>300 %</strong>. Coefficient multiplicateur : 16 / 4 = <strong>4,0</strong>. Food cost : 4 / 16 = <strong>25 %</strong>. Le taux de marque et le food cost s'additionnent pour faire 100 %, le coefficient est l'inverse du food cost, et le taux de marge vaut le coefficient moins 1 exprimé en pourcentage. Lire « 300 % de marge » et « 75 % de marge », c'est décrire strictement les mêmes 12 EUR.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pourquoi la confusion est si fréquente en restauration</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le mot « marge » sert aux deux : « je fais 70 % de marge » ne précise jamais le dénominateur, alors que la marge brute comptable, rapportée au chiffre d'affaires, est un taux de marque. Le commerce de détail (grossistes, cavistes) raisonne spontanément en taux de marge, sur le coût d'achat, quand le restaurateur pilote au chiffre d'affaires. Enfin, les tableurs maison mélangent souvent les deux formules d'une ligne à l'autre. La confusion mène soit à <strong>surestimer sa rentabilité</strong>, soit à <strong>sous-tarifer ses plats</strong> en appliquant 70 % sur le coût au lieu du prix.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Le triangle taux de marque, coefficient multiplicateur et food cost</h2>
        <p style="margin:0 0 16px 0;color:#333333">Connaître l'un des indicateurs permet de retrouver les autres : <strong>Taux de marque = 100 % moins Food cost</strong> ; <strong>Coefficient = 1 / (1 moins Taux de marque) = 1 / Food cost</strong> ; <strong>Taux de marge = (Coefficient moins 1) x 100</strong>. Avec un food cost cible de 28 %, le taux de marque est de 72 %, le coefficient de 3,57 et le taux de marge de 257 %.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Tableau de conversion marge et marque</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px 0"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Coefficient</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Taux de marge</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Taux de marque</th><th style="text-align:left;padding:8px;border-bottom:2px solid #0d9488;color:#111111">Food cost</th></tr></thead><tbody><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">2,5</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">150 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">60 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">40 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">200 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">66,7 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">33,3 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,33</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">233 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">70 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">30 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">3,5</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">250 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">71,4 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">28,6 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">4,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">300 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">75 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">25 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">4,5</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">350 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">77,8 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">22,2 %</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">5,0</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">400 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">80 %</td><td style="padding:8px;border-bottom:1px solid #e5e5e5;color:#525252">20 %</td></tr></tbody></table>
        <p style="margin:0 0 16px 0;color:#333333">Lecture : un coefficient de 4 équivaut à un taux de marge de 300 %, un taux de marque de 75 % et un food cost de 25 %. Formules de conversion : <strong>Taux de marque = Taux de marge / (1 + Taux de marge)</strong> et <strong>Taux de marge = Taux de marque / (1 moins Taux de marque)</strong>. Exemple : un taux de marge de 250 % (2,5) donne 2,5 / 3,5 = 71,4 % de taux de marque, soit un coefficient de 3,5.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur le taux de marque et le taux de marge</h2>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quelle est la différence entre le taux de marge et le taux de marque ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">La marge en euros est identique (prix de vente HT moins coût d'achat HT), seul le dénominateur change. <strong>Taux de marque = Marge / Prix de vente HT x 100</strong> ; <strong>Taux de marge = Marge / Coût d'achat HT x 100</strong>. Pour un plat coûtant 4 EUR vendu 16 EUR HT, le taux de marque est de 75 % (12/16) et le taux de marge de 300 % (12/4) : c'est le même plat, deux lectures différentes.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">La marge brute d'un restaurant, c'est un taux de marge ou un taux de marque ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">C'est un taux de marque. Quand un restaurateur dit qu'il fait 70 % de marge brute, il divise sa marge par le chiffre d'affaires, pas par le coût d'achat. Le taux de marge équivalent serait de 233 %. Appliquer un taux de marge de 70 % au lieu d'un taux de marque de 70 % conduit à vendre ses plats bien trop bas.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Comment passer du taux de marge au taux de marque ?</h3>
        <p style="margin:0 0 16px 0;color:#333333"><strong>Taux de marque = Taux de marge / (1 + Taux de marge)</strong> : un taux de marge de 300 % (3) donne 3 / 4 = 75 %. Inversement, <strong>Taux de marge = Taux de marque / (1 moins Taux de marque)</strong> : 0,75 / 0,25 = 300 %.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le lien entre le taux de marque et le coefficient multiplicateur ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Coefficient = 1 / (1 moins Taux de marque). Un taux de marque de 75 % correspond à un coefficient de 4 ; un coefficient de 3,5 donne un taux de marque de 1 - 1/3,5 = 71,4 %. Le coefficient s'applique au coût pour trouver le prix, le taux de marque décrit la part de marge dans ce prix.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le lien entre le taux de marque et le food cost ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Ils sont complémentaires : <strong>Taux de marque = 100 % moins Food cost</strong>. Un food cost de 30 % donne un taux de marque de 70 %, un food cost de 25 % un taux de marque de 75 %. Suivre son food cost, c'est suivre son taux de marque à l'envers.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Peut-on avoir un taux de marque supérieur à 100 % ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Non. La marge (prix de vente moins coût) ne peut pas dépasser le prix de vente, donc le taux de marque plafonne à 100 %, atteint seulement si le coût d'achat est nul. Un résultat de 120 % signale une confusion avec le taux de marge, qui n'a pas de plafond.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Faut-il calculer ces taux en HT ou en TTC ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Toujours en HT : la TVA est collectée pour l'État et reversée, ce n'est pas un revenu du restaurant. Ramenez le prix de vente en HT (prix TTC / 1,10 pour la restauration sur place, / 1,20 pour l'alcool) avant de calculer marge, marque ou coefficient.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel taux utiliser pour fixer le prix d'un plat ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Partez du taux de marque cible, c'est-à-dire du food cost cible : <strong>Prix de vente HT = Coût matière / (1 moins Taux de marque)</strong>. Pour un coût de 5 EUR et un taux de marque de 72 % : 5 / 0,28 = 17,86 EUR HT. Le taux de marge sert plutôt à comparer le rendement d'un achat en négociation fournisseur.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Le taux de marque est-il la même chose que le taux de marge nette ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Non. Le taux de marque ne tient compte que du coût matière : c'est un indicateur de marge brute. La marge nette retranche toutes les charges (personnel, loyer, énergie, amortissements, impôts). Un bon taux de marque peut coexister avec une marge nette faible si la masse salariale et les charges fixes sont trop lourdes.</p>
    `,
  },
  {
    path: '/blog/regle-30-30-30-10-restaurant',
    title: 'Règle 30/30/30/10 restaurant : guide complet 2026 (food cost, personnel, charges, marge)',
    description: "Comprendre la règle 30/30/30/10 en restauration : 30% food cost + 30% masse salariale + 30% charges + 10% marge nette. Adaptations par segment, calculs, erreurs courantes.",
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
    description: "Upselling boissons, suggestion desserts, formule premium, design de carte : 10 méthodes concrètes avec l'impact chiffré sur votre CA annuel.",
    type: 'article',
  },
  {
    path: '/blog/5-ratios-cles-restaurant',
    title: "Les 5 ratios clés d'un restaurant rentable en 2026 (avec formules)",
    description: "Découvrez les 5 ratios essentiels pour piloter votre restaurant : food cost, prime cost, ratio personnel, ticket moyen, taux occupation. Formules, benchmarks et seuils d'alerte par segment.",
    type: 'article',
  },
  {
    path: '/blog/inventaire-restaurant-guide',
    title: "Faire l'inventaire de son restaurant : méthode et outils 2026",
    description: 'Quotidien, hebdomadaire, mensuel : quelle fréquence selon les produits ? Méthode pas à pas, calcul de rotation et modèle de tableau.',
    type: 'article',
  },
  {
    path: '/blog/fixer-prix-carte-restaurant',
    title: 'Comment fixer les prix de sa carte de restaurant : méthode et stratégie',
    description: '3 méthodes (coût, valeur perçue, concurrence), coefficients multiplicateurs par poste, psychologie des prix et comment augmenter sans perdre de clients.',
    type: 'article',
  },
  {
    path: '/blog/psychologie-des-prix-restaurant',
    title: 'Psychologie des prix en restauration : 7 techniques pour vendre plus (2026)',
    description: 'Découvrez 7 techniques de psychologie des prix prouvées (ancrage, prix de charme, golden triangle, bundling) pour augmenter votre ticket moyen de 15 à 25% sans toucher à vos recettes.',
    type: 'article',
  },
  {
    path: '/blog/charges-sociales-restauration',
    title: 'Charges sociales en restauration : guide 2026 (taux, exonérations, URSSAF)',
    description: '40-45% du salaire brut en charges patronales. Taux CCN HCR 2026, réduction Fillon, comparatif CDI/CDD/extras/apprentis avec coût employeur réel.',
    type: 'article',
  },
  {
    path: '/blog/pourboires-restaurant-legislation-fiscalite',
    title: 'Pourboires en restauration : législation, fiscalité et répartition 2026',
    description: "Pourboires au restaurant en 2026 : à qui ils appartiennent, comment les répartir sans perdre l'exonération, et jusqu'à quand l'exonération fiscale et sociale s'applique. Guide complet avec cas chiffré.",
    type: 'article',
  },
  {
    path: '/blog/cout-revient-plat-restaurant',
    title: "Calculer le coût de revient d'un plat : méthode complète restaurateurs",
    description: "5 étapes, ratio de perte par produit, exemple boeuf bourguignon, seuil d'alerte à 35% et mise à jour automatique quand les prix fournisseurs changent.",
    type: 'article',
    seoBody: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Coût de revient d'un plat : définition et formule complète</h2>
        <p style="margin:0 0 16px 0;color:#333333">Le <strong>coût de revient d'un plat est la somme totale, en euros, de tous les coûts nécessaires à sa production</strong> : matières premières + main d'oeuvre directe + emballage + énergie + amortissements. <strong>Formule : Coût de revient = Matières nettes + (Temps de production x Coût horaire charge) + Emballage + Quote-part énergie et fluides.</strong> Il ne faut pas le confondre avec le food cost, qui est uniquement le ratio matières premières sur prix de vente HT, exprimé en pourcentage. Le coût de revient est une valeur absolue (8,20 EUR), le food cost un pourcentage (32 %). Le premier sert à calculer la marge unitaire, le second à comparer la rentabilité entre plats.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">La méthode de calcul en cinq étapes</h2>
        <p style="margin:0 0 16px 0;color:#333333"><strong>1. Lister tous les ingrédients sans exception</strong>, y compris le sel, l'huile, la sauce, le pain offert et la serviette. <strong>2. Peser les quantités nettes</strong>, après parage et perte à la cuisson, et non les quantités brutes achetées. <strong>3. Appliquer le prix d'achat HT moyen pondéré sur trois mois</strong>, pas le dernier prix facturé, qui peut être un prix promotionnel. <strong>4. Ajouter la main d'oeuvre directe</strong> : comptez 2 à 5 minutes par plat au coût horaire charge de 22 à 28 EUR en France, soit 1,25 EUR pour trois minutes à 25 EUR de l'heure. <strong>5. Inclure l'énergie, les fluides et les amortissements</strong> sous forme de quote-part, de 0,15 à 0,30 EUR par couvert. Le total obtenu est le coût de revient unitaire.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Exemple chiffré : un burger maison gourmand</h2>
        <p style="margin:0 0 16px 0;color:#333333">Burger vendu <strong>17,90 EUR TTC, soit 16,27 EUR HT</strong> en restauration sur place. Total matières après pesée nette : <strong>5,92 EUR</strong>. Coût de revient complet, main d'oeuvre, emballage et énergie compris : <strong>8,14 EUR</strong>. On en déduit quatre indicateurs : <strong>food cost matières seules = 5,92 / 16,27 x 100 = 36,4 %</strong> (élevé pour une brasserie), <strong>coût de revient complet / prix HT = 8,14 / 16,27 x 100 = 50,0 %</strong>, <strong>marge brute = 16,27 - 5,92 = 10,35 EUR</strong>, <strong>marge nette unitaire = 16,27 - 8,14 = 8,13 EUR</strong> et un <strong>coefficient multiplicateur de 16,27 / 5,92 = 2,75</strong>, acceptable pour un burger gourmand. L'écart entre 36,4 % de food cost et 50,0 % de coût complet montre ce qu'une fiche technique limitée aux seules matières laisse de côté : près de 14 points de prix de vente.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Le ratio de perte au parage et à la cuisson</h2>
        <p style="margin:0 0 16px 0;color:#333333">La première source d'erreur est de calculer sur le poids brut acheté au lieu du poids net servi. Pour chaque ingrédient, le <strong>rendement = poids net / poids brut</strong>. Exemple : un filet de poisson entier acheté 18 EUR/kg avec 65 % de pertes (arêtes, peau, parure) revient en réalité à <strong>51,40 EUR/kg utilisables</strong> (18 / 0,35), soit près de trois fois le prix affiché sur la facture. Rendements courants à retenir : <strong>viandes 70 à 90 %, poissons entiers 30 à 50 %, légumes racines 75 à 85 %, salades 65 à 75 %</strong>. Côté ratio cible, le coût de revient complet devrait représenter <strong>55 à 65 % du prix de vente HT</strong> pour dégager une marge nette positive : food cost 30 %, main d'oeuvre directe 12 %, emballage 3 %, énergie 5 %, divers 5 %. Le reste, 35 à 45 %, couvre loyer, marketing, taxes et marge nette.</p>
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Questions fréquentes sur le coût de revient d'un plat</h2>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quelle est la différence entre coût de revient et food cost ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coût de revient est la somme totale en euros de tous les coûts pour produire un plat (matières premières, main d'oeuvre directe, emballage, énergie, amortissements). Le food cost est uniquement le ratio matières premières sur prix de vente HT, exprimé en pourcentage. Le coût de revient est une valeur absolue (8,20 EUR), le food cost un pourcentage (32 %). Le coût de revient sert à calculer la marge unitaire, le food cost à comparer la rentabilité entre plats.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Faut-il intégrer la main d'oeuvre dans le coût de revient ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, dans la définition stricte du coût de revient complet. La main d'oeuvre directe, c'est-à-dire le temps de cuisinier nécessaire à la préparation du plat, fait partie du coût de production. Comptez environ 2 à 5 minutes par plat multipliées par le coût horaire charge (22 à 28 EUR en France). Pour un coût horaire de 25 EUR et trois minutes de production, cela représente 1,25 EUR de main d'oeuvre par plat. Si vous calculez uniquement le food cost matières, excluez la main d'oeuvre.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Quel est le ratio cible de coût de revient en restauration ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Le coût de revient complet (matières, main d'oeuvre, emballage, énergie) devrait représenter 55 à 65 % du prix de vente HT pour garantir une marge nette positive après loyer et charges fixes. Décomposition typique : food cost 30 %, main d'oeuvre directe 12 %, emballage 3 %, énergie 5 %, divers 5 %. Le reste, soit 35 à 45 %, couvre loyer, marketing, taxes et marge nette de 5 à 15 %.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Comment intégrer les pertes au parage et à la cuisson ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Distinguez la quantité brute achetée et la quantité nette servie. Exemple : un filet de poisson entier acheté 18 EUR/kg avec 65 % de pertes (arêtes, peau, parure) donne un prix réel utilisable de 51,40 EUR/kg (18 / 0,35). Pour chaque ingrédient, calculez le rendement, soit le poids net divisé par le poids brut. Ratios courants : viandes 70 à 90 %, poissons entiers 30 à 50 %, légumes racines 75 à 85 %, salades 65 à 75 %.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Faut-il intégrer le coût de l'huile de cuisson dans la fiche technique ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Oui, mais sous forme de forfait moyen de 0,10 à 0,20 EUR par portion, car le pesage exact à chaque cuisson est irréaliste. Calculez votre consommation mensuelle d'huile et divisez-la par le nombre de couverts. Même logique pour le sel, le poivre et les herbes : un forfait global de 0,05 à 0,15 EUR par plat suffit.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Comment gérer un plat à plusieurs garnitures interchangeables ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Créez une fiche technique par variante. Un filet de boeuf avec frites, gratin dauphinois ou légumes grillés a trois coûts différents. Calculez ensuite la moyenne pondérée selon la fréquence de vente de chaque garniture. Si 50 % des clients choisissent les frites (1,20 EUR), 30 % le gratin (1,80 EUR) et 20 % les légumes (2,30 EUR), le coût moyen de garniture ressort à 1,60 EUR.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">Pourquoi le coût réel dépasse-t-il souvent le coût calculé ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Parce que plusieurs postes échappent à la fiche technique : sauce et fonds (0,50 à 1 EUR), pain et beurre offerts (0,30 EUR), pertes au dressage (5 à 8 %), erreurs de portionnage (10 à 15 % d'écart), vol et casse (2 à 4 %), gaspillage de matière première (3 à 7 %). Le coût réel est souvent 15 à 25 % au-dessus du calcul théorique. Un inventaire mensuel est le seul moyen de mesurer cet écart.</p>
        <h3 style="font-size:18px;font-weight:700;margin:24px 0 8px 0;color:#111111">À quelle fréquence faut-il recalculer le coût de revient ?</h3>
        <p style="margin:0 0 16px 0;color:#333333">Idéalement chaque mois pour les produits frais (viandes, poissons, légumes de saison) dont les prix bougent vite, chaque trimestre pour les fromages, la charcuterie et les produits secs, et une fois par an pour les vins et alcools. Sans cette mise à jour, un food cost peut dériver de 28 % vers 34 % en six mois, soit six points de marge brute perdus sans s'en rendre compte.</p>
    `,
  },
  {
    path: '/blog/logiciel-gestion-restaurant',
    title: "Logiciel de gestion restaurant : comparatif et guide d'achat 2026",
    description: '8 solutions comparées (Lightspeed, Skello, Inpulse, RestauMargin). Stack idéal selon la taille et calcul du ROI sur 12 mois.',
    type: 'article',
  },
  {
    path: '/blog/rotation-stocks-restaurant',
    title: 'Rotation des stocks en restauration : calcul, benchmarks et optimisation',
    description: 'Formule, benchmarks par catégorie (viandes 3-4j, poissons 1-2j, secs 30-60j), 6 leviers et impact sur la trésorerie immobilisée.',
    type: 'article',
  },
  {
    path: '/blog/budget-previsionnel-restaurant',
    title: 'Budget prévisionnel restaurant : comment le construire en 2026',
    description: 'Structure, méthodes top-down vs bottom-up, tableau 12 mois et les 5 postes qui dérivent le plus souvent. Pilotage mensuel budget vs réel.',
    type: 'article',
  },
  {
    path: '/blog/salaire-proprietaire-restaurant',
    title: 'Combien gagne un propriétaire de restaurant en 2026 ? (chiffres réels)',
    description: "Salaire moyen d'un propriétaire de restaurant en France 2026 : 30-80keur/an selon segment, taille, ville. Décomposition revenus, statut juridique (SARL/SAS), dividendes vs salaire, optimisation.",
    type: 'article',
  },
  {
    path: '/blog/prevision-ventes-restaurant',
    title: 'Prévision des ventes en restauration : méthodes et outils 2026',
    description: 'Historique N-1, moyennes mobiles, facteurs météo/événements. Commander juste et staffer juste pour éviter gaspillage et ruptures.',
    type: 'article',
  },
  {
    path: '/blog/formation-personnel-restauration',
    title: 'Formation du personnel en restauration : obligations, aides et pratiques 2026',
    description: 'OPCO Mobilités, CPF, formations prioritaires (HACCP, upselling, outils digitaux). ROI concret et plan de formation annuel pas à pas.',
    type: 'article',
  },
  {
    path: '/blog/strategie-digitale-restaurant',
    title: 'Stratégie digitale pour restaurant : attirer et fidéliser des clients en 2026',
    description: 'Google Business Profile, Instagram, TikTok, gestion des avis, réservation en ligne. Budget recommandé et actions concrètes par niveau.',
    type: 'article',
  },
  {
    path: '/blog/chiffre-affaires-restaurant-comment-calculer',
    title: "Chiffre d'affaires restaurant : calculer, analyser, augmenter en 2026",
    description: 'Formule CA, TVA 10%/20%, analyse par service et par créneau, 5 leviers de croissance et projection sur 12 mois selon les scénarios.',
    type: 'article',
  },
  {
    path: '/blog/calendrier-haccp-restaurant-modele-gratuit',
    title: 'Calendrier HACCP restaurant : modèle gratuit 2026 (téléchargeable)',
    description: "Toutes les fréquences de contrôle obligatoires, les températures réglementaires, et un modèle prêt à imprimer pour transformer votre HACCP en routine d'équipe.",
    type: 'article',
  },
  {
    path: '/blog/pourquoi-mon-restaurant-ne-rapporte-pas',
    title: "Pourquoi mon restaurant ne rapporte-t-il pas d'argent ? 10 causes + solutions 2026",
    description: "Votre restaurant tourne mais ne rapporte rien ? Diagnostic complet des 10 causes principales : food cost dérive, masse salariale, gaspillage, mauvaise carte, fournisseurs trop chers. Plan d'action concret.",
    type: 'article',
  },
  {
    path: '/blog/livraison-restaurant-rentabilite',
    title: 'Livraison restaurant : comment la rentabiliser sans se faire avoir',
    description: 'Uber Eats, Deliveroo, JustEat : commissions, marge réelle livraison, plateformes vs propre canal. Cas chiffrés et plan d action.',
    type: 'article',
  },
  {
    path: '/blog/ouvrir-food-truck-france-guide',
    title: 'Ouvrir un food truck en France : guide complet 2026',
    description: "Réglementation, coûts d'investissement, choix du véhicule, statuts juridiques, emplacements rentables, plan de rentabilité chiffré.",
    type: 'article',
  },
  {
    path: '/blog/contrat-travail-restauration-guide',
    title: 'Contrat de travail en restauration : CDI, CDD, extras, apprentissage 2026',
    description: 'CCN HCR, mentions obligatoires, coût employeur réel, contrat d extra et apprentissage : le guide complet 2026.',
    type: 'article',
  },
  {
    path: '/blog/reduire-facture-energie-restaurant',
    title: "Réduire sa facture d'énergie en restauration : 10 actions concrètes",
    description: "Audit cuisine, équipements A+++, négociation contrats gaz/électricité, CEE : 20 à 40% d'économies accessibles cette semaine.",
    type: 'article',
  },
  {
    path: '/blog/allergenes-restaurant-obligations-legales',
    title: 'Allergènes en restauration : obligations légales et affichage 2026',
    description: "Les 14 allergènes INCO, modèles d'affichage, sanctions DDPP, allergie sévère vs intolérance, bonnes pratiques en cuisine.",
    type: 'article',
  },
  {
    path: '/blog/fideliser-clients-restaurant-strategies',
    title: 'Fidéliser ses clients restaurant : programmes et stratégies 2026',
    description: "Carte tampon, CRM, anniversaires, NPS : les stratégies concrètes pour transformer vos clients occasionnels en habitués rentables et réduire votre coût d'acquisition.",
    type: 'article',
  },
  {
    path: '/blog/construire-carte-vins-restaurant',
    title: 'Carte des vins restaurant : guide pour maximiser la marge 2026',
    description: 'Comment construire une carte des vins rentable : nombre de références, coefficients multiplicateurs, rotation cave et présentation.',
    type: 'article',
  },
  {
    path: '/blog/plat-le-plus-rentable-restaurant',
    title: 'Quel est le plat le plus rentable dans un restaurant en 2026 ? (top 15)',
    description: "Découvrez les plats les plus rentables d'un restaurant en 2026 : pâtes, pizza, salade, soupe, dessert maison. Top 15 avec marge brute, food cost et coefficient. Comment construire une carte ultra-rentable.",
    type: 'article',
  },
  {
    path: '/blog/google-my-business-restaurant',
    title: 'Google My Business pour restaurant : guide complet 2026',
    description: "Google My Business restaurant 2026 : créer et optimiser sa fiche, gérer les avis, photos, posts et attributs pour dominer le Pack Local et remplir ses tables.",
    type: 'article',
  },
  // === Pages transactionnelles SEO (Wave 3+5+6+7) ===
  {
    path: '/alternative-zenchef',
    title: 'Alternative Zenchef : RestauMargin (19€/mois) | Comparatif 2026',
    description: 'Vous cherchez une alternative à Zenchef plus abordable et plus complète ? RestauMargin offre gestion des marges + food cost + IA pour 19€/mois. Comparatif complet.',
  },
  {
    path: '/alternative-innovorder',
    title: 'Alternative Innovorder | RestauMargin (19€/mois) | Comparatif 2026',
    description: 'Innovorder = POS + click and collect. RestauMargin = gestion marge + food cost (19€/mois). Comparatif honnête 2026.',
  },
  {
    path: '/alternative-hubrise',
    title: 'Alternative Hubrise | RestauMargin food cost | Comparatif 2026',
    description: 'Hubrise = hub intégrations livraison. RestauMargin = gestion food cost + marges (19€/mois). Comparaison et complémentarité 2026.',
  },
  {
    path: '/alternative-inpulse',
    title: 'Alternative à Inpulse pour restaurant indépendant | Comparatif 2026',
    description: 'Inpulse vise les chaînes, sur devis. RestauMargin suit marges et food cost à 19 €/mois, sans prévision ni connecteur de caisse. Comparatif factuel 2026.',
  },
  {
    path: '/alternative-lightspeed',
    title: 'Alternative Lightspeed Restaurant | RestauMargin food cost | 2026',
    description: 'Lightspeed = POS premium (89-200€/mois). RestauMargin = gestion marge + food cost (19€/mois). Comparatif honnête 2026.',
  },
  {
    path: '/alternative-laddition',
    title: "Alternative L'Addition | RestauMargin food cost 19€/mois | 2026",
    description: "L'Addition = POS français leader. RestauMargin = gestion food cost + marges. Comparatif honnête 2026.",
  },
  {
    path: '/alternative-thefork',
    title: 'Alternative TheFork Manager | RestauMargin food cost | 2026',
    description: 'TheFork Manager = réservations + marketing. RestauMargin = gestion food cost + marges + IA. Comparatif 2026.',
  },
  {
    path: '/alternative-cos-kitchen',
    title: 'Alternative COS Kitchen : RestauMargin, la gestion complète | 2026',
    description: 'COS Kitchen calcule votre food cost. RestauMargin ajoute stock, mercuriale avec alertes, IA et multi-restaurant pour 19€/mois. Comparatif détaillé.',
  },
  {
    path: '/alternative-marge-brut',
    title: 'Alternative Marge Brut : RestauMargin, la gestion complète | 2026',
    description: 'Marge Brut est gratuit en phase de développement. RestauMargin ajoute mercuriale, stock, menu engineering et HACCP pour 19€/mois. Comparatif détaillé.',
  },
  {
    path: '/logiciel-marge-restaurant',
    title: 'Logiciel de marge restaurant : RestauMargin (19€/mois)',
    description: 'Logiciel pour calculer la marge de votre restaurant. Food cost, fiches techniques, mercuriale, IA. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-bistrot',
    title: 'Logiciel de marge bistrot brasserie | Food cost cuisine française 2026',
    description: 'Logiciel de gestion marge bistrot et brasserie. Suivi food cost cuisine française, fiches techniques, fournisseurs. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-boulangerie',
    title: 'Logiciel marge boulangerie | Food cost pâtisserie | RestauMargin',
    description: 'Logiciel de calcul de marge pour boulangeries et pâtisseries. Coût matière, prix de vente, rendement farine. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-pizzeria',
    title: 'Logiciel marge pizzeria | Food cost pizza | RestauMargin',
    description: 'Logiciel pour calculer la marge d une pizzeria. Coût pâte, garniture, livraison. Food cost cible 22-25%. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-restaurant-italien',
    title: 'Logiciel marge restaurant italien | Food cost pâtes | RestauMargin',
    description: 'Logiciel pour calculer la marge d un restaurant italien. Coût pâtes, antipasti, risotto, vins. Food cost cible 26-30%. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-restaurant-indien',
    title: 'Logiciel marge restaurant indien | Food cost curry | RestauMargin',
    description: 'Logiciel pour calculer la marge d un restaurant indien. Coût curry, biryani, naan, dal, boissons. Food cost cible 28-32%. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-gastronomique',
    title: 'Logiciel marge restaurant gastronomique étoilé | RestauMargin',
    description: 'Logiciel pour piloter marges restaurant gastronomique étoilé. Food cost 32-40%, brigades importantes, produits nobles. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-dark-kitchen',
    title: 'Logiciel marge dark kitchen | Ghost kitchen rentabilité | RestauMargin',
    description: 'Logiciel pour calculer marge dark kitchen. Commissions plateformes, multi-marques, packaging. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-food-truck',
    title: 'Logiciel marge food truck | Food cost + emplacements | RestauMargin',
    description: 'Logiciel pour calculer marge food truck. Spécificités mobile, emplacements, météo. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-sushi',
    title: 'Logiciel marge sushi | Food cost saumon thon | RestauMargin',
    description: 'Logiciel pour calculer marge restaurant sushi japonais. Food cost 30-35%, ingrédients chers, gestion FIFO poisson. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-burger',
    title: 'Logiciel marge burger restaurant | Food cost smash | RestauMargin',
    description: 'Logiciel pour calculer la marge burger. Food cost 28-32%, steak, pain artisan, livraison. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-creperie',
    title: 'Logiciel marge crêperie | Food cost galettes + crêpes | RestauMargin',
    description: 'Logiciel pour calculer marge crêperie. Food cost 22-26%, sarrasin, beurre breton AOP, cidre. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-salad-bar',
    title: 'Logiciel marge salad bar healthy | Food cost poke bowl | RestauMargin',
    description: 'Logiciel pour calculer marge salad bar, poke bowl, healthy restaurant. Food cost 30-35%, gestion ingrédients frais. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-kebab',
    title: 'Logiciel marge kebab doner | Food cost sandwich | RestauMargin',
    description: 'Logiciel pour calculer marge kebab, doner, sandwicherie. Food cost cible 25-30%, gestion broche. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-traiteur',
    title: 'Logiciel marge traiteur | Food cost et devis traiteur | RestauMargin',
    description: "Logiciel pour calculer la marge d'un traiteur événementiel. Coût prestation, main d'oeuvre, devis, food cost cible 28-35%. Essai gratuit 7 jours.",
  },
  {
    path: '/logiciel-marge-cafe-bar',
    title: 'Logiciel marge café bar | Coefficient boissons | RestauMargin',
    description: 'Logiciel pour calculer marge café, bar, brasserie de quartier. Marge boissons 80-85%, gestion stocks alcool. Essai gratuit 7 jours.',
  },
  {
    path: '/logiciel-marge-glacier',
    title: 'Logiciel marge glacier salon de thé | Food cost glace | RestauMargin',
    description: 'Logiciel pour calculer marge glacier, salon de thé. Food cost 20-25%, marge boules 75-80%. Essai gratuit 7 jours.',
  },
  {
    path: '/comparatif-logiciels-restaurant',
    title: 'Comparatif logiciels restaurant 2026 | 12 outils analysés | RestauMargin',
    description: 'Comparatif honnête de 12 logiciels restaurant en 2026 : RestauMargin, Lightspeed, Zenchef, Innovorder, Hubrise, TheFork, L Addition. Prix, fonctionnalités, avis.',
  },
  {
    path: '/comparatif-restaumargin-vs-zenchef',
    title: 'RestauMargin vs Zenchef : comparatif complet 2026 (prix, features, avis)',
    description: 'Comparatif benchmark RestauMargin vs Zenchef en 2026. Prix, fonctionnalités, food cost, réservations, gestion marge. Quelle solution choisir selon votre restaurant ? Verdict honnête.',
    type: 'article',
  },
  {
    path: '/glossaire-restauration',
    title: 'Glossaire restauration 2026 | 60+ définitions food cost, marge, KPI | RestauMargin',
    description: 'Glossaire complet de la restauration. 60+ termes définis : food cost, marge, prime cost, fiche technique, HACCP, GMP, RevPASH. Guide de référence 2026.',
  },
  {
    path: '/outils/calculateur-marge-restaurant',
    title: 'Calculateur marge restaurant gratuit | Food cost + coefficient | RestauMargin',
    description: 'Outil gratuit pour calculer la marge brute, le food cost et le coefficient multiplicateur de votre plat. Sans inscription, en 2 minutes.',
  },
  {
    path: '/outils/calculateur-food-cost',
    title: 'Calculateur de Food Cost Restaurant Gratuit | RestauMargin',
    description: 'Calculez gratuitement le food cost de vos plats. Outil en ligne pour restaurateurs : coût matière, prix de vente, marge brute par recette.',
  },
  {
    path: '/outils/generateur-qr-menu',
    title: 'Générateur de QR Code Menu Restaurant Gratuit | RestauMargin',
    description: 'Générez gratuitement un QR code pour le menu digital de votre restaurant. Simple, rapide et personnalisable.',
  },
  {
    path: '/station-produit',
    title: 'Station de Pesée Connectée — RestauMargin',
    description: 'Pesez vos ingrédients en temps réel avec la station de pesée connectée RestauMargin. Compatible balance Bluetooth.',
  },
  {
    path: '/mentions-legales',
    title: 'Mentions Légales — RestauMargin',
    description: 'Mentions légales de RestauMargin, plateforme SaaS de gestion de marge pour restaurateurs.',
  },
  {
    path: '/cgv',
    title: 'Conditions Générales de Vente — RestauMargin',
    description: 'CGV de RestauMargin. Conditions générales de vente et abonnement.',
  },
  {
    path: '/cgu',
    title: "Conditions Générales d'Utilisation — RestauMargin",
    description: "CGU de RestauMargin. Conditions générales d'utilisation de la plateforme.",
  },
  {
    path: '/politique-confidentialite',
    title: 'Politique de Confidentialité — RestauMargin',
    description: 'Politique de confidentialité et protection des données personnelles de RestauMargin. Conforme RGPD.',
  },
  {
    path: '/blog/tva-restauration-taux-guide',
    title: 'TVA en restauration 2026 : 5,5 %, 10 % ou 20 % — quel taux appliquer ?',
    description: "Le guide complet de la TVA en restauration : la vraie règle (consommation immédiate ou différée), le piège de l'alcool, le ticket à taux multiples, et l'impact sur votre marge.",
    type: 'article',
  },
  {
    path: '/blog/licence-iv-restaurant-guide',
    title: "Licence IV en restauration : l'obtenir, la transférer, l'exploiter (guide 2026)",
    description: "Groupes de boissons, licence restaurant vs licence IV, permis d'exploitation, mutation et transfert, prix 2026, comptabilisation et les 4 pièges qui font perdre une licence.",
    type: 'article',
  },
  {
    path: '/blog/avis-google-negatifs-restaurant',
    title: 'Avis Google négatifs au restaurant : la méthode qui limite les dégâts',
    description: "Combien coûte un avis négatif, comment y répondre sans se braquer, quand demander sa suppression à Google, et comment construire un matelas d'avis positifs.",
    type: 'article',
  },
  {
    path: '/blog/no-show-restaurant-solutions',
    title: 'No-show au restaurant : solutions pour réduire les réservations non honorées (2026)',
    description: "Calculez le vrai coût d'un no-show, activez les SMS de rappel, l'empreinte bancaire et rédigez une politique d'annulation béton. Guide complet 2026.",
    type: 'article',
  },
  {
    path: '/blog/brigade-cuisine-organisation-postes',
    title: 'Brigade de cuisine : organisation, postes et gestion du stress',
    description: "La pyramide Escoffier adaptée à un vrai restaurant en 2026 : dimensionnement par taille d'établissement, coût chiffré d'un turnover à 50%, obligation légale du DUERP face au burnout, et rituels de communication chef-équipe.",
    type: 'article',
  },
  {
    path: '/blog/logiciel-reservation-restaurant',
    title: 'Logiciel de réservation restaurant : comparatif 2026',
    description: 'Comparatif complet des logiciels de réservation pour restaurants en 2026 : TheFork, Zenchef, Sevenrooms, Google Reserve. Critères de choix, coûts réels et ROI.',
    type: 'article',
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
  // H1 reellement injectes, pour le controle final (voir fin de run()).
  const h1Produits = new Set();

  // Corps rendus par scripts/prerender-ssr.mjs (renderToString des vraies pages).
  // Absent = build sans l'etape SSR : on garde le resume, sans echouer.
  const ssrPath = path.join(DIST, '.ssr', 'manifest.json');
  const ssrBodies = fs.existsSync(ssrPath) ? JSON.parse(fs.readFileSync(ssrPath, 'utf-8')) : {};
  let ssrCount = 0;
  // Fichier de travail : il ne doit pas etre servi par Vercel (plusieurs Mo).
  fs.rmSync(path.join(DIST, '.ssr'), { recursive: true, force: true });

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
      route.path === '/blog' ? 'blog-index' :
      route.path.startsWith('/blog/') ? 'article' :
      route.path.startsWith('/guide-marge/') ? 'guide' :
      route.path.startsWith('/alternative-') ? 'comparison' :
      route.path.startsWith('/comparatif-') ? 'mega-comparison' :
      route.path === '/glossaire-restauration' ? 'glossary' :
      route.path.startsWith('/logiciel-marge-') ? 'niche' :
      route.path.startsWith('/outils/') ? 'tool' :
      'landing';

    const breadcrumbs =
      category === 'article' || category === 'blog-index' ? 'Accueil &gt; Blog' :
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
      niche: `<strong>${mainKw}</strong> — logiciel SaaS spécifiquement conçu pour votre métier en 2026. Food cost cible, coefficients multiplicateurs adaptés, exemples chiffrés et exemples illustratifs de transformation.`,
      tool: `<strong>${mainKw}</strong> — outil interactif gratuit RestauMargin 2026. Saisissez vos données, obtenez un calcul instantané et téléchargez votre rapport personnalisé. Sans inscription.`,
      glossary: `<strong>${mainKw}</strong> — glossaire exhaustif 2026 des termes essentiels de la restauration : food cost, prime cost, fiche technique, HACCP, RevPASH, marge brute. 60+ définitions précises avec exemples.`,
      'blog-index': `<strong>Blog RestauMargin</strong> — guides pratiques et articles de fond pour restaurateurs : calcul de marge, food cost, fiches techniques, HACCP, pricing menu et rentabilité restaurant. Publiés et mis à jour par des experts en gestion de restaurant.`,
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
          <li>Exemple illustratif avant/après chiffré</li>
        </ul>`,
      comparison: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Que contient ce comparatif ?</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
          <li>Vue d'ensemble et positionnement de chaque outil</li>
          <li>Tableau comparatif détaillé sur 18 à 25 critères clés</li>
          <li>Comparatif tarifaire sur 12 mois (formules incluses)</li>
          <li>Cas d'usage par profil de restaurateur</li>
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
      'blog-index': `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Nos catégories d'articles</h2>
        <ul style="padding-left:20px;color:#525252;line-height:1.8">
          <li>Calcul de marge et food cost restaurant</li>
          <li>Fiches techniques et prix de revient</li>
          <li>HACCP et hygiène alimentaire</li>
          <li>Gestion des stocks et méthode FIFO</li>
          <li>Intelligence artificielle en cuisine</li>
          <li>Menu engineering et stratégie de pricing</li>
        </ul>`,
      landing: `
        <h2 style="font-size:24px;font-weight:700;margin:40px 0 16px 0;color:#111111">Pourquoi RestauMargin ?</h2>
        <p>RestauMargin réunit en une seule application tout ce qui était auparavant éparpillé sur plusieurs outils : calcul automatique du food cost et des marges, fiches techniques précises avec grammages et coûts, mercuriale fournisseurs intelligente, alertes prix matières premières, station de pesée Bluetooth, commandes fournisseurs optimisées par IA et tableau de bord temps réel. Une seule offre à 19 €/mois, essai gratuit 7 jours.</p>`,
    };

    const snippetText = snippetTexts[category] || snippetTexts.landing;
    // Une route peut fournir son propre corps SEO (contenu reel de l'article).
    // A defaut seulement, on retombe sur le gabarit generique de la categorie.
    const secondary = route.seoBody || secondaryContent[category] || secondaryContent.landing;

    // Article-related links vary by category to avoid showing identical "Articles connexes"
    const relatedLinks = {
      article: [
        ['/blog/calcul-marge-restaurant', 'Marge restaurant 2026 : taux moyen, calcul et formules'],
        ['/blog/coefficient-multiplicateur', 'Coefficient multiplicateur restaurant 2026'],
        ['/blog/reduire-food-cost', 'Réduire le food cost : 10 stratégies'],
        ['/blog/prime-cost-restaurant', 'Prime cost : l\'indicateur n°1 de rentabilité'],
        ['/blog/faq-marge-restaurant-25-questions', 'FAQ Marge : 25 questions essentielles'],
      ],
      guide: [
        ['/blog/calcul-marge-restaurant', 'Calcul marge restaurant : guide complet'],
        ['/logiciel-marge-bistrot', 'Logiciel marge bistrot et brasserie'],
        ['/logiciel-marge-pizzeria', 'Logiciel marge pizzeria'],
        ['/logiciel-marge-restaurant-italien', 'Logiciel marge restaurant italien'],
        ['/logiciel-marge-restaurant-indien', 'Logiciel marge restaurant indien'],
        ['/blog/seuil-rentabilite-restaurant', 'Seuil de rentabilité restaurant'],
      ],
      comparison: [
        ['/comparatif-logiciels-restaurant', 'Comparatif 12 logiciels restaurant 2026'],
        ['/alternative-zenchef', 'Alternative Zenchef'],
        ['/alternative-lightspeed', 'Alternative Lightspeed Restaurant'],
        ['/alternative-inpulse', 'Alternative à Inpulse'],
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
        ['/blog/reduire-food-cost', 'Réduire le food cost'],
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
      'blog-index': [
        ['/blog/calcul-marge-restaurant', 'Marge restaurant 2026 : taux moyen, calcul et formules'],
        ['/blog/coefficient-multiplicateur', 'Coefficient multiplicateur restaurant 2026'],
        ['/blog/reduire-food-cost', 'Réduire le food cost : 10 stratégies'],
        ['/blog/prime-cost-restaurant', 'Prime cost : l\'indicateur n°1 de rentabilité'],
        ['/blog/fiche-technique-restaurant', 'Fiche technique restaurant : modèle et calcul'],
      ],
      landing: [
        ['/blog/calcul-marge-restaurant', 'Calculer la marge de votre restaurant'],
        ['/blog/reduire-food-cost', 'Réduire le food cost : 10 stratégies'],
        ['/comparatif-logiciels-restaurant', 'Comparatif 12 logiciels restaurant'],
        ['/glossaire-restauration', 'Glossaire restauration 60+ termes'],
        ['/pricing', 'Tarif : 19 €/mois, offre unique'],
      ],
    };

    const linksList = (relatedLinks[category] || relatedLinks.landing)
      .map(([href, label]) => `<li><a href="${href}" style="color:#0d9488;text-decoration:none">${label}</a></li>`)
      .join('');

    // ─── BreadcrumbList Schema (rich snippet "navigation visible" dans Google) ───
    const breadcrumbCategoryUrl =
      category === 'blog-index' ? `${BASE_URL}/blog` :
      category === 'article' ? `${BASE_URL}/blog` :
      category === 'guide' ? `${BASE_URL}/blog` :
      category === 'comparison' || category === 'mega-comparison' ? `${BASE_URL}/comparatif-logiciels-restaurant` :
      category === 'niche' ? `${BASE_URL}/logiciel-marge-restaurant` :
      category === 'tool' ? `${BASE_URL}/outils/calculateur-marge-restaurant` :
      category === 'glossary' ? `${BASE_URL}/glossaire-restauration` :
      `${BASE_URL}/`;

    const breadcrumbCategoryName =
      category === 'blog-index' || category === 'article' || category === 'guide' ? 'Blog' :
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
        category !== 'landing' && category !== 'blog-index'
          ? { '@type': 'ListItem', position: 3, name: breadcrumbLabel, item: fullUrl }
          : null,
      ].filter(Boolean),
    };

    const breadcrumbSchemaScript = `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

    // Inject BreadcrumbList schema in <head> (before </head>)
    html = html.replace('</head>', `  ${breadcrumbSchemaScript}\n  </head>`);

    // ─── Article + FAQPage schema, auto-extraite du seoBody ───
    // Verifie le 2026-09-16 : aucune des ~50 pages blog/guide n'emettait de
    // schema Article ou FAQPage cote statique (seul BreadcrumbList existait
    // ci-dessus). Les runs precedents croyaient l'avoir "confirme" en grep-ant
    // la chaine "FAQPage" dans le HTML, qui ne matchait en realite QUE le
    // commentaire mort retire le 27/07 dans client/index.html (present sur
    // TOUTES les pages) — faux positif systematique. Les questions/reponses du
    // seoBody sont deja redigees et visibles ; on les reduplique ici en JSON-LD
    // sans inventer de contenu (meme regle que le pattern seoBody existant).
    if (route.seoBody && (category === 'article' || category === 'guide')) {
      const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const faqPairs = [];
      const faqRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
      let faqMatch;
      while ((faqMatch = faqRegex.exec(route.seoBody)) !== null) {
        const question = stripTags(faqMatch[1]);
        const answer = stripTags(faqMatch[2]);
        if (question && answer) faqPairs.push({ question, answer });
      }

      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: h1,
        description: route.description,
        image: `${BASE_URL}/og-image.png`,
        dateModified: BUILD_DATE,
        author: { '@type': 'Organization', name: 'RestauMargin', url: BASE_URL },
        publisher: {
          '@type': 'Organization',
          name: 'RestauMargin',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/og-image.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
      };
      html = html.replace(
        '</head>',
        `  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n  </head>`
      );

      if (faqPairs.length >= 2) {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqPairs.map((qa) => ({
            '@type': 'Question',
            name: qa.question,
            acceptedAnswer: { '@type': 'Answer', text: qa.answer },
          })),
        };
        html = html.replace(
          '</head>',
          `  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n  </head>`
        );
      }
    }

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

    // Remplace le fallback <noscript> generique par le contenu propre a la route.
    //
    // FIX 2026-09-25 : l'ancienne regex exigeait un <script> JUSTE APRES le </div>
    // de #root : /<div id="root">[\s\S]*?<\/div>(\s*<script)/. Or Vite remonte le
    // script module dans le <head> du HTML construit ; le seul <script> qui suivait
    // encore #root etait celui de Crisp. Crisp retire (commit 974c72f), la regex ne
    // trouvait plus rien, replace() rendait la chaine inchangee — et le log
    // ci-dessous affirmait quand meme « Generated 132 static HTML files ... with
    // route-specific H1 ». Resultat mesure en prod : 133 pages, UN SEUL H1, UN SEUL
    // body, pour tous les robots qui n'executent pas le JavaScript.
    //
    // Deux changements :
    // 1. On ancre sur des marqueurs EXPLICITES poses dans client/index.html
    //    (<!--prerender:root--> ... <!--/prerender:root-->), qui ne dependent plus
    //    de ce qui entoure #root.
    // 2. Si l'injection n'a pas lieu, le build ECHOUE. Un replace() qui ne trouve
    //    rien ne leve aucune erreur : c'est exactement ce silence qu'il faut casser.
    // Remplacement par FONCTION : seoBody peut contenir des « $ » que le
    // remplacement par chaine interpreterait ($&, $1...).
    // Si la page a ete rendue au build (scripts/prerender-ssr.mjs), on sert son
    // VRAI corps — le meme DOM que React affichera — au lieu du resume. Son H1
    // est alors celui de l'article, pas celui derive du <title>.
    const ssrBody = ssrBodies[route.path];
    const ssrH1 = ssrBody && (ssrBody.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
    const rootContent = ssrH1 ? ssrBody : seoStaticContent;
    const h1Attendu = ssrH1 || h1;
    const avantInjection = html;
    html = html.replace(
      /<!--prerender:root-->[\s\S]*?<!--\/prerender:root-->/,
      () => `<!--prerender:root-->${rootContent}<!--/prerender:root-->`
    );
    if (html === avantInjection || !html.includes(`>${h1Attendu}</h1>`)) {
      console.error(
        `[prerender] ECHEC : contenu non injecte pour ${route.path}. ` +
        `Les marqueurs <!--prerender:root--> / <!--/prerender:root--> sont-ils ` +
        `toujours presents dans client/index.html (et conserves par Vite) ?`
      );
      process.exit(1);
    }
    h1Produits.add(h1Attendu.replace(/<[^>]+>/g, '').trim());
    if (ssrH1) ssrCount++;

    // Write the file
    const dir = path.join(DIST, route.path);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
    count++;
  }

  // Controle final : le log ci-dessous a menti pendant 24 h en annoncant
  // « route-specific H1 » alors qu un seul H1 etait servi pour 133 pages. On ne
  // l ecrit plus que si c est vrai : autant de H1 DISTINCTS que de pages.
  // (Deux routes peuvent legitimement partager un titre : on tolere un ecart de
  // quelques unites, mais pas l effondrement a 1 qui signe une injection morte.)
  if (h1Produits.size < Math.max(2, Math.floor(count * 0.9))) {
    console.error(`[prerender] ECHEC : seulement ${h1Produits.size} H1 distincts pour ${count} pages.`);
    process.exit(1);
  }
  console.log(`[prerender] Generated ${count} static HTML files for SEO (${h1Produits.size} H1 distincts verifies, ${ssrCount} avec corps complet SSR).`);
}

run();
