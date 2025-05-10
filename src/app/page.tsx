import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="crown-home text-white py-5">
      <div className="container text-center">
        <h1 className="display-4 fw-bold mb-3">Welcome to <span className="text-warning">The Crown Hub</span></h1>
        <p className="lead mb-4">
          Book your professional hairdressing chair — by the day, on your schedule.
        </p>
        <p>
          Flexible, affordable, stylish spaces for independent hair artists. Choose your chair, pick your day(s), and start growing your business.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
          <Link href="/register" className="btn btn-outline-light btn-lg px-4 me-sm-3">Join Now</Link>
          <Link href="/login" className="btn btn-warning btn-lg px-4 text-dark">Book a Chair</Link>
        </div>
      </div>
    </div>
  );
}
