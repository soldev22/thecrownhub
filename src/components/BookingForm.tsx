'use client';

import { useState, useEffect } from 'react';

export default function BookingForm() {
  const [date, setDate] = useState('');
  const [availableChairs, setAvailableChairs] = useState<number[]>([]);
  const [selectedChair, setSelectedChair] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (!date) {
      setAvailableChairs([]);
      return;
    }

    fetch(`/api/bookings/${date}`)
      .then((res) => res.json())
      .then((data) => setAvailableChairs(data.available || []))
      .catch(() => setAvailableChairs([]));
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setBookingConfirmed(false);

    if (!selectedChair || !date) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, chairNumber: selectedChair }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to book');
      }

      setMessage('Chair booked successfully!');
      setBookingConfirmed(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStripePayment = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, chairNumber: selectedChair }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Stripe payment failed to initialize.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="date"
        className="form-control mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="mb-3">
        <strong>Available Chairs:</strong>
        <div className="d-flex gap-2 mt-2 flex-wrap">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              className={`btn btn-sm ${availableChairs.includes(num) ? 'btn-outline-success' : 'btn-outline-secondary'} ${selectedChair === num ? 'active' : ''}`}
              disabled={!availableChairs.includes(num)}
              onClick={() => setSelectedChair(num)}
            >
              Chair {num}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={!selectedChair}>
        Book Chair
      </button>

      {message && (
        <div className="alert alert-success mt-3">
          {message}
          <button
            type="button"
            className="btn btn-warning btn-sm mt-3"
            onClick={handleStripePayment}
          >
            Pay Now
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
}
