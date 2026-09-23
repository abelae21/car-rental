import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gray-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-gray-900 to-gray-950" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <span className="text-xl font-bold tracking-tight text-white">Wheelhouse</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-md"
        >
          <p className="text-3xl font-semibold leading-tight text-white">
            The open road, booked in under a minute.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Thousands of vehicles, transparent pricing, zero surprises at pickup.
          </p>
        </motion.div>

        <div className="relative z-10 text-xs text-gray-500">
          © {new Date().getFullYear()} Wheelhouse, Inc.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="text-xl font-bold tracking-tight">Wheelhouse</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
