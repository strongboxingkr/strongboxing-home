import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn =
    request.cookies.get("admin-auth")?.value === "true";

  const pathname = request.nextUrl.pathname;

  // 로그인 안했는데 관리자 접근
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin-login" &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/admin-login", request.url)
    );
  }

  // 로그인 했는데 로그인페이지 접근
  if (
    pathname === "/admin-login" &&
    isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};