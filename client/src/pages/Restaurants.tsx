import { useState } from 'react';
import { Building2, MapPin, Phone, Users, Euro, Plus, Edit, Trash2, Check, ChefHat, ClipboardList, TrendingUp } from 'lucide-react';
import { useRestaurant, type Restaurant } from '../hooks/useRestaurant';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

interface RestaurantFormData {
  nom: string;
  adresse: string;
  typeCuisine: string;
  telephone: string;
  couvertsJour: number;
}

const EMPTY_FORM: RestaurantFormData = {
  nom: '',
  adresse: '',
  typeCuisine: '',
  telephone: '',
  couvertsJour: 0,
};

export default function Restaurants() {
  const { restaurants, selectedRestaurant, switchRestaurant, addRestaurant, updateRestaurant, removeRestaurant } = useRestaurant();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RestaurantFormData>(EMPTY_FORM);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(r: Restaurant) {
    setEditingId(r.id);
    setForm({
      nom: r.nom,
      adresse: r.adresse,
      typeCuisine: r.typeCuisine,
      telephone: r.telephone,
      couvertsJour: r.couvertsJour,
    });
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) {
      showToast('Le nom du restaurant est requis', 'error');
      return;
    }
    if (editingId) {
      updateRestaurant(editingId, { ...form });
      showToast('Restaurant mis à jour', 'success');
    } else {
      addRestaurant(form);
      showToast('Restaurant ajouté avec succès', 'success');
    }
    setShowModal(false);
  }

  function handleDelete(id: string, nom: string) {
    if (restaurants.length <= 1) {
      showToast('Vous devez avoir au moins un restaurant', 'error');
      return;
    }
    removeRestaurant(id);
    showToast(`"${nom}" supprimé`, 'info');
  }

  function formatEuro(n: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Mes Restaurants</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos établissements et basculez entre eux
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter un restaurant
        </button>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((r) => {
          const isSelected = selectedRestaurant?.id === r.id;
          return (
            <div
              key={r.id}
              onClick={() => switchRestaurant(r.id)}
              className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-medium">
                  <Check className="w-3 h-3" />
                  Actif
                </div>
              )}

              <div className="p-5">
                {/* Top row: name + actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      <Building2 className={`w-5 h-5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{r.nom}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {r.typeCuisine}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEdit(r)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.nom)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {r.adresse}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {r.telephone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    {r.couvertsJour} couverts/jour
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-0.5">
                      <ClipboardList className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{r.recettesCount}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Recettes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{r.margeMoyenne}%</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Marge moy.</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-slate-400 dark:text-slate-500 mb-0.5">
                      <Euro className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatEuro(r.caEstimeMensuel)}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">CA mensuel</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier le restaurant' : 'Ajouter un restaurant'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom du restaurant *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: Le Bistrot de Youssef"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="25 rue de la Paix, Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type de cuisine</label>
              <div className="relative">
                <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={form.typeCuisine}
                  onChange={(e) => setForm({ ...form, typeCuisine: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Cuisine française"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="01 42 00 00 00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Couverts par jour</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                min={0}
                value={form.couvertsJour || ''}
                onChange={(e) => setForm({ ...form, couvertsJour: parseInt(e.target.value) || 0 })}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="80"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
