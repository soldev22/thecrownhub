// app/layout.tsx
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SessionLayout from './SessionLayout';

export const metadata = {
  title: 'The Crown Hub',
  description: 'Book your creative space',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionLayout>
          {children}
        </SessionLayout>
      </body>
    </html>
  );
}
