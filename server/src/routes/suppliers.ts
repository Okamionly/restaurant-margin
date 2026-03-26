import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const suppliersRouter = Router();

// GET /api/suppliers - List all suppliers
suppliersRouter.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { ingredients: true } },
        ingredients: {
          orderBy: { name: 'asc' },
          select: { id: true, name: true, unit: true, pricePerUnit: true, category: true },
        },
      },
    });
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des fournisseurs' });
  }
});

// GET /api/suppliers/:id - Get supplier with its ingredients
suppliersRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(req.params.id as string) },
      include: {
        ingredients: {
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            unit: true,
            pricePerUnit: true,
            category: true,
          },
        },
      },
    });
    if (!supplier) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/suppliers - Create supplier
suppliersRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, phone, email, address, city, postalCode, region, country,
      siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        region: region || null,
        country: country || 'France',
        siret: siret || null,
        website: website || null,
        notes: notes || null,
        categories: Array.isArray(categories) ? categories : [],
        contactName: contactName || null,
        delivery: delivery !== undefined ? delivery : true,
        minOrder: minOrder || null,
        paymentTerms: paymentTerms || null,
      },
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du fournisseur' });
  }
});

// PUT /api/suppliers/:id - Update supplier
suppliersRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, phone, email, address, city, postalCode, region, country,
      siret, website, notes, categories, contactName, delivery, minOrder, paymentTerms,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const supplier = await prisma.supplier.update({
      where: { id: parseInt(req.params.id as string) },
      data: {
        name: name.trim(),
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        postalCode: postalCode || null,
        region: region || null,
        country: country || 'France',
        siret: siret || null,
        website: website || null,
        notes: notes || null,
        categories: Array.isArray(categories) ? categories : [],
        contactName: contactName || null,
        delivery: delivery !== undefined ? delivery : true,
        minOrder: minOrder || null,
        paymentTerms: paymentTerms || null,
      },
    });

    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du fournisseur' });
  }
});

// DELETE /api/suppliers/:id - Delete supplier (only if no ingredients linked)
suppliersRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const ingredientCount = await prisma.ingredient.count({
      where: { supplierId: id },
    });

    if (ingredientCount > 0) {
      return res.status(400).json({
        error: `Impossible de supprimer : ${ingredientCount} ingrédient(s) lié(s) à ce fournisseur`,
      });
    }

    await prisma.supplier.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du fournisseur' });
  }
});

// POST /api/suppliers/:id/link-ingredients - Link existing ingredients by supplier name match
suppliersRouter.post('/:id/link-ingredients', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      return res.status(404).json({ error: 'Fournisseur non trouvé' });
    }

    // Find ingredients whose `supplier` text field matches this supplier's name (case-insensitive)
    const result = await prisma.ingredient.updateMany({
      where: {
        supplier: { equals: supplier.name, mode: 'insensitive' },
        supplierId: null,
      },
      data: { supplierId: id },
    });

    res.json({ linked: result.count, supplierName: supplier.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du lien des ingrédients' });
  }
});
