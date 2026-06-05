const appUrl = Deno.env.get("APP_URL") || "https://lanceconnect.vercel.app";

export const corsHeaders = {
  "Access-Control-Allow-Origin": appUrl,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
