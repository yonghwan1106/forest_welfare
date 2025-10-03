import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Allow public routes
  if (isPublicRoute) {
    return res;
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
