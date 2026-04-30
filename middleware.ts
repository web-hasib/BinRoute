import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the accessToken from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/signup') || 
                       request.nextUrl.pathname.startsWith('/register');
                       
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

    // If the user is trying to access the dashboard without a token, redirect to login
    if (isDashboardPage && !accessToken) {
        const loginUrl = new URL('/login', request.url);
        // Optional: save the callback url to redirect back after login
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If the user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthPage && accessToken) {
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (like images in public folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
    ],
};
