import { useState } from 'react'
import Accueil   from './screens/Accueil.jsx'
import PinLogin  from './screens/PinLogin.jsx'
import Main      from './screens/Main.jsx'
import Gerant    from './screens/Gerant.jsx'

export default function App() {
  const [screen, setScreen] = useState('accueil')  // accueil | pin | main | gerant
  const [user,   setUser]   = useState(null)

  const selectUser = (name) => { setUser(name); setScreen('main') }
  const goGerant   = ()     => setScreen('pin')
  const goBack     = ()     => setScreen('accueil')

  return (
    <>
      {screen === 'accueil' && <Accueil onSelectUser={selectUser} onGerant={goGerant} />}
      {screen === 'pin'     && <PinLogin onSuccess={() => setScreen('gerant')} onBack={goBack} />}
      {screen === 'main'    && <Main user={user} onBack={goBack} />}
      {screen === 'gerant'  && <Gerant onBack={goBack} />}
    </>
  )
}
