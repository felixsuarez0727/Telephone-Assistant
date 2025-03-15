import { Hono } from 'hono';
import { callController } from '../controllers/callController';
import { reservationController } from '../controllers/reservationController';
import { miscController } from '../controllers/miscController';
import { logger } from '../utils/logger';
import { makeCall } from '../utils/makeCall';

export const routes = (app: Hono) => {
  // Middleware de logging
  app.use('*', async (c, next) => {
    const method = c.req.method;
    const path = c.req.path;
    logger.info(`${method} ${path}`);
    await next();
  });

  app.post('/', async (c) => {
    logger.info('Solicitud POST recibida en la ruta raíz - Redirigiendo a handleIncomingCall');
    return callController.handleIncomingCall(c);
  });

  app.post('/test-twiml', async (c) => {
    logger.info('Solicitud recibida en la ruta de prueba TwiML');
    const data = await c.req.parseBody();
    logger.info(`Datos recibidos: ${JSON.stringify(data)}`);
    
    const twiml = new (require('twilio').twiml.VoiceResponse)();
    twiml.say({ voice: 'woman', language: 'es-MX' } as any, 'Esta es una prueba en español. La API está funcionando correctamente.');
    twiml.pause({ length: 1 });
    twiml.say({ voice: 'woman', language: 'es-MX' } as any, 'Ahora vamos a colgar. Adiós.');
    twiml.hangup();
    
    return c.text(twiml.toString(), 200, { 'Content-Type': 'text/xml' });
  });

  app.get('/', (c) => {
    return c.text('Asistente Telefónico API está funcionando');
  });

  app.get('/api/test-call', async (c) => {
    try {
      const callSid = await makeCall();
      return c.json({ success: true, callSid });
    } catch (error: any) {
      logger.error(`Error al realizar llamada de prueba: ${error.message}`);
      return c.json({ success: false, error: error.message }, 500);
    }
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