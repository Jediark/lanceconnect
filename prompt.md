# LanceConnect — Master Build Prompt
**Version**: 1.0  
**Date**: 2026-05-28  
**Author**: TRENDY DEVELOPER OS v3.0  
**Target**: Lovable, Bolt.new, Claude (Artifacts)  
**Budget**: Bootstrap ($0–500)  
**Stack**: React + TypeScript + Tailwind CSS + Supabase + Vercel  

---

## EXECUTIVE SUMMARY

Build **LanceConnect** — a universal freelancer client acquisition platform. Any freelancer (web developer, designer, copywriter, SEO specialist, videographer, marketer, photographer, etc.) signs up, selects their skill category, and instantly gets access to a curated pipeline of real businesses that need their specific services. The platform discovers businesses with weak or no online presence, enriches them with contact data, scores them by opportunity quality, and gives freelancers the tools to reach out — all in one dashboard.

**The core problem it solves**: Millions of freelancers worldwide are skilled but struggle to find clients. Meanwhile, millions of local businesses have no website, bad SEO, poor branding, or no social media — and don't know who to call.

**This platform is the bridge.**

---

## STRATEGIC VISION

### Success Metrics (MVP — 90 days post-launch)
1. 500 registered freelancers
2. 10,000 business leads in the database across 5+ countries
3. 3% free-to-paid conversion rate (freemium model)
4. <3s page load time on mobile
5. 99.5% uptime

---

## TECHNICAL ARCHITECTURE

### System Context Diagram
```
[Freelancer User] 
    → HTTPS 
    → [LanceConnect Web App — React/Vite/TanStack Start on Vercel]
        → [Supabase] (Auth + PostgreSQL + Storage)
        → [Google Places API] (Business discovery)
        → [Stripe] (Subscription payments)
        → [Resend] (Transactional email)
```

### Tech Stack (Actual - TanStack Start)

```markdown
## Frontend
Framework:        React 19 + TypeScript 5 + Vite 7 (TanStack Start)
Styling:          Tailwind CSS 4 + Radix UI components
State:            React Context + TanStack Query 5
Routing:          TanStack Router 1
Icons:            Lucide React

## Backend (Supabase)
Database:         PostgreSQL 15 (via Supabase)
Auth:             Supabase Auth (email/password + Google OAuth)
Storage:          Supabase Storage (avatars, exports)
Edge Functions:   Supabase Edge Functions (Deno) for API calls
Realtime:         Supabase Realtime (lead count updates)

## External APIs
Business Data:    Google Places API (New) — Text Search + Place Details
Payments:         Stripe (subscriptions — monthly/annual)
Email:            Resend + React Email
```

---

## KEY FILES TO IMPLEMENT

### NEW FILES CREATED/NEEDED:

1. **`src/types/index.ts`** - All TypeScript interfaces for Lead, User, PipelineStatus, etc.
2. **`src/lib/validations.ts`** - Zod schemas for forms (search, register, login, template, profile)
3. **`src/lib/supabase.ts`** - Supabase client initialization
4. **`src/store/filterStore.ts`** - Zustand store for search filters

### DATABASE SCHEMA

See `supabase/migrations/001_initial_schema.sql` for full schema with:
- `profiles` table (user data + plan info)
- `leads` table (business leads with opportunity scoring)
- `user_leads` table (CRM pipeline - saved leads)
- `outreach_templates` table (email/phone templates)
- `search_history` table (re-running searches)
- Row Level Security on ALL tables

---

## DESIGN REFERENCES

DESIGN REFERENCES — Study these real websites before generating any UI. Do not create generic or AI-looking interfaces. Match the quality and aesthetic of these references exactly:

- **APP DASHBOARD & SIDEBAR** → linear.app
- **LANDING PAGE TRUST & CLARITY** → stripe.com
- **FEATURE SECTIONS (show real product)** → notion.so
- **LEAD CARDS & DATA TABLES** → apollo.io
- **HERO SECTION DARK AESTHETIC** → vercel.com
- **AUTH & ONBOARDING FORMS** → mercury.com
- **HOW IT WORKS PAGE** → loom.com
- **PRICING PAGE** → intercom.com/pricing
- **SCROLL ANIMATIONS** → framer.com
- **ABOUT & CREDIBILITY** → ramp.com

The overall product should feel like what you get if Linear and Apollo.io had a product built specifically for freelancers. Premium, calm, data-forward, globally credible.

---

## STATUS MAPPING

```typescript
// Opportunity Score Colors
90–100:  🔥 Hot Lead (bg-emerald-500)
70–89:   ⭐ Strong (bg-blue-500)
50–69:   👍 Good (bg-amber-500)
30–49:   💡 Possible (bg-orange-400)
1–29:    🔍 Weak (bg-slate-400)

// Pipeline Status
┌────────────┬──────────┬──────────────┬─────────────────┐
│ Status     │ Emoji    │ Color Class  │ Ring Color      │
├────────────┼──────────┼──────────────┼─────────────────┤
│ new        │ ●        │ slate-100    │ border-l-slate-400  │
│ contacted  │ ↗        │ blue-100     │ border-l-blue-500   │
│ interested │ ✦        │ indigo-100   │ border-l-indigo-500 │
│ proposal   │ ✉        │ amber-100    │ border-l-amber-500  │
│ won        │ ✓        │ emerald-100  │ border-l-emerald-500│
│ lost       │ ✕        │ red-100      │ border-l-red-400    │
└────────────┴──────────┴──────────────┴─────────────────┘
```

---

## NEXT STEPS

1. **Frontend Completion** (current focus):
   - [x] Core types defined (`src/types/index.ts`)
   - [x] Validation schemas (`src/lib/validations.ts`)
   - [x] Supabase client setup (`src/lib/supabase.ts`)
   - [x] Filter store (`src/store/filterStore.ts`)
   - [x] Rename to "LanceConnect"

2. **Remaining Frontend Tasks**:
   - Add Supabase integration to AuthContext
   - Add Zustand filter store to discover page
   - Create missing search components (SearchBar, LocationPicker, CategoryPicker)
   - Add Stripe integration to Upgrade page
   - Add AI generator real integration

3. **Backend** (after frontend complete):
   - Set up Supabase project
   - Deploy Edge Functions for lead search
   - Configure Google Places API
   - Set up Stripe webhooks
   - Deploy to Vercel

---

*End of LanceConnect Master Build Prompt v1.0*