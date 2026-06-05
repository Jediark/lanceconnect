import * as Sentry from "npm:@sentry/deno";
Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN_BACKEND"),
  environment: Deno.env.get("ENVIRONMENT") || "production",
  tracesSampleRate: 0.1,
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { validateAuth } from "../_shared/auth.ts";
import { handleError, AppError } from "../_shared/errors.ts";
import { checkRateLimit } from "../_shared/ratelimit.ts";
import { z } from "https://esm.sh/zod@3.22.0";

const requestSchema = z.object({
  leadId: z.string().uuid(),
  channel: z.enum(["email", "phone_script", "sms", "linkedin", "whatsapp", "letter"]),
  tone: z.enum(["casual", "professional", "bold"]).optional().default("professional"),
  language: z.string().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const user = await validateAuth(req);
    if (!user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }

    const body = await req.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "VALIDATION_FAILED", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { leadId, channel, tone } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = Deno.env.get("Google_Gemini_API_KEY") || Deno.env.get("GEMINI_API_KEY");
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for AI outreach
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(supabase, user.id, ipAddress, "ai-outreach", 50, 3600);
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    // Fetch lead details
    const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();
    if (!lead) {
      throw new AppError("Lead not found", 404, "NOT_FOUND");
    }

    // Fetch user profile plan details
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, full_name, email, welcome_email_sent, freelancer_category, supplier_profile")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan || "free";
    const userName = profile?.full_name || "Freelancer";

    const userCategory = profile?.freelancer_category || lead.industry || "web_dev";
    const supplierProfile = (profile?.supplier_profile as any) || {};

    let promptRole = "world-class freelance marketer pitching your services";
    let promptGoal =
      "Focus on how you can solve their specific opportunity (e.g. build a website, improve rating, or run ads).";
    let promptExtraRules = "";

    if (
      ["african_food_export", "restaurant_supplier", "product_export", "b2b_trade"].includes(
        userCategory,
      )
    ) {
      const supplierName = supplierProfile.companyName || profile?.full_name || "Je'moorel UK";
      let supplierProducts = "premium products";
      if (supplierProfile.products) {
        supplierProducts = Array.isArray(supplierProfile.products)
          ? supplierProfile.products.join(", ")
          : String(supplierProfile.products);
      } else if (lead.description) {
        const productMatch = lead.description.match(/Product Interest:\s*([^\n)]+)/i);
        if (productMatch) {
          supplierProducts = productMatch[1].trim();
        }
      }
      const supplierCerts = Array.isArray(supplierProfile.certifications)
        ? supplierProfile.certifications.join(", ")
        : supplierProfile.certifications || "NAFDAC, ISO, Organic, Halal certified";
      const supplierMoq = supplierProfile.moq || "negotiable wholesale quantities";

      promptRole = `B2B supplier and import-export trade representative representing ${supplierName}`;
      promptGoal = `Introduce your company as a premier supplier of ${supplierProducts}. 
Pitch a supply/trade wholesale partnership to distribute or wholesale your products to them.
Include details about your products: ${supplierProducts}, certifications: ${supplierCerts}, and minimum order quantity (MOQ): ${supplierMoq}.
Do NOT pitch digital marketing, web dev, or freelance services. Keep it highly professional, B2B focused.
Offer to send a product catalogue or schedule a brief call.`;
    } else if (userCategory === "human_capital") {
      const supplierName = supplierProfile.companyName || profile?.full_name || "Je'moorel UK";
      const services = Array.isArray(supplierProfile.services)
        ? supplierProfile.services.join(", ")
        : supplierProfile.services || "workforce development, talent training, leadership workshops";

      promptRole = `Corporate HR & Talent Development consultant from ${supplierName}`;
      promptGoal = `Write a formal corporate B2B proposal targeting their HR/L&D department.
Offer high-quality training and organizational development services: ${services}.
Highlight:
- A complimentary Training Needs Analysis (TNA) offer.
- The ROI of investing in staff training and development.
- Request a meeting to discuss their specific organizational talent development needs.`;
    } else if (userCategory === "training_recruitment") {
      const supplierName = supplierProfile.companyName || profile?.full_name || "LanceConnect Partner";
      const services = Array.isArray(supplierProfile.services)
        ? supplierProfile.services.join(", ")
        : supplierProfile.services || "recruitment, headhunting, staffing solutions";

      promptRole = `Professional recruiter and staffing partner from ${supplierName}`;
      promptGoal = `Write a recruitment partnership pitch.
Introduce your staffing and recruitment services: ${services}.
Emphasize:
- Speed of candidate placement.
- High quality of vetted candidates.
- Cost savings compared to internal HR hiring search.
- Ask if they have open roles we can help fill.`;
    } else if (userCategory === "parent_tutor") {
      const subjects = Array.isArray(supplierProfile.subjects)
        ? supplierProfile.subjects.join(", ")
        : supplierProfile.subjects || "academic subjects";
      const ageGroups = Array.isArray(supplierProfile.ageGroups)
        ? supplierProfile.ageGroups.join(", ")
        : supplierProfile.ageGroups || "all ages";
      const format = supplierProfile.format || "online";
      const qualifications = supplierProfile.qualifications || "experienced educator";

      const isSchool = /school|academy|college|center|centre|learning/i.test(lead.business_type || lead.business_name || "");

      if (isSchool) {
        promptRole = `Professional tutor and educational contractor`;
        promptGoal = `Write a message to the school or learning center director/administrator.
Introduce yourself as an experienced tutor (${qualifications}) available to work with their students or support their after-school tutoring programs.
Subjects: ${subjects}. Age groups: ${ageGroups}. Format: ${format}.`;
      } else {
        promptRole = `Friendly local tutor and educational coach`;
        promptGoal = `Write a warm, family-focused message to a parent.
Introduce your tutoring services: ${subjects}.
Focus on:
- Helping their child achieve their full potential and improve their grades.
- Supporting ages: ${ageGroups}. Format: ${format}.
- Certifications/Qualifications: ${qualifications}.`;
      }
    } else if (userCategory === "tutor") {
      promptRole = "world-class online tutor and professional educator";
      promptGoal =
        "Introduce your tutoring services, language classes, or academic coaching. Highlight how you can support their students or educational needs.";
    }

    // Determine target language
    let targetLang = parsed.data.language || "";
    if (!targetLang) {
      // Auto-detect based on country
      const c = (lead.country || "").toLowerCase();
      if (c.includes("france") || c.includes("belgium") || c.includes("senegal") || c.includes("cote d") || c.includes("ivory coast") || c.includes("cameroon")) {
        targetLang = "French";
      } else if (c.includes("germany") || c.includes("austria") || c.includes("switzerland")) {
        targetLang = "German";
      } else if (c.includes("brazil") || c.includes("portugal")) {
        targetLang = "Portuguese";
      } else if (c.includes("japan")) {
        targetLang = "Japanese";
      } else if (c.includes("spain") || c.includes("mexico") || c.includes("argentina") || c.includes("colombia")) {
        targetLang = "Spanish";
      } else if (c.includes("egypt") || c.includes("saudi") || c.includes("uae") || c.includes("united arab") || c.includes("morocco")) {
        targetLang = "Arabic";
      } else {
        targetLang = "English";
      }
    }

    promptExtraRules += `\n- The output message MUST be written in ${targetLang}.`;

    const prompt = `You are a ${promptRole}. 
Write a short, highly personalized ${channel} message in a ${tone} tone to ${lead.business_name}.
Context:
- Business Type: ${lead.business_type}
- Location: ${lead.city}, ${lead.country}
- Website: ${lead.has_website ? lead.website_url : "No Website"}
- Rating: ${lead.google_rating} (${lead.google_review_count} reviews)
- Opportunities Identified: ${JSON.stringify(lead.score_breakdown)}
- Description/Details: ${lead.description || "None"}

Rules:
- Do not use placeholders (like [Name]). 
- Keep it short and to the point.
- ${promptGoal}${promptExtraRules}
- Provide a single, clear call to action.`;

    let generatedText = "";
    let providerLabel = "";
    let providerUsed = "";

    const usePremiumClaude = (plan === "pro" || plan === "agency") && anthropicApiKey;

    if (usePremiumClaude) {
      try {
        console.log(`Routing to premium Claude API for plan: ${plan}`);
        const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicApiKey!,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 500,
            messages: [{ role: "user", content: prompt }],
          }),
          signal: AbortSignal.timeout(8000), // 8-second timeout
        });

        if (claudeRes.ok) {
          const resJson = await claudeRes.json();
          generatedText = resJson.content?.[0]?.text || "";
          providerLabel = "✦ Generated with Claude AI";
          providerUsed = "claude";
        } else {
          const errText = await claudeRes.text();
          console.warn(`Claude API failed with status ${claudeRes.status}: ${errText}`);
          throw new Error("Claude API error");
        }
      } catch (err) {
        console.warn("Claude API timed out or failed. Falling back to Gemini...", err);
        // Log Claude Fallback to Audit Log
        try {
          await supabase.from("audit_log").insert({
            user_id: user.id,
            action: "ai.claude_fallback",
            entity_type: "ai",
            entity_id: leadId,
            metadata: { error: err instanceof Error ? err.message : String(err), tone, channel },
            ip_address: ipAddress,
            user_agent: req.headers.get("user-agent") || null,
          });
        } catch (auditErr) {
          console.warn("Failed to insert audit log:", auditErr);
        }
      }
    }

    // Fallback to Gemini if Claude was skipped or failed
    if (!generatedText) {
      console.log("Routing to Gemini 1.5 Flash API...");
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
          }),
        },
      );

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        throw new Error(`Gemini API failed with status ${geminiRes.status}: ${errorText}`);
      }

      const resJson = await geminiRes.json();
      generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
      providerLabel = "⚡ Generated with Gemini";
      providerUsed = "gemini";
    }

    if (!generatedText) {
      throw new Error("AI Model returned an empty response");
    }

    // Cache the message
    await supabase.from("ai_messages").upsert(
      {
        user_id: user.id,
        lead_id: leadId,
        channel,
        tone,
        message: generatedText.trim(),
        model: providerUsed === "claude" ? "claude-sonnet-4-20250514" : "gemini-1.5-flash",
      },
      { onConflict: "user_id,lead_id,channel,tone" },
    );

    // Log Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "ai.message_generated",
        entity_type: "ai",
        entity_id: leadId,
        metadata: { provider: providerUsed, tone, channel },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    return new Response(
      JSON.stringify({
        message: generatedText.trim(),
        provider_label: providerLabel,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
