import { Router, Response } from 'express';
import { Resend } from 'resend';
import { AuthRequest } from '../middleware/auth';

export const emailRouter = Router();

interface SentEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
  messageId: string;
  sentAt: string;
  userId: number;
}

const sentEmails: SentEmail[] = [];

// POST /api/email/send — send a real email via Resend
emailRouter.post('/send', async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, body } = req.body;

    if (!to?.trim()) return res.status(400).json({ error: 'Le destinataire est requis' });
    if (!subject?.trim()) return res.status(400).json({ error: "L'objet est requis" });
    if (!body?.trim()) return res.status(400).json({ error: 'Le corps du message est requis' });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Clé API Resend manquante (RESEND_API_KEY)' });

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'RestauMargin <onboarding@resend.dev>',
      to: to.trim(),
      subject: subject.trim(),
      html: body.trim().replace(/\n/g, '<br>'),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message || "Erreur lors de l'envoi" });
    }

    const sent: SentEmail = {
      id: Date.now().toString(),
      to: to.trim(),
      from: 'onboarding@resend.dev',
      subject: subject.trim(),
      body: body.trim(),
      messageId: data?.id || '',
      sentAt: new Date().toISOString(),
      userId: req.user?.userId ?? 0,
    };

    sentEmails.unshift(sent);
    console.log(`Email sent to ${to} via Resend — id: ${data?.id}`);
    res.json({ success: true, messageId: data?.id });
  } catch (error: any) {
    console.error('Email send error:', error);
    res.status(500).json({ error: error.message || "Erreur lors de l'envoi de l'email" });
  }
});

// GET /api/email/sent — list sent emails
emailRouter.get('/sent', (req: AuthRequest, res: Response) => {
  res.json(sentEmails);
});
