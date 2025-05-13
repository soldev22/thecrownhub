'use client';

import { useEffect, useState } from 'react';

export default function PaymentSuccess() {
  const [status, setStatus] = useState('Saving your booking...');

  useEffect(() => {
    const booking = sessionStorage.getItem('bookingDetails');
    if (!booking) {
      setStatus('Booking info not found.');
      return;
    }

    const parsed = JSON.parse(booking);
    const { type, date, chairNumber, hours } = parsed;

    if (!date || !type) {
      setStatus('Booking data incomplete.');
      return;
    }

    // Chair Booking
    if (type === 'chair') {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, chairNumber }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.error) {
            setStatus('❌ Chair booking failed: ' + (data.error || 'Unknown error'));
          } else {
            setStatus('✅ Chair booking saved successfully!');
            sessionStorage.removeItem('bookingDetails');
          }
        })
        .catch(() => setStatus('❌ Chair booking request failed.'));
    }

    // Pop-Up Booking
    else if (type === 'popup') {
      // You’ve already saved each individual hour in the booking step
      setStatus(`✅ Pop-Up space booked successfully for ${hours} hour(s) on ${date}.`);
      sessionStorage.removeItem('bookingDetails');
    }

    else {
      setStatus('❌ Unknown booking type.');
    }
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
