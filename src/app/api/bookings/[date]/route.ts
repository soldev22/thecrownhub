import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';

export async function GET(
  request: NextRequest,
  context: { params: { date: string } }
): Promise<NextResponse> {
  const { date } = context.params;

  await connectDB();

  const bookings = await Booking.find({ date });
  const takenChairs = bookings.map(b => b.chairNumber);
  const allChairs = [1, 2, 3, 4];
  const available = allChairs.filter(chair => !takenChairs.includes(chair));

  return NextResponse.json({ available });
}
