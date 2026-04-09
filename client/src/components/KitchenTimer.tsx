import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, X, Trash2 } from 'lucide-react';

interface TimerInstance {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Web Audio API beep
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playBeep = (startTime: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    // 3 ascending beeps
    playBeep(ctx.currentTime, 880, 0.15);
    playBeep(ctx.currentTime + 0.2, 1100, 0.15);
    playBeep(ctx.currentTime + 0.4, 1320, 0.3);
  } catch {
    // Audio not available
  }
}

let nextId = 1;

export default function KitchenTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timers, setTimers] = useState<TimerInstance[]>([]);
  const [newMinutes, setNewMinutes] = useState(10);
  const [newLabel, setNewLabel] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alertedRef = useRef<Set<string>>(new Set());

  // Tick all running timers
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers(prev => {
        let changed = false;
        const updated = prev.map(t => {
          if (t.isRunning && t.remainingSeconds > 0) {
            changed = true;
            const newRemaining = t.remainingSeconds - 1;
            if (newRemaining === 0 && !alertedRef.current.has(t.id)) {
              alertedRef.current.add(t.id);
              playAlertSound();
              // Play again after 1s and 2s for emphasis
              setTimeout(playAlertSound, 1000);
              setTimeout(playAlertSound, 2000);
            }
            return {
              ...t,
              remainingSeconds: newRemaining,
              isRunning: newRemaining > 0,
              isFinished: newRemaining === 0,
            };
          }
          return t;
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const addTimer = useCallback(() => {
    if (newMinutes <= 0) return;
    const id = `timer-${nextId++}`;
    const totalSeconds = Math.round(newMinutes * 60);
    setTimers(prev => [
      ...prev,
      {
        id,
        label: newLabel.trim() || `Timer ${prev.length + 1}`,
        totalSeconds,
        remainingSeconds: totalSeconds,
        isRunning: true,
        isFinished: false,
      },
    ]);
    setNewLabel('');
  }, [newMinutes, newLabel]);

  const toggleTimer = useCallback((id: string) => {
    setTimers(prev =>
      prev.map(t => (t.id === id && !t.isFinished ? { ...t, isRunning: !t.isRunning } : t))
    );
  }, []);

  const resetTimer = useCallback((id: string) => {
    alertedRef.current.delete(id);
    setTimers(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false, isFinished: false }
          : t
      )
    );
  }, []);

  const removeTimer = useCallback((id: string) => {
    alertedRef.current.delete(id);
    setTimers(prev => prev.filter(t => t.id !== id));
  }, []);

  const activeCount = timers.filter(t => t.isRunning).length;
  const finishedCount = timers.filter(t => t.isFinished).length;

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-80 max-h-[70vh] flex flex-col bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl shadow-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-[#262626]/50">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-teal-400" />
              <span className="font-semibold text-[#111111] dark:text-white text-sm">Kitchen Timer</span>
              {timers.length > 0 && (
                <span className="text-xs text-[#A3A3A3]">({timers.length})</span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#404040] text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Add new timer */}
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#262626]/50 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Nom (ex: Pates)"
                className="flex-1 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-[#111111] dark:text-white placeholder-[#A3A3A3] dark:placeholder-[#737373] focus:outline-none focus:border-teal-500"
                onKeyDown={e => e.key === 'Enter' && addTimer()}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="number"
                  min={0.5}
                  max={999}
                  step={0.5}
                  value={newMinutes}
                  onChange={e => setNewMinutes(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-[#111111] dark:text-white text-center focus:outline-none focus:border-teal-500"
                  onKeyDown={e => e.key === 'Enter' && addTimer()}
                />
                <span className="text-xs text-[#A3A3A3]">min</span>
              </div>
              <button
                onClick={addTimer}
                disabled={newMinutes <= 0}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Lancer
              </button>
            </div>
          </div>

          {/* Timer list */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
            {timers.length === 0 && (
              <div className="py-6 text-center text-[#737373] text-sm">
                Aucun timer actif
              </div>
            )}
            {timers.map(t => {
              const progress = t.totalSeconds > 0
                ? ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100
                : 0;
              return (
                <div
                  key={t.id}
                  className={`rounded-xl p-3 border transition-colors ${
                    t.isFinished
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700/50 animate-pulse'
                      : 'bg-[#F5F5F5] dark:bg-[#262626]/50 border-[#E5E7EB] dark:border-[#262626]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3] truncate max-w-[120px]">{t.label}</span>
                    <button
                      onClick={() => removeTimer(t.id)}
                      className="p-0.5 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#404040] text-[#737373] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-2xl font-bold tracking-wider ${
                        t.isFinished
                          ? 'text-red-400'
                          : t.remainingSeconds <= 60
                          ? 'text-amber-400'
                          : 'text-[#111111] dark:text-white'
                      }`}
                    >
                      {t.isFinished ? "00:00" : formatTime(t.remainingSeconds)}
                    </span>
                    <div className="flex gap-1 ml-auto">
                      <button
                        onClick={() => toggleTimer(t.id)}
                        disabled={t.isFinished}
                        className={`p-1.5 rounded-lg transition-colors ${
                          t.isFinished
                            ? 'text-[#525252] cursor-not-allowed'
                            : t.isRunning
                            ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                            : 'bg-teal-600/20 text-teal-400 hover:bg-teal-600/30'
                        }`}
                      >
                        {t.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => resetTimer(t.id)}
                        className="p-1.5 rounded-lg bg-[#E5E7EB]/50 dark:bg-[#404040]/50 text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#404040] transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 bg-[#E5E7EB] dark:bg-[#404040] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        t.isFinished
                          ? 'bg-red-500'
                          : progress > 80
                          ? 'bg-amber-500'
                          : 'bg-teal-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating button - bottom left, above potential cookie banners */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 no-print ${
          isOpen
            ? 'bg-[#404040] hover:bg-[#525252] rotate-12'
            : finishedCount > 0
            ? 'bg-red-600 hover:bg-red-500 animate-bounce'
            : activeCount > 0
            ? 'bg-teal-600 hover:bg-teal-500'
            : 'bg-[#E5E7EB] dark:bg-[#262626] hover:bg-[#D4D4D4] dark:hover:bg-[#404040] border border-[#D4D4D4] dark:border-[#404040]'
        }`}
        title="Kitchen Timer"
      >
        <Timer className="w-6 h-6 text-white" />
        {activeCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-400 text-[#111111] text-xs font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
        {finishedCount > 0 && !isOpen && (
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-400 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            !
          </span>
        )}
      </button>
    </>
  );
}
