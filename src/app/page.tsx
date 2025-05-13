import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="crown-home text-white bg-black py-5 min-vh-100 d-flex flex-column justify-content-start">
      {/* 🔔 Offer Banner */}
      <div className="bg-warning text-dark text-center py-2">
        <strong>Special Offer:</strong> Register now to lock in an introductory rate of <strong>£15.00 per day</strong> — guaranteed for 6 months!
      </div>

      <div className="container text-center flex-grow-1 d-flex flex-column justify-content-center">
        <h1 className="display-4 fw-bold mb-3">
          Welcome to <span className="display-4">The</span>Crown<span className="display-4">Hub</span>
        </h1>
        <p className="lead mb-4">
          Book your professional hairdressing chair — by the day, on your schedule.
        </p>
        <p>
          Flexible, affordable, stylish spaces for independent hair artists. <br />Choose your chair, pick your day(s), and start growing your business.
        </p>

        {/* CTA Buttons */}
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-5">
          <Link href="/register" className="btn btn-outline-light btn-lg px-4 me-sm-3">
            Join Now
          </Link>
          <Link href="/login" className="btn btn-warning btn-lg px-4 text-dark">
            Book a Chair
          </Link>
        </div>

        {/* 💥 Pop-Up Event Space Promo Block */}
        <div className="bg-light text-dark p-4 rounded mt-5 shadow-lg">
          <h2 className="fw-bold mb-3">Looking for a Stunning Pop-Up Event Space?</h2>
          <p className="mb-3">
            Our dedicated event area comfortably hosts up to <strong>40 guests</strong>, includes a catering section and a waiting area. Perfect for launches, exhibits, and private bookings.
          </p>
          <Link href="/popup" className="btn btn-dark btn-lg">
            Book the Event Space Now
          </Link>
        </div>
      </div>
    </div>
  );
}
