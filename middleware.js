import { NextResponse } from 'next/server';

const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH;

const protectedRoutes = [`/${ADMIN_BASE_PATH}`];
const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuth = Boolean(accessToken);

  // Authenticated users trying to access auth pages → redirect to dashboard
  if (isAuth && publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(
      new URL(`/${ADMIN_BASE_PATH}/dashboard`, request.url)
    );
  }

  // Unauthenticated users trying to access protected routes → redirect to login
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
