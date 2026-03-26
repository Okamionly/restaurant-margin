import { useState, useEffect, useCallback } from 'react';

interface ConnectivityState {
  isOnline: boolean;
  isBluetoothAvailable: boolean;
  isBluetoothConnected: boolean;
  lastSync: Date | null;
  refreshSync: () => void;
}

export function useConnectivity(): ConnectivityState {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(() => new Date());

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Bluetooth availability check
  useEffect(() => {
    const bt = (navigator as any).bluetooth;
    if (!bt) {
      setIsBluetoothAvailable(false);
      return;
    }

    setIsBluetoothAvailable(true);

    // Check if getDevices is supported (returns previously paired devices)
    if (typeof bt.getDevices === 'function') {
      bt.getDevices()
        .then((devices: any[]) => {
          setIsBluetoothConnected(devices.length > 0);
        })
        .catch(() => {
          setIsBluetoothConnected(false);
        });
    }
  }, []);

  const refreshSync = useCallback(() => {
    setLastSync(new Date());
  }, []);

  return {
    isOnline,
    isBluetoothAvailable,
    isBluetoothConnected,
    lastSync,
    refreshSync,
  };
}
