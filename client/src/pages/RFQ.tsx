import { formatCurrency } from '../utils/currency';
import { useState, useMemo } from 'react';
import {
  Plus, FileText, X, Euro, Clock, Send, CheckCircle, Trash2,
  ChevronDown, ChevronUp, TrendingDown, AlertCircle, Package,
  Users, BarChart3, Calendar, Tag, Award, Zap, Eye, Filter,
  ArrowRight, GripVertical, CircleDot, Trophy, Star, FileCheck,
  ClipboardList, Search, MoreHorizontal, ExternalLink
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// ── Types ───────────────────────────────────────────────────────────────────

type RFQStatus = 'brouillon' | 'envoyee' | 'reponses' | 'acceptee' | 'terminee';

interface MockQuote {
  id: number;
  supplier: string;
  unitPrice: number | null;
  deliveryDays: number | null;
  quality: number | null; // 1-5
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

// ── Data ────────────────────────────────────────────────────────────────────
const INITIAL_RFQS: MockRFQ[] = [];

// ── Status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RFQStatus, { label: string; color: string; bgColor: string; icon: typeof FileText }> = {
  brouillon: {
    label: 'Brouillon',
    color: 'text-[#6B7280] dark:text-mono-700',
    bgColor: 'bg-mono-950 dark:bg-[#171717] border-mono-900 dark:border-mono-300',
    icon: FileText,
  },
  envoyee: {
    label: 'Envoyee',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30',
    icon: Send,
  },
  reponses: {
    label: 'Reponses',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30',
    icon: ClipboardList,
  },
  acceptee: {
    label: 'Acceptee',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30',
    icon: CheckCircle,
  },
  terminee: {
    label: 'Terminee',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/30',
    icon: FileCheck,
  },
};

const STATUS_ORDER: RFQStatus[] = ['brouillon', 'envoyee', 'reponses', 'acceptee', 'terminee'];

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function computeScore(quote: MockQuote, bestPrice: number | null): number {
  if (quote.unitPrice === null) return 0;
  let score = 0;
  // Price score (40%): lower is better
  if (bestPrice !== null && bestPrice > 0) {
    score += (bestPrice / quote.unitPrice) * 40;
  }
  // Delivery score (30%): faster is better
  if (quote.deliveryDays !== null) {
    score += Math.max(0, (10 - quote.deliveryDays) / 10) * 30;
  } else {
    score += 15; // neutral if unknown
  }
  // Quality score (30%)
  if (quote.quality !== null) {
    score += (quote.quality / 5) * 30;
  } else {
    score += 15; // neutral if unknown
  }
  return Math.round(score);
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30';
  if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30';
  return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30';
}

// ── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RFQStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bgColor} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Score Badge ─────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border ${getScoreBg(score)} ${getScoreColor(score)}`}>
      <Zap className="w-3 h-3" />
      {score}/100
    </span>
  );
}

// ── Create Modal ────────────────────────────────────────────────────────────

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
  const [step, setStep] = useState(1);

  function handleSubmit() {
    if (!form.title.trim()) { setError('Le titre est obligatoire.'); return; }
    if (!form.suppliers.trim()) { setError('Ajoutez au moins un fournisseur.'); return; }
    if (!form.products.trim()) { setError('Ajoutez au moins un produit.'); return; }
    setError('');
    onCreate(form);
    setForm({ title: '', dueDate: '', notes: '', suppliers: '', products: '' });
    setStep(1);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-black border border-mono-900 dark:border-mono-200 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-mono-900 dark:border-mono-200">
          <div>
            <h2 className="text-lg font-bold text-mono-100 dark:text-white">Nouvel appel d'offres</h2>
            <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5">Etape {step}/2</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-mono-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-mono-950 dark:bg-[#171717]">
          <div className="h-full bg-mono-100 dark:bg-white transition-all" style={{ width: `${(step / 2) * 100}%` }} />
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-mono-100 dark:text-white mb-1.5">
                  Titre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex : Commande legumes -- Semaine 16"
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-mono-100 dark:text-white mb-1.5">
                    <Calendar className="inline w-3.5 h-3.5 mr-1 text-[#9CA3AF] dark:text-mono-500" />
                    Date limite
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-mono-100 dark:text-white mb-1.5">
                    <Users className="inline w-3.5 h-3.5 mr-1 text-[#9CA3AF] dark:text-mono-500" />
                    Fournisseurs <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.suppliers}
                    onChange={e => setForm(f => ({ ...f, suppliers: e.target.value }))}
                    placeholder="Metro, Pomona, ..."
                    className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-mono-100 dark:text-white mb-1.5">
                  <Package className="inline w-3.5 h-3.5 mr-1 text-[#9CA3AF] dark:text-mono-500" />
                  Produits <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.products}
                  onChange={e => setForm(f => ({ ...f, products: e.target.value }))}
                  rows={4}
                  placeholder="Ex : Tomates 20kg, Courgettes 15kg, ..."
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-mono-100 dark:text-white mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Instructions pour les fournisseurs..."
                  className="w-full px-4 py-3 bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent resize-none transition-all"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-mono-900 dark:border-mono-200">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2.5 border border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-700 rounded-xl text-sm font-medium hover:bg-[#F9FAFB] dark:hover:bg-mono-50 transition-colors"
            >
              Retour
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-700 rounded-xl text-sm font-medium hover:bg-[#F9FAFB] dark:hover:bg-mono-50 transition-colors"
          >
            Annuler
          </button>
          {step < 2 ? (
            <button
              onClick={() => {
                if (!form.title.trim()) { setError('Le titre est obligatoire.'); return; }
                if (!form.suppliers.trim()) { setError('Ajoutez au moins un fournisseur.'); return; }
                setError('');
                setStep(2);
              }}
              className="px-6 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors flex items-center gap-2"
            >
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Creer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Quote Comparison Table ──────────────────────────────────────────────────

function QuoteComparisonTable({ rfq, onAward }: {
  rfq: MockRFQ;
  onAward: (rfqId: number, itemId: number, quoteId: number) => void;
}) {
  if (rfq.items.length === 0) return null;

  const allSuppliers = Array.from(new Set(rfq.items.flatMap(item => item.quotes.map(q => q.supplier))));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-mono-900 dark:border-mono-200">
            <th className="text-left py-3 px-3 text-[11px] font-bold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">Produit</th>
            <th className="text-left py-3 px-3 text-[11px] font-bold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">Qte</th>
            {allSuppliers.map(s => (
              <th key={s} className="text-center py-3 px-3 text-[11px] font-bold text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-mono-900 dark:divide-mono-200">
          {rfq.items.map(item => {
            const bestPrice = getBestPrice(item);
            return (
              <tr key={item.id} className="hover:bg-[#F9FAFB] dark:hover:bg-mono-50 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-500" />
                    <span className="font-medium text-mono-100 dark:text-white">{item.product}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-[#6B7280] dark:text-mono-700">
                  {item.quantity} {item.unit}
                </td>
                {allSuppliers.map(supplierName => {
                  const quote = item.quotes.find(q => q.supplier === supplierName);
                  if (!quote || quote.unitPrice === null) {
                    return (
                      <td key={supplierName} className="py-3 px-3 text-center">
                        <span className="text-xs text-[#D1D5DB] dark:text-mono-400 italic">--</span>
                      </td>
                    );
                  }
                  const isBest = quote.unitPrice === bestPrice;
                  const score = computeScore(quote, bestPrice);
                  return (
                    <td key={supplierName} className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`text-sm font-bold tabular-nums ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-mono-100 dark:text-white'}`}>
                          {formatCurrency(quote.unitPrice)}
                        </div>
                        <ScoreBadge score={score} />
                        <div className="text-[10px] text-[#9CA3AF] dark:text-mono-500 tabular-nums">
                          Total: {formatCurrency(quote.unitPrice * item.quantity)}
                        </div>
                        {!quote.selected && rfq.status === 'reponses' && (
                          <button
                            onClick={() => onAward(rfq.id, item.id, quote.id)}
                            className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <Trophy className="w-2.5 h-2.5" /> Attribuer
                          </button>
                        )}
                        {quote.selected && (
                          <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="w-2.5 h-2.5" /> Attribue
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── RFQ Card ────────────────────────────────────────────────────────────────

function RFQCard({ rfq, onDelete, onStatusChange, onAward }: {
  rfq: MockRFQ;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: RFQStatus) => void;
  onAward: (rfqId: number, itemId: number, quoteId: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const saving = estimatedSaving(rfq);
  const quotedItems = rfq.items.filter(item => item.quotes.some(q => q.unitPrice !== null)).length;
  const totalItems = rfq.items.length;
  const progressPct = totalItems > 0 ? (quotedItems / totalItems) * 100 : 0;

  // Next status
  const nextStatus: Partial<Record<RFQStatus, { status: RFQStatus; label: string; icon: typeof Send }>> = {
    brouillon: { status: 'envoyee', label: 'Envoyer', icon: Send },
    envoyee: { status: 'reponses', label: 'Reponses recues', icon: ClipboardList },
    reponses: { status: 'acceptee', label: 'Accepter', icon: CheckCircle },
    acceptee: { status: 'terminee', label: 'Terminer', icon: FileCheck },
  };

  const next = nextStatus[rfq.status];

  return (
    <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden hover:border-[#D1D5DB] dark:hover:border-[#333] transition-all">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F9FAFB] dark:hover:bg-mono-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusBadge status={rfq.status} />
          <div className="min-w-0">
            <p className="font-bold text-mono-100 dark:text-white truncate">{rfq.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-[#9CA3AF] dark:text-mono-500 flex items-center gap-1">
                <Users className="w-3 h-3" /> {rfq.suppliers.join(', ')}
              </span>
              <span className="text-[#D1D5DB] dark:text-mono-350">|</span>
              <span className="text-xs text-[#9CA3AF] dark:text-mono-500 flex items-center gap-1">
                <Package className="w-3 h-3" /> {totalItems} produit{totalItems > 1 ? 's' : ''}
              </span>
              {rfq.dueDate && (
                <>
                  <span className="text-[#D1D5DB] dark:text-mono-350">|</span>
                  <span className="text-xs text-[#9CA3AF] dark:text-mono-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(rfq.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-3">
          {/* Savings */}
          {saving > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/30">
              <TrendingDown className="w-3.5 h-3.5" />
              -{formatCurrency(saving)}
            </div>
          )}

          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-20 h-2 rounded-full bg-mono-950 dark:bg-[#171717] overflow-hidden">
              <div
                className="h-full rounded-full bg-mono-100 dark:bg-white transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] text-[#6B7280] dark:text-mono-700 tabular-nums font-medium">{quotedItems}/{totalItems}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            {next && (
              <button
                onClick={() => onStatusChange(rfq.id, next.status)}
                title={next.label}
                className="p-2 rounded-xl bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 hover:border-mono-100 dark:hover:border-white/20 transition-colors"
              >
                <next.icon className="w-4 h-4 text-mono-100 dark:text-white" />
              </button>
            )}
            <button
              onClick={() => onDelete(rfq.id)}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-[#D1D5DB] dark:text-mono-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-mono-900 dark:border-mono-200">
          {/* Meta */}
          {rfq.notes && (
            <p className="px-5 py-3 text-sm text-[#6B7280] dark:text-mono-700 italic border-b border-mono-900 dark:border-mono-200">
              {rfq.notes}
            </p>
          )}

          {/* Toggle comparison view */}
          {rfq.items.some(item => item.quotes.length > 0) && (
            <div className="px-5 py-3 border-b border-mono-900 dark:border-mono-200">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showComparison
                    ? 'bg-mono-100 dark:bg-white text-white dark:text-black border-transparent'
                    : 'bg-[#F9FAFB] dark:bg-mono-50 border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-700 hover:border-[#D1D5DB] dark:hover:border-[#333]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {showComparison ? 'Masquer la comparaison' : 'Tableau de comparaison'}
              </button>
            </div>
          )}

          {/* Comparison table */}
          {showComparison && (
            <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200">
              <QuoteComparisonTable rfq={rfq} onAward={onAward} />
            </div>
          )}

          {/* Item list */}
          <div className="px-5 py-4 space-y-3">
            {rfq.items.map(item => {
              const bestPrice = getBestPrice(item);
              return (
                <div key={item.id} className="border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden">
                  {/* Item header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#F9FAFB] dark:bg-mono-50">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-mono-500" />
                      <span className="font-semibold text-mono-100 dark:text-white text-sm">{item.product}</span>
                      <span className="text-[#9CA3AF] dark:text-mono-500 text-xs">-- {item.quantity} {item.unit}</span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider font-bold">{item.category}</span>
                  </div>

                  {/* Quote rows */}
                  <div className="divide-y divide-mono-900 dark:divide-mono-200">
                    {item.quotes.length === 0 ? (
                      <div className="px-4 py-4 text-center text-xs text-[#9CA3AF] dark:text-mono-500 italic">
                        Aucun devis recu pour ce produit
                      </div>
                    ) : (
                      item.quotes
                        .slice()
                        .sort((a, b) => computeScore(b, bestPrice) - computeScore(a, bestPrice))
                        .map((quote, idx) => {
                          const isBest = quote.unitPrice !== null && quote.unitPrice === bestPrice;
                          const score = computeScore(quote, bestPrice);
                          return (
                            <div
                              key={quote.id}
                              className={`flex items-center gap-4 px-4 py-3 ${
                                quote.selected
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/10'
                                  : idx === 0 && quote.unitPrice !== null
                                  ? 'bg-amber-50/30 dark:bg-amber-950/5'
                                  : ''
                              }`}
                            >
                              {/* Rank */}
                              <div className="w-6 text-center">
                                {idx === 0 && quote.unitPrice !== null ? (
                                  <Trophy className="w-4 h-4 text-amber-500 mx-auto" />
                                ) : (
                                  <span className="text-xs text-[#D1D5DB] dark:text-mono-400 font-bold">#{idx + 1}</span>
                                )}
                              </div>

                              {/* Supplier */}
                              <div className="w-28 shrink-0">
                                <p className="text-sm font-semibold text-mono-100 dark:text-white">{quote.supplier}</p>
                                {quote.selected && (
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                    <CheckCircle className="w-2.5 h-2.5" /> Attribue
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="flex-1">
                                {quote.unitPrice !== null ? (
                                  <div className="flex items-center gap-3">
                                    <span className={`text-sm font-bold tabular-nums ${
                                      isBest ? 'text-emerald-600 dark:text-emerald-400' : quote.selected ? 'text-emerald-600 dark:text-emerald-400' : 'text-mono-100 dark:text-white'
                                    }`}>
                                      {formatCurrency(quote.unitPrice)} / {item.unit}
                                    </span>
                                    {isBest && (
                                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                                        Meilleur prix
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-[#9CA3AF] dark:text-mono-500 italic">En attente</span>
                                )}
                                {quote.notes && (
                                  <p className="text-[11px] text-[#9CA3AF] dark:text-mono-500 mt-0.5">{quote.notes}</p>
                                )}
                              </div>

                              {/* Score */}
                              {quote.unitPrice !== null && (
                                <ScoreBadge score={score} />
                              )}

                              {/* Total */}
                              {quote.unitPrice !== null && (
                                <div className="text-right hidden sm:block w-24">
                                  <p className="text-xs text-[#9CA3AF] dark:text-mono-500">Total</p>
                                  <p className="text-sm font-bold text-mono-100 dark:text-white tabular-nums">
                                    {formatCurrency(quote.unitPrice * item.quantity)}
                                  </p>
                                </div>
                              )}

                              {/* Quick award */}
                              {!quote.selected && rfq.status === 'reponses' && quote.unitPrice !== null && (
                                <button
                                  onClick={() => onAward(rfq.id, item.id, quote.id)}
                                  className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1"
                                >
                                  <Zap className="w-3 h-3" /> Attribuer
                                </button>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Kanban Column ───────────────────────────────────────────────────────────

function KanbanColumn({ status, rfqs, onDelete, onStatusChange, onAward }: {
  status: RFQStatus;
  rfqs: MockRFQ[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: RFQStatus) => void;
  onAward: (rfqId: number, itemId: number, quoteId: number) => void;
}) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <div className="flex-1 min-w-[280px]">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border mb-3 ${cfg.bgColor}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
        <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
        <span className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${cfg.bgColor} ${cfg.color}`}>
          {rfqs.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {rfqs.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-mono-900 dark:border-mono-300 rounded-xl">
            <p className="text-xs text-[#D1D5DB] dark:text-mono-400">Aucun appel d'offres</p>
          </div>
        ) : (
          rfqs.map(rfq => {
            const saving = estimatedSaving(rfq);
            const quotedItems = rfq.items.filter(item => item.quotes.some(q => q.unitPrice !== null)).length;
            const totalItems = rfq.items.length;

            return (
              <div
                key={rfq.id}
                className="bg-white dark:bg-black border border-mono-900 dark:border-mono-200 rounded-xl p-3.5 hover:border-[#D1D5DB] dark:hover:border-[#333] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-mono-100 dark:text-white text-sm truncate">{rfq.title}</p>
                  <button
                    onClick={() => onDelete(rfq.id)}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/20 text-[#D1D5DB] dark:text-mono-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] dark:text-mono-500 mb-2">
                  <Users className="w-3 h-3" />
                  <span className="truncate">{rfq.suppliers.join(', ')}</span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 rounded-full bg-mono-950 dark:bg-[#171717] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-mono-100 dark:bg-white transition-all"
                      style={{ width: totalItems > 0 ? `${(quotedItems / totalItems) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-[10px] text-[#6B7280] dark:text-mono-700 tabular-nums font-medium">{quotedItems}/{totalItems}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {saving > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                      <TrendingDown className="w-2.5 h-2.5" /> -{formatCurrency(saving)}
                    </span>
                  )}
                  {rfq.dueDate && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-[#9CA3AF] dark:text-mono-500">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(rfq.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-[#9CA3AF] dark:text-mono-500">
                    {totalItems} produit{totalItems > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

type ViewMode = 'kanban' | 'list';

export default function RFQPage() {
  const { t } = useTranslation();
  const [rfqs, setRfqs] = useState<MockRFQ[]>(INITIAL_RFQS);
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RFQStatus | 'tous'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleCreate(form: CreateForm) {
    const newRfq: MockRFQ = {
      id: Date.now(),
      title: form.title,
      status: 'brouillon',
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
    showToast('Appel d\'offres cree avec succes !');
  }

  function handleDelete(id: number) {
    setRfqs(prev => prev.filter(r => r.id !== id));
    showToast('Appel d\'offres supprime.');
  }

  function handleStatusChange(id: number, status: RFQStatus) {
    setRfqs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Statut mis a jour : ${STATUS_CONFIG[status].label}`);
  }

  function handleAward(rfqId: number, itemId: number, quoteId: number) {
    setRfqs(prev => prev.map(rfq => {
      if (rfq.id !== rfqId) return rfq;
      return {
        ...rfq,
        items: rfq.items.map(item => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            quotes: item.quotes.map(q => ({
              ...q,
              selected: q.id === quoteId,
            })),
          };
        }),
      };
    }));
    showToast('Devis attribue avec succes !');
  }

  // Stats
  const stats = useMemo(() => {
    const byStatus: Record<string, number> = {};
    STATUS_ORDER.forEach(s => byStatus[s] = 0);
    rfqs.forEach(r => { byStatus[r.status] = (byStatus[r.status] || 0) + 1; });

    const totalSavings = rfqs.reduce((acc, r) => acc + estimatedSaving(r), 0);
    const nbSoumissions = rfqs.reduce((acc, r) => acc + r.items.reduce((a, i) => a + i.quotes.filter(q => q.unitPrice !== null).length, 0), 0);

    return { byStatus, totalSavings, nbSoumissions, total: rfqs.length };
  }, [rfqs]);

  // Filtered
  const filteredRfqs = useMemo(() => {
    let list = filterStatus === 'tous' ? rfqs : rfqs.filter(r => r.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.suppliers.some(s => s.toLowerCase().includes(q)) ||
        r.items.some(i => i.product.toLowerCase().includes(q))
      );
    }
    return list;
  }, [rfqs, filterStatus, searchQuery]);

  // Kanban grouped
  const kanbanGroups = useMemo(() => {
    const groups: Record<RFQStatus, MockRFQ[]> = {
      brouillon: [], envoyee: [], reponses: [], acceptee: [], terminee: [],
    };
    let list = rfqs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.suppliers.some(s => s.toLowerCase().includes(q))
      );
    }
    list.forEach(r => groups[r.status].push(r));
    return groups;
  }, [rfqs, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-mono-100 dark:bg-white text-white dark:text-black'
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-mono-100 dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200">
                <FileText className="w-6 h-6 text-mono-100 dark:text-white" />
              </div>
              Appels d'offres
            </h1>
            <p className="text-sm text-[#9CA3AF] dark:text-mono-500 mt-1">
              Comparez les prix fournisseurs et optimisez vos achats
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm transition-all hover:bg-[#333] dark:hover:bg-[#E5E5E5] hover:shadow-md active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            Creer un appel d'offres
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="w-4 h-4 text-mono-100 dark:text-white" />
              <span className="text-[11px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide font-bold">Total</span>
            </div>
            <p className="text-3xl font-black text-mono-100 dark:text-white">{stats.total}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-mono-500 mt-0.5">appels d'offres</p>
          </div>

          <div className="bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Send className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide font-bold">En cours</span>
            </div>
            <p className="text-3xl font-black text-mono-100 dark:text-white">{(stats.byStatus['envoyee'] || 0) + (stats.byStatus['reponses'] || 0)}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-mono-500 mt-0.5">en negociation</p>
          </div>

          <div className="bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span className="text-[11px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide font-bold">Devis recus</span>
            </div>
            <p className="text-3xl font-black text-mono-100 dark:text-white">{stats.nbSoumissions}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-mono-500 mt-0.5">soumissions</p>
          </div>

          <div className="bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide font-bold">Economies</span>
            </div>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.totalSavings)}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-mono-500 mt-0.5">estimees vs. prix max</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D1D5DB] dark:text-mono-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, fournisseur, produit..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-400 focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Status filters (for list view) */}
          {viewMode === 'list' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['tous', ...STATUS_ORDER] as const).map(f => {
                const count = f === 'tous' ? rfqs.length : rfqs.filter(r => r.status === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                      filterStatus === f
                        ? 'bg-mono-100 dark:bg-white text-white dark:text-black shadow-sm'
                        : 'bg-[#F9FAFB] dark:bg-mono-50 border border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-700 hover:border-[#D1D5DB] dark:hover:border-[#333]'
                    }`}
                  >
                    {f === 'tous' ? 'Tous' : STATUS_CONFIG[f].label}
                    <span className="ml-1.5 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-mono-950 dark:bg-[#171717] rounded-xl p-0.5 ml-auto">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white dark:bg-mono-300 shadow-sm text-mono-100 dark:text-white' : 'text-[#9CA3AF] dark:text-mono-500'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-mono-300 shadow-sm text-mono-100 dark:text-white' : 'text-[#9CA3AF] dark:text-mono-500'
              }`}
            >
              Liste
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'kanban' ? (
          /* ── Kanban Board ──────────────────────────────────────────────── */
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {STATUS_ORDER.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                rfqs={kanbanGroups[status]}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onAward={handleAward}
              />
            ))}
          </div>
        ) : (
          /* ── List View ─────────────────────────────────────────────────── */
          filteredRfqs.length === 0 ? (
            <div className="text-center py-20 bg-[#F9FAFB] dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-mono-900 dark:border-mono-200 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#D1D5DB] dark:text-mono-350" />
              </div>
              <p className="text-mono-100 dark:text-white font-semibold">Aucun appel d'offres</p>
              <p className="text-sm text-[#9CA3AF] dark:text-mono-500 mt-1">
                {filterStatus !== 'tous' || searchQuery ? 'Aucun resultat pour ces filtres.' : 'Creez votre premier appel d\'offres pour comparer les prix.'}
              </p>
              {filterStatus === 'tous' && !searchQuery && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-4 px-5 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                >
                  Creer un appel d'offres
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRfqs.map(rfq => (
                <RFQCard
                  key={rfq.id}
                  rfq={rfq}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                  onAward={handleAward}
                />
              ))}
            </div>
          )
        )}

        {/* Create Modal */}
        <CreateModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      </div>
    </div>
  );
}
