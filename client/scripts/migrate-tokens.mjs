/**
 * migrate-tokens.mjs
 * Remplace les hex hardcodés (classes Tailwind arbitraires) par des tokens mono.
 * Usage : node scripts/migrate-tokens.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, resolve } from 'path';

// Fichiers à exclure (GL shaders + JS color constants)
const EXCLUDED = new Set([
  'ShaderBackground.tsx',
  'MintMistBackground.tsx',
  'PaperFoldBackground.tsx',
  'colors.ts',
]);

// Mapping : hex (uppercase) → token mono
// Ordre important : du plus long au plus court pour éviter les chevauchements
const REPLACEMENTS = [
  // Dark (light scale — high mono number = light color)
  ['#E5E7EB', 'mono-900'],
  ['#F3F4F6', 'mono-950'],
  ['#F5F5F5', 'mono-975'],
  ['#FAFAFA', 'mono-1000'],
  ['#D4D4D4', 'mono-800'],
  ['#A3A3A3', 'mono-700'],
  ['#737373', 'mono-500'],
  ['#525252', 'mono-400'],
  ['#404040', 'mono-350'],
  ['#262626', 'mono-300'],
  ['#1A1A1A', 'mono-200'],
  ['#111111', 'mono-100'],
  ['#0A0A0A', 'mono-50'],
];

// Préfixes Tailwind valides pour les remplacements
// Pattern : `prefix-[#XXXXXX]` → `prefix-mono-NNN`
// On remplace aussi les variantes `dark:prefix-[#XXXXXX]`, `sm:prefix-[#XXXXXX]`, etc.
function buildRegex(hex) {
  // Escape le # pour regex
  const escapedHex = hex.replace('#', '\\#');
  // Match le pattern -[#XXXXXX] (6 chiffres hex, case-insensitive)
  // On veut remplacer SEULEMENT les occurrences dans des classes Tailwind
  // Pattern : word boundary avant, `[#HEX]` (le hex exact)
  return new RegExp(`\\[${escapedHex}\\]`, 'gi');
}

function processFile(filePath) {
  const original = readFileSync(filePath, 'utf8');
  let content = original;

  for (const [hex, token] of REPLACEMENTS) {
    const regex = buildRegex(hex);
    content = content.replace(regex, token);
  }

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const results = [];
  const items = readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules') continue;
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath, extensions));
    } else if (extensions.includes(extname(item))) {
      if (!EXCLUDED.has(item)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// Main
const srcDir = resolve('./src');
const files = walkDir(srcDir);

let modifiedCount = 0;
let totalFiles = files.length;

console.log(`Scanning ${totalFiles} files...`);

for (const file of files) {
  const modified = processFile(file);
  if (modified) {
    modifiedCount++;
    console.log(`  UPDATED: ${file.replace(srcDir, 'src')}`);
  }
}

console.log(`\nDone. ${modifiedCount}/${totalFiles} files modified.`);
