import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mail, Send, Search, Reply, Trash2, RefreshCw, Inbox, Star,
  ChevronLeft, Loader2, Plus, X, Clock, Paperclip, MailOpen,
  ArrowLeft, StarOff,
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
    avatar: apiConv.avatar || apiConv.name.slice(0, 2).toUpperCase(),
    starred: false,
    unread: apiConv.unreadCount || 0,
    messages: [],
    lastMessage: apiConv.lastMessage || '',
    updatedAt: apiConv.updatedAt || '',
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

function formatFullDate(ts: string) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Messagerie() {
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyOpen, setReplyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [mobileShowMail, setMobileShowMail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;

  // ── Fetch conversations ──────────────────────────────────────────────
  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API}/conversations`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      setConversations((data || []).map(mapApiConversation));
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
      if (!silent) showToast('Impossible de charger les messages', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Fetch messages when selecting ────────────────────────────────────
  const fetchMessages = useCallback(async (convId: string) => {
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
  }, []);

  const markAsRead = useCallback(async (convId: string) => {
    try {
      await fetch(`${API}/conversations/${convId}/read`, { method: 'PUT', headers: getHeaders() });
      setConversations((prev) =>
        prev.map((c) => c.id === convId ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) } : c)
      );
    } catch {}
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length]);

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
    markAsRead(activeId);
  }, [activeId, fetchMessages, markAsRead]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileShowMail(true);
    setReplyOpen(false);
    setReplyText('');
  }

  // ── Send reply ─────────────────────────────────────────────────────
  async function handleSendReply() {
    if (!replyText.trim() || !activeId || sending) return;
    const content = replyText.trim();
    setReplyText('');
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
          c.id === activeId ? { ...c, messages: [...c.messages, mapApiMessage(savedMsg)] } : c
        )
      );
      setReplyOpen(false);
      showToast('Réponse envoyée', 'success');
    } catch (err) {
      showToast("Impossible d'envoyer la réponse", 'error');
      setReplyText(content);
    } finally {
      setSending(false);
    }
  }

  // ── Compose new ────────────────────────────────────────────────────
  async function handleComposeSend() {
    if (!composeTo.trim() || !composeBody.trim() || sending) return;
    setSending(true);
    try {
      // Create conversation then send message
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
      const newConv = mapApiConversation(created);

      // Send the message
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

      setConversations((prev) => [newConv, ...prev]);
      setShowCompose(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      showToast('Email envoyé', 'success');
      fetchConversations(true);
    } catch (err) {
      showToast("Impossible d'envoyer l'email", 'error');
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
          <Mail className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold">Messagerie</h1>
          {totalUnread > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchConversations(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
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

        {/* ── Left: Inbox list ────────────────────────────────────────── */}
        <div className={`w-full md:w-[380px] border-r border-slate-800 flex flex-col ${mobileShowMail ? 'hidden md:flex' : 'flex'}`}>
          {/* Search bar */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 text-sm border border-slate-700 focus:ring-2 focus:ring-blue-500 text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Inbox label */}
          <div className="px-4 py-2 flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/50">
            <Inbox className="w-3.5 h-3.5" />
            Boîte de réception ({filtered.length})
          </div>

          {/* Email list */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center">
                <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                <p className="text-sm text-slate-500">Aucun message</p>
              </div>
            )}
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-slate-800/50 transition-colors ${
                  activeId === conv.id
                    ? 'bg-blue-600/10 border-l-2 border-l-blue-500'
                    : conv.unread > 0
                    ? 'bg-slate-800/30 hover:bg-slate-800/60'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${
                    conv.unread > 0 ? 'bg-blue-500' : 'bg-slate-600'
                  }`}>
                    {conv.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Row 1: Name + date */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                        {conv.name}
                      </span>
                      <span className="text-[11px] text-slate-500 flex-shrink-0 ml-2">
                        {formatDate(conv.updatedAt || conv.messages[conv.messages.length - 1]?.timestamp || '')}
                      </span>
                    </div>

                    {/* Row 2: Subject / preview */}
                    <p className={`text-xs mt-0.5 truncate ${conv.unread > 0 ? 'text-slate-200' : 'text-slate-500'}`}>
                      {conv.lastMessage || conv.subject}
                    </p>

                    {/* Row 3: badges */}
                    <div className="flex items-center gap-2 mt-1">
                      {conv.unread > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Email detail ─────────────────────────────────────── */}
        <div className={`flex-1 flex flex-col ${!mobileShowMail ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Email header */}
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setMobileShowMail(false); setActiveId(null); }}
                      className="md:hidden p-1 rounded hover:bg-slate-800"
                    >
                      <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <h2 className="text-lg font-semibold text-white truncate">
                      {activeConv.subject || activeConv.lastMessage?.substring(0, 60) || 'Sans objet'}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setReplyOpen(true); }}
                      className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                      title="Répondre"
                    >
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-yellow-400 transition-colors" title="Favoris">
                      {activeConv.starred ? <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {activeConv.avatar}
                  </div>
                  <div>
                    <span className="font-medium text-slate-200">{activeConv.name}</span>
                    <span className="text-slate-500 ml-2 text-xs">&lt;{activeConv.email || activeConv.members[0] || 'inconnu'}&gt;</span>
                  </div>
                </div>
              </div>

              {/* Messages as email thread */}
              <div className="flex-1 overflow-y-auto">
                {activeConv.messages.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    <MailOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Chargement des messages...</p>
                  </div>
                )}
                {activeConv.messages.map((msg, i) => {
                  const isMine = msg.senderId === ME || msg.senderId === 'me';
                  return (
                    <div key={msg.id} className={`border-b border-slate-800/50 ${i === 0 ? '' : ''}`}>
                      <div className="px-6 py-4">
                        {/* Message header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${isMine ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                              {isMine ? 'RM' : activeConv.avatar}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-200">
                                {isMine ? 'RestauMargin (vous)' : msg.senderName || activeConv.name}
                              </span>
                              {isMine && (
                                <span className="text-xs text-slate-500 ml-2">
                                  → {activeConv.email || activeConv.members[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {formatFullDate(msg.timestamp)}
                          </div>
                        </div>

                        {/* Message body */}
                        <div className="pl-11">
                          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply area */}
              {replyOpen ? (
                <div className="border-t border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                    <Reply className="w-3.5 h-3.5" />
                    Répondre à {activeConv.name}
                    <button onClick={() => setReplyOpen(false)} className="ml-auto text-slate-500 hover:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-3">
                    <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Envoyer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-800 p-3">
                  <button
                    onClick={() => setReplyOpen(true)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-400 transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    Répondre à ce message...
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <Mail className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-500">Sélectionnez un message</p>
              <p className="text-sm mt-1 text-slate-600">Choisissez un email pour le lire</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Compose modal ────────────────────────────────────────────── */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setShowCompose(false)}>
          <div
            className="bg-slate-900 border border-slate-700 rounded-t-xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg mx-0 sm:mx-4 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-slate-200">Nouveau message</h2>
              <button onClick={() => setShowCompose(false)} className="p-1 rounded hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Fields */}
            <div className="px-4 py-2 space-y-0">
              <div className="flex items-center border-b border-slate-800 py-2">
                <span className="text-xs text-slate-500 w-10">À :</span>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="email@exemple.com"
                  className="flex-1 bg-transparent text-sm text-slate-200 border-0 focus:ring-0 placeholder:text-slate-600 p-0"
                />
              </div>
              <div className="flex items-center border-b border-slate-800 py-2">
                <span className="text-xs text-slate-500 w-10">Objet :</span>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Objet du message"
                  className="flex-1 bg-transparent text-sm text-slate-200 border-0 focus:ring-0 placeholder:text-slate-600 p-0"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 px-4 py-2">
              <textarea
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Rédigez votre message..."
                rows={8}
                className="w-full bg-transparent text-sm text-slate-200 border-0 focus:ring-0 placeholder:text-slate-600 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500">
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
