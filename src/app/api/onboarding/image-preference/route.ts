import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseServer } from '@/lib/supabase/server'
import { getUserIdFromCookies } from '@/lib/session/userCookie'
import { imagePreferenceSchema } from '@/lib/onboarding/validators'
import { getLatestSession } from '@/lib/onboarding/session'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = imagePreferenceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  if (!userId) {
    return NextResponse.json({ error: 'missing user' }, { status: 400 })
  }

  const session = await getLatestSession(userId)
  if (!session) {
    return NextResponse.json({ error: 'missing session' }, { status: 400 })
  }

  const supabase = supabaseServer()
  const { error } = await supabase.from('image_preferences').insert({
    id: crypto.randomUUID(),
    user_id: userId,
    session_id: session.id,
    image_id: parsed.data.imageId,
    liked: parsed.data.liked,
  })

  if (error) {
    return NextResponse.json({ error: 'failed to store preference' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
