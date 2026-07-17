// One-shot scan to identify hardcoded FR strings in pages/components
const fs = require('fs');
const path = require('path');

function isFrench(s) {
  if (/[éèêàâîïôùûçÉÈÊÀÂÎÏÔÙÛÇ]/.test(s)) return true;
  const lower = s.toLowerCase();
  const frWords = ['le ', 'la ', 'les ', 'un ', 'une ', 'des ', 'du ', 'votre ', 'vous ', 'pour ', 'sur ', 'avec ', 'sans ', 'ajouter', 'supprimer', 'modifier', 'enregistr', 'rechercher', 'aucun', 'aucune', 'nouveau', 'nouvelle', 'tous', 'toutes', 'voir ', 'fermer', 'annuler', 'erreur', 'succès', 'sauvegard', 'chargement', 'sélection'];
  return frWords.some(w => lower.includes(w));
}

function scanFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  let count = 0;
  const found = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\/\//.test(line)) continue;
    if (/^\s*\*/.test(line)) continue;
    if (/^\s*import\s/.test(line)) continue;
    if (/console\.(log|warn|error|debug|info)/.test(line)) continue;

    const matches = line.match(/['"`][A-ZÉÈÀÂÊÎÏÔÙÛÇa-zéèàâêîïôùûç][a-zéèàâêîïôùûç\s,!?.():\-+\/\d%€'"]+['"`]/g) || [];
    for (const m of matches) {
      const inner = m.slice(1, -1);
      if (inner.length < 3) continue;
      if (isFrench(inner)) {
        const idx = line.indexOf(m);
        const before = line.substring(Math.max(0, idx - 5), idx);
        if (/t\(/.test(before)) continue;
        count++;
        if (found.length < 3) found.push(inner.substring(0, 80));
      }
    }
  }
  return { count, found };
}

const cwd = process.cwd();
const pagesDir = path.join(cwd, 'client', 'src', 'pages');
const compsDir = path.join(cwd, 'client', 'src', 'components');

const results = [];
for (const dir of [pagesDir, compsDir]) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  for (const f of files) {
    const fp = path.join(dir, f);
    const r = scanFile(fp);
    if (r.count > 0) {
      const rel = path.relative(cwd, fp).replace(/\\/g, '/');
      results.push({ file: rel, count: r.count, sample: r.found });
    }
  }
}
results.sort((a, b) => b.count - a.count);
console.log('TOP 60 files with FR hardcoded:');
for (const r of results.slice(0, 60)) {
  console.log(String(r.count).padStart(4), r.file);
  for (const s of r.sample) console.log('      "' + s + '"');
}
console.log('---');
console.log('Total files:', results.length);
console.log('Total hardcoded strings (heuristic):', results.reduce((s, r) => s + r.count, 0));
