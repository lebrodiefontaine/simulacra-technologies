export type CategoryKey =
  | 'background'
  | 'body'
  | 'face'
  | 'hair'
  | 'clothing'
  | 'finish'

export type Undertone = 'cool' | 'neutral' | 'warm' | 'olive'

export type AncestryComponent = {
  groupId: string
  weight: number
}

export type HeritagePresetRange = {
  skinToneRange: [number, number]
  undertoneBias: Record<Undertone, number>
}

export type BackgroundState = {
  ancestryMix: AncestryComponent[]
  skinTone: number
  undertone: Undertone
  presetRanges: HeritagePresetRange
}

export type BodyState = {
  height: number
  weight: number
  muscularity: number
  shoulderWidth: number
  waist: number
  hip: number
  legLength: number
  armLength: number
}

export type FaceState = {
  jawWidth: number
  chin: number
  cheekbone: number
  noseBridge: number
  noseWidth: number
  eyeSize: number
  eyeSpacing: number
  brow: number
  lipFullness: number
}

export type HairState = {
  styleId: string
  color: string
}

export type ClothingState = {
  outfitId: string
  color: string
}

export type FinishState = {
  detailLevel: number
  glow: number
}

export type CharacterMeta = {
  performanceMode: boolean
  turntable: boolean
}

export type CharacterState = {
  background: BackgroundState
  body: BodyState
  face: FaceState
  hair: HairState
  clothing: ClothingState
  finish: FinishState
  meta: CharacterMeta
}

export type ModelCapabilities = {
  hasMorphTargets: boolean
  hasFaceMorphTargets: boolean
  hasBodyBones: boolean
}
