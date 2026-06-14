import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Check, Shield } from "lucide-react";
import { getCountry } from "@/data/dynamicRouteData";
import { US_STATES, GLOBAL_REGIONS } from "@/data/geography";

interface Message {
  id: string;
  sender: "assistant" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface Slots {
  category: string | null;
  location: string | null;
  budget: string | null;
  experience_level: string | null;
}

const INITIAL_SLOTS: Slots = {
  category: null,
  location: null,
  budget: null,
  experience_level: null,
};

const CATEGORY_MAP: Record<string, string> = {
  "Web Development": "web_dev",
  "Graphic Design": "designer",
  "Virtual Assistant": "va",
  "Content Writing": "copywriter",
  "Pet Care": "pet_care",
  "Translation": "translation",
  "Personal Training": "personal_trainer",
  "Landscaping & Lawn Care": "landscaping",
  "Hairstylist": "hairstylist",
  "Makeup Artistry": "makeup_artist",
  "Voiceover": "voiceover",
  "Accounting & CPA": "accounting",
  "Handyman Services": "handyman",
  "Wedding Planning": "wedding_planner",
  "Massage Therapy": "massage_therapist",
  "Music Lessons": "music_teacher",
  "House Cleaning": "house_cleaning",
  "SEO": "seo",
  "Social Media": "social_media",
  "Video Production": "video",
  "Photography": "photography",
  "Digital Marketing": "marketing",
  "App Development": "app_dev",
  "Online Tutoring": "tutor",
  "Training & Recruitment": "training_recruitment",
  "Real Estate": "real_estate",
};

const KEYWORD_TO_CATEGORY: Record<string, string> = {
  // Web Dev
  "web developer": "Web Development",
  "web dev": "Web Development",
  "developer": "Web Development",
  "coder": "Web Development",
  "programmer": "Web Development",
  "front end": "Web Development",
  "frontend": "Web Development",
  "back end": "Web Development",
  "backend": "Web Development",
  "full stack": "Web Development",
  "fullstack": "Web Development",
  "react developer": "Web Development",
  "node developer": "Web Development",
  "python developer": "Web Development",
  "wordpress developer": "Web Development",
  "shopify developer": "Web Development",
  
  // App Dev
  "app developer": "App Development",
  "mobile developer": "App Development",
  "ios developer": "App Development",
  "android developer": "App Development",
  "flutter developer": "App Development",
  
  // Designer
  "graphic designer": "Graphic Design",
  "designer": "Graphic Design",
  "logo designer": "Graphic Design",
  "brand designer": "Graphic Design",
  "branding": "Graphic Design",
  "illustrator": "Graphic Design",
  "ui designer": "Graphic Design",
  "ux designer": "Graphic Design",
  "ui/ux": "Graphic Design",
  "product designer": "Graphic Design",
  "web designer": "Graphic Design",
  "landing page designer": "Graphic Design",
  "website builder": "Graphic Design",

  // Copywriting
  "copywriter": "Content Writing",
  "copy writer": "Content Writing",
  "copies": "Content Writing",
  "blog writer": "Content Writing",
  "content creator": "Content Writing",
  "content writer": "Content Writing",
  "ghostwriter": "Content Writing",
  "ghost writer": "Content Writing",
  "technical writer": "Content Writing",
  "article writer": "Content Writing",
  "journalist": "Content Writing",
  "scriptwriter": "Content Writing",
  "script writer": "Content Writing",
  "seo writer": "Content Writing",
  "proofreader": "Content Writing",
  "editor": "Content Writing",
  "editor for hire": "Content Writing",

  // VA
  "virtual assistant": "Virtual Assistant",
  "va": "Virtual Assistant",
  "executive assistant": "Virtual Assistant",
  "admin assistant": "Virtual Assistant",
  "data entry": "Virtual Assistant",
  "calendar management": "Virtual Assistant",
  "email management": "Virtual Assistant",
  "customer support": "Virtual Assistant",
  "customer service": "Virtual Assistant",

  // Accounting
  "bookkeeper": "Accounting & CPA",
  "bookkeeping": "Accounting & CPA",
  "accountant": "Accounting & CPA",
  "cpa": "Accounting & CPA",
  "tax preparer": "Accounting & CPA",
  "financial analyst": "Accounting & CPA",

  // Photographer
  "photographer": "Photography",
  "photo editing": "Photography",
  "product photography": "Photography",
  "real estate photography": "Photography",
  "event photographer": "Photography",
  "portrait photographer": "Photography",
  "headshots": "Photography",

  // Personal Trainer
  "personal trainer": "Personal Training",
  "fitness coach": "Personal Training",
  "online coach": "Personal Training",
  "nutrition coach": "Personal Training",
  "life coach": "Personal Training",
  "business coach": "Personal Training",
  "career coach": "Personal Training",

  // Tutor
  "tutor": "Online Tutoring",
  "teacher": "Online Tutoring",
  "online tutor": "Online Tutoring",
  "math tutor": "Online Tutoring",
  "english tutor": "Online Tutoring",
  "science tutor": "Online Tutoring",

  // Translator
  "translator": "Translation",
  "interpreter": "Translation",
  "language services": "Translation",
  "bilingual": "Translation",

  // Voiceover
  "voiceover": "Voiceover",
  "voice actor": "Voiceover",
  "voice over": "Voiceover",
  "narrator": "Voiceover",
  "audio production": "Voiceover",
  "podcast editor": "Voiceover",

  // SEO / Digital Marketing
  "seo": "SEO",
  "search engine optimization": "SEO",
  "digital marketing": "Digital Marketing",
  "email marketing": "Digital Marketing",
  "marketing strategist": "Digital Marketing",
  "growth hacker": "Digital Marketing",
  "funnel builder": "Digital Marketing",
  "lead generation": "Digital Marketing",
  "facebook ads": "Digital Marketing",
  "google ads": "Digital Marketing",
  "paid ads": "Digital Marketing",

  // Social Media
  "social media manager": "Social Media",
  "social media": "Social Media",
  "instagram manager": "Social Media",
  "tiktok manager": "Social Media",
  "content scheduler": "Social Media",
  "community manager": "Social Media",

  // Video Editing
  "video editor": "Video Production",
  "video editing": "Video Production",
  "youtube editor": "Video Production",
  "reels editor": "Video Production",
  "tiktok editor": "Video Production",
  "short form video": "Video Production",
  "long form video": "Video Production",
  "motion graphics": "Video Production",
  "animator": "Video Production",
  "animation": "Video Production",

  // House Cleaning
  "house cleaner": "House Cleaning",
  "cleaning services": "House Cleaning",
  "maid service": "House Cleaning",
  "janitorial": "House Cleaning",

  // Handyman
  "handyman": "Handyman Services",
  "home repair": "Handyman Services",
  "contractor": "Handyman Services",
  "plumber": "Handyman Services",
  "electrician": "Handyman Services",
  "carpenter": "Handyman Services",

  // Landscaping
  "landscaper": "Landscaping & Lawn Care",
  "lawn care": "Landscaping & Lawn Care",
  "gardener": "Landscaping & Lawn Care",
  "tree trimming": "Landscaping & Lawn Care",

  // Pet Care
  "pet sitter": "Pet Care",
  "dog walker": "Pet Care",
  "pet care": "Pet Care",
  "animal care": "Pet Care",
  "dog trainer": "Pet Care",

  // Hairstylist
  "hair stylist": "Hairstylist",
  "hairstylist": "Hairstylist",
  "barber": "Hairstylist",
  "nail tech": "Hairstylist",

  // Makeup Artistry
  "makeup artist": "Makeup Artistry",
  "mua": "Makeup Artistry",
  "esthetician": "Makeup Artistry",
  "skincare": "Makeup Artistry",

  // Massage Therapy
  "massage therapist": "Massage Therapy",

  // Wedding Planning
  "wedding planner": "Wedding Planning",
  "event planner": "Wedding Planning",
  "event coordinator": "Wedding Planning",

  // Music Lessons
  "music teacher": "Music Lessons",
  "music lessons": "Music Lessons",
  "guitar teacher": "Music Lessons",
  "piano teacher": "Music Lessons",

  // Real Estate
  "real estate agent": "Real Estate",
  "realtor": "Real Estate",
  "mortgage broker": "Real Estate",

  // Recruiter
  "recruiter": "Training & Recruitment",
  "hr consultant": "Training & Recruitment",
  "staffing": "Training & Recruitment",
};

const LOCATION_PREFIXES = [
  "i'm in",
  "i am in",
  "i'm based in",
  "i am based in",
  "i live in",
  "located in",
  "my city is",
  "my area is",
  "clients in",
  "looking in",
  "searching in",
  "near",
  "around",
  "close to"
];

const LOCATION_KEYWORDS = [
  "united states", "us", "uk", "canada", "australia", "worldwide", "remote", "online",
  "anywhere", "globally", "international", "local", "nearby", "my neighborhood",
  "east coast", "west coast", "midwest", "southeast", "northeast", "southwest",
  "new york", "nyc", "los angeles", "la", "chicago", "houston", "phoenix", "philadelphia",
  "san antonio", "san diego", "dallas", "san jose", "austin", "jacksonville", "san francisco",
  "seattle", "denver", "nashville", "oklahoma city", "el paso", "washington dc", "boston",
  "las vegas", "portland", "louisville", "memphis", "baltimore", "milwaukee", "albuquerque",
  "tucson", "fresno", "sacramento", "kansas city", "atlanta", "omaha", "colorado springs",
  "raleigh", "miami", "minneapolis", "tampa", "new orleans", "arlington", "cleveland",
  "bakersfield", "aurora", "anaheim", "santa ana", "corpus christi", "riverside", "lexington",
  "st. louis", "pittsburgh", "stockton", "cincinnati", "anchorage", "greensboro", "plano",
  "london", "toronto", "sydney", "dubai", "lagos", "nairobi", "singapore", "berlin", "paris",
  "mexico city", "são paulo", "mumbai", "manila", "johannesburg"
];

const normalizeLocation = (loc: string): string => {
  const norm = loc.toLowerCase().trim();
  if (norm === "us") return "United States";
  if (norm === "uk") return "United Kingdom";
  if (norm === "nyc") return "New York";
  if (norm === "la") return "Los Angeles";
  if (["remote", "online", "anywhere", "globally", "worldwide", "international"].includes(norm)) return "Remote";
  return loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const BUDGET_KEYWORDS = [
  "budget", "rate", "charge", "earn", "make", "pay", "cost", "fee", "pricing", "price",
  "per hour", "an hour", "hourly", "per month", "monthly", "retainer", "per project",
  "one time", "flat rate", "flat fee", "fixed price", "negotiable", "open to offers",
  "affordable", "premium", "high end", "low budget", "tight budget", "flexible",
  "$", "dollar", "dollars", "usd", "gbp", "eur", "cad", "aud"
];

// Goal tracking removed for direct freelancer flow

const CHANGE_KEYWORDS = [
  "change", "update", "edit", "switch", "replace", "redo", "go back", "different",
  "not that", "wrong", "i meant", "actually", "let me change", "let me update",
  "i changed my mind", "scratch that", "nevermind", "start over", "reset"
];

const AFFIRMATION_KEYWORDS = [
  "yes", "yep", "yeah", "sure", "ok", "okay", "sounds good", "let's go", "go ahead",
  "do it", "run it", "search now", "find them", "show me", "let's do it", "perfect",
  "great", "awesome", "cool", "got it", "confirmed"
];

const NEGATION_KEYWORDS = [
  "no", "nope", "not yet", "hold on", "wait", "actually no", "stop", "pause",
  "let me think", "give me a second", "not sure", "i don't know", "skip that",
  "maybe later", "not now", "skip", "i dont know"
];

function getCategoryParam(catLabel: string | null): string {
  if (!catLabel) return "local_business";
  if (CATEGORY_MAP[catLabel]) return CATEGORY_MAP[catLabel];

  const norm = catLabel.toLowerCase();
  if (norm.includes("web")) return "web_dev";
  if (norm.includes("design")) return "designer";
  if (norm.includes("assist") || norm.includes("va")) return "va";
  if (norm.includes("writ") || norm.includes("copy")) return "copywriter";
  if (norm.includes("trans")) return "translation";
  if (norm.includes("train") || norm.includes("fitness")) return "personal_trainer";
  if (norm.includes("landscape") || norm.includes("lawn")) return "landscaping";
  if (norm.includes("hair")) return "hairstylist";
  if (norm.includes("makeup") || norm.includes("mua")) return "makeup_artist";
  if (norm.includes("voice")) return "voiceover";
  if (norm.includes("account") || norm.includes("cpa")) return "accounting";
  if (norm.includes("handy")) return "handyman";
  if (norm.includes("wed")) return "wedding_planner";
  if (norm.includes("mass")) return "massage_therapist";
  if (norm.includes("music") || norm.includes("piano") || norm.includes("guitar")) return "music_teacher";
  if (norm.includes("pet") || norm.includes("dog") || norm.includes("cat")) return "pet_care";
  if (norm.includes("clean")) return "house_cleaning";
  if (norm.includes("seo")) return "seo";
  if (norm.includes("social")) return "social_media";
  if (norm.includes("video")) return "video";
  if (norm.includes("photo")) return "photography";
  if (norm.includes("market")) return "marketing";
  if (norm.includes("app")) return "app_dev";
  if (norm.includes("tutor")) return "tutor";
  if (norm.includes("recruit") || norm.includes("hr") || norm.includes("staff")) return "training_recruitment";
  if (norm.includes("real estate") || norm.includes("realtor") || norm.includes("mortgage")) return "real_estate";

  return "local_business";
}

function resolveCountryFromCity(city: string | null): string {
  if (!city) return "Nigeria";

  const cleanVal = city.trim();
  
  // Check if user specified a country/state using comma notation (e.g. "Paris, France" or "Dallas, TX")
  if (cleanVal.includes(",")) {
    const parts = cleanVal.split(",");
    const potentialRegion = parts[parts.length - 1].trim().toLowerCase();

    // Check if US State/Abbreviation
    const isUsState = US_STATES.some(state => 
      state.state.toLowerCase() === potentialRegion || 
      state.abbr.toLowerCase() === potentialRegion
    );
    if (isUsState || ["us", "usa", "united states"].includes(potentialRegion)) {
      return "United States";
    }

    // Check if Global Country
    for (const region of GLOBAL_REGIONS) {
      for (const country of region.countries) {
        if (country.country.toLowerCase() === potentialRegion || country.slug === potentialRegion) {
          return country.country;
        }
      }
    }

    // Capitalize fallback
    return potentialRegion.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const slug = cleanVal.toLowerCase().replace(/\s+/g, "-");
  const country = getCountry(slug);
  if (country) return country;

  // Check if the input itself matches a country name directly
  for (const region of GLOBAL_REGIONS) {
    for (const country of region.countries) {
      if (country.country.toLowerCase() === cleanVal.toLowerCase()) {
        return country.country;
      }
    }
  }

  // Check if US State name directly
  const isUsStateDirect = US_STATES.some(state => 
    state.state.toLowerCase() === cleanVal.toLowerCase() || 
    state.abbr.toLowerCase() === cleanVal.toLowerCase()
  );
  if (isUsStateDirect || ["us", "usa", "united states"].includes(cleanVal.toLowerCase())) {
    return "United States";
  }

  return "Nigeria";
}

const OPENING_TEXT = `Hey there 👋 I'm the LanceConnect Assistant — here to help you find real clients, fast, with zero bidding wars and zero platform commissions.

LanceConnect connects freelancers directly with local and global clients across every category — web development, design, writing, virtual assistance, pet care, home services, and more.

To get you matched with the right opportunities, I just need a few quick details:

1. What type of work do you do (your category/service)?
2. Where are you (or your clients) located?
3. What's your target budget or rate?
4. What's your experience level?

Let's start — what's your main service or specialty?`;

const OPENING_MESSAGE: Message = {
  id: "opening",
  sender: "assistant",
  text: OPENING_TEXT,
  timestamp: new Date(),
  quickReplies: [
    "Web Development",
    "Graphic Design",
    "Virtual Assistant",
    "Content Writing",
    "Pet Care",
    "Something Else",
  ],
};

// LanceConnect "LC" Wave Logo — blue-to-teal gradient, used as chat bubble icon & assistant avatar
function LCWaveLogo({ className, size = 24 }: { className?: string; size?: number }) {
  const id = `lc-grad-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D6CFF" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Left lobe */}
      <circle cx="14" cy="20" r="7" fill={`url(#${id})`} />
      {/* Right lobe */}
      <circle cx="26" cy="20" r="7" fill={`url(#${id})`} opacity="0.85" />
      {/* Connector line */}
      <path d="M14 20L26 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Wave accent */}
      <path
        d="M16 20C17.8 17.8 19.2 17.8 22 20C24.8 22.2 26.2 22.2 28 20"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface IntentExample {
  id: number;
  patterns: string[];
  reply: string;
  slotToFill?: keyof Slots;
  slotValue?: string;
}

const INTENT_EXAMPLES: IntentExample[] = [
  {
    id: 1,
    patterns: [
      "i'm a copywriter",
      "i am a copywriter",
      "copywriter",
      "copywriting",
      "do copywriting",
      "write copy",
      "copy writer",
      "copies",
      "blog writer",
      "content creator",
      "content writer",
      "ghostwriter",
      "ghost writer",
      "technical writer",
      "article writer",
      "journalist",
      "scriptwriter",
      "script writer",
      "seo writer",
      "proofreader",
      "editor",
      "editor for hire"
    ],
    reply:
      "Got it — copywriting and writing services! That's a high-demand category on LanceConnect. Are you focused on a specific niche, like sales pages, email sequences, or SEO blog content? And where are you (or your ideal clients) located?",
    slotToFill: "category",
    slotValue: "Content Writing",
  },
  {
    id: 2,
    patterns: [
      "i do web design",
      "web design",
      "web designer",
      "website design",
      "designing websites",
      "ui/ux design",
      "graphic designer",
      "designer",
      "logo designer",
      "brand designer",
      "branding",
      "illustrator",
      "ui designer",
      "ux designer",
      "ui/ux",
      "product designer",
      "web designer",
      "landing page designer",
      "website builder"
    ],
    reply:
      "Awesome — design is one of our most active categories. Are you more focused on UI/UX, branding/logos, or full web design builds? Let's find clients near you — what city or region should I search?",
    slotToFill: "category",
    slotValue: "Graphic Design",
  },
  {
    id: 3,
    patterns: [
      "i'm a web developer",
      "i am a web developer",
      "web developer",
      "web development",
      "do web dev",
      "software developer",
      "coder",
      "programmer",
      "web dev",
      "developer",
      "front end",
      "frontend",
      "back end",
      "backend",
      "full stack",
      "fullstack",
      "react developer",
      "node developer",
      "python developer",
      "wordpress developer",
      "shopify developer"
    ],
    reply:
      "Web development — great choice. Do you specialize in front-end, back-end, or full-stack? I'll use that to fine-tune your client search. What's your target location?",
    slotToFill: "category",
    slotValue: "Web Development",
  },
  {
    id: 4,
    patterns: [
      "virtual assistant",
      "i am a virtual assistant",
      "i'm a virtual assistant",
      "va",
      "admin support",
      "assistant work",
      "administrative assistant",
      "executive assistant",
      "admin assistant",
      "data entry",
      "calendar management",
      "email management",
      "customer support",
      "customer service"
    ],
    reply:
      "Virtual assistants are in huge demand right now. Do you focus on admin support, email management, scheduling, or something more specialized like e-commerce VA work? Where are your ideal clients based?",
    slotToFill: "category",
    slotValue: "Virtual Assistant",
  },
  {
    id: 5,
    patterns: [
      "i watch pets / pet sitting",
      "i watch pets",
      "pet sitting",
      "pet care",
      "dog walker",
      "dog sitting",
      "cat sitting",
      "pet sitter",
      "watch pets",
      "animal care",
      "dog trainer"
    ],
    reply:
      "Pet care — love it! Local pet owners and small business owners (groomers, vets, boarding facilities) often need reliable help. What city should I search for pet care clients near you?",
    slotToFill: "category",
    slotValue: "Pet Care",
  },
  {
    id: 7,
    patterns: [
      "i do social media management",
      "social media manager",
      "social media management",
      "manage social media",
      "instagram manager",
      "tiktok manager",
      "social media",
      "content scheduler",
      "community manager"
    ],
    reply:
      "Social media management is one of the fastest-growing categories on LanceConnect. Do you specialize in a platform (Instagram, TikTok, LinkedIn) or industry (restaurants, real estate, salons)? What's your target city?",
    slotToFill: "category",
    slotValue: "Social Media",
  },
  {
    id: 8,
    patterns: [
      "i'm a video editor",
      "i am a video editor",
      "video editor",
      "video editing",
      "edit videos",
      "video maker",
      "youtube editor",
      "reels editor",
      "tiktok editor",
      "short form video",
      "long form video"
    ],
    reply:
      "Video editing — great. Are you mainly doing YouTube content, short-form (Reels/TikTok), or corporate/commercial work? Where should I focus the client search?",
    slotToFill: "category",
    slotValue: "Video Production",
  },
  {
    id: 9,
    patterns: [
      "i do bookkeeping",
      "bookkeeper",
      "bookkeeping",
      "keep books",
      "accounting assistant",
      "quickbooks bookkeeping",
      "accountant",
      "cpa",
      "tax preparer",
      "financial analyst"
    ],
    reply:
      "Bookkeeping and accounting is a steady, recurring-revenue category — nice pick. Do you work with a specific software (QuickBooks, Xero) or industry niche? What location are you targeting?",
    slotToFill: "category",
    slotValue: "Accounting & CPA",
  },
  {
    id: 10,
    patterns: [
      "i'm a photographer",
      "i am a photographer",
      "photographer",
      "photography",
      "take photos",
      "shoot photos",
      "photo editing",
      "product photography",
      "real estate photography",
      "event photographer",
      "portrait photographer",
      "headshots"
    ],
    reply:
      "Photography — got it. Are you focused on portraits, products, events, or real estate photography? Let's find clients in your area — what city are you in?",
    slotToFill: "category",
    slotValue: "Photography",
  },
  {
    id: 11,
    patterns: [
      "i do translation work",
      "translation",
      "translator",
      "translate",
      "translating",
      "language translation",
      "interpreter",
      "language services",
      "bilingual"
    ],
    reply:
      "Translation — excellent, that's a globally in-demand skill. What language pairs do you work with, and do you have a preferred region or are you open to remote clients worldwide?",
    slotToFill: "category",
    slotValue: "Translation",
  },
  {
    id: 12,
    patterns: [
      "i'm a personal trainer looking for clients",
      "i am a personal trainer",
      "personal trainer",
      "personal training",
      "fitness coach",
      "gym trainer",
      "online coach",
      "nutrition coach",
      "life coach",
      "business coach",
      "career coach"
    ],
    reply:
      "Coaching and personal training — got it. Are you offering fitness coaching, life coaching, or business/career development? What city or area should I focus the search on?",
    slotToFill: "category",
    slotValue: "Personal Training",
  },
  {
    id: 13,
    patterns: [
      "i clean houses / cleaning services",
      "i clean houses",
      "cleaning services",
      "house cleaning",
      "cleaner",
      "maid service",
      "commercial cleaning",
      "house cleaner",
      "janitorial"
    ],
    reply:
      "Cleaning services are a great local category with consistent demand. Are you looking for residential clients, commercial (offices), or both? What's your service area?",
    slotToFill: "category",
    slotValue: "House Cleaning",
  },
  {
    id: 14,
    patterns: [
      "i do landscaping/lawn care",
      "i do landscaping",
      "lawn care",
      "landscaping",
      "gardening",
      "mow lawns",
      "landscaper",
      "gardener",
      "tree trimming"
    ],
    reply:
      "Landscaping and lawn care — perfect, very high local search volume. What's your service radius or target city?",
    slotToFill: "category",
    slotValue: "Landscaping & Lawn Care",
  },
  {
    id: 15,
    patterns: [
      "i'm a hairstylist",
      "i am a hairstylist",
      "hairstylist",
      "hair stylist",
      "hair salon",
      "cut hair",
      "barber",
      "nail tech"
    ],
    reply:
      "Hairstylist or beauty technician — got it! Salon services are in high demand. What city should I search for salon leads near you?",
    slotToFill: "category",
    slotValue: "Hairstylist",
  },
  {
    id: 16,
    patterns: [
      "i'm a makeup artist",
      "i am a makeup artist",
      "makeup artist",
      "mua",
      "makeup artistry",
      "apply makeup",
      "esthetician",
      "skincare"
    ],
    reply:
      "Makeup artistry and skincare — love it. Are you focused on bridal, editorial, or everyday glam clients? What city should I search?",
    slotToFill: "category",
    slotValue: "Makeup Artistry",
  },
  {
    id: 17,
    patterns: [
      "i'm a tutor",
      "i am a tutor",
      "tutor",
      "tutoring",
      "teach students",
      "teacher",
      "academic tutor",
      "online tutor",
      "math tutor",
      "english tutor",
      "science tutor"
    ],
    reply:
      "Tutoring and teaching — great category. What subject(s) and grade level or age group do you specialize in, and are you looking for local or online students?",
    slotToFill: "category",
    slotValue: "Online Tutoring",
  },
  {
    id: 18,
    patterns: [
      "i do voiceover work",
      "voiceover",
      "voice actor",
      "voice acting",
      "voice artist",
      "vo work",
      "voice over",
      "narrator",
      "audio production",
      "podcast editor"
    ],
    reply:
      "Voiceover and audio production — nice, fully remote-friendly category. What types of projects (commercials, audiobooks, e-learning)? Since this is remote, do you want me to search broadly or focus on a specific timezone?",
    slotToFill: "category",
    slotValue: "Voiceover",
  },
  {
    id: 20,
    patterns: [
      "i do handyman work",
      "handyman",
      "handyperson",
      "home repairs",
      "general repairs",
      "fix things",
      "home repair",
      "contractor",
      "plumber",
      "electrician",
      "carpenter"
    ],
    reply:
      "Handyman and contractor services — perfect for local leads. What's your specialty (general repairs, electrical, plumbing, carpentry) and what's your service area?",
    slotToFill: "category",
    slotValue: "Handyman Services",
  },
  {
    id: 21,
    patterns: [
      "i'm a wedding planner",
      "i am a wedding planner",
      "wedding planner",
      "wedding planning",
      "event planner",
      "coordinate weddings",
      "event coordinator"
    ],
    reply:
      "Wedding and event planning — exciting! Are you full-service or day-of coordination? What's your primary market city?",
    slotToFill: "category",
    slotValue: "Wedding Planning",
  },
  {
    id: 22,
    patterns: [
      "i do app development",
      "app developer",
      "app dev",
      "ios developer",
      "android developer",
      "mobile app developer",
      "mobile developer",
      "flutter developer"
    ],
    reply:
      "App development — strong demand category. iOS, Android, or cross-platform (Flutter/React Native)? Are you targeting local startups or open to remote clients?",
    slotToFill: "category",
    slotValue: "App Development",
  },
  {
    id: 23,
    patterns: [
      "i'm a massage therapist",
      "i am a massage therapist",
      "massage therapist",
      "massage therapy",
      "give massages"
    ],
    reply:
      "Massage therapy — got it. Are you mobile/in-home, or working from a studio? What city should I focus on?",
    slotToFill: "category",
    slotValue: "Massage Therapy",
  },
  {
    id: 24,
    patterns: [
      "i do seo / digital marketing",
      "seo",
      "digital marketing",
      "seo specialist",
      "seo marketing",
      "search engine optimization",
      "digital marketer",
      "email marketing",
      "marketing strategist",
      "growth hacker",
      "funnel builder",
      "lead generation",
      "facebook ads",
      "google ads",
      "paid ads"
    ],
    reply:
      "SEO and digital marketing — that's actually built right into the LanceConnect mission! Do you focus on local SEO, email marketing, paid ads, or content marketing? What's your target market?",
    slotToFill: "category",
    slotValue: "SEO",
  },
  {
    id: 25,
    patterns: [
      "i'm a music teacher",
      "i am a music teacher",
      "music teacher",
      "music lessons",
      "piano teacher",
      "guitar teacher",
      "teach music"
    ],
    reply:
      "Music lessons — great, recurring-client category. What instrument(s) do you teach, and are lessons in-person or online?",
    slotToFill: "category",
    slotValue: "Music Lessons",
  },
  {
    id: 60,
    patterns: [
      "recruiter",
      "hr consultant",
      "staffing"
    ],
    reply:
      "Recruitment and HR consulting — excellent. We can search for companies that are expanding, opening new offices, or posting jobs to find your next staffing partner or corporate client. Where should I search?",
    slotToFill: "category",
    slotValue: "Training & Recruitment",
  },
  {
    id: 61,
    patterns: [
      "real estate agent",
      "realtor",
      "mortgage broker"
    ],
    reply:
      "Real estate and mortgage services — perfect. Local agencies, property developers, and buyers/sellers are always in need of help. What city or area should we target?",
    slotToFill: "category",
    slotValue: "Real Estate",
  },
  {
    id: 62,
    patterns: [
      "motion graphics",
      "animator",
      "animation"
    ],
    reply:
      "Animation and motion graphics are fantastic skills. Are you doing 2D/3D character animation, explainer videos, or social media motion graphics? What is your target city or area?",
    slotToFill: "category",
    slotValue: "Video Production",
  },
  {
    id: 26,
    patterns: ["i'm in seattle", "i am in seattle", "based in seattle", "seattle", "seattle wa"],
    reply:
      "Seattle — I see that's already one of your saved search regions. Want me to refresh your search there or expand to a nearby city like Portland or Tacoma?",
    slotToFill: "location",
    slotValue: "Seattle",
  },
  {
    id: 27,
    patterns: [
      "my clients are in los angeles",
      "los angeles",
      "la",
      "clients in la",
      "based in los angeles",
      "l.a.",
    ],
    reply:
      "Los Angeles — got it, that's already on your pipeline map too. I'll prioritize LA leads in your category. Anything specific about LA you're targeting, like a particular neighborhood or industry?",
    slotToFill: "location",
    slotValue: "Los Angeles",
  },
  {
    id: 265,
    patterns: [
      "i'm in lagos",
      "i am in lagos",
      "based in lagos",
      "lagos",
      "lagos nigeria",
      "lagos, nigeria",
    ],
    reply:
      "Lagos — got it, the tech and business hub of West Africa! I can prioritize leads in Lagos or look for opportunities across Nigeria. Are you targeting businesses in Ikeja, Lekki, or another specific area?",
    slotToFill: "location",
    slotValue: "Lagos",
  },
  {
    id: 28,
    patterns: [
      "i work remotely, no specific location",
      "i work remotely",
      "no specific location",
      "remote",
      "remote work",
      "work from home",
      "anywhere",
      "worldwide",
    ],
    reply:
      "No problem — remote work opens up a much wider pool. Want me to search broadly across major U.S. markets, or focus on a specific country/timezone for easier collaboration?",
    slotToFill: "location",
    slotValue: "Remote",
  },
  {
    id: 29,
    patterns: ["anywhere in texas", "texas", "tx", "cities in texas", "texas cities"],
    reply:
      "Texas — got it. I can search across major Texas cities like Houston, Austin, Dallas, and San Antonio. Want me to run all four, or pick one to start?",
    slotToFill: "location",
    slotValue: "Texas",
  },
  {
    id: 30,
    patterns: [
      "outside the us, i'm based in the uk",
      "outside the us",
      "i'm based in the uk",
      "uk",
      "united kingdom",
      "britain",
      "england",
      "based in uk",
    ],
    reply:
      "Great — LanceConnect supports global searches. Should I focus on London specifically, or search across the UK more broadly?",
    slotToFill: "location",
    slotValue: "United Kingdom",
  },
  {
    id: 31,
    patterns: [
      "i charge $50 an hour",
      "50 an hour",
      "$50/hour",
      "$50 an hour",
      "50 per hour",
      "50/hr",
      "$50/hr",
    ],
    reply:
      "$50/hour — noted. That'll help me filter for clients whose typical project budgets align with that rate. Want me to set that as your default rate for proposals too?",
    slotToFill: "budget",
    slotValue: "$50/hr",
  },
  {
    id: 32,
    patterns: [
      "my budget is around $2000 for a project",
      "my budget is around $2000",
      "$2000 for a project",
      "budget is 2000",
      "2000 project",
      "$2000 budget",
      "project budget $2000",
    ],
    reply:
      "$2,000 project budget — got it. I'll prioritize leads whose project size matches that range. Is this a one-time project or could it lead to ongoing work?",
    slotToFill: "budget",
    slotValue: "$2,000",
  },
  {
    id: 33,
    patterns: [
      "i'm not sure what to charge",
      "i am not sure what to charge",
      "not sure what to charge",
      "dont know what to charge",
      "don't know what to charge",
      "unsure of rates",
      "unsure about rates",
    ],
    reply:
      "No worries — that's really common starting out. Based on your category and location, I can show you typical market rates so you can set a competitive starting price. Want me to pull those benchmarks?",
    slotToFill: "budget",
    slotValue: "Unsure",
  },
  {
    id: 34,
    patterns: [
      "i want at least $30/hr",
      "at least 30",
      "at least $30/hr",
      "minimum $30",
      "minimum 30/hr",
      "at least 30/hour",
    ],
    reply:
      "$30/hour minimum — got it, I'll use that as a baseline filter so we don't waste time on underpriced leads.",
    slotToFill: "budget",
    slotValue: "$30/hr",
  },
  {
    id: 35,
    patterns: [
      "i do retainer work, $1500/month",
      "i do retainer work",
      "$1500/month",
      "$1500 a month",
      "retainer of 1500",
      "monthly retainer",
      "1500 per month",
    ],
    reply:
      "Monthly retainers at $1,500 — that's a solid recurring-revenue target. I'll flag leads that look like good fits for ongoing monthly arrangements.",
    slotToFill: "budget",
    slotValue: "$1,500/mo retainer",
  },
  {
    id: 36,
    patterns: [
      "i'm just starting out",
      "i am just starting out",
      "just starting out",
      "beginner",
      "junior",
      "no experience",
      "start out",
      "starting out",
      "newbie",
    ],
    reply:
      "Welcome to freelancing! As a beginner, I'd recommend starting with smaller, lower-pressure projects to build reviews and a portfolio. I'll prioritize leads marked as good for newer freelancers.",
    slotToFill: "experience_level",
    slotValue: "Beginner",
  },
  {
    id: 37,
    patterns: [
      "i've been doing this for 10 years",
      "doing this for 10 years",
      "10 years experience",
      "10 years of experience",
      "ten years",
      "veteran",
    ],
    reply:
      "10 years of experience — that's excellent, you can confidently target premium-rate clients. I'll prioritize leads that match a higher budget tier.",
    slotToFill: "experience_level",
    slotValue: "Expert",
  },
  {
    id: 38,
    patterns: [
      "i'm intermediate, maybe 2-3 years",
      "i'm intermediate",
      "intermediate",
      "2-3 years",
      "two to three years",
      "2 or 3 years",
      "mid-level",
      "mid level",
    ],
    reply:
      "2-3 years — solid middle ground. You're past the beginner stage but still building your reputation. I'll balance the search between growth opportunities and steady-paying clients.",
    slotToFill: "experience_level",
    slotValue: "Intermediate",
  },
  {
    id: 39,
    patterns: [
      "i'm an expert in my field",
      "i am an expert",
      "expert in my field",
      "expert",
      "senior developer",
      "highly experienced",
      "pro",
    ],
    reply:
      "Expert level — great, I'll prioritize premium leads and larger projects that match your skill level.",
    slotToFill: "experience_level",
    slotValue: "Expert",
  },
  {
    id: 40,
    patterns: [
      "i have a portfolio but no paid clients yet",
      "i have a portfolio",
      "no paid clients yet",
      "portfolio but no clients",
      "have samples but no clients",
      "portfolio only",
    ],
    reply:
      "That's a great foundation! Having a portfolio puts you ahead. I'll focus on leads that are open to newer freelancers with strong samples — your portfolio will do a lot of the talking.",
    slotToFill: "experience_level",
    slotValue: "Beginner",
  },
  {
    id: 41,
    patterns: [
      "how does lanceconnect work",
      "how does this work",
      "how does it work",
      "what is lanceconnect",
      "explain lanceconnect",
    ],
    reply:
      "LanceConnect connects freelancers directly with clients — no bidding wars, no commission cuts. You search for local businesses or clients in your category, get verified contact info (phone, email, website), and reach out directly. We also help clients find vetted freelancers the same way.",
  },
  {
    id: 42,
    patterns: [
      "is there a fee",
      "does it cost money",
      "free",
      "pricing",
      "fees",
      "commission",
      "do i have to pay",
      "subscription fee",
    ],
    reply:
      "LanceConnect operates on a 0% platform commission model — what you earn is yours. There may be optional premium features for advanced search and lead tools, but core connections are commission-free.",
  },
  {
    id: 43,
    patterns: [
      "how do i save a lead",
      "save lead",
      "saving leads",
      "how to save lead",
      "bookmark lead",
    ],
    reply:
      "Easy — when you see a business or client card in your 'Discovered Businesses' list, just tap the green 'Save Lead' button. It'll be added to your saved pipeline for follow-up.",
  },
  {
    id: 44,
    patterns: [
      "what does the score next to each business mean",
      "what does the score mean",
      "lead quality score",
      "quality score",
      "leads score",
      "score next to business",
      "what is the score",
    ],
    reply:
      "That's our Lead Quality Score — it factors in things like how complete their contact info is, their online presence, and how good of a fit they are for your category. Higher scores (green) mean stronger leads.",
  },
  {
    id: 45,
    patterns: [
      "can i export my leads",
      "export csv",
      "export leads",
      "download csv",
      "download leads",
      "export spreadsheet",
    ],
    reply:
      "Yes! Use the 'Export CSV' button above your Discovered Businesses list to download all your current leads as a spreadsheet.",
  },
  {
    id: 46,
    patterns: [
      "what's the heatmap for",
      "what is the heatmap for",
      "heatmap",
      "global heatmap",
      "map markers",
      "what's the heatmap",
    ],
    reply:
      "The Pipeline Global Heatmap shows where your saved prospects and active search areas are located worldwide. It's a quick visual of your pipeline's geographic spread — tap any region marker to see saved leads and stats for that area.",
  },
  {
    id: 47,
    patterns: [
      "how do i contact a lead",
      "how to contact",
      "contact lead",
      "reach out",
      "send message to business",
    ],
    reply:
      "Tap 'Quick Connect' on any business card to open a pre-drafted message you can send via email or your preferred channel — it's customized based on your category and their info.",
  },
  {
    id: 48,
    patterns: [
      "what's a quick connect message",
      "what is a quick connect message",
      "quick connect",
      "quick connect message",
      "outreach template message",
    ],
    reply:
      "It's a short, professional outreach message I help generate based on the lead's business type and your services — designed to get a reply, not get filtered as spam.",
  },
  {
    id: 49,
    patterns: [
      "can i change my category later",
      "change category",
      "update category",
      "change my service",
      "update service",
    ],
    reply:
      "Absolutely — just update it anytime in the 'My Category / Service' dropdown on your dashboard, or tell me here and I'll update it for you.",
  },
  {
    id: 50,
    patterns: [
      "i'm a client looking to hire someone",
      "i am a client looking to hire",
      "looking to hire",
      "client looking to hire",
      "i want to hire",
      "hire someone",
      "need to hire",
    ],
    reply:
      "Welcome! LanceConnect works both ways — I can help you find a vetted freelancer. What kind of work do you need done, and what's your location and budget?",
  },
  {
    id: 51,
    patterns: [
      "i need a logo designed",
      "logo design",
      "need a logo",
      "hire a logo designer",
      "want a logo",
    ],
    reply:
      "Got it — sounds like you're looking for a graphic/brand designer. What's your budget range for the logo, and what city or region are you located in? I'll pull some matched freelancers.",
  },
  {
    id: 52,
    patterns: [
      "i need someone to manage my instagram",
      "manage instagram",
      "instagram management",
      "manage social media",
      "instagram manager",
    ],
    reply:
      "That falls under social media management. What's your monthly budget for this, and where's your business located? I can find local or remote specialists.",
  },
  {
    id: 53,
    patterns: [
      "how accurate is the contact info",
      "accurate contact",
      "is contact info correct",
      "verified emails",
      "verified phone numbers",
    ],
    reply:
      "We verify contact details where possible — phone, email, and website — and clearly mark when info like email or website isn't available, so you always know what you're working with.",
  },
  {
    id: 54,
    patterns: [
      "do you have leads outside the us",
      "leads outside us",
      "leads outside the united states",
      "global leads",
      "international leads",
    ],
    reply:
      "Yes — LanceConnect supports global searches. Just tell me the country or city you're interested in, and I'll run the search for that region.",
  },
  {
    id: 55,
    patterns: [
      "i'm a freelance writer",
      "i am a freelance writer",
      "freelance writer",
      "content writer",
      "writing services",
      "articles writer",
    ],
    reply:
      "Freelance writing — great, very versatile category. Do you specialize in blog content, copywriting, technical writing, or ghostwriting? And what's your target location or are you open to remote clients?",
    slotToFill: "category",
    slotValue: "Content Writing",
  },
  {
    id: 56,
    patterns: [
      "thanks, that's all for now",
      "thanks that is all for now",
      "thanks",
      "that's all",
      "thank you",
      "all for now",
      "goodbye",
      "done",
    ],
    reply:
      "You're all set! Your details are saved, and I've updated your dashboard filters. Good luck out there — I'll be here if you need anything else. 👋",
  },
];

const getConfirmationReply = (intent: IntentExample): string => {
  if (!intent.slotToFill) return intent.reply;

  const questionStarters = [
    "are you", "where are", "let's find", "do you", "what city", "what location",
    "what is", "is this", "want me", "what's your", "where should", "where is",
    "what monthly", "do we need", "should i", "anything specific"
  ];
  let text = intent.reply;

  if (text.includes("?")) {
    const parts = text.split("?");
    text = parts[0].trim();
    
    const lastPuncIndex = Math.max(text.lastIndexOf("."), text.lastIndexOf("!"), text.lastIndexOf(";"));
    if (lastPuncIndex > 10) {
      const lastSentence = text.substring(lastPuncIndex + 1).toLowerCase().trim();
      if (questionStarters.some(starter => lastSentence.startsWith(starter) || lastSentence.includes(starter))) {
        text = text.substring(0, lastPuncIndex + 1).trim();
      }
    }
  }

  return text;
};

function findBestMatchedIntent(text: string): IntentExample | null {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .replace(/fifty/g, "50")
      .replace(/thirty/g, "30")
      .replace(/twenty/g, "20")
      .replace(/ten/g, "10")
      .replace(/thousand/g, "1000")
      .replace(/[^\w\s$/-]/g, "")
      .trim();

  const cleanedInput = clean(text);

  // 1. Exact or clear substring matching
  for (const intent of INTENT_EXAMPLES) {
    for (const pattern of intent.patterns) {
      const cleanedPattern = clean(pattern);
      if (cleanedInput === cleanedPattern || cleanedInput === pattern.toLowerCase()) {
        return intent;
      }
    }
  }

  // 2. Token overlap similarity matching
  const getWords = (str: string) => {
    return new Set(
      str
        .split(/\s+/)
        .filter(
          (w) =>
            ![
              "i",
              "im",
              "a",
              "an",
              "the",
              "my",
              "in",
              "do",
              "for",
              "to",
              "is",
              "are",
              "work",
              "looking",
              "some",
              "someone",
              "any",
              "get",
              "with",
              "do",
              "does",
              "did",
              "have",
              "has",
              "had",
            ].includes(w),
        ),
    );
  };

  const isSimilarWord = (w1: string, w2: string) => {
    if (w1.length <= 2 || w2.length <= 2) {
      return w1 === w2;
    }
    return (
      w1 === w2 || w1.startsWith(w2) || w2.startsWith(w1) || w1.includes(w2) || w2.includes(w1)
    );
  };

  const inputWords = getWords(cleanedInput);
  if (inputWords.size === 0) return null;

  let bestIntent: IntentExample | null = null;
  let maxScore = 0;

  for (const intent of INTENT_EXAMPLES) {
    for (const pattern of intent.patterns) {
      const patternWords = getWords(clean(pattern));
      if (patternWords.size === 0) continue;

      const intersect = new Set(
        [...inputWords].filter((iw) => [...patternWords].some((pw) => isSimilarWord(iw, pw))),
      );

      const unionSize = inputWords.size + patternWords.size - intersect.size;
      const score = intersect.size / unionSize;

      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    }
  }

  if (bestIntent && maxScore >= 0.35) {
    return bestIntent;
  }

  return null;
}

export function AssistantChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [slots, setSlots] = useState<Slots>(INITIAL_SLOTS);
  const [currentUnfilledSlot, setCurrentUnfilledSlot] = useState<keyof Slots | null>("category");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-save slots to localStorage on change
  useEffect(() => {
    if (slots.category || slots.location || slots.budget || slots.experience_level) {
      localStorage.setItem("lc_chat_slots", JSON.stringify(slots));
    }
  }, [slots]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, isOpen]);

  // Natural Language Slot Parser
  const parseSlotsFromInput = (text: string, expectedSlot: keyof Slots | null): Partial<Slots> => {
    const parsed: Partial<Slots> = {};
    const lower = text.toLowerCase().trim();

    // (goal extraction removed)

    // 2. Category extraction
    const sortedCatKeywords = Object.keys(KEYWORD_TO_CATEGORY).sort((a, b) => b.length - a.length);
    for (const kw of sortedCatKeywords) {
      if (lower.includes(kw)) {
        parsed.category = KEYWORD_TO_CATEGORY[kw];
        break;
      }
    }

    // 3. Location extraction
    let locationCandidate = "";
    for (const kw of LOCATION_KEYWORDS) {
      if (lower === kw || lower.startsWith(kw + " ") || lower.endsWith(" " + kw) || lower.includes(" " + kw + " ")) {
        locationCandidate = kw;
        break;
      }
    }

    if (!locationCandidate) {
      for (const pref of LOCATION_PREFIXES) {
        if (lower.startsWith(pref)) {
          locationCandidate = text.substring(pref.length).trim();
          break;
        }
      }
    }

    if (locationCandidate) {
      parsed.location = normalizeLocation(locationCandidate);
    } else if (expectedSlot === "location" && text.trim().length > 0) {
      parsed.location = normalizeLocation(text);
    }

    // 4. Experience level extraction
    const beginnerKeywords = ["beginner", "just starting", "new to this", "starting out", "no experience", "entry level", "junior", "fresh", "learning", "building my portfolio"];
    const intermediateKeywords = ["intermediate", "some experience", "a few years", "2 years", "3 years", "mid level", "growing", "improving"];
    const expertKeywords = ["expert", "senior", "experienced", "veteran", "professional", "specialist", "years of experience", "decade", "seasoned", "advanced", "certified", "licensed"];

    if (beginnerKeywords.some(k => lower.includes(k))) {
      parsed.experience_level = "Beginner";
    } else if (intermediateKeywords.some(k => lower.includes(k))) {
      parsed.experience_level = "Intermediate";
    } else if (expertKeywords.some(k => lower.includes(k))) {
      parsed.experience_level = "Expert";
    }

    // 5. Budget extraction
    const budgetRegex = /(\$\d+(?:,\d+)*(?:\/\w+)?|\d+\s*(?:usd|gbp|ngn|eur|cad|aud|dollars|pounds|euros)|rate\s*of\s*\d+|budget\s*of\s*\d+)/gi;
    const match = lower.match(budgetRegex);
    if (match) {
      parsed.budget = match[0];
    } else {
      const hasBudgetKeyword = BUDGET_KEYWORDS.some(k => lower.includes(k));
      if (hasBudgetKeyword) {
        if (lower.includes("negotiable")) parsed.budget = "Negotiable";
        else if (lower.includes("flexible")) parsed.budget = "Flexible";
        else if (lower.includes("open to offers")) parsed.budget = "Open to offers";
        else if (lower.includes("high end") || lower.includes("premium")) parsed.budget = "Premium / High End";
        else if (lower.includes("tight budget") || lower.includes("low budget")) parsed.budget = "Flexible / Low Budget";
        else if (expectedSlot === "budget") {
          parsed.budget = text;
        }
      }
    }

    // 6. Direct filling for current unfilled slot if parsing failed
    if (expectedSlot === "category" && !parsed.category) {
      if (lower !== "something else") {
        parsed.category = text;
      }
    } else if (expectedSlot === "location" && !parsed.location) {
      parsed.location = normalizeLocation(text);
    } else if (expectedSlot === "budget" && !parsed.budget) {
      parsed.budget = text;
    } else if (expectedSlot === "experience_level" && !parsed.experience_level) {
      parsed.experience_level = text;
    }

    return parsed;
  };

  const getBotPromptForNextSlot = (
    currentSlots: Slots,
  ): { text: string; quickReplies?: string[] } => {
    if (!currentSlots.category) {
      return {
        text: "What type of work do you do (your category or specialty)?",
        quickReplies: [
          "Web Development",
          "Graphic Design",
          "Virtual Assistant",
          "Content Writing",
          "Pet Care",
          "Something Else",
        ],
      };
    }
    if (!currentSlots.location) {
      return {
        text: "Where are you (or your clients) located? Please type a city name (e.g. Lagos, London, or Austin).",
      };
    }
    if (!currentSlots.budget) {
      return {
        text: "What's your target budget or rate? (e.g. $50/hr or $2,000 project budget)",
      };
    }
    if (!currentSlots.experience_level) {
      return {
        text: "What's your experience level?",
        quickReplies: ["Beginner", "Intermediate", "Expert"],
      };
    }

    const summaryText = `Perfect — here's what I've got:

📂 Category: ${currentSlots.category}
📍 Location: ${currentSlots.location}
💰 Target Budget: ${currentSlots.budget}
⭐ Experience Level: ${currentSlots.experience_level}

I'll plug this into your search so you can start finding real, contactable leads right away. Want me to run the search now?`;

    return {
      text: summaryText,
      quickReplies: ["Run Search", "Edit Details", "Save for Later"],
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const lowerText = text.toLowerCase().trim();

    // ── INTERCEPT COMMANDS / QUICK REPLIES ─────────────────────────────────
    if (text === "Edit Details") {
      setSlots(INITIAL_SLOTS);
      setMessages([OPENING_MESSAGE]);
      setCurrentUnfilledSlot("category");
      return;
    }

    if (text === "Category") {
      setSlots(prev => ({ ...prev, category: null }));
      setCurrentUnfilledSlot("category");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "assistant",
          text: "What type of work do you do (your category or specialty)?",
          timestamp: new Date(),
          quickReplies: ["Web Development", "Graphic Design", "Virtual Assistant", "Content Writing", "Something Else"],
        },
      ]);
      return;
    }

    if (text === "Location") {
      setSlots(prev => ({ ...prev, location: null }));
      setCurrentUnfilledSlot("location");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "assistant",
          text: "Where are you (or your clients) located? Please type a city name.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (text === "Budget") {
      setSlots(prev => ({ ...prev, budget: null }));
      setCurrentUnfilledSlot("budget");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "assistant",
          text: "What's your target budget or rate? (e.g. $50/hr or $2,000 project budget)",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (text === "Experience") {
      setSlots(prev => ({ ...prev, experience_level: null }));
      setCurrentUnfilledSlot("experience_level");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "assistant",
          text: "What's your experience level?",
          timestamp: new Date(),
          quickReplies: ["Beginner", "Intermediate", "Expert"],
        },
      ]);
      return;
    }

    if (text === "Reset All") {
      setSlots(INITIAL_SLOTS);
      setMessages([OPENING_MESSAGE]);
      setCurrentUnfilledSlot("category");
      return;
    }

    if (text === "Something Else") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: "No problem! What is your main service or specialty? Just type it below.",
            timestamp: new Date(),
          },
        ]);
        setCurrentUnfilledSlot("category");
      }, 800);
      return;
    }

    if (text === "Save for Later") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        localStorage.setItem("lc_chat_slots", JSON.stringify(slots));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: "Preferences saved successfully! You can access them or run a search whenever you're ready. Let me know if you want to make any changes.",
            timestamp: new Date(),
            quickReplies: ["Edit Details", "Run Search"],
          },
        ]);
      }, 1000);
      return;
    }

    if (text === "Run Search") {
      const catId = getCategoryParam(slots.category);
      const cityVal = slots.location || "";
      const countryVal = resolveCountryFromCity(cityVal);

      sessionStorage.setItem("lc_shared_category", catId);
      sessionStorage.setItem("lc_shared_city", cityVal);
      sessionStorage.setItem("lc_shared_country", countryVal);
      sessionStorage.setItem("lc_shared_has_session", "true");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: `Launching leads search for ${slots.category} in ${cityVal}... 🚀`,
            timestamp: new Date(),
          },
        ]);
        setTimeout(() => {
          const queryParams = new URLSearchParams({
            autoSearch: "true",
            category: catId,
            city: cityVal,
            country: countryVal,
          });
          window.location.href = `/app/discover?${queryParams.toString()}`;
        }, 800);
      }, 1000);
      return;
    }

    // ── INTERCEPT CHANGE / UPDATE PHRASES ──────────────────────────────────
    const isChangeOrUpdate = CHANGE_KEYWORDS.some(k => lowerText === k || lowerText.includes(k));
    if (isChangeOrUpdate) {
      let botText = "";
      let botQuickReplies: string[] | undefined = undefined;
      const newSlots = { ...slots };

      if (lowerText.includes("start over") || lowerText.includes("reset") || lowerText.includes("scratch that") || lowerText.includes("nevermind")) {
        setSlots(INITIAL_SLOTS);
        setCurrentUnfilledSlot("category");
        botText = "Alright, let's start from the beginning! What type of work do you do (your category/service)?";
        botQuickReplies = ["Web Development", "Graphic Design", "Virtual Assistant", "Content Writing", "Something Else"];
      } else if (lowerText.includes("category") || lowerText.includes("service") || lowerText.includes("specialty") || lowerText.includes("work") || lowerText.includes("job")) {
        newSlots.category = null;
        setCurrentUnfilledSlot("category");
        botText = "No problem! Let's update your service category. What type of work do you do?";
        botQuickReplies = ["Web Development", "Graphic Design", "Virtual Assistant", "Content Writing", "Something Else"];
      } else if (lowerText.includes("location") || lowerText.includes("city") || lowerText.includes("place") || lowerText.includes("where") || lowerText.includes("area")) {
        newSlots.location = null;
        setCurrentUnfilledSlot("location");
        botText = "Got it. Let's change your target location. What city or area are you in (or looking for clients in)?";
      } else if (lowerText.includes("budget") || lowerText.includes("rate") || lowerText.includes("pay") || lowerText.includes("price") || lowerText.includes("cost")) {
        newSlots.budget = null;
        setCurrentUnfilledSlot("budget");
        botText = "Sure thing. Let's update your target rate or budget. What is your rate (e.g. $50/hr or $2,000 project)?";
      } else if (lowerText.includes("experience") || lowerText.includes("level")) {
        newSlots.experience_level = null;
        setCurrentUnfilledSlot("experience_level");
        botText = "Understood. Let's update your experience level. What is it?";
        botQuickReplies = ["Beginner", "Intermediate", "Expert"];
      } else {
        botText = "Sure, let's edit your search criteria. Which part would you like to update?";
        botQuickReplies = ["Category", "Location", "Budget", "Experience", "Reset All"];
      }

      setSlots(newSlots);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "user",
          text,
          timestamp: new Date(),
        },
      ]);
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "assistant",
            text: botText,
            timestamp: new Date(),
            quickReplies: botQuickReplies,
          },
        ]);
      }, 800);
      return;
    }

    // ── INTERCEPT AFFIRMATIONS / NEGATIONS ─────────────────────────────────
    const allSlotsFilled = slots.category && slots.location && slots.budget && slots.experience_level;
    const isAffirmation = AFFIRMATION_KEYWORDS.some(k => lowerText === k || lowerText.startsWith(k + " ") || lowerText.endsWith(" " + k));
    const isNegation = NEGATION_KEYWORDS.some(k => lowerText === k || lowerText.startsWith(k + " ") || lowerText.endsWith(" " + k) || lowerText.includes(" " + k + " "));

    if (isAffirmation && allSlotsFilled) {
      handleSend("Run Search");
      return;
    }

    if (isNegation) {
      if (allSlotsFilled) {
        handleSend("Save for Later");
        return;
      }

      if (currentUnfilledSlot) {
        let botText = "";
        let botQuickReplies: string[] | undefined = undefined;
        const newSlots = { ...slots };

        if (currentUnfilledSlot === "budget") {
          newSlots.budget = "Flexible";
          const nextPrompt = getBotPromptForNextSlot({ ...newSlots, budget: "Flexible" });
          botText = `No problem, we'll keep the budget flexible.\n\n${nextPrompt.text}`;
          botQuickReplies = nextPrompt.quickReplies;
          setSlots(newSlots);
          setCurrentUnfilledSlot("experience_level");
        } else if (currentUnfilledSlot === "experience_level") {
          newSlots.experience_level = "Flexible";
          const nextPrompt = getBotPromptForNextSlot({ ...newSlots, experience_level: "Flexible" });
          botText = `No worries, experience level is set to flexible.\n\n${nextPrompt.text}`;
          botQuickReplies = nextPrompt.quickReplies;
          setSlots(newSlots);
          setCurrentUnfilledSlot(null);
        } else if (currentUnfilledSlot === "location") {
          newSlots.location = "Remote";
          const nextPrompt = getBotPromptForNextSlot({ ...newSlots, location: "Remote" });
          botText = `Got it, we will search for remote opportunities.\n\n${nextPrompt.text}`;
          botQuickReplies = nextPrompt.quickReplies;
          setSlots(newSlots);
          setCurrentUnfilledSlot("budget");
        } else {
          botText = "No problem. Let's try again. What is your primary service or specialty?";
          botQuickReplies = ["Web Development", "Graphic Design", "Virtual Assistant", "Content Writing", "Something Else"];
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "user",
            text,
            timestamp: new Date(),
          },
        ]);
        setIsThinking(true);
        setTimeout(() => {
          setIsThinking(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "assistant",
              text: botText,
              timestamp: new Date(),
              quickReplies: botQuickReplies,
            },
          ]);
        }, 800);
        return;
      }
    }

    // ── STANDARD SLOT FILLING AND INTENT MATCHING ──────────────────────────
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);

      const matchedIntent = findBestMatchedIntent(text);

      let botText = "";
      let botQuickReplies: string[] | undefined = undefined;
      let newSlots = { ...slots };

      if (matchedIntent) {
        // Use helper to get a concise confirmation part of the matched intent reply
        const confirmationReply = getConfirmationReply(matchedIntent);
        botText = confirmationReply;

        if (matchedIntent.slotToFill && matchedIntent.slotValue) {
          newSlots[matchedIntent.slotToFill] = matchedIntent.slotValue;
        } else {
          const parsed = parseSlotsFromInput(text, currentUnfilledSlot);
          newSlots = { ...newSlots, ...parsed };
        }
      } else {
        const parsed = parseSlotsFromInput(text, currentUnfilledSlot);
        newSlots = { ...newSlots, ...parsed };
      }

      setSlots(newSlots);

      let nextSlot: keyof Slots | null = null;
      if (!newSlots.category) nextSlot = "category";
      else if (!newSlots.location) nextSlot = "location";
      else if (!newSlots.budget) nextSlot = "budget";
      else if (!newSlots.experience_level) nextSlot = "experience_level";

      setCurrentUnfilledSlot(nextSlot);

      const nextPrompt = getBotPromptForNextSlot(newSlots);

      if (matchedIntent) {
        botQuickReplies = nextPrompt.quickReplies;

        // If it's a slot-filling intent and there's a next slot, append it!
        if (matchedIntent.slotToFill && nextPrompt.text) {
          botText += `\n\n${nextPrompt.text}`;
        } else if (!nextSlot) {
          botText += `\n\n${nextPrompt.text}`;
        }
      } else {
        botText = nextPrompt.text;
        botQuickReplies = nextPrompt.quickReplies;
      }

      const botMsg: Message = {
        id: Date.now().toString(),
        sender: "assistant",
        text: botText,
        timestamp: new Date(),
        quickReplies: botQuickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Toggle Button — LC logo icon with glow ring */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close LanceConnect Assistant" : "Open LanceConnect Assistant"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={
          cn(
            "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full text-white flex items-center justify-center",
            "bg-gradient-to-br from-[#0B1220] via-[#101B30] to-[#2D6CFF]",
            "shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(45,108,255,0.35)]",
            "hover:shadow-[0_4px_28px_rgba(45,108,255,0.5),0_0_0_2px_rgba(45,108,255,0.55)]",
            "hover:scale-105 active:scale-95",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020b21]",
          )
        }
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <LCWaveLogo size={30} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Panel — WCAG AA, 16px radius, 10px backdrop blur, 150-300ms ease-out */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="LanceConnect Assistant Chat"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden",
              "bg-[#0B1220]/92 border border-[#1a2d5a]/70",
              "backdrop-blur-[10px]",
              "shadow-[0_4px_20px_rgba(0,0,0,0.45),0_0_0_1px_rgba(45,108,255,0.12)]",
              "bottom-0 right-0 w-full h-full max-h-[100dvh] rounded-none",
              "sm:bottom-24 sm:right-6 sm:w-[370px] sm:h-[540px] sm:rounded-2xl",
            )}
          >
            {/* ── Header ───────────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "linear-gradient(135deg, #101B30 0%, #0d1b3a 100%)",
                borderBottom: "1px solid rgba(45,108,255,0.18)",
              }}
            >
              <div className="flex items-center gap-2.5">
                {/* LC Wave Logo avatar with online dot */}
                <div
                  className="relative h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #101B30 0%, #0d1f4a 100%)",
                    border: "1.5px solid rgba(45,108,255,0.4)",
                    boxShadow: "0 0 12px rgba(45,108,255,0.25)",
                  }}
                >
                  <LCWaveLogo size={22} />
                  {/* Online status dot */}
                  <span
                    className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#22C55E]"
                    style={{ border: "1.5px solid #101B30" }}
                    aria-label="Online"
                  />
                </div>
                <div>
                  <h3
                    className="text-[13px] font-bold tracking-wide"
                    style={{ color: "#E5E7EB", fontFamily: "Inter, ui-sans-serif, sans-serif" }}
                  >
                    LanceConnect
                  </h3>
                  <p
                    className="text-[10px] font-semibold flex items-center gap-1"
                    style={{ color: "#22C55E" }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse"
                      aria-hidden="true"
                    />
                    Assistant · Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close LanceConnect Assistant chat"
                className={
                  cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center",
                    "text-[#9CA3AF] hover:text-[#E5E7EB]",
                    "hover:bg-[#2D6CFF]/15",
                    "transition-all duration-150 ease-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CFF]",
                  )
                }
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Messages Body ─────────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#1a2d5a transparent" }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div
                    className={cn(
                      "flex items-end gap-2.5 max-w-[88%]",
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                    )}
                  >
                    {/* LC Wave Logo as assistant avatar */}
                    {msg.sender === "assistant" && (
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #101B30 0%, #0d1f4a 100%)",
                          border: "1.5px solid rgba(45,108,255,0.35)",
                          boxShadow: "0 2px 8px rgba(45,108,255,0.2)",
                        }}
                        aria-hidden="true"
                      >
                        <LCWaveLogo size={17} />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={cn(
                        "text-[12.5px] leading-relaxed whitespace-pre-line px-3.5 py-2.5",
                        msg.sender === "assistant"
                          ? "rounded-2xl rounded-bl-sm"
                          : "rounded-2xl rounded-br-sm",
                      )}
                      style={
                        msg.sender === "assistant"
                          ? {
                              background: "#101B30",
                              color: "#E5E7EB",
                              border: "1px solid rgba(45,108,255,0.15)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                              fontFamily: "Inter, ui-sans-serif, sans-serif",
                            }
                          : {
                              background:
                                "linear-gradient(135deg, #2D6CFF 0%, #4f8aff 100%)",
                              color: "#ffffff",
                              boxShadow: "0 2px 12px rgba(45,108,255,0.35)",
                              fontFamily: "Inter, ui-sans-serif, sans-serif",
                            }
                      }
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Quick-reply chips */}
                  {msg.sender === "assistant" &&
                    msg.quickReplies &&
                    msg.quickReplies.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="pl-9 flex flex-wrap gap-1.5"
                        role="group"
                        aria-label="Quick reply options"
                      >
                        {msg.quickReplies.map((qr, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(qr)}
                            tabIndex={0}
                            aria-label={`Quick reply: ${qr}`}
                            className={
                              cn(
                                "px-3 py-1.5 rounded-full text-[11px] font-semibold",
                                "border border-[#2D6CFF]/60 text-[#2D6CFF]",
                                "hover:bg-[#2D6CFF]/12 hover:border-[#2D6CFF] hover:text-[#5B8CFF]",
                                "active:scale-95",
                                "transition-all duration-150 ease-out",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CFF] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0B1220]",
                              )
                            }
                          >
                            {qr}
                          </button>
                        ))}
                      </motion.div>
                    )}
                </div>
              ))}

              {/* Typing indicator */}
              {isThinking && <TypingIndicator />}
            </div>

            {/* ── Chat Input Footer ─────────────────────────────────────────── */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="px-3 py-3 flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #101B30 0%, #0d1b3a 100%)",
                borderTop: "1px solid rgba(45,108,255,0.15)",
              }}
            >
              <label htmlFor="lc-chat-input" className="sr-only">
                Type a message to LanceConnect Assistant
              </label>
              <input
                id="lc-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                tabIndex={0}
                autoComplete="off"
                className="flex-1 rounded-xl px-3.5 py-2 text-[12.5px] transition-all duration-150 ease-out focus:outline-none"
                style={{
                  background: "#0d1f42",
                  border: "1px solid rgba(45,108,255,0.25)",
                  color: "#E5E7EB",
                  fontFamily: "Inter, ui-sans-serif, sans-serif",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(45,108,255,0.7)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,108,255,0.12), inset 0 1px 3px rgba(0,0,0,0.3)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(45,108,255,0.25)";
                  e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3)";
                }}
              />
              <button
                type="submit"
                aria-label="Send message"
                tabIndex={0}
                disabled={!inputValue.trim()}
                className={
                  cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    "transition-all duration-150 ease-out",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101B30]",
                    inputValue.trim()
                      ? "bg-[#2D6CFF] hover:bg-[#3d7aff] text-white shadow-[0_2px_12px_rgba(45,108,255,0.4)] hover:shadow-[0_2px_18px_rgba(45,108,255,0.6)] hover:scale-105 active:scale-95"
                      : "bg-[#1a2d5a] text-[#9CA3AF] cursor-not-allowed opacity-60",
                  )
                }
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Typing Indicator — three pulsing LC-blue dots with avatar
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex items-end gap-2.5 max-w-[85%] mr-auto"
      aria-live="polite"
      aria-label="Assistant is typing"
    >
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #101B30 0%, #0d1f4a 100%)",
          border: "1.5px solid rgba(45,108,255,0.35)",
          boxShadow: "0 2px 8px rgba(45,108,255,0.18)",
        }}
        aria-hidden="true"
      >
        <LCWaveLogo size={17} />
      </div>
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center"
        style={{
          background: "#101B30",
          border: "1px solid rgba(45,108,255,0.15)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </motion.div>
  );
}
