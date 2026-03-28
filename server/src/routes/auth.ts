import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      restaurant: { id: restaurant.id, name: restaurant.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
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
      select: { id: true, email: true, name: true, role: true, createdAt: true },
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

// POST /forgot-password (simulated)
authRouter.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }
    // Log for development — in production, send a real email
    console.log(`[forgot-password] Reset requested for: ${email}`);
    res.json({ message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /reset-password (simulated)
authRouter.post('/reset-password', async (req: AuthRequest, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    // Simulated — in production, verify the token and update the password
    console.log(`[reset-password] Token: ${token}, new password length: ${newPassword.length}`);
    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
