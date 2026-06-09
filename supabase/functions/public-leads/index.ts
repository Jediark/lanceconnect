import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { city, category } = await req.json().catch(() => ({}));

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from("leads")
      .select(`business_name, business_type, city, country,
               has_website, google_rating, google_review_count,
               opportunity_score, phone, email, industry,
               has_facebook, has_instagram`)
      .eq("is_active", true)
      .order("opportunity_score", { ascending: false })
      .limit(3);

    if (city) {
      query = query.ilike("city", `%${city}%`);
    }
    if (category) {
      query = query.eq("industry", category);
    }

    const { data: leads, error } = await query;
    if (error) throw error;

    // Mask contacts — create desire to sign up
    const masked = (leads || []).map((lead: any) => ({
      ...lead,
      phone: lead.phone
        ? lead.phone.slice(0, 7) + "••••"
        : null,
      email: lead.email
        ? lead.email.split("@")[0].slice(0, 3) + "•••@•••.com"
        : null,
    }));

    return new Response(
      JSON.stringify({ leads: masked, total: masked.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
