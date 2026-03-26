import { useState, useCallback, useRef } from 'react';

// Mi Body Scale 2 (XMTZC05M) BLE Protocol
const MI_SCALE_SERVICE = '0000181b-0000-1000-8000-00805f9b34fb';
const MI_SCALE_CHARACTERISTIC = '00002a9c-0000-1000-8000-00805f9b34fb';

export type ScaleStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'unsupported';

export interface ScaleReading {
  weight: number;   // kg
  stable: boolean;
  raw?: string;     // for debug
}

export function useScale() {
  const [status, setStatus] = useState<ScaleStatus>('disconnected');
  const [reading, setReading] = useState<ScaleReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const charRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  function parseMiScale2(data: DataView): ScaleReading {
    // Mi Body Scale 2 (XMTZC05M) BLE protocol
    // Byte 0-1: Flags (uint16 LE)
    //   Bit 0: Imperial (lbs), Bit 4: jin, else kg
    //   Bit 5: stabilized
    //   Bit 7: weight removed
    // Byte 1-6: Timestamp (year LE, month, day, hour, min, sec)
    // Last 2 bytes: Weight (uint16 LE)
    //   kg mode: value / 200
    //   lbs mode: value / 100

    const raw = Array.from({ length: data.byteLength }, (_, i) => data.getUint8(i).toString(16).padStart(2, '0')).join(' ');

    if (data.byteLength < 10) {
      return { weight: 0, stable: false, raw };
    }

    const ctrlByte = data.getUint8(0);
    const ctrlByte2 = data.getUint8(1);
    const stable = !!((ctrlByte | ctrlByte2) & 0x20);
    const isLbs = !!(ctrlByte & 0x01);
    const isJin = !!(ctrlByte & 0x10);

    // Weight is always in the last 2 bytes, little-endian
    const rawWeight = data.getUint16(data.byteLength - 2, true);

    let weight: number;
    if (isLbs) {
      weight = rawWeight / 100; // lbs
    } else if (isJin) {
      weight = rawWeight / 100; // jin → convert to kg
      weight = weight * 0.5; // 1 jin = 0.5 kg
    } else {
      weight = rawWeight / 200; // kg
    }

    return { weight: Math.round(weight * 1000) / 1000, stable, raw };
  }

  const connect = useCallback(async () => {
    if (!isSupported) {
      setStatus('unsupported');
      setError('Web Bluetooth non supporté. Utilisez Chrome sur Android.');
      return;
    }

    setStatus('connecting');
    setError(null);

    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { namePrefix: 'MIBCS' },
          { namePrefix: 'MI SCALE' },
          { services: [MI_SCALE_SERVICE] },
        ],
        optionalServices: [MI_SCALE_SERVICE],
      });

      deviceRef.current = device;

      device.addEventListener('gattserverdisconnected', () => {
        setStatus('disconnected');
        setReading(null);
      });

      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(MI_SCALE_SERVICE);
      const characteristic = await service.getCharacteristic(MI_SCALE_CHARACTERISTIC);
      charRef.current = characteristic;

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const data: DataView = event.target.value;
        const reading = parseMiScale2(data);
        setReading(reading);
      });

      await characteristic.startNotifications();
      setStatus('connected');
    } catch (e: any) {
      if (e.name === 'NotFoundError') {
        setStatus('disconnected');
        setError('Balance non trouvée. Vérifiez que la balance est allumée.');
      } else {
        setStatus('error');
        setError(e.message || 'Erreur de connexion Bluetooth');
      }
    }
  }, [isSupported]);

  const disconnect = useCallback(async () => {
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
  }, []);

  return { status, reading, error, isSupported, connect, disconnect };
}
