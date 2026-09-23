import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/axios';
import { AuthLayout } from './AuthLayout';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    api
      .post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <AuthLayout title="Email verification" subtitle="Confirming your email address…">
      {status === 'loading' && (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      )}
      {status === 'success' && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-200">
          Your email is verified. You're all set —{' '}
          <Link to="/login" className="font-medium underline">
            log in
          </Link>{' '}
          to continue.
        </div>
      )}
      {status === 'error' && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          This verification link is invalid or has expired.
        </div>
      )}
    </AuthLayout>
  );
}
