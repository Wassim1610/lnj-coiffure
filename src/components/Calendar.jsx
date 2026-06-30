import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { todayStr } from '../utils/db.js'

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS   = ['Lu','Ma','Me','Je','Ve','Sa','Di']

export default function Calendar({ year, month, selectedDate, datesWithData, onSelectDate, onChangeMonth }) {
  const today    = todayStr()
  const first    = new Date(year, month, 1)
  const startDow = (first.getDay() + 6) % 7   // Lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const total       = startDow + daysInMonth
  const remainder   = (7 - total % 7) % 7

  const cells = []

  // Jours du mois précédent
  for (let i = 0; i < startDow; i++) {
    cells.push({ day: daysInPrev - startDow + 1 + i, current: false, date: null })
  }
  // Jours du mois courant
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, current: true, date })
  }
  // Jours du mois suivant
  for (let i = 1; i <= remainder; i++) {
    cells.push({ day: i, current: false, date: null })
  }

  return (
    <div className="cal-wrap">
      <div className="cal-nav">
        <button className="cal-arr" onClick={() => onChangeMonth(-1)} aria-label="Mois précédent">
          <IconChevronLeft size={16} />
        </button>
        <span className="cal-month-lbl">{MONTHS[month]} {year}</span>
        <button className="cal-arr" onClick={() => onChangeMonth(1)} aria-label="Mois suivant">
          <IconChevronRight size={16} />
        </button>
      </div>

      <div className="cal-grid">
        {DAYS.map((d) => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((cell, i) => {
          if (!cell.current) return <div key={i} className="cal-day other-month">{cell.day}</div>

          const isToday    = cell.date === today
          const isSelected = cell.date === selectedDate
          const hasData    = datesWithData.has(cell.date)

          const cls = [
            'cal-day',
            hasData    ? 'has-data'    : '',
            isSelected ? 'selected'    : '',
            isToday && !isSelected ? 'is-today' : '',
          ].filter(Boolean).join(' ')

          return (
            <button key={i} className={cls} onClick={() => onSelectDate(cell.date)}>
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
