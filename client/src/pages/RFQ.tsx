import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2, CheckCircle, Send, FileText, X, Euro, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

type Ingredient = { id: number; name: string; unit: string; category: string; pricePerUnit: number };
type Supplier = { id: number; name: string; email?: string; contactName?: string };
type RFQQuote = { id: number; supplierId: number; unitPrice: number | null; notes: string | null; selected: boolean; supplier: Supplier };
type RFQItem = { id: number; ingredientId: number; quantity: number; ingredient: Ingredient; quotes: RFQQuote[] };
type RFQSupplier = { id: number; supplierId: number; supplier: Supplier };
type RFQData = {
  id: number; title: string; status: string; dueDate: string | null; notes: string | null;
  createdAt: string; items: RFQItem[]; suppliers: RFQSupplier[];
};

const STATUS_LABELS: Record<string, string> = { draft: 'Brouillon', sent: 'Envoyé', closed: 'Clôturé' };
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  closed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

export default function RFQPage() {
  const { showToast } = useToast();
  const [rfqs, setRfqs] = useState<RFQData[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingQuote, setEditingQuote] = useState<{ quoteId: number; value: string; notes: string } | null>(null);

  // Create form state
  const [form, setForm] = useState({
    title: '', dueDate: '', notes: '',
    selectedIngredients: [] as { ingredientId: number; quantity: string }[],
    selectedSupplierIds: [] as number[],
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API}/api/rfqs`, { headers: authHeaders() }),
        fetch(`${API}/api/ingredients`, { headers: authHeaders() }),
        fetch(`${API}/api/suppliers`, { headers: authHeaders() }),
      ]);
      if (r1.ok) setRfqs(await r1.json());
      if (r2.ok) setIngredients(await r2.json());
      if (r3.ok) setSuppliers(await r3.json());
    } catch { showToast('Erreur chargement', 'error'); }
    setLoading(false);
  }

  async function handleCreate() {
    const items = form.selectedIngredients.filter(i => i.ingredientId && parseFloat(i.quantity) > 0);
    if (!form.title.trim() || items.length === 0 || form.selectedSupplierIds.length === 0) {
      showToast('Remplissez titre, produits et fournisseurs', 'error'); return;
    }
    try {
      const res = await fetch(`${API}/api/rfqs`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: form.title, dueDate: form.dueDate || null, notes: form.notes || null,
          items: items.map(i => ({ ingredientId: i.ingredientId, quantity: parseFloat(i.quantity) })),
          supplierIds: form.selectedSupplierIds,
        }),
      });
      if (!res.ok) { const e = await res.json(); showToast(e.error, 'error'); return; }
      const created = await res.json();
      setRfqs(prev => [created, ...prev]);
      setShowCreate(false);
      setForm({ title: '', dueDate: '', notes: '', selectedIngredients: [], selectedSupplierIds: [] });
      setExpandedId(created.id);
      showToast('Appel d\'offres créé', 'success');
    } catch { showToast('Erreur création', 'error'); }
  }

  async function handleStatusChange(rfq: RFQData, status: string) {
    try {
      const res = await fetch(`${API}/api/rfqs/${rfq.id}`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setRfqs(prev => prev.map(r => r.id === rfq.id ? updated : r));
    } catch { showToast('Erreur mise à jour', 'error'); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await fetch(`${API}/api/rfqs/${deleteId}`, { method: 'DELETE', headers: authHeaders() });
      setRfqs(prev => prev.filter(r => r.id !== deleteId));
      if (expandedId === deleteId) setExpandedId(null);
      showToast('Supprimé', 'success');
    } catch { showToast('Erreur suppression', 'error'); }
    setDeleteId(null);
  }

  async function handleSaveQuote(rfqId: number) {
    if (!editingQuote) return;
    try {
      const res = await fetch(`${API}/api/rfqs/${rfqId}/quotes/${editingQuote.quoteId}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ unitPrice: editingQuote.value === '' ? null : editingQuote.value, notes: editingQuote.notes || null }),
      });
      if (!res.ok) return;
      setEditingQuote(null);
      const rfqRes = await fetch(`${API}/api/rfqs/${rfqId}`, { headers: authHeaders() });
      if (rfqRes.ok) { const updated = await rfqRes.json(); setRfqs(prev => prev.map(r => r.id === rfqId ? updated : r)); }
    } catch { showToast('Erreur sauvegarde', 'error'); }
  }

  async function handleSelectQuote(rfqId: number, quoteId: number, applyPrice: boolean) {
    try {
      await fetch(`${API}/api/rfqs/${rfqId}/quotes/${quoteId}/select`, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ applyPrice }),
      });
      const rfqRes = await fetch(`${API}/api/rfqs/${rfqId}`, { headers: authHeaders() });
      if (rfqRes.ok) { const updated = await rfqRes.json(); setRfqs(prev => prev.map(r => r.id === rfqId ? updated : r)); }
      showToast(applyPrice ? 'Prix appliqué à l\'ingrédient' : 'Offre sélectionnée', 'success');
    } catch { showToast('Erreur', 'error'); }
  }

  const addIngredientRow = () =>
    setForm(f => ({ ...f, selectedIngredients: [...f.selectedIngredients, { ingredientId: 0, quantity: '' }] }));

  const removeIngredientRow = (idx: number) =>
    setForm(f => ({ ...f, selectedIngredients: f.selectedIngredients.filter((_, i) => i !== idx) }));

  const toggleSupplier = (id: number) =>
    setForm(f => ({
      ...f,
      selectedSupplierIds: f.selectedSupplierIds.includes(id)
        ? f.selectedSupplierIds.filter(s => s !== id)
        : [...f.selectedSupplierIds, id],
    }));

  function getBestQuote(item: RFQItem): RFQQuote | null {
    const withPrices = item.quotes.filter(q => q.unitPrice !== null);
    if (!withPrices.length) return null;
    return withPrices.reduce((best, q) => (q.unitPrice! < best.unitPrice! ? q : best));
  }

  if (loading) return <div className="flex items-center justify-center h-48 text-slate-400">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Appels d'offres</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Demandez des devis à vos fournisseurs et comparez les prix</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvel appel d'offres
        </button>
      </div>

      {/* List */}
      {rfqs.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun appel d'offres</p>
          <p className="text-sm mt-1">Créez-en un pour comparer les prix de vos fournisseurs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rfqs.map(rfq => {
            const isExpanded = expandedId === rfq.id;
            const totalItems = rfq.items.length;
            const quotedItems = rfq.items.filter(item => item.quotes.some(q => q.unitPrice !== null)).length;
            return (
              <div key={rfq.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                {/* RFQ Header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : rfq.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_COLORS[rfq.status]}`}>
                      {STATUS_LABELS[rfq.status]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{rfq.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rfq.suppliers.map(s => s.supplier.name).join(', ')} &bull; {totalItems} produit{totalItems > 1 ? 's' : ''}
                        {rfq.dueDate && ` · Échéance ${new Date(rfq.dueDate).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-xs text-slate-400">{quotedItems}/{totalItems} devis reçus</span>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {rfq.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(rfq, 'sent')}
                          title="Marquer comme envoyé"
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {rfq.status === 'sent' && (
                        <button
                          onClick={() => handleStatusChange(rfq, 'closed')}
                          title="Clôturer"
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(rfq.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700 px-5 py-4 space-y-4">
                    {rfq.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">{rfq.notes}</p>
                    )}
                    {rfq.items.map(item => {
                      const best = getBestQuote(item);
                      return (
                        <div key={item.id} className="border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden">
                          {/* Item header */}
                          <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-2 flex items-center justify-between">
                            <div>
                              <span className="font-medium text-slate-800 dark:text-slate-100">{item.ingredient.name}</span>
                              <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">
                                {item.quantity} {item.ingredient.unit}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400">{item.ingredient.category}</span>
                          </div>
                          {/* Quotes grid */}
                          <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {item.quotes.map(quote => {
                              const isBest = best?.id === quote.id;
                              const isEditing = editingQuote?.quoteId === quote.id;
                              return (
                                <div
                                  key={quote.id}
                                  className={`flex items-center gap-3 px-4 py-2.5 ${isBest && !quote.selected ? 'bg-amber-50 dark:bg-amber-900/10' : ''} ${quote.selected ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
                                >
                                  <div className="w-36 shrink-0">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{quote.supplier.name}</p>
                                    {isBest && !quote.selected && <span className="text-[10px] text-amber-600 font-medium">Meilleur prix</span>}
                                    {quote.selected && <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> Sélectionné</span>}
                                  </div>

                                  {isEditing ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="relative w-28">
                                        <input
                                          type="number" step="0.01" min="0"
                                          value={editingQuote.value}
                                          onChange={e => setEditingQuote(eq => eq ? { ...eq, value: e.target.value } : null)}
                                          placeholder="0.00"
                                          className="w-full pl-7 pr-2 py-1 border border-blue-400 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                                          autoFocus
                                        />
                                        <Euro className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                      </div>
                                      <input
                                        type="text"
                                        value={editingQuote.notes}
                                        onChange={e => setEditingQuote(eq => eq ? { ...eq, notes: e.target.value } : null)}
                                        placeholder="Note (optionnel)"
                                        className="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                                      />
                                      <button onClick={() => handleSaveQuote(rfq.id)} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">OK</button>
                                      <button onClick={() => setEditingQuote(null)} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                  ) : (
                                    <div
                                      className="flex-1 flex items-center gap-3 cursor-pointer"
                                      onClick={() => setEditingQuote({ quoteId: quote.id, value: quote.unitPrice?.toString() ?? '', notes: quote.notes ?? '' })}
                                    >
                                      {quote.unitPrice !== null ? (
                                        <span className={`text-sm font-semibold ${isBest ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                          {quote.unitPrice.toFixed(2)} € / {item.ingredient.unit}
                                        </span>
                                      ) : (
                                        <span className="text-sm text-slate-400 italic">Cliquer pour saisir</span>
                                      )}
                                      {quote.notes && <span className="text-xs text-slate-400">{quote.notes}</span>}
                                    </div>
                                  )}

                                  {quote.unitPrice !== null && !isEditing && (
                                    <div className="flex gap-1 shrink-0">
                                      {!quote.selected ? (
                                        <>
                                          <button
                                            onClick={() => handleSelectQuote(rfq.id, quote.id, false)}
                                            title="Sélectionner ce fournisseur"
                                            className="px-2 py-1 rounded text-xs border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                                          >
                                            Choisir
                                          </button>
                                          <button
                                            onClick={() => handleSelectQuote(rfq.id, quote.id, true)}
                                            title="Choisir et appliquer le prix à l'ingrédient"
                                            className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                                          >
                                            Choisir + Appliquer
                                          </button>
                                        </>
                                      ) : (
                                        <span className="text-xs text-green-600 font-medium">✓ Prix appliqué</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nouvel appel d'offres">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titre *</label>
            <input
              type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Commande légumes semaine 14"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date limite de réponse</label>
            <input
              type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Produits *</label>
              <button onClick={addIngredientRow} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
            {form.selectedIngredients.length === 0 && (
              <p className="text-sm text-slate-400 italic">Aucun produit ajouté</p>
            )}
            <div className="space-y-2">
              {form.selectedIngredients.map((row, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select
                    value={row.ingredientId}
                    onChange={e => setForm(f => {
                      const arr = [...f.selectedIngredients];
                      arr[idx] = { ...arr[idx], ingredientId: parseInt(e.target.value) };
                      return { ...f, selectedIngredients: arr };
                    })}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value={0}>-- Sélectionner --</option>
                    {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
                  </select>
                  <input
                    type="number" min="0" step="0.01" placeholder="Qté"
                    value={row.quantity}
                    onChange={e => setForm(f => {
                      const arr = [...f.selectedIngredients];
                      arr[idx] = { ...arr[idx], quantity: e.target.value };
                      return { ...f, selectedIngredients: arr };
                    })}
                    className="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                  />
                  <button onClick={() => removeIngredientRow(idx)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Suppliers */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fournisseurs *</label>
            {suppliers.length === 0 ? (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                Aucun fournisseur créé. Ajoutez-en dans la section Fournisseurs.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {suppliers.map(s => (
                  <label key={s.id} className="flex items-center gap-2 p-2 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={form.selectedSupplierIds.includes(s.id)}
                      onChange={() => toggleSupplier(s.id)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{s.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} placeholder="Instructions pour les fournisseurs..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium">
              Annuler
            </button>
            <button onClick={handleCreate} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Créer
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Supprimer l'appel d'offres ?"
        message="Cette action est irréversible. Tous les devis associés seront supprimés."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
