import { useState, useEffect, useCallback } from 'react';
import { Check, Square, ChevronDown, ChevronUp, X, ShoppingBasket, ClipboardList, Package, Truck, BookOpen, Receipt, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOnboardingState, isAllOnboardingDone, getCompletedSteps, saveOnboardingState, type OnboardingState } from './OnboardingWizard';

// ── Step definitions ─────────────────────────────────────────────────────────
interface OnboardingStep {
  key: keyof OnboardingState;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const STEPS: OnboardingStep[] = [
  { key: 'ingredientAdded', label: 'Ingredient ajoute', icon: ShoppingBasket, route: '/ingredients' },
  { key: 'recipeCreated', label: 'Recette creee', icon: ClipboardList, route: '/recipes' },
  { key: 'stockConfigured', label: 'Stock configure', icon: Package, route: '/inventory' },
  { key: 'supplierAdded', label: 'Fournisseur ajoute', icon: Truck, route: '/suppliers' },
  { key: 'menuCreated', label: 'Carte construite', icon: BookOpen, route: '/menu' },
  { key: 'invoiceScanned', label: 'Facture scannee', icon: Receipt, route: '/scanner-factures' },
];

const TOTAL = STEPS.length + 1; // +1 for wizard completion

const DISMISS_KEY = 'onboarding-progress-dismissed';

// ── Component ────────────────────────────────────────────────────────────────
export default function OnboardingProgress() {
  const navigate = useNavigate();
  const [state, setState] = useState<OnboardingState>(getOnboardingState);
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [showCelebration, setShowCelebration] = useState(false);

  // Re-read state periodically (when user navigates or does actions)
  useEffect(() => {
    function refresh() {
      const fresh = getOnboardingState();
      setState(fresh);
    }
    refresh();
    // Listen to storage changes
    window.addEventListener('storage', refresh);
    // Also poll every 5 seconds for same-tab updates
    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener('storage', refresh);
      clearInterval(interval);
    };
  }, []);

  const completed = getCompletedSteps();
  const allDone = isAllOnboardingDone() && state.wizardCompleted;

  // Show celebration when all done
  useEffect(() => {
    if (allDone && !dismissed) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [allDone, dismissed]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, '1');
  }, []);

  // Don't show if not onboarded yet, or if dismissed, or if all done and dismissed
  if (!state.wizardCompleted) return null;
  if (dismissed) return null;
  if (allDone) {
    // Show completion message briefly then hide
    if (!showCelebration) {
      // Auto-dismiss after celebration
      handleDismiss();
      return null;
    }
  }

  const progressPercent = Math.round((completed / TOTAL) * 100);

  return (
    <div className="mx-3 mb-3">
      <div className="rounded-xl border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717] overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-mono-950 dark:hover:bg-mono-200 transition-colors"
        >
          {allDone && showCelebration ? (
            <>
              <Trophy className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
              <span className="flex-1 text-xs font-semibold text-mono-100 dark:text-white">
                Bravo ! Tout est configure !
              </span>
            </>
          ) : (
            <>
              <div className="relative w-5 h-5 flex-shrink-0">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-mono-900 dark:text-[#333333]" />
                  <circle
                    cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeDasharray={`${(progressPercent / 100) * 50.27} 50.27`}
                    className="text-mono-100 dark:text-white transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="flex-1 text-xs font-semibold text-mono-100 dark:text-white">
                {completed}/{TOTAL} etapes
              </span>
              <span className="text-[10px] font-medium text-[#9CA3AF] dark:text-mono-500">{progressPercent}%</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-500" />
              )}
            </>
          )}
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-mono-900 dark:bg-mono-200">
          <div
            className="h-full bg-mono-100 dark:bg-white transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Steps list */}
        {expanded && !allDone && (
          <div className="px-3 py-2 space-y-1">
            {/* Wizard completion */}
            <div className="flex items-center gap-2 py-1">
              {state.wizardCompleted ? (
                <div className="w-4 h-4 rounded bg-mono-100 dark:bg-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white dark:text-mono-100" />
                </div>
              ) : (
                <Square className="w-4 h-4 text-[#D1D5DB] dark:text-[#555555] flex-shrink-0" />
              )}
              <span className={`text-[11px] ${
                state.wizardCompleted
                  ? 'text-[#9CA3AF] dark:text-mono-500 line-through'
                  : 'text-mono-100 dark:text-white font-medium'
              }`}>
                Introduction terminee
              </span>
            </div>

            {/* Dynamic steps */}
            {STEPS.map(s => {
              const done = !!state[s.key];
              return (
                <button
                  key={s.key}
                  onClick={() => !done && navigate(s.route)}
                  className={`w-full flex items-center gap-2 py-1 text-left transition-colors rounded ${
                    !done ? 'hover:bg-mono-950 dark:hover:bg-mono-200 cursor-pointer' : ''
                  }`}
                >
                  {done ? (
                    <div className="w-4 h-4 rounded bg-mono-100 dark:bg-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-white dark:text-mono-100" />
                    </div>
                  ) : (
                    <Square className="w-4 h-4 text-[#D1D5DB] dark:text-[#555555] flex-shrink-0" />
                  )}
                  <span className={`text-[11px] ${
                    done
                      ? 'text-[#9CA3AF] dark:text-mono-500 line-through'
                      : 'text-mono-100 dark:text-white font-medium'
                  }`}>
                    {s.label}
                  </span>
                </button>
              );
            })}

            {/* Dismiss link */}
            <button
              onClick={handleDismiss}
              className="text-[10px] text-[#9CA3AF] dark:text-mono-500 hover:text-[#6B7280] dark:hover:text-mono-700 transition-colors mt-1 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Masquer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
