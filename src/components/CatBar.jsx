import {
  IconHeart, IconUser, IconStar, IconPalette, IconSparkles,
} from '@tabler/icons-react'

const ICONS = { IconHeart, IconUser, IconStar, IconPalette, IconSparkles }

export default function CatBar({ cats, activeCat, onSelect }) {
  return (
    <div className="catbar">
      {cats.map((cat) => {
        const Icon = ICONS[cat.ico]
        return (
          <button
            key={cat.id}
            className={`cbtn${cat.id === activeCat ? ' on' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            {Icon && <Icon size={14} />}
            {cat.lbl}
          </button>
        )
      })}
    </div>
  )
}
