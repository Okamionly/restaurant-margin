import { useState, useEffect, useCallback, useRef } from 'react';
import { WifiOff, RefreshCw, Check, CloudOff } from 'lucide-react';
import { getPendingActions, clearPendingActions, removePendingAction, type PendingAction } from '../services/offlineStore';

type SyncStatus = 'online' | 'offline' | 'syncing' | 'synced';

export default function OfflineSyncBar() {
  const [status, setStatus] = useState<SyncStatus>(() => navigator.onLine ? 'online' : 'offline');
  const [pendingCount, setPendingCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncingRef = useRef(false);
  const syncedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Poll pending actions count periodically
  const refreshPendingCount = useCallback(async () => {
    try {
      const actions = await getPendingActions();
      setPendingCount(actions.length);
    } catch {
      // IndexedDB may not be available
    }
  }, []);

  // Sync pending actions to server
  const syncPendingActions = useCallback(async () => {
    if (syncingRef.current || !navigator.onLine) return;
    syncingRef.current = true;
    setStatus('syncing');
    setSyncError(null);

    try {
      const actions = await getPendingActions();
      if (actions.length === 0) {
        setStatus('synced');
        syncingRef.current = false;
        return;
      }

      let failedCount = 0;
      for (const action of actions) {
        try {
          const response = await fetch(action.url, {
            method: action.method,
            headers: action.headers || { 'Content-Type': 'application/json' },
            body: action.body,
          });

          if (response.ok || response.status === 404) {
            // Success or resource already deleted -- remove from queue
            if (action.id !== undefined) {
              await removePendingAction(action.id);
            }
          } else if (response.status === 401) {
            // Auth expired -- clear all pending and redirect
            await clearPendingActions();
            break;
          } else {
            failedCount++;
          }
        } catch {
          // Network error during sync -- stop trying
          failedCount++;
          break;
        }
      }

      await refreshPendingCount();

      if (failedCount > 0) {
        setSyncError(`${failedCount} action(s) non synchronisee(s)`);
        setStatus('offline');
      } else {
        setStatus('synced');
        // After showing "synced" for 3 seconds, go back to online
        if (syncedTimerRef.current) clearTimeout(syncedTimerRef.current);
        syncedTimerRef.current = setTimeout(() => {
          setStatus((prev) => (prev === 'synced' ? 'online' : prev));
        }, 3000);
      }
    } catch {
      setStatus('offline');
    } finally {
      syncingRef.current = false;
    }
  }, [refreshPendingCount]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setStatus('online');
      // Auto-sync when connection is restored
      syncPendingActions();
    };
    const handleOffline = () => {
      setStatus('offline');
      if (syncedTimerRef.current) clearTimeout(syncedTimerRef.current);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncedTimerRef.current) clearTimeout(syncedTimerRef.current);
    };
  }, [syncPendingActions]);

  // Poll pending count every 5 seconds
  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 5000);
    return () => clearInterval(interval);
  }, [refreshPendingCount]);

  // Auto-sync on mount if online and has pending actions
  useEffect(() => {
    if (navigator.onLine && pendingCount > 0) {
      syncPendingActions();
    }
  }, [pendingCount, syncPendingActions]);

  // Don't show bar when online with no pending actions and not synced state
  if (status === 'online' && pendingCount === 0) {
    return null;
  }

  return (
    <div
      className={`no-print transition-all duration-300 ${
        status === 'synced'
          ? 'bg-emerald-500 text-white'
          : status === 'syncing'
          ? 'bg-blue-500 text-white'
          : 'bg-amber-500 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-[12px]">
        <div className="flex items-center gap-2">
          {status === 'synced' ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span className="font-medium">Synchronise</span>
            </>
          ) : status === 'syncing' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="font-medium">Synchronisation en cours...</span>
            </>
          ) : pendingCount > 0 ? (
            <>
              <CloudOff className="w-3.5 h-3.5" />
              <span className="font-medium">
                Mode hors-ligne &mdash; {pendingCount} action{pendingCount > 1 ? 's' : ''} en attente
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="font-medium">Mode hors-ligne</span>
            </>
          )}
          {syncError && (
            <span className="ml-2 text-white/80 text-[11px]">({syncError})</span>
          )}
        </div>

        {/* Manual sync button */}
        {status !== 'syncing' && status !== 'synced' && pendingCount > 0 && navigator.onLine && (
          <button
            onClick={syncPendingActions}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors text-[11px] font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Synchroniser
          </button>
        )}
      </div>
    </div>
  );
}
