import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { api } from '@/lib/axios';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/lib/validators/auth.schema';
import { AuthLayout } from './AuthLayout';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', values);
      setSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {sent ? (
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-200">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-gray-800 disabled:opacity-60 dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        Remembered it?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
