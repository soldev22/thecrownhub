import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date query param is required' }, { status: 400 });
  }

  await connectDB();

  const bookings = await Booking.find({ date });
  const taken = bookings.map(b => b.chairNumber);
  const available = [1, 2, 3, 4].filter(n => !taken.includes(n));

  return NextResponse.json({ available });
}
