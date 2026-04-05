const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('CRITICAL: JWT_SECRET environment variable is required. Server cannot start without it.');
}
export const JWT_SECRET = jwtSecret;
export const TOKEN_EXPIRY = '7d';
export const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://restaumargin.vercel.app',
];
