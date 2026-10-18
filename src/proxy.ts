import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAdminAuthDisabled } from "@/lib/admin-auth-config";
import { ensureAuthEnv, isSecureAuthCookie } from "@/lib/ensure-auth-env";

ensureAuthEnv();

function nextWithPathname(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/atlasadmin");

  if (!isAuthRoute) {
    return nextWithPathname(req);
  }

  if (isAdminAuthDisabled()) {
    if (pathname === "/login" || pathname.startsWith("/login/")) {
      return NextResponse.redirect(new URL("/atlasadmin", req.url));
    }
    if (pathname.startsWith("/atlasadmin")) {
      return nextWithPathname(req);
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
    return nextWithPathname(req);
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

  return nextWithPathname(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|woff2?)$).*)",
  ],
};
