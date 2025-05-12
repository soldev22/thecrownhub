import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';
import { User } from '@/lib/models/User'; // ✅ NEW
import { sendBookingEmails } from '@/lib/notifications';
import { sendBookingSMS } from '@/lib/sms';

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub || !token.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { date, chairNumber } = await req.json();
  if (!date || !chairNumber) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();

  const exists = await Booking.findOne({ date, chairNumber });
  if (exists) {
    return NextResponse.json({ error: 'Chair already booked for that date' }, { status: 409 });
  }

  const booking = await Booking.create({
    userId: token.sub,
    userEmail: token.email,
    date,
    chairNumber,
  });

  // 🧑 Fetch user from DB to get stored mobile number
  const user = await User.findOne({ email: token.email });

  // ✉️ Send confirmation emails
  await sendBookingEmails({
    userEmail: token.email,
    userName: user?.name || 'Customer',
    date,
    chairNumber,
  });

  // 📱 Send SMS to user and manager
  await Promise.allSettled([
    sendBookingSMS({
      to: process.env.SALON_MANAGER_PHONE!,
      name: user?.name || 'Customer',
      date,
      chair: chairNumber,
    }),
    user?.mobile
      ? sendBookingSMS({
          to: user.mobile,
          name: user.name || 'Customer',
          date,
          chair: chairNumber,
        })
      : Promise.resolve('No user mobile found'),
  ]);

  return NextResponse.json({ message: 'Booking saved', bookingId: booking._id });
}
