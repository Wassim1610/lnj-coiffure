import { IconBrandGoogle } from '@tabler/icons-react'
import { supabase } from '../utils/supabaseClient.js'

export default function Login() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://wassim1610.github.io/lnj-coiffure/',
      },
    })
  }

  return (
    <div className="accueil">
      <div className="acc-logo">LNJ</div>
      <div className="acc-tag">Coiffure</div>
      <div className="acc-line" />
      <div className="acc-who">Accès sécurisé</div>

      <div style={{ width: '100%', maxWidth: 270 }}>
        <button
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '16px 24px',
            background: '#ffffff', border: '1px solid #dadce0',
            borderRadius: 'var(--r-md)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontSize: 15, fontWeight: 500, fontFamily: 'var(--sans)',
            color: '#3c4043', boxShadow: '0 1px 3px rgba(0,0,0,.08)',
          }}
        >
          <IconBrandGoogle size={20} color="#4285F4" />
          Se connecter avec Google
        </button>
        <p style={{
          marginTop: 16, fontSize: 11, color: 'var(--on-surface-variant)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          Accès réservé au personnel autorisé de LNJ Coiffure
        </p>
      </div>
    </div>
  )
}
