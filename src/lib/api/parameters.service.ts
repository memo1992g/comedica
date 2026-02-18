import apiClient, { getErrorMessage } from './client';
import { 
  ApiResponse, 
  TransactionLimits, 
  UserLimits, 
  AuditLog 
} from '@/types';

export const parametersService = {
  // Obtener límites generales
  async getGeneralLimits(): Promise<TransactionLimits[]> {
    try {
      const response = await apiClient.get<ApiResponse<TransactionLimits[]>>(
        '/parameters/limits/general'
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Actualizar límites generales
  async updateGeneralLimits(limits: Partial<TransactionLimits>[]): Promise<void> {
    try {
      await apiClient.put('/parameters/limits/general', { limits });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Obtener límites por usuario
  async getUserLimits(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: UserLimits[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: UserLimits[]; total: number }>>(
        '/parameters/limits/users',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Actualizar límites de un usuario específico
  async updateUserLimits(userId: string, limits: UserLimits['limits']): Promise<void> {
    try {
      await apiClient.put(`/parameters/limits/users/${userId}`, { limits });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Eliminar límites personalizados de un usuario (vuelve a usar los generales)
  async deleteUserLimits(userId: string): Promise<void> {
    try {
      await apiClient.delete(`/parameters/limits/users/${userId}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Obtener historial de auditoría
  async getAuditLog(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    module?: string;
  }): Promise<{ data: AuditLog[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: AuditLog[]; total: number }>>(
        '/parameters/audit',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Obtener resumen reciente de auditoría
  async getRecentAudit(limit: number = 5): Promise<AuditLog[]> {
    try {
      const response = await apiClient.get<ApiResponse<AuditLog[]>>(
        '/parameters/audit/recent',
        { params: { limit } }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Obtener configuración de seguridad
  async getSecurityConfig(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        '/parameters/security'
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Actualizar configuración de seguridad
  async updateSecurityConfig(config: any): Promise<void> {
    try {
      await apiClient.put('/parameters/security', { config });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== TRANSFER365 ====================

  // Obtener instituciones locales
  async getLocalInstitutions(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: any[]; total: number }>>(
        '/parameters/transfer365/local',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Obtener instituciones CA-RD
  async getCARDInstitutions(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: any[]; total: number }>>(
        '/parameters/transfer365/card',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Crear institución local
  async createLocalInstitution(institution: any): Promise<void> {
    try {
      await apiClient.post('/parameters/transfer365/local', { institution });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Crear institución CA-RD
  async createCARDInstitution(institution: any): Promise<void> {
    try {
      await apiClient.post('/parameters/transfer365/card', { institution });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Actualizar institución local
  async updateLocalInstitution(id: string, institution: any): Promise<void> {
    try {
      await apiClient.put(`/parameters/transfer365/local/${id}`, { institution });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Actualizar institución CA-RD
  async updateCARDInstitution(id: string, institution: any): Promise<void> {
    try {
      await apiClient.put(`/parameters/transfer365/card/${id}`, { institution });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Eliminar institución local
  async deleteLocalInstitution(id: string): Promise<void> {
    try {
      await apiClient.delete(`/parameters/transfer365/local/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Eliminar institución CA-RD
  async deleteCARDInstitution(id: string): Promise<void> {
    try {
      await apiClient.delete(`/parameters/transfer365/card/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
