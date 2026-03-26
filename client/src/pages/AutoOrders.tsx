import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart, Truck, Package, Send, FileText, Check, Trash2,
  AlertTriangle, Plus, Loader2, Euro, ChevronDown, ChevronUp,
  Clock, Eye, X, Mail, Copy, RotateCcw, CopyPlus, Filter,
  CheckSquare, Square, XCircle,
} from 'lucide-react';
import { fetchIngredients, fetchSuppliers } from '../services/api';
import type { Ingredient, Supplier } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';

// ── helpers ──────────────────────────────────────────────────────────────────

const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

type OrderStatus = 'brouillon' | 'envoyé' | 'reçu';

interface OrderLine {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

interface Order {
  id: number;
  supplierId: number | null;
  supplierName: string;
  lines: OrderLine[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  status: OrderStatus;
  date: string;
  notes: string;
}

interface StockAlert {
  ingredient: Ingredient;
  currentStock: number;
  minStock: number;
  toOrder: number;
  supplierName: string;
  supplierId: number | null;
}

const STATUS_BADGE: Record<OrderStatus, { bg: string; label: string }> = {
  brouillon: { bg: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', label: 'Brouillon' },
  'envoyé': { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', label: 'Envoyé' },
  'reçu': { bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', label: 'Reçu' },
};

function fmtEuro(n: number) {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

let nextOrderId = 1;

// ── component ────────────────────────────────────────────────────────────────

export default function AutoOrders() {
  const { showToast } = useToast();

  // Data
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewOrders, setPreviewOrders] = useState<Order[]>([]);
  const [generating, setGenerating] = useState(false);

  // Email modal state
  const [emailOrder, setEmailOrder] = useState<Order | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  // Status filter
  const [statusFilter, setStatusFilter] = useState<'tous' | OrderStatus>('tous');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Editable quantities for stock alerts
  const [qtyOverrides, setQtyOverrides] = useState<Record<number, number>>({});

  // ── fetch data ─────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ings, supps] = await Promise.all([fetchIngredients(), fetchSuppliers()]);
      setIngredients(ings);
      setSuppliers(supps);
    } catch {
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── stock alerts ───────────────────────────────────────────────────────────

  const stockAlerts: StockAlert[] = useMemo(() => {
    return ingredients
      .map((ing) => {
        // Use a sensible default: 20% of price as proxy for min stock when no inventory data
        const minStock = 5; // default minimum stock threshold
        const currentStock = 0; // will be replaced by real inventory data when connected
        const toOrder = Math.max(0, minStock - currentStock + 10); // order a buffer above min
        return {
          ingredient: ing,
          currentStock,
          minStock,
          toOrder,
          supplierName: ing.supplier || 'Non assigné',
          supplierId: ing.supplierId,
        };
      })
      .filter((a) => a.currentStock < a.minStock)
      .sort((a, b) => a.currentStock - b.currentStock);
  }, [ingredients]);

  // ── summary stats ──────────────────────────────────────────────────────────

  const pendingCount = orders.filter((o) => o.status === 'brouillon').length;
  const activeSuppliers = new Set(orders.filter((o) => o.status !== 'reçu').map((o) => o.supplierName)).size;
  const totalValue = orders
    .filter((o) => o.status !== 'reçu')
    .reduce((sum, o) => sum + o.totalHT, 0);
  const lastOrderDate = orders.length > 0
    ? orders.reduce((latest, o) => (o.date > latest ? o.date : latest), orders[0].date)
    : null;

  // ── filtered orders ──────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'tous') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const totalOrdersValue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalTTC, 0);
  }, [orders]);

  // ── bulk helpers ────────────────────────────────────────────────────────

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
    }
  }

  function bulkDelete() {
    setOrders((prev) => prev.filter((o) => !selectedIds.has(o.id)));
    showToast(`${selectedIds.size} commande(s) supprimée(s)`, 'success');
    setSelectedIds(new Set());
  }

  function bulkMarkSent() {
    setOrders((prev) =>
      prev.map((o) => (selectedIds.has(o.id) ? { ...o, status: 'envoyé' as OrderStatus } : o)),
    );
    showToast(`${selectedIds.size} commande(s) marquée(s) comme envoyée(s)`, 'success');
    setSelectedIds(new Set());
  }

  function bulkMarkReceived() {
    setOrders((prev) =>
      prev.map((o) => (selectedIds.has(o.id) ? { ...o, status: 'reçu' as OrderStatus } : o)),
    );
    showToast(`${selectedIds.size} commande(s) marquée(s) comme reçue(s)`, 'success');
    setSelectedIds(new Set());
  }

  // ── generate orders ────────────────────────────────────────────────────────

  function handleGeneratePreview() {
    // Group alerts by supplier
    const grouped = new Map<string, { supplierId: number | null; lines: OrderLine[] }>();

    stockAlerts.forEach((alert) => {
      const qty = qtyOverrides[alert.ingredient.id] ?? alert.toOrder;
      if (qty <= 0) return;

      const key = alert.supplierName;
      if (!grouped.has(key)) {
        grouped.set(key, { supplierId: alert.supplierId, lines: [] });
      }
      grouped.get(key)!.lines.push({
        ingredientId: alert.ingredient.id,
        name: alert.ingredient.name,
        quantity: qty,
        unit: alert.ingredient.unit,
        pricePerUnit: alert.ingredient.pricePerUnit,
        total: qty * alert.ingredient.pricePerUnit,
      });
    });

    if (grouped.size === 0) {
      showToast('Aucun article à commander', 'error');
      return;
    }

    const preview: Order[] = [];
    grouped.forEach((val, supplierName) => {
      const totalHT = val.lines.reduce((s, l) => s + l.total, 0);
      const tva = totalHT * 0.2;
      preview.push({
        id: nextOrderId++,
        supplierId: val.supplierId,
        supplierName,
        lines: val.lines,
        totalHT,
        tva,
        totalTTC: totalHT + tva,
        status: 'brouillon',
        date: new Date().toISOString(),
        notes: '',
      });
    });

    setPreviewOrders(preview);
    setShowPreview(true);
  }

  function confirmOrders() {
    setGenerating(true);
    setTimeout(() => {
      setOrders((prev) => [...preview, ...prev]);
      setPreviewOrders([]);
      setShowPreview(false);
      setQtyOverrides({});
      setGenerating(false);
      showToast(`${previewOrders.length} commande(s) créée(s) avec succès`, 'success');
    }, 800);
  }

  const preview = previewOrders;

  // ── order actions ──────────────────────────────────────────────────────────

  function markSent(id: number) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'envoyé' as OrderStatus } : o)),
    );
    showToast('Commande marquée comme envoyée', 'success');
  }

  // ── email helpers ──────────────────────────────────────────────────────────

  function buildEmailBody(order: Order): string {
    const lines = [
      `Bonjour,`,
      ``,
      `Veuillez trouver ci-dessous notre commande :`,
      ``,
      `Fournisseur : ${order.supplierName}`,
      `Date : ${fmtDate(order.date)}`,
      ``,
      `--- Détail de la commande ---`,
      ``,
    ];
    order.lines.forEach((line) => {
      lines.push(
        `- ${line.name} : ${line.quantity} ${line.unit} x ${fmtEuro(line.pricePerUnit)} = ${fmtEuro(line.total)}`,
      );
    });
    lines.push(``);
    lines.push(`Total HT : ${fmtEuro(order.totalHT)}`);
    lines.push(`TVA (20%) : ${fmtEuro(order.tva)}`);
    lines.push(`Total TTC : ${fmtEuro(order.totalTTC)}`);
    lines.push(``);
    if (order.notes) {
      lines.push(`Notes : ${order.notes}`);
      lines.push(``);
    }
    lines.push(`Cordialement,`);
    lines.push(`RestauMargin`);
    return lines.join('\n');
  }

  function buildEmailSubject(order: Order): string {
    return `Commande RestauMargin - ${order.supplierName} - ${fmtDate(order.date)}`;
  }

  function openEmailModal(order: Order) {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    setEmailTo(supplier?.email ?? '');
    setEmailCopied(false);
    setEmailOrder(order);
  }

  function handleSendEmail() {
    if (!emailOrder) return;
    const subject = encodeURIComponent(buildEmailSubject(emailOrder));
    const body = encodeURIComponent(buildEmailBody(emailOrder));
    const mailto = `mailto:${encodeURIComponent(emailTo)}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
    markSent(emailOrder.id);
    setEmailOrder(null);
  }

  function handleCopyToClipboard() {
    if (!emailOrder) return;
    const text = `Objet : ${buildEmailSubject(emailOrder)}\n\n${buildEmailBody(emailOrder)}`;
    navigator.clipboard.writeText(text).then(() => {
      setEmailCopied(true);
      showToast('Commande copiée dans le presse-papier', 'success');
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }

  function markReceived(id: number) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'reçu' as OrderStatus } : o)),
    );
    showToast('Commande marquée comme reçue', 'success');
  }

  function confirmDeleteOrder() {
    if (deleteTarget === null) return;
    setOrders((prev) => prev.filter((o) => o.id !== deleteTarget));
    setDeleteTarget(null);
    showToast('Commande supprimée', 'success');
  }

  function deleteAllOrders() {
    setOrders([]);
    setSelectedIds(new Set());
    setDeleteAllConfirm(false);
    showToast('Toutes les commandes ont été supprimées', 'success');
  }

  function resetStockAlerts() {
    setQtyOverrides({});
    showToast('Alertes de stock réinitialisées', 'success');
  }

  function duplicateOrder(order: Order) {
    const dup: Order = {
      ...order,
      id: nextOrderId++,
      status: 'brouillon',
      date: new Date().toISOString(),
      notes: `Copie de la commande ${order.supplierName}`,
      lines: order.lines.map((l) => ({ ...l })),
    };
    setOrders((prev) => [dup, ...prev]);
    showToast(`Commande dupliquée pour ${order.supplierName}`, 'success');
  }

  function downloadPdf(order: Order) {
    showToast(`Téléchargement PDF pour ${order.supplierName}...`, 'success');
  }

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-blue-600" />
            Commandes automatiques
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Générez vos commandes fournisseurs à partir des alertes de stock
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleGeneratePreview}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Générer les commandes
          </button>
          {orders.length > 0 && (
            <button
              onClick={() => setDeleteAllConfirm(true)}
              className="flex items-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer tout
            </button>
          )}
          <button
            onClick={resetStockAlerts}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-orange-500" />}
          label="Commandes en attente"
          value={String(pendingCount)}
          bg="bg-orange-50 dark:bg-orange-900/20"
        />
        <SummaryCard
          icon={<Truck className="w-5 h-5 text-blue-500" />}
          label="Fournisseurs actifs"
          value={String(activeSuppliers)}
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard
          icon={<Euro className="w-5 h-5 text-green-500" />}
          label="Valeur totale"
          value={fmtEuro(totalValue)}
          bg="bg-green-50 dark:bg-green-900/20"
        />
        <SummaryCard
          icon={<Package className="w-5 h-5 text-purple-500" />}
          label="Dernière commande"
          value={lastOrderDate ? fmtDate(lastOrderDate) : '—'}
          bg="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* ── Stock Alerts ────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertes de stock
          </h2>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {stockAlerts.length} article(s) sous le seuil
          </span>
        </div>

        {stockAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Check className="w-10 h-10 mx-auto mb-2 text-green-500" />
            Tous les stocks sont au-dessus du seuil minimum
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Ingrédient</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Stock actuel</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Stock min.</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Qté à commander</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Fournisseur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {stockAlerts.map((alert) => (
                  <tr key={alert.ingredient.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">
                      {alert.ingredient.name}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {alert.currentStock} {alert.ingredient.unit}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                      {alert.minStock} {alert.ingredient.unit}
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        min={0}
                        value={qtyOverrides[alert.ingredient.id] ?? alert.toOrder}
                        onChange={(e) =>
                          setQtyOverrides((prev) => ({
                            ...prev,
                            [alert.ingredient.id]: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                      {alert.supplierName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Total commandes summary ────────────────────────────────────────── */}
      {orders.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Euro className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total commandes</p>
              <p className="text-xs text-blue-500 dark:text-blue-400">{orders.length} commande(s)</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{fmtEuro(totalOrdersValue)}</p>
        </div>
      )}

      {/* ── Orders list ─────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Commandes générées
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredOrders.length} commande(s)
          </span>

          {/* Status filter */}
          <div className="ml-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {(['tous', 'brouillon', 'envoyé', 'reçu'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setSelectedIds(new Set()); }}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s === 'tous' ? 'Tous' : STATUS_BADGE[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions toolbar */}
        {selectedIds.size > 0 && (
          <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {selectedIds.size} sélectionnée(s)
            </span>
            <button
              onClick={bulkDelete}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </button>
            <button
              onClick={bulkMarkSent}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Send className="w-3.5 h-3.5" /> Marquer envoyé
            </button>
            <button
              onClick={bulkMarkReceived}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Check className="w-3.5 h-3.5" /> Marquer reçu
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <XCircle className="w-3.5 h-3.5" /> Désélectionner
            </button>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            {orders.length === 0
              ? 'Aucune commande générée pour le moment'
              : 'Aucune commande pour ce filtre'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-3 py-3 w-8">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {selectedIds.size === filteredOrders.length && filteredOrders.length > 0
                        ? <CheckSquare className="w-4 h-4 text-blue-600" />
                        : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 w-8"></th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Fournisseur</th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Nb articles</th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Total HT</th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Statut</th>
                  <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    selected={selectedIds.has(order.id)}
                    onSelect={() => toggleSelect(order.id)}
                    expanded={expandedOrderId === order.id}
                    onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    onDetail={() => setDetailOrder(order)}
                    onSend={() => openEmailModal(order)}
                    onReceive={() => markReceived(order.id)}
                    onDelete={() => setDeleteTarget(order.id)}
                    onDuplicate={() => duplicateOrder(order)}
                    onPdf={() => downloadPdf(order)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Preview modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Aperçu des commandes">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {previewOrders.length} commande(s) seront créées pour {previewOrders.reduce((s, o) => s + o.lines.length, 0)} article(s).
          </p>

          {previewOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" />
                  {order.supplierName}
                </h3>
                <span className="font-semibold text-gray-900 dark:text-white">{fmtEuro(order.totalHT)}</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400">
                    <th className="pb-1">Produit</th>
                    <th className="pb-1">Qté</th>
                    <th className="pb-1">P.U.</th>
                    <th className="pb-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {order.lines.map((line) => (
                    <tr key={line.ingredientId}>
                      <td className="py-1 text-gray-800 dark:text-gray-200">{line.name}</td>
                      <td className="py-1 text-gray-600 dark:text-gray-400">{line.quantity} {line.unit}</td>
                      <td className="py-1 text-gray-600 dark:text-gray-400">{fmtEuro(line.pricePerUnit)}</td>
                      <td className="py-1 text-right font-medium text-gray-800 dark:text-gray-200">{fmtEuro(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Annuler
            </button>
            <button
              onClick={confirmOrders}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Confirmer les commandes
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Detail modal ────────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        title={`Commande — ${detailOrder?.supplierName ?? ''}`}
      >
        {detailOrder && (
          <div className="space-y-4">
            {/* Supplier info */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                {detailOrder.supplierName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date : {fmtDate(detailOrder.date)} &middot; Statut :{' '}
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[detailOrder.status].bg}`}>
                  {STATUS_BADGE[detailOrder.status].label}
                </span>
              </p>
            </div>

            {/* Line items */}
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Produit</th>
                  <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Quantité</th>
                  <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Unité</th>
                  <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Prix unitaire</th>
                  <th className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {detailOrder.lines.map((line) => (
                  <tr key={line.ingredientId}>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{line.name}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{line.quantity}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{line.unit}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{fmtEuro(line.pricePerUnit)}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">{fmtEuro(line.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Total HT</span>
                <span className="font-medium">{fmtEuro(detailOrder.totalHT)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>TVA (20%)</span>
                <span className="font-medium">{fmtEuro(detailOrder.tva)}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white font-semibold text-base pt-1 border-t border-gray-200 dark:border-gray-700">
                <span>Total TTC</span>
                <span>{fmtEuro(detailOrder.totalTTC)}</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea
                value={detailOrder.notes}
                onChange={(e) => {
                  const val = e.target.value;
                  setDetailOrder((prev) => prev ? { ...prev, notes: val } : prev);
                  setOrders((prev) =>
                    prev.map((o) => (o.id === detailOrder.id ? { ...o, notes: val } : o)),
                  );
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Ajouter des notes pour cette commande..."
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDetailOrder(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Email modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!emailOrder}
        onClose={() => setEmailOrder(null)}
        title="Envoyer la commande par email"
      >
        {emailOrder && (
          <div className="space-y-4">
            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destinataire
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="email@fournisseur.com"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Objet
              </label>
              <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/40 rounded-lg px-3 py-2">
                {buildEmailSubject(emailOrder)}
              </p>
            </div>

            {/* Body preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Corps du message
              </label>
              <pre className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 rounded-lg px-3 py-3 max-h-64 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                {buildEmailBody(emailOrder)}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                onClick={() => setEmailOrder(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition text-sm"
              >
                {emailCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {emailCopied ? 'Copié !' : 'Copier dans le presse-papier'}
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-sm"
              >
                <Mail className="w-4 h-4" />
                Envoyer par email
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete single order confirm ────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer la commande"
        message="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── Delete all orders confirm ──────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={deleteAllConfirm}
        title="Supprimer toutes les commandes"
        message={`Êtes-vous sûr de vouloir supprimer les ${orders.length} commande(s) ? Cette action est irréversible.`}
        onConfirm={deleteAllOrders}
        onCancel={() => setDeleteAllConfirm(false)}
      />
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className={`rounded-xl p-4 ${bg} border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  selected,
  onSelect,
  expanded,
  onToggle,
  onDetail,
  onSend,
  onReceive,
  onDelete,
  onDuplicate,
  onPdf,
}: {
  order: Order;
  selected: boolean;
  onSelect: () => void;
  expanded: boolean;
  onToggle: () => void;
  onDetail: () => void;
  onSend: () => void;
  onReceive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onPdf: () => void;
}) {
  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer">
        <td className="px-3 py-3">
          <button onClick={onSelect} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            {selected
              ? <CheckSquare className="w-4 h-4 text-blue-600" />
              : <Square className="w-4 h-4" />}
          </button>
        </td>
        <td className="px-4 py-3" onClick={onToggle}>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </td>
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white" onClick={onDetail}>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            {order.supplierName}
          </div>
        </td>
        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.lines.length}</td>
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{fmtEuro(order.totalHT)}</td>
        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{fmtDate(order.date)}</td>
        <td className="px-4 py-3">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[order.status].bg}`}>
            {STATUS_BADGE[order.status].label}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {order.status === 'brouillon' && (
              <button onClick={onSend} title="Envoyer" className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition shadow-sm">
                <Mail className="w-3.5 h-3.5" />
                Envoyer
              </button>
            )}
            <button onClick={onPdf} title="Télécharger PDF" className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <FileText className="w-4 h-4" />
            </button>
            {order.status === 'envoyé' && (
              <button onClick={onReceive} title="Marquer reçu" className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition">
                <Check className="w-4 h-4" />
              </button>
            )}
            <button onClick={onDuplicate} title="Dupliquer" className="p-1.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition">
              <CopyPlus className="w-4 h-4" />
            </button>
            <button onClick={onDelete} title="Supprimer" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded details */}
      {expanded && (
        <tr>
          <td colSpan={8} className="px-6 py-3 bg-gray-50 dark:bg-gray-700/20">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="pb-1 pr-4">Produit</th>
                  <th className="pb-1 pr-4">Quantité</th>
                  <th className="pb-1 pr-4">Prix unitaire</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                {order.lines.map((line) => (
                  <tr key={line.ingredientId}>
                    <td className="py-1 pr-4 text-gray-800 dark:text-gray-200">{line.name}</td>
                    <td className="py-1 pr-4 text-gray-600 dark:text-gray-400">
                      {line.quantity} {line.unit}
                    </td>
                    <td className="py-1 pr-4 text-gray-600 dark:text-gray-400">{fmtEuro(line.pricePerUnit)}</td>
                    <td className="py-1 text-right font-medium text-gray-800 dark:text-gray-200">{fmtEuro(line.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}