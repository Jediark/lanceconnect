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
  category: z.string().optional().default("all"),
  page: z.number().optional().default(1),
});

interface UnifiedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  category: string;
  published_at: string;
  source: "themuse" | "arbeitnow";
  tags: string[];
}

// Map user craft categories to The Muse category names
function mapCategoryToMuse(category: string): string[] {
  const normalized = category.toLowerCase();
  if (
    normalized.includes("web") ||
    normalized.includes("software") ||
    normalized.includes("dev") ||
    normalized.includes("code")
  ) {
    return ["Software Engineering", "Computer and IT"];
  }
  if (
    normalized.includes("design") ||
    normalized.includes("creative") ||
    normalized.includes("ui") ||
    normalized.includes("ux")
  ) {
    return ["Design"];
  }
  if (
    normalized.includes("write") ||
    normalized.includes("content") ||
    normalized.includes("edit")
  ) {
    return ["Editorial", "Writing"];
  }
  if (
    normalized.includes("market") ||
    normalized.includes("seo") ||
    normalized.includes("social")
  ) {
    return ["Marketing", "Advertising and PR"];
  }
  if (normalized.includes("sale") || normalized.includes("biz") || normalized.includes("lead")) {
    return ["Sales"];
  }
  if (
    normalized.includes("support") ||
    normalized.includes("customer") ||
    normalized.includes("assist")
  ) {
    return ["Customer Service"];
  }
  return []; // Empty means query without category or all
}

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

    const { category, page } = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 50 requests/hour for job search
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const rateLimit = await checkRateLimit(
      supabase,
      user.id,
      ipAddress,
      "online-opportunities",
      50,
      3600,
    );
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    const jobs: UnifiedJob[] = [];

    // 1. Fetch from The Muse API
    try {
      const museCategories = category !== "all" ? mapCategoryToMuse(category) : [];
      let museUrl = `https://www.themuse.com/api/public/jobs?page=${page}`;
      if (museCategories.length > 0) {
        for (const cat of museCategories) {
          museUrl += `&category=${encodeURIComponent(cat)}`;
        }
      } else {
        // Default to creative/engineering/writing tags if "all" is selected to get freelance-relevant listings
        museUrl += "&category=Software%20Engineering&category=Design&category=Writing";
      }

      console.log(`Querying The Muse: ${museUrl}`);
      const museRes = await fetch(museUrl, { signal: AbortSignal.timeout(6000) });
      if (museRes.ok) {
        const data = await museRes.json();
        const results = data.results || [];

        for (const item of results) {
          jobs.push({
            id: `themuse-${item.id}`,
            title: item.name,
            company: item.company?.name || "Unknown Company",
            location: item.locations?.map((loc: any) => loc.name).join(", ") || "Remote",
            description: item.contents || "",
            url: item.refs?.landing_page || "",
            category: item.categories?.[0]?.name || "General",
            published_at: item.publication_date || new Date().toISOString(),
            source: "themuse",
            tags: item.categories?.map((cat: any) => cat.name) || [],
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch from The Muse:", err);
    }

    // 2. Fetch from Arbeitnow API
    try {
      console.log(`Querying Arbeitnow: https://www.arbeitnow.com/api/job-board-api`);
      const arbeitRes = await fetch("https://www.arbeitnow.com/api/job-board-api", {
        signal: AbortSignal.timeout(6000),
      });
      if (arbeitRes.ok) {
        const data = await arbeitRes.json();
        const results = data.data || [];

        for (const item of results) {
          // If category filter is applied, perform basic keyword matching on tags or title
          if (category !== "all") {
            const normalizedTitle = item.title.toLowerCase();
            const normalizedTags = item.tags.map((t: string) => t.toLowerCase());
            const isMatch =
              normalizedTitle.includes(category.toLowerCase()) ||
              normalizedTags.some((t: string) => t.includes(category.toLowerCase()));
            if (!isMatch) continue;
          }

          jobs.push({
            id: `arbeitnow-${item.slug}`,
            title: item.title,
            company: item.company_name,
            location: item.location || "Remote (Europe)",
            description: item.description || "",
            url: item.url,
            category: "Tech / Remote",
            published_at: new Date().toISOString(), // Arbeitnow does not return direct dates on standard feed items in the same format
            source: "arbeitnow",
            tags: item.tags || [],
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch from Arbeitnow:", err);
    }

    // 3. Deduplicate by URL or normalized Title + Company
    const seen = new Set<string>();
    const deduplicatedJobs = jobs.filter((job) => {
      const uniqueKey =
        job.url || `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
      if (seen.has(uniqueKey)) {
        return false;
      }
      seen.add(uniqueKey);
      return true;
    });

    // Sort jobs: latest first if dates are parseable
    deduplicatedJobs.sort((a, b) => {
      const timeA = new Date(a.published_at).getTime();
      const timeB = new Date(b.published_at).getTime();
      return timeB - timeA;
    });

    // Log Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "jobs.searched",
        entity_type: "jobs",
        metadata: { category, page, results_count: deduplicatedJobs.length },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    return new Response(
      JSON.stringify({ success: true, count: deduplicatedJobs.length, jobs: deduplicatedJobs }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
