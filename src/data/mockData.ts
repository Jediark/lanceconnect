import { COUNTRIES as ALL_COUNTRIES } from "./countriesData";

export type Lead = {
  id: string;
  businessName: string;
  businessType: string;
  industry: string;
  city: string;
  country: string;
  fullAddress: string;
  phone: string;
  email: string | null;
  websiteUrl: string | null;
  hasWebsite: boolean;
  googleRating: number;
  googleReviewCount: number;
  opportunityScore: number;
  source: string;
  savedAt: string | null;
  status: PipelineStatus | null;
  notes?: string;
  followUpDate?: string | null;
  dealValue?: number | null;
  claimStatus?: 'pitched' | 'won' | null;
  claimUserId?: string | null;
  claimUpdatedAt?: string | null;
  createdAt?: string;
  hasFacebook?: boolean;
  facebookUrl?: string | null;
  hasInstagram?: boolean;
  instagramUrl?: string | null;
  hasTwitter?: boolean;
  twitterUrl?: string | null;
  hasLinkedin?: boolean;
  linkedinUrl?: string | null;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  websiteLive?: boolean;
  isFlagged?: boolean;
  suspiciousCount?: number;
  userLeadId?: string | null;
  googlePlaceId?: string | null;
  googleMapsUrl?: string | null;
  score_breakdown?: any;
};

export type PipelineStatus = "new" | "contacted" | "interested" | "proposal_sent" | "won" | "lost";

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    businessName: "Mario's Ristorante",
    businessType: "Restaurant",
    industry: "web_dev",
    city: "Naples",
    country: "Italy",
    fullAddress: "Via Toledo 45, Naples, Italy",
    phone: "+39 081 555 0123",
    email: null,
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 3.2,
    googleReviewCount: 18,
    opportunityScore: 92,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "2",
    businessName: "Lagos Hair Studio",
    businessType: "Beauty Salon",
    industry: "designer",
    city: "Lagos",
    country: "Nigeria",
    fullAddress: "14 Awolowo Road, Ikoyi, Lagos",
    phone: "+234 802 555 0198",
    email: "info@lagoshair.ng",
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 4.5,
    googleReviewCount: 7,
    opportunityScore: 78,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "3",
    businessName: "Smith & Sons Plumbing",
    businessType: "Contractor",
    industry: "seo",
    city: "Manchester",
    country: "United Kingdom",
    fullAddress: "8 Deansgate, Manchester, UK",
    phone: "+44 161 555 0145",
    email: null,
    websiteUrl: "http://smithplumbing.co.uk",
    hasWebsite: true,
    googleRating: 4.1,
    googleReviewCount: 34,
    opportunityScore: 61,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "4",
    businessName: "Café Mirador",
    businessType: "Café",
    industry: "social_media",
    city: "Buenos Aires",
    country: "Argentina",
    fullAddress: "Av. Corrientes 1234, Buenos Aires",
    phone: "+54 11 5550 9988",
    email: null,
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 4.7,
    googleReviewCount: 5,
    opportunityScore: 88,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "5",
    businessName: "Dr. Patel Dental Clinic",
    businessType: "Dentist",
    industry: "copywriter",
    city: "Mumbai",
    country: "India",
    fullAddress: "Linking Road, Bandra West, Mumbai",
    phone: "+91 98200 55012",
    email: "drpatel@dentalclinic.in",
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 3.8,
    googleReviewCount: 42,
    opportunityScore: 74,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "6",
    businessName: "AutoFix Garage",
    businessType: "Auto Repair",
    industry: "web_dev",
    city: "Toronto",
    country: "Canada",
    fullAddress: "567 Yonge St, Toronto, ON",
    phone: "+1 416 555 0177",
    email: null,
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 4.0,
    googleReviewCount: 89,
    opportunityScore: 55,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "7",
    businessName: "Boulangerie Dupont",
    businessType: "Bakery",
    industry: "photography",
    city: "Lyon",
    country: "France",
    fullAddress: "23 Rue de la République, Lyon",
    phone: "+33 4 72 55 01 89",
    email: null,
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 4.9,
    googleReviewCount: 3,
    opportunityScore: 96,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "8",
    businessName: "Kuala Lumpur Yoga Studio",
    businessType: "Fitness Studio",
    industry: "video",
    city: "Kuala Lumpur",
    country: "Malaysia",
    fullAddress: "Bukit Bintang, Kuala Lumpur",
    phone: "+60 3-2142 5588",
    email: "hello@klyoga.my",
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 4.6,
    googleReviewCount: 11,
    opportunityScore: 81,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "mock-tutor-1",
    businessName: "Peckham Language Academy",
    businessType: "Language School",
    industry: "tutor",
    city: "London",
    country: "United Kingdom",
    fullAddress: "12 Queen's Rd, London SE15 2PT",
    phone: "+44 20 7555 9823",
    email: "contact@peckhamlanguages.co.uk",
    websiteUrl: "http://peckhamlanguages.co.uk",
    hasWebsite: true,
    googleRating: 4.2,
    googleReviewCount: 15,
    opportunityScore: 68,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "mock-food-1",
    businessName: "Wanis International Foods",
    businessType: "Food Importer",
    industry: "african_food_export",
    city: "London",
    country: "United Kingdom",
    fullAddress: "Golden House, Commercial Way, London NW10 7SR",
    phone: "+44 20 8961 4411",
    email: "sales@wanis.com",
    websiteUrl: "https://wanis.com",
    hasWebsite: true,
    googleRating: 4.4,
    googleReviewCount: 152,
    opportunityScore: 94,
    source: "google_places",
    savedAt: null,
    status: null,
    notes: "Product Interest: palm oil",
  },
  {
    id: "mock-food-2",
    businessName: "ABI Global Foods",
    businessType: "African Food Wholesaler",
    industry: "african_food_export",
    city: "London",
    country: "United Kingdom",
    fullAddress: "Unit 3, Abbey Trading Estate, London",
    phone: "+44 20 8555 0192",
    email: "info@abiglobalfoods.co.uk",
    websiteUrl: "http://abiglobalfoods.co.uk",
    hasWebsite: true,
    googleRating: 4.0,
    googleReviewCount: 47,
    opportunityScore: 88,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "mock-food-3",
    businessName: "Peckham Quality Foods",
    businessType: "Ethnic Supermarket",
    industry: "african_food_export",
    city: "London",
    country: "United Kingdom",
    fullAddress: "Rye Ln, London SE15",
    phone: "+44 20 7555 4040",
    email: null,
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 3.8,
    googleReviewCount: 18,
    opportunityScore: 91,
    source: "google_places",
    savedAt: null,
    status: null,
  },
  {
    id: "mock-training-1",
    businessName: "Acme Corporate HQ",
    businessType: "Corporate Office",
    industry: "human_capital",
    city: "London",
    country: "United Kingdom",
    fullAddress: "30 St Mary Axe, London EC3A 8BF",
    phone: "+44 20 7222 5555",
    email: "hr@acmecorp.co.uk",
    websiteUrl: "https://acmecorp.co.uk",
    hasWebsite: true,
    googleRating: 4.5,
    googleReviewCount: 120,
    opportunityScore: 85,
    source: "google_places",
    savedAt: null,
    status: null,
  },
];

export const MOCK_PIPELINE_LEADS: Lead[] = [
  {
    ...MOCK_LEADS[0],
    savedAt: "2026-05-20",
    status: "contacted",
    notes: "Called on Tuesday, left voicemail",
    followUpDate: "2026-05-30",
  },
  {
    ...MOCK_LEADS[1],
    savedAt: "2026-05-22",
    status: "interested",
    notes: "Replied to email, wants a quote",
    followUpDate: "2026-05-28",
  },
  { ...MOCK_LEADS[2], savedAt: "2026-05-24", status: "new", notes: "", followUpDate: null },
  {
    ...MOCK_LEADS[4],
    savedAt: "2026-05-25",
    status: "proposal_sent",
    notes: "Sent proposal for $1,200 website",
    followUpDate: "2026-06-01",
  },
  { ...MOCK_LEADS[6], savedAt: "2026-05-26", status: "new", notes: "", followUpDate: null },
];

export const MOCK_STATS = {
  totalLeadsDiscovered: 247,
  leadsSavedThisMonth: 18,
  leadsContacted: 12,
  responseRate: "23%",
  wonDeals: 2,
};

export const MOCK_TEMPLATES = [
  {
    id: "tpl-1",
    name: "No Website — Web Dev Intro",
    channel: "email",
    subject: "Quick question about {{business_name}}'s online presence",
    body: `Hi there,\n\nI was searching for local businesses in {{city}} and came across {{business_name}} on Google Maps.\n\nI noticed you don't currently have a website. As a web developer who works with local businesses, I've seen firsthand how a clean, professional website can bring in new customers who search online.\n\nI'd love to show you what I could build for you — and I keep my rates affordable for small businesses.\n\nWould you have 10 minutes for a quick call this week?\n\nBest,\n{{your_name}}\nWeb Developer`,
    isDefault: true,
  },
  {
    id: "tpl-2",
    name: "Low Rating — SEO Services",
    channel: "email",
    subject: "Helping {{business_name}} get found online",
    body: `Hi,\n\nI came across {{business_name}} while researching businesses in {{city}}.\n\nI specialize in SEO for local businesses — helping them rank higher on Google and get more customers finding them organically.\n\nWould you be open to a free 15-minute consultation to see how I could help?\n\nWarm regards,\n{{your_name}}`,
    isDefault: false,
  },
  {
    id: "tpl-3",
    name: "Phone Script — Cold Call",
    channel: "phone_script",
    subject: null,
    body: `Hi, may I speak with the owner or manager?\n\n[When connected:]\n\nHi, my name is {{your_name}} and I'm a freelance web developer. I came across {{business_name}} while searching for businesses in {{city}} and noticed you might not have a website yet.\n\nI work with small businesses to build affordable, professional websites that help attract new customers.\n\nDo you have a couple of minutes to chat about what I could do for you?`,
    isDefault: false,
  },
];

export const CATEGORIES = [
  {
    id: "local_business",
    emoji: "🏪",
    label: "Local Business",
    example: "Find local shops, cleaners, bakeries",
  },
  {
    id: "web_dev",
    emoji: "💻",
    label: "Web Development",
    example: "Find businesses without websites",
  },
  {
    id: "designer",
    emoji: "🎨",
    label: "Graphic Design",
    example: "Find brands that need a refresh",
  },
  {
    id: "copywriter",
    emoji: "✍️",
    label: "Copywriting",
    example: "Find businesses with no blog or bad content",
  },
  { id: "seo", emoji: "📈", label: "SEO", example: "Find businesses invisible on Google" },
  {
    id: "social_media",
    emoji: "📱",
    label: "Social Media",
    example: "Find businesses with no Instagram/Facebook",
  },
  {
    id: "video",
    emoji: "🎥",
    label: "Video Production",
    example: "Find businesses with no video content",
  },
  {
    id: "photography",
    emoji: "📸",
    label: "Photography",
    example: "Find restaurants, hotels needing photos",
  },
  {
    id: "marketing",
    emoji: "📣",
    label: "Digital Marketing",
    example: "Find businesses with zero ad presence",
  },
  {
    id: "app_dev",
    emoji: "📲",
    label: "App Development",
    example: "Find businesses needing mobile apps",
  },
  {
    id: "va",
    emoji: "🤝",
    label: "Virtual Assistant",
    example: "Find busy entrepreneurs needing support",
  },
  {
    id: "tutor",
    emoji: "🎓",
    label: "Online Tutoring",
    example: "Find schools and learning centers needing tutors",
  },
  {
    id: "parent_tutor",
    emoji: "👨👩👧",
    label: "Parent-Tutor Matching",
    example: "Find parents actively looking for tutors",
  },
  {
    id: "african_food_export",
    emoji: "🌍",
    label: "African Food Export",
    example: "Find importers and ethnic wholesalers of African foods",
  },
  {
    id: "restaurant_supplier",
    emoji: "🍽️",
    label: "Restaurant Supplier",
    example: "Find restaurants needing local/ethnic supply",
  },
  {
    id: "product_export",
    emoji: "📦",
    label: "Product Import/Export",
    example: "Find global wholesalers and trade buyers",
  },
  {
    id: "b2b_trade",
    emoji: "🤝",
    label: "B2B Trade",
    example: "Find manufacturers needing bulk materials",
  },
  {
    id: "human_capital",
    emoji: "🧠",
    label: "Human Capital Development",
    example: "Find companies needing talent/organizational training",
  },
  {
    id: "training_recruitment",
    emoji: "🎯",
    label: "Training & Recruitment",
    example: "Find companies hiring or needing staffing partners",
  },
  {
    id: "mc_events",
    emoji: "🎤",
    label: "MC & Events Host",
    example: "Find corporate events, weddings and conferences needing a professional MC",
  },
  {
    id: "translation",
    emoji: "🌐",
    label: "Translation",
    example: "Find translation agencies, localization clients",
  },
  {
    id: "personal_trainer",
    emoji: "💪",
    label: "Personal Training",
    example: "Find fitness centers, private clients",
  },
  {
    id: "landscaping",
    emoji: "🌿",
    label: "Landscaping & Lawn Care",
    example: "Find commercial properties, residential lawn care",
  },
  {
    id: "hairstylist",
    emoji: "✂️",
    label: "Hairstylist",
    example: "Find beauty salons, wedding parties, private events",
  },
  {
    id: "makeup_artist",
    emoji: "💄",
    label: "Makeup Artistry",
    example: "Find wedding shoots, editorial fashion, salons",
  },
  {
    id: "voiceover",
    emoji: "🎙️",
    label: "Voiceover",
    example: "Find audiobooks, commercial ads, e-learning narration",
  },
  {
    id: "accounting",
    emoji: "📊",
    label: "Accounting & CPA",
    example: "Find corporate finance, individual tax returns",
  },
  {
    id: "handyman",
    emoji: "🔧",
    label: "Handyman Services",
    example: "Find residential repairs, property managers needing help",
  },
  {
    id: "wedding_planner",
    emoji: "💍",
    label: "Wedding Planning",
    example: "Find brides, venues, corporate event planners",
  },
  {
    id: "massage_therapist",
    emoji: "💆",
    label: "Massage Therapy",
    example: "Find spas, wellness centers, private in-home bookings",
  },
  {
    id: "music_teacher",
    emoji: "🎵",
    label: "Music Lessons",
    example: "Find private students, local schools needing instructors",
  },
  {
    id: "pet_care",
    emoji: "🐾",
    label: "Pet Care",
    example: "Find dog walking, pet boarding, grooming leads",
  },
  {
    id: "house_cleaning",
    emoji: "🧹",
    label: "House Cleaning",
    example: "Find residential homes, commercial offices needing cleaners",
  },
];

export const COUNTRIES = ALL_COUNTRIES;

export const STATUS_META: Record<
  PipelineStatus,
  { label: string; emoji: string; color: string; ring: string }
> = {
  new: {
    label: "New",
    emoji: "●",
    color: "bg-slate-100 text-slate-700",
    ring: "border-l-slate-400",
  },
  contacted: {
    label: "Contacted",
    emoji: "↗",
    color: "bg-blue-100 text-blue-700",
    ring: "border-l-blue-500",
  },
  interested: {
    label: "Interested",
    emoji: "✦",
    color: "bg-indigo-100 text-indigo-700",
    ring: "border-l-indigo-500",
  },
  proposal_sent: {
    label: "Proposal Sent",
    emoji: "✉",
    color: "bg-amber-100 text-amber-700",
    ring: "border-l-amber-500",
  },
  won: {
    label: "Won",
    emoji: "✓",
    color: "bg-emerald-100 text-emerald-700",
    ring: "border-l-emerald-500",
  },
  lost: { label: "Lost", emoji: "✕", color: "bg-red-100 text-red-700", ring: "border-l-red-400" },
};

export type DirectoryFreelancer = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  freelancer_category: string;
  bio: string | null;
  website_url: string | null;
  country: string | null;
  city: string | null;
  username: string | null;
  hourly_rate: number | null;
  portfolio_projects: any[] | null;
  contact_email: string | null;
  contact_phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  dribbble_url: string | null;
  twitter_url: string | null;
  created_at: string;
  is_verified?: boolean;
  website_verified?: boolean;
  is_supporter?: boolean;
  is_featured?: boolean;
  tagline?: string | null;
  is_flagged?: boolean;
};

export const MOCK_FREELANCERS: DirectoryFreelancer[] = [
  {
    id: "trendtactics-uuid-1111",
    email: "info@trendtacticsdigital.com",
    full_name: "Trendtactics Digital",
    avatar_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop",
    freelancer_category: "web_dev",
    bio: "Bespoke web engineering, high-performance UI/UX design, and custom digital growth systems. We scale businesses with premium web technology.",
    website_url: "https://trendtacticsdigital.com",
    country: "Nigeria",
    city: "Lagos",
    username: "trendtactics-digital",
    hourly_rate: 65,
    portfolio_projects: [
      { title: "Midway Health Inc.", desc: "Premium healthcare services portal." },
      { title: "AllenGreen Transportation", desc: "Logistics booking directory." }
    ],
    contact_email: "info@trendtacticsdigital.com",
    contact_phone: "+234 812 345 6789",
    github_url: "https://github.com/trendtactics",
    linkedin_url: "https://linkedin.com/company/trendtactics",
    dribbble_url: null,
    twitter_url: "https://twitter.com/trendtactics",
    created_at: "2026-01-01T00:00:00Z",
    is_verified: true,
    website_verified: true,
    is_supporter: true,
    is_featured: true,
    tagline: "Transforming Brands. Crafting Legacies."
  },
  {
    id: "akinola-uuid-2222",
    email: "connect@akinolaolujobi.com",
    full_name: "Akinola Olujobi",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop",
    freelancer_category: "mc_events",
    bio: "Professional Master of Ceremonies (MC) and Event Host providing elite stage presence and eloquent delivery for corporate summits, galas, and high-profile social events.",
    website_url: "https://akinolaolujobi.com",
    country: "Nigeria",
    city: "Abuja",
    username: "akinola-olujobi",
    hourly_rate: 100,
    portfolio_projects: [
      { title: "Corporate Tech Summit 2026", desc: "Main stage event anchor for 2,000+ attendees." }
    ],
    contact_email: "connect@akinolaolujobi.com",
    contact_phone: "+234 803 123 4567",
    github_url: null,
    linkedin_url: "https://linkedin.com/in/akinolaolujobi",
    dribbble_url: null,
    twitter_url: "https://twitter.com/akinolamc",
    created_at: "2026-01-02T00:00:00Z",
    is_verified: true,
    website_verified: true,
    is_supporter: true,
    is_featured: true,
    tagline: "Your Event, Artistically Anchored."
  },
  {
    id: "edvoura-uuid-3333",
    email: "edvouralearninghub@gmail.com",
    full_name: "Edvoura Learning Hub",
    avatar_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=150&auto=format&fit=crop",
    freelancer_category: "tutor",
    bio: "Interactive K-12 tutoring, parent-tutor matching, and homework tracking portals tailored for academic success and curriculum prep (SAT, WAEC, JAMB).",
    website_url: "https://edvouralearninghub.com",
    country: "United Kingdom",
    city: "London",
    username: "edvoura-learning-hub",
    hourly_rate: 45,
    portfolio_projects: [
      { title: "K-12 Math Gamification", desc: "Improving engagement with interactive dashboards." }
    ],
    contact_email: "edvouralearninghub@gmail.com",
    contact_phone: "+44 7700 900077",
    github_url: null,
    linkedin_url: "https://linkedin.com/company/edvoura",
    dribbble_url: null,
    twitter_url: "https://twitter.com/edvoura",
    created_at: "2026-01-03T00:00:00Z",
    is_verified: true,
    website_verified: true,
    is_supporter: true,
    is_featured: true,
    tagline: "Where Learners' Dreams Come True."
  },
  {
    id: "jemoorel-uuid-4444",
    email: "info@jemoorel.co.uk",
    full_name: "Je'moorel UK Ltd",
    avatar_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop",
    freelancer_category: "african_food_export",
    bio: "Bulk wholesale suppliers of premium red palm oil, egusi, stockfish, dried crayfish, and smoked food products imported directly for B2B distribution.",
    website_url: "https://jemoorel.co.uk",
    country: "United Kingdom",
    city: "London",
    username: "jemoorel-uk",
    hourly_rate: null,
    portfolio_projects: [],
    contact_email: "info@jemoorel.co.uk",
    contact_phone: "+44 7700 900088",
    github_url: null,
    linkedin_url: "https://linkedin.com/company/jemoorel",
    dribbble_url: null,
    twitter_url: null,
    created_at: "2026-01-04T00:00:00Z",
    is_verified: true,
    website_verified: true,
    is_supporter: true,
    is_featured: true,
    tagline: "Quality Food. Transformational Learning."
  },
  {
    id: "freelancer-5555",
    email: "sarah.c@designstudio.io",
    full_name: "Sarah Chen",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
    freelancer_category: "designer",
    bio: "UI/UX designer with 6+ years of experience crafting conversion-focused SaaS dashboards, sleek brand identities, and modern mobile applications.",
    website_url: "https://sarahchendesign.com",
    country: "Singapore",
    city: "Singapore",
    username: "sarah-chen",
    hourly_rate: 75,
    portfolio_projects: [],
    contact_email: "sarah.c@designstudio.io",
    contact_phone: "+65 9123 4567",
    github_url: null,
    linkedin_url: "https://linkedin.com/in/sarahchen",
    dribbble_url: "https://dribbble.com/sarahchen",
    twitter_url: null,
    created_at: "2026-01-05T00:00:00Z",
    is_verified: true,
    website_verified: true,
    is_supporter: false,
    is_featured: false,
    tagline: "Designing interfaces that convert."
  },
  {
    id: "freelancer-6666",
    email: "david@millerseo.com",
    full_name: "David Miller",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
    freelancer_category: "seo",
    bio: "Technical SEO specialist. I help e-commerce and local business websites increase organic search traffic by auditing and optimizing site structures.",
    website_url: "https://millerseo.com",
    country: "United States",
    city: "Austin",
    username: "david-miller",
    hourly_rate: 80,
    portfolio_projects: [],
    contact_email: "david@millerseo.com",
    contact_phone: "+1 512 555 0199",
    github_url: null,
    linkedin_url: "https://linkedin.com/in/davidmiller",
    dribbble_url: null,
    twitter_url: null,
    created_at: "2026-01-06T00:00:00Z",
    is_verified: true,
    website_verified: false,
    is_supporter: false,
    is_featured: false,
    tagline: "Rank higher. Get more customers."
  },
  {
    id: "freelancer-7777",
    email: "aisha@bellocopy.com",
    full_name: "Aisha Bello",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
    freelancer_category: "copywriter",
    bio: "SaaS copywriter and content strategist. Writing high-converting email sequences, blogs, and landing pages that sound human.",
    website_url: "https://bellocopy.com",
    country: "Nigeria",
    city: "Lagos",
    username: "aisha-bello",
    hourly_rate: 50,
    portfolio_projects: [],
    contact_email: "aisha@bellocopy.com",
    contact_phone: "+234 812 555 1212",
    github_url: null,
    linkedin_url: "https://linkedin.com/in/aishabello",
    dribbble_url: null,
    twitter_url: null,
    created_at: "2026-01-07T00:00:00Z",
    is_verified: true,
    website_verified: true,
    is_supporter: false,
    is_featured: false,
    tagline: "Copy that connects and sells."
  }
];
