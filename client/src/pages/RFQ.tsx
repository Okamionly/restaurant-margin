import { useState, useEffect, useCallback } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2, CheckCircle, Send, FileText, X, Euro, AlertCircle, Tag, ShoppingCart, Clock, ChevronLeft, ChevronRight, Megaphone, Sparkles, ExternalLink, BarChart3, History, ArrowUpDown, Star, TrendingDown, Eye, XCircle } from 'lucide-react';
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

// ── Mock RFQ History ────────────────────────────────────────────────────────
interface RFQHistoryEntry {
  id: number;
  title: string;
  status: 'closed' | 'cancelled';
  createdAt: string;
  closedAt: string;
  supplierCount: number;
  itemCount: number;
  bestSaving: string;
  selectedSupplier: string;
}

const MOCK_RFQ_HISTORY: RFQHistoryEntry[] = [
  { id: 101, title: 'L\u00e9gumes bio - Semaine 11', status: 'closed', createdAt: '2026-03-09', closedAt: '2026-03-12', supplierCount: 3, itemCount: 8, bestSaving: '-12%', selectedSupplier: 'Pomona' },
  { id: 102, title: 'Viandes Charolaises', status: 'closed', createdAt: '2026-03-01', closedAt: '2026-03-05', supplierCount: 2, itemCount: 4, bestSaving: '-8%', selectedSupplier: 'Transgourmet' },
  { id: 103, title: 'Produits laitiers Mars', status: 'cancelled', createdAt: '2026-02-25', closedAt: '2026-02-27', supplierCount: 4, itemCount: 6, bestSaving: '-', selectedSupplier: '-' },
  { id: 104, title: 'Fruits de mer St-Valentin', status: 'closed', createdAt: '2026-02-10', closedAt: '2026-02-13', supplierCount: 3, itemCount: 5, bestSaving: '-18%', selectedSupplier: 'Brake France' },
  { id: 105, title: 'Huiles et condiments Q1', status: 'closed', createdAt: '2026-01-15', closedAt: '2026-01-20', supplierCount: 3, itemCount: 10, bestSaving: '-15%', selectedSupplier: 'Metro' },
];

// ── Promo Card Component (enhanced) ────────────────────────────────────────
function PromoCard({ promo, onOrder, isSelected, onToggleSelect }: {
  promo: SupplierPromo;
  onOrder: (p: SupplierPromo) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const supplierBgSolid = promo.supplier === 'Transgourmet' ? 'bg-red-600' :
    promo.supplier === 'Metro' ? 'bg-blue-600' :
    promo.supplier === 'Pomona' ? 'bg-green-600' :
    promo.supplier === 'Sysco France' ? 'bg-indigo-600' :
    'bg-orange-600';

  const supplierBgHover = promo.supplier === 'Transgourmet' ? 'hover:bg-red-700' :
    promo.supplier === 'Metro' ? 'hover:bg-blue-700' :
    promo.supplier === 'Pomona' ? 'hover:bg-green-700' :
    promo.supplier === 'Sysco France' ? 'hover:bg-indigo-700' :
    'hover:bg-orange-700';

  return (
    <div
      className={`
        relative flex-shrink-0 w-72 rounded-xl border bg-gradient-to-br ${promo.supplierBg}
        p-4 flex flex-col gap-3 transition-all duration-200
        hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
        ${promo.highlight ? 'ring-2 ring-amber-300 dark:ring-amber-600 shadow-md' : 'shadow-sm'}
        ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
      `}
    >
      {/* Top bar: checkbox + sponsored */}
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSelect(promo.id); }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
            isSelected
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
          }`}
          title="S\u00e9lectionner pour comparaison"
        >
          <BarChart3 className="w-3 h-3" />
          {isSelected ? 'S\u00e9lectionn\u00e9' : 'Comparer'}
        </button>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide uppercase bg-white/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
          Sponsoris\u00e9
        </span>
      </div>

      {/* Supplier header with rating */}
      <div className="flex items-center gap-2.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm ${supplierBgSolid}`}>
          {promo.supplierIcon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${promo.supplierColor} truncate`}>{promo.supplier}</p>
          <div className="flex items-center gap-2">
            {promo.badge && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3 h-3" />
                {promo.badge}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />4.5
            </span>
          </div>
        </div>
      </div>

      {/* Product info with better hierarchy */}
      <div className="flex-1 min-h-0 space-y-1.5">
        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">{promo.product}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{promo.description}</p>
      </div>

      {/* Price / Discount - enhanced */}
      <div className="flex items-end justify-between pt-1 border-t border-black/5 dark:border-white/5">
        <div className="flex items-baseline gap-2">
          {promo.discount && (
            <span className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-base font-extrabold tracking-tight">
              {promo.discount}
            </span>
          )}
          {promo.price && (
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{promo.price}</span>
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
          w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5
          transition-all shadow-sm active:scale-[0.98]
          ${supplierBgSolid} ${supplierBgHover} text-white
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

// ── Price Comparison Modal ─────────────────────────────────────────────────
function PriceComparisonModal({
  isOpen,
  onClose,
  selectedPromos,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPromos: SupplierPromo[];
}) {
  if (!isOpen || selectedPromos.length < 2) return null;

  const criteria = [
    { label: 'Produit', key: 'product' },
    { label: 'Prix / Remise', key: 'price' },
    { label: 'Description', key: 'description' },
    { label: 'Date d\'expiration', key: 'expiryDate' },
    { label: 'Badge', key: 'badge' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comparer les prix fournisseurs">
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider w-36">
                Crit\u00e8re
              </th>
              {selectedPromos.map(p => (
                <th key={p.id} className="text-center py-3 px-3 min-w-[160px]">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
                      p.supplier === 'Transgourmet' ? 'bg-red-600' :
                      p.supplier === 'Metro' ? 'bg-blue-600' :
                      p.supplier === 'Pomona' ? 'bg-green-600' :
                      p.supplier === 'Sysco France' ? 'bg-indigo-600' :
                      'bg-orange-600'
                    }`}>
                      {p.supplierIcon}
                    </div>
                    <span className={`font-semibold text-sm ${p.supplierColor}`}>{p.supplier}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {criteria.map(c => (
              <tr key={c.key} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wide">
                  {c.label}
                </td>
                {selectedPromos.map(p => {
                  let content: React.ReactNode;
                  if (c.key === 'product') {
                    content = <span className="font-semibold text-slate-800 dark:text-slate-100">{p.product}</span>;
                  } else if (c.key === 'price') {
                    content = (
                      <div className="flex flex-col items-center gap-1">
                        {p.discount && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold">
                            {p.discount}
                          </span>
                        )}
                        {p.price && (
                          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{p.price}</span>
                        )}
                        {!p.discount && !p.price && <span className="text-slate-400">-</span>}
                      </div>
                    );
                  } else if (c.key === 'description') {
                    content = <span className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{p.description}</span>;
                  } else if (c.key === 'expiryDate') {
                    content = (
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" /> {p.expiryDate}
                      </span>
                    );
                  } else if (c.key === 'badge') {
                    content = p.badge ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> {p.badge}
                      </span>
                    ) : <span className="text-slate-400">-</span>;
                  }
                  return (
                    <td key={p.id} className="py-3 px-3 text-center">
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </Modal>
  );
}

// ── RFQ History Section ────────────────────────────────────────────────────
function RFQHistorySection() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? MOCK_RFQ_HISTORY : MOCK_RFQ_HISTORY.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700">
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Historique des appels d'offres</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{MOCK_RFQ_HISTORY.length} appels pass\u00e9s</p>
          </div>
        </div>
        {MOCK_RFQ_HISTORY.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {showAll ? 'Voir moins' : `Tout voir (${MOCK_RFQ_HISTORY.length})`}
            <Eye className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
          <div className="col-span-4 lg:col-span-3">Titre</div>
          <div className="col-span-2 hidden lg:block">Date</div>
          <div className="col-span-2 text-center">Statut</div>
          <div className="col-span-2 text-center hidden sm:block">Fournisseurs</div>
          <div className="col-span-2 text-center">
            <span className="hidden sm:inline">\u00c9conomie</span>
            <span className="sm:hidden">Eco.</span>
          </div>
          <div className="col-span-2 lg:col-span-1 text-center hidden sm:block">Choisi</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {displayed.map(entry => (
            <div key={entry.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="col-span-4 lg:col-span-3 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{entry.title}</p>
                <p className="text-[11px] text-slate-400 lg:hidden">
                  {new Date(entry.closedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="col-span-2 hidden lg:block text-xs text-slate-500 dark:text-slate-400">
                {new Date(entry.createdAt).toLocaleDateString('fr-FR')} &rarr; {new Date(entry.closedAt).toLocaleDateString('fr-FR')}
              </div>
              <div className="col-span-2 text-center">
                {entry.status === 'closed' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3" /> Cl\u00f4tur\u00e9
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="w-3 h-3" /> Annul\u00e9
                  </span>
                )}
              </div>
              <div className="col-span-2 text-center hidden sm:block">
                <span className="text-xs text-slate-600 dark:text-slate-300">{entry.supplierCount} fourn. / {entry.itemCount} prod.</span>
              </div>
              <div className="col-span-2 text-center">
                {entry.bestSaving !== '-' ? (
                  <span className="inline-flex items-center gap-0.5 text-sm font-bold text-green-600 dark:text-green-400">
                    <TrendingDown className="w-3.5 h-3.5" /> {entry.bestSaving}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">-</span>
                )}
              </div>
              <div className="col-span-2 lg:col-span-1 text-center hidden sm:block">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{entry.selectedSupplier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Supplier Promos Carousel ────────────────────────────────────────────────
function SupplierPromosSection({
  onOrder,
  selectedIds,
  onToggleSelect,
  onCompare,
}: {
  onOrder: (p: SupplierPromo) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onCompare: () => void;
}) {
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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Offres fournisseurs</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Promotions et offres exclusives de nos partenaires</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Compare button */}
          {selectedIds.length >= 2 && (
            <button
              onClick={onCompare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm animate-fade-in"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Comparer ({selectedIds.length})
            </button>
          )}
          {selectedIds.length === 1 && (
            <span className="text-[11px] text-blue-500 dark:text-blue-400 font-medium">
              S\u00e9lectionnez 1 de plus pour comparer
            </span>
          )}
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
      </div>

      <div
        ref={setScrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SUPPLIER_PROMOS.map(promo => (
          <PromoCard
            key={promo.id}
            promo={promo}
            onOrder={onOrder}
            isSelected={selectedIds.includes(promo.id)}
            onToggleSelect={onToggleSelect}
          />
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

  // Price comparison state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

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

  function toggleCompareId(id: string) {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
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

  const selectedPromos = SUPPLIER_PROMOS.filter(p => compareIds.includes(p.id));

  if (loading) return <div className="flex items-center justify-center h-48 text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Appels d'offres</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Comparez les prix, profitez des promotions et optimisez vos achats
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Nouvel appel d'offres
        </button>
      </div>

      {/* ── Banner Ad ────────────────────────────────────────────────────── */}
      <BannerAd />

      {/* ── Supplier Promotions ──────────────────────────────────────────── */}
      <SupplierPromosSection
        onOrder={handlePromoOrder}
        selectedIds={compareIds}
        onToggleSelect={toggleCompareId}
        onCompare={() => setShowCompare(true)}
      />

      {/* ── RFQ History ──────────────────────────────────────────────────── */}
      <RFQHistorySection />

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

      {/* ── Price Comparison Modal ─────────────────────────────────────── */}
      <PriceComparisonModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        selectedPromos={selectedPromos}
      />

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
