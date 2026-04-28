/**
 * @file api-lib/routes/inventory.ts
 * Inventory domain — extracted from api/index.ts (round 3 of monolith split).
 *
 * Mounted at /api/inventory in api/index.ts:
 *   app.use('/api/inventory', authWithRestaurant, inventoryRoutes);
 *
 * Routes:
 *   GET    /                        — list inventory items (paginated/full) with lowStock flag
 *   GET    /alerts                  — items where currentStock < minStock
 *   GET    /value                   — total inventory value + breakdown by category
 *   GET    /auto-reorder            — analyze low stock + suggest reorders by supplier
 *   POST   /                        — add inventory item from existing ingredient
 *   POST   /suggest                 — list ingredients NOT yet in inventory
 *   POST   /:id/restock             — add stock + log restock metadata
 *   POST   /auto-reorder/confirm    — create marketplace orders from suggestions
 *   PUT    /:id                     — update item (stock, min/max, unit, notes)
 *   DELETE /:id                     — delete item
 */

import { Router } from 'express';
import { prisma } from '../prisma';
import { sanitizeInput, logAudit, validatePositiveNumber } from '../middleware';
import { getUnitDivisor } from '../utils/unitConversion';

const router = Router();

// ============ GET /api/inventory ============
router.get('/', async (req: any, res) => {
  try {
    const { limit, offset } = req.query;
    if (limit !== undefined || offset !== undefined) {
      const take = Math.min(parseInt(limit) || 100, 500);
      const skip = parseInt(offset) || 0;
      const [rawData, total] = await Promise.all([
        prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true }, orderBy: { ingredient: { name: 'asc' } }, take, skip }),
        prisma.inventoryItem.count({ where: { restaurantId: req.restaurantId } }),
      ]);
      const data = rawData.map((item: any) => ({ ...item, lowStock: item.currentStock < item.minStock }));
      return res.json({ data, total, limit: take, offset: skip });
    }
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    res.json(items.map((item: any) => ({ ...item, lowStock: item.currentStock < item.minStock })));
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur récupération inventaire' }); }
});

// ============ GET /api/inventory/alerts ============
router.get('/alerts', async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: true },
      orderBy: { ingredient: { name: 'asc' } },
    });
    const alerts = items.filter((item: any) => item.currentStock < item.minStock);
    res.json(alerts);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur alertes' }); }
});

// ============ GET /api/inventory/value ============
router.get('/value', async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({ where: { restaurantId: req.restaurantId }, include: { ingredient: true } });
    const totalValue = items.reduce((sum: number, item: any) => sum + (item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit, 0);
    const byCategory: Record<string, number> = {};
    for (const item of items) {
      const cat = (item as any).ingredient.category;
      const val = (item.currentStock / getUnitDivisor((item as any).ingredient.unit)) * (item as any).ingredient.pricePerUnit;
      byCategory[cat] = (byCategory[cat] || 0) + val;
    }
    res.json({
      totalValue: Math.round(totalValue * 100) / 100,
      byCategory: Object.entries(byCategory).map(([category, value]) => ({ category, value: Math.round(value * 100) / 100 })),
      itemCount: items.length,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur calcul valeur' }); }
});

// ============ POST /api/inventory/suggest ============
// Returns ingredients NOT yet present in inventory (for the "add to inventory" UI).
router.post('/suggest', async (req: any, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId, deletedAt: null, inventoryItem: null },
      orderBy: { name: 'asc' },
    });
    res.json(ingredients);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suggestions' }); }
});

// ============ POST /api/inventory ============
router.post('/', async (req: any, res) => {
  try {
    const { ingredientId, currentStock, unit, minStock, maxStock, notes } = req.body;
    if (!ingredientId) return res.status(400).json({ error: 'Erreur ajout inventaire', details: 'ingredientId requis' });
    if (currentStock !== undefined) {
      const stockCheck = validatePositiveNumber(currentStock, 'Stock actuel');
      if (!stockCheck.valid) return res.status(400).json({ error: 'Erreur ajout inventaire', details: stockCheck.error });
    }
    const ingredient = await prisma.ingredient.findFirst({ where: { id: ingredientId, restaurantId: req.restaurantId, deletedAt: null } });
    if (!ingredient) return res.status(404).json({ error: 'Ingrédient non trouvé' });
    const safeNotes = notes ? sanitizeInput(notes) : null;
    const item = await prisma.inventoryItem.create({
      data: { ingredientId, currentStock: currentStock || 0, unit: unit || ingredient.unit, minStock: minStock || 0, maxStock: maxStock || null, notes: safeNotes, restaurantId: req.restaurantId },
      include: { ingredient: true },
    });
    logAudit(req.user.userId, req.restaurantId, 'CREATE', 'inventory', item.id, { ingredientId, currentStock: currentStock || 0 });
    res.status(201).json(item);
  } catch (e: any) {
    if (e.code === 'P2002') return res.status(409).json({ error: 'Déjà dans l\'inventaire' });
    console.error(e); res.status(500).json({ error: 'Erreur ajout inventaire' });
  }
});

// ============ PUT /api/inventory/:id ============
router.put('/:id', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    // FIX 2026-04-28 (audit Recipes↔Inventory) : 'minQuantity' acceptait un champ
    // qui n'existe PAS dans le schema Prisma (seul 'minStock' existe). Backward compat :
    // si l'UI envoie encore minQuantity, on l'aliase vers minStock.
    const { currentStock, minStock, maxStock, minQuantity, unit, notes } = req.body;
    const data: any = {};
    if (currentStock !== undefined) {
      const check = validatePositiveNumber(currentStock, 'Stock actuel');
      if (!check.valid) return res.status(400).json({ error: 'Erreur mise à jour inventaire', details: check.error });
      data.currentStock = check.value;
    }
    if (minStock !== undefined) data.minStock = parseFloat(minStock);
    else if (minQuantity !== undefined) data.minStock = parseFloat(minQuantity); // alias backward compat
    if (maxStock !== undefined) data.maxStock = maxStock === null ? null : parseFloat(maxStock);
    if (unit !== undefined) data.unit = unit;
    if (notes !== undefined) data.notes = notes ? sanitizeInput(notes) : null;
    const item = await prisma.inventoryItem.update({ where: { id }, data, include: { ingredient: true } });
    logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'inventory', id, data);
    res.json(item);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur mise à jour inventaire' }); }
});

// ============ POST /api/inventory/:id/restock ============
router.post('/:id/restock', async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;
    const qtyCheck = validatePositiveNumber(quantity, 'Quantité');
    if (!qtyCheck.valid || !qtyCheck.value || qtyCheck.value <= 0) return res.status(400).json({ error: 'Erreur réapprovisionnement', details: 'Quantité doit être supérieure à 0' });
    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Item non trouvé' });
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { currentStock: existing.currentStock + parseFloat(quantity), lastRestockDate: new Date(), lastRestockQuantity: parseFloat(quantity) },
      include: { ingredient: true },
    });
    logAudit(req.user.userId, req.restaurantId, 'UPDATE', 'inventory', id, { action: 'restock', quantity: parseFloat(quantity), oldStock: existing.currentStock, newStock: item.currentStock });
    res.json(item);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur réapprovisionnement' }); }
});

// ============ DELETE /api/inventory/:id ============
router.delete('/:id', async (req: any, res) => {
  try {
    const existing = await prisma.inventoryItem.findFirst({ where: { id: parseInt(req.params.id), restaurantId: req.restaurantId } });
    if (!existing) return res.status(404).json({ error: 'Élément inventaire non trouvé' });
    await prisma.inventoryItem.delete({ where: { id: existing.id } });
    logAudit(req.user.userId, req.restaurantId, 'DELETE', 'inventory', existing.id);
    res.status(204).send();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur suppression inventaire' }); }
});

// ============ GET /api/inventory/auto-reorder ============
// Analyze inventory + suggest reorders grouped by supplier.
router.get('/auto-reorder', async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: { ingredient: { include: { supplierRef: true } } },
    });

    const lowStockItems = items.filter((item: any) => item.currentStock < item.minStock && item.minStock > 0);

    const bySupplier: Record<string, {
      supplierId: number | null;
      supplier: string;
      items: { ingredientId: number; ingredient: string; currentStock: number; minQuantity: number; unit: string; suggestedQty: number; estimatedCost: number }[];
      totalCost: number;
    }> = {};

    for (const item of lowStockItems) {
      const supplierName = (item as any).ingredient.supplierRef?.name || (item as any).ingredient.supplier || 'Sans fournisseur';
      const supplierId = (item as any).ingredient.supplierId || null;
      const key = supplierName;

      if (!bySupplier[key]) {
        bySupplier[key] = { supplierId, supplier: supplierName, items: [], totalCost: 0 };
      }

      const minQty = item.minStock;
      const suggestedQty = Math.max(minQty * 2 - item.currentStock, 0);
      const unitDivisor = getUnitDivisor((item as any).ingredient.unit);
      const estimatedCost = (suggestedQty / unitDivisor) * (item as any).ingredient.pricePerUnit;

      bySupplier[key].items.push({
        ingredientId: (item as any).ingredient.id,
        ingredient: (item as any).ingredient.name,
        currentStock: item.currentStock,
        minQuantity: minQty,
        unit: item.unit || (item as any).ingredient.unit,
        suggestedQty: Math.round(suggestedQty * 100) / 100,
        estimatedCost: Math.round(estimatedCost * 100) / 100,
      });
      bySupplier[key].totalCost += estimatedCost;
    }

    const result = Object.values(bySupplier).map(group => ({
      ...group,
      totalCost: Math.round(group.totalCost * 100) / 100,
    }));

    res.json(result);
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur analyse réapprovisionnement auto' }); }
});

// ============ POST /api/inventory/auto-reorder/confirm ============
// Create marketplace orders from suggestions.
router.post('/auto-reorder/confirm', async (req: any, res) => {
  try {
    const { orders } = req.body;
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Aucune commande à créer' });
    }

    const createdIds: number[] = [];

    for (const order of orders) {
      const orderItems = order.items.map((item: any) => ({
        productName: item.productName || item.ingredient || '',
        quantity: item.quantity || 1,
        unit: item.unit || '',
        unitPrice: item.unitPrice || 0,
        total: (item.quantity || 1) * (item.unitPrice || 0),
        ingredientId: item.ingredientId || null,
      }));

      const totalHT = orderItems.reduce((sum: number, i: any) => sum + i.total, 0);

      const created = await prisma.marketplaceOrder.create({
        data: {
          supplierName: order.supplier,
          supplierId: order.supplierId || null,
          totalHT,
          notes: 'Commande auto-réapprovisionnement',
          restaurantId: req.restaurantId,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      createdIds.push(created.id);
    }

    logAudit(req.user.userId, req.restaurantId, 'CREATE', 'auto-reorder', 0, { orderIds: createdIds, count: createdIds.length });
    res.status(201).json({ orderIds: createdIds, count: createdIds.length });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur création commandes auto-réapprovisionnement' }); }
});

export default router;
