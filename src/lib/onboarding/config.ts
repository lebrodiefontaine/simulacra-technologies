import config from '../../../config/onboarding.json'

export type QuestionType = 'single' | 'scale'

export type Question = {
  id: string
  prompt: string
  type: QuestionType
  options?: string[]
  min?: number
  max?: number
  next?: string | NextRule | null
}

export type NextRule = {
  branches?: Record<string, string>
  default?: string | null
}

export type OnboardingConfig = {
  branches: Record<string, Question[]>
}

export const onboardingConfig = config as OnboardingConfig

export const getBranch = (branchId: string) =>
  onboardingConfig.branches[branchId] ?? onboardingConfig.branches.default

export const getQuestion = (branchId: string, questionId: string) =>
  getBranch(branchId).find((question) => question.id === questionId)

export const getNextQuestionId = (
  branchId: string,
  currentId: string,
  answer: string | number,
): { branchId: string; questionId: string | null } => {
  const branch = getBranch(branchId)
  const question = branch.find((item) => item.id === currentId)
  if (!question || question.next === null || question.next === undefined) {
    return { branchId, questionId: null }
  }

  if (typeof question.next === 'string') {
    return { branchId, questionId: question.next }
  }

  const branchTarget = question.next.branches?.[String(answer)]
  if (branchTarget) {
    const nextBranch = getBranch(branchTarget)
    const first = nextBranch[0]
    return { branchId: branchTarget, questionId: first?.id ?? null }
  }

  if (question.next.default) {
    return { branchId, questionId: question.next.default }
  }

  return { branchId, questionId: null }
}

export const getFirstQuestionId = (branchId: string) =>
  getBranch(branchId)[0]?.id ?? null

export const getFirstUnansweredQuestionId = (
  branchId: string,
  answers: Record<string, unknown> | null,
) => {
  const branch = getBranch(branchId)
  const answerKeys = answers ? Object.keys(answers) : []
  const first = branch.find((question) => !answerKeys.includes(question.id))
  return first?.id ?? null
}
