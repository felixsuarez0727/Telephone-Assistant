import twilio from 'twilio';
import { logger } from '../utils/logger';
import { formatTTSResponse } from '../utils/helpers';

const VoiceResponse = twilio.twiml.VoiceResponse;

// Define the correct types according to Twilio's documentation
type VoiceOptions = {
  voice: 'man' | 'woman' | string;
  language: string;
};

// Voice options adjusted for compatibility with Twilio types
export const VOICE_OPTIONS: VoiceOptions = {
  voice: 'woman',
  language: 'es-MX'
};

export const twilioService = {
  /**
   * Generates TwiML to reply with a voice message
   */
  generateVoiceResponse(message: string, shouldHangup: boolean = false): string {
    try {
      const twiml = new VoiceResponse();
      
      // Format the message for Text-to-Speech
      const formattedMessage = formatTTSResponse(message);
      
      // Generate voice response
      // Use as any to avoid problems with Twilio types
      twiml.say(VOICE_OPTIONS as any, formattedMessage);
      
      if (shouldHangup) {
        twiml.hangup();
      } else {
        // Configure user voice capture
        const gather = twiml.gather({
          input: ['speech'] as any, 
          action: '/api/respond',
          method: 'POST',
          speechTimeout: 'auto',
          speechModel: 'phone_call',
          language: 'es-ES'
        });
      }
      
      logger.debug('TwiML generado correctamente');
      return twiml.toString();
    } catch (error: any) {
      logger.error(`Error al generar TwiML: ${error.message}`);
      
      // Generate a simple error response
      const errorTwiml = new VoiceResponse();
      errorTwiml.say(
        VOICE_OPTIONS as any, 
        'Lo siento, estamos experimentando dificultades técnicas.'
      );
      errorTwiml.hangup();
      
      return errorTwiml.toString();
    }
  },
  
  /**
   * Generates TwiML to answer an incoming call
   */
  generateWelcomeResponse(welcomeMessage: string): string {
    const twiml = new VoiceResponse();
    
    // Welcome message
    twiml.say(VOICE_OPTIONS as any, welcomeMessage);
    
    // Configure voice capture
    const gather = twiml.gather({
      input: ['speech'] as any,
      action: '/api/respond',
      method: 'POST',
      speechTimeout: 'auto',
      speechModel: 'phone_call',
      language: 'es-ES'
    });
    
    return twiml.toString();
  }
};