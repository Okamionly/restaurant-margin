// Templates de recettes pour suggestions automatiques
// Quand l'utilisateur tape un nom de plat, on lui propose les ingrédients adaptés

export interface RecipeTemplate {
  name: string;
  keywords: string[]; // mots-clés pour le matching
  category: string;
  description: string;
  nbPortions: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  sellingPrice: number;
  laborCostPerHour: number;
  ingredients: { name: string; quantity: number; wastePercent: number }[];
}

export const RECIPE_TEMPLATES: RecipeTemplate[] = [
  // === ENTRÉES ===
  {
    name: 'Quiche Lorraine',
    keywords: ['quiche', 'lorraine', 'tarte salée'],
    category: 'Entrée',
    description: 'Quiche traditionnelle aux lardons et fromage',
    nbPortions: 6, prepTimeMinutes: 25, cookTimeMinutes: 35, sellingPrice: 12, laborCostPerHour: 15,
    ingredients: [
      { name: 'Pâte brisée', quantity: 1, wastePercent: 0 },
      { name: 'Lardons fumés', quantity: 0.200, wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 4, wastePercent: 0 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.25, wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.100, wastePercent: 0 },
      { name: 'Noix de muscade', quantity: 0.002, wastePercent: 0 },
    ],
  },
  {
    name: 'Quiche aux épinards et chèvre',
    keywords: ['quiche', 'épinards', 'chèvre', 'tarte'],
    category: 'Entrée',
    description: 'Quiche aux épinards frais et fromage de chèvre',
    nbPortions: 6, prepTimeMinutes: 25, cookTimeMinutes: 35, sellingPrice: 13, laborCostPerHour: 15,
    ingredients: [
      { name: 'Pâte brisée', quantity: 1, wastePercent: 0 },
      { name: 'Épinards frais', quantity: 0.400, wastePercent: 15 },
      { name: 'Chèvre frais', quantity: 0.150, wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 4, wastePercent: 0 },
      { name: 'Crème liquide 35%', quantity: 0.25, wastePercent: 0 },
      { name: 'Noix de muscade', quantity: 0.002, wastePercent: 0 },
    ],
  },
  {
    name: 'Quiche aux poireaux',
    keywords: ['quiche', 'poireau', 'poireaux'],
    category: 'Entrée',
    description: 'Quiche fondante aux poireaux et crème',
    nbPortions: 6, prepTimeMinutes: 20, cookTimeMinutes: 35, sellingPrice: 12, laborCostPerHour: 15,
    ingredients: [
      { name: 'Pâte brisée', quantity: 1, wastePercent: 0 },
      { name: 'Poireau', quantity: 0.500, wastePercent: 20 },
      { name: 'Oeufs (calibre L)', quantity: 3, wastePercent: 0 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.25, wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.030, wastePercent: 0 },
      { name: 'Noix de muscade', quantity: 0.002, wastePercent: 0 },
    ],
  },
  {
    name: 'Salade César',
    keywords: ['salade', 'césar', 'caesar', 'poulet'],
    category: 'Entrée',
    description: 'Salade romaine, poulet, croûtons, parmesan',
    nbPortions: 4, prepTimeMinutes: 20, cookTimeMinutes: 10, sellingPrice: 14, laborCostPerHour: 15,
    ingredients: [
      { name: 'Salade verte (batavia)', quantity: 2, wastePercent: 15 },
      { name: 'Blanc de poulet', quantity: 0.400, wastePercent: 5 },
      { name: 'Parmesan AOP', quantity: 0.080, wastePercent: 0 },
      { name: 'Pain de mie', quantity: 0.5, wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, wastePercent: 0 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.05, wastePercent: 0 },
    ],
  },
  {
    name: 'Soupe à l\'oignon',
    keywords: ['soupe', 'oignon', 'gratinée'],
    category: 'Entrée',
    description: 'Soupe à l\'oignon gratinée traditionnelle',
    nbPortions: 6, prepTimeMinutes: 15, cookTimeMinutes: 45, sellingPrice: 10, laborCostPerHour: 15,
    ingredients: [
      { name: 'Oignon jaune', quantity: 1.000, wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.050, wastePercent: 0 },
      { name: 'Farine T55', quantity: 0.030, wastePercent: 0 },
      { name: 'Bouillon de volaille', quantity: 1.500, wastePercent: 0 },
      { name: 'Vin blanc (cuisine)', quantity: 0.200, wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.150, wastePercent: 0 },
      { name: 'Pain de mie', quantity: 0.5, wastePercent: 0 },
    ],
  },
  {
    name: 'Tartare de saumon',
    keywords: ['tartare', 'saumon', 'cru', 'avocat'],
    category: 'Entrée',
    description: 'Tartare de saumon frais, avocat, citron vert',
    nbPortions: 4, prepTimeMinutes: 20, cookTimeMinutes: 0, sellingPrice: 16, laborCostPerHour: 15,
    ingredients: [
      { name: 'Saumon frais (filet)', quantity: 0.400, wastePercent: 10 },
      { name: 'Avocat', quantity: 2, wastePercent: 30 },
      { name: 'Citron vert (lime)', quantity: 0.060, wastePercent: 30 },
      { name: 'Échalote', quantity: 0.040, wastePercent: 10 },
      { name: 'Ciboulette', quantity: 1, wastePercent: 10 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.030, wastePercent: 0 },
    ],
  },
  {
    name: 'Velouté de champignons',
    keywords: ['velouté', 'soupe', 'champignon', 'crème'],
    category: 'Entrée',
    description: 'Velouté crémeux aux champignons',
    nbPortions: 6, prepTimeMinutes: 15, cookTimeMinutes: 30, sellingPrice: 10, laborCostPerHour: 15,
    ingredients: [
      { name: 'Champignons de Paris', quantity: 0.500, wastePercent: 10 },
      { name: 'Oignon jaune', quantity: 0.150, wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.040, wastePercent: 0 },
      { name: 'Crème liquide 35%', quantity: 0.200, wastePercent: 0 },
      { name: 'Bouillon de volaille', quantity: 0.800, wastePercent: 0 },
    ],
  },

  // === PLATS ===
  {
    name: 'Boeuf bourguignon',
    keywords: ['boeuf', 'bourguignon', 'ragoût', 'mijoté'],
    category: 'Plat',
    description: 'Boeuf mijoté au vin rouge, carottes et champignons',
    nbPortions: 6, prepTimeMinutes: 30, cookTimeMinutes: 180, sellingPrice: 22, laborCostPerHour: 15,
    ingredients: [
      { name: 'Bavette de boeuf', quantity: 1.200, wastePercent: 10 },
      { name: 'Vin rouge (cuisine)', quantity: 0.750, wastePercent: 0 },
      { name: 'Carotte', quantity: 0.400, wastePercent: 15 },
      { name: 'Oignon jaune', quantity: 0.300, wastePercent: 10 },
      { name: 'Champignons de Paris', quantity: 0.300, wastePercent: 10 },
      { name: 'Lardons fumés', quantity: 0.150, wastePercent: 0 },
      { name: 'Fond de veau', quantity: 0.300, wastePercent: 0 },
      { name: 'Concentré de tomate', quantity: 0.030, wastePercent: 0 },
      { name: 'Farine T55', quantity: 0.030, wastePercent: 0 },
      { name: 'Thym frais', quantity: 1, wastePercent: 10 },
    ],
  },
  {
    name: 'Blanquette de veau',
    keywords: ['blanquette', 'veau', 'crème', 'mijoté'],
    category: 'Plat',
    description: 'Blanquette de veau à l\'ancienne, riz basmati',
    nbPortions: 6, prepTimeMinutes: 20, cookTimeMinutes: 90, sellingPrice: 22, laborCostPerHour: 15,
    ingredients: [
      { name: 'Veau (escalope)', quantity: 1.000, wastePercent: 5 },
      { name: 'Carotte', quantity: 0.300, wastePercent: 15 },
      { name: 'Poireau', quantity: 0.200, wastePercent: 20 },
      { name: 'Oignon jaune', quantity: 0.200, wastePercent: 10 },
      { name: 'Champignons de Paris', quantity: 0.200, wastePercent: 10 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.200, wastePercent: 0 },
      { name: 'Bouillon de volaille', quantity: 1.000, wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.040, wastePercent: 0 },
      { name: 'Riz basmati', quantity: 0.350, wastePercent: 0 },
    ],
  },
  {
    name: 'Couscous royal',
    keywords: ['couscous', 'royal', 'semoule', 'merguez', 'agneau'],
    category: 'Plat',
    description: 'Couscous royal : agneau, poulet, merguez et légumes',
    nbPortions: 6, prepTimeMinutes: 30, cookTimeMinutes: 60, sellingPrice: 20, laborCostPerHour: 15,
    ingredients: [
      { name: 'Épaule d\'agneau', quantity: 0.600, wastePercent: 10 },
      { name: 'Cuisse de poulet', quantity: 0.600, wastePercent: 10 },
      { name: 'Saucisse de Toulouse', quantity: 0.400, wastePercent: 0 },
      { name: 'Semoule de blé', quantity: 0.500, wastePercent: 0 },
      { name: 'Courgette', quantity: 0.400, wastePercent: 10 },
      { name: 'Carotte', quantity: 0.400, wastePercent: 15 },
      { name: 'Pois chiches (conserve)', quantity: 0.300, wastePercent: 0 },
      { name: 'Tomate', quantity: 0.300, wastePercent: 10 },
      { name: 'Oignon jaune', quantity: 0.200, wastePercent: 10 },
      { name: 'Cumin moulu', quantity: 0.010, wastePercent: 0 },
      { name: 'Paprika', quantity: 0.010, wastePercent: 0 },
    ],
  },
  {
    name: 'Risotto',
    keywords: ['risotto', 'riz', 'arborio', 'crémeux'],
    category: 'Plat',
    description: 'Risotto crémeux au parmesan',
    nbPortions: 4, prepTimeMinutes: 10, cookTimeMinutes: 25, sellingPrice: 18, laborCostPerHour: 15,
    ingredients: [
      { name: 'Riz arborio (risotto)', quantity: 0.350, wastePercent: 0 },
      { name: 'Oignon jaune', quantity: 0.100, wastePercent: 10 },
      { name: 'Vin blanc (cuisine)', quantity: 0.150, wastePercent: 0 },
      { name: 'Bouillon de volaille', quantity: 0.800, wastePercent: 0 },
      { name: 'Parmesan AOP', quantity: 0.080, wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.050, wastePercent: 0 },
    ],
  },
  {
    name: 'Burger gourmet',
    keywords: ['burger', 'hamburger', 'steak', 'bun'],
    category: 'Plat',
    description: 'Burger gourmet boeuf, cheddar, bacon, sauce maison',
    nbPortions: 4, prepTimeMinutes: 20, cookTimeMinutes: 15, sellingPrice: 18, laborCostPerHour: 15,
    ingredients: [
      { name: 'Steak haché 15%', quantity: 0.600, wastePercent: 0 },
      { name: 'Pain de mie', quantity: 2, wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.120, wastePercent: 0 },
      { name: 'Lardons fumés', quantity: 0.150, wastePercent: 0 },
      { name: 'Tomate', quantity: 0.200, wastePercent: 10 },
      { name: 'Salade verte (batavia)', quantity: 1, wastePercent: 20 },
      { name: 'Oignon jaune', quantity: 0.100, wastePercent: 10 },
      { name: 'Moutarde de Dijon', quantity: 0.020, wastePercent: 0 },
    ],
  },
  {
    name: 'Magret de canard',
    keywords: ['magret', 'canard', 'miel', 'rôti'],
    category: 'Plat',
    description: 'Magret de canard rôti, sauce miel',
    nbPortions: 4, prepTimeMinutes: 15, cookTimeMinutes: 25, sellingPrice: 26, laborCostPerHour: 15,
    ingredients: [
      { name: 'Magret de canard', quantity: 0.800, wastePercent: 5 },
      { name: 'Miel', quantity: 0.060, wastePercent: 0 },
      { name: 'Vinaigre balsamique', quantity: 0.040, wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.800, wastePercent: 15 },
      { name: 'Beurre doux', quantity: 0.040, wastePercent: 0 },
      { name: 'Thym frais', quantity: 0.5, wastePercent: 10 },
    ],
  },
  {
    name: 'Lasagnes bolognaise',
    keywords: ['lasagne', 'bolognaise', 'pâtes', 'béchamel'],
    category: 'Plat',
    description: 'Lasagnes à la bolognaise et béchamel gratinées',
    nbPortions: 6, prepTimeMinutes: 30, cookTimeMinutes: 45, sellingPrice: 16, laborCostPerHour: 15,
    ingredients: [
      { name: 'Steak haché 15%', quantity: 0.600, wastePercent: 0 },
      { name: 'Coulis de tomate', quantity: 0.500, wastePercent: 0 },
      { name: 'Oignon jaune', quantity: 0.200, wastePercent: 10 },
      { name: 'Carotte', quantity: 0.150, wastePercent: 15 },
      { name: 'Lait entier', quantity: 0.500, wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.050, wastePercent: 0 },
      { name: 'Farine T55', quantity: 0.050, wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.200, wastePercent: 0 },
      { name: 'Noix de muscade', quantity: 0.002, wastePercent: 0 },
    ],
  },
  {
    name: 'Curry de poulet',
    keywords: ['curry', 'poulet', 'indien', 'riz'],
    category: 'Plat',
    description: 'Curry de poulet crémeux au lait de coco, riz basmati',
    nbPortions: 4, prepTimeMinutes: 15, cookTimeMinutes: 30, sellingPrice: 17, laborCostPerHour: 15,
    ingredients: [
      { name: 'Blanc de poulet', quantity: 0.600, wastePercent: 5 },
      { name: 'Oignon jaune', quantity: 0.200, wastePercent: 10 },
      { name: 'Ail', quantity: 0.010, wastePercent: 10 },
      { name: 'Crème liquide 35%', quantity: 0.200, wastePercent: 0 },
      { name: 'Curry', quantity: 0.015, wastePercent: 0 },
      { name: 'Concentré de tomate', quantity: 0.030, wastePercent: 0 },
      { name: 'Riz basmati', quantity: 0.350, wastePercent: 0 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.030, wastePercent: 0 },
    ],
  },

  // === DESSERTS ===
  {
    name: 'Moelleux au chocolat',
    keywords: ['moelleux', 'chocolat', 'fondant', 'coulant'],
    category: 'Dessert',
    description: 'Moelleux au chocolat noir coeur coulant',
    nbPortions: 6, prepTimeMinutes: 20, cookTimeMinutes: 12, sellingPrice: 12, laborCostPerHour: 15,
    ingredients: [
      { name: 'Chocolat noir 70%', quantity: 0.200, wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.120, wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 4, wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.080, wastePercent: 0 },
      { name: 'Farine T45', quantity: 0.040, wastePercent: 0 },
    ],
  },
  {
    name: 'Crème brûlée',
    keywords: ['crème', 'brûlée', 'vanille', 'dessert'],
    category: 'Dessert',
    description: 'Crème brûlée à la vanille',
    nbPortions: 6, prepTimeMinutes: 15, cookTimeMinutes: 50, sellingPrice: 10, laborCostPerHour: 15,
    ingredients: [
      { name: 'Crème liquide 35%', quantity: 0.500, wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 6, wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.120, wastePercent: 0 },
      { name: 'Vanille (gousse)', quantity: 2, wastePercent: 0 },
      { name: 'Cassonade', quantity: 0.060, wastePercent: 0 },
    ],
  },
  {
    name: 'Tarte aux pommes',
    keywords: ['tarte', 'pomme', 'pâte', 'pommes'],
    category: 'Dessert',
    description: 'Tarte aux pommes classique',
    nbPortions: 6, prepTimeMinutes: 25, cookTimeMinutes: 35, sellingPrice: 10, laborCostPerHour: 15,
    ingredients: [
      { name: 'Pâte brisée', quantity: 1, wastePercent: 0 },
      { name: 'Pomme Golden', quantity: 1.000, wastePercent: 20 },
      { name: 'Sucre en poudre', quantity: 0.100, wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.050, wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, wastePercent: 0 },
      { name: 'Crème liquide 35%', quantity: 0.100, wastePercent: 0 },
    ],
  },
  {
    name: 'Panna cotta',
    keywords: ['panna', 'cotta', 'crème', 'coulis', 'fraise'],
    category: 'Dessert',
    description: 'Panna cotta vanille, coulis de fruits rouges',
    nbPortions: 6, prepTimeMinutes: 15, cookTimeMinutes: 5, sellingPrice: 9, laborCostPerHour: 15,
    ingredients: [
      { name: 'Crème liquide 35%', quantity: 0.500, wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.200, wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.080, wastePercent: 0 },
      { name: 'Vanille (gousse)', quantity: 1, wastePercent: 0 },
      { name: 'Gélatine (feuille)', quantity: 4, wastePercent: 0 },
      { name: 'Framboise', quantity: 0.200, wastePercent: 5 },
    ],
  },
];

/**
 * Recherche des templates de recettes correspondant à un terme de recherche
 */
export function searchTemplates(query: string): RecipeTemplate[] {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  return RECIPE_TEMPLATES
    .map((template) => {
      let score = 0;

      // Match exact name
      if (template.name.toLowerCase().includes(q)) score += 10;

      // Match keywords
      for (const word of words) {
        for (const keyword of template.keywords) {
          if (keyword.includes(word)) score += 5;
          if (keyword.startsWith(word)) score += 3;
        }
        if (template.name.toLowerCase().includes(word)) score += 2;
        if (template.description.toLowerCase().includes(word)) score += 1;
      }

      return { template, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ template }) => template);
}
