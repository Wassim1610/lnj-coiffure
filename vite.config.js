import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ⚠️ Si tu nommes ton dépôt GitHub différemment de "lnj-coiffure",
  // remplace la ligne ci-dessous par base: '/TON-NOM-DE-DEPOT/'
  base: '/lnj-coiffure/',
})
