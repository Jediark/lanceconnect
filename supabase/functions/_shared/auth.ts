import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function validateAuth(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
    return null;
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  });

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();
  if (error || !user) {
    console.warn("Authentication failed:", error?.message);
    return null;
  }
  return user;
}
