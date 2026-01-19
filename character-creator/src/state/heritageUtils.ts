import type { AncestryComponent, HeritagePresetRange } from './characterTypes'
import {
  DEFAULT_PRESET_RANGE,
  getHeritageGroup,
} from './heritagePresets'
import { clamp } from '../utils/math'

const normalizeMix = (mix: AncestryComponent[]) => {
  const total = mix.reduce((sum, entry) => sum + entry.weight, 0)
  if (total <= 0) {
    return mix
  }
  return mix.map((entry) => ({ ...entry, weight: entry.weight / total }))
}

export const deriveHeritagePreset = (
  mix: AncestryComponent[],
): HeritagePresetRange => {
  const normalized = normalizeMix(mix)
  if (normalized.length === 0) {
    return DEFAULT_PRESET_RANGE
  }

  let minTone = 0
  let maxTone = 0
  const undertoneBias = {
    cool: 0,
    neutral: 0,
    warm: 0,
    olive: 0,
  }

  normalized.forEach((entry) => {
    const group = getHeritageGroup(entry.groupId)
    const preset = group?.preset ?? DEFAULT_PRESET_RANGE
    minTone += preset.skinToneRange[0] * entry.weight
    maxTone += preset.skinToneRange[1] * entry.weight
    undertoneBias.cool += preset.undertoneBias.cool * entry.weight
    undertoneBias.neutral += preset.undertoneBias.neutral * entry.weight
    undertoneBias.warm += preset.undertoneBias.warm * entry.weight
    undertoneBias.olive += preset.undertoneBias.olive * entry.weight
  })

  return {
    skinToneRange: [clamp(minTone, 0, 1), clamp(maxTone, 0, 1)],
    undertoneBias,
  }
}

export const updateAncestryWeight = (
  mix: AncestryComponent[],
  groupId: string,
  weight: number,
) =>
  normalizeMix(
    mix.map((entry) =>
      entry.groupId === groupId ? { ...entry, weight } : entry,
    ),
  )
