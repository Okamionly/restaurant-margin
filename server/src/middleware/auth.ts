import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
  restaurantId?: number;
}

/** Basic auth — validates JWT only (for auth routes, restaurant routes) */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou invalide' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token expiré ou invalide' });
  }
}

/** Full auth — validates JWT + X-Restaurant-Id header + membership (for data routes) */
export async function authWithRestaurant(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou invalide' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
  } catch {
    res.status(401).json({ error: 'Token expiré ou invalide' });
    return;
  }

  const restaurantHeader = req.headers['x-restaurant-id'];
  if (!restaurantHeader) {
    res.status(400).json({ error: 'X-Restaurant-Id header requis' });
    return;
  }

  const restaurantId = parseInt(String(restaurantHeader), 10);
  if (isNaN(restaurantId)) {
    res.status(400).json({ error: 'X-Restaurant-Id invalide' });
    return;
  }

  try {
    const member = await prisma.restaurantMember.findFirst({
      where: { userId: req.user!.userId, restaurantId },
    });
    if (!member) {
      res.status(403).json({ error: 'Accès refusé à ce restaurant' });
      return;
    }
    req.restaurantId = restaurantId;
    next();
  } catch {
    res.status(500).json({ error: 'Erreur vérification restaurant' });
  }
}
