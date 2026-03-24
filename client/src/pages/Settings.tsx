import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Building2, Calculator, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companySiret: string;
  tvaRate: number;
  defaultLaborCost: number;
  marginObjective: number;
  coefficientObjective: number;
  currency: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companySiret: '',
  tvaRate: 10,
  defaultLaborCost: 15,
  marginObjective: 70,
  coefficientObjective: 3.3,
  currency: 'EUR',
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem('restaumargin_settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem('restaumargin_settings', JSON.stringify(settings));
}

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [hasChanges, setHasChanges] = useState(false);

  function handleChange(key: keyof AppSettings, value: string | number) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  function handleSave() {
    saveSettings(settings);
    setHasChanges(false);
    showToast('Paramètres sauvegardés avec succès', 'success');
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" />
          Paramètres
        </h2>
        {hasChanges && (
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Sauvegarder
          </button>
        )}
      </div>

      {/* Company Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b dark:border-slate-700 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Informations entreprise</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Nom de l'établissement</label>
            <input
              className="input w-full"
              value={settings.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Mon Restaurant"
            />
          </div>
          <div>
            <label className="label">Adresse</label>
            <input
              className="input w-full"
              value={settings.companyAddress}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              placeholder="123 Rue de la Cuisine, 75001 Paris"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Téléphone</label>
              <input
                className="input w-full"
                value={settings.companyPhone}
                onChange={(e) => handleChange('companyPhone', e.target.value)}
                placeholder="01 23 45 67 89"
              />
            </div>
            <div>
              <label className="label">N° SIRET</label>
              <input
                className="input w-full"
                value={settings.companySiret}
                onChange={(e) => handleChange('companySiret', e.target.value)}
                placeholder="123 456 789 00012"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Parameters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b dark:border-slate-700 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Paramètres de calcul</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Taux de TVA (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                className="input w-full"
                value={settings.tvaRate}
                onChange={(e) => handleChange('tvaRate', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-slate-400 mt-1">Restauration sur place : 10% | Vente à emporter : 5.5%</p>
            </div>
            <div>
              <label className="label">Coût main d'oeuvre par défaut (&euro;/h)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="input w-full"
                value={settings.defaultLaborCost}
                onChange={(e) => handleChange('defaultLaborCost', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-slate-400 mt-1">Appliqué par défaut aux nouvelles recettes</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Objectif de marge (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                className="input w-full"
                value={settings.marginObjective}
                onChange={(e) => handleChange('marginObjective', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-slate-400 mt-1">Référence pour les indicateurs de couleur</p>
            </div>
            <div>
              <label className="label">Objectif de coefficient</label>
              <input
                type="number"
                step="0.1"
                min="0"
                className="input w-full"
                value={settings.coefficientObjective}
                onChange={(e) => handleChange('coefficientObjective', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-slate-400 mt-1">Référence : x3.3 minimum recommandé</p>
            </div>
          </div>
          <div>
            <label className="label">Devise</label>
            <select
              className="input w-48"
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              <option value="EUR">Euro (&euro;)</option>
              <option value="USD">Dollar ($)</option>
              <option value="GBP">Livre (&pound;)</option>
              <option value="CHF">Franc suisse (CHF)</option>
              <option value="MAD">Dirham (MAD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b dark:border-slate-700 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Mon compte</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nom</label>
              <div className="input w-full bg-slate-50 dark:bg-slate-700 cursor-not-allowed">{user?.name}</div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="input w-full bg-slate-50 dark:bg-slate-700 cursor-not-allowed">{user?.email}</div>
            </div>
            <div>
              <label className="label">Rôle</label>
              <div className="input w-full bg-slate-50 dark:bg-slate-700 cursor-not-allowed">
                {user?.role === 'admin' ? 'Administrateur' : 'Chef de cuisine'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={handleReset} className="btn-secondary text-sm">
          Réinitialiser les paramètres
        </button>
        {hasChanges && (
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Sauvegarder
          </button>
        )}
      </div>
    </div>
  );
}
