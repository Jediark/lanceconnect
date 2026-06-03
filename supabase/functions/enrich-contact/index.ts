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
    const { leadId } = body

    if (!leadId) {
      throw new AppError('leadId is required', 400, 'BAD_REQUEST')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const numverifyApiKey = Deno.env.get('NUMVERIFY_API_KEY')
    const mailboxlayerApiKey = Deno.env.get('MAILBOXLAYER_API_KEY')
    const hunterApiKey = Deno.env.get('HUNTER_API_KEY')
    const googlePagespeedApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch lead details
    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (fetchError || !lead) {
      throw new AppError('Lead not found', 404, 'NOT_FOUND')
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // 1. Phone validation (Numverify)
    if (lead.phone && !lead.phone_verified && numverifyApiKey) {
      try {
        const numRes = await fetch(
          `http://apilayer.net/api/validate?access_key=${numverifyApiKey}&number=${encodeURIComponent(lead.phone)}`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (numRes.ok) {
          const numData = await numRes.json()
          if (numData.valid) {
            updateData.phone_verified = true
            updateData.phone_verified_at = new Date().toISOString()
            const cleanPhone = lead.phone.replace(/[^0-9]/g, '')
            updateData.phone_whatsapp_link = `https://wa.me/${cleanPhone}`
          }
        }
      } catch (err) {
        console.error('Numverify API check failed:', err)
      }
    }

    // 2. Email discovery (Hunter.io)
    let emailFound = lead.email
    if (!lead.email && lead.website_url && hunterApiKey) {
      try {
        const domain = new URL(lead.website_url).hostname.replace('www.', '')
        const hunterRes = await fetch(
          `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${hunterApiKey}`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (hunterRes.ok) {
          const hunterData = await hunterRes.json()
          if (hunterData.data?.emails && hunterData.data.emails.length > 0) {
            emailFound = hunterData.data.emails[0].value
            updateData.email = emailFound
            updateData.email_confidence = 'likely'
          }
        }
      } catch (err) {
        console.error('Hunter.io API check failed:', err)
      }
    }

    // 3. Email verification (Mailboxlayer)
    if (emailFound && !lead.email_verified && mailboxlayerApiKey) {
      try {
        const mailRes = await fetch(
          `http://apilayer.net/api/check?access_key=${mailboxlayerApiKey}&email=${encodeURIComponent(emailFound)}`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (mailRes.ok) {
          const mailData = await mailRes.json()
          updateData.email_verified = mailData.format_valid && mailData.mx_found
          if (updateData.email_verified) {
            updateData.email_verified_at = new Date().toISOString()
            updateData.email_confidence = 'verified'
          } else {
            updateData.email_confidence = 'unverified'
          }
        }
      } catch (err) {
        console.error('Mailboxlayer API check failed:', err)
      }
    }

    // 4. Google PageSpeed Audit
    if (lead.website_url && lead.has_website) {
      try {
        let testUrl = lead.website_url
        if (!testUrl.startsWith('http://') && !testUrl.startsWith('https://')) {
          testUrl = `https://${testUrl}`
        }
        const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&strategy=mobile${googlePagespeedApiKey ? `&key=${googlePagespeedApiKey}` : ''}`
        
        const speedRes = await fetch(pageSpeedUrl, { signal: AbortSignal.timeout(8000) })
        if (speedRes.ok) {
          const speedData = await speedRes.json()
          const audit = speedData.lighthouseResult
          const performanceScore = audit?.categories?.performance?.score
          const mobileFriendly = audit?.audits?.['viewport']?.score === 1

          if (performanceScore !== undefined) {
            updateData.website_score = Math.round(performanceScore * 100)
          }
          updateData.website_mobile_ok = mobileFriendly
          updateData.website_live = true
          updateData.website_has_ssl = testUrl.startsWith('https://')
          updateData.last_verified_at = new Date().toISOString()
        }
      } catch (err) {
        console.error('Google PageSpeed check failed:', err)
      }
    }

    // Save enrichment results
    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single()

    if (updateError) throw updateError

    // Automatically trigger opportunity scoring recalculation after enrichment
    try {
      await fetch(`${supabaseUrl}/functions/v1/score-opportunity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.get('Authorization') || ''
        },
        body: JSON.stringify({ leadId })
      })
    } catch (scoreErr) {
      console.error('Failed to trigger score-opportunity after enrichment:', scoreErr)
    }

    return new Response(JSON.stringify({ success: true, lead: updatedLead }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return handleError(error)
  }
})
