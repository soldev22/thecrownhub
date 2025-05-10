'use client';

import { signOut } from 'next-auth/react';

type Props = {
  session: any;
};

export default function Header({ session }: Props) {
  return (
    <header className="bg-light p-3 border-bottom mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <strong>Hairdresser Booking</strong>
        {session?.user ? (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">Welcome, {session.user.name}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={() => signOut({ callbackUrl: '/' })}>
              Log out
            </button>
          </div>
        ) : (
          <span className="text-muted">Not signed in</span>
        )}
      </div>
    </header>
  );
}
