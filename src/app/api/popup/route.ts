import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PopupBooking } from "@/lib/models/PopupBooking";
import { sendSMS } from "@/lib/sms";
import { User } from "@/lib/models/User";
import { sendPopupBookingEmail } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, hours } = await req.json();
  if (!date || !Array.isArray(hours) || hours.length === 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();

  // Check if any hour is already fully booked
  const bookings = await PopupBooking.find({ date });
  const hourCounts: Record<number, number> = {};
  bookings.forEach((b) => {
    b.hours.forEach((h: number) => {
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
  });

  for (const hour of hours) {
    if (hourCounts[hour] >= 3) {
      return NextResponse.json(
        { error: `Hour ${hour}:00 is fully booked` },
        { status: 409 }
      );
    }
  }

  const user = await User.findById(token.sub);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let userBooking = await PopupBooking.findOne({ userId: token.sub, date });

if (!userBooking) {
  // CREATE new booking with name/email stored
  userBooking = await PopupBooking.create({
    userId: token.sub,
    userName: user.name,
    userEmail: user.email,
    date,
    hours,
  });
} else{
  // UPDATE booking with new hours and patch missing userName/email
  userBooking.userName = user.name;
  userBooking.userEmail = user.email;

  const newHours = hours.filter(h => !userBooking.hours.includes(h));
  if (newHours.length > 0) {
    userBooking.hours.push(...newHours);
  }

  await userBooking.save();
}

  // Send SMS confirmation
  const hourList = hours.map(h => `${h}:00`).join(', ');
  const message = `Your pop-up booking for ${date} is confirmed for: ${hourList}. Thank you! - Crown Hub`;

  if (user.mobile) {
    console.log('📲 Sending SMS to:', user.mobile);
    await sendSMS({ to: user.mobile, message });
  }

  if (user.email && user.name) {
    console.log('📧 Sending email to:', user.email);
    await sendPopupBookingEmail({
      userEmail: user.email,
      userName: user.name,
      date,
      hours,
    });
  }

  return NextResponse.json({ success: true, booking: userBooking });
}
