'use client';

import { useEffect, useState } from 'react';

type Booking = {
  _id: string;
  date: string;
  chairNumber: number;
  createdAt: string;
};

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
  fetch('/api/bookings')
    .then((res) => res.json())
    .then((data) => {
      console.log('📋 Bookings loaded:', data);
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    })
    .catch((err) => console.error('Booking fetch error:', err));
}, []);

  const handleCancel = async (id: string) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } else {
      alert('Failed to cancel the booking.');
    }
  };

  return (
    <div className="mt-4">
      <h4>Your Bookings</h4>
      <ul className="list-group">
        {bookings.map((b) => (
          <li key={b._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span>
                {new Date(b.date).toLocaleDateString('en-GB')} — Chair {b.chairNumber}
              </span>
              <br />
              <small className="text-muted">
                Booked on {new Date(b.createdAt).toLocaleDateString('en-GB')}
              </small>
            </div>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleCancel(b._id)}
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
