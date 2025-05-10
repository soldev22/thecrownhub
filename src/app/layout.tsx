import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import Header from '@/components/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Hairdresser Booking',
  description: 'Book and pay for chair hire',
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
        <Header session={session} />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
