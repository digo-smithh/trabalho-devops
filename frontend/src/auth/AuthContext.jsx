import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenStorage, onUnauthorized } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [followingIds, setFollowingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const loadFollowingIds = useCallback(async () => {
    try {
      const ids = await api('/me/following/ids');
      setFollowingIds(new Set(ids));
    } catch (err) {
      setFollowingIds(new Set());
    }
  }, []);

  const refreshMe = useCallback(async () => {
    try {
      const me = await api('/auth/me');
      setUser(me);
      await loadFollowingIds();
      return me;
    } catch (err) {
      setUser(null);
      setFollowingIds(new Set());
      tokenStorage.clear();
      return null;
    }
  }, [loadFollowingIds]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = tokenStorage.get();
      if (token) {
        await refreshMe();
      }
      if (mounted) setLoading(false);
    })();
    const off = onUnauthorized(() => {
      setUser(null);
      setFollowingIds(new Set());
    });
    return () => { mounted = false; off(); };
  }, [refreshMe]);

  const login = async (email, password) => {
    const res = await api('/auth/login', { method: 'POST', body: { email, password }, auth: false });
    tokenStorage.set(res.token);
    setUser(res.user);
    await loadFollowingIds();
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
    setFollowingIds(new Set());
    return res.user;
  };

  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); } catch {}
    tokenStorage.clear();
    setUser(null);
    setFollowingIds(new Set());
  };

  const follow = async (artistId) => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      next.add(artistId);
      return next;
    });
    try {
      await api(`/me/following/${artistId}`, { method: 'POST' });
    } catch (err) {
      setFollowingIds(prev => {
        const next = new Set(prev);
        next.delete(artistId);
        return next;
      });
      throw err;
    }
  };

  const unfollow = async (artistId) => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      next.delete(artistId);
      return next;
    });
    try {
      await api(`/me/following/${artistId}`, { method: 'DELETE' });
    } catch (err) {
      setFollowingIds(prev => {
        const next = new Set(prev);
        next.add(artistId);
        return next;
      });
      throw err;
    }
  };

  const value = {
    user, loading, login, register, logout, refreshMe,
    followingIds, follow, unfollow,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider ausente');
  return ctx;
};
