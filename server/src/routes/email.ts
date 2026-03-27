import { Router, Response } from 'express';
import nodemailer from 'nodemailer';
import { AuthRequest } from '../middleware/auth';

export const emailRouter = Router();

// ── Types ────────────────────────────────────────────────────────────────────
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

// ── In-memory storage ────────────────────────────────────────────────────────
const sentEmails: SentEmail[] = [];

// ── Transporter ──────────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ── POST /api/email/send — send a real email ─────────────────────────────────
emailRouter.post('/send', async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, body, from } = req.body;

    if (!to || !to.trim()) {
      return res.status(400).json({ error: 'Le destinataire est requis' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ error: "L'objet est requis" });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Le corps du message est requis' });
    }

    const senderEmail = from || process.env.EMAIL_USER;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'Configuration email serveur manquante (EMAIL_USER / EMAIL_PASS)' });
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"RestauMargin" <${process.env.EMAIL_USER}>`,
      replyTo: senderEmail,
      to: to.trim(),
      subject: subject.trim(),
      text: body.trim(),
    });

    const sent: SentEmail = {
      id: Date.now().toString(),
      to: to.trim(),
      from: senderEmail as string,
      subject: subject.trim(),
      body: body.trim(),
      messageId: info.messageId,
      sentAt: new Date().toISOString(),
      userId: req.user?.userId ?? 0,
    };

    sentEmails.unshift(sent);

    console.log(`Email sent to ${to} — messageId: ${info.messageId}`);

    res.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Email send error:', error);

    let msg = "Erreur lors de l'envoi de l'email";
    if (error?.responseCode === 535) {
      msg = 'Authentification SMTP échouée — vérifiez EMAIL_USER / EMAIL_PASS';
    } else if (error?.code === 'ECONNREFUSED') {
      msg = 'Connexion au serveur SMTP refusée';
    } else if (error?.message) {
      msg = error.message;
    }

    res.status(500).json({ error: msg });
  }
});

// ── GET /api/email/sent — list sent emails ───────────────────────────────────
emailRouter.get('/sent', (req: AuthRequest, res: Response) => {
  try {
    // Return all sent emails (optionally filter by userId later)
    res.json(sentEmails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des emails envoyés' });
  }
});
