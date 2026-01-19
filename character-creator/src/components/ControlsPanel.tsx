import type {
  CategoryKey,
  CharacterState,
  ModelCapabilities,
} from '../state/characterTypes'
import { SLIDER_RANGES } from '../state/characterDefaults'
import SliderField from './SliderField'
import HeritageBlend from './HeritageBlend'

type Props = {
  category: CategoryKey
  state: CharacterState
  capabilities: ModelCapabilities
  onUpdateBackground: (patch: Partial<CharacterState['background']>) => void
  onUpdateBody: (patch: Partial<CharacterState['body']>) => void
  onUpdateFace: (patch: Partial<CharacterState['face']>) => void
  onUpdateHair: (patch: Partial<CharacterState['hair']>) => void
  onUpdateClothing: (patch: Partial<CharacterState['clothing']>) => void
  onUpdateFinish: (patch: Partial<CharacterState['finish']>) => void
  onResetCategory: () => void
  onResetAll: () => void
  onRandomizeCategory: () => void
  onRandomizeAll: () => void
  onApplyHeritagePreset: () => void
  onConfirm: () => void
  jsonBuffer: string
  onJsonBufferChange: (value: string) => void
  onExportJson: () => void
  onImportJson: () => void
}

const ControlsPanel = ({
  category,
  state,
  capabilities,
  onUpdateBackground,
  onUpdateBody,
  onUpdateFace,
  onUpdateHair,
  onUpdateClothing,
  onUpdateFinish,
  onResetCategory,
  onResetAll,
  onRandomizeCategory,
  onRandomizeAll,
  onApplyHeritagePreset,
  onConfirm,
  jsonBuffer,
  onJsonBufferChange,
  onExportJson,
  onImportJson,
}: Props) => {
  const faceDisabled = !capabilities.hasFaceMorphTargets

  return (
    <div>
      <div className="actions">
        <button type="button" onClick={onResetCategory}>
          reset category
        </button>
        <button type="button" onClick={onRandomizeCategory}>
          randomize category
        </button>
        <button type="button" onClick={onResetAll}>
          reset all
        </button>
        <button type="button" onClick={onRandomizeAll}>
          randomize all
        </button>
      </div>

      <div className="controls-scroll">
        {category === 'background' && (
          <>
            <section className="section">
              <h3>heritage blend</h3>
              <HeritageBlend
                background={state.background}
                onChange={(next) => onUpdateBackground(next)}
                onApplyPreset={onApplyHeritagePreset}
              />
              <p className="hint">
                blend only guides preset ranges; no deterministic outputs.
              </p>
            </section>
            <section className="section">
              <h3>skin</h3>
              <SliderField
                label="skin tone"
                value={state.background.skinTone}
                min={SLIDER_RANGES.background.skinTone.min}
                max={SLIDER_RANGES.background.skinTone.max}
                step={SLIDER_RANGES.background.skinTone.step}
                onChange={(value) => onUpdateBackground({ skinTone: value })}
              />
              <div className="field-row">
                <select
                  value={state.background.undertone}
                  onChange={(event) =>
                    onUpdateBackground({
                      undertone: event.target.value as CharacterState['background']['undertone'],
                    })
                  }
                >
                  <option value="cool">cool</option>
                  <option value="neutral">neutral</option>
                  <option value="warm">warm</option>
                  <option value="olive">olive</option>
                </select>
                <span className="pill">
                  preset range {state.background.presetRanges.skinToneRange[0].toFixed(2)}-
                  {state.background.presetRanges.skinToneRange[1].toFixed(2)}
                </span>
              </div>
            </section>
          </>
        )}

        {category === 'body' && (
          <section className="section">
            <h3>body</h3>
            <SliderField
              label="height"
              value={state.body.height}
              min={SLIDER_RANGES.body.height.min}
              max={SLIDER_RANGES.body.height.max}
              step={SLIDER_RANGES.body.height.step}
              onChange={(value) => onUpdateBody({ height: value })}
            />
            <SliderField
              label="weight"
              value={state.body.weight}
              min={SLIDER_RANGES.body.weight.min}
              max={SLIDER_RANGES.body.weight.max}
              step={SLIDER_RANGES.body.weight.step}
              onChange={(value) => onUpdateBody({ weight: value })}
            />
            <SliderField
              label="muscularity"
              value={state.body.muscularity}
              min={SLIDER_RANGES.body.muscularity.min}
              max={SLIDER_RANGES.body.muscularity.max}
              step={SLIDER_RANGES.body.muscularity.step}
              onChange={(value) => onUpdateBody({ muscularity: value })}
            />
            <SliderField
              label="shoulder width"
              value={state.body.shoulderWidth}
              min={SLIDER_RANGES.body.shoulderWidth.min}
              max={SLIDER_RANGES.body.shoulderWidth.max}
              step={SLIDER_RANGES.body.shoulderWidth.step}
              onChange={(value) => onUpdateBody({ shoulderWidth: value })}
            />
            <SliderField
              label="waist"
              value={state.body.waist}
              min={SLIDER_RANGES.body.waist.min}
              max={SLIDER_RANGES.body.waist.max}
              step={SLIDER_RANGES.body.waist.step}
              onChange={(value) => onUpdateBody({ waist: value })}
            />
            <SliderField
              label="hip"
              value={state.body.hip}
              min={SLIDER_RANGES.body.hip.min}
              max={SLIDER_RANGES.body.hip.max}
              step={SLIDER_RANGES.body.hip.step}
              onChange={(value) => onUpdateBody({ hip: value })}
            />
            <SliderField
              label="leg length"
              value={state.body.legLength}
              min={SLIDER_RANGES.body.legLength.min}
              max={SLIDER_RANGES.body.legLength.max}
              step={SLIDER_RANGES.body.legLength.step}
              onChange={(value) => onUpdateBody({ legLength: value })}
            />
            <SliderField
              label="arm length"
              value={state.body.armLength}
              min={SLIDER_RANGES.body.armLength.min}
              max={SLIDER_RANGES.body.armLength.max}
              step={SLIDER_RANGES.body.armLength.step}
              onChange={(value) => onUpdateBody({ armLength: value })}
            />
          </section>
        )}

        {category === 'face' && (
          <section className="section">
            <h3>face</h3>
            <p className="hint">
              {faceDisabled
                ? 'face sliders require morph targets on the model.'
                : 'morph targets active.'}
            </p>
            <SliderField
              label="jaw width"
              value={state.face.jawWidth}
              min={SLIDER_RANGES.face.jawWidth.min}
              max={SLIDER_RANGES.face.jawWidth.max}
              step={SLIDER_RANGES.face.jawWidth.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ jawWidth: value })}
            />
            <SliderField
              label="chin"
              value={state.face.chin}
              min={SLIDER_RANGES.face.chin.min}
              max={SLIDER_RANGES.face.chin.max}
              step={SLIDER_RANGES.face.chin.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ chin: value })}
            />
            <SliderField
              label="cheekbone"
              value={state.face.cheekbone}
              min={SLIDER_RANGES.face.cheekbone.min}
              max={SLIDER_RANGES.face.cheekbone.max}
              step={SLIDER_RANGES.face.cheekbone.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ cheekbone: value })}
            />
            <SliderField
              label="nose bridge"
              value={state.face.noseBridge}
              min={SLIDER_RANGES.face.noseBridge.min}
              max={SLIDER_RANGES.face.noseBridge.max}
              step={SLIDER_RANGES.face.noseBridge.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ noseBridge: value })}
            />
            <SliderField
              label="nose width"
              value={state.face.noseWidth}
              min={SLIDER_RANGES.face.noseWidth.min}
              max={SLIDER_RANGES.face.noseWidth.max}
              step={SLIDER_RANGES.face.noseWidth.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ noseWidth: value })}
            />
            <SliderField
              label="eye size"
              value={state.face.eyeSize}
              min={SLIDER_RANGES.face.eyeSize.min}
              max={SLIDER_RANGES.face.eyeSize.max}
              step={SLIDER_RANGES.face.eyeSize.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ eyeSize: value })}
            />
            <SliderField
              label="eye spacing"
              value={state.face.eyeSpacing}
              min={SLIDER_RANGES.face.eyeSpacing.min}
              max={SLIDER_RANGES.face.eyeSpacing.max}
              step={SLIDER_RANGES.face.eyeSpacing.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ eyeSpacing: value })}
            />
            <SliderField
              label="brow"
              value={state.face.brow}
              min={SLIDER_RANGES.face.brow.min}
              max={SLIDER_RANGES.face.brow.max}
              step={SLIDER_RANGES.face.brow.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ brow: value })}
            />
            <SliderField
              label="lip fullness"
              value={state.face.lipFullness}
              min={SLIDER_RANGES.face.lipFullness.min}
              max={SLIDER_RANGES.face.lipFullness.max}
              step={SLIDER_RANGES.face.lipFullness.step}
              disabled={faceDisabled}
              onChange={(value) => onUpdateFace({ lipFullness: value })}
            />
          </section>
        )}

        {category === 'hair' && (
          <section className="section">
            <h3>hair</h3>
            <div className="field-row">
              <select
                value={state.hair.styleId}
                onChange={(event) =>
                  onUpdateHair({ styleId: event.target.value })
                }
              >
                <option value="short-linear">short linear</option>
                <option value="swept-crown">swept crown</option>
                <option value="braided-node">braided node</option>
                <option value="long-stream">long stream</option>
              </select>
              <input
                type="color"
                value={state.hair.color}
                onChange={(event) =>
                  onUpdateHair({ color: event.target.value })
                }
              />
            </div>
          </section>
        )}

        {category === 'clothing' && (
          <section className="section">
            <h3>clothing</h3>
            <div className="field-row">
              <select
                value={state.clothing.outfitId}
                onChange={(event) =>
                  onUpdateClothing({ outfitId: event.target.value })
                }
              >
                <option value="core-suit">core suit</option>
                <option value="veil-layer">veil layer</option>
                <option value="ritual-robe">ritual robe</option>
              </select>
              <input
                type="color"
                value={state.clothing.color}
                onChange={(event) =>
                  onUpdateClothing({ color: event.target.value })
                }
              />
            </div>
          </section>
        )}

        {category === 'finish' && (
          <section className="section">
            <h3>finish</h3>
            <SliderField
              label="detail level"
              value={state.finish.detailLevel}
              min={SLIDER_RANGES.finish.detailLevel.min}
              max={SLIDER_RANGES.finish.detailLevel.max}
              step={SLIDER_RANGES.finish.detailLevel.step}
              onChange={(value) => onUpdateFinish({ detailLevel: value })}
            />
            <SliderField
              label="aura glow"
              value={state.finish.glow}
              min={SLIDER_RANGES.finish.glow.min}
              max={SLIDER_RANGES.finish.glow.max}
              step={SLIDER_RANGES.finish.glow.step}
              onChange={(value) => onUpdateFinish({ glow: value })}
            />
          </section>
        )}

        <section className="section">
          <h3>export / import</h3>
          <div className="import-export">
            <textarea
              value={jsonBuffer}
              onChange={(event) => onJsonBufferChange(event.target.value)}
              placeholder="exported json appears here, or paste to import"
            />
            <div className="footer-actions">
              <button type="button" onClick={onExportJson}>
                export json
              </button>
              <button type="button" onClick={onImportJson}>
                import json
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <h3>confirm</h3>
          <button type="button" onClick={onConfirm}>
            confirm character
          </button>
        </section>
      </div>
    </div>
  )
}

export default ControlsPanel
