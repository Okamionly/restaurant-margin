import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  QrCode, Eye, EyeOff, Printer, Copy, Check, Globe, Smartphone, ExternalLink,
  Download, Palette, ChefHat, UtensilsCrossed, Coffee, Wine, CakeSlice,
  Salad, AlertTriangle, Filter, X, Search, Wheat, Milk, Egg, Fish,
  Nut, Bean, Shell, Leaf
} from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { useTranslation } from '../hooks/useTranslation';

// ── Simple SVG QR Code Generator ──────────────────────────────────────────
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

function QRCodeSVG({ text, size = 200, darkColor = '#000', lightColor = '#fff' }: {
  text: string; size?: number; darkColor?: string; lightColor?: string;
}) {
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

// ── Types ─────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: MenuCategory;
  allergens: AllergenKey[];
  image?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
}

type MenuCategory = 'entrees' | 'plats' | 'desserts' | 'boissons';
type AllergenKey = 'gluten' | 'lait' | 'oeufs' | 'poisson' | 'fruits_coques' | 'soja' | 'crustaces' | 'celeri';

interface CategoryConfig {
  key: MenuCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface AllergenConfig {
  key: AllergenKey;
  label: string;
  icon: React.ReactNode;
  emoji: string;
}

// ── Constants ─────────────────────────────────────────────────────────────
const CATEGORIES: CategoryConfig[] = [
  { key: 'entrees', label: 'Entrees', icon: <Salad className="w-4 h-4" />, color: 'emerald' },
  { key: 'plats', label: 'Plats', icon: <UtensilsCrossed className="w-4 h-4" />, color: 'amber' },
  { key: 'desserts', label: 'Desserts', icon: <CakeSlice className="w-4 h-4" />, color: 'pink' },
  { key: 'boissons', label: 'Boissons', icon: <Wine className="w-4 h-4" />, color: 'blue' },
];

const ALLERGENS: AllergenConfig[] = [
  { key: 'gluten', label: 'Gluten', icon: <Wheat className="w-3.5 h-3.5" />, emoji: 'Ble' },
  { key: 'lait', label: 'Lait', icon: <Milk className="w-3.5 h-3.5" />, emoji: 'Lait' },
  { key: 'oeufs', label: 'Oeufs', icon: <Egg className="w-3.5 h-3.5" />, emoji: 'Oeuf' },
  { key: 'poisson', label: 'Poisson', icon: <Fish className="w-3.5 h-3.5" />, emoji: 'Poisson' },
  { key: 'fruits_coques', label: 'Fruits a coques', icon: <Nut className="w-3.5 h-3.5" />, emoji: 'Noix' },
  { key: 'soja', label: 'Soja', icon: <Bean className="w-3.5 h-3.5" />, emoji: 'Soja' },
  { key: 'crustaces', label: 'Crustaces', icon: <Shell className="w-3.5 h-3.5" />, emoji: 'Crust.' },
  { key: 'celeri', label: 'Celeri', icon: <Leaf className="w-3.5 h-3.5" />, emoji: 'Celeri' },
];

const LANGUAGES = [
  { code: 'fr', label: 'Francais', flag: 'FR' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Espanol', flag: 'ES' },
];

// ── Demo menu fallback (shown ONLY if user has no recipes in the database) ──
const DEMO_MENU: MenuItem[] = [
  { id: '1', name: 'Salade Nicoise', description: 'Thon frais, olives, oeufs, haricots verts, tomates et anchois', price: 14.50, category: 'entrees', allergens: ['oeufs', 'poisson'], isPopular: true },
  { id: '2', name: 'Veloute de potiron', description: 'Potiron bio, creme fraiche, noisettes torrefiees', price: 9.00, category: 'entrees', allergens: ['lait', 'fruits_coques'], isVegetarian: true },
  { id: '3', name: 'Tartare de saumon', description: 'Saumon frais, avocat, mangue, sauce ponzu', price: 16.00, category: 'entrees', allergens: ['poisson', 'soja'], isNew: true },
  { id: '4', name: 'Bruschetta tomates-basilic', description: 'Pain grille, tomates cerises, mozzarella di bufala, basilic frais', price: 11.00, category: 'entrees', allergens: ['gluten', 'lait'], isVegetarian: true },

  { id: '5', name: 'Filet de boeuf sauce morilles', description: 'Boeuf race Aubrac, morilles fraiches, puree truffee', price: 32.00, category: 'plats', allergens: ['lait'], isPopular: true },
  { id: '6', name: 'Risotto aux crevettes', description: 'Riz arborio, crevettes sauvages, parmesan, citron confit', price: 24.00, category: 'plats', allergens: ['crustaces', 'lait'] },
  { id: '7', name: 'Bowl vegan', description: 'Quinoa, edamame, avocat, patate douce rotie, tahini', price: 18.50, category: 'plats', allergens: ['soja'], isVegan: true, isNew: true },
  { id: '8', name: 'Pave de cabillaud', description: 'Cabillaud de ligne, ecrase de pommes de terre, beurre blanc', price: 26.00, category: 'plats', allergens: ['poisson', 'lait'] },
  { id: '9', name: 'Poulet fermier roti', description: 'Poulet label rouge, legumes de saison, jus de volaille', price: 22.00, category: 'plats', allergens: [], isPopular: true },

  { id: '10', name: 'Fondant au chocolat', description: 'Chocolat noir Valrhona 70%, coeur coulant, glace vanille', price: 12.00, category: 'desserts', allergens: ['oeufs', 'lait', 'gluten'], isPopular: true },
  { id: '11', name: 'Tarte au citron meringuee', description: 'Citrons de Menton, meringue italienne, pate sablee', price: 10.00, category: 'desserts', allergens: ['oeufs', 'gluten', 'lait'] },
  { id: '12', name: 'Panna cotta fruits rouges', description: 'Creme de Normandie, coulis framboise-fraise', price: 9.50, category: 'desserts', allergens: ['lait'] },
  { id: '13', name: 'Sorbet artisanal (3 boules)', description: 'Fruits de saison, sans produits laitiers', price: 8.00, category: 'desserts', allergens: [], isVegan: true },

  { id: '14', name: 'Eau minerale Evian (75cl)', description: '', price: 5.50, category: 'boissons', allergens: [] },
  { id: '15', name: 'Coca-Cola / Coca Zero', description: '', price: 4.00, category: 'boissons', allergens: [] },
  { id: '16', name: 'Jus de fruits frais', description: 'Orange, pomme, ananas ou pamplemousse', price: 6.00, category: 'boissons', allergens: [] },
  { id: '17', name: 'Cafe espresso', description: 'Torrefaction artisanale, arabica 100%', price: 3.50, category: 'boissons', allergens: [] },
  { id: '18', name: 'The / Infusion', description: 'Selection Dammann Freres', price: 4.50, category: 'boissons', allergens: [] },
];

// ── Main Component ────────────────────────────────────────────────────────
export default function QRMenu() {
  const { t } = useTranslation();
  const { selectedRestaurant } = useRestaurant();

  // QR Settings
  const [showPrices, setShowPrices] = useState(true);
  const [showAllergens, setShowAllergens] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Menu Preview
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');
  const [activeAllergenFilters, setActiveAllergenFilters] = useState<AllergenKey[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);

  const [realRecipes, setRealRecipes] = useState<MenuItem[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  // Fetch real recipes from API
  useEffect(() => {
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('activeRestaurantId');
    if (!token) { setLoadingRecipes(false); return; }
    fetch('/api/recipes', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Restaurant-Id': restaurantId || '1' },
    })
      .then(r => r.ok ? r.json() : [])
      .then((recipes: any[]) => {
        if (recipes.length > 0) {
          const mapped: MenuItem[] = recipes.map((r: any) => {
            const cat = (r.category || '').toLowerCase();
            let category: MenuCategory = 'plats';
            if (cat.includes('entree') || cat.includes('starter')) category = 'entrees';
            else if (cat.includes('dessert') || cat.includes('patisserie')) category = 'desserts';
            else if (cat.includes('boisson') || cat.includes('drink') || cat.includes('cocktail')) category = 'boissons';
            return {
              id: String(r.id),
              name: r.name,
              description: r.description || '',
              price: r.sellingPrice || 0,
              category,
              allergens: (r.allergens || []).map((a: string) => a.toLowerCase().replace(/\s/g, '_')),
              isPopular: r.margin?.marginPercent > 70,
              isNew: new Date(r.createdAt) > new Date(Date.now() - 7 * 86400000),
            };
          });
          setRealRecipes(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRecipes(false));
  }, []);

  const isUsingDemoMenu = realRecipes.length === 0 && !loadingRecipes;
  const menuItems = realRecipes.length > 0 ? realRecipes : DEMO_MENU;
  const restaurantName = selectedRestaurant?.name || 'Votre Restaurant';

  const menuUrl = useMemo(() => {
    const base = window.location.origin;
    const params = new URLSearchParams();
    const rid = localStorage.getItem('activeRestaurantId');
    if (rid) params.set('restaurantId', rid);
    if (!showPrices) params.set('hidePrices', '1');
    if (!showAllergens) params.set('hideAllergens', '1');
    if (!showDescriptions) params.set('hideDesc', '1');
    if (language !== 'fr') params.set('lang', language);
    const qs = params.toString();
    return `${base}/menu-public${qs ? '?' + qs : ''}`;
  }, [showPrices, showAllergens, showDescriptions, language]);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      // Allergen filter (exclude items containing these allergens)
      if (activeAllergenFilters.length > 0) {
        const hasFilteredAllergen = item.allergens.some(a => activeAllergenFilters.includes(a));
        if (hasFilteredAllergen) return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !(item.description || '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activeCategory, activeAllergenFilters, searchQuery, menuItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<MenuCategory, MenuItem[]> = { entrees: [], plats: [], desserts: [], boissons: [] };
    filteredItems.forEach(item => groups[item.category].push(item));
    return groups;
  }, [filteredItems]);

  const toggleAllergenFilter = useCallback((key: AllergenKey) => {
    setActiveAllergenFilters(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
      <head><title>QR Code Menu - ${restaurantName}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:system-ui,-apple-system,sans-serif;background:#fff;">
        <h1 style="font-size:28px;margin-bottom:8px;color:#000;font-weight:800;">${restaurantName}</h1>
        <p style="font-size:16px;color:#666;margin-bottom:32px;">Scannez pour decouvrir notre carte</p>
        <div style="padding:24px;border:3px solid #e5e7eb;border-radius:16px;">${svgData}</div>
        <p style="font-size:12px;color:#999;margin-top:24px;">${menuUrl}</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  function handleDownloadQR() {
    const svgEl = printRef.current?.querySelector('svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        if (!b) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = `qr-menu-${restaurantName.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, 'image/png');
    };
    img.src = url;
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white flex items-center gap-3" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white dark:text-black" />
            </div>
            Menu Digital & QR Code
          </h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1">
            Generez un QR code et previsualiser votre menu tel que vos clients le verront
          </p>
        </div>
        <a
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-80 transition text-sm font-semibold"
        >
          <ExternalLink className="w-4 h-4" />
          Ouvrir le menu public
        </a>
      </div>

      {/* ── Top Section: QR + Options ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* QR Code Card */}
        <div className="lg:col-span-1">
          <div
            ref={printRef}
            className="bg-white dark:bg-white rounded-2xl border border-black/10 p-8 flex flex-col items-center"
          >
            {/* Restaurant branding */}
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-3">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-extrabold text-black mb-0.5" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
              {restaurantName}
            </h3>
            <p className="text-sm text-black/40 mb-6">Scannez pour decouvrir notre carte</p>
            <QRCodeSVG text={menuUrl} size={220} />
            <p className="text-[10px] text-black/30 mt-4 max-w-[220px] text-center break-all font-mono">{menuUrl}</p>
          </div>

          {/* QR Actions */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={handleDownloadQR}
              className="flex flex-col items-center gap-1.5 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <Download className="w-4 h-4 text-black/60 dark:text-white/60" />
              <span className="text-[10px] font-semibold text-black/50 dark:text-white/50">PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-1.5 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <Printer className="w-4 h-4 text-black/60 dark:text-white/60" />
              <span className="text-[10px] font-semibold text-black/50 dark:text-white/50">Imprimer</span>
            </button>
            <button
              onClick={handleCopy}
              className={`flex flex-col items-center gap-1.5 py-3 border rounded-xl transition ${
                copied
                  ? 'bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20'
                  : 'bg-white dark:bg-black border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-black dark:text-white" /> : <Copy className="w-4 h-4 text-black/60 dark:text-white/60" />}
              <span className="text-[10px] font-semibold text-black/50 dark:text-white/50">{copied ? 'Copie !' : 'Lien'}</span>
            </button>
          </div>
        </div>

        {/* Options Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Display options */}
          <div className="bg-white dark:bg-black rounded-2xl border border-black/10 dark:border-white/10 p-5 space-y-3">
            <h2 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider">
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
          <div className="bg-white dark:bg-black rounded-2xl border border-black/10 dark:border-white/10 p-5 space-y-3">
            <h2 className="text-xs font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-black/40 dark:text-white/40" />
              Langue du menu
            </h2>
            <div className="space-y-1.5">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    language === lang.code
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs font-bold w-6 h-6 rounded-md bg-black/5 dark:bg-white/10 flex items-center justify-center">
                    {lang.flag}
                  </span>
                  {lang.label}
                  {language === lang.code && <Check className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* URL preview */}
          <div className="bg-black/[0.02] dark:bg-white/[0.02] rounded-xl px-4 py-3 border border-black/5 dark:border-white/5">
            <p className="text-[10px] text-black/40 dark:text-white/40 mb-1 font-semibold uppercase tracking-wider">URL du menu public</p>
            <p className="text-xs text-black/50 dark:text-white/50 font-mono break-all">{menuUrl}</p>
          </div>
        </div>

        {/* Phone Preview */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-xs text-black/40 dark:text-white/40 font-semibold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" />
            Apercu mobile
          </div>
          <div className="w-[260px] h-[520px] bg-black rounded-[2.5rem] p-3 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl z-10" />
              <iframe
                src={menuUrl}
                className="w-full h-full border-0 rounded-[2rem]"
                title="Apercu menu"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Menu Preview Section ── */}
      {isUsingDemoMenu && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Apercu avec des plats de demonstration. Ajoutez vos recettes pour voir votre vrai menu ici.</span>
        </div>
      )}
      <div className="border-t border-black/5 dark:border-white/5 pt-8">
        {/* Branding Header */}
        <div className="bg-black dark:bg-white rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white dark:bg-black rounded-2xl flex items-center justify-center shrink-0">
              <ChefHat className="w-7 h-7 text-black dark:text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white dark:text-black" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
                {restaurantName}
              </h2>
              <p className="text-sm text-white/50 dark:text-black/50">Apercu de votre carte digitale</p>
            </div>
          </div>
        </div>

        {/* Search & Allergen Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un plat..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAllergenFilter(!showAllergenFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              activeAllergenFilters.length > 0
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-black/30 dark:hover:border-white/30'
            }`}
          >
            <Filter className="w-4 h-4" />
            Allergenes
            {activeAllergenFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white dark:bg-black text-black dark:text-white text-[10px] font-bold flex items-center justify-center">
                {activeAllergenFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Allergen Filter Panel */}
        {showAllergenFilter && (
          <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-black/40 dark:text-white/40" />
                Exclure les plats contenant :
              </h3>
              {activeAllergenFilters.length > 0 && (
                <button onClick={() => setActiveAllergenFilters([])} className="text-xs text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition">
                  Tout reinitialiser
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map(a => {
                const isActive = activeAllergenFilters.includes(a.key);
                return (
                  <button
                    key={a.key}
                    onClick={() => toggleAllergenFilter(a.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      isActive
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-black/30 dark:hover:border-white/30'
                    }`}
                  >
                    {a.icon}
                    {a.label}
                    {isActive && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-white dark:bg-black text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            Tout ({filteredItems.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = groupedItems[cat.key].length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-black text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                }`}
              >
                {cat.icon}
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-black/10 dark:text-white/10 mx-auto mb-4" />
            <p className="text-black/40 dark:text-white/40 font-medium">Aucun plat ne correspond a vos filtres</p>
            <button
              onClick={() => { setActiveAllergenFilters([]); setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-3 text-sm text-black/60 dark:text-white/60 underline hover:text-black dark:hover:text-white transition"
            >
              Reinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {(activeCategory === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.key === activeCategory)).map(cat => {
              const items = groupedItems[cat.key];
              if (items.length === 0) return null;
              return (
                <div key={cat.key}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center text-black/60 dark:text-white/60">
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-black dark:text-white" style={{ fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif" }}>
                      {cat.label}
                    </h3>
                    <div className="flex-1 h-px bg-black/5 dark:bg-white/5" />
                    <span className="text-xs font-semibold text-black/30 dark:text-white/30">{items.length} plats</span>
                  </div>

                  {/* Dish cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {items.map(item => (
                      <DishCard
                        key={item.id}
                        item={item}
                        showPrices={showPrices}
                        showAllergens={showAllergens}
                        showDescriptions={showDescriptions}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dish Card Component ──────────────────────────────────────────────────
function DishCard({ item, showPrices, showAllergens, showDescriptions }: {
  item: MenuItem;
  showPrices: boolean;
  showAllergens: boolean;
  showDescriptions: boolean;
}) {
  const allergenConfigs = ALLERGENS.filter(a => item.allergens.includes(a.key));

  return (
    <div className="group bg-white dark:bg-black border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-4 hover:border-black/15 dark:hover:border-white/15 hover:shadow-sm transition-all">
      {/* Top row: badges */}
      {(item.isPopular || item.isNew || item.isVegetarian || item.isVegan) && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {item.isPopular && (
            <span className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-md uppercase tracking-wide">
              Populaire
            </span>
          )}
          {item.isNew && (
            <span className="px-2 py-0.5 bg-black/10 dark:bg-white/10 text-black dark:text-white text-[10px] font-bold rounded-md uppercase tracking-wide">
              Nouveau
            </span>
          )}
          {item.isVegetarian && !item.isVegan && (
            <span className="px-2 py-0.5 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 text-[10px] font-bold rounded-md flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Vegetarien
            </span>
          )}
          {item.isVegan && (
            <span className="px-2 py-0.5 bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 text-[10px] font-bold rounded-md flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Vegan
            </span>
          )}
        </div>
      )}

      {/* Name + Price */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-black dark:text-white leading-snug">
          {item.name}
        </h4>
        {showPrices && (
          <span className="shrink-0 text-sm font-extrabold text-black dark:text-white tabular-nums">
            {item.price.toFixed(2).replace('.', ',')} EUR
          </span>
        )}
      </div>

      {/* Description */}
      {showDescriptions && item.description && (
        <p className="text-xs text-black/40 dark:text-white/40 mt-1.5 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Allergens */}
      {showAllergens && allergenConfigs.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {allergenConfigs.map(a => (
            <span
              key={a.key}
              title={a.label}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] rounded-md text-[10px] font-medium text-black/50 dark:text-white/50"
            >
              {a.icon}
              {a.emoji}
            </span>
          ))}
        </div>
      )}
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
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
    >
      <span className="flex items-center gap-2.5 text-sm text-black/70 dark:text-white/70">
        <span className={enabled ? 'text-black dark:text-white' : 'text-black/30 dark:text-white/30'}>{enabled ? icon : iconOff}</span>
        {label}
      </span>
      <div
        className={`w-10 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-black dark:bg-white' : 'bg-black/10 dark:bg-white/10'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full shadow transition-transform ${
            enabled
              ? 'translate-x-5 bg-white dark:bg-black'
              : 'translate-x-1 bg-white dark:bg-white'
          }`}
        />
      </div>
    </button>
  );
}
