import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronUp, X, Store, ChefHat, ShoppingBasket, Truck, FileText, BarChart3, Trophy, ArrowRight } from 'lucide-react';

// ── Storage key ──────────────────────────────────────────────────────────────
const CHECKLIST_KEY = 'restaumargin_onboarding_checklist_v2';
const CHECKLIST_DISMISS_KEY = 'restaumargin_onboarding_checklist_dismissed_v2';

// ── Step definitions (6 steps as required) ───────────────────────────────────
export interface ChecklistStep {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  cta: string;
}

export const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 'profil_resto',
    label: 'Configurer le profil du restaurant',
    description: 'Donnez un nom a votre restaurant et choisissez votre type de cuisine.',
    icon: Store,
    route: '/settings',
    cta: 'Configurer',
  },
  {
    id: 'premiere_recette',
    label: 'Creer votre premiere recette',
    description: 'Ajoutez une recette et decouvrez votre food cost en temps reel.',
    icon: ChefHat,
    route: '/recipes',
    cta: 'Creer une recette',
  },
  {
    id: 'premier_cout_matiere',
    label: 'Saisir un premier cout matiere',
    description: 'Entrez le prix de vos ingredients principaux pour calculer vos marges.',
    icon: ShoppingBasket,
    route: '/ingredients',
    cta: 'Ajouter des ingredients',
  },
  {
    id: 'fournisseur',
    label: 'Ajouter un fournisseur',
    description: 'Associez vos fournisseurs a vos ingredients pour suivre les variations de prix.',
    icon: Truck,
    route: '/suppliers',
    cta: 'Ajouter un fournisseur',
  },
  {
    id: 'fiche_technique',
    label: 'Generer une fiche technique',
    description: 'Exportez votre premiere fiche technique avec composition et marges.',
    icon: FileText,
    route: '/recipes',
    cta: 'Voir les fiches',
  },
  {
    id: 'analyse_marge',
    label: 'Analyser vos marges',
    description: 'Consultez votre tableau de bord et identifiez vos plats les plus rentables.',
    icon: BarChart3,
    route: '/analytics',
    cta: 'Voir les analyses',
  },
];

// ── Persistence helpers ──────────────────────────────────────────────────────
export function getChecklistCompleted(): string[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setChecklistCompleted(steps: string[]): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(steps));
}

export function markChecklistStep(stepId: string): void {
  const current = getChecklistCompleted();
  if (!current.includes(stepId)) {
    setChecklistCompleted([...current, stepId]);
  }
}

export function isChecklistAllDone(): boolean {
  const done = getChecklistCompleted();
  return CHECKLIST_STEPS.every(s => done.includes(s.id));
}

// ── Auto-detect completed steps from app state ───────────────────────────────
export function autoDetectChecklistSteps(opts: {
  restaurantName?: string;
  ingredientCount?: number;
  recipeCount?: number;
  supplierCount?: number;
}): void {
  const current = getChecklistCompleted();
  const auto: string[] = [...current];

  if (opts.restaurantName && opts.restaurantName !== 'Mon Restaurant' && opts.restaurantName.trim().length > 0) {
    if (!auto.includes('profil_resto')) auto.push('profil_resto');
  }
  if ((opts.ingredientCount ?? 0) > 0) {
    if (!auto.includes('premier_cout_matiere')) auto.push('premier_cout_matiere');
  }
  if ((opts.recipeCount ?? 0) > 0) {
    if (!auto.includes('premiere_recette')) auto.push('premiere_recette');
    if (!auto.includes('fiche_technique')) auto.push('fiche_technique');
  }
  if ((opts.supplierCount ?? 0) > 0) {
    if (!auto.includes('fournisseur')) auto.push('fournisseur');
  }

  if (auto.length !== current.length) {
    setChecklistCompleted(auto);
  }
}

// ── Props ────────────────────────────────────────────────────────────────────
interface OnboardingChecklistProps {
  restaurantName?: string;
  ingredientCount?: number;
  recipeCount?: number;
  supplierCount?: number;
  variant?: 'sidebar' | 'dashboard' | 'full';
  className?: string;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function OnboardingChecklist({
  restaurantName,
  ingredientCount = 0,
  recipeCount = 0,
  supplierCount = 0,
  variant = 'dashboard',
  className = '',
}: OnboardingChecklistProps) {
  const navigate = useNavigate();

  const [completedSteps, setCompletedSteps] = useState<string[]>(getChecklistCompleted);
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(CHECKLIST_DISMISS_KEY) === '1');
  const [showCelebration, setShowCelebration] = useState(false);

  // Auto-detect steps from real data
  useEffect(() => {
    autoDetectChecklistSteps({ restaurantName, ingredientCount, recipeCount, supplierCount });
    setCompletedSteps(getChecklistCompleted());
  }, [restaurantName, ingredientCount, recipeCount, supplierCount]);

  // Re-read on storage change (cross-tab)
  useEffect(() => {
    function onStorage() {
      setCompletedSteps(getChecklistCompleted());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const progressCount = completedSteps.length;
  const totalCount = CHECKLIST_STEPS.length;
  const progressPercent = Math.round((progressCount / totalCount) * 100);
  const allDone = progressCount >= totalCount;
  const nextStep = CHECKLIST_STEPS.find(s => !completedSteps.includes(s.id));

  // Celebration when complete
  useEffect(() => {
    if (allDone && !dismissed) {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(t);
    }
  }, [allDone, dismissed]);

  const handleStepClick = useCallback((step: ChecklistStep) => {
    navigate(step.route);
  }, [navigate]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(CHECKLIST_DISMISS_KEY, '1');
  }, []);

  // Don't render if dismissed
  if (dismissed) return null;
  if (allDone && !showCelebration) {
    // Auto-dismiss after celebration
    handleDismiss();
    return null;
  }

  // ── Sidebar variant (compact) ─────────────────────────────────────────────
  if (variant === 'sidebar') {
    return (
      <div className={`mx-3 mb-3 ${className}`} role="complementary" aria-label="Progression de la configuration">
        <div className="rounded-xl border border-mono-900 dark:border-mono-200 bg-[#F9FAFB] dark:bg-[#171717] overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls="onboarding-checklist-steps"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-mono-950 dark:hover:bg-mono-200 transition-colors"
          >
            {allDone && showCelebration ? (
              <>
                <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1 text-xs font-semibold text-mono-100 dark:text-white">
                  Bravo ! Tout est configure !
                </span>
              </>
            ) : (
              <>
                <div className="relative w-5 h-5 flex-shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-mono-900 dark:text-[#333333]" />
                    <circle
                      cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeDasharray={`${(progressPercent / 100) * 50.27} 50.27`}
                      className="text-teal-600 transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="flex-1 text-xs font-semibold text-mono-100 dark:text-white">
                  {progressCount}/{totalCount} etapes
                </span>
                <span className="text-[10px] font-medium text-[#9CA3AF] dark:text-mono-500">{progressPercent}%</span>
                {expanded
                  ? <ChevronUp className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-500" aria-hidden="true" />
                  : <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-500" aria-hidden="true" />}
              </>
            )}
          </button>

          <div className="h-1 bg-mono-900 dark:bg-mono-200">
            <div
              className="h-full bg-teal-600 transition-all duration-500 ease-out rounded-r-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progressPercent}% de la configuration terminee`}
            />
          </div>

          {expanded && !allDone && (
            <div id="onboarding-checklist-steps" className="px-3 py-2 space-y-1">
              {CHECKLIST_STEPS.map(step => {
                const done = completedSteps.includes(step.id);
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    aria-label={done ? `${step.label} — complete` : `${step.label} — Aller a ${step.route}`}
                    className={`w-full flex items-center gap-2 py-1.5 px-1 text-left rounded transition-colors ${
                      !done ? 'hover:bg-mono-950 dark:hover:bg-mono-200 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                      done
                        ? 'bg-teal-600 border-0'
                        : 'border border-[#D1D5DB] dark:border-[#555555] bg-transparent'
                    }`}>
                      {done && <Check className="w-2.5 h-2.5 text-white" aria-hidden="true" />}
                    </div>
                    <span className={`text-[11px] leading-tight ${
                      done
                        ? 'text-[#9CA3AF] dark:text-mono-500 line-through'
                        : 'text-mono-100 dark:text-white font-medium'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={handleDismiss}
                aria-label="Masquer la checklist d'onboarding"
                className="text-[10px] text-[#9CA3AF] dark:text-mono-500 hover:text-[#6B7280] dark:hover:text-mono-700 transition-colors mt-1 flex items-center gap-1"
              >
                <X className="w-3 h-3" aria-hidden="true" /> Masquer
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Dashboard / Full variant ──────────────────────────────────────────────
  return (
    <section
      className={`rounded-2xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-black overflow-hidden ${className}`}
      aria-label="Checklist de demarrage"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-mono-100 dark:text-white font-satoshi flex items-center gap-2">
            {allDone && showCelebration ? (
              <>
                <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" />
                Vous etes pret !
              </>
            ) : (
              <>
                Premiers pas avec RestauMargin
              </>
            )}
          </h2>
          <p className="text-sm text-[#9CA3AF] dark:text-mono-500 mt-0.5">
            {allDone
              ? 'Toutes les etapes sont completees. Explorez vos marges !'
              : `${progressCount} sur ${totalCount} etapes completees`}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Masquer la checklist"
          className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors p-1 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-6 mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">{progressPercent}% complete</span>
          <span className="text-xs text-teal-600 font-semibold">{progressCount}/{totalCount}</span>
        </div>
        <div
          className="h-2 bg-mono-950 dark:bg-[#171717] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progression de la configuration: ${progressPercent}%`}
        >
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps grid */}
      {!allDone && (
        <div className="px-6 pb-6 space-y-2" role="list" aria-label="Etapes de configuration">
          {CHECKLIST_STEPS.map((step, index) => {
            const done = completedSteps.includes(step.id);
            const isNext = step.id === nextStep?.id;
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                role="listitem"
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
                  done
                    ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-200/50 dark:border-teal-800/30'
                    : isNext
                    ? 'bg-white dark:bg-mono-50 border-teal-400/60 dark:border-teal-600/40 shadow-sm'
                    : 'bg-mono-1000 dark:bg-mono-50/30 border-mono-900/50 dark:border-mono-200/50 opacity-55'
                }`}
              >
                {/* Step number + check */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  done
                    ? 'bg-teal-500 text-white'
                    : isNext
                    ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-600'
                    : 'bg-mono-900 dark:bg-mono-200 text-[#9CA3AF]'
                }`} aria-hidden="true">
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500">
                      Etape {index + 1}
                    </span>
                    {done && (
                      <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        Complete
                      </span>
                    )}
                    {isNext && !done && (
                      <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-semibold mt-0.5 ${
                    done ? 'text-teal-700 dark:text-teal-300 line-through' : 'text-mono-100 dark:text-white'
                  }`}>
                    {step.label}
                  </p>
                  {isNext && !done && (
                    <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5 leading-snug">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* CTA for next step */}
                {isNext && !done && (
                  <button
                    onClick={() => handleStepClick(step)}
                    aria-label={`${step.cta} — ${step.label}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  >
                    {step.cta}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Celebration state */}
      {allDone && showCelebration && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
            <Trophy className="w-6 h-6 text-amber-500 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                Configuration terminee !
              </p>
              <p className="text-xs text-teal-600/70 dark:text-teal-400/70 mt-0.5">
                Explorez vos marges et optimisez votre carte a partir du tableau de bord.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
