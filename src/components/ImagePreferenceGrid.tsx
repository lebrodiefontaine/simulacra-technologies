'use client'

import { useState } from 'react'
import styles from '@/app/page.module.css'
import { IMAGE_OPTIONS } from '@/lib/onboarding/images'

const ImagePreferenceGrid = () => {
  const [savingId, setSavingId] = useState<string | null>(null)

  const handlePreference = async (imageId: string, liked: boolean) => {
    setSavingId(imageId)
    await fetch('/api/onboarding/image-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, liked }),
    })
    setSavingId(null)
  }

  return (
    <div>
      {IMAGE_OPTIONS.map((image) => (
        <div key={image.id}>
          <img src={image.src} alt={image.label} width={320} height={200} />
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="#"
              onClick={(event) => {
                event.preventDefault()
                handlePreference(image.id, true)
              }}
            >
              {savingId === image.id ? 'Saving...' : 'Like'}
            </a>
            <a
              className={styles.secondary}
              href="#"
              onClick={(event) => {
                event.preventDefault()
                handlePreference(image.id, false)
              }}
            >
              Dislike
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImagePreferenceGrid
