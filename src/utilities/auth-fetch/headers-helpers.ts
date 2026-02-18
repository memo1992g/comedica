/**
 * Helpers para manipulación de headers HTTP
 */

/**
 * Extrae el Bearer token de los headers en cualquier forma de HeadersInit
 */
export function getBearerFromHeaders(
  headersInit: HeadersInit | undefined
): string | null {
  if (!headersInit) return null;

  let authValue: string | null = null;

  if (headersInit instanceof Headers) {
    authValue =
      headersInit.get("authorization") || headersInit.get("Authorization");
  } else if (Array.isArray(headersInit)) {
    const found = headersInit.find(([k]) => /authorization/i.test(k));
    authValue = found ? found[1] : null;
  } else if (typeof headersInit === "object") {
    const headers = headersInit;
    authValue = headers["authorization"] || headers["Authorization"] || null;
  }

  if (typeof authValue === "string" && authValue.startsWith("Bearer ")) {
    return authValue.slice(7);
  }

  return null;
}

/**
 * Obtiene un valor de header sin sensibilidad a mayúsculas/minúsculas
 */
export function getHeaderValue(
  headersInit: HeadersInit | undefined,
  headerName: string
): string | null {
  if (!headersInit) return null;

  const lowerName = headerName.toLowerCase();

  if (headersInit instanceof Headers) {
    return headersInit.get(headerName) ?? headersInit.get(lowerName) ?? null;
  }

  if (Array.isArray(headersInit)) {
    const found = headersInit.find(([k]) => k.toLowerCase() === lowerName);
    return found ? found[1] : null;
  }

  // Object type headers
  const headers = headersInit;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === lowerName);
  return key ? headers[key] : null;
}

/**
 * Actualiza el header Authorization con un nuevo token
 */
export function updateAuthorizationHeader(
  headers: HeadersInit,
  newToken: string
): void {
  if (headers instanceof Headers) {
    headers.set("Authorization", `Bearer ${newToken}`);
  } else if (Array.isArray(headers)) {
    const authIndex = headers.findIndex(([k]) => /authorization/i.test(k));
    if (authIndex >= 0) {
      headers[authIndex] = ["Authorization", `Bearer ${newToken}`];
    } else {
      headers.push(["Authorization", `Bearer ${newToken}`]);
    }
  } else if (typeof headers === "object") {
    headers["Authorization"] = `Bearer ${newToken}`;
  }
}

/**
 * Verifica si el Content-Type es URL encoded
 */
export function isUrlEncodedContentType(
  headersInit: HeadersInit | undefined
): boolean {
  const contentType = getHeaderValue(headersInit, "Content-Type");
  return (
    typeof contentType === "string" &&
    contentType.toLowerCase().includes("application/x-www-form-urlencoded")
  );
}
