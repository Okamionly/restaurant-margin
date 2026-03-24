import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { ingredientsRouter } from './routes/ingredients';
import { recipesRouter } from './routes/recipes';
import { suppliersRouter } from './routes/suppliers';
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
app.use('/api/ingredients', authMiddleware, ingredientsRouter);
app.use('/api/recipes', authMiddleware, recipesRouter);
app.use('/api/suppliers', authMiddleware, suppliersRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
