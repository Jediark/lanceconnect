import Stripe from 'https://esm.sh/stripe@12.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { handleError, AppError } from '../_shared/errors.ts'
import { sendEmail, getUpgradeEmailHtml, getPaymentFailedEmailHtml } from '../_shared/email.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!signature || !webhookSecret || !stripeSecretKey || !supabaseUrl || !supabaseServiceKey) {
      throw new AppError('Server is not configured correctly or missing headers', 500, 'MISCONFIGURED')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient()
    })

    const bodyText = await req.text()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error('Webhook signature verification failed:', errMsg)
      throw new AppError('Webhook signature verification failed', 400, 'INVALID_SIGNATURE')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    console.log(`Processing Stripe event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const checkoutType = session.metadata?.checkout_type

        if (!userId) {
          console.warn('Checkout session completed without supabase_user_id in metadata')
          break
        }

        if (checkoutType === 'credits') {
          const creditsAmount = parseInt(session.metadata?.credits_amount || '0')
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
              description: `Purchased ${creditsAmount} credits`,
              stripe_payment_id: session.payment_intent as string
            })

            console.log(`Credited ${creditsAmount} credits to user: ${userId}`)
          }
        } else if (checkoutType === 'subscription') {
          const subscriptionId = session.subscription as string
          const planName = session.metadata?.plan_name || 'starter'

          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          let leadsLimit = 10
          if (planName === 'starter') leadsLimit = 100
          else if (planName === 'pro') leadsLimit = 500
          else if (planName === 'agency') leadsLimit = 2000

          const { data: profile } = await supabase
            .from('profiles')
            .update({
              plan: planName,
              stripe_subscription_id: subscriptionId,
              subscription_status: subscription.status,
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
              leads_limit: leadsLimit
            })
            .eq('id', userId)
            .select()
            .single()

          console.log(`Activated plan ${planName} for user: ${userId}`)

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
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, plan, email, full_name')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          const status = subscription.status
          const endDate = new Date(subscription.current_period_end * 1000).toISOString()
          
          let leadsLimit = 10
          if (profile.plan === 'starter') leadsLimit = 100
          else if (profile.plan === 'pro') leadsLimit = 500
          else if (profile.plan === 'agency') leadsLimit = 2000

          await supabase
            .from('profiles')
            .update({
              subscription_status: status,
              subscription_end_date: endDate,
              leads_limit: status === 'active' ? leadsLimit : 10
            })
            .eq('id', profile.id)

          console.log(`Updated subscription status to ${status} for user: ${profile.id}`)

          // Send payment failed notification if status turns unpaid/past_due
          if (status === 'past_due' || status === 'unpaid') {
            await sendEmail({
              to: profile.email,
              subject: 'Stripe Payment Failed Notice ⚠️',
              html: getPaymentFailedEmailHtml(profile.full_name || 'Freelancer')
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              plan: 'free',
              stripe_subscription_id: null,
              subscription_status: 'inactive',
              subscription_end_date: null,
              leads_limit: 10
            })
            .eq('id', profile.id)

          console.log(`Subscription deleted. Reset user to free plan: ${profile.id}`)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return handleError(error)
  }
})
