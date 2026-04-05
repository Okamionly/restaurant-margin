import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, Truck, Phone, Mail, MapPin,
  Search, Plus, Minus, Send, Check,
  Building2, Award, Clock, Shield, ArrowLeft, Percent, Tag, Sparkles, Calendar,
  Star, Filter, ChevronDown, Loader2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PromoProduct = {
  id: number;
  name: string;
  category: 'Viandes' | 'Poissons' | 'Légumes' | 'Épicerie' | 'Produits laitiers' | 'Boissons' | 'Surgelés' | 'Fruits';
  unit: string;
  normalPrice: number;
  promoPrice: number;
  discount: number;        // %
  endDate: string;         // YYYY-MM-DD
  badge: 'promo' | 'nouveau' | 'bio' | null;
  origin?: string;
  stock: 'disponible' | 'stock-faible' | 'rupture';
};

type SupplierData = {
  id: string;
  name: string;
  logo: string;            // emoji as quick logo stand-in
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  contactName: string;
  categories: string[];
  delivery: boolean;
  minOrder: string;
  paymentTerms: string;
  website: string;
  siret: string;
  rating: number;
  products: PromoProduct[];
};

/* ------------------------------------------------------------------ */
/*  API helpers                                                        */
/* ------------------------------------------------------------------ */

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Tous': '📋',
  'Viandes': '🥩',
  'Poissons': '🐟',
  'Légumes': '🥬',
  'Fruits': '🍎',
  'Produits laitiers': '🧀',
  'Épicerie': '🫒',
  'Boissons': '🍷',
  'Surgelés': '❄️',
};

const BADGE_CONFIG: Record<string, { label: string; bg: string; text: string; icon: typeof Tag }> = {
  promo:   { label: 'PROMO',   bg: 'bg-red-500/20',     text: 'text-red-400',     icon: Percent },
  nouveau: { label: 'NOUVEAU', bg: 'bg-amber-500/20',   text: 'text-amber-400',   icon: Sparkles },
  bio:     { label: 'BIO',     bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: Tag },
};

function daysRemaining(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const EMPTY_SUPPLIER: SupplierData = {
  id: '',
  name: '',
  logo: '📦',
  email: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  contactName: '',
  categories: [],
  delivery: false,
  minOrder: '',
  paymentTerms: '',
  website: '',
  siret: '',
  rating: 0,
  products: [],
};

export default function FournisseurPromo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState<SupplierData>(EMPTY_SUPPLIER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tous');
  const [sent, setSent] = useState(false);
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'name' | 'endDate'>('discount');

  const fetchSupplierPromo = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/suppliers/${id}/promos`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      setSupplier(data && data.id ? data : EMPTY_SUPPLIER);
    } catch {
      setError('Impossible de charger les promotions');
      setSupplier(EMPTY_SUPPLIER);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSupplierPromo();
  }, [fetchSupplierPromo]);

  const categories = useMemo(() => {
    const cats = [...new Set(supplier.products.map(p => p.category))];
    return ['Tous', ...cats];
  }, [supplier]);

  const filtered = useMemo(() => {
    let list = supplier.products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'Tous' || p.category === selectedCat;
      return matchSearch && matchCat;
    });
    list.sort((a, b) => {
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'price') return a.promoPrice - b.promoPrice;
      if (sortBy === 'endDate') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [supplier, search, selectedCat, sortBy]);

  const cartTotal = Object.entries(cart).reduce((sum, [pid, qty]) => {
    const p = supplier.products.find(pr => pr.id === Number(pid));
    return sum + (p ? p.promoPrice * qty : 0);
  }, 0);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const cartSavings = Object.entries(cart).reduce((sum, [pid, qty]) => {
    const p = supplier.products.find(pr => pr.id === Number(pid));
    return sum + (p ? (p.normalPrice - p.promoPrice) * qty : 0);
  }, 0);

  function addToCart(productId: number) {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  }
  function removeFromCart(productId: number) {
    setCart(prev => {
      const next = { ...prev };
      if (next[productId] > 1) next[productId]--;
      else delete next[productId];
      return next;
    });
  }

  function handleOrder() {
    if (cartCount === 0) return;
    setSent(true);
    setCart({});
    setTimeout(() => setSent(false), 3000);
  }

  const promoCount = supplier.products.filter(p => p.badge === 'promo').length;
  const avgDiscount = supplier.products.length > 0
    ? Math.round(supplier.products.reduce((s, p) => s + p.discount, 0) / supplier.products.length)
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-[#9CA3AF] dark:text-[#737373]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Chargement des promotions...</p>
      </div>
    );
  }

  if (error || !supplier.id) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/suppliers')}
          className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux fournisseurs
        </button>
        <div className="flex flex-col items-center justify-center h-64 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl">
          <Package className="w-12 h-12 text-[#6B7280] dark:text-[#A3A3A3] mb-4 opacity-40" />
          <p className="text-[#9CA3AF] dark:text-[#737373] font-medium mb-2">Aucune promotion disponible</p>
          <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">{error || 'Ce fournisseur n\'a pas de promotions en cours.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/suppliers')}
        className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux fournisseurs
      </button>

      {/* ── Supplier Header ──────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
                {supplier.logo}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{supplier.name}</h1>
                <p className="text-teal-200 text-sm">{supplier.contactName}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(supplier.rating) ? 'fill-amber-400 text-amber-400' : 'text-[#111111] dark:text-white/30'}`}
                    />
                  ))}
                  <span className="text-xs text-teal-200 ml-1">{supplier.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-teal-100">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{supplier.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{supplier.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{supplier.city}, {supplier.region}</span>
            </div>
          </div>
          <div className="text-right space-y-2">
            {supplier.delivery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-xs font-medium">
                <Truck className="w-3.5 h-3.5" /> Livraison
              </span>
            )}
          </div>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {supplier.categories.map(cat => (
            <span key={cat} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
              {CATEGORY_ICONS[cat] || '📦'} {cat}
            </span>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20 text-xs text-teal-200">
          <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Fournisseur certifié</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {supplier.paymentTerms}</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Min. {supplier.minOrder}</span>
          <span className="flex items-center gap-1.5">SIRET: {supplier.siret}</span>
        </div>
      </div>

      {/* ── Promo stats banner ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Produits en promo', value: `${promoCount}`, icon: Tag, color: 'text-red-400' },
          { label: 'Réduction moyenne', value: `-${avgDiscount}%`, icon: Percent, color: 'text-amber-400' },
          { label: 'Produits au catalogue', value: `${supplier.products.length}`, icon: Package, color: 'text-teal-400' },
          { label: 'Catégories', value: `${supplier.categories.length}`, icon: Filter, color: 'text-emerald-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-xl font-bold text-[#111111] dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter bar ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280] dark:text-[#A3A3A3] focus:ring-2 focus:ring-[#111111] dark:ring-white focus:outline-none"
            />
          </div>
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-sm text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:ring-white focus:outline-none cursor-pointer"
            >
              <option value="discount">Meilleure réduction</option>
              <option value="price">Prix croissant</option>
              <option value="endDate">Fin de promo proche</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-[#111111] dark:bg-white text-white'
                  : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
              }`}
            >
              {CATEGORY_ICONS[cat] || ''} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Products Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => {
          const inCart = cart[product.id] || 0;
          const days = daysRemaining(product.endDate);
          const badgeConf = product.badge ? BADGE_CONFIG[product.badge] : null;

          return (
            <div
              key={product.id}
              className={`bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border rounded-xl p-4 transition-all flex flex-col justify-between ${
                inCart > 0
                  ? 'border-teal-500/50 ring-1 ring-[#111111] dark:ring-white/20'
                  : product.stock === 'rupture'
                  ? 'border-[#E5E7EB] dark:border-[#1A1A1A] opacity-50'
                  : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#E5E7EB] dark:border-[#1A1A1A]'
              }`}
            >
              {/* Top: name, badge, origin */}
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#111111] dark:text-white text-sm truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{CATEGORY_ICONS[product.category] || ''} {product.category}</span>
                      {product.origin && (
                        <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">· {product.origin}</span>
                      )}
                    </div>
                  </div>
                  {badgeConf && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 ${badgeConf.bg} ${badgeConf.text} text-[10px] font-bold rounded-full shrink-0 ml-2`}>
                      <badgeConf.icon className="w-3 h-3" />
                      {badgeConf.label}
                    </span>
                  )}
                </div>

                {/* Discount ribbon */}
                <div className="flex items-center gap-2 my-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg">
                    <Percent className="w-3 h-3" />
                    -{product.discount}%
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#9CA3AF] dark:text-[#737373]">
                    <Calendar className="w-3 h-3" />
                    Jusqu'au {formatDate(product.endDate)}
                    {days <= 3 && days > 0 && (
                      <span className="text-amber-400 font-medium ml-1">({days}j restants)</span>
                    )}
                    {days === 0 && (
                      <span className="text-red-400 font-medium ml-1">(Dernier jour !)</span>
                    )}
                  </div>
                </div>

                {/* Stock indicator */}
                {product.stock === 'stock-faible' && (
                  <p className="text-[10px] text-amber-400 mb-2">Stock faible - commandez vite</p>
                )}
                {product.stock === 'rupture' && (
                  <p className="text-[10px] text-red-400 mb-2">Rupture de stock</p>
                )}
              </div>

              {/* Bottom: prices + cart */}
              <div className="flex items-end justify-between mt-2">
                <div>
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] line-through">{product.normalPrice.toFixed(2)} €</span>
                  <p className="text-lg font-bold text-emerald-400">
                    {product.promoPrice.toFixed(2)} €
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373] font-normal">/{product.unit}</span>
                  </p>
                </div>
                {product.stock !== 'rupture' && (
                  inCart > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-8 h-8 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] flex items-center justify-center text-[#6B7280] dark:text-[#A3A3A3]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-[#111111] dark:text-white w-6 text-center">{inCart}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] flex items-center justify-center text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="px-3 py-1.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />Ajouter
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Aucun produit trouvé</p>
        </div>
      )}

      {/* ── Floating Cart ────────────────────────────────────────────── */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 max-w-lg w-[calc(100%-2rem)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <p className="text-[#111111] dark:text-white font-bold">{cartCount} article{cartCount > 1 ? 's' : ''}</p>
              <p className="text-teal-400 text-sm font-semibold">{cartTotal.toFixed(2)} € HT</p>
              {cartSavings > 0 && (
                <p className="text-emerald-400 text-[11px]">Économie : {cartSavings.toFixed(2)} €</p>
              )}
            </div>
          </div>
          <button
            onClick={handleOrder}
            disabled={sent}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {sent ? <><Check className="w-4 h-4" /> Envoyée</> : <><Send className="w-4 h-4" /> Commander</>}
          </button>
        </div>
      )}

      {/* Sent confirmation toast */}
      {sent && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <Check className="w-5 h-5" />
          <div>
            <p className="font-semibold">Commande envoyée !</p>
            <p className="text-sm text-emerald-100">Un email a été envoyé à {supplier.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
