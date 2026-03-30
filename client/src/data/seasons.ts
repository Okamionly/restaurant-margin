// Données saisonnières des produits pour la restauration française
// Référence : marchés de gros Rungis, prix indicatifs moyens en €/kg

export type Season = 'printemps' | 'ete' | 'automne' | 'hiver';

export interface SeasonalProduct {
  name: string;
  category: string;
  season: Season[];
  peakMonths: number[];
  avgPrice: number;
  unit: string;
  tip: string;
}

const SEASON_CONFIG: Record<Season, { label: string; months: number[]; icon: string }> = {
  printemps: { label: 'Printemps', months: [3, 4, 5], icon: '🌱' },
  ete: { label: 'Été', months: [6, 7, 8], icon: '☀️' },
  automne: { label: 'Automne', months: [9, 10, 11], icon: '🍂' },
  hiver: { label: 'Hiver', months: [12, 1, 2], icon: '❄️' },
};

export const SEASONAL_PRODUCTS: SeasonalProduct[] = [
  // ─── PRINTEMPS ───────────────────────────────────────────
  {
    name: 'Asperges vertes',
    category: 'Légumes',
    season: ['printemps'],
    peakMonths: [4, 5],
    avgPrice: 8.5,
    unit: 'kg',
    tip: 'Privilégier les asperges françaises du Sud-Ouest, tiges fermes et cassantes.',
  },
  {
    name: 'Asperges blanches',
    category: 'Légumes',
    season: ['printemps'],
    peakMonths: [4, 5],
    avgPrice: 11.0,
    unit: 'kg',
    tip: 'Les Landes et le Val de Loire produisent les meilleures. Calibre 16+ pour la gastronomie.',
  },
  {
    name: 'Petits pois frais',
    category: 'Légumes',
    season: ['printemps'],
    peakMonths: [5, 6],
    avgPrice: 5.5,
    unit: 'kg',
    tip: 'Acheter en cosses pour la fraîcheur, écosser au dernier moment.',
  },
  {
    name: 'Radis',
    category: 'Légumes',
    season: ['printemps', 'ete'],
    peakMonths: [3, 4, 5],
    avgPrice: 3.2,
    unit: 'botte',
    tip: 'Les fanes doivent être bien vertes. Se conservent mal, acheter en petites quantités.',
  },
  {
    name: 'Fraises',
    category: 'Fruits',
    season: ['printemps', 'ete'],
    peakMonths: [4, 5, 6],
    avgPrice: 7.0,
    unit: 'kg',
    tip: 'Gariguette en avril, Ciflorette en mai. Éviter les importations hors saison.',
  },
  {
    name: 'Cerises',
    category: 'Fruits',
    season: ['printemps', 'ete'],
    peakMonths: [5, 6, 7],
    avgPrice: 9.0,
    unit: 'kg',
    tip: 'Burlat en mai, puis Reverchon et Napoleon. Vérifier la fermeté et le pédoncule vert.',
  },
  {
    name: 'Morilles',
    category: 'Légumes',
    season: ['printemps'],
    peakMonths: [3, 4, 5],
    avgPrice: 65.0,
    unit: 'kg',
    tip: 'Fraîches de mars à mai, sinon utiliser séchées. Bien nettoyer (sable). Prix très variable.',
  },
  {
    name: 'Agneau de printemps',
    category: 'Viandes',
    season: ['printemps'],
    peakMonths: [3, 4, 5],
    avgPrice: 16.5,
    unit: 'kg',
    tip: 'Agneau de lait ou de pré-salé. Le gigot de Pâques est un classique incontournable.',
  },
  {
    name: 'Fèves fraîches',
    category: 'Légumes',
    season: ['printemps'],
    peakMonths: [4, 5, 6],
    avgPrice: 4.5,
    unit: 'kg',
    tip: 'Écosser et peler la seconde peau pour un résultat optimal. Rendement ~30%.',
  },
  {
    name: 'Épinards frais',
    category: 'Légumes',
    season: ['printemps', 'automne'],
    peakMonths: [3, 4, 5, 10],
    avgPrice: 4.0,
    unit: 'kg',
    tip: 'Les jeunes pousses de printemps sont les plus tendres, idéales en salade.',
  },
  {
    name: 'Ail nouveau',
    category: 'Épices & Condiments',
    season: ['printemps'],
    peakMonths: [5, 6],
    avgPrice: 8.0,
    unit: 'kg',
    tip: 'Se conserve peu, utiliser rapidement. Saveur plus douce que l\'ail sec.',
  },

  // ─── ÉTÉ ────────────────────────────────────────────────
  {
    name: 'Tomates',
    category: 'Légumes',
    season: ['ete'],
    peakMonths: [7, 8, 9],
    avgPrice: 3.5,
    unit: 'kg',
    tip: 'Coeur de boeuf, Marmande, ou anciennes. Jamais au réfrigérateur. Acheter mûres à point.',
  },
  {
    name: 'Courgettes',
    category: 'Légumes',
    season: ['ete'],
    peakMonths: [6, 7, 8],
    avgPrice: 2.5,
    unit: 'kg',
    tip: 'Préférer les petites, plus fermes et moins aqueuses. Avec la fleur pour le farcis.',
  },
  {
    name: 'Aubergines',
    category: 'Légumes',
    season: ['ete'],
    peakMonths: [7, 8, 9],
    avgPrice: 3.0,
    unit: 'kg',
    tip: 'Peau lisse et brillante, ferme au toucher. Les striées sont plus douces.',
  },
  {
    name: 'Poivrons',
    category: 'Légumes',
    season: ['ete'],
    peakMonths: [7, 8, 9],
    avgPrice: 3.8,
    unit: 'kg',
    tip: 'Les rouges sont plus sucrés que les verts. Peler après passage au four.',
  },
  {
    name: 'Pêches',
    category: 'Fruits',
    season: ['ete'],
    peakMonths: [7, 8],
    avgPrice: 4.5,
    unit: 'kg',
    tip: 'Pêches de vigne pour les desserts. Doivent être parfumées, chair souple sous le doigt.',
  },
  {
    name: 'Abricots',
    category: 'Fruits',
    season: ['ete'],
    peakMonths: [6, 7],
    avgPrice: 5.0,
    unit: 'kg',
    tip: 'Bergeron du Rhône pour la qualité. Saison très courte, en profiter rapidement.',
  },
  {
    name: 'Melon',
    category: 'Fruits',
    season: ['ete'],
    peakMonths: [7, 8],
    avgPrice: 3.0,
    unit: 'pièce',
    tip: 'Le Charentais est le roi. Doit être lourd, parfumé au pédoncule, craquelé en surface.',
  },
  {
    name: 'Haricots verts',
    category: 'Légumes',
    season: ['ete'],
    peakMonths: [6, 7, 8],
    avgPrice: 5.5,
    unit: 'kg',
    tip: 'Doivent casser net. Les extra-fins sont les plus savoureux mais les plus chers.',
  },
  {
    name: 'Figues',
    category: 'Fruits',
    season: ['ete', 'automne'],
    peakMonths: [8, 9],
    avgPrice: 10.0,
    unit: 'kg',
    tip: 'Violettes de Solliès pour le top. Très fragiles, acheter au jour le jour.',
  },
  {
    name: 'Nectarines',
    category: 'Fruits',
    season: ['ete'],
    peakMonths: [7, 8],
    avgPrice: 4.2,
    unit: 'kg',
    tip: 'Chair blanche ou jaune. Mûrissement rapide à température ambiante.',
  },

  // ─── AUTOMNE ─────────────────────────────────────────────
  {
    name: 'Courge butternut',
    category: 'Légumes',
    season: ['automne', 'hiver'],
    peakMonths: [10, 11, 12],
    avgPrice: 2.2,
    unit: 'kg',
    tip: 'Se conserve plusieurs mois dans un endroit frais et sec. Idéale en velouté.',
  },
  {
    name: 'Potimarron',
    category: 'Légumes',
    season: ['automne', 'hiver'],
    peakMonths: [9, 10, 11],
    avgPrice: 2.5,
    unit: 'kg',
    tip: 'Se cuisine avec la peau. Goût de châtaigne, parfait pour les soupes.',
  },
  {
    name: 'Cèpes',
    category: 'Légumes',
    season: ['automne'],
    peakMonths: [9, 10],
    avgPrice: 35.0,
    unit: 'kg',
    tip: 'Frais de septembre à novembre. Vérifier l\'absence de vers. Prix très variable selon récolte.',
  },
  {
    name: 'Champignons de Paris',
    category: 'Légumes',
    season: ['automne', 'hiver', 'printemps'],
    peakMonths: [9, 10, 11],
    avgPrice: 4.5,
    unit: 'kg',
    tip: 'Disponibles toute l\'année mais meilleurs en automne. Blancs ou rosés selon usage.',
  },
  {
    name: 'Châtaignes',
    category: 'Fruits',
    season: ['automne'],
    peakMonths: [10, 11],
    avgPrice: 6.5,
    unit: 'kg',
    tip: 'Ardéchoises pour la qualité. Trier soigneusement, inciser avant cuisson.',
  },
  {
    name: 'Poires',
    category: 'Fruits',
    season: ['automne', 'hiver'],
    peakMonths: [9, 10, 11],
    avgPrice: 3.5,
    unit: 'kg',
    tip: 'Williams pour la cuisson, Conférence pour manger cru. La Comice est la plus fine.',
  },
  {
    name: 'Raisin',
    category: 'Fruits',
    season: ['automne'],
    peakMonths: [9, 10],
    avgPrice: 4.0,
    unit: 'kg',
    tip: 'Chasselas de Moissac AOP pour le service. Muscat pour les desserts.',
  },
  {
    name: 'Noix fraîches',
    category: 'Fruits',
    season: ['automne'],
    peakMonths: [9, 10, 11],
    avgPrice: 8.0,
    unit: 'kg',
    tip: 'Noix de Grenoble AOP ou du Périgord. Fraîches en septembre, sèches ensuite.',
  },
  {
    name: 'Gibier (faisan)',
    category: 'Viandes',
    season: ['automne'],
    peakMonths: [10, 11, 12],
    avgPrice: 14.0,
    unit: 'kg',
    tip: 'Saison de chasse d\'octobre à février. Faisander 2-3 jours au réfrigérateur.',
  },
  {
    name: 'Canard',
    category: 'Viandes',
    season: ['automne', 'hiver'],
    peakMonths: [10, 11, 12],
    avgPrice: 12.0,
    unit: 'kg',
    tip: 'Le magret de canard gras est meilleur en automne-hiver. Canard de Challans pour la qualité.',
  },
  {
    name: 'Pommes',
    category: 'Fruits',
    season: ['automne', 'hiver'],
    peakMonths: [9, 10, 11],
    avgPrice: 2.8,
    unit: 'kg',
    tip: 'Reine des Reinettes pour la tarte, Granny pour l\'acidité, Belle de Boskoop pour compotes.',
  },

  // ─── HIVER ───────────────────────────────────────────────
  {
    name: 'Poireaux',
    category: 'Légumes',
    season: ['hiver', 'automne'],
    peakMonths: [11, 12, 1, 2],
    avgPrice: 2.8,
    unit: 'kg',
    tip: 'Le blanc est la partie noble, le vert pour les bouillons. De Créances pour le top.',
  },
  {
    name: 'Endives',
    category: 'Légumes',
    season: ['hiver'],
    peakMonths: [11, 12, 1, 2],
    avgPrice: 4.5,
    unit: 'kg',
    tip: 'Du Nord de la France. Bien blanches, pointes jaunes. Conserver à l\'abri de la lumière.',
  },
  {
    name: 'Choux de Bruxelles',
    category: 'Légumes',
    season: ['hiver'],
    peakMonths: [11, 12, 1],
    avgPrice: 3.5,
    unit: 'kg',
    tip: 'Meilleurs après les premières gelées. Couper la base et inciser en croix.',
  },
  {
    name: 'Chou-fleur',
    category: 'Légumes',
    season: ['hiver', 'automne'],
    peakMonths: [10, 11, 12, 1],
    avgPrice: 2.5,
    unit: 'pièce',
    tip: 'Breton de préférence. Tête compacte et bien blanche, feuilles vertes et fraîches.',
  },
  {
    name: 'Clémentines',
    category: 'Fruits',
    season: ['hiver'],
    peakMonths: [11, 12, 1],
    avgPrice: 3.5,
    unit: 'kg',
    tip: 'Corses IGP de novembre à janvier. Avec feuilles pour la fraîcheur garantie.',
  },
  {
    name: 'Oranges',
    category: 'Fruits',
    season: ['hiver'],
    peakMonths: [12, 1, 2, 3],
    avgPrice: 2.5,
    unit: 'kg',
    tip: 'Sanguines pour les desserts (janvier-mars). Navel pour le jus. Siciliennes excellent rapport qualité/prix.',
  },
  {
    name: 'Huîtres',
    category: 'Poissons & Fruits de mer',
    season: ['hiver', 'automne'],
    peakMonths: [10, 11, 12, 1, 2],
    avgPrice: 12.0,
    unit: 'kg',
    tip: 'Les mois en "R" (septembre-avril). Marennes-Oléron ou Cancale. N°3 pour le service.',
  },
  {
    name: 'Topinambours',
    category: 'Légumes',
    season: ['hiver'],
    peakMonths: [11, 12, 1, 2],
    avgPrice: 5.0,
    unit: 'kg',
    tip: 'Goût d\'artichaut. Peler au dernier moment (oxydation). Excellent en velouté ou chips.',
  },
  {
    name: 'Mâche',
    category: 'Légumes',
    season: ['hiver'],
    peakMonths: [11, 12, 1, 2],
    avgPrice: 12.0,
    unit: 'kg',
    tip: 'Nantaise pour la qualité. Laver plusieurs fois. Fragile, utiliser rapidement.',
  },
  {
    name: 'Chou rouge',
    category: 'Légumes',
    season: ['hiver', 'automne'],
    peakMonths: [10, 11, 12, 1],
    avgPrice: 1.8,
    unit: 'kg',
    tip: 'Se conserve très bien. Excellent braisé avec des pommes et du vinaigre.',
  },
  {
    name: 'Salsifis',
    category: 'Légumes',
    season: ['hiver'],
    peakMonths: [11, 12, 1, 2],
    avgPrice: 5.5,
    unit: 'kg',
    tip: 'Peler avec des gants (latex colorant). Citronner pour éviter l\'oxydation.',
  },
  {
    name: 'Moules',
    category: 'Poissons & Fruits de mer',
    season: ['automne', 'hiver'],
    peakMonths: [9, 10, 11, 12],
    avgPrice: 5.5,
    unit: 'kg',
    tip: 'De bouchot pour la qualité, AOP du Mont-Saint-Michel. Saison de juillet à février.',
  },
  {
    name: 'Coquilles Saint-Jacques',
    category: 'Poissons & Fruits de mer',
    season: ['hiver'],
    peakMonths: [11, 12, 1, 2, 3],
    avgPrice: 45.0,
    unit: 'kg',
    tip: 'Pêche d\'octobre à mai. Normandes ou bretonnes. Noix fraîche, corail facultatif.',
  },
];

// ─── FONCTIONS UTILITAIRES ─────────────────────────────────

export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'printemps';
  if (month >= 6 && month <= 8) return 'ete';
  if (month >= 9 && month <= 11) return 'automne';
  return 'hiver';
}

export function getCurrentSeasonLabel(): string {
  return SEASON_CONFIG[getCurrentSeason()].label;
}

export function getSeasonalProducts(season?: Season): SeasonalProduct[] {
  const s = season ?? getCurrentSeason();
  return SEASONAL_PRODUCTS.filter((p) => p.season.includes(s));
}

export function isInSeason(productName: string, month?: number): boolean {
  const m = month ?? new Date().getMonth() + 1;
  const product = SEASONAL_PRODUCTS.find(
    (p) => p.name.toLowerCase() === productName.toLowerCase()
  );
  if (!product) return false;
  return product.peakMonths.includes(m);
}

export function getSeasonIcon(season: Season): string {
  return SEASON_CONFIG[season].icon;
}

export function getSeasonLabel(season: Season): string {
  return SEASON_CONFIG[season].label;
}

export function getSeasonMonths(season: Season): number[] {
  return SEASON_CONFIG[season].months;
}

export function getProductsBySeason(): Record<Season, SeasonalProduct[]> {
  return {
    printemps: getSeasonalProducts('printemps'),
    ete: getSeasonalProducts('ete'),
    automne: getSeasonalProducts('automne'),
    hiver: getSeasonalProducts('hiver'),
  };
}
