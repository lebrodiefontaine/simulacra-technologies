import { z } from 'zod'

export const startSchema = z.object({})

export const answerSchema = z.object({
  branchId: z.string(),
  questionId: z.string(),
  answer: z.union([z.string(), z.number()]),
})

export const imagePreferenceSchema = z.object({
  imageId: z.string(),
  liked: z.boolean(),
})
