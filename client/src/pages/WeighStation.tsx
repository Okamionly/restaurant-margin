import { useState, useEffect, useRef } from 'react';
import { Bluetooth, BluetoothOff, Scale, Check, RotateCcw, Search, ChevronRight, AlertTriangle, Wifi, WifiOff, Plus, Minus } from 'lucide-react';
import { useScale } from '../hooks/useScale';
import { useToast } from '../hooks/useToast';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

type Ingredient = { id: number; name: string; unit: string; category: string; pricePerUnit: number };
type WeighLog = { ingredient: Ingredient; weight: number; unit: string; timestamp: Date };

const CATEGORY_COLORS: Record<string, string> = {
  'Viandes': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Poissons': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Légumes': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Fruits': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Produits laitiers': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Épicerie': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

// Unit conversion: balance gives kg, convert to ingredient unit
function convertWeight(kg: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'g': return Math.round(kg * 1000);
    case 'kg': return Math.round(kg * 1000) / 1000;
    case 'l': return Math.round(kg * 100) / 100; // approx water density
    case 'cl': return Math.round(kg * 1000) / 10;
    case 'ml': return Math.round(kg * 1000 * 10);
    default: return Math.round(kg * 1000) / 1000;
  }
}

export default function WeighStation() {
  const { showToast } = useToast();
  const { status, reading, error, isSupported, connect, disconnect } = useScale();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [tare, setTare] = useState(0);
  const [log, setLog] = useState<WeighLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [simWeight, setSimWeight] = useState(0); // simulation mode
  const [useSimulation, setUseSimulation] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`${API}/api/ingredients`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(setIngredients)
      .catch(() => {});
  }, []);

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const netConverted = selected ? convertWeight(netWeight, selected.unit) : netWeight;
  const isStable = useSimulation ? true : (reading?.stable ?? false);

  const filteredIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleTare() {
    setTare(currentWeight);
    showToast('Tare effectuée', 'success');
  }

  function handleReset() {
    setTare(0);
    setSelected(null);
  }

  async function handleValidate() {
    if (!selected || netConverted <= 0) return;
    setSaving(true);
    try {
      // Update inventory stock
      const invRes = await fetch(`${API}/api/inventory`, { headers: authHeaders() });
      if (invRes.ok) {
        const invItems = await invRes.json();
        const item = invItems.find((i: any) => i.ingredientId === selected.id);
        if (item) {
          await fetch(`${API}/api/inventory/${item.id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ currentStock: item.currentStock + netConverted }),
          });
          showToast(`+${netConverted} ${selected.unit} ajouté à l'inventaire`, 'success');
        } else {
          showToast('Ingrédient non trouvé dans l\'inventaire', 'error');
        }
      }
      setLog(prev => [{ ingredient: selected, weight: netConverted, unit: selected.unit, timestamp: new Date() }, ...prev.slice(0, 9)]);
      setTare(0);
      setSelected(null);
      setSearch('');
    } catch {
      showToast('Erreur sauvegarde', 'error');
    }
    setSaving(false);
  }

  const weightDisplay = netConverted > 0 ? (
    selected?.unit === 'g' ? `${netConverted} g` :
    selected?.unit === 'kg' ? `${netConverted.toFixed(3)} kg` :
    `${netConverted} ${selected?.unit ?? 'kg'}`
  ) : '— —';

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col select-none overflow-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Scale className="w-6 h-6 text-blue-400" />
          <span className="text-lg font-bold text-white">Station Balance</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Simulation toggle */}
          <button
            onClick={() => setUseSimulation(s => !s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${useSimulation ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            {useSimulation ? 'Mode Simulation' : 'Mode Balance'}
          </button>

          {/* Debug toggle */}
          <button
            onClick={() => setDebugMode(d => !d)}
            className="px-2 py-1.5 rounded-lg text-xs bg-slate-700 text-slate-400 hover:bg-slate-600"
          >
            Debug
          </button>

          {/* BT Status */}
          {!useSimulation && (
            <button
              onClick={status === 'connected' ? disconnect : connect}
              disabled={status === 'connecting'}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all active:scale-95 ${
                status === 'connected' ? 'bg-green-600 hover:bg-green-700 text-white' :
                status === 'connecting' ? 'bg-blue-700 text-white animate-pulse' :
                status === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' :
                'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {status === 'connected' ? <Wifi className="w-4 h-4" /> :
               status === 'connecting' ? <Bluetooth className="w-4 h-4 animate-pulse" /> :
               <BluetoothOff className="w-4 h-4" />}
              {status === 'connected' ? 'Connecté' :
               status === 'connecting' ? 'Connexion...' :
               'Connecter balance'}
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && !useSimulation && (
        <div className="flex items-center gap-2 px-6 py-2 bg-red-900/50 text-red-300 text-sm border-b border-red-800">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Main layout — 3 columns on tablet */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Ingredient selector */}
        <div className="w-72 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un ingrédient..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
            {filteredIngredients.map(ing => (
              <button
                key={ing.id}
                onClick={() => { setSelected(ing); setTare(0); setSearch(''); }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all active:scale-98 ${
                  selected?.id === ing.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{ing.name}</p>
                  <p className={`text-xs mt-0.5 ${selected?.id === ing.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    {ing.unit} · {ing.category}
                  </p>
                </div>
                {selected?.id === ing.id && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </button>
            ))}
            {filteredIngredients.length === 0 && (
              <p className="text-center text-slate-500 text-sm py-8">Aucun résultat</p>
            )}
          </div>
        </div>

        {/* CENTER — Scale display */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">

          {/* Selected ingredient */}
          <div className="text-center">
            {selected ? (
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Ingrédient sélectionné</p>
                <p className="text-3xl font-bold text-white">{selected.name}</p>
                <p className="text-slate-400 text-sm mt-1">{selected.category}</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-500 text-xl">← Sélectionnez un ingrédient</p>
              </div>
            )}
          </div>

          {/* Big weight display */}
          <div className={`relative flex flex-col items-center justify-center w-64 h-64 rounded-full border-4 transition-all duration-300 ${
            netWeight > 0 && isStable ? 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]' :
            netWeight > 0 ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' :
            'border-slate-600'
          }`}>
            <p className={`text-6xl font-black tabular-nums transition-all ${
              netWeight > 0 && isStable ? 'text-green-400' :
              netWeight > 0 ? 'text-blue-300' :
              'text-slate-500'
            }`}>
              {weightDisplay}
            </p>
            {netWeight > 0 && (
              <p className={`text-sm mt-2 font-medium ${isStable ? 'text-green-400' : 'text-blue-400 animate-pulse'}`}>
                {isStable ? '✓ Stable' : '⋯ En cours'}
              </p>
            )}
            {tare > 0 && (
              <p className="text-xs text-amber-400 mt-1">Tare : {(tare * 1000).toFixed(0)} g</p>
            )}
          </div>

          {/* Simulation controls */}
          {useSimulation && (
            <div className="flex items-center gap-4 bg-slate-800 px-6 py-3 rounded-2xl border border-amber-600/30">
              <p className="text-amber-400 text-sm font-medium">Simulation :</p>
              <button onClick={() => setSimWeight(w => Math.max(0, +(w - 0.1).toFixed(3)))} className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center active:scale-90">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-mono w-20 text-center text-lg">{simWeight.toFixed(3)} kg</span>
              <button onClick={() => setSimWeight(w => +(w + 0.1).toFixed(3))} className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center active:scale-90">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Debug */}
          {debugMode && reading && !useSimulation && (
            <div className="bg-slate-800 px-4 py-2 rounded-xl text-xs text-slate-400 font-mono max-w-xs text-center break-all">
              RAW: {reading.raw}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleTare}
              disabled={currentWeight <= 0}
              className="flex items-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-semibold text-white text-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" /> Tare
            </button>
            <button
              onClick={handleValidate}
              disabled={!selected || netConverted <= 0 || saving}
              className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-white text-lg transition-all active:scale-95 shadow-lg shadow-green-900/40"
            >
              <Check className="w-6 h-6" />
              {saving ? 'Sauvegarde...' : 'Valider'}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-2xl font-semibold text-white text-lg transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>

        {/* RIGHT — Recent log */}
        <div className="w-64 bg-slate-800 border-l border-slate-700 flex flex-col overflow-hidden shrink-0">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm font-semibold text-slate-300">Pesées récentes</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {log.length === 0 && (
              <p className="text-center text-slate-600 text-xs py-6">Aucune pesée</p>
            )}
            {log.map((entry, i) => (
              <div key={i} className="bg-slate-700/60 rounded-xl px-3 py-2.5">
                <p className="text-white text-sm font-medium truncate">{entry.ingredient.name}</p>
                <p className="text-green-400 text-lg font-bold tabular-nums">{entry.weight} {entry.unit}</p>
                <p className="text-slate-500 text-xs">{entry.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
