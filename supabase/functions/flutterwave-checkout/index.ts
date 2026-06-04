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

/**
 * Flutterwave Checkout Edge Function
 * ====================================
 * Creates a Flutterwave Standard payment link.
 * Flutterwave supports NGN, GHS, KES, ZAR, USD, GBP, EUR, TZS, UGX, RWF.
 *
 * API: https://developer.flutterwave.com/reference/create-payment
 */

const PRICING: Record<string, Record<string, { amount: number; currency: string }>> = {
  individual: {
    NGN: { amount: 10_000, currency: 'NGN' },
    USD: { amount: 7, currency: 'USD' },
    GHS: { amount: 50, currency: 'GHS' },
    ZAR: { amount: 120, currency: 'ZAR' },
    KES: { amount: 1_000, currency: 'KES' },
  },
  company: {
    NGN: { amount: 30_000, currency: 'NGN' },
    USD: { amount: 20, currency: 'USD' },
    GHS: { amount: 150, currency: 'GHS' },
    ZAR: { amount: 350, currency: 'ZAR' },
    KES: { amount: 3_000, currency: 'KES' },
  },
}

const CREDIT_RATES: Record<string, number> = {
  NGN: 50,
  USD: 0.20,
  GHS: 5,
  ZAR: 6,
  KES: 50,
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
    const {
      planName,
      checkoutType = 'subscription',
      creditsAmount = 0,
      currency = 'NGN',
      redirectUrl,
    } = body

    if (!redirectUrl) {
      throw new AppError('redirectUrl is required', 400, 'BAD_REQUEST')
    }

    const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!flutterwaveSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new AppError('User profile not found', 404, 'NOT_FOUND')
    }

    let amount: number
    let txCurrency: string
    let description: string

    if (checkoutType === 'subscription') {
      if (!planName || !PRICING[planName]) {
        throw new AppError(
          `Invalid planName. Supported: ${Object.keys(PRICING).join(', ')}`,
          400,
          'BAD_REQUEST'
        )
      }

      const currencyKey = currency.toUpperCase()
      const tier = PRICING[planName][currencyKey] || PRICING[planName]['USD']
      amount = tier.amount
      txCurrency = tier.currency
      description = `LanceConnect ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan – Monthly`
    } else if (checkoutType === 'credits') {
      if (creditsAmount <= 0) {
        throw new AppError('creditsAmount must be greater than 0', 400, 'BAD_REQUEST')
      }

      const currencyKey = currency.toUpperCase()
      const rate = CREDIT_RATES[currencyKey] || CREDIT_RATES['USD']
      txCurrency = currencyKey in CREDIT_RATES ? currencyKey : 'USD'
      amount = creditsAmount * rate
      description = `${creditsAmount} LanceConnect Lead Credits`
    } else {
      throw new AppError('Invalid checkoutType. Supported: subscription, credits', 400, 'BAD_REQUEST')
    }

    // Generate unique transaction reference
    const txRef = `lc_${checkoutType}_${user.id.substring(0, 8)}_${Date.now()}`

    const flutterwavePayload = {
      tx_ref: txRef,
      amount,
      currency: txCurrency,
      redirect_url: redirectUrl,
      customer: {
        email: profile.email,
        name: profile.full_name || profile.email,
      },
      meta: {
        supabase_user_id: user.id,
        checkout_type: checkoutType,
        plan_name: planName || '',
        credits_amount: creditsAmount,
      },
      customizations: {
        title: 'LanceConnect',
        description,
        logo: `${Deno.env.get('APP_URL') || 'https://lanceconnect.vercel.app'}/logo.png`,
      },
    }

    const flwRes = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flutterwavePayload),
    })

    const flwData = await flwRes.json()

    if (flwData.status !== 'success') {
      console.error('Flutterwave init failed:', flwData)
      throw new AppError(
        flwData.message || 'Flutterwave payment initialization failed',
        502,
        'FLUTTERWAVE_ERROR'
      )
    }

    return new Response(
      JSON.stringify({
        payment_link: flwData.data.link,
        tx_ref: txRef,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    Sentry.captureException(error)
    return handleError(error)
  }
})
