import { useState, useEffect } from 'react';
import { Scale, Bluetooth, Check, X, Plus, Minus, RotateCcw, ChevronRight, AlertTriangle, Loader2, PartyPopper } from 'lucide-react';
import type { ScaleStatus, ScaleReading } from '../hooks/useScale';
import type { Ingredient } from '../types';

// ── Weight conversion: scale reads in kg, convert to ingredient unit ────
function convertKgToUnit(kg: number, unit: string): number {
  const u = (unit || 'kg').toLowerCase().trim();
  switch (u) {
    case 'g': return Math.round(kg * 1000);
    case 'mg': return Math.round(kg * 1000000);
    case 'kg': return Math.round(kg * 1000) / 1000;
    case 'l': return Math.round(kg * 100) / 100; // 1kg water ~ 1L
    case 'cl': return Math.round(kg * 100 * 100) / 100;
    case 'ml': return Math.round(kg * 1000);
    case 'dl': return Math.round(kg * 10 * 100) / 100;
    default: return Math.round(kg * 1000) / 1000;
  }
}

// ── Inline Weigh Panel for a single ingredient line ─────────────────────
interface InlineWeighPanelProps {
  ingredientName: string;
  ingredientUnit: string;
  onWeighComplete: (quantity: number) => void;
  onClose: () => void;
  scaleStatus: ScaleStatus;
  reading: ScaleReading | null;
  scaleError: string | null;
  connect: () => void;
  disconnect: () => void;
  useSimulation: boolean;
  simWeight: number;
  setSimWeight: (fn: (w: number) => number) => void;
}

export function InlineWeighPanel({
  ingredientName,
  ingredientUnit,
  onWeighComplete,
  onClose,
  scaleStatus,
  reading,
  scaleError,
  connect,
  disconnect,
  useSimulation,
  simWeight,
  setSimWeight,
}: InlineWeighPanelProps) {
  const [tare, setTare] = useState(0);
  const [filled, setFilled] = useState(false);

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const isStable = useSimulation ? true : (reading?.stable ?? false);
  const isConnected = scaleStatus === 'connected' || useSimulation;

  const weightInUnit = convertKgToUnit(netWeight, ingredientUnit);
  const displayGrams = Math.round(netWeight * 1000);

  function handleTare() {
    setTare(currentWeight);
  }

  function handleConfirm() {
    if (weightInUnit <= 0) return;
    onWeighComplete(weightInUnit);
    setFilled(true);
    setTare(0);
    setTimeout(() => {
      onClose();
    }, 600);
  }

  return (
    <div className="mt-2 border border-mono-900 dark:border-mono-200 rounded-lg bg-mono-1000 dark:bg-mono-50 p-3 space-y-3 animate-in slide-in-from-top-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-mono-100 dark:text-white" />
          <span className="text-xs font-semibold text-mono-100 dark:text-white uppercase tracking-wider">Pesee</span>
          {filled && <Check className="w-4 h-4 text-green-500" />}
        </div>
        <button type="button" onClick={onClose} className="p-0.5 text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Connection status */}
      {!isConnected && (
        <button
          type="button"
          onClick={connect}
          disabled={scaleStatus === 'connecting'}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-mono-100 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 transition-colors"
        >
          {scaleStatus === 'connecting' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
          ) : (
            <><Bluetooth className="w-4 h-4" /> Connecter la balance</>
          )}
        </button>
      )}

      {scaleError && !useSimulation && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{scaleError}</span>
        </div>
      )}

      {/* Weight display */}
      {isConnected && (
        <>
          <div className="flex items-center justify-center gap-3 py-3 rounded-lg" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            border: `2px solid ${netWeight > 0 && isStable ? '#10b981' : netWeight > 0 ? '#3b82f6' : '#334155'}`,
          }}>
            <span className={`text-3xl font-black tabular-nums tracking-tight transition-colors ${
              netWeight > 0 && isStable ? 'text-emerald-400' :
              netWeight > 0 ? 'text-teal-300' :
              'text-mono-400'
            }`}>
              {displayGrams}
            </span>
            <span className={`text-sm font-bold ${netWeight > 0 ? 'text-mono-700' : 'text-mono-350'}`}>g</span>
            {netWeight > 0 && isStable && (
              <Check className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          {/* Converted value */}
          {weightInUnit > 0 && (
            <div className="text-center text-sm text-[#6B7280] dark:text-mono-700">
              = <strong className="text-mono-100 dark:text-white">{weightInUnit}</strong> {ingredientUnit}
            </div>
          )}

          {/* Simulation controls */}
          {useSimulation && (
            <div className="flex items-center justify-center gap-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-medium uppercase tracking-wider">Sim</span>
              <button type="button" onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
                className="w-8 h-8 rounded-lg bg-mono-900 dark:bg-mono-300 hover:bg-[#D1D5DB] dark:hover:bg-mono-350 flex items-center justify-center transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs w-16 text-center tabular-nums">{simWeight.toFixed(3)} kg</span>
              <button type="button" onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
                className="w-8 h-8 rounded-lg bg-mono-900 dark:bg-mono-300 hover:bg-[#D1D5DB] dark:hover:bg-mono-350 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleTare} disabled={currentWeight <= 0}
              className="flex items-center gap-1 px-2 py-1.5 bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-300 disabled:opacity-30 rounded-lg text-xs font-medium transition-colors">
              <RotateCcw className="w-3 h-3" /> Tare
            </button>
            <button type="button" onClick={handleConfirm} disabled={weightInUnit <= 0 || !isStable}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-mono-100 dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-colors">
              <Check className="w-3.5 h-3.5" /> Valider {weightInUnit > 0 ? `(${weightInUnit} ${ingredientUnit})` : ''}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Mode Pesee Header Bar ───────────────────────────────────────────────
interface ModePeseeBarProps {
  enabled: boolean;
  onToggle: () => void;
  scaleStatus: ScaleStatus;
  reading: ScaleReading | null;
  connect: () => void;
  disconnect: () => void;
  useSimulation: boolean;
  onToggleSimulation: () => void;
}

export function ModePeseeBar({
  enabled,
  onToggle,
  scaleStatus,
  reading,
  connect,
  disconnect,
  useSimulation,
  onToggleSimulation,
}: ModePeseeBarProps) {
  const isConnected = scaleStatus === 'connected' || useSimulation;
  const currentWeight = useSimulation ? 0 : (reading?.weight ?? 0);

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
      enabled
        ? 'bg-mono-100 dark:bg-white border-mono-100 dark:border-white'
        : 'bg-mono-950 dark:bg-[#171717] border-mono-900 dark:border-mono-200'
    }`}>
      {/* Toggle */}
      <button type="button" onClick={onToggle} className="flex items-center gap-2">
        <Scale className={`w-4 h-4 ${enabled ? 'text-white dark:text-black' : 'text-[#6B7280] dark:text-mono-700'}`} />
        <span className={`text-sm font-semibold ${enabled ? 'text-white dark:text-black' : 'text-mono-100 dark:text-white'}`}>
          Mode Pesee
        </span>
        <div className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-[#D1D5DB] dark:bg-mono-350'}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
      </button>

      {enabled && (
        <>
          <div className="w-px h-5 bg-mono-350 dark:bg-mono-500" />

          {/* Simulation toggle */}
          <button type="button" onClick={onToggleSimulation}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
              useSimulation
                ? 'bg-amber-500 text-white'
                : 'bg-[#333] dark:bg-[#E5E5E5] text-[#9CA3AF] dark:text-mono-500'
            }`}>
            {useSimulation ? 'Sim ON' : 'Sim'}
          </button>

          {/* Connection */}
          {!useSimulation && (
            <button type="button" onClick={isConnected ? disconnect : connect}
              disabled={scaleStatus === 'connecting'}
              className="flex items-center gap-1 text-xs font-medium text-white dark:text-black">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : scaleStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'
              }`} />
              {isConnected ? 'Connectee' : scaleStatus === 'connecting' ? '...' : 'Deconnectee'}
            </button>
          )}

          {/* Mini weight display */}
          {isConnected && !useSimulation && (
            <span className="text-xs font-mono text-green-400 dark:text-green-600 tabular-nums ml-auto">
              {Math.round(currentWeight * 1000)}g
            </span>
          )}
        </>
      )}
    </div>
  );
}

// ── Batch Weighing Mode ─────────────────────────────────────────────────
interface BatchWeighIngredient {
  index: number;
  name: string;
  unit: string;
  targetQty?: number;
  measuredQty?: number;
  done: boolean;
}

interface BatchWeighingPanelProps {
  ingredientItems: BatchWeighIngredient[];
  onWeighComplete: (ingredientIndex: number, quantity: number) => void;
  onClose: () => void;
  scaleStatus: ScaleStatus;
  reading: ScaleReading | null;
  scaleError: string | null;
  connect: () => void;
  disconnect: () => void;
  useSimulation: boolean;
  simWeight: number;
  setSimWeight: (fn: (w: number) => number) => void;
}

export function BatchWeighingPanel({
  ingredientItems,
  onWeighComplete,
  onClose,
  scaleStatus,
  reading,
  scaleError,
  connect,
  disconnect,
  useSimulation,
  simWeight,
  setSimWeight,
}: BatchWeighingPanelProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [tare, setTare] = useState(0);
  const [items, setItems] = useState<BatchWeighIngredient[]>(ingredientItems);
  const [celebration, setCelebration] = useState(false);

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const isStable = useSimulation ? true : (reading?.stable ?? false);
  const isConnected = scaleStatus === 'connected' || useSimulation;

  const current = items[currentIdx];
  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const allDone = doneCount === totalCount;

  useEffect(() => {
    if (allDone && !celebration) {
      setCelebration(true);
      setTimeout(() => setCelebration(false), 3000);
    }
  }, [allDone]);

  function handleConfirmCurrent() {
    if (!current || netWeight <= 0 || !isStable) return;
    const qty = convertKgToUnit(netWeight, current.unit);
    onWeighComplete(current.index, qty);

    const updated = [...items];
    updated[currentIdx] = { ...updated[currentIdx], measuredQty: qty, done: true };
    setItems(updated);
    setTare(0);

    // Auto-advance to next undone
    const nextIdx = updated.findIndex((item, i) => i > currentIdx && !item.done);
    if (nextIdx >= 0) {
      setCurrentIdx(nextIdx);
    } else {
      // Check if any before current are undone
      const beforeIdx = updated.findIndex((item) => !item.done);
      if (beforeIdx >= 0) {
        setCurrentIdx(beforeIdx);
      }
    }
  }

  return (
    <div className="border border-mono-900 dark:border-mono-200 rounded-xl bg-mono-1000 dark:bg-mono-50 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-mono-100 dark:text-white" />
          <span className="text-sm font-bold text-mono-100 dark:text-white">Pesee de tous les ingredients</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#6B7280] dark:text-mono-700">
            {doneCount}/{totalCount} peses
          </span>
          <button type="button" onClick={onClose} className="p-1 text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-mono-900 dark:bg-mono-300 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 transition-all duration-500 rounded-full" style={{ width: `${(doneCount / totalCount) * 100}%` }} />
      </div>

      {/* Celebration */}
      {celebration && allDone && (
        <div className="flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-pulse">
          <PartyPopper className="w-5 h-5 text-green-500" />
          <span className="text-sm font-bold text-green-600 dark:text-green-400">Tous les ingredients sont peses !</span>
          <PartyPopper className="w-5 h-5 text-green-500" />
        </div>
      )}

      {/* Connection */}
      {!isConnected && (
        <button type="button" onClick={connect} disabled={scaleStatus === 'connecting'}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-mono-100 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 transition-colors">
          {scaleStatus === 'connecting' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
          ) : (
            <><Bluetooth className="w-4 h-4" /> Connecter la balance</>
          )}
        </button>
      )}

      {scaleError && !useSimulation && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{scaleError}</span>
        </div>
      )}

      {/* Ingredient list */}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {items.map((item, idx) => (
          <button
            key={item.index}
            type="button"
            onClick={() => !item.done && setCurrentIdx(idx)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
              idx === currentIdx && !item.done
                ? 'bg-mono-100 dark:bg-white text-white dark:text-black font-semibold'
                : item.done
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-white dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-mono-300'
            }`}
          >
            {item.done ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : idx === currentIdx ? (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-current flex-shrink-0" />
            )}
            <span className="flex-1 truncate">{item.name}</span>
            {item.done && item.measuredQty !== undefined && (
              <span className="text-xs font-mono">{item.measuredQty} {item.unit}</span>
            )}
          </button>
        ))}
      </div>

      {/* Current weighing */}
      {isConnected && current && !allDone && (
        <>
          <div className="text-center text-xs text-[#6B7280] dark:text-mono-700">
            Pesez: <strong className="text-mono-100 dark:text-white">{current.name}</strong>
          </div>

          {/* Weight display */}
          <div className="flex items-center justify-center gap-3 py-4 rounded-lg" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            border: `2px solid ${netWeight > 0 && isStable ? '#10b981' : netWeight > 0 ? '#3b82f6' : '#334155'}`,
          }}>
            <span className={`text-4xl font-black tabular-nums tracking-tight transition-colors ${
              netWeight > 0 && isStable ? 'text-emerald-400' :
              netWeight > 0 ? 'text-teal-300' :
              'text-mono-400'
            }`}>
              {Math.round(netWeight * 1000)}
            </span>
            <span className={`text-sm font-bold ${netWeight > 0 ? 'text-mono-700' : 'text-mono-350'}`}>g</span>
            {netWeight > 0 && isStable && <Check className="w-5 h-5 text-emerald-400" />}
          </div>

          {/* Converted */}
          {convertKgToUnit(netWeight, current.unit) > 0 && (
            <div className="text-center text-sm text-[#6B7280] dark:text-mono-700">
              = <strong className="text-mono-100 dark:text-white">{convertKgToUnit(netWeight, current.unit)}</strong> {current.unit}
            </div>
          )}

          {/* Simulation controls */}
          {useSimulation && (
            <div className="flex items-center justify-center gap-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-medium uppercase tracking-wider">Sim</span>
              <button type="button" onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
                className="w-8 h-8 rounded-lg bg-mono-900 dark:bg-mono-300 hover:bg-[#D1D5DB] dark:hover:bg-mono-350 flex items-center justify-center transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs w-16 text-center tabular-nums">{simWeight.toFixed(3)} kg</span>
              <button type="button" onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
                className="w-8 h-8 rounded-lg bg-mono-900 dark:bg-mono-300 hover:bg-[#D1D5DB] dark:hover:bg-mono-350 flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTare(currentWeight)} disabled={currentWeight <= 0}
              className="flex items-center gap-1 px-2 py-1.5 bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-300 disabled:opacity-30 rounded-lg text-xs font-medium transition-colors">
              <RotateCcw className="w-3 h-3" /> Tare
            </button>
            <button type="button" onClick={handleConfirmCurrent}
              disabled={convertKgToUnit(netWeight, current.unit) <= 0 || !isStable}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-mono-100 dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors">
              <Check className="w-4 h-4" /> Valider et suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Quick Add by Weighing ───────────────────────────────────────────────
interface QuickWeighAddProps {
  ingredients: Ingredient[];
  onAddIngredient: (ingredientId: number, quantity: number) => void;
  onClose: () => void;
  scaleStatus: ScaleStatus;
  reading: ScaleReading | null;
  scaleError: string | null;
  connect: () => void;
  disconnect: () => void;
  useSimulation: boolean;
  simWeight: number;
  setSimWeight: (fn: (w: number) => number) => void;
}

export function QuickWeighAdd({
  ingredients,
  onAddIngredient,
  onClose,
  scaleStatus,
  reading,
  scaleError,
  connect,
  disconnect,
  useSimulation,
  simWeight,
  setSimWeight,
}: QuickWeighAddProps) {
  const [search, setSearch] = useState('');
  const [selectedIng, setSelectedIng] = useState<Ingredient | null>(null);
  const [tare, setTare] = useState(0);
  const [addedCount, setAddedCount] = useState(0);

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const isStable = useSimulation ? true : (reading?.stable ?? false);
  const isConnected = scaleStatus === 'connected' || useSimulation;

  const filtered = search.trim()
    ? ingredients.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : ingredients.slice(0, 20);

  function handleConfirmAdd() {
    if (!selectedIng || netWeight <= 0 || !isStable) return;
    const qty = convertKgToUnit(netWeight, selectedIng.unit);
    onAddIngredient(selectedIng.id, qty);
    setAddedCount(c => c + 1);
    setSelectedIng(null);
    setSearch('');
    setTare(0);
  }

  return (
    <div className="border border-mono-900 dark:border-mono-200 rounded-xl bg-mono-1000 dark:bg-mono-50 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-mono-100 dark:text-white" />
          <span className="text-sm font-bold text-mono-100 dark:text-white">Peser et ajouter</span>
          {addedCount > 0 && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-mono">
              +{addedCount}
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} className="p-1 text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Connection */}
      {!isConnected && (
        <button type="button" onClick={connect} disabled={scaleStatus === 'connecting'}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-mono-100 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 transition-colors">
          {scaleStatus === 'connecting' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
          ) : (
            <><Bluetooth className="w-4 h-4" /> Connecter la balance</>
          )}
        </button>
      )}

      {scaleError && !useSimulation && (
        <div className="flex items-center gap-2 px-2 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{scaleError}</span>
        </div>
      )}

      {/* Step 1: Select ingredient */}
      {!selectedIng ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Rechercher un ingredient..."
            className="input w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="max-h-40 overflow-y-auto space-y-1">
            {filtered.map(ing => (
              <button
                key={ing.id}
                type="button"
                onClick={() => { setSelectedIng(ing); setSearch(''); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
              >
                <span className="text-mono-100 dark:text-white">{ing.name}</span>
                <span className="text-xs text-[#9CA3AF] dark:text-mono-500">{ing.unit}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-xs text-[#9CA3AF] dark:text-mono-500 py-2">Aucun ingredient trouve</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Selected ingredient info */}
          <div className="flex items-center justify-between bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-200 rounded-lg px-3 py-2">
            <div>
              <span className="text-sm font-semibold text-mono-100 dark:text-white">{selectedIng.name}</span>
              <span className="text-xs text-[#9CA3AF] dark:text-mono-500 ml-2">({selectedIng.unit})</span>
            </div>
            <button type="button" onClick={() => setSelectedIng(null)} className="text-xs text-mono-100 dark:text-white hover:text-red-500 font-medium">
              Changer
            </button>
          </div>

          {/* Step 2: Weigh */}
          {isConnected && (
            <>
              <div className="flex items-center justify-center gap-3 py-3 rounded-lg" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                border: `2px solid ${netWeight > 0 && isStable ? '#10b981' : netWeight > 0 ? '#3b82f6' : '#334155'}`,
              }}>
                <span className={`text-3xl font-black tabular-nums tracking-tight transition-colors ${
                  netWeight > 0 && isStable ? 'text-emerald-400' :
                  netWeight > 0 ? 'text-teal-300' :
                  'text-mono-400'
                }`}>
                  {Math.round(netWeight * 1000)}
                </span>
                <span className={`text-sm font-bold ${netWeight > 0 ? 'text-mono-700' : 'text-mono-350'}`}>g</span>
                {netWeight > 0 && isStable && <Check className="w-5 h-5 text-emerald-400" />}
              </div>

              {convertKgToUnit(netWeight, selectedIng.unit) > 0 && (
                <div className="text-center text-sm text-[#6B7280] dark:text-mono-700">
                  = <strong className="text-mono-100 dark:text-white">{convertKgToUnit(netWeight, selectedIng.unit)}</strong> {selectedIng.unit}
                </div>
              )}

              {/* Simulation controls */}
              {useSimulation && (
                <div className="flex items-center justify-center gap-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <span className="text-amber-600 dark:text-amber-400 text-[10px] font-medium uppercase tracking-wider">Sim</span>
                  <button type="button" onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
                    className="w-8 h-8 rounded-lg bg-mono-900 dark:bg-mono-300 hover:bg-[#D1D5DB] dark:hover:bg-mono-350 flex items-center justify-center transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs w-16 text-center tabular-nums">{simWeight.toFixed(3)} kg</span>
                  <button type="button" onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
                    className="w-8 h-8 rounded-lg bg-mono-900 dark:bg-mono-300 hover:bg-[#D1D5DB] dark:hover:bg-mono-350 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setTare(currentWeight)} disabled={currentWeight <= 0}
                  className="flex items-center gap-1 px-2 py-1.5 bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-300 disabled:opacity-30 rounded-lg text-xs font-medium transition-colors">
                  <RotateCcw className="w-3 h-3" /> Tare
                </button>
                <button type="button" onClick={handleConfirmAdd}
                  disabled={convertKgToUnit(netWeight, selectedIng.unit) <= 0 || !isStable}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-mono-100 dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Ajouter a la recette
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
