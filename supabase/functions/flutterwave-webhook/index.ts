import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { handleError, AppError } from '../_shared/errors.ts'

/**
 * Flutterwave Webhook Edge Function
 * ====================================
 * Handles Flutterwave webhook events with hash verification.
 *
 * Flow:
 *  1. Verify `verif-hash` header matches our FLUTTERWAVE_WEBHOOK_HASH secret
 *  2. Re-verify the transaction via Flutterwave's /transactions/:id/verify endpoint
 *  3. Activate plan / credit credits accordingly
 *
 * Docs: https://developer.flutterwave.com/docs/integration-guides/webhooks/
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY')
    const webhookHash = Deno.env.get('FLUTTERWAVE_WEBHOOK_HASH')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!flutterwaveSecretKey || !webhookHash || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    // Step 1: Verify webhook hash
    const receivedHash = req.headers.get('verif-hash')
    if (!receivedHash || receivedHash !== webhookHash) {
      console.error('Flutterwave webhook hash mismatch')
      throw new AppError('Invalid webhook hash', 400, 'INVALID_SIGNATURE')
    }

    const body = await req.json()
    const eventData = body.data || body

    // Only process successful charges
    if (body.event !== 'charge.completed' || eventData.status !== 'successful') {
      console.log(`Skipping event: ${body.event} status: ${eventData.status}`)
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Step 2: Re-verify the transaction via Flutterwave API
    const transactionId = eventData.id
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${flutterwaveSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const verifyData = await verifyRes.json()

    if (
      verifyData.status !== 'success' ||
      verifyData.data?.status !== 'successful'
    ) {
      console.error('Flutterwave transaction verification failed:', verifyData)
      throw new AppError('Transaction verification failed', 400, 'VERIFICATION_FAILED')
    }

    const txData = verifyData.data
    const metadata = txData.meta || {}
    const userId = metadata.supabase_user_id
    const checkoutType = metadata.checkout_type
    const txRef = txData.tx_ref

    if (!userId) {
      console.warn('charge.completed without supabase_user_id in metadata')
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (checkoutType === 'credits') {
      const creditsAmount = parseInt(metadata.credits_amount || '0', 10)

      if (creditsAmount > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits_balance')
          .eq('id', userId)
          .single()

        const newBalance = (profile?.credits_balance || 0) + creditsAmount

        await supabase
          .from('profiles')
          .update({ credits_balance: newBalance })
          .eq('id', userId)

        await supabase.from('credit_transactions').insert({
          user_id: userId,
          type: 'purchase',
          amount: creditsAmount,
          balance_after: newBalance,
          description: `Purchased ${creditsAmount} credits via Flutterwave`,
          stripe_payment_id: `flw_${txRef}`,
        })

        console.log(`Credited ${creditsAmount} credits to user: ${userId}`)
      }
    } else if (checkoutType === 'subscription') {
      const planName = metadata.plan_name || 'individual'

      let leadsLimit = 10
      if (planName === 'individual') leadsLimit = 200
      else if (planName === 'company') leadsLimit = -1 // unlimited

      await supabase
        .from('profiles')
        .update({
          plan: planName,
          subscription_status: 'active',
          payment_gateway: 'flutterwave',
          flutterwave_tx_ref: txRef,
          flutterwave_tx_id: String(transactionId),
          leads_limit: leadsLimit,
        })
        .eq('id', userId)

      console.log(`Activated plan "${planName}" for user: ${userId}`)
    }

    // Audit log (best-effort)
    await supabase.from('audit_log').insert({
      user_id: userId,
      action: 'flutterwave_charge_success',
      meta: {
        tx_ref: txRef,
        transaction_id: transactionId,
        checkout_type: checkoutType,
        amount: txData.amount,
        currency: txData.currency,
      },
    }).catch(() => { /* audit is best-effort */ })

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return handleError(error)
  }
})
