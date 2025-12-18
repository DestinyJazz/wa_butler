'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleContinue = async () => {
    const { data, error } = await supabase.from('users').insert([{ name, phone }]).select()
    if (error) return alert(error.message)
    localStorage.setItem('user_id', data[0].id)
    window.location.href = '/api/google/oauth'
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2>Sign up</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />

      <label>WhatsApp Phone Number</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="60xxxxxxxx"
        style={{ width: '100%', padding: 8, marginBottom: 16 }}
      />

      <button style={{ padding: 10, width: '100%' }} onClick={handleContinue}>
        Continue & Connect Google Calendar
      </button>

      <hr style={{ margin: '24px 0' }} />

      <h3>Connect Google Calendar manually</h3>
      <p>We will only create reminder events you ask for.</p>

      <button
        style={{ padding: 10, width: '100%' }}
        onClick={() => { window.location.href = '/api/google/oauth' }}
      >
        Connect Google Calendar
      </button>
    </div>
  )
}
