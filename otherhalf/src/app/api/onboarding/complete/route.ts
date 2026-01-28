import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserIdFromCookies } from '@/lib/session/userCookie'
import { getLatestSession, markSessionComplete } from '@/lib/onboarding/session'

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

  await markSessionComplete(session.id)
  return NextResponse.json({ ok: true })
}
