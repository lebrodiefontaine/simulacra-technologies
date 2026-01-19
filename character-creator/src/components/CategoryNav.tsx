import type { CategoryKey } from '../state/characterTypes'

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  background: 'background',
  body: 'body',
  face: 'face',
  hair: 'hair',
  clothing: 'clothing',
  finish: 'finish',
}

type Props = {
  active: CategoryKey
  onChange: (category: CategoryKey) => void
}

const CategoryNav = ({ active, onChange }: Props) => (
  <div className="nav">
    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
      <button
        key={key}
        className={active === key ? 'active' : ''}
        onClick={() => onChange(key as CategoryKey)}
        type="button"
      >
        {label}
      </button>
    ))}
  </div>
)

export default CategoryNav
