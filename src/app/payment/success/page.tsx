'use client';

import { useEffect, useState } from 'react';

export default function PaymentSuccess() {
  const [status, setStatus] = useState('Saving your booking...');

  useEffect(() => {
    const booking = sessionStorage.getItem('bookingDetails');
    if (!booking) {
      setStatus('Booking info not found.');
      console.log('🏁 useEffect started');
      return;
    }

    const { date, chairNumber } = JSON.parse(booking);

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, chairNumber }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setStatus('❌ Booking failed: ' + (data.error || 'Unknown error'));
        } else {
          setStatus('✅ Booking saved successfully!');
          sessionStorage.removeItem('bookingDetails');
        }
      })
      .catch(() => setStatus('❌ Booking request failed.'));
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center bg-dark text-white vh-100">
      <div className="text-center">
        <h2 className="mb-4">Payment Successful</h2>
        <p className="lead">{status}</p>
      </div>
    </div>
  );
}
