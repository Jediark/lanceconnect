import { z } from "zod";

export const searchSchema = z.object({
  category: z.enum([
    "web_dev",
    "designer",
    "copywriter",
    "seo",
    "social_media",
    "video",
    "photography",
    "marketing",
    "app_dev",
    "va",
    "tutor",
    "african_food_export",
    "restaurant_supplier",
    "product_export",
    "b2b_trade",
    "corporate_training",
  ]),
  country: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  hasWebsite: z.enum(["yes", "no", ""]).optional(),
  minScore: z.number().min(0).max(100).optional(),
  minRating: z.number().min(0).max(5).optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(100),
  freelancerCategory: z.enum([
    "web_dev",
    "designer",
    "copywriter",
    "seo",
    "social_media",
    "video",
    "photography",
    "marketing",
    "app_dev",
    "va",
    "tutor",
    "african_food_export",
    "restaurant_supplier",
    "product_export",
    "b2b_trade",
    "corporate_training",
  ]),
  country: z.string().min(2).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const templateSchema = z.object({
  name: z.string().min(1).max(100),
  channel: z.enum(["email", "phone_script", "sms", "linkedin"]),
  subject: z.string().max(200).optional(),
  body: z.string().min(10),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  freelancerCategory: z
    .enum([
      "web_dev",
      "designer",
      "copywriter",
      "seo",
      "social_media",
      "video",
      "photography",
      "marketing",
      "app_dev",
      "va",
      "tutor",
      "african_food_export",
      "restaurant_supplier",
      "product_export",
      "b2b_trade",
      "corporate_training",
    ])
    .optional(),
  country: z.string().max(100).optional().nullable(),
  bio: z.string().max(500).optional(),
  websiteUrl: z.string().url().optional().nullable(),
});

export type SearchInput = z.infer<typeof searchSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
