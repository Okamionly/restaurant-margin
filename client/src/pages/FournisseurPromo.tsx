import { formatCurrency } from '../utils/currency';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '../hooks/useApiClient';
import {
  Package, ShoppingCart, Truck, Phone, Mail, MapPin,
  Search, Plus, Minus, Send, Check,
  Building2, Award, Clock, Shield, ArrowLeft, Percent, Tag, Sparkles, Calendar,
  Star, Filter, ChevronDown, Loader2, Bell, History, TrendingDown, Zap, Calculator,
  AlertTriangle, ChevronRight, X,
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
  const { authHeaders } = useApiClient();

  const [supplier, setSupplier] = useState<SupplierData>(EMPTY_SUPPLIER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tous');
  const [sent, setSent] = useState(false);
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'name' | 'endDate'>('discount');
  const [showAlerts, setShowAlerts] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());
  const [activeView, setActiveView] = useState<'promos' | 'history'>('promos');

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

  // Potential total savings if you order everything at promo price
  const totalPotentialSavings = useMemo(() => {
    return supplier.products.reduce((sum, p) => sum + (p.normalPrice - p.promoPrice), 0);
  }, [supplier]);

  // Best deals (top 3 by discount)
  const bestDeals = useMemo(() => {
    return [...supplier.products]
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 3);
  }, [supplier]);

  // Urgently ending promos (within 3 days)
  const urgentPromos = useMemo(() => {
    return supplier.products.filter(p => daysRemaining(p.endDate) <= 3 && daysRemaining(p.endDate) >= 0);
  }, [supplier]);

  // Alerts
  const alerts = useMemo(() => {
    const list: { id: number; type: 'urgent' | 'deal' | 'new'; message: string; detail: string }[] = [];
    urgentPromos.forEach((p, i) => {
      const days = daysRemaining(p.endDate);
      list.push({
        id: i,
        type: 'urgent',
        message: days === 0 ? `Dernier jour pour ${p.name} !` : `${p.name} expire dans ${days} jour${days > 1 ? 's' : ''}`,
        detail: `-${p.discount}% soit ${formatCurrency(p.normalPrice - p.promoPrice)} d'economie/${p.unit}`,
      });
    });
    bestDeals.forEach((p, i) => {
      if (!urgentPromos.find(u => u.id === p.id)) {
        list.push({
          id: 100 + i,
          type: 'deal',
          message: `Offre exceptionnelle : -${p.discount}% sur ${p.name}`,
          detail: `${formatCurrency(p.promoPrice)} au lieu de ${formatCurrency(p.normalPrice)}/${p.unit}`,
        });
      }
    });
    supplier.products.filter(p => p.badge === 'nouveau').forEach((p, i) => {
      list.push({
        id: 200 + i,
        type: 'new',
        message: `Nouveau produit : ${p.name}`,
        detail: `${formatCurrency(p.promoPrice)}/${p.unit}`,
      });
    });
    return list;
  }, [urgentPromos, bestDeals, supplier]);

  // Past promos (mock data based on current products)
  const pastPromos = useMemo(() => {
    return supplier.products.slice(0, 5).map((p, i) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      discount: Math.round(p.discount * 0.8),
      savedAmount: ((p.normalPrice - p.promoPrice) * (3 + i)).toFixed(2),
      usedDate: new Date(Date.now() - (7 + i * 5) * 86400000).toISOString(),
      quantity: 3 + i,
      unit: p.unit,
    }));
  }, [supplier]);

  const dismissAlert = useCallback((alertId: number) => {
    setDismissedAlerts(prev => {
      const next = new Set(prev);
      next.add(alertId);
      return next;
    });
  }, []);

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));

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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Produits en promo', value: `${promoCount}`, icon: Tag, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Reduction moyenne', value: `-${avgDiscount}%`, icon: Percent, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Economies potentielles', value: formatCurrency(totalPotentialSavings), icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Produits au catalogue', value: `${supplier.products.length}`, icon: Package, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'Fin prochaine', value: `${urgentPromos.length}`, icon: Clock, color: urgentPromos.length > 0 ? 'text-red-400' : 'text-[#9CA3AF]', bg: urgentPromos.length > 0 ? 'bg-red-500/10' : 'bg-[#F3F4F6] dark:bg-[#171717]' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 text-center`}>
            <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
            <p className="text-xl font-bold text-[#111111] dark:text-white">{stat.value}</p>
            <p className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Alert System ────────────────────────────────────────────── */}
      {showAlerts && visibleAlerts.length > 0 && (
        <div className="space-y-2">
          {visibleAlerts.slice(0, 3).map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-2xl border transition-all ${
                alert.type === 'urgent'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  : alert.type === 'deal'
                  ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                alert.type === 'urgent'
                  ? 'bg-red-500/20'
                  : alert.type === 'deal'
                  ? 'bg-emerald-500/20'
                  : 'bg-amber-500/20'
              }`}>
                {alert.type === 'urgent' ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : alert.type === 'deal' ? (
                  <Zap className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${
                  alert.type === 'urgent' ? 'text-red-800 dark:text-red-300' :
                  alert.type === 'deal' ? 'text-emerald-800 dark:text-emerald-300' :
                  'text-amber-800 dark:text-amber-300'
                }`}>{alert.message}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">{alert.detail}</p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 rounded-lg text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Savings Calculator ────────────────────────────────────────── */}
      {cartCount > 0 && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Calculateur d'economies</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Si vous commandez maintenant</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-900">
              <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Total commande</p>
              <p className="text-xl font-bold text-[#111111] dark:text-white mt-1">{formatCurrency(cartTotal)}</p>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-900">
              <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Vous economisez</p>
              <p className="text-xl font-bold text-emerald-500 mt-1">-{formatCurrency(cartSavings)}</p>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl p-3 text-center border border-emerald-100 dark:border-emerald-900">
              <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Reduction moy.</p>
              <p className="text-xl font-bold text-emerald-500 mt-1">
                -{cartTotal + cartSavings > 0 ? ((cartSavings / (cartTotal + cartSavings)) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── View Toggle: Promos | Historique ──────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveView('promos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeView === 'promos'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
              : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          Promotions actives
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeView === 'history'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
              : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white'
          }`}
        >
          <History className="w-4 h-4" />
          Historique
        </button>
      </div>

      {/* ── History View ─────────────────────────────────────────────── */}
      {activeView === 'history' && (
        <div className="bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <h3 className="text-sm font-bold text-[#111111] dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-teal-400" />
              Promotions utilisees recemment
            </h3>
          </div>
          {pastPromos.length > 0 ? (
            <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {pastPromos.map(promo => (
                <div key={promo.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white dark:hover:bg-[#0A0A0A] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center text-lg">
                    {CATEGORY_ICONS[promo.category] || '\u{1F4E6}'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#111111] dark:text-white">{promo.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                        -{promo.discount}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                      {promo.quantity} {promo.unit} commande{promo.quantity > 1 ? 's' : ''} le {formatDate(promo.usedDate)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-emerald-500">-{formatCurrency(parseFloat(promo.savedAmount))}</span>
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">economise</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <History className="w-10 h-10 mx-auto mb-3 text-[#D1D5DB] dark:text-[#333]" />
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucune promotion utilisee</p>
            </div>
          )}
          {/* Total savings summary */}
          <div className="px-5 py-3 bg-white dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
            <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">Total economies</span>
            <span className="text-lg font-bold text-emerald-500">
              -{formatCurrency(pastPromos.reduce((sum, p) => sum + parseFloat(p.savedAmount), 0))}
            </span>
          </div>
        </div>
      )}

      {/* ── Active Promos View ───────────────────────────────────────── */}
      {activeView === 'promos' && (
      <>
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
              className={`bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border rounded-2xl p-4 transition-all flex flex-col justify-between ${
                inCart > 0
                  ? 'border-teal-500/50 ring-1 ring-[#111111] dark:ring-white/20'
                  : product.stock === 'rupture'
                  ? 'border-[#E5E7EB] dark:border-[#1A1A1A] opacity-50'
                  : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333]'
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
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] line-through">{formatCurrency(product.normalPrice)}</span>
                  <p className="text-lg font-bold text-emerald-400">
                    {formatCurrency(product.promoPrice)}
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
                      <Zap className="w-3.5 h-3.5" />Profiter
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
      </>
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
              <p className="text-teal-400 text-sm font-semibold">{formatCurrency(cartTotal)} HT</p>
              {cartSavings > 0 && (
                <p className="text-emerald-400 text-[11px]">Économie : {formatCurrency(cartSavings)}</p>
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
