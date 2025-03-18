import { config } from 'dotenv';
import twilio from 'twilio';

config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;
const myPhone = process.env.MY_PHONE_NUMBER!;

const serverUrl = process.env.SERVER_URL || 'http://tu-ip-o-dominio';

const client = twilio(accountSid, authToken);

client.calls
  .create({
    url: `${serverUrl}/api/incoming-call`,
    to: myPhone,
    from: twilioPhone,
  })
  .then((call) => console.log(`📞 Llamada en progreso: ${call.sid}`))
  .catch((error) => console.error(`❌ Error: ${error.message}`));