import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json().catch(() => ({}));
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server is not configured correctly" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze what this user saves (in user_leads)
    const { data: saved, error: savedError } = await supabase
      .from('user_leads')
      .select('leads(business_type, opportunity_score, has_website, google_rating)')
      .eq('user_id', userId)
      .limit(50);

    if (savedError) {
      console.error("Error fetching saved leads:", savedError);
    }

    // Analyze what this user dismisses (in user_seen_leads where action = 'dismissed')
    const { data: dismissed, error: dismissedError } = await supabase
      .from('user_seen_leads')
      .select('leads(business_type, opportunity_score)')
      .eq('user_id', userId)
      .eq('action', 'dismissed')
      .limit(50);

    if (dismissedError) {
      console.error("Error fetching dismissed leads:", dismissedError);
    }

    const savedList = saved || [];
    const dismissedList = dismissed || [];

    if (savedList.length < 5) {
      return new Response(JSON.stringify({ message: 'Not enough data yet', savedCount: savedList.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Calculate preferred business types from saved leads
    const businessTypeCounts: Record<string, number> = {};
    savedList.forEach((s: any) => {
      const type = s.leads?.business_type || 'unknown';
      businessTypeCounts[type] = (businessTypeCounts[type] || 0) + 1;
    });

    const preferredTypes = Object.entries(businessTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);

    // Calculate preferred score range from saved leads
    const scores = savedList.map((s: any) => s.leads?.opportunity_score || 0).filter((s: number) => s > 0);
    const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / (scores.length || 1);
    const minScore = Math.max(0, Math.round(avgScore - 20));

    // Update preferences in user_lead_preferences table
    const { error: upsertError } = await supabase.from('user_lead_preferences').upsert({
      user_id: userId,
      preferred_business_types: preferredTypes,
      preferred_score_range: `[${minScore},100]`,
      total_interactions: savedList.length + dismissedList.length,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    if (upsertError) {
      throw upsertError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      preferences: { preferredTypes, minScore } 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
