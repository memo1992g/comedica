import apiClient, { getErrorMessage } from './client';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  PasswordChangeRequest, 
  User 
} from '@/types';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  },

  // Primer cambio de contraseña (temporal -> personalizada)
  async firstPasswordChange(request: PasswordChangeRequest): Promise<void> {
    try {
      await apiClient.post('/auth/first-password-change', request);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Cambio de contraseña voluntario
  async changePassword(request: PasswordChangeRequest): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', request);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Validar sesión actual
  async validateSession(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/session');
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Verificar si usuario requiere cambio de contraseña
  async checkPasswordExpiration(): Promise<{ expired: boolean; daysUntilExpiration: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ expired: boolean; daysUntilExpiration: number }>>(
        '/auth/password-status'
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
