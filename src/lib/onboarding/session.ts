import 'server-only'
import { supabaseServer } from '../supabase/server'

export type OnboardingSession = {
  id: string
  user_id: string
  status: string
  answers_json: Record<string, unknown> | null
}

export const createSession = async (userId: string) => {
  const supabase = supabaseServer()
  const sessionId = crypto.randomUUID()

  await supabase.from('users').upsert({ id: userId })

  const { error } = await supabase.from('onboarding_sessions').insert({
    id: sessionId,
    user_id: userId,
    status: 'in_progress',
    answers_json: {},
  })

  if (error) {
    throw error
  }

  return sessionId
}

export const getLatestSession = async (userId: string) => {
  const supabase = supabaseServer()
  const { data, error } = await supabase
    .from('onboarding_sessions')
    .select('id,user_id,status,answers_json')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as OnboardingSession | null
}

export const getOrCreateSession = async (userId: string) => {
  const existing = await getLatestSession(userId)
  if (existing) {
    return existing
  }
  const sessionId = await createSession(userId)
  return {
    id: sessionId,
    user_id: userId,
    status: 'in_progress',
    answers_json: {},
  } satisfies OnboardingSession
}

export const updateAnswersSnapshot = async (
  sessionId: string,
  answersJson: Record<string, unknown>,
) => {
  const supabase = supabaseServer()
  const { error } = await supabase
    .from('onboarding_sessions')
    .update({ answers_json: answersJson })
    .eq('id', sessionId)

  if (error) {
    throw error
  }
}

export const markSessionComplete = async (sessionId: string) => {
  const supabase = supabaseServer()
  const { error } = await supabase
    .from('onboarding_sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId)

  if (error) {
    throw error
  }
}
