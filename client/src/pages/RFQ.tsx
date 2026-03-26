import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2, CheckCircle, Send, FileText, X, Euro, AlertCircle, Tag, ShoppingCart, Clock, ChevronLeft, ChevronRight, Megaphone, Sparkles, ExternalLink } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

type Ingredient = { id: number; name: string; unit: string; category: string; pricePerUnit: number };
type Supplier = { id: number; name: string; email?: string; contactName?: string };
type RFQQuote = { id: number; supplierId: number; unitPrice: number | null; notes: string | null; selected: boolean; supplier: Supplier };
type RFQItem = { id: number; ingredientId: number; quantity: number; ingredient: Ingredient; quotes: RFQQuote[] };
type RFQSupplier = { id: number; supplierId: number; supplier: Supplier };
type RFQData = {
  id: number; title: string; status: string; dueDate: string | null; notes: string | null;
  createdAt: string; items: RFQItem[]; suppliers: RFQSupplier[];
};

type SupplierPromo = {
  id: string;
  supplier: string;
  supplierColor: string;
  supplierBg: string;
  supplierIcon: string;
  product: string;
  description: string;
  price?: string;
  discount?: string;
  expiryDate: string;
  badge?: string;
  highlight?: boolean;
};

const STATUS_LABELS: Record<string, string> = { draft: 'Brouillon', sent: 'Envoy\u00e9', closed: 'Cl\u00f4tur\u00e9' };
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  closed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

// ── Mock supplier promotions (would come from API in production) ────────────
const SUPPLIER_PROMOS: SupplierPromo[] = [
  {
    id: 'promo-1',
    supplier: 'Transgourmet',
    supplierColor: 'text-red-700 dark:text-red-400',
    supplierBg: 'from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800/40',
    supplierIcon: 'TG',
    product: 'Saumon frais d\'Ecosse',
    description: 'Filet de saumon frais Label Rouge, pi\u00e8ce de 1.2kg minimum',
    discount: '-20%',
    expiryDate: '31/03/2026',
    badge: 'Promo Semaine',
    highlight: true,
  },
  {
    id: 'promo-2',
    supplier: 'Metro',
    supplierColor: 'text-blue-700 dark:text-blue-400',
    supplierBg: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/40',
    supplierIcon: 'M',
    product: 'Huile d\'olive extra vierge 5L',
    description: 'Huile d\'olive premi\u00e8re pression \u00e0 froid, origine Espagne',
    price: '12.99\u20ac',
    expiryDate: '05/04/2026',
    badge: 'Offre sp\u00e9ciale',
  },
  {
    id: 'promo-3',
    supplier: 'Pomona',
    supplierColor: 'text-green-700 dark:text-green-400',
    supplierBg: 'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800/40',
    supplierIcon: 'P',
    product: 'Fraises Gariguette',
    description: 'Arrivage direct producteur, cat\u00e9gorie Extra, plateau 1kg',
    price: '3.50\u20ac/kg',
    expiryDate: '28/03/2026',
    badge: 'Arrivage',
  },
  {
    id: 'promo-4',
    supplier: 'Sysco France',
    supplierColor: 'text-indigo-700 dark:text-indigo-400',
    supplierBg: 'from-indigo-50 to-indigo-100/50 dark:from-indigo-950/30 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800/40',
    supplierIcon: 'SF',
    product: 'Filet de boeuf Charolais',
    description: 'Race Charolaise, maturation 21 jours, pi\u00e8ce de 2kg',
    discount: '-15%',
    expiryDate: '02/04/2026',
    badge: 'Exclusivit\u00e9',
  },
  {
    id: 'promo-5',
    supplier: 'Brake France',
    supplierColor: 'text-orange-700 dark:text-orange-400',
    supplierBg: 'from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800/40',
    supplierIcon: 'BF',
    product: 'Cr\u00e8me fra\u00eeche 35% MG 5L',
    description: 'Cr\u00e8me fra\u00eeche \u00e9paisse, id\u00e9ale cuisson et p\u00e2tisserie',
    price: '8.49\u20ac',
    expiryDate: '10/04/2026',
    badge: 'Prix bas',
  },
];

const BANNER_ADS = [
  {
    id: 'banner-1',
    supplier: 'Transgourmet',
    message: 'Livraison offerte d\u00e8s 250\u20ac de commande cette semaine',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-slate-800 dark:to-red-950/20',
  },
  {
    id: 'banner-2',
    supplier: 'Metro',
    message: 'Nouveaux produits bio : d\u00e9couvrez notre gamme \u00e9co-responsable',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-slate-800 dark:to-blue-950/20',
  },
  {
    id: 'banner-3',
    supplier: 'Pomona',
    message: 'Saison des asperges : commandez avant jeudi pour livraison vendredi',
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-gradient-to-r from-green-50 via-white to-green-50 dark:from-green-950/20 dark:via-slate-800 dark:to-green-950/20',
  },
];

// ── Promo Card Component ────────────────────────────────────────────────────
function PromoCard({ promo, onOrder }: { promo: SupplierPromo; onOrder: (p: SupplierPromo) => void }) {
  return (
    <div
      className={`
        relative flex-shrink-0 w-72 rounded-xl border bg-gradient-to-br ${promo.supplierBg}
        p-4 flex flex-col gap-3 transition-all duration-200
        hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
        ${promo.highlight ? 'ring-2 ring-amber-300 dark:ring-amber-600 shadow-md' : 'shadow-sm'}
      `}
    >
      {/* Sponsored badge */}
      <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide uppercase bg-white/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
        Sponsoris\u00e9
      </span>

      {/* Supplier header */}
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
          promo.supplier === 'Transgourmet' ? 'bg-red-600' :
          promo.supplier === 'Metro' ? 'bg-blue-600' :
          promo.supplier === 'Pomona' ? 'bg-green-600' :
          promo.supplier === 'Sysco France' ? 'bg-indigo-600' :
          'bg-orange-600'
        }`}>
          {promo.supplierIcon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${promo.supplierColor} truncate`}>{promo.supplier}</p>
          {promo.badge && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3 h-3" />
              {promo.badge}
            </span>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="flex-1 min-h-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">{promo.product}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{promo.description}</p>
      </div>

      {/* Price / Discount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {promo.discount && (
            <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold">
              {promo.discount}
            </span>
          )}
          {promo.price && (
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{promo.price}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3" />
          {promo.expiryDate}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onOrder(promo)}
        className={`
          w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5
          transition-colors
          ${promo.supplier === 'Transgourmet' ? 'bg-red-600 hover:bg-red-700' :
            promo.supplier === 'Metro' ? 'bg-blue-600 hover:bg-blue-700' :
            promo.supplier === 'Pomona' ? 'bg-green-600 hover:bg-green-700' :
            promo.supplier === 'Sysco France' ? 'bg-indigo-600 hover:bg-indigo-700' :
            'bg-orange-600 hover:bg-orange-700'}
          text-white shadow-sm
        `}
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Commander
      </button>
    </div>
  );
}

// ── Banner Ad Component ─────────────────────────────────────────────────────
function BannerAd() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNER_ADS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const banner = BANNER_ADS[currentBanner];

  return (
    <div className={`relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${banner.bg} transition-all duration-500`}>
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide uppercase bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600">
            Espace partenaire
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <Megaphone className={`w-4 h-4 shrink-0 ${banner.color}`} />
            <p className={`text-sm font-medium ${banner.color} truncate`}>
              <span className="font-bold">{banner.supplier}</span> &mdash; {banner.message}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-3">
          {BANNER_ADS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === currentBanner
                  ? 'bg-slate-400 dark:bg-slate-500'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Supplier Promos Carousel ────────────────────────────────────────────────
function SupplierPromosSection({ onOrder }: { onOrder: (p: SupplierPromo) => void }) {
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef) return;
    setCanScrollLeft(scrollRef.scrollLeft > 0);
    setCanScrollRight(scrollRef.scrollLeft < scrollRef.scrollWidth - scrollRef.clientWidth - 10);
  }, [scrollRef]);

  useEffect(() => {
    if (!scrollRef) return;
    checkScroll();
    scrollRef.addEventListener('scroll', checkScroll, { passive: true });
    return () => scrollRef.removeEventListener('scroll', checkScroll);
  }, [scrollRef, checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef) return;
    scrollRef.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Offres fournisseurs</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Promotions et offres exclusives de nos partenaires</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <a
            href="#"
            className="ml-1 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            Tout voir <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div
        ref={setScrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SUPPLIER_PROMOS.map(promo => (
          <PromoCard key={promo.id} promo={promo} onOrder={onOrder} />
        ))}
      </div>
    </div>
  );
}

// ── Main RFQ Page ───────────────────────────────────────────────────────────
export default function RFQPage() {
  const { showToast } = useToast();
  const [rfqs, setRfqs] = useState<RFQData[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingQuote, setEditingQuote] = useState<{ quoteId: number; value: string; notes: string } | null>(null);

  // Create form state
  const [form, setForm] = useState({
    title: '', dueDate: '', notes: '',
    selectedIngredients: [] as { ingredientId: number; quantity: string }[],
    selectedSupplierIds: [] as number[],
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API}/api/rfqs`, { headers: authHeaders() }),
        fetch(`${API}/api/ingredients`, { headers: authHeaders() }),
        fetch(`${API}/api/suppliers`, { headers: authHeaders() }),
      ]);
      if (r1.ok) setRfqs(await r1.json());
      if (r2.ok) setIngredients(await r2.json());
      if (r3.ok) setSuppliers(await r3.json());
    } catch { showToast('Erreur chargement', 'error'); }
    setLoading(false);
  }

  async function handleCreate() {
    const items = form.selectedIngredients.filter(i => i.ingredientId && parseFloat(i.quantity) > 0);
    if (!form.title.trim() || items.length === 0 || form.selectedSupplierIds.length === 0) {
      showToast('Remplissez titre, produits et fournisseurs', 'error'); return;
    }
    try {
      const res = await fetch(`${API}/api/rfqs`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: form.title, dueDate: form.dueDate || null, notes: form.notes || null,
          items: items.map(i => ({ ingredientId: i.ingredientId, quantity: parseFloat(i.quantity) })),
          supplierIds: form.selectedSupplierIds,
        }),
      });
      if (!res.ok) { const e = await res.json(); showToast(e.error, 'error'); return; }
      const created = await res.json();
      setRfqs(prev => [created, ...prev]);
      setShowCreate(false);
      setForm({ title: '', dueDate: '', notes: '', selectedIngredients: [], selectedSupplierIds: [] });
      setExpandedId(created.id);
      showToast('Appel d\'offres cr\u00e9\u00e9', 'success');
    } catch { showToast('Erreur cr\u00e9ation', 'error'); }
  }

  async function handleStatusChange(rfq: RFQData, status: string) {
    try {
      const res = await fetch(`${API}/api/rfqs/${rfq.id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setRfqs(prev => prev.map(r => r.id === rfq.id ? updated : r));
    } catch { showToast('Erreur mise \u00e0 jour', 'error'); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await fetch(`${API}/api/rfqs/${deleteId}`, { method: 'DELETE', headers: authHeaders() });
      setRfqs(prev => prev.filter(r => r.id !== deleteId));
      if (expandedId === deleteId) setExpandedId(null);
      showToast('Supprim\u00e9', 'success');
    } catch { showToast('Erreur suppression', 'error'); }
    setDeleteId(null);
  }

  async function handleSaveQuote(rfqId: number) {
    if (!editingQuote) return;
    try {
      const res = await fetch(`${API}/api/rfqs/${rfqId}/quotes/${editingQuote.quoteId}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ unitPrice: editingQuote.value === '' ? null : editingQuote.value, notes: editingQuote.notes || null }),
      });
      if (!res.ok) return;
      setEditingQuote(null);
      const rfqRes = await fetch(`${API}/api/rfqs/${rfqId}`, { headers: authHeaders() });
      if (rfqRes.ok) { const updated = await rfqRes.json(); setRfqs(prev => prev.map(r => r.id === rfqId ? updated : r)); }
    } catch { showToast('Erreur sauvegarde', 'error'); }
  }

  async function handleSelectQuote(rfqId: number, quoteId: number, applyPrice: boolean) {
    try {
      await fetch(`${API}/api/rfqs/${rfqId}/quotes/${quoteId}/select`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ applyPrice }),
      });
      const rfqRes = await fetch(`${API}/api/rfqs/${rfqId}`, { headers: authHeaders() });
      if (rfqRes.ok) { const updated = await rfqRes.json(); setRfqs(prev => prev.map(r => r.id === rfqId ? updated : r)); }
      showToast(applyPrice ? 'Prix appliqu\u00e9 \u00e0 l\'ingr\u00e9dient' : 'Offre s\u00e9lectionn\u00e9e', 'success');
    } catch { showToast('Erreur', 'error'); }
  }

  function handlePromoOrder(promo: SupplierPromo) {
    showToast(`Demande envoy\u00e9e \u00e0 ${promo.supplier} pour "${promo.product}"`, 'success');
  }

  const addIngredientRow = () =>
    setForm(f => ({ ...f, selectedIngredients: [...f.selectedIngredients, { ingredientId: 0, quantity: '' }] }));

  const removeIngredientRow = (idx: number) =>
    setForm(f => ({ ...f, selectedIngredients: f.selectedIngredients.filter((_, i) => i !== idx) }));

  const toggleSupplier = (id: number) =>
    setForm(f => ({
      ...f,
      selectedSupplierIds: f.selectedSupplierIds.includes(id)
        ? f.selectedSupplierIds.filter(s => s !== id)
        : [...f.selectedSupplierIds, id],
    }));

  function getBestQuote(item: RFQItem): RFQQuote | null {
    const withPrices = item.quotes.filter(q => q.unitPrice !== null);
    if (!withPrices.length) return null;
    return withPrices.reduce((best, q) => (q.unitPrice! < best.unitPrice! ? q : best));
  }

  if (loading) return <div className="flex items-center justify-center h-48 text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Appels d'offres</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Comparez les prix, profitez des promotions et optimisez vos achats
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouvel appel d'offres
        </button>
      </div>

      {/* ── Banner Ad ────────────────────────────────────────────────────── */}
      <BannerAd />

      {/* ── Supplier Promotions ──────────────────────────────────────────── */}
      <SupplierPromosSection onOrder={handlePromoOrder} />

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vos appels d'offres</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* ── RFQ List ─────────────────────────────────────────────────────── */}
      {rfqs.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun appel d'offres</p>
          <p className="text-sm mt-1">Cr\u00e9ez-en un pour comparer les prix de vos fournisseurs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rfqs.map(rfq => {
            const isExpanded = expandedId === rfq.id;
            const totalItems = rfq.items.length;
            const quotedItems = rfq.items.filter(item => item.quotes.some(q => q.unitPrice !== null)).length;
            return (
              <div key={rfq.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {/* RFQ Header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : rfq.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[rfq.status]}`}>
                      {STATUS_LABELS[rfq.status]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{rfq.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rfq.suppliers.map(s => s.supplier.name).join(', ')} &bull; {totalItems} produit{totalItems > 1 ? 's' : ''}
                        {rfq.dueDate && ` \u00b7 \u00c9ch\u00e9ance ${new Date(rfq.dueDate).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {/* Progress indicator */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          style={{ width: totalItems > 0 ? `${(quotedItems / totalItems) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 tabular-nums">{quotedItems}/{totalItems}</span>
                    </div>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {rfq.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(rfq, 'sent')}
                          title="Marquer comme envoy\u00e9"
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {rfq.status === 'sent' && (
                        <button
                          onClick={() => handleStatusChange(rfq, 'closed')}
                          title="Cl\u00f4turer"
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(rfq.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 space-y-4">
                    {rfq.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">{rfq.notes}</p>
                    )}
                    {rfq.items.map(item => {
                      const best = getBestQuote(item);
                      return (
                        <div key={item.id} className="border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden">
                          {/* Item header */}
                          <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-2 flex items-center justify-between">
                            <div>
                              <span className="font-medium text-slate-800 dark:text-slate-100">{item.ingredient.name}</span>
                              <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                                {item.quantity} {item.ingredient.unit}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">{item.ingredient.category}</span>
                          </div>
                          {/* Quotes grid */}
                          <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {item.quotes.map(quote => {
                              const isBest = best?.id === quote.id;
                              const isEditing = editingQuote?.quoteId === quote.id;
                              return (
                                <div
                                  key={quote.id}
                                  className={`flex items-center gap-3 px-4 py-2.5 ${isBest && !quote.selected ? 'bg-amber-50 dark:bg-amber-900/10' : ''} ${quote.selected ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                                >
                                  <div className="w-36 shrink-0">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{quote.supplier.name}</p>
                                    {isBest && !quote.selected && <span className="text-[10px] text-amber-600 font-medium">Meilleur prix</span>}
                                    {quote.selected && <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> S\u00e9lectionn\u00e9</span>}
                                  </div>

                                  {isEditing ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="relative w-28">
                                        <input
                                          type="number" step="0.01" min="0"
                                          value={editingQuote.value}
                                          onChange={e => setEditingQuote(eq => eq ? { ...eq, value: e.target.value } : null)}
                                          placeholder="0.00"
                                          className="w-full pl-7 pr-2 py-1 border border-blue-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                                          autoFocus
                                        />
                                        <Euro className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                      </div>
                                      <input
                                        type="text"
                                        value={editingQuote.notes}
                                        onChange={e => setEditingQuote(eq => eq ? { ...eq, notes: e.target.value } : null)}
                                        placeholder="Note (optionnel)"
                                        className="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                                      />
                                      <button onClick={() => handleSaveQuote(rfq.id)} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">OK</button>
                                      <button onClick={() => setEditingQuote(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                  ) : (
                                    <div
                                      className="flex-1 flex items-center gap-3 cursor-pointer"
                                      onClick={() => setEditingQuote({ quoteId: quote.id, value: quote.unitPrice?.toString() ?? '', notes: quote.notes ?? '' })}
                                    >
                                      {quote.unitPrice !== null ? (
                                        <span className={`text-sm font-semibold ${isBest ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                          {quote.unitPrice.toFixed(2)} \u20ac / {item.ingredient.unit}
                                        </span>
                                      ) : (
                                        <span className="text-sm text-slate-400 italic">Cliquer pour saisir</span>
                                      )}
                                      {quote.notes && <span className="text-xs text-slate-400">{quote.notes}</span>}
                                    </div>
                                  )}

                                  {quote.unitPrice !== null && !isEditing && (
                                    <div className="flex gap-1 shrink-0">
                                      {!quote.selected ? (
                                        <>
                                          <button
                                            onClick={() => handleSelectQuote(rfq.id, quote.id, false)}
                                            title="S\u00e9lectionner ce fournisseur"
                                            className="px-2 py-1 rounded text-xs border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                                          >
                                            Choisir
                                          </button>
                                          <button
                                            onClick={() => handleSelectQuote(rfq.id, quote.id, true)}
                                            title="Choisir et appliquer le prix \u00e0 l'ingr\u00e9dient"
                                            className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            Choisir + Appliquer
                                          </button>
                                        </>
                                      ) : (
                                        <span className="text-xs text-green-600 font-medium">\u2713 Prix appliqu\u00e9</span>
                                      )}
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
          })}
        </div>
      )}

      {/* ── Create Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nouvel appel d'offres">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre *</label>
            <input
              type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Commande l\u00e9gumes semaine 14"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date limite de r\u00e9ponse</label>
            <input
              type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Produits *</label>
              <button onClick={addIngredientRow} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
            {form.selectedIngredients.length === 0 && (
              <p className="text-sm text-slate-400 italic">Aucun produit ajout\u00e9</p>
            )}
            <div className="space-y-2">
              {form.selectedIngredients.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    value={row.ingredientId}
                    onChange={e => setForm(f => {
                      const arr = [...f.selectedIngredients];
                      arr[idx] = { ...arr[idx], ingredientId: parseInt(e.target.value) };
                      return { ...f, selectedIngredients: arr };
                    })}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value={0}>-- S\u00e9lectionner --</option>
                    {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
                  </select>
                  <input
                    type="number" min="0" step="0.01" placeholder="Qt\u00e9"
                    value={row.quantity}
                    onChange={e => setForm(f => {
                      const arr = [...f.selectedIngredients];
                      arr[idx] = { ...arr[idx], quantity: e.target.value };
                      return { ...f, selectedIngredients: arr };
                    })}
                    className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  />
                  <button onClick={() => removeIngredientRow(idx)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Suppliers */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fournisseurs *</label>
            {suppliers.length === 0 ? (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                Aucun fournisseur cr\u00e9\u00e9. Ajoutez-en dans la section Fournisseurs.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {suppliers.map(s => (
                  <label key={s.id} className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={form.selectedSupplierIds.includes(s.id)}
                      onChange={() => toggleSupplier(s.id)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{s.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} placeholder="Instructions pour les fournisseurs..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium">
              Annuler
            </button>
            <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Cr\u00e9er
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Supprimer l'appel d'offres ?"
        message="Cette action est irr\u00e9versible. Tous les devis associ\u00e9s seront supprim\u00e9s."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
