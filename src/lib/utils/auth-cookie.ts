export const AUTH_COOKIE_NAME = 'auth_token';

export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    ? '; Secure'
    : '';
  document.cookie = `${encodeURIComponent(AUTH_COOKIE_NAME)}=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
}

export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(AUTH_COOKIE_NAME)}=; Path=/; Max-Age=0; SameSite=Lax`;
}
