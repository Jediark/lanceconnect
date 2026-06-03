# LanceConnect — Final Frontend Build Prompt
**Version**: 2.0 (Final) | **Date**: 2026-06-03
**Platform**: Kilo
**Stack**: React + TypeScript + TanStack Start (Vite) + Tailwind CSS + Framer Motion + shadcn/ui
**Data**: All mock/static — no real API calls yet
**Brand Name**: LanceConnect (NOT FreelanceConnect)
**Slogan**: "The Meeting Point for Freelancers and Clients"

---

## BRAND IDENTITY

### Logo Design
`<LanceConnectLogo />` SVG component:
- Left node: filled circle (#6366F1 indigo) — represents freelancer
- Center: stylized connector line
- Right node: filled circle (#10B981 emerald) — represents client  
- Wordmark: "Lance" in Outfit 700 white + "Connect" in Outfit 700 indigo
- Slogan below: "The Meeting Point for Freelancers and Clients" in JetBrains Mono 11px

### Favicon
`/public/favicon.svg`:
- Dark background: #080B14
- Two dots: left indigo (#6366F1), right emerald (#10B981)
- Connected by thin diagonal line
- Rounded square container (rx=8)

### Color System
```css
--lc-indigo:  #6366F1   /* Primary — CTAs, links */
--lc-emerald: #10B981   /* Success signals */
--lc-bg-base: #080B14   /* Page background */
--lc-bg-surface: #0F172A /* Cards, sidebar */
```

---

## DESIGN REFERENCES

**DO NOT** use generic templates, Bootstrap shadows, gradient blobs, or stock illustrations.

```
APP DASHBOARD & SIDEBAR  → linear.app
LANDING PAGE TRUST       → stripe.com  
FEATURE SECTIONS         → notion.so
LEAD CARDS & TABLES      → apollo.io
HERO DARK AESTHETIC      → vercel.com
AUTH & ONBOARDING        → mercury.com
HOW IT WORKS             → loom.com
PRICING PAGE             → intercom.com/pricing
SCROLL ANIMATIONS        → framer.com
ABOUT & CREDIBILITY      → ramp.com
OVERALL DARK AESTHETIC    → commandcode.ai
BENTO GRID + DATA FEEL  → abacus.ai
```

---

## HUMAN IMAGES (Critical Requirement)

Global platform = global imagery. Use real Unsplash photos with diverse ethnicities.

### Hero Mosaic Images
- africanManLaptop: woman with laptop (Brooke Cagle)  
- indianWomanWork: professional workspace
- whiteManCall: video call setup
- latinaDesigner: creative work
- asianManCoding: coding focused
- africanWomanSmile: confident freelancer

### Implementation
```tsx
const HUMAN_IMAGES = {
  africanManLaptop: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80",
  indianWomanWork: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  whiteManCall: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  latinaDesigner: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  asianManCoding: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80",
  africanWomanSmile: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80",
};
```

---

## ALL 42 PAGES TO BUILD

### PUBLIC ROUTES (MarketingShell)
1. `/` - Home page
2. `/about` - About
3. `/features` - Features
4. `/how-it-works` - How It Works
5. `/pricing` - Pricing
6. `/contact` - Contact
7. `/privacy` - Privacy Policy
8. `/terms` - Terms of Service
9. `/blog` - Blog index (6 posts)
10. `/blog/$slug` - Single blog post
11. `/changelog` - Changelog
12-21. `/freelancers/{web-developers,designers,copywriters,seo-specialists,social-media,videographers,photographers,marketers,virtual-assistants,app-developers}`

### AUTH ROUTES (AuthSplit layout)
22. `/register` - Sign up
23. `/login` - Log in
24. `/forgot-password` - Password reset
25. `/reset-password` - New password
26. `/verify-email` - Check inbox
27. `/onboarding` - 3-step wizard

### APP ROUTES (AppLayout with sidebar)
28. `/app/dashboard` - Stats + quick search
29. `/app/discover` - Lead discovery (CORE)
30. `/app/pipeline` - CRM kanban + table
31. `/app/templates` - Outreach templates
32. `/app/ai-generator` - AI writer (Pro gated)
33. `/app/upgrade` - In-app pricing

### SETTINGS ROUTES
34. `/app/settings` - Settings hub
35. `/app/settings/profile` - Profile editor
36. `/app/settings/subscription` - Plan + billing
37. `/app/settings/notifications` - Alert preferences
38. `/app/settings/danger-zone` - Delete account

### SYSTEM
39. `/404` - Not found
40. `/500` - Server error
41. `/maintenance` - Maintenance mode
42. `/unsubscribe` - Email unsubscribe

---

## KEY IMPLEMENTATION NOTES

### Section Labels
Every section must have `// label.style` prefix in JetBrains Mono 11px:
```tsx
<p className="text-[11px] font-mono-data text-muted-foreground uppercase tracking-widest">
  // find.clients.globally
</p>
```

### Opportunity Score Colors
- 90–100: emerald-500 "🔥 Hot Lead"
- 70–89: blue-500 "⭐ Strong"
- 50–69: amber-500 "👍 Good"
- 30–49: orange-400 "💡 Possible"
- 1–29: slate-400 "🔍 Weak"

### Pipeline Status Columns
```
NEW → CONTACTED → INTERESTED → PROPOSAL SENT → WON / LOST
```
Colors: slate, blue, indigo, amber, emerald, red

### Dependencies
```bash
npm install framer-motion zustand lucide-react sonner
npm install react-hook-form zod @hookform/resolvers
npx shadcn-ui@latest add button card badge dialog select tabs
```

---

## COMPLETED FRONTEND ELEMENTS

- [x] Logo SVG component with two-node connector
- [x] Favicon SVG (32x32)
- [x] Types system (`src/types/index.ts`)
- [x] Validation schemas (`src/lib/validations.ts`)
- [x] Supabase client (`src/lib/supabase.ts`)
- [x] Filter store (`src/store/filterStore.ts`)
- [x] Search components (`src/components/search/`)
- [x] Database schema (`supabase/migrations/001_initial_schema.sql`)
- [x] Environment variables (`.env.example`)
- [x] Home page hero with human mosaic
- [x] Stats bar with count-up animation
- [x] All pages renamed to LanceConnect

---

*End of LanceConnect Frontend Build Prompt v2.0*
*Ready for Kilo to complete remaining 42 pages and polish UI*