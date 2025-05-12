'use client';

import BookingForm from '@/components/BookingForm';

export default function BookingPage() {
  return (
    <div className="bg-black text-white min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4 border-bottom pb-2">Book a Chair</h2>
        <BookingForm />
      </div>
    </div>
  );
}
