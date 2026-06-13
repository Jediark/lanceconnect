import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Check, Shield } from "lucide-react";
import { getCountry } from "@/data/dynamicRouteData";

interface Message {
  id: string;
  sender: "assistant" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface Slots {
  goal: string | null;
  category: string | null;
  location: string | null;
  budget: string | null;
  experience_level: string | null;
}

const INITIAL_SLOTS: Slots = {
  goal: null,
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
};

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

  return "local_business";
}

function resolveCountryFromCity(city: string | null): string {
  if (!city) return "Nigeria";
  const slug = city.trim().toLowerCase().replace(/\s+/g, "-");
  const country = getCountry(slug);
  return country || "Nigeria";
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

// Helper to render LC Wave Logo inside SVGs
function LCWaveLogo({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="14" cy="20" r="6" fill="#2D6CFF" />
      <circle cx="26" cy="20" r="6" fill="#10B981" />
      <path d="M14 20L26 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M17 20C18.5 18.5 19.5 18.5 22 20C24.5 21.5 25.5 21.5 27 20"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
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
    ],
    reply:
      "Got it — copywriting! That's a high-demand category on LanceConnect. Are you focused on a specific niche, like sales pages, email sequences, or SEO blog content? And where are you (or your ideal clients) located?",
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
    ],
    reply:
      "Awesome — web design is one of our most active categories. Are you more focused on UI/UX, full website builds, or platforms like Shopify/WordPress? Let's find clients near you — what city or region should I search?",
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
    ],
    reply:
      "Pet care — love it! Local pet owners and small business owners (groomers, vets, boarding facilities) often need reliable help. What city should I search for pet care clients near you?",
    slotToFill: "category",
    slotValue: "Pet Care",
  },
  {
    id: 6,
    patterns: [
      "i'm a graphic designer",
      "i am a graphic designer",
      "graphic designer",
      "graphic design",
      "create graphics",
      "branding designer",
    ],
    reply:
      "Graphic design — perfect. Are you focused on branding/logos, social media graphics, print design, or packaging? Let's narrow down a location to search.",
    slotToFill: "category",
    slotValue: "Graphic Design",
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
    ],
    reply:
      "Social media management is one of the fastest-growing categories on LanceConnect. Do you specialize in a platform (Instagram, TikTok, LinkedIn) or industry (restaurants, real estate, salons)? What's your target city?",
    slotToFill: "category",
    slotValue: "Social Media Management",
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
    ],
    reply:
      "Video editing — great. Are you mainly doing YouTube content, short-form (Reels/TikTok), or corporate/commercial work? Where should I focus the client search?",
    slotToFill: "category",
    slotValue: "Video Editing",
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
    ],
    reply:
      "Bookkeeping is a steady, recurring-revenue category — nice pick. Do you work with a specific software (QuickBooks, Xero) or industry niche? What location are you targeting?",
    slotToFill: "category",
    slotValue: "Bookkeeping",
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
    ],
    reply:
      "Personal training — got it. Are you offering in-person sessions, online coaching, or both? What city or area should I focus the search on?",
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
    ],
    reply:
      "House cleaning is a great local-service category with consistent demand. Are you looking for residential clients, commercial (offices), or both? What's your service area?",
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
    ],
    reply:
      "Landscaping and lawn care — perfect, very high local search volume. What's your service radius or target city?",
    slotToFill: "category",
    slotValue: "Landscaping/Lawn Care",
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
    ],
    reply:
      "Hairstylist — got it! I noticed your dashboard already has some great salon leads in Las Vegas. Want me to pull similar salon leads in another city, or keep building out that region?",
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
    ],
    reply:
      "Makeup artistry — love it. Are you focused on bridal, editorial, or everyday glam clients? What city should I search?",
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
    ],
    reply:
      "Tutoring — great category. What subject(s) and grade level or age group do you specialize in, and are you looking for local or online students?",
    slotToFill: "category",
    slotValue: "Tutoring",
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
    ],
    reply:
      "Voiceover — nice, fully remote-friendly category. What types of projects (commercials, audiobooks, e-learning)? Since this is remote, do you want me to search broadly or focus on a specific country/market?",
    slotToFill: "category",
    slotValue: "Voiceover",
  },
  {
    id: 19,
    patterns: [
      "i'm an accountant / cpa",
      "i am an accountant",
      "accountant",
      "cpa",
      "certified public accountant",
      "accounting",
    ],
    reply:
      "Accounting — great, high-trust category. Are you focused on individual tax prep, small business bookkeeping, or both? What region are your ideal clients in?",
    slotToFill: "category",
    slotValue: "Accounting",
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
    ],
    reply:
      "Handyman services — perfect for local leads. What's your specialty (general repairs, electrical, plumbing, carpentry) and what's your service area?",
    slotToFill: "category",
    slotValue: "Handyman",
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
    ],
    reply:
      "Wedding planning — exciting! Are you full-service or day-of coordination? What's your primary market city?",
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
      "give massages",
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
    ],
    reply:
      "SEO and digital marketing — that's actually built right into the LanceConnect mission! Do you focus on local SEO, e-commerce, or content marketing? What's your target market?",
    slotToFill: "category",
    slotValue: "SEO / Digital Marketing",
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
      "teach music",
    ],
    reply:
      "Music lessons — great, recurring-client category. What instrument(s) do you teach, and are lessons in-person or online?",
    slotToFill: "category",
    slotValue: "Music Lessons",
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

    // 1. Goal extraction
    if (
      lower.includes("find client") ||
      lower.includes("looking for client") ||
      lower.includes("get client") ||
      lower.includes("find work") ||
      lower.includes("freelance") ||
      lower.includes("freelancer") ||
      lower.includes("find clients") ||
      lower === "find clients"
    ) {
      parsed.goal = "freelancer";
    } else if (
      lower.includes("hire") ||
      lower.includes("looking for freelancer") ||
      lower.includes("business looking") ||
      lower.includes("looking to hire") ||
      lower === "hire a freelancer"
    ) {
      parsed.goal = "client";
    }

    // 2. Category extraction
    if (
      lower.includes("web dev") ||
      lower.includes("web development") ||
      lower.includes("website") ||
      lower.includes("developer") ||
      lower.includes("coding") ||
      lower.includes("programmer")
    ) {
      parsed.category = "Web Development";
    } else if (
      lower.includes("design") ||
      lower.includes("graphic design") ||
      lower.includes("designer") ||
      lower.includes("branding") ||
      lower.includes("logo")
    ) {
      parsed.category = "Graphic Design";
    } else if (
      lower.includes("virtual assistant") ||
      lower.includes("assistant") ||
      lower.includes("va ") ||
      lower === "va" ||
      lower.includes("admin")
    ) {
      parsed.category = "Virtual Assistant";
    } else if (
      lower.includes("writing") ||
      lower.includes("writer") ||
      lower.includes("copywriter") ||
      lower.includes("content writing")
    ) {
      parsed.category = "Content Writing";
    } else if (
      lower.includes("pet") ||
      lower.includes("dog") ||
      lower.includes("cat") ||
      lower.includes("pet care") ||
      lower.includes("animal")
    ) {
      parsed.category = "Pet Care";
    }

    // 3. Experience level extraction
    if (lower.includes("beginner") || lower.includes("junior") || lower.includes("entry")) {
      parsed.experience_level = "Beginner";
    } else if (lower.includes("intermediate") || lower.includes("mid")) {
      parsed.experience_level = "Intermediate";
    } else if (
      lower.includes("expert") ||
      lower.includes("senior") ||
      lower.includes("advanced") ||
      lower.includes("pro")
    ) {
      parsed.experience_level = "Expert";
    }

    // 4. Budget extraction
    const budgetRegex =
      /(\$\d+(?:,\d+)*(?:\/\w+)?|\d+\s*(?:usd|gbp|ngn|eur|dollars|pounds)|rate\s*of\s*\d+|budget\s*of\s*\d+)/gi;
    const match = lower.match(budgetRegex);
    if (match) {
      parsed.budget = match[0];
    }

    // 5. Direct filling for current unfilled slot if parsing failed
    if (expectedSlot === "goal" && !parsed.goal) {
      if (lower.includes("client") || lower.includes("find")) {
        parsed.goal = "freelancer";
      } else if (lower.includes("hire") || lower.includes("business")) {
        parsed.goal = "client";
      }
    } else if (expectedSlot === "category" && !parsed.category) {
      if (lower !== "something else") {
        parsed.category = text;
      }
    } else if (expectedSlot === "location" && !parsed.location) {
      parsed.location = text;
    } else if (expectedSlot === "budget" && !parsed.budget) {
      parsed.budget = text;
    } else if (expectedSlot === "experience_level" && !parsed.experience_level) {
      if (lower === "beginner" || lower === "intermediate" || lower === "expert") {
        parsed.experience_level = text;
      } else {
        parsed.experience_level = text;
      }
    }

    return parsed;
  };

  const getBotPromptForNextSlot = (
    currentSlots: Slots,
  ): { text: string; quickReplies?: string[] } => {
    if (!currentSlots.goal) {
      return {
        text: "Are you looking to find clients for your freelance work, or are you a business looking to hire a freelancer?",
        quickReplies: ["Find Clients", "Hire a Freelancer"],
      };
    }
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

    // 1. Check commands / special options
    if (text === "Edit Details") {
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

    // 2. Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    // 3. Process slot filling and intent matching
    setTimeout(() => {
      setIsThinking(false);

      const matchedIntent = findBestMatchedIntent(text);

      let botText = "";
      let botQuickReplies: string[] | undefined = undefined;
      let newSlots = { ...slots };

      if (matchedIntent) {
        botText = matchedIntent.reply;

        // If the intent fills a slot, update newSlots
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

      // Determine next slot
      let nextSlot: keyof Slots | null = null;
      if (!newSlots.goal) nextSlot = "goal";
      else if (!newSlots.category) nextSlot = "category";
      else if (!newSlots.location) nextSlot = "location";
      else if (!newSlots.budget) nextSlot = "budget";
      else if (!newSlots.experience_level) nextSlot = "experience_level";

      setCurrentUnfilledSlot(nextSlot);

      const nextPrompt = getBotPromptForNextSlot(newSlots);

      if (matchedIntent) {
        botQuickReplies = nextPrompt.quickReplies;

        // If all slots are now filled, append summary prompt to custom reply
        if (!nextSlot) {
          botText += `\n\n${nextPrompt.text}`;
          botQuickReplies = nextPrompt.quickReplies;
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
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close LanceConnect Assistant" : "Open LanceConnect Assistant"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-[#0B1220] to-[#2D6CFF] text-white flex items-center justify-center shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <LCWaveLogo size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden bg-[#0B1220]/90 border border-slate-700/50 backdrop-blur-[10px] shadow-2xl",
              "bottom-0 right-0 w-full h-full max-h-[100dvh] rounded-none sm:bottom-24 sm:right-6 sm:w-[360px] sm:h-[520px] sm:rounded-2xl",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#101B30]/95 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center">
                  <LCWaveLogo size={20} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#101B30]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 tracking-wide">
                    LanceConnect Assistant
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Chat"
                className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 flex items-center justify-center transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Messages Body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2.5">
                  <div
                    className={cn(
                      "flex items-end gap-2.5 max-w-[85%]",
                      msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                    )}
                  >
                    {msg.sender === "assistant" && (
                      <div className="h-6 w-6 rounded-full bg-[#101B30] border border-slate-700 flex items-center justify-center flex-shrink-0">
                        <LCWaveLogo size={18} />
                      </div>
                    )}
                    <div
                      className={cn(
                        "text-xs px-3.5 py-2.5 shadow-sm leading-relaxed whitespace-pre-line",
                        msg.sender === "assistant"
                          ? "bg-[#101B30] text-slate-100 rounded-2xl rounded-bl-none border border-slate-800/50"
                          : "bg-gradient-to-r from-[#2D6CFF] to-[#5B8CFF] text-white rounded-2xl rounded-br-none",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Quick replies */}
                  {msg.sender === "assistant" &&
                    msg.quickReplies &&
                    msg.quickReplies.length > 0 && (
                      <div className="pl-8 flex flex-wrap gap-2 animate-in fade-in duration-300">
                        {msg.quickReplies.map((qr, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(qr)}
                            tabIndex={0}
                            className="px-3 py-1.5 rounded-full border border-[#2D6CFF] text-[#2D6CFF] text-[11px] font-semibold hover:bg-[#2D6CFF]/10 focus:outline-none focus-visible:bg-[#2D6CFF]/15 active:scale-95 transition"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isThinking && <TypingIndicator />}
            </div>

            {/* Chat Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 bg-[#101B30]/95 border-t border-slate-800/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                tabIndex={0}
                className="flex-1 bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D6CFF] focus-visible:ring-1 focus-visible:ring-[#2D6CFF] transition"
              />
              <button
                type="submit"
                aria-label="Send Message"
                tabIndex={0}
                disabled={!inputValue.trim()}
                className="h-8 w-8 bg-[#2D6CFF] hover:bg-[#2D6CFF]/90 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101B30] focus-visible:ring-[#2D6CFF]"
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

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 max-w-[85%] mr-auto">
      <div className="h-6 w-6 rounded-full bg-[#101B30] border border-slate-700 flex items-center justify-center flex-shrink-0">
        <LCWaveLogo size={18} />
      </div>
      <div className="bg-[#101B30] border border-slate-800/50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1 items-center">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-[#2D6CFF] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
