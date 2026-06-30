import { useState, useEffect } from 'react'
import { IconFileTypePdf } from '@tabler/icons-react'
import { getClosures } from '../../utils/db.js'
import { fmt } from '../../utils/format.js'
import { generatePDF } from '../../utils/pdf.js'

export default function Rapports() {
  const [loading,   setLoading]   = useState(true)
  const [closures,  setClosures]  = useState([])
  const [search,    setSearch]    = useState('')

  useEffect(() => {
    getClosures().then(setClosures).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Chargement de l'historique…</span></div>
  }

  const filtered = closures.filter(c =>
    !search || c.hairdresser.toLowerCase().includes(search.toLowerCase()) || c.dateF.toLowerCase().includes(search.toLowerCase())
  )

  if (!closures.length) {
    return <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Aucun rapport clôturé pour le moment.</p>
  }

  return (
    <div>
      <input
        className="m-input"
        placeholder="Rechercher par coiffeuse ou date…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {filtered.map((c) => (
        <div key={c.id} className="rcard">
          <div className="rcard-hd">
            <div>
              <div className="rcard-ttl">{c.hairdresser} — {c.dateF}</div>
              <div className="rcard-sub">
                {c.transactions.length} transaction{c.transactions.length !== 1 ? 's' : ''} · Clôturé à {c.closedAt}
              </div>
            </div>
            <div className="rcard-tot">{fmt(c.total)}</div>
          </div>
          <div className="rcard-body">
            <div className="rcard-row"><span>CB</span><span>{fmt(c.cb)}</span></div>
            <div className="rcard-row"><span>Espèces</span><span>{fmt(c.esp)}</span></div>
            {c.chq > 0 && <div className="rcard-row"><span>Chèques</span><span>{fmt(c.chq)}</span></div>}
            <div style={{ marginTop: 10 }}>
              <button
                className="act gold"
                style={{ padding: '8px 14px', fontSize: 10 }}
                onClick={() => generatePDF({
                  user: c.hairdresser,
                  dateStr: c.dateF,
                  transactions: c.transactions,
                  closedAt: c.closedAt,
                })}
              >
                <IconFileTypePdf size={14} /> PDF
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
