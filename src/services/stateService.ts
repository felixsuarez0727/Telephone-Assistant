import { ConversationState, Message } from '../types';
import { SYSTEM_PROMPT, DEFAULT_WELCOME_MESSAGE } from '../config/constants';
import { pruneConversationHistory, serializeState, deserializeState } from '../utils/helpers';
import { logger } from '../utils/logger';

export const stateService = {
  /**
   * Initializes a new conversation status
   */
  initializeState(callSid?: string, callerPhone?: string): ConversationState {
    logger.debug(`Inicializando estado para llamada: ${callSid || 'nueva'}`);
    
    const systemMessage: Message = {
      role: 'system',
      content: SYSTEM_PROMPT
    };
    
    const welcomeMessage: Message = {
      role: 'assistant',
      content: DEFAULT_WELCOME_MESSAGE
    };
    
    return {
      messages: [systemMessage, welcomeMessage],
      callSid,
      callerPhone,
      reservationInfo: {
        confirmed: false
      }
    };
  },
  
  /**
   * Add a message from the user and update the status
   */
  addUserMessage(state: ConversationState, userMessage: string): ConversationState {
    const updatedState = { ...state };
    
    // Add the user's message to the history
    updatedState.messages.push({
      role: 'user',
      content: userMessage
    });
    
    // Delete the history if it is too long
    return pruneConversationHistory(updatedState);
  },
  
  /**
   * Adds a wizard response to the status
   */
  addAssistantResponse(state: ConversationState, response: string): ConversationState {
    const updatedState = { ...state };
    
    // Add the wizard response to the history
    updatedState.messages.push({
      role: 'assistant',
      content: response
    });
    
    // Prune the history if it is too long
    return pruneConversationHistory(updatedState);
  },
  
  /**
   * Serializes the state to store it in a cookie
   */
  serializeState(state: ConversationState): string {
    return serializeState(state);
  },
  
  /**
   * Deserializes the state from a cookie
   */
  deserializeState(serialized: string): ConversationState {
    try {
      return deserializeState(serialized);
    } catch (error) {
      logger.error('Error al deserializar el estado. Inicializando nuevo estado.');
      return this.initializeState();
    }
  }
};