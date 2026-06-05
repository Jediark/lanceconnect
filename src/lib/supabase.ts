import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ||
  "https://rpaodsmwhmzyhopvkwjt.supabase.co") as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwYW9kc213aG16eWhvcHZrd2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDE3MzUsImV4cCI6MjA5NjAxNzczNX0.oE0aUeIssOS4hgq4Dd9m46twTj_mwUM7074rMr9_XOc") as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
