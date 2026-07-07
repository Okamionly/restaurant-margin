// IndexNow ping — soumet toutes les URLs du sitemap a Bing + Yandex (indexation quasi instantanee).
// Usage : node scripts/indexnow-ping.mjs   (ou : npm run indexnow)
// Prerequis : le fichier cle https://www.restaumargin.fr/<KEY>.txt doit etre en ligne (deploye).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KEY = '2705a97b02bcbcaf1eb932313db3b7f8aea4901c38fe6379dbe56cce8184a951';
const HOST = 'www.restaumargin.fr';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const sitemapPath = join(__dirname, '..', 'client', 'public', 'sitemap.xml');

function extractUrls(xml) {
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(locs.filter((u) => u.includes(HOST)))];
}

async function main() {
  const xml = readFileSync(sitemapPath, 'utf8');
  const urlList = extractUrls(xml);
  if (!urlList.length) { console.error('Aucune URL trouvee dans le sitemap.'); process.exit(1); }
  console.log(`IndexNow : soumission de ${urlList.length} URLs pour ${HOST}...`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  const txt = await res.text().catch(() => '');
  console.log(`Reponse IndexNow : HTTP ${res.status} ${res.statusText}`);
  if (txt) console.log(txt.slice(0, 300));
  // 200/202 = accepte. 403 = cle non verifiee (le .txt n'est pas encore en ligne). 422 = URL/host invalide.
  process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
}

main().catch((e) => { console.error('Erreur IndexNow :', e.message); process.exit(1); });
