import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';

const vonage = new Vonage(
  new Auth({
    apiKey: process.env.VONAGE_API_KEY!,
    apiSecret: process.env.VONAGE_API_SECRET!,
  })
);

export async function sendSMS({ to, message }: { to: string; message: string }) {
  if (!to || !message) throw new Error('Missing "to" or "message" in sendSMS');

  if (process.env.DISABLE_SMS === 'true') {
    console.log(`📵 SMS disabled. Would have sent to: ${to}, message: ${message}`);
    return;
  }

  try {
    const response = await vonage.sms.send({
      to,
      from: 'CrownHub', // this must be a valid sender ID (alphanumeric or your Vonage number)
      text: message,
    });

    console.log('📲 SMS sent:', response);
    return response;
  } catch (err: any) {
    console.error('❌ SMS send failed:', err.message || err);
    throw err;
  }
}
