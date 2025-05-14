import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PopupBooking } from '@/lib/models/PopupBooking';

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
}
