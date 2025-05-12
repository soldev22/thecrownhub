import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';

export async function DELETE(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = context.params;
  await connectDB();

  const booking = await Booking.findOne({ _id: id, userId: token.sub });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found or not yours' }, { status: 404 });
  }

  await booking.deleteOne();

  return NextResponse.json({ message: 'Booking cancelled' });
}
