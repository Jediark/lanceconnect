import { createFileRoute } from "@tanstack/react-router";
import {
  CITY_COUNTRY_MAP,
  SKILL_CONFIG,
  TOP_CITIES,
} from "@/data/dynamicRouteData";

const BASE_URL = "https://lanceconnect.vercel.app";

// The 6 premium handcrafted static pages
const STATIC_SEO_PAGES = [
  "/find-clients/lagos",
  "/find-clients/london",
  "/find-clients/dubai",
  "/find-clients/web-developer",
  "/find-clients/graphic-designer",
  "/find-clients/copywriter",
];

// Core marketing pages
const CORE_PAGES = [
  "/",
  "/pricing",
  "/features",
  "/about",
  "/how-it-works",
  "/blog",
  "/freelancers",
  "/contact",
  "/services",
  "/safety",
  "/portfolio",
  "/register",
  "/login",
];

const KNOWN_CITIES = Object.keys(CITY_COUNTRY_MAP);
const KNOWN_SKILLS = Object.keys(SKILL_CONFIG);
// Static skill slugs from the 6 pages
const STATIC_SKILL_SLUGS = ["web-developer", "graphic-designer", "copywriter"];
const ALL_SKILLS = [...KNOWN_SKILLS, ...STATIC_SKILL_SLUGS];

// Dynamic city pages (excluding the 6 static ones)
const dynamicCityPages = KNOWN_CITIES.filter(
  (c) => !STATIC_SEO_PAGES.includes(`/find-clients/${c}`)
).map((city) => `/find-clients/${city}`);

// Dynamic skill pages (excluding the 6 static ones)
const dynamicSkillPages = KNOWN_SKILLS.filter(
  (s) => !STATIC_SEO_PAGES.includes(`/find-clients/${s}`)
).map((skill) => `/find-clients/${skill}`);

// Skill + city combinations (all skills × top 20 cities)
const skillCityPages = ALL_SKILLS.flatMap((skill) =>
  TOP_CITIES.map((city) => `/find-clients/${skill}/${city}`)
);

const countryPages = [
  '/find-clients/united-states',
  '/find-clients/nigeria',
  '/find-clients/united-kingdom',
  '/find-clients/india',
  '/find-clients/ghana',
  '/find-clients/kenya',
  '/find-clients/south-africa',
  '/find-clients/canada',
  '/find-clients/australia',
  '/find-clients/germany',
  '/find-clients/france',
  '/find-clients/uae',
  '/find-clients/brazil',
  '/find-clients/philippines',
  '/find-clients/malaysia',
];

function buildXml(urls: Array<{ loc: string; priority: string; freq: string }>) {
  const items = urls
    .map(
      ({ loc, priority, freq }) =>
        `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  loader: () => {
    const urlList = [
      ...CORE_PAGES.map((loc) => ({ loc, priority: "1.0", freq: "daily" })),
      ...countryPages.map((loc) => ({ loc, priority: "0.8", freq: "weekly" })),
      ...STATIC_SEO_PAGES.map((loc) => ({ loc, priority: "0.9", freq: "weekly" })),
      ...dynamicCityPages.map((loc) => ({ loc, priority: "0.7", freq: "weekly" })),
      ...dynamicSkillPages.map((loc) => ({ loc, priority: "0.7", freq: "weekly" })),
      ...skillCityPages.map((loc) => ({ loc, priority: "0.6", freq: "monthly" })),
    ];

    return new Response(buildXml(urlList), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
  // No component needed — the loader returns the full response
  component: () => null,
});
