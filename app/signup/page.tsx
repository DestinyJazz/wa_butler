'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { google } from 'googleapis'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleContinue = async () => {
    if (!name || !phone) {
      return alert('Please enter both name and phone number.')
    }

    try {
      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert([{ Name: name, Phone_number: phone }])
        .select()

      if (error) throw error
      if (!data || data.length === 0) throw new Error('Failed to create user.')

      const userId = data[0].id

      // Initialize Google OAuth2
      const oauth2Client = new google.auth.OAuth2(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        `${window.location.origin}/api/google/oauth/callback` // redirect URI
      )

      // Generate Google OAuth URL and pass Supabase user ID in 'state'
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events'],
        state: String(userId)
      })

      // Redirect user to Google OAuth
      window.location.href = authUrl
    } catch (err: any) {
      alert(err.message)
    }
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
    </div>
  )
}
