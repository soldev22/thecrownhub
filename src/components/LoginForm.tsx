'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setMobile('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!mobile.match(/^\+?\d{10,15}$/)) {
          throw new Error('Please enter a valid mobile number (with country code)');
        }

        // Register first
        await axios.post('/api/users/register', { email, password, name, mobile });

        // Auto-login after successful registration
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/dashboard',
        });

        if (res?.error) {
          throw new Error(res.error);
        }

        router.push(res?.url || '/dashboard');
      } else {
        // Login only
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl: '/dashboard',
        });

        if (res?.error) {
          throw new Error('Invalid email or password');
        }

        router.push(res?.url || '/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-3">{isRegistering ? 'Register' : 'Log In'}</h2>

        {isRegistering && (
          <>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              className="form-control mb-2"
              placeholder="Mobile Number (e.g. +447911123456)"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </>
        )}

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

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading
            ? isRegistering
              ? 'Registering...'
              : 'Logging in...'
            : isRegistering
            ? 'Register'
            : 'Log In'}
        </button>

        {error && <div className="text-danger mt-2">{error}</div>}
      </form>

      {/* Toggle option */}
      <div className="text-center mt-3">
        {isRegistering ? (
          <>
            <p className="mb-1">Already have an account?</p>
            <button
              className="btn btn-outline-light w-100"
              onClick={() => {
                setIsRegistering(false);
                resetForm();
              }}
            >
              Switch to Login
            </button>
          </>
        ) : (
          <>
            <p className="mb-1">New here?</p>
            <button
              className="btn btn-outline-light w-100"
              onClick={() => {
                setIsRegistering(true);
                resetForm();
              }}
            >
              Register Instead
            </button>
          </>
        )}
      </div>
    </div>
  );
}
