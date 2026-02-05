import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, type ApiEnvelope } from './api';
import type { User } from './types';

type AuthState = {
  user: User | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await api.request<ApiEnvelope<User>>('/api/auth/me', { method: 'GET' });
      if ((res as any).success) setUser((res as any).data);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await api.request<ApiEnvelope<User>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if ((res as any).success) setUser((res as any).data);
    else throw new Error((res as any).error?.message ?? 'Login failed');
  }

  async function logout() {
    await api.request('/api/auth/logout', { method: 'POST', body: '{}' });
    setUser(null);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
}
