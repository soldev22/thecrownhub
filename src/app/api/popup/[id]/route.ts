import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PopupBooking } from '@/lib/models/PopupBooking';
<<<<<<< HEAD

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
=======

export async function DELETE(req: NextRequest, context: any) {
  try {
    await connectDB();

    const id = context.params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const deleted = await PopupBooking.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
>>>>>>> 0f82c7484214cdb6a6bc13e5493a0600faa2ada9
}
