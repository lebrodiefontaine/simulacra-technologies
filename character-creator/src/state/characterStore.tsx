import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { CategoryKey, CharacterState } from './characterTypes'
import {
  createDefaultState,
  defaultBackgroundState,
  defaultBodyState,
  defaultClothingState,
  defaultFaceState,
  defaultFinishState,
  defaultHairState,
} from './characterDefaults'
import { deriveHeritagePreset } from './heritageUtils'
import {
  randomizeAll,
  randomizeBackground,
  randomizeBody,
  randomizeClothing,
  randomizeFace,
  randomizeFinish,
  randomizeHair,
} from './randomize'
import { loadState, saveState } from './storage'

type CharacterContextValue = {
  state: CharacterState
  updateBackground: (patch: Partial<CharacterState['background']>) => void
  updateBody: (patch: Partial<CharacterState['body']>) => void
  updateFace: (patch: Partial<CharacterState['face']>) => void
  updateHair: (patch: Partial<CharacterState['hair']>) => void
  updateClothing: (patch: Partial<CharacterState['clothing']>) => void
  updateFinish: (patch: Partial<CharacterState['finish']>) => void
  updateMeta: (patch: Partial<CharacterState['meta']>) => void
  setState: (next: CharacterState) => void
  resetCategory: (category: CategoryKey) => void
  resetAll: () => void
  randomizeCategory: (category: CategoryKey) => void
  randomizeAll: () => void
  applyHeritagePreset: () => void
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

type ProviderProps = {
  children: React.ReactNode
  onCharacterChange?: (state: CharacterState) => void
  onRandomize?: (state: CharacterState) => void
}

export const CharacterProvider = ({
  children,
  onCharacterChange,
  onRandomize,
}: ProviderProps) => {
  const [state, setState] = useState<CharacterState>(() => {
    const stored = loadState()
    return stored ?? createDefaultState()
  })

  useEffect(() => {
    saveState(state)
    onCharacterChange?.(state)
  }, [state, onCharacterChange])

  const updateBackground = useCallback(
    (patch: Partial<CharacterState['background']>) => {
      setState((prev) => ({
        ...prev,
        background: { ...prev.background, ...patch },
      }))
    },
    [],
  )

  const updateBody = useCallback(
    (patch: Partial<CharacterState['body']>) => {
      setState((prev) => ({ ...prev, body: { ...prev.body, ...patch } }))
    },
    [],
  )

  const updateFace = useCallback(
    (patch: Partial<CharacterState['face']>) => {
      setState((prev) => ({ ...prev, face: { ...prev.face, ...patch } }))
    },
    [],
  )

  const updateHair = useCallback(
    (patch: Partial<CharacterState['hair']>) => {
      setState((prev) => ({ ...prev, hair: { ...prev.hair, ...patch } }))
    },
    [],
  )

  const updateClothing = useCallback(
    (patch: Partial<CharacterState['clothing']>) => {
      setState((prev) => ({
        ...prev,
        clothing: { ...prev.clothing, ...patch },
      }))
    },
    [],
  )

  const updateFinish = useCallback(
    (patch: Partial<CharacterState['finish']>) => {
      setState((prev) => ({
        ...prev,
        finish: { ...prev.finish, ...patch },
      }))
    },
    [],
  )

  const updateMeta = useCallback(
    (patch: Partial<CharacterState['meta']>) => {
      setState((prev) => ({ ...prev, meta: { ...prev.meta, ...patch } }))
    },
    [],
  )

  const resetCategory = useCallback((category: CategoryKey) => {
    setState((prev) => {
      switch (category) {
        case 'background': {
          const background = defaultBackgroundState()
          return { ...prev, background }
        }
        case 'body':
          return { ...prev, body: defaultBodyState() }
        case 'face':
          return { ...prev, face: defaultFaceState() }
        case 'hair':
          return { ...prev, hair: defaultHairState() }
        case 'clothing':
          return { ...prev, clothing: defaultClothingState() }
        case 'finish':
          return { ...prev, finish: defaultFinishState() }
        default:
          return prev
      }
    })
  }, [])

  const resetAll = useCallback(() => {
    setState(createDefaultState())
  }, [])

  const randomizeCategory = useCallback(
    (category: CategoryKey) => {
      setState((prev) => {
        let next = prev
        switch (category) {
          case 'background':
            next = { ...prev, background: randomizeBackground(prev.background) }
            break
          case 'body':
            next = { ...prev, body: randomizeBody(prev.body) }
            break
          case 'face':
            next = { ...prev, face: randomizeFace(prev.face) }
            break
          case 'hair':
            next = { ...prev, hair: randomizeHair(prev.hair) }
            break
          case 'clothing':
            next = { ...prev, clothing: randomizeClothing(prev.clothing) }
            break
          case 'finish':
            next = { ...prev, finish: randomizeFinish(prev.finish) }
            break
          default:
            next = prev
        }
        onRandomize?.(next)
        return next
      })
    },
    [onRandomize],
  )

  const randomizeAllState = useCallback(() => {
    setState((prev) => {
      const next = randomizeAll(prev)
      onRandomize?.(next)
      return next
    })
  }, [onRandomize])

  const applyHeritagePreset = useCallback(() => {
    setState((prev) => {
      const preset = deriveHeritagePreset(prev.background.ancestryMix)
      return {
        ...prev,
        background: randomizeBackground({ ...prev.background, presetRanges: preset }),
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      state,
      updateBackground,
      updateBody,
      updateFace,
      updateHair,
      updateClothing,
      updateFinish,
      updateMeta,
      setState,
      resetCategory,
      resetAll,
      randomizeCategory,
      randomizeAll: randomizeAllState,
      applyHeritagePreset,
    }),
    [
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
      randomizeAllState,
      applyHeritagePreset,
    ],
  )

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacter = () => {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error('useCharacter must be used within CharacterProvider')
  }
  return context
}
