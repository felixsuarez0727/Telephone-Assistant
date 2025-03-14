import twilio from 'twilio';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

// Verify that Twilio credentials are configured
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  logger.error('Credenciales de Twilio no configuradas en las variables de entorno');
  process.exit(1);
}

// Create and export the Twilio client
export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

logger.info('Cliente Twilio configurado correctamente');