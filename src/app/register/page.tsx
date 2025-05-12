'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="bg-black text-white min-vh-100 d-flex flex-column justify-content-center align-items-center py-5">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4 border-bottom pb-2">Create Your Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
