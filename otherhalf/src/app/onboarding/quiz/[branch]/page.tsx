import { cookies } from 'next/headers'
import styles from '@/app/page.module.css'
import QuizQuestionForm from '@/components/QuizQuestionForm'
import {
  getBranch,
  getFirstUnansweredQuestionId,
  getQuestion,
} from '@/lib/onboarding/config'
import { getLatestSession } from '@/lib/onboarding/session'
import { getUserIdFromCookies } from '@/lib/session/userCookie'

type Props = {
  params: { branch: string }
  searchParams?: { q?: string }
}

export default async function OnboardingBranchPage({
  params,
  searchParams,
}: Props) {
  const branchId = params.branch
  const cookieStore = await cookies()
  const userId = getUserIdFromCookies(cookieStore)
  const session = userId ? await getLatestSession(userId) : null
  const answers = session?.answers_json ?? null

  const questionId =
    searchParams?.q ?? getFirstUnansweredQuestionId(branchId, answers)
  const question = questionId ? getQuestion(branchId, questionId) : null

  if (!getBranch(branchId).length) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.intro}>
            <h1>Quiz</h1>
            <p>Unknown branch. Returning to the main flow.</p>
          </div>
          <div className={styles.ctas}>
            <a className={styles.primary} href="/onboarding/quiz">
              Back to quiz
            </a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Quiz</h1>
          <p>Branch calibration.</p>
        </div>
        {question ? (
          <QuizQuestionForm branchId={branchId} question={question} />
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
