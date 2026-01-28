import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { getUserIdFromCookies } from '@/lib/session/userCookie'
import { getLatestSession } from '@/lib/onboarding/session'

export async function POST() {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  if (!userId) {
    return NextResponse.json({ error: 'missing user' }, { status: 400 })
  }

  const session = await getLatestSession(userId)
  if (!session) {
    return NextResponse.json({ error: 'missing session' }, { status: 400 })
  }

  const priceId = process.env.STRIPE_PRICE_ID
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!priceId || !appUrl) {
    return NextResponse.json({ error: 'missing stripe config' }, { status: 500 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/success`,
    cancel_url: `${appUrl}/cancel`,
    metadata: {
      user_id: userId,
      session_id: session.id,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
