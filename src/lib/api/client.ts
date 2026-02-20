import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bo-comedica-service-dev.echotechs.net/api';

// Crear instancia de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - agregar token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.get<string>('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - manejo de errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores específicos
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Token inválido o expirado
          storage.remove('auth_token');
          storage.remove('user');
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
            window.location.href = '/auth/login';
          }
          break;
        case 403:
          // Sin permisos
          console.error('Acceso denegado');
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Error de red
      console.error('Error de conexión con el servidor');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper para normalizar respuestas de error
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Error desconocido';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
}
