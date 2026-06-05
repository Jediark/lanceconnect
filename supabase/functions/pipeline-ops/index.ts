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
  action: z.enum(['save', 'update', 'delete']),
  leadId: z.string().uuid(),
  status: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().nullable().optional(),
  dealValue: z.number().nullable().optional()
})

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

    const { action, leadId, status, notes, followUpDate, dealValue } = parsed.data

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Enforce Rate Limit: 50 requests/hour for pipeline operations
    const ipAddress = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || null
    const rateLimit = await checkRateLimit(supabase, user.id, ipAddress, 'pipeline-ops', 50, 3600)
    if (!rateLimit.allowed) {
      throw new AppError('Too many requests. Please try again later.', 429, 'RATE_LIMIT_EXCEEDED')
    }

    if (action === 'save') {
      const { data, error } = await supabase
        .from('user_leads')
        .upsert(
          {
            user_id: user.id,
            lead_id: leadId,
            status: status || 'new',
            notes: notes || null,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,lead_id' }
        )
        .select()
        .single()

      if (error) throw error

      const savedLead = { id: data.lead_id }

      // Automatically trigger contact enrichment after saving to pipeline
      try {
        await supabase.functions.invoke('enrich-contact', {
          body: { leadId: savedLead.id }
        })
      } catch (enrichErr) {
        console.error('Failed to trigger enrich-contact after pipeline save:', enrichErr)
      }

      // Log Action to Audit Log
      try {
        await supabase.from('audit_log').insert({
          user_id: user.id,
          action: 'pipeline.lead_saved',
          entity_type: 'lead',
          entity_id: leadId,
          metadata: { status: status || 'new' },
          ip_address: ipAddress,
          user_agent: req.headers.get('user-agent') || null
        })
      } catch (auditErr) {
        console.warn('Failed to insert audit log:', auditErr)
      }

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'update') {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }
      if (status) {
        updateData.status = status
        if (status === 'contacted') updateData.contacted_at = new Date().toISOString()
        if (status === 'won') updateData.won_at = new Date().toISOString()
      }
      if (notes !== undefined) updateData.notes = notes
      if (followUpDate !== undefined) updateData.follow_up_date = followUpDate
      if (dealValue !== undefined) updateData.deal_value = dealValue

      const { data, error } = await supabase
        .from('user_leads')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('lead_id', leadId)
        .select()
        .single()

      if (error) throw error

      // Log Action to Audit Log
      try {
        await supabase.from('audit_log').insert({
          user_id: user.id,
          action: 'pipeline.status_updated',
          entity_type: 'lead',
          entity_id: leadId,
          metadata: { status, dealValue, followUpDate },
          ip_address: ipAddress,
          user_agent: req.headers.get('user-agent') || null
        })
      } catch (auditErr) {
        console.warn('Failed to insert audit log:', auditErr)
      }

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('user_leads')
        .delete()
        .eq('user_id', user.id)
        .eq('lead_id', leadId)

      if (error) throw error

      // Log Action to Audit Log
      try {
        await supabase.from('audit_log').insert({
          user_id: user.id,
          action: 'pipeline.lead_removed',
          entity_type: 'lead',
          entity_id: leadId,
          metadata: {},
          ip_address: ipAddress,
          user_agent: req.headers.get('user-agent') || null
        })
      } catch (auditErr) {
        console.warn('Failed to insert audit log:', auditErr)
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new AppError('Invalid action. Supported actions: save, update, delete', 400, 'INVALID_ACTION')
  } catch (error) {
    Sentry.captureException(error)
    return handleError(error)
  }
})
