import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const messagesRouter = Router();

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /api/messages/conversations - list all conversations
messagesRouter.get('/conversations', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { restaurantId: req.restaurantId! },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
});

// GET /api/messages/conversations/:id - get messages for a conversation
messagesRouter.get('/conversations/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const conv = await prisma.conversation.findFirst({
      where: { id: req.params.id as string, restaurantId: req.restaurantId! },
    });
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const convMessages = await prisma.message.findMany({
      where: { conversationId: req.params.id as string },
      orderBy: { id: 'asc' },
    });

    res.json({ conversation: conv, messages: convMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// POST /api/messages/conversations - create new conversation
messagesRouter.post('/conversations', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { id, name, participants, isGroup, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Le nom est requis' });
    }

    const convId = id || Date.now().toString();
    const existing = await prisma.conversation.findFirst({
      where: { id: convId, restaurantId: req.restaurantId! },
    });
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
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(newConv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  }
});

// POST /api/messages/conversations/:id/messages - send a message
messagesRouter.post('/conversations/:id/messages', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const conv = await prisma.conversation.findFirst({
      where: { id: req.params.id as string, restaurantId: req.restaurantId! },
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
        conversationId: req.params.id as string,
        senderId: senderId || 'me',
        senderName: senderName || 'Moi',
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      },
    });

    // Update conversation's lastMessage
    await prisma.conversation.update({
      where: { id: req.params.id as string },
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
messagesRouter.put('/conversations/:id/read', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const conv = await prisma.conversation.findFirst({
      where: { id: req.params.id as string, restaurantId: req.restaurantId! },
    });
    if (!conv) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    await prisma.conversation.update({
      where: { id: req.params.id as string },
      data: { unreadCount: 0 },
    });

    await prisma.message.updateMany({
      where: { conversationId: req.params.id as string },
      data: { read: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du marquage comme lu' });
  }
});
