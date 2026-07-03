import { useState, useEffect } from 'react'
import { supabase } from './utils/supabaseClient.js'
import Login    from './screens/Login.jsx'
import Accueil  from './screens/Accueil.jsx'
import PinLogin from './screens/PinLogin.jsx'
import Main     from './screens/Main.jsx'
import Gerant   from './screens/Gerant.jsx'

// ⚠️ Ton vrai Gmail ici
const EMAILS_AUTORISES = [
  'ton.email@gmail.com',
]

const emailAutorisé = (email) =>
  EMAILS_AUTORISES.map(e => e.toLowerCase()).includes((email || '').toLowerCase())

export default function App() {
  const [session, setSession] = useState(undefined)
  const [screen,  setScreen]  = useState('accueil')
  const [user,    setUser]    = useState(null)
  const [refusé,  setRefusé]  = useState(false)

  useEffect(() => {
    // Vérifie la session au démarrage (inclut le callback OAuth)
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session
      if (s && !emailAutorisé(s.user.email)) {
        supabase.auth.signOut()
        setRefusé(true)
        setSession(null)
      } else {
        setSession(s ?? null)
      }
    })

    // Écoute les changements d'authentification
    const { data: listener } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_IN' && s) {
        if (!emailAutorisé(s.user.email)) {
          supabase.auth.signOut()
          setRefusé(true)
          setSession(null)
        } else {
          setRefusé(false)
          setSession(s)
          // Nettoie le hash OAuth de l'URL
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const selectUser = (name) => { setUser(name); setScreen('main') }
  const goGerant   = ()     => setScreen('pin')
  const goBack     = ()     => setScreen('accueil')
  const logout     = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setScreen('accueil')
  }

  // Chargement initial
  if (session === undefined) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Chargement…</span>
      </div>
    )
  }

  // Non connecté
  if (!session) {
    return (
      <>
        <Login />
        {refusé && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#ba1a1a', color: '#fff', padding: '12px 22px',
            borderRadius: 8, fontSize: 13, zIndex: 999,
          }}>
            ⛔ Accès refusé — ce compte n'est pas autorisé
          </div>
        )}
      </>
    )
  }

  // Connecté → appli normale
  return (
    <>
      {screen === 'accueil' && <Accueil onSelectUser={selectUser} onGerant={goGerant} onLogout={logout} />}
      {screen === 'pin'     && <PinLogin onSuccess={() => setScreen('gerant')} onBack={goBack} />}
      {screen === 'main'    && <Main user={user} onBack={goBack} />}
      {screen === 'gerant'  && <Gerant onBack={goBack} />}
    </>
  )
}
