import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { loginSchema, LoginFormValues } from '@/lib/validators/auth.schema';
import { AuthLayout } from './AuthLayout';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success('Welcome back!');
      const from = (location.state as any)?.from?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your bookings and find your next ride."
    >
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-500 dark:border-gray-800 dark:bg-gray-900"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-gray-800 disabled:opacity-60 dark:bg-brand-600 dark:hover:bg-brand-500"
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
