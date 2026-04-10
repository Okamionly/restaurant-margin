import { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function ConnectivityBar() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOfflineRef.current) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
      wasOfflineRef.current = false;
    };

    const handleOffline = () => {
      setIsOnline(false);
      wasOfflineRef.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Offline banner
  if (!isOnline) {
    return (
      <div className="bg-amber-500 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium animate-slideDown no-print">
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        <span>Vous etes hors ligne. Les donnees seront synchronisees a la reconnexion.</span>
      </div>
    );
  }

  // Reconnected flash
  if (showReconnected) {
    return (
      <div
        className="bg-emerald-500 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium no-print"
        style={{ animation: 'connectivity-flash 3s ease-out forwards' }}
      >
        <Wifi className="w-4 h-4 flex-shrink-0" />
        <span>Connexion retablie</span>
        <style>{`
          @keyframes connectivity-flash {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; max-height: 0; padding: 0; overflow: hidden; }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
