import { Router } from 'express';
import { prisma, authWithRestaurant } from '../middleware';

const router = Router();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BOM = '\ufeff'; // UTF-8 BOM for Excel FR compatibility
const SEP = ';';      // Semicolon separator for French Excel

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // Escape fields containing separator, quotes, or newlines
  if (str.includes(SEP) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function buildCsvRow(fields: any[]): string {
  return fields.map(escapeCsvField).join(SEP);
}

function buildCsv(headers: string[], rows: any[][]): string {
  const headerLine = buildCsvRow(headers);
  const dataLines = rows.map((row) => buildCsvRow(row));
  return BOM + [headerLine, ...dataLines].join('\r\n');
}

function setCsvHeaders(res: any, filename: string) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
}

function formatDate(d: Date | string | null): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatNumber(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined) return '';
  return n.toFixed(decimals).replace('.', ',');
}

// ---------------------------------------------------------------------------
// 1. Export Ingredients & Costs
// GET /api/export/ingredients-costs
// ---------------------------------------------------------------------------

router.get('/ingredients-costs', authWithRestaurant, async (req: any, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId: req.restaurantId },
      include: { supplierRef: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });

    const headers = [
      'Nom',
      'Categorie',
      'Unite',
      'Prix unitaire (EUR)',
      'Fournisseur',
      'Allergenes',
      'Date creation',
      'Derniere mise a jour',
    ];

    const rows = ingredients.map((ing) => [
      ing.name,
      ing.category,
      ing.unit,
      formatNumber(ing.pricePerUnit),
      ing.supplierRef?.name || ing.supplier || '',
      (ing.allergens || []).join(', '),
      formatDate(ing.createdAt),
      formatDate(ing.updatedAt),
    ]);

    const csv = buildCsv(headers, rows);
    const date = new Date().toISOString().slice(0, 10);
    setCsvHeaders(res, `ingredients-couts_${date}.csv`);
    res.send(csv);
  } catch (e: any) {
    console.error('[EXPORT] ingredients-costs error:', e.message);
    res.status(500).json({ error: 'Erreur export ingredients' });
  }
});

// ---------------------------------------------------------------------------
// 2. Export Recipes & Margins
// GET /api/export/recipes-margins
// ---------------------------------------------------------------------------

router.get('/recipes-margins', authWithRestaurant, async (req: any, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId: req.restaurantId },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const headers = [
      'Nom recette',
      'Categorie',
      'Nombre de portions',
      'Cout matiere total (EUR)',
      'Cout par portion (EUR)',
      'Prix de vente HT (EUR)',
      'Marge brute (EUR)',
      'Marge brute (%)',
      'Coefficient multiplicateur',
      'Food Cost (%)',
      'Temps preparation (min)',
      'Temps cuisson (min)',
    ];

    const rows = recipes.map((recipe) => {
      const totalCost = recipe.ingredients.reduce((sum, ri) => {
        const wasteMult = 1 + (ri.wastePercent || 0) / 100;
        return sum + ri.quantity * ri.ingredient.pricePerUnit * wasteMult;
      }, 0);
      const costPerPortion = recipe.nbPortions > 0 ? totalCost / recipe.nbPortions : totalCost;
      const sellingPrice = recipe.sellingPrice;
      const margin = sellingPrice - costPerPortion;
      const marginPct = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;
      const coefficient = costPerPortion > 0 ? sellingPrice / costPerPortion : 0;
      const foodCostPct = sellingPrice > 0 ? (costPerPortion / sellingPrice) * 100 : 0;

      return [
        recipe.name,
        recipe.category,
        recipe.nbPortions,
        formatNumber(totalCost),
        formatNumber(costPerPortion),
        formatNumber(sellingPrice),
        formatNumber(margin),
        formatNumber(marginPct, 1),
        formatNumber(coefficient, 2),
        formatNumber(foodCostPct, 1),
        recipe.prepTimeMinutes ?? '',
        recipe.cookTimeMinutes ?? '',
      ];
    });

    const csv = buildCsv(headers, rows);
    const date = new Date().toISOString().slice(0, 10);
    setCsvHeaders(res, `recettes-marges_${date}.csv`);
    res.send(csv);
  } catch (e: any) {
    console.error('[EXPORT] recipes-margins error:', e.message);
    res.status(500).json({ error: 'Erreur export recettes' });
  }
});

// ---------------------------------------------------------------------------
// 3. Export Orders History (Invoices)
// GET /api/export/orders-history?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
// ---------------------------------------------------------------------------

router.get('/orders-history', authWithRestaurant, async (req: any, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const where: any = { restaurantId: req.restaurantId };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) {
        const to = new Date(dateTo as string);
        to.setHours(23, 59, 59, 999);
        where.createdAt.lte = to;
      }
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'N° Facture',
      'Fournisseur',
      'Date facture',
      'Statut',
      'Produit',
      'Quantite',
      'Unite',
      'Prix unitaire (EUR)',
      'Total ligne (EUR)',
      'Total facture (EUR)',
    ];

    const rows: any[][] = [];
    for (const inv of invoices) {
      if (inv.items.length === 0) {
        rows.push([
          inv.invoiceNumber,
          inv.supplierName,
          inv.invoiceDate,
          inv.status,
          '',
          '',
          '',
          '',
          '',
          formatNumber(inv.totalAmount),
        ]);
      } else {
        for (const item of inv.items) {
          rows.push([
            inv.invoiceNumber,
            inv.supplierName,
            inv.invoiceDate,
            inv.status,
            item.productName,
            formatNumber(item.quantity),
            item.unit,
            formatNumber(item.unitPrice),
            formatNumber(item.total),
            formatNumber(inv.totalAmount),
          ]);
        }
      }
    }

    const csv = buildCsv(headers, rows);
    const date = new Date().toISOString().slice(0, 10);
    setCsvHeaders(res, `historique-commandes_${date}.csv`);
    res.send(csv);
  } catch (e: any) {
    console.error('[EXPORT] orders-history error:', e.message);
    res.status(500).json({ error: 'Erreur export commandes' });
  }
});

// ---------------------------------------------------------------------------
// 4. Export Inventory Valuation
// GET /api/export/inventory-valuation
// ---------------------------------------------------------------------------

router.get('/inventory-valuation', authWithRestaurant, async (req: any, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { restaurantId: req.restaurantId },
      include: {
        ingredient: {
          include: { supplierRef: { select: { name: true } } },
        },
      },
      orderBy: { ingredient: { name: 'asc' } },
    });

    const headers = [
      'Ingredient',
      'Categorie',
      'Fournisseur',
      'Unite',
      'Stock actuel',
      'Stock minimum',
      'Prix unitaire (EUR)',
      'Valeur stock (EUR)',
      'Statut stock',
      'Dernier restock',
    ];

    let totalValuation = 0;
    const rows = items.map((item) => {
      const valuation = item.currentStock * item.ingredient.pricePerUnit;
      totalValuation += valuation;
      const stockStatus =
        item.currentStock <= 0
          ? 'Rupture'
          : item.currentStock <= item.minStock
            ? 'Alerte'
            : 'OK';

      return [
        item.ingredient.name,
        item.ingredient.category,
        item.ingredient.supplierRef?.name || item.ingredient.supplier || '',
        item.unit,
        formatNumber(item.currentStock),
        formatNumber(item.minStock),
        formatNumber(item.ingredient.pricePerUnit),
        formatNumber(valuation),
        stockStatus,
        item.lastRestockDate ? formatDate(item.lastRestockDate) : '',
      ];
    });

    // Add a total row
    rows.push([]);
    rows.push(['TOTAL VALORISATION', '', '', '', '', '', '', formatNumber(totalValuation), '', '']);

    const csv = buildCsv(headers, rows);
    const date = new Date().toISOString().slice(0, 10);
    setCsvHeaders(res, `valorisation-stock_${date}.csv`);
    res.send(csv);
  } catch (e: any) {
    console.error('[EXPORT] inventory-valuation error:', e.message);
    res.status(500).json({ error: 'Erreur export inventaire' });
  }
});

// ---------------------------------------------------------------------------
// 5. Export Monthly Report (P&L Summary)
// GET /api/export/monthly-report?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
// ---------------------------------------------------------------------------

router.get('/monthly-report', authWithRestaurant, async (req: any, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    // Default to current month if no dates
    const now = new Date();
    const from = dateFrom
      ? (dateFrom as string)
      : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const to = dateTo
      ? (dateTo as string)
      : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`;

    // Fetch financial entries
    const entries = await prisma.financialEntry.findMany({
      where: {
        restaurantId: req.restaurantId,
        date: { gte: from, lte: to },
      },
      orderBy: { date: 'asc' },
    });

    // Aggregate by category and type
    const revenueByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    let totalRevenue = 0;
    let totalExpense = 0;

    for (const entry of entries) {
      if (entry.type === 'revenue') {
        revenueByCategory[entry.category] = (revenueByCategory[entry.category] || 0) + entry.amount;
        totalRevenue += entry.amount;
      } else {
        expenseByCategory[entry.category] = (expenseByCategory[entry.category] || 0) + entry.amount;
        totalExpense += entry.amount;
      }
    }

    // Also fetch invoice totals for the period (achats fournisseurs)
    const invoices = await prisma.invoice.findMany({
      where: {
        restaurantId: req.restaurantId,
        createdAt: {
          gte: new Date(from),
          lte: new Date(to + 'T23:59:59.999Z'),
        },
      },
    });
    const totalInvoices = invoices.reduce((s, i) => s + i.totalAmount, 0);

    // Also fetch sales for the period
    const sales = await prisma.menuSale.findMany({
      where: {
        restaurantId: req.restaurantId,
        date: { gte: from, lte: to },
      },
    });
    const totalSalesRevenue = sales.reduce((s, sale) => s + sale.revenue, 0);
    const totalCovers = sales.reduce((s, sale) => s + sale.quantity, 0);

    // Build report CSV
    const headers = ['Poste', 'Montant (EUR)', 'Part du CA (%)'];
    const rows: any[][] = [];

    // Section: Revenus
    rows.push(['=== REVENUS ===', '', '']);
    rows.push(['Chiffre d\'affaires (ventes plats)', formatNumber(totalSalesRevenue), '100,0']);
    for (const [cat, amt] of Object.entries(revenueByCategory)) {
      const pct = totalRevenue > 0 ? (amt / (totalSalesRevenue || totalRevenue)) * 100 : 0;
      rows.push([`  ${cat}`, formatNumber(amt), formatNumber(pct, 1)]);
    }
    rows.push(['Total revenus (ecritures)', formatNumber(totalRevenue), '']);
    rows.push([]);

    // Section: Charges
    rows.push(['=== CHARGES ===', '', '']);
    rows.push(['Achats fournisseurs (factures)', formatNumber(totalInvoices), formatNumber(totalSalesRevenue > 0 ? (totalInvoices / totalSalesRevenue) * 100 : 0, 1)]);
    for (const [cat, amt] of Object.entries(expenseByCategory)) {
      const ref = totalSalesRevenue || totalRevenue || 1;
      const pct = (amt / ref) * 100;
      rows.push([`  ${cat}`, formatNumber(amt), formatNumber(pct, 1)]);
    }
    rows.push(['Total charges (ecritures)', formatNumber(totalExpense), '']);
    rows.push([]);

    // Section: Synthesis
    const margeBrute = totalSalesRevenue - totalInvoices;
    const resultat = totalRevenue - totalExpense;
    rows.push(['=== SYNTHESE ===', '', '']);
    rows.push(['CA Ventes', formatNumber(totalSalesRevenue), '']);
    rows.push(['Achats matieres', formatNumber(totalInvoices), '']);
    rows.push(['Marge brute', formatNumber(margeBrute), formatNumber(totalSalesRevenue > 0 ? (margeBrute / totalSalesRevenue) * 100 : 0, 1)]);
    rows.push(['Resultat (revenus - charges)', formatNumber(resultat), '']);
    rows.push(['Couverts vendus', String(totalCovers), '']);
    rows.push(['Ticket moyen', formatNumber(totalCovers > 0 ? totalSalesRevenue / totalCovers : 0), '']);
    rows.push([]);
    rows.push([`Periode : du ${from} au ${to}`, '', '']);

    const csv = buildCsv(headers, rows);
    const date = new Date().toISOString().slice(0, 10);
    setCsvHeaders(res, `rapport-mensuel_${from}_${to}.csv`);
    res.send(csv);
  } catch (e: any) {
    console.error('[EXPORT] monthly-report error:', e.message);
    res.status(500).json({ error: 'Erreur export rapport mensuel' });
  }
});

export default router;
