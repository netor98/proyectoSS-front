import axios from 'axios';

/**
 * Sets up axios interceptors for automatic token refresh
 * @param refreshTokenFn - Function to call when token refresh is needed
 * @param shouldRefresh - Function to determine if refresh should be attempted
 * @returns Cleanup function to remove interceptors
 */
export const setupAxiosInterceptors = (
  refreshTokenFn: () => Promise<boolean>,
  shouldRefresh: (error: any) => boolean
) => {
  /**
   * Request interceptor - ensures cookies are included
   */
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response interceptor - handles automatic token refresh
   */
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if we should attempt refresh
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        shouldRefresh(error)
      ) {
        originalRequest._retry = true;

        const refreshSuccess = await refreshTokenFn();

        if (refreshSuccess) {
          // Retry the original request with new token
          return axios.request(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );

  // Return cleanup function
  return () => {
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(responseInterceptor);
  };
};
