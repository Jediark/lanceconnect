# LanceConnect Development Guide

## Project Structure

```
lanceconnect/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui + custom components
│   │   ├── layout/       # AppLayout, Sidebar, Header, MobileNav
│   │   ├── leads/        # LeadCard, LeadTable, LeadFilters
│   │   ├── search/       # SearchBar, LocationPicker, CategoryPicker
│   │   ├── pipeline/     # PipelineBoard, PipelineCard
│   │   ├── outreach/     # TemplateEditor, TemplateList
│   │   └── billing/      # PricingCards, UsageBar
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Supabase auth + user state
│   │   └── PipelineContext.tsx # Lead pipeline state
│   ├── data/
│   │   ├── mockData.ts   # Development mock data (remove for prod)
│   │   └── content.ts    # Static content (blog, team, etc)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useLeads.ts
│   │   └── useSubscription.ts
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   ├── stripe.ts         # Stripe client
│   │   ├── utils.ts          # cn(), formatters
│   │   └── validations.ts    # Zod schemas
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx         # Landing page
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── onboarding.tsx
│   │   ├── app.dashboard.tsx
│   │   ├── app.discover.tsx
│   │   ├── app.pipeline.tsx
│   │   ├── app.templates.tsx
│   │   ├── app.ai-generator.tsx
│   │   ├── app.upgrade.tsx
│   │   └── app.settings.tsx
│   ├── store/
│   │   └── filterStore.ts    # Zustand search filters
│   └── types/
│       └── index.ts          # All TypeScript interfaces
├── supabase/
│   ├── functions/
│   │   ├── search-leads/
│   │   └── stripe-webhook/
│   └── migrations/
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Rules & Conventions

### 1. Component Rules
- Use Tailwind CSS for all styling (no inline styles except for dynamic values)
- Use `cn()` utility from `@/lib/utils` for conditional classes
- All interactive components must have proper hover/focus states
- Use Lucide icons consistently (no emoji in UI, only in content)
- Mobile-first responsive design (use `lg:` prefix for desktop)

### 2. Type Rules
- All types defined in `src/types/index.ts`
- Never use `any` - always use proper types
- Use `z.infer<typeof schema>` for form types

### 3. State Management
- Auth + pipeline: React Context (simple, works well)
- Search filters: Zustand store (`src/store/filterStore.ts`)
- Server state: TanStack Query

### 4. API Integration
- All external API calls via Supabase Edge Functions
- NEVER call Google Places API directly from frontend
- Use environment variables for API keys (VITE_ prefix for client)
- Handle loading, error, and success states in UI

### 5. Naming Conventions
- Components: PascalCase (`LeadCard`, `Header`)
- Files: kebab-case for routes, PascalCase for components
- Types: PascalCase (`Lead`, `User`)
- Variables: camelCase (`leadId`, `opportunityScore`)

### 6. Styling Conventions
- Colors: Use CSS variables (`var(--primary)`, `var(--ink-bg)`)
- Fonts: Outfit for headings, DM Sans for body, JetBrains Mono for data
- No gradients - solid color tokens only
- Consistent spacing: `space-y-{1.5|2|3}`, `gap-{2|3|4}`

### 7. Build Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Run ESLint
npm run format     # Run Prettier
```

---

## Key Implementation Notes

### Lead Card Design
```tsx
// Key elements:
// 1. Business name + type + location
// 2. Opportunity score badge (color coded)
// 3. Website status (has/no website)
// 4. Phone + email (copiable)
// 5. Rating stars
// 6. Save button
```

### Opportunity Scoring Algorithm
```typescript
function calculateOpportunityScore(place: any): number {
  let score = 0
  if (!place.websiteUri) score += 40          // No website
  if ((place.rating || 5) < 3.5) score += 20  // Low rating
  if ((place.userRatingCount || 0) < 10) score += 15 // Few reviews
  if (place.rating >= 4.0) score += 15        // Good business
  score += Math.min(10, Math.floor(Math.random() * 10)) // Variance
  return Math.min(100, score)
}
```

### Plan Limits
| Plan | Leads/Month | Price |
|------|-------------|-------|
| Free | 10 | $0 |
| Starter | 100 | $19 |
| Pro | 500 | $49 |
| Agency | Unlimited | $99 |

---

## Environment Variables (.env)

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Supabase Edge Functions Secrets
GOOGLE_PLACES_API_KEY=AIza...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe (public)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_STARTER=price_...
VITE_STRIPE_PRICE_PRO=price_...
VITE_STRIPE_PRICE_AGENCY=price_...

# App
VITE_APP_URL=https://lanceconnect.app
```

---

## Testing Commands

```bash
# Run linting
npm run lint

# Check TypeScript
npx tsc --noEmit

# Build check
npm run build
```

---

## COMPLETED

- [x] Logo SVG component with two-node connector (`src/components/Logo.tsx`)
- [x] Favicon SVG (32x32) (`public/favicon.svg`)
- [x] Types system (`src/types/index.ts`)
- [x] Validation schemas (`src/lib/validations.ts`)
- [x] Supabase client (`src/lib/supabase.ts`)
- [x] Filter store (`src/store/filterStore.ts`)
- [x] Search components (`src/components/search/SearchBar.tsx`)
- [x] Database schema (`supabase/migrations/001_initial_schema.sql`)
- [x] Environment variables (`.env.example`)
- [x] Home page hero with human mosaic + floating animations (Framer Motion)
- [x] Stats bar 
- [x] All pages renamed to "LanceConnect"
- [x] Slogan: "The Meeting Point for Freelancers and Clients" in all headers/footers

## TODO (Frontend Remaining)

- [ ] Add Framer Motion to remaining sections
- [ ] Polish About/How It Works/Features pages with bento grids
- [ ] Polish Pricing page (add credit pack section)
- [ ] Polish all system pages (404, 500, maintenance)

## BACKEND (Deferred - after frontend complete)

- [ ] Supabase Edge Functions for lead search
- [ ] Google Places API integration
- [ ] Stripe webhook integration