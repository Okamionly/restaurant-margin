#!/usr/bin/env node
/**
 * Rend le CORPS des pages publiques en HTML statique (renderToString), au build.
 *
 * Pourquoi (mesure 2026-10-03, reports/seo-daily-2026-10-03.md) : prerender.cjs
 * n'injectait dans #root qu'un resume (H1 + description + liens) — 120 pages sur
 * 132 servaient moins de 200 mots aux robots qui n'executent pas le JavaScript
 * (Bing en tete), alors que les articles en font plus de 2 500. Et le LCP des
 * articles attendait le rendu JS du corps (FCP ~1,9 s -> LCP ~3,4 s).
 *
 * Ce script charge chaque composant de page via le SSR de Vite, le rend avec
 * les memes providers que l'app (HelmetProvider + router), et ecrit le HTML dans
 * dist/.ssr/manifest.json. prerender.cjs l'injecte ensuite a la place du resume.
 *
 * L'app monte avec createRoot (pas hydrateRoot) : le HTML statique est remplace
 * au premier rendu, aucune contrainte de correspondance exacte. Les fonds WebGL
 * sont en lazy + Suspense : renderToString rend leur fallback, rien d'autre.
 *
 * Tolerant par page : une page qui echoue au rendu garde le resume actuel (log
 * explicite). Le script n'echoue que si AUCUNE page n'a ete rendue.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(DIST, '.ssr');

// Prefixes publics dont le corps est du contenu editorial statique.
const PREFIXES = ['/blog/', '/guide-marge/', '/logiciel-marge-', '/alternative-', '/comparatif-'];

function routesFromApp() {
  const app = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');
  const imports = new Map();
  for (const m of app.matchAll(/const (\w+) = lazy(?:Retry)?\(\(\) => import\('(\.\/[^']+)'\)\)/g)) {
    imports.set(m[1], m[2]);
  }
  const routes = [];
  for (const m of app.matchAll(/<Route path="([^"]+)" element=\{([\s\S]*?)\} \/>/g)) {
    const p = m[1];
    if (!PREFIXES.some((x) => p.startsWith(x)) || p.includes(':') || p.includes('*')) continue;
    const comp = [...m[2].matchAll(/<(\w+) \/>/g)].map((x) => x[1]).find((n) => imports.has(n));
    if (comp) routes.push({ path: p, file: imports.get(comp).replace(/^\.\//, '/src/') });
  }
  return routes;
}

// Retire ce qui n'a rien a faire dans un corps statique : scripts et marqueurs
// de frontiere Suspense laisses par renderToString.
function clean(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!--\$\??!?-->|<!--\/\$-->/g, '');
}

async function main() {
  // Builds de production de React : pas d'avertissements de dev (useLayoutEffect
  // du Link de react-router), et le meme rendu que la prod.
  process.env.NODE_ENV = 'production';
  const routes = routesFromApp();
  const vite = await createServer({
    root: ROOT,
    configFile: false,
    plugins: [react()],
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });

  // Dependances chargees par Node, pas par Vite : en SSR, Vite externalise
  // node_modules, donc les pages importent ces MEMES instances (un seul React).
  const { renderToString } = await import('react-dom/server');
  const React = (await import('react')).default;
  const { MemoryRouter } = await import('react-router-dom');
  const { HelmetProvider } = await import('react-helmet-async');

  const manifest = {};
  const echecs = [];
  for (const r of routes) {
    try {
      const mod = await vite.ssrLoadModule(r.file);
      const Page = mod.default;
      const html = renderToString(
        React.createElement(HelmetProvider, { context: {} },
          React.createElement(MemoryRouter, { initialEntries: [r.path] },
            React.createElement(Page)))
      );
      const body = clean(html);
      if (!/<h1[\s>]/.test(body)) throw new Error('aucun <h1> dans le rendu');
      manifest[r.path] = body;
    } catch (e) {
      echecs.push(`${r.path} (${String(e && e.message || e).split('\n')[0]})`);
    }
  }
  await vite.close();

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest));
  const n = Object.keys(manifest).length;
  console.log(`[prerender-ssr] ${n}/${routes.length} pages rendues en HTML statique.`);
  for (const e of echecs) console.warn(`[prerender-ssr] repli sur le resume : ${e}`);
  if (n === 0) {
    console.error('[prerender-ssr] ECHEC : aucune page rendue.');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[prerender-ssr] ECHEC :', e);
  process.exit(1);
});
