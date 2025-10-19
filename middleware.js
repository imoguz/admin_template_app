import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const isAuth = Boolean(token);

  // If user is authenticated and tries to access auth pages, redirect to projects
  if (isAuth && publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!isAuth && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
