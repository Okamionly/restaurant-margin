import { useState, useMemo } from 'react';
import { Package, Plus, Trash2, AlertTriangle, CheckCircle, Clock, Filter, X } from 'lucide-react';

interface DlcProduct {
  id: string;
  name: string;
  category: string;
  quantity: string;
  unit: string;
  dlc: string; // ISO date
  type: 'DLC' | 'DLUO';
  createdAt: string;
}

const CATEGORIES = [
  'Viandes', 'Poissons', 'Produits laitiers', 'Légumes', 'Fruits',
  'Charcuterie', 'Épicerie', 'Surgelés', 'Boissons', 'Autre',
];

const UNITS = ['kg', 'g', 'L', 'cl', 'barquette', 'pièce', 'carton', 'boîte'];

type StatusFilter = 'all' | 'expired' | 'soon' | 'ok';

function parseDlcDate(dlc: string): Date {
  // new Date("YYYY-MM-DD") is parsed as UTC midnight, causing a 1-day shift
  // for users in UTC+ timezones. Parse components explicitly for local time.
  const [y, m, d] = dlc.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getDaysLeft(dlc: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = parseDlcDate(dlc);
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
}

function getStatus(days: number): 'expired' | 'soon' | 'ok' {
  if (days < 0) return 'expired';
  if (days <= 3) return 'soon';
  return 'ok';
}

const STATUS_CONFIG = {
  expired: {
    label: 'Expiré',
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-900',
    badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
  },
  soon: {
    label: 'Bientôt',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-900',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    icon: Clock,
    iconColor: 'text-amber-500',
  },
  ok: {
    label: 'OK',
    bg: 'bg-white dark:bg-[#0A0A0A]/50',
    border: 'border-[#E5E7EB] dark:border-[#1A1A1A]',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
  },
};

function loadProducts(): DlcProduct[] {
  try {
    return JSON.parse(localStorage.getItem('dlcProducts') || '[]');
  } catch { return []; }
}

function saveProducts(products: DlcProduct[]) {
  localStorage.setItem('dlcProducts', JSON.stringify(products));
}

const EMPTY_FORM = { name: '', category: 'Viandes', quantity: '', unit: 'kg', dlc: '', type: 'DLC' as 'DLC' | 'DLUO' };

export default function DlcTracker() {
  const [products, setProducts] = useState<DlcProduct[]>(loadProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [error, setError] = useState('');

  type EnrichedProduct = DlcProduct & { daysLeft: number; status: 'expired' | 'soon' | 'ok' };

  const enriched = useMemo((): EnrichedProduct[] =>
    products
      .map((p: DlcProduct): EnrichedProduct => ({ ...p, daysLeft: getDaysLeft(p.dlc), status: getStatus(getDaysLeft(p.dlc)) }))
      .sort((a: EnrichedProduct, b: EnrichedProduct) => a.daysLeft - b.daysLeft),
    [products]
  );

  const counts = useMemo(() => ({
    expired: enriched.filter((p: EnrichedProduct) => p.status === 'expired').length,
    soon: enriched.filter((p: EnrichedProduct) => p.status === 'soon').length,
    ok: enriched.filter((p: EnrichedProduct) => p.status === 'ok').length,
  }), [enriched]);

  const visible = useMemo((): EnrichedProduct[] =>
    filter === 'all' ? enriched : enriched.filter((p: EnrichedProduct) => p.status === filter),
    [enriched, filter]
  );

  function handleAdd() {
    if (!form.name.trim()) { setError('Nom du produit requis'); return; }
    if (!form.dlc) { setError('Date de péremption requise'); return; }
    setError('');
    const updated = [...products, {
      ...form,
      id: Date.now().toString(),
      name: form.name.trim(),
      createdAt: new Date().toISOString(),
    }];
    setProducts(updated);
    saveProducts(updated);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    const product = products.find((p: DlcProduct) => p.id === id);
    if (!window.confirm(`Supprimer "${product?.name}" ?`)) return;
    const updated = products.filter((p: DlcProduct) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  }

  const inputClass = 'w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500';

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-teal-600" />
              Tableau de bord DLC / DLUO
            </h1>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-1">
              Suivi des dates de péremption — alertes colorées vert / orange / rouge.
            </p>
          </div>
          <button
            onClick={() => { setShowForm(v => !v); setError(''); }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Annuler' : 'Ajouter un produit'}
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4">
          {(['expired', 'soon', 'ok'] as const).map(s => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? 'all' : s)}
                className={`rounded-2xl border p-4 text-left transition-all ${cfg.bg} ${cfg.border} ${filter === s ? 'ring-2 ring-teal-500' : 'hover:opacity-90'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">{cfg.label}</span>
                  <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                </div>
                <div className="text-3xl font-black text-[#111111] dark:text-white">{counts[s]}</div>
                <div className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                  {s === 'expired' ? 'À retirer immédiatement' : s === 'soon' ? '≤ 3 jours restants' : '> 3 jours'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-[#111111] dark:text-white font-satoshi text-sm">Nouveau produit</h2>
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Nom du produit *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex : Filet de saumon"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Catégorie</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Quantité</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    placeholder="1"
                    className={inputClass}
                  />
                </div>
                <div className="w-24">
                  <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Unité</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className={inputClass}>
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Date péremption *</label>
                  <input
                    type="date"
                    value={form.dlc}
                    onChange={e => setForm(f => ({ ...f, dlc: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div className="w-24">
                  <label className="text-xs font-medium text-[#737373] dark:text-[#A3A3A3] mb-1 block">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'DLC' | 'DLUO' }))} className={inputClass}>
                    <option>DLC</option>
                    <option>DLUO</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowForm(false); setError(''); }} className="px-4 py-2 text-sm text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors">
                Annuler
              </button>
              <button onClick={handleAdd} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        )}

        {/* Filter bar */}
        {products.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
            {(['all', 'expired', 'soon', 'ok'] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                  filter === s
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-transparent'
                    : 'bg-white dark:bg-[#0A0A0A] text-[#737373] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-teal-500'
                }`}
              >
                {s === 'all' ? 'Tous' : STATUS_CONFIG[s].label}
                {s !== 'all' && <span className="ml-1">({counts[s]})</span>}
              </button>
            ))}
          </div>
        )}

        {/* Product list */}
        {visible.length === 0 ? (
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-12 text-center">
            <Package className="w-10 h-10 text-[#E5E7EB] dark:text-[#1A1A1A] mx-auto mb-3" />
            <p className="font-semibold text-[#111111] dark:text-white mb-1">
              {products.length === 0 ? 'Aucun produit suivi' : 'Aucun produit dans cette catégorie'}
            </p>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              {products.length === 0 ? 'Ajoutez vos produits pour suivre leurs dates de péremption.' : 'Changez le filtre pour voir les autres produits.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map(p => {
              const cfg = STATUS_CONFIG[p.status];
              const Icon = cfg.icon;
              const daysLabel =
                p.daysLeft < 0 ? `Expiré il y a ${Math.abs(p.daysLeft)}j` :
                p.daysLeft === 0 ? 'Expire aujourd\'hui' :
                p.daysLeft === 1 ? 'Expire demain' :
                `${p.daysLeft} jours restants`;
              return (
                <div key={p.id} className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${cfg.bg} ${cfg.border}`}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#111111] dark:text-white text-sm truncate">{p.name}</span>
                      <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">{p.category}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${p.type === 'DLC' ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' : 'bg-[#E5E7EB] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3]'}`}>{p.type}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {p.quantity && <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">{p.quantity} {p.unit}</span>}
                      <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                        {parseDlcDate(p.dlc).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
                      <Icon className="w-3 h-3" />
                      {daysLabel}
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-[#737373] dark:text-[#A3A3A3] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
          <p className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-3">Légende</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-0.5 flex-shrink-0" />
              <div><span className="font-semibold text-[#111111] dark:text-white">Rouge — Expiré</span><br /><span className="text-[#737373] dark:text-[#A3A3A3]">Produit à retirer du stock immédiatement.</span></div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-0.5 flex-shrink-0" />
              <div><span className="font-semibold text-[#111111] dark:text-white">Orange — 0-3 jours</span><br /><span className="text-[#737373] dark:text-[#A3A3A3]">À utiliser en priorité ou à signaler à l'équipe.</span></div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-0.5 flex-shrink-0" />
              <div><span className="font-semibold text-[#111111] dark:text-white">Vert — OK</span><br /><span className="text-[#737373] dark:text-[#A3A3A3]">Plus de 3 jours — aucune action urgente.</span></div>
            </div>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <strong className="text-[#111111] dark:text-white">DLC</strong> (Date Limite de Consommation) : produits frais à ne pas dépasser. &nbsp;·&nbsp;
            <strong className="text-[#111111] dark:text-white">DLUO</strong> (Date Limite d'Utilisation Optimale) : produits stables pouvant être consommés après, avec risque de perte de qualité.
          </p>
        </div>

      </div>
    </div>
  );
}
