import { createContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { setupAxiosInterceptors } from "../utils/axiosInterceptors";

interface User {
  id?: number;
  first_names?: string;
  last_names?: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
}

/**
 * User context for managing authentication state across the application
 */
export const UserContext = createContext<AuthContextType>({} as AuthContextType)

/**
 * Props interface for UserContextProvider component
 */
interface UserContextProviderProps {
  children: ReactNode;
}

/**
 * Simplified UserContextProvider that uses separated concerns architecture
 *
 * @param props - Component props
 * @returns Context provider wrapping children
 */
export function UserContextProvider({ children }: UserContextProviderProps) {
  const auth = useAuth();
  const [hasInitialized, setHasInitialized] = useState(false);

  /**
   * Setup axios interceptors with proper conditions
   */
  useEffect(() => {
    const shouldRefresh = (error: any) => {
      return (
        hasInitialized &&
        auth.user !== null &&
        !auth.isRefreshing &&
        !error.config?.url?.includes('/auth/refresh')
      );
    };

    const cleanup = setupAxiosInterceptors(auth.refreshToken, shouldRefresh);
    return cleanup;
  }, [auth.refreshToken, auth.isRefreshing, auth.user, hasInitialized]);

  /**
   * Initial authentication check
   */
  useEffect(() => {
    if (!hasInitialized) {
      auth.checkAuth().finally(() => setHasInitialized(true));
    }
  }, [hasInitialized, auth.checkAuth]);

  return (
    <UserContext.Provider value={auth}>
      {children}
    </UserContext.Provider>
  );
}
