import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseServer } from '@/lib/supabase/server'
import { getUserIdFromCookies } from '@/lib/session/userCookie'
import { answerSchema } from '@/lib/onboarding/validators'
import {
  getNextQuestionId,
  getQuestion,
} from '@/lib/onboarding/config'
import { getLatestSession, updateAnswersSnapshot } from '@/lib/onboarding/session'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = answerSchema.safeParse(body)
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

  const { branchId, questionId, answer } = parsed.data
  const question = getQuestion(branchId, questionId)
  if (!question) {
    return NextResponse.json({ error: 'unknown question' }, { status: 400 })
  }

  const supabase = supabaseServer()
  const answerId = crypto.randomUUID()
  const { error } = await supabase.from('onboarding_answers').insert({
    id: answerId,
    user_id: userId,
    session_id: session.id,
    question_id: questionId,
    answer_json: answer,
  })

  if (error) {
    return NextResponse.json({ error: 'failed to store answer' }, { status: 500 })
  }

  const answersSnapshot = {
    ...(session.answers_json ?? {}),
    [questionId]: answer,
  }

  await updateAnswersSnapshot(session.id, answersSnapshot)

  const next = getNextQuestionId(branchId, questionId, answer)
  const nextUrl =
    next.questionId === null
      ? '/onboarding/images'
      : next.branchId === 'default'
        ? `/onboarding/quiz?q=${next.questionId}`
        : `/onboarding/quiz/${next.branchId}?q=${next.questionId}`

  return NextResponse.json({ nextUrl })
}
