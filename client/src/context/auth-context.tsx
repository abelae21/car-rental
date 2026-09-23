import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { api, setAccessToken } from '../lib/axios';
import { User, ApiEnvelope, AuthResponse } from '../types/auth.types';
import { LoginFormValues } from '../lib/validators/auth.schema';
import { RegisterFormValues } from '../lib/validators/auth.schema';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: Omit<RegisterFormValues, 'confirmPassword'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try to silently refresh using the httpOnly cookie so
  // reloading the page doesn't force a re-login.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post<ApiEnvelope<{ accessToken: string }>>('/auth/refresh');
        setAccessToken(data.data.accessToken);
        const me = await api.get<ApiEnvelope<User>>('/users/me');
        setUser(me.data.data);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (values: LoginFormValues) => {
    const { data } = await api.post<ApiEnvelope<AuthResponse>>('/auth/login', values);
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
  }, []);

  const register = useCallback(
    async (values: Omit<RegisterFormValues, 'confirmPassword'>) => {
      const { data } = await api.post<ApiEnvelope<AuthResponse>>('/auth/register', values);
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
