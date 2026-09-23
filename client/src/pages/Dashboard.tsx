import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-soft dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold">
          Hey {user?.firstName} 👋
        </h1>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium">{user?.role}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email verified</dt>
            <dd className="font-medium">{user?.isEmailVerified ? 'Yes' : 'Pending'}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-gray-500">
          Bookings, favorites, and profile management land in later phases.
        </p>
        <button
          onClick={handleLogout}
          className="mt-8 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
