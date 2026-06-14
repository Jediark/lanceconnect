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
import { sendEmail, getWelcomeEmailHtml, getQuotaWarningEmailHtml } from "../_shared/email.ts";
import { z } from "https://esm.sh/zod@3.22.0";

const requestSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  city: z.string().min(1),
  country: z.string().min(1),
  limit: z.number().optional().default(10),
  product: z.string().optional(),
  niche: z.string().optional(),
  seen_lead_ids: z.array(z.string()).optional(),
}).refine((data) => data.query || data.category, {
  message: "Either query or category is required",
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

    const { city, country, limit, product, niche } = parsed.data;
    const query = parsed.data.query || parsed.data.category || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apifyServiceUrl =
      Deno.env.get("APIFY_SERVICE_URL") || "http://apify-service.internal:8002";
    const openCageApiKey = Deno.env.get("OPENCAGE_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError("Server is not configured correctly", 500, "MISCONFIGURED");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Enforce Rate Limit: 10 requests/hour for search-leads
    const ipAddress = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || null;
    const ipCountry = req.headers.get("cf-ipcountry") || null;
    const rateLimit = await checkRateLimit(supabase, user.id, ipAddress, "search-leads", 10, 3600);
    if (!rateLimit.allowed) {
      throw new AppError("Too many requests. Please try again later.", 429, "RATE_LIMIT_EXCEEDED");
    }

    // Fetch user details for welcome email, quota warnings, and supplier profile
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "email, full_name, welcome_email_sent, quota_warning_sent, leads_used_this_month, leads_limit, supplier_profile, plan, device_fingerprint, seen_lead_ids",
      )
      .eq("id", user.id)
      .single();

    // Map skill category IDs to target local business niches (potential clients)
    const categoryNiches: Record<string, string[]> = {
      web_dev: ["restaurant", "bakery", "plumber", "auto repair", "dry cleaner", "law firm", "medical clinic"],
      seo: ["dentist", "chiropractor", "gym", "law firm", "medical clinic", "pest control"],
      designer: ["cafe", "boutique", "bakery", "spa", "restaurant", "florist"],
      copywriter: ["lawyer", "clinic", "consultant", "accountant", "architect"],
      social_media: ["gym", "beauty salon", "boutique", "cafe", "restaurant", "fitness studio"],
      video: ["real estate agency", "hotel", "private school", "gym", "resort"],
      photography: ["restaurant", "hotel", "boutique", "wedding planner", "portrait studio"],
      marketing: ["contractor", "garage", "dentist", "private school", "roofing contractor"],
      app_dev: ["restaurant", "pharmacy", "taxi service", "gym", "food delivery"],
      va: ["consultant", "coaching", "shortcut", "law firm", "real estate agent"],
      tutor: [
        "primary school",
        "secondary school",
        "learning center",
        "tutoring center",
        "language school",
        "university",
        "college",
      ],
      mc_events: [
        "corporate event organizer",
        "wedding planner",
        "conference organizer",
        "award ceremony organizer",
        "event management company",
        "hotel events department",
        "university events office",
        "church events coordinator",
        "NGO fundraiser event",
        "product launch organizer",
        "gala dinner organizer",
        "concert promoter",
      ],
      translation: ["legal translation agency", "immigration consultant", "embassy", "import export company"],
      personal_trainer: ["gym", "fitness center", "hotel gym", "sports club", "wellness retreat"],
      landscaping: ["real estate developer", "property management company", "hotel", "golf course"],
      hairstylist: ["beauty salon", "hair salon", "spa", "wedding planner", "hotel spa"],
      makeup_artist: ["photography studio", "wedding planner", "beauty salon", "modeling agency"],
      voiceover: ["video production agency", "recording studio", "advertising agency", "radio station"],
      accounting: ["law firm", "consulting firm", "retail store", "restaurant", "manufacturing company"],
      handyman: ["property management company", "real estate office", "hotel", "apartment complex"],
      wedding_planner: ["wedding venue", "hotel events office", "bridal boutique", "catering company"],
      massage_therapist: ["spa", "wellness center", "chiropractor clinic", "hotel spa"],
      music_teacher: ["music school", "private school", "community center", "after school program"],
      pet_care: ["veterinary clinic", "pet shop", "dog kennel", "dog grooming salon"],
      house_cleaning: ["office cleaning", "property management company", "hotel", "cleaning agency"],
    };

    const GLOBAL_CATEGORY_TERMS: Record<string, Record<string, string[]>> = {
      african_food_export: {
        en: [
          "african food importer",
          "caribbean food wholesaler",
          "ethnic food distributor",
          "african restaurant supplier",
          "international food broker",
          "african caribbean supermarket",
          "ethnic grocery wholesaler",
          "food import export company",
          "cash and carry",
          "world food wholesaler",
          "ethnic cash and carry",
          "african food wholesaler",
        ],
        fr: ["importateur alimentaire africain", "grossiste en produits exotiques"],
        de: ["afrikanischer lebensmittelimporteur", "afrikanischer lebensmittel grosshandel"],
        pt: ["importador de alimentos africanos", "grossista de alimentos tropicais"],
        ar: ["مستورد الأغذية الأفريقية", "تاجر الجملة للأغذية الأفريقية"],
      },
      restaurant_supplier: {
        en: ["restaurant", "hotel kitchen", "catering company", "food service company", "pub kitchen", "cafe"],
        fr: ["restaurant", "cuisine hotel", "traiteur", "service alimentaire"],
        de: ["Restaurant", "Hotelküche", "Catering-Unternehmen"],
        es: ["restaurante", "cocina de hotel", "empresa de catering"],
      },
      product_export: {
        en: ["food importer", "commodity trader", "wholesale distributor", "import export company", "international trader"],
        fr: ["importateur de produits", "distributeur en gros", "societe import export"],
        de: ["Lebensmittelimporteur", "Grosshaendler", "Import Export Unternehmen"],
      },
      b2b_trade: {
        en: ["manufacturer", "wholesale supplier", "distributor", "procurement company", "buying agent", "trading company"],
        fr: ["fabricant", "fournisseur en gros", "distributeur", "agent d'achat"],
        de: ["Hersteller", "Grosshaendler", "Vertriebspartner", "Einkaufsagentur"],
      },
      parent_tutor: {
        en: ["primary school", "secondary school", "learning center", "tutoring center", "homeschool cooperative", "after school program", "educational center"],
        fr: ["centre de tutorat", "ecole primaire", "soutien scolaire"],
        de: ["Nachhilfezentrum", "Grundschule", "Nachhilfelehrer"],
        es: ["centro de tutoría", "escuela primaria", "clases de apoyo escolar"],
        ar: ["مركز الدروس الخصوصية", "مدرسة ابتدائية"],
        ja: ["家庭教師センター", "小学校", "学習塾"],
        zh: ["补习中心", "小学", "课后辅导"],
      },
      human_capital: {
        en: ["bank headquarters", "hospital group", "corporation", "large company", "multinational company", "NGO headquarters", "university administration", "insurance company", "telecoms company"],
        fr: ["siege social de banque", "groupe hospitalier", "siege social", "grande entreprise", "multinationale"],
        de: ["Firmenzentrale Bank", "Konzernzentrale", "Krankenhausgruppe", "Großunternehmen"],
        es: ["sede bancaria", "sede corporativa", "grupo empresarial", "gran empresa"],
        pt: ["sede bancaria", "sede corporativa", "grupo empresarial", "grande empresa"],
      },
      training_recruitment: {
        en: ["company hiring", "recruitment agency client", "staffing needs", "HR department", "company expansion", "new office opening", "graduate recruitment program"],
        fr: ["cabinet de recrutement", "recrutement entreprise", "ressources humaines"],
        de: ["Personalvermittlung", "Stellenangebote Unternehmen", "HR Abteilung"],
        es: ["agencia de seleccion de personal", "empresa contratando", "departamento de recursos humanos"],
        pt: ["agencia de recrutamento", "empresa contratando", "departamento de recursos humanos"],
      },
    };

    function getLanguageFromCountry(countryName: string): string {
      const c = countryName.toLowerCase().trim();
      if (c.includes("france") || c.includes("belgium") || c.includes("senegal") || c.includes("cote d") || c.includes("ivory coast") || c.includes("cameroon")) return "fr";
      if (c.includes("germany") || c.includes("austria") || c.includes("switzerland")) return "de";
      if (c.includes("portugal") || c.includes("brazil") || c.includes("angola")) return "pt";
      if (c.includes("spain") || c.includes("mexico") || c.includes("argentina") || c.includes("colombia") || c.includes("chile") || c.includes("peru")) return "es";
      if (c.includes("japan")) return "ja";
      if (c.includes("china") || c.includes("taiwan")) return "zh";
      if (c.includes("egypt") || c.includes("saudi") || c.includes("uae") || c.includes("united arab") || c.includes("morocco")) return "ar";
      return "en";
    }

    const lang = getLanguageFromCountry(country);
    let searchKeyword = query;

    if (niche) {
      searchKeyword = niche;
      console.log(`Overriding search category with niche query: "${searchKeyword}"`);
    } else if (query in GLOBAL_CATEGORY_TERMS) {
      const termsMap = GLOBAL_CATEGORY_TERMS[query];
      const terms = termsMap[lang] || termsMap["en"] || [];
      searchKeyword = terms[Math.floor(Math.random() * terms.length)];
      console.log(`Mapped B2B category "${query}" in language "${lang}" to: "${searchKeyword}"`);
    } else if (query in categoryNiches) {
      const niches = categoryNiches[query];
      searchKeyword = niches[Math.floor(Math.random() * niches.length)];
      console.log(`Mapped category "${query}" to client niche keyword "${searchKeyword}"`);
    }

    // Prefill products from profile if not provided in search params
    let searchProduct = product;
    if (!searchProduct && profile?.supplier_profile) {
      const supProfile = profile.supplier_profile as any;
      if (supProfile.products) {
        searchProduct = Array.isArray(supProfile.products)
          ? supProfile.products.join(", ")
          : String(supProfile.products);
      }
    }

    if (
      searchProduct &&
      ["african_food_export", "b2b_trade", "restaurant_supplier", "product_export"].includes(query)
    ) {
      searchKeyword = `${searchKeyword} ${searchProduct}`;
      console.log(`Appended product to query: "${searchKeyword}"`);
    }

    // 1. Welcome on registration email check
    if (profile && !profile.welcome_email_sent) {
      console.log(`Sending welcome email to new user: ${profile.email}`);
      await sendEmail({
        to: profile.email,
        subject: "Welcome to LanceConnect! 🎉",
        html: getWelcomeEmailHtml(profile.full_name || "Freelancer"),
      });
      await supabase.from("profiles").update({ welcome_email_sent: true }).eq("id", user.id);
    }


    // 2. Enforce plan-based search limits strictly (Free: 10, Grow: 100, Scale: 250)
    const plan = profile?.plan || "free";
    let maxSearches = 10;
    if (plan === "grow" || plan === "individual" || plan === "starter") {
      maxSearches = 100;
    } else if (plan === "scale" || plan === "company" || plan === "agency" || plan === "pro") {
      maxSearches = 250;
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    let userIdsToCount = [user.id];

    // Multi-account detection: if plan is free and device fingerprint is recorded, find all sibling accounts on the same device
    if (plan === "free" && profile?.device_fingerprint) {
      const { data: siblings } = await supabase
        .from("profiles")
        .select("id")
        .eq("device_fingerprint", profile.device_fingerprint);
      
      if (siblings && siblings.length > 0) {
        userIdsToCount = siblings.map((s: any) => s.id);
      }
    }

    const { count: searchesThisMonth, error: countError } = await supabase
      .from("search_history")
      .select("id", { count: "exact", head: true })
      .in("user_id", userIdsToCount)
      .gte("created_at", startOfMonth.toISOString());

    if (countError) {
      console.warn("Error counting search history:", countError);
    }

    const currentCount = searchesThisMonth || 0;
    if (currentCount >= maxSearches) {
      if (userIdsToCount.length > 1) {
        throw new AppError(
          `Search limit reached! Your device has reached the limit of 10 free searches per month across all accounts. Please upgrade to a premium plan to continue searching.`,
          402,
          "LIMIT_REACHED",
        );
      } else {
        throw new AppError(
          `Search limit reached! Your ${plan.toUpperCase()} plan allows ${maxSearches} searches per month. You have already completed ${currentCount} searches. Please upgrade to increase your limit.`,
          402,
          "LIMIT_REACHED",
        );
      }
    }

    // Seen leads tracking (Requirement 1 & 2)
    const clientSeenIds = parsed.data.seen_lead_ids || [];
    const seenLeadIds = [...new Set([...(profile?.seen_lead_ids || []), ...clientSeenIds])];

    // Helper to query the cached database
    const queryDatabase = async (targetCity: string, targetCountry: string, excludeIds: string[]) => {
      let qb = supabase
        .from("leads")
        .select("*")
        .eq("country", targetCountry)
        .ilike("city", targetCity)
        .eq("industry", query) // Match user's selected category (Requirement 7)
        .gt("cache_expires_at", new Date().toISOString());

      if (excludeIds.length > 0) {
        // Exclude seen leads
        qb = qb.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data, error } = await qb.limit(limit);
      if (error) {
        console.warn(`Cache query failed for ${targetCity}:`, error);
        return [];
      }
      return data || [];
    };

    // Calculate total pool count for transparency banner (Requirement 11)
    let totalPoolCount = 0;
    try {
      const { count } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("country", country)
        .ilike("city", city)
        .eq("industry", query);
      totalPoolCount = count || 0;
    } catch (countError) {
      console.warn("Failed to get total pool count:", countError);
    }

    // Define Geographic Expansion Lists (Requirement 3 & 6)
    const NEARBY_CITIES_MAP: Record<string, string[]> = {
      seattle: ["Tacoma", "Bellevue", "Kent", "Renton", "Everett", "Portland"],
      tacoma: ["Seattle", "Bellevue", "Kent", "Renton", "Portland"],
      bellevue: ["Seattle", "Tacoma", "Kent", "Renton", "Everett", "Portland"],
      portland: ["Seattle", "Bellevue", "Tacoma", "Vancouver", "Salem", "Eugene"],
      lagos: ["Ibadan", "Abeokuta", "Abuja", "Port Harcourt", "Benin City"],
      london: ["Manchester", "Birmingham", "Leeds", "Liverpool", "Bristol", "Edinburgh"],
      dubai: ["Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah"],
      "new york": ["Jersey City", "Brooklyn", "Queens", "Newark", "Philadelphia", "Boston"],
      "los angeles": ["San Diego", "San Jose", "San Francisco", "Sacramento", "Phoenix"],
      toronto: ["Mississauga", "Hamilton", "Ottawa", "Montreal", "Vancouver"],
    };

    const COUNTRY_CITIES_MAP: Record<string, string[]> = {
      "nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Enugu", "Kaduna"],
      "ghana": ["Accra", "Kumasi", "Cape Coast", "Tamale", "Sekondi"],
      "kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
      "south africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth"],
      "united kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Edinburgh"],
      "germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Dusseldorf"],
      "france": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes"],
      "spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
      "canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton"],
      "australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
      "uae": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
    };

    const US_STATE_CITIES: Record<string, { state: string, cities: string[] }> = {
      seattle: { state: "Washington", cities: ["spokane", "tacoma", "vancouver", "bellevue", "kent"] },
      spokane: { state: "Washington", cities: ["seattle", "tacoma", "vancouver", "bellevue", "kent"] },
      tacoma: { state: "Washington", cities: ["seattle", "spokane", "vancouver", "bellevue", "kent"] },
      bellevue: { state: "Washington", cities: ["seattle", "spokane", "tacoma", "vancouver", "kent"] },
      kent: { state: "Washington", cities: ["seattle", "spokane", "tacoma", "vancouver", "bellevue"] },
      "new york": { state: "New York", cities: ["buffalo", "rochester", "yonkers", "syracuse", "albany", "brooklyn", "queens"] },
      "los angeles": { state: "California", cities: ["san francisco", "san diego", "sacramento", "san jose", "fresno", "oakland", "long beach"] },
      "san francisco": { state: "California", cities: ["los angeles", "san diego", "sacramento", "san jose", "fresno", "oakland", "long beach"] },
    };

    let results: any[] = [];
    let expansionMessage: string | null = null;
    const cityKey = city.toLowerCase().trim();

    // Query target city first
    const initialLeads = await queryDatabase(city, country, seenLeadIds);
    results = [...initialLeads];

    // Helper function to call Apify scraping microservice
    async function scrapeLiveLeads(targetCity: string, targetCountry: string) {
      let lat: number | null = null;
      let lng: number | null = null;

      if (openCageApiKey) {
        try {
          console.log(`Geocoding city "${targetCity}, ${targetCountry}" using OpenCage...`);
          const geoRes = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(`${targetCity}, ${targetCountry}`)}&key=${openCageApiKey}`,
            { signal: AbortSignal.timeout(5000) },
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
              lat = geoData.results[0].geometry.lat;
              lng = geoData.results[0].geometry.lng;
            }
          }
        } catch (err) {
          console.error("OpenCage geocoding failed:", err);
        }
      }

      const apifyKeyword = `${searchKeyword} in ${targetCity}, ${targetCountry}`;
      console.log(`Invoking Apify scraper for "${apifyKeyword}"...`);

      try {
        let scrapeUrl = `${apifyServiceUrl}/scrape?keyword=${encodeURIComponent(apifyKeyword)}&city=${encodeURIComponent(targetCity)}&country=${encodeURIComponent(targetCountry)}&limit=10`;
        if (lat !== null && lng !== null) {
          scrapeUrl += `&lat=${lat}&lng=${lng}`;
        }

        const apifyToken = Deno.env.get("APIFY_API_KEY_LANCECONNECT");
        const headers: Record<string, string> = {};
        if (apifyToken) {
          headers["Authorization"] = `Bearer ${apifyToken}`;
        }

        const scrapeRes = await fetch(scrapeUrl, {
          method: "GET",
          headers,
          signal: AbortSignal.timeout(55000),
        });

        if (scrapeRes.ok) {
          const scrapedData = await scrapeRes.json();
          const newLeads = scrapedData.leads || [];

          if (newLeads.length > 0) {
            const leadsToInsert = newLeads.map((item: any) => ({
              business_name: item.business_name,
              business_type: item.business_type || searchKeyword,
              industry: query,
              description: product
                ? item.description
                  ? `${item.description} (Product Interest: ${product})`
                  : `Product Interest: ${product}`
                : item.description || null,
              country: targetCountry,
              city: targetCity,
              full_address: item.full_address || null,
              phone: item.phone || null,
              email: item.email || null,
              website_url: item.website_url || null,
              has_website: !!item.website_url,
              google_place_id: item.google_place_id || null,
              google_rating: item.google_rating || null,
              google_review_count: item.google_review_count || 0,
              google_maps_url: item.google_maps_url || null,
              source: "google_maps",
              cache_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }));

            const { data: insertedLeads, error: upsertError } = await supabase
              .from("leads")
              .upsert(leadsToInsert, { onConflict: "google_place_id" })
              .select();

            if (upsertError) {
              console.error("Failed to upsert scraped leads into database:", upsertError);
            } else if (insertedLeads) {
              for (const newLead of insertedLeads) {
                fetch(`${supabaseUrl}/functions/v1/check-social`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: req.headers.get("Authorization") || "",
                  },
                  body: JSON.stringify({ leadId: newLead.id }),
                }).catch((err) =>
                  console.error("Async social check trigger failed:", newLead.id, err),
                );

                if (newLead.website_url) {
                  fetch(`${supabaseUrl}/functions/v1/enrich-contact`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: req.headers.get("Authorization") || "",
                    },
                    body: JSON.stringify({ leadId: newLead.id }),
                  }).catch((err) =>
                    console.error("Async contact enrichment trigger failed:", newLead.id, err),
                  );
                }
              }
              return insertedLeads;
            }
          }
        }
      } catch (scrapeErr) {
        console.error("Apify service call failed:", scrapeErr);
      }
      return [];
    }

    // Silently expand if we have fewer than 6 leads (Requirement 6)
    if (results.length < 6) {
      console.log(`Fewer than 6 leads in target city (${results.length}). Performing silent geographic expansion...`);

      // Step 1: Metro area/Nearby
      const metroCities = NEARBY_CITIES_MAP[cityKey] || [];
      for (const metroCity of metroCities) {
        if (results.length >= 6) break;
        const metroLeads = await queryDatabase(metroCity, country, seenLeadIds);
        const newLeads = metroLeads.filter(ml => !results.some(r => r.id === ml.id));
        results = [...results, ...newLeads];
      }
    }

    if (results.length < 6) {
      // Step 2: State/Region
      const countryKey = country.toLowerCase().trim();
      const countryCities = COUNTRY_CITIES_MAP[countryKey] || [];
      const stateCities = countryCities.filter(c => c.toLowerCase().trim() !== cityKey && !(NEARBY_CITIES_MAP[cityKey] || []).includes(c));
      for (const stateCity of stateCities) {
        if (results.length >= 6) break;
        const stateLeads = await queryDatabase(stateCity, country, seenLeadIds);
        const newLeads = stateLeads.filter(sl => !results.some(r => r.id === sl.id));
        results = [...results, ...newLeads];
      }
    }

    if (results.length < 6) {
      // Step 3: National
      const nationalCities = ["New York", "Los Angeles", "Chicago", "London", "Lagos", "Toronto", "Sydney", "Dubai", "Johannesburg", "Paris", "Berlin"];
      const remainingCities = nationalCities.filter(c => c.toLowerCase().trim() !== cityKey && !results.some(r => r.city?.toLowerCase() === c.toLowerCase()));
      for (const natCity of remainingCities) {
        if (results.length >= 6) break;
        const natLeads = await queryDatabase(natCity, country, seenLeadIds);
        const newLeads = natLeads.filter(nl => !results.some(r => r.id === nl.id));
        results = [...results, ...newLeads];
      }
    }

    // If still fewer than 6, query live scrape for target city
    if (results.length < 6) {
      console.log(`Cache query yielded fewer than 6 results (${results.length}). Scraping target city live...`);
      const scraped = await scrapeLiveLeads(city, country);
      const unseenScraped = scraped.filter(l => !seenLeadIds.includes(l.id) && !results.some(r => r.id === l.id));
      results = [...results, ...unseenScraped];

      // If still fewer than 6, scrape the first nearby city
      if (results.length < 6) {
        const metroCities = NEARBY_CITIES_MAP[cityKey] || [];
        if (metroCities.length > 0) {
          const firstNearby = metroCities[0];
          console.log(`Still fewer than 6 results (${results.length}). Scraping first nearby city: ${firstNearby}...`);
          const scrapedNearby = await scrapeLiveLeads(firstNearby, country);
          const unseenNearby = scrapedNearby.filter(l => !seenLeadIds.includes(l.id) && !results.some(r => r.id === l.id));
          results = [...results, ...unseenNearby];
        }
      }
    }

    // Prioritize leads with complete contact information (Requirement 8)
    const getCompletenessWeight = (l: any) => {
      let weight = 0;
      if (l.phone) weight += 1;
      if (l.email) weight += 1;
      if (l.website_url || l.has_website) weight += 1;
      return weight;
    };

    results.sort((a, b) => {
      const weightA = getCompletenessWeight(a);
      const weightB = getCompletenessWeight(b);
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      return (b.opportunity_score || 0) - (a.opportunity_score || 0);
    });

    const finalLeads = results.slice(0, limit);

    // Save returned leads to seen_lead_ids (Requirement 1 & 2)
    const returnedLeadIds = finalLeads.map(l => l.id);
    if (returnedLeadIds.length > 0) {
      const updatedSeen = [...new Set([...seenLeadIds, ...returnedLeadIds])];
      await supabase
        .from("profiles")
        .update({ seen_lead_ids: updatedSeen })
        .eq("id", user.id);
    }

    // Set expansion warning message if any lead is from a different city (Requirement 3 & 6)
    const targetCityLower = city.toLowerCase().trim();
    const otherCities = [...new Set(
      finalLeads
        .map(l => l.city)
        .filter((c): c is string => !!c && c.toLowerCase().trim() !== targetCityLower)
    )];

    if (otherCities.length > 0) {
      expansionMessage = `We've found all available leads in ${city} — here are additional results from nearby areas like ${otherCities.slice(0, 3).join(", ")}.`;
    }

    // Trigger scoring for any unscored leads in final results
    for (const lead of finalLeads) {
      if (lead.opportunity_score === null || lead.opportunity_score === undefined) {
        console.log(`[search-leads] Triggering scoring for unscored lead: ${lead.business_name} (${lead.id})`);
        fetch(`${supabaseUrl}/functions/v1/score-opportunity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.get("Authorization") || "",
          },
          body: JSON.stringify({ leadId: lead.id }),
        }).catch((err) =>
          console.error(`Failed to trigger score-opportunity for lead ${lead.id}:`, err),
        );
      }
    }

    // 6. Deduct quota and log search (Bypassed consumption since platform is free)

    await supabase.from("search_history").insert({
      user_id: user.id,
      query_params: { query, city, country },
      results_count: finalLeads.length,
      leads_consumed: 1,
    });

    // 7. Check 80% usage threshold for quota warnings (Bypassed since platform is free)

    // 8. Insert Action to Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "lead.searched",
        entity_type: "lead",
        metadata: { query, city, country, results_count: finalLeads.length },
        ip_address: ipAddress,
        user_agent: req.headers.get("user-agent") || null,
      });
    } catch (auditErr) {
      console.warn("Failed to insert audit log:", auditErr);
    }

    // Save to search_intelligence
    try {
      await supabase.from("search_intelligence").insert({
        user_id: user.id,
        search_query: searchKeyword,
        category: query || null,
        country: country || null,
        city: city || null,
        product: searchProduct || null,
        results_count: finalLeads.length,
        ip_country: ipCountry,
      });
    } catch (siErr) {
      console.warn("Failed to save search intelligence:", siErr);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      leads: finalLeads,
      total_pool_count: totalPoolCount,
      expansion_message: expansionMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});

// ================================================================
// PHASE 2 TODO: Google Business Profile API Integration
// ================================================================
// Apply at: https://developers.google.com/my-business/content/prereqs
//
// Requirements before applying:
// 1. LanceConnect must have verified GBP active for 60+ days
//    → Create at: business.google.com
// 2. Valid business website (lanceconnect.com)
// 3. Clear use case description for Google's review team
//
// Once approved, this unlocks:
// → Search impressions per business (how many people found them)
// → Direction requests (how many navigated to them)
// → Phone calls tracked through GMB
// → Photo view counts
// → Popular times data
//
// These are GOLD for freelancer pitches:
// "Your business gets 50 searches/month but only 3 calls —
//  a better website and GMB profile would convert more"
// ================================================================
