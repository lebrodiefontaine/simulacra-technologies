import styles from './page.module.css'
import StartOnboardingButton from '@/components/StartOnboardingButton'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Otherhalf</h1>
          <p>
            Begin a short calibration to shape your pairing. Your answers stay
            private and help us set the right tone.
          </p>
        </div>
        <div className={styles.ctas}>
          <StartOnboardingButton />
          <a className={styles.secondary} href="/onboarding/quiz">
            Resume onboarding
          </a>
        </div>
      </main>
    </div>
  )
}
