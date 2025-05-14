'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type PopupBooking = {
  _id: string;
  date: string;
  hours: number[];
};

export default function PopupHistoryPage() {
  const [bookings, setBookings] = useState<PopupBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/popup/my-bookings');
      const sorted: PopupBooking[] = res.data.bookings
        .map((b: PopupBooking) => ({
          ...b,
          hours: b.hours.sort((a: number, b: number) => a - b),
        }))
        .sort((a: PopupBooking, b: PopupBooking) => b.date.localeCompare(a.date)); // newest first

      setBookings(sorted);
    } catch (err: any) {
      setMessage('❌ Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId: string, hour: number) => {
    if (!confirm(`Cancel ${hour}:00 on this day?`)) return;

    try {
      await axios.delete(`/api/popup/${bookingId}?hour=${hour}`);
      setBookings(prev =>
        prev
          .map(b => {
            if (b._id !== bookingId) return b;
            const newHours = b.hours.filter(h => h !== hour);
            return { ...b, hours: newHours };
          })
          .filter(b => b.hours.length > 0)
      );
      setMessage(`✅ Booking cancelled for ${hour}:00.`);
    } catch (err: any) {
      setMessage('❌ Cancellation failed.');
    }
  };

  return (
    <div className="container mt-4 text-light bg-dark p-4 rounded shadow">
      <h2>Your Pop-Up Bookings</h2>

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table table-dark table-striped mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Booked Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.date}</td>
                <td>{b.hours.map(hour => `${hour}:00`).join(', ')}</td>
                <td>
                  {b.hours.map(hour => (
                    <button
                      key={hour}
                      className="btn btn-sm btn-outline-danger me-2 mb-1"
                      onClick={() => cancelBooking(b._id, hour)}
                    >
                      Cancel {hour}:00
                    </button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
