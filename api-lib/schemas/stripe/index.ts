/**
 * @file api-lib/schemas/stripe/index.ts
 * Zod schemas for Stripe billing endpoints.
 */
import { z } from 'zod';

export const stripeCheckoutRequestSchema = z.object({
  planId: z.enum(['pro', 'business'], {
    errorMap: () => ({ message: 'planId invalide (pro ou business)' }),
  }),
  annual: z.boolean().optional(),
});

export const stripeCheckoutResponseSchema = z.object({
  url: z.string().url(),
});

export const stripePortalResponseSchema = z.object({
  url: z.string().url(),
});

export const STRIPE_IDEMPOTENCY = {
  checkout: 'none',
  portal: 'none',
} as const;
