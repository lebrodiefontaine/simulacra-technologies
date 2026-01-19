import type {
  BackgroundState,
  BodyState,
  CharacterState,
  ClothingState,
  FaceState,
  FinishState,
  HairState,
} from './characterTypes'
import { randomBetween, weightedPick } from '../utils/math'
import { SLIDER_RANGES } from './characterDefaults'
import { deriveHeritagePreset } from './heritageUtils'

const randomizeRange = (min: number, max: number, step: number) => {
  const value = randomBetween(min, max)
  return Math.round(value / step) * step
}

export const randomizeBackground = (
  background: BackgroundState,
): BackgroundState => {
  const preset = deriveHeritagePreset(background.ancestryMix)
  const [minTone, maxTone] = preset.skinToneRange
  return {
    ...background,
    presetRanges: preset,
    skinTone: randomBetween(minTone, maxTone),
    undertone: weightedPick(preset.undertoneBias),
  }
}

export const randomizeBody = (body: BodyState): BodyState => ({
  height: randomizeRange(
    SLIDER_RANGES.body.height.min,
    SLIDER_RANGES.body.height.max,
    SLIDER_RANGES.body.height.step,
  ),
  weight: randomizeRange(
    SLIDER_RANGES.body.weight.min,
    SLIDER_RANGES.body.weight.max,
    SLIDER_RANGES.body.weight.step,
  ),
  muscularity: randomizeRange(
    SLIDER_RANGES.body.muscularity.min,
    SLIDER_RANGES.body.muscularity.max,
    SLIDER_RANGES.body.muscularity.step,
  ),
  shoulderWidth: randomizeRange(
    SLIDER_RANGES.body.shoulderWidth.min,
    SLIDER_RANGES.body.shoulderWidth.max,
    SLIDER_RANGES.body.shoulderWidth.step,
  ),
  waist: randomizeRange(
    SLIDER_RANGES.body.waist.min,
    SLIDER_RANGES.body.waist.max,
    SLIDER_RANGES.body.waist.step,
  ),
  hip: randomizeRange(
    SLIDER_RANGES.body.hip.min,
    SLIDER_RANGES.body.hip.max,
    SLIDER_RANGES.body.hip.step,
  ),
  legLength: randomizeRange(
    SLIDER_RANGES.body.legLength.min,
    SLIDER_RANGES.body.legLength.max,
    SLIDER_RANGES.body.legLength.step,
  ),
  armLength: randomizeRange(
    SLIDER_RANGES.body.armLength.min,
    SLIDER_RANGES.body.armLength.max,
    SLIDER_RANGES.body.armLength.step,
  ),
})

export const randomizeFace = (face: FaceState): FaceState => ({
  jawWidth: randomizeRange(
    SLIDER_RANGES.face.jawWidth.min,
    SLIDER_RANGES.face.jawWidth.max,
    SLIDER_RANGES.face.jawWidth.step,
  ),
  chin: randomizeRange(
    SLIDER_RANGES.face.chin.min,
    SLIDER_RANGES.face.chin.max,
    SLIDER_RANGES.face.chin.step,
  ),
  cheekbone: randomizeRange(
    SLIDER_RANGES.face.cheekbone.min,
    SLIDER_RANGES.face.cheekbone.max,
    SLIDER_RANGES.face.cheekbone.step,
  ),
  noseBridge: randomizeRange(
    SLIDER_RANGES.face.noseBridge.min,
    SLIDER_RANGES.face.noseBridge.max,
    SLIDER_RANGES.face.noseBridge.step,
  ),
  noseWidth: randomizeRange(
    SLIDER_RANGES.face.noseWidth.min,
    SLIDER_RANGES.face.noseWidth.max,
    SLIDER_RANGES.face.noseWidth.step,
  ),
  eyeSize: randomizeRange(
    SLIDER_RANGES.face.eyeSize.min,
    SLIDER_RANGES.face.eyeSize.max,
    SLIDER_RANGES.face.eyeSize.step,
  ),
  eyeSpacing: randomizeRange(
    SLIDER_RANGES.face.eyeSpacing.min,
    SLIDER_RANGES.face.eyeSpacing.max,
    SLIDER_RANGES.face.eyeSpacing.step,
  ),
  brow: randomizeRange(
    SLIDER_RANGES.face.brow.min,
    SLIDER_RANGES.face.brow.max,
    SLIDER_RANGES.face.brow.step,
  ),
  lipFullness: randomizeRange(
    SLIDER_RANGES.face.lipFullness.min,
    SLIDER_RANGES.face.lipFullness.max,
    SLIDER_RANGES.face.lipFullness.step,
  ),
})

export const randomizeHair = (hair: HairState): HairState => ({
  ...hair,
  color: `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`,
})

export const randomizeClothing = (clothing: ClothingState): ClothingState => ({
  ...clothing,
  color: `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`,
})

export const randomizeFinish = (finish: FinishState): FinishState => ({
  detailLevel: randomizeRange(
    SLIDER_RANGES.finish.detailLevel.min,
    SLIDER_RANGES.finish.detailLevel.max,
    SLIDER_RANGES.finish.detailLevel.step,
  ),
  glow: randomizeRange(
    SLIDER_RANGES.finish.glow.min,
    SLIDER_RANGES.finish.glow.max,
    SLIDER_RANGES.finish.glow.step,
  ),
})

export const randomizeAll = (state: CharacterState): CharacterState => ({
  ...state,
  background: randomizeBackground(state.background),
  body: randomizeBody(state.body),
  face: randomizeFace(state.face),
  hair: randomizeHair(state.hair),
  clothing: randomizeClothing(state.clothing),
  finish: randomizeFinish(state.finish),
})
