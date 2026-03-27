import { useState, useCallback } from 'react';
import { Bluetooth, BluetoothOff, Plus, Minus, RotateCcw, Check, Wifi, AlertTriangle, RefreshCw, Euro } from 'lucide-react';
import { useScale } from '../hooks/useScale';
import Modal from './Modal';

type DisplayUnit = 'g' | 'kg' | 'L' | 'pièce';

interface WeighModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientId: number;
  ingredientName: string;
  currentStock: number;
  unit: string;
  pricePerUnit: number;
  /** Called with { weight, mode } where mode is 'set' or 'add' */
  onComplete: (data: { weight: number; mode: 'set' | 'add' }) => void;
}

export default function WeighModal({ isOpen, onClose, ingredientName, currentStock, unit, pricePerUnit, onComplete }: WeighModalProps) {
  const { status, reading, error, connect, disconnect } = useScale();

  const [tare, setTare] = useState(0);
  const [simWeight, setSimWeight] = useState(0);
  const [useSimulation, setUseSimulation] = useState(false);
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('g');

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const isStable = useSimulation ? true : (reading?.stable ?? false);
  const isConnected = status === 'connected' || useSimulation;

  // Convert kg to display unit
  const displayWeight = useCallback((kg: number): string => {
    if (kg <= 0) return '0';
    if (displayUnit === 'g') return `${Math.round(kg * 1000)}`;
    return `${(Math.round(kg * 1000) / 1000).toFixed(3)}`;
  }, [displayUnit]);

  // Convert net weight to ingredient unit
  function convertToIngredientUnit(kg: number): number {
    switch (unit.toLowerCase()) {
      case 'g': return Math.round(kg * 1000);
      case 'kg': return Math.round(kg * 1000) / 1000;
      case 'l': return Math.round(kg * 100) / 100;
      case 'cl': return Math.round(kg * 1000) / 10;
      case 'ml': return Math.round(kg * 1000 * 10);
      default: return Math.round(kg * 1000) / 1000;
    }
  }

  const weightInUnit = convertToIngredientUnit(netWeight);
  const newStockAdd = currentStock + weightInUnit;

  function handleTare() {
    setTare(currentWeight);
  }

  function handleSetStock() {
    if (weightInUnit <= 0) return;
    onComplete({ weight: weightInUnit, mode: 'set' });
    resetState();
  }

  function handleAddStock() {
    if (weightInUnit <= 0) return;
    onComplete({ weight: weightInUnit, mode: 'add' });
    resetState();
  }

  function resetState() {
    setTare(0);
    setSimWeight(0);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Peser avec la balance — ${ingredientName}`}
      className="max-sm:!rounded-none max-sm:!my-0 max-sm:!max-w-none max-sm:min-h-screen"
      contentClassName="max-sm:max-h-none max-sm:!max-h-[unset] max-sm:overflow-y-auto max-sm:flex-1"
    >
      <div className="space-y-5">

        {/* Ingredient info */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ingrédient</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{ingredientName}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              Prix unitaire : {pricePerUnit.toFixed(2)} €/{unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Stock actuel</p>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{currentStock} {unit}</p>
          </div>
        </div>

        {/* Connection controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseSimulation(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              useSimulation
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
            }`}
          >
            {useSimulation ? 'Simulation' : 'Balance'}
          </button>

          {!useSimulation && (
            <button
              onClick={status === 'connected' ? disconnect : connect}
              disabled={status === 'connecting'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === 'connected'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                  : status === 'connecting'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {status === 'connected' ? (
                <><Wifi className="w-4 h-4" /> Connectée</>
              ) : status === 'connecting' ? (
                <><Bluetooth className="w-4 h-4 animate-spin" /> Connexion...</>
              ) : (
                <><BluetoothOff className="w-4 h-4" /> Connecter</>
              )}
            </button>
          )}

          {/* Status dot */}
          <div className={`w-2.5 h-2.5 rounded-full ${
            isConnected ? 'bg-green-500' : status === 'connecting' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'
          }`} />
        </div>

        {/* Error */}
        {error && !useSimulation && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* LCD Weight Display */}
        <div
          className="relative rounded-xl flex flex-col items-center justify-center py-8"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            border: `2px solid ${netWeight > 0 && isStable ? '#10b981' : netWeight > 0 ? '#3b82f6' : '#334155'}`,
          }}
        >
          {/* Scan lines */}
          <div className="absolute inset-0 rounded-xl opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
          />

          <div className="relative z-10 flex items-baseline gap-2">
            <span className={`text-6xl sm:text-5xl font-black tabular-nums tracking-tight transition-colors ${
              netWeight > 0 && isStable ? 'text-emerald-400' :
              netWeight > 0 ? 'text-blue-300' :
              'text-slate-600'
            }`}>
              {displayWeight(netWeight)}
            </span>
            <span className={`text-xl font-bold ${netWeight > 0 ? 'text-slate-400' : 'text-slate-700'}`}>
              {displayUnit}
            </span>
          </div>

          {netWeight > 0 && isStable && (
            <span className="relative z-10 flex items-center gap-1 text-emerald-400 text-sm font-medium mt-2">
              <Check className="w-4 h-4" /> Stable
            </span>
          )}

          {tare > 0 && (
            <p className="relative z-10 text-xs text-amber-400/70 mt-1">Tare : {(tare * 1000).toFixed(0)} g</p>
          )}
        </div>

        {/* Real-time estimated value */}
        {weightInUnit > 0 && pricePerUnit > 0 && (
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <Euro className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              Valeur estimée : {(weightInUnit * pricePerUnit).toFixed(2)} €
            </span>
          </div>
        )}

        {/* Controls row: unit toggle + tare */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Unit toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
            {(['g', 'kg', 'L', 'pièce'] as DisplayUnit[]).map(u => (
              <button
                key={u}
                onClick={() => setDisplayUnit(u)}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${
                  displayUnit === u
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Tare button */}
          <button
            onClick={handleTare}
            disabled={currentWeight <= 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Tare
          </button>
        </div>

        {/* Simulation controls */}
        {useSimulation && (
          <div className="flex items-center justify-center gap-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
            <span className="text-amber-600 dark:text-amber-400 text-xs font-medium uppercase tracking-wider">Simulation</span>
            <button
              onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
              className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="font-mono text-sm w-20 text-center tabular-nums">{simWeight.toFixed(3)} kg</span>
            <button
              onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
              className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Stock calculation preview */}
        {weightInUnit > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 text-sm">
            <p className="text-blue-700 dark:text-blue-300 font-medium break-words leading-relaxed">
              Stock actuel : {currentStock} {unit}
              <span className="max-sm:block"> + Pesée : {weightInUnit} {unit}</span>
              <span className="max-sm:block"> = <strong>Nouveau stock : {newStockAdd.toFixed(2)} {unit}</strong></span>
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleSetStock}
            disabled={weightInUnit <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Mettre à jour le stock
          </button>
          <button
            onClick={handleAddStock}
            disabled={weightInUnit <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter au stock
          </button>
        </div>
      </div>
    </Modal>
  );
}
