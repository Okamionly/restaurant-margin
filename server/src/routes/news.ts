import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';
import { getUnitDivisor } from '../utils/unitConversion';

const prisma = new PrismaClient();
export const newsRouter = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Rate limit per restaurant pour la génération
const generateRateLimit = new Map<number, number>();
const GENERATE_COOLDOWN_MS = 60 * 60 * 1000; // 1h entre chaque génération

function getLatestMercurialeFile(): { content: string; date: string } | null {
  try {
    // Chemin relatif depuis le répertoire de travail (restaurant-margin/)
    const prixDir = path.join(process.cwd(), '..', 'docs', 'prix');
    if (!fs.existsSync(prixDir)) return null;

    const files = fs.readdirSync(prixDir)
      .filter(f => f.startsWith('mercuriale-') && f.endsWith('.md'))
      .sort()
      .reverse();

    if (files.length === 0) return null;

    const latest = files[0];
    const dateMatch = latest.match(/mercuriale-(\d{4}-\d{2}-\d{2})\.md/);
    const date = dateMatch ? dateMatch[1] : latest;
    const content = fs.readFileSync(path.join(prixDir, latest), 'utf-8');
    return { content, date };
  } catch {
    return null;
  }
}

async function buildRestaurantIngredientContext(restaurantId: number): Promise<string> {
  const [ingredients, recipes, priceHistory] = await Promise.all([
    prisma.ingredient.findMany({
      where: { restaurantId },
      include: { supplierRef: { select: { name: true } } },
      orderBy: { pricePerUnit: 'desc' },
      take: 30,
    }),
    prisma.recipe.findMany({
      where: { restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
      take: 20,
    }),
    prisma.priceHistory.findMany({
      where: { restaurantId },
      orderBy: { date: 'desc' },
      take: 50,
    }),
  ]);

  const ingredientsList = ingredients.map(i =>
    `- ${i.name} (${i.category}): ${i.pricePerUnit}€/${i.unit}${i.supplierRef ? ` — ${i.supplierRef.name}` : ''}`
  ).join('\n');

  const recipesList = recipes.map(r => {
    const foodCost = r.ingredients.reduce((sum, ri) => sum + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
    const margin = r.sellingPrice > 0 ? ((r.sellingPrice - foodCost) / r.sellingPrice * 100) : 0;
    return `- ${r.name}: vente ${r.sellingPrice}€, coût ${foodCost.toFixed(2)}€, marge ${margin.toFixed(1)}%`;
  }).join('\n');

  // Détecter hausses récentes dans l'historique
  const recentAlerts: string[] = [];
  const grouped = new Map<number, typeof priceHistory>();
  for (const ph of priceHistory) {
    if (!grouped.has(ph.ingredientId)) grouped.set(ph.ingredientId, []);
    grouped.get(ph.ingredientId)!.push(ph);
  }
  for (const [, history] of grouped) {
    if (history.length >= 2) {
      const [latest, prev] = history;
      const change = ((latest.price - prev.price) / prev.price) * 100;
      if (Math.abs(change) >= 5) {
        const ing = ingredients.find(i => i.id === latest.ingredientId);
        if (ing) {
          recentAlerts.push(`- ${ing.name}: ${change > 0 ? '+' : ''}${change.toFixed(1)}% (${prev.price}€ → ${latest.price}€)`);
        }
      }
    }
  }

  return `=== MES INGRÉDIENTS (${ingredients.length}) ===
${ingredientsList || 'Aucun ingrédient enregistré'}

=== MES FICHES TECHNIQUES (${recipes.length}) ===
${recipesList || 'Aucune recette'}

=== VARIATIONS DE PRIX RÉCENTES ===
${recentAlerts.length > 0 ? recentAlerts.join('\n') : 'Aucune variation détectée'}`;
}

// GET /api/news — liste les actualités non-rejetées
newsRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const news = await prisma.newsItem.findMany({
      where: {
        dismissed: false,
        OR: [
          { restaurantId },
          { restaurantId: null },
        ],
      },
      orderBy: [
        { priority: 'asc' }, // high < normal < low alphabetically → use createdAt as secondary
        { createdAt: 'desc' },
      ],
    });

    // Tri manuel par priorité
    const priorityOrder: Record<string, number> = { high: 0, normal: 1, low: 2 };
    news.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 1;
      const pb = priorityOrder[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json(news);
  } catch (error) {
    console.error('GET /api/news error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des actualités' });
  }
});

// POST /api/news/generate — génère les actualités IA depuis la mercuriale + contexte restaurant
newsRouter.post('/generate', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;

    if (!process.env.ANTHROPIC_API_KEY) {
      res.status(503).json({ error: 'Service IA non configuré' });
      return;
    }

    // Cooldown: éviter les appels trop fréquents
    const lastGen = generateRateLimit.get(restaurantId);
    if (lastGen && Date.now() - lastGen < GENERATE_COOLDOWN_MS) {
      const waitMin = Math.ceil((GENERATE_COOLDOWN_MS - (Date.now() - lastGen)) / 60000);
      res.status(429).json({ error: `Actualités déjà générées récemment. Réessayez dans ${waitMin} min.` });
      return;
    }

    const mercuriale = getLatestMercurialeFile();
    const restaurantContext = await buildRestaurantIngredientContext(restaurantId);

    const mercurialeSection = mercuriale
      ? `=== MERCURIALE MARCHÉ DU ${mercuriale.date} ===\n${mercuriale.content.slice(0, 6000)}`
      : '=== MERCURIALE ===\nAucune mercuriale disponible. Génère des conseils généraux de saison.';

    const prompt = `Tu es l'agent Actualités de RestauMargin. Tu génères des actualités pertinentes pour un restaurateur français.

${mercurialeSection}

${restaurantContext}

Génère exactement 5 à 7 actualités en JSON. Chaque actualité doit être directement actionnables et personnalisées par rapport aux ingrédients du restaurant si disponibles.

Réponds UNIQUEMENT avec un tableau JSON valide (sans markdown, sans backticks), au format exact :
[
  {
    "title": "Titre court et percutant (max 80 caractères)",
    "content": "Explication détaillée et actionnable avec chiffres précis (2-4 phrases max)",
    "type": "price_alert|opportunity|trend|tip",
    "priority": "high|normal|low"
  }
]

Types :
- price_alert : hausse de prix significative (>5%) impactant les marges
- opportunity : baisse de prix ou produit moins cher à substituer
- trend : tendance de marché à surveiller
- tip : conseil pratique d'optimisation de marge

Priorités :
- high : impact immédiat sur les marges (>5% d'économie ou de coût)
- normal : à prendre en compte cette semaine
- low : information générale

Personnalise les actualités selon les ingrédients réels du restaurant. Si le restaurant utilise du saumon, parle du prix du saumon. Si le restaurant a une marge basse sur une recette, mentionne-la.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.type === 'text' ? b.text : '')
      .join('');

    // Parser le JSON retourné par Claude
    let newsItems: Array<{ title: string; content: string; type: string; priority: string }>;
    try {
      const cleaned = rawText.trim().replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      newsItems = JSON.parse(cleaned);
      if (!Array.isArray(newsItems)) throw new Error('Réponse non valide');
    } catch {
      console.error('Failed to parse AI news response:', rawText);
      res.status(500).json({ error: 'Erreur lors du parsing des actualités IA' });
      return;
    }

    // Supprimer les anciennes actualités IA non-rejetées pour ce restaurant
    await prisma.newsItem.deleteMany({
      where: { restaurantId },
    });

    // Créer les nouvelles actualités
    const created = await prisma.newsItem.createMany({
      data: newsItems.map(item => ({
        restaurantId,
        title: String(item.title).slice(0, 200),
        content: String(item.content).slice(0, 1000),
        type: ['price_alert', 'opportunity', 'trend', 'tip'].includes(item.type) ? item.type : 'tip',
        priority: ['high', 'normal', 'low'].includes(item.priority) ? item.priority : 'normal',
        dismissed: false,
        mercurialeRef: mercuriale?.date ?? null,
      })),
    });

    generateRateLimit.set(restaurantId, Date.now());

    // Retourner les actualités créées
    const newsList = await prisma.newsItem.findMany({
      where: { restaurantId, dismissed: false },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ count: created.count, items: newsList });
  } catch (error) {
    console.error('POST /api/news/generate error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des actualités' });
  }
});

// PATCH /api/news/:id/dismiss — rejeter une actualité
newsRouter.patch('/:id/dismiss', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }

    // Vérifier que l'actualité appartient au restaurant
    const item = await prisma.newsItem.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!item) {
      res.status(404).json({ error: 'Actualité non trouvée' });
      return;
    }

    await prisma.newsItem.update({
      where: { id },
      data: { dismissed: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/news/:id/dismiss error:', error);
    res.status(500).json({ error: 'Erreur lors du rejet de l\'actualité' });
  }
});
