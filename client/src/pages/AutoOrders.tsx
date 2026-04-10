import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ShoppingCart, Truck, Package, Send, FileText, Check, Trash2,
  Plus, Loader2, Euro, ChevronDown, ChevronUp,
  Clock, X, Mail, Copy, CopyPlus, Filter, Edit3,
  AlertTriangle, Zap, History, RefreshCw, CheckCircle2, CircleDot,
  MessageCircle, XCircle, AlertOctagon, BarChart3, Calendar,
  ClipboardCheck, ThumbsDown, TrendingUp, TrendingDown, Brain,
  Timer, Target, Wallet, ArrowRight, Sparkles, Phone,
  Bell, Eye, CheckCheck, SendHorizonal,
} from 'lucide-react';
import {
  standardOrderMessage,
  urgentOrderMessage,
  complaintMessage,
  reorderMessage,
  buildWhatsAppUrl,
  openWhatsApp,
  openBulkWhatsApp,
  getConfirmationStatusConfig,
  estimateViewStatus,
  needsReminder,
  type WhatsAppOrderTracking,
  type WhatsAppConfirmationStatus,
  type BulkWhatsAppOrder,
} from '../utils/whatsappTemplates';
import { fetchIngredients, fetchSuppliers, fetchInventoryAlerts } from '../services/api';
import type { Ingredient, Supplier, InventoryItem } from '../types';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';

// ── helpers ──────────────────────────────────────────────────────────────────

type OrderStatus = 'brouillon' | 'envoyé' | 'confirmé' | 'livré' | 'annulé' | 'réclamation';

interface OrderLine {
  id: number;
  ingredientId: number | null;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
  receivedQuantity?: number | null;
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
  expectedDelivery?: string | null;
  receivedAt?: string | null;
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
  'confirmé': 'confirmed',
  'livré': 'received',
  'annulé': 'cancelled',
  'réclamation': 'claimed',
};

const STATUS_FROM_API: Record<string, OrderStatus> = {
  draft: 'brouillon',
  sent: 'envoyé',
  confirmed: 'confirmé',
  received: 'livré',
  cancelled: 'annulé',
  claimed: 'réclamation',
};

interface ApiOrderItem {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  ingredientId?: number | null;
  receivedQuantity?: number | null;
}

interface ApiOrder {
  id: number;
  supplierName: string;
  supplierId?: number | null;
  status: string;
  totalHT: number;
  notes: string;
  items: ApiOrderItem[];
  createdAt: string;
  expectedDelivery?: string | null;
  receivedAt?: string | null;
}

function apiOrderToLocal(apiOrder: ApiOrder): Order {
  const lines: OrderLine[] = apiOrder.items.map((item) => ({
    id: item.id,
    ingredientId: item.ingredientId ?? null,
    name: item.productName,
    quantity: item.quantity,
    unit: item.unit,
    pricePerUnit: item.unitPrice,
    total: item.total,
    receivedQuantity: item.receivedQuantity ?? null,
  }));
  const totals = calcTotals(lines);
  return {
    id: apiOrder.id,
    dbId: apiOrder.id,
    supplierId: apiOrder.supplierId ?? null,
    supplierName: apiOrder.supplierName,
    lines,
    ...totals,
    status: STATUS_FROM_API[apiOrder.status] ?? 'brouillon',
    date: apiOrder.createdAt,
    expectedDelivery: apiOrder.expectedDelivery ?? null,
    receivedAt: apiOrder.receivedAt ?? null,
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
    badge: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#262626]',
    dot: 'bg-[#9CA3AF]',
    label: 'Brouillon',
    icon: Clock,
    step: 0,
  },
  'envoyé': {
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-500',
    label: 'Envoye',
    icon: Send,
    step: 1,
  },
  'confirmé': {
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-500',
    label: 'Confirme',
    icon: CheckCircle2,
    step: 2,
  },
  'livré': {
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-500',
    label: 'Livre',
    icon: Package,
    step: 3,
  },
  'annulé': {
    badge: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] border border-[#E5E7EB] dark:border-[#262626] line-through',
    dot: 'bg-[#6B7280]',
    label: 'Annule',
    icon: XCircle,
    step: -1,
  },
  'réclamation': {
    badge: 'bg-red-500/10 text-red-400 border border-red-500/30',
    dot: 'bg-red-500',
    label: 'Reclamation',
    icon: AlertOctagon,
    step: 4,
  },
};

function fmtEuro(n: number) {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
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

// ── KPI Dashboard Card ──────────────────────────────────────────────────────

function KPICard({ icon, label, value, trend, trendLabel, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl p-5 border bg-white dark:bg-black/50 ${accent} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-black/[0.02] dark:from-white/[0.02] to-transparent -translate-y-8 translate-x-8" />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight">{value}</p>
          {trendLabel && (
            <div className="flex items-center gap-1">
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ── Smart Reorder Suggestion ────────────────────────────────────────────────

type UrgencyLevel = 'urgent' | 'normal' | 'planifie';

interface ReorderSuggestion {
  ingredient: InventoryItem;
  urgency: UrgencyLevel;
  daysUntilStockout: number;
  suggestedQty: number;
  estimatedCost: number;
}

function computeReorderSuggestions(lowStockItems: InventoryItem[]): ReorderSuggestion[] {
  return lowStockItems.slice(0, 6).map((item) => {
    const stockRatio = item.currentStock / Math.max(item.minStock, 0.1);
    const suggestedQty = Math.max(1, Math.ceil(item.minStock * 2 - item.currentStock));
    const estimatedCost = suggestedQty * item.ingredient.pricePerUnit;

    // Estimate days until stockout based on consumption rate
    const dailyConsumption = item.minStock / 7; // rough estimate: minStock = 1 week supply
    const daysUntilStockout = dailyConsumption > 0 ? Math.max(0, Math.floor(item.currentStock / dailyConsumption)) : 99;

    let urgency: UrgencyLevel;
    if (stockRatio <= 0.2 || daysUntilStockout <= 1) {
      urgency = 'urgent';
    } else if (stockRatio <= 0.5 || daysUntilStockout <= 3) {
      urgency = 'normal';
    } else {
      urgency = 'planifie';
    }

    return { ingredient: item, urgency, daysUntilStockout, suggestedQty, estimatedCost };
  }).sort((a, b) => {
    const urgencyOrder = { urgent: 0, normal: 1, planifie: 2 };
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
  });
}

function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  const config = {
    urgent: { label: 'Urgent', bg: 'bg-red-500/10 text-red-500 border-red-500/30', dot: 'bg-red-500' },
    normal: { label: 'Normal', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/30', dot: 'bg-amber-500' },
    planifie: { label: 'Planifie', bg: 'bg-blue-500/10 text-blue-500 border-blue-500/30', dot: 'bg-blue-500' },
  };
  const c = config[urgency];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

function SmartReorderSection({ suggestions, onCreateOrder }: {
  suggestions: ReorderSuggestion[];
  onCreateOrder: (item: InventoryItem, qty: number) => void;
}) {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-[#111111] dark:from-white to-[#333] dark:to-[#D4D4D4]">
          <Brain className="w-4 h-4 text-white dark:text-black" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#111111] dark:text-white">Suggestions de reapprovisionnement</h2>
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Analyse IA : stock, consommation, delai de livraison</p>
        </div>
        <Sparkles className="w-4 h-4 text-amber-400 ml-1" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.slice(0, 3).map((s) => (
            <div
              key={s.ingredient.ingredientId}
              className="border border-[#E5E7EB] dark:border-[#262626] rounded-xl p-4 hover:shadow-md transition-all duration-200 group bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 hover:bg-white dark:hover:bg-[#0A0A0A]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs">
                    {s.ingredient.ingredient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#111111] dark:text-white">{s.ingredient.ingredient.name}</p>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">
                      {s.ingredient.ingredient.supplier || 'Fournisseur inconnu'}
                    </p>
                  </div>
                </div>
                <UrgencyBadge urgency={s.urgency} />
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] dark:text-[#A3A3A3]">Stock actuel</span>
                  <span className="font-medium text-[#111111] dark:text-white">
                    {s.ingredient.currentStock} / {s.ingredient.minStock} {s.ingredient.unit}
                  </span>
                </div>
                {/* Stock bar */}
                <div className="w-full h-1.5 bg-[#E5E7EB] dark:bg-[#262626] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.urgency === 'urgent' ? 'bg-red-500' : s.urgency === 'normal' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (s.ingredient.currentStock / Math.max(s.ingredient.minStock, 1)) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] dark:text-[#A3A3A3] flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    ~{s.daysUntilStockout}j avant rupture
                  </span>
                  <span className="font-medium text-[#111111] dark:text-white">{fmtEuro(s.estimatedCost)}</span>
                </div>
              </div>

              <button
                onClick={() => onCreateOrder(s.ingredient, s.suggestedQty)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-lg text-xs font-semibold transition-all group-hover:shadow-md"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Commander {s.suggestedQty} {s.ingredient.unit}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Supplier Order Cards ────────────────────────────────────────────────────

function SupplierOrderCards({ orders, suppliers, onWhatsApp, onSendEmail, onExpand, expandedSupplier }: {
  orders: Order[];
  suppliers: Supplier[];
  onWhatsApp: (order: Order) => void;
  onSendEmail: (order: Order) => void;
  onExpand: (name: string | null) => void;
  expandedSupplier: string | null;
}) {
  // Group pending orders (brouillon + envoye) by supplier
  const supplierGroups = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'brouillon' || o.status === 'envoyé');
    const groups = new Map<string, { orders: Order[]; supplier: Supplier | undefined; totalCost: number }>();

    pending.forEach((o) => {
      const key = o.supplierName;
      if (!groups.has(key)) {
        const supplier = suppliers.find((s) => s.id === o.supplierId);
        groups.set(key, { orders: [], supplier, totalCost: 0 });
      }
      const group = groups.get(key)!;
      group.orders.push(o);
      group.totalCost += o.totalHT;
    });

    return Array.from(groups.entries()).sort((a, b) => b[1].totalCost - a[1].totalCost);
  }, [orders, suppliers]);

  if (supplierGroups.length === 0) return null;

  return (
    <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center gap-3">
        <Truck className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
        <h2 className="text-base font-bold text-[#111111] dark:text-white">Commandes par fournisseur</h2>
        <span className="px-2 py-0.5 bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] rounded-full text-xs font-medium">
          {supplierGroups.length} fournisseur{supplierGroups.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {supplierGroups.map(([name, group]) => {
          const isExpanded = expandedSupplier === name;
          const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
          const totalItems = group.orders.reduce((sum, o) => sum + o.lines.length, 0);

          return (
            <div
              key={name}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                isExpanded
                  ? 'border-[#111111] dark:border-white shadow-lg'
                  : 'border-[#E5E7EB] dark:border-[#262626] hover:border-[#9CA3AF] dark:hover:border-[#525252]'
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => onExpand(isExpanded ? null : name)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111111] dark:text-white truncate">{name}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                      {totalItems} article{totalItems > 1 ? 's' : ''} / {group.orders.length} commande{group.orders.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#111111] dark:text-white">{fmtEuro(group.totalCost)}</p>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] uppercase">HT</p>
                  </div>
                </div>

                {/* Quick action buttons */}
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => group.orders[0] && onSendEmail(group.orders[0])}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-lg text-xs font-semibold transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Commander
                  </button>
                  <button
                    onClick={() => group.orders[0] && onWhatsApp(group.orders[0])}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg text-xs font-semibold transition border border-[#25D366]/30"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded item details */}
              {isExpanded && (
                <div className="border-t border-[#E5E7EB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 p-3 space-y-2">
                  {group.orders.map((order) => (
                    <div key={order.id}>
                      {order.lines.map((line) => (
                        <div key={line.id} className="flex items-center justify-between py-1.5 text-xs">
                          <span className="text-[#111111] dark:text-white font-medium">{line.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[#6B7280] dark:text-[#A3A3A3]">{line.quantity} {line.unit}</span>
                            <span className="font-medium text-[#111111] dark:text-white">{fmtEuro(line.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {group.supplier?.phone && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#262626] text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                      <Phone className="w-3 h-3" />
                      {group.supplier.phone}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Order Timeline (enhanced) ───────────────────────────────────────────────

function OrderTimeline({ status, date, expectedDelivery, receivedAt }: { status: OrderStatus; date: string; expectedDelivery?: string | null; receivedAt?: string | null }) {
  const timelineSteps: { key: string; label: string; date?: string; color: string; done: boolean; active: boolean }[] = [
    { key: 'commandee', label: 'Commandee', date, color: 'bg-[#111111] dark:bg-white', done: true, active: status === 'brouillon' },
    { key: 'confirmee', label: 'Confirmee', color: 'bg-blue-500', done: ['envoyé', 'confirmé', 'livré', 'réclamation'].includes(status), active: status === 'envoyé' },
    { key: 'expediee', label: 'Expediee', color: 'bg-amber-500', done: ['confirmé', 'livré', 'réclamation'].includes(status), active: status === 'confirmé' },
    { key: 'livree', label: 'Livree', date: receivedAt || undefined, color: 'bg-emerald-500', done: ['livré', 'réclamation'].includes(status), active: status === 'livré' },
    { key: 'verifiee', label: 'Verifiee', color: 'bg-emerald-600', done: status === 'réclamation' || (status === 'livré' && !!receivedAt), active: false },
  ];

  if (status === 'annulé') {
    return (
      <div className="mt-4 px-2">
        <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-2">Suivi de livraison</p>
        <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
          <XCircle className="w-4 h-4 text-[#9CA3AF]" />
          Commande annulee
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 px-2">
      <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-3">Suivi de livraison</p>
      {expectedDelivery && (
        <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Livraison prevue : <span className="font-medium text-[#111111] dark:text-white">{fmtDate(expectedDelivery)}</span>
        </p>
      )}
      <div className="flex items-start gap-0">
        {timelineSteps.map((step, idx) => {
          const isLast = idx === timelineSteps.length - 1;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {!isLast && (
                <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${step.done && !step.active ? step.color : 'bg-[#F3F4F6] dark:bg-[#171717]'}`} />
              )}
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                step.done
                  ? step.active
                    ? 'border-[#111111] dark:border-white bg-[#111111]/20 dark:bg-white/20'
                    : 'border-emerald-500 bg-emerald-500/20'
                  : 'border-[#E5E7EB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]'
              }`}>
                {step.done && !step.active ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : step.active ? (
                  <CircleDot className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4D4D4] dark:bg-[#4B5563]" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold ${step.active ? 'text-[#111111] dark:text-white' : step.done ? 'text-emerald-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">{fmtDate(step.date)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Budget Tracker ──────────────────────────────────────────────────────────

function BudgetTracker({ monthlySpend, budget }: { monthlySpend: number; budget: number }) {
  const percentage = budget > 0 ? Math.min((monthlySpend / budget) * 100, 150) : 0;
  const isOverBudget = monthlySpend > budget;
  const remaining = budget - monthlySpend;

  return (
    <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
          <h3 className="font-bold text-sm text-[#111111] dark:text-white">Budget mensuel</h3>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isOverBudget
            ? 'bg-red-500/10 text-red-500 border border-red-500/30'
            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
        }`}>
          {isOverBudget ? 'Depasse' : 'Dans le budget'}
        </span>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-2xl font-bold text-[#111111] dark:text-white">{fmtEuro(monthlySpend)}</p>
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">sur {fmtEuro(budget)} prevu</p>
        </div>
        <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
          {isOverBudget ? '+' : ''}{fmtEuro(remaining)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {/* Budget line marker */}
        {percentage > 100 && (
          <div className="absolute top-0 bottom-0 w-0.5 bg-[#111111] dark:bg-white" style={{ left: `${(100 / percentage) * 100}%` }} />
        )}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">0 EUR</span>
        <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{fmtEuro(budget)}</span>
      </div>
    </div>
  );
}

// ── Spending chart component ────────────────────────────────────────────────

interface SpendingData {
  spending: Record<string, Record<string, number>>;
  suppliers: string[];
}

function SpendingChart({ data }: { data: SpendingData | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const months = Object.keys(data.spending).sort();
    if (months.length === 0) return;

    const suppColors = ['#111111', '#6B7280', '#9CA3AF', '#D4D4D4', '#374151', '#4B5563'];
    const darkSuppColors = ['#FFFFFF', '#A3A3A3', '#737373', '#525252', '#D4D4D4', '#404040'];
    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark ? darkSuppColors : suppColors;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    let maxVal = 0;
    months.forEach((m) => {
      let monthTotal = 0;
      data.suppliers.forEach((s) => { monthTotal += data.spending[m]?.[s] || 0; });
      maxVal = Math.max(maxVal, monthTotal);
    });
    if (maxVal === 0) maxVal = 100;
    maxVal = Math.ceil(maxVal / 100) * 100;

    const barW = Math.min(40, (chartW / months.length) * 0.6);
    const gap = (chartW - barW * months.length) / (months.length + 1);

    ctx.strokeStyle = isDark ? '#262626' : '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + chartH - (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = isDark ? '#737373' : '#9CA3AF';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round((maxVal * i) / 4) + ' \u20AC', padding.left - 8, y + 3);
    }

    months.forEach((m, mi) => {
      const x = padding.left + gap + mi * (barW + gap);
      let cumY = 0;
      data.suppliers.forEach((s, si) => {
        const val = data.spending[m]?.[s] || 0;
        const h = (val / maxVal) * chartH;
        ctx.fillStyle = colors[si % colors.length];
        ctx.beginPath();
        const y = padding.top + chartH - cumY - h;
        const radius = 3;
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y, x + barW, y, radius);
        ctx.arcTo(x + barW, y, x + barW, y + h, radius);
        ctx.lineTo(x + barW, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        cumY += h;
      });

      ctx.fillStyle = isDark ? '#737373' : '#9CA3AF';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(fmtMonth(m), x + barW / 2, height - padding.bottom + 16);
    });
  }, [data]);

  if (!data || Object.keys(data.spending).length === 0) {
    return (
      <div className="text-center py-8 text-[#6B7280] dark:text-[#A3A3A3] text-sm">
        Aucune donnee de depenses disponible
      </div>
    );
  }

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const suppColors = ['#111111', '#6B7280', '#9CA3AF', '#D4D4D4', '#374151', '#4B5563'];
  const darkSuppColors = ['#FFFFFF', '#A3A3A3', '#737373', '#525252', '#D4D4D4', '#404040'];
  const colors = isDark ? darkSuppColors : suppColors;

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={280} className="w-full max-w-[600px]" />
      <div className="flex flex-wrap gap-3 mt-3 px-2">
        {data.suppliers.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[i % colors.length] }} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── component ────────────────────────────────────────────────────────────────

export default function AutoOrders() {
  const { t } = useTranslation();
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
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);

  // Order form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [formSupplierName, setFormSupplierName] = useState('');
  const [formSupplierId, setFormSupplierId] = useState<number | null>(null);
  const [formLines, setFormLines] = useState<OrderLine[]>([emptyLine()]);
  const [formNotes, setFormNotes] = useState('');
  const [formExpectedDelivery, setFormExpectedDelivery] = useState('');

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

  // Reception modal
  const [receiveOrder, setReceiveOrder] = useState<Order | null>(null);
  const [receiveLines, setReceiveLines] = useState<{ itemId: number; name: string; orderedQty: number; receivedQty: number; unit: string; checked: boolean }[]>([]);
  const [receivingId, setReceivingId] = useState<number | null>(null);

  // Tabs: dashboard vs commandes vs historique vs depenses
  const [activeTab, setActiveTab] = useState<'dashboard' | 'commandes' | 'historique' | 'depenses'>('dashboard');

  // Spending data
  const [spendingData, setSpendingData] = useState<SpendingData | null>(null);

  // History filters
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historySupplier, setHistorySupplier] = useState('');
  const [historyStatus, setHistoryStatus] = useState<'tous' | OrderStatus>('tous');

  // Budget
  const monthlyBudget = 5000; // Could be from settings

  // WhatsApp order tracking
  const [waTrackingList, setWaTrackingList] = useState<WhatsAppOrderTracking[]>(() => {
    try {
      const stored = localStorage.getItem('wa_order_tracking');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [bulkSending, setBulkSending] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ sent: 0, total: 0 });
  const cancelBulkRef = useRef<(() => void) | null>(null);

  // Persist tracking to localStorage
  useEffect(() => {
    localStorage.setItem('wa_order_tracking', JSON.stringify(waTrackingList));
  }, [waTrackingList]);

  // Update estimated statuses every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setWaTrackingList((prev) =>
        prev.map((t) => ({ ...t, status: t.status === 'confirmee' ? 'confirmee' : estimateViewStatus(t) }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

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

      try {
        const spendingRes = await fetch('/api/marketplace/orders/spending', {
          headers: autoOrdersAuthHeaders(),
        });
        if (spendingRes.ok) {
          setSpendingData(await spendingRes.json());
        }
      } catch {
        // Non-fatal
      }
    } catch {
      showToast(t('autoOrders.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, selectedRestaurant, restaurantLoading]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── summary stats ──────────────────────────────────────────────────────────

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const activeOrders = orders.filter((o) => ['brouillon', 'envoyé', 'confirmé'].includes(o.status));
  const monthOrders = orders.filter((o) => o.date.startsWith(currentMonth));
  const monthTotal = monthOrders.reduce((sum, o) => sum + o.totalHT, 0);
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
  const prevMonthOrders = orders.filter((o) => o.date.startsWith(prevMonthStr));
  const prevMonthTotal = prevMonthOrders.reduce((sum, o) => sum + o.totalHT, 0);
  const monthTrend = prevMonthTotal > 0 ? ((monthTotal - prevMonthTotal) / prevMonthTotal * 100) : 0;
  const estimatedSavings = monthTotal * 0.08; // Estimated 8% savings from smart ordering

  const brouillonCount = orders.filter((o) => o.status === 'brouillon').length;
  const envoyeCount = orders.filter((o) => o.status === 'envoyé').length;
  const confirmeCount = orders.filter((o) => o.status === 'confirmé').length;
  const livreCount = orders.filter((o) => o.status === 'livré').length;
  const totalValue = orders.reduce((sum, o) => sum + o.totalHT, 0);

  // ── filtered orders ────────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'tous') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // ── reorder suggestions ───────────────────────────────────────────────────

  const reorderSuggestions = useMemo(() => computeReorderSuggestions(lowStockItems), [lowStockItems]);

  // ── form helpers ──────────────────────────────────────────────────────────

  function openNewOrderForm() {
    setEditingOrderId(null);
    setFormSupplierName('');
    setFormSupplierId(null);
    setFormLines([emptyLine()]);
    setFormNotes('');
    setFormExpectedDelivery('');
    setFormOpen(true);
  }

  function openEditOrderForm(order: Order) {
    setEditingOrderId(order.id);
    setFormSupplierName(order.supplierName);
    setFormSupplierId(order.supplierId);
    setFormLines(order.lines.map((l) => ({ ...l })));
    setFormNotes(order.notes);
    setFormExpectedDelivery(order.expectedDelivery ? order.expectedDelivery.split('T')[0] : '');
    setFormOpen(true);
  }

  function openQuickOrder(item: InventoryItem, qty: number) {
    const supplierName = item.ingredient?.supplier || 'Fournisseur inconnu';
    const supplierId = item.ingredient?.supplierId || null;
    setFormSupplierName(supplierName);
    setFormSupplierId(supplierId);
    setFormLines([{
      id: nextLineId++,
      ingredientId: item.ingredientId,
      name: item.ingredient.name,
      quantity: qty,
      unit: item.unit,
      pricePerUnit: item.ingredient.pricePerUnit,
      total: qty * item.ingredient.pricePerUnit,
    }]);
    setFormNotes('Reapprovisionnement rapide');
    setFormExpectedDelivery('');
    setEditingOrderId(null);
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
      showToast(t('autoOrders.selectSupplier'), 'error');
      return;
    }
    const validLines = formLines.filter((l) => l.name.trim() && l.quantity > 0);
    if (validLines.length === 0) {
      showToast(t('autoOrders.addValidItem'), 'error');
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
      expectedDelivery: formExpectedDelivery || null,
      notes: formNotes,
    };

    if (editingOrderId && existing?.dbId) {
      try {
        await fetch(`/api/marketplace/orders/${existing.dbId}`, {
          method: 'PUT',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({ notes: formNotes, expectedDelivery: formExpectedDelivery || null }),
        });
      } catch {
        // Non-fatal
      }
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? orderData : o)));
      showToast(t('autoOrders.orderModified'), 'success');
    } else if (editingOrderId) {
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? orderData : o)));
      showToast(t('autoOrders.orderModified'), 'success');
    } else {
      try {
        const res = await fetch('/api/marketplace/orders', {
          method: 'POST',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({
            supplierName: orderData.supplierName,
            supplierId: orderData.supplierId,
            notes: orderData.notes,
            expectedDelivery: formExpectedDelivery || null,
            items: validLines.map((l) => ({
              productName: l.name,
              quantity: l.quantity,
              unit: l.unit,
              unitPrice: l.pricePerUnit,
              ingredientId: l.ingredientId,
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
      showToast(t('autoOrders.orderCreatedDraft'), 'success');
    }

    setFormOpen(false);
  }

  // ── order actions ──────────────────────────────────────────────────────────

  async function changeStatus(id: number, newStatus: OrderStatus) {
    const order = orders.find((o) => o.id === id);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );
    if (order?.dbId) {
      try {
        await fetch(`/api/marketplace/orders/${order.dbId}/status`, {
          method: 'PUT',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({ status: STATUS_TO_API[newStatus] }),
        });
      } catch {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: order.status } : o)),
        );
        showToast('Erreur changement de statut', 'error');
        return;
      }
    }
    const labels: Record<OrderStatus, string> = {
      'brouillon': 'remis en brouillon',
      'envoyé': 'marque envoye',
      'confirmé': 'marque confirme',
      'livré': 'marque livre',
      'annulé': 'annule',
      'réclamation': 'reclamation ouverte',
    };
    showToast(`Commande ${labels[newStatus]}`, 'success');
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
    showToast(t('autoOrders.orderDeleted'), 'success');
  }

  function duplicateOrder(order: Order) {
    const dup: Order = {
      ...order,
      id: nextOrderId++,
      dbId: undefined,
      status: 'brouillon',
      date: new Date().toISOString(),
      expectedDelivery: null,
      receivedAt: null,
      notes: `Copie de la commande ${order.supplierName}`,
      lines: order.lines.map((l) => ({ ...l, id: nextLineId++, receivedQuantity: null })),
    };
    setOrders((prev) => [dup, ...prev]);
    showToast(t('autoOrders.orderDuplicated'), 'success');
  }

  // ── One-Click Reorder ────────────────────────────────────────────────────

  function handleReorder(order: Order) {
    const dup: Order = {
      ...order,
      id: nextOrderId++,
      dbId: undefined,
      status: 'brouillon',
      date: new Date().toISOString(),
      expectedDelivery: null,
      receivedAt: null,
      notes: `Recommande depuis commande du ${fmtDate(order.date)}`,
      lines: order.lines.map((l) => ({ ...l, id: nextLineId++, receivedQuantity: null })),
    };

    // Save to API
    fetch('/api/marketplace/orders', {
      method: 'POST',
      headers: autoOrdersAuthHeaders(),
      body: JSON.stringify({
        supplierName: dup.supplierName,
        supplierId: dup.supplierId,
        notes: dup.notes,
        items: dup.lines.map((l) => ({
          productName: l.name,
          quantity: l.quantity,
          unit: l.unit,
          unitPrice: l.pricePerUnit,
          ingredientId: l.ingredientId,
        })),
      }),
    }).then(async (res) => {
      if (res.ok) {
        const created: ApiOrder = await res.json();
        const fromApi = apiOrderToLocal(created);
        setOrders((prev) => prev.map((o) => (o.id === dup.id ? fromApi : o)));
      }
    }).catch(() => {/* non-fatal */});

    setOrders((prev) => [dup, ...prev]);
    showToast('Commande re-creee en brouillon', 'success');
  }

  // ── Reception ─────────────────────────────────────────────────────────────

  function openReceiveModal(order: Order) {
    setReceiveOrder(order);
    setReceiveLines(order.lines.map((l) => ({
      itemId: l.id,
      name: l.name,
      orderedQty: l.quantity,
      receivedQty: l.quantity,
      unit: l.unit,
      checked: true,
    })));
  }

  async function handleReceiveOrder() {
    if (!receiveOrder) return;
    setReceivingId(receiveOrder.id);
    try {
      const receivedItems = receiveLines
        .filter((l) => l.checked)
        .map((l) => ({ itemId: l.itemId, receivedQuantity: l.receivedQty }));

      if (receiveOrder.dbId) {
        const res = await fetch(`/api/marketplace/orders/${receiveOrder.dbId}/receive`, {
          method: 'POST',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({ receivedItems }),
        });
        if (res.ok) {
          const updated: ApiOrder = await res.json();
          const fromApi = apiOrderToLocal(updated);
          setOrders((prev) => prev.map((o) => (o.id === receiveOrder.id ? fromApi : o)));
        } else {
          throw new Error('Erreur reception');
        }
      } else {
        setOrders((prev) =>
          prev.map((o) => (o.id === receiveOrder.id ? { ...o, status: 'livré' as OrderStatus, receivedAt: new Date().toISOString() } : o)),
        );
      }

      showToast('Commande receptionnee, inventaire mis a jour', 'success');
      setReceiveOrder(null);
    } catch {
      showToast('Erreur lors de la reception', 'error');
    } finally {
      setReceivingId(null);
    }
  }

  // ── Relancer fournisseur ───────────────────────────────────────────────────

  async function handleRelanceFournisseur(order: Order) {
    setRelancingId(order.id);
    try {
      const supplier = suppliers.find((s) => s.id === order.supplierId);
      const supplierEmail = supplier?.email || '';
      if (!supplierEmail) {
        showToast(t('autoOrders.missingEmail'), 'error');
        setRelancingId(null);
        return;
      }

      const subject = `RELANCE -- Commande RestauMargin - ${order.supplierName} - ${fmtDate(order.date)}`;
      const body = [
        `Bonjour,`,
        ``,
        `Nous revenons vers vous concernant la commande envoyee le ${fmtDate(order.date)}.`,
        ``,
        `A ce jour, nous n'avons pas encore recu la marchandise ou de confirmation de livraison.`,
        `Pourriez-vous nous tenir informes de l'etat d'avancement de cette commande ?`,
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
          notes: `RELANCE -- ${order.notes}`,
        }),
      });

      if (!res.ok) throw new Error('Erreur envoi relance');
      showToast(t('autoOrders.reminderSent'), 'success');
    } catch {
      showToast(t('autoOrders.reminderError'), 'error');
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
      `--- Detail de la commande ---`,
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
    if (order.expectedDelivery) {
      lines.push(`Livraison souhaitee : ${fmtDate(order.expectedDelivery)}`);
      lines.push(``);
    }
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
      showToast(t('autoOrders.copiedToClipboard'), 'success');
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
        notes: 'Commande auto-generee (reapprovisionnement)',
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
    showToast(`${autoGeneratedOrders.length} commande(s) auto-generee(s) en brouillon`, 'success');

    for (const order of autoGeneratedOrders) {
      try {
        const res = await fetch('/api/marketplace/orders', {
          method: 'POST',
          headers: autoOrdersAuthHeaders(),
          body: JSON.stringify({
            supplierName: order.supplierName,
            supplierId: order.supplierId,
            notes: order.notes,
            items: order.lines.map((l) => ({
              productName: l.name,
              quantity: l.quantity,
              unit: l.unit,
              unitPrice: l.pricePerUnit,
              ingredientId: l.ingredientId,
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
        showToast(t('autoOrders.missingEmail'), 'error');
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
      changeStatus(order.id, 'envoyé');
      showToast(t('autoOrders.orderSentEmail'), 'success');
    } catch {
      showToast(t('autoOrders.emailError'), 'error');
    } finally {
      setSendingEmail(null);
    }
  }

  function handleWhatsAppOrder(order: Order, isUrgent?: boolean) {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    const phone = supplier?.whatsappPhone || supplier?.phone;
    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';

    const items = order.lines.filter((l) => l.name.trim()).map((l) => ({
      name: l.name,
      quantity: l.quantity,
      unit: l.unit,
      pricePerUnit: l.pricePerUnit,
    }));

    const templateParams = {
      supplierName: order.supplierName,
      restaurantName,
      items,
      deliveryDate: order.expectedDelivery || undefined,
      totalHT: order.totalHT,
    };

    const message = isUrgent
      ? urgentOrderMessage(templateParams)
      : standardOrderMessage(templateParams);

    openWhatsApp(phone, message);

    // Mark as sent
    if (order.status === 'brouillon') {
      changeStatus(order.id, 'envoyé');
    }

    // Track the WhatsApp send
    setWaTrackingList((prev) => {
      const existing = prev.find((t) => t.orderId === order.id);
      if (existing) return prev;
      return [...prev, {
        orderId: order.id,
        supplierName: order.supplierName,
        sentAt: new Date().toISOString(),
        status: 'envoyee' as WhatsAppConfirmationStatus,
      }];
    });

    showToast('Commande envoyee via WhatsApp', 'success');
  }

  function handleWhatsAppComplaint(order: Order, issue: string) {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    const phone = supplier?.whatsappPhone || supplier?.phone;
    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';

    const message = complaintMessage({
      supplierName: order.supplierName,
      restaurantName,
      deliveryDateForComplaint: order.receivedAt || order.date,
      issueDescription: issue,
    });

    openWhatsApp(phone, message);
  }

  function handleWhatsAppReorder(order: Order) {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    const phone = supplier?.whatsappPhone || supplier?.phone;
    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';

    const items = order.lines.filter((l) => l.name.trim()).map((l) => ({
      name: l.name,
      quantity: l.quantity,
      unit: l.unit,
      pricePerUnit: l.pricePerUnit,
    }));

    const message = reorderMessage({
      supplierName: order.supplierName,
      restaurantName,
      items,
      totalHT: order.totalHT,
      originalDate: order.date,
    });

    openWhatsApp(phone, message);

    // Create the reorder as draft
    handleReorder(order);
    showToast('Commande renouvelee via WhatsApp', 'success');
  }

  // ── Bulk WhatsApp Orders ──────────────────────────────────────────────────

  function handleBulkWhatsApp() {
    const draftOrders = orders.filter((o) => o.status === 'brouillon');
    if (draftOrders.length === 0) {
      showToast('Aucune commande en brouillon a envoyer', 'error');
      return;
    }

    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';

    // Group by supplier
    const supplierMap = new Map<string, { orders: Order[]; supplier: Supplier | undefined }>();
    draftOrders.forEach((o) => {
      if (!supplierMap.has(o.supplierName)) {
        supplierMap.set(o.supplierName, { orders: [], supplier: suppliers.find((s) => s.id === o.supplierId) });
      }
      supplierMap.get(o.supplierName)!.orders.push(o);
    });

    const bulkOrders: BulkWhatsAppOrder[] = [];
    supplierMap.forEach(({ orders: supplierOrders, supplier }, supplierName) => {
      const allItems = supplierOrders.flatMap((o) =>
        o.lines.filter((l) => l.name.trim()).map((l) => ({
          name: l.name,
          quantity: l.quantity,
          unit: l.unit,
          pricePerUnit: l.pricePerUnit,
        }))
      );
      const totalHT = supplierOrders.reduce((s, o) => s + o.totalHT, 0);
      const phone = supplier?.whatsappPhone || supplier?.phone;

      const message = standardOrderMessage({
        supplierName,
        restaurantName,
        items: allItems,
        totalHT,
      });

      bulkOrders.push({ supplierName, phone, message });
    });

    setBulkSending(true);
    setBulkProgress({ sent: 0, total: bulkOrders.length });

    const cancel = openBulkWhatsApp(
      bulkOrders,
      (sent, total) => setBulkProgress({ sent, total }),
      () => {
        setBulkSending(false);
        // Mark all drafts as sent
        draftOrders.forEach((o) => changeStatus(o.id, 'envoyé'));
        // Track all
        setWaTrackingList((prev) => {
          const newItems = draftOrders
            .filter((o) => !prev.find((t) => t.orderId === o.id))
            .map((o) => ({
              orderId: o.id,
              supplierName: o.supplierName,
              sentAt: new Date().toISOString(),
              status: 'envoyee' as WhatsAppConfirmationStatus,
            }));
          return [...prev, ...newItems];
        });
        showToast(`${bulkOrders.length} commande(s) envoyee(s) via WhatsApp`, 'success');
      },
    );
    cancelBulkRef.current = cancel;
  }

  function handleCancelBulk() {
    if (cancelBulkRef.current) {
      cancelBulkRef.current();
      cancelBulkRef.current = null;
    }
    setBulkSending(false);
  }

  // ── WhatsApp confirmation toggle ──────────────────────────────────────────

  function toggleWaConfirmation(orderId: number) {
    setWaTrackingList((prev) =>
      prev.map((t) =>
        t.orderId === orderId
          ? {
              ...t,
              status: t.status === 'confirmee' ? 'envoyee' : 'confirmee',
              confirmedAt: t.status === 'confirmee' ? undefined : new Date().toISOString(),
            }
          : t
      )
    );
  }

  function handleWaReminder(order: Order) {
    const supplier = suppliers.find((s) => s.id === order.supplierId);
    const phone = supplier?.whatsappPhone || supplier?.phone;
    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';
    const message = `Bonjour ${order.supplierName},\n\nJe me permets de relancer concernant ma commande envoyee hier.\nMerci de confirmer sa prise en charge.\n\nCordialement,\n${restaurantName}`;
    openWhatsApp(phone, message);
    showToast('Relance envoyee via WhatsApp', 'success');
  }

  // ── History with filters ──────────────────────────────────────────────────

  const historyOrders = useMemo(() => {
    return [...orders]
      .filter((o) => {
        if (o.status === 'brouillon') return false;
        if (historyStatus !== 'tous' && o.status !== historyStatus) return false;
        if (historySupplier && !o.supplierName.toLowerCase().includes(historySupplier.toLowerCase())) return false;
        if (historyDateFrom) {
          const from = new Date(historyDateFrom);
          if (new Date(o.date) < from) return false;
        }
        if (historyDateTo) {
          const to = new Date(historyDateTo);
          to.setHours(23, 59, 59, 999);
          if (new Date(o.date) > to) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, historyStatus, historySupplier, historyDateFrom, historyDateTo]);

  const uniqueSupplierNames = useMemo(() => {
    const names = new Set(orders.map((o) => o.supplierName));
    return Array.from(names).sort();
  }, [orders]);

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#374151] dark:text-[#D4D4D4]" />
        <span className="ml-3 text-[#9CA3AF] dark:text-[#737373]">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-[#737373] dark:text-[#A3A3A3]" />
            {t('autoOrders.title')}
          </h1>
          <p className="text-[#9CA3AF] dark:text-[#737373] mt-1">{t('autoOrders.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {lowStockItems.length > 0 && (
            <button
              onClick={generateAutoOrders}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-xl font-medium transition text-sm"
            >
              <Zap className="w-4 h-4" />
              Auto-reappro ({lowStockItems.length})
            </button>
          )}
          <button
            onClick={openNewOrderForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('autoOrders.newOrder')}
          </button>
        </div>
      </div>

      {/* ── Tab switcher ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border border-[#E5E7EB] dark:border-[#262626] rounded-xl p-1 w-fit overflow-x-auto">
        {[
          { key: 'dashboard' as const, icon: Target, label: 'Dashboard', count: null },
          { key: 'commandes' as const, icon: Package, label: t('autoOrders.ordersTab'), count: orders.length },
          { key: 'historique' as const, icon: History, label: t('autoOrders.historyTab'), count: historyOrders.length },
          { key: 'depenses' as const, icon: BarChart3, label: 'Depenses', count: null },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== null && (
              <span className="px-1.5 py-0.5 bg-[#E5E7EB] dark:bg-[#262626] text-[#6B7280] dark:text-[#A3A3A3] rounded text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Dashboard Tab ────────────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              icon={<ShoppingCart className="w-5 h-5 text-[#111111] dark:text-white" />}
              label="Commandes en cours"
              value={String(activeOrders.length)}
              trend={activeOrders.length > 3 ? 'up' : 'neutral'}
              trendLabel={`${brouillonCount} brouillon, ${envoyeCount} envoye`}
              accent="border-[#E5E7EB] dark:border-[#262626]"
            />
            <KPICard
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              label="Commandes ce mois"
              value={String(monthOrders.length)}
              trend={monthOrders.length > prevMonthOrders.length ? 'up' : monthOrders.length < prevMonthOrders.length ? 'down' : 'neutral'}
              trendLabel={`${monthOrders.length > prevMonthOrders.length ? '+' : ''}${monthOrders.length - prevMonthOrders.length} vs mois dernier`}
              accent="border-blue-500/20"
            />
            <KPICard
              icon={<Euro className="w-5 h-5 text-[#111111] dark:text-white" />}
              label="Montant total ce mois"
              value={fmtEuro(monthTotal)}
              trend={monthTrend > 0 ? 'up' : monthTrend < 0 ? 'down' : 'neutral'}
              trendLabel={`${monthTrend >= 0 ? '+' : ''}${monthTrend.toFixed(1)}% vs precedent`}
              accent="border-[#111111]/20 dark:border-white/20"
            />
            <KPICard
              icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
              label="Economie estimee"
              value={fmtEuro(estimatedSavings)}
              trend="up"
              trendLabel="~8% via commandes groupees"
              accent="border-emerald-500/20"
            />
          </div>

          {/* Budget Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {/* Smart Reorder Suggestions */}
              <SmartReorderSection
                suggestions={reorderSuggestions}
                onCreateOrder={openQuickOrder}
              />
              {reorderSuggestions.length === 0 && (
                <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-8 text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                  <p className="font-semibold text-[#111111] dark:text-white">Stock optimal</p>
                  <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-1">Tous vos ingredients sont au-dessus du seuil minimum</p>
                </div>
              )}
            </div>
            <div>
              <BudgetTracker monthlySpend={monthTotal} budget={monthlyBudget} />
            </div>
          </div>

          {/* Bulk WhatsApp + Supplier Order Cards */}
          <div className="space-y-4">
            {/* Bulk WhatsApp Send Bar */}
            {orders.filter((o) => o.status === 'brouillon').length > 0 && (
              <div className="bg-white dark:bg-black/50 border border-[#25D366]/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#111111] dark:text-white">Envoi groupé WhatsApp</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                      {orders.filter((o) => o.status === 'brouillon').length} commande(s) en brouillon prêtes à envoyer
                    </p>
                  </div>
                </div>
                {bulkSending ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#25D366]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {bulkProgress.sent}/{bulkProgress.total} commandes envoyées
                    </div>
                    <div className="w-32 h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#25D366] rounded-full transition-all"
                        style={{ width: `${bulkProgress.total > 0 ? (bulkProgress.sent / bulkProgress.total) * 100 : 0}%` }}
                      />
                    </div>
                    <button onClick={handleCancelBulk} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition">
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleBulkWhatsApp}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-semibold transition shadow-sm"
                  >
                    <SendHorizonal className="w-4 h-4" />
                    Envoyer tout via WhatsApp
                  </button>
                )}
              </div>
            )}

            <SupplierOrderCards
              orders={orders}
              suppliers={suppliers}
              onWhatsApp={handleWhatsAppOrder}
              onSendEmail={openEmailModal}
              onExpand={setExpandedSupplier}
              expandedSupplier={expandedSupplier}
            />
          </div>

          {/* WhatsApp Order Confirmation Tracker */}
          {waTrackingList.length > 0 && (
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#25D366]/10">
                    <CheckCheck className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#111111] dark:text-white">Suivi confirmations WhatsApp</h2>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                      {waTrackingList.filter((t) => t.status === 'confirmee').length}/{waTrackingList.length} confirmées
                    </p>
                  </div>
                </div>
                {waTrackingList.filter((t) => needsReminder(t)).length > 0 && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/30">
                    <Bell className="w-3 h-3" />
                    {waTrackingList.filter((t) => needsReminder(t)).length} relance(s) nécessaire(s)
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                {waTrackingList.slice().reverse().slice(0, 10).map((tracking) => {
                  const updatedStatus = tracking.status === 'confirmee' ? tracking.status : estimateViewStatus(tracking);
                  const cfg = getConfirmationStatusConfig(updatedStatus);
                  const matchedOrder = orders.find((o) => o.id === tracking.orderId);
                  const shouldRemind = needsReminder(tracking);

                  return (
                    <div
                      key={tracking.orderId}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                        shouldRemind
                          ? 'border-red-500/30 bg-red-500/5'
                          : tracking.status === 'confirmee'
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-[#E5E7EB] dark:border-[#262626]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-xs shrink-0">
                          {tracking.supplierName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-[#111111] dark:text-white truncate">{tracking.supplierName}</p>
                          <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">
                            Envoyée {fmtDate(tracking.sentAt)}
                            {matchedOrder ? ` - ${fmtEuro(matchedOrder.totalHT)} HT` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`}>
                          {updatedStatus === 'envoyee' && <Send className="w-2.5 h-2.5" />}
                          {updatedStatus === 'vue' && <Eye className="w-2.5 h-2.5" />}
                          {updatedStatus === 'confirmee' && <Check className="w-2.5 h-2.5" />}
                          {updatedStatus === 'non_confirmee' && <AlertTriangle className="w-2.5 h-2.5" />}
                          {cfg.label}
                        </span>
                        {shouldRemind && matchedOrder && (
                          <button
                            onClick={() => handleWaReminder(matchedOrder)}
                            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition border border-[#25D366]/30"
                          >
                            <Bell className="w-3 h-3" />
                            Relancer
                          </button>
                        )}
                        <button
                          onClick={() => toggleWaConfirmation(tracking.orderId)}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg transition border ${
                            tracking.status === 'confirmee'
                              ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'text-[#6B7280] dark:text-[#A3A3A3] bg-[#F3F4F6] dark:bg-[#171717] border-[#E5E7EB] dark:border-[#262626] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
                          }`}
                          title={tracking.status === 'confirmee' ? 'Marquer non confirmée' : 'Marquer confirmée'}
                        >
                          {tracking.status === 'confirmee' ? 'Confirmée' : 'Confirmer'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Low-stock alert banner */}
          {lowStockItems.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111] dark:text-white">
                      {lowStockItems.length} article{lowStockItems.length > 1 ? 's' : ''} en rupture de stock
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">
                      Cliquez sur un article pour creer une commande rapide
                    </p>
                  </div>
                </div>
                <button
                  onClick={generateAutoOrders}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-semibold text-sm transition shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  <Zap className="w-4 h-4" />
                  {t('autoOrders.generateAutoOrders')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.slice(0, 8).map((item) => (
                  <button
                    key={item.ingredientId}
                    onClick={() => openQuickOrder(item, Math.max(1, item.minStock * 2 - item.currentStock))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-[#0A0A0A] border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-full transition-all"
                    title={`Stock: ${item.currentStock} / Min: ${item.minStock} ${item.unit}`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    {item.ingredient.name}
                    <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                      ({item.currentStock}/{item.minStock} {item.unit})
                    </span>
                  </button>
                ))}
                {lowStockItems.length > 8 && (
                  <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] self-center ml-1">
                    +{lowStockItems.length - 8} autres
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Orders list ─────────────────────────────────────────────────────── */}
      {activeTab === 'commandes' && (
        <section className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex flex-wrap items-center gap-3">
            <Package className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
            <h2 className="text-lg font-semibold text-[#111111] dark:text-white">{t('autoOrders.ordersTab')}</h2>
            <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{filteredOrders.length} {t('autoOrders.ordersCount')}</span>

            {/* Status filter */}
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
              {(['tous', 'brouillon', 'envoyé', 'confirmé', 'livré', 'annulé', 'réclamation'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition ${
                    statusFilter === s
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                      : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626]'
                  }`}
                >
                  {s === 'tous' ? 'Tous' : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280] dark:text-[#A3A3A3]">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-[#374151] dark:text-[#D4D4D4]" />
              {orders.length === 0
                ? t('autoOrders.noOrdersYet')
                : t('autoOrders.noOrdersFilter')}
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  expanded={expandedOrderId === order.id}
                  onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  onEdit={() => openEditOrderForm(order)}
                  onSend={() => openEmailModal(order)}
                  onStatusChange={(s) => changeStatus(order.id, s)}
                  onReceive={() => openReceiveModal(order)}
                  onDelete={() => setDeleteTarget(order.id)}
                  onDuplicate={() => duplicateOrder(order)}
                  onReorder={() => handleReorder(order)}
                  onDirectSend={() => handleSendOrderEmail(order)}
                  onWhatsApp={() => handleWhatsAppOrder(order)}
                  onWhatsAppUrgent={() => handleWhatsAppOrder(order, true)}
                  onWhatsAppReorder={() => handleWhatsAppReorder(order)}
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
        <section className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center gap-3">
            <History className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
            <h2 className="text-lg font-semibold text-[#111111] dark:text-white">{t('autoOrders.orderHistory')}</h2>
            <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{historyOrders.length} resultat(s)</span>
          </div>

          {/* History filters */}
          <div className="px-6 py-3 border-b border-[#E5E7EB] dark:border-[#262626] flex flex-wrap items-center gap-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/40">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Du</label>
              <input
                type="date"
                value={historyDateFrom}
                onChange={(e) => setHistoryDateFrom(e.target.value)}
                className="px-2 py-1 border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-xs bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Au</label>
              <input
                type="date"
                value={historyDateTo}
                onChange={(e) => setHistoryDateTo(e.target.value)}
                className="px-2 py-1 border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-xs bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white"
              />
            </div>
            <select
              value={historySupplier}
              onChange={(e) => setHistorySupplier(e.target.value)}
              className="px-2 py-1 border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-xs bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white"
            >
              <option value="">Tous les fournisseurs</option>
              {uniqueSupplierNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              value={historyStatus}
              onChange={(e) => setHistoryStatus(e.target.value as any)}
              className="px-2 py-1 border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-xs bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white"
            >
              <option value="tous">Tous les statuts</option>
              {(['envoyé', 'confirmé', 'livré', 'annulé', 'réclamation'] as const).map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
            {(historyDateFrom || historyDateTo || historySupplier || historyStatus !== 'tous') && (
              <button
                onClick={() => { setHistoryDateFrom(''); setHistoryDateTo(''); setHistorySupplier(''); setHistoryStatus('tous'); }}
                className="text-xs text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white transition"
              >
                Effacer filtres
              </button>
            )}
          </div>

          {historyOrders.length === 0 ? (
            <div className="p-8 text-center text-[#6B7280] dark:text-[#A3A3A3]">
              <History className="w-10 h-10 mx-auto mb-2 text-[#374151] dark:text-[#D4D4D4]" />
              {t('autoOrders.noHistory')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/60">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{t('autoOrders.date')}</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{t('autoOrders.supplier')}</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{t('autoOrders.items')}</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{t('autoOrders.totalHT')}</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{t('autoOrders.totalTTC')}</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{t('autoOrders.status')}</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
                  {historyOrders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['brouillon'];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={order.id} className="hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition">
                        <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{fmtDate(order.date)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3] shrink-0" />
                            <span className="font-medium text-[#111111] dark:text-white">{order.supplierName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-[#9CA3AF] dark:text-[#737373]">{order.lines.length}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#111111] dark:text-white">{fmtEuro(order.totalHT)}</td>
                        <td className="py-3 px-4 text-right text-[#6B7280] dark:text-[#A3A3A3]">{fmtEuro(order.totalTTC)}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
                            <StatusIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* One-Click Reorder */}
                            <button
                              onClick={() => handleReorder(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#262626] rounded-lg transition border border-[#E5E7EB] dark:border-[#262626]"
                              title="Recommander les memes articles"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Recommander
                            </button>
                            {/* Reorder via WhatsApp */}
                            <button
                              onClick={() => handleWhatsAppReorder(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition border border-[#25D366]/30"
                              title="Renouveler via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Spending tab ─────────────────────────────────────────────────────── */}
      {activeTab === 'depenses' && (
        <section className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
            <h2 className="text-lg font-semibold text-[#111111] dark:text-white">Depenses par fournisseur</h2>
            <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">12 derniers mois</span>
          </div>
          <div className="p-6">
            <SpendingChart data={spendingData} />
          </div>
        </section>
      )}

      {/* ── Order form modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingOrderId ? t('autoOrders.editOrder') : t('autoOrders.newOrder')}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('autoOrders.supplier')}</label>
            {suppliers.length > 0 ? (
              <select
                value={formSupplierId ?? '__custom__'}
                onChange={(e) => handleSupplierChange(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-[#262626] rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111]"
              >
                <option value="__custom__">-- Saisie libre --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : null}
            <input
              type="text"
              value={formSupplierName}
              onChange={(e) => { setFormSupplierName(e.target.value); setFormSupplierId(null); }}
              placeholder={t('autoOrders.supplierNamePlaceholder')}
              className="mt-2 w-full px-3 py-2 border border-[#E5E7EB] dark:border-[#262626] rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111]"
            />
          </div>

          {/* Expected delivery date */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Date de livraison prevue</label>
            <input
              type="date"
              value={formExpectedDelivery}
              onChange={(e) => setFormExpectedDelivery(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-[#262626] rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111]"
            />
          </div>

          {/* Line items */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-2">{t('autoOrders.items')}</label>
            <div className="space-y-2">
              {formLines.map((line) => (
                <div key={line.id} className="flex flex-wrap items-end gap-2 p-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 rounded-lg border border-[#E5E7EB] dark:border-[#262626]">
                  <div className="flex-1 min-w-[160px]">
                    <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Ingredient</label>
                    {ingredients.length > 0 ? (
                      <select
                        value={line.ingredientId ?? ''}
                        onChange={(e) => handleIngredientSelect(line.id, e.target.value)}
                        className="w-full px-2 py-1.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                      >
                        <option value="">-- Selectionner --</option>
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
                        className="w-full px-2 py-1.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                      />
                    )}
                    {ingredients.length > 0 && (
                      <input
                        type="text"
                        value={line.name}
                        onChange={(e) => updateLine(line.id, 'name', e.target.value)}
                        placeholder="ou saisir manuellement"
                        className="mt-1 w-full px-2 py-1 border border-[#E5E7EB] dark:border-[#262626]/50 rounded-md text-xs bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#6B7280] dark:text-[#A3A3A3] focus:ring-1 focus:ring-[#111111] dark:focus:ring-white"
                      />
                    )}
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Qte</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.id, 'quantity', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Unite</label>
                    <input
                      type="text"
                      value={line.unit}
                      onChange={(e) => updateLine(line.id, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Prix unit.</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={line.pricePerUnit}
                      onChange={(e) => updateLine(line.id, 'pricePerUnit', Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1.5 border border-[#E5E7EB] dark:border-[#262626] rounded-md text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                    />
                  </div>
                  <div className="w-24 text-right">
                    <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Total</label>
                    <p className="text-sm font-medium text-[#111111] dark:text-white py-1.5">{fmtEuro(line.total)}</p>
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
              className="mt-2 flex items-center gap-1 px-3 py-1.5 text-sm text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> {t('autoOrders.addItem')}
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('autoOrders.notes')}</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-[#E5E7EB] dark:border-[#262626] rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111] resize-none"
              placeholder={t('autoOrders.notesPlaceholder')}
            />
          </div>

          {/* Totals */}
          <div className="border-t border-[#E5E7EB] dark:border-[#262626] pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-[#9CA3AF] dark:text-[#737373]">
              <span>Total HT</span>
              <span className="font-medium">{fmtEuro(formTotals.totalHT)}</span>
            </div>
            <div className="flex justify-between text-[#9CA3AF] dark:text-[#737373]">
              <span>TVA (20%)</span>
              <span className="font-medium">{fmtEuro(formTotals.tva)}</span>
            </div>
            <div className="flex justify-between text-[#111111] dark:text-white font-semibold text-base pt-1 border-t border-[#E5E7EB] dark:border-[#262626]">
              <span>Total TTC</span>
              <span>{fmtEuro(formTotals.totalTTC)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 text-[#6B7280] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={saveOrder}
              className="flex items-center gap-2 px-5 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-medium transition shadow-sm"
            >
              <Check className="w-4 h-4" />
              {editingOrderId ? t('common.save') : t('autoOrders.createDraft')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Email modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!emailOrder}
        onClose={() => setEmailOrder(null)}
        title={t('autoOrders.sendByEmail')}
      >
        {emailOrder && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('autoOrders.recipient')}</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3] shrink-0" />
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="email@fournisseur.com"
                  className="flex-1 px-3 py-2 border border-[#E5E7EB] dark:border-[#262626] rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('autoOrders.emailSubject')}</label>
              <p className="text-sm text-[#111111] dark:text-white bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2">
                {buildEmailSubject(emailOrder)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('autoOrders.emailBody')}</label>
              <pre className="text-xs text-[#6B7280] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-3 max-h-64 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                {buildEmailBody(emailOrder)}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                onClick={() => setEmailOrder(null)}
                className="px-4 py-2 text-[#6B7280] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition text-sm"
              >
                {t('common.cancel')}
              </button>
              {/* WhatsApp button in email modal */}
              <button
                onClick={() => { handleWhatsAppOrder(emailOrder); }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-lg transition text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] dark:border-[#262626] text-[#6B7280] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition text-sm"
              >
                {emailCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {emailCopied ? t('autoOrders.copied') : t('autoOrders.copyToClipboard')}
              </button>
              <button
                onClick={() => emailOrder && handleSendOrderEmail(emailOrder)}
                disabled={!!sendingEmail}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-medium text-sm transition shadow-sm disabled:opacity-50"
              >
                {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {sendingEmail ? t('autoOrders.sendingEmail') : t('autoOrders.sendEmail')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Reception modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={!!receiveOrder}
        onClose={() => setReceiveOrder(null)}
        title="Reception de commande"
      >
        {receiveOrder && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 rounded-lg border border-[#E5E7EB] dark:border-[#262626]">
              <Truck className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
              <div>
                <p className="font-semibold text-[#111111] dark:text-white">{receiveOrder.supplierName}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Commande du {fmtDate(receiveOrder.date)}</p>
              </div>
            </div>

            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              Cochez les articles recus et ajustez les quantites si necessaire. L'inventaire sera mis a jour automatiquement.
            </p>

            <div className="space-y-2">
              {receiveLines.map((line, idx) => (
                <div key={line.itemId} className={`flex items-center gap-3 p-3 rounded-lg border transition ${line.checked ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border-[#E5E7EB] dark:border-[#262626]'}`}>
                  <button
                    onClick={() => setReceiveLines((prev) => prev.map((l, i) => i === idx ? { ...l, checked: !l.checked } : l))}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${line.checked ? 'bg-emerald-500 border-emerald-500' : 'border-[#E5E7EB] dark:border-[#262626]'}`}
                  >
                    {line.checked && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${line.checked ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373] line-through'}`}>{line.name}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Commande : {line.orderedQty} {line.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Recu :</label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={line.receivedQty}
                      onChange={(e) => setReceiveLines((prev) => prev.map((l, i) => i === idx ? { ...l, receivedQty: Math.max(0, Number(e.target.value)) } : l))}
                      disabled={!line.checked}
                      className="w-20 px-2 py-1 border border-[#E5E7EB] dark:border-[#262626] rounded-md text-sm bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white disabled:opacity-40"
                    />
                    <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{line.unit}</span>
                  </div>
                  {line.checked && line.receivedQty !== line.orderedQty && (
                    <span className="text-xs text-amber-400 font-medium">
                      {line.receivedQty < line.orderedQty ? 'Manque' : 'Excedent'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262626]">
              <button
                onClick={() => setReceiveOrder(null)}
                className="px-4 py-2 text-[#6B7280] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
              >
                Annuler
              </button>
              <button
                onClick={handleReceiveOrder}
                disabled={!!receivingId || receiveLines.every((l) => !l.checked)}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition shadow-sm disabled:opacity-50"
              >
                {receivingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                Valider la reception
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Auto-reorder review modal ──────────────────────────────────────── */}
      <Modal
        isOpen={showAutoReviewModal}
        onClose={() => { setShowAutoReviewModal(false); setAutoGeneratedOrders([]); }}
        title={t('autoOrders.autoReviewTitle')}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
            {autoGeneratedOrders.length} commande(s) generee(s) a partir des articles en rupture de stock.
            Verifiez les quantites avant de confirmer.
          </p>
          {autoGeneratedOrders.map((order) => (
            <div key={order.id} className="border border-[#E5E7EB] dark:border-[#262626] rounded-xl overflow-hidden">
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                  <span className="font-semibold text-[#111111] dark:text-white">{order.supplierName}</span>
                </div>
                <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">{fmtEuro(order.totalHT)} HT</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-[#6B7280] dark:text-[#A3A3A3] border-b border-[#E5E7EB] dark:border-[#262626]">
                    <th className="text-left py-2 px-4">Article</th>
                    <th className="text-center py-2 px-3">Qte</th>
                    <th className="text-center py-2 px-3">Unite</th>
                    <th className="text-right py-2 px-4">Prix unit.</th>
                    <th className="text-right py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
                  {order.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-2 px-4 text-[#111111] dark:text-white">{line.name}</td>
                      <td className="py-2 px-3 text-center text-[#9CA3AF] dark:text-[#737373]">{line.quantity}</td>
                      <td className="py-2 px-3 text-center text-[#9CA3AF] dark:text-[#737373]">{line.unit}</td>
                      <td className="py-2 px-4 text-right text-[#9CA3AF] dark:text-[#737373]">{fmtEuro(line.pricePerUnit)}</td>
                      <td className="py-2 px-4 text-right font-medium text-[#111111] dark:text-white">{fmtEuro(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262626]">
            <button
              onClick={() => { setShowAutoReviewModal(false); setAutoGeneratedOrders([]); }}
              className="px-4 py-2 text-[#6B7280] dark:text-[#A3A3A3] bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#262626] rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={confirmAutoOrders}
              className="flex items-center gap-2 px-5 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-medium transition shadow-sm"
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
        title={t('autoOrders.deleteOrderTitle')}
        message={t('autoOrders.deleteOrderMessage')}
        onConfirm={confirmDeleteOrder}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function OrderRow({
  order,
  expanded,
  onToggle,
  onEdit,
  onSend,
  onStatusChange,
  onReceive,
  onDelete,
  onDuplicate,
  onReorder,
  onDirectSend,
  onWhatsApp,
  onWhatsAppUrgent,
  onWhatsAppReorder,
  onRelance,
  isSending,
  isRelancing,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onSend: () => void;
  onStatusChange: (s: OrderStatus) => void;
  onReceive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReorder: () => void;
  onDirectSend?: () => void;
  onWhatsApp?: () => void;
  onWhatsAppUrgent?: () => void;
  onWhatsAppReorder?: () => void;
  onRelance?: () => void;
  isSending?: boolean;
  isRelancing?: boolean;
}) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['brouillon'];
  const StatusIcon = cfg.icon;

  function renderActionButtons() {
    const buttons: React.ReactNode[] = [];

    if (order.status === 'brouillon') {
      buttons.push(
        <button key="edit" onClick={onEdit} title="Modifier" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
          <Edit3 className="w-3.5 h-3.5" /> Modifier
        </button>,
      );
      buttons.push(
        <button key="email" onClick={onSend} title="Preparer email" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
          <Mail className="w-3.5 h-3.5" /> Email
        </button>,
      );
      if (onWhatsApp) {
        buttons.push(
          <button key="wa" onClick={onWhatsApp} title="Commander via WhatsApp" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/15 rounded-lg transition border border-[#25D366]/20">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>,
        );
      }
      if (onWhatsAppUrgent) {
        buttons.push(
          <button key="wa-urgent" onClick={onWhatsAppUrgent} title="Commande URGENTE via WhatsApp" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition">
            <AlertTriangle className="w-3.5 h-3.5" /> Urgent
          </button>,
        );
      }
      if (onDirectSend) {
        buttons.push(
          <button key="send" onClick={onDirectSend} disabled={isSending} title="Envoyer au fournisseur" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg transition disabled:opacity-50">
            {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Envoyer
          </button>,
        );
      }
      buttons.push(
        <button key="cancel" onClick={() => onStatusChange('annulé')} title="Annuler" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
          <XCircle className="w-3.5 h-3.5" /> Annuler
        </button>,
      );
    }

    if (order.status === 'envoyé') {
      buttons.push(
        <button key="confirm" onClick={() => onStatusChange('confirmé')} title="Marquer confirme" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-lg transition">
          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmer
        </button>,
      );
      if (onRelance) {
        buttons.push(
          <button key="relance" onClick={onRelance} disabled={isRelancing} title="Relancer le fournisseur" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition disabled:opacity-50">
            {isRelancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Relancer
          </button>,
        );
      }
      buttons.push(
        <button key="cancel" onClick={() => onStatusChange('annulé')} title="Annuler" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
          <XCircle className="w-3.5 h-3.5" /> Annuler
        </button>,
      );
    }

    if (order.status === 'confirmé') {
      buttons.push(
        <button key="receive" onClick={onReceive} title="Receptionner" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition">
          <ClipboardCheck className="w-3.5 h-3.5" /> Receptionner
        </button>,
      );
      buttons.push(
        <button key="cancel" onClick={() => onStatusChange('annulé')} title="Annuler" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
          <XCircle className="w-3.5 h-3.5" /> Annuler
        </button>,
      );
    }

    if (order.status === 'livré') {
      buttons.push(
        <button key="reorder" onClick={onReorder} title="Recommander" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#262626] rounded-lg transition border border-[#E5E7EB] dark:border-[#262626]">
          <RefreshCw className="w-3.5 h-3.5" /> Recommander
        </button>,
      );
      buttons.push(
        <button key="claim" onClick={() => onStatusChange('réclamation')} title="Signaler un probleme" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition">
          <ThumbsDown className="w-3.5 h-3.5" /> Reclamation
        </button>,
      );
    }

    if (order.status === 'annulé') {
      buttons.push(
        <button key="reopen" onClick={() => onStatusChange('brouillon')} title="Remettre en brouillon" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
          <RefreshCw className="w-3.5 h-3.5" /> Reouvrir
        </button>,
      );
    }

    if (order.status === 'réclamation') {
      buttons.push(
        <button key="resolve" onClick={() => onStatusChange('livré')} title="Resoudre la reclamation" className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition">
          <Check className="w-3.5 h-3.5" /> Resolu
        </button>,
      );
    }

    // Common: duplicate + delete
    buttons.push(
      <button key="dup" onClick={onDuplicate} title="Dupliquer" className="p-1.5 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
        <CopyPlus className="w-4 h-4" />
      </button>,
    );
    buttons.push(
      <button key="del" onClick={onDelete} title="Supprimer" className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition">
        <Trash2 className="w-4 h-4" />
      </button>,
    );

    return buttons;
  }

  return (
    <div className="hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition">
      {/* Main row */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-4 cursor-pointer" onClick={onToggle}>
        <div className="text-[#6B7280] dark:text-[#A3A3A3]">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>

        {/* Status dot */}
        <div className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />

        <div className="flex items-center gap-2 min-w-[140px]">
          <Truck className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3] shrink-0" />
          <span className="font-medium text-[#111111] dark:text-white">{order.supplierName}</span>
        </div>

        <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
          {order.lines.length} article{order.lines.length > 1 ? 's' : ''}
        </span>

        <span className="font-semibold text-[#111111] dark:text-white">{fmtEuro(order.totalHT)}</span>
        <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{fmtDate(order.date)}</span>

        {/* Status badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {renderActionButtons()}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-5">
          <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/40 border border-[#E5E7EB] dark:border-[#262626]/50 rounded-xl p-4">
            {/* Timeline */}
            <OrderTimeline status={order.status} date={order.date} expectedDelivery={order.expectedDelivery} receivedAt={order.receivedAt} />

            {/* Line items table */}
            <div className="mt-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#6B7280] dark:text-[#A3A3A3] text-xs border-b border-[#E5E7EB] dark:border-[#262626]">
                    <th className="pb-2 pr-4">Produit</th>
                    <th className="pb-2 pr-4">Commande</th>
                    {order.status === 'livré' || order.status === 'réclamation' ? <th className="pb-2 pr-4">Recu</th> : null}
                    <th className="pb-2 pr-4">Unite</th>
                    <th className="pb-2 pr-4">Prix unitaire</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
                  {order.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-2 pr-4 text-[#111111] dark:text-white">{line.name}</td>
                      <td className="py-2 pr-4 text-[#9CA3AF] dark:text-[#737373]">{line.quantity}</td>
                      {(order.status === 'livré' || order.status === 'réclamation') && (
                        <td className="py-2 pr-4">
                          <span className={`font-medium ${line.receivedQuantity != null && line.receivedQuantity !== line.quantity ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {line.receivedQuantity ?? line.quantity}
                          </span>
                        </td>
                      )}
                      <td className="py-2 pr-4 text-[#9CA3AF] dark:text-[#737373]">{line.unit}</td>
                      <td className="py-2 pr-4 text-[#9CA3AF] dark:text-[#737373]">{fmtEuro(line.pricePerUnit)}</td>
                      <td className="py-2 text-right font-medium text-[#111111] dark:text-white">{fmtEuro(line.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262626] space-y-1 text-sm">
              <div className="flex justify-between text-[#9CA3AF] dark:text-[#737373]">
                <span>Total HT</span>
                <span className="font-medium">{fmtEuro(order.totalHT)}</span>
              </div>
              <div className="flex justify-between text-[#9CA3AF] dark:text-[#737373]">
                <span>TVA (20%)</span>
                <span className="font-medium">{fmtEuro(order.tva)}</span>
              </div>
              <div className="flex justify-between text-[#111111] dark:text-white font-semibold">
                <span>Total TTC</span>
                <span>{fmtEuro(order.totalTTC)}</span>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <p className="mt-3 text-sm text-[#6B7280] dark:text-[#A3A3A3] italic border-t border-[#E5E7EB] dark:border-[#262626] pt-3">
                Notes : {order.notes}
              </p>
            )}

            {/* Dates info + WhatsApp quick action */}
            <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262626] flex flex-wrap items-center gap-4 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
              <span>Creee : {fmtDate(order.date)}</span>
              {order.expectedDelivery && <span>Livraison prevue : {fmtDate(order.expectedDelivery)}</span>}
              {order.receivedAt && <span>Recue : {fmtDate(order.receivedAt)}</span>}
              {onWhatsApp && (order.status === 'brouillon' || order.status === 'envoyé') && (
                <button
                  onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition border border-[#25D366]/30"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Commander via WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
