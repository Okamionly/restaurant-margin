import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, ShoppingBag, Star, Truck, Clock, Filter, ChevronDown, ChevronUp,
  Plus, Minus, X, Store, Award, Leaf, MapPin, ArrowUpDown, ShoppingCart,
  Package, Phone, History, CheckCircle, Send, Inbox, Trash2, Heart,
  TrendingDown, Eye, Zap, BadgePercent, BarChart3, Grid3x3, List,
  Bell, BellRing, Calendar, ThumbsUp, MessageSquare, Shield, Target,
  ArrowRight, AlertTriangle, ChevronRight, Info, Sparkles
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { getToken, getActiveRestaurantId } from '../services/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Supplier {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  deliveryDays: number;
  premium: boolean;
  bio: boolean;
  local: boolean;
  description: string;
  phone: string;
}

interface SupplierOffer {
  supplierId: string;
  price: number;
  unit: string;
  minOrder: number;
  inStock: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  offers: SupplierOffer[];
}

interface CartItem {
  productId: string;
  supplierId: string;
  quantity: number;
  price: number;
  unit: string;
}

interface MarketplaceOrderItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface MarketplaceOrder {
  id: number;
  supplierName: string;
  status: string;
  totalHT: number;
  notes: string | null;
  items: MarketplaceOrderItem[];
  createdAt: string;
}

interface SupplierRating {
  supplierId: string;
  price: number;
  quality: number;
  delivery: number;
  communication: number;
}

interface PriceAlert {
  id: string;
  ingredientName: string;
  threshold: number;
  unit: string;
  active: boolean;
  createdAt: string;
}

interface SeasonalPrice {
  ingredient: string;
  months: number[]; // 0-11, value 1-5 (1=cheapest, 5=most expensive)
}

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'delivery';
type ViewMode = 'grid' | 'list';
type MarketplaceTab = 'products' | 'comparison' | 'ratings' | 'alerts' | 'seasonal';

// ── API helpers ──────────────────────────────────────────────────────────────

function marketplaceHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const restaurantId = getActiveRestaurantId();
  if (restaurantId) headers['X-Restaurant-Id'] = restaurantId;
  return headers;
}

// ── Data (loaded from API, empty by default) ─────────────────────────────────

const SUPPLIERS: Supplier[] = [];

const CATEGORIES = ['Viandes', 'Poissons', 'Fruits & Legumes', 'Epicerie', 'Boissons', 'Surgeles', 'Produits laitiers'];

const PRODUCTS: Product[] = [];

// ── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { color: string; icon: string }> = {
  Viandes:            { color: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40', icon: '🥩' },
  Poissons:           { color: 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/40', icon: '🐟' },
  'Fruits & Legumes': { color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/40', icon: '🥬' },
  Epicerie:           { color: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40', icon: '🫒' },
  Boissons:           { color: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/40', icon: '🍷' },
  Surgeles:           { color: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40', icon: '🧊' },
  'Produits laitiers':{ color: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/40', icon: '🧀' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSupplier(id: string): Supplier {
  return SUPPLIERS.find(s => s.id === id) || { id: '', name: 'Inconnu', bio: false, local: false } as Supplier;
}

function getBestPrice(offers: SupplierOffer[]): number {
  const inStock = offers.filter(o => o.inStock);
  if (inStock.length === 0) return Infinity;
  return Math.min(...inStock.map(o => o.price));
}

function getWorstPrice(offers: SupplierOffer[]): number {
  const inStock = offers.filter(o => o.inStock);
  if (inStock.length === 0) return 0;
  return Math.max(...inStock.map(o => o.price));
}

// ── Seasonal Price Data ──────────────────────────────────────────────────────

const SEASONAL_DATA: SeasonalPrice[] = [
  { ingredient: 'Saumon', months: [3, 3, 2, 2, 1, 1, 2, 2, 3, 4, 5, 5] },
  { ingredient: 'Boeuf', months: [3, 3, 3, 4, 4, 5, 5, 4, 3, 3, 3, 3] },
  { ingredient: 'Tomates', months: [5, 5, 4, 3, 2, 1, 1, 1, 2, 3, 4, 5] },
  { ingredient: 'Fraises', months: [5, 5, 4, 2, 1, 1, 2, 3, 4, 5, 5, 5] },
  { ingredient: 'Courgettes', months: [5, 5, 4, 3, 2, 1, 1, 1, 2, 3, 4, 5] },
  { ingredient: 'Agneau', months: [2, 2, 1, 1, 2, 3, 3, 4, 4, 4, 3, 3] },
  { ingredient: 'Moules', months: [1, 1, 2, 3, 5, 5, 5, 4, 1, 1, 1, 1] },
  { ingredient: 'Asperges', months: [5, 5, 3, 1, 1, 2, 4, 5, 5, 5, 5, 5] },
  { ingredient: 'Canard', months: [3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 2] },
  { ingredient: 'Cabillaud', months: [1, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 1] },
];

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

function getSeasonalColor(value: number): string {
  switch (value) {
    case 1: return 'bg-emerald-500 text-white';
    case 2: return 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300';
    case 3: return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    case 4: return 'bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300';
    case 5: return 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300';
    default: return 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF]';
  }
}

function getSeasonalLabel(value: number): string {
  switch (value) {
    case 1: return 'Optimal';
    case 2: return 'Bon';
    case 3: return 'Moyen';
    case 4: return 'Cher';
    case 5: return 'Tres cher';
    default: return '';
  }
}

function computeOverallRating(r: SupplierRating): number {
  return Number(((r.price + r.quality + r.delivery + r.communication) / 4).toFixed(1));
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < full
              ? 'text-amber-400 fill-amber-400'
              : i === full && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-[#D1D5DB] dark:text-[#404040]'
          }`}
        />
      ))}
      <span className="ml-1 text-[11px] font-semibold text-[#6B7280] dark:text-[#A3A3A3]">{rating.toFixed(1)}</span>
    </span>
  );
}

function renderRatingBar(rating: number) {
  const pct = (rating / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-[#E5E7EB] dark:bg-[#262626] overflow-hidden">
        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-bold text-[#6B7280] dark:text-[#A3A3A3]">{rating.toFixed(1)}</span>
    </div>
  );
}

// ── Supplier Card (Premium) ──────────────────────────────────────────────────

function SupplierCard({ supplier, onContact }: { supplier: Supplier; onContact: (s: Supplier) => void }) {
  return (
    <div className="group relative bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 hover:border-[#111111] dark:hover:border-white/20 transition-all hover:shadow-lg">
      {/* Premium badge */}
      <div className="absolute -top-2.5 right-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
          <Award className="w-3 h-3" />
          Premium
        </span>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-center text-lg font-bold text-[#111111] dark:text-white">
          {supplier.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#111111] dark:text-white text-sm">{supplier.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {renderStars(supplier.rating)}
            <span className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">
              ({supplier.reviewCount})
            </span>
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1.5 line-clamp-2">
            {supplier.description}
          </p>

          {/* Tags + CTA */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
              <Truck className="w-3 h-3" /> J+{supplier.deliveryDays}
            </span>
            {supplier.bio && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                <Leaf className="w-3 h-3" /> Bio
              </span>
            )}
            {supplier.local && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
                <MapPin className="w-3 h-3" /> Local
              </span>
            )}
            <button
              onClick={() => onContact(supplier)}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
            >
              <Phone className="w-3 h-3" />
              Contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onAddToCart, viewMode }: {
  product: Product;
  onAddToCart: (productId: string, supplierId: string, price: number, unit: string) => void;
  viewMode: ViewMode;
}) {
  const [expanded, setExpanded] = useState(false);
  const bestPrice = getBestPrice(product.offers);
  const worstPrice = getWorstPrice(product.offers);
  const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);
  const savings = worstPrice > 0 && bestPrice < Infinity ? ((worstPrice - bestPrice) / worstPrice * 100).toFixed(0) : null;
  const catConfig = CATEGORY_CONFIG[product.category] || { color: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]', icon: '📦' };
  const inStockCount = product.offers.filter(o => o.inStock).length;

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl hover:border-[#111111]/20 dark:hover:border-white/10 transition-all hover:shadow-md">
        <div className="flex items-center gap-4 p-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A] flex items-center justify-center text-xl">
            {catConfig.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#111111] dark:text-white text-sm truncate">{product.name}</h3>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${catConfig.color}`}>
                {product.category}
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5 truncate">{product.description}</p>
          </div>

          {/* Price range */}
          <div className="text-right flex-shrink-0">
            {bestPrice < Infinity ? (
              <>
                <div className="text-sm font-bold text-[#111111] dark:text-white">
                  {bestPrice.toFixed(2)} EUR
                </div>
                {sortedOffers.length > 1 && (
                  <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                    a {worstPrice.toFixed(2)} EUR
                  </div>
                )}
              </>
            ) : (
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Indispo.</span>
            )}
          </div>

          {/* Offers count */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">{inStockCount} offre{inStockCount > 1 ? 's' : ''}</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" /> : <ChevronDown className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />}
            </button>
          </div>
        </div>

        {/* Expanded offers */}
        {expanded && (
          <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] px-4 pb-4 pt-3 space-y-2">
            {sortedOffers.map(offer => {
              const supplier = getSupplier(offer.supplierId);
              const isBest = offer.price === bestPrice && offer.inStock;
              return (
                <OfferRow key={offer.supplierId} offer={offer} supplier={supplier} isBest={isBest} productId={product.id} onAdd={onAddToCart} />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden hover:border-[#111111]/20 dark:hover:border-white/10 transition-all hover:shadow-lg group">
      {/* Card header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#111111] dark:text-white text-sm">
                {product.name}
              </h3>
              {savings && Number(savings) >= 10 && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  <TrendingDown className="w-2.5 h-2.5" />
                  -{savings}%
                </span>
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5 line-clamp-1">
              {product.description}
            </p>
          </div>
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A] flex items-center justify-center text-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
            {catConfig.icon}
          </div>
        </div>

        {/* Category + price range */}
        <div className="flex items-center justify-between mt-3">
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${catConfig.color}`}>
            {product.category}
          </span>
          {bestPrice < Infinity && (
            <div className="text-right">
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">a partir de </span>
              <span className="text-sm font-bold text-[#111111] dark:text-white">{bestPrice.toFixed(2)} EUR</span>
            </div>
          )}
        </div>
      </div>

      {/* Price comparison bar */}
      {sortedOffers.length > 1 && bestPrice < Infinity && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3 h-3 text-[#9CA3AF] dark:text-[#737373]" />
            <div className="flex-1 h-1.5 rounded-full bg-[#E5E7EB] dark:bg-[#262626] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
                style={{ width: '100%' }}
              />
            </div>
            <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] tabular-nums">
              {bestPrice.toFixed(2)} - {worstPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Supplier offers */}
      <div className="px-4 pb-4 space-y-1.5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-1.5"
        >
          <span className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">
            {sortedOffers.length} offre{sortedOffers.length > 1 ? 's' : ''} fournisseur{sortedOffers.length > 1 ? 's' : ''}
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />}
        </button>

        {/* Always show best offer */}
        {sortedOffers.length > 0 && (() => {
          const offer = sortedOffers[0];
          const supplier = getSupplier(offer.supplierId);
          const isBest = offer.price === bestPrice && offer.inStock;
          return (
            <OfferRow key={offer.supplierId} offer={offer} supplier={supplier} isBest={isBest} productId={product.id} onAdd={onAddToCart} />
          );
        })()}

        {/* Other offers on expand */}
        {expanded && sortedOffers.slice(1).map(offer => {
          const supplier = getSupplier(offer.supplierId);
          const isBest = offer.price === bestPrice && offer.inStock;
          return (
            <OfferRow key={offer.supplierId} offer={offer} supplier={supplier} isBest={isBest} productId={product.id} onAdd={onAddToCart} />
          );
        })}
      </div>
    </div>
  );
}

// ── Offer Row ────────────────────────────────────────────────────────────────

function OfferRow({ offer, supplier, isBest, productId, onAdd }: {
  offer: SupplierOffer;
  supplier: Supplier;
  isBest: boolean;
  productId: string;
  onAdd: (productId: string, supplierId: string, price: number, unit: string) => void;
}) {
  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
      isBest
        ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/30'
        : 'bg-[#F9FAFB] dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333]'
    }`}>
      {/* Supplier avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] flex items-center justify-center text-xs font-bold text-[#6B7280] dark:text-[#A3A3A3]">
        {supplier.logo}
      </div>

      {/* Supplier info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-[#111111] dark:text-white truncate">
            {supplier.name}
          </span>
          {isBest && (
            <span className="flex-shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              Meilleur prix
            </span>
          )}
          {supplier.premium && (
            <Award className="w-3 h-3 text-amber-500 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {renderRatingBar(supplier.rating)}
          <span className="flex items-center gap-0.5 text-[10px] text-[#9CA3AF] dark:text-[#737373]">
            <Truck className="w-3 h-3" /> J+{supplier.deliveryDays}
          </span>
          {!offer.inStock && (
            <span className="text-[10px] text-red-500 font-medium">Rupture</span>
          )}
        </div>
      </div>

      {/* Price + action */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-right">
          <div className={`text-sm font-bold tabular-nums ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#111111] dark:text-white'}`}>
            {offer.price.toFixed(2)} EUR
          </div>
          <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">/ {offer.unit}</div>
        </div>
        <button
          onClick={() => onAdd(productId, offer.supplierId, offer.price, offer.unit)}
          disabled={!offer.inStock}
          className={`p-2 rounded-xl transition-all ${
            offer.inStock
              ? 'bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] hover:scale-105 active:scale-95'
              : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Cart Sidebar ─────────────────────────────────────────────────────────────

function CartSidebar({ cart, cartBySupplier, cartTotal, submitting, onUpdateQty, onRemove, onClear, onSubmit, onClose }: {
  cart: CartItem[];
  cartBySupplier: Record<string, { items: CartItem[]; total: number }>;
  cartTotal: number;
  submitting: boolean;
  onUpdateQty: (productId: string, supplierId: string, delta: number) => void;
  onRemove: (productId: string, supplierId: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  const itemCount = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
        <h3 className="font-bold text-[#111111] dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#111111] dark:text-white" />
          Panier
          <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">({itemCount} article{itemCount > 1 ? 's' : ''})</span>
        </h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
          <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="p-8 text-center">
          <ShoppingCart className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">Votre panier est vide</p>
          <p className="text-xs text-[#D1D5DB] dark:text-[#525252] mt-1">Ajoutez des produits pour commencer</p>
        </div>
      ) : (
        <>
          <div className="max-h-[50vh] overflow-y-auto divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
            {Object.entries(cartBySupplier).map(([supplierId, { items, total }]) => {
              const supplier = getSupplier(supplierId);
              return (
                <div key={supplierId} className="p-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center text-[10px] font-bold text-[#6B7280] dark:text-[#A3A3A3]">
                      {supplier.logo}
                    </div>
                    <span className="text-xs font-bold text-[#111111] dark:text-white">{supplier.name}</span>
                    <span className="ml-auto text-xs font-bold text-[#111111] dark:text-white tabular-nums">{total.toFixed(2)} EUR</span>
                  </div>
                  <div className="space-y-1.5">
                    {items.map(item => {
                      const product = PRODUCTS.find(p => p.id === item.productId);
                      return (
                        <div key={`${item.productId}-${item.supplierId}`} className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A] transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-[#111111] dark:text-white truncate">{product?.name || item.productId}</div>
                            <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] tabular-nums">{item.price.toFixed(2)} EUR / {item.unit}</div>
                          </div>
                          <div className="flex items-center gap-0.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQty(item.productId, item.supplierId, -1)}
                              className="p-1 rounded-md hover:bg-white dark:hover:bg-[#262626] transition-colors"
                            >
                              <Minus className="w-3 h-3 text-[#6B7280] dark:text-[#A3A3A3]" />
                            </button>
                            <span className="text-xs font-semibold w-6 text-center text-[#111111] dark:text-white tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQty(item.productId, item.supplierId, 1)}
                              className="p-1 rounded-md hover:bg-white dark:hover:bg-[#262626] transition-colors"
                            >
                              <Plus className="w-3 h-3 text-[#6B7280] dark:text-[#A3A3A3]" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-[#111111] dark:text-white tabular-nums w-14 text-right">
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => onRemove(item.productId, item.supplierId)}
                            className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#D1D5DB] dark:text-[#525252] hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#111111] dark:text-white">Total HT</span>
              <span className="text-xl font-black text-[#111111] dark:text-white tabular-nums">{cartTotal.toFixed(2)} EUR</span>
            </div>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="w-full py-3 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 text-white dark:text-black rounded-xl text-sm font-bold transition-all hover:shadow-md active:scale-[0.98]"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Passer la commande
                </span>
              )}
            </button>
            <button
              onClick={onClear}
              className="w-full py-2 text-xs text-[#9CA3AF] dark:text-[#737373] hover:text-red-500 transition-colors font-medium"
            >
              Vider le panier
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Price Comparison Engine ──────────────────────────────────────────────────

function PriceComparisonEngine({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const product = products.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
          <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="font-bold text-[#111111] dark:text-white text-lg">Comparateur de prix</h2>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Comparez les prix de tous vos fournisseurs cote a cote</p>
        </div>
      </div>

      {/* Product selector */}
      <div className="bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
        <label className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2 block">Choisir un ingredient</label>
        <select
          value={selectedProduct || ''}
          onChange={e => setSelectedProduct(e.target.value || null)}
          className="w-full py-2.5 px-3 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-sm text-[#111111] dark:text-white outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
        >
          <option value="">-- Selectionnez un produit --</option>
          {products.filter(p => p.offers.length > 1).map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.offers.length} offres)</option>
          ))}
        </select>
      </div>

      {/* Comparison table */}
      {product && (
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{CATEGORY_CONFIG[product.category]?.icon || '📦'}</span>
              <div>
                <h3 className="font-bold text-[#111111] dark:text-white">{product.name}</h3>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{product.offers.length} fournisseurs comparés</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
            {[...product.offers].sort((a, b) => a.price - b.price).map((offer, idx) => {
              const supplier = getSupplier(offer.supplierId);
              const bestPrice = getBestPrice(product.offers);
              const isBest = offer.price === bestPrice && offer.inStock;
              const savingsVsWorst = getWorstPrice(product.offers) > 0
                ? ((getWorstPrice(product.offers) - offer.price) / getWorstPrice(product.offers) * 100).toFixed(1)
                : '0';

              return (
                <div key={offer.supplierId} className={`px-5 py-4 flex items-center gap-4 transition-colors ${isBest ? 'bg-emerald-50/50 dark:bg-emerald-950/10' : 'hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A]'}`}>
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    idx === 0 ? 'bg-emerald-500 text-white' : idx === 1 ? 'bg-[#E5E7EB] dark:bg-[#262626] text-[#111111] dark:text-white' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]'
                  }`}>
                    #{idx + 1}
                  </div>

                  {/* Supplier info */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-center text-sm font-bold text-[#6B7280] dark:text-[#A3A3A3]">
                    {supplier.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#111111] dark:text-white">{supplier.name}</span>
                      {isBest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                          <CheckCircle className="w-3 h-3" />
                          Meilleur prix
                        </span>
                      )}
                      {!offer.inStock && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-50 dark:bg-red-950/30 text-red-500">Rupture</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {renderStars(supplier.rating)}
                      <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1">
                        <Truck className="w-3 h-3" /> J+{supplier.deliveryDays}
                      </span>
                    </div>
                  </div>

                  {/* Price + savings */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-black tabular-nums ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#111111] dark:text-white'}`}>
                      {offer.price.toFixed(2)} EUR
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">/ {offer.unit}</div>
                  </div>

                  {/* Savings badge */}
                  <div className="flex-shrink-0 w-20 text-right">
                    {idx > 0 && Number(savingsVsWorst) > 0 ? (
                      <span className="text-[11px] font-medium text-[#9CA3AF] dark:text-[#737373]">
                        -{savingsVsWorst}% vs max
                      </span>
                    ) : idx === 0 && Number(savingsVsWorst) > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                        <TrendingDown className="w-3 h-3" />
                        -{savingsVsWorst}%
                      </span>
                    ) : null}
                  </div>

                  {/* Price bar visualization */}
                  <div className="hidden sm:block flex-shrink-0 w-32">
                    <div className="h-2 rounded-full bg-[#E5E7EB] dark:bg-[#262626] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isBest ? 'bg-emerald-500' : 'bg-amber-400'}`}
                        style={{ width: `${(getBestPrice(product.offers) / offer.price) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="px-5 py-4 bg-[#F9FAFB] dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">
                Economie potentielle en choisissant le meilleur prix :
              </span>
            </div>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {(getWorstPrice(product.offers) - getBestPrice(product.offers)).toFixed(2)} EUR/{product.offers[0]?.unit || 'kg'}
            </span>
          </div>
        </div>
      )}

      {!selectedProduct && (
        <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <BarChart3 className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">Selectionnez un produit pour comparer les prix</p>
        </div>
      )}
    </div>
  );
}

// ── Supplier Rating System ──────────────────────────────────────────────────

function SupplierRatingSystem({ suppliers }: { suppliers: Supplier[] }) {
  const [ratings, setRatings] = useState<SupplierRating[]>(() =>
    suppliers.map(s => ({
      supplierId: s.id,
      price: Math.round(Math.random() * 2 + 3),
      quality: Math.round(Math.random() * 2 + 3),
      delivery: Math.round(Math.random() * 2 + 3),
      communication: Math.round(Math.random() * 2 + 3),
    }))
  );
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState<SupplierRating | null>(null);

  function startEdit(supplierId: string) {
    const existing = ratings.find(r => r.supplierId === supplierId);
    if (existing) {
      setTempRating({ ...existing });
      setEditingSupplier(supplierId);
    }
  }

  function saveRating() {
    if (!tempRating) return;
    setRatings(prev => prev.map(r => r.supplierId === tempRating.supplierId ? tempRating : r));
    setEditingSupplier(null);
    setTempRating(null);
  }

  const sortedByOverall = [...ratings]
    .map(r => ({ ...r, overall: computeOverallRating(r), supplier: getSupplier(r.supplierId) }))
    .sort((a, b) => b.overall - a.overall);

  const CRITERIA = [
    { key: 'price' as const, label: 'Prix', icon: BadgePercent },
    { key: 'quality' as const, label: 'Qualite', icon: Shield },
    { key: 'delivery' as const, label: 'Livraison', icon: Truck },
    { key: 'communication' as const, label: 'Communication', icon: MessageSquare },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
          <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="font-bold text-[#111111] dark:text-white text-lg">Evaluation des fournisseurs</h2>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Notez vos fournisseurs sur 4 criteres — les meilleurs obtiennent le badge Recommande</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedByOverall.map((item, idx) => {
          const isEditing = editingSupplier === item.supplierId;
          const isRecommended = item.overall >= 4.0;

          return (
            <div key={item.supplierId} className={`bg-white dark:bg-black border rounded-2xl overflow-hidden transition-all ${
              isRecommended ? 'border-amber-300 dark:border-amber-800/40' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
            }`}>
              {/* Header */}
              <div className="px-5 py-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-[#D1D5DB] dark:bg-[#404040] text-white' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF]'
                }`}>
                  #{idx + 1}
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-center text-lg font-bold text-[#6B7280] dark:text-[#A3A3A3]">
                  {item.supplier.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-[#111111] dark:text-white">{item.supplier.name}</h3>
                    {isRecommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                        <ThumbsUp className="w-3 h-3" />
                        Recommande
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black text-[#111111] dark:text-white">{item.overall}</span>
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">/ 5</span>
                    <div className="flex gap-0.5 ml-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(item.overall) ? 'text-amber-400 fill-amber-400' : 'text-[#D1D5DB] dark:text-[#404040]'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => isEditing ? saveRating() : startEdit(item.supplierId)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    isEditing
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
                  }`}
                >
                  {isEditing ? 'Sauvegarder' : 'Modifier'}
                </button>
              </div>

              {/* Criteria bars */}
              <div className="px-5 pb-4 space-y-3">
                {CRITERIA.map(criteria => {
                  const value = isEditing && tempRating ? tempRating[criteria.key] : item[criteria.key];
                  return (
                    <div key={criteria.key} className="flex items-center gap-3">
                      <criteria.icon className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373] flex-shrink-0" />
                      <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#A3A3A3] w-28 flex-shrink-0">{criteria.label}</span>
                      {isEditing && tempRating ? (
                        <div className="flex items-center gap-1 flex-1">
                          {[1, 2, 3, 4, 5].map(n => (
                            <button
                              key={n}
                              onClick={() => setTempRating({ ...tempRating, [criteria.key]: n })}
                              className="p-0.5"
                            >
                              <Star className={`w-5 h-5 transition-colors ${n <= value ? 'text-amber-400 fill-amber-400' : 'text-[#D1D5DB] dark:text-[#404040]'}`} />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 h-2 rounded-full bg-[#E5E7EB] dark:bg-[#262626] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${value >= 4 ? 'bg-emerald-500' : value >= 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                              style={{ width: `${(value / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#111111] dark:text-white w-6 text-right tabular-nums">{value}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <Star className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">Aucun fournisseur a evaluer</p>
        </div>
      )}
    </div>
  );
}

// ── Order History per Supplier (Timeline) ───────────────────────────────────

function OrderTimeline({ orders }: { orders: MarketplaceOrder[] }) {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const supplierNames = [...new Set(orders.map(o => o.supplierName))];
  const filteredOrders = selectedSupplier
    ? orders.filter(o => o.supplierName === selectedSupplier)
    : orders;

  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Stats per supplier
  const supplierStats = useMemo(() => {
    const stats: Record<string, { totalSpent: number; orderCount: number; lastOrder: string }> = {};
    orders.forEach(order => {
      if (!stats[order.supplierName]) {
        stats[order.supplierName] = { totalSpent: 0, orderCount: 0, lastOrder: order.createdAt };
      }
      stats[order.supplierName].totalSpent += order.totalHT;
      stats[order.supplierName].orderCount += 1;
      if (new Date(order.createdAt) > new Date(stats[order.supplierName].lastOrder)) {
        stats[order.supplierName].lastOrder = order.createdAt;
      }
    });
    return stats;
  }, [orders]);

  const statusColors: Record<string, string> = {
    draft: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#262626]',
    sent: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
    confirmed: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30',
    received: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
  };

  const statusLabels: Record<string, string> = {
    draft: 'Brouillon', sent: 'Envoye', confirmed: 'Confirme', received: 'Recu',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="font-bold text-[#111111] dark:text-white text-lg">Historique par fournisseur</h2>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Timeline de vos commandes avec montants, dates et articles</p>
        </div>
      </div>

      {/* Supplier filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSelectedSupplier(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            !selectedSupplier ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3]'
          }`}
        >
          Tous ({orders.length})
        </button>
        {supplierNames.map(name => (
          <button
            key={name}
            onClick={() => setSelectedSupplier(selectedSupplier === name ? null : name)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSupplier === name ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3]'
            }`}
          >
            {name} ({orders.filter(o => o.supplierName === name).length})
          </button>
        ))}
      </div>

      {/* Supplier stats cards */}
      {selectedSupplier && supplierStats[selectedSupplier] && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <span className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Total depense</span>
            <p className="text-xl font-black text-[#111111] dark:text-white mt-1 tabular-nums">{supplierStats[selectedSupplier].totalSpent.toFixed(2)} EUR</p>
          </div>
          <div className="bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <span className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Commandes</span>
            <p className="text-xl font-black text-[#111111] dark:text-white mt-1">{supplierStats[selectedSupplier].orderCount}</p>
          </div>
          <div className="bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <span className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Derniere commande</span>
            <p className="text-sm font-bold text-[#111111] dark:text-white mt-1">{new Date(supplierStats[selectedSupplier].lastOrder).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      {sortedOrders.length > 0 ? (
        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" />

          <div className="space-y-4">
            {sortedOrders.map((order, idx) => (
              <div key={order.id} className="relative">
                {/* Timeline dot */}
                <div className={`absolute -left-6 top-4 w-[9px] h-[9px] rounded-full border-2 ${
                  order.status === 'received' ? 'bg-emerald-500 border-emerald-500' :
                  order.status === 'confirmed' ? 'bg-amber-400 border-amber-400' :
                  order.status === 'sent' ? 'bg-blue-400 border-blue-400' :
                  'bg-white dark:bg-black border-[#D1D5DB] dark:border-[#404040]'
                }`} />

                <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 hover:border-[#D1D5DB] dark:hover:border-[#333] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-[#111111] dark:text-white">{order.supplierName}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${statusColors[order.status] || statusColors.draft}`}>
                        {statusLabels[order.status] || 'Brouillon'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#111111] dark:text-white tabular-nums">{order.totalHT.toFixed(2)} EUR</span>
                      <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {order.items.map(item => (
                      <span key={item.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#262626]">
                        {item.quantity}x {item.productName}
                        <span className="text-[#9CA3AF] dark:text-[#525252]">({(item.unitPrice * item.quantity).toFixed(2)} EUR)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <Inbox className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">Aucune commande dans l'historique</p>
        </div>
      )}
    </div>
  );
}

// ── Price Alert Setup ───────────────────────────────────────────────────────

function PriceAlertSetup() {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    { id: '1', ingredientName: 'Saumon frais', threshold: 15, unit: 'kg', active: true, createdAt: '2026-04-08' },
    { id: '2', ingredientName: 'Huile d\'olive', threshold: 8, unit: 'L', active: true, createdAt: '2026-04-05' },
    { id: '3', ingredientName: 'Filet de boeuf', threshold: 35, unit: 'kg', active: false, createdAt: '2026-03-28' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ ingredientName: '', threshold: '', unit: 'kg' });

  function addAlert() {
    if (!newAlert.ingredientName || !newAlert.threshold) return;
    const alert: PriceAlert = {
      id: Date.now().toString(),
      ingredientName: newAlert.ingredientName,
      threshold: Number(newAlert.threshold),
      unit: newAlert.unit,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAlerts(prev => [alert, ...prev]);
    setNewAlert({ ingredientName: '', threshold: '', unit: 'kg' });
    setShowForm(false);
    showToast('Alerte prix creee', 'success');
  }

  function toggleAlert(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }

  function removeAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alerte supprimee', 'info');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/40">
            <BellRing className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="font-bold text-[#111111] dark:text-white text-lg">Alertes de prix</h2>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Soyez notifie quand un ingredient passe sous votre seuil</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] rounded-xl text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          Nouvelle alerte
        </button>
      </div>

      {/* New alert form */}
      {showForm && (
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-[#111111] dark:text-white">Creer une alerte</span>
          </div>
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373] italic mb-3 px-3 py-2 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
            Exemple : "Alertez-moi quand le saumon passe sous 15 EUR/kg"
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1 block">Ingredient</label>
              <input
                type="text"
                value={newAlert.ingredientName}
                onChange={e => setNewAlert({ ...newAlert, ingredientName: e.target.value })}
                placeholder="Ex: Saumon frais"
                className="w-full px-3 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#525252] outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1 block">Seuil (EUR)</label>
              <input
                type="number"
                value={newAlert.threshold}
                onChange={e => setNewAlert({ ...newAlert, threshold: e.target.value })}
                placeholder="15"
                min="0"
                step="0.5"
                className="w-full px-3 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#525252] outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-1 block">Unite</label>
              <select
                value={newAlert.unit}
                onChange={e => setNewAlert({ ...newAlert, unit: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="unite">unite</option>
                <option value="boite">boite</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={addAlert}
              disabled={!newAlert.ingredientName || !newAlert.threshold}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all"
            >
              <span className="flex items-center gap-1.5">
                <BellRing className="w-4 h-4" />
                Activer l'alerte
              </span>
            </button>
            <button
              onClick={() => { setShowForm(false); setNewAlert({ ingredientName: '', threshold: '', unit: 'kg' }); }}
              className="px-4 py-2.5 text-sm text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Alerts list */}
      <div className="space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className={`bg-white dark:bg-black border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${
            alert.active
              ? 'border-violet-200 dark:border-violet-900/30 bg-violet-50/30 dark:bg-violet-950/10'
              : 'border-[#E5E7EB] dark:border-[#1A1A1A] opacity-60'
          }`}>
            <div className={`p-2 rounded-xl ${alert.active ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-[#F3F4F6] dark:bg-[#171717]'}`}>
              <Bell className={`w-5 h-5 ${alert.active ? 'text-violet-600 dark:text-violet-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#111111] dark:text-white">{alert.ingredientName}</span>
                {alert.active && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">Active</span>
                )}
              </div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                Alerter quand le prix passe sous <span className="font-bold text-[#111111] dark:text-white">{alert.threshold} EUR/{alert.unit}</span>
              </p>
              <span className="text-[10px] text-[#D1D5DB] dark:text-[#525252]">Creee le {alert.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleAlert(alert.id)}
                className={`relative inline-flex h-6 w-10 rounded-full transition-colors ${
                  alert.active ? 'bg-violet-500' : 'bg-[#D1D5DB] dark:bg-[#404040]'
                }`}
              >
                <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-1 ${
                  alert.active ? 'translate-x-5 ml-0' : 'translate-x-1'
                }`} />
              </button>
              <button
                onClick={() => removeAlert(alert.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[#D1D5DB] dark:text-[#525252] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && !showForm && (
        <div className="text-center py-12 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <BellRing className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">Aucune alerte de prix configuree</p>
          <p className="text-xs text-[#D1D5DB] dark:text-[#525252] mt-1">Cliquez sur "Nouvelle alerte" pour commencer</p>
        </div>
      )}
    </div>
  );
}

// ── Seasonal Price Calendar ─────────────────────────────────────────────────

function SeasonalPriceCalendar() {
  const currentMonth = new Date().getMonth();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40">
          <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="font-bold text-[#111111] dark:text-white text-lg">Calendrier saisonnier des prix</h2>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Identifiez les mois les moins chers pour chaque ingredient</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
        <span className="text-[10px] font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Legende :</span>
        <div className="flex items-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map(v => (
            <div key={v} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded ${getSeasonalColor(v)}`} />
              <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">{getSeasonalLabel(v)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid gap-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" style={{ gridTemplateColumns: '160px repeat(12, 1fr)' }}>
          <div className="bg-[#F9FAFB] dark:bg-[#0A0A0A] px-4 py-3">
            <span className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Ingredient</span>
          </div>
          {MONTH_LABELS.map((month, idx) => (
            <div key={month} className={`bg-[#F9FAFB] dark:bg-[#0A0A0A] px-1 py-3 text-center ${idx === currentMonth ? 'bg-[#111111] dark:bg-white' : ''}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${idx === currentMonth ? 'text-white dark:text-black' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                {month}
              </span>
            </div>
          ))}
        </div>

        {/* Data rows */}
        <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
          {SEASONAL_DATA.map(item => {
            const cheapestMonth = item.months.indexOf(Math.min(...item.months));
            return (
              <div key={item.ingredient} className="grid gap-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" style={{ gridTemplateColumns: '160px repeat(12, 1fr)' }}>
                <div className="bg-white dark:bg-black px-4 py-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#111111] dark:text-white truncate">{item.ingredient}</span>
                  {cheapestMonth === currentMonth && (
                    <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">
                      Optimal !
                    </span>
                  )}
                </div>
                {item.months.map((value, monthIdx) => (
                  <div
                    key={monthIdx}
                    className={`bg-white dark:bg-black flex items-center justify-center py-3 ${monthIdx === currentMonth ? 'ring-2 ring-inset ring-[#111111] dark:ring-white' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${getSeasonalColor(value)} transition-transform hover:scale-110`} title={`${item.ingredient} - ${MONTH_LABELS[monthIdx]}: ${getSeasonalLabel(value)}`}>
                      {value === 1 ? '$$' : value}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current month tip */}
      <div className="flex items-start gap-3 px-5 py-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl">
        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            Ce mois-ci ({MONTH_LABELS[currentMonth]})
          </span>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-0.5">
            Les meilleurs prix ce mois :{' '}
            {SEASONAL_DATA.filter(d => d.months[currentMonth] <= 2).map(d => d.ingredient).join(', ') || 'Aucun ingredient en saison optimale'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Marketplace() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');
  const [showBioOnly, setShowBioOnly] = useState(false);
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('products');

  // ── Fetch orders ──────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/marketplace/orders', { headers: marketplaceHeaders() });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // silent
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Cart logic ────────────────────────────────────────────────────────────

  function addToCart(productId: string, supplierId: string, price: number, unit: string) {
    setCart(prev => {
      const existing = prev.find(c => c.productId === productId && c.supplierId === supplierId);
      if (existing) {
        return prev.map(c =>
          c.productId === productId && c.supplierId === supplierId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { productId, supplierId, quantity: 1, price, unit }];
    });
    setCartOpen(true);
    showToast(t('marketplace.addedToCart'), 'success');
  }

  function updateCartQuantity(productId: string, supplierId: string, delta: number) {
    setCart(prev => {
      return prev
        .map(c => {
          if (c.productId === productId && c.supplierId === supplierId) {
            const newQty = c.quantity + delta;
            return newQty <= 0 ? null : { ...c, quantity: newQty };
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  }

  function removeFromCart(productId: string, supplierId: string) {
    setCart(prev => prev.filter(c => !(c.productId === productId && c.supplierId === supplierId)));
  }

  function clearCart() {
    setCart([]);
  }

  async function submitOrder() {
    if (cart.length === 0) return;
    setSubmitting(true);

    const bySupplier: Record<string, CartItem[]> = {};
    cart.forEach(item => {
      if (!bySupplier[item.supplierId]) bySupplier[item.supplierId] = [];
      bySupplier[item.supplierId].push(item);
    });

    let successCount = 0;
    for (const [supplierId, items] of Object.entries(bySupplier)) {
      const supplier = getSupplier(supplierId);
      const orderItems = items.map(item => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        return {
          productName: product?.name || item.productId,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.price,
        };
      });

      try {
        const res = await fetch('/api/marketplace/orders', {
          method: 'POST',
          headers: marketplaceHeaders(),
          body: JSON.stringify({ supplierName: supplier.name, items: orderItems }),
        });
        if (res.ok) successCount++;
      } catch {
        // continue with other suppliers
      }
    }

    setSubmitting(false);

    if (successCount > 0) {
      showToast(t('marketplace.ordersCreated'), 'success');
      setCart([]);
      setCartOpen(false);
      fetchOrders();
    } else {
      showToast(t('marketplace.ordersError'), 'error');
    }
  }

  async function updateOrderStatus(orderId: number, status: string) {
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'PUT',
        headers: marketplaceHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(t('marketplace.statusUpdated'), 'success');
        fetchOrders();
      }
    } catch {
      showToast(t('marketplace.statusError'), 'error');
    }
  }

  async function deleteOrder(orderId: number) {
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'DELETE',
        headers: marketplaceHeaders(),
      });
      if (res.ok) {
        showToast(t('marketplace.orderDeleted'), 'success');
        fetchOrders();
      }
    } catch {
      showToast(t('marketplace.deleteError'), 'error');
    }
  }

  // ── Cart totals by supplier ───────────────────────────────────────────────

  const cartBySupplier = useMemo(() => {
    const map: Record<string, { items: CartItem[]; total: number }> = {};
    cart.forEach(item => {
      if (!map[item.supplierId]) map[item.supplierId] = { items: [], total: 0 };
      map[item.supplierId].items.push(item);
      map[item.supplierId].total += item.price * item.quantity;
    });
    return map;
  }, [cart]);

  const cartTotal = useMemo(() => cart.reduce((sum, c) => sum + c.price * c.quantity, 0), [cart]);

  // ── Filtered & sorted products ────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.offers.some(o => getSupplier(o.supplierId).name.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      list = list.filter(p => p.category === selectedCategory);
    }

    if (showBioOnly) {
      list = list.filter(p => p.offers.some(o => getSupplier(o.supplierId).bio));
    }
    if (showLocalOnly) {
      list = list.filter(p => p.offers.some(o => getSupplier(o.supplierId).local));
    }

    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => getBestPrice(a.offers) - getBestPrice(b.offers));
        break;
      case 'price_desc':
        list.sort((a, b) => getBestPrice(b.offers) - getBestPrice(a.offers));
        break;
      case 'rating':
        list.sort((a, b) => {
          const bestA = Math.max(...a.offers.map(o => getSupplier(o.supplierId).rating));
          const bestB = Math.max(...b.offers.map(o => getSupplier(o.supplierId).rating));
          return bestB - bestA;
        });
        break;
      case 'delivery':
        list.sort((a, b) => {
          const bestA = Math.min(...a.offers.map(o => getSupplier(o.supplierId).deliveryDays));
          const bestB = Math.min(...b.offers.map(o => getSupplier(o.supplierId).deliveryDays));
          return bestA - bestB;
        });
        break;
    }

    return list;
  }, [searchQuery, selectedCategory, sortBy, showBioOnly, showLocalOnly]);

  const premiumSuppliers = SUPPLIERS.filter(s => s.premium);

  // ── Stats ────────────────────────────────────────────────────────────────

  const totalSuppliers = SUPPLIERS.length;
  const totalProductsCount = PRODUCTS.length;
  const avgRating = SUPPLIERS.length > 0 ? (SUPPLIERS.reduce((s, sup) => s + sup.rating, 0) / SUPPLIERS.length).toFixed(1) : '0';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#111111] dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <Store className="w-6 h-6 text-[#111111] dark:text-white" />
              </div>
              {t('marketplace.title')}
            </h1>
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
              {t('marketplace.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowOrders(!showOrders); if (!showOrders) fetchOrders(); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333] text-[#111111] dark:text-white rounded-xl font-medium text-sm transition-all"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">{t('marketplace.orders')}</span>
              {orders.length > 0 && (
                <span className="w-5 h-5 bg-[#111111] dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] rounded-xl font-semibold text-sm transition-all hover:shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('marketplace.myCart')}</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {cart.reduce((s, c) => s + c.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Fournisseurs', value: totalSuppliers, icon: Store, color: 'text-[#111111] dark:text-white' },
            { label: 'Produits', value: totalProductsCount, icon: Package, color: 'text-[#111111] dark:text-white' },
            { label: 'Note moyenne', value: avgRating, icon: Star, color: 'text-amber-500' },
            { label: 'Dans le panier', value: cart.reduce((s, c) => s + c.quantity, 0), icon: ShoppingBag, color: 'text-[#111111] dark:text-white' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-[11px] font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-[#111111] dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Feature tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide bg-[#F3F4F6] dark:bg-[#171717] rounded-2xl p-1">
          {[
            { id: 'products' as MarketplaceTab, label: 'Catalogue', icon: Package },
            { id: 'comparison' as MarketplaceTab, label: 'Comparateur', icon: BarChart3 },
            { id: 'ratings' as MarketplaceTab, label: 'Evaluations', icon: Star },
            { id: 'alerts' as MarketplaceTab, label: 'Alertes prix', icon: BellRing },
            { id: 'seasonal' as MarketplaceTab, label: 'Saisonnier', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-black text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* === TAB: Price Comparison Engine === */}
        {activeTab === 'comparison' && (
          <PriceComparisonEngine products={PRODUCTS} />
        )}

        {/* === TAB: Supplier Rating System === */}
        {activeTab === 'ratings' && (
          <SupplierRatingSystem suppliers={SUPPLIERS} />
        )}

        {/* === TAB: Price Alerts === */}
        {activeTab === 'alerts' && (
          <PriceAlertSetup />
        )}

        {/* === TAB: Seasonal Price Calendar === */}
        {activeTab === 'seasonal' && (
          <SeasonalPriceCalendar />
        )}

        {/* === TAB: Products (default catalog view) === */}
        {activeTab === 'products' && (<>

        {/* Search bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D1D5DB] dark:text-[#525252] group-focus-within:text-[#111111] dark:group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('marketplace.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#525252] focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-transparent focus:bg-white dark:focus:bg-black outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#262626]">
              <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
            </button>
          )}
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              !selectedCategory
                ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-md'
                : 'bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#333] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
            Tout
            <span className="opacity-60">{PRODUCTS.length}</span>
          </button>
          {CATEGORIES.map(cat => {
            const count = PRODUCTS.filter(p => p.category === cat).length;
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-md'
                    : 'bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#333] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <span>{cfg?.icon || '📦'}</span>
                {cat}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Filters toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2 bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="text-xs font-medium bg-transparent text-[#111111] dark:text-white outline-none cursor-pointer"
            >
              <option value="price_asc">{t('marketplace.priceAsc')}</option>
              <option value="price_desc">{t('marketplace.priceDesc')}</option>
              <option value="rating">{t('marketplace.supplierRating')}</option>
              <option value="delivery">{t('marketplace.deliveryTime')}</option>
            </select>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
              showFilters || showBioOnly || showLocalOnly
                ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-transparent'
                : 'bg-[#F9FAFB] dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#333]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filtres
            {(showBioOnly || showLocalOnly) && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </button>

          {showFilters && (
            <>
              <label className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#A3A3A3] cursor-pointer px-3 py-2 bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:border-green-300 dark:hover:border-green-800 transition-colors">
                <input
                  type="checkbox"
                  checked={showBioOnly}
                  onChange={e => setShowBioOnly(e.target.checked)}
                  className="rounded border-[#D1D5DB] dark:border-[#404040] text-green-600 focus:ring-green-500"
                />
                <Leaf className="w-3.5 h-3.5 text-green-500" />
                Bio
              </label>
              <label className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#A3A3A3] cursor-pointer px-3 py-2 bg-[#F9FAFB] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:border-teal-300 dark:hover:border-teal-800 transition-colors">
                <input
                  type="checkbox"
                  checked={showLocalOnly}
                  onChange={e => setShowLocalOnly(e.target.checked)}
                  className="rounded border-[#D1D5DB] dark:border-[#404040] text-teal-600 focus:ring-teal-500"
                />
                <MapPin className="w-3.5 h-3.5 text-teal-500" />
                Local
              </label>
            </>
          )}

          {/* View mode toggle */}
          <div className="ml-auto flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#262626] shadow-sm' : 'text-[#9CA3AF] dark:text-[#737373]'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#262626] shadow-sm' : 'text-[#9CA3AF] dark:text-[#737373]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] text-[#9CA3AF] dark:text-[#737373] font-medium tabular-nums">
            {filteredProducts.length} {t('marketplace.products')}
          </span>
        </div>

        {/* Premium suppliers */}
        {premiumSuppliers.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              {t('marketplace.partnerSuppliers')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumSuppliers.map(supplier => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onContact={(s) => showToast(`Contact ${s.name}: ${s.phone}`, 'info')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main content: Products + Cart sidebar */}
        <div className="flex gap-6">
          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#F9FAFB] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-[#D1D5DB] dark:text-[#404040]" />
                </div>
                <p className="text-[#111111] dark:text-white font-semibold">{t('marketplace.noProducts')}</p>
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">{t('marketplace.tryFilters')}</p>
                {(selectedCategory || searchQuery || showBioOnly || showLocalOnly) && (
                  <button
                    onClick={() => { setSelectedCategory(null); setSearchQuery(''); setShowBioOnly(false); setShowLocalOnly(false); }}
                    className="mt-4 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-3'}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart sidebar - desktop */}
          {cartOpen && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-6">
                <CartSidebar
                  cart={cart}
                  cartBySupplier={cartBySupplier}
                  cartTotal={cartTotal}
                  submitting={submitting}
                  onUpdateQty={updateCartQuantity}
                  onRemove={removeFromCart}
                  onClear={clearCart}
                  onSubmit={submitOrder}
                  onClose={() => setCartOpen(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile cart overlay */}
        {cartOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
            <div className="relative w-full max-h-[85vh] overflow-hidden flex flex-col">
              <CartSidebar
                cart={cart}
                cartBySupplier={cartBySupplier}
                cartTotal={cartTotal}
                submitting={submitting}
                onUpdateQty={updateCartQuantity}
                onRemove={removeFromCart}
                onClear={clearCart}
                onSubmit={submitOrder}
                onClose={() => setCartOpen(false)}
              />
            </div>
          </div>
        )}

        </>)}

        {/* Order history (with timeline for 'products' tab, standalone for order button) */}
        {showOrders && activeTab === 'products' && (
          <div className="bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <h2 className="font-bold text-[#111111] dark:text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                {t('marketplace.orderHistory')}
              </h2>
              <button onClick={() => setShowOrders(false)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              </button>
            </div>

            {ordersLoading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-[#E5E7EB] dark:border-[#262626] border-t-[#111111] dark:border-t-white rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('common.loading')}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">{t('marketplace.noOrders')}</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                {orders.map(order => {
                  const statusConfig: Record<string, { label: string; color: string }> = {
                    draft: { label: 'Brouillon', color: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]' },
                    sent: { label: 'Envoye', color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' },
                    confirmed: { label: 'Confirme', color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' },
                    received: { label: 'Recu', color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' },
                  };
                  const sc = statusConfig[order.status] || statusConfig.draft;

                  return (
                    <div key={order.id} className="p-4 hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-[#111111] dark:text-white">
                            {order.supplierName}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${sc.color}`}>
                            {sc.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#111111] dark:text-white tabular-nums">
                            {order.totalHT.toFixed(2)} EUR
                          </span>
                          <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-3">
                        {order.items.map((item, idx) => (
                          <span key={item.id}>
                            {item.quantity}x {item.productName}
                            {idx < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'draft' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'sent')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                          >
                            <Send className="w-3 h-3" /> Envoyer
                          </button>
                        )}
                        {order.status === 'sent' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Confirmer
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'received')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Recu
                          </button>
                        )}
                        {order.status === 'draft' && (
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
