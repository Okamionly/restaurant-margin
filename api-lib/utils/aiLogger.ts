/**
 * AI Usage Logger — instrumentation coût Anthropic
 *
 * Logue chaque appel Claude avec tokens_in/out + cost USD/EUR dans ai_usage_logs.
 * Usage :
 *   import { logAiUsage, withAiLogging } from './utils/aiLogger';
 *
 *   // Manuel
 *   await logAiUsage({ userId, action: 'ai_chat', model, tokensIn, tokensOut });
 *
 *   // Wrapper automatique
 *   const response = await withAiLogging(
 *     { userId, action: 'recipe_suggestion' },
 *     () => anthropic.messages.create({ ... })
 *   );
 */

import { prisma } from '../middleware';

// Tarifs Anthropic (USD par million de tokens) — 2026-04
// Source: https://www.anthropic.com/pricing
const PRICING_USD_PER_MTOK: Record<string, { input: number; output: number }> = {
  'claude-opus-4': { input: 15.0, output: 75.0 },
  'claude-sonnet-4-5': { input: 3.0, output: 15.0 },
  'claude-sonnet-4': { input: 3.0, output: 15.0 },
  'claude-haiku-4-5': { input: 0.8, output: 4.0 },
  'claude-haiku-4': { input: 0.8, output: 4.0 },
  // Legacy fallbacks
  'claude-3-5-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-5-haiku': { input: 0.8, output: 4.0 },
};

// Taux USD → EUR (approx, à update trimestriellement ou via API live)
const USD_TO_EUR = 0.92;

type LogAiUsageParams = {
  userId?: number | null;
  action: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
};

function computeCost(model: string, tokensIn: number, tokensOut: number) {
  // Match le modèle sur prefix (claude-sonnet-4-5-20241022 → claude-sonnet-4-5)
  const key = Object.keys(PRICING_USD_PER_MTOK).find((k) =>
    model.toLowerCase().startsWith(k.toLowerCase())
  );
  const pricing = key ? PRICING_USD_PER_MTOK[key] : PRICING_USD_PER_MTOK['claude-sonnet-4-5'];
  const costUsd = (tokensIn / 1_000_000) * pricing.input + (tokensOut / 1_000_000) * pricing.output;
  const costEur = costUsd * USD_TO_EUR;
  return { costUsd, costEur };
}

export async function logAiUsage(params: LogAiUsageParams): Promise<void> {
  const { costUsd, costEur } = computeCost(params.model, params.tokensIn, params.tokensOut);

  try {
    await prisma.$executeRaw`
      INSERT INTO ai_usage_logs (user_id, action, model, tokens_in, tokens_out, cost_usd, cost_eur, duration_ms, metadata, created_at)
      VALUES (${params.userId ?? null}, ${params.action}, ${params.model}, ${params.tokensIn}, ${params.tokensOut}, ${costUsd}, ${costEur}, ${params.durationMs ?? null}, ${params.metadata ? JSON.stringify(params.metadata) : null}::jsonb, NOW())
    `;
  } catch (err) {
    // Ne jamais faire échouer un appel AI à cause d'un problème de logging
    console.warn('[aiLogger] Failed to log AI usage:', err);
  }
}

/**
 * Wrapper autour d'un appel Claude qui logge automatiquement l'usage.
 * Attends un `AnthropicResponse` avec `usage: { input_tokens, output_tokens }`.
 */
export async function withAiLogging<T extends { usage?: { input_tokens: number; output_tokens: number }; model?: string }>(
  context: { userId?: number | null; action: string; metadata?: Record<string, unknown> },
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  const response = await fn();
  const duration = Date.now() - start;

  if (response?.usage) {
    await logAiUsage({
      userId: context.userId,
      action: context.action,
      model: response.model ?? 'unknown',
      tokensIn: response.usage.input_tokens,
      tokensOut: response.usage.output_tokens,
      durationMs: duration,
      metadata: context.metadata,
    });
  }

  return response;
}

/**
 * Récupère le coût cumulé par user pour un mois donné (pour admin finance dashboard).
 */
export async function getMonthlyAiCost(userId: number | null, month: string): Promise<{ costUsd: number; costEur: number; calls: number }> {
  const [start, end] = [`${month}-01`, `${month}-31`];
  const userFilter = userId ? `AND user_id = ${userId}` : '';
  const result = (await prisma.$queryRawUnsafe(
    `SELECT COALESCE(SUM(cost_usd),0) AS cost_usd, COALESCE(SUM(cost_eur),0) AS cost_eur, COUNT(*) AS calls
     FROM ai_usage_logs
     WHERE created_at >= '${start}' AND created_at <= '${end}' ${userFilter}`
  )) as Array<{ cost_usd: number; cost_eur: number; calls: bigint }>;
  const row = result[0];
  return {
    costUsd: Number(row?.cost_usd ?? 0),
    costEur: Number(row?.cost_eur ?? 0),
    calls: Number(row?.calls ?? 0),
  };
}
