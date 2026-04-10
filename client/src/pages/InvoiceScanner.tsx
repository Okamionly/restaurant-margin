import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  FileText, Upload, Image, Grid, List, Search, Filter,
  Download, Trash2, Eye, Plus, FolderOpen, Euro, Calendar,
  X, File, SortAsc, ScanLine, Check, Link2, Pencil, AlertCircle, Loader2,
  Camera, Zap, ArrowUpDown, RefreshCw, Save, Clock, CheckCircle2,
  TrendingUp, TrendingDown, Minus, Package, ShoppingCart, Archive,
  ChevronDown, ChevronRight, Hash, ReceiptText, Sparkles,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import Modal from '../components/Modal';
import { fetchIngredients, updateIngredient } from '../services/api';
import type { Ingredient } from '../types';
import { updateOnboardingStep } from '../components/OnboardingWizard';

/* ─── Types ─── */

interface InvoiceFile {
  id: string;
  dbId?: number;
  file: File | null;
  name: string;
  type: 'pdf' | 'image';
  fournisseur: string;
  invoiceNumber: string;
  dateFacture: string;
  dateAjout: string;
  montantHT: number | null;
  montantTTC: number | null;
  tva: number | null;
  notes: string;
  size: number;
  previewUrl: string | null;
  status: 'validee' | 'en_attente' | 'erreur';
  lineItems?: ExtractedLineItem[];
}

interface ExtractedLineItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  unitPrice: number | null;
  total: number | null;
  matchedIngredient: Ingredient | null;
  matchScore: number;
  isNewIngredient: boolean;
  priceDiff: number | null;
  priceDiffPct: number | null;
}

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

function formatEuro(n: number | null | undefined): string {
  if (n == null) return '--';
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20AC';
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
  score: number;
}

function fuzzyScore(a: string, b: string): number {
  const la = a.toLowerCase().trim();
  const lb = b.toLowerCase().trim();
  if (la === lb) return 1;
  if (lb.includes(la) || la.includes(lb)) return 0.85;
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

/* ─── AI Scan Types ─── */

interface AiScanItem {
  name: string;
  quantity: number | null;
  unit: string;
  unitPrice: number | null;
  totalPrice: number | null;
}

interface AiScanResult {
  fournisseur: string | null;
  dateFacture: string | null;
  numeroFacture: string | null;
  items: AiScanItem[];
  totalHT: number | null;
  totalTTC: number | null;
  tva: number | null;
}

interface AiScanMatch {
  scanItem: AiScanItem;
  ingredient: Ingredient | null;
  score: number;
  oldPrice: number | null;
  newPrice: number | null;
  priceDiff: number | null;
  priceDiffPct: number | null;
}

function matchScanItems(items: AiScanItem[], ingredients: Ingredient[]): AiScanMatch[] {
  return items.map((scanItem) => {
    let best: Ingredient | null = null;
    let bestScore = 0;
    for (const ing of ingredients) {
      const s = fuzzyScore(scanItem.name, ing.name);
      if (s > bestScore) {
        bestScore = s;
        best = ing;
      }
    }
    const matched = bestScore >= 0.4 ? best : null;
    const newPrice = scanItem.unitPrice;
    const oldPrice = matched ? matched.pricePerUnit : null;
    const diff = (newPrice != null && oldPrice != null) ? newPrice - oldPrice : null;
    const diffPct = (diff != null && oldPrice != null && oldPrice > 0) ? (diff / oldPrice) * 100 : null;
    return { scanItem, ingredient: matched, score: bestScore, oldPrice, newPrice, priceDiff: diff, priceDiffPct: diffPct };
  });
}

function parseOcrText(text: string): OcrItem[] {
  const lines = text.split('\n').filter((l) => l.trim());
  const items: OcrItem[] = [];
  const lineRegex =
    /^(.+?)\s{2,}(\d+[.,]?\d*)\s+(kg|g|L|l|cl|ml|unite|unit\u00e9|u|pce|pi\u00e8ce|bte|boite|bo\u00eete|lot|carton|crt|sac)\s+(\d+[.,]?\d*)\s+(\d+[.,]?\d*)\s*$/i;
  const tabRegex =
    /^(.+?)\t+(\d+[.,]?\d*)\t+(kg|g|L|l|cl|ml|unite|unit\u00e9|u|pce|pi\u00e8ce|bte|boite|bo\u00eete|lot|carton|crt|sac)\t+(\d+[.,]?\d*)\t+(\d+[.,]?\d*)\s*$/i;
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

/* ─── Upload progress steps ─── */
const PROGRESS_STEPS = [
  { label: 'Analyse en cours...', pct: 30 },
  { label: 'Extraction des donnees...', pct: 65 },
  { label: 'Verification...', pct: 90 },
  { label: 'Termine !', pct: 100 },
];

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
  const [activeTab, setActiveTab] = useState<'scanner' | 'historique' | 'ocr'>('scanner');

  /* AI Scanner state */
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<AiScanResult | null>(null);
  const [scanMatches, setScanMatches] = useState<AiScanMatch[]>([]);
  const [scanProcessing, setScanProcessing] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanImporting, setScanImporting] = useState(false);
  const [scanImported, setScanImported] = useState(false);
  const scanFileInputRef = useRef<HTMLInputElement>(null);
  const scanCameraInputRef = useRef<HTMLInputElement>(null);
  const scanDropRef = useRef<HTMLDivElement>(null);

  /* Upload progress */
  const [uploadProgressStep, setUploadProgressStep] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);

  /* Editable extracted data */
  const [editableHeader, setEditableHeader] = useState<{
    fournisseur: string;
    dateFacture: string;
    numero: string;
    totalHT: string;
    tva: string;
    totalTTC: string;
  } | null>(null);

  /* Invoice detail view */
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceFile | null>(null);

  /* Drag over state for drop zone */
  const [isDragOver, setIsDragOver] = useState(false);

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
      .catch(() => {});
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
          tva: inv.tva ?? null,
          notes: inv.rawText || '',
          size: 0,
          previewUrl: null,
          status: (inv.status as any) || 'validee',
        }));
        setInvoices(mapped);
      })
      .catch(() => {})
      .finally(() => setLoadingInvoices(false));
  }, [selectedRestaurant, restaurantLoading]);

  /* Refs */
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const validatedCount = invoices.filter((i) => i.status === 'validee').length;
  const pendingCount = invoices.filter((i) => i.status === 'en_attente').length;

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
          .catch(() => {})
          .finally(() => setScanLoading(false));
      };
      reader.readAsDataURL(firstFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch { /* silent */ }
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
      tva: null,
      notes: metaForm.notes,
      size: file.size,
      previewUrl: url,
      status: 'en_attente',
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
      updateOnboardingStep('invoiceScanned', true);
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
    if (!window.confirm('Supprimer cette facture ?')) return;
    const inv = invoices.find((i) => i.id === id);
    if (inv?.previewUrl && inv.file) URL.revokeObjectURL(inv.previewUrl);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showToast(t('invoiceScanner.invoiceDeleted'), 'success');
    if (inv?.dbId) {
      fetch(`/api/invoices/${inv.dbId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }).catch(() => {});
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
      tva: Math.round(totalHT * 0.2 * 100) / 100,
      notes: summary,
      size: ocrText.length,
      previewUrl: null,
      status: 'en_attente',
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
      } catch { /* skip */ }
    }
    try {
      const fresh = await fetchIngredients();
      setIngredientsList(fresh);
    } catch { /* */ }
    setUpdatingPrices(false);
    showToast(t('invoiceScanner.pricesUpdated'), 'success');
    setShowMatchPanel(false);
  };

  /* ─── AI Scanner handlers ─── */

  const handleScanFile = useCallback((file: File) => {
    if (scanPreviewUrl) URL.revokeObjectURL(scanPreviewUrl);
    setScanFile(file);
    setScanPreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
    setScanMatches([]);
    setScanError(null);
    setScanImported(false);
    setEditableHeader(null);
  }, [scanPreviewUrl]);

  const handleScanDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const valid = files.find((f) => f.type.startsWith('image/') || f.type === 'application/pdf');
    if (valid) handleScanFile(valid);
    else showToast('Format non supporte. Utilisez JPG, PNG ou PDF.', 'error');
  }, [handleScanFile, showToast]);

  const handleScanDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleScanDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  // Animated progress simulation
  const simulateProgress = useCallback(() => {
    setShowUploadProgress(true);
    setUploadProgressStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setUploadProgressStep(1), 1200));
    timers.push(setTimeout(() => setUploadProgressStep(2), 2800));
    timers.push(setTimeout(() => setUploadProgressStep(3), 4200));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleRunScan = async () => {
    if (!scanFile) return;
    setScanProcessing(true);
    setScanError(null);
    setScanResult(null);
    setScanMatches([]);
    setScanImported(false);
    setEditableHeader(null);

    const cleanup = simulateProgress();

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(scanFile);
      });

      const commaIdx = dataUrl.indexOf(',');
      const imageBase64 = dataUrl.slice(commaIdx + 1);
      const mimeType = scanFile.type || 'image/jpeg';

      const res = await fetch('/api/invoices/scan', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ imageBase64, mimeType }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setScanError(data.error || 'Erreur lors du scan');
        setShowUploadProgress(false);
        cleanup();
        return;
      }

      const result: AiScanResult = {
        fournisseur: data.fournisseur || data.supplier || null,
        dateFacture: data.dateFacture || data.date || null,
        numeroFacture: data.numeroFacture || data.invoiceNumber || null,
        items: (data.items || []).map((item: any) => ({
          name: item.name || item.designation || item.productName || '',
          quantity: item.quantity ?? item.quantite ?? null,
          unit: item.unit || item.unite || '',
          unitPrice: item.unitPrice ?? item.prixUnitaire ?? null,
          totalPrice: item.totalPrice ?? item.total ?? null,
        })),
        totalHT: data.totalHT ?? null,
        totalTTC: data.totalTTC ?? null,
        tva: data.tva ?? null,
      };

      setScanResult(result);

      // Set editable header
      setEditableHeader({
        fournisseur: result.fournisseur || '',
        dateFacture: result.dateFacture || '',
        numero: result.numeroFacture || '',
        totalHT: result.totalHT != null ? String(result.totalHT) : '',
        tva: result.tva != null ? String(result.tva) : '',
        totalTTC: result.totalTTC != null ? String(result.totalTTC) : '',
      });

      // Auto-match
      if (ingredientsList.length > 0 && result.items.length > 0) {
        const matches = matchScanItems(result.items, ingredientsList);
        setScanMatches(matches);
      }

      // Finish progress
      setUploadProgressStep(3);
      setTimeout(() => setShowUploadProgress(false), 800);
    } catch (err: any) {
      setScanError(err?.message || 'Erreur reseau');
      setShowUploadProgress(false);
    } finally {
      setScanProcessing(false);
      cleanup();
    }
  };

  const handleScanImport = async () => {
    if (!scanResult) return;
    setScanImporting(true);

    try {
      const supplierName = editableHeader?.fournisseur || scanResult.fournisseur || 'Inconnu';
      const invoiceNumber = editableHeader?.numero || scanResult.numeroFacture || '';
      const invoiceDate = editableHeader?.dateFacture || scanResult.dateFacture || new Date().toISOString().slice(0, 10);
      const totalHT = editableHeader?.totalHT ? parseFloat(editableHeader.totalHT) : scanResult.totalHT;
      const totalTTC = editableHeader?.totalTTC ? parseFloat(editableHeader.totalTTC) : scanResult.totalTTC;

      const invoiceRes = await fetch('/api/invoices', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          supplierName,
          invoiceNumber,
          invoiceDate,
          totalHT,
          totalTTC,
          totalAmount: totalTTC || totalHT || 0,
          items: scanResult.items.map((item) => ({
            productName: item.name,
            quantity: item.quantity || 0,
            unit: item.unit || '',
            unitPrice: item.unitPrice || 0,
            total: item.totalPrice || 0,
          })),
        }),
      });

      let invoiceId: number | null = null;
      if (invoiceRes.ok) {
        const created = await invoiceRes.json();
        invoiceId = created.id;
      }

      const matchedItems = scanMatches.filter((m) => m.ingredient && m.newPrice != null);
      let pricesUpdated = 0;

      for (const m of matchedItems) {
        if (!m.ingredient || m.newPrice == null) continue;
        try {
          await updateIngredient(m.ingredient.id, { pricePerUnit: m.newPrice });
          pricesUpdated++;
        } catch { /* skip */ }
      }

      try {
        const fresh = await fetchIngredients();
        setIngredientsList(fresh);
      } catch { /* */ }

      const newInv: InvoiceFile = {
        id: invoiceId ? `db-${invoiceId}` : generateId(),
        dbId: invoiceId ?? undefined,
        file: scanFile,
        name: scanFile?.name || `Facture_${supplierName}_${today()}`,
        type: 'image',
        fournisseur: supplierName,
        invoiceNumber,
        dateFacture: invoiceDate,
        dateAjout: today(),
        montantHT: totalHT,
        montantTTC: totalTTC,
        tva: editableHeader?.tva ? parseFloat(editableHeader.tva) : scanResult.tva,
        notes: `Scanner IA - ${scanResult.items.length} lignes`,
        size: scanFile?.size || 0,
        previewUrl: scanPreviewUrl,
        status: 'validee',
      };
      setInvoices((prev) => [newInv, ...prev]);

      setScanImported(true);
      showToast(`Facture importee ! ${pricesUpdated} prix mis a jour.`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Erreur import', 'error');
    } finally {
      setScanImporting(false);
    }
  };

  const handleScanReset = () => {
    if (scanPreviewUrl) URL.revokeObjectURL(scanPreviewUrl);
    setScanFile(null);
    setScanPreviewUrl(null);
    setScanResult(null);
    setScanMatches([]);
    setScanError(null);
    setScanImported(false);
    setEditableHeader(null);
    setShowUploadProgress(false);
  };

  /* Quick actions */
  const handleUpdatePricesFromScan = async () => {
    if (scanMatches.length === 0) return;
    const toUpdate = scanMatches.filter((m) => m.ingredient && m.newPrice != null && m.priceDiff !== 0);
    if (toUpdate.length === 0) {
      showToast('Aucun prix a mettre a jour.', 'info');
      return;
    }
    setUpdatingPrices(true);
    let ok = 0;
    for (const m of toUpdate) {
      if (!m.ingredient || m.newPrice == null) continue;
      try {
        await updateIngredient(m.ingredient.id, { pricePerUnit: m.newPrice });
        ok++;
      } catch { /* */ }
    }
    try { setIngredientsList(await fetchIngredients()); } catch { /* */ }
    setUpdatingPrices(false);
    showToast(`${ok} prix ingredients mis a jour.`, 'success');
  };

  const handleArchiveInvoice = (id: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: 'validee' as const } : inv));
    showToast('Facture archivee.', 'success');
  };

  /* Status badge */
  const StatusBadge = ({ status }: { status: InvoiceFile['status'] }) => {
    const config = {
      validee: { label: 'Validee', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
      en_attente: { label: 'En attente', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', icon: Clock },
      erreur: { label: 'Erreur', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', icon: AlertCircle },
    };
    const c = config[status];
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  /* Price indicator */
  const PriceIndicator = ({ diff, pct }: { diff: number | null; pct: number | null }) => {
    if (diff == null || pct == null) return <span className="text-xs text-black/40 dark:text-white/40">--</span>;
    if (Math.abs(diff) < 0.01) return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <Minus className="w-3 h-3" /> Prix stable
      </span>
    );
    if (diff > 0) return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
        <TrendingUp className="w-3 h-3" /> Hausse +{pct.toFixed(1)}%
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <TrendingDown className="w-3 h-3" /> Baisse {pct.toFixed(1)}%
      </span>
    );
  };

  /* ─── Render ─── */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center">
              <ReceiptText className="w-5 h-5 text-white dark:text-black" />
            </div>
            Scanner Factures
          </h1>
          <p className="text-black/50 dark:text-white/50 mt-1 text-sm">
            {t('invoiceScanner.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl
                       hover:bg-black/80 dark:hover:bg-white/80 text-sm font-medium
                       flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une facture
          </button>
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
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total factures', value: totalCount, icon: FileText, color: 'bg-black dark:bg-white', iconColor: 'text-white dark:text-black' },
          { label: 'Ce mois-ci', value: thisMonth, icon: Calendar, color: 'bg-emerald-500', iconColor: 'text-white' },
          { label: 'Volume total', value: formatEuro(volumeTotal), icon: Euro, color: 'bg-amber-500', iconColor: 'text-white' },
          { label: 'Fournisseurs', value: uniqueSuppliers, icon: Package, color: 'bg-violet-500', iconColor: 'text-white' },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-4 hover:border-black/20 dark:hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className="text-xs text-black/50 dark:text-white/50 font-medium uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-black dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-2xl p-1 w-fit">
        {([
          { key: 'scanner' as const, label: 'Scanner IA', icon: Zap },
          { key: 'historique' as const, label: 'Historique', icon: FolderOpen },
          { key: 'ocr' as const, label: 'OCR Manuel', icon: ScanLine },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === tab.key
                ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg'
                : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Scanner IA Tab ─── */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">

          {/* Drag & Drop Upload Zone */}
          {!scanFile && (
            <div
              ref={scanDropRef}
              onDrop={handleScanDrop}
              onDragOver={handleScanDragOver}
              onDragLeave={handleScanDragLeave}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                         transition-all duration-300 ${
                isDragOver
                  ? 'border-black dark:border-white bg-black/5 dark:bg-white/5 scale-[1.01]'
                  : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40'
              }`}
              onClick={() => scanFileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                  isDragOver ? 'bg-black dark:bg-white' : 'bg-black/5 dark:bg-white/5'
                }`}>
                  <Upload className={`w-8 h-8 transition-colors ${
                    isDragOver ? 'text-white dark:text-black' : 'text-black/40 dark:text-white/40'
                  }`} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    Glissez vos factures ici
                  </p>
                  <p className="text-sm text-black/50 dark:text-white/50 mt-1">
                    ou{' '}
                    <span
                      className="text-black dark:text-white underline underline-offset-2 cursor-pointer hover:text-black/70 dark:hover:text-white/70"
                      onClick={(e) => {
                        e.stopPropagation();
                        scanFileInputRef.current?.click();
                      }}
                    >
                      cliquez pour parcourir
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {[
                    { ext: 'PDF', icon: FileText, color: 'text-red-500' },
                    { ext: 'JPG', icon: Image, color: 'text-blue-500' },
                    { ext: 'PNG', icon: Image, color: 'text-emerald-500' },
                  ].map((ft) => (
                    <span key={ft.ext} className="flex items-center gap-1 text-xs text-black/40 dark:text-white/40">
                      <ft.icon className={`w-3.5 h-3.5 ${ft.color}`} />
                      .{ft.ext.toLowerCase()}
                    </span>
                  ))}
                </div>
                {/* Mobile camera button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scanCameraInputRef.current?.click();
                  }}
                  className="mt-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl
                             hover:bg-black/80 dark:hover:bg-white/80 text-sm font-medium
                             flex items-center gap-2 transition-colors sm:hidden"
                >
                  <Camera className="w-4 h-4" />
                  Prendre en photo
                </button>
              </div>
              <input
                ref={scanCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleScanFile(f);
                  e.target.value = '';
                }}
              />
              <input
                ref={scanFileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleScanFile(f);
                  e.target.value = '';
                }}
              />
            </div>
          )}

          {/* Upload Progress */}
          {showUploadProgress && scanProcessing && (
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-black dark:text-white" />
                <span className="text-sm font-medium text-black dark:text-white">
                  {PROGRESS_STEPS[uploadProgressStep]?.label || 'Analyse en cours...'}
                </span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${PROGRESS_STEPS[uploadProgressStep]?.pct || 0}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                {PROGRESS_STEPS.map((step, i) => (
                  <span
                    key={step.label}
                    className={`text-xs transition-colors ${
                      i <= uploadProgressStep ? 'text-black dark:text-white font-medium' : 'text-black/30 dark:text-white/30'
                    }`}
                  >
                    {i <= uploadProgressStep ? <Check className="w-3 h-3 inline mr-1" /> : null}
                    {step.label.replace('...', '').replace('!', '')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preview + Actions when file is selected */}
          {scanFile && (
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    {scanFile.type === 'application/pdf' ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <Image className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{scanFile.name}</p>
                    <p className="text-xs text-black/40 dark:text-white/40">{formatSize(scanFile.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!scanProcessing && !scanResult && (
                    <button
                      onClick={handleRunScan}
                      className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl
                                 hover:bg-black/80 dark:hover:bg-white/80 text-sm font-medium
                                 flex items-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      Analyser avec l'IA
                    </button>
                  )}
                  <button
                    onClick={handleScanReset}
                    className="px-3 py-2 text-sm text-black/50 dark:text-white/50 hover:bg-black/5
                               dark:hover:bg-white/5 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Nouveau
                  </button>
                </div>
              </div>

              {/* Image preview */}
              {scanPreviewUrl && scanFile.type.startsWith('image/') && (
                <div className="p-6 bg-black/[0.02] dark:bg-white/[0.02] flex justify-center">
                  <img
                    src={scanPreviewUrl}
                    alt="Apercu facture"
                    className="max-h-72 rounded-xl border border-black/10 dark:border-white/10 object-contain"
                  />
                </div>
              )}

              {/* Error state */}
              {scanError && (
                <div className="p-4 m-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">Erreur de scan</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{scanError}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Extracted Data Preview (editable) ─── */}
          {scanResult && editableHeader && (
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-black dark:text-white">
                  Donnees extraites
                </h3>
                <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full font-medium">
                  Editable
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Fournisseur */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      Fournisseur
                    </label>
                    <input
                      type="text"
                      value={editableHeader.fournisseur}
                      onChange={(e) => setEditableHeader({ ...editableHeader, fournisseur: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10
                                 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                                 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Date */}
                  <div>
                    <label className="block text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      Date facture
                    </label>
                    <input
                      type="text"
                      value={editableHeader.dateFacture}
                      onChange={(e) => setEditableHeader({ ...editableHeader, dateFacture: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10
                                 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                                 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Numero */}
                  <div>
                    <label className="block text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      Numero
                    </label>
                    <input
                      type="text"
                      value={editableHeader.numero}
                      onChange={(e) => setEditableHeader({ ...editableHeader, numero: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10
                                 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                                 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Total HT */}
                  <div>
                    <label className="block text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      Total HT
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editableHeader.totalHT}
                      onChange={(e) => setEditableHeader({ ...editableHeader, totalHT: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10
                                 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                                 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  {/* TVA */}
                  <div>
                    <label className="block text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      TVA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editableHeader.tva}
                      onChange={(e) => setEditableHeader({ ...editableHeader, tva: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10
                                 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                                 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Total TTC */}
                  <div>
                    <label className="block text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1.5 font-medium">
                      Total TTC
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editableHeader.totalTTC}
                      onChange={(e) => setEditableHeader({ ...editableHeader, totalTTC: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10
                                 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                                 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Line Items Table with matching ─── */}
          {scanResult && scanResult.items.length > 0 && (
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                  <ScanLine className="w-4 h-4 text-black/40 dark:text-white/40" />
                  {scanResult.items.length} ligne(s) detectee(s)
                </h3>
                {scanMatches.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {scanMatches.filter(m => m.ingredient).length} matchs
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      {scanMatches.filter(m => !m.ingredient).length} nouveaux
                    </span>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                        Ingredient
                      </th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-20">
                        Quantite
                      </th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-16">
                        Unite
                      </th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-28">
                        Prix unitaire
                      </th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-24">
                        Montant
                      </th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-36">
                        Statut
                      </th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-36">
                        Prix
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResult.items.map((item, idx) => {
                      const match = scanMatches[idx];
                      return (
                        <tr
                          key={idx}
                          className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-black dark:text-white">{item.name}</span>
                          </td>
                          <td className="px-3 py-3 text-center text-black/60 dark:text-white/60">
                            {item.quantity != null ? item.quantity : '--'}
                          </td>
                          <td className="px-3 py-3 text-center text-black/60 dark:text-white/60">
                            {item.unit || '--'}
                          </td>
                          <td className="px-3 py-3 text-center text-black/60 dark:text-white/60">
                            {item.unitPrice != null ? formatEuro(item.unitPrice) : '--'}
                          </td>
                          <td className="px-3 py-3 text-center font-medium text-black dark:text-white">
                            {item.totalPrice != null ? formatEuro(item.totalPrice) : '--'}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {match?.ingredient ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                                <Check className="w-3 h-3" />
                                {match.ingredient.name}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                                <Plus className="w-3 h-3" />
                                Nouvel ingredient
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {match ? (
                              <PriceIndicator diff={match.priceDiff} pct={match.priceDiffPct} />
                            ) : (
                              <span className="text-xs text-black/30 dark:text-white/30">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-black/[0.03] dark:bg-white/[0.03]">
                      <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-black/70 dark:text-white/70 text-right">
                        Total HT :
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-black dark:text-white text-center">
                        {formatEuro(scanResult.totalHT ?? scanResult.items.reduce((s, i) => s + (i.totalPrice || 0), 0))}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* ─── Quick Actions after validation ─── */}
          {scanResult && !scanImported && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleScanImport}
                disabled={scanImporting}
                className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl
                           hover:bg-black/80 dark:hover:bg-white/80 text-sm font-semibold
                           flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {scanImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Valider et importer
              </button>
              {scanMatches.some(m => m.priceDiff !== null && m.priceDiff !== 0) && (
                <button
                  onClick={handleUpdatePricesFromScan}
                  disabled={updatingPrices}
                  className="flex-1 px-6 py-3 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 rounded-2xl
                             hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm font-semibold
                             flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {updatingPrices ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpDown className="w-4 h-4" />}
                  Mettre a jour les prix ingredients
                </button>
              )}
              <button
                onClick={handleScanReset}
                className="px-6 py-3 border border-black/10 dark:border-white/10 text-black/50 dark:text-white/50
                           rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          )}

          {/* Success state with quick actions */}
          {scanImported && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 mx-auto bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                Facture importee avec succes !
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                Les prix des ingredients ont ete mis a jour.
              </p>
              {/* Quick actions after validation */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <button
                  onClick={handleUpdatePricesFromScan}
                  disabled={updatingPrices}
                  className="px-4 py-2.5 text-sm font-medium bg-white dark:bg-black border border-emerald-300 dark:border-emerald-700
                             text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30
                             flex items-center gap-2 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Mettre a jour les prix
                </button>
                <button
                  onClick={() => {
                    setActiveTab('historique');
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-white dark:bg-black border border-emerald-300 dark:border-emerald-700
                             text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30
                             flex items-center gap-2 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Archiver la facture
                </button>
                <button
                  onClick={handleScanReset}
                  className="px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-xl
                             hover:bg-emerald-700 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Scanner une autre facture
                </button>
              </div>
            </div>
          )}

          {/* Empty items state */}
          {scanResult && scanResult.items.length === 0 && !scanError && (
            <div className="text-center py-12 text-black/40 dark:text-white/40">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Aucune ligne produit detectee.</p>
              <p className="text-xs mt-1">Essayez avec une photo plus nette ou un angle different.</p>
            </div>
          )}

          {/* How it works - when no file selected */}
          {!scanFile && (
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-4">Comment ca marche ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '1', icon: Camera, title: 'Photographiez', desc: 'Prenez en photo votre facture ou bon de livraison' },
                  { step: '2', icon: Sparkles, title: "L'IA analyse", desc: 'Extraction automatique des produits, prix et totaux' },
                  { step: '3', icon: ArrowUpDown, title: 'Comparez et importez', desc: 'Comparez avec vos prix actuels et importez en un clic' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white dark:text-black">{s.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{s.title}</p>
                      <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Invoice History Tab ─── */}
      {activeTab === 'historique' && (
        <div className="space-y-4">
          {/* Filters bar */}
          <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
                <input
                  type="text"
                  placeholder={t('invoiceScanner.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                             bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                             focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder:text-black/30 dark:placeholder:text-white/30"
                />
              </div>

              {/* Type filter */}
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-xl p-1">
                {(['all', 'pdf', 'image'] as const).map((ft) => (
                  <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      filterType === ft
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                        : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {ft === 'all' ? 'Tous' : ft === 'pdf' ? 'PDF' : 'Images'}
                  </button>
                ))}
              </div>

              {/* Fournisseur filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
                <select
                  value={filterFournisseur}
                  onChange={(e) => setFilterFournisseur(e.target.value)}
                  className="pl-9 pr-8 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                             bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                             focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none"
                >
                  <option value="">{t('invoiceScanner.allSuppliers')}</option>
                  {allFournisseurs.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30 dark:text-white/30" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="pl-9 pr-8 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                             bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                             focus:ring-2 focus:ring-black dark:focus:ring-white appearance-none"
                >
                  <option value="date">{t('invoiceScanner.sortDate')}</option>
                  <option value="nom">{t('invoiceScanner.sortName')}</option>
                  <option value="fournisseur">{t('invoiceScanner.sortSupplier')}</option>
                </select>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-black dark:bg-white shadow-sm text-white dark:text-black'
                      : 'text-black/40 dark:text-white/40'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-black dark:bg-white shadow-sm text-white dark:text-black'
                      : 'text-black/40 dark:text-white/40'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status summary mini-bar */}
          <div className="flex items-center gap-4 px-1">
            <span className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {validatedCount} validee(s)
            </span>
            <span className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {pendingCount} en attente
            </span>
            <span className="flex items-center gap-1.5 text-xs text-black/50 dark:text-white/50">
              <FileText className="w-3.5 h-3.5 text-black/30 dark:text-white/30" />
              {filtered.length} affichee(s)
            </span>
          </div>

          {/* Files display */}
          {loadingInvoices ? (
            <div className="flex items-center justify-center py-16 text-black/40 dark:text-white/40 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{t('invoiceScanner.loading')}</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-black/40 dark:text-white/40">
              <FolderOpen className="w-14 h-14 mx-auto mb-4 opacity-30" />
              <p className="font-medium">{t('invoiceScanner.noInvoicesFound')}</p>
              <p className="text-xs mt-1">Scannez votre premiere facture pour commencer</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid view */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl
                             hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg transition-all overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedInvoice(inv)}
                >
                  {/* Icon / thumbnail */}
                  <div className="h-28 flex items-center justify-center bg-black/[0.02] dark:bg-white/[0.02] relative">
                    {inv.type === 'pdf' ? (
                      <FileText className="w-12 h-12 text-red-400/80" />
                    ) : inv.previewUrl ? (
                      <img src={inv.previewUrl} alt={inv.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <Image className="w-12 h-12 text-blue-400/80" />
                    )}
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-black dark:text-white truncate flex-1" title={inv.name}>
                        {inv.fournisseur}
                      </p>
                    </div>
                    <p className="text-xs text-black/40 dark:text-white/40">{inv.invoiceNumber || inv.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(inv.dateAjout).toLocaleDateString('fr-FR')}
                      </span>
                      {inv.montantTTC != null && (
                        <span className="text-sm font-bold text-black dark:text-white">
                          {formatEuro(inv.montantTTC)}
                        </span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePreview(inv); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-black/60
                                   dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Voir
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(inv); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-black/60
                                   dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> DL
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500
                                   hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
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
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                            {inv.type === 'pdf' ? (
                              <FileText className="w-4 h-4 text-red-500" />
                            ) : (
                              <Image className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <span className="text-black dark:text-white font-medium">{inv.fournisseur}</span>
                            <p className="text-xs text-black/40 dark:text-white/40">{inv.invoiceNumber || inv.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/60 dark:text-white/60">
                        {new Date(inv.dateAjout).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-black dark:text-white">
                        {formatEuro(inv.montantTTC)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            inv.type === 'pdf'
                              ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                              : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {inv.type === 'pdf' ? 'PDF' : 'Image'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePreview(inv); }}
                            className="p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white
                                       hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(inv); }}
                            className="p-2 text-black/40 dark:text-white/40 hover:text-emerald-600
                                       hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-colors"
                            title="Telecharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleArchiveInvoice(inv.id); }}
                            className="p-2 text-black/40 dark:text-white/40 hover:text-blue-600
                                       hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
                            title="Archiver"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }}
                            className="p-2 text-black/40 dark:text-white/40 hover:text-red-600
                                       hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Supprimer"
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
        </div>
      )}

      {/* ─── OCR Tab ─── */}
      {activeTab === 'ocr' && (
        <div className="space-y-6">
          {/* OCR text input */}
          <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2 mb-1">
              <ScanLine className="w-5 h-5 text-black/40 dark:text-white/40" />
              Scanner OCR
            </h2>
            <p className="text-sm text-black/50 dark:text-white/50 mb-4">
              {t('invoiceScanner.ocrDescription')}
              <span className="font-mono text-xs bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg ml-1">
                Nom produit  qte  unite  prix_unitaire  total
              </span>
            </p>
            <textarea
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              rows={8}
              placeholder={`Exemple :\nTomates grappe  5  kg  2.50  12.50\nSaumon frais  3  kg  15.00  45.00\nHuile olive  2  L  8.99  17.98`}
              className="w-full px-4 py-3 text-sm rounded-xl border border-black/10 dark:border-white/10
                         bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white font-mono
                         focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent resize-y
                         placeholder:text-black/30 dark:placeholder:text-white/30"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleParseOcr}
                disabled={!ocrText.trim()}
                className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl
                           hover:bg-black/80 dark:hover:bg-white/80 text-sm font-medium
                           disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <ScanLine className="w-4 h-4" />
                Parser le texte
              </button>
              {ocrParsed && ocrItems.length > 0 && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {ocrItems.length} ligne(s) extraite(s)
                </span>
              )}
            </div>
          </div>

          {/* Extracted items table */}
          {ocrParsed && ocrItems.length > 0 && (
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-500" />
                  Lignes extraites (editables)
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMatchPrices}
                    className="px-3 py-1.5 text-xs font-medium bg-violet-50 dark:bg-violet-950/30 text-violet-700
                               dark:text-violet-300 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-950/50
                               flex items-center gap-1 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    Matcher les prix
                  </button>
                  <button
                    onClick={handleAddToInvoice}
                    className="px-3 py-1.5 text-xs font-medium bg-black dark:bg-white text-white dark:text-black
                               rounded-xl hover:bg-black/80 dark:hover:bg-white/80 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter a la facture
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Produit</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-20">Qte</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-20">Unite</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-28">Prix unitaire</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider w-28">Total</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {ocrItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleOcrItemChange(item.id, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-black/10 dark:border-white/10
                                       bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.qty}
                            onChange={(e) => handleOcrItemChange(item.id, 'qty', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm text-center rounded-lg border border-black/10 dark:border-white/10
                                       bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleOcrItemChange(item.id, 'unit', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm text-center rounded-lg border border-black/10 dark:border-white/10
                                       bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.prixUnitaire}
                            onChange={(e) => handleOcrItemChange(item.id, 'prixUnitaire', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm text-center rounded-lg border border-black/10 dark:border-white/10
                                       bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            value={item.total}
                            onChange={(e) => handleOcrItemChange(item.id, 'total', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-sm text-center rounded-lg border border-black/10 dark:border-white/10
                                       bg-transparent text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            onClick={() => handleRemoveOcrItem(item.id)}
                            className="p-1.5 text-black/30 dark:text-white/30 hover:text-red-500 rounded-lg transition-colors"
                            title={t('invoiceScanner.deleteLine')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-black/[0.03] dark:bg-white/[0.03]">
                      <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-black/70 dark:text-white/70 text-right">
                        {t('invoiceScanner.totalHT')} :
                      </td>
                      <td className="px-3 py-3 text-sm font-bold text-black dark:text-white text-center">
                        {formatEuro(ocrItems.reduce((s, i) => s + i.total, 0))}
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
            <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-violet-500" />
                  Matching ingredients
                </h3>
                <button
                  onClick={handleApplyPrices}
                  disabled={updatingPrices}
                  className="px-4 py-2 text-xs font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700
                             disabled:opacity-50 flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  {updatingPrices ? 'Mise a jour...' : 'Appliquer les nouveaux prix'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                      <th className="text-left px-4 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Produit facture</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Match</th>
                      <th className="text-left px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Ingredient</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Prix actuel</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Nouveau prix</th>
                      <th className="text-center px-3 py-3 text-xs font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">Ecart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocrMatches.map((m) => {
                      const diff = m.ingredient ? m.ocrItem.prixUnitaire - m.ingredient.pricePerUnit : 0;
                      const pctDiff = m.ingredient && m.ingredient.pricePerUnit > 0 ? ((diff / m.ingredient.pricePerUnit) * 100) : 0;
                      return (
                        <tr key={m.ocrItem.id} className="border-b border-black/5 dark:border-white/5">
                          <td className="px-4 py-3 text-black dark:text-white font-medium">{m.ocrItem.name}</td>
                          <td className="px-3 py-3 text-center">
                            {m.ingredient ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                                <Check className="w-3 h-3" /> {Math.round(m.score * 100)}%
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40">
                                <AlertCircle className="w-3 h-3" /> Aucun
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-black/60 dark:text-white/60">{m.ingredient ? m.ingredient.name : '--'}</td>
                          <td className="px-3 py-3 text-center text-black/60 dark:text-white/60">
                            {m.ingredient ? formatEuro(m.ingredient.pricePerUnit) : '--'}
                          </td>
                          <td className="px-3 py-3 text-center font-medium text-black dark:text-white">
                            {formatEuro(m.ocrItem.prixUnitaire)}
                          </td>
                          <td className="px-3 py-3 text-center">
                            {m.ingredient ? (
                              <PriceIndicator diff={diff} pct={pctDiff} />
                            ) : '--'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {ocrParsed && ocrItems.length === 0 && (
            <div className="text-center py-12 text-black/40 dark:text-white/40">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t('invoiceScanner.noLinesInText')}</p>
              <p className="text-xs mt-1">Verifiez que chaque ligne suit le format : Nom  qte  unite  prix  total</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Metadata modal ─── */}
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
            <div className="flex items-center gap-3 p-3 bg-black/[0.03] dark:bg-white/[0.03] rounded-xl text-sm">
              {pendingFiles[currentPendingIndex].type === 'application/pdf' ? (
                <FileText className="w-5 h-5 text-red-500" />
              ) : (
                <Image className="w-5 h-5 text-blue-500" />
              )}
              <span className="text-black dark:text-white truncate font-medium">
                {pendingFiles[currentPendingIndex].name}
              </span>
            </div>
          )}

          {scanLoading && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              {t('invoiceScanner.aiScanning')}
            </div>
          )}
          {aiDetected && !scanLoading && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {t('invoiceScanner.aiDetected')}
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70 mb-1.5">
              {t('invoiceScanner.supplierLabel')}
              {aiDetected && metaForm.fournisseur && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-normal">
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
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                         bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                         focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
            />
            <datalist id="fournisseurs-list">
              {allFournisseurs.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70 mb-1.5">
              {t('invoiceScanner.invoiceNumberLabel')}
              {aiDetected && metaForm.invoiceNumber && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-normal">
                  {t('invoiceScanner.detectedByAI')}
                </span>
              )}
            </label>
            <input
              type="text"
              value={metaForm.invoiceNumber}
              onChange={(e) => setMetaForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
              placeholder={t('invoiceScanner.invoiceNumberPlaceholder')}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                         bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                         focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70 mb-1.5">
              {t('invoiceScanner.invoiceDateLabel')}
              {aiDetected && metaForm.dateFacture && (
                <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-normal">
                  {t('invoiceScanner.detectedByAI')}
                </span>
              )}
            </label>
            <input
              type="date"
              value={metaForm.dateFacture}
              onChange={(e) => setMetaForm((f) => ({ ...f, dateFacture: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                         bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                         focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70 mb-1.5">
                {t('invoiceScanner.amountHT')}
                {aiDetected && metaForm.montantHT && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-normal">
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
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                           bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                           focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-black/70 dark:text-white/70 mb-1.5">
                {t('invoiceScanner.amountTTC')}
                {aiDetected && metaForm.montantTTC && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-normal">
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
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                           bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                           focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1.5">
              {t('invoiceScanner.notes')}
            </label>
            <textarea
              value={metaForm.notes}
              onChange={(e) => setMetaForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder={t('invoiceScanner.notesPlaceholder')}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-black/10 dark:border-white/10
                         bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white
                         focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setShowMetadataModal(false);
                setPendingFiles([]);
                setScanLoading(false);
                setAiDetected(false);
              }}
              className="px-4 py-2.5 text-sm text-black/50 dark:text-white/50 hover:bg-black/5
                         dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={saveCurrentFile}
              disabled={savingInvoice || scanLoading}
              className="px-5 py-2.5 text-sm bg-black dark:bg-white text-white dark:text-black rounded-xl
                         hover:bg-black/80 dark:hover:bg-white/80 font-medium
                         flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* ─── Invoice Detail Modal ─── */}
      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Facture - ${selectedInvoice?.fournisseur || ''}`}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Fournisseur</p>
                <p className="text-sm font-medium text-black dark:text-white">{selectedInvoice.fournisseur}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Numero</p>
                <p className="text-sm font-medium text-black dark:text-white">{selectedInvoice.invoiceNumber || '--'}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Date facture</p>
                <p className="text-sm font-medium text-black dark:text-white">{selectedInvoice.dateFacture || '--'}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Date ajout</p>
                <p className="text-sm font-medium text-black dark:text-white">
                  {new Date(selectedInvoice.dateAjout).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Montant HT</p>
                <p className="text-sm font-bold text-black dark:text-white">{formatEuro(selectedInvoice.montantHT)}</p>
              </div>
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Montant TTC</p>
                <p className="text-sm font-bold text-black dark:text-white">{formatEuro(selectedInvoice.montantTTC)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Statut</p>
              <StatusBadge status={selectedInvoice.status} />
            </div>
            {selectedInvoice.notes && (
              <div>
                <p className="text-xs text-black/40 dark:text-white/40 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-black/60 dark:text-white/60">{selectedInvoice.notes}</p>
              </div>
            )}
            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => { handlePreview(selectedInvoice); }}
                className="px-3 py-2 text-xs font-medium border border-black/10 dark:border-white/10
                           text-black/60 dark:text-white/60 rounded-xl hover:bg-black/5 dark:hover:bg-white/5
                           flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Voir le document
              </button>
              <button
                onClick={() => { handleArchiveInvoice(selectedInvoice.id); setSelectedInvoice(null); }}
                className="px-3 py-2 text-xs font-medium border border-black/10 dark:border-white/10
                           text-black/60 dark:text-white/60 rounded-xl hover:bg-black/5 dark:hover:bg-white/5
                           flex items-center gap-1.5 transition-colors"
              >
                <Archive className="w-3.5 h-3.5" /> Archiver
              </button>
              <button
                onClick={() => { handleDelete(selectedInvoice.id); setSelectedInvoice(null); }}
                className="px-3 py-2 text-xs font-medium border border-red-200 dark:border-red-800
                           text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20
                           flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
