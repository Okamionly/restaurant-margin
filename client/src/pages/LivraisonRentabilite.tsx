import { useState, useMemo } from 'react';
import { Bike, TrendingDown, TrendingUp, Info, AlertTriangle } from 'lucide-react';

const inputClass =
  'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';
const labelClass = 'text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block';

interface Canal {
  nom: string;
  pct: string;
  commission: string;
  color: string;
  barColor: string;
}

const DEFAULTS: Canal[] = [
  { nom: 'Uber Eats', pct: '40', commission: '27', color: 'text-orange-500', barColor: 'bg-orange-400' },
  { nom: 'Deliveroo', pct: '30', commission: '25', color: 'text-teal-600', barColor: 'bg-teal-500' },
  { nom: 'Just Eat', pct: '15', commission: '20', color: 'text-rose-500', barColor: 'bg-rose-400' },
  { nom: 'En direct', pct: '15', commission: '0', color: 'text-emerald-600', barColor: 'bg-emerald-500' },
];

function num(v: string): number {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : Math.max(0, n);
}
function pct(v: string): number {
  return Math.min(100, Math.max(0, num(v)));
}
function fmt(n: number, d = 0): string {
  return n.toFixed(d).replace('.', ',');
}

export default function LivraisonRentabilite() {
  const [caMensuel, setCaMensuel] = useState('10000');
  const [foodCostPct, setFoodCostPct] = useState('45');
  const [canaux, setCanaux] = useState<Canal[]>(DEFAULTS);

  const setCanal = (i: number, key: keyof Canal) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanaux(prev => prev.map((c, idx): Canal => idx === i ? { ...c, [key]: e.target.value } : c));
  };

  const totalPct = canaux.reduce((s, c) => s + pct(c.pct), 0);

  const calc = useMemo(() => {
    const ca = num(caMensuel);
    const fc = pct(foodCostPct) / 100;
    if (ca <= 0) return null;

    const rows = canaux.map(c => {
      const caBrut = ca * (pct(c.pct) / 100);
      const commissionEuros = caBrut * (pct(c.commission) / 100);
      const caNet = caBrut - commissionEuros;
      const coutVariable = caBrut * fc;
      const margeNette = caNet - coutVariable;
      const margeNettePct = caBrut > 0 ? (margeNette / caBrut) * 100 : 0;
      return { nom: c.nom, caBrut, commissionEuros, caNet, margeNette, margeNettePct, color: c.color, barColor: c.barColor };
    });

    const totalCommissions = rows.reduce((s, r) => s + r.commissionEuros, 0);
    const totalMarge = rows.reduce((s, r) => s + r.margeNette, 0);
    const totalMargePct = ca > 0 ? (totalMarge / ca) * 100 : 0;

    const caDirectActuel = ca * (pct(canaux[3].pct) / 100);
    const economiePassage50Direct = (ca * 0.5 - caDirectActuel) * (pct(canaux[0].commission) / 200 + pct(canaux[1].commission) / 200);

    return { rows, totalCommissions, totalMarge, totalMargePct, economiePassage50Direct };
  }, [caMensuel, foodCostPct, canaux]);

  const pctOk = Math.abs(totalPct - 100) < 0.5;

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
            <Bike className="w-6 h-6 text-teal-600" />
            Rentabilité plateformes livraison
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
            Comparez la marge réelle par canal de livraison après commissions et coûts variables.
          </p>
        </div>

        {/* Paramètres globaux */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Paramètres globaux</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>CA livraison mensuel total (€)</label>
              <input type="number" min="0" value={caMensuel} onChange={e => setCaMensuel(e.target.value)} placeholder="10000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Food cost + variables % (hors commissions)</label>
              <input type="number" min="0" max="100" value={foodCostPct} onChange={e => setFoodCostPct(e.target.value)} placeholder="45" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Répartition par canal */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Répartition et commissions</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pctOk ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
              Total : {fmt(totalPct, 0)} %
            </span>
          </div>
          {!pctOk && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              La somme des % doit être 100 pour un calcul exact.
            </div>
          )}
          <div className="space-y-3">
            {canaux.map((canal, i) => (
              <div key={canal.nom} className="grid grid-cols-3 gap-2 items-end">
                <div>
                  <label className={`${labelClass} ${canal.color}`}>{canal.nom}</label>
                  <div className="flex items-center gap-1">
                    <input type="number" min="0" max="100" value={canal.pct} onChange={setCanal(i, 'pct')} placeholder="0" className={inputClass} />
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">%</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Commission {canal.nom} (%)</label>
                  <input type="number" min="0" max="100" value={canal.commission} onChange={setCanal(i, 'commission')} placeholder="0" className={inputClass} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résultats */}
        {calc ? (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'CA livraison', value: `${fmt(num(caMensuel))} €`, icon: Bike, color: 'text-teal-600' },
                { label: 'Commissions payées', value: `${fmt(calc.totalCommissions)} €`, icon: TrendingDown, color: 'text-rose-500' },
                { label: 'Marge nette totale', value: `${fmt(calc.totalMarge)} €`, icon: TrendingUp, color: calc.totalMarge >= 0 ? 'text-emerald-500' : 'text-red-500' },
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

            {/* Tableau par canal */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Comparaison par canal</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[#737373] dark:text-[#A3A3A3] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="text-left pb-2 font-medium">Canal</th>
                      <th className="text-right pb-2 font-medium">CA brut</th>
                      <th className="text-right pb-2 font-medium">Commission</th>
                      <th className="text-right pb-2 font-medium">CA net</th>
                      <th className="text-right pb-2 font-medium">Marge nette</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                    {calc.rows.map(r => (
                      <tr key={r.nom}>
                        <td className={`py-2.5 font-semibold ${r.color}`}>{r.nom}</td>
                        <td className="py-2.5 text-right text-[#111111] dark:text-white">{fmt(r.caBrut)} €</td>
                        <td className="py-2.5 text-right text-rose-500">−{fmt(r.commissionEuros)} €</td>
                        <td className="py-2.5 text-right text-[#111111] dark:text-white">{fmt(r.caNet)} €</td>
                        <td className={`py-2.5 text-right font-bold ${r.margeNette >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                          {fmt(r.margeNette)} € <span className="font-normal text-[#737373] dark:text-[#A3A3A3]">({fmt(r.margeNettePct, 1)} %)</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Barres de marge */}
              <div className="space-y-2 pt-1">
                {calc.rows.filter(r => r.caBrut > 0).map(r => (
                  <div key={r.nom}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className={`font-medium ${r.color}`}>{r.nom}</span>
                      <span className="text-[#737373] dark:text-[#A3A3A3]">marge {fmt(r.margeNettePct, 1)} %</span>
                    </div>
                    <div className="w-full bg-[#F5F5F5] dark:bg-[#262626] rounded-full h-2">
                      <div
                        className={`${r.barColor} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.max(0, Math.min(100, r.margeNettePct))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseil */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-start gap-2 mb-3">
                <Info className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                <h2 className="font-semibold text-sm font-satoshi text-[#111111] dark:text-white">Points clés</h2>
              </div>
              <ul className="text-xs text-[#737373] dark:text-[#A3A3A3] space-y-2">
                <li>• Les commissions des plateformes (20–30 %) représentent en moyenne <strong className="text-[#111111] dark:text-white">{num(caMensuel) > 0 ? fmt((calc.totalCommissions / num(caMensuel)) * 100, 1) : '—'} % de votre CA livraison</strong>, soit {fmt(calc.totalCommissions)} €/mois.</li>
                <li>• Le canal <strong className="text-emerald-600 dark:text-emerald-400">En direct</strong> (site, téléphone) est toujours le plus rentable : zéro commission, marge maximale.</li>
                <li>• Objectif : augmenter la part du direct à 30–40 % via un programme de fidélité ou une offre d'abonnement.</li>
                {calc.economiePassage50Direct > 100 && (
                  <li>• Passer à 50 % de commandes directes vous économiserait environ <strong className="text-teal-600 dark:text-teal-400">{fmt(calc.economiePassage50Direct)} €/mois</strong> en commissions.</li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-10 text-center">
            <Bike className="w-10 h-10 text-[#E5E7EB] dark:text-[#1A1A1A] mx-auto mb-3" />
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">Renseignez votre CA livraison mensuel pour voir le résultat.</p>
          </div>
        )}

      </div>
    </div>
  );
}
