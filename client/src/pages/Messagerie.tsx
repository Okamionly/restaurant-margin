import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, Send, Paperclip, Search, Phone, Video, MoreVertical,
  Users, Check, CheckCheck, Image, X, Plus, ArrowLeft, Package, Mail,
  FileText, Loader2, Inbox, Clock,
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

// ── Email types ─────────────────────────────────────────────────────────────
interface EmailConfig {
  email: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface SentEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  messageId: string;
  sentAt: string;
}

// ── Supplier email addresses ──────────────────────────────────────────────────
const SUPPLIER_EMAILS: Record<string, string> = {
  transgourmet: 'contact@transgourmet.fr',
  metro: 'pro@metro.fr',
  pomona: 'commande@pomona.fr',
};

const DEFAULT_EMAIL = 'marketphaseai@gmail.com';

// ── Email templates ─────────────────────────────────────────────────────────
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'commande',
    name: 'Commande fournisseur',
    subject: 'Nouvelle commande - [Nom du restaurant]',
    body: `Bonjour,

Nous souhaitons passer la commande suivante :

- Produit :
- Quantité :
- Date de livraison souhaitée :

Merci de confirmer la disponibilité et le délai de livraison.

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
    subject: 'Relance - Facture en attente de règlement',
    body: `Bonjour,

Sauf erreur de notre part, nous n'avons pas encore reçu le règlement de la facture n° [numéro] d'un montant de [montant] €, échue le [date].

Nous vous remercions de bien vouloir procéder au règlement dans les meilleurs délais.

N'hésitez pas à nous contacter si vous avez des questions.

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
        { id: '3', senderId: 'sofia', text: 'Oui, tarte tatin prête !', timestamp: '09:00', read: true, type: 'text' },
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
  if (last.type === 'order') return `Commande ${last.orderData?.id}`;
  const prefix = last.senderId === ME ? 'Vous: ' : '';
  const text = last.text;
  return prefix + (text.length > 40 ? text.slice(0, 40) + '...' : text);
}

// ── Email helpers ────────────────────────────────────────────────────────────
function loadEmailConfig(): EmailConfig {
  const saved = localStorage.getItem('restaumargin_email');
  return { email: saved || DEFAULT_EMAIL };
}

function getSupplierEmail(convId: string): string {
  return SUPPLIER_EMAILS[convId] || '';
}

// ── Send email via API ──────────────────────────────────────────────────────
async function sendEmailApi(payload: { to: string; subject: string; body: string; from?: string }): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const res = await fetch(`${API}/api/email/send`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data.error || "Erreur lors de l'envoi" };
  }
  return { success: true, messageId: data.messageId };
}

async function fetchSentEmails(): Promise<SentEmail[]> {
  try {
    const res = await fetch(`${API}/api/email/sent`, { headers: authHeaders() });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
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

  // Main view tab: 'conversations' or 'sent'
  const [mainTab, setMainTab] = useState<'conversations' | 'sent'>('conversations');

  // Email config
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(loadEmailConfig);
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Compose email modal
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeSending, setComposeSending] = useState(false);

  // Template picker
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  // Sent emails
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [sentLoading, setSentLoading] = useState(false);

  // Email forward from conversation
  const [emailForwardSending, setEmailForwardSending] = useState<string | null>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || null;
  const isEmailConfigured = !!emailConfig.email;

  function handleConnectEmail() {
    if (!emailInput.includes('@')) {
      showToast('Adresse email invalide', 'error');
      return;
    }
    localStorage.setItem('restaumargin_email', emailInput);
    setEmailConfig({ email: emailInput });
    setShowEmailSetup(false);
    showToast(`Email connecté : ${emailInput}`, 'success');
  }

  function handleDisconnectEmail() {
    localStorage.removeItem('restaumargin_email');
    setEmailConfig({ email: '' });
    showToast('Email déconnecté', 'info');
  }

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

  // Fetch messages when selecting a conversation
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

  // Mark as read when opening
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

  // Load sent emails when switching to sent tab
  useEffect(() => {
    if (mainTab === 'sent') {
      setSentLoading(true);
      fetchSentEmails().then((emails) => {
        setSentEmails(emails);
        setSentLoading(false);
      });
    }
  }, [mainTab]);

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
    setMainTab('conversations');
    showToast(`Conversation avec ${contact.name} ouverte`, 'info');
  }

  // ── Email: send conversation by email (in-app) ───────────────────────
  async function handleEmailConversation(conv: Conversation) {
    const to = getSupplierEmail(conv.id);
    if (!to) {
      showToast('Aucune adresse email connue pour ce contact', 'error');
      return;
    }

    setEmailForwardSending(conv.id);

    const subject = `RestauMargin — ${conv.name}`;
    const body = conv.messages
      .map(m => {
        const sender = m.senderId === ME ? 'Moi' : (CONTACTS.find(c => c.id === m.senderId)?.name.split(' - ')[0] || m.senderId);
        const text = m.type === 'order' && m.orderData ? `[Commande ${m.orderData.id} - ${m.orderData.total}]` : m.text;
        return `${sender} (${m.timestamp}) :\n${text}`;
      })
      .join('\n\n');

    const result = await sendEmailApi({ to, subject, body, from: emailConfig.email || undefined });
    setEmailForwardSending(null);

    if (result.success) {
      showToast(`Email envoyé à ${to}`, 'success');
    } else {
      showToast(result.error || "Erreur lors de l'envoi", 'error');
    }
  }

  // ── Compose email handlers ────────────────────────────────────────────
  function openComposeModal(template?: EmailTemplate) {
    setComposeTo('');
    setComposeSubject(template?.subject || '');
    setComposeBody(template?.body || '');
    setShowTemplatePicker(false);
    setShowComposeModal(true);
  }

  async function handleSendCompose() {
    if (!composeTo.trim() || !composeTo.includes('@')) {
      showToast('Veuillez saisir une adresse email valide', 'error');
      return;
    }
    if (!composeSubject.trim()) {
      showToast('Veuillez saisir un objet', 'error');
      return;
    }
    if (!composeBody.trim()) {
      showToast('Veuillez saisir le corps du message', 'error');
      return;
    }

    setComposeSending(true);

    const result = await sendEmailApi({
      to: composeTo.trim(),
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      from: emailConfig.email || undefined,
    });

    setComposeSending(false);

    if (result.success) {
      showToast(`Email envoyé à ${composeTo.trim()}`, 'success');
      setShowComposeModal(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      // Refresh sent list if on that tab
      if (mainTab === 'sent') {
        fetchSentEmails().then(setSentEmails);
      }
    } else {
      showToast(result.error || "Erreur lors de l'envoi de l'email", 'error');
    }
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
              Email connecté
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
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
                    Modèles
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

      {/* Email banner */}
      {isEmailConfigured ? (
        <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-300 text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            <strong>Email connecté</strong> — {emailConfig.email}
          </span>
          <button
            onClick={handleDisconnectEmail}
            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
          >
            Déconnecter
          </button>
        </div>
      ) : showEmailSetup ? (
        <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 text-xs">
          <Mail className="w-4 h-4 text-blue-500 shrink-0" />
          <input
            type="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
            onKeyDown={e => e.key === 'Enter' && handleConnectEmail()}
          />
          <button onClick={handleConnectEmail} className="px-3 py-1 rounded text-[10px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Connecter
          </button>
          <button onClick={() => setShowEmailSetup(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="flex-1">Connectez votre adresse email pour personnaliser l'expéditeur</span>
          <button
            onClick={() => setShowEmailSetup(true)}
            className="px-3 py-1 rounded text-[10px] font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-colors"
          >
            Connecter mon email
          </button>
        </div>
      )}

      {/* Main panels */}
      <div className="flex flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden mt-1">
        {/* ── Left panel: conversation list + sent tab ──────────────────── */}
        <div
          className={`w-full md:w-1/3 md:max-w-sm border-r dark:border-slate-700 flex flex-col ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Tab switcher */}
          <div className="flex border-b dark:border-slate-700">
            <button
              onClick={() => setMainTab('conversations')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                mainTab === 'conversations'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Conversations
              {totalUnread > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full min-w-[16px] text-center">
                  {totalUnread}
                </span>
              )}
            </button>
            <button
              onClick={() => { setMainTab('sent'); setActiveId(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors ${
                mainTab === 'sent'
                  ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400 bg-green-50/50 dark:bg-green-900/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              Emails envoyés
              {sentEmails.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full min-w-[16px] text-center">
                  {sentEmails.length}
                </span>
              )}
            </button>
          </div>

          {mainTab === 'conversations' ? (
            <>
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
                          {conv.messages.length > 0 && getSupplierEmail(conv.id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEmailConversation(conv);
                              }}
                              disabled={emailForwardSending === conv.id}
                              title={`Envoyer à ${getSupplierEmail(conv.id)}`}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50"
                            >
                              {emailForwardSending === conv.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Mail className="w-3.5 h-3.5" />
                              )}
                            </button>
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
            </>
          ) : (
            /* ── Sent emails list ──────────────────────────────────────── */
            <div className="flex-1 overflow-y-auto">
              {sentLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : sentEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                  <Inbox className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm font-medium">Aucun email envoyé</p>
                  <p className="text-xs mt-1">Les emails envoyés apparaitront ici</p>
                </div>
              ) : (
                sentEmails.map((email) => (
                  <button
                    key={email.id}
                    onClick={() => {
                      // Show detail in right panel
                      setActiveId(`email-${email.id}`);
                      setMobileShowChat(true);
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b dark:border-slate-700/50 ${
                      activeId === `email-${email.id}` ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate dark:text-slate-200">
                          {email.to}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">
                          {new Date(email.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {email.subject}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {email.body.slice(0, 60)}...
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── Right panel: active conversation OR sent email detail ────── */}
        <div
          className={`flex-1 flex flex-col ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeId?.startsWith('email-') ? (
            /* ── Sent email detail view ─────────────────────────────── */
            (() => {
              const emailId = activeId.replace('email-', '');
              const email = sentEmails.find((e) => e.id === emailId);
              if (!email) return null;
              return (
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setMobileShowChat(false); setActiveId(null); }}
                        className="md:hidden p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold text-white">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold dark:text-slate-200">Email envoyé</div>
                        <div className="text-xs text-slate-400">
                          {new Date(email.sentAt).toLocaleDateString('fr-FR')} à {new Date(email.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
                      <div className="px-6 py-4 border-b dark:border-slate-700 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400 w-8">De :</span>
                          <span className="font-medium dark:text-slate-200">{email.from}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400 w-8">À :</span>
                          <span className="font-medium dark:text-slate-200">{email.to}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400 w-16">Objet :</span>
                          <span className="font-semibold dark:text-slate-100">{email.subject}</span>
                        </div>
                      </div>
                      <div className="px-6 py-4">
                        <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {email.body}
                        </pre>
                      </div>
                      <div className="px-6 py-3 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>ID: {email.messageId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()
          ) : activeConv ? (
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
                  {activeConv.messages.length > 0 && getSupplierEmail(activeConv.id) && (
                    <button
                      onClick={() => handleEmailConversation(activeConv)}
                      disabled={emailForwardSending === activeConv.id}
                      title={`Envoyer par email à ${getSupplierEmail(activeConv.id)}`}
                      className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400 transition-colors disabled:opacity-50"
                    >
                      {emailForwardSending === activeConv.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                    </button>
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

      {/* ── Compose email modal ────────────────────────────────────────── */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !composeSending && setShowComposeModal(false)}>
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
                onClick={() => !composeSending && setShowComposeModal(false)}
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
                  À (destinataire) *
                </label>
                <input
                  type="email"
                  placeholder="destinataire@exemple.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  disabled={composeSending}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400 disabled:opacity-50"
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
                  disabled={composeSending}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Corps du message *
                </label>
                <textarea
                  rows={8}
                  placeholder="Votre message..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  disabled={composeSending}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm border-0 focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder:text-slate-400 resize-none disabled:opacity-50"
                />
              </div>

              {/* Quick templates */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">
                  Appliquer un modèle
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EMAIL_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => {
                        setComposeSubject(tpl.subject);
                        setComposeBody(tpl.body);
                      }}
                      disabled={composeSending}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border dark:border-slate-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-300 dark:hover:border-amber-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50"
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
                onClick={() => !composeSending && setShowComposeModal(false)}
                disabled={composeSending}
                className="px-4 py-2 text-sm font-medium rounded-lg border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSendCompose}
                disabled={composeSending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {composeSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer
                  </>
                )}
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
