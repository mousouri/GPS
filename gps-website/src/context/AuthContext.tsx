import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  clearStoredToken,
  getCurrentUser,
  getStoredToken,
  loginRequest,
  logoutRequest,
  registerRequest,
  setStoredToken,
  type ApiUser,
} from '../lib/api';

export type User = ApiUser;

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  company: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (nextUser: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (!getStoredToken()) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const restoredUser = await getCurrentUser();
        if (isMounted) {
          setUser(restoredUser);
        }
      } catch {
        clearStoredToken();
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const session = await loginRequest(email, password, 'user');
    setStoredToken(session.token);
    setUser(session.user);
    return session.user;
  };

  const adminLogin = async (email: string, password: string) => {
    const session = await loginRequest(email, password, 'admin');
    setStoredToken(session.token);
    setUser(session.user);
    return session.user;
  };

  const register = async (input: RegisterInput) => {
    const session = await registerRequest(input);
    setStoredToken(session.token);
    setUser(session.user);
    return session.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearStoredToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        adminLogin,
        register,
        logout,
        updateUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
