import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ACCESS_TOKEN_COOKIE } from "@/lib/auth/auth-cookie";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const token = request.cookies.get(AUTH_ACCESS_TOKEN_COOKIE)?.value;
    if (token) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
