import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BarChart3, MessageSquare, Mail, Activity, Shield,
  Search, ChevronLeft, ChevronRight, Download, Eye, EyeOff,
  RefreshCw, TrendingUp, Building2, ChefHat, ShoppingBasket,
  CreditCard, Loader2, X, Check, AlertTriangle, Newspaper
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { getToken } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function adminFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/admin${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erreur serveur');
  }
  return res.json();
}

async function adminPut<T>(path: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE}/admin${path}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Erreur serveur');
  }
  return res.json();
}

// ── Types ──
interface AdminStats {
  totalUsers: number;
  newUsersWeek: number;
  newUsersMonth: number;
  totalRestaurants: number;
  totalRecipes: number;
  totalIngredients: number;
  activeSubscriptions: number;
  totalMessages: number;
  totalOrders: number;
  newsletterCount: number;
  recentSignups: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    plan: string;
    createdAt: string;
  }>;
  signupsChart: Array<{ date: string; count: number }>;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
  trialEndsAt: string | null;
  emailVerified: boolean;
  restaurantCount: number;
  membershipCount: number;
}

interface AdminMessage {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  createdAt: string;
  conversation: { id: string; name: string; restaurantId: number };
}

interface AuditLog {
  id: number;
  userId: number;
  restaurantId: number;
  action: string;
  entityType: string;
  entityId: number;
  changes: any;
  createdAt: string;
}

interface NewsletterSub {
  id: number;
  email: string;
  subscribedAt: string;
  unsubscribed: boolean;
}

type Tab = 'overview' | 'users' | 'messages' | 'newsletter' | 'activity';

// ── Sparkline mini chart ──
function MiniChart({ data }: { data: Array<{ date: string; count: number }> }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.count), 1);
  const w = 320;
  const h = 80;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (d.count / max) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#111111"
        strokeWidth="2"
        className="dark:stroke-white"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (d.count / max) * (h - 10) - 5;
        return d.count > 0 ? (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#111111" className="dark:fill-white" />
        ) : null;
      })}
    </svg>
  );
}

// ── KPI Card ──
function KpiCard({ label, value, icon: Icon, sub }: { label: string; value: number | string; icon: any; sub?: string }) {
  return (
    <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-mono-950 dark:bg-[#171717]">
        <Icon className="w-5 h-5 text-mono-100 dark:text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">{value}</div>
        <div className="text-xs text-[#6B7280] dark:text-mono-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-[#9CA3AF] dark:text-mono-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

// ── Badge ──
function Badge({ text, variant = 'default' }: { text: string; variant?: 'default' | 'success' | 'warning' | 'danger' }) {
  const colors = {
    default: 'bg-mono-950 text-[#374151] dark:bg-[#171717] dark:text-mono-700',
    success: 'bg-[#D1FAE5] text-[#065F46] dark:bg-[#022C22] dark:text-[#6EE7B7]',
    warning: 'bg-[#FEF3C7] text-[#92400E] dark:bg-[#422006] dark:text-[#FCD34D]',
    danger: 'bg-[#FEE2E2] text-[#991B1B] dark:bg-[#450A0A] dark:text-[#FCA5A5]',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full ${colors[variant]}`}>
      {text}
    </span>
  );
}

function planBadge(plan: string) {
  if (plan === 'business') return <Badge text="Business" variant="success" />;
  if (plan === 'pro') return <Badge text="Pro" variant="warning" />;
  return <Badge text="Basic" variant="default" />;
}

function roleBadge(role: string) {
  if (role === 'admin') return <Badge text="Admin" variant="danger" />;
  return <Badge text="Chef" variant="default" />;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── CSV export helper ──
function downloadCSV(rows: string[][], filename: string) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);

  // ── Stats state ──
  const [stats, setStats] = useState<AdminStats | null>(null);

  // ── Users state ──
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersPlanFilter, setUsersPlanFilter] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState('');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<{ id: number; plan: string; role: string } | null>(null);
  const editUserTrapRef = useFocusTrap<HTMLDivElement>(!!editingUser);

  // ── Messages state ──
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesTotalPages, setMessagesTotalPages] = useState(1);

  // ── Activity state ──
  const [activity, setActivity] = useState<AuditLog[]>([]);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [activityFilter, setActivityFilter] = useState('');

  // ── Newsletter state ──
  const [newsletter, setNewsletter] = useState<NewsletterSub[]>([]);
  const [newsletterTotal, setNewsletterTotal] = useState(0);
  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterTotalPages, setNewsletterTotalPages] = useState(1);

  // ── Redirect non-admin ──
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // ── Load stats ──
  const loadStats = useCallback(async () => {
    try {
      const data = await adminFetch<AdminStats>('/stats');
      setStats(data);
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    }
  }, []);

  // ── Load users ──
  const loadUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(usersPage), limit: '20' });
      if (usersSearch) params.set('search', usersSearch);
      if (usersPlanFilter) params.set('plan', usersPlanFilter);
      if (usersRoleFilter) params.set('role', usersRoleFilter);
      const data = await adminFetch<{ users: AdminUser[]; total: number; page: number; totalPages: number }>(`/users?${params}`);
      setUsers(data.users);
      setUsersTotal(data.total);
      setUsersTotalPages(data.totalPages);
    } catch (e) {
      console.error('Failed to load users:', e);
    }
  }, [usersPage, usersSearch, usersPlanFilter, usersRoleFilter]);

  // ── Load messages ──
  const loadMessages = useCallback(async () => {
    try {
      const data = await adminFetch<{ messages: AdminMessage[]; total: number; totalPages: number }>(`/messages?page=${messagesPage}&limit=30`);
      setMessages(data.messages);
      setMessagesTotal(data.total);
      setMessagesTotalPages(data.totalPages);
    } catch (e) {
      console.error('Failed to load messages:', e);
    }
  }, [messagesPage]);

  // ── Load activity ──
  const loadActivity = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(activityPage), limit: '50' });
      if (activityFilter) params.set('entityType', activityFilter);
      const data = await adminFetch<{ logs: AuditLog[]; total: number; totalPages: number }>(`/activity?${params}`);
      setActivity(data.logs);
      setActivityTotal(data.total);
      setActivityTotalPages(data.totalPages);
    } catch (e) {
      console.error('Failed to load activity:', e);
    }
  }, [activityPage, activityFilter]);

  // ── Load newsletter ──
  const loadNewsletter = useCallback(async () => {
    try {
      const data = await adminFetch<{ subscribers: NewsletterSub[]; total: number; totalPages: number }>(`/newsletter?page=${newsletterPage}&limit=30`);
      setNewsletter(data.subscribers);
      setNewsletterTotal(data.total);
      setNewsletterTotalPages(data.totalPages);
    } catch (e) {
      console.error('Failed to load newsletter:', e);
    }
  }, [newsletterPage]);

  // ── Initial load ──
  useEffect(() => {
    setLoading(true);
    loadStats().finally(() => setLoading(false));
  }, [loadStats]);

  // ── Tab-specific loads ──
  useEffect(() => {
    if (tab === 'users') loadUsers();
  }, [tab, loadUsers]);

  useEffect(() => {
    if (tab === 'messages') loadMessages();
  }, [tab, loadMessages]);

  useEffect(() => {
    if (tab === 'activity') loadActivity();
  }, [tab, loadActivity]);

  useEffect(() => {
    if (tab === 'newsletter') loadNewsletter();
  }, [tab, loadNewsletter]);

  // ── User edit save ──
  const saveUserEdit = async () => {
    if (!editingUser) return;
    try {
      await adminPut(`/users/${editingUser.id}`, { plan: editingUser.plan, role: editingUser.role });
      setEditingUser(null);
      loadUsers();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ── Newsletter unsubscribe ──
  const handleUnsubscribe = async (id: number) => {
    try {
      await adminPut(`/newsletter/${id}/unsubscribe`, {});
      loadNewsletter();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ── Export users CSV ──
  const exportUsersCSV = () => {
    const rows = [
      ['ID', 'Nom', 'Email', 'Role', 'Plan', 'Date inscription', 'Email verifie', 'Restaurants'],
      ...users.map(u => [
        String(u.id), u.name, u.email, u.role, u.plan,
        formatDate(u.createdAt), u.emailVerified ? 'Oui' : 'Non', String(u.restaurantCount),
      ]),
    ];
    downloadCSV(rows, `restaumargin-users-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // ── Export newsletter CSV ──
  const exportNewsletterCSV = () => {
    const rows = [
      ['ID', 'Email', 'Date inscription', 'Actif'],
      ...newsletter.map(s => [
        String(s.id), s.email, formatDate(s.subscribedAt), s.unsubscribed ? 'Non' : 'Oui',
      ]),
    ];
    downloadCSV(rows, `restaumargin-newsletter-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (user?.role !== 'admin') return null;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'activity', label: 'Activite', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-mono-100 dark:bg-white">
            <Shield className="w-6 h-6 text-white dark:text-mono-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">Administration</h1>
            <p className="text-sm text-[#6B7280] dark:text-mono-500">Panneau de controle RestauMargin</p>
          </div>
        </div>
        <button
          onClick={() => { loadStats(); if (tab === 'users') loadUsers(); if (tab === 'messages') loadMessages(); if (tab === 'activity') loadActivity(); if (tab === 'newsletter') loadNewsletter(); }}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#6B7280] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white hover:bg-mono-950 dark:hover:bg-[#171717] rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-mono-950 dark:bg-mono-50 p-1 rounded-xl border border-mono-900 dark:border-mono-200 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              tab === t.id
                ? 'bg-white dark:bg-[#171717] text-mono-100 dark:text-white shadow-sm'
                : 'text-[#6B7280] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {loading && !stats ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-mono-100 dark:text-white" />
        </div>
      ) : (
        <>
          {/* ═══ TAB: VUE D'ENSEMBLE ═══ */}
          {tab === 'overview' && stats && (
            <div className="space-y-6">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard icon={Users} label="Total utilisateurs" value={stats.totalUsers} sub={`+${stats.newUsersWeek} cette semaine`} />
                <KpiCard icon={TrendingUp} label="Nouveaux ce mois" value={stats.newUsersMonth} />
                <KpiCard icon={Building2} label="Restaurants" value={stats.totalRestaurants} />
                <KpiCard icon={ChefHat} label="Fiches techniques" value={stats.totalRecipes} />
                <KpiCard icon={CreditCard} label="Abonnements actifs" value={stats.activeSubscriptions} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <KpiCard icon={ShoppingBasket} label="Ingredients" value={stats.totalIngredients} />
                <KpiCard icon={MessageSquare} label="Messages" value={stats.totalMessages} />
                <KpiCard icon={Newspaper} label="Newsletter" value={stats.newsletterCount} sub="abonnes actifs" />
              </div>

              {/* Signups Chart */}
              <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-mono-100 dark:text-white mb-3">Inscriptions (30 derniers jours)</h3>
                <MiniChart data={stats.signupsChart} />
                <div className="flex justify-between text-[10px] text-[#9CA3AF] dark:text-mono-400 mt-1 px-1">
                  <span>{stats.signupsChart[0]?.date || ''}</span>
                  <span>{stats.signupsChart[stats.signupsChart.length - 1]?.date || ''}</span>
                </div>
              </div>

              {/* Recent Signups Table */}
              <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200">
                  <h3 className="text-sm font-semibold text-mono-100 dark:text-white">Dernieres inscriptions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mono-900 dark:border-mono-200 text-left">
                        <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Nom</th>
                        <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Plan</th>
                        <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Role</th>
                        <th className="px-5 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSignups.map(u => (
                        <tr key={u.id} className="border-b border-mono-950 dark:border-[#171717] hover:bg-[#F9FAFB] dark:hover:bg-[#0F0F0F] transition-colors">
                          <td className="px-5 py-3 font-medium text-mono-100 dark:text-white">{u.name}</td>
                          <td className="px-5 py-3 text-[#6B7280] dark:text-mono-700">{u.email}</td>
                          <td className="px-5 py-3">{planBadge(u.plan)}</td>
                          <td className="px-5 py-3">{roleBadge(u.role)}</td>
                          <td className="px-5 py-3 text-[#9CA3AF] dark:text-mono-500">{formatDate(u.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB: UTILISATEURS ═══ */}
          {tab === 'users' && (
            <div className="space-y-4">
              {/* Search + Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={usersSearch}
                    onChange={e => { setUsersSearch(e.target.value); setUsersPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg text-sm text-mono-100 dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
                  />
                </div>
                <select
                  value={usersPlanFilter}
                  onChange={e => { setUsersPlanFilter(e.target.value); setUsersPage(1); }}
                  className="px-3 py-2.5 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg text-sm text-mono-100 dark:text-white"
                >
                  <option value="">Tous les plans</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="business">Business</option>
                </select>
                <select
                  value={usersRoleFilter}
                  onChange={e => { setUsersRoleFilter(e.target.value); setUsersPage(1); }}
                  className="px-3 py-2.5 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg text-sm text-mono-100 dark:text-white"
                >
                  <option value="">Tous les roles</option>
                  <option value="admin">Admin</option>
                  <option value="chef">Chef</option>
                </select>
                <button
                  onClick={exportUsersCSV}
                  className="flex items-center gap-2 px-3 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Info bar */}
              <div className="text-xs text-[#6B7280] dark:text-mono-500">
                {usersTotal} utilisateur{usersTotal > 1 ? 's' : ''} &middot; Page {usersPage}/{usersTotalPages}
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mono-900 dark:border-mono-200 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Nom</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Plan</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Restaurants</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Inscription</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <>
                          <tr
                            key={u.id}
                            className="border-b border-mono-950 dark:border-[#171717] hover:bg-[#F9FAFB] dark:hover:bg-[#0F0F0F] transition-colors cursor-pointer"
                            onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                          >
                            <td className="px-4 py-3 text-[#9CA3AF] dark:text-mono-400 font-mono text-xs">#{u.id}</td>
                            <td className="px-4 py-3 font-medium text-mono-100 dark:text-white">{u.name}</td>
                            <td className="px-4 py-3 text-[#6B7280] dark:text-mono-700">{u.email}</td>
                            <td className="px-4 py-3">{roleBadge(u.role)}</td>
                            <td className="px-4 py-3">{planBadge(u.plan)}</td>
                            <td className="px-4 py-3 text-center text-[#6B7280] dark:text-mono-700">{u.restaurantCount}</td>
                            <td className="px-4 py-3 text-[#9CA3AF] dark:text-mono-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={e => { e.stopPropagation(); setEditingUser({ id: u.id, plan: u.plan, role: u.role }); }}
                                className="text-xs font-medium text-mono-100 dark:text-white hover:underline"
                              >
                                Modifier
                              </button>
                            </td>
                          </tr>
                          {expandedUser === u.id && (
                            <tr key={`${u.id}-detail`} className="bg-[#F9FAFB] dark:bg-[#0F0F0F]">
                              <td colSpan={8} className="px-6 py-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                  <div>
                                    <span className="text-[#9CA3AF] dark:text-mono-400">Email verifie:</span>{' '}
                                    <span className={u.emailVerified ? 'text-emerald-600' : 'text-red-500'}>{u.emailVerified ? 'Oui' : 'Non'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#9CA3AF] dark:text-mono-400">Trial expire:</span>{' '}
                                    <span className="text-mono-100 dark:text-white">{u.trialEndsAt ? formatDate(u.trialEndsAt) : 'N/A'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#9CA3AF] dark:text-mono-400">Restaurants:</span>{' '}
                                    <span className="text-mono-100 dark:text-white">{u.restaurantCount}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#9CA3AF] dark:text-mono-400">Memberships:</span>{' '}
                                    <span className="text-mono-100 dark:text-white">{u.membershipCount}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={8} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-mono-400">Aucun utilisateur trouve</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {usersTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                    disabled={usersPage <= 1}
                    className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                  <span className="text-sm text-[#6B7280] dark:text-mono-500">
                    {usersPage} / {usersTotalPages}
                  </span>
                  <button
                    onClick={() => setUsersPage(p => Math.min(usersTotalPages, p + 1))}
                    disabled={usersPage >= usersTotalPages}
                    className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                </div>
              )}

              {/* Edit Modal */}
              {editingUser && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                  onClick={() => setEditingUser(null)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setEditingUser(null); }}
                >
                  <div
                    ref={editUserTrapRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-edit-user-title"
                    className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl p-6 w-full max-w-md shadow-xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 id="admin-edit-user-title" className="text-lg font-semibold text-mono-100 dark:text-white">Modifier utilisateur #{editingUser.id}</h3>
                      <button onClick={() => setEditingUser(null)} aria-label="Fermer" className="p-1 hover:bg-mono-950 dark:hover:bg-[#171717] rounded-lg">
                        <X className="w-4 h-4 text-[#6B7280]" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider mb-1">Plan</label>
                        <select
                          value={editingUser.plan}
                          onChange={e => setEditingUser({ ...editingUser, plan: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-200 rounded-lg text-sm text-mono-100 dark:text-white"
                        >
                          <option value="basic">Basic</option>
                          <option value="pro">Pro</option>
                          <option value="business">Business</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider mb-1">Role</label>
                        <select
                          value={editingUser.role}
                          onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white dark:bg-[#171717] border border-mono-900 dark:border-mono-200 rounded-lg text-sm text-mono-100 dark:text-white"
                        >
                          <option value="chef">Chef</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setEditingUser(null)}
                          className="flex-1 px-4 py-2.5 text-sm font-medium border border-mono-900 dark:border-mono-200 rounded-lg text-[#6B7280] hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={saveUserEdit}
                          className="flex-1 px-4 py-2.5 text-sm font-medium bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB: MESSAGES ═══ */}
          {tab === 'messages' && (
            <div className="space-y-4">
              <div className="text-xs text-[#6B7280] dark:text-mono-500">
                {messagesTotal} message{messagesTotal > 1 ? 's' : ''} au total
              </div>

              <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mono-900 dark:border-mono-200 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Expediteur</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Conversation</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Message</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Lu</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map(m => (
                        <tr key={m.id} className="border-b border-mono-950 dark:border-[#171717] hover:bg-[#F9FAFB] dark:hover:bg-[#0F0F0F] transition-colors">
                          <td className="px-4 py-3 font-medium text-mono-100 dark:text-white whitespace-nowrap">{m.senderName}</td>
                          <td className="px-4 py-3 text-[#6B7280] dark:text-mono-700">{m.conversation.name}</td>
                          <td className="px-4 py-3 text-[#6B7280] dark:text-mono-700 max-w-xs truncate">{m.content}</td>
                          <td className="px-4 py-3">
                            {m.read ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-[#9CA3AF]" />}
                          </td>
                          <td className="px-4 py-3 text-[#9CA3AF] dark:text-mono-500 whitespace-nowrap">{formatDateTime(m.createdAt)}</td>
                        </tr>
                      ))}
                      {messages.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-mono-400">Aucun message</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {messagesTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setMessagesPage(p => Math.max(1, p - 1))} disabled={messagesPage <= 1} className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                  <span className="text-sm text-[#6B7280] dark:text-mono-500">{messagesPage} / {messagesTotalPages}</span>
                  <button onClick={() => setMessagesPage(p => Math.min(messagesTotalPages, p + 1))} disabled={messagesPage >= messagesTotalPages} className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30">
                    <ChevronRight className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB: NEWSLETTER ═══ */}
          {tab === 'newsletter' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#6B7280] dark:text-mono-500">
                  {newsletterTotal} abonne{newsletterTotal > 1 ? 's' : ''}
                </div>
                <button
                  onClick={exportNewsletterCSV}
                  className="flex items-center gap-2 px-3 py-2 bg-mono-100 dark:bg-white text-white dark:text-mono-100 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mono-900 dark:border-mono-200 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletter.map(s => (
                        <tr key={s.id} className="border-b border-mono-950 dark:border-[#171717] hover:bg-[#F9FAFB] dark:hover:bg-[#0F0F0F] transition-colors">
                          <td className="px-4 py-3 text-[#9CA3AF] dark:text-mono-400 font-mono text-xs">#{s.id}</td>
                          <td className="px-4 py-3 text-mono-100 dark:text-white">{s.email}</td>
                          <td className="px-4 py-3 text-[#9CA3AF] dark:text-mono-500">{formatDate(s.subscribedAt)}</td>
                          <td className="px-4 py-3">
                            {s.unsubscribed
                              ? <Badge text="Desinscrit" variant="danger" />
                              : <Badge text="Actif" variant="success" />
                            }
                          </td>
                          <td className="px-4 py-3">
                            {!s.unsubscribed && (
                              <button
                                onClick={() => handleUnsubscribe(s.id)}
                                className="text-xs text-red-500 hover:text-red-400 font-medium"
                              >
                                Desinscrire
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {newsletter.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-mono-400">Aucun abonne</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {newsletterTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setNewsletterPage(p => Math.max(1, p - 1))} disabled={newsletterPage <= 1} className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                  <span className="text-sm text-[#6B7280] dark:text-mono-500">{newsletterPage} / {newsletterTotalPages}</span>
                  <button onClick={() => setNewsletterPage(p => Math.min(newsletterTotalPages, p + 1))} disabled={newsletterPage >= newsletterTotalPages} className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30">
                    <ChevronRight className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ═══ TAB: ACTIVITE ═══ */}
          {tab === 'activity' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <select
                  value={activityFilter}
                  onChange={e => { setActivityFilter(e.target.value); setActivityPage(1); }}
                  className="px-3 py-2.5 bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg text-sm text-mono-100 dark:text-white"
                >
                  <option value="">Tous les types</option>
                  <option value="ingredient">Ingredients</option>
                  <option value="recipe">Recettes</option>
                  <option value="supplier">Fournisseurs</option>
                  <option value="inventory">Inventaire</option>
                  <option value="order">Commandes</option>
                </select>
                <div className="text-xs text-[#6B7280] dark:text-mono-500">
                  {activityTotal} entree{activityTotal > 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-mono-900 dark:border-mono-200 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">User ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Action</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Entity ID</th>
                        <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] dark:text-mono-500 uppercase tracking-wider">Restaurant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activity.map(log => (
                        <tr key={log.id} className="border-b border-mono-950 dark:border-[#171717] hover:bg-[#F9FAFB] dark:hover:bg-[#0F0F0F] transition-colors">
                          <td className="px-4 py-3 text-[#9CA3AF] dark:text-mono-500 whitespace-nowrap text-xs">{formatDateTime(log.createdAt)}</td>
                          <td className="px-4 py-3 text-[#6B7280] dark:text-mono-700 font-mono text-xs">#{log.userId}</td>
                          <td className="px-4 py-3">
                            <Badge
                              text={log.action}
                              variant={log.action === 'CREATE' ? 'success' : log.action === 'DELETE' ? 'danger' : log.action === 'UPDATE' ? 'warning' : 'default'}
                            />
                          </td>
                          <td className="px-4 py-3 text-mono-100 dark:text-white capitalize">{log.entityType}</td>
                          <td className="px-4 py-3 text-[#6B7280] dark:text-mono-700 font-mono text-xs">#{log.entityId}</td>
                          <td className="px-4 py-3 text-[#6B7280] dark:text-mono-700 font-mono text-xs">#{log.restaurantId}</td>
                        </tr>
                      ))}
                      {activity.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-mono-400">Aucune activite enregistree</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {activityTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setActivityPage(p => Math.max(1, p - 1))} disabled={activityPage <= 1} className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                  <span className="text-sm text-[#6B7280] dark:text-mono-500">{activityPage} / {activityTotalPages}</span>
                  <button onClick={() => setActivityPage(p => Math.min(activityTotalPages, p + 1))} disabled={activityPage >= activityTotalPages} className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] disabled:opacity-30">
                    <ChevronRight className="w-4 h-4 text-mono-100 dark:text-white" />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
