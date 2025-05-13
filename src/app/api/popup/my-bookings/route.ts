import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { PopupBooking } from '@/lib/models/PopupBooking';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const bookings = await PopupBooking.find({ userId: token.sub })
    .sort({ date: 1, hour: 1 })
    .select('_id date hour');

  return NextResponse.json({ bookings });
}
