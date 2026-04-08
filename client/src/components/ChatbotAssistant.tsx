import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, X, ChefHat, Bot, Loader2 } from 'lucide-react';
import { fetchRecipes, fetchInventoryAlerts } from '../services/api';
import type { Recipe, InventoryItem } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

const STORAGE_KEY = 'chatbot-history';
const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Bonjour Chef ! Je suis votre assistant IA. Posez-moi une question sur vos recettes, ingredients ou marges.",
  timestamp: Date.now(),
};

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [WELCOME_MESSAGE];
}

function saveHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
  } catch {
    // ignore
  }
}

// --- Intent matching ---

type Intent =
  | { type: 'greeting' }
  | { type: 'best_margin' }
  | { type: 'low_stock' }
  | { type: 'recipe_count' }
  | { type: 'suggest_ingredient'; ingredient: string }
  | { type: 'average_cost' }
  | { type: 'unknown' };

function detectIntent(input: string): Intent {
  const lower = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // Greetings
  if (/^(salut|bonjour|hello|hi|hey|coucou|bonsoir|yo|slt|bjr|ca va|comment vas)/.test(lower)) {
    return { type: 'greeting' };
  }
  // Best margin
  if (/marge|rentab|plus\s*rentable|meilleur|benefice|profit/.test(lower)) {
    return { type: 'best_margin' };
  }
  // Low stock
  if (/stock|rupture|alerte|manque|commander|approvision/.test(lower)) {
    return { type: 'low_stock' };
  }
  // Recipe count
  if (/combien|nombre|total.*recette|recette.*total|carte\s*actuel/.test(lower)) {
    return { type: 'recipe_count' };
  }
  // Average cost
  if (/cout|matiere|moyen|depense|charge/.test(lower)) {
    return { type: 'average_cost' };
  }

  // Suggest with ingredient — match "plat avec X", "suggere X", "recette X", "que faire avec X"
  const suggestPatterns = [
    /(?:sugg|propos|conseil|plat|recette|faire|cuisiner).*(?:avec|contenant|utilisant|de|du|des|au|aux|a la)\s+(.+)/,
    /(?:avec|contenant)\s+(.+)/,
    /que\s+(?:faire|cuisiner|preparer)\s+(.+)/,
  ];
  for (const pat of suggestPatterns) {
    const m = lower.match(pat);
    if (m) return { type: 'suggest_ingredient', ingredient: m[1].trim() };
  }

  // If just a single word that could be an ingredient (but not a common word)
  const commonWords = ['merci', 'oui', 'non', 'ok', 'bien', 'super', 'genial', 'parfait', 'aide', 'help', 'quoi', 'comment', 'pourquoi'];
  if (lower.split(/\s+/).length <= 2 && lower.length > 2 && !commonWords.includes(lower)) {
    return { type: 'suggest_ingredient', ingredient: lower };
  }

  return { type: 'unknown' };
}

// --- Response generators ---

async function handleBestMargin(): Promise<string> {
  const recipes = await fetchRecipes();
  if (!recipes.length) return "Vous n'avez aucune recette pour le moment.";

  const sorted = [...recipes]
    .filter((r) => r.margin)
    .sort((a, b) => (b.margin?.marginPercent ?? 0) - (a.margin?.marginPercent ?? 0));

  if (!sorted.length) return "Aucune recette avec des donnees de marge.";

  const top3 = sorted.slice(0, 3);
  const lines = top3.map(
    (r, i) =>
      `${i + 1}. ${r.name} - marge ${r.margin.marginPercent.toFixed(1)}% (cout ${r.margin.foodCost.toFixed(2)} EUR, prix ${r.sellingPrice.toFixed(2)} EUR)`
  );
  return `Voici vos 3 plats les plus rentables :\n${lines.join('\n')}`;
}

async function handleLowStock(): Promise<string> {
  const alerts = await fetchInventoryAlerts();
  if (!alerts.length) return "Aucune alerte de stock ! Tout est en ordre.";

  const lines = alerts.slice(0, 5).map(
    (item: InventoryItem) =>
      `- ${item.ingredient.name}: ${item.currentStock} ${item.unit} (min: ${item.minStock})`
  );
  return `Ingredients en stock bas :\n${lines.join('\n')}${alerts.length > 5 ? `\n... et ${alerts.length - 5} autre(s)` : ''}`;
}

async function handleRecipeCount(): Promise<string> {
  const recipes = await fetchRecipes();
  return `Vous avez ${recipes.length} recette${recipes.length !== 1 ? 's' : ''} enregistree${recipes.length !== 1 ? 's' : ''}.`;
}

async function handleSuggestIngredient(ingredient: string): Promise<string> {
  const recipes = await fetchRecipes();
  const matches = recipes.filter((r: Recipe) =>
    r.ingredients.some((ri) =>
      ri.ingredient.name.toLowerCase().includes(ingredient.toLowerCase())
    )
  );
  if (!matches.length) return `Aucune recette trouvee avec "${ingredient}".`;

  const lines = matches.slice(0, 5).map(
    (r: Recipe) => `- ${r.name} (${r.category}, ${r.sellingPrice.toFixed(2)} EUR)`
  );
  return `Recettes avec "${ingredient}" :\n${lines.join('\n')}${matches.length > 5 ? `\n... et ${matches.length - 5} autre(s)` : ''}`;
}

async function handleAverageCost(): Promise<string> {
  const recipes = await fetchRecipes();
  const withMargin = recipes.filter((r) => r.margin);
  if (!withMargin.length) return "Aucune recette avec des donnees de marge.";

  const avg =
    withMargin.reduce((sum, r) => sum + r.margin.marginPercent, 0) / withMargin.length;
  const avgCost =
    withMargin.reduce((sum, r) => sum + r.margin.foodCost, 0) / withMargin.length;

  return `Sur ${withMargin.length} recette${withMargin.length !== 1 ? 's' : ''} :\n- Cout matiere moyen : ${avgCost.toFixed(2)} EUR\n- Marge moyenne : ${avg.toFixed(1)}%`;
}

const UNKNOWN_RESPONSE =
  "Voici ce que je peux faire :\n\n- \"marge\" → Vos plats les plus rentables\n- \"stock\" → Alertes de stock bas\n- \"combien de recettes\" → Nombre total\n- \"saumon\" ou \"tomate\" → Recettes avec cet ingrédient\n- \"coût\" → Coût matière moyen\n\nTapez un mot-clé ou un ingrédient !";

// --- OpenRouter AI integration ---

async function getRestaurantContext(): Promise<string> {
  try {
    const recipes = await fetchRecipes();
    const topRecipes = recipes
      .filter((r: Recipe) => r.margin)
      .sort((a: Recipe, b: Recipe) => (b.margin?.marginPercent ?? 0) - (a.margin?.marginPercent ?? 0))
      .slice(0, 15)
      .map((r: Recipe) => `- ${r.name} (${r.category}): prix ${r.sellingPrice}€, coût ${r.margin?.foodCost?.toFixed(2)}€, marge ${r.margin?.marginPercent?.toFixed(1)}%`)
      .join('\n');
    const avgMargin = recipes.filter((r: Recipe) => r.margin).reduce((s: number, r: Recipe) => s + (r.margin?.marginPercent ?? 0), 0) / (recipes.filter((r: Recipe) => r.margin).length || 1);
    return `Restaurant: ${recipes.length} recettes, marge moyenne ${avgMargin.toFixed(1)}%.\nTop recettes:\n${topRecipes}`;
  } catch {
    return 'Données non disponibles.';
  }
}

async function callBackendAI(input: string): Promise<string | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: input }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.response || null;
  } catch (err) {
    console.error('Backend AI chat error:', err);
    return null;
  }
}

async function generateResponse(input: string, history: { role: string; content: string }[] = []): Promise<string> {
  // Try backend AI first (routes through /api/ai/chat)
  const aiResponse = await callBackendAI(input);
  if (aiResponse) return aiResponse;

  // Fallback to local keyword matching
  const intent = detectIntent(input);
  switch (intent.type) {
    case 'greeting':
      return "Bonjour Chef ! Comment puis-je vous aider ?\n\nVoici quelques idées :\n- \"marge\" → Vos plats les plus rentables\n- \"stock\" → Alertes de stock\n- \"coût\" → Coût matière moyen\n- \"saumon\" → Recettes avec un ingrédient\n- \"combien de recettes\" → Nombre total";
    case 'best_margin':
      return handleBestMargin();
    case 'low_stock':
      return handleLowStock();
    case 'recipe_count':
      return handleRecipeCount();
    case 'suggest_ingredient':
      return handleSuggestIngredient(intent.ingredient);
    case 'average_cost':
      return handleAverageCost();
    default:
      return UNKNOWN_RESPONSE;
  }
}

// --- Component ---

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist messages
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID?.() || String(Date.now()),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      const response = await generateResponse(text, history);
      const botMsg: ChatMessage = {
        id: crypto.randomUUID?.() || String(Date.now() + 1),
        role: 'assistant',
        text: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID?.() || String(Date.now() + 1),
        role: 'assistant',
        text: "Desolee, une erreur s'est produite. Reessayez dans un instant.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
            <ChefHat className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">Assistant Chef IA</h3>
              <p className="text-[11px] text-blue-100 opacity-80">Toujours pret a vous aider</p>
            </div>
            <button
              onClick={clearHistory}
              title="Effacer l'historique"
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-xs"
            >
              Effacer
            </button>
            <button
              onClick={() => setOpen(false)}
              title="Fermer"
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[50vh]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mt-0.5">
                  <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-xs text-slate-400 ml-1">Recherche...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 px-3 py-2.5 bg-white dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez une question..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 no-print ${
          open
            ? 'bg-slate-600 hover:bg-slate-700 rotate-0'
            : 'bg-blue-600 hover:bg-blue-700 animate-bounce-subtle'
        }`}
        title={open ? 'Fermer le chat' : 'Assistant Chef IA'}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Bounce animation style */}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-bounce-subtle:hover {
          animation: none;
        }
      `}</style>
    </>
  );
}
