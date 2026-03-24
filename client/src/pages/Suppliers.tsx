import { useState, useEffect, useMemo } from 'react';
import { Truck, Package, TrendingUp, Search } from 'lucide-react';
import { fetchIngredients } from '../services/api';
import type { Ingredient } from '../types';

interface SupplierData {
  name: string;
  ingredientCount: number;
  ingredients: Ingredient[];
  categories: string[];
  avgPrice: number;
  totalValue: number;
}

export default function Suppliers() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  useEffect(() => {
    fetchIngredients()
      .then(setIngredients)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const suppliers = useMemo(() => {
    const map = new Map<string, SupplierData>();

    ingredients.forEach((ing) => {
      const supplierName = ing.supplier || 'Sans fournisseur';
      const existing = map.get(supplierName) || {
        name: supplierName,
        ingredientCount: 0,
        ingredients: [],
        categories: [],
        avgPrice: 0,
        totalValue: 0,
      };
      existing.ingredientCount++;
      existing.ingredients.push(ing);
      existing.totalValue += ing.pricePerUnit;
      if (!existing.categories.includes(ing.category)) {
        existing.categories.push(ing.category);
      }
      map.set(supplierName, existing);
    });

    return Array.from(map.values())
      .map((s) => ({ ...s, avgPrice: s.totalValue / s.ingredientCount }))
      .sort((a, b) => b.ingredientCount - a.ingredientCount);
  }, [ingredients]);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedData = selectedSupplier
    ? suppliers.find((s) => s.name === selectedSupplier)
    : null;

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Fournisseurs</h2>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {suppliers.length} fournisseur{suppliers.length > 1 ? 's' : ''} &bull; {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Fournisseurs</span>
            <div className="p-2 rounded-lg bg-blue-600"><Truck className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{suppliers.filter((s) => s.name !== 'Sans fournisseur').length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Produits référencés</span>
            <div className="p-2 rounded-lg bg-green-600"><Package className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{ingredients.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Prix moyen</span>
            <div className="p-2 rounded-lg bg-purple-600"><TrendingUp className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {ingredients.length > 0 ? (ingredients.reduce((s, i) => s + i.pricePerUnit, 0) / ingredients.length).toFixed(2) : '0.00'} &euro;
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Sans fournisseur</span>
            <div className="p-2 rounded-lg bg-amber-500"><Package className="w-5 h-5 text-white" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {ingredients.filter((i) => !i.supplier).length}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher un fournisseur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Suppliers List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow divide-y dark:divide-slate-700">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400">Aucun fournisseur trouvé</div>
            ) : (
              filtered.map((supplier) => (
                <button
                  key={supplier.name}
                  onClick={() => setSelectedSupplier(supplier.name)}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    selectedSupplier === supplier.name ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {supplier.name === 'Sans fournisseur' ? (
                          <span className="text-slate-400 italic">{supplier.name}</span>
                        ) : supplier.name}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {supplier.ingredientCount} produit{supplier.ingredientCount > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {supplier.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                          {cat}
                        </span>
                      ))}
                      {supplier.categories.length > 2 && (
                        <span className="text-[10px] text-slate-400">+{supplier.categories.length - 2}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Supplier Detail */}
        <div className="lg:col-span-2">
          {selectedData ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="px-5 py-4 border-b dark:border-slate-700">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  {selectedData.name}
                </h3>
                <div className="flex gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  <span>{selectedData.ingredientCount} produit{selectedData.ingredientCount > 1 ? 's' : ''}</span>
                  <span>Prix moyen : {selectedData.avgPrice.toFixed(2)} &euro;</span>
                  <span>Catégories : {selectedData.categories.join(', ')}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium">Produit</th>
                      <th className="px-5 py-3 text-left font-medium">Catégorie</th>
                      <th className="px-5 py-3 text-right font-medium">Prix unitaire</th>
                      <th className="px-5 py-3 text-center font-medium">Unité</th>
                      <th className="px-5 py-3 text-left font-medium">Allergènes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {selectedData.ingredients.map((ing) => (
                      <tr key={ing.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">{ing.name}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{ing.category}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{ing.pricePerUnit.toFixed(2)} &euro;</td>
                        <td className="px-5 py-3 text-center text-slate-600 dark:text-slate-400">{ing.unit}</td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(ing.allergens || []).map((a) => (
                              <span key={a} className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">{a}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
              <Truck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-400 dark:text-slate-500">Sélectionnez un fournisseur pour voir ses produits</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
