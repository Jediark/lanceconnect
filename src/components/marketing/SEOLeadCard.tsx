import { Link } from "@tanstack/react-router";
import { Building2, MapPin, Star, Globe, Phone, Mail } from "lucide-react";

export interface LeadData {
  business_name: string;
  business_type: string;
  city: string;
  country: string;
  has_website: boolean;
  google_rating: number | null;
  google_review_count: number | null;
  opportunity_score: number | null;
  phone: string | null;
  email: string | null;
}

function scoreColor(score: number) {
  if (score >= 80) return { bg: "bg-red-500/10", text: "text-red-500 dark:text-red-400", border: "border-red-500/20", label: "🔥 Hot" };
  if (score >= 60) return { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", label: "⚡ Strong" };
  return { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", label: "💡 Warm" };
}

export function MaskedLeadCard({ lead, registerUrl }: { lead: LeadData; registerUrl: string }) {
  const score = lead.opportunity_score ?? 0;
  const sc = scoreColor(score);

  return (
    <div className="relative group rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 shadow-xl p-5 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <Building2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground leading-tight">{lead.business_name}</h3>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              {lead.business_type} · <MapPin className="h-3 w-3 inline" /> {lead.city}, {lead.country}
            </p>
          </div>
        </div>
        {score > 0 && (
          <div className={`flex items-center gap-1 ${sc.bg} ${sc.text} px-2.5 py-1 rounded-full border ${sc.border} text-xs font-bold font-mono`}>
            {score} {sc.label}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-3">
        <div className="flex items-center gap-2 text-xs">
          <Globe className="h-3.5 w-3.5 text-slate-400" />
          <span className={`font-medium ${lead.has_website ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {lead.has_website ? "Has website" : "No website"}
          </span>
        </div>
        {lead.google_rating != null && (
          <div className="flex items-center gap-2 text-xs">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-slate-700 dark:text-slate-350">
              {lead.google_rating} ({lead.google_review_count ?? 0} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Masked Contacts */}
      <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/50 pt-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-foreground/70">{lead.phone || "••••••••••"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-foreground/70">{lead.email || "•••@•••.com"}</span>
        </div>
      </div>

      {/* Blur overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent rounded-b-2xl flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link
          to={registerUrl as any}
          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
        >
          Sign up to unlock →
        </Link>
      </div>
    </div>
  );
}

export const MOCK_LEADS: Record<string, LeadData[]> = {
  lagos: [
    { business_name: "Mario's Restaurant", business_type: "Restaurant", city: "Lagos", country: "Nigeria", has_website: false, google_rating: 3.2, google_review_count: 18, opportunity_score: 94, phone: "+234 803••••", email: "mar•••@•••.com" },
    { business_name: "Blessing Hair Studio", business_type: "Hair Salon", city: "Lagos", country: "Nigeria", has_website: false, google_rating: 4.5, google_review_count: 42, opportunity_score: 88, phone: "+234 812••••", email: null },
    { business_name: "Chidi Auto Services", business_type: "Auto Repair", city: "Lagos", country: "Nigeria", has_website: false, google_rating: 3.8, google_review_count: 9, opportunity_score: 82, phone: "+234 705••••", email: "chi•••@•••.com" },
  ],
  london: [
    { business_name: "The Green Grocer", business_type: "Organic Shop", city: "London", country: "United Kingdom", has_website: false, google_rating: 4.1, google_review_count: 67, opportunity_score: 91, phone: "+44 207 ••••", email: "inf•••@•••.com" },
    { business_name: "Patel & Sons Tailors", business_type: "Tailoring", city: "London", country: "United Kingdom", has_website: false, google_rating: 4.7, google_review_count: 134, opportunity_score: 85, phone: "+44 208 ••••", email: "pat•••@•••.com" },
    { business_name: "Camden Dental Care", business_type: "Dental Clinic", city: "London", country: "United Kingdom", has_website: true, google_rating: 3.4, google_review_count: 23, opportunity_score: 79, phone: "+44 203 ••••", email: null },
  ],
  dubai: [
    { business_name: "Al Noor Pharmacy", business_type: "Pharmacy", city: "Dubai", country: "UAE", has_website: false, google_rating: 4.3, google_review_count: 88, opportunity_score: 93, phone: "+971 4 ••••", email: "alo•••@•••.com" },
    { business_name: "Spice Valley Restaurant", business_type: "Restaurant", city: "Dubai", country: "UAE", has_website: false, google_rating: 4.0, google_review_count: 201, opportunity_score: 86, phone: "+971 4 ••••", email: null },
    { business_name: "Desert Bloom Spa", business_type: "Spa & Wellness", city: "Dubai", country: "UAE", has_website: true, google_rating: 3.6, google_review_count: 31, opportunity_score: 78, phone: "+971 4 ••••", email: "des•••@•••.com" },
  ],
  web_dev: [
    { business_name: "Sunrise Bakery", business_type: "Bakery", city: "Lagos", country: "Nigeria", has_website: false, google_rating: 4.2, google_review_count: 56, opportunity_score: 95, phone: "+234 803••••", email: "sun•••@•••.com" },
    { business_name: "Luigi's Trattoria", business_type: "Restaurant", city: "London", country: "UK", has_website: true, google_rating: 3.1, google_review_count: 14, opportunity_score: 89, phone: "+44 207 ••••", email: "lui•••@•••.com" },
    { business_name: "Mama's Fashion", business_type: "Clothing Store", city: "Dubai", country: "UAE", has_website: false, google_rating: 4.6, google_review_count: 92, opportunity_score: 84, phone: "+971 4 ••••", email: null },
  ],
  designer: [
    { business_name: "Fresh Start Gym", business_type: "Fitness Center", city: "London", country: "UK", has_website: false, google_rating: 3.9, google_review_count: 27, opportunity_score: 91, phone: "+44 208 ••••", email: "fre•••@•••.com" },
    { business_name: "Apex Consulting", business_type: "Consulting Firm", city: "Dubai", country: "UAE", has_website: true, google_rating: 4.0, google_review_count: 8, opportunity_score: 87, phone: "+971 4 ••••", email: "ape•••@•••.com" },
    { business_name: "Trendy Threads", business_type: "Retail Shop", city: "Lagos", country: "Nigeria", has_website: false, google_rating: 4.4, google_review_count: 63, opportunity_score: 83, phone: "+234 812••••", email: null },
  ],
  copywriter: [
    { business_name: "Wellness First Clinic", business_type: "Medical Clinic", city: "Lagos", country: "Nigeria", has_website: true, google_rating: 3.5, google_review_count: 19, opportunity_score: 90, phone: "+234 705••••", email: "wel•••@•••.com" },
    { business_name: "Sterling Law Partners", business_type: "Law Firm", city: "London", country: "UK", has_website: true, google_rating: 4.1, google_review_count: 11, opportunity_score: 86, phone: "+44 203 ••••", email: "ste•••@•••.com" },
    { business_name: "Golden Key Realty", business_type: "Real Estate", city: "Dubai", country: "UAE", has_website: true, google_rating: 3.8, google_review_count: 44, opportunity_score: 81, phone: "+971 4 ••••", email: "gol•••@•••.com" },
  ],
};

export const SKILL_PILLS = [
  { label: "Web Development", to: "/find-clients/web-developers" },
  { label: "Graphic Design", to: "/find-clients/designers" },
  { label: "Copywriting", to: "/find-clients/copywriters" },
  { label: "SEO", to: "/find-clients/seo-specialists" },
  { label: "Social Media", to: "/find-clients/social-media" },
  { label: "Video Production", to: "/find-clients/videographers" },
  { label: "Photography", to: "/find-clients/photographers" },
  { label: "Marketing", to: "/find-clients/marketers" },
  { label: "App Development", to: "/find-clients/app-developers" },
];

export const CITY_PILLS = [
  { label: "Lagos", to: "/find-clients/lagos" },
  { label: "London", to: "/find-clients/london" },
  { label: "Dubai", to: "/find-clients/dubai" },
];
