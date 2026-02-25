"use server";

import customAuthFetch from "@/utilities/auth-fetch/auth-fetch";
import { cookies } from "next/headers";
import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import {
  TransactionLimits,
  UserLimits,
  AuditLog,
} from '@/types';

export type { ParamsProxyItem } from './types/parameters.types';
import type { ParamsProxyItem } from './types/parameters.types';

const API_URL = 'https://bo-comedica-service-dev.echotechs.net/api';

function getAuthHeaders(): Record<string, string> {
  const clientTokenJSON = cookies().get(APP_COOKIES.AUTH.CLIENT_TOKEN)?.value;
  const accessToken = clientTokenJSON
    ? JSON.parse(clientTokenJSON)?.accessToken
    : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Error desconocido';
}


function resolveAuditClassificationCode(module?: string): string {
  const value = (module || '').toUpperCase();

  if (value.includes('USER') || value.includes('USUARIO')) return 'USER_MANAGEMENT';
  if (value.includes('LIMITE') || value.includes('LIMIT')) return 'LIMITS';
  if (value.includes('PARAM')) return 'PARAMS';
  if (value.includes('NOTIFIC')) return 'NOTIFICATIONS';
  if (value.includes('LOGIN')) return 'LOGIN_HISTORY';
  if (value.includes('REPORT')) return 'REPORTS';
  if (value.includes('TRANSFER365') || value.includes('T365')) return 'PARAMS';
  if (value.includes('TRANS')) return 'TRANSACTIONS';
  if (value.includes('SOFT')) return 'SOFTTOKEN';

  return 'PARAMS';
}

function buildAuditChangesRequest(params?: {
  page?: number;
  pageSize?: number;
  module?: string;
  classificationCode?: string;
}) {
  return {
    uuid: crypto.randomUUID(),
    channel: 'W',
    pageId: 1,
    request: {
      classificationCode: params?.classificationCode || resolveAuditClassificationCode(params?.module),
      createdAtFrom: '2026-01-01T00:00:00',
      createdAtTo: new Date().toISOString(),
    },
    pagination: {
      page: params?.page && params.page > 0 ? params.page : 1,
      size: params?.pageSize && params.pageSize > 0 ? params.pageSize : 20,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
    },
  };
}

function buildUrl(path: string, queryParams?: URLSearchParams): string {
  const qs = queryParams?.toString();
  const base = `${API_URL}${path}`;
  return qs ? base + '?' + qs : base;
}

interface ParamsProxyRequest<T> {
  uuid: string;
  channel: string;
  pageId: number;
  requestId: string;
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
  status?: string | number;
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
  status?: string | number;
  pais?: string;
  nombrePais?: string;
  banco?: string;
  bic?: string;
}

// ParamsProxyItem is re-exported from ./types/parameters.types

function buildParamsProxyRequest<T>(request: T): ParamsProxyRequest<T> {
  return {
    uuid: crypto.randomUUID(),
    channel: 'W',
    pageId: 1,
    requestId: crypto.randomUUID(),
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

function getFormUrlEncodedHeaders(): Record<string, string> {
  return {
    ...getAuthHeaders(),
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

function buildT365CodBody(search?: string): string {
  const body = new URLSearchParams();
  body.set('cod', (search || '').toUpperCase());
  return body.toString();
}

function assertProxySuccess<T>(response: ParamsProxyResponse<T>): T {
  if (response?.result?.code !== 0) {
    throw new Error(response?.result?.message || 'Error consumiendo servicio de parámetros');
  }

  return response.data;
}


function normalizeParamsItem(item: any): ParamsProxyItem {
  return {
    name: String(item?.name ?? item?.paramName ?? ''),
    value: item?.value ?? item?.paramValue ?? null,
    description: item?.description ?? item?.paramDescription ?? null,
    status: item?.status ?? null,
  };
}

function assertT365Success<T>(response: T365Envelope<T>): T {
  if (response?.result && response.result.code !== 0) {
    throw new Error(response.result.message || 'Error consumiendo servicio Transfer365');
  }
  return (response?.data ?? []) as T;
}

function normalizeStatus(status: string | number | null | undefined): 'Activo' | 'Inactivo' {
  const value = String(status ?? '').trim().toUpperCase();
  return value === 'A' || value === '1' || value === 'ACTIVO' ? 'Activo' : 'Inactivo';
}

function statusToBackendCode(status: string | number | boolean | null | undefined): 'A' | 'I' {
  const value = String(status ?? '').trim().toUpperCase();
  if (value === 'A' || value === '1' || value === 'ACTIVO' || value === 'TRUE') return 'A';
  return 'I';
}

function isProductEnabled(selectedProducts: string[] | undefined, ...candidates: string[]): boolean {
  const normalized = new Set((selectedProducts || []).map((item) => item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));
  return candidates.some((candidate) => normalized.has(candidate.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));
}


function mapLocalInstitution(raw: T365LocalRaw & Record<string, any>) {
  const ahorro = raw.ahorro ?? raw.saving ?? '0';
  const corriente = raw.corriente ?? raw.current ?? '0';
  const credito = raw.credito ?? raw.credit ?? '0';
  const tarjeta = raw.tarjeta ?? raw.card ?? '0';
  const movil = raw.movil ?? raw.mobile ?? '0';

  const products: string[] = [];
  if (ahorro === '1') products.push('Ahorro');
  if (corriente === '1') products.push('Corriente');
  if (credito === '1') products.push('Crédito');
  if (tarjeta === '1') products.push('Tarjeta');
  if (movil === '1') products.push('Móvil');

  const shortName = raw.nombrecorto ?? raw.nombre_CORTO ?? raw.shortName ?? '';
  const compensate = raw.codcompensa ?? raw.cod_COMPENSA ?? raw.compensate ?? '';

  return {
    id: String(raw.id),
    bic: raw.bic,
    shortName,
    status: normalizeStatus(raw.estado ?? raw.status),
    fullName: raw.nombre,
    institution: raw.descripcion,
    compensate,
    products,
    ahorro: ahorro === '1',
    corriente: corriente === '1',
    credito: credito === '1',
    tarjeta: tarjeta === '1',
    movil: movil === '1',
  };
}

function mapCardInstitution(raw: T365CardRaw) {
  return {
    id: String(raw.id),
    bic: raw.bic ?? raw.bic_NOMBRE ?? '',
    fullName: raw.banco ?? raw.nombre_BANCO ?? '',
    status: normalizeStatus(raw.estado ?? raw.status ?? 'A'),
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
  const normalizedNames = new Set(names.map((name) => name.toLowerCase()));
  const match = items.find((item) => normalizedNames.has(String(item?.name ?? '').toLowerCase()));
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

export async function getParams(request?: Partial<ParamsProxyItem>): Promise<ParamsProxyItem[]> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<ParamsProxyResponse<ParamsProxyItem[]>>(
      `${API_URL}/params/get-params`,
      {
        method: "POST",
        body: JSON.stringify(buildParamsProxyRequest({
          name: request?.name ?? null,
          value: request?.value ?? null,
          description: request?.description ?? null,
          status: request?.status ?? null,
        })),
        headers,
      },
    );

    return assertProxySuccess(response).map((item) => normalizeParamsItem(item));
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function saveParam(param: ParamsProxyItem): Promise<ParamsProxyItem> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<ParamsProxyResponse<ParamsProxyItem>>(
      `${API_URL}/params/save`,
      {
        method: "POST",
        body: JSON.stringify(buildParamsProxyRequest(param)),
        headers,
      },
    );

    return assertProxySuccess(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function editParam(param: ParamsProxyItem): Promise<ParamsProxyItem> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<ParamsProxyResponse<ParamsProxyItem>>(
      `${API_URL}/params/edit`,
      {
        method: "PUT",
        body: JSON.stringify(buildParamsProxyRequest(param)),
        headers,
      },
    );

    return assertProxySuccess(response);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// Obtener límites generales (proxy params con fallback al endpoint legacy)
export async function getGeneralLimits(): Promise<TransactionLimits[]> {
  try {
    const params = await getParams();
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
      const headers = getAuthHeaders();
      const response = await customAuthFetch<{ data: TransactionLimits[] }>(
        `${API_URL}/parameters/limits/general`,
        { method: "GET", headers },
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(proxyError || error));
    }
  }
}

// Actualizar límites generales (proxy params con fallback legacy)
export async function updateGeneralLimits(limits: Partial<TransactionLimits>[]): Promise<void> {
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

    await Promise.all(updates.map((item) => editParam(item)));
  } catch (proxyError) {
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/limits/general`, {
        method: "PUT",
        body: JSON.stringify({ limits }),
        headers,
      });
    } catch (error) {
      throw new Error(getErrorMessage(proxyError || error));
    }
  }
}

// Obtener límites por usuario (sin endpoint real en colecciones; se mantiene legacy)
export async function getUserLimits(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: UserLimits[]; total: number }> {
  try {
    const headers = getAuthHeaders();
    const cliIdInput = (params?.search || '').trim();
    const parsedCliId = Number(cliIdInput);
    const hasCliIdFilter = cliIdInput.length > 0 && Number.isFinite(parsedCliId) && parsedCliId > 0;
    if (!hasCliIdFilter) {
      return { data: [], total: 0 };
    }

    const response = await customAuthFetch<ParamsProxyResponse<any[]>>(
      `${API_URL}/limits/limit-serviceOpt`,
      {
        method: "POST",
        body: JSON.stringify({
          uuid: crypto.randomUUID(),
          channel: 'W',
          pageId: 1,
          request: {
            cliId: parsedCliId,
          },
        }),
        headers,
      },
    );

    const rows = assertProxySuccess(response);
    const mapped = mapLimitServiceOptRows(Array.isArray(rows) ? rows : []);
    const page = params?.page && params.page > 0 ? params.page : 1;
    const pageSize = params?.pageSize && params.pageSize > 0 ? params.pageSize : 20;
    const start = (page - 1) * pageSize;

    return {
      data: mapped.slice(start, start + pageSize),
      total: mapped.length,
    };
  } catch (primaryError) {
    try {
      const headers = getAuthHeaders();
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));

      const response = await customAuthFetch<{ data: { data: UserLimits[]; total: number } }>(
        buildUrl('/parameters/limits/users', queryParams),
        { method: "GET", headers },
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(primaryError || error));
    }
  }
}

function buildLimitOptRequests(cliId: number, limits: UserLimits['limits'], existingRows: any[] = []) {
  const requests: Array<Record<string, unknown>> = [];
  const rows = Array.isArray(existingRows) ? existingRows : [];

  const makeRequest = (
    overrides: {
      maxAmount: number;
      typeLimit: number;
    },
    defaults: {
      productType: string;
      accountClass: string;
      transactionType: string;
      currency: string;
      accumulate: number;
    },
    matcher: (row: any) => boolean,
  ) => {
    const base = rows.find(matcher);

    requests.push({
      cliId,
      productType: String(base?.productType ?? defaults.productType),
      accountClass: String(base?.accountClass ?? defaults.accountClass),
      transactionType: String(base?.transactionType ?? defaults.transactionType),
      currency: String(base?.currency ?? defaults.currency),
      accumulate: Number(base?.accumulate ?? defaults.accumulate),
      maxAmount: Number(overrides.maxAmount),
      typeLimit: Number(overrides.typeLimit),
    });
  };

  const ce = limits.canalesElectronicos;
  if (ce) {
    const ceMatcher = (typeLimit: number) => (row: any) => String(row?.accountClass ?? '').toUpperCase() === 'CE'
      && Number(row?.typeLimit ?? 0) === typeLimit;

    makeRequest(
      { maxAmount: Number(ce.maxPerTransaction ?? 0), typeLimit: 1 },
      { productType: 'SAVINGS', accountClass: 'CE', transactionType: 'TRANSFER', currency: 'USD', accumulate: 0 },
      ceMatcher(1),
    );

    makeRequest(
      { maxAmount: Number(ce.maxDaily ?? 0), typeLimit: 3 },
      { productType: 'SAVINGS', accountClass: 'CE', transactionType: 'TRANSFER', currency: 'USD', accumulate: 0 },
      ceMatcher(3),
    );

    makeRequest(
      { maxAmount: Number(ce.maxMonthly ?? 0), typeLimit: 2 },
      { productType: 'SAVINGS', accountClass: 'CE', transactionType: 'TRANSFER', currency: 'USD', accumulate: 0 },
      ceMatcher(2),
    );
  }

  if (limits.transfer365) {
    makeRequest(
      { maxAmount: Number(limits.transfer365.maxAmount ?? 0), typeLimit: 1 },
      { productType: 'T365', accountClass: 'AHORRO', transactionType: 'TRANSFER365', currency: 'USD', accumulate: 0 },
      (row) => String(row?.productType ?? '').toUpperCase().includes('T365')
        || String(row?.transactionType ?? '').toUpperCase().includes('TRANSFER365'),
    );
  }

  return requests;
}

// Actualizar límites de un usuario específico
export async function updateUserLimits(user: Pick<UserLimits, 'userId' | 'userCode'>, limits: UserLimits['limits']): Promise<void> {
  try {
    const headers = getAuthHeaders();
    const cliId = Number(user.userCode || user.userId);

    if (!Number.isFinite(cliId) || cliId <= 0) {
      throw new Error('Debe ingresar un número de asociado válido para guardar límites.');
    }

    const existing = await customAuthFetch<ParamsProxyResponse<any[]>>(
      `${API_URL}/limits/limit-serviceOpt`,
      {
        method: "POST",
        body: JSON.stringify({
          uuid: crypto.randomUUID(),
          channel: 'W',
          pageId: 1,
          request: { cliId },
        }),
        headers,
      },
    );

    const existingRows = assertProxySuccess(existing);
    const hasExistingConfig = Array.isArray(existingRows) && existingRows.length > 0;
    const endpoint = hasExistingConfig ? '/limits/updateLimitOpt' : '/limits/saveLimitOpt';
    const requests = buildLimitOptRequests(cliId, limits, Array.isArray(existingRows) ? existingRows : []);

    if (requests.length === 0) {
      return;
    }

    await Promise.all(requests.map((request) => customAuthFetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify({
        uuid: crypto.randomUUID(),
        channel: 'W',
        pageId: 1,
        request,
      }),
      headers,
    })));
  } catch (primaryError) {
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/limits/users/${user.userId}`, {
        method: "PUT",
        body: JSON.stringify({ limits }),
        headers,
      });
    } catch (error) {
      throw new Error(getErrorMessage(primaryError || error));
    }
  }
}

// Eliminar límites personalizados de un usuario (vuelve a usar los generales)
export async function deleteUserLimits(userId: string): Promise<void> {
  try {
    const headers = getAuthHeaders();
    await customAuthFetch(`${API_URL}/parameters/limits/users/${userId}`, {
      method: "DELETE",
      headers,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}



function mapLimitServiceOptRows(rows: any[]): UserLimits[] {
  const grouped = new Map<string, UserLimits>();

  rows.forEach((item, index) => {
    const cliId = String(item?.cliId ?? item?.clientId ?? item?.associatedNumber ?? `cli-${index}`);
    const current = grouped.get(cliId) ?? {
      id: cliId,
      userId: cliId,
      userName: String(item?.clientName ?? item?.name ?? item?.fullName ?? (cliId === '0' ? 'Cliente sin identificar' : `Cliente ${cliId}`)),
      userCode: String(item?.associatedNumber ?? item?.cliId ?? item?.clientId ?? cliId),
      limitType: 'general' as const,
      limits: {},
      lastUpdate: new Date().toISOString(),
    };

    const maxAmount = Number(item?.maxAmount ?? 0);
    const typeLimit = Number(item?.typeLimit ?? 0);

    if (item?.accountClass === 'CE') {
      current.limits.canalesElectronicos = current.limits.canalesElectronicos ?? {
        maxPerTransaction: 0,
        maxDaily: 0,
        maxMonthly: 0,
      };

      if (typeLimit === 1) {
        current.limits.canalesElectronicos.maxPerTransaction = maxAmount;
      } else if (typeLimit === 2) {
        current.limits.canalesElectronicos.maxMonthly = maxAmount;
      } else {
        current.limits.canalesElectronicos.maxDaily = maxAmount;
      }
    }

    if (item?.productType === 'T365' || item?.transactionType === 'TRANSFER365') {
      current.limits.transfer365 = { maxAmount };
    }

    grouped.set(cliId, current);
  });

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    limitType:
      item.limits.canalesElectronicos || item.limits.puntoXpress || item.limits.transfer365
        ? 'personalizado'
        : 'general',
  }));
}

function normalizeAuditLog(item: any, index: number): AuditLog {
  return {
    id: String(item?.id ?? item?.auditId ?? `audit-${index}`),
    userId: String(item?.userId ?? item?.user ?? '-'),
    userName: item?.userName ?? item?.usuario ?? item?.user ?? 'Sistema',
    userRole: item?.userRole ?? item?.role ?? 'N/A',
    affectedUser: item?.affectedUser ?? item?.affectedUserName,
    action: item?.action ?? item?.accion ?? 'ACTUALIZACIÓN',
    module: item?.module ?? item?.modulo ?? 'LÍMITES Y MONTOS',
    details: item?.details ?? item?.descripcion ?? item?.detail ?? 'Actualización de límites',
    changes: Array.isArray(item?.changes)
      ? item.changes
      : item?.oldValue !== undefined || item?.newValue !== undefined
      ? [
          {
            field: item?.field ?? item?.campo ?? 'limit',
            oldValue: item?.oldValue ?? '-',
            newValue: item?.newValue ?? '-',
          },
        ]
      : undefined,
    timestamp: item?.timestamp ?? item?.createdAt ?? new Date().toISOString(),
    ipAddress: item?.ipAddress ?? item?.ip,
  };
}

// Obtener historial de auditoría (no se encontró endpoint documentado en json para límites; se intenta backend actual)
export async function getAuditLog(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  module?: string;
  classificationCode?: string;
}): Promise<{ data: AuditLog[]; total: number }> {
  try {
    const headers = getAuthHeaders();
    const response = await customAuthFetch<any>(
      `${API_URL}/audit/changes`,
      {
        method: "POST",
        body: JSON.stringify(buildAuditChangesRequest(params)),
        headers,
      },
    );

    const rows = response?.data ?? [];
    const normalized = (Array.isArray(rows) ? rows : []).map((item, index) => normalizeAuditLog(item, index));
    const total = Number(response?.pagination?.totalElements ?? response?.metadata?.totalCount ?? normalized.length);

    return { data: normalized, total };
  } catch (primaryError) {
    try {
      const headers = getAuthHeaders();
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));
      if (params?.module) queryParams.set('module', params.module);

      const response = await customAuthFetch<any>(
        buildUrl('/parameters/audit', queryParams),
        { method: "GET", headers },
      );

      const rows = response?.data?.data ?? response?.data ?? [];
      const normalized = (Array.isArray(rows) ? rows : []).map((item, index) => normalizeAuditLog(item, index));
      const total = Number(response?.data?.total ?? response?.total ?? response?.metadata?.totalCount ?? normalized.length);

      return { data: normalized, total };
    } catch (error) {
      throw new Error(getErrorMessage(primaryError || error));
    }
  }
}

// Obtener resumen reciente de auditoría
export async function getRecentAudit(limit: number = 5, module?: string): Promise<AuditLog[]> {
  try {
    const response = await getAuditLog({ page: 1, pageSize: limit, module });
    return response.data.slice(0, limit);
  } catch {
    try {
      const headers = getAuthHeaders();
      const response = await customAuthFetch<any>(
        `${API_URL}/parameters/audit/recent?limit=${limit}`,
        { method: "GET", headers },
      );

      const rows = response?.data ?? [];
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((item, index) => normalizeAuditLog(item, index)).slice(0, limit);
      }
      return [];
    } catch {
      return [];
    }
  }
}

// Obtener configuración de seguridad (proxy params con fallback)
export async function getSecurityConfig(): Promise<any> {
  try {
    const params = await getParams();
    return buildSecurityConfigFromParams(params);
  } catch (proxyError) {
    try {
      const headers = getAuthHeaders();
      const response = await customAuthFetch<{ data: any }>(
        `${API_URL}/parameters/security`,
        { method: "GET", headers },
      );
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(proxyError || error));
    }
  }
}

// Actualizar configuración de seguridad (proxy params con fallback)
export async function updateSecurityConfig(config: any): Promise<void> {
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

    await Promise.all(updates.map((item) => editParam(item)));
  } catch (proxyError) {
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/security`, {
        method: "PUT",
        body: JSON.stringify({ config }),
        headers,
      });
    } catch (error) {
      throw new Error(getErrorMessage(proxyError || error));
    }
  }
}

// ==================== TRANSFER365 ====================

// Obtener instituciones locales (endpoint real colección BEL)
export async function getLocalInstitutions(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: any[]; total: number }> {
  try {
    const headers = getFormUrlEncodedHeaders();
    const response = await customAuthFetch<T365Envelope<T365LocalRaw[]>>(
      `${API_URL}/t365/get-banks`,
      {
        method: "POST",
        body: buildT365CodBody(params?.search),
        headers,
      },
    );
    const mapped = assertT365Success(response).map(mapLocalInstitution);
    const filtered = filterBySearch(mapped, params?.search, ['bic', 'shortName', 'fullName', 'institution']);
    return paginate(filtered, params?.page, params?.pageSize);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));

      const response = await customAuthFetch<{ data: { data: any[]; total: number } }>(
        buildUrl('/parameters/transfer365/local', queryParams),
        { method: "GET", headers },
      );
      return response.data;
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Obtener instituciones CA-RD (endpoint real colección BEL)
export async function getCARDInstitutions(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: any[]; total: number }> {
  try {
    const headers = getFormUrlEncodedHeaders();
    const response = await customAuthFetch<T365Envelope<T365CardRaw[]>>(
      `${API_URL}/t365/get-banks-CARD`,
      {
        method: "POST",
        body: buildT365CodBody(params?.search),
        headers,
      },
    );
    const mapped = assertT365Success(response).map(mapCardInstitution);
    const filtered = filterBySearch(mapped, params?.search, ['bic', 'fullName', 'country']);
    return paginate(filtered, params?.page, params?.pageSize);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.page) queryParams.set('page', String(params.page));
      if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));

      const response = await customAuthFetch<{ data: { data: any[]; total: number } }>(
        buildUrl('/parameters/transfer365/card', queryParams),
        { method: "GET", headers },
      );
      return response.data;
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Crear institución local
export async function createLocalInstitution(institution: any): Promise<void> {
  try {
    const headers = getAuthHeaders();
    const backendStatus = statusToBackendCode(institution.status);
    await customAuthFetch(`${API_URL}/t365/bank-create`, {
      method: "POST",
      body: JSON.stringify({
        ...buildT365Context(),
        request: {
          codeBic: institution.bic,
          compensate: institution.compensate || institution.compensation || '00',
          name: institution.fullName,
          shortName: institution.shortName,
          saving: institution.ahorro || isProductEnabled(institution.products, 'Ahorro') ? '1' : '0',
          current: institution.corriente || isProductEnabled(institution.products, 'Corriente') ? '1' : '0',
          credit: institution.credito || isProductEnabled(institution.products, 'Credito', 'Crédito') ? '1' : '0',
          card: institution.tarjeta || isProductEnabled(institution.products, 'Tarjeta') ? '1' : '0',
          mobile: institution.movil || isProductEnabled(institution.products, 'Movil', 'Móvil') ? '1' : '0',
          user: 'BACKOFFICE',
          description: institution.institution || institution.fullName,
          status: backendStatus,
          estado: backendStatus,
        },
      }),
      headers,
    });

    assertT365Success(response);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/transfer365/local`, {
        method: "POST",
        body: JSON.stringify({ institution }),
        headers,
      });
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Crear institución CA-RD
export async function createCARDInstitution(institution: any): Promise<void> {
  try {
    const headers = getAuthHeaders();
    const backendStatus = statusToBackendCode(institution.status);
    const countryCode = institution.countryCode || institution.country?.slice(0, 2)?.toUpperCase() || 'SV';
    await customAuthFetch(`${API_URL}/t365/bank-create-CARD`, {
      method: "POST",
      body: JSON.stringify({
        ...buildT365Context(),
        request: {
          assigCountry: countryCode,
          bankName: institutionName,
          codeBic: normalizeText(institution.bic).toUpperCase(),
          user: 'BACKOFFICE',
          status: backendStatus,
          estado: backendStatus,
        },
      }),
      headers,
    });

    assertT365Success(response);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/transfer365/card`, {
        method: "POST",
        body: JSON.stringify({ institution }),
        headers,
      });
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Actualizar institución local
export async function updateLocalInstitution(id: string, institution: any): Promise<void> {
  try {
    const headers = getAuthHeaders();
    const backendStatus = statusToBackendCode(institution.status);
    await customAuthFetch(`${API_URL}/t365/bank-modify`, {
      method: "POST",
      body: JSON.stringify({
        ...buildT365Context(),
        request: {
          id: Number(id),
          codeBic: institution.bic,
          compensate: institution.compensate || institution.compensation || '00',
          name: institution.fullName,
          shortName: institution.shortName,
          saving: institution.ahorro || isProductEnabled(institution.products, 'Ahorro') ? '1' : '0',
          current: institution.corriente || isProductEnabled(institution.products, 'Corriente') ? '1' : '0',
          credit: institution.credito || isProductEnabled(institution.products, 'Credito', 'Crédito') ? '1' : '0',
          card: institution.tarjeta || isProductEnabled(institution.products, 'Tarjeta') ? '1' : '0',
          mobile: institution.movil || isProductEnabled(institution.products, 'Movil', 'Móvil') ? '1' : '0',
          user: 'BACKOFFICE',
          description: institution.institution || institution.fullName,
          status: backendStatus,
          estado: backendStatus,
        },
      }),
      headers,
    });

    assertT365Success(response);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/transfer365/local/${id}`, {
        method: "PUT",
        body: JSON.stringify({ institution }),
        headers,
      });
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Actualizar institución CA-RD
export async function updateCARDInstitution(id: string, institution: any): Promise<void> {
  try {
    const headers = getAuthHeaders();
    const backendStatus = statusToBackendCode(institution.status);
    const countryCode = institution.countryCode || institution.country?.slice(0, 2)?.toUpperCase() || 'SV';
    await customAuthFetch(`${API_URL}/t365/bank-modify-CARD`, {
      method: "POST",
      body: JSON.stringify({
        ...buildT365Context(),
        request: {
          id: Number(id),
          assigCountry: countryCode,
          countryName: institution.country,
          bankName: institutionName,
          codeBic: normalizeText(institution.bic).toUpperCase(),
          user: 'BACKOFFICE',
          status: backendStatus,
          estado: backendStatus,
        },
      }),
      headers,
    });

    assertT365Success(response);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/transfer365/card/${id}`, {
        method: "PUT",
        body: JSON.stringify({ institution }),
        headers,
      });
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Eliminar institución local (en API real se usa modify con estado I)
export async function deleteLocalInstitution(id: string): Promise<void> {
  try {
    const current = await getLocalInstitutions({ page: 1, pageSize: 2000 });
    const target = current.data.find((item) => String(item.id) === String(id));

    if (target) {
      await updateLocalInstitution(String(id), {
        ...target,
        status: 'Inactivo',
      });
      return;
    }

    const headers = getAuthHeaders();
    const response = await customAuthFetch<T365Envelope<any>>(`${API_URL}/t365/bank-modify`, {
      method: "POST",
      body: JSON.stringify({
        ...buildT365Context(),
        request: {
          id: Number(id),
          status: 'I',
          user: 'BACKOFFICE',
        },
      }),
      headers,
    });

    assertT365Success(response);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/transfer365/local/${id}`, {
        method: "DELETE",
        headers,
      });
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}

// Eliminar institución CA-RD (en API real se usa modify con estado I)
export async function deleteCARDInstitution(id: string): Promise<void> {
  try {
    const current = await getCARDInstitutions({ page: 1, pageSize: 2000 });
    const target = current.data.find((item) => String(item.id) === String(id));

    if (target) {
      await updateCARDInstitution(String(id), {
        ...target,
        status: 'Inactivo',
      });
      return;
    }

    const headers = getAuthHeaders();
    const response = await customAuthFetch<T365Envelope<any>>(`${API_URL}/t365/bank-modify-CARD`, {
      method: "POST",
      body: JSON.stringify({
        ...buildT365Context(),
        request: {
          id: Number(id),
          status: 'I',
          user: 'BACKOFFICE',
        },
      }),
      headers,
    });

    assertT365Success(response);
  } catch (error) {
    // fallback legacy
    try {
      const headers = getAuthHeaders();
      await customAuthFetch(`${API_URL}/parameters/transfer365/card/${id}`, {
        method: "DELETE",
        headers,
      });
    } catch (fallbackError) {
      throw new Error(getErrorMessage(error || fallbackError));
    }
  }
}
