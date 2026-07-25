import { useState, useCallback } from 'react';
import { ClipboardList, CheckCircle2, Circle, Plus, Trash2, RotateCcw, Sun, Moon } from 'lucide-react';

interface Task {
  id: string;
  label: string;
  checked: boolean;
  custom?: boolean;
}

type Mode = 'ouverture' | 'fermeture';

const DEFAULT_TASKS: Record<Mode, Task[]> = {
  ouverture: [
    { id: 'o1', label: 'Allumer les équipements (fours, friteuses, plaques)', checked: false },
    { id: 'o2', label: 'Vérifier les températures frigos & chambres froides', checked: false },
    { id: 'o3', label: 'Contrôler les stocks DLC/DLUO du jour', checked: false },
    { id: 'o4', label: 'Préparer les mises en place (sauces, garnitures)', checked: false },
    { id: 'o5', label: 'Nettoyer et désinfecter les plans de travail', checked: false },
    { id: 'o6', label: 'Vérifier la caisse et les moyens de paiement', checked: false },
    { id: 'o7', label: 'Mettre en place la salle (nappes, couverts, carte)', checked: false },
    { id: 'o8', label: "Briefer l'équipe (plat du jour, allergènes, réservations)", checked: false },
  ],
  fermeture: [
    { id: 'f1', label: 'Éteindre tous les équipements de cuisson', checked: false },
    { id: 'f2', label: 'Filmer et stocker les denrées en chambre froide', checked: false },
    { id: 'f3', label: 'Nettoyer et désinfecter toutes les surfaces', checked: false },
    { id: 'f4', label: 'Passer la serpillère en cuisine et en salle', checked: false },
    { id: 'f5', label: 'Vider et nettoyer les poubelles', checked: false },
    { id: 'f6', label: 'Faire la caisse et la remise en banque', checked: false },
    { id: 'f7', label: 'Vérifier les fermetures (portes, fenêtres, volets)', checked: false },
    { id: 'f8', label: "Couper les lumières et activer l'alarme", checked: false },
  ],
};

const STORAGE_KEY = 'checklistService';

function loadState(): Record<Mode, Task[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ?? DEFAULT_TASKS;
  } catch { return DEFAULT_TASKS; }
}

function saveState(state: Record<Mode, Task[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function ChecklistService() {
  const [mode, setMode] = useState<Mode>('ouverture');
  const [tasks, setTasks] = useState<Record<Mode, Task[]>>(loadState);
  const [newTask, setNewTask] = useState('');

  const current = tasks[mode];
  const done = current.filter(t => t.checked).length;
  const progress = current.length > 0 ? Math.round((done / current.length) * 100) : 0;

  const update = useCallback((next: Task[]) => {
    setTasks(prev => {
      const updated = { ...prev, [mode]: next };
      saveState(updated);
      return updated;
    });
  }, [mode]);

  function toggle(id: string) {
    update(current.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  }

  function addTask() {
    if (!newTask.trim()) return;
    update([...current, { id: Date.now().toString(), label: newTask.trim(), checked: false, custom: true }]);
    setNewTask('');
  }

  function deleteTask(id: string) {
    update(current.filter(t => t.id !== id));
  }

  function reset() {
    setTasks(prev => {
      const updated = { ...prev, [mode]: DEFAULT_TASKS[mode] };
      saveState(updated);
      return updated;
    });
  }

  const inputClass = 'bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-[#A3A3A3]';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-teal-600" />
              Checklist de service
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Tâches d'ouverture et de fermeture — personnalisables et sauvegardées.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 bg-[#F5F5F5] dark:bg-[#0A0A0A] p-1 rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          {(['ouverture', 'fermeture'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === m
                  ? 'bg-white dark:bg-[#1A1A1A] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {m === 'ouverture'
                ? <Sun className="w-4 h-4 text-amber-500" />
                : <Moon className="w-4 h-4 text-indigo-400" />
              }
              {m === 'ouverture' ? 'Ouverture' : 'Fermeture'}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#111111] dark:text-white">
              {done} / {current.length} tâches complétées
            </span>
            <span className={`text-sm font-bold ${progress === 100 ? 'text-emerald-500' : 'text-teal-600'}`}>
              {progress} %
            </span>
          </div>
          <div className="h-2 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-teal-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Toutes les tâches sont complétées — bon service !
            </p>
          )}
        </div>

        {/* Task list */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden divide-y divide-[#F5F5F5] dark:divide-[#1A1A1A]">
          {current.map(task => (
            <div key={task.id} className="flex items-center gap-3 px-4 py-3.5 group hover:bg-[#F9FAFB] dark:hover:bg-[#111111] transition-colors">
              <button
                onClick={() => toggle(task.id)}
                className="flex-shrink-0 text-[#D1D5DB] dark:text-[#404040] hover:text-teal-600 dark:hover:text-teal-500 transition-colors"
              >
                {task.checked
                  ? <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  : <Circle className="w-5 h-5" />
                }
              </button>
              <span className={`flex-1 text-sm transition-all ${task.checked ? 'line-through text-[#A3A3A3] dark:text-[#525252]' : 'text-[#111111] dark:text-white'}`}>
                {task.label}
              </span>
              {task.custom && (
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 p-1.5 rounded-lg text-[#D1D5DB] dark:text-[#404040] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add custom task */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Ajouter une tâche personnalisée…"
            className={`flex-1 ${inputClass}`}
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
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
