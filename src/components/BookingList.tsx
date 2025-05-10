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
      .then(res => res.json())
      .then(setBookings);
  }, []);

  return (
    <div className="mt-4">
      <h4>Your Bookings</h4>
      <ul className="list-group">
        {bookings.map((b) => (
          <li key={b._id} className="list-group-item d-flex justify-content-between">
            <span>
              {b.date} — Chair {b.chairNumber}
            </span>
            <small className="text-muted">Booked on {new Date(b.createdAt).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
