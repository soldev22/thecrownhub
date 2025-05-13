'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type PopupBooking = {
  _id: string;
  date: string;
  hour: number;
};

export default function PopupHistoryPage() {
  const [bookings, setBookings] = useState<PopupBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/popup/my-bookings');
      setBookings(res.data.bookings);
    } catch (err: any) {
      setMessage('❌ Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;

    try {
      await axios.delete(`/api/popup/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      setMessage('✅ Booking cancelled.');
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
              <th>Hour</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.date}</td>
                <td>{b.hour}:00</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
