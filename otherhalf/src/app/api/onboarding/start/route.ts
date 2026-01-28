import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserIdFromCookies } from '@/lib/session/userCookie'
import { createSession } from '@/lib/onboarding/session'

export async function POST() {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  if (!userId) {
    return NextResponse.json({ error: 'missing user' }, { status: 400 })
  }

  const sessionId = await createSession(userId)
  return NextResponse.json({ sessionId })
}
