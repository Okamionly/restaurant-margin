/**
 * @file api-lib/schemas/auth/index.ts
 * Zod schemas for auth endpoints — login, register, forgot/reset password.
 * idempotency: login is NOT idempotent (session side-effect); register is NOT idempotent.
 */
import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number().int(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    plan: z.string(),
    trialEndsAt: z.string().nullable(),
  }),
  restaurantId: z.number().int().nullable(),
});

export const registerRequestSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Mot de passe trop long (max 128 caractères)')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  name: z.string().min(1, 'Nom requis'),
  restaurantName: z.string().optional(),
  activationCode: z.string().optional(),
});

export const registerResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number().int(),
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    plan: z.string(),
    trialEndsAt: z.string().nullable(),
  }),
  restaurantId: z.number().int(),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  newPassword: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128, 'Mot de passe trop long'),
});

// idempotency tags (informational)
export const AUTH_IDEMPOTENCY = {
  login: 'none',
  register: 'none',
  forgotPassword: 'safe',
  resetPassword: 'idempotent',
} as const;
