import CharacterCreator from './CharacterCreator'
import { CharacterProvider } from '../state/characterStore'
import type { CharacterState } from '../state/characterTypes'

type Props = {
  onCharacterChange?: (state: CharacterState) => void
  onConfirm?: (state: CharacterState) => void
  onRandomize?: (state: CharacterState) => void
}

const CharacterCreatorRoot = ({
  onCharacterChange,
  onConfirm,
  onRandomize,
}: Props) => (
  <CharacterProvider
    onCharacterChange={onCharacterChange}
    onRandomize={onRandomize}
  >
    <CharacterCreator onConfirm={onConfirm} />
  </CharacterProvider>
)

export default CharacterCreatorRoot
