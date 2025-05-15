'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="bg-black text-white">
      {/* Jump Menu */}
      <nav className="bg-warning text-dark py-2 sticky-top z-3">
        <div className="container d-flex justify-content-around fw-bold">
          <a href="#chair" className="text-dark text-decoration-none">Chair Hire</a>
          <a href="#popup" className="text-dark text-decoration-none">Pop-Up Space</a>
        </div>
      </nav>

      {/* Chair Hire Section */}
      <section id="chair" className="py-5 border-bottom border-warning">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3 text-warning">Chair Hire</h2>
          <p className="lead mb-4">
            Ready to grow your brand in a professional, stylish space? Hire your chair for just <strong>£15/day</strong>.
            No contracts. No hassle. Just you, your clients, and total flexibility.
          </p>

          {/* Promo Video */}
          <div className="ratio ratio-16x9 mb-4" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <video
              controls
              poster="/TheCrownHubLogo.png"
              className="w-100 rounded shadow"
            >
              <source src="/TheCrownHubPromo_FinalSlower.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <Link href="/booking" className="btn btn-warning btn-lg text-dark">Book a Chair</Link>
        </div>
      </section>

      {/* Pop-Up Section */}
      <section id="popup" className="py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-3 text-warning">Pop-Up Space</h2>
          <p className="lead mb-4">
            Planning a product launch, art show, or private event? Our pop-up space gives you room to shine.
            Book by the hour, host up to <strong>40 guests</strong>, and wow your audience.
          </p>

          {/* Placeholder for second video */}
          <div className="ratio ratio-16x9 mb-4 bg-secondary d-flex align-items-center justify-content-center rounded">
            <span className="text-white-50">[ Pop-Up Space Video Coming Soon ]</span>
          </div>

          <Link href="/popup" className="btn btn-warning btn-lg text-dark">Book a Pop-Up Space</Link>
        </div>
      </section>
    </main>
  );
}
