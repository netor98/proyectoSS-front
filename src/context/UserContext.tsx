import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface User {
  id: string;
  first_names: string;
  last_names: string;
  email: string;
  phone_number: string;
  employee_number: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'user_data';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Map backend user data to frontend format
  const mapUserData = (backendUser: any): User => {
    return {
      id: backendUser.id?.toString(),
      first_names: backendUser.first_names || '',
      last_names: backendUser.last_names || '',
      email: backendUser.email || '',
      phone_number: backendUser.phone_number || '',
      employee_number: backendUser.employee_number || '',
      role: backendUser.role || 'user',
      createdAt: backendUser.created_at || new Date().toISOString(),
      updatedAt: backendUser.updated_at || new Date().toISOString(),
      isActive: backendUser.is_active ?? true,
      isDeleted: backendUser.is_deleted ?? false,
      isVerified: backendUser.is_verified ?? false,
      avatar: backendUser.avatar || ""
    };
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/auth")) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.checkAuth();
        if (userData) {
          const mappedUser = mapUserData(userData);
          setUser(mappedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData } = await authService.login(email, password);

      const mappedUser = mapUserData(userData);

      setUser(mappedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('UserContext: Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth/login');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await authService.checkAuth();
      if (userData) {
        const mappedUser = mapUserData(userData);
        setUser(mappedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      updateUser,
      checkAuth
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
