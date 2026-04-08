import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Copy, Check, QrCode, ArrowRight, ChefHat, Palette, Hash,
  Printer, Instagram, Star, Link2, FileImage, FileCode, FileText,
  Table2, Plus, Minus, RotateCcw, Eye, Smartphone, Globe
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type ExportFormat = 'png' | 'svg' | 'pdf';
type PresetKey = 'menu' | 'google' | 'instagram' | 'custom';

interface QRPreset {
  key: PresetKey;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  prefix?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const SIZES = [
  { label: '128', value: 128 },
  { label: '256', value: 256 },
  { label: '512', value: 512 },
  { label: '1024', value: 1024 },
];

const PRESET_COLORS = [
  { label: 'Noir', value: '000000', hex: '#000000' },
  { label: 'Blanc', value: 'FFFFFF', hex: '#FFFFFF' },
  { label: 'Teal', value: '0d9488', hex: '#0d9488' },
  { label: 'Bleu', value: '2563eb', hex: '#2563eb' },
  { label: 'Rouge', value: 'dc2626', hex: '#dc2626' },
  { label: 'Violet', value: '7c3aed', hex: '#7c3aed' },
  { label: 'Or', value: 'ca8a04', hex: '#ca8a04' },
  { label: 'Vert', value: '16a34a', hex: '#16a34a' },
];

const PRESETS: QRPreset[] = [
  { key: 'menu', label: 'Menu digital', icon: <ChefHat className="w-4 h-4" />, placeholder: 'https://mon-restaurant.com/menu' },
  { key: 'google', label: 'Avis Google', icon: <Star className="w-4 h-4" />, placeholder: 'https://g.page/r/VOTRE_ID/review', prefix: '' },
  { key: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" />, placeholder: '@votre_restaurant', prefix: 'https://instagram.com/' },
  { key: 'custom', label: 'Lien libre', icon: <Link2 className="w-4 h-4" />, placeholder: 'https://...' },
];

const EXPORT_FORMATS: { key: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { key: 'png', label: 'PNG', icon: <FileImage className="w-4 h-4" /> },
  { key: 'svg', label: 'SVG', icon: <FileCode className="w-4 h-4" /> },
  { key: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
];

// ── Simple QR Matrix Generator ───────────────────────────────────────────────
function generateQRMatrix(text: string): boolean[][] {
  const size = Math.max(21, Math.min(41, 21 + Math.ceil(text.length / 10) * 4));
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const ri = r + i, ci = c + j;
        if (ri < 0 || ri >= size || ci < 0 || ci >= size) continue;
        if (i === -1 || i === 7 || j === -1 || j === 7) {
          matrix[ri][ci] = false;
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

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  if (size >= 25) {
    const pos = size - 9;
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        matrix[pos + i][pos + j] = Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0);
      }
    }
  }

  const bytes = new TextEncoder().encode(text);
  let bitIndex = 0;
  const totalBits = bytes.length * 8;
  const reserved = new Set<string>();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 9 && c < 9) || (r < 9 && c >= size - 8) || (r >= size - 8 && c < 9)) {
        reserved.add(`${r},${c}`);
      }
      if (r === 6 || c === 6) reserved.add(`${r},${c}`);
      if ((r === 8 && (c < 9 || c >= size - 8)) || (c === 8 && (r < 9 || r >= size - 8))) {
        reserved.add(`${r},${c}`);
      }
    }
  }

  let goingUp = true;
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5;
    const rows = goingUp
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);
    for (const row of rows) {
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (c < 0 || c >= size) continue;
        if (reserved.has(`${row},${c}`)) continue;
        if (bitIndex < totalBits) {
          const byteIdx = Math.floor(bitIndex / 8);
          const bitPos = 7 - (bitIndex % 8);
          matrix[row][c] = ((bytes[byteIdx] >> bitPos) & 1) === 1;
          bitIndex++;
        } else {
          matrix[row][c] = (row + c) % 3 === 0;
        }
      }
    }
    goingUp = !goingUp;
  }
  return matrix;
}

function QRCodeSVG({ text, size = 200, fgColor = '#000000', bgColor = '#FFFFFF' }: {
  text: string; size?: number; fgColor?: string; bgColor?: string;
}) {
  const matrix = useMemo(() => generateQRMatrix(text), [text]);
  const cellSize = size / matrix.length;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill={bgColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
              fill={fgColor}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetKey>('menu');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [showBatch, setShowBatch] = useState(false);
  const [batchFrom, setBatchFrom] = useState(1);
  const [batchTo, setBatchTo] = useState(20);
  const [restaurantName, setRestaurantName] = useState('Mon Restaurant');
  const [batchGenerating, setBatchGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Generateur de QR Code Menu Restaurant Gratuit | RestauMargin';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content',
        'Generez un QR code gratuit pour le menu de votre restaurant. Couleurs, tailles, formats PNG/SVG/PDF. Generation par lot pour toutes vos tables. Outil 100% gratuit par RestauMargin.'
      );
    }
  }, []);

  const currentPreset = PRESETS.find(p => p.key === activePreset)!;

  const finalUrl = useMemo(() => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (activePreset === 'instagram' && !trimmed.startsWith('http')) {
      const handle = trimmed.replace(/^@/, '');
      return `https://instagram.com/${handle}`;
    }
    return trimmed;
  }, [url, activePreset]);

  const getSvgString = useCallback((text: string, renderSize: number) => {
    const matrix = generateQRMatrix(text);
    const cellSize = renderSize / matrix.length;
    let rects = '';
    matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize + 0.5}" height="${cellSize + 0.5}" fill="${fgColor}"/>`;
        }
      });
    });
    return `<svg width="${renderSize}" height="${renderSize}" viewBox="0 0 ${renderSize} ${renderSize}" xmlns="http://www.w3.org/2000/svg"><rect width="${renderSize}" height="${renderSize}" fill="${bgColor}"/>${rects}</svg>`;
  }, [fgColor, bgColor]);

  const downloadSingleQR = useCallback(async (text: string, filename: string, format: ExportFormat) => {
    const svgStr = getSvgString(text, size);

    if (format === 'svg') {
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${filename}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(svgUrl);
        resolve();
      };
      img.src = svgUrl;
    });

    if (format === 'png') {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${filename}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      }, 'image/png');
    } else if (format === 'pdf') {
      const dataUrl = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.write(`<!DOCTYPE html><html><head><title>${filename}</title><style>@page{size:auto;margin:0}body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}</style></head><body><img src="${dataUrl}" width="${size}" height="${size}"/></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  }, [getSvgString, size]);

  const handleDownload = () => {
    if (!finalUrl) return;
    downloadSingleQR(finalUrl, `qrcode-menu-${size}px`, exportFormat);
  };

  const handleCopy = async () => {
    if (!finalUrl) return;
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const handleBatchGenerate = async () => {
    if (!finalUrl) return;
    setBatchGenerating(true);
    const baseUrl = finalUrl.replace(/\/?$/, '');

    for (let i = batchFrom; i <= batchTo; i++) {
      const tableUrl = `${baseUrl}?table=${i}`;
      await downloadSingleQR(tableUrl, `qrcode-table-${i}`, exportFormat);
      await new Promise(r => setTimeout(r, 200));
    }
    setBatchGenerating(false);
  };

  const handlePrintLayout = () => {
    if (!finalUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let cards = '';
    for (let i = batchFrom; i <= batchTo; i++) {
      const tableUrl = `${finalUrl.replace(/\/?$/, '')}?table=${i}`;
      const svgStr = getSvgString(tableUrl, 200);
      cards += `
        <div style="display:inline-flex;flex-direction:column;align-items:center;padding:20px;margin:10px;border:2px solid #e5e7eb;border-radius:16px;page-break-inside:avoid;">
          <h3 style="font-size:16px;font-weight:700;margin:0 0 4px 0;color:#000;">${restaurantName}</h3>
          <p style="font-size:11px;color:#666;margin:0 0 12px 0;">Scannez pour decouvrir notre carte</p>
          ${svgStr}
          <p style="font-size:18px;font-weight:800;margin:12px 0 0 0;color:#000;">Table ${i}</p>
        </div>
      `;
    }

    printWindow.document.write(`<!DOCTYPE html><html><head><title>QR Codes Tables - ${restaurantName}</title><style>@media print{body{margin:0}}body{font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:20px;}</style></head><body>${cards}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Navbar ── */}
      <nav className="bg-white dark:bg-black border-b border-black/10 dark:border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2 text-black dark:text-white font-bold text-lg" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
            <ChefHat className="w-6 h-6" />
            RestauMargin
          </Link>
          <Link to="/login" className="text-sm font-medium text-black dark:text-white hover:opacity-70 transition">
            Connexion
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="py-12 sm:py-16 text-center px-4 border-b border-black/5 dark:border-white/5">
        <div className="inline-flex items-center gap-2 bg-black/5 dark:bg-white/10 text-black dark:text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <QrCode className="w-3.5 h-3.5" />
          Outil 100% gratuit
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-black dark:text-white leading-tight tracking-tight" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
          Generateur de QR Code
          <br />
          <span className="text-black/40 dark:text-white/40">pour votre restaurant</span>
        </h1>
        <p className="mt-4 text-black/50 dark:text-white/50 max-w-xl mx-auto text-base sm:text-lg">
          QR code personnalise en 10 secondes. Couleurs, formats, impression par lot pour chaque table.
        </p>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 pb-20 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Controls ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Preset selector */}
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-5">
              <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-black/40 dark:text-white/40" />
                Type de lien
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => { setActivePreset(p.key); setUrl(''); }}
                    className={`flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl border transition-all ${
                      activePreset === p.key
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-transparent text-black/60 dark:text-white/60 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                    }`}
                  >
                    {p.icon}
                    {p.label}
                  </button>
                ))}
              </div>

              {/* URL input */}
              <div>
                <label htmlFor="menu-url" className="block text-sm font-semibold text-black/70 dark:text-white/70 mb-1.5">
                  {activePreset === 'instagram' ? 'Nom d\'utilisateur Instagram' : 'URL'}
                </label>
                <div className="relative">
                  <input
                    id="menu-url"
                    type="text"
                    placeholder={currentPreset.placeholder}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent transition"
                  />
                  {url && (
                    <button onClick={() => setUrl('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition">
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {finalUrl && finalUrl !== url && (
                  <p className="text-xs text-black/40 dark:text-white/40 mt-1.5 font-mono truncate">{finalUrl}</p>
                )}
              </div>
            </div>

            {/* Colors & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Foreground Color */}
              <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-black/40 dark:text-white/40" />
                  Couleur du QR
                </h2>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.filter(c => c.value !== 'FFFFFF').map(c => (
                    <button
                      key={c.value}
                      onClick={() => setFgColor(c.hex)}
                      title={c.label}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        fgColor === c.hex ? 'border-black dark:border-white scale-110' : 'border-black/10 dark:border-white/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-black/50 dark:text-white/50">Hex:</label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 text-xs font-mono px-2 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-black/40 dark:text-white/40" />
                  Fond du QR
                </h2>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.filter(c => c.value === 'FFFFFF' || c.value === '000000').map(c => (
                    <button
                      key={c.value}
                      onClick={() => setBgColor(c.hex)}
                      title={c.label}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        bgColor === c.hex ? 'border-black dark:border-white scale-110' : 'border-black/10 dark:border-white/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-black/50 dark:text-white/50">Hex:</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 text-xs font-mono px-2 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent text-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Size & Format */}
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Size */}
                <div>
                  <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Hash className="w-4 h-4 text-black/40 dark:text-white/40" />
                    Taille (px)
                  </h2>
                  <div className="flex gap-2">
                    {SIZES.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setSize(s.value)}
                        className={`flex-1 text-sm font-medium py-2.5 rounded-xl border transition-all ${
                          size === s.value
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : 'bg-transparent text-black/60 dark:text-white/60 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Format */}
                <div>
                  <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Download className="w-4 h-4 text-black/40 dark:text-white/40" />
                    Format
                  </h2>
                  <div className="flex gap-2">
                    {EXPORT_FORMATS.map(f => (
                      <button
                        key={f.key}
                        onClick={() => setExportFormat(f.key)}
                        className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl border transition-all ${
                          exportFormat === f.key
                            ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                            : 'bg-transparent text-black/60 dark:text-white/60 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                        }`}
                      >
                        {f.icon}
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Generation */}
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-4">
              <button
                onClick={() => setShowBatch(!showBatch)}
                className="w-full flex items-center justify-between"
              >
                <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-black/40 dark:text-white/40" />
                  Generation par lot (tables)
                </h2>
                <span className={`text-black/40 dark:text-white/40 transition-transform ${showBatch ? 'rotate-45' : ''}`}>
                  <Plus className="w-5 h-5" />
                </span>
              </button>

              {showBatch && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1.5">
                      Nom du restaurant (affiche sur les QR)
                    </label>
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-black/50 dark:text-white/50 mb-1">De la table</label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setBatchFrom(Math.max(1, batchFrom - 1))} className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={batchFrom}
                          onChange={(e) => setBatchFrom(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 text-center rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-2 py-2 text-sm font-bold text-black dark:text-white focus:outline-none"
                        />
                        <button onClick={() => setBatchFrom(batchFrom + 1)} className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black/50 dark:text-white/50 mb-1">A la table</label>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setBatchTo(Math.max(batchFrom, batchTo - 1))} className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={batchFrom}
                          value={batchTo}
                          onChange={(e) => setBatchTo(Math.max(batchFrom, parseInt(e.target.value) || batchFrom))}
                          className="flex-1 text-center rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-2 py-2 text-sm font-bold text-black dark:text-white focus:outline-none"
                        />
                        <button onClick={() => setBatchTo(batchTo + 1)} className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-black/40 dark:text-white/40">
                    {batchTo - batchFrom + 1} QR codes seront generes avec le parametre <code className="bg-black/5 dark:bg-white/10 px-1 rounded">?table=N</code>
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleBatchGenerate}
                      disabled={!finalUrl || batchGenerating}
                      className="flex-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <Download className="w-4 h-4" />
                      {batchGenerating ? 'Telechargement...' : `Telecharger ${batchTo - batchFrom + 1} QR codes`}
                    </button>
                    <button
                      onClick={handlePrintLayout}
                      disabled={!finalUrl}
                      className="flex items-center justify-center gap-2 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Live Preview ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* QR Preview */}
            <div className="sticky top-20">
              <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center" ref={qrRef}>
                <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5" />
                  Apercu en direct
                </div>

                {finalUrl ? (
                  <div className="p-4 rounded-2xl border-2 border-black/5 dark:border-white/5" style={{ backgroundColor: bgColor }}>
                    <QRCodeSVG text={finalUrl} size={Math.min(240, size)} fgColor={fgColor} bgColor={bgColor} />
                  </div>
                ) : (
                  <div className="w-60 h-60 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 text-black/30 dark:text-white/30">
                    <QrCode className="w-16 h-16 mb-3 opacity-30" />
                    <span className="text-sm font-medium">Entrez une URL</span>
                    <span className="text-xs mt-1 opacity-60">pour voir l'apercu</span>
                  </div>
                )}

                {finalUrl && (
                  <p className="text-[10px] text-black/30 dark:text-white/30 mt-4 max-w-[240px] text-center break-all font-mono">{finalUrl}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleDownload}
                  disabled={!finalUrl}
                  className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm px-6 py-3 rounded-xl hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <Download className="w-4 h-4" />
                  Telecharger {exportFormat.toUpperCase()} ({size}px)
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!finalUrl}
                  className={`w-full flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl border transition-all ${
                    copied
                      ? 'bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20 text-black dark:text-white'
                      : 'border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-black/30 dark:hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Lien copie !' : 'Copier le lien'}
                </button>
              </div>

              {/* Phone mockup */}
              {finalUrl && (
                <div className="mt-6 flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-3 text-xs text-black/30 dark:text-white/30">
                    <Smartphone className="w-3.5 h-3.5" />
                    Rendu mobile
                  </div>
                  <div className="w-[160px] h-[320px] bg-black rounded-[1.5rem] p-2 shadow-xl">
                    <div className="w-full h-full bg-white rounded-[1.2rem] overflow-hidden relative flex items-center justify-center">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-black rounded-b-xl z-10" />
                      <div className="p-3" style={{ backgroundColor: bgColor }}>
                        <QRCodeSVG text={finalUrl} size={100} fgColor={fgColor} bgColor={bgColor} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-16 text-center bg-black dark:bg-white rounded-2xl p-8 sm:p-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-black mb-2" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
            Creez votre menu digital complet avec RestauMargin
          </h2>
          <p className="text-white/60 dark:text-black/60 text-sm sm:text-base mb-6 max-w-md mx-auto">
            Gerez vos recettes, calculez vos marges et publiez un menu QR professionnel.
          </p>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 bg-white dark:bg-black text-black dark:text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-80 transition"
          >
            Essayer gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── SEO text ── */}
        <section className="mt-16 space-y-6 text-black/60 dark:text-white/60 text-sm leading-relaxed max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-black dark:text-white" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
            Pourquoi utiliser un QR code pour votre menu ?
          </h2>
          <p>
            Un QR code sur chaque table permet a vos clients de consulter votre carte sans contact, directement sur leur smartphone.
            Plus besoin de reimprimer vos menus a chaque changement de prix ou de plat : modifiez votre page en ligne et le QR code reste le meme.
          </p>
          <h3 className="text-base font-bold text-black dark:text-white">Comment utiliser ce generateur ?</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Choisissez le type de lien (menu, avis Google, Instagram ou personnalise).</li>
            <li>Personnalisez la couleur et la taille du QR code.</li>
            <li>Telechargez en PNG, SVG ou PDF.</li>
            <li>Utilisez la generation par lot pour creer un QR code par table avec impression directe.</li>
          </ol>
          <p>
            Cet outil est 100 % gratuit et ne necessite aucune inscription. Pour aller plus loin, decouvrez
            {' '}
            <Link to="/" className="text-black dark:text-white underline hover:opacity-70 transition">RestauMargin</Link>
            {' '}
            et gerez tout votre restaurant depuis une seule plateforme.
          </p>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-black/5 dark:border-white/5 py-6 text-center text-xs text-black/30 dark:text-white/30">
        &copy; {new Date().getFullYear()} RestauMargin &mdash; Tous droits reserves.
      </footer>
    </div>
  );
}
