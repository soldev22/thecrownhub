import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { PopupBooking } from "@/lib/models/PopupBooking";
import { User } from "@/lib/models/User";
import { sendSMS } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub || !token.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, hour } = await req.json();
  if (!date || hour === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();

  const count = await PopupBooking.countDocuments({ date, hour });
  if (count >= 3) {
    return NextResponse.json({ error: "Hour fully booked" }, { status: 409 });
  }

  const booking = await PopupBooking.create({
    userId: token.sub,
    date,
    hour,
  });

  // 🔍 Look up user to get name and phone
  const user = await User.findOne({ email: token.email });
  const name = user?.name || "Customer";
  const mobile = user?.mobile;

  if (mobile) {
    const formatted = mobile.replace(/^0/, ''); // Strip leading 0
    const international = `+44${formatted}`;

    // ✅ Send SMS
    await sendSMS({
      to: international,
      message: `📅 Hi ${name}, your pop-up booking for ${date} at ${hour}:00 is confirmed. - CrownHub`,
    });
  }

  return NextResponse.json({ booking });
}
