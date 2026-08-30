// ══════════════════════════════════════════════════════════════════════════
// Routeur LLM multi-fournisseurs — gratuit d'abord, payant en dernier recours.
//
// Ordre d'essai : GROQ (gratuit) -> NVIDIA NIM (gratuit) -> Anthropic (payant).
// Groq et NVIDIA exposent tous les deux une API *compatible OpenAI*, donc un
// seul code les couvre : seuls l'URL de base, la cle et le nom du modele changent.
// Le premier fournisseur qui repond gagne ; si l'un tombe (quota, panne, cle
// absente), on passe automatiquement au suivant sans casser l'appelant.
//
// Cles attendues dans l'env (toutes optionnelles — un fournisseur sans cle est
// simplement saute) :
//   GROQ_API_KEY       -> https://console.groq.com  (gratuit)
//   NVIDIA_API_KEY     -> https://build.nvidia.com  (gratuit)
//   ANTHROPIC_API_KEY  -> secours (deja configure sur ce projet)
// ══════════════════════════════════════════════════════════════════════════

export type LlmResult = { text: string; provider: string; model: string };

type OpenAiCompatProvider = {
  name: string;
  envKey: string;
  baseUrl: string;
  model: string;
};

// Les deux fournisseurs gratuits, dans l'ordre de preference.
const OPENAI_COMPATIBLE: OpenAiCompatProvider[] = [
  {
    name: 'groq',
    envKey: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    // Verifie en live le 2026-08-30 sur le compte : llama-3.3-70b-versatile a ete
    // retire du catalogue Groq (404 model_not_found). gpt-oss-120b repond en ~0,8 s.
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  },
  {
    name: 'nvidia',
    envKey: 'NVIDIA_API_KEY',
    baseUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct',
  },
];

const DEFAULT_TIMEOUT_MS = 20000;

async function callOpenAiCompatible(
  p: OpenAiCompatProvider,
  system: string,
  user: string,
  maxTokens: number,
  timeoutMs: number,
): Promise<LlmResult | null> {
  const key = process.env[p.envKey];
  if (!key) return null; // pas de cle -> fournisseur saute silencieusement
  try {
    const r = await fetch(p.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: p.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_tokens: maxTokens,
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) {
      console.warn(`[LLM] ${p.name} HTTP ${r.status}`);
      return null;
    }
    const data: any = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return null;
    return { text, provider: p.name, model: p.model };
  } catch (e: any) {
    console.warn(`[LLM] ${p.name} erreur:`, e?.message || e);
    return null;
  }
}

async function callAnthropic(
  system: string,
  user: string,
  maxTokens: number,
  timeoutMs: number,
): Promise<LlmResult | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.ANTHROPIC_FALLBACK_MODEL || 'claude-haiku-4-5-20251001';
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) {
      console.warn(`[LLM] anthropic HTTP ${r.status}`);
      return null;
    }
    const data: any = await r.json();
    const text = (data?.content || [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('');
    if (!text) return null;
    return { text, provider: 'anthropic', model };
  } catch (e: any) {
    console.warn('[LLM] anthropic erreur:', e?.message || e);
    return null;
  }
}

/**
 * Appelle le premier LLM disponible (gratuit d'abord) et renvoie sa reponse texte.
 * Leve une erreur seulement si AUCUN fournisseur n'a repondu.
 */
export async function llmComplete(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<LlmResult> {
  const maxTokens = opts.maxTokens ?? 1024;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  for (const p of OPENAI_COMPATIBLE) {
    const out = await callOpenAiCompatible(p, opts.system, opts.user, maxTokens, timeoutMs);
    if (out) return out;
  }
  const fallback = await callAnthropic(opts.system, opts.user, maxTokens, timeoutMs);
  if (fallback) return fallback;

  throw new Error('Aucun fournisseur LLM disponible (verifier GROQ_API_KEY / NVIDIA_API_KEY / ANTHROPIC_API_KEY)');
}

/**
 * Idem mais attend du JSON en retour. Tolere les blocs ```json et le texte autour.
 * Renvoie null si le modele n'a pas produit de JSON exploitable.
 */
export async function llmJson<T = any>(opts: {
  system: string;
  user: string;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<{ data: T | null; provider: string; model: string }> {
  const out = await llmComplete(opts);
  let clean = out.text.trim().replace(/^```json?\s*/i, '').replace(/\s*```$/, '');
  // Certains modeles ouverts bavardent autour du JSON : on isole le 1er objet complet.
  if (!clean.startsWith('{') && !clean.startsWith('[')) {
    const first = clean.search(/[[{]/);
    const lastObj = clean.lastIndexOf('}');
    const lastArr = clean.lastIndexOf(']');
    const last = Math.max(lastObj, lastArr);
    if (first !== -1 && last > first) clean = clean.slice(first, last + 1);
  }
  try {
    return { data: JSON.parse(clean) as T, provider: out.provider, model: out.model };
  } catch {
    console.warn('[LLM] JSON non parsable de', out.provider, '-', out.text.slice(0, 160));
    return { data: null, provider: out.provider, model: out.model };
  }
}

/** Quels fournisseurs sont configures (pour la page de sante). */
export function llmProvidersStatus() {
  return {
    groq: !!process.env.GROQ_API_KEY,
    nvidia: !!process.env.NVIDIA_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    ordre: ['groq', 'nvidia', 'anthropic'],
  };
}
