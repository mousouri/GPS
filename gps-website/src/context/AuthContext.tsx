import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  company?: string; // CRESTECH
  plan?: string;
  joinDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for simulation
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'user@crestech.co.tz': {
    password: 'user123',
    user: {
      id: 'u1',
      name: 'John Anderson',
      email: 'user@crestech.co.tz',
      role: 'user',
      avatar: '/images/person-man-2.jpg',
      company: 'CRESTECH',
      plan: 'Professional',
      joinDate: '2025-06-15',
    },
  },
  'admin@crestech.co.tz': {
    password: 'admin123',
    user: {
      id: 'a1',
      name: 'Sarah Mitchell',
      email: 'admin@crestech.co.tz',
      role: 'admin',
      avatar: '/images/person-woman-4.jpg',
      company: 'CRESTECH',
      plan: 'Enterprise',
      joinDate: '2024-01-10',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('crestech_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('trackpro_user');
      }
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const entry = DEMO_USERS[email.toLowerCase()];
    if (entry && entry.user.role === 'user') {
      setUser(entry.user);
      localStorage.setItem('trackpro_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const entry = DEMO_USERS[email.toLowerCase()];
    if (entry && entry.user.role === 'admin') {
      setUser(entry.user);
      localStorage.setItem('trackpro_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trackpro_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
