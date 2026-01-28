import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import styles from '@/app/page.module.css'
import { supabaseServer } from '@/lib/supabase/server'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

export default async function DebugPage() {
  if (process.env.DEBUG_ENABLED !== 'true') {
    notFound()
  }

  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const supabase = supabaseServer()

  const session = userId
    ? await supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
    : null

  const answers = userId
    ? await supabase
        .from('onboarding_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    : null

  const images = userId
    ? await supabase.from('image_preferences').select('*').eq('user_id', userId)
    : null

  const subscription = userId
    ? await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
    : null

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Debug</h1>
          <p>Local inspection for onboarding data.</p>
        </div>
        <pre>{JSON.stringify({ session, answers, images, subscription }, null, 2)}</pre>
        <div className={styles.ctas}>
          <a className={styles.primary} href="/">
            Back to landing
          </a>
        </div>
      </main>
    </div>
  )
}
