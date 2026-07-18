import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('vitallink_token'));
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      setLoading(true);
      const data = await authApi.getMe();
      setUser(data.user);
      setProfile(data.profile || null);
    } catch (err) {
      console.error("Failed to load user session:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      localStorage.setItem('vitallink_token', data.token);
      setToken(data.token);
      // loadMe will be triggered by token changes
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (regData: any) => {
    setLoading(true);
    try {
      const data = await authApi.register(regData);
      localStorage.setItem('vitallink_token', data.token);
      setToken(data.token);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('vitallink_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  const refreshProfile = async () => {
    try {
      const data = await authApi.getMe();
      setProfile(data.profile || null);
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
