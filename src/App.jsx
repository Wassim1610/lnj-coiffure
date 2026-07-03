import { useState, useEffect } from 'react'
import { supabase } from './utils/supabaseClient.js'
import Login     from './screens/Login.jsx'
import Accueil   from './screens/Accueil.jsx'
import PinLogin  from './screens/PinLogin.jsx'
import Main      from './screens/Main.jsx'
import Gerant    from './screens/Gerant.jsx'

// ⚠️ Remplace par ton vrai Gmail ici
const EMAILS_AUTORISES = [
  'sabrwassim@gmail.com',
]

export default function App() {
  const [session, setSession] = useState(undefined)
  const [screen,  setScreen]  = useState('accueil')
  const [user,    setUser]    = useState(null)
  const [refusé,  setRefusé]  = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session
      if (s && !EMAILS_AUTORISES.includes(s.user.email)) {
        supabase.auth.signOut()
        setRefusé(true)
        setSession(null)
      } else {
        setSession(s)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s && !EMAILS_AUTORISES.includes(s.user.email)) {
        supabase.auth.signOut()
        setRefusé(true)
        setSession(null)
      } else {
        setSession(s)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const selectUser = (name) => { setUser(name); setScreen('main') }
  const goGerant   = ()     => setScreen('pin')
  const goBack     = ()     => setScreen('accueil')
  const logout     = async () => { await supabase.auth.signOut(); setScreen('accueil') }

  if (session === undefined) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Chargement…</span>
      </div>
    )
  }

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

  return (
    <>
      {screen === 'accueil' && <Accueil onSelectUser={selectUser} onGerant={goGerant} onLogout={logout} />}
      {screen === 'pin'     && <PinLogin onSuccess={() => setScreen('gerant')} onBack={goBack} />}
      {screen === 'main'    && <Main user={user} onBack={goBack} />}
      {screen === 'gerant'  && <Gerant onBack={goBack} />}
    </>
  )
}
