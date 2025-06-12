import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface UpdateUserData {
  first_names?: string;
  last_names?: string;
  email?: string;
  employee_number?: string;
  phone_number?: string;
}

export const userService = {
  /**
   * Update user profile
   */
  updateProfile: async (userId: string, userData: UpdateUserData) => {
    try {
      // Filter out empty strings, undefined values, and whitespace-only strings
      const cleanedData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => {
          return value !== '' &&
                 value !== undefined &&
                 value !== null &&
                 (typeof value === 'string' ? value.trim() !== '' : true);
        })
      );

      console.log('Sending update data:', cleanedData); // Debug log

      // Don't send request if no data to update
      if (Object.keys(cleanedData).length === 0) {
        throw new Error('No hay datos para actualizar');
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}`,
        cleanedData
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      console.error('Error response:', error.response?.data); // Debug log
      throw error;
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/auth/profile`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};
