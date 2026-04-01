import { useState, useEffect, useCallback } from 'react';
import { Newspaper, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, RefreshCw, X, Clock, ChevronRight, ArrowRight, CalendarDays } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

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
    badge: 'bg-red-500/20 text-red-400',
    icon_color: 'text-red-400',
  },
  opportunity: {
    label: 'Opportunité',
    icon: TrendingDown,
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-400',
    icon_color: 'text-emerald-400',
  },
  trend: {
    label: 'Tendance',
    icon: TrendingUp,
    bg: 'bg-blue-500/10 border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-400',
    icon_color: 'text-blue-400',
  },
  tip: {
    label: 'Conseil',
    icon: Lightbulb,
    bg: 'bg-amber-500/10 border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-400',
    icon_color: 'text-amber-400',
  },
};

const PRIORITY_CONFIG = {
  high: { label: 'Urgent', class: 'bg-red-600 text-white' },
  normal: { label: 'Cette semaine', class: 'bg-slate-600 text-slate-300' },
  low: { label: 'Info', class: 'bg-slate-700 text-slate-400' },
};

interface MercurialeSummary {
  title: string;
  week_date: string;
  topHausses: { ingredient_name: string; trend_detail: string | null }[];
  topBaisses: { ingredient_name: string; trend_detail: string | null }[];
}

export default function Actualites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast: addToast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [mercurialeSummary, setMercurialeSummary] = useState<MercurialeSummary | null>(null);

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

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news', { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch {
      addToast('Impossible de charger les actualités', 'error');
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
        addToast(data.error || 'Erreur lors de la génération', 'error');
        return;
      }
      setNews(Array.isArray(data.items) ? data.items : []);
      addToast(`${data.count} actualités mises à jour`, 'success');
    } catch {
      addToast('Erreur lors de la mise à jour', 'error');
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
      addToast('Impossible de masquer cette actualité', 'error');
    }
  }

  const filtered = activeFilter === 'all' ? news : news.filter(n => n.type === activeFilter);
  const highCount = news.filter(n => n.priority === 'high').length;

  const latestMercurialeRef = news.find(n => n.mercurialeRef)?.mercurialeRef;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Actualités</h1>
            {highCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                {highCount} urgent{highCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">
            Veille marché & recommandations personnalisées
            {latestMercurialeRef && (
              <span className="ml-2 text-slate-400">
                — Mercuriale du {latestMercurialeRef}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-medium transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Analyse en cours...' : 'Actualiser'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Tout', count: news.length },
          { key: 'price_alert', label: 'Alertes prix', count: news.filter(n => n.type === 'price_alert').length },
          { key: 'opportunity', label: 'Opportunités', count: news.filter(n => n.type === 'opportunity').length },
          { key: 'trend', label: 'Tendances', count: news.filter(n => n.type === 'trend').length },
          { key: 'tip', label: 'Conseils', count: news.filter(n => n.type === 'tip').length },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeFilter === f.key ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mercuriale Summary Widget */}
      {mercurialeSummary && (
        <div className="bg-slate-900/60 border border-blue-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-bold">Mercuriale de la semaine</h2>
            </div>
            <button
              onClick={() => navigate('/mercuriale')}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Voir la mercuriale compl&egrave;te
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top hausses */}
            {mercurialeSummary.topHausses.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Top hausses
                </div>
                {mercurialeSummary.topHausses.map((h, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                    <span className="text-sm text-white">{h.ingredient_name}</span>
                    <span className="text-xs font-semibold text-red-400">{h.trend_detail || 'Hausse'}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Top baisses */}
            {mercurialeSummary.topBaisses.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Top baisses
                </div>
                {mercurialeSummary.topBaisses.map((b, i) => (
                  <div key={i} className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                    <span className="text-sm text-white">{b.ingredient_name}</span>
                    <span className="text-xs font-semibold text-emerald-400">{b.trend_detail || 'Baisse'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Newspaper className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-400 font-medium mb-2">Aucune actualité disponible</p>
          <p className="text-slate-400 text-sm mb-4">
            Cliquez sur "Actualiser" pour charger les dernières recommandations
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(item => {
            const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.tip;
            const Icon = typeConf.icon;
            const priorityConf = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.normal;

            return (
              <div
                key={item.id}
                className={`relative bg-slate-900/60 border rounded-2xl p-5 hover:bg-slate-900/80 transition-colors group ${typeConf.bg}`}
              >
                {/* Dismiss button */}
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
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
                <h3 className="text-white font-semibold text-sm mb-2 pr-6 leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.content}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/50">
                  <Clock className="w-3 h-3 text-slate-300" />
                  <span className="text-[11px] text-slate-300">
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    {item.mercurialeRef && ` · Mercuriale ${item.mercurialeRef}`}
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-300">
                    Veille sectorielle
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explication section */}
      {news.length > 0 && (
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg flex-shrink-0">
              <Newspaper className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-1">Comment fonctionne cette section ?</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Les actualités sont basées sur la <strong className="text-slate-300">mercuriale des prix fournisseurs</strong> (Metro, Transgourmet, Rungis)
                croisée avec <strong className="text-slate-300">vos ingrédients et fiches techniques</strong> pour vous proposer
                des recommandations personnalisées : alertes de hausse, opportunités d'économies, et conseils pour protéger vos marges.
              </p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-red-400" /> Alertes prix : hausses &gt;5% impactant vos recettes</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-emerald-400" /> Opportunités : produits en baisse ou alternatives économiques</span>
                <span className="flex items-center gap-1"><ChevronRight className="w-3 h-3 text-blue-400" /> Tendances : évolutions du marché à surveiller</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
