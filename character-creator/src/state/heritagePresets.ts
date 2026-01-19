import type { HeritagePresetRange, Undertone } from './characterTypes'

export type HeritageGroup = {
  id: string
  label: string
  preset: HeritagePresetRange
}

const undertone = (cool: number, neutral: number, warm: number, olive: number) =>
  ({
    cool,
    neutral,
    warm,
    olive,
  }) satisfies Record<Undertone, number>

export const HERITAGE_GROUPS: HeritageGroup[] = [
  {
    id: 'north_atlantic',
    label: 'north atlantic',
    preset: {
      skinToneRange: [0.25, 0.55],
      undertoneBias: undertone(0.35, 0.35, 0.2, 0.1),
    },
  },
  {
    id: 'mediterranean',
    label: 'mediterranean',
    preset: {
      skinToneRange: [0.35, 0.7],
      undertoneBias: undertone(0.2, 0.3, 0.3, 0.2),
    },
  },
  {
    id: 'west_african',
    label: 'west african',
    preset: {
      skinToneRange: [0.55, 0.95],
      undertoneBias: undertone(0.15, 0.25, 0.35, 0.25),
    },
  },
  {
    id: 'east_african',
    label: 'east african',
    preset: {
      skinToneRange: [0.5, 0.9],
      undertoneBias: undertone(0.2, 0.25, 0.3, 0.25),
    },
  },
  {
    id: 'south_asian',
    label: 'south asian',
    preset: {
      skinToneRange: [0.35, 0.8],
      undertoneBias: undertone(0.2, 0.3, 0.35, 0.15),
    },
  },
  {
    id: 'east_asian',
    label: 'east asian',
    preset: {
      skinToneRange: [0.25, 0.6],
      undertoneBias: undertone(0.25, 0.4, 0.25, 0.1),
    },
  },
  {
    id: 'pacific',
    label: 'pacific',
    preset: {
      skinToneRange: [0.4, 0.85],
      undertoneBias: undertone(0.2, 0.25, 0.3, 0.25),
    },
  },
  {
    id: 'americas',
    label: 'americas',
    preset: {
      skinToneRange: [0.3, 0.8],
      undertoneBias: undertone(0.25, 0.3, 0.3, 0.15),
    },
  },
]

export const DEFAULT_HERITAGE_MIX = [
  { groupId: 'north_atlantic', weight: 0.6 },
  { groupId: 'mediterranean', weight: 0.4 },
]

export const DEFAULT_PRESET_RANGE: HeritagePresetRange = {
  skinToneRange: [0.3, 0.65],
  undertoneBias: undertone(0.25, 0.35, 0.25, 0.15),
}

export const getHeritageGroup = (groupId: string) =>
  HERITAGE_GROUPS.find((group) => group.id === groupId)
