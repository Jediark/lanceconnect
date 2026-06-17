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
  city: z.string().optional().default("New York"),
  country: z.string().optional().default("United States"),
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
  source: "themuse" | "arbeitnow" | "indeed" | "linkedin";
  tags: string[];
}

const CATEGORY_SKILL_MAP: Record<string, string> = {
  web_dev: "web developer",
  designer: "graphic designer",
  copywriter: "copywriter",
  seo: "SEO specialist",
  social_media: "social media manager",
  video: "video editor",
  photography: "photographer",
  marketing: "digital marketer",
  app_dev: "app developer",
  va: "virtual assistant",
  tutor: "online tutor",
  mc_events: "MC events host",
};

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
  return [];
}

async function searchIndeed(skill: string, city: string, country: string): Promise<UnifiedJob[]> {
  try {
    const query = encodeURIComponent(`freelance ${skill}`);
    const location = encodeURIComponent(`${city}, ${country}`);
    const rssUrl = `https://www.indeed.com/rss?q=${query}&l=${location}&sort=date&radius=25`;

    console.log(`Querying Indeed RSS: ${rssUrl}`);
    const res = await fetch(rssUrl, {
      headers: { "User-Agent": "LanceConnect/1.0 (+https://lanceconnect.vercel.app)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const jobs: UnifiedJob[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      const titleRaw = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || 
                       item.match(/<title>(.*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const descriptionRaw = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || 
                             item.match(/<description>(.*?)<\/description>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

      const title = titleRaw.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
      const description = descriptionRaw.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim();

      const isFreelance = /freelance|contract|remote|part.time|gig/i.test(title + description);
      if (isFreelance) {
        jobs.push({
          id: `indeed-${btoa(link).slice(0, 16)}`,
          title,
          company: "Indeed Employer",
          location: `${city}, ${country}`,
          description: description.slice(0, 300),
          url: link,
          category: skill,
          published_at: pubDate || new Date().toISOString(),
          source: "indeed",
          tags: ["Freelance", "Indeed"],
        });
      }
    }
    return jobs;
  } catch (err) {
    console.error("Indeed RSS search failed:", err);
    return [];
  }
}

async function searchLinkedInHiring(skill: string, city: string): Promise<UnifiedJob[]> {
  try {
    const query = encodeURIComponent(`freelance ${skill}`);
    const location = encodeURIComponent(city);
    const url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${location}&f_TP=1&f_JT=C,P,T`;

    console.log(`Querying LinkedIn public jobs: ${url}`);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];

    const html = await res.text();
    const jobs: UnifiedJob[] = [];

    const titleRegex = /<h3[^>]*class="[^"]*base-search-card__title[^"]*"[^>]*>([\s\S]*?)<\/h3>/g;
    const companyRegex = /<h4[^>]*class="[^"]*base-search-card__subtitle[^"]*"[^>]*>([\s\S]*?)<\/h4>/g;
    const linkRegex = /<a[^>]*class="[^"]*base-search-card__title-link[^"]*"[^>]*href="([^"]+)"/g;

    let titleMatch;
    const titles: string[] = [];
    while ((titleMatch = titleRegex.exec(html)) !== null) {
      titles.push(titleMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    let companyMatch;
    const companies: string[] = [];
    while ((companyMatch = companyRegex.exec(html)) !== null) {
      companies.push(companyMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    let linkMatch;
    const links: string[] = [];
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      links.push(linkMatch[1].split("?")[0]);
    }

    titles.slice(0, 10).forEach((title, i) => {
      const company = companies[i] || "LinkedIn Employer";
      const link = links[i] || url;
      jobs.push({
        id: `linkedin-${btoa(link).slice(0, 16)}`,
        title,
        company,
        location: city,
        description: `Freelance / contract role for ${title} at ${company}.`,
        url: link,
        category: skill,
        published_at: new Date().toISOString(),
        source: "linkedin",
        tags: ["Freelance", "LinkedIn"],
      });
    });
    return jobs;
  } catch (err) {
    console.error("LinkedIn search failed:", err);
    return [];
  }
}

async function fetchTheMuse(category: string, page: number): Promise<UnifiedJob[]> {
  const museCategories = category !== "all" ? mapCategoryToMuse(category) : [];
  let museUrl = `https://www.themuse.com/api/public/jobs?page=${page}`;
  if (museCategories.length > 0) {
    for (const cat of museCategories) {
      museUrl += `&category=${encodeURIComponent(cat)}`;
    }
  } else {
    museUrl += "&category=Software%20Engineering&category=Design&category=Writing";
  }

  console.log(`Querying The Muse: ${museUrl}`);
  const museRes = await fetch(museUrl, { signal: AbortSignal.timeout(6000) });
  if (!museRes.ok) return [];

  const data = await museRes.json();
  const results = data.results || [];
  return results.map((item: any) => ({
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
  }));
}

async function fetchArbeitnow(category: string): Promise<UnifiedJob[]> {
  console.log("Querying Arbeitnow: https://www.arbeitnow.com/api/job-board-api");
  const arbeitRes = await fetch("https://www.arbeitnow.com/api/job-board-api", {
    signal: AbortSignal.timeout(6000),
  });
  if (!arbeitRes.ok) return [];

  const data = await arbeitRes.json();
  const results = data.data || [];
  const jobs: UnifiedJob[] = [];

  for (const item of results) {
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
      published_at: new Date().toISOString(),
      source: "arbeitnow",
      tags: item.tags || [],
    });
  }
  return jobs;
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

    const { category, city, country, page } = parsed.data;

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

    const skill = CATEGORY_SKILL_MAP[category] || "freelancer";

    // Run all scraping tasks in parallel
    const results = await Promise.allSettled([
      searchIndeed(skill, city, country),
      searchLinkedInHiring(skill, city),
      fetchTheMuse(category, page),
      fetchArbeitnow(category),
    ]);

    const allJobs: UnifiedJob[] = [];
    results.forEach((res) => {
      if (res.status === "fulfilled") {
        allJobs.push(...res.value);
      }
    });

    // Deduplicate by URL or normalized Title + Company
    const seen = new Set<string>();
    const deduplicatedJobs = allJobs.filter((job) => {
      const uniqueKey =
        job.url || `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
      if (seen.has(uniqueKey)) {
        return false;
      }
      seen.add(uniqueKey);
      return true;
    });

    // Sort jobs: latest first
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
        metadata: { category, city, country, page, results_count: deduplicatedJobs.length },
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
