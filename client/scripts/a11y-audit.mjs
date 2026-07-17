/**
 * a11y-audit.mjs — Audit d'accessibilite STATIQUE d'un ecran RestauMargin.
 *
 * Gate objectif de la boucle LOOPS.md (G2/G3/G4). Analyse le SOURCE JSX d'un
 * ecran (pas le DOM runtime) et rapporte deux compteurs qui doivent valoir 0
 * pour qu'un ecran passe :
 *   - inputs-sans-label            : <input>/<select>/<textarea> de SAISIE sans
 *                                    <label htmlFor> lie, ni aria-label, ni
 *                                    aria-labelledby, ni label parent (implicite).
 *   - boutons-icone-sans-aria-label: <button> dont le contenu est UNIQUEMENT une
 *                                    icone (lucide/svg/img), sans texte visible,
 *                                    sans aria-label / aria-labelledby / title.
 *
 * Sont EXCLUS du comptage inputs : type="hidden" | "submit" | "button" | "reset"
 * (ce ne sont pas des champs de saisie). Un type dynamique ({...}) ou absent
 * (defaut = text) est COMPTE.
 *
 * Usage (depuis client/) :
 *   node scripts/a11y-audit.mjs src/pages/Dashboard.tsx
 *   node scripts/a11y-audit.mjs src/pages/Recipes.tsx src/pages/RecipeDetail.tsx
 *
 * Exit codes (pensés pour etre chaines dans la boucle) :
 *   0 = audit propre (les 2 compteurs = 0 sur tous les fichiers)
 *   1 = au moins une violation a11y trouvee (chaque ligne dit QUOI faire)
 *   2 = erreur d'usage (aucun argument, ou fichier introuvable)
 *
 * Le script ne modifie AUCUN fichier : lecture seule, rejouable a l'infini.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const EXCLUDED_INPUT_TYPES = new Set(['hidden', 'submit', 'button', 'reset']);

// ─── Scanner JSX bas niveau ──────────────────────────────────────────────────
// Trouve les balises ouvrantes d'un element natif (nom en minuscules), en
// respectant les accolades {..}, les chaines "" '' `` (pour ne pas confondre un
// '>' d'expression avec la fin de balise).
function findOpeningTags(src, tagName) {
  const results = [];
  const needle = '<' + tagName;
  let i = 0;
  while ((i = src.indexOf(needle, i)) !== -1) {
    const after = src[i + needle.length];
    // frontiere de mot : <input mais pas <inputmask / <buttonBar
    if (after && /[A-Za-z0-9_-]/.test(after)) { i += needle.length; continue; }
    let j = i + needle.length;
    let depth = 0;
    let quote = null;
    let selfClosing = false;
    let tagEnd = -1;
    while (j < src.length) {
      const c = src[j];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'" || c === '`') {
        quote = c;
      } else if (c === '{') {
        depth++;
      } else if (c === '}') {
        if (depth > 0) depth--;
      } else if (c === '>' && depth === 0) {
        tagEnd = j;
        if (src[j - 1] === '/') selfClosing = true;
        break;
      }
      j++;
    }
    if (tagEnd === -1) { i += needle.length; continue; }
    const attrs = src.slice(i + needle.length, selfClosing ? tagEnd - 1 : tagEnd);
    results.push({ index: i, attrs, selfClosing, tagEnd });
    i = tagEnd + 1;
  }
  return results;
}

// Presence d'un attribut (booleen ou value). Ex: hasAttr(attrs, 'aria-label').
function hasAttr(attrs, name) {
  const re = new RegExp(`(^|\\s)${name.replace(/[-]/g, '\\-')}(\\s*=|\\s|$|/)`);
  return re.test(attrs);
}

// Valeur STRING LITTERALE d'un attribut, ou null (si dynamique {..} ou absent).
function getAttrValue(attrs, name) {
  const re = new RegExp(`(^|\\s)${name.replace(/[-]/g, '\\-')}\\s*=\\s*["']([^"']*)["']`);
  const m = attrs.match(re);
  return m ? m[2] : null;
}

function lineAt(src, index) {
  let line = 1;
  for (let k = 0; k < index && k < src.length; k++) if (src[k] === '\n') line++;
  return line;
}

function snippet(src, index, len = 90) {
  return src.slice(index, index + len).replace(/\s+/g, ' ').trim();
}

// Regions <label ...>...</label> (pour le labelling implicite : input enfant).
function labelRegions(src) {
  const regions = [];
  const opens = findOpeningTags(src, 'label');
  for (const o of opens) {
    if (o.selfClosing) continue;
    let depth = 1;
    let pos = o.tagEnd + 1;
    let closeEnd = src.length;
    while (pos < src.length && depth > 0) {
      const nextOpen = src.indexOf('<label', pos);
      const nextClose = src.indexOf('</label', pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose && /[\s>/]/.test(src[nextOpen + 6] || '')) {
        depth++; pos = nextOpen + 6;
      } else {
        depth--; pos = nextClose + 7;
        if (depth === 0) closeEnd = nextClose;
      }
    }
    regions.push({ start: o.index, end: closeEnd });
  }
  return regions;
}

// Contenu interne d'un <button> (gere l'imbrication rare de <button>).
function buttonInner(src, tagEnd) {
  let depth = 1;
  let pos = tagEnd + 1;
  while (pos < src.length && depth > 0) {
    const nextOpen = src.indexOf('<button', pos);
    const nextClose = src.indexOf('</button', pos);
    if (nextClose === -1) return { inner: src.slice(tagEnd + 1), closeIndex: src.length };
    if (nextOpen !== -1 && nextOpen < nextClose && /[\s>/]/.test(src[nextOpen + 7] || '')) {
      depth++; pos = nextOpen + 7;
    } else {
      depth--;
      if (depth === 0) return { inner: src.slice(tagEnd + 1, nextClose), closeIndex: nextClose };
      pos = nextClose + 8;
    }
  }
  return { inner: src.slice(tagEnd + 1), closeIndex: src.length };
}

// ─── Regles ──────────────────────────────────────────────────────────────────
function auditInputs(src) {
  const violations = [];
  const forIds = new Set();
  for (const m of src.matchAll(/\b(?:htmlFor|for)\s*=\s*["']([^"']+)["']/g)) forIds.add(m[1]);
  const labels = labelRegions(src);
  const inLabel = (idx) => labels.some((r) => idx >= r.start && idx <= r.end);

  for (const tag of ['input', 'select', 'textarea']) {
    for (const t of findOpeningTags(src, tag)) {
      if (tag === 'input') {
        const type = getAttrValue(t.attrs, 'type');
        if (type && EXCLUDED_INPUT_TYPES.has(type.toLowerCase())) continue;
      }
      const labelled =
        hasAttr(t.attrs, 'aria-label') ||
        hasAttr(t.attrs, 'aria-labelledby') ||
        inLabel(t.index) ||
        (() => { const id = getAttrValue(t.attrs, 'id'); return id != null && forIds.has(id); })();
      if (!labelled) {
        violations.push({
          line: lineAt(src, t.index),
          code: snippet(src, t.index),
          fix: `ajouter aria-label="..." sur ce <${tag}>, OU un id="x" lie a un <label htmlFor="x">, OU l'imbriquer dans <label>`,
        });
      }
    }
  }
  return violations;
}

function auditIconButtons(src) {
  const violations = [];
  for (const t of findOpeningTags(src, 'button')) {
    if (t.selfClosing) continue;
    if (hasAttr(t.attrs, 'aria-label') || hasAttr(t.attrs, 'aria-labelledby') || hasAttr(t.attrs, 'title')) continue;
    const { inner } = buttonInner(src, t.tagEnd);

    const hasIcon =
      /<svg\b/.test(inner) ||
      /<img\b/.test(inner) ||
      /<[A-Z][A-Za-z0-9]*\b[^>]*\/>/.test(inner); // composant icone auto-fermant (lucide)

    // Texte visible : on retire d'abord les balises (et leurs attributs), puis on
    // regarde ce qui reste (noeuds texte + expressions enfants {..}).
    const noComments = inner.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    const noTags = noComments.replace(/<[^>]*>/g, ' ');
    const hasChildExpression = /\{[^}]*[A-Za-z0-9À-ÿ][^}]*\}/.test(noTags);
    let stripped = noTags;
    let prev;
    do { prev = stripped; stripped = stripped.replace(/\{[^{}]*\}/g, ' '); } while (stripped !== prev);
    const hasLiteralText = /[A-Za-z0-9À-ÿ]/.test(stripped);

    if (hasIcon && !hasLiteralText && !hasChildExpression) {
      violations.push({
        line: lineAt(src, t.index),
        code: snippet(src, t.index),
        fix: 'ajouter aria-label="..." descriptif (ex: aria-label="Supprimer") sur ce <button> a icone seule',
      });
    }
  }
  return violations;
}

// ─── Rapport ─────────────────────────────────────────────────────────────────
function auditFile(relPath) {
  const abs = resolve(process.cwd(), relPath);
  if (!existsSync(abs)) {
    console.error(`\n  [ERREUR] Fichier introuvable: ${relPath}`);
    console.error(`  -> Verifier le chemin (relatif a client/, ex: src/pages/Dashboard.tsx).`);
    return { missing: true, inputs: -1, buttons: -1 };
  }
  const src = readFileSync(abs, 'utf8');
  const inputs = auditInputs(src);
  const buttons = auditIconButtons(src);

  console.log('\n' + '='.repeat(64));
  console.log(` Audit a11y statique — ${relPath}`);
  console.log('='.repeat(64));
  console.log(`  inputs-sans-label = ${inputs.length}`);
  for (const v of inputs) console.log(`    L${v.line}  ${v.code}\n           -> ${v.fix}`);
  console.log(`  boutons-icone-sans-aria-label = ${buttons.length}`);
  for (const v of buttons) console.log(`    L${v.line}  ${v.code}\n           -> ${v.fix}`);
  if (inputs.length === 0 && buttons.length === 0) console.log('  [OK] Aucun probleme detecte.');

  return { missing: false, inputs: inputs.length, buttons: buttons.length };
}

// ─── Main ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage : node scripts/a11y-audit.mjs <chemin/Ecran.tsx> [autre.tsx ...]   (depuis client/)');
  console.error('Ex.   : node scripts/a11y-audit.mjs src/pages/Dashboard.tsx');
  process.exit(2);
}

let anyMissing = false;
let anyViolation = false;
for (const arg of args) {
  const r = auditFile(arg);
  if (r.missing) anyMissing = true;
  else if (r.inputs > 0 || r.buttons > 0) anyViolation = true;
}

console.log('');
if (anyMissing) process.exit(2);
process.exit(anyViolation ? 1 : 0);
