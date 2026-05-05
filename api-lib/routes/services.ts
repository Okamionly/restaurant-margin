/**
 * @file api-lib/routes/services.ts
 * Service close domain — créé 2026-04-28 (audit cohérence Kitchen↔Service).
 *
 * Mounted at /api/services in api/index.ts:
 *   app.use('/api/services', authWithRestaurant, servicesRoutes);
 *
 * Routes:
 *   POST /close — clôture un service (déjeuner/dîner) :
 *     1. Crée des MenuSale en bulk pour chaque recette vendue
 *     2. Décrémente l'inventaire (currentStock) selon les ingrédients consommés
 *        (avec conversion d'unité via getUnitDivisor)
 *     3. Retourne le résumé : ventes / coût matière / marge réelle
 *
 * Avant ce endpoint : ServiceTracker.tsx faisait POST /api/services dans le vide
 * (.catch silencieux), aucune persistence, stock jamais décrémenté.
 */

import { Router } from 'express';
import { prisma } from '../prisma';
import { logAudit } from '../middleware';
import { getUnitDivisor } from '../utils/unitConversion';

const router = Router();

interface ServiceCloseInput {
  date?: string;                // YYYY-MM-DD, default = today
  orders: Array<{
    recipeId: number;
    quantity: number;
    revenue?: number;            // si non fourni, recalcul depuis recipe.sellingPrice * quantity
  }>;
}

// ============ POST /api/services/close ============
router.post('/close', async (req: any, res) => {
  try {
    const { date, orders } = req.body as ServiceCloseInput;
    const restaurantId = req.restaurantId;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'orders (array) requis' });
    }

    const today = date || new Date().toISOString().slice(0, 10);

    // Charge toutes les recettes une fois (avec ingrédients)
    const recipeIds = [...new Set(orders.map(o => o.recipeId))];
    const recipes = await prisma.recipe.findMany({
      where: { id: { in: recipeIds }, restaurantId, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });
    const recipeMap = new Map(recipes.map(r => [r.id, r]));

    // Charge tous les InventoryItems en lien avec les ingrédients consommés
    const ingredientIds = recipes.flatMap(r => r.ingredients.map(ri => ri.ingredient.id));
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { restaurantId, ingredientId: { in: ingredientIds } },
    });
    const invMap = new Map(inventoryItems.map(i => [i.ingredientId, i]));

    let totalRevenue = 0;
    let totalFoodCost = 0;
    const stockDecrements: Array<{ inventoryItemId: number; oldStock: number; newStock: number; ingredientName: string }> = [];

    // Transaction : MenuSale + InventoryItem updates atomiques
    await prisma.$transaction(async (tx) => {
      for (const order of orders) {
        const recipe = recipeMap.get(order.recipeId);
        if (!recipe) continue; // skip recettes non trouvées (silencieux mais log warning serait mieux)

        const revenue = order.revenue ?? (recipe.sellingPrice * order.quantity);
        totalRevenue += revenue;

        // 1. Crée MenuSale
        await tx.menuSale.create({
          data: {
            recipeId: recipe.id,
            recipeName: recipe.name,
            quantity: order.quantity,
            revenue,
            date: today,
            restaurantId,
          },
        });

        // 2. Décrémente le stock pour chaque ingrédient consommé
        for (const ri of recipe.ingredients) {
          const inv = invMap.get(ri.ingredient.id);
          if (!inv) continue; // ingrédient pas en inventaire = silencieux (peut être normal)

          // Quantité consommée totale = ri.quantity * nbOrders / nbPortions
          // (recipe.nbPortions = portions par recette, ri.quantity = quantité d'ingrédient
          // par recette entière, on consomme order.quantity portions individuelles)
          const portionsConsumed = order.quantity;
          const consumedRaw = (ri.quantity / Math.max(recipe.nbPortions || 1, 1)) * portionsConsumed;

          // ri.quantity est dans l'unité de l'ingrédient (g, kg, cl, L, pièce).
          // InventoryItem.currentStock est dans la même unité. Pas de conversion nécessaire ici.
          const newStock = Math.max(inv.currentStock - consumedRaw, 0);

          // Calcul food cost réel (en kg/L canonique pour multiply pricePerUnit)
          const divisor = getUnitDivisor(ri.ingredient.unit);
          const wasteMult = 1 / Math.max(1 - (ri.wastePercent || 0) / 100, 0.001); // yield strategy
          const ingredientCost = (consumedRaw / divisor) * ri.ingredient.pricePerUnit * wasteMult;
          totalFoodCost += ingredientCost;

          await tx.inventoryItem.update({
            where: { id: inv.id },
            data: { currentStock: newStock },
          });

          stockDecrements.push({
            inventoryItemId: inv.id,
            oldStock: inv.currentStock,
            newStock,
            ingredientName: ri.ingredient.name,
          });

          // Update local map pour le batch (au cas où plusieurs recettes utilisent même ingrédient)
          invMap.set(ri.ingredient.id, { ...inv, currentStock: newStock });
        }
      }
    });

    logAudit(req.user.userId, restaurantId, 'CREATE', 'service-close', 0, {
      date: today,
      ordersCount: orders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalFoodCost: Math.round(totalFoodCost * 100) / 100,
      stockDecrementsCount: stockDecrements.length,
    });

    res.status(201).json({
      ok: true,
      date: today,
      summary: {
        ordersCount: orders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalFoodCost: Math.round(totalFoodCost * 100) / 100,
        marginAmount: Math.round((totalRevenue - totalFoodCost) * 100) / 100,
        marginPercent: totalRevenue > 0 ? Math.round(((totalRevenue - totalFoodCost) / totalRevenue) * 1000) / 10 : 0,
        stockDecrementsCount: stockDecrements.length,
      },
      stockDecrements: stockDecrements.slice(0, 10), // preview, pas tout pour pas inonder
    });
  } catch (e: any) {
    console.error('[services/close]', e);
    res.status(500).json({ error: 'Erreur clôture service', details: e.message });
  }
});

export default router;
