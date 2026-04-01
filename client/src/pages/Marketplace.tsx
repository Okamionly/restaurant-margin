import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, ShoppingBag, Star, Truck, Clock, Filter, ChevronDown, Plus, Minus, X, Store, Award, Leaf, MapPin, ArrowUpDown, ShoppingCart, Package, Phone, History, CheckCircle, Send, Inbox, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
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

const SUPPLIERS: Supplier[] = [
  { id: 'metro', name: 'Metro', logo: 'M', rating: 4.5, reviewCount: 328, deliveryDays: 1, premium: true, bio: false, local: false, description: 'Grossiste N°1 en France. Large gamme de produits alimentaires et non-alimentaires pour les professionnels de la restauration.', phone: '01 49 48 80 00' },
  { id: 'transgourmet', name: 'Transgourmet', logo: 'T', rating: 4.3, reviewCount: 215, deliveryDays: 1, premium: true, bio: true, local: false, description: 'Distributeur de produits alimentaires et d\'hygiene pour la restauration. Gamme bio certifiee AB.', phone: '01 60 47 89 00' },
  { id: 'pomona', name: 'Pomona', logo: 'P', rating: 4.6, reviewCount: 189, deliveryDays: 1, premium: false, bio: true, local: true, description: 'Specialiste fruits et legumes frais. Approvisionnement local et circuits courts privilegies.', phone: '01 46 87 30 00' },
  { id: 'sysco', name: 'Sysco France', logo: 'S', rating: 4.2, reviewCount: 142, deliveryDays: 2, premium: true, bio: false, local: false, description: 'Leader mondial de la distribution alimentaire. Gamme complete viandes, poissons, epicerie.', phone: '01 44 92 70 00' },
  { id: 'brake', name: 'Brake France', logo: 'B', rating: 4.0, reviewCount: 98, deliveryDays: 2, premium: false, bio: false, local: false, description: 'Solutions alimentaires pour la restauration collective et commerciale. Produits surgeles et frais.', phone: '02 41 21 60 00' },
  { id: 'davigel', name: 'Davigel', logo: 'D', rating: 4.4, reviewCount: 176, deliveryDays: 2, premium: false, bio: false, local: false, description: 'Expert en produits surgeles haut de gamme pour la restauration. Desserts, plats elabores, poissons.', phone: '02 32 29 40 00' },
  { id: 'passionfroid', name: 'PassionFroid', logo: 'PF', rating: 4.1, reviewCount: 134, deliveryDays: 1, premium: false, bio: true, local: true, description: 'Distributeur multi-specialiste en produits frais, surgeles et epicerie. Filiere bio developpee.', phone: '01 64 11 60 00' },
  { id: 'prodistrib', name: 'ProDistrib', logo: 'PD', rating: 3.9, reviewCount: 67, deliveryDays: 3, premium: false, bio: false, local: true, description: 'Distributeur regional specialise en epicerie, condiments et produits secs pour restaurateurs.', phone: '04 72 51 30 00' },
  { id: 'episaveurs', name: 'EpiSaveurs', logo: 'E', rating: 4.3, reviewCount: 156, deliveryDays: 2, premium: false, bio: true, local: false, description: 'Epicerie fine et ingredients de qualite pour les chefs. Huiles, vinaigres, epices du monde entier.', phone: '01 53 86 40 00' },
  { id: 'sodexo', name: 'Sodexo Supplies', logo: 'SS', rating: 4.0, reviewCount: 112, deliveryDays: 2, premium: false, bio: false, local: false, description: 'Approvisionnement professionnel pour la restauration collective. Volumes importants, prix negocies.', phone: '01 30 85 75 00' },
];

const CATEGORIES = ['Viandes', 'Poissons', 'Fruits & Legumes', 'Epicerie', 'Boissons', 'Surgeles', 'Produits laitiers'];

const PRODUCTS: Product[] = [
  // ── Viandes ──
  { id: 'v1', name: 'Filet de boeuf', category: 'Viandes', description: 'Filet de boeuf francais, race Charolaise, piece de 2-3kg', offers: [
    { supplierId: 'metro', price: 38.90, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'sysco', price: 36.50, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'transgourmet', price: 39.80, unit: 'kg', minOrder: 2, inStock: true },
  ]},
  { id: 'v2', name: 'Blanc de poulet fermier', category: 'Viandes', description: 'Poulet fermier Label Rouge, filets sans peau', offers: [
    { supplierId: 'metro', price: 9.80, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'transgourmet', price: 10.20, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'passionfroid', price: 9.50, unit: 'kg', minOrder: 5, inStock: true },
  ]},
  { id: 'v3', name: 'Entrecote de boeuf', category: 'Viandes', description: 'Entrecote maturee 21 jours, origine France', offers: [
    { supplierId: 'metro', price: 28.50, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'sysco', price: 27.90, unit: 'kg', minOrder: 5, inStock: true },
    { supplierId: 'sodexo', price: 29.10, unit: 'kg', minOrder: 5, inStock: false },
  ]},
  { id: 'v4', name: 'Carre d\'agneau', category: 'Viandes', description: 'Carre d\'agneau francais, 8 cotes, pare a blanc', offers: [
    { supplierId: 'metro', price: 24.90, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'transgourmet', price: 25.60, unit: 'kg', minOrder: 2, inStock: true },
  ]},
  { id: 'v5', name: 'Magret de canard', category: 'Viandes', description: 'Magret de canard du Sud-Ouest IGP, frais', offers: [
    { supplierId: 'sysco', price: 16.80, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'passionfroid', price: 17.20, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'metro', price: 17.50, unit: 'kg', minOrder: 2, inStock: true },
  ]},
  // ── Poissons ──
  { id: 'p1', name: 'Filet de saumon', category: 'Poissons', description: 'Saumon Atlantique d\'Ecosse, filet avec peau, qualite sushi', offers: [
    { supplierId: 'metro', price: 22.50, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'transgourmet', price: 23.80, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'davigel', price: 21.90, unit: 'kg', minOrder: 3, inStock: true },
  ]},
  { id: 'p2', name: 'Bar de ligne', category: 'Poissons', description: 'Bar de ligne sauvage, peche Atlantique Nord-Est, entier', offers: [
    { supplierId: 'pomona', price: 32.00, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'metro', price: 34.50, unit: 'kg', minOrder: 1, inStock: true },
  ]},
  { id: 'p3', name: 'Crevettes gambas', category: 'Poissons', description: 'Gambas entieres crues calibre 16/20, congelees', offers: [
    { supplierId: 'davigel', price: 18.90, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'brake', price: 19.50, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'sysco', price: 20.10, unit: 'kg', minOrder: 2, inStock: false },
  ]},
  { id: 'p4', name: 'Dos de cabillaud', category: 'Poissons', description: 'Cabillaud peche durable MSC, dos sans arete', offers: [
    { supplierId: 'metro', price: 19.80, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'davigel', price: 18.50, unit: 'kg', minOrder: 5, inStock: true },
  ]},
  // ── Fruits & Legumes ──
  { id: 'fl1', name: 'Tomates grappe bio', category: 'Fruits & Legumes', description: 'Tomates grappe bio francaises, calibre 57-67mm', offers: [
    { supplierId: 'pomona', price: 3.20, unit: 'kg', minOrder: 5, inStock: true },
    { supplierId: 'transgourmet', price: 3.50, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'passionfroid', price: 3.10, unit: 'kg', minOrder: 5, inStock: true },
  ]},
  { id: 'fl2', name: 'Salade mesclun', category: 'Fruits & Legumes', description: 'Mesclun frais pret a l\'emploi, sachet 500g', offers: [
    { supplierId: 'pomona', price: 8.50, unit: 'kg', minOrder: 2, inStock: true },
    { supplierId: 'metro', price: 9.20, unit: 'kg', minOrder: 2, inStock: true },
  ]},
  { id: 'fl3', name: 'Pommes de terre Agata', category: 'Fruits & Legumes', description: 'Pommes de terre Agata, chair ferme, calibre 40-65mm', offers: [
    { supplierId: 'pomona', price: 1.20, unit: 'kg', minOrder: 10, inStock: true },
    { supplierId: 'metro', price: 1.35, unit: 'kg', minOrder: 10, inStock: true },
    { supplierId: 'sodexo', price: 1.15, unit: 'kg', minOrder: 25, inStock: true },
  ]},
  { id: 'fl4', name: 'Citrons jaunes bio', category: 'Fruits & Legumes', description: 'Citrons jaunes bio non traites, origine Espagne', offers: [
    { supplierId: 'pomona', price: 2.80, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'episaveurs', price: 3.10, unit: 'kg', minOrder: 2, inStock: true },
  ]},
  { id: 'fl5', name: 'Oignons jaunes', category: 'Fruits & Legumes', description: 'Oignons jaunes France, filet 5kg', offers: [
    { supplierId: 'pomona', price: 1.60, unit: 'kg', minOrder: 5, inStock: true },
    { supplierId: 'metro', price: 1.75, unit: 'kg', minOrder: 5, inStock: true },
    { supplierId: 'prodistrib', price: 1.50, unit: 'kg', minOrder: 10, inStock: true },
  ]},
  // ── Epicerie ──
  { id: 'e1', name: 'Huile d\'olive extra vierge', category: 'Epicerie', description: 'Huile d\'olive vierge extra, premiere pression a froid, bidon 5L', offers: [
    { supplierId: 'episaveurs', price: 28.50, unit: '5L', minOrder: 1, inStock: true },
    { supplierId: 'metro', price: 32.00, unit: '5L', minOrder: 1, inStock: true },
    { supplierId: 'transgourmet', price: 30.50, unit: '5L', minOrder: 1, inStock: true },
  ]},
  { id: 'e2', name: 'Farine T55', category: 'Epicerie', description: 'Farine de ble T55, sac 25kg, panification et patisserie', offers: [
    { supplierId: 'metro', price: 18.90, unit: '25kg', minOrder: 1, inStock: true },
    { supplierId: 'prodistrib', price: 17.50, unit: '25kg', minOrder: 2, inStock: true },
    { supplierId: 'sodexo', price: 19.20, unit: '25kg', minOrder: 1, inStock: true },
  ]},
  { id: 'e3', name: 'Vinaigre balsamique', category: 'Epicerie', description: 'Vinaigre balsamique de Modene IGP, bouteille 1L', offers: [
    { supplierId: 'episaveurs', price: 8.90, unit: 'L', minOrder: 3, inStock: true },
    { supplierId: 'metro', price: 9.50, unit: 'L', minOrder: 2, inStock: true },
  ]},
  { id: 'e4', name: 'Sel de Guerande', category: 'Epicerie', description: 'Fleur de sel de Guerande, seau 1kg', offers: [
    { supplierId: 'episaveurs', price: 12.80, unit: 'kg', minOrder: 1, inStock: true },
    { supplierId: 'prodistrib', price: 13.50, unit: 'kg', minOrder: 1, inStock: true },
  ]},
  { id: 'e5', name: 'Riz basmati', category: 'Epicerie', description: 'Riz basmati long grain, sac 5kg, origine Inde', offers: [
    { supplierId: 'metro', price: 9.90, unit: '5kg', minOrder: 2, inStock: true },
    { supplierId: 'prodistrib', price: 9.20, unit: '5kg', minOrder: 3, inStock: true },
    { supplierId: 'sodexo', price: 10.50, unit: '5kg', minOrder: 2, inStock: true },
  ]},
  // ── Boissons ──
  { id: 'b1', name: 'Eau minerale plate', category: 'Boissons', description: 'Eau minerale naturelle, pack 6x1.5L', offers: [
    { supplierId: 'metro', price: 3.20, unit: 'pack', minOrder: 10, inStock: true },
    { supplierId: 'sodexo', price: 2.90, unit: 'pack', minOrder: 20, inStock: true },
    { supplierId: 'brake', price: 3.10, unit: 'pack', minOrder: 10, inStock: true },
  ]},
  { id: 'b2', name: 'Jus d\'orange frais', category: 'Boissons', description: 'Jus d\'orange 100% pur jus, brique 1L', offers: [
    { supplierId: 'passionfroid', price: 2.80, unit: 'L', minOrder: 12, inStock: true },
    { supplierId: 'metro', price: 3.10, unit: 'L', minOrder: 6, inStock: true },
  ]},
  { id: 'b3', name: 'Coca-Cola', category: 'Boissons', description: 'Coca-Cola Original, pack 24x33cl canettes', offers: [
    { supplierId: 'metro', price: 16.80, unit: 'pack', minOrder: 2, inStock: true },
    { supplierId: 'sodexo', price: 15.90, unit: 'pack', minOrder: 5, inStock: true },
    { supplierId: 'brake', price: 16.20, unit: 'pack', minOrder: 3, inStock: true },
  ]},
  // ── Surgeles ──
  { id: 's1', name: 'Frites surgelees', category: 'Surgeles', description: 'Frites 10/10 precuites surgelees, sac 2.5kg', offers: [
    { supplierId: 'davigel', price: 4.50, unit: '2.5kg', minOrder: 4, inStock: true },
    { supplierId: 'brake', price: 4.20, unit: '2.5kg', minOrder: 6, inStock: true },
    { supplierId: 'metro', price: 4.80, unit: '2.5kg', minOrder: 4, inStock: true },
  ]},
  { id: 's2', name: 'Fondant au chocolat', category: 'Surgeles', description: 'Fondant au chocolat noir 70%, portion individuelle x12', offers: [
    { supplierId: 'davigel', price: 18.90, unit: 'x12', minOrder: 2, inStock: true },
    { supplierId: 'brake', price: 19.50, unit: 'x12', minOrder: 2, inStock: true },
  ]},
  // ── Produits laitiers ──
  { id: 'pl1', name: 'Beurre doux AOP', category: 'Produits laitiers', description: 'Beurre doux AOP Charentes-Poitou, plaque 1kg', offers: [
    { supplierId: 'transgourmet', price: 9.80, unit: 'kg', minOrder: 5, inStock: true },
    { supplierId: 'metro', price: 10.20, unit: 'kg', minOrder: 3, inStock: true },
    { supplierId: 'passionfroid', price: 9.50, unit: 'kg', minOrder: 5, inStock: true },
  ]},
  { id: 'pl2', name: 'Creme fraiche epaisse', category: 'Produits laitiers', description: 'Creme fraiche epaisse 30% MG, pot 1L', offers: [
    { supplierId: 'passionfroid', price: 4.20, unit: 'L', minOrder: 6, inStock: true },
    { supplierId: 'transgourmet', price: 4.50, unit: 'L', minOrder: 4, inStock: true },
    { supplierId: 'metro', price: 4.60, unit: 'L', minOrder: 4, inStock: true },
  ]},
  { id: 'pl3', name: 'Parmesan Reggiano', category: 'Produits laitiers', description: 'Parmigiano Reggiano AOP 24 mois, meule tranchee', offers: [
    { supplierId: 'episaveurs', price: 22.50, unit: 'kg', minOrder: 1, inStock: true },
    { supplierId: 'metro', price: 24.80, unit: 'kg', minOrder: 1, inStock: true },
  ]},
];

// ── Category colors ───────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Viandes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Poissons: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Fruits & Legumes': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Epicerie: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Boissons: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Surgeles: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Produits laitiers': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

// ── Helper ────────────────────────────────────────────────────────────────────

function getSupplier(id: string): Supplier {
  return SUPPLIERS.find(s => s.id === id) || { id: '', name: 'Inconnu', bio: false, local: false } as Supplier;
}

function getBestPrice(offers: SupplierOffer[]): number {
  const inStock = offers.filter(o => o.inStock);
  if (inStock.length === 0) return Infinity;
  return Math.min(...inStock.map(o => o.price));
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < full
              ? 'text-amber-400 fill-amber-400'
              : i === full && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        />
      ))}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Marketplace() {
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
    showToast('Produit ajouté au panier', 'success');
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

    // Group cart items by supplier and create one order per supplier
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
      showToast(`${successCount} commande(s) créée(s) avec succès !`, 'success');
      setCart([]);
      setCartOpen(false);
      fetchOrders();
    } else {
      showToast('Erreur lors de la création des commandes', 'error');
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
        showToast('Statut mis à jour', 'success');
        fetchOrders();
      }
    } catch {
      showToast('Erreur mise à jour', 'error');
    }
  }

  async function deleteOrder(orderId: number) {
    try {
      const res = await fetch(`/api/marketplace/orders/${orderId}`, {
        method: 'DELETE',
        headers: marketplaceHeaders(),
      });
      if (res.ok) {
        showToast('Commande supprimée', 'success');
        fetchOrders();
      }
    } catch {
      showToast('Erreur suppression', 'error');
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Store className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Marketplace Fournisseurs
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-1">
            Comparez les prix et commandez directement aupres de vos fournisseurs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowOrders(!showOrders); if (!showOrders) fetchOrders(); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <History className="w-5 h-5" />
            Commandes
            {orders.length > 0 && (
              <span className="w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Mon panier
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher un produit ou un fournisseur..."
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Tous
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort & Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix decroissant</option>
            <option value="rating">Note fournisseur</option>
            <option value="delivery">Delai livraison</option>
          </select>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtres
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <>
            <label className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showBioOnly}
                onChange={e => setShowBioOnly(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600 text-green-600 focus:ring-green-500"
              />
              <Leaf className="w-4 h-4 text-green-500" />
              Bio
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showLocalOnly}
                onChange={e => setShowLocalOnly(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <MapPin className="w-4 h-4 text-blue-500" />
              Local
            </label>
          </>
        )}

        <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
          {filteredProducts.length} produit(s)
        </span>
      </div>

      {/* Featured / Sponsored suppliers */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-3">
          Fournisseurs Partenaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumSuppliers.map(supplier => (
            <div
              key={supplier.id}
              className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-5 flex gap-4"
            >
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                <Award className="w-3 h-3" />
                Premium
              </span>
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-400">
                {supplier.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white">{supplier.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(supplier.rating)}
                  <span className="text-xs text-slate-400 dark:text-slate-400">
                    ({supplier.reviewCount} avis)
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-400 mt-1.5 line-clamp-2">
                  {supplier.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-400">
                    <Truck className="w-3.5 h-3.5" />
                    J+{supplier.deliveryDays}
                  </span>
                  {supplier.bio && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Leaf className="w-3.5 h-3.5" /> Bio
                    </span>
                  )}
                  {supplier.local && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <MapPin className="w-3.5 h-3.5" /> Local
                    </span>
                  )}
                  <button
                    onClick={() => showToast(`Contact ${supplier.name}: ${supplier.phone}`, 'info')}
                    className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: Products + Cart sidebar */}
      <div className="flex gap-6">
        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 dark:text-slate-400 font-medium">Aucun produit trouve</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProducts.map(product => {
                const bestPrice = getBestPrice(product.offers);
                const sortedOffers = [...product.offers].sort((a, b) => a.price - b.price);

                return (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product header */}
                    <div className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {product.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_COLORS[product.category] || 'bg-slate-100 text-slate-300'}`}>
                              {product.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
                            {product.description}
                          </p>
                        </div>
                        {/* Image placeholder */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                        </div>
                      </div>
                    </div>

                    {/* Supplier offers */}
                    <div className="px-4 pb-4 space-y-2">
                      <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {sortedOffers.length} offre(s) fournisseur
                      </div>
                      {sortedOffers.map(offer => {
                        const supplier = getSupplier(offer.supplierId);
                        const isBest = offer.price === bestPrice && offer.inStock;

                        return (
                          <div
                            key={offer.supplierId}
                            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                              isBest
                                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/40'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                            }`}
                          >
                            {/* Supplier info */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 dark:text-slate-300">
                              {supplier.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-slate-400 dark:text-slate-300 truncate">
                                  {supplier.name}
                                </span>
                                {isBest && (
                                  <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                    Meilleur prix
                                  </span>
                                )}
                                {supplier.premium && (
                                  <Award className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {renderStars(supplier.rating)}
                                <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                  <Clock className="w-3 h-3" /> J+{supplier.deliveryDays}
                                </span>
                                {!offer.inStock && (
                                  <span className="text-[10px] text-red-500 font-medium">Rupture</span>
                                )}
                              </div>
                            </div>
                            {/* Price & add */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="text-right">
                                <div className={`text-sm font-bold ${isBest ? 'text-green-700 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                                  {offer.price.toFixed(2)} EUR
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                                  / {offer.unit}
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(product.id, offer.supplierId, offer.price, offer.unit)}
                                disabled={!offer.inStock}
                                className={`p-2 rounded-lg transition-colors ${
                                  offer.inStock
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                }`}
                                title="Ajouter au panier"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
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

        {/* Cart sidebar - desktop */}
        {cartOpen && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Panier ({cart.length})
                </h3>
                <button onClick={() => setCartOpen(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400 dark:text-slate-500">
                  Votre panier est vide
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {Object.entries(cartBySupplier).map(([supplierId, { items, total }]) => {
                      const supplier = getSupplier(supplierId);
                      return (
                        <div key={supplierId} className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 dark:text-slate-300">
                              {supplier.logo}
                            </div>
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-300">{supplier.name}</span>
                            <span className="ml-auto text-xs font-bold text-slate-900 dark:text-white">{total.toFixed(2)} EUR</span>
                          </div>
                          {items.map(item => {
                            const product = PRODUCTS.find(p => p.id === item.productId)!;
                            return (
                              <div key={`${item.productId}-${item.supplierId}`} className="flex items-center gap-2 py-1.5">
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium text-slate-400 dark:text-slate-300 truncate">{product.name}</div>
                                  <div className="text-[10px] text-slate-400">{item.price.toFixed(2)} EUR / {item.unit}</div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => updateCartQuantity(item.productId, item.supplierId, -1)}
                                    className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-medium w-6 text-center text-slate-400 dark:text-slate-300">{item.quantity}</span>
                                  <button
                                    onClick={() => updateCartQuantity(item.productId, item.supplierId, 1)}
                                    className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.productId, item.supplierId)}
                                    className="p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 ml-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{cartTotal.toFixed(2)} EUR</span>
                    </div>
                    <button
                      onClick={submitOrder}
                      disabled={submitting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      {submitting ? 'Envoi en cours...' : 'Passer commande'}
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full py-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Vider le panier
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile cart overlay */}
      {cartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-h-[80vh] bg-white dark:bg-slate-800 rounded-t-2xl border-t border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Panier ({cart.length})
              </h3>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400 dark:text-slate-500">
                Votre panier est vide
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                  {Object.entries(cartBySupplier).map(([supplierId, { items, total }]) => {
                    const supplier = getSupplier(supplierId);
                    return (
                      <div key={supplierId} className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 dark:text-slate-300">
                            {supplier.logo}
                          </div>
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-300">{supplier.name}</span>
                          <span className="ml-auto text-xs font-bold text-slate-900 dark:text-white">{total.toFixed(2)} EUR</span>
                        </div>
                        {items.map(item => {
                          const product = PRODUCTS.find(p => p.id === item.productId)!;
                          return (
                            <div key={`${item.productId}-${item.supplierId}`} className="flex items-center gap-2 py-1.5">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-400 dark:text-slate-300 truncate">{product.name}</div>
                                <div className="text-[10px] text-slate-400">{item.price.toFixed(2)} EUR / {item.unit}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateCartQuantity(item.productId, item.supplierId, -1)}
                                  className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-medium w-6 text-center text-slate-400 dark:text-slate-300">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.productId, item.supplierId, 1)}
                                  className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.productId, item.supplierId)}
                                  className="p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 ml-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{cartTotal.toFixed(2)} EUR</span>
                  </div>
                  <button
                    onClick={submitOrder}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    Passer commande
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Order history */}
      {showOrders && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Historique des commandes
            </h2>
            <button onClick={() => setShowOrders(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {ordersLoading ? (
            <div className="p-8 text-center text-sm text-slate-400">Chargement...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {orders.map(order => (
                <div key={order.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {order.supplierName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'draft' ? 'bg-slate-100 text-slate-300 dark:bg-slate-700 dark:text-slate-300' :
                        order.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        order.status === 'confirmed' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {order.status === 'draft' ? 'Brouillon' :
                         order.status === 'sent' ? 'Envoyée' :
                         order.status === 'confirmed' ? 'Confirmée' : 'Reçue'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {order.totalHT.toFixed(2)} EUR
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="text-xs text-slate-400 dark:text-slate-400 mb-2">
                    {order.items.map((item, idx) => (
                      <span key={item.id}>
                        {item.quantity}x {item.productName}
                        {idx < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {order.status === 'draft' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'sent')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        <Send className="w-3 h-3" /> Envoyer
                      </button>
                    )}
                    {order.status === 'sent' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" /> Confirmer
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'received')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" /> Reçue
                      </button>
                    )}
                    {order.status === 'draft' && (
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
