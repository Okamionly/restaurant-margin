/**
 * @file api-lib/openapi/registry.ts
 * Centralised OpenAPIRegistry — all route registrations live here.
 * Import registerAll() once at app boot to populate the registry used by spec.ts.
 */
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// ─── Auth Bearer security scheme ─────────────────────────────────────────────
registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// ─── Re-usable response schemas ───────────────────────────────────────────────
const ErrorSchema = z
  .object({ error: z.string() })
  .openapi('ErrorResponse');

const MessageSchema = z
  .object({ message: z.string() })
  .openapi('MessageResponse');

// ─── Auth schemas ─────────────────────────────────────────────────────────────
const AuthUserSchema = z
  .object({
    id: z.number().int(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['admin', 'chef', 'deleted']),
    plan: z.enum(['basic', 'pro', 'business']),
    trialEndsAt: z.string().nullable(),
  })
  .openapi('AuthUser');

const LoginBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .openapi('LoginBody');

const LoginResponseSchema = z
  .object({
    token: z.string(),
    user: AuthUserSchema,
    restaurantId: z.number().int().nullable(),
  })
  .openapi('LoginResponse');

const RegisterBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    restaurantName: z.string().optional(),
    activationCode: z.string().optional(),
  })
  .openapi('RegisterBody');

const RegisterResponseSchema = z
  .object({
    token: z.string(),
    user: AuthUserSchema,
    restaurantId: z.number().int(),
  })
  .openapi('RegisterResponse');

const ForgotPasswordBodySchema = z
  .object({ email: z.string().email() })
  .openapi('ForgotPasswordBody');

const ResetPasswordBodySchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8),
  })
  .openapi('ResetPasswordBody');

// ─── Ingredient schemas ───────────────────────────────────────────────────────
const IngredientSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    unit: z.string(),
    pricePerUnit: z.number(),
    category: z.string().nullable().optional(),
    supplierId: z.number().int().nullable().optional(),
    restaurantId: z.number().int(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('Ingredient');

const CreateIngredientBodySchema = z
  .object({
    name: z.string().min(1),
    unit: z.string().min(1),
    pricePerUnit: z.number().min(0),
    category: z.string().optional(),
    supplierId: z.number().int().optional(),
  })
  .openapi('CreateIngredientBody');

const PatchIngredientBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    unit: z.string().min(1).optional(),
    pricePerUnit: z.number().min(0).optional(),
    category: z.string().optional(),
  })
  .openapi('PatchIngredientBody');

// ─── Recipe schemas ───────────────────────────────────────────────────────────
const RecipeIngredientSchema = z
  .object({
    id: z.number().int(),
    ingredientId: z.number().int(),
    quantity: z.number(),
    unit: z.string(),
    wastePercent: z.number().optional(),
    ingredient: IngredientSchema.optional(),
  })
  .openapi('RecipeIngredient');

const RecipeSchema = z
  .object({
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
    ingredients: z.array(RecipeIngredientSchema).optional(),
  })
  .openapi('Recipe');

const CreateRecipeBodySchema = z
  .object({
    name: z.string().min(1),
    sellingPrice: z.number().min(0),
    description: z.string().optional(),
    nbPortions: z.number().int().min(1).optional(),
    prepTimeMinutes: z.number().int().min(0).optional(),
    cookTimeMinutes: z.number().int().min(0).optional(),
    laborCostPerHour: z.number().min(0).optional(),
    category: z.string().optional(),
  })
  .openapi('CreateRecipeBody');

const PatchRecipeBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    sellingPrice: z.number().min(0).optional(),
    description: z.string().optional(),
    nbPortions: z.number().int().min(1).optional(),
    prepTimeMinutes: z.number().int().min(0).optional(),
    cookTimeMinutes: z.number().int().min(0).optional(),
    laborCostPerHour: z.number().min(0).optional(),
    category: z.string().optional(),
  })
  .openapi('PatchRecipeBody');

// ─── Invoice schemas ──────────────────────────────────────────────────────────
const InvoiceItemSchema = z
  .object({
    id: z.number().int(),
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    vatRate: z.number(),
    total: z.number(),
  })
  .openapi('InvoiceItem');

const InvoiceSchema = z
  .object({
    id: z.number().int(),
    number: z.string(),
    clientName: z.string(),
    clientEmail: z.string().nullable().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'cancelled']),
    totalHT: z.number(),
    totalTTC: z.number(),
    vatRate: z.number(),
    restaurantId: z.number().int(),
    createdAt: z.string(),
    items: z.array(InvoiceItemSchema).optional(),
  })
  .openapi('Invoice');

const CreateInvoiceBodySchema = z
  .object({
    clientName: z.string().min(1),
    clientEmail: z.string().email().optional(),
    vatRate: z.number().min(0).max(100),
    items: z.array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().min(0),
        unitPrice: z.number().min(0),
        vatRate: z.number().min(0).max(100),
      })
    ).min(1),
  })
  .openapi('CreateInvoiceBody');

// ─── Stripe schemas ───────────────────────────────────────────────────────────
const StripeCheckoutBodySchema = z
  .object({
    planId: z.enum(['pro', 'business']),
    annual: z.boolean().optional(),
  })
  .openapi('StripeCheckoutBody');

const StripeCheckoutResponseSchema = z
  .object({ url: z.string().url() })
  .openapi('StripeCheckoutResponse');

const StripePortalResponseSchema = z
  .object({ url: z.string().url() })
  .openapi('StripePortalResponse');

// ─── RestaurantId param ───────────────────────────────────────────────────────
const RestaurantIdHeader = {
  in: 'header' as const,
  name: 'X-Restaurant-Id',
  required: true,
  schema: { type: 'integer' as const },
  description: 'ID of the restaurant to operate on',
};

// ─── Route registrations — Auth ───────────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Authenticate user and get JWT',
  request: { body: { content: { 'application/json': { schema: LoginBodySchema } } } },
  responses: {
    200: { description: 'Login successful', content: { 'application/json': { schema: LoginResponseSchema } } },
    400: { description: 'Missing fields', content: { 'application/json': { schema: ErrorSchema } } },
    401: { description: 'Invalid credentials', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user account',
  request: { body: { content: { 'application/json': { schema: RegisterBodySchema } } } },
  responses: {
    201: { description: 'Account created', content: { 'application/json': { schema: RegisterResponseSchema } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
    409: { description: 'Email already used', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/logout',
  tags: ['Auth'],
  summary: 'Revoke current JWT and clear cookie',
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: 'Logged out', content: { 'application/json': { schema: MessageSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Auth'],
  summary: 'Get current authenticated user',
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: 'User data', content: { 'application/json': { schema: AuthUserSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/forgot-password',
  tags: ['Auth'],
  summary: 'Request password reset email',
  request: { body: { content: { 'application/json': { schema: ForgotPasswordBodySchema } } } },
  responses: {
    200: { description: 'Reset email sent (or silently skipped)', content: { 'application/json': { schema: MessageSchema } } },
    400: { description: 'Missing email', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/reset-password',
  tags: ['Auth'],
  summary: 'Reset password with token',
  request: { body: { content: { 'application/json': { schema: ResetPasswordBodySchema } } } },
  responses: {
    200: { description: 'Password reset', content: { 'application/json': { schema: MessageSchema } } },
    400: { description: 'Invalid/expired token', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — Ingredients ───────────────────────────────────────
registry.registerPath({
  method: 'get',
  path: '/api/ingredients',
  tags: ['Ingredients'],
  summary: 'List all ingredients for a restaurant',
  security: [{ BearerAuth: [] }],
  parameters: [RestaurantIdHeader],
  responses: {
    200: { description: 'Ingredient list', content: { 'application/json': { schema: z.array(IngredientSchema) } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/ingredients',
  tags: ['Ingredients'],
  summary: 'Create a new ingredient',
  security: [{ BearerAuth: [] }],
  parameters: [RestaurantIdHeader],
  request: { body: { content: { 'application/json': { schema: CreateIngredientBodySchema } } } },
  responses: {
    201: { description: 'Ingredient created', content: { 'application/json': { schema: IngredientSchema } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/ingredients/{id}',
  tags: ['Ingredients'],
  summary: 'Update an ingredient',
  security: [{ BearerAuth: [] }],
  parameters: [
    RestaurantIdHeader,
    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
  ],
  request: { body: { content: { 'application/json': { schema: PatchIngredientBodySchema } } } },
  responses: {
    200: { description: 'Updated ingredient', content: { 'application/json': { schema: IngredientSchema } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/ingredients/{id}',
  tags: ['Ingredients'],
  summary: 'Delete an ingredient',
  security: [{ BearerAuth: [] }],
  parameters: [
    RestaurantIdHeader,
    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
  ],
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — Recipes ───────────────────────────────────────────
registry.registerPath({
  method: 'get',
  path: '/api/recipes',
  tags: ['Recipes'],
  summary: 'List all recipes for a restaurant',
  security: [{ BearerAuth: [] }],
  parameters: [RestaurantIdHeader],
  responses: {
    200: { description: 'Recipe list', content: { 'application/json': { schema: z.array(RecipeSchema) } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/recipes',
  tags: ['Recipes'],
  summary: 'Create a new recipe',
  security: [{ BearerAuth: [] }],
  parameters: [RestaurantIdHeader],
  request: { body: { content: { 'application/json': { schema: CreateRecipeBodySchema } } } },
  responses: {
    201: { description: 'Recipe created', content: { 'application/json': { schema: RecipeSchema } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/recipes/{id}',
  tags: ['Recipes'],
  summary: 'Get a single recipe',
  security: [{ BearerAuth: [] }],
  parameters: [
    RestaurantIdHeader,
    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
  ],
  responses: {
    200: { description: 'Recipe detail', content: { 'application/json': { schema: RecipeSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/recipes/{id}',
  tags: ['Recipes'],
  summary: 'Update a recipe',
  security: [{ BearerAuth: [] }],
  parameters: [
    RestaurantIdHeader,
    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
  ],
  request: { body: { content: { 'application/json': { schema: PatchRecipeBodySchema } } } },
  responses: {
    200: { description: 'Updated recipe', content: { 'application/json': { schema: RecipeSchema } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/recipes/{id}',
  tags: ['Recipes'],
  summary: 'Delete a recipe',
  security: [{ BearerAuth: [] }],
  parameters: [
    RestaurantIdHeader,
    { in: 'path', name: 'id', required: true, schema: { type: 'integer' } },
  ],
  responses: {
    204: { description: 'Deleted' },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — Invoices ──────────────────────────────────────────
registry.registerPath({
  method: 'get',
  path: '/api/invoices',
  tags: ['Invoices'],
  summary: 'List invoices for a restaurant',
  security: [{ BearerAuth: [] }],
  parameters: [RestaurantIdHeader],
  responses: {
    200: { description: 'Invoice list', content: { 'application/json': { schema: z.array(InvoiceSchema) } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/invoices',
  tags: ['Invoices'],
  summary: 'Create a new invoice',
  security: [{ BearerAuth: [] }],
  parameters: [RestaurantIdHeader],
  request: { body: { content: { 'application/json': { schema: CreateInvoiceBodySchema } } } },
  responses: {
    201: { description: 'Invoice created', content: { 'application/json': { schema: InvoiceSchema } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — Stripe ────────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/stripe/checkout',
  tags: ['Stripe'],
  summary: 'Create a Stripe Checkout session',
  security: [{ BearerAuth: [] }],
  request: { body: { content: { 'application/json': { schema: StripeCheckoutBodySchema } } } },
  responses: {
    200: { description: 'Checkout URL', content: { 'application/json': { schema: StripeCheckoutResponseSchema } } },
    400: { description: 'Invalid planId', content: { 'application/json': { schema: ErrorSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/stripe/portal',
  tags: ['Stripe'],
  summary: 'Create a Stripe Customer Portal session',
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: 'Portal URL', content: { 'application/json': { schema: StripePortalResponseSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/stripe/webhook',
  tags: ['Stripe'],
  summary: 'Stripe webhook receiver (raw body, signature verified)',
  parameters: [
    { in: 'header', name: 'stripe-signature', required: true, schema: { type: 'string' } },
  ],
  responses: {
    200: { description: 'Event received', content: { 'application/json': { schema: z.object({ received: z.literal(true) }) } } },
    400: { description: 'Bad signature or missing secret', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — NPS ────────────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/nps',
  tags: ['NPS'],
  summary: 'Submit an NPS score',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({ score: z.number().int().min(0).max(10), comment: z.string().optional() })
            .openapi('NpsBody'),
        },
      },
    },
  },
  responses: {
    201: { description: 'NPS recorded', content: { 'application/json': { schema: MessageSchema } } },
    400: { description: 'Invalid score', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — Admin ──────────────────────────────────────────────
registry.registerPath({
  method: 'get',
  path: '/api/admin/stats',
  tags: ['Admin'],
  summary: 'Aggregated platform statistics (admin only)',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Stats object',
      content: {
        'application/json': {
          schema: z
            .object({
              totalUsers: z.number().int(),
              totalRestaurants: z.number().int(),
              totalRecipes: z.number().int(),
              totalIngredients: z.number().int(),
            })
            .openapi('AdminStats'),
        },
      },
    },
    403: { description: 'Admin only', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/admin/users',
  tags: ['Admin'],
  summary: 'List all users (admin only)',
  security: [{ BearerAuth: [] }],
  responses: {
    200: { description: 'User list', content: { 'application/json': { schema: z.array(AuthUserSchema) } } },
    403: { description: 'Admin only', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// ─── Route registrations — Mercuriale ─────────────────────────────────────────
registry.registerPath({
  method: 'get',
  path: '/api/mercuriale/latest',
  tags: ['Mercuriale'],
  summary: 'Latest published mercuriale with prices and alerts',
  responses: {
    200: {
      description: 'Latest mercuriale data',
      content: {
        'application/json': {
          schema: z
            .object({
              publication: z.record(z.unknown()).nullable(),
              prices: z.array(z.record(z.unknown())),
              alerts: z.array(z.record(z.unknown())),
              alternatives: z.array(z.record(z.unknown())),
            })
            .openapi('MercurialeLatest'),
        },
      },
    },
  },
});

// ─── Route registrations — Referrals ─────────────────────────────────────────
registry.registerPath({
  method: 'post',
  path: '/api/referrals',
  tags: ['Referrals'],
  summary: 'Create a referral',
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({ referredEmail: z.string().email() })
            .openapi('CreateReferralBody'),
        },
      },
    },
  },
  responses: {
    201: { description: 'Referral created', content: { 'application/json': { schema: MessageSchema } } },
    400: { description: 'Invalid email', content: { 'application/json': { schema: ErrorSchema } } },
  },
});

// Export named schemas so spec.ts can reference them
export {
  LoginBodySchema,
  RegisterBodySchema,
  ForgotPasswordBodySchema,
  ResetPasswordBodySchema,
  CreateIngredientBodySchema,
  PatchIngredientBodySchema,
  CreateRecipeBodySchema,
  PatchRecipeBodySchema,
  CreateInvoiceBodySchema,
  StripeCheckoutBodySchema,
};
