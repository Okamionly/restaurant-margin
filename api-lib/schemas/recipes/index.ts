/**
 * @file api-lib/schemas/recipes/index.ts
 * Zod schemas for recipe endpoints.
 */
import { z } from 'zod';

export const createRecipeRequestSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(255),
  sellingPrice: z.number().min(0, 'Prix de vente doit être positif'),
  description: z.string().optional(),
  nbPortions: z.number().int().min(1).optional(),
  prepTimeMinutes: z.number().int().min(0).optional(),
  cookTimeMinutes: z.number().int().min(0).optional(),
  laborCostPerHour: z.number().min(0).optional(),
  category: z.string().optional(),
});

export const patchRecipeRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  sellingPrice: z.number().min(0).optional(),
  description: z.string().optional(),
  nbPortions: z.number().int().min(1).optional(),
  prepTimeMinutes: z.number().int().min(0).optional(),
  cookTimeMinutes: z.number().int().min(0).optional(),
  laborCostPerHour: z.number().min(0).optional(),
  category: z.string().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ requis pour la mise à jour' }
);

export const recipeResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable().optional(),
  sellingPrice: z.number(),
  nbPortions: z.number().int().optional(),
  prepTimeMinutes: z.number().int().optional(),
  cookTimeMinutes: z.number().int().optional(),
  laborCostPerHour: z.number().optional(),
  restaurantId: z.number().int(),
  category: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RECIPES_IDEMPOTENCY = {
  create: 'none',
  patch: 'idempotent',
  delete: 'idempotent',
} as const;
