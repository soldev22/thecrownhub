'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-black text-warning p-3 border-bottom mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="text-warning text-decoration-none fw-bold">
          TheCrownHub
        </Link>

        {status === 'loading' ? (
          <span className="text-warning">Loading...</span>
        ) : session?.user ? (
          <div className="dropdown">
            <button
              className="btn btn-outline-warning dropdown-toggle btn-sm text-warning"
              type="button"
              id="userMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {session.user.name || session.user.email}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
              <li>
                <Link className="dropdown-item" href="/booking">Make a Booking</Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/booking/history">Booking History</Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={() => signOut({ callbackUrl: '/' })}>
                  Log out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-outline-warning btn-sm">Log in</Link>
        )}
      </div>
    </header>
  );
}
