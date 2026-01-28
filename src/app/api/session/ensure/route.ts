import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserIdFromCookies, setUserIdCookie } from '@/lib/session/userCookie'

export async function POST() {
  const cookieStore = await cookies()
  const existing = getUserIdFromCookies(cookieStore)
  const res = NextResponse.json({ ok: true })
  if (!existing) {
    const userId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `uid_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
    setUserIdCookie(res, userId)
  }
  return res
}
