import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Auth صفحات
  const authRoutes = [
    "/login",
    "/signup",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  const isAuthPage = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isDashboardPage = pathname.startsWith("/dashboard");

  // Protect dashboard routes
  if (isDashboardPage && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent logged-in users from accessing auth صفحات
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(
      new URL("/dashboard/user", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclude:
     * - api routes
     * - next static/image
     * - favicon
     * - public assets (images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};