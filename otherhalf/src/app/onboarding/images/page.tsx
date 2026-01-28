import styles from '@/app/page.module.css'
import ImagePreferenceGrid from '@/components/ImagePreferenceGrid'

export default function OnboardingImagesPage() {
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
