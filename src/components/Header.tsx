'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-black text-warning py-3 border-bottom mb-4">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          {/* Left: Logo */}
          <div className="mb-2 mb-md-0">
            <Link href="/" className="text-warning text-decoration-none fw-bold fs-4">
              TheCrownHub
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="d-flex justify-content-center w-100 mb-2 mb-md-0">
            <nav className="d-flex flex-row flex-wrap gap-2 fw-bold justify-content-center">
              <Link href="/popup/info" className="text-warning text-decoration-none">
                Have a Look Around
              </Link>
              <span className="text-warning">|</span>
              <a href="mailto:mike@solutionsdeveloped.co.uk" className="text-warning text-decoration-none">
                Email Us
              </a>
              <span className="text-warning">|</span>
              <a href="sms:+447739870670" className="text-warning text-decoration-none">
                Send SMS
              </a>
            </nav>
          </div>

          {/* Right: Auth Links */}
          <div className="d-flex align-items-center ms-md-3">
            {status === 'loading' ? (
              <span className="text-warning fw-bold">Loading...</span>
            ) : session?.user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-warning text-warning fw-bold"
                  style={{
                    padding: '0.6rem 1.5rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.5',
                    minWidth: '150px',
                    borderRadius: '0.375rem',
                  }}
                  type="button"
                  id="userMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {session.user.name || session.user.email}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                  <li><h6 className="dropdown-header">Chair Bookings</h6></li>
                  <li><Link href="/booking" className="dropdown-item">New Chair Booking</Link></li>
                  <li><Link href="/booking/history" className="dropdown-item">Chair Booking History</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><h6 className="dropdown-header">Pop-Up Space</h6></li>
                  <li><Link href="/popup" className="dropdown-item">Book Pop-Up Slot</Link></li>
                  <li><Link href="/popup/history" className="dropdown-item">Pop-Up Booking History</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => signOut({ callbackUrl: '/' })}>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-outline-warning text-warning fw-bold"
                style={{
                  padding: '0.6rem 1.5rem',
                  fontSize: '1.1rem',
                  lineHeight: '1.5',
                  minWidth: '150px',
                  borderRadius: '0.375rem',
                  textAlign: 'center',
                  display: 'inline-block',
                }}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
