import { Context } from 'hono';
import { TwilioRequest } from '../types';
import { twilioService } from '../services/twilioService';
import { openaiService } from '../services/openaiService';
import { stateService } from '../services/stateService';
import { logger } from '../utils/logger';
import { DEFAULT_WELCOME_MESSAGE } from '../config/constants';

export const callController = {
  /**
   * Handles an incoming call
   */
  async handleIncomingCall(c: Context): Promise<Response> {
    try {
      logger.info('==== NUEVA LLAMADA ENTRANTE ====');
      logger.info(`URL completa: ${c.req.url}`);
      
      // Obtener datos de la solicitud de Twilio
      const formData = await c.req.parseBody();
      logger.info(`Datos de la solicitud: ${JSON.stringify(formData)}`);
      
      const data = formData as TwilioRequest;
      const { CallSid, From } = data;
      
      logger.debug(`CallSid: ${CallSid}, From: ${From}`);
      
      // Verificar si ya existe un estado para esta llamada en las cookies
      const stateCookie = c.req.cookie('conversationState');
      let state;
      
      if (stateCookie) {
        // Recuperar estado existente
        state = stateService.deserializeState(stateCookie);
        logger.debug('Estado de conversación recuperado de cookie');
      } else {
        // Inicializar nuevo estado
        state = stateService.initializeState(CallSid, From);
        logger.debug('Nuevo estado de conversación inicializado');
      }
      
      // Generar respuesta de bienvenida
      const welcomeMessage = state.messages.find(m => m.role === 'assistant')?.content || DEFAULT_WELCOME_MESSAGE;
      logger.info(`Mensaje de bienvenida: "${welcomeMessage}"`);
      const twimlResponse = twilioService.generateWelcomeResponse(welcomeMessage);
      
      // Almacenar el estado en cookies
      c.cookie('conversationState', stateService.serializeState(state), {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hora
        path: '/'
      });
      
      logger.debug('Enviando respuesta TwiML');
      logger.debug(`TwiML generado: ${twimlResponse}`);
      
      return c.text(twimlResponse, 200, {
        'Content-Type': 'text/xml'
      });
    } catch (error: any) {
      logger.error(`Error en handleIncomingCall: ${error.message}`);
      logger.error(error.stack || '');
      
      // En caso de error, generar una respuesta predeterminada
      const errorTwiml = twilioService.generateVoiceResponse(
        'Lo siento, estamos experimentando dificultades técnicas. Por favor, intenta más tarde.',
        true
      );
      
      return c.text(errorTwiml, 200, {
        'Content-Type': 'text/xml'
      });
    }
  },
  
  /**
   * Handles a user response
   */
  async handleUserResponse(c: Context): Promise<Response> {
    try {
      logger.info('Respuesta del usuario recibida');
      
      // Get Twilio request data
      const data = await c.req.parseBody() as TwilioRequest;
      const { CallSid, SpeechResult } = data;
      
      if (!SpeechResult) {
        logger.warn('No se recibió entrada de voz del usuario');
        const noInputTwiml = twilioService.generateVoiceResponse(
          'No pude entender lo que dijiste. ¿Podrías repetirlo?',
          false
        );
        
        return c.text(noInputTwiml, 200, {
          'Content-Type': 'text/xml'
        });
      }
      
      logger.debug(`Entrada de voz: "${SpeechResult}"`);
      
      // Retrieve the current state of the cookie
      const stateCookie = c.req.cookie('conversationState');
      if (!stateCookie) {
        logger.warn('No se encontró estado de conversación');
        return c.redirect('/api/incoming-call');
      }
      
      let state = stateService.deserializeState(stateCookie);
      
      // Detect if the user wants to end the call
      const isEnding = /adios|terminar|colgar|gracias|hasta luego/i.test(SpeechResult);
      
      // Add the user's message to the status
      state = stateService.addUserMessage(state, SpeechResult);
      
      // Generate response with OpenAI
      const aiResponse = await openaiService.generateResponse(state);
      
      // Add the response to the status
      state = stateService.addAssistantResponse(state, aiResponse);
      
      // Generate TwiML with the answer
      const twimlResponse = twilioService.generateVoiceResponse(aiResponse, isEnding);
      
      // Update the cookie with the new status
      c.cookie('conversationState', stateService.serializeState(state), {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hora
        path: '/'
      });
      
      logger.debug('Enviando respuesta TwiML');
      return c.text(twimlResponse, 200, {
        'Content-Type': 'text/xml'
      });
    } catch (error: any) {
      logger.error(`Error en handleUserResponse: ${error.message}`);
      
      // In case of error, generate a default response
      const errorTwiml = twilioService.generateVoiceResponse(
        'Lo siento, estamos experimentando dificultades técnicas. Por favor, intenta más tarde.',
        true
      );
      
      return c.text(errorTwiml, 200, {
        'Content-Type': 'text/xml'
      });
    }
  }
};