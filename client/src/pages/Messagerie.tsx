import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Search, Reply, Trash2, RefreshCw, Inbox, Star,
  Loader2, Plus, X, Paperclip, ArrowLeft, StarOff,
  Circle, Users, ChefHat, Truck, MessageSquare,
  Phone, MessageCircle, CheckCheck, Mail, Zap,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

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

// ── Quick reply templates ────────────────────────────────────────────────────
const QUICK_REPLIES = [
  'Merci, commande recue',
  'Peux-tu confirmer le prix?',
  'Livraison prevue quand?',
  'OK parfait',
];

// ── Avatar color palette ─────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-sky-600',
  'bg-fuchsia-600',
  'bg-lime-600',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

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
    avatar: apiConv.avatar || apiConv.name.slice(0, 1).toUpperCase(),
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

// ── Relative time formatter ("il y a 5min") ──────────────────────────────────
function timeAgo(ts: string): string {
  if (!ts) return '';
  const now = new Date();
  const d = new Date(ts);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "a l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  if (diffHr < 24) return `il y a ${diffHr}h`;
  if (diffDay === 1) return 'Hier';
  if (diffDay < 7) return `il y a ${diffDay}j`;
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
  if (isToday) return `Aujourd'hui`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getCategoryIcon(category?: string, isGroup?: boolean) {
  if (isGroup) return <Users className="w-3 h-3" />;
  if (category === 'equipe') return <ChefHat className="w-3 h-3" />;
  if (category === 'client') return <MessageSquare className="w-3 h-3" />;
  return <Truck className="w-3 h-3" />;
}

// ── Typing Indicator Component ───────────────────────────────────────────────
function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-end gap-2 flex-row">
      <div className="w-7 h-7 rounded-full bg-[#E5E7EB] dark:bg-[#262626] flex items-center justify-center flex-shrink-0 mb-0.5">
        <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#A3A3A3]">
          {name.slice(0, 1).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-[#F3F4F6] dark:bg-[#171717] flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#9CA3AF] dark:bg-[#525252] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
          <span className="w-2 h-2 bg-[#9CA3AF] dark:bg-[#525252] rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
          <span className="w-2 h-2 bg-[#9CA3AF] dark:bg-[#525252] rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
        </div>
        <span className="text-[10px] text-[#9CA3AF] dark:text-[#525252] pl-1">{name} est en train d'ecrire...</span>
      </div>
    </div>
  );
}

// ── Empty State Illustration ─────────────────────────────────────────────────
function EmptyConversationState({ onCompose }: { onCompose: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0A0A0A] border-2 border-[#E5E7EB] dark:border-[#262626] flex items-center justify-center shadow-lg rotate-6">
            <MessageSquare className="w-10 h-10 text-teal-500/40" />
          </div>
        </div>
        {/* Decorative dots */}
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-teal-400/30 animate-pulse" />
        <div className="absolute bottom-4 left-0 w-2 h-2 rounded-full bg-emerald-400/40 animate-pulse" style={{ animationDelay: '500ms' }} />
        <div className="absolute top-1/2 -right-2 w-2.5 h-2.5 rounded-full bg-violet-400/30 animate-pulse" style={{ animationDelay: '1000ms' }} />
      </div>

      <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">
        Selectionnez une conversation
      </h3>
      <p className="text-sm text-[#6B7280] dark:text-[#737373] text-center max-w-xs mb-6 leading-relaxed">
        ou demarrez-en une nouvelle pour communiquer avec vos fournisseurs et votre equipe
      </p>

      <button
        onClick={onCompose}
        className="flex items-center gap-2.5 px-6 py-3 bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-all text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="w-4 h-4" />
        Nouvelle conversation
      </button>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Messagerie() {
  const { t } = useTranslation();
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
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
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
      mapped.sort((a: Conversation, b: Conversation) =>
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
      setConversations(mapped);
      setUseMock(false);
    } catch (err) {
      console.warn('API messages indisponible:', err);
      setConversations([]);
      setUseMock(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Fetch messages when selecting ────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string) => {
    if (useMock) return;
    try {
      const res = await fetch(`${API}/conversations/${convId}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erreur reseau');
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

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length, isTyping]);

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
    markAsRead(activeId);
  }, [activeId, fetchMessages, markAsRead]);

  // Simulate typing indicator after sending a message
  useEffect(() => {
    if (!activeConv || activeConv.messages.length === 0) return;
    const lastMsg = activeConv.messages[activeConv.messages.length - 1];
    if (lastMsg.senderId === 'me' || lastMsg.senderId === ME) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [activeConv?.messages.length]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  // Filtering + search (also searches message content)
  const filtered = conversations
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q));
      const matchTab =
        activeTab === 'all' ? true :
        activeTab === 'starred' ? c.starred :
        c.category === activeTab;
      return matchSearch && matchTab;
    });

  // ── Delete ─────────────────────────────────────────────────────────
  async function handleDelete(convId: string) {
    if (!confirm(t('messagerie.deleteConfirm'))) return;
    if (!useMock) {
      try {
        await fetch(`${API}/conversations/${convId}`, { method: 'DELETE', headers: getHeaders() });
      } catch { showToast(t('messagerie.deleteError'), 'error'); return; }
    }
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeId === convId) { setActiveId(null); setMobileShowChat(false); }
    showToast(t('messagerie.conversationDeleted'), 'success');
  }

  // ── Toggle star ────────────────────────────────────────────────────
  async function handleToggleStar(convId: string) {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;
    const newStarred = !conv.starred;
    if (!useMock) {
      try {
        await fetch(`${API}/conversations/${convId}/star`, { method: 'PUT', headers: getHeaders() });
      } catch { showToast(t('messagerie.starError'), 'error'); return; }
    }
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, starred: newStarred } : c)
    );
  }

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileShowChat(true);
    setInputText('');
    setIsTyping(false);
    setShowQuickReplies(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  // ── Attachment toast ───────────────────────────────────────────────
  function handleAttachment() {
    showToast('Joindre un fichier (bientot disponible)', 'info');
  }

  // ── Send message ────────────────────────────────────────────────────
  async function handleSend() {
    if (!inputText.trim() || !activeId || sending) return;
    const content = inputText.trim();
    setInputText('');
    setShowQuickReplies(false);

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
      showToast(t('messagerie.sendError'), 'error');
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

  // ── Quick reply insert ─────────────────────────────────────────────
  function insertQuickReply(text: string) {
    setInputText(text);
    setShowQuickReplies(false);
    setTimeout(() => inputRef.current?.focus(), 50);
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
          avatar: composeTo.slice(0, 1).toUpperCase(),
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
        if (!res.ok) throw new Error('Erreur creation');
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
      showToast(t('messagerie.messageSent'), 'success');
    } catch {
      showToast(t('messagerie.sendError'), 'error');
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111111] dark:text-white">{t('messagerie.title')}</h1>
            <p className="text-xs text-[#6B7280] dark:text-[#737373]">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              {totalUnread > 0 && (
                <span className="ml-2 text-teal-600 dark:text-teal-400 font-medium">
                  {totalUnread} non lu{totalUnread !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          {useMock && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchConversations(true)}
            className="p-2.5 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-all"
            title={t('messagerie.refresh')}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-all text-sm font-semibold shadow-lg shadow-black/10 dark:shadow-white/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('messagerie.newMessage')}</span>
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#262626] overflow-hidden shadow-sm">

        {/* ── Left: Conversation list ─────────────────────────────────── */}
        <div className={`w-full md:w-[360px] lg:w-[380px] border-r border-[#E5E7EB] dark:border-[#262626] flex flex-col flex-shrink-0 bg-white dark:bg-black ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>

          {/* Search */}
          <div className="p-3 border-b border-[#E5E7EB] dark:border-[#262626]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#525252]" />
              <input
                type="text"
                placeholder="Rechercher un nom ou message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#0A0A0A] text-sm border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-[#111111] focus:ring-2 focus:ring-teal-500/20 text-[#111111] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#525252] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] dark:border-[#262626] px-2 pt-1 gap-1 overflow-x-auto scrollbar-none">
            {([
              { key: 'all', label: t('messagerie.tabAll'), icon: Inbox },
              { key: 'fournisseur', label: t('messagerie.tabSuppliers'), icon: Truck },
              { key: 'equipe', label: t('messagerie.tabTeam'), icon: ChefHat },
              { key: 'starred', label: t('messagerie.tabFavorites'), icon: Star },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white border-b-2 border-teal-500'
                    : 'text-[#9CA3AF] dark:text-[#525252] hover:text-[#6B7280] dark:hover:text-[#737373] hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A]'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
                {tab.key === 'all' && totalUnread > 0 && (
                  <span className="ml-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {totalUnread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex flex-col items-center justify-center p-12 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                <p className="text-xs text-[#9CA3AF] dark:text-[#525252]">Chargement...</p>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] dark:bg-[#0A0A0A] flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-8 h-8 text-[#D1D5DB] dark:text-[#404040]" />
                </div>
                <p className="text-sm font-medium text-[#6B7280] dark:text-[#737373]">{t('messagerie.noConversation')}</p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#525252] mt-1">
                  {searchQuery ? 'Essayez avec d\'autres termes' : 'Commencez par envoyer un message'}
                </p>
              </div>
            )}
            {filtered.map((conv) => {
              const isActive = activeId === conv.id;
              const avatarColor = getAvatarColor(conv.name);

              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`w-full text-left px-3 py-3.5 border-b border-[#F3F4F6] dark:border-[#1A1A1A] transition-all duration-150 group ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/20 border-l-[3px] border-l-teal-500'
                      : conv.unread > 0
                      ? 'bg-[#FAFBFC] dark:bg-[#0A0A0A]/60 hover:bg-[#F3F4F6] dark:hover:bg-[#111111]'
                      : 'hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with online indicator */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${avatarColor}`}>
                        {conv.avatar || conv.name.slice(0, 1).toUpperCase()}
                      </div>
                      {/* Online/offline dot */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-white dark:border-black transition-colors ${
                        conv.online ? 'bg-emerald-500' : 'bg-[#D1D5DB] dark:bg-[#404040]'
                      }`} />
                      {/* Unread badge */}
                      {conv.unread > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full shadow-lg animate-pulse">
                          {conv.unread > 99 ? '99+' : conv.unread}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + timestamp */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-sm truncate ${
                            conv.unread > 0
                              ? 'font-bold text-[#111111] dark:text-white'
                              : 'font-medium text-[#374151] dark:text-[#D4D4D4]'
                          }`}>
                            {conv.name}
                          </span>
                          <span className="text-[#9CA3AF] dark:text-[#525252] flex-shrink-0 opacity-60">
                            {getCategoryIcon(conv.category, conv.isGroup)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {conv.starred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                          <span className={`text-[11px] ${
                            conv.unread > 0
                              ? 'text-teal-600 dark:text-teal-400 font-medium'
                              : 'text-[#9CA3AF] dark:text-[#525252]'
                          }`}>
                            {timeAgo(conv.updatedAt || '')}
                          </span>
                        </div>
                      </div>

                      {/* Last message preview */}
                      <p className={`text-[13px] mt-0.5 truncate leading-relaxed ${
                        conv.unread > 0
                          ? 'text-[#374151] dark:text-[#A3A3A3] font-medium'
                          : 'text-[#9CA3AF] dark:text-[#525252]'
                      }`}>
                        {conv.lastMessage || conv.subject}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Chat window ───────────────────────────────────────── */}
        <div className={`flex-1 flex flex-col min-w-0 bg-[#FAFBFC] dark:bg-[#0A0A0A] ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-black flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile back */}
                  <button
                    onClick={() => { setMobileShowChat(false); setActiveId(null); }}
                    className="md:hidden p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#6B7280] flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${getAvatarColor(activeConv.name)}`}>
                      {activeConv.avatar || activeConv.name.slice(0, 1).toUpperCase()}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-black ${
                      activeConv.online ? 'bg-emerald-500' : 'bg-[#D1D5DB] dark:bg-[#404040]'
                    }`} />
                  </div>

                  {/* Name + status */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-[#111111] dark:text-white truncate">{activeConv.name}</h2>
                      {activeConv.isGroup && (
                        <span className="text-[10px] text-[#6B7280] dark:text-[#525252] bg-[#F3F4F6] dark:bg-[#171717] px-1.5 py-0.5 rounded-full">
                          {activeConv.members.length} {t('messagerie.members')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Circle className={`w-2 h-2 fill-current ${activeConv.online ? 'text-emerald-500' : 'text-[#D1D5DB] dark:text-[#404040]'}`} />
                      <span className="text-[11px] text-[#6B7280] dark:text-[#525252]">
                        {activeConv.online ? 'En ligne' : 'Hors ligne'}
                      </span>
                      {isTyping && (
                        <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium animate-pulse ml-1">
                          -- ecrit...
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {activeConv.email && (
                    <button
                      onClick={() => window.open(`mailto:${activeConv.email}?subject=${encodeURIComponent(activeConv.subject || '')}`, '_blank')}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-[#9CA3AF] dark:text-[#525252] hover:text-blue-500 transition-all"
                      title={`Email: ${activeConv.email}`}
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Bonjour ${activeConv.name}, `);
                      window.open(`https://web.whatsapp.com/send?text=${msg}`, '_blank');
                    }}
                    className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/30 text-[#9CA3AF] dark:text-[#525252] hover:text-[#25D366] transition-all"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast('Fonctionnalite appel bientot disponible', 'info')}
                    className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#525252] hover:text-[#111111] dark:hover:text-white transition-all"
                    title="Appeler"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <div className="w-px h-5 bg-[#E5E7EB] dark:bg-[#262626] mx-1" />
                  <button
                    onClick={() => handleToggleStar(activeConv.id)}
                    className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950/30 text-[#9CA3AF] dark:text-[#525252] hover:text-yellow-500 transition-all"
                    title={t('messagerie.tabFavorites')}
                  >
                    {activeConv.starred
                      ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      : <StarOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(activeConv.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-[#9CA3AF] dark:text-[#525252] hover:text-red-500 transition-all"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
                {activeConv.messages.length === 0 && !isTyping && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center mb-3">
                      <MessageSquare className="w-8 h-8 text-[#D1D5DB] dark:text-[#404040]" />
                    </div>
                    <p className="text-sm text-[#6B7280] dark:text-[#525252]">{t('messagerie.noMessages')}</p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#404040] mt-1">{t('messagerie.sendFirstMessage')}</p>
                  </div>
                )}

                {activeConv.messages.map((msg, i) => {
                  const isMine = msg.senderId === ME || msg.senderId === 'me';
                  const prevMsg = i > 0 ? activeConv.messages[i - 1] : null;
                  const showDateSep = !prevMsg || new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
                  const isAnimated = newMsgIds.has(msg.id);
                  const sameSenderAsPrev = prevMsg && prevMsg.senderId === msg.senderId;

                  return (
                    <div key={msg.id}>
                      {/* Date separator */}
                      {showDateSep && (
                        <div className="flex items-center gap-4 my-4">
                          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#262626]" />
                          <span className="text-[11px] font-medium text-[#9CA3AF] dark:text-[#525252] px-3 py-1 bg-white dark:bg-[#111111] rounded-full border border-[#E5E7EB] dark:border-[#262626] shadow-sm">
                            {formatFullDate(msg.timestamp)}
                          </span>
                          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#262626]" />
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'} ${
                          sameSenderAsPrev ? 'mt-0.5' : 'mt-3'
                        } ${isAnimated ? 'animate-slideInUp' : ''}`}
                      >
                        {/* Avatar (only for others, and only if new sender group) */}
                        {!isMine ? (
                          !sameSenderAsPrev ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mb-5 shadow-sm ${getAvatarColor(activeConv.name)}`}>
                              {activeConv.avatar || activeConv.name.slice(0, 1).toUpperCase()}
                            </div>
                          ) : (
                            <div className="w-8 flex-shrink-0" />
                          )
                        ) : null}

                        <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                          {/* Sender name (group only, new sender group) */}
                          {!isMine && activeConv.isGroup && msg.senderName && !sameSenderAsPrev && (
                            <span className="text-[10px] text-[#9CA3AF] dark:text-[#525252] pl-1 mb-0.5 font-medium">{msg.senderName}</span>
                          )}

                          {/* Bubble */}
                          <div
                            className={`px-3.5 py-2 text-[14px] leading-relaxed whitespace-pre-wrap break-words transition-all duration-300 ${
                              isMine
                                ? `bg-teal-600 text-white shadow-sm ${
                                    sameSenderAsPrev ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-br-md'
                                  }`
                                : `bg-white dark:bg-[#171717] text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#262626] shadow-sm ${
                                    sameSenderAsPrev ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl rounded-bl-md'
                                  }`
                            } ${isAnimated ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
                          >
                            {msg.text}
                          </div>

                          {/* Timestamp + read status */}
                          <div className={`flex items-center gap-1 px-1 mt-0.5 ${isMine ? 'flex-row-reverse' : ''}`}>
                            <span className="text-[10px] text-[#9CA3AF] dark:text-[#525252]">{formatTime(msg.timestamp)}</span>
                            {isMine && (
                              <span className="flex items-center" title={msg.read ? 'Lu' : 'Envoye'}>
                                <CheckCheck className={`w-3.5 h-3.5 ${msg.read ? 'text-teal-400' : 'text-[#9CA3AF] dark:text-[#525252]'}`} />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && activeConv && (
                  <div className="mt-3">
                    <TypingIndicator name={activeConv.name} />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick reply templates */}
              {showQuickReplies && (
                <div className="px-3 py-2 border-t border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-black">
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => insertQuickReply(reply)}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#374151] dark:text-[#D4D4D4] rounded-full border border-[#E5E7EB] dark:border-[#262626] hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:text-teal-700 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-800 transition-all"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="border-t border-[#E5E7EB] dark:border-[#262626] bg-white dark:bg-black p-3 flex-shrink-0">
                <div className="flex items-end gap-2">
                  {/* Attachment */}
                  <button
                    onClick={handleAttachment}
                    className="p-2 rounded-xl text-[#9CA3AF] dark:text-[#525252] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-all flex-shrink-0 mb-0.5"
                    title="Joindre un fichier"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Quick replies toggle */}
                  <button
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    className={`p-2 rounded-xl transition-all flex-shrink-0 mb-0.5 ${
                      showQuickReplies
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20'
                        : 'text-[#9CA3AF] dark:text-[#525252] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                    }`}
                    title="Reponses rapides"
                  >
                    <Zap className="w-4 h-4" />
                  </button>

                  {/* Text input */}
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message a ${activeConv.name}...`}
                      rows={1}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#0A0A0A] border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-[#111111] focus:ring-2 focus:ring-teal-500/20 text-sm text-[#111111] dark:text-white placeholder:text-[#9CA3AF] dark:placeholder:text-[#525252] resize-none max-h-32 overflow-y-auto transition-all"
                      style={{ minHeight: '42px' }}
                      onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                      }}
                    />
                  </div>

                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || sending}
                    className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 flex-shrink-0 mb-0.5 hover:scale-105 active:scale-95 shadow-lg shadow-teal-600/20"
                    title={t('messagerie.sendEnter')}
                  >
                    {sending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Send className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1.5 px-1">
                  <p className="text-[10px] text-[#9CA3AF] dark:text-[#404040]">Entree pour envoyer, Shift+Entree pour retour a la ligne</p>
                </div>
              </div>
            </>
          ) : (
            <EmptyConversationState onCompose={() => setShowCompose(true)} />
          )}
        </div>
      </div>

      {/* ── Compose modal ─────────────────────────────────────────────── */}
      {showCompose && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCompose(false)}
        >
          <div
            className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#262626] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg mx-0 sm:mx-4 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#262626]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-sm font-semibold text-[#111111] dark:text-white">{t('messagerie.newMessage')}</h2>
              </div>
              <button onClick={() => setShowCompose(false)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#525252] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fields */}
            <div className="px-5 py-2 space-y-0">
              <div className="flex items-center border-b border-[#F3F4F6] dark:border-[#1A1A1A] py-3 gap-2">
                <span className="text-xs text-[#9CA3AF] dark:text-[#525252] w-12 flex-shrink-0 font-medium">{t('messagerie.to')} :</span>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="email@fournisseur.com"
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-[#111111] dark:text-white border-0 focus:ring-0 placeholder:text-[#D1D5DB] dark:placeholder:text-[#404040] p-0 outline-none"
                />
              </div>
              <div className="flex items-center border-b border-[#F3F4F6] dark:border-[#1A1A1A] py-3 gap-2">
                <span className="text-xs text-[#9CA3AF] dark:text-[#525252] w-12 flex-shrink-0 font-medium">{t('messagerie.subject')} :</span>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder={t('messagerie.subjectPlaceholder')}
                  className="flex-1 bg-transparent text-sm text-[#111111] dark:text-white border-0 focus:ring-0 placeholder:text-[#D1D5DB] dark:placeholder:text-[#404040] p-0 outline-none"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-5 py-3 overflow-y-auto">
              <textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder={t('messagerie.composePlaceholder')}
                rows={8}
                className="w-full bg-transparent text-sm text-[#111111] dark:text-white border-0 focus:ring-0 placeholder:text-[#D1D5DB] dark:placeholder:text-[#404040] resize-none outline-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#E5E7EB] dark:border-[#262626]">
              <button
                onClick={handleAttachment}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#525252] hover:text-[#6B7280] transition-colors"
                title="Joindre un fichier"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                onClick={handleComposeSend}
                disabled={!composeTo.trim() || !composeBody.trim() || sending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold shadow-lg"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t('common.send')}
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
