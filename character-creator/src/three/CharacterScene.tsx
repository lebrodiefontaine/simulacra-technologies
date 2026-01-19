import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import type { CharacterState, ModelCapabilities } from '../state/characterTypes'
import CharacterModel from './CharacterModel'
import Lighting from './Lighting'

type Props = {
  state: CharacterState
  onCapabilities: (capabilities: ModelCapabilities) => void
}

const CharacterScene = ({ state, onCapabilities }: Props) => {
  const performanceMode = state.meta.performanceMode
  return (
    <Canvas
      shadows
      dpr={performanceMode ? 1 : [1, 1.75]}
      camera={{ position: [0, 1.4, 3.2], fov: 32 }}
    >
      <color attach="background" args={['#0b0d16']} />
      <fog attach="fog" args={['#0b0d16', 5, 10]} />
      <Lighting performanceMode={performanceMode} />
      <Suspense fallback={null}>
        <CharacterModel state={state} onCapabilities={onCapabilities} />
        {!performanceMode && <Environment preset="city" />}
      </Suspense>
      {!performanceMode && (
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.45}
          scale={6}
          blur={2.5}
          far={3}
        />
      )}
      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={4.2}
        minPolarAngle={0.9}
        maxPolarAngle={1.5}
      />
    </Canvas>
  )
}

export default CharacterScene
