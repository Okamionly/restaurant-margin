import { useState, useMemo } from 'react';
import { Users, RotateCcw, Info, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface Employe {
  poste: string;
  salaireBrut: number;
}

const EMPLOYES_DEFAULT: Employe[] = [
  { poste: 'Chef de cuisine', salaireBrut: 2800 },
  { poste: 'Commis', salaireBrut: 1800 },
  { poste: 'Serveur', salaireBrut: 1900 },
  { poste: 'Plongeur', salaireBrut: 1700 },
];

const CHARGES_PATRONALES = 0.42;

function pct(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n / 100);
}
function eur(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function RatioGauge({ ratio }: { ratio: number }) {
  const capped = Math.min(ratio, 60);
  const pctWidth = (capped / 60) * 100;
  const color = ratio <= 30 ? 'bg-emerald-500' : ratio <= 35 ? 'bg-amber-400' : 'bg-red-500';
  const label = ratio <= 30 ? 'Excellent' : ratio <= 35 ? 'Acceptable' : 'Trop élevé';
  const textColor = ratio <= 30 ? 'text-emerald-600 dark:text-emerald-400' : ratio <= 35 ? 'text-amber-500' : 'text-red-500';
  const Icon = ratio <= 30 ? TrendingDown : ratio <= 35 ? AlertTriangle : TrendingUp;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
          Ratio masse salariale / CA
        </span>
        <div className={`flex items-center gap-1 font-bold text-sm ${textColor}`}>
          <Icon className="w-4 h-4" />
          {label}
        </div>
      </div>
      <div className="h-3 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pctWidth}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#737373] dark:text-[#A3A3A3]">
        <span>0%</span>
        <span className="font-bold text-lg text-[#111111] dark:text-white">{pct(ratio)}</span>
        <span>60%</span>
      </div>
    </div>
  );
}

const inputCls = 'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

export default function LaborCostCalculator() {
  const [ca, setCa] = useState(45000);
  const [employes, setEmployes] = useState<Employe[]>(EMPLOYES_DEFAULT);

  const totalBrut = useMemo(() => employes.reduce((s, e) => s + (e.salaireBrut || 0), 0), [employes]);
  const totalCharges = useMemo(() => totalBrut * CHARGES_PATRONALES, [totalBrut]);
  const masseSalariale = useMemo(() => totalBrut + totalCharges, [totalBrut, totalCharges]);
  const ratio = useMemo(() => (ca > 0 ? (masseSalariale / ca) * 100 : 0), [masseSalariale, ca]);
  const economiePossible = useMemo(() => Math.max(0, masseSalariale - ca * 0.35), [masseSalariale, ca]);

  const updateEmploye = (i: number, field: keyof Employe, val: string | number) =>
    setEmployes(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  const addEmploye = () => setEmployes(prev => [...prev, { poste: 'Nouveau poste', salaireBrut: 1800 }]);
  const removeEmploye = (i: number) => setEmployes(prev => prev.filter((_, idx) => idx !== i));
  const reset = () => { setEmployes(EMPLOYES_DEFAULT); setCa(45000); };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-600" />
              Coût main d'œuvre
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Calculez le ratio masse salariale / CA et comparez-le aux benchmarks secteur.
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Inputs */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm">CA mensuel</h2>
              <div>
                <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">
                  Chiffre d'affaires mensuel HT (€)
                </label>
                <input
                  type="number" min={0} value={ca}
                  onChange={e => setCa(Number(e.target.value))}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-3">
              <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                Équipe ({employes.length} personne{employes.length > 1 ? 's' : ''})
              </h2>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                Saisissez les salaires bruts — les charges patronales ({Math.round(CHARGES_PATRONALES * 100)}%) sont calculées automatiquement.
              </p>

              {employes.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={e.poste}
                    onChange={ev => updateEmploye(i, 'poste', ev.target.value)}
                    className="flex-1 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Poste"
                  />
                  <input
                    type="number" min={0} value={e.salaireBrut}
                    onChange={ev => updateEmploye(i, 'salaireBrut', Number(ev.target.value))}
                    className="w-28 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-right text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={() => removeEmploye(i)}
                    className="text-[#737373] hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                onClick={addEmploye}
                className="text-xs text-teal-600 hover:text-teal-500 font-medium transition-colors"
              >
                + Ajouter un employé
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="bg-teal-600 border border-teal-500 rounded-2xl p-5 space-y-4 text-white">
              <RatioGauge ratio={ratio} />
              <div className="border-t border-teal-500 pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-teal-100">Salaires bruts</span>
                  <span className="font-semibold">{eur(totalBrut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-100">Charges patronales (42%)</span>
                  <span className="font-semibold">{eur(totalCharges)}</span>
                </div>
                <div className="flex justify-between border-t border-teal-500 pt-2 font-bold text-base">
                  <span>Masse salariale totale</span>
                  <span>{eur(masseSalariale)}</span>
                </div>
              </div>
            </div>

            {economiePossible > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 dark:text-red-300">
                  Pour atteindre le seuil cible de 35%, vous devriez réduire la masse salariale de <strong>{eur(economiePossible)}/mois</strong> (optimisation planning, heures supp., intérim).
                </p>
              </div>
            )}

            {ratio > 0 && ratio <= 35 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl p-4 flex gap-3">
                <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Votre ratio est dans la norme. La restauration traditionnelle vise <strong>&lt; 35%</strong>, la restauration rapide &lt; 28%.
                </p>
              </div>
            )}

            {/* Benchmarks */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600" />
                Benchmarks secteur
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Restauration rapide', min: 25, max: 28, color: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Brasserie / Bistrot', min: 30, max: 35, color: 'text-teal-600 dark:text-teal-400' },
                  { label: 'Restaurant traditionnel', min: 32, max: 38, color: 'text-amber-600 dark:text-amber-400' },
                  { label: 'Gastronomique', min: 38, max: 45, color: 'text-orange-600 dark:text-orange-400' },
                ].map(b => (
                  <div key={b.label} className="flex items-center justify-between text-xs">
                    <span className="text-[#737373] dark:text-[#A3A3A3]">{b.label}</span>
                    <span className={`font-semibold ${b.color}`}>{b.min}% – {b.max}%</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-3 pt-3 border-t border-[#F5F5F5] dark:border-[#1A1A1A]">
                Source : données sectorielles UMIH / GNI 2024. Charges patronales estimées à 42% du brut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
