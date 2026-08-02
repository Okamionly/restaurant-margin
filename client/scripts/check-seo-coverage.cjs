#!/usr/bin/env node
/**
 * @file client/scripts/check-seo-coverage.cjs
 *
 * Garde-fou SEO : toute URL du sitemap DOIT avoir une entree dans prerender.cjs.
 *
 * Pourquoi ce script existe
 * -------------------------
 * Sans entree dans `prerender.cjs`, Vercel sert le `index.html` generique de la
 * SPA au crawler : Googlebot recoit alors le <title> de la HOMEPAGE au lieu du
 * title de la page. La page est publiee, routee, listee dans le sitemap... et
 * totalement invisible pour Google (doublon de title).
 *
 * Ce defaut s'est produit 3 semaines de suite (W29, W30, W31) sur des articles
 * crees par l'agent blog-writer, qui met a jour App.tsx + sitemap.xml mais pas
 * prerender.cjs. Il est invisible au build : `vite build` passe au vert.
 *
 * Usage :  npm run seo:check      (exit 1 si une URL n'est pas couverte)
 */

const fs = require('fs');
const path = require('path');

const CLIENT = path.resolve(__dirname, '..');
const SITEMAP = path.join(CLIENT, 'public', 'sitemap.xml');
const PRERENDER = path.join(CLIENT, 'scripts', 'prerender.cjs');
const BASE_URL = 'https://www.restaumargin.fr';

/**
 * `/` n'a pas besoin d'entree : c'est le `dist/index.html` de base, deja porteur
 * du title de la homepage. Toute AUTRE exception doit etre justifiee ici, pas
 * ajoutee en silence.
 */
const ALLOWLIST = new Set(['/']);

function sitemapPaths() {
  const xml = fs.readFileSync(SITEMAP, 'utf-8');
  const locs = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return locs.map((l) => l.replace(/<\/?loc>/g, '').replace(BASE_URL, '') || '/');
}

function prerenderPaths() {
  const src = fs.readFileSync(PRERENDER, 'utf-8');
  const paths = src.match(/path:\s*'([^']+)'/g) || [];
  return paths.map((p) => p.replace(/path:\s*'/, '').replace(/'$/, ''));
}

const sitemap = [...new Set(sitemapPaths())];
const prerender = new Set(prerenderPaths());

const missing = sitemap.filter((p) => !prerender.has(p) && !ALLOWLIST.has(p));
const orphans = [...prerender].filter((p) => !sitemap.includes(p));

console.log(`[seo:check] sitemap = ${sitemap.length} URLs · prerender = ${prerender.size} routes`);

if (orphans.length) {
  // Non bloquant : une page peut etre prerendue volontairement hors sitemap.
  console.warn(`[seo:check] ${orphans.length} route(s) prerendue(s) absente(s) du sitemap :`);
  orphans.forEach((p) => console.warn(`   - ${p}`));
}

if (missing.length) {
  console.error(`\n[seo:check] ECHEC — ${missing.length} URL(s) du sitemap sans entree prerender.`);
  console.error('Googlebot recevra le <title> de la homepage sur ces URLs :');
  missing.forEach((p) => console.error(`   - ${p}`));
  console.error("\nCorrectif : ajouter { path, title, description, type:'article' } dans ROUTES de client/scripts/prerender.cjs");
  process.exit(1);
}

console.log('[seo:check] OK — toutes les URLs du sitemap sont prerendues.');
