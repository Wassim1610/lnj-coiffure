import { IconScissors, IconSettings } from '@tabler/icons-react'

export default function Accueil({ onSelectUser, onGerant }) {
  return (
    <div className="accueil">
      <div className="acc-glow" />
      <div className="acc-logo">LNJ</div>
      <div className="acc-tag">Coiffure</div>
      <div className="acc-line" />
      <div className="acc-who">Qui es-tu ?</div>

      <div className="acc-btns">
        <button className="acc-btn" onClick={() => onSelectUser('Sabrina')}>
          <IconScissors size={18} /> Sabrina
        </button>
        <button className="acc-btn" onClick={() => onSelectUser('Laurence')}>
          <IconScissors size={18} /> Laurence
        </button>
        <button className="acc-btn-g" onClick={onGerant}>
          <IconSettings size={15} /> Accès Gérant
        </button>
      </div>
    </div>
  )
}
