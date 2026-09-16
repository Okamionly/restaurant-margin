import { useState, useMemo } from 'react';
import { Wrench, Plus, Trash2, RotateCcw, TrendingUp, Clock, Euro, CheckCircle, AlertCircle } from 'lucide-react';

interface Equipement {
  id: string;
  nom: string;
  prixAchat: number;
  dureeAmortissement: number;
  gainCaMensuel: number;
  economiesMensuelles: number;
}

const DEFAULTS: Equipement[] = [
  { id: '1', nom: 'Machine espresso pro', prixAchat: 8000, dureeAmortissement: 5, gainCaMensuel: 600, economiesMensuelles: 80 },
];

function calcRoi(eq: Equipement) {
  const gainsParMois = eq.gainCaMensuel + eq.economiesMensuelles;
  const dureeMois = eq.dureeAmortissement * 12;
  const totalGains = gainsParMois * dureeMois;
  const gainNet = totalGains - eq.prixAchat;
  const roi = eq.prixAchat > 0 ? (gainNet / eq.prixAchat) * 100 : 0;
  const retourMois = gainsParMois > 0 ? Math.ceil(eq.prixAchat / gainsParMois) : null;
  const amortMensuel = dureeMois > 0 ? eq.prixAchat / dureeMois : 0;
  return { gainsParMois, totalGains, gainNet, roi, retourMois, amortMensuel };
}

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

function RoiCard({ eq, onRemove, canRemove }: { eq: Equipement; onRemove: () => void; canRemove: boolean }) {
  const r = useMemo(() => calcRoi(eq), [eq]);
  const positive = r.gainNet >= 0;
  const retourOk = r.retourMois !== null && r.retourMois <= eq.dureeAmortissement * 12;

  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-teal-600" />
          <span className="font-semibold font-satoshi text-[#111111] dark:text-white">{eq.nom || 'Équipement'}</span>
        </div>
        <div className="flex items-center gap-2">
          {positive
            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
            : <AlertCircle className="w-4 h-4 text-red-400" />}
          {canRemove && (
            <button onClick={onRemove} className="text-[#737373] dark:text-[#A3A3A3] hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] font-semibold mb-1">ROI total</p>
          <p className={`text-2xl font-bold font-satoshi ${positive ? 'text-teal-600' : 'text-red-500'}`}>
            {r.roi > 0 ? '+' : ''}{r.roi.toFixed(0)}%
          </p>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">sur {eq.dureeAmortissement} ans</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] font-semibold mb-1">Retour</p>
          {r.retourMois !== null ? (
            <>
              <p className={`text-2xl font-bold font-satoshi ${retourOk ? 'text-emerald-500' : 'text-amber-500'}`}>
                {r.retourMois} mois
              </p>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{retourOk ? 'avant fin amortissement' : 'dépasse amortissement'}</p>
            </>
          ) : (
            <p className="text-2xl font-bold font-satoshi text-red-500">∞</p>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] font-semibold mb-1">Gain net</p>
          <p className={`text-lg font-bold font-satoshi ${positive ? 'text-[#111111] dark:text-white' : 'text-red-500'}`}>
            {r.gainNet >= 0 ? '+' : ''}{fmt(r.gainNet)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] font-semibold mb-1">Gains/mois</p>
          <p className="text-lg font-bold font-satoshi text-[#111111] dark:text-white">{fmt(r.gainsParMois)}</p>
        </div>
      </div>

      {/* Progress bar: payback vs amortissement */}
      {r.retourMois !== null && (
        <div className="px-5 pb-5">
          <div className="h-2 bg-[#F5F5F5] dark:bg-[#262626] rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${retourOk ? 'bg-gradient-to-r from-teal-600 to-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, (r.retourMois / (eq.dureeAmortissement * 12)) * 100).toFixed(1)}%` }}
            />
          </div>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1.5">
            Retour à {Math.min(100, (r.retourMois / (eq.dureeAmortissement * 12)) * 100).toFixed(0)}% de la durée d'amortissement
          </p>
        </div>
      )}
    </div>
  );
}

export default function RoiEquipement() {
  const [equipements, setEquipements] = useState<Equipement[]>(DEFAULTS);
  const [selected, setSelected] = useState<string>('1');

  const eq = equipements.find(e => e.id === selected) ?? equipements[0];

  const update = (field: keyof Equipement, val: string | number) =>
    setEquipements(prev => prev.map(e => e.id === selected ? { ...e, [field]: val } : e));

  const add = () => {
    const id = Date.now().toString();
    setEquipements(prev => [...prev, { id, nom: 'Nouvel équipement', prixAchat: 5000, dureeAmortissement: 5, gainCaMensuel: 300, economiesMensuelles: 0 }]);
    setSelected(id);
  };

  const remove = (id: string) => {
    const next = equipements.filter(e => e.id !== id);
    setEquipements(next);
    if (selected === id) setSelected(next[0]?.id ?? '');
  };

  const reset = () => { setEquipements(DEFAULTS); setSelected('1'); };

  const labelCls = 'text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block';
  const inputCls = 'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              ROI Équipement
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Calculez la rentabilité d'un investissement équipement avant d'acheter.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {equipements.length < 4 && (
              <button onClick={add} className="flex items-center gap-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-3 py-2 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Tab selector */}
        {equipements.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {equipements.map(e => (
              <button
                key={e.id}
                onClick={() => setSelected(e.id)}
                className={`whitespace-nowrap text-xs font-medium rounded-xl px-4 py-2 transition-colors ${
                  selected === e.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {e.nom || 'Équipement'}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-600" /> Paramètres
            </h2>

            <div>
              <label className={labelCls}>Nom de l'équipement</label>
              <input value={eq.nom} onChange={e => update('nom', e.target.value)} className={inputCls} placeholder="Ex : Four à pizza" />
            </div>

            <div>
              <label className={labelCls}>Prix d'achat (€)</label>
              <input type="number" min={0} value={eq.prixAchat} onChange={e => update('prixAchat', Number(e.target.value))} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Durée d'amortissement (années)</label>
              <input type="number" min={1} max={20} value={eq.dureeAmortissement} onChange={e => update('dureeAmortissement', Number(e.target.value))} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1"><Euro className="w-3 h-3" /> Gain CA mensuel estimé (€)</span>
              </label>
              <input type="number" min={0} value={eq.gainCaMensuel} onChange={e => update('gainCaMensuel', Number(e.target.value))} className={inputCls} />
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">CA additionnel généré grâce à l'équipement</p>
            </div>

            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Économies mensuelles (€)</span>
              </label>
              <input type="number" min={0} value={eq.economiesMensuelles} onChange={e => update('economiesMensuelles', Number(e.target.value))} className={inputCls} />
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">Économies énergie, main d'œuvre, maintenance…</p>
            </div>
          </div>

          {/* Result card */}
          <div className="space-y-4">
            <RoiCard eq={eq} onRemove={() => remove(eq.id)} canRemove={equipements.length > 1} />

            {/* Summary table */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3] mb-3">Détail sur {eq.dureeAmortissement} ans</h3>
              {[
                ['Investissement initial', fmt(-eq.prixAchat), 'text-red-500'],
                ['Gains CA cumulés', fmt(eq.gainCaMensuel * eq.dureeAmortissement * 12), 'text-teal-600'],
                ['Économies cumulées', fmt(eq.economiesMensuelles * eq.dureeAmortissement * 12), 'text-emerald-500'],
                ['Amortissement mensuel', fmt(eq.prixAchat / (eq.dureeAmortissement * 12)), 'text-[#111111] dark:text-white'],
              ].map(([label, val, cls]) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-[#F5F5F5] dark:border-[#1A1A1A] last:border-0">
                  <span className="text-sm text-[#737373] dark:text-[#A3A3A3]">{label}</span>
                  <span className={`text-sm font-semibold ${cls}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-[#737373] dark:text-[#A3A3A3] text-center">
          ROI = (Gains totaux − Investissement) ÷ Investissement × 100. Délai de retour = Prix d'achat ÷ Gains mensuels.
        </p>
      </div>
    </div>
  );
}
