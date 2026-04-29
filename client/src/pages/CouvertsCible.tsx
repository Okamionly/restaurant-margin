import { useState, useMemo } from 'react';
import { Users, Target, RotateCcw, TrendingUp, Calendar, Clock, Info, AlertTriangle, CheckCircle } from 'lucide-react';

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

type Feasibility = 'facile' | 'ambitieux' | 'difficile';

function FeasibilityBadge({ level }: { level: Feasibility }) {
  if (level === 'facile') return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
      <CheckCircle className="w-3.5 h-3.5" /> Objectif atteignable
    </span>
  );
  if (level === 'ambitieux') return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
      <TrendingUp className="w-3.5 h-3.5" /> Objectif ambitieux
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
      <AlertTriangle className="w-3.5 h-3.5" /> Capacité insuffisante
    </span>
  );
}

const DEFAULTS = {
  caObjectif: 30000,
  ticketMoyen: 22,
  joursOuverture: 26,
  serviceParJour: 2,
  capaciteSalle: 40,
};

export default function CouvertsCible() {
  const [caObjectif, setCaObjectif] = useState(DEFAULTS.caObjectif);
  const [ticketMoyen, setTicketMoyen] = useState(DEFAULTS.ticketMoyen);
  const [joursOuverture, setJoursOuverture] = useState(DEFAULTS.joursOuverture);
  const [serviceParJour, setServiceParJour] = useState(DEFAULTS.serviceParJour);
  const [capaciteSalle, setCapaciteSalle] = useState(DEFAULTS.capaciteSalle);

  const reset = () => {
    setCaObjectif(DEFAULTS.caObjectif);
    setTicketMoyen(DEFAULTS.ticketMoyen);
    setJoursOuverture(DEFAULTS.joursOuverture);
    setServiceParJour(DEFAULTS.serviceParJour);
    setCapaciteSalle(DEFAULTS.capaciteSalle);
  };

  const results = useMemo(() => {
    if (ticketMoyen <= 0 || joursOuverture <= 0 || serviceParJour <= 0 || caObjectif <= 0) return null;
    const couvertsMois = Math.ceil(caObjectif / ticketMoyen);
    const couvertsSemaine = Math.ceil(couvertsMois / (joursOuverture / (joursOuverture / 4.33)));
    const couvertsJour = Math.ceil(couvertsMois / joursOuverture);
    const couvertsService = Math.ceil(couvertsJour / serviceParJour);
    const tauxRemplissage = capaciteSalle > 0 ? (couvertsService / capaciteSalle) * 100 : null;

    let feasibility: Feasibility = 'facile';
    if (tauxRemplissage !== null) {
      if (tauxRemplissage > 100) feasibility = 'difficile';
      else if (tauxRemplissage > 75) feasibility = 'ambitieux';
      else feasibility = 'facile';
    }

    return { couvertsMois, couvertsSemaine, couvertsJour, couvertsService, tauxRemplissage, feasibility };
  }, [caObjectif, ticketMoyen, joursOuverture, serviceParJour, capaciteSalle]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const inputClass =
    'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

  const labelClass = 'text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 flex items-center gap-1';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-teal-600" />
              Couverts cible
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              À partir de votre CA objectif et ticket moyen, calculez le nombre de couverts à réaliser.
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
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-5">
            <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              Vos paramètres
            </h2>

            <div>
              <label className={labelClass}>
                CA objectif mensuel (€)
              </label>
              <input
                type="number" min={0} value={caObjectif}
                onChange={e => setCaObjectif(Number(e.target.value))}
                className={inputClass}
              />
              <p className="text-xs text-[#A3A3A3] mt-1">Chiffre d'affaires que vous souhaitez atteindre ce mois.</p>
            </div>

            <div>
              <label className={labelClass}>
                Ticket moyen par couvert (€)
                <span title="Montant moyen dépensé par client (hors TVA si possible)." className="cursor-help">
                  <Info className="w-3 h-3" />
                </span>
              </label>
              <input
                type="number" min={1} value={ticketMoyen}
                onChange={e => setTicketMoyen(Number(e.target.value))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Calendar className="w-3 h-3" /> Jours d'ouverture par mois
              </label>
              <input
                type="number" min={1} max={31} value={joursOuverture}
                onChange={e => setJoursOuverture(Math.min(31, Number(e.target.value)))}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Clock className="w-3 h-3" /> Services par jour (midi + soir)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setServiceParJour(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      serviceParJour === n
                        ? 'bg-teal-600 border-teal-500 text-white'
                        : 'bg-[#F5F5F5] dark:bg-[#262626] border-[#E5E7EB] dark:border-[#262626] text-[#737373] dark:text-[#A3A3A3] hover:border-teal-500'
                    }`}
                  >
                    {n === 1 ? 'Midi' : n === 2 ? 'Midi + Soir' : '3 services'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <Users className="w-3 h-3" /> Capacité de la salle (places)
                <span title="Nombre maximum de couverts simultanés. Optionnel — permet d'évaluer la faisabilité." className="cursor-help">
                  <Info className="w-3 h-3" />
                </span>
              </label>
              <input
                type="number" min={1} value={capaciteSalle}
                onChange={e => setCapaciteSalle(Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {results ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Pour un CA de <span className="font-semibold text-teal-600">{fmt(caObjectif)}</span></p>
                  <FeasibilityBadge level={results.feasibility} />
                </div>

                <StatCard
                  accent
                  label="Couverts / mois"
                  value={results.couvertsMois.toLocaleString('fr-FR')}
                  sub={`Soit ${fmt(caObjectif)} ÷ ${fmt(ticketMoyen)}/couvert`}
                />

                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Couverts / semaine"
                    value={Math.ceil(results.couvertsMois / 4.33).toLocaleString('fr-FR')}
                    sub="≈ mois / 4,33"
                  />
                  <StatCard
                    label="Couverts / jour"
                    value={results.couvertsJour.toLocaleString('fr-FR')}
                    sub={`sur ${joursOuverture} j ouverts`}
                  />
                </div>

                <StatCard
                  label="Couverts / service"
                  value={results.couvertsService.toLocaleString('fr-FR')}
                  sub={`${serviceParJour} service${serviceParJour > 1 ? 's' : ''}/jour`}
                />

                {/* Taux remplissage */}
                {results.tauxRemplissage !== null && (
                  <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                        Taux de remplissage / service
                      </span>
                      <span className={`text-lg font-bold font-satoshi ${
                        results.tauxRemplissage > 100 ? 'text-red-500' :
                        results.tauxRemplissage > 75 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {Math.round(results.tauxRemplissage)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          results.tauxRemplissage > 100 ? 'bg-red-500' :
                          results.tauxRemplissage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, results.tauxRemplissage)}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#A3A3A3] mt-2">
                      {results.couvertsService} couverts / service pour {capaciteSalle} places disponibles
                      {results.tauxRemplissage > 100 && ' — augmentez le ticket moyen ou le CA cible.'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center h-full">
                <Users className="w-10 h-10 text-[#E5E7EB] dark:text-[#1A1A1A]" />
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">Renseignez vos paramètres pour voir le résultat.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
          <h3 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm mb-3">Repères secteur</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Brasserie', ticket: '18–25 €', taux: '75–85 %' },
              { label: 'Gastronomique', ticket: '60–120 €', taux: '60–75 %' },
              { label: 'Fast-casual', ticket: '12–18 €', taux: '85–95 %' },
            ].map(row => (
              <div key={row.label} className="text-sm">
                <p className="font-medium text-[#111111] dark:text-white">{row.label}</p>
                <p className="text-[#737373] dark:text-[#A3A3A3] text-xs">Ticket : {row.ticket}</p>
                <p className="text-[#737373] dark:text-[#A3A3A3] text-xs">Taux remplissage : {row.taux}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
