import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'otherhalf_uid'

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

export const getUserIdFromCookies = (
  cookies: CookieReader,
): string | null => {
  const value = cookies.get(COOKIE_NAME)?.value
  return value ?? null
}

const generateUserId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `uid_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

export const ensureUserIdCookie = (
  req: NextRequest,
  res: NextResponse,
): string => {
  const existing = req.cookies.get(COOKIE_NAME)?.value
  if (existing) {
    return existing
  }
  const userId = generateUserId()
  res.cookies.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  return userId
}

export const setUserIdCookie = (res: NextResponse, userId: string) => {
  res.cookies.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
}
