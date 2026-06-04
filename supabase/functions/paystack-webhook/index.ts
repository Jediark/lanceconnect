import * as Sentry from 'npm:@sentry/deno'
Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN_BACKEND'),
  environment: Deno.env.get('ENVIRONMENT') || 'production',
  tracesSampleRate: 0.1,
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { handleError, AppError } from '../_shared/errors.ts'
import { sendEmail, getUpgradeEmailHtml, getPaymentFailedEmailHtml } from '../_shared/email.ts'

async function verifyPaystackSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  const computedHex = Array.from(new Uint8Array(signed))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return computedHex === signature
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!paystackSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    // Verify Paystack HMAC-SHA512 signature
    const signature = req.headers.get('x-paystack-signature')
    if (!signature) {
      throw new AppError('Missing Paystack signature', 400, 'INVALID_SIGNATURE')
    }

    const bodyText = await req.text()
    const isValid = await verifyPaystackSignature(bodyText, signature, paystackSecretKey)

    if (!isValid) {
      console.error('Paystack webhook signature verification failed')
      throw new AppError('Invalid webhook signature', 400, 'INVALID_SIGNATURE')
    }

    const event = JSON.parse(bodyText)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Processing Paystack event: ${event.event}`)

    switch (event.event) {
      case 'charge.success': {
        const data = event.data
        const metadata = data.metadata || {}
        const userId = metadata.supabase_user_id
        const checkoutType = metadata.checkout_type
        const reference = data.reference

        if (!userId) {
          console.warn('charge.success without supabase_user_id in metadata')
          break
        }

        // Save Paystack customer code to profile if missing
        if (data.customer?.customer_code) {
          await supabase
            .from('profiles')
            .update({ paystack_customer_code: data.customer.customer_code })
            .eq('id', userId)
            .is('paystack_customer_code', null)
        }

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
              description: `Purchased ${creditsAmount} credits via Paystack`,
              stripe_payment_id: `paystack_${reference}`,
            })

            console.log(`Credited ${creditsAmount} credits to user: ${userId}`)
          }
        } else if (checkoutType === 'subscription') {
          const planName = metadata.plan_name || 'individual'

          let leadsLimit = 10
          if (planName === 'individual') leadsLimit = 200
          else if (planName === 'company') leadsLimit = -1  // unlimited

          const { data: profile } = await supabase
            .from('profiles')
            .update({
              plan: planName,
              subscription_status: 'active',
              payment_gateway: 'paystack',
              paystack_reference: reference,
              leads_limit: leadsLimit,
            })
            .eq('id', userId)
            .select()
            .single()

          console.log(`Activated plan "${planName}" for user: ${userId}`)

          // Send Upgrade Confirmation Email
          if (profile) {
            console.log(`Sending plan upgrade email to user: ${profile.email}`)
            await sendEmail({
              to: profile.email,
              subject: 'LanceConnect Upgrade Confirmed! 🎉',
              html: getUpgradeEmailHtml(profile.full_name || 'Freelancer', planName)
            })
          }
        }

        // Log to audit
        await supabase.from('audit_log').insert({
          user_id: userId,
          action: 'paystack_charge_success',
          entity_type: 'payment',
          meta: {
            reference,
            checkout_type: checkoutType,
            amount: data.amount,
            currency: data.currency,
          },
        }).catch(() => {})

        break
      }

      case 'subscription.create': {
        const data = event.data
        const customerCode = data.customer?.customer_code

        if (customerCode) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('paystack_customer_code', customerCode)
            .single()

          if (profile) {
            await supabase
              .from('profiles')
              .update({
                paystack_subscription_code: data.subscription_code,
                subscription_status: 'active',
                subscription_end_date: data.next_payment_date || null,
              })
              .eq('id', profile.id)

            console.log(`Subscription created for user: ${profile.id}`)
          }
        }
        break
      }

      case 'subscription.disable': {
        const data = event.data
        const customerCode = data.customer?.customer_code

        if (customerCode) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('paystack_customer_code', customerCode)
            .single()

          if (profile) {
            await supabase
              .from('profiles')
              .update({
                plan: 'free',
                paystack_subscription_code: null,
                subscription_status: 'inactive',
                subscription_end_date: null,
                leads_limit: 10,
              })
              .eq('id', profile.id)

            console.log(`Subscription disabled — user reset to free: ${profile.id}`)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const data = event.data
        const customerCode = data.customer?.customer_code

        if (customerCode) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .eq('paystack_customer_code', customerCode)
            .single()

          if (profile) {
            await supabase
              .from('profiles')
              .update({ subscription_status: 'past_due' })
              .eq('id', profile.id)

            console.log(`Payment failed for user: ${profile.id}`)

            // Send Failed Payment Email
            await sendEmail({
              to: profile.email,
              subject: 'Paystack Failed Payment Notice ⚠️',
              html: getPaymentFailedEmailHtml(profile.full_name || 'Freelancer')
            })
          }
        }
        break
      }

      default:
        console.log(`Unhandled Paystack event: ${event.event}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    Sentry.captureException(error)
    return handleError(error)
  }
})
