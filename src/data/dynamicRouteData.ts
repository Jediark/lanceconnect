/**
 * dynamicRouteData.ts
 * Central data module for all dynamic /find-clients/* pages.
 * Used by find-clients.$category.tsx and find-clients.$skill.$city.tsx.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatCityName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatSkillName(slug: string): string {
  const config = SKILL_CONFIG[slug];
  if (config) return config.label;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Static pages guard (never generate dynamic pages for these) ─────────────

export const STATIC_PAGES = [
  "lagos",
  "london",
  "dubai",
  "web-developer",
  "graphic-designer",
  "copywriter",
] as const;

export function isStaticPage(slug: string): boolean {
  return (STATIC_PAGES as readonly string[]).includes(slug);
}

// ─── City → Country map ──────────────────────────────────────────────────────

export const CITY_COUNTRY_MAP: Record<string, string> = {
  // Nigeria
  abuja: "Nigeria",
  kano: "Nigeria",
  ibadan: "Nigeria",
  "port-harcourt": "Nigeria",
  enugu: "Nigeria",
  kaduna: "Nigeria",
  // Ghana
  accra: "Ghana",
  kumasi: "Ghana",
  "cape-coast": "Ghana",
  // Kenya
  nairobi: "Kenya",
  mombasa: "Kenya",
  // South Africa
  johannesburg: "South Africa",
  "cape-town": "South Africa",
  durban: "South Africa",
  pretoria: "South Africa",
  // Tanzania
  "dar-es-salaam": "Tanzania",
  arusha: "Tanzania",
  // Rwanda
  kigali: "Rwanda",
  // Uganda
  kampala: "Uganda",
  // Zambia
  lusaka: "Zambia",
  // Zimbabwe
  harare: "Zimbabwe",
  // Mozambique
  maputo: "Mozambique",
  // Senegal
  dakar: "Senegal",
  // Ivory Coast
  abidjan: "Ivory Coast",
  // Cameroon
  douala: "Cameroon",
  yaounde: "Cameroon",
  // Togo
  lome: "Togo",
  // Benin
  cotonou: "Benin",
  // Mali
  bamako: "Mali",
  // Guinea
  conakry: "Guinea",
  // Sierra Leone
  freetown: "Sierra Leone",
  // Liberia
  monrovia: "Liberia",
  // Gambia
  banjul: "Gambia",
  // Ethiopia
  "addis-ababa": "Ethiopia",
  // Egypt
  cairo: "Egypt",
  // Morocco
  casablanca: "Morocco",
  // United Kingdom
  manchester: "United Kingdom",
  birmingham: "United Kingdom",
  edinburgh: "United Kingdom",
  // France
  paris: "France",
  // Germany
  berlin: "Germany",
  // Netherlands
  amsterdam: "Netherlands",
  // Spain
  madrid: "Spain",
  // Italy
  rome: "Italy",
  // Turkey
  istanbul: "Turkey",
  // Saudi Arabia
  riyadh: "Saudi Arabia",
  // UAE (dynamic — dubai is static)
  "abu-dhabi": "UAE",
  sharjah: "UAE",
  // India
  mumbai: "India",
  delhi: "India",
  bangalore: "India",
  chennai: "India",
  hyderabad: "India",
  // Pakistan
  karachi: "Pakistan",
  // Bangladesh
  dhaka: "Bangladesh",
  // Singapore
  singapore: "Singapore",
  // Malaysia
  "kuala-lumpur": "Malaysia",
  // Indonesia
  jakarta: "Indonesia",
  // Philippines
  manila: "Philippines",
  // Japan
  tokyo: "Japan",
  osaka: "Japan",
  // South Korea
  seoul: "South Korea",
  // Thailand
  bangkok: "Thailand",
  // Vietnam
  "ho-chi-minh": "Vietnam",
  // Australia
  sydney: "Australia",
  melbourne: "Australia",
  brisbane: "Australia",
  // New Zealand
  auckland: "New Zealand",
  // Canada
  toronto: "Canada",
  montreal: "Canada",
  vancouver: "Canada",
  // United States
  austin: "United States",
  "fort-lauderdale": "United States",
  // Brazil
  "sao-paulo": "Brazil",
  // Colombia
  bogota: "Colombia",
  // Peru
  lima: "Peru",
  // Mexico
  "mexico-city": "Mexico",
};

export function isKnownCity(slug: string): boolean {
  return slug.toLowerCase() in CITY_COUNTRY_MAP;
}

export function getCountry(slug: string): string {
  return CITY_COUNTRY_MAP[slug.toLowerCase()] || "";
}

// US state labels (for subtitle display)
export const US_STATE_MAP: Record<string, string> = {
  austin: "Texas",
  "fort-lauderdale": "Florida",
};

// Flag emoji by country
export const COUNTRY_FLAG: Record<string, string> = {
  Nigeria: "🇳🇬",
  Ghana: "🇬🇭",
  Kenya: "🇰🇪",
  "South Africa": "🇿🇦",
  Tanzania: "🇹🇿",
  Rwanda: "🇷🇼",
  Uganda: "🇺🇬",
  Zambia: "🇿🇲",
  Zimbabwe: "🇿🇼",
  Mozambique: "🇲🇿",
  Senegal: "🇸🇳",
  "Ivory Coast": "🇨🇮",
  Cameroon: "🇨🇲",
  Togo: "🇹🇬",
  Benin: "🇧🇯",
  Mali: "🇲🇱",
  Guinea: "🇬🇳",
  "Sierra Leone": "🇸🇱",
  Liberia: "🇱🇷",
  Gambia: "🇬🇲",
  Ethiopia: "🇪🇹",
  Egypt: "🇪🇬",
  Morocco: "🇲🇦",
  "United Kingdom": "🇬🇧",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Netherlands: "🇳🇱",
  Spain: "🇪🇸",
  Italy: "🇮🇹",
  Turkey: "🇹🇷",
  "Saudi Arabia": "🇸🇦",
  UAE: "🇦🇪",
  India: "🇮🇳",
  Pakistan: "🇵🇰",
  Bangladesh: "🇧🇩",
  Singapore: "🇸🇬",
  Malaysia: "🇲🇾",
  Indonesia: "🇮🇩",
  Philippines: "🇵🇭",
  Japan: "🇯🇵",
  "South Korea": "🇰🇷",
  Thailand: "🇹🇭",
  Vietnam: "🇻🇳",
  Australia: "🇦🇺",
  "New Zealand": "🇳🇿",
  Canada: "🇨🇦",
  "United States": "🇺🇸",
  Brazil: "🇧🇷",
  Colombia: "🇨🇴",
  Peru: "🇵🇪",
  Mexico: "🇲🇽",
};

// ─── Skill Config ────────────────────────────────────────────────────────────

export interface SkillNiche {
  icon: string;
  title: string;
  description: string;
}

export interface SkillConfigEntry {
  label: string;
  category: string;
  description: string;
  niches: SkillNiche[];
  keywords: string;
}

export const SKILL_CONFIG: Record<string, SkillConfigEntry> = {
  "seo-specialist": {
    label: "SEO Specialist",
    category: "seo",
    description:
      "Thousands of businesses are invisible on Google. You can fix that.",
    niches: [
      {
        icon: "🦷",
        title: "Dental clinic with no Google presence",
        description:
          "Dental clinics not appearing when patients search locally.",
      },
      {
        icon: "🔧",
        title: "Plumber with no online reviews",
        description: "Tradespeople relying on word-of-mouth only.",
      },
      {
        icon: "🏋️",
        title: "Gym not ranking locally",
        description: "Fitness studios invisible to people searching nearby.",
      },
    ],
    keywords:
      "find clients as SEO specialist, SEO clients, local SEO clients, find SEO work",
  },
  "social-media-manager": {
    label: "Social Media Manager",
    category: "social_media",
    description:
      "Most local businesses have dead social media pages. You can bring them to life.",
    niches: [
      {
        icon: "🍕",
        title: "Restaurant with no Instagram",
        description:
          "Food businesses that should be posting daily but never do.",
      },
      {
        icon: "💅",
        title: "Salon with no social presence",
        description: "Beauty businesses with no before/after content anywhere.",
      },
      {
        icon: "🏨",
        title: "Hotel with inactive Facebook",
        description: "Hotels that last posted 2 years ago.",
      },
    ],
    keywords:
      "find clients as social media manager, social media clients, Instagram management clients",
  },
  photographer: {
    label: "Photographer",
    category: "photography",
    description:
      "Every business needs great photos. Most get by with phone camera shots.",
    niches: [
      {
        icon: "🏠",
        title: "Real estate with poor photos",
        description:
          "Property listings with dark blurry photos losing buyers.",
      },
      {
        icon: "🍽️",
        title: "Restaurant with no food photography",
        description: "Menus with zero professional food photos.",
      },
      {
        icon: "🏨",
        title: "Hotel with outdated room photos",
        description: "Hotels using 10-year-old photos.",
      },
    ],
    keywords:
      "find clients as photographer, photography clients, real estate photography clients",
  },
  "video-producer": {
    label: "Video Producer",
    category: "video",
    description:
      "Video is the most powerful marketing tool. Almost no small business uses it.",
    niches: [
      {
        icon: "🏋️",
        title: "Gym with no promo video",
        description: "Fitness studios with no video content at all.",
      },
      {
        icon: "🏫",
        title: "School with no virtual tour",
        description: "Educational institutions parents cannot preview.",
      },
      {
        icon: "🏡",
        title: "Real estate with no property tours",
        description: "Listings with photos only — no video walkthrough.",
      },
    ],
    keywords:
      "find clients as video producer, video production clients, corporate video clients",
  },
  "virtual-assistant": {
    label: "Virtual Assistant",
    category: "va",
    description: "Busy entrepreneurs need support. Be their right hand.",
    niches: [
      {
        icon: "👨‍💼",
        title: "Solo entrepreneur overwhelmed",
        description:
          "One-person businesses burning out doing everything themselves.",
      },
      {
        icon: "🏥",
        title: "Clinic owner doing admin themselves",
        description:
          "Doctors spending time on scheduling instead of patients.",
      },
      {
        icon: "🏘️",
        title: "Real estate agent with no support",
        description:
          "Agents handling listings, calls and paperwork alone.",
      },
    ],
    keywords:
      "find clients as virtual assistant, VA clients, find VA work, remote assistant clients",
  },
  "digital-marketer": {
    label: "Digital Marketer",
    category: "marketing",
    description:
      "Most small businesses have zero digital marketing presence. You can change that.",
    niches: [
      {
        icon: "🛍️",
        title: "Retail shop with no online ads",
        description: "Shops spending zero on digital advertising.",
      },
      {
        icon: "🏥",
        title: "Clinic with no online presence",
        description:
          "Healthcare providers invisible to patients searching online.",
      },
      {
        icon: "🏋️",
        title: "Gym with no marketing strategy",
        description: "Fitness businesses relying only on walk-ins.",
      },
    ],
    keywords:
      "find clients as digital marketer, marketing clients, digital marketing clients, find marketing work",
  },
  "app-developer": {
    label: "App Developer",
    category: "app_dev",
    description:
      "Businesses need mobile apps. Few have them. You can build them.",
    niches: [
      {
        icon: "🍽️",
        title: "Restaurant needing ordering app",
        description: "Restaurants taking orders by phone only — no app.",
      },
      {
        icon: "🏋️",
        title: "Gym needing membership app",
        description:
          "Fitness centers managing memberships with spreadsheets.",
      },
      {
        icon: "🚗",
        title: "Service business needing booking app",
        description: "Service providers with no online booking system.",
      },
    ],
    keywords:
      "find clients as app developer, app development clients, mobile app clients, find app development work",
  },
  tutor: {
    label: "Online Tutor",
    category: "tutor",
    description:
      "Parents globally are searching for tutors for their children right now.",
    niches: [
      {
        icon: "📐",
        title: "Families needing maths support",
        description: "Students struggling with GCSE, WAEC or SAT maths.",
      },
      {
        icon: "🗣️",
        title: "Students learning English",
        description:
          "Non-native speakers preparing for IELTS or TOEFL.",
      },
      {
        icon: "💻",
        title: "Professionals learning to code",
        description: "Career changers who need programming skills fast.",
      },
    ],
    keywords:
      "find tutoring clients, find students as tutor, online tutor clients, find parents needing tutors",
  },
  "mc-events": {
    label: "MC & Events Host",
    category: "mc_events",
    description: "Events happen every day. Every event needs a professional MC.",
    niches: [
      {
        icon: "🎊",
        title: "Corporate event with no MC",
        description:
          "Companies planning conferences and product launches needing a host.",
      },
      {
        icon: "💒",
        title: "Wedding without a professional MC",
        description:
          "Couples planning weddings who want a polished, professional host.",
      },
      {
        icon: "🏆",
        title: "Award ceremony needing a host",
        description:
          "Organizations hosting gala dinners and award nights.",
      },
    ],
    keywords:
      "find clients as MC, events host clients, find MC work, corporate event host, wedding MC",
  },
};

export function isKnownSkill(slug: string): boolean {
  return slug in SKILL_CONFIG;
}

// ─── Top Cities for cross-linking ────────────────────────────────────────────

export const TOP_CITIES = [
  "accra",
  "nairobi",
  "johannesburg",
  "mumbai",
  "toronto",
  "berlin",
  "paris",
  "singapore",
  "sydney",
  "austin",
  "fort-lauderdale",
  "istanbul",
  "bangkok",
  "manila",
  "sao-paulo",
  "cairo",
  "abuja",
  "kampala",
  "kigali",
  "kuala-lumpur",
];

// All known skills slugs (for city pages to cross-link)
export const ALL_SKILL_SLUGS = [
  ...Object.keys(SKILL_CONFIG),
  // Include slugs for the 3 static skill pages
  "web-developer",
  "graphic-designer",
  "copywriter",
];

export function getSkillLabel(slug: string): string {
  if (SKILL_CONFIG[slug]) return SKILL_CONFIG[slug].label;
  return formatCityName(slug);
}

// ─── Dynamic mock leads (fallback when API returns 0) ────────────────────────

import type { LeadData } from "@/components/marketing/SEOLeadCard";

export function getMockLeadsForCity(cityName: string, countryName: string): LeadData[] {
  return [
    {
      business_name: `${cityName} Premier Salon`,
      business_type: "Hair & Beauty Salon",
      city: cityName,
      country: countryName,
      has_website: false,
      google_rating: 4.2,
      google_review_count: 38,
      opportunity_score: 91,
      phone: "••••••••••",
      email: "sal•••@•••.com",
    },
    {
      business_name: `${cityName} Dental Centre`,
      business_type: "Dental Clinic",
      city: cityName,
      country: countryName,
      has_website: false,
      google_rating: 3.9,
      google_review_count: 22,
      opportunity_score: 87,
      phone: "••••••••••",
      email: null,
    },
    {
      business_name: `${cityName} Fresh Market`,
      business_type: "Grocery Store",
      city: cityName,
      country: countryName,
      has_website: false,
      google_rating: 4.5,
      google_review_count: 71,
      opportunity_score: 83,
      phone: "••••••••••",
      email: "mkt•••@•••.com",
    },
  ];
}

export function getMockLeadsForSkill(
  cityName: string,
  countryName: string,
  skillLabel: string
): LeadData[] {
  return [
    {
      business_name: `${cityName} Rooftop Restaurant`,
      business_type: "Restaurant",
      city: cityName,
      country: countryName,
      has_website: true,
      google_rating: 3.4,
      google_review_count: 14,
      opportunity_score: 94,
      phone: "••••••••••",
      email: "res•••@•••.com",
    },
    {
      business_name: `${cityName} Grand Hotel`,
      business_type: "Hotel",
      city: cityName,
      country: countryName,
      has_website: false,
      google_rating: 4.0,
      google_review_count: 56,
      opportunity_score: 88,
      phone: "••••••••••",
      email: null,
    },
    {
      business_name: `${cityName} Fitness Club`,
      business_type: "Fitness Center",
      city: cityName,
      country: countryName,
      has_website: false,
      google_rating: 4.3,
      google_review_count: 29,
      opportunity_score: 82,
      phone: "••••••••••",
      email: "fit•••@•••.com",
    },
  ];
}
