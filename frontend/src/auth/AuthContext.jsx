import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenStorage, onUnauthorized } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const me = await api('/auth/me');
      setUser(me);
      return me;
    } catch (err) {
      setUser(null);
      tokenStorage.clear();
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = tokenStorage.get();
      if (token) {
        await refreshMe();
      }
      if (mounted) setLoading(false);
    })();
    const off = onUnauthorized(() => setUser(null));
    return () => { mounted = false; off(); };
  }, [refreshMe]);

  const login = async (email, password) => {
    const res = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    tokenStorage.set(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async ({ name, email, password, avatarKey }) => {
    const res = await api('/auth/register', {
      method: 'POST',
      body: { name, email, password, avatarKey },
      auth: false,
    });
    tokenStorage.set(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); } catch {}
    tokenStorage.clear();
    setUser(null);
  };

  const value = { user, loading, login, register, logout, refreshMe };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider ausente');
  return ctx;
};
