import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe as apiGetMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsLoading(false);
          return;
        } catch {}
      }
      (async () => {
        try {
          const me = await apiGetMe();
          setUser(me);
          localStorage.setItem('user', JSON.stringify(me));
        } catch (e) {
          const status = e?.response?.status;
          if (status === 404) {
            // Backend does not support /auth/me; keep token and proceed
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, []);



  const loginWithGoogle = useCallback(async () => {
    throw new Error('Google login not implemented');
  }, []);

  // Add a generic setAuth method for flexibility
  const setAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  }, []);

  const loginWithToken = useCallback(async (nextToken) => {
    setToken(nextToken);
    localStorage.setItem('token', nextToken);
    try {
      const me = await apiGetMe();
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));
      return { token: nextToken, user: me };
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        // Backend does not support /auth/me; keep token, caller can set user later
        return { token: nextToken, user: null };
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw e;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const me = await apiGetMe();
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));
      return me;
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ 
    token, 
    user, 
    isLoading, 
    loginWithToken,
    setAuth,
    refreshUser,
    logout 
  }), [token, user, isLoading, loginWithToken, setAuth, refreshUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}