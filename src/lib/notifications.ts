const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const MANAGER_EMAIL = process.env.SALON_MANAGER_EMAIL!;
const SENDER_EMAIL = 'mike@solutionsdeveloped.co.uk'; // must be a verified sender in Brevo

type BaseEmailPayload = {
  to: string;
  subject: string;
  htmlContent: string;
};

/**
 * Internal helper to send an email via Brevo
 */
async function sendEmail({ to, subject, htmlContent }: BaseEmailPayload) {
  const payload = {
    sender: {
      name: 'The Crown Hub',
      email: SENDER_EMAIL,
    },
    to: [
      { email: to },
      { email: MANAGER_EMAIL }, // CC manager
    ],
    subject,
    htmlContent,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('❌ Failed to send email via Brevo:', await res.text());
  } else {
    console.log(`✅ Email sent to ${to}`);
  }
}

/**
 * Sends a chair booking confirmation email to user + manager
 */
export async function sendChairBookingEmail({
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
  const subject = `Booking Confirmation – Chair ${chairNumber} on ${date}`;
  const htmlContent = `
    <p>Hi ${userName},</p>
    <p>Thank you for booking <strong>Chair ${chairNumber}</strong> on <strong>${date}</strong>.</p>
    <p>We look forward to seeing you at The Crown Hub!</p>
  `;

  await sendEmail({ to: userEmail, subject, htmlContent });
}

/**
 * Sends a pop-up space booking confirmation email to user + manager
 */
export async function sendPopupBookingEmail({
  userEmail,
  userName,
  date,
  hours,
}: {
  userEmail: string;
  userName: string;
  date: string;
  hours: number[];
}) {
  const hourList = hours.map(h => `${h}:00`).join(', ');
  const subject = `Popup Booking Confirmation – ${date}`;
  const htmlContent = `
    <p>Hi ${userName},</p>
    <p>Thank you for booking pop-up space at <strong>${hourList}</strong> on <strong>${date}</strong>.</p>
    <p>We look forward to seeing you at The Crown Hub!</p>
  `;

  await sendEmail({ to: userEmail, subject, htmlContent });
}
