'use client'

import { useState } from 'react'
import styles from '@/app/page.module.css'

const PaywallButton = () => {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <a className={styles.primary} href="/paywall" onClick={handleCheckout}>
      {loading ? 'Redirecting...' : 'Continue'}
    </a>
  )
}

export default PaywallButton
