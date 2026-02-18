/**
 * Servicio de Mantenimiento
 * 
 * PREPARADO PARA INTEGRACIÓN CON BACKEND JAVA
 * 
 * Para conectar con Java:
 * 1. Cambiar baseURL en api-client.ts a la URL del servidor Java
 * 2. El backend Java debe implementar estos mismos endpoints
 * 3. Mantener la misma estructura de request/response
 * 
 * Ejemplo configuración para Java:
 * // api-client.ts
 * const apiClient = axios.create({
 *   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
 *   headers: { 'Content-Type': 'application/json' }
 * });
 */

import apiClient from './client';

// ==================== TIPOS E INTERFACES ====================

export interface SupportReason {
  id: string;
  code: string;
  description: string;
  hasQuestionnaire: boolean;
  questions: number;
  failures: number;
  status: 'Activo' | 'Inactivo';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface SecurityQuestion {
  id: string;
  code: string;
  question: string;
  status: 'Activo' | 'Inactivo';
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface SecurityImage {
  id: string;
  name: string;
  type: 'mobile' | 'desktop';
  filename: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
  dimensions: string;
  url: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'Activo' | 'Inactivo';
  category: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface MaintenanceAuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  changes: Array<{
    field: string;
    oldValue: string | number;
    newValue: string | number;
  }>;
  timestamp: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ==================== FUNCIONES AUXILIARES ====================

function getErrorMessage(error: any): string {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'Error desconocido';
}

// ==================== SERVICIO ====================

export const maintenanceService = {
  
  // ==================== ATENCIÓN Y SOPORTE ====================
  
  /**
   * GET /api/maintenance/support-reasons
   * Obtiene lista de motivos de soporte con paginación
   */
  async getSupportReasons(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: SupportReason[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: SupportReason[]; total: number }>>(
        '/maintenance/support-reasons',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /api/maintenance/support-reasons
   * Crea un nuevo motivo de soporte
   */
  async createSupportReason(reason: Partial<SupportReason>): Promise<void> {
    try {
      await apiClient.post('/maintenance/support-reasons', { reason });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /api/maintenance/support-reasons/:id
   * Actualiza un motivo existente
   */
  async updateSupportReason(id: string, reason: Partial<SupportReason>): Promise<void> {
    try {
      await apiClient.put(`/maintenance/support-reasons/${id}`, { reason });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /api/maintenance/support-reasons/:id
   * Elimina un motivo
   */
  async deleteSupportReason(id: string): Promise<void> {
    try {
      await apiClient.delete(`/maintenance/support-reasons/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== CUESTIONARIO DE SEGURIDAD ====================
  
  /**
   * GET /api/maintenance/security-questions
   * Obtiene lista de preguntas de seguridad
   */
  async getSecurityQuestions(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: SecurityQuestion[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: SecurityQuestion[]; total: number }>>(
        '/maintenance/security-questions',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /api/maintenance/security-questions
   * Crea una nueva pregunta
   */
  async createSecurityQuestion(question: Partial<SecurityQuestion>): Promise<void> {
    try {
      await apiClient.post('/maintenance/security-questions', { question });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /api/maintenance/security-questions/:id
   * Actualiza una pregunta existente
   */
  async updateSecurityQuestion(id: string, question: Partial<SecurityQuestion>): Promise<void> {
    try {
      await apiClient.put(`/maintenance/security-questions/${id}`, { question });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /api/maintenance/security-questions/:id
   * Elimina una pregunta
   */
  async deleteSecurityQuestion(id: string): Promise<void> {
    try {
      await apiClient.delete(`/maintenance/security-questions/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== IMÁGENES ====================
  
  /**
   * GET /api/maintenance/security-images
   * Obtiene lista de imágenes de seguridad
   */
  async getSecurityImages(type?: 'mobile' | 'desktop'): Promise<SecurityImage[]> {
    try {
      const response = await apiClient.get<ApiResponse<SecurityImage[]>>(
        '/maintenance/security-images',
        { params: type ? { type } : {} }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /api/maintenance/security-images
   * Sube una nueva imagen
   * 
   * NOTA: En producción con Java, este endpoint debe manejar multipart/form-data
   * Ejemplo en Java con Spring Boot:
   * 
   * @PostMapping("/security-images")
   * public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file,
   *                                      @RequestParam("type") String type,
   *                                      @RequestParam("name") String name) {
   *   // Procesar archivo
   * }
   */
  async uploadSecurityImage(image: Partial<SecurityImage>): Promise<void> {
    try {
      await apiClient.post('/maintenance/security-images', { image });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /api/maintenance/security-images/:id
   * Elimina una imagen
   */
  async deleteSecurityImage(id: string): Promise<void> {
    try {
      await apiClient.delete(`/maintenance/security-images/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== CATÁLOGO DE PRODUCTOS ====================
  
  /**
   * GET /api/maintenance/product-catalog
   * Obtiene lista de productos
   */
  async getProductCatalog(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Product[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: Product[]; total: number }>>(
        '/maintenance/product-catalog',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * POST /api/maintenance/product-catalog
   * Crea un nuevo producto
   */
  async createProduct(product: Partial<Product>): Promise<void> {
    try {
      await apiClient.post('/maintenance/product-catalog', { product });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * PUT /api/maintenance/product-catalog/:id
   * Actualiza un producto existente
   */
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      await apiClient.put(`/maintenance/product-catalog/${id}`, { product });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * DELETE /api/maintenance/product-catalog/:id
   * Elimina un producto
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/maintenance/product-catalog/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // ==================== AUDITORÍA ====================
  
  /**
   * GET /api/maintenance/audit
   * Obtiene historial de auditoría
   */
  async getAuditLog(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    module?: string;
  }): Promise<{ data: MaintenanceAuditLog[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: MaintenanceAuditLog[]; total: number }>>(
        '/maintenance/audit',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
