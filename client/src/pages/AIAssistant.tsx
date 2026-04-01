import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, User, Sparkles, MessageSquare, Lightbulb, CheckCircle2, XCircle, ExternalLink, ChefHat, Package, ShoppingCart, TrendingUp, Star, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

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
}

const QUICK_SUGGESTIONS = [
  { label: 'Cree-moi une fiche technique', icon: ChefHat },
  { label: 'Ajoute un ingredient', icon: Package },
  { label: 'Prepare une commande fournisseur', icon: ShoppingCart },
  { label: 'Analyse mes marges', icon: TrendingUp },
  { label: 'Quel est mon plat star ?', icon: Star },
];

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
    default: return 'Action executee';
  }
}

async function getAIResponse(message: string): Promise<{ response: string; actions?: ActionResult[] }> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('restaurantId');
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
    },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur ${res.status}`);
  }
  return { response: data.response, actions: data.actions };
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

export default function AIAssistant() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Cancel auto-send when user modifies input manually
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      cancelAutoSend();
    };
  }, [cancelAutoSend]);

  // Start auto-send countdown after voice recognition ends
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
      // Trigger send via a synthetic call
      handleSendRef.current?.(transcript);
    }, 2000);
  }, [cancelAutoSend]);

  // We use a ref to handleSend so the countdown callback always has the latest version
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
  }

  async function handleSend(text?: string) {
    const messageText = (text || input).trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { response, actions } = await getAIResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        actions: actions && actions.length > 0 ? actions : undefined,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: err?.message || "Desole, une erreur s'est produite. Veuillez reessayer.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  // Keep ref in sync for auto-send callback
  handleSendRef.current = handleSend;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function formatContent(content: string) {
    return content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={j} className="font-semibold text-white">
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
                <p className="text-xs text-slate-400 truncate">{action.message}</p>
              </div>
              {action.success && route && (
                <button
                  onClick={() => navigate(route)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex-shrink-0"
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

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[900px]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Assistant IA RestauMargin</h1>
            <p className="text-sm text-slate-400">Analyse vos donnees et agit sur votre restaurant</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-400 font-medium">Claude AI</span>
          </div>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
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
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-slate-800 text-slate-300 rounded-bl-md border border-slate-700/50'
                }`}
              >
                {formatContent(msg.content)}
                {msg.actions && msg.actions.length > 0 && renderActions(msg.actions)}
                <div
                  className={`text-[10px] mt-2 ${
                    msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs text-slate-400">Analyse en cours...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-slate-400 font-medium">Essayez ces actions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.label)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-full transition-all duration-200"
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
        <div className="border-t border-slate-800 p-3">
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
            <div className="flex items-center justify-center gap-2 mb-2 py-1.5 px-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <span className="text-xs text-blue-400">
                Envoi dans {autoSendCountdown}s...
              </span>
              <button
                onClick={cancelAutoSend}
                className="text-xs text-blue-300 hover:text-white underline transition-colors"
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
                placeholder={isListening ? 'Parlez maintenant...' : 'Demandez-moi de creer une recette, ajouter un ingredient...'}
                rows={1}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* Mic button */}
            {speechSupported ? (
              <button
                onClick={toggleVoice}
                title={isListening ? 'Arreter la dictee' : 'Commande vocale'}
                className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-500'
                } text-white`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            ) : (
              <button
                disabled
                title="Non supporte par votre navigateur"
                className="flex-shrink-0 p-3 rounded-xl bg-slate-700 text-slate-500 cursor-not-allowed"
              >
                <MicOff className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                cancelAutoSend();
                handleSend();
              }}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-300 mt-2 text-center">
            Propulse par Claude AI — Analyse et agit sur votre restaurant
          </p>
        </div>
      </div>
    </div>
  );
}
