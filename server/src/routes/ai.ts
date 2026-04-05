import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';
import { getUnitDivisor } from '../utils/unitConversion';

const prisma = new PrismaClient();
export const aiRouter = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Rate limit: track per restaurant
const aiRateLimit = new Map<number, { count: number; resetAt: number }>();
const AI_MAX_REQUESTS = 20;
const AI_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkAIRateLimit(restaurantId: number): boolean {
  const now = Date.now();
  const entry = aiRateLimit.get(restaurantId);
  if (!entry || now > entry.resetAt) {
    aiRateLimit.set(restaurantId, { count: 1, resetAt: now + AI_WINDOW_MS });
    return true;
  }
  if (entry.count >= AI_MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

async function buildRestaurantContext(restaurantId: number): Promise<string> {
  const [recipes, ingredients, inventory, sales, restaurant] = await Promise.all([
    prisma.recipe.findMany({
      where: { restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
      take: 50,
    }),
    prisma.ingredient.findMany({
      where: { restaurantId },
      orderBy: { pricePerUnit: 'desc' },
      take: 50,
    }),
    prisma.inventoryItem.findMany({
      where: { restaurantId },
      include: { ingredient: true },
    }),
    prisma.menuSale.findMany({
      where: { restaurantId },
      orderBy: { date: 'desc' },
      take: 200,
    }),
    prisma.restaurant.findUnique({ where: { id: restaurantId } }),
  ]);

  const recipesSummary = recipes.map(r => {
    const foodCost = r.ingredients.reduce((sum, ri) => sum + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
    const margin = r.sellingPrice > 0 ? ((r.sellingPrice - foodCost) / r.sellingPrice * 100) : 0;
    return `- ${r.name} (${r.category}) : prix vente ${r.sellingPrice}€, coût matière ${foodCost.toFixed(2)}€, marge ${margin.toFixed(1)}%`;
  }).join('\n');

  const ingredientsSummary = ingredients.slice(0, 20).map(i =>
    `- ${i.name} : ${i.pricePerUnit}€/${i.unit} (${i.category})`
  ).join('\n');

  const lowStock = inventory.filter(item => item.currentStock < item.minStock);
  const stockAlerts = lowStock.length > 0
    ? lowStock.map(item => `- ${item.ingredient.name} : ${item.currentStock}/${item.minStock} ${item.ingredient.unit}`).join('\n')
    : 'Aucune alerte stock';

  // Aggregate sales last 30 days
  const salesByRecipe = new Map<string, { qty: number; revenue: number }>();
  for (const s of sales) {
    const existing = salesByRecipe.get(s.recipeName) || { qty: 0, revenue: 0 };
    existing.qty += s.quantity;
    existing.revenue += s.revenue;
    salesByRecipe.set(s.recipeName, existing);
  }
  const topSales = [...salesByRecipe.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 10)
    .map(([name, data]) => `- ${name} : ${data.qty} vendus, ${data.revenue.toFixed(0)}€ CA`)
    .join('\n');

  return `Restaurant : ${restaurant?.name || 'Non défini'}
Couverture : ${restaurant?.coversPerDay || '?'} couverts/jour

=== ${recipes.length} RECETTES ===
${recipesSummary || 'Aucune recette'}

=== TOP ${ingredients.length} INGRÉDIENTS (par prix) ===
${ingredientsSummary || 'Aucun ingrédient'}

=== ALERTES STOCK ===
${stockAlerts}

=== TOP VENTES (30 derniers jours) ===
${topSales || 'Aucune vente enregistrée'}

=== INVENTAIRE ===
${inventory.length} articles en stock, valeur totale : ${inventory.reduce((sum, item) => sum + (item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit, 0).toFixed(0)}€`;
}

const SYSTEM_PROMPT = `Tu es l'assistant IA de RestauMargin, expert en gestion de restaurant et optimisation des marges.

RÈGLES :
- Réponds toujours en français
- Sois concis et actionnable (max 300 mots)
- Base tes conseils sur les données réelles du restaurant fournies ci-dessous
- Utilise des chiffres précis quand possible
- Propose des actions concrètes avec des résultats estimés
- Si le restaurant n'a pas de données, suggère de commencer par ajouter ses recettes et ingrédients
- Formate avec du **gras** pour les points importants
- Utilise des listes à puces pour la clarté`;

aiRouter.post('/chat', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message requis' });
      return;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(503).json({ error: 'Service IA non configuré' });
      return;
    }

    if (!checkAIRateLimit(req.restaurantId!)) {
      res.status(429).json({ error: 'Limite atteinte (20 questions/heure). Réessayez plus tard.' });
      return;
    }

    const context = await buildRestaurantContext(req.restaurantId!);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `${SYSTEM_PROMPT}\n\n=== DONNÉES DU RESTAURANT ===\n${context}`,
      messages: [{ role: 'user', content: message.trim() }],
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.type === 'text' ? block.text : '')
      .join('');

    res.json({
      response: text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error: unknown) {
    console.error('AI chat error:', error);
    const message = error instanceof Error ? error.message : 'Erreur IA';
    res.status(500).json({ error: message });
  }
});
