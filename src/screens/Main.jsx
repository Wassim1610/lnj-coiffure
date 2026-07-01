import { useState, useEffect, useCallback } from 'react'
import { IconArrowLeft, IconCashRegister, IconChartBar, IconScissors, IconReceipt } from '@tabler/icons-react'
import CatBar          from '../components/CatBar.jsx'
import ItemsGrid       from '../components/ItemsGrid.jsx'
import Ticket          from '../components/Ticket.jsx'
import StatsView       from '../components/StatsView.jsx'
import PriceRangeModal from '../components/ui/PriceRangeModal.jsx'
import ProductModal    from '../components/ui/ProductModal.jsx'
import SuccessOverlay  from '../components/ui/SuccessOverlay.jsx'
import Modal           from '../components/ui/Modal.jsx'
import {
  getTarifs, addTransaction, getTxsForDate, markTxsClosed,
  addClosure, getDatesWithData, todayStr,
} from '../utils/db.js'
import { fmt, fmtDate, fmtTime } from '../utils/format.js'
import { generatePDF } from '../utils/pdf.js'
import { DEFAULT_TARIFS } from '../data/tarifs.js'

const isMob = () => window.innerWidth < 768

export default function Main({ user, onBack }) {
  const [cats,        setCats]        = useState(DEFAULT_TARIFS)
  const [catsLoading, setCatsLoading] = useState(true)
  const [activeCat,   setActiveCat]   = useState('d')
  const [cart,        setCart]        = useState([])
  const [tab,         setTab]         = useState('caisse')
  const [mobView,     setMobView]     = useState('caisse')
  const [rangeItem,   setRangeItem]   = useState(null)
  const [productOpen, setProductOpen] = useState(false)
  const [success,     setSuccess]     = useState(null)
  const [cloModal,    setCloModal]    = useState(false)
  const [cloLoading,  setCloLoading]  = useState(false)
  const [errMsg,      setErrMsg]      = useState('')

  const today = todayStr()
  const [selDate,    setSelDate]    = useState(today)
  const [calYear,    setCalYear]    = useState(new Date().getFullYear())
  const [calMonth,   setCalMonth]   = useState(new Date().getMonth())
  const [datesData,  setDatesData]  = useState(new Set())
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    getTarifs()
      .then(c => { if (!cancelled) setCats(c) })
      .catch(() => { if (!cancelled) setCats(DEFAULT_TARIFS) })
      .finally(() => { if (!cancelled) setCatsLoading(false) })
    return () => { cancelled = true }
  }, [])

  const refreshDates = useCallback(() => {
    getDatesWithData(user).then(setDatesData).catch(() => {})
  }, [user])

  useEffect(() => { refreshDates() }, [refreshDates])

  const handleItemClick = (item) => {
    if (item.isProduct)          setProductOpen(true)
    else if (item.min !== undefined) setRangeItem(item)
    else                         addToCart(item.n, item.p)
  }

  const addToCart = (name, price) => {
    if (cart.some(i => i.name === name)) return
    setCart(prev => [...prev, { id: Date.now() + Math.random(), name, price }])
    if (isMob()) setMobView('ticket')
  }

  const addProductToCart = (productName, price) => {
    const label = productName ? `Produit — ${productName}` : 'Produit'
    setCart(prev => [...prev, { id: Date.now() + Math.random(), name: label, price }])
    if (isMob()) setMobView('ticket')
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const clearCart      = ()   => setCart([])

  const pay = async (method) => {
    if (!cart.length) return
    const total = cart.reduce((s, i) => s + i.price, 0)
    try {
      setErrMsg('')
      await addTransaction({
        hairdresser: user, date: today, time: fmtTime(),
        items: cart.map(({ name, price }) => ({ name, price })),
        total, payment: method,
      })
      setCart([])
      setSuccess({ title: `Encaissement ${method}`, sub: fmt(total) })
      setTimeout(() => { setSuccess(null); if (isMob()) setMobView('caisse') }, 1800)
      refreshDates()
      setRefreshKey(k => k + 1)
    } catch (err) {
      setErrMsg(`Échec de l'enregistrement (${err?.message || 'connexion Supabase'}). Vérifiez votre connexion internet.`)
    }
  }

  const doCloture = async () => {
    setCloLoading(true)
    setErrMsg('')
    try {
      const txs = await getTxsForDate(user, today)
      if (!txs.length) { setCloLoading(false); setCloModal(false); return }
      const total = txs.reduce((s, t) => s + Number(t.total), 0)
      await markTxsClosed(txs.map(t => t.id))
      await addClosure({
        hairdresser: user, date: today, dateF: fmtDate(today), closedAt: fmtTime(),
        transactions: txs, total,
        cb:  txs.filter(t => t.payment === 'CB').reduce((s, t) => s + Number(t.total), 0),
        esp: txs.filter(t => t.payment === 'Espèces').reduce((s, t) => s + Number(t.total), 0),
        chq: txs.filter(t => t.payment === 'Chèque').reduce((s, t) => s + Number(t.total), 0),
      })
      setCloModal(false)
      setSuccess({ title: 'Journée clôturée', sub: fmt(total) })
      setTimeout(() => setSuccess(null), 1800)
      refreshDates()
      setRefreshKey(k => k + 1)
    } catch (err) {
      setErrMsg(`Échec de la clôture (${err?.message || 'connexion'}). Réessayez.`)
    } finally {
      setCloLoading(false)
    }
  }

  const handleExportPDF = (allTxs, closure) => {
    generatePDF({ user, dateStr: fmtDate(selDate), transactions: allTxs, closedAt: closure?.closedAt ?? null })
  }

  const changeMonth = (dir) => {
    setCalMonth(prev => {
      let m = prev + dir, y = calYear
      if (m > 11) { m = 0; setCalYear(y + 1) }
      if (m < 0)  { m = 11; setCalYear(y - 1) }
      return m
    })
  }

  const mobile = isMob()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
         className={mobile ? 'main-mobile-pb' : ''}>
      <header className="hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="hdr-back" onClick={onBack}><IconArrowLeft size={20} /></button>
          <span className="hdr-logo">LNJ</span>
        </div>
        <div className="hdr-user"><div className="hdr-dot" /><span>{user}</span></div>
        <div className="hdr-dt">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      {errMsg && (
        <div className="err-banner">
          <span style={{ flex: 1 }}>{errMsg}</span>
          <button onClick={() => setErrMsg('')} style={{ fontWeight: 700, fontSize: 16 }}>×</button>
        </div>
      )}

      {!mobile && (
        <div className="tabbar">
          <button className={`tb${tab === 'caisse' ? ' on' : ''}`} onClick={() => setTab('caisse')}>
            <IconCashRegister size={14} /> Caisse
          </button>
          <button className={`tb${tab === 'stats' ? ' on' : ''}`} onClick={() => setTab('stats')}>
            <IconChartBar size={14} /> Stats du jour
          </button>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {((!mobile && tab === 'caisse') || (mobile && mobView === 'caisse')) && (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <CatBar cats={cats} activeCat={activeCat} onSelect={setActiveCat} />
              {catsLoading
                ? <div className="loading-screen"><div className="spinner" /><span>Chargement…</span></div>
                : <ItemsGrid cats={cats} activeCat={activeCat} onSelect={handleItemClick} cartItems={cart} />
              }
            </div>
            {!mobile && <Ticket cart={cart} onRemove={removeFromCart} onClear={clearCart} onPay={pay} />}
          </>
        )}

        {mobile && mobView === 'ticket' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Ticket cart={cart} onRemove={removeFromCart} onClear={clearCart} onPay={pay} />
          </div>
        )}

        {((!mobile && tab === 'stats') || (mobile && mobView === 'stats')) && (
          <StatsView
            user={user} selectedDate={selDate}
            calYear={calYear} calMonth={calMonth} datesWithData={datesData}
            onSelectDate={setSelDate} onChangeMonth={changeMonth}
            onExportPDF={handleExportPDF} onCloture={() => setCloModal(true)}
            refreshKey={refreshKey}
          />
        )}
      </div>

      {mobile && (
        <nav className="mobnav">
          <div className="mobnav-inner">
            <button className={`mnb${mobView === 'caisse' ? ' on' : ''}`} onClick={() => setMobView('caisse')}>
              <IconScissors size={22} /><span>Caisse</span>
            </button>
            <button className={`mnb${mobView === 'ticket' ? ' on' : ''}`} onClick={() => setMobView('ticket')}>
              <IconReceipt size={22} />
              {cart.length > 0 && <span className="mnb-badge">{cart.length > 9 ? '9+' : cart.length}</span>}
              <span>Ticket</span>
            </button>
            <button className={`mnb${mobView === 'stats' ? ' on' : ''}`} onClick={() => setMobView('stats')}>
              <IconChartBar size={22} /><span>Stats</span>
            </button>
          </div>
        </nav>
      )}

      <PriceRangeModal item={rangeItem} onConfirm={addToCart} onClose={() => setRangeItem(null)} />
      <ProductModal open={productOpen} onConfirm={addProductToCart} onClose={() => setProductOpen(false)} />

      <Modal open={cloModal} onClose={() => !cloLoading && setCloModal(false)}>
        <div className="modal-ttl">Clôturer la journée</div>
        <div className="modal-sub">{user} — cette action est définitive et irréversible.</div>
        <div className="modal-btns">
          <button className="mbtn" onClick={() => setCloModal(false)} disabled={cloLoading}>Annuler</button>
          <button className="mbtn dg" onClick={doCloture} disabled={cloLoading}>
            {cloLoading ? 'Clôture en cours…' : 'Confirmer'}
          </button>
        </div>
      </Modal>

      <SuccessOverlay open={!!success} title={success?.title} subtitle={success?.sub} />
    </div>
  )
}
