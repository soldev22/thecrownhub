'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

type Props = {
  session: any;
};

export default function Header({ session }: Props) {
  return (
    <header className="bg-black text-warning p-3 border-bottom mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <strong>The Crown Hub – Space Booking</strong>

        {session?.user ? (
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
          <span className="text-warning">Not signed in</span>
        )}
      </div>
    </header>
  );
}
