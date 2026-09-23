import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/context/auth-context';
import { AppRouter } from '@/routes/AppRouter';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
