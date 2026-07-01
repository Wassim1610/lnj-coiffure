import { IconCheck, IconShoppingBag } from '@tabler/icons-react'
import { fmt } from '../utils/format.js'

export default function ItemsGrid({ cats, activeCat, onSelect, cartItems = [] }) {
  const cat = cats.find((c) => c.id === activeCat)
  if (!cat) return null

  const cartNames = new Set(cartItems.map(i => i.name))

  return (
    <div className="igrid">
      {cat.items.map((item) => {
        if (item.isProduct) {
          return (
            <button key={item.id} className="icard icard-product" onClick={() => onSelect(item)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <IconShoppingBag size={16} color="var(--secondary)" />
                <div className="icard-n" style={{ color: 'var(--secondary)', fontWeight: 600 }}>
                  {item.n}
                </div>
              </div>
              <div className="icard-r" style={{ color: 'var(--secondary)' }}>Prix libre</div>
            </button>
          )
        }

        const inCart = cartNames.has(item.n)

        return (
          <button
            key={item.id}
            className={`icard${inCart ? ' icard-incart' : ''}`}
            onClick={() => !inCart && onSelect(item)}
            disabled={inCart}
          >
            <div className="icard-n">{item.n}</div>
            {inCart ? (
              <div className="icard-r" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--secondary)' }}>
                <IconCheck size={13} /> Ajouté
              </div>
            ) : item.min !== undefined ? (
              <div className="icard-r">{fmt(item.min)} – {fmt(item.max)}</div>
            ) : (
              <div className="icard-p">{fmt(item.p)}</div>
            )}
          </button>
        )
      })}
    </div>
  )
}
