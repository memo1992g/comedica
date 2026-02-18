"use server";

/**
 * Utilidad para extraer el clientId (cliId) del token JWT almacenado en cookies
 * Este valor debe usarse en lugar de nroAsoc del store para todas las acciones
 */

import { cookies } from "next/headers";
import { APP_COOKIES } from "@/consts/cookies/cookies.consts";
import { decodeJWT } from "../jwt-decoder";

interface DecodedUserToken {
  applicationId: number;
  sub: string;
  type: "user";
  userId: number;
  username: string;
  cliId: number;
  active: boolean;
  iat: number;
  exp: number;
}

/**
 * Obtiene el clientId (cliId) del token JWT del usuario autenticado
 * @returns El cliId como número o null si no está disponible
 */
export async function getClientIdFromToken(): Promise<number | null> {
  try {
    const accessToken = cookies().get(APP_COOKIES.AUTH.ACCESS_TOKEN)?.value;

    if (!accessToken) {
      console.warn("[getClientIdFromToken] No access token found in cookies");
      return null;
    }

    const decoded = decodeJWT(accessToken) as DecodedUserToken | null;

    if (!decoded || typeof decoded.cliId !== "number") {
      console.warn("[getClientIdFromToken] Invalid token or cliId not found");
      return null;
    }

    return decoded.cliId;
  } catch (error) {
    console.error("[getClientIdFromToken] Error extracting cliId:", error);
    return null;
  }
}

/**
 * Obtiene el clientId (cliId) como string del token JWT del usuario
 * Útil para APIs que esperan el clientId como string
 * @returns El cliId como string o null si no está disponible
 */
export async function getClientIdStringFromToken(): Promise<string | null> {
  const cliId = await getClientIdFromToken();
  return cliId !== null ? String(cliId) : null;
}
