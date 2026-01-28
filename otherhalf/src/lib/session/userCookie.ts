import { NextRequest, NextResponse } from 'next/server'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const COOKIE_NAME = 'otherhalf_uid'

export const getUserIdFromCookies = (
  cookies: ReadonlyRequestCookies,
): string | null => {
  const value = cookies.get(COOKIE_NAME)?.value
  return value ?? null
}

export const ensureUserIdCookie = (
  req: NextRequest,
  res: NextResponse,
): string => {
  const existing = req.cookies.get(COOKIE_NAME)?.value
  if (existing) {
    return existing
  }
  const userId = crypto.randomUUID()
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
