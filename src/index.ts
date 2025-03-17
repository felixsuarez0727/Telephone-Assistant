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

const server = serve({
  fetch: app.fetch,
  port: port,
}, (info) => {
  logger.info(`Servidor ejecutándose en http://localhost:${info.port}`);
});

const gracefulShutdown = () => {
  logger.info('Recibida señal de cierre. Cerrando servidor...');
  server.close(() => {
    logger.info('Servidor cerrado correctamente.');
    process.exit(0);
  });
  
  setTimeout(() => {
    logger.error('No se pudo cerrar correctamente, forzando cierre.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default app;