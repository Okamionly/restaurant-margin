import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from '../types';
import { login as apiLogin, register as apiRegister, getMe, getToken, setToken, removeToken, setActiveRestaurantId, removeActiveRestaurantId, getActiveRestaurantId } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me: any = await getMe();
      setUser(me);
      // Recovery: if restaurantId missing from localStorage (cleared cache, other device),
      // use what the server returns to avoid "X-Restaurant-Id header requis" errors
      if (!getActiveRestaurantId() && me?.restaurantId) {
        setActiveRestaurantId(me.restaurantId);
      }
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    const result = await apiLogin(credentials);
    setToken(result.token);
    setUser(result.user);
    // Backend returns `restaurantId` at root level (see api-lib/routes/auth.ts).
    // Fallback to `restaurant.id` for legacy compatibility.
    const rid = (result as { restaurantId?: number }).restaurantId ?? result.restaurant?.id;
    if (rid) {
      setActiveRestaurantId(rid);
    }
  };

  const register = async (data: RegisterData) => {
    const result = await apiRegister(data);
    setToken(result.token);
    setUser(result.user);
    // Same as login above — backend returns `restaurantId` at root.
    const rid = (result as { restaurantId?: number }).restaurantId ?? result.restaurant?.id;
    if (rid) {
      setActiveRestaurantId(rid);
    }
  };

  const logout = () => {
    removeToken();
    removeActiveRestaurantId();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
