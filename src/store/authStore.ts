import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,

  login: async (credentials) => {
    // Simulate API call - replace with your actual auth API
    try {
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // if (!response.ok) throw new Error('Login failed');
      // const data = await response.json();

      // Mock successful login
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: credentials.email,
      };

      set({ isAuthenticated: true, user: mockUser });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    // Clear any tokens, etc.
    localStorage.removeItem('token'); // Example
  },
}));