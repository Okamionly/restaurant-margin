import { useState, useMemo } from 'react';
import { Gift, RotateCcw, Sun, Snowflake, TrendingUp, Users, Info } from 'lucide-react';

type Season = 'ete' | 'hiver';

const SEASON_CONFIG = {
  ete:   { label: 'Été',   months: 'Juin – Septembre',  Icon: Sun,       color: 'amber' },
  hiver: { label: 'Hiver', months: 'Novembre – Février', Icon: Snowflake, color: 'blue'  },
} as const;

const TIERS = [
  { minPct: 110, label: 'Excellent',        bonusMult: 1.5, badgeClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900' },
  { minPct: 100, label: 'Objectif atteint', bonusMult: 1.0, badgeClass: 'text-teal-600 dark:text-teal-400',     bgClass: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-900'         },
  { minPct:  90, label: 'Quasi atteint',    bonusMult: 0.5, badgeClass: 'text-amber-600 dark:text-amber-400',   bgClass: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900'     },
  { minPct:   0, label: 'Insuffisant',      bonusMult: 0.0, badgeClass: 'text-red-600 dark:text-red-400',       bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900'             },
];

const SAISON_MOIS = 4;

const fmt  = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const pct  = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n / 100);
const num  = (s: string) => parseFloat(s.replace(',', '.')) || 0;

export default function PrimeSaisonniere() {
  const [season,      setSeason]      = useState<Season>('ete');
  const [caObjectif,  setCaObjectif]  = useState('80000');
  const [caRealise,   setCaRealise]   = useState('85000');
  const [nbEmployes,  setNbEmployes]  = useState('4');
  const [salaireMoyen,setSalaireMoyen]= useState('2200');
  const [tauxMax,     setTauxMax]     = useState('5');

  const ic = 'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

  const r = useMemo(() => {
    const obj  = num(caObjectif);
    const real = num(caRealise);
    const nb   = parseInt(nbEmployes) || 0;
    const sal  = num(salaireMoyen);
    const taux = num(tauxMax) / 100;
    if (obj <= 0 || nb <= 0 || sal <= 0) return null;
    const realisationPct = real > 0 ? (real / obj) * 100 : 0;
    const tier = TIERS.find(t => realisationPct >= t.minPct) ?? TIERS[TIERS.length - 1];
    const tauxEff     = taux * tier.bonusMult;
    const masseSaison = sal * nb * SAISON_MOIS;
    const enveloppe   = masseSaison * tauxEff;
    const parEmploye  = nb > 0 ? enveloppe / nb : 0;
    return { realisationPct, tier, tauxEff, masseSaison, enveloppe, parEmploye, nb, sal, taux };
  }, [caObjectif, caRealise, nbEmployes, salaireMoyen, tauxMax]);

  const reset = () => { setSeason('ete'); setCaObjectif('80000'); setCaRealise('85000'); setNbEmployes('4'); setSalaireMoyen('2200'); setTauxMax('5'); };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-teal-600" />
              Simulateur prime saisonnière
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Calculez les primes d'été ou d'hiver de votre équipe selon le CA réalisé.
            </p>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 shrink-0">
            <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        </div>

        {/* Season */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm">Saison</h2>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(SEASON_CONFIG) as [Season, (typeof SEASON_CONFIG)[Season]][]).map(([key, cfg]) => (
              <button key={key} onClick={() => setSeason(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${season === key ? 'bg-teal-600 border-teal-500 text-white' : 'bg-[#F5F5F5] dark:bg-[#262626] border-[#E5E7EB] dark:border-[#262626] text-[#737373] dark:text-[#A3A3A3] hover:border-teal-400'}`}>
                <cfg.Icon className="w-4 h-4" />
                <span className="font-semibold">{cfg.label}</span>
                <span className="text-xs opacity-70">{cfg.months}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CA */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" /> Chiffre d'affaires de la saison
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">CA objectif (€)</label>
              <input type="text" inputMode="decimal" value={caObjectif} onChange={e => setCaObjectif(e.target.value)} className={ic} />
            </div>
            <div>
              <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">CA réalisé (€)</label>
              <input type="text" inputMode="decimal" value={caRealise}  onChange={e => setCaRealise(e.target.value)}  className={ic} />
            </div>
          </div>
        </div>

        {/* Équipe */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-600" /> Équipe & paramètres
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Nombre d'employés</label>
              <input type="number" min="1" value={nbEmployes}   onChange={e => setNbEmployes(e.target.value)}   className={ic} />
            </div>
            <div>
              <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Salaire brut moyen / mois (€)</label>
              <input type="text" inputMode="decimal" value={salaireMoyen} onChange={e => setSalaireMoyen(e.target.value)} className={ic} />
            </div>
            <div>
              <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Taux prime max (% du brut mensuel)</label>
              <input type="text" inputMode="decimal" value={tauxMax}      onChange={e => setTauxMax(e.target.value)}      className={ic} />
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">Si 100 % de l'objectif atteint</p>
            </div>
          </div>
        </div>

        {/* Results */}
        {r && (
          <>
            {/* Performance badge */}
            <div className={`${r.tier.bgClass} border rounded-2xl p-5`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1">Performance saison {SEASON_CONFIG[season].label}</p>
                  <p className={`text-2xl font-bold font-satoshi ${r.tier.badgeClass}`}>{r.tier.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1">Taux de réalisation</p>
                  <p className={`text-3xl font-bold font-satoshi ${r.tier.badgeClass}`}>{pct(r.realisationPct)}</p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${r.tier.badgeClass.includes('emerald') ? 'bg-emerald-500' : r.tier.badgeClass.includes('teal') ? 'bg-teal-500' : r.tier.badgeClass.includes('amber') ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(r.realisationPct, 120) / 1.2}%` }} />
              </div>
              <div className="flex justify-between text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">
                <span>0 %</span><span>90 %</span><span>100 %</span><span>110 %+</span>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Prime par employé',    value: fmt(r.parEmploye),        sub: 'versée en fin de saison' },
                { label: 'Enveloppe totale',      value: fmt(r.enveloppe),         sub: `pour ${r.nb} employé${r.nb > 1 ? 's' : ''}` },
                { label: 'Taux effectif',         value: `${(r.tauxEff * 100).toFixed(1)} %`, sub: 'du salaire brut mensuel' },
              ].map(k => (
                <div key={k.label} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 text-center">
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{k.label}</p>
                  <p className="text-xl font-bold font-satoshi text-teal-600 dark:text-teal-400 mt-1">{k.value}</p>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Barème */}
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-600" /> Barème de primes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      {['Réalisation', 'Performance', 'Taux prime', 'Prime / employé'].map(h => (
                        <th key={h} className={`pb-2 font-medium text-[#737373] dark:text-[#A3A3A3] ${h !== 'Réalisation' && h !== 'Performance' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F5] dark:divide-[#1A1A1A]">
                    {TIERS.map(t => {
                      const tauxEff   = r.taux * t.bonusMult;
                      const primeCalc = r.sal * SAISON_MOIS * tauxEff;
                      const isActive  = t.minPct === r.tier.minPct;
                      const rangeLabel = t.minPct >= 110 ? '≥ 110 %' : t.minPct >= 100 ? '100 – 109 %' : t.minPct >= 90 ? '90 – 99 %' : '< 90 %';
                      return (
                        <tr key={t.minPct} className={isActive ? 'font-semibold' : ''}>
                          <td className="py-2 pr-2 text-[#111111] dark:text-white">
                            {rangeLabel}
                            {isActive && <span className="ml-2 text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded-full">Vous</span>}
                          </td>
                          <td className={`py-2 ${t.badgeClass}`}>{t.label}</td>
                          <td className="py-2 text-right text-[#111111] dark:text-white">{(t.bonusMult * num(tauxMax)).toFixed(1)} %</td>
                          <td className="py-2 text-right text-teal-600 dark:text-teal-400">{fmt(primeCalc)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-3 border-t border-[#F5F5F5] dark:border-[#1A1A1A] pt-3">
                Prime calculée sur {SAISON_MOIS} mois × salaire brut moyen × taux effectif. Les charges patronales ne sont pas incluses. À valider avec votre expert-comptable.
              </p>
            </div>
          </>
        )}

        {!r && (
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8 text-center">
            <Gift className="w-8 h-8 text-[#737373] dark:text-[#A3A3A3] mx-auto mb-2" />
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">Renseignez les paramètres ci-dessus pour calculer les primes.</p>
          </div>
        )}

      </div>
    </div>
  );
}
