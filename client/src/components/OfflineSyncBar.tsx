import { useState, useEffect, useCallback } from 'react';
import { CloudOff, RefreshCw } from 'lucide-react';
import { compterFileHorsLigne, rejouerFileHorsLigne } from '../services/api';

/**
 * OfflineSyncBar — ecritures faites hors ligne qui attendent le reseau.
 *
 * FIX 2026-09-25 : cette barre lisait une file localStorage ('offline-queue') que
 * rien n'ecrivait, et son bouton la vidait apres 1,5 s sans rien envoyer. Les
 * vraies ecritures hors ligne vivent dans IndexedDB (services/offlineStore.ts) :
 * la barre compte CELLES-LA, et les rejoue au retour du reseau, au montage, et
 * sur clic.
 */
export default function OfflineSyncBar() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const recompter = useCallback(async () => {
    setPendingCount(await compterFileHorsLigne());
  }, []);

  const synchroniser = useCallback(async () => {
    setSyncing(true);
    try {
      const bilan = await rejouerFileHorsLigne();
      setPendingCount(bilan.restantes);
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Au montage : rejouer ce qui serait reste d'une session precedente.
    if (navigator.onLine) synchroniser(); else recompter();
    const auRetourDuReseau = () => { synchroniser(); };
    window.addEventListener('online', auRetourDuReseau);
    // Les ecritures mises en file pendant la session apparaissent sans attendre.
    const interval = setInterval(recompter, 5000);
    return () => {
      window.removeEventListener('online', auRetourDuReseau);
      clearInterval(interval);
    };
  }, [recompter, synchroniser]);

  if (pendingCount === 0) return null;

  return (
    <div className="bg-mono-975 dark:bg-mono-50 border-b border-mono-900 dark:border-mono-200 px-4 py-2 flex items-center justify-center gap-3 text-sm no-print">
      <CloudOff className="w-4 h-4 text-amber-500" />
      <span className="text-mono-500 dark:text-mono-700">
        {pendingCount} modification{pendingCount > 1 ? 's' : ''} faite{pendingCount > 1 ? 's' : ''} hors ligne en attente d'envoi
      </span>
      <button
        onClick={synchroniser}
        disabled={syncing}
        className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-500 font-medium transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Envoi...' : 'Envoyer maintenant'}
      </button>
    </div>
  );
}
