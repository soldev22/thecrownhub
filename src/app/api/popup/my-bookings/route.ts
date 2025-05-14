import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PopupBooking } from '@/lib/models/PopupBooking';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const bookings = await PopupBooking.find({ userId: token.sub }).lean();

  return NextResponse.json({ bookings });
}
