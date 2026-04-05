import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Bot, Send, User, Sparkles, MessageSquare, Lightbulb, CheckCircle2, XCircle, ExternalLink, ChefHat, Package, ShoppingCart, TrendingUp, Star, Mic, MicOff, BarChart3, Camera, Copy, Check, Share2, ThumbsUp, ThumbsDown, History, Plus, Trash2, AlertTriangle, Shield, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { trackEvent } from '../utils/analytics';

// ---- Types ----

interface AIUsage {
  used: number;
  limit: number;
  percentage: number;
  tokens: number;
  estimatedCost: number;
  month: string;
}

interface ActionResult {
  type: string;
  success: boolean;
  id?: number;
  message: string;
  error?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ActionResult[];
  image?: string;
  feedback?: 'up' | 'down' | null;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  mode: AIMode;
}

interface ContextSuggestion {
  label: string;
  prompt: string;
  icon: typeof ChefHat;
  priority: number;
}

type AIMode = 'gestionnaire' | 'chef' | 'haccp';

interface RestaurantContext {
  lowStockCount: number;
  lowMarginRecipes: number;
  recentRecipeCount: number;
  priceChanges: number;
  totalRecipes: number;
  totalIngredients: number;
  avgMargin: number;
}

// ---- Constants ----

const AI_MODES: { key: AIMode; label: string; icon: typeof ChefHat; description: string }[] = [
  { key: 'gestionnaire', label: 'Gestionnaire', icon: TrendingUp, description: 'Couts, marges, efficacite' },
  { key: 'chef', label: 'Chef', icon: ChefHat, description: 'Recettes, techniques, creativite' },
  { key: 'haccp', label: 'HACCP', icon: Shield, description: 'Securite alimentaire, conformite' },
];

const MODE_PREFIXES: Record<AIMode, string> = {
  gestionnaire: '[Mode Gestionnaire] Focus sur les couts, marges et optimisation financiere.',
  chef: '[Mode Chef] Focus sur les recettes, techniques culinaires et creativite.',
  haccp: '[Mode HACCP] Focus sur la securite alimentaire, temperatures, tracabilite et conformite HACCP.',
};

const CONVERSATION_STORAGE_KEY = 'rm_ai_conversations';
const FEEDBACK_STORAGE_KEY = 'rm_ai_feedback';
const MAX_CONVERSATIONS = 10;

// ---- Helpers ----

function getActionRoute(action: ActionResult): string | null {
  if (!action.id) return null;
  switch (action.type) {
    case 'create_recipe': return `/recipes/${action.id}`;
    case 'add_ingredient': return '/ingredients';
    case 'create_order': return '/commandes';
    default: return null;
  }
}

function getActionLabel(type: string): string {
  switch (type) {
    case 'create_recipe': return 'Fiche technique creee';
    case 'add_ingredient': return 'Ingredient ajoute';
    case 'create_order': return 'Commande creee';
    case 'send_order_email': return 'Email envoye au fournisseur';
    case 'suggest_menu': return 'Menu suggere';
    default: return 'Action executee';
  }
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((c: any) => ({
      ...c,
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch { return []; }
}

function saveConversations(convs: Conversation[]) {
  const trimmed = convs.slice(0, MAX_CONVERSATIONS);
  localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(trimmed));
}

function saveFeedback(messageId: string, feedback: 'up' | 'down') {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[messageId] = { feedback, timestamp: new Date().toISOString() };
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function generateConversationTitle(messages: Message[]): string {
  const firstUser = messages.find(m => m.role === 'user');
  if (!firstUser) return 'Nouvelle conversation';
  const text = firstUser.content.slice(0, 50);
  return text.length < firstUser.content.length ? text + '...' : text;
}

async function getAIResponse(message: string, history: Message[], image?: string, mode?: AIMode): Promise<{ response: string; actions?: ActionResult[] }> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  const recentHistory = history.slice(-6).map(m => ({
    role: m.role,
    content: m.content,
  }));

  const prefixedMessage = mode ? `${MODE_PREFIXES[mode]} ${message}` : message;

  const body: any = { message: prefixedMessage, history: recentHistory };
  if (image) body.image = image;
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }
  return { response: data.response, actions: data.actions };
}

async function fetchRestaurantContext(): Promise<RestaurantContext> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token || ''}`,
    ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
  };

  const defaults: RestaurantContext = {
    lowStockCount: 0,
    lowMarginRecipes: 0,
    recentRecipeCount: 0,
    priceChanges: 0,
    totalRecipes: 0,
    totalIngredients: 0,
    avgMargin: 75,
  };

  try {
    const [ingredientsRes, recipesRes] = await Promise.allSettled([
      fetch('/api/ingredients', { headers }),
      fetch('/api/recipes', { headers }),
    ]);

    let ingredients: any[] = [];
    let recipes: any[] = [];

    if (ingredientsRes.status === 'fulfilled' && ingredientsRes.value.ok) {
      ingredients = await ingredientsRes.value.json();
    }
    if (recipesRes.status === 'fulfilled' && recipesRes.value.ok) {
      recipes = await recipesRes.value.json();
    }

    const lowStock = ingredients.filter((i: any) =>
      i.currentStock !== undefined && i.minStock !== undefined && i.currentStock <= i.minStock
    ).length;

    const margins = recipes
      .map((r: any) => r.marginPercent || r.margin_percent || 0)
      .filter((m: number) => m > 0);
    const avgMargin = margins.length > 0 ? margins.reduce((a: number, b: number) => a + b, 0) / margins.length : 75;
    const lowMarginRecipes = margins.filter((m: number) => m < 60).length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentRecipes = recipes.filter((r: any) => {
      const created = new Date(r.createdAt || r.created_at || 0);
      return created > oneWeekAgo;
    }).length;

    return {
      lowStockCount: lowStock,
      lowMarginRecipes,
      recentRecipeCount: recentRecipes,
      priceChanges: 0,
      totalRecipes: recipes.length,
      totalIngredients: ingredients.length,
      avgMargin: Math.round(avgMargin),
    };
  } catch {
    return defaults;
  }
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

// ---- Component ----

export default function AIAssistant() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Core state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Bonjour ! Je suis votre **assistant IA RestauMargin**. Je peux analyser vos donnees **ET agir** : creer des fiches techniques, ajouter des ingredients, preparer des commandes fournisseurs. Que voulez-vous faire ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiUsage, setAiUsage] = useState<AIUsage | null>(null);
  const [quotaReached, setQuotaReached] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  // New feature state
  const [aiMode, setAiMode] = useState<AIMode>('gestionnaire');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [restaurantContext, setRestaurantContext] = useState<RestaurantContext | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch AI usage on mount
  const fetchUsage = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('activeRestaurantId');
      const res = await fetch('/api/ai/usage', {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
        },
      });
      if (res.ok) {
        const data: AIUsage = await res.json();
        setAiUsage(data);
        setQuotaReached(data.used >= data.limit);
      }
    } catch (_) {}
  }, []);

  useEffect(() => { fetchUsage(); }, [fetchUsage]);

  // Fetch restaurant context for smart suggestions
  useEffect(() => {
    fetchRestaurantContext().then(setRestaurantContext);
  }, []);

  // Context-aware suggestions
  const contextSuggestions = useMemo((): ContextSuggestion[] => {
    const suggestions: ContextSuggestion[] = [];
    const ctx = restaurantContext;

    if (ctx) {
      if (ctx.lowStockCount > 0) {
        suggestions.push({
          label: `${ctx.lowStockCount} ingredients en rupture`,
          prompt: 'Commander les ingredients manquants et en rupture de stock',
          icon: AlertTriangle,
          priority: 10,
        });
      }

      if (ctx.lowMarginRecipes > 0) {
        suggestions.push({
          label: `${ctx.lowMarginRecipes} recettes a faible marge`,
          prompt: 'Optimiser les recettes a faible marge (moins de 60%) avec des alternatives moins cheres',
          icon: TrendingUp,
          priority: 9,
        });
      }

      if (ctx.recentRecipeCount === 0) {
        suggestions.push({
          label: 'Generer le menu de la semaine',
          prompt: 'Generer le menu de la semaine avec des recettes equilibrees et rentables',
          icon: ChefHat,
          priority: 8,
        });
      }

      if (ctx.priceChanges > 0) {
        suggestions.push({
          label: 'Analyser les hausses de prix',
          prompt: 'Analyser l\'impact des hausses de prix recentes sur mes marges',
          icon: BarChart3,
          priority: 7,
        });
      }
    }

    // Always-available suggestions
    suggestions.push({
      label: 'Creer une fiche technique',
      prompt: 'Cree-moi une fiche technique pour une nouvelle recette',
      icon: ChefHat,
      priority: 5,
    });
    suggestions.push({
      label: 'Analyser mes marges',
      prompt: 'Analyse mes marges globales et identifie les points d\'amelioration',
      icon: TrendingUp,
      priority: 4,
    });
    suggestions.push({
      label: 'Preparer une commande',
      prompt: 'Prepare une commande fournisseur basee sur mes besoins actuels',
      icon: ShoppingCart,
      priority: 3,
    });
    suggestions.push({
      label: 'Mon plat star',
      prompt: 'Quel est mon plat star et pourquoi ?',
      icon: Star,
      priority: 2,
    });
    suggestions.push({
      label: 'Ajouter un ingredient',
      prompt: 'Ajoute un nouvel ingredient a mon inventaire',
      icon: Package,
      priority: 1,
    });

    // Sort by priority descending, take top 4
    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 4);
  }, [restaurantContext]);

  // Rotate suggestions every 30s
  useEffect(() => {
    if (contextSuggestions.length <= 4) return;
    const interval = setInterval(() => {
      setSuggestionIndex(prev => (prev + 1) % contextSuggestions.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [contextSuggestions.length]);

  // Close mode dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setModeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Save conversation whenever messages change
  useEffect(() => {
    if (messages.length <= 1) return;
    const convId = currentConversationId || Date.now().toString();
    if (!currentConversationId) setCurrentConversationId(convId);

    const conv: Conversation = {
      id: convId,
      title: generateConversationTitle(messages),
      messages,
      createdAt: new Date().toISOString(),
      mode: aiMode,
    };

    setConversations(prev => {
      const others = prev.filter(c => c.id !== convId);
      const updated = [conv, ...others].slice(0, MAX_CONVERSATIONS);
      saveConversations(updated);
      return updated;
    });
  }, [messages, currentConversationId, aiMode]);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported] = useState(() => !!SpeechRecognitionAPI);
  const [autoSendCountdown, setAutoSendCountdown] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const cancelAutoSend = useCallback(() => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setAutoSendCountdown(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      cancelAutoSend();
    };
  }, [cancelAutoSend]);

  const startAutoSendCountdown = useCallback((transcript: string) => {
    if (transcript.trim().length <= 5) return;
    cancelAutoSend();

    let remaining = 2;
    setAutoSendCountdown(remaining);

    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setAutoSendCountdown(remaining > 0 ? remaining : null);
    }, 1000);

    autoSendTimerRef.current = setTimeout(() => {
      autoSendTimerRef.current = null;
      setAutoSendCountdown(null);
      handleSendRef.current?.(transcript);
    }, 2000);
  }, [cancelAutoSend]);

  const handleSendRef = useRef<((text?: string) => void) | null>(null);

  function toggleVoice() {
    if (!SpeechRecognitionAPI) return;

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsListening(false);
      return;
    }

    cancelAutoSend();

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      if (event.results[0].isFinal) {
        startAutoSendCountdown(transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    trackEvent('voice_command');
  }

  function handlePhotoCapture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPendingImage(dataUrl);
        setInput('Identifie cet ingredient et propose de l\'ajouter a mon inventaire');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  async function handleSend(text?: string) {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const currentImage = pendingImage;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      image: currentImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setPendingImage(null);
    setIsTyping(true);
    trackEvent(currentImage ? 'ai_photo_sent' : 'ai_chat_sent');

    try {
      const imageBase64 = currentImage ? currentImage.split(',')[1] : undefined;
      const { response, actions } = await getAIResponse(messageText, messages, imageBase64, aiMode);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        actions: actions && actions.length > 0 ? actions : undefined,
        feedback: null,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      fetchUsage();
    } catch (err: any) {
      const errMsg = err?.message || "Desole, une erreur s'est produite. Veuillez reessayer.";
      if (errMsg.includes('Quota')) setQuotaReached(true);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  handleSendRef.current = handleSend;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewConversation() {
    setCurrentConversationId(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "Bonjour ! Je suis votre **assistant IA RestauMargin**. Je peux analyser vos donnees **ET agir** : creer des fiches techniques, ajouter des ingredients, preparer des commandes fournisseurs. Que voulez-vous faire ?",
        timestamp: new Date(),
      },
    ]);
    setShowHistory(false);
    trackEvent('ai_new_conversation');
  }

  function handleLoadConversation(conv: Conversation) {
    setCurrentConversationId(conv.id);
    setMessages(conv.messages);
    setAiMode(conv.mode);
    setShowHistory(false);
    trackEvent('ai_load_conversation');
  }

  function handleDeleteConversation(convId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== convId);
      saveConversations(updated);
      return updated;
    });
    if (currentConversationId === convId) {
      handleNewConversation();
    }
  }

  function handleCopyMessage(content: string, messageId: string) {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      trackEvent('ai_copy_message');
    });
  }

  function handleShareMessage(content: string) {
    const formatted = `--- RestauMargin IA ---\n\n${content}\n\n--- restaumargin.com ---`;
    navigator.clipboard.writeText(formatted).then(() => {
      trackEvent('ai_share_message');
    });
  }

  function handleFeedback(messageId: string, feedback: 'up' | 'down') {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, feedback: m.feedback === feedback ? null : feedback } : m
    ));
    saveFeedback(messageId, feedback);
    trackEvent('ai_feedback', { feedback });
  }

  function formatContent(content: string) {
    return content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="font-semibold text-[#111111] dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });

      if (line.trim() === '') return <br key={i} />;
      return (
        <div key={i} className={line.startsWith('   ') ? 'ml-4' : ''}>
          {parts}
        </div>
      );
    });
  }

  function renderActions(actions: ActionResult[]) {
    return (
      <div className="mt-3 space-y-2">
        {actions.map((action, i) => {
          const route = getActionRoute(action);
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                action.success
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              {action.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${action.success ? 'text-emerald-300' : 'text-red-300'}`}>
                  {getActionLabel(action.type)}
                </p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] truncate">{action.message}</p>
              </div>
              {action.success && route && (
                <button
                  onClick={() => navigate(route)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A] text-[#111111] dark:text-white rounded-lg transition-colors flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  Voir
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const currentModeInfo = AI_MODES.find(m => m.key === aiMode)!;
  const CurrentModeIcon = currentModeInfo.icon;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[900px]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-[#111111] dark:bg-white shadow-lg">
            <Sparkles className="w-6 h-6 text-white dark:text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white">Assistant IA</h1>
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Analyse vos donnees et agit sur votre restaurant</p>
          </div>

          {/* Mode selector */}
          <div className="relative" ref={modeDropdownRef}>
            <button
              onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white/30 transition-colors"
            >
              <CurrentModeIcon className="w-4 h-4 text-[#111111] dark:text-white" />
              <span className="text-sm font-medium text-[#111111] dark:text-white hidden sm:inline">{currentModeInfo.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] dark:text-[#A3A3A3] transition-transform ${modeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {modeDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-xl z-50 overflow-hidden">
                {AI_MODES.map(mode => {
                  const Icon = mode.icon;
                  const isActive = aiMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => { setAiMode(mode.key); setModeDropdownOpen(false); trackEvent('ai_mode_change', { mode: mode.key }); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isActive
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                          : 'hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#111111] dark:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{mode.label}</p>
                        <p className={`text-xs ${isActive ? 'text-white/60 dark:text-black/60' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>{mode.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* History button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showHistory
                ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-black'
                : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white/30 text-[#6B7280] dark:text-[#A3A3A3]'
            }`}
            title="Historique"
          >
            <History className="w-5 h-5" />
          </button>

          {/* New conversation button */}
          <button
            onClick={handleNewConversation}
            className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white/30 text-[#6B7280] dark:text-[#A3A3A3] transition-colors"
            title="Nouvelle conversation"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Quota Bar */}
      {aiUsage && (
        <div className="mb-4 bg-white/50 dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#111111] dark:text-white" />
              <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">
                Quota IA : {aiUsage.used}/{aiUsage.limit} requetes ce mois ({aiUsage.percentage}%)
              </span>
            </div>
            <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{aiUsage.month}</span>
          </div>
          <div className="w-full h-2.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                aiUsage.percentage > 80
                  ? 'bg-red-500'
                  : aiUsage.percentage > 50
                  ? 'bg-amber-500'
                  : 'bg-[#111111] dark:bg-white'
              }`}
              style={{ width: `${Math.min(aiUsage.percentage, 100)}%` }}
            />
          </div>
          {quotaReached && (
            <p className="text-xs text-red-400 mt-2 font-medium">
              Quota mensuel atteint. Passez au plan Business pour continuer.
            </p>
          )}
        </div>
      )}

      {/* History panel */}
      {showHistory && (
        <div className="mb-4 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] sticky top-0 bg-white dark:bg-[#0A0A0A] z-10">
            <p className="text-sm font-semibold text-[#111111] dark:text-white">Historique des conversations</p>
          </div>
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <MessageSquare className="w-8 h-8 text-[#E5E7EB] dark:text-[#1A1A1A] mx-auto mb-2" />
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucune conversation sauvegardee</p>
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => handleLoadConversation(conv)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors border-b border-[#E5E7EB]/50 dark:border-[#1A1A1A]/50 last:border-b-0 ${
                  conv.id === currentConversationId ? 'bg-[#F3F4F6] dark:bg-[#171717]' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111111] dark:text-white truncate">{conv.title}</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                    {new Date(conv.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {' '} — {conv.messages.length} msg — {conv.mode}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#9CA3AF] dark:text-[#737373] hover:text-red-400 transition-colors flex-shrink-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            ))
          )}
        </div>
      )}

      {/* Chat container */}
      <div className="flex-1 flex flex-col bg-white/50 dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-[#111111] dark:bg-white'
                    : 'bg-[#111111] dark:bg-white'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white dark:text-black" />
                ) : (
                  <Bot className="w-4 h-4 text-white dark:text-black" />
                )}
              </div>
              <div className="max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black rounded-br-md'
                      : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] rounded-bl-md border border-[#E5E7EB] dark:border-[#1A1A1A]/50'
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Photo envoyee"
                      className="w-40 h-40 object-cover rounded-xl mb-2 border border-white/20"
                    />
                  )}
                  {formatContent(msg.content)}
                  {msg.actions && msg.actions.length > 0 && renderActions(msg.actions)}
                  <div
                    className={`text-[10px] mt-2 ${
                      msg.role === 'user' ? 'text-white/40 dark:text-black/40' : 'text-[#9CA3AF] dark:text-[#737373]'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {/* Copy / Share / Feedback — assistant messages only */}
                {msg.role === 'assistant' && msg.id !== 'welcome' && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    <button
                      onClick={() => handleCopyMessage(msg.content, msg.id)}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
                      title="Copier"
                    >
                      {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleShareMessage(msg.content)}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
                      title="Partager"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-[#E5E7EB] dark:bg-[#1A1A1A] mx-0.5" />
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        msg.feedback === 'up'
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                          : 'hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                      }`}
                      title="Bonne reponse"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        msg.feedback === 'down'
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                          : 'hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                      }`}
                      title="Mauvaise reponse"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#111111] dark:bg-white">
                <Bot className="w-4 h-4 text-white dark:text-black" />
              </div>
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-2 h-2 bg-[#111111] dark:bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-[#111111] dark:bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-[#111111] dark:bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Analyse en cours...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Context-aware suggestions bar — always visible when not typing */}
        {!isTyping && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">Suggestions</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {contextSuggestions.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#111111] dark:hover:bg-white text-[#6B7280] dark:text-[#A3A3A3] hover:text-white dark:hover:text-black border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <Icon className="w-3 h-3" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] p-3">
          {/* Pending image preview */}
          {pendingImage && (
            <div className="flex items-center gap-3 mb-2 py-2 px-3 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl">
              <img src={pendingImage} alt="Apercu" className="w-12 h-12 object-cover rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A]" />
              <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3] flex-1">Photo prete a envoyer</span>
              <button
                onClick={() => setPendingImage(null)}
                className="text-xs text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white underline transition-colors"
              >
                Supprimer
              </button>
            </div>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div className="flex items-center justify-center gap-3 mb-2 py-2 px-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-sm text-red-400 font-medium">Ecoute en cours...</span>
              <div className="flex items-center gap-1">
                <span
                  className="w-1 bg-red-400 rounded-full"
                  style={{ animation: 'soundWave 0.6s ease-in-out infinite', animationDelay: '0ms', height: '8px' }}
                />
                <span
                  className="w-1 bg-red-400 rounded-full"
                  style={{ animation: 'soundWave 0.6s ease-in-out infinite', animationDelay: '150ms', height: '8px' }}
                />
                <span
                  className="w-1 bg-red-400 rounded-full"
                  style={{ animation: 'soundWave 0.6s ease-in-out infinite', animationDelay: '300ms', height: '8px' }}
                />
              </div>
            </div>
          )}

          {/* Auto-send countdown */}
          {autoSendCountdown !== null && (
            <div className="flex items-center justify-center gap-2 mb-2 py-1.5 px-3 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl">
              <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                Envoi dans {autoSendCountdown}s...
              </span>
              <button
                onClick={cancelAutoSend}
                className="text-xs text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white underline transition-colors"
              >
                Annuler
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  cancelAutoSend();
                }}
                onKeyDown={handleKeyDown}
                disabled={quotaReached}
                placeholder={quotaReached ? 'Quota IA mensuel atteint' : isListening ? 'Parlez maintenant...' : 'Demandez-moi de creer une recette, ajouter un ingredient...'}
                rows={1}
                className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl px-4 py-3 pr-12 text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111]/20 dark:focus:ring-white/20 focus:border-[#111111] dark:focus:border-white/50 resize-none transition-all"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A3A3A3]" />
              </div>
            </div>

            {/* Photo button */}
            <button
              onClick={handlePhotoCapture}
              disabled={quotaReached || isTyping}
              title="Prendre une photo d'ingredient"
              className="flex-shrink-0 p-3 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:bg-[#F3F4F6] dark:disabled:bg-[#171717] disabled:text-[#9CA3AF] dark:disabled:text-[#737373] text-white dark:text-black rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Mic button */}
            {speechSupported ? (
              <button
                onClick={toggleVoice}
                title={isListening ? 'Arreter la dictee' : 'Commande vocale'}
                className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse text-white'
                    : 'bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            ) : (
              <button
                disabled
                title="Non supporte par votre navigateur"
                className="flex-shrink-0 p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] cursor-not-allowed"
              >
                <MicOff className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                cancelAutoSend();
                handleSend();
              }}
              disabled={(!input.trim() && !pendingImage) || isTyping || quotaReached}
              className="flex-shrink-0 p-3 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:bg-[#F3F4F6] dark:disabled:bg-[#171717] disabled:text-[#9CA3AF] dark:disabled:text-[#737373] text-white dark:text-black rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] mt-2 text-center">
            Assistant IA RestauMargin — Mode {currentModeInfo.label}
          </p>
        </div>
      </div>
    </div>
  );
}
