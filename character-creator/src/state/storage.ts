import type { CharacterState } from './characterTypes'

const STORAGE_KEY = 'simulacra-character-v1'

export const loadState = (): CharacterState | null => {
  if (typeof window === 'undefined') {
    return null
  }
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as CharacterState
  } catch {
    return null
  }
}

export const saveState = (state: CharacterState) => {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
