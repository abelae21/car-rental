import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { Role } from '../types/auth.types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

/**
 * Wrap protected route groups, e.g.:
 *   <Route element={<ProtectedRoute />}>...</Route>
 *   <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>...</Route>
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
