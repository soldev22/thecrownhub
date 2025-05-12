'use client';

import { useState, useEffect } from 'react';

export default function BookingForm() {
  const [date, setDate] = useState('');
  const [availableChairs, setAvailableChairs] = useState<number[]>([]);
  const [selectedChair, setSelectedChair] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (date) {
      fetch(`/api/bookings/available?date=${date}`)
        .then((res) => res.json())
        .then((data) => setAvailableChairs(data.available || []))
        .catch(() => setAvailableChairs([]));
    } else {
      setAvailableChairs([]);
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!selectedChair || !date) {
      setError('Please select a date and chair.');
      setLoading(false);
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('You cannot book a date in the past.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, chairNumber: selectedChair }),
      });

      const data = await res.json();
      console.log('🎟️ Stripe checkout response:', data);

      if (!res.ok || !data.url) {
        setError(data.error || 'Failed to initiate payment.');
        setLoading(false);
        return;
      }

      // ✅ Store before redirect
      sessionStorage.setItem(
        'bookingDetails',
        JSON.stringify({ date, chairNumber: selectedChair })
      );
      console.log('✅ Stored booking details before redirect:', { date, selectedChair });

      window.location.href = data.url;
    } catch (err) {
      console.error('Payment redirect failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="date"
        className="form-control mb-3"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={todayStr}
        required
      />

      <div className="mb-3">
        <strong>Available Chairs:</strong>
        <div className="d-flex gap-2 mt-2 flex-wrap">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              type="button"
              className={`btn btn-sm ${
                availableChairs.includes(num)
                  ? 'btn-outline-success'
                  : 'btn-outline-secondary'
              } ${selectedChair === num ? 'active' : ''}`}
              disabled={!availableChairs.includes(num)}
              onClick={() => setSelectedChair(num)}
            >
              Chair {num}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-warning w-100"
        disabled={!selectedChair || loading}
      >
        {loading ? 'Processing...' : 'Pay & Book'}
      </button>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
}
