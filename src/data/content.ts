/** Real Unsplash images used across the marketing site. All free-to-use, attributed via author handles below. */
export const IMG = {
  // Hero / general
  heroFreelancer: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&q=80", // woman with laptop on bed (Brooke Cagle)
  heroLaptop: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1400&q=80", // laptop on desk
  workspace: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1400&q=80", // desk
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80",
  coffeeShop: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1400&q=80",
  marketStall: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=80",
  // Categories
  webDev: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80",
  designer: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=80",
  copywriter: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  seo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
  social: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1200&q=80",
  video: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80",
  photo: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80",
  marketing: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200&q=80",
  appDev: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80",
  va: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
  // Faces — for testimonials & team. Real people photos from Unsplash.
  face1: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80",
  face2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
  face3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
  face4: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
  face5: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  face6: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
  face7: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80",
  face8: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
  // Blog images
  blog1: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80",
  blog2: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=80",
  blog3: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80",
  blog4: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1000&q=80",
  blog5: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&q=80",
  blog6: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=80",
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  author: string;
  authorAvatar: string;
  date: string;
  readMins: number;
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "first-five-cold-emails",
    title: "The first 5 cold emails I sent as a freelance web developer",
    excerpt: "What worked, what flopped, and the script I now use on every Monday morning.",
    body: `When I started freelancing in Lagos in 2023, I had a portfolio of three projects and zero leads. Cold email felt awkward — but it was the only honest way to start a pipeline without spending money I didn't have.\n\nThe first email I sent was a 400-word essay about my services. No reply. The second was shorter but full of "I"s. No reply. The third was three sentences, ended in a question, and got a reply in 17 minutes.\n\nHere's what I learned: people don't owe you a reply. They owe you about four seconds of attention. Use them well.`,
    cover: IMG.blog1, author: "Taiwo Adeyemi", authorAvatar: IMG.face1, date: "May 21, 2026", readMins: 6, category: "Outreach",
  },
  {
    slug: "scoring-leads-without-ai",
    title: "How to score leads without fancy AI",
    excerpt: "A back-of-the-envelope framework for ranking businesses before you reach out.",
    body: `Lead scoring sounds like enterprise software jargon, but it's actually something a 15-year-old with a spreadsheet could do. Here's the version I used for two years before any AI got involved.\n\nGive every business 1 point for each painful thing you'd fix for them, and subtract 1 for each blocker. Three painful things and one blocker? Score: 2.`,
    cover: IMG.blog2, author: "Maria Silva", authorAvatar: IMG.face2, date: "May 14, 2026", readMins: 4, category: "Sales",
  },
  {
    slug: "pricing-as-a-new-freelancer",
    title: "Pricing as a new freelancer (without underselling yourself)",
    excerpt: "Three pricing mistakes I made in my first year — and what I'd do differently.",
    body: `My first website cost the client $80. It took me 32 hours. That's $2.50 per hour, less than a coffee in Naples. Don't be me.`,
    cover: IMG.blog3, author: "James Kariuki", authorAvatar: IMG.face3, date: "May 7, 2026", readMins: 5, category: "Business",
  },
  {
    slug: "calling-strangers-cold-calls",
    title: "Calling strangers: a freelancer's guide to cold calls that don't suck",
    excerpt: "The opening line that works, the question that doesn't, and how to handle the 'send me an email' brush-off.",
    body: `Cold calls are not dead. They're just badly done. A good cold call is one minute long, ends in a question, and never tries to sell anything.`,
    cover: IMG.blog4, author: "Priya Patel", authorAvatar: IMG.face4, date: "April 30, 2026", readMins: 7, category: "Outreach",
  },
  {
    slug: "freelance-from-anywhere",
    title: "Freelancing from anywhere: clients I won from a beach in Goa",
    excerpt: "A week-by-week breakdown of how location stopped mattering for my consulting practice.",
    body: `Two years ago I moved from London to Goa for the winter. I assumed my income would tank. It tripled.`,
    cover: IMG.blog5, author: "Alex Johnson", authorAvatar: IMG.face5, date: "April 23, 2026", readMins: 8, category: "Lifestyle",
  },
  {
    slug: "templates-vs-personal-outreach",
    title: "Templates vs personal outreach: the unsexy truth",
    excerpt: "When templates work, when they backfire, and the 80/20 rule that saved my Mondays.",
    body: `Templates aren't shortcuts — they're scaffolding. The first three sentences are templated. The fourth is yours.`,
    cover: IMG.blog6, author: "Sofia Romano", authorAvatar: IMG.face6, date: "April 16, 2026", readMins: 5, category: "Outreach",
  },
];

export const CHANGELOG: { date: string; version: string; title: string; items: string[]; tag: "feature" | "improvement" | "fix" }[] = [
  { date: "May 28, 2026", version: "v2.4.0", title: "AI Outreach Writer is live for Pro", tag: "feature", items: ["Personalised email + DM generator, fed from each lead's profile", "Tone slider: friendly, formal, casual, direct", "5 languages: English, Spanish, French, Italian, Portuguese"] },
  { date: "May 14, 2026", version: "v2.3.2", title: "Faster discovery in dense cities", tag: "improvement", items: ["Discover queries in Lagos, Mumbai and São Paulo are 3× faster", "Lead cards now lazy-load — pages with 100+ leads stay snappy"] },
  { date: "May 02, 2026", version: "v2.3.0", title: "Pipeline kanban with drag-and-drop", tag: "feature", items: ["Move leads between stages by dragging", "Per-stage filters and weekly follow-up view", "CSV export of your full pipeline"] },
  { date: "Apr 19, 2026", version: "v2.2.4", title: "Fix: WhatsApp links not opening on iOS 17", tag: "fix", items: ["Outreach links to WhatsApp now use the universal wa.me handler"] },
  { date: "Apr 04, 2026", version: "v2.2.0", title: "9 new freelancer categories", tag: "feature", items: ["Added VAs, photographers, video editors, marketers and 5 more", "Each category gets its own opportunity-scoring model"] },
];

export const TEAM = [
  { name: "Taiwo Adeyemi", role: "Co-founder, Engineering", city: "Lagos, Nigeria", avatar: IMG.face1, bio: "Ex-freelance web dev. Built the first version on weekends." },
  { name: "Maria Silva", role: "Co-founder, Design", city: "São Paulo, Brazil", avatar: IMG.face2, bio: "Designed the product after years of cold-emailing her own clients." },
  { name: "James Kariuki", role: "Growth & Sales", city: "Nairobi, Kenya", avatar: IMG.face3, bio: "Helps freelancers close their first 10 clients." },
  { name: "Priya Patel", role: "Engineering", city: "Mumbai, India", avatar: IMG.face4, bio: "Lead-discovery pipelines, opportunity scoring." },
  { name: "Sofia Romano", role: "Content", city: "Naples, Italy", avatar: IMG.face6, bio: "Writes the playbooks freelancers actually use." },
  { name: "Lucas Fernández", role: "Support", city: "Buenos Aires, Argentina", avatar: IMG.face5, bio: "Replies within 4 hours, every day, in 3 languages." },
];

export const FREELANCER_CATEGORIES: {
  slug: string; label: string; emoji: string; image: string; tagline: string; description: string;
  problems: string[]; sampleBusinesses: { name: string; reason: string }[];
}[] = [
  { slug: "web-developers", label: "Web Developers", emoji: "💻", image: IMG.webDev,
    tagline: "Find local businesses still running on a Facebook page.",
    description: "Every week, FreelanceConnect surfaces hundreds of restaurants, salons, plumbers and clinics in your area that have no website — or a broken one from 2014. Reach them before someone else does.",
    problems: ["No website at all", "Outdated WordPress with broken links", "No mobile-friendly version", "No online booking form"],
    sampleBusinesses: [{name:"Boulangerie Dupont, Lyon",reason:"4.9★ on Google, no website"},{name:"Mario's Ristorante, Naples",reason:"Facebook-only presence"},{name:"Lagos Hair Studio",reason:"Website returns 502"}],
  },
  { slug: "designers", label: "Graphic Designers", emoji: "🎨", image: IMG.designer,
    tagline: "Spot brands that desperately need a refresh.",
    description: "Logos from 2008. Menus printed in Comic Sans. Inconsistent colours across every channel. These businesses don't know they need you — until you show them.",
    problems: ["Dated or pixelated logo", "No brand consistency online", "Ugly menus and price lists", "No social media graphics"],
    sampleBusinesses: [{name:"Smith & Sons Plumbing, Manchester",reason:"Logo is clip-art"},{name:"Café Mirador, Buenos Aires",reason:"Different colours on each platform"},{name:"AutoFix Garage, Toronto",reason:"No brand kit"}],
  },
  { slug: "copywriters", label: "Copywriters", emoji: "✍️", image: IMG.copywriter,
    tagline: "Find websites whose copy is putting customers to sleep.",
    description: "Generic 'About Us' pages. Headlines that say 'Welcome to our site'. Product descriptions written by the founder at 11pm. The web is full of businesses that need a copywriter — they just don't know it.",
    problems: ["Generic homepage hero copy", "No clear value proposition", "Empty or thin blog", "Vague service descriptions"],
    sampleBusinesses: [{name:"Dr. Patel Dental Clinic, Mumbai",reason:"Homepage says 'Welcome to our website'"},{name:"AutoFix Garage, Toronto",reason:"No services described"}],
  },
  { slug: "seo-specialists", label: "SEO Specialists", emoji: "📈", image: IMG.seo,
    tagline: "Find businesses invisible on Google.",
    description: "If a restaurant doesn't appear in 'best pizza near me' results in their own city, you have a client. We'll show you which ones.",
    problems: ["No Google Business Profile", "Not indexed for their main keyword", "No backlinks", "Slow page speed"],
    sampleBusinesses: [{name:"Boulangerie Dupont, Lyon",reason:"Not ranking for 'bakery Lyon'"},{name:"Kuala Lumpur Yoga Studio",reason:"No GMB profile"}],
  },
  { slug: "social-media", label: "Social Media Managers", emoji: "📱", image: IMG.social,
    tagline: "Spot brands whose Instagram hasn't posted since 2022.",
    description: "Restaurants, gyms, boutiques — they all know they 'should' be posting. They just don't have time. That's your opening.",
    problems: ["Last post 6+ months ago", "No Reels or short-form video", "Inconsistent branding across platforms", "No paid social presence"],
    sampleBusinesses: [{name:"Mario's Ristorante, Naples",reason:"Last post: 2022"},{name:"Café Mirador, Buenos Aires",reason:"Only 47 followers"}],
  },
  { slug: "videographers", label: "Videographers", emoji: "🎥", image: IMG.video,
    tagline: "Find businesses whose YouTube is a wasteland.",
    description: "Hotels with zero room-tour videos. Restaurants with no behind-the-scenes content. Schools with no campus tours. These need video — and they have budgets.",
    problems: ["No video content at all", "Only one shaky phone video", "No Reels or TikTok presence", "Outdated promo from 2019"],
    sampleBusinesses: [{name:"Kuala Lumpur Yoga Studio",reason:"No class previews"},{name:"Dr. Patel Dental Clinic",reason:"No clinic tour"}],
  },
  { slug: "photographers", label: "Photographers", emoji: "📸", image: IMG.photo,
    tagline: "Find restaurants using stock photos of pasta.",
    description: "Hotels with blurry lobby shots. Restaurants with dimly-lit menu photos. Salons with no portfolio. Your camera is the answer.",
    problems: ["Stock photos instead of real shots", "Blurry phone photos on Google", "No portfolio of their actual work", "No team headshots"],
    sampleBusinesses: [{name:"Boulangerie Dupont, Lyon",reason:"Generic croissant stock photo"},{name:"Lagos Hair Studio",reason:"No before/after gallery"}],
  },
  { slug: "marketers", label: "Digital Marketers", emoji: "📣", image: IMG.marketing,
    tagline: "Spot businesses spending zero on ads — and growing flat.",
    description: "If they're not on Meta Ads, Google Ads, or running email campaigns, you can probably double their reach in 90 days.",
    problems: ["No paid advertising at all", "No email list", "No remarketing pixels", "No analytics installed"],
    sampleBusinesses: [{name:"Smith & Sons Plumbing",reason:"No tracking pixels"},{name:"AutoFix Garage, Toronto",reason:"No email signup"}],
  },
  { slug: "virtual-assistants", label: "Virtual Assistants", emoji: "🤝", image: IMG.va,
    tagline: "Find solo founders drowning in admin.",
    description: "Coaches, consultants, agency owners — they all do too much themselves. We surface the busy ones who're showing the signs.",
    problems: ["Founder still doing all email", "No CRM or inbox management", "Manual invoicing", "Booking calls done over DMs"],
    sampleBusinesses: [{name:"Dr. Patel Dental Clinic",reason:"Owner replies to every DM personally"},{name:"Café Mirador",reason:"Owner doing all bookings via WhatsApp"}],
  },
  { slug: "app-developers", label: "App Developers", emoji: "📲", image: IMG.appDev,
    tagline: "Spot businesses that need a mobile app — not just a website.",
    description: "Loyalty programs, booking apps, delivery apps. There's a huge middle market of established businesses with no app at all.",
    problems: ["No loyalty app for repeat customers", "Booking done via phone only", "No mobile ordering", "No staff scheduling app"],
    sampleBusinesses: [{name:"Kuala Lumpur Yoga Studio",reason:"Bookings via WhatsApp"},{name:"AutoFix Garage, Toronto",reason:"Paper service records"}],
  },
];
