import { Router, Request, Response } from 'express';
import { Resend } from 'resend';
import { validate, contactSchema } from '../utils/validation';

export const contactRouter = Router();

// Simple in-memory rate limit
const rateLimit = new Map<string, number[]>();

contactRouter.post('/', validate(contactSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, source } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Nom et email requis' });
    }

    // Rate limit: 5 per email per hour
    const now = Date.now();
    const key = email.toLowerCase().trim();
    const attempts = (rateLimit.get(key) || []).filter(t => now - t < 3600000);
    if (attempts.length >= 5) {
      return res.status(429).json({ error: 'Trop de demandes. Réessayez plus tard.' });
    }
    attempts.push(now);
    rateLimit.set(key, attempts);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not set');
      return res.status(500).json({ error: 'Service email non configuré' });
    }

    const resend = new Resend(apiKey);

    const sourceLabels: Record<string, string> = {
      'kit-station': 'Kit Station WeighStation',
      'pro-waitlist': 'Liste d\'attente Pro',
      'enterprise-devis': 'Devis Enterprise',
    };
    const sourceLabel = sourceLabels[source] || source || 'Contact';

    // 1. Notification to admin
    await resend.emails.send({
      from: 'RestauMargin <onboarding@resend.dev>',
      to: 'Mr.guessousyoussef@gmail.com',
      subject: `[RestauMargin] Nouvelle demande — ${sourceLabel}`,
      html: `
        <h2>Nouvelle demande de contact</h2>
        <p><strong>Source :</strong> ${sourceLabel}</p>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
        ${message ? `<p><strong>Message :</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
        <hr>
        <p style="color:#666;font-size:12px;">Envoyé depuis restaumargin.vercel.app</p>
      `,
    });

    // 2. Confirmation to submitter
    await resend.emails.send({
      from: 'RestauMargin <onboarding@resend.dev>',
      to: email.trim(),
      subject: 'RestauMargin — Votre demande a bien été reçue',
      html: `
        <h2>Merci ${name} !</h2>
        <p>Nous avons bien reçu votre demande (${sourceLabel}).</p>
        <p>Notre équipe reviendra vers vous dans les plus brefs délais.</p>
        <br>
        <p>Cordialement,<br>L'équipe RestauMargin</p>
      `,
    });

    console.log(`Contact form submitted: ${sourceLabel} from ${email}`);
    res.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi. Veuillez réessayer.' });
  }
});
