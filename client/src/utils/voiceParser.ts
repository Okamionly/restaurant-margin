/**
 * Voice Command Parser for RestauMargin
 * Parses French natural-language voice commands into structured actions.
 */

export type VoiceActionType =
  | 'stock_add'
  | 'stock_query'
  | 'recipe_cost'
  | 'recipe_create'
  | 'order_create'
  | 'dashboard_stats'
  | 'recipe_print'
  | 'navigate'
  | 'unknown';

export interface VoiceAction {
  type: VoiceActionType;
  params: Record<string, any>;
  rawTranscript: string;
  confidence: number;
}

// --- Quantity parsing ---

const UNIT_MAP: Record<string, string> = {
  kilo: 'kg', kilos: 'kg', kilogramme: 'kg', kilogrammes: 'kg', kg: 'kg',
  gramme: 'g', grammes: 'g', g: 'g',
  litre: 'L', litres: 'L', l: 'L',
  millilitre: 'mL', millilitres: 'mL', ml: 'mL',
  unite: 'unit', unites: 'unit', piece: 'unit', pieces: 'unit',
  boite: 'unit', boites: 'unit', carton: 'unit', cartons: 'unit',
  bouteille: 'unit', bouteilles: 'unit',
};

const FRENCH_NUMBERS: Record<string, number> = {
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5,
  six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
  onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15,
  seize: 16, vingt: 20, trente: 30, quarante: 40, cinquante: 50,
  soixante: 60, cent: 100,
};

function parseNumber(text: string): number | null {
  const cleaned = text.trim().toLowerCase();
  // Direct numeric
  const num = parseFloat(cleaned.replace(',', '.'));
  if (!isNaN(num)) return num;
  // French word
  if (FRENCH_NUMBERS[cleaned] !== undefined) return FRENCH_NUMBERS[cleaned];
  return null;
}

function parseQuantityAndUnit(text: string): { quantity: number; unit: string } | null {
  // Match patterns like "5 kilos", "cinq kg", "10 litres"
  const unitKeys = Object.keys(UNIT_MAP).join('|');
  const regex = new RegExp(`(\\d+[.,]?\\d*|${Object.keys(FRENCH_NUMBERS).join('|')})\\s*(${unitKeys})`, 'i');
  const match = text.match(regex);
  if (match) {
    const quantity = parseNumber(match[1]);
    const unit = UNIT_MAP[match[2].toLowerCase()] || match[2];
    if (quantity !== null) return { quantity, unit };
  }
  // Try just a number without unit
  const numOnly = text.match(/(\d+[.,]?\d*)/);
  if (numOnly) {
    const quantity = parseNumber(numOnly[1]);
    if (quantity !== null) return { quantity, unit: 'kg' };
  }
  return null;
}

// --- Command patterns ---

interface CommandPattern {
  type: VoiceActionType;
  patterns: RegExp[];
  extract: (match: RegExpMatchArray, fullText: string) => Record<string, any>;
}

const COMMAND_PATTERNS: CommandPattern[] = [
  // STOCK ADD: "Ajoute 5 kilos de tomates au stock"
  {
    type: 'stock_add',
    patterns: [
      /(?:ajoute|ajouter|rajoute|rajouter|met|mets|mettre)\s+(.+?)(?:\s+(?:au|dans le|en|dans)\s+(?:stock|inventaire|frigo|reserve))/i,
      /(?:restock|restocke|restockes|reapprovisionne|reapprovisionner)\s+(.+)/i,
      /(?:ajoute|ajouter)\s+(\d+[.,]?\d*\s*(?:kilos?|kg|grammes?|g|litres?|l|unites?|pieces?|bouteilles?|boites?|cartons?)\s+(?:de\s+)?[\w\sàâäéèêëïîôùûüÿçœæ]+)/i,
    ],
    extract: (_match, fullText) => {
      const qtyUnit = parseQuantityAndUnit(fullText);
      // Extract ingredient name: after "de" or after quantity+unit
      const nameMatch = fullText.match(/(?:de|du|des|d')\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+?)(?:\s+(?:au|dans|en)\s|$)/i);
      const ingredientName = nameMatch
        ? nameMatch[1].trim()
        : fullText.replace(/(?:ajoute|ajouter|rajoute|rajouter|met|mets|mettre|restock(?:e|es)?|reapprovisionne(?:r)?)\s*/i, '')
            .replace(/\d+[.,]?\d*\s*(?:kilos?|kg|grammes?|g|litres?|l|unites?|pieces?|bouteilles?|boites?|cartons?)\s*(?:de\s+)?/i, '')
            .replace(/\s+(?:au|dans le|en|dans)\s+(?:stock|inventaire|frigo|reserve).*$/i, '')
            .trim();
      return {
        ingredientName: ingredientName || 'inconnu',
        quantity: qtyUnit?.quantity || 1,
        unit: qtyUnit?.unit || 'kg',
      };
    },
  },

  // STOCK QUERY: "Combien de poulet il reste?"
  {
    type: 'stock_query',
    patterns: [
      /(?:combien|quel(?:le)?(?:s)?\s+(?:quantite|stock))\s+(?:de|du|d'|des)\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+?)(?:\s+(?:il\s+)?(?:reste|en stock|disponible|j'ai|on a)|\?|$)/i,
      /(?:il\s+(?:reste|y a)\s+(?:combien|du|de la|des)\s+)([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
      /(?:stock|quantite|niveau)\s+(?:de|du|d'|des)\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
      /(?:combien)\s+(?:de|du|d'|des)\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
    ],
    extract: (match) => ({
      ingredientName: match[1]?.trim() || 'inconnu',
    }),
  },

  // RECIPE COST: "Quel est le cout de la salade nicoise?"
  {
    type: 'recipe_cost',
    patterns: [
      /(?:quel(?:le)?(?:s)?\s+(?:est|sont)\s+(?:le|la|les)\s+(?:cout|prix|marge|food cost|co[uû]t))\s+(?:de(?:s)?\s+(?:la\s+|le\s+|l')?|du\s+)([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
      /(?:cout|prix|marge|food cost|co[uû]t)\s+(?:de(?:s)?\s+(?:la\s+|le\s+|l')?|du\s+)([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
      /(?:combien\s+(?:coute|co[uû]te))\s+(?:la\s+|le\s+|l'|un\s+|une\s+)?([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
    ],
    extract: (match) => ({
      recipeName: match[1]?.trim().replace(/\?+$/, '').trim() || 'inconnu',
    }),
  },

  // RECIPE CREATE: "Cree une recette risotto"
  {
    type: 'recipe_create',
    patterns: [
      /(?:cre(?:e|er|é|ée)|nouvelle|ajoute(?:r)?|faire)\s+(?:une\s+)?(?:recette|fiche technique|fiche)\s+(?:de\s+|du\s+|d'|pour\s+(?:le\s+|la\s+|l')?)?([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
      /(?:cre(?:e|er|é|ée)|nouvelle|ajoute(?:r)?)\s+(?:la\s+|le\s+|un\s+|une\s+)?([\w\sàâäéèêëïîôùûüÿçœæ'-]+)\s+(?:comme|en tant que)\s+recette/i,
    ],
    extract: (match) => ({
      recipeName: match[1]?.trim() || 'Nouvelle recette',
    }),
  },

  // ORDER CREATE: "Commande 10 kilos de boeuf chez Metro"
  {
    type: 'order_create',
    patterns: [
      /(?:commande|commander|passe(?:r)?\s+(?:une\s+)?commande)\s+(.+?)(?:\s+(?:chez|a|à|auprès de|aupres de|au|pour)\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+))?$/i,
    ],
    extract: (_match, fullText) => {
      const qtyUnit = parseQuantityAndUnit(fullText);
      const supplierMatch = fullText.match(/(?:chez|a|à|auprès de|aupres de)\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+?)$/i);
      const nameMatch = fullText.match(/(?:de|du|des|d')\s+([\w\sàâäéèêëïîôùûüÿçœæ'-]+?)(?:\s+(?:chez|a|à|auprès|aupres)|$)/i);
      return {
        ingredientName: nameMatch?.[1]?.trim() || 'inconnu',
        quantity: qtyUnit?.quantity || 1,
        unit: qtyUnit?.unit || 'kg',
        supplierName: supplierMatch?.[1]?.trim() || null,
      };
    },
  },

  // DASHBOARD STATS: "Quel est mon food cost aujourd'hui?"
  {
    type: 'dashboard_stats',
    patterns: [
      /(?:quel(?:le)?(?:s)?\s+(?:est|sont))\s+(?:mon|ma|mes|le|la|les)\s+(?:food cost|foodcost|cout matiere|co[uû]t mati[eè]re|marge|stats?|statistiques?|chiffres?)/i,
      /(?:montre|affiche|voir|donne)\s+(?:moi\s+)?(?:mon|ma|mes|le|la|les)\s+(?:dashboard|tableau de bord|stats?|statistiques?|food cost|marge)/i,
      /(?:food cost|marge|chiffre d'affaires?|ca)\s+(?:du jour|aujourd'hui|de la semaine|ce mois)/i,
    ],
    extract: () => ({}),
  },

  // RECIPE PRINT: "Imprime la fiche technique du burger"
  {
    type: 'recipe_print',
    patterns: [
      /(?:imprime|imprimer|print|exporte|exporter)\s+(?:la\s+)?(?:fiche technique|fiche|recette)\s+(?:de(?:s)?\s+(?:la\s+|le\s+|l')?|du\s+)([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
    ],
    extract: (match) => ({
      recipeName: match[1]?.trim() || 'inconnu',
    }),
  },

  // NAVIGATE: "Va aux recettes", "Ouvre l'inventaire"
  {
    type: 'navigate',
    patterns: [
      /(?:va|aller|ouvre|ouvrir|affiche|afficher|montre|montrer|navigue|naviguer)\s+(?:a|à|aux|au|vers|sur)?\s*(?:la page|la section|le)?\s*(?:de(?:s)?\s+)?(?:la\s+|le\s+|l')?([\w\sàâäéèêëïîôùûüÿçœæ'-]+)/i,
    ],
    extract: (match) => {
      const target = match[1]?.trim().toLowerCase() || '';
      const ROUTE_MAP: Record<string, string> = {
        'dashboard': '/dashboard',
        'tableau de bord': '/dashboard',
        'recettes': '/recipes',
        'recette': '/recipes',
        'ingredients': '/ingredients',
        'ingrédients': '/ingredients',
        'fournisseurs': '/suppliers',
        'fournisseur': '/suppliers',
        'inventaire': '/inventory',
        'stock': '/inventory',
        'stocks': '/inventory',
        'commandes': '/auto-orders',
        'commande': '/auto-orders',
        'menu': '/menu-builder',
        'menus': '/menu-builder',
        'planning': '/planning',
        'gaspillage': '/waste-tracker',
        'haccp': '/haccp',
        'analytique': '/analytics',
        'analytics': '/analytics',
        'parametres': '/settings',
        'reglages': '/settings',
        'mercuriale': '/mercuriale',
        'cuisine': '/kitchen',
        'assistant': '/ai-assistant',
        'ia': '/ai-assistant',
        'devis': '/devis',
        'clients': '/clients',
        'messagerie': '/messagerie',
      };
      const route = ROUTE_MAP[target] || null;
      return { target, route };
    },
  },
];

/**
 * Parse a French voice transcript into a structured VoiceAction.
 */
export function parseVoiceCommand(transcript: string): VoiceAction {
  const cleaned = transcript.trim();
  if (!cleaned) {
    return { type: 'unknown', params: {}, rawTranscript: transcript, confidence: 0 };
  }

  for (const cmd of COMMAND_PATTERNS) {
    for (const pattern of cmd.patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        return {
          type: cmd.type,
          params: cmd.extract(match, cleaned),
          rawTranscript: transcript,
          confidence: 0.85,
        };
      }
    }
  }

  return { type: 'unknown', params: {}, rawTranscript: transcript, confidence: 0 };
}

/**
 * Get a human-readable description of the action taken.
 */
export function describeAction(action: VoiceAction): string {
  switch (action.type) {
    case 'stock_add':
      return `Ajout de ${action.params.quantity} ${action.params.unit} de ${action.params.ingredientName} au stock`;
    case 'stock_query':
      return `Recherche du stock de ${action.params.ingredientName}`;
    case 'recipe_cost':
      return `Recherche du cout de la recette "${action.params.recipeName}"`;
    case 'recipe_create':
      return `Creation de la recette "${action.params.recipeName}"`;
    case 'order_create':
      return `Commande de ${action.params.quantity} ${action.params.unit} de ${action.params.ingredientName}${action.params.supplierName ? ` chez ${action.params.supplierName}` : ''}`;
    case 'dashboard_stats':
      return `Affichage des statistiques du tableau de bord`;
    case 'recipe_print':
      return `Impression de la fiche technique "${action.params.recipeName}"`;
    case 'navigate':
      return `Navigation vers ${action.params.target}`;
    default:
      return `Commande vocale non reconnue`;
  }
}
