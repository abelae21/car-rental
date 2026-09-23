export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-soft dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Reaching this page means the RBAC guard correctly verified an ADMIN role — both on
          the API (RolesGuard) and here on the client (ProtectedRoute allowedRoles). Analytics,
          user management, and reports land in Phase 6.
        </p>
      </div>
    </div>
  );
}
