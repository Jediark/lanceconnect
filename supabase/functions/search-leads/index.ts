import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { validateAuth } from '../_shared/auth.ts'
import { handleError, AppError } from '../_shared/errors.ts'

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
    const { query = '', city = '', country = '', limit = 10 } = body

    if (!query || !city || !country) {
      throw new AppError('query, city, and country are required parameters', 400, 'BAD_REQUEST')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const apifyServiceUrl = Deno.env.get('APIFY_SERVICE_URL') || 'http://apify-service.internal:8002'

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Check user lead limits
    const { data: limitCheck, error: limitErr } = await supabase.rpc('check_lead_limit', {
      p_user_id: user.id,
      p_count: 1
    })

    if (limitErr) {
      throw new Error(`Quota check failed: ${limitErr.message}`)
    }

    if (!limitCheck) {
      throw new AppError('Monthly lead limit or credits exhausted. Please upgrade your plan.', 402, 'QUOTA_EXHAUSTED')
    }

    // 2. Query cached database first
    const { data: cachedLeads, error: cacheError } = await supabase
      .from('leads')
      .select('*')
      .eq('country', country)
      .ilike('city', city)
      .or(`industry.ilike.%${query}%,business_type.ilike.%${query}%,business_name.ilike.%${query}%`)
      .gt('cache_expires_at', new Date().toISOString())
      .limit(limit)

    if (cacheError) {
      console.warn('Cache query failed, proceeding directly to scrape:', cacheError)
    }

    let finalLeads = cachedLeads || []

    // 3. Fallback to scrape if cache is empty or insufficient
    if (finalLeads.length < 3) {
      console.log(`Cache miss for ${query} in ${city}, ${country}. Invoking Apify scraper...`)
      
      try {
        const scrapeRes = await fetch(
          `${apifyServiceUrl}/scrape?keyword=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&limit=10`,
          {
            method: 'GET',
            signal: AbortSignal.timeout(14000) // 14s timeout
          }
        )

        if (scrapeRes.ok) {
          const scrapedData = await scrapeRes.json()
          const newLeads = scrapedData.leads || []

          if (newLeads.length > 0) {
            const leadsToInsert = newLeads.map((item: any) => ({
              business_name: item.business_name,
              business_type: item.business_type || query,
              industry: query,
              description: item.description || null,
              country,
              city,
              full_address: item.full_address || null,
              phone: item.phone || null,
              email: item.email || null,
              website_url: item.website_url || null,
              has_website: !!item.website_url,
              google_place_id: item.google_place_id || null,
              google_rating: item.google_rating || null,
              google_review_count: item.google_review_count || 0,
              google_maps_url: item.google_maps_url || null,
              source: 'google_maps',
              cache_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days cache
            }))

            // Batch upsert leads ignoring duplicates on google_place_id
            const { data: insertedLeads, error: upsertError } = await supabase
              .from('leads')
              .upsert(leadsToInsert, { onConflict: 'google_place_id' })
              .select()

            if (upsertError) {
              console.error('Failed to upsert scraped leads into database:', upsertError)
            } else if (insertedLeads) {
              // Trigger scoring and socials lookup for the newly scraped leads asynchronously
              for (const newLead of insertedLeads) {
                // Trigger opportunity scoring (internal endpoint)
                fetch(`${supabaseUrl}/functions/v1/score-opportunity`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.get('Authorization') || ''
                  },
                  body: JSON.stringify({ leadId: newLead.id })
                }).catch(err => console.error('Async scoring trigger failed for lead:', newLead.id, err))
              }
              
              // Append to final results
              finalLeads = [...finalLeads, ...insertedLeads].slice(0, limit)
            }
          }
        } else {
          console.warn(`Apify microservice returned status ${scrapeRes.status}`)
        }
      } catch (scrapeErr) {
        console.error('Apify service call failed:', scrapeErr)
      }
    }

    // 4. Deduct quota and log search
    await supabase.rpc('consume_leads', {
      p_user_id: user.id,
      p_count: 1
    })

    await supabase.from('search_history').insert({
      user_id: user.id,
      query_params: { query, city, country },
      results_count: finalLeads.length,
      leads_consumed: 1
    })

    return new Response(JSON.stringify({ success: true, leads: finalLeads }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return handleError(error)
  }
})
