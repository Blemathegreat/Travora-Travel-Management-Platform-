import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function registerAmbassador({ firstName, lastName, phone, email, password }) {
  const res = await api.post('/api/ambassadors/register', { firstName, lastName, phone, email, password });
  setUser(res.data.user);
  return res.data;
}
  async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    return res.data.user;
  }

 async function register({ firstName, lastName, email, password, referralCode }) {
  const res = await api.post('/api/auth/register', { firstName, lastName, email, password, referralCode });
  setUser(res.data.user);
  return res.data.user;
}

  async function logout() {
    await api.post('/api/auth/logout');
    setUser(null);
  }

  const value = { user, loading, login, register, logout, registerAmbassador };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}