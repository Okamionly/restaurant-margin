import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Package, TrendingUp, AlertTriangle, Info, Check, ChevronRight, X, Loader2 } from 'lucide-react';
import { getToken, getActiveRestaurantId } from '../services/api';

interface Notification {
  id: string;
  type: 'stock' | 'price' | 'margin' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  severity?: 'critical' | 'warning' | 'info';
}

interface GroupedNotifications {
  stock: Notification[];
  price: Notification[];
  margin: Notification[];
  system: Notification[];
}

const STORAGE_KEY = 'rm-notifications-read';

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "A l'instant";
  if (minutes < 60) return `Il y a ${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
}

const typeConfig = {
  stock: { icon: Package, label: 'Stock', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  price: { icon: TrendingUp, label: 'Prix', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  margin: { icon: AlertTriangle, label: 'Marges', color: 'text-red-500', bg: 'bg-red-500/10' },
  system: { icon: Info, label: 'Systeme', color: 'text-[#6B7280] dark:text-[#A3A3A3]', bg: 'bg-[#F3F4F6] dark:bg-[#171717]' },
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(getReadIds);
  const ref = useRef<HTMLDivElement>(null);

  const authHeaders = useCallback((): Record<string, string> => {
    const token = getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const rid = getActiveRestaurantId();
    if (rid) headers['X-Restaurant-Id'] = rid;
    return headers;
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const items: Notification[] = (data.notifications || []).map((n: any) => ({
        ...n,
        read: readIds.has(n.id),
      }));
      setNotifications(items);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [authHeaders, readIds]);

  // Fetch on mount and every 2 minutes
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const grouped: GroupedNotifications = {
    stock: notifications.filter(n => n.type === 'stock'),
    price: notifications.filter(n => n.type === 'price'),
    margin: notifications.filter(n => n.type === 'margin'),
    system: notifications.filter(n => n.type === 'system'),
  };

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

  function renderGroup(type: keyof typeof typeConfig, items: Notification[]) {
    if (items.length === 0) return null;
    const config = typeConfig[type];
    const Icon = config.icon;

    return (
      <div key={type}>
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#9CA3AF] dark:text-[#737373]">
            {config.label}
          </span>
          <span className="ml-auto text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373]">
            {items.filter(i => !i.read).length > 0 ? items.filter(i => !i.read).length : ''}
          </span>
        </div>
        {items.map(notif => {
          const isUnread = !notif.read;
          return (
            <button
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-[#F3F4F6] dark:border-[#0A0A0A] last:border-b-0 ${
                isUnread
                  ? 'bg-[#F9FAFB] dark:bg-[#0A0A0A]'
                  : 'bg-white dark:bg-black hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A]'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm truncate ${isUnread ? 'font-semibold text-[#111111] dark:text-white' : 'font-medium text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                    {notif.title}
                  </p>
                  {isUnread && (
                    <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5 truncate">
                  {notif.message}
                </p>
                <p className="text-[10px] text-[#D1D5DB] dark:text-[#525252] mt-1">
                  {timeAgo(notif.createdAt)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors"
        aria-label={`Centre de notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed right-4 top-16 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-2xl shadow-black/10 dark:shadow-black/40 z-[60] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#111111] dark:text-white" />
              <span className="text-sm font-semibold text-[#111111] dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#171717]"
                >
                  <Check className="w-3 h-3" />
                  Marquer tout comme lu
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading && notifications.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-[#9CA3AF] dark:text-[#737373]" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-[#D1D5DB] dark:text-[#525252]" />
                </div>
                <p className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">Aucune notification</p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Tout est en ordre !</p>
              </div>
            )}

            {notifications.length > 0 && (
              <>
                {renderGroup('stock', grouped.stock)}
                {renderGroup('price', grouped.price)}
                {renderGroup('margin', grouped.margin)}
                {renderGroup('system', grouped.system)}
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] px-4 py-2.5">
              <button
                onClick={() => { setOpen(false); window.location.href = '/notifications'; }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors py-1"
              >
                Voir tout
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
