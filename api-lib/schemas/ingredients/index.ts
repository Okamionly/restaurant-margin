/**
 * @file api-lib/schemas/ingredients/index.ts
 * Zod schemas for ingredient endpoints.
 */
import { z } from 'zod';

export const createIngredientRequestSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(255),
  unit: z.string().min(1, 'Unité requise'),
  pricePerUnit: z.number().min(0, 'Prix doit être positif'),
  category: z.string().optional(),
  supplierId: z.number().int().optional(),
});

export const patchIngredientRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  unit: z.string().min(1).optional(),
  pricePerUnit: z.number().min(0).optional(),
  category: z.string().optional(),
  supplierId: z.number().int().nullable().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ requis pour la mise à jour' }
);

export const ingredientResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  unit: z.string(),
  pricePerUnit: z.number(),
  category: z.string().nullable().optional(),
  supplierId: z.number().int().nullable().optional(),
  restaurantId: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const INGREDIENTS_IDEMPOTENCY = {
  create: 'none',
  patch: 'idempotent',
  delete: 'idempotent',
} as const;
