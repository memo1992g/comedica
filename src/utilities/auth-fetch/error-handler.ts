/**
 * Manejador de errores de red/fetch
 */

import { isServerSide } from "./utils";

/**
 * Verifica si un error es un error de red/fetch
 */
export function isFetchNetworkError(error: unknown): boolean {
  if (!(error instanceof TypeError)) return false;

  const errorCause =
    error.cause && typeof error.cause === "object"
      ? (error.cause as any)
      : null;

  return (
    error.message?.includes("fetch failed") ||
    error.message?.includes("Failed to fetch") ||
    (errorCause &&
      (errorCause.name === "NetworkError" ||
        errorCause.code === "ECONNREFUSED" ||
        errorCause.code === "ENOTFOUND"))
  );
}

/**
 * Maneja errores de red en el servidor
 */
export function handleNetworkError(
  error: unknown,
  interceptedUrl: string,
  fetchId: string
): Error {
  if (!isServerSide()) {
    return error instanceof Error ? error : new Error(String(error));
  }

  if (!isFetchNetworkError(error)) {
    return error instanceof Error ? error : new Error(String(error));
  }

  const controlledError =
    error instanceof Error ? error : new Error(String(error));

  (controlledError as any).status = 503;
  (controlledError as any).isFetchError = true;
  (controlledError as any).url = interceptedUrl;
  (controlledError as any).fetchId = fetchId;

  console.log(
    `[FETCH-${fetchId}] Error de red/control de fetch - status 503`
  );

  return controlledError;
}
