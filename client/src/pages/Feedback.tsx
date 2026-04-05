import { useState, useEffect, useMemo } from 'react';
import {
  Star, MessageSquare, Filter, ChevronLeft, ChevronRight, Link2,
  Copy, Check, TrendingUp, BarChart3, Clock, Loader2, ExternalLink,
  QrCode, Send, X,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Restaurant-Id': restaurantId || '1',
  };
}

interface Feedback {
  id: number;
  restaurantId: number;
  rating: number;
  comment: string | null;
  source: string;
  createdAt: string;
}

interface Stats {
  avgRating: number;
  totalCount: number;
  distribution: Record<number, number>;
  trend: { week: string; avg: number; count: number }[];
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7', xl: 'w-10 h-10' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${i <= rating ? 'fill-[#111111] dark:fill-white text-[#111111] dark:text-white' : 'text-[#D1D5DB] dark:text-[#404040]'}`}
        />
      ))}
    </div>
  );
}

function sourceLabel(source: string) {
  switch (source) {
    case 'app': return 'Application';
    case 'email': return 'Email';
    case 'manual': return 'Manuel';
    case 'public': return 'Formulaire public';
    default: return source;
  }
}

function relativeDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `Il y a ${diffD}j`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Feedback() {
  const { addToast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Link modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const restaurantId = localStorage.getItem('activeRestaurantId') || '1';
  const feedbackLink = `${window.location.origin}/feedback/${restaurantId}`;

  async function loadStats() {
    try {
      const params = new URLSearchParams();
      if (period) params.set('period', period);
      const res = await fetch(`${API}/api/feedback/stats?${params}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      /* silent */
    }
  }

  async function loadFeedbacks(p = page) {
    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (period) params.set('period', period);
      if (ratingFilter) params.set('rating', ratingFilter);
      if (sourceFilter) params.set('source', sourceFilter);
      const res = await fetch(`${API}/api/feedback?${params}`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch {
      /* silent */
    }
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([loadStats(), loadFeedbacks(1)]).finally(() => setLoading(false));
    setPage(1);
  }, [period, ratingFilter, sourceFilter]);

  useEffect(() => {
    loadFeedbacks(page);
  }, [page]);

  function copyLink() {
    navigator.clipboard.writeText(feedbackLink);
    setCopied(true);
    addToast('Lien copie dans le presse-papier', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  // Distribution max for scaling bars
  const maxDistrib = stats ? Math.max(...Object.values(stats.distribution), 1) : 1;

  // Trend chart max
  const trendMax = stats ? Math.max(...stats.trend.map(t => t.avg), 5) : 5;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#111111] dark:text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
            Avis clients
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-1">
            Suivez la satisfaction de vos clients en temps reel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
              showFilters
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                : 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white border-[#E5E7EB] dark:border-[#262626] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
          <button
            onClick={() => setShowLinkModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors"
          >
            <Send className="w-4 h-4" />
            Demander un avis
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white"
          >
            <option value="">Toute la periode</option>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 mois</option>
            <option value="365">12 mois</option>
          </select>
          <select
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white"
          >
            <option value="">Toutes les notes</option>
            <option value="5">5 etoiles</option>
            <option value="4">4 etoiles</option>
            <option value="3">3 etoiles</option>
            <option value="2">2 etoiles</option>
            <option value="1">1 etoile</option>
          </select>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white"
          >
            <option value="">Toutes les sources</option>
            <option value="app">Application</option>
            <option value="public">Formulaire public</option>
            <option value="email">Email</option>
            <option value="manual">Manuel</option>
          </select>
          {(period || ratingFilter || sourceFilter) && (
            <button
              onClick={() => { setPeriod(''); setRatingFilter(''); setSourceFilter(''); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reinitialiser
            </button>
          )}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Rating Card */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-6 flex flex-col items-center justify-center">
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373] mb-3">
              Note moyenne
            </p>
            <div className="text-5xl font-bold text-[#111111] dark:text-white font-satoshi mb-2">
              {stats.avgRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(stats.avgRating)} size="lg" />
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-3">
              {stats.totalCount} avis au total
            </p>
          </div>

          {/* Distribution Card */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373] mb-4">
              Repartition
            </p>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.distribution[rating] || 0;
                const pct = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#111111] dark:text-white w-3">{rating}</span>
                    <Star className="w-3.5 h-3.5 fill-[#111111] dark:fill-white text-[#111111] dark:text-white" />
                    <div className="flex-1 h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#111111] dark:bg-white rounded-full transition-all duration-500"
                        style={{ width: `${maxDistrib > 0 ? (count / maxDistrib) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] w-12 text-right">
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend Card */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373] mb-4">
              Tendance (12 semaines)
            </p>
            <div className="flex items-end gap-1 h-32">
              {stats.trend.map((t, i) => {
                const height = t.avg > 0 ? (t.avg / 5) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div
                      className="w-full bg-[#111111] dark:bg-white rounded-t transition-all duration-300 min-h-[2px]"
                      style={{ height: `${height}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                      {t.avg > 0 ? `${t.avg}/5` : 'Aucun'} ({t.count} avis)
                      <br />
                      Semaine du {new Date(t.week).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">-12 sem.</span>
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Auj.</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Feedback List */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl">
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">
            Avis recents
          </h2>
          <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
            {total} resultats
          </span>
        </div>

        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <MessageSquare className="w-12 h-12 text-[#D1D5DB] dark:text-[#404040] mb-4" />
            <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm font-medium mb-1">
              Aucun avis pour le moment
            </p>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-4">
              Partagez le lien de votre formulaire pour commencer a collecter des avis
            </p>
            <button
              onClick={() => setShowLinkModal(true)}
              className="px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-xl text-sm font-medium hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors"
            >
              Partager le formulaire
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
            {feedbacks.map(fb => (
              <div key={fb.id} className="px-6 py-4 flex items-start gap-4 hover:bg-[#F9FAFB] dark:hover:bg-[#0F0F0F] transition-colors">
                {/* Rating badge */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center">
                  <span className="text-lg font-bold text-[#111111] dark:text-white">{fb.rating}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={fb.rating} size="sm" />
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                      {sourceLabel(fb.source)}
                    </span>
                  </div>
                  {fb.comment ? (
                    <p className="text-sm text-[#111111] dark:text-white leading-relaxed">
                      {fb.comment}
                    </p>
                  ) : (
                    <p className="text-sm text-[#9CA3AF] dark:text-[#737373] italic">
                      Aucun commentaire
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-[#737373]">
                  <Clock className="w-3 h-3" />
                  {relativeDate(fb.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#E5E7EB] dark:border-[#262626] flex items-center justify-between">
            <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
              Page {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#111111] dark:text-white" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#111111] dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Link / QR Modal */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="Demander un avis">
        <div className="space-y-5">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Partagez ce lien avec vos clients pour recueillir leurs avis. Le formulaire est accessible sans inscription.
          </p>

          {/* Link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2.5 text-sm text-[#111111] dark:text-white truncate font-mono">
              {feedbackLink}
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg text-sm font-medium hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copie' : 'Copier'}
            </button>
          </div>

          {/* QR Code placeholder */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-48 h-48 bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-2xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-[#D1D5DB] dark:text-[#404040]" />
            </div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
              Scannez ou partagez le QR code
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col gap-2">
            <a
              href={feedbackLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-sm font-medium text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir le formulaire
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
