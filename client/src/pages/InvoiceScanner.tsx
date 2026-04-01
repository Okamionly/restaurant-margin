import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  FileText, Upload, Image, Grid, List, Search, Filter,
  Download, Trash2, Eye, Plus, FolderOpen, Euro, Calendar,
  X, File, SortAsc, ScanLine, Check, Link2, Pencil, AlertCircle, Loader2,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import Modal from '../components/Modal';
import { fetchIngredients, updateIngredient } from '../services/api';
import type { Ingredient } from '../types';

/* ─── Types ─── */

interface InvoiceFile {
  id: string;
  dbId?: number;           // backend database id (undefined for local-only entries)
  file: File | null;       // null for sample data
  name: string;
  type: 'pdf' | 'image';
  fournisseur: string;
  invoiceNumber: string;
  dateFacture: string;
  dateAjout: string;
  montantHT: number | null;
  montantTTC: number | null;
  notes: string;
  size: number;
  previewUrl: string | null;
}

// (sample data removed — starts empty, user uploads real invoices)

/* ─── Helpers ─── */

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function generateId(): string {
  return `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ─── Auth & API helpers ─── */

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token') || '';
  const restaurantId = localStorage.getItem('activeRestaurantId') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'X-Restaurant-Id': restaurantId,
  };
}

/* ─── OCR Types & Helpers ─── */

interface OcrItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  prixUnitaire: number;
  total: number;
}

interface IngredientMatch {
  ocrItem: OcrItem;
  ingredient: Ingredient | null;
  score: number; // 0-1
}

function fuzzyScore(a: string, b: string): number {
  const la = a.toLowerCase().trim();
  const lb = b.toLowerCase().trim();
  if (la === lb) return 1;
  if (lb.includes(la) || la.includes(lb)) return 0.85;
  // simple bigram similarity
  const bigrams = (s: string) => {
    const bg = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) bg.add(s.slice(i, i + 2));
    return bg;
  };
  const bA = bigrams(la);
  const bB = bigrams(lb);
  if (bA.size === 0 || bB.size === 0) return 0;
  let inter = 0;
  bA.forEach((bg) => { if (bB.has(bg)) inter++; });
  return (2 * inter) / (bA.size + bB.size);
}

function matchIngredients(items: OcrItem[], ingredients: Ingredient[]): IngredientMatch[] {
  return items.map((ocrItem) => {
    let best: Ingredient | null = null;
    let bestScore = 0;
    for (const ing of ingredients) {
      const s = fuzzyScore(ocrItem.name, ing.name);
      if (s > bestScore) {
        bestScore = s;
        best = ing;
      }
    }
    return { ocrItem, ingredient: bestScore >= 0.4 ? best : null, score: bestScore };
  });
}

function parseOcrText(text: string): OcrItem[] {
  const lines = text.split('\n').filter((l) => l.trim());
  const items: OcrItem[] = [];
  // Match patterns like: "Product name  qty  unit  price  total"
  // Flexible: allow multiple spaces/tabs, comma or dot decimals
  const lineRegex =
    /^(.+?)\s{2,}(\d+[.,]?\d*)\s+(kg|g|L|l|cl|ml|unite|unité|u|pce|pièce|bte|boite|boîte|lot|carton|crt|sac)\s+(\d+[.,]?\d*)\s+(\d+[.,]?\d*)\s*$/i;
  // Also try tab-separated
  const tabRegex =
    /^(.+?)\t+(\d+[.,]?\d*)\t+(kg|g|L|l|cl|ml|unite|unité|u|pce|pièce|bte|boite|boîte|lot|carton|crt|sac)\t+(\d+[.,]?\d*)\t+(\d+[.,]?\d*)\s*$/i;

  for (const line of lines) {
    const m = line.match(lineRegex) || line.match(tabRegex);
    if (m) {
      const toNum = (s: string) => parseFloat(s.replace(',', '.'));
      items.push({
        id: `ocr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: m[1].trim(),
        qty: toNum(m[2]),
        unit: m[3],
        prixUnitaire: toNum(m[4]),
        total: toNum(m[5]),
      });
    }
  }
  return items;
}

/* ─── Component ─── */

export default function InvoiceScanner() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();

  /* State */
  const [invoices, setInvoices] = useState<InvoiceFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');
  const [filterFournisseur, setFilterFournisseur] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'nom' | 'fournisseur'>('date');

  /* Modal state */
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [currentPendingIndex, setCurrentPendingIndex] = useState(0);
  const [metaForm, setMetaForm] = useState({
    fournisseur: '',
    invoiceNumber: '',
    dateFacture: today(),
    montantHT: '',
    montantTTC: '',
    notes: '',
  });

  /* Loading state */
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);

  /* AI scan state */
  const [scanLoading, setScanLoading] = useState(false);
  const [aiDetected, setAiDetected] = useState(false);

  /* Active tab */
  const [activeTab, setActiveTab] = useState<'fichiers' | 'ocr'>('fichiers');

  /* OCR state */
  const [ocrText, setOcrText] = useState('');
  const [ocrItems, setOcrItems] = useState<OcrItem[]>([]);
  const [ocrParsed, setOcrParsed] = useState(false);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [ocrMatches, setOcrMatches] = useState<IngredientMatch[]>([]);
  const [showMatchPanel, setShowMatchPanel] = useState(false);
  const [updatingPrices, setUpdatingPrices] = useState(false);

  /* Load ingredients for matching */
  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    fetchIngredients()
      .then(setIngredientsList)
      .catch(() => {/* silent – matching just won't work */});
  }, [selectedRestaurant, restaurantLoading]);

  /* Load invoices from backend on mount */
  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    setLoadingInvoices(true);
    fetch('/api/invoices', { headers: authHeaders() })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data: any[]) => {
        const mapped: InvoiceFile[] = data.map((inv) => ({
          id: `db-${inv.id}`,
          dbId: inv.id,
          file: null,
          name: inv.invoiceNumber
            ? `${inv.supplierName}_${inv.invoiceNumber}`
            : `${inv.supplierName}_${inv.invoiceDate?.slice(0, 10) ?? inv.id}`,
          type: 'pdf' as const,
          fournisseur: inv.supplierName || 'Inconnu',
          invoiceNumber: inv.invoiceNumber || '',
          dateFacture: inv.invoiceDate ? inv.invoiceDate.slice(0, 10) : '',
          dateAjout: inv.createdAt ? inv.createdAt.slice(0, 10) : today(),
          montantHT: inv.totalHT ?? null,
          montantTTC: inv.totalTTC ?? null,
          notes: inv.rawText || '',
          size: 0,
          previewUrl: null,
        }));
        setInvoices(mapped);
      })
      .catch(() => { /* silent fail – local state stays empty */ })
      .finally(() => setLoadingInvoices(false));
  }, [selectedRestaurant, restaurantLoading]);

  /* Refs */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  /* Cleanup object URLs on unmount */
  useEffect(() => {
    return () => {
      invoices.forEach((inv) => {
        if (inv.previewUrl && inv.file) URL.revokeObjectURL(inv.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Derived ─── */

  const allFournisseurs = useMemo(() => {
    const set = new Set(invoices.map((i) => i.fournisseur));
    return Array.from(set).sort();
  }, [invoices]);

  const filtered = useMemo(() => {
    let list = [...invoices];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.fournisseur.toLowerCase().includes(q) ||
          i.invoiceNumber.toLowerCase().includes(q)
      );
    }
    if (filterType !== 'all') list = list.filter((i) => i.type === filterType);
    if (filterFournisseur) list = list.filter((i) => i.fournisseur === filterFournisseur);

    list.sort((a, b) => {
      if (sortBy === 'date') return b.dateAjout.localeCompare(a.dateAjout);
      if (sortBy === 'nom') return a.name.localeCompare(b.name);
      return a.fournisseur.localeCompare(b.fournisseur);
    });
    return list;
  }, [invoices, searchQuery, filterType, filterFournisseur, sortBy]);

  /* Summary stats */
  const totalCount = invoices.length;
  const thisMonth = invoices.filter((i) => {
    const d = new Date(i.dateAjout);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const volumeTotal = invoices.reduce((s, i) => s + (i.montantTTC ?? 0), 0);
  const uniqueSuppliers = new Set(invoices.map((i) => i.fournisseur)).size;

  /* ─── File handling ─── */

  const acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  const handleFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) => acceptedTypes.includes(f.type));
    if (valid.length === 0) {
      showToast(t('invoiceScanner.invalidFormat'), 'error');
      return;
    }
    setPendingFiles(valid);
    setCurrentPendingIndex(0);
    setAiDetected(false);
    const emptyForm = {
      fournisseur: '',
      invoiceNumber: '',
      dateFacture: today(),
      montantHT: '',
      montantTTC: '',
      notes: '',
    };
    setMetaForm(emptyForm);
    setShowMetadataModal(true);

    // Auto-OCR for the first image file
    const firstFile = valid[0];
    if (firstFile && firstFile.type !== 'application/pdf') {
      setScanLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // dataUrl format: "data:<mimeType>;base64,<data>"
        const commaIdx = dataUrl.indexOf(',');
        const imageBase64 = dataUrl.slice(commaIdx + 1);
        const mimeType = firstFile.type;
        fetch('/api/invoices/scan', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ imageBase64, mimeType }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data && !data.error) {
              setMetaForm({
                fournisseur: data.fournisseur || '',
                invoiceNumber: data.numeroFacture || '',
                dateFacture: data.dateFacture || today(),
                montantHT: data.totalHT != null ? String(data.totalHT) : '',
                montantTTC: data.totalTTC != null ? String(data.totalTTC) : '',
                notes: '',
              });
              setAiDetected(true);
            }
          })
          .catch(() => { /* silent – user can fill manually */ })
          .finally(() => setScanLoading(false));
      };
      reader.readAsDataURL(firstFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropRef.current?.classList.remove('border-teal-500', 'bg-teal-50', 'dark:bg-teal-900/20');
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add('border-teal-500', 'bg-teal-50', 'dark:bg-teal-900/20');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove('border-teal-500', 'bg-teal-50', 'dark:bg-teal-900/20');
  }, []);

  /* Save current pending file with metadata */
  const saveCurrentFile = async () => {
    const file = pendingFiles[currentPendingIndex];
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    const url = isPdf ? null : URL.createObjectURL(file);

    setSavingInvoice(true);
    let dbId: number | undefined;
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          supplierName: metaForm.fournisseur || 'Non renseigne',
          invoiceNumber: metaForm.invoiceNumber || null,
          invoiceDate: metaForm.dateFacture || null,
          totalHT: metaForm.montantHT ? parseFloat(metaForm.montantHT) : null,
          totalTTC: metaForm.montantTTC ? parseFloat(metaForm.montantTTC) : null,
          rawText: metaForm.notes || null,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        dbId = created.id;
      }
    } catch { /* silent – still add to local state */ }
    setSavingInvoice(false);

    const newInvoice: InvoiceFile = {
      id: dbId ? `db-${dbId}` : generateId(),
      dbId,
      file,
      name: file.name,
      type: isPdf ? 'pdf' : 'image',
      fournisseur: metaForm.fournisseur || 'Non renseigne',
      invoiceNumber: metaForm.invoiceNumber,
      dateFacture: metaForm.dateFacture,
      dateAjout: today(),
      montantHT: metaForm.montantHT ? parseFloat(metaForm.montantHT) : null,
      montantTTC: metaForm.montantTTC ? parseFloat(metaForm.montantTTC) : null,
      notes: metaForm.notes,
      size: file.size,
      previewUrl: url,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    if (currentPendingIndex < pendingFiles.length - 1) {
      setCurrentPendingIndex((i) => i + 1);
      setAiDetected(false);
      setMetaForm({
        fournisseur: '',
        invoiceNumber: '',
        dateFacture: today(),
        montantHT: '',
        montantTTC: '',
        notes: '',
      });
    } else {
      setShowMetadataModal(false);
      setPendingFiles([]);
      showToast(t('invoiceScanner.invoiceAdded'), 'success');
    }
  };

  /* Preview */
  const handlePreview = (inv: InvoiceFile) => {
    if (inv.file) {
      const url = URL.createObjectURL(inv.file);
      window.open(url, '_blank');
    } else {
      showToast(t('invoiceScanner.previewNotAvailable'), 'info');
    }
  };

  /* Download */
  const handleDownload = (inv: InvoiceFile) => {
    if (inv.file) {
      const url = URL.createObjectURL(inv.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = inv.name;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      showToast(t('invoiceScanner.downloadNotAvailable'), 'info');
    }
  };

  /* Delete */
  const handleDelete = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (inv?.previewUrl && inv.file) URL.revokeObjectURL(inv.previewUrl);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showToast(t('invoiceScanner.invoiceDeleted'), 'success');
    if (inv?.dbId) {
      fetch(`/api/invoices/${inv.dbId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }).catch(() => { /* silent */ });
    }
  };

  /* ─── OCR handlers ─── */

  const handleParseOcr = () => {
    const items = parseOcrText(ocrText);
    if (items.length === 0) {
      showToast(t('invoiceScanner.noLinesDetected'), 'error');
      return;
    }
    setOcrItems(items);
    setOcrParsed(true);
    setShowMatchPanel(false);
    showToast(t('invoiceScanner.linesExtracted'), 'success');
  };

  const handleOcrItemChange = (id: string, field: keyof OcrItem, value: string) => {
    setOcrItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'name' || field === 'unit') return { ...item, [field]: value };
        const num = parseFloat(value.replace(',', '.'));
        return { ...item, [field]: isNaN(num) ? 0 : num };
      })
    );
  };

  const handleRemoveOcrItem = (id: string) => {
    setOcrItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddToInvoice = () => {
    if (ocrItems.length === 0) return;
    // Build a summary text for notes
    const summary = ocrItems.map((i) => `${i.name} ${i.qty}${i.unit} x${i.prixUnitaire}`).join(', ');
    const totalHT = ocrItems.reduce((s, i) => s + i.total, 0);

    const newInv: InvoiceFile = {
      id: generateId(),
      file: null,
      name: `Facture_OCR_${today().replace(/-/g, '')}.txt`,
      type: 'pdf',
      fournisseur: 'Import OCR',
      invoiceNumber: '',
      dateFacture: today(),
      dateAjout: today(),
      montantHT: totalHT,
      montantTTC: Math.round(totalHT * 1.2 * 100) / 100,
      notes: summary,
      size: ocrText.length,
      previewUrl: null,
    };
    setInvoices((prev) => [newInv, ...prev]);
    showToast(t('invoiceScanner.ocrInvoiceAdded'), 'success');
    setOcrItems([]);
    setOcrText('');
    setOcrParsed(false);
    setShowMatchPanel(false);
  };

  const handleMatchPrices = () => {
    if (ingredientsList.length === 0) {
      showToast(t('invoiceScanner.noIngredientsForMatching'), 'error');
      return;
    }
    const matches = matchIngredients(ocrItems, ingredientsList);
    setOcrMatches(matches);
    setShowMatchPanel(true);
  };

  const handleApplyPrices = async () => {
    const toUpdate = ocrMatches.filter((m) => m.ingredient && m.ingredient.pricePerUnit !== m.ocrItem.prixUnitaire);
    if (toUpdate.length === 0) {
      showToast(t('invoiceScanner.noPricesToUpdate'), 'info');
      return;
    }
    setUpdatingPrices(true);
    let ok = 0;
    for (const m of toUpdate) {
      try {
        await updateIngredient(m.ingredient!.id, { pricePerUnit: m.ocrItem.prixUnitaire });
        ok++;
      } catch {
        /* skip individual failures */
      }
    }
    // refresh ingredients
    try {
      const fresh = await fetchIngredients();
      setIngredientsList(fresh);
    } catch { /* */ }
    setUpdatingPrices(false);
    showToast(t('invoiceScanner.pricesUpdated'), 'success');
    setShowMatchPanel(false);
  };

  /* ─── Render ─── */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderOpen className="w-7 h-7 text-teal-600" />
          Dossier Factures
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {t('invoiceScanner.subtitle')}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('fichiers')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'fichiers'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Fichiers
        </button>
        <button
          onClick={() => setActiveTab('ocr')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'ocr'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <ScanLine className="w-4 h-4" />
          Scanner OCR
        </button>
      </div>

      {activeTab === 'fichiers' && (<>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('invoiceScanner.totalInvoices'), value: totalCount, icon: FileText, color: 'text-teal-600' },
          { label: t('invoiceScanner.thisMonth'), value: thisMonth, icon: Calendar, color: 'text-green-600' },
          {
            label: t('invoiceScanner.totalVolume'),
            value: `${volumeTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`,
            icon: Euro,
            color: 'text-amber-600',
          },
          { label: t('invoiceScanner.suppliers'), value: uniqueSuppliers, icon: File, color: 'text-purple-600' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-1">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {card.label}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center
                   hover:border-teal-400 dark:hover:border-teal-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">{t('invoiceScanner.dropHere')}</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm my-2">{t('invoiceScanner.or')}</p>
        <button
          type="button"
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Parcourir les fichiers
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">PDF, JPG, PNG</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('invoiceScanner.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['all', 'pdf', 'image'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterType === t
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {t === 'all' ? 'Tous' : t === 'pdf' ? 'PDF' : 'Images'}
              </button>
            ))}
          </div>

          {/* Fournisseur filter */}
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterFournisseur}
              onChange={(e) => setFilterFournisseur(e.target.value)}
              className="pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="">{t('invoiceScanner.allSuppliers')}</option>
              {allFournisseurs.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="date">{t('invoiceScanner.sortDate')}</option>
              <option value="nom">{t('invoiceScanner.sortName')}</option>
              <option value="fournisseur">{t('invoiceScanner.sortSupplier')}</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Files display */}
      {loadingInvoices ? (
        <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500 gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{t('invoiceScanner.loading')}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t('invoiceScanner.noInvoicesFound')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                         hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Icon / thumbnail */}
              <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50">
                {inv.type === 'pdf' ? (
                  <FileText className="w-14 h-14 text-red-500" />
                ) : inv.previewUrl ? (
                  <img
                    src={inv.previewUrl}
                    alt={inv.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image className="w-14 h-14 text-teal-500" />
                )}
              </div>
              <div className="p-3">
                <p
                  className="text-sm font-medium text-gray-900 dark:text-white truncate"
                  title={inv.name}
                >
                  {inv.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{inv.fournisseur}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(inv.dateAjout).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatSize(inv.size)}
                  </span>
                </div>
                {inv.montantTTC != null && (
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                    {inv.montantTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} &euro; TTC
                  </p>
                )}
                {/* Actions */}
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => handlePreview(inv)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600
                               dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <Eye className="w-3.5 h-3.5" /> Voir
                  </button>
                  <button
                    onClick={() => handleDownload(inv)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-600
                               dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <Download className="w-3.5 h-3.5" /> DL
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500
                               hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Sup.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Fichier
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Fournisseur
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Date ajout
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Taille
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Type
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {inv.type === 'pdf' ? (
                        <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                      ) : (
                        <Image className="w-5 h-5 text-teal-500 flex-shrink-0" />
                      )}
                      <span className="text-gray-900 dark:text-white truncate max-w-[200px]">
                        {inv.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{inv.fournisseur}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(inv.dateAjout).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatSize(inv.size)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        inv.type === 'pdf'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                      }`}
                    >
                      {inv.type === 'pdf' ? 'PDF' : 'Image'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handlePreview(inv)}
                        className="p-1.5 text-gray-500 hover:text-teal-600 hover:bg-teal-50
                                   dark:hover:bg-teal-900/20 rounded-md"
                        title={t('invoiceScanner.preview')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(inv)}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50
                                   dark:hover:bg-green-900/20 rounded-md"
                        title={t('invoiceScanner.download')}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50
                                   dark:hover:bg-red-900/20 rounded-md"
                        title={t('invoiceScanner.deleteTooltip')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      </>)}

      {/* ─── OCR Tab ─── */}
      {activeTab === 'ocr' && (
        <div className="space-y-6">
          {/* OCR text input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
              <ScanLine className="w-5 h-5 text-teal-600" />
              Scanner OCR
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('invoiceScanner.ocrDescription')}
              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded ml-1">
                Nom produit  qte  unite  prix_unitaire  total
              </span>
            </p>
            <textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              rows={8}
              placeholder={`Exemple :\nTomates grappe  5  kg  2.50  12.50\nSaumon frais  3  kg  15.00  45.00\nHuile olive  2  L  8.99  17.98`}
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono
                         focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleParseOcr}
                disabled={!ocrText.trim()}
                className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ScanLine className="w-4 h-4" />
                Parser le texte
              </button>
              {ocrParsed && ocrItems.length > 0 && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {ocrItems.length} ligne(s) extraite(s)
                </span>
              )}
            </div>
          </div>

          {/* Extracted items table */}
          {ocrParsed && ocrItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-500" />
                  Lignes extraites (editables)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMatchPrices}
                    className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700
                               dark:bg-purple-900/30 dark:text-purple-300 rounded-lg hover:bg-purple-100
                               dark:hover:bg-purple-900/50 flex items-center gap-1"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Matcher les prix
                  </button>
                  <button
                    onClick={handleAddToInvoice}
                    className="px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg
                               hover:bg-teal-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter a la facture
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Produit
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-20">
                        Qte
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-20">
                        Unite
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-28">
                        Prix unitaire
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-28">
                        Total
                      </th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {ocrItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleOcrItemChange(item.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                       focus:ring-1 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.qty}
                            onChange={(e) => handleOcrItemChange(item.id, 'qty', e.target.value)}
                            className="w-full px-2 py-1 text-sm text-center rounded border border-gray-200 dark:border-gray-600
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                       focus:ring-1 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleOcrItemChange(item.id, 'unit', e.target.value)}
                            className="w-full px-2 py-1 text-sm text-center rounded border border-gray-200 dark:border-gray-600
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                       focus:ring-1 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.prixUnitaire}
                            onChange={(e) => handleOcrItemChange(item.id, 'prixUnitaire', e.target.value)}
                            className="w-full px-2 py-1 text-sm text-center rounded border border-gray-200 dark:border-gray-600
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                       focus:ring-1 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.total}
                            onChange={(e) => handleOcrItemChange(item.id, 'total', e.target.value)}
                            className="w-full px-2 py-1 text-sm text-center rounded border border-gray-200 dark:border-gray-600
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                       focus:ring-1 focus:ring-teal-500"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            onClick={() => handleRemoveOcrItem(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 rounded"
                            title={t('invoiceScanner.deleteLine')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 dark:bg-gray-900/30">
                      <td colSpan={4} className="px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 text-right">
                        {t('invoiceScanner.totalHT')} :
                      </td>
                      <td className="px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white text-center">
                        {ocrItems.reduce((s, i) => s + i.total, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} &euro;
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Price matching panel */}
          {showMatchPanel && ocrMatches.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-purple-500" />
                  Matching ingredients
                </h3>
                <button
                  onClick={handleApplyPrices}
                  disabled={updatingPrices}
                  className="px-4 py-2 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700
                             disabled:opacity-50 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  {updatingPrices ? 'Mise a jour...' : 'Appliquer les nouveaux prix'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Produit facture
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Match
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Ingredient en base
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Prix actuel
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Nouveau prix
                      </th>
                      <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Ecart
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrMatches.map((m) => {
                      const diff = m.ingredient
                        ? m.ocrItem.prixUnitaire - m.ingredient.pricePerUnit
                        : 0;
                      const pctDiff = m.ingredient && m.ingredient.pricePerUnit > 0
                        ? ((diff / m.ingredient.pricePerUnit) * 100)
                        : 0;
                      return (
                        <tr
                          key={m.ocrItem.id}
                          className="border-b border-gray-100 dark:border-gray-700/50"
                        >
                          <td className="px-4 py-2.5 text-gray-900 dark:text-white font-medium">
                            {m.ocrItem.name}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {m.ingredient ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <Check className="w-3 h-3" />
                                {Math.round(m.score * 100)}%
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                <AlertCircle className="w-3 h-3" />
                                Aucun
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">
                            {m.ingredient ? m.ingredient.name : '—'}
                          </td>
                          <td className="px-4 py-2.5 text-center text-gray-600 dark:text-gray-300">
                            {m.ingredient
                              ? `${m.ingredient.pricePerUnit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                              : '—'}
                          </td>
                          <td className="px-4 py-2.5 text-center font-medium text-gray-900 dark:text-white">
                            {m.ocrItem.prixUnitaire.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} &euro;
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {m.ingredient ? (
                              <span
                                className={`text-xs font-medium ${
                                  diff > 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : diff < 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-400'
                                }`}
                              >
                                {diff > 0 ? '+' : ''}
                                {diff.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} &euro;
                                {' '}({pctDiff > 0 ? '+' : ''}{pctDiff.toFixed(1)}%)
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state for OCR */}
          {ocrParsed && ocrItems.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('invoiceScanner.noLinesInText')}</p>
              <p className="text-xs mt-1">Verifiez que chaque ligne suit le format : Nom  qte  unite  prix  total</p>
            </div>
          )}
        </div>
      )}

      {/* Metadata modal */}
      <Modal
        isOpen={showMetadataModal}
        onClose={() => {
          setShowMetadataModal(false);
          setPendingFiles([]);
          setScanLoading(false);
          setAiDetected(false);
        }}
        title={`${t('invoiceScanner.addInfo')} ${pendingFiles.length > 1 ? `(${currentPendingIndex + 1}/${pendingFiles.length})` : ''}`}
      >
        <div className="space-y-4">
          {pendingFiles[currentPendingIndex] && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              {pendingFiles[currentPendingIndex].type === 'application/pdf' ? (
                <FileText className="w-5 h-5 text-red-500" />
              ) : (
                <Image className="w-5 h-5 text-teal-500" />
              )}
              <span className="text-gray-700 dark:text-gray-200 truncate">
                {pendingFiles[currentPendingIndex].name}
              </span>
            </div>
          )}

          {/* AI scan status banner */}
          {scanLoading && (
            <div className="flex items-center gap-2 p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg text-sm text-teal-700 dark:text-teal-300">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              {t('invoiceScanner.aiScanning')}
            </div>
          )}
          {aiDetected && !scanLoading && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-700 dark:text-emerald-300">
              <Check className="w-4 h-4 flex-shrink-0" />
              {t('invoiceScanner.aiDetected')}
            </div>
          )}

          {/* {t('invoiceScanner.supplierLabel')}/}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('invoiceScanner.supplierLabel')}
              {aiDetected && metaForm.fournisseur && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-normal">
                  {t('invoiceScanner.detectedByAI')}
                </span>
              )}
            </label>
            <input
              type="text"
              list="fournisseurs-list"
              value={metaForm.fournisseur}
              onChange={(e) => setMetaForm((f) => ({ ...f, fournisseur: e.target.value }))}
              placeholder={t('invoiceScanner.supplierPlaceholder')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500"
            />
            <datalist id="fournisseurs-list">
              {allFournisseurs.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          {/* Numero facture */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('invoiceScanner.invoiceNumberLabel')}
              {aiDetected && metaForm.invoiceNumber && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-normal">
                  {t('invoiceScanner.detectedByAI')}
                </span>
              )}
            </label>
            <input
              type="text"
              value={metaForm.invoiceNumber}
              onChange={(e) => setMetaForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
              placeholder={t('invoiceScanner.invoiceNumberPlaceholder')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Date facture */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('invoiceScanner.invoiceDateLabel')}
              {aiDetected && metaForm.dateFacture && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-normal">
                  {t('invoiceScanner.detectedByAI')}
                </span>
              )}
            </label>
            <input
              type="date"
              value={metaForm.dateFacture}
              onChange={(e) => setMetaForm((f) => ({ ...f, dateFacture: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('invoiceScanner.amountHT')}
                {aiDetected && metaForm.montantHT && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-normal">
                    {t('invoiceScanner.ai')}
                  </span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                value={metaForm.montantHT}
                onChange={(e) => setMetaForm((f) => ({ ...f, montantHT: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('invoiceScanner.amountTTC')}
                {aiDetected && metaForm.montantTTC && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-normal">
                    {t('invoiceScanner.ai')}
                  </span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                value={metaForm.montantTTC}
                onChange={(e) => setMetaForm((f) => ({ ...f, montantTTC: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('invoiceScanner.notes')}
            </label>
            <textarea
              value={metaForm.notes}
              onChange={(e) => setMetaForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder={t('invoiceScanner.notesPlaceholder')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setShowMetadataModal(false);
                setPendingFiles([]);
                setScanLoading(false);
                setAiDetected(false);
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100
                         dark:hover:bg-gray-700 rounded-lg"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={saveCurrentFile}
              disabled={savingInvoice || scanLoading}
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium
                         flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingInvoice ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {currentPendingIndex < pendingFiles.length - 1 ? t('invoiceScanner.next') : t('invoiceScanner.add')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
