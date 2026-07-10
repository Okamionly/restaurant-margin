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

  // IndexNow est un protocole partage : une soumission acceptee par un moteur est
  // repartagee aux autres participants (dont Bing). On tente plusieurs endpoints et
  // on considere le run reussi si AU MOINS UN accepte. Utile tant que la verification
  // de la cle cote Bing (api.indexnow.org / bing.com) renvoie 403 : yandex.com accepte
  // et propage les URLs au reseau IndexNow.
  const ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
  let anyOk = false;
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body,
      });
      const ok = res.status === 200 || res.status === 202;
      anyOk = anyOk || ok;
      const host = new URL(endpoint).host;
      console.log(`  ${ok ? 'OK ' : 'KO '} ${host.padEnd(20)} HTTP ${res.status} ${res.statusText}`);
      if (!ok) {
        const txt = await res.text().catch(() => '');
        if (txt) console.log(`     ${txt.slice(0, 200)}`);
      }
    } catch (e) {
      console.log(`  KO  ${endpoint} : ${e.message}`);
    }
  }
  // 200/202 = accepte. 403 = cle pas encore verifiee cote moteur. 422 = URL/host invalide.
  console.log(anyOk ? 'IndexNow : accepte par au moins un moteur (repartage au reseau).' : 'IndexNow : aucun moteur accepte.');
  process.exit(anyOk ? 0 : 1);
}

main().catch((e) => { console.error('Erreur IndexNow :', e.message); process.exit(1); });
