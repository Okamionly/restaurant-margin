import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, ShoppingBag, Star, Truck, Clock, Filter, ChevronDown, ChevronUp,
  Plus, Minus, X, Store, Award, Leaf, MapPin, ArrowUpDown, ShoppingCart,
  Package, Phone, History, CheckCircle, Send, Inbox, Trash2, Heart,
  TrendingDown, Eye, Zap, BadgePercent, BarChart3, Grid3x3, List
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

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'delivery';
type ViewMode = 'grid' | 'list';

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

        {/* Order history */}
        {showOrders && (
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
