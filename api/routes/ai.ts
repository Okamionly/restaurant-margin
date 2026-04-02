import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { prisma, authWithRestaurant } from '../middleware';

const router = Router();

// ── AI Client & Rate Limiting ──
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
const aiRateLimit = new Map<number, { count: number; resetAt: number }>();
const aiRateLimitPerRestaurant = new Map<number, { count: number; resetAt: number }>();

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
      model: 'claude-haiku-4-5-20251001',
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
    const { message, history } = req.body;
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
        const cost = r.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
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
- daily_report(date)
- log_temperature(zone, temperature, recordedBy, notes?)
- cleaning_checklist(date)

RÈGLES : Prix réalistes restauration FR. Catégories recettes: Entrées/Plats/Desserts/Boissons/Accompagnements. Catégories ingrédients: Viandes/Poissons/Légumes/Fruits/Produits laitiers/Épicerie sèche/Surgelés/Boissons/Condiments/Boulangerie. Unités: kg/g/L/cl/unité/botte/pièce. Shifts: Matin/Midi/Soir/Coupure. Zones HACCP: Frigo/Congélateur/Plats chauds/Réception. Toujours inclure ingrédients avec quantités/prix dans create_recipe. Utiliser les IDs visibles dans les données. Concis, max 400 mots, français.

DONNÉES DU RESTAURANT :
${context}`;

    // ── Step 3: Choose model + max_tokens based on intent & message length ──
    const useAdvancedModel = intent === 'analysis' || message.trim().length > 200;
    const aiModel = useAdvancedModel ? 'claude-sonnet-4-20250514' : 'claude-haiku-4-5-20251001';
    const maxTokens = ['analysis', 'recipe', 'planning'].includes(intent) ? 2048 : 1024;

    // Build messages with conversation history
    const claudeMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-5);
      for (const h of recentHistory) {
        claudeMessages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content,
        });
      }
    }
    claudeMessages.push({ role: 'user' as const, content: message.trim() });

    // Ensure messages alternate correctly (Claude requires user/assistant alternation)
    const sanitizedMessages: typeof claudeMessages = [];
    for (const msg of claudeMessages) {
      const last = sanitizedMessages[sanitizedMessages.length - 1];
      if (last && last.role === msg.role) {
        // Merge consecutive same-role messages
        last.content += '\n' + msg.content;
      } else {
        sanitizedMessages.push({ ...msg });
      }
    }
    // Claude requires first message to be 'user'
    if (sanitizedMessages.length > 0 && sanitizedMessages[0].role === 'assistant') {
      sanitizedMessages.shift();
    }

    const response = await anthropic.messages.create({
      model: aiModel,
      max_tokens: maxTokens,
      system: actionSystemPrompt,
      messages: sanitizedMessages,
    });

    const fullText = response.content.filter(b => b.type === 'text').map(b => b.type === 'text' ? b.text : '').join('');

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
            const ingredientCosts = recipe.ingredients.map((ri: any) => ({
              name: ri.ingredient.name,
              quantity: ri.quantity,
              unit: ri.ingredient.unit,
              unitPrice: ri.ingredient.pricePerUnit,
              cost: Math.round(ri.quantity * ri.ingredient.pricePerUnit * 100) / 100,
              wastePercent: ri.wastePercent || 0,
              costWithWaste: Math.round(ri.quantity * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100) * 100) / 100,
            }));
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
            const cost = r.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit * (1 + (ri.wastePercent || 0) / 100), 0);
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
              const cost = recipe.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
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
            const itemsList = items.map((i: any) =>
              `<tr><td style="padding:8px;border:1px solid #ddd;">${i.name}</td><td style="padding:8px;border:1px solid #ddd;">${i.quantity} ${i.unit}</td><td style="padding:8px;border:1px solid #ddd;">${(i.price * i.quantity).toFixed(2)}€</td></tr>`
            ).join('');
            const total = items.reduce((s: number, i: any) => s + (i.price || 0) * (i.quantity || 0), 0);

            const resendKey = process.env.RESEND_API_KEY;
            if (!resendKey) {
              actions.push({ type: 'send_order_email', success: false, message: 'Service email non configuré (RESEND_API_KEY manquante)' });
            } else {
              const resend = new Resend(resendKey);
              await resend.emails.send({
                from: `${restaurant?.name || 'RestauMargin'} <contact@restaumargin.fr>`,
                to: d.email || 'contact@transgourmet.fr',
                subject: `Commande ${restaurant?.name || ''} — ${new Date().toLocaleDateString('fr-FR')}`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px;">
                    <h2>Commande de ${restaurant?.name || 'Restaurant'}</h2>
                    <p>${restaurant?.address || ''}</p>
                    <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
                      <tr style="background: #0d9488; color: white;">
                        <th>Produit</th><th>Quantité</th><th>Total</th>
                      </tr>
                      ${itemsList}
                      <tr style="font-weight: bold;">
                        <td colspan="2" style="padding:8px;border:1px solid #ddd;">Total HT</td><td style="padding:8px;border:1px solid #ddd;">${total.toFixed(2)}€</td>
                      </tr>
                    </table>
                    ${d.notes ? `<p><strong>Notes :</strong> ${d.notes}</p>` : ''}
                    <p style="color: #666; font-size: 12px;">Envoyé via RestauMargin</p>
                  </div>
                `
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
              const cost = r.ingredients.reduce((s: number, ri: any) => s + ri.quantity * ri.ingredient.pricePerUnit, 0);
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
    const inputTokens = response.usage?.input_tokens || 0;
    const outputTokens = response.usage?.output_tokens || 0;
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

    res.json({ response: cleanedText, actions, usage: response.usage });
  } catch (e: any) {
    console.error('AI error:', e.message);
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
      model: 'claude-haiku-4-5-20251001',
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
      model: 'claude-haiku-4-5-20251001',
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
      model: 'claude-haiku-4-5-20251001',
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
      model: 'claude-haiku-4-5-20251001',
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

export default router;
