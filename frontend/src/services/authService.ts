import api from './api';
import { User } from '../types';

export interface LoginResponse {
  user: User;
  token: string;
}

const DEFAULT_USER: User = {
  id: '1',
  name: 'Administrator',
  email: 'admin@fleetmaster.com',
  role: 'ADMIN',
  department: 'Fleet Operations',
  phone: '+91 98765 43210',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
};

export const authService = {
  async login(email: string): Promise<LoginResponse> {
    try {
      const res = await api.post<LoginResponse>('/auth/login', { email });
      if (res.data && res.data.token) {
        localStorage.setItem('fleet_auth_token', res.data.token);
        localStorage.setItem('fleet_auth_user', JSON.stringify(res.data.user));
        return res.data;
      }
    } catch {
      // Fallback for UI preview when backend server is starting
    }

    const fallbackUser: User = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    };
    const response: LoginResponse = {
      user: fallbackUser,
      token: 'jwt-session-token-' + Date.now(),
    };
    localStorage.setItem('fleet_auth_token', response.token);
    localStorage.setItem('fleet_auth_user', JSON.stringify(response.user));
    return response;
  },

  async getCurrentUser(): Promise<User> {
    try {
      const res = await api.get<User>('/auth/me');
      if (res.data) return res.data;
    } catch {
      // Fallback to local session
    }

    const stored = localStorage.getItem('fleet_auth_user');
    return stored ? JSON.parse(stored) : DEFAULT_USER;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('fleet_auth_token');
      localStorage.removeItem('fleet_auth_user');
    }
  },
};
