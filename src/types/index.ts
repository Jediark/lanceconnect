export type Lead = {
  id: string;
  businessName: string;
  businessType: string;
  industry: string;
  country: string;
  city: string;
  fullAddress?: string;
  phone: string;
  email: string | null;
  websiteUrl: string | null;
  hasWebsite: boolean;
  googleRating: number;
  googleReviewCount: number;
  opportunityScore: number;
  latitude?: number;
  longitude?: number;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  googleMapsUrl?: string | null;
  source: string;
  createdAt: string;
  savedAt?: string | null;
  status?: PipelineStatus | null;
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

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  freelancerCategory: string;
  country: string | null;
  city?: string | null;
  bio?: string | null;
  websiteUrl?: string | null;
  onboardingCompleted?: boolean;
  plan: "free" | "starter" | "pro" | "agency";
  leadsUsedThisMonth: number;
  leadsLimit: number;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
};

export type OutreachTemplate = {
  id: string;
  name: string;
  channel: "email" | "phone_script" | "sms" | "linkedin";
  subject: string | null;
  body: string;
  isDefault: boolean;
};

export type Category = {
  id: string;
  label: string;
  emoji: string;
  example: string;
};

export type Country = {
  code: string;
  flag: string;
  name: string;
};

export type SearchFilters = {
  category: string;
  country: string;
  city: string;
  hasWebsite: boolean | null;
  minScore: number;
  minRating: number | null;
};

export type Plan = "free" | "starter" | "pro" | "agency";

export const PLAN_LIMITS: Record<Plan, { leadsLimit: number; price: number }> = {
  free: { leadsLimit: 10, price: 0 },
  starter: { leadsLimit: 100, price: 19 },
  pro: { leadsLimit: 500, price: 49 },
  agency: { leadsLimit: 999999, price: 99 },
};

export const CATEGORY_TO_PLACES_QUERY: Record<string, string[]> = {
  web_dev: ["local business", "restaurant", "salon", "contractor", "retail store"],
  designer: ["restaurant", "boutique", "cafe", "gym", "beauty salon"],
  copywriter: ["law firm", "real estate agency", "clinic", "consultant"],
  seo: ["dentist", "plumber", "electrician", "accountant", "lawyer"],
  social_media: ["restaurant", "boutique", "fitness studio", "cafe", "bar"],
  video: ["gym", "restaurant", "real estate agency", "school"],
  photography: ["wedding venue", "restaurant", "real estate agency", "hotel"],
  marketing: ["startup", "retail store", "clinic", "sports club"],
  app_dev: ["restaurant chain", "retail store", "healthcare provider"],
  va: ["entrepreneur", "small business", "consultant", "coach"],
};