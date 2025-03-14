import { config } from 'dotenv';
import twilio from 'twilio';

config(); // Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;
const myPhone = process.env.MY_PHONE_NUMBER!; // Number to call

const client = twilio(accountSid, authToken);

client.calls
  .create({
    url: 'https://6f40-45-238-180-51.ngrok-free.app/api/incoming-call', // Your webhook in ngrok
    to: myPhone, // Number to call (can be another Twilio or yours)
    from: twilioPhone, // Your Twilio number
  })
  .then((call) => console.log(`📞 Llamada en progreso: ${call.sid}`))
  .catch((error) => console.error(`❌ Error: ${error.message}`));
