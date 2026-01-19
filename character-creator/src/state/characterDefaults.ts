import type {
  BackgroundState,
  BodyState,
  CharacterState,
  ClothingState,
  FaceState,
  FinishState,
  HairState,
} from './characterTypes'
import {
  DEFAULT_HERITAGE_MIX,
  DEFAULT_PRESET_RANGE,
} from './heritagePresets'
import { randomBetween, weightedPick } from '../utils/math'

export const SLIDER_RANGES = {
  background: {
    skinTone: { min: 0, max: 1, step: 0.01 },
  },
  body: {
    height: { min: 0, max: 1, step: 0.01 },
    weight: { min: 0, max: 1, step: 0.01 },
    muscularity: { min: 0, max: 1, step: 0.01 },
    shoulderWidth: { min: 0, max: 1, step: 0.01 },
    waist: { min: 0, max: 1, step: 0.01 },
    hip: { min: 0, max: 1, step: 0.01 },
    legLength: { min: 0, max: 1, step: 0.01 },
    armLength: { min: 0, max: 1, step: 0.01 },
  },
  face: {
    jawWidth: { min: 0, max: 1, step: 0.01 },
    chin: { min: 0, max: 1, step: 0.01 },
    cheekbone: { min: 0, max: 1, step: 0.01 },
    noseBridge: { min: 0, max: 1, step: 0.01 },
    noseWidth: { min: 0, max: 1, step: 0.01 },
    eyeSize: { min: 0, max: 1, step: 0.01 },
    eyeSpacing: { min: 0, max: 1, step: 0.01 },
    brow: { min: 0, max: 1, step: 0.01 },
    lipFullness: { min: 0, max: 1, step: 0.01 },
  },
  finish: {
    detailLevel: { min: 0, max: 1, step: 0.01 },
    glow: { min: 0, max: 1, step: 0.01 },
  },
}

export const defaultBackgroundState = (): BackgroundState => {
  const undertone = weightedPick(DEFAULT_PRESET_RANGE.undertoneBias)
  const [minTone, maxTone] = DEFAULT_PRESET_RANGE.skinToneRange
  return {
    ancestryMix: DEFAULT_HERITAGE_MIX,
    skinTone: randomBetween(minTone, maxTone),
    undertone,
    presetRanges: DEFAULT_PRESET_RANGE,
  }
}

export const defaultBodyState = (): BodyState => ({
  height: 0.5,
  weight: 0.5,
  muscularity: 0.5,
  shoulderWidth: 0.5,
  waist: 0.5,
  hip: 0.5,
  legLength: 0.5,
  armLength: 0.5,
})

export const defaultFaceState = (): FaceState => ({
  jawWidth: 0.5,
  chin: 0.5,
  cheekbone: 0.5,
  noseBridge: 0.5,
  noseWidth: 0.5,
  eyeSize: 0.5,
  eyeSpacing: 0.5,
  brow: 0.5,
  lipFullness: 0.5,
})

export const defaultHairState = (): HairState => ({
  styleId: 'short-linear',
  color: '#1b1b1f',
})

export const defaultClothingState = (): ClothingState => ({
  outfitId: 'core-suit',
  color: '#232833',
})

export const defaultFinishState = (): FinishState => ({
  detailLevel: 0.5,
  glow: 0.25,
})

export const createDefaultState = (): CharacterState => ({
  background: defaultBackgroundState(),
  body: defaultBodyState(),
  face: defaultFaceState(),
  hair: defaultHairState(),
  clothing: defaultClothingState(),
  finish: defaultFinishState(),
  meta: {
    performanceMode: false,
    turntable: true,
  },
})
