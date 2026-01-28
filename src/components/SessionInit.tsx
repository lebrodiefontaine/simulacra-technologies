'use client'

import { useEffect } from 'react'

const SessionInit = () => {
  useEffect(() => {
    fetch('/api/session/ensure', { method: 'POST' }).catch(() => undefined)
  }, [])

  return null
}

export default SessionInit
