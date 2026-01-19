import * as THREE from 'three'
import type { BodyState, CharacterState, ModelCapabilities } from '../state/characterTypes'
import {
  EXPECTED_BODY_MORPH_TARGETS,
  EXPECTED_FACE_MORPH_TARGETS,
} from './morphTargets'
import { clamp } from '../utils/math'

type Rig = {
  root: THREE.Group
  meshes: THREE.Mesh[]
  skinnedMeshes: THREE.SkinnedMesh[]
}

const findMorphIndex = (
  mesh: THREE.Mesh,
  names: string[],
): number | null => {
  const dictionary = mesh.morphTargetDictionary
  if (!dictionary) {
    return null
  }
  for (const name of names) {
    if (dictionary[name] !== undefined) {
      return dictionary[name]
    }
  }
  return null
}

const applyMorphs = (mesh: THREE.Mesh, state: CharacterState) => {
  if (!mesh.morphTargetInfluences || !mesh.morphTargetDictionary) {
    return
  }
  const apply = (names: string[], value: number) => {
    const index = findMorphIndex(mesh, names)
    if (index === null) {
      return
    }
    mesh.morphTargetInfluences![index] = clamp(value, 0, 1)
  }

  apply(EXPECTED_BODY_MORPH_TARGETS.height, state.body.height)
  apply(EXPECTED_BODY_MORPH_TARGETS.weight, state.body.weight)
  apply(EXPECTED_BODY_MORPH_TARGETS.muscularity, state.body.muscularity)
  apply(EXPECTED_BODY_MORPH_TARGETS.shoulderWidth, state.body.shoulderWidth)
  apply(EXPECTED_BODY_MORPH_TARGETS.waist, state.body.waist)
  apply(EXPECTED_BODY_MORPH_TARGETS.hip, state.body.hip)
  apply(EXPECTED_BODY_MORPH_TARGETS.legLength, state.body.legLength)
  apply(EXPECTED_BODY_MORPH_TARGETS.armLength, state.body.armLength)

  apply(EXPECTED_FACE_MORPH_TARGETS.jawWidth, state.face.jawWidth)
  apply(EXPECTED_FACE_MORPH_TARGETS.chin, state.face.chin)
  apply(EXPECTED_FACE_MORPH_TARGETS.cheekbone, state.face.cheekbone)
  apply(EXPECTED_FACE_MORPH_TARGETS.noseBridge, state.face.noseBridge)
  apply(EXPECTED_FACE_MORPH_TARGETS.noseWidth, state.face.noseWidth)
  apply(EXPECTED_FACE_MORPH_TARGETS.eyeSize, state.face.eyeSize)
  apply(EXPECTED_FACE_MORPH_TARGETS.eyeSpacing, state.face.eyeSpacing)
  apply(EXPECTED_FACE_MORPH_TARGETS.brow, state.face.brow)
  apply(EXPECTED_FACE_MORPH_TARGETS.lipFullness, state.face.lipFullness)
}

const applyBodyScale = (root: THREE.Group, body: BodyState) => {
  const height = 0.9 + body.height * 0.35
  const width = 0.85 + body.weight * 0.4
  const depth = 0.85 + body.weight * 0.35
  root.scale.set(width, height, depth)
}

const applyBoneScaling = (skinnedMeshes: THREE.SkinnedMesh[], body: BodyState) => {
  skinnedMeshes.forEach((mesh) => {
    const skeleton = mesh.skeleton
    if (!skeleton) return
    const boneMap = skeleton.bones.reduce<Record<string, THREE.Bone>>(
      (acc, bone) => {
        acc[bone.name] = bone
        return acc
      },
      {},
    )
    const shoulderScale = 0.9 + body.shoulderWidth * 0.3
    const hipScale = 0.9 + body.hip * 0.3
    const armScale = 0.85 + body.armLength * 0.3
    const legScale = 0.85 + body.legLength * 0.3

    const shoulders = ['LeftShoulder', 'RightShoulder']
    shoulders.forEach((name) => {
      if (boneMap[name]) {
        boneMap[name].scale.x = shoulderScale
      }
    })

    const hips = ['Hips', 'Pelvis']
    hips.forEach((name) => {
      if (boneMap[name]) {
        boneMap[name].scale.x = hipScale
      }
    })

    const arms = ['LeftUpperArm', 'RightUpperArm']
    arms.forEach((name) => {
      if (boneMap[name]) {
        boneMap[name].scale.y = armScale
      }
    })

    const legs = ['LeftUpperLeg', 'RightUpperLeg']
    legs.forEach((name) => {
      if (boneMap[name]) {
        boneMap[name].scale.y = legScale
      }
    })
  })
}

export const buildRig = (root: THREE.Group): Rig => {
  const meshes: THREE.Mesh[] = []
  const skinnedMeshes: THREE.SkinnedMesh[] = []
  root.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
      skinnedMeshes.push(child as THREE.SkinnedMesh)
      meshes.push(child as THREE.Mesh)
    } else if ((child as THREE.Mesh).isMesh) {
      meshes.push(child as THREE.Mesh)
    }
  })
  return { root, meshes, skinnedMeshes }
}

export const detectCapabilities = (rig: Rig): ModelCapabilities => {
  const hasMorphTargets = rig.meshes.some(
    (mesh) => mesh.morphTargetDictionary && mesh.morphTargetInfluences,
  )
  const hasFaceMorphTargets = rig.meshes.some((mesh) => {
    const dict = mesh.morphTargetDictionary
    if (!dict) return false
    return Object.keys(dict).some((key) =>
      EXPECTED_FACE_MORPH_TARGETS.jawWidth.includes(key),
    )
  })
  const hasBodyBones = rig.skinnedMeshes.some((mesh) => mesh.skeleton?.bones.length)
  return { hasMorphTargets, hasFaceMorphTargets, hasBodyBones: Boolean(hasBodyBones) }
}

export const applyCharacterToModel = (rig: Rig, state: CharacterState) => {
  applyBodyScale(rig.root, state.body)
  rig.meshes.forEach((mesh) => applyMorphs(mesh, state))
  if (rig.skinnedMeshes.length > 0) {
    applyBoneScaling(rig.skinnedMeshes, state.body)
  }
}
