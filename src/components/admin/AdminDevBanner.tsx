import { isAdminAuthDisabled } from "@/lib/admin-auth-config";

export function AdminDevBanner() {
  if (!isAdminAuthDisabled()) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-8 py-2 text-center text-sm text-amber-950">
      Preview mode — admin login is off until Supabase is configured. Add{" "}
      <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
      then set{" "}
      <code className="rounded bg-amber-100 px-1">ATLAS_SKIP_ADMIN_AUTH=false</code>{" "}
      to enable sign-in.
    </div>
  );
}
