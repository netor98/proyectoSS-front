import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface UploadResponse {
  message: string;
  avatar_url: string;
  filename: string;
}

export const uploadService = {
  /**
   * Upload avatar image
   */
  uploadAvatar: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/upload/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  /**
   * Delete avatar image
   */
  deleteAvatar: async (): Promise<void> => {
    try {
      await axios.delete(
        `${API_BASE_URL}/upload/avatar`
      );
    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      throw error;
    }
  },

  /**
   * Get avatar URL
   */
  getAvatarUrl: (filename: string): string => {
    return `${API_BASE_URL}/upload/avatar/${filename}`;
  },

  /**
   * Validate image file
   */
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no permitido. Use JPG, PNG, GIF o WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Máximo 5MB.'
      };
    }

    return { isValid: true };
  }
};
