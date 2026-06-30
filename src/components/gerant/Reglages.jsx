import { useState } from 'react'
import { IconKey } from '@tabler/icons-react'
import { saveSettings } from '../../utils/db.js'
import Modal from '../ui/Modal.jsx'

export default function Reglages({ onSuccess }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [newPin,    setNewPin]    = useState('')
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)

  const handleSave = async () => {
    if (!/^\d{4}$/.test(newPin)) { setError('PIN invalide — 4 chiffres requis.'); return }
    setSaving(true)
    try {
      await saveSettings({ pin: newPin })
      setNewPin('')
      setError('')
      setModalOpen(false)
      onSuccess()
    } catch {
      setError('Échec — vérifiez la connexion internet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="sc" style={{ marginBottom: 16 }}>
        <div className="sc-l">PIN Gérant actuel</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 500, color: 'var(--on-surface)', letterSpacing: 8 }}>••••</div>
      </div>

      <button className="act gold" onClick={() => setModalOpen(true)}>
        <IconKey size={16} /> Changer le PIN
      </button>

      <Modal open={modalOpen} onClose={() => { if (!saving) { setModalOpen(false); setError('') } }}>
        <div className="modal-ttl">Changer le PIN</div>
        <div className="modal-sub">Nouveau PIN Gérant (4 chiffres)</div>
        <input
          className="m-input"
          type="tel" maxLength={4} placeholder="Ex: 5678"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          style={{ textAlign: 'center', fontSize: 22, letterSpacing: 6 }}
        />
        {error && <div style={{ color: 'var(--error)', fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <div className="modal-btns">
          <button className="mbtn" onClick={() => { setModalOpen(false); setError('') }} disabled={saving}>Annuler</button>
          <button className="mbtn pk" onClick={handleSave} disabled={saving}>
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
