import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getToken, getActiveRestaurantId } from '../services/api';

interface ActiveUser {
  userId: number;
  name: string;
  page: string;
  lastSeen: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Map route paths to French page names
const PAGE_NAMES: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/ingredients': 'Ingredients',
  '/recipes': 'Recettes',
  '/suppliers': 'Fournisseurs',
  '/inventory': 'Inventaire',
  '/menu': 'Carte',
  '/station': 'Station Balance',
  '/settings': 'Parametres',
  '/users': 'Utilisateurs',
  '/invoices': 'Factures',
  '/mercuriale': 'Mercuriale',
  '/menu-engineering': 'Menu Engineering',
  '/auto-orders': 'Commandes auto',
  '/planning': 'Planning',
  '/messagerie': 'Messagerie',
  '/restaurants': 'Restaurants',
  '/marketplace': 'Marketplace',
  '/waste': 'Gaspillage',
  '/qr-menu': 'QR Menu',
  '/integrations': 'Integrations',
  '/seminaires': 'Seminaires',
  '/devis': 'Devis',
  '/comptabilite': 'Comptabilite',
  '/clients': 'Clients',
  '/haccp': 'HACCP',
  '/ai': 'Assistant IA',
  '/rfq': 'Appels d\'offre',
  '/promo': 'Promotions',
  '/subscription': 'Abonnement',
};

function getPageName(path: string): string {
  // Exact match first
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  // Try prefix match for nested routes like /recipes/123
  const base = '/' + path.split('/').filter(Boolean)[0];
  return PAGE_NAMES[base] || path;
}

// Deterministic color from userId
const AVATAR_COLORS = [
  '#111111', '#374151', '#4B5563', '#1F2937',
  '#0F172A', '#1E293B', '#334155', '#475569',
];

function getAvatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

export default function ActiveUsers() {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const { user } = useAuth();
  const location = useLocation();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

  const currentPage = location.pathname;

  const sendHeartbeat = useCallback(async () => {
    const token = getToken();
    const restaurantId = getActiveRestaurantId();
    if (!token || !restaurantId) return;
    try {
      await fetch(`${API_BASE}/presence/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Restaurant-Id': restaurantId,
        },
        body: JSON.stringify({
          page: currentPage,
          restaurantId: Number(restaurantId),
          name: user?.name || user?.email || 'Utilisateur',
        }),
      });
    } catch {
      // Silent fail — presence is non-critical
    }
  }, [currentPage, user]);

  const fetchActive = useCallback(async () => {
    const token = getToken();
    const restaurantId = getActiveRestaurantId();
    if (!token || !restaurantId) return;
    try {
      const res = await fetch(`${API_BASE}/presence/active`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Restaurant-Id': restaurantId,
        },
      });
      if (res.ok) {
        const data: ActiveUser[] = await res.json();
        setUsers(data);
      }
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    // Initial heartbeat + fetch
    sendHeartbeat();
    fetchActive();

    // Poll every 30s
    intervalRef.current = setInterval(() => {
      sendHeartbeat();
      fetchActive();
    }, 30_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sendHeartbeat, fetchActive]);

  // Also send heartbeat when page changes
  useEffect(() => {
    sendHeartbeat();
  }, [currentPage, sendHeartbeat]);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((u) => {
          const samePage = u.page === currentPage;
          const initials = getInitials(u.name);
          const pageName = getPageName(u.page);

          return (
            <div
              key={u.userId}
              className="relative"
              onMouseEnter={() => setHoveredUserId(u.userId)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-black cursor-default transition-transform hover:scale-110 hover:z-10"
                style={{ backgroundColor: getAvatarColor(u.userId), color: '#FFFFFF' }}
                title={`${u.name} — ${pageName}`}
              >
                {initials}
              </div>

              {/* Status dot */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-black ${
                  samePage ? 'bg-[#111111] dark:bg-white' : 'bg-[#9CA3AF] dark:bg-[#737373]'
                }`}
              />

              {/* Tooltip */}
              {hoveredUserId === u.userId && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-black text-[11px] font-medium rounded-lg whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {u.name} — {pageName}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#111111] dark:border-t-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overflow count */}
      {users.length > 5 && (
        <span className="text-[11px] font-medium text-[#9CA3AF] dark:text-[#737373] ml-1">
          +{users.length - 5}
        </span>
      )}
    </div>
  );
}
