import { useState, useEffect } from 'react';
import { CloudOff, RefreshCw } from 'lucide-react';

/**
 * OfflineSyncBar — shows pending offline actions that need syncing.
 * Currently a placeholder that watches for queued mutations in localStorage.
 * Future: integrate with Background Sync API.
 */
export default function OfflineSyncBar() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const checkPending = () => {
      try {
        const queue = JSON.parse(localStorage.getItem('offline-queue') || '[]');
        setPendingCount(queue.length);
      } catch {
        setPendingCount(0);
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);
    return () => clearInterval(interval);
  }, []);

  if (pendingCount === 0) return null;

  const handleSync = async () => {
    setSyncing(true);
    // Future: process offline queue here
    setTimeout(() => {
      localStorage.setItem('offline-queue', '[]');
      setPendingCount(0);
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border-b border-[#E5E7EB] dark:border-[#1A1A1A] px-4 py-2 flex items-center justify-center gap-3 text-sm no-print">
      <CloudOff className="w-4 h-4 text-amber-500" />
      <span className="text-[#737373] dark:text-[#A3A3A3]">
        {pendingCount} action{pendingCount > 1 ? 's' : ''} en attente de synchronisation
      </span>
      <button
        onClick={handleSync}
        disabled={syncing}
        className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-500 font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Sync...' : 'Synchroniser'}
      </button>
    </div>
  );
}
