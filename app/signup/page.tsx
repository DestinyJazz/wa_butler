'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!name || !phone) {
      alert('Please enter your name and WhatsApp number')
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          Name: name,
          Phone_number: phone,
        },
      ])
      .select()
      .single()

    setLoading(false)

    if (error) {
      console.error('Signup error:', error)
      alert(error.message)
      return
    }

    console.log('User created:', data)
    
    const userId = data.user_id
    
    if (!userId) {
      alert('Error: Could not get user ID')
      return
    }

    console.log('Setting cookie with user_id:', userId)

    // Get user's timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log('User timezone:', timezone)

    // Save user id AND timezone for OAuth callback
    document.cookie = `user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 7}`
    document.cookie = `user_timezone=${encodeURIComponent(timezone)}; path=/; max-age=${60 * 60 * 24 * 7}`

    // Redirect to Google OAuth
    window.location.href = '/api/google/oauth'
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '60px auto',
        padding: 24,
        border: '1px solid #eee',
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginBottom: 8 }}>Sign up</h2>
      <p style={{ marginBottom: 24, color: '#555' }}>
        Enter your details to connect WhatsApp with Google Calendar
      </p>

      <label style={{ display: 'block', marginBottom: 6 }}>Name</label>
      <input
        placeholder="e.g. John Tan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 16,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      />

      <label style={{ display: 'block', marginBottom: 6 }}>
        WhatsApp Phone Number
      </label>
      <input
        placeholder="60123456789"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: '100%',
          padding: 10,
          marginBottom: 24,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      />

      <button
        onClick={handleContinue}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Please wait…' : 'Continue & Connect Google Calendar'}
      </button>
    </div>
  )
}
