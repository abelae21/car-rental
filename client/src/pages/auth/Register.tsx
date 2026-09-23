import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { registerSchema, RegisterFormValues } from '@/lib/validators/auth.schema';
import { AuthLayout } from './AuthLayout';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = values;
      await registerUser(payload);
      toast.success('Account created! Check your email to verify.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Book your first ride in minutes.">
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              First name
            </label>
            <input
              {...register('firstName')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last name
            </label>
            <input
              {...register('lastName')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
