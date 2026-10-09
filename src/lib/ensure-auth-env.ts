export function isSecureAuthCookie(): boolean {
  if (process.env.NODE_ENV === "production") return true;
  if (process.env.VERCEL) return true;
  return process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
}

export function ensureAuthEnv() {
  const current = process.env.NEXTAUTH_URL;
  const vercelHost = process.env.VERCEL_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (vercelHost) {
    const hasInvalidUrl =
      !current || current.includes("localhost") || current.startsWith("http://");

    if (hasInvalidUrl) {
      process.env.NEXTAUTH_URL =
        siteUrl?.startsWith("https://") ? siteUrl : `https://${vercelHost}`;
      return;
    }
  }

  if (current) return;

  if (vercelHost) {
    process.env.NEXTAUTH_URL = `https://${vercelHost}`;
    return;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
  }
}
