import { IconScissors, IconReceipt, IconCash, IconCreditCard, IconWriting } from '@tabler/icons-react'
import { fmt, fmtTime } from '../utils/format.js'

export default function Ticket({ cart, onRemove, onClear, onPay }) {
  const total = cart.reduce((s, i) => s + i.price, 0)
  const empty = cart.length === 0

  return (
    <div className="tkt-panel">
      <div className="tkt-hd">
        <span className="tkt-ttl"><IconReceipt size={16} /> Ticket</span>
        <span className="tkt-tm">{fmtTime()}</span>
      </div>

      <div className="tkt-list">
        {empty ? (
          <div className="tkt-empty">
            <IconScissors size={32} className="tkt-empty-icon" />
            <span>Sélectionnez une prestation</span>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="tkt-row">
              <div className="tkt-rn">{item.name}</div>
              <div className="tkt-rp">{fmt(item.price)}</div>
              <button className="tkt-rm" onClick={() => onRemove(item.id)} aria-label="Supprimer">
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="tkt-ft">
        <div className="tkt-tot">
          <span className="tkt-tot-l">Total</span>
          <span className="tkt-tot-v">{fmt(total)}</span>
        </div>
        <div className="pay-row">
          <button className="pay-btn" disabled={empty} onClick={() => onPay('Espèces')}>
            <IconCash size={15} /><span>Espèces</span>
          </button>
          <button className="pay-btn pk" disabled={empty} onClick={() => onPay('CB')}>
            <IconCreditCard size={15} /><span>CB</span>
          </button>
          <button className="pay-btn" disabled={empty} onClick={() => onPay('Chèque')}>
            <IconWriting size={15} /><span>Chèque</span>
          </button>
        </div>
        <button className="clr-btn" disabled={empty} onClick={onClear}>
          Vider le ticket
        </button>
      </div>
    </div>
  )
}
