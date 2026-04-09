import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getToken, getActiveRestaurantId } from '../services/api';

// ---- Types ----

export interface ActiveUser {
  userId: number;
  name: string;
  page: string;
  lastSeen: string;
}

export interface AuditEntry {
  id: number;
  userId: number;
  userName: string;
  action: string;
  label: string;
  timestamp: string;
  restaurantId: number;
}

interface CollaborationContextType {
  /** All currently active users (including self) */
  activeUsers: ActiveUser[];
  /** Count of active users */
  activeCount: number;
  /** Set of page paths with other users on them (excluding self) */
  pagesWithUsers: Set<string>;
  /** Users on the same page as current user (excluding self) */
  usersOnSamePage: ActiveUser[];
  /** Recent audit entries (new since last check) */
  recentAudit: AuditEntry[];
  /** Acknowledge/clear a single audit toast by id */
  dismissAudit: (id: number) => void;
  /** Report an action to the audit log */
  reportAction: (action: string, label: string) => void;
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ---- Map route paths to French page names ----

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
  '/scanner-factures': 'Factures',
  '/mercuriale': 'Mercuriale',
  '/menu-engineering': 'Menu Engineering',
  '/commandes': 'Commandes auto',
  '/planning': 'Planning',
  '/messagerie': 'Messagerie',
  '/restaurants': 'Restaurants',
  '/marketplace': 'Marketplace',
  '/gaspillage': 'Gaspillage',
  '/qr-menu': 'QR Menu',
  '/integrations': 'Integrations',
  '/seminaires': 'Seminaires',
  '/devis': 'Devis',
  '/comptabilite': 'Comptabilite',
  '/clients': 'Clients',
  '/haccp': 'HACCP',
  '/assistant': 'Assistant IA',
  '/rfqs': "Appels d'offre",
  '/promo': 'Promotions',
  '/abonnement': 'Abonnement',
  '/analytics': 'Analytiques',
  '/allergen-matrix': 'Allergenes',
  '/feedback': 'Avis clients',
  '/menu-calendar': 'Menu Calendrier',
  '/recettes-semaine': 'Recettes semaine',
  '/actualites': 'Actualites IA',
};

export function getPageName(path: string): string {
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  const base = '/' + path.split('/').filter(Boolean)[0];
  return PAGE_NAMES[base] || path;
}

// ---- Deterministic avatar colors (W&B) ----

const AVATAR_COLORS = [
  '#111111', '#374151', '#4B5563', '#1F2937',
  '#0F172A', '#1E293B', '#334155', '#475569',
];

export function getAvatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

// ---- Audit action labels ----

const ACTION_LABELS: Record<string, string> = {
  recipe_created: 'a cree une recette',
  recipe_updated: 'a modifie une recette',
  recipe_deleted: 'a supprime une recette',
  ingredient_created: 'a ajoute un ingredient',
  ingredient_updated: 'a modifie un ingredient',
  stock_updated: 'a mis a jour le stock',
  order_created: 'a cree une commande',
  supplier_created: 'a ajoute un fournisseur',
  menu_updated: 'a modifie la carte',
  invoice_scanned: 'a scanne une facture',
};

export function formatAuditMessage(entry: AuditEntry): string {
  const verb = ACTION_LABELS[entry.action] || entry.action;
  const label = entry.label ? `: ${entry.label}` : '';
  return `${entry.userName} ${verb}${label}`;
}

// ---- Provider ----

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  const currentPage = location.pathname;

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [recentAudit, setRecentAudit] = useState<AuditEntry[]>([]);
  const lastAuditCheckRef = useRef<string>(new Date().toISOString());
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const auditRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- Heartbeat (every 30s) ----

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
      // Silent
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
        setActiveUsers(data);
      }
    } catch {
      // Silent
    }
  }, []);

  // ---- Audit log poll (every 15s) ----

  const fetchAuditLog = useCallback(async () => {
    const token = getToken();
    const restaurantId = getActiveRestaurantId();
    if (!token || !restaurantId) return;
    try {
      const since = encodeURIComponent(lastAuditCheckRef.current);
      const res = await fetch(`${API_BASE}/presence/audit-log?limit=5&since=${since}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Restaurant-Id': restaurantId,
        },
      });
      if (res.ok) {
        const entries: AuditEntry[] = await res.json();
        // Only show entries from OTHER users
        const myId = user?.id;
        const fromOthers = entries.filter(e => e.userId !== myId);
        if (fromOthers.length > 0) {
          setRecentAudit(prev => {
            const ids = new Set(prev.map(e => e.id));
            const newOnes = fromOthers.filter(e => !ids.has(e.id));
            return [...prev, ...newOnes].slice(-10); // keep last 10
          });
        }
      }
      lastAuditCheckRef.current = new Date().toISOString();
    } catch {
      // Silent
    }
  }, [user]);

  // ---- Start/stop polling ----

  useEffect(() => {
    sendHeartbeat();
    fetchActive();
    fetchAuditLog();

    heartbeatRef.current = setInterval(() => {
      sendHeartbeat();
      fetchActive();
    }, 30_000);

    auditRef.current = setInterval(() => {
      fetchAuditLog();
    }, 15_000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (auditRef.current) clearInterval(auditRef.current);
    };
  }, [sendHeartbeat, fetchActive, fetchAuditLog]);

  // Heartbeat on page change
  useEffect(() => {
    sendHeartbeat();
  }, [currentPage, sendHeartbeat]);

  // ---- Derived state ----

  const myId = user?.id;

  const pagesWithUsers = new Set<string>();
  const usersOnSamePage: ActiveUser[] = [];

  for (const u of activeUsers) {
    if (u.userId !== myId) {
      pagesWithUsers.add(u.page);
      // Normalize page comparison: /recipes/123 => /recipes
      const uBase = '/' + u.page.split('/').filter(Boolean)[0];
      const myBase = '/' + currentPage.split('/').filter(Boolean)[0];
      if (uBase === myBase) {
        usersOnSamePage.push(u);
      }
    }
  }

  // ---- Actions ----

  const dismissAudit = useCallback((id: number) => {
    setRecentAudit(prev => prev.filter(e => e.id !== id));
  }, []);

  const reportAction = useCallback(async (action: string, label: string) => {
    const token = getToken();
    const restaurantId = getActiveRestaurantId();
    if (!token || !restaurantId) return;
    try {
      await fetch(`${API_BASE}/presence/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Restaurant-Id': restaurantId,
        },
        body: JSON.stringify({
          action,
          label,
          userName: user?.name || user?.email || 'Utilisateur',
          restaurantId: Number(restaurantId),
        }),
      });
    } catch {
      // Silent
    }
  }, [user]);

  const value: CollaborationContextType = {
    activeUsers,
    activeCount: activeUsers.length,
    pagesWithUsers,
    usersOnSamePage,
    recentAudit,
    dismissAudit,
    reportAction,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration(): CollaborationContextType {
  const ctx = useContext(CollaborationContext);
  if (!ctx) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return ctx;
}
