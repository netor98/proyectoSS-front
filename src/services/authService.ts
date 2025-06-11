import axios from 'axios';

/**
 * Authentication service that handles all auth-related API calls
 * Separates API logic from UI components and state management
 */
export const authService = {
  /**
   * Base URL for authentication endpoints
   */
  baseURL: 'http://localhost:8000/api/auth',

  /**
   * Login user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Promise with user data
   */
  async login(email: string, password: string) {
    const response = await axios.post(`${this.baseURL}/token`, {
      email,
      password
    }, {
      withCredentials: true
    });
    return response.data;
  },

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with user data
   */
  async register(userData: any) {
    const response = await axios.post(`${this.baseURL}/register`, userData);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns Promise with user data
   */
  async getProfile() {
    const response = await axios.get(`${this.baseURL}/profile`, {
      withCredentials: true
    });
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   * @returns Promise with new token data
   */
  async refreshToken() {
    const response = await axios.post(`${this.baseURL}/refresh`, {}, {
      withCredentials: true
    });
    return response.data;
  },

  /**
   * Logout current user
   * @returns Promise with logout confirmation
   */
  async logout() {
    const response = await axios.post(`${this.baseURL}/logout`, {}, {
      withCredentials: true
    });
    return response.data;
  }
};
