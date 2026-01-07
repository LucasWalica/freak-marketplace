export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
}

export interface Profile {
  id: string;
  user: User;
  bio: string;
  rating: number;
  is_verified: boolean;
  avatar_url?: string;
  plan_type: 'FREE' | 'PRO' | 'LEGEND';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface ProfileCreateRequest {
  bio: string;
  avatar_url?: string;
}
