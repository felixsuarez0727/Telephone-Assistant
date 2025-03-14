import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import dotenv from 'dotenv';
import { routes } from './routes';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = new Hono();

// Configure routes
routes(app);

// Listen on the configured port
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  logger.info(`Servidor ejecutándose en http://localhost:${info.port}`);
});

export default app;