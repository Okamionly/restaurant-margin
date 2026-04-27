import { useState, useEffect, useRef } from 'react';
import { Bell, TrendingUp, TrendingDown, X, Eye, ChevronRight } from 'lucide-react';
import { useApiClient } from '../hooks/useApiClient';

interface AffectedRecipe {
  id: number;
  name: string;
  sellingPrice: number;
  costImpact: number;
}

interface PriceAlert {
  id: number;
  alertKey: string;
  ingredientId: number;
  ingredient: {
    id: number;
    name: string;
    unit: string;
    pricePerUnit: number;
    category: string;
    supplier?: string | null;
  };
  supplierName: string | null;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  severity: 'critical' | 'warning' | 'info';
  affectedRecipes: AffectedRecipe[];
  affectedRecipesCount: number;
  records: number;
  lastUpdate: string;
}

export default function AlertsBell() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { authHeaders } = useApiClient();


  async function fetchAlerts() {
    try {
      setLoading(true);
      const res = await fetch('/api/price-history/alerts', { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function dismissAlert(ingredientId: number) {
    try {
      await fetch(`/api/alerts/${ingredientId}/dismiss`, {
        method: 'PUT',
        headers: authHeaders(),
      });
      setAlerts(prev => prev.filter(a => a.ingredientId !== ingredientId));
    } catch {
      // silently fail
    }
  }

  // Fetch alerts on mount and every 5 minutes
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setExpandedAlert(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const severityConfig = {
    critical: {
      border: 'border-l-4 border-l-red-500',
      bg: 'bg-red-500/5',
      badge: 'bg-red-500/20 text-red-400',
      icon: 'text-red-400',
      label: 'Critique',
    },
    warning: {
      border: 'border-l-4 border-l-amber-500',
      bg: 'bg-amber-500/5',
      badge: 'bg-amber-500/20 text-amber-400',
      icon: 'text-amber-400',
      label: 'Attention',
    },
    info: {
      border: 'border-l-4 border-l-teal-500',
      bg: 'bg-teal-500/5',
      badge: 'bg-teal-500/20 text-teal-400',
      icon: 'text-teal-400',
      label: 'Info',
    },
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const totalCount = alerts.length;

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) fetchAlerts(); }}
        className="relative p-2 rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#404040]/50 text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
        aria-label={`Alertes prix${totalCount > 0 ? ` (${totalCount} alertes)` : ''}`}
      >
        <TrendingUp className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
            {totalCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="fixed right-4 top-16 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-2xl z-[60] overflow-hidden"
          style={{ animation: 'slideDown 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#262626]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-[#111111] dark:text-white">Alertes prix</span>
            </div>
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                  {criticalCount} critique{criticalCount > 1 ? 's' : ''}
                </span>
              )}
              <span className="text-[10px] font-bold bg-[#E5E7EB] dark:bg-[#404040] text-[#525252] dark:text-[#D4D4D4] px-2 py-0.5 rounded-full">
                {totalCount} total
              </span>
            </div>
          </div>

          {/* Alerts list */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && alerts.length === 0 && (
              <div className="px-4 py-8 text-center text-[#737373] text-sm">
                Chargement...
              </div>
            )}

            {!loading && alerts.length === 0 && (
              <div className="px-4 py-8 text-center">
                <TrendingUp className="w-8 h-8 text-[#525252] mx-auto mb-2" />
                <p className="text-sm text-[#737373]">Aucune alerte prix</p>
                <p className="text-xs text-[#525252] mt-1">Les prix sont stables ces 30 derniers jours</p>
              </div>
            )}

            {alerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const isUp = alert.changePercent > 0;
              const isExpanded = expandedAlert === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`${config.border} ${config.bg} hover:bg-[#404040]/30 transition-colors`}
                >
                  {/* Main alert row */}
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isUp ? 'bg-red-500/10' : 'bg-emerald-500/10'
                      }`}>
                        {isUp
                          ? <TrendingUp className="w-4 h-4 text-red-400" />
                          : <TrendingDown className="w-4 h-4 text-emerald-400" />
                        }
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[#111111] dark:text-white font-medium truncate">
                            {alert.ingredient.name}
                          </p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${config.badge}`}>
                            {config.label}
                          </span>
                        </div>

                        {alert.supplierName && (
                          <p className="text-xs text-[#737373] mt-0.5 truncate">
                            {alert.supplierName}
                          </p>
                        )}

                        {/* Price change */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-[#A3A3A3]">
                            {alert.oldPrice.toFixed(2)}&euro;
                          </span>
                          <ChevronRight className="w-3 h-3 text-[#525252]" />
                          <span className={`text-xs font-semibold ${isUp ? 'text-red-400' : 'text-emerald-400'}`}>
                            {alert.newPrice.toFixed(2)}&euro;
                          </span>
                          <span className={`text-xs font-bold ${isUp ? 'text-red-400' : 'text-emerald-400'}`}>
                            ({isUp ? '+' : ''}{alert.changePercent}%)
                          </span>
                        </div>

                        {/* Affected recipes count */}
                        {alert.affectedRecipesCount > 0 && (
                          <p className="text-[11px] text-[#737373] mt-1">
                            {alert.affectedRecipesCount} recette{alert.affectedRecipesCount > 1 ? 's' : ''} impactee{alert.affectedRecipesCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedAlert(isExpanded ? null : alert.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#525252]/50 text-[#737373] hover:text-teal-400 transition-colors"
                          title="Voir details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.ingredientId);
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#525252]/50 text-[#737373] hover:text-red-400 transition-colors"
                          title="Ignorer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && alert.affectedRecipes.length > 0 && (
                    <div className="px-4 pb-3 border-t border-[#262626]/30">
                      <p className="text-[11px] font-semibold text-[#A3A3A3] uppercase tracking-wider mt-2 mb-1.5">
                        Recettes impactees
                      </p>
                      <div className="space-y-1">
                        {alert.affectedRecipes.map((recipe: AffectedRecipe) => (
                          <div
                            key={recipe.id}
                            className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#404040]/30"
                          >
                            <span className="text-xs text-[#D4D4D4] truncate flex-1">
                              {recipe.name}
                            </span>
                            <span className={`text-xs font-semibold ml-2 ${
                              recipe.costImpact > 0 ? 'text-red-400' : 'text-emerald-400'
                            }`}>
                              {recipe.costImpact > 0 ? '+' : ''}{recipe.costImpact.toFixed(2)}&euro;
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[#262626]/50 text-center">
              <a
                href="/mercuriale"
                className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                Voir la mercuriale complete
              </a>
            </div>
          )}
        </div>
      )}

      {/* Slide-down animation keyframes */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
