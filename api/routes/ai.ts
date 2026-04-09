import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { prisma, authWithRestaurant } from '../middleware';
import { buildOrderEmail } from '../utils/emailTemplates';
import { getUnitDivisor } from '../utils/unitConversion';

const router = Router();

// ── AI Client & Rate Limiting ──
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
const aiRateLimit = new Map<number, { count: number; resetAt: number }>();
const aiRateLimitPerRestaurant = new Map<number, { count: number; resetAt: number }>();

// ── AI Response Cache (TTL 5 min, read-only intents only) ──
const responseCache = new Map<string, { response: any; timestamp: number }>();
const RESPONSE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getResponseCacheKey(restaurantId: number, message: string, intent: string): string {
  return `${restaurantId}:${intent}:${message.toLowerCase().trim().substring(0, 100)}`;
}

function getCachedResponse(key: string): any | null {
  const entry = responseCache.get(key);
  if (entry && Date.now() - entry.timestamp < RESPONSE_CACHE_TTL) return entry.response;
  responseCache.delete(key);
  return null;
}

function setCachedResponse(key: string, data: any): void {
  responseCache.set(key, { response: data, timestamp: Date.now() });
  // Evict old entries if cache grows too large
  if (responseCache.size > 200) {
    const now = Date.now();
    for (const [k, v] of responseCache) {
      if (now - v.timestamp > RESPONSE_CACHE_TTL) responseCache.delete(k);
    }
  }
}

// Intents that modify data should NOT be cached
const MUTABLE_INTENTS = ['recipe', 'ingredient', 'order', 'planning', 'haccp'];

// ── AI Context Cache (TTL 1h per restaurant) ──
const contextCache = new Map<number, { data: any; expires: number }>();
const CACHE_TTL = 3600000; // 1 hour

function getCachedContext(restaurantId: number): any | null {
  const entry = contextCache.get(restaurantId);
  if (entry && Date.now() < entry.expires) return entry.data;
  contextCache.delete(restaurantId);
  return null;
}

function setCachedContext(restaurantId: number, data: any): void {
  contextCache.set(restaurantId, { data, expires: Date.now() + CACHE_TTL });
}

// ── AI Intent Classification ──
type AiIntent = 'recipe' | 'ingredient' | 'order' | 'planning' | 'haccp' | 'analysis' | 'general';

async function classifyIntent(userMessage: string): Promise<AiIntent> {
  try {
    const intentResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 20,
      messages: [{ role: 'user', content: userMessage }],
      system: 'Classifie cette demande en UNE catégorie: recipe, ingredient, order, planning, haccp, analysis, general. Réponds UNIQUEMENT le mot.',
    });
    const raw = (intentResponse.content[0] as any).text?.trim().toLowerCase() || 'general';
    const valid: AiIntent[] = ['recipe', 'ingredient', 'order', 'planning', 'haccp', 'analysis', 'general'];
    return valid.includes(raw as AiIntent) ? (raw as AiIntent) : 'general';
  } catch {
    return 'general';
  }
}

export function checkAiRateLimit(restaurantId: number): boolean {
  const now = Date.now();
  const entry = aiRateLimitPerRestaurant.get(restaurantId);
  if (entry && now < entry.resetAt && entry.count >= 10) {
    return false;
  }
  if (!entry || now >= entry.resetAt) {
    aiRateLimitPerRestaurant.set(restaurantId, { count: 1, resetAt: now + 60000 });
  } else {
    entry.count++;
  }
  return true;
}

// ── AI Chat ──
router.post('/chat', authWithRestaurant, async (req: any, res) => {
  try {
    const { message, history, image } = req.body;
    if (!message) return res.status(400).json({ error: 'Message requis' });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });

    // Rate limit per user
    const userId = req.user?.userId || 0;
    const now = Date.now();
    const entry = aiRateLimit.get(userId);
    if (entry && now < entry.resetAt && entry.count >= 20) {
      return res.status(429).json({ error: 'Limite atteinte (20 questions/heure)' });
    }
    if (!entry || now > (entry?.resetAt || 0)) {
      aiRateLimit.set(userId, { count: 1, resetAt: now + 3600000 });
    } else { entry.count++; }

    const restaurantId = req.restaurantId;

    // ── Monthly AI quota check ──
    const month = new Date().toISOString().slice(0, 7);
    const MONTHLY_LIMIT = 500;
    const usageRows: any[] = await prisma.$queryRaw`
      SELECT requests_count FROM ai_usage
      WHERE restaurant_id = ${restaurantId} AND month = ${month}
    `;
    if (usageRows[0]?.requests_count >= MONTHLY_LIMIT) {
      return res.status(429).json({
        error: 'Quota IA mensuel atteint (500 requetes). Passez au plan Business pour plus.',
        usage: { used: usageRows[0].requests_count, limit: MONTHLY_LIMIT }
      });
    }

    // ── Step 1: Classify intent with Haiku (fast, cheap) ──
    const intent = await classifyIntent(message.trim());

    // ── Step 2: Load context based on intent (lazy loading + cache) ──
    const today = new Date().toISOString().slice(0, 10);
    let cached = getCachedContext(restaurantId);

    const needsRecipes = ['recipe', 'analysis', 'general'].includes(intent);
    const needsIngredients = ['recipe', 'ingredient', 'order', 'analysis', 'general'].includes(intent);
    const needsInventory = ['ingredient', 'order'].includes(intent);
    const needsSuppliers = ['order', 'ingredient'].includes(intent);
    const needsEmployees = ['planning'].includes(intent);
    const needsHaccp = ['haccp'].includes(intent);
    const needsSales = ['analysis'].includes(intent);

    const recipes = needsRecipes
      ? (cached?.recipes || await prisma.recipe.findMany({ where: { restaurantId }, include: { ingredients: { include: { ingredient: true } } }, take: 50 }))
      : [];
    const ingredients = needsIngredients
      ? (cached?.ingredients || await prisma.ingredient.findMany({ where: { restaurantId }, orderBy: { pricePerUnit: 'desc' }, take: 30 }))
      : [];
    const inventory = needsInventory
      ? (cached?.inventory || await prisma.inventoryItem.findMany({ where: { restaurantId }, include: { ingredient: true } }))
      : [];
    const suppliers = needsSuppliers
      ? (cached?.suppliers || await prisma.supplier.findMany({ where: { restaurantId }, take: 20 }))
      : [];
    const employees = needsEmployees
      ? (cached?.employees || await prisma.employee.findMany({ where: { restaurantId, active: true }, take: 30 }))
      : [];
    const recentTemps = needsHaccp
      ? await prisma.haccpTemperature.findMany({ where: { restaurantId, date: today }, orderBy: { createdAt: 'desc' }, take: 10 })
      : [];
    const recentSales = needsSales
      ? (cached?.recentSales || await prisma.menuSale.findMany({ where: { restaurantId }, orderBy: { date: 'desc' }, take: 100 }))
      : [];

    if (!cached) cached = {};
    if (needsRecipes && recipes.length) cached.recipes = recipes;
    if (needsIngredients && ingredients.length) cached.ingredients = ingredients;
    if (needsInventory && inventory.length) cached.inventory = inventory;
    if (needsSuppliers && suppliers.length) cached.suppliers = suppliers;
    if (needsEmployees && employees.length) cached.employees = employees;
    if (needsSales && recentSales.length) cached.recentSales = recentSales;
    setCachedContext(restaurantId, cached);

    const contextParts: string[] = [];

    if (recipes.length) {
      const recipesSummary = recipes.map((r: any) => {
        const cost = r.ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
        const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
        return `- ${r.name} (id:${r.id}, ${r.category}): vente ${r.sellingPrice}€, coût ${cost.toFixed(2)}€, marge ${margin.toFixed(1)}%`;
      }).join('\n');
      contextParts.push(`RECETTES (${recipes.length}):\n${recipesSummary}`);
    }

    if (ingredients.length) {
      const ingredientsList = ingredients.map((i: any) => `- ${i.name} (id:${i.id}, ${i.unit}, ${i.pricePerUnit}€/${i.unit}, catégorie: ${i.category})`).join('\n');
      contextParts.push(`INGRÉDIENTS (${ingredients.length}):\n${ingredientsList}`);
    }

    if (inventory.length) {
      const lowStock = inventory.filter((i: any) => i.currentStock < i.minStock);
      const stockAlerts = lowStock.length > 0
        ? lowStock.map((i: any) => `- ${i.ingredient.name} (id:${i.ingredientId}): ${i.currentStock}/${i.minStock} ${i.ingredient.unit}`).join('\n')
        : 'Aucune alerte';
      contextParts.push(`ALERTES STOCK:\n${stockAlerts}`);
    }

    if (suppliers.length) {
      const suppliersList = suppliers.map((s: any) => `- ${s.name} (id:${s.id})`).join('\n');
      contextParts.push(`FOURNISSEURS (${suppliers.length}):\n${suppliersList}`);
    }

    if (employees.length) {
      const employeesList = employees.map((e: any) => `- ${e.name} (id:${e.id}, ${e.role}, ${e.hourlyRate}€/h)`).join('\n');
      contextParts.push(`EMPLOYÉS (${employees.length}):\n${employeesList}`);
    }

    if (recentTemps.length) {
      const todayTemps = recentTemps.map((t: any) => `- ${t.zone}: ${t.temperature}°C (${t.status})`).join('\n');
      contextParts.push(`RELEVÉS HACCP AUJOURD'HUI:\n${todayTemps}`);
    }

    const context = contextParts.length > 0 ? contextParts.join('\n\n') : 'Aucune donnée chargée pour cette demande.';

    const actionSystemPrompt = `Tu es l'assistant IA conversationnel RestauMargin, expert en gestion restaurant. Tu analyses les données et agis via des blocs \`\`\`action JSON.

Tu dois :
- Poser des questions de suivi quand l'utilisateur est vague
- Guider l'utilisateur étape par étape
- Confirmer avant d'exécuter une action importante
- Être naturel et humain dans tes réponses

EXEMPLES DE CONVERSATIONS :

User: "Fais-moi une commande"
Assistant: "Bien sûr ! Qu'est-ce qu'il vous faut ? Dites-moi les produits et quantités."

User: "5kg tomates, 3kg poulet, 2L crème"
Assistant: "Voici votre commande :
- Tomates 5kg
- Poulet 3kg
- Crème 2L
Chez quel fournisseur ? Transgourmet est disponible avec les prix suivants :
- Tomates : 3.99€/kg (total 19.95€)
- Poulet fermier : 8.03€/kg (total 24.09€)
Total estimé : 52.04€ HT
Je l'envoie ?"

User: "Oui envoie"
Assistant: [EXECUTE create_order + send_order_email]
"Commande envoyée par email à Transgourmet ! Récapitulatif dans vos commandes."

User: "Crée-moi un menu du jour"
Assistant: "Pour combien de couverts ? Et quel budget par personne ?"

User: "30 couverts, 15€"
Assistant: "Voici ma suggestion basée sur vos ingrédients :
- Entrée : Salade de mesclun (coût 1.20€/portion)
- Plat : Filet de truite sauce beurre blanc (coût 3.38€/portion)
- Dessert : Mousse chocolat (coût 0.80€/portion)
Total coût : 5.38€ — Marge 64% à 15€
Je crée les fiches techniques ?"

IMPORTANT — MENU DE LA SEMAINE :
Quand l'utilisateur demande "fais-moi un menu de la semaine", "menu semaine", "suggère un menu", "menu de la semaine" :
1. Utilise l'action generate_weekly_menu pour récupérer le stock, la mercuriale et les recettes existantes
2. Avec les données retournées, construis un menu STRUCTURÉ pour chaque jour (lundi→vendredi) :
   - 1 entrée + 1 plat + 1 dessert par jour
   - Coût portion estimé pour chaque plat
   - Prix de vente suggéré (coefficient ×3 entrées, ×3.5 plats, ×4 desserts)
   - Marge estimée en %
3. RÈGLES DE CONSTRUCTION :
   - Utiliser en priorité les ingrédients en stock (données stock)
   - Profiter des prix en baisse de la mercuriale (opportunités)
   - Respecter la saisonnalité du mois en cours :
     * Janvier-Mars : poireaux, choux, endives, agrumes, carottes, navets, céleri
     * Avril-Juin : asperges, petits pois, fraises, radis, artichauts, fèves
     * Juillet-Septembre : tomates, courgettes, aubergines, pêches, melons, haricots verts
     * Octobre-Décembre : cèpes, potiron, châtaignes, pommes, poires, topinambours
   - VARIER les protéines (pas la même viande/poisson 2 jours de suite)
   - Varier les modes de cuisson (pas tout grillé ou tout en sauce)
4. FORMAT : Présenter sous forme de TABLEAU structuré avec colonnes Jour | Entrée | Plat | Dessert | Coût total | Prix vente | Marge %
5. Ajouter un RÉSUMÉ en bas : coût moyen/jour, marge moyenne, total hebdo estimé

IMPORTANT — CRÉATION DE RECETTE :
Quand l'utilisateur demande de créer une recette (ex: "Crée-moi un risotto aux cèpes") :
1. NE PAS créer directement avec create_recipe
2. D'abord ANALYSER et PROPOSER dans ta réponse textuelle :
   a) Lister les ingrédients nécessaires avec les prix marché (utilise les prix des ingrédients existants ou des prix réalistes restauration FR)
   b) Calculer le coût estimé par portion
   c) Proposer le prix de vente (coefficient ×3.5 sur le coût matière)
   d) Estimer la marge brute en %
3. Vérifier la SAISONNALITÉ et proposer des alternatives si hors saison :
   - Janvier-Mars : poireaux, choux, endives, agrumes, carottes, navets, céleri
   - Avril-Juin : asperges, petits pois, fraises, radis, artichauts, fèves
   - Juillet-Septembre : tomates, courgettes, aubergines, pêches, melons, haricots verts
   - Octobre-Décembre : cèpes, potiron, châtaignes, pommes, poires, topinambours
   Exemple : "Les cèpes sont hors saison en avril. Alternative : champignons de Paris (2.50€/kg vs 25€/kg pour les cèpes)"
4. Proposer 2-3 VARIANTES de saison avec meilleure marge si pertinent
   Exemple : "Je vous propose aussi : Risotto aux asperges vertes (de saison, marge 72%), Risotto forestier aux champignons de Paris (marge 68%)"
5. CORRIGER l'orthographe du nom de la recette si nécessaire
6. Proposer une IMAGE du plat :
   - Spoonacular : https://spoonacular.com/cdn/ingredients_500x500/{ingredient}.jpg
   - Ou Unsplash : https://images.unsplash.com/photo-{id}?w=500 si le plat est connu
7. DEMANDER CONFIRMATION : "Voulez-vous que je crée cette fiche technique ? Ou préférez-vous une variante ?"
8. SEULEMENT quand l'utilisateur confirme explicitement (oui, ok, crée-la, confirme, etc.), utiliser l'action create_recipe

ACTIONS (format: {"type":"<type>","data":{...}} entre \`\`\`action et \`\`\`):
- create_recipe(name, portions, category, sellingPrice, description?, ingredients[{name,quantity,unit,pricePerUnit,category}])
- update_recipe(recipeId, name?, sellingPrice?, category?, addIngredients?[], removeIngredients?[], updateIngredients?[{name,quantity}])
- analyze_recipe(recipeId) — calcul food cost détaillé
- duplicate_recipe(recipeId, newName)
- add_ingredient(name, unit, pricePerUnit, category, supplier?)
- update_price(ingredientId|ingredientName, newPrice, reason?)
- check_stock(ingredientNames[])
- create_order(supplierName, items[{productName,quantity,unit,unitPrice}])
- suggest_order(supplierName?) — basé sur stock bas
- add_supplier(name, phone?, email?, address?, city?, categories?[], contactName?, delivery?, minOrder?, paymentTerms?)
- compare_suppliers(ingredientName)
- add_shift(employeeName, date, startTime, endTime, type, notes?)
- weekly_planning(weekStart, shifts[{employeeName,date,startTime,endTime,type}])
- margin_analysis() — marges par plat/catégorie
- best_sellers(period: week|month|quarter)
- cost_alert() — hausses >5% sur 30j
- send_order_email(supplier, email, items[{name,quantity,unit,price}], notes?) — envoyer commande par email au fournisseur
- suggest_menu(covers, budget) — suggérer un menu basé sur les ingrédients disponibles
- generate_weekly_menu() — générer un menu complet de la semaine (lundi→vendredi) avec entrée+plat+dessert, coûts et marges
- daily_report(date)
- log_temperature(zone, temperature, recordedBy, notes?)
- cleaning_checklist(date)

PHOTO D'INGRÉDIENT : Si l'utilisateur envoie une photo, identifie le produit alimentaire visible, estime le poids/quantité si visible sur l'emballage ou visuellement, et propose une action add_ingredient avec le nom, la catégorie appropriée et le prix estimé depuis la mercuriale ou les prix marché restauration FR. Décris ce que tu vois et demande confirmation avant d'ajouter.

RÈGLES : Prix réalistes restauration FR. Catégories recettes: Entrées/Plats/Desserts/Boissons/Accompagnements. Catégories ingrédients: Viandes/Poissons/Légumes/Fruits/Produits laitiers/Épicerie sèche/Surgelés/Boissons/Condiments/Boulangerie. Unités: kg/g/L/cl/unité/botte/pièce. Shifts: Matin/Midi/Soir/Coupure. Zones HACCP: Frigo/Congélateur/Plats chauds/Réception. Toujours inclure ingrédients avec quantités/prix dans create_recipe. Utiliser les IDs visibles dans les données. Concis, max 400 mots, français.

DONNÉES DU RESTAURANT :
${context}`;

    // ── Step 3: Choose model + max_tokens based on intent ──
    // Sonnet ONLY for: image analysis & weekly menu generation (expensive tasks that need it)
    // Haiku for everything else (fast, cheap, good enough)
    const isWeeklyMenu = /menu.*(semaine|hebdo)|semaine.*menu|sugg[eè]re.*menu|fais.*moi.*un.*menu/i.test(message.trim());
    const hasImage = !!image;
    const useAdvancedModel = isWeeklyMenu || hasImage;
    const aiModel = useAdvancedModel ? 'claude-sonnet-4-20250514' : 'claude-3-haiku-20240307';
    const maxTokens = isWeeklyMenu ? 4096 : ['analysis', 'recipe', 'planning'].includes(intent) ? 2048 : 1024;

    // Build messages with conversation history
    const claudeMessages: Array<{ role: 'user' | 'assistant'; content: any }> = [];
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-5);
      for (const h of recentHistory) {
        claudeMessages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content,
        });
      }
    }

    // Build the current user message — with image if provided
    if (hasImage) {
      const userContent: any[] = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: image,
          },
        },
        { type: 'text', text: message.trim() },
      ];
      claudeMessages.push({ role: 'user' as const, content: userContent });
    } else {
      claudeMessages.push({ role: 'user' as const, content: message.trim() });
    }

    // Ensure messages alternate correctly (Claude requires user/assistant alternation)
    const sanitizedMessages: typeof claudeMessages = [];
    for (const msg of claudeMessages) {
      const last = sanitizedMessages[sanitizedMessages.length - 1];
      if (last && last.role === msg.role) {
        // Merge consecutive same-role messages (only for text messages)
        if (typeof last.content === 'string' && typeof msg.content === 'string') {
          last.content += '\n' + msg.content;
        } else {
          // For multimodal messages, keep them separate by inserting a placeholder
          sanitizedMessages.push({ ...msg });
        }
      } else {
        sanitizedMessages.push({ ...msg });
      }
    }
    // Claude requires first message to be 'user'
    if (sanitizedMessages.length > 0 && sanitizedMessages[0].role === 'assistant') {
      sanitizedMessages.shift();
    }

    // ── Response cache check (skip for mutable intents and messages with actions keywords) ──
    const actionKeywords = /cr[ée]+|ajoute|envoie|supprime|modifie|met.?[àa] jour|commande|planifie|log|oui|ok|confirme/i;
    const isMutableRequest = MUTABLE_INTENTS.includes(intent) && actionKeywords.test(message.trim());
    const cacheKey = getResponseCacheKey(restaurantId, message.trim(), intent);

    if (!isMutableRequest && !hasImage) {
      const cached = getCachedResponse(cacheKey);
      if (cached) {
        // Return cached response -- no streaming for cache hits
        return res.json(cached);
      }
    }

    // ── Streaming SSE response ──
    let fullText = '';
    let streamingFailed = false;
    let usageData: any = null;

    // Check if client accepts streaming (fetch with ReadableStream)
    const acceptsStream = req.headers.accept?.includes('text/event-stream') || req.body.stream === true;

    if (acceptsStream) {
      try {
        // Set SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

        const stream = await anthropic.messages.stream({
          model: aiModel,
          max_tokens: maxTokens,
          system: actionSystemPrompt,
          messages: sanitizedMessages as any,
        });

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && (event.delta as any).type === 'text_delta') {
            const text = (event.delta as any).text;
            fullText += text;
            res.write(`data: ${JSON.stringify({ text, done: false })}\n\n`);
          }
        }

        // Get final message for usage tracking
        const finalMessage = await stream.finalMessage();
        usageData = finalMessage.usage;
      } catch (streamErr: any) {
        console.error('Streaming failed, falling back to non-streaming:', streamErr.message);
        streamingFailed = true;
        fullText = '';
        // If headers already sent, we can't fallback cleanly
        if (res.headersSent) {
          res.write(`data: ${JSON.stringify({ text: '', done: true, error: 'Streaming error' })}\n\n`);
          res.end();
          return;
        }
      }
    }

    // Non-streaming fallback (or if streaming was not requested)
    if (!acceptsStream || streamingFailed) {
      const response = await anthropic.messages.create({
        model: aiModel,
        max_tokens: maxTokens,
        system: actionSystemPrompt,
        messages: sanitizedMessages as any,
      });
      fullText = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
      usageData = response.usage;
    }

    // Parse action blocks from response
    const actionRegex = /```action\s*\n?([\s\S]*?)```/g;
    const actions: Array<{ type: string; success: boolean; id?: number; message: string; error?: string; data?: any }> = [];
    let match;

    while ((match = actionRegex.exec(fullText)) !== null) {
      try {
        const actionData = JSON.parse(match[1].trim());

        if (actionData.type === 'create_recipe') {
          const d = actionData.data;
          const ingredientIds: Array<{ ingredientId: number; quantity: number; wastePercent: number }> = [];

          for (const ing of (d.ingredients || [])) {
            let ingredient = await prisma.ingredient.findFirst({
              where: { restaurantId, name: { equals: ing.name, mode: 'insensitive' as any } },
            });
            if (!ingredient) {
              ingredient = await prisma.ingredient.create({
                data: {
                  name: ing.name,
                  unit: ing.unit || 'kg',
                  pricePerUnit: ing.pricePerUnit || 0,
                  category: ing.category || 'Épicerie sèche',
                  restaurantId,
                },
              });
            }
            ingredientIds.push({
              ingredientId: ingredient.id,
              quantity: ing.quantity || 0,
              wastePercent: ing.wastePercent || 0,
            });
          }

          const recipe = await prisma.recipe.create({
            data: {
              name: d.name,
              category: d.category || 'Plats',
              sellingPrice: d.sellingPrice || 0,
              nbPortions: d.portions || 1,
              description: d.description || '',
              restaurantId,
              ingredients: {
                create: ingredientIds,
              },
            },
          });

          actions.push({ type: 'create_recipe', success: true, id: recipe.id, message: `Fiche technique "${d.name}" créée avec ${ingredientIds.length} ingrédients` });

        } else if (actionData.type === 'add_ingredient') {
          const d = actionData.data;
          const existing = await prisma.ingredient.findFirst({
            where: { restaurantId, name: { equals: d.name, mode: 'insensitive' as any } },
          });
          if (existing) {
            actions.push({ type: 'add_ingredient', success: true, id: existing.id, message: `Ingrédient "${d.name}" existe déjà` });
          } else {
            let supplierId: number | undefined;
            if (d.supplier) {
              const supplier = await prisma.supplier.findFirst({
                where: { restaurantId, name: { contains: d.supplier, mode: 'insensitive' as any } },
              });
              if (supplier) supplierId = supplier.id;
            }

            const ingredient = await prisma.ingredient.create({
              data: {
                name: d.name,
                unit: d.unit || 'kg',
                pricePerUnit: d.pricePerUnit || 0,
                category: d.category || 'Épicerie sèche',
                supplier: d.supplier || null,
                supplierId: supplierId || null,
                restaurantId,
              },
            });
            actions.push({ type: 'add_ingredient', success: true, id: ingredient.id, message: `Ingrédient "${d.name}" ajouté (${d.pricePerUnit || 0}€/${d.unit || 'kg'})` });
          }

        } else if (actionData.type === 'create_order') {
          const d = actionData.data;
          const items = (d.items || []).map((item: any) => ({
            productName: item.productName || item.name,
            quantity: item.quantity || 0,
            unit: item.unit || 'kg',
            unitPrice: item.unitPrice || 0,
            total: (item.quantity || 0) * (item.unitPrice || 0),
          }));
          const totalHT = items.reduce((s: number, it: any) => s + it.total, 0);

          const order = await prisma.marketplaceOrder.create({
            data: {
              supplierName: d.supplierName || d.supplier || 'Fournisseur',
              status: 'draft',
              totalHT: Math.round(totalHT * 100) / 100,
              restaurantId,
              items: { create: items },
            },
          });
          actions.push({ type: 'create_order', success: true, id: order.id, message: `Commande "${d.supplierName || d.supplier}" créée (${items.length} articles, ${totalHT.toFixed(2)}€ HT)` });

        } else if (actionData.type === 'update_recipe') {
          const d = actionData.data;
          const recipe = await prisma.recipe.findFirst({
            where: { id: d.recipeId, restaurantId },
            include: { ingredients: { include: { ingredient: true } } },
          });
          if (!recipe) {
            actions.push({ type: 'update_recipe', success: false, message: `Recette id ${d.recipeId} non trouvée` });
          } else {
            const updateData: any = {};
            if (d.name) updateData.name = d.name;
            if (d.sellingPrice !== undefined) updateData.sellingPrice = d.sellingPrice;
            if (d.category) updateData.category = d.category;
            if (d.description !== undefined) updateData.description = d.description;
            if (d.portions) updateData.nbPortions = d.portions;

            if (Object.keys(updateData).length > 0) {
              await prisma.recipe.update({ where: { id: recipe.id }, data: updateData });
            }

            if (d.removeIngredients && Array.isArray(d.removeIngredients)) {
              for (const ingName of d.removeIngredients) {
                const ri = recipe.ingredients.find((ri: any) => ri.ingredient.name.toLowerCase() === ingName.toLowerCase());
                if (ri) {
                  await prisma.recipeIngredient.delete({ where: { id: ri.id } });
                }
              }
            }

            if (d.updateIngredients && Array.isArray(d.updateIngredients)) {
              for (const upd of d.updateIngredients) {
                const ri = recipe.ingredients.find((ri: any) => ri.ingredient.name.toLowerCase() === upd.name.toLowerCase());
                if (ri) {
                  const riUpdate: any = {};
                  if (upd.quantity !== undefined) riUpdate.quantity = upd.quantity;
                  if (upd.wastePercent !== undefined) riUpdate.wastePercent = upd.wastePercent;
                  await prisma.recipeIngredient.update({ where: { id: ri.id }, data: riUpdate });
                }
              }
            }

            let addedCount = 0;
            if (d.addIngredients && Array.isArray(d.addIngredients)) {
              for (const ing of d.addIngredients) {
                let ingredient = await prisma.ingredient.findFirst({
                  where: { restaurantId, name: { equals: ing.name, mode: 'insensitive' as any } },
                });
                if (!ingredient) {
                  ingredient = await prisma.ingredient.create({
                    data: { name: ing.name, unit: ing.unit || 'kg', pricePerUnit: ing.pricePerUnit || 0, category: ing.category || 'Épicerie sèche', restaurantId },
                  });
                }
                const existing = await prisma.recipeIngredient.findFirst({
                  where: { recipeId: recipe.id, ingredientId: ingredient.id },
                });
                if (!existing) {
                  await prisma.recipeIngredient.create({
                    data: { recipeId: recipe.id, ingredientId: ingredient.id, quantity: ing.quantity || 0, wastePercent: ing.wastePercent || 0 },
                  });
                  addedCount++;
                }
              }
            }

            actions.push({ type: 'update_recipe', success: true, id: recipe.id, message: `Recette "${recipe.name}" mise à jour${addedCount ? ` (+${addedCount} ingrédients)` : ''}` });
          }

        } else if (actionData.type === 'analyze_recipe') {
          const d = actionData.data;
          const recipe = await prisma.recipe.findFirst({
            where: { id: d.recipeId, restaurantId },
            include: { ingredients: { include: { ingredient: true } } },
          });
          if (!recipe) {
            actions.push({ type: 'analyze_recipe', success: false, message: `Recette id ${d.recipeId} non trouvée` });
          } else {
            const ingredientCosts = recipe.ingredients.map((ri: any) => {
              const d = getUnitDivisor(ri.ingredient.unit);
              return {
                name: ri.ingredient.name,
                quantity: ri.quantity,
                unit: ri.ingredient.unit,
                unitPrice: ri.ingredient.pricePerUnit,
                cost: Math.round((ri.quantity / d) * ri.ingredient.pricePerUnit * 100) / 100,
                wastePercent: ri.wastePercent || 0,
                costWithWaste: Math.round((ri.quantity / d) * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100) * 100) / 100,
              };
            });
            const totalCost = ingredientCosts.reduce((s: number, ic: any) => s + ic.costWithWaste, 0);
            const foodCostPercent = recipe.sellingPrice > 0 ? (totalCost / recipe.sellingPrice * 100) : 0;
            const margin = recipe.sellingPrice - totalCost;
            const costPerPortion = recipe.nbPortions > 0 ? totalCost / recipe.nbPortions : totalCost;

            actions.push({
              type: 'analyze_recipe', success: true, id: recipe.id,
              message: `Analyse "${recipe.name}": coût total ${totalCost.toFixed(2)}€, food cost ${foodCostPercent.toFixed(1)}%, marge ${margin.toFixed(2)}€, coût/portion ${costPerPortion.toFixed(2)}€`,
              data: { name: recipe.name, sellingPrice: recipe.sellingPrice, totalCost: Math.round(totalCost * 100) / 100, foodCostPercent: Math.round(foodCostPercent * 10) / 10, margin: Math.round(margin * 100) / 100, costPerPortion: Math.round(costPerPortion * 100) / 100, ingredients: ingredientCosts },
            } as any);
          }

        } else if (actionData.type === 'duplicate_recipe') {
          const d = actionData.data;
          const original = await prisma.recipe.findFirst({
            where: { id: d.recipeId, restaurantId },
            include: { ingredients: true },
          });
          if (!original) {
            actions.push({ type: 'duplicate_recipe', success: false, message: `Recette id ${d.recipeId} non trouvée` });
          } else {
            const newRecipe = await prisma.recipe.create({
              data: {
                name: d.newName || `${original.name} (copie)`,
                category: original.category,
                sellingPrice: original.sellingPrice,
                nbPortions: original.nbPortions,
                description: original.description,
                prepTimeMinutes: original.prepTimeMinutes,
                cookTimeMinutes: original.cookTimeMinutes,
                laborCostPerHour: original.laborCostPerHour,
                restaurantId,
                ingredients: {
                  create: original.ingredients.map((ri: any) => ({
                    ingredientId: ri.ingredientId,
                    quantity: ri.quantity,
                    wastePercent: ri.wastePercent,
                  })),
                },
              },
            });
            actions.push({ type: 'duplicate_recipe', success: true, id: newRecipe.id, message: `Recette "${original.name}" dupliquée en "${newRecipe.name}" avec ${original.ingredients.length} ingrédients` });
          }

        } else if (actionData.type === 'update_price') {
          const d = actionData.data;
          let ingredient: any = null;
          if (d.ingredientId) {
            ingredient = await prisma.ingredient.findFirst({ where: { id: d.ingredientId, restaurantId } });
          } else if (d.ingredientName) {
            ingredient = await prisma.ingredient.findFirst({ where: { restaurantId, name: { equals: d.ingredientName, mode: 'insensitive' as any } } });
          }
          if (!ingredient) {
            actions.push({ type: 'update_price', success: false, message: `Ingrédient non trouvé` });
          } else {
            const oldPrice = ingredient.pricePerUnit;
            await prisma.ingredient.update({ where: { id: ingredient.id }, data: { pricePerUnit: d.newPrice } });
            await prisma.priceHistory.create({
              data: { ingredientId: ingredient.id, price: d.newPrice, date: today, source: d.reason || 'IA assistant', restaurantId },
            });
            const changePercent = oldPrice > 0 ? ((d.newPrice - oldPrice) / oldPrice * 100).toFixed(1) : 'N/A';
            actions.push({ type: 'update_price', success: true, id: ingredient.id, message: `Prix de "${ingredient.name}" mis à jour: ${oldPrice}€ → ${d.newPrice}€/${ingredient.unit} (${changePercent}%)` });
          }

        } else if (actionData.type === 'check_stock') {
          const d = actionData.data;
          const names: string[] = d.ingredientNames || d.names || [];
          const stockResults: any[] = [];
          for (const name of names) {
            const inv = await prisma.inventoryItem.findFirst({
              where: { restaurantId, ingredient: { name: { contains: name, mode: 'insensitive' as any } } },
              include: { ingredient: true },
            });
            if (inv) {
              stockResults.push({ name: inv.ingredient.name, stock: inv.currentStock, min: inv.minStock, max: inv.maxStock, unit: inv.unit, alert: inv.currentStock < inv.minStock });
            } else {
              const ing = await prisma.ingredient.findFirst({ where: { restaurantId, name: { contains: name, mode: 'insensitive' as any } } });
              stockResults.push({ name: ing?.name || name, stock: null, min: null, max: null, unit: ing?.unit || '?', alert: false, noInventory: true });
            }
          }
          const alertCount = stockResults.filter(s => s.alert).length;
          actions.push({
            type: 'check_stock', success: true,
            message: `Stock vérifié pour ${stockResults.length} ingrédients${alertCount > 0 ? ` (${alertCount} en alerte)` : ''}`,
            data: stockResults,
          } as any);

        } else if (actionData.type === 'suggest_order') {
          const d = actionData.data;
          const allInventory = await prisma.inventoryItem.findMany({ where: { restaurantId }, include: { ingredient: true } });
          const lowItems = allInventory.filter((i: any) => i.currentStock < i.minStock);
          const supplierFilter = d.supplierName || d.supplier;
          const filtered = supplierFilter
            ? lowItems.filter((i: any) => i.ingredient.supplier?.toLowerCase().includes(supplierFilter.toLowerCase()))
            : lowItems;

          const suggestedItems = filtered.map((i: any) => ({
            productName: i.ingredient.name,
            quantity: Math.max(i.minStock - i.currentStock, i.minStock),
            unit: i.ingredient.unit,
            unitPrice: i.ingredient.pricePerUnit,
            currentStock: i.currentStock,
            minStock: i.minStock,
          }));
          const totalHT = suggestedItems.reduce((s: number, it: any) => s + it.quantity * it.unitPrice, 0);

          if (suggestedItems.length === 0) {
            actions.push({ type: 'suggest_order', success: true, message: 'Aucun produit en stock bas nécessitant une commande' });
          } else {
            actions.push({
              type: 'suggest_order', success: true,
              message: `Suggestion de commande: ${suggestedItems.length} articles, total estimé ${totalHT.toFixed(2)}€ HT`,
              data: suggestedItems,
            } as any);
          }

        } else if (actionData.type === 'add_supplier') {
          const d = actionData.data;
          const existing = await prisma.supplier.findFirst({
            where: { restaurantId, name: { equals: d.name, mode: 'insensitive' as any } },
          });
          if (existing) {
            actions.push({ type: 'add_supplier', success: true, id: existing.id, message: `Fournisseur "${d.name}" existe déjà` });
          } else {
            const supplier = await prisma.supplier.create({
              data: {
                name: d.name,
                phone: d.phone || null,
                email: d.email || null,
                address: d.address || null,
                city: d.city || null,
                postalCode: d.postalCode || null,
                region: d.region || null,
                categories: d.categories || [],
                contactName: d.contactName || null,
                delivery: d.delivery !== undefined ? d.delivery : true,
                minOrder: d.minOrder || null,
                paymentTerms: d.paymentTerms || null,
                notes: d.notes || null,
                restaurantId,
              },
            });
            actions.push({ type: 'add_supplier', success: true, id: supplier.id, message: `Fournisseur "${d.name}" ajouté` });
          }

        } else if (actionData.type === 'compare_suppliers') {
          const d = actionData.data;
          const ingredientName = d.ingredientName || d.name;
          const matchingIngs = await prisma.ingredient.findMany({
            where: { restaurantId, name: { contains: ingredientName, mode: 'insensitive' as any } },
            include: { supplierRef: true, priceHistory: { orderBy: { createdAt: 'desc' as any }, take: 5 } },
          });
          if (matchingIngs.length === 0) {
            actions.push({ type: 'compare_suppliers', success: false, message: `Ingrédient "${ingredientName}" non trouvé` });
          } else {
            const comparison = matchingIngs.map((ing: any) => ({
              name: ing.name,
              supplier: ing.supplier || ing.supplierRef?.name || 'Non défini',
              currentPrice: ing.pricePerUnit,
              unit: ing.unit,
              priceHistory: ing.priceHistory.map((ph: any) => ({ date: ph.date, price: ph.price })),
            }));
            actions.push({
              type: 'compare_suppliers', success: true,
              message: `Comparaison pour "${ingredientName}": ${comparison.length} entrée(s) trouvée(s)`,
              data: comparison,
            } as any);
          }

        } else if (actionData.type === 'add_shift') {
          const d = actionData.data;
          const employee = await prisma.employee.findFirst({
            where: { restaurantId, name: { contains: d.employeeName || d.employee, mode: 'insensitive' as any }, active: true },
          });
          if (!employee) {
            actions.push({ type: 'add_shift', success: false, message: `Employé "${d.employeeName || d.employee}" non trouvé` });
          } else {
            const shift = await prisma.shift.create({
              data: {
                employeeId: employee.id,
                date: d.date || today,
                startTime: d.startTime || '09:00',
                endTime: d.endTime || '17:00',
                type: d.type || 'Midi',
                notes: d.notes || null,
                restaurantId,
              },
            });
            const hours = ((parseInt(d.endTime?.split(':')[0] || '17') - parseInt(d.startTime?.split(':')[0] || '9')) + (parseInt(d.endTime?.split(':')[1] || '0') - parseInt(d.startTime?.split(':')[1] || '0')) / 60);
            actions.push({ type: 'add_shift', success: true, id: shift.id, message: `Shift ajouté: ${employee.name} le ${d.date || today} (${d.startTime || '09:00'}-${d.endTime || '17:00'}, ~${hours.toFixed(1)}h)` });
          }

        } else if (actionData.type === 'weekly_planning') {
          const d = actionData.data;
          const shifts = d.shifts || [];
          let created = 0;
          let errors = 0;
          for (const s of shifts) {
            const employee = await prisma.employee.findFirst({
              where: { restaurantId, name: { contains: s.employeeName || s.employee, mode: 'insensitive' as any }, active: true },
            });
            if (employee) {
              await prisma.shift.create({
                data: {
                  employeeId: employee.id,
                  date: s.date,
                  startTime: s.startTime || '09:00',
                  endTime: s.endTime || '17:00',
                  type: s.type || 'Midi',
                  notes: s.notes || null,
                  restaurantId,
                },
              });
              created++;
            } else {
              errors++;
            }
          }
          actions.push({ type: 'weekly_planning', success: true, message: `Planning semaine: ${created} shifts créés${errors > 0 ? `, ${errors} employés non trouvés` : ''}` });

        } else if (actionData.type === 'margin_analysis') {
          const allRecipes = await prisma.recipe.findMany({
            where: { restaurantId },
            include: { ingredients: { include: { ingredient: true } } },
          });
          const analysis = allRecipes.map((r: any) => {
            const cost = r.ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100), 0);
            const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
            return { name: r.name, category: r.category, cost: Math.round(cost * 100) / 100, sellingPrice: r.sellingPrice, margin: Math.round(margin * 10) / 10, profit: Math.round((r.sellingPrice - cost) * 100) / 100 };
          }).sort((a: any, b: any) => a.margin - b.margin);

          const avgMargin = analysis.length > 0 ? (analysis.reduce((s: number, a: any) => s + a.margin, 0) / analysis.length) : 0;
          const lowMargin = analysis.filter((a: any) => a.margin < 65);
          const highMargin = analysis.filter((a: any) => a.margin >= 75);

          const byCategory: any = {};
          analysis.forEach((a: any) => {
            if (!byCategory[a.category]) byCategory[a.category] = { count: 0, totalMargin: 0 };
            byCategory[a.category].count++;
            byCategory[a.category].totalMargin += a.margin;
          });
          const categoryAvg = Object.entries(byCategory).map(([cat, data]: any) => ({ category: cat, avgMargin: Math.round(data.totalMargin / data.count * 10) / 10, count: data.count }));

          actions.push({
            type: 'margin_analysis', success: true,
            message: `Analyse de ${analysis.length} recettes: marge moyenne ${avgMargin.toFixed(1)}%, ${lowMargin.length} plats sous 65%, ${highMargin.length} plats au-dessus de 75%`,
            data: { recipes: analysis, avgMargin: Math.round(avgMargin * 10) / 10, lowMarginCount: lowMargin.length, highMarginCount: highMargin.length, byCategory: categoryAvg },
          } as any);

        } else if (actionData.type === 'best_sellers') {
          const d = actionData.data;
          const period = d.period || 'month';
          const daysBack = period === 'week' ? 7 : period === 'month' ? 30 : 90;
          const sinceDate = new Date();
          sinceDate.setDate(sinceDate.getDate() - daysBack);
          const sinceStr = sinceDate.toISOString().slice(0, 10);

          const sales = await prisma.menuSale.findMany({
            where: { restaurantId, date: { gte: sinceStr } },
          });

          const byRecipe: any = {};
          sales.forEach((s: any) => {
            if (!byRecipe[s.recipeName]) byRecipe[s.recipeName] = { recipeName: s.recipeName, recipeId: s.recipeId, totalQty: 0, totalRevenue: 0 };
            byRecipe[s.recipeName].totalQty += s.quantity;
            byRecipe[s.recipeName].totalRevenue += s.revenue;
          });
          const topSellers = Object.values(byRecipe).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue).slice(0, 10);

          for (const seller of topSellers as any[]) {
            const recipe = recipes.find((r: any) => r.id === seller.recipeId);
            if (recipe) {
              const cost = recipe.ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
              seller.cost = Math.round(cost * 100) / 100;
              seller.margin = recipe.sellingPrice > 0 ? Math.round((recipe.sellingPrice - cost) / recipe.sellingPrice * 1000) / 10 : 0;
              seller.totalProfit = Math.round((seller.totalRevenue - cost * seller.totalQty) * 100) / 100;
            }
          }

          actions.push({
            type: 'best_sellers', success: true,
            message: `Top ${(topSellers as any[]).length} ventes (${daysBack} derniers jours): ${sales.length} ventes analysées`,
            data: topSellers,
          } as any);

        } else if (actionData.type === 'cost_alert') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const sinceStr = thirtyDaysAgo.toISOString().slice(0, 10);

          const allIngredients = await prisma.ingredient.findMany({ where: { restaurantId } });
          const alerts: any[] = [];

          for (const ing of allIngredients) {
            const oldPrices = await prisma.priceHistory.findMany({
              where: { ingredientId: ing.id, date: { lte: sinceStr } },
              orderBy: { createdAt: 'desc' },
              take: 1,
            });
            if (oldPrices.length > 0) {
              const oldPrice = oldPrices[0].price;
              const change = ing.pricePerUnit - oldPrice;
              const changePercent = oldPrice > 0 ? (change / oldPrice * 100) : 0;
              if (changePercent > 5) {
                alerts.push({
                  name: ing.name, category: ing.category,
                  oldPrice, currentPrice: ing.pricePerUnit,
                  change: Math.round(change * 100) / 100,
                  changePercent: Math.round(changePercent * 10) / 10,
                });
              }
            }
          }
          alerts.sort((a, b) => b.changePercent - a.changePercent);

          actions.push({
            type: 'cost_alert', success: true,
            message: alerts.length > 0 ? `${alerts.length} ingrédient(s) avec hausse >5% sur 30 jours` : 'Aucune hausse significative détectée sur 30 jours',
            data: alerts,
          } as any);

        } else if (actionData.type === 'daily_report') {
          const d = actionData.data;
          const reportDate = d.date || today;

          const [daySales, dayExpenses, dayTemps] = await Promise.all([
            prisma.menuSale.findMany({ where: { restaurantId, date: reportDate } }),
            prisma.financialEntry.findMany({ where: { restaurantId, date: reportDate } }),
            prisma.haccpTemperature.findMany({ where: { restaurantId, date: reportDate } }),
          ]);

          const totalRevenue = daySales.reduce((s: number, sale: any) => s + sale.revenue, 0);
          const totalCovers = daySales.reduce((s: number, sale: any) => s + sale.quantity, 0);
          const expenses = dayExpenses.filter((e: any) => e.type === 'expense');
          const totalExpenses = expenses.reduce((s: number, e: any) => s + e.amount, 0);
          const ticketMoyen = totalCovers > 0 ? totalRevenue / totalCovers : 0;
          const nonConformeTemps = dayTemps.filter((t: any) => t.status === 'non_conforme');

          actions.push({
            type: 'daily_report', success: true,
            message: `Rapport ${reportDate}: CA ${totalRevenue.toFixed(2)}€, ${totalCovers} couverts, ticket moyen ${ticketMoyen.toFixed(2)}€`,
            data: {
              date: reportDate,
              revenue: Math.round(totalRevenue * 100) / 100,
              covers: totalCovers,
              ticketMoyen: Math.round(ticketMoyen * 100) / 100,
              expenses: Math.round(totalExpenses * 100) / 100,
              salesCount: daySales.length,
              haccpAlerts: nonConformeTemps.length,
            },
          } as any);

        } else if (actionData.type === 'log_temperature') {
          const d = actionData.data;
          let status = 'conforme';
          const temp = d.temperature;
          const zone = (d.zone || '').toLowerCase();
          if (zone.includes('frigo') && (temp < 0 || temp > 4)) status = 'non_conforme';
          else if (zone.includes('congel') && temp > -18) status = 'non_conforme';
          else if (zone.includes('chaud') && temp < 63) status = 'non_conforme';
          else if (zone.includes('réception') || zone.includes('reception')) {
            if (temp > 4) status = 'non_conforme';
          }

          const record = await prisma.haccpTemperature.create({
            data: {
              zone: d.zone || 'Frigo',
              temperature: d.temperature,
              status: d.status || status,
              recordedBy: d.recordedBy || 'IA Assistant',
              notes: d.notes || null,
              date: d.date || today,
              time: d.time || new Date().toTimeString().slice(0, 5),
              restaurantId,
            },
          });
          const emoji = status === 'conforme' ? '' : ' ALERTE';
          actions.push({ type: 'log_temperature', success: true, id: record.id, message: `Température ${d.zone}: ${d.temperature}°C (${status})${emoji}` });

        } else if (actionData.type === 'cleaning_checklist') {
          const d = actionData.data;
          const checkDate = d.date || today;

          const existingTasks = await prisma.haccpCleaning.findMany({ where: { restaurantId, date: checkDate } });
          if (existingTasks.length > 0) {
            const done = existingTasks.filter((t: any) => t.status === 'fait').length;
            actions.push({
              type: 'cleaning_checklist', success: true,
              message: `Checklist du ${checkDate} existe déjà: ${done}/${existingTasks.length} tâches complétées`,
              data: existingTasks.map((t: any) => ({ zone: t.zone, task: t.task, status: t.status, doneBy: t.doneBy })),
            } as any);
          } else {
            const defaultTasks = [
              { zone: 'Cuisine', task: 'Nettoyage plans de travail et surfaces' },
              { zone: 'Cuisine', task: 'Nettoyage plaques de cuisson et fours' },
              { zone: 'Cuisine', task: 'Nettoyage hottes et filtres' },
              { zone: 'Cuisine', task: 'Nettoyage sols cuisine' },
              { zone: 'Chambre froide', task: 'Vérification et nettoyage chambre froide' },
              { zone: 'Chambre froide', task: 'Contrôle dates de péremption' },
              { zone: 'Salle', task: 'Nettoyage tables et chaises' },
              { zone: 'Salle', task: 'Nettoyage sols salle' },
              { zone: 'Salle', task: 'Nettoyage vitres et miroirs' },
              { zone: 'Toilettes', task: 'Nettoyage et désinfection toilettes' },
              { zone: 'Toilettes', task: 'Réapprovisionnement savon et papier' },
              { zone: 'Plonge', task: 'Nettoyage machine plonge et éviers' },
              { zone: 'Poubelles', task: 'Vidage et nettoyage poubelles' },
              { zone: 'Réception', task: 'Nettoyage zone réception marchandises' },
            ];
            await prisma.haccpCleaning.createMany({
              data: defaultTasks.map(t => ({ ...t, status: 'en_attente', date: checkDate, restaurantId })),
            });
            actions.push({
              type: 'cleaning_checklist', success: true,
              message: `Checklist nettoyage du ${checkDate} créée: ${defaultTasks.length} tâches`,
              data: defaultTasks.map(t => ({ ...t, status: 'en_attente' })),
            } as any);
          }

        } else if (actionData.type === 'send_order_email') {
          const d = actionData.data;
          try {
            const restaurant = await prisma.restaurant.findFirst({ where: { id: restaurantId } });
            const items = d.items || [];
            const orderNum = `CMD-${Date.now().toString(36).toUpperCase()}`;

            const resendKey = process.env.RESEND_API_KEY;
            if (!resendKey) {
              actions.push({ type: 'send_order_email', success: false, message: 'Service email non configuré (RESEND_API_KEY manquante)' });
            } else {
              const resend = new Resend(resendKey);
              const emailHtml = buildOrderEmail({
                restaurantName: restaurant?.name || 'Restaurant',
                restaurantAddress: (restaurant as any)?.address || '',
                restaurantPhone: (restaurant as any)?.phone || '',
                restaurantEmail: (restaurant as any)?.email || '',
                orderNumber: orderNum,
                date: new Date().toLocaleDateString('fr-FR'),
                supplierName: d.supplier || 'Fournisseur',
                supplierAddress: d.supplierAddress || '',
                items: items.map((i: any) => ({
                  name: i.name,
                  quantity: i.quantity || 1,
                  unit: i.unit || 'kg',
                  unitPrice: i.price || 0,
                })),
                notes: d.notes,
              });

              await resend.emails.send({
                from: `${restaurant?.name || 'RestauMargin'} <contact@restaumargin.fr>`,
                to: d.email || 'contact@transgourmet.fr',
                subject: `Commande ${orderNum} — ${restaurant?.name || ''} — ${new Date().toLocaleDateString('fr-FR')}`,
                html: emailHtml,
              });
              actions.push({ type: 'send_order_email', success: true, message: `Email envoyé à ${d.supplier || 'fournisseur'} (${d.email || 'contact@transgourmet.fr'})` });
            }
          } catch (emailErr: any) {
            console.error('Send order email error:', emailErr.message);
            actions.push({ type: 'send_order_email', success: false, message: `Erreur envoi email: ${emailErr.message}`, error: emailErr.message });
          }

        } else if (actionData.type === 'suggest_menu') {
          const d = actionData.data;
          try {
            const covers = d.covers || 30;
            const budget = d.budget || 15;
            // Use available ingredients sorted by price to suggest affordable dishes
            const availableIngredients = await prisma.ingredient.findMany({
              where: { restaurantId },
              orderBy: { pricePerUnit: 'asc' },
              take: 50,
            });
            const existingRecipes = await prisma.recipe.findMany({
              where: { restaurantId },
              include: { ingredients: { include: { ingredient: true } } },
              take: 30,
            });
            const recipeSuggestions = existingRecipes.map((r: any) => {
              const cost = r.ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
              const costPerPortion = r.nbPortions > 0 ? cost / r.nbPortions : cost;
              return { name: r.name, id: r.id, category: r.category, costPerPortion: Math.round(costPerPortion * 100) / 100, sellingPrice: r.sellingPrice };
            }).filter((r: any) => r.costPerPortion <= budget * 0.4) // food cost < 40% of budget
              .sort((a: any, b: any) => a.costPerPortion - b.costPerPortion);

            actions.push({
              type: 'suggest_menu', success: true,
              message: `${recipeSuggestions.length} recettes compatibles avec un budget de ${budget}€/couvert pour ${covers} couverts`,
              data: { covers, budget, suggestions: recipeSuggestions, ingredientsCount: availableIngredients.length },
            } as any);
          } catch (menuErr: any) {
            console.error('Suggest menu error:', menuErr.message);
            actions.push({ type: 'suggest_menu', success: false, message: `Erreur suggestion menu: ${menuErr.message}` });
          }

        } else if (actionData.type === 'generate_weekly_menu') {
          try {
            // 1. Récupérer le stock actuel (ingrédients avec inventaire)
            const stockItems = await prisma.inventoryItem.findMany({
              where: { restaurantId },
              include: { ingredient: true },
            });
            const stockSummary = stockItems.map((item: any) => ({
              name: item.ingredient.name,
              category: item.ingredient.category,
              currentStock: item.currentStock,
              unit: item.ingredient.unit,
              pricePerUnit: item.ingredient.pricePerUnit,
              isLow: item.currentStock < item.minStock,
            }));

            // 2. Récupérer la mercuriale (prix actuels + tendances)
            let mercurialePrices: any[] = [];
            try {
              mercurialePrices = await prisma.$queryRaw`
                SELECT mp.ingredient_name, mp.category, mp.price, mp.unit, mp.trend, mp.previous_price,
                       mp.variation_percent, mp.origin, mp.quality_label
                FROM mercuriale_prices mp
                JOIN mercuriale_publications pub ON mp.publication_id = pub.id
                WHERE pub.published = true
                ORDER BY pub.week_date DESC
                LIMIT 100
              `;
            } catch { /* mercuriale tables may not exist yet */ }

            // Identifier les opportunités (prix en baisse)
            const opportunities = mercurialePrices.filter((p: any) =>
              p.trend === 'down' || (p.variation_percent && p.variation_percent < -2)
            );

            // 3. Récupérer les recettes existantes avec leurs coûts
            const existingRecipes = await prisma.recipe.findMany({
              where: { restaurantId },
              include: { ingredients: { include: { ingredient: true } } },
            });
            const recipesByCategory: any = { 'Entrées': [], 'Plats': [], 'Desserts': [] };
            for (const r of existingRecipes) {
              const cost = (r as any).ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
              const costPerPortion = r.nbPortions > 0 ? cost / r.nbPortions : cost;
              const category = r.category || 'Plats';
              if (recipesByCategory[category]) {
                recipesByCategory[category].push({
                  id: r.id,
                  name: r.name,
                  costPerPortion: Math.round(costPerPortion * 100) / 100,
                  sellingPrice: r.sellingPrice,
                  margin: r.sellingPrice > 0 ? Math.round((r.sellingPrice - costPerPortion) / r.sellingPrice * 1000) / 10 : 0,
                  ingredients: (r as any).ingredients.map((ri: any) => ri.ingredient.name),
                });
              }
            }

            // 4. Tous les ingrédients disponibles (pour suggestions nouvelles recettes)
            const allIngredients = await prisma.ingredient.findMany({
              where: { restaurantId },
              orderBy: { pricePerUnit: 'asc' },
            });
            const ingredientsByCategory: any = {};
            for (const ing of allIngredients) {
              const cat = ing.category || 'Autre';
              if (!ingredientsByCategory[cat]) ingredientsByCategory[cat] = [];
              ingredientsByCategory[cat].push({
                name: ing.name,
                pricePerUnit: ing.pricePerUnit,
                unit: ing.unit,
              });
            }

            // Déterminer le mois actuel pour la saisonnalité
            const currentMonth = new Date().getMonth() + 1; // 1-12
            const seasonMap: any = {
              '1-3': 'Hiver (poireaux, choux, endives, agrumes, carottes, navets, céleri)',
              '4-6': 'Printemps (asperges, petits pois, fraises, radis, artichauts, fèves)',
              '7-9': 'Été (tomates, courgettes, aubergines, pêches, melons, haricots verts)',
              '10-12': 'Automne (cèpes, potiron, châtaignes, pommes, poires, topinambours)',
            };
            const seasonKey = currentMonth <= 3 ? '1-3' : currentMonth <= 6 ? '4-6' : currentMonth <= 9 ? '7-9' : '10-12';
            const currentSeason = seasonMap[seasonKey];

            actions.push({
              type: 'generate_weekly_menu', success: true,
              message: `Données récupérées: ${existingRecipes.length} recettes, ${stockItems.length} articles en stock, ${mercurialePrices.length} prix mercuriale, ${opportunities.length} opportunités (prix en baisse)`,
              data: {
                season: currentSeason,
                month: currentMonth,
                stock: stockSummary.slice(0, 30),
                mercurialeOpportunities: opportunities.slice(0, 20),
                mercurialePrices: mercurialePrices.slice(0, 50),
                existingRecipes: recipesByCategory,
                ingredientsByCategory,
                coefficients: { 'Entrées': 3, 'Plats': 3.5, 'Desserts': 4 },
              },
            } as any);
          } catch (menuWeekErr: any) {
            console.error('Generate weekly menu error:', menuWeekErr.message);
            actions.push({ type: 'generate_weekly_menu', success: false, message: `Erreur génération menu semaine: ${menuWeekErr.message}` });
          }

        } else {
          actions.push({ type: actionData.type, success: false, message: `Action "${actionData.type}" non reconnue` });
        }
      } catch (actionErr: any) {
        console.error('AI action error:', actionErr.message);
        actions.push({ type: 'unknown', success: false, message: 'Erreur lors de l\'exécution de l\'action', error: actionErr.message });
      }
    }

    const cleanedText = fullText.replace(/```action\s*\n?[\s\S]*?```/g, '').trim();

    // ── Track AI usage ──
    const inputTokens = usageData?.input_tokens || 0;
    const outputTokens = usageData?.output_tokens || 0;
    const estimatedCost = (inputTokens * 0.00025 + outputTokens * 0.00125) / 1000;
    try {
      await prisma.$executeRaw`
        INSERT INTO ai_usage (restaurant_id, month, requests_count, tokens_used, estimated_cost, updated_at)
        VALUES (${restaurantId}, ${month}, 1, ${inputTokens + outputTokens}, ${estimatedCost}, NOW())
        ON CONFLICT (restaurant_id, month)
        DO UPDATE SET
          requests_count = ai_usage.requests_count + 1,
          tokens_used = ai_usage.tokens_used + ${inputTokens + outputTokens},
          estimated_cost = ai_usage.estimated_cost + ${estimatedCost},
          updated_at = NOW()
      `;
    } catch (trackErr: any) {
      console.error('AI usage tracking error:', trackErr.message);
    }

    const responsePayload = { response: cleanedText, actions, usage: usageData };

    // Cache read-only responses
    if (!isMutableRequest && !hasImage && actions.length === 0) {
      setCachedResponse(cacheKey, responsePayload);
    }

    // If we were streaming, send the final SSE event with actions and end
    if (acceptsStream && !streamingFailed && res.headersSent) {
      res.write(`data: ${JSON.stringify({ text: '', done: true, actions, usage: usageData })}\n\n`);
      res.end();
    } else {
      res.json(responsePayload);
    }
  } catch (e: any) {
    console.error('AI error:', e.message);
    // If streaming headers already sent, send error via SSE and close
    if (res.headersSent) {
      try {
        res.write(`data: ${JSON.stringify({ text: '', done: true, error: e.message || 'Erreur IA' })}\n\n`);
        res.end();
      } catch { /* connection may already be closed */ }
      return;
    }
    if (e?.status === 400 && e?.message?.includes('credit balance')) {
      return res.status(503).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
    }
    res.status(500).json({ error: 'Service IA temporairement indisponible. Veuillez réessayer plus tard.' });
  }
});

// ── AI: Forecast ──
router.post('/forecast', authWithRestaurant, async (req: any, res) => {
  try {
    const { historicalData, days } = req.body;
    if (!historicalData || !Array.isArray(historicalData) || !days) {
      return res.status(400).json({ error: 'historicalData (array) et days (number) requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en prévision de ventes pour la restauration. Analyse les données historiques et prédis les ventes futures. Réponds UNIQUEMENT en JSON valide, sans texte avant ou après. Format: { "predictions": [{ "date": "YYYY-MM-DD", "covers": number, "revenue": number }] }`,
      messages: [{
        role: 'user',
        content: `Données historiques de ventes:\n${JSON.stringify(historicalData)}\n\nPrédis les ${days} prochains jours. Tiens compte des tendances, saisonnalité et jours de la semaine.`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ predictions: [], raw: text });
    }
  } catch (e: any) {
    console.error('AI forecast error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI: Menu Analysis (Menu Engineering) ──
router.post('/menu-analysis', authWithRestaurant, async (req: any, res) => {
  try {
    const { recipes } = req.body;
    if (!recipes || !Array.isArray(recipes)) {
      return res.status(400).json({ error: 'recipes (array) requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en menu engineering pour la restauration. Classe les plats selon la matrice BCG adaptée à la restauration:
- Stars (haute popularité, haute marge) : les plats à promouvoir
- Puzzles (faible popularité, haute marge) : les plats à mieux vendre
- Chevaux de labour / Workhorses (haute popularité, faible marge) : les plats à optimiser
- Poids morts / Dogs (faible popularité, faible marge) : les plats à repenser ou supprimer

Réponds UNIQUEMENT en JSON valide: { "analysis": { "stars": ["nom"], "puzzles": ["nom"], "workhorses": ["nom"], "dogs": ["nom"] }, "recommendations": "string avec conseils détaillés" }`,
      messages: [{
        role: 'user',
        content: `Voici les plats du menu avec leur coût, prix de vente et nombre de ventes:\n${JSON.stringify(recipes)}`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ analysis: { stars: [], puzzles: [], workhorses: [], dogs: [] }, recommendations: text });
    }
  } catch (e: any) {
    console.error('AI menu-analysis error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI: Order Recommendation ──
router.post('/order-recommendation', authWithRestaurant, async (req: any, res) => {
  try {
    const { stock, forecast, supplierPrices } = req.body;
    if (!stock || !Array.isArray(stock)) {
      return res.status(400).json({ error: 'stock (array) requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en gestion des commandes fournisseurs pour la restauration. Calcule les quantités optimales à commander en tenant compte du stock actuel, des prévisions de ventes et des prix fournisseurs. Minimise le gaspillage et les ruptures.

Réponds UNIQUEMENT en JSON valide: { "orders": [{ "ingredient": "nom", "quantity": number, "supplier": "nom fournisseur", "estimatedCost": number }] }`,
      messages: [{
        role: 'user',
        content: `Stock actuel:\n${JSON.stringify(stock)}\n\nPrévisions de ventes:\n${JSON.stringify(forecast || [])}\n\nPrix fournisseurs:\n${JSON.stringify(supplierPrices || [])}`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ orders: [], raw: text });
    }
  } catch (e: any) {
    console.error('AI order-recommendation error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI: Invoice Check ──
router.post('/invoice-check', authWithRestaurant, async (req: any, res) => {
  try {
    const { invoiceData, historicalPrices } = req.body;
    if (!invoiceData) {
      return res.status(400).json({ error: 'invoiceData requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      system: `Tu es un expert en contrôle des factures fournisseurs pour la restauration. Compare la facture avec les prix historiques et signale toute anomalie de prix (hausses anormales, erreurs potentielles, surfacturations).

Réponds UNIQUEMENT en JSON valide: { "anomalies": [{ "item": "nom produit", "invoicePrice": number, "avgPrice": number, "deviation": "string (+X%)" }], "summary": "résumé des anomalies et recommandations" }`,
      messages: [{
        role: 'user',
        content: `Données de la facture:\n${JSON.stringify(invoiceData)}\n\nHistorique des prix:\n${JSON.stringify(historicalPrices || [])}`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');
    try {
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch {
      res.json({ anomalies: [], summary: text });
    }
  } catch (e: any) {
    console.error('AI invoice-check error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI Usage Quota ──
router.get('/usage', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    const month = new Date().toISOString().slice(0, 7);
    const MONTHLY_LIMIT = 500;

    const rows: any[] = await prisma.$queryRaw`
      SELECT requests_count, tokens_used, estimated_cost
      FROM ai_usage
      WHERE restaurant_id = ${restaurantId} AND month = ${month}
    `;

    const used = rows[0]?.requests_count || 0;
    const tokens = rows[0]?.tokens_used || 0;
    const estimatedCost = parseFloat(rows[0]?.estimated_cost || '0');
    const percentage = Math.round((used / MONTHLY_LIMIT) * 1000) / 10;

    res.json({
      used,
      limit: MONTHLY_LIMIT,
      percentage,
      tokens,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      month,
    });
  } catch (e: any) {
    console.error('AI usage error:', e.message);
    res.status(500).json({ error: 'Erreur lors de la recuperation de l\'usage IA.' });
  }
});

// ── AI: Recipe Cost Optimizer ──
router.post('/optimize-recipe', authWithRestaurant, async (req: any, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      return res.status(400).json({ error: 'recipeId requis' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requetes/min). Reessayez dans 1 minute.' });
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, restaurantId: req.restaurantId },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvee' });
    }

    // Calculate current food cost
    const currentCost = recipe.ingredients.reduce((sum: number, ri: any) => {
      return sum + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit;
    }, 0);
    const costPerPortion = currentCost / (recipe.nbPortions || 1);

    // Build ingredient list for AI analysis
    const ingredientDetails = recipe.ingredients.map((ri: any) => {
      const d = getUnitDivisor(ri.ingredient.unit);
      return {
        name: ri.ingredient.name,
        category: ri.ingredient.category,
        quantity: ri.quantity,
        unit: ri.ingredient.unit,
        pricePerUnit: ri.ingredient.pricePerUnit,
        totalCost: +((ri.quantity / d) * ri.ingredient.pricePerUnit).toFixed(2),
        supplier: ri.ingredient.supplier || 'Non renseigne',
      };
    });

    // Get current month for seasonality
    const monthNames = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
    const currentMonth = monthNames[new Date().getMonth()];

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 3000,
      system: `Tu es un expert en optimisation des couts en restauration professionnelle en France. Tu connais les prix du marche, les fournisseurs comme Transgourmet, Metro, Brake, Promocash. Tu connais la saisonnalite des produits et les equivalences entre ingredients.

Analyse la recette fournie et propose des optimisations concretes pour reduire le food cost tout en maintenant la qualite du plat.

Nous sommes en ${currentMonth}. Prends en compte la saisonnalite des produits.

Reponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "suggestions": [
    {
      "type": "substitution" | "seasonal" | "quantity" | "supplier",
      "ingredientName": "nom de l'ingredient actuel",
      "currentCost": number,
      "suggestion": "description de la suggestion",
      "alternativeName": "nom de l'alternative ou null",
      "estimatedNewCost": number,
      "savingsPercent": number,
      "reasoning": "explication detaillee",
      "quality_impact": "aucun" | "minimal" | "modere"
    }
  ],
  "currentTotalCost": number,
  "optimizedTotalCost": number,
  "totalSavingsEuros": number,
  "totalSavingsPercent": number,
  "summary": "resume des optimisations en 2-3 phrases"
}`,
      messages: [{
        role: 'user',
        content: `Recette: ${recipe.name}
Categorie: ${recipe.category}
Portions: ${recipe.nbPortions}
Prix de vente: ${recipe.sellingPrice} EUR
Cout matiere actuel: ${currentCost.toFixed(2)} EUR (${costPerPortion.toFixed(2)} EUR/portion)

Ingredients:
${ingredientDetails.map((i: any) => `- ${i.name} (${i.category}): ${i.quantity} ${i.unit} x ${i.pricePerUnit} EUR/${i.unit} = ${i.totalCost} EUR [fournisseur: ${i.supplier}]`).join('\n')}

Propose des optimisations concretes et realistes pour reduire le cout de cette recette.`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');

    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
      res.json({
        recipe: {
          id: recipe.id,
          name: recipe.name,
          category: recipe.category,
          sellingPrice: recipe.sellingPrice,
          nbPortions: recipe.nbPortions,
        },
        currentCost: +currentCost.toFixed(2),
        costPerPortion: +costPerPortion.toFixed(2),
        ingredients: ingredientDetails,
        optimization: parsed,
      });
    } catch {
      res.json({
        recipe: {
          id: recipe.id,
          name: recipe.name,
          category: recipe.category,
          sellingPrice: recipe.sellingPrice,
          nbPortions: recipe.nbPortions,
        },
        currentCost: +currentCost.toFixed(2),
        costPerPortion: +costPerPortion.toFixed(2),
        ingredients: ingredientDetails,
        optimization: {
          suggestions: [],
          currentTotalCost: +currentCost.toFixed(2),
          optimizedTotalCost: +currentCost.toFixed(2),
          totalSavingsEuros: 0,
          totalSavingsPercent: 0,
          summary: text,
        },
      });
    }
  } catch (e: any) {
    console.error('AI optimize-recipe error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── AI Menu Optimizer (BCG Matrix) ────────────────────────────────────────
router.post('/optimize-menu', authWithRestaurant, async (req: any, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }
    if (!checkAiRateLimit(req.restaurantId)) {
      return res.status(429).json({ error: 'Limite IA atteinte (10 requêtes/min). Réessayez dans 1 minute.' });
    }

    const restaurantId = req.restaurantId;

    // Fetch all recipes with ingredients
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });

    if (!recipes.length) {
      return res.status(400).json({ error: 'Aucune recette trouvée. Ajoutez des recettes d\'abord.' });
    }

    // Fetch sales data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const sales = await prisma.menuSale.findMany({
      where: { restaurantId, date: { gte: thirtyDaysAgo } },
    });

    // Aggregate sales by recipe
    const salesByRecipe: Record<number, { qty: number; revenue: number }> = {};
    sales.forEach((s: any) => {
      if (!salesByRecipe[s.recipeId]) salesByRecipe[s.recipeId] = { qty: 0, revenue: 0 };
      salesByRecipe[s.recipeId].qty += s.quantity;
      salesByRecipe[s.recipeId].revenue += s.revenue || 0;
    });

    const totalSalesQty = Object.values(salesByRecipe).reduce((sum, s) => sum + s.qty, 0);

    // Build recipe data for AI
    const recipeData = recipes.map((r: any) => {
      const cost = r.ingredients.reduce((s: number, ri: any) => {
        return s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit;
      }, 0);
      const costPerPortion = cost / (r.nbPortions || 1);
      const margin = r.sellingPrice - costPerPortion;
      const marginPercent = r.sellingPrice > 0 ? (margin / r.sellingPrice) * 100 : 0;
      const salesData = salesByRecipe[r.id] || { qty: 0, revenue: 0 };
      const popularity = totalSalesQty > 0 ? (salesData.qty / totalSalesQty) * 100 : 0;

      return {
        id: r.id,
        name: r.name,
        category: r.category || 'Non classé',
        sellingPrice: r.sellingPrice,
        costPerPortion: +costPerPortion.toFixed(2),
        margin: +margin.toFixed(2),
        marginPercent: +marginPercent.toFixed(1),
        salesQty: salesData.qty,
        popularity: +popularity.toFixed(1),
      };
    });

    const avgMargin = recipeData.reduce((s, r) => s + r.marginPercent, 0) / recipeData.length;
    const avgPopularity = recipeData.reduce((s, r) => s + r.popularity, 0) / recipeData.length;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      system: `Tu es un expert en ingénierie de menu et optimisation de carte pour la restauration en France. Tu utilises la matrice BCG (Boston Consulting Group) adaptée à la restauration pour classifier les plats.

Les 4 quadrants :
- STARS (Vedettes) : haute marge + haute popularité → Garder et mettre en avant
- PUZZLES (Énigmes) : haute marge + faible popularité → Promouvoir (marketing, repositionnement menu)
- PLOWHORSES (Valeurs sûres) : faible marge + haute popularité → Augmenter les prix ou réduire les coûts
- DOGS (Poids morts) : faible marge + faible popularité → Retirer ou reformuler complètement

Seuils actuels : marge moyenne = ${avgMargin.toFixed(1)}%, popularité moyenne = ${avgPopularity.toFixed(1)}%

Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "stars": [{"id": number, "name": string, "action": string}],
  "puzzles": [{"id": number, "name": string, "action": string, "marketingSuggestion": string}],
  "plowhorses": [{"id": number, "name": string, "action": string, "suggestedPrice": number, "reasoning": string}],
  "dogs": [{"id": number, "name": string, "action": string, "alternative": string}],
  "priceAdjustments": [{"id": number, "name": string, "currentPrice": number, "suggestedPrice": number, "reasoning": string}],
  "menuComposition": {
    "currentCount": number,
    "suggestedCount": number,
    "recommendation": string
  },
  "revenueImpact": {
    "currentMonthlyRevenue": number,
    "estimatedMonthlyRevenue": number,
    "percentChange": number,
    "explanation": string
  },
  "summary": string
}`,
      messages: [{
        role: 'user',
        content: `Voici les données de mon menu (30 derniers jours) :

${recipeData.map(r => `- ${r.name} (id:${r.id}, ${r.category}): prix ${r.sellingPrice}€, coût ${r.costPerPortion}€, marge ${r.marginPercent}%, ${r.salesQty} ventes, popularité ${r.popularity}%`).join('\n')}

Total ventes: ${totalSalesQty}
Marge moyenne: ${avgMargin.toFixed(1)}%
Popularité moyenne: ${avgPopularity.toFixed(1)}%

Analyse mon menu et donne-moi des recommandations concrètes d'optimisation avec la matrice BCG.`,
      }],
    });

    const text = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
      res.json({
        recipes: recipeData,
        optimization: parsed,
        avgMargin: +avgMargin.toFixed(1),
        avgPopularity: +avgPopularity.toFixed(1),
        totalSales: totalSalesQty,
      });
    } catch {
      res.json({
        recipes: recipeData,
        optimization: {
          stars: [],
          puzzles: [],
          plowhorses: [],
          dogs: [],
          priceAdjustments: [],
          menuComposition: { currentCount: recipes.length, suggestedCount: recipes.length, recommendation: text },
          revenueImpact: { currentMonthlyRevenue: 0, estimatedMonthlyRevenue: 0, percentChange: 0, explanation: text },
          summary: text,
        },
        avgMargin: +avgMargin.toFixed(1),
        avgPopularity: +avgPopularity.toFixed(1),
        totalSales: totalSalesQty,
      });
    }
  } catch (e: any) {
    console.error('AI optimize-menu error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── Weekly AI Report ──────────────────────────────────────────────────────
router.post('/weekly-report', authWithRestaurant, async (req: any, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configuré. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const restaurantId = req.restaurantId;

    // Rate limit: 1 report per hour per restaurant
    if (!checkAiRateLimit(restaurantId)) {
      return res.status(429).json({ error: 'Limite atteinte. Réessayez dans quelques minutes.' });
    }

    // ── Collect all data for the weekly report ──
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoStr = oneWeekAgo.toISOString().slice(0, 10);
    const todayStr = now.toISOString().slice(0, 10);

    // 1. Recipes & margins
    const recipes = await prisma.recipe.findMany({
      where: { restaurantId, deletedAt: null },
      include: { ingredients: { include: { ingredient: true } } },
    });

    const recipeStats = recipes.map((r: any) => {
      const cost = r.ingredients.reduce((s: number, ri: any) => {
        return s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit;
      }, 0);
      const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
      return { name: r.name, category: r.category, sellingPrice: r.sellingPrice, cost: +cost.toFixed(2), margin: +margin.toFixed(1) };
    });

    const recipeCount = recipeStats.length;
    const avgMargin = recipeCount > 0 ? +(recipeStats.reduce((s, r) => s + r.margin, 0) / recipeCount).toFixed(1) : 0;
    const avgFoodCost = recipeCount > 0 ? +(recipeStats.reduce((s, r) => s + r.cost, 0) / recipeCount).toFixed(2) : 0;

    // Top 5 & Bottom 5 by margin
    const sortedByMargin = [...recipeStats].sort((a, b) => b.margin - a.margin);
    const topRecipes = sortedByMargin.slice(0, 5);
    const bottomRecipes = sortedByMargin.slice(-5).reverse();

    // 2. Stock alerts
    const inventory = await prisma.inventoryItem.findMany({
      where: { restaurantId },
      include: { ingredient: true },
    });
    const stockAlerts = inventory.filter((i: any) => i.currentStock < i.minStock).map((i: any) => ({
      name: i.ingredient.name,
      current: i.currentStock,
      min: i.minStock,
      unit: i.ingredient.unit,
    }));

    // 3. Waste data (last 7 days)
    const wasteLogs = await prisma.wasteLog.findMany({
      where: { restaurantId, date: { gte: weekAgoStr, lte: todayStr } },
      include: { ingredient: true },
    });
    const totalWasteCost = wasteLogs.reduce((s: number, w: any) => s + (w.costImpact || 0), 0);
    const wasteByReason = wasteLogs.reduce((acc: Record<string, number>, w: any) => {
      acc[w.reason] = (acc[w.reason] || 0) + (w.costImpact || 0);
      return acc;
    }, {});

    // 4. Planning hours (last 7 days)
    const shifts = await prisma.shift.findMany({
      where: { restaurantId, date: { gte: weekAgoStr, lte: todayStr } },
      include: { employee: true },
    });
    const totalHours = shifts.reduce((s: number, sh: any) => {
      const [sh1, sm1] = (sh.startTime || '0:0').split(':').map(Number);
      const [sh2, sm2] = (sh.endTime || '0:0').split(':').map(Number);
      return s + ((sh2 * 60 + sm2) - (sh1 * 60 + sm1)) / 60;
    }, 0);
    const totalLaborCost = shifts.reduce((s: number, sh: any) => {
      const [sh1, sm1] = (sh.startTime || '0:0').split(':').map(Number);
      const [sh2, sm2] = (sh.endTime || '0:0').split(':').map(Number);
      const hours = ((sh2 * 60 + sm2) - (sh1 * 60 + sm1)) / 60;
      return s + hours * (sh.employee?.hourlyRate || 12);
    }, 0);

    // 5. Sales data (last 7 days)
    const sales = await prisma.menuSale.findMany({
      where: { restaurantId, date: { gte: weekAgoStr, lte: todayStr } },
    });
    const totalRevenue = sales.reduce((s: number, sale: any) => s + sale.revenue, 0);
    const totalQuantitySold = sales.reduce((s: number, sale: any) => s + sale.quantity, 0);

    // 6. Food cost trends (category breakdown)
    const categoryBreakdown: Record<string, { count: number; avgMargin: number; totalCost: number }> = {};
    recipeStats.forEach(r => {
      if (!categoryBreakdown[r.category]) categoryBreakdown[r.category] = { count: 0, avgMargin: 0, totalCost: 0 };
      categoryBreakdown[r.category].count++;
      categoryBreakdown[r.category].avgMargin += r.margin;
      categoryBreakdown[r.category].totalCost += r.cost;
    });
    Object.keys(categoryBreakdown).forEach(cat => {
      categoryBreakdown[cat].avgMargin = +(categoryBreakdown[cat].avgMargin / categoryBreakdown[cat].count).toFixed(1);
      categoryBreakdown[cat].totalCost = +categoryBreakdown[cat].totalCost.toFixed(2);
    });

    // ── Build JSON payload for Claude ──
    const reportData = {
      periode: `${weekAgoStr} au ${todayStr}`,
      recettes: { nombre: recipeCount, margeAvg: avgMargin, coutMoyenPortion: avgFoodCost },
      top5Marges: topRecipes.map(r => `${r.name} (${r.margin}%)`),
      bottom5Marges: bottomRecipes.map(r => `${r.name} (${r.margin}%)`),
      alertesStock: stockAlerts.length > 0 ? stockAlerts.map(a => `${a.name}: ${a.current}/${a.min} ${a.unit}`) : ['Aucune alerte'],
      pertes: { coutTotal: +totalWasteCost.toFixed(2), parRaison: wasteByReason },
      planning: { heuresTotal: +totalHours.toFixed(1), coutMain: +totalLaborCost.toFixed(2) },
      ventes: { ca: +totalRevenue.toFixed(2), quantiteVendue: totalQuantitySold },
      repartitionCategories: categoryBreakdown,
    };

    // ── Call Claude Haiku for the report ──
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Génère un rapport hebdomadaire concis pour un restaurateur. Données: ${JSON.stringify(reportData)}. Format: 3-5 paragraphes en français, ton professionnel, avec recommandations actionables. Utilise des emojis professionnels pour structurer (📊 📈 ⚠️ 💡 ✅). Commence par un résumé exécutif, puis détaille les points clés, termine par des recommandations concrètes.`,
      }],
      system: 'Tu es un consultant expert en gestion de restaurant. Tu analyses les données et génères des rapports professionnels, concis et actionnables en français. Ne mentionne jamais que tu es une IA.',
    });

    const reportText = (response.content[0] as any).text || 'Rapport indisponible.';

    // ── Increment AI usage ──
    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month) DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    // ── Build key metrics ──
    const keyMetrics = {
      recipeCount,
      avgMargin,
      avgFoodCost,
      totalRevenue: +totalRevenue.toFixed(2),
      totalWasteCost: +totalWasteCost.toFixed(2),
      totalLaborCost: +totalLaborCost.toFixed(2),
      totalHours: +totalHours.toFixed(1),
      stockAlertCount: stockAlerts.length,
      totalQuantitySold,
    };

    res.json({
      report: reportText,
      generatedAt: new Date().toISOString(),
      keyMetrics,
    });
  } catch (e: any) {
    console.error('AI weekly-report error:', e.message);
    res.status(500).json({ error: 'Service IA temporairement indisponible.' });
  }
});

// ── Send Weekly Report by Email ───────────────────────────────────────────
router.post('/weekly-report/send-email', authWithRestaurant, async (req: any, res) => {
  try {
    const { report, keyMetrics } = req.body;
    if (!report) return res.status(400).json({ error: 'Rapport requis' });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return res.status(503).json({ error: 'Service email non configuré (RESEND_API_KEY manquante)' });

    const restaurantId = req.restaurantId;
    const restaurant = await prisma.restaurant.findFirst({ where: { id: restaurantId } });
    const user = await prisma.user.findFirst({ where: { id: req.user?.userId } });
    const recipientEmail = user?.email || (restaurant as any)?.email;

    if (!recipientEmail) return res.status(400).json({ error: 'Aucun email destinataire trouvé.' });

    const resend = new Resend(resendKey);
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    const metricsHtml = keyMetrics ? `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0;">
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#111;">${keyMetrics.recipeCount || 0}</div>
          <div style="font-size:12px;color:#6b7280;">Recettes</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#111;">${keyMetrics.avgMargin || 0}%</div>
          <div style="font-size:12px;color:#6b7280;">Marge moyenne</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#111;">${keyMetrics.totalRevenue || 0}&euro;</div>
          <div style="font-size:12px;color:#6b7280;">CA semaine</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#${(keyMetrics.totalWasteCost || 0) > 50 ? 'dc2626' : '111'};">${keyMetrics.totalWasteCost || 0}&euro;</div>
          <div style="font-size:12px;color:#6b7280;">Pertes</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#111;">${keyMetrics.totalHours || 0}h</div>
          <div style="font-size:12px;color:#6b7280;">Heures planning</div>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#${(keyMetrics.stockAlertCount || 0) > 0 ? 'dc2626' : '111'};">${keyMetrics.stockAlertCount || 0}</div>
          <div style="font-size:12px;color:#6b7280;">Alertes stock</div>
        </div>
      </div>
    ` : '';

    const reportHtml = report.split('\n').map((p: string) => p.trim() ? `<p style="margin:0 0 12px;line-height:1.6;color:#374151;">${p}</p>` : '').join('');

    const emailHtml = `
      <div style="max-width:640px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="background:#111;color:#fff;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;font-size:20px;font-weight:800;">Rapport Hebdomadaire IA</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">${restaurant?.name || 'Restaurant'} &mdash; Semaine du ${dateStr}</p>
        </div>
        <div style="background:#fff;padding:24px 32px;border:1px solid #e5e7eb;border-top:none;">
          ${metricsHtml}
          <div style="margin-top:20px;">
            ${reportHtml}
          </div>
        </div>
        <div style="background:#f9fafb;padding:16px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Rapport généré par RestauMargin IA</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: `${restaurant?.name || 'RestauMargin'} <contact@restaumargin.fr>`,
      to: recipientEmail,
      subject: `Rapport Hebdomadaire — ${restaurant?.name || 'Restaurant'} — ${dateStr}`,
      html: emailHtml,
    });

    res.json({ success: true, message: `Rapport envoyé à ${recipientEmail}` });
  } catch (e: any) {
    console.error('AI weekly-report email error:', e.message);
    res.status(500).json({ error: `Erreur envoi email: ${e.message}` });
  }
});

// ── POST /api/ai/waste-analysis — AI-powered waste analysis ──
router.post('/waste-analysis', authWithRestaurant, async (req: any, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const restaurantId = req.restaurantId;

    // Rate limit check
    if (!checkAiRateLimit(restaurantId)) {
      return res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' });
    }

    // Collect last 30 days of waste logs
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateThreshold = thirtyDaysAgo.toISOString().slice(0, 10);

    const wasteLogs = await prisma.wasteLog.findMany({
      where: {
        restaurantId,
        date: { gte: dateThreshold },
      },
      include: { ingredient: true },
      orderBy: { date: 'desc' },
    });

    if (wasteLogs.length === 0) {
      return res.json({
        analysis: 'Aucune donnee de gaspillage enregistree sur les 30 derniers jours. Commencez par declarer vos pertes pour obtenir une analyse IA.',
        topWasteItems: [],
        patterns: { byDayOfWeek: {}, byReason: {}, byCategory: {} },
        recommendations: [],
        estimatedSavings: 0,
        prediction: [],
      });
    }

    // Pre-compute data for Claude
    const wasteData = wasteLogs.map((w: any) => ({
      date: w.date,
      dayOfWeek: new Date(w.date).toLocaleDateString('fr-FR', { weekday: 'long' }),
      ingredient: w.ingredient.name,
      category: w.ingredient.category,
      quantity: w.quantity,
      unit: w.unit,
      reason: w.reason,
      costImpact: w.costImpact,
    }));

    // Aggregate stats for pre-computation (for structured response)
    const byIngredient: Record<string, { cost: number; qty: number; unit: string; count: number }> = {};
    const byDayOfWeek: Record<string, number> = {};
    const byReason: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byDate: Record<string, number> = {};
    let totalCost = 0;

    for (const w of wasteLogs as any[]) {
      const name = w.ingredient.name;
      if (!byIngredient[name]) byIngredient[name] = { cost: 0, qty: 0, unit: w.unit, count: 0 };
      byIngredient[name].cost += w.costImpact;
      byIngredient[name].qty += w.quantity;
      byIngredient[name].count += 1;

      const day = new Date(w.date).toLocaleDateString('fr-FR', { weekday: 'long' });
      byDayOfWeek[day] = (byDayOfWeek[day] || 0) + w.costImpact;

      byReason[w.reason] = (byReason[w.reason] || 0) + w.costImpact;

      const cat = w.ingredient.category || 'Autre';
      byCategory[cat] = (byCategory[cat] || 0) + w.costImpact;

      byDate[w.date] = (byDate[w.date] || 0) + w.costImpact;

      totalCost += w.costImpact;
    }

    // Top waste items
    const topWasteItems = Object.entries(byIngredient)
      .sort((a, b) => b[1].cost - a[1].cost)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        totalCost: Math.round(data.cost * 100) / 100,
        totalQuantity: Math.round(data.qty * 100) / 100,
        unit: data.unit,
        incidents: data.count,
      }));

    // Trend data (waste cost per day, sorted)
    const trendData = Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, cost]) => ({ date, cost: Math.round(cost * 100) / 100 }));

    // Compute daily target line (20% reduction from average)
    const avgDailyCost = totalCost / 30;
    const targetDailyCost = Math.round(avgDailyCost * 0.8 * 100) / 100;

    // Weekly prediction based on day-of-week patterns
    const dayOrder = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const daysWithData: Record<string, number[]> = {};
    for (const w of wasteLogs as any[]) {
      const day = new Date(w.date).toLocaleDateString('fr-FR', { weekday: 'long' });
      if (!daysWithData[day]) daysWithData[day] = [];
      daysWithData[day].push(w.costImpact);
    }

    const prediction = dayOrder.map(day => {
      const costs = daysWithData[day] || [];
      const avgCost = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;
      const highRisk = avgCost > avgDailyCost * 1.3;
      return {
        day,
        predictedCost: Math.round(avgCost * 100) / 100,
        highRisk,
        confidence: costs.length >= 3 ? 'haute' : costs.length >= 1 ? 'moyenne' : 'basse',
      };
    });

    // Send to Claude for qualitative analysis
    const prompt = `Analyse les donnees de gaspillage de ce restaurant. Identifie les patterns, les causes principales, et propose 5 actions concretes pour reduire le gaspillage de 20%. Donnees: ${JSON.stringify(wasteData)}

Contexte additionnel:
- Total gaspillage 30 jours: ${totalCost.toFixed(2)} EUR
- Top ingredients gaspilles: ${topWasteItems.map(i => `${i.name} (${i.totalCost}EUR)`).join(', ')}
- Repartition par cause: ${Object.entries(byReason).map(([r, c]) => `${r}: ${(c as number).toFixed(2)}EUR`).join(', ')}
- Jours les plus couteux: ${Object.entries(byDayOfWeek).sort((a, b) => (b[1] as number) - (a[1] as number)).slice(0, 3).map(([d, c]) => `${d}: ${(c as number).toFixed(2)}EUR`).join(', ')}

Reponds en JSON STRICTEMENT dans ce format (pas de texte avant/apres):
{
  "analysis": "Texte d'analyse detaillee en francais (3-5 paragraphes)",
  "recommendations": [
    {"action": "Description de l'action", "impact": "Economie estimee en EUR/mois", "priority": "haute|moyenne|basse", "timeline": "Delai de mise en oeuvre"}
  ],
  "estimatedMonthlySavings": number
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en gestion de restaurant et reduction du gaspillage alimentaire. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('');

    let aiResult: any = {};
    try {
      // Extract JSON from response (handle potential markdown wrapping)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      }
    } catch {
      aiResult = {
        analysis: responseText,
        recommendations: [],
        estimatedMonthlySavings: 0,
      };
    }

    // Increment AI usage
    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month)
      DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    res.json({
      analysis: aiResult.analysis || 'Analyse non disponible.',
      topWasteItems,
      patterns: {
        byDayOfWeek: Object.fromEntries(
          Object.entries(byDayOfWeek).map(([k, v]) => [k, Math.round((v as number) * 100) / 100])
        ),
        byReason: Object.fromEntries(
          Object.entries(byReason).map(([k, v]) => [k, Math.round((v as number) * 100) / 100])
        ),
        byCategory: Object.fromEntries(
          Object.entries(byCategory).map(([k, v]) => [k, Math.round((v as number) * 100) / 100])
        ),
      },
      recommendations: (aiResult.recommendations || []).slice(0, 5),
      estimatedSavings: aiResult.estimatedMonthlySavings || Math.round(totalCost * 0.2 * 100) / 100,
      trend: trendData,
      targetDailyCost,
      prediction,
    });
  } catch (e: any) {
    console.error('AI waste-analysis error:', e.message);
    res.status(500).json({ error: `Erreur analyse IA: ${e.message}` });
  }
});

// ── POST /api/ai/allergen-check — AI-powered allergen detection for a recipe ──
router.post('/allergen-check', authWithRestaurant, async (req: any, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const restaurantId = req.restaurantId;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ error: 'recipeId requis' });

    if (!checkAiRateLimit(restaurantId)) {
      return res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' });
    }

    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
    });

    if (!recipe) return res.status(404).json({ error: 'Recette non trouvee' });

    const ingredientsList = recipe.ingredients.map((ri: any) => {
      const d = getUnitDivisor(ri.ingredient.unit);
      return `- ${ri.ingredient.name} (${ri.quantity} ${ri.ingredient.unit}, categorie: ${ri.ingredient.category})`;
    }).join('\n');

    const prompt = `Analyse ces ingredients pour les 14 allergenes majeurs EU (gluten, crustaces, oeufs, poisson, arachides, soja, lait, fruits a coque, celeri, moutarde, sesame, sulfites, lupin, mollusques). Pour chaque allergene detecte, indique l'ingredient source et le niveau de risque (certain, probable, trace possible). Identifie aussi les risques de contamination croisee.

Ingredients de la recette "${recipe.name}":
${ingredientsList}

Reponds en JSON STRICTEMENT dans ce format (pas de texte avant/apres):
{
  "allergens": [
    {"name": "Gluten", "status": "present|absent|trace", "source": "ingredient source ou null", "riskLevel": "certain|probable|trace possible"}
  ],
  "crossContamination": [
    {"allergen": "Nom", "risk": "Description du risque", "source": "Ingredient concerne"}
  ],
  "recommendation": "Recommandation generale pour l'etiquetage menu"
}

IMPORTANT: Tu DOIS inclure les 14 allergenes dans la liste, meme ceux absents (status: "absent", source: null, riskLevel: null).`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en securite alimentaire et reglementation europeenne sur les allergenes (reglement INCO 1169/2011). Reponds uniquement en JSON valide.',
    });

    const responseText = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('');

    let aiResult: any = {};
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      }
    } catch {
      aiResult = {
        allergens: [],
        crossContamination: [],
        recommendation: responseText,
      };
    }

    // Increment AI usage
    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month)
      DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    res.json({
      recipeName: recipe.name,
      allergens: aiResult.allergens || [],
      crossContamination: aiResult.crossContamination || [],
      recommendation: aiResult.recommendation || '',
    });
  } catch (e: any) {
    console.error('AI allergen-check error:', e.message);
    res.status(500).json({ error: `Erreur analyse allergenes IA: ${e.message}` });
  }
});

// ── POST /api/ai/nutrition-estimate — AI-powered nutrition estimation for a recipe ──
router.post('/nutrition-estimate', authWithRestaurant, async (req: any, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    }

    const restaurantId = req.restaurantId;
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ error: 'recipeId requis' });

    if (!checkAiRateLimit(restaurantId)) {
      return res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' });
    }

    const recipe = await prisma.recipe.findFirst({
      where: { id: recipeId, restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
    });

    if (!recipe) return res.status(404).json({ error: 'Recette non trouvee' });

    const ingredientsList = recipe.ingredients.map((ri: any) => {
      const d = getUnitDivisor(ri.ingredient.unit);
      const qtyInBase = ri.quantity / d;
      return `- ${ri.ingredient.name}: ${ri.quantity} ${ri.ingredient.unit} (soit ${qtyInBase.toFixed(3)} ${ri.ingredient.unit === 'g' || ri.ingredient.unit === 'mg' ? 'kg' : ri.ingredient.unit === 'cl' || ri.ingredient.unit === 'ml' || ri.ingredient.unit === 'dl' ? 'L' : ri.ingredient.unit})`;
    }).join('\n');

    const prompt = `Estime les valeurs nutritionnelles par portion de cette recette. Base-toi sur les quantites fournies.

Recette: "${recipe.name}" (${recipe.nbPortions} portions)
Ingredients:
${ingredientsList}

Reponds en JSON STRICTEMENT dans ce format (pas de texte avant/apres):
{
  "perPortion": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sodium": number
  },
  "healthScore": number,
  "dietaryLabels": ["label1", "label2"],
  "analysis": "Courte analyse nutritionnelle en francais"
}

REGLES:
- calories en kcal, protein/carbs/fat/fiber en grammes, sodium en mg
- healthScore de 0 a 100 (100 = tres sain)
- dietaryLabels: labels pertinents parmi "Riche en proteines", "Sans gluten", "Vegetarien", "Vegan", "Faible en calories", "Riche en fibres", "Pauvre en sodium", "Riche en lipides", "Equilibre", "Source de calcium", "Riche en fer", "Faible en sucres", etc.
- Divise les quantites totales par ${recipe.nbPortions} portions`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un nutritionniste expert. Estime les valeurs nutritionnelles a partir des ingredients et quantites. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('');

    let aiResult: any = {};
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      }
    } catch {
      aiResult = {
        perPortion: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
        healthScore: 50,
        dietaryLabels: [],
        analysis: responseText,
      };
    }

    // Increment AI usage
    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month)
      DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    res.json({
      recipeName: recipe.name,
      nbPortions: recipe.nbPortions,
      perPortion: aiResult.perPortion || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
      healthScore: aiResult.healthScore || 50,
      dietaryLabels: aiResult.dietaryLabels || [],
      analysis: aiResult.analysis || '',
    });
  } catch (e: any) {
    console.error('AI nutrition-estimate error:', e.message);
    res.status(500).json({ error: `Erreur estimation nutrition IA: ${e.message}` });
  }
});

// ── GET /api/ai/allergen-matrix — Get allergen matrix for all recipes ──
router.get('/allergen-matrix', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;

    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
      orderBy: { category: 'asc' },
    });

    const EU_ALLERGENS = [
      'Gluten', 'Crustaces', 'Oeufs', 'Poisson', 'Arachides', 'Soja',
      'Lait', 'Fruits a coque', 'Celeri', 'Moutarde', 'Sesame',
      'Sulfites', 'Lupin', 'Mollusques',
    ];

    // Keyword-based allergen detection (same logic as frontend)
    const ALLERGEN_KEYWORDS: Record<string, string[]> = {
      'Gluten': ['ble', 'blé', 'farine', 'semoule', 'orge', 'seigle', 'avoine', 'epeautre', 'épeautre', 'kamut', 'pain', 'pate', 'pâte', 'chapelure', 'couscous', 'boulgour'],
      'Crustaces': ['crustace', 'crustacé', 'crevette', 'homard', 'langouste', 'langoustine', 'crabe', 'ecrevisse', 'écrevisse', 'gambas'],
      'Oeufs': ['oeuf', 'œuf', 'oeufs', 'œufs', 'mayonnaise'],
      'Poisson': ['poisson', 'saumon', 'cabillaud', 'thon', 'truite', 'sole', 'bar', 'merlu', 'colin', 'anchois', 'sardine', 'dorade', 'lotte', 'lieu', 'fletan', 'flétan', 'maquereau', 'morue'],
      'Arachides': ['arachide', 'cacahuete', 'cacahuète', 'cacahouete', 'cacahouète'],
      'Soja': ['soja', 'tofu', 'edamame', 'tempeh', 'miso'],
      'Lait': ['lait', 'creme', 'crème', 'beurre', 'fromage', 'yaourt', 'yogourt', 'mascarpone', 'ricotta', 'mozzarella', 'parmesan', 'gruyere', 'gruyère', 'emmental', 'comte', 'comté', 'chevre', 'chèvre', 'roquefort', 'camembert', 'brie', 'reblochon', 'raclette', 'lactose'],
      'Fruits a coque': ['amande', 'noisette', 'noix', 'cajou', 'pistache', 'pecan', 'pécan', 'macadamia', 'pignon', 'pralin'],
      'Celeri': ['celeri', 'céleri'],
      'Moutarde': ['moutarde'],
      'Sesame': ['sesame', 'sésame', 'tahini', 'tahin'],
      'Sulfites': ['sulfite', 'vin', 'vinaigre', 'porto', 'madere', 'madère', 'xeres', 'xérès'],
      'Lupin': ['lupin'],
      'Mollusques': ['mollusque', 'moule', 'huitre', 'huître', 'calamar', 'poulpe', 'seiche', 'escargot', 'palourde', 'coque', 'bulot', 'bigorneau', 'encornet', 'saint-jacques'],
    };

    const matrix = recipes.map((r: any) => {
      const ingredientNames = r.ingredients.map((ri: any) => ri.ingredient.name.toLowerCase());
      const allergenStatus: Record<string, { present: boolean; sources: string[] }> = {};

      for (const allergen of EU_ALLERGENS) {
        const keywords = ALLERGEN_KEYWORDS[allergen] || [];
        const sources: string[] = [];
        for (const ri of r.ingredients) {
          const name = ri.ingredient.name.toLowerCase();
          if (keywords.some((kw: string) => name.includes(kw))) {
            sources.push(ri.ingredient.name);
          }
          // Also check DB allergens
          if (ri.ingredient.allergens?.some((a: string) => a.toLowerCase().includes(allergen.toLowerCase()))) {
            if (!sources.includes(ri.ingredient.name)) {
              sources.push(ri.ingredient.name);
            }
          }
        }
        allergenStatus[allergen] = { present: sources.length > 0, sources };
      }

      return {
        id: r.id,
        name: r.name,
        category: r.category,
        allergens: allergenStatus,
      };
    });

    res.json({ allergens: EU_ALLERGENS, recipes: matrix });
  } catch (e: any) {
    console.error('Allergen matrix error:', e.message);
    res.status(500).json({ error: `Erreur matrice allergenes: ${e.message}` });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/ai/demand-forecast — Demand Forecasting (90 days sales data)
// ══════════════════════════════════════════════════════════════════════════
router.post('/demand-forecast', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    if (!checkAiRateLimit(restaurantId)) return res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' });

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
      return res.json({
        predictions: [],
        insights: 'Aucune donnee de vente sur les 90 derniers jours. Enregistrez des ventes dans le menu engineering pour obtenir des previsions IA.',
      });
    }

    const grouped: Record<string, Record<number, number[]>> = {};
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    for (const sale of salesData as any[]) {
      const dayOfWeek = dayNames[new Date(sale.date).getDay()];
      if (!grouped[dayOfWeek]) grouped[dayOfWeek] = {};
      if (!grouped[dayOfWeek][sale.recipeId]) grouped[dayOfWeek][sale.recipeId] = [];
      grouped[dayOfWeek][sale.recipeId].push(sale.quantity);
    }

    const summary = Object.entries(grouped).map(([day, recipeData]) => {
      const lines = Object.entries(recipeData).map(([recipeId, quantities]) => {
        const r = recipeMap[Number(recipeId)];
        const avg = quantities.reduce((a, b) => a + b, 0) / quantities.length;
        return `  ${r?.name || `Recette #${recipeId}`} (${r?.category || '?'}): moy ${avg.toFixed(1)} / service, ${quantities.length} donnees`;
      }).join('\n');
      return `${day}:\n${lines}`;
    }).join('\n\n');

    const prompt = `Analyse les ventes des 90 derniers jours de ce restaurant. Predis les quantites a preparer pour chaque plat pour les 7 prochains jours, par jour. Tiens compte des tendances, saisonnalite, et jours de la semaine.

Donnees de ventes (moyennes par jour de semaine):
${summary}

Liste des recettes: ${recipes.map(r => `${r.name} (${r.category}, ${r.sellingPrice}EUR)`).join(', ')}

Reponds en JSON STRICTEMENT dans ce format (pas de texte avant/apres):
{
  "predictions": [
    {
      "date": "YYYY-MM-DD",
      "dayOfWeek": "lundi",
      "recipes": [
        { "name": "Nom du plat", "predictedQuantity": 12, "confidence": 0.85 }
      ]
    }
  ],
  "insights": "Texte d'analyse en francais (2-3 paragraphes sur les tendances observees)"
}

Genere les predictions pour les 7 prochains jours a partir d'aujourd'hui (${new Date().toISOString().slice(0, 10)}).`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en prevision de demande pour la restauration. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    let aiResult: any = {};
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResult = JSON.parse(jsonMatch[0]);
    } catch {
      aiResult = { predictions: [], insights: responseText };
    }

    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month)
      DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    res.json({
      predictions: aiResult.predictions || [],
      insights: aiResult.insights || 'Analyse non disponible.',
    });
  } catch (e: any) {
    console.error('AI demand-forecast error:', e.message);
    res.status(500).json({ error: `Erreur prevision IA: ${e.message}` });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/ai/pricing-suggestions — Dynamic Pricing Suggestions
// ══════════════════════════════════════════════════════════════════════════
router.post('/pricing-suggestions', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    if (!checkAiRateLimit(restaurantId)) return res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' });

    const recipes = await prisma.recipe.findMany({
      where: { restaurantId },
      include: { ingredients: { include: { ingredient: true } } },
    });

    if (recipes.length === 0) {
      return res.json({
        suggestions: [],
        summary: 'Aucune recette trouvee. Ajoutez des recettes avec leurs ingredients pour obtenir des suggestions de prix.',
      });
    }

    const recipeData = recipes.map((r: any) => {
      const cost = r.ingredients.reduce((s: number, ri: any) => s + (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit, 0);
      const margin = r.sellingPrice > 0 ? ((r.sellingPrice - cost) / r.sellingPrice * 100) : 0;
      const coefficient = r.sellingPrice > 0 ? r.sellingPrice / cost : 0;
      return {
        id: r.id, name: r.name, category: r.category,
        sellingPrice: r.sellingPrice, cost: Math.round(cost * 100) / 100,
        margin: Math.round(margin * 10) / 10, coefficient: Math.round(coefficient * 100) / 100,
      };
    });

    const prompt = `Propose des ajustements de prix pour maximiser la marge totale de ce restaurant. Considere l'elasticite prix, la saisonnalite, et les couts matiere actuels.

Recettes et prix actuels:
${recipeData.map(r => `- ${r.name} (${r.category}): vente ${r.sellingPrice}EUR, cout ${r.cost}EUR, marge ${r.margin}%, coeff ${r.coefficient}`).join('\n')}

Regles metier:
- Coefficient minimum acceptable: 3.0 pour les plats, 4.0 pour les boissons
- Food cost cible: 25-35%
- Les prix doivent rester psychologiquement attractifs (ex: 14.90 plutot que 15.00)
- Saison actuelle: ${new Date().toLocaleDateString('fr-FR', { month: 'long' })}

Reponds en JSON STRICTEMENT dans ce format (pas de texte avant/apres):
{
  "suggestions": [
    { "recipeId": 1, "recipeName": "Nom du plat", "currentPrice": 12.00, "suggestedPrice": 13.90, "reasoning": "Explication courte en francais", "estimatedImpact": "+180 EUR/mois" }
  ],
  "summary": "Resume global des recommandations (2-3 phrases)"
}

Concentre-toi sur les 10 recettes avec le plus de potentiel d'amelioration.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en pricing pour la restauration. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    let aiResult: any = {};
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResult = JSON.parse(jsonMatch[0]);
    } catch {
      aiResult = { suggestions: [], summary: responseText };
    }

    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month)
      DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    res.json({
      suggestions: aiResult.suggestions || [],
      summary: aiResult.summary || 'Analyse non disponible.',
    });
  } catch (e: any) {
    console.error('AI pricing-suggestions error:', e.message);
    res.status(500).json({ error: `Erreur suggestions prix IA: ${e.message}` });
  }
});

// ══════════════════════════════════════════════════════════════════════════
// POST /api/ai/supplier-brief — Supplier Negotiation Brief
// ══════════════════════════════════════════════════════════════════════════
router.post('/supplier-brief', authWithRestaurant, async (req: any, res) => {
  try {
    const restaurantId = req.restaurantId;
    const { supplierId } = req.body;
    if (!supplierId) return res.status(400).json({ error: 'supplierId requis' });
    if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' });
    if (!checkAiRateLimit(restaurantId)) return res.status(429).json({ error: 'Limite de requetes atteinte. Reessayez dans 1 minute.' });

    const supplier = await prisma.supplier.findFirst({ where: { id: supplierId, restaurantId } });
    if (!supplier) return res.status(404).json({ error: 'Fournisseur introuvable' });

    const ingredients = await prisma.ingredient.findMany({
      where: { restaurantId, supplierId },
      orderBy: { pricePerUnit: 'desc' },
    });

    const allIngredients = await prisma.ingredient.findMany({
      where: { restaurantId },
      include: { supplierRef: true },
    });

    const otherSuppliers = await prisma.supplier.findMany({
      where: { restaurantId, id: { not: supplierId } },
      select: { id: true, name: true },
    });

    const totalMonthlySpend = ingredients.reduce((s, i) => s + i.pricePerUnit, 0);
    const ingredientSummary = ingredients.map(i => `- ${i.name}: ${i.pricePerUnit}EUR/${i.unit} (categorie: ${i.category})`).join('\n');

    const alternatives: string[] = [];
    for (const ing of ingredients) {
      const altIng = allIngredients.filter(a => a.name.toLowerCase() === ing.name.toLowerCase() && a.supplierId !== supplierId && a.supplierRef);
      if (altIng.length > 0) {
        alternatives.push(`${ing.name}: ${altIng.map(a => `${(a.supplierRef as any)?.name || '?'} a ${a.pricePerUnit}EUR/${a.unit}`).join(', ')} vs ${supplier.name} a ${ing.pricePerUnit}EUR/${ing.unit}`);
      }
    }

    const prompt = `Prepare un brief de negociation fournisseur. Points forts: volumes, fidelite, alternatives. Arguments pour obtenir -5 a -15% sur les prix principaux.

Fournisseur: ${supplier.name}
Contact: ${supplier.contactName || 'Non renseigne'}
Ville: ${supplier.city || 'Non renseignee'}
Categories: ${(supplier.categories as string[])?.join(', ') || 'Non renseigne'}

Produits achetes (${ingredients.length} references):
${ingredientSummary || 'Aucun ingredient lie'}

Depense mensuelle estimee: ${totalMonthlySpend.toFixed(2)} EUR
Nombre d'autres fournisseurs: ${otherSuppliers.length}

Alternatives trouvees:
${alternatives.length > 0 ? alternatives.join('\n') : 'Aucune alternative directe identifiee'}

Reponds en JSON STRICTEMENT dans ce format (pas de texte avant/apres):
{
  "supplierName": "${supplier.name}",
  "negotiationPoints": ["Point 1", "Point 2"],
  "priceTargets": [{ "product": "Nom", "currentPrice": 5.00, "targetPrice": 4.25, "argument": "Justification" }],
  "alternatives": [{ "product": "Nom", "alternativeSupplier": "Fournisseur", "alternativePrice": 4.00 }],
  "emailDraft": "Objet: Revision tarifaire\\n\\nBonjour [Nom],\\n\\n... email complet de negociation en francais ..."
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: 'Tu es un expert en achat et negociation fournisseur pour la restauration. Reponds uniquement en JSON valide.',
    });

    const responseText = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    let aiResult: any = {};
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) aiResult = JSON.parse(jsonMatch[0]);
    } catch {
      aiResult = { supplierName: supplier.name, negotiationPoints: [], priceTargets: [], alternatives: [], emailDraft: responseText };
    }

    const month = new Date().toISOString().slice(0, 7);
    await prisma.$executeRaw`
      INSERT INTO ai_usage (restaurant_id, month, requests_count)
      VALUES (${restaurantId}, ${month}, 1)
      ON CONFLICT (restaurant_id, month)
      DO UPDATE SET requests_count = ai_usage.requests_count + 1
    `;

    res.json({
      supplierName: aiResult.supplierName || supplier.name,
      negotiationPoints: aiResult.negotiationPoints || [],
      priceTargets: aiResult.priceTargets || [],
      alternatives: aiResult.alternatives || [],
      emailDraft: aiResult.emailDraft || '',
    });
  } catch (e: any) {
    console.error('AI supplier-brief error:', e.message);
    res.status(500).json({ error: `Erreur brief negociation IA: ${e.message}` });
  }
});

export default router;
