import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Wheelhouse</h1>
      <p className="mt-3 max-w-md text-gray-500">
        The vehicle listing, search, and booking experience lands in Phase 3 of the build.
        For now, authentication is fully wired end to end.
      </p>
      <div className="mt-8 flex gap-3">
        {user ? (
          <Link
            to="/dashboard"
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-soft dark:bg-brand-600"
          >
            Go to dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold dark:border-gray-800"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-soft dark:bg-brand-600"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
