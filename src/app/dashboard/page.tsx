import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {session.user?.name}</p>
      <div className="container mt-4 p-4 bg-light rounded shadow-sm">

  <p className="lead">
    We're so glad to have you at <strong>The Salon witihn the The Crown Hub</strong>. You’re welcome to use your booked chair and enjoy the communal areas, including the waiting lounge, kitchen, and back room storage.
  </p>

  <hr />

  <h5 className="text-muted mt-4">Salon Etiquette / House Rules</h5>
  <ul className="list-group list-group-flush mb-3">
    <li className="list-group-item">Clean your station before you leave — leave it as you found it.</li>
    <li className="list-group-item">Be on time — chair hire runs from <strong>9:00 AM to 6:00 PM</strong> daily.</li>
    <li className="list-group-item">Respect others — be mindful of conversations and client interactions.</li>
    <li className="list-group-item">Keep volume low — especially for music or phone calls.</li>
    <li className="list-group-item">Don’t leave items overnight — store belongings responsibly.</li>
  </ul>

  <p className="text-muted">
    Thank you for being part of our creative community. Let’s keep the space clean, professional, and welcoming for everyone.
  </p>
</div>

    </div>
  );
}
