import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authWithRestaurant, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
export const planningRouter = Router();

// ─── EMPLOYEES ───────────────────────────────────────────────

// GET /api/planning/employees — list active employees
planningRouter.get('/employees', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { restaurantId: req.restaurantId!, active: true },
      orderBy: { name: 'asc' },
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des employés' });
  }
});

// POST /api/planning/employees — create employee
planningRouter.post('/employees', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, email, phone, hourlyRate, color } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: 'Champs requis : name, role' });
    }

    const validRoles = ['Chef', 'Commis', 'Serveur', 'Plongeur', 'Barman', 'Manager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Rôle invalide. Valeurs acceptées : ${validRoles.join(', ')}` });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        email: email || null,
        phone: phone || null,
        hourlyRate: hourlyRate ?? 12,
        color: color || '#3b82f6',
        restaurantId: req.restaurantId!,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: "Erreur lors de la création de l'employé" });
  }
});

// PUT /api/planning/employees/:id — update employee
planningRouter.put('/employees/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const existing = await prisma.employee.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Employé non trouvé' });

    const { name, role, email, phone, hourlyRate, color, active } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(email !== undefined && { email: email || null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(hourlyRate !== undefined && { hourlyRate }),
        ...(color !== undefined && { color }),
        ...(active !== undefined && { active }),
      },
    });

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'employé" });
  }
});

// DELETE /api/planning/employees/:id — soft delete (set active=false)
planningRouter.delete('/employees/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const existing = await prisma.employee.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Employé non trouvé' });

    await prisma.employee.update({
      where: { id },
      data: { active: false },
    });

    res.json({ message: 'Employé désactivé' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'employé" });
  }
});

// ─── SHIFTS ──────────────────────────────────────────────────

// GET /api/planning/shifts — list shifts with filters
planningRouter.get('/shifts', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to, employeeId } = req.query;
    const where: any = { restaurantId: req.restaurantId! };

    if (from || to) {
      where.date = {};
      if (from) where.date.gte = from as string;
      if (to) where.date.lte = to as string;
    }

    if (employeeId) {
      where.employeeId = parseInt(employeeId as string);
    }

    const shifts = await prisma.shift.findMany({
      where,
      include: { employee: { select: { id: true, name: true, role: true, color: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    res.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des shifts' });
  }
});

// POST /api/planning/shifts — create shift
planningRouter.post('/shifts', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { employeeId, date, startTime, endTime, type, notes } = req.body;

    if (!employeeId || !date || !startTime || !endTime || !type) {
      return res.status(400).json({ error: 'Champs requis : employeeId, date, startTime, endTime, type' });
    }

    const validTypes = ['Matin', 'Midi', 'Soir', 'Coupure'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Type invalide. Valeurs acceptées : ${validTypes.join(', ')}` });
    }

    // Verify employee belongs to this restaurant
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, restaurantId: req.restaurantId!, active: true },
    });
    if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });

    const shift = await prisma.shift.create({
      data: {
        employeeId,
        date,
        startTime,
        endTime,
        type,
        notes: notes || null,
        restaurantId: req.restaurantId!,
      },
      include: { employee: { select: { id: true, name: true, role: true, color: true } } },
    });

    res.status(201).json(shift);
  } catch (error) {
    console.error('Error creating shift:', error);
    res.status(500).json({ error: 'Erreur lors de la création du shift' });
  }
});

// PUT /api/planning/shifts/:id — update shift
planningRouter.put('/shifts/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const existing = await prisma.shift.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Shift non trouvé' });

    const { employeeId, date, startTime, endTime, type, notes } = req.body;

    // If changing employee, verify it belongs to the restaurant
    if (employeeId && employeeId !== existing.employeeId) {
      const employee = await prisma.employee.findFirst({
        where: { id: employeeId, restaurantId: req.restaurantId!, active: true },
      });
      if (!employee) return res.status(404).json({ error: 'Employé non trouvé' });
    }

    const shift = await prisma.shift.update({
      where: { id },
      data: {
        ...(employeeId !== undefined && { employeeId }),
        ...(date !== undefined && { date }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(type !== undefined && { type }),
        ...(notes !== undefined && { notes: notes || null }),
      },
      include: { employee: { select: { id: true, name: true, role: true, color: true } } },
    });

    res.json(shift);
  } catch (error) {
    console.error('Error updating shift:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du shift' });
  }
});

// DELETE /api/planning/shifts/:id — delete shift
planningRouter.delete('/shifts/:id', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const existing = await prisma.shift.findFirst({
      where: { id, restaurantId: req.restaurantId! },
    });
    if (!existing) return res.status(404).json({ error: 'Shift non trouvé' });

    await prisma.shift.delete({ where: { id } });
    res.json({ message: 'Shift supprimé' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du shift' });
  }
});

// ─── SUMMARY ─────────────────────────────────────────────────

// GET /api/planning/summary — weekly hours per employee + total labor cost
planningRouter.get('/summary', authWithRestaurant, async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'Paramètres requis : from, to (YYYY-MM-DD)' });
    }

    const shifts = await prisma.shift.findMany({
      where: {
        restaurantId: req.restaurantId!,
        date: { gte: from as string, lte: to as string },
      },
      include: { employee: { select: { id: true, name: true, role: true, hourlyRate: true, color: true } } },
    });

    // Calculate hours per employee
    const employeeMap = new Map<number, {
      id: number;
      name: string;
      role: string;
      color: string;
      hourlyRate: number;
      totalHours: number;
      totalCost: number;
      shiftCount: number;
    }>();

    for (const shift of shifts) {
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);
      let hours = (endH + endM / 60) - (startH + startM / 60);
      if (hours < 0) hours += 24; // overnight shift

      const existing = employeeMap.get(shift.employeeId) || {
        id: shift.employee.id,
        name: shift.employee.name,
        role: shift.employee.role,
        color: shift.employee.color,
        hourlyRate: shift.employee.hourlyRate,
        totalHours: 0,
        totalCost: 0,
        shiftCount: 0,
      };

      existing.totalHours += hours;
      existing.totalCost += hours * shift.employee.hourlyRate;
      existing.shiftCount++;
      employeeMap.set(shift.employeeId, existing);
    }

    const employees = Array.from(employeeMap.values()).map((e) => ({
      ...e,
      totalHours: Math.round(e.totalHours * 100) / 100,
      totalCost: Math.round(e.totalCost * 100) / 100,
    }));

    const totalHours = employees.reduce((sum, e) => sum + e.totalHours, 0);
    const totalCost = employees.reduce((sum, e) => sum + e.totalCost, 0);

    res.json({
      from,
      to,
      employees,
      totalHours: Math.round(totalHours * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      totalShifts: shifts.length,
    });
  } catch (error) {
    console.error('Error fetching planning summary:', error);
    res.status(500).json({ error: 'Erreur lors du calcul du résumé planning' });
  }
});
