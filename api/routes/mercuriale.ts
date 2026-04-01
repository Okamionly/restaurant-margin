import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { prisma, authMiddleware, authWithRestaurant } from '../middleware';
import { checkAiRateLimit } from './ai';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// GET /api/mercuriale/latest — Public (no auth needed) — latest publication + all data
router.get('/latest', async (_req, res) => {
  try {
    const publications: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_publications
      WHERE published = true
      ORDER BY week_date DESC
      LIMIT 1
    `;
    if (!publications.length) {
      return res.json({ publication: null, prices: [], alerts: [], alternatives: [] });
    }
    const pub = publications[0];
    const prices: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_prices
      WHERE publication_id = ${pub.id}
      ORDER BY category, ingredient_name
    `;
    const alerts: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_alerts
      WHERE publication_id = ${pub.id}
      ORDER BY type, ingredient_name
    `;
    const alternatives: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_alternatives
      WHERE publication_id = ${pub.id}
      ORDER BY product
    `;
    res.json({ publication: pub, prices, alerts, alternatives });
  } catch (e: any) {
    console.error('[MERCURIALE LATEST]', e);
    res.status(500).json({ error: 'Erreur chargement mercuriale' });
  }
});

// GET /api/mercuriale/publications — Admin: list all publications
router.get('/publications', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const pubs: any[] = await prisma.$queryRaw`
      SELECT * FROM mercuriale_publications ORDER BY week_date DESC
    `;
    res.json(pubs);
  } catch (e: any) {
    console.error('[MERCURIALE PUBS]', e);
    res.status(500).json({ error: 'Erreur liste publications' });
  }
});

// POST /api/mercuriale/publications — Admin: create publication
router.post('/publications', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const { title, week_date, sources, published } = req.body;
    if (!title || !week_date) return res.status(400).json({ error: 'title et week_date requis' });
    const result: any[] = await prisma.$queryRaw`
      INSERT INTO mercuriale_publications (title, week_date, sources, published)
      VALUES (${title}, ${new Date(week_date)}, ${sources || null}, ${published !== false})
      RETURNING *
    `;
    res.json(result[0]);
  } catch (e: any) {
    console.error('[MERCURIALE CREATE PUB]', e);
    res.status(500).json({ error: 'Erreur création publication' });
  }
});

// POST /api/mercuriale/publications/:id/prices — Admin: add prices
router.post('/publications/:id/prices', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const publicationId = parseInt(req.params.id);
    const { prices } = req.body;
    if (!Array.isArray(prices) || !prices.length) return res.status(400).json({ error: 'prices array requis' });
    const inserted: any[] = [];
    for (const p of prices) {
      const result: any[] = await prisma.$queryRaw`
        INSERT INTO mercuriale_prices (publication_id, category, ingredient_name, supplier, price_min, price_max, unit, trend, trend_detail)
        VALUES (${publicationId}, ${p.category}, ${p.ingredient_name}, ${p.supplier || null}, ${p.price_min || null}, ${p.price_max || null}, ${p.unit || 'kg'}, ${p.trend || null}, ${p.trend_detail || null})
        RETURNING *
      `;
      inserted.push(result[0]);
    }
    res.json({ count: inserted.length, prices: inserted });
  } catch (e: any) {
    console.error('[MERCURIALE ADD PRICES]', e);
    res.status(500).json({ error: 'Erreur ajout prix' });
  }
});

// POST /api/mercuriale/publications/:id/alerts — Admin: add alerts
router.post('/publications/:id/alerts', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const publicationId = parseInt(req.params.id);
    const { alerts } = req.body;
    if (!Array.isArray(alerts) || !alerts.length) return res.status(400).json({ error: 'alerts array requis' });
    const inserted: any[] = [];
    for (const a of alerts) {
      const result: any[] = await prisma.$queryRaw`
        INSERT INTO mercuriale_alerts (publication_id, type, ingredient_name, variation, action_text, saving)
        VALUES (${publicationId}, ${a.type}, ${a.ingredient_name}, ${a.variation || null}, ${a.action_text || null}, ${a.saving || null})
        RETURNING *
      `;
      inserted.push(result[0]);
    }
    res.json({ count: inserted.length, alerts: inserted });
  } catch (e: any) {
    console.error('[MERCURIALE ADD ALERTS]', e);
    res.status(500).json({ error: 'Erreur ajout alertes' });
  }
});

// POST /api/mercuriale/publications/:id/alternatives — Admin: add alternatives
router.post('/publications/:id/alternatives', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const publicationId = parseInt(req.params.id);
    const { alternatives } = req.body;
    if (!Array.isArray(alternatives) || !alternatives.length) return res.status(400).json({ error: 'alternatives array requis' });
    const inserted: any[] = [];
    for (const alt of alternatives) {
      const result: any[] = await prisma.$queryRaw`
        INSERT INTO mercuriale_alternatives (publication_id, product, alternative, saving_per_kg)
        VALUES (${publicationId}, ${alt.product}, ${alt.alternative}, ${alt.saving_per_kg || null})
        RETURNING *
      `;
      inserted.push(result[0]);
    }
    res.json({ count: inserted.length, alternatives: inserted });
  } catch (e: any) {
    console.error('[MERCURIALE ADD ALTS]', e);
    res.status(500).json({ error: 'Erreur ajout alternatives' });
  }
});

// ── Mercuriale: Search ingredient prices ──
router.get('/search', authWithRestaurant, async (req: any, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json([]);
    }
    const searchTerm = `%${q}%`;
    const prices: any[] = await prisma.$queryRaw`
      SELECT ingredient_name, price_min, price_max, unit, supplier, trend, trend_detail, category
      FROM mercuriale_prices
      WHERE LOWER(ingredient_name) LIKE LOWER(${searchTerm})
      ORDER BY ingredient_name
      LIMIT 10
    `;
    res.json(prices.map((p: any) => ({
      name: p.ingredient_name,
      priceMin: p.price_min != null ? Number(p.price_min) : null,
      priceMax: p.price_max != null ? Number(p.price_max) : null,
      unit: p.unit,
      supplier: p.supplier,
      trend: p.trend,
      trendDetail: p.trend_detail,
      category: p.category,
    })));
  } catch (e: any) {
    console.error('[MERCURIALE SEARCH]', e.message);
    res.status(500).json({ error: 'Erreur recherche mercuriale' });
  }
});

// ── Mercuriale: AI suggest ingredients for a recipe ──
router.get('/suggest', authWithRestaurant, async (req: any, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Nom de recette requis (min 2 caractères)' });
    }

    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    // Step 1: Ask Claude for typical ingredients
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: `Tu es un chef cuisinier professionnel français. Pour une recette donnée, liste les ingrédients typiques avec les quantités pour 4 portions. Réponds UNIQUEMENT en JSON valide, sans texte avant ni après : [{"name": "nom ingrédient", "quantity": nombre, "unit": "kg|g|L|cl|pièce"}]`,
      messages: [{
        role: 'user',
        content: `Liste les ingrédients typiques pour la recette : "${q}"`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    let aiIngredients: { name: string; quantity: number; unit: string }[] = [];
    try {
      aiIngredients = JSON.parse(text);
      if (!Array.isArray(aiIngredients)) aiIngredients = [];
    } catch {
      return res.json({ ingredients: [], raw: text });
    }

    // Step 2: For each ingredient, search mercuriale_prices
    const enriched = await Promise.all(
      aiIngredients.map(async (ing) => {
        const searchTerm = `%${ing.name}%`;
        const prices: any[] = await prisma.$queryRaw`
          SELECT ingredient_name, price_min, price_max, unit, supplier, trend, trend_detail
          FROM mercuriale_prices
          WHERE LOWER(ingredient_name) LIKE LOWER(${searchTerm})
          ORDER BY ingredient_name
          LIMIT 1
        `;
        const match = prices[0] || null;
        return {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          marketPrice: match ? (Number(match.price_min) + Number(match.price_max)) / 2 : null,
          priceMin: match ? Number(match.price_min) : null,
          priceMax: match ? Number(match.price_max) : null,
          supplier: match?.supplier || null,
          trend: match?.trend || null,
          trendDetail: match?.trend_detail || null,
        };
      })
    );

    res.json({ ingredients: enriched });
  } catch (e: any) {
    console.error('[MERCURIALE SUGGEST]', e.message);
    res.status(500).json({ error: 'Erreur suggestion ingrédients' });
  }
});

export default router;
