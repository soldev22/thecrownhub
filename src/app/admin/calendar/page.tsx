'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'bootstrap/dist/css/bootstrap.min.css';

type Booking = {
  _id: string;
  date: string;
  userEmail: string;
  userName?: string;
  chairNumber?: number;
  hours?: number[];
  type: 'chair' | 'popup';
};

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/admin/bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const events = bookings.map((b) => {
    const typeLabel =
      b.type === 'chair'
        ? `Chair #${b.chairNumber}`
        : `Popup: ${b.hours?.join(', ')}`;

    const tooltip = `
${typeLabel}
${b.userName ?? ''} (${b.userEmail})
${new Date(b.date).toDateString()}
    `;

    return {
      title: typeLabel,
      start: b.date,
      allDay: true,
      backgroundColor: b.type === 'chair' ? '#007bff' : '#28a745',
      borderColor: '#000',
      tooltip,
    };
  });

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Bookings Calendar</h1>

      {/* ✅ Load FullCalendar styles via CDN */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/@fullcalendar/daygrid@6.1.8/main.min.css"
      />

      {/* ✅ Load Bootstrap JS once on client */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        defer
      />

      {loading && <p>Loading calendar…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          eventDidMount={(info) => {
            if (typeof window !== 'undefined' && (window as any).bootstrap) {
              const Tooltip = (window as any).bootstrap.Tooltip;
              new Tooltip(info.el, {
                title: info.event.extendedProps.tooltip,
                placement: 'top',
                trigger: 'hover',
                container: 'body',
              });
            }
          }}
        />
      )}
    </div>
  );
}
