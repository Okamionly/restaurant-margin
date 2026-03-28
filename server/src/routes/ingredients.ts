import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const ingredientsRouter = Router();

// GET all ingredients
ingredientsRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des ingrédients' });
  }
});

// GET ingredient usage count (how many recipes use each ingredient)
ingredientsRouter.get('/usage', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { recipes: true },
        },
      },
    });

    const result = ingredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      category: ing.category,
      usageCount: ing._count.recipes,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des usages' });
  }
});

// GET single ingredient
ingredientsRouter.get('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const ingredient = await prisma.ingredient.findFirst({
      where: { id, restaurantId: req.restaurantId! },
      include: {
        _count: {
          select: { recipes: true },
        },
      },
    });
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingrédient non trouvé' });
    }
    res.json({ ...ingredient, usageCount: ingredient._count.recipes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create ingredient
ingredientsRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { name, unit, pricePerUnit, supplier, category, allergens } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    if (!unit || !unit.trim()) {
      return res.status(400).json({ error: "L'unité est requise" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'La catégorie est requise' });
    }
    const parsedPrice = parseFloat(pricePerUnit);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Le prix unitaire doit être supérieur à 0' });
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        unit: unit.trim(),
        pricePerUnit: parsedPrice,
        supplier: supplier || null,
        category: category.trim(),
        allergens: Array.isArray(allergens) ? allergens : [],
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// PUT update ingredient
ingredientsRouter.put('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    // Verify ownership
    const existing = await prisma.ingredient.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });

    const { name, unit, pricePerUnit, supplier, category, allergens } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }
    if (!unit || !unit.trim()) {
      return res.status(400).json({ error: "L'unité est requise" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ error: 'La catégorie est requise' });
    }
    const parsedPrice = parseFloat(pricePerUnit);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Le prix unitaire doit être supérieur à 0' });
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        name: name.trim(),
        unit: unit.trim(),
        pricePerUnit: parsedPrice,
        supplier: supplier || null,
        category: category.trim(),
        allergens: Array.isArray(allergens) ? allergens : [],
      },
    });

    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// DELETE ingredient
ingredientsRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    // Verify ownership
    const existing = await prisma.ingredient.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Ingrédient non trouvé' });

    await prisma.ingredient.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
