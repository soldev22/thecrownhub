import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';

export async function GET(req: NextRequest, context: { params: { date: string } }) {
  const date = context.params.date;

  await connectDB();
  const bookings = await Booking.find({ date });

  const takenChairs = bookings.map((b) => b.chairNumber);
  const allChairs = [1, 2, 3, 4];
  const available = allChairs.filter((c) => !takenChairs.includes(c));

  return NextResponse.json({ available });
}

