import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useCallback } from 'react';
import {
  Newspaper, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, RefreshCw, X,
  Clock, ChevronRight, ArrowRight, CalendarDays, Sparkles, Rocket, Star,
  ChevronDown, ChevronUp, Mail, Check, Bell, Zap, Gift, Tag, BookOpen,
  MessageCircle, Megaphone, ExternalLink, Globe, BarChart3, Loader2,
  Minus, ChefHat, Utensils, Sprout
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

// ── Types ───────────────────────────────────────────────────────────────────

interface NewsItem {
  id: number;
  title: string;
  content: string;
  type: 'price_alert' | 'opportunity' | 'trend' | 'tip';
  priority: 'high' | 'normal' | 'low';
  dismissed: boolean;
  mercurialeRef: string | null;
  createdAt: string;
}

type UpdateCategory = 'all' | 'product' | 'feature' | 'tip' | 'news';

interface ProductUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  category: UpdateCategory;
  icon: typeof Rocket;
  iconColor: string;
  iconBg: string;
  isFeatured?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: 'added' | 'improved' | 'fixed'; text: string }[];
}

// ── Config ──────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (restaurantId) headers['X-Restaurant-Id'] = restaurantId;
  return headers;
}

const TYPE_CONFIG = {
  price_alert: {
    label: 'Alerte prix',
    icon: AlertTriangle,
    bg: 'bg-red-500/10 border-red-500/30',
    badge: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    icon_color: 'text-red-500',
  },
  opportunity: {
    label: 'Opportunite',
    icon: TrendingDown,
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    icon_color: 'text-emerald-500',
  },
  trend: {
    label: 'Tendance',
    icon: TrendingUp,
    bg: 'bg-teal-500/10 border-teal-500/30',
    badge: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    icon_color: 'text-teal-500',
  },
  tip: {
    label: 'Conseil',
    icon: Lightbulb,
    bg: 'bg-amber-500/10 border-amber-500/30',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    icon_color: 'text-amber-500',
  },
};

const PRIORITY_CONFIG = {
  high: { label: 'Urgent', class: 'bg-red-600 text-white' },
  normal: { label: 'Cette semaine', class: 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400' },
  low: { label: 'Info', class: 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-500' },
};

interface MercurialeSummary {
  title: string;
  week_date: string;
  topHausses: { ingredient_name: string; trend_detail: string | null }[];
  topBaisses: { ingredient_name: string; trend_detail: string | null }[];
}

interface MarketIntelArticle {
  title: string;
  url: string;
  snippet: string;
}

interface MarketIntelData {
  articles: number;
  answer?: string;
  results: MarketIntelArticle[];
  timestamp: string;
  error?: string;
}

interface IngredientTrend {
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
}

// ── Daily Digest types ───────────────────────────────────────────────────────

interface DigestCommodity {
  name: string;
  trend: 'up' | 'down' | 'stable';
  changePct: number;
  price: number;
  unit: string;
  note: string;
}

interface DigestNews {
  title: string;
  impact: string;
  severity: 'high' | 'medium' | 'low';
  source: string;
}

interface DigestRecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  supplier: string;
}

interface DigestRecipe {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  portions: number;
  prep_time: number;
  cook_time: number;
  chef_tip: string;
  steps: string[];
  ingredients: DigestRecipeIngredient[];
  cost_per_portion: number;
  suggested_price: number;
  margin_percent: number;
  image_url: string;
}

interface DigestSource {
  title: string;
  url: string;
}

type DigestSeasonalStatus = 'peak' | 'starting' | 'ending';

interface DigestSeasonal {
  name: string;
  category: string;
  status: DigestSeasonalStatus;
  note: string;
}

interface DailyDigest {
  digest_date: string;
  commodity_prices: DigestCommodity[];
  market_summary: string;
  news: DigestNews[];
  recipe: DigestRecipe | null;
  insight: string;
  sources: DigestSource[];
  seasonal?: DigestSeasonal[];
  created_at: string;
}

interface DigestArchiveEntry {
  digest_date: string;
  market_summary: string;
  recipe_title: string;
  commodity_count: number;
  news_count: number;
}

const DIGEST_TREND: Record<'up' | 'down' | 'stable', { icon: typeof TrendingUp; text: string; bg: string }> = {
  up:     { icon: TrendingUp,   text: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950/30' },
  down:   { icon: TrendingDown, text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  stable: { icon: Minus,        text: 'text-[#737373] dark:text-[#A3A3A3]',     bg: 'bg-[#F5F5F5] dark:bg-[#1A1A1A]' },
};

const DIGEST_SEVERITY: Record<'high' | 'medium' | 'low', string> = {
  high:   'bg-red-500',
  medium: 'bg-amber-500',
  low:    'bg-[#A3A3A3]',
};

// Fallback neutre si le backend renvoie un statut inconnu / absent
const DIGEST_SEASON_FALLBACK: { label: string; text: string; bg: string } = {
  label: 'De saison',
  text: 'text-[#737373] dark:text-[#A3A3A3]',
  bg: 'bg-[#F5F5F5] dark:bg-[#1A1A1A]',
};

const DIGEST_SEASON_STATUS: Record<DigestSeasonalStatus, { label: string; text: string; bg: string }> = {
  peak:     { label: 'Pleine saison',  text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  starting: { label: 'Debut de saison', text: 'text-teal-700 dark:text-teal-400',      bg: 'bg-teal-50 dark:bg-teal-950/30' },
  ending:   { label: 'Fin de saison',   text: 'text-amber-700 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-950/30' },
};

// ── Product Updates (RestauMargin changelog — static, our own content) ──────

const PRODUCT_UPDATES: ProductUpdate[] = [
  {
    id: 'pu1',
    title: 'Nouveau : IA de prevision des commandes',
    description: 'Notre algorithme analyse vos historiques de vente, la meteo et les evenements locaux pour predire vos besoins en ingredients. Reduisez le gaspillage de 30% en moyenne.',
    date: '8 avr. 2026',
    category: 'feature',
    icon: Sparkles,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    isFeatured: true,
    badge: 'Nouveau',
    badgeColor: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400',
  },
  {
    id: 'pu2',
    title: 'Export Excel ameliore avec graphiques',
    description: 'Les exports incluent maintenant des graphiques de tendances et des tableaux croises dynamiques pre-configures pour votre comptable.',
    date: '5 avr. 2026',
    category: 'product',
    icon: Rocket,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    badge: 'Amelioration',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  },
  {
    id: 'pu3',
    title: 'Astuce : Optimisez vos fiches techniques en 5 min',
    description: 'Decouvrez comment utiliser l\'assistant IA pour verifier et corriger automatiquement les grammages de vos recettes.',
    date: '3 avr. 2026',
    category: 'tip',
    icon: Lightbulb,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    id: 'pu4',
    title: 'Integration Stripe pour les paiements',
    description: 'Acceptez les paiements en ligne directement depuis RestauMargin. Gestion des abonnements et facturation automatique.',
    date: '1er avr. 2026',
    category: 'feature',
    icon: Zap,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  {
    id: 'pu5',
    title: 'La restauration face a l\'inflation : nos conseils',
    description: 'Analyse du marche Q1 2026 : quels ingredients augmentent, lesquels baissent, et comment adapter vos menus pour proteger vos marges.',
    date: '28 mars 2026',
    category: 'news',
    icon: Megaphone,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-900/30',
  },
  {
    id: 'pu6',
    title: 'Nouveau dashboard mobile responsive',
    description: 'L\'ensemble du tableau de bord est maintenant parfaitement optimise pour tablette et smartphone. Gerez votre restaurant en mobilite.',
    date: '25 mars 2026',
    category: 'product',
    icon: Star,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
  },
];

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '2.4.0',
    date: '8 avr. 2026',
    changes: [
      { type: 'added', text: 'Prevision IA des commandes avec analyse meteo' },
      { type: 'added', text: 'Widget mercuriale sur le dashboard' },
      { type: 'improved', text: 'Performance des exports Excel (+40% plus rapide)' },
      { type: 'fixed', text: 'Correction du calcul de marge sur les menus composes' },
    ],
  },
  {
    version: '2.3.2',
    date: '1er avr. 2026',
    changes: [
      { type: 'added', text: 'Integration Stripe pour les paiements' },
      { type: 'improved', text: 'Nouveau design de la page Integrations' },
      { type: 'fixed', text: 'Bug d\'affichage des graphiques sur mobile' },
    ],
  },
  {
    version: '2.3.1',
    date: '25 mars 2026',
    changes: [
      { type: 'added', text: 'Dashboard mobile responsive' },
      { type: 'improved', text: 'Temps de chargement du tableau de bord (-50%)' },
      { type: 'fixed', text: 'Correction de la synchronisation mercuriale' },
      { type: 'fixed', text: 'Resolution du probleme de connexion Bluetooth' },
    ],
  },
  {
    version: '2.3.0',
    date: '15 mars 2026',
    changes: [
      { type: 'added', text: 'Systeme de commande vocale avec IA' },
      { type: 'added', text: 'Page Actualites et veille marche' },
      { type: 'improved', text: 'Refonte de la navigation sidebar' },
    ],
  },
];

const CHANGE_TYPE_CONFIG = {
  added: { label: 'Ajout', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  improved: { label: 'Amelioration', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  fixed: { label: 'Correction', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
};

const UPDATE_TABS: { key: UpdateCategory; label: string; icon: typeof Newspaper }[] = [
  { key: 'all', label: 'Tout', icon: Newspaper },
  { key: 'product', label: 'Produit', icon: Rocket },
  { key: 'feature', label: 'Fonctionnalites', icon: Zap },
  { key: 'tip', label: 'Astuces', icon: Lightbulb },
  { key: 'news', label: 'Actualites', icon: Megaphone },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Actualites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast: addToast } = useToast();

  // Market news state (from API)
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeNewsFilter, setActiveNewsFilter] = useState<string>('all');
  const [mercurialeSummary, setMercurialeSummary] = useState<MercurialeSummary | null>(null);

  // Market intel state (from Tavily / cron endpoint)
  const [marketIntel, setMarketIntel] = useState<MarketIntelData | null>(null);
  const [marketIntelLoading, setMarketIntelLoading] = useState(false);
  const [ingredientTrends, setIngredientTrends] = useState<IngredientTrend[]>([]);

  // Product updates state
  const [activeUpdateCategory, setActiveUpdateCategory] = useState<UpdateCategory>('all');
  const [changelogExpanded, setChangelogExpanded] = useState(false);
  const [expandedChangelog, setExpandedChangelog] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Daily digest state
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [digestLoading, setDigestLoading] = useState(true);
  const [digestArchive, setDigestArchive] = useState<DigestArchiveEntry[]>([]);
  const [digestSelectedDate, setDigestSelectedDate] = useState<string>('today');

  // ── Data Fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/mercuriale/latest')
      .then(r => r.json())
      .then(data => {
        if (data.publication && data.prices?.length) {
          const prices = data.prices as { ingredient_name: string; trend: string; trend_detail: string | null }[];
          const hausses = prices.filter((p: any) => p.trend === 'hausse').slice(0, 3);
          const baisses = prices.filter((p: any) => p.trend === 'baisse').slice(0, 3);
          setMercurialeSummary({
            title: data.publication.title,
            week_date: data.publication.week_date,
            topHausses: hausses.map((h: any) => ({ ingredient_name: h.ingredient_name, trend_detail: h.trend_detail })),
            topBaisses: baisses.map((b: any) => ({ ingredient_name: b.ingredient_name, trend_detail: b.trend_detail })),
          });
        }
      })
      .catch(() => {});
  }, []);

  // ── Daily Digest ──────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        setDigestLoading(true);
        const res = await fetch('/api/daily-digest/latest', { headers: authHeaders() });
        const data = res.ok ? await res.json() : null;
        setDigest(data ?? null);
      } catch {
        setDigest(null);
      } finally {
        setDigestLoading(false);
      }
    })();

    fetch('/api/daily-digest/archive?limit=30', { headers: authHeaders() })
      .then(r => (r.ok ? r.json() : []))
      .then(data => setDigestArchive(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function loadDigestForDate(value: string) {
    setDigestSelectedDate(value);
    setDigestLoading(true);
    try {
      const url = value === 'today' ? '/api/daily-digest/latest' : `/api/daily-digest/${value}`;
      const res = await fetch(url, { headers: authHeaders() });
      const data = res.ok ? await res.json() : null;
      setDigest(data ?? null);
    } catch {
      setDigest(null);
    } finally {
      setDigestLoading(false);
    }
  }

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news', { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur reseau');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch {
      addToast('Impossible de charger les actualites', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/news/generate', {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Erreur lors de la generation', 'error');
        return;
      }
      setNews(Array.isArray(data.items) ? data.items : []);
      addToast(`${data.count} actualites mises a jour`, 'success');
    } catch {
      addToast('Erreur lors de la mise a jour', 'error');
    } finally {
      setGenerating(false);
    }
  }

  async function handleDismiss(id: number) {
    try {
      const res = await fetch(`/api/news/${id}/dismiss`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setNews(prev => prev.filter(n => n.id !== id));
    } catch {
      addToast('Impossible de masquer cette actualite', 'error');
    }
  }

  const handleNewsletterSubscribe = () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Veuillez saisir un email valide', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    addToast('Inscription a la newsletter confirmee', 'success');
  };

  // ── Market Intelligence (Tavily) ──────────────────────────────────────────

  async function fetchMarketIntel() {
    setMarketIntelLoading(true);
    try {
      const res = await fetch('/api/cron/market-intel', {
        headers: { ...authHeaders(), Authorization: `Bearer ${(import.meta as any).env?.VITE_CRON_SECRET || 'cron-secret'}` },
      });
      const data = await res.json();
      if (data.error) {
        addToast('Erreur lors du chargement des donnees marche', 'error');
      } else {
        setMarketIntel(data);
        addToast(`${data.articles || 0} articles de marche charges`, 'success');
      }
    } catch {
      addToast('Impossible de charger les donnees marche', 'error');
    } finally {
      setMarketIntelLoading(false);
    }
  }

  // ── Ingredient Trends (computed from real data) ──────────────────────────

  useEffect(() => {
    async function loadIngredientTrends() {
      try {
        const res = await fetch('/api/ingredients', { headers: authHeaders() });
        if (!res.ok) return;
        const ingredients = await res.json();
        if (!Array.isArray(ingredients)) return;

        const trends: IngredientTrend[] = ingredients
          .filter((ing: any) => ing.pricePerUnit > 0 && ing.previousPrice && ing.previousPrice > 0)
          .map((ing: any) => {
            const change = ing.pricePerUnit - ing.previousPrice;
            const changePercent = (change / ing.previousPrice) * 100;
            return {
              name: ing.name,
              category: ing.category || 'Autre',
              currentPrice: ing.pricePerUnit,
              previousPrice: ing.previousPrice,
              change,
              changePercent,
              unit: ing.unit || 'kg',
            };
          })
          .sort((a: IngredientTrend, b: IngredientTrend) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
          .slice(0, 10);

        setIngredientTrends(trends);
      } catch {}
    }
    loadIngredientTrends();
  }, []);

  // ── Computed ──────────────────────────────────────────────────────────────

  const filteredNews = activeNewsFilter === 'all' ? news : news.filter(n => n.type === activeNewsFilter);
  const highCount = news.filter(n => n.priority === 'high').length;
  const latestMercurialeRef = news.find(n => n.mercurialeRef)?.mercurialeRef;

  const filteredUpdates = activeUpdateCategory === 'all'
    ? PRODUCT_UPDATES
    : PRODUCT_UPDATES.filter(u => u.category === activeUpdateCategory);
  const featuredUpdate = PRODUCT_UPDATES.find(u => u.isFeatured);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <Newspaper className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-2xl font-bold font-satoshi text-mono-100 dark:text-white">Actualites</h1>
            {highCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                {highCount} urgent{highCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm ml-14">
            Veille marche, mises a jour produit & recommandations
            {latestMercurialeRef && (
              <span className="ml-2 text-gray-400 dark:text-gray-500">
                -- Mercuriale du {latestMercurialeRef}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-60 text-white dark:text-black rounded-xl font-medium transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Analyse en cours...' : 'Actualiser'}
        </button>
      </div>

      {/* ── Digest du jour (contenu vedette quotidien) ─────────────────────── */}
      <section className="space-y-5">
        {/* En-tete + selecteur d'archive */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-satoshi text-black dark:text-white">Digest du jour</h2>
              {digest && (
                <p className="text-sm text-[#737373] dark:text-[#A3A3A3] first-letter:uppercase">
                  {new Date(digest.digest_date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              )}
            </div>
          </div>
          {digestArchive.length > 0 && (
            <div className="flex items-center gap-2">
              {digestSelectedDate !== 'today' && (
                <button
                  onClick={() => loadDigestForDate('today')}
                  className="min-h-[40px] px-3 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:opacity-90 transition-opacity"
                >
                  Aujourd'hui
                </button>
              )}
              <select
                value={digestSelectedDate}
                onChange={e => loadDigestForDate(e.target.value)}
                className="min-h-[40px] px-3 rounded-xl text-sm border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-black dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="today">Aujourd'hui</option>
                {digestArchive.map(a => (
                  <option key={a.digest_date} value={a.digest_date}>
                    {new Date(a.digest_date + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Corps : loading / vide / charge */}
        {digestLoading ? (
          <div className="space-y-4">
            <div className="h-24 rounded-2xl bg-[#F5F5F5] dark:bg-[#1A1A1A] animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="h-24 rounded-2xl bg-[#F5F5F5] dark:bg-[#1A1A1A] animate-pulse" />
              <div className="h-24 rounded-2xl bg-[#F5F5F5] dark:bg-[#1A1A1A] animate-pulse" />
              <div className="h-24 rounded-2xl bg-[#F5F5F5] dark:bg-[#1A1A1A] animate-pulse" />
            </div>
          </div>
        ) : !digest ? (
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8 text-center">
            <Clock className="w-10 h-10 text-teal-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-black dark:text-white mb-1">Le digest du jour est en preparation</p>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Revenez a 8h pour decouvrir les cours des denrees, la recette etoilee et les actualites du jour.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Synthese marche */}
            {digest.market_summary && (
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-bold text-black dark:text-white">Synthese marche</h3>
                </div>
                <p className="text-sm text-[#374151] dark:text-[#D4D4D4] leading-relaxed">{digest.market_summary}</p>
              </div>
            )}

            {/* Cours des denrees */}
            {(digest.commodity_prices?.length ?? 0) > 0 && (
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white mb-3">Cours des denrees</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {digest.commodity_prices.map((c, i) => {
                    const conf = DIGEST_TREND[c.trend] || DIGEST_TREND.stable;
                    const TrendIcon = conf.icon;
                    return (
                      <div
                        key={`${c.name}-${i}`}
                        className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-black dark:text-white">{c.name}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${conf.bg} ${conf.text}`}>
                            <TrendIcon className="w-3 h-3" />
                            {c.changePct > 0 ? '+' : ''}{c.changePct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-base font-bold text-black dark:text-white">
                          {formatCurrency(c.price)}
                          <span className="text-xs font-normal text-[#737373] dark:text-[#A3A3A3]"> /{c.unit}</span>
                        </div>
                        {c.note && (
                          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1 leading-snug">{c.note}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Produits de saison */}
            {(digest.seasonal?.length ?? 0) > 0 && (
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white mb-3 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  Produits de saison
                </h3>
                <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {digest.seasonal?.map((s, i) => {
                      const conf = DIGEST_SEASON_STATUS[s.status] || DIGEST_SEASON_FALLBACK;
                      return (
                        <div
                          key={`${s.name}-${i}`}
                          title={s.note || undefined}
                          className={`min-w-0 max-w-full rounded-xl px-3 py-2 ${conf.bg}`}
                        >
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-sm font-bold text-black dark:text-white break-words">{s.name}</span>
                            <span className={`text-[11px] font-semibold whitespace-nowrap ${conf.text}`}>{conf.label}</span>
                          </div>
                          {(s.category || s.note) && (
                            <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-0.5 leading-snug break-words">
                              {s.category}
                              {s.category && s.note ? ' · ' : ''}
                              {s.note}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Recette etoilee du jour */}
            {digest.recipe && (
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
                {digest.recipe.image_url && (
                  <img
                    src={digest.recipe.image_url}
                    alt={digest.recipe.title}
                    loading="lazy"
                    className="w-full h-48 object-cover rounded-t-2xl"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ChefHat className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-teal-600 dark:text-teal-400">
                      Recette etoilee du jour
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">{digest.recipe.title}</h3>
                  <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mb-3 leading-relaxed">{digest.recipe.description}</p>

                  {/* Badges meta */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      digest.recipe.category,
                      digest.recipe.difficulty,
                      `${digest.recipe.portions} pers`,
                      `${digest.recipe.prep_time + digest.recipe.cook_time} min`,
                    ].map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D4D4D4]"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Badges chiffres */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A] p-3 text-center">
                      <div className="text-base font-bold text-black dark:text-white">{formatCurrency(digest.recipe.cost_per_portion)}</div>
                      <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mt-0.5">Cout / portion</div>
                    </div>
                    <div className="rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A] p-3 text-center">
                      <div className="text-base font-bold text-black dark:text-white">{formatCurrency(digest.recipe.suggested_price)}</div>
                      <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mt-0.5">Prix conseille</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{digest.recipe.margin_percent}%</div>
                      <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] mt-0.5">Marge</div>
                    </div>
                  </div>

                  {/* Ingredients + etapes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(digest.recipe.ingredients?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-black dark:text-white mb-2 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Ingredients
                        </h4>
                        <ul className="space-y-1.5">
                          {digest.recipe.ingredients.map((ing, i) => (
                            <li key={`${ing.name}-${i}`} className="flex items-baseline justify-between gap-2 text-sm">
                              <span className="text-black dark:text-white">{ing.name}</span>
                              <span className="text-xs text-[#737373] dark:text-[#A3A3A3] whitespace-nowrap">
                                {ing.quantity} {ing.unit} · {formatCurrency(ing.pricePerUnit)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(digest.recipe.steps?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-black dark:text-white mb-2">Preparation</h4>
                        <ol className="space-y-1.5 list-decimal list-inside">
                          {digest.recipe.steps.map((s, i) => (
                            <li key={i} className="text-sm text-[#374151] dark:text-[#D4D4D4] leading-relaxed">{s}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  {/* Astuce du chef */}
                  {digest.recipe.chef_tip && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 p-3">
                      <Lightbulb className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-teal-700 dark:text-teal-300 mb-0.5">Astuce du chef</div>
                        <p className="text-xs text-[#374151] dark:text-[#D4D4D4] leading-relaxed">{digest.recipe.chef_tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actualites qui impactent les aliments */}
            {(digest.news?.length ?? 0) > 0 && (
              <div>
                <h3 className="text-sm font-bold text-black dark:text-white mb-3">Actualites qui impactent les aliments</h3>
                <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {digest.news.map((n, i) => (
                    <div key={`${n.title}-${i}`} className="flex items-start gap-3 p-4">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${DIGEST_SEVERITY[n.severity] || DIGEST_SEVERITY.low}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black dark:text-white">{n.title}</p>
                        {n.impact && <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5 leading-relaxed">{n.impact}</p>}
                        {n.source && <p className="text-[11px] text-[#A3A3A3] dark:text-[#737373] mt-1">{n.source}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insight du jour */}
            {digest.insight && (
              <div className="flex items-start gap-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 p-4">
                <Lightbulb className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-teal-700 dark:text-teal-300 mb-0.5">Insight du jour</div>
                  <p className="text-sm text-[#374151] dark:text-[#D4D4D4] leading-relaxed">{digest.insight}</p>
                </div>
              </div>
            )}

            {/* Sources */}
            {(digest.sources?.length ?? 0) > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[11px] font-medium text-[#737373] dark:text-[#A3A3A3]">Sources :</span>
                {digest.sources.map((s, i) => (
                  <a
                    key={`${s.url}-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Featured Update Hero Card ──────────────────────────────────────── */}
      {featuredUpdate && (
        <div className="relative bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200 dark:border-violet-800/50 rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/20 dark:bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-200 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                <Sparkles className="w-3 h-3" /> Mise a jour majeure
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{featuredUpdate.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-3 max-w-xl">
              {featuredUpdate.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-2xl mb-5">
              {featuredUpdate.description}
            </p>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors">
              Decouvrir <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Product Updates Timeline ───────────────────────────────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Mises a jour produit
          </h2>
          <div className="flex flex-wrap gap-2">
            {UPDATE_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveUpdateCategory(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeUpdateCategory === tab.key
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

          <div className="space-y-4">
            {filteredUpdates.filter(u => !u.isFeatured).map(update => {
              const Icon = update.icon;
              return (
                <div key={update.id} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 ${update.iconBg}`}>
                      <Icon className={`w-4.5 h-4.5 ${update.iconColor}`} />
                    </div>
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 sm:hidden">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${update.iconBg}`}>
                          <Icon className={`w-4 h-4 ${update.iconColor}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {update.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${update.badgeColor || 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'}`}>
                              {update.badge}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {update.date}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-black dark:text-white leading-snug">{update.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{update.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Market News Filters ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Veille marche
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {[
            { key: 'all', label: 'Tout', count: news.length },
            { key: 'price_alert', label: 'Alertes prix', count: news.filter(n => n.type === 'price_alert').length },
            { key: 'opportunity', label: 'Opportunites', count: news.filter(n => n.type === 'opportunity').length },
            { key: 'trend', label: 'Tendances', count: news.filter(n => n.type === 'trend').length },
            { key: 'tip', label: 'Conseils', count: news.filter(n => n.type === 'tip').length },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setActiveNewsFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeNewsFilter === f.key
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              {f.label}
              {f.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeNewsFilter === f.key ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mercuriale Summary Widget */}
        {mercurialeSummary && (
          <div className="bg-white dark:bg-black border border-teal-200 dark:border-teal-800/50 rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-black dark:text-white font-bold text-sm">Mercuriale de la semaine</h3>
              </div>
              <button
                onClick={() => navigate('/mercuriale')}
                className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
              >
                Voir la mercuriale complete
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mercurialeSummary.topHausses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Top hausses
                  </div>
                  {mercurialeSummary.topHausses.map((h, i) => (
                    <div key={i} className="flex items-center justify-between bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl px-3 py-2">
                      <span className="text-sm text-black dark:text-white">{h.ingredient_name}</span>
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">{h.trend_detail || 'Hausse'}</span>
                    </div>
                  ))}
                </div>
              )}
              {mercurialeSummary.topBaisses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Top baisses
                  </div>
                  {mercurialeSummary.topBaisses.map((b, i) => (
                    <div key={i} className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl px-3 py-2">
                      <span className="text-sm text-black dark:text-white">{b.ingredient_name}</span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{b.trend_detail || 'Baisse'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* News Cards */}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Chargement...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl">
            <Newspaper className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">Aucune actualite disponible</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
              Cliquez sur "Actualiser" pour charger les dernieres recommandations
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-60 text-white dark:text-black rounded-xl text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser maintenant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredNews.map(item => {
              const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.tip;
              const Icon = typeConf.icon;
              const priorityConf = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.normal;

              return (
                <div
                  key={item.id}
                  className={`relative bg-white dark:bg-black border rounded-2xl p-5 hover:shadow-md transition-all group ${typeConf.bg}`}
                >
                  {/* Dismiss button */}
                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                    title="Masquer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Type + Priority badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${typeConf.badge}`}>
                      <Icon className="w-3 h-3" />
                      {typeConf.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${priorityConf.class}`}>
                      {priorityConf.label}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-black dark:text-white font-semibold text-sm mb-2 pr-6 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {item.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      {item.mercurialeRef && ` -- Mercuriale ${item.mercurialeRef}`}
                    </span>
                    <span className="ml-auto text-[11px] text-gray-400 dark:text-gray-500">
                      Veille sectorielle
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Market Intelligence (Tavily AI) ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Actualites du marche
          </h2>
          <button
            onClick={fetchMarketIntel}
            disabled={marketIntelLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {marketIntelLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Rafraichir les actualites
          </button>
        </div>

        {marketIntel ? (
          <div className="space-y-4">
            {/* AI Summary */}
            {marketIntel.answer && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-black dark:text-white">Resume IA du marche</h3>
                </div>
                <p className="text-sm text-[#374151] dark:text-mono-800 leading-relaxed">
                  {marketIntel.answer}
                </p>
                <p className="text-[10px] text-[#9CA3AF] mt-3">
                  Genere le {new Date(marketIntel.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            {/* Articles */}
            {marketIntel.results && marketIntel.results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketIntel.results.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-black border border-mono-900 dark:border-mono-200 rounded-2xl p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                  >
                    <h4 className="text-sm font-semibold text-black dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-mono-500 dark:text-mono-700 leading-relaxed line-clamp-3 mb-3">
                      {article.snippet}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      <ExternalLink className="w-3 h-3" />
                      Lire l'article
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-200 rounded-2xl p-8 text-center">
            <Globe className="w-10 h-10 text-[#D1D5DB] dark:text-[#333] mx-auto mb-3" />
            <p className="text-sm text-mono-500 dark:text-mono-700 mb-1">Aucune donnee marche disponible</p>
            <p className="text-xs text-[#9CA3AF] dark:text-mono-500">
              Cliquez sur "Rafraichir les actualites" pour charger les dernieres tendances du marche
            </p>
          </div>
        )}
      </section>

      {/* ── Tendances des prix ingredients ─────────────────────────────────── */}
      {ingredientTrends.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Tendances de vos ingredients
          </h2>
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mono-900 dark:border-mono-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-mono-500 dark:text-mono-700">Ingredient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-mono-500 dark:text-mono-700">Categorie</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-mono-500 dark:text-mono-700">Prix actuel</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-mono-500 dark:text-mono-700">Prix precedent</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-mono-500 dark:text-mono-700">Evolution</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientTrends.map((trend, i) => (
                    <tr key={i} className="border-b border-mono-900/50 dark:border-mono-200/50 last:border-0 hover:bg-mono-1000 dark:hover:bg-mono-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-black dark:text-white">{trend.name}</td>
                      <td className="px-4 py-3 text-mono-500 dark:text-mono-700">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-mono-975 dark:bg-mono-200 text-mono-500 dark:text-mono-700">
                          {trend.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-black dark:text-white">
                        {formatCurrency(trend.currentPrice)}/{trend.unit}
                      </td>
                      <td className="px-4 py-3 text-right text-mono-500 dark:text-mono-700">
                        {formatCurrency(trend.previousPrice)}/{trend.unit}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          trend.change > 0
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {trend.change > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {trend.change > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Expandable Changelog ───────────────────────────────────────────── */}
      <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setChangelogExpanded(!changelogExpanded)}
          className="w-full p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-black dark:text-white text-sm">Changelog</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Historique complet des mises a jour</p>
            </div>
          </div>
          {changelogExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {changelogExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            {CHANGELOG.map(entry => {
              const isExpanded = expandedChangelog === entry.version;
              return (
                <div key={entry.version} className="border-b border-gray-100 dark:border-gray-800/50 last:border-0">
                  <button
                    onClick={() => setExpandedChangelog(isExpanded ? null : entry.version)}
                    className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-mono">
                        v{entry.version}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{entry.changes.length} changements</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 space-y-2">
                      {entry.changes.map((change, idx) => {
                        const conf = CHANGE_TYPE_CONFIG[change.type];
                        return (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className={`flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${conf.bg} ${conf.color}`}>
                              {conf.label}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{change.text}</span>
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
      </section>

      {/* ── Newsletter Signup ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 border border-teal-200 dark:border-teal-800/50 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-black dark:text-white">Newsletter RestauMargin</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recevez chaque semaine les tendances marche, les nouvelles fonctionnalites et des conseils pour optimiser vos marges.
            </p>
          </div>
          {newsletterSubscribed ? (
            <div className="flex items-center gap-2 px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Inscrit</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full sm:w-64"
              />
              <button
                onClick={handleNewsletterSubscribe}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors whitespace-nowrap"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Explanation ────────────────────────────────────────────────────── */}
      {news.length > 0 && (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex-shrink-0">
              <Newspaper className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h4 className="text-black dark:text-white text-sm font-semibold mb-1">Comment fonctionne cette section ?</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                Les actualites sont basees sur la <strong className="text-gray-700 dark:text-gray-300">mercuriale des prix fournisseurs</strong> (Metro, Transgourmet, Rungis)
                croisee avec <strong className="text-gray-700 dark:text-gray-300">vos ingredients et fiches techniques</strong> pour vous proposer
                des recommandations personnalisees : alertes de hausse, opportunites d'economies, et conseils pour proteger vos marges.
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-red-500" /> Alertes prix : hausses &gt;5% impactant vos recettes</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-emerald-500" /> Opportunites : produits en baisse ou alternatives</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-teal-500" /> Tendances : evolutions du marche a surveiller</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
