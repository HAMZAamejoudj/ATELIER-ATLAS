import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    client = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

/** Lazy Supabase anon client — safe to import during build without env. */
export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_target, prop) {
    return Reflect.get(getSupabase(), prop);
  },
});
