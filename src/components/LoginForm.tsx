'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push(res?.url || '/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4" style={{ maxWidth: '400px' }}>
      <input
        type="email"
        className="form-control mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="form-control mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary w-100">Log In</button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
}
