import { useState } from 'react'
import { IconBackspace } from '@tabler/icons-react'
import { getSettings } from '../utils/db.js'

export default function PinLogin({ onSuccess, onBack }) {
  const [pin,      setPin]      = useState('')
  const [error,    setError]    = useState('')
  const [checking, setChecking] = useState(false)

  const handleKey = (k) => {
    if (pin.length >= 4 || checking) return
    const next = pin + k
    setPin(next)
    setError('')
    if (next.length === 4) {
      setChecking(true)
      setTimeout(async () => {
        try {
          const settings = await getSettings()
          if (next === settings.pin) { onSuccess() }
          else { setError('PIN incorrect — réessayez'); setPin('') }
        } catch {
          setError('Connexion impossible — vérifiez le WiFi'); setPin('')
        } finally {
          setChecking(false)
        }
      }, 150)
    }
  }

  const handleDel = () => { setPin(p => p.slice(0, -1)); setError('') }

  return (
    <div className="pin-screen">
      <div className="pin-wrap">
        <div className="pin-ttl">Accès Gérant</div>
        <div className="pin-sub">LNJ Coiffure — PIN requis</div>

        <div className="pin-dots">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`pin-dot${i < pin.length ? ' f' : ''}`} />
          ))}
        </div>

        <div className="pin-err">{checking ? 'Vérification…' : error}</div>

        <div className="pin-grid">
          {['1','2','3','4','5','6','7','8','9'].map(k => (
            <button key={k} className="pkey" onClick={() => handleKey(k)}>{k}</button>
          ))}
          <button className="pkey sm" onClick={onBack}>Retour</button>
          <button className="pkey" onClick={() => handleKey('0')}>0</button>
          <button className="pkey sm" onClick={handleDel}><IconBackspace size={18} /></button>
        </div>
      </div>
    </div>
  )
}
