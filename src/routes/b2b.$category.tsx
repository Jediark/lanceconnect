import { createFileRoute, redirect } from "@tanstack/react-router";

// B2B slug mapping to find-clients slugs
const B2B_SLUG_MAP: Record<string, string> = {
  "african-food-export": "african-food-export",
  "human-capital-development": "human-capital",
  "training-recruitment": "training-recruitment",
  "parent-tutor-matching": "parent-tutor",
  "restaurant-supplier": "restaurant-suppliers",
  "product-import-export": "product-export",
  "b2b-trade": "b2b-trade",
};

export const Route = createFileRoute("/b2b/$category")({
  beforeLoad: ({ params }) => {
    const targetSlug = B2B_SLUG_MAP[params.category] || params.category;
    throw redirect({
      to: "/find-clients/$category",
      params: { category: targetSlug },
      replace: true,
    });
  },
});
