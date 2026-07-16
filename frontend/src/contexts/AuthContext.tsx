import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as apiLogin, getMe } from '../api/auth';

interface User {
  id: number; email: string; name: string; role: string; restaurantId?: number;
}

interface AuthContextType {
  user: User | null; token: string | null; login: (email: string, password: string) => Promise<void>; logout: () => void; loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe(token).then(setUser).catch(() => { localStorage.removeItem('token'); setToken(null); }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('token', res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return <AuthContext value={{ user, token, login, logout, loading }}>{children}</AuthContext>;
}

export const useAuth = () => useContext(AuthContext);
