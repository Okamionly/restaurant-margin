import { useState, useEffect, useMemo } from 'react';
import { Truck, Package, TrendingUp, Search, ExternalLink, Check, X, Filter, Globe, MapPin, Tag, Building2 } from 'lucide-react';
import { fetchIngredients } from '../services/api';
import type { Ingredient } from '../types';
import {
  FRENCH_SUPPLIERS,
  FRENCH_REGIONS,
  SUPPLIER_CATEGORIES,
  searchSuppliers,
  getSuppliersByRegion,
  getSuppliersByCategory,
} from '../data/frenchSuppliers';
import type { FrenchSupplier } from '../data/frenchSuppliers';

interface SupplierData {
  name: string;
  ingredientCount: number;
  ingredients: Ingredient[];
  categories: string[];
  avgPrice: number;
  totalValue: number;
}

const TYPE_COLORS: Record<FrenchSupplier['type'], { bg: string; text: string; label: string }> = {
  grossiste: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', label: 'Grossiste' },
  specialiste: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', label: 'Spécialiste' },
  local: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', label: 'Local' },
  national: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', label: 'National' },
};

type TabId = 'mes-fournisseurs' | 'annuaire';

export default function Suppliers() {
  const [activeTab, setActiveTab] = useState<TabId>('mes-fournisseurs');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  // Annuaire filters
  const [annuaireSearch, setAnnuaireSearch] = useState('');
  const [annuaireRegion, setAnnuaireRegion] = useState('');
  const [annuaireCategory, setAnnuaireCategory] = useState('');
  const [annuaireType, setAnnuaireType] = useState<'' | FrenchSupplier['type']>('');
  const [deliveryOnly, setDeliveryOnly] = useState(false);

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

  // Annuaire filtered results
  const annuaireResults = useMemo(() => {
    let results = searchSuppliers(
      annuaireSearch || undefined,
      annuaireRegion || undefined,
      undefined,
      annuaireCategory || undefined
    );

    if (annuaireType) {
      results = results.filter((s) => s.type === annuaireType);
    }

    if (deliveryOnly) {
      results = results.filter((s) => s.delivery);
    }

    return results;
  }, [annuaireSearch, annuaireRegion, annuaireCategory, annuaireType, deliveryOnly]);

  const annuaireStats = useMemo(() => {
    const withDelivery = annuaireResults.filter((s) => s.delivery).length;
    const byType = annuaireResults.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total: annuaireResults.length, withDelivery, byType };
  }, [annuaireResults]);

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Fournisseurs</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('mes-fournisseurs')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'mes-fournisseurs'
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Truck className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Mes fournisseurs
        </button>
        <button
          onClick={() => setActiveTab('annuaire')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'annuaire'
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Globe className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
          Annuaire fournisseurs France
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB: Mes fournisseurs */}
      {/* ============================================================== */}
      {activeTab === 'mes-fournisseurs' && (
        <>
          <div className="flex gap-3 items-center mb-6">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {suppliers.length} fournisseur{suppliers.length > 1 ? 's' : ''} &bull; {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''}
            </span>
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
        </>
      )}

      {/* ============================================================== */}
      {/* TAB: Annuaire fournisseurs France */}
      {/* ============================================================== */}
      {activeTab === 'annuaire' && (
        <>
          {/* Stats bar */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {annuaireStats.total} fournisseur{annuaireStats.total > 1 ? 's' : ''} trouvé{annuaireStats.total > 1 ? 's' : ''}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
              {annuaireStats.withDelivery} avec livraison
            </span>
            {Object.entries(annuaireStats.byType).map(([type, count]) => {
              const tc = TYPE_COLORS[type as FrenchSupplier['type']];
              return (
                <span key={type} className={`px-3 py-1.5 rounded-full ${tc.bg} ${tc.text} font-medium`}>
                  {count} {tc.label.toLowerCase()}{count > 1 ? 's' : ''}
                </span>
              );
            })}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Filter className="w-4 h-4" />
              Filtres
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={annuaireSearch}
                  onChange={(e) => setAnnuaireSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>

              {/* Region */}
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={annuaireRegion}
                  onChange={(e) => setAnnuaireRegion(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Toutes les régions</option>
                  {FRENCH_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={annuaireCategory}
                  onChange={(e) => setAnnuaireCategory(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Toutes catégories</option>
                  {SUPPLIER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={annuaireType}
                  onChange={(e) => setAnnuaireType(e.target.value as '' | FrenchSupplier['type'])}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Tous types</option>
                  <option value="grossiste">Grossiste</option>
                  <option value="specialiste">Spécialiste</option>
                  <option value="local">Local</option>
                  <option value="national">National</option>
                </select>
              </div>

              {/* Delivery toggle */}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deliveryOnly}
                  onChange={(e) => setDeliveryOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <Truck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Livraison uniquement</span>
              </label>
            </div>
          </div>

          {/* Supplier Cards Grid */}
          {annuaireResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-400 dark:text-slate-500">Aucun fournisseur ne correspond à vos critères</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {annuaireResults.map((supplier) => {
                const tc = TYPE_COLORS[supplier.type];
                return (
                  <div
                    key={supplier.name}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow p-5 flex flex-col"
                  >
                    {/* Header: Name + Type badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                        {supplier.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${tc.bg} ${tc.text}`}>
                        {tc.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {supplier.description}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Speciality */}
                    {supplier.speciality && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 italic">
                        {supplier.speciality}
                      </p>
                    )}

                    {/* Regions */}
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-3 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">
                        {supplier.regions.length === FRENCH_REGIONS.length
                          ? 'Toute la France'
                          : supplier.regions.join(', ')}
                      </span>
                    </div>

                    {/* Footer details */}
                    <div className="mt-auto pt-3 border-t dark:border-slate-700 flex flex-wrap items-center gap-3 text-xs">
                      {/* Delivery */}
                      <span className={`flex items-center gap-1 ${supplier.delivery ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {supplier.delivery ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        Livraison
                      </span>

                      {/* Min order */}
                      {supplier.minOrder && (
                        <span className="text-slate-500 dark:text-slate-400">
                          Min: {supplier.minOrder}
                        </span>
                      )}

                      {/* Website */}
                      {supplier.website && (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
