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
import { sendEmail, getWelcomeEmailHtml } from "../_shared/email.ts";
import { z } from "https://esm.sh/zod@3.22.0";
import { getSearchDistricts } from "./city_districts.ts";

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

const CATEGORY_QUERY_GROUPS: Record<string, string[][]> = {
  web_dev: [
    ['restaurant', 'bar', 'cafe', 'pub'],           // Food & Beverage
    ['beauty salon', 'spa', 'barbershop', 'nail salon'], // Beauty
    ['dentist', 'clinic', 'pharmacy', 'hospital'],   // Healthcare
    ['gym', 'fitness center', 'yoga studio'],        // Fitness
    ['hotel', 'guesthouse', 'lodge', 'airbnb'],      // Hospitality
    ['law firm', 'accounting firm', 'consultant'],   // Professional Services
    ['retail store', 'boutique', 'shop', 'market'],  // Retail
    ['school', 'academy', 'tutoring center'],        // Education
    ['real estate agency', 'property developer'],    // Real Estate
    ['auto repair', 'car wash', 'mechanic'],         // Automotive
    ['bakery', 'pastry shop', 'confectionery'],      // Bakery
    ['event venue', 'wedding hall', 'conference center'], // Events
  ],
  designer: [
    ['fashion boutique', 'clothing store', 'apparel'],
    ['restaurant', 'cafe', 'bar'],
    ['startup', 'tech company', 'app company'],
    ['nonprofit', 'NGO', 'charity'],
    ['real estate agency', 'property developer'],
    ['hotel', 'resort', 'spa'],
    ['school', 'university', 'academy'],
    ['music studio', 'entertainment company'],
    ['pharmacy', 'clinic', 'hospital'],
  ],
  seo: [
    ['dentist', 'dental clinic', 'orthodontist'],
    ['plumber', 'electrician', 'contractor'],
    ['lawyer', 'law firm', 'attorney'],
    ['accountant', 'accounting firm', 'bookkeeper'],
    ['real estate agent', 'property agent'],
    ['doctor', 'GP', 'specialist clinic'],
    ['veterinarian', 'pet clinic', 'animal hospital'],
    ['driving school', 'traffic school'],
    ['insurance agent', 'insurance broker'],
  ],
  social_media: [
    ['restaurant', 'cafe', 'bar', 'nightclub'],
    ['beauty salon', 'spa', 'wellness center'],
    ['gym', 'fitness center', 'personal trainer'],
    ['fashion boutique', 'clothing store'],
    ['hotel', 'resort', 'bed and breakfast'],
    ['bakery', 'dessert shop', 'ice cream parlor'],
    ['florist', 'flower shop'],
    ['photography studio', 'portrait studio'],
  ],
  african_food_export: [
    ['african food importer', 'ethnic food wholesaler'],
    ['caribbean food distributor', 'international food broker'],
    ['african restaurant supplier', 'food import company'],
    ['ethnic supermarket', 'african grocery store'],
    ['food export company', 'commodity trader'],
    ['wholesale food distributor', 'food trading company'],
  ],
};

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

const generateFingerprint = async (params: { category: string; country: string; city: string; product?: string; niche?: string }) => {
  const text = `${params.category}|${params.country}|${params.city}|${params.product || ''}|${params.niche || ''}`;
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
};

const getPaginationState = async (supabase: any, userId: string, fingerprint: string) => {
  const { data } = await supabase
    .from('search_pagination_state')
    .select('current_offset, total_seen')
    .eq('user_id', userId)
    .eq('search_fingerprint', fingerprint)
    .maybeSingle();

  return data || { current_offset: 0, total_seen: 0 };
};

const advancePaginationState = async (
  supabase: any,
  userId: string,
  fingerprint: string,
  resultsReturned: number,
  totalAvailable: number
) => {
  const currentState = await getPaginationState(supabase, userId, fingerprint);
  const newOffset = (currentState.current_offset + resultsReturned) % Math.max(totalAvailable, resultsReturned || 1);

  await supabase.from('search_pagination_state').upsert({
    user_id: userId,
    search_fingerprint: fingerprint,
    current_offset: newOffset,
    total_seen: currentState.total_seen + resultsReturned,
    last_search_at: new Date().toISOString()
  }, { onConflict: 'user_id,search_fingerprint' });
};

const getNicheRotation = async (supabase: any, userId: string, category: string) => {
  const { data } = await supabase
    .from('district_rotation')
    .select('last_district_index')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('city_key', 'niche_rotation')
    .maybeSingle();

  return data?.last_district_index || 0;
};

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

    // Fetch user details for welcome email and limits
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "email, full_name, welcome_email_sent, plan, device_fingerprint, supplier_profile",
      )
      .eq("id", user.id)
      .single();

    // Welcome email trigger
    if (profile && !profile.welcome_email_sent) {
      console.log(`Sending welcome email to new user: ${profile.email}`);
      await sendEmail({
        to: profile.email,
        subject: "Welcome to LanceConnect! 🎉",
        html: getWelcomeEmailHtml(profile.full_name || "Freelancer"),
      });
      await supabase.from("profiles").update({ welcome_email_sent: true }).eq("id", user.id);
    }

    // Enforce plan-based search limits strictly
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

    // 1. Get seen leads to exclude (Only dismissed ones)
    const { data: seenLeads } = await supabase
      .from('user_seen_leads')
      .select('lead_id')
      .eq('user_id', user.id)
      .eq('action', 'dismissed');

    const seenIds = seenLeads?.map((s: any) => s.lead_id) || [];

    // 2. Geographic & Niche Rotation
    const districts = getSearchDistricts(city);

    // Get current district rotation index
    const { data: rotation } = await supabase
      .from('district_rotation')
      .select('last_district_index, districts_searched')
      .eq('user_id', user.id)
      .eq('city_key', city.toLowerCase())
      .eq('category', query)
      .maybeSingle();

    const nextDistrictIndex = rotation
      ? (rotation.last_district_index + 1) % districts.length
      : 0;

    const searchDistrict = districts[nextDistrictIndex];

    // Pick business niche rotation
    const queryGroups = CATEGORY_QUERY_GROUPS[query] || (categoryNiches[query] ? [categoryNiches[query]] : CATEGORY_QUERY_GROUPS.web_dev);
    const nicheIndex = (await getNicheRotation(supabase, user.id, query)) % queryGroups.length;
    const selectedNiche = queryGroups[nicheIndex];
    const businessType = selectedNiche[Math.floor(Math.random() * selectedNiche.length)];

    // Update district rotation state
    await supabase.from('district_rotation').upsert({
      user_id: user.id,
      city_key: city.toLowerCase(),
      category: query,
      last_district_index: nextDistrictIndex,
      districts_searched: [...new Set([...(rotation?.districts_searched || []), searchDistrict])],
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,city_key,category' });

    // Update niche rotation index
    await supabase.from('district_rotation').upsert({
      user_id: user.id,
      city_key: 'niche_rotation',
      category: query,
      last_district_index: (nicheIndex + 1) % queryGroups.length,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,city_key,category' });

    console.log(`[search-leads] User ${user.id} rotating district: ${searchDistrict} (${nextDistrictIndex + 1}/${districts.length}), niche: ${businessType}`);

    // Prefill products if B2B
    let searchProduct = product;
    if (!searchProduct && profile?.supplier_profile) {
      const supProfile = profile.supplier_profile as any;
      if (supProfile.products) {
        searchProduct = Array.isArray(supProfile.products)
          ? supProfile.products.join(", ")
          : String(supProfile.products);
      }
    }

    let searchKeyword = businessType;
    if (niche) {
      searchKeyword = niche;
    }

    if (
      searchProduct &&
      ["african_food_export", "b2b_trade", "restaurant_supplier", "product_export"].includes(query)
    ) {
      searchKeyword = `${searchKeyword} ${searchProduct}`;
    }

    // 3. Smart Pagination and Query Database
    const fingerprint = await generateFingerprint({
      category: query,
      country,
      city,
      product: searchProduct || undefined,
      niche: niche || undefined
    });

    const state = await getPaginationState(supabase, user.id, fingerprint);

    // Main database query excluding dismissed seen leads
    let dbQuery = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('industry', query)
      .ilike('city', `%${city}%`)
      .eq('is_active', true);

    if (seenIds.length > 0) {
      dbQuery = dbQuery.not('id', 'in', `(${seenIds.join(',')})`);
    }

    const { data: dbLeads, count: totalAvailable } = await dbQuery
      .order('opportunity_score', { ascending: false })
      .range(state.current_offset, state.current_offset + limit - 1);

    let results = dbLeads || [];
    let totalPoolCount = totalAvailable || 0;

    // Wrap around pagination if end reached
    if (results.length < limit) {
      await supabase.from('search_pagination_state').upsert({
        user_id: user.id,
        search_fingerprint: fingerprint,
        current_offset: 0,
        last_search_at: new Date().toISOString()
      }, { onConflict: 'user_id,search_fingerprint' });

      let fallbackQuery = supabase
        .from('leads')
        .select('*')
        .eq('industry', query)
        .ilike('city', `%${city}%`)
        .eq('is_active', true);

      if (seenIds.length > 0) {
        fallbackQuery = fallbackQuery.not('id', 'in', `(${seenIds.join(',')})`);
      }

      const { data: wrappedLeads } = await fallbackQuery
        .order('created_at', { ascending: false })
        .limit(limit);

      if (wrappedLeads && wrappedLeads.length > 0) {
        const existingIds = new Set(results.map(r => r.id));
        const newLeads = wrappedLeads.filter(wl => !existingIds.has(wl.id));
        results = [...results, ...newLeads].slice(0, limit);
      }
    }

    // Helper function to call Apify scraping microservice
    async function scrapeLiveLeads(targetCity: string, targetCountry: string, targetDistrict: string, bType: string) {
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

      const apifyKeyword = `${bType} in ${targetDistrict}, ${targetCity}, ${targetCountry}`;
      console.log(`Invoking Apify scraper directly for "${apifyKeyword}"...`);

      try {
        const apifyToken = Deno.env.get("APIFY_API_KEY_LANCECONNECT");
        if (!apifyToken) {
          console.warn("APIFY_API_KEY_LANCECONNECT is not configured.");
          return [];
        }

        const apifyUrl = `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${apifyToken}`;
        
        const actorInput = {
          "searchString": apifyKeyword,
          "maxCrawledPlaces": 10,
          "proxyConfig": {
            "useApifyProxy": true
          }
        };

        const scrapeRes = await fetch(apifyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(actorInput),
          signal: AbortSignal.timeout(55000),
        });

        if (scrapeRes.ok) {
          const items = await scrapeRes.json();
          const newLeads = (items || []).map((item: any) => ({
            business_name: item.title || "",
            business_type: item.categoryName || bType,
            description: item.description || null,
            full_address: item.address || null,
            phone: item.phone || null,
            email: item.email || null,
            website_url: item.website || null,
            google_place_id: item.placeId || null,
            google_rating: item.totalScore || null,
            google_review_count: item.reviewsCount || 0,
            google_maps_url: item.url || null
          }));

          if (newLeads.length > 0) {
            const leadsToInsert = newLeads.map((item: any) => ({
              business_name: item.business_name,
              business_type: item.business_type || bType,
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

    // Silently expand if we have fewer than 6 leads
    const cityKey = city.toLowerCase().trim();
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
      atlanta: ["Marietta", "Alpharetta", "Decatur", "Sandy Springs", "Roswell", "Smyrna", "Athens"],
      miami: ["Fort Lauderdale", "Hollywood", "Pompano Beach", "West Palm Beach", "Hialeah"],
      chicago: ["Aurora", "Naperville", "Joliet", "Elgin", "Evanston", "Waukegan"],
      houston: ["The Woodlands", "Sugar Land", "Katy", "Pasadena", "Pearland"],
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
      "united states": ["New York", "Houston", "Chicago", "Seattle", "Miami", "Atlanta", "Los Angeles", "Boston", "Dallas", "San Francisco"],
      "usa": ["New York", "Houston", "Chicago", "Seattle", "Miami", "Atlanta", "Los Angeles", "Boston", "Dallas", "San Francisco"],
      "us": ["New York", "Houston", "Chicago", "Seattle", "Miami", "Atlanta", "Los Angeles", "Boston", "Dallas", "San Francisco"],
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

    const queryDatabase = async (targetCity: string, targetCountry: string, excludeIds: string[]) => {
      let qb = supabase
        .from("leads")
        .select("*")
        .eq("country", targetCountry)
        .ilike("city", targetCity)
        .eq("industry", query)
        .gt("cache_expires_at", new Date().toISOString());

      if (excludeIds.length > 0) {
        qb = qb.not("id", "in", `(${excludeIds.join(",")})`);
      }

      const { data, error } = await qb.limit(limit);
      if (error) {
        console.warn(`Cache query failed for ${targetCity}:`, error);
        return [];
      }
      return data || [];
    };

    if (results.length < 6) {
      console.log(`Fewer than 6 leads in target city (${results.length}). Performing silent geographic expansion...`);

      const metroCities = NEARBY_CITIES_MAP[cityKey] || [];
      for (const metroCity of metroCities) {
        if (results.length >= 6) break;
        const metroLeads = await queryDatabase(metroCity, country, seenIds);
        const newLeads = metroLeads.filter(ml => !results.some(r => r.id === ml.id));
        results = [...results, ...newLeads];
      }
    }

    if (results.length < 6) {
      const countryKey = country.toLowerCase().trim();
      const countryCities = COUNTRY_CITIES_MAP[countryKey] || [];
      const stateCities = countryCities.filter(c => c.toLowerCase().trim() !== cityKey && !(NEARBY_CITIES_MAP[cityKey] || []).includes(c));
      for (const stateCity of stateCities) {
        if (results.length >= 6) break;
        const stateLeads = await queryDatabase(stateCity, country, seenIds);
        const newLeads = stateLeads.filter(sl => !results.some(r => r.id === sl.id));
        results = [...results, ...newLeads];
      }
    }

    // If still fewer than 6, scrape target city district live
    if (results.length < 6) {
      console.log(`Cache query yielded fewer than 6 results (${results.length}). Scraping target city live...`);
      const scraped = await scrapeLiveLeads(city, country, searchDistrict, businessType);
      const unseenScraped = scraped.filter(l => !seenIds.includes(l.id) && !results.some(r => r.id === l.id));
      results = [...results, ...unseenScraped];
    }

    // Prioritize leads with complete contact information
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

    // Save returned leads to user_seen_leads as 'viewed' (System 3)
    if (finalLeads.length > 0) {
      const { error: seenUpsertError } = await supabase.from('user_seen_leads').upsert(
        finalLeads.map(lead => ({
          user_id: user.id,
          lead_id: lead.id,
          action: 'viewed',
          seen_at: new Date().toISOString()
        })),
        { onConflict: 'user_id,lead_id', ignoreDuplicates: true }
      );
      if (seenUpsertError) {
        console.warn("Failed to insert seen leads:", seenUpsertError);
      }
    }

    // Advance pagination offset
    await advancePaginationState(supabase, user.id, fingerprint, finalLeads.length, totalPoolCount);

    // 4. Relevance Intelligence Engine Reranking (System 6)
    const { data: prefs } = await supabase
      .from('user_lead_preferences')
      .select('preferred_business_types, preferred_score_range, total_interactions')
      .eq('user_id', user.id)
      .maybeSingle();

    let processedLeads = finalLeads;
    if (prefs && prefs.preferred_business_types?.length > 0) {
      const preferredLeads = finalLeads.filter(l =>
        prefs.preferred_business_types.includes(l.business_type)
      ) || [];
      const otherLeads = finalLeads.filter(l =>
        !prefs.preferred_business_types.includes(l.business_type)
      ) || [];
      processedLeads = [...preferredLeads, ...otherLeads];
    }

    // Trigger scoring for unscored leads
    for (const lead of processedLeads) {
      if (lead.opportunity_score === null || lead.opportunity_score === undefined) {
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

    // Insert Search History
    await supabase.from("search_history").insert({
      user_id: user.id,
      query_params: { query, city, country },
      results_count: processedLeads.length,
      leads_consumed: 1,
    });

    // Save Search Audit Log
    try {
      await supabase.from("audit_log").insert({
        user_id: user.id,
        action: "lead.searched",
        entity_type: "lead",
        metadata: { query, city, country, results_count: processedLeads.length },
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
        results_count: processedLeads.length,
        ip_country: ipCountry,
      });
    } catch (siErr) {
      console.warn("Failed to save search intelligence:", siErr);
    }

    // Set expansion warning message
    let expansionMessage: string | null = null;
    const targetCityLower = city.toLowerCase().trim();
    const otherCities = [...new Set(
      processedLeads
        .map(l => l.city)
        .filter((c): c is string => !!c && c.toLowerCase().trim() !== targetCityLower)
    )];

    if (otherCities.length > 0) {
      expansionMessage = `We've found all available leads in ${city} — here are additional results from nearby areas like ${otherCities.slice(0, 3).join(", ")}.`;
    }

    // Return smart response labels (System 7)
    return new Response(JSON.stringify({ 
      success: true, 
      leads: processedLeads,
      total_pool_count: totalPoolCount,
      expansion_message: expansionMessage,
      intelligence: {
        district_searched: searchDistrict,
        niche_searched: businessType,
        district_number: nextDistrictIndex + 1,
        total_districts: districts.length,
        leads_excluded: seenIds.length,
        personalized: (prefs?.total_interactions || 0) > 10
      },
      message: `Searching ${businessType} in ${searchDistrict}, ${city} (area ${nextDistrictIndex + 1} of ${districts.length})`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleError(error);
  }
});
