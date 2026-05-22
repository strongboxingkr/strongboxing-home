import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const savedPassword = request.cookies.get("admin-password")?.value;

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin-login" &&
    savedPassword !== adminPassword
  ) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (pathname === "/admin-login" && savedPassword === adminPassword) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};