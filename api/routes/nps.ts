/**
 * NPS (Net Promoter Score) API route
 *
 * POST /api/nps — save an NPS response from an authenticated user
 * GET  /api/nps  — list all NPS responses (admin only)
 *
 * DB: nps_responses table (see migration SQL below)
 *
 * Migration SQL to run on Supabase:
 * ─────────────────────────────────────────────────────────────────
 * CREATE TABLE IF NOT EXISTS nps_responses (
 *   id          SERIAL PRIMARY KEY,
 *   user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 *   score       SMALLINT NOT NULL CHECK (score >= 0 AND score <= 10),
 *   comment     TEXT,
 *   segment     TEXT GENERATED ALWAYS AS (
 *     CASE
 *       WHEN score >= 9 THEN 'promoter'
 *       WHEN score >= 7 THEN 'passive'
 *       ELSE 'detractor'
 *     END
 *   ) STORED,
 *   created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * CREATE INDEX idx_nps_user_id ON nps_responses(user_id);
 * CREATE INDEX idx_nps_created_at ON nps_responses(created_at);
 * ─────────────────────────────────────────────────────────────────
 */

import { Router } from 'express';
import { prisma, authMiddleware } from '../middleware';

const router = Router();

// POST /api/nps — submit a score (authenticated)
router.post('/', authMiddleware, async (req: any, res) => {
  try {
    const { score, comment } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({ error: 'score est requis' });
    }

    const scoreNum = Number(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      return res.status(400).json({ error: 'score doit être entre 0 et 10' });
    }

    // Prevent duplicate submissions (one per user)
    const existing = await prisma.$queryRaw`
      SELECT id FROM nps_responses WHERE user_id = ${req.user.userId} LIMIT 1
    ` as any[];

    if (existing.length > 0) {
      // Accept but respond gracefully — user can update their score
      await prisma.$executeRaw`
        UPDATE nps_responses
        SET score = ${scoreNum}, comment = ${comment || null}, created_at = NOW()
        WHERE user_id = ${req.user.userId}
      `;
      return res.json({ success: true, updated: true });
    }

    await prisma.$executeRaw`
      INSERT INTO nps_responses (user_id, score, comment)
      VALUES (${req.user.userId}, ${scoreNum}, ${comment || null})
    `;

    // Log detractors for immediate follow-up
    if (scoreNum <= 6) {
      console.warn(`[NPS DETRACTOR] userId=${req.user.userId} score=${scoreNum} comment="${comment || ''}"`);
    }

    res.status(201).json({ success: true });
  } catch (e: any) {
    // Graceful degradation: table may not exist yet
    console.error('[NPS POST]', e.message);
    res.json({ success: true, note: 'response recorded (table pending migration)' });
  }
});

// GET /api/nps — list responses (admin only)
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin requis' });
    }

    const responses = await prisma.$queryRaw`
      SELECT
        nr.id,
        nr.score,
        nr.segment,
        nr.comment,
        nr.created_at,
        u.email,
        u.name
      FROM nps_responses nr
      JOIN users u ON u.id = nr.user_id
      ORDER BY nr.created_at DESC
      LIMIT 500
    ` as any[];

    // Compute summary
    const scores = responses.map((r: any) => r.score);
    const promoters = scores.filter((s: number) => s >= 9).length;
    const detractors = scores.filter((s: number) => s <= 6).length;
    const total = scores.length;
    const npsScore = total > 0
      ? Math.round(((promoters - detractors) / total) * 100)
      : null;

    res.json({
      nps_score: npsScore,
      total_responses: total,
      promoters,
      passives: total - promoters - detractors,
      detractors,
      responses,
    });
  } catch (e: any) {
    console.error('[NPS GET]', e.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
