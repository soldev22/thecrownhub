import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="crown-home text-white bg-dark py-5 min-vh-100 d-flex flex-column justify-content-start">
      {/* 🔔 Offer Banner */}
      <div className="bg-light text-dark text-center py-3 shadow-sm border-bottom border-warning">
        <h2 className="display-5 fw-bold mb-0">
          Chair Hire: <span className="text-primary">£15/day</span> &nbsp;&bull;&nbsp; Pop-Up Space: <span className="text-primary">£10/hour</span>
        </h2>
        <p className="mb-0 small fst-italic">Simple. Flexible. No contracts. Guaranteed rates for 6 months.</p>
      </div>

      {/* Main Content */}
      <div className="container flex-grow-1 d-flex flex-column justify-content-center mt-5">
        <h1 className="display-4 text-center fw-bold mb-4">
          Welcome to <span className="text-primary">The Crown Hub</span>
        </h1>
        <p className="lead text-center mb-5">
          A premium, flexible co-working space for hairstylists and creatives. Book what you need — when you need it.
        </p>

        {/* Services Side-by-Side */}
        <div className="row g-4">
          {/* Chair Hire */}
          <div className="col-md-6">
            <div className="bg-secondary p-4 rounded-4 shadow-sm h-100">
              <h3 className="text-warning fw-bold">Hairdressing Chair Hire</h3>
              <p className="mt-2">
                Rent a professional salon chair for just <strong className="text-primary">£15/day</strong>. 
                Perfect for freelance stylists — zero commitment, total flexibility.
              </p>
              <ul className="small">
                <li>No contracts</li>
                <li>Modern, stylish salon space</li>
                <li>Use your own branding</li>
              </ul>
              <Link href="/login" className="btn btn-outline-light mt-3">Book a Chair</Link>
            </div>
          </div>

          {/* Pop-Up Space */}
          <div className="col-md-6">
            <div className="bg-secondary p-4 rounded-4 shadow-sm h-100">
              <h3 className="text-warning fw-bold">Pop-Up Event Space</h3>
              <p className="mt-2">
                Host events, workshops or product launches — book by the hour from just <strong className="text-primary">£10/hour</strong>.
              </p>
              <ul className="small">
                <li>Up to 40 guests</li>
                <li>Catering space & lounge</li>
                <li>Ideal for beauty demos, education, or launches</li>
              </ul>
              <Link href="/popup" className="btn btn-outline-warning mt-3">Book Pop-Up Space</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
