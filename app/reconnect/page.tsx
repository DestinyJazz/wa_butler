// app/reconnect/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ReconnectPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [userName, setUserName] = useState('')

  const handleVerify = async () => {
    if (!email || !phone) {
      setError('Please enter both email and phone number')
      return
    }

    setVerifying(true)
    setError('')

    try {
      // Query database to find user with matching email AND phone
      const { data, error: dbError } = await supabase
        .from('google_accounts')
        .select('user_id, email')
        .eq('email', email.trim())
        .maybeSingle()

      if (dbError) {
        console.error('Database error:', dbError)
        setError('Error verifying your information')
        setVerifying(false)
        return
      }

      if (!data) {
        setError('No account found with this email')
        setVerifying(false)
        return
      }

      // Now check if phone matches in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, Name, Phone_number')
        .eq('user_id', data.user_id)
        .eq('Phone_number', phone.trim())
        .maybeSingle()

      if (userError || !userData) {
        setError('No account found with this email and phone number combination')
        setVerifying(false)
        return
      }

      // User verified!
      setVerified(true)
      setUserId(userData.user_id)
      setUserName(userData.Name)
      setError('')

      // Set cookie for OAuth callback
      document.cookie = `user_id=${data.user_id}; path=/; max-age=3600`

    } catch (err: any) {
      console.error('Verification error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleReconnect = async () => {
    if (!userId) return

    setLoading(true)

    try {
      // Get user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      // Set cookies for OAuth callback
      document.cookie = `user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `user_timezone=${encodeURIComponent(timezone)}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `reconnecting=true; path=/; max-age=${60 * 5}`

      // Redirect to Google OAuth
      window.location.href = '/api/google/oauth'
    } catch (err: any) {
      console.error('Reconnect error:', err)
      setError('Failed to start reconnection. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: verified ? '40px' : '48px',
        background: 'white',
        color: '#333',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {!verified ? (
          // Step 1: Verification Form
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#333',
              }}>
                Reconnect Google Calendar
              </h1>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                Your connection has expired. Enter your details to reconnect.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Google Email
              </label>
              <input
                type="email"
                placeholder="e.g. john@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                WhatsApp Phone Number
              </label>
              <input
                type="tel"
                placeholder="60123456789"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  setError('')
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '20px',
                background: '#fee',
                border: '1px solid #e53e3e',
                borderRadius: '8px',
                color: '#e53e3e',
                fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={!email || !phone || verifying}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: (!email || !phone || verifying) 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: (!email || !phone || verifying) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (email && phone && !verifying) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {verifying ? 'Verifying...' : 'Continue'}
            </button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Don't have an account?
              </p>
              <a 
                href="/signup" 
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Sign up here →
              </a>
            </div>
          </>
        ) : (
          // Step 2: Verified - Ready to Reconnect
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                marginBottom: '8px',
                color: '#333',
              }}>
                Account Verified
              </h1>
              <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>
                Hi {userName}! 👋
              </p>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                Click below to reconnect your Google Calendar
              </p>
            </div>

            <div style={{
              padding: '16px',
              marginBottom: '24px',
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#059669',
            }}>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>✓ Verified</div>
              <div style={{ opacity: 0.9 }}>
                Email: {email}<br />
                Phone: {phone}
              </div>
            </div>

            <button
              onClick={handleReconnect}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '18px',
                fontWeight: '600',
                background: loading 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '16px',
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {loading ? 'Redirecting to Google...' : 'Reconnect Google Calendar'}
            </button>

            <button
              onClick={() => {
                setVerified(false)
                setEmail('')
                setPhone('')
                setError('')
              }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: 'transparent',
                color: '#666',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              ← Use different account
            </button>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#667eea',
            }}>
              <strong>What happens next?</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>You'll be redirected to Google</li>
                <li>Authorize access to your calendar</li>
                <li>Reminders will work again!</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
