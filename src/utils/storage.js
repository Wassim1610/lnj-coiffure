import { DEFAULT_TARIFS } from '../data/tarifs.js'

const KEY = 'lnj_'

const get = (k) => {
  try { return JSON.parse(localStorage.getItem(KEY + k)) } catch { return null }
}
const set = (k, v) => localStorage.setItem(KEY + k, JSON.stringify(v))

export const getTarifs      = () => get('tarifs')   || DEFAULT_TARIFS
export const getSettings    = () => get('settings') || { pin: '1234' }
export const getTransactions= () => get('txs')      || []
export const getClosures    = () => get('closures') || []

export const saveTarifs       = (v) => set('tarifs',   v)
export const saveSettings     = (v) => set('settings', v)
export const saveTransactions = (v) => set('txs',      v)
export const saveClosures     = (v) => set('closures', v)

export const todayStr = () => new Date().toISOString().slice(0, 10)

/** Transactions ouvertes d'un utilisateur pour une date donnée */
export const getTxsForDate = (user, date) =>
  getTransactions().filter(t => t.hairdresser === user && t.date === date && !t.closed)

/** Clôture d'un utilisateur pour une date donnée */
export const getClosureForDate = (user, date) =>
  getClosures().find(c => c.hairdresser === user && c.date === date) || null

/** Toutes les dates ayant des données pour un utilisateur */
export const getDatesWithData = (user) => {
  const txDates  = getTransactions().filter(t => t.hairdresser === user).map(t => t.date)
  const cloDates = getClosures().filter(c => c.hairdresser === user).map(c => c.date)
  return new Set([...txDates, ...cloDates])
}
