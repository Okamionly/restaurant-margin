import { formatCurrency } from '../utils/currency';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, X, Undo2, ChevronDown, ChevronUp, Check, AlertTriangle, Loader2, Package, ChefHat, ShoppingCart, BarChart3, Printer, Navigation, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseVoiceCommand, describeAction, type VoiceAction } from '../utils/voiceParser';
import { fetchInventory, fetchRecipes, fetchIngredients, restockInventoryItem } from '../services/api';

// --- Types ---

interface VoiceCommand {
  id: string;
  timestamp: Date;
  transcript: string;
  action: VoiceAction;
  result: string;
  success: boolean;
  undoable: boolean;
  undone?: boolean;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

// --- Constants ---

const VOICE_HISTORY_KEY = 'rm_voice_commands';
const MAX_HISTORY = 10;
const SILENCE_TIMEOUT = 2000; // 2s auto-process after silence

// --- Helpers ---

function loadHistory(): VoiceCommand[] {
  try {
    const raw = localStorage.getItem(VOICE_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) }));
  } catch { return []; }
}

function saveHistory(commands: VoiceCommand[]) {
  localStorage.setItem(VOICE_HISTORY_KEY, JSON.stringify(commands.slice(0, MAX_HISTORY)));
}

function getActionIcon(type: string) {
  switch (type) {
    case 'stock_add': return Package;
    case 'stock_query': return Package;
    case 'recipe_cost': return ChefHat;
    case 'recipe_create': return ChefHat;
    case 'order_create': return ShoppingCart;
    case 'dashboard_stats': return BarChart3;
    case 'recipe_print': return Printer;
    case 'navigate': return Navigation;
    default: return HelpCircle;
  }
}

// --- Component ---

export default function VoiceCommandButton() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<VoiceCommand | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<VoiceCommand[]>(() => loadHistory());
  const [speechSupported] = useState(() => !!SpeechRecognitionAPI);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // --- Execute voice action ---
  const executeAction = useCallback(async (action: VoiceAction): Promise<{ result: string; success: boolean; undoable: boolean }> => {
    try {
      switch (action.type) {
        case 'stock_add': {
          const ingredients = await fetchIngredients();
          const name = action.params.ingredientName.toLowerCase();
          const ingredient = ingredients.find(i =>
            i.name.toLowerCase().includes(name) || name.includes(i.name.toLowerCase())
          );
          if (!ingredient) {
            return { result: `Ingredient "${action.params.ingredientName}" non trouve dans la base.`, success: false, undoable: false };
          }
          const inventory = await fetchInventory();
          const invItem = inventory.find(inv => inv.ingredientId === ingredient.id);
          if (!invItem) {
            return { result: `"${ingredient.name}" n'est pas dans l'inventaire. Ajoutez-le d'abord.`, success: false, undoable: false };
          }
          await restockInventoryItem(invItem.id, action.params.quantity);
          return {
            result: `${action.params.quantity} ${action.params.unit} de ${ingredient.name} ajoute(s) au stock. Nouveau stock: ${invItem.currentStock + action.params.quantity} ${invItem.unit}`,
            success: true,
            undoable: true,
          };
        }

        case 'stock_query': {
          const ingredients = await fetchIngredients();
          const name = action.params.ingredientName.toLowerCase();
          const ingredient = ingredients.find(i =>
            i.name.toLowerCase().includes(name) || name.includes(i.name.toLowerCase())
          );
          if (!ingredient) {
            return { result: `Ingredient "${action.params.ingredientName}" non trouve.`, success: false, undoable: false };
          }
          const inventory = await fetchInventory();
          const invItem = inventory.find(inv => inv.ingredientId === ingredient.id);
          if (!invItem) {
            return { result: `"${ingredient.name}" n'est pas suivi dans l'inventaire.`, success: false, undoable: false };
          }
          const status = invItem.currentStock <= (invItem.minStock || 0) ? ' (STOCK BAS)' : '';
          return {
            result: `${ingredient.name}: ${invItem.currentStock} ${invItem.unit} en stock${status}`,
            success: true,
            undoable: false,
          };
        }

        case 'recipe_cost': {
          const recipes = await fetchRecipes();
          const name = action.params.recipeName.toLowerCase();
          const recipe = recipes.find(r =>
            r.name.toLowerCase().includes(name) || name.includes(r.name.toLowerCase())
          );
          if (!recipe) {
            return { result: `Recette "${action.params.recipeName}" non trouvee.`, success: false, undoable: false };
          }
          const costPerPortion = recipe.margin?.costPerPortion || 0;
          const price = recipe.sellingPrice || 0;
          const foodCostPct = recipe.margin?.foodCost || 0;
          const marginPct = recipe.margin?.marginPercent || 0;
          return {
            result: `${recipe.name}:\n- Cout matiere/portion: ${formatCurrency(costPerPortion)}\n- Prix de vente: ${formatCurrency(price)}\n- Food cost: ${foodCostPct.toFixed(1)}%\n- Marge: ${marginPct.toFixed(1)}%`,
            success: true,
            undoable: false,
          };
        }

        case 'recipe_create': {
          const recipeName = action.params.recipeName;
          navigate(`/recipes?action=new&name=${encodeURIComponent(recipeName)}`);
          return {
            result: `Redirection vers la creation de la recette "${recipeName}"`,
            success: true,
            undoable: false,
          };
        }

        case 'order_create': {
          const { ingredientName, quantity, unit, supplierName } = action.params;
          navigate(`/auto-orders?draft=1&ingredient=${encodeURIComponent(ingredientName)}&qty=${quantity}&unit=${encodeURIComponent(unit)}${supplierName ? `&supplier=${encodeURIComponent(supplierName)}` : ''}`);
          return {
            result: `Brouillon de commande cree: ${quantity} ${unit} de ${ingredientName}${supplierName ? ` chez ${supplierName}` : ''}`,
            success: true,
            undoable: false,
          };
        }

        case 'dashboard_stats': {
          navigate('/dashboard');
          return {
            result: `Redirection vers le tableau de bord avec les statistiques`,
            success: true,
            undoable: false,
          };
        }

        case 'recipe_print': {
          const recipes = await fetchRecipes();
          const name = action.params.recipeName.toLowerCase();
          const recipe = recipes.find(r =>
            r.name.toLowerCase().includes(name) || name.includes(r.name.toLowerCase())
          );
          if (!recipe) {
            return { result: `Recette "${action.params.recipeName}" non trouvee.`, success: false, undoable: false };
          }
          navigate(`/recipes/${recipe.id}`);
          // Trigger print after navigation with small delay
          setTimeout(() => window.print(), 1500);
          return {
            result: `Ouverture de la fiche technique "${recipe.name}" pour impression`,
            success: true,
            undoable: false,
          };
        }

        case 'navigate': {
          const route = action.params.route;
          if (!route) {
            return { result: `Page "${action.params.target}" non reconnue.`, success: false, undoable: false };
          }
          navigate(route);
          return {
            result: `Navigation vers ${action.params.target}`,
            success: true,
            undoable: false,
          };
        }

        default:
          return { result: 'Commande vocale non reconnue. Essayez: "Ajoute 5 kilos de tomates au stock" ou "Quel est le cout du burger?"', success: false, undoable: false };
      }
    } catch (err: any) {
      return { result: `Erreur: ${err.message || 'Une erreur est survenue'}`, success: false, undoable: false };
    }
  }, [navigate]);

  // --- Process transcript ---
  const processTranscript = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    setIsListening(false);
    setError(null);

    const action = parseVoiceCommand(transcript);
    const { result, success, undoable } = await executeAction(action);

    const command: VoiceCommand = {
      id: Date.now().toString(),
      timestamp: new Date(),
      transcript,
      action,
      result,
      success,
      undoable,
    };

    setLastResult(command);
    setShowResult(true);
    setIsProcessing(false);
    setLiveTranscript('');

    // Save to history
    const newHistory = [command, ...history].slice(0, MAX_HISTORY);
    setHistory(newHistory);
    saveHistory(newHistory);
  }, [executeAction, history]);

  // --- Start/Stop listening ---
  const toggleListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError('La reconnaissance vocale n\'est pas supportee par ce navigateur.');
      return;
    }

    if (isListening) {
      // Stop
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      // Process whatever we have
      if (transcriptRef.current.trim()) {
        processTranscript(transcriptRef.current);
      }
      return;
    }

    // Start
    setError(null);
    setShowResult(false);
    setLiveTranscript('');
    transcriptRef.current = '';

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const combined = finalTranscript || interimTranscript;
      transcriptRef.current = combined;
      setLiveTranscript(combined);

      // Reset silence timer on each speech result
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (finalTranscript.trim()) {
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch {}
          }
          setIsListening(false);
          processTranscript(finalTranscript);
        }, SILENCE_TIMEOUT);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'aborted') {
        setError(`Erreur micro: ${event.error === 'not-allowed' ? 'Microphone non autorise' : event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      // If still in listening state but recognition ended (e.g. no speech), restart or process
      if (transcriptRef.current.trim() && !isProcessing) {
        processTranscript(transcriptRef.current);
      }
      setIsListening(false);
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch (err: any) {
      setError('Impossible de demarrer la reconnaissance vocale.');
    }
  }, [isListening, isProcessing, processTranscript]);

  // --- Undo last action ---
  const handleUndo = useCallback(async () => {
    if (!lastResult || !lastResult.undoable || lastResult.undone) return;
    // For stock_add, we restock with negative quantity
    if (lastResult.action.type === 'stock_add') {
      try {
        const ingredients = await fetchIngredients();
        const name = lastResult.action.params.ingredientName.toLowerCase();
        const ingredient = ingredients.find(i =>
          i.name.toLowerCase().includes(name) || name.includes(i.name.toLowerCase())
        );
        if (ingredient) {
          const inventory = await fetchInventory();
          const invItem = inventory.find(inv => inv.ingredientId === ingredient.id);
          if (invItem) {
            await restockInventoryItem(invItem.id, -lastResult.action.params.quantity);
          }
        }
        setLastResult(prev => prev ? { ...prev, undone: true, result: prev.result + '\n(Action annulee)' } : null);
      } catch {
        setError('Impossible d\'annuler cette action.');
      }
    }
  }, [lastResult]);

  // Don't render anything if speech not supported
  if (!speechSupported) return null;

  const ActionIcon = lastResult ? getActionIcon(lastResult.action.type) : HelpCircle;

  return (
    <>
      {/* Floating Mic Button */}
      <button
        onClick={toggleListening}
        disabled={isProcessing}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white scale-110'
            : isProcessing
            ? 'bg-mono-900 dark:bg-mono-300 text-[#9CA3AF] dark:text-mono-500 cursor-wait'
            : 'bg-mono-100 dark:bg-white text-white dark:text-mono-100 hover:bg-[#333333] dark:hover:bg-mono-900 hover:scale-105'
        }`}
        title="Commande vocale"
        aria-label={isListening ? 'Arreter l\'ecoute vocale' : 'Activer la commande vocale'}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        {/* Pulsing ring when listening */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-50" />
            <span className="absolute inset-[-4px] rounded-full border-2 border-red-300 animate-pulse opacity-30" />
          </>
        )}
      </button>

      {/* Live Transcript Bubble */}
      {isListening && liveTranscript && (
        <div className="fixed z-[9999] right-5 bottom-40 max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-2xl px-4 py-3 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-mono-500">Ecoute en cours...</span>
            </div>
            <p className="text-sm text-mono-100 dark:text-white font-medium leading-relaxed">{liveTranscript}</p>
          </div>
        </div>
      )}

      {/* Listening indicator (no transcript yet) */}
      {isListening && !liveTranscript && (
        <div className="fixed z-[9999] right-5 bottom-40 max-w-xs">
          <div className="bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-2xl px-4 py-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm text-mono-100 dark:text-white">Parlez maintenant...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed z-[9999] right-5 bottom-40 max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white dark:bg-[#171717] border border-red-200 dark:border-red-900/50 rounded-2xl px-4 py-3 shadow-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto flex-shrink-0">
                <X className="w-4 h-4 text-[#9CA3AF] hover:text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {showResult && lastResult && !isListening && (
        <div className="fixed z-[9999] right-5 bottom-40 w-80 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-300 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`px-4 py-3 flex items-center gap-3 ${
              lastResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/30'
                : 'bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/30'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                lastResult.success ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'
              }`}>
                {lastResult.success ? (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#6B7280] dark:text-mono-700">
                  {lastResult.success ? 'Commande executee' : 'Erreur'}
                </p>
                <p className="text-sm font-semibold text-mono-100 dark:text-white truncate">
                  {describeAction(lastResult.action)}
                </p>
              </div>
              <button
                onClick={() => setShowResult(false)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Transcript */}
            <div className="px-4 py-3 border-b border-mono-950 dark:border-mono-200">
              <p className="text-xs font-medium text-[#9CA3AF] dark:text-mono-500 mb-1">Transcription</p>
              <p className="text-sm text-[#374151] dark:text-mono-800 italic">"{lastResult.transcript}"</p>
            </div>

            {/* Result */}
            <div className="px-4 py-3">
              <div className="flex items-start gap-2">
                <ActionIcon className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-mono-100 dark:text-white whitespace-pre-line">{lastResult.result}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 bg-[#F9FAFB] dark:bg-mono-50 border-t border-mono-950 dark:border-mono-200 flex items-center gap-2">
              {lastResult.undoable && !lastResult.undone && (
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B7280] dark:text-mono-700 bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-lg hover:bg-mono-950 dark:hover:bg-mono-300 transition-colors"
                >
                  <Undo2 className="w-3 h-3" />
                  Annuler
                </button>
              )}
              {lastResult.undone && (
                <span className="text-xs text-[#9CA3AF] dark:text-mono-500 italic">Action annulee</span>
              )}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B7280] dark:text-mono-700 bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-lg hover:bg-mono-950 dark:hover:bg-mono-300 transition-colors"
              >
                {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Historique
              </button>
            </div>

            {/* History Panel */}
            {showHistory && history.length > 0 && (
              <div className="max-h-48 overflow-y-auto border-t border-mono-950 dark:border-mono-200">
                {history.map((cmd) => {
                  const CmdIcon = getActionIcon(cmd.action.type);
                  return (
                    <div
                      key={cmd.id}
                      className="px-4 py-2.5 border-b border-mono-950 dark:border-mono-200 last:border-b-0 hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CmdIcon className={`w-3.5 h-3.5 flex-shrink-0 ${cmd.success ? 'text-teal-500' : 'text-red-400'}`} />
                        <span className="text-xs text-mono-100 dark:text-white font-medium truncate flex-1">
                          {cmd.transcript}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 flex-shrink-0">
                          {cmd.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
