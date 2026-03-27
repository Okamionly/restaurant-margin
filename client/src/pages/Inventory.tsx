import { useState, useEffect, useMemo } from 'react';
import {
  Package, AlertTriangle, Plus, RefreshCw, Pencil, Trash2, Search,
  ArrowUpDown, Download, Printer, TrendingUp, CheckCircle2, XCircle, MinusCircle,
  PackagePlus, Loader2, PieChart, Scale
} from 'lucide-react';
import {
  fetchInventory, fetchInventoryAlerts, fetchInventoryValue, fetchInventorySuggestions,
  addToInventory, updateInventoryItem, restockInventoryItem, deleteInventoryItem
} from '../services/api';
import type { InventoryItem, InventoryValue, Ingredient } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import WeighModal from '../components/WeighModal';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Viandes': '🥩',
  'Poissons & Fruits de mer': '🐟',
  'Legumes': '🥦',
  'Légumes': '🥦',
  'Fruits': '🍎',
  'Produits laitiers': '🧀',
  'Épices & Condiments': '🌶️',
  'Féculents & Céréales': '🌾',
  'Huiles & Matières grasses': '🫒',
  'Boissons': '🥤',
  'Autres': '📦',
};

type SortKey = 'name' | 'currentStock' | 'value' | 'status';
type SortDir = 'asc' | 'desc';

function getStatus(item: InventoryItem): 'ok' | 'low' | 'critical' {
  if (item.currentStock <= 0) return 'critical';
  if (item.currentStock < item.minStock) return 'low';
  return 'ok';
}

function getStatusOrder(status: string): number {
  if (status === 'critical') return 0;
  if (status === 'low') return 1;
  return 2;
}

export default function Inventory() {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);
  const [valueData, setValueData] = useState<InventoryValue | null>(null);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // Weigh modal
  const [weighTarget, setWeighTarget] = useState<InventoryItem | null>(null);

  // Forms
  const [addForm, setAddForm] = useState({ ingredientId: 0, currentStock: '', minStock: '', unit: '' });
  const [restockForm, setRestockForm] = useState({ id: 0, name: '', quantity: '' });
  const [editForm, setEditForm] = useState({ id: 0, currentStock: '', minStock: '', maxStock: '', unit: '', notes: '' });
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [inlineStock, setInlineStock] = useState('');
  const [savingBulk, setSavingBulk] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      const [inv, alertsData, val, sugg] = await Promise.all([
        fetchInventory(),
        fetchInventoryAlerts(),
        fetchInventoryValue(),
        fetchInventorySuggestions(),
      ]);
      setItems(inv);
      setAlerts(alertsData);
      setValueData(val);
      setSuggestions(sugg);
    } catch (err: any) {
      showToast(err.message || 'Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item => item.ingredient.name.toLowerCase().includes(q));
    }
    if (filterCategory) {
      result = result.filter(item => item.ingredient.category === filterCategory);
    }
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.ingredient.name.localeCompare(b.ingredient.name);
          break;
        case 'currentStock':
          cmp = a.currentStock - b.currentStock;
          break;
        case 'value':
          cmp = (a.currentStock * a.ingredient.pricePerUnit) - (b.currentStock * b.ingredient.pricePerUnit);
          break;
        case 'status':
          cmp = getStatusOrder(getStatus(a)) - getStatusOrder(getStatus(b));
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [items, search, filterCategory, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  // Categories present in inventory
  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.ingredient.category));
    return Array.from(cats).sort();
  }, [items]);

  // --- Handlers ---
  async function handleAdd() {
    if (!addForm.ingredientId) { showToast('Sélectionnez un ingrédient', 'error'); return; }
    try {
      await addToInventory({
        ingredientId: addForm.ingredientId,
        currentStock: parseFloat(addForm.currentStock) || 0,
        minStock: parseFloat(addForm.minStock) || 0,
        unit: addForm.unit || undefined,
      });
      showToast('Ingrédient ajouté à l\'inventaire', 'success');
      setShowAddModal(false);
      setAddForm({ ingredientId: 0, currentStock: '', minStock: '', unit: '' });
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'error');
    }
  }

  async function handleRestock() {
    const qty = parseFloat(restockForm.quantity);
    if (!qty || qty <= 0) { showToast('Quantité invalide', 'error'); return; }
    try {
      await restockInventoryItem(restockForm.id, qty);
      showToast('Stock mis à jour', 'success');
      setShowRestockModal(false);
      setRestockForm({ id: 0, name: '', quantity: '' });
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'error');
    }
  }

  async function handleEdit() {
    try {
      const data: any = {};
      if (editForm.currentStock !== '') data.currentStock = parseFloat(editForm.currentStock);
      if (editForm.minStock !== '') data.minStock = parseFloat(editForm.minStock);
      data.maxStock = editForm.maxStock ? parseFloat(editForm.maxStock) : null;
      if (editForm.unit) data.unit = editForm.unit;
      data.notes = editForm.notes || null;
      await updateInventoryItem(editForm.id, data);
      showToast('Inventaire mis à jour', 'success');
      setShowEditModal(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteInventoryItem(deleteTarget);
      showToast('Supprimé de l\'inventaire', 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'error');
    }
  }

  async function handleInlineStockSave(itemId: number) {
    const val = parseFloat(inlineStock);
    if (isNaN(val) || val < 0) { showToast('Valeur invalide', 'error'); return; }
    try {
      await updateInventoryItem(itemId, { currentStock: val });
      setEditingStockId(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'error');
    }
  }

  async function handleBulkAdd() {
    setSavingBulk(true);
    try {
      let added = 0;
      for (const ing of suggestions) {
        try {
          await addToInventory({ ingredientId: ing.id, currentStock: 0, minStock: 0 });
          added++;
        } catch { /* skip duplicates */ }
      }
      showToast(`${added} ingrédient(s) ajouté(s) à l'inventaire`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur', 'error');
    } finally {
      setSavingBulk(false);
    }
  }

  async function handleWeighComplete(data: { weight: number; mode: 'set' | 'add' }) {
    if (!weighTarget) return;
    try {
      const valueStr = weighTarget.ingredient.pricePerUnit > 0
        ? ` (${(data.weight * weighTarget.ingredient.pricePerUnit).toFixed(2)} €)`
        : '';
      if (data.mode === 'set') {
        await updateInventoryItem(weighTarget.id, { currentStock: data.weight });
        showToast(`Stock mis à jour : ${data.weight} ${weighTarget.unit}${valueStr}`, 'success');
      } else {
        await restockInventoryItem(weighTarget.id, data.weight);
        showToast(`Stock mis à jour : ${data.weight} ${weighTarget.unit}${valueStr}`, 'success');
      }
      setWeighTarget(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour', 'error');
    }
  }

  function handleExportCSV() {
    const header = 'Ingrédient,Catégorie,Stock actuel,Unité,Stock min,Stock max,Valeur,Statut\n';
    const rows = filteredItems.map(item => {
      const val = (item.currentStock * item.ingredient.pricePerUnit).toFixed(2);
      const status = getStatus(item) === 'ok' ? 'OK' : getStatus(item) === 'low' ? 'Bas' : 'Critique';
      return `"${item.ingredient.name}","${item.ingredient.category}",${item.currentStock},"${item.unit}",${item.minStock},${item.maxStock || ''},${val},${status}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventaire_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export CSV téléchargé', 'success');
  }

  function handlePrint() {
    window.print();
  }

  function openRestock(item: InventoryItem) {
    setRestockForm({ id: item.id, name: item.ingredient.name, quantity: '' });
    setShowRestockModal(true);
  }

  function openEdit(item: InventoryItem) {
    setEditForm({
      id: item.id,
      currentStock: String(item.currentStock),
      minStock: String(item.minStock),
      maxStock: item.maxStock ? String(item.maxStock) : '',
      unit: item.unit,
      notes: item.notes || '',
    });
    setShowEditModal(true);
  }

  // Last update date
  const lastUpdate = useMemo(() => {
    if (items.length === 0) return null;
    const dates = items.map(i => new Date(i.updatedAt).getTime());
    return new Date(Math.max(...dates));
  }, [items]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" />
            Inventaire
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestion des stocks d'ingrédients
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setAddForm({ ingredientId: 0, currentStock: '', minStock: '', unit: '' }); setShowAddModal(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
          {suggestions.length > 0 && (
            <button onClick={handleBulkAdd} disabled={savingBulk} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
              {savingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackagePlus className="w-4 h-4" />}
              Inventaire complet
            </button>
          )}
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors no-print">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <Package className="w-4 h-4" /> Articles en stock
          </div>
          <div className="text-2xl font-bold">{items.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <TrendingUp className="w-4 h-4" /> Valeur totale estimée
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {valueData ? `${valueData.totalValue.toFixed(2)} €` : '---'}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <AlertTriangle className="w-4 h-4" /> Alertes stock bas
          </div>
          <div className={`text-2xl font-bold ${alerts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {alerts.length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
            <RefreshCw className="w-4 h-4" /> Dernière mise à jour
          </div>
          <div className="text-lg font-semibold">
            {lastUpdate ? lastUpdate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '---'}
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      {alerts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            Alertes de stock ({alerts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {alerts.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border dark:border-slate-700">
                <div>
                  <span className="text-sm font-medium">{CATEGORY_EMOJIS[item.ingredient.category] || '📦'} {item.ingredient.name}</span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.currentStock}{" / "}{item.minStock} {item.unit}
                  </div>
                </div>
                <button onClick={() => openRestock(item)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Réapprovisionner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Value by category (pie chart representation) */}
      {valueData && valueData.byCategory.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <PieChart className="w-5 h-5 text-blue-600" />
            Valeur par catégorie
          </h3>
          <div className="flex flex-wrap gap-3">
            {valueData.byCategory.sort((a, b) => b.value - a.value).map(cat => {
              const pct = valueData.totalValue > 0 ? (cat.value / valueData.totalValue * 100) : 0;
              return (
                <div key={cat.category} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                  <span>{CATEGORY_EMOJIS[cat.category] || '📦'}</span>
                  <div>
                    <div className="text-sm font-medium">{cat.category}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{cat.value.toFixed(2)} € ({pct.toFixed(1)}%)</div>
                  </div>
                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un ingrédient..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Toutes catégories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{CATEGORY_EMOJIS[cat] || ''} {cat}</option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                <th className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">Ingrédient <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => toggleSort('currentStock')}>
                  <span className="flex items-center gap-1">Stock <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3 font-medium">Unité</th>
                <th className="px-4 py-3 font-medium">Min</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Max</th>
                <th className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700 hidden sm:table-cell" onClick={() => toggleSort('value')}>
                  <span className="flex items-center gap-1">Valeur <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => toggleSort('status')}>
                  <span className="flex items-center gap-1">Statut <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    {items.length === 0 ? 'Aucun article dans l\'inventaire. Ajoutez des ingrédients pour commencer.' : 'Aucun résultat pour cette recherche.'}
                  </td>
                </tr>
              ) : filteredItems.map(item => {
                const status = getStatus(item);
                const value = item.currentStock * item.ingredient.pricePerUnit;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{CATEGORY_EMOJIS[item.ingredient.category] || '📦'}</span>
                        <div>
                          <div className="font-medium">{item.ingredient.name}</div>
                          <div className="text-xs text-slate-400">{item.ingredient.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingStockId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={inlineStock}
                            onChange={e => setInlineStock(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleInlineStockSave(item.id); if (e.key === 'Escape') setEditingStockId(null); }}
                            className="w-20 px-2 py-1 text-sm border rounded dark:border-slate-600 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                            step="0.01"
                          />
                          <button onClick={() => handleInlineStockSave(item.id)} className="text-green-600 hover:text-green-700">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingStockId(null)} className="text-slate-400 hover:text-slate-600">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => { setEditingStockId(item.id); setInlineStock(String(item.currentStock)); }}
                          title="Cliquer pour modifier"
                        >
                          {item.currentStock}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.unit}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.minStock}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{item.maxStock ?? '---'}</td>
                    <td className="px-4 py-3 font-medium hidden sm:table-cell">{value.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      {status === 'ok' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      )}
                      {status === 'low' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <MinusCircle className="w-3 h-3" /> Bas
                        </span>
                      )}
                      {status === 'critical' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          <XCircle className="w-3 h-3" /> Critique
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setWeighTarget(item)} className="p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors" title="Peser avec la balance">
                          <Scale className="w-4 h-4" />
                        </button>
                        <button onClick={() => openRestock(item)} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors" title="Réapprovisionner">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors" title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(item.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter à l'inventaire">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ingrédient</label>
            <select
              value={addForm.ingredientId}
              onChange={e => {
                const id = parseInt(e.target.value);
                const ing = suggestions.find(s => s.id === id);
                setAddForm(f => ({ ...f, ingredientId: id, unit: ing?.unit || '' }));
              }}
              className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={0}>-- Sélectionner --</option>
              {suggestions.map(ing => (
                <option key={ing.id} value={ing.id}>{CATEGORY_EMOJIS[ing.category] || ''} {ing.name} ({ing.unit})</option>
              ))}
            </select>
            {suggestions.length === 0 && (
              <p className="text-xs text-slate-400 mt-1">Tous les ingrédients sont déjà dans l'inventaire.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock initial</label>
              <input
                type="number"
                value={addForm.currentStock}
                onChange={e => setAddForm(f => ({ ...f, currentStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock minimum</label>
              <input
                type="number"
                value={addForm.minStock}
                onChange={e => setAddForm(f => ({ ...f, minStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Annuler
            </button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      {/* Restock Modal */}
      <Modal isOpen={showRestockModal} onClose={() => setShowRestockModal(false)} title={`Réapprovisionner : ${restockForm.name}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantité à ajouter</label>
            <input
              type="number"
              value={restockForm.quantity}
              onChange={e => setRestockForm(f => ({ ...f, quantity: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Quantité"
              step="0.01"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowRestockModal(false)} className="px-4 py-2 text-sm rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Annuler
            </button>
            <button onClick={handleRestock} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Réapprovisionner
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier l'article">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock actuel</label>
              <input
                type="number"
                value={editForm.currentStock}
                onChange={e => setEditForm(f => ({ ...f, currentStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unité</label>
              <input
                type="text"
                value={editForm.unit}
                onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock minimum</label>
              <input
                type="number"
                value={editForm.minStock}
                onChange={e => setEditForm(f => ({ ...f, minStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock maximum</label>
              <input
                type="number"
                value={editForm.maxStock}
                onChange={e => setEditForm(f => ({ ...f, maxStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                step="0.01"
                placeholder="Optionnel"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={editForm.notes}
              onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
              placeholder="Notes optionnelles..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Annuler
            </button>
            <button onClick={handleEdit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Weigh Modal */}
      {weighTarget && (
        <WeighModal
          isOpen={!!weighTarget}
          onClose={() => setWeighTarget(null)}
          ingredientId={weighTarget.ingredientId}
          ingredientName={weighTarget.ingredient.name}
          currentStock={weighTarget.currentStock}
          unit={weighTarget.unit}
          pricePerUnit={weighTarget.ingredient.pricePerUnit}
          onComplete={handleWeighComplete}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer de l'inventaire"
        message="Êtes-vous sûr de vouloir supprimer cet article de l'inventaire ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
