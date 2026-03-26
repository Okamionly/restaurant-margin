import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart, Truck, Package, Send, FileText, Check, Trash2,
  AlertTriangle, Plus, Loader2, Euro, ChevronDown, ChevronUp,
  Clock, Eye, X,
} from 'lucide-react';
import { fetchIngredients, fetchSuppliers } from '../services/api';
import type { Ingredient, Supplier } from '../types';
import Modal from '../components/Modal';
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

  function markReceived(id: number) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'reçu' as OrderStatus } : o)),
    );
    showToast('Commande marquée comme reçue', 'success');
  }

  function deleteOrder(id: number) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    showToast('Commande supprimée', 'success');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-blue-600" />
            Commandes automatiques
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Générez vos commandes fournisseurs à partir des alertes de stock
          </p>
        </div>
        <button
          onClick={handleGeneratePreview}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Générer les commandes
        </button>
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

      {/* ── Orders list ─────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Commandes générées
          </h2>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {orders.length} commande(s)
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            Aucune commande générée pour le moment
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300 w-8"></th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Fournisseur</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Nb articles</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Total HT</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Statut</th>
                  <th className="px-6 py-3 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    expanded={expandedOrderId === order.id}
                    onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    onDetail={() => setDetailOrder(order)}
                    onSend={() => markSent(order.id)}
                    onReceive={() => markReceived(order.id)}
                    onDelete={() => deleteOrder(order.id)}
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
  expanded,
  onToggle,
  onDetail,
  onSend,
  onReceive,
  onDelete,
  onPdf,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onDetail: () => void;
  onSend: () => void;
  onReceive: () => void;
  onDelete: () => void;
  onPdf: () => void;
}) {
  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer">
        <td className="px-6 py-3" onClick={onToggle}>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </td>
        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white" onClick={onDetail}>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-gray-400" />
            {order.supplierName}
          </div>
        </td>
        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{order.lines.length}</td>
        <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{fmtEuro(order.totalHT)}</td>
        <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{fmtDate(order.date)}</td>
        <td className="px-6 py-3">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[order.status].bg}`}>
            {STATUS_BADGE[order.status].label}
          </span>
        </td>
        <td className="px-6 py-3">
          <div className="flex items-center gap-1">
            {order.status === 'brouillon' && (
              <button onClick={onSend} title="Envoyer" className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
                <Send className="w-4 h-4" />
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
            <button onClick={onDelete} title="Supprimer" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded details */}
      {expanded && (
        <tr>
          <td colSpan={7} className="px-6 py-3 bg-gray-50 dark:bg-gray-700/20">
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