'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      return;
    }

    setMessage('Registration successful! Redirecting...');
    setTimeout(() => router.push('/login'), 2000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <input
        name="name"
        type="text"
        placeholder="Name"
        className="form-control mb-2"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="form-control mb-2"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="form-control mb-2"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn btn-primary w-100">Register</button>
      {error && <p className="text-danger mt-2">{error}</p>}
      {message && <p className="text-success mt-2">{message}</p>}
    </form>
  );
}
