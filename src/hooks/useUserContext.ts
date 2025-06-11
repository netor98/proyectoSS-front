import { useContext } from 'react';
import { UserContext } from '../context/userContext';

/**
 * Custom hook to consume UserContext with type safety
 *
 * @returns Authentication state and methods from context
 * @throws Error if used outside of UserContextProvider
 *
 * @example
 * const { user, login, logout, loading } = useUserContext();
 */
export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }

  return context;
};
