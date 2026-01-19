type Props = {
  performanceMode: boolean
}

const Lighting = ({ performanceMode }: Props) => (
  <>
    <ambientLight intensity={performanceMode ? 0.35 : 0.25} />
    <directionalLight
      castShadow={!performanceMode}
      position={[3, 6, 4]}
      intensity={performanceMode ? 1.1 : 1.4}
      shadow-mapSize-width={performanceMode ? 512 : 1024}
      shadow-mapSize-height={performanceMode ? 512 : 1024}
    />
    <directionalLight position={[-4, 2, 2]} intensity={0.6} />
    <pointLight position={[0, 4, -3]} intensity={performanceMode ? 0.3 : 0.6} />
  </>
)

export default Lighting
