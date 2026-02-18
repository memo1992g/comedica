/**
 * Utilidades generales para auth-fetch
 */

/**
 * Interfaz para detalles del error de fetch
 */
export interface FetchErrorDetails {
  status: number;
  statusText: string;
  message: string;
  details?: any;
  isTokenExpired?: boolean;
  url?: string;
  fetchId?: string;
}

/**
 * Clase de error personalizada para errores de fetch
 * Extiende Error para tener stack trace y toString() apropiado
 */
export class FetchError extends Error {
  status: number;
  statusText: string;
  details?: any;
  isTokenExpired?: boolean;
  url?: string;
  fetchId?: string;

  constructor(options: FetchErrorDetails) {
    super(options.message);
    this.name = 'FetchError';
    this.status = options.status;
    this.statusText = options.statusText;
    this.details = options.details;
    this.isTokenExpired = options.isTokenExpired;
    this.url = options.url;
    this.fetchId = options.fetchId;

    // Mantener el stack trace correcto en V8 (Node.js/Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
  }

  /**
   * Retorna una representación string completa del error
   */
  override toString(): string {
    const parts = [`FetchError: ${this.message}`];
    parts.push(`Status: ${this.status} ${this.statusText}`);
    if (this.url) parts.push(`URL: ${this.url}`);
    if (this.details) {
      try {
        parts.push(`Details: ${JSON.stringify(this.details)}`);
      } catch {
        parts.push(`Details: [Unable to stringify]`);
      }
    }
    if (this.isTokenExpired) parts.push(`Token Expired: true`);
    return parts.join(' | ');
  }

  /**
   * Retorna un objeto plano con todos los datos del error
   */
  toJSON(): FetchErrorDetails & { name: string } {
    return {
      name: this.name,
      status: this.status,
      statusText: this.statusText,
      message: this.message,
      details: this.details,
      isTokenExpired: this.isTokenExpired,
      url: this.url,
      fetchId: this.fetchId,
    };
  }
}

/**
 * Genera un ID único para tracking de requests
 */
export function generateFetchId(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Limpia cookies de autenticación en el cliente
 */
export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;

  document.cookie = `${encodeURIComponent(
    "BANCA_COMEDICA_ACCESS_TOKEN"
  )}=; Max-Age=0; path=/`;
  document.cookie = `${encodeURIComponent("LOGIN_TOKEN")}=; Max-Age=0; path=/`;
}

/**
 * Redirige al login en el cliente
 */
export function redirectToLogin(): void {
  if (globalThis.window === undefined) return;

  clearAuthCookies();
  globalThis.window.location.assign("/auth/login");
}

/**
 * Verifica si estamos en el servidor (SSR)
 */
export function isServerSide(): boolean {
  return globalThis.window === undefined;
}

/**
 * Crea un error con propiedades adicionales de autenticación
 */
export function createAuthError(
  message: string,
  options: {
    status?: number;
    isTokenExpired?: boolean;
    isFetchError?: boolean;
    url?: string;
    fetchId?: string;
  } = {}
): Error & {
  status?: number;
  isTokenExpired?: boolean;
  isFetchError?: boolean;
  url?: string;
  fetchId?: string;
} {
  const error = new Error(message) as Error & {
    status?: number;
    isTokenExpired?: boolean;
    isFetchError?: boolean;
    url?: string;
    fetchId?: string;
  };

  if (options.status !== undefined) error.status = options.status;
  if (options.isTokenExpired !== undefined)
    error.isTokenExpired = options.isTokenExpired;
  if (options.isFetchError !== undefined)
    error.isFetchError = options.isFetchError;
  if (options.url !== undefined) error.url = options.url;
  if (options.fetchId !== undefined) error.fetchId = options.fetchId;

  return error;
}

/**
 * Trunca un array de datos para logging
 */
export function truncateDataForLog<T>(data: T, maxItems: number = 2): T {
  if (!Array.isArray(data)) return data;
  if (data.length <= maxItems) return data;

  return data.slice(0, maxItems) as T;
}
