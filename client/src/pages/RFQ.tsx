import { useState } from 'react';
import {
  Plus, FileText, X, Euro, Clock, Send, CheckCircle, Trash2,
  ChevronDown, ChevronUp, TrendingDown, AlertCircle, Package,
  Users, BarChart3, Calendar, Tag
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────
type RFQStatus = 'ouvert' | 'en_cours' | 'ferme';

interface MockQuote {
  id: number;
  supplier: string;
  unitPrice: number | null;
  notes: string | null;
  selected: boolean;
}

interface MockItem {
  id: number;
  product: string;
  unit: string;
  quantity: number;
  category: string;
  quotes: MockQuote[];
}

interface MockRFQ {
  id: number;
  title: string;
  status: RFQStatus;
  dueDate: string;
  notes: string | null;
  createdAt: string;
  suppliers: string[];
  items: MockItem[];
}

// ── Données mockées ──────────────────────────────────────────────────────────
const INITIAL_RFQS: MockRFQ[] = [
  {
    id: 1,
    title: 'Commande légumes — Semaine 15',
    status: 'ouvert',
    dueDate: '2026-04-07',
    notes: 'Livraison souhaitée le lundi matin avant 8h.',
    createdAt: '2026-04-01',
    suppliers: ['Metro', 'Transgourmet', 'Pomona'],
    items: [
      {
        id: 101,
        product: 'Tomates cerises',
        unit: 'kg',
        quantity: 20,
        category: 'Légumes',
        quotes: [
          { id: 1001, supplier: 'Metro', unitPrice: 3.20, notes: 'Bio certifié', selected: false },
          { id: 1002, supplier: 'Transgourmet', unitPrice: 2.85, notes: null, selected: true },
          { id: 1003, supplier: 'Pomona', unitPrice: 3.10, notes: 'France uniquement', selected: false },
        ],
      },
      {
        id: 102,
        product: 'Courgettes',
        unit: 'kg',
        quantity: 15,
        category: 'Légumes',
        quotes: [
          { id: 1004, supplier: 'Metro', unitPrice: 1.90, notes: null, selected: false },
          { id: 1005, supplier: 'Transgourmet', unitPrice: 1.75, notes: null, selected: true },
          { id: 1006, supplier: 'Pomona', unitPrice: null, notes: null, selected: false },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Viandes & Charcuterie — Avril',
    status: 'en_cours',
    dueDate: '2026-04-10',
    notes: null,
    createdAt: '2026-03-28',
    suppliers: ['Sysco France', 'Metro'],
    items: [
      {
        id: 201,
        product: 'Entrecôte bœuf',
        unit: 'kg',
        quantity: 30,
        category: 'Viandes',
        quotes: [
          { id: 2001, supplier: 'Sysco France', unitPrice: 18.50, notes: 'Origine France', selected: false },
          { id: 2002, supplier: 'Metro', unitPrice: 17.90, notes: null, selected: false },
        ],
      },
      {
        id: 202,
        product: 'Lardons fumés',
        unit: 'kg',
        quantity: 10,
        category: 'Charcuterie',
        quotes: [
          { id: 2003, supplier: 'Sysco France', unitPrice: 6.40, notes: null, selected: false },
          { id: 2004, supplier: 'Metro', unitPrice: null, notes: 'Devis en attente', selected: false },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Produits laitiers — Mars',
    status: 'ferme',
    dueDate: '2026-03-20',
    notes: 'Commande clôturée, livraison effectuée.',
    createdAt: '2026-03-12',
    suppliers: ['Transgourmet', 'Pomona'],
    items: [
      {
        id: 301,
        product: 'Beurre doux',
        unit: 'kg',
        quantity: 8,
        category: 'Laitiers',
        quotes: [
          { id: 3001, supplier: 'Transgourmet', unitPrice: 9.20, notes: null, selected: true },
          { id: 3002, supplier: 'Pomona', unitPrice: 9.80, notes: 'AOP Normandie', selected: false },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Poissons & Fruits de mer — Semaine 14',
    status: 'ferme',
    dueDate: '2026-03-28',
    notes: null,
    createdAt: '2026-03-20',
    suppliers: ['Metro', 'Sysco France'],
    items: [
      {
        id: 401,
        product: 'Saumon atlantique',
        unit: 'kg',
        quantity: 25,
        category: 'Poissons',
        quotes: [
          { id: 4001, supplier: 'Metro', unitPrice: 14.20, notes: 'Label Rouge', selected: true },
          { id: 4002, supplier: 'Sysco France', unitPrice: 13.90, notes: null, selected: false },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Boissons & Soft — Avril',
    status: 'ouvert',
    dueDate: '2026-04-12',
    notes: 'Préférence pour les marques locales.',
    createdAt: '2026-04-01',
    suppliers: ['Metro', 'Transgourmet'],
    items: [
      {
        id: 501,
        product: 'Eau minérale 75cl',
        unit: 'caisse (6)',
        quantity: 40,
        category: 'Boissons',
        quotes: [
          { id: 5001, supplier: 'Metro', unitPrice: 4.50, notes: 'Evian', selected: false },
          { id: 5002, supplier: 'Transgourmet', unitPrice: null, notes: null, selected: false },
        ],
      },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<RFQStatus, { label: string; color: string; dot: string }> = {
  ouvert:   { label: 'Ouvert',   color: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', dot: 'bg-emerald-400' },
  en_cours: { label: 'En cours', color: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',          dot: 'bg-blue-400' },
  ferme:    { label: 'Fermé',    color: 'bg-slate-700 text-slate-400 border border-slate-600',             dot: 'bg-slate-500' },
};

function getBestPrice(item: MockItem): number | null {
  const prices = item.quotes.filter(q => q.unitPrice !== null).map(q => q.unitPrice as number);
  if (!prices.length) return null;
  return Math.min(...prices);
}

function estimatedSaving(rfq: MockRFQ): number {
  let saving = 0;
  for (const item of rfq.items) {
    const prices = item.quotes.filter(q => q.unitPrice !== null).map(q => q.unitPrice as number);
    if (prices.length < 2) continue;
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    saving += (max - min) * item.quantity;
  }
  return saving;
}

// ── Composant StatusBadge ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: RFQStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Composant Modal Création ─────────────────────────────────────────────────
interface CreateForm {
  title: string;
  dueDate: string;
  notes: string;
  suppliers: string;
  products: string;
}

function CreateModal({ isOpen, onClose, onCreate }: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (form: CreateForm) => void;
}) {
  const [form, setForm] = useState<CreateForm>({
    title: '',
    dueDate: '',
    notes: '',
    suppliers: '',
    products: '',
  });
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!form.title.trim()) { setError('Le titre est obligatoire.'); return; }
    if (!form.suppliers.trim()) { setError('Ajoutez au moins un fournisseur.'); return; }
    if (!form.products.trim()) { setError('Ajoutez au moins un produit.'); return; }
    setError('');
    onCreate(form);
    setForm({ title: '', dueDate: '', notes: '', suppliers: '', products: '' });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Nouvel appel d'offres</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Titre <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex : Commande légumes — Semaine 16"
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Calendar className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                Date limite
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Users className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
                Fournisseurs <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.suppliers}
                onChange={e => setForm(f => ({ ...f, suppliers: e.target.value }))}
                placeholder="Metro, Pomona, ..."
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              <Package className="inline w-3.5 h-3.5 mr-1 text-slate-400" />
              Produits <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.products}
              onChange={e => setForm(f => ({ ...f, products: e.target.value }))}
              rows={3}
              placeholder="Ex : Tomates 20kg, Courgettes 15kg, ..."
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Instructions pour les fournisseurs..."
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Créer l'appel d'offres
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Composant RFQ Card ───────────────────────────────────────────────────────
function RFQCard({ rfq, onDelete, onStatusChange }: {
  rfq: MockRFQ;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: RFQStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const saving = estimatedSaving(rfq);
  const quotedItems = rfq.items.filter(item => item.quotes.some(q => q.unitPrice !== null)).length;
  const totalItems = rfq.items.length;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      {/* En-tête cliquable */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusBadge status={rfq.status} />
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">{rfq.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {rfq.suppliers.join(', ')} &bull; {totalItems} produit{totalItems > 1 ? 's' : ''}
              {rfq.dueDate && (
                <span className="ml-1.5 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(rfq.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          {/* Économie estimée */}
          {saving > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-emerald-400 text-sm font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              -{saving.toFixed(0)} €
            </div>
          )}

          {/* Barre de progression */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: totalItems > 0 ? `${(quotedItems / totalItems) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-slate-500 tabular-nums">{quotedItems}/{totalItems}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            {rfq.status === 'ouvert' && (
              <button
                onClick={() => onStatusChange(rfq.id, 'en_cours')}
                title="Marquer en cours"
                className="p-1.5 rounded-lg hover:bg-blue-900/40 text-blue-400 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
            {rfq.status === 'en_cours' && (
              <button
                onClick={() => onStatusChange(rfq.id, 'ferme')}
                title="Clôturer"
                className="p-1.5 rounded-lg hover:bg-emerald-900/40 text-emerald-400 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(rfq.id)}
              className="p-1.5 rounded-lg hover:bg-red-900/40 text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Contenu déplié */}
      {expanded && (
        <div className="border-t border-slate-800 px-5 py-4 space-y-4">
          {rfq.notes && (
            <p className="text-sm text-slate-400 italic">{rfq.notes}</p>
          )}

          {rfq.items.map(item => {
            const bestPrice = getBestPrice(item);
            return (
              <div key={item.id} className="border border-slate-800 rounded-xl overflow-hidden">
                {/* En-tête produit */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium text-white text-sm">{item.product}</span>
                    <span className="text-slate-500 text-xs">— {item.quantity} {item.unit}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 uppercase tracking-wide">{item.category}</span>
                </div>

                {/* Lignes de devis */}
                <div className="divide-y divide-slate-800/60">
                  {item.quotes.map(quote => {
                    const isBest = quote.unitPrice !== null && quote.unitPrice === bestPrice;
                    return (
                      <div
                        key={quote.id}
                        className={`flex items-center gap-4 px-4 py-3 ${
                          quote.selected
                            ? 'bg-emerald-900/10'
                            : isBest
                            ? 'bg-amber-900/10'
                            : ''
                        }`}
                      >
                        {/* Fournisseur */}
                        <div className="w-32 shrink-0">
                          <p className="text-sm font-medium text-slate-300">{quote.supplier}</p>
                          {isBest && !quote.selected && (
                            <span className="text-[10px] text-amber-400 font-medium">Meilleur prix</span>
                          )}
                          {quote.selected && (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" /> Sélectionné
                            </span>
                          )}
                        </div>

                        {/* Prix */}
                        <div className="flex-1">
                          {quote.unitPrice !== null ? (
                            <span className={`text-sm font-semibold ${
                              isBest ? 'text-amber-400' : quote.selected ? 'text-emerald-400' : 'text-slate-300'
                            }`}>
                              <Euro className="inline w-3.5 h-3.5 mr-0.5" />
                              {quote.unitPrice.toFixed(2)} / {item.unit}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-600 italic">En attente de devis</span>
                          )}
                          {quote.notes && (
                            <span className="ml-3 text-xs text-slate-500">{quote.notes}</span>
                          )}
                        </div>

                        {/* Total estimé */}
                        {quote.unitPrice !== null && (
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500">Total estimé</p>
                            <p className="text-sm font-semibold text-slate-300">
                              {(quote.unitPrice * item.quantity).toFixed(2)} €
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────────────────────
export default function RFQPage() {
  const [rfqs, setRfqs] = useState<MockRFQ[]>(INITIAL_RFQS);
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RFQStatus | 'tous'>('tous');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleCreate(form: CreateForm) {
    const newRfq: MockRFQ = {
      id: Date.now(),
      title: form.title,
      status: 'ouvert',
      dueDate: form.dueDate,
      notes: form.notes || null,
      createdAt: new Date().toISOString().split('T')[0],
      suppliers: form.suppliers.split(',').map(s => s.trim()).filter(Boolean),
      items: form.products.split(',').map((p, idx) => ({
        id: Date.now() + idx,
        product: p.trim(),
        unit: 'kg',
        quantity: 1,
        category: 'Divers',
        quotes: [],
      })),
    };
    setRfqs(prev => [newRfq, ...prev]);
    setShowCreate(false);
    showToast('Appel d\'offres créé avec succès !');
  }

  function handleDelete(id: number) {
    setRfqs(prev => prev.filter(r => r.id !== id));
    showToast('Appel d\'offres supprimé.');
  }

  function handleStatusChange(id: number, status: RFQStatus) {
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    const labels: Record<RFQStatus, string> = { ouvert: 'Ouvert', en_cours: 'En cours', ferme: 'Fermé' };
    showToast(`Statut mis à jour : ${labels[status]}`);
  }

  // Stats calculées
  const nbOuverts = rfqs.filter(r => r.status === 'ouvert').length;
  const nbEnCours = rfqs.filter(r => r.status === 'en_cours').length;
  const nbSoumissions = rfqs.reduce((acc, r) => acc + r.items.reduce((a, i) => a + i.quotes.filter(q => q.unitPrice !== null).length, 0), 0);
  const totalSavings = rfqs.reduce((acc, r) => acc + estimatedSaving(r), 0);

  // Filtrage
  const filtered = filterStatus === 'tous' ? rfqs : rfqs.filter(r => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── En-tête ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Appels d'offres</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Comparez les prix fournisseurs et optimisez vos achats
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Créer un appel d'offres
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Ouverts</span>
          </div>
          <p className="text-3xl font-bold text-white">{nbOuverts}</p>
          <p className="text-xs text-slate-500 mt-1">appels actifs</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10">
              <Send className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">En cours</span>
          </div>
          <p className="text-3xl font-bold text-white">{nbEnCours}</p>
          <p className="text-xs text-slate-500 mt-1">en négociation</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Devis reçus</span>
          </div>
          <p className="text-3xl font-bold text-white">{nbSoumissions}</p>
          <p className="text-xs text-slate-500 mt-1">soumissions totales</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <TrendingDown className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Économies</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{totalSavings.toFixed(0)} €</p>
          <p className="text-xs text-slate-500 mt-1">estimées vs. prix max</p>
        </div>
      </div>

      {/* ── Filtres ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['tous', 'ouvert', 'en_cours', 'ferme'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === f
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {f === 'tous' ? 'Tous' : STATUS_CONFIG[f].label}
            <span className="ml-1.5 opacity-60">
              {f === 'tous' ? rfqs.length : rfqs.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Liste des appels d'offres ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Aucun appel d'offres</p>
          <p className="text-slate-600 text-sm mt-1">
            {filterStatus !== 'tous' ? 'Aucun résultat pour ce filtre.' : 'Créez votre premier appel d\'offres pour comparer les prix.'}
          </p>
          {filterStatus === 'tous' && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Créer un appel d'offres
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(rfq => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* ── Modal Création ────────────────────────────────────────────────── */}
      <CreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
