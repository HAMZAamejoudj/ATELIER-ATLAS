/** True when service role is set and login can verify passwords against Postgres. */
export function isSupabaseAdminConfigured(): boolean {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  if (!key) return false;
  if (key.includes("PASTE") || key.includes("YOUR_")) return false;
  return key.length > 40;
}
