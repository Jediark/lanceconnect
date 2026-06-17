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
  id?: string;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  url?: string;
  link?: string;
  category: string;
  published_at?: string;
  published?: string;
  source: "themuse" | "arbeitnow" | "indeed" | "linkedin";
  tags?: string[];
  city?: string;
  country?: string;
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
          city,
          country,
          description: description.slice(0, 300),
          url: link,
          link,
          category: skill,
          published_at: pubDate || new Date().toISOString(),
          published: pubDate || new Date().toISOString(),
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
    
    // Attempt 1: Try with Contract/Part-time/Temp filters (more relevant but sometimes restricted)
    let url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${location}&f_JT=C,P,T`;
    console.log(`Querying LinkedIn public jobs (Attempt 1): ${url}`);
    
    let res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    let html = "";
    if (res.ok) {
      html = await res.text();
    }

    // Check if we got zero results (or page got redirected / no base-search-cards)
    const cardMatches = html.match(/base-search-card/g) || [];
    if (!res.ok || cardMatches.length === 0) {
      // Attempt 2: Relax filters completely to get at least some job postings
      url = `https://www.linkedin.com/jobs/search/?keywords=${query}&location=${location}`;
      console.log(`Querying LinkedIn public jobs (Attempt 2 - Relaxed): ${url}`);
      res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        html = await res.text();
      } else {
        return [];
      }
    }

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
        city,
        description: `Freelance / contract role for ${title} at ${company}.`,
        url: link,
        link,
        category: skill,
        published_at: new Date().toISOString(),
        published: new Date().toISOString(),
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

async function searchTheMuse(category: string, page = 1): Promise<UnifiedJob[]> {
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
  return results.map((item: any) => {
    const link = item.refs?.landing_page || "";
    const published = item.publication_date || new Date().toISOString();
    return {
      id: `themuse-${item.id}`,
      title: item.name,
      company: item.company?.name || "Unknown Company",
      location: item.locations?.map((loc: any) => loc.name).join(", ") || "Remote",
      city: item.locations?.[0]?.name || "Remote",
      country: "",
      description: item.contents || "",
      url: link,
      link: link,
      category: item.categories?.[0]?.name || "General",
      published_at: published,
      published: published,
      source: "themuse",
      tags: item.categories?.map((cat: any) => cat.name) || [],
    };
  });
}

async function searchArbeitnow(category: string): Promise<UnifiedJob[]> {
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
      city: item.location || "Remote (Europe)",
      country: "",
      description: item.description || "",
      url: item.url,
      link: item.url,
      category: "Tech / Remote",
      published_at: new Date().toISOString(),
      published: new Date().toISOString(),
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
      searchTheMuse(category, page),
      searchArbeitnow(category),
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
        job.url || job.link || `${job.title.toLowerCase().trim()}-${(job.company || "").toLowerCase().trim()}`;
      if (seen.has(uniqueKey)) {
        return false;
      }
      seen.add(uniqueKey);
      return true;
    });

    // Map to ensure full compatibility with both frontend and tests
    const finalJobs = deduplicatedJobs.map((job) => ({
      ...job,
      link: job.link || job.url || "",
      url: job.url || job.link || "",
      published: job.published || job.published_at || new Date().toISOString(),
      published_at: job.published_at || job.published || new Date().toISOString(),
      city: job.city || job.location || city || "",
      country: job.country || country || "",
      location: job.location || job.city || `${city}, ${country}` || "Remote",
    }));

    // Sort jobs: latest first
    finalJobs.sort((a, b) => {
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
        metadata: { category, city, country, page, results_count: finalJobs.length },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    const getCountForSource = (index: number) => {
      const resVal = results[index];
      return resVal.status === "fulfilled" ? resVal.value.length : 0;
    };

    return new Response(
      JSON.stringify({
        success: true,
        count: finalJobs.length,
        total: finalJobs.length,
        jobs: finalJobs,
        opportunities: finalJobs,
        sources: {
          indeed: getCountForSource(0),
          linkedin: getCountForSource(1),
          the_muse: getCountForSource(2),
          arbeitnow: getCountForSource(3),
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
