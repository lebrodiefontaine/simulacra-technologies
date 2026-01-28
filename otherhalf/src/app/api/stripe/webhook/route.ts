import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const signature = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  }

  const payload = await req.text()
  let event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  const supabase = supabaseServer()
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.user_id
    const onboardingSessionId = session.metadata?.session_id
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : null
    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id

    if (userId) {
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        status: 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        onboarding_session_id: onboardingSessionId,
      })
    }
  }

  return NextResponse.json({ received: true })
}
