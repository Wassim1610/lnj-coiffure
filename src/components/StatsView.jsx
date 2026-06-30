import { useState, useEffect } from 'react'
import { IconFileTypePdf, IconLock } from '@tabler/icons-react'
import { fmt, fmtDate } from '../utils/format.js'
import { todayStr, getTxsForDate, getClosureForDate } from '../utils/db.js'
import Calendar from './Calendar.jsx'

export default function StatsView({
  user, selectedDate, calYear, calMonth, datesWithData,
  onSelectDate, onChangeMonth, onExportPDF, onCloture, refreshKey,
}) {
  const today   = todayStr()
  const isToday = selectedDate === today

  const [loading, setLoading] = useState(true)
  const [txs,     setTxs]     = useState([])
  const [closure, setClosure] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      getTxsForDate(user, selectedDate),
      getClosureForDate(user, selectedDate),
    ]).then(([t, c]) => {
      if (!cancelled) { setTxs(t); setClosure(c); setLoading(false) }
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [user, selectedDate, refreshKey])

  const allTxs = [...txs, ...(closure ? closure.transactions : [])]
  const total  = allTxs.reduce((s, t) => s + Number(t.total), 0)
  const n      = allTxs.length
  const cb     = allTxs.filter(t => t.payment === 'CB').reduce((s, t) => s + Number(t.total), 0)
  const esp    = allTxs.filter(t => t.payment === 'Espèces').reduce((s, t) => s + Number(t.total), 0)
  const chq    = allTxs.filter(t => t.payment === 'Chèque').reduce((s, t) => s + Number(t.total), 0)

  const dateLabel = isToday ? "Aujourd'hui"
    : fmtDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="sv">
      <Calendar
        year={calYear} month={calMonth}
        selectedDate={selectedDate}
        datesWithData={datesWithData}
        onSelectDate={onSelectDate}
        onChangeMonth={onChangeMonth}
      />

      <div className="divider">
        <div className="divider-line" />
        <div className="divider-txt">{dateLabel}</div>
        <div className="divider-line" />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '30px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div className="sgrid">
            <div className="sc"><div className="sc-l">CA</div><div className="sc-v">{fmt(total)}</div><div className="sc-s">{n} client{n !== 1 ? 's' : ''}</div></div>
            <div className="sc"><div className="sc-l">Ticket moyen</div><div className="sc-v">{n ? fmt(total / n) : '—'}</div></div>
            <div className="sc"><div className="sc-l">CB</div><div className="sc-v">{fmt(cb)}</div></div>
            <div className="sc"><div className="sc-l">Espèces</div><div className="sc-v">{fmt(esp)}</div></div>
            {chq > 0 && <div className="sc"><div className="sc-l">Chèques</div><div className="sc-v">{fmt(chq)}</div></div>}
          </div>

          <div className="act-row">
            <button className="act gold" disabled={n === 0} onClick={() => onExportPDF(allTxs, closure)}>
              <IconFileTypePdf size={16} /> Export PDF
            </button>
            {isToday && (
              <button className="act danger" disabled={txs.length === 0} onClick={onCloture}>
                <IconLock size={16} /> Clôturer la journée
              </button>
            )}
          </div>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-txt">Transactions</div>
            <div className="divider-line" />
          </div>

          {allTxs.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Aucune transaction ce jour-là.</p>
          ) : (
            allTxs.map((t, i) => (
              <div key={t.id ?? i} className="hr">
                <div>
                  <div className="hr-t">{t.time}</div>
                  <div className="hr-s">
                    {t.items.length} prestation{t.items.length !== 1 ? 's' : ''} ·{' '}
                    <span style={{ color: 'var(--secondary)' }}>{t.payment}</span>
                    {closure && ' · clôturé'}
                  </div>
                </div>
                <div className="hr-a">{fmt(Number(t.total))}</div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
