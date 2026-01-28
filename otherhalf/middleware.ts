import { NextRequest, NextResponse } from 'next/server'
import { ensureUserIdCookie } from './src/lib/session/userCookie'

export const middleware = (req: NextRequest) => {
  const res = NextResponse.next()
  ensureUserIdCookie(req, res)
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
