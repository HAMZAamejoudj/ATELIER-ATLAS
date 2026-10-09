/**
 * Skip admin login (local UI work before Supabase is ready).
 * Set ATLAS_SKIP_ADMIN_AUTH=false once Supabase + NextAuth are configured.
 */
export function isAdminAuthDisabled(): boolean {
  const flag = process.env.ATLAS_SKIP_ADMIN_AUTH?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;

  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  return process.env.NODE_ENV === "development" && !hasSupabase;
}
