import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PopupBooking } from '@/lib/models/PopupBooking';

export async function POST(req: NextRequest) {
  const { date } = await req.json();
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  await connectDB();

  // Fetch all bookings for that date
  const bookings = await PopupBooking.find({ date });

  // Count number of bookings per hour
  const counts: Record<number, number> = {};
  bookings.forEach(b => {
    counts[b.hour] = (counts[b.hour] || 0) + 1;
  });

  // Return counts for each hour 0–23
  const availability = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    available: counts[hour] || 0 // number of bookings made
  }));

  return NextResponse.json({ availability });
}
