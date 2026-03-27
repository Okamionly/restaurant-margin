import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const publicMenuRouter = Router();

// GET /api/public/menu - Public endpoint, no auth required
publicMenuRouter.get('/menu', async (_req: Request, res: Response) => {
  try {
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        sellingPrice: true,
        description: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        ingredients: {
          select: {
            ingredient: {
              select: {
                name: true,
                allergens: true,
              },
            },
          },
        },
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching public menu:', error);
    res.status(500).json({ error: 'Erreur lors du chargement du menu' });
  }
});
