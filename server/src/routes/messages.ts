import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const messagesRouter = Router();

/* ─── Seed demo conversations + messages if empty ─── */
async function seedMessagesIfEmpty() {
  const count = await prisma.conversation.count();
  if (count > 0) return;

  const convos = [
    { id: 'transgourmet', name: 'Transgourmet - Commercial', participants: ['transgourmet', 'me'], lastMessage: 'Votre commande #1247 a été expédiée', unreadCount: 2, isGroup: false, avatar: 'TC' },
    { id: 'metro', name: 'Metro - Service client', participants: ['metro', 'me'], lastMessage: 'Nouvelle promotion disponible', unreadCount: 1, isGroup: false, avatar: 'MS' },
    { id: 'cuisine', name: 'Équipe Cuisine', participants: ['sofia', 'lucas', 'cuisine', 'me'], lastMessage: 'Chef: Le poisson est arrivé', unreadCount: 0, isGroup: true, avatar: 'EC' },
    { id: 'sofia', name: 'Sofia M. - Pâtissière', participants: ['sofia', 'me'], lastMessage: 'Je serai en retard demain', unreadCount: 0, isGroup: false, avatar: 'SM' },
    { id: 'pomona', name: 'Fournisseur Pomona', participants: ['pomona', 'me'], lastMessage: 'Devis envoyé pour les légumes bio', unreadCount: 0, isGroup: false, avatar: 'FP' },
  ];

  for (const c of convos) {
    await prisma.conversation.create({ data: c });
  }

  const msgs = [
    { conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Bonjour, votre commande #1247 a été préparée.', timestamp: '10:15', read: true },
    { conversationId: 'transgourmet', senderId: 'me', senderName: 'Moi', content: 'Parfait, merci ! Livraison prévue à quelle heure ?', timestamp: '10:20', read: true },
    { conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Livraison entre 14h et 16h.', timestamp: '10:25', read: true },
    { conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Commande #1247 expédiée — 12 articles — 847,50 €', timestamp: '10:28', read: false },
    { conversationId: 'transgourmet', senderId: 'transgourmet', senderName: 'Transgourmet', content: 'Votre commande #1247 a été expédiée', timestamp: '10:30', read: false },
    { conversationId: 'metro', senderId: 'me', senderName: 'Moi', content: 'Bonjour, je cherche des offres sur les produits frais cette semaine.', timestamp: 'Hier 09:00', read: true },
    { conversationId: 'metro', senderId: 'metro', senderName: 'Metro', content: 'Bonjour ! Nous avons -20% sur les légumes bio et -15% sur la volaille.', timestamp: 'Hier 09:45', read: true },
    { conversationId: 'metro', senderId: 'metro', senderName: 'Metro', content: 'Nouvelle promotion disponible', timestamp: 'Hier 14:30', read: false },
    { conversationId: 'cuisine', senderId: 'lucas', senderName: 'Lucas D.', content: 'Les légumes du jour sont arrivés, tout est conforme.', timestamp: '08:30', read: true },
    { conversationId: 'cuisine', senderId: 'me', senderName: 'Moi', content: 'Super, merci Lucas. Sofia, le dessert du jour est prêt ?', timestamp: '08:45', read: true },
    { conversationId: 'cuisine', senderId: 'sofia', senderName: 'Sofia M.', content: 'Oui, tarte tatin prête !', timestamp: '09:00', read: true },
    { conversationId: 'cuisine', senderId: 'lucas', senderName: 'Lucas D.', content: 'Chef: Le poisson est arrivé', timestamp: '09:15', read: true },
    { conversationId: 'sofia', senderId: 'sofia', senderName: 'Sofia M.', content: "Bonjour chef, j'ai testé la nouvelle recette de fondant.", timestamp: 'Lun 14:00', read: true },
    { conversationId: 'sofia', senderId: 'me', senderName: 'Moi', content: "Génial ! Comment ça s'est passé ?", timestamp: 'Lun 14:15', read: true },
    { conversationId: 'sofia', senderId: 'sofia', senderName: 'Sofia M.', content: 'Très bien, je vous montre demain matin.', timestamp: 'Lun 14:20', read: true },
    { conversationId: 'sofia', senderId: 'sofia', senderName: 'Sofia M.', content: 'Je serai en retard demain', timestamp: 'Lun 16:30', read: true },
    { conversationId: 'pomona', senderId: 'me', senderName: 'Moi', content: 'Bonjour, pouvez-vous me faire un devis pour les légumes bio ?', timestamp: '25/03 10:00', read: true },
    { conversationId: 'pomona', senderId: 'pomona', senderName: 'Pomona', content: "Bien sûr, je prépare ça et vous l'envoie dans l'après-midi.", timestamp: '25/03 10:30', read: true },
    { conversationId: 'pomona', senderId: 'pomona', senderName: 'Pomona', content: 'Devis envoyé pour les légumes bio', timestamp: '25/03 15:00', read: true },
  ];

  await prisma.message.createMany({ data: msgs });
}

seedMessagesIfEmpty().catch(console.error);

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/messages/conversations - list all conversations
messagesRouter.get('/conversations', async (_req: AuthRequest, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
});

// GET /api/messages/conversations/:id - get messages for a conversation
messagesRouter.get('/conversations/:id', async (req: AuthRequest, res: Response) => {
  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: req.params.id },
    });
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const convMessages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { id: 'asc' },
    });

    res.json({ conversation: conv, messages: convMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// POST /api/messages/conversations - create new conversation
messagesRouter.post('/conversations', async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, participants, isGroup, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const convId = id || Date.now().toString();
    const existing = await prisma.conversation.findUnique({ where: { id: convId } });
    if (existing) {
      return res.json(existing);
    }

    const newConv = await prisma.conversation.create({
      data: {
        id: convId,
        name: name.trim(),
        participants: participants || [],
        isGroup: isGroup || false,
        avatar: avatar || name.slice(0, 2).toUpperCase(),
      },
    });

    res.status(201).json(newConv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }
});

// POST /api/messages/conversations/:id/messages - send a message
messagesRouter.post('/conversations/:id/messages', async (req: AuthRequest, res: Response) => {
  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: req.params.id },
    });
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const { content, senderId, senderName } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Le contenu est requis' });
    }

    const trimmedContent = content.trim();

    const newMsg = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId: senderId || 'me',
        senderName: senderName || 'Moi',
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
    });

    // Update conversation's lastMessage
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: {
        lastMessage: trimmedContent.length > 40 ? trimmedContent.slice(0, 40) + '...' : trimmedContent,
      },
    });

    res.status(201).json(newMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

// PUT /api/messages/conversations/:id/read - mark conversation as read
messagesRouter.put('/conversations/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: req.params.id },
    });
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { unreadCount: 0 },
    });

    await prisma.message.updateMany({
      where: { conversationId: req.params.id },
      data: { read: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du marquage comme lu' });
  }
});
