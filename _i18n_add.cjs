// Helper to insert new keys into fr.json and en.json with minimal diff.
// Uses textual line-by-line insertion to preserve formatting/order.
// Usage: node _i18n_add.cjs '{"section.key": {"fr": "...", "en": "..."}}'
const fs = require('fs');
const path = require('path');

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node _i18n_add.cjs <JSON_ENTRIES_FLAT>');
  console.error('Example: node _i18n_add.cjs \'{"login.foo": {"fr": "Salut", "en": "Hi"}}\'');
  process.exit(1);
}

const entries = JSON.parse(arg);

const frPath = path.join(__dirname, 'client/src/locales/fr.json');
const enPath = path.join(__dirname, 'client/src/locales/en.json');

function insertIntoSection(content, section, key, value) {
  // Find lines  "section": {  ... } at top level
  const lines = content.split('\n');
  // Find start of section
  const sectionRe = new RegExp('^\\s*"' + section.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '"\\s*:\\s*\\{');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (sectionRe.test(lines[i])) { start = i; break; }
  }
  if (start === -1) {
    // Section doesn't exist as nested object — try flat key (e.g., "section.key": "value" at root)
    return null;
  }
  // Find matching closing brace
  let depth = 0;
  let end = -1;
  for (let i = start; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end !== -1) break;
  }
  if (end === -1) return null;
  // Check if key already exists in section
  const keyRe = new RegExp('^\\s*"' + key.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '"\\s*:');
  for (let i = start; i <= end; i++) {
    if (keyRe.test(lines[i])) return 'exists';
  }
  // Insert before closing brace. Last line before } needs comma added if not present.
  const lastEntryLine = end - 1;
  let lastContent = lines[lastEntryLine];
  if (!lastContent.trim().endsWith(',') && !lastContent.trim().endsWith('{')) {
    lines[lastEntryLine] = lastContent + ',';
  }
  // Detect indent
  const closingLine = lines[end];
  const baseIndent = closingLine.match(/^\s*/)[0];
  const itemIndent = baseIndent + '  ';
  const escVal = JSON.stringify(value);
  lines.splice(end, 0, `${itemIndent}"${key}": ${escVal}`);
  return lines.join('\n');
}

function insertAtRoot(content, fullKey, value) {
  // Insert "fullKey": "value" at root, before the last closing }
  const lines = content.split('\n');
  // Find last } at the start of a line (root close)
  let end = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^\s*\}\s*$/.test(lines[i])) { end = i; break; }
  }
  if (end === -1) return null;
  const lastEntryLine = end - 1;
  if (!lines[lastEntryLine].trim().endsWith(',') && !lines[lastEntryLine].trim().endsWith('{')) {
    lines[lastEntryLine] = lines[lastEntryLine] + ',';
  }
  const baseIndent = lines[end].match(/^\s*/)[0];
  const itemIndent = baseIndent + '  ';
  lines.splice(end, 0, `${itemIndent}${JSON.stringify(fullKey)}: ${JSON.stringify(value)}`);
  return lines.join('\n');
}

function addKey(content, fullKey, value) {
  const parts = fullKey.split('.');
  if (parts.length >= 2) {
    const [section, ...rest] = parts;
    const subKey = rest.join('.');
    const out = insertIntoSection(content, section, subKey, value);
    if (out === 'exists') return { content, status: 'exists' };
    if (out) return { content: out, status: 'added' };
  }
  // Fallback: root key
  const out = insertAtRoot(content, fullKey, value);
  if (out) return { content: out, status: 'added-root' };
  return { content, status: 'failed' };
}

let fr = fs.readFileSync(frPath, 'utf8');
let en = fs.readFileSync(enPath, 'utf8');

// Preserve EOL style of the input file
const frUsesCRLF = fr.includes('\r\n');
const enUsesCRLF = en.includes('\r\n');
// Normalize to LF first for processing (split('\n') works on either, but joining back uses \n)
fr = fr.replace(/\r\n/g, '\n');
en = en.replace(/\r\n/g, '\n');

let added = 0, skipped = 0, failed = 0;
for (const [key, val] of Object.entries(entries)) {
  if (!val || typeof val.fr !== 'string' || typeof val.en !== 'string') {
    console.log('BAD entry, skip:', key);
    continue;
  }
  const r1 = addKey(fr, key, val.fr);
  const r2 = addKey(en, key, val.en);
  fr = r1.content; en = r2.content;
  if (r1.status === 'exists' || r2.status === 'exists') {
    console.log('SKIP exists:', key);
    skipped++;
  } else if (r1.status === 'failed' || r2.status === 'failed') {
    console.log('FAIL:', key);
    failed++;
  } else {
    console.log('ADD :', key, '=>', val.fr.substring(0, 60), '|', val.en.substring(0, 60));
    added++;
  }
}

// Restore CRLF if input had it
if (frUsesCRLF) fr = fr.replace(/\n/g, '\r\n');
if (enUsesCRLF) en = en.replace(/\n/g, '\r\n');

fs.writeFileSync(frPath, fr, 'utf8');
fs.writeFileSync(enPath, en, 'utf8');
console.log('---');
console.log('Added:', added, '| Skipped:', skipped, '| Failed:', failed);

// Final sanity: ensure both still parse
try { JSON.parse(fr); JSON.parse(en); console.log('JSON parse OK'); }
catch (e) { console.error('!! JSON PARSE FAILED:', e.message); process.exit(1); }
