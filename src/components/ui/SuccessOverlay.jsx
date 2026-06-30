import { IconCheck } from '@tabler/icons-react'

export default function SuccessOverlay({ open, title, subtitle }) {
  if (!open) return null
  return (
    <div className="success-overlay">
      <IconCheck size={56} className="success-icon" />
      <div className="success-t">{title}</div>
      {subtitle && <div className="success-s">{subtitle}</div>}
    </div>
  )
}
