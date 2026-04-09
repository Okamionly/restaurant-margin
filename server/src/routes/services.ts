import { Router, Response } from 'express';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

export const servicesRouter = Router();

// In-memory store (persisted per-server instance; real production would use Prisma)
// Each entry: { id, restaurantId, type, date, startTime, endTime, orders, stats }
const servicesStore: Map<string, any[]> = new Map();

function getKey(restaurantId: number): string {
  return `restaurant-${restaurantId}`;
}

// GET /api/services — list past services for this restaurant
servicesRouter.get('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const services = servicesStore.get(getKey(restaurantId)) || [];
    const { from, to } = req.query;

    let filtered = services;
    if (from) filtered = filtered.filter(s => s.date >= from);
    if (to) filtered = filtered.filter(s => s.date <= to);

    // Sort by date descending
    filtered.sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Erreur lors de la recuperation des services' });
  }
});

// POST /api/services — save a completed service
servicesRouter.post('/', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const key = getKey(restaurantId);
    const services = servicesStore.get(key) || [];

    const service = {
      id: `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      restaurantId,
      ...req.body,
      savedAt: new Date().toISOString(),
    };

    services.push(service);
    servicesStore.set(key, services);

    res.status(201).json(service);
  } catch (error) {
    console.error('Error saving service:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du service' });
  }
});

// GET /api/services/:id — get a single service
servicesRouter.get('/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const restaurantId = req.restaurantId!;
    const services = servicesStore.get(getKey(restaurantId)) || [];
    const service = services.find(s => s.id === req.params.id);

    if (!service) {
      res.status(404).json({ error: 'Service non trouve' });
      return;
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Erreur lors de la recuperation du service' });
  }
});
