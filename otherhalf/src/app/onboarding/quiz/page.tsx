import { cookies } from 'next/headers'
import styles from '@/app/page.module.css'
import QuizQuestionForm from '@/components/QuizQuestionForm'
import {
  getFirstUnansweredQuestionId,
  getQuestion,
} from '@/lib/onboarding/config'
import { getOrCreateSession } from '@/lib/onboarding/session'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

type Props = {
  searchParams?: { q?: string }
}

export default async function OnboardingQuizPage({ searchParams }: Props) {
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const session = userId ? await getOrCreateSession(userId) : null
  const answers = session?.answers_json ?? null

  const questionId =
    searchParams?.q ?? getFirstUnansweredQuestionId('default', answers)
  const question = questionId ? getQuestion('default', questionId) : null

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Quiz</h1>
          <p>Answer a few prompts to tune the experience.</p>
        </div>
        {question ? (
          <QuizQuestionForm branchId="default" question={question} />
        ) : (
          <div className={styles.ctas}>
            <a className={styles.primary} href="/onboarding/images">
              Continue to images
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
