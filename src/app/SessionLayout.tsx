// app/SessionLayout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import BootstrapClient from '@/components/BootstrapClient';
import Header from '@/components/Header';

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BootstrapClient />
      <Header />
      <main className="container">{children}</main>
    </SessionProvider>
  );
}
