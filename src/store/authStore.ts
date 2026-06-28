import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isInitialized: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isInitialized: false,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
  initializeAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        set({ token, user: JSON.parse(userStr), isInitialized: true });
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },
}));
