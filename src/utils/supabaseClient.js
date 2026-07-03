import { createClient } from '@supabase/supabase-js'

// Remplace par ton URL et ta clé anon (legacy eyJ...)
const url = 'https://ntlynxxfuitokcrkajhm.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bHlueHhmdWl0b2tjcmthamhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MTk0NTUsImV4cCI6MjA5ODM5NTQ1NX0.VP9pturmpODN9Eko9D_ycxReaO37a9keW6FGJR0XfdQ' 

export const supabase = createClient(url, key, {
  auth: {
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: false,
  }
})
