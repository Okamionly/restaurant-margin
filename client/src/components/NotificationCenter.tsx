import { formatCurrency } from '../utils/currency';
import { useApiClient } from '../hooks/useApiClient';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell, Package, TrendingUp, AlertTriangle, Check, X, Loader2,
  Volume2, VolumeX, Settings, Users, Sparkles, Shield,
  Zap, Clock, CheckCheck, ShoppingCart, DollarSign, BarChart3, Trophy, AlertCircle
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────
interface Notification {
  id: string;
  type: 'stock' | 'price' | 'margin' | 'team' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  severity: 'critical' | 'warning' | 'info';
  pinned?: boolean;
}

interface DailyBriefing {
  lowestMarginRecipe: { name: string; margin: number } | null;
  criticalStockCount: number;
  priceChangesCount: number;
  totalAlerts: number;
  summary: string;
}

interface DailySummary {
  totalRecipes: number;
  estimatedRevenue: number;
  averageMargin: number;
  bestRecipe: { name: string; margin: number } | null;
  criticalStockCount: number;
}

type NotifType = 'stock' | 'price' | 'margin' | 'team' | 'system';

// ── Persistence ────────────────────────────────────────────────────
const STORAGE_READ_KEY = 'rm-notif-center-read';
const STORAGE_PREFS_KEY = 'rm-notif-center-prefs';
const STORAGE_SOUND_KEY = 'rm-notif-center-sound';

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_READ_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_READ_KEY, JSON.stringify([...ids]));
}

function getPrefs(): Record<NotifType, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { stock: true, price: true, margin: true, team: true, system: true };
}

function savePrefs(prefs: Record<NotifType, boolean>) {
  localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
}

function getSoundEnabled(): boolean {
  try { return localStorage.getItem(STORAGE_SOUND_KEY) !== 'false'; }
  catch { return true; }
}

// ── Helpers ────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "A l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
}

// ── Type config (colors per W&B theme) ─────────────────────────────
const typeConfig: Record<NotifType, {
  icon: typeof Bell;
  label: string;
  color: string;
  bg: string;
  border: string;
  badgeBg: string;
}> = {
  stock: {
    icon: Package,
    label: 'Stock',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-l-red-500',
    badgeBg: 'bg-red-500/15 text-red-500',
  },
  price: {
    icon: TrendingUp,
    label: 'Prix',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-l-amber-500',
    badgeBg: 'bg-amber-500/15 text-amber-500',
  },
  margin: {
    icon: AlertTriangle,
    label: 'Marges',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-l-purple-500',
    badgeBg: 'bg-purple-500/15 text-purple-500',
  },
  team: {
    icon: Users,
    label: 'Equipe',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-l-blue-500',
    badgeBg: 'bg-blue-500/15 text-blue-500',
  },
  system: {
    icon: Shield,
    label: 'Systeme',
    color: 'text-[#9CA3AF]',
    bg: 'bg-[#F3F4F6] dark:bg-[#171717]',
    border: 'border-l-[#9CA3AF]',
    badgeBg: 'bg-[#F3F4F6] dark:bg-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3]',
  },
};

const severityStyles: Record<string, { pulse: string; dot: string; label: string }> = {
  critical: { pulse: 'animate-pulse', dot: 'bg-red-500', label: 'Critique' },
  warning: { pulse: '', dot: 'bg-amber-500', label: 'Important' },
  info: { pulse: '', dot: 'bg-[#9CA3AF]', label: 'Info' },
};

// ── Component ──────────────────────────────────────────────────────
export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);
  const [prefs, setPrefs] = useState<Record<NotifType, boolean>>(getPrefs);
  const [showPrefs, setShowPrefs] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(getSoundEnabled);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | NotifType>('all');
  const prevCountRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const { authHeaders } = useApiClient();


  // ── Fetch all notifications ──
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from multiple endpoints in parallel
      const [notifRes, auditRes] = await Promise.all([
        fetch('/api/notifications', { headers: authHeaders() }),
        fetch('/api/audit-logs?limit=10', { headers: authHeaders() }).catch(() => null),
      ]);

      const allNotifs: Notification[] = [];

      // 1. Main notifications (stock, price, margin, system)
      if (notifRes.ok) {
        const data = await notifRes.json();
        const items = (data.notifications || []).map((n: any) => ({
          ...n,
          read: readIds.has(n.id),
          severity: n.severity || 'info',
          pinned: n.severity === 'critical',
        }));
        allNotifs.push(...items);
      }

      // 2. Audit logs as team activity
      if (auditRes && auditRes.ok) {
        const auditData = await auditRes.json();
        const logs = auditData.data || [];
        for (const log of logs) {
          const teamNotif: Notification = {
            id: `team-${log.id}`,
            type: 'team',
            title: formatAuditAction(log.action, log.entityType),
            message: `${log.userName || 'Utilisateur'} — ${log.entityType} ${log.entityName || ''}`.trim(),
            createdAt: log.createdAt,
            read: readIds.has(`team-${log.id}`),
            severity: 'info',
          };
          allNotifs.push(teamNotif);
        }
      }

      // Sort: critical pinned first, then by date
      allNotifs.sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (b.severity === 'critical' && a.severity !== 'critical') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      // Play sound if new notifications arrived
      const newCount = allNotifs.filter(n => !readIds.has(n.id)).length;
      if (soundEnabled && newCount > prevCountRef.current && prevCountRef.current > 0) {
        playNotificationSound();
      }
      prevCountRef.current = newCount;

      setNotifications(allNotifs);

      // Build daily briefing
      buildBriefing(allNotifs);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [authHeaders, readIds, soundEnabled]);

  // ── Fetch daily summary from recipes + ingredients ──
  const fetchDailySummary = useCallback(async () => {
    try {
      const [recipesRes, ingredientsRes] = await Promise.all([
        fetch('/api/recipes', { headers: authHeaders() }).catch(() => null),
        fetch('/api/ingredients', { headers: authHeaders() }).catch(() => null),
      ]);

      let recipes: any[] = [];
      let ingredients: any[] = [];

      if (recipesRes && recipesRes.ok) {
        const data = await recipesRes.json();
        recipes = Array.isArray(data) ? data : (data.recipes || data.data || []);
      }
      if (ingredientsRes && ingredientsRes.ok) {
        const data = await ingredientsRes.json();
        ingredients = Array.isArray(data) ? data : (data.ingredients || data.data || []);
      }

      // Compute summary
      const totalRecipes = recipes.length;
      const estimatedRevenue = recipes.reduce((sum: number, r: any) => sum + (r.sellingPrice || 0), 0);
      const margins = recipes.filter((r: any) => r.margin?.marginPercent != null).map((r: any) => r.margin.marginPercent);
      const averageMargin = margins.length > 0 ? margins.reduce((a: number, b: number) => a + b, 0) / margins.length : 0;

      let bestRecipe: { name: string; margin: number } | null = null;
      for (const r of recipes) {
        const m = r.margin?.marginPercent ?? 0;
        if (!bestRecipe || m > bestRecipe.margin) {
          bestRecipe = { name: r.name, margin: m };
        }
      }

      // Critical stock: ingredients with low stock alerts
      const criticalStockCount = ingredients.filter((i: any) => {
        if (i.minStock != null && i.currentStock != null) return i.currentStock <= i.minStock;
        return false;
      }).length;

      setDailySummary({ totalRecipes, estimatedRevenue, averageMargin, bestRecipe, criticalStockCount });
    } catch {
      // silently fail
    }
  }, [authHeaders]);

  function formatAuditAction(action: string, entityType: string): string {
    const actionMap: Record<string, string> = {
      create: 'a cree',
      update: 'a modifie',
      delete: 'a supprime',
      import: 'a importe',
    };
    const entityMap: Record<string, string> = {
      recipe: 'la recette',
      ingredient: "l'ingredient",
      inventory: "l'inventaire",
      supplier: 'le fournisseur',
      menu: 'le menu',
    };
    const verb = actionMap[action] || action;
    const entity = entityMap[entityType] || entityType;
    return `${verb} ${entity}`;
  }

  function buildBriefing(notifs: Notification[]) {
    const marginNotifs = notifs.filter(n => n.type === 'margin');
    const stockCritical = notifs.filter(n => n.type === 'stock' && n.severity === 'critical');
    const priceChanges = notifs.filter(n => n.type === 'price');

    // Find lowest margin recipe from messages
    let lowestMargin: { name: string; margin: number } | null = null;
    for (const mn of marginNotifs) {
      const match = mn.message.match(/([\d.]+)%/);
      if (match) {
        const margin = parseFloat(match[1]);
        if (!lowestMargin || margin < lowestMargin.margin) {
          const nameMatch = mn.title.replace(/Marge faible:\s*/, '');
          lowestMargin = { name: nameMatch, margin };
        }
      }
    }

    const parts: string[] = [];
    if (stockCritical.length > 0) parts.push(`${stockCritical.length} rupture${stockCritical.length > 1 ? 's' : ''} de stock`);
    if (priceChanges.length > 0) parts.push(`${priceChanges.length} variation${priceChanges.length > 1 ? 's' : ''} de prix`);
    if (lowestMargin) parts.push(`marge min. ${Number(lowestMargin.margin || 0).toFixed(0)}% (${lowestMargin.name})`);

    setBriefing({
      lowestMarginRecipe: lowestMargin,
      criticalStockCount: stockCritical.length,
      priceChangesCount: priceChanges.length,
      totalAlerts: notifs.filter(n => n.severity !== 'info').length,
      summary: parts.length > 0 ? parts.join(' · ') : 'Tout est en ordre aujourd\'hui.',
    });
  }

  function playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not available
    }
  }

  // Fetch on mount and every 2 minutes
  useEffect(() => {
    fetchNotifications();
    fetchDailySummary();
    const interval = setInterval(() => { fetchNotifications(); fetchDailySummary(); }, 120000);
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchDailySummary]);

  // Close panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowPrefs(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        setShowPrefs(false);
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [open]);

  // ── Actions ──
  function markAsRead(id: string) {
    const updated = new Set(readIds);
    updated.add(id);
    setReadIds(updated);
    saveReadIds(updated);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    const updated = new Set(readIds);
    notifications.forEach(n => updated.add(n.id));
    setReadIds(updated);
    saveReadIds(updated);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function togglePref(type: NotifType) {
    const updated = { ...prefs, [type]: !prefs[type] };
    setPrefs(updated);
    savePrefs(updated);
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(STORAGE_SOUND_KEY, String(next));
  }

  // ── Filtered notifications ──
  const visibleNotifications = notifications.filter(n => {
    if (!prefs[n.type]) return false;
    if (activeTab !== 'all' && n.type !== activeTab) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !readIds.has(n.id) && prefs[n.type]).length;
  const criticalCount = notifications.filter(n => n.severity === 'critical' && !readIds.has(n.id)).length;

  // Count per type for tabs
  const typeCounts: Record<string, number> = {
    all: notifications.filter(n => !readIds.has(n.id) && prefs[n.type]).length,
    stock: notifications.filter(n => n.type === 'stock' && !readIds.has(n.id)).length,
    price: notifications.filter(n => n.type === 'price' && !readIds.has(n.id)).length,
    margin: notifications.filter(n => n.type === 'margin' && !readIds.has(n.id)).length,
    team: notifications.filter(n => n.type === 'team' && !readIds.has(n.id)).length,
    system: notifications.filter(n => n.type === 'system' && !readIds.has(n.id)).length,
  };

  return (
    <>
      {/* ── Bell Button ── */}
      <button
        ref={bellRef}
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
        aria-label={`Centre de notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1 ${criticalCount > 0 ? 'animate-pulse' : ''}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-[70]"
          onClick={() => { setOpen(false); setShowPrefs(false); }}
        />
      )}

      {/* ── Dropdown Panel ── */}
      {open && (
      <div
        ref={panelRef}
        className="fixed top-14 right-4 w-[380px] max-h-[70vh] bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-2xl shadow-black/20 z-[80] flex flex-col overflow-hidden"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-white flex items-center justify-center">
              <Bell className="w-4 h-4 text-white dark:text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111111] dark:text-white">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
              title={soundEnabled ? 'Desactiver le son' : 'Activer le son'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {/* Preferences */}
            <button
              onClick={() => setShowPrefs(!showPrefs)}
              className={`p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors ${showPrefs ? 'bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
              title="Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
            {/* Mark all read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {/* Close */}
            <button
              onClick={() => { setOpen(false); setShowPrefs(false); }}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Preferences Panel ── */}
        {showPrefs && (
          <div className="px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex-shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-2">
              Types de notifications
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(typeConfig) as NotifType[]).map(type => {
                const cfg = typeConfig[type];
                return (
                  <button
                    key={type}
                    onClick={() => togglePref(type)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      prefs[type]
                        ? 'border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-black'
                        : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373] hover:border-[#9CA3AF] dark:hover:border-[#525252]'
                    }`}
                  >
                    <cfg.icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Resume du Jour Card (teal gradient) ── */}
        {dailySummary && !showPrefs && (
          <div className="mx-4 mt-4 mb-2 p-4 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-500 dark:to-teal-700 flex-shrink-0 shadow-lg shadow-teal-600/20">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Resume du jour
              </span>
            </div>

            {/* Main stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-white/15 rounded-lg p-2 text-center">
                <ShoppingCart className="w-3.5 h-3.5 text-white/80 mx-auto mb-0.5" />
                <div className="text-lg font-bold text-white tabular-nums">{dailySummary.totalRecipes}</div>
                <div className="text-[9px] text-white/70 font-medium">recettes</div>
              </div>
              <div className="bg-white/15 rounded-lg p-2 text-center">
                <DollarSign className="w-3.5 h-3.5 text-white/80 mx-auto mb-0.5" />
                <div className="text-lg font-bold text-white tabular-nums">{formatCurrency(dailySummary.estimatedRevenue)}</div>
                <div className="text-[9px] text-white/70 font-medium">CA estime</div>
              </div>
              <div className="bg-white/15 rounded-lg p-2 text-center">
                <TrendingUp className="w-3.5 h-3.5 text-white/80 mx-auto mb-0.5" />
                <div className="text-lg font-bold text-white tabular-nums">{dailySummary.averageMargin.toFixed(1)}%</div>
                <div className="text-[9px] text-white/70 font-medium">marge moy.</div>
              </div>
            </div>

            {/* Best seller & critical stock */}
            <div className="space-y-1.5">
              {dailySummary.bestRecipe && (
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  <span className="text-[11px] text-white/90 truncate">
                    Meilleure vente : <strong className="text-white">{dailySummary.bestRecipe.name}</strong>
                    <span className="text-emerald-300 ml-1">({dailySummary.bestRecipe.margin.toFixed(1)}%)</span>
                  </span>
                </div>
              )}
              {dailySummary.criticalStockCount > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 rounded-lg px-3 py-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-300 flex-shrink-0" />
                  <span className="text-[11px] text-white/90">
                    Stock critique : <strong className="text-red-200">{dailySummary.criticalStockCount} ingredient{dailySummary.criticalStockCount > 1 ? 's' : ''}</strong>
                  </span>
                </div>
              )}
              {dailySummary.criticalStockCount === 0 && (
                <div className="flex items-center gap-2 bg-emerald-500/20 rounded-lg px-3 py-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                  <span className="text-[11px] text-white/90">Stocks OK</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Daily Briefing Card ── */}
        {briefing && briefing.totalAlerts > 0 && !showPrefs && (
          <div className="mx-4 mt-4 mb-2 p-4 rounded-xl bg-gradient-to-br from-[#111111] to-[#1a1a2e] dark:from-white dark:to-[#f0f0f5] flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span className="text-xs font-bold text-white dark:text-black uppercase tracking-wider">
                Briefing du jour
              </span>
            </div>
            <p className="text-sm text-[#E5E7EB] dark:text-[#374151] leading-relaxed">
              {briefing.summary}
            </p>
            <div className="flex items-center gap-3 mt-3">
              {briefing.criticalStockCount > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/20">
                  <Package className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-bold text-red-400">{briefing.criticalStockCount}</span>
                </div>
              )}
              {briefing.priceChangesCount > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/20">
                  <TrendingUp className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400">{briefing.priceChangesCount}</span>
                </div>
              )}
              {briefing.lowestMarginRecipe && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/20">
                  <AlertTriangle className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] font-bold text-purple-400">{Number(briefing.lowestMarginRecipe.margin || 0).toFixed(0)}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Category Tabs ── */}
        {!showPrefs && (
          <div className="flex items-center gap-1 px-4 py-2 border-b border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto no-scrollbar flex-shrink-0">
            <TabButton
              active={activeTab === 'all'}
              label="Tout"
              count={typeCounts.all}
              onClick={() => setActiveTab('all')}
            />
            {(Object.keys(typeConfig) as NotifType[]).filter(t => prefs[t]).map(type => (
              <TabButton
                key={type}
                active={activeTab === type}
                label={typeConfig[type].label}
                count={typeCounts[type]}
                onClick={() => setActiveTab(type)}
                color={typeConfig[type].color}
              />
            ))}
          </div>
        )}

        {/* ── Notifications List ── */}
        <div className="flex-1 overflow-y-auto">
          {loading && notifications.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-[#9CA3AF] dark:text-[#737373]" />
            </div>
          )}

          {!loading && visibleNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-[#D1D5DB] dark:text-[#525252]" />
              </div>
              <p className="text-sm font-semibold text-[#6B7280] dark:text-[#A3A3A3]">Aucune notification</p>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 text-center">
                Tout est en ordre ! Les alertes stock, prix et marges apparaitront ici.
              </p>
            </div>
          )}

          {visibleNotifications.length > 0 && (
            <div>
              {/* Critical pinned section */}
              {activeTab === 'all' && visibleNotifications.some(n => n.severity === 'critical' && !readIds.has(n.id)) && (
                <div className="px-4 py-2 bg-red-500/5 dark:bg-red-500/5 border-b border-red-500/10">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                      Actions urgentes
                    </span>
                  </div>
                </div>
              )}

              {visibleNotifications.map((notif, idx) => {
                const config = typeConfig[notif.type];
                const sev = severityStyles[notif.severity] || severityStyles.info;
                const isUnread = !readIds.has(notif.id);
                const isCritical = notif.severity === 'critical' && isUnread;
                const Icon = config.icon;

                // Insert section divider between critical and non-critical
                const prevNotif = idx > 0 ? visibleNotifications[idx - 1] : null;
                const showDivider = activeTab === 'all' &&
                  prevNotif?.severity === 'critical' && !readIds.has(prevNotif.id) &&
                  (notif.severity !== 'critical' || readIds.has(notif.id));

                return (
                  <div key={notif.id}>
                    {showDivider && (
                      <div className="px-4 py-2 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#9CA3AF] dark:text-[#737373]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373]">
                            Autres notifications
                          </span>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all border-l-4 ${config.border} border-b border-[#F3F4F6] dark:border-[#0A0A0A] last:border-b-0 ${
                        isCritical
                          ? 'bg-red-500/[0.03] dark:bg-red-500/[0.03]'
                          : isUnread
                            ? 'bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#111111]'
                            : 'bg-white dark:bg-black hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] opacity-60'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5 ${isCritical ? sev.pulse : ''}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${isUnread ? 'font-semibold text-[#111111] dark:text-white' : 'font-medium text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                            {notif.title}
                          </p>
                          {isUnread && (
                            <span className={`w-2 h-2 rounded-full ${sev.dot} flex-shrink-0 ${isCritical ? sev.pulse : ''}`} />
                          )}
                        </div>
                        <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-[#D1D5DB] dark:text-[#525252]">
                            {timeAgo(notif.createdAt)}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${config.badgeBg}`}>
                            {config.label}
                          </span>
                          {notif.severity !== 'info' && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              notif.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {sev.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Read indicator */}
                      {isUnread && (
                        <div className="flex-shrink-0 mt-1">
                          <Check className="w-3.5 h-3.5 text-[#D1D5DB] dark:text-[#525252]" />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => { setOpen(false); window.location.href = '/settings'; }}
            className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Preferences
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-medium text-[#111111] dark:text-white hover:text-[#6B7280] dark:hover:text-[#A3A3A3] transition-colors px-3 py-1.5 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A]"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      )}

      {/* ── Keyframe & utility styles ── */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

// ── Tab Button sub-component ──────────────────────────────────────
function TabButton({ active, label, count, onClick, color }: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
          : 'text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] hover:text-[#6B7280] dark:hover:text-[#A3A3A3]'
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold rounded-full px-1 ${
          active
            ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
            : 'bg-red-500/10 text-red-500'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}
