/** Formate un montant en euros avec espace insécable */
export const fmt = (v) =>
  v.toFixed(2).replace('.', ',') + '\u202f€'

/** Formate une date ISO en français */
export const fmtDate = (isoStr, opts = {}) => {
  const defaults = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(isoStr + 'T12:00:00').toLocaleDateString('fr-FR', { ...defaults, ...opts })
}

/** Formate l'heure courante HH:MM */
export const fmtTime = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

/** Formate la date courante en long */
export const fmtToday = () =>
  new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
