export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: Role;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
}
