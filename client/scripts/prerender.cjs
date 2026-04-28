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
    title: 'Comment calculer la marge de votre restaurant en 2026',
    description: 'Guide complet pour calculer la marge de votre restaurant : food cost, coefficient multiplicateur, marge brute et nette.',
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
