'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingFormPopup() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [date, setDate] = useState<Date | null>(null);
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [hourAvailability, setHourAvailability] = useState<Record<number, number>>({});
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!date) return;
    const formattedDate = date.toISOString().split('T')[0];

    axios
      .post('/api/popup/available', { date: formattedDate })
      .then(res => {
        const availabilityMap: Record<number, number> = {};
        for (const entry of res.data.availability) {
          availabilityMap[entry.hour] = entry.available;
        }

        setHourAvailability(availabilityMap);

        const openHours = Object.entries(availabilityMap)
  .filter(([hourStr, available]) => {
    const hour = parseInt(hourStr, 10); // ✅ fix is here
    return hour >= 8 && hour <= 18 && available < 3;
  })
  .map(([hourStr]) => parseInt(hourStr, 10));


        setAvailableHours(openHours);
      })
      .catch(() => {
        setAvailableHours([]);
        setHourAvailability({});
      });
  }, [date]);

  const toggleHour = (hour: number) => {
    setSelectedHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || selectedHours.length === 0) {
      setMessage('Please select a date and at least one hour.');
      return;
    }

    setLoading(true);
    const formattedDate = date.toISOString().split('T')[0];
    const totalCost = selectedHours.length * 1;

    try {
      await axios.post('/api/popup', {
  date: formattedDate,
  hours: selectedHours,
});

      // 💾 Store booking info for success page
      sessionStorage.setItem(
        'bookingDetails',
        JSON.stringify({
          type: 'popup',
          date: formattedDate,
          hours: selectedHours.length,
          cost: totalCost,
        })
      );

      // 💳 Stripe checkout
      const stripeRes = await axios.post('/api/stripe/checkout', {
        type: 'popup',
        date: formattedDate,
        hours: selectedHours.length,
        amount: totalCost * 1000, // in pence
      });

      if (stripeRes.data?.url) {
        window.location.href = stripeRes.data.url; // 🔁 use same tab
      }

      // 📲 Send SMS (optional fallback to user.email if no phone)
      await axios.post('/api/test-sms', {
        to: session?.user?.phone || session?.user?.email,
        message: `You've booked ${selectedHours.length} hour(s) on ${formattedDate} at £10/hr. Total: £${totalCost}.`,
      });

      setMessage(`✅ Booked ${selectedHours.length} hour(s)! SMS sent. Total cost: £${totalCost}`);
      setSelectedHours([]);
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.error || 'Booking failed.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <p className="text-light">Checking login status...</p>;
  }

  return (
    <div className="container mt-4 text-light bg-dark p-4 rounded shadow">
      <h2>Book Pop-Up Space</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Choose a date:</label>
          <div className="bg-dark rounded">
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              className="form-control text-dark bg-white"
              calendarClassName="react-datepicker"
            />
          </div>
        </div>

        {Array.from({ length: 11 }, (_, i) => {
          const hour = i + 8;
          const isAvailable = availableHours.includes(hour);
          const isSelected = selectedHours.includes(hour);

          return (
            <button
              type="button"
              key={hour}
              className={`btn btn-sm ${
                isSelected
                  ? 'btn-success'
                  : isAvailable
                  ? 'btn-outline-secondary'
                  : 'btn-outline-danger'
              }`}
              onClick={() => isAvailable && toggleHour(hour)}
              disabled={!isAvailable}
            >
              {hour}:00 {isAvailable ? '' : ' (Unavailable)'}
            </button>
          );
        })}

        <div className="mt-3 d-flex gap-2">
          <button
            type="submit"
            className="btn btn-outline-light"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Selected Hours'}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setDate(null);
              setAvailableHours([]);
              setSelectedHours([]);
              setMessage('');
            }}
          >
            Reset
          </button>
        </div>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
