/**
 * Decodifica un JWT sin verificar la firma
 * NOTA: Esto NO valida el token, solo extrae la información
 * La validación debe hacerse en el servidor
 */
export function decodeJWT(token: string): any {
  try {
    // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }
    
    // La segunda parte es el payload
    const payload = parts[1];
    
    // Decodificar de base64url a string
    // base64url usa - y _ en lugar de + y /
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    
    // Agregar padding si es necesario
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decodificar base64 a string
    const jsonString = atob(padded);
    
    // Parsear el JSON
    const decoded = JSON.parse(jsonString);    
    return decoded;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Extrae información específica del JWT
 */
export function extractJWTInfo(token: string) {
  const decoded = decodeJWT(token);
  
  if (!decoded) {
    return null;
  }
  
  return {
    // Información estándar de JWT
    sub: decoded.sub,           // Subject (generalmente el ID del usuario)
    iat: decoded.iat,           // Issued at (timestamp)
    exp: decoded.exp,           // Expiration (timestamp)
    iss: decoded.iss,           // Issuer
    aud: decoded.aud,           // Audience
    
    // Información personalizada que podría incluir el token
    userId: decoded.userId || decoded.user_id,
    username: decoded.username || decoded.user_name,
    email: decoded.email,
    roles: decoded.roles,
    permissions: decoded.permissions,
    sessionId: decoded.sessionId || decoded.session_id,
    
    // Toda la información decodificada
    raw: decoded
  };
}