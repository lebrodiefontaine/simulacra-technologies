import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CharacterState, ModelCapabilities } from '../state/characterTypes'
import {
  applyCharacterToModel,
  buildRig,
  detectCapabilities,
} from './applyCharacterToModel'

type Props = {
  state: CharacterState
  onCapabilities: (capabilities: ModelCapabilities) => void
}

const USE_GLTF_MODEL = false

const undertoneHue = (undertone: CharacterState['background']['undertone']) => {
  switch (undertone) {
    case 'cool':
      return 0.6
    case 'warm':
      return 0.08
    case 'olive':
      return 0.18
    case 'neutral':
    default:
      return 0.1
  }
}

const GltfCharacter = ({ state, onCapabilities }: Props) => {
  const gltf = useGLTF('/models/character.glb')
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return
    const rig = buildRig(groupRef.current)
    onCapabilities(detectCapabilities(rig))
  }, [onCapabilities, gltf])

  useEffect(() => {
    if (!groupRef.current) return
    const rig = buildRig(groupRef.current)
    applyCharacterToModel(rig, state)
  }, [state, gltf])

  useFrame((_, delta) => {
    if (groupRef.current && state.meta.turntable) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return <primitive ref={groupRef} object={gltf.scene} />
}

const CharacterModel = ({ state, onCapabilities }: Props) => {
  if (USE_GLTF_MODEL) {
    return <GltfCharacter state={state} onCapabilities={onCapabilities} />
  }

  const groupRef = useRef<THREE.Group>(null)

  const skinColor = useMemo(() => {
    const hue = undertoneHue(state.background.undertone)
    const lightness = 0.2 + state.background.skinTone * 0.55
    const color = new THREE.Color().setHSL(hue, 0.35, lightness)
    return `#${color.getHexString()}`
  }, [state.background.skinTone, state.background.undertone])

  useEffect(() => {
    if (!groupRef.current) return
    const rig = buildRig(groupRef.current)
    const capabilities = detectCapabilities(rig)
    onCapabilities(capabilities)
  }, [onCapabilities])

  useEffect(() => {
    if (!groupRef.current) return
    const rig = buildRig(groupRef.current)
    applyCharacterToModel(rig, state)
  }, [state])

  useFrame((_, delta) => {
    if (groupRef.current && state.meta.turntable) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[0, -1.1, 0]}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.35, 1.4, 8, 16]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.38]} />
        <meshStandardMaterial color={state.clothing.color} />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={state.hair.color} />
      </mesh>
      <mesh position={[-0.55, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.7, 6, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.55, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.7, 6, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[-0.2, -1.0, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.9, 6, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[0.2, -1.0, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.9, 6, 12]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  )
}

export default CharacterModel
