import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, Send, Paperclip, Search, Phone, Video, MoreVertical,
  Users, Check, CheckCheck, Image, X, Plus, ArrowLeft, Package,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

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
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// ── API response types ──────────────────────────────────────────────────────
interface ApiConversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
  isGroup: boolean;
  avatar: string;
}

interface ApiMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const ME = 'me';

const CONTACTS: Contact[] = [
  { id: 'transgourmet', name: 'Transgourmet - Commercial', role: 'Fournisseur', avatar: 'TC' },
  { id: 'metro', name: 'Metro - Service client', role: 'Fournisseur', avatar: 'MS' },
  { id: 'cuisine', name: 'Équipe Cuisine', role: 'Groupe interne', avatar: 'EC' },
  { id: 'sofia', name: 'Sofia M. - Pâtissière', role: 'Employée', avatar: 'SM' },
  { id: 'pomona', name: 'Fournisseur Pomona', role: 'Fournisseur', avatar: 'FP' },
  { id: 'lucas', name: 'Lucas D. - Commis', role: 'Employé', avatar: 'LD' },
  { id: 'marie', name: 'Marie L. - Serveuse', role: 'Employée', avatar: 'ML' },
  { id: 'brake', name: 'Brake France', role: 'Fournisseur', avatar: 'BF' },
  { id: 'rungis', name: "Rungis Express", role: 'Fournisseur', avatar: 'RE' },
];

// Online status map (not stored in backend)
const ONLINE_MAP: Record<string, boolean> = {
  transgourmet: true,
  metro: false,
  cuisine: true,
  sofia: true,
  pomona: false,
};

function buildConversations(): Conversation[] {
  return [
    {
      id: 'transgourmet',
      name: 'Transgourmet - Commercial',
      isGroup: false,
      members: ['transgourmet'],
      avatar: 'TC',
      online: true,
      unread: 2,
      messages: [
        { id: '1', senderId: 'transgourmet', text: 'Bonjour, votre commande #1247 a été préparée.', timestamp: '10:15', read: true, type: 'text' },
        { id: '2', senderId: ME, text: 'Parfait, merci ! Livraison prévue à quelle heure ?', timestamp: '10:20', read: true, type: 'text' },
        { id: '3', senderId: 'transgourmet', text: 'Livraison entre 14h et 16h.', timestamp: '10:25', read: true, type: 'text' },
        {
          id: '4', senderId: 'transgourmet', text: '', timestamp: '10:28', read: false, type: 'order',
          orderData: { id: '#1247', supplier: 'Transgourmet', items: 12, total: '847,50 €', status: 'Expédiée' },
        },
        { id: '5', senderId: 'transgourmet', text: 'Votre commande #1247 a été expédiée', timestamp: '10:30', read: false, type: 'text' },
      ],
    },
    {
      id: 'metro',
      name: 'Metro - Service client',
      isGroup: false,
      members: ['metro'],
      avatar: 'MS',
      online: false,
      unread: 1,
      messages: [
        { id: '1', senderId: ME, text: 'Bonjour, je cherche des offres sur les produits frais cette semaine.', timestamp: 'Hier 09:00', read: true, type: 'text' },
        { id: '2', senderId: 'metro', text: 'Bonjour ! Nous avons -20% sur les légumes bio et -15% sur la volaille.', timestamp: 'Hier 09:45', read: true, type: 'text' },
        { id: '3', senderId: 'metro', text: 'Nouvelle promotion disponible', timestamp: 'Hier 14:30', read: false, type: 'text' },
      ],
    },
    {
      id: 'cuisine',
      name: 'Équipe Cuisine',
      isGroup: true,
      members: ['sofia', 'lucas', 'cuisine'],
      avatar: 'EC',
      online: true,
      unread: 0,
      messages: [
        { id: '1', senderId: 'lucas', text: 'Les légumes du jour sont arrivés, tout est conforme.', timestamp: '08:30', read: true, type: 'text' },
        { id: '2', senderId: ME, text: 'Super, merci Lucas. Sofia, le dessert du jour est prêt ?', timestamp: '08:45', read: true, type: 'text' },
        { id: '3', senderId: 'sofia', text: 'Oui, tarte tatin prête ! 🍎', timestamp: '09:00', read: true, type: 'text' },
        { id: '4', senderId: 'lucas', text: 'Chef: Le poisson est arrivé', timestamp: '09:15', read: true, type: 'text' },
      ],
    },
    {
      id: 'sofia',
      name: 'Sofia M. - Pâtissière',
      isGroup: false,
      members: ['sofia'],
      avatar: 'SM',
      online: true,
      unread: 0,
      messages: [
        { id: '1', senderId: 'sofia', text: 'Bonjour chef, j\'ai testé la nouvelle recette de fondant.', timestamp: 'Lun 14:00', read: true, type: 'text' },
        { id: '2', senderId: ME, text: 'Génial ! Comment ça s\'est passé ?', timestamp: 'Lun 14:15', read: true, type: 'text' },
        { id: '3', senderId: 'sofia', text: 'Très bien, je vous montre demain matin.', timestamp: 'Lun 14:20', read: true, type: 'text' },
        { id: '4', senderId: 'sofia', text: 'Je serai en retard demain', timestamp: 'Lun 16:30', read: true, type: 'text' },
      ],
    },
    {
      id: 'pomona',
      name: 'Fournisseur Pomona',
      isGroup: false,
      members: ['pomona'],
      avatar: 'FP',
      online: false,
      unread: 0,
      messages: [
        { id: '1', senderId: ME, text: 'Bonjour, pouvez-vous me faire un devis pour les légumes bio ?', timestamp: '25/03 10:00', read: true, type: 'text' },
        { id: '2', senderId: 'pomona', text: 'Bien sûr, je prépare ça et vous l\'envoie dans l\'après-midi.', timestamp: '25/03 10:30', read: true, type: 'text' },
        { id: '3', senderId: 'pomona', text: 'Devis envoyé pour les légumes bio', timestamp: '25/03 15:00', read: true, type: 'text' },
      ],
    },
  ];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function apiConvToLocal(apiConv: ApiConversation): Conversation {
  return {
    id: apiConv.id,
    name: apiConv.name,
    isGroup: apiConv.isGroup,
    members: apiConv.participants.filter((p) => p !== 'me'),
    avatar: apiConv.avatar,
    online: ONLINE_MAP[apiConv.id] ?? false,
    unread: apiConv.unreadCount,
    messages: [],
  };
}

function apiMsgToLocal(apiMsg: ApiMessage): Message {
  return {
    id: apiMsg.id,
    senderId: apiMsg.senderId,
    text: apiMsg.content,
    timestamp: apiMsg.timestamp,
    read: apiMsg.read,
    type: 'text',
  };
}

function getLastMessage(conv: Conversation) {
  return conv.messages[conv.messages.length - 1];
}

function getLastTimestamp(conv: Conversation) {
  const last = getLastMessage(conv);
  return last?.timestamp.split(' ').pop() || '';
}

function getLastPreview(conv: Conversation) {
  const last = getLastMessage(conv);
  if (!last) return '';
  if (last.type === 'order') return `📦 Commande ${last.orderData?.id}`;
  const prefix = last.senderId === ME ? 'Vous: ' : '';
  const text = last.text;
  return prefix + (text.length > 40 ? text.slice(0, 40) + '...' : text);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Messagerie() {
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>(buildConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;

  // ── Fetch conversations on mount ───────────────────────────────────────
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch(`${API}/api/messages/conversations`, { headers: authHeaders() });
        if (!res.ok) throw new Error('API error');
        const data: ApiConversation[] = await res.json();
        // Convert API conversations to local format, then load messages for each
        const localConvs = data.map(apiConvToLocal);
        // Load messages for each conversation
        const convsWithMessages = await Promise.all(
          localConvs.map(async (conv) => {
            try {
              const msgRes = await fetch(`${API}/api/messages/conversations/${conv.id}`, { headers: authHeaders() });
              if (!msgRes.ok) return conv;
              const msgData: { conversation: ApiConversation; messages: ApiMessage[] } = await msgRes.json();
              return { ...conv, messages: msgData.messages.map(apiMsgToLocal), unread: msgData.conversation.unreadCount };
            } catch {
              return conv;
            }
          })
        );
        setConversations(convsWithMessages);
      } catch {
        // Fallback: keep local data
      }
    }
    fetchConversations();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length]);

  // ── Fetch messages when selecting a conversation ───────────────────────
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`${API}/api/messages/conversations/${convId}`, { headers: authHeaders() });
      if (!res.ok) throw new Error('API error');
      const data: { conversation: ApiConversation; messages: ApiMessage[] } = await res.json();
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, messages: data.messages.map(apiMsgToLocal), unread: data.conversation.unreadCount }
            : c
        )
      );
    } catch {
      // Fallback: keep local data
    }
  }, []);

  // ── Mark as read when opening ──────────────────────────────────────────
  useEffect(() => {
    if (!activeId) return;
    // Optimistic local update
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
    // Fire API call
    fetch(`${API}/api/messages/conversations/${activeId}/read`, {
      method: 'PUT',
      headers: authHeaders(),
    }).catch(() => {});
  }, [activeId]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function selectConversation(id: string) {
    setActiveId(id);
    setMobileShowChat(true);
    fetchMessages(id);
  }

  async function handleSend() {
    if (!input.trim() || !activeId) return;
    const text = input.trim();
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: ME,
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'text',
    };
    // Optimistic local update
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c))
    );
    setInput('');

    // Send to API
    try {
      const res = await fetch(`${API}/api/messages/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: text, senderId: 'me', senderName: 'Moi' }),
      });
      if (!res.ok) throw new Error('API error');
      const apiMsg: ApiMessage = await res.json();
      // Replace optimistic message with server response
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === newMsg.id ? { ...apiMsgToLocal(apiMsg), type: 'text' as const } : m
                ),
              }
            : c
        )
      );
    } catch {
      // Fallback: keep optimistic message
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
      fetchMessages(contact.id);
    } else {
      const newConv: Conversation = {
        id: contact.id,
        name: contact.name,
        isGroup: false,
        members: [contact.id],
        avatar: contact.avatar,
        online: false,
        unread: 0,
        messages: [],
      };
      // Optimistic local update
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(contact.id);
      setMobileShowChat(true);

      // Create on API
      try {
        await fetch(`${API}/api/messages/conversations`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            id: contact.id,
            name: contact.name,
            participants: [contact.id, 'me'],
            isGroup: false,
            avatar: contact.avatar,
          }),
        });
      } catch {
        // Fallback: keep optimistic conversation
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
            {filteredConversations.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-400">Aucune conversation</div>
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
                    disabled={!input.trim()}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
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

/** Returns total unread count across all default conversations */
export function getUnreadCount(): number {
  return 3; // Static count for nav badge (2 transgourmet + 1 metro)
}
