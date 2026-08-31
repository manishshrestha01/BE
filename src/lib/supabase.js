import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseClient;
}

// Lazy proxy so the client is only constructed in the browser (never during SSR).
export const supabase = new Proxy(
  {},
  {
    get: (_target, prop) => {
      const client = getSupabase();
      if (!client) return undefined;
      return client[prop];
    },
  }
);

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);