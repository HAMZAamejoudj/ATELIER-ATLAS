import "server-only";

import type { GetServerSidePropsContext } from "next";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

import { isAdminAuthDisabled } from "@/lib/admin-auth-config";
import { ensureAuthEnv, isSecureAuthCookie } from "@/lib/ensure-auth-env";

export async function checkAdmin(): Promise<JWT> {
  if (isAdminAuthDisabled()) {
    return { sub: "dev-admin", role: "ADMIN" };
  }

  ensureAuthEnv();
  const cookieStore = await cookies();
  const cookieRecord = Object.fromEntries(
    cookieStore.getAll().map((cookie) => [cookie.name, cookie.value]),
  );

  const token = await getToken({
    req: { cookies: cookieRecord } as GetServerSidePropsContext["req"],
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecureAuthCookie(),
  });

  if (!token?.sub || token.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return token;
}
