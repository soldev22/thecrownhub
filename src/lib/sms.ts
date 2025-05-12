// lib/sms.ts
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export async function sendBookingSMS({
  to,
  name,
  date,
  chair,
}: {
  to: string;
  name: string;
  date: string;
  chair: number;
}) {
  const message = `${name} booked Chair ${chair} on ${date} at The Crown Hub.`;

  return client.messages.create({
    body: message,
    from: process.env.TWILIO_FROM!,
    to,
  });
}
