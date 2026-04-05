import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bluetooth, BluetoothOff, Scale, Check, RotateCcw, Search,
  AlertTriangle, Wifi, Plus, Minus, ArrowLeft, Trash2,
  ClipboardList, Package, ChefHat, Zap, CircleDot, Euro, PlusCircle, X,
  Maximize, Minimize, Camera, RefreshCw, Settings, WifiOff,
} from 'lucide-react';
import { useScale } from '../hooks/useScale';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Restaurant-Id': restaurantId || '1' };
}

type Ingredient = { id: number; name: string; unit: string; category: string; pricePerUnit: number };

type HistoryEntry = {
  ingredientName: string;
  ingredientCategory: string;
  weight: number;
  unit: string;
  timestamp: string;
  status: 'success' | 'error';
};

const CATEGORY_COLORS: Record<string, string> = {
  'Viandes': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Poissons': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Legumes': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Fruits': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Produits laitiers': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Epicerie': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-[#F3F4F6] dark:bg-[#171717]/20 text-[#6B7280] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A]/30';
}

// Scale gives kg, convert to target unit
function convertWeight(kg: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'g': return Math.round(kg * 1000);
    case 'kg': return Math.round(kg * 1000) / 1000;
    case 'l': return Math.round(kg * 100) / 100;
    case 'cl': return Math.round(kg * 1000) / 10;
    case 'ml': return Math.round(kg * 1000 * 10);
    default: return Math.round(kg * 1000) / 1000;
  }
}

// localStorage persistence for history
const HISTORY_KEY = 'weighstation_history';

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 50)));
}

// Steps for the workflow
const STEPS = [
  { num: 1, label: 'Ingredient', icon: Search },
  { num: 2, label: 'Tare', icon: RotateCcw },
  { num: 3, label: 'Peser', icon: Scale },
  { num: 4, label: 'Valider', icon: Check },
];

type DisplayUnit = 'g' | 'kg' | 'L' | 'piece';

export default function WeighStation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    status, reading, error, isSupported, deviceName, scaleType,
    kioskMode, setKioskMode, autoReconnect, setAutoReconnect,
    connect, disconnect,
  } = useScale();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [tare, setTare] = useState(0);
  const [saving, setSaving] = useState(false);
  const [simWeight, setSimWeight] = useState(0);
  const [useSimulation, setUseSimulation] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('g');
  const [quickMode, setQuickMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [prevWeight, setPrevWeight] = useState(0);
  const [flashGreen, setFlashGreen] = useState(false);
  const [connectAnim, setConnectAnim] = useState(false);
  const [showNewIngredient, setShowNewIngredient] = useState(false);
  const [newIngForm, setNewIngForm] = useState({ name: '', category: 'Legumes', unit: 'kg', pricePerUnit: '' });
  const [creatingIngredient, setCreatingIngredient] = useState(false);
  const [ingredientStock, setIngredientStock] = useState<{ stock: number; unit: string; itemId: number } | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCameraPlaceholder, setShowCameraPlaceholder] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load ingredients
  useEffect(() => {
    fetch(`${API}/api/ingredients`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(setIngredients)
      .catch(() => {});
  }, []);

  // Fetch stock when ingredient is selected
  useEffect(() => {
    if (!selected) { setIngredientStock(null); return; }
    setLoadingStock(true);
    fetch(`${API}/api/inventory`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then((items: any[]) => {
        const item = items.find((i: any) => i.ingredientId === selected.id);
        if (item) {
          setIngredientStock({ stock: item.currentStock, unit: item.unit || selected.unit, itemId: item.id });
        } else {
          setIngredientStock(null);
        }
      })
      .catch(() => setIngredientStock(null))
      .finally(() => setLoadingStock(false));
  }, [selected]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Connection animation
  useEffect(() => {
    if (status === 'connecting' || status === 'reconnecting') {
      setConnectAnim(true);
    } else {
      const t = setTimeout(() => setConnectAnim(false), 600);
      return () => clearTimeout(t);
    }
  }, [status]);

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const isStable = useSimulation ? true : (reading?.stable ?? false);

  // Green flash when stable
  useEffect(() => {
    if (netWeight > 0 && isStable && prevWeight !== netWeight) {
      setFlashGreen(true);
      const t = setTimeout(() => setFlashGreen(false), 800);
      setPrevWeight(netWeight);
      return () => clearTimeout(t);
    }
  }, [netWeight, isStable, prevWeight]);

  // Display weight in current display unit
  const displayWeight = useCallback((kg: number): string => {
    if (kg <= 0) return '0';
    if (displayUnit === 'g') return `${Math.round(kg * 1000)}`;
    return `${(Math.round(kg * 1000) / 1000).toFixed(3)}`;
  }, [displayUnit]);

  // Converted weight for selected ingredient
  const netConverted = selected ? convertWeight(netWeight, selected.unit) : (displayUnit === 'g' ? Math.round(netWeight * 1000) : Math.round(netWeight * 1000) / 1000);

  // Current step calculation
  const currentStep = !selected && !quickMode ? 1 : tare === 0 && currentWeight <= 0 ? 2 : netWeight <= 0 ? 3 : 4;

  const filteredIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleTare() {
    setTare(currentWeight);
    showToast('Tare effectuee', 'success');
  }

  function handleReset() {
    setTare(0);
    setSelected(null);
    setQuickMode(false);
    setSearch('');
  }

  async function handleValidate() {
    if (quickMode) {
      const entry: HistoryEntry = {
        ingredientName: 'Pesee rapide',
        ingredientCategory: '',
        weight: netConverted,
        unit: displayUnit,
        timestamp: new Date().toISOString(),
        status: 'success',
      };
      const updated = [entry, ...history].slice(0, 50);
      setHistory(updated);
      saveHistory(updated);
      showToast(`Pesee enregistree : ${netConverted} ${displayUnit}`, 'success');
      setTare(0);
      setQuickMode(false);
      return;
    }

    if (!selected || netConverted <= 0) return;
    setSaving(true);
    try {
      const invRes = await fetch(`${API}/api/inventory`, { headers: authHeaders() });
      let entryStatus: 'success' | 'error' = 'success';
      if (invRes.ok) {
        const invItems = await invRes.json();
        const item = invItems.find((i: any) => i.ingredientId === selected.id);
        if (item) {
          const newStock = Math.max(0, item.currentStock - netConverted);
          await fetch(`${API}/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ currentStock: newStock }),
          });
          setIngredientStock({ stock: newStock, unit: item.unit || selected.unit, itemId: item.id });
          showToast(`Stock mis a jour : -${netConverted} ${selected.unit} de ${selected.name} (reste ${newStock.toFixed(2)} ${selected.unit})`, 'success');
        } else {
          showToast(`Pesee enregistree (pas de stock pour ${selected.name})`, 'info');
        }
      }
      const entry: HistoryEntry = {
        ingredientName: selected.name,
        ingredientCategory: selected.category,
        weight: netConverted,
        unit: selected.unit,
        timestamp: new Date().toISOString(),
        status: entryStatus,
      };
      const updated = [entry, ...history].slice(0, 50);
      setHistory(updated);
      saveHistory(updated);
      setTare(0);
      setSelected(null);
      setSearch('');
    } catch {
      showToast('Erreur sauvegarde', 'error');
      const entry: HistoryEntry = {
        ingredientName: selected.name,
        ingredientCategory: selected.category,
        weight: netConverted,
        unit: selected.unit,
        timestamp: new Date().toISOString(),
        status: 'error',
      };
      const updated = [entry, ...history].slice(0, 50);
      setHistory(updated);
      saveHistory(updated);
    }
    setSaving(false);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    showToast('Historique efface', 'success');
  }

  function selectIngredient(ing: Ingredient) {
    setSelected(ing);
    setTare(0);
    setSearch('');
    setShowDropdown(false);
    setQuickMode(false);
  }

  // Daily stats
  const todayStats = (() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayEntries = history.filter(e => e.timestamp.slice(0, 10) === today && e.status === 'success');
    const totalWeighs = todayEntries.length;
    const totalKg = todayEntries.reduce((sum, e) => {
      const w = e.weight;
      const u = e.unit.toLowerCase();
      if (u === 'g') return sum + w / 1000;
      if (u === 'kg') return sum + w;
      if (u === 'l') return sum + w;
      if (u === 'cl') return sum + w / 100;
      if (u === 'ml') return sum + w / 1000;
      return sum + w;
    }, 0);
    return { totalWeighs, totalKg: Math.round(totalKg * 100) / 100 };
  })();

  const isConnected = status === 'connected' || useSimulation;
  const weightForDisplay = quickMode || !selected
    ? displayWeight(netWeight)
    : `${netConverted}`;
  const unitForDisplay = quickMode || !selected ? displayUnit : (selected?.unit ?? displayUnit);

  // Status label helper
  const statusLabel = (() => {
    switch (status) {
      case 'connected': return 'Connecte';
      case 'connecting': return 'Connexion...';
      case 'reconnecting': return 'Reconnexion...';
      case 'error': return 'Erreur';
      case 'unsupported': return 'Non supporte';
      default: return 'Deconnecte';
    }
  })();

  const statusDotClass = (() => {
    switch (status) {
      case 'connected': return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
      case 'connecting':
      case 'reconnecting': return 'bg-teal-400 animate-pulse';
      case 'error':
      case 'unsupported': return 'bg-red-400';
      default: return 'bg-[#F3F4F6] dark:bg-[#171717]';
    }
  })();

  // Kiosk: font size multiplier
  const kf = kioskMode ? 1.3 : 1;

  return (
    <div className={`min-h-screen lg:h-screen bg-gradient-to-b from-white dark:from-black via-white dark:via-black to-white dark:to-black text-white flex flex-col select-none lg:overflow-hidden ${kioskMode ? 'kiosk-mode' : ''}`}>

      {/* ===== TOP BAR ===== */}
      <header className={`flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 bg-white dark:bg-black/80 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 backdrop-blur-sm ${kioskMode ? 'py-1.5' : 'py-2 sm:py-3'}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          {!kioskMode && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[48px] bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-xl text-[#111111] dark:text-white font-medium text-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <Scale className={`text-emerald-400 ${kioskMode ? 'w-7 h-7' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
            <span className={`font-bold text-[#111111] dark:text-white tracking-tight ${kioskMode ? 'text-xl' : 'text-base sm:text-lg'}`}>Station Balance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection status with device name */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${statusDotClass}`} />
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373] hidden sm:inline">
              {useSimulation ? 'Mode Simule' : statusLabel}
              {status === 'connected' && deviceName && !useSimulation && (
                <span className="ml-1 text-emerald-400">({deviceName})</span>
              )}
            </span>
          </div>

          {/* Mode toggle: Bluetooth / Simulation */}
          <button
            onClick={() => setUseSimulation(s => !s)}
            className={`px-3 py-2.5 min-h-[48px] rounded-xl text-sm font-medium transition-all active:scale-95 ${
              useSimulation ? 'bg-amber-600/80 text-[#111111] dark:text-white border border-amber-500/50' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50'
            }`}
          >
            {useSimulation ? 'Mode Simule' : 'Mode Bluetooth'}
          </button>

          {/* Connect / Disconnect button */}
          {!useSimulation && (
            <button
              onClick={status === 'connected' ? disconnect : connect}
              disabled={status === 'connecting' || status === 'reconnecting'}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-xl font-medium text-sm transition-all active:scale-95 ${
                connectAnim ? 'animate-pulse' : ''
              } ${
                status === 'connected' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                status === 'connecting' || status === 'reconnecting' ? 'bg-teal-700 text-[#111111] dark:text-white cursor-wait' :
                status === 'error' || status === 'unsupported' ? 'bg-red-600 hover:bg-red-500 text-white' :
                'bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black'
              }`}
            >
              {status === 'connected' ? <Wifi className="w-5 h-5" /> :
               status === 'connecting' || status === 'reconnecting' ? <Bluetooth className="w-5 h-5 animate-spin" /> :
               <BluetoothOff className="w-5 h-5" />}
              <span className="hidden sm:inline">
                {status === 'connected' ? 'Deconnecter' :
                 status === 'connecting' ? 'Connexion...' :
                 status === 'reconnecting' ? 'Reconnexion...' :
                 'Connecter une balance'}
              </span>
            </button>
          )}

          {/* Kiosk mode toggle */}
          <button
            onClick={() => setKioskMode(k => !k)}
            className={`p-2.5 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl transition-all active:scale-95 ${
              kioskMode
                ? 'bg-teal-600 text-white border border-teal-500/50'
                : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50'
            }`}
            title={kioskMode ? 'Quitter Mode Kiosque' : 'Mode Kiosque'}
          >
            {kioskMode ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Settings gear */}
          <button
            onClick={() => setShowSettings(s => !s)}
            className="p-2.5 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50 transition-all active:scale-95"
            title="Parametres"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="px-4 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/90 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReconnect}
              onChange={e => setAutoReconnect(e.target.checked)}
              className="w-5 h-5 accent-teal-500 rounded"
            />
            <span className="text-[#6B7280] dark:text-[#A3A3A3]">Reconnexion auto Bluetooth</span>
          </label>
          <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#A3A3A3]">
            <Bluetooth className="w-4 h-4" />
            <span>Type : {scaleType === 'mi-scale' ? 'Mi Scale 2' : scaleType === 'generic' ? 'Balance BLE Standard' : 'Non detecte'}</span>
          </div>
          {!isSupported && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle className="w-4 h-4" />
              Web Bluetooth non supporte. Utilisez Chrome (Android/Desktop) en HTTPS.
            </div>
          )}
          <button
            onClick={() => setShowSettings(false)}
            className="ml-auto p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
          </button>
        </div>
      )}

      {/* Error / reconnecting banner */}
      {error && !useSimulation && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-red-900/40 text-red-300 text-sm border-b border-red-800/50">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
          {status === 'error' && (
            <button
              onClick={connect}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-800/60 hover:bg-red-700/60 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reessayer
            </button>
          )}
        </div>
      )}
      {status === 'reconnecting' && !useSimulation && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-teal-900/40 text-teal-300 text-sm border-b border-teal-800/50">
          <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
          Reconnexion en cours... La balance a ete deconnectee.
        </div>
      )}

      {/* Camera / barcode placeholder modal */}
      {showCameraPlaceholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCameraPlaceholder(false)}>
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 max-w-sm mx-4 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]" onClick={e => e.stopPropagation()}>
            <Camera className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-2">Scanner un code-barres</h3>
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mb-4">
              Cette fonctionnalite utilisera la camera de votre tablette pour scanner les codes-barres
              des ingredients et les selectionner automatiquement.
            </p>
            <p className="text-xs text-amber-500 mb-4 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Disponible dans une prochaine mise a jour
            </p>
            <button
              onClick={() => setShowCameraPlaceholder(false)}
              className="px-6 py-3 min-h-[48px] bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition-all active:scale-95 w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===== STEP INDICATOR (hidden in kiosk) ===== */}
      {!quickMode && !kioskMode && (
        <div className="flex items-center justify-center gap-1 px-4 py-3 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
          {STEPS.map((step, idx) => {
            const active = currentStep === step.num;
            const done = currentStep > step.num;
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  active ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' :
                  done ? 'bg-[#F3F4F6] dark:bg-[#171717]/40 text-emerald-400' :
                  'bg-[#FAFAFA]/30 dark:bg-[#0A0A0A]/30 text-[#6B7280] dark:text-[#A3A3A3]'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
                  <span className="text-xs font-bold sm:hidden">{step.num}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 rounded transition-colors ${done ? 'bg-emerald-500/60' : 'bg-[#F3F4F6] dark:bg-[#171717]/40'}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

        {/* LEFT PANEL: Ingredient selector + Quick actions (hidden in kiosk) */}
        {!kioskMode && (
          <div className="max-h-[50vh] lg:max-h-none lg:w-80 xl:w-96 bg-white dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-col overflow-hidden shrink-0">

            {/* Quick actions */}
            <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex overflow-x-auto sm:grid sm:grid-cols-5 gap-2 scrollbar-none">
              <button
                onClick={() => { setQuickMode(true); setSelected(null); setSearch(''); }}
                className={`flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium transition-all active:scale-95 ${
                  quickMode ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40'
                }`}
              >
                <Zap className="w-5 h-5" />
                Rapide
              </button>
              <button
                onClick={() => setShowNewIngredient(true)}
                className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/40 border border-emerald-600/30 transition-all active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                Nouveau
              </button>
              <button
                onClick={() => setShowCameraPlaceholder(true)}
                className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
              >
                <Camera className="w-5 h-5" />
                Scanner
              </button>
              <button
                onClick={() => navigate('/inventory')}
                className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
              >
                <Package className="w-5 h-5" />
                Stock
              </button>
              <button
                onClick={() => navigate('/recipes')}
                className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
              >
                <ChefHat className="w-5 h-5" />
                Recettes
              </button>
            </div>

            {/* New ingredient mini form */}
            {showNewIngredient && (
              <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 bg-emerald-900/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-emerald-300">Nouvel ingredient</p>
                  <button onClick={() => setShowNewIngredient(false)} className="p-1 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-colors">
                    <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={newIngForm.name}
                    onChange={e => setNewIngForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newIngForm.category}
                      onChange={e => setNewIngForm(f => ({ ...f, category: e.target.value }))}
                      className="px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                    >
                      {['Viandes', 'Poissons', 'Legumes', 'Fruits', 'Produits laitiers', 'Epicerie', 'Autres'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <select
                      value={newIngForm.unit}
                      onChange={e => setNewIngForm(f => ({ ...f, unit: e.target.value }))}
                      className="px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                    >
                      {['kg', 'g', 'L', 'cl', 'ml', 'piece'].map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prix / unite (EUR) *"
                    value={newIngForm.pricePerUnit}
                    onChange={e => setNewIngForm(f => ({ ...f, pricePerUnit: e.target.value }))}
                    className="w-full px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                  />
                  <button
                    disabled={!newIngForm.name.trim() || !newIngForm.pricePerUnit || creatingIngredient}
                    onClick={async () => {
                      setCreatingIngredient(true);
                      try {
                        const res = await fetch(`${API}/api/ingredients`, {
                          method: 'POST',
                          headers: authHeaders(),
                          body: JSON.stringify({
                            name: newIngForm.name.trim(),
                            category: newIngForm.category,
                            unit: newIngForm.unit,
                            pricePerUnit: parseFloat(newIngForm.pricePerUnit),
                            allergens: [],
                          }),
                        });
                        if (!res.ok) throw new Error('Erreur creation');
                        const created = await res.json();
                        const newIng: Ingredient = { id: created.id, name: created.name, unit: created.unit, category: created.category, pricePerUnit: created.pricePerUnit };
                        setIngredients(prev => [...prev, newIng]);
                        selectIngredient(newIng);
                        setShowNewIngredient(false);
                        setNewIngForm({ name: '', category: 'Legumes', unit: 'kg', pricePerUnit: '' });
                        showToast(`Ingredient "${created.name}" cree et selectionne`, 'success');
                      } catch {
                        showToast('Erreur lors de la creation de l\'ingredient', 'error');
                      }
                      setCreatingIngredient(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-medium text-sm transition-all active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {creatingIngredient ? 'Creation...' : 'Creer et selectionner'}
                  </button>
                </div>
              </div>
            )}

            {/* Ingredient search */}
            <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60" ref={dropdownRef}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Rechercher un ingredient..."
                  className="w-full pl-10 pr-3 py-3 min-h-[48px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-xl text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                />
              </div>
            </div>

            {/* Ingredient list */}
            <div className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5">
              {(showDropdown && search ? filteredIngredients : ingredients).map(ing => (
                <button
                  key={ing.id}
                  onClick={() => selectIngredient(ing)}
                  className={`w-full flex items-center justify-between px-3 py-3 min-h-[48px] rounded-xl text-left transition-all active:scale-[0.98] ${
                    selected?.id === ing.id
                      ? 'bg-emerald-600/30 text-white border border-emerald-500/40'
                      : 'hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]/60 text-[#6B7280] dark:text-[#A3A3A3] border border-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{ing.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(ing.category)}`}>
                        {ing.category}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{ing.unit}</span>
                      <span className="text-[10px] text-teal-400">{(ing.pricePerUnit ?? 0).toFixed(2)} EUR/{ing.unit === 'g' ? 'kg' : ing.unit === 'cl' ? 'L' : ing.unit === 'ml' ? 'L' : ing.unit}</span>
                    </div>
                  </div>
                  {selected?.id === ing.id && (
                    <CircleDot className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
              {filteredIngredients.length === 0 && search && (
                <p className="text-center text-[#6B7280] dark:text-[#A3A3A3] text-sm py-8">Aucun resultat</p>
              )}
            </div>
          </div>
        )}

        {/* CENTER: Scale display */}
        <div className={`flex-1 flex flex-col items-center justify-center gap-3 sm:gap-5 px-3 sm:px-4 py-4 sm:py-6 relative overflow-hidden ${kioskMode ? 'gap-6' : ''}`}>

          {/* Kiosk: quick ingredient selector (inline) */}
          {kioskMode && (
            <div className="w-full max-w-2xl flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Rechercher un ingredient..."
                  className="w-full pl-12 pr-4 py-4 min-h-[56px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-2xl text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] text-lg focus:outline-none focus:ring-2 focus:ring-teal-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                />
                {/* Kiosk dropdown */}
                {showDropdown && search && filteredIngredients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-20">
                    {filteredIngredients.slice(0, 8).map(ing => (
                      <button
                        key={ing.id}
                        onClick={() => { selectIngredient(ing); setShowDropdown(false); }}
                        className="w-full flex items-center justify-between px-4 py-4 min-h-[56px] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-left transition-all border-b border-[#E5E7EB] dark:border-[#1A1A1A]/30 last:border-b-0"
                      >
                        <div>
                          <p className="font-semibold text-base text-[#111111] dark:text-white">{ing.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(ing.category)}`}>{ing.category}</span>
                        </div>
                        <span className="text-teal-400 font-bold text-lg">{(ing.pricePerUnit ?? 0).toFixed(2)} EUR</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => { setQuickMode(true); setSelected(null); setSearch(''); }}
                className={`px-5 py-4 min-h-[56px] rounded-2xl font-semibold text-base transition-all active:scale-95 ${
                  quickMode ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/40'
                }`}
              >
                <Zap className="w-6 h-6" />
              </button>
              <button
                onClick={() => setShowCameraPlaceholder(true)}
                className="px-5 py-4 min-h-[56px] rounded-2xl bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Selected ingredient label */}
          <div className={`text-center flex flex-col items-center justify-center ${kioskMode ? 'min-h-[40px]' : 'min-h-[60px]'}`}>
            {quickMode ? (
              <div>
                <p className={`text-amber-400 uppercase tracking-widest font-medium ${kioskMode ? 'text-base' : 'text-sm'}`}>Pesee rapide</p>
                {!kioskMode && <p className="text-[#9CA3AF] dark:text-[#737373] text-xs mt-1">Pesez sans selectionner d'ingredient</p>}
              </div>
            ) : selected ? (
              <div>
                {!kioskMode && <p className="text-[#9CA3AF] dark:text-[#737373] text-[10px] uppercase tracking-[0.2em]">Ingredient selectionne</p>}
                <p className={`font-bold text-[#111111] dark:text-white mt-0.5 ${kioskMode ? 'text-3xl' : 'text-2xl'}`}>{selected.name}</p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className={`inline-block px-2 py-0.5 rounded border ${getCategoryColor(selected.category)} ${kioskMode ? 'text-xs' : 'text-[10px]'}`}>
                    {selected.category}
                  </span>
                  <span className={`text-teal-400 font-medium ${kioskMode ? 'text-sm' : 'text-xs'}`}>
                    {(selected.pricePerUnit ?? 0).toFixed(2)} EUR/{selected.unit === 'g' ? 'kg' : selected.unit === 'cl' ? 'L' : selected.unit === 'ml' ? 'L' : selected.unit}
                  </span>
                </div>
                {/* Current stock level */}
                <div className="mt-1.5">
                  {loadingStock ? (
                    <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">Chargement stock...</span>
                  ) : ingredientStock ? (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      ingredientStock.stock <= 0 ? 'bg-red-900/40 text-red-400' :
                      ingredientStock.stock < 2 ? 'bg-amber-900/40 text-amber-400' :
                      'bg-emerald-900/30 text-emerald-400'
                    }`}>
                      Stock : {ingredientStock.stock.toFixed(2)} {ingredientStock.unit}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">Pas de stock enregistre</span>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className={`text-[#6B7280] dark:text-[#A3A3A3] px-2 text-center ${kioskMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                  {kioskMode ? 'Recherchez un ingredient ci-dessus' : 'Selectionnez un ingredient ou utilisez la pesee rapide'}
                </p>
              </div>
            )}
          </div>

          {/* ===== BIG WEIGHT DISPLAY (LCD-style) ===== */}
          <div
            className={`relative w-full rounded-2xl flex flex-col items-center justify-center transition-all duration-500 ${
              flashGreen ? 'shadow-[0_0_80px_rgba(52,211,153,0.3)]' : ''
            } ${kioskMode ? 'max-w-2xl aspect-[2.5/1]' : 'max-w-full sm:max-w-md aspect-[2.2/1] sm:aspect-[2/1]'}`}
            style={{
              background: 'linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)',
              border: `2px solid ${
                netWeight > 0 && isStable ? '#10b981' :
                netWeight > 0 ? '#3b82f6' :
                '#1e293b'
              }`,
              boxShadow: netWeight > 0 && isStable
                ? '0 0 60px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.03)'
                : netWeight > 0
                ? '0 0 40px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.03)'
                : 'inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            {/* Scan lines effect */}
            <div className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
            />

            {/* Bluetooth connection indicator inside display */}
            <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5">
              {useSimulation ? (
                <span className="text-amber-400/60 text-[10px] font-medium uppercase tracking-wider">SIM</span>
              ) : status === 'connected' ? (
                <Bluetooth className="w-3.5 h-3.5 text-teal-400/60" />
              ) : status === 'reconnecting' ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400/60 animate-spin" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-[#6B7280]/40" />
              )}
            </div>

            {/* Weight number */}
            <div className="relative z-10 flex items-baseline gap-2">
              <span
                className={`font-black tabular-nums tracking-tight transition-all duration-300 ${
                  netWeight > 0 && isStable ? 'text-emerald-400' :
                  netWeight > 0 ? 'text-teal-300' :
                  'text-[#6B7280] dark:text-[#A3A3A3]'
                }`}
                style={{ fontSize: kioskMode ? 'clamp(5rem, 14vw, 9rem)' : 'clamp(3.5rem, 10vw, 6rem)', lineHeight: 1 }}
              >
                {netWeight <= 0 ? '0' : weightForDisplay}
              </span>
              <span className={`font-bold transition-colors duration-300 text-[#9CA3AF] dark:text-[#737373] ${kioskMode ? 'text-4xl' : 'text-2xl'}`}>
                {unitForDisplay}
              </span>
            </div>

            {/* Stability indicator */}
            <div className={`relative z-10 mt-2 flex items-center ${kioskMode ? 'h-7' : 'h-5'}`}>
              {netWeight > 0 && isStable && (
                <span className={`flex items-center gap-1.5 text-emerald-400 font-medium animate-in fade-in duration-300 ${kioskMode ? 'text-base' : 'text-sm'}`}>
                  <Check className={kioskMode ? 'w-5 h-5' : 'w-4 h-4'} /> Stable
                </span>
              )}
              {netWeight > 0 && !isStable && (
                <span className={`flex items-center gap-1.5 text-teal-400 font-medium animate-pulse ${kioskMode ? 'text-base' : 'text-sm'}`}>
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  Mesure en cours
                </span>
              )}
            </div>

            {/* Tare info */}
            {tare > 0 && (
              <p className="relative z-10 text-xs text-amber-400/70 mt-1">Tare : {(tare * 1000).toFixed(0)} g</p>
            )}
          </div>

          {/* Real-time estimated value */}
          {selected && netConverted > 0 && selected.pricePerUnit > 0 && (
            <div className={`flex items-center gap-2 px-5 py-2.5 bg-emerald-900/30 border border-emerald-500/30 rounded-2xl ${kioskMode ? 'px-8 py-4' : ''}`}>
              <Euro className={kioskMode ? 'w-7 h-7 text-emerald-400' : 'w-5 h-5 text-emerald-400'} />
              <span className={`font-bold text-emerald-400 tabular-nums ${kioskMode ? 'text-3xl' : 'text-2xl'}`}>
                Valeur : {(() => {
                  const unit = selected.unit.toLowerCase();
                  if (unit === 'g') return (netConverted / 1000 * selected.pricePerUnit).toFixed(2);
                  if (unit === 'cl') return (netConverted / 100 * selected.pricePerUnit).toFixed(2);
                  if (unit === 'ml') return (netConverted / 1000 * selected.pricePerUnit).toFixed(2);
                  return (netConverted * selected.pricePerUnit).toFixed(2);
                })()} EUR
              </span>
            </div>
          )}

          {/* Unit toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]/40">
            {(['g', 'kg', 'L', 'piece'] as DisplayUnit[]).map(u => (
              <button
                key={u}
                onClick={() => setDisplayUnit(u)}
                className={`px-3 sm:px-5 py-2 rounded-lg font-bold transition-all ${kioskMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'} ${
                  displayUnit === u
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Simulation controls */}
          {useSimulation && (
            <div className={`flex items-center gap-3 sm:gap-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 px-3 sm:px-5 py-3 rounded-2xl border border-amber-600/30 ${kioskMode ? 'gap-6 px-8 py-4' : ''}`}>
              <p className={`text-amber-400 font-medium uppercase tracking-wider ${kioskMode ? 'text-sm' : 'text-xs'}`}>Sim</p>
              <button
                onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
                className={`rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] flex items-center justify-center active:scale-90 transition-all ${kioskMode ? 'w-16 h-16' : 'w-12 h-12'}`}
              >
                <Minus className={kioskMode ? 'w-7 h-7' : 'w-5 h-5'} />
              </button>
              <span className={`text-[#111111] dark:text-white font-mono text-center tabular-nums ${kioskMode ? 'w-32 text-2xl' : 'w-24 text-lg'}`}>{simWeight.toFixed(3)} kg</span>
              <button
                onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
                className={`rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] flex items-center justify-center active:scale-90 transition-all ${kioskMode ? 'w-16 h-16' : 'w-12 h-12'}`}
              >
                <Plus className={kioskMode ? 'w-7 h-7' : 'w-5 h-5'} />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 w-full px-1 ${kioskMode ? 'max-w-2xl gap-4' : 'max-w-lg'}`}>
            <button
              onClick={handleTare}
              disabled={currentWeight <= 0}
              className={`flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-semibold text-[#111111] dark:text-white transition-all active:scale-95 border border-[#E5E7EB] dark:border-[#1A1A1A]/50 ${
                kioskMode ? 'px-8 py-5 min-h-[64px] text-lg' : 'px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] text-sm sm:text-base'
              }`}
            >
              <RotateCcw className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} /> Tare
            </button>

            <button
              onClick={handleValidate}
              disabled={(!selected && !quickMode) || netConverted <= 0 || saving}
              className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-900/30 border border-emerald-500/30 ${
                kioskMode ? 'px-14 py-5 min-h-[64px] text-2xl' : 'px-6 sm:px-10 py-4 min-h-[56px] text-base sm:text-lg'
              }`}
            >
              <Check className={kioskMode ? 'w-8 h-8' : 'w-6 h-6'} />
              {saving ? 'Sauvegarde...' : 'Valider'}
            </button>

            <button
              onClick={handleReset}
              className={`flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-2xl font-semibold text-[#111111] dark:text-white transition-all active:scale-95 border border-[#E5E7EB] dark:border-[#1A1A1A]/50 ${
                kioskMode ? 'px-8 py-5 min-h-[64px] text-lg' : 'px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] text-sm sm:text-base'
              }`}
            >
              <RotateCcw className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} /> Reset
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: History log (hidden in kiosk) */}
        {!kioskMode && (
          <div className="max-h-[40vh] lg:max-h-none lg:w-80 xl:w-96 bg-white dark:bg-black/40 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-col overflow-hidden shrink-0">

            {/* History header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                <p className="text-sm font-semibold text-[#6B7280] dark:text-[#A3A3A3]">Historique</p>
                {history.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]">{history.length}</span>
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 px-3 py-2 min-h-[48px] text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Effacer
                </button>
              )}
            </div>

            {/* History table/list */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] dark:text-[#737373]">
                  <Scale className="w-8 h-8 mb-2" />
                  <p className="text-sm">Aucune pesee</p>
                </div>
              )}
              {history.map((entry, i) => (
                <div
                  key={`${entry.timestamp}-${i}`}
                  className={`rounded-xl px-3 py-2.5 border transition-all ${
                    entry.status === 'error'
                      ? 'bg-red-900/10 border-red-800/30'
                      : 'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border-[#E5E7EB] dark:border-[#1A1A1A]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[#111111] dark:text-white text-sm font-medium truncate">{entry.ingredientName}</p>
                      {entry.ingredientCategory && (
                        <span className={`inline-block text-[9px] px-1 py-0.5 rounded border mt-0.5 ${getCategoryColor(entry.ingredientCategory)}`}>
                          {entry.ingredientCategory}
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-bold tabular-nums ${entry.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {entry.weight} {entry.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[#6B7280] dark:text-[#A3A3A3] text-[10px]">
                      {new Date(entry.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      entry.status === 'error' ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'
                    }`}>
                      {entry.status === 'error' ? 'Erreur' : 'OK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily stats footer */}
            <div className="px-4 py-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]/60 bg-[#FAFAFA]/60 dark:bg-[#0A0A0A]/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] dark:text-[#737373]">Aujourd'hui</span>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-medium">{todayStats.totalWeighs} pesee{todayStats.totalWeighs !== 1 ? 's' : ''}</span>
                  <span className="text-teal-400 font-medium">{todayStats.totalKg} kg total</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
