import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { googleLogin as apiGoogleLogin, getMe as apiGetMe } from '../services/api';

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
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (googleIdToken) => {
    const data = await apiGoogleLogin(googleIdToken);
    const nextToken = data?.token;
    const nextUser = data?.user;
    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem('token', nextToken);
    }
    if (nextUser) {
      setUser(nextUser);
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else if (nextToken && !nextUser) {
      try {
        const me = await apiGetMe();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch {}
    }
    return { token: nextToken, user: nextUser };
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ token, user, isLoading, loginWithGoogle, loginWithToken, logout }), [token, user, isLoading, loginWithGoogle, loginWithToken, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

