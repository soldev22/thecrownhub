import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';

// 👇 import this to satisfy Vercel's strict type check
import type { RouteHandlerContext } from 'next/dist/server/web/types';

export async function DELETE(
  req: NextRequest,
  context: RouteHandlerContext
) {
  const token = await getToken({ req });
  const id = context.params?.id;

  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const booking = await Booking.findOne({ _id: id, userId: token.sub });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found or not yours' }, { status: 404 });
  }

  await booking.deleteOne();

  return NextResponse.json({ message: 'Booking cancelled' });
}
