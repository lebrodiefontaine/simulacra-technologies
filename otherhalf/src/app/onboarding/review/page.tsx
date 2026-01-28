import { cookies } from 'next/headers'
import styles from '@/app/page.module.css'
import CompleteOnboardingButton from '@/components/CompleteOnboardingButton'
import { getLatestSession } from '@/lib/onboarding/session'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

export default async function OnboardingReviewPage() {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const session = userId ? await getLatestSession(userId) : null
  const answers = session?.answers_json ?? {}

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Review</h1>
          <p>Confirm your onboarding snapshot before continuing.</p>
        </div>
        <div>
          <pre>{JSON.stringify(answers, null, 2)}</pre>
        </div>
        <div className={styles.ctas}>
          <CompleteOnboardingButton />
          <a className={styles.secondary} href="/onboarding/quiz">
            Edit answers
          </a>
        </div>
      </main>
    </div>
  )
}
