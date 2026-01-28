import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import styles from '@/app/page.module.css'
import ImagePreferenceGrid from '@/components/ImagePreferenceGrid'
import { getLatestSession } from '@/lib/onboarding/session'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

export default async function OnboardingImagesPage() {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const session = userId ? await getLatestSession(userId) : null

  if (!session) {
    redirect('/onboarding/start')
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Image preferences</h1>
          <p>Like or dislike a few placeholders to shape tone and style.</p>
        </div>
        <ImagePreferenceGrid />
        <div className={styles.ctas}>
          <a className={styles.primary} href="/onboarding/review">
            Continue to review
          </a>
        </div>
      </main>
    </div>
  )
}
