import { supabase } from './supabaseClient.js'
import { DEFAULT_TARIFS } from '../data/tarifs.js'

export const todayStr = () => new Date().toISOString().slice(0, 10)

// ══════════════════════════
// TARIFS
// ══════════════════════════
export async function getTarifs() {
  const { data, error } = await supabase
    .from('tarifs').select('categories').eq('id', 'main').single()
  if (error || !data) return DEFAULT_TARIFS
  return data.categories
}

export async function saveTarifs(categories) {
  const { error } = await supabase
    .from('tarifs')
    .update({ categories, updated_at: new Date().toISOString() })
    .eq('id', 'main')
  if (error) throw error
}

// ══════════════════════════
// SETTINGS (PIN)
// ══════════════════════════
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings').select('pin').eq('id', 'main').single()
  if (error || !data) return { pin: '1234' }
  return { pin: data.pin }
}

export async function saveSettings(settings) {
  const { error } = await supabase
    .from('settings')
    .update({ pin: settings.pin, updated_at: new Date().toISOString() })
    .eq('id', 'main')
  if (error) throw error
}

// ══════════════════════════
// TRANSACTIONS
// ══════════════════════════
export async function addTransaction({ hairdresser, date, time, items, total, payment }) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ hairdresser, date, time, items, total, payment, closed: false })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Transactions ouvertes (non clôturées) d'une coiffeuse pour une date donnée */
export async function getTxsForDate(hairdresser, date) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('hairdresser', hairdresser)
    .eq('date', date)
    .eq('closed', false)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

/** Toutes les transactions ouvertes du jour, toutes coiffeuses (pour le gérant) */
export async function getAllTxsForDate(date) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function markTxsClosed(ids) {
  const { error } = await supabase
    .from('transactions')
    .update({ closed: true })
    .in('id', ids)
  if (error) throw error
}

// ══════════════════════════
// CLOSURES (rapports clôturés)
// ══════════════════════════
export async function addClosure(closure) {
  const { data, error } = await supabase
    .from('closures')
    .insert({
      hairdresser: closure.hairdresser,
      date: closure.date,
      date_label: closure.dateF,
      closed_at: closure.closedAt,
      transactions: closure.transactions,
      total: closure.total,
      cb: closure.cb,
      especes: closure.esp,
      cheque: closure.chq,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/** Toutes les clôtures (historique complet) */
export async function getClosures() {
  const { data, error } = await supabase
    .from('closures')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeClosure)
}

export async function getClosureForDate(hairdresser, date) {
  const { data, error } = await supabase
    .from('closures')
    .select('*')
    .eq('hairdresser', hairdresser)
    .eq('date', date)
    .maybeSingle()
  if (error) throw error
  return data ? normalizeClosure(data) : null
}

function normalizeClosure(row) {
  return {
    id: row.id,
    hairdresser: row.hairdresser,
    date: row.date,
    dateF: row.date_label,
    closedAt: row.closed_at,
    transactions: row.transactions,
    total: Number(row.total),
    cb: Number(row.cb),
    esp: Number(row.especes),
    chq: Number(row.cheque),
  }
}

/** Dates ayant des données (transactions ou clôtures) pour une coiffeuse */
export async function getDatesWithData(hairdresser) {
  const [txRes, cloRes] = await Promise.all([
    supabase.from('transactions').select('date').eq('hairdresser', hairdresser),
    supabase.from('closures').select('date').eq('hairdresser', hairdresser),
  ])
  const dates = new Set()
  ;(txRes.data || []).forEach(r => dates.add(r.date))
  ;(cloRes.data || []).forEach(r => dates.add(r.date))
  return dates
}
