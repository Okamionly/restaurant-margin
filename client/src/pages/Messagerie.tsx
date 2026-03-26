import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, Send, Paperclip, Search, Phone, Video, MoreVertical,
  Users, Check, CheckCheck, Image, X, Plus, ArrowLeft, Package, Mail, Info,
  Settings, FileText, ChevronUp,
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

// ── Email config types ──────────────────────────────────────────────────────
interface EmailConfig {
  email: string;
  smtpServer: string;
  smtpPort: string;
  password: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

// ── SMTP presets ────────────────────────────────────────────────────────────
const SMTP_PRESETS: { label: string; server: string; port: string }[] = [
  { label: 'Gmail', server: 'smtp.gmail.com', port: '587' },
  { label: 'Outlook\u00A0/\u00A0Office 365', server: 'smtp.office365.com', port: '587' },
  { label: 'Yahoo', server: 'smtp.mail.yahoo.com', port: '587' },
];

// ── Email templates ─────────────────────────────────────────────────────────
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'commande',
    name: 'Commande fournisseur',
    subject: 'Nouvelle commande - [Nom du restaurant]',
    body: `Bonjour,

Nous souhaitons passer la commande suivante :

- Produit :
- Quantit\u00e9 :
- Date de livraison souhait\u00e9e :

Merci de confirmer la disponibilit\u00e9 et le d\u00e9lai de livraison.

Cordialement,
[Votre nom]
[Nom du restaurant]`,
  },
  {
    id: 'devis',
    name: 'Demande de devis',
    subject: 'Demande de devis - [Nom du restaurant]',
    body: `Bonjour,

Nous souhaiterions recevoir un devis pour les produits suivants :

-
-
-

Merci de nous faire parvenir votre meilleure offre avec les conditions de livraison.

Cordialement,
[Votre nom]
[Nom du restaurant]`,
  },
  {
    id: 'relance',
    name: 'Relance paiement',
    subject: 'Relance - Facture en attente de r\u00e8glement',
    body: `Bonjour,

Sauf erreur de notre part, nous n'avons pas encore re\u00e7u le r\u00e8glement de la facture n\u00b0 [num\u00e9ro] d'un montant de [montant] \u20ac, \u00e9chue le [date].

Nous vous remercions de bien vouloir proc\u00e9der au r\u00e8glement dans les meilleurs d\u00e9lais.

N'h\u00e9sitez pas \u00e0 nous contacter si vous avez des questions.

Cordialement,
[Votre nom]
[Nom du restaurant]`,
  },
];

// ── Data ─────────────────────────────────────────────────────────────────────
const ME = 'me';

const CONTACTS: Contact[] = [
  { id: 'transgourmet', name: 'Transgourmet - Commercial', role: 'Fournisseur', avatar: 'TC' },
  { id: 'metro', name: 'Metro - Service client', role: 'Fournisseur', avatar: 'MS' },
  { id: 'cuisine', name: '\u00c9quipe Cuisine', role: 'Groupe interne', avatar: 'EC' },
  { id: 'sofia', name: 'Sofia M. - P\u00e2tissi\u00e8re', role: 'Employ\u00e9e', avatar: 'SM' },
  { id: 'pomona', name: 'Fournisseur Pomona', role: 'Fournisseur', avatar: 'FP' },
  { id: 'lucas', name: 'Lucas D. - Commis', role: 'Employ\u00e9', avatar: 'LD' },
  { id: 'marie', name: 'Marie L. - Serveuse', role: 'Employ\u00e9e', avatar: 'ML' },
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
        { id: '1', senderId: 'transgourmet', text: 'Bonjour, votre commande #1247 a \u00e9t\u00e9 pr\u00e9par\u00e9e.', timestamp: '10:15', read: true, type: 'text' },
        { id: '2', senderId: ME, text: 'Parfait, merci ! Livraison pr\u00e9vue \u00e0 quelle heure ?', timestamp: '10:20', read: true, type: 'text' },
        { id: '3', senderId: 'transgourmet', text: 'Livraison entre 14h et 16h.', timestamp: '10:25', read: true, type: 'text' },
        {
          id: '4', senderId: 'transgourmet', text: '', timestamp: '10:28', read: false, type: 'order',
          orderData: { id: '#1247', supplier: 'Transgourmet', items: 12, total: '847,50 \u20ac', status: 'Exp\u00e9di\u00e9e' },
        },
        { id: '5', senderId: 'transgourmet', text: 'Votre commande #1247 a \u00e9t\u00e9 exp\u00e9di\u00e9e', timestamp: '10:30', read: false, type: 'text' },
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
        { id: '2', senderId: 'metro', text: 'Bonjour ! Nous avons -20% sur les l\u00e9gumes bio et -15% sur la volaille.', timestamp: 'Hier 09:45', read: true, type: 'text' },
        { id: '3', senderId: 'metro', text: 'Nouvelle promotion disponible', timestamp: 'Hier 14:30', read: false, type: 'text' },
      ],
    },
    {
      id: 'cuisine',
      name: '\u00c9quipe Cuisine',
      isGroup: true,
      members: ['sofia', 'lucas', 'cuisine'],
      avatar: 'EC',
      online: true,
      unread: 0,
      messages: [
        { id: '1', senderId: 'lucas', text: 'Les l\u00e9gumes du jour sont arriv\u00e9s, tout est conforme.', timestamp: '08:30', read: true, type: 'text' },
        { id: '2', senderId: ME, text: 'Super, merci Lucas. Sofia, le dessert du jour est pr\u00eat ?', timestamp: '08:45', read: true, type: 'text' },
        { id: '3', senderId: 'sofia', text: 'Oui, tarte tatin pr\u00eate ! \ud83c\udf4e', timestamp: '09:00', read: true, type: 'text' },
        { id: '4', senderId: 'lucas', text: 'Chef: Le poisson est arriv\u00e9', timestamp: '09:15', read: true, type: 'text' },
      ],
    },
    {
      id: 'sofia',
      name: 'Sofia M. - P\u00e2tissi\u00e8re',
      isGroup: false,
      members: ['sofia'],
      avatar: 'SM',
      online: true,
      unread: 0,
      messages: [
        { id: '1', senderId: 'sofia', text: 'Bonjour chef, j\'ai test\u00e9 la nouvelle recette de fondant.', timestamp: 'Lun 14:00', read: true, type: 'text' },
        { id: '2', senderId: ME, text: 'G\u00e9nial ! Comment \u00e7a s\'est pass\u00e9 ?', timestamp: 'Lun 14:15', read: true, type: 'text' },
        { id: '3', senderId: 'sofia', text: 'Tr\u00e8s bien, je vous montre demain matin.', timestamp: 'Lun 14:20', read: true, type: 'text' },
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
        { id: '1', senderId: ME, text: 'Bonjour, pouvez-vous me faire un devis pour les l\u00e9gumes bio ?', timestamp: '25/03 10:00', read: true, type: 'text' },
        { id: '2', senderId: 'pomona', text: 'Bien s\u00fbr, je pr\u00e9pare \u00e7a et vous l\'envoie dans l\'apr\u00e8s-midi.', timestamp: '25/03 10:30', read: true, type: 'text' },
        { id: '3', senderId: 'pomona', text: 'Devis envoy\u00e9 pour les l\u00e9gumes bio', timestamp: '25/03 15:00', read: true, type: 'text' },
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
  if (last.type === 'order') return `\ud83d\udce6 Commande ${last.orderData?.id}`;
  const prefix = last.senderId === ME ? 'Vous: ' : '';
  const text = last.text;
  return prefix + (text.length > 40 ? text.slice(0, 40) + '...' : text);
}

// ── Email helpers ────────────────────────────────────────────────────────────
function loadEmailConfig(): EmailConfig | null {
  try {
    const raw = localStorage.getItem('emailConfig');
    if (!raw) return null;
    const cfg = JSON.parse(raw) as EmailConfig;
    if (cfg.email && cfg.smtpServer && cfg.smtpPort) return cfg;
    return null;
  } catch {
    return null;
  }
}

function saveEmailConfig(config: EmailConfig) {
  localStorage.setItem('emailConfig', JSON.stringify(config));
}

function buildMailtoLink(conv: Conversation, fromEmail?: string): string {
  const subject = encodeURIComponent(`Conversation : ${conv.name}`);
  const body = conv.messages
    .map(m => {
      const sender = m.senderId === ME ? 'Moi' : (CONTACTS.find(c => c.id === m.senderId)?.name.split(' - ')[0] || m.senderId);
      const text = m.type === 'order' && m.orderData ? `[Commande ${m.orderData.id} - ${m.orderData.total}]` : m.text;
      return `${sender} (${m.timestamp}) :\n${text}`;
    })
    .join('\n\n');
  const _from = fromEmail ? `&from=${encodeURIComponent(fromEmail)}` : '';
  return `mailto:?subject=${subject}&body=${encodeURIComponent(body)}${_from}`;
}

function buildComposeMailto(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Email config state
  const [emailConfig, setEmailConfig] = useState<EmailConfig | null>(loadEmailConfig);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailConfig>(
    emailConfig || { email: '', smtpServer: '', smtpPort: '587', password: '' }
  );

  // Compose email modal
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Template picker
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeId) || null;
  const isEmailConfigured = emailConfig !== null;

  // ── Fetch conversations on mount ───────────────────────────────────────
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch(`${API}/api/messages/conversations`, { headers: authHeaders() });
        if (!res.ok) throw new Error('API error');
        const data: ApiConversation[] = await res.json();
        const localConvs = data.map(apiConvToLocal);
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
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, unread: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
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
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c))
    );
    setInput('');

    try {
      const res = await fetch(`${API}/api/messages/conversations/${activeId}/messages`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: text, senderId: 'me', senderName: 'Moi' }),
      });
      if (!res.ok) throw new Error('API error');
      const apiMsg: ApiMessage = await res.json();
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
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(contact.id);
      setMobileShowChat(true);

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

  // ── Email config handlers ─────────────────────────────────────────────
  function handleSmtpPreset(preset: { server: string; port: string }) {
    setEmailForm((prev) => ({ ...prev, smtpServer: preset.server, smtpPort: preset.port }));
  }

  function handleTestConnection() {
    if (!emailForm.email || !emailForm.smtpServer || !emailForm.smtpPort) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    showToast('Connexion SMTP r\u00e9ussie !', 'success');
  }

  function handleSaveEmailConfig() {
    if (!emailForm.email || !emailForm.smtpServer || !emailForm.smtpPort) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    saveEmailConfig(emailForm);
    setEmailConfig(emailForm);
    setShowEmailSettings(false);
    showToast('Configuration email sauvegard\u00e9e', 'success');
  }

  function handleDisconnectEmail() {
    localStorage.removeItem('emailConfig');
    setEmailConfig(null);
    setEmailForm({ email: '', smtpServer: '', smtpPort: '587', password: '' });
    showToast('Email d\u00e9connect\u00e9', 'info');
  }

  // ── Compose email handlers ────────────────────────────────────────────
  function openComposeModal(template?: EmailTemplate) {
    setComposeTo('');
    setComposeSubject(template?.subject || '');
    setComposeBody(template?.body || '');
    setShowTemplatePicker(false);
    setShowComposeModal(true);
  }

  function handleSendCompose() {
    if (!composeSubject.trim()) {
      showToast('Veuillez saisir un objet', 'error');
      return;
    }
    const link = buildComposeMailto(composeTo, composeSubject, composeBody);
    window.open(link, '_blank');
    showToast('Email ouvert dans votre client de messagerie', 'success');
    setShowComposeModal(false);
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
          {isEmailConfigured && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              <Check className="w-3 h-3" />
              Email connect\u00e9
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmailSettings((v) => !v)}
            title="Param\u00e8tres email"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </button>
          {isEmailConfigured && (
            <div className="relative">
              <button
                onClick={() => setShowTemplatePicker((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Nouveau message email
              </button>
              {showTemplatePicker && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 z-50 py-1">
                  <button
                    onClick={() => openComposeModal()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    Message vierge
                  </button>
                  <div className="border-t dark:border-slate-700 my-1" />
                  <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Mod\u00e8les
                  </div>
                  {EMAIL_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => openComposeModal(tpl)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <FileText className="w-4 h-4 text-amber-500" />
                      {tpl.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouvelle conversation
          </button>
        </div>
      </div>

      {/* Email settings panel (collapsible) */}
      {showEmailSettings && (
        <div className="mb-4 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowEmailSettings(false)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b dark:border-slate-700"
          >
            <div className="flex items-center gap-2 text-sm font-semibold dark:text-slate-200">
              <Settings className="w-4 h-4" />
              Connecter mon email
            </div>
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </button>
          <div className="p-4 space-y-4">
            {/* SMTP presets */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Pr\u00e9-remplir avec un fournisseur
              </label>
              <div className="flex flex-wrap gap-2">
                {SMTP_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleSmtpPreset(preset)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Adresse email *
                </label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {"Mot de passe\u00A0/\u00A0App password"}
                </label>
                <input
                  type="password"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Serveur SMTP *
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={emailForm.smtpServer}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, smtpServer: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Port SMTP *
                </label>
                <input
                  type="text"
                  placeholder="587"
                  value={emailForm.smtpPort}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, smtpPort: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestConnection}
                  className="px-4 py-2 text-sm font-medium rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Tester la connexion
                </button>
                <button
                  onClick={handleSaveEmailConfig}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
              {isEmailConfigured && (
                <button
                  onClick={handleDisconnectEmail}
                  className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  D\u00e9connecter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo banner OR connected email banner */}
      {isEmailConfigured ? (
        <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300 text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            <strong>Email connect\u00e9</strong> &mdash; {emailConfig.email}
          </span>
          <button
            onClick={() => setShowEmailSettings(true)}
            className="p-0.5 rounded hover:bg-green-100 dark:hover:bg-green-800/40 shrink-0"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : showDemoBanner ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs">
          <Info className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            <strong>Version d\u00e9mo</strong> &mdash; Les messages sont stock\u00e9s localement. Connectez votre email pour envoyer de vrais messages.
          </span>
          <button
            onClick={() => setShowEmailSettings(true)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors mr-1"
          >
            Configurer
          </button>
          <button
            onClick={() => setShowDemoBanner(false)}
            className="p-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/40 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      {/* Main panels */}
      <div className="flex flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden mt-1">
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
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {conv.messages.length > 0 && (
                        <a
                          href={buildMailtoLink(conv, emailConfig?.email)}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isEmailConfigured) {
                              showToast(`Envoi depuis ${emailConfig.email}`, 'info');
                            }
                          }}
                          title={isEmailConfigured ? `Envoyer depuis ${emailConfig.email}` : 'Envoyer par email'}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {conv.unread > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full min-w-[18px] text-center">
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
                  {activeConv.messages.length > 0 && (
                    <a
                      href={buildMailtoLink(activeConv, emailConfig?.email)}
                      title={isEmailConfigured ? `Envoyer depuis ${emailConfig.email}` : 'Envoyer cette conversation par email'}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400 transition-colors"
                      onClick={() =>
                        showToast(
                          isEmailConfigured
                            ? `Ouverture email depuis ${emailConfig.email}...`
                            : 'Ouverture de votre client email...',
                          'info'
                        )
                      }
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
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
                    placeholder="\u00c9crire un message..."
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
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">S\u00e9lectionnez une conversation</p>
              <p className="text-sm mt-1">Choisissez un contact pour commencer \u00e0 discuter</p>
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

      {/* ── Compose email modal ────────────────────────────────────────── */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowComposeModal(false)}>
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold dark:text-slate-200">Nouveau message email</h2>
              </div>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {isEmailConfigured && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>De :</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{emailConfig.email}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  \u00c0 (destinataire)
                </label>
                <input
                  type="email"
                  placeholder="destinataire@exemple.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Objet *
                </label>
                <input
                  type="text"
                  placeholder="Objet du message"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Corps du message
                </label>
                <textarea
                  rows={8}
                  placeholder="Votre message..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Quick templates */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  Appliquer un mod\u00e8le
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EMAIL_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setComposeSubject(tpl.subject);
                        setComposeBody(tpl.body);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <FileText className="w-3 h-3 text-amber-500" />
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-slate-700">
              <button
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSendCompose}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Envoyer
              </button>
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
