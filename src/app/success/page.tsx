import { cookies } from 'next/headers'
import styles from '@/app/page.module.css'
import { supabaseServer } from '@/lib/supabase/server'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

export default async function SuccessPage() {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const supabase = supabaseServer()
  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId ?? '')
    .maybeSingle()

  const isActive = data?.status === 'active'

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>{isActive ? "You're in" : 'Almost there'}</h1>
          <p>
            {isActive
              ? 'Payment confirmed. Next steps will appear here soon.'
              : 'Payment pending. Refresh in a moment.'}
          </p>
        </div>
        <div className={styles.ctas}>
          <a className={styles.primary} href="/">
            Return to landing
          </a>
        </div>
      </main>
    </div>
  )
}
