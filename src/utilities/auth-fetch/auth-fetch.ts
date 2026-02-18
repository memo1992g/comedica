/**
 * Custom Auth Fetch
 *
 * Wrapper para fetch con autenticación que incluye:
 * - Refresh automático de token de cliente cuando expira
 * - Interceptores de request y response
 * - Encriptación de body
 * - Manejo centralizado de errores
 * - Logging detallado para debugging
 */
import { encryptRequestBody } from "../encrypt-interceptors";
import { requestInterceptor, responseInterceptor } from "./interceptors";
import { generateFetchId } from "./utils";
import * as logger from "./logger";
import {
  getBearerFromHeaders,
  isUrlEncodedContentType,
} from "./headers-helpers";
import { handleCatchTokenError, handleExpiredToken } from "./token-handler";
import { handleNetworkError } from "./error-handler";

/**
 * Realiza una petición HTTP autenticada
 *
 * @param url - URL del endpoint
 * @param options - Opciones de fetch (method, headers, body, etc.)
 * @returns Promesa con la respuesta parseada como JSON
 *
 * @example
 * ```ts
 * const response = await customAuthFetch('/api/users', {
 *   method: 'POST',
 *   headers: { Authorization: `Bearer ${token}` },
 *   body: JSON.stringify({ name: 'John' })
 * });
 * ```
 */
export default async function customAuthFetch<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const fetchId = generateFetchId();

  // Aplicar interceptor de request
  const { url: interceptedUrl, options: interceptedOptions } =
    requestInterceptor(url, options);

  // Log de inicio
  logger.logRequestStart(fetchId, interceptedUrl, interceptedOptions);

  // Extraer token de autenticación
  const authToken = getBearerFromHeaders(options?.headers);

  // Verificar si el Content-Type es URL encoded
  const isUrlEncoded = isUrlEncodedContentType(options?.headers);

  // Manejar token expirado antes del fetch
  const tokenResult = await handleExpiredToken(
    authToken,
    interceptedOptions,
    fetchId,
  );

  if (!tokenResult.shouldContinue) {
    if (tokenResult.error) {
      throw tokenResult.error;
    }
    // Si no hay error pero no debe continuar (ej: redirect en cliente)
    // Retornamos una promesa que nunca resuelve para evitar continuar
    return new Promise(() => {});
  }

  try {
    // Log de procesamiento
    logger.logBodyProcessing(fetchId, interceptedUrl, authToken, isUrlEncoded);

    // Encriptar body si no es URL encoded
    const processedOptions = isUrlEncoded
      ? interceptedOptions
      : await encryptRequestBody(interceptedOptions);

    // Log del body original
    logger.logOriginalBody(fetchId, interceptedOptions.body, isUrlEncoded);

    // Realizar la petición HTTP
    console.log(`[FETCH-${fetchId}] 🚀 Iniciando petición HTTP...`);
    const response = await fetch(interceptedUrl, processedOptions);

    // Log de respuesta
    logger.logResponseReceived(fetchId, response);

    // Procesar respuesta con interceptor
    const result = await responseInterceptor(response);

    // Log de éxito
    logger.logSuccess(fetchId, result);

    return result;
  } catch (error) {
    // Log de error
    logger.logError(fetchId, error);

    // Manejar errores de red
    const networkError = handleNetworkError(error, interceptedUrl, fetchId);
    if (networkError !== error) {
      logger.logErrorEnd(fetchId);
      throw networkError;
    }

    // Manejar errores de token expirado en catch
    const tokenError = handleCatchTokenError(
      authToken,
      error,
      interceptedUrl,
      fetchId,
    );

    logger.logErrorEnd(fetchId);
    throw tokenError;
  }
}
