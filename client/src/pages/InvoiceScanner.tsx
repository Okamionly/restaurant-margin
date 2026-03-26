import { useState, useEffect, useCallback } from 'react';
import { FileText, Upload, Check, X, Plus, Search, Euro, Receipt, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/* ─── Types ─── */

interface InvoiceItem {
  id?: number;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  ingredientId?: number | null;
}

interface Invoice {
  id: number;
  supplierName: string;
  invoiceNumber: string;
  date: string;
  totalHT: number;
  totalTTC: number;
  status: 'pending' | 'processed';
  items: InvoiceItem[];
  createdAt: string;
}

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  pricePerUnit: number;
  category: string;
}

/* ─── Empty form helpers ─── */

const emptyItem = (): InvoiceItem => ({
  productName: '',
  quantity: 0,
  unit: 'kg',
  unitPrice: 0,
  total: 0,
});

const emptyForm = () => ({
  supplierName: '',
  invoiceNumber: '',
  date: new Date().toISOString().slice(0, 10),
  totalHT: 0,
  totalTTC: 0,
  items: [emptyItem()],
});

/* ─── OCR simple parser ─── */

function parseOCRText(raw: string): InvoiceItem[] {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: InvoiceItem[] = [];

  for (const line of lines) {
    // Try pattern: product name ... qty unit ... price ... total
    // e.g. "Tomates grappe   5 kg   2.50   12.50"
    const match = line.match(
      /^(.+?)\s+([\d.,]+)\s*(kg|g|L|l|cl|ml|pce|pièce|unit[eé]|botte|bouteille|paquet|sac|barquette|lot)s?\s+([\d.,]+)\s+([\d.,]+)\s*$/i
    );
    if (match) {
      const qty = parseFloat(match[2].replace(',', '.'));
      const price = parseFloat(match[4].replace(',', '.'));
      const total = parseFloat(match[5].replace(',', '.'));
      items.push({
        productName: match[1].trim(),
        quantity: qty,
        unit: match[3].toLowerCase(),
        unitPrice: price,
        total,
      });
      continue;
    }

    // Simpler pattern: product   price
    const simple = line.match(/^(.+?)\s+([\d.,]+)\s*[€]?\s*$/);
    if (simple) {
      const total = parseFloat(simple[2].replace(',', '.'));
      items.push({
        productName: simple[1].trim(),
        quantity: 1,
        unit: 'pce',
        unitPrice: total,
        total,
      });
    }
  }
  return items;
}

/* ─── Component ─── */

export default function InvoiceScanner() {
  const { showToast } = useToast();

  /* State */
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  /* Match state: invoiceId -> item index -> ingredientId */
  const [matchingInvoiceId, setMatchingInvoiceId] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number | null>>({});
  const [applying, setApplying] = useState(false);

  /* ─── Fetch data ─── */

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/invoices`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInvoices(data);
    } catch {
      showToast('Erreur chargement factures', 'error');
    }
  }, [showToast]);

  const fetchIngredients = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/ingredients`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIngredients(data);
    } catch {
      showToast('Erreur chargement ingrédients', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    Promise.all([fetchInvoices(), fetchIngredients()]).finally(() => setLoading(false));
  }, [fetchInvoices, fetchIngredients]);

  /* ─── Form helpers ─── */

  const updateItem = (idx: number, field: keyof InvoiceItem, value: string | number) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[idx] = { ...items[idx], [field]: value };
      // Auto-calc total
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? Number(value) : items[idx].quantity;
        const price = field === 'unitPrice' ? Number(value) : items[idx].unitPrice;
        items[idx].total = Math.round(qty * price * 100) / 100;
      }
      return { ...prev, items };
    });
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  };

  const removeItemRow = (idx: number) => {
    setForm((prev) => {
      const items = prev.items.filter((_, i) => i !== idx);
      return { ...prev, items: items.length ? items : [emptyItem()] };
    });
  };

  /* ─── OCR parse ─── */

  const handleParseOCR = () => {
    if (!ocrText.trim()) {
      showToast('Collez du texte avant de parser', 'error');
      return;
    }
    const parsed = parseOCRText(ocrText);
    if (parsed.length === 0) {
      showToast('Aucune ligne produit détectée', 'error');
      return;
    }
    setForm((prev) => ({ ...prev, items: parsed }));
    showToast(`${parsed.length} ligne(s) extraite(s)`, 'success');
  };

  /* ─── CRUD ─── */

  const handleSubmit = async () => {
    if (!form.supplierName.trim()) {
      showToast('Nom du fournisseur requis', 'error');
      return;
    }
    if (form.items.every((it) => !it.productName.trim())) {
      showToast('Ajoutez au moins un produit', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/invoices`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast('Facture enregistrée', 'success');
      setShowForm(false);
      setForm(emptyForm());
      setOcrText('');
      fetchInvoices();
    } catch {
      showToast('Erreur enregistrement facture', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/invoices/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      showToast('Facture supprimée', 'success');
      fetchInvoices();
    } catch {
      showToast('Erreur suppression', 'error');
    }
  };

  /* ─── Match & Apply ─── */

  const openMatching = (invoice: Invoice) => {
    setMatchingInvoiceId(invoice.id);
    const initial: Record<number, number | null> = {};
    invoice.items.forEach((item, idx) => {
      // Auto-match by name similarity
      const found = ingredients.find(
        (ing) => ing.name.toLowerCase() === item.productName.toLowerCase()
      );
      initial[idx] = found ? found.id : (item.ingredientId ?? null);
    });
    setMatches(initial);
  };

  const handleApply = async () => {
    if (!matchingInvoiceId) return;
    const invoice = invoices.find((inv) => inv.id === matchingInvoiceId);
    if (!invoice) return;

    const matchPayload = invoice.items.map((item, idx) => ({
      itemId: item.id,
      ingredientId: matches[idx] ?? null,
      unitPrice: item.unitPrice,
    })).filter((m) => m.ingredientId !== null);

    if (matchPayload.length === 0) {
      showToast('Aucune correspondance sélectionnée', 'error');
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`${API}/api/invoices/${matchingInvoiceId}/apply`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ matches: matchPayload }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      showToast(`${data.updated ?? matchPayload.length} prix mis à jour`, 'success');
      setMatchingInvoiceId(null);
      setMatches({});
      fetchInvoices();
      fetchIngredients();
    } catch {
      showToast('Erreur application des prix', 'error');
    } finally {
      setApplying(false);
    }
  };

  /* ─── Filtered invoices ─── */

  const filtered = invoices.filter((inv) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.supplierName.toLowerCase().includes(q) ||
      inv.invoiceNumber.toLowerCase().includes(q)
    );
  });

  const matchingInvoice = invoices.find((inv) => inv.id === matchingInvoiceId) ?? null;

  /* ─── Render ─── */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-blue-500" />
            Scanner de factures
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Saisissez vos factures fournisseurs et mettez à jour les prix ingrédients
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm()); setOcrText(''); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par fournisseur ou n° facture..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Invoice list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Aucune facture</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Cliquez sur &quot;Nouvelle facture&quot; pour commencer
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Fournisseur</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">N° Facture</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Total HT</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-right">Total TTC</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-center">Lignes</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-center">Statut</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{inv.supplierName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{inv.invoiceNumber || '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {new Date(inv.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 dark:text-slate-100 font-mono">
                      {inv.totalHT.toFixed(2)} &euro;
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 dark:text-slate-100 font-mono">
                      {inv.totalTTC.toFixed(2)} &euro;
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                      {inv.items?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.status === 'processed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          <Check className="w-3 h-3" /> Traité
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openMatching(inv)}
                          title="Matcher et appliquer les prix"
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                        >
                          <Euro className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          title="Supprimer"
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition"
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
        </div>
      )}

      {/* ─── New invoice modal ─── */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nouvelle facture fournisseur">
        <div className="space-y-5">
          {/* Header fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fournisseur *
              </label>
              <input
                type="text"
                value={form.supplierName}
                onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
                placeholder="Nom du fournisseur"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                N° Facture
              </label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))}
                placeholder="FAC-2024-001"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total HT
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.totalHT || ''}
                  onChange={(e) => setForm((f) => ({ ...f, totalHT: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total TTC
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.totalTTC || ''}
                  onChange={(e) => setForm((f) => ({ ...f, totalTTC: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* OCR zone */}
          <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Zone OCR — collez le texte scanné
              </span>
            </div>
            <textarea
              rows={4}
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
              placeholder={"Tomates grappe   5 kg   2.50   12.50\nOignons jaunes   3 kg   1.80   5.40\nHuile olive   2 L   8.50   17.00"}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleParseOCR}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition font-medium"
            >
              <Search className="w-3.5 h-3.5" />
              Parser le texte
            </button>
          </div>

          {/* Item rows */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Lignes produits
              </h4>
              <button
                onClick={addItemRow}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {form.items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_70px_70px_80px_80px_32px] gap-2 items-center"
                >
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                    placeholder="Produit"
                    className="px-2.5 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="Qté"
                    className="px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                    placeholder="Unité"
                    className="px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="P.U."
                    className="px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-sm font-mono text-right text-slate-700 dark:text-slate-300 pr-1">
                    {item.total.toFixed(2)} &euro;
                  </div>
                  <button
                    onClick={() => removeItemRow(idx)}
                    className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 hover:text-red-600 transition"
                    title="Supprimer la ligne"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Computed sum */}
            <div className="mt-3 text-right text-sm text-slate-600 dark:text-slate-400">
              Sous-total lignes :{' '}
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                {form.items.reduce((s, it) => s + it.total, 0).toFixed(2)} &euro;
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Match & Apply modal ─── */}
      <Modal
        isOpen={matchingInvoiceId !== null}
        onClose={() => { setMatchingInvoiceId(null); setMatches({}); }}
        title="Correspondance produits → ingrédients"
      >
        {matchingInvoice && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Facture <span className="font-medium text-slate-700 dark:text-slate-200">{matchingInvoice.supplierName}</span>
              {matchingInvoice.invoiceNumber && ` — ${matchingInvoice.invoiceNumber}`}
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {matchingInvoice.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.quantity} {item.unit} &times; {item.unitPrice.toFixed(2)} &euro; = {item.total.toFixed(2)} &euro;
                    </p>
                  </div>
                  <div className="relative sm:w-56">
                    <select
                      value={matches[idx] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : null;
                        setMatches((prev) => ({ ...prev, [idx]: val }));
                      }}
                      className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">— Non associé —</option>
                      {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} ({ing.unit} — {ing.pricePerUnit.toFixed(2)} &euro;)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {Object.values(matches).filter(Boolean).length} / {matchingInvoice.items.length} associé(s)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setMatchingInvoiceId(null); setMatches({}); }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
                >
                  {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Euro className="w-4 h-4" />}
                  Appliquer les prix
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
