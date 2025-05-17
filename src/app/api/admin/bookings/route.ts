import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Booking } from '@/lib/models/Booking';
import { PopupBooking } from '@/lib/models/PopupBooking';

export async function GET() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const chairBookings = await Booking.find().catch(err => {
      console.warn('⚠️ Failed to fetch chair bookings:', err);
      return [];
    });

    const popupBookings = await PopupBooking.find().catch(err => {
      console.warn('⚠️ Failed to fetch popup bookings:', err);
      return [];
    });

    const formatted = [
      ...chairBookings.map(b => ({
        _id: b?._id?.toString() ?? '',
        userId: b?.userId?.toString() ?? '',
        userName: b?.userName ?? 'Unknown',
        userEmail: b?.userEmail ?? 'Unknown',
        date: b?.date ?? '',
        chairNumber: b?.chairNumber ?? null,
        createdAt: b?.createdAt ?? '',
        updatedAt: b?.updatedAt ?? '',
        type: 'chair',
      })),
      ...popupBookings.map(b => ({
        _id: b?._id?.toString() ?? '',
        userId: b?.userId?.toString() ?? '',
        userName: b?.userName ?? 'Unknown',
        userEmail: b?.userEmail ?? 'Unknown',
        date: b?.date ?? '',
        hours: b?.hours ?? [],
        createdAt: b?.createdAt ?? '',
        updatedAt: b?.updatedAt ?? '',
        type: 'popup',
      })),
    ];

    console.log(`✅ Returning ${formatted.length} total bookings`);
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('❌ Fatal error loading bookings:', error);
    return NextResponse.json({ error: 'Failed to load bookings' }, { status: 500 });
  }
}
