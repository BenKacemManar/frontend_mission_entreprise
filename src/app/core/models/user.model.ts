export type UserRole = 'ADMIN' | 'COACH' | 'ATHLETE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  id?: string;
  email?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  data?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}
