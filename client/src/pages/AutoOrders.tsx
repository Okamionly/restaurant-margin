import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart, Truck, Package, Send, FileText, Check, Trash2,
  Plus, Loader2, Euro, ChevronDown, ChevronUp,
  Clock, X, Mail, Copy, CopyPlus, Filter, Edit3,
  AlertTriangle, Zap, History, RefreshCw, CheckCircle2, CircleDot,
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

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, {
  badge: string;
  dot: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  step: number;
}> = {
  brouillon: {
    badge: 'bg-slate-700 text-slate-300 border border-slate-600',
    dot: 'bg-slate-500',
    label: 'Brouillon',
    icon: Clock,
    step: 0,
  },
  'envoyé': {
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    dot: 'bg-blue-500',
    label: 'Envoyé',
    icon: Send,
    step: 1,
  },
  'reçu': {
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    dot: 'bg-emerald-500',
    label: 'Livré',
    icon: CheckCircle2,
    step: 2,
  },
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

function emptyLine(): OrderLine {
  return { id: nextLineId++, ingredientId: null, name: '', quantity: 1, unit: 'kg', pricePerUnit: 0, total: 0 };
}

// ── Timeline component ────────────────────────────────────────────────────────

function OrderTimeline({ status, date }: { status: OrderStatus; date: string }) {
  const steps: { key: OrderStatus; label: string; sublabel: string }[] = [
    { key: 'brouillon', label: 'Brouillon', sublabel: 'Commande créée' },
    { key: 'envoyé', label: 'Envoyé', sublabel: 'Envoyé au fournisseur' },
    { key: 'reçu', label: 'Livré', sublabel: 'Marchandise reçue' },
  ];
  const currentStep = STATUS_CONFIG[status].step;

  return (
    <div className="mt-4 px-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Suivi de livraison</p>
      <div className="flex items-start gap-0">
        {steps.map((step, idx) => {
          const cfg = STATUS_CONFIG[step.key];
          const done = idx <= currentStep;
          const active = idx === currentStep;
          const isLast = idx === steps.length - 1;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {!isLast && (
                <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${done && idx < currentStep ? 'bg-blue-500' : 'bg-slate-700'}`} />
              )}
              {/* Circle */}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                done
                  ? active
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-emerald-500 bg-emerald-500/20'
                  : 'border-slate-700 bg-slate-800'
              }`}>
                {done && !active ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : active ? (
                  <CircleDot className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                )}
              </div>
              {/* Labels */}
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold ${active ? 'text-blue-400' : done ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">{step.sublabel}</p>
                {active && (
                  <p className="text-[10px] text-slate-500 mt-0.5">{fmtDate(date)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
  const [relancingId, setRelancingId] = useState<number | null>(null);

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

      try {
        const alerts = await fetchInventoryAlerts();
        const low = alerts.filter((item) => item.currentStock < item.minStock);
        setLowStockItems(low);
      } catch {
        // Inventory alerts are optional
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
      try {
        await fetch(`/api/marketplace/orders/${existing.dbId}`, {
          method: 'PUT',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({ notes: formNotes }),
        });
      } catch {
        // Non-fatal
      }
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? orderData : o)));
      showToast('Commande modifiée avec succès', 'success');
    } else if (editingOrderId) {
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? orderData : o)));
      showToast('Commande modifiée avec succès', 'success');
    } else {
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

  // ── Relancer fournisseur ───────────────────────────────────────────────────

  async function handleRelanceFournisseur(order: Order) {
    setRelancingId(order.id);
    try {
      const supplier = suppliers.find((s) => s.id === order.supplierId);
      const supplierEmail = supplier?.email || '';
      if (!supplierEmail) {
        showToast('Email fournisseur manquant — ajoutez-le dans la fiche fournisseur', 'error');
        setRelancingId(null);
        return;
      }

      const subject = `RELANCE — Commande RestauMargin - ${order.supplierName} - ${fmtDate(order.date)}`;
      const body = [
        `Bonjour,`,
        ``,
        `Nous revenons vers vous concernant la commande envoyée le ${fmtDate(order.date)}.`,
        ``,
        `À ce jour, nous n'avons pas encore reçu la marchandise ou de confirmation de livraison.`,
        `Pourriez-vous nous tenir informés de l'état d'avancement de cette commande ?`,
        ``,
        `--- Rappel de la commande ---`,
        ``,
        ...order.lines.map((l) => `- ${l.name} : ${l.quantity} ${l.unit}`),
        ``,
        `Total HT : ${fmtEuro(order.totalHT)}`,
        ``,
        `Merci de votre retour rapide.`,
        ``,
        `Cordialement,`,
        `RestauMargin`,
      ].join('\n');

      const res = await fetch('/api/orders/send-email', {
        method: 'POST',
        headers: autoOrdersAuthHeaders(),
        body: JSON.stringify({
          supplierName: order.supplierName,
          supplierEmail,
          subject,
          orderLines: order.lines.map((l) => ({ name: l.name, quantity: l.quantity, unit: l.unit, total: l.total })),
          totalHT: order.totalHT,
          notes: `RELANCE — ${order.notes}`,
        }),
      });

      if (!res.ok) throw new Error('Erreur envoi relance');
      showToast(`Relance envoyée à ${supplierEmail}`, 'success');
    } catch {
      showToast('Erreur lors de l\'envoi de la relance', 'error');
    } finally {
      setRelancingId(null);
    }
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
    const bySupplier = new Map<string, { supplierId: number | null; supplierName: string; items: InventoryItem[] }>();

    lowStockItems.forEach((item) => {
      const supplierName = item.ingredient?.supplier || 'Fournisseur inconnu';
      const supplierId = item.ingredient?.supplierId;
      const key = supplierName;
      if (!bySupplier.has(key)) {
        bySupplier.set(key, { supplierId, supplierName, items: [] });
      }
      bySupplier.get(key)!.items.push(item);
    });

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
    setOrders((prev) => [...autoGeneratedOrders, ...prev]);
    setShowAutoReviewModal(false);
    setAutoGeneratedOrders([]);
    setLowStockItems([]);
    showToast(`${autoGeneratedOrders.length} commande(s) auto-générée(s) en brouillon`, 'success');

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
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? fromApi : o)),
          );
        }
      } catch {
        // Non-fatal
      }
    }
  }

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

  const historyOrders = useMemo(() => {
    return [...orders]
      .filter((o) => o.status === 'envoyé' || o.status === 'reçu')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-slate-400">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-blue-400" />
            Carnet de commandes
          </h1>
          <p className="text-slate-400 mt-1">Gérez vos commandes fournisseurs</p>
        </div>
        <button
          onClick={openNewOrderForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle commande
        </button>
      </div>

      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FileText className="w-5 h-5 text-blue-400" />}
          label="Total commandes"
          value={String(totalCount)}
          accent="border-blue-500/30 bg-blue-500/5"
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-slate-400" />}
          label="Brouillons"
          value={String(brouillonCount)}
          accent="border-slate-600/50 bg-slate-800/50"
        />
        <SummaryCard
          icon={<Send className="w-5 h-5 text-blue-400" />}
          label="Envoyées"
          value={String(envoyeCount)}
          accent="border-blue-500/30 bg-blue-500/5"
        />
        <SummaryCard
          icon={<Euro className="w-5 h-5 text-emerald-400" />}
          label="Valeur totale HT"
          value={fmtEuro(totalValue)}
          accent="border-emerald-500/30 bg-emerald-500/5"
        />
      </div>

      {/* ── Low-stock alert banner ─────────────────────────────────────────── */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                {lowStockItems.length} article{lowStockItems.length > 1 ? 's' : ''} nécessite{lowStockItems.length > 1 ? 'nt' : ''} un réapprovisionnement
              </p>
              <p className="text-xs text-amber-500 mt-0.5">
                {lowStockItems.map((i) => i.ingredient.name).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={generateAutoOrders}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-medium text-sm transition shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Générer les commandes automatiquement
          </button>
        </div>
      )}

      {/* ── Tab switcher ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('commandes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'commandes'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Commandes
          <span className="px-1.5 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">{orders.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('historique')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'historique'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          Historique
          <span className="px-1.5 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">{historyOrders.length}</span>
        </button>
      </div>

      {/* ── Orders list ─────────────────────────────────────────────────────── */}
      {activeTab === 'commandes' && (
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center gap-3">
            <Package className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Commandes</h2>
            <span className="text-sm text-slate-500">{filteredOrders.length} commande(s)</span>

            {/* Status filter */}
            <div className="ml-auto flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              {(['tous', 'brouillon', 'envoyé', 'reçu'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {s === 'tous' ? 'Tous' : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-700" />
              {orders.length === 0
                ? 'Aucune commande pour le moment. Cliquez sur "Nouvelle commande" pour commencer.'
                : 'Aucune commande pour ce filtre'}
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
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
                  onRelance={() => handleRelanceFournisseur(order)}
                  isSending={sendingEmail === order.id}
                  isRelancing={relancingId === order.id}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── History tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'historique' && (
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <History className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Historique des commandes</h2>
            <span className="text-sm text-slate-500">{historyOrders.length} commande(s) envoyée(s) ou reçue(s)</span>
          </div>

          {historyOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <History className="w-10 h-10 mx-auto mb-2 text-slate-700" />
              Aucune commande envoyée ou reçue pour le moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/60">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fournisseur</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Articles</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total HT</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total TTC</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {historyOrders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['brouillon'];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={order.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 text-slate-400">{fmtDate(order.date)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="font-medium text-white">{order.supplierName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-400">{order.lines.length}</td>
                        <td className="py-3 px-4 text-right font-medium text-white">{fmtEuro(order.totalHT)}</td>
                        <td className="py-3 px-4 text-right text-slate-300">{fmtEuro(order.totalTTC)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-500 max-w-[200px] truncate">{order.notes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Order form modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingOrderId ? 'Modifier la commande' : 'Nouvelle commande'}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fournisseur</label>
            {suppliers.length > 0 ? (
              <select
                value={formSupplierId ?? '__custom__'}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-2 w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Line items */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Articles</label>
            <div className="space-y-2">
              {formLines.map((line) => (
                <div key={line.id} className="flex flex-wrap items-end gap-2 p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                  <div className="flex-1 min-w-[160px]">
                    <label className="text-xs text-slate-500">Ingrédient</label>
                    {ingredients.length > 0 ? (
                      <select
                        value={line.ingredientId ?? ''}
                        onChange={(e) => handleIngredientSelect(line.id, e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-sm bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-sm bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                    {ingredients.length > 0 && (
                      <input
                        type="text"
                        value={line.name}
                        onChange={(e) => updateLine(line.id, 'name', e.target.value)}
                        placeholder="ou saisir manuellement"
                        className="mt-1 w-full px-2 py-1 border border-slate-700/50 rounded-md text-xs bg-slate-800/60 text-slate-300 focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-slate-500">Qté</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.id, 'quantity', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-sm bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-slate-500">Unité</label>
                    <input
                      type="text"
                      value={line.unit}
                      onChange={(e) => updateLine(line.id, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-sm bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-slate-500">Prix unit.</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.pricePerUnit}
                      onChange={(e) => updateLine(line.id, 'pricePerUnit', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 border border-slate-700 rounded-md text-sm bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-24 text-right">
                    <label className="text-xs text-slate-500">Total</label>
                    <p className="text-sm font-medium text-white py-1.5">{fmtEuro(line.total)}</p>
                  </div>
                  <button
                    onClick={() => removeLine(line.id)}
                    title="Supprimer la ligne"
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addLine}
              className="mt-2 flex items-center gap-1 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Ajouter un article
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Notes pour cette commande..."
            />
          </div>

          {/* Totals */}
          <div className="border-t border-slate-700 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Total HT</span>
              <span className="font-medium">{fmtEuro(formTotals.totalHT)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>TVA (20%)</span>
              <span className="font-medium">{fmtEuro(formTotals.tva)}</span>
            </div>
            <div className="flex justify-between text-white font-semibold text-base pt-1 border-t border-slate-700">
              <span>Total TTC</span>
              <span>{fmtEuro(formTotals.totalTTC)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
            >
              Annuler
            </button>
            <button
              onClick={saveOrder}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm"
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Destinataire</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="email@fournisseur.com"
                  className="flex-1 px-3 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Objet</label>
              <p className="text-sm text-slate-200 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                {buildEmailSubject(emailOrder)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Corps du message</label>
              <pre className="text-xs text-slate-300 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-3 max-h-64 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                {buildEmailBody(emailOrder)}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                onClick={() => setEmailOrder(null)}
                className="px-4 py-2 text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-600 text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition text-sm"
              >
                {emailCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {emailCopied ? 'Copié !' : 'Copier dans le presse-papier'}
              </button>
              <button
                onClick={() => emailOrder && handleSendOrderEmail(emailOrder)}
                disabled={!!sendingEmail}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition shadow-sm disabled:opacity-50"
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
          <p className="text-sm text-slate-400">
            {autoGeneratedOrders.length} commande(s) générée(s) à partir des articles en rupture de stock.
            Vérifiez les quantités avant de confirmer.
          </p>
          {autoGeneratedOrders.map((order) => (
            <div key={order.id} className="border border-slate-700 rounded-xl overflow-hidden">
              <div className="bg-slate-800/60 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">{order.supplierName}</span>
                </div>
                <span className="text-sm font-medium text-slate-300">{fmtEuro(order.totalHT)} HT</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-800">
                    <th className="text-left py-2 px-4">Article</th>
                    <th className="text-center py-2 px-3">Qté</th>
                    <th className="text-center py-2 px-3">Unité</th>
                    <th className="text-right py-2 px-4">Prix unit.</th>
                    <th className="text-right py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {order.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-2 px-4 text-slate-200">{line.name}</td>
                      <td className="py-2 px-3 text-center text-slate-400">{line.quantity}</td>
                      <td className="py-2 px-3 text-center text-slate-400">{line.unit}</td>
                      <td className="py-2 px-4 text-right text-slate-400">{fmtEuro(line.pricePerUnit)}</td>
                      <td className="py-2 px-4 text-right font-medium text-white">{fmtEuro(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => { setShowAutoReviewModal(false); setAutoGeneratedOrders([]); }}
              className="px-4 py-2 text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
            >
              Annuler
            </button>
            <button
              onClick={confirmAutoOrders}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm"
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

function SummaryCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-2xl p-4 border bg-slate-900/50 ${accent}`}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold text-white mt-0.5">{value}</p>
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
  onRelance,
  isSending,
  isRelancing,
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
  onRelance?: () => void;
  isSending?: boolean;
  isRelancing?: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['brouillon'];
  const StatusIcon = cfg.icon;

  return (
    <div className="hover:bg-slate-800/30 transition">
      {/* Main row */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 cursor-pointer" onClick={onToggle}>
        <div className="text-slate-500">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>

        {/* Status dot */}
        <div className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />

        <div className="flex items-center gap-2 min-w-[140px]">
          <Truck className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="font-medium text-white">{order.supplierName}</span>
        </div>

        <span className="text-sm text-slate-500">
          {order.lines.length} article{order.lines.length > 1 ? 's' : ''}
        </span>

        <span className="font-semibold text-white">{fmtEuro(order.totalHT)}</span>
        <span className="text-sm text-slate-500">{fmtDate(order.date)}</span>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEdit} title="Modifier" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg transition">
            <Edit3 className="w-3.5 h-3.5" /> Modifier
          </button>
          <button onClick={onSend} title="Préparer email" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:bg-slate-700 rounded-lg transition">
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          {order.status === 'brouillon' && onDirectSend && (
            <button
              onClick={onDirectSend}
              disabled={isSending}
              title="Envoyer directement au fournisseur"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg transition disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Envoyer
            </button>
          )}
          {order.status === 'envoyé' && (
            <>
              <button onClick={onReceive} title="Marquer reçu" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition">
                <Check className="w-3.5 h-3.5" /> Reçu
              </button>
              {onRelance && (
                <button
                  onClick={onRelance}
                  disabled={isRelancing}
                  title="Relancer le fournisseur"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-lg transition disabled:opacity-50"
                >
                  {isRelancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Relancer
                </button>
              )}
            </>
          )}
          <button onClick={onDuplicate} title="Dupliquer" className="p-1.5 text-slate-400 hover:bg-slate-700 rounded-lg transition">
            <CopyPlus className="w-4 h-4" />
          </button>
          <button onClick={onDelete} title="Supprimer" className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            {/* Timeline */}
            <OrderTimeline status={order.status} date={order.date} />

            {/* Line items table */}
            <div className="mt-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs border-b border-slate-700">
                    <th className="pb-2 pr-4">Produit</th>
                    <th className="pb-2 pr-4">Quantité</th>
                    <th className="pb-2 pr-4">Unité</th>
                    <th className="pb-2 pr-4">Prix unitaire</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {order.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-2 pr-4 text-slate-200">{line.name}</td>
                      <td className="py-2 pr-4 text-slate-400">{line.quantity}</td>
                      <td className="py-2 pr-4 text-slate-400">{line.unit}</td>
                      <td className="py-2 pr-4 text-slate-400">{fmtEuro(line.pricePerUnit)}</td>
                      <td className="py-2 text-right font-medium text-white">{fmtEuro(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-3 pt-3 border-t border-slate-700 space-y-1 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Total HT</span>
                <span className="font-medium">{fmtEuro(order.totalHT)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TVA (20%)</span>
                <span className="font-medium">{fmtEuro(order.tva)}</span>
              </div>
              <div className="flex justify-between text-white font-semibold">
                <span>Total TTC</span>
                <span>{fmtEuro(order.totalTTC)}</span>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <p className="mt-3 text-sm text-slate-500 italic border-t border-slate-700 pt-3">
                Notes : {order.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
