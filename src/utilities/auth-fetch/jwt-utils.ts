/**
 * Utilidades para validación y análisis de tokens JWT
 */

import { decodeJWT } from "../jwt-decoder";

/**
 * Verifica si un token JWT está expirado
 */
export function isJwtExpired(token: string): boolean {
  try {
    const payload: any = decodeJWT(token);
    if (!payload || typeof payload.exp !== "number") return false;

    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSec;
  } catch {
    return false;
  }
}

/**
 * Determina si es un token de cliente (aplicación) vs token de usuario
 * El token de cliente tiene type: "application"
 */
export function isClientToken(token: string): boolean {
  try {
    const payload: any = decodeJWT(token);
    return payload?.type === "application";
  } catch {
    return false;
  }
}

/**
 * Obtiene el tiempo restante de un token en segundos
 * Retorna 0 si el token está expirado o no es válido
 */
export function getTokenTimeRemaining(token: string): number {
  try {
    const payload: any = decodeJWT(token);
    if (!payload || typeof payload.exp !== "number") return 0;

    const nowSec = Math.floor(Date.now() / 1000);
    const remaining = payload.exp - nowSec;

    return Math.max(remaining, 0);
  } catch {
    return 0;
  }
}

/**
 * Extrae información básica del token
 */
export function getTokenInfo(token: string): {
  type: string | null;
  expiresAt: Date | null;
  isExpired: boolean;
  subject: string | null;
} {
  try {
    const payload: any = decodeJWT(token);

    return {
      type: payload?.type || null,
      expiresAt: payload?.exp ? new Date(payload.exp * 1000) : null,
      isExpired: isJwtExpired(token),
      subject: payload?.sub || null,
    };
  } catch {
    return {
      type: null,
      expiresAt: null,
      isExpired: true,
      subject: null,
    };
  }
}
