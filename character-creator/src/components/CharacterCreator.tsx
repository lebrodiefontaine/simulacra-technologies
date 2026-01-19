import { useMemo, useState } from 'react'
import CategoryNav from './CategoryNav'
import ControlsPanel from './ControlsPanel'
import CharacterScene from '../three/CharacterScene'
import { useCharacter } from '../state/characterStore'
import type { CategoryKey, CharacterState, ModelCapabilities } from '../state/characterTypes'

type Props = {
  onConfirm?: (state: CharacterState) => void
}

const CharacterCreator = ({ onConfirm }: Props) => {
  const {
    state,
    updateBackground,
    updateBody,
    updateFace,
    updateHair,
    updateClothing,
    updateFinish,
    updateMeta,
    resetCategory,
    resetAll,
    randomizeCategory,
    randomizeAll,
    applyHeritagePreset,
    setState,
  } = useCharacter()
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>('background')
  const [jsonBuffer, setJsonBuffer] = useState('')
  const [capabilities, setCapabilities] = useState<ModelCapabilities>({
    hasMorphTargets: false,
    hasFaceMorphTargets: false,
    hasBodyBones: false,
  })

  const handleExportJson = () => {
    const payload = JSON.stringify(state, null, 2)
    setJsonBuffer(payload)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payload).catch(() => undefined)
    }
  }

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonBuffer)
      setState(parsed)
    } catch (error) {
      console.error('invalid json', error)
    }
  }

  const viewTitle = useMemo(
    () => `${activeCategory} controls`,
    [activeCategory],
  )

  return (
    <div className="app-shell">
      <aside className="panel">
        <div className="logo">simulacra technologies 乙</div>
        <div className="panel-title">category</div>
        <CategoryNav active={activeCategory} onChange={setActiveCategory} />
      </aside>

      <main className="viewport">
        <div className="viewport-header">
          <span>character creation</span>
          <div className="viewport-actions">
            <button
              type="button"
              onClick={() =>
                updateMeta({ performanceMode: !state.meta.performanceMode })
              }
            >
              performance mode:{' '}
              {state.meta.performanceMode ? 'on' : 'off'}
            </button>
            <button
              type="button"
              onClick={() => updateMeta({ turntable: !state.meta.turntable })}
            >
              turntable: {state.meta.turntable ? 'on' : 'off'}
            </button>
          </div>
          <span>{viewTitle}</span>
        </div>
        <div className="canvas-wrap">
          <CharacterScene
            state={state}
            onCapabilities={(next) => setCapabilities(next)}
          />
        </div>
      </main>

      <aside className="panel panel-right">
        <div className="panel-title">modulation</div>
        <ControlsPanel
          category={activeCategory}
          state={state}
          capabilities={capabilities}
          onUpdateBackground={updateBackground}
          onUpdateBody={updateBody}
          onUpdateFace={updateFace}
          onUpdateHair={updateHair}
          onUpdateClothing={updateClothing}
          onUpdateFinish={updateFinish}
          onResetCategory={() => resetCategory(activeCategory)}
          onResetAll={resetAll}
          onRandomizeCategory={() => randomizeCategory(activeCategory)}
          onRandomizeAll={randomizeAll}
          onApplyHeritagePreset={applyHeritagePreset}
          onConfirm={() => onConfirm?.(state)}
          jsonBuffer={jsonBuffer}
          onJsonBufferChange={setJsonBuffer}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
        />
      </aside>
    </div>
  )
}

export default CharacterCreator
