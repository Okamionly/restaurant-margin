import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';
import { getUnitDivisor } from '../utils/unitConversion';

const prisma = new PrismaClient();
export const menuEngineeringRouter = Router();

// Sales data now fetched from Prisma directly

menuEngineeringRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { days = '30', from, to } = req.query;

    // Get all recipes with ingredients
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: req.restaurantId! },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    // Compute date range
    const now = new Date();
    let dateFrom: string;
    let dateTo: string = now.toISOString().slice(0, 10);

    if (from && to) {
      dateFrom = String(from);
      dateTo = String(to);
    } else {
      const d = new Date(now);
      d.setDate(d.getDate() - Number(days));
      dateFrom = d.toISOString().slice(0, 10);
    }

    // Fetch sales from DB
    const filteredSales = await prisma.menuSale.findMany({
      where: {
        restaurantId: req.restaurantId!,
        date: { gte: dateFrom, lte: dateTo },
      },
    });

    // Aggregate sales by recipe
    const salesByRecipe = new Map<number, { qty: number; revenue: number }>();
    for (const sale of filteredSales) {
      const existing = salesByRecipe.get(sale.recipeId) || { qty: 0, revenue: 0 };
      existing.qty += sale.quantity;
      existing.revenue += sale.revenue;
      salesByRecipe.set(sale.recipeId, existing);
    }

    // Calculate total sales and average margin
    let totalSalesQty = 0;
    let totalMargin = 0;
    const numDays = Math.max(1, Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000));

    // Build engineering items
    const engineering = recipes.map((recipe) => {
      const totalCost = recipe.ingredients.reduce((sum, ri) => {
        const divisor = getUnitDivisor(ri.ingredient?.unit || 'kg');
        const ingredientCost = (ri.ingredient?.pricePerUnit || 0) * (ri.quantity / divisor) * (1 + (ri.wastePercent || 0) / 100);
        return sum + ingredientCost;
      }, 0);

      const sellingPrice = recipe.sellingPrice || 0;
      const margin = sellingPrice - totalCost;
      const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;

      const sales = salesByRecipe.get(recipe.id) || { qty: 0, revenue: 0 };
      const salesRevenue = sales.revenue || sales.qty * sellingPrice;

      totalSalesQty += sales.qty;

      return {
        id: recipe.id,
        name: recipe.name,
        category: recipe.category || 'Plat',
        sellingPrice,
        costPerPortion: totalCost,
        margin,
        marginPercent,
        salesQty: sales.qty,
        salesRevenue,
        popularity: 0, // will be calculated below
        quadrant: 'dog' as 'star' | 'puzzle' | 'plow' | 'dog',
      };
    });

    // Calculate popularity (% of total sales) and average margin
    const avgMargin = engineering.length > 0
      ? engineering.reduce((sum, e) => sum + e.marginPercent, 0) / engineering.length
      : 0;

    const avgPopularity = totalSalesQty > 0
      ? totalSalesQty / engineering.length
      : 0;

    // Assign quadrants based on BCG matrix
    for (const item of engineering) {
      item.popularity = totalSalesQty > 0 ? (item.salesQty / totalSalesQty) * 100 : 0;

      const highMargin = item.marginPercent >= avgMargin;
      const highPopularity = item.salesQty >= avgPopularity;

      if (highMargin && highPopularity) item.quadrant = 'star';
      else if (highMargin && !highPopularity) item.quadrant = 'puzzle';
      else if (!highMargin && highPopularity) item.quadrant = 'plow';
      else item.quadrant = 'dog';
    }

    res.json({
      engineering,
      totalSales: totalSalesQty,
      avgMargin: Math.round(avgMargin * 10) / 10,
      days: numDays,
    });
  } catch (error) {
    console.error('Menu engineering error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul du menu engineering' });
  }
});
