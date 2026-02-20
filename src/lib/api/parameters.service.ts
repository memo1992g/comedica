import apiClient, { getErrorMessage } from './client';
import {
  ApiResponse,
  TransactionLimits,
  UserLimits,
  AuditLog,
} from '@/types';

interface ParamsProxyRequest<T> {
  uuid: string;
  channel: string;
  pageId: number;
  request: T;
}

interface ParamsProxyResult {
  code: number;
  message: string;
}

interface ParamsProxyMetadata {
  totalCount?: number;
  filteredCount?: number;
  timestamp?: string;
  transactionId?: string;
}

interface ParamsProxyResponse<T> {
  result: ParamsProxyResult;
  correlative?: string;
  metadata?: ParamsProxyMetadata;
  data: T;
  errors?: unknown;
  version?: number;
}

interface T365Envelope<T> {
  result?: ParamsProxyResult;
  metadata?: ParamsProxyMetadata;
  data?: T;
}

interface T365LocalRaw {
  id: number;
  descripcion: string;
  codcompensa: string;
  nombrecorto: string;
  nombre: string;
  estado: string;
  bic: string;
  ahorro?: string;
  corriente?: string;
  credito?: string;
  tarjeta?: string;
  movil?: string;
}

interface T365CardRaw {
  id: number;
  pais_SIG?: string;
  pais_NOMBRE?: string;
  nombre_BANCO?: string;
  bic_NOMBRE?: string;
  estado?: string;
  pais?: string;
  nombrePais?: string;
  banco?: string;
  bic?: string;
}

export interface ParamsProxyItem {
  name: string;
  value: string | number | boolean | null;
  description?: string | null;
  status?: number | null;
}

function normalizeParamsProxyItems(payload: unknown): ParamsProxyItem[] {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as any)?.data)
      ? (payload as any).data
      : [];

  return source.map((item: any) => ({
    name: item?.name ?? item?.paramName ?? '',
    value: item?.value ?? item?.paramValue ?? null,
    description: item?.description ?? item?.paramDescription ?? null,
    status: item?.status ?? null,
  } )).filter((item: ParamsProxyItem) => item.name);
}

function buildParamsProxyRequest<T>(request: T): ParamsProxyRequest<T> {
  return {
    uuid: crypto.randomUUID(),
    channel: 'W',
    pageId: 1,
    request,
  };
}

function buildT365Context() {
  return {
    uuid: crypto.randomUUID(),
    pageId: 1,
    channel: 'WEB',
  };
}

function assertProxySuccess<T>(response: ParamsProxyResponse<T> | ApiResponse<T>): T {
  const hasResultCode = typeof (response as ParamsProxyResponse<T>)?.result?.code === 'number';

  if (hasResultCode && (response as ParamsProxyResponse<T>).result.code !== 0) {
    throw new Error((response as ParamsProxyResponse<T>)?.result?.message || 'Error consumiendo servicio de parámetros');
  }

  if (typeof (response as ApiResponse<T>)?.success === 'boolean' && !(response as ApiResponse<T>).success) {
    throw new Error((response as ApiResponse<T>).error || (response as ApiResponse<T>).message || 'Error consumiendo servicio de parámetros');
  }

  return (response as ParamsProxyResponse<T>).data ?? (response as ApiResponse<T>).data as T;
}

function assertT365Success<T>(response: T365Envelope<T>): T {
  if (response?.result && response.result.code !== 0) {
    throw new Error(response.result.message || 'Error consumiendo servicio Transfer365');
  }
  return (response?.data ?? []) as T;
}

function normalizeStatus(status: string): 'Activo' | 'Inactivo' {
  return status === 'A' ? 'Activo' : 'Inactivo';
}

function mapLocalInstitution(raw: T365LocalRaw) {
  const products: string[] = [];
  if (raw.ahorro === '1') products.push('Ahorro');
  if (raw.corriente === '1') products.push('Corriente');
  if (raw.credito === '1') products.push('Crédito');
  if (raw.tarjeta === '1') products.push('Tarjeta');
  if (raw.movil === '1') products.push('Móvil');

  return {
    id: String(raw.id),
    bic: raw.bic,
    shortName: raw.nombrecorto,
    status: normalizeStatus(raw.estado),
    fullName: raw.nombre,
    institution: raw.descripcion,
    compensate: raw.codcompensa,
    products,
    ahorro: raw.ahorro === '1',
    corriente: raw.corriente === '1',
    credito: raw.credito === '1',
    tarjeta: raw.tarjeta === '1',
    movil: raw.movil === '1',
  };
}

function mapCardInstitution(raw: T365CardRaw) {
  return {
    id: String(raw.id),
    bic: raw.bic ?? raw.bic_NOMBRE ?? '',
    fullName: raw.banco ?? raw.nombre_BANCO ?? '',
    status: normalizeStatus(raw.estado ?? 'A'),
    country: raw.nombrePais ?? raw.pais_NOMBRE ?? raw.pais ?? raw.pais_SIG ?? '',
    countryCode: raw.pais ?? raw.pais_SIG ?? '',
  };
}

function filterBySearch<T extends Record<string, any>>(data: T[], search?: string, fields: Array<keyof T> = []) {
  if (!search) return data;
  const q = search.toLowerCase();
  return data.filter((item) => fields.some((field) => String(item[field] ?? '').toLowerCase().includes(q)));
}

function paginate<T>(data: T[], page = 1, pageSize = 20): { data: T[]; total: number } {
  const currentPage = page > 0 ? page : 1;
  const size = pageSize > 0 ? pageSize : 20;
  const start = (currentPage - 1) * size;

  return {
    data: data.slice(start, start + size),
    total: data.length,
  };
}

function findParamValue(items: ParamsProxyItem[], names: string[], fallback: number): number {
  const normalizedNames = names.map((name) => name.toLowerCase());
  const match = items.find((item) => normalizedNames.includes(item.name.toLowerCase()));
  const value = Number(match?.value);
  return Number.isFinite(value) ? value : fallback;
}

function buildSecurityConfigFromParams(items: ParamsProxyItem[]) {
  return {
    id: 'security-config',
    passwordExpiration: findParamValue(items, ['PASSWORD_EXPIRATION', 'VIGENCIA_CONTRASENA', 'passwordExpiration'], 150),
    sessionTimeout: findParamValue(items, ['SESSION_TIMEOUT', 'TIEMPO_SESION', 'sessionTimeout'], 180),
    minUsernameLength: findParamValue(items, ['MIN_USERNAME_LENGTH', 'LONGITUD_MIN_USUARIO', 'minUsernameLength'], 6),
    maxUsernameLength: findParamValue(items, ['MAX_USERNAME_LENGTH', 'LONGITUD_MAX_USUARIO', 'maxUsernameLength'], 20),
    minPasswordLength: findParamValue(items, ['MIN_PASSWORD_LENGTH', 'LONGITUD_MIN_PASSWORD', 'minPasswordLength'], 8),
    maxPasswordLength: findParamValue(items, ['MAX_PASSWORD_LENGTH', 'LONGITUD_MAX_PASSWORD', 'maxPasswordLength'], 20),
    codeExpiration: findParamValue(items, ['CODE_EXPIRATION', 'VIGENCIA_CODIGOS', 'codeExpiration'], 300),
    softTokenExpiration: findParamValue(items, ['SOFT_TOKEN_EXPIRATION', 'VIGENCIA_SOFT_TOKEN', 'softTokenExpiration'], 60),
    updatedAt: new Date().toISOString(),
    updatedBy: 'sistema',
  };
}

export const parametersService = {
  // Proxy real de parámetros (comedica-bel-msvc-params)
  async getParams(request?: Partial<ParamsProxyItem>): Promise<ParamsProxyItem[]> {
    try {
      const response = await apiClient.post<ParamsProxyResponse<ParamsProxyItem[]>>(
        '/params/get-params',
        buildParamsProxyRequest({
          name: request?.name ?? null,
          value: request?.value ?? null,
          description: request?.description ?? null,
          status: request?.status ?? null,
        })
      );

      const rawData = assertProxySuccess(response.data as any);
      return normalizeParamsProxyItems(rawData);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async saveParam(param: ParamsProxyItem): Promise<ParamsProxyItem> {
    try {
      const response = await apiClient.post<ParamsProxyResponse<ParamsProxyItem>>(
        '/params/save',
        buildParamsProxyRequest(param)
      );

      return assertProxySuccess(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async editParam(param: ParamsProxyItem): Promise<ParamsProxyItem> {
    try {
      const response = await apiClient.put<ParamsProxyResponse<ParamsProxyItem>>(
        '/params/edit',
        buildParamsProxyRequest(param)
      );

      return assertProxySuccess(response.data);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  // Obtener límites generales (proxy params con fallback al endpoint legacy)
  async getGeneralLimits(): Promise<TransactionLimits[]> {
    try {
      const params = await this.getParams();
      return [
        {
          id: 'canales_electronicos',
          category: 'canales_electronicos',
          maxPerTransaction: findParamValue(params, ['CE_MAX_TX', 'CE_MAX_TRANSACCION'], 1000),
          maxDaily: findParamValue(params, ['CE_MAX_DAILY', 'CE_MAX_DIARIO'], 2000),
          maxMonthly: findParamValue(params, ['CE_MAX_MONTHLY', 'CE_MAX_MENSUAL'], 10000),
          updatedAt: new Date().toISOString(),
          updatedBy: 'sistema',
        },
        {
          id: 'punto_xpress_ahorro',
          category: 'punto_xpress',
          subcategory: 'cuentas_ahorro',
          maxPerTransaction: findParamValue(params, ['PX_AH_MAX_TX', 'PX_AHORRO_MONTO_MAX'], 500),
          maxDaily: 0,
          maxMonthly: 0,
          maxMonthlyTransactions: findParamValue(params, ['PX_AH_MAX_TX_MENSUALES', 'PX_AHORRO_TX_MENSUAL'], 30),
          updatedAt: new Date().toISOString(),
          updatedBy: 'sistema',
        },
        {
          id: 'punto_xpress_corriente',
          category: 'punto_xpress',
          subcategory: 'cuentas_corriente',
          maxPerTransaction: findParamValue(params, ['PX_CC_MAX_TX', 'PX_CORRIENTE_MONTO_MAX'], 800),
          maxDaily: 0,
          maxMonthly: 0,
          maxMonthlyTransactions: findParamValue(params, ['PX_CC_MAX_TX_MENSUALES', 'PX_CORRIENTE_TX_MENSUAL'], 50),
          updatedAt: new Date().toISOString(),
          updatedBy: 'sistema',
        },
      ];
    } catch (proxyError) {
      try {
        const response = await apiClient.get<ApiResponse<TransactionLimits[]>>('/parameters/limits/general');
        return response.data.data!;
      } catch (error) {
        throw new Error(getErrorMessage(proxyError || error));
      }
    }
  },

  // Actualizar límites generales (proxy params con fallback legacy)
  async updateGeneralLimits(limits: Partial<TransactionLimits>[]): Promise<void> {
    try {
      const channels = limits.find((l) => l.category === 'canales_electronicos');
      const pxSavings = limits.find((l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_ahorro');
      const pxCurrent = limits.find((l) => l.category === 'punto_xpress' && l.subcategory === 'cuentas_corriente');

      const updates: ParamsProxyItem[] = [];

      if (channels) {
        updates.push(
          { name: 'CE_MAX_TRANSACCION', value: channels.maxPerTransaction ?? 0 },
          { name: 'CE_MAX_DIARIO', value: channels.maxDaily ?? 0 },
          { name: 'CE_MAX_MENSUAL', value: channels.maxMonthly ?? 0 },
        );
      }

      if (pxSavings) {
        updates.push(
          { name: 'PX_AHORRO_MONTO_MAX', value: pxSavings.maxPerTransaction ?? 0 },
          { name: 'PX_AHORRO_TX_MENSUAL', value: pxSavings.maxMonthlyTransactions ?? 0 },
        );
      }

      if (pxCurrent) {
        updates.push(
          { name: 'PX_CORRIENTE_MONTO_MAX', value: pxCurrent.maxPerTransaction ?? 0 },
          { name: 'PX_CORRIENTE_TX_MENSUAL', value: pxCurrent.maxMonthlyTransactions ?? 0 },
        );
      }

      await Promise.all(updates.map((item) => this.editParam(item)));
    } catch (proxyError) {
      try {
        await apiClient.put('/parameters/limits/general', { limits });
      } catch (error) {
        throw new Error(getErrorMessage(proxyError || error));
      }
    }
  },

  // Obtener límites por usuario (sin endpoint real en colecciones; se mantiene legacy)
  async getUserLimits(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: UserLimits[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: UserLimits[]; total: number }>>('/parameters/limits/users', { params });
      return response.data.data!;
    } catch (error) {
      console.warn('No se pudieron cargar límites por usuario desde servicio real:', getErrorMessage(error));
      return { data: [], total: 0 };
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

  // Obtener historial de auditoría (sin endpoint real identificado para estos módulos)
  async getAuditLog(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
    module?: string;
  }): Promise<{ data: AuditLog[]; total: number }> {
    try {
      const response = await apiClient.get<ApiResponse<{ data: AuditLog[]; total: number }>>('/parameters/audit', { params });
      return response.data.data!;
    } catch (error) {
      console.warn('No se pudo cargar auditoría desde servicio real:', getErrorMessage(error));
      return { data: [], total: 0 };
    }
  },

  // Obtener resumen reciente de auditoría
  async getRecentAudit(limit: number = 5): Promise<AuditLog[]> {
    try {
      const response = await apiClient.get<ApiResponse<AuditLog[]>>('/parameters/audit/recent', { params: { limit } });
      return response.data.data!;
    } catch (error) {
      console.warn('No se pudo cargar auditoría reciente desde servicio real:', getErrorMessage(error));
      return [];
    }
  },

  // Obtener configuración de seguridad (proxy params con fallback)
  async getSecurityConfig(): Promise<any> {
    try {
      const params = await this.getParams();
      return buildSecurityConfigFromParams(params);
    } catch (proxyError) {
      try {
        const response = await apiClient.get<ApiResponse<any>>('/parameters/security');
        return response.data.data!;
      } catch (error) {
        throw new Error(getErrorMessage(proxyError || error));
      }
    }
  },

  // Actualizar configuración de seguridad (proxy params con fallback)
  async updateSecurityConfig(config: any): Promise<void> {
    try {
      const updates: ParamsProxyItem[] = [
        { name: 'VIGENCIA_CONTRASENA', value: config.passwordExpiration },
        { name: 'TIEMPO_SESION', value: config.sessionTimeout },
        { name: 'LONGITUD_MIN_USUARIO', value: config.minUsernameLength },
        { name: 'LONGITUD_MAX_USUARIO', value: config.maxUsernameLength },
        { name: 'LONGITUD_MIN_PASSWORD', value: config.minPasswordLength },
        { name: 'LONGITUD_MAX_PASSWORD', value: config.maxPasswordLength },
        { name: 'VIGENCIA_CODIGOS', value: config.codeExpiration },
        { name: 'VIGENCIA_SOFT_TOKEN', value: config.softTokenExpiration },
      ];

      await Promise.all(updates.map((item) => this.editParam(item)));
    } catch (proxyError) {
      try {
        await apiClient.put('/parameters/security', { config });
      } catch (error) {
        throw new Error(getErrorMessage(proxyError || error));
      }
    }
  },

  // ==================== TRANSFER365 ====================

  // Obtener instituciones locales (endpoint real colección BEL)
  async getLocalInstitutions(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; total: number }> {
    try {
      const response = await apiClient.post<T365Envelope<T365LocalRaw[]>>('/t365/get-banks');
      const mapped = assertT365Success(response.data).map(mapLocalInstitution);
      const filtered = filterBySearch(mapped, params?.search, ['bic', 'shortName', 'fullName', 'institution']);
      return paginate(filtered, params?.page, params?.pageSize);
    } catch (error) {
      // fallback legacy
      try {
        const response = await apiClient.get<ApiResponse<{ data: any[]; total: number }>>('/parameters/transfer365/local', { params });
        return response.data.data!;
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Obtener instituciones CA-RD (endpoint real colección BEL)
  async getCARDInstitutions(params?: {
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: any[]; total: number }> {
    try {
      const response = await apiClient.post<T365Envelope<T365CardRaw[]>>('/t365/get-banks-CARD');
      const mapped = assertT365Success(response.data).map(mapCardInstitution);
      const filtered = filterBySearch(mapped, params?.search, ['bic', 'fullName', 'country']);
      return paginate(filtered, params?.page, params?.pageSize);
    } catch (error) {
      // fallback legacy
      try {
        const response = await apiClient.get<ApiResponse<{ data: any[]; total: number }>>('/parameters/transfer365/card', { params });
        return response.data.data!;
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Crear institución local
  async createLocalInstitution(institution: any): Promise<void> {
    try {
      await apiClient.post('/t365/bank-create', {
        ...buildT365Context(),
        request: {
          codeBic: institution.bic,
          compensate: institution.compensate || '00',
          name: institution.fullName,
          shortName: institution.shortName,
          saving: institution.ahorro || institution.products?.includes('Ahorro') ? '1' : '0',
          current: institution.corriente || institution.products?.includes('Corriente') ? '1' : '0',
          credit: institution.credito || institution.products?.includes('Crédito') ? '1' : '0',
          card: institution.tarjeta || institution.products?.includes('Tarjeta') ? '1' : '0',
          mobile: institution.movil || institution.products?.includes('Móvil') ? '1' : '0',
          user: 'BACKOFFICE',
          description: institution.institution || institution.fullName,
        },
      });
    } catch (error) {
      // fallback legacy
      try {
        await apiClient.post('/parameters/transfer365/local', { institution });
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Crear institución CA-RD
  async createCARDInstitution(institution: any): Promise<void> {
    try {
      const countryCode = institution.countryCode || institution.country?.slice(0, 2)?.toUpperCase() || 'SV';
      await apiClient.post('/t365/bank-create-CARD', {
        ...buildT365Context(),
        request: {
          assigCountry: countryCode,
          bankName: institution.fullName,
          codeBic: institution.bic,
          user: 'BACKOFFICE',
        },
      });
    } catch (error) {
      // fallback legacy
      try {
        await apiClient.post('/parameters/transfer365/card', { institution });
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Actualizar institución local
  async updateLocalInstitution(id: string, institution: any): Promise<void> {
    try {
      await apiClient.post('/t365/bank-modify', {
        ...buildT365Context(),
        request: {
          id: Number(id),
          codeBic: institution.bic,
          compensate: institution.compensate || '00',
          name: institution.fullName,
          shortName: institution.shortName,
          saving: institution.ahorro || institution.products?.includes('Ahorro') ? '1' : '0',
          current: institution.corriente || institution.products?.includes('Corriente') ? '1' : '0',
          credit: institution.credito || institution.products?.includes('Crédito') ? '1' : '0',
          card: institution.tarjeta || institution.products?.includes('Tarjeta') ? '1' : '0',
          mobile: institution.movil || institution.products?.includes('Móvil') ? '1' : '0',
          user: 'BACKOFFICE',
          description: institution.institution || institution.fullName,
          status: institution.status === 'Activo' ? 'A' : 'I',
        },
      });
    } catch (error) {
      // fallback legacy
      try {
        await apiClient.put(`/parameters/transfer365/local/${id}`, { institution });
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Actualizar institución CA-RD
  async updateCARDInstitution(id: string, institution: any): Promise<void> {
    try {
      const countryCode = institution.countryCode || institution.country?.slice(0, 2)?.toUpperCase() || 'SV';
      await apiClient.post('/t365/bank-modify-CARD', {
        ...buildT365Context(),
        request: {
          id: Number(id),
          assigCountry: countryCode,
          countryName: institution.country,
          bankName: institution.fullName,
          codeBic: institution.bic,
          user: 'BACKOFFICE',
          status: institution.status === 'Activo' ? 'A' : 'I',
        },
      });
    } catch (error) {
      // fallback legacy
      try {
        await apiClient.put(`/parameters/transfer365/card/${id}`, { institution });
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Eliminar institución local (en API real se usa modify con estado I)
  async deleteLocalInstitution(id: string): Promise<void> {
    try {
      await apiClient.post('/t365/bank-modify', {
        ...buildT365Context(),
        request: {
          id: Number(id),
          status: 'I',
          user: 'BACKOFFICE',
        },
      });
    } catch (error) {
      // fallback legacy
      try {
        await apiClient.delete(`/parameters/transfer365/local/${id}`);
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },

  // Eliminar institución CA-RD (en API real se usa modify con estado I)
  async deleteCARDInstitution(id: string): Promise<void> {
    try {
      await apiClient.post('/t365/bank-modify-CARD', {
        ...buildT365Context(),
        request: {
          id: Number(id),
          status: 'I',
          user: 'BACKOFFICE',
        },
      });
    } catch (error) {
      // fallback legacy
      try {
        await apiClient.delete(`/parameters/transfer365/card/${id}`);
      } catch (fallbackError) {
        throw new Error(getErrorMessage(error || fallbackError));
      }
    }
  },
};
