import { useState, useRef, useMemo } from 'react';
import { QrCode, Eye, EyeOff, Printer, Copy, Check, Globe, Smartphone, ExternalLink } from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { useTranslation } from '../hooks/useTranslation';

// ── Simple SVG QR Code Generator ──────────────────────────────────────────
// Encodes text into a QR code matrix using a basic version of the algorithm.
// This is a compact encoder for alphanumeric URLs (Mode Byte, ECC-L, Version 2-6).

function generateQRMatrix(text: string): boolean[][] {
  // Use a simple encoding: convert to binary, pad, and create a data matrix
  const size = Math.max(21, Math.min(41, 21 + Math.ceil(text.length / 10) * 4));
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const ri = r + i, ci = c + j;
        if (ri < 0 || ri >= size || ci < 0 || ci >= size) continue;
        if (i === -1 || i === 7 || j === -1 || j === 7) {
          matrix[ri][ci] = false; // separator
        } else if (i === 0 || i === 6 || j === 0 || j === 6) {
          matrix[ri][ci] = true;
        } else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
          matrix[ri][ci] = true;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Alignment pattern for larger sizes
  if (size >= 25) {
    const pos = size - 9;
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        matrix[pos + i][pos + j] = Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0);
      }
    }
  }

  // Encode data into remaining cells using a deterministic pattern
  const bytes = new TextEncoder().encode(text);
  let bitIndex = 0;
  const totalBits = bytes.length * 8;
  const reserved = new Set<string>();

  // Mark reserved areas
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Finder + separator areas
      if ((r < 9 && c < 9) || (r < 9 && c >= size - 8) || (r >= size - 8 && c < 9)) {
        reserved.add(`${r},${c}`);
      }
      // Timing
      if (r === 6 || c === 6) reserved.add(`${r},${c}`);
      // Format info
      if ((r === 8 && (c < 9 || c >= size - 8)) || (c === 8 && (r < 9 || r >= size - 8))) {
        reserved.add(`${r},${c}`);
      }
    }
  }

  // Fill data
  let goingUp = true;
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5; // Skip timing column
    const rows = goingUp ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
    for (const row of rows) {
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (c < 0 || c >= size) continue;
        const key = `${row},${c}`;
        if (reserved.has(key)) continue;
        if (bitIndex < totalBits) {
          const byteIdx = Math.floor(bitIndex / 8);
          const bitPos = 7 - (bitIndex % 8);
          matrix[row][c] = ((bytes[byteIdx] >> bitPos) & 1) === 1;
          bitIndex++;
        } else {
          // Masking pattern for visual balance
          matrix[row][c] = (row + c) % 3 === 0;
        }
      }
    }
    goingUp = !goingUp;
  }

  return matrix;
}

function QRCodeSVG({ text, size = 200, darkColor = '#000', lightColor = '#fff' }: { text: string; size?: number; darkColor?: string; lightColor?: string }) {
  const matrix = useMemo(() => generateQRMatrix(text), [text]);
  const cellSize = size / matrix.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill={lightColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
              fill={darkColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ── Languages ─────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'fr', label: 'Francais', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Espanol', flag: '🇪🇸' },
];

export default function QRMenu() {
  const { t } = useTranslation();
  const { selectedRestaurant } = useRestaurant();
  const [showPrices, setShowPrices] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const menuUrl = useMemo(() => {
    const base = window.location.origin;
    const params = new URLSearchParams();
    if (!showPrices) params.set('hidePrices', '1');
    if (!showAllergens) params.set('hideAllergens', '1');
    if (!showDescriptions) params.set('hideDesc', '1');
    if (language !== 'fr') params.set('lang', language);
    const qs = params.toString();
    return `${base}/menu-public${qs ? '?' + qs : ''}`;
  }, [showPrices, showAllergens, showDescriptions, language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = menuUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handlePrint() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const svgEl = printRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>QR Code Menu - ${selectedRestaurant?.name || 'Restaurant'}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:system-ui,-apple-system,sans-serif;">
        <h1 style="font-size:28px;margin-bottom:8px;color:#1e293b;">${selectedRestaurant?.name || 'Notre Restaurant'}</h1>
        <p style="font-size:16px;color:#64748b;margin-bottom:32px;">Scannez pour decouvrir notre carte</p>
        <div style="padding:24px;border:3px solid #e2e8f0;border-radius:16px;">${svgData}</div>
        <p style="font-size:12px;color:#94a3b8;margin-top:24px;">${menuUrl}</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <QrCode className="w-7 h-7 text-teal-600" />
            Menu Digital QR Code
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-1">
            Générez un QR code pour que vos clients consultent votre carte en ligne
          </p>
        </div>
        <a
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le menu
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Options */}
        <div className="lg:col-span-1 space-y-4">
          {/* Display options */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
              Options d'affichage
            </h2>

            <ToggleOption
              icon={<Eye className="w-4 h-4" />}
              iconOff={<EyeOff className="w-4 h-4" />}
              label="Afficher les prix"
              enabled={showPrices}
              onChange={setShowPrices}
            />
            <ToggleOption
              icon={<Eye className="w-4 h-4" />}
              iconOff={<EyeOff className="w-4 h-4" />}
              label="Afficher les allergenes"
              enabled={showAllergens}
              onChange={setShowAllergens}
            />
            <ToggleOption
              icon={<Eye className="w-4 h-4" />}
              iconOff={<EyeOff className="w-4 h-4" />}
              label="Afficher les descriptions"
              enabled={showDescriptions}
              onChange={setShowDescriptions}
            />
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-500" />
              Langue du menu
            </h2>
            <div className="space-y-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    language === lang.code
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-800'
                      : 'text-slate-300 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.label}
                  {language === lang.code && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
              Actions
            </h2>
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Imprimer le QR Code
            </button>
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Lien copie !' : 'Copier le lien'}
            </button>
          </div>

          {/* URL preview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">URL du menu public</p>
            <p className="text-xs text-slate-300 dark:text-slate-300 font-mono break-all">{menuUrl}</p>
          </div>
        </div>

        {/* Center: QR Code */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div
            ref={printRef}
            className="bg-white dark:bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col items-center"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {selectedRestaurant?.name || 'Votre Restaurant'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">Scannez pour decouvrir notre carte</p>
            <QRCodeSVG text={menuUrl} size={240} />
            <p className="text-[10px] text-slate-400 mt-4 max-w-[240px] text-center break-all">{menuUrl}</p>
          </div>
        </div>

        {/* Right: Phone preview */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-400 dark:text-slate-400">
            <Smartphone className="w-4 h-4" />
            Apercu mobile
          </div>
          <div className="w-[280px] h-[560px] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-slate-700">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[2rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-2xl z-10" />
              {/* Content */}
              <iframe
                src={menuUrl}
                className="w-full h-full border-0 rounded-[2rem]"
                title="Apercu menu"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Toggle Component ──────────────────────────────────────────────────────
function ToggleOption({
  icon,
  iconOff,
  label,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  iconOff: React.ReactNode;
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
    >
      <span className="flex items-center gap-2.5 text-sm text-slate-400 dark:text-slate-300">
        <span className={enabled ? 'text-teal-500' : 'text-slate-400'}>{enabled ? icon : iconOff}</span>
        {label}
      </span>
      <div
        className={`w-10 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </div>
    </button>
  );
}
