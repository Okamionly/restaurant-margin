import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Download, Upload } from 'lucide-react';
import { fetchIngredients, createIngredient, updateIngredient, deleteIngredient } from '../services/api';
import type { Ingredient } from '../types';
import { INGREDIENT_CATEGORIES, UNITS, ALLERGENS } from '../types';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = { name: '', unit: 'kg', pricePerUnit: '', supplier: '', category: 'Légumes', allergens: [] as string[] };

type SortKey = 'name' | 'category' | 'pricePerUnit' | 'unit' | 'supplier';
type SortDir = 'asc' | 'desc';

export default function Ingredients() {
  const { showToast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
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

  useEffect(() => {
    loadIngredients();
  }, []);

  async function loadIngredients() {
    try {
      const data = await fetchIngredients();
      setIngredients(data);
    } catch {
      showToast('Erreur lors du chargement des ingrédients', 'error');
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
    setShowForm(true);
  }

  function openEdit(ing: Ingredient) {
    setForm({
      name: ing.name,
      unit: ing.unit,
      pricePerUnit: String(ing.pricePerUnit),
      supplier: ing.supplier || '',
      category: ing.category,
      allergens: ing.allergens || [],
    });
    setEditingId(ing.id);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name,
      unit: form.unit,
      pricePerUnit: parseFloat(form.pricePerUnit),
      supplier: form.supplier || null,
      category: form.category,
      allergens: form.allergens,
    };

    try {
      if (editingId) {
        await updateIngredient(editingId, data);
        showToast('Ingrédient modifié avec succès', 'success');
      } else {
        await createIngredient(data);
        showToast('Ingrédient ajouté avec succès', 'success');
      }
      setShowForm(false);
      loadIngredients();
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteIngredient(deleteTarget);
      showToast('Ingrédient supprimé', 'success');
      loadIngredients();
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  // CSV Export
  function exportCSV() {
    const headers = ['Nom', 'Catégorie', 'Prix unitaire', 'Unité', 'Fournisseur', 'Allergènes'];
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

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingredients_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filtered.length} ingrédient(s) exportés`, 'success');
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
        showToast('Fichier CSV vide ou invalide', 'error');
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
          await createIngredient({ name, category, pricePerUnit, unit, supplier, allergens });
          imported++;
        } catch {
          errors++;
        }
      }

      showToast(`${imported} ingrédient(s) importé(s)${errors > 0 ? `, ${errors} erreur(s)` : ''}`, imported > 0 ? 'success' : 'error');
      loadIngredients();
    } catch {
      showToast('Erreur lors de la lecture du fichier', 'error');
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

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ingrédients</h2>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm" title="Exporter en CSV">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <label className={`btn-secondary flex items-center gap-2 text-sm cursor-pointer ${importing ? 'opacity-50' : ''}`} title="Importer depuis CSV">
            <Upload className="w-4 h-4" /> Import CSV
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={importing} />
          </label>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
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
          <option value="">Toutes catégories</option>
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
              <th className="px-4 py-3"><SortHeader label="Nom" field="name" /></th>
              <th className="px-4 py-3"><SortHeader label="Catégorie" field="category" /></th>
              <th className="px-4 py-3"><SortHeader label="Prix unitaire" field="pricePerUnit" /></th>
              <th className="px-4 py-3"><SortHeader label="Unité" field="unit" /></th>
              <th className="px-4 py-3 font-medium">Allergènes</th>
              <th className="px-4 py-3"><SortHeader label="Fournisseur" field="supplier" /></th>
              <th className="px-4 py-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                  {ingredients.length === 0 ? 'Aucun ingrédient. Ajoutez-en un !' : 'Aucun résultat.'}
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
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{ing.supplier || '\u2014'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(ing)} className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600" title="Modifier">
                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button onClick={() => setDeleteTarget(ing.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title="Supprimer">
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

      <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">{filtered.length} ingrédient(s)</p>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Modifier un ingrédient' : 'Nouvel ingrédient'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nom *</label>
            <input required className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Prix unitaire (&euro;) *</label>
              <input required type="number" step="0.01" min="0" className="input w-full" value={form.pricePerUnit} onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} />
            </div>
            <div>
              <label className="label">Unité *</label>
              <select required className="input w-full" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Catégorie *</label>
            <select required className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {INGREDIENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Fournisseur</label>
            <input className="input w-full" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          </div>
          <div>
            <label className="label">Allergènes</label>
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
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary">{editingId ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        title="Supprimer l'ingrédient"
        message="Êtes-vous sûr de vouloir supprimer cet ingrédient ? Cette action est irréversible."
      />
    </div>
  );
}
