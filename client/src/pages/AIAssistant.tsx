import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Bot, Send, User, Sparkles, MessageSquare, Lightbulb, CheckCircle2, XCircle,
  ExternalLink, ChefHat, Package, ShoppingCart, TrendingUp, Star, Mic, MicOff,
  BarChart3, Camera, Copy, Check, Share2, ThumbsUp, ThumbsDown, History, Plus,
  Trash2, AlertTriangle, Shield, ChevronDown, FileDown, ArrowRight,
  UtensilsCrossed, Leaf, Scale, ClipboardList, Zap, Database,
  ChevronRight, X, Clock, Ratio
} from 'lucide-react';
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
  isStreaming?: boolean;
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
  totalSuppliers: number;
  avgMargin: number;
}

interface PromptCard {
  icon: typeof ChefHat;
  title: string;
  description: string;
  prompt: string;
  gradient: string;
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

const PROMPT_CARDS: PromptCard[] = [
  {
    icon: UtensilsCrossed,
    title: 'Optimise ma carte',
    description: 'Analyse la rentabilite de chaque plat et suggere des ajustements',
    prompt: 'Analyse ma carte et optimise-la : identifie les plats les moins rentables et propose des ajustements de prix ou de composition pour ameliorer mes marges',
    gradient: 'from-amber-500/10 to-orange-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Analyse de marche',
    description: 'Tendances des prix et actualites du secteur restauration',
    prompt: 'Fais une analyse de marche complete : quelles sont les tendances actuelles des prix des matieres premieres en restauration ? Quels ingredients risquent d\'augmenter ? Quelles opportunites d\'achat existent en ce moment ? Base-toi sur les donnees de la mercuriale et du marche.',
    gradient: 'from-blue-500/10 to-indigo-500/10',
  },
  {
    icon: Scale,
    title: 'Optimiser mes fournisseurs',
    description: 'Analyse des prix et recommandations de changement',
    prompt: 'Analyse mes fournisseurs et leurs prix : identifie les ingredients pour lesquels je paie trop cher par rapport aux alternatives. Compare les prix entre fournisseurs pour chaque categorie et propose un plan d\'optimisation concret avec les economies estimees.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
  {
    icon: ClipboardList,
    title: 'Previsions de la semaine',
    description: 'Forecast hebdomadaire avec commandes et alertes',
    prompt: 'Genere les previsions pour la semaine prochaine : estime les besoins en ingredients en fonction de mon historique, identifie les commandes a passer maintenant, signale les risques de rupture de stock, et propose un planning d\'approvisionnement optimal.',
    gradient: 'from-violet-500/10 to-purple-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Suggestions recettes tendance',
    description: 'Recettes populaires adaptees a votre inventaire',
    prompt: 'Suggere-moi des recettes tendance que je pourrais realiser avec mes ingredients actuels, en respectant une bonne marge',
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
  {
    icon: Leaf,
    title: 'Reduis mon gaspillage',
    description: 'Strategies anti-gaspillage basees sur vos stocks',
    prompt: 'Analyse mes stocks et mes recettes pour identifier les sources de gaspillage alimentaire. Propose des strategies concretes pour les reduire',
    gradient: 'from-green-500/10 to-lime-500/10',
  },
  {
    icon: Scale,
    title: 'Compare mes fournisseurs',
    description: 'Benchmark prix et qualite de vos fournisseurs',
    prompt: 'Compare mes fournisseurs : identifie lesquels sont les plus chers par categorie et propose des alternatives pour reduire mes couts d\'achat',
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: ClipboardList,
    title: 'Rapport hebdomadaire',
    description: 'Synthese de la semaine avec KPIs et alertes',
    prompt: 'Genere un rapport hebdomadaire complet : KPIs, alertes stock, evolution des marges, actions recommandees pour la semaine prochaine',
    gradient: 'from-rose-500/10 to-red-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Analyse mes marges',
    description: 'Vue complete de vos marges avec recommandations',
    prompt: 'Analyse mes marges globales et identifie les points d\'amelioration. Donne-moi un rapport detaille avec des recommandations concretes',
    gradient: 'from-amber-500/10 to-orange-500/10',
  },
];

const CONVERSATION_STORAGE_KEY = 'rm_ai_conversations';
const FEEDBACK_STORAGE_KEY = 'rm_ai_feedback';
const MAX_CONVERSATIONS = 20;

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

const AI_CACHE_PREFIX = 'rm_ai_cache_';
const AI_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedResponse(cacheKey: string): { response: string; actions?: ActionResult[] } | null {
  try {
    const raw = sessionStorage.getItem(AI_CACHE_PREFIX + cacheKey);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp > AI_CACHE_TTL_MS) {
      sessionStorage.removeItem(AI_CACHE_PREFIX + cacheKey);
      return null;
    }
    return { response: cached.response, actions: cached.actions };
  } catch { return null; }
}

function setCachedResponse(cacheKey: string, response: string, actions?: ActionResult[]) {
  try {
    sessionStorage.setItem(AI_CACHE_PREFIX + cacheKey, JSON.stringify({
      response, actions, timestamp: Date.now(),
    }));
  } catch {}
}

async function getAIResponse(message: string, history: Message[], image?: string, mode?: AIMode): Promise<{ response: string; actions?: ActionResult[] }> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  const recentHistory = history.slice(-6).map(m => ({
    role: m.role,
    content: m.content,
  }));

  const prefixedMessage = mode ? `${MODE_PREFIXES[mode]} ${message}` : message;

  // Check sessionStorage cache (skip if image is attached)
  if (!image) {
    const cacheKey = btoa(unescape(encodeURIComponent(prefixedMessage.slice(0, 200) + '_' + recentHistory.length)));
    const cached = getCachedResponse(cacheKey);
    if (cached) return cached;
  }

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
    const errorDetail = data.error || data.message || '';
    const statusText = res.status === 429 ? 'Quota depasse' : res.status === 503 ? 'Service IA indisponible' : res.status === 401 ? 'Session expiree, reconnectez-vous' : `Erreur serveur (${res.status})`;
    throw new Error(errorDetail || statusText);
  }

  // Cache the response
  if (!image) {
    const cacheKey = btoa(unescape(encodeURIComponent(prefixedMessage.slice(0, 200) + '_' + recentHistory.length)));
    setCachedResponse(cacheKey, data.response, data.actions);
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
    totalSuppliers: 0,
    avgMargin: 75,
  };

  try {
    const [ingredientsRes, recipesRes, suppliersRes] = await Promise.allSettled([
      fetch('/api/ingredients', { headers }),
      fetch('/api/recipes', { headers }),
      fetch('/api/suppliers', { headers }),
    ]);

    let ingredients: any[] = [];
    let recipes: any[] = [];
    let suppliers: any[] = [];

    if (ingredientsRes.status === 'fulfilled' && ingredientsRes.value.ok) {
      ingredients = await ingredientsRes.value.json();
    }
    if (recipesRes.status === 'fulfilled' && recipesRes.value.ok) {
      recipes = await recipesRes.value.json();
    }
    if (suppliersRes.status === 'fulfilled' && suppliersRes.value.ok) {
      suppliers = await suppliersRes.value.json();
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
      totalSuppliers: Array.isArray(suppliers) ? suppliers.length : 0,
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

// Streaming simulation helper
function simulateStreaming(
  fullText: string,
  onUpdate: (partial: string) => void,
  onComplete: () => void
) {
  let index = 0;
  const chunkSize = () => Math.floor(Math.random() * 4) + 2; // 2-5 chars at a time
  const speed = () => Math.floor(Math.random() * 20) + 10; // 10-30ms

  function step() {
    if (index >= fullText.length) {
      onComplete();
      return;
    }
    const next = Math.min(index + chunkSize(), fullText.length);
    index = next;
    onUpdate(fullText.slice(0, index));
    setTimeout(step, speed());
  }
  setTimeout(step, 100);
}

// ---- Component ----

export default function AIAssistant() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiUsage, setAiUsage] = useState<AIUsage | null>(null);
  const [quotaReached, setQuotaReached] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  // Feature state
  const [aiMode, setAiMode] = useState<AIMode>('gestionnaire');
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [restaurantContext, setRestaurantContext] = useState<RestaurantContext | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const streamingIdRef = useRef<string | null>(null);

  const isEmptyChat = messages.length === 0;

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

  // Fetch restaurant context for badges & smart suggestions
  useEffect(() => {
    fetchRestaurantContext().then(setRestaurantContext);
  }, []);

  // Context-aware quick suggestions (shown as pills below messages)
  const contextSuggestions = useMemo((): ContextSuggestion[] => {
    const suggestions: ContextSuggestion[] = [];
    const ctx = restaurantContext;

    if (ctx) {
      if (ctx.lowStockCount > 0) {
        suggestions.push({
          label: `${ctx.lowStockCount} ruptures de stock`,
          prompt: 'Commander les ingredients manquants et en rupture de stock',
          icon: AlertTriangle,
          priority: 10,
        });
      }
      if (ctx.lowMarginRecipes > 0) {
        suggestions.push({
          label: `${ctx.lowMarginRecipes} recettes faible marge`,
          prompt: 'Optimiser les recettes a faible marge (moins de 60%) avec des alternatives moins cheres',
          icon: TrendingUp,
          priority: 9,
        });
      }
    }

    suggestions.push(
      { label: 'Creer une fiche technique', prompt: 'Cree-moi une fiche technique pour une nouvelle recette', icon: ChefHat, priority: 5 },
      { label: 'Preparer une commande', prompt: 'Prepare une commande fournisseur basee sur mes besoins actuels', icon: ShoppingCart, priority: 3 },
      { label: 'Mon plat star', prompt: 'Quel est mon plat star et pourquoi ?', icon: Star, priority: 2 },
      { label: 'Ajouter un ingredient', prompt: 'Ajoute un nouvel ingredient a mon inventaire', icon: Package, priority: 1 },
    );

    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }, [restaurantContext]);

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

  // Save conversation whenever messages change (skip empty)
  useEffect(() => {
    if (messages.length === 0) return;
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
  }, [messages, isTyping, isStreaming]);

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
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    fileInput.onchange = async (e) => {
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
    fileInput.click();
  }

  async function handleSend(text?: string) {
    const messageText = (text || input).trim();
    if (!messageText || isTyping || isStreaming) return;

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

      // Start streaming simulation
      setIsTyping(false);
      setIsStreaming(true);

      const streamMsgId = (Date.now() + 1).toString();
      streamingIdRef.current = streamMsgId;

      // Add empty message for streaming
      const streamingMessage: Message = {
        id: streamMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        actions: actions && actions.length > 0 ? actions : undefined,
        feedback: null,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, streamingMessage]);

      // Simulate streaming
      simulateStreaming(
        response,
        (partial) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamMsgId ? { ...m, content: partial } : m
            )
          );
        },
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamMsgId ? { ...m, content: response, isStreaming: false } : m
            )
          );
          setIsStreaming(false);
          streamingIdRef.current = null;
          fetchUsage();
        }
      );
    } catch (err: any) {
      const rawMsg = err?.message || '';
      let errMsg: string;
      if (rawMsg.includes('Quota') || rawMsg.includes('429')) {
        setQuotaReached(true);
        errMsg = '**Quota mensuel atteint.** Vous avez utilise toutes vos requetes IA pour ce mois. Passez au plan Business pour un acces illimite, ou attendez le 1er du mois prochain.';
      } else if (rawMsg.includes('503') || rawMsg.includes('indisponible')) {
        errMsg = '**Service IA temporairement indisponible.** Le serveur est en maintenance ou surcharge. Reessayez dans quelques minutes.';
      } else if (rawMsg.includes('401') || rawMsg.includes('Session')) {
        errMsg = '**Session expiree.** Veuillez vous reconnecter pour continuer a utiliser l\'assistant IA.';
      } else if (rawMsg.includes('fetch') || rawMsg.includes('NetworkError') || rawMsg.includes('Failed')) {
        errMsg = '**Erreur de connexion.** Verifiez votre connexion internet et reessayez.';
      } else if (rawMsg) {
        errMsg = `**Erreur :** ${rawMsg}`;
      } else {
        errMsg = "**Une erreur inattendue s'est produite.** Veuillez reessayer. Si le probleme persiste, contactez le support.";
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      setIsStreaming(false);
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
    setMessages([]);
    setShowHistory(false);
    trackEvent('ai_new_conversation');
    setTimeout(() => inputRef.current?.focus(), 100);
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
    if (!window.confirm('Supprimer cette conversation ?')) return;
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

  function handleExportConversation() {
    const text = messages.map(m =>
      `[${m.role === 'user' ? 'Vous' : 'IA'}] ${m.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}\n${m.content}\n`
    ).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-ia-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('ai_export_conversation');
  }

  // ---- Rendering helpers ----

  function formatContent(content: string) {
    return content.split('\n').map((line, i) => {
      // Handle bullet points
      const bulletMatch = line.match(/^(\s*)([-*])\s(.+)/);
      if (bulletMatch) {
        const indent = bulletMatch[1].length;
        const text = bulletMatch[3];
        return (
          <div key={i} className="flex gap-2 items-start" style={{ marginLeft: indent * 8 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white mt-2 flex-shrink-0" />
            <span>{formatInline(text)}</span>
          </div>
        );
      }

      // Handle numbered lists
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s(.+)/);
      if (numberedMatch) {
        const indent = numberedMatch[1].length;
        const num = numberedMatch[2];
        const text = numberedMatch[3];
        return (
          <div key={i} className="flex gap-2 items-start" style={{ marginLeft: indent * 8 }}>
            <span className="text-xs font-bold text-black dark:text-white mt-0.5 min-w-[1.2rem] flex-shrink-0">{num}.</span>
            <span>{formatInline(text)}</span>
          </div>
        );
      }

      // Handle headings (### or ##)
      if (line.startsWith('### ')) {
        return <p key={i} className="font-bold text-sm text-black dark:text-white mt-2 mb-1">{formatInline(line.slice(4))}</p>;
      }
      if (line.startsWith('## ')) {
        return <p key={i} className="font-bold text-base text-black dark:text-white mt-3 mb-1">{formatInline(line.slice(3))}</p>;
      }

      if (line.trim() === '') return <br key={i} />;

      return <div key={i}>{formatInline(line)}</div>;
    });
  }

  function formatInline(text: string) {
    // Bold **text**, italic *text*, code `text`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-semibold text-black dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={j} className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
      }
      return <span key={j}>{part}</span>;
    });
    return <>{parts}</>;
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
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${action.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {getActionLabel(action.type)}
                </p>
                <p className="text-xs text-[#6B7280] dark:text-mono-700 truncate">{action.message}</p>
              </div>
              {action.success && route && (
                <button
                  onClick={() => navigate(route)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-black dark:text-white rounded-lg transition-colors flex-shrink-0"
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

  // Quick action buttons after AI response
  function renderQuickActions(msg: Message) {
    if (msg.role !== 'assistant' || msg.isStreaming) return null;
    const hasActions = msg.actions && msg.actions.length > 0;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {hasActions && msg.actions?.some(a => a.success) && (
          <button
            onClick={() => {
              const successAction = msg.actions?.find(a => a.success);
              if (successAction) {
                const route = getActionRoute(successAction);
                if (route) navigate(route);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-full transition-colors"
          >
            <CheckCircle2 className="w-3 h-3" />
            Appliquer
          </button>
        )}
        <button
          onClick={() => handleExportConversation()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#6B7280] dark:text-mono-700 border border-black/10 dark:border-white/10 rounded-full transition-colors"
        >
          <FileDown className="w-3 h-3" />
          Exporter
        </button>
        <button
          onClick={() => {
            setInput('');
            inputRef.current?.focus();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#6B7280] dark:text-mono-700 border border-black/10 dark:border-white/10 rounded-full transition-colors"
        >
          <ArrowRight className="w-3 h-3" />
          Poser une autre question
        </button>
      </div>
    );
  }

  const currentModeInfo = AI_MODES.find(m => m.key === aiMode)!;
  const CurrentModeIcon = currentModeInfo.icon;

  // ---- RENDER ----

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      {/* ===== HEADER BAR ===== */}
      <div className="flex items-center gap-3 mb-3 px-1">
        <div className="p-2 rounded-xl bg-black dark:bg-white">
          <Sparkles className="w-5 h-5 text-white dark:text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold font-satoshi text-mono-100 dark:text-white tracking-tight">Assistant IA</h1>
          <p className="text-xs font-general-sans text-mono-500 dark:text-mono-700">Votre copilote restaurant intelligent</p>
        </div>

        {/* Mode selector */}
        <div className="relative" ref={modeDropdownRef}>
          <button
            onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 hover:border-black/30 dark:hover:border-white/30 transition-colors"
          >
            <CurrentModeIcon className="w-4 h-4 text-black dark:text-white" />
            <span className="text-xs font-medium text-black dark:text-white hidden sm:inline">{currentModeInfo.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${modeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {modeDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
              {AI_MODES.map(mode => {
                const Icon = mode.icon;
                const isActive = aiMode === mode.key;
                return (
                  <button
                    key={mode.key}
                    onClick={() => { setAiMode(mode.key); setModeDropdownOpen(false); trackEvent('ai_mode_change', { mode: mode.key }); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'hover:bg-mono-975 dark:hover:bg-mono-100 text-black dark:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{mode.label}</p>
                      <p className={`text-[11px] ${isActive ? 'text-white/60 dark:text-black/60' : 'text-[#6B7280]'}`}>{mode.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-2 rounded-xl border transition-colors ${
            showHistory
              ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
              : 'bg-white dark:bg-mono-50 border-mono-900 dark:border-mono-200 hover:border-black/30 dark:hover:border-white/30 text-[#6B7280]'
          }`}
          title="Historique"
        >
          <History className="w-4 h-4" />
        </button>

        {/* New conversation */}
        <button
          onClick={handleNewConversation}
          className="p-2 rounded-xl bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 hover:border-black/30 dark:hover:border-white/30 text-[#6B7280] transition-colors"
          title="Nouvelle conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ===== CONTEXT BADGES ===== */}
      {restaurantContext && (
        <div className="flex flex-wrap gap-2 mb-3 px-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-full">
            <Database className="w-3 h-3 text-emerald-500" />
            <span className="text-[11px] font-medium text-black dark:text-white">{restaurantContext.totalRecipes} recettes</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-full">
            <Package className="w-3 h-3 text-blue-500" />
            <span className="text-[11px] font-medium text-black dark:text-white">{restaurantContext.totalIngredients} ingredients</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-full">
            <ShoppingCart className="w-3 h-3 text-purple-500" />
            <span className="text-[11px] font-medium text-black dark:text-white">{restaurantContext.totalSuppliers} fournisseurs</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-full">
            <Ratio className="w-3 h-3 text-amber-500" />
            <span className="text-[11px] font-medium text-black dark:text-white">Marge moy. {restaurantContext.avgMargin}%</span>
          </div>
          {restaurantContext.lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">{restaurantContext.lowStockCount} alertes stock</span>
            </div>
          )}
        </div>
      )}

      {/* ===== QUOTA BAR (compact) ===== */}
      {aiUsage && (
        <div className="mb-3 px-1">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-mono-975 dark:bg-mono-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  aiUsage.percentage > 80 ? 'bg-red-500' : aiUsage.percentage > 50 ? 'bg-amber-500' : 'bg-black dark:bg-white'
                }`}
                style={{ width: `${Math.min(aiUsage.percentage, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[#6B7280] whitespace-nowrap">{aiUsage.used}/{aiUsage.limit} requetes</span>
          </div>
          {quotaReached && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">Quota mensuel atteint. Passez au plan Business.</p>
          )}
        </div>
      )}

      {/* ===== HISTORY PANEL (overlay-style) ===== */}
      {showHistory && (
        <div className="mb-3 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden max-h-72 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-mono-900 dark:border-mono-200 sticky top-0 bg-white dark:bg-mono-50 z-10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-black dark:text-white" />
              <p className="text-sm font-semibold text-black dark:text-white">Historique</p>
              <span className="text-[10px] text-[#6B7280] bg-mono-975 dark:bg-mono-100 px-2 py-0.5 rounded-full">{conversations.length}</span>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 rounded-lg hover:bg-mono-975 dark:hover:bg-mono-100 text-[#6B7280] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-56">
            {conversations.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <MessageSquare className="w-8 h-8 text-mono-900 dark:text-mono-200 mx-auto mb-2" />
                <p className="text-sm text-[#6B7280]">Aucune conversation sauvegardee</p>
              </div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => handleLoadConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-mono-975 dark:hover:bg-mono-100 transition-colors border-b border-mono-900/50 dark:border-mono-200/50 last:border-b-0 group ${
                    conv.id === currentConversationId ? 'bg-mono-975 dark:bg-mono-100' : ''
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-black dark:text-white truncate font-medium">{conv.title}</p>
                    <p className="text-[11px] text-[#6B7280]">
                      {new Date(conv.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {' '} -- {conv.messages.length} msg -- {conv.mode}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#6B7280] hover:text-red-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===== MAIN CHAT AREA ===== */}
      <div className="flex-1 flex flex-col bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-4">
          {/* EMPTY STATE: Prompt Cards Grid */}
          {isEmptyChat && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white dark:text-black" />
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white mb-1">Bonjour, comment puis-je vous aider ?</h2>
                <p className="text-sm text-[#6B7280] max-w-md mx-auto">
                  Je suis votre assistant IA RestauMargin. J'analyse vos donnees et agis sur votre restaurant.
                </p>
              </div>

              {/* Prompt Cards Grid (show first 9, 3 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl px-2">
                {PROMPT_CARDS.slice(0, 9).map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.title}
                      onClick={() => handleSend(card.prompt)}
                      disabled={quotaReached}
                      className={`group text-left p-4 rounded-2xl border border-mono-900 dark:border-mono-200 bg-gradient-to-br ${card.gradient} hover:border-black/30 dark:hover:border-white/30 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 group-hover:border-black/20 dark:group-hover:border-white/20 transition-colors">
                          <Icon className="w-4 h-4 text-black dark:text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-black dark:text-white mb-0.5">{card.title}</p>
                          <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2">{card.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-[10px] text-[#6B7280] group-hover:text-black dark:group-hover:text-white transition-colors">
                        <ChevronRight className="w-3 h-3" />
                        <span>Cliquez pour lancer</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* MESSAGES LIST */
            <div className="space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-black dark:bg-white'
                        : 'bg-emerald-500'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white dark:text-black" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className={`${msg.role === 'user' ? 'max-w-[75%]' : 'max-w-[85%] flex-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-md'
                          : 'bg-mono-1000 dark:bg-mono-100 text-[#374151] dark:text-mono-800 rounded-tl-md border-l-2 border-l-emerald-500'
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
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-emerald-500 rounded-sm ml-0.5 animate-pulse" />
                      )}
                      {msg.actions && msg.actions.length > 0 && !msg.isStreaming && renderActions(msg.actions)}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-[10px] mt-1 px-1 ${msg.role === 'user' ? 'text-right text-[#6B7280]' : 'text-[#6B7280]'}`}>
                      {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Assistant toolbar: copy, share, feedback, quick actions */}
                    {msg.role === 'assistant' && !msg.isStreaming && (
                      <>
                        <div className="flex items-center gap-1 mt-1 ml-1">
                          <button
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="p-1.5 rounded-lg hover:bg-mono-975 dark:hover:bg-mono-200 text-[#9CA3AF] hover:text-black dark:hover:text-white transition-colors"
                            title="Copier"
                          >
                            {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleShareMessage(msg.content)}
                            className="p-1.5 rounded-lg hover:bg-mono-975 dark:hover:bg-mono-200 text-[#9CA3AF] hover:text-black dark:hover:text-white transition-colors"
                            title="Partager"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-px h-3 bg-mono-900 dark:bg-mono-200 mx-0.5" />
                          <button
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              msg.feedback === 'up'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'hover:bg-mono-975 dark:hover:bg-mono-200 text-[#9CA3AF] hover:text-black dark:hover:text-white'
                            }`}
                            title="Bonne reponse"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={`p-1.5 rounded-lg transition-colors ${
                              msg.feedback === 'down'
                                ? 'bg-red-500/10 text-red-500'
                                : 'hover:bg-mono-975 dark:hover:bg-mono-200 text-[#9CA3AF] hover:text-black dark:hover:text-white'
                            }`}
                            title="Mauvaise reponse"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Quick Action Buttons */}
                        {msg.id === messages[messages.length - 1]?.id && renderQuickActions(msg)}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500 mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-mono-1000 dark:bg-mono-100 border-l-2 border-l-emerald-500 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="text-xs text-[#6B7280]">Analyse en cours...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ===== QUICK SUGGESTIONS BAR (only when there are messages) ===== */}
        {!isEmptyChat && (
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {contextSuggestions.slice(0, 4).map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.prompt)}
                    disabled={isTyping || isStreaming}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-mono-900 dark:border-mono-200 bg-white dark:bg-mono-50 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[#6B7280]"
                  >
                    <Icon className="w-3 h-3" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== INPUT BAR ===== */}
        <div className="border-t border-mono-900 dark:border-mono-200 p-3">
          {/* Pending image preview */}
          {pendingImage && (
            <div className="flex items-center gap-3 mb-2 py-2 px-3 bg-mono-1000 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 rounded-xl">
              <img src={pendingImage} alt="Apercu" className="w-12 h-12 object-cover rounded-lg border border-mono-900 dark:border-mono-200" loading="lazy" />
              <span className="text-sm text-[#6B7280] flex-1">Photo prete a envoyer</span>
              <button
                onClick={() => setPendingImage(null)}
                className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          )}

          {/* Listening indicator */}
          {isListening && (
            <div className="flex items-center justify-center gap-3 mb-2 py-2 px-3 bg-red-500/5 border border-red-500/20 rounded-xl">
              <div className="relative">
                <Mic className="w-4 h-4 text-red-500" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </div>
              <span className="text-xs text-red-500 font-medium">Ecoute en cours...</span>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map(i => (
                  <span
                    key={i}
                    className="w-0.5 bg-red-500 rounded-full"
                    style={{
                      animation: 'soundWave 0.6s ease-in-out infinite',
                      animationDelay: `${i * 80}ms`,
                      height: '8px',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Auto-send countdown */}
          {autoSendCountdown !== null && (
            <div className="flex items-center justify-center gap-2 mb-2 py-1.5 px-3 bg-mono-1000 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 rounded-xl">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-[#6B7280]">Envoi dans {autoSendCountdown}s...</span>
              <button
                onClick={cancelAutoSend}
                className="text-xs text-[#6B7280] hover:text-black dark:hover:text-white underline transition-colors"
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
                placeholder={quotaReached ? 'Quota IA mensuel atteint' : isListening ? 'Parlez maintenant...' : 'Posez une question ou donnez une instruction...'}
                rows={1}
                className="w-full bg-mono-1000 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 rounded-2xl px-4 py-3 text-sm text-black dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 focus:border-black/30 dark:focus:border-white/30 resize-none transition-all"
                style={{ minHeight: '46px', maxHeight: '140px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 140) + 'px';
                }}
              />
            </div>

            {/* Photo */}
            <button
              onClick={handlePhotoCapture}
              disabled={quotaReached || isTyping || isStreaming}
              title="Photo d'ingredient"
              className="flex-shrink-0 p-3 bg-mono-1000 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-40 disabled:cursor-not-allowed text-[#6B7280] rounded-2xl transition-all"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Mic */}
            {speechSupported ? (
              <button
                onClick={toggleVoice}
                title={isListening ? 'Arreter la dictee' : 'Commande vocale'}
                className={`relative flex-shrink-0 p-3 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-mono-1000 dark:bg-mono-100 border border-mono-900 dark:border-mono-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-[#6B7280]'
                }`}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-20" />
                )}
                {isListening ? <MicOff className="w-5 h-5 relative z-10" /> : <Mic className="w-5 h-5" />}
              </button>
            ) : (
              <button
                disabled
                title="Non supporte par votre navigateur"
                className="flex-shrink-0 p-3 rounded-2xl bg-mono-1000 dark:bg-mono-100 text-mono-800 dark:text-[#333] cursor-not-allowed"
              >
                <MicOff className="w-5 h-5" />
              </button>
            )}

            {/* Send */}
            <button
              onClick={() => {
                cancelAutoSend();
                handleSend();
              }}
              disabled={(!input.trim() && !pendingImage) || isTyping || isStreaming || quotaReached}
              className="flex-shrink-0 p-3 bg-black dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:bg-mono-900 dark:disabled:bg-mono-200 disabled:text-[#9CA3AF] text-white dark:text-black rounded-2xl transition-all disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <p className="text-[10px] text-[#9CA3AF] mt-2 text-center">
            Mode {currentModeInfo.label} -- RestauMargin IA
          </p>
        </div>
      </div>

      {/* Sound wave animation CSS */}
      <style>{`
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
