import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart, Truck, Package, Send, FileText, Check, Trash2,
  Plus, Loader2, Euro, ChevronDown, ChevronUp,
  Clock, X, Mail, Copy, CopyPlus, Filter, Edit3,
  AlertTriangle, Zap, History,
} from 'lucide-react';
import { fetchIngredients, fetchSuppliers, fetchInventoryAlerts } from '../services/api';
import type { Ingredient, Supplier, InventoryItem } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { useRestaurant } from '../hooks/useRestaurant';

// ── helpers ──────────────────────────────────────────────────────────────────

type OrderStatus = 'brouillon' | 'envoyé' | 'reçu';

interface OrderLine {
  id: number;
  ingredientId: number | null;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
}

interface Order {
  id: number;
  dbId?: number;
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

// ── API helpers ───────────────────────────────────────────────────────────────

function autoOrdersAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

const STATUS_TO_API: Record<OrderStatus, string> = {
  brouillon: 'draft',
  'envoyé': 'sent',
  'reçu': 'received',
};

const STATUS_FROM_API: Record<string, OrderStatus> = {
  draft: 'brouillon',
  sent: 'envoyé',
  received: 'reçu',
};

interface ApiOrderItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface ApiOrder {
  id: number;
  supplierName: string;
  status: string;
  totalHT: number;
  notes: string;
  items: ApiOrderItem[];
  createdAt: string;
}

function apiOrderToLocal(apiOrder: ApiOrder): Order {
  const lines: OrderLine[] = apiOrder.items.map((item) => ({
    id: item.id,
    ingredientId: null,
    name: item.productName,
    quantity: item.quantity,
    unit: item.unit,
    pricePerUnit: item.unitPrice,
    total: item.total,
  }));
  const totals = calcTotals(lines);
  return {
    id: apiOrder.id,
    dbId: apiOrder.id,
    supplierId: null,
    supplierName: apiOrder.supplierName,
    lines,
    ...totals,
    status: STATUS_FROM_API[apiOrder.status] ?? 'brouillon',
    date: apiOrder.createdAt,
    notes: apiOrder.notes ?? '',
  };
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

let nextOrderId = 100;
let nextLineId = 1000;

function calcTotals(lines: OrderLine[]) {
  const totalHT = lines.reduce((s, l) => s + l.total, 0);
  const tva = totalHT * 0.2;
  return { totalHT, tva, totalTTC: totalHT + tva };
}

// (mock data removed — starts empty, loaded from API)

// ── empty form line ─────────────────────────────────────────────────────────

function emptyLine(): OrderLine {
  return { id: nextLineId++, ingredientId: null, name: '', quantity: 1, unit: 'kg', pricePerUnit: 0, total: 0 };
}

// ── component ────────────────────────────────────────────────────────────────

export default function AutoOrders() {
  const { showToast } = useToast();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();

  // Data
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'tous' | OrderStatus>('tous');

  // Order form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [formSupplierName, setFormSupplierName] = useState('');
  const [formSupplierId, setFormSupplierId] = useState<number | null>(null);
  const [formLines, setFormLines] = useState<OrderLine[]>([emptyLine()]);
  const [formNotes, setFormNotes] = useState('');

  // Email modal state
  const [emailOrder, setEmailOrder] = useState<Order | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // Auto-reorder
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [showAutoReviewModal, setShowAutoReviewModal] = useState(false);
  const [autoGeneratedOrders, setAutoGeneratedOrders] = useState<Order[]>([]);
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);

  // Tabs: commandes vs historique
  const [activeTab, setActiveTab] = useState<'commandes' | 'historique'>('commandes');

  // ── fetch data ─────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (restaurantLoading || !selectedRestaurant) return;
    try {
      setLoading(true);
      const [ings, supps] = await Promise.all([fetchIngredients(), fetchSuppliers()]);
      setIngredients(ings);
      setSuppliers(supps);

      // Fetch orders from backend
      try {
        const ordersRes = await fetch('/api/marketplace/orders', {
          headers: autoOrdersAuthHeaders(),
        });
        if (ordersRes.ok) {
          const apiOrders: ApiOrder[] = await ordersRes.json();
          setOrders(apiOrders.map(apiOrderToLocal));
        }
      } catch {
        // Orders fetch is non-fatal; start with empty list
      }

      // Fetch inventory alerts for auto-reorder
      try {
        const alerts = await fetchInventoryAlerts();
        const low = alerts.filter((item) => item.currentStock < item.minStock);
        setLowStockItems(low);
      } catch {
        // Inventory alerts are optional, don't block the page
      }
    } catch {
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, selectedRestaurant, restaurantLoading]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── summary stats ──────────────────────────────────────────────────────────

  const totalCount = orders.length;
  const brouillonCount = orders.filter((o) => o.status === 'brouillon').length;
  const envoyeCount = orders.filter((o) => o.status === 'envoyé').length;
  const totalValue = orders.reduce((sum, o) => sum + o.totalHT, 0);

  // ── filtered orders ────────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'tous') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // ── form helpers ──────────────────────────────────────────────────────────

  function openNewOrderForm() {
    setEditingOrderId(null);
    setFormSupplierName('');
    setFormSupplierId(null);
    setFormLines([emptyLine()]);
    setFormNotes('');
    setFormOpen(true);
  }

  function openEditOrderForm(order: Order) {
    setEditingOrderId(order.id);
    setFormSupplierName(order.supplierName);
    setFormSupplierId(order.supplierId);
    setFormLines(order.lines.map((l) => ({ ...l })));
    setFormNotes(order.notes);
    setFormOpen(true);
  }

  function handleSupplierChange(supplierId: string) {
    if (supplierId === '__custom__') {
      setFormSupplierId(null);
      setFormSupplierName('');
      return;
    }
    const id = Number(supplierId);
    const sup = suppliers.find((s) => s.id === id);
    if (sup) {
      setFormSupplierId(sup.id);
      setFormSupplierName(sup.name);
    }
  }

  function updateLine(lineId: number, field: keyof OrderLine, value: string | number) {
    setFormLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        const updated = { ...l, [field]: value };
        if (field === 'quantity' || field === 'pricePerUnit') {
          updated.total = updated.quantity * updated.pricePerUnit;
        }
        return updated;
      }),
    );
  }

  function handleIngredientSelect(lineId: number, ingredientId: string) {
    if (!ingredientId) return;
    const ing = ingredients.find((i) => i.id === Number(ingredientId));
    if (!ing) return;
    setFormLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        const qty = l.quantity || 1;
        return { ...l, ingredientId: ing.id, name: ing.name, unit: ing.unit, pricePerUnit: ing.pricePerUnit, total: qty * ing.pricePerUnit };
      }),
    );
  }

  function addLine() {
    setFormLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(lineId: number) {
    setFormLines((prev) => prev.length > 1 ? prev.filter((l) => l.id !== lineId) : prev);
  }

  const formTotals = useMemo(() => calcTotals(formLines), [formLines]);

  async function saveOrder() {
    if (!formSupplierName.trim()) {
      showToast('Veuillez sélectionner ou saisir un fournisseur', 'error');
      return;
    }
    const validLines = formLines.filter((l) => l.name.trim() && l.quantity > 0);
    if (validLines.length === 0) {
      showToast('Ajoutez au moins un article valide', 'error');
      return;
    }

    const totals = calcTotals(validLines);
    const existing = editingOrderId ? orders.find((o) => o.id === editingOrderId) : null;

    const orderData: Order = {
      id: editingOrderId ?? nextOrderId++,
      dbId: existing?.dbId,
      supplierId: formSupplierId,
      supplierName: formSupplierName.trim(),
      lines: validLines,
      ...totals,
      status: existing ? existing.status : 'brouillon',
      date: existing ? existing.date : new Date().toISOString(),
      notes: formNotes,
    };

    if (editingOrderId && existing?.dbId) {
      // Existing DB order: only update notes via PUT (status+notes only endpoint)
      try {
        await fetch(`/api/marketplace/orders/${existing.dbId}`, {
          method: 'PUT',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({ notes: formNotes }),
        });
      } catch {
        // Non-fatal: local state still updated
      }
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? orderData : o)));
      showToast('Commande modifiée avec succès', 'success');
    } else if (editingOrderId) {
      // Local-only draft (no dbId yet) — just update locally
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? orderData : o)));
      showToast('Commande modifiée avec succès', 'success');
    } else {
      // New order: POST to backend
      try {
        const res = await fetch('/api/marketplace/orders', {
          method: 'POST',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({
            supplierName: orderData.supplierName,
            notes: orderData.notes,
            items: validLines.map((l) => ({
              productName: l.name,
              quantity: l.quantity,
              unit: l.unit,
              unitPrice: l.pricePerUnit,
            })),
          }),
        });
        if (res.ok) {
          const created: ApiOrder = await res.json();
          const fromApi = apiOrderToLocal(created);
          setOrders((prev) => [fromApi, ...prev]);
        } else {
          // Fallback: add locally with temp id
          setOrders((prev) => [orderData, ...prev]);
        }
      } catch {
        setOrders((prev) => [orderData, ...prev]);
      }
      showToast('Commande créée en brouillon', 'success');
    }

    setFormOpen(false);
  }

  // ── order actions ──────────────────────────────────────────────────────────

  function markSent(id: number) {
    const order = orders.find((o) => o.id === id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'envoyé' as OrderStatus } : o)),
    );
    if (order?.dbId) {
      fetch(`/api/marketplace/orders/${order.dbId}`, {
        method: 'PUT',
        headers: autoOrdersAuthHeaders(),
        body: JSON.stringify({ status: STATUS_TO_API['envoyé'] }),
      }).catch(() => {/* non-fatal */});
    }
    showToast('Commande marquée comme envoyée', 'success');
  }

  function markReceived(id: number) {
    const order = orders.find((o) => o.id === id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'reçu' as OrderStatus } : o)),
    );
    if (order?.dbId) {
      fetch(`/api/marketplace/orders/${order.dbId}`, {
        method: 'PUT',
        headers: autoOrdersAuthHeaders(),
        body: JSON.stringify({ status: STATUS_TO_API['reçu'] }),
      }).catch(() => {/* non-fatal */});
    }
    showToast('Commande marquée comme reçue', 'success');
  }

  function confirmDeleteOrder() {
    if (deleteTarget === null) return;
    const order = orders.find((o) => o.id === deleteTarget);
    setOrders((prev) => prev.filter((o) => o.id !== deleteTarget));
    setDeleteTarget(null);
    if (order?.dbId) {
      fetch(`/api/marketplace/orders/${order.dbId}`, {
        method: 'DELETE',
        headers: autoOrdersAuthHeaders(),
      }).catch(() => {/* non-fatal */});
    }
    showToast('Commande supprimée', 'success');
  }

  function duplicateOrder(order: Order) {
    const dup: Order = {
      ...order,
      id: nextOrderId++,
      dbId: undefined,
      status: 'brouillon',
      date: new Date().toISOString(),
      notes: `Copie de la commande ${order.supplierName}`,
      lines: order.lines.map((l) => ({ ...l, id: nextLineId++ })),
    };
    setOrders((prev) => [dup, ...prev]);
    showToast(`Commande dupliquée pour ${order.supplierName}`, 'success');
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


  function handleCopyToClipboard() {
    if (!emailOrder) return;
    const text = `Objet : ${buildEmailSubject(emailOrder)}\n\n${buildEmailBody(emailOrder)}`;
    navigator.clipboard.writeText(text).then(() => {
      setEmailCopied(true);
      showToast('Commande copiée dans le presse-papier', 'success');
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }

  // ── auto-reorder ───────────────────────────────────────────────────────────

  function generateAutoOrders() {
    // Group low-stock items by supplier
    const bySupplier = new Map<string, { supplierId: number | null; supplierName: string; items: InventoryItem[] }>();

    lowStockItems.forEach((item) => {
      const supplierName = item.ingredient.supplier || 'Fournisseur inconnu';
      const supplierId = item.ingredient.supplierId;
      const key = supplierName;
      if (!bySupplier.has(key)) {
        bySupplier.set(key, { supplierId, supplierName, items: [] });
      }
      bySupplier.get(key)!.items.push(item);
    });

    // Create draft orders for each supplier
    const generatedOrders: Order[] = [];
    bySupplier.forEach(({ supplierId, supplierName, items }) => {
      const lines: OrderLine[] = items.map((item) => {
        const suggestedQty = Math.max(1, item.minStock * 2 - item.currentStock);
        const total = suggestedQty * item.ingredient.pricePerUnit;
        return {
          id: nextLineId++,
          ingredientId: item.ingredientId,
          name: item.ingredient.name,
          quantity: suggestedQty,
          unit: item.unit,
          pricePerUnit: item.ingredient.pricePerUnit,
          total,
        };
      });

      const totals = calcTotals(lines);
      generatedOrders.push({
        id: nextOrderId++,
        supplierId,
        supplierName,
        lines,
        ...totals,
        status: 'brouillon',
        date: new Date().toISOString(),
        notes: 'Commande auto-générée (réapprovisionnement)',
      });
    });

    setAutoGeneratedOrders(generatedOrders);
    setShowAutoReviewModal(true);
  }

  async function confirmAutoOrders() {
    // Optimistically add all generated orders to local state
    setOrders((prev) => [...autoGeneratedOrders, ...prev]);
    setShowAutoReviewModal(false);
    setAutoGeneratedOrders([]);
    setLowStockItems([]);
    showToast(`${autoGeneratedOrders.length} commande(s) auto-générée(s) en brouillon`, 'success');

    // POST each to backend, replacing local temp entries with DB-returned ones on success
    for (const order of autoGeneratedOrders) {
      try {
        const res = await fetch('/api/marketplace/orders', {
          method: 'POST',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({
            supplierName: order.supplierName,
            notes: order.notes,
            items: order.lines.map((l) => ({
              productName: l.name,
              quantity: l.quantity,
              unit: l.unit,
              unitPrice: l.pricePerUnit,
            })),
          }),
        });
        if (res.ok) {
          const created: ApiOrder = await res.json();
          const fromApi = apiOrderToLocal(created);
          // Replace the local temp order (matched by supplierName+date proximity) with the DB one
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? fromApi : o)),
          );
        }
      } catch {
        // Non-fatal: order already in local state
      }
    }
  }

  // ── send order email to supplier via /api/orders/send-email ──────────────

  async function handleSendOrderEmail(order: Order) {
    setSendingEmail(order.id);
    try {
      const supplier = suppliers.find((s) => s.id === order.supplierId);
      const supplierEmail = supplier?.email || emailTo;
      if (!supplierEmail) {
        showToast('Email fournisseur manquant — ajoutez-le dans la fiche fournisseur', 'error');
        setSendingEmail(null);
        return;
      }

      const res = await fetch('/api/orders/send-email', {
        method: 'POST',
        headers: autoOrdersAuthHeaders(),
        body: JSON.stringify({
          supplierName: order.supplierName,
          supplierEmail,
          orderLines: order.lines.map((l) => ({ name: l.name, quantity: l.quantity, unit: l.unit, total: l.total })),
          totalHT: order.totalHT,
          notes: order.notes,
        }),
      });
      if (!res.ok) throw new Error('Erreur envoi');
      markSent(order.id);
      showToast(`Commande envoyée à ${supplierEmail}`, 'success');
    } catch {
      showToast('Erreur lors de l\'envoi de l\'email', 'error');
    } finally {
      setSendingEmail(null);
    }
  }

  // ── history helpers ────────────────────────────────────────────────────────

  const historyOrders = useMemo(() => {
    return [...orders]
      .filter((o) => o.status === 'envoyé' || o.status === 'reçu')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

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
            Carnet de commandes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez vos commandes fournisseurs
          </p>
        </div>
        <button
          onClick={openNewOrderForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle commande
        </button>
      </div>

      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          label="Commandes total"
          value={String(totalCount)}
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-orange-500" />}
          label="Brouillons"
          value={String(brouillonCount)}
          bg="bg-orange-50 dark:bg-orange-900/20"
        />
        <SummaryCard
          icon={<Send className="w-5 h-5 text-indigo-500" />}
          label="Envoyées"
          value={String(envoyeCount)}
          bg="bg-indigo-50 dark:bg-indigo-900/20"
        />
        <SummaryCard
          icon={<Euro className="w-5 h-5 text-green-500" />}
          label="Valeur totale"
          value={fmtEuro(totalValue)}
          bg="bg-green-50 dark:bg-green-900/20"
        />
      </div>

      {/* ── Low-stock alert banner ────────────────────────────────────────── */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                {lowStockItems.length} article{lowStockItems.length > 1 ? 's' : ''} nécessite{lowStockItems.length > 1 ? 'nt' : ''} un réapprovisionnement
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                {lowStockItems.map((i) => i.ingredient.name).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={generateAutoOrders}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium text-sm shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Générer les commandes automatiquement
          </button>
        </div>
      )}

      {/* ── Tab switcher ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('commandes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'commandes'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Package className="w-4 h-4" />
          Commandes
          <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">{orders.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('historique')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'historique'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <History className="w-4 h-4" />
          Historique
          <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">{historyOrders.length}</span>
        </button>
      </div>

      {/* ── Orders list ─────────────────────────────────────────────────────── */}
      {activeTab === 'commandes' && (
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
          <Package className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Commandes
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
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s === 'tous' ? 'Tous' : (STATUS_BADGE[s] || STATUS_BADGE['brouillon']).label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            {orders.length === 0
              ? 'Aucune commande pour le moment. Cliquez sur "Nouvelle commande" pour commencer.'
              : 'Aucune commande pour ce filtre'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                expanded={expandedOrderId === order.id}
                onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                onEdit={() => openEditOrderForm(order)}
                onSend={() => openEmailModal(order)}
                onReceive={() => markReceived(order.id)}
                onDelete={() => setDeleteTarget(order.id)}
                onDuplicate={() => duplicateOrder(order)}
                onDirectSend={() => handleSendOrderEmail(order)}
                isSending={sendingEmail === order.id}
              />
            ))}
          </div>
        )}
      </section>
      )}

      {/* ── History tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'historique' && (
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <History className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Historique des commandes
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {historyOrders.length} commande(s) envoyée(s) ou reçue(s)
            </span>
          </div>

          {historyOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <History className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              Aucune commande envoyée ou reçue pour le moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Fournisseur</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Articles</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Total HT</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Total TTC</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {historyOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{fmtDate(order.date)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="font-medium text-gray-900 dark:text-white">{order.supplierName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                        {order.lines.length}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                        {fmtEuro(order.totalHT)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">
                        {fmtEuro(order.totalTTC)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${(STATUS_BADGE[order.status] || STATUS_BADGE['brouillon']).bg}`}>
                          {(STATUS_BADGE[order.status] || STATUS_BADGE['brouillon']).label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                        {order.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Order form modal (create / edit) ─────────────────────────────────── */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingOrderId ? 'Modifier la commande' : 'Nouvelle commande'}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fournisseur
            </label>
            {suppliers.length > 0 ? (
              <select
                value={formSupplierId ?? '__custom__'}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="__custom__">— Saisie libre —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : null}
            <input
              type="text"
              value={formSupplierName}
              onChange={(e) => { setFormSupplierName(e.target.value); setFormSupplierId(null); }}
              placeholder="Nom du fournisseur"
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Line items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Articles
            </label>
            <div className="space-y-2">
              {formLines.map((line, idx) => (
                <div key={line.id} className="flex flex-wrap items-end gap-2 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex-1 min-w-[160px]">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Ingrédient</label>
                    {ingredients.length > 0 ? (
                      <select
                        value={line.ingredientId ?? ''}
                        onChange={(e) => handleIngredientSelect(line.id, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">— Sélectionner —</option>
                        {ingredients.map((i) => (
                          <option key={i.id} value={i.id}>{i.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={line.name}
                        onChange={(e) => updateLine(line.id, 'name', e.target.value)}
                        placeholder="Nom"
                        className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    {/* free-text fallback even if ingredients exist */}
                    {ingredients.length > 0 && (
                      <input
                        type="text"
                        value={line.name}
                        onChange={(e) => updateLine(line.id, 'name', e.target.value)}
                        placeholder="ou saisir manuellement"
                        className="mt-1 w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Qté</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.id, 'quantity', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Unité</label>
                    <input
                      type="text"
                      value={line.unit}
                      onChange={(e) => updateLine(line.id, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Prix unit.</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.pricePerUnit}
                      onChange={(e) => updateLine(line.id, 'pricePerUnit', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24 text-right">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Total</label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white py-1.5">
                      {fmtEuro(line.total)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeLine(line.id)}
                    title="Supprimer la ligne"
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addLine}
              className="mt-2 flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Ajouter un article
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Notes pour cette commande..."
            />
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Total HT</span>
              <span className="font-medium">{fmtEuro(formTotals.totalHT)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>TVA (20%)</span>
              <span className="font-medium">{fmtEuro(formTotals.tva)}</span>
            </div>
            <div className="flex justify-between text-gray-900 dark:text-white font-semibold text-base pt-1 border-t border-gray-200 dark:border-gray-700">
              <span>Total TTC</span>
              <span>{fmtEuro(formTotals.totalTTC)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Annuler
            </button>
            <button
              onClick={saveOrder}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <Check className="w-4 h-4" />
              {editingOrderId ? 'Enregistrer' : 'Créer en brouillon'}
            </button>
          </div>
        </div>
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
                onClick={() => emailOrder && handleSendOrderEmail(emailOrder)}
                disabled={!!sendingEmail}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-sm disabled:opacity-50"
              >
                {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {sendingEmail ? 'Envoi...' : 'Envoyer par email'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Auto-reorder review modal ──────────────────────────────────────── */}
      <Modal
        isOpen={showAutoReviewModal}
        onClose={() => { setShowAutoReviewModal(false); setAutoGeneratedOrders([]); }}
        title="Commandes auto-générées — Vérification"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {autoGeneratedOrders.length} commande(s) générée(s) à partir des articles en rupture de stock.
            Vérifiez les quantités avant de confirmer.
          </p>
          {autoGeneratedOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700/40 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">{order.supplierName}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{fmtEuro(order.totalHT)} HT</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-2 px-4">Article</th>
                    <th className="text-center py-2 px-3">Qté suggérée</th>
                    <th className="text-center py-2 px-3">Unité</th>
                    <th className="text-right py-2 px-4">Prix unit.</th>
                    <th className="text-right py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {order.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{line.name}</td>
                      <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400">{line.quantity}</td>
                      <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400">{line.unit}</td>
                      <td className="py-2 px-4 text-right text-gray-600 dark:text-gray-400">{fmtEuro(line.pricePerUnit)}</td>
                      <td className="py-2 px-4 text-right font-medium text-gray-800 dark:text-gray-200">{fmtEuro(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => { setShowAutoReviewModal(false); setAutoGeneratedOrders([]); }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Annuler
            </button>
            <button
              onClick={confirmAutoOrders}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <Check className="w-4 h-4" />
              Confirmer ({autoGeneratedOrders.length} commande{autoGeneratedOrders.length > 1 ? 's' : ''})
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete confirm ────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer la commande"
        message="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteTarget(null)}
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
  expanded,
  onToggle,
  onEdit,
  onSend,
  onReceive,
  onDelete,
  onDuplicate,
  onDirectSend,
  isSending,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onSend: () => void;
  onReceive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDirectSend?: () => void;
  isSending?: boolean;
}) {
  return (
    <div className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
      {/* Main row */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 cursor-pointer" onClick={onToggle}>
        <div className="text-gray-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
        <div className="flex items-center gap-2 min-w-[140px]">
          <Truck className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="font-medium text-gray-900 dark:text-white">{order.supplierName}</span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {order.lines.length} article{order.lines.length > 1 ? 's' : ''}
        </span>
        <span className="font-medium text-gray-900 dark:text-white">{fmtEuro(order.totalHT)}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{fmtDate(order.date)}</span>
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${(STATUS_BADGE[order.status] || STATUS_BADGE['brouillon']).bg}`}>
          {(STATUS_BADGE[order.status] || STATUS_BADGE['brouillon']).label}
        </span>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEdit} title="Modifier" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
            <Edit3 className="w-3.5 h-3.5" /> Modifier
          </button>
          <button onClick={onSend} title="Envoyer par email" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition">
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          {order.status === 'brouillon' && onDirectSend && (
            <button
              onClick={onDirectSend}
              disabled={isSending}
              title="Envoyer directement au fournisseur"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Envoyer
            </button>
          )}
          {order.status === 'envoyé' && (
            <button onClick={onReceive} title="Marquer reçu" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition">
              <Check className="w-3.5 h-3.5" /> Reçu
            </button>
          )}
          <button onClick={onDuplicate} title="Dupliquer" className="p-1.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition">
            <CopyPlus className="w-4 h-4" />
          </button>
          <button onClick={onDelete} title="Supprimer" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-4">
          <div className="bg-gray-50 dark:bg-gray-700/20 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 text-xs">
                  <th className="pb-2 pr-4">Produit</th>
                  <th className="pb-2 pr-4">Quantité</th>
                  <th className="pb-2 pr-4">Unité</th>
                  <th className="pb-2 pr-4">Prix unitaire</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                {order.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="py-1.5 pr-4 text-gray-800 dark:text-gray-200">{line.name}</td>
                    <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">{line.quantity}</td>
                    <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">{line.unit}</td>
                    <td className="py-1.5 pr-4 text-gray-600 dark:text-gray-400">{fmtEuro(line.pricePerUnit)}</td>
                    <td className="py-1.5 text-right font-medium text-gray-800 dark:text-gray-200">{fmtEuro(line.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Total HT</span>
                <span className="font-medium">{fmtEuro(order.totalHT)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>TVA (20%)</span>
                <span className="font-medium">{fmtEuro(order.tva)}</span>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white font-semibold">
                <span>Total TTC</span>
                <span>{fmtEuro(order.totalTTC)}</span>
              </div>
            </div>
            {order.notes && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic">
                Notes : {order.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
