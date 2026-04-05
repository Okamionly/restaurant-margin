import { useState, useEffect } from 'react';
import { Users, Plus, Shield, ChefHat, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useTranslation } from '../hooks/useTranslation';

interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export default function UserManagement() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'chef' });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Utilisateur créé avec succès', 'success');
        setShowForm(false);
        setForm({ name: '', email: '', password: '', role: 'chef' });
        loadUsers();
      } else {
        const data = await res.json();
        showToast(data.error || 'Erreur lors de la création', 'error');
      }
    } catch {
      showToast('Erreur réseau', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_BASE}/auth/users/${deleteTarget}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('Utilisateur supprimé', 'success');
        loadUsers();
      } else {
        const data = await res.json();
        showToast(data.error || 'Erreur', 'error');
      }
    } catch {
      showToast('Erreur réseau', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <Shield className="w-16 h-16 mx-auto text-[#6B7280] dark:text-[#A3A3A3] mb-4" />
        <h3 className="text-xl font-semibold text-[#6B7280] dark:text-[#A3A3A3] mb-2">Accès réservé</h3>
        <p className="text-[#9CA3AF] dark:text-[#737373]">Seuls les administrateurs peuvent gérer les utilisateurs.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">Chargement...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
          <Users className="w-7 h-7" />
          Gestion des utilisateurs
        </h2>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3]">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Nom</th>
                <th className="px-5 py-3 text-left font-medium">Email</th>
                <th className="px-5 py-3 text-center font-medium">Rôle</th>
                <th className="px-5 py-3 text-left font-medium">Inscrit le</th>
                <th className="px-5 py-3 text-center font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAFAFA] dark:bg-[#0A0A0A] dark:hover:bg-[#171717]/50">
                  <td className="px-5 py-3 font-medium text-[#111111] dark:text-white">{u.name}</td>
                  <td className="px-5 py-3 text-[#6B7280] dark:text-[#A3A3A3]">{u.email}</td>
                  <td className="px-5 py-3 text-center">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        <ChefHat className="w-3 h-3" /> Chef
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#9CA3AF] dark:text-[#737373]">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {u.id !== user?.id && (
                      <button
                        onClick={() => setDeleteTarget(u.id)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-3">{users.length} utilisateur{users.length > 1 ? 's' : ''}</p>

      {/* Create User Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Nouvel utilisateur">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="label">Nom complet *</label>
            <input required className="input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email *</label>
            <input required type="email" className="input w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Mot de passe * (min. 6 caractères)</label>
            <input required type="password" minLength={6} className="input w-full" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label">Rôle</label>
            <select className="input w-full" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="chef">Chef de cuisine</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary">Créer l'utilisateur</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
      />
    </div>
  );
}
