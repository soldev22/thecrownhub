import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { date, chairNumber } = await req.json();
  if (!date || !chairNumber) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  await connectDB();

  const existing = await Booking.findOne({ date, chairNumber });
  if (existing) {
    return NextResponse.json({ error: 'Chair already booked' }, { status: 409 });
  }

  const booking = await Booking.create({
    userId: session.user.id,
    date,
    chairNumber,
  });

  return NextResponse.json(booking);
}

export async function GET() {
  await connectDB();
  const bookings = await Booking.find();
  return NextResponse.json(bookings);
}
