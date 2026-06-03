import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { validateAuth } from '../_shared/auth.ts'
import { handleError, AppError } from '../_shared/errors.ts'

/**
 * Paystack Checkout Edge Function
 * ================================
 * Initializes a Paystack payment transaction for:
 *  - Subscription plans (Individual ₦10,000 / $7, Company ₦30,000 / $20)
 *  - One-off credit purchases
 *
 * Paystack API: https://paystack.com/docs/api/transaction/#initialize
 */

// Fixed pricing tiers — avoids volatile exchange-rate issues
const PRICING: Record<string, Record<string, { amount: number; currency: string }>> = {
  individual: {
    NGN: { amount: 1_000_000, currency: 'NGN' },  // ₦10,000 in kobo
    USD: { amount: 700, currency: 'USD' },          // $7 in cents
    GHS: { amount: 5_000, currency: 'GHS' },        // GH₵50 in pesewas
    ZAR: { amount: 12_000, currency: 'ZAR' },       // R120 in cents
    KES: { amount: 100_000, currency: 'KES' },      // KSh1,000 in cents
  },
  company: {
    NGN: { amount: 3_000_000, currency: 'NGN' },  // ₦30,000 in kobo
    USD: { amount: 2_000, currency: 'USD' },       // $20 in cents
    GHS: { amount: 15_000, currency: 'GHS' },      // GH₵150 in pesewas
    ZAR: { amount: 35_000, currency: 'ZAR' },      // R350 in cents
    KES: { amount: 300_000, currency: 'KES' },     // KSh3,000 in cents
  },
}

// Credits: ₦50 per credit (NGN), $0.20 per credit (USD)
const CREDIT_RATES: Record<string, number> = {
  NGN: 5_000,   // ₦50 in kobo
  USD: 20,       // $0.20 in cents
  GHS: 500,      // GH₵5 in pesewas
  ZAR: 600,      // R6 in cents
  KES: 5_000,    // KSh50 in cents
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
      callbackUrl,
    } = body

    if (!callbackUrl) {
      throw new AppError('callbackUrl is required', 400, 'BAD_REQUEST')
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!paystackSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly', 500, 'MISCONFIGURED')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user email from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, paystack_customer_code')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      throw new AppError('User profile not found', 404, 'NOT_FOUND')
    }

    let amountInSubunit: number
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
      amountInSubunit = tier.amount
      txCurrency = tier.currency
      description = `LanceConnect ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan – Monthly`
    } else if (checkoutType === 'credits') {
      if (creditsAmount <= 0) {
        throw new AppError('creditsAmount must be greater than 0', 400, 'BAD_REQUEST')
      }

      const currencyKey = currency.toUpperCase()
      const rate = CREDIT_RATES[currencyKey] || CREDIT_RATES['USD']
      txCurrency = currencyKey in CREDIT_RATES ? currencyKey : 'USD'
      amountInSubunit = creditsAmount * rate
      description = `${creditsAmount} LanceConnect Lead Credits`
    } else {
      throw new AppError('Invalid checkoutType. Supported: subscription, credits', 400, 'BAD_REQUEST')
    }

    // Initialize Paystack transaction
    const paystackPayload = {
      email: profile.email,
      amount: amountInSubunit,
      currency: txCurrency,
      callback_url: callbackUrl,
      metadata: {
        custom_fields: [
          { display_name: 'Plan', variable_name: 'plan_name', value: planName || '' },
          { display_name: 'Type', variable_name: 'checkout_type', value: checkoutType },
          { display_name: 'Credits', variable_name: 'credits_amount', value: String(creditsAmount) },
        ],
        supabase_user_id: user.id,
        checkout_type: checkoutType,
        plan_name: planName || '',
        credits_amount: creditsAmount,
      },
    }

    // If user already has a Paystack customer code, attach it
    if (profile.paystack_customer_code) {
      (paystackPayload as Record<string, unknown>).customer = profile.paystack_customer_code
    }

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    })

    const paystackData = await paystackRes.json()

    if (!paystackData.status) {
      console.error('Paystack init failed:', paystackData)
      throw new AppError(
        paystackData.message || 'Paystack transaction initialization failed',
        502,
        'PAYSTACK_ERROR'
      )
    }

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return handleError(error)
  }
})
