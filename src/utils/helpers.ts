import { ConversationState, Message } from '../types';

/**
 * Limit the length of the conversation to avoid excessive tokens.
 */
export function pruneConversationHistory(state: ConversationState): ConversationState {
  const MAX_MESSAGES = 10;
  const prunedState = { ...state };
  
  // If there are many messages, delete the oldest ones (except the system message).
  if (prunedState.messages.length > MAX_MESSAGES) {
    const systemMessage = prunedState.messages.find(msg => msg.role === 'system');
    const latestMessages = prunedState.messages.slice(-MAX_MESSAGES + 1);
    
    prunedState.messages = systemMessage 
      ? [systemMessage, ...latestMessages] 
      : latestMessages;
  }
  
  return prunedState;
}

/**
 * Format the answers for TTS by removing problematic characters.
 */
export function formatTTSResponse(text: string): string {
  return text
    .replace(/\n+/g, ' ') 
    .replace(/\s{2,}/g, ' ') 
    .replace(/[*_~`]/g, '') 
    .trim();
}

/**
 * Serialize the state to store it in cookies.
 */
export function serializeState(state: ConversationState): string {
  return Buffer.from(JSON.stringify(state)).toString('base64');
}

/**
 * Deserializes the state from cookies
 */
export function deserializeState(serialized: string): ConversationState {
  try {
    return JSON.parse(Buffer.from(serialized, 'base64').toString('utf-8'));
  } catch (error) {
    throw new Error('Error al deserializar el estado de la conversación');
  }
}

/**
 * Generates an error response for Twilio
 */
export function errorTwiML(): string {
  const twiml = new (require('twilio').twiml.VoiceResponse)();
  twiml.say(
    { voice: 'woman', language: 'es-MX' },
    'Lo siento, estamos experimentando dificultades técnicas. Por favor, intenta más tarde.'
  );
  twiml.hangup();
  return twiml.toString();
}