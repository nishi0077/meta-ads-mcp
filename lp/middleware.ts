import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "mcp_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    const session = request.cookies.get(AUTH_COOKIE)?.value;
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get(AUTH_COOKIE)?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
