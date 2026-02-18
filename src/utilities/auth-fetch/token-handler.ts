/**
 * Manejador de tokens expirados
 */

import { updateAuthorizationHeader } from "./headers-helpers";
import { isClientToken, isJwtExpired } from "./jwt-utils";
import { refreshClientToken } from "./token-refresh";
import {
    createAuthError,
    isServerSide,
    redirectToLogin,
} from "./utils";

export interface TokenHandlerResult {
  shouldContinue: boolean;
  error?: Error;
}

/**
 * Maneja el caso de token expirado antes de hacer el fetch
 * Retorna true si se debe continuar con la petición, false si ya se manejó
 */
export async function handleExpiredToken(
  authToken: string | null,
  interceptedOptions: RequestInit,
  fetchId: string
): Promise<TokenHandlerResult> {
  // Si no hay token o no está expirado, continuar normalmente
  if (!authToken || !isJwtExpired(authToken)) {
    return { shouldContinue: true };
  }

  // Verificar si es un token de cliente (puede ser refrescado automáticamente)
  if (isClientToken(authToken)) {
    return handleExpiredClientToken(interceptedOptions, fetchId);
  }

  // Es un token de usuario expirado
  return handleExpiredUserToken(fetchId);
}

/**
 * Maneja el refresh automático del token de cliente
 */
async function handleExpiredClientToken(
  interceptedOptions: RequestInit,
  fetchId: string
): Promise<TokenHandlerResult> {
  console.log(
    `[FETCH-${fetchId}] 🔄 Token de cliente expirado detectado - intentando refresh automático...`
  );

  const newToken = await refreshClientToken();

  if (newToken) {
    console.log(
      `[FETCH-${fetchId}] ✅ Token refrescado exitosamente - continuando con la petición`
    );

    // Actualizar el header Authorization con el nuevo token
    if (interceptedOptions.headers) {
      updateAuthorizationHeader(interceptedOptions.headers, newToken);
    }

    return { shouldContinue: true };
  }

  console.error(`[FETCH-${fetchId}] ❌ No se pudo refrescar el token de cliente`);

  return {
    shouldContinue: false,
    error: createAuthError("Token de cliente expirado y no se pudo refrescar", {
      status: 401,
      isTokenExpired: true,
    }),
  };
}

/**
 * Maneja el token de usuario expirado
 */
function handleExpiredUserToken(fetchId: string): TokenHandlerResult {
  if (isServerSide()) {
    // En server-side: lanzar error para que se maneje en server actions
    console.error(
      `[FETCH-${fetchId}] Token de usuario expirado detectado antes de fetch - lanzando error para server action`
    );

    return {
      shouldContinue: false,
      error: createAuthError("Token de acceso expirado", {
        status: 401,
        isTokenExpired: true,
      }),
    };
  }

  // En client-side: redirigir al login
  try {
    redirectToLogin();
  } catch (e) {
    console.error(
      `[FETCH-${fetchId}] Error manejando token expirado (pre-fetch):`,
      e
    );
  }

  return { shouldContinue: false };
}

/**
 * Maneja errores de token en el catch del fetch
 */
export function handleCatchTokenError(
  authToken: string | null,
  error: unknown,
  interceptedUrl: string,
  fetchId: string
): Error {
  if (!authToken || !isJwtExpired(authToken)) {
    return error instanceof Error ? error : new Error(String(error));
  }

  if (isServerSide()) {
    const controlledError =
      error instanceof Error ? error : new Error(String(error));

    (controlledError as any).status = 401;
    (controlledError as any).isTokenExpired = true;
    (controlledError as any).url = interceptedUrl;
    (controlledError as any).fetchId = fetchId;

    console.log(
      `[FETCH-${fetchId}] Token expirado detectado en catch - status 401`
    );

    return controlledError;
  }

  // En client-side: redirigir al login
  try {
    redirectToLogin();
  } catch (e) {
    console.error(
      `[FETCH-${fetchId}] Error manejando token expirado (catch):`,
      e
    );
  }

  return error instanceof Error ? error : new Error(String(error));
}
