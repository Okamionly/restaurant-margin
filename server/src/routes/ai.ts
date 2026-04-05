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

// ══════════════════════════════════════════════════════════════════════════
// POST /api/ai/demand-forecast — Demand Forecasting (90 days sales data)
// ══════════════════════════════════════════════════════════════════════════
aiRouter.post('/demand-forecast', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: 'Service IA non configure' }); return; }
    if (!checkAIRateLimit(restaurantId)) { res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' }); return; }

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const salesData = await prisma.menuSale.findMany({
      where: { restaurantId, date: { gte: ninetyDaysAgo.toISOString().slice(0, 10) } },
      orderBy: { date: 'asc' },
    });

    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      select: { id: true, name: true, category: true, sellingPrice: true },
    });
    const recipeMap = Object.fromEntries(recipes.map(r => [r.id, r]));

    if (salesData.length === 0) {
      res.json({ predictions: [], insights: 'Aucune donnee de vente sur les 90 derniers jours. Enregistrez des ventes pour obtenir des previsions IA.' });
      return;
    }

    const grouped: Record<string, Record<number, number[]>> = {};
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    for (const sale of salesData) {
      const dayOfWeek = dayNames[new Date(sale.date).getDay()];
      if (!grouped[dayOfWeek]) grouped[dayOfWeek] = {};
      if (!grouped[dayOfWeek][sale.recipeId]) grouped[dayOfWeek][sale.recipeId] = [];
      grouped[dayOfWeek][sale.recipeId].push(sale.quantity);
    }

    const summary = Object.entries(grouped).map(([day, recipeData]) => {
      const lines = Object.entries(recipeData).map(([recipeId, quantities]) => {
        const r = recipeMap[Number(recipeId)];
        const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;
        return `  ${r?.name || `Recette #${recipeId}`} (${r?.category || '?'}): moy ${avg.toFixed(1)} / service`;
      }).join('\n');
      return `${day}:\n${lines}`;
    }).join('\n\n');

    const prompt = `Analyse les ventes des 90 derniers jours. Predis les quantites a preparer pour chaque plat pour les 7 prochains jours.\n\nDonnees:\n${summary}\n\nRecettes: ${recipes.map(r => `${r.name} (${r.category})`).join(', ')}\n\nReponds en JSON: { "predictions": [{ "date": "YYYY-MM-DD", "dayOfWeek": "lundi", "recipes": [{ "name": "Plat", "predictedQuantity": 12, "confidence": 0.85 }] }], "insights": "Analyse en francais" }\n\nJours a partir de ${new Date().toISOString().slice(0, 10)}.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en prevision de demande pour la restauration. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    let aiResult: any = {};
    try { const m = responseText.match(/\{[\s\S]*\}/); if (m) aiResult = JSON.parse(m[0]); } catch { aiResult = { predictions: [], insights: responseText }; }

    res.json({ predictions: aiResult.predictions || [], insights: aiResult.insights || 'Analyse non disponible.' });
  } catch (error: unknown) {
    console.error('AI demand-forecast error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur prevision IA' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/ai/pricing-suggestions — Dynamic Pricing Suggestions
// ══════════════════════════════════════════════════════════════════════════
aiRouter.post('/pricing-suggestions', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: 'Service IA non configure' }); return; }
    if (!checkAIRateLimit(restaurantId)) { res.status(429).json({ error: 'Limite de requetes atteinte.' }); return; }

    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
    });

    if (recipes.length === 0) {
      res.json({ suggestions: [], summary: 'Aucune recette trouvee. Ajoutez des recettes pour obtenir des suggestions de prix.' });
      return;
    }

    const recipeData = recipes.map(r => {
      const cost = r.ingredients.reduce((s, ri) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
      const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
      const coefficient = r.sellingPrice > 0 ? r.sellingPrice / cost : 0;
      return { id: r.id, name: r.name, category: r.category, sellingPrice: r.sellingPrice, cost: Math.round(cost * 100) / 100, margin: Math.round(margin * 10) / 10, coefficient: Math.round(coefficient * 100) / 100 };
    });

    const prompt = `Propose des ajustements de prix pour maximiser la marge totale. Recettes:\n${recipeData.map(r => `- ${r.name} (${r.category}): vente ${r.sellingPrice}EUR, cout ${r.cost}EUR, marge ${r.margin}%, coeff ${r.coefficient}`).join('\n')}\n\nRegles: coeff min 3.0 plats / 4.0 boissons, food cost 25-35%, prix psychologiques.\n\nReponds en JSON: { "suggestions": [{ "recipeId": 1, "recipeName": "Plat", "currentPrice": 12.00, "suggestedPrice": 13.90, "reasoning": "Explication", "estimatedImpact": "+180 EUR/mois" }], "summary": "Resume" }\n\nTop 10 opportunites.`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en pricing pour la restauration. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    let aiResult: any = {};
    try { const m = responseText.match(/\{[\s\S]*\}/); if (m) aiResult = JSON.parse(m[0]); } catch { aiResult = { suggestions: [], summary: responseText }; }

    res.json({ suggestions: aiResult.suggestions || [], summary: aiResult.summary || 'Analyse non disponible.' });
  } catch (error: unknown) {
    console.error('AI pricing-suggestions error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur suggestions prix IA' });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/ai/supplier-brief — Supplier Negotiation Brief
// ══════════════════════════════════════════════════════════════════════════
aiRouter.post('/supplier-brief', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const { supplierId } = req.body;
    if (!supplierId) { res.status(400).json({ error: 'supplierId requis' }); return; }
    if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: 'Service IA non configure' }); return; }
    if (!checkAIRateLimit(restaurantId)) { res.status(429).json({ error: 'Limite de requetes atteinte.' }); return; }

    const supplier = await prisma.supplier.findFirst({ where: { id: supplierId, restaurantId } });
    if (!supplier) { res.status(404).json({ error: 'Fournisseur introuvable' }); return; }

    const ingredients = await prisma.ingredient.findMany({ where: { restaurantId, supplierId }, orderBy: { pricePerUnit: 'desc' } });
    const allIngredients = await prisma.ingredient.findMany({ where: { restaurantId }, include: { supplierRef: true } });
    const otherSuppliers = await prisma.supplier.findMany({ where: { restaurantId, id: { not: supplierId } }, select: { id: true, name: true } });

    const totalSpend = ingredients.reduce((s, i) => s + i.pricePerUnit, 0);
    const ingList = ingredients.map(i => `- ${i.name}: ${i.pricePerUnit}EUR/${i.unit}`).join('\n');

    const alternatives: string[] = [];
    for (const ing of ingredients) {
      const alt = allIngredients.filter(a => a.name.toLowerCase() === ing.name.toLowerCase() && a.supplierId !== supplierId && a.supplierRef);
      if (alt.length > 0) alternatives.push(`${ing.name}: ${alt.map(a => `${a.supplierRef?.name || '?'} ${a.pricePerUnit}EUR`).join(', ')} vs ${ing.pricePerUnit}EUR`);
    }

    const prompt = `Brief negociation fournisseur ${supplier.name}. ${ingredients.length} produits, ~${totalSpend.toFixed(0)}EUR/mois, ${otherSuppliers.length} alternatives.\n\nProduits:\n${ingList || 'Aucun'}\n\nAlternatives:\n${alternatives.join('\n') || 'Aucune'}\n\nReponds en JSON: { "supplierName": "${supplier.name}", "negotiationPoints": ["..."], "priceTargets": [{ "product": "...", "currentPrice": 5, "targetPrice": 4.25, "argument": "..." }], "alternatives": [{ "product": "...", "alternativeSupplier": "...", "alternativePrice": 4 }], "emailDraft": "Email complet..." }`;

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en achat et negociation fournisseur pour la restauration. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    let aiResult: any = {};
    try { const m = responseText.match(/\{[\s\S]*\}/); if (m) aiResult = JSON.parse(m[0]); } catch { aiResult = { supplierName: supplier.name, negotiationPoints: [], priceTargets: [], alternatives: [], emailDraft: responseText }; }

    res.json({
      supplierName: aiResult.supplierName || supplier.name,
      negotiationPoints: aiResult.negotiationPoints || [],
      priceTargets: aiResult.priceTargets || [],
      alternatives: aiResult.alternatives || [],
      emailDraft: aiResult.emailDraft || '',
    });
  } catch (error: unknown) {
    console.error('AI supplier-brief error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Erreur brief negociation IA' });
  }
});

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
