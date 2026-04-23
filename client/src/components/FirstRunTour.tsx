import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

// ── Storage ──────────────────────────────────────────────────────────────────
const TOUR_KEY = 'restaumargin_first_run_tour_v1';

export function hasTourBeenSeen(): boolean {
  return localStorage.getItem(TOUR_KEY) === 'done';
}

export function markTourAsSeen(): void {
  localStorage.setItem(TOUR_KEY, 'done');
}

// ── Tour step type ────────────────────────────────────────────────────────────
interface TourStep {
  id: string;
  title: string;
  description: string;
  targetId: string; // data-tour-id attribute on the target element
  position: 'top' | 'bottom' | 'left' | 'right';
}

// ── Steps: 4 spotlights on main dashboard CTAs ────────────────────────────────
const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard-kpis',
    title: 'Vos marges en temps reel',
    description: 'Ici, suivez votre food cost, votre marge brute et votre coefficient multiplicateur. Ces indicateurs sont calcules automatiquement depuis vos recettes.',
    targetId: 'tour-kpis',
    position: 'bottom',
  },
  {
    id: 'quick-actions',
    title: 'Actions rapides',
    description: 'Ajoutez un ingredient, creez une recette ou scannez une facture en un clic. Ce sont les actions les plus utilisees chaque jour.',
    targetId: 'tour-quick-actions',
    position: 'top',
  },
  {
    id: 'ai-assistant',
    title: 'Votre copilote IA',
    description: 'Dictez a la voix ou tapez vos questions : "Quelle est ma marge sur la quiche lorraine ?" ou "Suggere-moi une optimisation". 19 actions disponibles.',
    targetId: 'tour-ai-btn',
    position: 'left',
  },
  {
    id: 'onboarding-checklist',
    title: 'Checklist de demarrage',
    description: 'Completez ces 6 etapes pour configurer votre restaurant. Chaque etape debloque des insights supplementaires sur vos marges.',
    targetId: 'tour-checklist',
    position: 'top',
  },
];

// ── Overlay + Spotlight ────────────────────────────────────────────────────────
interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getElementRect(targetId: string): SpotlightRect | null {
  const el = document.querySelector(`[data-tour-id="${targetId}"]`);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
}

// ── Tooltip position calculation ──────────────────────────────────────────────
function getTooltipStyle(
  rect: SpotlightRect | null,
  position: TourStep['position'],
  tooltipRef: React.RefObject<HTMLDivElement | null>
): React.CSSProperties {
  if (!rect) {
    // Center fallback
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  const PADDING = 12;
  const tooltipW = tooltipRef.current?.offsetWidth ?? 320;
  const tooltipH = tooltipRef.current?.offsetHeight ?? 160;

  const style: React.CSSProperties = { position: 'fixed' };

  switch (position) {
    case 'bottom':
      style.top = rect.top - window.scrollY + rect.height + PADDING;
      style.left = Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 8));
      break;
    case 'top':
      style.top = Math.max(8, rect.top - window.scrollY - tooltipH - PADDING);
      style.left = Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 8));
      break;
    case 'right':
      style.top = rect.top - window.scrollY + rect.height / 2 - tooltipH / 2;
      style.left = rect.left + rect.width + PADDING;
      break;
    case 'left':
      style.top = rect.top - window.scrollY + rect.height / 2 - tooltipH / 2;
      style.left = Math.max(8, rect.left - tooltipW - PADDING);
      break;
  }

  return style;
}

// ── Component ─────────────────────────────────────────────────────────────────
interface FirstRunTourProps {
  onClose?: () => void;
}

export default function FirstRunTour({ onClose }: FirstRunTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  // Measure target on step change + resize
  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const r = getElementRect(currentStep.targetId);
    setRect(r);
  }, [currentStep]);

  useEffect(() => {
    // Small delay to let DOM settle
    const t = setTimeout(measureTarget, 80);
    window.addEventListener('resize', measureTarget);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measureTarget);
    };
  }, [measureTarget]);

  const handleClose = useCallback(() => {
    markTourAsSeen();
    onClose?.();
  }, [onClose]);

  const handleNext = useCallback(() => {
    if (isLast) {
      handleClose();
    } else {
      setStep(s => s + 1);
    }
  }, [isLast, handleClose]);

  const handlePrev = useCallback(() => {
    if (!isFirst) setStep(s => s - 1);
  }, [isFirst]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose, handleNext, handlePrev]);

  if (!currentStep) return null;

  const tooltipStyle = getTooltipStyle(rect, currentStep.position, tooltipRef);

  const SPOTLIGHT_PADDING = 8;

  return (
    <div
      className="fixed inset-0 z-[300]"
      role="dialog"
      aria-modal="true"
      aria-label={`Visite guidee — etape ${step + 1} sur ${TOUR_STEPS.length}: ${currentStep.title}`}
    >
      {/* Dark overlay with spotlight cutout */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - window.scrollX - SPOTLIGHT_PADDING}
                y={rect.top - window.scrollY - SPOTLIGHT_PADDING}
                width={rect.width + SPOTLIGHT_PADDING * 2}
                height={rect.height + SPOTLIGHT_PADDING * 2}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask="url(#tour-spotlight-mask)"
        />
        {/* Spotlight ring */}
        {rect && (
          <rect
            x={rect.left - window.scrollX - SPOTLIGHT_PADDING}
            y={rect.top - window.scrollY - SPOTLIGHT_PADDING}
            width={rect.width + SPOTLIGHT_PADDING * 2}
            height={rect.height + SPOTLIGHT_PADDING * 2}
            rx="12"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px rgba(13,148,136,0.6))' }}
          />
        )}
      </svg>

      {/* Click-through backdrop (clicking outside closes) */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 2 }}
        onClick={handleClose}
        aria-label="Fermer la visite guidee"
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute w-[320px] max-w-[calc(100vw-24px)] bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-2xl p-5"
        style={{ ...tooltipStyle, zIndex: 3 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600/10 dark:bg-teal-400/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {step + 1} / {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fermer la visite guidee"
            className="text-[#9CA3AF] hover:text-[#6B7280] dark:hover:text-[#A3A3A3] transition-colors p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-1.5">
          {currentStep.title}
        </h3>
        <p className="text-sm text-[#525252] dark:text-[#A3A3A3] leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4" aria-hidden="true">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? 'bg-teal-600 w-5'
                  : i < step
                  ? 'bg-teal-400 w-1.5'
                  : 'bg-[#D1D5DB] dark:bg-[#333333] w-1.5'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {!isFirst ? (
            <button
              onClick={handlePrev}
              aria-label="Etape precedente"
              className="flex items-center gap-1 text-sm font-medium text-[#9CA3AF] hover:text-[#6B7280] dark:hover:text-[#A3A3A3] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded px-1"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Precedent
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded px-1"
            >
              Passer
            </button>
          )}
          <button
            onClick={handleNext}
            aria-label={isLast ? 'Terminer la visite guidee' : 'Etape suivante'}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            {isLast ? "C'est parti !" : 'Suivant'}
            {!isLast && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}
