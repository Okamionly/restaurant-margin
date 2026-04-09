// ── Shared color palettes ────────────────────────────────────────────────────
// Centralised so every page can import from one place.
// Usage:  import { CHART_COLORS, FOOD_CATEGORY_COLORS } from '@/constants/colors';

/** Generic chart palette (pie, bar, line, etc.) */
export const CHART_COLORS = [
  '#2563eb', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#0891b2', '#e11d48', '#4f46e5',
];

/** Comptabilite-specific chart palette */
export const ACCOUNTING_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16',
];

/** TVA breakdown colors */
export const TVA_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

/** Food-category → hex mapping (ingredient categories) */
export const FOOD_CATEGORY_COLORS: Record<string, string> = {
  'Viandes':                   '#dc2626',
  'Poissons & Fruits de mer':  '#2563eb',
  'Légumes':                   '#16a34a',
  'Fruits':                    '#f59e0b',
  'Produits laitiers':         '#8b5cf6',
  'Épices & Condiments':       '#ea580c',
  'Féculents & Céréales':      '#a16207',
  'Huiles & Matières grasses': '#0891b2',
  'Boissons':                  '#ec4899',
  'Autres':                    '#64748b',
};

/** Margin bar colors per recipe type */
export const MARGIN_BAR_COLORS: Record<string, string> = {
  'Entrée':         '#2563eb',
  'Plat':           '#059669',
  'Dessert':        '#d97706',
  'Boisson':        '#7c3aed',
  'Accompagnement': '#0891b2',
};

/** Tailwind gradient classes per recipe category (Recipes page cards) */
export const CATEGORY_GRADIENTS: Record<string, string> = {
  'Entrée':         'from-emerald-400 to-green-600',
  'Plat':           'from-teal-400 to-indigo-600',
  'Dessert':        'from-pink-400 to-rose-600',
  'Accompagnement': 'from-amber-400 to-orange-600',
  'Boisson':        'from-cyan-400 to-teal-600',
};

/** Semantic status colors (hex) */
export const STATUS_COLORS: Record<string, string> = {
  success: '#10b981',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#0d9488',
};

/** Allergen badge → Tailwind classes (Dashboard) */
export const ALLERGEN_COLORS: Record<string, string> = {
  Gluten:        'bg-yellow-200 text-yellow-900 dark:bg-yellow-800/50 dark:text-yellow-200',
  'Crustacés':   'bg-orange-200 text-orange-900 dark:bg-orange-800/50 dark:text-orange-200',
  Oeufs:         'bg-amber-200 text-amber-900 dark:bg-amber-800/50 dark:text-amber-200',
  Poissons:      'bg-teal-200 text-teal-900 dark:bg-teal-800/50 dark:text-teal-200',
  Arachides:     'bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200',
  Soja:          'bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-200',
};

/** Séminaires – event status → Tailwind classes */
export const EVENT_STATUS_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Demande':       { bg: 'bg-[#F5F5F5] dark:bg-[#404040]/50',    text: 'text-[#A3A3A3] dark:text-[#D4D4D4]',   border: 'border-[#D4D4D4] dark:border-[#404040]',   dot: 'bg-[#A3A3A3]' },
  'Devis envoyé':  { bg: 'bg-amber-100 dark:bg-amber-900/40',    text: 'text-amber-700 dark:text-amber-300',   border: 'border-amber-300 dark:border-amber-700',   dot: 'bg-amber-400' },
  'Confirmé':      { bg: 'bg-teal-100 dark:bg-teal-900/40',      text: 'text-teal-700 dark:text-teal-300',     border: 'border-teal-300 dark:border-teal-700',     dot: 'bg-teal-400' },
  'En cours':      { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-400' },
  'Soldé':         { bg: 'bg-purple-100 dark:bg-purple-900/40',  text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700', dot: 'bg-purple-400' },
};

/** Séminaires – event type → Tailwind classes */
export const EVENT_TYPE_COLORS: Record<string, string> = {
  'Séminaire':    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Mariage':      'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'Anniversaire': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'Corporate':    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'Autre':        'bg-[#F5F5F5] text-[#A3A3A3] dark:bg-[#404040]/40 dark:text-[#D4D4D4]',
};
