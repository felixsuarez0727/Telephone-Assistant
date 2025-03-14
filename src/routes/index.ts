import { Hono } from 'hono';
import { callController } from '../controllers/callController';
import { reservationController } from '../controllers/reservationController';
import { miscController } from '../controllers/miscController';
import { logger } from '../utils/logger';

export const routes = (app: Hono) => {
  // Middleware the logging
  app.use('*', async (c, next) => {
    const method = c.req.method;
    const path = c.req.path;
    logger.info(`${method} ${path}`);
    await next();
  });

  app.post('/', (c) => {
    logger.info('Solicitud recibida en la ruta raíz');
    const twiml = new (require('twilio').twiml.VoiceResponse)();
    twiml.say({ voice: 'woman', language: 'es-MX' }, 'Esta es una prueba en español.');
    twiml.hangup();
    return c.text(twiml.toString(), 200, { 'Content-Type': 'text/xml' });
  });

  // Route for status test
  app.get('/', (c) => {
    return c.text('Asistente Telefónico API está funcionando');
  });

  // Routes for telephone calls
  app.post('/api/incoming-call', callController.handleIncomingCall);
  app.post('/api/respond', callController.handleUserResponse);
  
  // Routes for reservations (if a web interface is implemented)
  app.post('/api/reservations', reservationController.createReservation);
  app.get('/api/reservations', reservationController.getReservations);

  // Miscellaneous and system routes
  app.get('/api/health', miscController.healthCheck);
  app.get('/api/stats', miscController.getStats);
  app.get('/api/config', miscController.getConfig);
  app.all('/api/echo', miscController.echo);

  // Handling of routes not found
  app.notFound((c) => {
    logger.warn(`Ruta no encontrada: ${c.req.path}`);
    return c.text('Ruta no encontrada', 404);
  });

  // Global error handling
  app.onError((err, c) => {
    logger.error(`Error: ${err.message}`);
    logger.error(err.stack || '');
    return c.text('Error interno del servidor', 500);
  });
};