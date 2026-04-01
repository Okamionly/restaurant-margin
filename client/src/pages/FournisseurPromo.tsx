import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Package, Star, ShoppingCart, Truck, Phone, Mail, MapPin, Globe,
  ChevronRight, Search, Filter, Plus, Minus, Send, Check, Loader2,
  Building2, Award, Clock, Shield,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  origin?: string;
  bio?: boolean;
  promo?: boolean;
  promoPrice?: number;
};

type Supplier = {
  id: number;
  name: string;
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
};

function authHeaders() {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Restaurant-Id': restaurantId || '1' };
}

const CATEGORY_ICONS: Record<string, string> = {
  'Viandes': '🥩', 'Poissons': '🐟', 'Légumes': '🥬', 'Fruits': '🍎',
  'Produits laitiers': '🧀', 'Épicerie': '🫒', 'Herbes': '🌿',
  'Boissons': '🍷', 'Charcuterie': '🥓', 'Boulangerie': '🥖',
  'Condiments': '🫙', 'Surgelés': '❄️', 'Œufs': '🥚', 'Divers': '📦',
};

export default function FournisseurPromo() {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [supRes, ingRes] = await Promise.all([
          fetch(`/api/suppliers/${id}`, { headers: authHeaders() }),
          fetch(`/api/ingredients?supplierId=${id}`, { headers: authHeaders() }),
        ]);
        if (supRes.ok) setSupplier(await supRes.json());
        if (ingRes.ok) {
          const ings = await ingRes.json();
          setProducts(Array.isArray(ings) ? ings : []);
        }
      } catch {}
      // If no supplier-specific products, load all ingredients as demo catalog
      if (products.length === 0) {
        try {
          const res = await fetch('/api/ingredients', { headers: authHeaders() });
          if (res.ok) {
            const all = await res.json();
            setProducts(Array.isArray(all) ? all.slice(0, 100) : []);
          }
        } catch {}
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // If no supplier found, use demo data
  useEffect(() => {
    if (!loading && !supplier) {
      setSupplier({
        id: Number(id) || 1,
        name: 'Metro Cash & Carry',
        email: 'pro@metro.fr',
        phone: '01 49 38 45 00',
        address: 'Zone Commerciale',
        city: 'Montpellier',
        region: 'Hérault',
        contactName: 'Service Professionnel',
        categories: ['Viandes', 'Poissons', 'Légumes', 'Produits laitiers', 'Épicerie'],
        delivery: true,
        minOrder: '150 € HT',
        paymentTerms: '30 jours fin de mois',
        website: 'www.metro.fr',
        siret: '123 456 789 00012',
      });
    }
  }, [loading, supplier, id]);

  const categories = ['Tous', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'Tous' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  const cartTotal = Object.entries(cart).reduce((sum, [pid, qty]) => {
    const p = products.find(pr => pr.id === Number(pid));
    return sum + (p ? (p.promoPrice || p.pricePerUnit) * qty : 0);
  }, 0);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

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

  async function handleOrder() {
    if (cartCount === 0 || !supplier) return;
    setSending(true);
    try {
      const orderLines = Object.entries(cart).map(([pid, qty]) => {
        const p = products.find(pr => pr.id === Number(pid))!;
        return { name: p.name, quantity: qty, unit: p.unit, total: (p.promoPrice || p.pricePerUnit) * qty };
      });
      await fetch('/api/orders/send-email', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          supplierName: supplier.name,
          supplierEmail: supplier.email,
          orderLines,
          totalHT: cartTotal,
          notes: `Commande depuis le catalogue fournisseur`,
        }),
      });
      setSent(true);
      setCart({});
    } catch {}
    setSending(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Supplier Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{supplier?.name}</h1>
                <p className="text-blue-200 text-sm">{supplier?.contactName}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-blue-100">
              {supplier?.phone && (
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{supplier.phone}</span>
              )}
              {supplier?.email && (
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{supplier.email}</span>
              )}
              {supplier?.city && (
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{supplier.city}{supplier.region ? `, ${supplier.region}` : ''}</span>
              )}
            </div>
          </div>
          <div className="text-right space-y-2">
            {supplier?.delivery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-xs font-medium">
                <Truck className="w-3.5 h-3.5" /> Livraison
              </span>
            )}
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(supplier?.categories || []).map(cat => (
            <span key={cat} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
              {CATEGORY_ICONS[cat] || '📦'} {cat}
            </span>
          ))}
        </div>
        {/* Trust badges */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/20 text-xs text-blue-200">
          <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Fournisseur certifié</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {supplier?.paymentTerms || 'Paiement 30j'}</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Min. {supplier?.minOrder || '100€ HT'}</span>
          {supplier?.siret && <span className="flex items-center gap-1.5">SIRET: {supplier.siret}</span>}
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {CATEGORY_ICONS[cat] || ''} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => {
          const inCart = cart[product.id] || 0;
          return (
            <div
              key={product.id}
              className={`bg-slate-900/50 border rounded-xl p-4 transition-all ${
                inCart > 0 ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-white text-sm">{product.name}</p>
                  <span className="text-xs text-slate-400">{product.category}</span>
                </div>
                {product.promo && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full">PROMO</span>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  {product.promo && product.promoPrice ? (
                    <div>
                      <span className="text-xs text-slate-500 line-through">{(product.pricePerUnit ?? 0).toFixed(2)} €</span>
                      <p className="text-lg font-bold text-emerald-400">{(product.promoPrice ?? 0).toFixed(2)} €<span className="text-xs text-slate-400 font-normal">/{product.unit}</span></p>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-white">{(product.pricePerUnit ?? 0).toFixed(2)} €<span className="text-xs text-slate-400 font-normal">/{product.unit}</span></p>
                  )}
                </div>
                {inCart > 0 ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-white w-6 text-center">{inCart}</span>
                    <button onClick={() => addToCart(product.id)} className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(product.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors">
                    <Plus className="w-3.5 h-3.5 inline mr-1" />Ajouter
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Aucun produit trouvé</p>
        </div>
      )}

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 max-w-lg w-[calc(100%-2rem)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">{cartCount} article{cartCount > 1 ? 's' : ''}</p>
              <p className="text-blue-400 text-sm font-semibold">{cartTotal.toFixed(2)} € HT</p>
            </div>
          </div>
          <button
            onClick={handleOrder}
            disabled={sending || sent}
            className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {sent ? <><Check className="w-4 h-4" /> Envoyée</> :
             sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> :
             <><Send className="w-4 h-4" /> Commander</>}
          </button>
        </div>
      )}
    </div>
  );
}
