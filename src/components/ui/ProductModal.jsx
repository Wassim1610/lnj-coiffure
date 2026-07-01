import { useState } from 'react'
import { IconShoppingBag } from '@tabler/icons-react'
import Modal from './Modal.jsx'

export default function ProductModal({ open, onConfirm, onClose }) {
  const [name,  setName]  = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    const p = parseFloat(price.replace(',', '.'))
    if (!price || isNaN(p) || p <= 0) {
      setError('Veuillez entrer un prix valide.')
      return
    }
    onConfirm(name.trim() || 'Produit', p)
    setName('')
    setPrice('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setName('')
    setPrice('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <IconShoppingBag size={20} color="var(--secondary)" />
        <div className="modal-ttl" style={{ marginBottom: 0 }}>Vente de produit</div>
      </div>
      <div className="modal-sub">Entrez le nom et le prix du produit vendu</div>

      <input
        className="m-input"
        type="text"
        placeholder="Nom du produit (ex: Shampoing Kérastase)"
        value={name}
        onChange={(e) => { setName(e.target.value); setError('') }}
      />
      <input
        className="m-input"
        type="number"
        placeholder="Prix en € (ex: 24.50)"
        min="0"
        step="0.50"
        value={price}
        onChange={(e) => { setPrice(e.target.value); setError('') }}
        style={{ fontSize: 18, textAlign: 'center', fontFamily: 'var(--serif)' }}
      />

      {error && (
        <div style={{ color: 'var(--error)', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div className="modal-btns">
        <button className="mbtn" onClick={handleClose}>Annuler</button>
        <button className="mbtn pk" onClick={handleConfirm}>Ajouter au ticket</button>
      </div>
    </Modal>
  )
}
