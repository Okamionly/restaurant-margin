import { useState, useMemo } from 'react';
import { Utensils, Users, TrendingUp, TrendingDown, Info } from 'lucide-react';

const inputClass =
  'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';
const labelClass = 'text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block';

interface Inputs {
  ca: string;
  couverts: string;
  foodCostPct: string;
  personnelPct: string;
  chargesFixesMensuel: string;
  autresVariablesPct: string;
}

const DEFAULTS: Inputs = {
  ca: '30000',
  couverts: '1000',
  foodCostPct: '30',
  personnelPct: '32',
  chargesFixesMensuel: '4500',
  autresVariablesPct: '5',
};

function pct(val: string) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
}
function num(val: string) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : Math.max(0, n);
}

function fmt(n: number, decimals = 2) {
  return n.toFixed(decimals).replace('.', ',');
}

const BAR_COLORS = [
  { bg: 'bg-teal-500', label: 'text-teal-600 dark:text-teal-400' },
  { bg: 'bg-amber-500', label: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-violet-500', label: 'text-violet-600 dark:text-violet-400' },
  { bg: 'bg-rose-400', label: 'text-rose-600 dark:text-rose-400' },
];

export default function CoutCouvert() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);

  const set = (key: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs(prev => ({ ...prev, [key]: e.target.value }));

  const calc = useMemo(() => {
    const ca = num(inputs.ca);
    const couverts = num(inputs.couverts);
    if (ca <= 0 || couverts <= 0) return null;

    const ticketMoyen = ca / couverts;
    const foodCostTotal = ca * (pct(inputs.foodCostPct) / 100);
    const personnelTotal = ca * (pct(inputs.personnelPct) / 100);
    const chargesFixesTotal = num(inputs.chargesFixesMensuel);
    const autresVariablesTotal = ca * (pct(inputs.autresVariablesPct) / 100);

    const totalCharges = foodCostTotal + personnelTotal + chargesFixesTotal + autresVariablesTotal;
    const margeNette = ca - totalCharges;
    const margeNettePct = (margeNette / ca) * 100;

    const foodParCouvert = foodCostTotal / couverts;
    const personnelParCouvert = personnelTotal / couverts;
    const fixesParCouvert = chargesFixesTotal / couverts;
    const autresParCouvert = autresVariablesTotal / couverts;
    const coutTotalParCouvert = foodParCouvert + personnelParCouvert + fixesParCouvert + autresParCouvert;
    const margeParCouvert = ticketMoyen - coutTotalParCouvert;

    const segments = [
      { label: 'Matières premières', value: foodParCouvert, pct: pct(inputs.foodCostPct) },
      { label: 'Personnel', value: personnelParCouvert, pct: pct(inputs.personnelPct) },
      { label: 'Charges fixes', value: fixesParCouvert, pct: (chargesFixesTotal / ca) * 100 },
      { label: 'Autres variables', value: autresParCouvert, pct: pct(inputs.autresVariablesPct) },
    ];

    return {
      ticketMoyen, coutTotalParCouvert, margeParCouvert, margeNettePct,
      segments, margeNette,
    };
  }, [inputs]);

  const margeColor = calc
    ? calc.margeNettePct >= 10
      ? 'text-emerald-600 dark:text-emerald-400'
      : calc.margeNettePct >= 0
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-600 dark:text-red-400'
    : '';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-teal-600" />
            Coût par couvert
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
            Calculez exactement combien vous coûte chaque client servi — et votre marge nette par assiette.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Données mensuelles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Chiffre d'affaires mensuel (€)</label>
              <input type="number" min="0" value={inputs.ca} onChange={set('ca')} placeholder="30000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nombre de couverts / mois</label>
              <input type="number" min="1" value={inputs.couverts} onChange={set('couverts')} placeholder="1000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Food cost % (matières premières)</label>
              <input type="number" min="0" max="100" value={inputs.foodCostPct} onChange={set('foodCostPct')} placeholder="30" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Masse salariale % du CA</label>
              <input type="number" min="0" max="100" value={inputs.personnelPct} onChange={set('personnelPct')} placeholder="32" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Charges fixes mensuelles (€)</label>
              <input type="number" min="0" value={inputs.chargesFixesMensuel} onChange={set('chargesFixesMensuel')} placeholder="4500" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Autres charges variables % du CA</label>
              <input type="number" min="0" max="100" value={inputs.autresVariablesPct} onChange={set('autresVariablesPct')} placeholder="5" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Results */}
        {calc ? (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Ticket moyen', value: `${fmt(calc.ticketMoyen)} €`, icon: Users, color: 'text-teal-600' },
                { label: 'Coût / couvert', value: `${fmt(calc.coutTotalParCouvert)} €`, icon: TrendingDown, color: 'text-rose-500' },
                { label: 'Marge / couvert', value: `${fmt(calc.margeParCouvert)} €`, icon: TrendingUp, color: calc.margeParCouvert >= 0 ? 'text-emerald-500' : 'text-red-500' },
                { label: 'Marge nette %', value: `${fmt(calc.margeNettePct, 1)} %`, icon: TrendingUp, color: calc.margeNettePct >= 10 ? 'text-emerald-500' : calc.margeNettePct >= 0 ? 'text-amber-500' : 'text-red-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium">{label}</span>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className={`text-xl font-black font-satoshi ${color}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Ventilation du coût par couvert</h2>
              <div className="space-y-3">
                {calc.segments.map((seg, i) => (
                  <div key={seg.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-medium ${BAR_COLORS[i].label}`}>{seg.label}</span>
                      <span className="font-semibold text-[#111111] dark:text-white">{fmt(seg.value)} €  <span className="text-[#737373] dark:text-[#A3A3A3]">({fmt(seg.pct, 1)} %)</span></span>
                    </div>
                    <div className="w-full bg-[#F5F5F5] dark:bg-[#262626] rounded-full h-2">
                      <div
                        className={`${BAR_COLORS[i].bg} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.min(100, (seg.value / calc.ticketMoyen) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {/* Marge */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold ${margeColor}`}>Marge nette</span>
                    <span className={`font-bold ${margeColor}`}>{fmt(calc.margeParCouvert)} €  <span className="opacity-70">({fmt(calc.margeNettePct, 1)} %)</span></span>
                  </div>
                  <div className="w-full bg-[#F5F5F5] dark:bg-[#262626] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${calc.margeParCouvert >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.max(0, Math.min(100, (calc.margeParCouvert / calc.ticketMoyen) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advice */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Benchmarks restauration</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'Food cost', target: '28–34 %', current: pct(inputs.foodCostPct), warning: v => v > 36 },
                  { label: 'Masse salariale', target: '30–35 %', current: pct(inputs.personnelPct), warning: v => v > 38 },
                  { label: 'Marge nette', target: '≥ 10 %', current: calc.margeNettePct, warning: v => v < 5 },
                ].map(({ label, target, current, warning }) => (
                  <div key={label} className={`rounded-xl p-3 border ${warning(current) ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-[#F5F5F5] dark:bg-[#262626] border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
                    <div className="font-semibold text-[#111111] dark:text-white mb-0.5">{label}</div>
                    <div className="text-[#737373] dark:text-[#A3A3A3]">Cible : {target}</div>
                    <div className={`font-bold mt-1 ${warning(current) ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      Votre taux : {fmt(current, 1)} % {warning(current) ? '⚠' : '✓'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-10 text-center">
            <Utensils className="w-10 h-10 text-[#E5E7EB] dark:text-[#1A1A1A] mx-auto mb-3" />
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">Renseignez le CA et le nombre de couverts pour voir le résultat.</p>
          </div>
        )}

      </div>
    </div>
  );
}
