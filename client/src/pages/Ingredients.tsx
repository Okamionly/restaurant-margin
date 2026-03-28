import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Printer, Loader2, Check, ChevronDown, X, BookOpen, Scale } from 'lucide-react';
import { searchCatalog, type CatalogProduct } from '../data/productCatalog';
import { fetchIngredients, createIngredient, updateIngredient, deleteIngredient, fetchSuppliers, createSupplier, fetchInventory, addToInventory, restockInventoryItem, updateInventoryItem } from '../services/api';
import type { Ingredient, Supplier, InventoryItem } from '../types';
import { INGREDIENT_CATEGORIES, UNITS, ALLERGENS } from '../types';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import WeighModal from '../components/WeighModal';

const emptyForm = { name: '', unit: 'kg', pricePerUnit: '', supplier: '', supplierId: null as number | null, category: 'Légumes', allergens: [] as string[] };

type SortKey = 'name' | 'category' | 'pricePerUnit' | 'unit' | 'supplier';
type SortDir = 'asc' | 'desc';

export default function Ingredients() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // Weigh modal
  const [weighTarget, setWeighTarget] = useState<Ingredient | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // New: form enhancements state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [nameQuery, setNameQuery] = useState('');
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [supplierQuery, setSupplierQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const supplierDropdownRef = useRef<HTMLDivElement>(null);
  const nameDropdownRef = useRef<HTMLDivElement>(null);

  // Last price for edited ingredient
  const lastPrice = useMemo(() => {
    if (!editingId) return null;
    const ing = ingredients.find((i) => i.id === editingId);
    return ing ? ing.pricePerUnit : null;
  }, [editingId, ingredients]);

  // Suppliers from database
  const filteredSuppliersList = useMemo(() => {
    if (!supplierQuery.trim()) return suppliers;
    const q = supplierQuery.toLowerCase();
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, supplierQuery]);

  // Name suggestions from existing ingredients (for duplicate detection)
  const nameSuggestions = useMemo(() => {
    if (!nameQuery || nameQuery.length < 2) return [];
    const q = nameQuery.toLowerCase();
    return ingredients.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 5);
  }, [nameQuery, ingredients]);

  // Catalog suggestions (new products with reference prices)
  const catalogSuggestions = useMemo(() => {
    if (!nameQuery || nameQuery.length < 2) return [];
    const existingNames = new Set(ingredients.map(i => i.name.toLowerCase()));
    return searchCatalog(nameQuery, 10).filter(p => !existingNames.has(p.name.toLowerCase()));
  }, [nameQuery, ingredients]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(e.target as Node)) {
        setShowSupplierDropdown(false);
      }
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(e.target as Node)) {
        setShowNameSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    loadIngredients();
  }, []);

  async function loadIngredients() {
    try {
      const [data, sups, inv] = await Promise.all([fetchIngredients(), fetchSuppliers(), fetchInventory().catch(() => [] as InventoryItem[])]);
      setIngredients(data);
      setSuppliers(sups);
      setInventoryItems(inv);
    } catch {
      showToast(t('ingredients.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let result = ingredients.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.supplier && i.supplier.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = !filterCategory || i.category === filterCategory;
      return matchSearch && matchCategory;
    });
    result.sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];
      if (typeof aVal === 'string') aVal = (aVal || '').toLowerCase();
      if (typeof bVal === 'string') bVal = (bVal || '').toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [ingredients, search, filterCategory, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setFormErrors({});
    setNameQuery('');
    setSupplierQuery('');
    setShowNewSupplierForm(false);
    setShowForm(true);
  }

  function openEdit(ing: Ingredient) {
    setForm({
      name: ing.name,
      unit: ing.unit,
      pricePerUnit: String(ing.pricePerUnit),
      supplier: ing.supplier || '',
      supplierId: ing.supplierId || null,
      category: ing.category,
      allergens: ing.allergens || [],
    });
    setEditingId(ing.id);
    setFormErrors({});
    setNameQuery(ing.name);
    setSupplierQuery(ing.supplier || '');
    setShowNewSupplierForm(false);
    setShowForm(true);
  }

  function toggleAllergen(allergen: string) {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  }

  // Handle name change with autocomplete
  function handleNameChange(value: string) {
    setNameQuery(value);
    setForm({ ...form, name: value });
    setShowNameSuggestions(value.length >= 2 && (nameSuggestions.length > 0 || catalogSuggestions.length > 0));
    if (formErrors.name && value.trim()) {
      setFormErrors((prev) => ({ ...prev, name: false }));
    }
  }

  // Auto-fill unit and category when selecting an existing ingredient name
  function selectNameSuggestion(ing: Ingredient) {
    setForm({
      ...form,
      name: ing.name,
      unit: ing.unit,
      category: ing.category,
    });
    setNameQuery(ing.name);
    setShowNameSuggestions(false);
  }

  // Auto-fill from catalog product (new product with reference price)
  function selectCatalogProduct(product: CatalogProduct) {
    setForm({
      ...form,
      name: product.name,
      unit: product.unit,
      pricePerUnit: String(product.prixMoy),
      category: product.category,
    });
    setNameQuery(product.name);
    setShowNameSuggestions(false);
  }

  // Supplier selection
  function selectSupplier(sup: Supplier) {
    setForm({ ...form, supplier: sup.name, supplierId: sup.id });
    setSupplierQuery(sup.name);
    setShowSupplierDropdown(false);
  }

  function handleSupplierInputChange(value: string) {
    setSupplierQuery(value);
    // If cleared or changed from the selected supplier, clear supplierId
    const match = suppliers.find((s) => s.name.toLowerCase() === value.toLowerCase());
    setForm({ ...form, supplier: value, supplierId: match ? match.id : null });
    setShowSupplierDropdown(true);
  }

  async function addNewSupplier() {
    if (!newSupplierName.trim()) return;
    try {
      const newSup = await createSupplier({ name: newSupplierName.trim(), phone: null, email: null, address: null, city: null, postalCode: null, region: null, country: 'France', siret: null, website: null, notes: null, categories: [], contactName: null, delivery: false, minOrder: null, paymentTerms: null });
      setSuppliers([...suppliers, newSup]);
      setForm({ ...form, supplier: newSup.name, supplierId: newSup.id });
      setSupplierQuery(newSup.name);
      setShowNewSupplierForm(false);
      setNewSupplierName('');
      setShowSupplierDropdown(false);
      showToast(t('ingredients.supplierCreated'), 'success');
    } catch {
      showToast(t('ingredients.supplierCreateError'), 'error');
    }
  }

  // Keyboard shortcut: Enter to save (handled by form), Escape handled by Modal
  const handleFormKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const formEl = (e.target as HTMLElement).closest('form');
      if (formEl) formEl.requestSubmit();
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    const errors: Record<string, boolean> = {};
    if (!form.name.trim()) errors.name = true;
    if (!form.pricePerUnit || parseFloat(form.pricePerUnit) <= 0) errors.pricePerUnit = true;
    if (!form.unit) errors.unit = true;
    if (!form.category) errors.category = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    const data = {
      name: form.name,
      unit: form.unit,
      pricePerUnit: parseFloat(form.pricePerUnit),
      supplier: form.supplier || null,
      supplierId: form.supplierId,
      category: form.category,
      allergens: form.allergens,
    };

    try {
      if (editingId) {
        await updateIngredient(editingId, data);
      } else {
        await createIngredient(data);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowForm(false);
        showToast(editingId ? t('ingredients.ingredientUpdated') : t('ingredients.ingredientCreated'), 'success');
        loadIngredients();
      }, 600);
    } catch {
      showToast(t('ingredients.saveError'), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteIngredient(deleteTarget);
      showToast(t('ingredients.ingredientDeleted'), 'success');
      loadIngredients();
    } catch {
      showToast(t('ingredients.deleteError'), 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  // Weigh and add to inventory
  function openWeigh(ing: Ingredient) {
    setWeighTarget(ing);
  }

  async function handleWeighComplete(data: { weight: number; mode: 'set' | 'add' }) {
    if (!weighTarget) return;
    try {
      const valueStr = weighTarget.pricePerUnit > 0
        ? ` (${(data.weight * weighTarget.pricePerUnit).toFixed(2)} €)`
        : '';
      // Find existing inventory item for this ingredient
      const invItem = inventoryItems.find(i => i.ingredientId === weighTarget.id);
      if (invItem) {
        if (data.mode === 'set') {
          await updateInventoryItem(invItem.id, { currentStock: data.weight });
          showToast(t('ingredients.stockUpdated').replace('{weight}', String(data.weight)).replace('{unit}', weighTarget.unit).replace('{value}', valueStr), 'success');
        } else {
          await restockInventoryItem(invItem.id, data.weight);
          showToast(t('ingredients.stockUpdated').replace('{weight}', String(data.weight)).replace('{unit}', weighTarget.unit).replace('{value}', valueStr), 'success');
        }
      } else {
        // Create new inventory entry
        await addToInventory({
          ingredientId: weighTarget.id,
          currentStock: data.weight,
          minStock: 0,
          unit: weighTarget.unit,
        });
        showToast(t('ingredients.addedToInventory').replace('{weight}', String(data.weight)).replace('{unit}', weighTarget.unit).replace('{name}', weighTarget.name).replace('{value}', valueStr), 'success');
      }
      setWeighTarget(null);
      loadIngredients();
    } catch (err: any) {
      showToast(err.message || t('ingredients.inventoryError'), 'error');
    }
  }

  // CSV Export
  function exportCSV() {
    const headers = [t('ingredients.csvHeaderName'), t('ingredients.csvHeaderCategory'), t('ingredients.csvHeaderUnitPrice'), t('ingredients.csvHeaderUnit'), t('ingredients.csvHeaderSupplier'), t('ingredients.csvHeaderAllergens')];
    const rows = filtered.map((ing) => [
      ing.name,
      ing.category,
      ing.pricePerUnit.toFixed(2),
      ing.unit,
      ing.supplier || '',
      (ing.allergens || []).join('; '),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const BOM = '﻿';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingredients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('ingredients.csvExported').replace('{count}', String(filtered.length)), 'success');
  }

  // CSV Import
  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter((l) => l.trim());
      if (lines.length < 2) {
        showToast(t('ingredients.csvEmpty'), 'error');
        return;
      }

      // Skip header row
      let imported = 0;
      let errors = 0;

      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].match(/("([^"]*("")*)*"|[^,]*)(,|$)/g);
        if (!cells || cells.length < 4) continue;

        const clean = (s: string) => s.replace(/^[",]+|[",]+$/g, '').trim();
        const name = clean(cells[0]);
        const category = clean(cells[1]) || 'Autres';
        const pricePerUnit = parseFloat(clean(cells[2]).replace(',', '.'));
        const unit = clean(cells[3]) || 'kg';
        const supplier = cells[4] ? clean(cells[4]) : null;
        const allergens = cells[5] ? clean(cells[5]).split(';').map((a) => a.trim()).filter(Boolean) : [];

        if (!name || isNaN(pricePerUnit) || pricePerUnit <= 0) {
          errors++;
          continue;
        }

        try {
          // Try to match supplier name to existing supplier
          const matchedSupplier = supplier ? suppliers.find((s) => s.name.toLowerCase() === supplier.toLowerCase()) : null;
          await createIngredient({ name, category, pricePerUnit, unit, supplier, supplierId: matchedSupplier ? matchedSupplier.id : null, allergens });
          imported++;
        } catch {
          errors++;
        }
      }

      showToast(errors > 0 ? t('ingredients.csvImportedWithErrors').replace('{imported}', String(imported)).replace('{errors}', String(errors)) : t('ingredients.csvImported').replace('{imported}', String(imported)), imported > 0 ? 'success' : 'error');
      loadIngredients();
    } catch {
      showToast(t('ingredients.csvReadError'), 'error');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <button onClick={() => toggleSort(field)} className="flex items-center gap-1 font-medium hover:text-slate-900 dark:hover:text-slate-200">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortKey === field ? 'text-blue-600' : 'text-slate-400'}`} />
      </button>
    );
  }

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">{t('ingredients.loading')}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('ingredients.title')}</h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm no-print" title={t('ingredients.printTooltip')}>
            <Printer className="w-4 h-4" /> {t('ingredients.print')}
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('ingredients.add')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('ingredients.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">{t('ingredients.allCategories')}</option>
          {INGREDIENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-left">
            <tr>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.nameColumn')} field="name" /></th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.categoryColumn')} field="category" /></th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.unitPriceColumn')} field="pricePerUnit" /></th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.unitColumn')} field="unit" /></th>
              <th className="px-4 py-3 font-medium">{t('ingredients.allergensColumn')}</th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.supplierColumn')} field="supplier" /></th>
              <th className="px-4 py-3 font-medium w-24">{t('ingredients.actionsColumn')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                  {ingredients.length === 0 ? t('ingredients.noIngredients') : t('ingredients.noResults')}
                </td>
              </tr>
            ) : (
              filtered.map((ing) => (
                <tr key={ing.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{ing.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{ing.category}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{ing.pricePerUnit.toFixed(2)} &euro;</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{ing.unit}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(ing.allergens || []).map((a) => (
                        <span key={a} className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{ing.supplier || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openWeigh(ing)} className="p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30" title={t('ingredients.weighTooltip')}>
                        <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                      <button onClick={() => openEdit(ing)} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600" title={t('ingredients.editTooltip')}>
                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button onClick={() => setDeleteTarget(ing.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t('ingredients.deleteTooltip')}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">{t('ingredients.ingredientCount').replace('{count}', String(filtered.length))}</p>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? t('ingredients.editModalTitle') : t('ingredients.newModalTitle')}>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className={`space-y-4 transition-colors duration-500 ${saveSuccess ? 'bg-green-50 dark:bg-green-900/20 rounded-lg p-2 -m-2' : ''}`}>
          {/* Name with autocomplete */}
          <div className="relative" ref={nameDropdownRef}>
            <label className="label">{t('ingredients.nameLabel')}</label>
            <input
              ref={nameInputRef}
              required
              className={`input w-full ${formErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => { if (nameQuery.length >= 2) setShowNameSuggestions(true); }}
              placeholder={t('ingredients.namePlaceholder')}
              autoComplete="off"
            />
            {formErrors.name && <p className="text-xs text-red-500 mt-1">{t('ingredients.nameRequired')}</p>}
            {/* Name suggestions dropdown — existing + catalog */}
            {showNameSuggestions && (nameSuggestions.length > 0 || catalogSuggestions.length > 0) && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 max-h-64 overflow-y-auto">
                {nameSuggestions.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs text-slate-400 border-b dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                      {t('ingredients.existingIngredients')}
                    </div>
                    {nameSuggestions.map((ing) => (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => selectNameSuggestion(ing)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors border-b dark:border-slate-600 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{ing.name}</span>
                          <span className="text-xs text-slate-400">{ing.category} - {ing.pricePerUnit.toFixed(2)}&euro;/{ing.unit}</span>
                        </div>
                        {ing.supplier && <div className="text-xs text-slate-400 mt-0.5">{t('ingredients.supplierPrefix')}{ing.supplier}</div>}
                      </button>
                    ))}
                  </>
                )}
                {catalogSuggestions.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs text-blue-500 border-b dark:border-slate-600 bg-blue-50 dark:bg-blue-900/20 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" /> {t('ingredients.catalogTitle')}
                    </div>
                    {catalogSuggestions.map((product, idx) => (
                      <button
                        key={`cat-${idx}`}
                        type="button"
                        onClick={() => selectCatalogProduct(product)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors border-b dark:border-slate-600 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{product.name}</span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{product.prixMoy.toFixed(2)}&euro;/{product.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{product.category}</span>
                          <span className="text-xs text-slate-400">|</span>
                          <span className="text-xs text-green-600">{product.prixMin.toFixed(2)}&euro;</span>
                          <span className="text-xs text-slate-400">—</span>
                          <span className="text-xs text-red-500">{product.prixMax.toFixed(2)}&euro;</span>
                          <span className="text-xs text-slate-400 ml-auto">{product.fournisseurs.join(', ')}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('ingredients.unitPriceLabel')}</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className={`input w-full ${formErrors.pricePerUnit ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                value={form.pricePerUnit}
                onChange={(e) => {
                  setForm({ ...form, pricePerUnit: e.target.value });
                  if (formErrors.pricePerUnit && parseFloat(e.target.value) > 0) {
                    setFormErrors((prev) => ({ ...prev, pricePerUnit: false }));
                  }
                }}
              />
              {formErrors.pricePerUnit && <p className="text-xs text-red-500 mt-1">{t('ingredients.priceRequired')}</p>}
              {editingId && lastPrice !== null && (
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  {t('ingredients.lastPrice').replace('{price}', lastPrice.toFixed(2))}
                </p>
              )}
            </div>
            <div>
              <label className="label">{t('ingredients.unitLabel')}</label>
              <select
                required
                className={`input w-full ${formErrors.unit ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">{t('ingredients.categoryLabel')}</label>
            <select
              required
              className={`input w-full ${formErrors.category ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {INGREDIENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Supplier dropdown with autocomplete */}
          <div className="relative" ref={supplierDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="label">{t('ingredients.supplierLabelText')}</label>
              <button
                type="button"
                onClick={() => setShowNewSupplierForm(!showNewSupplierForm)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                {showNewSupplierForm ? t('ingredients.cancelCreateSupplier') : t('ingredients.createSupplier')}
              </button>
            </div>

            {showNewSupplierForm ? (
              <div className="flex gap-2 mt-1">
                <input
                  className="input flex-1"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder={t('ingredients.newSupplierPlaceholder')}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewSupplier(); } }}
                />
                <button
                  type="button"
                  onClick={addNewSupplier}
                  className="btn-primary text-sm px-3"
                  disabled={!newSupplierName.trim()}
                >
                  {t('ingredients.addSupplierBtn')}
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  className="input w-full pr-8"
                  value={supplierQuery}
                  onChange={(e) => handleSupplierInputChange(e.target.value)}
                  onFocus={() => setShowSupplierDropdown(true)}
                  placeholder={t('ingredients.supplierSelectPlaceholder')}
                  autoComplete="off"
                />
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                {form.supplier && (
                  <button
                    type="button"
                    onClick={() => { setForm({ ...form, supplier: '', supplierId: null }); setSupplierQuery(''); }}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                )}
                {showSupplierDropdown && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 max-h-48 overflow-y-auto">
                    {filteredSuppliersList.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-slate-400">
                        {suppliers.length === 0 ? t('ingredients.noExistingSuppliers') : t('ingredients.noMatch')}
                      </div>
                    ) : (
                      filteredSuppliersList.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => selectSupplier(s)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors ${form.supplierId === s.id ? 'bg-blue-50 dark:bg-slate-600 font-medium text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                          {s.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="label">{t('ingredients.allergensLabel')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {ALLERGENS.map((allergen) => (
                <label key={allergen} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allergens.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {allergen}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{t('ingredients.saveShortcut')}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    const ing = ingredients.find(i => i.id === editingId);
                    if (ing) { setShowForm(false); openWeigh(ing); }
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  <Scale className="w-3 h-3" /> {t('ingredients.weigh')}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{t('ingredients.cancel')}</button>
              <button
                type="submit"
                className={`btn-primary flex items-center gap-2 min-w-[120px] justify-center transition-all ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('ingredients.saving')}</>
                ) : saveSuccess ? (
                  <><Check className="w-4 h-4" /> {t('ingredients.saved')}</>
                ) : (
                  editingId ? t('ingredients.edit') : t('ingredients.add')
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Weigh Modal */}
      {weighTarget && (
        <WeighModal
          isOpen={!!weighTarget}
          onClose={() => setWeighTarget(null)}
          ingredientId={weighTarget.id}
          ingredientName={weighTarget.name}
          currentStock={inventoryItems.find(i => i.ingredientId === weighTarget.id)?.currentStock ?? 0}
          unit={weighTarget.unit}
          pricePerUnit={weighTarget.pricePerUnit}
          onComplete={handleWeighComplete}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        title={t('ingredients.deleteTitle')}
        message={t('ingredients.deleteMessage')}
      />
    </div>
  );
}
