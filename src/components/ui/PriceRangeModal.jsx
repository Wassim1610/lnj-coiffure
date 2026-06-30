import { useState, useEffect } from 'react'
import Modal from './Modal.jsx'
import { fmt } from '../../utils/format.js'

export default function PriceRangeModal({ item, onConfirm, onClose }) {
  const [price, setPrice] = useState(item?.p ?? 0)

  useEffect(() => { if (item) setPrice(item.p) }, [item])

  if (!item) return null

  return (
    <Modal open={!!item} onClose={onClose}>
      <div className="modal-ttl">{item.n}</div>
      <div className="modal-sub">Ajustez selon la longueur ou la complexité</div>
      <div className="modal-price">{fmt(price)}</div>
      <input
        type="range"
        min={item.min} max={item.max} step="0.5"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value))}
      />
      <div className="range-labels">
        <span>{fmt(item.min)}</span>
        <span>{fmt(item.max)}</span>
      </div>
      <div className="modal-btns">
        <button className="mbtn" onClick={onClose}>Annuler</button>
        <button className="mbtn pk" onClick={() => { onConfirm(item.n, price); onClose() }}>
          Ajouter — {fmt(price)}
        </button>
      </div>
    </Modal>
  )
}
