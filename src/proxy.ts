import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAdminAuthDisabled } from "@/lib/admin-auth-config";
import { ensureAuthEnv, isSecureAuthCookie } from "@/lib/ensure-auth-env";

ensureAuthEnv();

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isAdminAuthDisabled()) {
    if (pathname === "/login" || pathname.startsWith("/login/")) {
      return NextResponse.redirect(new URL("/atlasadmin", req.url));
    }
    if (pathname.startsWith("/atlasadmin")) {
      return NextResponse.next();
    }
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecureAuthCookie(),
  });
  const isAuth = Boolean(token);

  if (pathname === "/login" || pathname.startsWith("/login/")) {
    if (isAuth) {
      const from = req.nextUrl.searchParams.get("from");
      return NextResponse.redirect(
        new URL(from && from.startsWith("/atlasadmin") ? from : "/atlasadmin", req.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/atlasadmin")) {
    if (!isAuth) {
      const from = pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
      );
    }
    if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/login/:path*", "/atlasadmin", "/atlasadmin/:path*"],
};
