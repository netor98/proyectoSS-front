import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  first_names: string;
  last_names: string;
  email: string;
  phone_number: string;
  employee_number: string;
  role: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  is_verified: boolean;
  avatar: string;
}

class AuthService {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - not needed since we use cookies
    axios.interceptors.request.use(
      (config) => {
        // Ensure credentials are included
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't intercept login or refresh requests - let them handle their own errors
        if (originalRequest.url?.includes('/auth/token') ||
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/register')) {
          return Promise.reject(error);
        }

        // Check if error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return axios(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            await this.refreshToken();
            this.processQueue(null);
            return axios(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            // Redirect to login or handle logout
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  private handleAuthFailure() {
    // Clear any stored user data
    localStorage.removeItem('user_data');

    // Redirect to login page
    if (window.location.pathname !== '/auth/login') {
      window.location.href = '/auth/login';
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: User; tokens: LoginResponse }> {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // First, authenticate and get tokens
      const authResponse = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/token`,
        { email, password },
        {
          withCredentials: true,
          signal: controller.signal,
          timeout: 10000
        }
      );

      // Then fetch user profile
      const profileResponse = await axios.get<User>(
        `${API_BASE_URL}/auth/profile`,
        {
          withCredentials: true,
          signal: controller.signal,
          timeout: 10000
        }
      );

      clearTimeout(timeoutId);

      return {
        user: profileResponse.data,
        tokens: authResponse.data
      };
    } catch (error: any) {
      console.error('AuthService: Login failed:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
    return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await axios.get<User>(
        `${API_BASE_URL}/auth/profile`,
        { withCredentials: true }
      );
    return response.data;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem('user_data');
    }
  }

  /**
   * Check if user is authenticated by trying to get profile
   */
  async checkAuth(): Promise<User | null> {
    try {
      const user = await this.getProfile();
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
