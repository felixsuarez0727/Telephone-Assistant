import { config } from 'dotenv';
import twilio from 'twilio';
import { logger } from './logger';

config(); // Load environment variables

const makeCall = async () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;
  const myPhone = process.env.MY_PHONE_NUMBER!;

  // Obtener la URL actual de ngrok (podrías pasarla como parámetro)
  // Para pruebas puedes usar una URL hardcodeada
  const ngrokUrl = process.env.NGROK_URL || ' https://5b8b-45-238-180-51.ngrok-free.app';

  const client = twilio(accountSid, authToken);

  try {
    logger.info(`Iniciando llamada de prueba a ${myPhone} desde ${twilioPhone}`);
    logger.info(`Usando webhook: ${ngrokUrl}/api/incoming-call`);
    
    const call = await client.calls.create({
      url: `${ngrokUrl}/api/incoming-call`,
      to: myPhone,
      from: twilioPhone,
    });
    
    logger.info(`📞 Llamada en progreso: ${call.sid}`);
    return call.sid;
  } catch (error: any) {
    logger.error(`❌ Error al realizar llamada: ${error.message}`);
    throw error;
  }
};

// Si se ejecuta directamente (node src/utils/makeCall.js)
if (require.main === module) {
  makeCall()
    .then((callSid) => console.log(`Call SID: ${callSid}`))
    .catch((error) => console.error(`Error: ${error.message}`));
}

export { makeCall };