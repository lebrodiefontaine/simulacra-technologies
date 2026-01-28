import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import styles from '@/app/page.module.css'
import PaywallButton from '@/components/PaywallButton'
import { getLatestSession } from '@/lib/onboarding/session'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

export default async function PaywallPage() {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const session = userId ? await getLatestSession(userId) : null

  if (!session || session.status !== 'completed') {
    redirect('/onboarding/start')
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Unlock Otherhalf</h1>
          <p>Continue to activate your subscription.</p>
        </div>
        <div className={styles.ctas}>
          <PaywallButton />
          <a className={styles.secondary} href="/onboarding/review">
            Back to review
          </a>
        </div>
      </main>
    </div>
  )
}
