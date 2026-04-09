export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  plan?: string;
  emailVerified?: boolean;
  trialEndsAt?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  restaurantName?: string;
  invitationCode?: string;
  role?: string;
}

export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  region: string | null;
  country: string;
  siret: string | null;
  website: string | null;
  notes: string | null;
  categories: string[];
  contactName: string | null;
  delivery: boolean;
  minOrder: string | null;
  paymentTerms: string | null;
  whatsappPhone: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { ingredients: number };
  ingredients?: Pick<Ingredient, 'id' | 'name' | 'unit' | 'pricePerUnit' | 'category'>[];
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  pricePerUnit: number;
  supplier: string | null;
  supplierId: number | null;
  supplierRef?: { id: number; name: string } | null;
  category: string;
  allergens: string[];
  barcode?: string | null;
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
  photos?: string[];
  shareToken?: string | null;
  ingredients: RecipeIngredient[];
  margin: MarginData;
  createdAt: string;
  updatedAt: string;
}

export interface OptimizationSuggestion {
  type: 'substitution' | 'seasonal' | 'quantity' | 'supplier';
  ingredientName: string;
  currentCost: number;
  suggestion: string;
  alternativeName: string | null;
  estimatedNewCost: number;
  savingsPercent: number;
  reasoning: string;
  quality_impact: 'aucun' | 'minimal' | 'modere';
}

export interface RecipeOptimizationResult {
  recipe: {
    id: number;
    name: string;
    category: string;
    sellingPrice: number;
    nbPortions: number;
  };
  currentCost: number;
  costPerPortion: number;
  ingredients: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalCost: number;
    supplier: string;
  }[];
  optimization: {
    suggestions: OptimizationSuggestion[];
    currentTotalCost: number;
    optimizedTotalCost: number;
    totalSavingsEuros: number;
    totalSavingsPercent: number;
    summary: string;
  };
}

export interface InventoryItem {
  id: number;
  ingredientId: number;
  ingredient: Ingredient;
  currentStock: number;
  unit: string;
  minStock: number;
  maxStock: number | null;
  lastRestockDate: string | null;
  lastRestockQuantity: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryValue {
  totalValue: number;
  byCategory: { category: string; value: number }[];
  itemCount: number;
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
