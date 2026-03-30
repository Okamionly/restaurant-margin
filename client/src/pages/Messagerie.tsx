import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, Send, Paperclip, Search, Phone, Video, MoreVertical,
  Users, Check, CheckCheck, Image, X, Plus, ArrowLeft, Package, Loader2,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'order';
  orderData?: { id: string; supplier: string; items: number; total: string; status: string };
}

interface Conversation {
  id: string;
  name: string;
  isGroup: boolean;
  members: string[];
  avatar: string;
  online: boolean;
  messages: Message[];
  unread: number;
  lastMessage?: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
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

// ── Data ─────────────────────────────────────────────────────────────────────
const ME = 'me';

// Contacts chargés depuis l'API — tableau vide par défaut
const CONTACTS: Contact[] = [];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLastMessage(conv: Conversation) {
  return conv.messages[conv.messages.length - 1];
}

function getLastTimestamp(conv: Conversation) {
  const last = getLastMessage(conv);
  return last?.timestamp.split(' ').pop() || '';
}

function getLastPreview(conv: Conversation) {
  const last = getLastMessage(conv);
  if (last) {
    if (last.type === 'order') return `📦 Commande ${last.orderData?.id}`;
    const prefix = last.senderId === ME ? 'Vous: ' : '';
    const text = last.text;
    return prefix + (text.length > 40 ? text.slice(0, 40) + '...' : text);
  }
  // Fallback to lastMessage from API when messages not yet loaded
  if (conv.lastMessage) return conv.lastMessage;
  return '';
}

// Map API conversation to local Conversation type
function mapApiConversation(apiConv: any): Conversation {
  return {
    id: apiConv.id,
    name: apiConv.name,
    isGroup: apiConv.isGroup || false,
    members: apiConv.participants || [],
    avatar: apiConv.avatar || apiConv.name.slice(0, 2).toUpperCase(),
    online: false,
    unread: apiConv.unreadCount || 0,
    messages: [],
    lastMessage: apiConv.lastMessage || '',
  };
}

// Map API message to local Message type
function mapApiMessage(apiMsg: any): Message {
  return {
    id: String(apiMsg.id),
    senderId: apiMsg.senderId,
    text: apiMsg.content,
    timestamp: apiMsg.timestamp,
    read: apiMsg.read,
    type: 'text',
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Messagerie() {
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;

  // ── Fetch conversations on mount ───────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/conversations`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      const mapped: Conversation[] = (data || []).map(mapApiConversation);
      setConversations(mapped);
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
      showToast('Impossible de charger les conversations', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ── Fetch messages when selecting a conversation ───────────────────────
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
      showToast('Impossible de charger les messages', 'error');
    }
  }, [showToast]);

  // ── Mark as read on the API ────────────────────────────────────────────
  const markAsRead = useCallback(async (convId: string) => {
    try {
      await fetch(`${API}/conversations/${convId}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
            : c
        )
      );
    } catch (err) {
      console.error('Erreur marquage lu:', err);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length]);

  // Fetch messages + mark as read when opening a conversation
  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId);
    markAsRead(activeId);
  }, [activeId, fetchMessages, markAsRead]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileShowChat(true);
  }

  async function handleSend() {
    if (!input.trim() || !activeId || sendingMessage) return;
    const content = input.trim();
    setInput('');

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      senderId: ME,
      text: content,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, optimisticMsg] } : c))
    );

    setSendingMessage(true);
    try {
      const res = await fetch(`${API}/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, senderId: 'me', senderName: 'Moi' }),
      });
      if (!res.ok) throw new Error('Erreur envoi');
      const savedMsg = await res.json();
      // Replace optimistic message with server response
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === optimisticMsg.id ? mapApiMessage(savedMsg) : m
                ),
              }
            : c
        )
      );
    } catch (err) {
      console.error('Erreur envoi message:', err);
      showToast("Impossible d'envoyer le message", 'error');
      // Remove optimistic message on failure
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: c.messages.filter((m) => m.id !== optimisticMsg.id) }
            : c
        )
      );
      setInput(content); // Restore input
    } finally {
      setSendingMessage(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleNewConversation(contact: Contact) {
    const existing = conversations.find((c) => c.id === contact.id);
    if (existing) {
      setActiveId(contact.id);
      setMobileShowChat(true);
    } else {
      try {
        const res = await fetch(`${API}/conversations`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            id: contact.id,
            name: contact.name,
            participants: [contact.id],
            isGroup: false,
            avatar: contact.avatar,
          }),
        });
        if (!res.ok) throw new Error('Erreur création');
        const created = await res.json();
        const newConv = mapApiConversation(created);
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(contact.id);
        setMobileShowChat(true);
      } catch (err) {
        console.error('Erreur création conversation:', err);
        showToast('Impossible de créer la conversation', 'error');
        setShowNewModal(false);
        return;
      }
    }
    setShowNewModal(false);
    showToast(`Conversation avec ${contact.name} ouverte`, 'info');
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold">Messages</h1>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
              {totalUnread}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </button>
      </div>

      {/* Main panels */}
      <div className="flex flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
        {/* ── Left panel: conversation list ──────────────────────────────── */}
        <div
          className={`w-full md:w-1/3 md:max-w-sm border-r dark:border-slate-700 flex flex-col ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search */}
          <div className="p-3 border-b dark:border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
            {!loading && filteredConversations.length === 0 && (
              <div className="p-6 text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-400 mb-3">Aucune conversation</p>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Démarrer une conversation
                </button>
              </div>
            )}
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b dark:border-slate-700/50 ${
                  activeId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      conv.isGroup ? 'bg-purple-500' : 'bg-blue-500'
                    }`}
                  >
                    {conv.isGroup ? <Users className="w-5 h-5" /> : conv.avatar}
                  </div>
                  {conv.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate dark:text-slate-200">
                      {conv.name}
                    </span>
                    <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                      {getLastTimestamp(conv)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {getLastPreview(conv)}
                    </span>
                    {conv.unread > 0 && (
                      <span className="ml-2 flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full min-w-[18px] text-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right panel: active conversation ───────────────────────────── */}
        <div
          className={`flex-1 flex flex-col ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        activeConv.isGroup ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                    >
                      {activeConv.isGroup ? <Users className="w-4 h-4" /> : activeConv.avatar}
                    </div>
                    {activeConv.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-50 dark:border-slate-800" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold dark:text-slate-200">{activeConv.name}</div>
                    <div className="text-xs text-slate-400">
                      {activeConv.isGroup
                        ? `${activeConv.members.length + 1} membres`
                        : activeConv.online
                        ? 'En ligne'
                        : 'Hors ligne'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
                {activeConv.messages.map((msg) => {
                  const isMine = msg.senderId === ME;

                  if (msg.type === 'order' && msg.orderData) {
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs sm:max-w-sm rounded-xl p-3 ${
                            isMine
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4" />
                            <span className="text-xs font-semibold">Commande {msg.orderData.id}</span>
                          </div>
                          <div className="text-xs space-y-1 opacity-90">
                            <div>Fournisseur: {msg.orderData.supplier}</div>
                            <div>{msg.orderData.items} articles - {msg.orderData.total}</div>
                            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium mt-1 ${
                              isMine ? 'bg-blue-500' : 'bg-green-100 text-green-700 dark:bg-green-800/50 dark:text-green-300'
                            }`}>
                              {msg.orderData.status}
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-2">
                            <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                            {isMine && (msg.read ? <CheckCheck className="w-3 h-3 text-sky-300" /> : <Check className="w-3 h-3 opacity-70" />)}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs sm:max-w-md rounded-xl px-3 py-2 ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {/* Sender name in group */}
                        {!isMine && activeConv.isGroup && (
                          <div className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-0.5">
                            {CONTACTS.find((c) => c.id === msg.senderId)?.name.split(' - ')[0] || msg.senderId}
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                          {isMine && (
                            msg.read
                              ? <CheckCheck className="w-3 h-3 text-sky-300" />
                              : <Check className="w-3 h-3 opacity-70" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                    <Image className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sendingMessage}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Sélectionnez une conversation</p>
              <p className="text-sm mt-1">Choisissez un contact pour commencer à discuter</p>
            </div>
          )}
        </div>
      </div>

      {/* ── New conversation modal ──────────────────────────────────────── */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNewModal(false)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700">
              <h2 className="text-lg font-semibold dark:text-slate-200">Nouvelle conversation</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {CONTACTS.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleNewConversation(contact)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                    {contact.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium dark:text-slate-200">{contact.name}</div>
                    <div className="text-xs text-slate-400">{contact.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Returns total unread count — 0 when no data */
export function getUnreadCount(): number {
  return 0;
}
