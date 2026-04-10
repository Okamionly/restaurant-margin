import { useState, useEffect, useCallback } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// ── Storage key ──────────────────────────────────────────────────────────────
const TOOLTIPS_KEY = 'contextual-tooltips-shown';

// ── Tooltip definitions per route ────────────────────────────────────────────
interface TooltipConfig {
  route: string;
  message: string;
  position: 'top' | 'bottom';
}

const TOOLTIPS: TooltipConfig[] = [
  {
    route: '/dashboard',
    message: 'Voici votre tableau de bord. Les KPIs se remplissent automatiquement a mesure que vous ajoutez des recettes et ingredients.',
    position: 'top',
  },
  {
    route: '/ingredients',
    message: 'Ajoutez vos ingredients avec leurs prix pour calculer vos couts. L\'IA peut suggerer les prix du marche.',
    position: 'top',
  },
  {
    route: '/recipes',
    message: 'Creez vos fiches techniques ici. L\'IA peut suggerer les ingredients et optimiser vos marges automatiquement.',
    position: 'top',
  },
  {
    route: '/suppliers',
    message: 'Gerez vos fournisseurs et comparez les prix. Liez-les a vos ingredients pour un suivi precis.',
    position: 'top',
  },
  {
    route: '/inventory',
    message: 'Suivez votre stock en temps reel. Les alertes de stock bas se declenchent automatiquement.',
    position: 'top',
  },
  {
    route: '/menu',
    message: 'Construisez votre carte ici. Glissez-deposez vos recettes et fixez vos prix de vente.',
    position: 'top',
  },
  {
    route: '/analytics',
    message: 'Analysez vos performances : marges, food cost, rentabilite par plat. Tout se calcule automatiquement.',
    position: 'top',
  },
  {
    route: '/scanner-factures',
    message: 'Scannez vos factures fournisseurs. L\'IA extrait les prix et met a jour vos ingredients automatiquement.',
    position: 'top',
  },
  {
    route: '/station',
    message: 'Pesez vos ingredients directement avec une balance connectee pour des fiches techniques ultra-precises.',
    position: 'top',
  },
  {
    route: '/kitchen-mode',
    message: 'Affichez les fiches techniques en cuisine sur tablette — les equipes suivent chaque etape en temps reel.',
    position: 'top',
  },
  {
    route: '/service-tracker',
    message: 'Suivez le service en direct : plats envoyes, temps de preparation et performance de chaque poste.',
    position: 'top',
  },
];

function getShownTooltips(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(TOOLTIPS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

function markTooltipShown(route: string): void {
  const shown = getShownTooltips();
  shown[route] = true;
  localStorage.setItem(TOOLTIPS_KEY, JSON.stringify(shown));
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ContextualTooltips() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipConfig | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    const shown = getShownTooltips();

    // Find matching tooltip
    const match = TOOLTIPS.find(t => {
      if (t.route === '/dashboard' && (path === '/' || path === '/dashboard')) return true;
      return path === t.route;
    });

    if (match && !shown[match.route]) {
      // Small delay before showing
      const timer = setTimeout(() => {
        setTooltip(match);
        setVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      setTooltip(null);
    }
  }, [location.pathname]);

  const dismiss = useCallback(() => {
    if (!tooltip) return;
    setFading(true);
    setTimeout(() => {
      markTooltipShown(tooltip.route);
      setVisible(false);
      setFading(false);
      setTooltip(null);
    }, 300);
  }, [tooltip]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (visible && tooltip) {
      const timer = setTimeout(dismiss, 8000);
      return () => clearTimeout(timer);
    }
  }, [visible, tooltip, dismiss]);

  if (!visible || !tooltip) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[calc(100%-2rem)] transition-all duration-300 ${
        fading ? 'opacity-0 translate-y-[-8px]' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-2xl shadow-2xl border border-[#333333] dark:border-[#E5E7EB] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 dark:bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-relaxed">{tooltip.message}</p>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors flex-shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#111111] dark:bg-white border-l border-t border-[#333333] dark:border-[#E5E7EB]" />
      </div>
    </div>
  );
}
