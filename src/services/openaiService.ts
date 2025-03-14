import { openai, OPENAI_MODEL } from '../config/openai';
import { Message, ConversationState } from '../types';
import { logger } from '../utils/logger';
import { API_TIMEOUT, MAX_TOKENS } from '../config/constants';

export const openaiService = {
  /**
   * Generate a response using the OpenAI model.
   */
  async generateResponse(state: ConversationState): Promise<string> {
    try {
      logger.debug('Generando respuesta con OpenAI');
      logger.debug(`Historial de mensajes: ${JSON.stringify(state.messages)}`);
      
      // Use promise with timeout instead of AbortController
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout al comunicarse con OpenAI API')), API_TIMEOUT);
      });
      
      const openaiPromise = openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: state.messages as any[],
        max_tokens: MAX_TOKENS,
        temperature: 0.7, 
      }).then(response => {
        const assistantResponse = response.choices[0]?.message?.content;
        
        if (!assistantResponse) {
          throw new Error('Respuesta vacía de OpenAI');
        }
        
        return assistantResponse;
      });
      
      // Use Promise.race to implement timeout
      const assistantResponse = await Promise.race([openaiPromise, timeoutPromise]);
      
      logger.debug(`Respuesta generada: ${assistantResponse}`);
      return assistantResponse;
    } catch (error: any) {
      if (error.message === 'Timeout al comunicarse con OpenAI API') {
        logger.error(error.message);
        return 'Lo siento, estoy tardando un poco en procesar. ¿Podrías repetir tu pregunta?';
      }
      
      logger.error(`Error al generar respuesta: ${error.message}`);
      return 'Lo siento, estoy teniendo problemas para responder en este momento. ¿Puedo ayudarte con algo más?';
    }
  }
};