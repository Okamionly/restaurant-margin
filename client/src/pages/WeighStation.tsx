import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bluetooth, BluetoothOff, Scale, Check, RotateCcw, Search,
  AlertTriangle, Wifi, Plus, Minus, ArrowLeft, Trash2,
  ClipboardList, Package, ChefHat, Zap, CircleDot, Euro, PlusCircle, X,
} from 'lucide-react';
import { useScale } from '../hooks/useScale';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
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
  'Poissons': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Legumes': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Fruits': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Produits laitiers': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Epicerie': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/30';
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

type DisplayUnit = 'g' | 'kg' | 'L' | 'pièce';

export default function WeighStation() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { status, reading, error, connect, disconnect } = useScale();

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
  const [newIngForm, setNewIngForm] = useState({ name: '', category: 'Légumes', unit: 'kg', pricePerUnit: '' });
  const [creatingIngredient, setCreatingIngredient] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load ingredients
  useEffect(() => {
    fetch(`${API}/api/ingredients`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(setIngredients)
      .catch(() => {});
  }, []);

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
    if (status === 'connecting') {
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
      // Quick mode: just log it
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
          // Update existing inventory item
          const newStock = item.currentStock + netConverted;
          await fetch(`${API}/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ currentStock: newStock }),
          });
          const valueStr = selected.pricePerUnit > 0 ? ` (${(netConverted * selected.pricePerUnit).toFixed(2)} €)` : '';
          showToast(`Ajouté à l'inventaire : ${netConverted} ${selected.unit} de ${selected.name}${valueStr}`, 'success');
        } else {
          // Create new inventory entry via POST
          const createRes = await fetch(`${API}/api/inventory`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({
              ingredientId: selected.id,
              currentStock: netConverted,
              minStock: 0,
              unit: selected.unit,
            }),
          });
          if (createRes.ok) {
            const newValueStr = selected.pricePerUnit > 0 ? ` (${(netConverted * selected.pricePerUnit).toFixed(2)} €)` : '';
            showToast(`Ajouté à l'inventaire : ${netConverted} ${selected.unit} de ${selected.name}${newValueStr}`, 'success');
          } else {
            showToast('Erreur lors de la création dans l\'inventaire', 'error');
            entryStatus = 'error';
          }
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
      // Convert back to kg for summary
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

  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col select-none lg:overflow-hidden">

      {/* ===== TOP BAR ===== */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/80 border-b border-slate-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 min-h-[48px] bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 font-medium text-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour</span>
          </button>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">Station Balance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              status === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' :
              status === 'connecting' ? 'bg-blue-400 animate-pulse' :
              status === 'error' ? 'bg-red-400' :
              'bg-slate-500'
            }`} />
            <span className="text-xs text-slate-400 hidden sm:inline">
              {status === 'connected' ? 'Connecte' :
               status === 'connecting' ? 'Connexion...' :
               status === 'error' ? 'Erreur' : 'Deconnecte'}
            </span>
          </div>

          {/* Simulation toggle */}
          <button
            onClick={() => setUseSimulation(s => !s)}
            className={`px-3 py-2.5 min-h-[48px] rounded-xl text-sm font-medium transition-all active:scale-95 ${
              useSimulation ? 'bg-amber-600/80 text-white border border-amber-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700/50'
            }`}
          >
            {useSimulation ? 'Simulation' : 'Balance'}
          </button>

          {/* Connect / Disconnect button */}
          {!useSimulation && (
            <button
              onClick={status === 'connected' ? disconnect : connect}
              disabled={status === 'connecting'}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-xl font-medium text-sm transition-all active:scale-95 ${
                connectAnim ? 'animate-pulse' : ''
              } ${
                status === 'connected' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                status === 'connecting' ? 'bg-blue-700 text-white' :
                status === 'error' ? 'bg-red-600 hover:bg-red-500 text-white' :
                'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {status === 'connected' ? <Wifi className="w-5 h-5" /> :
               status === 'connecting' ? <Bluetooth className="w-5 h-5 animate-spin" /> :
               <BluetoothOff className="w-5 h-5" />}
              <span className="hidden sm:inline">
                {status === 'connected' ? 'Deconnecter' :
                 status === 'connecting' ? 'Connexion...' :
                 'Connecter'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Error banner */}
      {error && !useSimulation && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-red-900/40 text-red-300 text-sm border-b border-red-800/50">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ===== STEP INDICATOR ===== */}
      {!quickMode && (
        <div className="flex items-center justify-center gap-1 px-4 py-3 bg-slate-900/50 border-b border-slate-800/60">
          {STEPS.map((step, idx) => {
            const active = currentStep === step.num;
            const done = currentStep > step.num;
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  active ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' :
                  done ? 'bg-slate-700/40 text-emerald-400' :
                  'bg-slate-800/30 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
                  <span className="text-xs font-bold sm:hidden">{step.num}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 rounded transition-colors ${done ? 'bg-emerald-500/60' : 'bg-slate-700/40'}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

        {/* LEFT PANEL: Ingredient selector + Quick actions */}
        <div className="max-h-[50vh] lg:max-h-none lg:w-80 xl:w-96 bg-slate-900/40 border-b lg:border-b-0 lg:border-r border-slate-800/60 flex flex-col overflow-hidden shrink-0">

          {/* Quick actions */}
          <div className="p-3 border-b border-slate-800/60 flex overflow-x-auto sm:grid sm:grid-cols-4 gap-2 scrollbar-none">
            <button
              onClick={() => { setQuickMode(true); setSelected(null); setSearch(''); }}
              className={`flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[100px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium transition-all active:scale-95 ${
                quickMode ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 border border-slate-700/40'
              }`}
            >
              <Zap className="w-5 h-5" />
              Pesee rapide
            </button>
            <button
              onClick={() => setShowNewIngredient(true)}
              className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[100px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/40 border border-emerald-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Nouvel ingrédient
            </button>
            <button
              onClick={() => navigate('/inventory')}
              className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[100px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 border border-slate-700/40 transition-all active:scale-95"
            >
              <Package className="w-5 h-5" />
              Inventaire
            </button>
            <button
              onClick={() => navigate('/recipes')}
              className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[100px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 border border-slate-700/40 transition-all active:scale-95"
            >
              <ChefHat className="w-5 h-5" />
              Recettes
            </button>
          </div>

          {/* New ingredient mini form */}
          {showNewIngredient && (
            <div className="p-3 border-b border-slate-800/60 bg-emerald-900/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-emerald-300">Nouvel ingrédient</p>
                <button onClick={() => setShowNewIngredient(false)} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nom *"
                  value={newIngForm.name}
                  onChange={e => setNewIngForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-800/80 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-slate-700/50"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newIngForm.category}
                    onChange={e => setNewIngForm(f => ({ ...f, category: e.target.value }))}
                    className="px-3 py-2.5 min-h-[44px] bg-slate-800/80 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-slate-700/50"
                  >
                    {['Viandes', 'Poissons', 'Legumes', 'Fruits', 'Produits laitiers', 'Epicerie', 'Autres'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    value={newIngForm.unit}
                    onChange={e => setNewIngForm(f => ({ ...f, unit: e.target.value }))}
                    className="px-3 py-2.5 min-h-[44px] bg-slate-800/80 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-slate-700/50"
                  >
                    {['kg', 'g', 'L', 'cl', 'ml', 'pièce'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prix / unité (€) *"
                  value={newIngForm.pricePerUnit}
                  onChange={e => setNewIngForm(f => ({ ...f, pricePerUnit: e.target.value }))}
                  className="w-full px-3 py-2.5 min-h-[44px] bg-slate-800/80 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-slate-700/50"
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
                      setNewIngForm({ name: '', category: 'Légumes', unit: 'kg', pricePerUnit: '' });
                      showToast(`Ingrédient "${created.name}" créé et sélectionné`, 'success');
                    } catch {
                      showToast('Erreur lors de la création de l\'ingrédient', 'error');
                    }
                    setCreatingIngredient(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-medium text-sm transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  {creatingIngredient ? 'Création...' : 'Créer et sélectionner'}
                </button>
              </div>
            </div>
          )}

          {/* Ingredient search */}
          <div className="p-3 border-b border-slate-800/60" ref={dropdownRef}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Rechercher un ingredient..."
                className="w-full pl-10 pr-3 py-3 min-h-[48px] bg-slate-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-slate-700/50"
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
                    : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{ing.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(ing.category)}`}>
                      {ing.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{ing.unit}</span>
                    <span className="text-[10px] text-blue-400">{ing.pricePerUnit.toFixed(2)} €/{ing.unit}</span>
                  </div>
                </div>
                {selected?.id === ing.id && (
                  <CircleDot className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
              </button>
            ))}
            {filteredIngredients.length === 0 && search && (
              <p className="text-center text-slate-600 text-sm py-8">Aucun resultat</p>
            )}
          </div>
        </div>

        {/* CENTER: Scale display */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-5 px-3 sm:px-4 py-4 sm:py-6 relative overflow-hidden">

          {/* Selected ingredient label */}
          <div className="text-center min-h-[60px] flex flex-col items-center justify-center">
            {quickMode ? (
              <div>
                <p className="text-amber-400 text-sm uppercase tracking-widest font-medium">Pesee rapide</p>
                <p className="text-slate-500 text-xs mt-1">Pesez sans selectionner d'ingredient</p>
              </div>
            ) : selected ? (
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">Ingredient selectionne</p>
                <p className="text-2xl font-bold text-white mt-0.5">{selected.name}</p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded border ${getCategoryColor(selected.category)}`}>
                    {selected.category}
                  </span>
                  <span className="text-xs text-blue-400 font-medium">
                    {selected.pricePerUnit.toFixed(2)} €/{selected.unit}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-slate-600 text-sm sm:text-base px-2 text-center">Selectionnez un ingredient ou utilisez la pesee rapide</p>
              </div>
            )}
          </div>

          {/* ===== BIG WEIGHT DISPLAY (LCD-style) ===== */}
          <div
            className={`relative w-full max-w-full sm:max-w-md aspect-[2.2/1] sm:aspect-[2/1] rounded-2xl flex flex-col items-center justify-center transition-all duration-500 ${
              flashGreen ? 'shadow-[0_0_80px_rgba(52,211,153,0.3)]' : ''
            }`}
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

            {/* Weight number */}
            <div className="relative z-10 flex items-baseline gap-2">
              <span
                className={`font-black tabular-nums tracking-tight transition-all duration-300 ${
                  netWeight > 0 && isStable ? 'text-emerald-400' :
                  netWeight > 0 ? 'text-blue-300' :
                  'text-slate-600'
                }`}
                style={{ fontSize: 'clamp(3.5rem, 10vw, 6rem)', lineHeight: 1 }}
              >
                {netWeight <= 0 ? '0' : weightForDisplay}
              </span>
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                netWeight > 0 ? 'text-slate-400' : 'text-slate-700'
              }`}>
                {unitForDisplay}
              </span>
            </div>

            {/* Stability indicator */}
            <div className="relative z-10 mt-2 h-5 flex items-center">
              {netWeight > 0 && isStable && (
                <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium animate-in fade-in duration-300">
                  <Check className="w-4 h-4" /> Stable
                </span>
              )}
              {netWeight > 0 && !isStable && (
                <span className="flex items-center gap-1.5 text-blue-400 text-sm font-medium animate-pulse">
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
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
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900/30 border border-emerald-500/30 rounded-2xl">
              <Euro className="w-5 h-5 text-emerald-400" />
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                Valeur : {(netConverted * selected.pricePerUnit).toFixed(2)} €
              </span>
            </div>
          )}

          {/* Unit toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/60 rounded-xl border border-slate-700/40">
            {(['g', 'kg', 'L', 'pièce'] as DisplayUnit[]).map(u => (
              <button
                key={u}
                onClick={() => setDisplayUnit(u)}
                className={`px-3 sm:px-5 py-2 min-h-[48px] rounded-lg text-sm font-bold transition-all ${
                  displayUnit === u
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Simulation controls */}
          {useSimulation && (
            <div className="flex items-center gap-3 sm:gap-4 bg-slate-800/60 px-3 sm:px-5 py-3 rounded-2xl border border-amber-600/30">
              <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">Sim</p>
              <button
                onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
                className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center active:scale-90 transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-white font-mono w-24 text-center text-lg tabular-nums">{simWeight.toFixed(3)} kg</span>
              <button
                onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
                className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center active:scale-90 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-lg px-1">
            <button
              onClick={handleTare}
              disabled={currentWeight <= 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-semibold text-white text-sm sm:text-base transition-all active:scale-95 border border-slate-700/50"
            >
              <RotateCcw className="w-5 h-5" /> Tare
            </button>

            <button
              onClick={handleValidate}
              disabled={(!selected && !quickMode) || netConverted <= 0 || saving}
              className="flex items-center gap-2 px-6 sm:px-10 py-4 min-h-[56px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-bold text-white text-base sm:text-lg transition-all active:scale-95 shadow-lg shadow-emerald-900/30 border border-emerald-500/30"
            >
              <Check className="w-6 h-6" />
              {saving ? 'Sauvegarde...' : 'Valider'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] bg-slate-800 hover:bg-slate-700 rounded-2xl font-semibold text-white text-sm sm:text-base transition-all active:scale-95 border border-slate-700/50"
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: History log */}
        <div className="max-h-[40vh] lg:max-h-none lg:w-80 xl:w-96 bg-slate-900/40 border-t lg:border-t-0 lg:border-l border-slate-800/60 flex flex-col overflow-hidden shrink-0">

          {/* History header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-300">Historique</p>
              {history.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400">{history.length}</span>
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
              <div className="flex flex-col items-center justify-center py-12 text-slate-700">
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
                    : 'bg-slate-800/40 border-slate-700/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{entry.ingredientName}</p>
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
                  <p className="text-slate-600 text-[10px]">
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
          <div className="px-4 py-3 border-t border-slate-800/60 bg-slate-900/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Aujourd'hui</span>
              <div className="flex items-center gap-4">
                <span className="text-emerald-400 font-medium">{todayStats.totalWeighs} pesée{todayStats.totalWeighs !== 1 ? 's' : ''}</span>
                <span className="text-blue-400 font-medium">{todayStats.totalKg} kg total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
