import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Reusable validation middleware
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((e: z.ZodIssue) => e.message).join(', ');
      return res.status(400).json({ error: errors });
    }
    req.body = result.data;
    next();
  };
}

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Email invalide').transform(s => s.toLowerCase().trim()),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  email: z.string().email('Email invalide').transform(s => s.toLowerCase().trim()),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['chef', 'directeur']).optional().default('chef'),
  invitationCode: z.string().optional(),
  restaurantName: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Ingredient schemas
export const createIngredientSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(255),
  unit: z.string().min(1, 'Unité requise'),
  pricePerUnit: z.number().nonnegative('Le prix doit être positif'),
  supplier: z.string().optional().default(''),
  category: z.string().optional().default('Autre'),
  allergens: z.array(z.string()).optional().default([]),
});

// Recipe schemas
export const createRecipeSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(255),
  category: z.string().min(1, 'Catégorie requise'),
  sellingPrice: z.number().nonnegative(),
  nbPortions: z.number().int().positive().default(1),
  description: z.string().optional().default(''),
  prepTimeMinutes: z.number().int().nonnegative().optional().default(0),
  cookTimeMinutes: z.number().int().nonnegative().optional().default(0),
  laborCostPerHour: z.number().nonnegative().optional().default(0),
  ingredients: z.array(z.object({
    ingredientId: z.number().int().positive(),
    quantity: z.number().positive(),
    wastePercent: z.number().min(0).max(100).optional().default(0),
  })),
});

// Supplier schemas
export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(255),
  contact: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  address: z.string().optional().default(''),
  siret: z.string().optional().default(''),
  category: z.string().optional().default('Général'),
  notes: z.string().optional().default(''),
  deliveryDays: z.string().optional().default(''),
  minOrder: z.number().nonnegative().optional().default(0),
  paymentTerms: z.string().optional().default(''),
});

// Contact schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100),
  email: z.string().email('Email invalide'),
  phone: z.string().optional().default(''),
  message: z.string().optional().default(''),
  source: z.string().optional().default('contact'),
});

// Inventory schemas
export const addInventorySchema = z.object({
  ingredientId: z.number().int().positive(),
  currentStock: z.number().nonnegative().optional().default(0),
  unit: z.string().optional().default(''),
  minStock: z.number().nonnegative().optional().default(0),
  maxStock: z.number().nonnegative().nullable().optional(),
  notes: z.string().optional().default(''),
});

// Restaurant schemas
export const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(255),
  address: z.string().optional().default(''),
  cuisineType: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  coversPerDay: z.number().int().positive().optional().default(80),
});
