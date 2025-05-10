import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import Header from '@/components/Header';
import BootstrapClient from '../components/BootstrapClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'The Crown Hub',
  description: 'Book your creative space',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <BootstrapClient /> {/* ✅ Enables Bootstrap JS safely */}
        <Header session={session} />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
