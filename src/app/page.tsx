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
          Your space to shine — whether you’re styling clients or hosting a standout event.
        </p>
        <p>
          Rent a premium hairdressing chair with zero commitment and complete flexibility. Perfect for freelance stylists ready to grow their brand on their own terms. Need something bigger? Our pop-up event space is ready to impress — host up to <strong>40 guests</strong> with catering facilities, a waiting lounge, and a sleek, professional vibe. <br />
          No contracts. No fuss. Just space that works for you.
        </p>

        {/* CTA Buttons */}
        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-5">
          <Link href="/login" className="btn btn-warning btn-lg px-4 text-dark">
            Book a Chair
          </Link>
          <Link href="/popup" className="btn btn-warning btn-lg px-4 text-dark">
            Book a Pop-Up Space
          </Link>
        </div>
      </div>
    </div>
  );
}
