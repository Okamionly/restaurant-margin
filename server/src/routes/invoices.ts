import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';
import Anthropic from '@anthropic-ai/sdk';

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
export const invoicesRouter = Router();

/* ─── GET /api/invoices ─── */
invoicesRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { restaurantId: req.restaurantId! },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des factures' });
  }
});

/* ─── POST /api/invoices ─── */
invoicesRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { supplierName, invoiceNumber, invoiceDate, totalAmount, items } = req.body;

    if (!supplierName || !invoiceNumber) {
      res.status(400).json({ error: 'supplierName et invoiceNumber sont requis' });
      return;
    }

    interface InvoiceItemInput {
      productName?: string;
      quantity?: number;
      unit?: string;
      unitPrice?: number;
      total?: number;
      ingredientId?: number | null;
    }

    const invoiceItems = (items || []).map((item: InvoiceItemInput) => ({
      productName: item.productName || '',
      quantity: item.quantity || 0,
      unit: item.unit || '',
      unitPrice: item.unitPrice || 0,
      total: item.total || 0,
      ingredientId: item.ingredientId || null,
    }));

    const computedTotal = totalAmount || invoiceItems.reduce((s: number, i: { total: number }) => s + i.total, 0);

    const invoice = await prisma.invoice.create({
      data: {
        supplierName,
        invoiceNumber,
        invoiceDate: invoiceDate || new Date().toISOString().slice(0, 10),
        totalAmount: computedTotal,
        status: 'pending',
        restaurantId: req.restaurantId!,
        items: {
          create: invoiceItems,
        },
      },
      include: { items: true },
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la facture' });
  }
});

/* ─── POST /api/invoices/scan — extraction LLM (vision) ─── */
invoicesRouter.post('/scan', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) { res.status(503).json({ error: 'Service IA non configure. Ajoutez ANTHROPIC_API_KEY.' }); return; }
    const { imageBase64, fileBase64, mimeType, fileName } = req.body as { imageBase64?: string; fileBase64?: string; mimeType: string; fileName?: string };
    const data = fileBase64 || imageBase64;
    if (!data || !mimeType) { res.status(400).json({ error: 'fichier (base64) et mimeType requis' }); return; }

    const fname = (fileName || '').toLowerCase();
    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType === 'application/pdf' || fname.endsWith('.pdf');
    const isText = mimeType.startsWith('text/') || /\.(md|markdown|txt|csv|tsv)$/.test(fname);
    const isWordExcel = /officedocument|msword|ms-excel/.test(mimeType) || /\.(docx?|xlsx?|pptx?)$/.test(fname);
    if (isWordExcel) { res.status(415).json({ error: "Word et Excel ne sont pas encore lus directement. Exportez la facture en PDF puis rescannez." }); return; }

    const promptText = `Analyse cette facture / ce bon de livraison d'un fournisseur restaurant et extrais les donnees.

Retourne un objet JSON avec :
- fournisseur (string|null) : nom du fournisseur
- dateFacture (string|null, format YYYY-MM-DD) : date de la facture
- numeroFacture (string|null) : numero de facture
- items (array) : une entree par ligne produit, avec :
    - name (string) : libelle du produit
    - quantity (number|null) : quantite facturee
    - unit (string) : UNITE DE BASE normalisee parmi "kg", "L" ou "unite"
    - unitPrice (number|null) : prix HT par UNITE DE BASE. Si le produit est vendu au conditionnement (ex : "Carton de 6x1L", "Sac 25kg"), DIVISE pour obtenir le prix reel par kg / L / unite
    - totalPrice (number|null) : montant HT total de la ligne
    - packaging (string|null) : conditionnement d'origine s'il est indique, sinon null
    - confidence (number) : confiance entre 0 et 1
- totalHT (number|null), totalTTC (number|null), tva (number|null)

Regles : extrais TOUTES les lignes ; convertis unite ET prix vers l'unite de base ; si une valeur est absente mets null (n'invente jamais) ; reponds avec un objet JSON valide uniquement.`;

    let content: unknown;
    if (isImage) {
      content = [ { type: 'image', source: { type: 'base64', media_type: mimeType, data } }, { type: 'text', text: promptText } ];
    } else if (isPdf) {
      content = [ { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } }, { type: 'text', text: promptText } ];
    } else if (isText) {
      let txt = '';
      try { txt = Buffer.from(data, 'base64').toString('utf-8').slice(0, 100000); } catch { txt = ''; }
      content = [ { type: 'text', text: `Contenu texte du fichier "${fileName || 'facture'}" :\n\n${txt}\n\n---\n\n${promptText}` } ];
    } else {
      res.status(415).json({ error: 'Format non supporte. Acceptes : image, PDF, Markdown/texte/CSV. Pour Word/Excel, convertissez en PDF.' }); return;
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: "Tu es un expert-comptable specialise en restauration (CHR). Tu lis des factures et bons de livraison fournisseurs et tu extrais les donnees en JSON strict. Tu ramenes systematiquement chaque prix a l'unite de base (kg, L ou unite) pour qu'il soit directement comparable au cout matiere d'un ingredient. Reponds UNIQUEMENT avec un objet JSON valide : pas de markdown, pas de commentaire, pas d'explication.",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: [{ role: 'user', content: content as any }],
    });

    const rawText = (response.content[0] as { type: 'text'; text: string }).text;
    let jsonStr = rawText.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();
    const braceStart = jsonStr.indexOf('{');
    if (braceStart > 0) jsonStr = jsonStr.slice(braceStart);
    try { res.json(JSON.parse(jsonStr)); }
    catch { res.status(422).json({ error: "Impossible d'analyser la reponse", raw: rawText }); }
  } catch (e) {
    const err = e as { status?: number; message?: string };
    if (err?.status === 400 && err?.message?.includes('credit balance')) { res.status(503).json({ error: 'Service IA temporairement indisponible. Reessayez plus tard.' }); return; }
    console.error('scan error:', e);
    res.status(500).json({ error: 'Erreur scan facture' });
  }
});

/* ─── POST /api/invoices/import — cree la facture + met a jour/cree les
      ingredients + historise chaque prix + detecte l'inflation (transaction) ─── */
invoicesRouter.post('/import', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { supplierName, invoiceNumber, invoiceDate, totalHT, totalTTC, lines, inflationThreshold } = req.body;
    const restaurantId = req.restaurantId!;
    const threshold = typeof inflationThreshold === 'number' && inflationThreshold >= 0 ? inflationThreshold : 15;
    const today = new Date().toISOString().slice(0, 10);
    interface ImportLine { productName?: string; quantity?: number; unit?: string; unitPrice?: number; totalPrice?: number; apply?: boolean; ingredientId?: number | null; createNew?: boolean; category?: string }
    const safeLines: ImportLine[] = Array.isArray(lines) ? lines : [];

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          supplierName: String(supplierName || 'Inconnu').slice(0, 200),
          invoiceNumber: String(invoiceNumber || '').slice(0, 100) || `SCAN-${today}`,
          invoiceDate: invoiceDate || today,
          totalAmount: totalTTC ?? totalHT ?? 0,
          status: 'processed',
          restaurantId,
          items: { create: safeLines.map((l) => ({ productName: String(l.productName || '').slice(0, 300), quantity: l.quantity || 0, unit: String(l.unit || '').slice(0, 20), unitPrice: l.unitPrice || 0, total: l.totalPrice || 0 })) },
        },
        include: { items: true },
      });

      let pricesUpdated = 0, created = 0;
      const alerts: Array<{ ingredientId: number; name: string; oldPrice: number; newPrice: number; pct: number }> = [];
      const changedIngredientIds: number[] = [];
      const items = invoice.items;

      for (let i = 0; i < safeLines.length; i++) {
        const l = safeLines[i]; const item = items[i]; const newPrice = l.unitPrice;
        if (!l.apply || newPrice == null || !isFinite(newPrice) || newPrice <= 0) continue;

        if (l.createNew && !l.ingredientId) {
          const nm = String(l.productName || '').trim(); if (!nm) continue;
          const dup = await tx.ingredient.findFirst({ where: { restaurantId, name: { equals: nm, mode: 'insensitive' } } });
          const ing = dup || await tx.ingredient.create({ data: { name: nm, unit: String(l.unit || 'kg').slice(0, 20), pricePerUnit: newPrice, category: String(l.category || 'Épicerie sèche').slice(0, 60), allergens: [], restaurantId, supplier: supplierName ? String(supplierName).slice(0, 200) : null } });
          if (dup && dup.pricePerUnit !== newPrice) await tx.ingredient.update({ where: { id: dup.id }, data: { pricePerUnit: newPrice } });
          await tx.priceHistory.create({ data: { ingredientId: ing.id, price: newPrice, date: today, source: 'invoice', restaurantId } });
          if (item) await tx.invoiceItem.update({ where: { id: item.id }, data: { ingredientId: ing.id } });
          created++; changedIngredientIds.push(ing.id); continue;
        }

        if (l.ingredientId) {
          const ing = await tx.ingredient.findFirst({ where: { id: l.ingredientId, restaurantId } });
          if (!ing) continue;
          const oldPrice = ing.pricePerUnit;
          if (oldPrice !== newPrice) {
            await tx.ingredient.update({ where: { id: ing.id }, data: { pricePerUnit: newPrice } });
            await tx.priceHistory.create({ data: { ingredientId: ing.id, price: newPrice, date: today, source: 'invoice', restaurantId } });
            pricesUpdated++; changedIngredientIds.push(ing.id);
            const pct = oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;
            if (pct > threshold) alerts.push({ ingredientId: ing.id, name: ing.name, oldPrice, newPrice, pct: Math.round(pct * 10) / 10 });
          }
          if (item) await tx.invoiceItem.update({ where: { id: item.id }, data: { ingredientId: ing.id } });
        }
      }

      return { invoiceId: invoice.id, pricesUpdated, created, alerts, changedIngredientIds };
    }, { timeout: 20000 });

    if (result.changedIngredientIds.length) {
      try {
        const affected = await prisma.recipeIngredient.findMany({ where: { ingredientId: { in: result.changedIngredientIds } }, select: { recipeId: true } });
        const recipeIds = [...new Set(affected.map((a) => a.recipeId))];
        if (recipeIds.length) await prisma.recipe.updateMany({ where: { id: { in: recipeIds } }, data: { updatedAt: new Date() } });
      } catch (e) { console.error('import recalc touch error:', e); }
    }

    res.status(201).json({ invoiceId: result.invoiceId, pricesUpdated: result.pricesUpdated, created: result.created, alerts: result.alerts });
  } catch (e) { console.error('invoice import error:', e); res.status(500).json({ error: 'Erreur import facture' }); }
});

/* ─── DELETE /api/invoices/:id ─── */
invoicesRouter.delete('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }

    // Verify ownership
    const existing = await prisma.invoice.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) { res.status(404).json({ error: 'Facture non trouvée' }); return; }

    await prisma.invoice.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as { code: string }).code === 'P2025') {
      res.status(404).json({ error: 'Facture non trouvée' });
      return;
    }
    res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
  }
});

/* ─── POST /api/invoices/:id/apply ─── */
invoicesRouter.post('/:id/apply', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }

    const invoice = await prisma.invoice.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!invoice) {
      res.status(404).json({ error: 'Facture non trouvée' });
      return;
    }

    const { matches } = req.body;

    await prisma.invoice.update({
      where: { id },
      data: { status: 'applied' },
    });

    res.json({ success: true, applied: matches?.length || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'application des prix' });
  }
});
