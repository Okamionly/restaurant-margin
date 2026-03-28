import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate, createRestaurantSchema } from '../utils/validation';

const prisma = new PrismaClient();
const restaurantsRouter = Router();

// All routes use basic authMiddleware (not authWithRestaurant)

// GET /api/restaurants — list restaurants the user is a member of
restaurantsRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const memberships = await prisma.restaurantMember.findMany({
    where: { userId: req.user!.userId },
    include: {
      restaurant: {
        include: {
          _count: { select: { ingredients: true, recipes: true, suppliers: true } }
        }
      }
    },
  });
  res.json(memberships.map(m => ({ ...m.restaurant, role: m.role })));
});

// POST /api/restaurants — create a new restaurant
restaurantsRouter.post('/', authMiddleware, validate(createRestaurantSchema), async (req: AuthRequest, res: Response) => {
  const { name, address, cuisineType, phone, coversPerDay } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: 'Nom requis' }); return; }
  const restaurant = await prisma.restaurant.create({
    data: {
      name: name.trim(),
      address: address || null,
      cuisineType: cuisineType || null,
      phone: phone || null,
      coversPerDay: coversPerDay || 80,
      ownerId: req.user!.userId,
      members: { create: { userId: req.user!.userId, role: 'owner' } },
    },
  });
  res.status(201).json(restaurant);
});

// PUT /api/restaurants/:id — update (owner only)
restaurantsRouter.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id as string);
  const membership = await prisma.restaurantMember.findFirst({
    where: { userId: req.user!.userId, restaurantId: id, role: 'owner' },
  });
  if (!membership) { res.status(403).json({ error: 'Accès refusé' }); return; }
  const { name, address, cuisineType, phone, coversPerDay } = req.body;
  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      name: name || undefined,
      address: address ?? undefined,
      cuisineType: cuisineType ?? undefined,
      phone: phone ?? undefined,
      coversPerDay: coversPerDay ?? undefined,
    },
  });
  res.json(restaurant);
});

// DELETE /api/restaurants/:id — delete (owner only)
restaurantsRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id as string);
  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: req.user!.userId },
  });
  if (!restaurant) { res.status(403).json({ error: 'Accès refusé' }); return; }
  await prisma.restaurant.delete({ where: { id } });
  res.json({ success: true });
});

export default restaurantsRouter;
