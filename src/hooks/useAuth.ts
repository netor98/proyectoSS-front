import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

interface User {
  id?: number;
  first_names?: string;
  last_names?: string;
  email?: string;
  avatar?: string;
}

/**
 * Custom hook for managing authentication state and operations
 *
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Checks current authentication status
   */
  // const checkAuth = useCallback(async (): Promise<void> => {
  //   try {
  //     console.log("checkAuth")
  //     setLoading(true);
  //     const userData = await authService.getProfile();
  //     setUser(userData);
  //   } catch (error) {
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  /**
   * Refreshes the access token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false;

    try {
      setIsRefreshing(true);
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  /**
   * Logs out the current user
   */
  const logout = useCallback(async (): Promise<boolean> => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Successfully logged out');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
      return false;
    }
  }, []);

  /**
   * Logs in a user
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userData = await authService.login(email, password);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isRefreshing,
    // checkAuth,
    refreshToken,
    logout,
    login,
    setUser
  };
};
