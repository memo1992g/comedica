/**
 * Interceptores de request y response para customAuthFetch
 */

import { decodeJWT } from "../jwt-decoder";
import { FetchError } from "./utils";

/**
 * Genera un ID único para tracking
 */
function generateInterceptorId(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Interceptor de request que añade headers por defecto
 */
export function requestInterceptor(
  url: string,
  options: RequestInit
): { url: string; options: RequestInit } {
  const fullUrl = `${url}`;
  options.headers = {
    cache: "no-store",
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers, // Los headers pasados tienen prioridad
  };

  return { url: fullUrl, options };
}

/**
 * Interceptor de response que maneja errores y parsea JSON
 */
export async function responseInterceptor(response: Response): Promise<any> {
  const interceptorId = generateInterceptorId();

  console.log(
    `[INTERCEPTOR-${interceptorId}] ===== INICIO RESPONSE INTERCEPTOR =====`
  );
  console.log(`[INTERCEPTOR-${interceptorId}] Response OK:`, response.ok);
  console.log(
    `[INTERCEPTOR-${interceptorId}] Response Status:`,
    response.status
  );

  if (!response.ok) {
    return handleErrorResponse(response, interceptorId);
  }

  return handleSuccessResponse(response, interceptorId);
}

/**
 * Maneja respuestas de error (status != 2xx)
 */
async function handleErrorResponse(
  response: Response,
  interceptorId: string
): Promise<never> {
  console.log(
    `[INTERCEPTOR-${interceptorId}] ===== PROCESANDO ERROR RESPONSE =====`
  );

  const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  let errorDetails = null;
  let serverDetectedTokenExpired = false;

  // Manejo centralizado de sesión expirada en respuestas 401/403
  if (response.status === 401 || response.status === 403) {
    serverDetectedTokenExpired = await checkServerTokenExpiration(interceptorId);
  }

  // Intentar leer el body como JSON para obtener más detalles del error
  errorDetails = await parseErrorBody(response, interceptorId);


  const fetchError = new FetchError({
    status: response.status,
    statusText: response.statusText,
    message: errorMessage,
    details: errorDetails,
    isTokenExpired: serverDetectedTokenExpired || undefined,
    url: response.url,
  });

  console.log(
    `[INTERCEPTOR-${interceptorId}] Rechazando con error:`,
    fetchError.toJSON()
  );
  console.log(
    `[INTERCEPTOR-${interceptorId}] ===== FIN RESPONSE INTERCEPTOR (ERROR) =====`
  );

  throw fetchError;
}

/**
 * Verifica si el token está expirado en el servidor
 */
async function checkServerTokenExpiration(
  interceptorId: string
): Promise<boolean> {
  if (globalThis.window !== undefined) {
    return false;
  }

  try {
    const { cookies } = await import("next/headers");
    const { APP_COOKIES } = await import("@/consts/cookies/cookies.consts");
    const accessToken = cookies().get(APP_COOKIES.AUTH.ACCESS_TOKEN)?.value;

    if (accessToken) {
      try {
        const payload: any = decodeJWT(accessToken);
        if (payload?.exp) {
          const nowSec = Math.floor(Date.now() / 1000);
          return nowSec >= payload.exp;
        }
      } catch {
        // Ignorar errores de decodificación
      }
    }
  } catch (e) {
    console.error(
      `[INTERCEPTOR-${interceptorId}] Error detectando expiración en 401/403:`,
      e
    );
  }

  return false;
}

/**
 * Parsea el body de error de la respuesta
 */
async function parseErrorBody(
  response: Response,
  interceptorId: string
): Promise<any> {
  try {
    console.log(`[INTERCEPTOR-${interceptorId}] Leyendo body del error...`);
    const errorBody = await response.clone().text();
    console.log(`[INTERCEPTOR-${interceptorId}] Error body raw:`, errorBody);

    if (errorBody) {
      try {
        const parsed = JSON.parse(errorBody);
        console.log(
          `[INTERCEPTOR-${interceptorId}] Error body parsed:`,
          JSON.stringify(parsed, null, 2)
        );
        return parsed;
      } catch {
        console.log(
          `[INTERCEPTOR-${interceptorId}] No se pudo parsear como JSON`
        );
        return errorBody;
      }
    }
  } catch (e) {
    console.error(`[INTERCEPTOR-${interceptorId}] Error leyendo body:`, e);
  }

  return null;
}

/**
 * Maneja respuestas exitosas (status 2xx)
 */
async function handleSuccessResponse(
  response: Response,
  interceptorId: string
): Promise<any> {
  console.log(
    `[INTERCEPTOR-${interceptorId}] ===== PROCESANDO RESPONSE EXITOSO =====`
  );

  try {
    const jsonResult = await response.json();
    console.log(`[INTERCEPTOR-${interceptorId}] JSON parseado exitosamente`);
    console.log(
      `[INTERCEPTOR-${interceptorId}] ===== FIN RESPONSE INTERCEPTOR (ÉXITO) =====`
    );
    return jsonResult;
  } catch (jsonError) {
    console.error(
      `[INTERCEPTOR-${interceptorId}] Error parseando JSON:`,
      jsonError
    );
    console.log(
      `[INTERCEPTOR-${interceptorId}] ===== FIN RESPONSE INTERCEPTOR (ERROR JSON) =====`
    );
    throw jsonError;
  }
}
