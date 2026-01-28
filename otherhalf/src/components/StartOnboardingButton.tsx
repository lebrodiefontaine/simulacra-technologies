'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '@/app/page.module.css'

const StartOnboardingButton = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStart = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    await fetch('/api/onboarding/start', { method: 'POST' })
    router.push('/onboarding/quiz')
  }

  return (
    <a className={styles.primary} href="/onboarding/quiz" onClick={handleStart}>
      {loading ? 'Preparing...' : 'Begin onboarding'}
    </a>
  )
}

export default StartOnboardingButton
