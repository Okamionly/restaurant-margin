#!/usr/bin/env node
/**
 * parse-supplier-pdf.ts
 *
 * Parseur de PDFs fournisseurs (Transgourmet, Beauvallet, Hapi Trading, Seafood, etc.)
 * Extrait les articles avec code, désignation, prix HT, unité, conditionnement.
 *
 * Usage:
 *   npx ts-node scripts/parse-supplier-pdf.ts <fichier.pdf> [--upload <publicationId>] [--output <fichier.json>]
 *   npx ts-node scripts/parse-supplier-pdf.ts --dir "C:\Users\mrgue\Desktop\PDF TRANSGOURMET" [--output all.json]
 *
 * Options:
 *   --upload <id>   Envoie les prix vers l'API /api/mercuriale/publications/<id>/prices
 *   --output <file> Sauvegarde le JSON dans un fichier
 *   --dir <path>    Parse tous les PDFs d'un dossier
 *   --api-url <url> URL de base de l'API (défaut: http://localhost:3001)
 *   --token <jwt>   Token d'authentification pour l'upload
 */

const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedArticle {
  code: string;
  name: string;
  weight: string;
  price: number;
  unit: string;
  packaging: string;
  supplier: string;
  category: string;
  origin: string;
}

interface ParseOptions {
  filePath: string;
  supplier?: string;
}

// ─── Catégories auto-détectées ───────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Volailles': ['poulet', 'pintade', 'canard', 'canette', 'caille', 'dinde', 'chapon', 'pigeon', 'volaille', 'poule'],
  'Boeuf': ['boeuf', 'bœuf', 'rumsteak', 'entrecote', 'entrecôte', 'faux filet', 'filet boeuf', 'filet bœuf', 'bavette', 'paleron', 'macreuse', 'jarret', 'onglet', 'hampe', 'côte de boeuf', 'cote boeuf', 'bourguignon', 'tende tranche'],
  'Veau': ['veau'],
  'Agneau': ['agneau', 'souris d\'agneau'],
  'Porc': ['porc', 'longe', 'filet mignon porc', 'araignée de porc'],
  'Poissons': ['saumon', 'truite', 'cabillaud', 'merlan', 'bar ', 'bars ', 'dorade', 'sole', 'lieu', 'raie', 'thon', 'lotte', 'turbot', 'maquereau', 'sardine', 'hareng', 'haddock', 'colin', 'merlu', 'julienne', 'limande', 'plie', 'rouget', 'espadon', 'flétan', 'perche'],
  'Fruits de mer': ['huître', 'huitre', 'crevette', 'moule', 'langoustine', 'homard', 'crabe', 'gambas', 'coquille', 'noix de st jacques', 'st-jacques', 'saint-jacques', 'bulot', 'palourde', 'poulpe', 'calamars', 'encornet', 'seafood'],
  'Fruits': ['pomme ', 'poire', 'orange', 'citron', 'mandarine', 'ananas', 'raisin', 'banane', 'fraise', 'framboise', 'myrtille', 'melon', 'pastèque', 'mangue', 'kiwi', 'bergamote'],
  'Légumes': ['carotte', 'poireau', 'oignon', 'ail ', 'tomate', 'courgette', 'aubergine', 'poivron', 'salade', 'laitue', 'romaine', 'épinard', 'chou', 'brocoli', 'navet', 'radis', 'betterave', 'pomme de terre', 'grenaille', 'patate', 'artichaut', 'asperge', 'fenouil', 'concombre', 'haricot', 'petit pois', 'champignon', 'endive', 'céleri'],
  'Charcuterie': ['saucisse', 'jambon', 'lardon', 'bacon', 'chorizo', 'rosette', 'coppa', 'bresaola', 'rillette', 'terrine', 'pâté', 'boudin', 'andouille', 'andouillette'],
  'Produits élaborés': ['haché', 'hache', 'tartare', 'brochette', 'émincé', 'emincé', 'carpaccio', 'mariné', 'marine', 'saumuré', 'saumure', 'pané', 'pane', 'rôti de', 'roti de', 'pavé de boeuf marinade'],
};

function detectCategory(name: string): string {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  return 'Divers';
}

// ─── Détection du type de fournisseur / format ──────────────────────────────

type SupplierFormat = 'seafood' | 'ldc-volaille' | 'beauvallet-tarif' | 'beauvallet-negoce' | 'hapi-trading' | 'essentiels' | 'cours-frais' | 'generic';

function detectFormat(text: string, filename: string): SupplierFormat {
  const fn = filename.toLowerCase();
  const t = text.substring(0, 2000).toLowerCase();

  if (fn.includes('seafood')) return 'seafood';
  if (fn.includes('ldc') || (t.includes('poulet ferm') && t.includes('tgt origine'))) return 'ldc-volaille';
  if (fn.includes('negoce') || (t.includes('code beauvallet') && t.includes('code \ntransgourmet'))) return 'beauvallet-negoce';
  if (fn.includes('beauvallet') && (fn.includes('tarif') || t.includes('restauration gourmande'))) return 'beauvallet-tarif';
  if (fn.includes('hapi') || t.includes('hapi trading')) return 'hapi-trading';
  if (fn.includes('essentiels') || t.includes('essentiels')) return 'essentiels';
  if (fn.includes('cours du frais') || fn.includes('rc - cours') || t.includes('cours du frais')) return 'cours-frais';
  return 'generic';
}

function detectSupplier(format: SupplierFormat, filename: string): string {
  switch (format) {
    case 'seafood': return 'Transgourmet Seafood';
    case 'ldc-volaille': return 'Transgourmet / LDC';
    case 'beauvallet-tarif':
    case 'beauvallet-negoce': return 'Beauvallet';
    case 'hapi-trading': return 'Hapi Trading';
    case 'essentiels': return 'Transgourmet';
    case 'cours-frais': return 'Transgourmet';
    default: return 'Transgourmet';
  }
}

// ─── Helpers prix ────────────────────────────────────────────────────────────

/** Extrait un prix en float depuis une chaîne comme "24,30 €", "24.30", "24,30" */
function parsePrice(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\s/g, '').replace('€', '').replace(',', '.').trim();
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

/** Nettoie les espaces multiples et trim */
function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

// ─── Parseurs par format ─────────────────────────────────────────────────────

function parseSeafood(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentSection = '';
  let currentName = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section headers like "LE SAUMON D'ISLANDE ASC", "LA TRUITE DES HAUTS DE France"
    if (/^(LE[S]?\s|LA\s|LES\s)/i.test(line) && !line.match(/^\d{5,}/)) {
      currentSection = clean(line);
      currentName = '';
      continue;
    }

    // Line with code (5-6 digits)
    const codeMatch = line.match(/^(\d{5,6})$/);
    if (codeMatch) {
      const code = codeMatch[1];
      // Look ahead for name/weight/price
      let name = '';
      let weight = '';
      let packaging = '';
      let price: number | null = null;
      let origin = '';

      // Check the next few lines for details
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        const next = lines[j];

        // If we hit another code, stop
        if (/^\d{5,6}$/.test(next)) break;

        // Price line
        const priceMatch = next.match(/([\d]+[,.][\d]{2})\s*€/);
        if (priceMatch && !price) {
          price = parsePrice(priceMatch[1]);
          continue;
        }

        // Weight/grammage pattern
        const weightMatch = next.match(/^(\d+[\s\/]*\d*\s*[gk][\w]*)/i);
        if (weightMatch && !weight) {
          weight = clean(next.split(/(?:Bq|Barquette|Caisse|Sachet|A la)/i)[0]);
          // Check for packaging info after weight
          const packMatch = next.match(/(Bq|Barquette|Caisse|Sachet|A la caisse|Bourriche)[^€]*/i);
          if (packMatch) packaging = clean(packMatch[0]);
          // Check for origin
          if (/france|islande|norvège|norvege|écosse|ecosse/i.test(next)) {
            const origMatch = next.match(/(France|Islande|Norvège|Écosse|Atlantique[^€]*)/i);
            if (origMatch) origin = clean(origMatch[1]);
          }
          continue;
        }

        // Name line (contains letters, no price pattern)
        if (/[a-zA-ZÀ-ÿ]{3,}/.test(next) && !next.match(/^\d+[,.]?\d*\s*€/) && !name) {
          // This could be a product name
          const namePart = next.split(/\d+[\/\s]*\d*\s*[gk]/i)[0];
          if (namePart && namePart.length > 3) {
            name = clean(namePart);
          }
          // Weight might be embedded
          const embWeight = next.match(/(\d+[\/]\d+\s*[gk][\w]*|\d+\s*[gk][\w]*)/i);
          if (embWeight && !weight) weight = clean(embWeight[1]);
          // Packaging might follow
          const embPack = next.match(/(Bq|Barquette|Caisse|Sachet|A la caisse|Bourriche)[^€]*/i);
          if (embPack && !packaging) packaging = clean(embPack[0]);
          // Origin
          if (/france|islande|norvège|écosse/i.test(next)) {
            const origM = next.match(/(France|Islande|Norvège|Écosse|Atlantique[^,€]*)/i);
            if (origM) origin = clean(origM[1]);
          }
          continue;
        }
      }

      // Use section name as fallback for product name
      if (!name && currentSection) {
        name = currentSection;
      }

      if (price !== null) {
        articles.push({
          code,
          name: name || currentSection || 'Article ' + code,
          weight: weight || '',
          price,
          unit: 'kg',
          packaging,
          supplier: 'Transgourmet Seafood',
          category: detectCategory(name || currentSection),
          origin,
        });
      }
      continue;
    }

    // Combined line: code + name + weight + price (some PDFs concatenate them)
    const combinedMatch = line.match(/^(\d{5,6})\s*(.+?)\s+([\d]+[,.][\d]{2})\s*€/);
    if (combinedMatch) {
      const name2 = clean(combinedMatch[2]);
      const price2 = parsePrice(combinedMatch[3]);
      if (price2 !== null) {
        const wm = name2.match(/(\d+[\/]\d+\s*[gk][\w]*|\d+\s*[gk][\w]*)/i);
        articles.push({
          code: combinedMatch[1],
          name: name2.replace(/\d+[\/]\d+\s*[gk][\w]*/i, '').trim() || name2,
          weight: wm ? clean(wm[1]) : '',
          price: price2,
          unit: 'kg',
          packaging: '',
          supplier: 'Transgourmet Seafood',
          category: detectCategory(name2),
          origin: '',
        });
      }
    }
  }

  return articles;
}

function parseLDCVolaille(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Format: CODE\nDESIGNATION MARQUE\nPCB\nPRIX\nUFV
  // Lines pattern: code (6 digits), then name, then PCB number, then price or "TAC X", then unit
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const codeMatch = line.match(/^(\d{6})$/);
    if (!codeMatch) continue;

    const code = codeMatch[1];
    let name = '';
    let price: number | null = null;
    let unit = 'kg';

    // Next line should be the designation
    if (i + 1 < lines.length) {
      const nameLine = lines[i + 1];
      if (/[A-Z]/.test(nameLine) && !/^\d+$/.test(nameLine)) {
        name = clean(nameLine.replace(/TGT ORIGINE\s*/i, '').replace(/\s+/g, ' '));
      }
    }

    // Look for price in next lines
    for (let j = i + 2; j < Math.min(i + 6, lines.length); j++) {
      const priceLine = lines[j];
      const pm = priceLine.match(/([\d]+[,.][\d]{2})\s*€/);
      if (pm) {
        price = parsePrice(pm[1]);
        break;
      }
      // "TAC X" = Tarif A Consulter - skip these
      if (/^TAC\s/i.test(priceLine)) break;
    }

    // Look for unit
    for (let j = i + 2; j < Math.min(i + 7, lines.length); j++) {
      if (/kilo/i.test(lines[j])) { unit = 'kg'; break; }
      if (/pièce|piece/i.test(lines[j])) { unit = 'pièce'; break; }
    }

    if (name && price !== null) {
      articles.push({
        code,
        name,
        weight: '',
        price,
        unit,
        packaging: '',
        supplier: 'Transgourmet / LDC',
        category: detectCategory(name),
        origin: 'France',
      });
    }
  }

  return articles;
}

function parseBeauvallet(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Beauvallet main tarif: lines with product descriptions followed by prices
  // Format varies: some have code columns, some just product + price
  // Regex for a line containing a product code (5-8 digits) and price
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Pattern: CODE DESIGNATION WEIGHT PRICE (in various layouts)
    // Try combined: code + name + price on one line
    let m = line.match(/^(\d{5,8})\s+(.+?)\s+([\d]+[,.][\d]{2})\s*€?\s*$/);
    if (m) {
      const name3 = clean(m[2]);
      const price3 = parsePrice(m[3]);
      if (price3 !== null && price3 > 0) {
        const wm = name3.match(/(\d+[,./]\d+\s*[Kk][Gg]|\d+\s*[Kk][Gg]|\d+\s*[Gg]\b)/);
        articles.push({
          code: m[1],
          name: name3,
          weight: wm ? clean(wm[1]) : '',
          price: price3,
          unit: 'kg',
          packaging: '',
          supplier: 'Beauvallet',
          category: detectCategory(name3),
          origin: '',
        });
        continue;
      }
    }

    // Beauvallet tarif page format with tabular layout
    // code on one line, product next, price nearby
    if (/^\d{5,8}$/.test(line)) {
      const code = line;
      let name = '';
      let price: number | null = null;
      let weight = '';

      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const next = lines[j];
        if (/^\d{5,8}$/.test(next)) break;
        const pm = next.match(/([\d]+[,.][\d]{2})\s*€?/);
        if (pm && price === null) {
          price = parsePrice(pm[1]);
          continue;
        }
        if (/[a-zA-ZÀ-ÿ]{2,}/.test(next) && !name) {
          name = clean(next);
          const wm2 = name.match(/(\d+[,./]\d+\s*[Kk][Gg]|\d+\s*[Kk][Gg]|\d+\s*[Gg]\b)/);
          if (wm2) weight = clean(wm2[1]);
        }
      }

      if (name && price !== null && price > 0) {
        articles.push({
          code,
          name,
          weight,
          price,
          unit: 'kg',
          packaging: '',
          supplier: 'Beauvallet',
          category: detectCategory(name),
          origin: '',
        });
      }
    }
  }

  return articles;
}

function parseBeauvalletNegoce(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Format: lines cycle through:
  //   1. Combined code line: 8-digit Beauvallet code + 6-digit Transgourmet code (14 digits total)
  //   2. Product name (uppercase)
  //   3. Weight ("2,8 Kg +", "2/2,4 Kg", etc.)
  //   4. Optional: piece count
  //   5. Price (plain number like "27,09" or combined like "2/316,93")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match 14-digit combined code (8 Beauvallet + 6 Transgourmet) or just long digit string
    const combinedCodeMatch = line.match(/^(\d{8})(\d{6})$/);
    if (combinedCodeMatch) {
      const tgCode = combinedCodeMatch[2];
      let name = '';
      let weight = '';
      let price: number | null = null;

      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const next = lines[j];
        // Stop at next combined code
        if (/^\d{14}$/.test(next)) break;
        // Stop at section headers
        if (/^Code\s/i.test(next)) break;

        // Product name (contains letters, not just digits)
        if (/[A-ZÀ-Ÿ]{2,}/.test(next) && !name && !/^\d+[,./\d]*$/.test(next)) {
          name = clean(next);
          continue;
        }

        // Weight line
        if (/\d+[,./]\d*\s*[Kk][Gg]/i.test(next) && !weight) {
          const wm = next.match(/([\d]+[,./]?\d*\s*[Kk][Gg]\s*[\+env]*)/i);
          if (wm) weight = clean(wm[1]);
          continue;
        }

        // Price: plain number or number with prefix (e.g., "2/316,93" = pieces/price)
        if (price === null) {
          // Try: "env 321,83" or "2/316,93" (pieces prefix before price)
          const priceWithPrefix = next.match(/(?:env\s+\d+|[\d/]+)([\d]+[,][\d]{2})$/);
          if (priceWithPrefix) {
            price = parsePrice(priceWithPrefix[1]);
            continue;
          }
          // Standard price
          const pm = next.match(/^1?([\d]+[,.][\d]{2})$/);
          if (pm) {
            price = parsePrice(pm[1]);
            continue;
          }
        }
      }

      if (name && price !== null && price > 0) {
        articles.push({
          code: tgCode,
          name,
          weight,
          price,
          unit: 'kg',
          packaging: '',
          supplier: 'Beauvallet',
          category: detectCategory(name),
          origin: '',
        });
      }
      continue;
    }

    // Also handle standalone 6-digit Transgourmet codes (some sections)
    const tgOnly = line.match(/^(\d{6})$/);
    if (tgOnly) {
      let name2 = '';
      let price2: number | null = null;
      let weight2 = '';

      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const next = lines[j];
        if (/^\d{6,14}$/.test(next)) break;
        if (/^Code\s/i.test(next)) break;

        if (/[A-ZÀ-Ÿ]{2,}/.test(next) && !name2 && !/^\d+[,./\d]*$/.test(next)) {
          name2 = clean(next);
          const wm = name2.match(/([\d]+[,./]?\d*\s*[Kk][Gg]\s*[\+env]*)/i);
          if (wm) weight2 = clean(wm[1]);
          continue;
        }
        if (/\d+[,./]\d*\s*[Kk][Gg]/i.test(next) && !weight2) {
          const wm2 = next.match(/([\d]+[,./]?\d*\s*[Kk][Gg]\s*[\+env]*)/i);
          if (wm2) weight2 = clean(wm2[1]);
          continue;
        }
        if (price2 === null) {
          const pm = next.match(/^1?([\d]+[,.][\d]{2})$/);
          if (pm) { price2 = parsePrice(pm[1]); continue; }
        }
      }

      if (name2 && price2 !== null && price2 > 0) {
        articles.push({
          code: tgOnly[1],
          name: name2,
          weight: weight2,
          price: price2,
          unit: 'kg',
          packaging: '',
          supplier: 'Beauvallet',
          category: detectCategory(name2),
          origin: '',
        });
      }
    }
  }

  // Deduplicate by code (keep first)
  const seen = new Set<string>();
  return articles.filter(a => {
    if (seen.has(a.code)) return false;
    seen.add(a.code);
    return true;
  });
}

function parseHapiTrading(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Format: Code Transgourmet | PRODUIT | PRIX DE VENTE €
  // Simple tabular: 6-digit code, then product, then price
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Try: code on its own line
    const codeMatch = line.match(/^(\d{6})$/);
    if (codeMatch) {
      const code = codeMatch[1];
      let name = '';
      let price: number | null = null;

      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const next = lines[j];
        if (/^\d{6}$/.test(next)) break;

        const pm = next.match(/^([\d]+[,.][\d]{2})$/);
        if (pm && price === null) { price = parsePrice(pm[1]); continue; }

        if (/[A-Z]{2,}/.test(next) && !name && !/^[\d,.]+$/.test(next)) {
          name = clean(next.replace(/\s*\*\s*$/, ''));
        }
      }

      if (name && price !== null && price > 0) {
        articles.push({
          code,
          name,
          weight: '',
          price,
          unit: 'kg',
          packaging: '',
          supplier: 'Hapi Trading',
          category: detectCategory(name),
          origin: '',
        });
      }
      continue;
    }

    // Combined line: code + product + price
    const cm = line.match(/^(\d{6})\s+(.+?)\s+([\d]+[,.][\d]{2})\s*$/);
    if (cm) {
      const p = parsePrice(cm[3]);
      if (p !== null && p > 0) {
        articles.push({
          code: cm[1],
          name: clean(cm[2].replace(/\s*\*\s*$/, '')),
          weight: '',
          price: p,
          unit: 'kg',
          packaging: '',
          supplier: 'Hapi Trading',
          category: detectCategory(cm[2]),
          origin: '',
        });
      }
    }
  }

  return articles;
}

function parseEssentiels(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Format: CODE ARTICLE | NOM COMPLET | RCBP | SOCIAL | UV | PV CLIENT
  // Often: code (3-6 digits), then long name, then XXX or similar, then KG/PIECE, then price
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code line (3-6 digits standalone)
    const codeMatch = line.match(/^(\d{3,6})$/);
    if (codeMatch) {
      const code = codeMatch[1];
      let name = '';
      let unit = 'kg';
      let price: number | null = null;

      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const next = lines[j];
        if (/^\d{3,6}$/.test(next)) break;

        // Product name line (long string with letters)
        if (/[A-ZÀ-Ÿ]{3,}/.test(next) && !name && !next.match(/^(XXX|xxx|KG|PIECE)/)) {
          name = clean(next.replace(/\s*"[^"]*"\s*/g, ' ').replace(/\s+/g, ' '));
        }

        // Unit line
        if (/^(XXX|xxx)?(KG|PIECE|Kilo|kg)\s*/i.test(next.replace(/^XXX/i, ''))) {
          unit = /piece/i.test(next) ? 'pièce' : 'kg';
        }

        // Price line
        const pm = next.match(/([\d]+[,.][\d]{2})\s*€/);
        if (pm && price === null) {
          price = parsePrice(pm[1]);
        }
      }

      if (name && price !== null && price > 0) {
        articles.push({
          code,
          name,
          weight: '',
          price,
          unit,
          packaging: '',
          supplier: 'Transgourmet',
          category: detectCategory(name),
          origin: '',
        });
      }
      continue;
    }

    // Combined line: code + name (sometimes on same line)
    const combined = line.match(/^(\d{3,6})\s+(.{10,})/);
    if (combined) {
      const code = combined[1];
      let rest = combined[2];
      let name = '';
      let unit = 'kg';
      let price: number | null = null;

      // Price in the rest
      const pm2 = rest.match(/([\d]+[,.][\d]{2})\s*€/);
      if (pm2) {
        price = parsePrice(pm2[1]);
        rest = rest.replace(pm2[0], '');
      }

      // Unit
      if (/PIECE/i.test(rest)) unit = 'pièce';

      // Name: strip XXX, KG, unit markers
      name = clean(rest.replace(/XXX|xxx/g, '').replace(/\b(KG|PIECE)\b/gi, '').replace(/\s*"[^"]*"\s*/g, ' '));

      // If no price yet, look at next lines
      if (price === null) {
        for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
          const pm3 = lines[j].match(/([\d]+[,.][\d]{2})\s*€/);
          if (pm3) { price = parsePrice(pm3[1]); break; }
        }
      }

      if (name && name.length > 3 && price !== null && price > 0) {
        articles.push({
          code,
          name,
          weight: '',
          price,
          unit,
          packaging: '',
          supplier: 'Transgourmet',
          category: detectCategory(name),
          origin: '',
        });
      }
    }
  }

  return articles;
}

function parseCoursDuFrais(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Step 1: Find all code positions and gather product info from lines above
  interface Block { code: string; name: string; weight: string; origin: string; packaging: string; idx: number; }
  const blocks: Block[] = [];

  for (let i = 0; i < lines.length; i++) {
    const codeMatch = lines[i].match(/Code\s*:\s*(\d{5,6})/i);
    if (!codeMatch) continue;

    const code = codeMatch[1];
    const nameLines: string[] = [];
    let weight = '', origin = '', packaging = '';

    for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
      const prev = lines[j];
      if (/Code\s*:\s*\d/i.test(prev)) break;
      if (/^(FRUITS|MAR|PRODUITS|SEMAINE|DU \d|www\.|TRANSGOURMET)/i.test(prev)) break;

      if (/Origine\s*:/i.test(prev) && !origin) {
        const om = prev.match(/Origine\s*:\s*(.+)/i);
        if (om) origin = clean(om[1]);
        continue;
      }
      if (/lev.e?\s+en\s+/i.test(prev) && !origin) {
        const em = prev.match(/lev.e?\s+en\s+(\S+)/i);
        if (em) origin = clean(em[1]);
        continue;
      }
      if (/[Pp].ch.e?\s+en\s+/i.test(prev) && !origin) {
        const pm = prev.match(/[Pp].ch.e?\s+en\s+(.+)/i);
        if (pm) origin = clean(pm[1]);
        continue;
      }
      if (/Colis|Barquette|Poche|Sachet|Bourriche/i.test(prev) && !packaging) {
        packaging = clean(prev);
        continue;
      }
      if (/Pi.ce.*de\s+/i.test(prev) && !weight) {
        const wm = prev.match(/(\d[\d\s,.\/]+[gk][\w.]*)/i);
        if (wm) weight = clean(wm[1]);
        continue;
      }
      if (/^[A-Z][a-z]+\s*[a-z]+$/.test(prev) && prev.length < 30) continue;
      if (/^(Calibre|Cat)/i.test(prev)) continue;
      if (/[A-Z]{2,}/.test(prev) && prev.length >= 3 && !/^\d+[,.]?\d*$/.test(prev)) {
        nameLines.unshift(prev);
      }
    }

    blocks.push({ code, name: nameLines.join(' ').replace(/\s+/g, ' ').trim(), weight, origin, packaging, idx: i });
  }

  // Step 2: Collect all per-kg prices that appear after codes
  const kgPrices: { price: number; unit: string; idx: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m1 = lines[i].match(/^([\d]+[,.][\d]{2})\s*€\s*\/?\s*(kg|kilo)/i);
    if (m1) {
      const p = parsePrice(m1[1]);
      if (p !== null && p > 0) kgPrices.push({ price: p, unit: 'kg', idx: i });
      continue;
    }
    if (/^[\d]+[,.][\d]{2}$/.test(lines[i])) {
      const n1 = i + 1 < lines.length ? lines[i + 1] : '';
      const n2 = i + 2 < lines.length ? lines[i + 2] : '';
      if (n1 === '€' || n1.startsWith('€')) {
        const p = parsePrice(lines[i]);
        if (p !== null && p > 0) {
          const u = /kilo|kg/i.test(n2) ? 'kg' : 'kg';
          kgPrices.push({ price: p, unit: u, idx: i });
        }
      }
    }
  }

  // Step 3: Match blocks to prices sequentially
  let pi = 0;
  for (const block of blocks) {
    while (pi < kgPrices.length && kgPrices[pi].idx < block.idx) pi++;
    if (pi < kgPrices.length) {
      articles.push({
        code: block.code,
        name: block.name || 'Article ' + block.code,
        weight: block.weight,
        price: kgPrices[pi].price,
        unit: kgPrices[pi].unit,
        packaging: block.packaging,
        supplier: 'Transgourmet',
        category: detectCategory(block.name),
        origin: block.origin,
      });
      pi++;
    }
  }

  return articles;
}


function parseGeneric(text: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Generic: try code (5-8 digits) + stuff + price
    const m = line.match(/(\d{5,8})\s+(.+?)\s+([\d]+[,.][\d]{2})\s*€?\s*$/);
    if (m) {
      const p = parsePrice(m[3]);
      if (p !== null && p > 0 && p < 500) {
        articles.push({
          code: m[1],
          name: clean(m[2]),
          weight: '',
          price: p,
          unit: 'kg',
          packaging: '',
          supplier: 'Transgourmet',
          category: detectCategory(m[2]),
          origin: '',
        });
      }
    }
  }

  return articles;
}

// ─── Main parse function ─────────────────────────────────────────────────────

async function parsePDF(filePath: string): Promise<ParsedArticle[]> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const text = data.text;
  const filename = path.basename(filePath);

  const format = detectFormat(text, filename);
  const supplier = detectSupplier(format, filename);

  console.error(`[INFO] Fichier: ${filename}`);
  console.error(`[INFO] Format détecté: ${format}`);
  console.error(`[INFO] Fournisseur: ${supplier}`);
  console.error(`[INFO] Pages: ${data.numpages}`);

  let articles: ParsedArticle[];

  switch (format) {
    case 'seafood':
      articles = parseSeafood(text);
      break;
    case 'ldc-volaille':
      articles = parseLDCVolaille(text);
      break;
    case 'beauvallet-tarif':
      articles = parseBeauvallet(text);
      break;
    case 'beauvallet-negoce':
      articles = parseBeauvalletNegoce(text);
      break;
    case 'hapi-trading':
      articles = parseHapiTrading(text);
      break;
    case 'essentiels':
      articles = parseEssentiels(text);
      break;
    case 'cours-frais':
      articles = parseCoursDuFrais(text);
      break;
    default:
      articles = parseGeneric(text);
  }

  // Override supplier if detected differently
  articles.forEach(a => {
    if (!a.supplier) a.supplier = supplier;
  });

  console.error(`[INFO] Articles extraits: ${articles.length}`);
  return articles;
}

// ─── Upload vers l'API ───────────────────────────────────────────────────────

async function uploadPrices(
  articles: ParsedArticle[],
  publicationId: string,
  apiUrl: string,
  token: string
): Promise<void> {
  const url = `${apiUrl}/api/mercuriale/publications/${publicationId}/prices`;
  console.error(`[UPLOAD] Envoi de ${articles.length} articles vers ${url}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prices: articles }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload échoué (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.error(`[UPLOAD] Succès:`, result);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  npx ts-node scripts/parse-supplier-pdf.ts <fichier.pdf> [options]
  npx ts-node scripts/parse-supplier-pdf.ts --dir <dossier> [options]

Options:
  --upload <id>     Upload vers /api/mercuriale/publications/<id>/prices
  --output <file>   Sauvegarder le JSON dans un fichier
  --dir <path>      Parser tous les PDFs d'un dossier
  --api-url <url>   URL de base (défaut: http://localhost:3001)
  --token <jwt>     Token JWT pour l'upload
  --summary         Afficher un résumé au lieu du JSON complet
  -h, --help        Afficher cette aide
`);
    process.exit(0);
  }

  let files: string[] = [];
  let uploadId = '';
  let outputFile = '';
  let apiUrl = 'http://localhost:3001';
  let token = '';
  let showSummary = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--upload':
        uploadId = args[++i];
        break;
      case '--output':
        outputFile = args[++i];
        break;
      case '--dir':
        const dir = args[++i];
        if (!fs.existsSync(dir)) {
          console.error(`[ERREUR] Dossier introuvable: ${dir}`);
          process.exit(1);
        }
        files = fs.readdirSync(dir)
          .filter((f: string) => f.toLowerCase().endsWith('.pdf'))
          .map((f: string) => path.join(dir, f));
        break;
      case '--api-url':
        apiUrl = args[++i];
        break;
      case '--token':
        token = args[++i];
        break;
      case '--summary':
        showSummary = true;
        break;
      default:
        if (!args[i].startsWith('--') && args[i].toLowerCase().endsWith('.pdf')) {
          const fp = path.resolve(args[i]);
          if (!fs.existsSync(fp)) {
            console.error(`[ERREUR] Fichier introuvable: ${fp}`);
            process.exit(1);
          }
          files.push(fp);
        }
    }
  }

  if (files.length === 0) {
    console.error('[ERREUR] Aucun fichier PDF spécifié. Utilisez --dir ou passez un fichier en argument.');
    process.exit(1);
  }

  console.error(`\n${'='.repeat(60)}`);
  console.error(`  Parseur PDF Fournisseur - RestauMargin`);
  console.error(`  ${files.length} fichier(s) à traiter`);
  console.error(`${'='.repeat(60)}\n`);

  let allArticles: ParsedArticle[] = [];

  for (const file of files) {
    console.error(`\n--- Traitement: ${path.basename(file)} ---`);
    try {
      const articles = await parsePDF(file);
      allArticles = allArticles.concat(articles);
    } catch (err: any) {
      console.error(`[ERREUR] ${path.basename(file)}: ${err.message}`);
    }
  }

  console.error(`\n${'='.repeat(60)}`);
  console.error(`  TOTAL: ${allArticles.length} articles extraits`);

  // Résumé par catégorie
  const byCat: Record<string, number> = {};
  const bySupplier: Record<string, number> = {};
  for (const a of allArticles) {
    byCat[a.category] = (byCat[a.category] || 0) + 1;
    bySupplier[a.supplier] = (bySupplier[a.supplier] || 0) + 1;
  }

  console.error('\n  Par catégorie:');
  for (const [cat, count] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
    console.error(`    ${cat}: ${count}`);
  }

  console.error('\n  Par fournisseur:');
  for (const [sup, count] of Object.entries(bySupplier).sort((a, b) => b[1] - a[1])) {
    console.error(`    ${sup}: ${count}`);
  }
  console.error(`${'='.repeat(60)}\n`);

  // Output
  if (showSummary) {
    // Summary table
    console.log('Code\tPrix\tUnité\tFournisseur\tCatégorie\tNom');
    for (const a of allArticles) {
      console.log(`${a.code}\t${a.price.toFixed(2)}\t${a.unit}\t${a.supplier}\t${a.category}\t${a.name}`);
    }
  } else {
    const json = JSON.stringify(allArticles, null, 2);

    if (outputFile) {
      fs.writeFileSync(outputFile, json, 'utf-8');
      console.error(`[OUTPUT] JSON sauvegardé dans: ${outputFile}`);
    } else {
      console.log(json);
    }
  }

  // Upload si demandé
  if (uploadId) {
    if (!token) {
      console.error('[ERREUR] --token requis pour --upload');
      process.exit(1);
    }
    try {
      await uploadPrices(allArticles, uploadId, apiUrl, token);
    } catch (err: any) {
      console.error(`[ERREUR UPLOAD] ${err.message}`);
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
