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
  // censee etre repartagee aux autres participants. On tente plusieurs endpoints et
  // on considere le run techniquement reussi si AU MOINS UN accepte.
  //
  // ATTENTION — premisse REFUTEE par la mesure du 2026-09-20. Ce commentaire affirmait
  // auparavant que l'acceptation par yandex.com "propage les URLs au reseau IndexNow"
  // et couvrait donc Bing malgre le 403. Apres 3+ semaines de runs quotidiens avec
  // yandex 202 et bing 403, Bing n'a TOUJOURS aucune page du site : sonde par titre
  // exact, validee par temoin (le titre exact de zenchef.com remonte zenchef #1 a #5 ;
  // les titres exacts de la home et de /blog/calcul-marge-restaurant ne remontent
  // AUCUNE page restaumargin.fr). Cote serveur tout est correct : robots.txt Allow,
  // bingbot recoit 200 + HTML prerendu, sitemap declare, fichier cle servi en 200.
  // Le 403 UserForbiddedToAccessSite est donc le SEUL blocage, et il n'est pas
  // contournable par Yandex : il exige la revendication du domaine dans Bing Webmaster
  // Tools (action proprietaire, hors depot). Tant qu'elle n'est pas faite, ce script
  // n'alimente que Yandex — ne pas lire son exit 0 comme "Bing est couvert".
  const ENDPOINTS = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];
  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
  let anyOk = false;
  let bingOk = false;
  const okHosts = [];
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
      if (ok) { okHosts.push(host); if (/bing|indexnow.org/.test(host)) bingOk = true; }
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
  if (!anyOk) {
    console.log('IndexNow : AUCUN moteur n a accepte la soumission.');
  } else if (!bingOk) {
    console.log('IndexNow : accepte par ' + okHosts.join(', ') + '.');
    console.log('IndexNow : BING REFUSE (403) — canal Bing ferme, indexation Bing nulle.');
    console.log('           Action proprietaire requise : revendiquer www.restaumargin.fr');
    console.log('           dans Bing Webmaster Tools (https://www.bing.com/webmasters) ;');
    console.log('           option "Importer depuis Google Search Console" la plus rapide.');
  } else {
    console.log('IndexNow : accepte par ' + okHosts.join(', ') + ', Bing inclus.');
  }
  process.exit(anyOk ? 0 : 1);
}

main().catch((e) => { console.error('Erreur IndexNow :', e.message); process.exit(1); });
