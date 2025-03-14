import { Context } from 'hono';
import { logger } from '../utils/logger';
import { openai } from '../config/openai';
import { twilioClient } from '../config/twilio';

export const miscController = {
  /**
   * Checks system status and dependencies
   */
  async healthCheck(c: Context): Promise<Response> {
    try {
      const healthStatus = {
        server: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        dependencies: {
          openai: 'checking',
          twilio: 'checking'
        }
      };

      // Verify connection to OpenAI
      try {
        await openai.models.list();
        healthStatus.dependencies.openai = 'ok';
      } catch (error) {
        healthStatus.dependencies.openai = 'error';
        logger.warn('Error al verificar conexión con OpenAI');
      }

      // Verify connection to Twilio
      try {
        // Make sure TWILIO_ACCOUNT_SID exists
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        if (accountSid) {
          await twilioClient.api.accounts(accountSid).fetch();
          healthStatus.dependencies.twilio = 'ok';
        } else {
          throw new Error('TWILIO_ACCOUNT_SID is undefined');
        }
      } catch (error) {
        healthStatus.dependencies.twilio = 'error';
        logger.warn('Error al verificar conexión con Twilio');
      }

      const allOk = Object.values(healthStatus.dependencies).every(status => status === 'ok');
      
      return c.json(healthStatus, allOk ? 200 : 503);
    } catch (error: any) {
      logger.error(`Error en health check: ${error.message}`);
      return c.json({ 
        status: 'error',
        message: 'Error al verificar estado del sistema'
      }, 500);
    }
  },

  /**
   * Obtains basic system statistics
   */
  async getStats(c: Context): Promise<Response> {
    try {
      // Here you could implement real statistics based on metrics
      // For this example, we use fictitious data.
      const stats = {
        totalCalls: 123,
        activeCalls: 2,
        averageCallDuration: '2m 35s',
        successRate: '94.7%',
        aiResponseTime: '1.8s',
        popularTopics: [
          { topic: 'reservations', count: 78 },
          { topic: 'menu', count: 45 },
          { topic: 'hours', count: 32 }
        ],
        lastUpdated: new Date().toISOString()
      };

      return c.json(stats);
    } catch (error: any) {
      logger.error(`Error al obtener estadísticas: ${error.message}`);
      return c.json({ 
        success: false, 
        error: 'Error al obtener estadísticas del sistema' 
      }, 500);
    }
  },

  /**
   * Gets the current system configuration
   * In a real system, this would require authentication.
   */
  async getConfig(c: Context): Promise<Response> {
    try {
      // Here we should validate the authentication before exposing the configuration
      // For this example, we simply return some non-sensitive parameters
      const config = {
        restaurantName: process.env.RESTAURANT_NAME,
        openingHours: process.env.RESTAURANT_OPENING_HOURS,
        maxReservationSize: parseInt(process.env.MAX_RESERVATION_SIZE || '10'),
        aiModel: process.env.OPENAI_MODEL,
        twilioPhone: process.env.TWILIO_PHONE_NUMBER,
        // We avoid including API keys or other sensitive information.
        systemLanguage: 'es-MX',
        lastUpdated: new Date().toISOString()
      };

      return c.json(config);
    } catch (error: any) {
      logger.error(`Error al obtener configuración: ${error.message}`);
      return c.json({ 
        success: false, 
        error: 'Error al obtener configuración del sistema' 
      }, 500);
    }
  },

  /**
   * Endpoint for echo testing - returns sent data
   * Useful for debugging and testing
   */
  async echo(c: Context): Promise<Response> {
    try {
      const method = c.req.method;
      const headers = Object.fromEntries(c.req.headers.entries());
      let body = null;

      // Attempt to obtain the body depending on the method
      if (method !== 'GET' && method !== 'HEAD') {
        try {
          body = await c.req.json();
        } catch (e) {
          try {
            body = await c.req.parseBody();
          } catch (e2) {
            body = { note: "No se pudo parsear el cuerpo de la solicitud" };
          }
        }
      }

      const response = {
        echo: true,
        timestamp: new Date().toISOString(),
        request: {
          method,
          url: c.req.url,
          path: c.req.path,
          query: Object.fromEntries(new URL(c.req.url).searchParams.entries()),
          headers: {
            ...headers,
            authorization: headers.authorization ? '[FILTERED]' : undefined,
            cookie: headers.cookie ? '[FILTERED]' : undefined
          },
          body
        }
      };

      return c.json(response);
    } catch (error: any) {
      logger.error(`Error en endpoint echo: ${error.message}`);
      return c.json({ 
        success: false, 
        error: 'Error al procesar solicitud echo' 
      }, 500);
    }
  }
};