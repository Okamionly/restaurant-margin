import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Resend } from 'resend';
import { AuthRequest, authMiddleware, JwtPayload } from '../middleware/auth';
import { JWT_SECRET, TOKEN_EXPIRY } from '../config';

const prisma = new PrismaClient();
export const authRouter = Router();

const INVITATION_CODE = process.env.INVITATION_CODE || 'RESTAUMARGIN2024';

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// GET /first-user - check if this is the first user registration
authRouter.get('/first-user', async (_req: AuthRequest, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.json({ isFirstUser: count === 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /register
authRouter.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, invitationCode, role: requestedRole } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, mot de passe et nom sont requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Check if any users exist
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      // Users exist: check invitation code or admin token
      const authHeader = req.headers.authorization;
      const hasAdminToken = authHeader && authHeader.startsWith('Bearer ');

      if (hasAdminToken) {
        // Admin creating a user (existing behavior)
        try {
          const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload;
          if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Seul un administrateur peut créer de nouveaux utilisateurs' });
          }
        } catch {
          return res.status(403).json({ error: 'Token invalide' });
        }
      } else {
        // Self-registration: require invitation code
        if (!invitationCode) {
          return res.status(400).json({ error: "Le code d'invitation est requis" });
        }
        if (invitationCode !== INVITATION_CODE) {
          return res.status(403).json({ error: "Code d'invitation invalide" });
        }
      }
    }

    // Check if email already taken
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = userCount === 0 ? 'admin' : 'chef';

    const user = await prisma.user.create({
      data: { email, passwordHash, name, role },
    });

    // After user creation, create default restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name: `Restaurant de ${user.name}`,
        ownerId: user.id,
        members: { create: { userId: user.id, role: 'owner' } },
      },
    });

    // Generate verification token and mark email as unverified
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: false, verificationToken },
    });

    // Send verification email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const frontendUrl = process.env.FRONTEND_URL || 'https://restaumargin.vercel.app';
        const verifyLink = `${frontendUrl}/login?verify=${verificationToken}`;

        await resend.emails.send({
          from: 'RestauMargin <onboarding@resend.dev>',
          to: user.email,
          subject: 'RestauMargin — Vérifiez votre adresse email',
          html: `
            <h2>Bienvenue sur RestauMargin !</h2>
            <p>Bonjour ${user.name},</p>
            <p>Merci de vous être inscrit. Veuillez vérifier votre adresse email :</p>
            <p><a href="${verifyLink}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Vérifier mon email</a></p>
            <p>Ce lien expire dans 24 heures.</p>
            <br>
            <p>L'équipe RestauMargin</p>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send verification email:', emailErr);
      }
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: false },
      restaurant: { id: restaurant.id, name: restaurant.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// GET /verify-email
authRouter.get('/verify-email', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.status(400).json({ error: 'Token manquant' });

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) return res.status(400).json({ error: 'Token invalide' });

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    res.json({ success: true, message: 'Email vérifié avec succès' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /resend-verification
authRouter.post('/resend-verification', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    if (user.emailVerified) return res.json({ message: 'Email déjà vérifié' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const frontendUrl = process.env.FRONTEND_URL || 'https://restaumargin.vercel.app';
      const verifyLink = `${frontendUrl}/login?verify=${verificationToken}`;

      await resend.emails.send({
        from: 'RestauMargin <onboarding@resend.dev>',
        to: user.email,
        subject: 'RestauMargin — Vérifiez votre adresse email',
        html: `
          <h2>Vérification d'email</h2>
          <p>Bonjour ${user.name},</p>
          <p><a href="${verifyLink}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Vérifier mon email</a></p>
          <br>
          <p>L'équipe RestauMargin</p>
        `,
      });
    }

    res.json({ message: 'Email de vérification envoyé' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /login
authRouter.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const membership = await prisma.restaurantMember.findFirst({
      where: { userId: user.id },
      include: { restaurant: true },
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified },
      restaurant: membership?.restaurant || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// GET /me (protected)
authRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, role: true, emailVerified: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /users (admin only)
authRouter.get('/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /users/:id (admin only)
authRouter.delete('/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }

    const targetId = parseInt(req.params.id as string);
    if (isNaN(targetId)) return res.status(400).json({ error: 'ID invalide' });

    if (targetId === req.user!.userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await prisma.user.delete({ where: { id: targetId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// POST /forgot-password
authRouter.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    // Always return same message (prevent email enumeration)
    const genericMsg = 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.';

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.json({ message: genericMsg });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'https://restaumargin.vercel.app';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: 'RestauMargin <onboarding@resend.dev>',
        to: user.email,
        subject: 'RestauMargin — Réinitialisation de votre mot de passe',
        html: `
          <h2>Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.name},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p><a href="${resetLink}" style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Réinitialiser mon mot de passe</a></p>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          <br>
          <p>L'équipe RestauMargin</p>
        `,
      });
    }

    res.json({ message: genericMsg });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /reset-password
authRouter.post('/reset-password', async (req: AuthRequest, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) return res.status(400).json({ error: 'Lien invalide ou expiré' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
