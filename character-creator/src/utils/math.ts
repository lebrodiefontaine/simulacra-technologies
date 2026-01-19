export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

export const roundTo = (value: number, step: number) =>
  Math.round(value / step) * step

export const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min)

export const weightedPick = <T extends string>(
  weights: Record<T, number>,
): T => {
  const entries = Object.entries(weights) as [T, number][]
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  const roll = Math.random() * total
  let cursor = 0
  for (const [key, weight] of entries) {
    cursor += weight
    if (roll <= cursor) {
      return key
    }
  }
  return entries[0][0]
}
