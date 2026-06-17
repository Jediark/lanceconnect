import * as Sentry from "npm:@sentry/deno";
Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN_BACKEND"),
  environment: Deno.env.get("ENVIRONMENT") || "production",
  tracesSampleRate: 0.1,
});

import { corsHeaders } from "../_shared/cors.ts";
import { validateAuth } from "../_shared/auth.ts";
import { handleError, AppError } from "../_shared/errors.ts";

interface EnrichmentResults {
  domain: string;
  email: string | null;
  email_confidence: "verified" | "likely" | "unverified" | null;
  email_source: "prospeo" | "apollo" | "website_scraper" | null;
  phone: string | null;
  social_links: Record<string, string>;
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

    const { domain, businessName, city, country } = await req.json().catch(() => ({}));
    if (!domain) {
      return new Response(
        JSON.stringify({ error: "VALIDATION_FAILED", message: "Domain parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0].toLowerCase().trim();

    const results: EnrichmentResults = {
      domain: cleanDomain,
      email: null,
      email_confidence: null,
      email_source: null,
      phone: null,
      social_links: {},
    };

    // LAYER 1: Prospeo Search + Enrichment
    const prospeoKey = Deno.env.get("PROSPEO_LANCECONNECT_API_KEY");
    if (prospeoKey) {
      console.log(`[domain-to-email] Querying Prospeo search-person for ${cleanDomain}...`);
      try {
        const searchRes = await fetch("https://api.prospeo.io/search-person", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-KEY": prospeoKey,
          },
          body: JSON.stringify({
            filters: {
              company: {
                websites: {
                  include: [cleanDomain]
                }
              }
            }
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const firstResult = searchData.results?.[0];
          const linkedinUrl = firstResult?.person?.linkedin_url;

          if (linkedinUrl) {
            console.log(`[domain-to-email] Prospeo search found contact: ${firstResult.person.full_name} (${linkedinUrl}). Enriching...`);
            const enrichRes = await fetch("https://api.prospeo.io/enrich-person", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-KEY": prospeoKey,
              },
              body: JSON.stringify({
                data: {
                  linkedin_url: linkedinUrl
                }
              }),
              signal: AbortSignal.timeout(8000),
            });

            if (enrichRes.ok) {
              const enrichData = await enrichRes.json();
              const email = enrichData.person?.email?.email;
              if (email && !email.includes("*")) {
                results.email = email;
                results.email_confidence = "verified";
                results.email_source = "prospeo";
                console.log(`[domain-to-email] Prospeo found email: ${email}`);
              }
            }
          }
        }
      } catch (e) {
        console.warn("[domain-to-email] Prospeo failed:", (e as any).message);
      }
    }

    // LAYER 2: Apollo.io Mixed Search (Fallback)
    const apolloKey = Deno.env.get("APOLLO_API_KEY");
    if (!results.email && apolloKey) {
      console.log(`[domain-to-email] Querying Apollo.io for ${cleanDomain}...`);
      try {
        const apolloRes = await fetch("https://api.apollo.io/v1/mixed_people/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apolloKey,
          },
          body: JSON.stringify({
            q_organization_domains: [cleanDomain],
            page: 1,
            per_page: 1,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (apolloRes.ok) {
          const data = await apolloRes.json();
          const person = data.people?.[0];
          if (person?.email) {
            results.email = person.email;
            results.email_confidence = "likely";
            results.email_source = "apollo";
            console.log(`[domain-to-email] Apollo.io found email: ${person.email}`);
          }
        }
      } catch (e) {
        console.warn("[domain-to-email] Apollo.io failed:", (e as any).message);
      }
    }

    // LAYER 3: Web Scraper (Self-contained HTML scraper + optional custom URL)
    if (!results.email) {
      const externalScraperUrl = Deno.env.get("EMAIL_SCRAPER_URL");
      const internalKey = Deno.env.get("INTERNAL_API_KEY");

      if (externalScraperUrl && internalKey) {
        console.log(`[domain-to-email] Querying external email scraper for ${cleanDomain}...`);
        try {
          const scraperRes = await fetch(externalScraperUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Internal-Key": internalKey,
            },
            body: JSON.stringify({
              url: `https://${cleanDomain}`,
              deduplicate: true,
              filter_noreply: true,
              follow_contact_page: true,
            }),
            signal: AbortSignal.timeout(15000),
          });

          if (scraperRes.ok) {
            const data = await scraperRes.json();
            if (data.emails && data.emails.length > 0) {
              results.email = data.emails[0];
              results.email_confidence = "unverified";
              results.email_source = "website_scraper";
              console.log(`[domain-to-email] External scraper found email: ${data.emails[0]}`);
            }
          }
        } catch (e) {
          console.warn("[domain-to-email] External scraper failed:", (e as any).message);
        }
      }

      // Self-contained fallback page crawler if no email is found yet
      if (!results.email) {
        console.log(`[domain-to-email] Running local regex crawler for ${cleanDomain}...`);
        try {
          const pageRes = await fetch(`https://${cleanDomain}`, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            signal: AbortSignal.timeout(10000),
          });

          if (pageRes.ok) {
            const html = await pageRes.text();
            // Regex to find email addresses
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const emails = html.match(emailRegex) || [];
            
            // Clean and validate emails
            const validEmails = emails.filter((email) => {
              const low = email.toLowerCase();
              return (
                !low.endsWith(".png") &&
                !low.endsWith(".jpg") &&
                !low.endsWith(".gif") &&
                !low.endsWith(".svg") &&
                !low.endsWith(".webp") &&
                !low.includes("noreply") &&
                !low.includes("no-reply")
              );
            });

            if (validEmails.length > 0) {
              results.email = validEmails[0];
              results.email_confidence = "unverified";
              results.email_source = "website_scraper";
              console.log(`[domain-to-email] Local crawler found email: ${validEmails[0]}`);
            }
          }
        } catch (e) {
          console.warn("[domain-to-email] Local crawler failed:", (e as any).message);
        }
      }
    }

    // LAYER 4: SMTP Verification with Mailboxlayer
    const mailboxKey = Deno.env.get("MAILBOXLAYER_API_KEY");
    if (results.email && results.email_confidence !== "verified" && mailboxKey) {
      console.log(`[domain-to-email] Running SMTP validation for ${results.email}...`);
      try {
        const verifyRes = await fetch(
          `http://apilayer.net/api/check?access_key=${mailboxKey}&email=${results.email}&smtp=1`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (verifyRes.ok) {
          const data = await verifyRes.json();
          if (data.smtp_check) {
            results.email_confidence = "verified";
            console.log(`[domain-to-email] Mailboxlayer verified email successfully.`);
          }
        }
      } catch (e) {
        console.warn("[domain-to-email] Mailboxlayer validation failed:", (e as any).message);
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
