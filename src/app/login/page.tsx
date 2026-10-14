import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";
import { isSupabaseAdminConfigured } from "@/lib/admin-env-check";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const adminDbReady = isSupabaseAdminConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl text-stone-900">MOROCCAN TRAVERTINE</h1>
        <p className="mt-1 text-sm text-stone-500">Admin sign in</p>
        {!adminDbReady && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
            Admin login needs a real{" "}
            <code className="text-[11px]">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
            <code className="text-[11px]">.env</code> or{" "}
            <code className="text-[11px]">.env.local</code> (Supabase → API →{" "}
            <strong>service_role</strong>). Save the file, then restart{" "}
            <code className="text-[11px]">npm run dev</code>.
          </p>
        )}
        <Suspense fallback={<p className="mt-8 text-sm text-stone-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
