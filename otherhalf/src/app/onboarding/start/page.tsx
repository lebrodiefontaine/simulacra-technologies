import styles from '@/app/page.module.css'
import StartOnboardingButton from '@/components/StartOnboardingButton'

export default function OnboardingStartPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Onboarding</h1>
          <p>
            A short sequence to tune tone, cadence, and presence. You can adjust
            everything later.
          </p>
        </div>
        <div className={styles.ctas}>
          <StartOnboardingButton />
          <a className={styles.secondary} href="/">
            Back to landing
          </a>
        </div>
      </main>
    </div>
  )
}
