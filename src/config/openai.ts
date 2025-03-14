import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

// Verify that the API key is configured
if (!process.env.OPENAI_API_KEY) {
  logger.error('OPENAI_API_KEY no está configurada en las variables de entorno');
  process.exit(1);
}

// Create and export OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

logger.info(`Cliente OpenAI configurado. Modelo: ${OPENAI_MODEL}`);