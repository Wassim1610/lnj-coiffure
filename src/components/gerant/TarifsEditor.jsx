import { useState, useEffect } from 'react'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { getTarifs, saveTarifs } from '../../utils/db.js'

export default function TarifsEditor({ onSuccess }) {
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [cats,    setCats]    = useState([])
  const [error,   setError]   = useState('')

  useEffect(() => {
    getTarifs()
      .then(c => setCats(JSON.parse(JSON.stringify(c))))
      .catch(() => setError('Impossible de charger les tarifs.'))
      .finally(() => setLoading(false))
  }, [])

  const updatePrice = (catId, itemId, field, value) => {
    setCats(prev => prev.map(cat =>
      cat.id !== catId ? cat : {
        ...cat,
        items: cat.items.map(item =>
          item.id !== itemId ? item : { ...item, [field]: parseFloat(value) || item[field] }
        ),
      }
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = cats.map(cat => ({
        ...cat,
        items: cat.items.map(item =>
          item.min !== undefined ? { ...item, p: item.min } : item
        ),
      }))
      await saveTarifs(updated)
      onSuccess()
    } catch {
      setError("Échec de l'enregistrement — vérifiez la connexion.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /><span>Chargement des tarifs…</span></div>
  }

  return (
    <div>
      <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 18, lineHeight: 1.6 }}>
        Modifiez les prix ci-dessous puis appuyez sur <strong style={{ color: 'var(--on-surface)' }}>Sauvegarder</strong>.
      </p>

      {error && <div className="err-banner">{error}</div>}

      {cats.map((cat) => (
        <div key={cat.id} className="tcat">
          <div className="tcat-t">{cat.lbl}</div>
          {cat.items.map((item) => (
            <div key={item.id} className="titem">
              <div className="titem-n">{item.n}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {item.min !== undefined ? (
                  <>
                    <input
                      className="tinput" type="number" step="0.5" value={item.min}
                      onChange={(e) => updatePrice(cat.id, item.id, 'min', e.target.value)}
                      aria-label="Prix min"
                    />
                    <span className="tsep">–</span>
                    <input
                      className="tinput" type="number" step="0.5" value={item.max}
                      onChange={(e) => updatePrice(cat.id, item.id, 'max', e.target.value)}
                      aria-label="Prix max"
                    />
                  </>
                ) : (
                  <input
                    className="tinput" type="number" step="0.5" value={item.p}
                    onChange={(e) => updatePrice(cat.id, item.id, 'p', e.target.value)}
                    aria-label="Prix"
                  />
                )}
                <span style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>€</span>
              </div>
            </div>
          ))}
        </div>
      ))}

      <button className="act gold" onClick={handleSave} disabled={saving} style={{ marginTop: 4 }}>
        <IconDeviceFloppy size={16} /> {saving ? 'Sauvegarde…' : 'Sauvegarder les tarifs'}
      </button>
    </div>
  )
}
