import { useState, useEffect, useCallback } from 'react';
import { Timer, Play, Square, RotateCcw, Flame, Snowflake, CakeSlice, Plus, Trash2 } from 'lucide-react';

type StationIcon = 'chaud' | 'froid' | 'patisserie' | 'custom';

interface Station {
  id: string;
  name: string;
  icon: StationIcon;
  running: boolean;
  elapsed: number;
  startedAt: number | null;
  history: number[];
}

const ICONS: Record<StationIcon, JSX.Element> = {
  chaud: <Flame className="w-5 h-5 text-orange-500" />,
  froid: <Snowflake className="w-5 h-5 text-blue-400" />,
  patisserie: <CakeSlice className="w-5 h-5 text-pink-400" />,
  custom: <Timer className="w-5 h-5 text-teal-500" />,
};

const DEFAULT_STATIONS: Station[] = [
  { id: 's1', name: 'Chaud', icon: 'chaud', running: false, elapsed: 0, startedAt: null, history: [] },
  { id: 's2', name: 'Froid', icon: 'froid', running: false, elapsed: 0, startedAt: null, history: [] },
  { id: 's3', name: 'Pâtisserie', icon: 'patisserie', running: false, elapsed: 0, startedAt: null, history: [] },
];

const STORAGE_KEY = 'chronoPreparation';

function load(): Station[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ?? DEFAULT_STATIONS;
  } catch { return DEFAULT_STATIONS; }
}

function save(stations: Station[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stations));
}

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h${String(m % 60).padStart(2, '0')}m${String(s % 60).padStart(2, '0')}s`;
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function live(s: Station): number {
  return s.elapsed + (s.running && s.startedAt ? Date.now() - s.startedAt : 0);
}

function avg(history: number[]): number {
  return history.length ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;
}

export default function ChronoPreparation() {
  const [stations, setStations] = useState<Station[]>(load);
  const [newName, setNewName] = useState('');
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!stations.some(s => s.running)) return;
    const id = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(id);
  }, [stations]);

  const update = useCallback((next: Station[]) => { save(next); setStations(next); }, []);

  function toggle(id: string) {
    const now = Date.now();
    update(stations.map(s => {
      if (s.id !== id) return s;
      if (s.running) {
        const elapsed = s.elapsed + (s.startedAt ? now - s.startedAt : 0);
        return { ...s, running: false, elapsed, startedAt: null };
      }
      return { ...s, running: true, startedAt: now };
    }));
  }

  function lap(id: string) {
    const now = Date.now();
    update(stations.map(s => {
      if (s.id !== id) return s;
      const elapsed = s.elapsed + (s.running && s.startedAt ? now - s.startedAt : 0);
      const history = [...s.history, elapsed].slice(-5);
      return { ...s, elapsed: 0, startedAt: s.running ? now : null, history };
    }));
  }

  function reset(id: string) {
    update(stations.map(s => s.id === id ? { ...s, running: false, elapsed: 0, startedAt: null } : s));
  }

  function addStation() {
    if (!newName.trim()) return;
    const next: Station = {
      id: Date.now().toString(), name: newName.trim(), icon: 'custom',
      running: false, elapsed: 0, startedAt: null, history: [],
    };
    update([...stations, next]);
    setNewName('');
  }

  function removeStation(id: string) {
    update(stations.filter(s => s.id !== id));
  }

  const inputClass = 'bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-[#A3A3A3]';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
            <Timer className="w-6 h-6 text-teal-600" />
            Chrono préparation par poste
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
            Mesurez les temps de sortie des plats par station. Historique des 5 derniers chrono.
          </p>
        </div>

        <div className="space-y-4">
          {stations.map(s => {
            const current = live(s);
            const mean = avg(s.history);
            const isDefault = ['s1', 's2', 's3'].includes(s.id);
            return (
              <div key={s.id} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    {ICONS[s.icon]}
                    <span className="font-semibold font-satoshi text-[#111111] dark:text-white">{s.name}</span>
                    {s.running && (
                      <span className="px-2 py-0.5 text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-full font-medium">
                        En cours
                      </span>
                    )}
                  </div>
                  {!isDefault && (
                    <button
                      onClick={() => removeStation(s.id)}
                      className="p-1.5 text-[#D1D5DB] dark:text-[#404040] hover:text-red-500 transition-colors rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className={`text-4xl font-mono font-bold text-center py-3 transition-colors ${s.running ? 'text-teal-600 dark:text-teal-400' : 'text-[#111111] dark:text-white'}`}>
                  {fmt(current)}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggle(s.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      s.running ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    {s.running ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {s.running ? 'Pause' : (current > 0 ? 'Reprendre' : 'Démarrer')}
                  </button>
                  <button
                    onClick={() => lap(s.id)}
                    disabled={current === 0}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => reset(s.id)}
                    disabled={current === 0 && !s.running}
                    className="px-3 py-2.5 text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl disabled:opacity-40 transition-colors"
                    title="Réinitialiser"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {s.history.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#F5F5F5] dark:border-[#1A1A1A]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wide">Historique</span>
                      <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                        Moy : <strong className="text-teal-600 dark:text-teal-400">{fmt(mean)}</strong>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.history.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-lg text-xs font-mono text-[#111111] dark:text-white">
                          {fmt(t)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addStation()}
            placeholder="Ajouter un poste personnalisé…"
            className={`flex-1 ${inputClass}`}
          />
          <button
            onClick={addStation}
            disabled={!newName.trim()}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

      </div>
    </div>
  );
}
