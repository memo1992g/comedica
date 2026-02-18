import apiClient, { getErrorMessage } from './client';

interface BackofficeContextRequest {
  uuid: string;
  pageId: number;
  channel: 'W' | 'WEB' | 'E';
  requestId: string;
}

interface BackofficeResult {
  code: number;
  message: string;
}

interface BackofficeMetadata {
  totalCount?: number;
  filteredCount?: number;
  timestamp?: string;
  transactionId?: string;
}

interface BackofficeEnvelope<T> {
  result?: BackofficeResult;
  metadata?: BackofficeMetadata;
  data?: T;
  errors?: unknown;
}

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
  fields: string;
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

function buildContext(channel: BackofficeContextRequest['channel'] = 'W'): BackofficeContextRequest {
  return {
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel,
    requestId: crypto.randomUUID(),
  };
}

function statusFromNumber(status?: number | null): 'Activo' | 'Inactivo' {
  return status === 1 ? 'Activo' : 'Inactivo';
}

function statusFromLetter(status?: string | null): 'Activo' | 'Inactivo' {
  return status === 'A' ? 'Activo' : 'Inactivo';
}

function statusToNumber(status?: 'Activo' | 'Inactivo'): number {
  return status === 'Activo' ? 1 : 0;
}

function toIsoDate(value?: string | null): string {
  if (!value) {
    return new Date().toISOString();
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function assertProxySuccess<T>(response: BackofficeEnvelope<T>, defaultMessage: string): T {
  if (response?.result && response.result.code !== 0) {
    throw new Error(response.result.message || defaultMessage);
  }

  if (response?.data === undefined || response?.data === null) {
    throw new Error(defaultMessage);
  }

  return response.data;
}

function normalizeSupportReason(item: any): SupportReason {
  return {
    id: String(item?.id ?? ''),
    code: item?.code ?? '',
    description: item?.description ?? '',
    hasQuestionnaire: (item?.requiresQuestionnaire ?? 0) === 1,
    questions: Number(item?.questionCount ?? 0),
    failures: Number(item?.failureCount ?? 0),
    status: statusFromNumber(item?.status),
    createdAt: toIsoDate(item?.createdAt),
    createdBy: item?.createdBy ?? '-',
    updatedAt: toIsoDate(item?.updatedAt),
    updatedBy: item?.updatedBy ?? '-',
  };
}

function normalizeSecurityQuestion(item: any): SecurityQuestion {
  const fallbackCode = item?.id ? `Q-${String(item.id).padStart(3, '0')}` : '';
  return {
    id: String(item?.id ?? ''),
    code: item?.code ?? fallbackCode,
    question: item?.questionText ?? item?.question ?? '',
    fields: item?.fields ?? '',
    status: statusFromNumber(item?.status),
    createdBy: item?.createdBy ?? '-',
    createdAt: toIsoDate(item?.createdAt),
    modifiedBy: item?.updatedBy ?? item?.modifiedBy ?? '-',
    modifiedAt: toIsoDate(item?.updatedAt ?? item?.modifiedAt),
  };
}

function normalizeProduct(item: any, module: 'AH' | 'TC'): Product {
  return {
    id: String(item?.id ?? item?.code ?? item?.productType ?? ''),
    code: item?.code ?? item?.productType ?? '',
    name: item?.name ?? item?.productType ?? '',
    description: item?.description ?? item?.details ?? item?.productType ?? '',
    status: item?.status !== undefined ? statusFromNumber(item?.status) : statusFromLetter(item?.estado),
    category: module === 'TC' ? 'Tarjetas' : 'Productos',
    createdAt: toIsoDate(item?.createdAt),
    createdBy: item?.createdBy ?? '-',
    updatedAt: toIsoDate(item?.updatedAt),
    updatedBy: item?.updatedBy ?? '-',
  };
}

function normalizeSecurityImage(item: any, typeFallback: 'mobile' | 'desktop', clazz: 'P' | 'I'): SecurityImage {
  const inferredType: 'mobile' | 'desktop' = item?.type === 'desktop' || item?.module === 'TC' ? 'desktop' : typeFallback;
  const kind = clazz === 'I' ? 'inicio' : 'seguridad';

  return {
    id: String(item?.id ?? `${item?.productType ?? item?.name ?? 'img'}-${kind}-${inferredType}`),
    name: item?.name ?? item?.productType ?? (clazz === 'I' ? 'Imagen de inicio de sesión' : 'Imagen de seguridad'),
    type: inferredType,
    filename: item?.filename ?? `${item?.productType ?? kind}.png`,
    uploadedAt: toIsoDate(item?.uploadedAt ?? item?.updatedAt ?? item?.createdAt),
    uploadedBy: item?.uploadedBy ?? item?.updatedBy ?? '-',
    size: item?.size ?? '-',
    dimensions: item?.dimensions ?? '-',
    url: item?.url ?? '',
  };
}

function getPagedResult<T>(items: T[], page = 1, pageSize = 20) {
  const safePage = page > 0 ? page : 1;
  const safePageSize = pageSize > 0 ? pageSize : 20;
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  return {
    data: items.slice(start, end),
    total: items.length,
  };
}

async function fetchProductsByModule(module: 'AH' | 'TC') {
  const response = await apiClient.post<BackofficeEnvelope<any[]>>('/products', {
    ...buildContext('E'),
    module,
  });

  const data = assertProxySuccess(response.data, `Error al obtener catálogo (${module})`);
  return data.map((item) => normalizeProduct(item, module));
}

async function fetchImagesByTypeAndClazz(type: 'mobile' | 'desktop', clazz: 'P' | 'I') {
  const module = type === 'desktop' ? 'TC' : 'AH';
  const defaultProduct = type === 'desktop' ? 'TARJETAS' : 'AHORRO PERSONAL';
  const response = await apiClient.get<any[]>('/get-pimage', {
    params: {
      module,
      clazz,
      productType: defaultProduct,
    },
  });

  return (response.data || []).map((item) => normalizeSecurityImage(item, type, clazz));
}

export const maintenanceService = {
  async getSupportReasons(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: SupportReason[]; total: number }> {
    try {
      const response = await apiClient.get<any[]>('/list-support-catalog');
      const normalized = (response.data || []).map(normalizeSupportReason);
      const filtered = params?.search
        ? normalized.filter(
            (item) =>
              item.code.toLowerCase().includes(params.search!.toLowerCase()) ||
              item.description.toLowerCase().includes(params.search!.toLowerCase())
          )
        : normalized;

      return getPagedResult(filtered, params?.page, params?.pageSize);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createSupportReason(reason: Partial<SupportReason>): Promise<void> {
    try {
      await apiClient.post('/create-support-catalog', {
        request: buildContext('WEB'),
        data: {
          code: reason.code,
          description: reason.description,
          status: statusToNumber(reason.status),
        },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateSupportReason(id: string, reason: Partial<SupportReason>): Promise<void> {
    try {
      await apiClient.put(`/update-support-catalog/${id}`, {
        requiresQuestionnaire: reason.hasQuestionnaire ? 1 : 0,
        questionCount: reason.questions ?? 0,
        failureCount: reason.failures ?? 0,
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteSupportReason(id: string): Promise<void> {
    try {
      await apiClient.delete(`/delete-support-catalog/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getSecurityQuestions(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: SecurityQuestion[]; total: number }> {
    try {
      const response = await apiClient.get<BackofficeEnvelope<any[]>>('/list-security-questions', {
        data: buildContext('WEB'),
      });
      const questions = assertProxySuccess(response.data, 'Error al obtener preguntas de seguridad').map(normalizeSecurityQuestion);
      const filtered = params?.search
        ? questions.filter((item) => item.question.toLowerCase().includes(params.search!.toLowerCase()))
        : questions;

      return getPagedResult(filtered, params?.page, params?.pageSize);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createSecurityQuestion(question: Partial<SecurityQuestion>): Promise<void> {
    try {
      await apiClient.post('/create-security-question', {
        ...buildContext('WEB'),
        data: {
          questionText: question.question,
          sqlText: null,
          fields: question.fields || 'texto',
          status: statusToNumber(question.status),
        },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async updateSecurityQuestion(id: string, question: Partial<SecurityQuestion>): Promise<void> {
    try {
      await apiClient.put(`/update-security-question/${id}`, {
        ...buildContext('WEB'),
        data: {
          questionText: question.question,
          sqlText: null,
          fields: question.fields || 'texto',
          status: statusToNumber(question.status),
        },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteSecurityQuestion(id: string): Promise<void> {
    try {
      await apiClient.delete(`/delete-security-question/${id}`, {
        data: buildContext('WEB'),
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getSecurityImages(type?: 'mobile' | 'desktop'): Promise<SecurityImage[]> {
    try {
      if (type) {
        const [security, login] = await Promise.all([
          fetchImagesByTypeAndClazz(type, 'P'),
          fetchImagesByTypeAndClazz(type, 'I'),
        ]);
        return [...security, ...login];
      }

      const [mobileSecurity, mobileLogin, desktopSecurity, desktopLogin] = await Promise.all([
        fetchImagesByTypeAndClazz('mobile', 'P'),
        fetchImagesByTypeAndClazz('mobile', 'I'),
        fetchImagesByTypeAndClazz('desktop', 'P'),
        fetchImagesByTypeAndClazz('desktop', 'I'),
      ]);

      return [...mobileSecurity, ...mobileLogin, ...desktopSecurity, ...desktopLogin];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async uploadSecurityImage(image: Partial<SecurityImage>): Promise<void> {
    try {
      await apiClient.post('/update-pimage', null, {
        params: {
          module: image.type === 'desktop' ? 'TC' : 'AH',
          clazz: image.type === 'desktop' ? 'I' : 'P',
          productType: image.name,
        },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async deleteSecurityImage(id: string): Promise<void> {
    try {
      await apiClient.delete('/delete-pimage', {
        params: {
          module: 'AH',
          clazz: 'I',
          productType: id,
        },
      });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async getProductCatalog(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Product[]; total: number }> {
    try {
      const [ahProducts, tcProducts] = await Promise.all([
        fetchProductsByModule('AH'),
        fetchProductsByModule('TC'),
      ]);

      const catalog = [...ahProducts, ...tcProducts];
      const filtered = params?.search
        ? catalog.filter(
            (item) =>
              item.code.toLowerCase().includes(params.search!.toLowerCase()) ||
              item.name.toLowerCase().includes(params.search!.toLowerCase()) ||
              item.description.toLowerCase().includes(params.search!.toLowerCase()) ||
              item.category.toLowerCase().includes(params.search!.toLowerCase())
          )
        : catalog;

      return getPagedResult(filtered, params?.page, params?.pageSize);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async createProduct(_product: Partial<Product>): Promise<void> {
    throw new Error('La colección actual no incluye endpoint para crear productos.');
  },

  async updateProduct(_id: string, _product: Partial<Product>): Promise<void> {
    throw new Error('La colección actual no incluye endpoint para actualizar productos.');
  },

  async deleteProduct(_id: string): Promise<void> {
    throw new Error('La colección actual no incluye endpoint para eliminar productos.');
  },

  async getAuditLog(): Promise<{ data: MaintenanceAuditLog[]; total: number }> {
    return {
      data: [],
      total: 0,
    };
  },
};
