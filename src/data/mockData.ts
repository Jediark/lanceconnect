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
};

export type PipelineStatus =
  | "new"
  | "contacted"
  | "interested"
  | "proposal_sent"
  | "won"
  | "lost";

export const MOCK_LEADS: Lead[] = [
  { id: "1", businessName: "Mario's Ristorante", businessType: "Restaurant", industry: "web_dev", city: "Naples", country: "Italy", fullAddress: "Via Toledo 45, Naples, Italy", phone: "+39 081 555 0123", email: null, websiteUrl: null, hasWebsite: false, googleRating: 3.2, googleReviewCount: 18, opportunityScore: 92, source: "google_places", savedAt: null, status: null },
  { id: "2", businessName: "Lagos Hair Studio", businessType: "Beauty Salon", industry: "designer", city: "Lagos", country: "Nigeria", fullAddress: "14 Awolowo Road, Ikoyi, Lagos", phone: "+234 802 555 0198", email: "info@lagoshair.ng", websiteUrl: null, hasWebsite: false, googleRating: 4.5, googleReviewCount: 7, opportunityScore: 78, source: "google_places", savedAt: null, status: null },
  { id: "3", businessName: "Smith & Sons Plumbing", businessType: "Contractor", industry: "seo", city: "Manchester", country: "United Kingdom", fullAddress: "8 Deansgate, Manchester, UK", phone: "+44 161 555 0145", email: null, websiteUrl: "http://smithplumbing.co.uk", hasWebsite: true, googleRating: 4.1, googleReviewCount: 34, opportunityScore: 61, source: "google_places", savedAt: null, status: null },
  { id: "4", businessName: "Café Mirador", businessType: "Café", industry: "social_media", city: "Buenos Aires", country: "Argentina", fullAddress: "Av. Corrientes 1234, Buenos Aires", phone: "+54 11 5550 9988", email: null, websiteUrl: null, hasWebsite: false, googleRating: 4.7, googleReviewCount: 5, opportunityScore: 88, source: "google_places", savedAt: null, status: null },
  { id: "5", businessName: "Dr. Patel Dental Clinic", businessType: "Dentist", industry: "copywriter", city: "Mumbai", country: "India", fullAddress: "Linking Road, Bandra West, Mumbai", phone: "+91 98200 55012", email: "drpatel@dentalclinic.in", websiteUrl: null, hasWebsite: false, googleRating: 3.8, googleReviewCount: 42, opportunityScore: 74, source: "google_places", savedAt: null, status: null },
  { id: "6", businessName: "AutoFix Garage", businessType: "Auto Repair", industry: "web_dev", city: "Toronto", country: "Canada", fullAddress: "567 Yonge St, Toronto, ON", phone: "+1 416 555 0177", email: null, websiteUrl: null, hasWebsite: false, googleRating: 4.0, googleReviewCount: 89, opportunityScore: 55, source: "google_places", savedAt: null, status: null },
  { id: "7", businessName: "Boulangerie Dupont", businessType: "Bakery", industry: "photography", city: "Lyon", country: "France", fullAddress: "23 Rue de la République, Lyon", phone: "+33 4 72 55 01 89", email: null, websiteUrl: null, hasWebsite: false, googleRating: 4.9, googleReviewCount: 3, opportunityScore: 96, source: "google_places", savedAt: null, status: null },
  { id: "8", businessName: "Kuala Lumpur Yoga Studio", businessType: "Fitness Studio", industry: "video", city: "Kuala Lumpur", country: "Malaysia", fullAddress: "Bukit Bintang, Kuala Lumpur", phone: "+60 3-2142 5588", email: "hello@klyoga.my", websiteUrl: null, hasWebsite: false, googleRating: 4.6, googleReviewCount: 11, opportunityScore: 81, source: "google_places", savedAt: null, status: null },
];

export const MOCK_PIPELINE_LEADS: Lead[] = [
  { ...MOCK_LEADS[0], savedAt: "2026-05-20", status: "contacted", notes: "Called on Tuesday, left voicemail", followUpDate: "2026-05-30" },
  { ...MOCK_LEADS[1], savedAt: "2026-05-22", status: "interested", notes: "Replied to email, wants a quote", followUpDate: "2026-05-28" },
  { ...MOCK_LEADS[3], savedAt: "2026-05-24", status: "new", notes: "", followUpDate: null },
  { ...MOCK_LEADS[4], savedAt: "2026-05-25", status: "proposal_sent", notes: "Sent proposal for $1,200 website", followUpDate: "2026-06-01" },
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
  { id: "tpl-1", name: "No Website — Web Dev Intro", channel: "email", subject: "Quick question about {{business_name}}'s online presence", body: `Hi there,\n\nI was searching for local businesses in {{city}} and came across {{business_name}} on Google Maps.\n\nI noticed you don't currently have a website. As a web developer who works with local businesses, I've seen firsthand how a clean, professional website can bring in new customers who search online.\n\nI'd love to show you what I could build for you — and I keep my rates affordable for small businesses.\n\nWould you have 10 minutes for a quick call this week?\n\nBest,\n{{your_name}}\nWeb Developer`, isDefault: true },
  { id: "tpl-2", name: "Low Rating — SEO Services", channel: "email", subject: "Helping {{business_name}} get found online", body: `Hi,\n\nI came across {{business_name}} while researching businesses in {{city}}.\n\nI specialize in SEO for local businesses — helping them rank higher on Google and get more customers finding them organically.\n\nWould you be open to a free 15-minute consultation to see how I could help?\n\nWarm regards,\n{{your_name}}`, isDefault: false },
  { id: "tpl-3", name: "Phone Script — Cold Call", channel: "phone_script", subject: null, body: `Hi, may I speak with the owner or manager?\n\n[When connected:]\n\nHi, my name is {{your_name}} and I'm a freelance web developer. I came across {{business_name}} while searching for businesses in {{city}} and noticed you might not have a website yet.\n\nI work with small businesses to build affordable, professional websites that help attract new customers.\n\nDo you have a couple of minutes to chat about what I could do for you?`, isDefault: false },
];

export const CATEGORIES = [
  { id: "web_dev", emoji: "💻", label: "Web Development", example: "Find businesses without websites" },
  { id: "designer", emoji: "🎨", label: "Graphic Design", example: "Find brands that need a refresh" },
  { id: "copywriter", emoji: "✍️", label: "Copywriting", example: "Find businesses with no blog or bad content" },
  { id: "seo", emoji: "📈", label: "SEO", example: "Find businesses invisible on Google" },
  { id: "social_media", emoji: "📱", label: "Social Media", example: "Find businesses with no Instagram/Facebook" },
  { id: "video", emoji: "🎥", label: "Video Production", example: "Find businesses with no video content" },
  { id: "photography", emoji: "📸", label: "Photography", example: "Find restaurants, hotels needing photos" },
  { id: "marketing", emoji: "📣", label: "Digital Marketing", example: "Find businesses with zero ad presence" },
  { id: "app_dev", emoji: "📲", label: "App Development", example: "Find businesses needing mobile apps" },
  { id: "va", emoji: "🤝", label: "Virtual Assistant", example: "Find busy entrepreneurs needing support" },
];

export const COUNTRIES = [
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "IN", flag: "🇮🇳", name: "India" },
  { code: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "AU", flag: "🇦🇺", name: "Australia" },
];

export const STATUS_META: Record<PipelineStatus, { label: string; emoji: string; color: string; ring: string }> = {
  new:           { label: "New",            emoji: "●", color: "bg-slate-100 text-slate-700",       ring: "border-l-slate-400" },
  contacted:     { label: "Contacted",      emoji: "↗", color: "bg-blue-100 text-blue-700",         ring: "border-l-blue-500" },
  interested:    { label: "Interested",     emoji: "✦", color: "bg-indigo-100 text-indigo-700",     ring: "border-l-indigo-500" },
  proposal_sent: { label: "Proposal Sent",  emoji: "✉", color: "bg-amber-100 text-amber-700",       ring: "border-l-amber-500" },
  won:           { label: "Won",            emoji: "✓", color: "bg-emerald-100 text-emerald-700",   ring: "border-l-emerald-500" },
  lost:          { label: "Lost",           emoji: "✕", color: "bg-red-100 text-red-700",           ring: "border-l-red-400" },
};
