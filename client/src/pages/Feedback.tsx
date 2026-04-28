import { useState, useEffect, useMemo } from 'react';
import {
  Star, MessageSquare, Filter, ChevronLeft, ChevronRight, Link2,
  Copy, Check, TrendingUp, BarChart3, Clock, Loader2, ExternalLink,
  QrCode, Send, X, Download, ArrowUpDown, ThumbsUp, ThumbsDown,
  Meh, Reply, ChevronDown, ChevronUp, Smile, Frown, Hash,
  MessageCircle, Award, AlertTriangle,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import { useApiClient } from '../hooks/useApiClient';

const API = '';

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

function StarRating({ rating, size = 'md', interactive = false, onChange }: {
  rating: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7', xl: 'w-10 h-10' };
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${sizeMap[size]} transition-colors ${
            i <= (hover || rating)
              ? 'fill-mono-100 dark:fill-white text-mono-100 dark:text-white'
              : 'text-[#D1D5DB] dark:text-mono-350'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i)}
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

function sourceIcon(source: string) {
  switch (source) {
    case 'app': return '📱';
    case 'email': return '📧';
    case 'manual': return '✏️';
    case 'public': return '🌐';
    default: return '💬';
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

function getSentiment(rating: number): { label: string; color: string; icon: typeof ThumbsUp; bg: string } {
  if (rating >= 4) return {
    label: 'Positif',
    color: 'text-emerald-700 dark:text-emerald-400',
    icon: Smile,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  };
  if (rating === 3) return {
    label: 'Neutre',
    color: 'text-amber-700 dark:text-amber-400',
    icon: Meh,
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  };
  return {
    label: 'Negatif',
    color: 'text-red-700 dark:text-red-400',
    icon: Frown,
    bg: 'bg-red-100 dark:bg-red-900/30',
  };
}

function getRatingColor(rating: number): string {
  if (rating >= 4) return 'bg-emerald-500';
  if (rating === 3) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function FeedbackPage() {
  const { showToast } = useToast();
  const { authHeaders } = useApiClient();
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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Link modal
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Inline reply
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Expanded cards
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

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
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
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
    showToast('Lien copie dans le presse-papier', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  function exportCSV() {
    if (feedbacks.length === 0) {
      showToast('Aucun avis a exporter', 'error');
      return;
    }
    const headers = ['ID', 'Note', 'Commentaire', 'Source', 'Date'];
    const rows = feedbacks.map(fb => [
      fb.id,
      fb.rating,
      `"${(fb.comment || '').replace(/"/g, '""')}"`,
      sourceLabel(fb.source),
      new Date(fb.createdAt).toLocaleDateString('fr-FR'),
    ]);
    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avis-clients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export CSV telecharge', 'success');
  }

  function handleReply(fbId: number) {
    if (!replyText.trim()) return;
    showToast('Reponse envoyee', 'success');
    setReplyingTo(null);
    setReplyText('');
  }

  function toggleExpand(id: number) {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const sortedFeedbacks = useMemo(() => {
    const sorted = [...feedbacks];
    switch (sortOrder) {
      case 'newest': return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'highest': return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest': return sorted.sort((a, b) => a.rating - b.rating);
      default: return sorted;
    }
  }, [feedbacks, sortOrder]);

  // Derived KPIs
  const sentimentBreakdown = useMemo(() => {
    if (!stats) return { positive: 0, neutral: 0, negative: 0 };
    const dist = stats.distribution;
    const positive = (dist[4] || 0) + (dist[5] || 0);
    const neutral = dist[3] || 0;
    const negative = (dist[1] || 0) + (dist[2] || 0);
    return { positive, neutral, negative };
  }, [stats]);

  const nps = useMemo(() => {
    if (!stats || stats.totalCount === 0) return null;
    const dist = stats.distribution;
    const promoters = ((dist[5] || 0) / stats.totalCount) * 100;
    const detractors = (((dist[1] || 0) + (dist[2] || 0)) / stats.totalCount) * 100;
    return Math.round(promoters - detractors);
  }, [stats]);

  const maxDistrib = stats ? Math.max(...Object.values(stats.distribution), 1) : 1;

  const activeFilters = [period, ratingFilter, sourceFilter].filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-mono-100 dark:text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">
            Avis clients
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-mono-700 mt-1">
            Suivez la satisfaction de vos clients en temps reel
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-mono-900 dark:border-mono-300 bg-white dark:bg-black text-mono-100 dark:text-white hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
              showFilters
                ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100 border-mono-100 dark:border-white'
                : 'bg-white dark:bg-black text-mono-100 dark:text-white border-mono-900 dark:border-mono-300 hover:bg-mono-950 dark:hover:bg-[#171717]'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {activeFilters > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-mono-100 text-mono-100 dark:text-white text-[10px] font-bold">
                {activeFilters}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowLinkModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-mono-100 dark:bg-white text-white dark:text-mono-100 hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors"
          >
            <Send className="w-4 h-4" />
            Demander un avis
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-3 py-2 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
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
            className="px-3 py-2 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
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
            className="px-3 py-2 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
          >
            <option value="">Toutes les sources</option>
            <option value="app">Application</option>
            <option value="public">Formulaire public</option>
            <option value="email">Email</option>
            <option value="manual">Manuel</option>
          </select>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as any)}
            className="px-3 py-2 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl text-sm text-mono-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
          >
            <option value="newest">Plus recents</option>
            <option value="oldest">Plus anciens</option>
            <option value="highest">Meilleures notes</option>
            <option value="lowest">Moins bonnes notes</option>
          </select>
          {activeFilters > 0 && (
            <button
              onClick={() => { setPeriod(''); setRatingFilter(''); setSourceFilter(''); setSortOrder('newest'); }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6B7280] dark:text-mono-700 hover:text-mono-100 dark:hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reinitialiser
            </button>
          )}
        </div>
      )}

      {/* KPI Dashboard */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Average Rating */}
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-mono-950 dark:bg-[#171717] flex items-center justify-center mb-3">
              <Star className="w-5 h-5 fill-mono-100 dark:fill-white text-mono-100 dark:text-white" />
            </div>
            <p className="text-3xl font-bold text-mono-100 dark:text-white font-satoshi">
              {stats.avgRating.toFixed(1)}
            </p>
            <StarRating rating={Math.round(stats.avgRating)} size="sm" />
            <p className="text-xs text-[#6B7280] dark:text-mono-500 mt-1.5">Note moyenne</p>
          </div>

          {/* Total Reviews */}
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-mono-950 dark:bg-[#171717] flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-mono-100 dark:text-white" />
            </div>
            <p className="text-3xl font-bold text-mono-100 dark:text-white font-satoshi">
              {stats.totalCount}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-mono-500 mt-1.5">Avis au total</p>
          </div>

          {/* NPS Score */}
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl p-5 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-mono-950 dark:bg-[#171717] flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-mono-100 dark:text-white" />
            </div>
            <p className={`text-3xl font-bold font-satoshi ${
              nps !== null && nps >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {nps !== null ? (nps >= 0 ? `+${nps}` : nps) : '--'}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-mono-500 mt-1.5">Score NPS</p>
          </div>

          {/* Sentiment */}
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-3 text-center">Sentiment</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <div className="flex-1 h-2 bg-mono-950 dark:bg-[#171717] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${stats.totalCount > 0 ? (sentimentBreakdown.positive / stats.totalCount) * 100 : 0}%` }} />
                </div>
                <span className="text-xs font-medium text-mono-100 dark:text-white w-8 text-right">{sentimentBreakdown.positive}</span>
              </div>
              <div className="flex items-center gap-2">
                <Meh className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="flex-1 h-2 bg-mono-950 dark:bg-[#171717] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${stats.totalCount > 0 ? (sentimentBreakdown.neutral / stats.totalCount) * 100 : 0}%` }} />
                </div>
                <span className="text-xs font-medium text-mono-100 dark:text-white w-8 text-right">{sentimentBreakdown.neutral}</span>
              </div>
              <div className="flex items-center gap-2">
                <Frown className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="flex-1 h-2 bg-mono-950 dark:bg-[#171717] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${stats.totalCount > 0 ? (sentimentBreakdown.negative / stats.totalCount) * 100 : 0}%` }} />
                </div>
                <span className="text-xs font-medium text-mono-100 dark:text-white w-8 text-right">{sentimentBreakdown.negative}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution + Trend Row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Distribution */}
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-mono-100 dark:text-white font-satoshi">Repartition des notes</p>
              <BarChart3 className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
            </div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.distribution[rating] || 0;
                const pct = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-semibold text-mono-100 dark:text-white">{rating}</span>
                      <Star className="w-3.5 h-3.5 fill-mono-100 dark:fill-white text-mono-100 dark:text-white" />
                    </div>
                    <div className="flex-1 h-4 bg-mono-950 dark:bg-[#171717] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getRatingColor(rating)}`}
                        style={{ width: `${maxDistrib > 0 ? (count / maxDistrib) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-xs font-medium text-mono-100 dark:text-white">{count}</span>
                      <span className="text-xs text-[#9CA3AF] dark:text-mono-500 ml-1">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend */}
          <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-mono-100 dark:text-white font-satoshi">Tendance (12 semaines)</p>
              <TrendingUp className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
            </div>
            <div className="flex items-end gap-1 h-36">
              {stats.trend.map((t, i) => {
                const height = t.avg > 0 ? (t.avg / 5) * 100 : 0;
                const color = t.avg >= 4 ? 'bg-emerald-500' : t.avg >= 3 ? 'bg-amber-500' : t.avg > 0 ? 'bg-red-500' : 'bg-mono-900 dark:bg-mono-300';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    <div
                      className={`w-full ${color} rounded-t-sm transition-all duration-500 min-h-[2px]`}
                      style={{ height: `${height}%` }}
                    />
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-xs py-1.5 px-2.5 rounded-lg whitespace-nowrap z-10 shadow-lg">
                      <p className="font-semibold">{t.avg > 0 ? `${t.avg.toFixed(1)}/5` : 'Aucun avis'}</p>
                      <p className="text-white/70 dark:text-mono-100/70">{t.count} avis</p>
                      <p className="text-white/50 dark:text-mono-100/50">Sem. du {new Date(t.week).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500">-12 sem.</span>
              <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500">Aujourd'hui</span>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Cards */}
      <div className="bg-white dark:bg-black border border-mono-900 dark:border-mono-300 rounded-2xl">
        <div className="px-6 py-4 border-b border-mono-900 dark:border-mono-300 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-mono-100 dark:text-white font-satoshi">
            Avis recents
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 font-medium">
            {total} resultats
          </span>
        </div>

        {sortedFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-mono-950 dark:bg-[#171717] flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#D1D5DB] dark:text-mono-350" />
            </div>
            <p className="text-[#6B7280] dark:text-mono-700 text-sm font-medium mb-1">
              Aucun avis pour le moment
            </p>
            <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mb-4 text-center max-w-xs">
              Partagez le lien de votre formulaire pour commencer a collecter des avis
            </p>
            <button
              onClick={() => setShowLinkModal(true)}
              className="px-5 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl text-sm font-medium hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors"
            >
              Partager le formulaire
            </button>
          </div>
        ) : (
          <div className="divide-y divide-mono-900 dark:divide-mono-300">
            {sortedFeedbacks.map(fb => {
              const sentiment = getSentiment(fb.rating);
              const SentimentIcon = sentiment.icon;
              const isExpanded = expandedCards.has(fb.id);
              const isReplying = replyingTo === fb.id;
              const hasLongComment = fb.comment && fb.comment.length > 150;

              return (
                <div key={fb.id} className="px-6 py-5 hover:bg-[#F9FAFB] dark:hover:bg-mono-50 transition-colors">
                  {/* Card Header */}
                  <div className="flex items-start gap-4">
                    {/* Rating Circle */}
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${
                      fb.rating >= 4 ? 'bg-emerald-100 dark:bg-emerald-900/20' :
                      fb.rating === 3 ? 'bg-amber-100 dark:bg-amber-900/20' :
                      'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      <span className={`text-xl font-bold ${
                        fb.rating >= 4 ? 'text-emerald-700 dark:text-emerald-400' :
                        fb.rating === 3 ? 'text-amber-700 dark:text-amber-400' :
                        'text-red-700 dark:text-red-400'
                      }`}>{fb.rating}</span>
                      <span className="text-[8px] font-medium text-[#9CA3AF] dark:text-mono-500">/5</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <StarRating rating={fb.rating} size="sm" />
                        {/* Sentiment badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${sentiment.bg} ${sentiment.color}`}>
                          <SentimentIcon className="w-3 h-3" />
                          {sentiment.label}
                        </span>
                        {/* Source badge */}
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700">
                          {sourceIcon(fb.source)} {sourceLabel(fb.source)}
                        </span>
                      </div>

                      {/* Comment */}
                      {fb.comment ? (
                        <div>
                          <p className="text-sm text-mono-100 dark:text-white leading-relaxed">
                            {hasLongComment && !isExpanded
                              ? fb.comment.slice(0, 150) + '...'
                              : fb.comment
                            }
                          </p>
                          {hasLongComment && (
                            <button
                              onClick={() => toggleExpand(fb.id)}
                              className="flex items-center gap-1 mt-1 text-xs text-[#6B7280] dark:text-mono-700 hover:text-mono-100 dark:hover:text-white transition-colors"
                            >
                              {isExpanded ? (
                                <><ChevronUp className="w-3 h-3" /> Voir moins</>
                              ) : (
                                <><ChevronDown className="w-3 h-3" /> Voir plus</>
                              )}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-[#9CA3AF] dark:text-mono-500 italic">
                          Aucun commentaire
                        </p>
                      )}

                      {/* Actions row */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => { setReplyingTo(isReplying ? null : fb.id); setReplyText(''); }}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            isReplying
                              ? 'text-mono-100 dark:text-white'
                              : 'text-[#6B7280] dark:text-mono-700 hover:text-mono-100 dark:hover:text-white'
                          }`}
                        >
                          <Reply className="w-3.5 h-3.5" />
                          Repondre
                        </button>
                        <div className="flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-mono-500">
                          <Clock className="w-3 h-3" />
                          {relativeDate(fb.createdAt)}
                        </div>
                      </div>

                      {/* Inline Reply */}
                      {isReplying && (
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Ecrivez votre reponse..."
                            className="flex-1 px-3.5 py-2 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] dark:placeholder-mono-500 focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white transition-shadow"
                            onKeyDown={e => e.key === 'Enter' && handleReply(fb.id)}
                            autoFocus
                          />
                          <button
                            onClick={() => handleReply(fb.id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl text-sm font-medium hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setReplyingTo(null); setReplyText(''); }}
                            className="p-2 text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-mono-900 dark:border-mono-300 flex items-center justify-between">
            <span className="text-xs text-[#6B7280] dark:text-mono-700">
              Page {page} sur {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page <= 1}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30 transition-colors text-[#6B7280] dark:text-mono-700"
              >
                Debut
              </button>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-mono-100 dark:text-white" />
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                const p = start + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100'
                        : 'text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-mono-100 dark:text-white" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30 transition-colors text-[#6B7280] dark:text-mono-700"
              >
                Fin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Link / QR Modal */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="Demander un avis">
        <div className="space-y-5">
          <p className="text-sm text-[#6B7280] dark:text-mono-700">
            Partagez ce lien avec vos clients pour recueillir leurs avis. Le formulaire est accessible sans inscription.
          </p>

          {/* Link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-xl px-3.5 py-2.5 text-sm text-mono-100 dark:text-white truncate font-mono">
              {feedbackLink}
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-xl text-sm font-medium hover:bg-[#333333] dark:hover:bg-mono-900 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copie' : 'Copier'}
            </button>
          </div>

          {/* QR Code placeholder */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-48 h-48 bg-mono-950 dark:bg-[#171717] border border-mono-900 dark:border-mono-300 rounded-2xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-[#D1D5DB] dark:text-mono-350" />
            </div>
            <p className="text-xs text-[#9CA3AF] dark:text-mono-500">
              Scannez ou partagez le QR code
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col gap-2">
            <a
              href={feedbackLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-mono-900 dark:border-mono-300 rounded-xl text-sm font-medium text-mono-100 dark:text-white hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
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
