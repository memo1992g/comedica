/**
 * Módulo para el refresh automático del token del cliente
 */

// Cache para evitar múltiples refresh concurrentes del token del cliente
let refreshingClientTokenPromise: Promise<string | null> | null = null;

/**
 * Genera un UUID simple para casos donde no se puede usar generateDynamicUUID()
 * (componentes cliente que necesitan refresh de token)
 */
function generateFallbackUUID(): string {
  // Generar un UUID simple basado en timestamp y random
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `fallback-${timestamp}-${random}`;
}

/**
 * Obtiene un nuevo token del cliente cuando el actual ha expirado.
 * Maneja concurrencia para evitar múltiples peticiones simultáneas.
 * 
 * @param uuid - UUID opcional. Si se proporciona, se usa. Si no, se genera uno fallback.
 *              Para uso desde Server Actions/Components, se debe generar con generateDynamicUUID()
 *              y pasarlo aquí. Para uso desde cliente, se genera automáticamente un fallback.
 */
export async function refreshClientToken(uuid?: string): Promise<string | null> {
  // Si ya hay un refresh en curso, reutilizar la promesa
  if (refreshingClientTokenPromise) {
    console.log("[REFRESH] Reutilizando refresh en curso...");
    return refreshingClientTokenPromise;
  }

  console.log("[REFRESH] Iniciando refresh del token del cliente...");

  refreshingClientTokenPromise = (async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AUTH_URL;
      const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
      const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

      if (!API_URL || !CLIENT_ID || !CLIENT_SECRET) {
        console.error("[REFRESH] Error: Configuración de API incompleta");
        return null;
      }

      const requestBody = {
        request: {
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
        },
        uuid: uuid || generateFallbackUUID(),
        pageId: 1,
        channel: "E",
      };

      // Hacer la petición directa sin usar customAuthFetch para evitar recursión
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error("[REFRESH] Error en respuesta:", response.status);
        return null;
      }

      const data = await response.json();
      const newToken = data?.data?.accessToken || data?.accessToken;

      if (newToken) {
        console.log("[REFRESH] ✅ Nuevo token obtenido exitosamente");
        return newToken;
      }

      console.error("[REFRESH] No se encontró accessToken en la respuesta");
      return null;
    } catch (error) {
      console.error("[REFRESH] Error al refrescar token:", error);
      return null;
    }
  })();

  try {
    const result = await refreshingClientTokenPromise;
    return result;
  } finally {
    // Limpiar la promesa después de completar
    refreshingClientTokenPromise = null;
  }
}
