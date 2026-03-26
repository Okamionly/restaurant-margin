import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const messagesRouter = Router();

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  unreadCount: number;
  isGroup: boolean;
  avatar: string;
}

// ── In-memory storage ────────────────────────────────────────────────────────
const conversations: Conversation[] = [
  {
    id: 'transgourmet',
    name: 'Transgourmet - Commercial',
    participants: ['transgourmet', 'me'],
    lastMessage: 'Votre commande #1247 a été expédiée',
    unreadCount: 2,
    isGroup: false,
    avatar: 'TC',
  },
  {
    id: 'metro',
    name: 'Metro - Service client',
    participants: ['metro', 'me'],
    lastMessage: 'Nouvelle promotion disponible',
    unreadCount: 1,
    isGroup: false,
    avatar: 'MS',
  },
  {
    id: 'cuisine',
    name: 'Équipe Cuisine',
    participants: ['sofia', 'lucas', 'cuisine', 'me'],
    lastMessage: 'Chef: Le poisson est arrivé',
    unreadCount: 0,
    isGroup: true,
    avatar: 'EC',
  },
  {
    id: 'sofia',
    name: 'Sofia M. - Pâtissière',
    participants: ['sofia', 'me'],
    lastMessage: 'Je serai en retard demain',
    unreadCount: 0,
    isGroup: false,
    avatar: 'SM',
  },
  {
    id: 'pomona',
    name: 'Fournisseur Pomona',
    participants: ['pomona', 'me'],
    lastMessage: 'Devis envoyé pour les légumes bio',
    unreadCount: 0,
    isGroup: false,
    avatar: 'FP',
  },
];

const messages: Message[] = [
  // transgourmet
  { id: '1', conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Bonjour, votre commande #1247 a été préparée.', timestamp: '10:15', read: true },
  { id: '2', conversationId: 'transgourmet', senderId: 'me', senderName: 'Moi', content: 'Parfait, merci ! Livraison prévue à quelle heure ?', timestamp: '10:20', read: true },
  { id: '3', conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Livraison entre 14h et 16h.', timestamp: '10:25', read: true },
  { id: '4', conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Commande #1247 expédiée — 12 articles — 847,50 €', timestamp: '10:28', read: false },
  { id: '5', conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Votre commande #1247 a été expédiée', timestamp: '10:30', read: false },
  // metro
  { id: '6', conversationId: 'metro', senderId: 'me', senderName: 'Moi', content: 'Bonjour, je cherche des offres sur les produits frais cette semaine.', timestamp: 'Hier 09:00', read: true },
  { id: '7', conversationId: 'metro', senderId: 'metro', senderName: 'Metro', content: 'Bonjour ! Nous avons -20% sur les légumes bio et -15% sur la volaille.', timestamp: 'Hier 09:45', read: true },
  { id: '8', conversationId: 'metro', senderId: 'metro', senderName: 'Metro', content: 'Nouvelle promotion disponible', timestamp: 'Hier 14:30', read: false },
  // cuisine
  { id: '9', conversationId: 'cuisine', senderId: 'lucas', senderName: 'Lucas D.', content: 'Les légumes du jour sont arrivés, tout est conforme.', timestamp: '08:30', read: true },
  { id: '10', conversationId: 'cuisine', senderId: 'me', senderName: 'Moi', content: 'Super, merci Lucas. Sofia, le dessert du jour est prêt ?', timestamp: '08:45', read: true },
  { id: '11', conversationId: 'cuisine', senderId: 'sofia', senderName: 'Sofia M.', content: 'Oui, tarte tatin prête ! 🍎', timestamp: '09:00', read: true },
  { id: '12', conversationId: 'cuisine', senderId: 'lucas', senderName: 'Lucas D.', content: 'Chef: Le poisson est arrivé', timestamp: '09:15', read: true },
  // sofia
  { id: '13', conversationId: 'sofia', senderId: 'sofia', senderName: 'Sofia M.', content: "Bonjour chef, j'ai testé la nouvelle recette de fondant.", timestamp: 'Lun 14:00', read: true },
  { id: '14', conversationId: 'sofia', senderId: 'me', senderName: 'Moi', content: "Génial ! Comment ça s'est passé ?", timestamp: 'Lun 14:15', read: true },
  { id: '15', conversationId: 'sofia', senderId: 'sofia', senderName: 'Sofia M.', content: 'Très bien, je vous montre demain matin.', timestamp: 'Lun 14:20', read: true },
  { id: '16', conversationId: 'sofia', senderId: 'sofia', senderName: 'Sofia M.', content: 'Je serai en retard demain', timestamp: 'Lun 16:30', read: true },
  // pomona
  { id: '17', conversationId: 'pomona', senderId: 'me', senderName: 'Moi', content: 'Bonjour, pouvez-vous me faire un devis pour les légumes bio ?', timestamp: '25/03 10:00', read: true },
  { id: '18', conversationId: 'pomona', senderId: 'pomona', senderName: 'Pomona', content: "Bien sûr, je prépare ça et vous l'envoie dans l'après-midi.", timestamp: '25/03 10:30', read: true },
  { id: '19', conversationId: 'pomona', senderId: 'pomona', senderName: 'Pomona', content: 'Devis envoyé pour les légumes bio', timestamp: '25/03 15:00', read: true },
];

let nextMsgId = 100;

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/messages/conversations - list all conversations
messagesRouter.get('/conversations', (_req: AuthRequest, res: Response) => {
  try {
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
});

// GET /api/messages/conversations/:id - get messages for a conversation
messagesRouter.get('/conversations/:id', (req: AuthRequest, res: Response) => {
  try {
    const conv = conversations.find((c) => c.id === req.params.id);
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }
    const convMessages = messages.filter((m) => m.conversationId === req.params.id);
    res.json({ conversation: conv, messages: convMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// POST /api/messages/conversations - create new conversation
messagesRouter.post('/conversations', (req: AuthRequest, res: Response) => {
  try {
    const { id, name, participants, isGroup, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const existing = conversations.find((c) => c.id === id);
    if (existing) {
      return res.json(existing);
    }

    const newConv: Conversation = {
      id: id || Date.now().toString(),
      name: name.trim(),
      participants: participants || [],
      lastMessage: '',
      unreadCount: 0,
      isGroup: isGroup || false,
      avatar: avatar || name.slice(0, 2).toUpperCase(),
    };

    conversations.unshift(newConv);
    res.status(201).json(newConv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }
});

// POST /api/messages/conversations/:id/messages - send a message
messagesRouter.post('/conversations/:id/messages', (req: AuthRequest, res: Response) => {
  try {
    const conv = conversations.find((c) => c.id === req.params.id);
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const { content, senderId, senderName } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Le contenu est requis' });
    }

    const newMsg: Message = {
      id: String(nextMsgId++),
      conversationId: req.params.id,
      senderId: senderId || 'me',
      senderName: senderName || 'Moi',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    messages.push(newMsg);
    conv.lastMessage = newMsg.content.length > 40 ? newMsg.content.slice(0, 40) + '...' : newMsg.content;

    res.status(201).json(newMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

// PUT /api/messages/conversations/:id/read - mark conversation as read
messagesRouter.put('/conversations/:id/read', (req: AuthRequest, res: Response) => {
  try {
    const conv = conversations.find((c) => c.id === req.params.id);
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    conv.unreadCount = 0;
    messages
      .filter((m) => m.conversationId === req.params.id)
      .forEach((m) => { m.read = true; });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du marquage comme lu' });
  }
});
