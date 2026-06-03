# LanceConnect

**Find clients. Win work. Grow your freelance business.**

LanceConnect is a universal freelancer client acquisition platform. Any freelancer signs up, selects their skill category, and instantly gets access to a curated pipeline of real businesses that need their services.

## Features

- **Lead Discovery**: Find businesses with weak or no online presence
- **Opportunity Scoring**: Each lead scored 1-100 based on need signals
- **CRM Pipeline**: Track outreach status (New → Contacted → Interested → Proposal → Won/Lost)
- **Outreach Templates**: Ready-made emails, phone scripts, and DM templates
- **AI Outreach Writer** (Pro): Generate personalized messages in seconds

## Stack

- React 19 + TypeScript 5 + TanStack Start (Vite)
- Tailwind CSS 4 + Radix UI
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (subscriptions)
- Vercel (hosting)

## Development

```bash
npm install
npm run dev
```

## Database Setup

Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor.

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase and API keys.

## License

MIT