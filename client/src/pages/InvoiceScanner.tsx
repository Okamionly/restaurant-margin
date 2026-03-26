import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  FileText, Upload, Image, Grid, List, Search, Filter,
  Download, Trash2, Eye, Plus, FolderOpen, Euro, Calendar,
  X, File, SortAsc,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

/* ─── Types ─── */

interface InvoiceFile {
  id: string;
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

/* ─── Sample data ─── */

const sampleInvoices: InvoiceFile[] = [
  {
    id: 'sample-1',
    file: null,
    name: 'Facture_Transgourmet_Mars2026.pdf',
    type: 'pdf',
    fournisseur: 'Transgourmet',
    invoiceNumber: 'TG-2026-0342',
    dateFacture: '2026-03-15',
    dateAjout: '2026-03-15',
    montantHT: 1245.80,
    montantTTC: 1495.00,
    notes: 'Commande hebdomadaire produits secs',
    size: 245000,
    previewUrl: null,
  },
  {
    id: 'sample-2',
    file: null,
    name: 'Facture_Metro_240326.pdf',
    type: 'pdf',
    fournisseur: 'Metro',
    invoiceNumber: 'MET-8834',
    dateFacture: '2026-03-24',
    dateAjout: '2026-03-24',
    montantHT: 876.50,
    montantTTC: 1051.80,
    notes: '',
    size: 189000,
    previewUrl: null,
  },
  {
    id: 'sample-3',
    file: null,
    name: 'Bon_livraison_Pomona.jpg',
    type: 'image',
    fournisseur: 'Pomona',
    invoiceNumber: '',
    dateFacture: '2026-03-20',
    dateAjout: '2026-03-20',
    montantHT: 632.00,
    montantTTC: 758.40,
    notes: 'Fruits et legumes semaine 12',
    size: 1420000,
    previewUrl: null,
  },
  {
    id: 'sample-4',
    file: null,
    name: 'Facture_Brake_Fev2026.pdf',
    type: 'pdf',
    fournisseur: 'Brake France',
    invoiceNumber: 'BRK-2026-1187',
    dateFacture: '2026-02-28',
    dateAjout: '2026-02-28',
    montantHT: 2150.00,
    montantTTC: 2580.00,
    notes: 'Surgeles et produits laitiers',
    size: 312000,
    previewUrl: null,
  },
  {
    id: 'sample-5',
    file: null,
    name: 'Facture_EauMinerale_Mars.pdf',
    type: 'pdf',
    fournisseur: 'Transgourmet',
    invoiceNumber: 'TG-2026-0358',
    dateFacture: '2026-03-22',
    dateAjout: '2026-03-22',
    montantHT: 320.00,
    montantTTC: 384.00,
    notes: 'Boissons',
    size: 98000,
    previewUrl: null,
  },
];

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

/* ─── Component ─── */

export default function InvoiceScanner() {
  const { showToast } = useToast();

  /* State */
  const [invoices, setInvoices] = useState<InvoiceFile[]>(sampleInvoices);
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
      showToast('Formats acceptes : PDF, JPG, PNG', 'error');
      return;
    }
    setPendingFiles(valid);
    setCurrentPendingIndex(0);
    setMetaForm({
      fournisseur: '',
      invoiceNumber: '',
      dateFacture: today(),
      montantHT: '',
      montantTTC: '',
      notes: '',
    });
    setShowMetadataModal(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropRef.current?.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
  }, []);

  /* Save current pending file with metadata */
  const saveCurrentFile = () => {
    const file = pendingFiles[currentPendingIndex];
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    const url = isPdf ? null : URL.createObjectURL(file);

    const newInvoice: InvoiceFile = {
      id: generateId(),
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
      showToast(
        pendingFiles.length === 1
          ? 'Facture ajoutee avec succes'
          : `${pendingFiles.length} factures ajoutees`,
        'success'
      );
    }
  };

  /* Preview */
  const handlePreview = (inv: InvoiceFile) => {
    if (inv.file) {
      const url = URL.createObjectURL(inv.file);
      window.open(url, '_blank');
    } else {
      showToast('Apercu non disponible pour les fichiers exemples', 'info');
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
      showToast('Telechargement non disponible pour les fichiers exemples', 'info');
    }
  };

  /* Delete */
  const handleDelete = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (inv?.previewUrl && inv.file) URL.revokeObjectURL(inv.previewUrl);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showToast('Facture supprimee', 'success');
  };

  /* ─── Render ─── */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderOpen className="w-7 h-7 text-blue-600" />
          Dossier Factures
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Stockez et organisez vos factures fournisseurs
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total factures', value: totalCount, icon: FileText, color: 'text-blue-600' },
          { label: 'Ce mois', value: thisMonth, icon: Calendar, color: 'text-green-600' },
          {
            label: 'Volume total',
            value: `${volumeTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`,
            icon: Euro,
            color: 'text-amber-600',
          },
          { label: 'Fournisseurs', value: uniqueSuppliers, icon: File, color: 'text-purple-600' },
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
                   hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Glissez vos factures ici</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm my-2">ou</p>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
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
              placeholder="Rechercher par nom, fournisseur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                         focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tous fournisseurs</option>
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
                         focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="date">Date (recent)</option>
              <option value="nom">Nom</option>
              <option value="fournisseur">Fournisseur</option>
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
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aucune facture trouvee</p>
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
                  <Image className="w-14 h-14 text-blue-500" />
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
                        <Image className="w-5 h-5 text-blue-500 flex-shrink-0" />
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
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {inv.type === 'pdf' ? 'PDF' : 'Image'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handlePreview(inv)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50
                                   dark:hover:bg-blue-900/20 rounded-md"
                        title="Apercu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(inv)}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50
                                   dark:hover:bg-green-900/20 rounded-md"
                        title="Telecharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50
                                   dark:hover:bg-red-900/20 rounded-md"
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

      {/* Metadata modal */}
      <Modal
        isOpen={showMetadataModal}
        onClose={() => {
          setShowMetadataModal(false);
          setPendingFiles([]);
        }}
        title={`Ajouter les informations ${pendingFiles.length > 1 ? `(${currentPendingIndex + 1}/${pendingFiles.length})` : ''}`}
      >
        <div className="space-y-4">
          {pendingFiles[currentPendingIndex] && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
              {pendingFiles[currentPendingIndex].type === 'application/pdf' ? (
                <FileText className="w-5 h-5 text-red-500" />
              ) : (
                <Image className="w-5 h-5 text-blue-500" />
              )}
              <span className="text-gray-700 dark:text-gray-200 truncate">
                {pendingFiles[currentPendingIndex].name}
              </span>
            </div>
          )}

          {/* Fournisseur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fournisseur *
            </label>
            <input
              type="text"
              list="fournisseurs-list"
              value={metaForm.fournisseur}
              onChange={(e) => setMetaForm((f) => ({ ...f, fournisseur: e.target.value }))}
              placeholder="Nom du fournisseur"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="fournisseurs-list">
              {allFournisseurs.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          {/* Numero facture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Numero de facture
            </label>
            <input
              type="text"
              value={metaForm.invoiceNumber}
              onChange={(e) => setMetaForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
              placeholder="Ex: FAC-2026-001"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date facture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de facture
            </label>
            <input
              type="date"
              value={metaForm.dateFacture}
              onChange={(e) => setMetaForm((f) => ({ ...f, dateFacture: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant HT
              </label>
              <input
                type="number"
                step="0.01"
                value={metaForm.montantHT}
                onChange={(e) => setMetaForm((f) => ({ ...f, montantHT: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant TTC
              </label>
              <input
                type="number"
                step="0.01"
                value={metaForm.montantTTC}
                onChange={(e) => setMetaForm((f) => ({ ...f, montantTTC: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={metaForm.notes}
              onChange={(e) => setMetaForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Notes optionnelles..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setShowMetadataModal(false);
                setPendingFiles([]);
              }}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100
                         dark:hover:bg-gray-700 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={saveCurrentFile}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium
                         flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              {currentPendingIndex < pendingFiles.length - 1 ? 'Suivant' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
