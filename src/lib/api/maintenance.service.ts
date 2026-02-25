"use server";

import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";
import { APP_COOKIES } from "@/consts/cookies/cookies.consts";

export type {
  SupportReason,
  SecurityQuestion,
  SecurityImage,
  Product,
  MaintenanceAuditLog,
} from './types/maintenance.types';

import type {
  SupportReason,
  SecurityQuestion,
  SecurityImage,
  Product,
  MaintenanceAuditLog,
} from './types/maintenance.types';

const API_URL = 'https://bo-comedica-service-dev.echotechs.net/api';

function resolveAccessToken(): string | null {
  const cookieStore = cookies();
  const clientTokenRaw = cookieStore.get(APP_COOKIES.AUTH.CLIENT_TOKEN)?.value;

  if (clientTokenRaw) {
    try {
      const parsed = JSON.parse(clientTokenRaw);
      const tokenFromJson = parsed?.accessToken ?? parsed?.token ?? null;
      if (tokenFromJson && typeof tokenFromJson === 'string') {
        return tokenFromJson;
      }
    } catch {
      return clientTokenRaw;
    }
  }

  return cookieStore.get(APP_COOKIES.AUTH.ACCESS_TOKEN)?.value || null;
}

function getAuthHeaders(contentType: 'json' | 'multipart' = 'json', includeUserHeader = false): Record<string, string> {
  const accessToken = resolveAccessToken();

  const headers: Record<string, string> = {};
  if (contentType === 'json') {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (includeUserHeader) {
    headers['X-User'] = getRequestUser();
  }
  return headers;
}

function getRequestUser(): string {
  return cookies().get(APP_COOKIES.AUTH.LOGIN_USERNAME)?.value || 'admin';
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}

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
  const headers = getAuthHeaders();
  const response = await customAuthFetch<BackofficeEnvelope<any[]>>(
    `${API_URL}/products`,
    {
      method: "POST",
      body: JSON.stringify({ ...buildContext('E'), module }),
      headers,
    },
  );

  const data = assertProxySuccess(response, `Error al obtener catálogo (${module})`);
  return data.map((item) => normalizeProduct(item, module));
}

async function fetchImagesByTypeAndClazz(type: 'mobile' | 'desktop', clazz: 'P' | 'I') {
  const headers = getAuthHeaders();
  const moduleCode = type === 'desktop' ? 'TC' : 'AH';
  const defaultProduct = type === 'desktop' ? 'TARJETAS' : 'AHORRO PERSONAL';
  const params = new URLSearchParams({ module: moduleCode, clazz, productType: defaultProduct });

  const response = await customAuthFetch<any[]>(
    `${API_URL}/get-pimage?${params.toString()}`,
    { method: "GET", headers },
  );

  return (response || []).map((item) => normalizeSecurityImage(item, type, clazz));
}

export async function getSupportReasons(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: SupportReason[]; total: number }> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<any[]>(
      `${API_URL}/list-support-catalog`,
      { method: "GET", headers },
    );
    const normalized = (response || []).map(normalizeSupportReason);
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
}

export async function createSupportReason(reason: Partial<SupportReason>): Promise<void> {
  try {
    const headers = getAuthHeaders('json', true);
    const response = await customAuthFetch<BackofficeEnvelope<any>>(`${API_URL}/create-support-catalog`, {
      method: "POST",
      body: JSON.stringify({
        request: buildContext('WEB'),
        data: {
          code: reason.code,
          description: reason.description,
          status: statusToNumber(reason.status),
        },
      }),
      headers,
    });

    if (response?.result && response.result.code !== 0) {
      throw new Error(response.result.message || 'No fue posible crear el motivo de soporte');
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateSupportReason(id: string, reason: Partial<SupportReason>): Promise<void> {
  try {
    const headers = getAuthHeaders('json', true);
    const response = await customAuthFetch<BackofficeEnvelope<any>>(`${API_URL}/update-support-catalog/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        requiresQuestionnaire: reason.hasQuestionnaire ? 1 : 0,
        questionCount: reason.questions ?? 0,
        failureCount: reason.failures ?? 0,
      }),
      headers,
    });

    if (response?.result && response.result.code !== 0) {
      throw new Error(response.result.message || 'No fue posible actualizar el motivo de soporte');
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteSupportReason(id: string): Promise<void> {
  try {
    const headers = getAuthHeaders('json', true);
    await customAuthFetch(`${API_URL}/delete-support-catalog/${id}`, {
      method: "DELETE",
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getSecurityQuestions(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: SecurityQuestion[]; total: number }> {
  try {
    const headers = getAuthHeaders();

    let rawQuestions: any[] = [];
    try {
      const getResponse = await customAuthFetch<any[] | BackofficeEnvelope<any[]>>(
        `${API_URL}/list-security-questions`,
        {
          method: "GET",
          headers,
        },
      );
      if (Array.isArray(getResponse)) {
        rawQuestions = getResponse;
      } else if (Array.isArray(getResponse?.data)) {
        rawQuestions = getResponse.data;
      } else {
        rawQuestions = [];
      }
    } catch {
      const postResponse = await customAuthFetch<BackofficeEnvelope<any[]>>(
        `${API_URL}/list-security-questions`,
        {
          method: "POST",
          body: JSON.stringify(buildContext('WEB')),
          headers,
        },
      );
      rawQuestions = assertProxySuccess(postResponse, 'Error al obtener preguntas de seguridad');
    }

    const questions = rawQuestions.map(normalizeSecurityQuestion);
    const filtered = params?.search
      ? questions.filter((item) => item.question.toLowerCase().includes(params.search!.toLowerCase()))
      : questions;

    return getPagedResult(filtered, params?.page, params?.pageSize);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createSecurityQuestion(question: Partial<SecurityQuestion>): Promise<void> {
  try {
    const headers = getAuthHeaders();
    headers['X-User'] = getRequestUser();
    await customAuthFetch(`${API_URL}/create-security-question`, {
      method: "POST",
      body: JSON.stringify({
        ...buildContext('WEB'),
        data: {
          code: question.code,
          questionText: question.question,
          sqlText: null,
          fields: question.fields || 'texto',
          status: statusToNumber(question.status),
        },
      }),
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateSecurityQuestion(id: string, question: Partial<SecurityQuestion>): Promise<void> {
  try {
    const headers = getAuthHeaders();
    headers['X-User'] = getRequestUser();
    await customAuthFetch(`${API_URL}/update-security-question/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...buildContext('WEB'),
        data: {
          code: question.code,
          questionText: question.question,
          sqlText: null,
          fields: question.fields || 'texto',
          status: statusToNumber(question.status),
        },
      }),
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteSecurityQuestion(id: string): Promise<void> {
  try {
    const headers = getAuthHeaders();
    headers['X-User'] = getRequestUser();
    await customAuthFetch(`${API_URL}/delete-security-question/${id}`, {
      method: "DELETE",
      body: JSON.stringify(buildContext('WEB')),
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getSecurityImages(type?: 'mobile' | 'desktop'): Promise<SecurityImage[]> {
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
}

export async function uploadSecurityImage(image: Partial<SecurityImage>): Promise<void> {
  try {
    const headers = getAuthHeaders();
    headers['X-User'] = 'admin-test';

    const clazz: 'P' | 'I' = image.filename ? 'I' : 'P';
    const params = new URLSearchParams({
      module: image.type === 'desktop' ? 'TC' : 'AH',
      clazz,
      productType: image.name || '',
    });

    await customAuthFetch(`${API_URL}/update-pimage?${params.toString()}`, {
      method: "POST",
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteSecurityImage(id: string): Promise<void> {
  try {
    const headers = getAuthHeaders();
    headers['X-User'] = 'admin-test';
    const params = new URLSearchParams({
      module: 'AH',
      clazz: 'I',
      productType: id,
    });

    await customAuthFetch(`${API_URL}/delete-pimage?${params.toString()}`, {
      method: "DELETE",
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getProductCatalog(params?: {
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
}

export async function createProduct(_product: Partial<Product>): Promise<void> {
  throw new Error('La colección actual no incluye endpoint para crear productos.');
}

export async function updateProduct(_id: string, _product: Partial<Product>): Promise<void> {
  throw new Error('La colección actual no incluye endpoint para actualizar productos.');
}

export async function deleteProduct(_id: string): Promise<void> {
  throw new Error('La colección actual no incluye endpoint para eliminar productos.');
}

export async function getAuditLog(): Promise<{ data: MaintenanceAuditLog[]; total: number }> {
  return {
    data: [],
    total: 0,
  };
}
