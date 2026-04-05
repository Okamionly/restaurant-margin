import { useState, useCallback, useRef, useEffect } from 'react';

// ─── BLE Service & Characteristic UUIDs ───
// Generic Weight Scale Profile (WSP)
const WEIGHT_SCALE_SERVICE = 0x181D;
const WEIGHT_MEASUREMENT_CHAR = 0x2A9D;

// Mi Body Scale 2 (XMTZC05M) — uses a non-standard service
const MI_SCALE_SERVICE = '0000181b-0000-1000-8000-00805f9b34fb';
const MI_SCALE_CHARACTERISTIC = '00002a9c-0000-1000-8000-00805f9b34fb';

// Device type detected after connection
type ScaleType = 'generic' | 'mi-scale' | 'unknown';

export type ScaleStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'unsupported' | 'reconnecting';

export interface ScaleReading {
  weight: number;   // always in kg
  stable: boolean;
  unit?: string;    // original unit from the scale
  raw?: string;     // hex dump for debugging
  timestamp?: number;
}

const KIOSK_KEY = 'weighstation_kiosk';
const AUTO_RECONNECT_KEY = 'weighstation_auto_reconnect';

export function useScale() {
  const [status, setStatus] = useState<ScaleStatus>('disconnected');
  const [reading, setReading] = useState<ScaleReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [scaleType, setScaleType] = useState<ScaleType>('unknown');
  const [kioskMode, setKioskMode] = useState(() => localStorage.getItem(KIOSK_KEY) === 'true');
  const [autoReconnect, setAutoReconnect] = useState(() => localStorage.getItem(AUTO_RECONNECT_KEY) !== 'false');

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const charRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentionalDisconnect = useRef(false);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  const isSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  // Persist kiosk preference
  useEffect(() => {
    localStorage.setItem(KIOSK_KEY, kioskMode ? 'true' : 'false');
  }, [kioskMode]);

  useEffect(() => {
    localStorage.setItem(AUTO_RECONNECT_KEY, autoReconnect ? 'true' : 'false');
  }, [autoReconnect]);

  // ─── Generic Weight Measurement (0x2A9D) Parser ───
  // Bluetooth SIG Weight Measurement characteristic
  // Byte 0: Flags
  //   Bit 0: Measurement Units (0 = SI kg, 1 = Imperial lbs)
  //   Bit 1: Time Stamp present
  //   Bit 2: User ID present
  //   Bit 3: BMI & Height present
  // Bytes 1-2: Weight (uint16 LE)
  //   SI: resolution 0.005 kg (value * 0.005)
  //   Imperial: resolution 0.01 lb (value * 0.01)
  function parseGenericWeight(data: DataView): ScaleReading {
    const raw = Array.from({ length: data.byteLength }, (_, i) =>
      data.getUint8(i).toString(16).padStart(2, '0')
    ).join(' ');

    if (data.byteLength < 3) {
      return { weight: 0, stable: false, raw, timestamp: Date.now() };
    }

    const flags = data.getUint8(0);
    const isImperial = !!(flags & 0x01);
    const rawWeight = data.getUint16(1, true);

    let weightKg: number;
    let unit = 'kg';

    if (isImperial) {
      const lbs = rawWeight * 0.01;
      weightKg = lbs * 0.45359237;
      unit = 'lbs';
    } else {
      weightKg = rawWeight * 0.005;
    }

    // Many BLE scales set the MSB or use a specific flag for stability.
    // A common convention: if measurement keeps repeating the same value, it is stable.
    // Some scales include an "is final" flag. We use a simple heuristic:
    // If weight > 0, consider stable (generic scales typically only notify on stable readings).
    const stable = weightKg > 0;

    return {
      weight: Math.round(weightKg * 1000) / 1000,
      stable,
      unit,
      raw,
      timestamp: Date.now(),
    };
  }

  // ─── Mi Body Scale 2 Parser ───
  function parseMiScale2(data: DataView): ScaleReading {
    const raw = Array.from({ length: data.byteLength }, (_, i) =>
      data.getUint8(i).toString(16).padStart(2, '0')
    ).join(' ');

    if (data.byteLength < 10) {
      return { weight: 0, stable: false, raw, timestamp: Date.now() };
    }

    const ctrlByte = data.getUint8(0);
    const ctrlByte2 = data.getUint8(1);
    const stable = !!((ctrlByte | ctrlByte2) & 0x20);
    const isLbs = !!(ctrlByte & 0x01);
    const isJin = !!(ctrlByte & 0x10);

    const rawWeight = data.getUint16(data.byteLength - 2, true);

    let weight: number;
    let unit = 'kg';
    if (isLbs) {
      weight = rawWeight / 100;
      unit = 'lbs';
      weight = weight * 0.45359237; // convert to kg
    } else if (isJin) {
      weight = (rawWeight / 100) * 0.5;
    } else {
      weight = rawWeight / 200;
    }

    return {
      weight: Math.round(weight * 1000) / 1000,
      stable,
      unit,
      raw,
      timestamp: Date.now(),
    };
  }

  // ─── Try to reconnect to a previously connected device ───
  const tryReconnect = useCallback(async () => {
    const device = deviceRef.current;
    if (!device || !device.gatt || intentionalDisconnect.current) return;
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      setStatus('error');
      setError(`Reconnexion echouee apres ${MAX_RECONNECT_ATTEMPTS} tentatives.`);
      reconnectAttempts.current = 0;
      return;
    }

    reconnectAttempts.current += 1;
    setStatus('reconnecting');
    setError(null);

    try {
      const server = await device.gatt.connect();

      // Try generic service first, then Mi Scale
      let characteristic: BluetoothRemoteGATTCharacteristic | null = null;
      let detectedType: ScaleType = 'unknown';

      try {
        const service = await server.getPrimaryService(WEIGHT_SCALE_SERVICE);
        characteristic = await service.getCharacteristic(WEIGHT_MEASUREMENT_CHAR);
        detectedType = 'generic';
      } catch {
        try {
          const service = await server.getPrimaryService(MI_SCALE_SERVICE);
          characteristic = await service.getCharacteristic(MI_SCALE_CHARACTERISTIC);
          detectedType = 'mi-scale';
        } catch {
          throw new Error('Service balance non trouve sur cet appareil.');
        }
      }

      if (!characteristic) {
        throw new Error('Service balance non trouve sur cet appareil.');
      }

      charRef.current = characteristic;
      setScaleType(detectedType);

      const parser = detectedType === 'mi-scale' ? parseMiScale2 : parseGenericWeight;

      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value: DataView = target.value!;
        setReading(parser(value));
      });

      await characteristic.startNotifications();
      setStatus('connected');
      reconnectAttempts.current = 0;
    } catch {
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 16000);
      reconnectTimerRef.current = setTimeout(() => tryReconnect(), delay);
    }
  }, []);

  // ─── Connect to a BLE scale ───
  const connect = useCallback(async () => {
    if (!isSupported) {
      setStatus('unsupported');
      setError('Web Bluetooth non supporte sur ce navigateur. Utilisez Chrome sur Android ou Chrome Desktop (HTTPS requis).');
      return;
    }

    setStatus('connecting');
    setError(null);
    intentionalDisconnect.current = false;
    reconnectAttempts.current = 0;

    try {
      // Request device with broad filters to support many BLE scales
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { services: [WEIGHT_SCALE_SERVICE] },          // Generic weight scales
          { services: [MI_SCALE_SERVICE] },               // Mi Scale 2
          { namePrefix: 'MIBCS' },                        // Mi Body Composition Scale
          { namePrefix: 'MI SCALE' },                     // Mi Scale variants
          { namePrefix: 'Scale' },                        // Generic "Scale" devices
          { namePrefix: 'BLE Scale' },                    // Common BLE scales
          { namePrefix: 'Etekcity' },                     // Etekcity scales
          { namePrefix: 'RENPHO' },                       // Renpho scales
          { namePrefix: 'Eufy' },                         // Eufy scales
          { namePrefix: 'Wyze' },                         // Wyze scales
        ],
        optionalServices: [WEIGHT_SCALE_SERVICE, MI_SCALE_SERVICE],
      });

      deviceRef.current = device;
      setDeviceName(device.name || 'Balance BLE');

      // Listen for disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setReading(null);
        if (!intentionalDisconnect.current && autoReconnect) {
          tryReconnect();
        } else {
          setStatus('disconnected');
        }
      });

      const server = await device.gatt!.connect();

      // Auto-detect scale type: try generic first, then Mi Scale
      let characteristic: BluetoothRemoteGATTCharacteristic | null = null;
      let detectedType: ScaleType = 'unknown';

      try {
        const service = await server.getPrimaryService(WEIGHT_SCALE_SERVICE);
        characteristic = await service.getCharacteristic(WEIGHT_MEASUREMENT_CHAR);
        detectedType = 'generic';
      } catch {
        // Generic service not found, try Mi Scale
        try {
          const service = await server.getPrimaryService(MI_SCALE_SERVICE);
          characteristic = await service.getCharacteristic(MI_SCALE_CHARACTERISTIC);
          detectedType = 'mi-scale';
        } catch {
          throw new Error('Aucun service de balance reconnu sur cet appareil. Verifiez la compatibilite BLE.');
        }
      }

      if (!characteristic) {
        throw new Error('Aucun service de balance reconnu sur cet appareil. Verifiez la compatibilite BLE.');
      }

      charRef.current = characteristic;
      setScaleType(detectedType);

      const parser = detectedType === 'mi-scale' ? parseMiScale2 : parseGenericWeight;

      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value: DataView = target.value!;
        setReading(parser(value));
      });

      await characteristic.startNotifications();
      setStatus('connected');
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'NotFoundError') {
        // User cancelled the picker
        setStatus('disconnected');
        setError(null);
      } else if (e instanceof DOMException && e.name === 'SecurityError') {
        setStatus('error');
        setError('Bluetooth bloque. La page doit etre en HTTPS et les permissions Bluetooth activees.');
      } else if (e instanceof DOMException && e.name === 'NetworkError') {
        setStatus('error');
        setError('Connexion Bluetooth perdue. Verifiez que la balance est allumee et a portee.');
      } else {
        setStatus('error');
        const message = e instanceof Error ? e.message : 'Erreur de connexion Bluetooth inconnue.';
        setError(message);
      }
    }
  }, [isSupported, autoReconnect, tryReconnect]);

  // ─── Disconnect ───
  const disconnect = useCallback(async () => {
    intentionalDisconnect.current = true;

    // Cancel any pending reconnection
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    try {
      if (charRef.current) {
        await charRef.current.stopNotifications().catch(() => {});
      }
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
    } catch {}

    deviceRef.current = null;
    charRef.current = null;
    setStatus('disconnected');
    setReading(null);
    setDeviceName(null);
    setScaleType('unknown');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, []);

  return {
    status,
    reading,
    error,
    isSupported,
    deviceName,
    scaleType,
    kioskMode,
    setKioskMode,
    autoReconnect,
    setAutoReconnect,
    connect,
    disconnect,
  };
}
