import { useState, useEffect, useMemo } from 'react';
import {
  Users, Plus, Shield, ChefHat, Trash2, Mail, Calendar, Search,
  UserPlus, Activity, Crown, CheckSquare, Square, MoreVertical,
  Clock, TrendingUp, Eye, EyeOff, X, ArrowUpDown, Download,
} from 'lucide-react';
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
    'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300',
  ];
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
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
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'role'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBulkActions, setShowBulkActions] = useState(false);

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
      showToast('Le mot de passe doit contenir au moins 6 caracteres', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast('Utilisateur cree avec succes', 'success');
        setShowForm(false);
        setForm({ name: '', email: '', password: '', role: 'chef' });
        loadUsers();
      } else {
        const data = await res.json();
        showToast(data.error || 'Erreur lors de la creation', 'error');
      }
    } catch {
      showToast('Erreur reseau', 'error');
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
        showToast('Utilisateur supprime', 'success');
        setSelectedUsers(prev => {
          const next = new Set(prev);
          next.delete(deleteTarget);
          return next;
        });
        loadUsers();
      } else {
        const data = await res.json();
        showToast(data.error || 'Erreur', 'error');
      }
    } catch {
      showToast('Erreur reseau', 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedUsers).filter(id => id !== user?.id);
    if (ids.length === 0) return;
    for (const id of ids) {
      try {
        await fetch(`${API_BASE}/auth/users/${id}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      } catch {}
    }
    showToast(`${ids.length} utilisateur(s) supprime(s)`, 'success');
    setSelectedUsers(new Set());
    setShowBulkActions(false);
    loadUsers();
  }

  function toggleSelect(id: number) {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  }

  const filteredUsers = useMemo(() => {
    let result = users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return 0;
    });
    return result;
  }, [users, search, sortBy]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    chefs: users.filter(u => u.role === 'chef').length,
    recentWeek: users.filter(u => {
      const diff = Date.now() - new Date(u.createdAt).getTime();
      return diff < 7 * 86400000;
    }).length,
  }), [users]);

  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-20 h-20 rounded-full bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-[#9CA3AF] dark:text-[#737373]" />
        </div>
        <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-2">Acces reserve</h3>
        <p className="text-[#6B7280] dark:text-[#A3A3A3] text-center max-w-sm">
          Seuls les administrateurs peuvent gerer les utilisateurs.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi flex items-center gap-3">
            <Users className="w-7 h-7" />
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-1">
            Gerez votre equipe et les permissions d'acces
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Inviter un membre
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-[#111111] dark:text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{stats.total}</p>
          <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">Membres total</p>
        </div>
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Crown className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{stats.admins}</p>
          <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">Administrateurs</p>
        </div>
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ChefHat className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{stats.chefs}</p>
          <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">Chefs de cuisine</p>
        </div>
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">{stats.recentWeek}</p>
          <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">Nouveaux (7j)</p>
        </div>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white transition-shadow"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(sortBy === 'name' ? 'date' : sortBy === 'date' ? 'role' : 'name')}
            className="flex items-center gap-2 px-3.5 py-2.5 border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-sm text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors bg-white dark:bg-black"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === 'name' ? 'Nom' : sortBy === 'date' ? 'Date' : 'Role'}
          </button>
          <div className="flex border border-[#E5E7EB] dark:border-[#262626] rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2.5 text-sm transition-colors ${viewMode === 'grid' ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' : 'bg-white dark:bg-black text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2.5 text-sm transition-colors ${viewMode === 'list' ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]' : 'bg-white dark:bg-black text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#111111] dark:bg-white rounded-2xl">
          <span className="text-sm font-medium text-white dark:text-[#111111]">
            {selectedUsers.size} selectionne{selectedUsers.size > 1 ? 's' : ''}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setSelectedUsers(new Set())}
            className="text-sm text-white/70 dark:text-[#111111]/70 hover:text-white dark:hover:text-[#111111] transition-colors"
          >
            Deselectionner
          </button>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Supprimer
          </button>
        </div>
      )}

      {/* User Cards Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(u => {
            const isMe = u.id === user?.id;
            const isSelected = selectedUsers.has(u.id);
            return (
              <div
                key={u.id}
                className={`group relative bg-white dark:bg-black border rounded-2xl p-5 transition-all hover:shadow-lg ${
                  isSelected
                    ? 'border-[#111111] dark:border-white ring-1 ring-[#111111] dark:ring-white'
                    : 'border-[#E5E7EB] dark:border-[#262626] hover:border-[#111111]/30 dark:hover:border-white/30'
                }`}
              >
                {/* Selection checkbox */}
                {!isMe && (
                  <button
                    onClick={() => toggleSelect(u.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-[#111111] dark:text-white" />
                    ) : (
                      <Square className="w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
                    )}
                  </button>
                )}
                {isMe && (
                  <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    Vous
                  </span>
                )}

                {/* Avatar + Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${getAvatarColor(u.name)}`}>
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#111111] dark:text-white truncate">{u.name}</h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] truncate flex items-center gap-1.5">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      {u.email}
                    </p>
                  </div>
                </div>

                {/* Role badge + Meta */}
                <div className="flex items-center justify-between">
                  <div>
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        <Shield className="w-3.5 h-3.5" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <ChefHat className="w-3.5 h-3.5" /> Chef
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] dark:text-[#737373]">
                    <Calendar className="w-3 h-3" />
                    {timeAgo(u.createdAt)}
                  </div>
                </div>

                {/* Quick Actions */}
                {!isMe && (
                  <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#262626] flex items-center gap-2">
                    <button
                      onClick={() => setDeleteTarget(u.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl overflow-hidden">
          {/* List Header */}
          <div className="hidden sm:grid grid-cols-[auto_1fr_1fr_120px_100px_80px] gap-4 items-center px-5 py-3 bg-[#F9FAFB] dark:bg-[#0A0A0A] border-b border-[#E5E7EB] dark:border-[#262626]">
            <button onClick={toggleSelectAll} className="w-5 h-5">
              {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
                <CheckSquare className="w-5 h-5 text-[#111111] dark:text-white" />
              ) : (
                <Square className="w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
              )}
            </button>
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373]">Membre</span>
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373]">Email</span>
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373]">Role</span>
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373]">Inscription</span>
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373] text-center">Actions</span>
          </div>
          <div className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
            {filteredUsers.map(u => {
              const isMe = u.id === user?.id;
              const isSelected = selectedUsers.has(u.id);
              return (
                <div
                  key={u.id}
                  className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_120px_100px_80px] gap-3 sm:gap-4 items-center px-5 py-4 transition-colors ${
                    isSelected ? 'bg-[#F3F4F6] dark:bg-[#171717]' : 'hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A]'
                  }`}
                >
                  {/* Checkbox */}
                  <button onClick={() => !isMe && toggleSelect(u.id)} className="hidden sm:block w-5 h-5">
                    {isMe ? (
                      <div className="w-5 h-5" />
                    ) : isSelected ? (
                      <CheckSquare className="w-5 h-5 text-[#111111] dark:text-white" />
                    ) : (
                      <Square className="w-5 h-5 text-[#D1D5DB] dark:text-[#404040]" />
                    )}
                  </button>

                  {/* Name + Avatar */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(u.name)}`}>
                      {getInitials(u.name)}
                    </div>
                    <span className="font-medium text-sm text-[#111111] dark:text-white truncate">
                      {u.name}
                      {isMe && (
                        <span className="ml-2 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          Vous
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Email */}
                  <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3] truncate">{u.email}</span>

                  {/* Role */}
                  <div>
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        <Shield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <ChefHat className="w-3 h-3" /> Chef
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                    {timeAgo(u.createdAt)}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-center">
                    {!isMe && (
                      <button
                        onClick={() => setDeleteTarget(u.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[#D1D5DB] dark:text-[#404040]" />
          </div>
          <p className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Aucun membre trouve</p>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
            {search ? 'Essayez une autre recherche' : 'Invitez votre premier membre'}
          </p>
        </div>
      )}

      {/* Footer count */}
      <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
        {filteredUsers.length} membre{filteredUsers.length > 1 ? 's' : ''}
        {search && ` sur ${users.length}`}
      </p>

      {/* Activity Log Section */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl">
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">Activite recente</h2>
        </div>
        <div className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
          {users.slice(0, 5).map(u => (
            <div key={`activity-${u.id}`} className="px-6 py-3 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(u.name)}`}>
                {getInitials(u.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#111111] dark:text-white">
                  <span className="font-medium">{u.name}</span>{' '}
                  <span className="text-[#6B7280] dark:text-[#A3A3A3]">a rejoint l'equipe</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-[#737373] flex-shrink-0">
                <Clock className="w-3 h-3" />
                {timeAgo(u.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-2xl">
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262626] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">Matrice des permissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#262626]">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#737373]">Permission</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-purple-600 dark:text-purple-400">Admin</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Chef</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262626]">
              {[
                { label: 'Voir le tableau de bord', admin: true, chef: true },
                { label: 'Gerer les ingredients', admin: true, chef: true },
                { label: 'Gerer les recettes', admin: true, chef: true },
                { label: 'Voir les rapports financiers', admin: true, chef: false },
                { label: 'Gerer les utilisateurs', admin: true, chef: false },
                { label: 'Parametres du restaurant', admin: true, chef: false },
                { label: 'Exporter les donnees', admin: true, chef: false },
                { label: 'Facturation & abonnement', admin: true, chef: false },
              ].map((perm, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A] transition-colors">
                  <td className="px-6 py-3 text-[#111111] dark:text-white">{perm.label}</td>
                  <td className="px-6 py-3 text-center">
                    {perm.admin ? (
                      <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </span>
                    ) : (
                      <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#F3F4F6] dark:bg-[#171717]">
                        <X className="w-3.5 h-3.5 text-[#D1D5DB] dark:text-[#404040]" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {perm.chef ? (
                      <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </span>
                    ) : (
                      <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#F3F4F6] dark:bg-[#171717]">
                        <X className="w-3.5 h-3.5 text-[#D1D5DB] dark:text-[#404040]" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Inviter un nouveau membre">
        <form onSubmit={handleCreateUser} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#111111] dark:text-white mb-1.5">Nom complet</label>
            <input
              required
              placeholder="Ex: Jean Dupont"
              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white transition-shadow"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] dark:text-white mb-1.5">Adresse email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input
                required
                type="email"
                placeholder="jean@restaurant.fr"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white transition-shadow"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] dark:text-white mb-1.5">Mot de passe (min. 6 car.)</label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 pr-11 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white transition-shadow"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] dark:text-white mb-3">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'chef' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  form.role === 'chef'
                    ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#0A0A0A]'
                    : 'border-[#E5E7EB] dark:border-[#262626] hover:border-[#111111]/30 dark:hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#111111] dark:text-white">Chef de cuisine</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">Acces recettes et ingredients</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'admin' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  form.role === 'admin'
                    ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#0A0A0A]'
                    : 'border-[#E5E7EB] dark:border-[#262626] hover:border-[#111111]/30 dark:hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#111111] dark:text-white">Administrateur</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">Acces complet au systeme</p>
                </div>
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#262626]">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#E5E7EB] dark:border-[#262626] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E7EB] transition-colors"
            >
              Creer le compte
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Supprimer l'utilisateur"
        message="Etes-vous sur de vouloir supprimer cet utilisateur ? Cette action est irreversible."
      />
    </div>
  );
}
