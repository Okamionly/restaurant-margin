export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  pricePerUnit: number;
  supplier: string | null;
  category: string;
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  wastePercent: number;
  ingredient: Ingredient;
}

export interface MarginData {
  foodCost: number;
  costPerPortion: number;
  laborCostPerPortion: number;
  totalCostPerPortion: number;
  marginAmount: number;
  marginPercent: number;
  coefficient: number;
}

export interface Recipe {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  description: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  laborCostPerHour: number;
  ingredients: RecipeIngredient[];
  margin: MarginData;
  createdAt: string;
  updatedAt: string;
}

export const ALLERGENS = [
  'Gluten',
  'Crustacés',
  'Oeufs',
  'Poissons',
  'Arachides',
  'Soja',
  'Lait',
  'Fruits à coque',
  'Céleri',
  'Moutarde',
  'Sésame',
  'Sulfites',
  'Lupin',
  'Mollusques',
];

export const INGREDIENT_CATEGORIES = [
  'Viandes',
  'Poissons & Fruits de mer',
  'Légumes',
  'Fruits',
  'Produits laitiers',
  'Épices & Condiments',
  'Féculents & Céréales',
  'Huiles & Matières grasses',
  'Boissons',
  'Autres',
];

export const RECIPE_CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Boisson', 'Accompagnement'];

export const UNITS = ['kg', 'g', 'L', 'cL', 'mL', 'pièce', 'botte', 'barquette', 'sachet'];
