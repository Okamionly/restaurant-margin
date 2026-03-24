import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest, authMiddleware, JwtPayload } from '../middleware/auth';

const prisma = new PrismaClient();
export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'restau-margin-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d';

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
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, mot de passe et nom sont requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Check if any users exist
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      // Users exist: only an authenticated admin can create new users
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Seul un administrateur peut créer de nouveaux utilisateurs' });
      }

      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload;
        if (decoded.role !== 'admin') {
          return res.status(403).json({ error: 'Seul un administrateur peut créer de nouveaux utilisateurs' });
        }
      } catch {
        return res.status(403).json({ error: 'Token invalide' });
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

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
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

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
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

    if (targetId === req.user!.userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await prisma.user.delete({ where: { id: targetId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});
