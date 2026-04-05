import { Router, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';
import { getUnitDivisor } from '../utils/unitConversion';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
export const alertsRouter = Router();

const EMAIL_FROM = process.env.EMAIL_FROM || 'RestauMargin <onboarding@resend.dev>';

interface AlertItem {
  type: 'stock' | 'margin' | 'price';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  detail: string;
}

async function checkRestaurantAlerts(restaurantId: number): Promise<AlertItem[]> {
  const alerts: AlertItem[] = [];

  // 1. Low stock alerts
  const inventory = await prisma.inventoryItem.findMany({
    where: { restaurantId },
    include: { ingredient: true },
  });

  for (const item of inventory) {
    if (item.currentStock <= 0) {
      alerts.push({
        type: 'stock',
        severity: 'critical',
        title: `Rupture de stock : ${item.ingredient.name}`,
        detail: `Stock actuel : 0 ${item.ingredient.unit} (minimum : ${item.minStock})`,
      });
    } else if (item.currentStock < item.minStock) {
      alerts.push({
        type: 'stock',
        severity: 'warning',
        title: `Stock bas : ${item.ingredient.name}`,
        detail: `${item.currentStock}/${item.minStock} ${item.ingredient.unit}`,
      });
    }
  }

  // 2. Low margin recipes (< 60%)
  const recipes = await prisma.recipe.findMany({
    where: { restaurantId },
    include: { ingredients: { include: { ingredient: true } } },
  });

  for (const recipe of recipes) {
    if (recipe.sellingPrice <= 0) continue;
    const foodCost = recipe.ingredients.reduce(
      (sum, ri) => sum + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0
    );
    const margin = (recipe.sellingPrice - foodCost) / recipe.sellingPrice * 100;
    if (margin < 60) {
      alerts.push({
        type: 'margin',
        severity: margin < 40 ? 'critical' : 'warning',
        title: `Marge faible : ${recipe.name}`,
        detail: `Marge ${margin.toFixed(1)}% (coût ${foodCost.toFixed(2)}€ / prix ${recipe.sellingPrice}€)`,
      });
    }
  }

  return alerts;
}

function buildAlertEmailHTML(restaurantName: string, alerts: AlertItem[]): string {
  const critical = alerts.filter(a => a.severity === 'critical');
  const warnings = alerts.filter(a => a.severity === 'warning');

  const alertRow = (a: AlertItem) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">
        <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;color:white;background:${
          a.severity === 'critical' ? '#dc2626' : '#f59e0b'
        };">${a.severity === 'critical' ? 'CRITIQUE' : 'ATTENTION'}</span>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600;">${a.title}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;">${a.detail}</td>
    </tr>`;

  const frontendUrl = process.env.FRONTEND_URL || 'https://restaumargin.vercel.app';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:24px 32px;">
      <h1 style="color:white;margin:0;font-size:20px;">RestauMargin — Alertes</h1>
      <p style="color:#94a3b8;margin:4px 0 0;font-size:14px;">${restaurantName}</p>
    </div>
    <div style="padding:24px 32px;">
      ${critical.length > 0 ? `
      <h2 style="color:#dc2626;font-size:16px;margin:0 0 12px;">
        ${critical.length} alerte${critical.length > 1 ? 's' : ''} critique${critical.length > 1 ? 's' : ''}
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${critical.map(alertRow).join('')}
      </table>` : ''}
      ${warnings.length > 0 ? `
      <h2 style="color:#f59e0b;font-size:16px;margin:0 0 12px;">
        ${warnings.length} avertissement${warnings.length > 1 ? 's' : ''}
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${warnings.map(alertRow).join('')}
      </table>` : ''}
      ${alerts.length === 0 ? '<p style="color:#16a34a;font-weight:600;">Tout est en ordre ! Aucune alerte.</p>' : ''}
      <div style="text-align:center;margin-top:24px;">
        <a href="${frontendUrl}/dashboard" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Voir le Dashboard
        </a>
      </div>
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">RestauMargin — Gestion de marge intelligente</p>
    </div>
  </div>
</body>
</html>`;
}

// GET /api/alerts — get alerts for current restaurant
alertsRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const alerts = await checkRestaurantAlerts(req.restaurantId!);
    res.json({ alerts, count: alerts.length });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erreur alertes';
    res.status(500).json({ error: msg });
  }
});

// POST /api/alerts/send — send alert email to restaurant owner
alertsRouter.post('/send', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.restaurantId! },
      include: { owner: true },
    });

    if (!restaurant) {
      res.status(404).json({ error: 'Restaurant non trouvé' });
      return;
    }

    const alerts = await checkRestaurantAlerts(req.restaurantId!);
    if (alerts.length === 0) {
      res.json({ sent: false, message: 'Aucune alerte à envoyer' });
      return;
    }

    const html = buildAlertEmailHTML(restaurant.name, alerts);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: restaurant.owner.email,
      subject: `RestauMargin — ${alerts.filter(a => a.severity === 'critical').length} alertes critiques`,
      html,
    });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ sent: true, alertCount: alerts.length, messageId: data?.id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erreur envoi alertes';
    res.status(500).json({ error: msg });
  }
});

// POST /api/alerts/check-all — check all restaurants (internal/cron use)
alertsRouter.post('/check-all', async (req: Request, res: Response) => {
  const authHeader = req.headers['x-cron-secret'];
  if (authHeader !== process.env.CRON_SECRET && authHeader !== 'internal') {
    res.status(401).json({ error: 'Non autorisé' });
    return;
  }

  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { owner: true },
    });

    const results = [];
    for (const restaurant of restaurants) {
      const alerts = await checkRestaurantAlerts(restaurant.id);
      if (alerts.length === 0) continue;

      const html = buildAlertEmailHTML(restaurant.name, alerts);
      try {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: restaurant.owner.email,
          subject: `RestauMargin — ${alerts.filter(a => a.severity === 'critical').length} alertes pour ${restaurant.name}`,
          html,
        });
        results.push({ restaurant: restaurant.name, alerts: alerts.length, sent: true });
      } catch {
        results.push({ restaurant: restaurant.name, alerts: alerts.length, sent: false });
      }
    }

    res.json({ checked: restaurants.length, results });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erreur check-all';
    res.status(500).json({ error: msg });
  }
});
