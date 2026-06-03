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
    const { action, leadId, status, notes, followUpDate, dealValue } = body

    if (!leadId) {
      throw new AppError('leadId is required', 400, 'BAD_REQUEST')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new AppError('Invalid action. Supported actions: save, update, delete', 400, 'INVALID_ACTION')
  } catch (error) {
    return handleError(error)
  }
})
