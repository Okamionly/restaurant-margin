import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const recipesRouter = Router();

// Types for recipe with includes
interface RecipeIngredientWithDetails {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  wastePercent: number;
  ingredient: {
    id: number;
    name: string;
    unit: string;
    pricePerUnit: number;
    supplier: string | null;
    category: string;
    allergens: string[];
    createdAt: Date;
    updatedAt: Date;
  };
}

interface RecipeWithIngredients {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  laborCostPerHour: number;
  createdAt: Date;
  updatedAt: Date;
  ingredients: RecipeIngredientWithDetails[];
}

// Helper: calculate margin data for a recipe
function calculateMargin(recipe: RecipeWithIngredients) {
  // Food cost accounting for waste
  const foodCost = recipe.ingredients.reduce((total, ri) => {
    const wasteMultiplier = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
    return total + ri.quantity * ri.ingredient.pricePerUnit * wasteMultiplier;
  }, 0);

  const costPerPortion = recipe.nbPortions > 0 ? foodCost / recipe.nbPortions : foodCost;

  // Labor cost calculation
  const prepTime = recipe.prepTimeMinutes || 0;
  const cookTime = recipe.cookTimeMinutes || 0;
  const totalTimeHours = (prepTime + cookTime) / 60;
  const totalLaborCost = totalTimeHours * recipe.laborCostPerHour;
  const laborCostPerPortion = recipe.nbPortions > 0 ? totalLaborCost / recipe.nbPortions : totalLaborCost;

  // Total cost per portion
  const totalCostPerPortion = costPerPortion + laborCostPerPortion;

  const marginAmount = recipe.sellingPrice - totalCostPerPortion;
  const marginPercent = recipe.sellingPrice > 0 ? (marginAmount / recipe.sellingPrice) * 100 : 0;
  const coefficient = totalCostPerPortion > 0 ? recipe.sellingPrice / totalCostPerPortion : 0;

  return {
    foodCost: Math.round(foodCost * 100) / 100,
    costPerPortion: Math.round(costPerPortion * 100) / 100,
    laborCostPerPortion: Math.round(laborCostPerPortion * 100) / 100,
    totalCostPerPortion: Math.round(totalCostPerPortion * 100) / 100,
    marginAmount: Math.round(marginAmount * 100) / 100,
    marginPercent: Math.round(marginPercent * 10) / 10,
    coefficient: Math.round(coefficient * 100) / 100,
  };
}

// Helper: collect all allergens from recipe ingredients
function collectAllergens(recipe: RecipeWithIngredients): string[] {
  const allergenSet = new Set<string>();
  for (const ri of recipe.ingredients) {
    for (const allergen of ri.ingredient.allergens) {
      allergenSet.add(allergen);
    }
  }
  return Array.from(allergenSet).sort();
}

// Helper: format recipe response
function formatRecipeResponse(recipe: RecipeWithIngredients) {
  return {
    ...recipe,
    margin: calculateMargin(recipe),
    allergens: collectAllergens(recipe),
  };
}

const recipeInclude = {
  ingredients: {
    include: { ingredient: true },
  },
} as const;

// GET all recipes with margin data
recipesRouter.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: recipeInclude,
      orderBy: { name: 'asc' },
    });

    const recipesWithMargin = recipes.map((recipe) => formatRecipeResponse(recipe as RecipeWithIngredients));

    res.json(recipesWithMargin);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des recettes' });
  }
});

// GET single recipe with full details
recipesRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: recipeInclude,
    });
    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }
    res.json(formatRecipeResponse(recipe as RecipeWithIngredients));
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create recipe
recipesRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      sellingPrice,
      nbPortions,
      description,
      prepTimeMinutes,
      cookTimeMinutes,
      laborCostPerHour,
      ingredients,
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    const parsedPrice = parseFloat(sellingPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Le prix de vente doit être supérieur à 0' });
    }
    const parsedPortions = parseInt(nbPortions) || 1;
    if (parsedPortions <= 0) {
      return res.status(400).json({ error: 'Le nombre de portions doit être supérieur à 0' });
    }

    const recipe = await prisma.recipe.create({
      data: {
        name: name.trim(),
        category: category || '',
        sellingPrice: parsedPrice,
        nbPortions: parsedPortions,
        description: description || null,
        prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
        cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null,
        laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
        ingredients: {
          create:
            ingredients?.map(
              (ing: { ingredientId: number; quantity: number; wastePercent?: number }) => ({
                ingredientId: ing.ingredientId,
                quantity: ing.quantity,
                wastePercent: ing.wastePercent ?? 0,
              })
            ) || [],
        },
      },
      include: recipeInclude,
    });

    res.status(201).json(formatRecipeResponse(recipe as RecipeWithIngredients));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la recette' });
  }
});

// PUT update recipe
recipesRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      category,
      sellingPrice,
      nbPortions,
      description,
      prepTimeMinutes,
      cookTimeMinutes,
      laborCostPerHour,
      ingredients,
    } = req.body;
    const recipeId = parseInt(req.params.id);
    if (isNaN(recipeId)) return res.status(400).json({ error: 'ID invalide' });

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    const parsedPrice = parseFloat(sellingPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Le prix de vente doit être supérieur à 0' });
    }
    const parsedPortions = parseInt(nbPortions) || 1;
    if (parsedPortions <= 0) {
      return res.status(400).json({ error: 'Le nombre de portions doit être supérieur à 0' });
    }

    // Update recipe info
    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        name: name.trim(),
        category: category || '',
        sellingPrice: parsedPrice,
        nbPortions: parsedPortions,
        description: description || null,
        prepTimeMinutes: prepTimeMinutes != null ? parseInt(prepTimeMinutes) : null,
        cookTimeMinutes: cookTimeMinutes != null ? parseInt(cookTimeMinutes) : null,
        laborCostPerHour: laborCostPerHour != null ? parseFloat(laborCostPerHour) : 0,
      },
    });

    // Replace ingredients if provided
    if (ingredients) {
      await prisma.recipeIngredient.deleteMany({ where: { recipeId } });
      await prisma.recipeIngredient.createMany({
        data: ingredients.map(
          (ing: { ingredientId: number; quantity: number; wastePercent?: number }) => ({
            recipeId,
            ingredientId: ing.ingredientId,
            quantity: ing.quantity,
            wastePercent: ing.wastePercent ?? 0,
          })
        ),
      });
    }

    const updated = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: recipeInclude,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    res.json(formatRecipeResponse(updated as RecipeWithIngredients));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// POST clone recipe
recipesRouter.post('/:id/clone', async (req: AuthRequest, res: Response) => {
  try {
    const sourceId = parseInt(req.params.id);
    if (isNaN(sourceId)) return res.status(400).json({ error: 'ID invalide' });

    const source = await prisma.recipe.findUnique({
      where: { id: sourceId },
      include: recipeInclude,
    });

    if (!source) {
      return res.status(404).json({ error: 'Recette source non trouvée' });
    }

    const cloned = await prisma.recipe.create({
      data: {
        name: `${source.name} (copie)`,
        category: source.category,
        sellingPrice: source.sellingPrice,
        nbPortions: source.nbPortions,
        description: source.description,
        prepTimeMinutes: source.prepTimeMinutes,
        cookTimeMinutes: source.cookTimeMinutes,
        laborCostPerHour: source.laborCostPerHour,
        ingredients: {
          create: source.ingredients.map((ri) => ({
            ingredientId: ri.ingredientId,
            quantity: ri.quantity,
            wastePercent: ri.wastePercent,
          })),
        },
      },
      include: recipeInclude,
    });

    res.status(201).json(formatRecipeResponse(cloned as RecipeWithIngredients));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du clonage de la recette' });
  }
});

// DELETE recipe
recipesRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    await prisma.recipe.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
