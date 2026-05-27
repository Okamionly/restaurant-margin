import { useState, useMemo } from 'react';
import { TrendingUp, RotateCcw, Info, ArrowRight } from 'lucide-react';

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}
function fmtPct(n: number) {
  return (n * 100).toFixed(1) + ' %';
}

function Field({ label, value, onChange, unit, min = 0, max = 1000000, step = 1 }: {
  label: string; value: number; onChange: (v: number) => void;
  unit: string; min?: number; max?: number; step?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 pr-10 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737373] dark:text-[#A3A3A3]">{unit}</span>
      </div>
    </div>
  );
}

function Kpi({ label, before, after, positive }: { label: string; before: string; after: string; positive?: boolean }) {
  return (
    <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 flex flex-col gap-2">
      <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{label}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-[#111111] dark:text-white">{before}</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#737373] dark:text-[#A3A3A3] shrink-0" />
        <span className={`font-bold ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#111111] dark:text-white'}`}>{after}</span>
      </div>
    </div>
  );
}

const SCENARIOS = [5, 10, 15, 20];

export default function PriceIncreaseSimulator() {
  const [ca, setCa] = useState(30000);
  const [ticket, setTicket] = useState(25);
  const [fc, setFc] = useState(30);
  const [hausse, setHausse] = useState(10);
  const [perte, setPerte] = useState(0);

  const r = useMemo(() => {
    const fcR = fc / 100;
    const hausseR = hausse / 100;
    const perteR = perte / 100;

    const couverts = ticket > 0 ? ca / ticket : 0;
    const costPerCover = ticket * fcR;
    const marginPerCoverBefore = ticket - costPerCover;
    const newTicket = ticket * (1 + hausseR);
    const marginPerCoverAfter = newTicket - costPerCover;
    const newCouverts = couverts * (1 - perteR);

    const marginBefore = couverts * marginPerCoverBefore;
    const marginAfter = newCouverts * marginPerCoverAfter;
    const caAfter = newCouverts * newTicket;

    const breakeven = hausse > 0 && (1 + hausseR - fcR) > 0
      ? hausseR / (1 + hausseR - fcR)
      : 0;

    const newFcRatio = caAfter > 0 ? (newCouverts * costPerCover) / caAfter : fcR;

    return {
      couverts: Math.round(couverts),
      newCouverts: Math.round(newCouverts),
      marginBefore,
      marginAfter,
      marginGain: marginAfter - marginBefore,
      marginGainAnnual: (marginAfter - marginBefore) * 12,
      caAfter,
      newTicket,
      breakeven,
      newFcRatioLabel: fmtPct(newFcRatio),
      fcRatioLabel: fmtPct(fcR),
    };
  }, [ca, ticket, fc, hausse, perte]);

  const reset = () => { setCa(30000); setTicket(25); setFc(30); setHausse(10); setPerte(0); };

  const inputClass = 'bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626]';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              Simulateur hausse des prix
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Simulez l'impact d'une hausse de prix sur votre marge et votre chiffre d'affaires.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        </div>

        {/* Inputs */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm">Situation actuelle</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CA mensuel" value={ca} onChange={setCa} unit="€" step={500} max={10000000} />
            <Field label="Ticket moyen" value={ticket} onChange={setTicket} unit="€" step={0.5} max={10000} />
            <Field label="Food cost (coût matières)" value={fc} onChange={setFc} unit="%" min={1} max={99} step={0.5} />
            <Field label="Hausse de prix souhaitée" value={hausse} onChange={setHausse} unit="%" min={1} max={100} step={0.5} />
          </div>
        </div>

        {/* Elasticity slider */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm">
              Perte de clientèle estimée
            </h2>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{perte} %</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={perte}
            onChange={e => setPerte(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <div className="flex items-center gap-2 text-xs text-[#737373] dark:text-[#A3A3A3]">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              Point mort : vous pouvez perdre jusqu'à{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">{fmtPct(r.breakeven)}</strong>{' '}
              de clients avant que la marge ne diminue.
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Kpi label="CA mensuel" before={fmt(ca)} after={fmt(r.caAfter)} />
          <Kpi label="Ticket moyen" before={fmt(ticket)} after={fmt(r.newTicket)} />
          <Kpi label="Marge mensuelle" before={fmt(r.marginBefore)} after={fmt(r.marginAfter)} positive />
          <Kpi label="Food cost ratio" before={r.fcRatioLabel} after={r.newFcRatioLabel} />
        </div>

        {/* Gain summary */}
        <div className={`rounded-2xl p-5 border ${r.marginGain >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900'}`}>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-1">Gain de marge</p>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Par mois</p>
              <p className={`text-2xl font-bold font-satoshi ${r.marginGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {r.marginGain >= 0 ? '+' : ''}{fmt(r.marginGain)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Par an</p>
              <p className={`text-2xl font-bold font-satoshi ${r.marginGainAnnual >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {r.marginGainAnnual >= 0 ? '+' : ''}{fmt(r.marginGainAnnual)}
              </p>
            </div>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] self-end pb-1">
              avec {perte > 0 ? `${perte}% de couverts en moins` : 'même fréquentation'}
            </p>
          </div>
        </div>

        {/* Sensitivity table */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
          <h3 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm mb-3">
            Tableau de sensibilité — gains à fréquentation constante
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  {['Hausse', 'Nouveau ticket', 'Gain/mois', 'Gain/an', 'Point mort clients'].map(h => (
                    <th key={h} className="pb-2 font-semibold text-[#737373] dark:text-[#A3A3A3] pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5] dark:divide-[#1A1A1A]">
                {SCENARIOS.map(pct => {
                  const h = pct / 100;
                  const fcR = fc / 100;
                  const couverts = ticket > 0 ? ca / ticket : 0;
                  const newT = ticket * (1 + h);
                  const costPer = ticket * fcR;
                  const gainMonth = couverts * (newT - costPer) - couverts * (ticket - costPer);
                  const bk = h / (1 + h - fcR);
                  const isSelected = pct === hausse;
                  return (
                    <tr key={pct} className={isSelected ? 'bg-teal-50 dark:bg-teal-900/10' : ''}>
                      <td className="py-2 pr-4 font-bold text-teal-600 dark:text-teal-400">{pct} %</td>
                      <td className="py-2 pr-4 text-[#111111] dark:text-white">{fmt(newT)}</td>
                      <td className="py-2 pr-4 font-medium text-emerald-600 dark:text-emerald-400">+{fmt(gainMonth)}</td>
                      <td className="py-2 pr-4 font-medium text-emerald-600 dark:text-emerald-400">+{fmt(gainMonth * 12)}</td>
                      <td className="py-2 text-[#111111] dark:text-white">{fmtPct(bk)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-3 border-t border-[#F5F5F5] dark:border-[#1A1A1A] pt-3">
            Calcul basé sur un food cost constant. Le "point mort clients" est le taux de perte au-delà duquel la marge totale diminue.
          </p>
        </div>

      </div>
    </div>
  );
}
