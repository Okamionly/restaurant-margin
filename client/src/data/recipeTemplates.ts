export interface RecipeTemplate {
  name: string;
  category: 'Entrée' | 'Plat' | 'Dessert' | 'Boisson' | 'Accompagnement';
  suggestedIngredients: { name: string; quantity: number; unit: string; wastePercent: number }[];
  suggestedSellingPrice: number;
  suggestedPrepTime: number;
  suggestedCookTime: number;
  nbPortions: number;
  description: string;
}

export const recipeTemplates: RecipeTemplate[] = [
  // =============================================
  // ENTRÉES (16)
  // =============================================
  {
    name: 'Quiche Lorraine', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 9.5, suggestedPrepTime: 20, suggestedCookTime: 35,
    description: 'Quiche traditionnelle aux lardons et crème, pâte brisée maison',
    suggestedIngredients: [
      { name: 'Pâte brisée', quantity: 0.25, unit: 'kg', wastePercent: 5 },
      { name: 'Lardons fumés', quantity: 0.15, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 3, unit: 'pièce', wastePercent: 0 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.2, unit: 'L', wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.08, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Quiche aux légumes', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 9, suggestedPrepTime: 25, suggestedCookTime: 35,
    description: 'Quiche végétarienne courgette, poivron, tomate et chèvre frais',
    suggestedIngredients: [
      { name: 'Pâte brisée', quantity: 0.25, unit: 'kg', wastePercent: 5 },
      { name: 'Courgette', quantity: 0.15, unit: 'kg', wastePercent: 10 },
      { name: 'Poivron rouge', quantity: 0.1, unit: 'kg', wastePercent: 15 },
      { name: 'Tomate', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Oeufs (calibre L)', quantity: 3, unit: 'pièce', wastePercent: 0 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.2, unit: 'L', wastePercent: 0 },
      { name: 'Chèvre frais', quantity: 0.06, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Quiche au saumon', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 12, suggestedPrepTime: 20, suggestedCookTime: 35,
    description: 'Quiche au saumon frais, aneth et crème',
    suggestedIngredients: [
      { name: 'Pâte brisée', quantity: 0.25, unit: 'kg', wastePercent: 5 },
      { name: 'Saumon frais (filet)', quantity: 0.15, unit: 'kg', wastePercent: 5 },
      { name: 'Oeufs (calibre L)', quantity: 3, unit: 'pièce', wastePercent: 0 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.2, unit: 'L', wastePercent: 0 },
      { name: 'Citron', quantity: 0.05, unit: 'kg', wastePercent: 20 },
    ],
  },
  {
    name: 'Soupe à l\'oignon', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 8, suggestedPrepTime: 15, suggestedCookTime: 45,
    description: 'Soupe gratinée à l\'oignon avec croûtons et fromage',
    suggestedIngredients: [
      { name: 'Oignon jaune', quantity: 0.3, unit: 'kg', wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.05, unit: 'kg', wastePercent: 0 },
      { name: 'Pain de campagne', quantity: 0.05, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Velouté de champignons', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 8.5, suggestedPrepTime: 15, suggestedCookTime: 25,
    description: 'Velouté onctueux de champignons de Paris à la crème',
    suggestedIngredients: [
      { name: 'Champignons de Paris', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Échalote', quantity: 0.03, unit: 'kg', wastePercent: 10 },
      { name: 'Crème liquide 35%', quantity: 0.1, unit: 'L', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.08, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Velouté de butternut', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 8, suggestedPrepTime: 15, suggestedCookTime: 30,
    description: 'Velouté doux de courge butternut, touche de muscade',
    suggestedIngredients: [
      { name: 'Butternut', quantity: 0.3, unit: 'kg', wastePercent: 15 },
      { name: 'Oignon jaune', quantity: 0.05, unit: 'kg', wastePercent: 10 },
      { name: 'Crème liquide 35%', quantity: 0.08, unit: 'L', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Gaspacho', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 7.5, suggestedPrepTime: 20, suggestedCookTime: 0,
    description: 'Soupe froide de tomate, concombre et poivron rouge',
    suggestedIngredients: [
      { name: 'Tomate', quantity: 0.4, unit: 'kg', wastePercent: 10 },
      { name: 'Concombre', quantity: 0.5, unit: 'pièce', wastePercent: 10 },
      { name: 'Poivron rouge', quantity: 0.1, unit: 'kg', wastePercent: 15 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.03, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Salade César', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 12, suggestedPrepTime: 20, suggestedCookTime: 10,
    description: 'Salade romaine, poulet grillé, croûtons, parmesan et sauce César',
    suggestedIngredients: [
      { name: 'Salade verte (batavia)', quantity: 0.5, unit: 'pièce', wastePercent: 15 },
      { name: 'Blanc de poulet', quantity: 0.12, unit: 'kg', wastePercent: 5 },
      { name: 'Parmesan AOP', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Pain de campagne', quantity: 0.04, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Salade Niçoise', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 13, suggestedPrepTime: 20, suggestedCookTime: 10,
    description: 'Salade traditionnelle niçoise au thon, œuf et haricots verts',
    suggestedIngredients: [
      { name: 'Salade verte (batavia)', quantity: 0.5, unit: 'pièce', wastePercent: 15 },
      { name: 'Thon frais', quantity: 0.1, unit: 'kg', wastePercent: 5 },
      { name: 'Tomate', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Oeufs (calibre L)', quantity: 1, unit: 'pièce', wastePercent: 0 },
      { name: 'Haricots verts', quantity: 0.08, unit: 'kg', wastePercent: 5 },
    ],
  },
  {
    name: 'Salade de chèvre chaud', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 11, suggestedPrepTime: 15, suggestedCookTime: 8,
    description: 'Mâche, toasts de chèvre chaud gratinés, noix et miel',
    suggestedIngredients: [
      { name: 'Mâche', quantity: 0.06, unit: 'kg', wastePercent: 10 },
      { name: 'Chèvre frais', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Pain de campagne', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Miel', quantity: 0.01, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Foie gras mi-cuit', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 18, suggestedPrepTime: 30, suggestedCookTime: 40,
    description: 'Foie gras de canard mi-cuit, pain toasté et confiture de figue',
    suggestedIngredients: [
      { name: 'Foie gras de canard', quantity: 0.08, unit: 'kg', wastePercent: 5 },
      { name: 'Pain de campagne', quantity: 0.05, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Tartare de saumon', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 14, suggestedPrepTime: 20, suggestedCookTime: 0,
    description: 'Tartare de saumon frais au citron vert, aneth et avocat',
    suggestedIngredients: [
      { name: 'Saumon frais (filet)', quantity: 0.15, unit: 'kg', wastePercent: 5 },
      { name: 'Échalote', quantity: 0.02, unit: 'kg', wastePercent: 10 },
      { name: 'Citron vert (lime)', quantity: 0.03, unit: 'kg', wastePercent: 20 },
      { name: 'Avocat', quantity: 0.5, unit: 'pièce', wastePercent: 30 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.02, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Carpaccio de boeuf', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 14, suggestedPrepTime: 15, suggestedCookTime: 0,
    description: 'Fines tranches de bœuf cru, roquette, parmesan et huile d\'olive',
    suggestedIngredients: [
      { name: 'Filet de boeuf', quantity: 0.12, unit: 'kg', wastePercent: 5 },
      { name: 'Parmesan AOP', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Roquette', quantity: 0.03, unit: 'kg', wastePercent: 10 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.02, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Bruschetta', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 8, suggestedPrepTime: 10, suggestedCookTime: 5,
    description: 'Toasts grillés, tomate fraîche, mozzarella et basilic',
    suggestedIngredients: [
      { name: 'Pain de campagne', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Tomate', quantity: 0.15, unit: 'kg', wastePercent: 10 },
      { name: 'Mozzarella', quantity: 0.06, unit: 'kg', wastePercent: 0 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.02, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Soufflé au fromage', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 10, suggestedPrepTime: 20, suggestedCookTime: 25,
    description: 'Soufflé léger et aérien au fromage gratiné',
    suggestedIngredients: [
      { name: 'Oeufs (calibre L)', quantity: 3, unit: 'pièce', wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Farine de blé T55', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.15, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Terrine de campagne', category: 'Entrée', nbPortions: 1, suggestedSellingPrice: 9, suggestedPrepTime: 30, suggestedCookTime: 90,
    description: 'Terrine rustique de campagne, cornichons et pain grillé',
    suggestedIngredients: [
      { name: 'Côte de porc', quantity: 0.15, unit: 'kg', wastePercent: 10 },
      { name: 'Lardons fumés', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 1, unit: 'pièce', wastePercent: 0 },
      { name: 'Pain de campagne', quantity: 0.05, unit: 'kg', wastePercent: 0 },
    ],
  },

  // =============================================
  // PLATS (24)
  // =============================================
  {
    name: 'Steak frites', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 22, suggestedPrepTime: 15, suggestedCookTime: 20,
    description: 'Entrecôte grillée, frites maison et beurre maître d\'hôtel',
    suggestedIngredients: [
      { name: 'Entrecôte de boeuf', quantity: 0.25, unit: 'kg', wastePercent: 5 },
      { name: 'Pomme de terre', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Bavette à l\'échalote', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 18, suggestedPrepTime: 10, suggestedCookTime: 15,
    description: 'Bavette de bœuf poêlée, sauce échalote au vin rouge',
    suggestedIngredients: [
      { name: 'Bavette de boeuf', quantity: 0.2, unit: 'kg', wastePercent: 5 },
      { name: 'Échalote', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Vin rouge', quantity: 0.05, unit: 'L', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Coq au vin', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 18, suggestedPrepTime: 30, suggestedCookTime: 90,
    description: 'Poulet mijoté au vin rouge, lardons et champignons',
    suggestedIngredients: [
      { name: 'Cuisse de poulet', quantity: 0.3, unit: 'kg', wastePercent: 10 },
      { name: 'Vin rouge', quantity: 0.15, unit: 'L', wastePercent: 0 },
      { name: 'Lardons fumés', quantity: 0.05, unit: 'kg', wastePercent: 0 },
      { name: 'Champignons de Paris', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Carotte', quantity: 0.08, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Poulet rôti', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 16, suggestedPrepTime: 15, suggestedCookTime: 60,
    description: 'Poulet rôti au thym, pommes de terre fondantes',
    suggestedIngredients: [
      { name: 'Cuisse de poulet', quantity: 0.3, unit: 'kg', wastePercent: 10 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
      { name: 'Ail', quantity: 0.01, unit: 'kg', wastePercent: 15 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Blanquette de veau', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 19, suggestedPrepTime: 20, suggestedCookTime: 75,
    description: 'Blanquette de veau à l\'ancienne, sauce crémée et riz',
    suggestedIngredients: [
      { name: 'Veau (escalope)', quantity: 0.2, unit: 'kg', wastePercent: 5 },
      { name: 'Carotte', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Champignons de Paris', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.1, unit: 'L', wastePercent: 0 },
      { name: 'Riz basmati', quantity: 0.08, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Boeuf bourguignon', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 19, suggestedPrepTime: 30, suggestedCookTime: 120,
    description: 'Boeuf braisé au vin rouge de Bourgogne, légumes et pommes de terre',
    suggestedIngredients: [
      { name: 'Bavette de boeuf', quantity: 0.25, unit: 'kg', wastePercent: 5 },
      { name: 'Vin rouge', quantity: 0.15, unit: 'L', wastePercent: 0 },
      { name: 'Carotte', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Champignons de Paris', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Lardons fumés', quantity: 0.05, unit: 'kg', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Magret de canard', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 22, suggestedPrepTime: 10, suggestedCookTime: 20,
    description: 'Magret de canard rôti au miel, gratin et haricots verts',
    suggestedIngredients: [
      { name: 'Magret de canard', quantity: 0.2, unit: 'kg', wastePercent: 5 },
      { name: 'Miel', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
      { name: 'Haricots verts', quantity: 0.1, unit: 'kg', wastePercent: 5 },
    ],
  },
  {
    name: 'Confit de canard', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 18, suggestedPrepTime: 10, suggestedCookTime: 30,
    description: 'Cuisse de canard confite, pommes sarladaises et salade',
    suggestedIngredients: [
      { name: 'Cuisse de canard confite', quantity: 1, unit: 'pièce', wastePercent: 5 },
      { name: 'Pomme de terre', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Ail', quantity: 0.01, unit: 'kg', wastePercent: 15 },
    ],
  },
  {
    name: 'Canard à l\'orange', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 21, suggestedPrepTime: 15, suggestedCookTime: 25,
    description: 'Magret de canard, sauce bigarade à l\'orange, riz basmati',
    suggestedIngredients: [
      { name: 'Magret de canard', quantity: 0.2, unit: 'kg', wastePercent: 5 },
      { name: 'Orange', quantity: 0.15, unit: 'kg', wastePercent: 20 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Riz basmati', quantity: 0.08, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Pavé de saumon', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 20, suggestedPrepTime: 10, suggestedCookTime: 15,
    description: 'Pavé de saumon rôti, riz basmati, épinards et beurre à l\'aneth',
    suggestedIngredients: [
      { name: 'Saumon frais (filet)', quantity: 0.18, unit: 'kg', wastePercent: 5 },
      { name: 'Riz basmati', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Épinards frais', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Citron', quantity: 0.03, unit: 'kg', wastePercent: 20 },
    ],
  },
  {
    name: 'Sole meunière', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 26, suggestedPrepTime: 10, suggestedCookTime: 12,
    description: 'Sole meunière au beurre noisette, citron et pommes vapeur',
    suggestedIngredients: [
      { name: 'Sole (filet)', quantity: 0.2, unit: 'kg', wastePercent: 5 },
      { name: 'Beurre doux', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Citron', quantity: 0.03, unit: 'kg', wastePercent: 20 },
      { name: 'Pomme de terre', quantity: 0.15, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Moules marinières', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 16, suggestedPrepTime: 15, suggestedCookTime: 10,
    description: 'Moules de bouchot marinières, crème, frites maison',
    suggestedIngredients: [
      { name: 'Moules de bouchot', quantity: 0.5, unit: 'kg', wastePercent: 20 },
      { name: 'Vin blanc sec', quantity: 0.1, unit: 'L', wastePercent: 0 },
      { name: 'Échalote', quantity: 0.03, unit: 'kg', wastePercent: 10 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.05, unit: 'L', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Bouillabaisse', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 24, suggestedPrepTime: 30, suggestedCookTime: 30,
    description: 'Soupe de poissons et fruits de mer à la marseillaise',
    suggestedIngredients: [
      { name: 'Cabillaud (dos)', quantity: 0.1, unit: 'kg', wastePercent: 5 },
      { name: 'Crevettes roses', quantity: 0.08, unit: 'kg', wastePercent: 20 },
      { name: 'Moules de bouchot', quantity: 0.15, unit: 'kg', wastePercent: 20 },
      { name: 'Tomate', quantity: 0.15, unit: 'kg', wastePercent: 10 },
      { name: 'Pomme de terre', quantity: 0.1, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Risotto aux champignons', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 17, suggestedPrepTime: 10, suggestedCookTime: 25,
    description: 'Risotto crémeux aux champignons de Paris et cèpes, parmesan',
    suggestedIngredients: [
      { name: 'Riz arborio', quantity: 0.1, unit: 'kg', wastePercent: 0 },
      { name: 'Champignons de Paris', quantity: 0.12, unit: 'kg', wastePercent: 10 },
      { name: 'Cèpes', quantity: 0.03, unit: 'kg', wastePercent: 10 },
      { name: 'Parmesan AOP', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Vin blanc sec', quantity: 0.05, unit: 'L', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Burger gourmet', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 16, suggestedPrepTime: 15, suggestedCookTime: 15,
    description: 'Burger boeuf artisanal, cheddar, tomate, salade et frites maison',
    suggestedIngredients: [
      { name: 'Steak haché 15%', quantity: 0.18, unit: 'kg', wastePercent: 0 },
      { name: 'Pain burger', quantity: 1, unit: 'pièce', wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Tomate', quantity: 0.05, unit: 'kg', wastePercent: 10 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Cassoulet', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 18, suggestedPrepTime: 30, suggestedCookTime: 120,
    description: 'Cassoulet traditionnel, saucisse de Toulouse et confit de canard',
    suggestedIngredients: [
      { name: 'Saucisse de Toulouse', quantity: 0.15, unit: 'kg', wastePercent: 0 },
      { name: 'Cuisse de canard confite', quantity: 0.5, unit: 'pièce', wastePercent: 5 },
      { name: 'Haricots blancs secs', quantity: 0.12, unit: 'kg', wastePercent: 0 },
      { name: 'Tomate', quantity: 0.08, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Souris d\'agneau confite', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 22, suggestedPrepTime: 20, suggestedCookTime: 180,
    description: 'Souris d\'agneau confite 3h, légumes fondants et jus réduit',
    suggestedIngredients: [
      { name: 'Souris d\'agneau', quantity: 1, unit: 'pièce', wastePercent: 10 },
      { name: 'Carotte', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Oignon jaune', quantity: 0.05, unit: 'kg', wastePercent: 10 },
      { name: 'Vin rouge', quantity: 0.1, unit: 'L', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.2, unit: 'kg', wastePercent: 10 },
    ],
  },
  {
    name: 'Lasagne', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 14, suggestedPrepTime: 30, suggestedCookTime: 40,
    description: 'Lasagne bolognaise maison, béchamel et fromage gratiné',
    suggestedIngredients: [
      { name: 'Steak haché 15%', quantity: 0.15, unit: 'kg', wastePercent: 0 },
      { name: 'Feuilles de lasagne', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Tomate', quantity: 0.2, unit: 'kg', wastePercent: 10 },
      { name: 'Fromage râpé (emmental)', quantity: 0.06, unit: 'kg', wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.15, unit: 'L', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Hachis parmentier', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 14, suggestedPrepTime: 20, suggestedCookTime: 30,
    description: 'Hachis parmentier gratinée, viande hachée et purée maison',
    suggestedIngredients: [
      { name: 'Steak haché 15%', quantity: 0.18, unit: 'kg', wastePercent: 0 },
      { name: 'Pomme de terre', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Oignon jaune', quantity: 0.05, unit: 'kg', wastePercent: 10 },
      { name: 'Fromage râpé (emmental)', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Ratatouille', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 13, suggestedPrepTime: 25, suggestedCookTime: 40,
    description: 'Ratatouille provençale aux légumes du soleil',
    suggestedIngredients: [
      { name: 'Courgette', quantity: 0.15, unit: 'kg', wastePercent: 10 },
      { name: 'Aubergine', quantity: 0.12, unit: 'kg', wastePercent: 10 },
      { name: 'Poivron rouge', quantity: 0.1, unit: 'kg', wastePercent: 15 },
      { name: 'Tomate', quantity: 0.2, unit: 'kg', wastePercent: 10 },
      { name: 'Oignon jaune', quantity: 0.05, unit: 'kg', wastePercent: 10 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.03, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Tajine de poulet', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 16, suggestedPrepTime: 20, suggestedCookTime: 60,
    description: 'Tajine de poulet au citron confit et olives, semoule',
    suggestedIngredients: [
      { name: 'Cuisse de poulet', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Citron', quantity: 0.05, unit: 'kg', wastePercent: 20 },
      { name: 'Oignon jaune', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Semoule de couscous', quantity: 0.1, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Couscous royal', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 18, suggestedPrepTime: 30, suggestedCookTime: 60,
    description: 'Couscous royal 3 viandes, légumes et bouillon parfumé',
    suggestedIngredients: [
      { name: 'Cuisse de poulet', quantity: 0.15, unit: 'kg', wastePercent: 10 },
      { name: 'Saucisse de Toulouse', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Épaule d\'agneau', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Carotte', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Courgette', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Semoule de couscous', quantity: 0.12, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Escalope de veau à la crème', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 21, suggestedPrepTime: 10, suggestedCookTime: 20,
    description: 'Escalope de veau poêlée, sauce crème et champignons, riz',
    suggestedIngredients: [
      { name: 'Veau (escalope)', quantity: 0.18, unit: 'kg', wastePercent: 5 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.1, unit: 'L', wastePercent: 0 },
      { name: 'Champignons de Paris', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Riz basmati', quantity: 0.08, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Filet de bar', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 24, suggestedPrepTime: 10, suggestedCookTime: 15,
    description: 'Filet de bar poêlé, beurre citronné, épinards et pommes de terre',
    suggestedIngredients: [
      { name: 'Bar (filet)', quantity: 0.18, unit: 'kg', wastePercent: 5 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Citron', quantity: 0.03, unit: 'kg', wastePercent: 20 },
      { name: 'Épinards frais', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Pomme de terre', quantity: 0.15, unit: 'kg', wastePercent: 10 },
    ],
  },

  // =============================================
  // DESSERTS (12)
  // =============================================
  {
    name: 'Crème brûlée', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 8, suggestedPrepTime: 15, suggestedCookTime: 45,
    description: 'Crème brûlée à la vanille, caramélisée au chalumeau',
    suggestedIngredients: [
      { name: 'Crème liquide 35%', quantity: 0.15, unit: 'L', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Vanille (gousse)', quantity: 0.5, unit: 'pièce', wastePercent: 0 },
    ],
  },
  {
    name: 'Mousse au chocolat', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 7, suggestedPrepTime: 20, suggestedCookTime: 0,
    description: 'Mousse au chocolat noir intense, légère et aérienne',
    suggestedIngredients: [
      { name: 'Chocolat noir 70%', quantity: 0.06, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.01, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Fondant au chocolat', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 9, suggestedPrepTime: 15, suggestedCookTime: 12,
    description: 'Fondant au chocolat noir, cœur coulant',
    suggestedIngredients: [
      { name: 'Chocolat noir 70%', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.05, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Farine de blé T55', quantity: 0.02, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Tarte tatin', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 8, suggestedPrepTime: 20, suggestedCookTime: 35,
    description: 'Tarte tatin aux pommes caramélisées, crème fraîche',
    suggestedIngredients: [
      { name: 'Pomme Golden', quantity: 0.2, unit: 'kg', wastePercent: 15 },
      { name: 'Pâte feuilletée', quantity: 0.08, unit: 'kg', wastePercent: 5 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.04, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Tarte au citron meringuée', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 8.5, suggestedPrepTime: 30, suggestedCookTime: 25,
    description: 'Tarte au citron meringuée, pâte sablée et meringue italienne',
    suggestedIngredients: [
      { name: 'Pâte sablée', quantity: 0.08, unit: 'kg', wastePercent: 5 },
      { name: 'Citron', quantity: 0.1, unit: 'kg', wastePercent: 20 },
      { name: 'Oeufs (calibre L)', quantity: 3, unit: 'pièce', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.04, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Tiramisu', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 8, suggestedPrepTime: 25, suggestedCookTime: 0,
    description: 'Tiramisu classique au mascarpone et café, saupoudré de cacao',
    suggestedIngredients: [
      { name: 'Mascarpone', quantity: 0.1, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Biscuits cuillère', quantity: 0.05, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Panna cotta', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 7.5, suggestedPrepTime: 15, suggestedCookTime: 5,
    description: 'Panna cotta vanille, coulis de framboise',
    suggestedIngredients: [
      { name: 'Crème liquide 35%', quantity: 0.15, unit: 'L', wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.05, unit: 'L', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Framboise', quantity: 0.04, unit: 'kg', wastePercent: 5 },
    ],
  },
  {
    name: 'Profiteroles', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 9, suggestedPrepTime: 30, suggestedCookTime: 25,
    description: 'Choux garnis de glace vanille, sauce chocolat chaud',
    suggestedIngredients: [
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Farine de blé T55', quantity: 0.05, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Chocolat noir 70%', quantity: 0.06, unit: 'kg', wastePercent: 0 },
      { name: 'Crème liquide 35%', quantity: 0.1, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Île flottante', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 7, suggestedPrepTime: 20, suggestedCookTime: 15,
    description: 'Blancs en neige pochés sur crème anglaise vanille et caramel',
    suggestedIngredients: [
      { name: 'Oeufs (calibre L)', quantity: 3, unit: 'pièce', wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.25, unit: 'L', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.06, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Crêpes Suzette', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 9, suggestedPrepTime: 15, suggestedCookTime: 15,
    description: 'Crêpes flambées au Grand Marnier, sauce orange et beurre',
    suggestedIngredients: [
      { name: 'Farine de blé T55', quantity: 0.06, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.15, unit: 'L', wastePercent: 0 },
      { name: 'Orange', quantity: 0.1, unit: 'kg', wastePercent: 20 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Cheesecake', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 8.5, suggestedPrepTime: 20, suggestedCookTime: 40,
    description: 'Cheesecake new-yorkais, base sablée et coulis de fraise',
    suggestedIngredients: [
      { name: 'Fromage blanc', quantity: 0.15, unit: 'kg', wastePercent: 0 },
      { name: 'Mascarpone', quantity: 0.05, unit: 'kg', wastePercent: 0 },
      { name: 'Oeufs (calibre L)', quantity: 2, unit: 'pièce', wastePercent: 0 },
      { name: 'Sucre en poudre', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Fraise', quantity: 0.05, unit: 'kg', wastePercent: 5 },
    ],
  },
  {
    name: 'Salade de fruits frais', category: 'Dessert', nbPortions: 1, suggestedSellingPrice: 7, suggestedPrepTime: 15, suggestedCookTime: 0,
    description: 'Salade de fruits frais de saison, sirop au citron vert',
    suggestedIngredients: [
      { name: 'Fraise', quantity: 0.05, unit: 'kg', wastePercent: 5 },
      { name: 'Mangue', quantity: 0.3, unit: 'pièce', wastePercent: 30 },
      { name: 'Banane', quantity: 0.08, unit: 'kg', wastePercent: 15 },
      { name: 'Orange', quantity: 0.08, unit: 'kg', wastePercent: 20 },
    ],
  },

  // =============================================
  // ACCOMPAGNEMENTS (7)
  // =============================================
  {
    name: 'Purée de pommes de terre', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 4, suggestedPrepTime: 15, suggestedCookTime: 25,
    description: 'Purée de pommes de terre maison au beurre',
    suggestedIngredients: [
      { name: 'Pomme de terre', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Lait entier', quantity: 0.08, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Gratin dauphinois', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 5, suggestedPrepTime: 20, suggestedCookTime: 45,
    description: 'Gratin dauphinois crémeux à l\'ail et muscade',
    suggestedIngredients: [
      { name: 'Pomme de terre', quantity: 0.25, unit: 'kg', wastePercent: 10 },
      { name: 'Crème liquide 35%', quantity: 0.12, unit: 'L', wastePercent: 0 },
      { name: 'Fromage râpé (emmental)', quantity: 0.04, unit: 'kg', wastePercent: 0 },
      { name: 'Ail', quantity: 0.005, unit: 'kg', wastePercent: 15 },
    ],
  },
  {
    name: 'Frites maison', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 4, suggestedPrepTime: 15, suggestedCookTime: 10,
    description: 'Frites maison croustillantes, double cuisson',
    suggestedIngredients: [
      { name: 'Pomme de terre', quantity: 0.3, unit: 'kg', wastePercent: 10 },
      { name: 'Huile de tournesol', quantity: 0.1, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Riz pilaf', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 3.5, suggestedPrepTime: 5, suggestedCookTime: 18,
    description: 'Riz basmati pilaf aux oignons',
    suggestedIngredients: [
      { name: 'Riz basmati', quantity: 0.08, unit: 'kg', wastePercent: 0 },
      { name: 'Oignon jaune', quantity: 0.03, unit: 'kg', wastePercent: 10 },
      { name: 'Beurre doux', quantity: 0.01, unit: 'kg', wastePercent: 0 },
    ],
  },
  {
    name: 'Légumes grillés', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 4.5, suggestedPrepTime: 10, suggestedCookTime: 15,
    description: 'Légumes du soleil grillés à l\'huile d\'olive et thym',
    suggestedIngredients: [
      { name: 'Courgette', quantity: 0.1, unit: 'kg', wastePercent: 10 },
      { name: 'Poivron rouge', quantity: 0.08, unit: 'kg', wastePercent: 15 },
      { name: 'Aubergine', quantity: 0.08, unit: 'kg', wastePercent: 10 },
      { name: 'Huile d\'olive extra vierge', quantity: 0.02, unit: 'L', wastePercent: 0 },
    ],
  },
  {
    name: 'Haricots verts au beurre', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 4, suggestedPrepTime: 5, suggestedCookTime: 10,
    description: 'Haricots verts frais sautés au beurre et ail',
    suggestedIngredients: [
      { name: 'Haricots verts', quantity: 0.15, unit: 'kg', wastePercent: 5 },
      { name: 'Beurre doux', quantity: 0.02, unit: 'kg', wastePercent: 0 },
      { name: 'Ail', quantity: 0.003, unit: 'kg', wastePercent: 15 },
    ],
  },
  {
    name: 'Épinards à la crème', category: 'Accompagnement', nbPortions: 1, suggestedSellingPrice: 4.5, suggestedPrepTime: 5, suggestedCookTime: 10,
    description: 'Épinards frais à la crème, ail et muscade',
    suggestedIngredients: [
      { name: 'Épinards frais', quantity: 0.2, unit: 'kg', wastePercent: 10 },
      { name: 'Crème fraîche épaisse 30%', quantity: 0.05, unit: 'L', wastePercent: 0 },
      { name: 'Ail', quantity: 0.003, unit: 'kg', wastePercent: 15 },
    ],
  },
  {
    name: 'Entrecôte grillée', category: 'Plat', nbPortions: 1, suggestedSellingPrice: 24, suggestedPrepTime: 5, suggestedCookTime: 15,
    description: 'Entrecôte grillée, beurre d\'herbes, légumes de saison',
    suggestedIngredients: [
      { name: 'Entrecôte de boeuf', quantity: 0.3, unit: 'kg', wastePercent: 5 },
      { name: 'Beurre doux', quantity: 0.03, unit: 'kg', wastePercent: 0 },
      { name: 'Haricots verts', quantity: 0.1, unit: 'kg', wastePercent: 5 },
    ],
  },
];

// Search function for autocomplete
export function searchTemplates(query: string): RecipeTemplate[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return recipeTemplates.filter((t) => {
    const name = t.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return name.includes(q) || q.split(' ').every((word) => name.includes(word));
  }).slice(0, 8);
}

// Get all templates grouped by category
export function getTemplatesByCategory(): Record<string, RecipeTemplate[]> {
  const grouped: Record<string, RecipeTemplate[]> = {};
  for (const t of recipeTemplates) {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  }
  return grouped;
}

// Category display order for the template library
export const TEMPLATE_CATEGORY_ORDER = ['Entrée', 'Plat', 'Dessert', 'Accompagnement', 'Boisson'] as const;

// =============================================
// RECIPE PACKS — Cuisine-based starter packs
// =============================================

export interface PackIngredient {
  name: string;
  quantity: number;
  unit: string;
  wastePercent: number;
  pricePerUnit: number; // price per bulk unit (kg, L, piece)
  category: string;
}

export interface PackRecipe {
  name: string;
  category: 'Entrée' | 'Plat' | 'Dessert' | 'Boisson' | 'Accompagnement';
  sellingPrice: number;
  nbPortions: number;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: PackIngredient[];
}

export interface RecipePack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cuisine: string;
  recipes: PackRecipe[];
}

export const recipePacks: RecipePack[] = [
  // ── Pack Brasserie Francaise ──────────────────────────────────────
  {
    id: 'brasserie-francaise',
    name: 'Brasserie Francaise',
    emoji: '🇫🇷',
    description: 'Les classiques incontournables de la brasserie : steak frites, croque monsieur, salade nicoise et plus.',
    cuisine: 'Francaise',
    recipes: [
      {
        name: 'Steak frites',
        category: 'Plat',
        sellingPrice: 18,
        nbPortions: 1,
        description: 'Steak de boeuf grille accompagne de frites maison et salade verte',
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        ingredients: [
          { name: 'Steak de boeuf (bavette)', quantity: 0.2, unit: 'kg', wastePercent: 5, pricePerUnit: 22, category: 'Viandes' },
          { name: 'Pomme de terre (frites)', quantity: 0.25, unit: 'kg', wastePercent: 15, pricePerUnit: 1.5, category: 'Legumes' },
          { name: 'Salade verte (batavia)', quantity: 0.5, unit: 'piece', wastePercent: 15, pricePerUnit: 1.2, category: 'Legumes' },
          { name: 'Sauce poivre (maison)', quantity: 0.04, unit: 'L', wastePercent: 0, pricePerUnit: 8, category: 'Sauces' },
        ],
      },
      {
        name: 'Croque monsieur',
        category: 'Plat',
        sellingPrice: 11,
        nbPortions: 1,
        description: 'Croque monsieur gratine au gruyere avec bechamel maison',
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
        ingredients: [
          { name: 'Pain de mie (tranches)', quantity: 2, unit: 'piece', wastePercent: 0, pricePerUnit: 0.15, category: 'Boulangerie' },
          { name: 'Jambon blanc (tranche)', quantity: 2, unit: 'piece', wastePercent: 0, pricePerUnit: 0.45, category: 'Charcuterie' },
          { name: 'Gruyere rape', quantity: 0.06, unit: 'kg', wastePercent: 0, pricePerUnit: 14, category: 'Produits laitiers' },
          { name: 'Bechamel (maison)', quantity: 0.05, unit: 'L', wastePercent: 0, pricePerUnit: 4, category: 'Sauces' },
        ],
      },
      {
        name: 'Salade nicoise',
        category: 'Entrée',
        sellingPrice: 14,
        nbPortions: 1,
        description: 'Salade composee : thon, oeufs durs, olives noires, haricots verts et vinaigrette',
        prepTimeMinutes: 20,
        cookTimeMinutes: 10,
        ingredients: [
          { name: 'Thon en boite (miettes)', quantity: 0.1, unit: 'kg', wastePercent: 0, pricePerUnit: 18, category: 'Poissons' },
          { name: 'Oeufs (calibre L)', quantity: 2, unit: 'piece', wastePercent: 0, pricePerUnit: 0.35, category: 'Produits laitiers' },
          { name: 'Olives noires', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 8, category: 'Epicerie' },
          { name: 'Haricots verts', quantity: 0.1, unit: 'kg', wastePercent: 5, pricePerUnit: 4.5, category: 'Legumes' },
        ],
      },
      {
        name: 'Soupe a l\'oignon gratinee',
        category: 'Entrée',
        sellingPrice: 9,
        nbPortions: 1,
        description: 'Soupe traditionnelle a l\'oignon avec croutons et gruyere gratine',
        prepTimeMinutes: 15,
        cookTimeMinutes: 45,
        ingredients: [
          { name: 'Oignon jaune', quantity: 0.3, unit: 'kg', wastePercent: 10, pricePerUnit: 1.8, category: 'Legumes' },
          { name: 'Bouillon de boeuf', quantity: 0.4, unit: 'L', wastePercent: 0, pricePerUnit: 3, category: 'Epicerie' },
          { name: 'Gruyere rape', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 14, category: 'Produits laitiers' },
          { name: 'Pain de campagne', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 4, category: 'Boulangerie' },
        ],
      },
      {
        name: 'Tarte tatin',
        category: 'Dessert',
        sellingPrice: 10,
        nbPortions: 1,
        description: 'Tarte aux pommes caramelisees renversee, pate feuilletee maison',
        prepTimeMinutes: 25,
        cookTimeMinutes: 35,
        ingredients: [
          { name: 'Pomme (Golden)', quantity: 0.25, unit: 'kg', wastePercent: 15, pricePerUnit: 3, category: 'Fruits' },
          { name: 'Pate feuilletee', quantity: 0.12, unit: 'kg', wastePercent: 5, pricePerUnit: 6, category: 'Boulangerie' },
          { name: 'Beurre doux', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 10, category: 'Produits laitiers' },
          { name: 'Sucre en poudre', quantity: 0.06, unit: 'kg', wastePercent: 0, pricePerUnit: 1.5, category: 'Epicerie' },
        ],
      },
    ],
  },

  // ── Pack Pizzeria ─────────────────────────────────────────────────
  {
    id: 'pizzeria',
    name: 'Pizzeria',
    emoji: '🍕',
    description: 'Pizzas artisanales, tiramisu et bruschetta : le meilleur de la cuisine italienne.',
    cuisine: 'Italienne',
    recipes: [
      {
        name: 'Pizza Margherita',
        category: 'Plat',
        sellingPrice: 12,
        nbPortions: 1,
        description: 'Pizza classique : sauce tomate, mozzarella et basilic frais',
        prepTimeMinutes: 15,
        cookTimeMinutes: 12,
        ingredients: [
          { name: 'Pate a pizza (boule)', quantity: 0.25, unit: 'kg', wastePercent: 5, pricePerUnit: 2.5, category: 'Boulangerie' },
          { name: 'Sauce tomate (pizza)', quantity: 0.08, unit: 'L', wastePercent: 0, pricePerUnit: 3, category: 'Sauces' },
          { name: 'Mozzarella (fior di latte)', quantity: 0.125, unit: 'kg', wastePercent: 0, pricePerUnit: 9, category: 'Produits laitiers' },
          { name: 'Basilic frais', quantity: 0.005, unit: 'kg', wastePercent: 20, pricePerUnit: 30, category: 'Herbes' },
        ],
      },
      {
        name: 'Pizza 4 Fromages',
        category: 'Plat',
        sellingPrice: 15,
        nbPortions: 1,
        description: 'Pizza gourmande : mozzarella, gorgonzola, chevre et parmesan',
        prepTimeMinutes: 15,
        cookTimeMinutes: 12,
        ingredients: [
          { name: 'Pate a pizza (boule)', quantity: 0.25, unit: 'kg', wastePercent: 5, pricePerUnit: 2.5, category: 'Boulangerie' },
          { name: 'Sauce tomate (pizza)', quantity: 0.06, unit: 'L', wastePercent: 0, pricePerUnit: 3, category: 'Sauces' },
          { name: 'Mozzarella (fior di latte)', quantity: 0.07, unit: 'kg', wastePercent: 0, pricePerUnit: 9, category: 'Produits laitiers' },
          { name: 'Gorgonzola', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 16, category: 'Produits laitiers' },
          { name: 'Chevre frais', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 12, category: 'Produits laitiers' },
          { name: 'Parmesan AOP', quantity: 0.02, unit: 'kg', wastePercent: 0, pricePerUnit: 28, category: 'Produits laitiers' },
        ],
      },
      {
        name: 'Calzone',
        category: 'Plat',
        sellingPrice: 14,
        nbPortions: 1,
        description: 'Pizza pliee garnie de jambon, champignons et mozzarella',
        prepTimeMinutes: 15,
        cookTimeMinutes: 15,
        ingredients: [
          { name: 'Pate a pizza (boule)', quantity: 0.28, unit: 'kg', wastePercent: 5, pricePerUnit: 2.5, category: 'Boulangerie' },
          { name: 'Sauce tomate (pizza)', quantity: 0.06, unit: 'L', wastePercent: 0, pricePerUnit: 3, category: 'Sauces' },
          { name: 'Jambon blanc (tranche)', quantity: 3, unit: 'piece', wastePercent: 0, pricePerUnit: 0.45, category: 'Charcuterie' },
          { name: 'Champignons de Paris', quantity: 0.08, unit: 'kg', wastePercent: 10, pricePerUnit: 5, category: 'Legumes' },
          { name: 'Mozzarella (fior di latte)', quantity: 0.1, unit: 'kg', wastePercent: 0, pricePerUnit: 9, category: 'Produits laitiers' },
        ],
      },
      {
        name: 'Tiramisu',
        category: 'Dessert',
        sellingPrice: 9,
        nbPortions: 1,
        description: 'Dessert italien au mascarpone, cafe expresso et cacao',
        prepTimeMinutes: 20,
        cookTimeMinutes: 0,
        ingredients: [
          { name: 'Mascarpone', quantity: 0.08, unit: 'kg', wastePercent: 0, pricePerUnit: 10, category: 'Produits laitiers' },
          { name: 'Cafe expresso (liquide)', quantity: 0.05, unit: 'L', wastePercent: 0, pricePerUnit: 15, category: 'Boissons' },
          { name: 'Biscuits cuillere', quantity: 0.04, unit: 'kg', wastePercent: 0, pricePerUnit: 8, category: 'Epicerie' },
          { name: 'Cacao en poudre', quantity: 0.005, unit: 'kg', wastePercent: 0, pricePerUnit: 18, category: 'Epicerie' },
        ],
      },
      {
        name: 'Bruschetta',
        category: 'Entrée',
        sellingPrice: 8,
        nbPortions: 1,
        description: 'Tartines de pain grille garnies de tomates, ail et basilic a l\'huile d\'olive',
        prepTimeMinutes: 10,
        cookTimeMinutes: 5,
        ingredients: [
          { name: 'Pain ciabatta', quantity: 0.1, unit: 'kg', wastePercent: 0, pricePerUnit: 5, category: 'Boulangerie' },
          { name: 'Tomate', quantity: 0.15, unit: 'kg', wastePercent: 10, pricePerUnit: 3.5, category: 'Legumes' },
          { name: 'Ail (gousse)', quantity: 2, unit: 'piece', wastePercent: 10, pricePerUnit: 0.1, category: 'Legumes' },
          { name: 'Basilic frais', quantity: 0.005, unit: 'kg', wastePercent: 20, pricePerUnit: 30, category: 'Herbes' },
          { name: 'Huile d\'olive extra vierge', quantity: 0.02, unit: 'L', wastePercent: 0, pricePerUnit: 12, category: 'Epicerie' },
        ],
      },
    ],
  },

  // ── Pack Burger ───────────────────────────────────────────────────
  {
    id: 'burger',
    name: 'Burger',
    emoji: '🍔',
    description: 'Burgers gourmands, frites maison et milkshake : le trio gagnant du fast casual.',
    cuisine: 'Americaine',
    recipes: [
      {
        name: 'Classic Burger',
        category: 'Plat',
        sellingPrice: 14,
        nbPortions: 1,
        description: 'Burger boeuf 150g, salade, tomate, oignon et sauce maison',
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
        ingredients: [
          { name: 'Pain burger (bun)', quantity: 1, unit: 'piece', wastePercent: 0, pricePerUnit: 0.6, category: 'Boulangerie' },
          { name: 'Steak hache boeuf (150g)', quantity: 1, unit: 'piece', wastePercent: 0, pricePerUnit: 1.8, category: 'Viandes' },
          { name: 'Salade verte (feuilles)', quantity: 0.02, unit: 'kg', wastePercent: 15, pricePerUnit: 6, category: 'Legumes' },
          { name: 'Tomate', quantity: 0.06, unit: 'kg', wastePercent: 10, pricePerUnit: 3.5, category: 'Legumes' },
          { name: 'Oignon rouge', quantity: 0.03, unit: 'kg', wastePercent: 10, pricePerUnit: 2.5, category: 'Legumes' },
        ],
      },
      {
        name: 'Chicken Burger',
        category: 'Plat',
        sellingPrice: 13,
        nbPortions: 1,
        description: 'Burger au poulet croustillant, salade et sauce moutarde-miel',
        prepTimeMinutes: 10,
        cookTimeMinutes: 12,
        ingredients: [
          { name: 'Pain burger (bun)', quantity: 1, unit: 'piece', wastePercent: 0, pricePerUnit: 0.6, category: 'Boulangerie' },
          { name: 'Filet de poulet (pane)', quantity: 0.15, unit: 'kg', wastePercent: 5, pricePerUnit: 9, category: 'Viandes' },
          { name: 'Salade verte (feuilles)', quantity: 0.02, unit: 'kg', wastePercent: 15, pricePerUnit: 6, category: 'Legumes' },
          { name: 'Sauce moutarde-miel', quantity: 0.03, unit: 'L', wastePercent: 0, pricePerUnit: 6, category: 'Sauces' },
        ],
      },
      {
        name: 'Veggie Burger',
        category: 'Plat',
        sellingPrice: 13,
        nbPortions: 1,
        description: 'Burger vegetarien avec galette de legumes maison et salade',
        prepTimeMinutes: 15,
        cookTimeMinutes: 12,
        ingredients: [
          { name: 'Pain burger (bun)', quantity: 1, unit: 'piece', wastePercent: 0, pricePerUnit: 0.6, category: 'Boulangerie' },
          { name: 'Galette legumes (maison)', quantity: 1, unit: 'piece', wastePercent: 0, pricePerUnit: 1.2, category: 'Legumes' },
          { name: 'Salade verte (feuilles)', quantity: 0.02, unit: 'kg', wastePercent: 15, pricePerUnit: 6, category: 'Legumes' },
        ],
      },
      {
        name: 'Frites maison',
        category: 'Accompagnement',
        sellingPrice: 5,
        nbPortions: 1,
        description: 'Frites maison croustillantes, pommes de terre fraiches',
        prepTimeMinutes: 10,
        cookTimeMinutes: 8,
        ingredients: [
          { name: 'Pomme de terre (frites)', quantity: 0.2, unit: 'kg', wastePercent: 15, pricePerUnit: 1.5, category: 'Legumes' },
          { name: 'Huile de friture', quantity: 0.05, unit: 'L', wastePercent: 0, pricePerUnit: 3, category: 'Epicerie' },
          { name: 'Sel fin', quantity: 0.003, unit: 'kg', wastePercent: 0, pricePerUnit: 1, category: 'Epicerie' },
        ],
      },
      {
        name: 'Milkshake vanille',
        category: 'Boisson',
        sellingPrice: 7,
        nbPortions: 1,
        description: 'Milkshake onctueux a la vanille avec glace artisanale',
        prepTimeMinutes: 5,
        cookTimeMinutes: 0,
        ingredients: [
          { name: 'Lait entier', quantity: 0.2, unit: 'L', wastePercent: 0, pricePerUnit: 1.2, category: 'Produits laitiers' },
          { name: 'Glace vanille', quantity: 0.1, unit: 'kg', wastePercent: 0, pricePerUnit: 12, category: 'Desserts' },
          { name: 'Sirop de vanille', quantity: 0.02, unit: 'L', wastePercent: 0, pricePerUnit: 15, category: 'Boissons' },
        ],
      },
    ],
  },
];
