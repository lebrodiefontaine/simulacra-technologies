'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '@/app/page.module.css'

const CompleteOnboardingButton = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleComplete = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    await fetch('/api/onboarding/complete', { method: 'POST' })
    router.push('/paywall')
  }

  return (
    <a className={styles.primary} href="/paywall" onClick={handleComplete}>
      {loading ? 'Saving...' : 'Continue to paywall'}
    </a>
  )
}

export default CompleteOnboardingButton
