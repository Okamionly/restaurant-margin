import { useState } from 'react';
import { Wifi, WifiOff, Bluetooth, BluetoothOff, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useConnectivity } from '../hooks/useConnectivity';

function formatTimeSince(date: Date | null): string {
  if (!date) return 'Jamais';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "à l'instant";
  if (seconds < 60) return `il y a ${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `il y a ${hours}h`;
}

export default function ConnectivityBar() {
  const { isOnline, isBluetoothAvailable, isBluetoothConnected, lastSync, refreshSync } = useConnectivity();
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800/50 border-b dark:border-slate-700 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-1.5 py-1 text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <ChevronDown className="w-3 h-3" />
            <span>Connectivit&eacute;</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 border-b dark:border-slate-700 no-print">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
        {/* Status indicators */}
        <div className="flex items-center gap-4 text-[11px]">
          {/* WiFi status */}
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Wifi className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-400 font-medium">Connect&eacute;</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <WifiOff className="w-3 h-3 text-red-500 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 font-medium">Hors ligne</span>
              </>
            )}
          </div>

          {/* Bluetooth status */}
          <div className="flex items-center gap-1.5">
            {isBluetoothAvailable && isBluetoothConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <Bluetooth className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-400 font-medium hidden sm:inline">
                  Balance connect&eacute;e
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                <BluetoothOff className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span className="text-slate-500 dark:text-slate-500 hidden sm:inline">
                  Balance d&eacute;connect&eacute;e
                </span>
              </>
            )}
          </div>

          {/* Sync status */}
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span>Derni&egrave;re sync :</span>
            <span className="font-medium">{formatTimeSince(lastSync)}</span>
            <button
              onClick={refreshSync}
              className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Rafra&icirc;chir la synchronisation"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(true)}
          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 dark:text-slate-500"
          title="Masquer la barre"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
