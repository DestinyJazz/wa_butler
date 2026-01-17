'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter your WhatsApp phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send code')
      }

      setStep('otp')
      setCountdown(60)
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      // Redirect to dashboard
      window.location.href = '/dashboard'

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setOtp('')
    setError('')
    handleSendOTP()
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
        padding: '48px',
        background: 'white',
        color: '#333',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {step === 'phone' ? '📱' : '🔐'}
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#333',
          }}>
            {step === 'phone' ? 'Welcome Back' : 'Verify Code'}
          </h1>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
            {step === 'phone' 
              ? 'Enter your WhatsApp number to receive a login code'
              : `We sent a 6-digit code to ${phone}`
            }
          </p>
        </div>

        {step === 'phone' ? (
          <>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
              onClick={handleSendOTP}
              disabled={!phone || loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: (!phone || loading)
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: (!phone || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (phone && !loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {loading ? 'Sending...' : 'Send Code'}
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
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333'
              }}>
                Verification Code
              </label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                maxLength={6}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''))
                  setError('')
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontWeight: '600',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                autoFocus
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px', textAlign: 'center' }}>
                Check your WhatsApp for the code
              </p>
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
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: (otp.length !== 6 || loading)
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: (otp.length !== 6 || loading) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginBottom: '12px',
              }}
              onMouseOver={(e) => {
                if (otp.length === 6 && !loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              onClick={() => setStep('phone')}
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
                marginBottom: '16px',
              }}
            >
              ← Change phone number
            </button>

            <div style={{ textAlign: 'center' }}>
              {countdown > 0 ? (
                <p style={{ fontSize: '14px', color: '#999' }}>
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Resend code
                </button>
              )}
            </div>
          </>
        )}

        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: 'rgba(102, 126, 234, 0.1)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#667eea',
          lineHeight: '1.6',
        }}>
          <strong>🔒 Secure Login</strong>
          <br />
          We'll send a one-time code to your WhatsApp. This code expires in 5 minutes.
        </div>
      </div>
    </div>
  )
}
