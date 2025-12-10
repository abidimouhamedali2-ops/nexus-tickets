import api, { setToken, removeToken, handleApiError } from '@/lib/api';
import { User, UserRole } from '@/contexts/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Demo mode flag - set to false when connecting to real Django backend
const DEMO_MODE = true;

// Mock users for demo mode
const mockUsers: User[] = [
  { id: '1', email: 'admin@madaar.com', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'employee@madaar.com', name: 'John Employee', role: 'employee' },
];

export const authService = {
  /**
   * Login user with email and password
   * Django endpoint: POST /api/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (DEMO_MODE) {
      // Demo mode - simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const token = `demo_token_${user.id}_${Date.now()}`;
      setToken(token);
      return { user, token };
    }

    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { user, token } = response.data;
      setToken(token);
      return { user, token };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Register new user
   * Django endpoint: POST /api/auth/register
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: 'employee',
      };
      const token = `demo_token_${newUser.id}_${Date.now()}`;
      setToken(token);
      return { user: newUser, token };
    }

    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { user, token } = response.data;
      setToken(token);
      return { user, token };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout user
   * Django endpoint: POST /api/auth/logout
   */
  async logout(): Promise<void> {
    if (!DEMO_MODE) {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    removeToken();
    localStorage.removeItem('nexus_user');
  },

  /**
   * Get current user from token
   * Django endpoint: GET /api/auth/me
   */
  async getCurrentUser(): Promise<User | null> {
    if (DEMO_MODE) {
      const stored = localStorage.getItem('nexus_user');
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      removeToken();
      return null;
    }
  },

  /**
   * Refresh auth token
   * Django endpoint: POST /api/auth/refresh
   */
  async refreshToken(): Promise<string | null> {
    if (DEMO_MODE) return null;

    try {
      const response = await api.post<{ token: string }>('/auth/refresh');
      const { token } = response.data;
      setToken(token);
      return token;
    } catch (error) {
      removeToken();
      return null;
    }
  },
};

export default authService;
