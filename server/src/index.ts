import express from 'express';
import cors from 'cors';
import { ALLOWED_ORIGINS } from './config';
import { authRouter } from './routes/auth';
import { ingredientsRouter } from './routes/ingredients';
import { recipesRouter } from './routes/recipes';
import { suppliersRouter } from './routes/suppliers';
import { inventoryRouter } from './routes/inventory';
import { invoicesRouter } from './routes/invoices';
import { priceHistoryRouter } from './routes/priceHistory';
import { menuSalesRouter } from './routes/menuSales';
import { messagesRouter } from './routes/messages';
import { menuEngineeringRouter } from './routes/menuEngineering';
import { publicMenuRouter } from './routes/publicMenu';
import { contactRouter } from './routes/contact';
import { emailRouter } from './routes/email';
import restaurantsRouter from './routes/restaurants';
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
}));
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/public', publicMenuRouter);
app.use('/api/contact', contactRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
app.use('/api/ingredients', authMiddleware, ingredientsRouter);
app.use('/api/recipes', authMiddleware, recipesRouter);
app.use('/api/suppliers', authMiddleware, suppliersRouter);
app.use('/api/inventory', authMiddleware, inventoryRouter);
app.use('/api/invoices', authMiddleware, invoicesRouter);
app.use('/api/price-history', authMiddleware, priceHistoryRouter);
app.use('/api/menu-sales', authMiddleware, menuSalesRouter);
app.use('/api/messages', authMiddleware, messagesRouter);
app.use('/api/menu-engineering', authMiddleware, menuEngineeringRouter);
app.use('/api/email', authMiddleware, emailRouter);
app.use('/api/restaurants', restaurantsRouter);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
