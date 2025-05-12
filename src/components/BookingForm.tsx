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
    if (typeof window !== 'undefined') {
      import('bootstrap').then(({ Tooltip }) => {
        const tooltipTriggerList = Array.from(
          document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.forEach((el) => new Tooltip(el));
      });
    }
  }, [availableChairs]);

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
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, chairNumber: selectedChair }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Booking failed.');
      } else {
        setMessage('✅ Booking saved successfully!');
        sessionStorage.removeItem('bookingDetails');
      }
    } catch (err) {
      console.error('Booking failed:', err);
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

      <div className="mb-2 small">
        <span className="badge bg-success me-2">Available</span>
        <span className="badge bg-secondary me-2">Booked</span>
        <span className="badge bg-warning text-dark">Selected</span>
      </div>

      <div className="mb-3 d-flex gap-3 flex-wrap">
        {[1, 2, 3, 4].map((num) => {
          const isAvailable = availableChairs.includes(num);
          const isSelected = selectedChair === num;
          const btnClass = isSelected
            ? 'btn-warning'
            : isAvailable
            ? 'btn-outline-success'
            : 'btn-outline-secondary';

          return (
            <button
              key={num}
              type="button"
              className={`btn ${btnClass} btn-sm position-relative`}
              disabled={!isAvailable}
              onClick={() => setSelectedChair(num)}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={`Chair ${num} ${isAvailable ? 'is available' : 'is already booked'}`}
            >
              Chair {num}
            </button>
          );
        })}
      </div>

      {selectedChair && (
        <div className="text-center mb-3">
          <img
            src={`/chairs/chair-${selectedChair}.jpg`}
            alt={`Chair ${selectedChair}`}
            width={250}
            height={180}
            className="img-fluid rounded border"
          />
          <div className="small text-muted mt-2">Preview of Chair {selectedChair}</div>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-warning w-100"
        disabled={!selectedChair || loading}
      >
        {loading ? 'Processing...' : 'Book Chair'}
      </button>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
}
