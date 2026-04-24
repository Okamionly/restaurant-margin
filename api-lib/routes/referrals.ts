/**
 * Routes parrainage RestauMargin
 *
 * Chaque utilisateur a un code unique qu'il peut partager.
 * Quand un filleul s'inscrit avec le code, une entrée Referral est créée.
 * Quand le filleul passe en Pro/Business, le parrain gagne une récompense.
 *
 * Récompense : 1 mois Pro gratuit pour le parrain + 20% de réduction pour le filleul.
 */

import { Router } from 'express';
import crypto from 'crypto';
import { prisma, authMiddleware } from '../middleware';

const router = Router();

// ── Utilitaire : génère un code unique déterministe pour un user ──
function generateCodeFromUserId(userId: number): string {
  // Hash déterministe basé sur userId + salt → code de 8 caractères alphanum
  const salt = 'restaumargin-referral-2026';
  const hash = crypto.createHash('sha256').update(`${userId}${salt}`).digest('hex');
  return hash.slice(0, 8).toUpperCase();
}

// ── GET /api/referrals/me ──
// Récupère (ou crée) le code de parrainage de l'utilisateur + stats
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId;

    // Cherche un code existant pour cet utilisateur
    let myCode = await prisma.referral.findFirst({
      where: { referrerId: userId, refereeId: null },
      select: { referralCode: true },
    });

    // Aucun code → on en crée un déterministe (unique par user)
    if (!myCode) {
      const code = generateCodeFromUserId(userId);
      // Vérifier qu'il n'est pas déjà pris (très peu probable)
      const collision = await prisma.referral.findUnique({ where: { referralCode: code } });
      if (!collision) {
        await prisma.referral.create({
          data: {
            referrerId: userId,
            refereeId: null,
            referralCode: code,
            status: 'active',
          },
        });
        myCode = { referralCode: code };
      } else {
        // Collision rare → fallback aléatoire
        const fallback = crypto.randomBytes(4).toString('hex').toUpperCase();
        await prisma.referral.create({
          data: {
            referrerId: userId,
            refereeId: null,
            referralCode: fallback,
            status: 'active',
          },
        });
        myCode = { referralCode: fallback };
      }
    }

    // Stats : nombre de filleuls, conversions, récompenses
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId, refereeId: { not: null } },
      select: {
        id: true,
        status: true,
        rewardApplied: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      totalReferred: referrals.length,
      converted: referrals.filter((r) => r.status === 'qualified' || r.status === 'rewarded').length,
      rewardsEarned: referrals.filter((r) => r.rewardApplied).length,
    };

    const shareUrl = `https://www.restaumargin.fr/?ref=${myCode.referralCode}`;

    res.json({
      referralCode: myCode.referralCode,
      shareUrl,
      stats,
      referrals: referrals.map((r) => ({
        id: r.id,
        status: r.status,
        rewardApplied: r.rewardApplied,
        createdAt: r.createdAt,
      })),
    });
  } catch (e: any) {
    console.error('[REFERRALS/me]', e.message);
    res.status(500).json({ error: 'Erreur récupération parrainage' });
  }
});

// ── GET /api/referrals/validate/:code ──
// Route publique : valide un code de parrainage (pour afficher "Code valide !" sur signup)
router.get('/validate/:code', async (req, res) => {
  try {
    const code = req.params.code?.trim().toUpperCase();
    if (!code || code.length < 4) return res.status(400).json({ valid: false, error: 'Code invalide' });

    const ref = await prisma.referral.findUnique({
      where: { referralCode: code },
      select: { referrerId: true, refereeId: true, status: true },
    });

    if (!ref || !ref.referrerId) return res.json({ valid: false, error: 'Code inexistant' });
    if (ref.refereeId) return res.json({ valid: false, error: 'Code déjà utilisé' });
    if (ref.status !== 'active') return res.json({ valid: false, error: 'Code inactif' });

    res.json({ valid: true, reward: '20% de réduction sur votre premier mois' });
  } catch (e: any) {
    console.error('[REFERRALS/validate]', e.message);
    res.status(500).json({ valid: false, error: 'Erreur serveur' });
  }
});

// ── POST /api/referrals/track ──
// Appelé lors du signup pour lier un nouveau user à un parrain
router.post('/track', authMiddleware, async (req: any, res) => {
  try {
    const { code } = req.body;
    const refereeId = req.user.userId;
    if (!code) return res.status(400).json({ error: 'Code manquant' });

    const normalizedCode = code.trim().toUpperCase();

    // Récupérer le code parrain
    const parentRef = await prisma.referral.findUnique({
      where: { referralCode: normalizedCode },
      select: { referrerId: true, refereeId: true, status: true },
    });

    if (!parentRef || !parentRef.referrerId) {
      return res.status(404).json({ error: 'Code de parrainage introuvable' });
    }
    if (parentRef.referrerId === refereeId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas utiliser votre propre code' });
    }

    // Vérifier que ce filleul n'a pas déjà été parrainé
    const existing = await prisma.referral.findFirst({
      where: { refereeId, referrerId: { not: null } },
    });
    if (existing) {
      return res.status(409).json({ error: 'Vous avez déjà un parrain' });
    }

    // Créer l'entrée Referral (pending = en attente de conversion payante)
    const newReferral = await prisma.referral.create({
      data: {
        referrerId: parentRef.referrerId,
        refereeId,
        referralCode: `${normalizedCode}-${refereeId}`,
        status: 'pending',
      },
    });

    res.status(201).json({ success: true, referralId: newReferral.id });
  } catch (e: any) {
    console.error('[REFERRALS/track]', e.message);
    res.status(500).json({ error: 'Erreur suivi parrainage' });
  }
});

// ── POST /api/referrals/qualify ──
// Webhook interne : marque un parrainage comme "qualified" quand le filleul paye
// Appelé depuis le webhook Stripe checkout.session.completed
router.post('/qualify', async (req, res) => {
  try {
    // Sécurité : vérifier un secret pour éviter les appels externes
    const secret = req.headers['x-internal-secret'];
    if (secret !== process.env.INTERNAL_WEBHOOK_SECRET) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId requis' });

    const referral = await prisma.referral.findFirst({
      where: { refereeId: userId, status: 'pending' },
    });

    if (!referral) return res.json({ qualified: false, reason: 'Aucun parrainage pending' });

    await prisma.referral.update({
      where: { id: referral.id },
      data: { status: 'qualified' },
    });

    // TODO : envoyer email au parrain "Votre filleul a souscrit, vous avez gagné 1 mois gratuit !"

    res.json({ qualified: true, referralId: referral.id, referrerId: referral.referrerId });
  } catch (e: any) {
    console.error('[REFERRALS/qualify]', e.message);
    res.status(500).json({ error: 'Erreur qualification parrainage' });
  }
});

export default router;
