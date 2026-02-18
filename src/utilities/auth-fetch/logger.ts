/**
 * Logger para customAuthFetch
 */

import { truncateDataForLog } from "./utils";

/**
 * Log de inicio de request
 */
export function logRequestStart(
  fetchId: string,
  url: string,
  options: RequestInit
): void {
  console.log(`\n\n[FETCH-${fetchId}] ===== INICIO CUSTOM AUTH FETCH =====`);
  console.log(`[FETCH-${fetchId}] 🌐 URL completa:`, url);
  console.log(`[FETCH-${fetchId}] 📤 Request method:`, options.method);
  console.log(`[FETCH-${fetchId}] 📤 Request headers:`, options.headers);
  console.log(`[FETCH-${fetchId}] 📤 Has body:`, !!options.body);

  if (options.body) {
    console.log(
      `[FETCH-${fetchId}] 📤 Body length:`,
      JSON.stringify(options.body).length
    );
    console.log(`[FETCH-${fetchId}] 📤 Body content:`, options.body);
  }
}

/**
 * Log de body original
 */
export function logOriginalBody(
  fetchId: string,
  body: BodyInit | null | undefined,
  isUrlEncoded: boolean
): void {
  if (!body) return;

  if (isUrlEncoded) {
    console.log(`[FETCH-${fetchId}] 📤 Body original (urlencoded):`, body);
    return;
  }

  try {
    console.log(
      `[FETCH-${fetchId}] 📤 Body original:`,
      JSON.parse(body as string)
    );
  } catch {
    console.log(`[FETCH-${fetchId}] 📤 Body original (no JSON):`, body);
  }
}

/**
 * Log de procesamiento de body
 */
export function logBodyProcessing(
  fetchId: string,
  url: string,
  authToken: string | null,
  isUrlEncoded: boolean
): void {
  if (isUrlEncoded) {
    console.log(
      `[FETCH-${fetchId}] 🔐 Encriptación omitida (Content-Type: application/x-www-form-urlencoded)`
    );
  } else {
    console.log(`[FETCH-${fetchId}] 🔐 Aplicando encriptación al body...`);
  }

  console.log(`[FETCH-${fetchId}] 📤 Intercepted URL:`, url);
  console.log(`[FETCH-${fetchId}] 📤 Bearer token:`, authToken);
}

/**
 * Log de respuesta HTTP recibida
 */
export function logResponseReceived(fetchId: string, response: Response): void {
  console.log(`[FETCH-${fetchId}] ===== RESPUESTA HTTP RECIBIDA =====`);
  console.log(`[FETCH-${fetchId}] 📥 Status:`, response.status);
  console.log(`[FETCH-${fetchId}] 📥 Status Text:`, response.statusText);
  console.log(`[FETCH-${fetchId}] 📥 OK:`, response.ok);
  console.log(`[FETCH-${fetchId}] 📥 URL:`, response.url);
  console.log(
    `[FETCH-${fetchId}] 🔄 Procesando respuesta con responseInterceptor...`
  );
}

/**
 * Log de resultado exitoso
 */
export function logSuccess(fetchId: string, result: any): void {
  console.log(`[FETCH-${fetchId}] ✅ Respuesta procesada correctamente`);

  // Truncar datos para el log
  const resultCopy = { ...result };
  if (Array.isArray(resultCopy.data) && resultCopy.data.length > 2) {
    resultCopy.data = truncateDataForLog(resultCopy.data, 1);
  }

  console.log(`[FETCH-${fetchId}] Resultado:`, resultCopy);
  console.log(`[FETCH-${fetchId}] ===== FIN CUSTOM AUTH FETCH (ÉXITO) =====`);
}

/**
 * Log de error
 */
export function logError(fetchId: string, error: unknown): void {
  console.log(`[FETCH-${fetchId}] ===== ERROR EN CUSTOM AUTH FETCH =====`);
  console.error(`[FETCH-${fetchId}] ❌ Fetch error:`, error);
  console.error(`[FETCH-${fetchId}] ❌ Error type:`, typeof error);
  
}

/**
 * Log de fin con error
 */
export function logErrorEnd(fetchId: string): void {
  console.log(
    `[FETCH-${fetchId}] ===== FIN CUSTOM AUTH FETCH (ERROR) =====\n\n`
  );
}
