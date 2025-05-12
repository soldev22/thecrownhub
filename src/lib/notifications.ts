// lib/notifications.ts

export async function sendBookingEmails({
  userEmail,
  userName,
  chairNumber,
  date,
}: {
  userEmail: string;
  userName: string;
  chairNumber: number;
  date: string;
}) {
  const managerEmail = process.env.SALON_MANAGER_EMAIL!;
  const apiKey = process.env.BREVO_API_KEY!;

  const payload = {
    sender: {
      name: 'The Crown Hub',
      email: 'mike@solutionsdeveloped.co.uk',
    },
    to: [
      { email: userEmail },
      { email: managerEmail },
    ],
    subject: `Booking Confirmation - Chair ${chairNumber} on ${date}`,
    htmlContent: `
      <p>Hi ${userName},</p>
      <p>Thank you for booking <strong>Chair ${chairNumber}</strong> on <strong>${date}</strong>.</p>
      <p>We look forward to seeing you at The Crown Hub!</p>
    `,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('❌ Failed to send email via Brevo:', await res.text());
  }
}
