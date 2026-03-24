import express from 'express';
import cors from 'cors';
import { authRouter } from '../server/src/routes/auth';
import { ingredientsRouter } from '../server/src/routes/ingredients';
import { recipesRouter } from '../server/src/routes/recipes';
import { authMiddleware } from '../server/src/middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: 'vercel' });
});

// Protected routes
app.use('/api/ingredients', authMiddleware, ingredientsRouter);
app.use('/api/recipes', authMiddleware, recipesRouter);

export default app;
