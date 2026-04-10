import { formatCurrency } from '../utils/currency';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays, Users, TrendingUp, ShoppingCart,
  ChevronDown, ChevronUp, Package, Truck, Euro,
} from 'lucide-react';

// ── Forecast data ──────────────────────────────────────────────────────────

interface DayForecast {
  key: string;
  label: string;
  short: string;
  covers: number;
  level: 'calme' | 'normal' | 'occupé' | 'très occupé' | 'complet' | 'brunch';
  avgTicket: number;
  staff: number;
}

const FORECAST_DATA: DayForecast[] = [
  { key: 'lun', label: 'Lundi',    short: 'Lun', covers: 45,  level: 'calme',      avgTicket: 22, staff: 3 },
  { key: 'mar', label: 'Mardi',    short: 'Mar', covers: 52,  level: 'normal',     avgTicket: 24, staff: 4 },
  { key: 'mer', label: 'Mercredi', short: 'Mer', covers: 60,  level: 'normal',     avgTicket: 24, staff: 4 },
  { key: 'jeu', label: 'Jeudi',    short: 'Jeu', covers: 65,  level: 'occupé',     avgTicket: 26, staff: 5 },
  { key: 'ven', label: 'Vendredi', short: 'Ven', covers: 85,  level: 'très occupé', avgTicket: 28, staff: 6 },
  { key: 'sam', label: 'Samedi',   short: 'Sam', covers: 95,  level: 'complet',    avgTicket: 32, staff: 7 },
  { key: 'dim', label: 'Dimanche', short: 'Dim', covers: 70,  level: 'brunch',     avgTicket: 26, staff: 5 },
];

const LEVEL_CONFIG: Record<string, { color: string; bg: string; barColor: string; badge: string }> = {
  'calme':       { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', barColor: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
  'normal':      { color: 'text-amber-700 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-900/20',    barColor: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  'occupé':      { color: 'text-orange-700 dark:text-orange-400',  bg: 'bg-orange-50 dark:bg-orange-900/20',  barColor: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
  'très occupé': { color: 'text-red-700 dark:text-red-400',        bg: 'bg-red-50 dark:bg-red-900/20',        barColor: 'bg-red-500',     badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  'complet':     { color: 'text-red-800 dark:text-red-300',        bg: 'bg-red-100 dark:bg-red-900/30',       barColor: 'bg-red-600',     badge: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
  'brunch':      { color: 'text-purple-700 dark:text-purple-400',  bg: 'bg-purple-50 dark:bg-purple-900/20',  barColor: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
};

// ── Suggested order data ───────────────────────────────────────────────────

interface SuggestedIngredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  supplier: string;
  urgency: 'normal' | 'élevé';
}

const SUGGESTED_ORDER: SuggestedIngredient[] = [
  { id: 1,  name: 'Filet de boeuf',     quantity: 18,  unit: 'kg',    estimatedCost: 396.00, supplier: 'Fournisseur A', urgency: 'élevé' },
  { id: 2,  name: 'Saumon frais',        quantity: 12,  unit: 'kg',    estimatedCost: 204.00, supplier: 'Fournisseur B', urgency: 'élevé' },
  { id: 3,  name: 'Crème fraîche',       quantity: 25,  unit: 'L',     estimatedCost: 95.00,  supplier: 'Fournisseur A', urgency: 'normal' },
  { id: 4,  name: 'Beurre AOP',          quantity: 15,  unit: 'kg',    estimatedCost: 187.50, supplier: 'Fournisseur A', urgency: 'normal' },
  { id: 5,  name: 'Légumes de saison',   quantity: 30,  unit: 'kg',    estimatedCost: 120.00, supplier: 'Fournisseur C', urgency: 'élevé' },
  { id: 6,  name: 'Pommes de terre',     quantity: 40,  unit: 'kg',    estimatedCost: 52.00,  supplier: 'Fournisseur B', urgency: 'normal' },
  { id: 7,  name: 'Oeufs bio',           quantity: 240, unit: 'pièce', estimatedCost: 84.00,  supplier: 'Fournisseur A', urgency: 'normal' },
  { id: 8,  name: 'Farine T55',          quantity: 20,  unit: 'kg',    estimatedCost: 24.00,  supplier: 'Fournisseur A', urgency: 'normal' },
  { id: 9,  name: 'Huile d\'olive EVOO', quantity: 8,   unit: 'L',     estimatedCost: 72.00,  supplier: 'Fournisseur C', urgency: 'normal' },
  { id: 10, name: 'Chocolat Valrhona',   quantity: 5,   unit: 'kg',    estimatedCost: 95.00,  supplier: 'Fournisseur A', urgency: 'normal' },
];

// ── Helper ─────────────────────────────────────────────────────────────────

function fmtEuro(n: number) {
  return formatCurrency(n);
}

// ── Component ──────────────────────────────────────────────────────────────

export default function DemandForecast() {
  const [orderExpanded, setOrderExpanded] = useState(false);
  const [orderGenerated, setOrderGenerated] = useState(false);
  const navigate = useNavigate();

  const maxCovers = Math.max(...FORECAST_DATA.map(d => d.covers));
  const totalCovers = FORECAST_DATA.reduce((s, d) => s + d.covers, 0);
  const totalCA = FORECAST_DATA.reduce((s, d) => s + d.covers * d.avgTicket, 0);
  const totalOrderCost = SUGGESTED_ORDER.reduce((s, i) => s + i.estimatedCost, 0);

  const handleGenerateOrder = () => {
    setOrderGenerated(true);
    setTimeout(() => navigate('/commandes'), 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* ── Prévisions de la semaine ─────────────────────────────────── */}
      <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#262626] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-[#262626] dark:text-white">
              Prévisions de la semaine
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#A3A3A3] dark:text-[#A3A3A3]">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {totalCovers} couverts
            </span>
            <span className="flex items-center gap-1">
              <Euro className="w-3.5 h-3.5" />
              {fmtEuro(totalCA)}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-4">
          Estimation basée sur les tendances historiques par jour
        </p>

        {/* Day rows */}
        <div className="space-y-2.5">
          {FORECAST_DATA.map(day => {
            const cfg = LEVEL_CONFIG[day.level];
            const pct = (day.covers / maxCovers) * 100;
            const caDay = day.covers * day.avgTicket;

            return (
              <div
                key={day.key}
                className={`flex items-center gap-3 p-2.5 rounded-lg ${cfg.bg} transition-colors`}
              >
                {/* Day label */}
                <div className="w-20 flex-shrink-0">
                  <span className="text-sm font-semibold text-[#404040] dark:text-[#E5E7EB]">
                    {day.label}
                  </span>
                </div>

                {/* Bar */}
                <div className="flex-1 min-w-0">
                  <div className="h-6 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${cfg.barColor} transition-all duration-700 ease-out flex items-center`}
                      style={{ width: `${pct}%` }}
                    >
                      <span className="text-[10px] font-bold text-white ml-2 whitespace-nowrap drop-shadow-sm">
                        {day.covers} couverts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Level badge */}
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cfg.badge}`}>
                  {day.level}
                </span>

                {/* CA + Staff */}
                <div className="flex-shrink-0 text-right w-24 hidden sm:block">
                  <p className="text-xs font-semibold text-[#404040] dark:text-[#D4D4D4]">
                    {fmtEuro(caDay)}
                  </p>
                  <p className="text-[10px] text-[#A3A3A3] dark:text-[#A3A3A3]">
                    {day.staff} pers.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Staff summary */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#262626]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Personnel recommandé
            </span>
            <span className="text-[#737373] dark:text-[#A3A3A3] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              CA estimé hebdo
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1.5">
              {FORECAST_DATA.map(day => (
                <div
                  key={day.key}
                  className="flex flex-col items-center"
                  title={`${day.label}: ${day.staff} personnes`}
                >
                  <span className="text-[10px] text-[#A3A3A3] dark:text-[#A3A3A3]">{day.short}</span>
                  <span className="text-xs font-bold text-[#404040] dark:text-[#D4D4D4]">{day.staff}</span>
                </div>
              ))}
            </div>
            <span className="text-lg font-bold text-[#262626] dark:text-white">{fmtEuro(totalCA)}</span>
          </div>
        </div>
      </div>

      {/* ── Commande suggérée ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#262626] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-[#262626] dark:text-white">
              Commande suggérée
            </h3>
          </div>
          <button
            onClick={() => setOrderExpanded(!orderExpanded)}
            className="text-xs text-[#A3A3A3] dark:text-[#A3A3A3] hover:text-[#525252] dark:hover:text-[#D4D4D4] flex items-center gap-1 transition-colors"
          >
            {orderExpanded ? 'Réduire' : 'Voir tout'}
            {orderExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-3">
          Basée sur {totalCovers} couverts prévus cette semaine
        </p>

        {/* Ingredient list */}
        <div className="space-y-1.5">
          {(orderExpanded ? SUGGESTED_ORDER : SUGGESTED_ORDER.slice(0, 5)).map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#FAFAFA] dark:bg-[#404040]/50 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors"
            >
              <Package className="w-4 h-4 text-[#A3A3A3] dark:text-[#A3A3A3] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#404040] dark:text-[#E5E7EB] truncate">
                    {item.name}
                  </span>
                  {item.urgency === 'élevé' && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                      Urgent
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#A3A3A3] dark:text-[#A3A3A3]">
                  {item.supplier}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4]">
                  {item.quantity} {item.unit}
                </p>
                <p className="text-[10px] text-[#A3A3A3] dark:text-[#A3A3A3]">
                  {fmtEuro(item.estimatedCost)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!orderExpanded && SUGGESTED_ORDER.length > 5 && (
          <button
            onClick={() => setOrderExpanded(true)}
            className="w-full mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline text-center py-1"
          >
            +{SUGGESTED_ORDER.length - 5} autres ingrédients
          </button>
        )}

        {/* Total + Generate button */}
        <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#262626]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Coût total estimé</p>
              <p className="text-xl font-bold text-[#262626] dark:text-white">{fmtEuro(totalOrderCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{SUGGESTED_ORDER.length} articles</p>
              <p className="text-xs text-[#A3A3A3] dark:text-[#A3A3A3]">
                {new Set(SUGGESTED_ORDER.map(i => i.supplier)).size} fournisseurs
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateOrder}
            disabled={orderGenerated}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${orderGenerated
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
              }`}
          >
            {orderGenerated ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Commande créée ! Redirection...
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                Générer la commande
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
