export const EXPECTED_BODY_MORPH_TARGETS = {
  height: ['body_height', 'height', 'Height'],
  weight: ['body_weight', 'weight', 'Weight'],
  muscularity: ['body_muscle', 'muscularity', 'Muscularity'],
  shoulderWidth: ['shoulder_width', 'ShoulderWidth'],
  waist: ['waist_width', 'WaistWidth'],
  hip: ['hip_width', 'HipWidth'],
  legLength: ['leg_length', 'LegLength'],
  armLength: ['arm_length', 'ArmLength'],
}

export const EXPECTED_FACE_MORPH_TARGETS = {
  jawWidth: ['jaw_width', 'JawWidth'],
  chin: ['chin_depth', 'Chin'],
  cheekbone: ['cheekbone_height', 'Cheekbone'],
  noseBridge: ['nose_bridge', 'NoseBridge'],
  noseWidth: ['nose_width', 'NoseWidth'],
  eyeSize: ['eye_size', 'EyeSize'],
  eyeSpacing: ['eye_spacing', 'EyeSpacing'],
  brow: ['brow_height', 'Brow'],
  lipFullness: ['lip_fullness', 'LipFullness'],
}

export const MORPH_TARGET_TODO = [
  'TODO: update morph target names to match your production rig.',
  'TODO: decide whether sliders map to 0..1 or -1..1 influences.',
  'TODO: split left/right targets if your rig separates them.',
]
