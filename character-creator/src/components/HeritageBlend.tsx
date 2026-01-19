import { useMemo } from 'react'
import type { BackgroundState } from '../state/characterTypes'
import { HERITAGE_GROUPS } from '../state/heritagePresets'
import { deriveHeritagePreset, updateAncestryWeight } from '../state/heritageUtils'

type Props = {
  background: BackgroundState
  onChange: (next: BackgroundState) => void
  onApplyPreset: () => void
}

const HeritageBlend = ({ background, onChange, onApplyPreset }: Props) => {
  const availableGroups = useMemo(
    () =>
      HERITAGE_GROUPS.filter(
        (group) =>
          !background.ancestryMix.some((entry) => entry.groupId === group.id),
      ),
    [background.ancestryMix],
  )

  const addGroup = (groupId: string) => {
    const nextMix = [
      ...background.ancestryMix,
      { groupId, weight: 0.2 },
    ]
    const presetRanges = deriveHeritagePreset(nextMix)
    onChange({ ...background, ancestryMix: nextMix, presetRanges })
  }

  const removeGroup = (groupId: string) => {
    const nextMix = background.ancestryMix.filter(
      (entry) => entry.groupId !== groupId,
    )
    const presetRanges = deriveHeritagePreset(nextMix)
    onChange({ ...background, ancestryMix: nextMix, presetRanges })
  }

  return (
    <div>
      <div className="field-row">
        <select
          value=""
          onChange={(event) => {
            if (event.target.value) {
              addGroup(event.target.value)
            }
          }}
        >
          <option value="">add heritage component</option>
          {availableGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={onApplyPreset}>
          apply preset
        </button>
      </div>
      <p className="hint">heritage blend (for preset ranges only)</p>
      <div className="heritage-list">
        {background.ancestryMix.map((entry) => {
          const group = HERITAGE_GROUPS.find((item) => item.id === entry.groupId)
          return (
            <div className="heritage-card" key={entry.groupId}>
              <strong>{group?.label ?? entry.groupId}</strong>
              <div className="slider">
                <label>
                  <span>weight</span>
                  <span>{entry.weight.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min={0.05}
                  max={1}
                  step={0.01}
                  value={entry.weight}
                  onChange={(event) => {
                    const weight = Number(event.target.value)
                    const nextMix = updateAncestryWeight(
                      background.ancestryMix,
                      entry.groupId,
                      weight,
                    )
                    const presetRanges = deriveHeritagePreset(nextMix)
                    onChange({
                      ...background,
                      ancestryMix: nextMix,
                      presetRanges,
                    })
                  }}
                />
              </div>
              <button type="button" onClick={() => removeGroup(entry.groupId)}>
                remove
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HeritageBlend
