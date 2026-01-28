import styles from '@/app/page.module.css'

export default function CancelPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Checkout cancelled</h1>
          <p>You can resume whenever you're ready.</p>
        </div>
        <div className={styles.ctas}>
          <a className={styles.primary} href="/paywall">
            Back to paywall
          </a>
          <a className={styles.secondary} href="/">
            Return to landing
          </a>
        </div>
      </main>
    </div>
  )
}
