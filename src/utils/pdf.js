import { jsPDF } from 'jspdf'

const GOLD  = [168, 128, 70]
const DARK  = [22,  20,  16]
const GRAY  = [110, 95,  78]
const LIGHT = [240, 232, 215]
const CREAM = [248, 244, 236]

// Conversion sûre — fonctionne que le total soit string ou number
const f = (v) => Number(v).toFixed(2) + ' EUR'
// Items sûr — évite le crash si items est null/undefined
const countItems = (t) => Array.isArray(t.items) ? t.items.length : (t.items_count || 0)

export function generatePDF({ user, dateStr, transactions, closedAt = null }) {
  const doc  = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
  const W = 210, M = 16

  const total = transactions.reduce((s, t) => s + Number(t.total), 0)
  const cb    = transactions.filter(t => t.payment === 'CB').reduce((s, t) => s + Number(t.total), 0)
  const esp   = transactions.filter(t => t.payment === 'Espèces').reduce((s, t) => s + Number(t.total), 0)
  const chq   = transactions.filter(t => t.payment === 'Chèque').reduce((s, t) => s + Number(t.total), 0)
  const n     = transactions.length

  // ── Header ──
  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 50, 'F')
  doc.setFontSize(28); doc.setTextColor(...GOLD); doc.setFont('helvetica', 'bold')
  doc.text('LNJ COIFFURE', W / 2, 19, { align: 'center' })
  doc.setFontSize(9); doc.setTextColor(...LIGHT); doc.setFont('helvetica', 'normal')
  doc.text('RAPPORT JOURNALIER', W / 2, 27, { align: 'center' })
  doc.text(`${user} — ${dateStr}`, W / 2, 34, { align: 'center' })
  doc.text(
    closedAt ? `Clôturé à ${closedAt}` : `Généré le ${new Date().toLocaleString('fr-FR')}`,
    W / 2, 41, { align: 'center' }
  )

  let y = 60

  // ── KPI Cards ──
  const cw = (W - 2 * M - 2 * 6) / 3
  const cards = [
    [f(total), "Chiffre d'affaires"],
    [`${n}`, 'Clients'],
    [n ? f(total / n) : '—', 'Ticket moyen'],
    [f(cb),  'CB'],
    [f(esp), 'Espèces'],
    [f(chq), 'Chèques'],
  ]
  cards.forEach(([val, lbl], i) => {
    const row = Math.floor(i / 3), col = i % 3
    const x = M + col * (cw + 6), cy = y + row * 26
    doc.setFillColor(...CREAM); doc.roundedRect(x, cy, cw, 20, 2, 2, 'F')
    doc.setFontSize(7); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
    doc.text(lbl.toUpperCase(), x + 4, cy + 7)
    doc.setFontSize(11); doc.setTextColor(...DARK); doc.setFont('helvetica', 'bold')
    doc.text(val, x + 4, cy + 16)
  })
  y += 60

  // ── Tableau des transactions ──
  doc.setFontSize(11); doc.setTextColor(...DARK); doc.setFont('helvetica', 'bold')
  doc.text('Détail des transactions', M, y)
  y += 3
  doc.setDrawColor(...GOLD); doc.setLineWidth(0.4); doc.line(M, y, W - M, y)
  y += 7

  doc.setFillColor(...DARK); doc.rect(M, y - 5, W - 2 * M, 9, 'F')
  doc.setFontSize(8); doc.setTextColor(...LIGHT); doc.setFont('helvetica', 'normal')
  doc.text('HEURE',       M + 4,      y)
  doc.text('PRESTATIONS', M + 28,     y)
  doc.text('MODE',        M + 90,     y)
  doc.text('MONTANT',     W - M - 4,  y, { align: 'right' })
  y += 10

  transactions.forEach((t, i) => {
    if (y > 265) { doc.addPage(); y = 20 }
    if (i % 2 === 0) {
      doc.setFillColor(248, 246, 240)
      doc.rect(M, y - 4, W - 2 * M, 9, 'F')
    }
    const nb = countItems(t)
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...DARK)
    doc.text(String(t.time || '—'),            M + 4,      y + 1)
    doc.text(`${nb} prestation${nb !== 1 ? 's' : ''}`, M + 28, y + 1)
    doc.text(String(t.payment || '—'),         M + 90,     y + 1)
    doc.setFont('helvetica', 'bold')
    doc.text(f(t.total),                       W - M - 4,  y + 1, { align: 'right' })
    y += 9
  })

  // ── Total ──
  y += 4
  doc.setDrawColor(...GOLD); doc.setLineWidth(0.5); doc.line(M, y, W - M, y)
  y += 8
  doc.setFontSize(12); doc.setTextColor(...GOLD); doc.setFont('helvetica', 'bold')
  doc.text('TOTAL JOURNÉE', M + 4, y)
  doc.text(f(total), W - M - 4, y, { align: 'right' })

  // ── Footer ──
  doc.setFontSize(7); doc.setTextColor(...GRAY); doc.setFont('helvetica', 'normal')
  doc.text('Document confidentiel — Usage comptable uniquement', W / 2, 287, { align: 'center' })

  // ── Sauvegarde ──
  const filename = `LNJ-${user}-${new Date().toISOString().slice(0, 10)}.pdf`
  try {
    doc.save(filename)
  } catch {
    window.open(doc.output('bloburl'), '_blank')
  }
}
