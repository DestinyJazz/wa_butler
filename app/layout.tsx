'use client';

import { useEffect, useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const match = document.cookie.match(/(^| )user_id=([^;]+)/)
    setLoggedIn(!!match)
  }, [])

  return (
    <html lang="en">
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, sans-serif;
            -webkit-font-smoothing: antialiased;
            background-color: #0a0a0a;
          }
          a { color: inherit; text-decoration: none; }
          button { cursor: pointer; }
        `}</style>
      </head>

      <body style={{ margin: 0, padding: 0 }}>
        <header style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          padding: '20px 40px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <a href="/">
            <strong style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
              🧠 WhatsApp Butler
            </strong>
          </a>

          <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
            <a href="/" style={{ color: '#fff', fontSize: '15px', fontWeight: 500, opacity: 0.8 }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}>
              Home
            </a>

            <a href="https://www.notion.so/WhatsApp-Butler-2d5ef8799fc880df9a6af06a757c3745"
              target="_blank" rel="noopener noreferrer"
              style={{ color: '#fff', fontSize: '15px', fontWeight: 500, opacity: 0.8 }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}>
              Docs ↗
            </a>

            {loggedIn ? (
              // Logged in: show Dashboard + Logout
              <>
                <a href="/dashboard"
                  style={{ color: '#fff', fontSize: '15px', fontWeight: 500, opacity: 0.8 }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}>
                  Dashboard
                </a>
                <a href="/reconnect"
                  style={{ color: '#fff', fontSize: '15px', fontWeight: 500, opacity: 0.8 }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}>
                  Reconnect Calendar
                </a>
                <button
                  onClick={() => {
                    document.cookie = 'user_id=; path=/; max-age=0'
                    window.location.href = '/'
                  }}
                  style={{
                    padding: '9px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '100px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              // Not logged in: show Login + Signup
              <>
                <a href="/login">
                  <button style={{
                    padding: '9px 20px',
                    fontSize: '15px',
                    fontWeight: 600,
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '100px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  }}
                  >
                    Log In
                  </button>
                </a>

                <a href="/signup">
                  <button style={{
                    padding: '10px 24px',
                    fontSize: '15px',
                    fontWeight: 600,
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '100px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    Sign Up
                  </button>
                </a>
              </>
            )}
          </nav>
        </header>

        <main style={{ paddingTop: '80px' }}>{children}</main>
      </body>
    </html>
  );
}
