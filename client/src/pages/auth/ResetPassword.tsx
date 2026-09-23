import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { api } from '@/lib/axios';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/lib/validators/auth.schema';
import { AuthLayout } from './AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is missing its token.">
        <Link to="/forgot-password" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Request a new link
        </Link>
      </AuthLayout>
    );
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: values.password });
      toast.success('Password reset. Please log in.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Reset link is invalid or has expired');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Choose a new password" subtitle="Make it something you'll remember.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            New password
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm password
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-gray-800 disabled:opacity-60 dark:bg-brand-600 dark:hover:bg-brand-500"
        >
          {isSubmitting ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </AuthLayout>
  );
}
