import { fmt } from '../utils/format.js'

export default function ItemsGrid({ cats, activeCat, onSelect }) {
  const cat = cats.find((c) => c.id === activeCat)
  if (!cat) return null

  return (
    <div className="igrid">
      {cat.items.map((item) => (
        <button key={item.id} className="icard" onClick={() => onSelect(item)}>
          <div className="icard-n">{item.n}</div>
          {item.min !== undefined
            ? <div className="icard-r">{fmt(item.min)} – {fmt(item.max)}</div>
            : <div className="icard-p">{fmt(item.p)}</div>
          }
        </button>
      ))}
    </div>
  )
}
