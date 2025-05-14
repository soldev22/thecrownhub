import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PopupBooking } from '@/lib/models/PopupBooking';

export async function DELETE(req: NextRequest) {
  const url = req.nextUrl;
  const id = url.pathname.split('/').pop(); // crude but works reliably

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  await connectDB();
  const deleted = await PopupBooking.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
