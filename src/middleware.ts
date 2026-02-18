import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/utils/auth-cookie';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return Boolean(token);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  if (pathname === '/') {
    const destination = authenticated ? '/dashboard' : '/auth/login';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (pathname.startsWith('/auth') && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard') && !authenticated) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*', '/dashboard/:path*'],
};
