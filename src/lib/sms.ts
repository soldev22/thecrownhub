import { SMS } from '@vonage/sms';

const smsClient = new SMS({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!,
});

export async function sendSMS({ to, message }: { to: string; message: string }) {
  if (!to || !message) throw new Error('Missing "to" or "message" in sendSMS');

  const recipients = [to.trim()];

  // ✅ Always notify Mike unless he's already the recipient
  const mikeRaw = '07739870670';
  if (!recipients.includes(mikeRaw)) {
    recipients.push(mikeRaw);
  }

  for (const recipient of recipients) {
    // Convert UK local to international if needed
    let formattedTo = recipient;
    if (formattedTo.startsWith('0') && formattedTo.length === 11) {
      formattedTo = '+44' + formattedTo.slice(1);
    }

    if (process.env.DISABLE_SMS === 'true') {
      console.log(`📵 SMS disabled. Would have sent to: ${formattedTo}, message: ${message}`);
      continue;
    }

    try {
      const { messages } = await smsClient.send({
        to: formattedTo,
        from: 'CrownHub',
        text: message,
      });

      const status = messages?.[0]?.status;
      if (status !== '0') {
        const errorText = messages?.[0]?.['errorText'] || 'Unknown error';
        console.error(`❌ SMS failed to ${formattedTo}: ${errorText}`);
      } else {
        console.log(`✅ SMS sent to ${formattedTo}`);
      }
    } catch (err: any) {
      console.error(`❌ SMS exception to ${formattedTo}: ${err.message}`);
    }
  }
}
