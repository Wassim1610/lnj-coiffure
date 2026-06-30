import { useState } from 'react'
import { IconArrowLeft, IconChartPie, IconHistory, IconEdit, IconSettings } from '@tabler/icons-react'
import GerantStats    from '../components/gerant/GerantStats.jsx'
import Rapports       from '../components/gerant/Rapports.jsx'
import TarifsEditor   from '../components/gerant/TarifsEditor.jsx'
import Reglages       from '../components/gerant/Reglages.jsx'
import SuccessOverlay from '../components/ui/SuccessOverlay.jsx'

const TABS = [
  { id: 'stats',    label: 'Stats',    Icon: IconChartPie },
  { id: 'rapports', label: 'Rapports', Icon: IconHistory },
  { id: 'tarifs',   label: 'Tarifs',   Icon: IconEdit },
  { id: 'reglages', label: 'Réglages', Icon: IconSettings },
]

export default function Gerant({ onBack }) {
  const [activeTab, setActiveTab] = useState('stats')
  const [success,   setSuccess]   = useState(null)

  const showSuccess = (title) => {
    setSuccess({ title })
    setTimeout(() => setSuccess(null), 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <header className="hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="hdr-back" onClick={onBack} aria-label="Retour"><IconArrowLeft size={20} /></button>
          <span className="hdr-logo">LNJ</span>
        </div>
        <div className="hdr-user">
          <div className="hdr-dot" style={{ background: 'var(--error)' }} />
          <span>Gérant</span>
        </div>
        <div className="hdr-dt">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className="gtabs">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} className={`gtab${activeTab === id ? ' on' : ''}`} onClick={() => setActiveTab(id)}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="gcont">
        {activeTab === 'stats'    && <GerantStats />}
        {activeTab === 'rapports' && <Rapports />}
        {activeTab === 'tarifs'   && <TarifsEditor onSuccess={() => showSuccess('Tarifs sauvegardés')} />}
        {activeTab === 'reglages' && <Reglages onSuccess={() => showSuccess('PIN modifié')} />}
      </div>

      <SuccessOverlay open={!!success} title={success?.title} subtitle="" />
    </div>
  )
}
