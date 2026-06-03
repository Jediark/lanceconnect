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
    const { leadId, channel, tone = 'professional' } = body

    if (!leadId || !channel) {
      throw new AppError('leadId and channel are required', 400, 'BAD_REQUEST')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch lead details
    const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single()
    if (!lead) {
      throw new AppError('Lead not found', 404, 'NOT_FOUND')
    }

    // Build the context prompt based on the signals
    const prompt = `You are a world-class freelance marketer pitching your services. 
Write a short, highly personalized ${channel} message in a ${tone} tone to ${lead.business_name}.
Context:
- Business Type: ${lead.business_type}
- Location: ${lead.city}, ${lead.country}
- Website: ${lead.has_website ? lead.website_url : 'No Website'}
- Rating: ${lead.google_rating} (${lead.google_review_count} reviews)
- Opportunities Identified: ${JSON.stringify(lead.score_breakdown)}

Rules:
- Do not use placeholders (like [Name]). 
- Keep it short and to the point.
- Focus on how you can solve their specific opportunity (e.g. build a website, improve rating, or run ads).
- Provide a single, clear call to action.`

    // Call Gemini API (using gemini-1.5-flash)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      }
    )

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text()
      throw new Error(`Gemini API failed with status ${geminiRes.status}: ${errorText}`)
    }

    const resJson = await geminiRes.json()
    const generatedText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!generatedText) {
      throw new Error('Gemini API returned an empty response')
    }

    // Cache the message
    const { error: upsertError } = await supabase.from('ai_messages').upsert({
      user_id: user.id,
      lead_id: leadId,
      channel,
      tone,
      message: generatedText.trim(),
      model: 'gemini-1.5-flash'
    }, { onConflict: 'user_id,lead_id,channel,tone' })

    if (upsertError) {
      console.error('Failed to cache AI message:', upsertError)
    }

    return new Response(JSON.stringify({ message: generatedText.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return handleError(error)
  }
})
