export type UserRole = 'ADMIN' | 'COACH' | 'ATHLETE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  photo?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Athlete extends User {
  licenseNumber: string;
  nationality: string;
  gender: 'M' | 'F';
  birthYear: number;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  ageCategory: AgeCategory;
  clubId?: string;
  clubName?: string;
}

export interface Coach extends User {
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  clubId?: string;
  clubName?: string;
}

export interface Admin extends User {
  department: string;
}

export type AgeCategory =
  | 'Poussin'
  | 'Benjamin'
  | 'Minime'
  | 'Cadet'
  | 'Junior'
  | 'Senior';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
