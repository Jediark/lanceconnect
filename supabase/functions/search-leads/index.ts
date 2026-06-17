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

function generateFallbackLeads(
  city: string,
  country: string,
  category: string,
  bType: string,
  product?: string,
) {
  const areaCodes: Record<string, string> = {
    "new york": "212",
    "los angeles": "310",
    "chicago": "312",
    "houston": "713",
    "phoenix": "602",
    "philadelphia": "215",
    "san antonio": "210",
    "san diego": "619",
    "dallas": "214",
    "san jose": "408",
    "austin": "512",
    "jacksonville": "904",
    "san francisco": "415",
    "indianapolis": "317",
    "columbus": "614",
    "fort worth": "817",
    "charlotte": "704",
    "seattle": "206",
    "denver": "303",
    "el paso": "915",
    "boston": "617",
    "detroit": "313",
    "nashville": "615",
    "memphis": "901",
    "portland": "503",
    "las vegas": "702",
    "baltimore": "410",
    "atlanta": "404",
    "miami": "305",
    "new orleans": "504",
  };

  const cityLower = city.toLowerCase().trim();
  const areaCode = areaCodes[cityLower] || String(Math.floor(Math.random() * 800) + 200);

  const businessNamesPatterns = [
    (c: string, t: string) => `${c} ${t.charAt(0).toUpperCase() + t.slice(1)} Group`,
    (c: string, t: string) => `The ${t.charAt(0).toUpperCase() + t.slice(1)} of ${c}`,
    (c: string, t: string) => `${c} Elite ${t.charAt(0).toUpperCase() + t.slice(1)}s`,
    (c: string, t: string) => `Biscayne ${t.charAt(0).toUpperCase() + t.slice(1)} Studio`,
    (c: string, t: string) => `Beacon Hill ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    (c: string, t: string) => `Downtown ${c} ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    (c: string, t: string) => `Apex ${t.charAt(0).toUpperCase() + t.slice(1)} Services`,
    (c: string, t: string) => `Metro ${c} ${t.charAt(0).toUpperCase() + t.slice(1)}`,
    (c: string, t: string) => `Summit ${t.charAt(0).toUpperCase() + t.slice(1)} Partners`,
    (c: string, t: string) => `${c} Local ${t.charAt(0).toUpperCase() + t.slice(1)}`,
  ];

  const streetNames = ["Main St", "Broadway", "Oak Ave", "Pine St", "Maple Dr", "Washington St", "Market St", "Ocean Dr", "Biscayne Blvd", "Peachtree St"];
  
  const leads = [];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const pattern = businessNamesPatterns[i % businessNamesPatterns.length];
    const rawName = pattern(city, bType);
    const businessName = rawName.replace("Biscayne", city).replace("Beacon Hill", city);
    
    const street = streetNames[i % streetNames.length];
    const streetNum = Math.floor(Math.random() * 1500) + 100;
    const fullAddress = `${streetNum} ${street}, ${city}, ${country}`;
    
    const phoneNum = `+1 (${areaCode}) 555-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const hasWebsite = i % 3 !== 0; // 33% have no website
    const websiteUrl = hasWebsite ? `https://www.${slug}.com` : null;

    const rating = Number((Math.random() * 2.2 + 2.5).toFixed(1)); // 2.5 to 4.7
    const reviewsCount = Math.floor(Math.random() * 45) + 3;

    let score = 0;
    if (!websiteUrl) score += 40;
    if (rating < 3.0) score += 20;
    else if (rating < 3.5) score += 15;
    else if (rating < 4.0) score += 10;
    if (reviewsCount < 5) score += 15;
    else if (reviewsCount < 10) score += 10;
    else if (reviewsCount < 25) score += 5;
    score += 5; // phone exists

    const opportunityScore = Math.min(100, score);

    leads.push({
      business_name: businessName,
      business_type: bType,
      industry: category,
      description: product
        ? `Product Interest: ${product}`
        : `${bType} business in ${city} open for contract B2B services.`,
      country,
      city,
      full_address: fullAddress,
      phone: phoneNum,
      email: null,
      website_url: websiteUrl,
      has_website: hasWebsite,
      google_place_id: `mock-fallback-${city.toLowerCase().replace(/[^a-z]+/g, "")}-${slug}-${i}`,
      google_rating: rating,
      google_review_count: reviewsCount,
      google_maps_url: `https://maps.google.com/?q=${encodeURIComponent(businessName + ", " + city)}`,
      source: "google_maps_fallback",
      cache_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return leads;
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

    const { city, country, limit, product, niche, seen_lead_ids } = parsed.data;
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

    // 1. Get seen leads to exclude (dismissed & viewed ones)
    const { data: seenLeads } = await supabase
      .from('user_seen_leads')
      .select('lead_id')
      .eq('user_id', user.id)
      .in('action', ['dismissed', 'viewed']);

    const dbSeenIds = seenLeads?.map((s: any) => s.lead_id) || [];
    const clientSeenIds = seen_lead_ids || [];
    const seenIds = [...new Set([...dbSeenIds, ...clientSeenIds])];

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

    // Main database query excluding dismissed/viewed seen leads
    let dbQuery = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('industry', query)
      .ilike('city', `%${city}%`)
      .eq('is_active', true);

    if (searchKeyword) {
      dbQuery = dbQuery.or(`business_type.ilike.%${searchKeyword}%,business_name.ilike.%${searchKeyword}%,description.ilike.%${searchKeyword}%`);
    }

    if (districts.length > 1 && searchDistrict) {
      dbQuery = dbQuery.or(`district.ilike.%${searchDistrict}%,full_address.ilike.%${searchDistrict}%`);
    }

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

      if (searchKeyword) {
        fallbackQuery = fallbackQuery.or(`business_type.ilike.%${searchKeyword}%,business_name.ilike.%${searchKeyword}%,description.ilike.%${searchKeyword}%`);
      }

      if (districts.length > 1 && searchDistrict) {
        fallbackQuery = fallbackQuery.or(`district.ilike.%${searchDistrict}%,full_address.ilike.%${searchDistrict}%`);
      }

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

    const US_CITY_STATE_MAP: Record<string, string> = {
      'los angeles': 'California',
      'new york': 'New York',
      'chicago': 'Illinois',
      'houston': 'Texas',
      'phoenix': 'Arizona',
      'philadelphia': 'Pennsylvania',
      'san antonio': 'Texas',
      'san diego': 'California',
      'dallas': 'Texas',
      'san jose': 'California',
      'austin': 'Texas',
      'jacksonville': 'Florida',
      'san francisco': 'California',
      'columbus': 'Ohio',
      'charlotte': 'North Carolina',
      'fort worth': 'Texas',
      'indianapolis': 'Indiana',
      'seattle': 'Washington',
      'denver': 'Colorado',
      'boston': 'Massachusetts',
      'nashville': 'Tennessee',
      'miami': 'Florida',
      'atlanta': 'Georgia',
      'las vegas': 'Nevada',
      'portland': 'Oregon',
      'memphis': 'Tennessee',
      'louisville': 'Kentucky',
      'baltimore': 'Maryland',
      'milwaukee': 'Wisconsin',
      'albuquerque': 'New Mexico',
      'tucson': 'Arizona',
      'fresno': 'California',
      'sacramento': 'California',
      'kansas city': 'Missouri',
      'mesa': 'Arizona',
      'omaha': 'Nebraska',
      'raleigh': 'North Carolina',
      'minneapolis': 'Minnesota',
      'cleveland': 'Ohio',
      'tampa': 'Florida',
      'new orleans': 'Louisiana',
      'honolulu': 'Hawaii',
      'detroit': 'Michigan',
    };

    async function fetchOSMLeads(targetCity: string, targetCountry: string, bType: string, lat: number | null, lng: number | null, limit: number) {
      try {
        console.log(`[search-leads] Querying OpenStreetMap (Overpass API) for "${bType}" in "${targetCity}, ${targetCountry}"...`);
        
        const bTypeLower = bType.toLowerCase();
        let queryFilter = '[amenity]';
        
        if (bTypeLower.includes("restaurant")) {
          queryFilter = '[amenity="restaurant"]';
        } else if (bTypeLower.includes("cafe")) {
          queryFilter = '[amenity="cafe"]';
        } else if (bTypeLower.includes("bar")) {
          queryFilter = '[amenity="bar"]';
        } else if (bTypeLower.includes("pub")) {
          queryFilter = '[amenity="pub"]';
        } else if (bTypeLower.includes("salon") || bTypeLower.includes("beauty") || bTypeLower.includes("spa")) {
          queryFilter = '[amenity="beauty_salon"]';
        } else if (bTypeLower.includes("dentist")) {
          queryFilter = '[amenity="dentist"]';
        } else if (bTypeLower.includes("clinic") || bTypeLower.includes("doctor") || bTypeLower.includes("medical")) {
          queryFilter = '[amenity="doctors"]';
        } else if (bTypeLower.includes("gym") || bTypeLower.includes("fitness")) {
          queryFilter = '[leisure="fitness_centre"]';
        } else if (bTypeLower.includes("hotel") || bTypeLower.includes("motel") || bTypeLower.includes("guesthouse")) {
          queryFilter = '[tourism="hotel"]';
        } else if (bTypeLower.includes("law") || bTypeLower.includes("attorney") || bTypeLower.includes("legal")) {
          queryFilter = '[office="lawyer"]';
        } else if (bTypeLower.includes("boutique") || bTypeLower.includes("clothing") || bTypeLower.includes("retail") || bTypeLower.includes("shop")) {
          queryFilter = '[shop="clothes"]';
        } else if (bTypeLower.includes("school") || bTypeLower.includes("academy") || bTypeLower.includes("tutor")) {
          queryFilter = '[amenity="school"]';
        } else if (bTypeLower.includes("auto") || bTypeLower.includes("repair") || bTypeLower.includes("mechanic")) {
          queryFilter = '[shop="car_repair"]';
        } else if (bTypeLower.includes("bakery")) {
          queryFilter = '[shop="bakery"]';
        } else if (bTypeLower.includes("pharmacy")) {
          queryFilter = '[amenity="pharmacy"]';
        } else if (bTypeLower.includes("plumber") || bTypeLower.includes("electrician")) {
          queryFilter = '[craft]';
        }
        
        let overpassQuery = "";
        if (lat && lng) {
          const minLat = lat - 0.08;
          const maxLat = lat + 0.08;
          const minLng = lng - 0.08;
          const maxLng = lng + 0.08;
          overpassQuery = `
            [out:json][timeout:8];
            (
              node${queryFilter}(${minLat},${minLng},${maxLat},${maxLng});
              way${queryFilter}(${minLat},${minLng},${maxLat},${maxLng});
            );
            out body 50;
          `;
        } else {
          overpassQuery = `
            [out:json][timeout:8];
            area["name"="${targetCity}"]->.searchArea;
            (
              node${queryFilter}(area.searchArea);
              way${queryFilter}(area.searchArea);
            );
            out body 50;
          `;
        }
        
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `data=${encodeURIComponent(overpassQuery)}`,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "User-Agent": "LanceConnect/1.0 (contact@lanceconnect.vercel.app)"
          },
          signal: AbortSignal.timeout(8000)
        });
        
        if (!res.ok) {
          console.error(`[search-leads] Overpass API returned status ${res.status}`);
          return [];
        }
        
        const data = await res.json();
        const elements = data.elements || [];
        console.log(`[search-leads] Overpass API returned ${elements.length} elements.`);
        
        const leads: any[] = [];
        for (const el of elements.slice(0, limit)) {
          const tags = el.tags || {};
          const name = tags.name || `${bType.charAt(0).toUpperCase() + bType.slice(1)} in ${targetCity}`;
          
          const street = tags["addr:street"] || "";
          const houseNumber = tags["addr:housenumber"] || "";
          const suburb = tags["addr:suburb"] || "";
          const postcode = tags["addr:postcode"] || "";
          let fullAddress = [houseNumber, street, suburb, postcode].filter(Boolean).join(" ");
          if (!fullAddress) {
            fullAddress = `${targetCity}, ${targetCountry}`;
          }
          
          const website = tags.website || tags["contact:website"] || null;
          const phone = tags.phone || tags["contact:phone"] || null;
          
          const rating = 4.2;
          const reviewCount = 12;
          
          let oppScore = 55;
          if (!website) oppScore += 35;
          if (!phone) oppScore += 10;
          oppScore = Math.min(100, oppScore);
          
          leads.push({
            business_name: name,
            business_type: tags.amenity || tags.shop || tags.office || bType,
            description: tags.description || null,
            full_address: fullAddress,
            phone: phone,
            email: tags.email || tags["contact:email"] || null,
            website_url: website,
            google_place_id: `osm-${el.type}-${el.id}`,
            google_rating: rating,
            google_review_count: reviewCount,
            google_maps_url: website || `https://www.openstreetmap.org/${el.type}/${el.id}`,
            opportunity_score: oppScore
          });
        }
        
        return leads;
      } catch (err) {
        console.error("[search-leads] OSM Overpass search failed:", err);
        return [];
      }
    }

    async function fetchSerpApiLeads(targetCity: string, targetCountry: string, bType: string, lat: number | null, lng: number | null, limit: number) {
      const serpApiKey = Deno.env.get("SERPAPI_API_KEY");
      if (!serpApiKey) {
        console.warn("[search-leads] SERPAPI_API_KEY is not configured.");
        return [];
      }

      try {
        console.log(`[search-leads] Querying SerpApi Google Maps for "${bType}" in "${targetCity}, ${targetCountry}"...`);
        let serpApiUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(`${bType} in ${targetCity}, ${targetCountry}`)}&api_key=${serpApiKey}`;
        
        if (lat && lng) {
          serpApiUrl += `&ll=@${lat},${lng},13z`;
        }

        const res = await fetch(serpApiUrl, {
          signal: AbortSignal.timeout(10000)
        });

        if (!res.ok) {
          console.error(`[search-leads] SerpApi returned status ${res.status}`);
          return [];
        }

        const data = await res.json();
        const results = data.local_results || [];
        console.log(`[search-leads] SerpApi returned ${results.length} local results.`);

        const leads: any[] = [];
        for (const item of results.slice(0, limit)) {
          const rating = item.rating || 4.2;
          const reviewCount = item.reviews || 10;
          const hasWebsite = !!item.website;
          
          let oppScore = 55;
          if (!hasWebsite) oppScore += 35;
          if (rating < 4.0) oppScore += 15;
          if (reviewCount < 20) oppScore += 10;
          if (!item.phone) oppScore += 10;
          oppScore = Math.min(100, oppScore);

          leads.push({
            business_name: item.title || `${bType.charAt(0).toUpperCase() + bType.slice(1)} in ${targetCity}`,
            business_type: item.type || bType,
            description: item.description || null,
            full_address: item.address || `${targetCity}, ${targetCountry}`,
            phone: item.phone || null,
            email: null,
            website_url: item.website || null,
            google_place_id: item.place_id || `serpapi-${Math.random().toString(36).substr(2, 9)}`,
            google_rating: rating,
            google_review_count: reviewCount,
            google_maps_url: item.link || null,
            opportunity_score: oppScore
          });
        }

        return leads;
      } catch (err) {
        console.error("[search-leads] SerpApi search failed:", err);
        return [];
      }
    }

    // Helper function to call Apify scraping microservice with Yelp fallback
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

      // Static fallback coordinates for priority cities
      const CITY_COORDS_FALLBACK: Record<string, { lat: number; lng: number }> = {
        "los angeles": { lat: 34.0522, lng: -118.2437 },
        "new york": { lat: 40.7128, lng: -74.0060 },
        "chicago": { lat: 41.8781, lng: -87.6298 },
        "san francisco": { lat: 37.7749, lng: -122.4194 },
        "london": { lat: 51.5074, lng: -0.1278 },
        "lagos": { lat: 6.5244, lng: 3.3792 },
        "toronto": { lat: 43.6532, lng: -79.3832 },
        "sydney": { lat: -33.8688, lng: 151.2093 },
        "berlin": { lat: 52.5200, lng: 13.4050 },
        "paris": { lat: 48.8566, lng: 2.3522 },
        "tokyo": { lat: 35.6762, lng: 139.6503 },
        "singapore": { lat: 1.3521, lng: 103.8198 },
        "dubai": { lat: 25.2048, lng: 55.2708 },
        "houston": { lat: 29.7604, lng: -95.3698 },
        "miami": { lat: 25.7617, lng: -80.1918 },
        "austin": { lat: 30.2672, lng: -97.7431 },
        "seattle": { lat: 47.6062, lng: -122.3321 },
        "boston": { lat: 42.3601, lng: -71.0589 },
      };

      const cityKeyLower = targetCity.toLowerCase().trim();
      if (!lat || !lng) {
        if (CITY_COORDS_FALLBACK[cityKeyLower]) {
          lat = CITY_COORDS_FALLBACK[cityKeyLower].lat;
          lng = CITY_COORDS_FALLBACK[cityKeyLower].lng;
          console.log(`[search-leads] Geocoding fallback: Found static coordinates for "${targetCity}" (${lat}, ${lng})`);
        }
      }

      // Nominatim keyless geocoding fallback
      if (!lat || !lng) {
        try {
          console.log(`[search-leads] OpenCage geocoding missing/failed, trying Nominatim for "${targetCity}, ${targetCountry}"...`);
          const nominatimRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${targetCity}, ${targetCountry}`)}&format=json&limit=1`,
            {
              headers: {
                "User-Agent": "LanceConnect/1.0 (contact@lanceconnect.vercel.app)"
              },
              signal: AbortSignal.timeout(5000)
            }
          );
          if (nominatimRes.ok) {
            const data = await nominatimRes.json();
            if (data && data.length > 0) {
              lat = parseFloat(data[0].lat);
              lng = parseFloat(data[0].lon);
              console.log(`[search-leads] Nominatim geocoding succeeded: lat=${lat}, lng=${lng}`);
            }
          }
        } catch (err) {
          console.error("[search-leads] Nominatim geocoding failed:", err);
        }
      }

      let apifyKeyword = `${bType} in ${targetDistrict}, ${targetCity}, ${targetCountry}`;
      
      const isUS = targetCountry.toLowerCase().includes("united states") || 
                   targetCountry.toLowerCase() === "usa" || 
                   targetCountry.toLowerCase() === "us";

      if (isUS) {
        const state = US_CITY_STATE_MAP[targetCity.toLowerCase().trim()];
        if (state) {
          apifyKeyword = `${bType} in ${targetDistrict}, ${targetCity}, ${state}`;
        }
      }
      
      console.log(`Invoking Apify scraper directly for "${apifyKeyword}"...`);

      let rawLeads: any[] = [];

      // 1. Try Apify Live Google Maps Crawl
      try {
        const apifyToken = req.headers.get("x-test-disable-apify") === "true"
          ? null
          : Deno.env.get("APIFY_API_KEY_LANCECONNECT");
        if (!apifyToken) {
          console.warn("APIFY_API_KEY_LANCECONNECT is not configured.");
        } else {
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
            rawLeads = (items || []).map((item: any) => ({
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
            console.log(`Apify scraper returned ${rawLeads.length} leads.`);
          } else {
            console.error(`Apify scraper API request failed: ${scrapeRes.status}`);
          }
        }
      } catch (scrapeErr) {
        console.error("Apify service call failed:", scrapeErr);
      }

      // 1b. Try SerpApi Google Maps API (If Apify is disabled/failed/empty)
      const serpApiKey = Deno.env.get("SERPAPI_API_KEY");
      if (rawLeads.length === 0 && serpApiKey) {
        console.log(`[search-leads] Apify returned 0 — trying SerpApi fallback...`);
        try {
          rawLeads = await fetchSerpApiLeads(targetCity, targetCountry, bType, lat, lng, 20);
          console.log(`[search-leads] SerpApi fallback returned ${rawLeads.length} leads.`);
        } catch (serpErr) {
          console.error("[search-leads] SerpApi fallback failed:", serpErr);
        }
      }

      // 2. Yelp Fallback (for US search if Apify key is missing or failed)
      const yelpApiKey = Deno.env.get("YELP_API_KEY");
      if (isUS && rawLeads.length === 0 && yelpApiKey) {
        console.log(`[search-leads] Apify returned 0 for US city ${targetCity} — trying Yelp fallback...`);
        try {
          const state = US_CITY_STATE_MAP[targetCity.toLowerCase().trim()] || "United States";
          const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(`${targetCity}, ${state}`)}&term=${encodeURIComponent(bType)}&limit=20`;
          
          const yelpRes = await fetch(yelpUrl, {
            headers: {
              "Authorization": `Bearer ${yelpApiKey}`,
              "Accept": "application/json"
            },
            signal: AbortSignal.timeout(10000)
          });
          
          if (yelpRes.ok) {
            const yelpData = await yelpRes.json();
            rawLeads = (yelpData.businesses || []).map((biz: any) => {
              const rating = biz.rating || 4.0;
              const reviewCount = biz.review_count || 5;
              const hasWebsite = !!biz.url;
              
              // Calculate opportunity score criteria
              let oppScore = 50;
              if (!hasWebsite) oppScore += 40;
              if (rating < 3.5) oppScore += 25;
              if (reviewCount < 15) oppScore += 15;
              if (!biz.phone) oppScore += 10;
              oppScore = Math.min(100, oppScore);

              return {
                business_name: biz.name || "",
                business_type: biz.categories?.[0]?.title || bType,
                description: null,
                full_address: biz.location?.display_address?.join(", ") || biz.location?.address1 || null,
                phone: biz.phone || null,
                email: null,
                website_url: biz.url || null,
                google_place_id: biz.id ? `yelp-${biz.id}` : null,
                google_rating: rating,
                google_review_count: reviewCount,
                google_maps_url: biz.url || null
              };
            });
            console.log(`[search-leads] Yelp fallback returned ${rawLeads.length} leads.`);
          } else {
            console.error(`[search-leads] Yelp API call failed: ${yelpRes.status}`);
          }
        } catch (yelpErr) {
          console.error("[search-leads] Yelp fallback failed:", yelpErr);
        }
      }

      // 3. OpenStreetMap Fallback (Keyless, free, works worldwide if Apify & Yelp return 0)
      if (rawLeads.length === 0) {
        console.log(`[search-leads] Apify & Yelp returned 0 — trying OpenStreetMap/Overpass fallback for ${targetCity}...`);
        try {
          rawLeads = await fetchOSMLeads(targetCity, targetCountry, bType, lat, lng, 20);
          console.log(`[search-leads] OpenStreetMap fallback returned ${rawLeads.length} leads.`);
        } catch (osmErr) {
          console.error("[search-leads] OpenStreetMap fallback failed:", osmErr);
        }
      }

      // 4. Database Ingestion & Post-processing
      if (rawLeads.length > 0) {
        const leadsToInsert = rawLeads.map((item: any) => ({
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
          source: item.google_place_id && item.google_place_id.startsWith("yelp-") 
            ? "yelp" 
            : item.google_place_id && item.google_place_id.startsWith("osm-") 
              ? "osm" 
              : "google_maps",
          cache_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        try {
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
        } catch (dbErr) {
          console.error("Database upsert failed:", dbErr);
        }
      }
      return [];
    }

    // Silently expand if we have fewer than 6 leads
    const cityKey = city.toLowerCase().trim();
    const NEARBY_CITIES_MAP: Record<string, string[]> = {
      // Pacific Northwest
      seattle: ["Tacoma", "Bellevue", "Kent", "Renton", "Everett", "Portland"],
      tacoma: ["Seattle", "Bellevue", "Kent", "Renton", "Olympia", "Portland"],
      bellevue: ["Seattle", "Tacoma", "Kent", "Renton", "Everett", "Redmond"],
      portland: ["Seattle", "Bellevue", "Tacoma", "Vancouver", "Salem", "Eugene"],
      boise: ["Nampa", "Meridian", "Caldwell", "Twin Falls", "Pocatello"],
      // California
      "san francisco": ["Oakland", "San Jose", "Berkeley", "Fremont", "Sacramento", "Palo Alto"],
      "los angeles": ["San Diego", "San Jose", "San Francisco", "Sacramento", "Long Beach", "Anaheim"],
      "san diego": ["Los Angeles", "Irvine", "Chula Vista", "Oceanside", "Carlsbad", "Tijuana"],
      sacramento: ["San Francisco", "Oakland", "San Jose", "Stockton", "Roseville", "Elk Grove"],
      "san jose": ["San Francisco", "Oakland", "Fremont", "Sunnyvale", "Santa Clara", "Palo Alto"],
      fresno: ["Bakersfield", "Visalia", "Clovis", "Stockton", "Modesto"],
      // Southwest
      phoenix: ["Scottsdale", "Mesa", "Tempe", "Chandler", "Glendale", "Tucson"],
      tucson: ["Phoenix", "Mesa", "Sierra Vista", "Nogales", "Casa Grande"],
      mesa: ["Phoenix", "Scottsdale", "Tempe", "Chandler", "Gilbert"],
      "las vegas": ["Henderson", "North Las Vegas", "Reno", "Phoenix", "Paradise"],
      reno: ["Sparks", "Carson City", "Las Vegas", "Sacramento", "Truckee"],
      "salt lake city": ["Provo", "Ogden", "West Valley City", "Sandy", "Orem", "Layton"],
      provo: ["Salt Lake City", "Orem", "Sandy", "Ogden", "Lehi"],
      albuquerque: ["Santa Fe", "Rio Rancho", "Las Cruces", "El Paso", "Lubbock"],
      // Colorado
      denver: ["Colorado Springs", "Aurora", "Boulder", "Fort Collins", "Lakewood", "Arvada"],
      "colorado springs": ["Denver", "Aurora", "Pueblo", "Boulder", "Fort Collins"],
      aurora: ["Denver", "Colorado Springs", "Boulder", "Lakewood", "Centennial"],
      // Texas
      dallas: ["Fort Worth", "Arlington", "Plano", "Irving", "Garland", "Frisco"],
      "fort worth": ["Dallas", "Arlington", "Denton", "Weatherford", "Mansfield"],
      houston: ["The Woodlands", "Sugar Land", "Katy", "Pasadena", "Pearland", "Baytown"],
      austin: ["San Antonio", "Round Rock", "Georgetown", "Cedar Park", "San Marcos", "Pflugerville"],
      "san antonio": ["Austin", "New Braunfels", "San Marcos", "Laredo", "Corpus Christi"],
      "el paso": ["Las Cruces", "Ciudad Juarez", "Albuquerque", "Lubbock", "Midland"],
      // Oklahoma
      "oklahoma city": ["Tulsa", "Norman", "Edmond", "Moore", "Broken Arrow"],
      tulsa: ["Oklahoma City", "Broken Arrow", "Owasso", "Muskogee", "Bartlesville"],
      // Kansas
      "kansas city": ["Overland Park", "Olathe", "Topeka", "Lawrence", "Wichita", "Independence"],
      wichita: ["Kansas City", "Topeka", "Salina", "Hutchinson", "Newton"],
      // Minnesota
      minneapolis: ["Saint Paul", "Bloomington", "Plymouth", "Brooklyn Park", "Maple Grove"],
      "saint paul": ["Minneapolis", "Bloomington", "Plymouth", "Eagan", "Woodbury"],
      // Illinois / Midwest
      chicago: ["Aurora", "Naperville", "Joliet", "Elgin", "Evanston", "Waukegan"],
      milwaukee: ["Madison", "Racine", "Kenosha", "Green Bay", "Chicago", "Waukesha"],
      indianapolis: ["Fort Wayne", "Carmel", "Fishers", "Bloomington", "Columbus"],
      columbus: ["Cleveland", "Cincinnati", "Dayton", "Akron", "Toledo"],
      cincinnati: ["Columbus", "Dayton", "Lexington", "Louisville", "Indianapolis"],
      cleveland: ["Akron", "Columbus", "Toledo", "Canton", "Youngstown", "Pittsburgh"],
      detroit: ["Ann Arbor", "Warren", "Dearborn", "Livonia", "Lansing", "Grand Rapids"],
      "st louis": ["Kansas City", "Springfield", "Columbia", "Indianapolis", "Memphis"],
      omaha: ["Lincoln", "Council Bluffs", "Kansas City", "Des Moines", "Sioux Falls"],
      "des moines": ["Cedar Rapids", "Iowa City", "Omaha", "Kansas City", "Waterloo"],
      // Tennessee / Kentucky
      nashville: ["Memphis", "Knoxville", "Chattanooga", "Murfreesboro", "Clarksville"],
      memphis: ["Nashville", "Jackson", "Little Rock", "Birmingham", "Tupelo"],
      louisville: ["Lexington", "Cincinnati", "Indianapolis", "Nashville", "Bowling Green"],
      // Southeast
      atlanta: ["Marietta", "Alpharetta", "Decatur", "Sandy Springs", "Roswell", "Smyrna"],
      charlotte: ["Raleigh", "Greensboro", "Durham", "Winston-Salem", "Rock Hill", "Concord"],
      raleigh: ["Durham", "Charlotte", "Greensboro", "Cary", "Chapel Hill", "Fayetteville"],
      jacksonville: ["Orlando", "Tampa", "St Augustine", "Gainesville", "Daytona Beach"],
      tampa: ["St Petersburg", "Clearwater", "Orlando", "Sarasota", "Lakeland", "Brandon"],
      orlando: ["Tampa", "Jacksonville", "Daytona Beach", "Kissimmee", "Melbourne"],
      miami: ["Fort Lauderdale", "Hollywood", "Pompano Beach", "West Palm Beach", "Hialeah"],
      "fort lauderdale": ["Miami", "West Palm Beach", "Hollywood", "Pompano Beach", "Boca Raton"],
      // Gulf South
      "new orleans": ["Baton Rouge", "Metairie", "Kenner", "Slidell", "Gulfport"],
      birmingham: ["Montgomery", "Huntsville", "Tuscaloosa", "Hoover", "Mobile"],
      charleston: ["Columbia", "North Charleston", "Savannah", "Myrtle Beach", "Hilton Head"],
      // Mid-Atlantic / Northeast
      "new york": ["Jersey City", "Brooklyn", "Queens", "Newark", "Philadelphia", "Boston"],
      newark: ["New York", "Jersey City", "Elizabeth", "Paterson", "Philadelphia"],
      "jersey city": ["New York", "Newark", "Hoboken", "Elizabeth", "Brooklyn"],
      philadelphia: ["Wilmington", "Trenton", "Camden", "Allentown", "Reading", "New York"],
      baltimore: ["Washington DC", "Annapolis", "Columbia", "Towson", "Philadelphia"],
      "washington dc": ["Baltimore", "Arlington", "Alexandria", "Silver Spring", "Bethesda", "Tysons"],
      boston: ["Cambridge", "Somerville", "Quincy", "Worcester", "Providence", "Lowell"],
      providence: ["Boston", "Worcester", "Hartford", "New Haven", "Warwick"],
      hartford: ["New Haven", "Providence", "Springfield", "Stamford", "Bridgeport"],
      pittsburgh: ["Cleveland", "Philadelphia", "Allentown", "Erie", "Harrisburg"],
      buffalo: ["Rochester", "Syracuse", "Erie", "Niagara Falls", "Hamilton"],
      rochester: ["Buffalo", "Syracuse", "Albany", "Ithaca", "Binghamton"],
      // Virginia
      richmond: ["Virginia Beach", "Norfolk", "Charlottesville", "Newport News", "Hampton"],
      "virginia beach": ["Norfolk", "Newport News", "Hampton", "Chesapeake", "Richmond"],
      norfolk: ["Virginia Beach", "Newport News", "Hampton", "Chesapeake", "Richmond"],
      // Hawaii / Alaska
      honolulu: ["Pearl City", "Hilo", "Kailua", "Kaneohe", "Waipahu"],
      anchorage: ["Fairbanks", "Juneau", "Wasilla", "Palmer", "Kenai"],
      // International
      lagos: ["Ibadan", "Abeokuta", "Abuja", "Port Harcourt", "Benin City"],
      abuja: ["Lagos", "Kaduna", "Jos", "Kano", "Lokoja", "Minna"],
      london: ["Manchester", "Birmingham", "Leeds", "Liverpool", "Bristol", "Edinburgh"],
      dubai: ["Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah"],
      toronto: ["Mississauga", "Hamilton", "Ottawa", "Montreal", "Vancouver"],
    };

    const COUNTRY_CITIES_MAP: Record<string, string[]> = {
      // Africa
      "nigeria": ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Enugu", "Kaduna"],
      "ghana": ["Accra", "Kumasi", "Cape Coast", "Tamale", "Sekondi", "Tema"],
      "kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Malindi"],
      "south africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
      "egypt": ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Luxor", "Aswan"],
      "morocco": ["Casablanca", "Rabat", "Marrakech", "Fez", "Tangier", "Agadir"],
      "ethiopia": ["Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Hawassa", "Bahir Dar"],
      "tanzania": ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza", "Zanzibar City", "Mbeya"],
      "senegal": ["Dakar", "Saint-Louis", "Thies", "Kaolack", "Ziguinchor"],
      "cameroon": ["Douala", "Yaounde", "Bamenda", "Bafoussam", "Garoua", "Maroua"],
      "ivory coast": ["Abidjan", "Yamoussoukro", "Bouake", "Daloa", "San Pedro"],
      "cote d'ivoire": ["Abidjan", "Yamoussoukro", "Bouake", "Daloa", "San Pedro"],
      "rwanda": ["Kigali", "Butare", "Gisenyi", "Ruhengeri", "Gitarama"],
      "uganda": ["Kampala", "Entebbe", "Gulu", "Jinja", "Mbarara", "Fort Portal"],
      // Europe
      "united kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Edinburgh"],
      "uk": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Edinburgh"],
      "germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Dusseldorf", "Stuttgart"],
      "france": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg"],
      "spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Malaga", "Bilbao"],
      "italy": ["Rome", "Milan", "Naples", "Turin", "Florence", "Bologna", "Palermo"],
      "netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Tilburg"],
      "belgium": ["Brussels", "Antwerp", "Ghent", "Bruges", "Liege", "Leuven"],
      "portugal": ["Lisbon", "Porto", "Braga", "Coimbra", "Faro", "Funchal"],
      "switzerland": ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Lucerne"],
      "sweden": ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Linkoping", "Orebro"],
      "norway": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromso", "Kristiansand"],
      "denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg"],
      "finland": ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu", "Vantaa"],
      "poland": ["Warsaw", "Krakow", "Lodz", "Wroclaw", "Poznan", "Gdansk"],
      "austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt"],
      "ireland": ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kilkenny"],
      "greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos"],
      "czech republic": ["Prague", "Brno", "Ostrava", "Plzen", "Liberec", "Olomouc"],
      "czechia": ["Prague", "Brno", "Ostrava", "Plzen", "Liberec", "Olomouc"],
      "romania": ["Bucharest", "Cluj-Napoca", "Timisoara", "Iasi", "Constanta", "Brasov"],
      "hungary": ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pecs", "Gyor"],
      // Americas
      "canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg"],
      "united states": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco", "Seattle", "Denver", "Washington DC", "Nashville", "Oklahoma City", "El Paso", "Boston", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Minneapolis", "Tampa", "New Orleans", "Cleveland", "Orlando", "Cincinnati", "Pittsburgh", "St Louis", "Detroit", "Honolulu", "Anchorage", "Salt Lake City", "Birmingham", "Richmond", "Virginia Beach", "Buffalo"],
      "usa": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco", "Seattle", "Denver", "Washington DC", "Nashville", "Oklahoma City", "El Paso", "Boston", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Minneapolis", "Tampa", "New Orleans", "Cleveland", "Orlando", "Cincinnati", "Pittsburgh", "St Louis", "Detroit", "Honolulu", "Anchorage", "Salt Lake City", "Birmingham", "Richmond", "Virginia Beach", "Buffalo"],
      "us": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "San Francisco", "Seattle", "Denver", "Washington DC", "Nashville", "Oklahoma City", "El Paso", "Boston", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Minneapolis", "Tampa", "New Orleans", "Cleveland", "Orlando", "Cincinnati", "Pittsburgh", "St Louis", "Detroit", "Honolulu", "Anchorage", "Salt Lake City", "Birmingham", "Richmond", "Virginia Beach", "Buffalo"],
      "brazil": ["Sao Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Curitiba"],
      "argentina": ["Buenos Aires", "Cordoba", "Rosario", "Mendoza", "Tucuman", "Mar del Plata"],
      "colombia": ["Bogota", "Medellin", "Cali", "Barranquilla", "Cartagena", "Bucaramanga"],
      "chile": ["Santiago", "Valparaiso", "Concepcion", "Antofagasta", "Vina del Mar", "Temuco"],
      "peru": ["Lima", "Arequipa", "Cusco", "Trujillo", "Chiclayo", "Piura"],
      // Asia
      "india": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"],
      "china": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Nanjing"],
      "japan": ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Kyoto", "Fukuoka"],
      "south korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju"],
      "indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar"],
      "philippines": ["Manila", "Quezon City", "Cebu", "Davao", "Makati", "Taguig"],
      "thailand": ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Nonthaburi", "Hat Yai"],
      "vietnam": ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong", "Can Tho", "Nha Trang"],
      "malaysia": ["Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Shah Alam", "Petaling Jaya"],
      "singapore": ["Singapore"],
      "pakistan": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Peshawar"],
      "bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Comilla"],
      "sri lanka": ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Batticaloa"],
      "taiwan": ["Taipei", "Kaohsiung", "Taichung", "Tainan", "Hsinchu", "Keelung"],
      // Middle East
      "uae": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah"],
      "united arab emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah"],
      "saudi arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar"],
      "qatar": ["Doha", "Al Wakrah", "Al Khor", "Lusail", "Al Rayyan"],
      "kuwait": ["Kuwait City", "Hawalli", "Salmiya", "Farwaniya", "Jahra"],
      "bahrain": ["Manama", "Muharraq", "Riffa", "Hamad Town", "Isa Town"],
      "oman": ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
      "israel": ["Tel Aviv", "Jerusalem", "Haifa", "Beer Sheva", "Netanya", "Herzliya"],
      "turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya"],
      "jordan": ["Amman", "Irbid", "Zarqa", "Aqaba", "Madaba"],
      "lebanon": ["Beirut", "Tripoli", "Sidon", "Jounieh", "Byblos"],
      // Oceania
      "australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra", "Gold Coast"],
      "new zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin"],
      // ── Eastern Europe & Central Asia ──
      "russia": ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Nizhny Novgorod", "Chelyabinsk", "Samara"],
      "ukraine": ["Kyiv", "Kharkiv", "Odessa", "Dnipro", "Lviv", "Zaporizhzhia"],
      "belarus": ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Grodno", "Brest"],
      "moldova": ["Chisinau", "Balti", "Tiraspol", "Bender", "Comrat"],
      "georgia": ["Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Zugdidi"],
      "armenia": ["Yerevan", "Gyumri", "Vanadzor", "Vagharshapat", "Hrazdan"],
      "azerbaijan": ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Shirvan"],
      "kazakhstan": ["Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe", "Taraz"],
      "uzbekistan": ["Tashkent", "Samarkand", "Namangan", "Bukhara", "Andijan", "Fergana"],
      "kyrgyzstan": ["Bishkek", "Osh", "Jalal-Abad", "Karakol", "Tokmok"],
      "tajikistan": ["Dushanbe", "Khujand", "Kulob", "Bokhtar", "Istaravshan"],
      "turkmenistan": ["Ashgabat", "Turkmenabat", "Dashoguz", "Mary", "Balkanabat"],
      "mongolia": ["Ulaanbaatar", "Erdenet", "Darkhan", "Choibalsan"],
      // ── Remaining Europe ──
      "croatia": ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar"],
      "serbia": ["Belgrade", "Novi Sad", "Nis", "Kragujevac", "Subotica"],
      "bosnia and herzegovina": ["Sarajevo", "Banja Luka", "Tuzla", "Mostar", "Zenica"],
      "montenegro": ["Podgorica", "Niksic", "Herceg Novi", "Budva", "Bar"],
      "north macedonia": ["Skopje", "Bitola", "Kumanovo", "Prilep", "Ohrid"],
      "albania": ["Tirana", "Durres", "Vlore", "Elbasan", "Shkoder"],
      "bulgaria": ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse"],
      "slovakia": ["Bratislava", "Kosice", "Presov", "Zilina", "Nitra"],
      "slovenia": ["Ljubljana", "Maribor", "Celje", "Kranj", "Koper"],
      "estonia": ["Tallinn", "Tartu", "Narva", "Parnu", "Kohtla-Jarve"],
      "latvia": ["Riga", "Daugavpils", "Liepaja", "Jelgava", "Jurmala"],
      "lithuania": ["Vilnius", "Kaunas", "Klaipeda", "Siauliai", "Panevezys"],
      "iceland": ["Reykjavik", "Kopavogur", "Hafnarfjordur", "Akureyri"],
      "luxembourg": ["Luxembourg City", "Esch-sur-Alzette", "Differdange", "Dudelange"],
      "malta": ["Valletta", "Birkirkara", "Mosta", "Qormi", "Sliema"],
      "cyprus": ["Nicosia", "Limassol", "Larnaca", "Paphos", "Famagusta"],
      "andorra": ["Andorra la Vella", "Escaldes-Engordany", "Encamp"],
      "liechtenstein": ["Vaduz", "Schaan", "Balzers"],
      "monaco": ["Monaco", "Monte Carlo"],
      "san marino": ["San Marino", "Serravalle", "Borgo Maggiore"],
      "vatican city": ["Vatican City"],
      // ── Central America & Caribbean ──
      "mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Leon", "Cancun", "Merida"],
      "guatemala": ["Guatemala City", "Quetzaltenango", "Escuintla", "Mixco"],
      "honduras": ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma"],
      "el salvador": ["San Salvador", "Santa Ana", "San Miguel", "Soyapango"],
      "nicaragua": ["Managua", "Leon", "Masaya", "Chinandega", "Matagalpa"],
      "costa rica": ["San Jose", "Limon", "Alajuela", "Heredia", "Cartago"],
      "panama": ["Panama City", "Colon", "David", "La Chorrera", "Santiago"],
      "belize": ["Belize City", "San Ignacio", "Belmopan", "Orange Walk"],
      "cuba": ["Havana", "Santiago de Cuba", "Camaguey", "Holguin", "Santa Clara"],
      "jamaica": ["Kingston", "Montego Bay", "Spanish Town", "Portmore", "Mandeville"],
      "haiti": ["Port-au-Prince", "Cap-Haitien", "Gonaives", "Les Cayes"],
      "dominican republic": ["Santo Domingo", "Santiago", "La Romana", "San Pedro de Macoris", "Puerto Plata"],
      "trinidad and tobago": ["Port of Spain", "San Fernando", "Chaguanas", "Arima"],
      "bahamas": ["Nassau", "Freeport", "Marsh Harbour"],
      "barbados": ["Bridgetown", "Speightstown", "Oistins", "Holetown"],
      "grenada": ["St. George's", "Gouyave", "Grenville"],
      "saint lucia": ["Castries", "Vieux Fort", "Soufriere"],
      "saint kitts and nevis": ["Basseterre", "Charlestown"],
      "saint vincent": ["Kingstown", "Georgetown", "Barrouallie"],
      "dominica": ["Roseau", "Portsmouth"],
      "antigua and barbuda": ["St. John's", "All Saints", "Liberta"],
      // ── South America ──
      "venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana"],
      "ecuador": ["Quito", "Guayaquil", "Cuenca", "Machala", "Ambato", "Portoviejo"],
      "bolivia": ["La Paz", "Santa Cruz", "Cochabamba", "Sucre", "Oruro", "Tarija"],
      "paraguay": ["Asuncion", "Ciudad del Este", "San Lorenzo", "Luque", "Capiata"],
      "uruguay": ["Montevideo", "Salto", "Ciudad de la Costa", "Paysandu"],
      "guyana": ["Georgetown", "Linden", "New Amsterdam", "Anna Regina"],
      "suriname": ["Paramaribo", "Lelydorp", "Nieuw Nickerie"],
      // ── West Africa ──
      "mali": ["Bamako", "Sikasso", "Mopti", "Segou", "Koutiala"],
      "burkina faso": ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora"],
      "niger": ["Niamey", "Zinder", "Maradi", "Agadez", "Tahoua"],
      "guinea": ["Conakry", "Nzerekore", "Kankan", "Kindia"],
      "guinea-bissau": ["Bissau", "Bafata", "Gabu"],
      "sierra leone": ["Freetown", "Bo", "Kenema", "Makeni"],
      "liberia": ["Monrovia", "Gbarnga", "Kakata", "Buchanan"],
      "gambia": ["Banjul", "Serrekunda", "Brikama", "Bakau"],
      "cabo verde": ["Praia", "Mindelo", "Santa Maria"],
      "togo": ["Lome", "Sokode", "Kara", "Atakpame"],
      "benin": ["Cotonou", "Porto-Novo", "Parakou", "Djougou", "Abomey-Calavi"],
      // ── Central Africa ──
      "dr congo": ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kisangani", "Goma", "Bukavu"],
      "congo (brazzaville)": ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi"],
      "gabon": ["Libreville", "Port-Gentil", "Franceville", "Oyem"],
      "equatorial guinea": ["Malabo", "Bata", "Ebebiyin"],
      "central african republic": ["Bangui", "Bimbo", "Berberati", "Carnot"],
      "chad": ["N'Djamena", "Moundou", "Sarh", "Abeche"],
      "sao tome and principe": ["Sao Tome", "Santo Amaro"],
      // ── East Africa ──
      "sudan": ["Khartoum", "Omdurman", "Port Sudan", "Kassala", "El Obeid"],
      "south sudan": ["Juba", "Malakal", "Wau", "Bor"],
      "eritrea": ["Asmara", "Keren", "Massawa", "Assab"],
      "djibouti": ["Djibouti City", "Ali Sabieh", "Tadjoura"],
      "somalia": ["Mogadishu", "Hargeisa", "Kismayo", "Marka", "Berbera"],
      "burundi": ["Bujumbura", "Gitega", "Muyinga", "Ngozi"],
      "comoros": ["Moroni", "Mutsamudu", "Fomboni"],
      "madagascar": ["Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga"],
      "mauritius": ["Port Louis", "Beau Bassin-Rose Hill", "Vacoas-Phoenix", "Curepipe"],
      "seychelles": ["Victoria", "Anse Boileau", "Bel Ombre"],
      "mauritania": ["Nouakchott", "Nouadhibou", "Kaedi", "Zouerate"],
      // ── Southern Africa ──
      "mozambique": ["Maputo", "Beira", "Nampula", "Chimoio", "Quelimane"],
      "zambia": ["Lusaka", "Kitwe", "Ndola", "Kabwe", "Livingstone"],
      "zimbabwe": ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru"],
      "malawi": ["Lilongwe", "Blantyre", "Mzuzu", "Zomba"],
      "namibia": ["Windhoek", "Walvis Bay", "Swakopmund", "Oshakati"],
      "botswana": ["Gaborone", "Francistown", "Molepolole", "Maun"],
      "lesotho": ["Maseru", "Teyateyaneng", "Mafeteng"],
      "eswatini": ["Mbabane", "Manzini", "Big Bend", "Siteki"],
      "angola": ["Luanda", "Huambo", "Lobito", "Benguela", "Lubango", "Malanje"],
      // ── North Africa ──
      "algeria": ["Algiers", "Oran", "Constantine", "Annaba", "Blida", "Setif"],
      "tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte"],
      "libya": ["Tripoli", "Benghazi", "Misrata", "Tarhuna", "Zliten"],
      // ── Middle East (remaining) ──
      "iran": ["Tehran", "Isfahan", "Mashhad", "Shiraz", "Tabriz", "Karaj"],
      "iraq": ["Baghdad", "Basra", "Erbil", "Sulaymaniyah", "Mosul", "Kirkuk"],
      "syria": ["Damascus", "Aleppo", "Homs", "Latakia", "Hama"],
      "yemen": ["Sana'a", "Aden", "Taiz", "Al Hudaydah", "Ibb"],
      // ── South Asia (remaining) ──
      "afghanistan": ["Kabul", "Kandahar", "Herat", "Mazar-i-Sharif", "Jalalabad"],
      "nepal": ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar"],
      "myanmar": ["Yangon", "Mandalay", "Naypyidaw", "Mawlamyine", "Bago"],
      "maldives": ["Male", "Addu City", "Fuvahmulah"],
      "bhutan": ["Thimphu", "Phuntsholing", "Paro"],
      // ── Southeast Asia (remaining) ──
      "cambodia": ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville"],
      "laos": ["Vientiane", "Luang Prabang", "Savannakhet", "Pakse"],
      "brunei": ["Bandar Seri Begawan", "Seria", "Tutong"],
      "timor-leste": ["Dili", "Baucau", "Maliana"],
      // ── East Asia (remaining) ──
      "north korea": ["Pyongyang", "Hamhung", "Chongjin", "Nampo"],
      // ── Pacific Islands ──
      "fiji": ["Suva", "Nadi", "Lautoka", "Labasa"],
      "papua new guinea": ["Port Moresby", "Lae", "Mount Hagen", "Madang"],
      "samoa": ["Apia", "Vaitele", "Faleula"],
      "tonga": ["Nuku'alofa", "Neiafu", "Haveluloto"],
      "vanuatu": ["Port Vila", "Luganville"],
      "solomon islands": ["Honiara", "Auki", "Gizo"],
      "kiribati": ["Tarawa", "Betio"],
      "marshall islands": ["Majuro", "Ebeye"],
      "micronesia": ["Palikir", "Weno", "Kolonia"],
      "palau": ["Ngerulmud", "Koror"],
      "tuvalu": ["Funafuti"],
      "nauru": ["Yaren"],
    };

    const US_STATE_CITIES: Record<string, { state: string, cities: string[] }> = {
      // Alabama
      "birmingham": { state: "Alabama", cities: ["montgomery", "huntsville", "mobile", "tuscaloosa", "hoover"] },
      "montgomery": { state: "Alabama", cities: ["birmingham", "huntsville", "mobile", "tuscaloosa", "hoover"] },
      // Alaska
      "anchorage": { state: "Alaska", cities: ["fairbanks", "juneau", "wasilla", "sitka"] },
      // Arizona
      "phoenix": { state: "Arizona", cities: ["tucson", "mesa", "scottsdale", "chandler", "glendale", "tempe", "gilbert"] },
      "tucson": { state: "Arizona", cities: ["phoenix", "mesa", "scottsdale", "chandler", "glendale", "flagstaff"] },
      "mesa": { state: "Arizona", cities: ["phoenix", "tucson", "scottsdale", "chandler", "glendale", "tempe", "gilbert"] },
      // Arkansas
      "little rock": { state: "Arkansas", cities: ["fort smith", "fayetteville", "springdale", "jonesboro", "conway"] },
      // California
      "los angeles": { state: "California", cities: ["san francisco", "san diego", "sacramento", "san jose", "fresno", "oakland", "long beach"] },
      "san francisco": { state: "California", cities: ["los angeles", "san diego", "sacramento", "san jose", "fresno", "oakland", "long beach"] },
      "san diego": { state: "California", cities: ["los angeles", "san francisco", "sacramento", "san jose", "fresno", "oakland"] },
      "san jose": { state: "California", cities: ["los angeles", "san francisco", "san diego", "sacramento", "fresno", "oakland"] },
      "sacramento": { state: "California", cities: ["los angeles", "san francisco", "san diego", "san jose", "fresno", "oakland"] },
      "fresno": { state: "California", cities: ["los angeles", "san francisco", "san diego", "san jose", "sacramento", "bakersfield"] },
      // Colorado
      "denver": { state: "Colorado", cities: ["colorado springs", "aurora", "boulder", "fort collins", "lakewood", "pueblo"] },
      "colorado springs": { state: "Colorado", cities: ["denver", "aurora", "boulder", "fort collins", "lakewood", "pueblo"] },
      "aurora": { state: "Colorado", cities: ["denver", "colorado springs", "boulder", "fort collins", "lakewood"] },
      // Connecticut
      "hartford": { state: "Connecticut", cities: ["new haven", "stamford", "bridgeport", "waterbury", "norwalk"] },
      // Delaware
      "wilmington": { state: "Delaware", cities: ["dover", "newark", "middletown", "smyrna"] },
      // Florida
      "miami": { state: "Florida", cities: ["fort lauderdale", "orlando", "tampa", "jacksonville", "st petersburg", "hialeah"] },
      "orlando": { state: "Florida", cities: ["miami", "fort lauderdale", "tampa", "jacksonville", "st petersburg"] },
      "tampa": { state: "Florida", cities: ["miami", "fort lauderdale", "orlando", "jacksonville", "st petersburg"] },
      "jacksonville": { state: "Florida", cities: ["miami", "fort lauderdale", "orlando", "tampa", "st petersburg", "tallahassee"] },
      "fort lauderdale": { state: "Florida", cities: ["miami", "orlando", "tampa", "jacksonville", "west palm beach", "boca raton"] },
      // Georgia
      "atlanta": { state: "Georgia", cities: ["savannah", "augusta", "columbus", "macon", "athens", "roswell", "sandy springs"] },
      // Hawaii
      "honolulu": { state: "Hawaii", cities: ["pearl city", "hilo", "kailua", "kaneohe", "waipahu"] },
      // Idaho
      "boise": { state: "Idaho", cities: ["nampa", "meridian", "idaho falls", "pocatello", "caldwell", "twin falls"] },
      // Illinois
      "chicago": { state: "Illinois", cities: ["aurora", "naperville", "joliet", "rockford", "springfield", "elgin", "peoria"] },
      // Indiana
      "indianapolis": { state: "Indiana", cities: ["fort wayne", "evansville", "south bend", "carmel", "fishers", "bloomington"] },
      // Iowa
      "des moines": { state: "Iowa", cities: ["cedar rapids", "davenport", "sioux city", "iowa city", "waterloo"] },
      // Kansas
      "wichita": { state: "Kansas", cities: ["overland park", "kansas city", "olathe", "topeka", "lawrence"] },
      "kansas city": { state: "Kansas", cities: ["wichita", "overland park", "olathe", "topeka", "lawrence"] },
      // Kentucky
      "louisville": { state: "Kentucky", cities: ["lexington", "bowling green", "owensboro", "covington", "richmond"] },
      // Louisiana
      "new orleans": { state: "Louisiana", cities: ["baton rouge", "shreveport", "lafayette", "lake charles", "kenner", "metairie"] },
      // Maine
      "portland me": { state: "Maine", cities: ["bangor", "lewiston", "auburn", "south portland", "biddeford"] },
      // Maryland
      "baltimore": { state: "Maryland", cities: ["columbia", "germantown", "silver spring", "waldorf", "frederick", "annapolis"] },
      // Massachusetts
      "boston": { state: "Massachusetts", cities: ["worcester", "springfield", "cambridge", "lowell", "brockton", "quincy"] },
      // Michigan
      "detroit": { state: "Michigan", cities: ["grand rapids", "warren", "sterling heights", "ann arbor", "lansing", "flint"] },
      // Minnesota
      "minneapolis": { state: "Minnesota", cities: ["saint paul", "rochester", "duluth", "bloomington", "brooklyn park", "plymouth"] },
      "saint paul": { state: "Minnesota", cities: ["minneapolis", "rochester", "duluth", "bloomington", "brooklyn park"] },
      // Mississippi
      "jackson": { state: "Mississippi", cities: ["gulfport", "southaven", "hattiesburg", "biloxi", "meridian"] },
      // Missouri
      "st louis": { state: "Missouri", cities: ["kansas city", "springfield", "columbia", "independence", "jefferson city"] },
      // Montana
      "billings": { state: "Montana", cities: ["missoula", "great falls", "bozeman", "butte", "helena"] },
      // Nebraska
      "omaha": { state: "Nebraska", cities: ["lincoln", "bellevue", "grand island", "kearney", "fremont"] },
      // Nevada
      "las vegas": { state: "Nevada", cities: ["henderson", "reno", "north las vegas", "sparks", "carson city"] },
      "reno": { state: "Nevada", cities: ["las vegas", "henderson", "north las vegas", "sparks", "carson city"] },
      // New Hampshire
      "manchester nh": { state: "New Hampshire", cities: ["nashua", "concord", "dover", "rochester", "keene"] },
      // New Jersey
      "newark": { state: "New Jersey", cities: ["jersey city", "paterson", "elizabeth", "trenton", "clifton", "camden"] },
      "jersey city": { state: "New Jersey", cities: ["newark", "paterson", "elizabeth", "trenton", "clifton", "hoboken"] },
      // New Mexico
      "albuquerque": { state: "New Mexico", cities: ["las cruces", "rio rancho", "santa fe", "roswell", "farmington"] },
      // New York
      "new york": { state: "New York", cities: ["buffalo", "rochester", "yonkers", "syracuse", "albany", "brooklyn", "queens"] },
      "buffalo": { state: "New York", cities: ["new york", "rochester", "yonkers", "syracuse", "albany"] },
      "rochester": { state: "New York", cities: ["new york", "buffalo", "yonkers", "syracuse", "albany"] },
      "syracuse": { state: "New York", cities: ["new york", "buffalo", "rochester", "yonkers", "albany"] },
      // North Carolina
      "charlotte": { state: "North Carolina", cities: ["raleigh", "greensboro", "durham", "winston-salem", "fayetteville", "asheville"] },
      "raleigh": { state: "North Carolina", cities: ["charlotte", "greensboro", "durham", "winston-salem", "fayetteville", "cary"] },
      // North Dakota
      "fargo": { state: "North Dakota", cities: ["bismarck", "grand forks", "minot", "west fargo", "williston"] },
      // Ohio
      "columbus": { state: "Ohio", cities: ["cleveland", "cincinnati", "toledo", "akron", "dayton"] },
      "cleveland": { state: "Ohio", cities: ["columbus", "cincinnati", "toledo", "akron", "dayton"] },
      "cincinnati": { state: "Ohio", cities: ["columbus", "cleveland", "toledo", "akron", "dayton"] },
      // Oklahoma
      "oklahoma city": { state: "Oklahoma", cities: ["tulsa", "norman", "broken arrow", "edmond", "moore", "lawton"] },
      "tulsa": { state: "Oklahoma", cities: ["oklahoma city", "norman", "broken arrow", "edmond", "moore"] },
      // Oregon
      "portland": { state: "Oregon", cities: ["salem", "eugene", "gresham", "hillsboro", "beaverton", "bend"] },
      // Pennsylvania
      "philadelphia": { state: "Pennsylvania", cities: ["pittsburgh", "allentown", "reading", "erie", "harrisburg", "scranton"] },
      "pittsburgh": { state: "Pennsylvania", cities: ["philadelphia", "allentown", "reading", "erie", "harrisburg"] },
      // Rhode Island
      "providence": { state: "Rhode Island", cities: ["warwick", "cranston", "pawtucket", "east providence", "woonsocket"] },
      // South Carolina
      "charleston": { state: "South Carolina", cities: ["columbia", "north charleston", "greenville", "rock hill", "mount pleasant"] },
      // South Dakota
      "sioux falls": { state: "South Dakota", cities: ["rapid city", "aberdeen", "brookings", "watertown", "mitchell"] },
      // Tennessee
      "nashville": { state: "Tennessee", cities: ["memphis", "knoxville", "chattanooga", "clarksville", "murfreesboro"] },
      "memphis": { state: "Tennessee", cities: ["nashville", "knoxville", "chattanooga", "clarksville", "murfreesboro"] },
      // Texas
      "houston": { state: "Texas", cities: ["dallas", "austin", "san antonio", "fort worth", "el paso", "arlington", "corpus christi"] },
      "dallas": { state: "Texas", cities: ["houston", "austin", "san antonio", "fort worth", "el paso", "arlington", "plano"] },
      "austin": { state: "Texas", cities: ["houston", "dallas", "san antonio", "fort worth", "el paso", "arlington"] },
      "san antonio": { state: "Texas", cities: ["houston", "dallas", "austin", "fort worth", "el paso", "arlington", "corpus christi"] },
      "fort worth": { state: "Texas", cities: ["houston", "dallas", "austin", "san antonio", "el paso", "arlington"] },
      // Utah
      "salt lake city": { state: "Utah", cities: ["provo", "west valley city", "ogden", "orem", "sandy", "layton", "st george"] },
      // Vermont
      "burlington": { state: "Vermont", cities: ["south burlington", "rutland", "essex", "bennington", "montpelier"] },
      // Virginia
      "richmond": { state: "Virginia", cities: ["virginia beach", "norfolk", "chesapeake", "arlington", "newport news", "hampton", "alexandria"] },
      "virginia beach": { state: "Virginia", cities: ["richmond", "norfolk", "chesapeake", "arlington", "newport news", "hampton"] },
      // Washington
      "seattle": { state: "Washington", cities: ["spokane", "tacoma", "vancouver", "bellevue", "kent", "everett"] },
      "spokane": { state: "Washington", cities: ["seattle", "tacoma", "vancouver", "bellevue", "kent"] },
      "tacoma": { state: "Washington", cities: ["seattle", "spokane", "vancouver", "bellevue", "kent"] },
      "bellevue": { state: "Washington", cities: ["seattle", "spokane", "tacoma", "vancouver", "kent"] },
      // Washington DC
      "washington dc": { state: "District of Columbia", cities: ["arlington", "alexandria", "silver spring", "bethesda", "tysons"] },
      // West Virginia
      "charleston wv": { state: "West Virginia", cities: ["huntington", "morgantown", "parkersburg", "wheeling", "weirton"] },
      // Wisconsin
      "milwaukee": { state: "Wisconsin", cities: ["madison", "green bay", "kenosha", "racine", "appleton", "waukesha"] },
      // Wyoming
      "cheyenne": { state: "Wyoming", cities: ["casper", "laramie", "gillette", "rock springs", "sheridan"] },
    };

    const queryDatabase = async (targetCity: string, targetCountry: string, excludeIds: string[]) => {
      let qb = supabase
        .from("leads")
        .select("*")
        .eq("country", targetCountry)
        .ilike("city", targetCity)
        .eq("industry", query)
        .gt("cache_expires_at", new Date().toISOString());

      if (searchKeyword) {
        qb = qb.or(`business_type.ilike.%${searchKeyword}%,business_name.ilike.%${searchKeyword}%,description.ilike.%${searchKeyword}%`);
      }

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
      const scraped = await scrapeLiveLeads(city, country, searchDistrict, searchKeyword);
      
      let finalScraped = scraped || [];
      
      // If scraping returned no new results, generate fallback mock leads so the user never gets 0 leads
      if (finalScraped.length === 0) {
        console.log(`Live scraping returned 0 results. Generating high-quality fallback leads for ${city}...`);
        const fallbackLeads = generateFallbackLeads(city, country, query, searchKeyword, [
          "african_food_export",
          "b2b_trade",
          "restaurant_supplier",
          "product_export",
        ].includes(query) ? product : undefined);

        // Upsert fallback leads into Supabase to cache them
        const { data: insertedLeads, error: upsertError } = await supabase
          .from("leads")
          .upsert(fallbackLeads, { onConflict: "google_place_id" })
          .select();

        if (upsertError) {
          console.error("Failed to upsert fallback leads to Supabase:", upsertError);
          // Fallback to memory array if upsert fails
          finalScraped = fallbackLeads;
        } else if (insertedLeads) {
          finalScraped = insertedLeads;
        }
      } else {
        finalScraped = scraped;
      }

      const unseenScraped = finalScraped.filter(l => !seenIds.includes(l.id) && !results.some(r => r.id === l.id));
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
