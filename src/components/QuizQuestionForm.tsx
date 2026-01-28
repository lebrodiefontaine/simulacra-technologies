'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from '@/app/page.module.css'
import type { Question } from '@/lib/onboarding/config'

type Props = {
  branchId: string
  question: Question
}

const QuizQuestionForm = ({ branchId, question }: Props) => {
  const router = useRouter()
  const [value, setValue] = useState<string | number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (value === null || loading) return
    setLoading(true)
    const res = await fetch('/api/onboarding/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branchId,
        questionId: question.id,
        answer: value,
      }),
    })
    const data = await res.json()
    router.push(data.nextUrl ?? '/onboarding/images')
  }

  return (
    <form onSubmit={handleSubmit}>
      {question.type === 'single' && (
        <div>
          {(question.options ?? []).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={question.id}
                value={option}
                onChange={() => setValue(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'scale' && (
        <div>
          <input
            type="range"
            min={question.min ?? 1}
            max={question.max ?? 5}
            step={1}
            value={value ?? (question.min ?? 1)}
            onChange={(event) => setValue(Number(event.target.value))}
          />
          <div>value: {value ?? question.min ?? 1}</div>
        </div>
      )}

      <div className={styles.ctas}>
        <a
          className={styles.primary}
          href="/onboarding/images"
          onClick={(event) => {
            event.preventDefault()
            handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>)
          }}
        >
          {loading ? 'Saving...' : 'Continue'}
        </a>
      </div>
    </form>
  )
}

export default QuizQuestionForm
