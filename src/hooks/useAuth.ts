import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const { user, token, isInitialized, setAuth, clearAuth, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setAuth(data.user, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    jobRole: string,
    experienceLevel: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, jobRole, experienceLevel }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setAuth(data.user, data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  return {
    user,
    token,
    isInitialized,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };
}
