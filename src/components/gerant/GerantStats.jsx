import { useState, useEffect } from 'react'
import { getAllTxsForDate, todayStr } from '../../utils/db.js'
import { fmt } from '../../utils/format.js'

const USERS = ['Sabrina', 'Laurence']

export default function GerantStats() {
  const [loading, setLoading] = useState(true)
  const [allTxs,  setAllTxs]  = useState([])

  useEffect(() => {
    getAllTxsForDate(todayStr())
      .then(setAllTxs)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Chargement…</span></div>
  }

  const totalSalon = allTxs.reduce((s, t) => s + Number(t.total), 0)

  return (
    <div>
      {USERS.map((user) => {
        const txs = allTxs.filter(t => t.hairdresser === user)
        const tot = txs.reduce((s, t) => s + Number(t.total), 0)
        const n   = txs.length
        const cb  = txs.filter(t => t.payment === 'CB').reduce((s, t) => s + Number(t.total), 0)
        const esp = txs.filter(t => t.payment === 'Espèces').reduce((s, t) => s + Number(t.total), 0)

        return (
          <div key={user} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div className="hdr-dot" />
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500 }}>{user}</span>
              <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>— {n} client{n !== 1 ? 's' : ''}</span>
            </div>
            <div className="sgrid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              <div className="sc"><div className="sc-l">CA</div><div className="sc-v" style={{ fontSize: 18 }}>{fmt(tot)}</div></div>
              <div className="sc"><div className="sc-l">CB</div><div className="sc-v" style={{ fontSize: 18 }}>{fmt(cb)}</div></div>
              <div className="sc"><div className="sc-l">Espèces</div><div className="sc-v" style={{ fontSize: 18 }}>{fmt(esp)}</div></div>
            </div>
          </div>
        )
      })}

      <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: 14, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--on-surface-variant)', fontWeight: 600 }}>TOTAL SALON</span>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 500, color: 'var(--on-surface)' }}>{fmt(totalSalon)}</span>
      </div>
    </div>
  )
}
