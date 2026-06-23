import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인 없이 접근 가능한 API
const PUBLIC_API_PATHS = ["/api/consultation", "/api/admin/login", "/api/admin/logout"];

function isAuthed(request: NextRequest): boolean {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const savedPassword = request.cookies.get("admin-password")?.value;
  return !!adminPassword && savedPassword === adminPassword;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 페이지 보호
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    if (!isAuthed(request)) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  if (pathname === "/admin-login" && isAuthed(request)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // API 보호 - 공개 API 제외하고 모두 인증 필요
  if (pathname.startsWith("/api/") && !PUBLIC_API_PATHS.includes(pathname)) {
    if (!isAuthed(request)) {
      return NextResponse.json(
        { ok: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login", "/api/:path*"],
};
