export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {children}
      </div>
    </div>
  )
}
