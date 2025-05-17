'use client';

import { useEffect, useState } from 'react';

<a href="/admin/calendar" className="btn btn-outline-primary me-2">Calendar View</a>


type Booking = {
  _id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  date: string;
  chairNumber?: number;
  hours?: number[];
  type: 'chair' | 'popup';
  createdAt: string;
  updatedAt: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/admin/bookings');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filtered = showAll
    ? bookings
    : bookings.filter((b) => b.date >= today);

  return (
    <div className="container py-4">
      <h1 className="mb-4 h3">Bookings</h1>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="showAll"
          checked={showAll}
          onChange={() => setShowAll(!showAll)}
        />
        <label className="form-check-label" htmlFor="showAll">
          Show all bookings (past and present)
        </label>
      </div>

      {loading && <div className="alert alert-info">Loading bookings…</div>}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      {!loading && filtered.length === 0 && (
        <div className="alert alert-warning">No bookings found.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Type</th>
                <th>Date</th>
                <th>Chair #</th>
                <th>Hours</th>
                <th>User Email</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td>{b.type}</td>
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                  <td>{b.chairNumber ?? '-'}</td>
                  <td>{b.hours?.join(', ') ?? '-'}</td>
                  <td>{b.userEmail}</td>
                  <td>{new Date(b.createdAt).toLocaleString()}</td>
                  <td>{new Date(b.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
