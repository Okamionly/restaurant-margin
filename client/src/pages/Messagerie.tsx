import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mail, Send, Search, Reply, Trash2, RefreshCw, Inbox, Star,
  Loader2, Plus, X, Paperclip, ArrowLeft, StarOff,
  Circle, Users, ChefHat, Truck, MessageSquare,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'order';
  isNew?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  email: string;
  subject: string;
  isGroup: boolean;
  members: string[];
  avatar: string;
  starred: boolean;
  messages: Message[];
  unread: number;
  lastMessage?: string;
  updatedAt?: string;
  category?: 'fournisseur' | 'equipe' | 'client';
  online?: boolean;
}

// ── Mock data (fallback si API indisponible) ─────────────────────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'mock-1',
    name: 'Metro Cash & Carry',
    email: 'commandes@metro.fr',
    subject: 'Commande viandes semaine 14',
    isGroup: false,
    members: ['commandes@metro.fr'],
    avatar: 'MC',
    starred: true,
    unread: 3,
    category: 'fournisseur',
    online: true,
    lastMessage: 'Votre commande #4821 a bien été reçue. Livraison prévue demain matin.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    messages: [
      {
        id: 'm1-1',
        senderId: 'metro',
        senderName: 'Metro Cash & Carry',
        text: 'Bonjour, votre commande hebdomadaire de viandes est disponible. Souhaitez-vous confirmer pour la livraison de demain matin entre 7h et 9h ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        type: 'text',
      },
      {
        id: 'm1-2',
        senderId: 'me',
        senderName: 'RestauMargin',
        text: 'Oui, confirmé. Pouvez-vous ajouter 5 kg de filet de bœuf supplémentaires sur la commande ?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        read: true,
        type: 'text',
      },
      {
        id: 'm1-3',
        senderId: 'metro',
        senderName: 'Metro Cash & Carry',
        text: 'Votre commande #4821 a bien été reçue. Livraison prévue demain matin.',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        read: false,
        type: 'text',
      },
    ],
  },
  {
    id: 'mock-2',
    name: 'Transgourmet',
    email: 'pro@transgourmet.fr',
    subject: 'Tarifs poissons printemps',
    isGroup: false,
    members: ['pro@transgourmet.fr'],
    avatar: 'TG',
    starred: false,
    unread: 1,
    category: 'fournisseur',
    online: false,
    lastMessage: 'Nouveaux tarifs poissons disponibles pour Q2. Voir PDF joint.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    messages: [
      {
        id: 'm2-1',
        senderId: 'trans',
        senderName: 'Transgourmet',
        text: 'Bonjour, veuillez trouver ci-joint notre grille tarifaire mise à jour pour les produits de la mer au printemps 2026.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: false,
        type: 'text',
      },
    ],
  },
  {
    id: 'mock-3',
    name: 'Équipe cuisine',
    email: '',
    subject: 'Planning semaine',
    isGroup: true,
    members: ['chef@resto.fr', 'sousChef@resto.fr', 'commis1@resto.fr'],
    avatar: 'EC',
    starred: false,
    unread: 0,
    category: 'equipe',
    online: true,
    lastMessage: 'Réunion briefing à 10h30 avant le service du midi.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    messages: [
      {
        id: 'm3-1',
        senderId: 'chef',
        senderName: 'Chef Marco',
        text: 'Team, réunion briefing à 10h30 avant le service du midi. On revoit les plats du jour et les allergènes.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        read: true,
        type: 'text',
      },
      {
        id: 'm3-2',
        senderId: 'me',
        senderName: 'RestauMargin',
        text: "Ok, j'y serai. Je prépare le rapport des coûts matières de la semaine.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
        read: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'mock-4',
    name: 'Pomona Episaveurs',
    email: 'service-client@pomona.fr',
    subject: 'Légumes BIO semaine 15',
    isGroup: false,
    members: ['service-client@pomona.fr'],
    avatar: 'PE',
    starred: false,
    unread: 0,
    category: 'fournisseur',
    online: false,
    lastMessage: "Facture #2026-0412 disponible dans votre espace client.",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        id: 'm4-1',
        senderId: 'pomona',
        senderName: 'Pomona Episaveurs',
        text: "Facture #2026-0412 disponible dans votre espace client.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'mock-5',
    name: 'Direction',
    email: '',
    subject: 'Objectifs Q2',
    isGroup: true,
    members: ['direction@resto.fr', 'compta@resto.fr'],
    avatar: 'DI',
    starred: true,
    unread: 0,
    category: 'equipe',
    online: false,
    lastMessage: 'Les marges du mois de mars sont excellentes. Bravo à toute l\'équipe.',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    messages: [
      {
        id: 'm5-1',
        senderId: 'dir',
        senderName: 'Direction',
        text: "Les marges du mois de mars sont excellentes. Bravo à toute l'équipe. Objectif pour Q2 : maintenir un food cost < 28%.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        read: true,
        type: 'text',
      },
    ],
  },
];

// ── API helpers ──────────────────────────────────────────────────────────────
function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Restaurant-Id': restaurantId || '1',
  };
}

const API = '/api/messages';
const ME = 'me';

function mapApiConversation(apiConv: any): Conversation {
  return {
    id: apiConv.id,
    name: apiConv.name,
    email: apiConv.participants?.[0] || '',
    subject: apiConv.subject || apiConv.lastMessage?.substring(0, 60) || 'Sans objet',
    isGroup: apiConv.isGroup || false,
    members: apiConv.participants || [],
    avatar: apiConv.avatar || apiConv.name.slice(0, 2).toUpperCase(),
    starred: apiConv.starred || false,
    unread: apiConv.unreadCount || 0,
    messages: [],
    lastMessage: apiConv.lastMessage || '',
    updatedAt: apiConv.updatedAt || '',
    category: apiConv.category || 'fournisseur',
    online: apiConv.online || false,
  };
}

function mapApiMessage(apiMsg: any): Message {
  return {
    id: String(apiMsg.id),
    senderId: apiMsg.senderId,
    senderName: apiMsg.senderName,
    text: apiMsg.content,
    timestamp: apiMsg.timestamp,
    read: apiMsg.read,
    type: 'text',
  };
}

function formatDate(ts: string) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatTime(ts: string) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatFullDate(ts: string) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return `Aujourd'hui à ${formatTime(ts)}`;
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

function getCategoryIcon(category?: string, isGroup?: boolean) {
  if (isGroup) return <Users className="w-3 h-3" />;
  if (category === 'equipe') return <ChefHat className="w-3 h-3" />;
  return <Truck className="w-3 h-3" />;
}

function getCategoryColor(category?: string, isGroup?: boolean) {
  if (isGroup) return 'bg-purple-500';
  if (category === 'equipe') return 'bg-emerald-500';
  return 'bg-blue-500';
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Messagerie() {
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'fournisseur' | 'equipe' | 'starred'>('all');
  const [newMsgIds, setNewMsgIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;

  // ── Fetch conversations ──────────────────────────────────────────────
  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API}/conversations`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API indisponible');
      const data = await res.json();
      const mapped = (data || []).map(mapApiConversation);
      // Tri par date décroissante
      mapped.sort((a: Conversation, b: Conversation) =>
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
      setConversations(mapped);
      setUseMock(false);
    } catch (err) {
      console.warn('API messages indisponible, utilisation des données mock:', err);
      // Tri mock par date décroissante
      const sorted = [...MOCK_CONVERSATIONS].sort(
        (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
      setConversations(sorted);
      setUseMock(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Fetch messages when selecting ────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string) => {
    if (useMock) return; // Mock data already has messages
    try {
      const res = await fetch(`${API}/conversations/${convId}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      const messages: Message[] = (data.messages || []).map(mapApiMessage);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, messages } : c))
      );
    } catch (err) {
      console.error('Erreur chargement messages:', err);
    }
  }, [useMock]);

  const markAsRead = useCallback(async (convId: string) => {
    if (useMock) {
      setConversations((prev) =>
        prev.map((c) => c.id === convId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
        )
      );
      return;
    }
    try {
      await fetch(`${API}/conversations/${convId}/read`, { method: 'PUT', headers: getHeaders() });
      setConversations((prev) =>
        prev.map((c) => c.id === convId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
        )
      );
    } catch {}
  }, [useMock]);

  // Scroll au dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length]);

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
    markAsRead(activeId);
  }, [activeId, fetchMessages, markAsRead]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  // Filtrage + tri
  const filtered = conversations
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab =
        activeTab === 'all' ? true :
        activeTab === 'starred' ? c.starred :
        c.category === activeTab;
      return matchSearch && matchTab;
    });

  // ── Delete ─────────────────────────────────────────────────────────
  async function handleDelete(convId: string) {
    if (!confirm('Supprimer cette conversation ?')) return;
    if (!useMock) {
      try {
        await fetch(`${API}/conversations/${convId}`, { method: 'DELETE', headers: getHeaders() });
      } catch { showToast('Erreur suppression', 'error'); return; }
    }
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeId === convId) { setActiveId(null); setMobileShowChat(false); }
    showToast('Conversation supprimée', 'success');
  }

  // ── Toggle star ────────────────────────────────────────────────────
  async function handleToggleStar(convId: string) {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;
    const newStarred = !conv.starred;
    if (!useMock) {
      try {
        await fetch(`${API}/conversations/${convId}/star`, { method: 'PUT', headers: getHeaders() });
      } catch { showToast('Erreur favoris', 'error'); return; }
    }
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, starred: newStarred } : c)
    );
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileShowChat(true);
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  // ── Send message ────────────────────────────────────────────────────
  async function handleSend() {
    if (!inputText.trim() || !activeId || sending) return;
    const content = inputText.trim();
    setInputText('');

    const tempId = `tmp-${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      senderId: 'me',
      senderName: 'RestauMargin',
      text: content,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text',
      isNew: true,
    };

    // Optimistic update
    setConversations((prev) =>
      prev.map((c) => c.id === activeId
        ? {
            ...c,
            messages: [...c.messages, newMsg],
            lastMessage: content,
            updatedAt: newMsg.timestamp,
          }
        : c
      )
    );
    setNewMsgIds((s) => new Set(s).add(tempId));
    setTimeout(() => setNewMsgIds((s) => { const n = new Set(s); n.delete(tempId); return n; }), 600);

    if (useMock) return;

    setSending(true);
    try {
      const res = await fetch(`${API}/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, senderId: 'me', senderName: 'RestauMargin' }),
      });
      if (!res.ok) throw new Error('Erreur envoi');
      const savedMsg = await res.json();
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.map((m) => m.id === tempId ? mapApiMessage(savedMsg) : m) }
            : c
        )
      );
    } catch {
      showToast("Impossible d'envoyer le message", 'error');
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.filter((m) => m.id !== tempId) }
            : c
        )
      );
      setInputText(content);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Compose ─────────────────────────────────────────────────────────
  async function handleComposeSend() {
    if (!composeTo.trim() || !composeBody.trim() || sending) return;
    setSending(true);
    try {
      if (useMock) {
        const mockNew: Conversation = {
          id: `mock-new-${Date.now()}`,
          name: composeTo.split('@')[0],
          email: composeTo.trim(),
          subject: composeSubject || 'Sans objet',
          isGroup: false,
          members: [composeTo.trim()],
          avatar: composeTo.slice(0, 2).toUpperCase(),
          starred: false,
          unread: 0,
          category: 'fournisseur',
          online: false,
          lastMessage: composeBody.trim(),
          updatedAt: new Date().toISOString(),
          messages: [{
            id: `tmp-${Date.now()}`,
            senderId: 'me',
            senderName: 'RestauMargin',
            text: composeBody.trim(),
            timestamp: new Date().toISOString(),
            read: true,
            type: 'text',
          }],
        };
        setConversations((prev) => [mockNew, ...prev]);
      } else {
        const res = await fetch(`${API}/conversations`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            name: composeTo.split('@')[0],
            participants: [composeTo.trim()],
            isGroup: false,
          }),
        });
        if (!res.ok) throw new Error('Erreur création');
        const created = await res.json();
        await fetch(`${API}/conversations/${created.id}/messages`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            content: composeBody.trim(),
            senderId: 'me',
            senderName: 'RestauMargin',
            subject: composeSubject || 'Sans objet',
          }),
        });
        fetchConversations(true);
      }
      setShowCompose(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      showToast('Message envoyé', 'success');
    } catch {
      showToast("Impossible d'envoyer le message", 'error');
    } finally {
      setSending(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold">Messagerie</h1>
          {totalUnread > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full animate-pulse">
              {totalUnread}
            </span>
          )}
          {useMock && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchConversations(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouveau message
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">

        {/* ── Left: Conversation list ─────────────────────────────────── */}
        <div className={`w-full md:w-[340px] border-r border-slate-800 flex flex-col flex-shrink-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>

          {/* Search */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 text-sm border border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800 px-1 pt-1 gap-0.5 overflow-x-auto">
            {([
              { key: 'all', label: 'Tous' },
              { key: 'fournisseur', label: 'Fournisseurs' },
              { key: 'equipe', label: 'Équipe' },
              { key: 'starred', label: 'Favoris' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-slate-800 text-white border-b-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {tab.key === 'all' && totalUnread > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-blue-600 text-white rounded-full">
                    {totalUnread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center">
                <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="text-sm text-slate-400">Aucune conversation</p>
              </div>
            )}
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full text-left px-3 py-3 border-b border-slate-800/50 transition-all duration-150 ${
                  activeId === conv.id
                    ? 'bg-blue-600/10 border-l-2 border-l-blue-500'
                    : conv.unread > 0
                    ? 'bg-slate-800/40 hover:bg-slate-800/70'
                    : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Avatar + online indicator */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ${getCategoryColor(conv.category, conv.isGroup)}`}>
                      {conv.avatar}
                    </div>
                    {/* Online dot */}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${conv.online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    {/* Unread badge */}
                    {conv.unread > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-blue-600 text-white rounded-full shadow-lg">
                        {conv.unread}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + date */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {conv.name}
                        </span>
                        <span className="text-slate-500 flex-shrink-0">
                          {getCategoryIcon(conv.category, conv.isGroup)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {conv.starred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                        <span className="text-[10px] text-slate-500">
                          {formatDate(conv.updatedAt || '')}
                        </span>
                      </div>
                    </div>

                    {/* Last message preview */}
                    <p className={`text-xs mt-0.5 truncate ${conv.unread > 0 ? 'text-slate-300' : 'text-slate-500'}`}>
                      {conv.lastMessage || conv.subject}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Chat window ───────────────────────────────────────── */}
        <div className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile back */}
                  <button
                    onClick={() => { setMobileShowChat(false); setActiveId(null); }}
                    className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${getCategoryColor(activeConv.category, activeConv.isGroup)}`}>
                      {activeConv.avatar}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${activeConv.online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  </div>

                  {/* Name + status */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white truncate">{activeConv.name}</h2>
                      {activeConv.isGroup && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-full">
                          {activeConv.members.length} membres
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Circle className={`w-2 h-2 fill-current ${activeConv.online ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className="text-[11px] text-slate-400">
                        {activeConv.online ? 'En ligne' : 'Hors ligne'}
                        {activeConv.email && ` · ${activeConv.email}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleStar(activeConv.id)}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors"
                    title="Favoris"
                  >
                    {activeConv.starred
                      ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      : <StarOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(activeConv.id)}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages bubbles */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {activeConv.messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm">Aucun message pour l'instant</p>
                    <p className="text-xs mt-1">Envoyez le premier message ci-dessous</p>
                  </div>
                )}

                {activeConv.messages.map((msg, i) => {
                  const isMine = msg.senderId === ME || msg.senderId === 'me';
                  const prevMsg = i > 0 ? activeConv.messages[i - 1] : null;
                  const showDateSep = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                  const isAnimated = newMsgIds.has(msg.id);

                  return (
                    <div key={msg.id}>
                      {/* Date separator */}
                      {showDateSep && (
                        <div className="flex items-center gap-3 my-3">
                          <div className="flex-1 h-px bg-slate-800" />
                          <span className="text-[10px] text-slate-500 px-2 py-0.5 bg-slate-800/80 rounded-full">
                            {formatFullDate(msg.timestamp).split('à')[0].trim()}
                          </span>
                          <div className="flex-1 h-px bg-slate-800" />
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} ${
                          isAnimated ? 'animate-slideInUp' : ''
                        }`}
                      >
                        {/* Avatar (only for others) */}
                        {!isMine && (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5 ${getCategoryColor(activeConv.category, activeConv.isGroup)}`}>
                            {activeConv.avatar}
                          </div>
                        )}

                        <div className={`max-w-[72%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          {/* Sender name (groupe seulement) */}
                          {!isMine && activeConv.isGroup && msg.senderName && (
                            <span className="text-[10px] text-slate-400 pl-1">{msg.senderName}</span>
                          )}

                          {/* Bubble */}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 ${
                              isMine
                                ? 'bg-blue-600 text-white rounded-br-md shadow-lg shadow-blue-900/20'
                                : 'bg-slate-800 text-slate-200 rounded-bl-md'
                            } ${isAnimated ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
                          >
                            {msg.text}
                          </div>

                          {/* Timestamp + read status */}
                          <div className={`flex items-center gap-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-slate-600">{formatTime(msg.timestamp)}</span>
                            {isMine && (
                              <span className="text-[10px] text-slate-600">
                                {msg.read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-slate-800 bg-slate-900/80 p-3 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors flex-shrink-0 mb-0.5">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message à ${activeConv.name}... (Entrée pour envoyer)`}
                      rows={1}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 overflow-y-auto transition-all"
                      style={{ minHeight: '42px' }}
                      onInput={(e) => {
                        const t = e.currentTarget;
                        t.style.height = 'auto';
                        t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || sending}
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex-shrink-0 mb-0.5 hover:scale-105 active:scale-95"
                    title="Envoyer (Entrée)"
                  >
                    {sending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5 pl-10">Shift+Entrée pour nouvelle ligne</p>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-1">
                <MessageSquare className="w-8 h-8 opacity-30" />
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-slate-400">Sélectionnez une conversation</p>
                <p className="text-sm mt-1">Choisissez un contact dans la liste</p>
              </div>
              <button
                onClick={() => setShowCompose(true)}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
              >
                <Reply className="w-4 h-4" />
                Démarrer une conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Compose modal ─────────────────────────────────────────────── */}
      {showCompose && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCompose(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg mx-0 sm:mx-4 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-200">Nouveau message</h2>
              </div>
              <button onClick={() => setShowCompose(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fields */}
            <div className="px-4 py-2 space-y-0">
              <div className="flex items-center border-b border-slate-800 py-2.5 gap-2">
                <span className="text-xs text-slate-500 w-12 flex-shrink-0">À :</span>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="email@fournisseur.com"
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-slate-200 border-0 focus:ring-0 placeholder:text-slate-600 p-0 outline-none"
                />
              </div>
              <div className="flex items-center border-b border-slate-800 py-2.5 gap-2">
                <span className="text-xs text-slate-500 w-12 flex-shrink-0">Objet :</span>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Sujet du message"
                  className="flex-1 bg-transparent text-sm text-slate-200 border-0 focus:ring-0 placeholder:text-slate-600 p-0 outline-none"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-4 py-2 overflow-y-auto">
              <textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Rédigez votre message..."
                rows={8}
                className="w-full bg-transparent text-sm text-slate-200 border-0 focus:ring-0 placeholder:text-slate-600 resize-none outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                onClick={handleComposeSend}
                disabled={!composeTo.trim() || !composeBody.trim() || sending}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function getUnreadCount(): number {
  return 0;
}
