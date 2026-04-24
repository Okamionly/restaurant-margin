import { useState, useMemo } from 'react';
import {
  Activity, TrendingUp, Users, Euro, AlertCircle,
  CheckCircle, Info, RotateCcw, ChevronDown, ChevronUp,
} from 'lucide-react';

interface ChargeFixe {
  label: string;
  montant: number;
}

const CHARGES_DEFAULTS: ChargeFixe[] = [
  { label: 'Loyer', montant: 2500 },
  { label: 'Salaires fixes', montant: 8000 },
  { label: 'Assurances', montant: 400 },
  { label: 'Abonnements & logiciels', montant: 300 },
  { label: 'Amortissements', montant: 600 },
];

function StatCard({
  label, value, sub, accent = false,
}: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-1 ${
      accent
        ? 'bg-teal-600 border-teal-500 text-white'
        : 'bg-white dark:bg-[#0A0A0A]/50 border-[#E5E7EB] dark:border-[#1A1A1A]'
    }`}>
      <span className={`text-xs font-semibold uppercase tracking-wider ${accent ? 'text-teal-100' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
        {label}
      </span>
      <span className={`text-2xl font-bold font-satoshi ${accent ? 'text-white' : 'text-[#111111] dark:text-white'}`}>
        {value}
      </span>
      {sub && (
        <span className={`text-xs ${accent ? 'text-teal-100' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
          {sub}
        </span>
      )}
    </div>
  );
}

export default function BreakevenCalculator() {
  const [charges, setCharges] = useState<ChargeFixe[]>(CHARGES_DEFAULTS);
  const [tauxMargeVariable, setTauxMargeVariable] = useState(68);
  const [ticketMoyen, setTicketMoyen] = useState(22);
  const [joursOuverture, setJoursOuverture] = useState(26);
  const [showDetail, setShowDetail] = useState(false);

  const totalChargesFixes = useMemo(
    () => charges.reduce((acc, c) => acc + (c.montant || 0), 0),
    [charges],
  );

  const results = useMemo(() => {
    if (tauxMargeVariable <= 0 || tauxMargeVariable >= 100 || ticketMoyen <= 0 || joursOuverture <= 0) {
      return null;
    }
    const taux = tauxMargeVariable / 100;
    const caSeuil = totalChargesFixes / taux;
    const couvertsMois = Math.ceil(caSeuil / ticketMoyen);
    const couvertsSemaine = Math.ceil(couvertsMois / 4);
    const couvertsJour = Math.ceil(couvertsMois / joursOuverture);
    const caJour = caSeuil / joursOuverture;
    const marge = caSeuil * taux;
    return { caSeuil, couvertsMois, couvertsSemaine, couvertsJour, caJour, marge };
  }, [totalChargesFixes, tauxMargeVariable, ticketMoyen, joursOuverture]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const updateCharge = (i: number, field: 'label' | 'montant', val: string | number) => {
    setCharges(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const addCharge = () => setCharges(prev => [...prev, { label: 'Nouvelle charge', montant: 0 }]);
  const removeCharge = (i: number) => setCharges(prev => prev.filter((_, idx) => idx !== i));
  const reset = () => { setCharges(CHARGES_DEFAULTS); setTauxMargeVariable(68); setTicketMoyen(22); setJoursOuverture(26); };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-600" />
              Seuil de rentabilité
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Calculez le chiffre d'affaires minimum pour couvrir toutes vos charges.
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

          {/* Inputs left */}
          <div className="space-y-4">

            {/* Charges fixes */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setShowDetail(v => !v)}
              >
                <span className="font-semibold text-[#111111] dark:text-white font-satoshi flex items-center gap-2">
                  <Euro className="w-4 h-4 text-teal-600" />
                  Charges fixes mensuelles
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">{fmt(totalChargesFixes)}</span>
                  {showDetail ? <ChevronUp className="w-4 h-4 text-[#737373]" /> : <ChevronDown className="w-4 h-4 text-[#737373]" />}
                </div>
              </button>

              {showDetail && (
                <div className="mt-4 space-y-2">
                  {charges.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={c.label}
                        onChange={e => updateCharge(i, 'label', e.target.value)}
                        className="flex-1 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-[#111111] dark:text-white"
                      />
                      <input
                        type="number"
                        min={0}
                        value={c.montant}
                        onChange={e => updateCharge(i, 'montant', Number(e.target.value))}
                        className="w-28 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-right text-[#111111] dark:text-white"
                      />
                      <button onClick={() => removeCharge(i)} className="text-[#737373] hover:text-red-500 transition-colors">
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCharge}
                    className="text-xs text-teal-600 hover:text-teal-500 font-medium mt-1 transition-colors"
                  >
                    + Ajouter une charge
                  </button>
                </div>
              )}
            </div>

            {/* Params */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Paramètres
              </h2>

              <div>
                <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 flex items-center gap-1">
                  Taux de marge sur coût variable
                  <span title="(CA - coûts variables) / CA. Typiquement 60-75% en restauration." className="cursor-help">
                    <Info className="w-3 h-3" />
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={1} max={99} value={tauxMargeVariable}
                    onChange={e => setTauxMargeVariable(Number(e.target.value))}
                    className="flex-1 accent-teal-600"
                  />
                  <span className="w-12 text-right font-bold text-teal-600">{tauxMargeVariable}%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">
                  Ticket moyen par couvert (€)
                </label>
                <input
                  type="number" min={1} value={ticketMoyen}
                  onChange={e => setTicketMoyen(Number(e.target.value))}
                  className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">
                  Jours d'ouverture par mois
                </label>
                <input
                  type="number" min={1} max={31} value={joursOuverture}
                  onChange={e => setJoursOuverture(Number(e.target.value))}
                  className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Results right */}
          <div className="space-y-4">
            {results ? (
              <>
                <StatCard label="CA seuil mensuel" value={fmt(results.caSeuil)} sub="Chiffre d'affaires minimum à atteindre" accent />
                <StatCard label="CA seuil par jour" value={fmt(results.caJour)} sub={`Sur ${joursOuverture} jours d'ouverture`} />
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Couverts / mois" value={results.couvertsMois.toString()} />
                  <StatCard label="Couverts / sem." value={results.couvertsSemaine.toString()} />
                  <StatCard label="Couverts / jour" value={results.couvertsJour.toString()} />
                </div>

                {/* Progress bar */}
                <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                      Charges couvertes à l'équilibre
                    </span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="h-2 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-2">
                    Au-delà de {fmt(results.caSeuil)}/mois, chaque euro de CA supplémentaire génère <strong className="text-teal-600">{tauxMargeVariable}c de marge nette</strong>.
                  </p>
                </div>

                {/* Tip */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    En restauration, un taux de marge sur coût variable sain se situe entre <strong>60% et 75%</strong>. En dessous de 60%, revoyez vos coûts matières ou vos prix de vente.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-10 flex flex-col items-center gap-3 text-center">
                <AlertCircle className="w-10 h-10 text-[#E5E7EB] dark:text-[#262626]" />
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
                  Vérifiez vos paramètres pour afficher les résultats.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Methodology note */}
        <div className="text-xs text-[#737373] dark:text-[#525252] text-center">
          Formule : Seuil de rentabilité = Charges fixes ÷ Taux de marge sur coût variable
        </div>
      </div>
    </div>
  );
}
