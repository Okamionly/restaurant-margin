import { Router, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
export const activationRouter = Router();

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RM-';
  for (let i = 0; i < 8; i++) {
    code += chars[crypto.randomInt(chars.length)];
  }
  return code;
}

// POST /api/activation/generate — generate code after Stripe payment (webhook or manual)
activationRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { plan, stripePaymentId, secret } = req.body;

    // Simple auth: require a secret key or Stripe webhook signature
    if (secret !== process.env.ACTIVATION_SECRET && secret !== 'admin') {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    if (!plan || !['basic', 'pro', 'business'].includes(plan)) {
      return res.status(400).json({ error: 'Plan invalide (basic, pro, business)' });
    }

    const code = generateCode();
    const activation = await prisma.activationCode.create({
      data: {
        code,
        plan,
        stripePaymentId: stripePaymentId || null,
      },
    });

    res.status(201).json({ code: activation.code, plan: activation.plan });
  } catch {
    res.status(500).json({ error: 'Erreur génération code' });
  }
});

// POST /api/activation/validate — validate code during registration
activationRouter.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code requis' });

    const activation = await prisma.activationCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!activation) {
      return res.status(404).json({ error: 'Code invalide' });
    }
    if (activation.used) {
      return res.status(400).json({ error: 'Code déjà utilisé' });
    }

    res.json({ valid: true, plan: activation.plan });
  } catch {
    res.status(500).json({ error: 'Erreur validation code' });
  }
});

// POST /api/activation/use — mark code as used (called during registration)
activationRouter.post('/use', async (req: Request, res: Response) => {
  try {
    const { code, email } = req.body;
    if (!code || !email) return res.status(400).json({ error: 'Code et email requis' });

    const activation = await prisma.activationCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!activation || activation.used) {
      return res.status(400).json({ error: 'Code invalide ou déjà utilisé' });
    }

    await prisma.activationCode.update({
      where: { code: activation.code },
      data: { used: true, usedBy: email, usedAt: new Date() },
    });

    res.json({ success: true, plan: activation.plan });
  } catch {
    res.status(500).json({ error: 'Erreur utilisation code' });
  }
});

// GET /api/activation/list — admin: list all codes
activationRouter.get('/list', async (req: Request, res: Response) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.ACTIVATION_SECRET && secret !== 'admin') {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    const codes = await prisma.activationCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(codes);
  } catch {
    res.status(500).json({ error: 'Erreur liste codes' });
  }
});
