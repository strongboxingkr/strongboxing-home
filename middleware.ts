import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const savedPassword = request.cookies.get("admin-password")?.value;

  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname.startsWith("/admin-login");

  if (isAdminPage && savedPassword !== password) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (isLoginPage && savedPassword === password) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};