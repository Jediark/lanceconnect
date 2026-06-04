import * as Sentry from 'npm:@sentry/deno'
Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN_BACKEND'),
  environment: Deno.env.get('ENVIRONMENT') || 'production',
  tracesSampleRate: 0.1,
})

import Stripe from 'https://esm.sh/stripe@12.0.0'
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
    const { priceId, planName = 'starter', checkoutType = 'subscription', creditsAmount = 0, successUrl, cancelUrl } = body

    if (!successUrl || !cancelUrl) {
      throw new AppError('successUrl and cancelUrl are required', 400, 'BAD_REQUEST')
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient()
    })

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Retrieve or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new AppError('User profile not found', 404, 'NOT_FOUND')
    }

    let customerId = profile.stripe_customer_id

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: { supabase_user_id: user.id }
      })
      customerId = customer.id

      // Update user profile with customer id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    let sessionParams: Stripe.Checkout.SessionCreateParams

    if (checkoutType === 'subscription') {
      if (!priceId) {
        throw new AppError('priceId is required for subscriptions', 400, 'BAD_REQUEST')
      }

      sessionParams = {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          supabase_user_id: user.id,
          checkout_type: 'subscription',
          plan_name: planName
        }
      }
    } else if (checkoutType === 'credits') {
      if (creditsAmount <= 0) {
        throw new AppError('creditsAmount must be greater than 0', 400, 'BAD_REQUEST')
      }

      // $0.20 per credit
      const unitAmountCents = 20
      const totalAmount = creditsAmount * unitAmountCents

      sessionParams = {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${creditsAmount} LanceConnect Leads Credits`,
                description: 'Pay-per-use lead discovery credits'
              },
              unit_amount: unitAmountCents
            },
            quantity: creditsAmount
          }
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          supabase_user_id: user.id,
          checkout_type: 'credits',
          credits_amount: creditsAmount.toString()
        }
      }
    } else {
      throw new AppError('Invalid checkoutType. Supported: subscription, credits', 400, 'BAD_REQUEST')
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    Sentry.captureException(error)
    return handleError(error)
  }
})
