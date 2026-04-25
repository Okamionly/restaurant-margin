/**
 * @file api-lib/openapi/spec.ts
 * Generates the OpenAPI 3.1 JSON document from the registry.
 * Import getOpenApiSpec() once and cache the result — generation is
 * synchronous and idempotent.
 */
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';

let _cachedSpec: ReturnType<OpenApiGeneratorV31['generateDocument']> | null = null;

export function getOpenApiSpec() {
  if (_cachedSpec) return _cachedSpec;

  const generator = new OpenApiGeneratorV31(registry.definitions);

  _cachedSpec = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'RestauMargin API',
      version: '3.0.0',
      description:
        'API REST for the RestauMargin SaaS platform — margin calculation, recipes, ingredients, invoices, and billing.',
      contact: {
        name: 'RestauMargin Support',
        email: 'contact@restaumargin.fr',
        url: 'https://www.restaumargin.fr',
      },
    },
    servers: [
      { url: 'https://www.restaumargin.fr', description: 'Production' },
      { url: 'http://localhost:3001', description: 'Local development' },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication — login, register, JWT, RGPD' },
      { name: 'Ingredients', description: 'Ingredient management' },
      { name: 'Recipes', description: 'Recipe management and margin calculation' },
      { name: 'Invoices', description: 'Invoice generation' },
      { name: 'Stripe', description: 'Billing — Checkout, Portal, Webhook' },
      { name: 'Admin', description: 'Platform administration (admin role required)' },
      { name: 'NPS', description: 'Net Promoter Score surveys' },
      { name: 'Mercuriale', description: 'Supplier price publication system' },
      { name: 'Referrals', description: 'Referral program' },
    ],
  });

  return _cachedSpec;
}
