import { useState, useMemo } from 'react';
import { Calculator, RotateCcw, ArrowLeftRight, Info } from 'lucide-react';

type Direction = 'ht_to_ttc' | 'ttc_to_ht';

const TVA_RATES = [
  {
    key: 'sur_place',
    label: 'Sur place',
    rate: 0.10,
    badge: '10 %',
    color: 'teal',
    examples: 'Repas, boissons non-alcoolisées consommés sur place',
  },
  {
    key: 'a_emporter',
    label: 'À emporter',
    rate: 0.055,
    badge: '5,5 %',
    color: 'emerald',
    examples: 'Plats, sandwichs, boissons non-alcoolisées à emporter',
  },
  {
    key: 'alcool',
    label: 'Alcool',
    rate: 0.20,
    badge: '20 %',
    color: 'amber',
    examples: 'Toutes boissons alcoolisées (sur place et à emporter)',
  },
] as const;

function fmt(n: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function RateCard({
  label, badge, color, examples, rate, amount, direction,
}: {
  label: string; badge: string; color: string; examples: string;
  rate: number; amount: number; direction: Direction;
}) {
  const ht = direction === 'ht_to_ttc' ? amount : amount / (1 + rate);
  const tva = ht * rate;
  const ttc = ht + tva;

  const borderColor = color === 'teal' ? 'border-teal-200 dark:border-teal-900' :
    color === 'emerald' ? 'border-emerald-200 dark:border-emerald-900' :
    'border-amber-200 dark:border-amber-900';
  const badgeBg = color === 'teal' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' :
    color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
    'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300';
  const accentText = color === 'teal' ? 'text-teal-600 dark:text-teal-400' :
    color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
    'text-amber-600 dark:text-amber-400';

  return (
    <div className={`bg-white dark:bg-[#0A0A0A]/50 border ${borderColor} rounded-2xl p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-[#111111] dark:text-white font-satoshi">{label}</p>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">{examples}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBg}`}>{badge}</span>
      </div>

      {amount > 0 ? (
        <div className="space-y-2">
          <Row label="Montant HT" value={fmt(ht)} />
          <Row label={`TVA (${badge})`} value={fmt(tva)} accent={accentText} />
          <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-2">
            <Row label="Montant TTC" value={fmt(ttc)} bold />
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#737373] dark:text-[#A3A3A3] text-center py-2">
          Saisissez un montant pour calculer.
        </p>
      )}
    </div>
  );
}

function Row({ label, value, accent, bold }: { label: string; value: string; accent?: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#737373] dark:text-[#A3A3A3]">{label}</span>
      <span className={`font-${bold ? 'bold' : 'medium'} ${accent ?? 'text-[#111111] dark:text-white'}`}>{value}</span>
    </div>
  );
}

const DEFAULTS = { amount: 100 };

export default function TvaCalculator() {
  const [raw, setRaw] = useState(String(DEFAULTS.amount));
  const [direction, setDirection] = useState<Direction>('ht_to_ttc');

  const amount = useMemo(() => {
    const n = parseFloat(raw.replace(',', '.'));
    return isNaN(n) || n < 0 ? 0 : n;
  }, [raw]);

  const reset = () => {
    setRaw(String(DEFAULTS.amount));
    setDirection('ht_to_ttc');
  };

  const inputClass =
    'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-teal-600" />
              Calculateur TVA restauration
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Convertissez HT ↔ TTC selon les 3 taux applicables en restauration.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        </div>

        {/* Input panel */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm">Votre montant</h2>

          {/* Direction toggle */}
          <div className="flex gap-2">
            {([
              { key: 'ht_to_ttc', label: 'HT → TTC' },
              { key: 'ttc_to_ht', label: 'TTC → HT' },
            ] as const).map(opt => (
              <button
                key={opt.key}
                onClick={() => setDirection(opt.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  direction === opt.key
                    ? 'bg-teal-600 border-teal-500 text-white'
                    : 'bg-[#F5F5F5] dark:bg-[#262626] border-[#E5E7EB] dark:border-[#262626] text-[#737373] dark:text-[#A3A3A3] hover:border-teal-500'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">
              Montant {direction === 'ht_to_ttc' ? 'HT' : 'TTC'} (€)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={raw}
              onChange={e => setRaw(e.target.value)}
              placeholder="Ex: 100"
              className={inputClass}
            />
          </div>
        </div>

        {/* Results by rate */}
        <div className="grid sm:grid-cols-3 gap-4">
          {TVA_RATES.map(({ key, ...rest }) => (
            <RateCard key={key} {...rest} amount={amount} direction={direction} />
          ))}
        </div>

        {/* Reference table */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
          <h3 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-teal-600" />
            Tableau de référence TVA restauration
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <th className="pb-2 font-semibold text-[#737373] dark:text-[#A3A3A3] pr-4">Produit / Service</th>
                  <th className="pb-2 font-semibold text-[#737373] dark:text-[#A3A3A3] text-center">Sur place</th>
                  <th className="pb-2 font-semibold text-[#737373] dark:text-[#A3A3A3] text-center">À emporter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5] dark:divide-[#1A1A1A]">
                {[
                  { item: 'Repas (nourriture)', surplace: '10 %', emporter: '5,5 %' },
                  { item: 'Boissons non-alcoolisées', surplace: '10 %', emporter: '5,5 %' },
                  { item: 'Boissons alcoolisées', surplace: '20 %', emporter: '20 %' },
                  { item: 'Confiseries, chocolats', surplace: '20 %', emporter: '20 %' },
                  { item: 'Sandwichs froids', surplace: '10 %', emporter: '5,5 %' },
                  { item: 'Glaces artisanales', surplace: '10 %', emporter: '5,5 %' },
                ].map(row => (
                  <tr key={row.item}>
                    <td className="py-2 pr-4 text-[#111111] dark:text-white">{row.item}</td>
                    <td className="py-2 text-center font-medium text-teal-600 dark:text-teal-400">{row.surplace}</td>
                    <td className="py-2 text-center font-medium text-emerald-600 dark:text-emerald-400">{row.emporter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-3 border-t border-[#F5F5F5] dark:border-[#1A1A1A] pt-3">
            Source : BOFiP — CGI art. 279, valide en France métropolitaine. En cas de doute, consultez votre expert-comptable.
          </p>
        </div>

      </div>
    </div>
  );
}
