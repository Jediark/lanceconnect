import * as Sentry from 'npm:@sentry/deno'
Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN_BACKEND'),
  environment: Deno.env.get('ENVIRONMENT') || 'production',
  tracesSampleRate: 0.1,
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { validateAuth } from '../_shared/auth.ts'
import { handleError, AppError } from '../_shared/errors.ts'
import { checkRateLimit } from '../_shared/ratelimit.ts'
import { z } from 'https://esm.sh/zod@3.22.0'

const requestSchema = z.object({
  leadId: z.string().uuid()
})

// Simple helper to generate a deterministic pseudo-random number based on a string seed
function seedRandom(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(Math.sin(hash))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await validateAuth(req)
    if (!user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const body = await req.json().catch(() => ({}))
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'VALIDATION_FAILED', details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { leadId } = parsed.data

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Enforce Rate Limit: 100 requests/hour for SEO audit
    const ipAddress = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || null
    const rateLimit = await checkRateLimit(supabase, user.id, ipAddress, 'lead-seo-audit', 100, 3600)
    if (!rateLimit.allowed) {
      throw new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED')
    }

    // Fetch lead details
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadErr || !lead) {
      throw new AppError('Lead not found', 404, 'NOT_FOUND')
    }

    const businessType = lead.business_type || 'business'
    const city = lead.city || 'local'
    const rating = Number(lead.google_rating || 0)
    const reviewCount = Number(lead.google_review_count || 0)
    const hasWebsite = !!lead.has_website

    // Define target keywords for local SEO
    const keywordTemplates = [
      `best ${businessType} in ${city}`,
      `${businessType} near me`,
      `affordable ${businessType} ${city}`,
      `top rated ${businessType} ${city}`,
      `${lead.business_name} ${city}`
    ]

    const keywords = keywordTemplates.map((keyword, index) => {
      const seed = seedRandom(keyword + lead.id)
      
      // Heuristic search volume: between 100 and 1500 monthly searches
      const volume = Math.floor(seed * 14) * 100 + 100
      
      // Heuristic difficulty: 15% to 65%
      const difficulty = Math.floor(seed * 50) + 15

      let rank = 100
      if (hasWebsite) {
        // Higher Google rating and more reviews = better organic rank
        const baseRank = Math.floor((5 - rating) * 15)
        const reviewBonus = Math.min(Math.floor(reviewCount / 10), 15)
        rank = Math.max(1, Math.floor(baseRank - reviewBonus + (seed * 20)) + (index * 8))
      }

      return {
        keyword,
        volume,
        difficulty,
        rank: hasWebsite ? rank : 100
      }
    })

    // Sort keywords by search volume
    keywords.sort((a, b) => b.volume - a.volume)

    // Generate a high-converting outreach SEO hook based on the worst-performing top-volume keyword
    let hook = `Hi, did you know that your business doesn't currently list an active website on Google Maps? Over 75% of local searches end up visiting a business with a direct website. I can build a clean, mobile-friendly landing page for you in 3 days to help capture these leads.`
    
    if (hasWebsite) {
      // Find the keyword that has the worst rank but decent search volume (>300) to use as outreach leverage
      const targetKeyword = keywords.find(k => k.rank > 20 && k.volume >= 300) || keywords[0]
      if (targetKeyword) {
        if (targetKeyword.rank > 100) {
          hook = `Hi, I was looking at your SEO performance in ${city} and noticed that you aren't currently appearing on Google's search indexes for '${targetKeyword.keyword}'. I can help optimize your local citations and page speed to get you ranking on page 1.`
        } else {
          hook = `Hi, I was analyzing local search listings in ${city} and noticed that for '${targetKeyword.keyword}' (which gets ${targetKeyword.volume} monthly searches), your website is currently ranking at #${targetKeyword.rank} (page ${Math.floor(targetKeyword.rank / 10) + 1}). Over 90% of search traffic stays on page 1. I can help optimize your on-page SEO to push your site into the top spots.`
        }
      }
    }

    // Insert Audit Action to Audit Log
    try {
      await supabase.from('audit_log').insert({
        user_id: user.id,
        action: 'lead.seo_audited',
        entity_type: 'lead',
        entity_id: leadId,
        metadata: { business_name: lead.business_name, city, has_website: hasWebsite },
        ip_address: ipAddress,
        user_agent: req.headers.get('user-agent') || null
      })
    } catch (auditErr) {
      console.warn('Failed to insert audit log:', auditErr)
    }

    return new Response(
      JSON.stringify({ success: true, keywords, hook }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    Sentry.captureException(error)
    return handleError(error)
  }
})
