import { SMS } from '@vonage/sms';

const smsClient = new SMS({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!,
});

export async function sendSMS({ to, message }: { to: string; message: string }) {
  if (!to || !message) throw new Error('Missing "to" or "message" in sendSMS');

  const userRecipient = to.trim();
  const mikeRaw = '07739870670';
  const recipients: { to: string; delay?: number }[] = [];

  // Send immediately to the user
  recipients.push({ to: userRecipient });

  // Send with a delay to admin if not already the user
  if (userRecipient !== mikeRaw) {
    recipients.push({ to: mikeRaw, delay: 30000 }); // 30 seconds
  }

  for (const { to: recipient, delay } of recipients) {
    let formattedTo = recipient;
    if (formattedTo.startsWith('0') && formattedTo.length === 11) {
      formattedTo = '+44' + formattedTo.slice(1);
    }

    const sendNow = async () => {
      if (process.env.DISABLE_SMS === 'true') {
        console.log(`📵 SMS disabled. Would have sent to: ${formattedTo}, message: ${message}`);
        return;
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
    };

    if (delay) {
      setTimeout(() => sendNow(), delay);
    } else {
      await sendNow();
    }
  }
}
